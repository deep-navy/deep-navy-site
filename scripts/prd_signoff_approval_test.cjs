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

test("the PRD decision is an accept button plus the conversation, and only for prd_signoff", () => {
  assert.match(app, /const prdSignoff = actionType === "prd_signoff";/);
  // The customer asked for exactly this shape: accept the PRD as written with
  // one button, or keep talking to the Product Manager - not a verdict with a
  // required reason. The flow underneath is still the sign-off (the platform
  // locks the discussion as the signed record); only the words changed.
  assert.match(app, /pending \? "Saving…" : \(prdSignoff \? "Accept the PRD" : "Approve"\)/);
  assert.match(app, /"Sign-off recorded\. The PRD is being locked as the signed record\."/);
  assert.match(app, /approved \? \(actionType === "prd_signoff" \? "Accept the PRD" : "Approve"\) : "Deny"/);
  // On the console card the second control is a walk to the composer, not a
  // formal Deny - a recorded decline still exists on the Decisions queue.
  assert.match(app, /Request changes in the chat/);
  assert.match(app, /Nothing is locked until you accept/);
  const branchStart = app.indexOf("if (consoleCard && prdSignoff) {");
  const consoleBlock = app.slice(branchStart, app.indexOf("} else {", branchStart));
  assert.doesNotMatch(consoleBlock, /approvalDecision = "deny"/, "the console sign-off card offers conversation, not Deny");
});

test("while a sign-off waits, the decision is the only text entry on screen", () => {
  // A live screen showed two open inputs - the decision note and the chat
  // composer - both saying "type here" about the same moment. The composer
  // yields while a PRD sign-off is undecided and returns when the customer
  // chooses "Request changes in the chat" or the sign-off resolves.
  assert.match(app, /function awaitingPrdSignoff/);
  assert.match(app, /=== "prd_signoff" && !stringValue\(approval\.voidedReason\)/);
  assert.match(app, /ui\.conversationForm\.hidden = awaitingPrdSignoff\(\) && !session\.signoffComposerRequested;/);
  // The flag never outlives the sign-off it was granted for.
  assert.match(app, /if \(!awaitingPrdSignoff\(\)\) session\.signoffComposerRequested = false;/);
  assert.match(app, /signoffComposerRequested: false,/);
  // Reveal happens BEFORE focus - a hidden input cannot take focus - and the
  // sign-off card render re-decides composer visibility from the approvals
  // it just drew.
  const converseStart = app.indexOf('converse.addEventListener("click"');
  const converseBlock = app.slice(converseStart, app.indexOf("});", converseStart));
  const revealAt = converseBlock.indexOf("session.signoffComposerRequested = true");
  const syncAt = converseBlock.indexOf("syncConversationComposer()");
  const focusAt = converseBlock.indexOf("ui.conversationInput?.focus()");
  assert.ok(revealAt >= 0 && syncAt > revealAt && focusAt > syncAt, "converse must reveal, sync, then focus");
  const signoffRenderStart = app.indexOf("function renderSignoffCard");
  const signoffRenderBlock = app.slice(signoffRenderStart, app.indexOf("function renderApprovalQueue"));
  assert.match(signoffRenderBlock, /syncConversationComposer\(\);/);
  // The two-paths copy no longer points "below" at a composer that is hidden
  // while the decision waits.
  assert.doesNotMatch(app, /just reply to your Product Manager below/);
  assert.match(app, /request changes in the chat and tell your Product Manager/);
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
