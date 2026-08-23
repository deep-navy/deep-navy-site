"use strict";

// The agent detail view: one crew member, in full. What these tests pin is
// the shape that keeps it honest - identity renders from the roster response
// the workspace already holds; the two histories are the same snapshot
// services the team log projects, asked with this agent's id on the request;
// the activity slice is cut client-side from the ONE team stream; spend is
// the per-agent row of the breakdown the economics view already loaded; and
// every door into the view is a real control that carries the agent id on
// its own dataset. The counters strip (data-agent-counters) is the anchor
// this file pins the readings against.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("the agent view is registered, shipped in the shell, and every hook has a reader", () => {
  // The router knows the view; the shell ships its skeleton with a unique id
  // and a labelled heading, and the way back is an ordinary view link.
  assert.match(views, /const VIEWS = \["overview", "economics", "approvals", "settings", "agent", "objectives", "dashboard"\];/);
  assert.match(shell, /<section class="wview" data-view="agent" id="workspace-agent" aria-labelledby="workspace-agent-title">/);
  assert.match(shell, /id="workspace-agent-title"/);
  const agentSection = shell.slice(shell.indexOf('data-view="agent"'), shell.indexOf('data-view="economics"'));
  assert.match(agentSection, /data-view-link="overview" href="#workspace-overview">Back to the floor</);

  for (const hook of [
    "data-agent-state", "data-agent-missing", "data-agent-body",
    "data-agent-monogram", "data-agent-eyebrow", "data-agent-name",
    "data-agent-description", "data-agent-liveness", "data-agent-model",
    "data-agent-heartbeat",
    "data-agent-count-sessions", "data-agent-count-sessions-note",
    "data-agent-count-changes", "data-agent-count-changes-note",
    "data-agent-count-spend", "data-agent-count-spend-note",
    "data-agent-activity-empty", "data-agent-activity-list",
    "data-agent-sessions-state", "data-agent-sessions-empty", "data-agent-sessions-list",
    "data-agent-changes-state", "data-agent-changes-empty", "data-agent-changes-list",
    "data-agent-doing-panel", "data-agent-doing", "data-agent-spend"
  ]) {
    assert.ok(new RegExp(`${hook}(?![\\w-])`).test(shell), `shell is missing ${hook}`);
    assert.ok(app.includes(`[${hook}]`), `app.js never reads ${hook}`);
  }
  // The counters strip itself is pinned here as the anchor of the readings.
  assert.ok(new RegExp("data-agent-counters(?![\\w-])").test(shell), "shell is missing data-agent-counters");
});

test("crew tiles are keyboard-reachable doors that carry the agent id on their dataset", () => {
  const roster = between("function renderAgentsResult(result, teamId)", "function latestActivityForRole");
  // A real button, never a bare div click - and the id the render used to
  // discard rides the tile itself.
  assert.match(roster, /document\.createElement\("button"\)/);
  assert.match(roster, /row\.type = "button"/);
  assert.match(roster, /row\.dataset\.agentId = stringValue\(agent\.id\)/);
  assert.match(roster, /row\.dataset\.agentOpen = "true"/);
  assert.match(css, /\.app-body button\.crew-row:focus-visible/);
  // The dataset has readers on both sides of the module boundary: app.js
  // picks the agent, app-views.js switches the surface, on the same click.
  assert.match(app, /ui\.agentList\.addEventListener\("click", openAgentFromCrew\)/);
  assert.match(views, /agentList\.addEventListener\("click"/);
  assert.match(views, /closest\("\[data-agent-open\]"\)/);
  assert.match(views, /setView\("agent"\)/);
  // Deliberately NOT palette entries: the tiles never carry data-view-link,
  // so six near-identical role labels do not pollute the command palette.
  assert.doesNotMatch(roster, /viewLink|data-view-link/);
});

test("clicking a tile sets selectedAgentId from the tile's own dataset (functional)", () => {
  const source = between("function crewTileAgentId(target)", "function resetAgentDetailView(");
  const build = new Function("stringValue", "session", "refreshSelectedAgent",
    `${source}; return { crewTileAgentId, openAgentFromCrew };`);
  const stringValue = (value) => (typeof value === "string" ? value.trim() : "");
  const refreshes = [];
  const sessionState = { selectedAgentId: "" };
  const { crewTileAgentId, openAgentFromCrew } = build(stringValue, sessionState, () => refreshes.push(1));

  const tile = { dataset: { agentId: "agent-7f3a" } };
  tile.closest = (selector) => (selector === "[data-agent-open]" ? tile : null);
  const inner = { closest: tile.closest };
  assert.equal(crewTileAgentId(inner), "agent-7f3a");
  openAgentFromCrew({ target: inner });
  assert.equal(sessionState.selectedAgentId, "agent-7f3a");
  assert.equal(refreshes.length, 1);

  // A click that lands outside any tile changes nothing and never throws -
  // including a text-node target with no closest() at all.
  openAgentFromCrew({ target: { closest: () => null } });
  openAgentFromCrew({ target: null });
  openAgentFromCrew({ target: {} });
  assert.equal(sessionState.selectedAgentId, "agent-7f3a");
  assert.equal(refreshes.length, 1);
});

test("the agent fan-out carries the agent id and keeps the team refresh's generation discipline", () => {
  const refresh = between("async function refreshSelectedAgent()", "function resetDeliveryRecords(");
  assert.match(refresh, /const generation = \+\+session\.agentDetailGeneration;/);
  assert.match(refresh, /apiRequest\("sessions", \{ teamId: team\.id, agentId, page: \{ pageSize: 50 \} \}\)/);
  assert.match(refresh, /apiRequest\("workspace_changes", \{ teamId: team\.id, agentId, afterSequence: "0", page: \{ pageSize: 50 \} \}\)/);
  const guard = refresh.indexOf("generation !== session.agentDetailGeneration || agentId !== session.selectedAgentId || team.id !== session.selectedTeamId");
  assert.notEqual(guard, -1, "the staleness guard is missing");
  assert.ok(guard < refresh.indexOf("renderAgentSessionsResult("), "results must render only behind the staleness guard");
  assert.ok(guard < refresh.indexOf("renderAgentChangesResult("), "results must render only behind the staleness guard");
  // Every reset bumps the generation so an in-flight answer lands nowhere.
  assert.match(app, /function resetAgentDetailView\(message, label = "Waiting", tone = ""\) \{\n    session\.agentDetailGeneration \+= 1;/);
});

test("the histories fail closed on records outside the requested agent scope", () => {
  const block = between("function renderAgentSessionsResult(result, teamId, agentId)", "function agentSpendRecord()");
  assert.match(block, /safeOpaqueId\(record\?\.agentId\) !== agentId/);
  assert.match(block, /SessionService returned a session outside the requested agent scope/);
  assert.match(block, /WorkspaceService returned a change outside the requested agent scope/);
  // The rows themselves come from the same validated builders and the same
  // ledger row builder the team log uses - one phrasing everywhere.
  assert.match(block, /sessionHistoryEntry\(record, teamId\)/);
  assert.match(block, /workspaceHistoryEntry\(record, teamId, previousSequence\)/);
  assert.match(block, /ui\.agentSessionsList\.append\(activityLedgerItem\(entry, ""\)\)/);
  assert.match(block, /ui\.agentChangesList\.append\(activityLedgerItem\(entry, ""\)\)/);
});

test("the activity slice is cut from the one team stream - never a second stream", () => {
  const agentBlock = between("function crewTileAgentId(target)", "function resetDeliveryRecords(");
  assert.match(agentBlock, /session\.activityEvents/);
  assert.doesNotMatch(agentBlock, /streamTeamActivity|startActivityStream|apiRequest\("agents"/);
  // Exactly one place in the whole app opens the activity stream.
  assert.equal((app.match(/platformApi\.streamTeamActivity\(/g) || []).length, 1);
  // The stream's normalized entries keep the actor's id so the slice can be
  // cut by agent rather than only by role.
  assert.match(app, /agentId: stringValue\(event\.agentId\),/);
  // The slice renders through the shared ledger row builder, and the live
  // half repaints on the crew tiles' own beat.
  assert.match(agentBlock, /ui\.agentActivityList\.append\(activityLedgerItem\(entry, evidence\)\)/);
  const crew = between("function refreshCrewActivity()", "function renderRailSpend");
  assert.match(crew, /renderAgentDetailLive\(\);/);
});

test("spend is the per-agent row of the breakdown already loaded, never a new request", () => {
  const spend = between("function agentSpendRecord()", "async function refreshSelectedAgent()");
  assert.match(spend, /session\.economicsBreakdowns\.get\("agent"\)/);
  assert.match(spend, /stringValue\(record\?\.scope\?\.id\) === session\.selectedAgentId/);
  assert.doesNotMatch(spend, /apiRequest\(/);
  // Absences are said, never zeroed.
  assert.match(spend, /"not measured"/);
  assert.match(spend, /No usage has been attributed to this agent/);

  // Functional: the record is picked by scope id from the "agent" grouping,
  // and a rejected or absent grouping is null - not an invented zero.
  const source = between("function agentSpendRecord()", "function renderAgentSpend(");
  const build = new Function("session", "stringValue", `${source}; return agentSpendRecord;`);
  const stringValue = (value) => (typeof value === "string" ? value.trim() : "");
  const mine = { scope: { id: "agent-1" }, creditsUsedMicros: 5n };
  const loaded = build({
    selectedAgentId: "agent-1",
    economicsBreakdowns: new Map([["agent", { status: "fulfilled", value: { records: [{ scope: { id: "agent-2" } }, mine] } }]])
  }, stringValue);
  assert.equal(loaded(), mine);
  const rejected = build({
    selectedAgentId: "agent-1",
    economicsBreakdowns: new Map([["agent", { status: "rejected", reason: new Error("down") }]])
  }, stringValue);
  assert.equal(rejected(), null);
  const absent = build({ selectedAgentId: "agent-1", economicsBreakdowns: new Map() }, stringValue);
  assert.equal(absent(), null);
});

test("the open agent record cannot outlive its team, and stale ids get a calm exit", () => {
  const reset = between("function resetWorkspaceViews(", "function setEmptyState(");
  assert.match(reset, /session\.selectedAgentId = "";/);
  assert.match(reset, /resetAgentDetailView\(message\);/);
  // Switching teams clears the id in app.js and walks the surface back to
  // the floor in app-views.js - each side through its own door.
  assert.match(app, /session\.selectedTeamId = stringValue\(ui\.teamSelect\.value\);\n    \/\/[^\n]*\n    \/\/[^\n]*\n    session\.selectedAgentId = "";/);
  assert.match(views, /if \(currentView === "agent"\) setView\("overview"\)/);
  // A pending or deleting team has no roster to point at.
  const pending = between("function renderPendingTeamGuidance(team)", "function resetWorkspaceViews(");
  assert.match(pending, /session\.selectedAgentId = "";/);
  // The stale-id state: a calm sentence and the way back, never an error.
  const identity = between("function renderAgentIdentity()", "function renderAgentDetailLive()");
  assert.match(identity, /This agent is no longer on the crew/);
  assert.match(identity, /setSourceState\(ui\.agentDetailState, "Not on the roster"\)/);
  assert.match(shell, /data-agent-missing hidden><strong>This agent is no longer on the crew<\/strong>/);
  // A fresh roster repaints the open identity from confirmed state.
  const roster = between("function renderAgentsResult(result, teamId)", "function latestActivityForRole");
  assert.match(roster, /if \(session\.selectedAgentId\) renderAgentIdentity\(\);/);
});

test("empty states follow the three-part formula and are built without markup assembly", () => {
  // Name the absence, say what fills it, make the next step possible here.
  assert.match(shell, /<strong>No sessions yet<\/strong><p>A session is one stretch of work on one assignment/);
  assert.match(shell, /data-agent-sessions-empty[^>]*>[\s\S]*?data-view-link="overview">Talk to your Product Manager</);
  assert.match(shell, /<strong>No code changes yet<\/strong>/);
  const agentBlock = between("function crewTileAgentId(target)", "function resetDeliveryRecords(");
  assert.doesNotMatch(agentBlock, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(agentBlock, /\.style\b/);
});

test("role hues paint only under selectors scoped to the roster's role key", () => {
  // Walk every rule that paints with a role token: its selector must be
  // pinned to [data-role-key=...]. Identity colour on the monogram that
  // names the agent - never on chrome, never keyed to anything but the role.
  // ONE deliberate exception, from the design system itself: merged work
  // carries the engineers' azure ([data-status="merged"]) — merged work is
  // theirs, and the signature is scoped to that exact state and nothing else.
  const chunks = css.replace(/\/\*[\s\S]*?\*\//g, "").split("}");
  let painted = 0;
  for (const chunk of chunks) {
    const brace = chunk.lastIndexOf("{");
    if (brace === -1) continue;
    const selector = chunk.slice(0, brace);
    const body = chunk.slice(brace + 1);
    if (!/var\(--role-/.test(body)) continue;
    painted += 1;
    assert.match(selector, /\[data-role-key=|\[data-status="merged"\]/,
      `role hue outside a role-scoped selector: ${selector.trim().slice(0, 80)}`);
  }
  assert.ok(painted >= 4, `expected the four role monogram rules, found ${painted}`);
  // And the monogram element is where app.js stamps the key it reads back.
  assert.match(app, /ui\.agentMonogram\.dataset\.roleKey = role\.key/);
});
