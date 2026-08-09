// Source labels are internal discriminators that the timeline can render,
// so they no longer name services. The rule under test is unchanged.
"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

test("selected objectives expose the durable TPM handoff state", () => {
  assert.match(shell, /data-objective-dispatch-state/);
  assert.match(shell, /data-objective-dispatch-detail/);
  assert.match(app, /function renderObjectiveDispatch/);
  assert.match(app, /renderObjectiveDispatch\(objective\.dispatch\)/);
});

test("objective pages fail closed when dispatch status is absent or invalid", () => {
  assert.match(app, /function validObjectiveDispatch/);
  assert.match(app, /!validObjectiveDispatch\(objective\?\.dispatch\)/);
  assert.match(app, /stateLabel === "delivered" && !deliveredAt/);
  assert.match(app, /stateLabel === "failed" && !failureReason/);
  assert.match(app, /nothing is assumed about it/);
});

test("objective creation reports the returned queue state without fabricating delivery", () => {
  assert.match(app, /!validObjectiveDispatch\(objective\.dispatch\)/);
  assert.match(app, /durable handoff is \$\{objectiveDispatchStateLabel\(objective\.dispatch\.state\)\}/);
  assert.doesNotMatch(app, /objective.*successfully delivered/i);
});

test("selected objectives expose only validated server-returned KPI definitions", () => {
  assert.match(shell, /data-objective-kpi-state/);
  assert.match(shell, /data-objective-kpi-list/);
  assert.match(shell, /href="#workspace-approvals"/);
  assert.match(app, /function validObjectiveKpis/);
  assert.match(app, /\["increase", "decrease", "maintain"\]/);
  assert.match(app, /Number\.isFinite\(baseline\)/);
  assert.match(app, /typeof kpi\?\.guardrail !== "boolean"/);
  assert.match(app, /renderObjectiveKpis\(objective\.kpis\)/);
  assert.doesNotMatch(shell, /data-(?:accept|approve)-kpi/);
});

test("initiative review exhausts typed pages and displays proposal context", () => {
  assert.match(app, /function validInitiative/);
  assert.match(app, /InitiativeService returned an oversized page/);
  assert.match(app, /invalid or duplicate objective-scoped proposal/);
  assert.match(app, /next === pageToken \|\| seenTokens\.has\(next\)/);
  assert.match(app, /description\.textContent = stringValue\(initiative\.description\)/);
  assert.match(app, /Hypothesis:/);
  assert.match(app, /Priority \$\{Number\(initiative\.priority\)\}/);
});
