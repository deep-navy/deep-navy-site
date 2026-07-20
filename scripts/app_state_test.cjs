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

test("the GitHub sign-in lifecycle only reveals the workspace once a session token exists", () => {
  // While beginSignIn redirects to GitHub the phase is "authenticating": neither
  // the signed-out call to action nor the authenticated workspace is shown.
  const redirecting = authPresentation(AUTH_PHASES.AUTHENTICATING, false);
  assert.equal(redirecting.phase, AUTH_PHASES.AUTHENTICATING);
  assert.equal(redirecting.sessionLabel, "Signing in…");
  assert.equal(redirecting.signedOutVisible, false);
  assert.equal(redirecting.workspaceVisible, false);

  // completeSignInCallback stores the returned session token, so the workspace
  // and sign-out control appear and the identity chrome becomes visible.
  const signedIn = authPresentation(AUTH_PHASES.AUTHENTICATED, true);
  assert.equal(signedIn.sessionLabel, "Signed in");
  assert.equal(signedIn.workspaceVisible, true);
  assert.equal(signedIn.signOutVisible, true);
  assert.equal(signedIn.userVisible, true);
});

test("onboarding progress follows the canonical five-step sequence with no Subscription step", () => {
  const { ONBOARDING_STEPS } = require("../assets/js/app-state.js");
  // Signup is free; creating a team is the paid action, so onboarding has no
  // Subscription step. Billing lives in Settings, never the wizard.
  assert.deepEqual(ONBOARDING_STEPS, ["identity", "organization", "github", "repositories", "team"]);
  assert.equal(ONBOARDING_STEPS.includes("subscription"), false);

  assert.deepEqual(progressSummary({
    identity: "complete",
    organization: "complete",
    github: "complete",
    repositories: "action",
    team: "blocked"
  }), { completed: 3, total: 5, next: "repositories" });

  assert.deepEqual(progressSummary({
    identity: "complete",
    organization: "complete",
    github: "complete",
    repositories: "complete",
    team: "complete"
  }), { completed: 5, total: 5, next: "complete" });

  // A stray subscription key can never inflate the count past the five steps.
  assert.deepEqual(progressSummary({
    identity: "complete",
    organization: "complete",
    github: "complete",
    repositories: "complete",
    subscription: "complete",
    team: "complete"
  }), { completed: 5, total: 5, next: "complete" });
});
