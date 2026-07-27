((root, factory) => {
  "use strict";

  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  if (root) root.deepNavyLaunchContract = contract;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const GITHUB_INSTALLATION_STATE = Object.freeze({
    PENDING: "GIT_HUB_INSTALLATION_STATE_PENDING",
    ACTIVE: "GIT_HUB_INSTALLATION_STATE_ACTIVE",
    SUSPENDED: "GIT_HUB_INSTALLATION_STATE_SUSPENDED",
    REVOKED: "GIT_HUB_INSTALLATION_STATE_REVOKED",
    FAILED: "GIT_HUB_INSTALLATION_STATE_FAILED"
  });

  const GITHUB_SETUP_ACTION = Object.freeze({
    unspecified: "GIT_HUB_INSTALLATION_SETUP_ACTION_UNSPECIFIED",
    install: "GIT_HUB_INSTALLATION_SETUP_ACTION_INSTALL",
    update: "GIT_HUB_INSTALLATION_SETUP_ACTION_UPDATE"
  });

  const REPOSITORY_SELECTION_MODE = Object.freeze({
    ALL: "REPOSITORY_SELECTION_MODE_ALL_ACCESSIBLE",
    SELECTED: "REPOSITORY_SELECTION_MODE_SELECTED"
  });

  const SUBSCRIPTION_STATUS = Object.freeze({
    TRIALING: "SUBSCRIPTION_STATUS_TRIALING",
    ACTIVE: "SUBSCRIPTION_STATUS_ACTIVE"
  });

  const PROVISIONING_STATE = Object.freeze({
    QUEUED: "PROVISIONING_STATE_QUEUED",
    RUNNING: "PROVISIONING_STATE_RUNNING",
    RETRYING: "PROVISIONING_STATE_RETRYING",
    SUCCEEDED: "PROVISIONING_STATE_SUCCEEDED",
    FAILED: "PROVISIONING_STATE_FAILED",
    CANCELED: "PROVISIONING_STATE_CANCELED"
  });

  const githubStatesByNumber = Object.freeze({
    1: GITHUB_INSTALLATION_STATE.PENDING,
    2: GITHUB_INSTALLATION_STATE.ACTIVE,
    3: GITHUB_INSTALLATION_STATE.SUSPENDED,
    4: GITHUB_INSTALLATION_STATE.REVOKED,
    5: GITHUB_INSTALLATION_STATE.FAILED
  });
  const repositoryModesByNumber = Object.freeze({
    1: REPOSITORY_SELECTION_MODE.ALL,
    2: REPOSITORY_SELECTION_MODE.SELECTED
  });
  const subscriptionStatesByNumber = Object.freeze({
    3: SUBSCRIPTION_STATUS.TRIALING,
    4: SUBSCRIPTION_STATUS.ACTIVE
  });
  const provisioningStatesByNumber = Object.freeze({
    1: PROVISIONING_STATE.QUEUED,
    2: PROVISIONING_STATE.RUNNING,
    3: PROVISIONING_STATE.RETRYING,
    4: PROVISIONING_STATE.SUCCEEDED,
    5: PROVISIONING_STATE.FAILED,
    6: PROVISIONING_STATE.CANCELED
  });

  class LaunchContractError extends Error {
    constructor(message, code = "invalid_launch_contract") {
      super(message);
      this.name = "LaunchContractError";
      this.code = code;
    }
  }

  function stringValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function enumValue(value, valuesByNumber) {
    if (typeof value === "number" && Number.isInteger(value)) return valuesByNumber[value] || "";
    return stringValue(value);
  }

  function decimalInt64(value, name) {
    const normalized = typeof value === "bigint"
      ? value.toString()
      : typeof value === "number" && Number.isSafeInteger(value)
        ? String(value)
        : stringValue(value);
    if (!/^(?:0|[1-9][0-9]{0,18})$/.test(normalized)) {
      throw new LaunchContractError(`${name} is not a valid non-negative 64-bit value.`, "invalid_int64");
    }
    if (BigInt(normalized) > 9_223_372_036_854_775_807n) throw new LaunchContractError(`${name} exceeds int64.`, "invalid_int64");
    return normalized;
  }

  function positiveInt64(value, name) {
    const normalized = decimalInt64(value, name);
    if (normalized === "0") throw new LaunchContractError(`${name} must be positive.`, "invalid_int64");
    return normalized;
  }

  function githubInstallationActive(installation) {
    if (!installation || !decimalIdentifierPresent(installation.id)) return false;
    const typed = enumValue(installation.installationState, githubStatesByNumber);
    return typed === GITHUB_INSTALLATION_STATE.ACTIVE;
  }

  function decimalIdentifierPresent(value) {
    try { return positiveInt64(value, "Identifier") !== ""; } catch { return false; }
  }

  function subscriptionActive(subscription) {
    if (!subscription || !stringValue(subscription.id)) return false;
    const typed = enumValue(subscription.subscriptionStatus, subscriptionStatesByNumber);
    return typed === SUBSCRIPTION_STATUS.ACTIVE;
  }

  function repositorySelectionMode(value) {
    return enumValue(value, repositoryModesByNumber);
  }

  function accessibleRepositories(repositories) {
    if (!Array.isArray(repositories)) return [];
    return repositories.filter((repository) => {
      const typed = enumValue(repository?.accessState, {
        1: "REPOSITORY_ACCESS_STATE_ACCESSIBLE",
        2: "REPOSITORY_ACCESS_STATE_SUSPENDED",
        3: "REPOSITORY_ACCESS_STATE_REMOVED"
      });
      return typed === "REPOSITORY_ACCESS_STATE_ACCESSIBLE" && decimalIdentifierPresent(repository?.githubRepositoryId);
    });
  }

  function selectedRepositoryIds(selection) {
    if (!Array.isArray(selection?.githubRepositoryIds)) return [];
    const seen = new Set();
    return selection.githubRepositoryIds.map((id) => positiveInt64(id, "GitHub repository ID")).filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function repositorySelectionReady(selection, repositories) {
    const mode = repositorySelectionMode(selection?.mode);
    const accessible = accessibleRepositories(repositories);
    if (mode === REPOSITORY_SELECTION_MODE.ALL) return accessible.length > 0;
    if (mode !== REPOSITORY_SELECTION_MODE.SELECTED) return false;
    const allowed = new Set(accessible.map((repository) => positiveInt64(repository.githubRepositoryId, "GitHub repository ID")));
    return selectedRepositoryIds(selection).some((id) => allowed.has(id));
  }

  function buildRepositorySelectionRequest({ organizationId, mode, githubRepositoryIds, idempotencyKey, expectedVersion }) {
    const normalizedMode = repositorySelectionMode(mode);
    if (![REPOSITORY_SELECTION_MODE.ALL, REPOSITORY_SELECTION_MODE.SELECTED].includes(normalizedMode)) {
      throw new LaunchContractError("Choose all accessible repositories or an explicit repository list.", "invalid_repository_mode");
    }
    const ids = Array.isArray(githubRepositoryIds)
      ? [...new Set(githubRepositoryIds.map((id) => positiveInt64(id, "GitHub repository ID")))]
      : [];
    if (normalizedMode === REPOSITORY_SELECTION_MODE.ALL && ids.length) {
      throw new LaunchContractError("All-accessible mode must not include repository IDs.", "invalid_repository_selection");
    }
    if (normalizedMode === REPOSITORY_SELECTION_MODE.SELECTED && ids.length === 0) {
      throw new LaunchContractError("Select at least one accessible repository.", "invalid_repository_selection");
    }
    const key = stringValue(idempotencyKey);
    if (!key) throw new LaunchContractError("An idempotency key is required.", "idempotency_key_required");
    return {
      organizationId: stringValue(organizationId),
      mode: normalizedMode,
      githubRepositoryIds: ids,
      idempotencyKey: key,
      expectedVersion: decimalInt64(expectedVersion ?? "0", "Repository selection version")
    };
  }

  function parseGitHubCallback(params, metadata = {}) {
    if (!(params instanceof URLSearchParams)) throw new TypeError("params must be URLSearchParams");
    const installationId = stringValue(params.get("installation_id"));
    const setupAction = stringValue(params.get("setup_action")).toLowerCase();
    const authorizationCode = stringValue(params.get("code"));
    const stateToken = stringValue(params.get("state"));
    const looksLikeGitHub = Boolean(installationId || setupAction || metadata.forceGitHub);
    if (!looksLikeGitHub) return null;

    if (params.get("error")) {
      throw new LaunchContractError("GitHub did not authorize the installation. Start the installation again.", "github_authorization_rejected");
    }
    if (installationId && !decimalIdentifierPresent(installationId)) {
      throw new LaunchContractError("GitHub did not return a valid installation identifier.", "github_installation_id_missing");
    }
    if (setupAction && !GITHUB_SETUP_ACTION[setupAction]) {
      throw new LaunchContractError("GitHub did not return a recognized installation action.", "github_setup_action_missing");
    }
    if (!authorizationCode || authorizationCode.length > 2048 || /[\r\n\0]/.test(authorizationCode)) {
      throw new LaunchContractError("The product GitHub App did not return its one-time OAuth code. Enable OAuth during installation and start again.", "github_oauth_code_missing");
    }
    if (!stateToken || stateToken.length > 4096 || /[\r\n\0]/.test(stateToken)) {
      throw new LaunchContractError("GitHub did not return the one-time installation state.", "github_state_missing");
    }

    return {
      installationId: installationId || "0",
      setupAction: GITHUB_SETUP_ACTION[setupAction] || GITHUB_SETUP_ACTION.unspecified,
      stateToken,
      authorizationCode
    };
  }

  function provisioningState(status) {
    const typed = enumValue(status?.provisioningState, provisioningStatesByNumber);
    return typed;
  }

  function provisioningTerminal(status) {
    return [PROVISIONING_STATE.SUCCEEDED, PROVISIONING_STATE.FAILED, PROVISIONING_STATE.CANCELED].includes(provisioningState(status));
  }

  function provisioningPresentation(status) {
    const state = provisioningState(status);
    const step = enumValue(status?.provisioningStep, {
      1: "PROVISIONING_STEP_QUEUED",
      2: "PROVISIONING_STEP_VALIDATING_PREREQUISITES",
      3: "PROVISIONING_STEP_CREATING_NAMESPACE",
      4: "PROVISIONING_STEP_CONFIGURING_RUNTIME",
      5: "PROVISIONING_STEP_CREATING_OPENCLAW_INSTANCE",
      6: "PROVISIONING_STEP_WAITING_FOR_GATEWAY",
      7: "PROVISIONING_STEP_READY",
      8: "PROVISIONING_STEP_SUSPENDING",
      9: "PROVISIONING_STEP_BACKING_UP",
      10: "PROVISIONING_STEP_DELETING"
    }) || stringValue(status?.step);
    const clean = (value) => stringValue(value).replace(/^PROVISIONING_(?:STATE|STEP)_/, "").replaceAll("_", " ").toLowerCase();
    return {
      state,
      label: clean(state),
      step: clean(step) || "waiting for status",
      terminal: provisioningTerminal(status),
      failed: state === PROVISIONING_STATE.FAILED,
      safeError: stringValue(status?.safeError).slice(0, 300),
      sequence: typeof status?.sequence === "bigint" || typeof status?.sequence === "number" ? String(status.sequence) : stringValue(status?.sequence)
    };
  }

  // Determinate progress for the 1-3 minute provisioning wait, built on cited
  // wait-state research rather than a spinner:
  //  - NN/g: waits over ~10s need a percent-done indicator plus a duration
  //    expectation; Nah 2004 (N=70) measured ~3x longer tolerable waits with
  //    visible progress feedback.
  //  - Harrison et al., UIST 2007: bank progress early and accelerate toward
  //    the end; a bar that pauses near completion is perceived as slower.
  //  - Buell & Norton, Management Science 2011 (labor illusion): showing the
  //    REAL work being performed makes the wait itself increase satisfaction.
  // Percent milestones bank the largest deltas early, top out at 92% while
  // waiting on the gateway (never idling at ~99%), and jump to 100 on success —
  // the terminal acceleration Harrison found fastest-feeling. Messages name the
  // actual provisioning steps the server reports, in customer language.
  // Two different waits, and they were sharing one estimate. Confirming payment
  // is a webhook round trip - Stripe delivers, the endpoint records and answers
  // 2xx, the drain worker is nudged awake immediately - and it settles in
  // seconds. Building the workspace really does take minutes: a namespace,
  // volumes, the agent runtime, then waiting on the gateway. Telling someone
  // their PAYMENT will take 1-3 minutes reads as "this is stuck", right at the
  // moment they have just handed over money and are least willing to doubt us.
  const PAYMENT_CONFIRMATION_ETA = "Usually a few seconds.";
  // Deliberately not a numeric range: no team has yet completed a full build
  // here, so a precise-sounding estimate would be invented. Vague and true
  // beats specific and wrong.
  const PROVISIONING_PROGRESS_ETA = "Usually a few minutes.";
  const PROVISIONING_PROGRESS_BY_STEP = Object.freeze({
    "PROVISIONING_STEP_QUEUED": Object.freeze({ percent: 18, message: "Payment confirmed — queueing your workspace build" }),
    "PROVISIONING_STEP_VALIDATING_PREREQUISITES": Object.freeze({ percent: 34, message: "Validating repository access and your plan" }),
    "PROVISIONING_STEP_CREATING_NAMESPACE": Object.freeze({ percent: 52, message: "Creating your team’s isolated workspace" }),
    "PROVISIONING_STEP_CONFIGURING_RUNTIME": Object.freeze({ percent: 68, message: "Configuring the agent runtime" }),
    "PROVISIONING_STEP_CREATING_OPENCLAW_INSTANCE": Object.freeze({ percent: 82, message: "Starting your agents" }),
    "PROVISIONING_STEP_WAITING_FOR_GATEWAY": Object.freeze({ percent: 92, message: "Waiting for your team’s gateway to come online" }),
    "PROVISIONING_STEP_READY": Object.freeze({ percent: 100, message: "Your team is live" })
  });

  // Removing a team runs the same command pipeline as creating one, and it is
  // not instant: the workspace is backed up, credentials are revoked, and the
  // namespace is torn down. Without these milestones the row sat silent for
  // minutes after the customer clicked delete, which reads as a hang. Same
  // basis as the provisioning map - name the real work, bank progress early,
  // and never idle at 99%.
  const DELETION_PROGRESS_ETA = "Usually takes under a minute.";
  const DELETION_PROGRESS_BY_STEP = Object.freeze({
    "PROVISIONING_STEP_QUEUED": Object.freeze({ percent: 15, message: "Queued to remove your team" }),
    "PROVISIONING_STEP_SUSPENDING": Object.freeze({ percent: 30, message: "Stopping your team’s agents" }),
    "PROVISIONING_STEP_BACKING_UP": Object.freeze({ percent: 55, message: "Backing up your team’s workspace before removing it" }),
    "PROVISIONING_STEP_DELETING": Object.freeze({ percent: 85, message: "Removing the workspace and revoking credentials" })
  });

  const PROVISIONING_OPERATION = Object.freeze({
    PROVISION: "PROVISIONING_OPERATION_PROVISION",
    SUSPEND: "PROVISIONING_OPERATION_SUSPEND",
    RESUME: "PROVISIONING_OPERATION_RESUME",
    DELETE: "PROVISIONING_OPERATION_DELETE"
  });

  // The operation arrives either as the enum or as the raw command verb.
  function provisioningOperation(status) {
    const fromEnum = enumValue(status?.operationType, {
      1: PROVISIONING_OPERATION.PROVISION,
      2: PROVISIONING_OPERATION.SUSPEND,
      3: PROVISIONING_OPERATION.RESUME,
      4: PROVISIONING_OPERATION.DELETE
    });
    if (fromEnum) return fromEnum;
    const verb = stringValue(status?.operation).toUpperCase();
    return verb ? `PROVISIONING_OPERATION_${verb}` : "";
  }

  function provisioningProgress(status) {
    const state = provisioningState(status);
    if (state === PROVISIONING_STATE.FAILED || state === PROVISIONING_STATE.CANCELED) return null;
    const deleting = provisioningOperation(status) === PROVISIONING_OPERATION.DELETE;
    if (state === PROVISIONING_STATE.SUCCEEDED) {
      return deleting
        ? { percent: 100, message: "Team removed", eta: "" }
        : { percent: 100, message: "Your team is live", eta: "" };
    }
    const step = enumValue(status?.provisioningStep, {
      1: "PROVISIONING_STEP_QUEUED",
      2: "PROVISIONING_STEP_VALIDATING_PREREQUISITES",
      3: "PROVISIONING_STEP_CREATING_NAMESPACE",
      4: "PROVISIONING_STEP_CONFIGURING_RUNTIME",
      5: "PROVISIONING_STEP_CREATING_OPENCLAW_INSTANCE",
      6: "PROVISIONING_STEP_WAITING_FOR_GATEWAY",
      7: "PROVISIONING_STEP_READY",
      8: "PROVISIONING_STEP_SUSPENDING",
      9: "PROVISIONING_STEP_BACKING_UP",
      10: "PROVISIONING_STEP_DELETING"
    });
    if (deleting) {
      const removing = step ? DELETION_PROGRESS_BY_STEP[step] : null;
      return removing
        ? { percent: removing.percent, message: removing.message, eta: DELETION_PROGRESS_ETA }
        : { percent: 10, message: "Preparing to remove your team", eta: DELETION_PROGRESS_ETA };
    }
    const known = step ? PROVISIONING_PROGRESS_BY_STEP[step] : null;
    if (known) return { percent: known.percent, message: known.message, eta: known.percent >= 100 ? "" : PROVISIONING_PROGRESS_ETA };
    // No provisioning command yet: the capture exists but payment has not been
    // confirmed by the signed webhook. Bank a visible first step immediately.
    return { percent: 6, message: "Confirming payment with Stripe", eta: PAYMENT_CONFIRMATION_ETA };
  }

  // The example run: the proof-of-work moment shown BEFORE the paywall.
  //
  // Every measured source on this funnel points at the same weakness — the
  // customer is asked for $599 before seeing any agent work. Navattic's 2025
  // interactive-demo study (28,000+ demos) measured a 20-25% lift in qualified
  // leads for interactive proof over static claims, and NN/g's first-10-seconds
  // finding says the value proposition has to land immediately.
  //
  // This is deliberately the product's REAL mechanics (the same PM -> EM ->
  // engineer -> two-review pipeline the runtime executes), rendered with an
  // illustrative objective. It is labeled as an example everywhere it appears:
  // it must never read as a customer record or a captured result.
  const EXAMPLE_RUN_OBJECTIVE = "Add rate limiting to our public API so one client can’t exhaust capacity.";
  const EXAMPLE_RUN_STAGES = Object.freeze([
    Object.freeze({
      id: "objective", actor: "You", code: "YOU",
      title: "You submit the objective",
      detail: "One business outcome, in your words. No tickets to write.",
      artifact: EXAMPLE_RUN_OBJECTIVE
    }),
    Object.freeze({
      id: "plan", actor: "Product Manager", code: "PM",
      title: "The PM turns it into acceptance criteria",
      detail: "Scope, success criteria, and the issues that get there — filed on your repository.",
      artifact: "Opened 3 issues · #128 Token-bucket limiter · #129 Per-key quotas · #130 429 responses + retry-after"
    }),
    Object.freeze({
      id: "assign", actor: "Engineering Manager", code: "EM",
      title: "The EM routes each issue to an engineer",
      detail: "Work is bound to an engineer server-side, which is what unlocks their model budget.",
      artifact: "#128 → Backend · #129 → Platform · #130 → Backend"
    }),
    Object.freeze({
      id: "build", actor: "Engineers", code: "ENG",
      title: "Engineers write the code and the tests",
      detail: "Each works in an isolated sandbox on its own branch, then opens a pull request.",
      artifact: "PR #131 “Add token-bucket rate limiter” · 6 files · +214 −18 · tests passing"
    }),
    Object.freeze({
      id: "review", actor: "Peer engineers", code: "REV",
      title: "Two peers review before anything merges",
      detail: "The floor of three engineers exists so every pull request gets two independent reviews.",
      artifact: "2 reviews · 1 change requested → addressed · approved"
    }),
    Object.freeze({
      id: "approve", actor: "You", code: "YOU",
      title: "You review and merge",
      detail: "Agents never merge. The final call — and the merge button — stays yours.",
      artifact: "Awaiting your approval in the review queue"
    })
  ]);

  // Pure accessor so the renderer cannot mutate the canonical script, and the
  // contract test can assert the pipeline shape (it mirrors the runtime roles).
  function exampleRun() {
    return { objective: EXAMPLE_RUN_OBJECTIVE, stages: EXAMPLE_RUN_STAGES };
  }

  // Team creation is now the paid action (RequestTeam collects the card), so an
  // active subscription is no longer a prerequisite: it is the *result* of
  // creating the first team. Only the GitHub install and a durable repository
  // selection must be ready before a team can be requested.
  function missingTeamPrerequisites({ githubInstalled, repositorySelectionReady: repositoriesReady }) {
    return [
      !githubInstalled ? "GitHub installation" : "",
      !repositoriesReady ? "repository selection" : ""
    ].filter(Boolean);
  }

  // Team pricing mirrors the server: $599/month per team includes the floor of
  // three engineering agents; every engineer above the floor is a $199/month
  // add-on. The floor of three keeps two peer reviewers on every shipped ticket.
  const ENGINEER_FLOOR = 3;
  const ENGINEER_MAX = 50;
  const TEAM_BASE_CENTS = 59900n;
  const ENGINEER_ADDON_CENTS = 19900n;

  function normalizeEngineerCount(value, { floor = ENGINEER_FLOOR, max = ENGINEER_MAX } = {}) {
    const parsed = typeof value === "number"
      ? Math.floor(value)
      : typeof value === "string" && value.trim() !== ""
        ? Math.floor(Number(value.trim()))
        : NaN;
    if (!Number.isFinite(parsed)) return floor;
    return Math.min(max, Math.max(floor, parsed));
  }

  function toCents(value) {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
    return null;
  }

  // Pure price calculation: base + addon × max(0, engineerCount − floor). The base
  // and add-on can be overridden (e.g. from the signed billing plan) but default
  // to the founding-team figures.
  function teamPricing({ engineerCount, baseCents, addonCents, floor = ENGINEER_FLOOR, max = ENGINEER_MAX } = {}) {
    const count = normalizeEngineerCount(engineerCount, { floor, max });
    const additional = Math.max(0, count - floor);
    const base = toCents(baseCents) ?? TEAM_BASE_CENTS;
    const addon = toCents(addonCents) ?? ENGINEER_ADDON_CENTS;
    const addonTotal = addon * BigInt(additional);
    return Object.freeze({
      engineerCount: count,
      includedEngineers: floor,
      additionalEngineers: additional,
      baseCents: base,
      addonCents: addon,
      addonTotalCents: addonTotal,
      totalCents: base + addonTotal
    });
  }

  // The roster a given engineer count implies: one Product Manager, one
  // Engineering Manager, one Designer, and the chosen number of Engineers.
  function teamRoster(engineerCount, options) {
    const count = normalizeEngineerCount(engineerCount, options);
    return [
      Object.freeze({ code: "PM", label: "Product Manager", scope: "GitHub issues", count: 1 }),
      Object.freeze({ code: "EM", label: "Engineering Manager", scope: "Triage & routing", count: 1 }),
      Object.freeze({ code: "PD", label: "Designer", scope: "Figma", count: 1 }),
      Object.freeze({ code: "ENG", label: count === 1 ? "Engineer" : "Engineers", scope: "Code + MCP docs", count })
    ];
  }

  function createMutationKeys(createKey) {
    if (typeof createKey !== "function") throw new TypeError("createKey must be a function");
    const entries = new Map();
    return {
      for(name, fingerprint) {
        const normalized = `${name}:${stringValue(fingerprint)}`;
        if (!entries.has(normalized)) entries.set(normalized, stringValue(createKey()));
        return entries.get(normalized);
      },
      clear(name) {
        for (const key of entries.keys()) if (key.startsWith(`${name}:`)) entries.delete(key);
      }
    };
  }

  // Which lifecycle controls a team row offers, given its state and the status
  // of its last provisioning command.
  //
  // The rule that matters here is that a team must never be left with nothing
  // to click. Setup that fails terminally parks the team in "pending" with a
  // dead command; without a retry the only way past a transient outage during
  // provisioning was to delete the team and pay again. Deletion already learned
  // this lesson - a delete that failed terminally offers "Retry deletion"
  // rather than an empty row - and provisioning is the same shape.
  function teamLifecycleControls(state, status) {
    const lifecycle = String(state || "").toLowerCase();
    if (lifecycle === "deleted") return [];
    const provisioning = provisioningPresentation(status || {});
    if (lifecycle === "deleting") return provisioning.failed ? ["delete"] : [];
    const controls = [];
    if (lifecycle === "active") controls.push("suspend");
    if (lifecycle === "suspended") controls.push("resume");
    // Resume re-drives the whole provisioning path, which is what a retry of
    // failed setup means. It is offered only on a terminal failure: a team
    // still working through its steps must not be restarted underneath itself.
    if (lifecycle !== "active" && lifecycle !== "suspended" && provisioning.failed) {
      controls.push("resume");
    }
    // Delete stays available for anything not already deleting or deleted, so a
    // stuck team can always be removed.
    controls.push("delete");
    return controls;
  }

  return {
    ENGINEER_ADDON_CENTS,
    ENGINEER_FLOOR,
    ENGINEER_MAX,
    GITHUB_INSTALLATION_STATE,
    LaunchContractError,
    PROVISIONING_STATE,
    REPOSITORY_SELECTION_MODE,
    TEAM_BASE_CENTS,
    accessibleRepositories,
    buildRepositorySelectionRequest,
    createMutationKeys,
    exampleRun,
    normalizeEngineerCount,
    teamPricing,
    teamRoster,
    githubInstallationActive,
    missingTeamPrerequisites,
    parseGitHubCallback,
    PROVISIONING_OPERATION,
    provisioningOperation,
    provisioningPresentation,
    provisioningProgress,
    provisioningState,
    provisioningTerminal,
    repositorySelectionMode,
    repositorySelectionReady,
    selectedRepositoryIds,
    subscriptionActive,
    teamLifecycleControls
  };
});
