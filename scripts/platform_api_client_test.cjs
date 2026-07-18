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
  assert.equal(generated.PLATFORM_PROTOS_REVISION, "fa01d7cc4c68c1e7ee606a44677ad70d16f4c563");
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("github_install_complete"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("update_repository_selection"));
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
