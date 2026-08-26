"use strict";

// The interview: the Product Manager asks a structured question, the customer
// answers by choosing, and the answers become the requirements the team builds
// from. Before this the agent asked in prose and read the answer out of a
// sentence, which threw the structure away at both ends.
//
// What this pins is the handful of properties that decide whether the form is
// usable or merely present.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");
const styles = readFileSync("assets/css/console.css", "utf8");

function body(signature) {
  const start = app.indexOf(signature);
  assert.notEqual(start, -1, `missing ${signature}`);
  let depth = 0;
  let opened = false;
  for (let index = start; index < app.length; index += 1) {
    if (app[index] === "{") { depth += 1; opened = true; }
    else if (app[index] === "}") { depth -= 1; if (opened && depth === 0) return app.slice(start, index + 1); }
  }
  return "";
}

test("the interview renders where the conversation is waiting on it", () => {
  assert.ok(shell.includes("data-conversation-questions"), "the thread lost its question host");
  // A question set is a record with its own lifecycle, not a message, so it
  // renders after the thread rather than inside it.
  const threadAt = shell.indexOf("data-conversation-thread");
  const questionsAt = shell.indexOf("data-conversation-questions");
  assert.ok(threadAt !== -1 && questionsAt > threadAt,
    "the form must follow the thread: it is what the conversation is waiting on");
});

test("only an open question set becomes a form", () => {
  const open = body("function openQuestionSets");
  assert.match(open, /status === "open"/,
    "an answered set is already in the thread as prose; rendering it again would offer controls that do nothing");
});

test("an option shows the trade-off it implies, not just its name", () => {
  const option = body("function renderQuestionOption");
  assert.match(option, /dn-check__desc/,
    "without the description a customer has to ask the agent what a choice means, which is the thing this replaces");
  assert.match(option, /option\.description/);
  // Single choice is a radio, multiple is a checkbox. Getting this wrong lets a
  // customer pick two answers to a question that takes one, and the server then
  // refuses the whole submission.
  assert.match(option, /single \? "radio" : "checkbox"/);
  assert.ok(styles.includes(".cs-ask-option"), "the option style is gone");
});

test("the submit button refuses before the server has to", () => {
  const answerable = body("function questionSetAnswerable");
  assert.match(answerable, /if \(!question\.required\) return true/);
  assert.match(answerable, /draft\.optionIds\.length > 0 \|\| draft\.text !== ""/,
    "a required question is answered by a choice OR by writing, and either satisfies it");
});

test("answering sends the answers and nothing it invented", () => {
  const submit = body("async function submitQuestionSet");
  // Only questions the customer actually touched are sent. An empty answer is
  // an unanswered optional question, not a decision to record.
  assert.match(submit, /filter\(\(answer\) => answer\.optionIds\.length > 0 \|\| answer\.text !== ""\)/);
  assert.match(submit, /answer_team_questions/);
  // The server answers the set and sends the message in one transaction, so the
  // reload is what makes the form vanish and the prose appear together.
  assert.match(submit, /await loadQuestionSets\(\)/);
});

test("an unreadable list leaves the form alone", () => {
  const load = body("async function loadQuestionSets");
  // Blanking the form on a failed refresh would take away a form the customer
  // may be halfway through filling in.
  assert.ok(!/catch\s*\{\s*session\.conversationQuestionSets = \[\]/.test(load),
    "a failed reload must not clear a form in progress");
});

test("the client carries both question procedures", () => {
  for (const procedure of ["list_team_question_sets", "answer_team_questions"]) {
    assert.ok(client.includes(`"${procedure}"`), `${procedure} is not a known procedure`);
  }
  // Answers are validated on the way out because this is the one payload a
  // person composes by hand, and the server refuses an option nobody offered.
  assert.match(client, /function answerList/);
  assert.match(client, /every answer needs its question/);
});

test("the customer surface never says prompt", () => {
  // The word means a model's instructions everywhere else in this system, and
  // the activity leak guard refuses it in the bundle outright. A question put to
  // a customer carries text.
  assert.doesNotMatch(app, /prompt/i);
  assert.match(app, /text: stringValue\(question\?\.text\)/);
});

test("the interview loads when the team opens and clears when it closes", () => {
  // Nothing streams a question set: an agent asking and a customer answering
  // both reload it, and opening a team is the third case nothing else covers.
  assert.match(app, /void loadQuestionSets\(\)/,
    "the form is never loaded, so it would never appear");
  const reset = body("function resetConversationView");
  assert.match(reset, /session\.conversationQuestionSets = \[\]/,
    "a form left behind on a team switch asks the new team's customer the old team's questions");
  assert.match(reset, /session\.questionDraft\.clear\(\)/,
    "a draft left behind carries one customer's half-made choices into another team");
});

// A question set arrives with no event of its own: recording one stores it and
// returns it to the agent, publishing nothing on the conversation stream. So
// the console has to go and look, and for a long time it only looked when a
// team was opened - which for a customer already watching the thread never
// happens again. The Product Manager asked, the page showed the turn, and the
// form stayed invisible behind it.
test("the console refetches question sets without being told one was asked", () => {
  const source = app;

  // A message arriving is the immediate signal - an agent that asks almost
  // always says something in the same turn.
  const acceptIndex = source.indexOf("acceptConversationMessage(message);");
  assert.ok(acceptIndex > 0, "the conversation stream must accept messages");
  const streamHandler = source.slice(acceptIndex, acceptIndex + 1400);
  assert.ok(
    streamHandler.includes("loadQuestionSets()"),
    "a conversation message must refetch the question list, or a form asked mid-thread never appears",
  );

  // And a poll for the ask that says nothing, which is what the Product
  // Manager's mission actually instructs: ask, then end the turn.
  assert.ok(source.includes("startQuestionSetPoll(team.id)"), "opening a team must start the question poll");
  assert.match(source, /const QUESTION_SET_POLL_MS = \d+;/, "the poll interval must be a named constant");

  // The poll must retire when the selection moves, or switching teams leaves
  // one running against a team nobody is looking at.
  const poll = source.slice(source.indexOf("async function startQuestionSetPoll"));
  const body = poll.slice(0, poll.indexOf("\n  async function loadQuestionSets"));
  assert.ok(body.includes("session.questionSetPollTeamId !== teamId"), "the poll must stop when another team starts polling");
  assert.ok(body.includes("selectedTeam()?.id !== teamId"), "the poll must stop when the selection moves");
  assert.ok(body.includes("document.hidden"), "a hidden tab should not poll");
});

// The interview form did not render for a full day because both of its calls
// went through `platformRequest(...)`, a helper that does not exist. Every call
// threw ReferenceError, the catch around it swallowed the error, and the screen
// was indistinguishable from "the Product Manager has not asked anything".
// Nothing failed loudly anywhere: no request left the browser, so no server log
// existed to be missing.
test("every RPC in the console goes through a helper that exists", () => {
  const source = app;

  // The helper is apiRequest. Any other name is a typo that only shows up at
  // runtime, inside a catch, on a screen that looks merely empty.
  const callers = [...source.matchAll(/await ([A-Za-z_$][\w$]*)\(\s*"([a-z_]+)"/g)];
  assert.ok(callers.length > 5, "expected to find the console's RPC call sites");

  const defined = new Set(
    [...source.matchAll(/(?:async function|function|const)\s+([A-Za-z_$][\w$]*)\s*(?:\(|=)/g)].map((m) => m[1]),
  );
  for (const [, helper, procedure] of callers) {
    assert.ok(
      defined.has(helper),
      `${helper}("${procedure}") calls a helper that is never defined in app.js - it will throw ReferenceError at runtime`,
    );
  }

  // And the two question calls specifically, since they are what broke.
  assert.match(source, /await apiRequest\("list_team_question_sets"/);
  assert.match(source, /await apiRequest\("answer_team_questions"/);
  assert.doesNotMatch(source, /platformRequest/, "platformRequest has never existed; do not reintroduce it");
});

// A caught error that leaves no trace is how a broken feature looks exactly
// like a working one with nothing to show.
test("a failed question fetch is reported rather than swallowed", () => {
  const load = app.slice(app.indexOf("async function loadQuestionSets"));
  const body = load.slice(0, load.indexOf("\n  function ", 10));
  assert.match(body, /catch \(error\)/, "the catch must bind the error, not discard it");
  assert.match(body, /session\.questionSetsError/, "the failure must be recorded for the view");
  assert.match(body, /console\.error/, "and it must reach the browser console");
  assert.match(app, /Questions unavailable/, "the view must say so instead of rendering nothing");
});
