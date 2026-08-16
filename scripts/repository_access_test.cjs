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
// What must NOT regress:
//   - the link is an <a> with a real href, never a button running the install
//     flow, and never preventDefault'd (the navigation IS the affordance);
//   - the href names THIS installation (org-owned under the organization,
//     personal under the account) and falls back to a constant, never to a
//     half-built URL;
//   - the same affordance and an explicit refresh exist in Settings, OUTSIDE
//     the fieldset that hides when the list fails to load;
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
  }
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
