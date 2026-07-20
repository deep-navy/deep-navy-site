"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const layout = readFileSync("_layouts/app.html", "utf8");

test("subscription and prepaid purchases use Stripe Embedded Checkout", () => {
  // Stripe.js loads lazily (only when a checkout actually runs) and is never
  // eagerly loaded in the app layout, so it is absent from sign-in and
  // repository onboarding. It is pinned to the current documented version.
  assert.doesNotMatch(layout, /<script[^>]*js\.stripe\.com/, "stripe.js must not be eagerly loaded in the app layout");
  assert.match(app, /https:\/\/js\.stripe\.com\/dahlia\/stripe\.js/);
  assert.match(app, /await ensureStripe\(\)/);
  assert.match(layout, /frame-src[^;]*https:\/\/checkout\.stripe\.com/);
  assert.match(app, /stripeClient\.initEmbeddedCheckout/);
  assert.match(app, /fetchClientSecret:\s*async \(\) => safeSecret/);
  assert.match(app, /redirect_on_completion|billing=return|CHECKOUT_SESSION_ID/);
  assert.doesNotMatch(app, /successUrl|cancelUrl/);
  assert.doesNotMatch(shell, /name=["'](?:card|cardNumber|cvc|expiry)/i, "card fields must remain inside Stripe's iframe");
});

test("browser requests only public catalog IDs and never fulfills payment", () => {
  assert.match(app, /creditPackId:\s*pack\.id/);
  assert.doesNotMatch(app, /stripePriceId|stripe_price_id/);
  assert.match(app, /verified webhook/);
  assert.match(shell, /Credits are posted only after deep navy verifies Stripe’s signed paid webhook/);
  assert.doesNotMatch(app, /storageWrite\([^\n]*clientSecret/);
  assert.doesNotMatch(app, /(?:console\.|toast\()[^\n]*clientSecret/);
});

test("team capacity is rendered from the signed subscription snapshot", () => {
  assert.match(app, /subscription\?\.paidTeamSlots/);
  assert.match(app, /used \+ available === paid/);
  assert.match(app, /session\.availableTeamSlots < 1n/);
  assert.match(shell, /data-plan-slots/);
});

test("visible team budget controls map to typed authenticated API calls", () => {
  assert.match(shell, /data-credit-balance-panel/);
  assert.match(shell, /data-credit-balance-value/);
  assert.match(shell, /data-credit-control-form/);
  assert.match(shell, /data-credit-hard-limit-input/);
  assert.match(shell, /data-credit-customer-paused/);
  assert.match(app, /apiRequest\("credit_balance", \{ organizationId: session\.organizationId, teamId: team\.id \}\)/);
  assert.match(app, /apiRequest\("credit_control"/);
  assert.match(app, /apiRequest\("update_credit_control"/);
  assert.match(app, /expectedVersion:\s*expectedVersion\.toString\(\)/);
  assert.match(app, /hardLimit >= committed|hardLimit < committed/);
  assert.match(app, /hardLimit > prepaidCeiling/);
  assert.match(app, /Boolean\(control\.customerPaused\) !== \(reason === "Customer paused"\)/);
  assert.match(app, /balance !== int64Value\(control\.ledgerAvailableMicros\)/);
  assert.match(app, /No balance was assumed/);
  assert.doesNotMatch(app, /Boolean\(control\.customerPaused\) !== \(reason === "Customer paused"\) && Boolean\(control\.customerPaused\)/);
});
