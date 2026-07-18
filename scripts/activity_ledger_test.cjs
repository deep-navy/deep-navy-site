"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

test("activity filters cover every launch work source without conflating their cursors", () => {
  for (const category of ["all", "conversations", "sessions", "tools", "workspace", "delivery", "approvals", "provisioning", "cost"]) {
    assert.match(shell, new RegExp(`data-activity-filter="${category}"`));
  }
  assert.match(app, /ActivityService stream/);
  assert.match(app, /ProvisioningService stream/);
  assert.match(app, /ApprovalService queue/);
  assert.match(app, /EconomicsService snapshot/);
  assert.match(app, /Activity event \$\{sequence\.toString\(\)\}/);
  assert.match(app, /Provisioning event \$\{sequence\.toString\(\)\}/);
});

test("runtime activity renders only the normalized allowlisted envelope", () => {
  for (const type of ["a2a.message", "tool.call", "session.status", "artifact.summary"]) assert.match(app, new RegExp(type.replace(".", "\\.")));
  for (const detail of ["from_agent_id", "to_agent_id", "message_kind", "tool_name", "duration_ms", "current_status", "reason_code", "artifact_type", "artifact_id", "change_kind"]) assert.match(app, new RegExp(detail));
  assert.match(app, /unexpected detail field/);
  assert.match(app, /non-monotonic sequence/);
  assert.match(app, /canonicalArtifactUrl/);
  assert.match(app, /url\.hostname !== "github\.com"/);
  assert.match(app, /link\.textContent = "Open verified GitHub artifact"/);
  assert.match(app, /link\.rel = "noopener noreferrer"/);
  assert.match(app, /link\.referrerPolicy = "no-referrer"/);
  assert.doesNotMatch(app, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(app, /prompt|chain.of.thought|reasoning_content/i);
});

test("the browser uses the generated ProvisioningService stream", () => {
  assert.match(client, /provisioning\.streamProvisioningStatus/);
  assert.match(client, /afterSequence: int64Field/);
  assert.match(client, /timeoutMs: 0/);
  assert.match(client, /return Object\.freeze\(\{ request, streamTeamActivity, streamProvisioningStatus \}\)/);
});

test("objective recovery is team-scoped, paginated, and selectable after refresh", () => {
  assert.match(app, /apiRequest\("objectives", \{ teamId, page: \{ pageSize: 100, pageToken \} \}\)/);
  assert.match(app, /Objective pagination returned a repeated cursor/);
  assert.match(app, /stringValue\(objective\?\.teamId\) !== stringValue\(teamId\)/);
  assert.match(app, /objectiveListsByTeam/);
  assert.match(app, /ui\.objectiveSelect\.addEventListener\("change", selectObjective\)/);
});

test("customer economics breakdowns are server-calculated, scoped, and bounded", () => {
  for (const group of ["initiative", "agent", "agent_role", "repository", "issue", "pull_request"]) assert.match(app, new RegExp(`key: "${group}"`));
  assert.match(app, /apiRequest\("economics_breakdowns"/);
  assert.match(app, /parentScopeType: "team"/);
  assert.match(app, /Economics breakdown exceeded the supported 500-row dimension limit/);
  assert.match(app, /formatCanonicalMoney\(record\.directCost\).*formatCreditMicros\(record\.creditsUsedMicros\)/s);
  assert.match(client, /economics\.listEconomicsBreakdowns/);
});
