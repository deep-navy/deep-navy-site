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
  assert.match(client, /githubRepositoryId: int64Field\(payload\.githubRepositoryId, "githubRepositoryId", false\)/);
  assert.doesNotMatch(app + client, /api\.github\.com/);
});

test("delivery records are selectable per authorized repository and independently paginated", () => {
  assert.match(shell, /data-delivery-repository/);
  assert.match(shell, /data-issues-more/);
  assert.match(shell, /data-pull-requests-more/);
  assert.match(app, /repository\?\.selectedForTeams !== true/);
  assert.match(app, /organizationId !== session\.organizationId/);
  assert.match(app, /apiRequest\("github_issues", \{ organizationId: session\.organizationId, teamId/);
  assert.match(app, /apiRequest\("github_pull_requests", \{ organizationId: session\.organizationId, teamId/);
  assert.match(app, /GitHubDeliveryService returned a repeated issue cursor/);
  assert.match(app, /GitHubDeliveryService returned a repeated pull-request cursor/);
  assert.match(app, /ui\.deliveryRepository\.addEventListener\("change", reloadGitHubDelivery\)/);
});

test("issue and pull-request rows reject invalid scope, order, and typed states", () => {
  assert.match(app, /repositoryId\.toString\(\) !== repository\.id/);
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
  assert.doesNotMatch(app, /github\.com\/\$\{|`https:\/\/github\.com/);
});

