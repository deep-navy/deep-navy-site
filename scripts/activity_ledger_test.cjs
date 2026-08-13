// Source labels are internal discriminators that the timeline can render,
// so they no longer name services. The rule under test is unchanged.
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
  assert.match(app, /source: "runtime"/);
  assert.match(app, /ProvisioningService stream/);
  assert.match(app, /source: "approval queue"/);
  assert.match(app, /source: "economics"/);
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
  assert.match(client, /return Object\.freeze\(\{ request, signIn, streamTeamActivity, streamProvisioningStatus \}\)/);
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

test("the activity stream reconnects itself and heals an expired token", () => {
  // A mid-stream token expiry arrives as an in-stream "unauthenticated"
  // error frame; the old code treated it as terminal and the manual Retry
  // reused the same stale token, so one expiry became a permanent dead
  // panel. Reconnects are automatic with backoff, bounded for streams that
  // never establish, and routed through the refresh_session cookie exchange
  // when auth is the failure.
  assert.match(app, /function refreshStreamAccessToken/);
  assert.match(app, /platformApi\.signIn\("refresh_session"/);
  assert.match(app, /function scheduleActivityReconnect/);
  assert.match(app, /const activityReconnectLimit = \d+/);
  assert.match(app, /Math\.min\(30000, 1500 \* 2 \*\* attempt\)/);
  assert.match(app, /normalized\.status === 401 \|\| normalized\.code === "unauthenticated"/);
  assert.match(app, /scheduleActivityReconnect\(teamId, generation, nextAttempt, unauthenticated\)/);
  assert.match(app, /scheduleActivityReconnect\(teamId, generation, nextAttempt, false\)/);
  // A stream that genuinely established gets a fresh budget when it drops.
  assert.match(app, /streamEstablished \? 0 : attempt \+ 1/);
});

test("reconnecting is a different promise than terminal unavailability", () => {
  assert.match(app, /setSourceState\(ui\.activityState, "Reconnecting", "loading"\)/);
  assert.match(app, /setSourceState\(ui\.activityState, "Unavailable", "error"\)/);
});
