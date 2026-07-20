((root, factory) => {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.deepNavyAppState = api;
})(typeof window === "undefined" ? globalThis : window, () => {
  "use strict";

  const AUTH_PHASES = Object.freeze({
    SIGNED_OUT: "signed_out",
    AUTHENTICATING: "authenticating",
    AUTHENTICATED: "authenticated"
  });

  // Signup is free: creating a team is the paid action, so onboarding has no
  // Subscription step. Billing lives in Settings, not the wizard.
  const ONBOARDING_STEPS = Object.freeze([
    "identity",
    "organization",
    "github",
    "repositories",
    "team"
  ]);

  function authPresentation(phase, hasAccessToken) {
    const authenticated = phase === AUTH_PHASES.AUTHENTICATED && hasAccessToken === true;
    const authenticating = phase === AUTH_PHASES.AUTHENTICATING && !authenticated;
    const normalizedPhase = authenticated
      ? AUTH_PHASES.AUTHENTICATED
      : authenticating
        ? AUTH_PHASES.AUTHENTICATING
        : AUTH_PHASES.SIGNED_OUT;

    return Object.freeze({
      phase: normalizedPhase,
      authenticated,
      signedOutVisible: !authenticated && !authenticating,
      workspaceVisible: authenticated,
      signOutVisible: authenticated,
      userVisible: authenticated,
      sessionLabel: authenticated ? "Signed in" : authenticating ? "Signing in…" : "Signed out"
    });
  }

  function progressSummary(states) {
    const normalized = states && typeof states === "object" ? states : {};
    const completed = ONBOARDING_STEPS.filter((step) => normalized[step] === "complete").length;
    const next = ONBOARDING_STEPS.find((step) => normalized[step] !== "complete") || "complete";
    return Object.freeze({ completed, total: ONBOARDING_STEPS.length, next });
  }

  return Object.freeze({ AUTH_PHASES, ONBOARDING_STEPS, authPresentation, progressSummary });
});
