"use strict";

// The Activity screen: the ledger at full width.
//
// It holds no data of its own and opens no stream. renderActivityLedger sorts
// and filters the one buffer the floor's log already renders and hands the
// result to this screen, so a count, a filter and a row cannot disagree
// between the two surfaces. What this file pins:
//
//   - one buffer, one paint, two surfaces — and the arrival mark is read from
//     a snapshot so the row that just landed rises on whichever surface the
//     reader is actually looking at;
//   - one filter state, two toolbars, one delegated handler;
//   - no page-back control, because the contract has no procedure to page
//     with: the reach panel says so instead of growing a dead button;
//   - the empty says which of the four it is, chosen from the stream's own
//     state — and a filtered-empty is not an empty at all, it is a count, so
//     it is a callout rather than a DataState;
//   - the per-agent split counts the whole record, including the snapshot
//     projections, and says how much of the record could be attributed.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/console.css", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

const screen = () => {
  const start = shell.indexOf('data-view="activity"');
  assert.notEqual(start, -1, "the activity view is missing");
  return shell.slice(start, shell.indexOf("<!-- ===== RUNS", start));
};

const renderer = (name, next) =>
  app.slice(app.indexOf(`function ${name}(`), app.indexOf(`function ${next}(`));

test("the screen renders the team stream, which is the only activity a browser can reach", () => {
  // A stream and nothing else: there is no list procedure for past events, so
  // any "older" control would be a button with no call behind it.
  assert.match(client, /activity\.streamTeamActivity\(\{/);
  assert.doesNotMatch(client, /activity\.list/i);
  assert.doesNotMatch(screen(), /data-activity-screen-more|Load \d+ more/);
  const reach = renderer("renderActivityReach", "calloutCard");
  assert.match(reach, /no older page to load/);
});

test("one buffer paints both surfaces, and the arrival mark is shared not stolen", () => {
  const ledger = app.slice(app.indexOf("function renderActivityLedger()"), app.indexOf("const SETUP_SENTENCE"));
  assert.match(ledger, /const arrived = new Set\(session\.freshActivityIds\)/,
    "the mark must be snapshotted before the floor consumes it");
  assert.match(ledger, /renderActivityScreen\(shown, entries, allEntries, arrived\)/);
  const marks = ledger.indexOf('classList.add("dn-in-log")');
  const consumes = ledger.indexOf("freshActivityIds.delete");
  assert.ok(marks !== -1 && consumes !== -1 && marks < consumes);
  const screenRender = renderer("renderActivityScreen", "renderActivityScreenEmpty");
  assert.match(screenRender, /arrived\.has\(entry\.id\)/);
  // The screen's chrome is a mirror of what the floor's render already wrote,
  // so one place decides what the stream's state is called.
  assert.match(screenRender, /ui\.activityScreenState\.textContent = ui\.activityState\.textContent/);
  assert.match(screenRender, /ui\.activityScreenRetry\.hidden = ui\.activityRetry\.hidden/);
  assert.doesNotMatch(screenRender, /innerHTML|outerHTML|insertAdjacentHTML/);
});

test("one filter state drives both toolbars, through one delegated listener", () => {
  const markup = shell;
  assert.equal(markup.match(/data-activity-filters/g).length, 2);
  for (const category of ["all", "conversations", "sessions", "tools", "workspace", "delivery", "approvals", "provisioning", "cost"]) {
    assert.equal(markup.match(new RegExp(`data-activity-filter="${category}"`, "g")).length, 2,
      `${category} must exist on both toolbars`);
  }
  assert.match(app, /document\.addEventListener\("click", changeActivityFilter\)/);
  assert.match(app, /const button = event\.target instanceof Element \? event\.target\.closest\("\[data-activity-filter\]"\) : null/,
    "a delegated handler must tolerate a click that hits nothing");
});

test("the empty says which of the four it is, and a filtered empty is a count not an absence", () => {
  const empty = renderer("renderActivityScreenEmpty", "renderActivityAgentSplit");
  // A category we counted and found none of is a Callout — it explains what
  // you are looking at. Only a genuine absence gets a DataState.
  assert.match(empty, /if \(allEntries\.length\) \{[\s\S]*calloutCard\(\{/);
  assert.match(empty, /That is a count, not a gap/);
  for (const kind of ["unavailable", "loading", "pending"]) {
    assert.match(empty, new RegExp(`setDataState\\(host, "${kind}"`), `${kind} must be reachable`);
  }
  // Only the actionable one offers an action.
  assert.match(empty, /setDataState\(host, "pending",[\s\S]*action: \{ label: "Talk to your Product Manager", view: "overview" \}/);
  assert.doesNotMatch(app, /No data available/i);
});

test("the split counts the whole record and says how much of it names an agent", () => {
  // Snapshot projections carry their agent now; before that a session record
  // was an event with no author and every agent was undercounted.
  assert.match(app, /id: `session-history:\$\{id\}`,\s*\n\s*category: "sessions",[\s\S]{0,400}?\n\s*agentId,/);
  assert.match(app, /id: `workspace-change:\$\{id\}`,\s*\n\s*category: "workspace",\s*\n\s*agentId,/);
  const split = renderer("renderActivityAgentSplit", "renderActivityReach");
  assert.match(split, /allEntries\.filter\(\(entry\) => stringValue\(entry\.agentId\)\)/);
  assert.match(split, /name an agent/, "the meta line must say what share could be attributed");
  // Never a zero standing in for an absence.
  assert.match(split, /setDataState\(host, "unavailable"/);
  assert.match(split, /setDataState\(host, "pending"/);
  // Colour is identity and never alone: the row prints the role's code and
  // its name beside the tint.
  assert.match(split, /code: member\.role\.code/);
  assert.match(split, /name: crewDisplayName\(member\.role\)/);
});

test("the split's bars are drawn through CSSOM, and its hues mean a role", () => {
  const row = renderer("splitRow", "renderActivityScreen");
  assert.match(row, /setChartGeometry\(fill, \{ width: share \}, prefix\)/);
  assert.doesNotMatch(row, /\.style\./, "style attributes are refused by the shell's style-src");
  assert.match(app, /purgeChartGeometry\("ga"\)/, "the split's rules are purged before each rebuild");
  for (const role of ["AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", "AGENT_ROLE_ENGINEERING_MANAGER", "AGENT_ROLE_PRODUCT_DESIGNER", "AGENT_ROLE_ENGINEER"]) {
    assert.ok(css.includes(`.cs-splitrow__fill[data-role-key="${role}"]`), `${role} has no fill hue`);
  }
});
