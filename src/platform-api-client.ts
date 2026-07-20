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

export const PLATFORM_PROTOS_REVISION = "f4463a6fec905bf4f7886e1e56424879d9a173f7";

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
  "billing_portal",
  "team",
  "teams",
  "create_team",
  "suspend_team",
  "resume_team",
  "delete_team",
  "provisioning_status",
  "agents",
  "economics",
  "economics_breakdowns",
  "objectives",
  "create_objective",
  "initiatives",
  "sessions",
  "workspace_changes",
  "github_issues",
  "github_pull_requests",
  "approvals",
  "decide_approval",
  "sign_out"
] as const);

// Public sign-in procedures are called before a session exists, so they carry
// no bearer token and are routed through signIn() rather than request().
export const PUBLIC_PROCEDURES = Object.freeze([
  "github_sign_in_start",
  "github_sign_in_complete"
] as const);

export const PLATFORM_CAPABILITIES = Object.freeze({
  activityStream: true,
  provisioningStream: true,
  economicsRead: true,
  agentList: true,
  objectiveSubmission: true,
  objectiveDiscovery: true,
  initiativeDiscoveryByObjective: true,
  sessionHistory: true,
  workspaceChangeHistory: true,
  githubIssueHistory: true,
  githubPullRequestHistory: true,
  approvalDecision: true,
  approvalDiscovery: true
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
  const safeFetch: typeof globalThis.fetch = (input, init) => fetchImplementation(input, {
    ...init,
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    referrerPolicy: "no-referrer"
  });
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
        case "update_repository_selection": {
          const repositoryIds = Array.isArray(payload.githubRepositoryIds)
            ? payload.githubRepositoryIds.map((id) => int64Field(id, "githubRepositoryIds", false))
            : [];
          return await repositories.updateRepositorySelection({
            organizationId: textField(payload, "organizationId"),
            mode: selectionMode(payload.mode),
            githubRepositoryIds: repositoryIds,
            idempotencyKey: textField(payload, "idempotencyKey"),
            expectedVersion: int64Field(payload.expectedVersion, "expectedVersion")
          }, callOptions);
        }
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
          return await teams.createTeam({ organizationId: textField(payload, "organizationId"), name: textField(payload, "name"), idempotencyKey: textField(payload, "idempotencyKey") }, callOptions);
        case "suspend_team":
          return await teams.suspendTeam({ id: textField(payload, "id"), reason: textField(payload, "reason", false) }, callOptions);
        case "resume_team":
          return await teams.resumeTeam({ id: textField(payload, "id") }, callOptions);
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
        case "objectives":
          return await objectives.listBusinessObjectives({ teamId: textField(payload, "teamId"), page: pageRequest(payload.page) }, callOptions);
        case "create_objective":
          return await objectives.createBusinessObjective({
            teamId: textField(payload, "teamId"),
            title: textField(payload, "title"),
            description: textField(payload, "description"),
            idempotencyKey: textField(payload, "idempotencyKey")
          }, callOptions);
        case "initiatives":
          return await initiatives.listInitiatives({ objectiveId: textField(payload, "objectiveId"), page: pageRequest(payload.page) }, callOptions);
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
            githubRepositoryId: int64Field(payload.githubRepositoryId, "githubRepositoryId", false),
            page: pageRequest(payload.page)
          }, callOptions);
        case "github_pull_requests":
          return await githubDelivery.listGitHubPullRequests({
            organizationId: textField(payload, "organizationId"),
            teamId: textField(payload, "teamId"),
            githubRepositoryId: int64Field(payload.githubRepositoryId, "githubRepositoryId", false),
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

  return Object.freeze({ request, signIn, streamTeamActivity, streamProvisioningStatus });
}
