"use strict";

// The Runs screen.
//
// A run is one stretch of work in one workspace, and the platform keeps two
// customer-readable halves of it: the session's lifecycle and the files it
// changed. Both are already fetched for the whole team in the floor's burst,
// so this screen renders records the workspace holds rather than opening
// reads of its own — and its paging drives the same two loaders the floor's
// does, off the same cursors, so the two can never disagree about whether
// more exists.
//
// What it deliberately does not render is the inside of a run. Spans,
// generations, token counts and time to first token are not on the wire for a
// customer at all, so that panel is `uninstrumented` rather than an empty
// trace drawn to look like a reading.
//
// What a run cost is a third fact, and it comes from the measured ledger
// grouped by run — the lifecycle record carries no money whatsoever.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/console.css", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

const renderer = (name, next) =>
  app.slice(app.indexOf(`function ${name}(`), app.indexOf(`function ${next}(`));

const screen = () => {
  const start = shell.indexOf('data-view="runs"');
  assert.notEqual(start, -1, "the runs view is missing");
  return shell.slice(start, shell.indexOf("<!-- ===== PEOPLE", start));
};

test("both halves of a run are real procedures a customer can reach", () => {
  assert.match(client, /case "sessions":[\s\S]*?sessionHistory\.listSessions/);
  assert.match(client, /case "workspace_changes":[\s\S]*?workspaceHistory\.listWorkspaceChanges/);
  assert.match(client, /"sessions",\n\s*"workspace_changes",/, "both must be on the supported list");
  // Fetched once for the team, in the burst the floor already pays for.
  assert.match(app, /apiRequest\("sessions", \{ teamId: team\.id, page: \{ pageSize: 100 \} \}\)/);
  assert.match(app, /apiRequest\("workspace_changes", \{ teamId: team\.id, afterSequence: "0", page: \{ pageSize: 100 \} \}\)/);
});

test("the screen opens no read of its own and pages through the floor's loaders", () => {
  const view = renderer("renderRunsView", "renderRunSessions");
  assert.doesNotMatch(view, /apiRequest\(/, "Runs renders held state; it never fetches");
  assert.match(app, /ui\.runsSessionsMore\.addEventListener\("click", loadMoreSessions\)/);
  assert.match(app, /ui\.runsChangesMore\.addEventListener\("click", loadMoreWorkspaceChanges\)/);
  // Its buttons derive from the same cursors the floor's do rather than
  // mirroring another button's attributes.
  const sessions = renderer("renderRunSessions", "renderRunChanges");
  assert.match(sessions, /pager\.hidden = !session\.sessionNextPageToken/);
  assert.match(sessions, /pager\.disabled = Boolean\(session\.sessionHistoryLoading\)/);
  const changes = renderer("renderRunChanges", "renderRunSpend");
  assert.match(changes, /pager\.hidden = !session\.workspaceNextPageToken/);
});

test("a session's state is a word, and its loudness comes from the one ladder", () => {
  assert.match(app, /const SESSION_NOTICE_LEVEL = Object\.freeze\(\{/);
  for (const [status, level] of [
    ["started", "running"], ["running", "running"], ["waiting", "warning"], ["paused", "warning"],
    ["blocked", "blocked"], ["succeeded", "success"], ["failed", "error"], ["cancelled", "info"],
  ]) {
    assert.match(app, new RegExp(`${status}: "${level}"`), `${status} is not on the ladder`);
  }
  // The tone is taken from notice-levels, never decided here.
  const badge = renderer("ladderBadge", "monoCell");
  assert.match(badge, /noticeLevels\?\.levelClass\?\.\("dn-badge", levelName\)/);
  assert.match(badge, /badge\.textContent = word/, "the word is the content, so the state reads in greyscale");
  assert.doesNotMatch(app, /const TONE_BY_STATUS|const STATUS_COLOUR/i, "no second opinion about severity");
});

test("every empty on this screen names its kind and what would change it", () => {
  const sessions = renderer("renderRunSessions", "renderRunChanges");
  assert.match(sessions, /setDataState\(host, "unavailable"[\s\S]*No team is selected/);
  assert.match(sessions, /setDataState\(host, "unavailable"[\s\S]*Nothing here is a count of zero/);
  assert.match(sessions, /setDataState\(host, "pending"[\s\S]*action: \{ label: "Talk to your Product Manager", view: "overview" \}/);
  const changes = renderer("renderRunChanges", "renderRunSpend");
  assert.match(changes, /setDataState\(host, "pending"/);
  // Never an empty table implying the rows failed to arrive.
  assert.doesNotMatch(sessions, /replaceWithTable\(host, \[[\s\S]*?\], \[\]\)/);
});

test("the inside of a run is uninstrumented, and says so rather than drawing a blank trace", () => {
  const trace = renderer("renderRunTrace", "renderPeopleView");
  assert.match(trace, /setDataState\(host, "uninstrumented"/);
  assert.match(trace, /no procedure serves the observations/);
  // There is genuinely nothing to call: no trace, span or observation
  // procedure exists on the supported list.
  assert.doesNotMatch(client, /"(?:traces?|spans?|observations?)",/);
  // And no trace markup ships pretending otherwise.
  assert.doesNotMatch(screen(), /dn-trace/);
});

test("what a run cost comes from the measured ledger, grouped by run", () => {
  // The lifecycle record has no money on it at all, so the only honest source
  // is the ledger's own per-run grouping.
  assert.match(app, /const SESSION_SPEND_GROUP = Object\.freeze\(\{ key: "session", label: "Run", scopeType: 11 \}\)/);
  assert.match(app, /listAllEconomicsBreakdowns\(team\.id, SESSION_SPEND_GROUP\)/);
  assert.match(client, /session: EconomicsScopeType\.SESSION/);
  const accept = renderer("renderSessionSpendResult", "resetApprovalView");
  assert.match(accept, /session\.sessionSpendState = "unavailable"/,
    "a rejected read must never leave a run looking free");
  const spend = renderer("renderRunSpend", "sessionAgentIdFor");
  assert.match(spend, /setDataState\(host, "unavailable"[\s\S]*did not return a per-run breakdown/);
  assert.match(spend, /setDataState\(host, "loading"/);
  assert.match(spend, /setDataState\(host, "pending"/);
  assert.match(spend, /formatCreditMicros\(credits\)/, "credits, not a cost figure the customer does not pay");
});

test("the tables scroll inside their own box and build their cells with the DOM", () => {
  assert.match(css, /\.cs-tablewrap \{\s*\n\s*overflow-x: auto;/);
  assert.match(css, /\.cs-tablewrap td, \.cs-tablewrap th \{ white-space: nowrap; \}/,
    "a column narrow enough to break a file path per character is not a table");
  assert.match(css, /\.cs-tablewrap \.cs-cell-prose \{\s*\n\s*min-width: 26ch;/);
  const table = renderer("dataTable", "replaceWithTable");
  assert.match(table, /document\.createElement\("table"\)/);
  assert.doesNotMatch(table, /innerHTML|outerHTML|insertAdjacentHTML/);
  // Added and removed carry their sign and their column name, so the pair
  // reads without the hue.
  assert.match(css, /\.cs-tablewrap \[data-tone="add"\] \{ color: var\(--diff-add-fg\); \}/);
  assert.match(app, /\{ label: "Added", numeric: true \}/);
  assert.match(app, /\{ label: "Removed", numeric: true \}/);
  // A counted nought is a nought, not a signed one.
  assert.match(app, /additions === 0n \? "0"/);
  assert.match(app, /deletions === 0n \? "0"/);
});
