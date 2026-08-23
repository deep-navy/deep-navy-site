"use strict";

// A live dot that has outlived its truth.
//
// teamPhase() used to reach "running" — and the pulsing live badge with it —
// from `state === active` alone. A provisioning state is a fact about the PAST:
// it says the runtime was created, and says nothing about whether the runtime is
// alive now. So a crashlooping pod wore a live indicator all morning, and there
// was no fact on the wire that could contradict it.
//
// TeamRuntimeHealth is that fact, and it is the customer-safe half of the
// operator snapshot: the namespace, the OpenClaw instance name and the report id
// are stripped upstream and a contract test holds that boundary. These pin the
// three things that can silently regress here — that readiness actually reaches
// the phase, that severity still comes from the one ladder, and that nothing
// operator-only is reached for on the way.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const { NOTICE_LEVELS } = require("../assets/js/notice-levels.js");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

// Lift the readiness verdict out of the console and run it, so these assertions
// are about the shipped behaviour rather than a copy of it that could drift.
const readinessSource = between("const RUNTIME_HEALTH_STATE = Object.freeze(", "  // Five phases, every one derived");
const teamRuntimeReadiness = new Function(
  "stringValue", "session",
  `${readinessSource}\nreturn teamRuntimeReadiness;`
)((value) => (typeof value === "string" ? value.trim() : ""), { selectedTeamId: "", agents: [] });

const health = (over) => Object.assign({
  state: 1, gatewayReady: true, readyAgentCount: 6, reason: 1, sequence: 10n
}, over);

/* ---- the verdict -------------------------------------------------------- */

test("only a runtime that is actually ready earns a ready verdict", () => {
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({}), engineerCount: 3 }).verdict, "ready");
});

test("a gateway that is not accepting work is never ready", () => {
  // The exact case that kept a live indicator lit over a crashlooping runtime.
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 2, gatewayReady: false, reason: 4 }), engineerCount: 3 }).verdict, "degraded");
  // And a server summary of READY is not taken on trust when its own figures
  // disagree with it: gateway_ready and ready_agent_count are what make the
  // summary falsifiable, which is the whole reason they are on the wire.
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 1, gatewayReady: false }), engineerCount: 3 }).verdict, "degraded");
});

test("a ready count short of the roster is never ready", () => {
  // The roster is the three standing roles plus this team's engineers.
  const short = teamRuntimeReadiness({ runtimeHealth: health({ readyAgentCount: 4 }), engineerCount: 3 });
  assert.equal(short.verdict, "degraded");
  assert.equal(short.roster, 6);
  assert.equal(short.ready, 4);
  // A team whose roster size is unknown cannot be judged short, and is not.
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ readyAgentCount: 4 }) }).verdict, "ready");
});

test("failed and suspended are kept apart from degraded", () => {
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 4, reason: 7 }), engineerCount: 3 }).verdict, "failed");
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 3, reason: 6 }), engineerCount: 3 }).verdict, "suspended");
});

test("an absent snapshot is unobserved — not unhealthy, and not evidence of life", () => {
  // "runtime_health is absent until the team's runtime has reported once. An
  // absent snapshot means 'not observed yet', which is not the same as unhealthy
  // and must not be rendered as a failure."
  assert.equal(teamRuntimeReadiness({ engineerCount: 3 }).verdict, "unobserved");
  assert.equal(teamRuntimeReadiness({ runtimeHealth: null, engineerCount: 3 }).verdict, "unobserved");
  // An unspecified state is equally not a claim in either direction.
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 0 }), engineerCount: 3 }).verdict, "unobserved");
});

test("staleness is the server's call, not a second clock in the browser", () => {
  // "a snapshot the server considers too old is reported as DEGRADED with
  // HEARTBEAT_STALE rather than as its last happy value, so silence is never
  // rendered as health." A clock here could only disagree with that one.
  assert.match(between("// RUNTIME READINESS", "const RUNTIME_HEALTH_STATE"), /Staleness is NOT computed here/);
  assert.doesNotMatch(readinessSource, /Date\.now\(\)/);
  assert.equal(teamRuntimeReadiness({ runtimeHealth: health({ state: 2, reason: 8 }), engineerCount: 3 }).verdict, "degraded");
});

/* ---- the phase, not just the badge -------------------------------------- */

test("the running claim is gated on readiness, and gated last", () => {
  const phase = between("function teamPhase(team) {", "// The measure the team exists for");
  const readiness = phase.indexOf("const readiness = teamRuntimeReadiness(team);");
  assert.notEqual(readiness, -1, "teamPhase must consult the runtime");
  // It sits below every durable-record branch and immediately above the one
  // claim that is about right now.
  assert.ok(readiness > phase.indexOf('=== "proven"'), "readiness is checked after the objective branches");
  assert.ok(readiness < phase.indexOf('return "running"'), "readiness is checked before the running claim");
  assert.match(phase, /if \(readiness\.verdict === "failed"\) return "runtime_failed";/);
  assert.match(phase, /if \(readiness\.verdict === "suspended"\) return "halted";/);
  assert.match(phase, /if \(readiness\.verdict === "degraded"\) return "degraded";/);
  assert.match(phase, /if \(readiness\.verdict === "unobserved"\) return "unreported";/);
});

test("only the running phase is live, and the console mockup binds shape to phase", () => {
  const table = between("const TEAM_PHASE_BADGE = Object.freeze({", "function renderTeamHeadline()");
  // Exactly one phase may claim to be live.
  assert.equal((table.match(/live: true/g) || []).length, 1);
  for (const phase of ["runtime_failed", "degraded", "unreported"]) {
    const entry = table.slice(table.indexOf(`${phase}:`), table.indexOf("\n", table.indexOf(`${phase}:`)));
    assert.match(entry, /live: false/, `${phase} must not render as live`);
  }
  // The phase reaches the screen's shape, not only the badge: the overview
  // section stamps it, which is what the mockup's phase folds key on.
  assert.match(app, /section\.dataset\.teamPhaseState = phase;/);
});

test("agent liveness cannot outrank what the runtime just reported", () => {
  const liveness = between("function agentLiveness(roleKey) {", "function recentObjectiveHandoff()");
  assert.match(liveness, /const readiness = teamRuntimeReadiness\(selectedTeam\(\)\);/);
  assert.match(liveness, /\["failed", "degraded", "suspended"\]\.includes\(readiness\.verdict\)/);
  // The gate precedes the event lookup, so a recent event cannot win.
  assert.ok(liveness.indexOf("readiness.verdict") < liveness.indexOf("latestEventForRole"));
  // An unobserved runtime suppresses nothing: absence of a report is not
  // evidence against an event that actually arrived.
  assert.doesNotMatch(liveness, /"unobserved"/);
});

/* ---- severity comes from the one ladder --------------------------------- */

test("the readiness phases name a LEVEL and invent no tone table", () => {
  const table = between("const TEAM_PHASE_BADGE = Object.freeze({", "function renderTeamHeadline()");
  const levels = [...table.matchAll(/level: "([a-z]+)"/g)].map((match) => match[1]);
  assert.ok(levels.length >= 4, "the readiness phases carry ladder levels");
  for (const level of levels) {
    assert.ok(Object.hasOwn(NOTICE_LEVELS, level), `${level} is not a level on the ladder`);
  }
  // An unreported runtime is an absence, not a fault, and the contract says in
  // as many words that it must not be rendered as a failure.
  assert.match(table, /unreported: \{ label: "Readiness not reported", live: false, level: "info" \}/);
  assert.equal(NOTICE_LEVELS.info.tone, "idle");
  // Not ready is a warning; a dead runtime is an error.
  assert.match(table, /degraded: \{ label: "Not ready", live: false, level: "warning" \}/);
  assert.match(table, /runtime_failed: \{ label: "Runtime failed", live: false, level: "error" \}/);

  // The banner takes its class and glyph from the ladder rather than naming
  // either here.
  const sysbar = between("function renderTeamSystemBar(team, phase)", "// Why it stopped, from the record");
  assert.match(sysbar, /noticeLevels\.levelClass\("dn-sysbar", level\)/);
  assert.match(sysbar, /spriteIcon\(shape\.glyph, 15\)/);
});

test("colour never carries a readiness state on its own", () => {
  // Every readiness phase reaches the badge with a word, and the three that
  // carry a ladder level also reach it with that level's glyph — so the state
  // survives filter: grayscale(1) intact.
  const headline = between("if (ui.teamPhase) {", "renderTeamSystemBar(team, phase);");
  assert.match(headline, /const badge = teamPhaseBadge\(team, phase\);/);
  assert.match(headline, /badge\.level \? noticeShape\(badge\.level\) : null/);
  assert.match(headline, /ui\.teamPhase\.append\(spriteIcon\(shape\.glyph, 13\)\)/);
  assert.match(headline, /ui\.teamPhase\.append\(document\.createTextNode\(badge\.label\)\)/);
});

test("a not-ready badge names what is actually short", () => {
  const badge = between("function teamPhaseBadge(team, phase)", "function renderTeamHeadline()");
  assert.match(badge, /if \(phase !== "degraded" && phase !== "runtime_failed"\) return badge;/);
  assert.match(badge, /\$\{badge\.label\} · \$\{readiness\.reason\}/);
  // The reasons are the contract's bounded, credential-free set, in the
  // customer's own terms.
  const reasons = between("const RUNTIME_HEALTH_REASON_TEXT = Object.freeze({", "  // The roster the runtime");
  for (const key of ["2", "3", "4", "5", "6", "7", "8"]) {
    assert.ok(reasons.includes(`${key}:`), `reason ${key} has no customer wording`);
  }
  // Nothing here describes our cluster.
  assert.doesNotMatch(reasons, /pod|kubernetes|namespace|openclaw|container/i);
});

/* ---- the safe subset ---------------------------------------------------- */

test("the console never reaches for an operator-only identifier", () => {
  // TeamRuntimeHealth is RuntimeHealthSnapshot with every operator-only field
  // removed. A contract test upstream holds that boundary; this holds that the
  // console does not try to work around it.
  const readiness = between("const RUNTIME_HEALTH_STATE = Object.freeze(", "  // Five phases, every one derived");
  const apply = between("function applyTeamRuntimeHealth(team, health)", "function stopProvisioningStream()");
  for (const source of [readiness, apply]) {
    assert.doesNotMatch(source, /\.namespace\b/);
    assert.doesNotMatch(source, /instanceName|reportId/);
  }
  // And no such field is stamped into the PUBLIC shell.
  assert.doesNotMatch(shell, /data-runtime-namespace|data-instance-name|openclaw/i);
});

/* ---- how it reaches the screen ------------------------------------------ */

test("health arrives through one door, ordered by its own sequence", () => {
  const apply = between("function applyTeamRuntimeHealth(team, health)", "function stopProvisioningStream()");
  // "sequence orders health snapshots. It belongs to runtime health and is not
  // the provisioning sequence StreamProvisioningStatus resumes from."
  assert.match(apply, /session\.lastRuntimeHealthSequence/);
  assert.doesNotMatch(apply, /lastProvisioningSequence/);
  assert.match(apply, /if \(sequence < session\.lastRuntimeHealthSequence\) return false;/);
  // An absent snapshot is left absent rather than replaced with a healthy one.
  assert.match(apply, /if \(!team \|\| !health\) return false;/);
});

test("both transports feed it, and the stream keeps following once provisioning settles", () => {
  // The unary read carries it on GetProvisioningStatusResponse...
  const poll = between("async function pollProvisioning(teamId)", "function stopProvisioningPolling");
  assert.match(poll, /runtimeHealth = response\.runtimeHealth;/);
  assert.match(poll, /applyTeamRuntimeHealth\(team, runtimeHealth\)/);

  // ...and the stream carries it on StreamProvisioningStatusResponse, on a frame
  // that may carry no event and no status at all.
  const stream = between("async function startProvisioningStream(teamId", "function changeActivityFilter");
  assert.match(stream, /const runtimeHealth = response\?\.runtimeHealth;/);
  assert.match(stream, /if \(runtimeHealth && team && applyTeamRuntimeHealth\(team, runtimeHealth\)\)/);
  assert.match(stream, /renderTeamHeadline\(\);/);

  // Closing the stream the moment provisioning settled is exactly what left the
  // badge reasoning from a fact about the past, so an active team keeps it open.
  const gate = between("function teamNeedsProvisioningStream(team)", "function startProvisioningPolling");
  assert.match(gate, /if \(lifecycleLabel\(team\.state\) === "active"\) return true;/);
  // And a team that is already active must not re-route on the terminal
  // snapshot the now-persistent stream replays on every reconnect.
  assert.match(stream, /if \(lifecycleLabel\(team\.state\) === "active"\) \{\s*\n\s*session\.provisioningRouteKey = routeKey;/);
});
