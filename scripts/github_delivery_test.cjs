"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

test("the customer dashboard calls the frozen local GitHub delivery projection", () => {
  assert.match(client, /import \{ GitHubDeliveryService \}/);
  assert.match(client, /githubDelivery\.listGitHubIssues/);
  assert.match(client, /githubDelivery\.listGitHubPullRequests/);
  assert.match(client, /organizationId: textField\(payload, "organizationId"\)/);
  assert.match(client, /teamId: textField\(payload, "teamId"\)/);
  // platform-protos 350acd91 made the repository filter optional and documented
  // zero as "the team's whole grant". Before that the server required an id of
  // at least one while this bridge sent zero, so both delivery reads were being
  // rejected outright — pinning the old positive-only shape was pinning a bug.
  assert.match(client, /githubRepositoryId: int64Field\(payload\.githubRepositoryId \?\? 0, "githubRepositoryId"\)/);
  assert.doesNotMatch(client, /githubRepositoryId: int64Field\(payload\.githubRepositoryId, "githubRepositoryId", false\)/);
  assert.doesNotMatch(app + client, /api\.github\.com/);
});

test("delivery records are selectable per authorized repository and independently paginated", () => {
  assert.match(shell, /data-delivery-repository/);
  assert.match(shell, /data-issues-more/);
  assert.match(shell, /data-pull-requests-more/);
  // The list a customer can narrow to is the SELECTED TEAM's own grant, from
  // ListTeamRepositories — not the organization's selection projection. The
  // two are different sets: a team may still hold a repository the
  // organization has since deselected, and filtering the team's list by
  // `selectedForTeams` hid exactly that repository, which is the one case
  // where a misconfigured team most needs to look misconfigured. The pin that
  // used to sit here asserted that filter, so it is replaced by a pin on the
  // grant being the source and on the org projection NOT being it.
  assert.match(app, /for \(const repository of \(session\.teamRepositories \|\| \[\]\)\)/);
  assert.match(app, /function deliveryRepositories\(\)[\s\S]{0,400}session\.teamRepositories/);
  assert.doesNotMatch(app, /function deliveryRepositories\(\)[\s\S]{0,400}selectedForTeams/);
  assert.match(app, /apiRequest\("team_repositories", \{ teamId/);
  assert.match(app, /organizationId !== session\.organizationId/);
  assert.match(app, /apiRequest\("github_issues", \{ organizationId: session\.organizationId, teamId/);
  assert.match(app, /apiRequest\("github_pull_requests", \{ organizationId: session\.organizationId, teamId/);
  assert.match(app, /GitHubDeliveryService returned a repeated issue cursor/);
  assert.match(app, /GitHubDeliveryService returned a repeated pull-request cursor/);
  assert.match(app, /ui\.deliveryRepository\.addEventListener\("change", reloadGitHubDelivery\)/);
});

test("issue and pull-request rows reject invalid scope, order, and typed states", () => {
  // Scope, not equality. A read is now answered in the team's WHOLE grant by
  // default, so "the record's repository is the one repository we asked for"
  // stopped being expressible — but the invariant behind it did not change
  // and is not weakened: every record must name a repository inside the scope
  // the read was made in, and one that does not is rejected outright rather
  // than rendered. A single-repository scope holds exactly one entry, so the
  // narrowed case still enforces precisely what the old equality did.
  assert.match(app, /const repository = repositoryId === null \? null : scope\.repositories\.get\(repositoryId\.toString\(\)\) \|\| null;/);
  assert.match(app, /if \(!repository\) throw new ApiError\("GitHubDeliveryService returned a record outside the team's granted repositories"/);
  assert.doesNotMatch(app, /repositoryId\.toString\(\) !== repository\.id/,
    "the per-record repository equality is superseded by the scope membership check, not dropped");
  assert.match(app, /function validDeliverySort/);
  assert.match(app, /current\.createdAt < previous\.createdAt/);
  assert.match(app, /GIT_HUB_ISSUE_STATE_DELETED/);
  assert.match(app, /GIT_HUB_PULL_REQUEST_STATE_MERGED/);
  assert.match(app, /state === "merged" && !mergedAt/);
  assert.match(app, /GitHubDeliveryService returned an invalid issue projection/);
  assert.match(app, /GitHubDeliveryService returned an invalid pull-request projection/);
});

test("external links use only the server-returned exact GitHub artifact URL", () => {
  assert.match(app, /function exactGitHubDeliveryUrl/);
  assert.match(app, /url\.hostname !== "github\.com"/);
  assert.match(app, /url\.pathname !== expectedPath/);
  assert.match(app, /return value;/);
  assert.match(app, /link\.href = entry\.artifactUrl/);
  assert.match(app, /link\.target = "_blank"/);
  assert.match(app, /link\.rel = "noopener noreferrer"/);
  assert.match(app, /link\.referrerPolicy = "no-referrer"/);
  // The blanket ban below is what stops the app fabricating a github.com URL
  // out of projection data. Exactly one construction is exempt, and it is
  // exempt BY EXACT TEXT: the installation settings deep link. Edit that
  // builder in any way and this pin stops matching, the source is no longer
  // stripped, and the ban fires again — which is the whole point of pinning
  // it here rather than loosening the regex.
  //
  // What makes that one construction safe: the id is a validated decimal
  // int64, the login is checked against GitHub's login grammar before it is
  // interpolated as a path segment (anything else falls back to the
  // account-scoped URL, which carries no customer data at all), and the
  // finished string is host-pinned through validatedRedirect with a constant
  // fallback. No projection text reaches the URL unchecked.
  const auditedGitHubUrlBuilders = [
    "const candidate = organization && /^[A-Za-z0-9-]{1,39}$/.test(login)\n" +
    "      ? `https://github.com/organizations/${login}/settings/installations/${id}`\n" +
    "      : `https://github.com/settings/installations/${id}`;"
  ];
  let unaudited = app;
  for (const snippet of auditedGitHubUrlBuilders) {
    assert.ok(
      unaudited.includes(snippet),
      "the audited installation-settings URL builder no longer matches its pin in this test. " +
      "If you changed it deliberately, re-audit the validation around it and update the pin; " +
      "do not delete the pin to make this pass."
    );
    unaudited = unaudited.replace(snippet, "");
  }
  assert.doesNotMatch(unaudited, /github\.com\/\$\{|`https:\/\/github\.com/);
});

test("the installation settings deep link is validated before it is ever offered", () => {
  // The id is a decimal int64 and nothing else.
  assert.match(app, /function githubInstallationIdentifier\(installation\)/);
  assert.match(app, /\/\^\[1-9\]\[0-9\]\{0,18\}\$\/\.test\(raw\)/);
  // No confirmed installation means no fabricated per-installation URL: the
  // link falls back to a constant that is valid for whoever is signed in.
  assert.match(app, /const githubInstallationsUrl = "https:\/\/github\.com\/settings\/installations";/);
  assert.match(app, /if \(!id\) return githubInstallationsUrl;/);
  // Host-pinned through the same helper every other outbound handoff uses,
  // with the constant as the failure value.
  assert.match(app, /return validatedRedirect\(candidate, \["github\.com"\]\) \|\| githubInstallationsUrl;/);
  // Only an ACTIVE, in-scope installation is ever the link's source.
  assert.match(app, /setGitHubInstallation\(session\.githubInstalled \? installation : null\)/);
});

