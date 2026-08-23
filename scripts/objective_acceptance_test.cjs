"use strict";

// Business objectives got their own screen when acceptance evidence arrived:
// satisfied_at plus one check-run observation per objective, served by the
// platform. These pin the three promises that make the screen trustworthy:
// proven, regressed and never-run are three different facts classified by ONE
// function that the instrument strip counts with too (the two surfaces can
// never disagree); a check-run URL earns a link only after the same strict
// validation the PRD reference gets; and the view resurrects no second ask —
// objectives are set in conversation with the Product Manager, and this
// screen only inspects their delivery.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");
const tokens = readFileSync("assets/css/tokens.css", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

// The generated client surfaces timestamps as {seconds, nanos}; this mirrors
// app.js's own timestampDate closely enough to drive the classifier with
// real-shaped fixtures, including the unset case (absent, not zeroed).
const timestampDate = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(Number(timestamp.seconds || 0) * 1000 + Math.floor(Number(timestamp.nanos || 0) / 1_000_000));
  return Number.isNaN(date.getTime()) ? null : date;
};
const stringValue = (value) => (typeof value === "string" ? value.trim() : "");

test("the objectives view is registered, shipped in the shell, and every hook has a reader", () => {
  assert.match(views, /const VIEWS = \["overview", "economics", "approvals", "settings", "agent", "objectives", "dashboard"\];/);
  assert.match(shell, /<section class="wview" data-view="objectives" id="workspace-objectives" aria-labelledby="workspace-objectives-title">/);
  assert.match(shell, /id="workspace-objectives-title"/);
  for (const hook of ["data-objectives-view-state", "data-objectives-view-empty", "data-objectives-view-list"]) {
    assert.ok(new RegExp(`${hook}(?![\\w-])`).test(shell), `shell is missing ${hook}`);
    assert.ok(app.includes(`[${hook}]`), `app.js never reads ${hook}`);
  }
  // The way back is the agent view's own affordance, and the doors in are
  // ordinary view links: the overflow menu and the "On now" card.
  const section = shell.slice(shell.indexOf('data-view="objectives"'), shell.indexOf('data-view="agent"'));
  assert.match(section, /data-view-link="overview" href="#workspace-overview">Back to the floor</);
  assert.match(shell, /data-view-link="objectives" href="#workspace-objectives">Objectives</);
  const onnow = shell.slice(shell.indexOf("data-objective-record"), shell.indexOf("wspace-log"));
  assert.match(onnow, /data-view-link="objectives" href="#workspace-objectives"/,
    "the overview's at-a-glance card must carry a real door into the objectives view");
  // app.js loads the view's proposals on the same click the router switches on.
  assert.match(app, /data-view-link="objectives"[^\n]*ensureObjectivesViewWork/);
});

test("one classifier derives proven, regressed and unproven from real-shaped objectives (functional)", () => {
  const source = between("function failingAcceptance(objective)", "function renderStatStrip(")
    + between("function objectiveAcceptanceState(objective)", "function agentRoleLabel(");
  const { objectiveAcceptanceState } = new Function("stringValue", "timestampDate",
    `${source}; return { objectiveAcceptanceState, failingAcceptance };`)(stringValue, timestampDate);

  const acceptance = (conclusion) => ({
    checkRunName: "deep-navy/objective-6f9619ff-8b86-d011-b42d-00c04fc964ff",
    headSha: "3f785f2a1c0e9d4b8a7c6e5d4f3b2a1908c7d6e5",
    conclusion,
    checkRunUrl: "https://github.com/acme/storefront/runs/9182736450",
    observedAt: { seconds: 1755856800 }
  });
  // Proven: satisfied_at set while the latest run passes.
  assert.equal(objectiveAcceptanceState({ satisfiedAt: { seconds: 1755850000 }, acceptance: acceptance("success") }), "proven");
  // Regressed: the proof was revoked and the observation is a failing
  // terminal conclusion — a different fact from never-proven.
  assert.equal(objectiveAcceptanceState({ acceptance: acceptance("failure") }), "regressed");
  assert.equal(objectiveAcceptanceState({ acceptance: acceptance("timed_out") }), "regressed");
  assert.equal(objectiveAcceptanceState({ acceptance: acceptance("cancelled") }), "regressed");
  // Neutral and skipped assert nothing either way — never-run stays unproven,
  // mirroring failingAcceptance's own semantics.
  assert.equal(objectiveAcceptanceState({ acceptance: acceptance("neutral") }), "unproven");
  assert.equal(objectiveAcceptanceState({ acceptance: acceptance("skipped") }), "unproven");
  // Never-run: no observation at all.
  assert.equal(objectiveAcceptanceState({}), "unproven");
  assert.equal(objectiveAcceptanceState({ acceptance: {} }), "unproven");
  // satisfied_at is the server's word: while it stands, the objective is
  // proven whatever the latest observation says — the server clears it on a
  // real regression.
  assert.equal(objectiveAcceptanceState({ satisfiedAt: { seconds: 1755850000 }, acceptance: acceptance("failure") }), "proven");
});

test("the instrument strip and the objectives view count through the same classifier", () => {
  const strip = between("function renderStatStrip()", "function objectiveAcceptanceState(");
  assert.match(strip, /objectiveAcceptanceState\(objective\) === "proven"/);
  assert.match(strip, /objectiveAcceptanceState\(objective\) === "regressed"/);
  const view = between("function renderObjectivesView(", "function resetObjectivesView(");
  assert.match(view, /objectiveAcceptanceState\(objective\) === "proven"/);
  assert.match(view, /objectiveAcceptanceState\(objective\) === "regressed"/);
  // Each record's chip is the classifier's word too, not a re-derivation.
  const card = between("function objectiveCard(objective)", "function renderObjectivesView(");
  assert.match(card, /objectiveAcceptanceState\(objective\)/);
  assert.match(card, /"Proven"/);
  assert.match(card, /"Regressed"/);
  assert.match(card, /"Not proven yet"/);
});

test("a check-run URL earns a link only as a plain https GitHub URL (functional)", () => {
  const source = between("function acceptanceRunUrl(value)", "function acceptanceEvidence(");
  const acceptanceRunUrl = new Function("stringValue", `${source}; return acceptanceRunUrl;`)(stringValue);
  assert.equal(acceptanceRunUrl("https://github.com/acme/storefront/runs/9182736450"),
    "https://github.com/acme/storefront/runs/9182736450");
  assert.equal(acceptanceRunUrl("https://github.com/acme/storefront/actions/runs/91/job/7"),
    "https://github.com/acme/storefront/actions/runs/91/job/7");
  // Another scheme, another host, credentials, a port, a query, a fragment,
  // or a path without a repository renders no link at all.
  for (const rejected of [
    "http://github.com/acme/storefront/runs/1",
    "https://evil.example/acme/storefront/runs/1",
    "https://github.com.evil.example/acme/storefront/runs/1",
    "https://user:pass@github.com/acme/storefront/runs/1",
    "https://github.com:8443/acme/storefront/runs/1",
    "https://github.com/acme/storefront/runs/1?check_suite_focus=true",
    "https://github.com/acme/storefront/runs/1#step",
    "https://github.com/acme",
    "javascript:alert(1)",
    "not a url",
    ""
  ]) {
    assert.equal(acceptanceRunUrl(rejected), "", `must reject: ${rejected || "(empty)"}`);
  }
  // And the render path uses the validated value, never the raw field.
  const evidence = between("function acceptanceEvidence(objective)", "function objectiveEvidenceSection(");
  assert.match(evidence, /url: acceptanceRunUrl\(acceptance\.checkRunUrl\)/);
  const render = between("function objectiveEvidenceSection(", "function objectiveCardKpis(");
  assert.match(render, /if \(evidence\.url\)/);
  assert.match(render, /link\.rel = "noopener noreferrer"/);
  assert.match(render, /link\.referrerPolicy = "no-referrer"/);
  assert.match(render, /"Open the acceptance run"/);
});

test("the evidence record verifies every field or renders no detail line (functional)", () => {
  const source = between("function acceptanceRunUrl(value)", "function objectiveEvidenceSection(");
  const { acceptanceEvidence } = new Function("stringValue", "timestampDate",
    `${source}; return { acceptanceEvidence, acceptanceRunUrl };`)(stringValue, timestampDate);
  const record = {
    checkRunName: "deep-navy/objective-6f9619ff-8b86-d011-b42d-00c04fc964ff",
    headSha: "3F785F2A1C0E9D4B8A7C6E5D4F3B2A1908C7D6E5",
    conclusion: "success",
    checkRunUrl: "https://github.com/acme/storefront/runs/9182736450",
    observedAt: { seconds: 1755856800 },
    repositoryId: 91827n
  };
  const evidence = acceptanceEvidence({ id: "6f9619ff-8b86-d011-b42d-00c04fc964ff", acceptance: record });
  assert.equal(evidence.checkLabel, "deep-navy/objective-6f9619ff");
  assert.equal(evidence.sha, "3f785f2");
  assert.equal(evidence.conclusion, "success");
  assert.equal(evidence.url, "https://github.com/acme/storefront/runs/9182736450");
  assert.ok(evidence.observedAt instanceof Date);
  // Any field failing verification withdraws the whole detail line.
  assert.equal(acceptanceEvidence({ acceptance: { ...record, headSha: record.headSha.slice(0, 39) } }), null);
  assert.equal(acceptanceEvidence({ acceptance: { ...record, checkRunName: "codecov/patch" } }), null);
  assert.equal(acceptanceEvidence({ acceptance: { ...record, observedAt: undefined } }), null);
  assert.equal(acceptanceEvidence({ acceptance: { ...record, conclusion: "<img>" } }), null);
  // A bad URL costs only the link, never the evidence text.
  const textOnly = acceptanceEvidence({ acceptance: { ...record, checkRunUrl: "http://github.com/x/y" } });
  assert.equal(textOnly.url, "");
  assert.equal(textOnly.sha, "3f785f2");
  assert.equal(acceptanceEvidence({}), null);
});

test("proven, regressed and never-run render as three distinct designed states", () => {
  const render = between("function objectiveEvidenceSection(", "function objectiveCardKpis(");
  // Proven: the check run as mono evidence on the default branch.
  assert.match(render, /on the default branch @ \$\{evidence\.sha\}/);
  // Regressed reads differently from never-run: it says the proof existed.
  assert.match(render, /was proven · regressed @ \$\{evidence\.sha\}/);
  // Never-run: what belongs here, why it is empty, and no fake action — the
  // run is the crew's to produce, so the state is a sentence, not a CTA.
  assert.match(render, /Every objective is proven by tagged acceptance scenarios running on the default branch\./);
  assert.match(render, /No acceptance run has reported for this objective yet/);
  assert.doesNotMatch(render, /createElement\("button"\)|button-primary|button-secondary/);
  // The identifiers are mono, the times are tabular, and the proof hues live
  // only in state-scoped selectors — kelp for held, coral for regressed.
  assert.match(css, /\.objective-evidence-line \{[^}]*font-family: var\(--font-mono\)/);
  assert.match(css, /\.objective-proof-since time, \.objective-evidence time \{ font-variant-numeric: tabular-nums; \}/);
  assert.match(css, /\.objective-proof\[data-state="proven"\] \{[^}]*var\(--signal-ok\)/);
  assert.match(css, /\.objective-proof\[data-state="regressed"\] \{[^}]*var\(--signal-crit\)/);
  assert.ok((tokens.match(/--signal-ok:\s*#/g) || []).length >= 4,
    "the kelp text token must be defined for both themes and both explicit choices");
  // satisfied_at is rendered as a real time element, not prose.
  const card = between("function objectiveCard(objective)", "function renderObjectivesView(");
  assert.match(card, /timestampDate\(objective\.satisfiedAt\)/);
  assert.match(card, /evidenceTimeNode\(satisfiedAt\)/);
});

test("every surface speaks the dispatch row with one vocabulary", () => {
  // The record card's presentation is computed once; the "On now" card and
  // each objectives-view record apply the same words and tone.
  assert.match(app, /function objectiveDispatchPresentation\(dispatch\)/);
  assert.match(app, /function renderObjectiveDispatch\(dispatch\) \{\n    applyObjectiveDispatch\(ui\.objectiveDispatchState, ui\.objectiveDispatchDetail, dispatch\);\n  \}/);
  const card = between("function objectiveCard(objective)", "function renderObjectivesView(");
  assert.match(card, /applyObjectiveDispatch\(dispatchState, dispatchDetail, objective\.dispatch\)/);
  // The dispatch poll rewrites each card's line in place — no card rebuild,
  // which would collapse an open drill-in mid-read.
  const poll = between("async function pollObjectiveDispatch(teamId, generation)", "function validInitiative(");
  assert.match(poll, /refreshObjectiveCardDispatch\(objectives\)/);
});

test("the negative pins hold: this screen asks for nothing", () => {
  // Objectives are created in conversation with the Product Manager. The
  // form, its headline and its example chips stay gone, and the new view
  // ships no input of its own.
  assert.doesNotMatch(shell, /data-objective-form/);
  assert.doesNotMatch(shell, /Tracked objectives/);
  assert.doesNotMatch(shell, /What do you want built\?/);
  assert.doesNotMatch(shell, /data-objective-examples/);
  assert.doesNotMatch(app, /data-objective-examples/);
  const section = shell.slice(shell.indexOf('data-view="objectives"'), shell.indexOf('data-view="agent"'));
  assert.doesNotMatch(section, /<form|<input|<textarea|button-primary/);
});

test("the drill-in reuses the history contract: objective filters, shared builders, fail-closed scope", () => {
  // The lists ride the objectiveId filters the services already accept…
  assert.match(app, /apiRequest\("sessions", \{ teamId, objectiveId, page: \{ pageSize: 50 \} \}\)/);
  assert.match(app, /apiRequest\("workspace_changes", \{ teamId, objectiveId, afterSequence: "0", page: \{ pageSize: 50 \} \}\)/);
  // …validate through the same entry builders every other history uses…
  const sessions = between("function objectiveSessionEntries(", "function objectiveChangeEntries(");
  assert.match(sessions, /sessionHistoryEntry\(record, teamId\)/);
  assert.match(sessions, /outside the requested objective scope/);
  const changes = between("function objectiveChangeEntries(", "function renderObjectiveWorkList(");
  assert.match(changes, /workspaceHistoryEntry\(record, teamId, previousSequence\)/);
  assert.match(changes, /outside the requested objective scope/);
  // …render with the shared ledger item, and load only on first open.
  const workList = between("function renderObjectiveWorkList(", "async function loadObjectiveWork(");
  assert.match(workList, /activityLedgerItem\(entry, ""\)/);
  const work = between("function objectiveWorkSection(objective)", "function objectiveCard(");
  assert.match(work, /addEventListener\("toggle"/);
  assert.match(work, /if \(!details\.open \|\| loading \|\| loaded\) return;/);
  // Initiatives never load twice: the "On now" card's load fills the shared
  // cache, and the view's fan-out only fetches what is missing from it.
  assert.match(app, /session\.initiativesByObjective\.set\(objectiveId, initiatives\)/);
  const ensure = between("async function ensureObjectivesViewWork()", "// ── The console");
  assert.match(ensure, /!session\.initiativesByObjective\.has\(stringValue\(objective\.id\)\)/);
  assert.match(ensure, /listAllInitiatives\(stringValue\(objective\.id\)\)/);
});
