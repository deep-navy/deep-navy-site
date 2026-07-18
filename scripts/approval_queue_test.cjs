"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

test("the customer workspace exposes a real pending approval queue", () => {
  assert.match(shell, /data-approval-list/);
  assert.match(shell, /data-approvals-more/);
  assert.doesNotMatch(shell, /Discovery unavailable|no pending-approval list method/i);
  assert.match(app, /apiRequest\("approvals", \{ teamId: team\.id, page: \{ pageSize: 100 \} \}\)/);
});

test("approval pages fail closed on scope, status, duplicates, and repeated cursors", () => {
  assert.match(app, /stringValue\(approval\?\.teamId\) === stringValue\(teamId\)/);
  assert.match(app, /approval\.approvalStatus === 1/);
  assert.match(app, /duplicate approval/);
  assert.match(app, /repeated page cursor/);
  assert.doesNotMatch(app, /innerHTML/);
});

test("denials require a bounded reason and decided responses are revalidated", () => {
  assert.match(app, /if \(!approved && !reason\)/);
  assert.match(app, /new TextEncoder\(\)\.encode\(reason\)\.length > 500/);
  assert.match(app, /decidedApprovalStatus\(decided, approved\)/);
  assert.match(app, /stringValue\(decided\.teamId\) !== stringValue\(team\.id\)/);
  assert.match(app, /const actionType = stringValue\(approval\.actionType\);/);
  assert.ok(app.indexOf("const actionType = stringValue(approval.actionType);") < app.indexOf("title: `${actionType.replaceAll"));
});
