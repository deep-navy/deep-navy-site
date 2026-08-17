"use strict";

// The floor used to open with a form ("What do you want built?") because a
// form was all the platform could deliver. Now the customer talks to their
// Product Manager the way business leadership talks to the PM they hired, and
// these pin the console that carries that conversation: it subscribes with the
// team and heals like the activity stream, an optimistic send reconciles
// against the server's own sequence, SYSTEM rows never masquerade as chat,
// delivery chips only ever say what the stream last said, and the old
// objective form keeps its machinery while losing the headline.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("selecting a team opens the conversation stream through the generated client", () => {
  const refresh = between("async function refreshSelectedTeam()", "function renderPendingTeamGuidance");
  assert.match(refresh, /startConversationStream\(team\.id, generation\)/);
  // The browser client exposes both halves of the contract's customer service.
  assert.match(client, /conversations\.sendTeamMessage/);
  assert.match(client, /conversations\.streamTeamConversation/);
  assert.match(client, /"send_team_message"/);
  // Tearing down the workspace tears the conversation down with it, so a
  // switched team can never receive another team's replay.
  const stopAll = between("function stopActivityStream()", "// Streams outlive bearer tokens");
  assert.match(stopAll, /stopConversationStream\(\);/);
  const stop = between("function stopConversationStream()", "function stopActivityStream");
  assert.match(stop, /session\.conversationStreamLive = false/);
  assert.match(stop, /session\.conversationReconnectTimer = null/);
});

test("the conversation stream reconnects through the token refresh path with a bounded budget", () => {
  const schedule = between("function scheduleConversationReconnect(", "function conversationResumeCursor");
  // Streams outlive bearer tokens; the reconnect heals the token through
  // refresh_session exactly the way the activity stream's reconnect does.
  assert.match(schedule, /refreshStreamAccessToken\(\)/);
  assert.match(schedule, /Math\.min\(30000, 1500 \* 2 \*\* attempt\)/);
  const stream = between("async function startConversationStream(teamId", "const activityCategories");
  // An in-stream "unauthenticated" frame is an expired token, not a terminal
  // failure: it schedules the reconnect with the refresh flag set.
  assert.match(stream, /scheduleConversationReconnect\(teamId, generation, nextAttempt, unauthenticated\)/);
  assert.match(stream, /scheduleConversationReconnect\(teamId, generation, nextAttempt, false\)/);
  // The retry budget is shared with the activity stream, and a stream that
  // establishes gets a fresh budget when it later drops.
  assert.match(stream, /nextAttempt <= activityReconnectLimit/);
  assert.match(stream, /streamEstablished \? 0 : attempt \+ 1/);
  // A quiet-but-healthy console still settles into "Listening".
  assert.match(stream, /window\.setTimeout\(markStreamEstablished, 1500\)/);
});

test("an optimistic send paints before the request and reconciles by server sequence", () => {
  const send = between("async function sendConversationMessage(event)", "function retryConversationMessage");
  // The message is on screen before the RPC leaves the browser…
  const painted = send.indexOf("renderConversation();");
  const delivered = send.indexOf("deliverConversationMessage(team, entry)");
  assert.notEqual(painted, -1);
  assert.notEqual(delivered, -1);
  assert.ok(painted < delivered, "the optimistic row renders before the send RPC");
  // …and the send carries a per-message idempotency key, so retrying a failed
  // message can never post it twice.
  const deliver = between("async function deliverConversationMessage(team, entry)", "async function sendConversationMessage");
  assert.match(deliver, /mutationKeys\.for\("sendTeamMessage", `\$\{team\.id\}:\$\{entry\.localId\}`\)/);
  // Reconciliation is by the server's identifiers: the streamed replay adopts
  // the in-flight row and stamps the server-owned sequence on it.
  const accept = between("function acceptConversationMessage(message)", "function productManagerName");
  assert.match(accept, /pendingRow\.sequence = sequence/);
  assert.match(accept, /existing\.sequence = sequence/);
  // A send response that lost the race to the stream retires the optimistic
  // row instead of duplicating the message — unless the replay adopted that
  // very row, which must survive.
  assert.match(deliver, /recorded && recorded !== entry/);
  // The resume cursor backs up below any customer row still in flight, since
  // delivery-state transitions re-send the original sequence.
  const cursor = between("function conversationResumeCursor()", "async function startConversationStream");
  assert.match(cursor, /entry\.sequence - 1n/);
});

test("SYSTEM rows advance the cursor but are never rendered as chat", () => {
  const render = between("function renderConversation()", "function renderConversationTyping");
  assert.match(render, /filter\(\(entry\) => entry\.author !== "system"\)/);
  // The store accepts them (their sequence moves the cursor) without any
  // special-case that would drop or disguise them.
  const accept = between("function acceptConversationMessage(message)", "function productManagerName");
  assert.match(accept, /if \(sequence > session\.lastConversationSequence\) session\.lastConversationSequence = sequence/);
  assert.doesNotMatch(accept, /author === "system"/);
  // Author validation fails closed rather than guessing at unknown enums.
  const valid = between("function validConversationMessage(message)", "function acceptConversationMessage");
  assert.match(valid, /author !== "customer" && deliveryState !== "delivered"/);
});

test("delivery chips say what the stream last said, never a state this page froze", () => {
  // The chip vocabulary is the contract's, plus the two local truths that
  // exist before the server has acknowledged the send at all.
  const chip = between("function conversationChip(entry)", "function renderConversation");
  for (const label of ["Queued", "Delivering", "Delivered", "Failed", "Sending…", "Not sent"]) {
    assert.ok(chip.includes(`"${label}"`), `chip label missing: ${label}`);
  }
  // A delivery-state transition re-sends the same message; the row updates in
  // place so the chip moves without the message duplicating.
  const accept = between("function acceptConversationMessage(message)", "function productManagerName");
  assert.match(accept, /existing\.deliveryState = deliveryState/);
  // Chips ride only on customer rows, and a failed delivery surfaces its
  // customer-safe error beside the message it failed.
  const render = between("function renderConversation()", "function renderConversationTyping");
  assert.match(render, /entry\.author === "customer"/);
  assert.match(render, /entry\.safeError \|\| "Delivery to your Product Manager failed\."/);
  // The Product Manager renders under their display name; customers are "You".
  assert.match(render, /"You"/);
  assert.match(render, /productManagerName\(\)/);
});

test("the composing shimmer borrows the crew tile's liveness instead of inventing its own", () => {
  const typing = between("function renderConversationTyping()", "function syncConversationComposer");
  assert.match(typing, /agentLiveness\("AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER"\)/);
  assert.match(typing, /briefedWindowMs/);
  // Only an unanswered, delivered customer message can claim the PM is
  // composing.
  assert.match(typing, /newest\.author === "customer" && newest\.deliveryState === "delivered"/);
  // It re-evaluates whenever the crew tiles do, so it ages out with them.
  const crew = between("function refreshCrewActivity()", "function renderRailSpend");
  assert.match(crew, /renderConversationTyping\(\);/);
  assert.match(shell, /data-conversation-typing/);
});

test("the objective form no longer renders as the primary ask", () => {
  // The console leads the floor; the tracked-objective form ships demoted and
  // app.js no longer promotes it back when the board empties.
  // There is no second ask at all any more: the objective FORM left the shell
  // entirely (the pipeline and the "On now" record remain). A returning form
  // would mean two places to say the same thing - the exact confusion the
  // console exists to end.
  assert.doesNotMatch(shell, /data-objective-form/);
  assert.doesNotMatch(shell, /Tracked objectives/);
  assert.doesNotMatch(shell, /What do you want built\?/);
  // The example chips went with the form's primacy.
  assert.doesNotMatch(shell, /data-objective-examples/);
  assert.doesNotMatch(app, /data-objective-examples/);
  const descent = between("function renderDescent()", "function descentWho");
  assert.doesNotMatch(descent, /classList\.toggle\("is-secondary"/);
  // The pipeline itself stays wired: other flows still create and render
  // tracked objectives.
  assert.match(app, /ui\.objectiveForm\.addEventListener\("submit", createObjective\)/);
  assert.match(app, /renderObjectiveDispatch\(objective\.dispatch\)/);
});

test("the composer is honest about why it is off, and the empty console promises the PM's greeting", () => {
  const composer = between("function syncConversationComposer()", "function resetConversationView");
  assert.match(composer, /The conversation opens when your team finishes setting up\./);
  assert.match(composer, /Choose a team to talk to its Product Manager\./);
  // The contract bounds a message at 4,000 bytes after trimming; the composer
  // measures bytes so multi-byte text cannot bounce off the server.
  const send = between("async function sendConversationMessage(event)", "function retryConversationMessage");
  assert.match(send, /new TextEncoder\(\)\.encode\(text\)\.length > 4000/);
  // ⌘/Ctrl+Enter sends without leaving the keyboard.
  assert.match(app, /ui\.conversationForm\.addEventListener\("submit", sendConversationMessage\)/);
  assert.match(app, /ui\.conversationForm\.requestSubmit\(\)/);
  // A brand-new team's console carries the handoff from the create screen —
  // the PM opens the conversation when the team is ready — and the greeting
  // arrives through the stream as a normal PM message, so nothing here
  // fabricates one.
  assert.match(shell, /Your Product Manager will open the conversation when the team is ready\./);
  assert.doesNotMatch(app, /author: "product_manager"/);
});

// The crew tile and its liveness dot both ask "what is this agent doing now?".
// session.activityEvents is append-ordered - push to add, shift to drop the
// oldest - so a forward scan answered with the OLDEST event still retained for
// that role. The tile showed a stale line and liveness aged an old event past
// its window, so an agent mid-run read as "waiting for work".
test("the crew reads an agent's newest event, not its oldest", () => {
  const source = readFileSync("assets/js/app.js", "utf8");
  const start = source.indexOf("function latestEventForRole");
  const lookup = start === -1 ? "" : source.slice(start, start + 600);
  assert.ok(lookup.length > 0, "latestEventForRole is gone");
  assert.match(lookup, /for \(let index = events\.length - 1; index >= 0; index -= 1\)/,
    "the newest event is found by scanning from the end");
  assert.doesNotMatch(lookup, /for \(const event of events\)/,
    "a forward scan returns the oldest retained event for the role");
  // The array really is oldest-first, which is what makes direction matter.
  assert.match(source, /session\.activityEvents\.push\(entry\)/);
  assert.match(source, /session\.activityEvents\.shift\(\)/);
});

// A reply written in Markdown is rendered as Markdown, and the source stays one
// click away. The renderer builds nodes; it must never assemble markup.
test("Product Manager replies render as Markdown by default", () => {
  const source = readFileSync("assets/js/app.js", "utf8");
  const shell = readFileSync("_includes/app-shell.html", "utf8");
  assert.match(shell, /data-conversation-format/, "the raw/Markdown toggle is missing from the console");
  assert.match(source, /session\.conversationFormat = loadConversationFormat\(\)/);
  assert.match(source, /window\.localStorage\.getItem\(conversationFormatKey\) === "raw" \? "raw" : "markdown"/,
    "Markdown must be the default, with raw the explicit opt-in");
  assert.match(source, /renderMarkdownInto\(bubble, entry\.text\)/);
  // Your own words stay literal; only the agent's Markdown is rendered.
  assert.match(source, /entry\.author === "customer" \|\| session\.conversationFormat === "raw"/);
  // Nothing an agent writes may become markup.
  assert.doesNotMatch(source, /innerHTML\s*=/, "the app must not assign innerHTML anywhere");
  assert.match(source, /\["https:", "http:", "mailto:"\]\.includes\(url\.protocol\)/,
    "link hrefs must be restricted to safe protocols");
});
