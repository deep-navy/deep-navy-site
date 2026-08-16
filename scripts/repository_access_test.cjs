"use strict";

// "Add repositories on GitHub" used to call startGitHubInstallation — the
// INSTALL flow. Someone who had already installed the app and only wanted to
// widen the grant was sent back through an installation they had completed,
// which either no-ops or reads as "did I break something?". The repository
// grant is not changed by installing again; it is changed on the
// installation's own settings page on GitHub.
//
// So the affordance is a real link to that page, org-aware, in a new tab. And
// because the change happens over there, returning here must not require a
// manual reload: leaving through that link is recorded, and coming back
// refetches the accessible repositories.
//
// GitHub itself names that page — installation.html_url, carried on every
// installation-bearing response and inside every webhook's installation
// object — and the platform now forwards it as manage_url. That value is
// authoritative; our org-aware construction is only the fallback.
//
// What must NOT regress:
//   - the link is an <a> with a real href, never a button running the install
//     flow, and never preventDefault'd (the navigation IS the affordance);
//   - a supplied manage_url wins over construction, and is host-validated like
//     every other outbound handoff before it reaches the customer's click;
//   - with nothing supplied, the href names THIS installation (org-owned under
//     the organization, personal under the account) and falls back to a
//     constant, never to a half-built URL;
//   - the same affordance and an explicit refresh exist in Settings, OUTSIDE
//     the fieldset that hides when the list fails to load;
//   - the copy stays true for someone GitHub will only let REQUEST the change;
//   - the refetch on return fires only after a real departure, so an ordinary
//     tab switch costs nothing.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

function slice(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

// ── The real thing, executed ───────────────────────────────────────────────
// The URL builder is where this feature is actually right or wrong (org vs
// account, a bigint id, a login that is not a login), so run the shipped
// source rather than pattern-matching it.
function loadUrlBuilder() {
  const source = [
    slice("  function stringValue(value) {", "  // Chips carry concrete data"),
    slice("  function validatedRedirect(value, requiredHosts) {", "  const REQUEST_TEAM_SETTLEMENT"),
    slice("  const githubInstallationsUrl =", "  // Both manage-access links")
  ].join("\n");
  const context = { URL, session: { githubInstallation: null }, exports: {} };
  vm.createContext(context);
  vm.runInContext(
    `${source}\nexports.url = githubInstallationSettingsUrl; exports.constant = githubInstallationsUrl;`,
    context
  );
  return { context, ...context.exports };
}

test("the deep link names the installation: org-owned under the org, personal under the account", () => {
  const { context, url, constant } = loadUrlBuilder();

  context.session.githubInstallation = { id: 42n, accountLogin: "acme-eng", accountType: "Organization" };
  assert.equal(url(), "https://github.com/organizations/acme-eng/settings/installations/42");

  // A personal installation has no organization settings page.
  context.session.githubInstallation = { id: 42n, accountLogin: "ada", accountType: "User" };
  assert.equal(url(), "https://github.com/settings/installations/42");

  // int64 ids arrive as bigint over the wire; a string id must behave the same.
  context.session.githubInstallation = { id: "987654321", accountLogin: "acme-eng", accountType: "Organization" };
  assert.equal(url(), "https://github.com/organizations/acme-eng/settings/installations/987654321");

  // Snake-case account_login is tolerated exactly as the rest of app.js does.
  context.session.githubInstallation = { id: 7n, account_login: "acme-eng", accountType: "organization" };
  assert.equal(url(), "https://github.com/organizations/acme-eng/settings/installations/7");

  assert.equal(constant, "https://github.com/settings/installations");
});

test("anything unconfirmed or malformed falls back to the constant, never to a half-built URL", () => {
  const { context, url, constant } = loadUrlBuilder();

  // No installation confirmed yet — the link still has to go somewhere real.
  context.session.githubInstallation = null;
  assert.equal(url(), constant);

  for (const id of [0n, "0", "", "12x", "abc", null, undefined, -1, {}]) {
    context.session.githubInstallation = { id, accountLogin: "acme", accountType: "Organization" };
    assert.equal(url(), constant, `id ${String(id)} must not produce a per-installation URL`);
  }

  // A login that is not a GitHub login never becomes a path segment: it
  // degrades to the account-scoped URL, which carries no customer data.
  for (const login of ["../../attacker", "acme/evil", "a b", "acme?x=1", "acme#f", ""]) {
    context.session.githubInstallation = { id: 5n, accountLogin: login, accountType: "Organization" };
    assert.equal(
      url(),
      "https://github.com/settings/installations/5",
      `login ${JSON.stringify(login)} must not reach the path`
    );
  }

  // Every produced URL is https and on github.com, whatever the input.
  for (const accountType of ["Organization", "User", "", "Bot"]) {
    context.session.githubInstallation = { id: 11n, accountLogin: "acme", accountType };
    const produced = new URL(url());
    assert.equal(produced.protocol, "https:");
    assert.equal(produced.hostname, "github.com");
  }
});

// ── GitHub names the page; we only guess at it ─────────────────────────────
// The App cannot move the grant itself (adding or removing a repository on an
// installation needs a classic PAT), so this URL is the entire trip out. The
// platform now forwards GitHub's own installation.html_url as manage_url, and
// that value is authoritative: GitHub owns the shape, it differs between a
// user account and an organization, and it has changed before. Construction
// stays as the fallback for an installation confirmed before the field
// existed — it must never override what GitHub already told us.

test("GitHub's own manage URL wins over anything we would have built", () => {
  const { context, url } = loadUrlBuilder();
  const named = "https://github.com/organizations/IamGoodBad/settings/installations/147931957";

  context.session.githubInstallation = {
    id: 147931957n,
    accountLogin: "IamGoodBad",
    accountType: "Organization",
    manageUrl: named
  };
  assert.equal(url(), named);

  // It wins even where construction would have produced something else, which
  // is the whole point: a personal-looking account type no longer downgrades a
  // URL GitHub has already named.
  context.session.githubInstallation = { id: 42n, accountLogin: "acme-eng", accountType: "User", manageUrl: named };
  assert.equal(url(), named);

  // And it wins where construction could produce nothing at all: an id we
  // refuse to trust, or a login that could never reach a path.
  for (const broken of [{ id: "12x" }, { id: 0n }, { accountLogin: "../../attacker" }, {}]) {
    context.session.githubInstallation = { accountType: "Organization", ...broken, manageUrl: named };
    assert.equal(url(), named, `a supplied URL must survive ${JSON.stringify(Object.keys(broken))}`);
  }

  // Snake-case is tolerated exactly as account_login already is.
  context.session.githubInstallation = { id: 7n, accountLogin: "acme-eng", accountType: "Organization", manage_url: named };
  assert.equal(url(), named);
});

test("a supplied URL is still an outbound handoff: untrusted ones fall back, never through", () => {
  const { context, url, constant } = loadUrlBuilder();
  const constructed = "https://github.com/organizations/acme-eng/settings/installations/42";

  // Anything that is not an https github.com URL is discarded and we fall back
  // to construction — the customer never clicks an unvetted destination.
  for (const hostile of [
    "http://github.com/organizations/acme-eng/settings/installations/42",
    "https://github.com.evil.example/organizations/acme-eng/settings/installations/42",
    "https://evil.example/organizations/acme-eng/settings/installations/42",
    "javascript:alert(1)",
    "https://user:pass@github.com/settings/installations/42",
    "https://github.com/settings/installations/42#f",
    "//github.com/settings/installations/42",
    "not a url",
    ""
  ]) {
    context.session.githubInstallation = { id: 42n, accountLogin: "acme-eng", accountType: "Organization", manageUrl: hostile };
    assert.equal(url(), constructed, `${JSON.stringify(hostile)} must not reach the customer's click`);
  }

  // A non-string never becomes a destination either.
  for (const hostile of [null, undefined, 42, {}, ["https://github.com/x"]]) {
    context.session.githubInstallation = { id: 42n, accountLogin: "acme-eng", accountType: "Organization", manageUrl: hostile };
    assert.equal(url(), constructed);
  }

  // With nothing supplied and nothing constructible, still a real page.
  context.session.githubInstallation = { id: "12x", manageUrl: "https://evil.example/x" };
  assert.equal(url(), constant);
});

// The two anchors live in different places — one inside the create form, one
// in a Settings card — and they are rendered by one function precisely so they
// cannot drift apart. Run that function rather than trusting two assignments
// that happen to sit next to each other in the source.
function loadManageLinkRenderer() {
  const source = [
    slice("  function stringValue(value) {", "  // Chips carry concrete data"),
    slice("  function validatedRedirect(value, requiredHosts) {", "  const REQUEST_TEAM_SETTLEMENT"),
    slice("  const githubInstallationsUrl =", "\n  function setGitHubInstallation")
  ].join("\n");
  const ui = { repositoryManageAccess: { href: "" }, settingsRepositoryManageAccess: { href: "" } };
  const context = { URL, ui, session: { githubInstallation: null }, exports: {} };
  vm.createContext(context);
  vm.runInContext(`${source}\nexports.render = renderRepositoryManageLinks;`, context);
  return { context, ui, render: context.exports.render };
}

test("both doors open on the same page: the create picker and Settings never drift", () => {
  const { context, ui, render } = loadManageLinkRenderer();
  const named = "https://github.com/organizations/IamGoodBad/settings/installations/147931957";

  // Before anything is confirmed, both already point somewhere real.
  render();
  assert.equal(ui.repositoryManageAccess.href, "https://github.com/settings/installations");
  assert.equal(ui.settingsRepositoryManageAccess.href, ui.repositoryManageAccess.href);

  // A confirmed installation moves BOTH to the URL GitHub named.
  context.session.githubInstallation = { id: 147931957n, accountLogin: "IamGoodBad", accountType: "Organization", manageUrl: named };
  render();
  assert.equal(ui.repositoryManageAccess.href, named);
  assert.equal(ui.settingsRepositoryManageAccess.href, named);

  // Losing the installation moves BOTH back; neither keeps a stale destination.
  context.session.githubInstallation = null;
  render();
  assert.equal(ui.repositoryManageAccess.href, "https://github.com/settings/installations");
  assert.equal(ui.settingsRepositoryManageAccess.href, "https://github.com/settings/installations");

  // A page that renders only one of them still works — Settings is a separate
  // view and its anchor is absent while the create form is on screen.
  const partial = loadManageLinkRenderer();
  partial.context.session.githubInstallation = { id: 42n, accountLogin: "acme-eng", accountType: "Organization" };
  partial.ui.settingsRepositoryManageAccess = null;
  assert.doesNotThrow(() => partial.render());
  assert.equal(partial.ui.repositoryManageAccess.href, "https://github.com/organizations/acme-eng/settings/installations/42");
});

test("manage_url survives the wire: the vendored descriptor really carries it", () => {
  // The field is worthless to this app unless the generated code decodes it,
  // so prove the round trip through the bundle the browser actually loads
  // rather than trusting that a vendor refresh happened.
  const generated = Function(`${readFileSync("assets/js/platform-api-client.js", "utf8")}\nreturn deepNavyGeneratedClient;`)();
  const named = "https://github.com/organizations/IamGoodBad/settings/installations/147931957";
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => new Response(
      JSON.stringify({ installation: { id: "147931957", organizationId: "org_1", accountLogin: "IamGoodBad", accountType: "Organization", manage_url: named } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  });
  return api
    .request("github_installation", { organizationId: "org_1" }, { accessToken: "t", requestId: "r" })
    .then((response) => {
      assert.equal(response.installation.manageUrl, named);
      // And the app's own reader accepts exactly that shape.
      const { context, url } = loadUrlBuilder();
      context.session.githubInstallation = response.installation;
      assert.equal(url(), named);
    });
});

// The return path is the other half that can silently be wrong: a gate that
// never opens leaves the customer reloading by hand, and a gate that never
// closes turns every tab switch into a request. Run it.
function loadReturnPath() {
  const source = [
    slice("  function markGitHubAccessDeparture() {", "\n  function resetRepositoryAccess")
  ].join("\n");
  const calls = { refresh: 0 };
  const context = {
    Date,
    Promise,
    session: { githubAccessDepartedAt: 0, accessToken: "t", organizationId: "org_1", githubInstalled: true },
    refreshRepositoryAccess: async () => { calls.refresh += 1; },
    exports: {}
  };
  vm.createContext(context);
  vm.runInContext(
    `${source}\nexports.depart = markGitHubAccessDeparture; exports.ret = refreshRepositoryAccessAfterReturn;`,
    context
  );
  return { context, calls, ...context.exports };
}

test("an ordinary tab switch costs nothing; a real departure refetches exactly once", () => {
  const { context, calls, depart, ret } = loadReturnPath();

  // Never left for GitHub: returning to the tab must not spend a request.
  ret();
  ret();
  assert.equal(calls.refresh, 0, "no departure means no refetch");

  // Left for GitHub, came back: one refetch.
  depart();
  assert.ok(context.session.githubAccessDepartedAt > 0, "the departure is recorded");
  ret();
  assert.equal(calls.refresh, 1);

  // visibilitychange and focus both fire on the same return — still one.
  ret();
  assert.equal(calls.refresh, 1, "the departure mark is consumed, not re-fired");
  assert.equal(context.session.githubAccessDepartedAt, 0);

  // A second trip out and back refetches again.
  depart();
  ret();
  assert.equal(calls.refresh, 2);
});

test("the refetch never runs without a session, an organization, and an installation", () => {
  for (const missing of ["accessToken", "organizationId", "githubInstalled"]) {
    const { context, calls, depart, ret } = loadReturnPath();
    depart();
    context.session[missing] = missing === "githubInstalled" ? false : "";
    ret();
    assert.equal(calls.refresh, 0, `a missing ${missing} must not trigger a refetch`);
    // The departure survives, so the refetch still happens once the session is
    // whole again rather than being silently swallowed.
    assert.ok(context.session.githubAccessDepartedAt > 0, `a missing ${missing} must not discard the departure`);
  }
});

test("a failing refetch never breaks the return to the app", () => {
  const source = slice("  function markGitHubAccessDeparture() {", "\n  function resetRepositoryAccess");
  const context = {
    Date,
    Promise,
    session: { githubAccessDepartedAt: 0, accessToken: "t", organizationId: "org_1", githubInstalled: true },
    refreshRepositoryAccess: async () => { throw new Error("repository service down"); },
    exports: {}
  };
  vm.createContext(context);
  vm.runInContext(`${source}\nexports.depart = markGitHubAccessDeparture; exports.ret = refreshRepositoryAccessAfterReturn;`, context);
  context.exports.depart();
  assert.doesNotThrow(() => context.exports.ret(), "a rejected refetch must not propagate out of the event handler");
});

// ── The affordance in the markup ───────────────────────────────────────────

test("the create picker's manage-access affordance is a real link, not the install flow", () => {
  const line = shell.match(/<p class="form-help form-help-neutral repo-access-line">[\s\S]*?<\/p>/);
  assert.ok(line, "the repo access line must exist beside the picker");
  // An anchor with a real destination, opened in a new tab, with the tab-nabbing
  // protections that come with target=_blank.
  assert.match(line[0], /<a class="button-link" data-repository-manage-access href="https:\/\/github\.com\/settings\/installations" target="_blank" rel="noopener noreferrer">/);
  // Not a button any more, and specifically not one running the install flow.
  assert.doesNotMatch(line[0], /<button[^>]*data-repository-manage-access/);
  assert.doesNotMatch(app, /repositoryManageAccess\.addEventListener\("click", startGitHubInstallation\)/);
  // It stays inline in the sentence beside the picker.
  assert.match(line[0], /button-link/);
  const teamForm = shell.match(/<form class="team-form" data-team-form>[\s\S]*?<\/form>/);
  assert.ok(teamForm && teamForm[0].includes("data-repository-manage-access"), "the affordance stays inside the create form");
  // And the explicit refresh control sits in the same sentence.
  assert.match(line[0], /<button class="button-link" type="button" data-repository-refresh-inline>/);
});

test("Settings carries the same affordance, outside the fieldset that hides on failure", () => {
  const start = shell.indexOf("data-repo-settings");
  const card = shell.slice(shell.lastIndexOf("<article", start), shell.indexOf("</article>", start));
  assert.match(card, /<a class="button-link" data-settings-repository-manage-access href="https:\/\/github\.com\/settings\/installations" target="_blank" rel="noopener noreferrer">/);
  assert.match(card, /<button class="button-link" type="button" data-settings-repository-refresh>/);
  // The fieldset is hidden exactly when the list did not load, which is when
  // the way out to GitHub and the way to retry are most needed — so they must
  // sit after it closes, not inside it.
  const fieldsetEnd = card.indexOf("</fieldset>");
  assert.notEqual(fieldsetEnd, -1, "the settings checklist fieldset must exist");
  assert.ok(card.indexOf("data-settings-repository-manage-access") > fieldsetEnd, "the link must outlive the hidden fieldset");
  assert.ok(card.indexOf("data-settings-repository-refresh") > fieldsetEnd, "the refresh must outlive the hidden fieldset");
  // One renderer keeps both links pointed at the same confirmed installation.
  assert.match(app, /if \(ui\.repositoryManageAccess\) ui\.repositoryManageAccess\.href = destination;/);
  assert.match(app, /if \(ui\.settingsRepositoryManageAccess\) ui\.settingsRepositoryManageAccess\.href = destination;/);
});

test("the copy names what the customer controls and carries no internal vocabulary", () => {
  const lines = shell.match(/<p class="form-help form-help-neutral repo-access-line">[\s\S]*?<\/p>/g);
  assert.equal(lines.length, 2, "both the create picker and Settings carry the line");
  for (const line of lines) {
    // Guidance, in the customer's terms: what they control, and where.
    assert.match(line, /You choose which repositories deep navy can reach\./);
    assert.match(line, />Choose repositories on GitHub</);
    // Judge the words the customer actually reads — attributes and hrefs are
    // machinery by definition and are not on screen.
    const spoken = line.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    // Not an apology, and not a limitation report.
    assert.doesNotMatch(spoken, /Only repositories/i);
    assert.doesNotMatch(spoken, /sorry|unfortunately|cannot|can't/i);
    // No internal machinery on screen.
    assert.doesNotMatch(spoken, /installation|GitHub App|grant|scope|OAuth|token|API|service/i);
    // It opens by naming the customer's own control, not our constraint.
    assert.match(spoken, /^You choose/);

    // A member who does not own the GitHub account is only offered a REQUEST
    // over there — GitHub will not let them change the grant. The app cannot
    // tell which they are: the deep navy membership role (owner/admin/member)
    // is OUR role and says nothing about who administers the GitHub account,
    // and nothing in the API reports the signed-in person's GitHub
    // permissions. So the sentence has to be true either way rather than
    // promising a change they may not be able to make.
    assert.match(spoken, /if you are not an owner of that account, GitHub will ask an owner to approve your choice\./);
    // "owner" stays pinned to the GitHub account. Left bare it reads as a deep
    // navy role, which is the exact confusion this clause exists to avoid.
    assert.doesNotMatch(spoken, /not an owner(?! of that account)/);
    // And it never claims the change simply happens.
    assert.doesNotMatch(spoken, /immediately|instantly|right away|straight away/i);
  }
});

// ── Why returning to the tab is the ceiling ────────────────────────────────
// GitHub does tell the platform: installation_repositories is delivered to the
// App the moment the grant changes, and cannot be unsubscribed from. But
// nothing carries that to this page. Every live stream this client has is
// scoped to ONE team, and the repository grant belongs to the organization's
// installation, which no team owns. There is no organization-scoped stream to
// listen on, so a poll would be spending requests to fake a liveness we do not
// have — returning to the tab is the honest signal, because it is the exact
// moment the stale list is about to be read.
//
// This test is the tripwire on that reasoning: if an organization-scoped
// stream ever ships, it fails, and the focus refetch should be REPLACED by
// that stream rather than left running beside it.

test("no stream carries a grant change, so returning to the tab stays the ceiling", () => {
  const generated = Function(`${readFileSync("assets/js/platform-api-client.js", "utf8")}\nreturn deepNavyGeneratedClient;`)();
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { throw new Error("not called"); }
  });
  const streams = Object.keys(api).filter((name) => name.startsWith("stream")).sort();
  assert.deepEqual(streams, ["streamProvisioningStatus", "streamTeamActivity", "streamTeamConversation"]);

  // Named team-scoped is not the same as being team-scoped. Each one sends a
  // teamId, which is what makes it unable to carry an organization's grant.
  const client = readFileSync("src/platform-api-client.ts", "utf8");
  for (const name of streams) {
    const start = client.indexOf(`async function* ${name}(`);
    assert.notEqual(start, -1, `${name} must exist in the client source`);
    const end = client.indexOf("\n  async function", start + 1);
    const body = client.slice(start, end === -1 ? client.indexOf("\n  return Object.freeze(", start) : end);
    assert.match(body, /teamId: textField\(payload, "teamId"\)/, `${name} must be scoped to one team`);
  }

  // Nothing organization- or installation-scoped is streamed, and no poller
  // was quietly added to paper over the gap.
  assert.doesNotMatch(app, /setInterval\([^)]*refreshRepositoryAccess/);
  assert.doesNotMatch(app, /refreshRepositoryAccess[^)]*\bsetInterval\b/);
});

// ── Coming back from GitHub ────────────────────────────────────────────────

test("leaving through the link is recorded, and never blocks the navigation", () => {
  // The handlers only mark the departure; nothing here may cancel the click.
  assert.match(app, /if \(ui\.repositoryManageAccess\) ui\.repositoryManageAccess\.addEventListener\("click", markGitHubAccessDeparture\);/);
  assert.match(app, /if \(ui\.settingsRepositoryManageAccess\) ui\.settingsRepositoryManageAccess\.addEventListener\("click", markGitHubAccessDeparture\);/);
  const mark = slice("  function markGitHubAccessDeparture() {", "  function refreshRepositoryAccessAfterReturn");
  assert.doesNotMatch(mark, /preventDefault/);
  assert.match(mark, /session\.githubAccessDepartedAt = Date\.now\(\);/);
});

test("returning refetches the repositories without a manual reload", () => {
  // Visibility covers the ordinary new-tab round trip; focus covers the
  // second-window case where this tab never becomes hidden.
  const visibility = slice('  document.addEventListener("visibilitychange", () => {', "  window.addEventListener");
  assert.match(visibility, /if \(document\.visibilityState !== "visible"\) return;/);
  assert.match(visibility, /refreshRepositoryAccessAfterReturn\(\);/);
  assert.match(app, /window\.addEventListener\("focus", refreshRepositoryAccessAfterReturn\);/);

  const refetch = slice("  function refreshRepositoryAccessAfterReturn() {", "\n  function resetRepositoryAccess");
  // Only a real departure spends a request: an ordinary tab switch is free.
  assert.match(refetch, /if \(!session\.githubAccessDepartedAt\) return;/);
  // Nothing is attempted without a session, an organization, and an install.
  assert.match(refetch, /if \(!session\.accessToken \|\| !session\.organizationId \|\| !session\.githubInstalled\) return;/);
  // The mark is cleared BEFORE the async call, so a focus and a
  // visibilitychange arriving together cannot both fire the refetch.
  const cleared = refetch.indexOf("session.githubAccessDepartedAt = 0;");
  const called = refetch.indexOf("refreshRepositoryAccess()");
  assert.ok(cleared !== -1 && cleared < called, "the departure mark clears before the refetch is started");
  // A rejection must never break the return to the app.
  assert.match(refetch, /\.catch\(\(\) => \{/);
  // The explicit refresh controls remain, in both places.
  assert.match(app, /if \(ui\.repositoryRefreshInline\) ui\.repositoryRefreshInline\.addEventListener\("click", refreshRepositoryAccess\);/);
  assert.match(app, /if \(ui\.settingsRepositoryRefresh\) ui\.settingsRepositoryRefresh\.addEventListener\("click", refreshRepositoryAccess\);/);
});

test("the link's destination tracks only an active, in-scope installation", () => {
  // Out-of-scope response, inactive installation, and a failed read all clear
  // it, so the link can never point at a stale or foreign installation.
  assert.match(app, /session\.githubInstalled = false;\n        setGitHubInstallation\(null\);/);
  assert.match(app, /setGitHubInstallation\(session\.githubInstalled \? installation : null\)/);
  assert.match(app, /session\.githubInstalled = false;\n    setGitHubInstallation\(null\);/);
  // A freshly completed installation updates it without waiting for a refresh.
  assert.match(app, /session\.githubInstalled = true;\n      setGitHubInstallation\(result\.installation\);/);
  const setter = slice("  function setGitHubInstallation(installation) {", "\n  // The grant changes in another tab");
  assert.match(setter, /session\.githubInstallation = installation \|\| null;/);
  assert.match(setter, /renderRepositoryManageLinks\(\);/);
});
