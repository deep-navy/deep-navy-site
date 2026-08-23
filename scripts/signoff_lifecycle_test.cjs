"use strict";

// The PRD sign-off is the canonical brass "needs you", and it used to live
// only in the approvals view - a screen reachable through one inline link
// buried in the plan detail. It now ALSO renders beside the conversation
// that produced the PRD, and these pin the lifecycle of that card: it is fed
// by the same validated approval objects the queue renders (never a second
// fetch, never a second validator), a voided sign-off keeps its reason and
// loses its controls in the console exactly as it does in the queue, a
// recorded sign-off holds a bounded locking beat instead of a spinner that
// never ends, and the overflow menu's approvals door carries the pending
// count so the queue stops being a secret.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("the sign-off card lives beside the conversation, before the composer", () => {
  assert.match(shell, /data-signoff-card/);
  assert.match(shell, /data-signoff-list/);
  assert.match(shell, /data-signoff-locking/);
  // Inside the console: after the thread, before the composer form, so the
  // decision sits at the tail of the exchange that produced it.
  const thread = shell.indexOf("data-conversation-thread");
  const card = shell.indexOf("data-signoff-card");
  // The boundary matters: data-conversation-format (the Markdown toggle in
  // the console head) contains this hook's name as a prefix.
  const composer = shell.indexOf("data-conversation-form>");
  assert.ok(thread !== -1 && card !== -1 && composer !== -1);
  assert.ok(thread < card && card < composer, "the sign-off card must sit between the thread and the composer");
});

test("one builder feeds both surfaces from the same validated approval objects", () => {
  // The queue and the console card are the same render pass over
  // session.approvals - the objects applyApprovalPage already validated.
  assert.match(app, /function appendApprovalCard\(list, approval, index, prefix\)/);
  assert.match(app, /session\.approvals\.forEach\(\(approval, index\) => appendApprovalCard\(ui\.approvalList, approval, index, "approval"\)\)/);
  assert.match(app, /session\.approvals\.filter\(\(approval\) => stringValue\(approval\.actionType\) === "prd_signoff"\)/);
  assert.match(app, /signoffs\.forEach\(\(approval, index\) => appendApprovalCard\(ui\.signoffList, approval, index, "signoff"\)\)/);
  const queue = between("function renderApprovalQueue()", "const count = session.approvals.length;");
  assert.match(queue, /renderSignoffCard\(\);/, "the queue render must repaint the console card in the same pass");
  // The console card submits through the very same decide flow.
  assert.match(app, /ui\.signoffList\.addEventListener\("submit", decideApproval\)/);
  // Distinct id prefixes keep the reason fields unique when one approval is
  // on screen twice.
  assert.match(app, /const reasonId = `\$\{prefix\}-reason-\$\{index\}`;/);
  assert.doesNotMatch(app, /innerHTML/);
});

test("a voided sign-off loses its controls in the console card too", () => {
  // The voided branch finishes before the decision controls are built, and
  // it lives in the shared builder - so the console card cannot grow a
  // decision the queue would refuse.
  const builder = between("function appendApprovalCard(list, approval, index, prefix)", "function renderSignoffCard()");
  const voidedBlock = builder.slice(builder.indexOf("if (voidedReason) {"), builder.indexOf("const reasonId"));
  assert.ok(voidedBlock.includes("return;"), "the voided card must finish before the decision controls are built");
  // The brass chip belongs to the undecided card alone; voided brings its
  // own coral label instead.
  assert.match(builder, /if \(consoleCard && !voidedReason\) \{/);
  assert.match(builder, /chip\.textContent = "Awaiting sign-off"/);
});

test("a recorded sign-off holds a bounded locking beat, not a spinner-forever", () => {
  // The copy is pinned in the markup, with the console's own typing dots.
  assert.match(shell, /Locking the discussion as the signed record…/);
  // Only an approved prd_signoff starts the beat.
  assert.match(app, /if \(actionType === "prd_signoff" && approved\) beginSignoffLockingBeat\(\);/);
  // The beat is bounded and generation-guarded, so a team switch mid-beat
  // can never repaint the wrong workspace.
  const begin = between("function beginSignoffLockingBeat()", "function stopSignoffLockingBeat()");
  assert.match(begin, /signoffLockingBeatMs/);
  assert.match(begin, /generation !== session\.workspaceGeneration/);
  // The card shows the beat and stays visible for it even with the queue
  // empty; the reset path stands everything down.
  const render = between("function renderSignoffCard()", "function renderApprovalQueue()");
  assert.match(render, /ui\.signoffLocking\.hidden = !locking/);
  assert.match(render, /ui\.signoffCard\.hidden = !signoffs\.length && !locking/);
  const reset = between("function resetApprovalView(", "function pendingApprovalStatus(");
  assert.match(reset, /stopSignoffLockingBeat\(\);/);
  assert.match(reset, /ui\.signoffCard\.hidden = true;/);
});

test("the approvals view has a real door, and the door carries the count", () => {
  // The overflow menu link exists and wraps the count element app-views.js
  // has been querying for since the router shipped.
  assert.match(shell, /data-view-link="approvals" href="#workspace-approvals">Approvals <span[^>]*data-approvals-count/);
  // app-views.js populates it from the rendered queue and re-counts on every
  // queue mutation, so the number can never disagree with the list.
  assert.match(views, /approvalList\.querySelectorAll\(":scope > li"\)\.length/);
  assert.match(views, /approvalsCount\.textContent = String\(n\)/);
  assert.match(views, /approvalsCount\.hidden = n === 0/);
  assert.match(views, /observer\.observe\(approvalList, \{ childList: true \}\)/);
});
