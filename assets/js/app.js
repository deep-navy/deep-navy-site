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
    subscriptionAction: document.querySelector("[data-subscription-action]"),
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
    subscriptionActive: false,
    teamServiceAvailable: false,
    teams: []
  };

  const environment = stringValue(config.environment) || "local";
  const oauthStorageKey = `deep-navy.oauth.${stringValue(config.cognito_client_id) || environment}`;
  const appPath = deriveAppPath();
  const appUrl = new URL(appPath, window.location.origin).toString();
  const derivedCallbackUrl = new URL(`${appPath.replace(/\/$/, "")}/callback/`, window.location.origin).toString();
  const identity = identityConfiguration();
  const apiBaseUrl = normalizeServiceUrl(config.api_base_url);
  const organizationContract = window.deepNavyOrganizationOnboarding || null;
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
    if (/\/app\/callback\/?$/.test(path)) return path.replace(/callback\/?$/, "");
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

  function absolutePublicUrl(value, fallback) {
    const raw = stringValue(value);
    if (!raw) return fallback;
    try {
      const url = new URL(raw, window.location.origin);
      const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      if (url.protocol !== "https:" && !localHttp) return "";
      if (url.username || url.password) return "";
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

  async function beginSignIn() {
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

  async function completeCallback() {
    const params = new URLSearchParams(window.location.search);
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
      if (!claims || claims.nonce !== transaction.nonce || claims.aud !== identity.clientId || Number(claims.exp || 0) * 1000 <= Date.now()) {
        throw new Error("token_validation_failed");
      }

      session.accessToken = result.access_token;
      session.idToken = result.id_token;
      session.claims = claims;
      window.history.replaceState({}, "", appPath);
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
    if (!organizationCoordinator) {
      setStep("organization", "error", "Unavailable", "The organization contract did not load. No organization state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The organization onboarding contract is unavailable. Downstream actions are disabled.");
      return;
    }

    resetOrganizationControls();
    setStep("organization", "loading", "Checking", "Loading the memberships authorized for this signed-in account.");
    try {
      const state = await organizationCoordinator.load();
      renderProfile(state.profile);
      await renderOrganizationState(state);
    } catch (error) {
      session.organizationId = "";
      ui.organizationDependent.hidden = true;
      ui.profileRetry.hidden = false;
      setStep("organization", "error", "Unavailable", organizationErrorMessage(error, "The API could not establish a trusted current user and organization. No organization state was assumed."));
      setAllStepsUnavailable("A server-confirmed organization is required before downstream onboarding can begin.");
    }
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

  function endpointPath(name) {
    const paths = config.api_paths && typeof config.api_paths === "object" ? config.api_paths : {};
    const value = stringValue(paths[name]);
    return value.startsWith("/") && !value.startsWith("//") ? value : "";
  }

  async function apiRequest(name, payload) {
    if (!session.accessToken) throw new ApiError("Sign-in is required", 401, "unauthenticated", "");
    if (!apiBaseUrl) throw new ApiError("Platform API is not configured", 0, "not_configured", "");
    const path = endpointPath(name);
    if (!path) throw new ApiError(`${name} endpoint is not configured`, 0, "not_configured", "");
    const url = new URL(path, `${apiBaseUrl}/`);
    if (url.origin !== new URL(apiBaseUrl).origin) throw new ApiError("Configured API path escaped its origin", 0, "invalid_configuration", "");
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
          "Authorization": `Bearer ${session.accessToken}`,
          "X-Request-ID": requestId
        },
        body: JSON.stringify(payload || {})
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        const code = stringValue(data.code) || stringValue(data.error) || `http_${response.status}`;
        const message = stringValue(data.message) || stringValue(data.error_description) || `The service returned HTTP ${response.status}`;
        throw new ApiError(message.slice(0, 300), response.status, code, response.headers.get("x-request-id") || requestId);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error?.name === "AbortError") throw new ApiError("The service did not respond within 15 seconds", 0, "timeout", requestId);
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
    const suffix = error.requestId ? ` Request ID: ${error.requestId}.` : "";
    return `${fallback}${suffix}`;
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
    setStep("subscription", "loading", "Checking", "Checking the server-verified subscription status.");
    setStep("team", "loading", "Checking", "Checking existing engineering teams and prerequisites.");
    ui.refresh.disabled = true;
    const [githubResult, subscriptionResult, teamsResult] = await Promise.allSettled([
      apiRequest("github_installation", { organizationId: session.organizationId }),
      apiRequest("subscription", { organizationId: session.organizationId }),
      apiRequest("teams", { organizationId: session.organizationId, page: { pageSize: 50 } })
    ]);

    renderGitHubResult(githubResult);
    renderSubscriptionResult(subscriptionResult);
    renderTeamsResult(teamsResult);
    updateTeamAction();
    ui.refresh.disabled = false;
  }

  function renderGitHubResult(result) {
    if (result.status === "fulfilled") {
      const installation = result.value.installation;
      const status = stringValue(installation?.status).toLowerCase();
      session.githubInstalled = Boolean(installation?.id) && !["revoked", "suspended", "inactive", "deleted"].includes(status);
      if (session.githubInstalled) {
        const account = stringValue(installation.accountLogin) || stringValue(installation.account_login) || "selected GitHub account";
        setStep("github", "complete", "Connected", `The API confirms an active installation for ${account}. Repository access remains controlled in GitHub.`);
        ui.githubAction.textContent = "Review in GitHub";
        ui.githubAction.disabled = false;
      } else {
        setStep("github", "action", "Needs action", "No active GitHub App installation is recorded for this organization.");
        ui.githubAction.textContent = "Install GitHub App";
        ui.githubAction.disabled = false;
      }
      return;
    }
    session.githubInstalled = false;
    if (isMissingResource(result.reason)) {
      setStep("github", "action", "Needs action", "No GitHub App installation is recorded for this organization.");
      ui.githubAction.disabled = false;
    } else {
      setStep("github", "error", "Unavailable", apiErrorMessage(result.reason, "The GitHub integration service is not ready. No installation state was assumed."));
      ui.githubAction.disabled = true;
    }
  }

  function renderSubscriptionResult(result) {
    if (result.status === "fulfilled") {
      const subscription = result.value.subscription;
      const status = stringValue(subscription?.status).toLowerCase();
      session.subscriptionActive = ["active", "trialing"].includes(status);
      if (session.subscriptionActive) {
        setStep("subscription", "complete", "Active", `The API confirms the ${stringValue(subscription.planId) || stringValue(subscription.plan_id) || "current"} plan is ${status}.`);
        ui.subscriptionAction.textContent = "Manage billing";
        ui.subscriptionAction.disabled = false;
      } else {
        setStep("subscription", "action", "Needs action", status ? `The subscription is ${status}; team creation requires an active or trialing plan.` : "No active subscription is recorded for this organization.");
        ui.subscriptionAction.textContent = "Open secure checkout";
        ui.subscriptionAction.disabled = false;
      }
      return;
    }
    session.subscriptionActive = false;
    if (isMissingResource(result.reason)) {
      setStep("subscription", "action", "Needs action", "No subscription is recorded. Checkout is created by the billing service and completed on Stripe.");
      ui.subscriptionAction.disabled = false;
    } else {
      setStep("subscription", "error", "Unavailable", apiErrorMessage(result.reason, "The billing service is not ready. No subscription state was assumed."));
      ui.subscriptionAction.disabled = true;
    }
  }

  function renderTeamsResult(result) {
    if (result.status === "fulfilled") {
      session.teamServiceAvailable = true;
      session.teams = Array.isArray(result.value.teams) ? result.value.teams : [];
      renderTeamList();
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
    const ready = session.githubInstalled && session.subscriptionActive;
    if (ready) {
      setStep("team", "action", "Ready", "GitHub and the subscription are active. Choose a clear name for the first engineering team.");
    } else {
      const requirements = [!session.githubInstalled ? "GitHub installation" : "", !session.subscriptionActive ? "active subscription" : ""].filter(Boolean).join(" and ");
      setStep("team", "blocked", "Blocked", `Complete the ${requirements} before creating a team. The API enforces these prerequisites.`);
    }
    ui.teamInput.disabled = !ready;
    ui.teamSubmit.disabled = !ready;
  }

  function setAllStepsUnavailable(message) {
    ["github", "subscription", "team"].forEach((name) => setStep(name, "error", "Unavailable", message));
    ui.githubAction.disabled = true;
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
      detail.textContent = stringValue(team.namespace) ? `Namespace ${team.namespace}` : "Runtime namespace pending";
      status.className = "status-label";
      status.textContent = stringValue(team.state) || "Created";
      copy.append(name, detail);
      row.append(copy, status);
      ui.teamList.append(row);
    });
  }

  async function startGitHubInstallation() {
    ui.githubAction.disabled = true;
    try {
      const result = await apiRequest("github_install_link", { organizationId: session.organizationId });
      const destination = validatedRedirect(result.installationUrl || result.installation_url, ["github.com"]);
      if (!destination) throw new ApiError("GitHub service returned an untrusted redirect", 0, "invalid_redirect", "");
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, "The API could not create a GitHub installation link. No installation was started."), "error");
      ui.githubAction.disabled = false;
    }
  }

  async function startBillingAction() {
    ui.subscriptionAction.disabled = true;
    try {
      const result = session.subscriptionActive
        ? await apiRequest("billing_portal", { organizationId: session.organizationId, returnUrl: appUrl })
        : await apiRequest("checkout", { organizationId: session.organizationId, planId: stringValue(config.plan_id) || "founding-team", successUrl: `${appUrl}?checkout=success`, cancelUrl: `${appUrl}?checkout=cancelled` });
      const candidate = session.subscriptionActive ? (result.portalUrl || result.portal_url) : (result.checkoutUrl || result.checkout_url);
      const destination = validatedRedirect(candidate, ["checkout.stripe.com", "billing.stripe.com"]);
      if (!destination) throw new ApiError("Billing service returned an untrusted redirect", 0, "invalid_redirect", "");
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, session.subscriptionActive ? "The API could not open the billing portal." : "The API could not create a Stripe Checkout Session. No purchase was started."), "error");
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
    if (!session.githubInstalled || !session.subscriptionActive) {
      toast("GitHub and an active subscription must be server-confirmed before team creation.", "error");
      return;
    }
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.teamSubmit.textContent = "Creating…";
    try {
      const result = await apiRequest("create_team", { organizationId: session.organizationId, name, idempotencyKey: window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18) });
      if (!result.team?.id) throw new ApiError("Team service did not return a created resource", 0, "invalid_response", "");
      session.teamServiceAvailable = true;
      session.teams = [result.team, ...session.teams];
      renderTeamList();
      updateTeamAction();
      ui.teamForm.reset();
      toast(`Team “${stringValue(result.team.name) || name}” was created by the API. Provisioning may continue asynchronously.`, "success");
    } catch (error) {
      toast(apiErrorMessage(error, "The team was not confirmed as created. It is safe to retry; the request uses an idempotency key."), "error");
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
    session.accessToken = "";
    session.idToken = "";
    session.claims = {};
    session.user = null;
    session.organizationId = "";
    clearOAuthTransaction();
    if (identity.ready) {
      const logout = new URL("/logout", identity.domain);
      logout.search = new URLSearchParams({ client_id: identity.clientId, logout_uri: identity.logoutUrl }).toString();
      window.location.assign(logout.toString());
      return;
    }
    window.location.assign(appPath);
  }

  ui.signIn.addEventListener("click", beginSignIn);
  ui.retrySignIn.addEventListener("click", beginSignIn);
  ui.signOut.addEventListener("click", signOut);
  ui.organizationBootstrapForm.addEventListener("submit", bootstrapOrganization);
  ui.organizationSelectForm.addEventListener("submit", selectOrganization);
  ui.profileRetry.addEventListener("click", initializeAuthenticatedSession);
  ui.githubAction.addEventListener("click", startGitHubInstallation);
  ui.subscriptionAction.addEventListener("click", startBillingAction);
  ui.teamForm.addEventListener("submit", createTeam);
  ui.refresh.addEventListener("click", refreshOnboarding);

  renderConfiguration();
  const isCallback = document.body.dataset.appCallback === "true" || new URLSearchParams(window.location.search).has("code") || new URLSearchParams(window.location.search).has("error");
  if (isCallback) {
    if (!identity.ready) showAuthError("Cannot complete sign-in", "This deployment is missing the same public Cognito configuration that initiated the flow. No token request was sent.");
    else completeCallback();
  }
})();
