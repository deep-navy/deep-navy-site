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

  return {
    GITHUB_INSTALLATION_STATE,
    LaunchContractError,
    PROVISIONING_STATE,
    REPOSITORY_SELECTION_MODE,
    accessibleRepositories,
    buildRepositorySelectionRequest,
    createMutationKeys,
    githubInstallationActive,
    missingTeamPrerequisites,
    parseGitHubCallback,
    provisioningPresentation,
    provisioningState,
    provisioningTerminal,
    repositorySelectionMode,
    repositorySelectionReady,
    selectedRepositoryIds,
    subscriptionActive
  };
});
