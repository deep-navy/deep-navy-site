"use strict";

// The codeless GitHub callback (install/update round trips return no OAuth
// code when the App's OAuth-during-installation toggle is off) used to park
// the customer on an error page whose Try again button ran beginSignIn() -
// a deterministic, zero-judgement remedy a human was being asked to perform
// on every single sign-in. These pin the machine doing it instead.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");

test("a codeless GitHub callback restarts sign-in by itself", () => {
  // The catch must branch on the specific contract error, not on message text.
  assert.match(app, /github_oauth_code_missing/);
  // The restart is rate-limited so a genuinely broken App configuration still
  // surfaces instead of looping through GitHub forever.
  assert.match(app, /armSignInAutoRetry/);
  assert.match(app, /2 \* 60 \* 1000/);
  // And the automatic path still goes through session restore first, like the
  // homepage button does, so an already-signed-in visitor never bounces.
  const catchBlock = app.slice(app.indexOf("codelessInstall"), app.indexOf("codelessInstall") + 1200);
  assert.match(catchBlock, /restoreSession\(\)/);
  assert.match(catchBlock, /beginSignIn\(\)/);
});
