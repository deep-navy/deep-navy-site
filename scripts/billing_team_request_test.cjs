"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const layout = readFileSync("_layouts/app.html", "utf8");
const { ONBOARDING_STEPS } = require("../assets/js/app-state.js");
const { missingTeamPrerequisites } = require("../assets/js/launch-contract.js");

test("onboarding has no Subscription step, and reads as sign in then create team", () => {
  // The internal model still tracks org/GitHub/repos (they auto-complete), but
  // the customer-facing flow is two actions — sign in, then create a team — with
  // the GitHub organization and repositories connected automatically.
  assert.deepEqual(ONBOARDING_STEPS, ["identity", "organization", "github", "repositories", "team"]);
  assert.doesNotMatch(shell, /data-progress-step="subscription"/);
  assert.doesNotMatch(shell, /data-step="subscription"/);
  assert.doesNotMatch(shell, /data-subscription-action/);
  assert.doesNotMatch(shell, /Activate subscription/);
  // No numbered five-step framing: the primary bar is two steps and the rest is
  // an auto-connected status row.
  assert.doesNotMatch(shell, /STEP 0[0-9]/);
  assert.match(shell, /CREATE TEAM/);
  assert.match(shell, /Step 1 of 2 · Sign in/);
  assert.match(shell, /class="progress-auto"/);
  assert.match(shell, /connect automatically|connected automatically/i);
  // The organization is auto-derived, not a manual "establish" form step.
  assert.doesNotMatch(shell, /Establish your organization/);
  // The wizard no longer sets or renders a subscription step in app.js, and the
  // progress summary reflects the auto-connect framing, not an "N of 5" count.
  assert.doesNotMatch(app, /setStep\("subscription"/);
  assert.doesNotMatch(app, /ui\.subscriptionAction/);
  assert.doesNotMatch(app, /steps complete`/);
  // Team creation no longer requires an active subscription up front.
  assert.deepEqual(missingTeamPrerequisites({ githubInstalled: true, repositorySelectionReady: true }), []);
});

test("no card is collected during sign-in or onboarding, only at team creation", () => {
  // Stripe.js is still lazily loaded and never eagerly present in the layout.
  assert.doesNotMatch(layout, /<script[^>]*js\.stripe\.com/);
  assert.match(app, /https:\/\/js\.stripe\.com\/dahlia\/stripe\.js/);
  // The signed-out card promises a free, card-free signup.
  assert.match(shell, /free, no card required/i);
  // Onboarding never mounts checkout; only the paid team path and credit packs do.
  assert.doesNotMatch(shell, /name=["'](?:card|cardNumber|cvc|expiry)/i);
});

test("creating a team calls RequestTeam with a uuid idempotency key and reflects the pending team", () => {
  assert.match(app, /apiRequest\("request_team", \{/);
  assert.match(app, /organizationId: session\.organizationId,\s*\n\s*name,\s*\n\s*idempotencyKey: mutationKeys\.for\("requestTeam", fingerprint\)/);
  // The idempotency key is a uuid v4 (crypto.randomUUID) via createMutationKeys.
  assert.match(app, /createMutationKeys\(\(\) => window\.crypto\.randomUUID/);
  // The legacy CreateTeam pre-paid-slot path is no longer called from the wizard.
  assert.doesNotMatch(app, /apiRequest\("create_team"/);
  // The pending team from RequestTeam is reflected immediately.
  assert.match(app, /const pending = result\.pendingTeam/);
  assert.match(app, /stringValue\(pending\.organizationId\) !== session\.organizationId/);
});

test("RequestTeam settlement drives each payment path", () => {
  // CHECKOUT_REQUIRED → mount a custom Stripe Payment Element (card fields in deep
  // navy's own UI) with the invoice confirmation secret, then confirm the payment.
  assert.match(app, /REQUEST_TEAM_SETTLEMENT\.CHECKOUT_REQUIRED/);
  assert.match(app, /await openTeamPaymentElement\(\{/);
  assert.match(app, /clientSecret: result\.checkoutClientSecret \|\| result\.checkout_client_secret/);
  assert.match(app, /stripeClient\.elements\(\{ clientSecret: secret, appearance: teamCheckoutAppearance\(\) \}\)/);
  assert.match(app, /stripeClient\.confirmPayment\(\{/);
  assert.match(app, /redirect: "if_required"/);
  // CHARGED_OFF_SESSION → show provisioning and poll GetTeam until active.
  assert.match(app, /REQUEST_TEAM_SETTLEMENT\.CHARGED_OFF_SESSION/);
  assert.match(app, /startPendingTeamPoll\(pending\.id/);
  // AUTHENTICATION_REQUIRED → open the Stripe hosted invoice in a new tab.
  assert.match(app, /REQUEST_TEAM_SETTLEMENT\.AUTHENTICATION_REQUIRED/);
  assert.match(app, /validatedRedirect\(result\.authenticationUrl[^,]*, \["invoice\.stripe\.com"\]\)/);
  assert.match(app, /window\.open\(destination, "_blank", "noopener,noreferrer"\)/);
});

test("pending teams are provisioned only by the signed webhook, polled via GetTeam until active", () => {
  assert.match(app, /async function pollPendingTeam\(teamId\)/);
  assert.match(app, /await apiRequest\("team", \{ id: teamId \}\)/);
  // Active means LIFECYCLE_STATE_ACTIVE or provisioning SUCCEEDED.
  assert.match(app, /lifecycle === "active" \|\| provisioning\?\.state === launchContract\.PROVISIONING_STATE\.SUCCEEDED/);
  // On checkout completion the pending team is polled, never granted inline.
  assert.match(app, /startPendingTeamPoll\(teamId, 1500\)/);
  assert.match(app, /verified webhook provisions your team/);
  // The short-lived checkout/auth credentials are never logged or persisted.
  assert.doesNotMatch(app, /(?:console\.|toast\()[^\n]*checkoutClientSecret/);
  assert.doesNotMatch(app, /storageWrite\([^\n]*(?:checkoutClientSecret|authenticationUrl)/);
});

test("Settings surface renders the account, billing, and Customer Portal", () => {
  // A dedicated Settings section, reachable from the header nav.
  assert.match(shell, /id="workspace-settings"/);
  assert.match(layout, /<a href="#workspace-settings">Settings<\/a>/);
  // Account: GitHub identity, organization, members.
  assert.match(shell, /data-settings-account-name/);
  assert.match(shell, /data-settings-account-login/);
  assert.match(shell, /data-settings-account-org/);
  assert.match(shell, /data-settings-members/);
  assert.match(app, /function renderSettingsAccount/);
  assert.match(app, /function renderSettingsMembers/);
  // Billing: active team count × $599, the default card, and Manage billing.
  assert.match(shell, /data-settings-team-count/);
  assert.match(shell, /data-settings-billing-amount/);
  assert.match(shell, /data-settings-payment-method/);
  assert.match(shell, /data-settings-billing-manage/);
  assert.match(app, /function renderSettingsBilling/);
  assert.match(app, /teamUnitAmountCents/);
  assert.match(app, /59900n/);
  assert.match(app, /paymentMethodSummary\(session\.subscription\?\.defaultPaymentMethod\)/);
});

test("Manage billing opens the Stripe Customer Portal and never hosts card fields", () => {
  assert.match(app, /async function manageBilling\(\)/);
  assert.match(app, /apiRequest\("billing_portal", \{ organizationId: session\.organizationId, returnUrl: appUrl/);
  assert.match(app, /validatedRedirect\(result\.portalUrl[^,]*, \["billing\.stripe\.com"\]\)/);
  assert.match(app, /ui\.settingsBillingManage\.addEventListener\("click", manageBilling\)/);
  // No card fields are hosted by us anywhere in the Settings surface.
  assert.doesNotMatch(shell, /name=["'](?:card|cardNumber|cvc|expiry)/i);
});
