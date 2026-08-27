"use strict";

// A team failed provisioning at 03:29 and the console never said so.
//
// Four separate defects made a dead team look alive, and every one of them was
// a customer-facing lie the suite could not see:
//
//   1. renderProvisioningProgress hid the whole progress surface when
//      provisioningProgress answered null — which it does on FAILED and
//      CANCELED. The bar vanished at 92%, mid-sentence, under "waiting for your
//      team's gateway to come online", and the floor then said nothing at all.
//   2. teamPhase had no `failed` branch. Terminal failure parks a team in
//      `pending` with a dead command, `pending` sat behind the objective check,
//      and a dead team fell through to `running` — wearing the pulsing live
//      badge.
//   3. renderPendingTeamGuidance told a customer who had already paid that the
//      team "is awaiting payment confirmation" and to delete it and create it
//      again, without ever consulting provisioning.failed.
//   4. The terminal poll message offered deletion as the only remedy, when the
//      launch contract already exposes a non-destructive `resume` for exactly
//      this state.
//
// These pin the three claims that matter: a team that is not running never
// renders as live, a paid-but-failed team is never told to delete and re-create
// itself, and the progress bar either finishes or fails — it never vanishes.
//
// Plus the ladder underneath them. NOTICE_LEVELS is the design system's, ported
// verbatim, and it is the only place severity is defined; a second table with
// its own opinion about how loud an error is would put this repo back where it
// started.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const icons = readFileSync("_includes/icons.svg", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const ladder = require("../assets/js/notice-levels.js");
const contract = require("../assets/js/launch-contract.js");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

// PROVISIONING_STATE and PROVISIONING_STEP as the wire numbers the console
// actually receives, so these are the server's shapes and not a paraphrase.
const STATE = { QUEUED: 1, RUNNING: 2, RETRYING: 3, SUCCEEDED: 4, FAILED: 5, CANCELED: 6 };
const STEP = { QUEUED: 1, NAMESPACE: 3, GATEWAY: 6, READY: 7, DELETING: 10 };
const DELETE_OPERATION = 4;

// The 03:29 team: the build died waiting on the gateway, and the lifecycle is
// still `pending`, because that is where terminal failure parks a team.
const failedAtGateway = { provisioningState: STATE.FAILED, provisioningStep: STEP.GATEWAY, safeError: "" };

test("the severity ladder is the design system's, ported verbatim", () => {
  // Word, glyph, tone, rank, needsYou, sticky — the whole table, exactly as
  // components/notify/Notice.jsx exports it. If a row here stops matching the
  // system, the console has started having its own opinion about severity.
  assert.deepEqual(Object.keys(ladder.NOTICE_LEVELS), ["blocked", "error", "warning", "tip", "running", "success", "info"]);
  assert.deepEqual(ladder.NOTICE_LEVELS.blocked, { word: "Blocked", glyph: "octagon-alert", tone: "danger", rank: 0, needsYou: true, sticky: true });
  assert.deepEqual(ladder.NOTICE_LEVELS.error, { word: "Error", glyph: "circle-x", tone: "danger", rank: 1, sticky: true });
  assert.deepEqual(ladder.NOTICE_LEVELS.warning, { word: "Warning", glyph: "triangle-alert", tone: "attention", rank: 2 });
  assert.deepEqual(ladder.NOTICE_LEVELS.tip, { word: "Tip", glyph: "lightbulb", tone: "tip", rank: 3 });
  assert.deepEqual(ladder.NOTICE_LEVELS.running, { word: "Running", glyph: "radio", tone: "live", rank: 4 });
  assert.deepEqual(ladder.NOTICE_LEVELS.success, { word: "Done", glyph: "circle-check-big", tone: "success", rank: 5 });
  assert.deepEqual(ladder.NOTICE_LEVELS.info, { word: "Update", glyph: "info", tone: "idle", rank: 6 });

  // An unknown level is an update, not a crash and not an error.
  assert.equal(ladder.level("nonsense").word, "Update");
  assert.equal(ladder.levelClass("dn-notice", "error"), "dn-notice--danger");
  assert.equal(ladder.levelClass("dn-nitem", "tip"), "dn-nitem--tip");

  // Rank then time, never time alone: an hour-old blocker outranks a
  // ten-second-old success.
  const sorted = [
    { level: "success", time: 1_000 },
    { level: "blocked", time: 1 },
    { level: "warning", time: 900 }
  ].sort(ladder.compareNotices);
  assert.deepEqual(sorted.map((notice) => notice.level), ["blocked", "warning", "success"]);
});

test("severity is defined in exactly one place, and its glyphs resolve", () => {
  // The console names a level; it never restates what a level looks like.
  assert.match(app, /const noticeLevels = window\.deepNavyNoticeLevels \|\| null;/);
  assert.match(app, /function noticeShape\(levelName\) \{\s*\n\s*return noticeLevels\?\.level\?\.\(levelName\) \|\| null;\s*\n\s*\}/);
  // No second table anywhere in the console — not even a one-row "fallback",
  // which is exactly how a local copy of the ladder starts. An absent ladder
  // yields no severity rather than an invented one; the fact itself is still
  // stated, because the stopped bar says so in words on its own.
  assert.doesNotMatch(app, /word:\s*"(?:Blocked|Error|Warning|Tip|Running|Done|Update)"/);
  assert.doesNotMatch(app, /glyph:\s*"(?:circle-x|triangle-alert|lightbulb|radio|circle-check-big)"/);
  assert.match(app, /if \(!shape\) return null;/);
  // And the ladder's glyph names resolve in this repo's sprite by the LADDER's
  // names, so no translation table sits between the two and gets its own
  // opinion.
  for (const level of Object.values(ladder.NOTICE_LEVELS)) {
    assert.ok(icons.includes(`id="i-${level.glyph}"`), `the sprite is missing the ladder's ${level.glyph}`);
  }
  // The toast reads its tone from the ladder rather than putting a level name
  // straight into an attribute for the stylesheet to reinterpret.
  const toast = between("function toast(message, level) {", "function setFieldError");
  assert.match(toast, /const shape = noticeShape\(level\) \|\| noticeShape\("info"\);/);
  assert.match(toast, /ui\.toast\.dataset\.tone = shape\?\.tone \|\| "idle";/);
  assert.match(toast, /if \(shape\?\.sticky\) return;/);
  // A sticky toast with no exit is a permanent overlay, so it has one.
  assert.match(toast, /dismiss\.addEventListener\("click"/);
  assert.match(main, /\.toast\[data-tone="danger"\]/);
});

// ── Defect 2 ───────────────────────────────────────────────────────────────
// teamPhase and its badge table are lifted out of app.js and run for real, over
// the real launch contract, so this is a behavioural claim about a failed team
// rather than a pattern match on the text that produces it.
function loadTeamPhase() {
  // The slice starts at the in-progress predicate so it carries BOTH helpers:
  // teamPhase's assembling branch calls teamProvisioningInProgress, and a
  // harness that omitted it announced the phase change with "not defined".
  const failedPredicate = between("function teamProvisioningInProgress(team) {", "\n  // The objective the floor is about");
  const phase = between("function teamPhase(team) {", "\n  // The measure the team exists for");
  const factory = new Function(
    "launchContract", "lifecycleLabel", "signedInt64Value", "stringValue", "objectiveAcceptanceState", "session",
    `${failedPredicate}\n${phase}\nreturn teamPhase;`
  );
  return factory(
    contract,
    (value) => (typeof value === "number" ? ["", "pending", "active", "suspended", "deleting", "deleted", "failed"][value] || "" : String(value || "")),
    () => null,
    (value) => String(value == null ? "" : value),
    () => "proven",
    { creditControl: null, objectiveListsByTeam: new Map() }
  );
}

function loadPhaseBadges() {
  const source = between("const TEAM_PHASE_BADGE = Object.freeze({", "\n  function renderTeamHeadline()");
  return new Function(`${source}\nreturn TEAM_PHASE_BADGE;`)();
}

test("a team that failed provisioning never renders the live badge", () => {
  const teamPhase = loadTeamPhase();
  const badges = loadPhaseBadges();

  // The 03:29 shape: lifecycle still `pending`, command terminally failed.
  assert.equal(teamPhase({ id: "t1", state: "pending", provisioning: failedAtGateway }), "failed");
  // The lifecycle enum's own failed value, and a failed command on a team the
  // roster has not re-read yet — both are the same fact to a customer.
  assert.equal(teamPhase({ id: "t1", state: 6 }), "failed");
  assert.equal(teamPhase({ id: "t1", state: "", provisioning: failedAtGateway }), "failed");
  // A CANCELED command is deliberately NOT this phase. "Stopped" is a state
  // somebody chose and cancellation is one; "failed" is the one nobody chose.
  // The progress bar still shows the cancellation in place — the two surfaces
  // agree without either of them inventing a severity.
  assert.equal(teamPhase({ id: "t1", state: "pending", provisioning: { provisioningState: STATE.CANCELED } }), "halted");
  assert.ok(contract.provisioningStopped({ provisioningState: STATE.CANCELED, provisioningStep: STEP.NAMESPACE }).canceled);

  // The badge for it is not live and says so in a word, not only a hue.
  assert.equal(badges.failed.live, false);
  assert.match(badges.failed.label, /failed/i);
  // It names a LEVEL, and the ladder supplies the glyph and the tone — so the
  // badge cannot end up with a severity of its own.
  assert.equal(badges.failed.level, "error");
  assert.equal(badges.failed.className, undefined);
  assert.equal(ladder.level(badges.failed.level).glyph, "circle-x");
  assert.equal(ladder.levelClass("dn-badge", badges.failed.level), "dn-badge--danger");
  assert.match(app, /ui\.teamPhase\.append\(spriteIcon\(shape\.glyph, 13\)\);/);

  // And `running` stays the only phase in the whole table that claims to be
  // happening right now. This is the pin that would have caught the original
  // fall-through: any new phase that forgets `live: false` fails here.
  const live = Object.entries(badges).filter(([, badge]) => badge.live === true).map(([name]) => name);
  assert.deepEqual(live, ["running"]);

  // A failed DELETE is a different fact with a different remedy, and it must
  // not be dressed as failed setup — the deleting lifecycle keeps it.
  assert.equal(teamPhase({ id: "t1", state: "deleting", provisioning: { provisioningState: STATE.FAILED, provisioningStep: STEP.DELETING, operationType: DELETE_OPERATION } }), "halted");

  // A healthy team is untouched by any of this.
  assert.equal(teamPhase({ id: "t1", state: "active", provisioning: { provisioningState: STATE.SUCCEEDED, provisioningStep: STEP.READY } }), "interviewing");
});

// ── Defect 3 ───────────────────────────────────────────────────────────────
test("a paid-but-failed team is never told to delete and re-create it", () => {
  const guidance = between("function renderPendingTeamGuidance(team) {", "function resetWorkspaceViews");
  // The branch exists at all: the screen consults the provisioning record
  // rather than reading `pending` and assuming what it means.
  assert.match(guidance, /const stopped = !deleting && teamProvisioningFailed\(team\);/);

  // The sentence the customer actually reads, evaluated as a pure function of
  // the three facts that decide it.
  const expression = guidance.match(/ui\.dashboardState\.textContent = ([\s\S]*?);\n {4}resetAgentView/);
  assert.ok(expression, "the guidance line is still a single expression this test can evaluate");
  const sentence = new Function("deleting", "stopped", "assembling", "name", `return ${expression[1]};`);

  const failed = sentence(false, true, false, "Atlas");
  // The expensive advice is gone from the failed path: a customer who has paid
  // must never be invited to delete and pay again over a fault that was ours.
  // Deletion may still be MENTIONED — "you do not need to delete it" is the
  // sentence that retires the old advice — but never as an instruction, which
  // is what an imperative "Delete …" opening a clause would be.
  assert.doesNotMatch(failed, /delete this team and create it again/i);
  assert.doesNotMatch(failed, /create it again/i);
  assert.doesNotMatch(failed, /(?:^|[.;:—-]\s+)[Dd]elete\b/);
  assert.match(failed, /you do not need to delete it/i);
  assert.doesNotMatch(failed, /awaiting payment/i);
  // What happened, what it means, what happens next — in that order.
  assert.match(failed, /^Atlas's setup stopped before it finished/);
  assert.match(failed, /never started running/);
  assert.match(failed, /Retry setup/);

  // And the genuinely-abandoned-checkout case keeps its own correct advice,
  // because that advice was never wrong — only misapplied.
  const pending = sentence(false, false, false, "Atlas");
  assert.match(pending, /awaiting payment confirmation/);
  assert.match(pending, /delete this team and create it again/);

  // A removal in flight still reads as a removal.
  assert.match(sentence(true, false, false, "Atlas"), /being removed/);
});

// ── Defect 4 ───────────────────────────────────────────────────────────────
test("the terminal message offers the remedy the API can actually perform", () => {
  const poll = between("async function pollPendingTeam(teamId)", "function toast(message, level)");
  const terminal = poll.match(/target\._pollingMessage = "Setup stopped[^"]*"/);
  assert.ok(terminal, "the terminal provisioning message still exists to be checked");
  assert.doesNotMatch(terminal[0], /[Dd]elete this team and try again/);
  assert.match(terminal[0], /Retry setup/);
  assert.match(terminal[0], /deleting it is not required/);

  // Not an invented remedy: the contract offers `resume` for exactly this
  // state, ahead of `delete`, and the team row already renders it.
  const controls = contract.teamLifecycleControls("pending", failedAtGateway);
  assert.deepEqual(controls, ["resume", "delete"]);
  assert.match(app, /const label = lifecycleLabel\(team\?\.state\) === "suspended" \? "Resume" : "Retry setup";/);
});

// ── Defect 1 ───────────────────────────────────────────────────────────────
test("a terminal provisioning command always has a surface: it finishes or it fails", () => {
  // Exactly one of the two answers is ever non-null, for every terminal state.
  // This is the invariant the vanishing bar broke: FAILED and CANCELED fell
  // between them and nothing was rendered at all.
  for (const state of [STATE.SUCCEEDED, STATE.FAILED, STATE.CANCELED]) {
    const status = { provisioningState: state, provisioningStep: STEP.GATEWAY };
    const finishing = contract.provisioningProgress(status);
    const stopping = contract.provisioningStopped(status);
    assert.equal(Boolean(finishing) !== Boolean(stopping), true, `state ${state} must have exactly one surface`);
  }
  // A command still in flight is neither.
  for (const state of [STATE.QUEUED, STATE.RUNNING, STATE.RETRYING]) {
    assert.equal(contract.provisioningStopped({ provisioningState: state, provisioningStep: STEP.GATEWAY }), null);
    assert.ok(contract.provisioningProgress({ provisioningState: state, provisioningStep: STEP.GATEWAY }));
  }

  // The frozen bar sits on the milestone the live bar had reached, not at zero:
  // "it failed" and "it failed HERE" are different amounts of information.
  const stopped = contract.provisioningStopped(failedAtGateway);
  assert.equal(stopped.percent, 92);
  assert.equal(stopped.percent, contract.provisioningProgress({ provisioningState: STATE.RUNNING, provisioningStep: STEP.GATEWAY }).percent);
  assert.match(stopped.message, /gateway/i);
  // A command that died before reporting a step really did get nowhere.
  assert.equal(contract.provisioningStopped({ provisioningState: STATE.FAILED }).percent, 0);
  // A failed deletion reads the deletion map, not the provisioning one.
  const removal = contract.provisioningStopped({ provisioningState: STATE.FAILED, provisioningStep: STEP.DELETING, operationType: DELETE_OPERATION });
  assert.equal(removal.deleting, true);
  assert.equal(removal.percent, 85);
});

test("the progress bar fails in place rather than disappearing", () => {
  const render = between("function renderProvisioningProgress(team) {", "function finishProvisioningProgress()");
  const nullBranch = render.slice(render.indexOf("if (!progress) {"));
  // The stopped surface is reached BEFORE anything hides the bar. Order is the
  // whole defect: the old branch hid first and asked no further questions.
  const stopping = nullBranch.indexOf("renderStoppedProvisioning(team, stopped)");
  const hiding = nullBranch.indexOf("hideProvisioningProgress()");
  assert.ok(stopping !== -1, "the null-progress branch renders a failure surface");
  assert.ok(stopping < hiding, "the failure surface is reached before the bar is hidden");
  assert.match(nullBranch, /launchContract\?\.provisioningStopped\?\./);
  // Leaving the pending states cleanly still finishes at 100%, and a failure
  // still never gets a triumphant 100%.
  assert.match(nullBranch, /finishProvisioningProgress\(\);/);

  const stoppedRender = between("function renderStoppedProvisioning(team, stopped) {", "function clearProvisioningNotice()");
  assert.match(stoppedRender, /ui\.provisioningProgress\.hidden = false;/);
  assert.match(stoppedRender, /dataset\.tone = "stopped"/);
  // The travelling hairline means "streaming right now". Nothing is.
  assert.match(stoppedRender, /ui\.provisioningTrack\.classList\.remove\("dn-livebar"\)/);
  assert.match(stoppedRender, /setGaugeWidth\(ui\.provisioningFill, stopped\.percent\)/);
  // Never colour alone: the copy line says so in words, and says which of the
  // two ways it ended.
  assert.match(stoppedRender, /const verb = stopped\.canceled \? "was canceled" : "stopped";/);
  assert.match(stoppedRender, /\$\{verb\} before it finished/);
  // The tone is corroboration, and it is a static state — no colour transition.
  assert.match(main, /\.provisioning-progress\[data-tone="stopped"\] \.provisioning-fill \{ background: var\(--status-danger-dot\); \}/);
  assert.match(main, /\.provisioning-fill \{[^}]*transition: width var\(--dur-slower\) var\(--ease-out\);/);
});

test("the failure is a Notice — an event elsewhere — and not a Callout", () => {
  assert.match(shell, /data-provisioning-notice/);
  const builder = between("function buildNotice({", "function teamProvisioningFailed(team)");
  // Notice.jsx's own DOM, class for class, against the same vendored CSS.
  for (const part of ["dn-notice__glyph", "dn-notice__main", "dn-notice__flag", "dn-notice__meta", "dn-notice__sep", "dn-notice__title", "dn-notice__body", "dn-notice__code", "dn-notice__actions"]) {
    assert.ok(builder.includes(part), `buildNotice is missing ${part}`);
  }
  assert.match(builder, /noticeLevels\.levelClass\("dn-notice", levelName\)/);
  assert.match(builder, /shape\.tone === "danger" \? "alert" : "status"/);
  // The level's WORD is always printed, which is what makes the surface
  // readable under filter: grayscale(1).
  assert.match(builder, /word\.textContent = shape\.word;/);
  // Built, never assembled.
  assert.doesNotMatch(builder, /innerHTML|insertAdjacentHTML/);

  const notice = between("function renderProvisioningStoppedNotice(team, stopped) {", "// Replaying a CSS animation");
  // Source, time and code are exactly what a Notice carries and a Callout does
  // not — the failure happened in the pipeline, not on this screen.
  assert.match(notice, /level: "error"/);
  assert.match(notice, /source: stopped\.deleting \? "Team removal" : "Team setup"/);
  assert.match(notice, /time: failedAt \? relativeTime\(failedAt\) : ""/);
  assert.match(notice, /code: \[stringValue\(presentation\.state\)/);
  // Three clauses, in order: what happened, what it means, what happens next.
  assert.match(notice, /const happened =/);
  assert.match(notice, /const means =/);
  assert.match(notice, /const next =/);
  assert.match(notice, /body: `\$\{means\} \$\{next\}`/);
  // The non-destructive door is offered first and only when the contract
  // actually offers it; deletion stays available and stays second.
  assert.match(notice, /const canRetry = stopped\.deleting \? controls\.includes\("delete"\) : controls\.includes\("resume"\);/);
  assert.match(notice, /retry\.textContent = "Retry setup";/);
  assert.match(notice, /retry\.addEventListener\("click", \(\) => resumeTeamLifecycle\(team\)\);/);
  assert.ok(notice.indexOf('retry.className = "dn-btn dn-btn--primary dn-btn--sm"') < notice.indexOf('remove.className = "dn-btn dn-btn--ghost dn-btn--sm"'),
    "the non-destructive remedy comes first");
  assert.match(notice, /if \(controls\.includes\("delete"\)\) \{/);
  assert.doesNotMatch(notice, /innerHTML|insertAdjacentHTML/);
});

// ── Defect 4: the assembling window wore the awaiting-payment costume ──────
// A team whose build was actively running - progress bar advancing, gateway
// minutes away - showed a red "is not working / waiting on a confirmed
// payment" banner, a STOPPED chip and "Awaiting payment" on its tile, because
// three surfaces read lifecycle `pending` as one fact when it carries two.
// Screenshotted live by the founder while the same screen's provisioning
// stream contradicted every word of it.
test("a pending team with a build in flight is assembling, never halted", () => {
  const teamPhase = loadTeamPhase();
  const badges = loadPhaseBadges();

  // A build actively running or queued is the assembling phase.
  for (const state of [STATE.QUEUED, STATE.RUNNING, STATE.RETRYING]) {
    assert.equal(
      teamPhase({ id: "t1", state: "pending", provisioning: { provisioningState: state } }),
      "assembling",
      `provisioningState ${state} must read as assembling`,
    );
  }
  // No build record at all IS the awaiting-payment case; its copy stays.
  assert.equal(teamPhase({ id: "t1", state: "pending" }), "halted");
  // A failed build outranks assembling - "failed" is its own fact.
  assert.equal(teamPhase({ id: "t1", state: "pending", provisioning: failedAtGateway }), "failed");
  // Suspension is a decision, not a build; it stays halted regardless.
  assert.equal(teamPhase({ id: "t1", state: "suspended", provisioning: { provisioningState: STATE.RUNNING } }), "halted");

  // The badge is neutral: assembling is the road to running, not an alarm.
  assert.equal(badges.assembling.label, "Setting up");
  assert.equal(badges.assembling.live, false);
  assert.doesNotMatch(badges.assembling.className, /danger|attention/);
});
