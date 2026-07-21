(() => {
  "use strict";

  const config = window.deepNavyRuntime || {};
  const ui = {
    environmentFields: [...document.querySelectorAll("[data-environment]")],
    contextOrganization: document.querySelector("[data-context-organization]"),
    contextRepositories: document.querySelector("[data-context-repositories]"),
    contextTeam: document.querySelector("[data-context-team]"),
    configBanner: document.querySelector("[data-config-banner]"),
    configTitle: document.querySelector("[data-config-title]"),
    configMessage: document.querySelector("[data-config-message]"),
    authBanner: document.querySelector("[data-auth-banner]"),
    authTitle: document.querySelector("[data-auth-title]"),
    authMessage: document.querySelector("[data-auth-message]"),
    signedOut: document.querySelector("[data-signed-out]"),
    authenticated: document.querySelector("[data-authenticated]"),
    signIn: document.querySelector("[data-sign-in]"),
    retrySignIn: document.querySelector("[data-retry-sign-in]"),
    signOut: document.querySelector("[data-sign-out]"),
    sessionState: document.querySelector("[data-session-state]"),
    authenticatedNav: document.querySelector("[data-authenticated-nav]"),
    userSummary: document.querySelector("[data-user-summary]"),
    userInitial: document.querySelector("[data-user-initial]"),
    userName: document.querySelector("[data-user-name]"),
    userLogin: document.querySelector("[data-user-login]"),
    organizationDependent: document.querySelector("[data-organization-dependent]"),
    organizationConnect: document.querySelector("[data-organization-connect]"),
    organizationBootstrapForm: document.querySelector("[data-organization-bootstrap]"),
    organizationBootstrapInput: document.querySelector("[data-organization-bootstrap] input"),
    organizationBootstrapSubmit: document.querySelector("[data-organization-bootstrap] button"),
    organizationSelectForm: document.querySelector("[data-organization-select]"),
    organizationSelectInput: document.querySelector("[data-organization-select] select"),
    organizationSelectSubmit: document.querySelector("[data-organization-select] button"),
    profileRetry: document.querySelector("[data-profile-retry]"),
    githubAction: document.querySelector("[data-github-action]"),
    repositoryForm: document.querySelector("[data-repository-form]"),
    repositoryList: document.querySelector("[data-repository-list]"),
    repositoryEmpty: document.querySelector("[data-repository-empty]"),
    repositorySave: document.querySelector("[data-repository-save]"),
    repositoryRefresh: document.querySelector("[data-repository-refresh]"),
    repositoryModes: [...document.querySelectorAll('input[name="repositoryMode"]')],
    planSummary: document.querySelector("[data-plan-summary]"),
    planName: document.querySelector("[data-plan-name]"),
    planPrice: document.querySelector("[data-plan-price]"),
    planCredits: document.querySelector("[data-plan-credits]"),
    planSlots: document.querySelector("[data-plan-slots]"),
    settingsAccountName: document.querySelector("[data-settings-account-name]"),
    settingsAccountLogin: document.querySelector("[data-settings-account-login]"),
    settingsAccountOrg: document.querySelector("[data-settings-account-org]"),
    settingsMembers: document.querySelector("[data-settings-members]"),
    settingsMembersEmpty: document.querySelector("[data-settings-members-empty]"),
    settingsMembersCount: document.querySelector("[data-settings-members-count]"),
    settingsBillingState: document.querySelector("[data-settings-billing-state]"),
    settingsTeamCount: document.querySelector("[data-settings-team-count]"),
    settingsBillingAmount: document.querySelector("[data-settings-billing-amount]"),
    settingsBillingUnit: document.querySelector("[data-settings-billing-unit]"),
    settingsPaymentMethod: document.querySelector("[data-settings-payment-method]"),
    settingsBillingNote: document.querySelector("[data-settings-billing-note]"),
    settingsBillingManage: document.querySelector("[data-settings-billing-manage]"),
    teamForm: document.querySelector("[data-team-form]"),
    teamInput: document.querySelector('[data-team-form] input[name="teamName"]'),
    teamSubmit: document.querySelector('[data-team-form] button[type="submit"]'),
    teamError: document.querySelector("[data-team-error]"),
    teamObjective: document.querySelector("[data-team-objective]"),
    engineerInput: document.querySelector("[data-engineer-input]"),
    engineerDecrement: document.querySelector("[data-engineer-decrement]"),
    engineerIncrement: document.querySelector("[data-engineer-increment]"),
    teamRoster: document.querySelector("[data-team-roster]"),
    teamPriceAmount: document.querySelector("[data-team-price-amount]"),
    teamPriceBreakdown: document.querySelector("[data-team-price-breakdown]"),
    engineerSettings: document.querySelector("[data-engineer-settings]"),
    engineerSettingsState: document.querySelector("[data-engineer-settings-state]"),
    engineerSettingsTeam: document.querySelector("[data-engineer-settings-team]"),
    engineerSettingsField: document.querySelector("[data-engineer-settings-field]"),
    settingsEngineerInput: document.querySelector("[data-settings-engineer-input]"),
    settingsEngineerDecrement: document.querySelector("[data-settings-engineer-decrement]"),
    settingsEngineerIncrement: document.querySelector("[data-settings-engineer-increment]"),
    settingsEngineerPrice: document.querySelector("[data-settings-engineer-price]"),
    settingsEngineerNote: document.querySelector("[data-settings-engineer-note]"),
    settingsEngineerError: document.querySelector("[data-settings-engineer-error]"),
    settingsEngineerApply: document.querySelector("[data-settings-engineer-apply]"),
    organizationError: document.querySelector("[data-organization-error]"),
    refresh: document.querySelector("[data-refresh]"),
    teamsEmpty: document.querySelector("[data-teams-empty]"),
    teamList: document.querySelector("[data-team-list]"),
    progressSummary: document.querySelector("[data-progress-summary]"),
    progressSteps: [...document.querySelectorAll("[data-progress-step]")],
    dashboardState: document.querySelector("[data-dashboard-state]"),
    teamSelect: document.querySelector("[data-team-select]"),
    agentsState: document.querySelector("[data-agents-state]"),
    agentsEmpty: document.querySelector("[data-agents-empty]"),
    agentList: document.querySelector("[data-agent-list]"),
    objectiveState: document.querySelector("[data-objective-state]"),
    objectiveEmpty: document.querySelector("[data-objective-empty]"),
    objectiveSelectControl: document.querySelector("[data-objective-select-control]"),
    objectiveSelect: document.querySelector("[data-objective-select]"),
    objectiveForm: document.querySelector("[data-objective-form]"),
    objectiveTitleInput: document.querySelector('[data-objective-form] input[name="objectiveTitle"]'),
    objectiveDescriptionInput: document.querySelector('[data-objective-form] textarea[name="objectiveDescription"]'),
    objectiveSubmit: document.querySelector("[data-objective-form] button"),
    objectiveError: document.querySelector("[data-objective-error]"),
    objectiveRecord: document.querySelector("[data-objective-record]"),
    objectiveTitle: document.querySelector("[data-objective-title]"),
    objectiveDescription: document.querySelector("[data-objective-description]"),
    objectiveDispatchState: document.querySelector("[data-objective-dispatch-state]"),
    objectiveDispatchDetail: document.querySelector("[data-objective-dispatch-detail]"),
    objectiveKpiState: document.querySelector("[data-objective-kpi-state]"),
    objectiveKpiEmpty: document.querySelector("[data-objective-kpi-empty]"),
    objectiveKpiList: document.querySelector("[data-objective-kpi-list]"),
    initiativeState: document.querySelector("[data-initiative-state]"),
    initiativeList: document.querySelector("[data-initiative-list]"),
    activityState: document.querySelector("[data-activity-state]"),
    activityFilters: document.querySelector("[data-activity-filters]"),
    activityFilterButtons: [...document.querySelectorAll("[data-activity-filter]")],
    activityFilterCounts: [...document.querySelectorAll("[data-activity-filter-count]")],
    activityEmpty: document.querySelector("[data-activity-empty]"),
    activityList: document.querySelector("[data-activity-list]"),
    activityRetry: document.querySelector("[data-activity-retry]"),
    sessionHistoryState: document.querySelector("[data-session-history-state]"),
    sessionsMore: document.querySelector("[data-sessions-more]"),
    workspaceHistoryState: document.querySelector("[data-workspace-history-state]"),
    workspaceMore: document.querySelector("[data-workspace-more]"),
    deliveryHistoryState: document.querySelector("[data-delivery-history-state]"),
    deliveryRepository: document.querySelector("[data-delivery-repository]"),
    issuesMore: document.querySelector("[data-issues-more]"),
    pullRequestsMore: document.querySelector("[data-pull-requests-more]"),
    economicsState: document.querySelector("[data-economics-state]"),
    economicsMessage: document.querySelector("[data-economics-message]"),
    economicsEmpty: document.querySelector("[data-economics-empty]"),
    economicsMetrics: document.querySelector("[data-economics-metrics]"),
    economicsDirectCost: document.querySelector("[data-economics-direct-cost]"),
    economicsCreditsUsed: document.querySelector("[data-economics-credits-used]"),
    economicsCreditsRemaining: document.querySelector("[data-economics-credits-remaining]"),
    economicsMeasured: document.querySelector("[data-economics-measured]"),
    economicsBreakdown: document.querySelector("[data-economics-breakdown]"),
    economicsBreakdownState: document.querySelector("[data-economics-breakdown-state]"),
    economicsGroup: document.querySelector("[data-economics-group]"),
    economicsBreakdownEmpty: document.querySelector("[data-economics-breakdown-empty]"),
    economicsBreakdownList: document.querySelector("[data-economics-breakdown-list]"),
    creditBalancePanel: document.querySelector("[data-credit-balance-panel]"),
    creditBalanceState: document.querySelector("[data-credit-balance-state]"),
    creditBalanceValue: document.querySelector("[data-credit-balance-value]"),
    creditBalanceMessage: document.querySelector("[data-credit-balance-message]"),
    creditControl: document.querySelector("[data-credit-control]"),
    creditControlState: document.querySelector("[data-credit-control-state]"),
    creditOpenReserved: document.querySelector("[data-credit-open-reserved]"),
    creditPeriodConsumed: document.querySelector("[data-credit-period-consumed]"),
    creditHardLimit: document.querySelector("[data-credit-hard-limit]"),
    creditEffectiveAvailable: document.querySelector("[data-credit-effective-available]"),
    creditControlForm: document.querySelector("[data-credit-control-form]"),
    creditHardLimitInput: document.querySelector("[data-credit-hard-limit-input]"),
    creditCustomerPaused: document.querySelector("[data-credit-customer-paused]"),
    creditControlSummary: document.querySelector("[data-credit-control-summary]"),
    creditControlError: document.querySelector("[data-credit-control-error]"),
    creditControlSubmit: document.querySelector("[data-credit-control-submit]"),
    approvalsState: document.querySelector("[data-approvals-state]"),
    approvalsEmpty: document.querySelector("[data-approvals-empty]"),
    approvalList: document.querySelector("[data-approval-list]"),
    approvalsMore: document.querySelector("[data-approvals-more]"),
    creditPackForm: document.querySelector("[data-credit-pack-form]"),
    creditPackSelect: document.querySelector("[data-credit-pack-select]"),
    creditPackQuantity: document.querySelector("[data-credit-pack-quantity]"),
    creditPackSummary: document.querySelector("[data-credit-pack-summary]"),
    creditPackError: document.querySelector("[data-credit-pack-error]"),
    creditPackSubmit: document.querySelector("[data-credit-pack-submit]"),
    invoiceHistory: document.querySelector("[data-invoice-history]"),
    invoiceState: document.querySelector("[data-invoice-state]"),
    invoiceEmpty: document.querySelector("[data-invoice-empty]"),
    invoiceList: document.querySelector("[data-invoice-list]"),
    invoiceMore: document.querySelector("[data-invoice-more]"),
    checkoutDialog: document.querySelector("[data-checkout-dialog]"),
    checkoutTitle: document.querySelector("[data-checkout-title]"),
    checkoutSubtitle: document.querySelector("[data-checkout-subtitle]"),
    checkoutSummary: document.querySelector("[data-checkout-summary]"),
    checkoutStatus: document.querySelector("[data-checkout-status]"),
    checkoutMount: document.querySelector("[data-checkout-mount]"),
    checkoutForm: document.querySelector("[data-checkout-form]"),
    checkoutSubmit: document.querySelector("[data-checkout-submit]"),
    checkoutError: document.querySelector("[data-checkout-error]"),
    checkoutClose: document.querySelector("[data-checkout-close]"),
    toast: document.querySelector("[data-toast]")
  };

  if (!ui.signIn) return;

  const session = {
    accessToken: "",
    user: null,
    claims: {},
    organizationId: "",
    organizationName: "",
    members: [],
    githubInstalled: false,
    repositories: [],
    repositorySelection: null,
    repositorySelectionReady: false,
    repositoryServiceAvailable: false,
    billingPlan: null,
    billingPlanAvailable: false,
    billingPlanError: "",
    subscription: null,
    subscriptionActive: false,
    subscriptionManageable: false,
    paidTeamSlots: 0n,
    usedTeamSlots: 0n,
    availableTeamSlots: 0n,
    creditPacks: [],
    creditBalance: null,
    creditControl: null,
    invoices: [],
    invoiceIds: new Set(),
    invoiceNextPageToken: "",
    invoicePageTokens: new Set(),
    invoiceLoading: false,
    economicsBreakdowns: new Map(),
    selectedEconomicsGroup: "initiative",
    teamServiceAvailable: false,
    teams: [],
    teamLifecycleBusy: new Set(),
    teamLifecyclePendingDelete: "",
    completingGitHub: false,
    authPhase: "signed_out",
    selectedTeamId: "",
    workspaceGeneration: 0,
    activityAbort: null,
    provisioningAbort: null,
    activityEvents: [],
    activityEventIds: new Set(),
    provisioningEvents: [],
    activityProjections: new Map(),
    activityFilter: "all",
    lastActivitySequence: 0n,
    lastProvisioningSequence: 0n,
    sessions: [],
    sessionIds: new Set(),
    sessionNextPageToken: "",
    sessionPageTokens: new Set(),
    sessionHistoryLoading: false,
    workspaceChanges: [],
    workspaceChangeIds: new Set(),
    workspaceNextPageToken: "",
    workspacePageTokens: new Set(),
    workspaceHistoryLoading: false,
    lastWorkspaceSequence: 0n,
    deliveryRepositoryId: "",
    githubIssues: [],
    githubIssueIds: new Set(),
    githubIssuesNextPageToken: "",
    githubIssuePageTokens: new Set(),
    githubIssuesLoading: false,
    githubIssuesState: "waiting",
    githubPullRequests: [],
    githubPullRequestIds: new Set(),
    githubPullRequestsNextPageToken: "",
    githubPullRequestPageTokens: new Set(),
    githubPullRequestsLoading: false,
    githubPullRequestsState: "waiting",
    deliveryLoadGeneration: 0,
    githubIssueLastSort: null,
    githubPullRequestLastSort: null,
    objectivesByTeam: new Map(),
    objectiveListsByTeam: new Map(),
    approvals: [],
    approvalNextPageToken: "",
    approvalPageTokens: new Set(),
    approvalDecisionIds: new Set()
  };

  const environment = stringValue(config.environment) || "local";
  const storageNamespace = environment;
  const signInStorageKey = `deep-navy.sign-in.${storageNamespace}`;
  const githubStartStorageKey = `deep-navy.github-start.${storageNamespace}`;
  const githubCompletionStorageKey = `deep-navy.github-completion.${storageNamespace}`;
  const billingReturnStorageKey = `deep-navy.billing-return.${storageNamespace}`;
  const appPath = deriveAppPath();
  const appUrl = new URL(appPath, window.location.origin).toString();
  const apiBaseUrl = normalizeServiceUrl(config.api_base_url);
  const organizationContract = window.deepNavyOrganizationOnboarding || null;
  const launchContract = window.deepNavyLaunchContract || null;
  const appState = window.deepNavyAppState || null;
  const agentRoleContract = window.DeepNavyAgentRoles || null;
  const generatedClient = window.deepNavyGeneratedClient || null;
  const platformApi = createPlatformApi();
  const identity = identityConfiguration();
  const stripePublishableKey = validatedStripePublishableKey(config.stripe_publishable_key);
  let stripeClient = null;
  let stripeLoadPromise = null;
  let embeddedCheckout = null;
  let teamPaymentElements = null;
  let checkoutTeamId = "";
  let checkoutOpening = false;
  // The Settings engineer stepper resets to the team's confirmed count only when
  // the selected team changes, so a background re-render never clobbers an edit.
  let engineerControlTeamId = "";
  let engineerControlBusy = false;
  const provisioningTimers = new Map();
  // Pending teams from RequestTeam are polled with GetTeam until they leave
  // LIFECYCLE_STATE_PENDING (a verified Stripe webhook provisions them).
  const pendingTeamTimers = new Map();
  const mutationKeys = launchContract?.createMutationKeys(() => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18));
  const organizationCoordinator = organizationContract?.createCoordinator({
    request: apiRequest,
    createIdempotencyKey: () => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18)
  });

  ui.environmentFields.forEach((field) => { field.textContent = environment; });
  ui.signIn.disabled = !identity.ready;

  function setAuthPhase(phase) {
    const presentation = appState?.authPresentation
      ? appState.authPresentation(phase, Boolean(session.accessToken))
      : {
          phase: session.accessToken ? "authenticated" : "signed_out",
          authenticated: Boolean(session.accessToken),
          signedOutVisible: !session.accessToken,
          workspaceVisible: Boolean(session.accessToken),
          signOutVisible: Boolean(session.accessToken),
          userVisible: Boolean(session.accessToken),
          sessionLabel: session.accessToken ? "Signed in" : "Signed out"
        };
    session.authPhase = presentation.phase;
    document.body.dataset.authState = presentation.phase;
    ui.signedOut.hidden = !presentation.signedOutVisible;
    ui.authenticated.hidden = !presentation.workspaceVisible;
    ui.authenticatedNav.hidden = !presentation.workspaceVisible;
    ui.signOut.hidden = !presentation.signOutVisible;
    ui.userSummary.hidden = !presentation.userVisible;
    ui.sessionState.textContent = presentation.sessionLabel;
    ui.signIn.disabled = presentation.phase === "authenticating" || !identity.ready;
  }

  function stringValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function deriveAppPath() {
    const path = window.location.pathname;
    if (/\/app\/(?:github\/)?callback\/?$/.test(path)) return path.replace(/(?:github\/)?callback\/?$/, "");
    if (/\/app\/?$/.test(path)) return path.endsWith("/") ? path : `${path}/`;
    const script = document.querySelector('script[src*="/assets/js/app.js"]');
    if (script) {
      const scriptPath = new URL(script.src).pathname;
      return scriptPath.replace(/\/assets\/js\/app\.js$/, "/app/");
    }
    return "/app/";
  }

  function normalizeServiceUrl(value) {
    const raw = stringValue(value);
    if (!raw) return "";
    try {
      const url = new URL(raw);
      const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      if (url.protocol !== "https:" && !localHttp) return "";
      if (url.username || url.password || url.search || url.hash) return "";
      return url.toString().replace(/\/$/, "");
    } catch {
      return "";
    }
  }

  function validatedStripePublishableKey(value) {
    const key = stringValue(value);
    if (!/^pk_(?:test|live)_[A-Za-z0-9]{8,}$/.test(key)) return "";
    if (environment === "development" && !key.startsWith("pk_test_")) return "";
    if (environment === "production" && !key.startsWith("pk_live_")) return "";
    return key;
  }

  // Stripe is only needed when creating a team (the paid action, via embedded
  // Checkout) and for prepaid credit packs — never for sign-in or repository
  // onboarding. We treat the presence of a publishable key as "billing is
  // configured" (synchronous, gates the UI) and load Stripe.js lazily the first
  // time a checkout actually runs.
  function stripeConfigured() {
    return Boolean(stripePublishableKey);
  }

  // Inject Stripe.js on demand. Stripe requires loading it directly from
  // js.stripe.com (no bundling, self-hosting, or SRI — the file updates
  // continuously), so we add the current pinned version as a script tag the
  // first time it is needed and reuse the single resolved client instance.
  function ensureStripe() {
    if (stripeClient) return Promise.resolve(stripeClient);
    if (!stripePublishableKey) return Promise.resolve(null);
    if (!stripeLoadPromise) {
      stripeLoadPromise = new Promise((resolve) => {
        if (typeof window.Stripe === "function") { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/dahlia/stripe.js";
        script.async = true;
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", () => resolve());
        document.head.appendChild(script);
      }).then(() => {
        if (typeof window.Stripe !== "function") return null;
        try { stripeClient = window.Stripe(stripePublishableKey); } catch { stripeClient = null; }
        return stripeClient;
      });
    }
    return stripeLoadPromise;
  }

  function createPlatformApi() {
    if (!apiBaseUrl || generatedClient?.PLATFORM_PROTOS_REVISION !== "4087963e8b1ca19797e9ef688d7d597ca642920e" || typeof generatedClient.createPlatformApi !== "function") return null;
    try {
      return generatedClient.createPlatformApi({ baseUrl: apiBaseUrl, defaultTimeoutMs: 16000 });
    } catch {
      return null;
    }
  }

  function identityConfiguration() {
    // Sign-in readiness no longer depends on Cognito. The GitHub sign-in round
    // trip is owned by the platform API, so readiness means the platform API
    // origin is configured and the generated client bundle loaded.
    return { ready: Boolean(apiBaseUrl && platformApi) };
  }

  function renderConfiguration() {
    const missing = [];
    if (!apiBaseUrl) missing.push("platform API origin");
    if (!platformApi) missing.push("platform API client");
    if (!stripeConfigured()) missing.push("Stripe publishable configuration");

    if (missing.length === 0) {
      ui.configBanner.hidden = true;
    } else if (identity.ready) {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "warning", "Sign-in ready; platform services pending", `Missing ${missing.join(", ")}. You can sign in, but server-backed onboarding remains unavailable until deployment configuration is complete.`);
    } else {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "warning", "This environment is not ready for sign-in", `Missing ${missing.join(", ")}. No authentication or onboarding action will be attempted.`);
    }
  }

  function setBanner(element, titleElement, messageElement, tone, title, message) {
    element.dataset.tone = tone;
    titleElement.textContent = title;
    messageElement.textContent = message;
    element.hidden = false;
  }

  function randomBase64Url(byteLength) {
    const bytes = new Uint8Array(byteLength);
    window.crypto.getRandomValues(bytes);
    return bytesToBase64Url(bytes);
  }

  function bytesToBase64Url(bytes) {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // target "authorization" is the normal OAuth login; "installation" sends a
  // newly signed-in user who has not installed the App yet to install it and
  // connect repositories. Installing authorizes too, so the same callback
  // completes sign-in and derives the organization.
  async function beginSignIn(target = "authorization") {
    hideAuthError();
    if (!identity.ready || !platformApi) {
      showAuthError("Sign-in is not available", "This deployment is missing its platform API configuration or the generated client bundle. No sign-in request was sent.");
      return;
    }

    setAuthPhase("authenticating");
    ui.signIn.disabled = true;
    ui.retrySignIn.disabled = true;
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      // The server owns the one-time state; the browser only records that this
      // GitHub round trip is a sign-in so the callback can distinguish it from a
      // signed-in repository-management install.
      if (!storageWrite(signInStorageKey, { purpose: "sign_in", createdAt: Date.now() })) {
        throw new Error("secure_storage_unavailable");
      }
      const result = await platformApi.signIn("github_sign_in_start", { returnTo: appPath }, { requestId, signal: controller.signal });
      const url = target === "installation"
        ? (result?.installationUrl || result?.installation_url)
        : result?.authorizationUrl;
      const destination = validatedRedirect(url, ["github.com"]);
      if (!destination) throw new Error("untrusted_authorization_url");
      window.location.assign(destination);
    } catch {
      clearSignInTransaction();
      setAuthPhase("signed_out");
      showAuthError("Could not start sign-in", "deep navy could not begin GitHub sign-in. No credentials were sent. Try again in a moment.");
      ui.signIn.disabled = !identity.ready;
      ui.retrySignIn.disabled = !identity.ready;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function completeSignInCallback(callback) {
    setAuthPhase("authenticating");
    clearSignInTransaction();
    if (!platformApi) {
      showAuthError("Cannot complete sign-in", "The generated platform API client did not load at the pinned contract revision. No sign-in request was sent.");
      return false;
    }

    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "Completing secure sign-in", "Verifying the one-time GitHub authorization with deep navy. Your session stays in memory.");
    ui.retrySignIn.hidden = true;

    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const result = await platformApi.signIn("github_sign_in_complete", {
        authorizationCode: callback.authorizationCode,
        stateToken: callback.stateToken,
        installationId: callback.installationId,
        returnTo: appPath
      }, { requestId, signal: controller.signal });
      const sessionToken = stringValue(result?.sessionToken);
      if (!sessionToken) throw new Error("session_token_missing");

      const user = result?.user || {};
      session.accessToken = sessionToken;
      // Preliminary display only; the authoritative profile is loaded from
      // GetCurrentUser during initializeAuthenticatedSession.
      session.claims = {
        displayName: stringValue(user.displayName),
        githubLogin: stringValue(user.githubLogin),
        email: stringValue(user.email)
      };
      hideAuthError();
      showAuthenticated();
      await initializeAuthenticatedSession();
      return true;
    } catch {
      session.accessToken = "";
      session.claims = {};
      showAuthError("Sign-in could not be completed", "deep navy could not verify the one-time GitHub authorization. The code was not retained. Start a new sign-in attempt.");
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function readSignInTransaction() {
    const value = storageRead(signInStorageKey);
    const tenMinutes = 10 * 60 * 1000;
    if (!value || value.purpose !== "sign_in" || typeof value.createdAt !== "number" || Date.now() - value.createdAt > tenMinutes) {
      storageRemove(signInStorageKey);
      return null;
    }
    return value;
  }

  function clearSignInTransaction() {
    storageRemove(signInStorageKey);
  }

  function storageRead(key) {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(key) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function storageWrite(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function storageRemove(key) {
    try { window.sessionStorage.removeItem(key); } catch { /* session storage may be disabled */ }
  }

  function readGitHubStart() {
    const value = storageRead(githubStartStorageKey);
    if (!value || typeof value.createdAt !== "number" || Date.now() - value.createdAt > 30 * 60 * 1000) {
      storageRemove(githubStartStorageKey);
      return null;
    }
    return value;
  }

  function readGitHubCompletion() {
    const value = storageRead(githubCompletionStorageKey);
    if (!value || typeof value.createdAt !== "number" || Date.now() - value.createdAt > 15 * 60 * 1000) {
      storageRemove(githubCompletionStorageKey);
      return null;
    }
    return value;
  }

  function clearGitHubFlow() {
    storageRemove(githubStartStorageKey);
    storageRemove(githubCompletionStorageKey);
    mutationKeys?.clear("githubStart");
  }

  function captureGitHubCallback(params) {
    if (!launchContract) throw new Error("launch_contract_unavailable");
    const callback = launchContract.parseGitHubCallback(params, { forceGitHub: document.body.dataset.githubCallback === "true" });
    if (!callback) return false;
    const start = readGitHubStart();
    const completion = {
      ...callback,
      organizationId: stringValue(start?.organizationId),
      flowId: stringValue(start?.flowId),
      idempotencyKey: window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18),
      createdAt: Date.now()
    };
    if (!storageWrite(githubCompletionStorageKey, completion)) {
      throw new Error("secure_callback_storage_unavailable");
    }
    return true;
  }

  function captureBillingReturn(params) {
    const value = stringValue(params.get("billing") || params.get("checkout")).toLowerCase();
    const sessionId = stringValue(params.get("session_id"));
    if (value !== "return" || !/^cs_(?:test|live)_[A-Za-z0-9_]{8,}$/.test(sessionId)) return false;
    storageWrite(billingReturnStorageKey, { value: "return", createdAt: Date.now() });
    return true;
  }

  function stripCallbackQuery() {
    if (!window.location.search) return;
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
  }

  function showAuthError(title, message) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "error", title, message);
    ui.retrySignIn.hidden = false;
    ui.retrySignIn.disabled = !identity.ready;
    setAuthPhase("signed_out");
  }

  function hideAuthError() {
    ui.authBanner.hidden = true;
    ui.retrySignIn.hidden = false;
  }

  function showAuthenticated() {
    setAuthPhase("authenticated");
    updateProgressStep("identity", "complete", "Authenticated");
    const name = stringValue(session.claims.displayName) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(session.claims.githubLogin) || stringValue(session.claims.email);
    ui.userName.textContent = name;
    ui.userLogin.textContent = login;
    ui.userInitial.textContent = name.charAt(0).toUpperCase();
  }

  async function initializeAuthenticatedSession() {
    if (!apiBaseUrl) {
      setStep("organization", "error", "Unavailable", "The platform API origin is not configured. No organization state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The platform API origin is not configured for this environment. You are signed in, but no onboarding request can be made.");
      return;
    }
    if (!platformApi) {
      setStep("organization", "error", "Unavailable", "The generated platform API client did not load at the pinned contract revision. No onboarding request was attempted.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The generated browser API client is unavailable. Reload after the deployment bundle is repaired.");
      return;
    }
    if (!organizationCoordinator) {
      setStep("organization", "error", "Unavailable", "The organization contract did not load. No organization state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The organization onboarding contract is unavailable. Downstream actions are disabled.");
      return;
    }
    if (!launchContract || !mutationKeys) {
      setStep("organization", "error", "Unavailable", "The launch contract helpers did not load. No onboarding state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The launch contract helpers are unavailable. Reload after the deployment bundle is repaired.");
      return;
    }

    resetOrganizationControls();
    setStep("organization", "loading", "Checking", "Loading the memberships authorized for this signed-in account.");
    try {
      let state = await organizationCoordinator.load();
      renderProfile(state.profile);
      state = await alignPendingGitHubOrganization(state);
      await renderOrganizationState(state);
    } catch (error) {
      session.organizationId = "";
      ui.organizationDependent.hidden = true;
      ui.profileRetry.hidden = false;
      setStep("organization", "error", "Unavailable", organizationErrorMessage(error, "The API could not establish a trusted current user and organization. No organization state was assumed."));
      setAllStepsUnavailable("A server-confirmed organization is required before downstream onboarding can begin.");
    }
  }

  async function alignPendingGitHubOrganization(state) {
    const pending = readGitHubCompletion();
    const targetId = stringValue(pending?.organizationId);
    if (!targetId) return state;
    const currentId = stringValue(state?.organization?.id);
    if (state.kind === "ready" && currentId === targetId) return state;
    const allowed = Array.isArray(state?.memberships) && state.memberships.some((membership) => membership.id === targetId);
    if (!allowed) {
      clearGitHubFlow();
      throw new organizationContract.ContractError("The GitHub installation was started for an organization that is not available to this signed-in user.", "organization_not_accessible");
    }
    return organizationCoordinator.select(targetId);
  }

  function renderProfile(profile) {
    const user = profile?.user || {};
    session.user = user;
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(user.email) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email);
    ui.userName.textContent = name;
    ui.userLogin.textContent = login;
    ui.userInitial.textContent = name.charAt(0).toUpperCase();
    renderSettingsAccount();
  }

  function resetOrganizationControls() {
    if (ui.organizationConnect) { ui.organizationConnect.hidden = true; ui.organizationConnect.disabled = true; }
    ui.organizationBootstrapForm.hidden = true;
    ui.organizationBootstrapInput.disabled = true;
    ui.organizationBootstrapSubmit.disabled = true;
    ui.organizationSelectForm.hidden = true;
    ui.organizationSelectInput.disabled = true;
    ui.organizationSelectSubmit.disabled = true;
    ui.profileRetry.hidden = true;
    setFieldError(ui.organizationError, "");
  }

  async function renderOrganizationState(state) {
    closeEmbeddedCheckout();
    resetOrganizationControls();
    session.organizationId = "";
    session.creditPacks = [];
    session.creditBalance = null;
    session.creditControl = null;
    resetInvoiceHistory("Select an organization to load its verified billing records.", "Waiting");
    resetSubscriptionCapacity();
    session.organizationName = "";
    session.members = [];
    session.subscription = null;
    session.subscriptionActive = false;
    session.subscriptionManageable = false;
    renderSettingsAccount();
    renderSettingsBilling();
    ui.contextOrganization.textContent = "Not selected";
    ui.organizationDependent.hidden = true;

    if (state.kind === "needs_bootstrap") {
      // Your Deep Navy organization is derived from the GitHub organization you
      // connect, so a signed-in user with no membership simply hasn't installed
      // the App yet. Offer to connect repositories (install) — installing also
      // authorizes, so the callback completes sign-in and creates the workspace
      // automatically. The manual name-your-organization form stays available as
      // a fallback for environments without a configured GitHub App.
      if (ui.organizationConnect) {
        setStep("organization", "action", "Connect GitHub", "Install the deep navy GitHub App on your organization to connect the repositories your team will work on. Your organization and workspace are created automatically.");
        ui.organizationConnect.hidden = false;
        ui.organizationConnect.disabled = false;
        setAllStepsUnavailable("Connect your GitHub repositories to create your workspace.", "blocked");
        return;
      }
      setStep("organization", "action", "Needs action", "Name your organization. The API will create the organization and your owner membership atomically; safe retries reuse the same idempotency key.");
      ui.organizationBootstrapForm.hidden = false;
      ui.organizationBootstrapInput.disabled = false;
      ui.organizationBootstrapSubmit.disabled = false;
      ui.organizationBootstrapInput.focus();
      setAllStepsUnavailable("Create your organization before continuing with GitHub, billing, or teams.", "blocked");
      return;
    }

    if (state.kind === "needs_selection") {
      setStep("organization", "action", "Choose", "Choose one of the organizations the API returned for this signed-in user. No arbitrary organization ID can be entered.");
      ui.organizationSelectInput.replaceChildren();
      state.memberships.forEach((membership) => {
        const option = document.createElement("option");
        option.value = membership.id;
        option.textContent = membership.slug ? `${membership.name} (${membership.slug})` : membership.name;
        ui.organizationSelectInput.append(option);
      });
      ui.organizationSelectForm.hidden = false;
      ui.organizationSelectInput.disabled = false;
      ui.organizationSelectSubmit.disabled = false;
      setAllStepsUnavailable("Select an authorized organization before continuing with GitHub, billing, or teams.", "blocked");
      return;
    }

    if (state.kind !== "ready") throw new organizationContract.ContractError("The organization coordinator returned an unknown state.");
    const organizationId = stringValue(state.organization?.id);
    if (!organizationId) throw new organizationContract.ContractError("The ready organization has no ID.");
    session.organizationId = organizationId;
    const organizationName = stringValue(state.organization.name) || "your organization";
    session.organizationName = organizationName;
    session.members = buildOrganizationMembers(state);
    renderSettingsAccount();
    renderSettingsBilling();
    ui.contextOrganization.textContent = organizationName;
    setStep("organization", "complete", "Ready", `${organizationName} is the current server-confirmed organization for this session.`);
    ui.organizationDependent.hidden = false;
    if (readGitHubCompletion()) await completePendingGitHubInstallation();
    await refreshOnboarding();
  }

  class ApiError extends Error {
    constructor(message, status, code, requestId) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
      this.requestId = requestId;
    }
  }

  async function apiRequest(name, payload) {
    if (!session.accessToken) throw new ApiError("Sign-in is required", 401, "unauthenticated", "");
    if (!apiBaseUrl) throw new ApiError("Platform API is not configured", 0, "not_configured", "");
    if (!platformApi) throw new ApiError("Generated platform client is not available", 0, "not_configured", "");
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      return await platformApi.request(name, payload || {}, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) throw new ApiError("The service did not respond within 15 seconds", 0, "timeout", requestId);
      if (error?.name === "PlatformClientError") {
        throw new ApiError(stringValue(error.message) || "The platform service rejected the request", Number(error.status || 0), stringValue(error.code) || "unknown", stringValue(error.requestId) || requestId);
      }
      throw new ApiError("The browser could not reach the configured service", 0, "network_error", requestId);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function isMissingResource(error) {
    return error instanceof ApiError && error.status === 404 && ["not_found", "5"].includes(error.code);
  }

  function apiErrorMessage(error, fallback) {
    if (!(error instanceof ApiError)) return fallback;
    if (error.code === "not_configured") return `${fallback} The endpoint is not configured.`;
    if (error.status === 401 || error.code === "unauthenticated") return "The API did not accept this session. Sign out and sign in again.";
    if (error.status === 403 || error.code === "permission_denied") return "Your account is signed in but is not authorized for this organization action.";
    const safeServiceMessage = stringValue(error.message);
    const suffix = error.requestId ? ` Request ID: ${error.requestId}.` : "";
    return `${safeServiceMessage && !["network_error", "timeout"].includes(error.code) ? safeServiceMessage : fallback}${suffix}`;
  }

  function isRetryableApiError(error) {
    return error instanceof ApiError && ["network_error", "timeout", "deadline_exceeded", "unavailable", "resource_exhausted", "internal", "unknown"].includes(error.code);
  }

  function organizationErrorMessage(error, fallback) {
    if (organizationContract && error instanceof organizationContract.ContractError) return `${fallback} ${error.message}`;
    return apiErrorMessage(error, fallback);
  }

  async function bootstrapOrganization(event) {
    event.preventDefault();
    const name = stringValue(new FormData(ui.organizationBootstrapForm).get("organizationName"));
    setFieldError(ui.organizationError, "");
    ui.organizationBootstrapInput.disabled = true;
    ui.organizationBootstrapSubmit.disabled = true;
    ui.organizationBootstrapSubmit.textContent = "Creating…";
    setStep("organization", "loading", "Creating", "Creating the organization, owner membership, and current selection as one idempotent operation.");
    try {
      const state = await organizationCoordinator.bootstrap(name);
      ui.organizationBootstrapForm.reset();
      await renderOrganizationState(state);
      toast("The API confirmed your organization and owner membership.", "success");
    } catch (error) {
      const message = organizationErrorMessage(error, "The API did not confirm organization creation. No completion state was assumed; retrying the same name is safe.");
      setStep("organization", "error", "Not confirmed", message);
      setFieldError(ui.organizationError, message);
      ui.organizationBootstrapForm.hidden = false;
      ui.organizationBootstrapInput.disabled = false;
      ui.organizationBootstrapSubmit.disabled = false;
    } finally {
      ui.organizationBootstrapSubmit.textContent = "Create organization";
    }
  }

  async function selectOrganization(event) {
    event.preventDefault();
    const organizationId = stringValue(new FormData(ui.organizationSelectForm).get("organizationId"));
    ui.organizationSelectInput.disabled = true;
    ui.organizationSelectSubmit.disabled = true;
    ui.organizationSelectSubmit.textContent = "Selecting…";
    setStep("organization", "loading", "Selecting", "Confirming this membership and current organization with the API.");
    try {
      const state = await organizationCoordinator.select(organizationId);
      await renderOrganizationState(state);
    } catch (error) {
      setStep("organization", "error", "Not selected", organizationErrorMessage(error, "The API did not confirm this organization selection. No organization state was assumed."));
      ui.organizationSelectForm.hidden = false;
      ui.organizationSelectInput.disabled = false;
      ui.organizationSelectSubmit.disabled = false;
    } finally {
      ui.organizationSelectSubmit.textContent = "Continue with organization";
    }
  }

  async function listAllTeams() {
    const teams = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
      const response = await apiRequest("teams", { organizationId: session.organizationId, page: { pageSize: 100, pageToken } });
      const pageTeams = Array.isArray(response?.teams) ? response.teams : [];
      if (pageTeams.length > 100) throw new ApiError("TeamService returned an oversized page", 0, "invalid_response", "");
      for (const team of pageTeams) {
        const id = stringValue(team?.id);
        if (!id || stringValue(team?.organizationId) !== session.organizationId || seenIds.has(id)) {
          throw new ApiError("TeamService returned an invalid or duplicate organization-scoped team", 0, "invalid_response", "");
        }
        seenIds.add(id);
        teams.push(team);
      }
      const nextPageToken = stringValue(response?.page?.nextPageToken);
      if (!nextPageToken) return { teams, page: { nextPageToken: "" } };
      if (nextPageToken === pageToken || seenTokens.has(nextPageToken)) throw new ApiError("TeamService returned a repeated page cursor", 0, "invalid_response", "");
      seenTokens.add(nextPageToken);
      pageToken = nextPageToken;
    }
    throw new ApiError("TeamService exceeded the safe pagination limit", 0, "invalid_response", "");
  }

  async function refreshOnboarding() {
    setStep("github", "loading", "Checking", "Checking for an organization-bound GitHub App installation.");
    setStep("repositories", "loading", "Checking", "Loading the repositories that the GitHub App makes available.");
    setStep("team", "loading", "Checking", "Checking existing engineering teams and prerequisites.");
    resetInvoiceHistory("Loading the signed-webhook-backed invoice projection.", "Loading", "loading");
    ui.refresh.disabled = true;
    const [githubResult, planResult, subscriptionResult, teamsResult, invoicesResult] = await Promise.allSettled([
      apiRequest("github_installation", { organizationId: session.organizationId }),
      apiRequest("billing_plan", { planId: stringValue(config.plan_id) || "founding-team" }),
      apiRequest("subscription", { organizationId: session.organizationId }),
      listAllTeams(),
      apiRequest("invoices", { organizationId: session.organizationId, page: { pageSize: 25 } })
    ]);

    renderBillingPlanResult(planResult);
    renderSubscriptionResult(subscriptionResult);
    renderTeamsResult(teamsResult);
    renderInvoicesResult(invoicesResult);
    await renderGitHubResult(githubResult);
    updateTeamAction();
    await refreshCreditPacks();
    reconcileBillingReturn();
    await refreshSelectedTeam();
    ui.refresh.disabled = false;
  }

  async function renderGitHubResult(result) {
    if (result.status === "fulfilled") {
      const installation = result.value.installation;
      if (installation && stringValue(installation.organizationId) !== session.organizationId) {
        session.githubInstalled = false;
        setStep("github", "error", "Invalid response", "The GitHub service returned an installation outside the current organization scope. No connection was displayed.");
        ui.githubAction.disabled = true;
        resetRepositoryAccess("Repository access cannot be checked until the GitHub installation scope is valid.", "error");
        return;
      }
      session.githubInstalled = Boolean(launchContract?.githubInstallationActive(installation));
      if (session.githubInstalled) {
        const account = stringValue(installation.accountLogin) || stringValue(installation.account_login) || "selected GitHub account";
        setStep("github", "complete", "Connected", `The API confirms an active installation for ${account}. Choose the repositories deep navy may use next.`);
        ui.githubAction.textContent = "Manage GitHub access";
        ui.githubAction.disabled = false;
        await refreshRepositoryAccess();
      } else {
        setStep("github", "action", "Needs action", "The GitHub App installation is not active. Start or resume the secure installation flow.");
        ui.githubAction.textContent = "Install GitHub App";
        ui.githubAction.disabled = false;
        resetRepositoryAccess("Connect an active GitHub App installation before choosing repositories.");
      }
      return;
    }
    session.githubInstalled = false;
    if (isMissingResource(result.reason)) {
      setStep("github", "action", "Needs action", "No GitHub App installation is recorded for this organization.");
      ui.githubAction.disabled = false;
      ui.githubAction.textContent = "Install GitHub App";
      resetRepositoryAccess("Connect the GitHub App before choosing repositories.");
    } else {
      setStep("github", "error", "Unavailable", apiErrorMessage(result.reason, "The GitHub integration service is not ready. No installation state was assumed."));
      ui.githubAction.disabled = true;
      resetRepositoryAccess("Repository access cannot be checked until the GitHub installation service responds.", "error");
    }
  }

  function resetRepositoryAccess(message, stateValue = "blocked") {
    session.repositories = [];
    session.repositorySelection = null;
    session.repositorySelectionReady = false;
    session.repositoryServiceAvailable = false;
    ui.repositoryForm.hidden = true;
    ui.repositoryList.replaceChildren();
    ui.contextRepositories.textContent = "Not loaded";
    setStep("repositories", stateValue, stateValue === "error" ? "Unavailable" : "Blocked", message);
  }

  async function listAllRepositories() {
    const repositories = [];
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("repositories", {
        organizationId: session.organizationId,
        page: { pageSize: 100, pageToken }
      });
      if (Array.isArray(response.repositories)) repositories.push(...response.repositories);
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return repositories;
      if (seenTokens.has(next)) throw new ApiError("Repository pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Repository list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  async function refreshRepositoryAccess() {
    if (!session.githubInstalled) {
      resetRepositoryAccess("Connect the GitHub App before choosing repositories.");
      return;
    }
    setStep("repositories", "loading", "Loading", "Loading accessible repositories and the current server-side selection.");
    ui.repositoryForm.hidden = true;
    const [repositoriesResult, selectionResult] = await Promise.allSettled([
      listAllRepositories(),
      apiRequest("repository_selection", { organizationId: session.organizationId })
    ]);
    if (repositoriesResult.status === "rejected") {
      resetRepositoryAccess(apiErrorMessage(repositoriesResult.reason, "The repository service is unavailable. No repository access was assumed."), "error");
      return;
    }
    if (selectionResult.status === "rejected" && !isMissingResource(selectionResult.reason)) {
      resetRepositoryAccess(apiErrorMessage(selectionResult.reason, "The saved repository selection could not be loaded."), "error");
      return;
    }
    try {
      const rawRepositories = Array.isArray(repositoriesResult.value) ? repositoriesResult.value : [];
      const selection = selectionResult.status === "fulfilled" ? selectionResult.value.selection : null;
      if (rawRepositories.some((repository) => stringValue(repository?.organizationId) !== session.organizationId)) {
        throw new launchContract.LaunchContractError("The repository service returned a resource outside the current organization scope.");
      }
      if (selection && stringValue(selection.organizationId) !== session.organizationId) {
        throw new launchContract.LaunchContractError("The repository service returned a selection outside the current organization scope.");
      }
      session.repositoryServiceAvailable = true;
      session.repositories = launchContract.accessibleRepositories(rawRepositories).sort((left, right) => {
        const leftName = `${stringValue(left.owner)}/${stringValue(left.name)}`;
        const rightName = `${stringValue(right.owner)}/${stringValue(right.name)}`;
        return leftName.localeCompare(rightName);
      });
      session.repositorySelection = selection;
      renderRepositoryAccess();
      updateTeamAction();
    } catch {
      resetRepositoryAccess("The repository service returned data that did not match the pinned launch contract. No repository access was assumed.", "error");
      updateTeamAction();
    }
  }

  function renderRepositoryAccess() {
    const mode = launchContract.repositorySelectionMode(session.repositorySelection?.mode) || launchContract.REPOSITORY_SELECTION_MODE.SELECTED;
    const selected = new Set(launchContract.selectedRepositoryIds(session.repositorySelection || {}));
    session.repositorySelectionReady = launchContract.repositorySelectionReady(session.repositorySelection, session.repositories);
    ui.repositoryForm.hidden = false;
    ui.repositoryList.replaceChildren();
    ui.repositoryModes.forEach((input) => { input.checked = input.value === (mode === launchContract.REPOSITORY_SELECTION_MODE.ALL ? "all" : "selected"); });

    session.repositories.forEach((repository) => {
      const id = String(repository.githubRepositoryId);
      const label = document.createElement("label");
      label.className = "repository-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "githubRepositoryId";
      checkbox.value = id;
      checkbox.checked = mode === launchContract.REPOSITORY_SELECTION_MODE.ALL || selected.has(id) || repository.selectedForTeams === true;
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const branch = document.createElement("small");
      name.textContent = `${stringValue(repository.owner)}/${stringValue(repository.name)}`;
      branch.textContent = `Default branch: ${stringValue(repository.defaultBranch) || "not reported"}`;
      copy.append(name, branch);
      label.append(checkbox, copy);
      ui.repositoryList.append(label);
    });
    ui.repositoryEmpty.hidden = session.repositories.length > 0;
    updateRepositoryControls();

    if (session.repositorySelectionReady) {
      const count = mode === launchContract.REPOSITORY_SELECTION_MODE.ALL ? session.repositories.length : selected.size;
      ui.contextRepositories.textContent = mode === launchContract.REPOSITORY_SELECTION_MODE.ALL ? `${count} accessible` : `${count} selected`;
      setStep("repositories", "complete", "Selected", `${count} accessible ${count === 1 ? "repository is" : "repositories are"} authorized for team provisioning.`);
    } else if (session.repositories.length === 0) {
      ui.contextRepositories.textContent = "No accessible repositories";
      setStep("repositories", "blocked", "No repositories", "The installation is active, but GitHub returned no accessible repositories. Grant access in GitHub and refresh.");
    } else {
      ui.contextRepositories.textContent = "Selection required";
      setStep("repositories", "action", "Needs action", "Choose the accessible repositories that deep navy may use, then save the server-side selection.");
    }
  }

  function selectedRepositoryMode() {
    return ui.repositoryModes.find((input) => input.checked)?.value === "all"
      ? launchContract.REPOSITORY_SELECTION_MODE.ALL
      : launchContract.REPOSITORY_SELECTION_MODE.SELECTED;
  }

  function selectedRepositoryIdsFromForm() {
    return [...ui.repositoryList.querySelectorAll('input[name="githubRepositoryId"]:checked')].map((input) => input.value);
  }

  function updateRepositoryControls() {
    const allMode = selectedRepositoryMode() === launchContract.REPOSITORY_SELECTION_MODE.ALL;
    const checkboxes = [...ui.repositoryList.querySelectorAll('input[name="githubRepositoryId"]')];
    checkboxes.forEach((checkbox) => { checkbox.disabled = allMode; });
    const valid = session.repositoryServiceAvailable && session.repositories.length > 0 && (allMode || checkboxes.some((checkbox) => checkbox.checked));
    ui.repositorySave.disabled = !valid;
  }

  function renderBillingPlanResult(result) {
    session.billingPlanAvailable = false;
    session.billingPlan = null;
    session.billingPlanError = "";
    ui.planSummary.hidden = true;
    const expectedPlanId = stringValue(config.plan_id) || "founding-team";
    const plan = result.status === "fulfilled" ? result.value.plan : null;
    const state = typeof plan?.state === "number"
      ? plan.state
      : stringValue(plan?.state).replace(/^BILLING_PLAN_STATE_/, "");
    const active = state === 1 || state === "ACTIVE";
    if (result.status !== "fulfilled" || stringValue(plan?.id) !== expectedPlanId || !active) {
      session.billingPlanError = result.status === "rejected"
        ? apiErrorMessage(result.reason, "The launch billing plan is not available.")
        : "The billing service did not return the configured active launch plan.";
      return;
    }
    session.billingPlanAvailable = true;
    session.billingPlan = plan;
    ui.planName.textContent = stringValue(session.billingPlan.name) || stringValue(session.billingPlan.id);
    ui.planPrice.textContent = formatMoney(session.billingPlan.recurringPrice, session.billingPlan.interval);
    ui.planCredits.textContent = formatCredits(session.billingPlan.includedCreditMicros);
    ui.planSlots.textContent = "1 paid team slot per subscription unit";
    ui.planSummary.hidden = false;
  }

  function formatMoney(money, interval) {
    const units = Number(money?.units || 0);
    const nanos = Number(money?.nanos || 0);
    const currency = stringValue(money?.currencyCode) || "USD";
    if (!Number.isSafeInteger(units) || !Number.isInteger(nanos)) return "Price available in checkout";
    const amount = units + nanos / 1_000_000_000;
    const suffix = [2, "BILLING_INTERVAL_YEAR"].includes(interval) ? "/year" : "/month";
    try { return `${new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount)}${suffix}`; } catch { return `${amount.toFixed(2)} ${currency}${suffix}`; }
  }

  function formatCredits(value) {
    const micros = int64Value(value);
    if (micros === null || micros <= 0n) return "Included credits shown at checkout";
    return `${new Intl.NumberFormat().format(micros / 1_000_000n)} engineering credits`;
  }

  function int64Value(value) {
    try {
      const normalized = typeof value === "bigint"
        ? value.toString()
        : typeof value === "number" && Number.isSafeInteger(value)
          ? String(value)
          : stringValue(value);
      if (!/^(?:0|[1-9][0-9]{0,18})$/.test(normalized)) return null;
      const parsed = BigInt(normalized);
      return parsed <= 9_223_372_036_854_775_807n ? parsed : null;
    } catch {
      return null;
    }
  }

  function resetSubscriptionCapacity() {
    session.paidTeamSlots = 0n;
    session.usedTeamSlots = 0n;
    session.availableTeamSlots = 0n;
  }

  // The subscription is no longer an onboarding step: it is the billing record
  // behind the Settings page and the paid-slot capacity backing team creation.
  // This keeps the full billing data model (subscription, active flag, slot
  // balance, default payment method) while rendering it only in Settings.
  function renderSubscriptionResult(result) {
    if (result.status === "fulfilled") {
      const subscription = result.value.subscription;
      if (subscription && stringValue(subscription.organizationId) !== session.organizationId) {
        session.subscription = null;
        session.subscriptionManageable = false;
        session.subscriptionActive = false;
        resetSubscriptionCapacity();
        renderSettingsBilling("The billing service returned a subscription outside the current organization scope. No billing state was displayed.", "error");
        return;
      }
      if (result.value.plan?.id) renderBillingPlanResult({ status: "fulfilled", value: { plan: result.value.plan } });
      const status = subscriptionStatusLabel(subscription);
      session.subscription = subscription || null;
      session.subscriptionManageable = Boolean(subscription?.id);
      resetSubscriptionCapacity();
      const paid = int64Value(subscription?.paidTeamSlots);
      const used = int64Value(subscription?.usedTeamSlots);
      const available = int64Value(subscription?.availableTeamSlots);
      const validCapacity = paid !== null && used !== null && available !== null && paid > 0n && used + available === paid;
      session.subscriptionActive = status === "active" && validCapacity;
      if (validCapacity) {
        session.paidTeamSlots = paid;
        session.usedTeamSlots = used;
        session.availableTeamSlots = available;
        ui.planSlots.textContent = `${paid.toString()} paid · ${used.toString()} in use · ${available.toString()} available`;
      }
      renderSettingsBilling(status === "active" && !validCapacity
        ? "The billing service did not return a consistent paid team-slot balance. Manage billing in the Stripe portal."
        : "", status === "active" && !validCapacity ? "error" : "");
      return;
    }
    session.subscription = null;
    session.subscriptionManageable = false;
    session.subscriptionActive = false;
    resetSubscriptionCapacity();
    renderSettingsBilling(isMissingResource(result.reason)
      ? ""
      : apiErrorMessage(result.reason, "The billing service is not ready. No subscription state was assumed."),
      isMissingResource(result.reason) ? "" : "error");
  }

  function buildOrganizationMembers(state) {
    const organizationId = stringValue(state?.organization?.id);
    const membership = Array.isArray(state?.memberships)
      ? state.memberships.find((entry) => stringValue(entry?.id) === organizationId)
      : null;
    const user = session.user || {};
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(user.githubLogin) || stringValue(session.claims.githubLogin) || "Signed-in user";
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(session.claims.githubLogin) || stringValue(user.email) || stringValue(session.claims.email);
    return [{ name, login, role: membershipRoleLabel(membership?.role), self: true }];
  }

  function membershipRoleLabel(value) {
    const cleaned = stringValue(value).replace(/^MEMBERSHIP_ROLE_/, "").replaceAll("_", " ").toLowerCase();
    return cleaned || "member";
  }

  function renderSettingsAccount() {
    if (!ui.settingsAccountName) return;
    const user = session.user || {};
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(session.claims.email) || (session.accessToken ? "Signed-in user" : "—");
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email) || "—";
    ui.settingsAccountName.textContent = name;
    ui.settingsAccountLogin.textContent = login;
    ui.settingsAccountOrg.textContent = stringValue(session.organizationName) || "Not selected";
    renderSettingsMembers();
  }

  function renderSettingsMembers() {
    if (!ui.settingsMembers) return;
    ui.settingsMembers.replaceChildren();
    const members = Array.isArray(session.members) ? session.members : [];
    ui.settingsMembersCount.textContent = members.length ? `${members.length} ${members.length === 1 ? "member" : "members"}` : "—";
    if (ui.settingsMembersEmpty) ui.settingsMembersEmpty.hidden = members.length > 0;
    members.forEach((member) => {
      const item = document.createElement("li");
      const avatar = document.createElement("span");
      avatar.className = "user-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = (stringValue(member.name).charAt(0) || "?").toUpperCase();
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = stringValue(member.name) + (member.self ? " (you)" : "");
      const login = document.createElement("small");
      login.textContent = stringValue(member.login) || "—";
      copy.append(name, login);
      const role = document.createElement("span");
      role.className = "settings-member-role";
      role.textContent = stringValue(member.role) || "member";
      item.append(avatar, copy, role);
      ui.settingsMembers.append(item);
    });
  }

  function teamUnitAmountCents() {
    const money = session.billingPlan?.recurringPrice;
    const units = signedInt64Value(money?.units);
    const nanos = Number(money?.nanos || 0);
    if (units !== null && units >= 0n && Number.isInteger(nanos) && Math.abs(nanos) <= 999_999_999) {
      const cents = units * 100n + BigInt(Math.round(nanos / 10_000_000));
      if (cents > 0n) return cents;
    }
    return 59900n; // $599.00/month founding-team default
  }

  function formatCents(cents) {
    const value = typeof cents === "bigint" ? cents : 0n;
    const currency = stringValue(session.billingPlan?.recurringPrice?.currencyCode) || "USD";
    const dollars = Number(value) / 100;
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(dollars); }
    catch { return `$${dollars.toFixed(2)}`; }
  }

  // Engineering-agent count: a floor of three (the adversarial-review floor) up to
  // fifty. The team base price includes the three floor engineers; each engineer
  // above the floor is a $199/month add-on, matched against the server.
  const ENGINEER_FLOOR = launchContract?.ENGINEER_FLOOR ?? 3;
  const ENGINEER_MAX = launchContract?.ENGINEER_MAX ?? 50;

  function normalizeEngineerCount(value) {
    if (launchContract) return launchContract.normalizeEngineerCount(value);
    const parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) return ENGINEER_FLOOR;
    return Math.min(ENGINEER_MAX, Math.max(ENGINEER_FLOOR, parsed));
  }

  function teamPricingFor(engineerCount) {
    if (launchContract) return launchContract.teamPricing({ engineerCount, baseCents: teamUnitAmountCents() });
    const count = normalizeEngineerCount(engineerCount);
    const additional = Math.max(0, count - ENGINEER_FLOOR);
    const base = teamUnitAmountCents();
    const addon = 19900n;
    return { engineerCount: count, includedEngineers: ENGINEER_FLOOR, additionalEngineers: additional, baseCents: base, addonCents: addon, addonTotalCents: addon * BigInt(additional), totalCents: base + addon * BigInt(additional) };
  }

  // "$599 team (includes 3 engineers)" or, with add-ons,
  // "$599 team + 2 × $199 engineers = $997/mo".
  function pricingBreakdown(pricing) {
    const base = `${formatCents(pricing.baseCents)} team`;
    if (pricing.additionalEngineers <= 0) return `${base} (includes ${pricing.includedEngineers} engineers)`;
    const engineers = `${pricing.additionalEngineers} × ${formatCents(pricing.addonCents)} engineers`;
    return `${base} + ${engineers} = ${formatCents(pricing.totalCents)}/mo`;
  }

  function renderTeamRoster(listEl, engineerCount) {
    if (!listEl) return;
    const roster = launchContract
      ? launchContract.teamRoster(engineerCount)
      : [
          { code: "PM", label: "Product Manager", scope: "GitHub issues", count: 1 },
          { code: "EM", label: "Engineering Manager", scope: "Triage & routing", count: 1 },
          { code: "PD", label: "Designer", scope: "Figma", count: 1 },
          { code: "ENG", label: normalizeEngineerCount(engineerCount) === 1 ? "Engineer" : "Engineers", scope: "Code + MCP docs", count: normalizeEngineerCount(engineerCount) }
        ];
    listEl.replaceChildren();
    roster.forEach((entry) => {
      const item = document.createElement("li");
      const role = document.createElement("span");
      role.className = "roster-role";
      const count = document.createElement("span");
      count.className = "roster-count";
      count.textContent = `${entry.count}×`;
      const label = document.createElement("span");
      label.className = "roster-label";
      label.textContent = entry.label;
      role.append(count, label);
      const scope = document.createElement("span");
      scope.className = "roster-scope";
      scope.textContent = entry.scope;
      item.append(role, scope);
      listEl.append(item);
    });
  }

  // Live price for the team-setup screen: reflects the stepper as it changes.
  function renderTeamSetupPricing() {
    if (!ui.engineerInput) return;
    const pricing = teamPricingFor(ui.engineerInput.value);
    if (ui.teamPriceAmount) {
      ui.teamPriceAmount.replaceChildren();
      ui.teamPriceAmount.append(document.createTextNode(formatCents(pricing.totalCents)));
      const per = document.createElement("small");
      per.textContent = " / month";
      ui.teamPriceAmount.append(per);
    }
    if (ui.teamPriceBreakdown) ui.teamPriceBreakdown.textContent = pricingBreakdown(pricing);
    renderTeamRoster(ui.teamRoster, pricing.engineerCount);
    if (ui.engineerDecrement) ui.engineerDecrement.disabled = pricing.engineerCount <= ENGINEER_FLOOR;
    if (ui.engineerIncrement) ui.engineerIncrement.disabled = pricing.engineerCount >= ENGINEER_MAX;
  }

  // Nudge a stepper input by ±1 within the engineer bounds, then re-render.
  function stepEngineerInput(input, delta, afterChange) {
    if (!input) return;
    input.value = String(normalizeEngineerCount(Number(input.value || ENGINEER_FLOOR) + delta));
    if (typeof afterChange === "function") afterChange();
  }

  function paymentMethodSummary(pm) {
    const brand = stringValue(pm?.brand);
    const last4 = stringValue(pm?.last4);
    if (!brand && !last4) return "";
    const brandLabel = brand ? `${brand.charAt(0).toUpperCase()}${brand.slice(1)}` : "Card";
    const digits = /^[0-9]{4}$/.test(last4) ? last4 : "";
    const month = Number(pm?.expMonth);
    const year = Number(pm?.expYear);
    const exp = Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year) && year >= 2000 && year <= 2100
      ? ` · exp ${String(month).padStart(2, "0")}/${String(year).slice(-2)}`
      : "";
    return digits ? `${brandLabel} •••• ${digits}${exp}` : brandLabel;
  }

  function renderSettingsBilling(errorMessage = "", tone = "") {
    if (!ui.settingsBillingState) return;
    // A pending team is not yet paid or provisioned, so it is not billed.
    const activeTeams = session.teams.filter((team) => !["pending", "deleting", "deleted"].includes(lifecycleLabel(team?.state))).length;
    // Prefer the signed subscription's used-slot count (the billed quantity) when
    // it is present and consistent; otherwise fall back to the visible team count.
    const billedTeams = session.subscriptionManageable && session.paidTeamSlots > 0n
      ? Number(session.usedTeamSlots)
      : activeTeams;
    const count = Number.isSafeInteger(billedTeams) && billedTeams >= 0 ? billedTeams : 0;
    ui.settingsTeamCount.textContent = String(count);
    const unitCents = teamUnitAmountCents();
    ui.settingsBillingUnit.textContent = `${formatCents(unitCents)}/month`;
    ui.settingsBillingAmount.textContent = `${formatCents(unitCents * BigInt(count))}/month`;

    const pm = paymentMethodSummary(session.subscription?.defaultPaymentMethod);
    ui.settingsPaymentMethod.textContent = pm || "No card on file";

    if (errorMessage) {
      setSourceState(ui.settingsBillingState, "Unavailable", tone || "error");
      ui.settingsBillingNote.textContent = errorMessage;
    } else if (!session.organizationId) {
      setSourceState(ui.settingsBillingState, "Waiting", "");
      ui.settingsBillingNote.textContent = "Select an organization to load its billing.";
    } else if (session.subscriptionManageable) {
      const status = subscriptionStatusLabel(session.subscription) || "active";
      setSourceState(ui.settingsBillingState, session.subscriptionActive ? "Active" : capitalize(status), session.subscriptionActive ? "success" : "");
      ui.settingsBillingNote.textContent = pm
        ? "Your card is on file and reused for every team. Manage billing opens the Stripe Customer Portal to update the card, view invoices, or cancel."
        : "Manage billing opens the Stripe Customer Portal to view invoices and update payment.";
    } else {
      setSourceState(ui.settingsBillingState, "No card yet", "");
      ui.settingsBillingNote.textContent = "Billing starts when you create your first team. A card is collected once in secure Stripe checkout, then reused for every additional team.";
    }
    ui.settingsBillingManage.disabled = !session.subscriptionManageable || checkoutOpening;
    renderEngineerControl();
  }

  // Settings → Engineering capacity: change how many engineering agents the
  // selected, active team runs. SetTeamEngineerCount charges the prorated
  // remainder off-session (or asks for 3-D Secure); a hard decline surfaces the
  // FAILED_PRECONDITION as an inline error, exactly like the RequestTeam path.
  function renderEngineerControl() {
    if (!ui.engineerSettings) return;
    const team = selectedTeam();
    if (!team) {
      engineerControlTeamId = "";
      setSourceState(ui.engineerSettingsState, "Waiting", "");
      ui.engineerSettingsTeam.hidden = false;
      ui.engineerSettingsTeam.textContent = "Select a team to change how many engineers it runs.";
      ui.engineerSettingsField.hidden = true;
      ui.settingsEngineerPrice.hidden = true;
      ui.settingsEngineerNote.hidden = true;
      setFieldError(ui.settingsEngineerError, "");
      ui.settingsEngineerApply.disabled = true;
      return;
    }
    const teamId = stringValue(team.id);
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    // Reset the stepper to the team's confirmed count when the team changes.
    if (engineerControlTeamId !== teamId) {
      engineerControlTeamId = teamId;
      ui.settingsEngineerInput.value = String(current);
      setFieldError(ui.settingsEngineerError, "");
    }
    const active = lifecycleLabel(team.state) === "active";
    ui.engineerSettingsField.hidden = false;
    ui.settingsEngineerNote.hidden = false;
    ui.engineerSettingsTeam.hidden = false;
    ui.engineerSettingsTeam.textContent = active
      ? `${stringValue(team.name) || "This team"} runs ${current} engineer${current === 1 ? "" : "s"} today.`
      : `${stringValue(team.name) || "This team"} must be active before its engineering capacity can change.`;
    setSourceState(ui.engineerSettingsState, active ? "Active" : capitalize(lifecycleLabel(team.state) || "pending"), active ? "success" : "");
    syncEngineerControl();
  }

  function renderEngineerControlPricing(currentCount) {
    if (!ui.settingsEngineerPrice) return;
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    const pricing = teamPricingFor(target);
    ui.settingsEngineerPrice.hidden = false;
    if (target === currentCount) {
      ui.settingsEngineerPrice.textContent = pricingBreakdown(pricing);
      return;
    }
    const currentPricing = teamPricingFor(currentCount);
    const increase = target > currentCount;
    const delta = formatCents(increase ? pricing.totalCents - currentPricing.totalCents : currentPricing.totalCents - pricing.totalCents);
    ui.settingsEngineerPrice.textContent = `New: ${pricingBreakdown(pricing)} · ${increase ? "increase" : "decrease"} of ${delta}/mo`;
  }

  // Recompute price + button states from the current input without resetting it.
  function syncEngineerControl() {
    const team = selectedTeam();
    if (!team || !ui.engineerSettingsField || ui.engineerSettingsField.hidden) return;
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    const manageable = lifecycleLabel(team.state) === "active" && session.subscriptionManageable && !checkoutOpening && !engineerControlBusy;
    renderEngineerControlPricing(current);
    ui.settingsEngineerInput.disabled = !manageable;
    ui.settingsEngineerDecrement.disabled = !manageable || target <= ENGINEER_FLOOR;
    ui.settingsEngineerIncrement.disabled = !manageable || target >= ENGINEER_MAX;
    ui.settingsEngineerApply.disabled = !manageable || target === current;
  }

  async function applyEngineerCount() {
    const team = selectedTeam();
    if (!team) return;
    const teamId = stringValue(team.id);
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    setFieldError(ui.settingsEngineerError, "");
    if (target === current) return;
    engineerControlBusy = true;
    ui.settingsEngineerApply.disabled = true;
    ui.settingsEngineerApply.textContent = "Updating…";
    try {
      const result = await apiRequest("set_team_engineer_count", {
        teamId,
        engineerCount: target,
        idempotencyKey: mutationKeys.for("setEngineerCount", `${teamId}:${target}`)
      });
      const updated = result.team;
      if (!updated || stringValue(updated.id) !== teamId || stringValue(updated.organizationId) !== session.organizationId) {
        throw new ApiError("Team service returned a team outside the selected organization scope", 0, "invalid_response", "");
      }
      const settlement = requestTeamSettlement(result.settlement);
      const record = session.teams.find((candidate) => stringValue(candidate.id) === teamId);
      if (record) Object.assign(record, updated);
      const confirmed = normalizeEngineerCount(updated.engineerCount ?? target);
      ui.settingsEngineerInput.value = String(confirmed);
      if (settlement === REQUEST_TEAM_SETTLEMENT.AUTHENTICATION_REQUIRED) {
        const destination = validatedRedirect(result.authenticationUrl || result.authentication_url, ["invoice.stripe.com"]);
        if (!destination) throw new ApiError("Billing service returned an untrusted authentication URL", 0, "invalid_redirect", "");
        const opened = window.open(destination, "_blank", "noopener,noreferrer");
        toast(opened
          ? "Authenticate the payment in the new Stripe tab to apply the new engineer count."
          : "Allow pop-ups, then retry to authenticate the payment for this change.", "info");
      } else {
        mutationKeys.clear("setEngineerCount");
        const changed = Math.abs(confirmed - current);
        toast(confirmed > current
          ? `Added ${changed} engineer${changed === 1 ? "" : "s"}. The prorated remainder was charged to the card on file.`
          : `Reduced to ${confirmed} engineer${confirmed === 1 ? "" : "s"}. The unused portion is credited to your next invoice.`, "success");
      }
      renderTeamList();
      renderSelectedTeamSummary();
      renderSettingsBilling();
    } catch (error) {
      const message = apiErrorMessage(error, "The engineering capacity was not changed. It is safe to retry; the request uses an idempotency key.");
      setFieldError(ui.settingsEngineerError, message);
      toast(message, "error");
    } finally {
      engineerControlBusy = false;
      ui.settingsEngineerApply.textContent = "Update engineering capacity";
      renderEngineerControl();
    }
  }

  function subscriptionStatusLabel(subscription) {
    if (typeof subscription?.subscriptionStatus === "number") {
      return ["", "incomplete", "incomplete expired", "trialing", "active", "past due", "canceled", "unpaid", "paused"][subscription.subscriptionStatus] || "";
    }
    return stringValue(subscription?.subscriptionStatus).replace(/^SUBSCRIPTION_STATUS_/, "").replaceAll("_", " ").toLowerCase();
  }

  function reconcileBillingReturn() {
    const returned = storageRead(billingReturnStorageKey);
    if (!returned || typeof returned.createdAt !== "number" || Date.now() - returned.createdAt > 30 * 60 * 1000) {
      storageRemove(billingReturnStorageKey);
      return;
    }
    if ((reconcileBillingReturn.attempts || 0) < 3) {
      reconcileBillingReturn.attempts = (reconcileBillingReturn.attempts || 0) + 1;
      window.setTimeout(() => { if (session.accessToken) refreshOnboarding(); }, 3000 * reconcileBillingReturn.attempts);
      toast("Stripe returned. Refreshing team billing and credits while the signed webhook is verified.", "info");
    } else {
      storageRemove(billingReturnStorageKey);
      reconcileBillingReturn.attempts = 0;
      toast("Billing records were refreshed. Only webhook-confirmed subscriptions and credits are shown.", "info");
    }
  }

  function resetInvoiceHistory(message, label = "Waiting", tone = "") {
    session.invoices = [];
    session.invoiceIds = new Set();
    session.invoiceNextPageToken = "";
    session.invoicePageTokens = new Set();
    session.invoiceLoading = false;
    ui.invoiceHistory.hidden = !session.organizationId;
    ui.invoiceList.replaceChildren();
    ui.invoiceList.hidden = true;
    ui.invoiceEmpty.hidden = false;
    ui.invoiceMore.hidden = true;
    ui.invoiceMore.disabled = true;
    ui.invoiceMore.textContent = "Load more invoices";
    setEmptyState(ui.invoiceEmpty, label === "Loading" ? "Loading invoices" : "No invoices loaded", message);
    setSourceState(ui.invoiceState, label, tone);
  }

  function signedInt64Value(value) {
    try {
      const normalized = typeof value === "bigint"
        ? value.toString()
        : typeof value === "number" && Number.isSafeInteger(value)
          ? String(value)
          : stringValue(value);
      if (!/^-?(?:0|[1-9][0-9]{0,18})$/.test(normalized)) return null;
      const parsed = BigInt(normalized);
      return parsed >= -9_223_372_036_854_775_808n && parsed <= 9_223_372_036_854_775_807n ? parsed : null;
    } catch {
      return null;
    }
  }

  function canonicalMoneyValue(money) {
    const units = signedInt64Value(money?.units);
    const nanos = Number(money?.nanos || 0);
    const currency = stringValue(money?.currencyCode);
    if (units === null || !Number.isInteger(nanos) || Math.abs(nanos) > 999_999_999 || !/^[A-Z]{3}$/.test(currency)) return null;
    if ((units > 0n && nanos < 0) || (units < 0n && nanos > 0)) return null;
    return { currency, nanos: units * 1_000_000_000n + BigInt(nanos) };
  }

  function invoiceStatusLabel(value) {
    const numeric = typeof value === "number" ? value : -1;
    const normalized = numeric >= 0
      ? ["", "DRAFT", "OPEN", "PAID", "VOID", "UNCOLLECTIBLE"][numeric] || ""
      : stringValue(value).replace(/^INVOICE_STATUS_/, "");
    return ({ DRAFT: "draft", OPEN: "open", PAID: "paid", VOID: "void", UNCOLLECTIBLE: "uncollectible" })[normalized] || "";
  }

  function validatedHostedInvoiceURL(value) {
    if (typeof value !== "string" || !value || value.trim() !== value) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.host !== "invoice.stripe.com" || url.username || url.password || url.hash || !url.pathname.startsWith("/")) return "";
      return value;
    } catch {
      return "";
    }
  }

  function validInvoice(invoice) {
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!invoice || !uuid.test(stringValue(invoice.id)) || !uuid.test(stringValue(invoice.subscriptionId)) ||
      stringValue(invoice.organizationId) !== session.organizationId || !invoiceStatusLabel(invoice.status)) return false;
    const amounts = [invoice.subtotal, invoice.total, invoice.amountDue, invoice.amountPaid].map(canonicalMoneyValue);
    if (amounts.some((amount) => !amount) || new Set(amounts.map((amount) => amount.currency)).size !== 1 ||
      amounts[2].nanos < 0n || amounts[3].nanos < 0n) return false;
    const periodStart = timestampDate(invoice.periodStartsAt);
    const periodEnd = timestampDate(invoice.periodEndsAt);
    const createdAt = timestampDate(invoice.createdAt);
    const updatedAt = timestampDate(invoice.updatedAt);
    const dueAt = invoice.dueAt ? timestampDate(invoice.dueAt) : null;
    const paidAt = invoice.paidAt ? timestampDate(invoice.paidAt) : null;
    if (!periodStart || !periodEnd || periodEnd <= periodStart || !createdAt || !updatedAt || updatedAt < createdAt ||
      (invoice.dueAt && (!dueAt || dueAt < createdAt)) || (invoice.paidAt && (!paidAt || paidAt < createdAt)) ||
      (invoiceStatusLabel(invoice.status) === "paid" && !paidAt)) return false;
    const hostedURL = stringValue(invoice.hostedInvoiceUrl);
    return !hostedURL || Boolean(validatedHostedInvoiceURL(invoice.hostedInvoiceUrl));
  }

  function invoiceDateLabel(invoice) {
    const created = timestampDate(invoice.createdAt);
    return created ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(created) : "Date unavailable";
  }

  function renderInvoiceHistory() {
    ui.invoiceHistory.hidden = !session.organizationId;
    ui.invoiceList.replaceChildren();
    session.invoices.forEach((invoice) => {
      const status = invoiceStatusLabel(invoice.status);
      const item = document.createElement("li");
      item.className = "invoice-record";
      const head = document.createElement("div");
      head.className = "invoice-record-head";
      const state = document.createElement("span");
      state.className = "invoice-record-status";
      state.dataset.status = status;
      state.textContent = status;
      const date = document.createElement("time");
      date.textContent = invoiceDateLabel(invoice);
      const total = document.createElement("div");
      total.className = "invoice-record-total";
      const amount = document.createElement("strong");
      const amountSource = status === "paid" ? invoice.amountPaid : status === "open" || status === "uncollectible" ? invoice.amountDue : invoice.total;
      amount.textContent = formatCanonicalMoney(amountSource);
      const amountLabel = document.createElement("span");
      amountLabel.textContent = status === "paid" ? "paid" : status === "open" ? "due" : status === "uncollectible" ? "uncollected" : "invoice total";
      const period = document.createElement("span");
      period.className = "invoice-record-period";
      const starts = timestampDate(invoice.periodStartsAt);
      const ends = timestampDate(invoice.periodEndsAt);
      period.textContent = `Service period · ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(starts)} – ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(ends)}`;
      const actions = document.createElement("div");
      actions.className = "invoice-record-actions";
      const source = document.createElement("span");
      source.textContent = "Verified billing projection";
      actions.append(source);
      const hostedURL = validatedHostedInvoiceURL(invoice.hostedInvoiceUrl);
      if (hostedURL) {
        const receipt = document.createElement("a");
        receipt.className = "invoice-receipt";
        receipt.href = hostedURL;
        receipt.target = "_blank";
        receipt.rel = "noopener noreferrer";
        receipt.referrerPolicy = "no-referrer";
        receipt.textContent = status === "paid" ? "View receipt ↗" : "View invoice ↗";
        actions.append(receipt);
      }
      head.append(state, date);
      total.append(amount, amountLabel);
      item.append(head, total, period, actions);
      ui.invoiceList.append(item);
    });
    const count = session.invoices.length;
    ui.invoiceEmpty.hidden = count > 0;
    ui.invoiceList.hidden = count === 0;
    if (!count) setEmptyState(ui.invoiceEmpty, "No invoices yet", "No signed-webhook-backed invoice records exist for this organization yet.");
    ui.invoiceMore.hidden = !session.invoiceNextPageToken;
    ui.invoiceMore.disabled = session.invoiceLoading || !session.invoiceNextPageToken;
    setSourceState(ui.invoiceState, count ? `${count} verified` : "No records", count ? "success" : "");
  }

  function acceptInvoicePage(response, pageToken = "", append = false) {
    const invoices = Array.isArray(response?.invoices) ? response.invoices : [];
    if (invoices.length > 25 || invoices.some((invoice) => !validInvoice(invoice))) {
      throw new ApiError("BillingService returned an invalid invoice page", 0, "invalid_response", "");
    }
    const existingIDs = append ? new Set(session.invoiceIds) : new Set();
    for (const invoice of invoices) {
      const id = stringValue(invoice.id);
      if (existingIDs.has(id)) throw new ApiError("BillingService returned a duplicate invoice", 0, "invalid_response", "");
      existingIDs.add(id);
    }
    const next = stringValue(response?.page?.nextPageToken);
    const seenTokens = append ? new Set(session.invoicePageTokens) : new Set();
    if (next && (next === pageToken || seenTokens.has(next) || next.length > 4096)) {
      throw new ApiError("BillingService returned a repeated invoice page cursor", 0, "invalid_response", "");
    }
    if (pageToken) seenTokens.add(pageToken);
    if (next) seenTokens.add(next);
    session.invoices = append ? [...session.invoices, ...invoices] : invoices;
    session.invoiceIds = existingIDs;
    session.invoicePageTokens = seenTokens;
    session.invoiceNextPageToken = next;
    renderInvoiceHistory();
  }

  function renderInvoicesResult(result) {
    if (result.status === "rejected") {
      resetInvoiceHistory(apiErrorMessage(result.reason, "The verified invoice projection is unavailable. No billing history was assumed."), "Unavailable", "error");
      ui.invoiceHistory.hidden = false;
      return;
    }
    try {
      acceptInvoicePage(result.value);
    } catch (error) {
      resetInvoiceHistory(apiErrorMessage(error, "The billing service returned invalid invoice history. No records were displayed."), "Invalid response", "error");
      ui.invoiceHistory.hidden = false;
    }
  }

  async function loadMoreInvoices() {
    const organizationId = session.organizationId;
    const pageToken = session.invoiceNextPageToken;
    if (!organizationId || !pageToken || session.invoiceLoading) return;
    session.invoiceLoading = true;
    ui.invoiceMore.disabled = true;
    ui.invoiceMore.textContent = "Loading…";
    try {
      const response = await apiRequest("invoices", { organizationId, page: { pageSize: 25, pageToken } });
      if (organizationId !== session.organizationId) return;
      acceptInvoicePage(response, pageToken, true);
    } catch (error) {
      if (organizationId !== session.organizationId) return;
      session.invoiceNextPageToken = "";
      ui.invoiceMore.hidden = true;
      setSourceState(ui.invoiceState, "Unavailable", "error");
      toast(apiErrorMessage(error, "More verified invoices could not be loaded."), "error");
    } finally {
      session.invoiceLoading = false;
      ui.invoiceMore.textContent = "Load more invoices";
      if (organizationId === session.organizationId) ui.invoiceMore.disabled = !session.invoiceNextPageToken;
    }
  }

  function activeCreditPack(pack) {
    const state = typeof pack?.state === "number" ? pack.state : stringValue(pack?.state).replace(/^BILLING_PLAN_STATE_/, "");
    const id = stringValue(pack?.id);
    const credits = int64Value(pack?.creditMicros);
    const maximum = int64Value(pack?.maximumQuantity);
    return Boolean(id && !id.startsWith("price_") && (state === 1 || state === "ACTIVE") && credits !== null && credits > 0n && maximum !== null && maximum > 0n && maximum <= 1000n && pack?.price);
  }

  async function refreshCreditPacks() {
    session.creditPacks = [];
    if (!session.subscriptionActive || !session.organizationId) {
      renderCreditPackControls();
      return;
    }
    try {
      const response = await apiRequest("credit_packs", { organizationId: session.organizationId });
      const packs = Array.isArray(response.creditPacks) ? response.creditPacks : [];
      if (!packs.length || packs.some((pack) => !activeCreditPack(pack))) {
        throw new ApiError("The billing service returned an invalid prepaid catalog", 0, "invalid_response", "");
      }
      session.creditPacks = packs;
      renderCreditPackControls();
    } catch (error) {
      renderCreditPackControls(apiErrorMessage(error, "Prepaid credit packs are unavailable."));
    }
  }

  function selectedCreditPack() {
    const id = stringValue(ui.creditPackSelect.value);
    return session.creditPacks.find((pack) => stringValue(pack.id) === id) || null;
  }

  function renderCreditPackControls(errorMessage = "") {
    const team = selectedTeam();
    const visible = Boolean(session.subscriptionActive && team);
    ui.creditPackForm.hidden = !visible;
    if (!visible) return;
    const previous = stringValue(ui.creditPackSelect.value);
    ui.creditPackSelect.replaceChildren();
    session.creditPacks.forEach((pack) => {
      const option = document.createElement("option");
      option.value = stringValue(pack.id);
      option.textContent = `${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)}`;
      ui.creditPackSelect.append(option);
    });
    if (session.creditPacks.some((pack) => stringValue(pack.id) === previous)) ui.creditPackSelect.value = previous;
    const controlReady = stringValue(session.creditControl?.teamId) === stringValue(team.id);
    const ready = Boolean(session.creditPacks.length && stripeConfigured() && controlReady && !checkoutOpening);
    ui.creditPackSelect.disabled = !ready;
    ui.creditPackQuantity.disabled = !ready;
    ui.creditPackSubmit.disabled = !ready;
    setFieldError(ui.creditPackError, errorMessage || (!stripeConfigured()
      ? "Secure checkout is not configured in this deployment."
      : !controlReady
        ? "The team credit control is unavailable; purchases remain fail-closed."
        : session.creditPacks.length ? "" : "No prepaid packs are available."));
    updateCreditPackSummary();
  }

  function updateCreditPackSummary() {
    const pack = selectedCreditPack();
    if (!pack) {
      ui.creditPackSummary.textContent = "Select a prepaid pack.";
      ui.creditPackQuantity.removeAttribute("max");
      return;
    }
    const maximum = int64Value(pack.maximumQuantity) || 1n;
    ui.creditPackQuantity.max = maximum.toString();
    const quantity = int64Value(ui.creditPackQuantity.value) || 0n;
    const valid = quantity > 0n && quantity <= maximum;
    const totalCredits = valid ? (int64Value(pack.creditMicros) || 0n) * quantity : 0n;
    ui.creditPackSummary.textContent = valid
      ? `${formatCanonicalMoney(pack.price)} each · ${formatCredits(totalCredits)} added to ${stringValue(selectedTeam()?.name) || "this team"}`
      : `Enter a quantity from 1 to ${maximum.toString()}.`;
    ui.creditPackSubmit.disabled = !valid || !stripeConfigured() || checkoutOpening;
  }

  function renderTeamsResult(result) {
    if (result.status === "fulfilled") {
      const teams = Array.isArray(result.value.teams) ? result.value.teams : [];
      const invalid = teams.some((team) => !stringValue(team?.id) || stringValue(team.organizationId) !== session.organizationId);
      if (invalid) {
        session.teamServiceAvailable = false;
        session.teams = [];
        renderTeamList();
        renderTeamSelector();
        setStep("team", "error", "Invalid response", "The team service returned a resource outside the current organization scope. No team data was displayed.");
        return;
      }
      session.teamServiceAvailable = true;
      session.teams = teams;
      renderTeamList();
      renderTeamSelector();
      renderSettingsBilling();
      session.teams.forEach((team) => {
        // A team still in LIFECYCLE_STATE_PENDING is awaiting the payment
        // webhook, so it is followed with GetTeam rather than provisioning status.
        if (lifecycleLabel(team.state) === "pending") startPendingTeamPoll(team.id, 1500);
        else startProvisioningPolling(team);
      });
      return;
    }
    session.teamServiceAvailable = false;
    session.teams = [];
    renderTeamList();
    renderTeamSelector();
    renderSettingsBilling();
    setStep("team", "error", "Unavailable", apiErrorMessage(result.reason, "The team service is not ready. No team state was assumed."));
  }

  // Creating a team is the paid action now, so the only prerequisites are an
  // active GitHub installation and a durable repository selection. There is no
  // subscription/slot gate: RequestTeam drives the payment (embedded Checkout
  // for the first team, the saved card off-session for the rest).
  function updateTeamAction() {
    if (!session.teamServiceAvailable) {
      ui.teamInput.disabled = true;
      ui.teamSubmit.disabled = true;
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositorySelectionReady: session.repositorySelectionReady
    });
    const ready = missing.length === 0 && !checkoutOpening;
    if (missing.length === 0) {
      const existing = session.teams.length ? `${session.teams.length} engineering ${session.teams.length === 1 ? "team is" : "teams are"} active. ` : "";
      const firstTeam = !session.subscriptionManageable;
      setStep("team", "action", "Ready", `${existing}Creating a team is $599/month${firstTeam ? " and collects your card in secure Stripe checkout" : ", charged to the card on file"}. Choose a durable team name.`);
    } else {
      const requirements = missing.join(missing.length > 2 ? ", " : " and ").replace(/, ([^,]+)$/, ", and $1");
      setStep("team", "blocked", "Blocked", `Complete the ${requirements} before creating a team. The API enforces these prerequisites.`);
    }
    ui.teamInput.disabled = !ready;
    ui.teamSubmit.disabled = !ready;
  }

  function setAllStepsUnavailable(message, stateValue = "error") {
    const label = stateValue === "blocked" ? "Waiting" : "Unavailable";
    ["github", "repositories", "team"].forEach((name) => setStep(name, stateValue, label, message));
    ui.githubAction.disabled = true;
    ui.repositorySave.disabled = true;
    ui.repositoryRefresh.disabled = true;
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.refresh.disabled = true;
  }

  function setStep(name, stateValue, label, message) {
    const card = document.querySelector(`[data-step="${name}"]`);
    if (!card) return;
    card.dataset.state = stateValue;
    card.setAttribute("aria-busy", stateValue === "loading" ? "true" : "false");
    card.querySelector("[data-step-state]").textContent = label;
    card.querySelector("[data-step-message]").textContent = message;
    updateProgressStep(name, stateValue, label);
  }

  function updateProgressStep(name, stateValue, label) {
    const step = ui.progressSteps.find((candidate) => candidate.dataset.progressStep === name);
    if (!step) return;
    step.dataset.state = stateValue;
    const detail = step.querySelector("small");
    if (detail) detail.textContent = label;
    renderProgressSummary();
  }

  function renderProgressSummary() {
    if (!ui.progressSummary) return;
    const states = Object.fromEntries(ui.progressSteps.map((step) => [step.dataset.progressStep, step.dataset.state]));
    // The GitHub organization, App installation, and repositories connect
    // automatically from sign-in, so onboarding is really two actions — sign in
    // and create a team. Reflect that instead of a multi-step progress count.
    ui.progressSummary.textContent = states.team === "complete"
      ? "Your team workspace is ready."
      : "Your GitHub organization and repositories connect automatically.";
  }

  function renderTeamList() {
    ui.teamList.replaceChildren();
    ui.teamsEmpty.hidden = session.teams.length > 0;
    ui.teamList.hidden = session.teams.length === 0;
    session.teams.forEach((team) => {
      const row = document.createElement("div");
      row.className = "status-row";
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const detail = document.createElement("p");
      const side = document.createElement("div");
      side.className = "status-row-side";
      const status = document.createElement("span");
      name.textContent = stringValue(team.name) || "Unnamed team";
      const provisioning = launchContract.provisioningPresentation(team.provisioning || {});
      const namespace = stringValue(team.namespace) ? `Namespace ${team.namespace}` : "Runtime namespace pending";
      const provisioningDetail = provisioning.state
        ? `${capitalize(provisioning.label)} · ${provisioning.step}${provisioning.safeError ? ` · ${provisioning.safeError}` : ""}`
        : stringValue(team._pollingMessage);
      detail.textContent = provisioningDetail || namespace;
      status.className = "status-label";
      if (provisioning.failed) status.classList.add("failed");
      else if (!provisioning.terminal && provisioning.state) status.classList.add("planned");
      status.textContent = provisioning.label || lifecycleLabel(team.state) || "created";
      copy.append(name, detail);
      side.append(status);
      const actions = renderTeamLifecycleActions(team);
      if (actions) side.append(actions);
      row.append(copy, side);
      ui.teamList.append(row);
    });
  }

  function teamLifecycleControls(team) {
    const state = lifecycleLabel(team?.state);
    // A team already being torn down or fully removed exposes no controls.
    if (["deleting", "deleted"].includes(state)) return [];
    const controls = [];
    if (state === "active") controls.push("suspend");
    if (state === "suspended") controls.push("resume");
    // Delete stays available for any team that is not already deleting/deleted,
    // including pending and failed provisioning, so a stuck team can be removed.
    controls.push("delete");
    return controls;
  }

  function lifecycleButton(action, teamId, label, variant, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button ${variant} button-small`;
    button.dataset.teamAction = action;
    button.dataset.teamId = teamId;
    button.textContent = label;
    button.disabled = Boolean(disabled);
    return button;
  }

  function renderTeamLifecycleActions(team) {
    const teamId = stringValue(team?.id);
    if (!teamId || !session.teamServiceAvailable) return null;
    const controls = teamLifecycleControls(team);
    if (!controls.length) return null;
    const busy = session.teamLifecycleBusy.has(teamId);

    // A pending delete replaces the row's controls with an explicit confirmation.
    if (session.teamLifecyclePendingDelete === teamId && controls.includes("delete")) {
      const container = document.createElement("div");
      container.className = "team-actions-confirm";
      container.setAttribute("role", "group");
      container.setAttribute("aria-label", "Confirm team deletion");
      const note = document.createElement("p");
      note.className = "team-actions-note";
      note.id = `team-delete-confirm-${teamId}`;
      note.textContent = `Delete “${stringValue(team.name) || "this team"}” for good? Running agents stop and this cannot be undone.`;
      const group = document.createElement("div");
      group.className = "team-actions";
      const confirmButton = lifecycleButton("delete-confirm", teamId, "Confirm delete", "button-danger", busy);
      confirmButton.setAttribute("aria-describedby", note.id);
      group.append(confirmButton, lifecycleButton("delete-cancel", teamId, "Keep team", "button-quiet", busy));
      container.append(note, group);
      return container;
    }

    const actions = document.createElement("div");
    actions.className = "team-actions";
    if (controls.includes("suspend")) actions.append(lifecycleButton("suspend", teamId, "Suspend", "button-quiet", busy));
    if (controls.includes("resume")) actions.append(lifecycleButton("resume", teamId, "Resume", "button-secondary", busy));
    if (controls.includes("delete")) actions.append(lifecycleButton("delete", teamId, "Delete", "button-danger", busy));
    return actions;
  }

  function handleTeamLifecycleClick(event) {
    const button = event.target.closest("[data-team-action]");
    if (!button || !ui.teamList.contains(button)) return;
    const action = stringValue(button.dataset.teamAction);
    const teamId = stringValue(button.dataset.teamId);
    const team = session.teams.find((candidate) => stringValue(candidate.id) === teamId);
    if (!team) return;
    if (action === "suspend") { suspendTeamLifecycle(team); return; }
    if (action === "resume") { resumeTeamLifecycle(team); return; }
    if (action === "delete") { requestTeamDeletion(team); return; }
    if (action === "delete-cancel") { cancelTeamDeletion(); return; }
    if (action === "delete-confirm") { confirmTeamDeletion(team); return; }
  }

  function requestTeamDeletion(team) {
    const teamId = stringValue(team.id);
    if (!teamId || session.teamLifecycleBusy.has(teamId)) return;
    session.teamLifecyclePendingDelete = teamId;
    renderTeamList();
    ui.teamList.querySelector('[data-team-action="delete-confirm"]')?.focus();
  }

  function cancelTeamDeletion() {
    if (!session.teamLifecyclePendingDelete) return;
    session.teamLifecyclePendingDelete = "";
    renderTeamList();
  }

  function suspendTeamLifecycle(team) {
    return runTeamLifecycleMutation(team, {
      procedure: "suspend_team",
      payload: { id: stringValue(team.id), reason: "Suspended from the customer console." },
      verify: (response) => stringValue(response?.team?.id) === stringValue(team.id) && stringValue(response.team.organizationId) === session.organizationId,
      successMessage: `Suspend confirmed by TeamService for “${stringValue(team.name) || "the team"}”. State refreshed from ListTeams.`,
      failureMessage: "The team was not suspended. No state change was assumed; it is safe to retry."
    });
  }

  function resumeTeamLifecycle(team) {
    return runTeamLifecycleMutation(team, {
      procedure: "resume_team",
      payload: { id: stringValue(team.id) },
      verify: (response) => stringValue(response?.team?.id) === stringValue(team.id) && stringValue(response.team.organizationId) === session.organizationId,
      successMessage: `Resume confirmed by TeamService for “${stringValue(team.name) || "the team"}”. State refreshed from ListTeams.`,
      failureMessage: "The team was not resumed. No state change was assumed; it is safe to retry."
    });
  }

  function confirmTeamDeletion(team) {
    return runTeamLifecycleMutation(team, {
      procedure: "delete_team",
      payload: { id: stringValue(team.id) },
      successMessage: `Deletion accepted by TeamService for “${stringValue(team.name) || "the team"}”. State refreshed from ListTeams.`,
      failureMessage: "The team was not deleted. No state change was assumed; it is safe to retry."
    });
  }

  async function runTeamLifecycleMutation(team, { procedure, payload, verify, successMessage, failureMessage }) {
    const teamId = stringValue(team.id);
    if (!teamId || session.teamLifecycleBusy.has(teamId)) return;
    session.teamLifecycleBusy.add(teamId);
    session.teamLifecyclePendingDelete = "";
    renderTeamList();
    try {
      const response = await apiRequest(procedure, payload);
      if (verify && !verify(response)) {
        throw new ApiError("TeamService did not confirm the lifecycle change in the current organization scope", 0, "invalid_response", "");
      }
      session.teamLifecycleBusy.delete(teamId);
      // Reflect only server truth: reload the authoritative team list rather
      // than synthesizing the post-mutation state in the browser.
      await reloadTeamsAfterLifecycle();
      toast(successMessage, "success");
    } catch (error) {
      session.teamLifecycleBusy.delete(teamId);
      renderTeamList();
      toast(apiErrorMessage(error, failureMessage), "error");
      // A precondition/capacity/not-found error means the browser's view is
      // stale; re-read the authoritative list so controls reflect reality.
      if (error instanceof ApiError && ["failed_precondition", "resource_exhausted", "not_found"].includes(error.code)) {
        await reloadTeamsAfterLifecycle();
      }
    }
  }

  async function reloadTeamsAfterLifecycle() {
    const [teamsResult] = await Promise.allSettled([listAllTeams()]);
    renderTeamsResult(teamsResult);
    updateTeamAction();
    await refreshSelectedTeam();
  }

  function renderTeamSelector(preferredId = "") {
    const previous = stringValue(preferredId) || session.selectedTeamId;
    ui.teamSelect.replaceChildren();
    if (!session.teams.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No teams available";
      ui.teamSelect.append(option);
      ui.teamSelect.disabled = true;
      session.selectedTeamId = "";
      ui.contextTeam.textContent = "Not selected";
      resetWorkspaceViews("Complete setup to create the first server-confirmed team.");
      renderCreditPackControls();
      return;
    }

    session.teams.forEach((team) => {
      const option = document.createElement("option");
      option.value = stringValue(team.id);
      const lifecycle = lifecycleLabel(team.state) || "created";
      option.textContent = `${stringValue(team.name) || "Unnamed team"} · ${lifecycle}`;
      ui.teamSelect.append(option);
    });
    const selected = session.teams.find((team) => team.id === previous) || session.teams[0];
    session.selectedTeamId = stringValue(selected?.id);
    ui.contextTeam.textContent = stringValue(selected?.name) || session.selectedTeamId;
    ui.teamSelect.value = session.selectedTeamId;
    ui.teamSelect.disabled = false;
    renderSelectedTeamSummary();
    renderCreditPackControls();
  }

  function selectedTeam() {
    return session.teams.find((team) => stringValue(team.id) === session.selectedTeamId) || null;
  }

  function renderSelectedTeamSummary() {
    const team = selectedTeam();
    if (!team) {
      ui.contextTeam.textContent = "Not selected";
      ui.dashboardState.textContent = "Select a server-confirmed team to load its live workspace.";
      renderEngineerControl();
      return;
    }
    const provisioning = launchContract?.provisioningPresentation(team.provisioning || {}) || {};
    const state = provisioning.label || lifecycleLabel(team.state) || "created";
    ui.contextTeam.textContent = stringValue(team.name) || stringValue(team.id);
    ui.dashboardState.textContent = `${stringValue(team.name) || "Selected team"} is ${state}. Workspace data below comes from versioned services.`;
    renderEngineerControl();
  }

  async function refreshSelectedTeam() {
    const team = selectedTeam();
    const generation = ++session.workspaceGeneration;
    stopActivityStream();
    if (!team) {
      resetWorkspaceViews("Complete setup to create the first server-confirmed team.");
      return;
    }

    renderSelectedTeamSummary();
    resetAgentView("Loading the server-confirmed team roster.", "Loading", "loading");
    resetEconomicsView("Loading the measured economics summary for this team.", "Loading", "loading");
    resetCreditBalanceView("Loading the authoritative team ledger balance.", "Loading", "loading");
    resetCreditControlView("Loading the current paid-period team budget.", "Loading", "loading");
    resetApprovalView("Loading pending decisions for this team.", "Loading", "loading");
    resetActivityView("Connecting to the team’s normalized activity stream.", "Connecting", "loading");
    resetSessionHistoryView("Loading assignment-bound session history.", "Loading", "loading");
    resetWorkspaceHistoryView("Loading server-sanitized workspace changes.", "Loading", "loading");
    resetDeliveryHistoryView("Loading webhook-backed GitHub delivery records.", "Loading", "loading");
    const deliveryRepository = configureDeliveryRepository();
    syncProvisioningSnapshot(team);
    resetObjectiveView("Loading durable objectives for the selected team.");
    setSourceState(ui.objectiveState, "Loading", "loading");
    startActivityStream(team.id, generation);
    startProvisioningStream(team.id, generation);

    const [agentsResult, economicsResult, economicsBreakdownsResult, creditBalanceResult, creditControlResult, approvalsResult, objectivesResult, sessionsResult, workspaceResult, issuesResult, pullRequestsResult] = await Promise.allSettled([
      apiRequest("agents", { teamId: team.id, page: { pageSize: 50 } }),
      apiRequest("economics", { scopeType: "team", scopeId: team.id }),
      loadEconomicsBreakdowns(team.id),
      apiRequest("credit_balance", { organizationId: session.organizationId, teamId: team.id }),
      apiRequest("credit_control", { organizationId: session.organizationId, teamId: team.id }),
      apiRequest("approvals", { teamId: team.id, page: { pageSize: 100 } }),
      listAllObjectives(team.id),
      apiRequest("sessions", { teamId: team.id, page: { pageSize: 100 } }),
      apiRequest("workspace_changes", { teamId: team.id, afterSequence: "0", page: { pageSize: 100 } }),
      deliveryRepository ? apiRequest("github_issues", { organizationId: session.organizationId, teamId: team.id, githubRepositoryId: deliveryRepository.id, page: { pageSize: 100 } }) : null,
      deliveryRepository ? apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId: team.id, githubRepositoryId: deliveryRepository.id, page: { pageSize: 100 } }) : null
    ]);
    if (generation !== session.workspaceGeneration || team.id !== session.selectedTeamId) return;
    renderAgentsResult(agentsResult, team.id);
    renderEconomicsResult(economicsResult, team.id);
    renderEconomicsBreakdownsResult(economicsBreakdownsResult);
    renderTeamCreditResults(creditBalanceResult, creditControlResult, team.id);
    renderApprovalsResult(approvalsResult, team.id);
    renderObjectivesResult(objectivesResult, team.id, generation);
    renderSessionHistoryResult(sessionsResult, team.id, "", false);
    renderWorkspaceHistoryResult(workspaceResult, team.id, "", false);
    if (deliveryRepository) {
      renderGitHubIssuesResult(issuesResult, team.id, deliveryRepository, "", false);
      renderGitHubPullRequestsResult(pullRequestsResult, team.id, deliveryRepository, "", false);
    }
    renderCreditPackControls();
  }

  function resetWorkspaceViews(message) {
    session.workspaceGeneration += 1;
    stopActivityStream();
    ui.dashboardState.textContent = message;
    resetAgentView(message, "Waiting");
    resetEconomicsView(message, "Waiting");
    resetCreditBalanceView(message, "Waiting");
    resetCreditControlView(message, "Waiting");
    resetApprovalView(message, "Waiting");
    renderCreditPackControls();
    resetActivityView(message, "Waiting");
    resetSessionHistoryView(message, "Waiting");
    resetWorkspaceHistoryView(message, "Waiting");
    resetDeliveryHistoryView(message, "Waiting");
    resetObjectiveView(message);
  }

  function setEmptyState(element, title, message) {
    if (!element) return;
    const heading = element.querySelector("strong");
    const copy = element.querySelector("p");
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = message;
  }

  function setSourceState(element, label, tone = "") {
    element.textContent = label;
    if (tone) element.dataset.tone = tone;
    else delete element.dataset.tone;
  }

  function resetObjectiveView(message) {
    ui.objectiveForm.hidden = true;
    ui.objectiveTitleInput.disabled = true;
    ui.objectiveDescriptionInput.disabled = true;
    ui.objectiveSubmit.disabled = true;
    ui.objectiveSelectControl.hidden = true;
    ui.objectiveSelect.disabled = true;
    ui.objectiveSelect.replaceChildren();
    ui.objectiveRecord.hidden = true;
    ui.objectiveEmpty.hidden = false;
    setEmptyState(ui.objectiveEmpty, "No objective loaded", message);
    ui.initiativeList.replaceChildren();
    setSourceState(ui.objectiveDispatchState, "Not reported");
    ui.objectiveDispatchDetail.textContent = "Waiting for the durable TPM handoff status.";
    ui.objectiveKpiList.replaceChildren();
    ui.objectiveKpiList.hidden = true;
    ui.objectiveKpiEmpty.hidden = false;
    setEmptyState(ui.objectiveKpiEmpty, "No KPIs proposed", "ObjectiveService has not returned KPI definitions for this objective.");
    setSourceState(ui.objectiveKpiState, "Waiting");
    setFieldError(ui.objectiveError, "");
    setSourceState(ui.objectiveState, "Waiting");
  }

  function objectiveDispatchStateLabel(value) {
    if (typeof value === "number") return ["", "queued", "delivering", "retrying", "delivered", "failed"][value] || "";
    return ({
      OBJECTIVE_DISPATCH_STATE_QUEUED: "queued",
      OBJECTIVE_DISPATCH_STATE_DELIVERING: "delivering",
      OBJECTIVE_DISPATCH_STATE_RETRYING: "retrying",
      OBJECTIVE_DISPATCH_STATE_DELIVERED: "delivered",
      OBJECTIVE_DISPATCH_STATE_FAILED: "failed"
    })[stringValue(value)] || "";
  }

  function objectiveDispatchFailureLabel(value) {
    if (typeof value === "number") return ["", "gateway unavailable", "TPM session unavailable", "delivery rejected", "retry exhausted"][value] || "";
    return ({
      OBJECTIVE_DISPATCH_FAILURE_REASON_GATEWAY_UNAVAILABLE: "gateway unavailable",
      OBJECTIVE_DISPATCH_FAILURE_REASON_TPM_SESSION_UNAVAILABLE: "TPM session unavailable",
      OBJECTIVE_DISPATCH_FAILURE_REASON_DELIVERY_REJECTED: "delivery rejected",
      OBJECTIVE_DISPATCH_FAILURE_REASON_RETRY_EXHAUSTED: "retry exhausted"
    })[stringValue(value)] || "";
  }

  function validObjectiveDispatch(dispatch) {
    const id = stringValue(dispatch?.dispatchId);
    const stateLabel = objectiveDispatchStateLabel(dispatch?.state);
    const attempt = Number(dispatch?.attempt);
    const updatedAt = timestampDate(dispatch?.updatedAt);
    const deliveredAt = dispatch?.deliveredAt ? timestampDate(dispatch.deliveredAt) : null;
    const failureReason = objectiveDispatchFailureLabel(dispatch?.failureReason);
    const safeError = stringValue(dispatch?.safeError);
    if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id) || !stateLabel || !Number.isInteger(attempt) || attempt < 0 || attempt > 2_147_483_647 || !updatedAt || safeError.length > 1000 || /[\u0000-\u001f\u007f]/.test(safeError)) return false;
    if (stateLabel === "delivered" && !deliveredAt) return false;
    if (dispatch?.deliveredAt && !deliveredAt) return false;
    if (stateLabel === "failed" && !failureReason) return false;
    return true;
  }

  function renderObjectiveDispatch(dispatch) {
    if (!validObjectiveDispatch(dispatch)) {
      setSourceState(ui.objectiveDispatchState, "Unavailable", "error");
      ui.objectiveDispatchDetail.textContent = "ObjectiveService did not return a valid durable handoff status. Delivery is not assumed.";
      return;
    }
    const stateLabel = objectiveDispatchStateLabel(dispatch.state);
    const tone = stateLabel === "delivered" ? "success" : stateLabel === "failed" ? "error" : "loading";
    setSourceState(ui.objectiveDispatchState, capitalize(stateLabel), tone);
    const parts = [`Attempt ${Number(dispatch.attempt)}`, `updated ${relativeTime(timestampDate(dispatch.updatedAt))}`];
    const failureReason = objectiveDispatchFailureLabel(dispatch.failureReason);
    if (failureReason) parts.push(failureReason);
    const safeError = stringValue(dispatch.safeError);
    if (safeError) parts.push(safeError);
    const deliveredAt = dispatch.deliveredAt ? timestampDate(dispatch.deliveredAt) : null;
    if (deliveredAt) parts.push(`delivered ${relativeTime(deliveredAt)}`);
    ui.objectiveDispatchDetail.textContent = `Durable TPM handoff · ${parts.join(" · ")}.`;
  }

  function validObjectiveKpis(kpis) {
    if (!Array.isArray(kpis) || kpis.length > 100) return false;
    const ids = new Set();
    return kpis.every((kpi) => {
      const id = stringValue(kpi?.id);
      const name = stringValue(kpi?.name);
      const unit = stringValue(kpi?.unit);
      const direction = stringValue(kpi?.direction).toLowerCase();
      const baseline = Number(kpi?.baseline);
      const target = Number(kpi?.target);
      const safeText = (value) => value && !/[\u0000-\u001f\u007f]/.test(value);
      if (!id || id.length > 128 || ids.has(id) || !safeText(id) || !safeText(name) || name.length > 160 || !safeText(unit) || unit.length > 80 || !["increase", "decrease", "maintain"].includes(direction) || !Number.isFinite(baseline) || !Number.isFinite(target) || typeof kpi?.guardrail !== "boolean") return false;
      ids.add(id);
      return true;
    });
  }

  function renderObjectiveKpis(kpis) {
    ui.objectiveKpiList.replaceChildren();
    if (!validObjectiveKpis(kpis)) {
      ui.objectiveKpiList.hidden = true;
      ui.objectiveKpiEmpty.hidden = false;
      setEmptyState(ui.objectiveKpiEmpty, "KPI projection unavailable", "ObjectiveService returned malformed KPI definitions. No proposed values were displayed.");
      setSourceState(ui.objectiveKpiState, "Invalid response", "error");
      return;
    }
    kpis.forEach((kpi) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      const detail = document.createElement("span");
      const number = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 7 });
      name.textContent = stringValue(kpi.name);
      detail.textContent = `${number.format(Number(kpi.baseline))} → ${number.format(Number(kpi.target))} ${stringValue(kpi.unit)} · ${stringValue(kpi.direction).toLowerCase()} · ${kpi.guardrail ? "guardrail" : "outcome KPI"}`;
      item.append(name, detail);
      ui.objectiveKpiList.append(item);
    });
    ui.objectiveKpiEmpty.hidden = kpis.length > 0;
    ui.objectiveKpiList.hidden = kpis.length === 0;
    if (!kpis.length) setEmptyState(ui.objectiveKpiEmpty, "No KPIs proposed", "ObjectiveService returned no KPI definitions for this objective yet.");
    setSourceState(ui.objectiveKpiState, kpis.length ? `${kpis.length} proposed` : "None yet", kpis.length ? "success" : "");
  }

  function renderObjectiveView(teamId, generation = session.workspaceGeneration) {
    const normalizedTeamId = stringValue(teamId);
    const objectives = session.objectiveListsByTeam.get(normalizedTeamId) || [];
    const remembered = session.objectivesByTeam.get(normalizedTeamId);
    const objective = objectives.find((candidate) => stringValue(candidate.id) === stringValue(remembered?.id)) || objectives[0] || null;
    if (objective) session.objectivesByTeam.set(normalizedTeamId, objective);
    else session.objectivesByTeam.delete(normalizedTeamId);
    setFieldError(ui.objectiveError, "");
    ui.initiativeList.replaceChildren();
    if (!objective) {
      ui.objectiveSelectControl.hidden = true;
      ui.objectiveSelect.disabled = true;
      ui.objectiveSelect.replaceChildren();
      ui.objectiveRecord.hidden = true;
      ui.objectiveEmpty.hidden = false;
      setEmptyState(ui.objectiveEmpty, "No business objectives", "ObjectiveService returned no durable objectives for this team. Submit the first outcome its agents should pursue.");
      ui.objectiveForm.hidden = false;
      ui.objectiveTitleInput.disabled = false;
      ui.objectiveDescriptionInput.disabled = false;
      ui.objectiveSubmit.disabled = false;
      setSourceState(ui.objectiveState, "Ready", "success");
      return;
    }
    ui.objectiveSelect.replaceChildren();
    objectives.forEach((candidate) => {
      const option = document.createElement("option");
      option.value = stringValue(candidate.id);
      option.textContent = stringValue(candidate.title) || "Untitled objective";
      ui.objectiveSelect.append(option);
    });
    ui.objectiveSelect.value = stringValue(objective.id);
    ui.objectiveSelect.disabled = false;
    ui.objectiveSelectControl.hidden = false;
    ui.objectiveForm.hidden = false;
    ui.objectiveTitleInput.disabled = false;
    ui.objectiveDescriptionInput.disabled = false;
    ui.objectiveSubmit.disabled = false;
    ui.objectiveEmpty.hidden = true;
    ui.objectiveRecord.hidden = false;
    ui.objectiveTitle.textContent = stringValue(objective.title) || "Untitled objective";
    ui.objectiveDescription.textContent = stringValue(objective.description) || "No description returned.";
    renderObjectiveDispatch(objective.dispatch);
    renderObjectiveKpis(objective.kpis);
    setSourceState(ui.objectiveState, `${objectives.length} ${objectives.length === 1 ? "objective" : "objectives"}`, "success");
    loadInitiatives(objective, generation);
  }

  async function listAllObjectives(teamId) {
    const objectives = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("objectives", { teamId, page: { pageSize: 100, pageToken } });
      const pageObjectives = Array.isArray(response.objectives) ? response.objectives : [];
      if (pageObjectives.length > 100) throw new ApiError("ObjectiveService returned an oversized page", 0, "invalid_response", "");
      for (const objective of pageObjectives) {
        const id = stringValue(objective?.id);
        if (!id || stringValue(objective?.teamId) !== stringValue(teamId) || seenIds.has(id) || !validObjectiveDispatch(objective?.dispatch) || !validObjectiveKpis(objective?.kpis)) throw new ApiError("ObjectiveService returned an invalid or duplicate team objective", 0, "invalid_response", "");
        seenIds.add(id);
        objectives.push(objective);
      }
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return objectives;
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Objective pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Objective list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  function renderObjectivesResult(result, teamId, generation = session.workspaceGeneration) {
    if (generation !== session.workspaceGeneration || stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      session.objectiveListsByTeam.delete(stringValue(teamId));
      resetObjectiveView(apiErrorMessage(result.reason, "Durable objectives could not be loaded for this team."));
      setSourceState(ui.objectiveState, "Unavailable", "error");
      return;
    }
    session.objectiveListsByTeam.set(stringValue(teamId), result.value);
    renderObjectiveView(teamId, generation);
  }

  function validInitiative(initiative, objectiveId) {
    const id = stringValue(initiative?.id);
    const title = stringValue(initiative?.title);
    const description = stringValue(initiative?.description);
    const hypothesis = stringValue(initiative?.hypothesis);
    const status = stringValue(initiative?.status);
    const priority = Number(initiative?.priority);
    const startedAt = initiative?.startedAt ? timestampDate(initiative.startedAt) : null;
    const completedAt = initiative?.completedAt ? timestampDate(initiative.completedAt) : null;
    return Boolean(
      id && id.length <= 128 && !/[\u0000-\u001f\u007f]/.test(id) &&
      stringValue(initiative?.objectiveId) === stringValue(objectiveId) &&
      title && title.length <= 200 && !/[\u0000\u007f]/.test(title) &&
      description && description.length <= 8192 && !/[\u0000\u007f]/.test(description) &&
      hypothesis.length <= 4096 && !/[\u0000\u007f]/.test(hypothesis) &&
      status && status.length <= 64 && /^[a-z][a-z0-9_-]*$/.test(status) &&
      Number.isInteger(priority) && priority >= 0 && priority <= 100 &&
      (!initiative?.startedAt || startedAt) && (!initiative?.completedAt || completedAt) &&
      (!startedAt || !completedAt || completedAt >= startedAt)
    );
  }

  async function listAllInitiatives(objectiveId) {
    const initiatives = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("initiatives", { objectiveId, page: { pageSize: 100, pageToken } });
      const pageInitiatives = Array.isArray(response.initiatives) ? response.initiatives : [];
      if (pageInitiatives.length > 100) throw new ApiError("InitiativeService returned an oversized page", 0, "invalid_response", "");
      for (const initiative of pageInitiatives) {
        const id = stringValue(initiative?.id);
        if (!validInitiative(initiative, objectiveId) || seenIds.has(id)) throw new ApiError("InitiativeService returned an invalid or duplicate objective-scoped proposal", 0, "invalid_response", "");
        seenIds.add(id);
        initiatives.push(initiative);
      }
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return initiatives;
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Initiative pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Initiative list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  async function loadInitiatives(objective, generation = session.workspaceGeneration) {
    const objectiveId = stringValue(objective?.id);
    const teamId = stringValue(objective?.teamId);
    if (!objectiveId || !teamId) return;
    setSourceState(ui.initiativeState, "Loading", "loading");
    try {
      const initiatives = await listAllInitiatives(objectiveId);
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      if (initiatives.some((initiative) => stringValue(initiative?.objectiveId) !== objectiveId)) {
        throw new ApiError("Initiative service returned a record outside the current objective", 0, "invalid_response", "");
      }
      ui.initiativeList.replaceChildren();
      initiatives.forEach((initiative) => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        const description = document.createElement("p");
        const detail = document.createElement("span");
        title.textContent = stringValue(initiative.title) || "Untitled initiative";
        description.textContent = stringValue(initiative.description);
        detail.textContent = [`Priority ${Number(initiative.priority)}`, stringValue(initiative.status).replaceAll("_", " "), stringValue(initiative.hypothesis) ? `Hypothesis: ${stringValue(initiative.hypothesis)}` : "No hypothesis supplied"].join(" · ");
        item.append(title, description, detail);
        ui.initiativeList.append(item);
      });
      setSourceState(ui.initiativeState, initiatives.length ? `${initiatives.length} ${initiatives.length === 1 ? "initiative" : "initiatives"}` : "No initiatives yet", initiatives.length ? "success" : "");
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      ui.initiativeList.replaceChildren();
      setSourceState(ui.initiativeState, "Unavailable", "error");
      toast(apiErrorMessage(error, "Initiatives could not be loaded for the submitted objective."), "error");
    }
  }

  async function createObjective(event) {
    event.preventDefault();
    const team = selectedTeam();
    if (!team) return;
    const form = new FormData(ui.objectiveForm);
    const title = stringValue(form.get("objectiveTitle"));
    const description = stringValue(form.get("objectiveDescription"));
    setFieldError(ui.objectiveError, "");
    if (title.length < 3 || title.length > 160) {
      setFieldError(ui.objectiveError, "Enter an objective title between 3 and 160 characters.");
      ui.objectiveTitleInput.focus();
      return;
    }
    if (description.length < 10 || description.length > 2000) {
      setFieldError(ui.objectiveError, "Describe the outcome and context in 10 to 2,000 characters.");
      ui.objectiveDescriptionInput.focus();
      return;
    }
    ui.objectiveTitleInput.disabled = true;
    ui.objectiveDescriptionInput.disabled = true;
    ui.objectiveSubmit.disabled = true;
    ui.objectiveSubmit.textContent = "Submitting…";
    setSourceState(ui.objectiveState, "Submitting", "loading");
    try {
      const fingerprint = `${team.id}:${title.toLowerCase()}:${description}`;
      const result = await apiRequest("create_objective", {
        teamId: team.id,
        title,
        description,
        idempotencyKey: mutationKeys.for("createObjective", fingerprint)
      });
      const objective = result.objective;
      if (!objective?.id || stringValue(objective.teamId) !== stringValue(team.id) || !validObjectiveDispatch(objective.dispatch) || !validObjectiveKpis(objective.kpis)) {
        throw new ApiError("Objective service did not return a resource in the selected team scope", 0, "invalid_response", "");
      }
      mutationKeys.clear("createObjective");
      const teamKey = stringValue(team.id);
      const existing = session.objectiveListsByTeam.get(teamKey) || [];
      session.objectiveListsByTeam.set(teamKey, [objective, ...existing.filter((candidate) => stringValue(candidate.id) !== stringValue(objective.id))]);
      session.objectivesByTeam.set(teamKey, objective);
      ui.objectiveForm.reset();
      renderObjectiveView(team.id, session.workspaceGeneration);
      toast(`The API confirmed the business objective and its durable handoff is ${objectiveDispatchStateLabel(objective.dispatch.state)}.`, "success");
    } catch (error) {
      const message = apiErrorMessage(error, "The objective was not confirmed as created. It is safe to retry with the same request.");
      setFieldError(ui.objectiveError, message);
      setSourceState(ui.objectiveState, "Not submitted", "error");
      ui.objectiveTitleInput.disabled = false;
      ui.objectiveDescriptionInput.disabled = false;
      ui.objectiveSubmit.disabled = false;
    } finally {
      ui.objectiveSubmit.textContent = "Submit objective";
    }
  }

  function selectObjective() {
    const team = selectedTeam();
    if (!team) return;
    const objective = (session.objectiveListsByTeam.get(stringValue(team.id)) || [])
      .find((candidate) => stringValue(candidate.id) === stringValue(ui.objectiveSelect.value));
    if (!objective) {
      setSourceState(ui.objectiveState, "Invalid selection", "error");
      return;
    }
    session.objectivesByTeam.set(stringValue(team.id), objective);
    renderObjectiveView(team.id, session.workspaceGeneration);
  }

  function resetAgentView(message, label, tone = "") {
    ui.agentList.replaceChildren();
    ui.agentList.hidden = true;
    ui.agentsEmpty.hidden = false;
    setEmptyState(ui.agentsEmpty, label === "Loading" ? "Loading team roster" : "No roster loaded", message);
    setSourceState(ui.agentsState, label, tone);
  }

  function renderAgentsResult(result, teamId) {
    if (result.status === "rejected") {
      const message = apiErrorMessage(result.reason, "The AgentService is unavailable. No roster was assumed.");
      resetAgentView(message, "Unavailable", "error");
      return;
    }
    const agents = Array.isArray(result.value.agents) ? result.value.agents : [];
    if (agents.some((agent) => !stringValue(agent?.id) || stringValue(agent.teamId) !== stringValue(teamId))) {
      resetAgentView("The AgentService returned a roster outside the selected team scope. No agents were displayed.", "Invalid response", "error");
      return;
    }
    ui.agentList.replaceChildren();
    if (!agents.length) {
      resetAgentView("The service returned no agents for this team. Provisioning may still be in progress.", "Empty");
      return;
    }
    const resolvedRoles = agents.map((agent) => agentRoleContract?.canonicalAgentRole?.(agent.role) || null);
    const roleKeys = resolvedRoles.map((role) => role?.key).filter(Boolean);
    if (resolvedRoles.some((role) => !role) || new Set(roleKeys).size !== roleKeys.length || agents.length > 6) {
      resetAgentView("The AgentService returned a role outside the canonical six-role runtime contract. No roster was displayed.", "Invalid response", "error");
      return;
    }
    agents.forEach((agent, index) => {
      const canonicalRole = resolvedRoles[index];
      const row = document.createElement("div");
      row.className = "agent-row";
      const ordinal = document.createElement("span");
      ordinal.className = "agent-ordinal";
      ordinal.textContent = canonicalRole.code;
      ordinal.setAttribute("aria-hidden", "true");
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const role = document.createElement("small");
      name.textContent = canonicalRole.label;
      role.textContent = `${stringValue(agent.id)} · ${lifecycleLabel(agent.state) || "state not reported"}`;
      copy.append(name, role);
      const heartbeat = document.createElement("time");
      const date = timestampDate(agent.lastHeartbeatAt);
      heartbeat.textContent = date ? relativeTime(date) : "No heartbeat";
      if (date) heartbeat.dateTime = date.toISOString();
      row.append(ordinal, copy, heartbeat);
      ui.agentList.append(row);
    });
    ui.agentsEmpty.hidden = true;
    ui.agentList.hidden = false;
    setSourceState(ui.agentsState, agents.length === 6 ? "6/6 roles" : `${agents.length}/6 provisioning`, agents.length === 6 ? "success" : "loading");
  }

  function agentRoleLabel(value) {
    return agentRoleContract?.canonicalAgentRole?.(value)?.label || "Unspecified agent role";
  }

  const economicsGroupDefinitions = Object.freeze([
    { key: "initiative", label: "Initiative", scopeType: 7 },
    { key: "agent", label: "Agent", scopeType: 4 },
    { key: "agent_role", label: "Agent role", scopeType: 5 },
    { key: "repository", label: "Repository", scopeType: 10 },
    { key: "issue", label: "Issue", scopeType: 8 },
    { key: "pull_request", label: "Pull request", scopeType: 9 }
  ]);

  function formatIntegerCount(value) {
    const integer = int64Value(value);
    return integer === null ? "Not reported" : new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(integer);
  }

  async function listAllEconomicsBreakdowns(teamId, definition) {
    const records = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    let measuredAt = null;
    for (let page = 0; page < 5; page += 1) {
      const response = await apiRequest("economics_breakdowns", {
        parentScopeType: "team",
        parentScopeId: teamId,
        groupBy: definition.key,
        page: { pageSize: 100, pageToken }
      });
      const pageRecords = Array.isArray(response.breakdowns) ? response.breakdowns : [];
      if (pageRecords.length > 100) throw new ApiError("EconomicsService returned an oversized breakdown page", 0, "invalid_response", "");
      const responseMeasuredAt = timestampDate(response.measuredAt);
      if (!responseMeasuredAt) throw new ApiError("EconomicsService omitted breakdown measurement time", 0, "invalid_response", "");
      if (measuredAt && measuredAt.getTime() !== responseMeasuredAt.getTime()) throw new ApiError("EconomicsService changed measurement time during pagination", 0, "invalid_response", "");
      measuredAt = responseMeasuredAt;
      for (const record of pageRecords) {
        const id = stringValue(record?.scope?.id);
        const displayName = stringValue(record?.displayName);
        const usageCount = int64Value(record?.usageEventCount);
        const credits = int64Value(record?.creditsUsedMicros);
        if (!id || id.length > 256 || /[\u0000-\u001f\u007f]/.test(id) || record?.scope?.type !== definition.scopeType || seenIds.has(id) || !displayName || displayName.length > 256 || usageCount === null || usageCount < 0n || credits === null || credits < 0n) {
          throw new ApiError("EconomicsService returned an invalid scoped breakdown", 0, "invalid_response", "");
        }
        seenIds.add(id);
        records.push(record);
      }
      const next = stringValue(response.nextPageToken);
      if (!next) return { records, measuredAt };
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Economics breakdown pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Economics breakdown exceeded the supported 500-row dimension limit", 0, "resource_exhausted", "");
  }

  async function loadEconomicsBreakdowns(teamId) {
    const results = await Promise.allSettled(economicsGroupDefinitions.map((definition) => listAllEconomicsBreakdowns(teamId, definition)));
    return new Map(economicsGroupDefinitions.map((definition, index) => [definition.key, results[index]]));
  }

  function renderSelectedEconomicsGroup() {
    const definition = economicsGroupDefinitions.find((candidate) => candidate.key === session.selectedEconomicsGroup) || economicsGroupDefinitions[0];
    const result = session.economicsBreakdowns.get(definition.key);
    ui.economicsBreakdownList.replaceChildren();
    if (!result || result.status === "rejected") {
      ui.economicsBreakdownList.hidden = true;
      ui.economicsBreakdownEmpty.hidden = false;
      setEmptyState(ui.economicsBreakdownEmpty, `${definition.label} breakdown unavailable`, result ? apiErrorMessage(result.reason, "The server-calculated breakdown is unavailable.") : "No breakdown response was loaded.");
      return;
    }
    result.value.records.forEach((record) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      const values = document.createElement("span");
      const time = document.createElement("span");
      name.textContent = stringValue(record.displayName);
      values.textContent = `${formatCanonicalMoney(record.directCost)} cost · ${formatCreditMicros(record.creditsUsedMicros)} credits · ${formatIntegerCount(record.usageEventCount)} usage events`;
      const measured = result.value.measuredAt;
      const first = timestampDate(record.firstOccurredAt);
      const last = timestampDate(record.lastOccurredAt);
      time.textContent = `Measured ${relativeTime(measured)}${first && last ? ` · activity ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(first)} – ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(last)}` : ""}`;
      item.append(name, values, time);
      ui.economicsBreakdownList.append(item);
    });
    ui.economicsBreakdownEmpty.hidden = result.value.records.length > 0;
    ui.economicsBreakdownList.hidden = result.value.records.length === 0;
    if (!result.value.records.length) setEmptyState(ui.economicsBreakdownEmpty, `No ${definition.label.toLowerCase()} usage`, "The authoritative ledger returned no rows for the current paid period.");
  }

  function renderEconomicsBreakdownsResult(result) {
    ui.economicsBreakdown.hidden = false;
    if (result.status === "rejected") {
      session.economicsBreakdowns = new Map();
      ui.economicsGroup.disabled = true;
      setSourceState(ui.economicsBreakdownState, "Unavailable", "error");
      renderSelectedEconomicsGroup();
      return;
    }
    session.economicsBreakdowns = result.value;
    ui.economicsGroup.replaceChildren();
    economicsGroupDefinitions.forEach((definition) => {
      const option = document.createElement("option");
      const groupResult = result.value.get(definition.key);
      option.value = definition.key;
      option.textContent = `${definition.label} · ${groupResult?.status === "fulfilled" ? groupResult.value.records.length : "unavailable"}`;
      ui.economicsGroup.append(option);
    });
    if (!economicsGroupDefinitions.some((definition) => definition.key === session.selectedEconomicsGroup)) session.selectedEconomicsGroup = economicsGroupDefinitions[0].key;
    ui.economicsGroup.value = session.selectedEconomicsGroup;
    ui.economicsGroup.disabled = false;
    const loaded = [...result.value.values()].filter((group) => group.status === "fulfilled").length;
    setSourceState(ui.economicsBreakdownState, loaded === economicsGroupDefinitions.length ? "Measured" : `${loaded}/${economicsGroupDefinitions.length} measured`, loaded ? "success" : "error");
    renderSelectedEconomicsGroup();
  }

  function selectEconomicsGroup() {
    const key = stringValue(ui.economicsGroup.value);
    if (!economicsGroupDefinitions.some((definition) => definition.key === key)) return;
    session.selectedEconomicsGroup = key;
    renderSelectedEconomicsGroup();
  }

  function resetEconomicsView(message, label, tone = "") {
    replaceActivityProjections("cost:", []);
    session.economicsBreakdowns = new Map();
    session.selectedEconomicsGroup = "initiative";
    ui.economicsBreakdown.hidden = true;
    ui.economicsGroup.disabled = true;
    ui.economicsGroup.replaceChildren();
    ui.economicsBreakdownList.replaceChildren();
    ui.economicsBreakdownList.hidden = true;
    ui.economicsBreakdownEmpty.hidden = false;
    setSourceState(ui.economicsBreakdownState, label, tone);
    ui.economicsMetrics.hidden = true;
    ui.economicsMeasured.hidden = true;
    ui.economicsEmpty.hidden = false;
    setEmptyState(ui.economicsEmpty, label === "Loading" ? "Loading economics" : "No economics summary loaded", message);
    ui.economicsMessage.textContent = message;
    setSourceState(ui.economicsState, label, tone);
  }

  function resetCreditBalanceView(message, label = "Waiting", tone = "") {
    session.creditBalance = null;
    ui.creditBalancePanel.hidden = !selectedTeam();
    ui.creditBalanceValue.textContent = "Unavailable";
    ui.creditBalanceMessage.textContent = message;
    setSourceState(ui.creditBalanceState, label, tone);
  }

  function renderCreditBalanceResult(result) {
    if (result.status === "rejected") {
      resetCreditBalanceView(apiErrorMessage(result.reason, "The team credit ledger balance is unavailable. No balance was assumed."), "Unavailable", "error");
      return;
    }
    const balance = int64Value(result.value?.balanceMicros);
    if (balance === null) {
      resetCreditBalanceView("BillingService returned an invalid team credit balance. No balance was displayed.", "Invalid response", "error");
      return;
    }
    session.creditBalance = balance;
    ui.creditBalancePanel.hidden = false;
    ui.creditBalanceValue.textContent = formatCreditMicros(balance);
    ui.creditBalanceMessage.textContent = "Signed grants minus settled usage for this team. Open reservations and the paid-period hard limit are separate execution guardrails below.";
    setSourceState(ui.creditBalanceState, "Verified", "success");
  }

  function renderTeamCreditResults(balanceResult, controlResult, teamId) {
    const balance = balanceResult.status === "fulfilled" ? int64Value(balanceResult.value?.balanceMicros) : null;
    const control = controlResult.status === "fulfilled" ? controlResult.value?.control : null;
    if (balance !== null && validCreditControl(control, teamId) && balance !== int64Value(control.ledgerAvailableMicros)) {
      const message = "BillingService returned inconsistent ledger and budget projections. No credit state was displayed; billable work remains fail-closed.";
      resetCreditBalanceView(message, "Invalid response", "error");
      resetCreditControlView(message, "Invalid response", "error");
      return;
    }
    renderCreditBalanceResult(balanceResult);
    renderCreditControlResult(controlResult, teamId);
  }

  function resetCreditControlView(message, label = "Waiting", tone = "") {
    session.creditControl = null;
    ui.creditControl.hidden = !selectedTeam();
    ui.creditHardLimitInput.disabled = true;
    ui.creditCustomerPaused.disabled = true;
    ui.creditControlSubmit.disabled = true;
    ui.creditControlSummary.textContent = message;
    setFieldError(ui.creditControlError, tone === "error" ? message : "");
    setSourceState(ui.creditControlState, label, tone);
    renderCreditPackControls();
  }

  function pauseReasonLabel(value) {
    const numeric = typeof value === "number" ? value : -1;
    const normalized = numeric >= 0
      ? ["", "NONE", "CUSTOMER_PAUSED", "BILLING_INACTIVE", "CREDITS_EXHAUSTED", "BUDGET_EXHAUSTED"][numeric] || ""
      : stringValue(value).replace(/^TEAM_CREDIT_PAUSE_REASON_/, "");
    return ({
      NONE: "Ready",
      CUSTOMER_PAUSED: "Customer paused",
      BILLING_INACTIVE: "Billing inactive",
      CREDITS_EXHAUSTED: "Credits exhausted",
      BUDGET_EXHAUSTED: "Budget exhausted"
    })[normalized] || "Unavailable";
  }

  function microsInputValue(value) {
    const micros = int64Value(value);
    if (micros === null) return "";
    const whole = micros / 1_000_000n;
    const fraction = (micros % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
    return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
  }

  function creditInputMicros(value) {
    const normalized = stringValue(value);
    const match = /^(0|[1-9][0-9]{0,12})(?:\.([0-9]{1,6}))?$/.exec(normalized);
    if (!match) return null;
    const micros = BigInt(match[1]) * 1_000_000n + BigInt((match[2] || "").padEnd(6, "0") || "0");
    return micros <= 9_223_372_036_854_775_807n ? micros : null;
  }

  function validCreditControl(control, teamId) {
    if (!control || stringValue(control.teamId) !== stringValue(teamId)) return false;
    const ledger = int64Value(control.ledgerAvailableMicros);
    const open = int64Value(control.openReservedMicros);
    const consumed = int64Value(control.periodConsumedMicros);
    const hard = int64Value(control.hardLimitMicros);
    const budget = int64Value(control.budgetRemainingMicros);
    const effective = int64Value(control.effectiveAvailableMicros);
    const version = int64Value(control.version);
    if ([ledger, open, consumed, hard, budget, effective, version].some((value) => value === null) || hard <= 0n || version <= 0n) return false;
    const committed = open + consumed;
    const expectedBudget = hard > committed ? hard - committed : 0n;
    const expectedEffective = (ledger < expectedBudget ? ledger : expectedBudget);
    if (budget !== expectedBudget || effective !== expectedEffective || effective < 0n) return false;
    const reason = pauseReasonLabel(control.pauseReason);
    if (reason === "Unavailable" || Boolean(control.paused) !== (reason !== "Ready")) return false;
    if (Boolean(control.customerPaused) !== (reason === "Customer paused")) return false;
    const startsAt = timestampDate(control.periodStartsAt);
    const endsAt = timestampDate(control.periodEndsAt);
    return Boolean(startsAt && endsAt && endsAt > startsAt);
  }

  function renderCreditControlResult(result, teamId) {
    if (result.status === "rejected") {
      resetCreditControlView(apiErrorMessage(result.reason, "The team credit control is unavailable. Billable work remains fail-closed."), "Unavailable", "error");
      return;
    }
    const control = result.value.control;
    if (!validCreditControl(control, teamId)) {
      resetCreditControlView("The billing service returned an inconsistent team credit control. Billable work remains fail-closed.", "Invalid response", "error");
      return;
    }
    session.creditControl = control;
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    ui.creditControl.hidden = false;
    ui.creditOpenReserved.textContent = formatCreditMicros(control.openReservedMicros);
    ui.creditPeriodConsumed.textContent = formatCreditMicros(control.periodConsumedMicros);
    ui.creditHardLimit.textContent = formatCreditMicros(control.hardLimitMicros);
    ui.creditEffectiveAvailable.textContent = formatCreditMicros(control.effectiveAvailableMicros);
    ui.creditHardLimitInput.value = microsInputValue(control.hardLimitMicros);
    ui.creditHardLimitInput.min = microsInputValue(committed > 0n ? committed : 1n);
    ui.creditHardLimitInput.max = microsInputValue(prepaidCeiling);
    ui.creditCustomerPaused.checked = Boolean(control.customerPaused);
    ui.creditHardLimitInput.disabled = false;
    ui.creditCustomerPaused.disabled = false;
    ui.creditControlSubmit.disabled = false;
    setFieldError(ui.creditControlError, "");
    const label = pauseReasonLabel(control.pauseReason);
    setSourceState(ui.creditControlState, label, label === "Ready" ? "success" : "error");
    updateCreditControlSummary();
    renderCreditPackControls();
  }

  function updateCreditControlSummary() {
    const control = session.creditControl;
    if (!control) return;
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    const proposed = creditInputMicros(ui.creditHardLimitInput.value);
    const withinRange = proposed !== null && proposed >= committed && proposed <= prepaidCeiling && proposed > 0n;
    ui.creditControlSummary.textContent = withinRange
      ? `${formatCreditMicros(proposed)} credit hard limit · ${ui.creditCustomerPaused.checked ? "billable work paused" : "billable work enabled"} · version ${String(control.version)}`
      : `Choose a limit from ${formatCreditMicros(committed)} to ${formatCreditMicros(prepaidCeiling)} available prepaid credits.`;
    ui.creditControlSubmit.disabled = !withinRange;
  }

  async function saveCreditControl(event) {
    event.preventDefault();
    const team = selectedTeam();
    const control = session.creditControl;
    if (!team || !control || stringValue(control.teamId) !== stringValue(team.id)) return;
    const hardLimit = creditInputMicros(ui.creditHardLimitInput.value);
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    if (hardLimit === null || hardLimit <= 0n || hardLimit < committed || hardLimit > prepaidCeiling) {
      setFieldError(ui.creditControlError, "The hard limit must cover committed usage and remain within prepaid availability.");
      return;
    }
    const customerPaused = Boolean(ui.creditCustomerPaused.checked);
    const expectedVersion = int64Value(control.version);
    const fingerprint = `${session.organizationId}:${team.id}:${hardLimit.toString()}:${customerPaused}:${expectedVersion.toString()}`;
    ui.creditControlSubmit.disabled = true;
    ui.creditControlSubmit.textContent = "Saving…";
    try {
      const result = await apiRequest("update_credit_control", {
        organizationId: session.organizationId,
        teamId: team.id,
        hardLimitMicros: hardLimit.toString(),
        customerPaused,
        expectedVersion: expectedVersion.toString(),
        idempotencyKey: mutationKeys.for("updateCreditControl", fingerprint)
      });
      if (!validCreditControl(result.control, team.id)) throw new ApiError("Billing service returned an invalid updated credit control", 0, "invalid_response", "");
      if (session.creditBalance !== null && int64Value(result.control.ledgerAvailableMicros) !== session.creditBalance) {
        throw new ApiError("Billing service returned credit projections that do not reconcile", 0, "invalid_response", "");
      }
      mutationKeys.clear("updateCreditControl");
      renderCreditControlResult({ status: "fulfilled", value: result }, team.id);
      toast("Team budget control was confirmed by the API.", "success");
    } catch (error) {
      const message = apiErrorMessage(error, "The team budget control was not updated.");
      setFieldError(ui.creditControlError, message);
      if (error instanceof ApiError && ["aborted", "failed_precondition"].includes(error.code)) await refreshSelectedTeam();
    } finally {
      ui.creditControlSubmit.textContent = "Save budget control";
      if (session.creditControl) updateCreditControlSummary();
    }
  }

  function renderEconomicsResult(result, teamId) {
    if (result.status === "rejected") {
      resetEconomicsView(apiErrorMessage(result.reason, "The EconomicsService is unavailable."), "Unavailable", "error");
      return;
    }
    const economics = result.value.economics;
    if (!economics || stringValue(economics.scopeType).toLowerCase() !== "team" || stringValue(economics.scopeId) !== stringValue(teamId)) {
      resetEconomicsView("The economics service did not return a matching team-scoped summary. No metrics were displayed.", "Invalid response", "error");
      return;
    }
    ui.economicsDirectCost.textContent = formatCanonicalMoney(economics.directCost);
    ui.economicsCreditsUsed.textContent = formatCreditMicros(economics.creditsUsedMicros);
    ui.economicsCreditsRemaining.textContent = formatCreditMicros(economics.creditsRemainingMicros);
    const measured = timestampDate(economics.measuredAt);
    ui.economicsMeasured.textContent = measured ? `Measured ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(measured)}.` : "Measurement time was not reported.";
    ui.economicsMessage.textContent = "Team-scoped cost and credit balances from the economics ledger.";
    ui.economicsEmpty.hidden = true;
    ui.economicsMetrics.hidden = false;
    ui.economicsMeasured.hidden = false;
    setSourceState(ui.economicsState, "Measured", "success");
    upsertActivityProjection({
      id: `cost:${teamId}`,
      category: "cost",
      source: "EconomicsService snapshot",
      title: "Cost and credits measured",
      safeSummary: `${formatCanonicalMoney(economics.directCost)} attributable cost · ${formatCreditMicros(economics.creditsUsedMicros)} credits used · ${formatCreditMicros(economics.creditsRemainingMicros)} credits remaining.`,
      detail: "Point-in-time team economics; not a streamed usage event.",
      status: "measured",
      sequenceLabel: "Snapshot",
      occurredAt: economics.measuredAt
    });
  }

  function resetApprovalView(message, label, tone = "") {
    replaceActivityProjections("approval-pending:", []);
    session.approvals = [];
    session.approvalNextPageToken = "";
    session.approvalPageTokens = new Set();
    session.approvalDecisionIds = new Set();
    ui.approvalList.replaceChildren();
    ui.approvalList.hidden = true;
    ui.approvalsMore.hidden = true;
    ui.approvalsMore.disabled = true;
    ui.approvalsEmpty.hidden = false;
    setEmptyState(ui.approvalsEmpty, label === "Loading" ? "Loading pending approvals" : "No approval queue loaded", message);
    setSourceState(ui.approvalsState, label, tone);
  }

  function pendingApprovalStatus(approval) {
    if (typeof approval?.approvalStatus === "number") return approval.approvalStatus === 1;
    return stringValue(approval?.approvalStatus) === "APPROVAL_STATUS_PENDING";
  }

  function decidedApprovalStatus(approval, approved) {
    if (typeof approval?.approvalStatus === "number") return approval.approvalStatus === (approved ? 2 : 3);
    return stringValue(approval?.approvalStatus) === (approved ? "APPROVAL_STATUS_APPROVED" : "APPROVAL_STATUS_DENIED");
  }

  function validPendingApproval(approval, teamId) {
    const id = stringValue(approval?.id);
    const summary = stringValue(approval?.safeSummary);
    const actionType = stringValue(approval?.actionType);
    return Boolean(
      id && id.length <= 128 && !/[\u0000-\u001f\u007f]/.test(id) &&
      stringValue(approval?.teamId) === stringValue(teamId) &&
      summary && summary.length <= 1000 &&
      actionType && actionType.length <= 160 &&
      pendingApprovalStatus(approval)
    );
  }

  function applyApprovalPage(response, teamId, append = false, requestedToken = "") {
    const approvals = Array.isArray(response?.approvals) ? response.approvals : [];
    if (approvals.length > 100 || approvals.some((approval) => !validPendingApproval(approval, teamId))) {
      throw new ApiError("ApprovalService returned an invalid pending approval page", 0, "invalid_response", "");
    }
    const existing = append ? new Map(session.approvals.map((approval) => [stringValue(approval.id), approval])) : new Map();
    for (const approval of approvals) {
      const id = stringValue(approval.id);
      if (existing.has(id)) throw new ApiError("ApprovalService returned a duplicate approval", 0, "invalid_response", "");
      existing.set(id, approval);
    }
    const nextPageToken = stringValue(response?.page?.nextPageToken);
    if (nextPageToken && (nextPageToken === requestedToken || session.approvalPageTokens.has(nextPageToken))) {
      throw new ApiError("ApprovalService returned a repeated page cursor", 0, "invalid_response", "");
    }
    if (!append) session.approvalPageTokens = new Set();
    if (nextPageToken) session.approvalPageTokens.add(nextPageToken);
    session.approvals = [...existing.values()];
    session.approvalNextPageToken = nextPageToken;
    renderApprovalQueue();
  }

  function renderApprovalQueue() {
    ui.approvalList.replaceChildren();
    session.approvals.forEach((approval, index) => {
      const id = stringValue(approval.id);
      const actionType = stringValue(approval.actionType);
      const summary = stringValue(approval.safeSummary);
      const pending = session.approvalDecisionIds.has(id);
      const item = document.createElement("li");
      const form = document.createElement("form");
      form.className = "approval-card";
      form.dataset.approvalId = id;
      if (pending) form.setAttribute("aria-busy", "true");

      const header = document.createElement("div");
      header.className = "approval-card-header";
      const type = document.createElement("span");
      type.className = "approval-action-type";
      type.textContent = actionType.replaceAll("_", " ");
      const requested = document.createElement("time");
      const requestedAt = timestampDate(approval.requestedAt);
      requested.textContent = requestedAt ? relativeTime(requestedAt) : "Time not reported";
      if (requestedAt) {
        requested.dateTime = requestedAt.toISOString();
        requested.title = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(requestedAt);
      }
      header.append(type, requested);

      const safeSummary = document.createElement("strong");
      safeSummary.textContent = summary;
      const requestedBy = document.createElement("p");
      requestedBy.className = "approval-requester";
      requestedBy.textContent = stringValue(approval.requestedByAgentId)
        ? `Requested by ${stringValue(approval.requestedByAgentId)}`
        : "Requesting agent not reported";

      const reasonId = `approval-reason-${index}`;
      const reasonLabel = document.createElement("label");
      reasonLabel.htmlFor = reasonId;
      reasonLabel.textContent = "Decision note";
      const reason = document.createElement("textarea");
      reason.id = reasonId;
      reason.name = "reason";
      reason.rows = 2;
      reason.maxLength = 500;
      reason.placeholder = "Required to deny; optional to approve";
      reason.disabled = pending;
      reason.setAttribute("aria-describedby", `${reasonId}-help ${reasonId}-error`);
      const help = document.createElement("small");
      help.id = `${reasonId}-help`;
      help.textContent = "The API records the authenticated decision owner and immutable audit event.";
      const error = document.createElement("p");
      error.id = `${reasonId}-error`;
      error.className = "form-error";
      error.dataset.approvalError = "";
      error.setAttribute("role", "alert");
      error.hidden = true;

      const actions = document.createElement("div");
      actions.className = "approval-actions";
      const approve = document.createElement("button");
      approve.className = "button button-primary button-small";
      approve.type = "submit";
      approve.value = "approve";
      approve.dataset.approvalDecision = "approve";
      approve.textContent = pending ? "Saving…" : "Approve";
      approve.disabled = pending;
      approve.setAttribute("aria-label", `Approve ${actionType.replaceAll("_", " ")}`);
      const deny = document.createElement("button");
      deny.className = "button button-quiet button-small approval-deny";
      deny.type = "submit";
      deny.value = "deny";
      deny.dataset.approvalDecision = "deny";
      deny.textContent = "Deny";
      deny.disabled = pending;
      deny.setAttribute("aria-label", `Deny ${actionType.replaceAll("_", " ")}`);
      actions.append(approve, deny);
      form.append(header, safeSummary, requestedBy, reasonLabel, reason, help, error, actions);
      item.append(form);
      ui.approvalList.append(item);
    });

    const count = session.approvals.length;
    ui.approvalsEmpty.hidden = count > 0;
    ui.approvalList.hidden = count === 0;
    if (!count) setEmptyState(ui.approvalsEmpty, "No pending approvals", "The API returned no pending decisions for this team.");
    setSourceState(ui.approvalsState, count ? `${count} pending` : "Clear", count ? "loading" : "success");
    ui.approvalsMore.hidden = !session.approvalNextPageToken;
    ui.approvalsMore.disabled = !session.approvalNextPageToken;
    replaceActivityProjections("approval-pending:", session.approvals.map((approval) => ({
      id: `approval-pending:${stringValue(approval.id)}`,
      category: "approvals",
      source: "ApprovalService queue",
      title: stringValue(approval.actionType).replaceAll("_", " ") || "Approval requested",
      safeSummary: stringValue(approval.safeSummary),
      detail: stringValue(approval.requestedByAgentId) ? `Requested by agent ${stringValue(approval.requestedByAgentId)}` : "Requesting agent not reported.",
      status: "pending",
      sequenceLabel: "Snapshot",
      occurredAt: approval.requestedAt
    })));
  }

  function renderApprovalsResult(result, teamId) {
    if (result.status === "rejected") {
      resetApprovalView(apiErrorMessage(result.reason, "Pending approvals are unavailable."), "Unavailable", "error");
      return;
    }
    try {
      applyApprovalPage(result.value, teamId);
    } catch (error) {
      resetApprovalView(apiErrorMessage(error, "The approval service returned an invalid team-scoped queue."), "Invalid response", "error");
    }
  }

  async function loadMoreApprovals() {
    const team = selectedTeam();
    const pageToken = session.approvalNextPageToken;
    const generation = session.workspaceGeneration;
    if (!team || !pageToken || ui.approvalsMore.disabled) return;
    ui.approvalsMore.disabled = true;
    ui.approvalsMore.textContent = "Loading…";
    try {
      const response = await apiRequest("approvals", { teamId: team.id, page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      applyApprovalPage(response, team.id, true, pageToken);
    } catch (error) {
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      setSourceState(ui.approvalsState, "More unavailable", "error");
      toast(apiErrorMessage(error, "More pending approvals could not be loaded."), "error");
      ui.approvalsMore.disabled = false;
    } finally {
      if (generation === session.workspaceGeneration && stringValue(team.id) === session.selectedTeamId) {
        ui.approvalsMore.textContent = "Load more pending approvals";
        if (!session.approvalNextPageToken) ui.approvalsMore.hidden = true;
      }
    }
  }

  async function decideApproval(event) {
    event.preventDefault();
    const form = event.target.closest("[data-approval-id]");
    const submitter = event.submitter;
    const id = stringValue(form?.dataset.approvalId);
    const decision = stringValue(submitter?.dataset.approvalDecision);
    const approved = decision === "approve";
    const team = selectedTeam();
    const generation = session.workspaceGeneration;
    const approval = session.approvals.find((candidate) => stringValue(candidate.id) === id);
    if (!form || !submitter || !team || !approval || !["approve", "deny"].includes(decision) || session.approvalDecisionIds.has(id)) return;
    const actionType = stringValue(approval.actionType);
    const reasonField = form.elements.namedItem("reason");
    const reason = stringValue(reasonField?.value);
    const error = form.querySelector("[data-approval-error]");
    setFieldError(error, "");
    if (!approved && !reason) {
      setFieldError(error, "Enter a reason before denying this request.");
      reasonField?.focus();
      return;
    }
    if (new TextEncoder().encode(reason).length > 500) {
      setFieldError(error, "Keep the decision note to 500 UTF-8 bytes or fewer.");
      reasonField?.focus();
      return;
    }

    session.approvalDecisionIds.add(id);
    form.setAttribute("aria-busy", "true");
    form.querySelectorAll("button, textarea").forEach((control) => { control.disabled = true; });
    submitter.textContent = "Saving…";
    setSourceState(ui.approvalsState, "Saving decision", "loading");
    try {
      const response = await apiRequest("decide_approval", { id, approved, reason });
      const decided = response?.approval;
      if (!decided || stringValue(decided.id) !== id || stringValue(decided.teamId) !== stringValue(team.id) || !decidedApprovalStatus(decided, approved)) {
        throw new ApiError("ApprovalService did not return the expected decided approval", 0, "invalid_response", "");
      }
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      session.approvalDecisionIds.delete(id);
      session.approvals = session.approvals.filter((candidate) => stringValue(candidate.id) !== id);
      upsertActivityProjection({
        id: `approval-decision:${id}`,
        category: "approvals",
        source: "ApprovalService decision",
        title: `${actionType.replaceAll("_", " ")} · ${approved ? "approved" : "denied"}`,
        safeSummary: stringValue(decided.safeSummary) || stringValue(approval.safeSummary),
        detail: "Decision confirmed by the authenticated ApprovalService response.",
        status: approved ? "approved" : "denied",
        sequenceLabel: "Decision",
        occurredAt: decided.decidedAt || approval.requestedAt
      });
      renderApprovalQueue();
      toast(approved ? "Approval recorded. The authorized action may proceed." : "Denial recorded with its audit note.", "success");
    } catch (caught) {
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      session.approvalDecisionIds.delete(id);
      form.removeAttribute("aria-busy");
      form.querySelectorAll("button, textarea").forEach((control) => { control.disabled = false; });
      submitter.textContent = approved ? "Approve" : "Deny";
      setFieldError(error, apiErrorMessage(caught, "The decision was not recorded. It is safe to retry."));
      setSourceState(ui.approvalsState, `${session.approvals.length} pending`, "error");
    }
  }

  function formatCanonicalMoney(money) {
    if (!money) return "Not reported";
    const currency = stringValue(money.currencyCode) || "USD";
    try {
      const units = typeof money.units === "bigint" ? money.units : BigInt(money.units || 0);
      const nanos = Number(money.nanos || 0);
      const numericUnits = Number(units);
      if (!Number.isSafeInteger(numericUnits) || !Number.isInteger(nanos)) return `${units.toString()} ${currency}`;
      return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(numericUnits + nanos / 1_000_000_000);
    } catch {
      return "Not reported";
    }
  }

  function formatCreditMicros(value) {
    try {
      const micros = typeof value === "bigint" ? value : BigInt(value || 0);
      const negative = micros < 0n;
      const absolute = negative ? -micros : micros;
      const whole = absolute / 1_000_000n;
      const fraction = (absolute % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
      return `${negative ? "−" : ""}${new Intl.NumberFormat().format(whole)}${fraction ? `.${fraction}` : ""}`;
    } catch {
      return "Not reported";
    }
  }

  function resetActivityView(message, label, tone = "") {
    session.activityEvents = [];
    session.activityEventIds = new Set();
    session.provisioningEvents = [];
    session.activityProjections = new Map();
    session.activityFilter = "all";
    session.lastActivitySequence = 0n;
    session.lastProvisioningSequence = 0n;
    ui.activityList.replaceChildren();
    ui.activityList.hidden = true;
    ui.activityEmpty.hidden = false;
    setEmptyState(ui.activityEmpty, label === "Connecting" ? "Connecting to activity" : "No activity loaded", message);
    setSourceState(ui.activityState, label, tone);
    ui.activityRetry.hidden = true;
    renderActivityFilters();
  }

  function resetSessionHistoryView(message, label, tone = "") {
    session.sessions = [];
    session.sessionIds = new Set();
    session.sessionNextPageToken = "";
    session.sessionPageTokens = new Set();
    session.sessionHistoryLoading = false;
    setSourceState(ui.sessionHistoryState, label, tone);
    ui.sessionsMore.hidden = true;
    ui.sessionsMore.disabled = false;
    ui.sessionsMore.setAttribute("aria-label", message);
    replaceActivityProjections("session-history:", []);
  }

  function resetWorkspaceHistoryView(message, label, tone = "") {
    session.workspaceChanges = [];
    session.workspaceChangeIds = new Set();
    session.workspaceNextPageToken = "";
    session.workspacePageTokens = new Set();
    session.workspaceHistoryLoading = false;
    session.lastWorkspaceSequence = 0n;
    setSourceState(ui.workspaceHistoryState, label, tone);
    ui.workspaceMore.hidden = true;
    ui.workspaceMore.disabled = false;
    ui.workspaceMore.setAttribute("aria-label", message);
    replaceActivityProjections("workspace-change:", []);
  }

  function safeOpaqueId(value, required = true) {
    if (value === undefined || value === null || value === "") return required ? "" : "";
    if (typeof value !== "string" || value !== value.trim() || value.length > 128 || /[\u0000-\u001f\u007f]/.test(value)) return "";
    return value;
  }

  function opaquePageToken(value) {
    if (value === undefined || value === null || value === "") return "";
    if (typeof value !== "string" || value.length > 4096 || /[\u0000-\u001f\u007f]/.test(value)) {
      throw new ApiError("The service returned an invalid opaque page cursor", 0, "invalid_response", "");
    }
    return value;
  }

  function sessionKindLabel(value) {
    if (typeof value === "number") return ["", "objective", "delegated"][value] || "";
    return ({
      AGENT_SESSION_KIND_OBJECTIVE: "objective",
      AGENT_SESSION_KIND_DELEGATED: "delegated"
    })[stringValue(value)] || "";
  }

  function sessionStatusLabel(value) {
    if (typeof value === "number") return ["", "started", "running", "waiting", "blocked", "paused", "succeeded", "failed", "cancelled"][value] || "";
    return ({
      AGENT_SESSION_STATUS_STARTED: "started",
      AGENT_SESSION_STATUS_RUNNING: "running",
      AGENT_SESSION_STATUS_WAITING: "waiting",
      AGENT_SESSION_STATUS_BLOCKED: "blocked",
      AGENT_SESSION_STATUS_PAUSED: "paused",
      AGENT_SESSION_STATUS_SUCCEEDED: "succeeded",
      AGENT_SESSION_STATUS_FAILED: "failed",
      AGENT_SESSION_STATUS_CANCELLED: "cancelled"
    })[stringValue(value)] || "";
  }

  function sessionHistoryEntry(record, teamId) {
    const id = safeOpaqueId(record?.id);
    const recordTeamId = safeOpaqueId(record?.teamId);
    const agentId = safeOpaqueId(record?.agentId);
    const workAssignmentId = safeOpaqueId(record?.workAssignmentId);
    const organizationId = safeOpaqueId(record?.organizationId);
    const objectiveId = safeOpaqueId(record?.objectiveId, false);
    const initiativeId = safeOpaqueId(record?.initiativeId, false);
    const repositoryId = safeOpaqueId(record?.repositoryId, false);
    const kind = sessionKindLabel(record?.sessionKind);
    const status = sessionStatusLabel(record?.sessionStatus);
    const summary = stringValue(record?.safeSummary);
    const generation = int64Value(record?.teamGeneration);
    const assignmentVersion = int64Value(record?.assignmentVersion);
    const issueNumber = int64Value(record?.githubIssueNumber);
    const pullRequestNumber = int64Value(record?.githubPullRequestNumber);
    const startedAt = timestampDate(record?.startedAt);
    const endedAt = record?.endedAt ? timestampDate(record.endedAt) : null;
    const lastObservedAt = timestampDate(record?.lastObservedAt);
    const repositoryNumericId = repositoryId ? int64Value(repositoryId) : 0n;
    if (
      !id || !agentId || !workAssignmentId || !organizationId || organizationId !== session.organizationId ||
      !recordTeamId || recordTeamId !== stringValue(teamId) || !kind || !status || !summary || summary.length > 1000 || /[\u0000-\u001f\u007f]/.test(summary) ||
      generation === null || generation <= 0n || assignmentVersion === null || assignmentVersion <= 0n ||
      issueNumber === null || pullRequestNumber === null || !startedAt || !lastObservedAt || lastObservedAt < startedAt ||
      (record?.endedAt && !endedAt) || (endedAt && endedAt < startedAt) ||
      (record?.objectiveId && !objectiveId) || (record?.initiativeId && !initiativeId) ||
      (record?.repositoryId && (!repositoryId || repositoryNumericId === null || repositoryNumericId <= 0n))
    ) throw new ApiError("SessionService returned an invalid assignment-bound lifecycle record", 0, "invalid_response", "");
    return {
      id: `session-history:${id}`,
      category: "sessions",
      source: "SessionService snapshot",
      title: `Session · ${status}`,
      safeSummary: summary,
      detail: `${kind} assignment · Agent ${agentId} · Work assignment ${workAssignmentId} v${assignmentVersion.toString()} · Team generation ${generation.toString()}`,
      status,
      sequenceLabel: "Lifecycle snapshot",
      occurredAt: record.lastObservedAt,
      sessionId: id,
      objectiveId,
      initiativeId,
      repositoryId,
      githubIssueId: issueNumber > 0n ? issueNumber.toString() : "",
      pullRequestId: pullRequestNumber > 0n ? pullRequestNumber.toString() : ""
    };
  }

  function workspaceChangeKindLabel(value) {
    if (typeof value === "number") return ["", "added", "modified", "deleted", "renamed", "copied"][value] || "";
    return ({
      WORKSPACE_CHANGE_KIND_ADDED: "added",
      WORKSPACE_CHANGE_KIND_MODIFIED: "modified",
      WORKSPACE_CHANGE_KIND_DELETED: "deleted",
      WORKSPACE_CHANGE_KIND_RENAMED: "renamed",
      WORKSPACE_CHANGE_KIND_COPIED: "copied"
    })[stringValue(value)] || "";
  }

  function workspaceDiffAvailabilityLabel(value) {
    if (typeof value === "number") return ["", "available", "binary file", "unsafe content", "oversize diff", "diff error"][value] || "";
    return ({
      WORKSPACE_DIFF_AVAILABILITY_AVAILABLE: "available",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_BINARY: "binary file",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_UNSAFE: "unsafe content",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_OVERSIZE: "oversize diff",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_ERROR: "diff error"
    })[stringValue(value)] || "";
  }

  function canonicalRelativePath(value) {
    if (typeof value !== "string" || !value || value.length > 1024 || value.startsWith("/") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return "";
    const segments = value.split("/");
    return segments.some((segment) => !segment || segment === "." || segment === "..") ? "" : value;
  }

  function validSafeDiff(value) {
    if (typeof value !== "string" || new TextEncoder().encode(value).byteLength > 4096 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return false;
    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(index + 1);
        if (next < 0xdc00 || next > 0xdfff) return false;
        index += 1;
      } else if (code >= 0xdc00 && code <= 0xdfff) return false;
    }
    return true;
  }

  function workspaceHistoryEntry(record, teamId, previousSequence) {
    const id = safeOpaqueId(record?.id);
    const recordTeamId = safeOpaqueId(record?.teamId);
    const agentId = safeOpaqueId(record?.agentId);
    const workAssignmentId = safeOpaqueId(record?.workAssignmentId);
    const sessionId = safeOpaqueId(record?.sessionId);
    const organizationId = safeOpaqueId(record?.organizationId);
    const objectiveId = safeOpaqueId(record?.objectiveId, false);
    const initiativeId = safeOpaqueId(record?.initiativeId, false);
    const repositoryId = safeOpaqueId(record?.repositoryId);
    const relativePath = canonicalRelativePath(record?.relativePath);
    const kind = workspaceChangeKindLabel(record?.changeKind);
    const availability = workspaceDiffAvailabilityLabel(record?.diffAvailability);
    const sequence = int64Value(record?.sequence);
    const generation = int64Value(record?.teamGeneration);
    const assignmentVersion = int64Value(record?.assignmentVersion);
    const additions = int64Value(record?.additions);
    const deletions = int64Value(record?.deletions);
    const issueNumber = int64Value(record?.githubIssueNumber);
    const pullRequestNumber = int64Value(record?.githubPullRequestNumber);
    const observedAt = timestampDate(record?.observedAt);
    const repositoryNumericId = int64Value(repositoryId);
    const safeDiff = typeof record?.safeDiff === "string" ? record.safeDiff : null;
    const diffRedacted = record?.diffRedacted;
    const diffTruncated = record?.diffTruncated;
    if (
      !id || !agentId || !workAssignmentId || !sessionId || !organizationId || organizationId !== session.organizationId ||
      !recordTeamId || recordTeamId !== stringValue(teamId) || !relativePath || !kind || !availability || !observedAt ||
      repositoryNumericId === null || repositoryNumericId <= 0n || generation === null || generation <= 0n || assignmentVersion === null || assignmentVersion <= 0n ||
      sequence === null || sequence <= previousSequence || additions === null || deletions === null || issueNumber === null || pullRequestNumber === null ||
      safeDiff === null || !validSafeDiff(safeDiff) || typeof diffRedacted !== "boolean" || typeof diffTruncated !== "boolean" ||
      (availability !== "available" && (safeDiff || diffRedacted || diffTruncated)) ||
      (record?.objectiveId && !objectiveId) || (record?.initiativeId && !initiativeId)
    ) throw new ApiError("WorkspaceService returned an invalid customer-safe change record", 0, "invalid_response", "");
    const diffState = availability === "available"
      ? ["server-sanitized diff available", diffRedacted ? "sensitive text redacted" : "", diffTruncated ? "diff truncated" : ""].filter(Boolean).join(" · ")
      : `diff unavailable: ${availability}`;
    return {
      id: `workspace-change:${id}`,
      category: "workspace",
      source: "WorkspaceService snapshot",
      title: `${relativePath} · ${kind}`,
      safeSummary: `${additions.toString()} additions · ${deletions.toString()} deletions · ${diffState}.`,
      detail: `Agent ${agentId} · Work assignment ${workAssignmentId} v${assignmentVersion.toString()} · Team generation ${generation.toString()}`,
      status: kind,
      sequenceLabel: `Workspace change ${sequence.toString()}`,
      sequence,
      occurredAt: record.observedAt,
      sessionId,
      objectiveId,
      initiativeId,
      repositoryId,
      githubIssueId: issueNumber > 0n ? issueNumber.toString() : "",
      pullRequestId: pullRequestNumber > 0n ? pullRequestNumber.toString() : "",
      safeDiff,
      diffAvailability: availability,
      diffRedacted,
      diffTruncated
    };
  }

  function installSnapshotEntries(prefix, entries, append) {
    if (!append) {
      replaceActivityProjections(prefix, entries);
      return;
    }
    entries.forEach((entry) => session.activityProjections.set(entry.id, entry));
    renderActivityLedger();
  }

  function renderSessionHistoryResult(result, teamId, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      setSourceState(ui.sessionHistoryState, "Unavailable", "error");
      ui.sessionsMore.hidden = !session.sessionNextPageToken;
      ui.sessionsMore.setAttribute("aria-label", apiErrorMessage(result.reason, "Session history could not be loaded."));
      return;
    }
    try {
      const records = Array.isArray(result.value?.sessions) ? result.value.sessions : [];
      if (records.length > 100) throw new ApiError("SessionService returned an oversized page", 0, "invalid_response", "");
      const localIds = new Set(session.sessionIds);
      const entries = records.map((record) => {
        const entry = sessionHistoryEntry(record, teamId);
        if (localIds.has(entry.id)) throw new ApiError("SessionService returned a duplicate session", 0, "invalid_response", "");
        localIds.add(entry.id);
        return entry;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.sessionPageTokens.has(next))) throw new ApiError("SessionService returned a repeated page cursor", 0, "invalid_response", "");
      records.forEach((record) => session.sessions.push(record));
      entries.forEach((entry) => session.sessionIds.add(entry.id));
      if (next) session.sessionPageTokens.add(next);
      session.sessionNextPageToken = next;
      installSnapshotEntries("session-history:", entries, append);
      setSourceState(ui.sessionHistoryState, session.sessions.length ? `${session.sessions.length} loaded` : "No sessions", session.sessions.length ? "success" : "");
      ui.sessionsMore.hidden = !next;
      ui.sessionsMore.disabled = false;
      ui.sessionsMore.setAttribute("aria-label", next ? "Load the next opaque SessionService snapshot page" : "All session history pages loaded");
    } catch (error) {
      if (!append) {
        session.sessions = [];
        session.sessionIds = new Set();
        replaceActivityProjections("session-history:", []);
      }
      session.sessionNextPageToken = "";
      setSourceState(ui.sessionHistoryState, "Invalid response", "error");
      ui.sessionsMore.hidden = true;
      ui.sessionsMore.setAttribute("aria-label", apiErrorMessage(error, "Session history was rejected because it was invalid."));
    }
  }

  function renderWorkspaceHistoryResult(result, teamId, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      setSourceState(ui.workspaceHistoryState, "Unavailable", "error");
      ui.workspaceMore.hidden = !session.workspaceNextPageToken;
      ui.workspaceMore.setAttribute("aria-label", apiErrorMessage(result.reason, "Workspace changes could not be loaded."));
      return;
    }
    try {
      const records = Array.isArray(result.value?.changes) ? result.value.changes : [];
      if (records.length > 100) throw new ApiError("WorkspaceService returned an oversized page", 0, "invalid_response", "");
      const localIds = new Set(session.workspaceChangeIds);
      let previousSequence = session.lastWorkspaceSequence;
      const entries = records.map((record) => {
        const entry = workspaceHistoryEntry(record, teamId, previousSequence);
        if (localIds.has(entry.id)) throw new ApiError("WorkspaceService returned a duplicate change", 0, "invalid_response", "");
        localIds.add(entry.id);
        previousSequence = entry.sequence;
        return entry;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.workspacePageTokens.has(next))) throw new ApiError("WorkspaceService returned a repeated page cursor", 0, "invalid_response", "");
      records.forEach((record) => session.workspaceChanges.push(record));
      entries.forEach((entry) => session.workspaceChangeIds.add(entry.id));
      if (entries.length) session.lastWorkspaceSequence = entries.at(-1).sequence;
      if (next) session.workspacePageTokens.add(next);
      session.workspaceNextPageToken = next;
      installSnapshotEntries("workspace-change:", entries, append);
      setSourceState(ui.workspaceHistoryState, session.workspaceChanges.length ? `${session.workspaceChanges.length} loaded` : "No changes", session.workspaceChanges.length ? "success" : "");
      ui.workspaceMore.hidden = !next;
      ui.workspaceMore.disabled = false;
      ui.workspaceMore.setAttribute("aria-label", next ? "Load the next opaque WorkspaceService snapshot page" : "All workspace change pages loaded");
    } catch (error) {
      if (!append) {
        session.workspaceChanges = [];
        session.workspaceChangeIds = new Set();
        session.lastWorkspaceSequence = 0n;
        replaceActivityProjections("workspace-change:", []);
      }
      session.workspaceNextPageToken = "";
      setSourceState(ui.workspaceHistoryState, "Invalid response", "error");
      ui.workspaceMore.hidden = true;
      ui.workspaceMore.setAttribute("aria-label", apiErrorMessage(error, "Workspace changes were rejected because they were invalid."));
    }
  }

  async function loadMoreSessions() {
    const teamId = session.selectedTeamId;
    const pageToken = session.sessionNextPageToken;
    const generation = session.workspaceGeneration;
    if (!teamId || !pageToken || session.sessionHistoryLoading) return;
    session.sessionHistoryLoading = true;
    ui.sessionsMore.disabled = true;
    setSourceState(ui.sessionHistoryState, "Loading more", "loading");
    try {
      const response = await apiRequest("sessions", { teamId, page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderSessionHistoryResult({ status: "fulfilled", value: response }, teamId, pageToken, true);
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderSessionHistoryResult({ status: "rejected", reason: error }, teamId, pageToken, true);
    } finally {
      if (generation === session.workspaceGeneration && teamId === session.selectedTeamId) {
        session.sessionHistoryLoading = false;
        ui.sessionsMore.disabled = false;
      }
    }
  }

  async function loadMoreWorkspaceChanges() {
    const teamId = session.selectedTeamId;
    const pageToken = session.workspaceNextPageToken;
    const generation = session.workspaceGeneration;
    if (!teamId || !pageToken || session.workspaceHistoryLoading) return;
    session.workspaceHistoryLoading = true;
    ui.workspaceMore.disabled = true;
    setSourceState(ui.workspaceHistoryState, "Loading more", "loading");
    try {
      const response = await apiRequest("workspace_changes", { teamId, afterSequence: "0", page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderWorkspaceHistoryResult({ status: "fulfilled", value: response }, teamId, pageToken, true);
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderWorkspaceHistoryResult({ status: "rejected", reason: error }, teamId, pageToken, true);
    } finally {
      if (generation === session.workspaceGeneration && teamId === session.selectedTeamId) {
        session.workspaceHistoryLoading = false;
        ui.workspaceMore.disabled = false;
      }
    }
  }

  function resetDeliveryRecords(message, label, tone = "") {
    session.githubIssues = [];
    session.githubIssueIds = new Set();
    session.githubIssuesNextPageToken = "";
    session.githubIssuePageTokens = new Set();
    session.githubIssuesLoading = false;
    session.githubIssuesState = label === "Loading" ? "loading" : "waiting";
    session.githubIssueLastSort = null;
    session.githubPullRequests = [];
    session.githubPullRequestIds = new Set();
    session.githubPullRequestsNextPageToken = "";
    session.githubPullRequestPageTokens = new Set();
    session.githubPullRequestsLoading = false;
    session.githubPullRequestsState = label === "Loading" ? "loading" : "waiting";
    session.githubPullRequestLastSort = null;
    session.deliveryLoadGeneration += 1;
    setSourceState(ui.deliveryHistoryState, label, tone);
    ui.deliveryHistoryState.title = message;
    ui.issuesMore.hidden = true;
    ui.issuesMore.disabled = false;
    ui.pullRequestsMore.hidden = true;
    ui.pullRequestsMore.disabled = false;
    replaceActivityProjections("github-issue:", []);
    replaceActivityProjections("github-pull-request:", []);
  }

  function resetDeliveryHistoryView(message, label, tone = "") {
    resetDeliveryRecords(message, label, tone);
    session.deliveryRepositoryId = "";
    ui.deliveryRepository.replaceChildren();
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No selected repository";
    ui.deliveryRepository.append(option);
    ui.deliveryRepository.disabled = true;
  }

  function deliveryRepositories() {
    const repositories = [];
    const seen = new Set();
    for (const repository of session.repositories) {
      if (repository?.selectedForTeams !== true) continue;
      const numericId = int64Value(repository?.githubRepositoryId);
      const owner = stringValue(repository?.owner);
      const name = stringValue(repository?.name);
      const organizationId = safeOpaqueId(repository?.organizationId);
      if (
        numericId === null || numericId <= 0n || seen.has(numericId.toString()) || organizationId !== session.organizationId ||
        !owner || owner.length > 100 || !/^[A-Za-z0-9.-]+$/.test(owner) ||
        !name || name.length > 100 || !/^[A-Za-z0-9._-]+$/.test(name)
      ) throw new ApiError("RepositoryService returned an invalid selected delivery scope", 0, "invalid_response", "");
      seen.add(numericId.toString());
      repositories.push({ id: numericId.toString(), owner, name, label: `${owner}/${name}` });
    }
    return repositories;
  }

  function configureDeliveryRepository(preferredId = "") {
    try {
      const repositories = deliveryRepositories();
      ui.deliveryRepository.replaceChildren();
      if (!repositories.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No selected repository";
        ui.deliveryRepository.append(option);
        ui.deliveryRepository.disabled = true;
        session.deliveryRepositoryId = "";
        session.githubIssuesState = "empty";
        session.githubPullRequestsState = "empty";
        setSourceState(ui.deliveryHistoryState, "No selected repositories");
        ui.deliveryHistoryState.title = "Choose at least one accessible repository in GitHub setup before loading delivery records.";
        return null;
      }
      repositories.forEach((repository) => {
        const option = document.createElement("option");
        option.value = repository.id;
        option.textContent = repository.label;
        ui.deliveryRepository.append(option);
      });
      const selected = repositories.find((repository) => repository.id === preferredId) || repositories.find((repository) => repository.id === session.deliveryRepositoryId) || repositories[0];
      session.deliveryRepositoryId = selected.id;
      ui.deliveryRepository.value = selected.id;
      ui.deliveryRepository.disabled = false;
      return selected;
    } catch (error) {
      session.deliveryRepositoryId = "";
      ui.deliveryRepository.replaceChildren();
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Repository scope unavailable";
      ui.deliveryRepository.append(option);
      ui.deliveryRepository.disabled = true;
      session.githubIssuesState = "invalid";
      session.githubPullRequestsState = "invalid";
      setSourceState(ui.deliveryHistoryState, "Invalid repository scope", "error");
      ui.deliveryHistoryState.title = apiErrorMessage(error, "The selected delivery repository scope is invalid.");
      return null;
    }
  }

  function updateDeliveryHistoryState() {
    const states = [session.githubIssuesState, session.githubPullRequestsState];
    if (!session.deliveryRepositoryId) return;
    if (states.some((state) => state === "loading")) {
      setSourceState(ui.deliveryHistoryState, "Loading", "loading");
      return;
    }
    if (states.every((state) => state === "loaded")) {
      setSourceState(ui.deliveryHistoryState, `${session.githubIssues.length} issues · ${session.githubPullRequests.length} PRs`, "success");
      ui.deliveryHistoryState.title = "GitHubDeliveryService returned both webhook-backed snapshots.";
      return;
    }
    if (states.some((state) => state === "loaded")) {
      setSourceState(ui.deliveryHistoryState, `Partial · ${session.githubIssues.length} issues · ${session.githubPullRequests.length} PRs`, "error");
      ui.deliveryHistoryState.title = "One GitHubDeliveryService projection is unavailable; no missing records are inferred.";
      return;
    }
    setSourceState(ui.deliveryHistoryState, states.includes("invalid") ? "Invalid response" : "Unavailable", "error");
    ui.deliveryHistoryState.title = "GitHubDeliveryService did not return a trustworthy issue or pull-request projection.";
  }

  function githubIssueStateLabel(value) {
    if (typeof value === "number") return ["", "open", "closed", "deleted"][value] || "";
    return ({
      GIT_HUB_ISSUE_STATE_OPEN: "open",
      GIT_HUB_ISSUE_STATE_CLOSED: "closed",
      GIT_HUB_ISSUE_STATE_DELETED: "deleted"
    })[stringValue(value)] || "";
  }

  function githubPullRequestStateLabel(value) {
    if (typeof value === "number") return ["", "open", "closed", "merged"][value] || "";
    return ({
      GIT_HUB_PULL_REQUEST_STATE_OPEN: "open",
      GIT_HUB_PULL_REQUEST_STATE_CLOSED: "closed",
      GIT_HUB_PULL_REQUEST_STATE_MERGED: "merged"
    })[stringValue(value)] || "";
  }

  function safeGitHubText(value, maximum, required = false) {
    if (value === undefined || value === null || value === "") return required ? "" : "";
    if (typeof value !== "string" || value.length > maximum || /[\u0000-\u001f\u007f]/.test(value)) return "";
    const normalized = value.trim();
    return required && !normalized ? "" : normalized;
  }

  function safeGitHubList(value, maximumItems, maximumLength) {
    if (!Array.isArray(value) || value.length > maximumItems) throw new ApiError("GitHubDeliveryService returned an invalid text list", 0, "invalid_response", "");
    const seen = new Set();
    return value.map((entry) => {
      const normalized = safeGitHubText(entry, maximumLength, true);
      if (!normalized || seen.has(normalized)) throw new ApiError("GitHubDeliveryService returned an invalid or duplicate text list value", 0, "invalid_response", "");
      seen.add(normalized);
      return normalized;
    });
  }

  function exactGitHubDeliveryUrl(value, repository, resource, number) {
    if (typeof value !== "string" || value !== value.trim()) return "";
    try {
      const url = new URL(value);
      const expectedPath = `/${repository.owner}/${repository.name}/${resource}/${number}`;
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash || url.pathname !== expectedPath) return "";
      return value;
    } catch {
      return "";
    }
  }

  function validDeliverySort(current, previous) {
    return !previous || current.createdAt < previous.createdAt || (current.createdAt === previous.createdAt && current.id.localeCompare(previous.id) < 0);
  }

  function normalizedGitHubIssue(record, repository, previousSort) {
    const id = safeOpaqueId(record?.id);
    const repositoryId = int64Value(record?.githubRepositoryId);
    const number = int64Value(record?.number);
    const comments = int64Value(record?.commentsCount);
    const title = safeGitHubText(record?.title, 256, true);
    const state = githubIssueStateLabel(record?.state);
    const stateReason = safeGitHubText(record?.stateReason, 80);
    const author = safeGitHubText(record?.authorLogin, 100);
    const assignees = safeGitHubList(record?.assigneeLogins, 100, 100);
    const labels = safeGitHubList(record?.labelNames, 100, 255);
    const createdAt = timestampDate(record?.createdAt);
    const updatedAt = timestampDate(record?.updatedAt);
    const closedAt = record?.closedAt ? timestampDate(record.closedAt) : null;
    const sort = { id, createdAt: createdAt?.getTime() || 0 };
    const artifactUrl = number === null ? "" : exactGitHubDeliveryUrl(record?.githubUrl, repository, "issues", number.toString());
    if (
      !id || repositoryId === null || repositoryId.toString() !== repository.id || number === null || number <= 0n || comments === null || comments < 0n ||
      !title || !state || !artifactUrl || typeof record?.locked !== "boolean" || !createdAt || !updatedAt || updatedAt < createdAt ||
      (record?.closedAt && (!closedAt || closedAt < createdAt)) || !validDeliverySort(sort, previousSort)
    ) throw new ApiError("GitHubDeliveryService returned an invalid issue projection", 0, "invalid_response", "");
    return {
      sort,
      entry: {
        id: `github-issue:${repository.id}:${id}`,
        category: "delivery",
        source: "GitHubDeliveryService issue snapshot",
        title: `Issue #${number.toString()} · ${title}`,
        safeSummary: `${state} · ${comments.toString()} comments${record.locked ? " · locked" : ""}.`,
        detail: [stateReason ? `Reason ${stateReason}` : "", author ? `Author ${author}` : "Author unavailable", assignees.length ? `Assignees ${assignees.join(", ")}` : "No assignees", labels.length ? `Labels ${labels.join(", ")}` : "No labels"].filter(Boolean).join(" · "),
        artifactUrl,
        status: state,
        sequenceLabel: "Webhook-backed issue snapshot",
        occurredAt: record.updatedAt,
        repositoryId: repository.id,
        githubIssueId: number.toString()
      }
    };
  }

  function normalizedGitHubPullRequest(record, repository, previousSort) {
    const id = safeOpaqueId(record?.id);
    const repositoryId = int64Value(record?.githubRepositoryId);
    const number = int64Value(record?.number);
    const title = safeGitHubText(record?.title, 256, true);
    const state = githubPullRequestStateLabel(record?.state);
    const author = safeGitHubText(record?.authorLogin, 100);
    const assignees = safeGitHubList(record?.assigneeLogins, 100, 100);
    const labels = safeGitHubList(record?.labelNames, 100, 255);
    const headRef = safeGitHubText(record?.headRef, 255, true);
    const baseRef = safeGitHubText(record?.baseRef, 255, true);
    const counterNames = ["commentsCount", "reviewCommentsCount", "commitsCount", "additions", "deletions", "changedFiles"];
    const counters = Object.fromEntries(counterNames.map((name) => [name, int64Value(record?.[name])]));
    const createdAt = timestampDate(record?.createdAt);
    const updatedAt = timestampDate(record?.updatedAt);
    const closedAt = record?.closedAt ? timestampDate(record.closedAt) : null;
    const mergedAt = record?.mergedAt ? timestampDate(record.mergedAt) : null;
    const sort = { id, createdAt: createdAt?.getTime() || 0 };
    const artifactUrl = number === null ? "" : exactGitHubDeliveryUrl(record?.githubUrl, repository, "pull", number.toString());
    if (
      !id || repositoryId === null || repositoryId.toString() !== repository.id || number === null || number <= 0n || !title || !state ||
      !artifactUrl || typeof record?.draft !== "boolean" || !headRef || !baseRef || Object.values(counters).some((value) => value === null || value < 0n) ||
      !createdAt || !updatedAt || updatedAt < createdAt || (record?.closedAt && (!closedAt || closedAt < createdAt)) ||
      (record?.mergedAt && (!mergedAt || mergedAt < createdAt)) || (state === "merged" && !mergedAt) || !validDeliverySort(sort, previousSort)
    ) throw new ApiError("GitHubDeliveryService returned an invalid pull-request projection", 0, "invalid_response", "");
    return {
      sort,
      entry: {
        id: `github-pull-request:${repository.id}:${id}`,
        category: "delivery",
        source: "GitHubDeliveryService pull-request snapshot",
        title: `PR #${number.toString()} · ${title}`,
        safeSummary: `${state}${record.draft ? " draft" : ""} · ${counters.commitsCount.toString()} commits · ${counters.changedFiles.toString()} files · +${counters.additions.toString()} / −${counters.deletions.toString()}.`,
        detail: [`${headRef} → ${baseRef}`, author ? `Author ${author}` : "Author unavailable", `${counters.commentsCount.toString()} comments`, `${counters.reviewCommentsCount.toString()} review comments`, assignees.length ? `Assignees ${assignees.join(", ")}` : "No assignees", labels.length ? `Labels ${labels.join(", ")}` : "No labels"].join(" · "),
        artifactUrl,
        status: state,
        sequenceLabel: "Webhook-backed pull-request snapshot",
        occurredAt: record.updatedAt,
        repositoryId: repository.id,
        pullRequestId: number.toString()
      }
    };
  }

  function renderGitHubIssuesResult(result, teamId, repository, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
    if (result.status === "rejected") {
      session.githubIssuesState = "unavailable";
      ui.issuesMore.hidden = !session.githubIssuesNextPageToken;
      ui.issuesMore.title = apiErrorMessage(result.reason, "Issue history is unavailable.");
      updateDeliveryHistoryState();
      return;
    }
    try {
      const records = Array.isArray(result.value?.issues) ? result.value.issues : [];
      if (records.length > 100) throw new ApiError("GitHubDeliveryService returned an oversized issue page", 0, "invalid_response", "");
      const localIds = new Set(session.githubIssueIds);
      let previousSort = session.githubIssueLastSort;
      const normalized = records.map((record) => {
        const value = normalizedGitHubIssue(record, repository, previousSort);
        if (localIds.has(value.entry.id)) throw new ApiError("GitHubDeliveryService returned a duplicate issue", 0, "invalid_response", "");
        localIds.add(value.entry.id);
        previousSort = value.sort;
        return value;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.githubIssuePageTokens.has(next))) throw new ApiError("GitHubDeliveryService returned a repeated issue cursor", 0, "invalid_response", "");
      session.githubIssues.push(...records);
      normalized.forEach((value) => session.githubIssueIds.add(value.entry.id));
      if (normalized.length) session.githubIssueLastSort = normalized.at(-1).sort;
      if (next) session.githubIssuePageTokens.add(next);
      session.githubIssuesNextPageToken = next;
      installSnapshotEntries("github-issue:", normalized.map((value) => value.entry), append);
      session.githubIssuesState = "loaded";
      ui.issuesMore.hidden = !next;
      ui.issuesMore.disabled = false;
      ui.issuesMore.title = next ? "Load the next repository- and subject-bound issue snapshot page" : "All issue snapshot pages loaded";
    } catch (error) {
      if (!append) {
        session.githubIssues = [];
        session.githubIssueIds = new Set();
        session.githubIssueLastSort = null;
        replaceActivityProjections("github-issue:", []);
      }
      session.githubIssuesNextPageToken = "";
      session.githubIssuesState = "invalid";
      ui.issuesMore.hidden = true;
      ui.issuesMore.title = apiErrorMessage(error, "Issue history was rejected because it was invalid.");
    }
    updateDeliveryHistoryState();
  }

  function renderGitHubPullRequestsResult(result, teamId, repository, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
    if (result.status === "rejected") {
      session.githubPullRequestsState = "unavailable";
      ui.pullRequestsMore.hidden = !session.githubPullRequestsNextPageToken;
      ui.pullRequestsMore.title = apiErrorMessage(result.reason, "Pull-request history is unavailable.");
      updateDeliveryHistoryState();
      return;
    }
    try {
      const records = Array.isArray(result.value?.pullRequests) ? result.value.pullRequests : [];
      if (records.length > 100) throw new ApiError("GitHubDeliveryService returned an oversized pull-request page", 0, "invalid_response", "");
      const localIds = new Set(session.githubPullRequestIds);
      let previousSort = session.githubPullRequestLastSort;
      const normalized = records.map((record) => {
        const value = normalizedGitHubPullRequest(record, repository, previousSort);
        if (localIds.has(value.entry.id)) throw new ApiError("GitHubDeliveryService returned a duplicate pull request", 0, "invalid_response", "");
        localIds.add(value.entry.id);
        previousSort = value.sort;
        return value;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.githubPullRequestPageTokens.has(next))) throw new ApiError("GitHubDeliveryService returned a repeated pull-request cursor", 0, "invalid_response", "");
      session.githubPullRequests.push(...records);
      normalized.forEach((value) => session.githubPullRequestIds.add(value.entry.id));
      if (normalized.length) session.githubPullRequestLastSort = normalized.at(-1).sort;
      if (next) session.githubPullRequestPageTokens.add(next);
      session.githubPullRequestsNextPageToken = next;
      installSnapshotEntries("github-pull-request:", normalized.map((value) => value.entry), append);
      session.githubPullRequestsState = "loaded";
      ui.pullRequestsMore.hidden = !next;
      ui.pullRequestsMore.disabled = false;
      ui.pullRequestsMore.title = next ? "Load the next repository- and subject-bound pull-request snapshot page" : "All pull-request snapshot pages loaded";
    } catch (error) {
      if (!append) {
        session.githubPullRequests = [];
        session.githubPullRequestIds = new Set();
        session.githubPullRequestLastSort = null;
        replaceActivityProjections("github-pull-request:", []);
      }
      session.githubPullRequestsNextPageToken = "";
      session.githubPullRequestsState = "invalid";
      ui.pullRequestsMore.hidden = true;
      ui.pullRequestsMore.title = apiErrorMessage(error, "Pull-request history was rejected because it was invalid.");
    }
    updateDeliveryHistoryState();
  }

  async function reloadGitHubDelivery() {
    const teamId = session.selectedTeamId;
    const repository = configureDeliveryRepository(stringValue(ui.deliveryRepository.value));
    if (!teamId || !repository) return;
    resetDeliveryRecords("Loading webhook-backed GitHub issues and pull requests.", "Loading", "loading");
    session.deliveryRepositoryId = repository.id;
    ui.deliveryRepository.value = repository.id;
    const generation = session.deliveryLoadGeneration;
    const [issuesResult, pullRequestsResult] = await Promise.allSettled([
      apiRequest("github_issues", { organizationId: session.organizationId, teamId, githubRepositoryId: repository.id, page: { pageSize: 100 } }),
      apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId, githubRepositoryId: repository.id, page: { pageSize: 100 } })
    ]);
    if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
    renderGitHubIssuesResult(issuesResult, teamId, repository, "", false);
    renderGitHubPullRequestsResult(pullRequestsResult, teamId, repository, "", false);
  }

  function currentDeliveryRepository() {
    try { return deliveryRepositories().find((repository) => repository.id === session.deliveryRepositoryId) || null; } catch { return null; }
  }

  async function loadMoreGitHubIssues() {
    const teamId = session.selectedTeamId;
    const repository = currentDeliveryRepository();
    const pageToken = session.githubIssuesNextPageToken;
    const generation = session.deliveryLoadGeneration;
    if (!teamId || !repository || !pageToken || session.githubIssuesLoading) return;
    session.githubIssuesLoading = true;
    session.githubIssuesState = "loading";
    ui.issuesMore.disabled = true;
    updateDeliveryHistoryState();
    try {
      const response = await apiRequest("github_issues", { organizationId: session.organizationId, teamId, githubRepositoryId: repository.id, page: { pageSize: 100, pageToken } });
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
      renderGitHubIssuesResult({ status: "fulfilled", value: response }, teamId, repository, pageToken, true);
    } catch (error) {
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
      renderGitHubIssuesResult({ status: "rejected", reason: error }, teamId, repository, pageToken, true);
    } finally {
      if (generation === session.deliveryLoadGeneration && repository.id === session.deliveryRepositoryId) {
        session.githubIssuesLoading = false;
        ui.issuesMore.disabled = false;
      }
    }
  }

  async function loadMoreGitHubPullRequests() {
    const teamId = session.selectedTeamId;
    const repository = currentDeliveryRepository();
    const pageToken = session.githubPullRequestsNextPageToken;
    const generation = session.deliveryLoadGeneration;
    if (!teamId || !repository || !pageToken || session.githubPullRequestsLoading) return;
    session.githubPullRequestsLoading = true;
    session.githubPullRequestsState = "loading";
    ui.pullRequestsMore.disabled = true;
    updateDeliveryHistoryState();
    try {
      const response = await apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId, githubRepositoryId: repository.id, page: { pageSize: 100, pageToken } });
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
      renderGitHubPullRequestsResult({ status: "fulfilled", value: response }, teamId, repository, pageToken, true);
    } catch (error) {
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || repository.id !== session.deliveryRepositoryId) return;
      renderGitHubPullRequestsResult({ status: "rejected", reason: error }, teamId, repository, pageToken, true);
    } finally {
      if (generation === session.deliveryLoadGeneration && repository.id === session.deliveryRepositoryId) {
        session.githubPullRequestsLoading = false;
        ui.pullRequestsMore.disabled = false;
      }
    }
  }

  function stopRuntimeActivityStream() {
    if (session.activityAbort) session.activityAbort.abort();
    session.activityAbort = null;
  }

  function stopProvisioningStream() {
    if (session.provisioningAbort) session.provisioningAbort.abort();
    session.provisioningAbort = null;
  }

  function stopActivityStream() {
    stopRuntimeActivityStream();
    stopProvisioningStream();
  }

  async function startActivityStream(teamId, generation = session.workspaceGeneration) {
    stopRuntimeActivityStream();
    if (!teamId || typeof platformApi?.streamTeamActivity !== "function") {
      resetActivityView("The generated ActivityService client is not available in this deployment.", "Unavailable", "error");
      return;
    }
    const controller = new AbortController();
    session.activityAbort = controller;
    setSourceState(ui.activityState, "Connecting", "loading");
    setEmptyState(ui.activityEmpty, "Connecting to activity", "Waiting for the server to replay customer-safe events and open the live stream.");
    ui.activityRetry.hidden = true;
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamTeamActivity({ teamId, afterSequence: session.lastActivitySequence }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const event = response?.event;
        if (!event) continue;
        if (stringValue(event.teamId) !== stringValue(teamId)) throw new ApiError("The activity service returned an event outside the selected team scope", 0, "invalid_response", requestId);
        appendActivityEvent(event);
        setSourceState(ui.activityState, "Runtime live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) {
        setSourceState(ui.activityState, "Stream ended", "error");
        ui.activityRetry.hidden = false;
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      const normalized = error?.name === "PlatformClientError"
        ? new ApiError(stringValue(error.message), Number(error.status || 0), stringValue(error.code), stringValue(error.requestId) || requestId)
        : error;
      const message = apiErrorMessage(normalized, "Live activity is unavailable.");
      setSourceState(ui.activityState, "Unavailable", "error");
      if (!allActivityEntries().length) {
        ui.activityEmpty.hidden = false;
        setEmptyState(ui.activityEmpty, "Activity unavailable", message);
      }
      ui.activityRetry.hidden = false;
    } finally {
      if (session.activityAbort === controller) session.activityAbort = null;
    }
  }

  const activityCategories = new Set(["all", "conversations", "sessions", "tools", "workspace", "delivery", "approvals", "provisioning", "cost"]);
  const runtimeActivityTypes = new Set(["a2a.message", "tool.call", "session.status", "artifact.summary"]);
  const workspaceArtifactTypes = new Set(["workspace_change", "commit", "plan", "design", "decision_record", "test_report", "deployment"]);
  const deliveryArtifactTypes = new Set(["issue", "pull_request"]);
  const activityDetailKeys = Object.freeze({
    "a2a.message": new Set(["from_agent_id", "to_agent_id", "message_kind"]),
    "tool.call": new Set(["tool_name", "result", "duration_ms"]),
    "session.status": new Set(["previous_status", "current_status", "reason_code"]),
    "artifact.summary": new Set(["artifact_type", "artifact_id", "uri", "change_kind"])
  });

  function activityDetails(event, type) {
    const details = event?.details;
    if (!details || typeof details !== "object" || Array.isArray(details)) return {};
    const allowed = activityDetailKeys[type];
    if (!allowed) return {};
    const normalized = {};
    for (const [name, value] of Object.entries(details)) {
      if (!allowed.has(name)) throw new ApiError("ActivityService returned an unexpected detail field", 0, "invalid_response", "");
      if (typeof value === "string" && value.length <= 512 && !/[\u0000-\u001f\u007f]/.test(value)) normalized[name] = value;
      else if (typeof value === "number" && Number.isFinite(value) && value >= 0) normalized[name] = value;
      else throw new ApiError("ActivityService returned an invalid detail value", 0, "invalid_response", "");
    }
    return normalized;
  }

  function canonicalArtifactUrl(value) {
    const raw = stringValue(value);
    if (!raw) return "";
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash) return "";
      return url.toString();
    } catch {
      return "";
    }
  }

  function normalizedRuntimeActivity(event) {
    const id = stringValue(event?.id);
    const type = stringValue(event?.type);
    const safeSummary = stringValue(event?.safeSummary);
    const status = stringValue(event?.status);
    const sequence = typeof event?.sequence === "bigint" ? event.sequence : BigInt(event?.sequence || 0);
    if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id) || !runtimeActivityTypes.has(type) || !safeSummary || safeSummary.length > 1000 || sequence <= 0n) {
      throw new ApiError("ActivityService returned an invalid normalized event", 0, "invalid_response", "");
    }
    const details = activityDetails(event, type);
    let category = "workspace";
    let title = "Artifact update";
    let detail = "";
    let artifactUrl = "";
    if (type === "a2a.message") {
      if (!details.from_agent_id || !details.to_agent_id || !details.message_kind) throw new ApiError("ActivityService returned incomplete A2A metadata", 0, "invalid_response", "");
      category = "conversations";
      title = `A2A ${String(details.message_kind).replaceAll("_", " ")}`;
      detail = `${details.from_agent_id} → ${details.to_agent_id}`;
    } else if (type === "tool.call") {
      if (!details.tool_name) throw new ApiError("ActivityService returned incomplete tool metadata", 0, "invalid_response", "");
      category = "tools";
      title = `Tool · ${String(details.tool_name).replaceAll("_", " ")}`;
      detail = [details.result, Number.isFinite(details.duration_ms) ? `${details.duration_ms} ms` : ""].filter(Boolean).join(" · ");
    } else if (type === "session.status") {
      if (!details.current_status) throw new ApiError("ActivityService returned incomplete session metadata", 0, "invalid_response", "");
      category = "sessions";
      title = `Session · ${String(details.current_status).replaceAll("_", " ")}`;
      detail = [details.previous_status ? `${details.previous_status} → ${details.current_status}` : details.current_status, details.reason_code].filter(Boolean).join(" · ");
    } else {
      if (!details.artifact_type || !details.artifact_id) throw new ApiError("ActivityService returned incomplete artifact metadata", 0, "invalid_response", "");
      const artifactType = String(details.artifact_type);
      if (deliveryArtifactTypes.has(artifactType)) category = "delivery";
      else if (!workspaceArtifactTypes.has(artifactType)) throw new ApiError("ActivityService returned an unsupported artifact type", 0, "invalid_response", "");
      title = `${artifactType.replaceAll("_", " ")} · ${String(details.change_kind || status || "updated").replaceAll("_", " ")}`;
      detail = String(details.artifact_id);
      artifactUrl = canonicalArtifactUrl(details.uri);
      if (details.uri && !artifactUrl) throw new ApiError("ActivityService returned an invalid artifact URL", 0, "invalid_response", "");
    }
    return {
      id: `runtime:${id}`,
      category,
      source: "ActivityService stream",
      title,
      safeSummary,
      detail,
      artifactUrl,
      status,
      sequence,
      sequenceLabel: `Activity event ${sequence.toString()}`,
      occurredAt: event.occurredAt,
      agentRole: event.agentRole,
      sessionId: stringValue(event.sessionId),
      objectiveId: stringValue(event.objectiveId),
      initiativeId: stringValue(event.initiativeId),
      repositoryId: stringValue(event.repositoryId),
      githubIssueId: stringValue(event.githubIssueId),
      pullRequestId: stringValue(event.pullRequestId)
    };
  }

  function appendActivityEvent(event) {
    const entry = normalizedRuntimeActivity(event);
    if (session.activityEventIds.has(entry.id)) return;
    if (entry.sequence <= session.lastActivitySequence) throw new ApiError("ActivityService returned a non-monotonic sequence", 0, "invalid_response", "");
    session.lastActivitySequence = entry.sequence;
    session.activityEventIds.add(entry.id);
    session.activityEvents.push(entry);
    if (session.activityEvents.length > 80) {
      const removed = session.activityEvents.shift();
      if (removed) session.activityEventIds.delete(removed.id);
    }
    renderActivityLedger();
  }

  function replaceActivityProjections(prefix, entries) {
    for (const key of session.activityProjections.keys()) {
      if (key.startsWith(prefix)) session.activityProjections.delete(key);
    }
    entries.forEach((entry) => session.activityProjections.set(entry.id, entry));
    renderActivityLedger();
  }

  function upsertActivityProjection(entry) {
    if (!entry?.id || !activityCategories.has(entry.category) || entry.category === "all") return;
    session.activityProjections.set(entry.id, entry);
    renderActivityLedger();
  }

  function activityEntryTime(entry) {
    return timestampDate(entry.occurredAt)?.getTime() || 0;
  }

  function allActivityEntries() {
    return [...session.activityEvents, ...session.provisioningEvents, ...session.activityProjections.values()]
      .sort((left, right) => activityEntryTime(right) - activityEntryTime(left) || String(right.id).localeCompare(String(left.id)));
  }

  function renderActivityFilters() {
    const entries = allActivityEntries();
    const counts = new Map([...activityCategories].map((category) => [category, category === "all" ? entries.length : entries.filter((entry) => entry.category === category).length]));
    ui.activityFilterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.activityFilter === session.activityFilter)));
    ui.activityFilterCounts.forEach((element) => { element.textContent = String(counts.get(element.dataset.activityFilterCount) || 0); });
  }

  function activityMarker(entry) {
    if (entry.source === "ActivityService stream") return agentRoleContract?.canonicalAgentRole?.(entry.agentRole)?.code || "A";
    return ({ sessions: "S", workspace: "W", approvals: "AP", provisioning: "PV", cost: "$" })[entry.category] || "·";
  }

  function renderActivityLedger() {
    renderActivityFilters();
    const allEntries = allActivityEntries();
    const entries = session.activityFilter === "all" ? allEntries : allEntries.filter((entry) => entry.category === session.activityFilter);
    ui.activityList.replaceChildren();
    entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "customer-activity-item";
    const roleMark = document.createElement("span");
    roleMark.className = "agent-ordinal";
      roleMark.textContent = activityMarker(entry);
    roleMark.setAttribute("aria-hidden", "true");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const summary = document.createElement("p");
    const meta = document.createElement("div");
    meta.className = "customer-activity-meta";
      title.textContent = stringValue(entry.title) || "Activity recorded";
      summary.textContent = stringValue(entry.safeSummary) || "The source returned a typed event without a customer-safe summary.";
      const metaValues = [entry.source, entry.source === "ActivityService stream" ? agentRoleLabel(entry.agentRole) : "", stringValue(entry.status), stringValue(entry.sequenceLabel)];
      [entry.sessionId ? `Session ${entry.sessionId}` : "", entry.objectiveId ? `Objective ${entry.objectiveId}` : "", entry.initiativeId ? `Initiative ${entry.initiativeId}` : "", entry.repositoryId ? `Repository ${entry.repositoryId}` : "", entry.githubIssueId ? `Issue ${entry.githubIssueId}` : "", entry.pullRequestId ? `PR ${entry.pullRequestId}` : ""].forEach((value) => metaValues.push(value));
      metaValues.filter(Boolean).forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      meta.append(span);
    });
      copy.append(title, summary);
      if (entry.detail) {
        const detail = document.createElement("p");
        detail.className = "customer-activity-details";
        detail.textContent = stringValue(entry.detail);
        if (entry.artifactUrl) {
          detail.append(document.createTextNode(" · "));
          const link = document.createElement("a");
          link.href = entry.artifactUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.referrerPolicy = "no-referrer";
          link.textContent = "Open verified GitHub artifact";
          detail.append(link);
        }
        copy.append(detail);
      }
      if (entry.diffAvailability) {
        const diff = document.createElement("details");
        diff.className = "safe-diff";
        const diffSummary = document.createElement("summary");
        diffSummary.textContent = entry.diffAvailability === "available" ? "Review server-sanitized diff" : `Diff unavailable · ${entry.diffAvailability}`;
        diff.append(diffSummary);
        const diffNote = document.createElement("p");
        diffNote.textContent = entry.diffAvailability === "available"
          ? ["WorkspaceService returned customer-safe text only.", entry.diffRedacted ? "Sensitive-looking values were redacted." : "", entry.diffTruncated ? "The diff was truncated at the service boundary." : ""].filter(Boolean).join(" ")
          : "WorkspaceService withheld the diff and returned this typed availability state.";
        diff.append(diffNote);
        if (entry.diffAvailability === "available" && entry.safeDiff) {
          const pre = document.createElement("pre");
          const code = document.createElement("code");
          code.textContent = entry.safeDiff;
          pre.append(code);
          diff.append(pre);
        }
        copy.append(diff);
      }
      copy.append(meta);
    const time = document.createElement("time");
      const date = timestampDate(entry.occurredAt);
    time.textContent = date ? relativeTime(date) : "Time not reported";
    if (date) time.dateTime = date.toISOString();
    item.append(roleMark, copy, time);
    ui.activityList.append(item);
    });
    ui.activityEmpty.hidden = entries.length > 0;
    ui.activityList.hidden = entries.length === 0;
    if (!entries.length && allEntries.length) {
      const filterLabel = ui.activityFilterButtons.find((button) => button.dataset.activityFilter === session.activityFilter)?.childNodes[0]?.textContent?.trim() || "selected";
      setEmptyState(ui.activityEmpty, `No ${filterLabel.toLowerCase()} activity`, "The authoritative sources returned no records in this filter.");
    } else if (!entries.length) {
      setEmptyState(ui.activityEmpty, "No activity yet", "The selected team has no customer-safe events or source snapshots yet.");
    }
  }

  function provisioningEntry(record, source, idPrefix) {
    const teamId = stringValue(record?.teamId);
    if (!teamId || teamId !== session.selectedTeamId) throw new ApiError("ProvisioningService returned a record outside the selected team scope", 0, "invalid_response", "");
    const sequence = typeof record.sequence === "bigint" ? record.sequence : BigInt(record.sequence || 0);
    const presentation = launchContract?.provisioningPresentation(record) || {};
    const label = stringValue(presentation.label) || lifecycleLabel(record.provisioningState || record.status) || "state not reported";
    const step = stringValue(presentation.step) || stringValue(record.provisioningStep || record.step).replaceAll("_", " ").toLowerCase();
    const safeSummary = stringValue(record.safeSummary) || `Provisioning is ${label}.`;
    const safeError = stringValue(record.safeError);
    if (safeSummary.length > 1000 || safeError.length > 1000 || /[\u0000-\u001f\u007f]/.test(safeSummary + safeError)) {
      throw new ApiError("ProvisioningService returned invalid customer-safe text", 0, "invalid_response", "");
    }
    return {
      id: `${idPrefix}:${stringValue(record.id) || sequence.toString() || teamId}`,
      category: "provisioning",
      source,
      title: `Provisioning · ${label}`,
      safeSummary,
      detail: [step, safeError, Number.isInteger(record.attempt) && record.attempt > 0 ? `attempt ${record.attempt}` : ""].filter(Boolean).join(" · "),
      status: label,
      sequenceLabel: sequence > 0n ? `Provisioning event ${sequence.toString()}` : "Snapshot",
      occurredAt: record.occurredAt || record.updatedAt
    };
  }

  function syncProvisioningSnapshot(team) {
    const status = team?.provisioning;
    if (!status || stringValue(team.id) !== session.selectedTeamId) {
      replaceActivityProjections("provisioning-snapshot:", []);
      return;
    }
    const entry = provisioningEntry(status, "ProvisioningService snapshot", "provisioning-snapshot");
    const sequence = typeof status.sequence === "bigint" ? status.sequence : BigInt(status.sequence || 0);
    if (sequence > session.lastProvisioningSequence) session.lastProvisioningSequence = sequence;
    replaceActivityProjections("provisioning-snapshot:", [entry]);
  }

  function appendProvisioningEvent(event) {
    const sequence = typeof event?.sequence === "bigint" ? event.sequence : BigInt(event?.sequence || 0);
    if (sequence <= session.lastProvisioningSequence) return;
    const entry = provisioningEntry(event, "ProvisioningService stream", "provisioning-event");
    session.lastProvisioningSequence = sequence;
    session.provisioningEvents.push(entry);
    if (session.provisioningEvents.length > 80) session.provisioningEvents.shift();
    renderActivityLedger();
  }

  async function startProvisioningStream(teamId, generation = session.workspaceGeneration) {
    stopProvisioningStream();
    if (!teamId || typeof platformApi?.streamProvisioningStatus !== "function") return;
    const controller = new AbortController();
    session.provisioningAbort = controller;
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamProvisioningStatus({ teamId, afterSequence: session.lastProvisioningSequence }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const status = response?.provisioning;
        const event = response?.event;
        if (status && stringValue(status.teamId) !== stringValue(teamId)) throw new ApiError("ProvisioningService returned a status outside the selected team scope", 0, "invalid_response", requestId);
        if (event && stringValue(event.teamId) !== stringValue(teamId)) throw new ApiError("ProvisioningService returned an event outside the selected team scope", 0, "invalid_response", requestId);
        if (event) appendProvisioningEvent(event);
        const team = selectedTeam();
        if (status && team) {
          team.provisioning = status;
          syncProvisioningSnapshot(team);
          renderTeamList();
          renderSelectedTeamSummary();
        }
        setSourceState(ui.activityState, session.activityAbort ? "Sources live" : "Provisioning live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) ui.activityRetry.hidden = false;
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      ui.activityRetry.hidden = false;
      if (!session.activityEvents.length && !session.provisioningEvents.length && !session.activityProjections.size) {
        setEmptyState(ui.activityEmpty, "Provisioning stream unavailable", apiErrorMessage(error, "Provisioning updates could not be streamed."));
      }
    } finally {
      if (session.provisioningAbort === controller) session.provisioningAbort = null;
    }
  }

  function changeActivityFilter(event) {
    const button = event.target.closest("[data-activity-filter]");
    const filter = stringValue(button?.dataset.activityFilter);
    if (!button || !activityCategories.has(filter)) return;
    session.activityFilter = filter;
    renderActivityLedger();
  }

  function timestampDate(timestamp) {
    if (!timestamp) return null;
    try {
      const seconds = typeof timestamp.seconds === "bigint" ? timestamp.seconds : BigInt(timestamp.seconds || 0);
      const milliseconds = Number(seconds) * 1000 + Math.floor(Number(timestamp.nanos || 0) / 1_000_000);
      const date = new Date(milliseconds);
      return Number.isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  function relativeTime(date) {
    const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (Math.abs(deltaSeconds) < 60) return formatter.format(deltaSeconds, "second");
    const minutes = Math.round(deltaSeconds / 60);
    if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function capitalize(value) {
    const text = stringValue(value);
    return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
  }

  function lifecycleLabel(value) {
    if (typeof value === "number") return ["", "pending", "active", "suspended", "deleting", "deleted", "failed"][value] || "";
    return stringValue(value).replace(/^LIFECYCLE_STATE_/, "").replaceAll("_", " ").toLowerCase();
  }

  function teamNeedsProvisioningPoll(team) {
    if (!stringValue(team?.id)) return false;
    if (team.provisioning && launchContract.provisioningTerminal(team.provisioning)) return false;
    const state = lifecycleLabel(team.state);
    return Boolean(team.provisioning) || ["pending", ""].includes(state);
  }

  function startProvisioningPolling(team, delay = 1000) {
    if (!teamNeedsProvisioningPoll(team) || provisioningTimers.has(team.id)) return;
    const timer = window.setTimeout(() => pollProvisioning(team.id), delay);
    provisioningTimers.set(team.id, timer);
  }

  async function pollProvisioning(teamId) {
    provisioningTimers.delete(teamId);
    if (!session.accessToken || document.visibilityState === "hidden") {
      const team = session.teams.find((candidate) => candidate.id === teamId);
      if (team) startProvisioningPolling(team, 5000);
      return;
    }
    const team = session.teams.find((candidate) => candidate.id === teamId);
    if (!team) return;
    try {
      let status;
      try {
        const response = await apiRequest("provisioning_status", { teamId });
        status = response.provisioning;
      } catch (error) {
        if (!(error instanceof ApiError) || !["unimplemented", "not_configured"].includes(error.code)) throw error;
        const response = await apiRequest("team", { id: teamId });
        if (response.team) {
          if (stringValue(response.team.id) !== stringValue(teamId) || stringValue(response.team.organizationId) !== session.organizationId) {
            throw new ApiError("The team service returned a resource outside the selected organization scope", 0, "invalid_response", "");
          }
          Object.assign(team, response.team);
        }
        status = response.team?.provisioning;
      }
      if (status) team.provisioning = status;
      team._pollingMessage = "";
      renderTeamList();
      if (teamId === session.selectedTeamId) {
        syncProvisioningSnapshot(team);
        renderSelectedTeamSummary();
      }
      if (!launchContract.provisioningTerminal(team.provisioning || {})) startProvisioningPolling(team, 5000);
    } catch (error) {
      team._pollingMessage = apiErrorMessage(error, "Provisioning status is temporarily unavailable. Use Refresh status to retry.");
      renderTeamList();
      if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      if (isRetryableApiError(error)) startProvisioningPolling(team, 10000);
    }
  }

  function stopProvisioningPolling() {
    provisioningTimers.forEach((timer) => window.clearTimeout(timer));
    provisioningTimers.clear();
  }

  async function startGitHubInstallation() {
    if (readGitHubCompletion()) {
      await completePendingGitHubInstallation();
      return;
    }
    ui.githubAction.disabled = true;
    try {
      const idempotencyKey = mutationKeys.for("githubStart", session.organizationId);
      const result = await apiRequest("github_install_start", { organizationId: session.organizationId, idempotencyKey });
      const destination = validatedRedirect(result.installationUrl || result.installation_url, ["github.com"]);
      if (!destination) throw new ApiError("GitHub service returned an untrusted redirect", 0, "invalid_redirect", "");
      if (!storageWrite(githubStartStorageKey, {
        organizationId: session.organizationId,
        flowId: stringValue(result.flowId),
        createdAt: Date.now()
      })) {
        throw new ApiError("This browser cannot preserve the installation handoff across redirects", 0, "secure_storage_unavailable", "");
      }
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, "The API could not start the GitHub installation. No installation completion was assumed."), "error");
      ui.githubAction.disabled = false;
    }
  }

  async function completePendingGitHubInstallation() {
    const pending = readGitHubCompletion();
    if (!pending || session.completingGitHub || !session.accessToken || !session.organizationId) return;
    if (pending.organizationId && pending.organizationId !== session.organizationId) {
      setStep("github", "error", "Wrong organization", "The installation was started for another organization available to this account. Select that organization and retry.");
      return;
    }
    session.completingGitHub = true;
    ui.githubAction.disabled = true;
    ui.githubAction.textContent = "Completing…";
    setStep("github", "loading", "Completing", "Verifying the one-time OAuth authorization and installation with GitHub. No callback credential will be displayed or retained after completion.");
    try {
      const result = await apiRequest("github_install_complete", {
        organizationId: session.organizationId,
        installationId: pending.installationId,
        setupAction: pending.setupAction,
        stateToken: pending.stateToken,
        idempotencyKey: pending.idempotencyKey,
        authorizationCode: pending.authorizationCode
      });
      if (stringValue(result.installation?.organizationId) !== session.organizationId || !launchContract.githubInstallationActive(result.installation)) {
        throw new ApiError("The API did not confirm an active GitHub installation", 0, "invalid_response", "");
      }
      session.githubInstalled = true;
      if (result.repositorySelection) session.repositorySelection = result.repositorySelection;
      clearGitHubFlow();
      toast("GitHub verified the signed-in user and active App installation.", "success");
    } catch (error) {
      ui.githubAction.textContent = "Retry completion";
      ui.githubAction.disabled = false;
      setStep("github", "error", "Not completed", apiErrorMessage(error, "The GitHub installation could not be verified. No connection was assumed."));
      if (!isRetryableApiError(error) && error?.code !== "unauthenticated") clearGitHubFlow();
      return;
    } finally {
      session.completingGitHub = false;
    }
  }

  async function saveRepositorySelection(event) {
    event.preventDefault();
    if (!session.repositoryServiceAvailable) return;
    const mode = selectedRepositoryMode();
    const ids = mode === launchContract.REPOSITORY_SELECTION_MODE.ALL ? [] : selectedRepositoryIdsFromForm();
    const fingerprint = JSON.stringify({ organizationId: session.organizationId, mode, ids: [...ids].sort(), version: String(session.repositorySelection?.version || 0) });
    ui.repositorySave.disabled = true;
    ui.repositoryRefresh.disabled = true;
    ui.repositorySave.textContent = "Saving…";
    setStep("repositories", "loading", "Saving", "Revalidating every selected repository against the active GitHub App installation.");
    try {
      const payload = launchContract.buildRepositorySelectionRequest({
        organizationId: session.organizationId,
        mode,
        githubRepositoryIds: ids,
        idempotencyKey: mutationKeys.for("repositorySelection", fingerprint),
        expectedVersion: session.repositorySelection?.version || "0"
      });
      const result = await apiRequest("update_repository_selection", payload);
      if (!result.selection || stringValue(result.selection.organizationId) !== session.organizationId) throw new ApiError("Repository service did not return a saved selection in the current organization scope", 0, "invalid_response", "");
      if (Array.isArray(result.repositories) && result.repositories.some((repository) => stringValue(repository?.organizationId) !== session.organizationId)) {
        throw new ApiError("Repository service returned a resource outside the current organization scope", 0, "invalid_response", "");
      }
      session.repositorySelection = result.selection;
      if (Array.isArray(result.repositories) && result.repositories.length) session.repositories = launchContract.accessibleRepositories(result.repositories);
      mutationKeys.clear("repositorySelection");
      renderRepositoryAccess();
      updateTeamAction();
      toast("Repository access was validated and saved by the API.", "success");
    } catch (error) {
      const message = error instanceof launchContract.LaunchContractError
        ? error.message
        : apiErrorMessage(error, "Repository access was not saved. No selection was assumed.");
      setStep("repositories", "error", "Not saved", message);
      if (error instanceof ApiError && ["aborted", "failed_precondition"].includes(error.code)) await refreshRepositoryAccess();
    } finally {
      ui.repositorySave.textContent = "Save repository access";
      ui.repositoryRefresh.disabled = false;
      updateRepositoryControls();
    }
  }

  // Settings → Manage billing opens the Stripe Customer Portal. It is available
  // only once a subscription exists (created by the first team's checkout); no
  // card is ever collected here. Team creation is what drives payment.
  async function manageBilling() {
    if (!session.subscriptionManageable) {
      toast("Billing opens after you create your first team.", "info");
      return;
    }
    ui.settingsBillingManage.disabled = true;
    try {
      const fingerprint = `${session.organizationId}:portal`;
      const idempotencyKey = mutationKeys.for("billingPortal", fingerprint);
      const result = await apiRequest("billing_portal", { organizationId: session.organizationId, returnUrl: appUrl, idempotencyKey });
      const destination = validatedRedirect(result.portalUrl || result.portal_url, ["billing.stripe.com"]);
      if (!destination) throw new ApiError("Billing service returned an untrusted portal redirect", 0, "invalid_redirect", "");
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, "The API could not open the Stripe billing portal."), "error");
      ui.settingsBillingManage.disabled = false;
    }
  }

  function embeddedCheckoutReturnUrl() {
    return `${appUrl}?billing=return&session_id={CHECKOUT_SESSION_ID}`;
  }

  function validCheckoutClientSecret(value) {
    const secret = stringValue(value);
    // Stripe's embedded_page Checkout client secret embeds a URL-encoded return
    // URL, so it is long (~400+ chars) and contains characters beyond
    // [A-Za-z0-9_] such as "%". Guard on the prefix, a sane length, and the
    // absence of unsafe characters (whitespace, control, quotes, angle brackets,
    // backslash) rather than an over-strict charset that rejects valid secrets.
    if (secret.length < 16 || secret.length > 2048) return "";
    if (!/^cs_(?:test|live)_/.test(secret)) return "";
    if (/[\s<>"\'`\\]/.test(secret)) return "";
    if (environment === "development" && !secret.startsWith("cs_test_")) return "";
    if (environment === "production" && !secret.startsWith("cs_live_")) return "";
    return secret;
  }

  function validateEmbeddedSession(result, returnUrl) {
    if (!validCheckoutClientSecret(result?.clientSecret)) throw new ApiError("Billing service returned an invalid embedded Checkout secret", 0, "invalid_response", "");
    if (stringValue(result?.returnUrl) !== returnUrl) throw new ApiError("Billing service returned an unexpected Checkout return URL", 0, "invalid_response", "");
    if (!/^cs_(?:test|live)_[A-Za-z0-9_]{8,}$/.test(stringValue(result?.checkoutSessionId))) throw new ApiError("Billing service returned an invalid Checkout Session", 0, "invalid_response", "");
    if (stringValue(result?.checkoutUrl)) throw new ApiError("Billing service returned a hosted Checkout URL for an embedded flow", 0, "invalid_response", "");
  }

  async function openEmbeddedCheckout({ clientSecret, kind, mutationName, title, subtitle, summary, teamId = "" }) {
    await ensureStripe();
    if (!stripeClient || typeof stripeClient.initEmbeddedCheckout !== "function") throw new ApiError("Embedded Stripe Checkout is unavailable", 0, "not_configured", "");
    if (checkoutOpening) throw new ApiError("Embedded Checkout is already opening", 0, "already_opening", "");
    if (embeddedCheckout) closeEmbeddedCheckout();
    checkoutOpening = true;
    renderCreditPackControls();
    ui.checkoutTitle.textContent = title;
    ui.checkoutSubtitle.textContent = subtitle;
    ui.checkoutSummary.textContent = summary;
    ui.checkoutStatus.textContent = "Preparing encrypted payment fields…";
    ui.checkoutStatus.hidden = false;
    ui.checkoutMount.replaceChildren();
    // Embedded Checkout renders its own submit control, so the form's button stays
    // hidden; only the custom Payment Element (team subscription) uses it.
    if (ui.checkoutForm) ui.checkoutForm.hidden = false;
    if (ui.checkoutSubmit) ui.checkoutSubmit.hidden = true;
    if (!ui.checkoutDialog.open) ui.checkoutDialog.showModal();
    const safeSecret = validCheckoutClientSecret(clientSecret);
    if (!safeSecret) throw new ApiError("Embedded Checkout secret is invalid", 0, "invalid_response", "");
    try {
      embeddedCheckout = await stripeClient.initEmbeddedCheckout({
        fetchClientSecret: async () => safeSecret,
        onComplete: () => { void handleEmbeddedCheckoutComplete(kind, mutationName, teamId); }
      });
      embeddedCheckout.mount(ui.checkoutMount);
      ui.checkoutStatus.hidden = true;
    } catch (error) {
      embeddedCheckout = null;
      ui.checkoutStatus.textContent = "Stripe could not render the secure payment form. Close this panel and retry.";
      ui.checkoutStatus.hidden = false;
      throw error;
    } finally {
      checkoutOpening = false;
      renderCreditPackControls();
    }
  }

  function destroyEmbeddedCheckout() {
    if (embeddedCheckout) {
      try { embeddedCheckout.destroy(); } catch { /* Stripe may already have completed the frame */ }
    }
    embeddedCheckout = null;
    teamPaymentElements = null;
    checkoutTeamId = "";
    if (ui.checkoutForm) ui.checkoutForm.hidden = true;
    if (ui.checkoutError) setFieldError(ui.checkoutError, "");
    ui.checkoutMount.replaceChildren();
  }

  // The team subscription uses a custom Stripe Payment Element (card fields in
  // deep navy's own dark UI), styled to the brand with the Appearance API. The
  // browser confirms the invoice's confirmation secret; the signed webhook
  // provisions the pending team. This replaces Stripe's hosted embedded Checkout.
  function validPaymentClientSecret(value) {
    const secret = stringValue(value);
    if (secret.length < 16 || secret.length > 2048) return "";
    if (!/^(?:pi|seti)_[A-Za-z0-9]+_secret_/.test(secret)) return "";
    if (/[\s<>"'`\\]/.test(secret)) return "";
    return secret;
  }

  function teamCheckoutAppearance() {
    return {
      theme: "night",
      variables: {
        colorPrimary: "#79f2d2",
        colorBackground: "#050a10",
        colorText: "#f4f7f5",
        colorTextSecondary: "#9aa6aa",
        colorDanger: "#ff6b6b",
        borderRadius: "8px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
        fontSizeBase: "15px",
        spacingUnit: "3px"
      },
      rules: {
        ".Input": { backgroundColor: "#02060b", border: "1px solid rgba(244,247,245,0.14)" },
        ".Input:focus": { border: "1px solid #79f2d2", boxShadow: "none" },
        ".Label": { color: "#9aa6aa" },
        ".Tab": { border: "1px solid rgba(244,247,245,0.14)" },
        ".Tab--selected": { borderColor: "#79f2d2" }
      }
    };
  }

  async function openTeamPaymentElement({ clientSecret, teamId, title, subtitle, summary }) {
    await ensureStripe();
    if (!stripeClient || typeof stripeClient.elements !== "function") throw new ApiError("Stripe Elements is unavailable", 0, "not_configured", "");
    const secret = validPaymentClientSecret(clientSecret);
    if (!secret) throw new ApiError("Billing service returned an invalid payment secret for the first team", 0, "invalid_response", "");
    if (checkoutOpening) throw new ApiError("Checkout is already opening", 0, "already_opening", "");
    destroyEmbeddedCheckout();
    checkoutOpening = true;
    ui.checkoutTitle.textContent = title;
    ui.checkoutSubtitle.textContent = subtitle;
    ui.checkoutSummary.textContent = summary;
    ui.checkoutStatus.textContent = "Loading the secure card fields…";
    ui.checkoutStatus.hidden = false;
    ui.checkoutMount.replaceChildren();
    setFieldError(ui.checkoutError, "");
    ui.checkoutForm.hidden = false;
    ui.checkoutSubmit.hidden = false;
    ui.checkoutSubmit.disabled = true;
    ui.checkoutSubmit.textContent = "Start subscription";
    checkoutTeamId = stringValue(teamId);
    if (!ui.checkoutDialog.open) ui.checkoutDialog.showModal();
    try {
      teamPaymentElements = stripeClient.elements({ clientSecret: secret, appearance: teamCheckoutAppearance() });
      const paymentElement = teamPaymentElements.create("payment", { layout: "tabs" });
      paymentElement.on("ready", () => { ui.checkoutStatus.hidden = true; ui.checkoutSubmit.disabled = false; });
      paymentElement.on("loaderror", () => {
        ui.checkoutStatus.textContent = "Stripe could not load the payment fields. Close this panel and retry.";
        ui.checkoutStatus.hidden = false;
      });
      paymentElement.mount(ui.checkoutMount);
    } catch (error) {
      teamPaymentElements = null;
      ui.checkoutStatus.textContent = "Stripe could not load the payment fields. Close this panel and retry.";
      ui.checkoutStatus.hidden = false;
      throw error;
    } finally {
      checkoutOpening = false;
    }
  }

  async function submitTeamPayment(event) {
    event.preventDefault();
    if (!teamPaymentElements || !stripeClient) return;
    const teamId = checkoutTeamId;
    ui.checkoutSubmit.disabled = true;
    ui.checkoutSubmit.textContent = "Processing…";
    setFieldError(ui.checkoutError, "");
    try {
      const outcome = await stripeClient.confirmPayment({
        elements: teamPaymentElements,
        confirmParams: { return_url: `${appUrl}?billing=return` },
        redirect: "if_required"
      });
      if (outcome?.error) {
        setFieldError(ui.checkoutError, stringValue(outcome.error.message) || "Your card could not be charged. Check the details and try again.");
        ui.checkoutSubmit.disabled = false;
        ui.checkoutSubmit.textContent = "Start subscription";
        return;
      }
      // Payment confirmed without a redirect. The signed invoice.paid webhook
      // provisions the pending team; poll until it is active.
      ui.checkoutStatus.textContent = "Payment confirmed. Provisioning your team…";
      ui.checkoutStatus.hidden = false;
      closeEmbeddedCheckout();
      if (teamId) startPendingTeamPoll(teamId, 1500);
      toast("Payment confirmed. Your team is being provisioned.", "success");
    } catch {
      setFieldError(ui.checkoutError, "Payment could not be completed. Close this panel and try again.");
      ui.checkoutSubmit.disabled = false;
      ui.checkoutSubmit.textContent = "Start subscription";
    }
  }

  function closeEmbeddedCheckout() {
    destroyEmbeddedCheckout();
    checkoutOpening = false;
    if (ui.checkoutDialog.open) ui.checkoutDialog.close();
    updateTeamAction();
    renderSettingsBilling();
    renderCreditPackControls();
  }

  async function handleEmbeddedCheckoutComplete(kind, mutationName, teamId) {
    destroyEmbeddedCheckout();
    mutationKeys.clear(mutationName);
    ui.checkoutStatus.textContent = "Payment submitted. Verifying Stripe’s signed webhook before changing access or credits…";
    ui.checkoutStatus.hidden = false;
    if (kind === "team") {
      // The first team's card is now saved; the pending team provisions only
      // after the signed Stripe webhook confirms payment. Poll GetTeam for it.
      const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (team) {
        team._pollingMessage = "Payment received. Waiting for the signed Stripe webhook to provision the team.";
        renderTeamList();
        if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      }
      startPendingTeamPoll(teamId, 1500);
      ui.checkoutStatus.textContent = "Payment submitted. This panel never grants access; the verified webhook provisions your team.";
      toast("Payment submitted. Your team provisions after the signed Stripe webhook confirms it.", "info");
      return;
    }
    try {
      if (teamId === session.selectedTeamId) await refreshSelectedTeam();
    } catch {
      /* The normal refresh controls remain available if reconciliation is delayed. */
    }
    ui.checkoutStatus.textContent = "Payment is processing. This panel never grants access or credits; the verified webhook does.";
    toast("Payment submitted. Webhook-confirmed credits will appear in the selected team ledger.", "info");
  }

  async function startCreditPackCheckout(event) {
    event.preventDefault();
    const team = selectedTeam();
    const pack = selectedCreditPack();
    const quantity = int64Value(ui.creditPackQuantity.value);
    const maximum = int64Value(pack?.maximumQuantity);
    setFieldError(ui.creditPackError, "");
    if (!session.subscriptionActive || !team || !pack || !activeCreditPack(pack) || quantity === null || maximum === null || quantity < 1n || quantity > maximum) {
      setFieldError(ui.creditPackError, "Choose an active team, a prepaid pack, and a valid quantity.");
      return;
    }
    await ensureStripe();
    if (!stripeClient) {
      setFieldError(ui.creditPackError, "Secure checkout is not configured in this deployment.");
      return;
    }
    ui.creditPackSubmit.disabled = true;
    const returnUrl = embeddedCheckoutReturnUrl();
    const fingerprint = `${session.organizationId}:${team.id}:${pack.id}:${quantity.toString()}`;
    try {
      const result = await apiRequest("credit_pack_checkout", {
        organizationId: session.organizationId,
        teamId: team.id,
        creditPackId: pack.id,
        quantity: quantity.toString(),
        returnUrl,
        idempotencyKey: mutationKeys.for("creditPackCheckout", fingerprint)
      });
      validateEmbeddedSession(result, returnUrl);
      await openEmbeddedCheckout({
        clientSecret: result.clientSecret,
        kind: "credit_pack",
        mutationName: "creditPackCheckout",
        teamId: team.id,
        title: "Add prepaid engineering credits",
        subtitle: `Apply purchased credits only to ${stringValue(team.name) || "the selected team"}.`,
        summary: `${quantity.toString()} × ${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)} each`
      });
    } catch (error) {
      const message = apiErrorMessage(error, "The API could not create a prepaid credit Checkout Session. No purchase was started.");
      setFieldError(ui.creditPackError, message);
      toast(message, "error");
      ui.creditPackSubmit.disabled = false;
    }
  }

  function validatedRedirect(value, requiredHosts) {
    try {
      const url = new URL(stringValue(value));
      if (url.protocol !== "https:" || url.username || url.password || url.hash) return "";
      const allowed = new Set(requiredHosts.map(stringValue).filter(Boolean));
      const hostAccepted = allowed.has(url.host);
      return hostAccepted ? url.toString() : "";
    } catch {
      return "";
    }
  }

  const REQUEST_TEAM_SETTLEMENT = Object.freeze({
    CHECKOUT_REQUIRED: "checkout_required",
    CHARGED_OFF_SESSION: "charged_off_session",
    AUTHENTICATION_REQUIRED: "authentication_required"
  });

  function requestTeamSettlement(value) {
    if (typeof value === "number") return ["unspecified", "checkout_required", "charged_off_session", "authentication_required"][value] || "unspecified";
    return stringValue(value).replace(/^REQUEST_TEAM_SETTLEMENT_/, "").toLowerCase();
  }

  // Creating a team is the paid action. RequestTeam captures the pending team and
  // returns how it is settled: the first team collects + saves a card via
  // embedded Checkout; subsequent teams charge the saved card off-session (or
  // require 3-D Secure). The team is provisioned only by the signed Stripe
  // webhook, so every path polls GetTeam until the pending team goes active.
  async function createTeam(event) {
    event.preventDefault();
    const form = new FormData(ui.teamForm);
    const name = stringValue(form.get("teamName"));
    const objective = stringValue(form.get("teamObjective")).slice(0, 2000);
    const engineerCount = normalizeEngineerCount(form.get("engineerCount"));
    setFieldError(ui.teamError, "");
    if (name.length < 2 || name.length > 80) {
      setFieldError(ui.teamError, "Enter a team name between 2 and 80 characters.");
      ui.teamInput.focus();
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositorySelectionReady: session.repositorySelectionReady
    });
    if (missing.length) {
      const message = `Complete ${missing.join(", ")} before team creation.`;
      setFieldError(ui.teamError, message);
      toast(message, "error");
      return;
    }
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.teamSubmit.textContent = "Requesting…";
    try {
      const fingerprint = `${session.organizationId}:${name.toLowerCase()}:${engineerCount}:${objective}`;
      const result = await apiRequest("request_team", {
        organizationId: session.organizationId,
        name,
        idempotencyKey: mutationKeys.for("requestTeam", fingerprint),
        engineerCount,
        objective
      });
      const pending = result.pendingTeam || result.pending_team;
      if (!pending?.id || stringValue(pending.organizationId) !== session.organizationId) {
        throw new ApiError("Team service did not return a pending team in the current organization scope", 0, "invalid_response", "");
      }
      const settlement = requestTeamSettlement(result.settlement);
      // Reflect the pending team immediately; the webhook provisions it.
      session.teamServiceAvailable = true;
      const existing = session.teams.find((team) => stringValue(team.id) === stringValue(pending.id));
      if (existing) Object.assign(existing, pending);
      else session.teams = [pending, ...session.teams];
      renderTeamList();
      renderTeamSelector(pending.id);
      renderSettingsBilling();
      ui.teamForm.reset();
      renderTeamSetupPricing();

      const pricing = teamPricingFor(engineerCount);
      if (settlement === REQUEST_TEAM_SETTLEMENT.CHECKOUT_REQUIRED) {
        await ensureStripe();
        if (!stripeClient) throw new ApiError("Stripe is not configured for this deployment", 0, "not_configured", "");
        await openTeamPaymentElement({
          clientSecret: result.checkoutClientSecret || result.checkout_client_secret,
          teamId: stringValue(pending.id),
          title: "Start your team subscription",
          subtitle: `Enter your card to start the ${formatCents(pricing.totalCents)}/month team subscription. It is saved and reused for every additional team.`,
          summary: `${stringValue(pending.name) || name} · ${pricingBreakdown(pricing)} · card saved for future teams`
        });
        toast(`Team “${stringValue(pending.name) || name}” is pending. Enter your card to provision it.`, "info");
      } else if (settlement === REQUEST_TEAM_SETTLEMENT.CHARGED_OFF_SESSION) {
        const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(pending.id));
        if (team) { team._pollingMessage = "Card on file charged. Waiting for the signed webhook to provision the team."; renderTeamList(); }
        startPendingTeamPoll(pending.id, 1500);
        toast(`The saved card was charged for “${stringValue(pending.name) || name}”. Provisioning starts after the signed webhook confirms payment.`, "success");
      } else if (settlement === REQUEST_TEAM_SETTLEMENT.AUTHENTICATION_REQUIRED) {
        const destination = validatedRedirect(result.authenticationUrl || result.authentication_url, ["invoice.stripe.com"]);
        if (!destination) throw new ApiError("Billing service returned an untrusted authentication URL", 0, "invalid_redirect", "");
        const opened = window.open(destination, "_blank", "noopener,noreferrer");
        const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(pending.id));
        if (team) { team._pollingMessage = "Authenticate the payment in the opened Stripe tab; the team provisions once it clears."; renderTeamList(); }
        startPendingTeamPoll(pending.id, 3000);
        toast(opened
          ? "Authenticate the payment in the new Stripe tab. The team provisions once the charge clears."
          : "Allow pop-ups, then reopen this action to authenticate the payment for this team.", "info");
      } else {
        throw new ApiError("Team service returned an unrecognized settlement for the requested team", 0, "invalid_response", "");
      }
      // Switch the live workspace to the pending team; a workspace load error
      // must not mask the successful team request.
      try { await refreshSelectedTeam(); } catch { /* workspace loads recover on their own */ }
    } catch (error) {
      const message = apiErrorMessage(error, "The team was not confirmed as requested. It is safe to retry; the request uses an idempotency key.");
      setFieldError(ui.teamError, message);
      toast(message, "error");
      if (error instanceof ApiError && ["failed_precondition", "resource_exhausted"].includes(error.code)) await refreshOnboarding();
    } finally {
      ui.teamSubmit.textContent = "Create engineering team";
      updateTeamAction();
    }
  }

  function startPendingTeamPoll(teamId, delay = 2500) {
    const id = stringValue(teamId);
    if (!id || pendingTeamTimers.has(id)) return;
    const timer = window.setTimeout(() => pollPendingTeam(id), delay);
    pendingTeamTimers.set(id, timer);
  }

  function stopPendingTeamPolling() {
    pendingTeamTimers.forEach((timer) => window.clearTimeout(timer));
    pendingTeamTimers.clear();
  }

  async function pollPendingTeam(teamId) {
    pendingTeamTimers.delete(teamId);
    if (!session.accessToken) return;
    if (document.visibilityState === "hidden") { startPendingTeamPoll(teamId, 5000); return; }
    try {
      const response = await apiRequest("team", { id: teamId });
      const team = response.team;
      if (!team || stringValue(team.id) !== stringValue(teamId) || stringValue(team.organizationId) !== session.organizationId) {
        throw new ApiError("The team service returned a resource outside the selected organization scope", 0, "invalid_response", "");
      }
      const target = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (target) { Object.assign(target, team); target._pollingMessage = ""; }
      else session.teams = [team, ...session.teams];
      const lifecycle = lifecycleLabel(team.state);
      const provisioning = team.provisioning ? launchContract.provisioningPresentation(team.provisioning) : null;
      const activated = lifecycle === "active" || provisioning?.state === launchContract.PROVISIONING_STATE.SUCCEEDED;
      const failed = lifecycle === "failed" || Boolean(provisioning?.failed);
      renderTeamList();
      renderSettingsBilling();
      if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      if (activated) {
        mutationKeys.clear("requestTeam");
        toast(`Team “${stringValue(team.name) || "the team"}” is provisioned and billing is active.`, "success");
        await refreshOnboarding();
        return;
      }
      if (failed) {
        const stalled = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
        if (stalled) { stalled._pollingMessage = "Provisioning failed. Delete this team and try again, or contact support."; renderTeamList(); }
        return;
      }
      if (lifecycle === "pending" || lifecycle === "" || Boolean(team.provisioning)) {
        const waiting = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
        if (waiting && !stringValue(waiting._pollingMessage)) {
          waiting._pollingMessage = "Waiting for the signed Stripe webhook to confirm payment and provision the team.";
          renderTeamList();
        }
        startPendingTeamPoll(teamId, 5000);
      } else {
        // Left pending into another lifecycle (e.g. suspended); hand off to the
        // standard provisioning poll and stop pending polling.
        startProvisioningPolling(team);
      }
    } catch (error) {
      const stalled = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (stalled) { stalled._pollingMessage = apiErrorMessage(error, "The team status is temporarily unavailable. Retrying."); renderTeamList(); }
      if (isRetryableApiError(error)) startPendingTeamPoll(teamId, 8000);
    }
  }

  function toast(message, tone) {
    ui.toast.textContent = message;
    ui.toast.dataset.tone = tone || "info";
    ui.toast.hidden = false;
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => { ui.toast.hidden = true; }, 9000);
  }

  function setFieldError(element, message) {
    if (!element) return;
    element.textContent = stringValue(message);
    element.hidden = !element.textContent;
  }

  async function signOut() {
    closeEmbeddedCheckout();
    stopProvisioningPolling();
    stopPendingTeamPolling();
    stopActivityStream();
    const revokedToken = session.accessToken;
    session.accessToken = "";
    session.claims = {};
    session.user = null;
    session.organizationId = "";
    session.organizationName = "";
    session.members = [];
    session.selectedTeamId = "";
    session.teams = [];
    session.subscription = null;
    session.subscriptionActive = false;
    session.subscriptionManageable = false;
    session.creditPacks = [];
    session.creditControl = null;
    resetInvoiceHistory("Sign in and select an organization to load verified billing records.", "Waiting");
    resetSubscriptionCapacity();
    renderSettingsAccount();
    renderSettingsBilling();
    session.objectivesByTeam.clear();
    session.objectiveListsByTeam.clear();
    resetApprovalView("Sign in and select a team to load pending decisions.", "Waiting");
    ui.contextOrganization.textContent = "Not selected";
    ui.contextRepositories.textContent = "Not loaded";
    ui.contextTeam.textContent = "Not selected";
    resetWorkspaceViews("Sign in and select a team to load its workspace.");
    setAuthPhase("signed_out");
    clearSignInTransaction();
    clearGitHubFlow();
    storageRemove(billingReturnStorageKey);
    // Revoke the session server-side (best effort); a failure never blocks the
    // local sign-out or the redirect back into the app.
    if (revokedToken && platformApi) {
      const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        await platformApi.request("sign_out", {}, { accessToken: revokedToken, requestId, signal: controller.signal });
      } catch {
        /* Server-side revocation failure is non-fatal to local sign-out. */
      } finally {
        window.clearTimeout(timeout);
      }
    }
    window.location.assign(appPath);
  }

  ui.signIn.addEventListener("click", () => beginSignIn());
  ui.retrySignIn.addEventListener("click", () => beginSignIn());
  ui.signOut.addEventListener("click", signOut);
  if (ui.organizationConnect) ui.organizationConnect.addEventListener("click", () => beginSignIn("installation"));
  ui.organizationBootstrapForm.addEventListener("submit", bootstrapOrganization);
  ui.organizationSelectForm.addEventListener("submit", selectOrganization);
  ui.profileRetry.addEventListener("click", initializeAuthenticatedSession);
  ui.githubAction.addEventListener("click", startGitHubInstallation);
  ui.repositoryForm.addEventListener("submit", saveRepositorySelection);
  ui.repositoryRefresh.addEventListener("click", refreshRepositoryAccess);
  ui.repositoryModes.forEach((input) => input.addEventListener("change", updateRepositoryControls));
  ui.repositoryList.addEventListener("change", updateRepositoryControls);
  ui.settingsBillingManage.addEventListener("click", manageBilling);
  ui.invoiceMore.addEventListener("click", loadMoreInvoices);
  ui.creditPackForm.addEventListener("submit", startCreditPackCheckout);
  ui.creditPackSelect.addEventListener("change", updateCreditPackSummary);
  ui.creditPackQuantity.addEventListener("input", updateCreditPackSummary);
  ui.creditControlForm.addEventListener("submit", saveCreditControl);
  ui.economicsGroup.addEventListener("change", selectEconomicsGroup);
  ui.creditHardLimitInput.addEventListener("input", updateCreditControlSummary);
  ui.creditCustomerPaused.addEventListener("change", updateCreditControlSummary);
  if (ui.checkoutForm) ui.checkoutForm.addEventListener("submit", submitTeamPayment);
  ui.checkoutClose.addEventListener("click", closeEmbeddedCheckout);
  ui.checkoutDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeEmbeddedCheckout();
  });
  ui.teamForm.addEventListener("submit", createTeam);
  if (ui.engineerInput) {
    ui.engineerInput.addEventListener("input", renderTeamSetupPricing);
    ui.engineerInput.addEventListener("change", () => { ui.engineerInput.value = String(normalizeEngineerCount(ui.engineerInput.value)); renderTeamSetupPricing(); });
  }
  if (ui.engineerDecrement) ui.engineerDecrement.addEventListener("click", () => stepEngineerInput(ui.engineerInput, -1, renderTeamSetupPricing));
  if (ui.engineerIncrement) ui.engineerIncrement.addEventListener("click", () => stepEngineerInput(ui.engineerInput, 1, renderTeamSetupPricing));
  if (ui.settingsEngineerInput) {
    ui.settingsEngineerInput.addEventListener("input", syncEngineerControl);
    ui.settingsEngineerInput.addEventListener("change", () => { ui.settingsEngineerInput.value = String(normalizeEngineerCount(ui.settingsEngineerInput.value)); syncEngineerControl(); });
  }
  if (ui.settingsEngineerDecrement) ui.settingsEngineerDecrement.addEventListener("click", () => stepEngineerInput(ui.settingsEngineerInput, -1, syncEngineerControl));
  if (ui.settingsEngineerIncrement) ui.settingsEngineerIncrement.addEventListener("click", () => stepEngineerInput(ui.settingsEngineerInput, 1, syncEngineerControl));
  if (ui.settingsEngineerApply) ui.settingsEngineerApply.addEventListener("click", applyEngineerCount);
  ui.teamList.addEventListener("click", handleTeamLifecycleClick);
  ui.objectiveForm.addEventListener("submit", createObjective);
  ui.objectiveSelect.addEventListener("change", selectObjective);
  ui.approvalList.addEventListener("submit", decideApproval);
  ui.approvalsMore.addEventListener("click", loadMoreApprovals);
  ui.sessionsMore.addEventListener("click", loadMoreSessions);
  ui.workspaceMore.addEventListener("click", loadMoreWorkspaceChanges);
  ui.deliveryRepository.addEventListener("change", reloadGitHubDelivery);
  ui.issuesMore.addEventListener("click", loadMoreGitHubIssues);
  ui.pullRequestsMore.addEventListener("click", loadMoreGitHubPullRequests);
  ui.refresh.addEventListener("click", refreshOnboarding);
  ui.teamSelect.addEventListener("change", () => {
    session.selectedTeamId = stringValue(ui.teamSelect.value);
    refreshSelectedTeam();
  });
  ui.activityFilters.addEventListener("click", changeActivityFilter);
  ui.activityRetry.addEventListener("click", () => {
    const team = selectedTeam();
    if (team) {
      startActivityStream(team.id, session.workspaceGeneration);
      startProvisioningStream(team.id, session.workspaceGeneration);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    session.teams.forEach((team) => {
      if (lifecycleLabel(team.state) === "pending") startPendingTeamPoll(team.id, 250);
      else startProvisioningPolling(team, 250);
    });
  });
  window.addEventListener("beforeunload", () => {
    destroyEmbeddedCheckout();
    stopProvisioningPolling();
    stopPendingTeamPolling();
    stopActivityStream();
  });

  setAuthPhase("signed_out");
  renderProgressSummary();
  renderTeamSetupPricing();
  renderEngineerControl();
  renderConfiguration();
  const initialQuery = typeof window.deepNavyInitialQuery === "string" ? window.deepNavyInitialQuery : window.location.search;
  try { delete window.deepNavyInitialQuery; } catch { window.deepNavyInitialQuery = ""; }
  const callbackParams = new URLSearchParams(initialQuery);
  const githubCallback = document.body.dataset.githubCallback === "true" || callbackParams.has("installation_id") || callbackParams.has("setup_action");
  const billingReturn = captureBillingReturn(callbackParams);
  stripCallbackQuery();

  if (githubCallback) {
    // The GitHub App "install & authorize" round trip lands here. A "sign_in"
    // transaction (and no in-memory session yet) means this is a sign-in: bind
    // the one-time GitHub authorization to a platform session. Otherwise it is a
    // signed-in user's repository-management install completing the usual way.
    const signInTransaction = readSignInTransaction();
    try {
      if (!launchContract) throw new Error("launch_contract_unavailable");
      const callback = launchContract.parseGitHubCallback(callbackParams, { forceGitHub: document.body.dataset.githubCallback === "true" });
      if (!callback) throw new Error("github_callback_missing");
      if (signInTransaction && !session.accessToken) {
        completeSignInCallback(callback);
      } else if (captureGitHubCallback(callbackParams)) {
        setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub returned securely", "Sign in with GitHub to bind this one-time authorization to your account and organization.");
      } else {
        throw new Error("github_callback_missing");
      }
    } catch (error) {
      clearSignInTransaction();
      clearGitHubFlow();
      const message = launchContract && error instanceof launchContract.LaunchContractError
        ? error.message
        : "The GitHub callback could not be validated in this browser. Start sign-in again.";
      showAuthError("Sign-in was not completed", message);
    }
  } else if (readGitHubCompletion()) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub completion is waiting", "Sign in with GitHub again before the one-time authorization expires. deep navy verifies it server-side before showing a connection.");
  } else if (billingReturn) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "warning", "Confirm your payment", "Sign in to refresh the webhook-confirmed subscription and team credit records. A Stripe return alone never changes access or balances.");
  }
})();
