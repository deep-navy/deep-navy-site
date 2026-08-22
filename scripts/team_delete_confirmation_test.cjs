"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const appSource = readFileSync(join(__dirname, "..", "assets", "js", "app.js"), "utf8");

// Deleting a team is the console's only action with no undo: the workspace is
// really destroyed (reclaim=Delete storage plus the 14-day version-hygiene
// window in the bucket), so the confirm affordance must demand the team's own
// name typed back, and the handler must re-check that phrase at fire time
// rather than trusting a button's disabled state.

test("the delete confirmation renders a typed-acknowledgement field gated on the team name", () => {
  assert.match(appSource, /data-team-delete-ack/, "the typed acknowledgement input must exist");
  assert.match(
    appSource,
    /confirmButton\.disabled = busy \|\| ackField\.value\.trim\(\) !== expected;/,
    "the confirm button must stay disabled until the typed phrase matches exactly"
  );
});

test("confirmTeamDeletion re-validates the typed phrase at fire time", () => {
  const handler = appSource.slice(appSource.indexOf("function confirmTeamDeletion"));
  assert.match(
    handler.slice(0, 1200),
    /ackField\.value\.trim\(\) !== deleteConfirmationPhrase\(team\)\) return;/,
    "the click handler must refuse when the phrase does not match, independent of render state"
  );
});

test("a nameless team can never be confirmed by an empty field", () => {
  assert.match(
    appSource,
    /return stringValue\(team\?\.name\)\.trim\(\) \|\| "delete";/,
    "the fallback phrase must be a fixed word, not an empty string an untouched field would match"
  );
});

test("a retry of an already-failed deletion keeps the two-step button instead of demanding the name again", () => {
  assert.match(appSource, /const retrying = lifecycleLabel\(team\?\.state\) === "deleting";/);
  assert.match(appSource, /if \(!retrying\) \{/);
});
