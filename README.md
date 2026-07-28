# deep-navy-site

Public Jekyll site and authenticated early-access customer shell for deep navy.
Public pages are rendered as static HTML. `/app/` uses a public Amazon Cognito
app client with OAuth 2.0 authorization code + PKCE, then calls the configured
ConnectRPC API for server-confirmed onboarding state.

The onboarding client targets the additive launch contract finalized by
`platform-protos` revision `fa01d7cc4c68c1e7ee606a44677ad70d16f4c563`.
Only the generated Protobuf-ES descriptors required by this site are vendored
under `vendor/platform-protos`; `REVISION` and `MANIFEST.sha256` pin and verify
their source. The browser bundle uses the generated service descriptors with
Connect v2 instead of maintaining handwritten RPC paths or transport models.

The browser contains no provider credentials or client secret. The PKCE verifier
and OAuth state are transient in `sessionStorage`; access and ID tokens remain in
memory and are cleared by a hard refresh or sign-out.

The product GitHub App callback's one-time OAuth code and state are also held
only in the current tab while the customer re-authenticates with Cognito. They
are sent once to `CompleteGitHubInstallation`, never rendered, logged, or stored
in local storage, and are cleared after completion or a terminal error.

## Run locally

```sh
node --version # 22.14.0 or newer
npm ci
npm run build
bundle install
bundle exec jekyll serve --livereload
```

The marketing site works without runtime configuration. The app intentionally
shows a not-configured state and makes no backend requests.

To exercise a deployed development environment locally, set the public values
and generate the ignored runtime overlay:

```sh
DEEP_NAVY_ENVIRONMENT=development \
SITE_URL=http://localhost:4000 \
SITE_API_BASE_URL=https://api.dev.deep.navy \
SITE_COGNITO_DOMAIN=https://YOUR_DOMAIN.auth.us-west-2.amazoncognito.com \
SITE_COGNITO_CLIENT_ID=YOUR_PUBLIC_CLIENT_ID \
SITE_COGNITO_CALLBACK_URL=http://localhost:4000/app/callback/ \
SITE_COGNITO_LOGOUT_URL=http://localhost:4000/app/ \
SITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY \
ruby scripts/write_runtime_config.rb

bundle exec jekyll serve --config _config.yml,_config.runtime.yml
```

The callback and logout URLs must be allowlisted on the Cognito app client.
Never add a Cognito client secret, AWS credential, GitHub App private key,
Stripe secret/restricted key, webhook secret, access token, or password to these
variables. The Stripe publishable key is intentionally browser-visible.

## GitHub environment variables

The `develop` branch deploys through the `development` environment. `main`
deploys through `production`. Configure these public build inputs as GitHub
**environment variables**, not secrets:

| Variable | Example | Required |
| --- | --- | --- |
| `SITE_API_BASE_URL` | `https://api.dev.deep.navy` | for API-backed onboarding |
| `SITE_COGNITO_DOMAIN` | `https://deep-navy-dev.auth.us-west-2.amazoncognito.com` | for sign-in |
| `SITE_COGNITO_CLIENT_ID` | Cognito public app-client ID | for sign-in |
| `SITE_COGNITO_CALLBACK_URL` | exact deployed `/app/callback/` URL | for sign-in |
| `SITE_COGNITO_LOGOUT_URL` | exact deployed `/app/` URL | for sign-out |
| `SITE_PLAN_ID` | `founding-team` | optional; this is the default |
| `SITE_STRIPE_PUBLISHABLE_KEY` | environment-matched `pk_test_…` or `pk_live_…` | for Embedded Checkout |

`scripts/write_runtime_config.rb` accepts only this explicit public allowlist and
JSON-encodes it into `_config.runtime.yml`. The rendered configuration is visible
to every browser, as it must be for a public OAuth client.

## Product GitHub App settings

For the development Pages deployment, configure the customer-facing product
GitHub App—not the infrastructure automation App—as follows:

- Enable **Request user authorization (OAuth) during installation**.
- Set the first **Callback URL** to the exact rendered
  `/app/github/callback/` URL, including the GitHub Pages project base path.
- Leave **Setup URL** blank. GitHub makes it unavailable when OAuth during
  installation is enabled.
- Keep expiring user authorization tokens enabled. The API exchanges the
  one-time code, verifies the installation through `GET /user/installations`,
  independently confirms it with App authentication, and discards the user
  token.

GitHub's documented OAuth callback guarantees `code` and server-provided
`state`. `installation_id` and `setup_action` are accepted when present but are
not required by the browser; the API must securely resolve and verify the
installation when GitHub omits them.

## Onboarding behavior

The app never synthesizes completion:

- `GetCurrentUser` is the only source of user memberships and current organization context.
- A first organization is created only through idempotent `BootstrapOrganization`; an ambiguous retry reuses its key.
- `SelectOrganization` accepts only an organization returned in `GetCurrentUser.memberships`.
- GitHub starts through idempotent `StartGitHubInstallation` and is complete
  only after `CompleteGitHubInstallation` or `GetGitHubInstallation` returns an
  explicitly active typed state.
- Repository access is complete only after `GetRepositorySelection` or
  `UpdateRepositorySelection` returns a selection containing at least one
  currently accessible repository.
- The checkout display uses `GetBillingPlan`; the browser mounts the returned
  short-lived `client_secret` with Stripe Embedded Checkout and keeps it only
  in memory. Billing is complete only after `GetSubscription` returns typed
  `ACTIVE` state with a consistent paid/used/available team-slot snapshot.
- Prepaid packs come only from `ListCreditPacks`. Purchase requests send the
  public deep navy pack ID, selected team, quantity, exact return URL, and an
  idempotency key; the browser never sends a Stripe Price ID.
- Subscription capacity and team credits change only after signed webhook
  processing. A successful iframe callback or return URL is not fulfillment.
- The selected team’s visible prepaid balance comes from the organization- and
  team-scoped `BillingService.GetCreditBalance` ledger read. The browser checks
  it against `TeamCreditControl.ledger_available_micros` when both projections
  are available and shows a typed unavailable state instead of assuming zero.
- Invoice history comes only from the organization-scoped local billing
  projection. The browser never queries Stripe for invoice state and exposes a
  receipt link only when the API returns the exact HTTPS `invoice.stripe.com`
  origin.
- A team appears only after `ListTeams` or `CreateTeam` returns it.
- Queued and running teams resume `StreamProvisioningStatus` from the typed
  team sequence. Bounded `GetProvisioningStatus` polling remains a recovery
  path, with `GetTeam` as an additive compatibility fallback.
- The selected team roster comes only from `AgentService.ListAgents`.
- Team activity uses `ActivityService.StreamTeamActivity`; the browser renders
  only the typed `safe_summary` and allowlisted event metadata, never raw event
  details or model reasoning.
- The filterable activity ledger keeps source semantics intact: runtime A2A,
  session, tool, workspace/diff, issue, and pull-request events retain their
  ActivityService cursor; approvals come from ApprovalService, provisioning
  from ProvisioningService, and measured cost from EconomicsService.
- Team economics comes only from a matching team-scoped
  `EconomicsService.GetEconomics` response. The browser does not calculate or
  backfill missing ledger values.
- Pending decisions come only from team-scoped
  `ApprovalService.ListApprovals` pages filtered to typed `PENDING` status. The
  browser revalidates team scope, safe fields, unique IDs, and pagination
  cursors before rendering. Approval and denial responses are revalidated, and
  a bounded reason is required for every denial.
- Durable objectives are recovered through paginated, team-scoped
  `ObjectiveService.ListBusinessObjectives`; creating a new objective uses
  `CreateBusinessObjective`. The customer view renders the returned durable
  TPM dispatch state without inferring delivery, validates and reviews the
  objective's KPI definitions, and exhausts the selected objective's
  `InitiativeService.ListInitiatives` pages. KPI or initiative decisions appear
  only as real `ApprovalService` records; the objective view invents no action.
- GitHub and Billing Portal redirects must use HTTPS and the exact provider
  host. Subscription and credit purchases remain inside Embedded Checkout.
- API errors show an actionable unavailable state and, when present, a request ID.

## Verification

The custom Pages workflow builds with Ruby 3.3 and Jekyll 4.4.1, then uploads
the rendered `_site` directory through the official Pages artifact actions.

```sh
npm run check:vendor
npm run typecheck
npm run build
node --check assets/js/site.js
node --check assets/js/callback-scrubber.js
node --check assets/js/platform-api-client.js
node --check assets/js/organization-onboarding.js
node --check assets/js/launch-contract.js
node --check assets/js/app-state.js
node --check assets/js/app.js
npm test
ruby scripts/runtime_config_test.rb
bundle exec jekyll build --strict_front_matter
ruby scripts/check_site.rb _site
```
