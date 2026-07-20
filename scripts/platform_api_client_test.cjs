"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const source = readFileSync("assets/js/platform-api-client.js", "utf8");
const generated = Function(`${source}\nreturn deepNavyGeneratedClient;`)();

function parseRequestBody(body) {
  if (typeof body === "string") return JSON.parse(body);
  if (body instanceof Uint8Array) return JSON.parse(new TextDecoder().decode(body));
  throw new TypeError(`Unexpected request body type: ${Object.prototype.toString.call(body)}`);
}

test("the browser bundle exposes the pinned generated contract", () => {
  assert.equal(generated.PLATFORM_PROTOS_REVISION, "f4463a6fec905bf4f7886e1e56424879d9a173f7");
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("github_install_complete"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("update_repository_selection"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("request_team"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("suspend_team"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("resume_team"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("delete_team"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("provisioning_status"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("agents"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("economics"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("credit_balance"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("credit_control"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("update_credit_control"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("invoices"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("invoice"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("objectives"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("create_objective"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("initiatives"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("approvals"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("decide_approval"));
  assert.equal(generated.PLATFORM_CAPABILITIES.activityStream, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.provisioningStream, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.objectiveSubmission, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.objectiveDiscovery, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.initiativeDiscoveryByObjective, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.approvalDecision, true);
  assert.equal(generated.PLATFORM_CAPABILITIES.approvalDiscovery, true);

  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { throw new Error("not called"); }
  });
  assert.equal(typeof api.streamTeamActivity, "function");
  assert.equal(typeof api.streamProvisioningStatus, "function");
});

test("generated objective and initiative clients preserve team and objective scope", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), body: parseRequestBody(init.body) });
      const path = String(input);
      const response = path.endsWith("/CreateBusinessObjective")
        ? { objective: { id: "objective-1", teamId: "team-1", title: "Improve activation", description: "Raise activation from baseline." } }
        : path.endsWith("/ListBusinessObjectives")
          ? { objectives: [{ id: "objective-1", teamId: "team-1", title: "Improve activation" }], page: {} }
          : { initiatives: [{ id: "initiative-1", objectiveId: "objective-1", title: "Reduce setup time" }], page: {} };
      return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("create_objective", {
    teamId: "team-1",
    title: "Improve activation",
    description: "Raise activation from baseline.",
    idempotencyKey: "objective-request-1"
  }, { accessToken: "access-token", requestId: "objective-request" });
  await api.request("objectives", { teamId: "team-1", page: { pageSize: 100 } }, { accessToken: "access-token", requestId: "objectives-request" });
  await api.request("initiatives", { objectiveId: "objective-1", page: { pageSize: 100 } }, { accessToken: "access-token", requestId: "initiative-request" });

  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.ObjectiveService/CreateBusinessObjective");
  assert.deepEqual(calls[0].body, {
    teamId: "team-1",
    title: "Improve activation",
    description: "Raise activation from baseline.",
    idempotencyKey: "objective-request-1"
  });
  assert.equal(calls[1].input, "https://dev.api.deep.navy/deepnavy.v1.ObjectiveService/ListBusinessObjectives");
  assert.deepEqual(calls[1].body, { teamId: "team-1", page: { pageSize: 100 } });
  assert.equal(calls[2].input, "https://dev.api.deep.navy/deepnavy.v1.InitiativeService/ListInitiatives");
  assert.deepEqual(calls[2].body, { objectiveId: "objective-1", page: { pageSize: 100 } });
});

test("team lifecycle mutations dispatch to the pinned TeamService RPCs with contract fields", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), body: parseRequestBody(init.body) });
      const path = String(input);
      const response = path.endsWith("/DeleteTeam")
        ? {}
        : { team: { id: "team-1", organizationId: "org-1", name: "Product engineering", state: path.endsWith("/SuspendTeam") ? "LIFECYCLE_STATE_SUSPENDED" : "LIFECYCLE_STATE_ACTIVE" } };
      return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const suspended = await api.request("suspend_team", { id: "team-1", reason: "Paused from the customer console." }, {
    accessToken: "access-token",
    requestId: "suspend-request"
  });
  await api.request("resume_team", { id: "team-1" }, { accessToken: "access-token", requestId: "resume-request" });
  const deleted = await api.request("delete_team", { id: "team-1" }, { accessToken: "access-token", requestId: "delete-request" });

  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.TeamService/SuspendTeam");
  assert.deepEqual(calls[0].body, { id: "team-1", reason: "Paused from the customer console." });
  assert.equal(suspended.team.state, 3);
  assert.equal(calls[1].input, "https://dev.api.deep.navy/deepnavy.v1.TeamService/ResumeTeam");
  assert.deepEqual(calls[1].body, { id: "team-1" });
  assert.equal(calls[2].input, "https://dev.api.deep.navy/deepnavy.v1.TeamService/DeleteTeam");
  assert.deepEqual(calls[2].body, { id: "team-1" });
  assert.equal(deleted.$typeName, "deepnavy.v1.DeleteTeamResponse");
  assert.deepEqual(Object.keys(deleted).filter((key) => key !== "$typeName"), [], "DeleteTeamResponse carries no fields");
  assert.equal(JSON.stringify(calls).includes("idempotencyKey"), false, "the pinned suspend/resume/delete requests carry no idempotency_key field");
});

test("RequestTeam is the paid customer entry point and decodes the settlement + pending team", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), body: parseRequestBody(init.body) });
      return new Response(JSON.stringify({
        pendingTeam: { id: "team-1", organizationId: "org-1", name: "Product engineering", state: "LIFECYCLE_STATE_PENDING" },
        settlement: "REQUEST_TEAM_SETTLEMENT_CHECKOUT_REQUIRED",
        checkoutClientSecret: "cs_test_requestteam1234_secret_abcdef"
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const result = await api.request("request_team", {
    organizationId: "org-1",
    name: "Product engineering",
    idempotencyKey: "request-team-1"
  }, { accessToken: "access-token", requestId: "request-team-request" });

  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.TeamService/RequestTeam");
  assert.deepEqual(calls[0].body, {
    organizationId: "org-1",
    name: "Product engineering",
    idempotencyKey: "request-team-1"
  });
  // The pending team stays in LIFECYCLE_STATE_PENDING until the signed webhook
  // provisions it, and the settlement decodes to the checkout-required enum.
  assert.equal(result.pendingTeam.state, 1);
  assert.equal(result.settlement, 1);
  assert.equal(result.checkoutClientSecret, "cs_test_requestteam1234_secret_abcdef");
});

test("RequestTeam requires an organization, name, and idempotency key before any network access", async () => {
  let called = false;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { called = true; throw new Error("must not run"); }
  });
  await assert.rejects(
    api.request("request_team", { organizationId: "org-1", name: "Product engineering", idempotencyKey: "" }, { accessToken: "access-token", requestId: "request-team-missing-key" }),
    /idempotencyKey is required/
  );
  assert.equal(called, false, "an incomplete paid request never reaches the network");
});

test("suspend requires a team id and omits an empty reason from the canonical request", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), body: parseRequestBody(init.body) });
      return new Response(JSON.stringify({ team: { id: "team-1", organizationId: "org-1", state: "LIFECYCLE_STATE_SUSPENDED" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  });

  await assert.rejects(
    api.request("suspend_team", { id: "" }, { accessToken: "access-token", requestId: "suspend-missing-id" }),
    /id is required/
  );
  await api.request("suspend_team", { id: "team-1" }, { accessToken: "access-token", requestId: "suspend-no-reason" });
  assert.equal(calls.length, 1, "the invalid request never reaches the network");
  assert.deepEqual(calls[0].body, { id: "team-1" });
});

test("generated economics client requests a team-scoped measured summary", async () => {
  let request;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      request = { input: String(input), init };
      return new Response(JSON.stringify({
        economics: {
          scopeType: "team",
          scopeId: "team-1",
          directCost: { currencyCode: "USD", units: "12", nanos: 500000000 },
          grossMargin: 0.42,
          creditsUsedMicros: "1250000"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const result = await api.request("economics", { scopeType: "team", scopeId: "team-1" }, {
    accessToken: "access-token",
    requestId: "economics-request"
  });

  assert.equal(request.input, "https://dev.api.deep.navy/deepnavy.v1.EconomicsService/GetEconomics");
  assert.deepEqual(parseRequestBody(request.init.body), { scopeType: "team", scopeId: "team-1" });
  assert.equal(result.economics.scopeId, "team-1");
  assert.equal(result.economics.creditsUsedMicros, 1250000n);
});

test("approval discovery is team-scoped and decisions preserve an explicit deny reason", async () => {
  const requests = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      requests.push({ input: String(input), init });
      const response = String(input).endsWith("/ListApprovals")
        ? { approvals: [{ id: "approval-1", teamId: "team-1", approvalStatus: "APPROVAL_STATUS_PENDING" }], page: {} }
        : { approval: { id: "approval-1", teamId: "team-1", approvalStatus: "APPROVAL_STATUS_DENIED" } };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  });

  await api.request("approvals", { teamId: "team-1", page: { pageSize: 100 } }, {
    accessToken: "access-token",
    requestId: "approval-list-request"
  });
  await api.request("decide_approval", { id: "approval-1", approved: false, reason: "Needs a narrower scope" }, {
    accessToken: "access-token",
    requestId: "approval-request"
  });

  assert.equal(requests[0].input, "https://dev.api.deep.navy/deepnavy.v1.ApprovalService/ListApprovals");
  assert.deepEqual(parseRequestBody(requests[0].init.body), {
    teamId: "team-1",
    approvalStatus: "APPROVAL_STATUS_PENDING",
    page: { pageSize: 100 }
  });
  assert.equal(requests[1].input, "https://dev.api.deep.navy/deepnavy.v1.ApprovalService/DecideApproval");
  assert.deepEqual(parseRequestBody(requests[1].init.body), {
    id: "approval-1",
    reason: "Needs a narrower scope"
  }, "canonical Protobuf JSON omits the false default, which the server decodes as an explicit deny decision");
});

test("generated GitHub client derives the RPC path and Protobuf JSON", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return new Response(JSON.stringify({
        installation: {
          id: "42",
          organizationId: "org-1",
          installationState: "GIT_HUB_INSTALLATION_STATE_ACTIVE"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const result = await api.request("github_installation", { organizationId: "org-1" }, {
    accessToken: "access-token",
    requestId: "request-1"
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.GitHubService/GetGitHubInstallation");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), "Bearer access-token");
  assert.equal(new Headers(calls[0].init.headers).get("x-request-id"), "request-1");
  assert.equal(calls[0].init.credentials, "omit");
  assert.equal(calls[0].init.cache, "no-store");
  assert.equal(calls[0].init.redirect, "error");
  assert.equal(calls[0].init.referrerPolicy, "no-referrer");
  assert.deepEqual(parseRequestBody(calls[0].init.body), { organizationId: "org-1" });
  assert.equal(String(result.installation.id), "42");
  assert.equal(result.installation.installationState, 2);
});

test("generated repository client serializes int64 and enum inputs from the UI boundary", async () => {
  let request;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      request = { input: String(input), init };
      return new Response(JSON.stringify({
        selection: {
          organizationId: "org-1",
          githubInstallationId: "42",
          mode: "REPOSITORY_SELECTION_MODE_SELECTED",
          githubRepositoryIds: ["101"],
          version: "3"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("update_repository_selection", {
    organizationId: "org-1",
    mode: "REPOSITORY_SELECTION_MODE_SELECTED",
    githubRepositoryIds: ["101"],
    idempotencyKey: "selection-1",
    expectedVersion: "2"
  }, { accessToken: "access-token", requestId: "request-2" });

  assert.equal(request.input, "https://dev.api.deep.navy/deepnavy.v1.RepositoryService/UpdateRepositorySelection");
  assert.deepEqual(parseRequestBody(request.init.body), {
    organizationId: "org-1",
    mode: "REPOSITORY_SELECTION_MODE_SELECTED",
    githubRepositoryIds: ["101"],
    idempotencyKey: "selection-1",
    expectedVersion: "2"
  });
});

test("embedded billing requests use public catalog IDs and an exact return URL", async () => {
  const requests = [];
  const returnUrl = "https://dev.deep.navy/app/?billing=return&session_id={CHECKOUT_SESSION_ID}";
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      requests.push({ input: String(input), body: parseRequestBody(init.body) });
      const response = String(input).endsWith("/ListCreditPacks")
        ? { creditPacks: [{ id: "credit-pack-10000", creditMicros: "10000000000", maximumQuantity: "100", state: "BILLING_PLAN_STATE_ACTIVE" }] }
        : { checkoutSessionId: "cs_test_session123456", clientSecret: "cs_test_session123456_secret_123456", returnUrl };
      return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("checkout", {
    organizationId: "org-1",
    planId: "founding-team",
    returnUrl,
    idempotencyKey: "subscription-checkout-1"
  }, { accessToken: "access-token", requestId: "subscription-request" });
  await api.request("credit_packs", { organizationId: "org-1" }, { accessToken: "access-token", requestId: "catalog-request" });
  await api.request("credit_pack_checkout", {
    organizationId: "org-1",
    teamId: "team-1",
    creditPackId: "credit-pack-10000",
    quantity: "2",
    returnUrl,
    idempotencyKey: "credit-pack-checkout-1"
  }, { accessToken: "access-token", requestId: "credit-request" });

  assert.equal(requests[0].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/CreateCheckoutSession");
  assert.deepEqual(requests[0].body, {
    organizationId: "org-1",
    planId: "founding-team",
    idempotencyKey: "subscription-checkout-1",
    returnUrl
  });
  assert.deepEqual(requests[1].body, { organizationId: "org-1" });
  assert.equal(requests[2].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/CreateCreditPackCheckoutSession");
  assert.deepEqual(requests[2].body, {
    organizationId: "org-1",
    teamId: "team-1",
    creditPackId: "credit-pack-10000",
    quantity: "2",
    returnUrl,
    idempotencyKey: "credit-pack-checkout-1"
  });
  assert.equal(JSON.stringify(requests).includes("price_"), false, "browser billing requests never accept a Stripe Price ID");
  assert.equal(JSON.stringify(requests).includes("successUrl"), false);
  assert.equal(JSON.stringify(requests).includes("cancelUrl"), false);
});

test("invoice history uses typed organization-scoped pagination and local invoice IDs", async () => {
  const requests = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      requests.push({ input: String(input), body: parseRequestBody(init.body) });
      const response = String(input).endsWith("/ListInvoices")
        ? { invoices: [{ id: "invoice-local-1", organizationId: "org-1", status: "INVOICE_STATUS_PAID" }], page: {} }
        : { invoice: { id: "invoice-local-1", organizationId: "org-1", status: "INVOICE_STATUS_PAID" } };
      return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("invoices", { organizationId: "org-1", page: { pageSize: 25, pageToken: "opaque-page-token" } }, {
    accessToken: "access-token", requestId: "invoice-list"
  });
  await api.request("invoice", { organizationId: "org-1", invoiceId: "invoice-local-1" }, {
    accessToken: "access-token", requestId: "invoice-get"
  });

  assert.equal(requests[0].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/ListInvoices");
  assert.deepEqual(requests[0].body, { organizationId: "org-1", page: { pageSize: 25, pageToken: "opaque-page-token" } });
  assert.equal(requests[1].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/GetInvoice");
  assert.deepEqual(requests[1].body, { organizationId: "org-1", invoiceId: "invoice-local-1" });
  assert.equal(JSON.stringify(requests).includes("stripe"), false, "invoice reads never expose provider identifiers");
});

test("credit pack checkout rejects non-positive quantities before network access", async () => {
  let called = false;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { called = true; throw new Error("must not run"); }
  });
  await assert.rejects(api.request("credit_pack_checkout", {
    organizationId: "org-1",
    teamId: "team-1",
    creditPackId: "credit-pack-10000",
    quantity: "0",
    returnUrl: "https://dev.deep.navy/app/?billing=return&session_id={CHECKOUT_SESSION_ID}",
    idempotencyKey: "credit-pack-checkout-2"
  }, { accessToken: "access-token", requestId: "credit-request" }), /quantity is invalid/);
  assert.equal(called, false);
});

test("credit balance reads are explicitly organization and team scoped", async () => {
  let request;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      request = { input: String(input), body: parseRequestBody(init.body) };
      return new Response(JSON.stringify({ balanceMicros: "50000000000" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  });

  const result = await api.request("credit_balance", { organizationId: "org-1", teamId: "team-1" }, {
    accessToken: "access-token", requestId: "balance-read"
  });

  assert.equal(request.input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/GetCreditBalance");
  assert.deepEqual(request.body, { organizationId: "org-1", teamId: "team-1" });
  assert.equal(result.balanceMicros, 50000000000n);
});

test("team credit controls preserve team scope, micros, pause, and optimistic version", async () => {
  const requests = [];
  const response = {
    control: {
      teamId: "team-1",
      ledgerAvailableMicros: "50000000000",
      openReservedMicros: "0",
      periodConsumedMicros: "0",
      hardLimitMicros: "40000000000",
      budgetRemainingMicros: "40000000000",
      effectiveAvailableMicros: "40000000000",
      paused: true,
      customerPaused: true,
      pauseReason: "TEAM_CREDIT_PAUSE_REASON_CUSTOMER_PAUSED",
      version: "4"
    }
  };
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      requests.push({ input: String(input), body: parseRequestBody(init.body) });
      return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });
  await api.request("credit_control", { organizationId: "org-1", teamId: "team-1" }, {
    accessToken: "access-token", requestId: "control-read"
  });
  await api.request("update_credit_control", {
    organizationId: "org-1",
    teamId: "team-1",
    hardLimitMicros: "40000000000",
    customerPaused: true,
    expectedVersion: "3",
    idempotencyKey: "control-update-1"
  }, { accessToken: "access-token", requestId: "control-update" });

  assert.equal(requests[0].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/GetTeamCreditControl");
  assert.deepEqual(requests[0].body, { organizationId: "org-1", teamId: "team-1" });
  assert.equal(requests[1].input, "https://dev.api.deep.navy/deepnavy.v1.BillingService/UpdateTeamCreditControl");
  assert.deepEqual(requests[1].body, {
    organizationId: "org-1",
    teamId: "team-1",
    hardLimitMicros: "40000000000",
    customerPaused: true,
    expectedVersion: "3",
    idempotencyKey: "control-update-1"
  });
});

test("GitHub sign-in start is a public AuthService call that returns an authorization URL", async () => {
  assert.ok(generated.PUBLIC_PROCEDURES.includes("github_sign_in_start"));
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return new Response(JSON.stringify({
        authorizationUrl: "https://github.com/apps/deep-navy/installations/new?state=server-state"
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const result = await api.signIn("github_sign_in_start", { returnTo: "/app/" }, { requestId: "sign-in-start" });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.AuthService/StartGitHubSignIn");
  assert.equal(new Headers(calls[0].init.headers).has("authorization"), false, "the public sign-in start carries no bearer token");
  assert.equal(new Headers(calls[0].init.headers).get("x-request-id"), "sign-in-start");
  assert.equal(calls[0].init.credentials, "omit");
  assert.deepEqual(parseRequestBody(calls[0].init.body), { returnTo: "/app/" });
  assert.equal(result.authorizationUrl, "https://github.com/apps/deep-navy/installations/new?state=server-state");
});

test("GitHub sign-in completion sends the parsed code, state, and installation ID and returns a session", async () => {
  assert.ok(generated.PUBLIC_PROCEDURES.includes("github_sign_in_complete"));
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return new Response(JSON.stringify({
        sessionToken: "session-token-1",
        expiresAt: "2026-07-18T08:00:00Z",
        user: { id: "user-1", githubLogin: "octocat", displayName: "Octo Cat", email: "octo@example.com" },
        memberships: [],
        pendingInstallation: { id: "987654321", organizationId: "" }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  // 987654321 is an intentionally non-production installation fixture.
  const result = await api.signIn("github_sign_in_complete", {
    authorizationCode: "one-time-code",
    stateToken: "server-bound-state",
    installationId: "987654321",
    returnTo: "/app/"
  }, { requestId: "sign-in-complete" });

  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.AuthService/CompleteGitHubSignIn");
  assert.equal(new Headers(calls[0].init.headers).has("authorization"), false, "sign-in completion runs before any session exists");
  assert.deepEqual(parseRequestBody(calls[0].init.body), {
    authorizationCode: "one-time-code",
    stateToken: "server-bound-state",
    installationId: "987654321",
    returnTo: "/app/"
  });
  assert.equal(result.sessionToken, "session-token-1");
  assert.equal(result.user.githubLogin, "octocat");
  assert.equal(result.user.displayName, "Octo Cat");
  assert.equal(String(result.pendingInstallation.id), "987654321");
});

test("sign-in completion omits a zero installation ID so the server resolves it from the user", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), body: parseRequestBody(init.body) });
      return new Response(JSON.stringify({
        sessionToken: "session-token-2",
        user: { id: "user-2", githubLogin: "hubot" },
        memberships: []
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.signIn("github_sign_in_complete", {
    authorizationCode: "code-2",
    stateToken: "state-2",
    installationId: "0",
    returnTo: ""
  }, { requestId: "sign-in-complete-2" });

  assert.deepEqual(calls[0].body, {
    authorizationCode: "code-2",
    stateToken: "state-2"
  }, "installationId 0 and an empty returnTo are omitted from canonical Protobuf JSON");
});

test("session sign-out revokes the caller's session through the authenticated AuthService", async () => {
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("sign_out"));
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("sign_out", {}, { accessToken: "session-token-1", requestId: "sign-out-1" });

  assert.equal(calls[0].input, "https://dev.api.deep.navy/deepnavy.v1.AuthService/SignOut");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), "Bearer session-token-1");
  assert.deepEqual(parseRequestBody(calls[0].init.body), {});
});

test("the public sign-in procedures still require a request ID for correlation", async () => {
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { throw new Error("must not run"); }
  });
  await assert.rejects(
    api.signIn("github_sign_in_start", { returnTo: "/app/" }, { requestId: "  " }),
    (error) => {
      assert.equal(error.name, "PlatformClientError");
      assert.equal(error.code, "invalid_argument");
      return true;
    }
  );
});

test("Connect errors expose only the safe top-level message and request ID", async () => {
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => new Response(JSON.stringify({
      code: "not_found",
      message: "No accessible installation was found."
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": "server-request"
      }
    })
  });

  await assert.rejects(
    api.request("github_installation", { organizationId: "org-1" }, { accessToken: "access-token", requestId: "client-request" }),
    (error) => {
      assert.equal(error.name, "PlatformClientError");
      assert.equal(error.code, "not_found");
      assert.equal(error.status, 404);
      assert.equal(error.requestId, "server-request");
      assert.equal(error.message, "No accessible installation was found.");
      return true;
    }
  );
});
