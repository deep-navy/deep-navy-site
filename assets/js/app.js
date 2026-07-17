(() => {
  "use strict";

  const config = window.deepNavyRuntime || {};
  const ui = {
    environment: document.querySelector("[data-environment]"),
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
    userSummary: document.querySelector("[data-user-summary]"),
    userInitial: document.querySelector("[data-user-initial]"),
    userName: document.querySelector("[data-user-name]"),
    userLogin: document.querySelector("[data-user-login]"),
    organizationDependent: document.querySelector("[data-organization-dependent]"),
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
    subscriptionAction: document.querySelector("[data-subscription-action]"),
    planSummary: document.querySelector("[data-plan-summary]"),
    planName: document.querySelector("[data-plan-name]"),
    planPrice: document.querySelector("[data-plan-price]"),
    planCredits: document.querySelector("[data-plan-credits]"),
    teamForm: document.querySelector("[data-team-form]"),
    teamInput: document.querySelector("[data-team-form] input"),
    teamSubmit: document.querySelector("[data-team-form] button"),
    refresh: document.querySelector("[data-refresh]"),
    teamsEmpty: document.querySelector("[data-teams-empty]"),
    teamList: document.querySelector("[data-team-list]"),
    toast: document.querySelector("[data-toast]")
  };

  if (!ui.signIn) return;

  const session = {
    accessToken: "",
    idToken: "",
    user: null,
    claims: {},
    organizationId: "",
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
    teamServiceAvailable: false,
    teams: [],
    completingGitHub: false
  };

  const environment = stringValue(config.environment) || "local";
  const oauthStorageKey = `deep-navy.oauth.${stringValue(config.cognito_client_id) || environment}`;
  const githubStartStorageKey = `deep-navy.github-start.${stringValue(config.cognito_client_id) || environment}`;
  const githubCompletionStorageKey = `deep-navy.github-completion.${stringValue(config.cognito_client_id) || environment}`;
  const billingReturnStorageKey = `deep-navy.billing-return.${stringValue(config.cognito_client_id) || environment}`;
  const appPath = deriveAppPath();
  const appUrl = new URL(appPath, window.location.origin).toString();
  const derivedCallbackUrl = new URL(`${appPath.replace(/\/$/, "")}/callback/`, window.location.origin).toString();
  const identity = identityConfiguration();
  const apiBaseUrl = normalizeServiceUrl(config.api_base_url);
  const organizationContract = window.deepNavyOrganizationOnboarding || null;
  const launchContract = window.deepNavyLaunchContract || null;
  const generatedClient = window.deepNavyGeneratedClient || null;
  const platformApi = createPlatformApi();
  const provisioningTimers = new Map();
  const mutationKeys = launchContract?.createMutationKeys(() => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18));
  const organizationCoordinator = organizationContract?.createCoordinator({
    request: apiRequest,
    createIdempotencyKey: () => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18)
  });

  ui.environment.textContent = environment;
  ui.signIn.disabled = !identity.ready;

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

  function normalizeCognitoDomain(value) {
    const raw = stringValue(value);
    if (!raw) return "";
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return normalizeServiceUrl(withScheme);
  }

  function createPlatformApi() {
    if (!apiBaseUrl || generatedClient?.PLATFORM_PROTOS_REVISION !== "fa01d7cc4c68c1e7ee606a44677ad70d16f4c563" || typeof generatedClient.createPlatformApi !== "function") return null;
    try {
      return generatedClient.createPlatformApi({ baseUrl: apiBaseUrl, defaultTimeoutMs: 16000 });
    } catch {
      return null;
    }
  }

  function absolutePublicUrl(value, fallback) {
    const raw = stringValue(value);
    if (!raw) return fallback;
    try {
      const url = new URL(raw, window.location.origin);
      const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      if (url.protocol !== "https:" && !localHttp) return "";
      if (url.username || url.password) return "";
      if (url.origin !== window.location.origin) return "";
      return url.toString();
    } catch {
      return "";
    }
  }

  function identityConfiguration() {
    const domain = normalizeCognitoDomain(config.cognito_domain);
    const clientId = stringValue(config.cognito_client_id);
    const callbackUrl = absolutePublicUrl(config.cognito_callback_url, derivedCallbackUrl);
    const logoutUrl = absolutePublicUrl(config.cognito_logout_url, appUrl);
    const requestedScopes = Array.isArray(config.oauth_scopes) ? config.oauth_scopes.filter((scope) => typeof scope === "string" && /^[a-zA-Z0-9:./_-]+$/.test(scope)) : [];
    const scopes = requestedScopes.length ? requestedScopes : ["openid", "email", "profile"];
    return { domain, clientId, callbackUrl, logoutUrl, scopes, ready: Boolean(domain && clientId && callbackUrl && logoutUrl) };
  }

  function renderConfiguration() {
    const missing = [];
    if (!identity.domain) missing.push("Cognito domain");
    if (!identity.clientId) missing.push("Cognito public client ID");
    if (!identity.callbackUrl) missing.push("callback URL");
    if (!apiBaseUrl) missing.push("platform API origin");

    if (missing.length === 0) {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "success", "Environment configured", `${environment} has public identity and API coordinates. Each onboarding step still requires a successful server response.`);
    } else if (identity.ready) {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "warning", "Identity ready; platform services pending", `Missing ${missing.join(", ")}. You can sign in, but server-backed onboarding remains unavailable until deployment configuration is complete.`);
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

  async function sha256Base64Url(value) {
    const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return bytesToBase64Url(new Uint8Array(digest));
  }

  async function beginSignIn(purpose = "sign_in") {
    hideAuthError();
    if (!identity.ready || !window.crypto?.subtle) {
      showAuthError("Sign-in is not available", "This deployment is missing its public Cognito configuration or browser cryptography support. No sign-in request was sent.");
      return;
    }

    ui.signIn.disabled = true;
    ui.retrySignIn.disabled = true;
    try {
      const verifier = randomBase64Url(64);
      const challenge = await sha256Base64Url(verifier);
      const state = randomBase64Url(32);
      const nonce = randomBase64Url(32);
      const transaction = {
        verifier,
        state,
        nonce,
        redirectUri: identity.callbackUrl,
        purpose: stringValue(purpose) || "sign_in",
        createdAt: Date.now()
      };
      window.sessionStorage.setItem(oauthStorageKey, JSON.stringify(transaction));

      const authorizeUrl = new URL("/oauth2/authorize", identity.domain);
      authorizeUrl.search = new URLSearchParams({
        response_type: "code",
        client_id: identity.clientId,
        redirect_uri: identity.callbackUrl,
        scope: identity.scopes.join(" "),
        state,
        nonce,
        code_challenge_method: "S256",
        code_challenge: challenge
      }).toString();
      window.location.assign(authorizeUrl.toString());
    } catch {
      showAuthError("Could not start sign-in", "The browser could not prepare a secure PKCE transaction. No credentials were sent. Try again in a current browser.");
      ui.signIn.disabled = !identity.ready;
      ui.retrySignIn.disabled = !identity.ready;
    }
  }

  async function completeCallback(params) {
    const authorizationError = params.get("error");
    if (authorizationError) {
      clearOAuthTransaction();
      const description = safeOAuthDescription(params.get("error_description"));
      showAuthError("Cognito did not complete sign-in", description || "The authorization request was cancelled or rejected. Start again when you are ready.");
      return false;
    }

    const code = params.get("code");
    const returnedState = params.get("state");
    if (!code || !returnedState) {
      showAuthError("Incomplete sign-in callback", "The callback does not include the one-time authorization code and state. Start sign-in again.");
      return false;
    }

    const transaction = readOAuthTransaction();
    clearOAuthTransaction();
    const tenMinutes = 10 * 60 * 1000;
    if (!transaction || transaction.state !== returnedState || Date.now() - transaction.createdAt > tenMinutes) {
      showAuthError("Authorization state did not match", "This callback was not paired with a current sign-in transaction in this browser tab. No token request was sent.");
      return false;
    }
    if (transaction.redirectUri !== identity.callbackUrl) {
      showAuthError("Callback configuration changed", "The configured callback URL changed during sign-in. Start again so Cognito can validate a single redirect URI.");
      return false;
    }

    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "Completing secure sign-in", "Exchanging the one-time authorization code with PKCE. Tokens will remain in memory.");
    ui.retrySignIn.hidden = true;

    try {
      const tokenUrl = new URL("/oauth2/token", identity.domain);
      const response = await fetch(tokenUrl, {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: identity.clientId,
          code,
          code_verifier: transaction.verifier,
          redirect_uri: identity.callbackUrl
        })
      });
      const result = await parseJsonResponse(response);
      if (!response.ok || !stringValue(result.access_token) || !stringValue(result.id_token)) {
        throw new Error("token_exchange_failed");
      }

      const claims = decodeJwtPayload(result.id_token);
      const accessClaims = decodeJwtPayload(result.access_token);
      const accessClient = stringValue(accessClaims?.client_id) || stringValue(accessClaims?.aud);
      if (!claims || claims.nonce !== transaction.nonce || claims.aud !== identity.clientId || Number(claims.exp || 0) * 1000 <= Date.now()) {
        throw new Error("token_validation_failed");
      }
      if (!accessClaims || accessClient !== identity.clientId || stringValue(accessClaims.token_use) !== "access" || Number(accessClaims.exp || 0) * 1000 <= Date.now()) {
        throw new Error("access_token_validation_failed");
      }

      session.accessToken = result.access_token;
      session.idToken = result.id_token;
      session.claims = claims;
      hideAuthError();
      showAuthenticated();
      await initializeAuthenticatedSession();
      return true;
    } catch {
      session.accessToken = "";
      session.idToken = "";
      session.claims = {};
      showAuthError("Token exchange failed", "Cognito rejected or could not complete the one-time exchange. The code was not retained. Start a new sign-in attempt.");
      return false;
    }
  }

  function readOAuthTransaction() {
    try {
      const raw = window.sessionStorage.getItem(oauthStorageKey);
      const value = raw ? JSON.parse(raw) : null;
      if (!value || typeof value.verifier !== "string" || typeof value.state !== "string" || typeof value.nonce !== "string" || typeof value.createdAt !== "number") return null;
      return value;
    } catch {
      return null;
    }
  }

  function clearOAuthTransaction() {
    try { window.sessionStorage.removeItem(oauthStorageKey); } catch { /* session storage may be disabled */ }
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
    if (!["success", "cancelled", "canceled"].includes(value)) return false;
    storageWrite(billingReturnStorageKey, { value: value === "success" ? "success" : "cancelled", createdAt: Date.now() });
    return true;
  }

  function stripCallbackQuery() {
    if (!window.location.search) return;
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
  }

  function safeOAuthDescription(value) {
    const description = stringValue(value).replace(/[\r\n\t]/g, " ");
    return description.slice(0, 240);
  }

  function decodeJwtPayload(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
      const bytes = Uint8Array.from(window.atob(base64), (character) => character.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }

  function showAuthError(title, message) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "error", title, message);
    ui.retrySignIn.hidden = false;
    ui.retrySignIn.disabled = !identity.ready;
    ui.signedOut.hidden = false;
    ui.authenticated.hidden = true;
    ui.signOut.hidden = true;
  }

  function hideAuthError() {
    ui.authBanner.hidden = true;
    ui.retrySignIn.hidden = false;
  }

  function showAuthenticated() {
    ui.signedOut.hidden = true;
    ui.authenticated.hidden = false;
    ui.signOut.hidden = false;
    ui.userSummary.hidden = false;
    const name = stringValue(session.claims.name) || stringValue(session.claims.preferred_username) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(session.claims.preferred_username) || stringValue(session.claims.email);
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
    const name = stringValue(user.displayName) || stringValue(session.claims.name) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(user.email) || stringValue(session.claims.preferred_username) || stringValue(session.claims.email);
    ui.userName.textContent = name;
    ui.userLogin.textContent = login;
    ui.userInitial.textContent = name.charAt(0).toUpperCase();
  }

  function resetOrganizationControls() {
    ui.organizationBootstrapForm.hidden = true;
    ui.organizationBootstrapInput.disabled = true;
    ui.organizationBootstrapSubmit.disabled = true;
    ui.organizationSelectForm.hidden = true;
    ui.organizationSelectInput.disabled = true;
    ui.organizationSelectSubmit.disabled = true;
    ui.profileRetry.hidden = true;
  }

  async function renderOrganizationState(state) {
    resetOrganizationControls();
    session.organizationId = "";
    ui.organizationDependent.hidden = true;

    if (state.kind === "needs_bootstrap") {
      setStep("organization", "action", "Needs action", "Name your organization. The API will create the organization and your owner membership atomically; safe retries reuse the same idempotency key.");
      ui.organizationBootstrapForm.hidden = false;
      ui.organizationBootstrapInput.disabled = false;
      ui.organizationBootstrapSubmit.disabled = false;
      ui.organizationBootstrapInput.focus();
      setAllStepsUnavailable("Create your organization before continuing with GitHub, billing, or teams.");
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
      setAllStepsUnavailable("Select an authorized organization before continuing with GitHub, billing, or teams.");
      return;
    }

    if (state.kind !== "ready") throw new organizationContract.ContractError("The organization coordinator returned an unknown state.");
    const organizationId = stringValue(state.organization?.id);
    if (!organizationId) throw new organizationContract.ContractError("The ready organization has no ID.");
    session.organizationId = organizationId;
    const organizationName = stringValue(state.organization.name) || "your organization";
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

  async function parseJsonResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return {};
    try { return await response.json(); } catch { return {}; }
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
      setStep("organization", "error", "Not confirmed", organizationErrorMessage(error, "The API did not confirm organization creation. No completion state was assumed; retrying the same name is safe."));
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

  async function refreshOnboarding() {
    setStep("github", "loading", "Checking", "Checking for an organization-bound GitHub App installation.");
    setStep("repositories", "loading", "Checking", "Loading the repositories that the GitHub App makes available.");
    setStep("subscription", "loading", "Checking", "Checking the server-verified subscription status.");
    setStep("team", "loading", "Checking", "Checking existing engineering teams and prerequisites.");
    ui.refresh.disabled = true;
    const [githubResult, planResult, subscriptionResult, teamsResult] = await Promise.allSettled([
      apiRequest("github_installation", { organizationId: session.organizationId }),
      apiRequest("billing_plan", { planId: stringValue(config.plan_id) || "founding-team" }),
      apiRequest("subscription", { organizationId: session.organizationId }),
      apiRequest("teams", { organizationId: session.organizationId, page: { pageSize: 50 } })
    ]);

    renderBillingPlanResult(planResult);
    renderSubscriptionResult(subscriptionResult);
    renderTeamsResult(teamsResult);
    await renderGitHubResult(githubResult);
    updateTeamAction();
    reconcileBillingReturn();
    ui.refresh.disabled = false;
  }

  async function renderGitHubResult(result) {
    if (result.status === "fulfilled") {
      const installation = result.value.installation;
      session.githubInstalled = Boolean(launchContract?.githubInstallationActive(installation));
      if (session.githubInstalled) {
        const account = stringValue(installation.accountLogin) || stringValue(installation.account_login) || "selected GitHub account";
        setStep("github", "complete", "Connected", `The API confirms an active installation for ${account}. Choose the repositories Deep Navy may use next.`);
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
      session.repositoryServiceAvailable = true;
      session.repositories = launchContract.accessibleRepositories(repositoriesResult.value).sort((left, right) => {
        const leftName = `${stringValue(left.owner)}/${stringValue(left.name)}`;
        const rightName = `${stringValue(right.owner)}/${stringValue(right.name)}`;
        return leftName.localeCompare(rightName);
      });
      session.repositorySelection = selectionResult.status === "fulfilled" ? selectionResult.value.selection : null;
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
      setStep("repositories", "complete", "Selected", `${count} accessible ${count === 1 ? "repository is" : "repositories are"} authorized for team provisioning.`);
    } else if (session.repositories.length === 0) {
      setStep("repositories", "blocked", "No repositories", "The installation is active, but GitHub returned no accessible repositories. Grant access in GitHub and refresh.");
    } else {
      setStep("repositories", "action", "Needs action", "Choose the accessible repositories that Deep Navy may use, then save the server-side selection.");
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
    if (result.status !== "fulfilled" || !result.value.plan?.id) {
      session.billingPlanError = result.status === "rejected"
        ? apiErrorMessage(result.reason, "The launch billing plan is not available.")
        : "The billing service did not return the configured launch plan.";
      return;
    }
    session.billingPlanAvailable = true;
    session.billingPlan = result.value.plan;
    ui.planName.textContent = stringValue(session.billingPlan.name) || stringValue(session.billingPlan.id);
    ui.planPrice.textContent = formatMoney(session.billingPlan.recurringPrice, session.billingPlan.interval);
    ui.planCredits.textContent = formatCredits(session.billingPlan.includedCreditMicros);
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
    const micros = Number(value || 0);
    return Number.isSafeInteger(micros) && micros > 0 ? `${new Intl.NumberFormat().format(micros / 1_000_000)} Engineering Credits` : "Included credits shown at checkout";
  }

  function renderSubscriptionResult(result) {
    if (result.status === "fulfilled") {
      const subscription = result.value.subscription;
      if (result.value.plan?.id) renderBillingPlanResult({ status: "fulfilled", value: { plan: result.value.plan } });
      const status = subscriptionStatusLabel(subscription);
      session.subscription = subscription || null;
      session.subscriptionManageable = Boolean(subscription?.id);
      session.subscriptionActive = Boolean(launchContract?.subscriptionActive(subscription));
      if (session.subscriptionActive) {
        setStep("subscription", "complete", "Active", `The API confirms the ${stringValue(subscription.planId) || stringValue(subscription.plan_id) || "current"} plan is ${status}.`);
        ui.subscriptionAction.textContent = "Manage billing";
        ui.subscriptionAction.disabled = false;
      } else {
        setStep("subscription", "action", "Needs action", status ? `The subscription is ${status}; team creation requires an active or trialing plan.` : "No active subscription is recorded for this organization.");
        ui.subscriptionAction.textContent = session.subscriptionManageable ? "Manage billing" : "Open secure checkout";
        ui.subscriptionAction.disabled = !session.subscriptionManageable && !session.billingPlanAvailable;
      }
      return;
    }
    session.subscription = null;
    session.subscriptionManageable = false;
    session.subscriptionActive = false;
    if (isMissingResource(result.reason)) {
      const planMessage = session.billingPlanAvailable ? "Checkout is created by the billing service and completed on Stripe." : session.billingPlanError;
      setStep("subscription", session.billingPlanAvailable ? "action" : "error", session.billingPlanAvailable ? "Needs action" : "Plan unavailable", `No subscription is recorded. ${planMessage}`);
      ui.subscriptionAction.textContent = "Open secure checkout";
      ui.subscriptionAction.disabled = !session.billingPlanAvailable;
    } else {
      setStep("subscription", "error", "Unavailable", apiErrorMessage(result.reason, "The billing service is not ready. No subscription state was assumed."));
      ui.subscriptionAction.disabled = true;
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
    if (returned.value === "cancelled") {
      storageRemove(billingReturnStorageKey);
      toast("Checkout was cancelled. No subscription completion was assumed.", "info");
      return;
    }
    if (session.subscriptionActive) {
      storageRemove(billingReturnStorageKey);
      toast("Stripe and the API confirm that your subscription is active.", "success");
      return;
    }
    if ((reconcileBillingReturn.attempts || 0) < 4) {
      reconcileBillingReturn.attempts = (reconcileBillingReturn.attempts || 0) + 1;
      window.setTimeout(() => { if (session.accessToken) refreshOnboarding(); }, 3000 * reconcileBillingReturn.attempts);
      setStep("subscription", "loading", "Confirming", "Stripe returned successfully. Waiting for the signed webhook to update the subscription before marking it active.");
    } else {
      storageRemove(billingReturnStorageKey);
      reconcileBillingReturn.attempts = 0;
      toast("Stripe returned, but the subscription is not active yet. Refresh after webhook processing completes.", "info");
    }
  }

  function renderTeamsResult(result) {
    if (result.status === "fulfilled") {
      session.teamServiceAvailable = true;
      session.teams = Array.isArray(result.value.teams) ? result.value.teams : [];
      renderTeamList();
      session.teams.forEach((team) => startProvisioningPolling(team));
      return;
    }
    session.teamServiceAvailable = false;
    session.teams = [];
    renderTeamList();
    setStep("team", "error", "Unavailable", apiErrorMessage(result.reason, "The team service is not ready. No team state was assumed."));
  }

  function updateTeamAction() {
    if (!session.teamServiceAvailable) {
      ui.teamInput.disabled = true;
      ui.teamSubmit.disabled = true;
      return;
    }
    if (session.teams.length > 0) {
      setStep("team", "complete", "Created", `${session.teams.length} server-confirmed engineering ${session.teams.length === 1 ? "team" : "teams"} found.`);
      ui.teamInput.disabled = true;
      ui.teamSubmit.disabled = true;
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositorySelectionReady: session.repositorySelectionReady,
      subscriptionActive: session.subscriptionActive
    });
    const ready = missing.length === 0;
    if (ready) {
      setStep("team", "action", "Ready", "GitHub, repository access, and the subscription are server-confirmed. Choose a clear name for the first engineering team.");
    } else {
      const requirements = missing.join(missing.length > 2 ? ", " : " and ").replace(/, ([^,]+)$/, ", and $1");
      setStep("team", "blocked", "Blocked", `Complete the ${requirements} before creating a team. The API enforces these prerequisites.`);
    }
    ui.teamInput.disabled = !ready;
    ui.teamSubmit.disabled = !ready;
  }

  function setAllStepsUnavailable(message) {
    ["github", "repositories", "subscription", "team"].forEach((name) => setStep(name, "error", "Unavailable", message));
    ui.githubAction.disabled = true;
    ui.repositorySave.disabled = true;
    ui.repositoryRefresh.disabled = true;
    ui.subscriptionAction.disabled = true;
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.refresh.disabled = true;
  }

  function setStep(name, stateValue, label, message) {
    const card = document.querySelector(`[data-step="${name}"]`);
    if (!card) return;
    card.dataset.state = stateValue;
    card.querySelector("[data-step-state]").textContent = label;
    card.querySelector("[data-step-message]").textContent = message;
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
      row.append(copy, status);
      ui.teamList.append(row);
    });
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
        if (response.team) Object.assign(team, response.team);
        status = response.team?.provisioning;
      }
      if (status) team.provisioning = status;
      team._pollingMessage = "";
      renderTeamList();
      if (!launchContract.provisioningTerminal(team.provisioning || {})) startProvisioningPolling(team, 5000);
    } catch (error) {
      team._pollingMessage = apiErrorMessage(error, "Provisioning status is temporarily unavailable. Use Refresh status to retry.");
      renderTeamList();
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
      if (!launchContract.githubInstallationActive(result.installation)) {
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
      if (!result.selection) throw new ApiError("Repository service did not return the saved selection", 0, "invalid_response", "");
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

  async function startBillingAction() {
    ui.subscriptionAction.disabled = true;
    try {
      const planId = stringValue(session.billingPlan?.id) || stringValue(config.plan_id) || "founding-team";
      const portal = session.subscriptionManageable;
      if (!portal && !session.billingPlanAvailable) throw new ApiError("The public billing plan is not available", 0, "plan_not_available", "");
      const fingerprint = `${session.organizationId}:${portal ? "portal" : planId}`;
      const idempotencyKey = mutationKeys.for(portal ? "billingPortal" : "checkout", fingerprint);
      const result = portal
        ? await apiRequest("billing_portal", { organizationId: session.organizationId, returnUrl: appUrl, idempotencyKey })
        : await apiRequest("checkout", {
          organizationId: session.organizationId,
          planId,
          successUrl: `${appUrl}?billing=success`,
          cancelUrl: `${appUrl}?billing=cancelled`,
          idempotencyKey
        });
      const candidate = portal ? (result.portalUrl || result.portal_url) : (result.checkoutUrl || result.checkout_url);
      const destination = validatedRedirect(candidate, ["checkout.stripe.com", "billing.stripe.com"]);
      if (!destination) throw new ApiError("Billing service returned an untrusted redirect", 0, "invalid_redirect", "");
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, session.subscriptionManageable ? "The API could not open the billing portal." : "The API could not create a Stripe Checkout Session. No purchase was started."), "error");
      ui.subscriptionAction.disabled = false;
    }
  }

  function validatedRedirect(value, requiredHosts) {
    try {
      const url = new URL(stringValue(value));
      if (url.protocol !== "https:" || url.username || url.password) return "";
      const configured = Array.isArray(config.allowed_redirect_hosts) ? config.allowed_redirect_hosts.map(stringValue).filter(Boolean) : [];
      const allowed = new Set([...configured, ...requiredHosts]);
      const hostAccepted = allowed.has(url.hostname);
      return hostAccepted ? url.toString() : "";
    } catch {
      return "";
    }
  }

  async function createTeam(event) {
    event.preventDefault();
    const name = stringValue(new FormData(ui.teamForm).get("teamName"));
    if (name.length < 2 || name.length > 80) {
      toast("Enter a team name between 2 and 80 characters.", "error");
      ui.teamInput.focus();
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositorySelectionReady: session.repositorySelectionReady,
      subscriptionActive: session.subscriptionActive
    });
    if (missing.length) {
      toast(`Complete ${missing.join(", ")} before team creation.`, "error");
      return;
    }
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.teamSubmit.textContent = "Creating…";
    try {
      const fingerprint = `${session.organizationId}:${name.toLowerCase()}`;
      const result = await apiRequest("create_team", { organizationId: session.organizationId, name, idempotencyKey: mutationKeys.for("createTeam", fingerprint) });
      if (!result.team?.id) throw new ApiError("Team service did not return a created resource", 0, "invalid_response", "");
      mutationKeys.clear("createTeam");
      session.teamServiceAvailable = true;
      session.teams = [result.team, ...session.teams];
      renderTeamList();
      startProvisioningPolling(result.team);
      updateTeamAction();
      ui.teamForm.reset();
      const provisioning = launchContract.provisioningPresentation(result.team.provisioning || {});
      toast(`Team “${stringValue(result.team.name) || name}” was created by the API${provisioning.state ? ` and provisioning is ${provisioning.label}` : "; provisioning status is pending"}.`, "success");
    } catch (error) {
      toast(apiErrorMessage(error, "The team was not confirmed as created. It is safe to retry; the request uses an idempotency key."), "error");
      if (error instanceof ApiError && error.code === "failed_precondition") await refreshOnboarding();
      updateTeamAction();
    } finally {
      ui.teamSubmit.textContent = "Create engineering team";
    }
  }

  function toast(message, tone) {
    ui.toast.textContent = message;
    ui.toast.dataset.tone = tone || "info";
    ui.toast.hidden = false;
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => { ui.toast.hidden = true; }, 9000);
  }

  function signOut() {
    stopProvisioningPolling();
    session.accessToken = "";
    session.idToken = "";
    session.claims = {};
    session.user = null;
    session.organizationId = "";
    clearOAuthTransaction();
    clearGitHubFlow();
    storageRemove(billingReturnStorageKey);
    if (identity.ready) {
      const logout = new URL("/logout", identity.domain);
      logout.search = new URLSearchParams({ client_id: identity.clientId, logout_uri: identity.logoutUrl }).toString();
      window.location.assign(logout.toString());
      return;
    }
    window.location.assign(appPath);
  }

  ui.signIn.addEventListener("click", () => beginSignIn(readGitHubCompletion() ? "github_completion" : "sign_in"));
  ui.retrySignIn.addEventListener("click", () => beginSignIn(readGitHubCompletion() ? "github_completion" : "sign_in"));
  ui.signOut.addEventListener("click", signOut);
  ui.organizationBootstrapForm.addEventListener("submit", bootstrapOrganization);
  ui.organizationSelectForm.addEventListener("submit", selectOrganization);
  ui.profileRetry.addEventListener("click", initializeAuthenticatedSession);
  ui.githubAction.addEventListener("click", startGitHubInstallation);
  ui.repositoryForm.addEventListener("submit", saveRepositorySelection);
  ui.repositoryRefresh.addEventListener("click", refreshRepositoryAccess);
  ui.repositoryModes.forEach((input) => input.addEventListener("change", updateRepositoryControls));
  ui.repositoryList.addEventListener("change", updateRepositoryControls);
  ui.subscriptionAction.addEventListener("click", startBillingAction);
  ui.teamForm.addEventListener("submit", createTeam);
  ui.refresh.addEventListener("click", refreshOnboarding);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") session.teams.forEach((team) => startProvisioningPolling(team, 250));
  });
  window.addEventListener("beforeunload", stopProvisioningPolling);

  renderConfiguration();
  const initialQuery = typeof window.deepNavyInitialQuery === "string" ? window.deepNavyInitialQuery : window.location.search;
  try { delete window.deepNavyInitialQuery; } catch { window.deepNavyInitialQuery = ""; }
  const callbackParams = new URLSearchParams(initialQuery);
  const githubCallback = document.body.dataset.githubCallback === "true" || callbackParams.has("installation_id") || callbackParams.has("setup_action");
  const cognitoCallback = document.body.dataset.appCallback === "true" && (callbackParams.has("code") || callbackParams.has("error"));
  const billingReturn = captureBillingReturn(callbackParams);
  stripCallbackQuery();

  if (githubCallback) {
    try {
      if (!captureGitHubCallback(callbackParams)) throw new Error("github_callback_missing");
      setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub returned securely", "Re-authenticate with Deep Navy to bind the one-time GitHub authorization to the same account and organization.");
      if (!identity.ready) showAuthError("Cannot complete GitHub connection", "This environment is missing its public Cognito configuration. The one-time callback is held only in this browser tab and will expire soon.");
      else beginSignIn("github_completion");
    } catch (error) {
      clearGitHubFlow();
      const message = launchContract && error instanceof launchContract.LaunchContractError
        ? error.message
        : "The GitHub callback could not be validated in this browser. Start the installation again.";
      showAuthError("GitHub installation was not completed", message);
    }
  } else if (cognitoCallback) {
    if (!identity.ready) showAuthError("Cannot complete sign-in", "This deployment is missing the same public Cognito configuration that initiated the flow. No token request was sent.");
    else completeCallback(callbackParams);
  } else if (readGitHubCompletion()) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub completion is waiting", "Sign in again before the one-time GitHub authorization expires. Deep Navy will verify it server-side before showing a connection.");
  } else if (billingReturn) {
    const returned = storageRead(billingReturnStorageKey);
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "warning", returned?.value === "success" ? "Confirm your subscription" : "Checkout was cancelled", returned?.value === "success" ? "Sign in to let the API confirm the signed Stripe webhook before team creation is unlocked." : "No subscription completion was assumed. Sign in when you are ready to continue.");
  }
})();
