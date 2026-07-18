((root, factory) => {
  "use strict";

  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  if (root) root.deepNavyCustomerWorkspaceContract = contract;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const MAX_INT64 = 9_223_372_036_854_775_807n;
  const MIN_INT64 = -9_223_372_036_854_775_808n;
  const controlCharacters = /[\u0000-\u001f\u007f]/;

  class ContractError extends Error {
    constructor(message, code = "invalid_customer_projection") {
      super(message);
      this.name = "ContractError";
      this.code = code;
    }
  }

  function stringValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function safeIdentifier(value, name, required = true) {
    if (value === undefined || value === null || value === "") {
      if (!required) return "";
      throw new ContractError(`${name} is required.`);
    }
    if (typeof value !== "string" || value !== value.trim() || value.length > 256 || controlCharacters.test(value)) {
      throw new ContractError(`${name} is invalid.`);
    }
    return value;
  }

  function int64(value, name, { nonNegative = false, positive = false } = {}) {
    const normalized = typeof value === "bigint"
      ? value.toString()
      : typeof value === "number" && Number.isSafeInteger(value)
        ? String(value)
        : typeof value === "string"
          ? value.trim()
          : "";
    if (!/^-?(?:0|[1-9][0-9]{0,18})$/.test(normalized)) throw new ContractError(`${name} is not an int64 value.`);
    const parsed = BigInt(normalized);
    if (parsed < MIN_INT64 || parsed > MAX_INT64 || (nonNegative && parsed < 0n) || (positive && parsed <= 0n)) {
      throw new ContractError(`${name} is outside its allowed range.`);
    }
    return parsed;
  }

  function timestampDate(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContractError(`${name} is required.`);
    const seconds = int64(value.seconds ?? 0, `${name}.seconds`);
    const nanos = Number(value.nanos ?? 0);
    if (!Number.isInteger(nanos) || nanos < 0 || nanos > 999_999_999) throw new ContractError(`${name}.nanos is invalid.`);
    const milliseconds = seconds * 1000n + BigInt(Math.floor(nanos / 1_000_000));
    if (milliseconds < -8_640_000_000_000_000n || milliseconds > 8_640_000_000_000_000n) {
      throw new ContractError(`${name} is outside the JavaScript date range.`);
    }
    const date = new Date(Number(milliseconds));
    if (Number.isNaN(date.getTime())) throw new ContractError(`${name} is invalid.`);
    return date;
  }

  function moneyValue(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContractError(`${name} is required.`);
    const currency = stringValue(value.currencyCode);
    const units = int64(value.units ?? 0, `${name}.units`);
    const nanos = Number(value.nanos ?? 0);
    if (!/^[A-Z]{3}$/.test(currency) || !Number.isInteger(nanos) || Math.abs(nanos) > 999_999_999 ||
      (units > 0n && nanos < 0) || (units < 0n && nanos > 0)) {
      throw new ContractError(`${name} is not canonical Money.`);
    }
    return { currency, nanos: units * 1_000_000_000n + BigInt(nanos) };
  }

  function economicsScopeType(value) {
    if (value === 3 || value === "ECONOMICS_SCOPE_TYPE_TEAM") return "team";
    if (value === 2 || value === "ECONOMICS_SCOPE_TYPE_ORGANIZATION") return "organization";
    return "";
  }

  function validateReportingPeriod(period, measuredAt, name = "reportingPeriod") {
    if (!period || typeof period !== "object" || Array.isArray(period)) throw new ContractError(`${name} is required.`);
    const startedAt = timestampDate(period.startedAt, `${name}.startedAt`);
    const endedAt = timestampDate(period.endedAt, `${name}.endedAt`);
    if (endedAt <= startedAt || measuredAt < startedAt || measuredAt >= endedAt) {
      throw new ContractError(`${name} does not contain the measurement time.`);
    }
    return { startedAt, endedAt };
  }

  function validateEconomicsSummary(summary, teamId) {
    if (!summary || typeof summary !== "object" || Array.isArray(summary)) throw new ContractError("EconomicsSummary is required.");
    const expectedTeamId = safeIdentifier(teamId, "teamId");
    const canonicalType = economicsScopeType(summary.scope?.type);
    const canonicalId = safeIdentifier(summary.scope?.id, "economics.scope.id");
    if (canonicalType !== "team" || canonicalId !== expectedTeamId) throw new ContractError("EconomicsSummary is outside the selected team scope.");

    const legacyType = stringValue(summary.scopeType).toLowerCase();
    const legacyId = stringValue(summary.scopeId);
    if ((legacyType && legacyType !== canonicalType) || (legacyId && legacyId !== canonicalId)) {
      throw new ContractError("EconomicsSummary has conflicting legacy scope fields.");
    }

    const directCost = moneyValue(summary.directCost, "economics.directCost");
    const creditsUsedMicros = int64(summary.creditsUsedMicros, "economics.creditsUsedMicros", { nonNegative: true });
    const creditsRemainingMicros = int64(summary.creditsRemainingMicros, "economics.creditsRemainingMicros", { nonNegative: true });
    const measuredAt = timestampDate(summary.measuredAt, "economics.measuredAt");
    const reportingPeriod = validateReportingPeriod(summary.reportingPeriod, measuredAt, "economics.reportingPeriod");
    if (directCost.nanos < 0n) throw new ContractError("economics.directCost cannot be negative.");

    return { directCost, creditsUsedMicros, creditsRemainingMicros, measuredAt, reportingPeriod };
  }

  function periodFingerprint(period) {
    return `${period.startedAt.getTime()}:${period.endedAt.getTime()}`;
  }

  function validateEconomicsBreakdownPage(response, definition, previousSnapshot = null) {
    if (!response || typeof response !== "object" || Array.isArray(response)) throw new ContractError("Economics breakdown page is required.");
    const expectedScopeType = Number(definition?.scopeType);
    if (!Number.isInteger(expectedScopeType) || expectedScopeType <= 0) throw new TypeError("definition.scopeType must be a positive enum value");
    const records = Array.isArray(response.breakdowns) ? response.breakdowns : [];
    if (records.length > 100) throw new ContractError("Economics breakdown page exceeds 100 records.");
    const measuredAt = timestampDate(response.measuredAt, "breakdowns.measuredAt");
    const reportingPeriod = validateReportingPeriod(response.reportingPeriod, measuredAt, "breakdowns.reportingPeriod");
    const snapshot = {
      measuredAt: measuredAt.getTime(),
      reportingPeriod: periodFingerprint(reportingPeriod),
      currency: previousSnapshot?.currency || ""
    };
    if (previousSnapshot && (snapshot.measuredAt !== previousSnapshot.measuredAt || snapshot.reportingPeriod !== previousSnapshot.reportingPeriod)) {
      throw new ContractError("Economics breakdown snapshot changed during pagination.");
    }

    const ids = new Set();
    for (const record of records) {
      const id = safeIdentifier(record?.scope?.id, "breakdown.scope.id");
      const displayName = safeIdentifier(record?.displayName, "breakdown.displayName");
      if (record?.scope?.type !== expectedScopeType || ids.has(id) || displayName.length > 256) {
        throw new ContractError("Economics breakdown scope is invalid or duplicated.");
      }
      ids.add(id);
      const usageEventCount = int64(record.usageEventCount, "breakdown.usageEventCount", { positive: true });
      const creditsUsedMicros = int64(record.creditsUsedMicros, "breakdown.creditsUsedMicros", { nonNegative: true });
      const directCost = moneyValue(record.directCost, "breakdown.directCost");
      if (usageEventCount <= 0n || directCost.nanos < 0n) throw new ContractError("Economics breakdown values are invalid.");
      if (snapshot.currency && snapshot.currency !== directCost.currency) throw new ContractError("Economics breakdown currencies are inconsistent.");
      snapshot.currency = directCost.currency;
      const firstOccurredAt = timestampDate(record.firstOccurredAt, "breakdown.firstOccurredAt");
      const lastOccurredAt = timestampDate(record.lastOccurredAt, "breakdown.lastOccurredAt");
      if (firstOccurredAt < reportingPeriod.startedAt || lastOccurredAt < firstOccurredAt || lastOccurredAt > measuredAt || lastOccurredAt >= reportingPeriod.endedAt) {
        throw new ContractError("Economics breakdown occurrence times are invalid.");
      }
      void creditsUsedMicros;
    }
    return { records, measuredAt, reportingPeriod, snapshot };
  }

  function environmentValue(value) {
    if (value === 1 || value === "ENVIRONMENT_DEVELOPMENT") return "development";
    if (value === 2 || value === "ENVIRONMENT_PRODUCTION") return "production";
    return "";
  }

  function valueSet(values) {
    if (values instanceof Set) return values;
    if (Array.isArray(values)) return new Set(values);
    return new Set();
  }

  function validateActivityScope(event, context) {
    if (!event || typeof event !== "object" || Array.isArray(event)) throw new ContractError("ActivityEvent is required.");
    const organizationId = safeIdentifier(context?.organizationId, "context.organizationId");
    const teamId = safeIdentifier(context?.teamId, "context.teamId");
    const expectedEnvironment = stringValue(context?.environment).toLowerCase();
    const actualEnvironment = environmentValue(event.environment);
    if (!["development", "production"].includes(expectedEnvironment) || actualEnvironment !== expectedEnvironment) {
      throw new ContractError("ActivityEvent is outside the deployed environment.");
    }
    if (safeIdentifier(event.customerId, "activity.customerId") !== organizationId ||
      safeIdentifier(event.organizationId, "activity.organizationId") !== organizationId ||
      safeIdentifier(event.teamId, "activity.teamId") !== teamId) {
      throw new ContractError("ActivityEvent is outside the selected organization or team.");
    }

    const agents = valueSet(context?.agentIds);
    const repositories = valueSet(context?.repositoryIds);
    const agentId = safeIdentifier(event.agentId, "activity.agentId");
    if (!agents.has(agentId)) throw new ContractError("ActivityEvent references an agent outside the selected team.");
    const repositoryId = safeIdentifier(event.repositoryId, "activity.repositoryId");
    if (!/^[1-9][0-9]{0,18}$/.test(repositoryId) || !repositories.has(repositoryId)) {
      throw new ContractError("ActivityEvent references a repository outside the selected team scope.");
    }
    safeIdentifier(event.id, "activity.id");
    safeIdentifier(event.sessionId, "activity.sessionId");
    safeIdentifier(event.workAssignmentId, "activity.workAssignmentId");
    safeIdentifier(event.objectiveId, "activity.objectiveId");
    safeIdentifier(event.initiativeId, "activity.initiativeId", false);
    int64(event.sequence, "activity.sequence", { positive: true });
    int64(event.teamGeneration, "activity.teamGeneration", { positive: true });
    int64(event.assignmentVersion, "activity.assignmentVersion", { positive: true });
    timestampDate(event.occurredAt, "activity.occurredAt");

    if (stringValue(event.type) === "a2a.message") {
      const fromAgentId = safeIdentifier(event.details?.from_agent_id, "activity.details.from_agent_id");
      const toAgentId = safeIdentifier(event.details?.to_agent_id, "activity.details.to_agent_id");
      if (fromAgentId !== agentId || !agents.has(fromAgentId) || !agents.has(toAgentId)) {
        throw new ContractError("A2A activity references an agent outside the selected team.");
      }
    }
    return { organizationId, teamId, agentId, repositoryId };
  }

  function validateGitHubArtifactUrl(value, repository, artifactType, artifactId) {
    const raw = stringValue(value);
    if (!raw) return "";
    const owner = safeIdentifier(repository?.owner, "repository.owner");
    const name = safeIdentifier(repository?.name, "repository.name");
    const type = stringValue(artifactType);
    const id = safeIdentifier(artifactId, "artifactId");
    let url;
    try { url = new URL(raw); } catch { throw new ContractError("Artifact URL is invalid."); }
    if (url.protocol !== "https:" || url.host !== "github.com" || url.username || url.password || url.search || url.hash || url.pathname.includes("//")) {
      throw new ContractError("Artifact URL is not an exact GitHub URL.");
    }
    const prefix = `/${owner}/${name}`;
    const exact = type === "issue"
      ? `${prefix}/issues/${id.split(/[:#]/).at(-1)}`
      : type === "pull_request"
        ? `${prefix}/pull/${id.split(/[:#]/).at(-1)}`
        : type === "commit"
          ? `${prefix}/commit/${id}`
          : "";
    if ((exact && url.pathname !== exact) || (!exact && url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`))) {
      throw new ContractError("Artifact URL is outside the selected repository.");
    }
    return url.toString();
  }

  function sessionSort(record) {
    return {
      id: safeIdentifier(record?.id, "session.id"),
      startedAt: timestampDate(record?.startedAt, "session.startedAt").getTime()
    };
  }

  function sessionOrderedAfter(current, previous) {
    if (!previous) return true;
    return current.startedAt < previous.startedAt || (current.startedAt === previous.startedAt && current.id.localeCompare(previous.id) < 0);
  }

  return Object.freeze({
    ContractError,
    moneyValue,
    sessionOrderedAfter,
    sessionSort,
    timestampDate,
    validateActivityScope,
    validateEconomicsBreakdownPage,
    validateEconomicsSummary,
    validateGitHubArtifactUrl
  });
});
