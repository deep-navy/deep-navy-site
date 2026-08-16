"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");
// Sign-in now lives on the homepage: there is one GitHub button and no login
// page, so the copy these rules protect is asserted where it is shown.
const home = readFileSync("index.md", "utf8");
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
  // No numbered five-step framing: the screen is one question, not a course.
  assert.doesNotMatch(shell, /STEP 0[0-9]/);
  // The screen used to say "create your team" five times over - page title,
  // progress headline, a CREATE TEAM label, the card heading and its body.
  // Now the action is named exactly once, by the page's own headline.
  assert.match(shell, /<h1 id="firstrun-title" data-firstrun-title>Name your team<\/h1>/);
  // The signed-out card invites GitHub sign-in as the single first action.
  assert.match(home, /Continue with GitHub/);
  assert.doesNotMatch(shell, /Sign in to build your engineering team/); // no second login screen
  // There is no sign-in button in the app at all. The homepage carries the only
  // one; the app's signed-out state is the handoff to GitHub, not a screen that
  // asks the customer to click the same button a second time.
  assert.doesNotMatch(shell, /data-sign-in\b/);
  assert.doesNotMatch(shell, /Continue with GitHub/);
  // GitHub context is reported as auto-connected facts. The connection model
  // stays machine-readable (app.js still writes each step's state) but it is
  // background now: one visible fact line, no chips to review and no wizard.
  assert.match(shell, /data-progress-auto-organization/);
  assert.match(shell, /data-progress-auto-repositories/);
  assert.match(shell, /connect automatically|connected automatically/i);
  // The organization is auto-derived, not a manual "establish" form step.
  assert.doesNotMatch(shell, /Establish your organization/);
  // The wizard no longer sets or renders a subscription step in app.js, and the
  // progress summary reflects the auto-connect framing, not an "N of 5" count.
  assert.doesNotMatch(app, /setStep\("subscription"/);
  assert.doesNotMatch(app, /ui\.subscriptionAction/);
  assert.doesNotMatch(app, /steps complete`/);
  // Team creation no longer requires an active subscription up front, and the
  // repository choice is part of the create form itself — only the GitHub
  // install and at least one reachable repository gate it.
  assert.deepEqual(missingTeamPrerequisites({ githubInstalled: true, repositoriesAvailable: true }), []);
});

test("no card is collected during sign-in or onboarding, only at team creation", () => {
  // Stripe.js is still lazily loaded and never eagerly present in the layout.
  assert.doesNotMatch(layout, /<script[^>]*js\.stripe\.com/);
  assert.match(app, /https:\/\/js\.stripe\.com\/dahlia\/stripe\.js/);
  // The signed-out card promises a free, card-free signup.
  // The card is only ever collected at team creation. The homepage states the
  // price plainly and asks for no payment detail; the app collects it once, in
  // Stripe checkout, when a team is created.
  assert.doesNotMatch(home, /card|payment|billing/i);
  assert.match(home, /\$599 a month/);
  // Onboarding never mounts checkout; only the paid team path and credit packs do.
  assert.doesNotMatch(shell, /name=["'](?:card|cardNumber|cvc|expiry)/i);
});

test("the first-run screen is name + repositories: the name is the hero, the picker the quiet second beat", () => {
  // The name field is the hero — the only static input the screen presents.
  // The repository picker lives INSIDE the same form, directly under the name
  // (its checkboxes are rendered by app.js from the API, so the shell carries
  // only the container). Everything else the wizard used to collect moved
  // out: capacity changes live in Settings, and the objective goes to your
  // Product Manager in conversation once the team exists.
  const teamForm = shell.match(/<form class="team-form" data-team-form>[\s\S]*?<\/form>/);
  assert.ok(teamForm, "the name form must exist");
  assert.deepEqual(teamForm[0].match(/<(?:input|textarea|select)\b/g), ["<input"], "the name field is the only static input in the team form");
  assert.match(teamForm[0], /name="teamName"/);
  assert.deepEqual(teamForm[0].match(/<button\b/g), ["<button"], "one button carries the create action");
  // The picker always renders with the form — not only when something blocks.
  assert.match(teamForm[0], /<fieldset class="team-repos" data-team-repositories>/);
  assert.match(teamForm[0], /<legend>Which repositories should it work in\?<\/legend>/);
  assert.match(teamForm[0], /data-repository-list/);
  assert.match(teamForm[0], /data-team-repositories-error/);
  const nameIndex = teamForm[0].indexOf('name="teamName"');
  const pickerIndex = teamForm[0].indexOf("data-team-repositories");
  const priceIndex = teamForm[0].indexOf("data-team-price-amount");
  assert.ok(nameIndex < pickerIndex && pickerIndex < priceIndex, "the picker sits under the name and above the price");
  // The $599/month line sits with the field, and the price still renders live
  // from the plan against the included-engineer floor.
  assert.match(teamForm[0], /data-team-price-amount/);
  assert.match(teamForm[0], /data-team-price-breakdown/);
  assert.match(teamForm[0], /\$599/);
  assert.match(app, /function renderTeamSetupPricing/);
  assert.match(app, /teamPricingFor\(/);
  assert.match(app, /function pricingBreakdown/);
  // Nothing else competes on the first screen.
  assert.doesNotMatch(shell, /data-team-objective/);
  assert.doesNotMatch(shell, /data-objective-suggestion/);
  assert.doesNotMatch(shell, /data-engineer-input/);
  assert.doesNotMatch(shell, /data-engineer-decrement/);
  assert.doesNotMatch(shell, /data-team-roster/);
  assert.doesNotMatch(shell, /data-example-run/);
});

test("the picker is per team: org selection pre-checked, minimum one enforced, repositoryIds on the request", () => {
  // Pre-check comes from the organization's current durable selection (or the
  // all-accessible mode), but the set submitted is THIS team's own.
  assert.match(app, /checkbox\.checked = mode === launchContract\.REPOSITORY_SELECTION_MODE\.ALL \|\| selected\.has\(id\) \|\| repository\.selectedForTeams === true/);
  // form.reset() after a successful create restores the pre-check for the
  // next team instead of blanking the picker.
  assert.match(app, /checkbox\.defaultChecked = checkbox\.checked/);
  // Minimum one, enforced with honest copy at the submit boundary, cleared
  // the moment the customer touches the picker.
  assert.match(app, /Your team needs at least one repository\./);
  assert.match(app, /if \(repositoryIds\.length === 0\) \{\s*\n\s*setFieldError\(ui\.teamRepositoriesError, "Your team needs at least one repository\."\);/);
  assert.match(app, /ui\.repositoryList\.addEventListener\("change", \(\) => setFieldError\(ui\.teamRepositoriesError, ""\)\)/);
  // The chosen ids ride the RequestTeam call, sorted so the same set always
  // produces the same normalized request, and they are part of the
  // idempotency fingerprint — a different selection is a different request.
  assert.match(app, /const repositoryIds = selectedRepositoryIdsFromForm\(\)\.sort\(/);
  assert.match(app, /apiRequest\("request_team", \{[\s\S]*?repositoryIds\s*\n\s*\}\)/);
  assert.match(app, /const fingerprint = `\$\{session\.organizationId\}:\$\{name\.toLowerCase\(\)\}:\$\{engineerCount\}:\$\{repositoryIds\.join\(","\)\}:\$\{objective\}`/);
  // The org-level "save repository access" ask is gone: no second picker, no
  // durable-selection save competing with the create form.
  assert.doesNotMatch(shell, /data-repository-save/);
  assert.doesNotMatch(shell, /repositoryMode/);
  assert.doesNotMatch(app, /update_repository_selection/);
});

test("prerequisites are background: a card surfaces only while it genuinely blocks", () => {
  // No wizard chrome remains: no progress bar, step numbering, reveal-step
  // chips, readiness guide, or step-card scaffolding.
  assert.doesNotMatch(shell, /data-reveal-step/);
  assert.doesNotMatch(shell, /onboarding-card/);
  assert.doesNotMatch(shell, /setupline/);
  assert.doesNotMatch(shell, /step-number/);
  assert.doesNotMatch(shell, /progress-steps/);
  assert.doesNotMatch(shell, /Readiness guide/);
  // Prerequisite cards exist for app.js to drive, but render only in blocking
  // states; the enforcement point is the stylesheet, so pin it there.
  assert.match(css, /\.firstrun \.firstrun-card\{ display:none;/);
  assert.match(css, /\.blocking-card\[data-state="action"\]/);
  assert.match(css, /\.blocking-card\[data-state="error"\]/);
  assert.match(css, /\.repo-card\[data-state="blocked"\]\{ display:block; \}/);
  // GitHub not installed: the connect card shows INSTEAD of the name form,
  // wired to the existing install flow. Zero accessible repositories (or a
  // failed repository service) does the same: nothing to pick from means the
  // grant-access guidance is the one ask on screen.
  assert.match(css, /\.firstrun-inner:has\(\[data-step="organization"\]\[data-state="action"\], \[data-step="organization"\]\[data-state="error"\], \[data-step="github"\]\[data-state="action"\], \[data-step="github"\]\[data-state="error"\], \[data-step="repositories"\]\[data-state="blocked"\], \[data-step="repositories"\]\[data-state="error"\]\) \.team-card\{ display:none; \}/);
  const githubCard = shell.match(/<article class="firstrun-card blocking-card github-card"[\s\S]*?<\/article>/);
  assert.ok(githubCard, "the GitHub connect card must exist");
  assert.match(githubCard[0], /data-github-action/);
  assert.match(app, /ui\.githubAction\.addEventListener\("click", startGitHubInstallation\)/);
  // The repository question is not a blocked-state card any more: it lives in
  // the create form itself (asserted in the picker test). What remains of the
  // repo card is the zero-accessible-repositories guidance, which never
  // competes with the GitHub connect card.
  const repoCard = shell.match(/<article class="firstrun-card blocking-card repo-card"[\s\S]*?<\/article>/);
  assert.ok(repoCard, "the repository guidance card must exist");
  assert.match(repoCard[0], /Grant repository access/);
  assert.match(repoCard[0], /data-repository-refresh/);
  assert.doesNotMatch(repoCard[0], /<form\b/);
  assert.match(app, /GitHub returned no accessible repositories\. Grant access in GitHub and refresh\./);
  assert.match(css, /\.firstrun-inner:has\(\[data-step="github"\]:not\(\[data-state="complete"\]\)\) \.repo-card\{ display:none; \}/);
  // After create, the handoff names what actually happens next.
  assert.match(shell, /Your Product Manager will open the conversation when the team is ready\./);
});

test("RequestTeam sends the engineer count and objective, defaulting to the floor and empty when the screen collects neither", () => {
  // The first-run screen no longer collects these; normalizeEngineerCount(null)
  // resolves to the included floor of three and the objective defaults empty,
  // so the request contract is unchanged.
  assert.match(app, /const engineerCount = normalizeEngineerCount\(form\.get\("engineerCount"\)\)/);
  assert.match(app, /const objective = stringValue\(form\.get\("teamObjective"\)\)/);
  assert.match(app, /apiRequest\("request_team", \{[\s\S]*?engineerCount,\s*\n\s*objective,\s*\n\s*repositoryIds\s*\n\s*\}\)/);
});

test("Settings exposes an engineer-count control that calls SetTeamEngineerCount with proration", () => {
  // A dedicated Engineering capacity card in the Settings view.
  assert.match(shell, /data-engineer-settings\b/);
  assert.match(shell, /Engineering capacity/);
  assert.match(shell, /<input[^>]*data-settings-engineer-input[^>]*>/);
  assert.match(shell, /id="settings-engineer-count"[^>]*min="3"[^>]*max="50"/);
  assert.match(shell, /data-settings-engineer-apply/);
  // The proration note the customer sees before applying.
  assert.match(shell, /increasing charges the prorated remainder now; decreasing credits your next invoice/i);
  // The control calls the new RPC with an idempotency key and reflects team.engineerCount.
  assert.match(app, /apiRequest\("set_team_engineer_count", \{/);
  assert.match(app, /engineerCount: target,/);
  assert.match(app, /idempotencyKey: mutationKeys\.for\("setEngineerCount"/);
  assert.match(app, /normalizeEngineerCount\(updated\.engineerCount/);
  // AUTHENTICATION_REQUIRED opens the hosted Stripe invoice; a hard decline is an
  // inline error handled like the RequestTeam off-session path.
  assert.match(app, /REQUEST_TEAM_SETTLEMENT\.AUTHENTICATION_REQUIRED/);
  assert.match(app, /validatedRedirect\(result\.authenticationUrl[^,]*, \["invoice\.stripe\.com"\]\)/);
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
  // A dedicated Settings view, reachable from the workspace sidebar nav.
  assert.match(shell, /id="workspace-settings"/);
  assert.match(shell, /data-view-link="settings"[^>]*href="#workspace-settings"/);
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
