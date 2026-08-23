"use strict";

// The teams surface and the first-run setup grid, ported from the design
// system's factory_app kit. These pin the port's four commitments:
//
//   1. Tiles are the real roster: they render from session.teams and their
//      objective meters go through objectiveAcceptanceState — the ONE
//      classifier the instrument strip and the objectives view already
//      share — so a tile can never call proven what the records below call
//      regressed. A tile is a door, and the door actually opens.
//   2. Per-team counts come from one capped, generation-guarded fan-out; a
//      team the fan-out did not reach renders an em dash, never a zero.
//   3. The charts are derived, not fabricated: swimlane spans merge real
//      timestamps within a gap threshold, the role bars count real events,
//      the window shrinks to what the capped buffer can vouch for, and no
//      chart library, innerHTML, or element.style ships any of it.
//   4. The first-run grid keeps every pinned fragment (the h1, the one
//      static input, the picker between name and price) and adds only what
//      has a backend — the kit's three setup switches have none and stay out.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");
const layout = readFileSync("_layouts/app.html", "utf8");

function between(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return source.slice(start, end);
}

/* ---- the surface ships, is registered, and every hook has a reader ------ */

test("the teams surface is registered, shipped in the shell, and every hook has a reader", () => {
  assert.match(shell, /<section class="wview" data-view="dashboard" id="workspace-dashboard" aria-labelledby="workspace-dashboard-title">/);
  // The teams surface leads the ORGANIZATION scope: it is about the account
  // and every team in it, which is exactly what makes it wrong under a "this
  // team" heading. The rail says "Teams" because that is what the mockup's
  // organization group says, and the count beside it is the roster's own.
  assert.match(views, /const ORG_VIEWS = \["dashboard", "people", "billing"\];/);
  const teamsDoor = shell.match(/<a class="dn-nav dn-bare" data-view-link="dashboard" href="#workspace-dashboard">[\s\S]*?<\/a>/);
  assert.ok(teamsDoor, "the teams door is missing from the rail");
  assert.match(teamsDoor[0], /<span class="dn-nav__label">Teams<\/span>/);
  assert.match(teamsDoor[0], /data-rail-team-count/);
  for (const hook of [
    "data-team-tiles", "data-team-tiles-empty", "data-team-tiles-state", "data-team-tiles-note",
    "data-lane-chart", "data-lanes-empty", "data-lanes-window",
    "data-role-bars", "data-role-bars-empty", "data-role-bars-window", "data-role-bars-legend"
  ]) {
    assert.ok(new RegExp(`${hook}(?![\\w-])`).test(shell), `shell is missing ${hook}`);
    assert.ok(app.includes(`[${hook}]`), `app.js never reads ${hook}`);
  }
  // Multi-team workspaces land here; one team lands on its own floor — and
  // the choice latches so a roster change never yanks the reader elsewhere.
  assert.match(views, /if \(!landedInWorkspace\) \{\s*\n\s*landedInWorkspace = true;\s*\n\s*if \(teamCount\(\) > 1\) currentView = "dashboard";/);
  // The lifecycle rows moved with their hooks intact: same list, same empty,
  // still the router's own coarse signal.
  const dashboard = between(shell, 'data-view="dashboard"', 'data-view="overview"');
  assert.match(dashboard, /data-teams-empty/);
  assert.match(dashboard, /data-team-list/);
});

/* ---- (1) tiles are the real roster, through the shared classifier ------- */

test("tiles render from session.teams through objectiveAcceptanceState, with no markup assembly", () => {
  const render = between(app, "function renderTeamTiles()", "function openTeamFromTiles(");
  assert.match(render, /session\.teams/);
  assert.match(render, /session\.objectiveListsByTeam\.get\(id\)/);
  assert.match(render, /knownTeamRepositoryIds\(id\)/);
  const meter = between(app, "function teamTileMeter(objectives)", "function renderTeamTiles()");
  assert.match(meter, /objectiveAcceptanceState\(objective\)/);
  assert.match(meter, /dataset\.state = objectiveAcceptanceState\(objective\)/);
  // One classifier in the whole file: the strip, the objectives view and the
  // tiles all call the same function, so the surfaces cannot disagree.
  assert.equal((app.match(/function objectiveAcceptanceState\(/g) || []).length, 1);
  // The whole dashboard block builds DOM, never strings, never styles.
  const block = between(app, "function dashboardFanoutTeams(teams)", "const economicsGroupDefinitions");
  assert.doesNotMatch(block, /innerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(block, /\.style\b/);
  assert.doesNotMatch(block, /Math\.random/);
});

test("the tile chip speaks lifecycle first, the human queue second, proof third", () => {
  const source = between(app, "function teamTileChip(team, objectives, stats)", "// The line under the name");
  const lifecycleLabel = (value) => (typeof value === "string" ? value : "");
  const launchContract = { provisioningPresentation: (provisioning) => provisioning || {} };
  const objectiveAcceptanceState = (objective) => objective.state;
  const chip = new Function(
    "lifecycleLabel", "launchContract", "objectiveAcceptanceState",
    `${source}; return teamTileChip;`
  )(lifecycleLabel, launchContract, objectiveAcceptanceState);

  assert.deepEqual(chip({ state: "pending" }, undefined, undefined), { tone: "attention", word: "Awaiting payment" });
  assert.deepEqual(chip({ state: "created", provisioning: { failed: true } }, undefined, undefined), { tone: "error", word: "Needs attention" });
  assert.deepEqual(chip({ state: "suspended" }, undefined, undefined), { tone: "idle", word: "Paused" });
  // A pending decision outranks everything on an active team.
  assert.deepEqual(chip({ state: "active" }, [{ state: "proven" }], { approvalsLoaded: true, pendingApprovals: 2 }), { tone: "attention", word: "Needs you" });
  // A proof that stopped holding is never folded into complete.
  assert.deepEqual(chip({ state: "active" }, [{ state: "proven" }, { state: "regressed" }], { approvalsLoaded: true, pendingApprovals: 0 }), { tone: "error", word: "Regressed" });
  assert.deepEqual(chip({ state: "active" }, [{ state: "proven" }, { state: "proven" }], undefined), { tone: "success", word: "Complete" });
  // Unloaded objectives claim nothing: the team is running, that is all.
  assert.deepEqual(chip({ state: "active" }, undefined, undefined), { tone: "live", word: "Working" });
});

test("a tile is a door: the click selects the team, and the router walks to the floor", () => {
  const source = between(app, "function openTeamFromTiles(event)", "// ── Who worked when");
  class StubElement { constructor(closest) { this.closest = closest; } }
  const makeContext = (selectedTeamId) => {
    const calls = { refresh: 0, reset: 0 };
    const ui = {
      teamTiles: { contains: () => true },
      teamSelect: { value: "" }
    };
    const session = { teams: [{ id: "team-1" }, { id: "team-2" }], selectedTeamId, selectedAgentId: "agent-9" };
    const door = new Function(
      "ui", "session", "stringValue", "resetAgentDetailView", "refreshSelectedTeam", "Element",
      `${source}; return openTeamFromTiles;`
    )(ui, session, (value) => (typeof value === "string" ? value : ""), () => { calls.reset += 1; }, () => { calls.refresh += 1; }, StubElement);
    return { door, ui, session, calls };
  };
  const eventFor = (teamId) => {
    const tile = { dataset: { teamOpen: "true", teamId } };
    return { target: new StubElement((selector) => (selector === "[data-team-open]" ? tile : null)) };
  };

  const opened = makeContext("team-1");
  opened.door(eventFor("team-2"));
  assert.equal(opened.ui.teamSelect.value, "team-2");
  assert.equal(opened.session.selectedTeamId, "team-2");
  assert.equal(opened.session.selectedAgentId, "", "a team switch closes the open agent record");
  assert.equal(opened.calls.refresh, 1);

  // A tile for a team the roster does not confirm opens nothing.
  const unknown = makeContext("team-1");
  unknown.door(eventFor("team-9"));
  assert.equal(unknown.ui.teamSelect.value, "");
  assert.equal(unknown.calls.refresh, 0);

  // Re-opening the already-selected team syncs the select and refetches nothing.
  const same = makeContext("team-2");
  same.door(eventFor("team-2"));
  assert.equal(same.ui.teamSelect.value, "team-2");
  assert.equal(same.calls.refresh, 0);

  // The router's half of the same click: the surface walks to the floor.
  assert.match(views, /teamTiles\.addEventListener\("click"[\s\S]*?closest\("\[data-team-open\]"\)[\s\S]*?setView\("overview"\)/);
});

/* ---- (2) the fan-out: capped, guarded, armed only on this surface ------- */

test("the fan-out serves at most six active teams and reports the overflow", () => {
  const source = between(app, "function dashboardFanoutTeams(teams)", "function repositoryLabelIndex()");
  const fanout = new Function(
    "stringValue", "lifecycleLabel",
    `${source}; return dashboardFanoutTeams;`
  )((value) => (typeof value === "string" ? value : ""), (value) => (typeof value === "string" ? value : ""));
  const team = (id, state) => ({ id, state });
  const eight = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => team(`team-${n.toString()}`, "active"));
  const result = fanout([...eight, team("team-p", "pending"), team("team-d", "deleting")]);
  assert.equal(result.chosen.length, 6, "the fan-out is capped at six teams");
  assert.equal(result.overflow, 2, "teams beyond the cap are counted, not silently dropped");
  assert.ok(result.chosen.every((candidate) => candidate.state === "active"), "only active teams are fetched — the rest cannot answer");
  assert.deepEqual(fanout([team("team-p", "pending")]), { chosen: [], overflow: 0 });
});

test("the fan-out is generation-guarded, reuses the validated loaders, and re-arms on failure", () => {
  const ensure = between(app, "async function ensureDashboardStats()", "function teamTileChip(");
  assert.match(ensure, /\+\+session\.dashboardGeneration/);
  assert.match(ensure, /if \(generation !== session\.dashboardGeneration\) return;/);
  assert.match(ensure, /if \(failures\) dashboardLoadKey = "";/);
  const loader = between(app, "async function loadDashboardTeamStats(team)", "async function ensureDashboardStats()");
  // The shared, validated helpers — never a second parser for the same data.
  assert.match(loader, /listAllObjectives\(teamId\)/);
  assert.match(loader, /validPendingApproval\(approval, teamId\)/);
  assert.match(loader, /session\.objectiveListsByTeam\.set\(teamId, objectivesResult\.value\)/);
  assert.match(loader, /githubIssueStateLabel\(record\?\.state\) === "open"/);
  assert.match(loader, /githubPullRequestStateLabel\(record\?\.state\) === "open"/);
  // Armed only while the surface is on screen: the router's own class stamp
  // is the signal, observed one-way like every other coupling between the
  // two files.
  assert.match(app, /dashboardSection\.classList\.contains\("is-active"\)/);
  assert.match(app, /new MutationObserver\(armDashboard\)\.observe\(dashboardSection, \{ attributes: true, attributeFilter: \["class"\] \}\)/);
  // An unloaded team is a dash, never a zero.
  const render = between(app, "function renderTeamTiles()", "function openTeamFromTiles(");
  assert.match(render, /delivery\.textContent = "—";/);
});

/* ---- (3) derived charts: spans from real timestamps, honest windows ----- */

test("swimlane spans are derived from real timestamps, never fabricated", () => {
  const source = between(app, "function deriveAgentSpans(entries, options)", "function laneRoster()");
  const derive = new Function(`${source}; return deriveAgentSpans;`)();
  const now = 1_000_000_000;
  const minute = 60 * 1000;
  const options = { now, windowMs: 40 * minute, gapMs: 3 * minute, minSpanMs: 45 * 1000 };
  const at = (minutesAgo) => now - minutesAgo * minute;

  // Contiguous activity merges into one span; a longer silence splits it.
  const lanes = derive([
    { agentId: "a", at: at(30) }, { agentId: "a", at: at(29) }, { agentId: "a", at: at(28) },
    { agentId: "a", at: at(10) },
    { agentId: "b", at: at(5) }
  ], options);
  const a = lanes.get("a");
  assert.equal(a.length, 2, "a 18-minute silence is two spans, not one invented stretch");
  assert.equal(a[0].start, at(30));
  assert.equal(a[0].end, at(28));
  assert.equal(a[1].start, at(10));
  assert.equal(a[1].end, at(10) + 45 * 1000, "a lone event gets only the minimum visual length");
  assert.equal(lanes.get("b").length, 1);

  // Events outside the window, in the future, or without an agent are ignored.
  const filtered = derive([
    { agentId: "a", at: at(41) },
    { agentId: "a", at: now + minute },
    { agentId: "", at: at(5) },
    { at: at(5) }
  ], options);
  assert.equal(filtered.size, 0, "nothing inside the window means no lanes — never an invention");

  // A span never escapes the window: the clip is to [now - windowMs, now].
  const clipped = derive([{ agentId: "a", at: now - 10 * 1000 }], options);
  assert.equal(clipped.get("a")[0].end, now, "the minimum length never extends a span past now");
});

test("the chart windows shrink to what the capped buffer can vouch for", () => {
  const window = between(app, "function dashboardChartWindow(defaultMs)", "function renderDashboardLanes()");
  assert.match(window, /session\.activityEvents\.length >= 80/);
  assert.match(window, /Math\.min\(ms, now - oldest\)/);
  // Both labels carry the real minutes, so a shrunk window is announced.
  const lanesRender = between(app, "function renderDashboardLanes()", "const roleBarFamilies");
  assert.match(lanesRender, /last \$\{window\.minutes\.toString\(\)\}m/);
  const bars = between(app, "function renderRoleBars()", "function renderDashboardCharts()");
  assert.match(bars, /last \$\{window\.minutes\.toString\(\)\}m by role/);
  // Bars are counts of real events bucketed by real times — no interpolation.
  assert.match(bars, /buckets\[index\]\.set\(family\.key, \(buckets\[index\]\.get\(family\.key\) \|\| 0\) \+ 1\)/);
});

test("every dashboard reading has an honest empty, and the sparks are omitted rather than faked", () => {
  const lanesRender = between(app, "function renderDashboardLanes()", "const roleBarFamilies");
  assert.match(lanesRender, /"No team selected"/);
  assert.match(lanesRender, /"No crew roster loaded"/);
  assert.match(lanesRender, /"Quiet on the stream"/);
  const bars = between(app, "function renderRoleBars()", "function renderDashboardCharts()");
  assert.match(bars, /"No recent actions"/);
  // No honest 7-point per-team series exists client-side (economics is one
  // snapshot; the buffer is recent and selected-team only), so the kit's
  // trend sparks do not ship. If a spark appears here, its series must be
  // fetched from a served history first.
  const block = between(app, "function dashboardFanoutTeams(teams)", "const economicsGroupDefinitions");
  assert.doesNotMatch(block, /spark|trend/i);
});

test("charts ship as DOM through the adopted stylesheet — no library, no inline style, no animation", () => {
  // No chart library anywhere near the page: dependencies and the app layout
  // stay clean, and the CSP's script-src has no chart CDN to widen for.
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const dependencyNames = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).join(" ");
  assert.doesNotMatch(dependencyNames, /chart/i);
  assert.doesNotMatch(layout, /chart/i);
  // Geometry goes through the same adopted sheet as the gauges, prefixed and
  // purged per renderer so rebuilt chart nodes cannot leak rules.
  const geometry = between(app, "function purgeChartGeometry(prefix)", "// When this team came into existence, for separating");
  assert.match(geometry, /gaugeSheet\.insertRule/);
  assert.match(geometry, /data-gauge/);
  assert.doesNotMatch(geometry, /\.style\b/);
  assert.match(app, /purgeChartGeometry\("c"\)/);
  assert.match(app, /purgeChartGeometry\("t"\)/);
  // The chart layer never animates: a chart that moves is answering nothing.
  // (Comments stripped — the layer's own header names the rule it obeys.)
  const layerMarker = css.indexOf("DASHBOARD KIT LAYER");
  assert.notEqual(layerMarker, -1, "the dashboard kit layer is missing from main.css");
  const layerStart = css.lastIndexOf("/*", layerMarker);
  const chartCss = css.slice(layerStart).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(chartCss, /animation/);
  // Colour in the charts is meaning only: every hue lands under a role or
  // state scope (the achromatic walker enforces the rule globally; this pins
  // the two chart-specific scopes by name).
  assert.match(css, /\.lane-span\[data-role-key="AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER"\] \{ background: var\(--role-pm\); \}/);
  assert.match(css, /\.team-tile-segments i\[data-state="proven"\] \{ background: var\(--status-success-dot\); \}/);
  assert.match(css, /\.team-tile-segments i\[data-state="regressed"\] \{ background: var\(--status-danger-dot\); \}/);
});

/* ---- (4) the first-run grid: pinned fragments kept, honesty added ------- */

test("the setup grid ships the kit's right column and stands down with the form", () => {
  assert.match(shell, /<div class="setup-grid">/);
  assert.match(shell, /<aside class="firstrun-aside"/);
  // Six who arrive, named by the same role keys the roster paints with.
  assert.equal((shell.match(/crew-preview-row/g) || []).length, 6);
  for (const key of ["AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", "AGENT_ROLE_ENGINEERING_MANAGER", "AGENT_ROLE_PRODUCT_DESIGNER", "AGENT_ROLE_STAFF_CLIENT", "AGENT_ROLE_STAFF_BACKEND", "AGENT_ROLE_STAFF_PLATFORM"]) {
    assert.ok(shell.includes(`data-role-key="${key}"`), `the crew preview is missing ${key}`);
  }
  // What happens next keeps the corrected order: briefing, interview, the
  // sign-off that locks the record, and proof by acceptance runs.
  const nextList = between(shell, '<ol class="next-list">', "</ol>");
  assert.equal((nextList.match(/<li>/g) || []).length, 4);
  assert.match(nextList, /reads every repository/);
  assert.match(nextList, /opens the conversation/);
  assert.match(nextList, /You sign off the PRD\./);
  assert.match(nextList, /signed discussion is locked as the record/);
  assert.match(nextList, /acceptance runs on your default branch/);
  // The aside hides under exactly the conditions that hide the form.
  assert.match(css, /\.app-body \.firstrun-inner:has\(\[data-step="organization"\]\[data-state="action"\], \[data-step="organization"\]\[data-state="error"\], \[data-step="github"\]\[data-state="action"\], \[data-step="github"\]\[data-state="error"\], \[data-step="repositories"\]\[data-state="blocked"\], \[data-step="repositories"\]\[data-state="error"\]\) \.firstrun-aside\{ display:none; \}/);
});

test("the closing note counts real repositories and the repo rows tell the truth", () => {
  assert.match(shell, /data-firstrun-count/);
  const note = between(app, "function renderFirstrunRepositoryCount()", "function renderBillingPlanResult(");
  assert.match(note, /selectedRepositoryIdsFromForm\(\)\.length/);
  assert.match(note, /session\.repositories\.length/);
  assert.match(note, /of \$\{total\.toString\(\)\} repositories/);
  // Hidden while there is nothing real to count — never "0 of 0".
  assert.match(note, /ui\.firstrunCount\.hidden = true/);
  // The kit's access column reads team membership, not an access level the
  // checkbox does not control: every listed repository is already granted.
  assert.match(app, /state\.textContent = checkbox\.checked \? "Included" : "Not included";/);
  assert.doesNotMatch(shell, /Read \+ write|No access/);
});

test("the kit's backend-less setup switches stay out", () => {
  // CrewSetup.jsx ships three switches — a merge sign-off gate, an
  // issue-opening toggle, and objective-met email — none of which exists on
  // this platform's API. A switch with no backend is a promise the server
  // cannot keep, so none of them ships; the engineer stepper stays in
  // Settings by the create screen's own pinned design.
  assert.doesNotMatch(shell, /Require your sign-off before any merge/);
  assert.doesNotMatch(shell, /Let the (crew|team) open issues/);
  assert.doesNotMatch(shell, /Email me when an objective is met/);
  assert.doesNotMatch(shell, /setup-switches/);
  assert.doesNotMatch(shell, /data-engineer-input/);
});
