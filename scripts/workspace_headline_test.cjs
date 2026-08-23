"use strict";

// A customer watched "test is ready. Your Product Manager is writing the first
// message." for three hours while the PM's message sat in the transcript
// directly below it. renderWorkspaceHeadline() stands the sentence down once the
// PM has spoken — but it asked whether any message had author
// "CONVERSATION_AUTHOR_PRODUCT_MANAGER" or 2, and by the time a message reaches
// session.conversationMessages it has been through conversationAuthorLabel(),
// which folds both of those to "product_manager". The test never matched, so the
// headline never stood down.
//
// This pins the two halves against each other: whatever the normaliser produces
// is what the headline must compare to. A future rename breaks the test rather
// than the screen.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");

test("the headline compares the normalised author, never a wire value", () => {
  const line = app.match(/const pmHasSpoken = [^\n]+/);
  assert.ok(line, "renderWorkspaceHeadline must still decide whether the PM has spoken");

  assert.match(line[0], /"product_manager"/, "must test the normalised author");
  assert.doesNotMatch(line[0], /CONVERSATION_AUTHOR_/,
    "the wire enum never survives conversationAuthorLabel(); comparing to it is always false");
  assert.doesNotMatch(line[0], /=== 2\b/,
    "the numeric author never survives conversationAuthorLabel() either");
});

test("the normaliser really does produce the value the headline expects", () => {
  // Run the actual function rather than trusting the string above.
  const body = app.match(/function conversationAuthorLabel\(value\) \{[\s\S]*?\n  \}/);
  assert.ok(body, "conversationAuthorLabel must still exist");
  const stringValue = (v) => (typeof v === "string" ? v : "");
  // eslint-disable-next-line no-new-func
  const conversationAuthorLabel = new Function(
    "stringValue",
    `${body[0]}\nreturn conversationAuthorLabel;`,
  )(stringValue);

  assert.equal(conversationAuthorLabel(2), "product_manager");
  assert.equal(conversationAuthorLabel("CONVERSATION_AUTHOR_PRODUCT_MANAGER"), "product_manager");
  assert.equal(conversationAuthorLabel(1), "customer");
  assert.equal(conversationAuthorLabel(3), "system");
});
