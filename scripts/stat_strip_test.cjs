"use strict";

// The instrument strip: four readings over the crew - proof, money,
// delivery, presence - and every one of them is a number the workspace
// refresh already fetched. These pin the two promises that make it safe: it
// never costs a request or assembles markup (textContent and the CSSOM gauge
// only, because the shell ships style-src 'self'), and every reading carries
// its unit and its honest empty instead of a zero it cannot vouch for.
// satisfied_at is evidence, not lifecycle state, so "proven" counts evidence
// - and a failing acceptance run after a proof is "regressed", a different
// fact from never-proven that the strip refuses to fold away.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("the strip and all of its readings ship in the shell, above the crew", () => {
  for (const hook of [
    "data-stat-strip", "data-stat-objectives", "data-stat-objectives-note",
    "data-stat-credits", "data-stat-credits-fill", "data-stat-credits-note",
    "data-stat-delivery", "data-stat-delivery-note",
    "data-stat-agents", "data-stat-agents-note"
  ]) {
    assert.ok(new RegExp(`${hook}(?![\\w-])`).test(shell), `shell is missing ${hook}`);
    assert.ok(app.includes(`[${hook}]`), `app.js never reads ${hook}`);
  }
  const strip = shell.indexOf("data-stat-strip");
  const crew = shell.indexOf('class="crew"');
  assert.ok(strip !== -1 && crew !== -1 && strip < crew, "the strip must sit above the crew grid");
});

test("every reading comes from state the refresh already fetched, built without markup assembly", () => {
  const render = between("function renderStatStrip()", "function agentRoleLabel(");
  assert.match(render, /session\.objectiveListsByTeam\.get\(session\.selectedTeamId\)/);
  assert.match(render, /timestampDate\(objective\?\.satisfiedAt\)/);
  assert.match(render, /failingAcceptance\(objective\)/);
  assert.match(render, /session\.creditBalance/);
  assert.match(render, /session\.creditPeriodConsumed/);
  assert.match(render, /githubPullRequestStateLabel\(record\?\.state\) === "open"/);
  assert.match(render, /githubIssueStateLabel\(record\?\.state\) === "open"/);
  assert.match(render, /agentLiveness\(roleKey\)/);
  // Never a request of its own, never assembled markup, never an inline
  // style - textContent writes and the adopted-stylesheet gauge only.
  assert.doesNotMatch(render, /apiRequest\(/);
  assert.doesNotMatch(render, /createElement|insertAdjacent/);
  assert.doesNotMatch(render, /\.style\b/);
  assert.match(render, /setGaugeWidth\(ui\.statCreditsFill/);
  // The stylesheet leaves the fill's width to the gauge rule.
  const meterFill = css.match(/\.statcell-meter > i \{[^}]*\}/);
  assert.ok(meterFill, "the meter fill rule is missing from main.css");
  assert.doesNotMatch(meterFill[0], /width/);
});

test("numbers carry their units, and absences are said instead of zeroed", () => {
  const render = between("function renderStatStrip()", "function agentRoleLabel(");
  assert.match(render, /`\$\{proven\}\/\$\{objectives\.length\}`/);
  assert.match(render, /\$\{regressed\} regressed/);
  assert.match(render, /formatCreditMicros\(remaining\)/);
  assert.match(render, /used this period/);
  assert.match(render, /open PRs · open issues/);
  assert.match(render, /`\$\{active\}\/\$\{session\.agentRoster\.length\}`/);
  // The honest empties: an unloaded source is a dash and a sentence, and a
  // half-loaded delivery history shows a dash on the half it cannot vouch for.
  assert.match(render, /"balance unavailable"/);
  assert.match(render, /"no repository selected"/);
  assert.match(render, /"no roster loaded"/);
  assert.match(render, /pullsLoaded \? openPulls\.toString\(\) : "—"/);
  // Mono numerals in tabular figures under uppercase micro-labels.
  assert.match(css, /\.statcell-value \{[^}]*font-variant-numeric: tabular-nums/);
  assert.match(css, /\.statcell-label \{[^}]*text-transform: uppercase/);
});

test("a failing conclusion is exactly a non-passing terminal one", () => {
  // Run the real classifier: GitHub conclusions arrive verbatim, so success
  // passes, neutral and skipped assert nothing, and everything else fails.
  const source = between("function failingAcceptance(objective)", "function renderStatStrip(");
  const failingAcceptance = new Function("stringValue", `${source}; return failingAcceptance;`)(
    (value) => (typeof value === "string" ? value : "")
  );
  assert.equal(failingAcceptance({ acceptance: { conclusion: "failure" } }), true);
  assert.equal(failingAcceptance({ acceptance: { conclusion: "timed_out" } }), true);
  assert.equal(failingAcceptance({ acceptance: { conclusion: "success" } }), false);
  assert.equal(failingAcceptance({ acceptance: { conclusion: "neutral" } }), false);
  assert.equal(failingAcceptance({ acceptance: { conclusion: "skipped" } }), false);
  // Never-run - acceptance absent entirely - is not a failure.
  assert.equal(failingAcceptance({}), false);
  assert.equal(failingAcceptance({ acceptance: {} }), false);
});

test("the strip renders inside the guarded fan-out and repaints with its sources", () => {
  const refresh = between("async function refreshSelectedTeam()", "function renderPendingTeamGuidance");
  assert.match(refresh, /renderStatStrip\(\);/);
  assert.ok(
    refresh.indexOf("generation !== session.workspaceGeneration") < refresh.indexOf("renderStatStrip();"),
    "the strip must paint after the workspaceGeneration staleness guard, like every sibling render"
  );
  // Liveness ages with the crew tiles; credits move with the rail gauge;
  // objectives and delivery repaint with their own renders; a pending team
  // or an empty workspace stands the strip down.
  const crew = between("function refreshCrewActivity()", "function renderRailSpend");
  assert.match(crew, /renderStatStrip\(\);/);
  assert.match(app, /renderRailSpend\(\);\n    renderStatStrip\(\);/);
  const objectives = between("function renderObjectivesResult(", "function objectiveDispatchTerminal(");
  assert.match(objectives, /renderStatStrip\(\);/);
  const pending = between("function renderPendingTeamGuidance(team)", "function resetWorkspaceViews(");
  assert.match(pending, /renderStatStrip\(\);/);
  const reset = between("function resetWorkspaceViews(", "function setEmptyState(");
  assert.match(reset, /renderStatStrip\(\);/);
  const strip = between("function renderStatStrip()", "function agentRoleLabel(");
  assert.match(strip, /lifecycleLabel\(team\.state\) !== "active"/);
  assert.match(strip, /ui\.statStrip\.hidden = true/);
});
