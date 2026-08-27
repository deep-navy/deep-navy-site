"use strict";

// The console subscribes to four streams, but the crew's states, pending
// decisions, objectives, and open work were fetched once at team selection
// and trusted forever: a customer watched "Agents active 0/6 - waiting for
// work" under a Product Manager mid-interview, and a sign-off card that only
// appeared on reload. Arriving activity events now mark the surfaces their
// kind can move, and one trailing timer refetches the union - no blanket
// polling, so a quiet team costs nothing.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  const end = app.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `source slice [${startMarker} … ${endMarker}] not found`);
  return app.slice(start, end);
}

function harness() {
  const slice = between("const surfaceRefetch = { timer: 0", "function appendActivityEvent");
  const timers = [];
  const windowStub = { setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; } };
  const build = new Function(
    "timestampDate", "session", "window",
    `${slice}\nreturn { surfacesMovedBy, scheduleEventDrivenRefetch, surfaceRefetch };`
  );
  const exportsObject = build(
    (value) => (value instanceof Date ? value : null),
    { selectedTeamId: "team-1", workspaceGeneration: 1 },
    windowStub
  );
  return { ...exportsObject, timers };
}

test("each event kind maps to exactly the surfaces it can move", () => {
  const { surfacesMovedBy } = harness();
  assert.deepEqual(surfacesMovedBy({ category: "sessions" }), ["agents"]);
  assert.deepEqual(surfacesMovedBy({ category: "tools" }), ["agents", "approvals", "objectives"]);
  assert.deepEqual(surfacesMovedBy({ category: "delivery" }), ["work"]);
  assert.deepEqual(surfacesMovedBy({ category: "conversations" }), []);
  assert.deepEqual(surfacesMovedBy({ category: "workspace" }), []);
});

test("a recent event arms one trailing timer; a replayed history arms none", () => {
  const { scheduleEventDrivenRefetch, surfaceRefetch, timers } = harness();
  // The stream replays the whole record on connect; an old event must not
  // trigger a refetch of surfaces the initial load just fetched.
  scheduleEventDrivenRefetch({ category: "tools", occurredAt: new Date(Date.now() - 10 * 60 * 1000) });
  assert.equal(timers.length, 0);
  assert.equal(surfaceRefetch.surfaces.size, 0);
  // A recent one arms the timer once; a second recent event coalesces into
  // the same pending flush instead of arming another.
  scheduleEventDrivenRefetch({ category: "tools", occurredAt: new Date() });
  scheduleEventDrivenRefetch({ category: "delivery", occurredAt: new Date() });
  assert.equal(timers.length, 1);
  assert.deepEqual([...surfaceRefetch.surfaces].sort(), ["agents", "approvals", "objectives", "work"]);
});

test("the refetch is quiet and guarded: rejections keep the last render, every apply re-checks the team", () => {
  const refetch = between("async function refetchSurfaces", "function appendActivityEvent");
  assert.doesNotMatch(refetch, /resetAgentView|resetApprovalView|resetObjectiveView/, "background refresh must never blank a working surface");
  assert.match(refetch, /, \(\) => \{\}\)/, "rejected background reads are dropped, keeping the last good render");
  const applies = refetch.match(/current\(\)/g) || [];
  assert.ok(applies.length >= 4, `every surface apply re-checks team and generation (found ${applies.length})`);
});

test("the work refetch resets delivery state only after BOTH reads succeed, then renders in the same tick", () => {
  // The delivery renderers validate page 1 against the ids and sort cursor
  // already in session state - they are written to run after a reset - so a
  // refetch that re-renders page 1 over loaded state throws "returned a
  // duplicate issue" and the catch wipes the surface. The first review of
  // this code proved that on every routine delivery event. Reset must
  // therefore happen: (1) only in the work branch, (2) only after both
  // results are fulfilled, (3) synchronously before the renders.
  const refetch = between("async function refetchSurfaces", "function appendActivityEvent");
  const guardAt = refetch.indexOf('issuesResult.status !== "fulfilled" || pullRequestsResult.status !== "fulfilled"');
  const resetAt = refetch.indexOf("resetDeliveryRecords(");
  const issuesRenderAt = refetch.indexOf("renderGitHubIssuesResult(issuesResult");
  const pullsRenderAt = refetch.indexOf("renderGitHubPullRequestsResult(pullRequestsResult");
  assert.ok(guardAt >= 0 && resetAt > guardAt && issuesRenderAt > resetAt && pullsRenderAt > issuesRenderAt,
    "order must be: both-fulfilled guard, then reset, then both renders");
  const betweenResetAndRender = refetch.slice(resetAt, pullsRenderAt);
  assert.doesNotMatch(betweenResetAndRender, /await/, "the reset-to-render gap must stay synchronous");
  assert.equal((refetch.match(/resetDeliveryRecords\(/g) || []).length, 1, "reset appears exactly once, in the work branch");
});

test("every accepted activity event feeds the scheduler", () => {
  const append = between("function appendActivityEvent", "function allActivityEntries");
  assert.match(append, /session\.activityEvents\.push\(entry\);\n\s*scheduleEventDrivenRefetch\(entry\);/);
});
