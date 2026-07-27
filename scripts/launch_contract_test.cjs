"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  ENGINEER_FLOOR,
  ENGINEER_MAX,
  GITHUB_INSTALLATION_STATE,
  LaunchContractError,
  PROVISIONING_STATE,
  REPOSITORY_SELECTION_MODE,
  buildRepositorySelectionRequest,
  createMutationKeys,
  exampleRun,
  githubInstallationActive,
  missingTeamPrerequisites,
  normalizeEngineerCount,
  parseGitHubCallback,
  provisioningPresentation,
  teamLifecycleControls,
  provisioningProgress,
  repositorySelectionReady,
  subscriptionActive,
  teamPricing,
  teamRoster
} = require("../assets/js/launch-contract.js");

test("engineer count is floored at three, capped at fifty, and defaults to the floor", () => {
  assert.equal(ENGINEER_FLOOR, 3);
  assert.equal(ENGINEER_MAX, 50);
  assert.equal(normalizeEngineerCount(3), 3);
  assert.equal(normalizeEngineerCount(1), 3, "below the adversarial-review floor snaps up to three");
  assert.equal(normalizeEngineerCount(7.8), 7, "fractional counts floor to a whole engineer");
  assert.equal(normalizeEngineerCount(99), 50, "above the ceiling clamps to fifty");
  assert.equal(normalizeEngineerCount("8"), 8);
  assert.equal(normalizeEngineerCount("nonsense"), 3, "an unparseable count falls back to the floor");
});

test("team pricing is $599 base including three engineers plus $199 per engineer above the floor", () => {
  const floor = teamPricing({ engineerCount: 3 });
  assert.equal(floor.totalCents, 59900n);
  assert.equal(floor.additionalEngineers, 0);

  const five = teamPricing({ engineerCount: 5 });
  assert.equal(five.additionalEngineers, 2);
  assert.equal(five.addonTotalCents, 39800n);
  assert.equal(five.totalCents, 99700n, "$599 + 2 × $199 = $997/mo");

  // Below the floor is treated as the floor: never priced under the base.
  assert.equal(teamPricing({ engineerCount: 2 }).totalCents, 59900n);
  // The base can be overridden by the signed billing plan; the add-on is per-seat.
  assert.equal(teamPricing({ engineerCount: 4, baseCents: 60000n }).totalCents, 79900n);
});

test("the roster a count implies is PM + EM + Designer + the chosen engineers", () => {
  const roster = teamRoster(4);
  assert.deepEqual(roster.map((entry) => entry.code), ["PM", "EM", "PD", "ENG"]);
  assert.deepEqual(roster.map((entry) => entry.count), [1, 1, 1, 4]);
  assert.equal(roster[3].scope, "Code + MCP docs");
  assert.equal(roster[0].scope, "GitHub issues");
  assert.equal(roster[1].scope, "Triage & routing");
  assert.equal(roster[2].scope, "Figma");
});

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

test("provisioning progress banks early, accelerates at the end, and never stalls near completion", () => {
  // No command yet (awaiting the signed payment webhook): a visible first step.
  const awaiting = provisioningProgress({});
  assert.equal(awaiting.percent, 6);
  assert.match(awaiting.message, /payment/i);
  assert.ok(awaiting.eta.length > 0);

  // Real steps advance monotonically, with the largest deltas banked early
  // (Harrison et al.: early progress + terminal acceleration feel fastest).
  const percents = [1, 2, 3, 4, 5, 6, 7].map((step) => provisioningProgress({ provisioningState: 2, provisioningStep: step }).percent);
  assert.deepEqual([...percents].sort((a, b) => a - b), percents);
  assert.ok(percents[0] >= 15, "first real step must bank visible progress");
  // The pre-completion step parks at 92, never ~99 — a bar idling at the end is
  // perceived as slower/stalled.
  assert.equal(percents[5], 92);
  assert.equal(percents[6], 100);

  // Terminal states: success completes the bar; failure renders no bar at all
  // (the error surfaces own that state — a frozen bar would misreport work).
  assert.equal(provisioningProgress({ provisioningState: 4 }).percent, 100);
  assert.equal(provisioningProgress({ provisioningState: 5 }), null);
  assert.equal(provisioningProgress({ provisioningState: 6 }), null);
});

test("confirming payment is not described as taking minutes", () => {
  // A payment is a webhook round trip and settles in seconds. Quoting the
  // workspace build's estimate here tells someone who has just paid that their
  // money is in limbo for minutes, which reads as a fault rather than a wait.
  const paying = provisioningProgress({});
  assert.match(paying.message, /payment/i);
  assert.match(paying.eta, /second/i, "the payment wait must be described in seconds");
  assert.doesNotMatch(paying.eta, /minute/i);

  // The build genuinely does take minutes, and must still say so - the two
  // estimates are separate on purpose.
  const building = provisioningProgress({ provisioningState: 2, provisioningStep: 3 });
  assert.match(building.eta, /minute/i, "the workspace build must still set a minutes-scale expectation");
  assert.notStrictEqual(paying.eta, building.eta, "the two waits must not share one estimate again");
});

test("deleting a team reports its own progress instead of going silent", () => {
  // The delete command runs through the same pipeline, so the customer needs
  // the same determinate feedback. Recognised from either the enum or the raw
  // command verb, since both reach the browser depending on the transport.
  for (const removing of [{ operationType: 4 }, { operation: "delete" }]) {
    const queued = provisioningProgress({ ...removing, provisioningState: 1, provisioningStep: 1 });
    assert.match(queued.message, /remove/i);
    assert.ok(queued.percent >= 10, "a pressed Delete button must bank progress at once");

    // Named real work, monotonic, and it does not idle at the end.
    const percents = [1, 8, 9, 10].map((step) =>
      provisioningProgress({ ...removing, provisioningState: 2, provisioningStep: step }).percent);
    assert.deepEqual([...percents].sort((a, b) => a - b), percents);
    assert.ok(percents.at(-1) <= 90, "the final in-flight step must leave headroom");

    const backingUp = provisioningProgress({ ...removing, provisioningState: 2, provisioningStep: 9 });
    assert.match(backingUp.message, /back(ing)? up/i, "name the real work: the workspace is backed up first");
    assert.ok(backingUp.eta.length > 0);

    // An unrecognised step still shows motion rather than the provisioning copy.
    const unknownStep = provisioningProgress({ ...removing, provisioningState: 2 });
    assert.match(unknownStep.message, /remove/i);
    assert.doesNotMatch(unknownStep.message, /payment|Stripe/i);

    // Terminal: removal completes the bar and says so; a failed removal renders
    // no bar, leaving the error surface (and the retry control) to own it.
    assert.deepEqual(provisioningProgress({ ...removing, provisioningState: 4 }), { percent: 100, message: "Team removed", eta: "" });
    assert.equal(provisioningProgress({ ...removing, provisioningState: 5 }), null);
  }

  // Provisioning is untouched by any of this.
  assert.match(provisioningProgress({ operationType: 1, provisioningState: 4 }).message, /live/i);
});

test("the example run states the real pipeline and keeps the merge with the customer", () => {
  const { objective, stages } = exampleRun();
  assert.ok(objective.length > 20, "the example objective must be a real sentence");
  assert.equal(stages.length, 6);
  assert.deepEqual(stages.map((stage) => stage.code), ["YOU", "PM", "EM", "ENG", "REV", "YOU"]);
  // The product's core promise: agents never merge; the first and last word are
  // the customer's. If the pipeline ever changes, this proof must change with it.
  assert.equal(stages[0].actor, "You");
  assert.equal(stages[stages.length - 1].actor, "You");
  assert.match(stages[stages.length - 1].detail, /never merge/i);
  // Two peer reviews are what the three-engineer floor buys.
  assert.match(stages[4].detail, /two independent reviews/i);
  for (const stage of stages) {
    for (const field of ["id", "actor", "code", "title", "detail", "artifact"]) {
      assert.equal(typeof stage[field], "string");
      assert.ok(stage[field].trim().length > 0, `${stage.id}.${field} must not be empty`);
    }
  }
});

test("the example run script cannot be mutated by a caller", () => {
  const first = exampleRun();
  assert.throws(() => { "use strict"; first.stages.push({ id: "injected" }); });
  assert.throws(() => { "use strict"; first.stages[0].title = "tampered"; });
  assert.equal(exampleRun().stages.length, 6);
  assert.equal(exampleRun().stages[0].actor, "You");
});

test("a team whose setup failed terminally always offers a way forward", () => {
  const failed = { provisioningState: PROVISIONING_STATE.FAILED, provisioningStep: "PROVISIONING_STEP_CONFIGURING_RUNTIME", sequence: "10" };

  // The bug this covers: a pending team whose provisioning command spent its
  // attempts showed only "Delete". The only way past a transient outage during
  // setup was to throw the team away and pay for a new one.
  assert.deepEqual(teamLifecycleControls("pending", failed), ["resume", "delete"]);

  // A team still working through its steps must not offer a retry - restarting
  // provisioning underneath itself is not a recovery.
  assert.deepEqual(
    teamLifecycleControls("pending", { provisioningState: PROVISIONING_STATE.RUNNING, provisioningStep: "PROVISIONING_STEP_CONFIGURING_RUNTIME", sequence: "3" }),
    ["delete"]
  );

  // Unchanged behaviour elsewhere.
  assert.deepEqual(teamLifecycleControls("active", {}), ["suspend", "delete"]);
  assert.deepEqual(teamLifecycleControls("suspended", {}), ["resume", "delete"]);
  assert.deepEqual(teamLifecycleControls("deleted", failed), []);
  assert.deepEqual(teamLifecycleControls("deleting", failed), ["delete"]);
  assert.deepEqual(teamLifecycleControls("deleting", {}), []);
});
