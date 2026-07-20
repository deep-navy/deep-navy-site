"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  GITHUB_INSTALLATION_STATE,
  LaunchContractError,
  PROVISIONING_STATE,
  REPOSITORY_SELECTION_MODE,
  buildRepositorySelectionRequest,
  createMutationKeys,
  githubInstallationActive,
  missingTeamPrerequisites,
  parseGitHubCallback,
  provisioningPresentation,
  repositorySelectionReady,
  subscriptionActive
} = require("../assets/js/launch-contract.js");

test("GitHub callback preserves documented OAuth fields and optional setup metadata", () => {
  // 987654321 is an intentionally non-production installation fixture.
  const callback = parseGitHubCallback(new URLSearchParams({
    code: "one-time-code",
    state: "server-bound-state",
    installation_id: "987654321",
    setup_action: "install"
  }));

  assert.deepEqual(callback, {
    installationId: "987654321",
    setupAction: "GIT_HUB_INSTALLATION_SETUP_ACTION_INSTALL",
    stateToken: "server-bound-state",
    authorizationCode: "one-time-code"
  });

  assert.throws(() => parseGitHubCallback(new URLSearchParams({
    state: "server-bound-state",
    installation_id: "987654321",
    setup_action: "install"
  })), (error) => {
    assert.ok(error instanceof LaunchContractError);
    assert.equal(error.code, "github_oauth_code_missing");
    assert.doesNotMatch(error.message, /server-bound-state/);
    return true;
  });
});

test("a Cognito callback is not misclassified as a GitHub installation callback", () => {
  assert.equal(parseGitHubCallback(new URLSearchParams({ code: "cognito-code", state: "pkce-state" })), null);
});

test("the dedicated GitHub callback accepts GitHub's documented code and state without setup-only fields", () => {
  assert.deepEqual(parseGitHubCallback(new URLSearchParams({ code: "github-code", state: "flow-state" }), { forceGitHub: true }), {
    installationId: "0",
    setupAction: "GIT_HUB_INSTALLATION_SETUP_ACTION_UNSPECIFIED",
    stateToken: "flow-state",
    authorizationCode: "github-code"
  });
});

test("the GitHub sign-in install-and-authorize callback yields the fields CompleteGitHubSignIn needs", () => {
  // A first-time GitHub sign-in installs and authorizes in one round trip, so the
  // callback carries an authorization code, the server-bound state, and the newly
  // captured installation id. 987654321 is an intentionally non-production fixture.
  const callback = parseGitHubCallback(new URLSearchParams({
    code: "sign-in-code",
    state: "server-bound-state",
    installation_id: "987654321"
  }), { forceGitHub: true });

  assert.deepEqual(callback, {
    installationId: "987654321",
    setupAction: "GIT_HUB_INSTALLATION_SETUP_ACTION_UNSPECIFIED",
    stateToken: "server-bound-state",
    authorizationCode: "sign-in-code"
  });
  assert.equal(typeof callback.installationId, "string", "the installation id stays a string for lossless int64 transport");

  // A callback missing the one-time code fails closed without leaking the state.
  assert.throws(() => parseGitHubCallback(new URLSearchParams({
    state: "server-bound-state",
    installation_id: "987654321"
  }), { forceGitHub: true }), (error) => {
    assert.ok(error instanceof LaunchContractError);
    assert.equal(error.code, "github_oauth_code_missing");
    assert.doesNotMatch(error.message, /server-bound-state/);
    return true;
  });
});

test("typed installation and subscription states never infer success from resource presence", () => {
  assert.equal(githubInstallationActive({ id: "99", installationState: GITHUB_INSTALLATION_STATE.ACTIVE }), true);
  assert.equal(githubInstallationActive({ id: 99n, installationState: 2 }), true);
  assert.equal(githubInstallationActive({ id: "99", installationState: GITHUB_INSTALLATION_STATE.PENDING }), false);
  assert.equal(githubInstallationActive({ id: "99", installationState: 1, status: "active" }), false);
  assert.equal(githubInstallationActive({ id: "99", installationState: 0, status: "active" }), false);
  assert.equal(subscriptionActive({ id: "sub-1", subscriptionStatus: "SUBSCRIPTION_STATUS_ACTIVE" }), true);
  assert.equal(subscriptionActive({ id: "sub-1", subscriptionStatus: 3 }), false, "trialing does not fund agent work or team capacity");
  assert.equal(subscriptionActive({ id: "sub-1", subscriptionStatus: "SUBSCRIPTION_STATUS_PAST_DUE", status: "active" }), false);
  assert.equal(subscriptionActive({ id: "sub-1", subscriptionStatus: 0, status: "active" }), false);
});

test("repository selection accepts only accessible server-returned repository IDs", () => {
  const repositories = [
    { githubRepositoryId: 10n, accessState: 1 },
    { githubRepositoryId: "20", accessState: "REPOSITORY_ACCESS_STATE_SUSPENDED" }
  ];
  assert.equal(repositorySelectionReady({ mode: REPOSITORY_SELECTION_MODE.SELECTED, githubRepositoryIds: ["10"] }, repositories), true);
  assert.equal(repositorySelectionReady({ mode: REPOSITORY_SELECTION_MODE.SELECTED, githubRepositoryIds: ["20"] }, repositories), false);
  assert.equal(repositorySelectionReady({ mode: REPOSITORY_SELECTION_MODE.ALL }, repositories), true);

  assert.deepEqual(buildRepositorySelectionRequest({
    organizationId: "org-1",
    mode: REPOSITORY_SELECTION_MODE.SELECTED,
    githubRepositoryIds: ["10", "10"],
    idempotencyKey: "selection-key",
    expectedVersion: "4"
  }), {
    organizationId: "org-1",
    mode: REPOSITORY_SELECTION_MODE.SELECTED,
    githubRepositoryIds: ["10"],
    idempotencyKey: "selection-key",
    expectedVersion: "4"
  });
});

test("all-accessible mode never sends explicit repository IDs", () => {
  assert.throws(() => buildRepositorySelectionRequest({
    organizationId: "org-1",
    mode: REPOSITORY_SELECTION_MODE.ALL,
    githubRepositoryIds: ["10"],
    idempotencyKey: "selection-key",
    expectedVersion: "0"
  }), LaunchContractError);
});

test("mutation retries reuse a key only for the same normalized operation", () => {
  let sequence = 0;
  const keys = createMutationKeys(() => `key-${++sequence}`);
  assert.equal(keys.for("checkout", "org-1:plan-1"), "key-1");
  assert.equal(keys.for("checkout", "org-1:plan-1"), "key-1");
  assert.equal(keys.for("checkout", "org-1:plan-2"), "key-2");
  keys.clear("checkout");
  assert.equal(keys.for("checkout", "org-1:plan-1"), "key-3");
});

test("provisioning presentation preserves terminal and safe failure states", () => {
  assert.deepEqual(provisioningPresentation({
    provisioningState: PROVISIONING_STATE.FAILED,
    provisioningStep: "PROVISIONING_STEP_WAITING_FOR_GATEWAY",
    safeError: "Gateway did not become ready.",
    sequence: "7"
  }), {
    state: PROVISIONING_STATE.FAILED,
    label: "failed",
    step: "waiting for gateway",
    terminal: true,
    failed: true,
    safeError: "Gateway did not become ready.",
    sequence: "7"
  });
});

test("team readiness lists every missing server-confirmed prerequisite", () => {
  // Creating a team is now the paid action, so an active subscription is no
  // longer a prerequisite: only the GitHub install and a durable repository
  // selection gate team requests. Even an explicit subscriptionActive:false is
  // ignored and never surfaces "active subscription".
  assert.deepEqual(missingTeamPrerequisites({
    githubInstalled: true,
    repositorySelectionReady: false,
    subscriptionActive: false
  }), ["repository selection"]);

  assert.deepEqual(missingTeamPrerequisites({
    githubInstalled: false,
    repositorySelectionReady: false
  }), ["GitHub installation", "repository selection"]);

  assert.deepEqual(missingTeamPrerequisites({
    githubInstalled: true,
    repositorySelectionReady: true
  }), []);
});
