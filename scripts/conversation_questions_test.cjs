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
