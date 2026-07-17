import { Code, ConnectError, createClient, type CallOptions } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

import { AuthService } from "../vendor/platform-protos/deepnavy/v1/auth_pb.js";
import { BillingService } from "../vendor/platform-protos/deepnavy/v1/billing_pb.js";
import {
  GitHubInstallationSetupAction,
  GitHubService
} from "../vendor/platform-protos/deepnavy/v1/github_pb.js";
import { OrganizationService } from "../vendor/platform-protos/deepnavy/v1/organizations_pb.js";
import { ProvisioningService } from "../vendor/platform-protos/deepnavy/v1/provisioning_pb.js";
import {
  RepositorySelectionMode,
  RepositoryService
} from "../vendor/platform-protos/deepnavy/v1/repositories_pb.js";
import { TeamService } from "../vendor/platform-protos/deepnavy/v1/teams_pb.js";

export const PLATFORM_PROTOS_REVISION = "fa01d7cc4c68c1e7ee606a44677ad70d16f4c563";

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
  "checkout",
  "billing_portal",
  "team",
  "teams",
  "create_team",
  "provisioning_status"
] as const);

type ProcedureName = (typeof SUPPORTED_PROCEDURES)[number];
type InputRecord = Record<string, unknown>;

export interface PlatformCallOptions {
  accessToken: string;
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
  const auth = createClient(AuthService, transport);
  const billing = createClient(BillingService, transport);
  const github = createClient(GitHubService, transport);
  const organizations = createClient(OrganizationService, transport);
  const provisioning = createClient(ProvisioningService, transport);
  const repositories = createClient(RepositoryService, transport);
  const teams = createClient(TeamService, transport);

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
        case "checkout":
          return await billing.createCheckoutSession({
            organizationId: textField(payload, "organizationId"),
            planId: textField(payload, "planId"),
            successUrl: textField(payload, "successUrl"),
            cancelUrl: textField(payload, "cancelUrl"),
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
        case "provisioning_status":
          return await provisioning.getProvisioningStatus({ teamId: textField(payload, "teamId") }, callOptions);
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

  return Object.freeze({ request });
}
