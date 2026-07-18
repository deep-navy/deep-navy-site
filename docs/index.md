---
title: Documentation
image: /assets/images/og/docs.png
description: Follow the deep navy onboarding procedure and review authentication, GitHub, billing, team provisioning, runtime, and recovery behavior.
updated: 2026-07-17
hide_cta: true
---

<section class="page-hero">
  <div class="shell">
    <span class="eyebrow">Customer procedure / onboarding</span>
    <h1>Establish a team in six verified steps.</h1>
    <p>The customer application advances only after the platform reports the required organization, installation, repository, subscription, and team state.</p>
    <div class="page-meta">
      <span>Source: customer application + deepnavy.v1 contract</span>
      <span>Version: early access / v1</span>
      <span>Updated: 2026-07-17</span>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="shell doc-layout">
    <nav class="doc-nav" aria-label="Documentation sections">
      <strong>Procedure index</strong>
      <a href="#quickstart">Six-step quickstart</a>
      <a href="#authentication">Authentication</a>
      <a href="#github">GitHub installation</a>
      <a href="#billing">Subscription</a>
      <a href="#team">Team provisioning</a>
      <a href="#runtime">Runtime views</a>
      <a href="#readiness">State reference</a>
      <a href="#support">Support record</a>
      <a href="{{ '/docs/api/' | relative_url }}">Generated API reference</a>
    </nav>

    <article class="prose">
      <h2 id="quickstart">Six-step quickstart</h2>
      <p>Complete the rows in order. The browser does not infer completion from a redirect, a button click, or local storage; each durable state comes from the platform API. Engineers can inspect the current messages, enums, services, and RPCs in the <a href="{{ '/docs/api/' | relative_url }}">generated API reference</a>.</p>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Step</th><th>Prerequisite</th><th>Action</th><th>Expected state</th><th>Recovery</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>01 / Sign in</code></td>
              <td>Public Cognito domain, client ID, callback URL, and OAuth scopes are present in the selected deployment.</td>
              <td>Select <strong>Sign in</strong> and complete the Cognito authorization-code flow with PKCE.</td>
              <td>The returned access and ID tokens pass the client, nonce, token-use, and expiration checks. Tokens remain in memory.</td>
              <td>If the application reports <code>This environment is not ready for sign-in</code>, the deployment owner must supply the listed public values. For a callback error, start a new sign-in transaction.</td>
            </tr>
            <tr>
              <td><code>02 / Organization</code></td>
              <td>An authenticated current-user request has completed.</td>
              <td>Create the first organization or select an organization from the memberships returned by the API.</td>
              <td>The API returns one current organization ID within the signed-in user's memberships.</td>
              <td>Retry the same create request when offered; its idempotency key prevents duplicate work. If selection fails, reselect a membership returned by the API.</td>
            </tr>
            <tr>
              <td><code>03 / GitHub</code></td>
              <td>A current organization is selected.</td>
              <td>Request an installation link, install the deep navy GitHub App in the intended GitHub organization, and return to the customer application.</td>
              <td>The API reports an active installation bound to the current deep navy organization.</td>
              <td>Restart the installation from the customer application if the continuation expires or the organization changes. Do not reuse a callback URL.</td>
            </tr>
            <tr>
              <td><code>04 / Repositories</code></td>
              <td>The GitHub installation is active.</td>
              <td>Select the repositories the team may use and save the selection.</td>
              <td>The API returns the selected mode, repository IDs, and a new selection version for the current organization.</td>
              <td>Refresh the repository list after changing GitHub App access. If the selection version conflicts, reload the server state before saving again.</td>
            </tr>
            <tr>
              <td><code>05 / Subscription</code></td>
              <td>Organization, GitHub installation, and repository selection are active.</td>
              <td>Open the server-created Stripe Checkout Session and complete checkout on Stripe.</td>
              <td>The billing API reports an active subscription after processing the signed Stripe webhook.</td>
              <td>Return to the application and allow it to reconcile. A successful browser redirect alone does not activate the subscription; contact support if the server state remains pending.</td>
            </tr>
            <tr>
              <td><code>06 / Team</code></td>
              <td>The subscription is active and the GitHub installation has a saved repository selection.</td>
              <td>Name the team and submit the create request.</td>
              <td>The API returns a team ID and durable provisioning state. Provisioning may continue asynchronously.</td>
              <td>Retry the displayed create action if the outcome is unknown; the one-time idempotency key protects the operation. Use the reported provisioning state or request ID for follow-up.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="authentication">Authentication reference</h2>
      <p>Amazon Cognito is the identity issuer. The browser uses OAuth 2.0 authorization code with PKCE and a public app client. There is no Cognito client secret in the static site.</p>
      <p>The PKCE verifier, OAuth state, and nonce are held temporarily in <code>sessionStorage</code>. They are removed before the token request. Access and ID tokens are held in JavaScript memory, excluded from <code>localStorage</code>, and cleared by a refresh or sign-out.</p>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Displayed error</th><th>Meaning</th><th>Operator response</th></tr></thead>
          <tbody>
            <tr><td><code>This environment is not ready for sign-in</code></td><td>The deployment is missing its Cognito domain, public client ID, callback URL, or platform API origin.</td><td>Ask the deployment owner to complete the listed public runtime configuration.</td></tr>
            <tr><td><code>Sign-in is not available</code></td><td>The public Cognito configuration or required browser cryptography support is unavailable.</td><td>Use a current browser; if the message remains, ask the deployment owner to inspect the public Cognito values.</td></tr>
            <tr><td><code>Authorization state did not match</code></td><td>The callback was not paired with the current sign-in transaction in this browser tab, or the transaction expired.</td><td>Start sign-in again. No token request was sent for the mismatched callback.</td></tr>
            <tr><td><code>Token exchange failed</code></td><td>Cognito rejected or could not complete the one-time code exchange.</td><td>Do not retry the same callback URL. Start a new sign-in transaction.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="github">GitHub installation</h2>
      <p>The application requests a short-lived, organization-bound installation link from the API. GitHub performs installation and repository authorization. deep navy retains the installation mapping; the customer does not provide a personal access token.</p>
      <p>Select <strong>only selected repositories</strong> unless the GitHub organization owner has approved access to all repositories. The <a href="{{ '/integrations/github/' | relative_url }}">GitHub integration reference</a> records the permission and callback model.</p>

      <h2 id="billing">Subscription</h2>
      <p>The billing API creates a short-lived Stripe Checkout Session and returns only the client secret required to mount Stripe Embedded Checkout inside the deep navy purchase dialog. The platform changes subscription state after a verified, idempotently processed Stripe webhook; the embedded completion callback is only a reconciliation signal.</p>
      <p>For a selected team, <code>BillingService.GetCreditBalance</code> returns the authoritative prepaid ledger balance. The dashboard keeps that balance separate from open reservations and the paid-period hard limit, reconciles it with the credit-control projection when both are available, and displays unavailable rather than inventing a zero.</p>

      <h2 id="team">Team provisioning</h2>
      <p>The create request contains the organization ID, team name, and a one-time idempotency key. The backend checks the active subscription, GitHub installation, and repository selection before it accepts provisioning.</p>
      <p>Provisioning is asynchronous. Closing the browser does not cancel it. The application reads the durable team and provisioning state from the API when the session resumes.</p>

      <h2 id="runtime">Runtime views</h2>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>View</th><th>Source</th><th>Current contract</th></tr></thead>
          <tbody>
            <tr><td>Teams</td><td><code>TeamService</code> and <code>ProvisioningService</code></td><td>Returns organization-scoped teams and resumes durable provisioning updates from a team cursor.</td></tr>
            <tr><td>Roles</td><td><code>AgentService</code></td><td>Lists the six provisioned role records for the selected team.</td></tr>
            <tr><td>Activity</td><td><code>ActivityService</code>, <code>ProvisioningService</code>, <code>ApprovalService</code>, and <code>EconomicsService</code></td><td>Filters typed A2A, session, tool, workspace/diff, delivery, approval, provisioning, and cost records while preserving each source’s cursor or snapshot semantics. Hidden model reasoning is excluded.</td></tr>
            <tr><td>Economics</td><td><code>EconomicsService</code> and <code>BillingService.GetCreditBalance</code></td><td>Returns attributable cost and measured usage for the selected scope, plus the selected team’s authoritative prepaid ledger balance with explicit unavailable handling.</td></tr>
            <tr><td>Approvals</td><td><code>ApprovalService.ListApprovals</code> and <code>DecideApproval</code></td><td>Lists team-scoped pending safe summaries with snapshot pagination. Authorized owners or administrators can approve; denial requires a bounded reason.</td></tr>
            <tr><td>Objectives</td><td><code>ObjectiveService.ListBusinessObjectives</code>, <code>CreateBusinessObjective</code>, and <code>InitiativeService.ListInitiatives</code></td><td>Recovers durable team objectives through snapshot pagination, reports the durable TPM handoff state, reviews validated KPI definitions, creates objectives idempotently, and lists the full proposal context for selected-objective initiatives. Decisions remain in the real ApprovalService queue.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="readiness">State reference</h2>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Indicator</th><th>Meaning</th><th>Response</th></tr></thead>
          <tbody>
            <tr><td>Configured</td><td>The browser has the public endpoint values required to attempt the request.</td><td>Continue; rely on the service response for durable state.</td></tr>
            <tr><td>Not configured</td><td>A required public deployment value is absent.</td><td>Contact the deployment owner. No service completion was assumed.</td></tr>
            <tr><td>Service unavailable</td><td>The public value exists, but the API or RPC cannot be reached or has not implemented the procedure.</td><td>Retry once, then send the request ID and timestamp to support.</td></tr>
            <tr><td>Needs action</td><td>The service reports an incomplete prerequisite.</td><td>Use the action in the current setup row.</td></tr>
            <tr><td>Complete</td><td>The service returned the required installed, active, saved, or created resource.</td><td>Continue to the next row.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="support">Support record</h2>
      <p>Email <a href="mailto:support@deep.navy">support@deep.navy</a> with the deployment environment, approximate time, displayed error, and request ID. Do not send access tokens, authorization codes, session cookies, private keys, customer source code, or Stripe payment details.</p>
    </article>
  </div>
</section>
