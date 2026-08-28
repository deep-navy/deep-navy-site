"use strict";

// Measured workspace storage streams to the console on the provisioning
// channel (TeamWorkspaceStorage, platform-protos ee74ecd): every frame can
// carry the current measurement, and a change-only frame fires when a new
// daily inventory report lands. The tile dates the number - a snapshot with
// latency must never present as live - and absence is PENDING, never zero.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  const end = app.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `source slice [${startMarker} … ${endMarker}] not found`);
  return app.slice(start, end);
}

test("the stat strip carries a dated storage tile with a pending state", () => {
  assert.match(shell, /data-stat-storage\b/);
  assert.match(shell, /data-stat-storage-note/);
  const strip = between("const storage = selectedTeam()?.workspaceStorage;", "function formatWorkspaceBytes");
  assert.match(strip, /measured \$\{relativeTime\(measured\)\}/, "the measurement must be dated, never presented as live");
  assert.match(strip, /first measurement pending/, "absence is pending, never zero");
  assert.doesNotMatch(strip, /setStatValue\(ui\.statStorage, "0/, "an absent measurement must not render as a zero");
});

test("storage frames apply from the stream and the initial status read", () => {
  const stream = between("const workspaceStorage = response?.workspaceStorage;", "if (status && team) {");
  assert.match(stream, /team\.workspaceStorage = workspaceStorage;/);
  assert.match(stream, /renderStatStrip\(\);/);
  assert.match(app, /if \(response\.workspaceStorage\) team\.workspaceStorage = response\.workspaceStorage;/);
});

test("every helper the storage rendering calls is defined", () => {
  // The platformRequest incident: a helper that does not exist throws a
  // ReferenceError swallowed somewhere quiet, and the surface just never
  // updates. Execute the formatter and assert the helpers exist by name.
  for (const helper of ["function formatWorkspaceBytes", "function relativeTime(", "function timestampDate", "function renderStatStrip"]) {
    assert.ok(app.includes(helper), `${helper} is not defined`);
  }
  const slice = between("function formatWorkspaceBytes", "function objectivePlateState");
  const formatter = new Function(`${slice}\nreturn formatWorkspaceBytes;`)();
  assert.equal(formatter(0), "0 B");
  assert.equal(formatter(512), "512 B");
  assert.equal(formatter(50 * 1024 ** 3), "50.0 GiB");
  assert.equal(formatter(1536), "1.5 KiB");
  assert.equal(formatter(250 * 1024 ** 3), "250 GiB");
  assert.equal(formatter(BigInt(2) * BigInt(1024 ** 4)), "2.0 TiB");
  assert.equal(formatter(-1), "—");
});
