"use strict";

// A GitHub webhook wake is a business_objectives row, and the console
// rendered one on the floor: "On now: Triage: Burner-Mason/Website#1 -
// __node_id_probe__" with the raw agent dispatch - tool names, a
// [gh-delivery:UUID] marker - as its description. BusinessObjective.origin
// now says who a row speaks to, and the console drops DISPATCH rows at its
// single ingestion point so all eleven consumers of objectiveListsByTeam
// agree without separate filters.

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

test("dispatch-origin objectives are dropped at the single ingestion point", () => {
  assert.match(app, /const OBJECTIVE_ORIGIN_DISPATCH = 2;/);
  const ingest = between("async function listAllObjectives", "function renderObjectivesResult");
  assert.match(ingest, /if \(Number\(objective\?\.origin\) === OBJECTIVE_ORIGIN_DISPATCH\) continue;/);
  // The drop happens AFTER validation and dedupe: a malformed dispatch row
  // still rejects the page, and its id still counts against duplicates.
  const dropAt = ingest.indexOf("OBJECTIVE_ORIGIN_DISPATCH) continue");
  const validateAt = ingest.indexOf("returned an invalid or duplicate team objective");
  const dedupeAt = ingest.indexOf("seenIds.add(id)");
  assert.ok(validateAt >= 0 && dedupeAt > validateAt && dropAt > dedupeAt, "filter must follow validation and dedupe");
});

test("listAllObjectives keeps customer and unspecified rows, drops dispatch rows", async () => {
  const slice = between("const OBJECTIVE_ORIGIN_DISPATCH = 2;", "function renderObjectivesResult");
  const rows = [
    { id: "a", teamId: "team-1", origin: 1, dispatch: {}, kpis: [] },
    { id: "b", teamId: "team-1", origin: 2, dispatch: {}, kpis: [] },
    { id: "c", teamId: "team-1", dispatch: {}, kpis: [] }
  ];
  const harness = new Function(
    "apiRequest", "ApiError", "stringValue", "validObjectiveDispatch", "validObjectiveKpis",
    `${slice}\nreturn listAllObjectives;`
  );
  const listAllObjectives = harness(
    async () => ({ objectives: rows, page: {} }),
    class ApiError extends Error { constructor(message) { super(message); } },
    (value) => (typeof value === "string" ? value : ""),
    () => true,
    () => true
  );
  const kept = await listAllObjectives("team-1");
  assert.deepEqual(kept.map((objective) => objective.id), ["a", "c"], "customer (1) and unspecified (absent) rows render; dispatch (2) does not");
});

test("a duplicate id on a dispatch row still rejects the page", async () => {
  const slice = between("const OBJECTIVE_ORIGIN_DISPATCH = 2;", "function renderObjectivesResult");
  const rows = [
    { id: "a", teamId: "team-1", origin: 2, dispatch: {}, kpis: [] },
    { id: "a", teamId: "team-1", origin: 1, dispatch: {}, kpis: [] }
  ];
  const harness = new Function(
    "apiRequest", "ApiError", "stringValue", "validObjectiveDispatch", "validObjectiveKpis",
    `${slice}\nreturn listAllObjectives;`
  );
  const listAllObjectives = harness(
    async () => ({ objectives: rows, page: {} }),
    class ApiError extends Error { constructor(message) { super(message); } },
    (value) => (typeof value === "string" ? value : ""),
    () => true,
    () => true
  );
  await assert.rejects(() => listAllObjectives("team-1"), /invalid or duplicate/, "hidden rows still participate in integrity checks");
});
