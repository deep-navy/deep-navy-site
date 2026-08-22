"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const client = readFileSync("assets/js/platform-api-client.js", "utf8");
const generated = Function(`${client}\nreturn deepNavyGeneratedClient;`)();

test("the PRD reference link is gated on the exact GitHub discussion shape", () => {
  assert.match(app, /function prdReferenceUrl/);
  assert.match(app, /url\.protocol !== "https:" \|\| url\.hostname !== "github\.com" \|\| url\.username \|\| url\.password \|\| url\.port \|\| url\.search \|\| url\.hash/);
  // The path grammar is pinned by exact text: owner, repository, the
  // discussions segment, and a bounded decimal number - nothing else.
  assert.ok(
    app.includes("/^\\/[A-Za-z0-9-]{1,39}\\/[A-Za-z0-9._-]{1,100}\\/discussions\\/[1-9][0-9]{0,9}$/"),
    "the discussion path grammar must stay pinned to owner/repo/discussions/number"
  );
  // Only prd_signoff consults the reference at all, and a failed parse
  // renders no link rather than throwing.
  assert.match(app, /const referenceUrl = prdSignoff \? prdReferenceUrl\(approval\.referenceUrl\) : "";/);
  assert.match(app, /if \(referenceUrl\) \{/);
  assert.match(app, /referenceLink\.textContent = "Read the PRD on GitHub"/);
  assert.match(app, /referenceLink\.rel = "noopener noreferrer"/);
  assert.match(app, /referenceLink\.referrerPolicy = "no-referrer"/);
  assert.match(app, /referenceUrl\.length <= 512/);
  assert.doesNotMatch(app, /innerHTML/);
});

test("a voided sign-off renders the reason instead of a decision", () => {
  assert.match(app, /function voidedApprovalStatus/);
  assert.match(app, /approval\.approvalStatus === 6/);
  assert.match(app, /voidedLabel\.textContent = prdSignoff \? "Sign-off voided" : "Request voided"/);
  assert.match(app, /voidedDetail\.textContent = voidedReason/);
  // The reason is bounded, and only the FAILED status may carry one: a
  // pending record claiming a voided reason rejects the whole page.
  assert.match(app, /voidedReason\.length <= 1000/);
  assert.match(app, /voidedReason \? voidedApprovalStatus\(approval\) : pendingApprovalStatus\(approval\)/);
  // A voided card carries no approve or deny controls.
  const voidedBlock = app.slice(app.indexOf("if (voidedReason) {"), app.indexOf("const reasonId"));
  assert.ok(voidedBlock.includes("return;"), "the voided card must finish before the decision controls are built");
});

test("the sign-off keeps its name through the flow, and only for prd_signoff", () => {
  assert.match(app, /const prdSignoff = actionType === "prd_signoff";/);
  assert.match(app, /pending \? "Saving…" : \(prdSignoff \? "Sign off" : "Approve"\)/);
  assert.match(app, /"Sign-off recorded\. The PRD is being locked as the signed record\."/);
  assert.match(app, /approved \? \(actionType === "prd_signoff" \? "Sign off" : "Approve"\) : "Deny"/);
});

test("the generated client surfaces the sign-off reference and voided reason", async () => {
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => new Response(JSON.stringify({
      approvals: [{
        id: "approval-7",
        teamId: "team-1",
        actionType: "prd_signoff",
        safeSummary: "Sign off on the launch PRD.",
        approvalStatus: "APPROVAL_STATUS_PENDING",
        referenceUrl: "https://github.com/deep-navy/product/discussions/12",
        referenceNodeId: "D_kwDONzQxNc4AV9zP"
      }],
      page: {}
    }), { status: 200, headers: { "Content-Type": "application/json" } })
  });
  const listed = await api.request("approvals", { teamId: "team-1", page: { pageSize: 100 } }, {
    accessToken: "access-token",
    requestId: "prd-signoff-list"
  });
  assert.equal(listed.approvals[0].referenceUrl, "https://github.com/deep-navy/product/discussions/12");
  assert.equal(listed.approvals[0].referenceNodeId, "D_kwDONzQxNc4AV9zP");
  assert.equal(listed.approvals[0].voidedReason, "");
});
