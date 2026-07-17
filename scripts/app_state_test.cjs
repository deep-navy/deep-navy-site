"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const { AUTH_PHASES, authPresentation, progressSummary } = require("../assets/js/app-state.js");

test("authenticated chrome is impossible without a real in-memory access token", () => {
  const contradictory = authPresentation(AUTH_PHASES.AUTHENTICATED, false);
  assert.equal(contradictory.phase, AUTH_PHASES.SIGNED_OUT);
  assert.equal(contradictory.workspaceVisible, false);
  assert.equal(contradictory.signOutVisible, false);
  assert.equal(contradictory.userVisible, false);
  assert.equal(contradictory.signedOutVisible, true);

  const authenticated = authPresentation(AUTH_PHASES.AUTHENTICATED, true);
  assert.equal(authenticated.workspaceVisible, true);
  assert.equal(authenticated.signOutVisible, true);
  assert.equal(authenticated.signedOutVisible, false);
});

test("authenticating state shows neither signed-out call to action nor authenticated workspace", () => {
  const presentation = authPresentation(AUTH_PHASES.AUTHENTICATING, false);
  assert.equal(presentation.sessionLabel, "Signing in…");
  assert.equal(presentation.signedOutVisible, false);
  assert.equal(presentation.workspaceVisible, false);
  assert.equal(presentation.signOutVisible, false);
});

test("onboarding progress follows the canonical six-step sequence", () => {
  assert.deepEqual(progressSummary({
    identity: "complete",
    organization: "complete",
    github: "complete",
    repositories: "action",
    subscription: "blocked",
    team: "blocked"
  }), { completed: 3, total: 6, next: "repositories" });

  assert.deepEqual(progressSummary({
    identity: "complete",
    organization: "complete",
    github: "complete",
    repositories: "complete",
    subscription: "complete",
    team: "complete"
  }), { completed: 6, total: 6, next: "complete" });
});
