import { Code, ConnectError, createClient, type CallOptions } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

import { ActivityService } from "../vendor/platform-protos/deepnavy/v1/activity_pb.js";
import { AgentService } from "../vendor/platform-protos/deepnavy/v1/agents_pb.js";
import {
  ApprovalService,
  ApprovalStatus
} from "../vendor/platform-protos/deepnavy/v1/approvals_pb.js";
import { AuthService } from "../vendor/platform-protos/deepnavy/v1/auth_pb.js";
import { BillingService } from "../vendor/platform-protos/deepnavy/v1/billing_pb.js";
import { TeamConversationService } from "../vendor/platform-protos/deepnavy/v1/conversations_pb.js";
import { EconomicsScopeType, EconomicsService } from "../vendor/platform-protos/deepnavy/v1/economics_pb.js";
import {
  GitHubInstallationSetupAction,
  GitHubService
} from "../vendor/platform-protos/deepnavy/v1/github_pb.js";
import { GitHubDeliveryService } from "../vendor/platform-protos/deepnavy/v1/github_delivery_pb.js";
import { InitiativeService } from "../vendor/platform-protos/deepnavy/v1/initiatives_pb.js";
import { ObjectiveService } from "../vendor/platform-protos/deepnavy/v1/objectives_pb.js";
import { OrganizationService } from "../vendor/platform-protos/deepnavy/v1/organizations_pb.js";
import { ProvisioningService } from "../vendor/platform-protos/deepnavy/v1/provisioning_pb.js";
import {
  RepositorySelectionMode,
  RepositoryService
} from "../vendor/platform-protos/deepnavy/v1/repositories_pb.js";
import { SessionService } from "../vendor/platform-protos/deepnavy/v1/sessions_pb.js";
import { TeamService } from "../vendor/platform-protos/deepnavy/v1/teams_pb.js";
import { WorkspaceService } from "../vendor/platform-protos/deepnavy/v1/workspaces_pb.js";

export const PLATFORM_PROTOS_REVISION = "ee74ecd10c336cca1b5d5b2821d35182d2d7e5c8";

export const SUPPORTED_PROCEDURES = Object.freeze([
  "current_user",
  "bootstrap_organization",
  "select_organization",
  "github_installation",
  "github_install_start",
  "github_install_complete",
  "repositories",
  "repository_selection",
  "update_repository_selection",
  "billing_plan",
  "subscription",
  "invoices",
  "invoice",
  "checkout",
  "credit_packs",
  "credit_pack_checkout",
  "credit_balance",
  "credit_control",
  "update_credit_control",
  "credit_top_up_settings",
  "update_credit_top_up_settings",
  "credit_top_ups",
  "billing_portal",
  "team",
  "teams",
  "create_team",
  "request_team",
  "set_team_engineer_count",
  "suspend_team",
  "resume_team",
  "update_team_repositories",
  "team_repositories",
  "delete_team",
  "provisioning_status",
  "agents",
  "economics",
  "economics_breakdowns",
  "economics_daily",
  "objectives",
  "create_objective",
  "initiatives",
  "sessions",
  "workspace_changes",
  "github_issues",
  "github_pull_requests",
  "approvals",
  "decide_approval",
  "send_team_message",
  "list_team_question_sets",
  "answer_team_questions",
  "sign_out"
] as const);

/* The streaming half of the ceiling.
 *
 * SUPPORTED_PROCEDURES above is the list of procedures request() can serve, and
 * every one of them is unary. The server-streaming procedures have always been
 * reachable only as named generator functions on the client object, so "what may
 * this browser subscribe to" had no list to read at all - a screen asking whether
 * it could follow something had to grep for a method name. StreamCreditMovements
 * is the fourth, and the fourth is where that stops being tolerable.
 *
 * The two lists are kept DISJOINT on purpose. A stream name in
 * SUPPORTED_PROCEDURES would be a lie: request() has no case for it and would
 * answer not_configured, so a caller trusting the documented ceiling would be
 * told the procedure exists and then be refused it. The `stream_` prefix also
 * keeps `provisioning_status` (unary GetProvisioningStatus) from colliding with
 * StreamProvisioningStatus, which is a genuinely different call.
 *
 * platform_api_client_test.cjs holds both halves: disjointness, and that every
 * name here resolves to a real function on the client. */
export const STREAM_PROCEDURES = Object.freeze([
  "stream_team_activity",
  "stream_team_conversation",
  "stream_provisioning_status",
  "stream_credit_movements"
] as const);

// Public sign-in procedures are called before a session exists, so they carry
// no bearer token and are routed through signIn() rather than request().
export const PUBLIC_PROCEDURES = Object.freeze([
  "github_sign_in_start",
  "github_sign_in_complete",
  // Public because the httpOnly cookie IS the authorization: there is no bearer
  // token yet on a fresh page load, which is exactly the case it exists for.
  "refresh_session"
] as const);

export const PLATFORM_CAPABILITIES = Object.freeze({
  activityStream: true,
  provisioningStream: true,
  economicsRead: true,
  agentList: true,
  objectiveSubmission: true,
  objectiveDiscovery: true,
  initiativeDiscoveryByObjective: true,
  initiativeDiscoveryByTeam: true,
  teamRepositoryGrant: true,
  sessionHistory: true,
  workspaceChangeHistory: true,
  githubIssueHistory: true,
  githubPullRequestHistory: true,
  approvalDecision: true,
  approvalDiscovery: true,
  conversationSend: true,
  conversationStream: true,
  conversationQuestions: true,
  creditMovementStream: true
});

type ProcedureName = (typeof SUPPORTED_PROCEDURES)[number];
type PublicProcedureName = (typeof PUBLIC_PROCEDURES)[number];
type InputRecord = Record<string, unknown>;

export interface PlatformCallOptions {
  accessToken: string;
  requestId: string;
  signal?: AbortSignal;
}

export interface PublicCallOptions {
  requestId: string;
  signal?: AbortSignal;
}

export interface PlatformApiOptions {
  baseUrl: string;
  defaultTimeoutMs?: number;
  fetch?: typeof globalThis.fetch;
}

export class PlatformClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string;

  constructor(message: string, code: string, status: number, requestId: string) {
    super(message);
    this.name = "PlatformClientError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

function inputRecord(input: unknown): InputRecord {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new PlatformClientError("The request payload is invalid.", "invalid_argument", 400, "");
  return input as InputRecord;
}

function textField(input: InputRecord, name: string, required = true): string {
  const value = typeof input[name] === "string" ? input[name].trim() : "";
  if (required && !value) throw new PlatformClientError(`${name} is required.`, "invalid_argument", 400, "");
  return value;
}

/* The customer's answers, checked into the shape the contract expects.
 *
 * Every value is validated rather than passed through: this is the one payload
 * a person composes by hand in a browser, and the server refuses an option
 * nobody offered, so sending a malformed set would fail the whole submission
 * with a message the customer cannot act on. Better to be exact here. */
function answerList(input: InputRecord): { questionId: string; optionIds: string[]; text: string }[] {
  const raw = input.answers;
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new PlatformClientError("answers is required.", "invalid_argument", 400, "");
  }
  return raw.map((entry) => {
    const record = entry && typeof entry === "object" ? entry as InputRecord : {};
    const questionId = typeof record.questionId === "string" ? record.questionId.trim() : "";
    if (!questionId) {
      throw new PlatformClientError("every answer needs its question.", "invalid_argument", 400, "");
    }
    const optionIds = Array.isArray(record.optionIds)
      ? record.optionIds.filter((value): value is string => typeof value === "string" && value.trim() !== "").map((value) => value.trim())
      : [];
    const text = typeof record.text === "string" ? record.text.trim() : "";
    return { questionId, optionIds, text };
  });
}

function int64Field(value: unknown, name: string, allowZero = true): bigint {
  const normalized = typeof value === "bigint"
    ? value.toString()
    : typeof value === "number" && Number.isSafeInteger(value)
      ? String(value)
      : typeof value === "string"
        ? value.trim()
        : "";
  const pattern = allowZero ? /^(?:0|[1-9][0-9]{0,18})$/ : /^[1-9][0-9]{0,18}$/;
  if (!pattern.test(normalized)) throw new PlatformClientError(`${name} is invalid.`, "invalid_argument", 400, "");
  const parsed = BigInt(normalized);
  if (parsed > 9_223_372_036_854_775_807n) throw new PlatformClientError(`${name} exceeds int64.`, "invalid_argument", 400, "");
  return parsed;
}

// Repeated int64 ids at the UI boundary (e.g. the per-team repository choice).
// Every element must be a positive int64; an empty or absent list is allowed —
// the server treats it as "no explicit choice", never as authorization.
function int64ListField(value: unknown, name: string): bigint[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new PlatformClientError(`${name} is invalid.`, "invalid_argument", 400, "");
  return value.map((id) => int64Field(id, name, false));
}

function int32Field(value: unknown, name: string, allowZero = true): number {
  const normalized = typeof value === "number"
    ? value
    : typeof value === "string" && value.trim() !== ""
      ? Number(value.trim())
      : NaN;
  if (!Number.isInteger(normalized) || normalized < 0 || normalized > 2_147_483_647) throw new PlatformClientError(`${name} is invalid.`, "invalid_argument", 400, "");
  if (!allowZero && normalized === 0) throw new PlatformClientError(`${name} must be positive.`, "invalid_argument", 400, "");
  return normalized;
}

function pageRequest(value: unknown): { pageSize: number; pageToken: string } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const page = value as InputRecord;
  const size = typeof page.pageSize === "number" && Number.isInteger(page.pageSize) ? page.pageSize : 0;
  return { pageSize: size, pageToken: typeof page.pageToken === "string" ? page.pageToken : "" };
}

function booleanField(input: InputRecord, name: string): boolean {
  if (typeof input[name] !== "boolean") throw new PlatformClientError(`${name} is required.`, "invalid_argument", 400, "");
  return input[name];
}

function economicsScopeType(value: unknown, name: string): EconomicsScopeType {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  const values: Record<string, EconomicsScopeType> = {
    organization: EconomicsScopeType.ORGANIZATION,
    team: EconomicsScopeType.TEAM,
    agent: EconomicsScopeType.AGENT,
    agent_role: EconomicsScopeType.AGENT_ROLE,
    objective: EconomicsScopeType.OBJECTIVE,
    initiative: EconomicsScopeType.INITIATIVE,
    issue: EconomicsScopeType.ISSUE,
    pull_request: EconomicsScopeType.PULL_REQUEST,
    repository: EconomicsScopeType.REPOSITORY,
    session: EconomicsScopeType.SESSION,
    model: EconomicsScopeType.MODEL,
    provider: EconomicsScopeType.PROVIDER,
    operation: EconomicsScopeType.OPERATION
  };
  const result = values[normalized];
  if (result === undefined) throw new PlatformClientError(`${name} is invalid.`, "invalid_argument", 400, "");
  return result;
}

function setupAction(value: unknown): GitHubInstallationSetupAction {
  if (value === GitHubInstallationSetupAction.INSTALL || value === "GIT_HUB_INSTALLATION_SETUP_ACTION_INSTALL") return GitHubInstallationSetupAction.INSTALL;
  if (value === GitHubInstallationSetupAction.UPDATE || value === "GIT_HUB_INSTALLATION_SETUP_ACTION_UPDATE") return GitHubInstallationSetupAction.UPDATE;
  if (value === GitHubInstallationSetupAction.UNSPECIFIED || value === "GIT_HUB_INSTALLATION_SETUP_ACTION_UNSPECIFIED") return GitHubInstallationSetupAction.UNSPECIFIED;
  throw new PlatformClientError("setupAction is invalid.", "invalid_argument", 400, "");
}

function selectionMode(value: unknown): RepositorySelectionMode {
  if (value === RepositorySelectionMode.ALL_ACCESSIBLE || value === "REPOSITORY_SELECTION_MODE_ALL_ACCESSIBLE") return RepositorySelectionMode.ALL_ACCESSIBLE;
  if (value === RepositorySelectionMode.SELECTED || value === "REPOSITORY_SELECTION_MODE_SELECTED") return RepositorySelectionMode.SELECTED;
  throw new PlatformClientError("mode is invalid.", "invalid_argument", 400, "");
}

function codeName(code: Code): string {
  return ({
    [Code.Canceled]: "canceled",
    [Code.Unknown]: "unknown",
    [Code.InvalidArgument]: "invalid_argument",
    [Code.DeadlineExceeded]: "deadline_exceeded",
    [Code.NotFound]: "not_found",
    [Code.AlreadyExists]: "already_exists",
    [Code.PermissionDenied]: "permission_denied",
    [Code.ResourceExhausted]: "resource_exhausted",
    [Code.FailedPrecondition]: "failed_precondition",
    [Code.Aborted]: "aborted",
    [Code.OutOfRange]: "out_of_range",
    [Code.Unimplemented]: "unimplemented",
    [Code.Internal]: "internal",
    [Code.Unavailable]: "unavailable",
    [Code.DataLoss]: "data_loss",
    [Code.Unauthenticated]: "unauthenticated"
  } satisfies Record<number, string>)[code] || "unknown";
}

function httpStatus(code: Code): number {
  return ({
    [Code.Canceled]: 499,
    [Code.Unknown]: 500,
    [Code.InvalidArgument]: 400,
    [Code.DeadlineExceeded]: 504,
    [Code.NotFound]: 404,
    [Code.AlreadyExists]: 409,
    [Code.PermissionDenied]: 403,
    [Code.ResourceExhausted]: 429,
    [Code.FailedPrecondition]: 412,
    [Code.Aborted]: 409,
    [Code.OutOfRange]: 400,
    [Code.Unimplemented]: 501,
    [Code.Internal]: 500,
    [Code.Unavailable]: 503,
    [Code.DataLoss]: 500,
    [Code.Unauthenticated]: 401
  } satisfies Record<number, number>)[code] || 500;
}

function normalizedBaseUrl(value: string): string {
  try {
    const url = new URL(value);
    const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    if ((url.protocol !== "https:" && !localHttp) || url.username || url.password || url.search || url.hash) return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function createPlatformApi(options: PlatformApiOptions) {
  const baseUrl = normalizedBaseUrl(options.baseUrl);
  if (!baseUrl) throw new PlatformClientError("The platform API origin is invalid.", "invalid_configuration", 0, "");
  const fetchImplementation = options.fetch || globalThis.fetch;
  if (typeof fetchImplementation !== "function") throw new PlatformClientError("Fetch is unavailable.", "invalid_configuration", 0, "");
  // Every call sends and accepts nothing but its bearer token. The three
  // exceptions below are the session cookie's whole lifecycle: sign-in receives
  // it, refresh presents it, sign-out is told to drop it. "omit" would make the
  // browser ignore Set-Cookie as well as withhold it, so the exception has to
  // cover receiving the cookie and not only sending it.
  //
  // Scoped by procedure rather than switched on for the transport: the cookie is
  // useless to any other endpoint, and a credential that travels further than it
  // is needed is a credential with a wider blast radius.
  const credentialedProcedures = Object.freeze([
    "/deepnavy.v1.AuthService/CompleteGitHubSignIn",
    "/deepnavy.v1.AuthService/RefreshSession",
    "/deepnavy.v1.AuthService/SignOut"
  ]);
  const safeFetch: typeof globalThis.fetch = (input, init) => {
    const target = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const credentialed = credentialedProcedures.some((procedure) => target.endsWith(procedure));
    return fetchImplementation(input, {
      ...init,
      cache: "no-store",
      credentials: credentialed ? "include" : "omit",
      redirect: "error",
      referrerPolicy: "no-referrer"
    });
  };
  const transport = createConnectTransport({
    baseUrl,
    defaultTimeoutMs: options.defaultTimeoutMs ?? 15_000,
    fetch: safeFetch,
    useBinaryFormat: false,
    useHttpGet: false
  });
  const activity = createClient(ActivityService, transport);
  const agents = createClient(AgentService, transport);
  const approvals = createClient(ApprovalService, transport);
  const auth = createClient(AuthService, transport);
  const billing = createClient(BillingService, transport);
  const conversations = createClient(TeamConversationService, transport);
  const economics = createClient(EconomicsService, transport);
  const github = createClient(GitHubService, transport);
  const githubDelivery = createClient(GitHubDeliveryService, transport);
  const initiatives = createClient(InitiativeService, transport);
  const objectives = createClient(ObjectiveService, transport);
  const organizations = createClient(OrganizationService, transport);
  const provisioning = createClient(ProvisioningService, transport);
  const repositories = createClient(RepositoryService, transport);
  const sessionHistory = createClient(SessionService, transport);
  const teams = createClient(TeamService, transport);
  const workspaceHistory = createClient(WorkspaceService, transport);

  async function request(name: ProcedureName, input: unknown, options: PlatformCallOptions): Promise<unknown> {
    const payload = inputRecord(input);
    const accessToken = options.accessToken.trim();
    const requestId = options.requestId.trim();
    if (!accessToken) throw new PlatformClientError("Sign-in is required.", "unauthenticated", 401, requestId);
    const callOptions: CallOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Request-ID": requestId
      },
      signal: options.signal
    };

    try {
      switch (name) {
        case "current_user":
          return await auth.getCurrentUser({}, callOptions);
        case "bootstrap_organization":
          return await organizations.bootstrapOrganization({ name: textField(payload, "name"), idempotencyKey: textField(payload, "idempotencyKey") }, callOptions);
        case "select_organization":
          return await organizations.selectOrganization({ organizationId: textField(payload, "organizationId") }, callOptions);
        case "github_installation":
          return await github.getGitHubInstallation({ organizationId: textField(payload, "organizationId") }, callOptions);
        case "github_install_start":
          return await github.startGitHubInstallation({ organizationId: textField(payload, "organizationId"), idempotencyKey: textField(payload, "idempotencyKey") }, callOptions);
        case "github_install_complete":
          return await github.completeGitHubInstallation({
            organizationId: textField(payload, "organizationId"),
            installationId: int64Field(payload.installationId, "installationId"),
            setupAction: setupAction(payload.setupAction),
            stateToken: textField(payload, "stateToken"),
            idempotencyKey: textField(payload, "idempotencyKey"),
            authorizationCode: textField(payload, "authorizationCode")
          }, callOptions);
        case "repositories":
          return await repositories.listRepositories({ organizationId: textField(payload, "organizationId"), page: pageRequest(payload.page) }, callOptions);
        case "repository_selection":
          return await repositories.getRepositorySelection({ organizationId: textField(payload, "organizationId") }, callOptions);
        case "update_repository_selection":
          return await repositories.updateRepositorySelection({
            organizationId: textField(payload, "organizationId"),
            mode: selectionMode(payload.mode),
            githubRepositoryIds: int64ListField(payload.githubRepositoryIds, "githubRepositoryIds"),
            idempotencyKey: textField(payload, "idempotencyKey"),
            expectedVersion: int64Field(payload.expectedVersion, "expectedVersion")
          }, callOptions);
        case "billing_plan":
          return await billing.getBillingPlan({ planId: textField(payload, "planId") }, callOptions);
        case "subscription":
          return await billing.getSubscription({ organizationId: textField(payload, "organizationId") }, callOptions);
        case "invoices":
          return await billing.listInvoices({
            organizationId: textField(payload, "organizationId"),
            page: pageRequest(payload.page)
          }, callOptions);
        case "invoice":
          return await billing.getInvoice({
            organizationId: textField(payload, "organizationId"),
            invoiceId: textField(payload, "invoiceId")
          }, callOptions);
        case "checkout":
          return await billing.createCheckoutSession({
            organizationId: textField(payload, "organizationId"),
            planId: textField(payload, "planId"),
            returnUrl: textField(payload, "returnUrl"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "credit_packs":
          return await billing.listCreditPacks({
            organizationId: textField(payload, "organizationId")
          }, callOptions);
        case "credit_pack_checkout":
          return await billing.createCreditPackCheckoutSession({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId"),
            creditPackId: textField(payload, "creditPackId"),
            quantity: int64Field(payload.quantity, "quantity", false),
            returnUrl: textField(payload, "returnUrl"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "credit_balance":
          return await billing.getCreditBalance({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId")
          }, callOptions);
        case "credit_control":
          return await billing.getTeamCreditControl({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId")
          }, callOptions);
        case "update_credit_control":
          return await billing.updateTeamCreditControl({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId"),
            hardLimitMicros: int64Field(payload.hardLimitMicros, "hardLimitMicros", false),
            customerPaused: booleanField(payload, "customerPaused"),
            expectedVersion: int64Field(payload.expectedVersion, "expectedVersion", false),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        // ── Automatic credit top-up ──────────────────────────────────────
        // Read is open to any organization member; the write requires owner or
        // billing and carries the consent the card networks require for an
        // unscheduled off-session charge.
        case "credit_top_up_settings":
          return await billing.getCreditTopUpSettings({
            organizationId: textField(payload, "organizationId")
          }, callOptions);
        case "update_credit_top_up_settings":
          return await billing.updateCreditTopUpSettings({
            organizationId: textField(payload, "organizationId"),
            enabled: booleanField(payload, "enabled"),
            thresholdMicros: int64Field(payload.thresholdMicros, "thresholdMicros", false),
            creditPackId: textField(payload, "creditPackId"),
            packQuantity: int64Field(payload.packQuantity, "packQuantity", false),
            periodCapMinor: int64Field(payload.periodCapMinor, "periodCapMinor", false),
            // Optional on the wire: it is REQUIRED when enabling or re-arming
            // and the server refuses the request without it rather than
            // defaulting one. A client must never invent a version.
            consentTermsVersion: textField(payload, "consentTermsVersion", false),
            reArm: booleanField(payload, "reArm"),
            // Zero is legitimate here, and only here: an organization that has
            // never stored a settings row has no version to match.
            expectedVersion: int64Field(payload.expectedVersion, "expectedVersion"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "credit_top_ups":
          return await billing.listCreditTopUps({
            organizationId: textField(payload, "organizationId"),
            page: pageRequest(payload.page)
          }, callOptions);
        case "billing_portal":
          return await billing.createBillingPortalSession({
            organizationId: textField(payload, "organizationId"),
            returnUrl: textField(payload, "returnUrl"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "team":
          return await teams.getTeam({ id: textField(payload, "id") }, callOptions);
        case "teams":
          return await teams.listTeams({ organizationId: textField(payload, "organizationId"), page: pageRequest(payload.page) }, callOptions);
        case "create_team":
          return await teams.createTeam({
            organizationId: textField(payload, "organizationId"),
            name: textField(payload, "name"),
            idempotencyKey: textField(payload, "idempotencyKey"),
            repositoryIds: int64ListField(payload.repositoryIds, "repositoryIds")
          }, callOptions);
        case "request_team":
          return await teams.requestTeam({
            organizationId: textField(payload, "organizationId"),
            name: textField(payload, "name"),
            idempotencyKey: textField(payload, "idempotencyKey"),
            engineerCount: int32Field(payload.engineerCount ?? 0, "engineerCount"),
            objective: textField(payload, "objective", false),
            repositoryIds: int64ListField(payload.repositoryIds, "repositoryIds")
          }, callOptions);
        case "set_team_engineer_count":
          return await teams.setTeamEngineerCount({
            teamId: textField(payload, "teamId"),
            engineerCount: int32Field(payload.engineerCount, "engineerCount", false),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "suspend_team":
          return await teams.suspendTeam({ id: textField(payload, "id"), reason: textField(payload, "reason", false) }, callOptions);
        case "resume_team":
          return await teams.resumeTeam({ id: textField(payload, "id") }, callOptions);
        case "update_team_repositories":
          // The team's own repository selection replaced in full. The server
          // revalidates every id against the active installation and enqueues
          // a re-provision; the empty list is rejected server-side and the UI
          // never submits it, so the ids ride the same strict int64 list the
          // create path uses.
          return await teams.updateTeamRepositories({
            id: textField(payload, "id"),
            repositoryIds: int64ListField(payload.repositoryIds, "repositoryIds"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "team_repositories":
          // The team's own grant, which is not the organization's projection and
          // not the installation's reach. A repository that has lost access is
          // still in the grant and still returned; hiding it would make a broken
          // team look correctly configured.
          return await teams.listTeamRepositories({ teamId: textField(payload, "teamId"), page: pageRequest(payload.page) }, callOptions);
        case "delete_team":
          return await teams.deleteTeam({ id: textField(payload, "id") }, callOptions);
        case "provisioning_status":
          return await provisioning.getProvisioningStatus({ teamId: textField(payload, "teamId") }, callOptions);
        case "agents":
          return await agents.listAgents({ teamId: textField(payload, "teamId"), page: pageRequest(payload.page) }, callOptions);
        case "economics":
          return await economics.getEconomics({ scopeType: textField(payload, "scopeType"), scopeId: textField(payload, "scopeId") }, callOptions);
        case "economics_breakdowns": {
          const page = pageRequest(payload.page);
          if (page && (page.pageSize < 0 || page.pageSize > 100)) throw new PlatformClientError("pageSize is invalid.", "invalid_argument", 400, requestId);
          return await economics.listEconomicsBreakdowns({
            parentScope: { type: economicsScopeType(payload.parentScopeType, "parentScopeType"), id: textField(payload, "parentScopeId") },
            groupBy: economicsScopeType(payload.groupBy, "groupBy"),
            pageSize: page?.pageSize || 0,
            pageToken: page?.pageToken || ""
          }, callOptions);
        }
        // The day series behind "spend over time". The server bounds how long a
        // period may be, so there is no cursor and none is invented here. An
        // empty reporting_period selects the organization's current
        // subscription period, which is the period the rest of this screen
        // already reports — asking for anything else would put two different
        // periods on one page.
        case "economics_daily":
          return await economics.listEconomicsDaily({
            scope: { type: economicsScopeType(payload.scopeType, "scopeType"), id: textField(payload, "scopeId") }
          }, callOptions);
        case "objectives":
          return await objectives.listBusinessObjectives({ teamId: textField(payload, "teamId"), page: pageRequest(payload.page) }, callOptions);
        case "create_objective":
          return await objectives.createBusinessObjective({
            teamId: textField(payload, "teamId"),
            title: textField(payload, "title"),
            description: textField(payload, "description"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "initiatives": {
          // Exactly one scope. The server rejects both-or-neither rather than
          // preferring one, so the client refuses the same shape rather than
          // discovering it as a 400 at the far end.
          const objectiveId = textField(payload, "objectiveId", false);
          const teamId = textField(payload, "teamId", false);
          if (!objectiveId === !teamId) throw new PlatformClientError("Exactly one of objectiveId and teamId is required.", "invalid_argument", 400, requestId);
          return await initiatives.listInitiatives({ objectiveId, teamId, page: pageRequest(payload.page) }, callOptions);
        }
        case "sessions":
          return await sessionHistory.listSessions({
            teamId: textField(payload, "teamId"),
            agentId: textField(payload, "agentId", false),
            objectiveId: textField(payload, "objectiveId", false),
            initiativeId: textField(payload, "initiativeId", false),
            sessionId: textField(payload, "sessionId", false),
            repositoryId: textField(payload, "repositoryId", false),
            page: pageRequest(payload.page)
          }, callOptions);
        case "workspace_changes":
          return await workspaceHistory.listWorkspaceChanges({
            teamId: textField(payload, "teamId"),
            afterSequence: int64Field(payload.afterSequence ?? 0, "afterSequence"),
            agentId: textField(payload, "agentId", false),
            sessionId: textField(payload, "sessionId", false),
            objectiveId: textField(payload, "objectiveId", false),
            initiativeId: textField(payload, "initiativeId", false),
            repositoryId: textField(payload, "repositoryId", false),
            page: pageRequest(payload.page)
          }, callOptions);
        case "github_issues":
          return await githubDelivery.listGitHubIssues({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId"),
            githubRepositoryId: int64Field(payload.githubRepositoryId ?? 0, "githubRepositoryId"),
            page: pageRequest(payload.page)
          }, callOptions);
        case "github_pull_requests":
          return await githubDelivery.listGitHubPullRequests({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId"),
            githubRepositoryId: int64Field(payload.githubRepositoryId ?? 0, "githubRepositoryId"),
            page: pageRequest(payload.page)
          }, callOptions);
        case "approvals":
          return await approvals.listApprovals({
            teamId: textField(payload, "teamId"),
            approvalStatus: ApprovalStatus.PENDING,
            page: pageRequest(payload.page)
          }, callOptions);
        case "decide_approval":
          return await approvals.decideApproval({
            id: textField(payload, "id"),
            approved: booleanField(payload, "approved"),
            reason: textField(payload, "reason", false)
          }, callOptions);
        case "send_team_message":
          return await conversations.sendTeamMessage({
            teamId: textField(payload, "teamId"),
            text: textField(payload, "text"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "list_team_question_sets":
          return await conversations.listTeamQuestionSets({
            teamId: textField(payload, "teamId")
          }, callOptions);
        case "answer_team_questions":
          // The answers are passed through as the generated message rather than
          // rebuilt field by field. They were assembled from the question set the
          // server sent, so re-deriving them here would be a second chance to
          // disagree with what the customer was actually asked.
          return await conversations.answerTeamQuestions({
            questionSetId: textField(payload, "questionSetId"),
            idempotencyKey: textField(payload, "idempotencyKey"),
            answers: { answers: answerList(payload) }
          }, callOptions);
        case "sign_out":
          return await auth.signOut({}, callOptions);
        default:
          throw new PlatformClientError("The requested generated procedure is not available.", "not_configured", 0, requestId);
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the platform service."
        : connectError.rawMessage.slice(0, 300) || "The platform service rejected the request.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  async function signIn(name: PublicProcedureName, input: unknown, options: PublicCallOptions): Promise<unknown> {
    const payload = inputRecord(input);
    const requestId = options.requestId.trim();
    if (!requestId) throw new PlatformClientError("A request ID is required.", "invalid_argument", 400, "");
    const callOptions: CallOptions = {
      headers: { "X-Request-ID": requestId },
      signal: options.signal
    };

    try {
      switch (name) {
        case "github_sign_in_start":
          return await auth.startGitHubSignIn({ returnTo: textField(payload, "returnTo", false) }, callOptions);
        case "refresh_session":
          return await auth.refreshSession({}, callOptions);
        case "github_sign_in_complete":
          return await auth.completeGitHubSignIn({
            authorizationCode: textField(payload, "authorizationCode"),
            stateToken: textField(payload, "stateToken"),
            installationId: int64Field(payload.installationId ?? 0, "installationId"),
            returnTo: textField(payload, "returnTo", false)
          }, callOptions);
        default:
          throw new PlatformClientError("The requested public procedure is not available.", "not_configured", 0, requestId);
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the platform service."
        : connectError.rawMessage.slice(0, 300) || "The platform service rejected the sign-in request.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  async function* streamTeamActivity(input: unknown, options: PlatformCallOptions) {
    const payload = inputRecord(input);
    const accessToken = options.accessToken.trim();
    const requestId = options.requestId.trim();
    if (!accessToken) throw new PlatformClientError("Sign-in is required.", "unauthenticated", 401, requestId);
    const callOptions: CallOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Request-ID": requestId
      },
      signal: options.signal,
      timeoutMs: 0
    };

    try {
      for await (const response of activity.streamTeamActivity({
        teamId: textField(payload, "teamId"),
        afterSequence: int64Field(payload.afterSequence ?? 0, "afterSequence")
      }, callOptions)) {
        yield response;
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the activity service."
        : connectError.rawMessage.slice(0, 300) || "The activity service rejected the stream.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  async function* streamTeamConversation(input: unknown, options: PlatformCallOptions) {
    const payload = inputRecord(input);
    const accessToken = options.accessToken.trim();
    const requestId = options.requestId.trim();
    if (!accessToken) throw new PlatformClientError("Sign-in is required.", "unauthenticated", 401, requestId);
    const callOptions: CallOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Request-ID": requestId
      },
      signal: options.signal,
      timeoutMs: 0
    };

    try {
      for await (const response of conversations.streamTeamConversation({
        teamId: textField(payload, "teamId"),
        afterSequence: int64Field(payload.afterSequence ?? 0, "afterSequence")
      }, callOptions)) {
        yield response;
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the conversation service."
        : connectError.rawMessage.slice(0, 300) || "The conversation service rejected the stream.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  async function* streamProvisioningStatus(input: unknown, options: PlatformCallOptions) {
    const payload = inputRecord(input);
    const accessToken = options.accessToken.trim();
    const requestId = options.requestId.trim();
    if (!accessToken) throw new PlatformClientError("Sign-in is required.", "unauthenticated", 401, requestId);
    const callOptions: CallOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Request-ID": requestId
      },
      signal: options.signal,
      timeoutMs: 0
    };

    try {
      for await (const response of provisioning.streamProvisioningStatus({
        teamId: textField(payload, "teamId"),
        afterSequence: int64Field(payload.afterSequence ?? 0, "afterSequence")
      }, callOptions)) {
        yield response;
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the provisioning service."
        : connectError.rawMessage.slice(0, 300) || "The provisioning service rejected the stream.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  /* StreamCreditMovements, shaped exactly like the three streams above: bearer
   * token in a header, no client timeout, the caller's AbortSignal, and an
   * afterSequence cursor. The identical shape is the point - the contract says
   * it "follows StreamTeamActivity's resume shape exactly, because a second
   * cursor idiom on the same console is a second way to lose a row", and the
   * transport layer is where that promise is either kept or quietly broken. */
  async function* streamCreditMovements(input: unknown, options: PlatformCallOptions) {
    const payload = inputRecord(input);
    const accessToken = options.accessToken.trim();
    const requestId = options.requestId.trim();
    if (!accessToken) throw new PlatformClientError("Sign-in is required.", "unauthenticated", 401, requestId);
    const callOptions: CallOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Request-ID": requestId
      },
      signal: options.signal,
      timeoutMs: 0
    };

    try {
      for await (const response of economics.streamCreditMovements({
        teamId: textField(payload, "teamId"),
        afterSequence: int64Field(payload.afterSequence ?? 0, "afterSequence")
      }, callOptions)) {
        yield response;
      }
    } catch (error) {
      if (error instanceof PlatformClientError) throw error;
      const connectError = ConnectError.from(error);
      const responseRequestId = connectError.metadata.get("x-request-id") || requestId;
      const safeMessage = connectError.code === Code.Unknown
        ? "The browser could not reach the economics service."
        : connectError.rawMessage.slice(0, 300) || "The economics service rejected the stream.";
      throw new PlatformClientError(safeMessage, codeName(connectError.code), httpStatus(connectError.code), responseRequestId);
    }
  }

  return Object.freeze({ request, signIn, streamTeamActivity, streamTeamConversation, streamProvisioningStatus, streamCreditMovements });
}
