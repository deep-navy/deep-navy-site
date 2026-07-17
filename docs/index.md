---
title: Documentation
description: Get started with Deep Navy, understand the onboarding sequence, and learn how authentication, GitHub access, billing, and team creation work.
updated: 2026-07-17
---

<section class="page-hero"><div class="shell"><span class="eyebrow">Documentation</span><h1>From account to first objective.</h1><p>A practical guide to onboarding your organization and knowing exactly which system handles each step.</p><div class="page-meta"><span>Customer guide</span><span>Updated July 17, 2026</span></div></div></section>

<section class="content-section"><div class="shell doc-layout">
  <nav class="doc-nav" aria-label="Documentation sections"><strong>On this page</strong><a href="#quickstart">Quickstart</a><a href="#authentication">Authentication</a><a href="#github">GitHub</a><a href="#billing">Billing</a><a href="#team">Team</a><a href="#readiness">Readiness</a><a href="#support">Support</a></nav>
  <article class="prose">
    <h2 id="quickstart">Quickstart</h2>
    <p>The application guides you through three server-verified prerequisites. A step is complete only after the platform API reports the corresponding state.</p>
    <ol><li><strong>Sign in.</strong> Authenticate through the environment's Amazon Cognito managed login.</li><li><strong>Connect GitHub.</strong> Request an installation link, install the Deep Navy GitHub App, and select repositories.</li><li><strong>Activate the subscription.</strong> Complete the server-created Stripe Checkout Session.</li><li><strong>Create the team.</strong> Name the engineering team after the first three requirements are active.</li><li><strong>Submit an objective.</strong> Begin with a measurable outcome and review the proposed KPIs and initiative.</li></ol>
    <div class="callout"><strong>Early-access readiness</strong><p>If the API, identity provider, GitHub App, or billing integration is not configured in the selected environment, the app names the missing dependency. It never marks the step complete locally.</p></div>

    <h2 id="authentication">Authentication</h2>
    <p>Deep Navy uses Amazon Cognito as its identity issuer. The browser uses the OAuth 2.0 authorization-code flow with PKCE and a public app client. No client secret is built into the site.</p>
    <p>The PKCE verifier and OAuth state are held briefly in <code>sessionStorage</code>. Returned tokens are kept in memory, not <code>localStorage</code>, and are cleared on refresh or sign-out. Expect to sign in again after a hard refresh during early access.</p>
    <h3>Sign-in failures</h3>
    <ul><li><code>Identity is not configured</code> means the deployment is missing its Cognito domain or client ID.</li><li><code>Authorization state did not match</code> means the callback was not paired with the current browser tab. Start sign-in again.</li><li><code>Token exchange failed</code> means Cognito rejected the one-time code, callback URL, or verifier. Do not retry the same callback URL; start again.</li></ul>

    <h2 id="github">GitHub installation</h2>
    <p>The application asks the API for a short-lived, organization-bound installation URL. GitHub handles the installation and repository selection. Deep Navy stores the installation mapping; it does not store a personal access token.</p>
    <p>Choose <strong>only selected repositories</strong> unless your organization has made a deliberate decision to grant access to every repository. See the <a href="{{ '/integrations/github/' | relative_url }}">GitHub integration guide</a> for the access model.</p>

    <h2 id="billing">Subscription</h2>
    <p>The app requests a Checkout Session from the billing API. Stripe collects payment details on its hosted page. Deep Navy updates subscription state only from verified, idempotently processed Stripe webhooks—not from the browser redirect alone.</p>

    <h2 id="team">Team creation</h2>
    <p>Team creation sends the organization ID, name, and a one-time idempotency key to the API. The backend must confirm an active subscription and installation before provisioning. Provisioning occurs asynchronously in an isolated Kubernetes namespace.</p>
    <p>Closing the browser does not cancel provisioning. When runtime views are enabled, the application reads the durable provisioning status from the API.</p>

    <h2 id="readiness">Environment readiness</h2>
    <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Indicator</th><th>Meaning</th><th>Action</th></tr></thead><tbody><tr><td>Configured</td><td>The browser has public endpoints and can attempt the flow.</td><td>Continue and rely on server state.</td></tr><tr><td>Not configured</td><td>A required public deployment value is absent.</td><td>Contact the pilot owner; no action was taken.</td></tr><tr><td>Service unavailable</td><td>The value exists, but the API or RPC is not reachable or implemented.</td><td>Retry once, then share the displayed request ID with support.</td></tr><tr><td>Needs action</td><td>The server reports an incomplete prerequisite.</td><td>Use the button for that step.</td></tr><tr><td>Complete</td><td>The server returned an installed, active, or created resource.</td><td>Continue to the next step.</td></tr></tbody></table></div>

    <h2 id="support">Support</h2>
    <p>Email <a href="mailto:support@deep.navy">support@deep.navy</a> with the environment, approximate time, visible error, and request ID. Never send access tokens, authorization codes, session cookies, private keys, or Stripe payment details.</p>
  </article>
</div></section>
