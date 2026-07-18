"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

test("the customer workspace calls the frozen session and workspace services", () => {
  assert.match(client, /import \{ SessionService \}/);
  assert.match(client, /import \{ WorkspaceService \}/);
  assert.match(client, /case "sessions":/);
  assert.match(client, /sessionHistory\.listSessions/);
  assert.match(client, /case "workspace_changes":/);
  assert.match(client, /workspaceHistory\.listWorkspaceChanges/);
  assert.match(client, /afterSequence: int64Field\(payload\.afterSequence \?\? 0/);
  assert.match(app, /apiRequest\("sessions", \{ teamId: team\.id, page: \{ pageSize: 100 \} \}\)/);
  assert.match(app, /apiRequest\("workspace_changes", \{ teamId: team\.id, afterSequence: "0", page: \{ pageSize: 100 \} \}\)/);
});

test("snapshot pages preserve opaque cursors and expose explicit continuation controls", () => {
  assert.match(shell, /data-session-history-state/);
  assert.match(shell, /data-sessions-more/);
  assert.match(shell, /data-workspace-history-state/);
  assert.match(shell, /data-workspace-more/);
  assert.match(app, /function opaquePageToken/);
  assert.match(app, /return value;\n  \}/);
  assert.match(app, /SessionService returned a repeated page cursor/);
  assert.match(app, /WorkspaceService returned a repeated page cursor/);
  assert.match(app, /page: \{ pageSize: 100, pageToken \}/);
  assert.match(app, /ui\.sessionsMore\.addEventListener\("click", loadMoreSessions\)/);
  assert.match(app, /ui\.workspaceMore\.addEventListener\("click", loadMoreWorkspaceChanges\)/);
});

test("session snapshots are assignment-bound and fail closed on invalid scope", () => {
  assert.match(app, /organizationId !== session\.organizationId/);
  assert.match(app, /workAssignmentId/);
  assert.match(app, /generation === null \|\| generation <= 0n/);
  assert.match(app, /assignmentVersion === null \|\| assignmentVersion <= 0n/);
  assert.match(app, /lastObservedAt < startedAt/);
  assert.match(app, /SessionService returned an invalid assignment-bound lifecycle record/);
  assert.match(app, /source: "SessionService snapshot"/);
});

test("workspace changes render only bounded server-sanitized text with typed unavailability", () => {
  assert.match(app, /function canonicalRelativePath/);
  assert.match(app, /new TextEncoder\(\)\.encode\(value\)\.byteLength > 4096/);
  assert.match(app, /availability !== "available" && \(safeDiff \|\| diffRedacted \|\| diffTruncated\)/);
  assert.match(app, /sequence === null \|\| sequence <= previousSequence/);
  assert.match(app, /source: "WorkspaceService snapshot"/);
  assert.match(app, /Diff unavailable · \$\{entry\.diffAvailability\}/);
  assert.match(app, /code\.textContent = entry\.safeDiff/);
  assert.match(app, /Sensitive-looking values were redacted/);
  assert.match(app, /The diff was truncated at the service boundary/);
  assert.doesNotMatch(app, /innerHTML|outerHTML|insertAdjacentHTML/);
});
