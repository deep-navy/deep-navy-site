"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const contract = require("../assets/js/customer-workspace-contract.js");

const ts = (seconds, nanos = 0) => ({ seconds: BigInt(seconds), nanos });
const money = (units, nanos = 0, currencyCode = "USD") => ({ units: BigInt(units), nanos, currencyCode });

function economicsSummary(overrides = {}) {
  return {
    scope: { type: 3, id: "team-1" },
    scopeType: "team",
    scopeId: "team-1",
    directCost: money(12, 500_000_000),
    creditsUsedMicros: 1_250_000n,
    creditsRemainingMicros: 48_750_000_000n,
    measuredAt: ts(1_750),
    reportingPeriod: { startedAt: ts(1_000), endedAt: ts(2_000) },
    ...overrides
  };
}

test("team economics is measured only with a canonical scope, values, time, and period", () => {
  const result = contract.validateEconomicsSummary(economicsSummary(), "team-1");
  assert.equal(result.directCost.nanos, 12_500_000_000n);
  assert.equal(result.creditsUsedMicros, 1_250_000n);
  assert.equal(result.measuredAt.getTime(), 1_750_000);

  assert.throws(() => contract.validateEconomicsSummary(economicsSummary({ measuredAt: undefined }), "team-1"), /measuredAt/);
  assert.throws(() => contract.validateEconomicsSummary(economicsSummary({ scope: { type: 3, id: "team-2" } }), "team-1"), /scope/);
  assert.throws(() => contract.validateEconomicsSummary(economicsSummary({ creditsRemainingMicros: -1n }), "team-1"), /allowed range/);
  assert.throws(() => contract.validateEconomicsSummary(economicsSummary({ directCost: money(1, -1) }), "team-1"), /canonical Money/);
  assert.throws(() => contract.validateEconomicsSummary(economicsSummary({ reportingPeriod: { startedAt: ts(1_800), endedAt: ts(2_000) } }), "team-1"), /measurement time/);
});

test("economics breakdown pages preserve one trustworthy measured snapshot", () => {
  const record = {
    scope: { type: 7, id: "initiative-1" },
    displayName: "Reduce setup time",
    usageEventCount: 5n,
    directCost: money(3),
    creditsUsedMicros: 300_000_000n,
    firstOccurredAt: ts(1_100),
    lastOccurredAt: ts(1_700)
  };
  const page = {
    breakdowns: [record],
    measuredAt: ts(1_750),
    reportingPeriod: { startedAt: ts(1_000), endedAt: ts(2_000) }
  };
  const first = contract.validateEconomicsBreakdownPage(page, { scopeType: 7 });
  assert.equal(first.snapshot.currency, "USD");
  assert.doesNotThrow(() => contract.validateEconomicsBreakdownPage({ ...page, breakdowns: [] }, { scopeType: 7 }, first.snapshot));
  assert.throws(() => contract.validateEconomicsBreakdownPage({ ...page, measuredAt: ts(1_751) }, { scopeType: 7 }, first.snapshot), /snapshot changed/);
  assert.throws(() => contract.validateEconomicsBreakdownPage({ ...page, breakdowns: [{ ...record, directCost: money(2, 0, "EUR") }] }, { scopeType: 7 }, first.snapshot), /currencies/);
  assert.throws(() => contract.validateEconomicsBreakdownPage({ ...page, breakdowns: [{ ...record, lastOccurredAt: ts(1_900) }] }, { scopeType: 7 }), /occurrence times/);
});

function activity(overrides = {}) {
  return {
    id: "activity-1",
    type: "a2a.message",
    sequence: 10n,
    environment: 1,
    customerId: "organization-1",
    organizationId: "organization-1",
    teamId: "team-1",
    agentId: "agent-1",
    sessionId: "session-1",
    workAssignmentId: "assignment-1",
    assignmentVersion: 2n,
    teamGeneration: 3n,
    objectiveId: "objective-1",
    initiativeId: "initiative-1",
    repositoryId: "101",
    occurredAt: ts(1_750),
    details: { from_agent_id: "agent-1", to_agent_id: "agent-2", message_kind: "handoff" },
    ...overrides
  };
}

const activityContext = {
  environment: "development",
  organizationId: "organization-1",
  teamId: "team-1",
  agentIds: new Set(["agent-1", "agent-2"]),
  repositoryIds: new Set(["101"])
};

test("activity is accepted only inside the selected environment, tenant, assignment, roster, and repository", () => {
  assert.equal(contract.validateActivityScope(activity(), activityContext).repositoryId, "101");
  assert.throws(() => contract.validateActivityScope(activity({ organizationId: "organization-2" }), activityContext), /organization or team/);
  assert.throws(() => contract.validateActivityScope(activity({ environment: 2 }), activityContext), /environment/);
  assert.throws(() => contract.validateActivityScope(activity({ workAssignmentId: "" }), activityContext), /workAssignmentId/);
  assert.throws(() => contract.validateActivityScope(activity({ repositoryId: "102" }), activityContext), /repository/);
  assert.throws(() => contract.validateActivityScope(activity({ details: { from_agent_id: "agent-1", to_agent_id: "agent-other", message_kind: "handoff" } }), activityContext), /A2A/);
});

test("artifact links cannot leave the selected GitHub repository", () => {
  const repository = { owner: "deep-navy", name: "site" };
  assert.equal(
    contract.validateGitHubArtifactUrl("https://github.com/deep-navy/site/pull/42", repository, "pull_request", "deep-navy/site:42"),
    "https://github.com/deep-navy/site/pull/42"
  );
  assert.throws(() => contract.validateGitHubArtifactUrl("https://github.com/another/repo/pull/42", repository, "pull_request", "deep-navy/site:42"), /selected repository/);
  assert.throws(() => contract.validateGitHubArtifactUrl("https://github.com/deep-navy/site/pull/42?token=secret", repository, "pull_request", "deep-navy/site:42"), /exact GitHub URL/);
});

test("session snapshots preserve the frozen newest-first started-at and ID order", () => {
  const newest = contract.sessionSort({ id: "session-z", startedAt: ts(2_000) });
  const sameTimeNext = contract.sessionSort({ id: "session-a", startedAt: ts(2_000) });
  const older = contract.sessionSort({ id: "session-y", startedAt: ts(1_900) });
  assert.equal(contract.sessionOrderedAfter(sameTimeNext, newest), true);
  assert.equal(contract.sessionOrderedAfter(older, sameTimeNext), true);
  assert.equal(contract.sessionOrderedAfter(newest, sameTimeNext), false);
});
