"use strict";

// The customer deleted a team and the page sat on a stale mid-retry snapshot
// ("deleting · attempt 4 · retrying") long after the server had finished,
// because provisioning was followed only by a poll that had stopped, and
// nothing else was listening. These pin the streaming path that replaced it:
// the stream opens with the team (including one parked in the pending/deleting
// guidance branch), the poll stands down while the stream is live, a terminal
// delete routes to the create-team screen without any reload, and a dropped
// stream heals itself through the same token-refresh path the activity
// stream uses.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("selecting a team opens the provisioning stream, including pending/deleting teams", () => {
  const refresh = between("async function refreshSelectedTeam()", "function renderPendingTeamGuidance");
  // The deleting branch early-returns before the workspace loads. The stream
  // must start before that return, or a watched delete has no live transport
  // at all - which is exactly the stale-"retrying" screen this replaces.
  const pendingBranch = between("renderPendingTeamGuidance(team);", "resetAgentView(");
  assert.match(pendingBranch, /startProvisioningStream\(team\.id, generation\)/);
  const opens = refresh.match(/startProvisioningStream\(team\.id, generation\)/g) || [];
  assert.equal(opens.length, 2, "both the pending/deleting branch and the active path open the stream");
  // And neither opens unconditionally: a settled team's provisioning is
  // history, so the stream is gated on still being owed a terminal state.
  assert.match(refresh, /teamNeedsProvisioningStream\(team\)/);
});

test("the fallback poll stands down while the provisioning stream is live", () => {
  const poll = between("async function pollProvisioning(teamId)", "function stopProvisioningPolling");
  const gate = poll.indexOf("session.provisioningStreamLive === true");
  assert.notEqual(gate, -1, "pollProvisioning is gated on the stream-live flag");
  // The gate must sit before the RPC ever fires...
  assert.ok(gate < poll.indexOf('apiRequest("provisioning_status"'), "the live-stream gate precedes the status RPC");
  // ...and must re-arm a lazy re-check, so polling resumes by itself the
  // moment the stream drops instead of needing anyone to notice.
  const gated = poll.slice(gate, gate + 400);
  assert.match(gated, /startProvisioningPolling\(/);
  assert.match(gated, /return;/);
});

test("a quiet-but-healthy stream still counts as live", () => {
  const stream = between("async function startProvisioningStream(teamId", "function changeActivityFilter");
  // An already-terminal team's stream may have nothing to replay; without the
  // settle window the poll would keep firing beside a perfectly good stream.
  assert.match(stream, /window\.setTimeout\(markStreamEstablished, 1500\)/);
  assert.match(stream, /session\.provisioningStreamLive = true/);
  const stop = between("function stopProvisioningStream()", "function stopActivityStream");
  // And stopping the stream must hand coverage back to the poll gate.
  assert.match(stop, /session\.provisioningStreamLive = false/);
  assert.match(stop, /session\.provisioningReconnectTimer = null/);
});

test("a streamed terminal delete routes to the refetched team list, never a reload", () => {
  const stream = between("async function startProvisioningStream(teamId", "function changeActivityFilter");
  // The operation is read through the launch contract, never by label text.
  assert.match(stream, /provisioningOperation\(status\) === launchContract\.PROVISIONING_OPERATION\.DELETE/);
  // Routing is the poll's terminal branch verbatim: server truth via refetch.
  // renderTeamList's writes to [data-teams-empty]/[data-team-list] are the
  // signals app-views.js observes to flip to the create-team screen.
  assert.match(stream, /await reloadTeamsAfterLifecycle\(\);/);
  // A snapshot replayed across reconnects must not refetch in a loop.
  assert.match(stream, /provisioningRouteKey/);
});

test("a team that vanishes mid-removal is deletion-complete routing, not an error banner", () => {
  const stream = between("async function startProvisioningStream(teamId", "function changeActivityFilter");
  assert.match(stream, /isMissingResource\(normalized\)/);
  const poll = between("async function pollProvisioning(teamId)", "function stopProvisioningPolling");
  // The fallback poll routes the same way when the status read 404s while the
  // team was deleting - and it must do so before the error-message branch.
  const missing = poll.indexOf("isMissingResource(error)");
  assert.notEqual(missing, -1, "pollProvisioning treats a missing team as completion");
  assert.ok(missing < poll.indexOf("_pollingMessage = apiErrorMessage"), "completion routing precedes the error banner");
  // Completion goes through the one shared removal door: routeTeamRemoved
  // dedupes the "was removed" toast across the stream/poll/not_found writers
  // and performs the authoritative reloadTeamsAfterLifecycle refetch itself.
  assert.match(poll.slice(missing, missing + 400), /await routeTeamRemoved\(team\);/);
  const door = between("function announceTeamRemoved(team)", "function renderTeamSelector");
  assert.match(door, /provisioningRouteKey/);
  assert.match(door, /was removed/);
  assert.match(door, /reloadTeamsAfterLifecycle\(\)/);
});

test("the provisioning stream reconnects through the token refresh path with a bounded budget", () => {
  const schedule = between("function scheduleProvisioningReconnect(", "function resumeProvisioningFallbackPoll");
  // Streams outlive bearer tokens; the reconnect heals the token through
  // refresh_session exactly the way the activity stream's reconnect does.
  assert.match(schedule, /refreshStreamAccessToken\(\)/);
  assert.match(schedule, /Math\.min\(30000, 1500 \* 2 \*\* attempt\)/);
  const stream = between("async function startProvisioningStream(teamId", "function changeActivityFilter");
  // An in-stream "unauthenticated" frame is an expired token, not a terminal
  // failure: it must schedule the reconnect with the refresh flag set.
  assert.match(stream, /scheduleProvisioningReconnect\(teamId, generation, nextAttempt, unauthenticated\)/);
  // The retry budget is shared with the activity stream, and a stream that
  // burns through it hands coverage back to the fallback poll.
  assert.match(stream, /nextAttempt <= activityReconnectLimit/);
  assert.match(stream, /resumeProvisioningFallbackPoll\(teamId\)/);
});
