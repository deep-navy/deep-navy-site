(() => {
  "use strict";

  // ── Icon motion ─────────────────────────────────────────────────────────
  // "Every icon animates — there are no still icons in this system." The family an icon
  // moves in is DERIVED from the glyph's own sprite id (icon-motion.js), never chosen at
  // the call site, so a glyph added tomorrow animates without anyone classifying it.
  //
  // Two entry points, because this console builds icons two ways. applyIconMotion() walks
  // the shell's static markup once; applyIconMotionTo() classifies each icon the renderers
  // below create. Both read the same table, so they cannot drift into disagreeing about
  // what a bell does.
  const iconMotion = window.deepNavyIconMotion || null;
  if (iconMotion) iconMotion.applyIconMotion(document);

  // The renderers always draw with fill="none" stroke="currentColor", so a glyph here is
  // stroked whatever the sprite's own artwork is — draw always has a line to run along and
  // the computed-stroke check applyIconMotion() needs is not in play.
  function applyIconMotionTo(svg, glyph) {
    if (!iconMotion) return svg;
    const motion = iconMotion.motionFor(glyph);
    svg.classList.add("dn-icon--" + motion);
    svg.setAttribute("data-motion", motion);
    return svg;
  }

  const config = window.deepNavyRuntime || {};
  const ui = {
    environmentFields: [...document.querySelectorAll("[data-environment]")],
    contextOrganization: document.querySelector("[data-context-organization]"),
    contextRepositories: document.querySelector("[data-context-repositories]"),
    contextTeam: document.querySelector("[data-context-team]"),
    configBanner: document.querySelector("[data-config-banner]"),
    configTitle: document.querySelector("[data-config-title]"),
    configMessage: document.querySelector("[data-config-message]"),
    authBanner: document.querySelector("[data-auth-banner]"),
    authTitle: document.querySelector("[data-auth-title]"),
    authMessage: document.querySelector("[data-auth-message]"),
    signedOut: document.querySelector("[data-signed-out]"),
    authenticated: document.querySelector("[data-authenticated]"),
    signIn: document.querySelector("[data-sign-in]"),
    retrySignIn: document.querySelector("[data-retry-sign-in]"),
    signOut: document.querySelector("[data-sign-out]"),
    sessionState: document.querySelector("[data-session-state]"),
    authenticatedNav: document.querySelector("[data-authenticated-nav]"),
    userSummary: document.querySelector("[data-user-summary]"),
    userInitial: document.querySelector("[data-user-initial]"),
    userName: document.querySelector("[data-user-name]"),
    userLogin: document.querySelector("[data-user-login]"),
    userRole: document.querySelector("[data-user-role]"),
    railUser: document.querySelector("[data-rail-user]"),
    railCrew: document.querySelector("[data-rail-crew]"),
    railCrewScope: document.querySelector("[data-rail-crew-scope]"),
    teamHeadline: document.querySelector("[data-team-headline]"),
    teamMeasure: document.querySelector("[data-team-measure]"),
    teamPhase: document.querySelector("[data-team-phase]"),
    objectiveEyebrow: document.querySelector("[data-objective-eyebrow]"),
    teamSysbar: document.querySelector("[data-team-sysbar]"),
    teamSysbarGlyph: document.querySelector("[data-team-sysbar-glyph]"),
    teamSysbarMsg: document.querySelector("[data-team-sysbar-msg]"),
    teamSysbarDetail: document.querySelector("[data-team-sysbar-detail]"),
    interview: document.querySelector("[data-interview]"),
    crewPanel: document.querySelector("[data-crew-panel]"),
    consolePlate: document.querySelector("[data-console-plate]"),
    answerPm: document.querySelector("[data-answer-pm]"),
    initiativesPanel: document.querySelector("[data-initiatives-panel]"),
    initiativesCount: document.querySelector("[data-initiatives-count]"),
    teamInitiatives: document.querySelector("[data-team-initiatives]"),
    workPanel: document.querySelector("[data-work-panel]"),
    workCount: document.querySelector("[data-work-count]"),
    teamReposPanel: document.querySelector("[data-team-repos-panel]"),
    teamRepos: document.querySelector("[data-team-repos]"),
    organizationDependent: document.querySelector("[data-organization-dependent]"),
    organizationConnect: document.querySelector("[data-organization-connect]"),
    organizationBootstrapForm: document.querySelector("[data-organization-bootstrap]"),
    organizationBootstrapInput: document.querySelector("[data-organization-bootstrap] input"),
    organizationBootstrapSubmit: document.querySelector("[data-organization-bootstrap] button"),
    organizationSelectForm: document.querySelector("[data-organization-select]"),
    organizationSelectInput: document.querySelector("[data-organization-select] select"),
    organizationSelectSubmit: document.querySelector("[data-organization-select] button"),
    organizationSwitch: document.querySelector("[data-organization-switch]"),
    organizationSwitchInput: document.querySelector("[data-organization-switch-input]"),
    organizationConnectOther: document.querySelector("[data-organization-connect-other]"),
    profileRetry: document.querySelector("[data-profile-retry]"),
    githubAction: document.querySelector("[data-github-action]"),
    repositoryList: document.querySelector("[data-repository-list]"),
    repositoryNote: document.querySelector("[data-repository-note]"),
    repositoryRefresh: document.querySelector("[data-repository-refresh]"),
    repositoryManageAccess: document.querySelector("[data-repository-manage-access]"),
    repositoryRefreshInline: document.querySelector("[data-repository-refresh-inline]"),
    teamRepositoriesError: document.querySelector("[data-team-repositories-error]"),
    planSummary: document.querySelector("[data-plan-summary]"),
    planName: document.querySelector("[data-plan-name]"),
    planPrice: document.querySelector("[data-plan-price]"),
    planCredits: document.querySelector("[data-plan-credits]"),
    planSlots: document.querySelector("[data-plan-slots]"),
    settingsAccountName: document.querySelector("[data-settings-account-name]"),
    settingsAccountLogin: document.querySelector("[data-settings-account-login]"),
    settingsAccountOrg: document.querySelector("[data-settings-account-org]"),
    settingsMembers: document.querySelector("[data-settings-members]"),
    settingsMembersEmpty: document.querySelector("[data-settings-members-empty]"),
    settingsMembersCount: document.querySelector("[data-settings-members-count]"),
    settingsBillingState: document.querySelector("[data-settings-billing-state]"),
    settingsTeamCount: document.querySelector("[data-settings-team-count]"),
    settingsBillingAmount: document.querySelector("[data-settings-billing-amount]"),
    settingsBillingUnit: document.querySelector("[data-settings-billing-unit]"),
    settingsPaymentMethod: document.querySelector("[data-settings-payment-method]"),
    settingsBillingNote: document.querySelector("[data-settings-billing-note]"),
    settingsBillingManage: document.querySelector("[data-settings-billing-manage]"),
    teamForm: document.querySelector("[data-team-form]"),
    teamInput: document.querySelector('[data-team-form] input[name="teamName"]'),
    teamSubmit: document.querySelector('[data-team-form] button[type="submit"]'),
    teamError: document.querySelector("[data-team-error]"),
    engineerInput: document.querySelector("[data-engineer-input]"),
    engineerDecrement: document.querySelector("[data-engineer-decrement]"),
    engineerIncrement: document.querySelector("[data-engineer-increment]"),
    teamPriceAmount: document.querySelector("[data-team-price-amount]"),
    teamPriceBreakdown: document.querySelector("[data-team-price-breakdown]"),
    engineerSettings: document.querySelector("[data-engineer-settings]"),
    engineerSettingsState: document.querySelector("[data-engineer-settings-state]"),
    engineerSettingsTeam: document.querySelector("[data-engineer-settings-team]"),
    engineerSettingsField: document.querySelector("[data-engineer-settings-field]"),
    settingsEngineerInput: document.querySelector("[data-settings-engineer-input]"),
    settingsEngineerDecrement: document.querySelector("[data-settings-engineer-decrement]"),
    settingsEngineerIncrement: document.querySelector("[data-settings-engineer-increment]"),
    settingsEngineerPrice: document.querySelector("[data-settings-engineer-price]"),
    settingsEngineerNote: document.querySelector("[data-settings-engineer-note]"),
    settingsEngineerError: document.querySelector("[data-settings-engineer-error]"),
    settingsEngineerApply: document.querySelector("[data-settings-engineer-apply]"),
    repoSettings: document.querySelector("[data-repo-settings]"),
    repoSettingsState: document.querySelector("[data-repo-settings-state]"),
    repoSettingsTeam: document.querySelector("[data-repo-settings-team]"),
    repoSettingsField: document.querySelector("[data-repo-settings-field]"),
    settingsRepositoryList: document.querySelector("[data-settings-repository-list]"),
    settingsRepositoryNote: document.querySelector("[data-settings-repository-note]"),
    settingsRepositoriesError: document.querySelector("[data-settings-repositories-error]"),
    settingsRepositoriesNote: document.querySelector("[data-settings-repositories-note]"),
    settingsRepositoriesApply: document.querySelector("[data-settings-repositories-apply]"),
    settingsRepositoryManageAccess: document.querySelector("[data-settings-repository-manage-access]"),
    settingsRepositoryRefresh: document.querySelector("[data-settings-repository-refresh]"),
    organizationError: document.querySelector("[data-organization-error]"),
    refresh: document.querySelector("[data-refresh]"),
    teamsEmpty: document.querySelector("[data-teams-empty]"),
    teamList: document.querySelector("[data-team-list]"),
    progressSummary: document.querySelector("[data-progress-summary]"),
    progressHeadline: document.querySelector("[data-progress-headline]"),
    progressSteps: [...document.querySelectorAll("[data-progress-step]")],
    dashboardState: document.querySelector("[data-dashboard-state]"),
    teamSelect: document.querySelector("[data-team-select]"),
    agentsState: document.querySelector("[data-agents-state]"),
    agentsEmpty: document.querySelector("[data-agents-empty]"),
    agentList: document.querySelector("[data-agent-list]"),
    agentDetailState: document.querySelector("[data-agent-state]"),
    agentMissing: document.querySelector("[data-agent-missing]"),
    agentBody: document.querySelector("[data-agent-body]"),
    agentMonogram: document.querySelector("[data-agent-monogram]"),
    agentEyebrow: document.querySelector("[data-agent-eyebrow]"),
    agentName: document.querySelector("[data-agent-name]"),
    agentDescription: document.querySelector("[data-agent-description]"),
    agentLivenessChip: document.querySelector("[data-agent-liveness]"),
    agentModel: document.querySelector("[data-agent-model]"),
    agentHeartbeat: document.querySelector("[data-agent-heartbeat]"),
    agentCountSessions: document.querySelector("[data-agent-count-sessions]"),
    agentCountSessionsNote: document.querySelector("[data-agent-count-sessions-note]"),
    agentCountChanges: document.querySelector("[data-agent-count-changes]"),
    agentCountChangesNote: document.querySelector("[data-agent-count-changes-note]"),
    agentCountSpend: document.querySelector("[data-agent-count-spend]"),
    agentCountSpendNote: document.querySelector("[data-agent-count-spend-note]"),
    agentActivityEmpty: document.querySelector("[data-agent-activity-empty]"),
    agentActivityList: document.querySelector("[data-agent-activity-list]"),
    agentSessionsState: document.querySelector("[data-agent-sessions-state]"),
    agentSessionsEmpty: document.querySelector("[data-agent-sessions-empty]"),
    agentSessionsList: document.querySelector("[data-agent-sessions-list]"),
    agentChangesState: document.querySelector("[data-agent-changes-state]"),
    agentChangesEmpty: document.querySelector("[data-agent-changes-empty]"),
    agentChangesList: document.querySelector("[data-agent-changes-list]"),
    agentDoingPanel: document.querySelector("[data-agent-doing-panel]"),
    agentDoing: document.querySelector("[data-agent-doing]"),
    agentSpend: document.querySelector("[data-agent-spend]"),
    statStrip: document.querySelector("[data-stat-strip]"),
    statObjectives: document.querySelector("[data-stat-objectives]"),
    statObjectivesNote: document.querySelector("[data-stat-objectives-note]"),
    statCredits: document.querySelector("[data-stat-credits]"),
    statCreditsFill: document.querySelector("[data-stat-credits-fill]"),
    statCreditsNote: document.querySelector("[data-stat-credits-note]"),
    statDelivery: document.querySelector("[data-stat-delivery]"),
    statDeliveryNote: document.querySelector("[data-stat-delivery-note]"),
    statAgents: document.querySelector("[data-stat-agents]"),
    statAgentsNote: document.querySelector("[data-stat-agents-note]"),
    conversationState: document.querySelector("[data-conversation-state]"),
    conversationEmpty: document.querySelector("[data-conversation-empty]"),
    consoleTitle: document.querySelector("[data-console-title]"),
    activityConsoleLink: document.querySelector("[data-activity-console-link]"),
    conversationBriefing: document.querySelector("[data-conversation-briefing]"),
    conversationBriefingLabel: document.querySelector("[data-conversation-briefing-label]"),
    conversationBriefingBody: document.querySelector("[data-conversation-briefing-body]"),
    conversationThread: document.querySelector("[data-conversation-thread]"),
    conversationTyping: document.querySelector("[data-conversation-typing]"),
    conversationTypingCopy: document.querySelector("[data-conversation-typing-copy]"),
    conversationForm: document.querySelector("[data-conversation-form]"),
    conversationInput: document.querySelector('[data-conversation-form] textarea[name="conversationText"]'),
    conversationSubmit: document.querySelector('[data-conversation-form] button[type="submit"]'),
    conversationHint: document.querySelector("[data-conversation-hint]"),
    conversationError: document.querySelector("[data-conversation-error]"),
    conversationRetry: document.querySelector("[data-conversation-retry]"),
    conversationFormat: document.querySelector("[data-conversation-format]"),
    objectiveState: document.querySelector("[data-objective-state]"),
    objectiveEmpty: document.querySelector("[data-objective-empty]"),
    objectiveSelectControl: document.querySelector("[data-objective-select-control]"),
    objectiveSelect: document.querySelector("[data-objective-select]"),
    objectiveForm: document.querySelector("[data-objective-form]"),
    objectiveTitleInput: document.querySelector('[data-objective-form] input[name="objectiveTitle"]'),
    objectiveDescriptionInput: document.querySelector('[data-objective-form] textarea[name="objectiveDescription"]'),
    objectiveSubmit: document.querySelector("[data-objective-form] button"),
    objectiveError: document.querySelector("[data-objective-error]"),
    objectiveRecord: document.querySelector("[data-objective-record]"),
    objectiveCheck: document.querySelector("[data-objective-check]"),
    objectiveTitle: document.querySelector("[data-objective-title]"),
    objectiveDescription: document.querySelector("[data-objective-description]"),
    objectiveDispatchState: document.querySelector("[data-objective-dispatch-state]"),
    objectiveDispatchDetail: document.querySelector("[data-objective-dispatch-detail]"),
    objectiveKpiState: document.querySelector("[data-objective-kpi-state]"),
    objectiveKpiEmpty: document.querySelector("[data-objective-kpi-empty]"),
    objectiveKpiList: document.querySelector("[data-objective-kpi-list]"),
    initiativeState: document.querySelector("[data-initiative-state]"),
    initiativeList: document.querySelector("[data-initiative-list]"),
    objectivesViewState: document.querySelector("[data-objectives-view-state]"),
    objectivesViewEmpty: document.querySelector("[data-objectives-view-empty]"),
    objectivesViewList: document.querySelector("[data-objectives-view-list]"),
    activityState: document.querySelector("[data-activity-state]"),
    activityFilters: document.querySelector("[data-activity-filters]"),
    activityFilterButtons: [...document.querySelectorAll("[data-activity-filter]")],
    activityFilterCounts: [...document.querySelectorAll("[data-activity-filter-count]")],
    activityEmpty: document.querySelector("[data-activity-empty]"),
    activityList: document.querySelector("[data-activity-list]"),
    activityRetry: document.querySelector("[data-activity-retry]"),
    // The Activity, Runs, People and Billing screens. Every hook below is a
    // container a render fills; none of them holds a value the markup shipped,
    // so a screen can never show a figure no response confirmed.
    activityScreenState: document.querySelector("[data-activity-screen-state]"),
    activityScreenRetry: document.querySelector("[data-activity-screen-retry]"),
    activityScreenCount: document.querySelector("[data-activity-screen-count]"),
    activityScreenList: document.querySelector("[data-activity-screen-list]"),
    activityScreenEmpty: document.querySelector("[data-activity-screen-empty]"),
    activityAgents: document.querySelector("[data-activity-agents]"),
    activityAgentsMeta: document.querySelector("[data-activity-agents-meta]"),
    activityReach: document.querySelector("[data-activity-reach]"),
    runsState: document.querySelector("[data-runs-state]"),
    runsSessions: document.querySelector("[data-runs-sessions]"),
    runsSessionsMeta: document.querySelector("[data-runs-sessions-meta]"),
    runsSessionsMore: document.querySelector("[data-runs-sessions-more]"),
    runsChanges: document.querySelector("[data-runs-changes]"),
    runsChangesMeta: document.querySelector("[data-runs-changes-meta]"),
    runsChangesMore: document.querySelector("[data-runs-changes-more]"),
    runsSpend: document.querySelector("[data-runs-spend]"),
    runsSpendMeta: document.querySelector("[data-runs-spend-meta]"),
    runsTrace: document.querySelector("[data-runs-trace]"),
    peopleState: document.querySelector("[data-people-state]"),
    peopleRoster: document.querySelector("[data-people-roster]"),
    peopleRosterMeta: document.querySelector("[data-people-roster-meta]"),
    peopleReach: document.querySelector("[data-people-reach]"),
    peopleAccess: document.querySelector("[data-people-access]"),
    peopleRules: document.querySelector("[data-people-rules]"),
    billingState: document.querySelector("[data-billing-state]"),
    billingStats: document.querySelector("[data-billing-stats]"),
    billingSubscription: document.querySelector("[data-billing-subscription]"),
    billingSubscriptionMeta: document.querySelector("[data-billing-subscription-meta]"),
    billingTeams: document.querySelector("[data-billing-teams]"),
    billingTeamsMeta: document.querySelector("[data-billing-teams-meta]"),
    billingCredits: document.querySelector("[data-billing-credits]"),
    billingCreditsMeta: document.querySelector("[data-billing-credits-meta]"),
    billingPortal: document.querySelector("[data-billing-portal]"),
    sessionHistoryState: document.querySelector("[data-session-history-state]"),
    sessionsMore: document.querySelector("[data-sessions-more]"),
    workspaceHistoryState: document.querySelector("[data-workspace-history-state]"),
    workspaceMore: document.querySelector("[data-workspace-more]"),
    deliveryHistoryState: document.querySelector("[data-delivery-history-state]"),
    deliveryRepository: document.querySelector("[data-delivery-repository]"),
    issuesMore: document.querySelector("[data-issues-more]"),
    pullRequestsMore: document.querySelector("[data-pull-requests-more]"),
    economicsState: document.querySelector("[data-economics-state]"),
    economicsMessage: document.querySelector("[data-economics-message]"),
    economicsEmpty: document.querySelector("[data-economics-empty]"),
    economicsMetrics: document.querySelector("[data-economics-metrics]"),
    economicsCreditValue: document.querySelector("[data-economics-credit-value]"),
    economicsBreakdownNote: document.querySelector("[data-economics-breakdown-note]"),
    economicsCreditsUsed: document.querySelector("[data-economics-credits-used]"),
    economicsCreditsRemaining: document.querySelector("[data-economics-credits-remaining]"),
    economicsMeasured: document.querySelector("[data-economics-measured]"),
    economicsBreakdown: document.querySelector("[data-economics-breakdown]"),
    economicsBreakdownState: document.querySelector("[data-economics-breakdown-state]"),
    economicsGroup: document.querySelector("[data-economics-group]"),
    economicsBreakdownEmpty: document.querySelector("[data-economics-breakdown-empty]"),
    economicsBreakdownList: document.querySelector("[data-economics-breakdown-list]"),
    creditBalancePanel: document.querySelector("[data-credit-balance-panel]"),
    creditBalanceState: document.querySelector("[data-credit-balance-state]"),
    creditBalanceValue: document.querySelector("[data-credit-balance-value]"),
    creditMovementsPanel: document.querySelector("[data-credit-movements-panel]"),
    creditMovementsState: document.querySelector("[data-credit-movements-state]"),
    creditMovementsLive: document.querySelector("[data-credit-movements-live]"),
    creditMovementsOrg: document.querySelector("[data-credit-movements-org]"),
    creditMovementsEmpty: document.querySelector("[data-credit-movements-empty]"),
    creditMovementsList: document.querySelector("[data-credit-movement-list]"),
    creditMovementsMessage: document.querySelector("[data-credit-movements-message]"),
  descent: document.querySelector("[data-descent]"),
  descentList: document.querySelector("[data-descent-list]"),
  teamTiles: document.querySelector("[data-team-tiles]"),
  teamTilesEmpty: document.querySelector("[data-team-tiles-empty]"),
  teamTilesState: document.querySelector("[data-team-tiles-state]"),
  teamTilesNote: document.querySelector("[data-team-tiles-note]"),
  laneChart: document.querySelector("[data-lane-chart]"),
  lanesEmpty: document.querySelector("[data-lanes-empty]"),
  lanesWindow: document.querySelector("[data-lanes-window]"),
  roleBars: document.querySelector("[data-role-bars]"),
  roleBarsEmpty: document.querySelector("[data-role-bars-empty]"),
  roleBarsWindow: document.querySelector("[data-role-bars-window]"),
  roleBarsLegend: document.querySelector("[data-role-bars-legend]"),
  firstrunCount: document.querySelector("[data-firstrun-count]"),
  railSpend: document.querySelector("[data-rail-spend]"),
  railSpendValue: document.querySelector("[data-rail-spend-value]"),
  railSpendFill: document.querySelector("[data-rail-spend-fill]"),
  railSpendNote: document.querySelector("[data-rail-spend-note]"),
    creditBalanceMessage: document.querySelector("[data-credit-balance-message]"),
    creditControl: document.querySelector("[data-credit-control]"),
    creditControlState: document.querySelector("[data-credit-control-state]"),
    creditOpenReserved: document.querySelector("[data-credit-open-reserved]"),
    creditPeriodConsumed: document.querySelector("[data-credit-period-consumed]"),
    creditHardLimit: document.querySelector("[data-credit-hard-limit]"),
    creditEffectiveAvailable: document.querySelector("[data-credit-effective-available]"),
    creditControlForm: document.querySelector("[data-credit-control-form]"),
    creditHardLimitInput: document.querySelector("[data-credit-hard-limit-input]"),
    creditCustomerPaused: document.querySelector("[data-credit-customer-paused]"),
    creditControlSummary: document.querySelector("[data-credit-control-summary]"),
    creditControlError: document.querySelector("[data-credit-control-error]"),
    creditControlSubmit: document.querySelector("[data-credit-control-submit]"),
    approvalsState: document.querySelector("[data-approvals-state]"),
    approvalsEmpty: document.querySelector("[data-approvals-empty]"),
    approvalList: document.querySelector("[data-approval-list]"),
    approvalsMore: document.querySelector("[data-approvals-more]"),
    signoffCard: document.querySelector("[data-signoff-card]"),
    signoffList: document.querySelector("[data-signoff-list]"),
    signoffLocking: document.querySelector("[data-signoff-locking]"),
    creditPackForm: document.querySelector("[data-credit-pack-form]"),
    creditPackSelect: document.querySelector("[data-credit-pack-select]"),
    creditPackQuantity: document.querySelector("[data-credit-pack-quantity]"),
    creditPackSummary: document.querySelector("[data-credit-pack-summary]"),
    creditPackError: document.querySelector("[data-credit-pack-error]"),
    creditPackSubmit: document.querySelector("[data-credit-pack-submit]"),
    topUpPanel: document.querySelector("[data-topup-panel]"),
    topUpState: document.querySelector("[data-topup-state]"),
    topUpNotice: document.querySelector("[data-topup-notice]"),
    topUpSummary: document.querySelector("[data-topup-summary]"),
    topUpForm: document.querySelector("[data-topup-form]"),
    topUpEnabled: document.querySelector("[data-topup-enabled]"),
    topUpThreshold: document.querySelector("[data-topup-threshold]"),
    topUpPack: document.querySelector("[data-topup-pack]"),
    topUpQuantity: document.querySelector("[data-topup-quantity]"),
    topUpCap: document.querySelector("[data-topup-cap]"),
    topUpCapNote: document.querySelector("[data-topup-cap-note]"),
    topUpConsent: document.querySelector("[data-topup-consent]"),
    topUpConsentTitle: document.querySelector("[data-topup-consent-title]"),
    topUpConsentText: document.querySelector("[data-topup-consent-text]"),
    topUpConsentAccept: document.querySelector("[data-topup-consent-accept]"),
    topUpConsentVersion: document.querySelector("[data-topup-consent-version]"),
    topUpSummaryLine: document.querySelector("[data-topup-summary-line]"),
    topUpError: document.querySelector("[data-topup-error]"),
    topUpSubmit: document.querySelector("[data-topup-submit]"),
    topUpHistoryState: document.querySelector("[data-topup-history-state]"),
    topUpHistoryEmpty: document.querySelector("[data-topup-history-empty]"),
    topUpHistoryList: document.querySelector("[data-topup-history-list]"),
    invoiceHistory: document.querySelector("[data-invoice-history]"),
    invoiceState: document.querySelector("[data-invoice-state]"),
    invoiceEmpty: document.querySelector("[data-invoice-empty]"),
    invoiceList: document.querySelector("[data-invoice-list]"),
    invoiceMore: document.querySelector("[data-invoice-more]"),
    checkoutDialog: document.querySelector("[data-checkout-dialog]"),
    checkoutTitle: document.querySelector("[data-checkout-title]"),
    checkoutSubtitle: document.querySelector("[data-checkout-subtitle]"),
    checkoutSummary: document.querySelector("[data-checkout-summary]"),
    checkoutStatus: document.querySelector("[data-checkout-status]"),
    checkoutMount: document.querySelector("[data-checkout-mount]"),
    provisioningProgress: document.querySelector("[data-provisioning-progress]"),
    provisioningTrack: document.querySelector("[data-provisioning-track]"),
    provisioningFill: document.querySelector("[data-provisioning-fill]"),
    provisioningMessage: document.querySelector("[data-provisioning-message]"),
    provisioningEta: document.querySelector("[data-provisioning-eta]"),
    provisioningNotice: document.querySelector("[data-provisioning-notice]"),
    checkoutForm: document.querySelector("[data-checkout-form]"),
    checkoutSubmit: document.querySelector("[data-checkout-submit]"),
    checkoutError: document.querySelector("[data-checkout-error]"),
    checkoutClose: document.querySelector("[data-checkout-close]"),
    toast: document.querySelector("[data-toast]")
  };

  // Bail out when this is not the app shell. Key this on markup the shell
  // actually ships and always will: the signed-out and authenticated regions
  // ARE the app. It used to key on the sign-in button, and when that button was
  // deleted the guard silently returned out of this entire IIFE on every load -
  // no throw, no console output - so nothing bootstrapped, no request was ever
  // sent, and the customer got the raw server-rendered shell: a card reading
  // "Taking you to GitHub…", a "Signed out" phase and the layout's hardcoded
  // "Local" pill, none of which anything was left alive to correct.
  if (!ui.signedOut || !ui.authenticated) return;

  const session = {
    accessToken: "",
    user: null,
    claims: {},
    organizationId: "",
    organizationName: "",
    members: [],
    githubInstalled: false,
    // The API-confirmed installation, kept because its account and id are what
    // make the manage-access link point at THIS installation's settings page
    // rather than a generic GitHub screen.
    githubInstallation: null,
    // Set when the customer opens that link; cleared by the refetch on return.
    githubAccessDepartedAt: 0,
    repositories: [],
    repositorySelection: null,
    repositoryServiceAvailable: false,
    billingPlan: null,
    billingPlanAvailable: false,
    billingPlanError: "",
    subscription: null,
    subscriptionActive: false,
    subscriptionManageable: false,
    paidTeamSlots: 0n,
    usedTeamSlots: 0n,
    availableTeamSlots: 0n,
    creditPacks: [],
    creditBalance: null,
    creditControl: null,
    // The live credit ledger. lastCreditMovementSequence is the resume cursor
    // and takes the same shape as lastActivitySequence on purpose — a second
    // cursor idiom on the same console is a second way to lose a row.
    creditMovements: [],
    lastCreditMovementSequence: 0n,
    creditMovementsAbort: null,
    creditMovementsReconnectTimer: null,
    creditMovementsStreamLive: false,
    // What the odometer currently reads, so a frame that does not move the
    // balance does not animate a number that did not change.
    creditBalanceShownMicros: null,
    creditOrgBalanceShownMicros: null,
    // Runtime health orders itself. Its sequence belongs to runtime health and
    // is explicitly NOT the provisioning sequence the status stream resumes
    // from, so it gets its own cursor and never touches that one.
    lastRuntimeHealthSequence: 0n,
    // The ORGANIZATION's measured credit position. It is the only credit
    // figure that is organization-scoped: the per-team balances read a shared
    // pool, so summing them would count the same credits several times.
    organizationEconomics: null,
    organizationEconomicsState: "loading",
    invoices: [],
    invoiceIds: new Set(),
    invoiceNextPageToken: "",
    invoicePageTokens: new Set(),
    invoiceLoading: false,
    economicsBreakdowns: new Map(),
    selectedEconomicsGroup: "operation",
    creditTopUp: null,
    creditTopUpState: "waiting",
    creditTopUpError: "",
    creditTopUps: [],
    creditTopUpsState: "waiting",
    teamServiceAvailable: false,
    teams: [],
    // The repository set each team is KNOWN to run with, keyed by team id —
    // recorded from server-confirmed mutations in this session (RequestTeam /
    // UpdateTeamRepositories). Teams born before this session fall back to
    // the organization's durable selection, which is exactly what CreateTeam
    // copied onto them.
    teamRepositoryIds: new Map(),
    teamLifecycleBusy: new Set(),
    teamLifecyclePendingDelete: "",
    // The teams surface's per-team readings (pending decisions, open delivery
    // counts), keyed by team id — filled by its one capped fan-out, read by
    // the tiles, never invented. A missing entry renders as an honest dash.
    dashboardStats: new Map(),
    dashboardGeneration: 0,
    dashboardOverflow: 0,
    completingGitHub: false,
    authPhase: "signed_out",
    selectedTeamId: "",
    workspaceGeneration: 0,
    activityAbort: null,
    activityReconnectTimer: null,
    conversationAbort: null,
    conversationReconnectTimer: null,
    conversationStreamLive: false,
    conversationMessages: [],
    conversationById: new Map(),
    lastConversationSequence: 0n,
    conversationSending: false,
    conversationFormat: "markdown",
    provisioningAbort: null,
    provisioningReconnectTimer: null,
    provisioningStreamLive: false,
    provisioningRouteKey: "",
    activityEvents: [],
    activityEventIds: new Set(),
    // Rows the live stream just delivered, still owed their one arrival
    // flash. Marked on append, consumed on the very next ledger paint, so
    // a later repaint can never replay the motion.
    freshActivityIds: new Set(),
    provisioningEvents: [],
    activityProjections: new Map(),
    activityFilter: "all",
    lastActivitySequence: 0n,
    lastProvisioningSequence: 0n,
    sessions: [],
    sessionIds: new Set(),
    sessionNextPageToken: "",
    sessionPageTokens: new Set(),
    sessionHistoryLoading: false,
    // What each run cost, from the measured ledger grouped by run. The
    // lifecycle record carries no money at all, so this is the only honest
    // source for the question "what did that run cost". The state word is
    // kept beside it because a rejected read and an empty period are
    // different facts and the Runs screen says which one it met.
    sessionSpend: [],
    sessionSpendState: "loading",
    workspaceChanges: [],
    workspaceChangeIds: new Set(),
    workspaceNextPageToken: "",
    workspacePageTokens: new Set(),
    workspaceHistoryLoading: false,
    lastWorkspaceSequence: 0n,
    deliveryRepositoryId: "",
    githubIssues: [],
    githubIssueIds: new Set(),
    githubIssuesNextPageToken: "",
    githubIssuePageTokens: new Set(),
    githubIssuesLoading: false,
    githubIssuesState: "waiting",
    githubPullRequests: [],
    githubPullRequestIds: new Set(),
    githubPullRequestsNextPageToken: "",
    githubPullRequestPageTokens: new Set(),
    githubPullRequestsLoading: false,
    githubPullRequestsState: "waiting",
    deliveryLoadGeneration: 0,
    githubIssueLastSort: null,
    githubPullRequestLastSort: null,
    // Canonical role keys for the server-confirmed roster, in roster order.
    // The stat strip counts presence over these with the same liveness the
    // crew tiles read, so the number and the glow always agree.
    agentRoster: [],
    // The server-confirmed roster records, kept verbatim so the agent detail
    // view renders identity without a request of its own.
    agents: [],
    // The open agent record. Cleared on team switch and on every workspace
    // reset: an agent id is only meaningful inside its team.
    selectedAgentId: "",
    agentDetailGeneration: 0,
    // null = not loaded (a dash, never a zero); an array is a served answer.
    agentSessions: null,
    agentChanges: null,
    agentSessionsMore: false,
    agentChangesMore: false,
    objectivesByTeam: new Map(),
    objectiveListsByTeam: new Map(),
    objectiveDispatchTimer: null,
    objectiveDispatchCheckedAt: null,
    // Every initiative under every objective the selected team owns, from one
    // team-scoped read. null is "not read", which is a different fact from the
    // empty array's "read, and there are none".
    teamInitiatives: null,
    // The selected team's own repository grant, from ListTeamRepositories.
    // null is "not read"; it is what every team-scoped delivery read is
    // validated against, and it is NOT the organization's projection.
    teamRepositories: null,
    // Initiatives already loaded, keyed by objective id: the "On now" card's
    // own load fills it for the selected objective, and the objectives view's
    // fan-out fills the rest — neither ever refetches what the other holds.
    initiativesByObjective: new Map(),
    approvals: [],
    approvalNextPageToken: "",
    approvalPageTokens: new Set(),
    approvalDecisionIds: new Set(),
    // The sign-off card's locking beat: a recorded sign-off leaves the
    // pending queue immediately, so the card holds this bounded window while
    // the platform locks the discussion, then stands down on its own.
    signoffLockingUntil: 0,
    signoffLockingTimer: null
  };

  const environment = stringValue(config.environment) || "local";
  const storageNamespace = environment;
  const signInStorageKey = `deep-navy.sign-in.${storageNamespace}`;
  const githubStartStorageKey = `deep-navy.github-start.${storageNamespace}`;
  const githubCompletionStorageKey = `deep-navy.github-completion.${storageNamespace}`;
  const billingReturnStorageKey = `deep-navy.billing-return.${storageNamespace}`;
  const appPath = deriveAppPath();
  const appUrl = new URL(appPath, window.location.origin).toString();
  const apiBaseUrl = normalizeServiceUrl(config.api_base_url);
  const organizationContract = window.deepNavyOrganizationOnboarding || null;
  const launchContract = window.deepNavyLaunchContract || null;
  // The severity ladder, ported verbatim from the design system. Severity is
  // never decided in this file: a level name goes in, and the word, the glyph
  // and the tone class come back out.
  const noticeLevels = window.deepNavyNoticeLevels || null;
  const appState = window.deepNavyAppState || null;
  const agentRoleContract = window.DeepNavyAgentRoles || null;
  const generatedClient = window.deepNavyGeneratedClient || null;
  const platformApi = createPlatformApi();
  const identity = identityConfiguration();
  const stripePublishableKey = validatedStripePublishableKey(config.stripe_publishable_key);
  let stripeClient = null;
  let stripeLoadPromise = null;
  let embeddedCheckout = null;
  let teamPaymentElements = null;
  let checkoutTeamId = "";
  let checkoutSubmitLabel = "Start subscription";
  let checkoutOpening = false;
  // The Settings engineer stepper resets to the team's confirmed count only when
  // the selected team changes, so a background re-render never clobbers an edit.
  let engineerControlTeamId = "";
  // A repaint must not overwrite what someone is halfway through typing. The
  // form fills itself from the server's settings only while it is untouched;
  // after that the customer owns the fields until they save.
  let topUpFormDirty = false;
  let engineerControlBusy = false;
  // Same discipline for the Settings repository checklist: it is rebuilt from
  // the team's confirmed set only when the selected team (or the accessible
  // list itself) changes — never mid-edit by a background re-render.
  let repositoryControlTeamId = "";
  let repositoryControlListSignature = "";
  let repositoryControlBusy = false;
  const provisioningTimers = new Map();
  // Pending teams from RequestTeam are polled with GetTeam until they leave
  // LIFECYCLE_STATE_PENDING (a verified Stripe webhook provisions them).
  const pendingTeamTimers = new Map();
  // The objectives view's element handles for in-place updates, rebuilt with
  // every full render: the dispatch poll rewrites each record's handoff line
  // and the initiative loads fill each record's proposal list WITHOUT
  // rebuilding cards — a rebuild would collapse any drill-in the customer
  // has open. The load key arms the view's one proposal fan-out per team and
  // generation.
  const objectiveCardDispatch = new Map();
  const objectiveCardInitiatives = new Map();
  let objectivesViewLoadKey = "";
  const mutationKeys = launchContract?.createMutationKeys(() => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18));
  const organizationCoordinator = organizationContract?.createCoordinator({
    request: apiRequest,
    createIdempotencyKey: () => window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18)
  });

  ui.environmentFields.forEach((field) => { field.textContent = environment; });
  if (ui.signIn) ui.signIn.disabled = !identity.ready;

  function setAuthPhase(phase) {
    const presentation = appState?.authPresentation
      ? appState.authPresentation(phase, Boolean(session.accessToken))
      : {
          phase: session.accessToken ? "authenticated" : "signed_out",
          authenticated: Boolean(session.accessToken),
          signedOutVisible: !session.accessToken,
          workspaceVisible: Boolean(session.accessToken),
          signOutVisible: Boolean(session.accessToken),
          userVisible: Boolean(session.accessToken),
          sessionLabel: session.accessToken ? "Signed in" : "Signed out"
        };
    session.authPhase = presentation.phase;
    document.body.dataset.authState = presentation.phase;
    ui.signedOut.hidden = !presentation.signedOutVisible;
    ui.authenticated.hidden = !presentation.workspaceVisible;
    ui.authenticatedNav.hidden = !presentation.workspaceVisible;
    ui.signOut.hidden = !presentation.signOutVisible;
    ui.userSummary.hidden = !presentation.userVisible;
    ui.sessionState.textContent = presentation.sessionLabel;
    // Once authenticated, the user card and Sign out button already say so; a
    // "Signed in" pill is duplicate status that adds header noise.
    ui.sessionState.hidden = presentation.authenticated;
    if (ui.signIn) ui.signIn.disabled = presentation.phase === "authenticating" || !identity.ready;
  }

  function stringValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  // Chips carry concrete data (an org name, a repo count); keep them scannable.
  function shortLabel(value, maximum = 22) {
    const label = stringValue(value);
    return label.length > maximum ? `${label.slice(0, maximum - 1)}…` : label;
  }

  function deriveAppPath() {
    const path = window.location.pathname;
    if (/\/app\/(?:github\/)?callback\/?$/.test(path)) return path.replace(/(?:github\/)?callback\/?$/, "");
    if (/\/app\/?$/.test(path)) return path.endsWith("/") ? path : `${path}/`;
    const script = document.querySelector('script[src*="/assets/js/app.js"]');
    if (script) {
      const scriptPath = new URL(script.src).pathname;
      return scriptPath.replace(/\/assets\/js\/app\.js$/, "/app/");
    }
    return "/app/";
  }

  function normalizeServiceUrl(value) {
    const raw = stringValue(value);
    if (!raw) return "";
    try {
      const url = new URL(raw);
      const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      if (url.protocol !== "https:" && !localHttp) return "";
      if (url.username || url.password || url.search || url.hash) return "";
      return url.toString().replace(/\/$/, "");
    } catch {
      return "";
    }
  }

  function validatedStripePublishableKey(value) {
    const key = stringValue(value);
    if (!/^pk_(?:test|live)_[A-Za-z0-9]{8,}$/.test(key)) return "";
    if (environment === "development" && !key.startsWith("pk_test_")) return "";
    if (environment === "production" && !key.startsWith("pk_live_")) return "";
    return key;
  }

  // Stripe is only needed when creating a team (the paid action, via embedded
  // Checkout) and for prepaid credit packs — never for sign-in or repository
  // onboarding. We treat the presence of a publishable key as "billing is
  // configured" (synchronous, gates the UI) and load Stripe.js lazily the first
  // time a checkout actually runs.
  function stripeConfigured() {
    return Boolean(stripePublishableKey);
  }

  // Inject Stripe.js on demand. Stripe requires loading it directly from
  // js.stripe.com (no bundling, self-hosting, or SRI — the file updates
  // continuously), so we add the current pinned version as a script tag the
  // first time it is needed and reuse the single resolved client instance.
  function ensureStripe() {
    if (stripeClient) return Promise.resolve(stripeClient);
    if (!stripePublishableKey) return Promise.resolve(null);
    if (!stripeLoadPromise) {
      stripeLoadPromise = new Promise((resolve) => {
        if (typeof window.Stripe === "function") { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/dahlia/stripe.js";
        script.async = true;
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", () => resolve());
        document.head.appendChild(script);
      }).then(() => {
        if (typeof window.Stripe !== "function") return null;
        try { stripeClient = window.Stripe(stripePublishableKey); } catch { stripeClient = null; }
        return stripeClient;
      });
    }
    return stripeLoadPromise;
  }

  function createPlatformApi() {
    if (!apiBaseUrl || generatedClient?.PLATFORM_PROTOS_REVISION !== "43051f3f56c6c2d35ef82eb2a94ade15590b4870" || typeof generatedClient.createPlatformApi !== "function") return null;
    try {
      return generatedClient.createPlatformApi({ baseUrl: apiBaseUrl, defaultTimeoutMs: 16000 });
    } catch {
      return null;
    }
  }

  function identityConfiguration() {
    // Sign-in readiness no longer depends on Cognito. The GitHub sign-in round
    // trip is owned by the platform API, so readiness means the platform API
    // origin is configured and the generated client bundle loaded.
    return { ready: Boolean(apiBaseUrl && platformApi) };
  }

  function renderConfiguration() {
    const missing = [];
    if (!apiBaseUrl) missing.push("platform API origin");
    if (!platformApi) missing.push("platform API client");
    if (!stripeConfigured()) missing.push("Stripe publishable configuration");

    if (missing.length === 0) {
      ui.configBanner.hidden = true;
    } else if (identity.ready) {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "warning", "Sign-in ready; platform services pending", `Missing ${missing.join(", ")}. You can sign in, but server-backed onboarding remains unavailable until deployment configuration is complete.`);
    } else {
      setBanner(ui.configBanner, ui.configTitle, ui.configMessage, "warning", "This environment is not ready for sign-in", `Missing ${missing.join(", ")}. No authentication or onboarding action will be attempted.`);
    }
  }

  function setBanner(element, titleElement, messageElement, tone, title, message) {
    element.dataset.tone = tone;
    titleElement.textContent = title;
    messageElement.textContent = message;
    element.hidden = false;
  }

  function randomBase64Url(byteLength) {
    const bytes = new Uint8Array(byteLength);
    window.crypto.getRandomValues(bytes);
    return bytesToBase64Url(bytes);
  }

  function bytesToBase64Url(bytes) {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // target "authorization" is the normal OAuth login; "installation" sends a
  // newly signed-in user who has not installed the App yet to install it and
  // connect repositories. Installing authorizes too, so the same callback
  // completes sign-in and derives the organization.
  // One automatic sign-in restart per two minutes. The codeless-install
  // callback is routine and self-heals through a plain authorize round trip;
  // anything failing more often than this is a real configuration problem the
  // customer needs to see rather than loop through.
  const signInAutoRetryKey = "deepnavy.signin.autoretry";
  function armSignInAutoRetry() {
    try {
      const last = Number(window.sessionStorage.getItem(signInAutoRetryKey) || 0);
      if (Date.now() - last < 2 * 60 * 1000) return false;
      window.sessionStorage.setItem(signInAutoRetryKey, String(Date.now()));
      return true;
    } catch { return false; }
  }

  // A sign-in handoff that fails leaves nothing useful on this page, because
  // this page has no sign-in button by design. Send them back to the homepage,
  // where the only one lives. Once: if the return trip fails too, the banner
  // below has to be readable instead of looping.
  const signInBounceKey = "deepnavy.signin.bounced";
  function bounceToHomepage() {
    try {
      if (window.sessionStorage.getItem(signInBounceKey)) return false;
      window.sessionStorage.setItem(signInBounceKey, "1");
    } catch { return false; }
    window.location.replace(new URL("../", window.location.href).toString());
    return true;
  }

  async function beginSignIn(target = "authorization") {
    hideAuthError();
    if (!identity.ready || !platformApi) {
      if (bounceToHomepage()) return;
      showAuthError("Sign-in is not available", "This deployment is missing its platform API configuration or the generated client bundle. No sign-in request was sent.");
      return;
    }

    setAuthPhase("authenticating");
    if (ui.signIn) ui.signIn.disabled = true;
    ui.retrySignIn.disabled = true;
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      // The server owns the one-time state; the browser only records that this
      // GitHub round trip is a sign-in so the callback can distinguish it from a
      // signed-in repository-management install.
      if (!storageWrite(signInStorageKey, { purpose: "sign_in", createdAt: Date.now() })) {
        throw new Error("secure_storage_unavailable");
      }
      const result = await platformApi.signIn("github_sign_in_start", { returnTo: appPath }, { requestId, signal: controller.signal });
      const url = target === "installation"
        ? (result?.installationUrl || result?.installation_url)
        : result?.authorizationUrl;
      const destination = validatedRedirect(url, ["github.com"]);
      if (!destination) throw new Error("untrusted_authorization_url");
      window.location.assign(destination);
    } catch {
      clearSignInTransaction();
      session.conversationFormat = loadConversationFormat();
  renderConversationFormatControl();
  setAuthPhase("signed_out");
      if (bounceToHomepage()) return;
      showAuthError("Could not start sign-in", "deep navy could not begin GitHub sign-in. No credentials were sent. Try again in a moment.");
      if (ui.signIn) ui.signIn.disabled = !identity.ready;
      ui.retrySignIn.disabled = !identity.ready;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  // Pick the session back up on a page load.
  //
  // The bearer token lives in memory only, so a reload used to lose an
  // eight-hour session and send the customer back through GitHub every single
  // time. The server sets an httpOnly cookie at sign-in that the page cannot
  // read; this asks the server to turn that cookie back into a token.
  //
  // Having no session is the ordinary state of a first visit, so a failure here
  // is silent: it leaves the signed-out view exactly as it was and never shows
  // an error for something the visitor did not do.
  async function restoreSession() {
    if (!platformApi || session.accessToken) return false;
    setAuthPhase("authenticating");
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const result = await platformApi.signIn("refresh_session", {}, { requestId, signal: controller.signal });
      const sessionToken = stringValue(result?.sessionToken);
      if (!sessionToken) throw new Error("session_token_missing");
      const user = result?.user || {};
      session.accessToken = sessionToken;
      session.claims = {
        displayName: stringValue(user.displayName),
        githubLogin: stringValue(user.githubLogin),
        email: stringValue(user.email)
      };
      hideAuthError();
      showAuthenticated();
      await initializeAuthenticatedSession();
      return true;
    } catch {
      session.accessToken = "";
      session.claims = {};
      setAuthPhase("signed_out");
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function completeSignInCallback(callback) {
    setAuthPhase("authenticating");
    clearSignInTransaction();
    if (!platformApi) {
      showAuthError("Cannot complete sign-in", "The generated platform API client did not load at the pinned contract revision. No sign-in request was sent.");
      return false;
    }

    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "Completing secure sign-in", "Verifying the one-time GitHub authorization with deep navy. Your session stays in memory.");
    ui.retrySignIn.hidden = true;

    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const result = await platformApi.signIn("github_sign_in_complete", {
        authorizationCode: callback.authorizationCode,
        stateToken: callback.stateToken,
        installationId: callback.installationId,
        returnTo: appPath
      }, { requestId, signal: controller.signal });
      const sessionToken = stringValue(result?.sessionToken);
      if (!sessionToken) throw new Error("session_token_missing");

      const user = result?.user || {};
      session.accessToken = sessionToken;
      // Preliminary display only; the authoritative profile is loaded from
      // GetCurrentUser during initializeAuthenticatedSession.
      session.claims = {
        displayName: stringValue(user.displayName),
        githubLogin: stringValue(user.githubLogin),
        email: stringValue(user.email)
      };
      hideAuthError();
      showAuthenticated();
      await initializeAuthenticatedSession();
      return true;
    } catch {
      session.accessToken = "";
      session.claims = {};
      showAuthError("Sign-in could not be completed", "deep navy could not verify the one-time GitHub authorization. The code was not retained. Start a new sign-in attempt.");
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function readSignInTransaction() {
    const value = storageRead(signInStorageKey);
    const tenMinutes = 10 * 60 * 1000;
    if (!value || value.purpose !== "sign_in" || typeof value.createdAt !== "number" || Date.now() - value.createdAt > tenMinutes) {
      storageRemove(signInStorageKey);
      return null;
    }
    return value;
  }

  function clearSignInTransaction() {
    storageRemove(signInStorageKey);
  }

  function storageRead(key) {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(key) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function storageWrite(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function storageRemove(key) {
    try { window.sessionStorage.removeItem(key); } catch { /* session storage may be disabled */ }
  }

  function readGitHubStart() {
    const value = storageRead(githubStartStorageKey);
    if (!value || typeof value.createdAt !== "number" || Date.now() - value.createdAt > 30 * 60 * 1000) {
      storageRemove(githubStartStorageKey);
      return null;
    }
    return value;
  }

  function readGitHubCompletion() {
    const value = storageRead(githubCompletionStorageKey);
    if (!value || typeof value.createdAt !== "number" || Date.now() - value.createdAt > 15 * 60 * 1000) {
      storageRemove(githubCompletionStorageKey);
      return null;
    }
    return value;
  }

  function clearGitHubFlow() {
    storageRemove(githubStartStorageKey);
    storageRemove(githubCompletionStorageKey);
    mutationKeys?.clear("githubStart");
  }

  function captureGitHubCallback(params) {
    if (!launchContract) throw new Error("launch_contract_unavailable");
    const callback = launchContract.parseGitHubCallback(params, { forceGitHub: document.body.dataset.githubCallback === "true" });
    if (!callback) return false;
    const start = readGitHubStart();
    const completion = {
      ...callback,
      organizationId: stringValue(start?.organizationId),
      flowId: stringValue(start?.flowId),
      idempotencyKey: window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18),
      createdAt: Date.now()
    };
    if (!storageWrite(githubCompletionStorageKey, completion)) {
      throw new Error("secure_callback_storage_unavailable");
    }
    return true;
  }

  function captureBillingReturn(params) {
    const value = stringValue(params.get("billing") || params.get("checkout")).toLowerCase();
    const sessionId = stringValue(params.get("session_id"));
    if (value !== "return" || !/^cs_(?:test|live)_[A-Za-z0-9_]{8,}$/.test(sessionId)) return false;
    storageWrite(billingReturnStorageKey, { value: "return", createdAt: Date.now() });
    return true;
  }

  function stripCallbackQuery() {
    if (!window.location.search) return;
    window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
  }

  function showAuthError(title, message) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "error", title, message);
    ui.retrySignIn.hidden = false;
    ui.retrySignIn.disabled = !identity.ready;
    setAuthPhase("signed_out");
  }

  function hideAuthError() {
    ui.authBanner.hidden = true;
    ui.retrySignIn.hidden = false;
  }

  function showAuthenticated() {
    setAuthPhase("authenticated");
    updateProgressStep("identity", "complete", "Authenticated");
    const name = stringValue(session.claims.displayName) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(session.claims.githubLogin) || stringValue(session.claims.email);
    applyIdentity(name, login);
  }

  // The signed-in person appears twice — the create screen's chip and the
  // rail's foot — and both are written from one call, so the two can never
  // drift into disagreeing about who you are. The role line is the membership
  // the organization response confirmed; when the API did not say, it stays
  // empty rather than guessing "Member", and CSS collapses an empty line.
  function applyIdentity(name, login) {
    const initial = stringValue(name).charAt(0).toUpperCase() || "\u00b7";
    const subtitle = login === name ? "" : stringValue(login);
    document.querySelectorAll("[data-user-name]").forEach((node) => { node.textContent = name; });
    document.querySelectorAll("[data-user-login]").forEach((node) => { node.textContent = subtitle; });
    document.querySelectorAll("[data-user-initial]").forEach((node) => { node.textContent = initial; });
    const member = Array.isArray(session.members) ? session.members.find((entry) => entry.self) : null;
    const role = stringValue(member?.role);
    document.querySelectorAll("[data-user-role]").forEach((node) => { node.textContent = role; });
    if (ui.railUser) ui.railUser.hidden = !stringValue(name);
  }

  async function initializeAuthenticatedSession() {
    if (!apiBaseUrl) {
      setStep("organization", "error", "Unavailable", "The platform API origin is not configured. No organization state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The platform API origin is not configured for this environment. You are signed in, but no onboarding request can be made.");
      return;
    }
    if (!platformApi) {
      setStep("organization", "error", "Unavailable", "The generated platform API client did not load at the pinned contract revision. No onboarding request was attempted.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The generated browser API client is unavailable. Reload after the deployment bundle is repaired.");
      return;
    }
    if (!organizationCoordinator) {
      setStep("organization", "error", "Unavailable", "The organization contract did not load. No organization state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The organization onboarding contract is unavailable. Downstream actions are disabled.");
      return;
    }
    if (!launchContract || !mutationKeys) {
      setStep("organization", "error", "Unavailable", "The launch contract helpers did not load. No onboarding state was assumed.");
      ui.profileRetry.hidden = false;
      setAllStepsUnavailable("The launch contract helpers are unavailable. Reload after the deployment bundle is repaired.");
      return;
    }

    resetOrganizationControls();
    setStep("organization", "loading", "Checking", "Loading the memberships authorized for this signed-in account.");
    try {
      let state = await organizationCoordinator.load();
      renderProfile(state.profile);
      state = await alignPendingGitHubOrganization(state);
      await renderOrganizationState(state);
    } catch (error) {
      session.organizationId = "";
      ui.organizationDependent.hidden = true;
      ui.profileRetry.hidden = false;
      setStep("organization", "error", "Unavailable", organizationErrorMessage(error, "The API could not establish a trusted current user and organization. No organization state was assumed."));
      setAllStepsUnavailable("A server-confirmed organization is required before downstream onboarding can begin.");
    }
  }

  async function alignPendingGitHubOrganization(state) {
    const pending = readGitHubCompletion();
    const targetId = stringValue(pending?.organizationId);
    if (!targetId) return state;
    const currentId = stringValue(state?.organization?.id);
    if (state.kind === "ready" && currentId === targetId) return state;
    const allowed = Array.isArray(state?.memberships) && state.memberships.some((membership) => membership.id === targetId);
    if (!allowed) {
      clearGitHubFlow();
      throw new organizationContract.ContractError("The GitHub installation was started for an organization that is not available to this signed-in user.", "organization_not_accessible");
    }
    return organizationCoordinator.select(targetId);
  }

  function renderProfile(profile) {
    const user = profile?.user || {};
    session.user = user;
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(session.claims.email) || "Signed-in user";
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(user.email) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email);
    applyIdentity(name, login);
    renderSettingsAccount();
  }

  function resetOrganizationControls() {
    if (ui.organizationConnect) { ui.organizationConnect.hidden = true; ui.organizationConnect.disabled = true; }
    ui.organizationBootstrapForm.hidden = true;
    ui.organizationBootstrapInput.disabled = true;
    ui.organizationBootstrapSubmit.disabled = true;
    ui.organizationSelectForm.hidden = true;
    ui.organizationSelectInput.disabled = true;
    ui.organizationSelectSubmit.disabled = true;
    ui.profileRetry.hidden = true;
    setFieldError(ui.organizationError, "");
  }

  async function renderOrganizationState(state) {
    closeEmbeddedCheckout();
    resetOrganizationControls();
    session.organizationId = "";
    session.creditPacks = [];
    session.creditTopUp = null;
    session.creditTopUpState = "waiting";
    session.creditTopUps = [];
    session.creditTopUpsState = "waiting";
    topUpFormDirty = false;
    session.creditBalance = null;
    session.creditControl = null;
    session.creditBalanceShownMicros = null;
    session.creditOrgBalanceShownMicros = null;
    session.organizationEconomics = null;
    session.organizationEconomicsState = "loading";
    resetInvoiceHistory("Select an organization to load its verified billing records.", "Waiting");
    resetSubscriptionCapacity();
    session.organizationName = "";
    session.members = [];
    session.subscription = null;
    session.subscriptionActive = false;
    session.subscriptionManageable = false;
    renderSettingsAccount();
    renderSettingsBilling();
    ui.contextOrganization.textContent = "Not selected";
    ui.organizationDependent.hidden = true;

    if (state.kind === "needs_bootstrap") {
      // Your Deep Navy organization is derived from the GitHub organization you
      // connect, so a signed-in user with no membership simply hasn't installed
      // the App yet. Offer to connect repositories (install) — installing also
      // authorizes, so the callback completes sign-in and creates the workspace
      // automatically. The manual name-your-organization form stays available as
      // a fallback for environments without a configured GitHub App.
      if (ui.organizationConnect) {
        setStep("organization", "action", "Connect GitHub", "Install the deep navy GitHub App on your organization to connect the repositories your team will work on. Your organization and workspace are created automatically.");
        ui.organizationConnect.hidden = false;
        ui.organizationConnect.disabled = false;
        setAllStepsUnavailable("Connect your GitHub repositories to create your workspace.", "blocked");
        return;
      }
      setStep("organization", "action", "Needs action", "Name your organization. The API will create the organization and your owner membership atomically; safe retries reuse the same idempotency key.");
      ui.organizationBootstrapForm.hidden = false;
      ui.organizationBootstrapInput.disabled = false;
      ui.organizationBootstrapSubmit.disabled = false;
      ui.organizationBootstrapInput.focus();
      setAllStepsUnavailable("Create your organization before continuing with GitHub, billing, or teams.", "blocked");
      return;
    }

    if (state.kind === "needs_selection") {
      setStep("organization", "action", "Choose", "Choose one of the organizations the API returned for this signed-in user. No arbitrary organization ID can be entered.");
      ui.organizationSelectInput.replaceChildren();
      state.memberships.forEach((membership) => {
        const option = document.createElement("option");
        option.value = membership.id;
        option.textContent = membership.slug ? `${membership.name} (${membership.slug})` : membership.name;
        ui.organizationSelectInput.append(option);
      });
      ui.organizationSelectForm.hidden = false;
      ui.organizationSelectInput.disabled = false;
      ui.organizationSelectSubmit.disabled = false;
      setAllStepsUnavailable("Select an authorized organization before continuing with GitHub, billing, or teams.", "blocked");
      return;
    }

    if (state.kind !== "ready") throw new organizationContract.ContractError("The organization coordinator returned an unknown state.");
    const organizationId = stringValue(state.organization?.id);
    if (!organizationId) throw new organizationContract.ContractError("The ready organization has no ID.");
    session.organizationId = organizationId;
    const organizationName = stringValue(state.organization.name) || "your organization";
    session.organizationName = organizationName;
    session.members = buildOrganizationMembers(state);
    // The rail's identity line carries the membership role, and the role only
    // becomes known here — one call back so the foot says "owner" rather than
    // staying blank until the next profile render.
    applyIdentity(stringValue(session.members[0]?.name), stringValue(session.members[0]?.login));
    renderSettingsAccount();
    renderSettingsBilling();
    ui.contextOrganization.textContent = organizationName;
    renderOrganizationSwitch(state);
    // The chip shows the concrete organization, not an abstract "Ready".
    setStep("organization", "complete", shortLabel(organizationName), `${organizationName} is connected as your organization for this session.`);
    ui.organizationDependent.hidden = false;
    // The organization above is server-confirmed. Anything that fails from
    // here on is an onboarding/workspace refresh problem, not an organization
    // problem — surface it without destroying the established scope. Letting
    // it propagate used to land in initializeAuthenticatedSession's catch,
    // which wiped session.organizationId and re-hid the workspace: every boot
    // rendered the workspace and then took it away behind a false org error.
    try {
      if (readGitHubCompletion()) await completePendingGitHubInstallation();
      await refreshOnboarding();
    } catch (error) {
      console.error("deep-navy: workspace refresh failed after the organization was established", error);
      toast("Some workspace panels could not finish loading. Use Refresh to retry.", "error");
    }
  }

  class ApiError extends Error {
    constructor(message, status, code, requestId) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
      this.requestId = requestId;
    }
  }

  async function apiRequest(name, payload) {
    if (!session.accessToken) throw new ApiError("Sign-in is required", 401, "unauthenticated", "");
    if (!apiBaseUrl) throw new ApiError("Platform API is not configured", 0, "not_configured", "");
    if (!platformApi) throw new ApiError("Generated platform client is not available", 0, "not_configured", "");
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      return await platformApi.request(name, payload || {}, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) throw new ApiError("The service did not respond within 15 seconds", 0, "timeout", requestId);
      if (error?.name === "PlatformClientError") {
        throw new ApiError(stringValue(error.message) || "The platform service rejected the request", Number(error.status || 0), stringValue(error.code) || "unknown", stringValue(error.requestId) || requestId);
      }
      throw new ApiError("The browser could not reach the configured service", 0, "network_error", requestId);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function isMissingResource(error) {
    return error instanceof ApiError && error.status === 404 && ["not_found", "5"].includes(error.code);
  }

  function apiErrorMessage(error, fallback) {
    if (!(error instanceof ApiError)) return fallback;
    if (error.code === "not_configured") return `${fallback} The endpoint is not configured.`;
    if (error.status === 401 || error.code === "unauthenticated") return "The API did not accept this session. Sign out and sign in again.";
    if (error.status === 403 || error.code === "permission_denied") return "Your account is signed in but is not authorized for this organization action.";
    const safeServiceMessage = stringValue(error.message);
    const suffix = error.requestId ? ` Request ID: ${error.requestId}.` : "";
    return `${safeServiceMessage && !["network_error", "timeout"].includes(error.code) ? safeServiceMessage : fallback}${suffix}`;
  }

  function isRetryableApiError(error) {
    return error instanceof ApiError && ["network_error", "timeout", "deadline_exceeded", "unavailable", "resource_exhausted", "internal", "unknown"].includes(error.code);
  }

  function organizationErrorMessage(error, fallback) {
    if (organizationContract && error instanceof organizationContract.ContractError) return `${fallback} ${error.message}`;
    return apiErrorMessage(error, fallback);
  }

  async function bootstrapOrganization(event) {
    event.preventDefault();
    const name = stringValue(new FormData(ui.organizationBootstrapForm).get("organizationName"));
    setFieldError(ui.organizationError, "");
    ui.organizationBootstrapInput.disabled = true;
    ui.organizationBootstrapSubmit.disabled = true;
    ui.organizationBootstrapSubmit.textContent = "Creating…";
    setStep("organization", "loading", "Creating", "Creating the organization, owner membership, and current selection as one idempotent operation.");
    try {
      const state = await organizationCoordinator.bootstrap(name);
      ui.organizationBootstrapForm.reset();
      await renderOrganizationState(state);
      toast("The API confirmed your organization and owner membership.", "success");
    } catch (error) {
      const message = organizationErrorMessage(error, "The API did not confirm organization creation. No completion state was assumed; retrying the same name is safe.");
      setStep("organization", "error", "Not confirmed", message);
      setFieldError(ui.organizationError, message);
      ui.organizationBootstrapForm.hidden = false;
      ui.organizationBootstrapInput.disabled = false;
      ui.organizationBootstrapSubmit.disabled = false;
    } finally {
      ui.organizationBootstrapSubmit.textContent = "Create organization";
    }
  }

  // The identity chip carries the organization switcher, because the first-run
  // screen is the only surface a customer without a team can reach - Settings
  // lives inside a workspace and a workspace needs a team, so an account in
  // two organizations could otherwise never change which one it was creating
  // teams for. Only rendered when there is genuinely a choice to make.
  function renderOrganizationSwitch(state) {
    if (!ui.organizationSwitch || !ui.organizationSwitchInput) return;
    const memberships = Array.isArray(state?.memberships) ? state.memberships : [];
    const currentId = stringValue(state?.organization?.id);
    if (memberships.length < 2) {
      ui.organizationSwitch.hidden = true;
      return;
    }
    ui.organizationSwitchInput.replaceChildren();
    memberships.forEach((membership) => {
      const option = document.createElement("option");
      option.value = stringValue(membership.id);
      option.textContent = stringValue(membership.name) || stringValue(membership.id);
      option.selected = option.value === currentId;
      ui.organizationSwitchInput.append(option);
    });
    ui.organizationSwitchInput.disabled = false;
    ui.organizationSwitch.hidden = false;
  }

  async function switchOrganization() {
    const organizationId = stringValue(ui.organizationSwitchInput.value);
    if (!organizationId || organizationId === session.organizationId) return;
    ui.organizationSwitchInput.disabled = true;
    setStep("organization", "loading", "Switching", "Confirming this membership with the API.");
    try {
      const state = await organizationCoordinator.select(organizationId);
      await renderOrganizationState(state);
    } catch (error) {
      toast(organizationErrorMessage(error, "That organization could not be selected. Nothing changed."), "error");
      // Put the control back on the organization that is actually current.
      ui.organizationSwitchInput.value = session.organizationId;
      ui.organizationSwitchInput.disabled = false;
    }
  }

  async function selectOrganization(event) {
    event.preventDefault();
    const organizationId = stringValue(new FormData(ui.organizationSelectForm).get("organizationId"));
    ui.organizationSelectInput.disabled = true;
    ui.organizationSelectSubmit.disabled = true;
    ui.organizationSelectSubmit.textContent = "Selecting…";
    setStep("organization", "loading", "Selecting", "Confirming this membership and current organization with the API.");
    try {
      const state = await organizationCoordinator.select(organizationId);
      await renderOrganizationState(state);
    } catch (error) {
      setStep("organization", "error", "Not selected", organizationErrorMessage(error, "The API did not confirm this organization selection. No organization state was assumed."));
      ui.organizationSelectForm.hidden = false;
      ui.organizationSelectInput.disabled = false;
      ui.organizationSelectSubmit.disabled = false;
    } finally {
      ui.organizationSelectSubmit.textContent = "Continue with organization";
    }
  }

  async function listAllTeams() {
    const teams = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
      const response = await apiRequest("teams", { organizationId: session.organizationId, page: { pageSize: 100, pageToken } });
      const pageTeams = Array.isArray(response?.teams) ? response.teams : [];
      if (pageTeams.length > 100) throw new ApiError("TeamService returned an oversized page", 0, "invalid_response", "");
      for (const team of pageTeams) {
        const id = stringValue(team?.id);
        if (!id || stringValue(team?.organizationId) !== session.organizationId || seenIds.has(id)) {
          throw new ApiError("TeamService returned an invalid or duplicate organization-scoped team", 0, "invalid_response", "");
        }
        seenIds.add(id);
        teams.push(team);
      }
      const nextPageToken = stringValue(response?.page?.nextPageToken);
      if (!nextPageToken) return { teams, page: { nextPageToken: "" } };
      if (nextPageToken === pageToken || seenTokens.has(nextPageToken)) throw new ApiError("TeamService returned a repeated page cursor", 0, "invalid_response", "");
      seenTokens.add(nextPageToken);
      pageToken = nextPageToken;
    }
    throw new ApiError("TeamService exceeded the safe pagination limit", 0, "invalid_response", "");
  }

  async function refreshOnboarding() {
    setStep("github", "loading", "Checking", "Checking for an organization-bound GitHub App installation.");
    setStep("repositories", "loading", "Checking", "Loading the repositories that the GitHub App makes available.");
    setStep("team", "loading", "Checking", "Checking existing engineering teams and prerequisites.");
    resetInvoiceHistory("Loading the signed-webhook-backed invoice projection.", "Loading", "loading");
    ui.refresh.disabled = true;
    // The finally is what keeps Refresh alive: an error anywhere below used to
    // leave the button disabled forever, with no way to retry from the UI.
    try {
      const teamsGeneration = nextTeamsListGeneration();
      const organizationId = session.organizationId;
      const [githubResult, planResult, subscriptionResult, teamsResult, invoicesResult, organizationEconomicsResult] = await Promise.allSettled([
        apiRequest("github_installation", { organizationId: session.organizationId }),
        apiRequest("billing_plan", { planId: stringValue(config.plan_id) || "founding-team" }),
        apiRequest("subscription", { organizationId: session.organizationId }),
        listAllTeams(),
        apiRequest("invoices", { organizationId: session.organizationId, page: { pageSize: 25 } }),
        // Billing needs a credit figure that covers the whole organization,
        // and this is the one the ledger will give. Reading it per team and
        // adding the results up would count a shared pool several times.
        apiRequest("economics", { scopeType: "organization", scopeId: session.organizationId })
      ]);

      renderBillingPlanResult(planResult);
      renderSubscriptionResult(subscriptionResult);
      renderTeamsResult(teamsResult, teamsGeneration);
      renderInvoicesResult(invoicesResult);
      renderOrganizationEconomicsResult(organizationEconomicsResult, organizationId);
      await renderGitHubResult(githubResult);
      updateTeamAction();
      await refreshCreditPacks();
      reconcileBillingReturn();
      await refreshSelectedTeam();
    } finally {
      ui.refresh.disabled = false;
    }
  }

  async function renderGitHubResult(result) {
    if (result.status === "fulfilled") {
      const installation = result.value.installation;
      if (installation && stringValue(installation.organizationId) !== session.organizationId) {
        session.githubInstalled = false;
        setGitHubInstallation(null);
        setStep("github", "error", "Invalid response", "The GitHub service returned an installation outside the current organization scope. No connection was displayed.");
        ui.githubAction.disabled = true;
        resetRepositoryAccess("Repository access cannot be checked until the GitHub installation scope is valid.", "error");
        return;
      }
      session.githubInstalled = Boolean(launchContract?.githubInstallationActive(installation));
      // Only an ACTIVE installation names a settings page worth linking to.
      setGitHubInstallation(session.githubInstalled ? installation : null);
      if (session.githubInstalled) {
        const account = stringValue(installation.accountLogin) || stringValue(installation.account_login) || "selected GitHub account";
        setStep("github", "complete", "Connected", `The API confirms an active installation for ${account}. Choose the repositories deep navy may use next.`);
        ui.githubAction.textContent = "Manage GitHub access";
        ui.githubAction.disabled = false;
        await refreshRepositoryAccess();
      } else {
        setStep("github", "action", "Needs action", "Your GitHub connection is not active yet. Connect GitHub so your team can work in your repositories.");
        ui.githubAction.textContent = "Connect GitHub";
        ui.githubAction.disabled = false;
        resetRepositoryAccess("Connect an active GitHub App installation before choosing repositories.");
      }
      return;
    }
    session.githubInstalled = false;
    setGitHubInstallation(null);
    if (isMissingResource(result.reason)) {
      setStep("github", "action", "Needs action", "Connect GitHub so your team can work in your repositories.");
      ui.githubAction.disabled = false;
      ui.githubAction.textContent = "Connect GitHub";
      resetRepositoryAccess("Connect the GitHub App before choosing repositories.");
    } else {
      setStep("github", "error", "Unavailable", apiErrorMessage(result.reason, "The GitHub integration service is not ready. No installation state was assumed."));
      ui.githubAction.disabled = true;
      resetRepositoryAccess("Repository access cannot be checked until the GitHub installation service responds.", "error");
    }
  }

  // ── The way to widen the grant ───────────────────────────────────────────
  // Which repositories deep navy can reach is decided on GitHub, on the
  // installation's own settings page. That page is a real, stable URL, so the
  // affordance beside the picker is a real link to it — not a button that
  // restarts the install flow, which is what it used to be and which sent
  // people through an installation they had already completed.
  //
  // GitHub itself names that page. Every installation-bearing response carries
  // the installation's own html_url, so when the API forwards it as manageUrl
  // that value is authoritative: it is the page GitHub built for THIS
  // installation, on whatever account shape GitHub actually used. Prefer it.
  //
  // Construction below is the fallback, not the source of truth. It still has
  // to be right — an installation confirmed before the API carried the field
  // has nothing else — but it is only ever our guess at what GitHub already
  // told us, so it never overrides a supplied URL.
  //
  // Org-owned installations live under the organization; personal ones under
  // the signed-in account. Until the API confirms an installation, the honest
  // destination is the plain installations list, which is valid for whoever is
  // signed in to GitHub.
  const githubInstallationsUrl = "https://github.com/settings/installations";

  function githubInstallationIdentifier(installation) {
    const raw = typeof installation?.id === "bigint" ? installation.id.toString() : stringValue(installation?.id);
    return /^[1-9][0-9]{0,18}$/.test(raw) ? raw : "";
  }

  // A server-supplied URL is still an outbound handoff, so it goes through the
  // same trusted-host discipline as every other one. Anything that is not an
  // https github.com URL is discarded and we fall back to construction rather
  // than putting an unvetted destination behind the customer's click.
  function githubInstallationManageUrl(installation) {
    const supplied = stringValue(installation?.manageUrl) || stringValue(installation?.manage_url);
    return supplied ? validatedRedirect(supplied, ["github.com"]) : "";
  }

  function githubInstallationSettingsUrl() {
    const installation = session.githubInstallation;
    const supplied = githubInstallationManageUrl(installation);
    if (supplied) return supplied;
    const id = githubInstallationIdentifier(installation);
    if (!id) return githubInstallationsUrl;
    const login = stringValue(installation?.accountLogin) || stringValue(installation?.account_login);
    const organization = stringValue(installation?.accountType).toLowerCase() === "organization";
    // A login is path data here, so it is pattern-checked rather than escaped:
    // anything that is not a GitHub login falls back to the account-scoped URL.
    const candidate = organization && /^[A-Za-z0-9-]{1,39}$/.test(login)
      ? `https://github.com/organizations/${login}/settings/installations/${id}`
      : `https://github.com/settings/installations/${id}`;
    // Same trusted-host discipline every other outbound handoff uses.
    return validatedRedirect(candidate, ["github.com"]) || githubInstallationsUrl;
  }

  // Both manage-access links are the same door; keep their destination in step
  // with whatever installation the API last confirmed.
  function renderRepositoryManageLinks() {
    const destination = githubInstallationSettingsUrl();
    if (ui.repositoryManageAccess) ui.repositoryManageAccess.href = destination;
    if (ui.settingsRepositoryManageAccess) ui.settingsRepositoryManageAccess.href = destination;
  }

  function setGitHubInstallation(installation) {
    session.githubInstallation = installation || null;
    renderRepositoryManageLinks();
  }

  // The grant changes in another tab, on GitHub. Coming back to a list that
  // still shows the old repositories is what made people reload the app by
  // hand, so record the departure and refetch when they return. Only a real
  // departure arms it — an ordinary tab switch must not fire a request.
  //
  // Why this is the ceiling, not a shortcut. GitHub does tell the platform:
  // installation_repositories is delivered to the App the moment the grant
  // changes. But nothing carries that to this page. Every live stream the
  // client has is scoped to ONE team — activity, conversation, provisioning —
  // and the repository grant belongs to the organization's installation, which
  // no team owns and no stream covers. There is no organization-scoped stream
  // to listen on, so inventing a poll would be spending requests to fake a
  // liveness we do not have. Returning to the tab is the honest signal: it is
  // the exact moment the stale list is about to be read. If an
  // organization-scoped stream ever ships, this is the code that should be
  // replaced by it — the guard test on the client's streams will say so.
  function markGitHubAccessDeparture() {
    session.githubAccessDepartedAt = Date.now();
  }

  function refreshRepositoryAccessAfterReturn() {
    if (!session.githubAccessDepartedAt) return;
    if (!session.accessToken || !session.organizationId || !session.githubInstalled) return;
    // Cleared before the await so a focus and a visibilitychange arriving
    // together cannot both fire the refetch.
    session.githubAccessDepartedAt = 0;
    Promise.resolve(refreshRepositoryAccess()).catch(() => {
      /* refreshRepositoryAccess renders its own failure state; a rejection
         here must never break the return to the app. */
    });
  }

  function resetRepositoryAccess(message, stateValue = "blocked") {
    session.repositories = [];
    session.repositorySelection = null;
    session.repositoryServiceAvailable = false;
    ui.repositoryList.replaceChildren();
    ui.repositoryNote.textContent = message;
    setFieldError(ui.teamRepositoriesError, "");
    ui.contextRepositories.textContent = "Not loaded";
    setStep("repositories", stateValue, stateValue === "error" ? "Unavailable" : "Blocked", message);
    renderRepositoryControl();
  }

  async function listAllRepositories() {
    const repositories = [];
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("repositories", {
        organizationId: session.organizationId,
        page: { pageSize: 100, pageToken }
      });
      if (Array.isArray(response.repositories)) repositories.push(...response.repositories);
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return repositories;
      if (seenTokens.has(next)) throw new ApiError("Repository pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Repository list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  async function refreshRepositoryAccess() {
    if (!session.githubInstalled) {
      resetRepositoryAccess("Connect the GitHub App before choosing repositories.");
      return;
    }
    setStep("repositories", "loading", "Loading", "Loading accessible repositories and the current server-side selection.");
    ui.repositoryNote.textContent = "Loading the repositories your GitHub App can reach…";
    const [repositoriesResult, selectionResult] = await Promise.allSettled([
      listAllRepositories(),
      apiRequest("repository_selection", { organizationId: session.organizationId })
    ]);
    if (repositoriesResult.status === "rejected") {
      resetRepositoryAccess(apiErrorMessage(repositoriesResult.reason, "The repository service is unavailable. No repository access was assumed."), "error");
      return;
    }
    if (selectionResult.status === "rejected" && !isMissingResource(selectionResult.reason)) {
      resetRepositoryAccess(apiErrorMessage(selectionResult.reason, "The saved repository selection could not be loaded."), "error");
      return;
    }
    try {
      const rawRepositories = Array.isArray(repositoriesResult.value) ? repositoriesResult.value : [];
      const selection = selectionResult.status === "fulfilled" ? selectionResult.value.selection : null;
      if (rawRepositories.some((repository) => stringValue(repository?.organizationId) !== session.organizationId)) {
        throw new launchContract.LaunchContractError("The repository service returned a resource outside the current organization scope.");
      }
      if (selection && stringValue(selection.organizationId) !== session.organizationId) {
        throw new launchContract.LaunchContractError("The repository service returned a selection outside the current organization scope.");
      }
      session.repositoryServiceAvailable = true;
      session.repositories = launchContract.accessibleRepositories(rawRepositories).sort((left, right) => {
        const leftName = `${stringValue(left.owner)}/${stringValue(left.name)}`;
        const rightName = `${stringValue(right.owner)}/${stringValue(right.name)}`;
        return leftName.localeCompare(rightName);
      });
      session.repositorySelection = selection;
      renderRepositoryAccess();
      updateTeamAction();
    } catch {
      resetRepositoryAccess("The repository service returned data that did not match the pinned launch contract. No repository access was assumed.", "error");
      updateTeamAction();
    }
  }

  // The picker lives inside the create form: every repository the active
  // installation can reach, with the organization's current durable selection
  // pre-checked as the starting point. The choice submitted with the form is
  // THIS team's own — the server revalidates every id against the
  // installation, so this list is presentation, never authorization.
  function renderRepositoryAccess() {
    const mode = launchContract.repositorySelectionMode(session.repositorySelection?.mode) || launchContract.REPOSITORY_SELECTION_MODE.SELECTED;
    const selected = new Set(launchContract.selectedRepositoryIds(session.repositorySelection || {}));
    setFieldError(ui.teamRepositoriesError, "");
    ui.repositoryList.replaceChildren();

    session.repositories.forEach((repository) => {
      const id = String(repository.githubRepositoryId);
      const label = document.createElement("label");
      label.className = "repository-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "githubRepositoryId";
      checkbox.value = id;
      checkbox.checked = mode === launchContract.REPOSITORY_SELECTION_MODE.ALL || selected.has(id) || repository.selectedForTeams === true;
      // form.reset() after a successful create must restore the org-selection
      // pre-check, not blank the picker for the next team.
      checkbox.defaultChecked = checkbox.checked;
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const branch = document.createElement("small");
      name.textContent = `${stringValue(repository.owner)}/${stringValue(repository.name)}`;
      branch.textContent = `Default branch: ${stringValue(repository.defaultBranch) || "not reported"}`;
      copy.append(name, branch);
      // The kit's access column, told truthfully: every repository here is
      // one the customer already granted, so the state is whether THIS team
      // works in it — not an access level the checkbox does not control.
      const state = document.createElement("span");
      state.className = "repo-state";
      state.dataset.repoState = checkbox.checked ? "on" : "off";
      state.textContent = checkbox.checked ? "Included" : "Not included";
      label.append(checkbox, copy, state);
      ui.repositoryList.append(label);
    });
    renderFirstrunRepositoryCount();

    const count = session.repositories.length;
    if (count > 0) {
      const names = session.repositories.slice(0, 4).map((repository) => `${stringValue(repository.owner)}/${stringValue(repository.name)}`);
      const preview = names.join(", ") + (count > 4 ? ` and ${count - 4} more` : "");
      session.connectedRepositoryCount = count;
      ui.repositoryNote.textContent = "Your organization's current selection is pre-checked. This team keeps its own list — pick at least one.";
      // Name the repositories: a bare count can't tell the user WHICH repos
      // are on offer, which is the one thing they check here.
      setStep("repositories", "complete", `${count} connected`, `Your GitHub App reaches ${preview}. Choose which of them this team works in when you name it.`);
    } else {
      session.connectedRepositoryCount = 0;
      ui.repositoryNote.textContent = "No accessible repositories were returned. Grant repository access in GitHub, then refresh.";
      setStep("repositories", "blocked", "No repositories", "The installation is active, but GitHub returned no accessible repositories. Grant access in GitHub and refresh.");
    }
    // The header line speaks for the selected TEAM when there is one; the
    // Settings checklist may have been waiting on this list to arrive.
    renderContextRepositories();
    renderRepositoryControl();
  }

  function selectedRepositoryIdsFromForm() {
    return [...ui.repositoryList.querySelectorAll('input[name="githubRepositoryId"]:checked')].map((input) => input.value);
  }

  // The closing note under the create button: how many repositories are
  // ticked, out of how many the installation reaches, and what the
  // Engineering Manager does with them. Hidden while there is nothing real
  // to count.
  function renderFirstrunRepositoryCount() {
    if (!ui.firstrunCount) return;
    const total = session.repositories.length;
    if (!session.repositoryServiceAvailable || !total) {
      ui.firstrunCount.hidden = true;
      return;
    }
    const checked = selectedRepositoryIdsFromForm().length;
    ui.firstrunCount.hidden = false;
    ui.firstrunCount.textContent = `${checked.toString()} of ${total.toString()} repositories · your Engineering Manager starts reading them the moment the team is live`;
  }

  function renderBillingPlanResult(result) {
    session.billingPlanAvailable = false;
    session.billingPlan = null;
    session.billingPlanError = "";
    ui.planSummary.hidden = true;
    const expectedPlanId = stringValue(config.plan_id) || "founding-team";
    const plan = result.status === "fulfilled" ? result.value.plan : null;
    const state = typeof plan?.state === "number"
      ? plan.state
      : stringValue(plan?.state).replace(/^BILLING_PLAN_STATE_/, "");
    const active = state === 1 || state === "ACTIVE";
    if (result.status !== "fulfilled" || stringValue(plan?.id) !== expectedPlanId || !active) {
      session.billingPlanError = result.status === "rejected"
        ? apiErrorMessage(result.reason, "The launch billing plan is not available.")
        : "The billing service did not return the configured active launch plan.";
      return;
    }
    session.billingPlanAvailable = true;
    session.billingPlan = plan;
    ui.planName.textContent = stringValue(session.billingPlan.name) || stringValue(session.billingPlan.id);
    ui.planPrice.textContent = formatMoney(session.billingPlan.recurringPrice, session.billingPlan.interval);
    ui.planCredits.textContent = formatCredits(session.billingPlan.includedCreditMicros);
    ui.planSlots.textContent = "One organization licence · as many teams as you run";
    ui.planSummary.hidden = false;
  }

  function formatMoney(money, interval) {
    const units = Number(money?.units || 0);
    const nanos = Number(money?.nanos || 0);
    const currency = stringValue(money?.currencyCode) || "USD";
    if (!Number.isSafeInteger(units) || !Number.isInteger(nanos)) return "Price available in checkout";
    const amount = units + nanos / 1_000_000_000;
    const suffix = [2, "BILLING_INTERVAL_YEAR"].includes(interval) ? "/year" : "/month";
    try { return `${new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount)}${suffix}`; } catch { return `${amount.toFixed(2)} ${currency}${suffix}`; }
  }

  function formatCredits(value) {
    const micros = int64Value(value);
    if (micros === null || micros <= 0n) return "Included credits shown at checkout";
    return `${new Intl.NumberFormat().format(micros / 1_000_000n)} engineering credits`;
  }

  function int64Value(value) {
    try {
      const normalized = typeof value === "bigint"
        ? value.toString()
        : typeof value === "number" && Number.isSafeInteger(value)
          ? String(value)
          : stringValue(value);
      if (!/^(?:0|[1-9][0-9]{0,18})$/.test(normalized)) return null;
      const parsed = BigInt(normalized);
      return parsed <= 9_223_372_036_854_775_807n ? parsed : null;
    } catch {
      return null;
    }
  }

  function resetSubscriptionCapacity() {
    session.paidTeamSlots = 0n;
    session.usedTeamSlots = 0n;
    session.availableTeamSlots = 0n;
  }

  // The subscription is no longer an onboarding step: it is the billing record
  // behind the Settings page and the paid-slot capacity backing team creation.
  // This keeps the full billing data model (subscription, active flag, slot
  // balance, default payment method) while rendering it only in Settings.
  function renderSubscriptionResult(result) {
    if (result.status === "fulfilled") {
      const subscription = result.value.subscription;
      if (subscription && stringValue(subscription.organizationId) !== session.organizationId) {
        session.subscription = null;
        session.subscriptionManageable = false;
        session.subscriptionActive = false;
        resetSubscriptionCapacity();
        renderSettingsBilling("The billing service returned a subscription outside the current organization scope. No billing state was displayed.", "error");
        return;
      }
      if (result.value.plan?.id) renderBillingPlanResult({ status: "fulfilled", value: { plan: result.value.plan } });
      const status = subscriptionStatusLabel(subscription);
      session.subscription = subscription || null;
      session.subscriptionManageable = Boolean(subscription?.id);
      resetSubscriptionCapacity();
      const paid = int64Value(subscription?.paidTeamSlots);
      const used = int64Value(subscription?.usedTeamSlots);
      const available = int64Value(subscription?.availableTeamSlots);
      const validCapacity = paid !== null && used !== null && available !== null && paid > 0n && used + available === paid;
      session.subscriptionActive = status === "active" && validCapacity;
      if (validCapacity) {
        session.paidTeamSlots = paid;
        session.usedTeamSlots = used;
        session.availableTeamSlots = available;
        // The three slot fields are legacy: under an unlimited plan the server
        // reports "the teams you have, one more you can always add, and their
        // sum". Reading them back out as paid capacity would put a ceiling in
        // front of a customer who does not have one.
        ui.planSlots.textContent = `${used.toString()} ${used === 1n ? "team" : "teams"} running · one licence · no limit`;
      }
      renderSettingsBilling(status === "active" && !validCapacity
        ? "The billing service did not return a consistent paid team-slot balance. Manage billing in the Stripe portal."
        : "", status === "active" && !validCapacity ? "error" : "");
      return;
    }
    session.subscription = null;
    session.subscriptionManageable = false;
    session.subscriptionActive = false;
    resetSubscriptionCapacity();
    renderSettingsBilling(isMissingResource(result.reason)
      ? ""
      : apiErrorMessage(result.reason, "The billing service is not ready. No subscription state was assumed."),
      isMissingResource(result.reason) ? "" : "error");
  }

  function buildOrganizationMembers(state) {
    const organizationId = stringValue(state?.organization?.id);
    const membership = Array.isArray(state?.memberships)
      ? state.memberships.find((entry) => stringValue(entry?.id) === organizationId)
      : null;
    const user = session.user || {};
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(user.githubLogin) || stringValue(session.claims.githubLogin) || "Signed-in user";
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(session.claims.githubLogin) || stringValue(user.email) || stringValue(session.claims.email);
    return [{ name, login, role: membershipRoleLabel(membership?.role), self: true }];
  }

  // MembershipRole is a proto enum, and protobuf-es hands it back as a NUMBER
  // even though Connect JSON put the name on the wire — the same shape that
  // made every agent read as not-active until lifecycleLabel learned it. Until
  // this, an owner was labelled "member" everywhere the role is shown, because
  // stringValue(1) is "" and the fallback took over. An unrecognised value
  // returns nothing rather than a plausible-looking "member".
  function membershipRoleLabel(value) {
    if (typeof value === "number") return ({ 1: "owner", 2: "admin", 3: "member", 4: "billing" })[value] || "";
    return stringValue(value).replace(/^MEMBERSHIP_ROLE_/, "").replaceAll("_", " ").toLowerCase();
  }

  function renderSettingsAccount() {
    if (!ui.settingsAccountName) return;
    const user = session.user || {};
    const name = stringValue(user.displayName) || stringValue(session.claims.displayName) || stringValue(session.claims.email) || (session.accessToken ? "Signed-in user" : "—");
    const login = stringValue(user.githubLogin) || stringValue(user.username) || stringValue(session.claims.githubLogin) || stringValue(session.claims.email) || "—";
    ui.settingsAccountName.textContent = name;
    ui.settingsAccountLogin.textContent = login;
    ui.settingsAccountOrg.textContent = stringValue(session.organizationName) || "Not selected";
    renderSettingsMembers();
    // People is the same one row, given the screen the rail promised it. It
    // reads the state this render just wrote and never fetches anything.
    renderPeopleView();
  }

  function renderSettingsMembers() {
    if (!ui.settingsMembers) return;
    ui.settingsMembers.replaceChildren();
    const members = Array.isArray(session.members) ? session.members : [];
    ui.settingsMembersCount.textContent = members.length ? `${members.length} ${members.length === 1 ? "member" : "members"}` : "—";
    if (ui.settingsMembersEmpty) ui.settingsMembersEmpty.hidden = members.length > 0;
    members.forEach((member) => {
      const item = document.createElement("li");
      const avatar = document.createElement("span");
      avatar.className = "user-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = (stringValue(member.name).charAt(0) || "?").toUpperCase();
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = stringValue(member.name) + (member.self ? " (you)" : "");
      const login = document.createElement("small");
      login.textContent = stringValue(member.login) || "—";
      copy.append(name, login);
      const role = document.createElement("span");
      role.className = "settings-member-role";
      // The label is already resolved by buildOrganizationMembers; an empty one
      // means the response did not say, which is a different fact from "member".
      role.textContent = stringValue(member.role) || "role not reported";
      item.append(avatar, copy, role);
      ui.settingsMembers.append(item);
    });
  }

  // The plan's recurring price, with the published figure as the fallback the
  // create screen needs before the plan has come back. It licenses the
  // ORGANIZATION, not a team: the name says "unit amount" because that is what
  // the catalog calls it, and nothing may multiply it by a team count.
  function teamUnitAmountCents() {
    const money = session.billingPlan?.recurringPrice;
    const units = signedInt64Value(money?.units);
    const nanos = Number(money?.nanos || 0);
    if (units !== null && units >= 0n && Number.isInteger(nanos) && Math.abs(nanos) <= 999_999_999) {
      const cents = units * 100n + BigInt(Math.round(nanos / 10_000_000));
      if (cents > 0n) return cents;
    }
    return 19900n; // $199.00/month founding-organization default
  }

  function formatCents(cents) {
    const value = typeof cents === "bigint" ? cents : 0n;
    const currency = stringValue(session.billingPlan?.recurringPrice?.currencyCode) || "USD";
    const dollars = Number(value) / 100;
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(dollars); }
    catch { return `$${dollars.toFixed(2)}`; }
  }

  // Engineering-agent count: a floor of three (the adversarial-review floor) up
  // to fifty. It is a COMPOSITION rule, not a price — seats are unlimited within
  // a team and the per-seat add-on that used to price them is deleted
  // server-side.
  const ENGINEER_FLOOR = launchContract?.ENGINEER_FLOOR ?? 3;
  const ENGINEER_MAX = launchContract?.ENGINEER_MAX ?? 50;

  function normalizeEngineerCount(value) {
    if (launchContract) return launchContract.normalizeEngineerCount(value);
    const parsed = Math.floor(Number(value));
    if (!Number.isFinite(parsed)) return ENGINEER_FLOOR;
    return Math.min(ENGINEER_MAX, Math.max(ENGINEER_FLOOR, parsed));
  }

  // What creating THIS team costs. The base is charged once, by the team that
  // starts the organization's subscription; every team after it is covered by
  // that same licence and costs nothing. Charging the base again is exactly the
  // bug the unlimited-teams plan was shipped to end.
  //
  // The engineer count is not part of it. It used to add a per-seat charge, and
  // that number went onto the pay button - so leaving it here would quote a
  // customer a total the server will not bill.
  function teamPricingFor(engineerCount) {
    const includeBase = !session.subscriptionActive;
    if (launchContract) return launchContract.teamPricing({ engineerCount, baseCents: teamUnitAmountCents(), includeBase });
    return {
      engineerCount: normalizeEngineerCount(engineerCount),
      engineerFloor: ENGINEER_FLOOR,
      includesBase: includeBase,
      baseCents: teamUnitAmountCents(),
      totalCents: includeBase ? teamUnitAmountCents() : 0n
    };
  }

  // What this team adds to the bill, in the customer's own arithmetic:
  //
  //   first team    "$199 a month for your organization, and every team after
  //                  this one is covered by it"
  //   later team    "Covered by your subscription — no extra charge"
  //
  // There is no third case any more. The engineer count used to open one
  // ("… + 2 × $199 engineers = $597/mo") and the server no longer bills it.
  function pricingBreakdown(pricing) {
    if (!pricing.includesBase) return "Covered by your subscription — no extra charge";
    return `${formatCents(pricing.baseCents)} a month for your organization, and every team after this one is covered by it`;
  }

  // True only when the server will actually charge the saved card off-session:
  // a LIVE subscription plus a card on file. A canceled/incomplete subscription
  // row re-opens checkout server-side (Stripe: canceled subscriptions cannot be
  // reactivated), so the CTA must not promise a saved-card charge then.
  function savedCardChargeExpected() {
    const status = subscriptionStatusLabel(session.subscription);
    return ["active", "trialing"].includes(status) && Boolean(session.subscription?.defaultPaymentMethod);
  }

  // The primary CTA carries the exact total and what the click does (Baymard:
  // 12% abandon checkouts where the total isn't computable up front; naming
  // the next step removes the payment surprise). First team opens Stripe
  // checkout; later teams charge the saved card.
  function updateTeamSubmitLabel() {
    if (!ui.teamSubmit || ui.teamSubmit.dataset.busy === "1") return;
    const pricing = teamPricingFor(ui.engineerInput ? ui.engineerInput.value : ENGINEER_FLOOR);
    const total = `${formatCents(pricing.totalCents)}/month`;
    // A team the subscription already covers charges nothing, and the button
    // has to say so: "Continue to payment — $199/month" in front of a free
    // second team is the paywall the unlimited plan removed.
    if (pricing.totalCents === 0n) {
      ui.teamSubmit.textContent = "Create team — covered by your subscription";
      return;
    }
    ui.teamSubmit.textContent = savedCardChargeExpected()
      ? `Create team — ${total} on your saved card`
      : `Continue to payment — ${total}`;
  }

  // Live price for the name-your-team screen. The screen asks one question,
  // so there is no stepper here: the price reflects the included floor of
  // three engineers, and capacity changes live in Settings after creation.
  function renderTeamSetupPricing() {
    const pricing = teamPricingFor(ui.engineerInput ? ui.engineerInput.value : ENGINEER_FLOOR);
    if (ui.teamPriceAmount) {
      ui.teamPriceAmount.replaceChildren();
      if (pricing.totalCents === 0n) {
        // Not a zero standing in for a price: it IS the price, and the word is
        // what says so. A "$0.00" here reads as a reading that failed.
        ui.teamPriceAmount.append(document.createTextNode("Included"));
      } else {
        ui.teamPriceAmount.append(document.createTextNode(formatCents(pricing.totalCents)));
        const per = document.createElement("small");
        per.textContent = " / month";
        ui.teamPriceAmount.append(per);
      }
    }
    if (ui.teamPriceBreakdown) ui.teamPriceBreakdown.textContent = pricingBreakdown(pricing);
    if (ui.engineerDecrement) ui.engineerDecrement.disabled = pricing.engineerCount <= ENGINEER_FLOOR;
    if (ui.engineerIncrement) ui.engineerIncrement.disabled = pricing.engineerCount >= ENGINEER_MAX;
    updateTeamSubmitLabel();
  }

  // Nudge a stepper input by ±1 within the engineer bounds, then re-render.
  function stepEngineerInput(input, delta, afterChange) {
    if (!input) return;
    input.value = String(normalizeEngineerCount(Number(input.value || ENGINEER_FLOOR) + delta));
    if (typeof afterChange === "function") afterChange();
  }

  function paymentMethodSummary(pm) {
    const brand = stringValue(pm?.brand);
    const last4 = stringValue(pm?.last4);
    if (!brand && !last4) return "";
    const brandLabel = brand ? `${brand.charAt(0).toUpperCase()}${brand.slice(1)}` : "Card";
    const digits = /^[0-9]{4}$/.test(last4) ? last4 : "";
    const month = Number(pm?.expMonth);
    const year = Number(pm?.expYear);
    const exp = Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year) && year >= 2000 && year <= 2100
      ? ` · exp ${String(month).padStart(2, "0")}/${String(year).slice(-2)}`
      : "";
    return digits ? `${brandLabel} •••• ${digits}${exp}` : brandLabel;
  }

  function renderSettingsBilling(errorMessage = "", tone = "") {
    if (!ui.settingsBillingState) return;
    // Every team the one licence covers, which is every team that exists — a
    // team still provisioning is covered too. This is the same count the
    // Billing screen's roster shows, read from the same held teams, so the
    // two surfaces cannot disagree about how many there are.
    const covered = session.teams.filter((team) => lifecycleLabel(team?.state) !== "deleted").length;
    const count = Number.isSafeInteger(covered) && covered >= 0 ? covered : 0;
    // Unlimited teams: the subscription licenses the ORGANIZATION and its
    // Stripe quantity is pinned at one, so the team count beside it is a
    // roster and never a multiplier. Multiplying was correct while a team was
    // a licensed unit; the day the licence moved to the organization it
    // started reading "$199 × your team count" and overstated the bill of
    // every customer with more than one team.
    ui.settingsTeamCount.textContent = String(count);
    ui.settingsBillingAmount.textContent = organizationSubscriptionLabel();
    const includedCredits = int64Value(session.billingPlan?.includedCreditMicros);
    ui.settingsBillingUnit.textContent = includedCredits !== null && includedCredits > 0n
      ? `${formatCreditMicros(includedCredits)} credits/period`
      : "Shown at checkout";

    const pm = paymentMethodSummary(session.subscription?.defaultPaymentMethod);
    ui.settingsPaymentMethod.textContent = pm || "No card on file";

    if (errorMessage) {
      setSourceState(ui.settingsBillingState, "Unavailable", tone || "error");
      ui.settingsBillingNote.textContent = errorMessage;
    } else if (!session.organizationId) {
      setSourceState(ui.settingsBillingState, "Waiting", "");
      ui.settingsBillingNote.textContent = "Select an organization to load its billing.";
    } else if (session.subscriptionManageable) {
      const status = subscriptionStatusLabel(session.subscription) || "active";
      setSourceState(ui.settingsBillingState, session.subscriptionActive ? "Active" : capitalize(status), session.subscriptionActive ? "success" : "");
      ui.settingsBillingNote.textContent = pm
        ? "One subscription covers this organization and as many teams as you run. Manage billing opens the Stripe Customer Portal to update the card, view invoices, or cancel."
        : "Manage billing opens the Stripe Customer Portal to view invoices and update payment.";
    } else {
      setSourceState(ui.settingsBillingState, "No card yet", "");
      ui.settingsBillingNote.textContent = "Billing starts when you create your first team. A card is collected once in secure Stripe checkout, and the subscription it starts covers this organization and every team in it.";
    }
    ui.settingsBillingManage.disabled = !session.subscriptionManageable || checkoutOpening;
    renderEngineerControl();
    // The Billing screen is the organization-shaped view of the same state
    // this card summarises, so it repaints on the same beat and can never
    // disagree with it.
    renderBillingView();
  }

  // Settings → Engineering capacity: change how many engineering agents the
  // selected, active team runs. SetTeamEngineerCount charges the prorated
  // remainder off-session (or asks for 3-D Secure); a hard decline surfaces the
  // FAILED_PRECONDITION as an inline error, exactly like the RequestTeam path.
  function renderEngineerControl() {
    if (!ui.engineerSettings) return;
    const team = selectedTeam();
    if (!team) {
      engineerControlTeamId = "";
      setSourceState(ui.engineerSettingsState, "Waiting", "");
      ui.engineerSettingsTeam.hidden = false;
      ui.engineerSettingsTeam.textContent = "Select a team to change how many engineers it runs.";
      ui.engineerSettingsField.hidden = true;
      ui.settingsEngineerPrice.hidden = true;
      ui.settingsEngineerNote.hidden = true;
      setFieldError(ui.settingsEngineerError, "");
      ui.settingsEngineerApply.disabled = true;
      return;
    }
    const teamId = stringValue(team.id);
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    // Reset the stepper to the team's confirmed count when the team changes.
    if (engineerControlTeamId !== teamId) {
      engineerControlTeamId = teamId;
      ui.settingsEngineerInput.value = String(current);
      setFieldError(ui.settingsEngineerError, "");
    }
    const active = lifecycleLabel(team.state) === "active";
    ui.engineerSettingsField.hidden = false;
    ui.settingsEngineerNote.hidden = false;
    ui.engineerSettingsTeam.hidden = false;
    ui.engineerSettingsTeam.textContent = active
      ? `${stringValue(team.name) || "This team"} runs ${current} engineer${current === 1 ? "" : "s"} today.`
      : `${stringValue(team.name) || "This team"} must be active before its engineering capacity can change.`;
    setSourceState(ui.engineerSettingsState, active ? "Active" : capitalize(lifecycleLabel(team.state) || "pending"), active ? "success" : "");
    syncEngineerControl();
  }

  function renderEngineerControlPricing(currentCount) {
    if (!ui.settingsEngineerPrice) return;
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    const pricing = teamPricingFor(target);
    ui.settingsEngineerPrice.hidden = false;
    if (target === currentCount) {
      ui.settingsEngineerPrice.textContent = pricingBreakdown(pricing);
      return;
    }
    const currentPricing = teamPricingFor(currentCount);
    const increase = target > currentCount;
    const delta = formatCents(increase ? pricing.totalCents - currentPricing.totalCents : currentPricing.totalCents - pricing.totalCents);
    ui.settingsEngineerPrice.textContent = `New: ${pricingBreakdown(pricing)} · ${increase ? "increase" : "decrease"} of ${delta}/mo`;
  }

  // Recompute price + button states from the current input without resetting it.
  function syncEngineerControl() {
    const team = selectedTeam();
    if (!team || !ui.engineerSettingsField || ui.engineerSettingsField.hidden) return;
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    const manageable = lifecycleLabel(team.state) === "active" && session.subscriptionManageable && !checkoutOpening && !engineerControlBusy;
    renderEngineerControlPricing(current);
    ui.settingsEngineerInput.disabled = !manageable;
    ui.settingsEngineerDecrement.disabled = !manageable || target <= ENGINEER_FLOOR;
    ui.settingsEngineerIncrement.disabled = !manageable || target >= ENGINEER_MAX;
    ui.settingsEngineerApply.disabled = !manageable || target === current;
  }

  async function applyEngineerCount() {
    const team = selectedTeam();
    if (!team) return;
    const teamId = stringValue(team.id);
    const current = normalizeEngineerCount(team.engineerCount ?? ENGINEER_FLOOR);
    const target = normalizeEngineerCount(ui.settingsEngineerInput.value);
    setFieldError(ui.settingsEngineerError, "");
    if (target === current) return;
    engineerControlBusy = true;
    ui.settingsEngineerApply.disabled = true;
    ui.settingsEngineerApply.textContent = "Updating…";
    try {
      const result = await apiRequest("set_team_engineer_count", {
        teamId,
        engineerCount: target,
        idempotencyKey: mutationKeys.for("setEngineerCount", `${teamId}:${target}`)
      });
      const updated = result.team;
      if (!updated || stringValue(updated.id) !== teamId || stringValue(updated.organizationId) !== session.organizationId) {
        throw new ApiError("Team service returned a team outside the selected organization scope", 0, "invalid_response", "");
      }
      const settlement = requestTeamSettlement(result.settlement);
      const record = session.teams.find((candidate) => stringValue(candidate.id) === teamId);
      if (record) Object.assign(record, updated);
      const confirmed = normalizeEngineerCount(updated.engineerCount ?? target);
      ui.settingsEngineerInput.value = String(confirmed);
      if (settlement === REQUEST_TEAM_SETTLEMENT.AUTHENTICATION_REQUIRED) {
        const destination = validatedRedirect(result.authenticationUrl || result.authentication_url, ["invoice.stripe.com"]);
        if (!destination) throw new ApiError("Billing service returned an untrusted authentication URL", 0, "invalid_redirect", "");
        const opened = window.open(destination, "_blank", "noopener,noreferrer");
        toast(opened
          ? "Authenticate the payment in the new Stripe tab to apply the new engineer count."
          : "Allow pop-ups, then retry to authenticate the payment for this change.", "info");
      } else {
        mutationKeys.clear("setEngineerCount");
        const changed = Math.abs(confirmed - current);
        toast(confirmed > current
          ? `Added ${changed} engineer${changed === 1 ? "" : "s"}. The prorated remainder was charged to the card on file.`
          : `Reduced to ${confirmed} engineer${confirmed === 1 ? "" : "s"}. The unused portion is credited to your next invoice.`, "success");
      }
      renderTeamList();
      renderSelectedTeamSummary();
      renderSettingsBilling();
    } catch (error) {
      const message = apiErrorMessage(error, "The engineering capacity was not changed. It is safe to retry; the request uses an idempotency key.");
      setFieldError(ui.settingsEngineerError, message);
      toast(message, "error");
    } finally {
      engineerControlBusy = false;
      ui.settingsEngineerApply.textContent = "Update engineering capacity";
      renderEngineerControl();
    }
  }

  // ── Settings → Repositories ────────────────────────────────────────────────
  // The customer's words: "I can't switch the repo here and I should be able
  // to select multiple repos." This section is the create-flow picker pointed
  // at an EXISTING team: accessible repositories, the team's current set
  // pre-checked, minimum one, and an explicit save that re-provisions.

  function sortedRepositoryIds(ids) {
    return [...ids].sort((left, right) => (BigInt(left) < BigInt(right) ? -1 : BigInt(left) > BigInt(right) ? 1 : 0));
  }

  function sameRepositorySet(left, right) {
    const a = sortedRepositoryIds(left);
    const b = sortedRepositoryIds(right);
    return a.length === b.length && a.every((id, index) => id === b[index]);
  }

  // The team's current repository set, as the client best knows it: the set a
  // server-confirmed mutation recorded in this session, else the
  // organization's durable selection — the exact set CreateTeam copies onto a
  // team at birth, and the same signals the create picker pre-checks from
  // (mode ALL, the durable id list, and per-repository selected_for_teams).
  function knownTeamRepositoryIds(teamId) {
    const recorded = session.teamRepositoryIds.get(stringValue(teamId));
    if (Array.isArray(recorded) && recorded.length) return [...recorded];
    const mode = launchContract.repositorySelectionMode(session.repositorySelection?.mode) || launchContract.REPOSITORY_SELECTION_MODE.SELECTED;
    const selected = new Set(launchContract.selectedRepositoryIds(session.repositorySelection || {}));
    return session.repositories
      .filter((repository) => mode === launchContract.REPOSITORY_SELECTION_MODE.ALL || selected.has(String(repository.githubRepositoryId)) || repository.selectedForTeams === true)
      .map((repository) => String(repository.githubRepositoryId));
  }

  function checkedSettingsRepositoryIds() {
    if (!ui.settingsRepositoryList) return [];
    return [...ui.settingsRepositoryList.querySelectorAll('input[name="settingsGithubRepositoryId"]:checked')].map((input) => input.value);
  }

  function buildRepositoryControlChecklist(currentIds) {
    if (!ui.settingsRepositoryList) return;
    const current = new Set(currentIds);
    ui.settingsRepositoryList.replaceChildren();
    session.repositories.forEach((repository) => {
      const id = String(repository.githubRepositoryId);
      const label = document.createElement("label");
      label.className = "repository-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "settingsGithubRepositoryId";
      checkbox.value = id;
      checkbox.checked = current.has(id);
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const branch = document.createElement("small");
      name.textContent = `${stringValue(repository.owner)}/${stringValue(repository.name)}`;
      branch.textContent = `Default branch: ${stringValue(repository.defaultBranch) || "not reported"}`;
      copy.append(name, branch);
      label.append(checkbox, copy);
      ui.settingsRepositoryList.append(label);
    });
  }

  function renderRepositoryControl() {
    if (!ui.repoSettings) return;
    const team = selectedTeam();
    const resetSection = (stateLabel, tone, message) => {
      repositoryControlTeamId = "";
      repositoryControlListSignature = "";
      setSourceState(ui.repoSettingsState, stateLabel, tone);
      if (ui.repoSettingsTeam) { ui.repoSettingsTeam.hidden = false; ui.repoSettingsTeam.textContent = message; }
      if (ui.repoSettingsField) ui.repoSettingsField.hidden = true;
      if (ui.settingsRepositoriesNote) ui.settingsRepositoriesNote.hidden = true;
      setFieldError(ui.settingsRepositoriesError, "");
      if (ui.settingsRepositoriesApply) ui.settingsRepositoriesApply.disabled = true;
    };
    if (!team) {
      resetSection("Waiting", "", "Select a team to change which repositories it works in.");
      return;
    }
    if (!session.repositoryServiceAvailable || session.repositories.length === 0) {
      resetSection("Unavailable", "", "The list of repositories you have granted has not loaded yet. Refresh it to try again.");
      return;
    }
    const teamId = stringValue(team.id);
    const listSignature = session.repositories.map((repository) => String(repository.githubRepositoryId)).join(",");
    // Rebuild the checklist only when the team or the accessible list itself
    // changes; a background re-render must never clobber an in-progress edit.
    if (repositoryControlTeamId !== teamId || repositoryControlListSignature !== listSignature) {
      repositoryControlTeamId = teamId;
      repositoryControlListSignature = listSignature;
      buildRepositoryControlChecklist(knownTeamRepositoryIds(teamId));
      setFieldError(ui.settingsRepositoriesError, "");
    }
    const active = lifecycleLabel(team.state) === "active";
    const current = knownTeamRepositoryIds(teamId);
    if (ui.repoSettingsField) ui.repoSettingsField.hidden = false;
    if (ui.settingsRepositoriesNote) ui.settingsRepositoriesNote.hidden = false;
    if (ui.repoSettingsTeam) {
      ui.repoSettingsTeam.hidden = false;
      ui.repoSettingsTeam.textContent = active
        ? `${stringValue(team.name) || "This team"} works in ${current.length} ${current.length === 1 ? "repository" : "repositories"} today.`
        : `${stringValue(team.name) || "This team"} must be active before its repositories can change.`;
    }
    setSourceState(ui.repoSettingsState, active ? "Active" : capitalize(lifecycleLabel(team.state) || "pending"), active ? "success" : "");
    syncRepositoryControl();
  }

  // Recompute button/checkbox states from the current checklist without
  // rebuilding it: save stays disabled until the selection differs from the
  // team's current set, and an empty selection can never be submitted.
  function syncRepositoryControl() {
    const team = selectedTeam();
    if (!team || !ui.repoSettingsField || ui.repoSettingsField.hidden) return;
    const manageable = lifecycleLabel(team.state) === "active" && !repositoryControlBusy;
    const checked = checkedSettingsRepositoryIds();
    const unchanged = sameRepositorySet(checked, knownTeamRepositoryIds(team.id));
    if (ui.settingsRepositoryList) ui.settingsRepositoryList.querySelectorAll("input").forEach((checkbox) => { checkbox.disabled = !manageable; });
    if (checked.length === 0) setFieldError(ui.settingsRepositoriesError, "Your team needs at least one repository.");
    if (ui.settingsRepositoriesApply) ui.settingsRepositoriesApply.disabled = !manageable || unchanged || checked.length === 0;
  }

  function repositoryControlErrorMessage(error) {
    if (error instanceof ApiError && error.code === "failed_precondition") {
      const raw = stringValue(error.message).toLowerCase();
      if (raw.includes("accessible")) {
        return "GitHub no longer grants the deep navy app access to one of the selected repositories. Refresh the repository list in GitHub setup and choose from what it offers.";
      }
      if (raw.includes("at least one") || raw.includes("selection")) {
        return "Your team needs at least one repository.";
      }
      return "Another change is still being applied to this team. Wait for the current provisioning run to finish, then save again.";
    }
    return apiErrorMessage(error, "The repositories were not changed and nothing was re-provisioned. It is safe to retry; the request uses an idempotency key.");
  }

  async function applyTeamRepositories() {
    const team = selectedTeam();
    if (!team || repositoryControlBusy) return;
    const teamId = stringValue(team.id);
    const teamName = stringValue(team.name) || "the team";
    const target = sortedRepositoryIds(checkedSettingsRepositoryIds());
    setFieldError(ui.settingsRepositoriesError, "");
    if (target.length === 0) {
      setFieldError(ui.settingsRepositoriesError, "Your team needs at least one repository.");
      ui.settingsRepositoryList?.querySelector('input[name="settingsGithubRepositoryId"]')?.focus();
      return;
    }
    if (sameRepositorySet(target, knownTeamRepositoryIds(teamId))) return;
    repositoryControlBusy = true;
    if (ui.settingsRepositoriesApply) {
      ui.settingsRepositoriesApply.disabled = true;
      ui.settingsRepositoriesApply.textContent = "Updating…";
    }
    syncRepositoryControl();
    try {
      const result = await apiRequest("update_team_repositories", {
        id: teamId,
        repositoryIds: target,
        idempotencyKey: mutationKeys.for("updateTeamRepositories", `${teamId}:${target.join(",")}`)
      });
      const updated = result.team;
      if (!updated || stringValue(updated.id) !== teamId || stringValue(updated.organizationId) !== session.organizationId) {
        throw new ApiError("Team service returned a team outside the selected organization scope", 0, "invalid_response", "");
      }
      mutationKeys.clear("updateTeamRepositories");
      // The server persisted the selection and enqueued the re-provision
      // atomically; the validated set is now the team's own.
      session.teamRepositoryIds.set(teamId, target);
      const record = session.teams.find((candidate) => stringValue(candidate.id) === teamId);
      if (record) Object.assign(record, updated);
      toast(`Repositories updated for “${teamName}”. The team is re-provisioning — agents keep their memory.`, "success");
      renderTeamList();
      renderContextRepositories();
      // The refreshed team record carries the new provisioning command, so
      // the standard reload hands the workspace to the existing provisioning
      // stream: the re-provision renders exactly like any provision.
      await reloadTeamsAfterLifecycle();
    } catch (error) {
      setFieldError(ui.settingsRepositoriesError, repositoryControlErrorMessage(error));
    } finally {
      repositoryControlBusy = false;
      if (ui.settingsRepositoriesApply) ui.settingsRepositoriesApply.textContent = "Update repositories";
      renderRepositoryControl();
    }
  }

  // The workspace header's repository line. With a team selected it names the
  // TEAM's current set, plural-aware — one repository renders as its bare
  // owner/name (the line the customer reads today), several as a count plus
  // the first few names. Without a team it falls back to what the
  // installation reaches, exactly as before.
  function renderContextRepositories() {
    if (!ui.contextRepositories) return;
    const team = selectedTeam();
    if (team && session.repositoryServiceAvailable && session.repositories.length > 0) {
      const labels = new Map(session.repositories.map((repository) => [String(repository.githubRepositoryId), `${stringValue(repository.owner)}/${stringValue(repository.name)}`]));
      const names = knownTeamRepositoryIds(team.id).map((id) => labels.get(id)).filter(Boolean);
      if (names.length === 1) {
        ui.contextRepositories.textContent = names[0];
        return;
      }
      if (names.length > 1) {
        const preview = names.slice(0, 3).join(", ") + (names.length > 3 ? ` and ${names.length - 3} more` : "");
        ui.contextRepositories.textContent = `${names.length} repositories · ${preview}`;
        return;
      }
    }
    const count = session.repositories.length;
    if (!session.repositoryServiceAvailable || count === 0) {
      ui.contextRepositories.textContent = session.repositoryServiceAvailable ? "No accessible repositories" : "Not loaded";
      return;
    }
    const names = session.repositories.slice(0, 4).map((repository) => `${stringValue(repository.owner)}/${stringValue(repository.name)}`);
    ui.contextRepositories.textContent = names.join(", ") + (count > 4 ? ` and ${count - 4} more` : "");
  }

  function subscriptionStatusLabel(subscription) {
    if (typeof subscription?.subscriptionStatus === "number") {
      return ["", "incomplete", "incomplete expired", "trialing", "active", "past due", "canceled", "unpaid", "paused"][subscription.subscriptionStatus] || "";
    }
    return stringValue(subscription?.subscriptionStatus).replace(/^SUBSCRIPTION_STATUS_/, "").replaceAll("_", " ").toLowerCase();
  }

  function reconcileBillingReturn() {
    const returned = storageRead(billingReturnStorageKey);
    if (!returned || typeof returned.createdAt !== "number" || Date.now() - returned.createdAt > 30 * 60 * 1000) {
      storageRemove(billingReturnStorageKey);
      return;
    }
    if ((reconcileBillingReturn.attempts || 0) < 3) {
      reconcileBillingReturn.attempts = (reconcileBillingReturn.attempts || 0) + 1;
      window.setTimeout(() => { if (session.accessToken) refreshOnboarding(); }, 3000 * reconcileBillingReturn.attempts);
      toast("Stripe returned. Refreshing team billing and credits while the signed webhook is verified.", "info");
    } else {
      storageRemove(billingReturnStorageKey);
      reconcileBillingReturn.attempts = 0;
      toast("Billing records were refreshed. Only webhook-confirmed subscriptions and credits are shown.", "info");
    }
  }

  function resetInvoiceHistory(message, label = "Waiting", tone = "") {
    session.invoices = [];
    session.invoiceIds = new Set();
    session.invoiceNextPageToken = "";
    session.invoicePageTokens = new Set();
    session.invoiceLoading = false;
    ui.invoiceHistory.hidden = !session.organizationId;
    ui.invoiceList.replaceChildren();
    ui.invoiceList.hidden = true;
    ui.invoiceEmpty.hidden = false;
    ui.invoiceMore.hidden = true;
    ui.invoiceMore.disabled = true;
    ui.invoiceMore.textContent = "Load more invoices";
    setEmptyState(ui.invoiceEmpty, label === "Loading" ? "Loading invoices" : "No invoices loaded", message);
    setSourceState(ui.invoiceState, label, tone);
  }

  function signedInt64Value(value) {
    try {
      const normalized = typeof value === "bigint"
        ? value.toString()
        : typeof value === "number" && Number.isSafeInteger(value)
          ? String(value)
          : stringValue(value);
      if (!/^-?(?:0|[1-9][0-9]{0,18})$/.test(normalized)) return null;
      const parsed = BigInt(normalized);
      return parsed >= -9_223_372_036_854_775_808n && parsed <= 9_223_372_036_854_775_807n ? parsed : null;
    } catch {
      return null;
    }
  }

  function canonicalMoneyValue(money) {
    const units = signedInt64Value(money?.units);
    const nanos = Number(money?.nanos || 0);
    const currency = stringValue(money?.currencyCode);
    if (units === null || !Number.isInteger(nanos) || Math.abs(nanos) > 999_999_999 || !/^[A-Z]{3}$/.test(currency)) return null;
    if ((units > 0n && nanos < 0) || (units < 0n && nanos > 0)) return null;
    return { currency, nanos: units * 1_000_000_000n + BigInt(nanos) };
  }

  function invoiceStatusLabel(value) {
    const numeric = typeof value === "number" ? value : -1;
    const normalized = numeric >= 0
      ? ["", "DRAFT", "OPEN", "PAID", "VOID", "UNCOLLECTIBLE"][numeric] || ""
      : stringValue(value).replace(/^INVOICE_STATUS_/, "");
    return ({ DRAFT: "draft", OPEN: "open", PAID: "paid", VOID: "void", UNCOLLECTIBLE: "uncollectible" })[normalized] || "";
  }

  function validatedHostedInvoiceURL(value) {
    if (typeof value !== "string" || !value || value.trim() !== value) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.host !== "invoice.stripe.com" || url.username || url.password || url.hash || !url.pathname.startsWith("/")) return "";
      return value;
    } catch {
      return "";
    }
  }

  function validInvoice(invoice) {
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!invoice || !uuid.test(stringValue(invoice.id)) || !uuid.test(stringValue(invoice.subscriptionId)) ||
      stringValue(invoice.organizationId) !== session.organizationId || !invoiceStatusLabel(invoice.status)) return false;
    const amounts = [invoice.subtotal, invoice.total, invoice.amountDue, invoice.amountPaid].map(canonicalMoneyValue);
    if (amounts.some((amount) => !amount) || new Set(amounts.map((amount) => amount.currency)).size !== 1 ||
      amounts[2].nanos < 0n || amounts[3].nanos < 0n) return false;
    const periodStart = timestampDate(invoice.periodStartsAt);
    const periodEnd = timestampDate(invoice.periodEndsAt);
    const createdAt = timestampDate(invoice.createdAt);
    const updatedAt = timestampDate(invoice.updatedAt);
    const dueAt = invoice.dueAt ? timestampDate(invoice.dueAt) : null;
    const paidAt = invoice.paidAt ? timestampDate(invoice.paidAt) : null;
    if (!periodStart || !periodEnd || periodEnd <= periodStart || !createdAt || !updatedAt || updatedAt < createdAt ||
      (invoice.dueAt && (!dueAt || dueAt < createdAt)) || (invoice.paidAt && (!paidAt || paidAt < createdAt)) ||
      (invoiceStatusLabel(invoice.status) === "paid" && !paidAt)) return false;
    const hostedURL = stringValue(invoice.hostedInvoiceUrl);
    return !hostedURL || Boolean(validatedHostedInvoiceURL(invoice.hostedInvoiceUrl));
  }

  function invoiceDateLabel(invoice) {
    const created = timestampDate(invoice.createdAt);
    return created ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(created) : "Date unavailable";
  }

  function renderInvoiceHistory() {
    ui.invoiceHistory.hidden = !session.organizationId;
    ui.invoiceList.replaceChildren();
    session.invoices.forEach((invoice) => {
      const status = invoiceStatusLabel(invoice.status);
      const item = document.createElement("li");
      item.className = "invoice-record";
      const head = document.createElement("div");
      head.className = "invoice-record-head";
      const state = document.createElement("span");
      state.className = "invoice-record-status";
      state.dataset.status = status;
      state.textContent = status;
      const date = document.createElement("time");
      date.textContent = invoiceDateLabel(invoice);
      const total = document.createElement("div");
      total.className = "invoice-record-total";
      const amount = document.createElement("strong");
      const amountSource = status === "paid" ? invoice.amountPaid : status === "open" || status === "uncollectible" ? invoice.amountDue : invoice.total;
      amount.textContent = formatCanonicalMoney(amountSource);
      const amountLabel = document.createElement("span");
      amountLabel.textContent = status === "paid" ? "paid" : status === "open" ? "due" : status === "uncollectible" ? "uncollected" : "invoice total";
      const period = document.createElement("span");
      period.className = "invoice-record-period";
      const starts = timestampDate(invoice.periodStartsAt);
      const ends = timestampDate(invoice.periodEndsAt);
      period.textContent = `Service period · ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(starts)} – ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(ends)}`;
      const actions = document.createElement("div");
      actions.className = "invoice-record-actions";
      const source = document.createElement("span");
      source.textContent = "Verified billing projection";
      actions.append(source);
      const hostedURL = validatedHostedInvoiceURL(invoice.hostedInvoiceUrl);
      if (hostedURL) {
        const receipt = document.createElement("a");
        receipt.className = "invoice-receipt";
        receipt.href = hostedURL;
        receipt.target = "_blank";
        receipt.rel = "noopener noreferrer";
        receipt.referrerPolicy = "no-referrer";
        receipt.textContent = status === "paid" ? "View receipt ↗" : "View invoice ↗";
        actions.append(receipt);
      }
      head.append(state, date);
      total.append(amount, amountLabel);
      item.append(head, total, period, actions);
      ui.invoiceList.append(item);
    });
    const count = session.invoices.length;
    ui.invoiceEmpty.hidden = count > 0;
    ui.invoiceList.hidden = count === 0;
    if (!count) setEmptyState(ui.invoiceEmpty, "No invoices yet", "No signed-webhook-backed invoice records exist for this organization yet.");
    ui.invoiceMore.hidden = !session.invoiceNextPageToken;
    ui.invoiceMore.disabled = session.invoiceLoading || !session.invoiceNextPageToken;
    setSourceState(ui.invoiceState, count ? `${count} verified` : "No records", count ? "success" : "");
  }

  function acceptInvoicePage(response, pageToken = "", append = false) {
    const invoices = Array.isArray(response?.invoices) ? response.invoices : [];
    if (invoices.length > 25 || invoices.some((invoice) => !validInvoice(invoice))) {
      throw new ApiError("BillingService returned an invalid invoice page", 0, "invalid_response", "");
    }
    const existingIDs = append ? new Set(session.invoiceIds) : new Set();
    for (const invoice of invoices) {
      const id = stringValue(invoice.id);
      if (existingIDs.has(id)) throw new ApiError("BillingService returned a duplicate invoice", 0, "invalid_response", "");
      existingIDs.add(id);
    }
    const next = stringValue(response?.page?.nextPageToken);
    const seenTokens = append ? new Set(session.invoicePageTokens) : new Set();
    if (next && (next === pageToken || seenTokens.has(next) || next.length > 4096)) {
      throw new ApiError("BillingService returned a repeated invoice page cursor", 0, "invalid_response", "");
    }
    if (pageToken) seenTokens.add(pageToken);
    if (next) seenTokens.add(next);
    session.invoices = append ? [...session.invoices, ...invoices] : invoices;
    session.invoiceIds = existingIDs;
    session.invoicePageTokens = seenTokens;
    session.invoiceNextPageToken = next;
    renderInvoiceHistory();
  }

  function renderInvoicesResult(result) {
    if (result.status === "rejected") {
      resetInvoiceHistory(apiErrorMessage(result.reason, "The verified invoice projection is unavailable. No billing history was assumed."), "Unavailable", "error");
      ui.invoiceHistory.hidden = false;
      return;
    }
    try {
      acceptInvoicePage(result.value);
    } catch (error) {
      resetInvoiceHistory(apiErrorMessage(error, "The billing service returned invalid invoice history. No records were displayed."), "Invalid response", "error");
      ui.invoiceHistory.hidden = false;
    }
  }

  async function loadMoreInvoices() {
    const organizationId = session.organizationId;
    const pageToken = session.invoiceNextPageToken;
    if (!organizationId || !pageToken || session.invoiceLoading) return;
    session.invoiceLoading = true;
    ui.invoiceMore.disabled = true;
    ui.invoiceMore.textContent = "Loading…";
    try {
      const response = await apiRequest("invoices", { organizationId, page: { pageSize: 25, pageToken } });
      if (organizationId !== session.organizationId) return;
      acceptInvoicePage(response, pageToken, true);
    } catch (error) {
      if (organizationId !== session.organizationId) return;
      session.invoiceNextPageToken = "";
      ui.invoiceMore.hidden = true;
      setSourceState(ui.invoiceState, "Unavailable", "error");
      toast(apiErrorMessage(error, "More verified invoices could not be loaded."), "error");
    } finally {
      session.invoiceLoading = false;
      ui.invoiceMore.textContent = "Load more invoices";
      if (organizationId === session.organizationId) ui.invoiceMore.disabled = !session.invoiceNextPageToken;
    }
  }

  function activeCreditPack(pack) {
    const state = typeof pack?.state === "number" ? pack.state : stringValue(pack?.state).replace(/^BILLING_PLAN_STATE_/, "");
    const id = stringValue(pack?.id);
    const credits = int64Value(pack?.creditMicros);
    const maximum = int64Value(pack?.maximumQuantity);
    return Boolean(id && !id.startsWith("price_") && (state === 1 || state === "ACTIVE") && credits !== null && credits > 0n && maximum !== null && maximum > 0n && maximum <= 1000n && pack?.price);
  }

  async function refreshCreditPacks() {
    session.creditPacks = [];
    if (!session.subscriptionActive || !session.organizationId) {
      renderCreditPackControls();
      // Top-up settings are still read. GetCreditTopUpSettings needs only
      // organization membership, and an inactive subscription is one of the
      // things it REPORTS — as CREDIT_TOP_UP_BLOCK_REASON_SUBSCRIPTION_INACTIVE.
      // Skipping the call here left the panel saying the settings were
      // unavailable when the truth was that nobody had asked for them, which is
      // the difference between "we could not read it" and "we did not look".
      refreshCreditTopUp();
      return;
    }
    try {
      const response = await apiRequest("credit_packs", { organizationId: session.organizationId });
      const packs = Array.isArray(response.creditPacks) ? response.creditPacks : [];
      if (!packs.length || packs.some((pack) => !activeCreditPack(pack))) {
        throw new ApiError("The billing service returned an invalid prepaid catalog", 0, "invalid_response", "");
      }
      session.creditPacks = packs;
      renderCreditPackControls();
      // The top-up form offers these same packs, so it can only be filled in
      // once they are known.
      refreshCreditTopUp();
    } catch (error) {
      renderCreditPackControls(apiErrorMessage(error, "Prepaid credit packs are unavailable."));
      refreshCreditTopUp();
    }
  }

  function selectedCreditPack() {
    const id = stringValue(ui.creditPackSelect.value);
    return session.creditPacks.find((pack) => stringValue(pack.id) === id) || null;
  }

  function renderCreditPackControls(errorMessage = "") {
    const team = selectedTeam();
    const visible = Boolean(session.subscriptionActive && team);
    ui.creditPackForm.hidden = !visible;
    if (!visible) return;
    const previous = stringValue(ui.creditPackSelect.value);
    ui.creditPackSelect.replaceChildren();
    session.creditPacks.forEach((pack) => {
      const option = document.createElement("option");
      option.value = stringValue(pack.id);
      option.textContent = `${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)}`;
      ui.creditPackSelect.append(option);
    });
    if (session.creditPacks.some((pack) => stringValue(pack.id) === previous)) ui.creditPackSelect.value = previous;
    const controlReady = stringValue(session.creditControl?.teamId) === stringValue(team.id);
    const ready = Boolean(session.creditPacks.length && stripeConfigured() && controlReady && !checkoutOpening);
    ui.creditPackSelect.disabled = !ready;
    ui.creditPackQuantity.disabled = !ready;
    ui.creditPackSubmit.disabled = !ready;
    setFieldError(ui.creditPackError, errorMessage || (!stripeConfigured()
      ? "Secure checkout is not configured in this deployment."
      : !controlReady
        ? "The team credit control is unavailable; purchases remain fail-closed."
        : session.creditPacks.length ? "" : "No prepaid packs are available."));
    updateCreditPackSummary();
  }

  function updateCreditPackSummary() {
    const pack = selectedCreditPack();
    if (!pack) {
      ui.creditPackSummary.textContent = "Select a prepaid pack.";
      ui.creditPackQuantity.removeAttribute("max");
      return;
    }
    const maximum = int64Value(pack.maximumQuantity) || 1n;
    ui.creditPackQuantity.max = maximum.toString();
    const quantity = int64Value(ui.creditPackQuantity.value) || 0n;
    const valid = quantity > 0n && quantity <= maximum;
    const totalCredits = valid ? (int64Value(pack.creditMicros) || 0n) * quantity : 0n;
    ui.creditPackSummary.textContent = valid
      ? `${formatCanonicalMoney(pack.price)} each · ${formatCredits(totalCredits)} added to ${stringValue(selectedTeam()?.name) || "this team"}`
      : `Enter a quantity from 1 to ${maximum.toString()}.`;
    ui.creditPackSubmit.disabled = !valid || !stripeConfigured() || checkoutOpening;
  }

  // Every ListTeams snapshot is stamped with a generation at ISSUE time and
  // checked at APPLY time: without it, whichever response arrived last won,
  // and a slow response issued before a delete finished could resurrect the
  // deleted team as a ghost row after a fresh empty list had already rendered.
  let teamsListGeneration = 0;
  function nextTeamsListGeneration() {
    teamsListGeneration += 1;
    return teamsListGeneration;
  }

  function renderTeamsResult(result, generation = teamsListGeneration) {
    if (generation !== teamsListGeneration) return;
    if (result.status === "fulfilled") {
      if (!session.organizationId) {
        // No organization is selected in THIS session. That is a local state,
        // not the server returning out-of-scope resources — judging the
        // roster against "" emptied it and flipped the shell to the
        // create-team screen mid-delete. Keep the roster as it stands.
        session.teamServiceAvailable = false;
        setStep("team", "error", "No organization", "No organization is selected in this session, so the team list cannot be verified. Retry the organization step.");
        return;
      }
      const teams = Array.isArray(result.value.teams) ? result.value.teams : [];
      const invalid = teams.some((team) => !stringValue(team?.id) || stringValue(team.organizationId) !== session.organizationId);
      if (invalid) {
        session.teamServiceAvailable = false;
        session.teams = [];
        renderTeamList();
        renderTeamSelector();
        setStep("team", "error", "Invalid response", "The team service returned a resource outside the current organization scope. No team data was displayed.");
        return;
      }
      session.teamServiceAvailable = true;
      session.teams = teams;
      renderTeamList();
      renderTeamSelector();
      renderSettingsBilling();
      session.teams.forEach((team) => {
        // A team still in LIFECYCLE_STATE_PENDING is awaiting the payment
        // webhook, so it is followed with GetTeam rather than provisioning status.
        if (lifecycleLabel(team.state) === "pending") startPendingTeamPoll(team.id, 1500);
        else startProvisioningPolling(team);
      });
      return;
    }
    // A transient list failure must not empty the roster: flashing an empty
    // list flips the router to the create screen and back. Keep the previous
    // roster on screen with the error on the step card instead.
    session.teamServiceAvailable = false;
    renderTeamList();
    renderSettingsBilling();
    setStep("team", "error", "Unavailable", apiErrorMessage(result.reason, "The team service is not ready. The last confirmed team list is still shown."));
  }

  // Creating a team is the paid action now, so the only prerequisites are an
  // active GitHub installation that reaches at least one repository. There is
  // no subscription/slot gate: RequestTeam drives the payment (embedded
  // Checkout for the first team, the saved card off-session for the rest).
  // The repository choice itself is part of the create form, not a gate.
  function updateTeamAction() {
    if (!session.teamServiceAvailable) {
      ui.teamInput.disabled = true;
      ui.teamSubmit.disabled = true;
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositoriesAvailable: session.repositoryServiceAvailable && session.repositories.length > 0
    });
    const ready = missing.length === 0 && !checkoutOpening;
    if (missing.length === 0) {
      const existing = session.teams.length ? `${session.teams.length} engineering ${session.teams.length === 1 ? "team is" : "teams are"} active. ` : "";
      setStep("team", "action", "Ready", `${existing}${savedCardChargeExpected()
        ? "Name your team and pick its repositories — the card on file is charged, and your Product Manager opens the conversation when the team is ready."
        : "Name your team and pick its repositories — payment opens in secure Stripe checkout, and your Product Manager opens the conversation when the team is ready."}`);
    } else {
      const requirements = missing.join(missing.length > 2 ? ", " : " and ").replace(/, ([^,]+)$/, ", and $1");
      setStep("team", "blocked", "Blocked", `Finish the ${requirements}, then name your team.`);
    }
    ui.teamInput.disabled = !ready;
    ui.teamSubmit.disabled = !ready;
    ui.repositoryList.querySelectorAll("input").forEach((checkbox) => { checkbox.disabled = !ready; });
    // The whole price block, not just the button. Whether this team costs
    // anything depends on the subscription, which lands after the first paint:
    // repainting only the button left the figure above it still charging for a
    // team the licence already covers.
    renderTeamSetupPricing();
  }

  function setAllStepsUnavailable(message, stateValue = "error") {
    const label = stateValue === "blocked" ? "Waiting" : "Unavailable";
    ["github", "repositories", "team"].forEach((name) => setStep(name, stateValue, label, message));
    ui.githubAction.disabled = true;
    if (ui.repositoryRefresh) ui.repositoryRefresh.disabled = true;
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.refresh.disabled = true;
  }

  function setStep(name, stateValue, label, message) {
    const card = document.querySelector(`[data-step="${name}"]`);
    if (!card) return;
    card.dataset.state = stateValue;
    card.setAttribute("aria-busy", stateValue === "loading" ? "true" : "false");
    card.querySelector("[data-step-state]").textContent = label;
    card.querySelector("[data-step-message]").textContent = message;
    updateProgressStep(name, stateValue, label);
  }

  function updateProgressStep(name, stateValue, label) {
    const step = ui.progressSteps.find((candidate) => candidate.dataset.progressStep === name);
    if (!step) return;
    step.dataset.state = stateValue;
    const detail = step.querySelector("small");
    if (detail) detail.textContent = label;
    renderProgressSummary();
  }

  function renderProgressSummary() {
    if (!ui.progressSummary) return;
    const states = Object.fromEntries(ui.progressSteps.map((step) => [step.dataset.progressStep, step.dataset.state]));
    // The GitHub organization, App installation, and repositories connect
    // automatically from sign-in, so onboarding is really two actions — sign in
    // and create a team. The headline always names the NEXT action, and the
    // summary states the concrete connected context instead of a generic promise.
    const autoConnected = ["organization", "github", "repositories"].every((name) => states[name] === "complete");
    if (ui.progressHeadline) {
      ui.progressHeadline.textContent = states.team === "complete"
        ? "Your team is live — give it work."
        : states.identity === "complete"
          ? "One step left: name your team."
          : "Sign in, then name your team.";
    }
    if (states.team === "complete") {
      ui.progressSummary.textContent = "Your team is live. Your Product Manager picks up the conversation in the workspace.";
    } else if (autoConnected) {
      const organization = stringValue(session.organizationName) || "Your organization";
      const count = session.connectedRepositoryCount;
      ui.progressSummary.textContent = `${organization} is connected${count ? ` with ${count} ${count === 1 ? "repository" : "repositories"}` : ""}. Your team starts working minutes after payment.`;
    } else {
      ui.progressSummary.textContent = "Your GitHub organization and repositories connect automatically.";
    }
  }

  // Step 3 is the payoff the funnel pulls toward: name what the paid team is
  // doing right now (goal-gradient — a visible end state pulls the user through
  // step 2; Kivetz et al. 2006).
  function updateShipStep() {
    if (!session.teams.length) { updateProgressStep("ship", "pending", "After payment"); return; }
    const provisioning = session.teams.some((team) => {
      const state = lifecycleLabel(team.state);
      if (["pending", ""].includes(state)) return true;
      return Boolean(team.provisioning) && launchContract && !launchContract.provisioningTerminal(team.provisioning);
    });
    if (provisioning) updateProgressStep("ship", "loading", "Provisioning…");
    else if (session.teams.some((team) => lifecycleLabel(team.state) === "active")) updateProgressStep("ship", "complete", "Shipping");
    else updateProgressStep("ship", "pending", "After payment");
  }

  function renderTeamList() {
    updateShipStep();
    ui.teamList.replaceChildren();
    ui.teamsEmpty.hidden = session.teams.length > 0;
    ui.teamList.hidden = session.teams.length === 0;
    session.teams.forEach((team) => {
      const row = document.createElement("div");
      row.className = "status-row";
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const detail = document.createElement("p");
      const side = document.createElement("div");
      side.className = "status-row-side";
      const status = document.createElement("span");
      name.textContent = stringValue(team.name) || "Unnamed team";
      const provisioning = launchContract.provisioningPresentation(team.provisioning || {});
      const namespace = stringValue(team.namespace) ? `Namespace ${team.namespace}` : "Runtime namespace pending";
      const removing = lifecycleLabel(team.state) === "deleting";
      const removalProgress = removing ? launchContract.provisioningProgress(team.provisioning || {}) : null;
      const provisioningDetail = removalProgress
        ? `${removalProgress.message}${removalProgress.percent >= 100 ? "" : "…"}`
        : provisioning.state
          ? `${capitalize(provisioning.label)} · ${provisioning.step}${provisioning.safeError ? ` · ${provisioning.safeError}` : ""}`
          : stringValue(team._pollingMessage);
      detail.textContent = provisioningDetail || namespace;
      status.className = "status-label";
      if (provisioning.failed) status.classList.add("failed");
      else if (!provisioning.terminal && provisioning.state) status.classList.add("planned");
      // "Running" is the command's state, not the customer's situation — and
      // so is "succeeded": once the command is terminal and healthy, the chip
      // speaks lifecycle ("active"), keeping command labels for in-flight
      // commands only.
      status.textContent = (removing && !provisioning.failed
        ? "removing"
        : (provisioning.terminal && !provisioning.failed ? lifecycleLabel(team.state) || provisioning.label : provisioning.label))
        || lifecycleLabel(team.state) || "created";
      copy.append(name, detail);
      side.append(status);
      const actions = renderTeamLifecycleActions(team);
      if (actions) side.append(actions);
      row.append(copy, side);
      ui.teamList.append(row);
    });
    // The team tiles are the same roster as doors: they repaint with every
    // list render, so a lifecycle change and its tile can never disagree.
    renderTeamTiles();
  }

  // The policy itself lives in the launch contract, where it is under test; an
  // empty row is how a stuck team becomes a support ticket, so the rule that
  // decides it is not something to keep in an untested DOM helper.
  function teamLifecycleControls(team) {
    if (!launchContract?.teamLifecycleControls) return [];
    return launchContract.teamLifecycleControls(lifecycleLabel(team?.state), team?.provisioning || {});
  }

  function lifecycleButton(action, teamId, label, variant, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button ${variant} button-small`;
    button.dataset.teamAction = action;
    button.dataset.teamId = teamId;
    button.textContent = label;
    button.disabled = Boolean(disabled);
    return button;
  }

  function renderTeamLifecycleActions(team) {
    const teamId = stringValue(team?.id);
    if (!teamId || !session.teamServiceAvailable) return null;
    const controls = teamLifecycleControls(team);
    if (!controls.length) return null;
    const busy = session.teamLifecycleBusy.has(teamId);

    // A pending delete replaces the row's controls with an explicit confirmation.
    if (session.teamLifecyclePendingDelete === teamId && controls.includes("delete")) {
      const container = document.createElement("div");
      container.className = "team-actions-confirm";
      container.setAttribute("role", "group");
      container.setAttribute("aria-label", "Confirm team deletion");
      const note = document.createElement("p");
      note.className = "team-actions-note";
      note.id = `team-delete-confirm-${teamId}`;
      const retrying = lifecycleLabel(team?.state) === "deleting";
      note.textContent = retrying
        ? `Retry removing “${stringValue(team.name) || "this team"}”? The previous attempt failed partway through.`
        : `Delete “${stringValue(team.name) || "this team"}” for good? Running agents stop and the workspace is deleted — this cannot be undone. Code, PRDs, and designs stay in your GitHub organization.`;
      const group = document.createElement("div");
      group.className = "team-actions";
      const confirmButton = lifecycleButton("delete-confirm", teamId, retrying ? "Confirm delete" : "Delete team", "button-danger", busy);
      confirmButton.setAttribute("aria-describedby", note.id);
      let ackField = null;
      if (!retrying) {
        // Deletion is the one action on this row with no undo, so the confirm
        // affordance demands the strongest signal of intent the row can carry:
        // the team's own name, typed. The match gates the button directly (no
        // re-render per keystroke - focus must survive typing) and
        // confirmTeamDeletion re-checks it, so a click on a stale or replayed
        // row can never delete on its own. A retry of an already-confirmed,
        // failed deletion keeps the two-step button: the name was already
        // typed once for this intent and the team is past the point of keeping.
        const expected = deleteConfirmationPhrase(team);
        const ackLabel = document.createElement("label");
        ackLabel.className = "team-actions-note";
        ackLabel.htmlFor = `team-delete-ack-${teamId}`;
        ackLabel.textContent = `Type “${expected}” to confirm.`;
        ackField = document.createElement("input");
        ackField.type = "text";
        ackField.id = `team-delete-ack-${teamId}`;
        ackField.className = "team-delete-ack";
        ackField.autocomplete = "off";
        ackField.spellcheck = false;
        ackField.disabled = busy;
        ackField.setAttribute("data-team-delete-ack", teamId);
        ackField.setAttribute("aria-describedby", note.id);
        confirmButton.disabled = true;
        ackField.addEventListener("input", () => {
          confirmButton.disabled = busy || ackField.value.trim() !== expected;
        });
        ackField.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !confirmButton.disabled) confirmButton.click();
        });
        container.append(note, ackLabel, ackField);
      } else {
        container.append(note);
      }
      group.append(confirmButton, lifecycleButton("delete-cancel", teamId, "Keep team", "button-quiet", busy));
      container.append(group);
      return container;
    }

    const actions = document.createElement("div");
    actions.className = "team-actions";
    if (controls.includes("suspend")) actions.append(lifecycleButton("suspend", teamId, "Suspend", "button-quiet", busy));
    if (controls.includes("resume")) {
      // The same call means two different things to the reader: bringing a
      // suspended team back, and retrying setup that failed.
      const label = lifecycleLabel(team?.state) === "suspended" ? "Resume" : "Retry setup";
      actions.append(lifecycleButton("resume", teamId, label, "button-secondary", busy));
    }
    if (controls.includes("delete")) {
      const removing = lifecycleLabel(team?.state) === "deleting";
      actions.append(lifecycleButton("delete", teamId, removing ? "Retry deletion" : "Delete", "button-danger", busy));
    }
    return actions;
  }

  function handleTeamLifecycleClick(event) {
    const button = event.target.closest("[data-team-action]");
    if (!button || !ui.teamList.contains(button)) return;
    const action = stringValue(button.dataset.teamAction);
    const teamId = stringValue(button.dataset.teamId);
    const team = session.teams.find((candidate) => stringValue(candidate.id) === teamId);
    if (!team) return;
    if (action === "suspend") { suspendTeamLifecycle(team); return; }
    if (action === "resume") { resumeTeamLifecycle(team); return; }
    if (action === "delete") { requestTeamDeletion(team); return; }
    if (action === "delete-cancel") { cancelTeamDeletion(); return; }
    if (action === "delete-confirm") { confirmTeamDeletion(team); return; }
  }

  function requestTeamDeletion(team) {
    const teamId = stringValue(team.id);
    if (!teamId || session.teamLifecycleBusy.has(teamId)) return;
    session.teamLifecyclePendingDelete = teamId;
    renderTeamList();
    (ui.teamList.querySelector("[data-team-delete-ack]")
      || ui.teamList.querySelector('[data-team-action="delete-confirm"]'))?.focus();
  }

  function cancelTeamDeletion() {
    if (!session.teamLifecyclePendingDelete) return;
    session.teamLifecyclePendingDelete = "";
    renderTeamList();
  }

  function suspendTeamLifecycle(team) {
    return runTeamLifecycleMutation(team, {
      procedure: "suspend_team",
      payload: { id: stringValue(team.id), reason: "Suspended from the customer console." },
      verify: (response) => stringValue(response?.team?.id) === stringValue(team.id) && stringValue(response.team.organizationId) === session.organizationId,
      successMessage: `Suspend confirmed by TeamService for “${stringValue(team.name) || "the team"}”. State refreshed from ListTeams.`,
      failureMessage: "The team was not suspended. No state change was assumed; it is safe to retry."
    });
  }

  function resumeTeamLifecycle(team) {
    return runTeamLifecycleMutation(team, {
      procedure: "resume_team",
      payload: { id: stringValue(team.id) },
      verify: (response) => stringValue(response?.team?.id) === stringValue(team.id) && stringValue(response.team.organizationId) === session.organizationId,
      successMessage: `Resume confirmed by TeamService for “${stringValue(team.name) || "the team"}”. State refreshed from ListTeams.`,
      failureMessage: "The team was not resumed. No state change was assumed; it is safe to retry."
    });
  }

  // The phrase the customer must type to release a deletion: the team's own
  // name. A team that somehow has no name falls back to a fixed word rather
  // than an empty string that would match an untouched field.
  function deleteConfirmationPhrase(team) {
    return stringValue(team?.name).trim() || "delete";
  }

  function confirmTeamDeletion(team) {
    // Re-check the typed acknowledgement at fire time, not only at render
    // time: the button's disabled state is UI, this is the gate.
    if (lifecycleLabel(team?.state) !== "deleting") {
      const ackField = ui.teamList.querySelector(`[data-team-delete-ack="${CSS.escape(stringValue(team.id))}"]`);
      if (!ackField || ackField.value.trim() !== deleteConfirmationPhrase(team)) return;
    }
    return runTeamLifecycleMutation(team, {
      procedure: "delete_team",
      payload: { id: stringValue(team.id) },
      successMessage: `Removing “${stringValue(team.name) || "the team"}” — backing up its workspace first. You can watch the progress here.`,
      failureMessage: "The team was not deleted. No state change was assumed; it is safe to retry."
    });
  }

  async function runTeamLifecycleMutation(team, { procedure, payload, verify, successMessage, failureMessage }) {
    const teamId = stringValue(team.id);
    if (!teamId || session.teamLifecycleBusy.has(teamId)) return;
    session.teamLifecycleBusy.add(teamId);
    session.teamLifecyclePendingDelete = "";
    renderTeamList();
    try {
      const response = await apiRequest(procedure, payload);
      if (verify && !verify(response)) {
        throw new ApiError("TeamService did not confirm the lifecycle change in the current organization scope", 0, "invalid_response", "");
      }
    } catch (error) {
      session.teamLifecycleBusy.delete(teamId);
      renderTeamList();
      toast(apiErrorMessage(error, failureMessage), "error");
      // A precondition/capacity/not-found error means the browser's view is
      // stale; re-read the authoritative list so controls reflect reality.
      if (error instanceof ApiError && ["failed_precondition", "resource_exhausted", "not_found"].includes(error.code)) {
        await reloadTeamsAfterLifecycle();
      }
      return;
    }
    session.teamLifecycleBusy.delete(teamId);
    // A server-confirmed delete is watched until a fresh list shows the team
    // gone, so its completion is announced even if the live observers die.
    if (procedure === "delete_team") watchedRemovals.set(teamId, stringValue(team.name));
    // The server confirmed the mutation; only the request/verify above may
    // fail it. Reflect only server truth: reload the authoritative team list
    // rather than synthesizing the post-mutation state in the browser — and
    // never let a reload/render hiccup be re-reported as "the team was not
    // deleted" after the server said it was.
    try {
      await reloadTeamsAfterLifecycle();
    } catch (error) {
      console.error("deep-navy: team list reload after a confirmed lifecycle change failed", error);
    }
    toast(successMessage, "success");
  }

  // A finished delete can be observed by up to five writers at once (the
  // lifecycle mutation, the status stream's terminal frame, the stream's
  // not_found, the fallback poll's terminal branch, and the poll's
  // not_found). Single-flight: concurrent callers share the one in-flight
  // reload instead of racing six ListTeams calls whose last arrival wins.
  let teamsReloadInFlight = null;
  let teamsReloadRetryTimer = null;
  // Removals the server has confirmed (DeleteTeam OK, or roster rows already
  // in LIFECYCLE_STATE_DELETING): when such a team is absent from a fresh
  // authoritative list, its removal finished — even if every live status
  // observer died in between (a transient list failure kills them all).
  const watchedRemovals = new Map();
  function reloadTeamsAfterLifecycle() {
    if (teamsReloadInFlight) return teamsReloadInFlight;
    window.clearTimeout(teamsReloadRetryTimer);
    teamsReloadInFlight = (async () => {
      try {
        session.teams.forEach((team) => {
          if (lifecycleLabel(team.state) === "deleting") watchedRemovals.set(stringValue(team.id), stringValue(team.name));
        });
        const teamsGeneration = nextTeamsListGeneration();
        const [teamsResult] = await Promise.allSettled([listAllTeams()]);
        renderTeamsResult(teamsResult, teamsGeneration);
        updateTeamAction();
        await refreshSelectedTeam();
        if (teamsResult.status === "fulfilled" && session.organizationId) {
          // Announce watched removals that vanished from the fresh list —
          // deduped by the same route key every other removal observer uses.
          watchedRemovals.forEach((name, id) => {
            if (session.teams.some((candidate) => stringValue(candidate.id) === id)) return;
            watchedRemovals.delete(id);
            announceTeamRemoved({ id, name });
          });
        }
        if (teamsResult.status === "rejected" && isRetryableApiError(teamsResult.reason)) {
          // A lifecycle change is settling server-side; a transient list
          // failure must not orphan it on a stale roster with nothing left
          // watching. Keep re-reading until a list lands (each success stops
          // the loop because only a rejected fetch re-arms it).
          teamsReloadRetryTimer = window.setTimeout(() => {
            if (session.accessToken) reloadTeamsAfterLifecycle();
          }, 5000);
        }
      } finally {
        teamsReloadInFlight = null;
      }
    })();
    return teamsReloadInFlight;
  }

  // The one door through which a finished removal is announced and routed.
  // Every observer of a completed delete funnels through here, keyed on the
  // team, so the customer sees exactly one "was removed" toast and one list
  // reload no matter how many observers fire (or how often a replayed stream
  // snapshot repeats the terminal record).
  function announceTeamRemoved(team) {
    const routeKey = `${stringValue(team?.id)}:removed`;
    if (session.provisioningRouteKey === routeKey) return;
    session.provisioningRouteKey = routeKey;
    toast(`Team “${stringValue(team?.name) || "the team"}” was removed.`, "success");
  }

  function routeTeamRemoved(team) {
    announceTeamRemoved(team);
    return reloadTeamsAfterLifecycle();
  }

  function renderTeamSelector(preferredId = "") {
    const previous = stringValue(preferredId) || session.selectedTeamId;
    ui.teamSelect.replaceChildren();
    if (!session.teams.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No teams available";
      ui.teamSelect.append(option);
      ui.teamSelect.disabled = true;
      session.selectedTeamId = "";
      ui.contextTeam.textContent = "Not selected";
      resetWorkspaceViews("Complete setup to create the first server-confirmed team.");
      renderCreditPackControls();
      return;
    }

    session.teams.forEach((team) => {
      const option = document.createElement("option");
      option.value = stringValue(team.id);
      const lifecycle = lifecycleLabel(team.state) || "created";
      // The option's label carries the lifecycle so the switcher says whether a
      // team is running; the NAME rides its own attribute, because the rail's
      // scope headings and the crumb echo the team and were echoing
      // "Beacon · active" as if that were what the customer called it.
      const name = stringValue(team.name) || "Unnamed team";
      option.dataset.teamName = name;
      option.textContent = `${name} · ${lifecycle}`;
      ui.teamSelect.append(option);
    });
    const selected = session.teams.find((team) => team.id === previous) || session.teams[0];
    session.selectedTeamId = stringValue(selected?.id);
    ui.contextTeam.textContent = stringValue(selected?.name) || session.selectedTeamId;
    ui.teamSelect.value = session.selectedTeamId;
    ui.teamSelect.disabled = false;
    renderSelectedTeamSummary();
    renderCreditPackControls();
  }

  function selectedTeam() {
    return session.teams.find((team) => stringValue(team.id) === session.selectedTeamId) || null;
  }

  function renderSelectedTeamSummary() {
    const team = selectedTeam();
    if (!team) {
      ui.contextTeam.textContent = "Not selected";
      ui.dashboardState.textContent = "Select a team to load its live workspace.";
      renderEngineerControl();
      renderRepositoryControl();
      renderContextRepositories();
      renderTeamHeadline();
      return;
    }
    const provisioning = launchContract?.provisioningPresentation(team.provisioning || {}) || {};
    // A deleting team's command label is "running" — but what is running is
    // the removal. Speak lifecycle for removals, command state otherwise.
    const removing = lifecycleLabel(team.state) === "deleting" && !provisioning.failed;
    const state = (removing ? "deleting" : provisioning.label) || lifecycleLabel(team.state) || "created";
    ui.contextTeam.textContent = stringValue(team.name) || stringValue(team.id);
    // The headline speaks about the team, not the resource: "newton is ready
    // to work", never "newton is succeeded" - a provisioning state is not a
    // sentence a colleague would say.
    const headlineByState = {
      succeeded: "is ready to work",
      ready: "is ready to work",
      running: "is being assembled",
      queued: "is being assembled",
      retrying: "is being assembled",
      failed: "hit a provisioning problem",
      suspended: "is paused",
      deleting: "is shutting down",
    };
    const spoken = headlineByState[String(state).toLowerCase()] || `is ${state}`;
    session.workspaceHeadlineSpoken = spoken;
    session.workspaceTeamName = stringValue(team.name) || "Your team";
    renderWorkspaceHeadline();
    renderEngineerControl();
    renderRepositoryControl();
    renderContextRepositories();
    // The floor's title comes from the team's own objective, which the roster
    // response already carries — so it paints on selection rather than waiting
    // for the workspace burst to come back.
    renderTeamHeadline();
  }

  // "Provisioning succeeded" is a past event, not a present state. A team can
  // finish provisioning and have its runtime die minutes later - which is
  // exactly what happened, while this page went on promising the customer
  // their team was ready to work. Only claim present readiness when the
  // runtime is currently streaming to us; otherwise say what we actually
  // know, which is that it has gone quiet.
  function renderWorkspaceHeadline() {
    if (!ui.dashboardState) return;
    const name = session.workspaceTeamName || "Your team";
    const spoken = session.workspaceHeadlineSpoken;
    if (!spoken) return;
    const claimsReady = spoken === "is ready to work";
    // Once the Product Manager has spoken, the conversation carries the
    // state of the team better than any summary sentence could - the
    // paragraph stands down rather than paraphrasing the thread above it.
    // Compare against the NORMALISED author, not the wire values. Every entry
    // has already been through conversationAuthorLabel(), which folds both the
    // numeric 2 and "CONVERSATION_AUTHOR_PRODUCT_MANAGER" down to
    // "product_manager" — so testing for either raw form never matched, this
    // stayed false for the life of the team, and the dashboard told a customer
    // "your Product Manager is writing the first message" for three hours while
    // that message sat in the transcript directly below it. Everywhere else in
    // this file already reads the normalised value; see pmReady.
    const pmHasSpoken = (session.conversationMessages || []).some((m) => m.author === "product_manager");
    if (pmHasSpoken) {
      ui.dashboardState.textContent = "";
      return;
    }
    if (claimsReady) {
      ui.dashboardState.textContent = `${name} is ready. Your Product Manager is writing the first message.`;
      return;
    }
    ui.dashboardState.textContent = `${name} ${spoken}.`;
  }

  async function refreshSelectedTeam() {
    const team = selectedTeam();
    const generation = ++session.workspaceGeneration;
    stopActivityStream();
    if (!team) {
      resetWorkspaceViews("Complete setup to create the first server-confirmed team.");
      return;
    }

    renderSelectedTeamSummary();
    if (["pending", "deleting"].includes(lifecycleLabel(team.state))) {
      // A team that is not active yet cannot answer roster, objective, economics,
      // or history calls — every versioned service correctly reports "team not
      // found" until provisioning completes. Firing those requests only surfaces
      // raw errors, so render guidance that leads to the next step instead.
      renderPendingTeamGuidance(team);
      // The waits a customer actually watches happen in this branch — the
      // first build, and the delete that used to freeze on a stale "retrying"
      // until a hard reload, because a team parked here had no live transport
      // at all. The status stream is the one call a not-yet-active team CAN
      // answer, so open it; the roster/economics calls below stay off.
      if (teamNeedsProvisioningStream(team)) startProvisioningStream(team.id, generation);
      return;
    }
    resetAgentView("Loading the server-confirmed team roster.", "Loading", "loading");
    resetEconomicsView("Loading the measured economics summary for this team.", "Loading", "loading");
    resetCreditBalanceView("Loading the authoritative team ledger balance.", "Loading", "loading");
    resetCreditControlView("Loading the current paid-period team budget.", "Loading", "loading");
    resetApprovalView("Loading pending decisions for this team.", "Loading", "loading");
    resetActivityView("Connecting to the team’s normalized activity stream.", "Connecting", "loading");
    session.sessionSpend = [];
    session.sessionSpendState = "loading";
    resetSessionHistoryView("Loading assignment-bound session history.", "Loading", "loading");
    resetWorkspaceHistoryView("Loading server-sanitized workspace changes.", "Loading", "loading");
    resetDeliveryHistoryView("Loading webhook-backed GitHub delivery records.", "Loading", "loading");
    syncProvisioningSnapshot(team);
    resetObjectiveView("Loading durable objectives for the selected team.");
    setSourceState(ui.objectiveState, "Loading", "loading");
    // The console subscribes with the team: the stream replays the recorded
    // conversation (the Product Manager's introduction included) and then
    // follows it live, healing itself the same way the activity stream does.
    resetConversationView("Connecting to the conversation with your Product Manager.", "Connecting", "loading", "Your Product Manager is getting set up");
    startActivityStream(team.id, generation);
    startConversationStream(team.id, generation);
    // Money moves whenever agents work, which is the whole time the team is
    // selected — so the ledger stream opens with the team, like activity, and
    // unlike provisioning, which only follows an operation still in flight.
    resetCreditMovementsView("The credit ledger stream is opening. Movements appear here as the platform settles them.", "loading", "Connecting", "loading");
    startCreditMovementStream(team.id, generation);
    // A settled team's provisioning is history, not a live operation — only
    // hold the status stream open while it still owes us a terminal state.
    if (teamNeedsProvisioningStream(team)) startProvisioningStream(team.id, generation);

    const [agentsResult, economicsResult, economicsBreakdownsResult, sessionSpendResult, creditBalanceResult, creditControlResult, approvalsResult, objectivesResult, sessionsResult, workspaceResult, issuesResult, pullRequestsResult, teamRepositoriesResult, teamInitiativesResult] = await Promise.allSettled([
      apiRequest("agents", { teamId: team.id, page: { pageSize: 50 } }),
      apiRequest("economics", { scopeType: "team", scopeId: team.id }),
      loadEconomicsBreakdowns(team.id),
      // The per-run cut of the same ledger. It is its own read because the
      // group-by selector on Economics chooses one dimension at a time and
      // Runs always needs this one.
      listAllEconomicsBreakdowns(team.id, SESSION_SPEND_GROUP),
      apiRequest("credit_balance", { organizationId: session.organizationId, teamId: team.id }),
      apiRequest("credit_control", { organizationId: session.organizationId, teamId: team.id }),
      apiRequest("approvals", { teamId: team.id, page: { pageSize: 100 } }),
      listAllObjectives(team.id),
      apiRequest("sessions", { teamId: team.id, page: { pageSize: 100 } }),
      apiRequest("workspace_changes", { teamId: team.id, afterSequence: "0", page: { pageSize: 100 } }),
      // Zero means the team's whole grant. Until platform-protos 350acd91 the
      // server required a repository id, so the floor had to make the customer
      // pick one and then showed that one repository's work as the team's.
      apiRequest("github_issues", { organizationId: session.organizationId, teamId: team.id, githubRepositoryId: "0", page: { pageSize: 100 } }),
      apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId: team.id, githubRepositoryId: "0", page: { pageSize: 100 } }),
      // Two Wave 0 reads, both in the same burst the floor already pays for:
      // this team's own repository grant, and every initiative under every
      // objective it owns. The second used to cost a request per objective,
      // which is why the floor never listed them.
      apiRequest("team_repositories", { teamId: team.id, page: { pageSize: 100 } }),
      apiRequest("initiatives", { teamId: team.id, page: { pageSize: 100 } })
    ]);
    if (generation !== session.workspaceGeneration || team.id !== session.selectedTeamId) return;
    renderAgentsResult(agentsResult, team.id);
    renderEconomicsResult(economicsResult, team.id);
    renderEconomicsBreakdownsResult(economicsBreakdownsResult);
    renderSessionSpendResult(sessionSpendResult, team.id);
    renderTeamCreditResults(creditBalanceResult, creditControlResult, team.id);
    renderApprovalsResult(approvalsResult, team.id);
    renderObjectivesResult(objectivesResult, team.id, generation);
    renderSessionHistoryResult(sessionsResult, team.id, "", false);
    renderWorkspaceHistoryResult(workspaceResult, team.id, "", false);
    // The grant is what the delivery records are validated against, so it is
    // accepted before they are — both came back in the same burst, so this is
    // an ordering of two settled results and not a second round trip.
    renderTeamRepositoriesResult(teamRepositoriesResult, team.id);
    const deliveryScopeForTeam = configureDeliveryRepository();
    if (deliveryScopeForTeam) {
      renderGitHubIssuesResult(issuesResult, team.id, deliveryScopeForTeam, "", false);
      renderGitHubPullRequestsResult(pullRequestsResult, team.id, deliveryScopeForTeam, "", false);
    }
    renderCreditPackControls();
    // A rejected read leaves the list null — "not read", which the panel says
    // out loud rather than rendering as "none".
    session.teamInitiatives = teamInitiativesResult.status === "fulfilled" && Array.isArray(teamInitiativesResult.value?.initiatives)
      ? teamInitiativesResult.value.initiatives
      : null;
    renderTeamInitiatives();
    // The instrument strip and the headline read what the renders above just
    // accepted, so they paint last, under the same generation guard they all
    // sat behind. The headline needs the objectives AND the credit control,
    // because the phase is derived from both.
    renderStatStrip();
    renderTeamHeadline();
  }

  // ── The floor's headline ────────────────────────────────────────────────
  // One team is one business objective, so the objective is the title of its
  // floor. The team's name is a label the customer chose for a slot; putting
  // it in the h1 made every team's floor read the same, and said nothing
  // about the work. Team.objective became readable in Wave 0 — before it, the
  // customer typed the sentence, the server accepted it, and it was discarded.
  //
  // The screen is phase-aware because a phase decides what the floor IS. A
  // team whose objective is not agreed yet has no measure to read and no
  // initiatives to list, so the running layout would be empty furniture; a
  // team that met its objective is idle rather than finished, and says so.

  // A sprite glyph, in a slot the design system styles by class. Colour never
  // carries type in this system — this is what does.
  function spriteIcon(id, size = 16) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "dn-icon");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.75");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${id}`);
    svg.append(use);
    return applyIconMotionTo(svg, id);
  }

  // ── Notices ─────────────────────────────────────────────────────────────
  // A Notice reports an event that happened somewhere else and is over, which
  // is why it carries a source, a time and a code; a Callout explains the state
  // of the thing you are looking at, and carries none of those. A failed build
  // is squarely the first: it happened in the provisioning pipeline, at a time,
  // with a code, and the screen is only reporting it.
  //
  // The DOM below is Notice.jsx element for element and class for class,
  // against the same vendored notify.css — because the severity is not the
  // site's to restate, and neither is the shape it arrives in.
  // The ladder is a hard dependency, not an optional enhancement. A local
  // fallback row here would be a second table with its own opinion about what a
  // severity looks like, which is the single thing the ladder exists to
  // prevent — so its absence yields nothing rather than an invention. Nothing
  // that reports a FACT depends on it: the stopped progress bar states its own
  // case in words either way, and only the severity dressing needs the table.
  function noticeShape(levelName) {
    return noticeLevels?.level?.(levelName) || null;
  }

  function buildNotice({ level: levelName = "info", title, body, code, source, time, actions }) {
    const shape = noticeShape(levelName);
    if (!shape) return null;
    const notice = document.createElement("div");
    notice.className = `dn-notice ${noticeLevels.levelClass("dn-notice", levelName)}`;
    // Danger interrupts a screen reader; everything quieter waits its turn.
    notice.setAttribute("role", shape.tone === "danger" ? "alert" : "status");
    const glyph = document.createElement("span");
    glyph.className = "dn-notice__glyph";
    glyph.append(spriteIcon(shape.glyph, 17));
    const main = document.createElement("div");
    main.className = "dn-notice__main";

    // The flag row is where "never colour alone" is paid for: the level's own
    // WORD sits here in every notice, so the surface survives grayscale(1) and
    // survives a reader who never sees the border at all.
    const flag = document.createElement("div");
    flag.className = "dn-notice__flag";
    const word = document.createElement("span");
    word.textContent = shape.word;
    flag.append(word);
    [stringValue(source), stringValue(time)].filter(Boolean).forEach((value) => {
      const meta = document.createElement("span");
      meta.className = "dn-notice__meta";
      const separator = document.createElement("span");
      separator.className = "dn-notice__sep";
      separator.textContent = "/";
      meta.append(separator, document.createTextNode(value));
      flag.append(meta);
    });
    main.append(flag);

    if (stringValue(title)) {
      const heading = document.createElement("div");
      heading.className = "dn-notice__title";
      heading.textContent = stringValue(title);
      main.append(heading);
    }
    if (stringValue(body)) {
      const copy = document.createElement("div");
      copy.className = "dn-notice__body";
      copy.textContent = stringValue(body);
      main.append(copy);
    }
    if (stringValue(code)) {
      const machine = document.createElement("code");
      machine.className = "dn-notice__code";
      machine.textContent = stringValue(code);
      main.append(machine);
    }
    const buttons = (actions || []).filter(Boolean);
    if (buttons.length) {
      const row = document.createElement("div");
      row.className = "dn-notice__actions";
      buttons.forEach((button) => row.append(button));
      main.append(row);
    }
    notice.append(glyph, main);
    return notice;
  }

  // A team whose last provisioning command died. A failed DELETE is excluded on
  // purpose: the team is still there, its remedy is "retry deletion" rather
  // than "retry setup", and the deletion surfaces already own that sentence.
  function teamProvisioningFailed(team) {
    const status = team?.provisioning;
    if (!status) return false;
    if (launchContract?.provisioningOperation?.(status) === launchContract?.PROVISIONING_OPERATION?.DELETE) return false;
    return launchContract?.provisioningPresentation?.(status)?.failed === true;
  }

  // The objective the floor is about: the one the record card has selected, or
  // the first the team owns. Never invented — a team with none returns null
  // and the interviewing phase takes over.
  function primaryObjective() {
    const objectives = session.objectiveListsByTeam.get(session.selectedTeamId) || [];
    const remembered = session.objectivesByTeam.get(session.selectedTeamId);
    return objectives.find((candidate) => stringValue(candidate.id) === stringValue(remembered?.id)) || objectives[0] || null;
  }


  // ======================================================================
  // RUNTIME READINESS — the live dot's evidence
  //
  // A provisioning state is a fact about the PAST. "succeeded" says the
  // runtime was created; it says nothing about whether the runtime is alive
  // now. This console used to render the pulsing live badge from
  // `state === active` alone, which is how a crashlooping runtime wore a live
  // indicator all morning: the indicator had outlived its truth and there was
  // no fact on the wire that could contradict it.
  //
  // TeamRuntimeHealth is that fact. It is the customer-safe half of the
  // operator snapshot — the namespace, the OpenClaw instance name and the
  // report id are stripped upstream and a contract test holds that boundary,
  // which is why nothing here reaches for them or works around their absence.
  //
  // Staleness is NOT computed here. The server marks a snapshot it considers
  // too old as DEGRADED with HEARTBEAT_STALE, so silence already arrives as
  // degraded rather than as its last happy value. A second clock in the
  // browser would only be able to disagree with it.
  // ======================================================================

  const RUNTIME_HEALTH_STATE = Object.freeze({ UNSPECIFIED: 0, READY: 1, DEGRADED: 2, SUSPENDED: 3, FAILED: 4 });

  // The bounded, credential-free reasons, in the customer's own terms. Every
  // one of them is a sentence about their team, never about our cluster.
  const RUNTIME_HEALTH_REASON_TEXT = Object.freeze({
    2: "it is still starting up",
    3: "it is running a previous generation of this team",
    4: "its gateway is not accepting work yet",
    5: "some of its agents are not ready",
    6: "it is suspended",
    7: "it could not be brought up",
    8: "it has stopped reporting in"
  });

  // The roster the runtime is measured against: the three standing roles —
  // Product Manager, Product Designer, Engineering Manager — plus this team's
  // engineers. The server-returned agent list is preferred when the workspace
  // has loaded one, because it is the roster the platform actually built.
  function teamRosterSize(team) {
    if (stringValue(team?.id) === session.selectedTeamId && Array.isArray(session.agents) && session.agents.length) {
      return session.agents.length;
    }
    const engineers = Number(team?.engineerCount || 0);
    if (!Number.isInteger(engineers) || engineers <= 0) return null;
    return 3 + engineers;
  }

  // Five verdicts, and "unobserved" is a real one. An absent snapshot means
  // the runtime has not reported yet, which is NOT the same as unhealthy and
  // must never be rendered as a failure — but it is also not evidence of
  // life, so it cannot buy a live indicator either. Saying so out loud is the
  // same rule the four empties follow: an absence is not a zero.
  function teamRuntimeReadiness(team) {
    const health = team?.runtimeHealth;
    if (!health) return { verdict: "unobserved" };
    const state = Number(health.state || 0);
    const reason = RUNTIME_HEALTH_REASON_TEXT[Number(health.reason || 0)] || "";
    if (state === RUNTIME_HEALTH_STATE.FAILED) return { verdict: "failed", reason };
    if (state === RUNTIME_HEALTH_STATE.SUSPENDED) return { verdict: "suspended", reason };
    if (state === RUNTIME_HEALTH_STATE.DEGRADED) return { verdict: "degraded", reason };
    if (state !== RUNTIME_HEALTH_STATE.READY) return { verdict: "unobserved" };
    // READY is the server's summary. gateway_ready and ready_agent_count are
    // the two figures that make it falsifiable, so they are checked rather
    // than taken on trust: a summary that disagrees with its own numbers is
    // the exact shape of the bug this field was added to end.
    if (health.gatewayReady !== true) {
      return { verdict: "degraded", reason: RUNTIME_HEALTH_REASON_TEXT[4] };
    }
    const roster = teamRosterSize(team);
    const ready = Number(health.readyAgentCount || 0);
    if (roster !== null && Number.isInteger(ready) && ready < roster) {
      return { verdict: "degraded", reason: RUNTIME_HEALTH_REASON_TEXT[5], ready, roster };
    }
    return { verdict: "ready", ready, roster };
  }

  // Five phases, every one derived from a fact the server confirmed. Nothing
  // here is a mode the console chose for itself.
  function teamPhase(team) {
    const lifecycle = lifecycleLabel(team?.state);
    // A removal in flight owns the row, including one that failed partway
    // through: its remedy is "retry deletion", not "retry setup".
    if (lifecycle === "deleting") return "halted";
    // A team whose setup died is not running, and there was no branch here that
    // said so. Terminal failure parks the team in `pending` with a dead
    // command, and `pending` is not in the halted list ahead of the objective
    // check — so a dead team fell all the way through to `running` and wore the
    // pulsing live badge. A team that is not running must never render as live,
    // and "failed" is not the same fact as "stopped": stopped is a state
    // somebody chose, and this one nobody did.
    if (lifecycle === "failed" || teamProvisioningFailed(team)) return "failed";
    if (["suspended", "suspending", "pending"].includes(lifecycle)) return "halted";
    // Out of credits stops work as surely as a suspension does, and the
    // customer experiences it the same way: the crew is not running.
    const spendable = signedInt64Value(session.creditControl?.effectiveAvailableMicros);
    if (session.creditControl?.customerPaused === true) return "halted";
    if (spendable !== null && spendable <= 0n) return "halted";
    const objectives = session.objectiveListsByTeam.get(stringValue(team?.id)) || [];
    if (!objectives.length) return "interviewing";
    // Met is not an end state: the team keeps its slot and stays idle until a
    // person archives it. A regressed proof is not met — it is a different
    // fact from never-proven and from proven, and all three are kept apart.
    if (objectives.every((objective) => objectiveAcceptanceState(objective) === "proven")) return "met";
    // "Running" is a claim about RIGHT NOW, so it is the one phase that needs
    // evidence from right now. Everything above this line is derived from
    // durable records; this is derived from what the runtime last reported.
    //
    // The phase changes, not just the badge: the console mockup binds
    // streaming, the runs panel and the team banner to phase() rather than to
    // a colour, so a team that is not ready lands in a different SHAPE of
    // screen — no live dot, no streaming claim — instead of the running screen
    // wearing a different hue.
    const readiness = teamRuntimeReadiness(team);
    if (readiness.verdict === "failed") return "runtime_failed";
    // A suspended runtime is the lifecycle's own "stopped", and halted already
    // says exactly that.
    if (readiness.verdict === "suspended") return "halted";
    if (readiness.verdict === "degraded") return "degraded";
    if (readiness.verdict === "unobserved") return "unreported";
    return "running";
  }

  // The measure the team exists for, as the objective's own KPI states it.
  // measurement_source reached the wire in Wave 0 and is the difference
  // between a measured objective and an asserted one, so it is named when the
  // platform has it and its absence is said out loud when it does not.
  function objectiveMeasure(objective) {
    const kpis = Array.isArray(objective?.kpis) ? objective.kpis : [];
    const kpi = kpis.find((candidate) => candidate && !candidate.guardrail) || kpis[0];
    if (!kpi || !stringValue(kpi.name)) return null;
    const number = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 7 });
    const unit = stringValue(kpi.unit);
    // "22%" and "54 seconds": a symbol closes up against the figure, a word
    // does not. Getting this wrong reads as a typo in a number.
    const withUnit = (value) => `${number.format(value)}${unit ? (/^[a-z]/i.test(unit) ? ` ${unit}` : unit) : ""}`;
    const target = Number.isFinite(Number(kpi.target)) ? withUnit(Number(kpi.target)) : "";
    const baseline = Number.isFinite(Number(kpi.baseline)) ? withUnit(Number(kpi.baseline)) : "";
    return {
      name: stringValue(kpi.name),
      baseline,
      target,
      direction: stringValue(kpi.direction).toLowerCase(),
      source: stringValue(kpi.measurementSource)
    };
  }

  const TEAM_PHASE_BADGE = Object.freeze({
    running: { label: "Running", className: "dn-badge dn-badge--live", live: true },
    interviewing: { label: "Interviewing", className: "dn-badge dn-badge--attention", live: false },
    met: { label: "Met · idle", className: "dn-badge dn-badge--success", live: false },
    halted: { label: "Stopped", className: "dn-badge dn-badge--danger", live: false },
    // The one phase that is a reported failure rather than a state of the work,
    // so it names a LEVEL and takes its glyph and its tone from the ladder
    // instead of restating either here. Word plus glyph: "Setup failed" beside
    // the ladder's own error mark survives filter: grayscale(1), and survives a
    // reader who never sees the badge's fill at all.
    failed: { label: "Setup failed", live: false, level: "error" },
    // The three runtime-readiness phases. Every one of them takes its tone and
    // its glyph from the ladder, exactly like `failed` does — this file has no
    // opinion about how loud any of them is, and there is no second tone table
    // here to disagree with NOTICE_LEVELS.
    //
    // The words are chosen against the ones already in use. "Stopped" is a
    // state somebody chose and nobody chose this. "Setup failed" is about
    // provisioning, which succeeded. So a runtime that died after a clean
    // setup says so in its own words, and a runtime that has simply not
    // reported says THAT, rather than borrowing either.
    runtime_failed: { label: "Runtime failed", live: false, level: "error" },
    degraded: { label: "Not ready", live: false, level: "warning" },
    // Level `info` on purpose: an unreported runtime is an absence, not a
    // fault, and the contract says in as many words that it must not be
    // rendered as a failure.
    unreported: { label: "Readiness not reported", live: false, level: "info" }
  });

  // The badge for a phase, with the readiness phases allowed to name what is
  // actually short. The LEVEL still comes from the table above, which still
  // takes its tone and glyph from the ladder — only the words are sharpened.
  function teamPhaseBadge(team, phase) {
    const badge = TEAM_PHASE_BADGE[phase];
    if (!badge) return TEAM_PHASE_BADGE.unreported;
    if (phase !== "degraded" && phase !== "runtime_failed") return badge;
    const readiness = teamRuntimeReadiness(team);
    if (!readiness.reason) return badge;
    return Object.assign({}, badge, { label: `${badge.label} · ${readiness.reason}` });
  }

  function renderTeamHeadline() {
    if (!ui.teamHeadline) return;
    const team = selectedTeam();
    const section = document.querySelector('.wview[data-view="overview"]');
    if (!team) {
      if (section) delete section.dataset.teamPhaseState;
      ui.teamHeadline.textContent = "Choose a team";
      if (ui.objectiveEyebrow) ui.objectiveEyebrow.textContent = "no team selected";
      if (ui.teamMeasure) ui.teamMeasure.hidden = true;
      if (ui.teamPhase) ui.teamPhase.hidden = true;
      if (ui.teamSysbar) ui.teamSysbar.hidden = true;
      if (ui.interview) ui.interview.hidden = true;
      return;
    }
    const phase = teamPhase(team);
    if (section) section.dataset.teamPhaseState = phase;
    const objective = primaryObjective();
    // Team.objective is the customer's own sentence; an objective record's
    // title is the PM's. Prefer the customer's, because it is what they asked
    // for — and fall back rather than showing nothing.
    const stated = stringValue(team.objective) || stringValue(objective?.title);

    if (phase === "interviewing") {
      ui.teamHeadline.textContent = stated || "The Product Manager is working out what this team is for";
      if (ui.objectiveEyebrow) ui.objectiveEyebrow.textContent = "day one";
    } else {
      ui.teamHeadline.textContent = stated || "This team has no objective on record";
      if (ui.objectiveEyebrow) ui.objectiveEyebrow.textContent = "the team's objective";
    }
    if (ui.interview) ui.interview.hidden = phase !== "interviewing";

    // The measure line.
    if (ui.teamMeasure) {
      const measure = phase === "interviewing" ? null : objectiveMeasure(objective);
      ui.teamMeasure.replaceChildren();
      if (!measure) {
        ui.teamMeasure.hidden = true;
      } else {
        ui.teamMeasure.hidden = false;
        const name = document.createElement("span");
        name.textContent = measure.name;
        ui.teamMeasure.append(name);
        if (measure.baseline) {
          const from = document.createElement("span");
          from.textContent = ` · baseline `;
          const value = document.createElement("b");
          value.textContent = measure.baseline;
          ui.teamMeasure.append(from, value);
        }
        if (measure.target) {
          const arrow = document.createElement("span");
          arrow.textContent = ` → target `;
          const value = document.createElement("b");
          value.textContent = measure.target;
          ui.teamMeasure.append(arrow, value);
        }
        const source = document.createElement("span");
        // An objective nobody can measure is an objective nobody can settle,
        // so the absence is stated rather than left blank.
        source.textContent = measure.source ? ` · ${measure.source}` : " · no measurement source connected";
        ui.teamMeasure.append(source);
      }
    }

    // The phase badge. Live gets the pulsing dot; the other three do not,
    // because only one of them is a claim about right now.
    if (ui.teamPhase) {
      const badge = teamPhaseBadge(team, phase);
      const shape = badge.level ? noticeShape(badge.level) : null;
      ui.teamPhase.className = badge.className || `dn-badge ${noticeLevels?.levelClass?.("dn-badge", badge.level) || ""}`.trim();
      ui.teamPhase.replaceChildren();
      if (badge.live) {
        const dot = document.createElement("span");
        dot.className = "dn-dot dn-dot--sm dn-dot--live dn-dot--pulse";
        dot.setAttribute("aria-hidden", "true");
        ui.teamPhase.append(dot);
      } else if (shape) {
        ui.teamPhase.append(spriteIcon(shape.glyph, 13));
      }
      ui.teamPhase.append(document.createTextNode(badge.label));
      ui.teamPhase.hidden = false;
    }

    renderTeamSystemBar(team, phase);
  }

  // The one banner a team may raise about itself. Met and stopped are the two
  // states where the crew is not working and a person has to decide something,
  // and neither is an error — so neither is a toast.
  function renderTeamSystemBar(team, phase) {
    if (!ui.teamSysbar) return;
    const name = stringValue(team?.name) || "This team";
    if (phase === "met") {
      ui.teamSysbar.className = "dn-sysbar dn-sysbar--success cs-sysbar";
      ui.teamSysbarGlyph.replaceChildren(spriteIcon("check-circle", 15));
      ui.teamSysbarMsg.textContent = `${name} met its objective and stopped`;
      ui.teamSysbarDetail.textContent = "Every objective on this team has a passing acceptance run on the default branch. It is idle, not archived — it keeps its slot until you archive it, and it will not resume on its own if the number drifts back.";
      ui.teamSysbar.hidden = false;
      return;
    }
    if (phase === "halted") {
      ui.teamSysbar.className = "dn-sysbar dn-sysbar--danger cs-sysbar";
      ui.teamSysbarGlyph.replaceChildren(spriteIcon("octagon-alert", 15));
      ui.teamSysbarMsg.textContent = `${name} is not working`;
      ui.teamSysbarDetail.textContent = haltedReason(team);
      ui.teamSysbar.hidden = false;
      return;
    }
    // The two runtime-readiness banners. Both take their tone and their glyph
    // from the ladder rather than naming a class here, so "how loud is this"
    // is answered in one place for the whole product.
    //
    // Three clauses at most, in order: what happened, what it means, what
    // happens next.
    if ((phase === "runtime_failed" || phase === "degraded") && noticeShape(TEAM_PHASE_BADGE[phase].level)) {
      const level = TEAM_PHASE_BADGE[phase].level;
      const shape = noticeShape(level);
      ui.teamSysbar.className = `dn-sysbar ${noticeLevels.levelClass("dn-sysbar", level)} cs-sysbar`;
      ui.teamSysbarGlyph.replaceChildren(spriteIcon(shape.glyph, 15));
      const readiness = teamRuntimeReadiness(team);
      const because = readiness.reason ? ` because ${readiness.reason}` : "";
      ui.teamSysbarMsg.textContent = phase === "runtime_failed"
        ? `${name}'s runtime is not running`
        : `${name} is not ready to work`;
      // A stale heartbeat is a different fact from a slow start, and saying
      // "up but not accepting work yet because it has stopped reporting in"
      // contradicts itself in one sentence. When the platform has stopped
      // hearing from the runtime it does not know whether it is up, and that
      // is what it says.
      const silent = readiness.reason === RUNTIME_HEALTH_REASON_TEXT[8];
      ui.teamSysbarDetail.textContent = phase === "runtime_failed"
        ? `The runtime this team's agents run in stopped${because}. Nothing is being filed, reviewed or merged, and the work already in your repositories is untouched. The platform brings it back by itself; if it stays down, this line is what to quote.`
        : silent
          ? "The platform has stopped hearing from this team's runtime, so it cannot say whether the crew is working. Nothing already in your repositories is affected. If it does not come back on its own, this line is what to quote."
          : `The runtime is up but not accepting work yet${because}${readiness.roster ? `, with ${readiness.ready} of ${readiness.roster} agents ready` : ""}. This is normally the minute after a start or a restart, and it clears on its own.`;
      ui.teamSysbar.hidden = false;
      return;
    }
    // An unreported runtime raises NO banner. It is an absence, not an event,
    // and the badge already says so; a system bar is for the whole product
    // having something to tell you, and "we have not heard yet" is not that.
    ui.teamSysbar.hidden = true;
  }

  // Why it stopped, from the record that stopped it — never a guess.
  function haltedReason(team) {
    const lifecycle = lifecycleLabel(team?.state);
    if (lifecycle === "suspended" || lifecycle === "suspending") return "The team is paused. Its agents are stopped and nothing new is filed, reviewed or merged; the issues and branches it opened stay in your repositories.";
    if (lifecycle === "pending") return "The team is waiting on a confirmed payment. Nothing provisions on a browser return — only on the signed webhook.";
    if (lifecycle === "deleting") return "The team is being removed. Its workspace is already gone; the issues, branches and pull requests it opened stay in your repositories.";
    if (session.creditControl?.customerPaused === true) return "Billable agent work is paused for this team, from its own budget control. Resume it in Economics.";
    return "The team is out of spendable credits. It stops between initiatives rather than leaving work half-written, so nothing is half-finished.";
  }

  // ── Initiatives under this objective ────────────────────────────────────
  // One row per initiative in the design system's objective grammar. The row
  // states its state THREE ways — the glyph, the badge word, and the row's own
  // border — which is why the meter under it stays ink: a fourth spend of the
  // same signal on the least readable element would be decoration.
  //
  // Fed by one team-scoped read. Before Wave 0 this needed a request per
  // objective, so the floor never showed it.
  function initiativeRowState(initiative) {
    if (timestampDate(initiative?.completedAt)) return "met";
    const status = stringValue(initiative?.status).toLowerCase();
    if (["blocked", "stopped", "cancelled", "canceled", "abandoned"].some((word) => status.includes(word))) return "blocked";
    if (timestampDate(initiative?.startedAt)) return "running";
    return "queued";
  }

  const INITIATIVE_ROW = Object.freeze({
    met: { glyph: "check", badge: "shipped", badgeClass: "dn-badge dn-badge--success", modifier: "dn-obj--met" },
    running: { glyph: "circle-dot", badge: "working", badgeClass: "dn-badge dn-badge--live", modifier: "dn-obj--running" },
    blocked: { glyph: "warning", badge: "blocked", badgeClass: "dn-badge dn-badge--danger", modifier: "dn-obj--blocked" },
    queued: { glyph: "circle-dot", badge: "queued", badgeClass: "dn-badge", modifier: "" }
  });

  function renderTeamInitiatives() {
    if (!ui.teamInitiatives) return;
    const rows = Array.isArray(session.teamInitiatives) ? session.teamInitiatives : null;
    ui.teamInitiatives.replaceChildren();
    if (ui.initiativesCount) ui.initiativesCount.textContent = rows ? String(rows.length) : "";
    if (rows === null) {
      // The read failed or has not happened. That is not "none" — it is a
      // reading that is missing, and the two must not look alike.
      setDataState(ui.teamInitiatives, "unavailable", "The initiative list for this team could not be read, so none is shown. The objective record behind “Every objective” carries the same initiatives, one objective at a time.");
      if (ui.initiativesPanel) ui.initiativesPanel.hidden = false;
      return;
    }
    if (!rows.length) {
      setDataState(ui.teamInitiatives, "pending", "The Product Manager proposes initiatives in the PRD, and files nothing in your repositories until you sign it off. Tell it what matters and the first ones appear here.", {
        action: { label: "Answer the Product Manager", view: "approvals" }
      });
      if (ui.initiativesPanel) ui.initiativesPanel.hidden = false;
      return;
    }
    rows.forEach((initiative) => {
      const state = initiativeRowState(initiative);
      const shape = INITIATIVE_ROW[state];
      const row = document.createElement("div");
      row.className = shape.modifier ? `dn-obj ${shape.modifier}` : "dn-obj";
      const check = document.createElement("span");
      check.className = "dn-obj__check";
      check.append(spriteIcon(shape.glyph, 15));
      const main = document.createElement("div");
      main.className = "dn-obj__main";
      const title = document.createElement("div");
      title.className = "dn-obj__title";
      title.textContent = stringValue(initiative.title) || "Untitled initiative";
      const badge = document.createElement("span");
      badge.className = shape.badgeClass;
      badge.textContent = shape.badge;
      title.append(badge);
      const measure = document.createElement("div");
      measure.className = "dn-obj__measure";
      // The hypothesis is what the initiative claims will move the number, so
      // it is the honest second line. Where there is none, the status the
      // platform recorded is; where there is neither, the row says so.
      measure.textContent = stringValue(initiative.hypothesis)
        || stringValue(initiative.description)
        || (stringValue(initiative.status) ? stringValue(initiative.status).replaceAll("_", " ") : "no hypothesis recorded");
      main.append(title, measure);
      row.append(check, main);
      ui.teamInitiatives.append(row);
    });
    if (ui.initiativesPanel) ui.initiativesPanel.hidden = false;
  }

  // ── This team's repository grant ────────────────────────────────────────
  // Not the organization's projection and not what the GitHub App can reach:
  // the grant this team works inside. It became readable in Wave 0. A
  // repository that has lost access still appears — the grant outlives the
  // access, and hiding it would make a broken team look correctly configured.
  function renderTeamRepositoriesResult(result, teamId) {
    if (!ui.teamRepos) return;
    ui.teamRepos.replaceChildren();
    if (result?.status === "rejected") {
      session.teamRepositories = null;
      setDataState(ui.teamRepos, "unavailable", "This team's repository grant could not be read. The organization's own selection is on the Settings screen; it is a wider set than this team's and must not be read as one.");
      return;
    }
    const repositories = Array.isArray(result?.value?.repositories) ? result.value.repositories : [];
    session.teamRepositories = repositories;
    if (repositories.some((repository) => stringValue(repository?.organizationId) !== session.organizationId)) {
      session.teamRepositories = null;
      setDataState(ui.teamRepos, "unavailable", "The grant returned a repository outside this organization, so none is shown. Nothing was changed.");
      return;
    }
    if (!repositories.length) {
      setDataState(ui.teamRepos, "unavailable", "This team holds no repositories of its own. It cannot read or write anything until an owner grants it one in Settings.");
      return;
    }
    repositories.forEach((repository) => {
      const granted = repository.accessState === 1 || stringValue(repository.accessState) === "REPOSITORY_ACCESS_STATE_ACCESSIBLE";
      const row = document.createElement("div");
      row.className = granted ? "cs-repo" : "cs-repo cs-repo--lost";
      const name = document.createElement("span");
      name.className = "cs-repo-name";
      name.textContent = `${stringValue(repository.owner)}/${stringValue(repository.name)}`;
      const dot = document.createElement("span");
      dot.className = granted ? "dn-dot dn-dot--sm dn-dot--success" : "dn-dot dn-dot--sm dn-dot--danger";
      dot.setAttribute("aria-hidden", "true");
      // Never colour alone: the dot and the word say the same thing.
      const access = document.createElement("span");
      access.className = "cs-repo-access";
      access.textContent = granted ? "reachable" : "no access";
      row.append(name, dot, access);
      ui.teamRepos.append(row);
    });
    const note = document.createElement("p");
    note.className = "cs-repo-note";
    note.textContent = "This team's own grant. Your other teams hold their own, and none of them can see this one's.";
    ui.teamRepos.append(note);
  }

  function renderPendingTeamGuidance(team) {
    const deleting = lifecycleLabel(team.state) === "deleting";
    // Terminal provisioning failure parks a team in `pending`, which is the
    // same lifecycle a team sits in while its payment is still being confirmed
    // — so this screen read one and said the other. It told a customer whose
    // build had died that the team "is awaiting payment confirmation", and then
    // told them to delete it and create it again. That advice is wrong twice
    // over: it is not what happened, and acting on it makes the customer pay a
    // second time for a fault that was ours. `resume` re-drives the same build
    // on the team they already have, so that is the remedy named here.
    const stopped = !deleting && teamProvisioningFailed(team);
    const name = stringValue(team.name) || "This team";
    const headline = deleting
      ? "This team is being removed. Its workspace data is no longer available."
      : stopped
        ? "Not available: this team's setup stopped before it finished."
        : "Available after payment completes and your team is provisioned.";
    const label = deleting ? "Removing" : stopped ? "Setup failed" : "Pending";
    // What happened, what it means, what happens next — in that order.
    ui.dashboardState.textContent = deleting
      ? `${name} is being removed.`
      : stopped
        ? `${name}'s setup stopped before it finished, so the team never started running. Retry setup below to run the same build again — you do not need to delete it or create another one.`
        : `${name} is awaiting payment confirmation. If you closed checkout before paying, delete this team and create it again — the roster, objective, and economics unlock the moment payment settles.`;
    resetAgentView(deleting ? headline : stopped ? "No agents were ever started for this team, because its setup did not finish." : "Your Product Manager, Engineering Manager, Designer, and engineers appear here once the team is provisioned.", label);
    resetEconomicsView(headline, label);
    resetCreditBalanceView(headline, label);
    resetCreditControlView(headline, label);
    resetApprovalView(headline, label);
    resetActivityView(deleting || stopped ? headline : "The live activity stream starts when your agents do.", label);
    resetConversationView(deleting || stopped ? headline : "Your Product Manager opens the conversation the moment the team finishes setting up.", label, "", deleting ? "No conversation" : stopped ? "No conversation" : "Your Product Manager is getting set up");
    resetSessionHistoryView(headline, label);
    resetWorkspaceHistoryView(headline, label);
    resetDeliveryHistoryView(headline, label);
    syncProvisioningSnapshot(team);
    resetObjectiveView(deleting || stopped ? headline : "Write your objective once the team is active — the Product Manager turns it into acceptance criteria for the engineers.");
    // A team without an active roster has no agent record to keep open - a
    // re-provision can replace every agent id.
    session.selectedAgentId = "";
    resetAgentDetailView(headline, label);
    setSourceState(ui.objectiveState, label);
    // A pending team has no readings; the strip hides itself.
    renderStatStrip();
  }

  function resetWorkspaceViews(message) {
    session.workspaceGeneration += 1;
    stopActivityStream();
    ui.dashboardState.textContent = message;
    hideProvisioningProgress();
    resetAgentView(message, "Waiting");
    resetEconomicsView(message, "Waiting");
    resetCreditBalanceView(message, "Waiting");
    resetCreditControlView(message, "Waiting");
    resetCreditMovementsView(message, "unavailable", "Waiting");
    resetApprovalView(message, "Waiting");
    renderCreditPackControls();
    resetActivityView(message, "Waiting");
    resetConversationView(message, "Waiting");
    resetSessionHistoryView(message, "Waiting");
    resetWorkspaceHistoryView(message, "Waiting");
    resetDeliveryHistoryView(message, "Waiting");
    resetObjectiveView(message);
    // An agent id is only meaningful inside its team's workspace.
    session.selectedAgentId = "";
    resetAgentDetailView(message);
    // A different team is a different grant and a different set of
    // initiatives. Both drop to "not read" rather than showing the last
    // team's, which is the one wrong answer neither panel may give.
    session.teamInitiatives = null;
    renderTeamInitiatives();
    renderTeamRepositoriesResult({ status: "rejected" }, "");
    renderStatStrip();
    renderTeamHeadline();
  }

  function setEmptyState(element, title, message) {
    if (!element) return;
    const heading = element.querySelector("strong");
    const copy = element.querySelector("p");
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = message;
  }

  // ---- DataState -----------------------------------------------------------
  // Empty is four different facts, so it is four different states. A grey
  // "nothing here" cannot tell a reading that has not started apart from one
  // that will never exist, and the difference is the whole question a
  // technical reader is asking. Only `pending` carries a hue and an action,
  // because it is the only one a person can do something about; `loading` is
  // lumen because it is a claim about right now.
  //
  // The system's blanket phrase for all four — the one that begins "No data"
  // and ends "available" — is banned outright, and a test enforces the ban by
  // searching for it, which is why this comment does not spell it.
  const DATA_STATE_KINDS = Object.freeze({
    pending: { flag: "Pending", modifier: "dn-dstate--attention" },
    uninstrumented: { flag: "Uninstrumented", modifier: "" },
    unavailable: { flag: "Unavailable", modifier: "" },
    loading: { flag: "Loading", modifier: "dn-dstate--live" }
  });

  // Returns the design system's own DataState node. `why` says which of the
  // four this is in the reader's own terms and what would change it; `query`
  // is the record the reading would have come from, in mono, so a support
  // conversation has a handle. `action` is offered on `pending` only.
  function dataState(kind, why, options = {}) {
    const shape = DATA_STATE_KINDS[kind] || DATA_STATE_KINDS.unavailable;
    const host = document.createElement("div");
    host.className = shape.modifier ? `dn-dstate ${shape.modifier}` : "dn-dstate";
    host.dataset.dstate = kind;
    const flag = document.createElement("span");
    flag.className = "dn-dstate__flag";
    flag.textContent = shape.flag;
    const copy = document.createElement("p");
    copy.className = "dn-dstate__why";
    copy.textContent = stringValue(why);
    host.append(flag, copy);
    const query = stringValue(options.query);
    if (query) {
      const line = document.createElement("span");
      line.className = "dn-dstate__query";
      line.textContent = query;
      host.append(line);
    }
    // Only the actionable kind gets a button. A button on "unavailable" is an
    // invitation to press something that cannot change the answer.
    if (kind === "pending" && options.action?.label && options.action?.view) {
      const act = document.createElement("div");
      act.className = "dn-dstate__act";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dn-btn dn-btn--secondary dn-btn--sm";
      button.dataset.viewLink = options.action.view;
      button.textContent = options.action.label;
      act.append(button);
      host.append(act);
    }
    return host;
  }

  // Replace a container's contents with one DataState. The container keeps its
  // own shape — an empty instrument still reads as an instrument.
  function setDataState(element, kind, why, options = {}) {
    if (!element) return;
    element.replaceChildren(dataState(kind, why, options));
    element.hidden = false;
  }

  function setSourceState(element, label, tone = "") {
    // Null-safe like setEmptyState/setFieldError: several state chips (the
    // objective panel's among them) left the shell in the workspace redesign,
    // and a render helper must tolerate the markup it is given.
    if (!element) return;
    element.textContent = label;
    if (tone) element.dataset.tone = tone;
    else delete element.dataset.tone;
  }

  function resetObjectiveView(message) {
    stopObjectiveDispatchPolling();
    // The objective form (and its empty-state card) left the shell when the
    // console became the only ask; every write to those elements is guarded
    // per element so the record elements below still render.
    if (ui.objectiveForm) ui.objectiveForm.hidden = true;
    if (ui.objectiveTitleInput) ui.objectiveTitleInput.disabled = true;
    if (ui.objectiveDescriptionInput) ui.objectiveDescriptionInput.disabled = true;
    if (ui.objectiveSubmit) ui.objectiveSubmit.disabled = true;
    ui.objectiveSelectControl.hidden = true;
    ui.objectiveSelect.disabled = true;
    ui.objectiveSelect.replaceChildren();
    ui.objectiveRecord.hidden = true;
    if (ui.objectiveEmpty) ui.objectiveEmpty.hidden = false;
    setEmptyState(ui.objectiveEmpty, "No objective loaded", message);
    ui.initiativeList.replaceChildren();
    setSourceState(ui.objectiveDispatchState, "Not reported");
    ui.objectiveDispatchDetail.textContent = "Waiting for the durable TPM handoff status.";
    ui.objectiveKpiList.replaceChildren();
    ui.objectiveKpiList.hidden = true;
    ui.objectiveKpiEmpty.hidden = false;
    setEmptyState(ui.objectiveKpiEmpty, "No measures yet", "Your Product Manager adds success measures as it breaks this objective down.");
    setSourceState(ui.objectiveKpiState, "Waiting");
    setFieldError(ui.objectiveError, "");
    setSourceState(ui.objectiveState, "Waiting");
    resetObjectivesView(message);
  }

  function objectiveDispatchStateLabel(value) {
    if (typeof value === "number") return ["", "queued", "delivering", "retrying", "delivered", "failed"][value] || "";
    return ({
      OBJECTIVE_DISPATCH_STATE_QUEUED: "queued",
      OBJECTIVE_DISPATCH_STATE_DELIVERING: "delivering",
      OBJECTIVE_DISPATCH_STATE_RETRYING: "retrying",
      OBJECTIVE_DISPATCH_STATE_DELIVERED: "delivered",
      OBJECTIVE_DISPATCH_STATE_FAILED: "failed"
    })[stringValue(value)] || "";
  }

  function objectiveDispatchFailureLabel(value) {
    if (typeof value === "number") return ["", "gateway unavailable", "TPM session unavailable", "delivery rejected", "retry exhausted"][value] || "";
    return ({
      OBJECTIVE_DISPATCH_FAILURE_REASON_GATEWAY_UNAVAILABLE: "gateway unavailable",
      OBJECTIVE_DISPATCH_FAILURE_REASON_TPM_SESSION_UNAVAILABLE: "TPM session unavailable",
      OBJECTIVE_DISPATCH_FAILURE_REASON_DELIVERY_REJECTED: "delivery rejected",
      OBJECTIVE_DISPATCH_FAILURE_REASON_RETRY_EXHAUSTED: "retry exhausted"
    })[stringValue(value)] || "";
  }

  function validObjectiveDispatch(dispatch) {
    const id = stringValue(dispatch?.dispatchId);
    const stateLabel = objectiveDispatchStateLabel(dispatch?.state);
    const attempt = Number(dispatch?.attempt);
    const updatedAt = timestampDate(dispatch?.updatedAt);
    const deliveredAt = dispatch?.deliveredAt ? timestampDate(dispatch.deliveredAt) : null;
    const failureReason = objectiveDispatchFailureLabel(dispatch?.failureReason);
    const safeError = stringValue(dispatch?.safeError);
    if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id) || !stateLabel || !Number.isInteger(attempt) || attempt < 0 || attempt > 2_147_483_647 || !updatedAt || safeError.length > 1000 || /[\u0000-\u001f\u007f]/.test(safeError)) return false;
    if (stateLabel === "delivered" && !deliveredAt) return false;
    if (dispatch?.deliveredAt && !deliveredAt) return false;
    if (stateLabel === "failed" && !failureReason) return false;
    return true;
  }

  // One vocabulary for every surface that shows a handoff. The "On now"
  // card and each record in the objectives view render this exact
  // presentation, so two screens can never describe one dispatch row with
  // two different sentences.
  function objectiveDispatchPresentation(dispatch) {
    if (!validObjectiveDispatch(dispatch)) {
      return { label: "Unavailable", tone: "error", sentence: "We could not read the handoff state for this objective, so nothing is assumed about it." };
    }
    const stateLabel = objectiveDispatchStateLabel(dispatch.state);
    const tone = stateLabel === "delivered" ? "success" : stateLabel === "failed" ? "error" : "loading";
    // Speak to the customer, not the operator. "Attempt 1 · Durable TPM
    // handoff" is dispatcher telemetry; what a customer needs to know is
    // whether their Product Manager has the objective, and if not, why.
    const deliveredAt = dispatch.deliveredAt ? timestampDate(dispatch.deliveredAt) : null;
    const failureReason = objectiveDispatchFailureLabel(dispatch.failureReason);
    const safeError = stringValue(dispatch.safeError);
    let sentence;
    if (stateLabel === "delivered") {
      sentence = `Your Product Manager has it${deliveredAt ? " — picked up " + relativeTime(deliveredAt) : ""}.`;
    } else if (stateLabel === "failed") {
      sentence = `Delivery to your Product Manager failed${failureReason ? ": " + failureReason : ""}.${safeError ? " " + safeError : ""}`;
    } else {
      // An in-flight handoff is rendered from a poll, and the honest
      // timestamp is when WE last read the server — not the row's own
      // updatedAt, which once froze at "updated now" while the dispatcher
      // delivered eight seconds later and moved on without us. A clock time
      // cannot go stale the way "now" does.
      const checked = session.objectiveDispatchCheckedAt;
      const checkedLabel = checked ? ` — last checked ${new Intl.DateTimeFormat(undefined, { timeStyle: "medium" }).format(checked)}` : "";
      sentence = `On its way to your Product Manager${checkedLabel}.${safeError ? " " + safeError : ""}`;
    }
    return { label: capitalize(stateLabel), tone, sentence };
  }

  function applyObjectiveDispatch(stateNode, detailNode, dispatch) {
    const presentation = objectiveDispatchPresentation(dispatch);
    setSourceState(stateNode, presentation.label, presentation.tone);
    if (detailNode) detailNode.textContent = presentation.sentence;
  }

  function renderObjectiveDispatch(dispatch) {
    applyObjectiveDispatch(ui.objectiveDispatchState, ui.objectiveDispatchDetail, dispatch);
  }

  function validObjectiveKpis(kpis) {
    if (!Array.isArray(kpis) || kpis.length > 100) return false;
    const ids = new Set();
    return kpis.every((kpi) => {
      const id = stringValue(kpi?.id);
      const name = stringValue(kpi?.name);
      const unit = stringValue(kpi?.unit);
      const direction = stringValue(kpi?.direction).toLowerCase();
      const baseline = Number(kpi?.baseline);
      const target = Number(kpi?.target);
      const safeText = (value) => value && !/[\u0000-\u001f\u007f]/.test(value);
      if (!id || id.length > 128 || ids.has(id) || !safeText(id) || !safeText(name) || name.length > 160 || !safeText(unit) || unit.length > 80 || !["increase", "decrease", "maintain"].includes(direction) || !Number.isFinite(baseline) || !Number.isFinite(target) || typeof kpi?.guardrail !== "boolean") return false;
      ids.add(id);
      return true;
    });
  }

  // One builder for a measure wherever it renders — the "On now" plan detail
  // and the objectives view records use this same item, the way the activity
  // surfaces share activityLedgerItem.
  function objectiveKpiItem(kpi) {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const detail = document.createElement("span");
    const number = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 7 });
    name.textContent = stringValue(kpi.name);
    detail.textContent = `${number.format(Number(kpi.baseline))} → ${number.format(Number(kpi.target))} ${stringValue(kpi.unit)} · ${stringValue(kpi.direction).toLowerCase()} · ${kpi.guardrail ? "guardrail" : "outcome KPI"}`;
    item.append(name, detail);
    return item;
  }

  function renderObjectiveKpis(kpis) {
    ui.objectiveKpiList.replaceChildren();
    if (!validObjectiveKpis(kpis)) {
      ui.objectiveKpiList.hidden = true;
      ui.objectiveKpiEmpty.hidden = false;
      setEmptyState(ui.objectiveKpiEmpty, "Measures unavailable", "We could not read the success measures for this objective. Nothing was changed.");
      setSourceState(ui.objectiveKpiState, "Invalid response", "error");
      return;
    }
    kpis.forEach((kpi) => ui.objectiveKpiList.append(objectiveKpiItem(kpi)));
    ui.objectiveKpiEmpty.hidden = kpis.length > 0;
    ui.objectiveKpiList.hidden = kpis.length === 0;
    if (!kpis.length) setEmptyState(ui.objectiveKpiEmpty, "No measures yet", "Your Product Manager adds success measures as it breaks this objective down.");
    setSourceState(ui.objectiveKpiState, kpis.length ? `${kpis.length} proposed` : "None yet", kpis.length ? "success" : "");
  }

  function renderObjectiveView(teamId, generation = session.workspaceGeneration) {
    const normalizedTeamId = stringValue(teamId);
    const objectives = session.objectiveListsByTeam.get(normalizedTeamId) || [];
    const remembered = session.objectivesByTeam.get(normalizedTeamId);
    const objective = objectives.find((candidate) => stringValue(candidate.id) === stringValue(remembered?.id)) || objectives[0] || null;
    if (objective) session.objectivesByTeam.set(normalizedTeamId, objective);
    else session.objectivesByTeam.delete(normalizedTeamId);
    setFieldError(ui.objectiveError, "");
    ui.initiativeList.replaceChildren();
    if (!objective) {
      ui.objectiveSelectControl.hidden = true;
      ui.objectiveSelect.disabled = true;
      ui.objectiveSelect.replaceChildren();
      ui.objectiveRecord.hidden = true;
      if (ui.objectiveEmpty) ui.objectiveEmpty.hidden = false;
      setEmptyState(ui.objectiveEmpty, "No objectives yet", "Describe what you want built. Your Product Manager turns it into issues and the engineers start work.");
      if (ui.objectiveForm) ui.objectiveForm.hidden = false;
      if (ui.objectiveTitleInput) ui.objectiveTitleInput.disabled = false;
      if (ui.objectiveDescriptionInput) ui.objectiveDescriptionInput.disabled = false;
      if (ui.objectiveSubmit) ui.objectiveSubmit.disabled = false;
      setSourceState(ui.objectiveState, "Ready", "success");
      return;
    }
    ui.objectiveSelect.replaceChildren();
    objectives.forEach((candidate) => {
      const option = document.createElement("option");
      option.value = stringValue(candidate.id);
      option.textContent = stringValue(candidate.title) || "Untitled objective";
      ui.objectiveSelect.append(option);
    });
    ui.objectiveSelect.value = stringValue(objective.id);
    ui.objectiveSelect.disabled = false;
    ui.objectiveSelectControl.hidden = false;
    if (ui.objectiveForm) ui.objectiveForm.hidden = false;
    if (ui.objectiveTitleInput) ui.objectiveTitleInput.disabled = false;
    if (ui.objectiveDescriptionInput) ui.objectiveDescriptionInput.disabled = false;
    if (ui.objectiveSubmit) ui.objectiveSubmit.disabled = false;
    if (ui.objectiveEmpty) ui.objectiveEmpty.hidden = true;
    ui.objectiveRecord.hidden = false;
    // The overview card carries the same check plate as the objective's own
    // record, from the same classifier, so the two can never disagree.
    if (ui.objectiveCheck) ui.objectiveCheck.dataset.state = objectivePlateState(objective, objectiveAcceptanceState(objective));
    ui.objectiveTitle.textContent = stringValue(objective.title) || "Untitled objective";
    ui.objectiveDescription.textContent = stringValue(objective.description) || "No description returned.";
    renderObjectiveDispatch(objective.dispatch);
    // Delivery advances on the server within seconds of submission; one fetch
    // at page load caught "queued" and kept saying it indefinitely. Poll the
    // dispatch state while any handoff is still in flight, the same way
    // provisioning progress is polled.
    if (objectiveDispatchPending(normalizedTeamId)) startObjectiveDispatchPolling(teamId, generation);
    renderObjectiveKpis(objective.kpis);
    setSourceState(ui.objectiveState, `${objectives.length} ${objectives.length === 1 ? "objective" : "objectives"}`, "success");
    loadInitiatives(objective, generation);
  }

  async function listAllObjectives(teamId) {
    const objectives = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("objectives", { teamId, page: { pageSize: 100, pageToken } });
      const pageObjectives = Array.isArray(response.objectives) ? response.objectives : [];
      if (pageObjectives.length > 100) throw new ApiError("ObjectiveService returned an oversized page", 0, "invalid_response", "");
      for (const objective of pageObjectives) {
        const id = stringValue(objective?.id);
        if (!id || stringValue(objective?.teamId) !== stringValue(teamId) || seenIds.has(id) || !validObjectiveDispatch(objective?.dispatch) || !validObjectiveKpis(objective?.kpis)) throw new ApiError("ObjectiveService returned an invalid or duplicate team objective", 0, "invalid_response", "");
        seenIds.add(id);
        objectives.push(objective);
      }
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return objectives;
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Objective pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Objective list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  function renderObjectivesResult(result, teamId, generation = session.workspaceGeneration) {
    if (generation !== session.workspaceGeneration || stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      session.objectiveListsByTeam.delete(stringValue(teamId));
      resetObjectiveView(apiErrorMessage(result.reason, "Durable objectives could not be loaded for this team."));
      setSourceState(ui.objectiveState, "Unavailable", "error");
      renderStatStrip();
      return;
    }
    session.objectiveListsByTeam.set(stringValue(teamId), result.value);
    session.objectiveDispatchCheckedAt = new Date();
    renderObjectiveView(teamId, generation);
    renderObjectivesView(teamId, generation);
    renderStatStrip();
  }

  // Delivery of an objective is a server-side state machine — queued →
  // delivering → delivered or failed — that usually finishes within seconds,
  // while this page used to render whichever state one initial fetch happened
  // to catch. While any handoff is in flight, re-read the objective list on a
  // timer, following the provisioning-poll pattern: pause while hidden, retry
  // only retryable errors, stop once every handoff is terminal.
  function objectiveDispatchTerminal(dispatch) {
    return ["delivered", "failed"].includes(objectiveDispatchStateLabel(dispatch?.state));
  }

  function objectiveDispatchPending(teamId) {
    const objectives = session.objectiveListsByTeam.get(stringValue(teamId)) || [];
    return objectives.some((objective) => !objectiveDispatchTerminal(objective?.dispatch));
  }

  function stopObjectiveDispatchPolling() {
    if (session.objectiveDispatchTimer) window.clearTimeout(session.objectiveDispatchTimer);
    session.objectiveDispatchTimer = null;
  }

  function startObjectiveDispatchPolling(teamId, generation, delay = 3000) {
    if (session.objectiveDispatchTimer) return;
    session.objectiveDispatchTimer = window.setTimeout(() => pollObjectiveDispatch(teamId, generation), delay);
  }

  async function pollObjectiveDispatch(teamId, generation) {
    session.objectiveDispatchTimer = null;
    if (generation !== session.workspaceGeneration || stringValue(teamId) !== session.selectedTeamId) return;
    if (!session.accessToken || document.visibilityState === "hidden") {
      startObjectiveDispatchPolling(teamId, generation, 5000);
      return;
    }
    try {
      const objectives = await listAllObjectives(teamId);
      if (generation !== session.workspaceGeneration || stringValue(teamId) !== session.selectedTeamId) return;
      const teamKey = stringValue(teamId);
      session.objectiveListsByTeam.set(teamKey, objectives);
      session.objectiveDispatchCheckedAt = new Date();
      // Repaint only what this poll is authoritative for: the handoff panel
      // for the selected objective, and the crew tiles that borrow the
      // dispatch record's word. A full renderObjectiveView here would refetch
      // initiatives every few seconds for no reason.
      const remembered = session.objectivesByTeam.get(teamKey);
      const objective = objectives.find((candidate) => stringValue(candidate.id) === stringValue(remembered?.id)) || objectives[0] || null;
      if (objective) {
        session.objectivesByTeam.set(teamKey, objective);
        renderObjectiveDispatch(objective.dispatch);
      }
      // The objectives view shows every handoff, not only the selected one:
      // update each record's dispatch line in place rather than rebuilding
      // the cards, which would collapse any drill-in the customer has open.
      refreshObjectiveCardDispatch(objectives);
      refreshCrewActivity();
    } catch (error) {
      if (generation !== session.workspaceGeneration || stringValue(teamId) !== session.selectedTeamId) return;
      // A failed poll leaves the last server-read state on screen — labeled
      // with the time it was actually read — and retries only errors worth
      // retrying, so an auth failure does not become a busy loop.
      if (isRetryableApiError(error)) startObjectiveDispatchPolling(teamId, generation, 10000);
      return;
    }
    if (objectiveDispatchPending(teamId)) startObjectiveDispatchPolling(teamId, generation);
  }

  function validInitiative(initiative, objectiveId) {
    const id = stringValue(initiative?.id);
    const title = stringValue(initiative?.title);
    const description = stringValue(initiative?.description);
    const hypothesis = stringValue(initiative?.hypothesis);
    const status = stringValue(initiative?.status);
    const priority = Number(initiative?.priority);
    const startedAt = initiative?.startedAt ? timestampDate(initiative.startedAt) : null;
    const completedAt = initiative?.completedAt ? timestampDate(initiative.completedAt) : null;
    return Boolean(
      id && id.length <= 128 && !/[\u0000-\u001f\u007f]/.test(id) &&
      stringValue(initiative?.objectiveId) === stringValue(objectiveId) &&
      title && title.length <= 200 && !/[\u0000\u007f]/.test(title) &&
      description && description.length <= 8192 && !/[\u0000\u007f]/.test(description) &&
      hypothesis.length <= 4096 && !/[\u0000\u007f]/.test(hypothesis) &&
      status && status.length <= 64 && /^[a-z][a-z0-9_-]*$/.test(status) &&
      Number.isInteger(priority) && priority >= 0 && priority <= 100 &&
      (!initiative?.startedAt || startedAt) && (!initiative?.completedAt || completedAt) &&
      (!startedAt || !completedAt || completedAt >= startedAt)
    );
  }

  async function listAllInitiatives(objectiveId) {
    const initiatives = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    for (let page = 0; page < 10; page += 1) {
      const response = await apiRequest("initiatives", { objectiveId, page: { pageSize: 100, pageToken } });
      const pageInitiatives = Array.isArray(response.initiatives) ? response.initiatives : [];
      if (pageInitiatives.length > 100) throw new ApiError("InitiativeService returned an oversized page", 0, "invalid_response", "");
      for (const initiative of pageInitiatives) {
        const id = stringValue(initiative?.id);
        if (!validInitiative(initiative, objectiveId) || seenIds.has(id)) throw new ApiError("InitiativeService returned an invalid or duplicate objective-scoped proposal", 0, "invalid_response", "");
        seenIds.add(id);
        initiatives.push(initiative);
      }
      const next = stringValue(response.page?.nextPageToken);
      if (!next) return initiatives;
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Initiative pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Initiative list exceeded the supported launch page limit", 0, "resource_exhausted", "");
  }

  // One builder for a proposal wherever it renders — the "On now" plan
  // detail and the objectives view records share it, the way the activity
  // surfaces share activityLedgerItem.
  function initiativeItem(initiative) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const description = document.createElement("p");
    const detail = document.createElement("span");
    title.textContent = stringValue(initiative.title) || "Untitled initiative";
    description.textContent = stringValue(initiative.description);
    detail.textContent = [`Priority ${Number(initiative.priority)}`, stringValue(initiative.status).replaceAll("_", " "), stringValue(initiative.hypothesis) ? `Hypothesis: ${stringValue(initiative.hypothesis)}` : "No hypothesis supplied"].join(" · ");
    item.append(title, description, detail);
    return item;
  }

  async function loadInitiatives(objective, generation = session.workspaceGeneration) {
    const objectiveId = stringValue(objective?.id);
    const teamId = stringValue(objective?.teamId);
    if (!objectiveId || !teamId) return;
    setSourceState(ui.initiativeState, "Loading", "loading");
    try {
      const initiatives = await listAllInitiatives(objectiveId);
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      if (initiatives.some((initiative) => stringValue(initiative?.objectiveId) !== objectiveId)) {
        throw new ApiError("Initiative service returned a record outside the current objective", 0, "invalid_response", "");
      }
      // The objectives view reads this same answer instead of asking again.
      session.initiativesByObjective.set(objectiveId, initiatives);
      renderObjectiveCardInitiatives(objectiveId);
      ui.initiativeList.replaceChildren();
      initiatives.forEach((initiative) => ui.initiativeList.append(initiativeItem(initiative)));
      setSourceState(ui.initiativeState, initiatives.length ? `${initiatives.length} ${initiatives.length === 1 ? "initiative" : "initiatives"}` : "No initiatives yet", initiatives.length ? "success" : "");
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      ui.initiativeList.replaceChildren();
      setSourceState(ui.initiativeState, "Unavailable", "error");
      toast(apiErrorMessage(error, "Initiatives could not be loaded for the submitted objective."), "error");
    }
  }

  async function createObjective(event) {
    event.preventDefault();
    // The whole function is driven by the objective form; on the form-less
    // shell there is nothing to read or disable, so bail before any deref.
    if (!ui.objectiveForm || !ui.objectiveTitleInput || !ui.objectiveDescriptionInput || !ui.objectiveSubmit) return;
    const team = selectedTeam();
    if (!team) return;
    if (lifecycleLabel(team.state) !== "active") {
      // The ObjectiveService only knows provisioned teams; submitting earlier
      // would surface a raw "team not found". Explain the order of operations
      // instead of letting the request fail.
      setFieldError(ui.objectiveError, "This team is not active yet. Finish payment (or delete and recreate the team), and submit the objective once provisioning completes.");
      return;
    }
    const form = new FormData(ui.objectiveForm);
    let title = stringValue(form.get("objectiveTitle"));
    const description = stringValue(form.get("objectiveDescription"));
    setFieldError(ui.objectiveError, "");
    if (!title) {
      // The customer answers one question; the title the API requires is the
      // first sentence (or line) of that answer, clipped to the API's bound.
      const firstLine = description.split(/\n/, 1)[0] || "";
      const firstSentence = firstLine.split(/(?<=[.!?])\s/, 1)[0] || firstLine;
      title = firstSentence.trim().replace(/[.!?]+$/, "").slice(0, 160).trim();
    }
    if (title.length < 3 || title.length > 160) {
      setFieldError(ui.objectiveError, "Open with a short sentence describing the outcome — that becomes the objective's name.");
      ui.objectiveDescriptionInput.focus();
      return;
    }
    if (description.length < 10 || description.length > 2000) {
      setFieldError(ui.objectiveError, "Describe the outcome and context in 10 to 2,000 characters.");
      ui.objectiveDescriptionInput.focus();
      return;
    }
    ui.objectiveTitleInput.disabled = true;
    ui.objectiveDescriptionInput.disabled = true;
    ui.objectiveSubmit.disabled = true;
    ui.objectiveSubmit.textContent = "Starting…";
    ui.objectiveSubmit.setAttribute("aria-busy", "true");
    setSourceState(ui.objectiveState, "Submitting", "loading");
    try {
      const fingerprint = `${team.id}:${title.toLowerCase()}:${description}`;
      const result = await apiRequest("create_objective", {
        teamId: team.id,
        title,
        description,
        idempotencyKey: mutationKeys.for("createObjective", fingerprint)
      });
      const objective = result.objective;
      if (!objective?.id || stringValue(objective.teamId) !== stringValue(team.id) || !validObjectiveDispatch(objective.dispatch) || !validObjectiveKpis(objective.kpis)) {
        throw new ApiError("Objective service did not return a resource in the selected team scope", 0, "invalid_response", "");
      }
      mutationKeys.clear("createObjective");
      const teamKey = stringValue(team.id);
      const existing = session.objectiveListsByTeam.get(teamKey) || [];
      session.objectiveListsByTeam.set(teamKey, [objective, ...existing.filter((candidate) => stringValue(candidate.id) !== stringValue(objective.id))]);
      session.objectivesByTeam.set(teamKey, objective);
      // The create response carries a server-confirmed dispatch row; for
      // freshness purposes that response IS a poll.
      session.objectiveDispatchCheckedAt = new Date();
      ui.objectiveForm.reset();
      renderObjectiveView(team.id, session.workspaceGeneration);
      toast(`The API confirmed the business objective and its durable handoff is ${objectiveDispatchStateLabel(objective.dispatch.state)}.`, "success");
    } catch (error) {
      const message = apiErrorMessage(error, "The objective was not confirmed as created. It is safe to retry with the same request.");
      setFieldError(ui.objectiveError, message);
      setSourceState(ui.objectiveState, "Not submitted", "error");
      ui.objectiveTitleInput.disabled = false;
      ui.objectiveDescriptionInput.disabled = false;
      ui.objectiveSubmit.disabled = false;
    } finally {
      ui.objectiveSubmit.textContent = "Start the work";
    ui.objectiveSubmit.removeAttribute("aria-busy");
    }
  }

  function selectObjective() {
    const team = selectedTeam();
    if (!team) return;
    const objective = (session.objectiveListsByTeam.get(stringValue(team.id)) || [])
      .find((candidate) => stringValue(candidate.id) === stringValue(ui.objectiveSelect.value));
    if (!objective) {
      setSourceState(ui.objectiveState, "Invalid selection", "error");
      return;
    }
    session.objectivesByTeam.set(stringValue(team.id), objective);
    renderObjectiveView(team.id, session.workspaceGeneration);
  }

  // ── The objectives view ─────────────────────────────────────────────────
  // One record per business objective, rendered from the list the workspace
  // refresh already holds. Each card carries the plan (dispatch state,
  // measures, initiatives) and the proof: the acceptance evidence line,
  // classified through the same objectiveAcceptanceState the instrument
  // strip counts with, so the two surfaces can never disagree. Proven,
  // regressed and never-run are three different facts and render as three
  // different states — regressed is never folded back into unproven.

  const acceptanceTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

  function evidenceTimeNode(date) {
    const time = document.createElement("time");
    time.dateTime = date.toISOString();
    time.textContent = acceptanceTimeFormat.format(date);
    return time;
  }

  // A check-run URL earns a link the same way the PRD reference does: https,
  // github.com, no credentials, no port, no query, no fragment, and a plain
  // multi-segment path. Anything else renders as text only — never a
  // nearly-right link on the word "proof".
  function acceptanceRunUrl(value) {
    const raw = stringValue(value);
    if (!raw || raw.length > 512) return "";
    let url;
    try {
      url = new URL(raw);
    } catch {
      return "";
    }
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash) return "";
    if (!/^\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)+$/.test(url.pathname)) return "";
    return url.toString();
  }

  // The acceptance observation renders its detail line only when every field
  // verifies: the deterministic check-run name, a full 40-hex head SHA, a
  // conclusion in GitHub's own vocabulary, and a real observation time. A
  // record that does not verify keeps its classification — the conclusion
  // alone carries that — and loses the detail line: fail closed, never
  // almost-right evidence.
  function acceptanceEvidence(objective) {
    const acceptance = objective?.acceptance;
    if (!acceptance) return null;
    const nameMatch = /^deep-navy\/objective-([0-9a-f]{8})[0-9a-f-]{0,64}$/.exec(stringValue(acceptance.checkRunName).toLowerCase());
    const headSha = stringValue(acceptance.headSha).toLowerCase();
    const conclusion = stringValue(acceptance.conclusion).toLowerCase();
    const observedAt = timestampDate(acceptance.observedAt);
    if (!nameMatch || !/^[0-9a-f]{40}$/.test(headSha) || !/^[a-z_]{1,40}$/.test(conclusion) || !observedAt) return null;
    return {
      checkLabel: `deep-navy/objective-${nameMatch[1]}`,
      sha: headSha.slice(0, 7),
      conclusion,
      observedAt,
      url: acceptanceRunUrl(acceptance.checkRunUrl)
    };
  }

  function objectiveEvidenceSection(objective, acceptanceState) {
    const section = document.createElement("div");
    section.className = "objective-evidence";
    section.dataset.state = acceptanceState;
    if (acceptanceState === "unproven") {
      // The three-part empty state: what belongs here, why it is empty — and
      // no button, because running the scenarios is the crew's work, not a
      // control to hand the customer.
      const copy = document.createElement("p");
      copy.className = "objective-evidence-copy";
      copy.textContent = "Every objective is proven by tagged acceptance scenarios running on the default branch. No acceptance run has reported for this objective yet — the crew wires the scenarios up as the work ships, and the first run fills this line in.";
      section.append(copy);
      return section;
    }
    const evidence = acceptanceEvidence(objective);
    const line = document.createElement("p");
    line.className = "objective-evidence-line";
    if (!evidence) {
      line.textContent = acceptanceState === "proven"
        ? "The passing acceptance observation could not be read, so its details are not shown."
        : "was proven · the failing acceptance observation could not be read, so its details are not shown.";
      section.append(line);
      return section;
    }
    if (acceptanceState === "proven") {
      line.append(`${evidence.checkLabel} · ${evidence.conclusion} on the default branch @ ${evidence.sha} · `, evidenceTimeNode(evidence.observedAt));
    } else {
      line.append(`was proven · regressed @ ${evidence.sha} · `, evidenceTimeNode(evidence.observedAt));
    }
    section.append(line);
    if (evidence.url) {
      const open = document.createElement("p");
      open.className = "objective-evidence-open";
      const link = document.createElement("a");
      link.href = evidence.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.referrerPolicy = "no-referrer";
      link.textContent = "Open the acceptance run";
      open.append(link);
      section.append(open);
    }
    return section;
  }

  function objectiveCardKpis(objective) {
    const block = document.createElement("div");
    block.className = "objective-card-block";
    const label = document.createElement("span");
    label.className = "lbl";
    label.textContent = "Measures";
    block.append(label);
    if (!validObjectiveKpis(objective.kpis)) {
      const note = document.createElement("p");
      note.textContent = "The success measures for this objective could not be read, so none are shown.";
      block.append(note);
      return block;
    }
    if (!objective.kpis.length) {
      const note = document.createElement("p");
      note.textContent = "No measures yet — your Product Manager adds them as it breaks this objective down.";
      block.append(note);
      return block;
    }
    const list = document.createElement("ol");
    objective.kpis.forEach((kpi) => list.append(objectiveKpiItem(kpi)));
    block.append(list);
    return block;
  }

  function objectiveCardInitiativesSection(objective) {
    const objectiveId = stringValue(objective.id);
    const block = document.createElement("div");
    block.className = "objective-card-block";
    const label = document.createElement("span");
    label.className = "lbl";
    label.textContent = "Initiatives";
    const state = document.createElement("span");
    state.className = "data-source-badge";
    const note = document.createElement("p");
    note.hidden = true;
    const list = document.createElement("ol");
    list.hidden = true;
    block.append(label, state, note, list);
    objectiveCardInitiatives.set(objectiveId, { state, note, list });
    renderObjectiveCardInitiatives(objectiveId);
    return block;
  }

  function renderObjectiveCardInitiatives(objectiveId, failed = false) {
    const nodes = objectiveCardInitiatives.get(stringValue(objectiveId));
    if (!nodes) return;
    const cached = session.initiativesByObjective.get(stringValue(objectiveId));
    nodes.list.replaceChildren();
    if (!Array.isArray(cached)) {
      nodes.list.hidden = true;
      nodes.note.hidden = false;
      nodes.note.textContent = failed
        ? "Initiatives could not be loaded for this objective. Reopen this screen to retry."
        : "Initiatives load when this screen opens.";
      setSourceState(nodes.state, failed ? "Unavailable" : "Waiting", failed ? "error" : "");
      return;
    }
    cached.forEach((initiative) => nodes.list.append(initiativeItem(initiative)));
    nodes.list.hidden = cached.length === 0;
    nodes.note.hidden = cached.length > 0;
    if (!cached.length) nodes.note.textContent = "No initiatives yet — proposals appear as your Product Manager breaks the objective down.";
    setSourceState(nodes.state, cached.length ? `${cached.length} ${cached.length === 1 ? "initiative" : "initiatives"}` : "None yet", cached.length ? "success" : "");
  }

  function refreshObjectiveCardDispatch(objectives) {
    (Array.isArray(objectives) ? objectives : []).forEach((objective) => {
      const nodes = objectiveCardDispatch.get(stringValue(objective?.id));
      if (nodes) applyObjectiveDispatch(nodes.state, nodes.detail, objective?.dispatch);
    });
  }

  // ── Per-objective drill-in ──────────────────────────────────────────────
  // The histories accept an objective filter, so each record can open the
  // sessions and code changes attributed to it — fetched on first open only,
  // rendered by the same ledger builder every other history uses, and failed
  // closed when the service answers outside the requested scope.

  function objectiveSessionEntries(result, teamId, objectiveId) {
    const records = Array.isArray(result?.sessions) ? result.sessions : [];
    if (records.length > 50) throw new ApiError("SessionService returned an oversized page", 0, "invalid_response", "");
    const seen = new Set();
    const entries = records.map((record) => {
      const entry = sessionHistoryEntry(record, teamId);
      // The filter travelled on the request; a record for another objective
      // is the service ignoring it, and the list fails closed rather than
      // captioning unrelated work with this objective's title.
      if (entry.objectiveId !== objectiveId) throw new ApiError("SessionService returned a session outside the requested objective scope", 0, "invalid_response", "");
      if (seen.has(entry.id)) throw new ApiError("SessionService returned a duplicate session", 0, "invalid_response", "");
      seen.add(entry.id);
      return entry;
    });
    entries.sort((left, right) => activityEntryTime(right) - activityEntryTime(left));
    return entries;
  }

  function objectiveChangeEntries(result, teamId, objectiveId) {
    const records = Array.isArray(result?.changes) ? result.changes : [];
    if (records.length > 50) throw new ApiError("WorkspaceService returned an oversized page", 0, "invalid_response", "");
    const seen = new Set();
    let previousSequence = 0n;
    const entries = records.map((record) => {
      const entry = workspaceHistoryEntry(record, teamId, previousSequence);
      if (entry.objectiveId !== objectiveId) throw new ApiError("WorkspaceService returned a change outside the requested objective scope", 0, "invalid_response", "");
      if (seen.has(entry.id)) throw new ApiError("WorkspaceService returned a duplicate change", 0, "invalid_response", "");
      seen.add(entry.id);
      previousSequence = entry.sequence;
      return entry;
    });
    return entries.slice().sort((left, right) => activityEntryTime(right) - activityEntryTime(left));
  }

  function renderObjectiveWorkList(nodes, result, toEntries, emptyMessage, failureMessage) {
    nodes.list.replaceChildren();
    nodes.list.hidden = true;
    nodes.note.hidden = false;
    if (result.status === "rejected") {
      nodes.note.textContent = apiErrorMessage(result.reason, failureMessage);
      return false;
    }
    try {
      const entries = toEntries(result.value);
      if (!entries.length) {
        nodes.note.textContent = emptyMessage;
        return true;
      }
      entries.forEach((entry) => nodes.list.append(activityLedgerItem(entry, "")));
      nodes.list.hidden = false;
      const more = Boolean(opaquePageToken(result.value?.page?.nextPageToken));
      nodes.note.hidden = !more;
      nodes.note.textContent = more ? "The newest records are shown; the full history stays on the record." : "";
      return true;
    } catch (error) {
      nodes.list.replaceChildren();
      nodes.list.hidden = true;
      nodes.note.hidden = false;
      nodes.note.textContent = apiErrorMessage(error, failureMessage);
      return false;
    }
  }

  async function loadObjectiveWork(objective, nodes, generation) {
    const teamId = stringValue(objective.teamId);
    const objectiveId = stringValue(objective.id);
    setSourceState(nodes.state, "Loading", "loading");
    const [sessionsResult, changesResult] = await Promise.allSettled([
      apiRequest("sessions", { teamId, objectiveId, page: { pageSize: 50 } }),
      apiRequest("workspace_changes", { teamId, objectiveId, afterSequence: "0", page: { pageSize: 50 } })
    ]);
    if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return false;
    const sessionsOk = renderObjectiveWorkList(nodes.sessions, sessionsResult, (value) => objectiveSessionEntries(value, teamId, objectiveId), "No sessions are attributed to this objective yet.", "Session history could not be loaded for this objective.");
    const changesOk = renderObjectiveWorkList(nodes.changes, changesResult, (value) => objectiveChangeEntries(value, teamId, objectiveId), "No code changes are attributed to this objective yet.", "Code changes could not be loaded for this objective.");
    setSourceState(nodes.state, sessionsOk && changesOk ? "Loaded" : "Unavailable", sessionsOk && changesOk ? "success" : "error");
    return sessionsOk && changesOk;
  }

  function objectiveWorkSection(objective) {
    const details = document.createElement("details");
    details.className = "objective-work";
    const summary = document.createElement("summary");
    const summaryLabel = document.createElement("span");
    summaryLabel.textContent = "Work on this objective";
    const state = document.createElement("span");
    state.className = "data-source-badge";
    state.textContent = "Loads on open";
    summary.append(summaryLabel, state);
    const buildList = (heading) => {
      const block = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = heading;
      const note = document.createElement("p");
      note.className = "objective-work-note";
      const list = document.createElement("ol");
      list.className = "customer-activity-list";
      list.hidden = true;
      block.append(title, note, list);
      return { block, nodes: { note, list } };
    };
    const sessions = buildList("Sessions");
    const changes = buildList("Code changes");
    const body = document.createElement("div");
    body.className = "objective-work-body";
    body.append(sessions.block, changes.block);
    details.append(summary, body);
    // Fetched on first open only — and a failed load re-arms, so closing and
    // reopening retries instead of freezing on the first error.
    let loading = false;
    let loaded = false;
    details.addEventListener("toggle", async () => {
      if (!details.open || loading || loaded) return;
      loading = true;
      loaded = await loadObjectiveWork(objective, { state, sessions: sessions.nodes, changes: changes.nodes }, session.workspaceGeneration);
      loading = false;
    });
    return details;
  }

  function objectiveCard(objective) {
    const objectiveId = stringValue(objective.id);
    const acceptanceState = objectiveAcceptanceState(objective);
    const item = document.createElement("li");
    item.className = "objective-card";
    const head = document.createElement("div");
    head.className = "objective-card-head";
    // The check plate says the proof state before the words do: kelp with a
    // tick that scales in for proven, a breathing lumen dot while the crew
    // is still working toward proof, coral with one shake for a proof that
    // stopped holding. The chip beside it carries the word, so the plate is
    // never the only cue.
    const check = document.createElement("span");
    check.className = "obj-check";
    check.dataset.state = objectivePlateState(objective, acceptanceState);
    check.setAttribute("aria-hidden", "true");
    const title = document.createElement("strong");
    title.className = "objective-card-title";
    title.textContent = stringValue(objective.title) || "Untitled objective";
    const proof = document.createElement("span");
    proof.className = "objective-proof";
    proof.dataset.state = acceptanceState;
    proof.textContent = acceptanceState === "proven" ? "Proven" : acceptanceState === "regressed" ? "Regressed" : "Not proven yet";
    head.append(check, title, proof);
    const satisfiedAt = timestampDate(objective.satisfiedAt);
    if (satisfiedAt) {
      const since = document.createElement("span");
      since.className = "objective-proof-since";
      since.append("since ", evidenceTimeNode(satisfiedAt));
      head.append(since);
    }
    const description = document.createElement("p");
    description.className = "objective-card-desc";
    description.textContent = stringValue(objective.description) || "No description returned.";
    const dispatchLine = document.createElement("p");
    dispatchLine.className = "onnow-state objective-card-dispatch";
    const dispatchState = document.createElement("span");
    const dispatchDetail = document.createElement("span");
    dispatchLine.append(dispatchState, " ", dispatchDetail);
    objectiveCardDispatch.set(objectiveId, { state: dispatchState, detail: dispatchDetail });
    applyObjectiveDispatch(dispatchState, dispatchDetail, objective.dispatch);
    item.append(head, description, dispatchLine, objectiveEvidenceSection(objective, acceptanceState), objectiveCardKpis(objective), objectiveCardInitiativesSection(objective), objectiveWorkSection(objective));
    return item;
  }

  function renderObjectivesView(teamId, generation = session.workspaceGeneration) {
    if (!ui.objectivesViewList || !ui.objectivesViewEmpty) return;
    if (generation !== session.workspaceGeneration) return;
    objectiveCardDispatch.clear();
    objectiveCardInitiatives.clear();
    const normalizedTeamId = stringValue(teamId);
    const objectives = session.objectiveListsByTeam.get(normalizedTeamId);
    ui.objectivesViewList.replaceChildren();
    if (!Array.isArray(objectives) || !objectives.length) {
      ui.objectivesViewList.hidden = true;
      ui.objectivesViewEmpty.hidden = false;
      if (Array.isArray(objectives)) {
        setEmptyState(ui.objectivesViewEmpty, "No objectives yet", "Each objective appears here with its measures, its initiatives, and the acceptance evidence that proves it on the default branch. Yours are set in conversation: tell your Product Manager what matters, and it becomes a record on this screen.");
        setSourceState(ui.objectivesViewState, "None yet");
      } else {
        setEmptyState(ui.objectivesViewEmpty, "No objectives loaded", "Objectives load with the rest of the workspace once an active team is selected.");
        setSourceState(ui.objectivesViewState, "Waiting");
      }
      return;
    }
    objectives.forEach((objective) => ui.objectivesViewList.append(objectiveCard(objective)));
    ui.objectivesViewEmpty.hidden = true;
    ui.objectivesViewList.hidden = false;
    // The header reading counts through the same classifier as the strip.
    const proven = objectives.filter((objective) => objectiveAcceptanceState(objective) === "proven").length;
    const regressed = objectives.filter((objective) => objectiveAcceptanceState(objective) === "regressed").length;
    setSourceState(ui.objectivesViewState, `${proven}/${objectives.length} proven${regressed ? ` · ${regressed} regressed` : ""}`, regressed ? "error" : proven ? "success" : "");
  }

  function resetObjectivesView(message) {
    session.initiativesByObjective.clear();
    objectiveCardDispatch.clear();
    objectiveCardInitiatives.clear();
    objectivesViewLoadKey = "";
    if (ui.objectivesViewList) {
      ui.objectivesViewList.replaceChildren();
      ui.objectivesViewList.hidden = true;
    }
    if (ui.objectivesViewEmpty) {
      ui.objectivesViewEmpty.hidden = false;
      setEmptyState(ui.objectivesViewEmpty, "No objectives loaded", message);
    }
    setSourceState(ui.objectivesViewState, "Waiting");
  }

  // The per-objective proposal lists are the one thing the workspace refresh
  // does not already hold, so they load on the click that opens this screen
  // — once per team and generation, capped, and never for an objective the
  // "On now" card's own load has already cached.
  async function ensureObjectivesViewWork() {
    const team = selectedTeam();
    if (!team || lifecycleLabel(team.state) !== "active") return;
    const generation = session.workspaceGeneration;
    const teamKey = stringValue(team.id);
    const objectives = session.objectiveListsByTeam.get(teamKey) || [];
    const missing = objectives.filter((objective) => !session.initiativesByObjective.has(stringValue(objective.id))).slice(0, 20);
    if (!missing.length) return;
    const key = `${teamKey}:${generation}`;
    if (objectivesViewLoadKey === key) return;
    objectivesViewLoadKey = key;
    missing.forEach((objective) => {
      const nodes = objectiveCardInitiatives.get(stringValue(objective.id));
      if (nodes) setSourceState(nodes.state, "Loading", "loading");
    });
    const results = await Promise.allSettled(missing.map((objective) => listAllInitiatives(stringValue(objective.id))));
    if (generation !== session.workspaceGeneration || teamKey !== session.selectedTeamId) return;
    let failures = 0;
    results.forEach((result, index) => {
      const objectiveId = stringValue(missing[index].id);
      if (result.status === "fulfilled") {
        session.initiativesByObjective.set(objectiveId, result.value);
        renderObjectiveCardInitiatives(objectiveId);
      } else {
        failures += 1;
        renderObjectiveCardInitiatives(objectiveId, true);
      }
    });
    // A failed or clipped fan-out re-arms, so the next entry retries the rest.
    if (failures || objectives.some((objective) => !session.initiativesByObjective.has(stringValue(objective.id)))) objectivesViewLoadKey = "";
  }

  // ── The console ─────────────────────────────────────────────────────────
  // The conversation with the team's Product Manager. Customer rows travel a
  // durable dispatch to the PM's session, and the server re-sends the same
  // message on every delivery-state change, so the chip beside each message is
  // the last state the server reported rather than a state this page froze.

  function conversationAuthorLabel(value) {
    if (typeof value === "number") return ["", "customer", "product_manager", "system"][value] || "";
    return ({
      CONVERSATION_AUTHOR_CUSTOMER: "customer",
      CONVERSATION_AUTHOR_PRODUCT_MANAGER: "product_manager",
      CONVERSATION_AUTHOR_SYSTEM: "system"
    })[stringValue(value)] || "";
  }

  function conversationDeliveryLabel(value) {
    if (typeof value === "number") return ["", "queued", "delivering", "delivered", "failed"][value] || "";
    return ({
      CONVERSATION_DELIVERY_STATE_QUEUED: "queued",
      CONVERSATION_DELIVERY_STATE_DELIVERING: "delivering",
      CONVERSATION_DELIVERY_STATE_DELIVERED: "delivered",
      CONVERSATION_DELIVERY_STATE_FAILED: "failed"
    })[stringValue(value)] || "";
  }

  function validConversationMessage(message) {
    const id = stringValue(message?.id);
    const author = conversationAuthorLabel(message?.author);
    const text = stringValue(message?.text);
    const sequence = typeof message?.sequence === "bigint" ? message.sequence : BigInt(message?.sequence || 0);
    const createdAt = timestampDate(message?.createdAt);
    const deliveryState = conversationDeliveryLabel(message?.deliveryState);
    const safeError = stringValue(message?.safeError);
    if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id) || !author || sequence <= 0n || !createdAt) return false;
    // Prose bound, not the send bound: the customer's own sends are capped at
    // 4,000 bytes, but the Product Manager's replies are recorded from the
    // session and may run longer. Bounded and control-character-free either way.
    if (!text || text.length > 16000 || /[\u0000\u007f]/.test(text)) return false;
    // Customer rows carry the delivery state machine; PM and SYSTEM rows are
    // recorded as delivered by contract, and anything else is fail-closed.
    if (author === "customer" && !deliveryState) return false;
    if (author !== "customer" && deliveryState !== "delivered") return false;
    if (safeError.length > 1000 || /[\u0000-\u001f\u007f]/.test(safeError)) return false;
    return true;
  }

  function acceptConversationMessage(message) {
    if (!validConversationMessage(message)) throw new ApiError("The conversation service returned an invalid message", 0, "invalid_response", "");
    const id = stringValue(message.id);
    const sequence = typeof message.sequence === "bigint" ? message.sequence : BigInt(message.sequence || 0);
    const author = conversationAuthorLabel(message.author);
    const text = stringValue(message.text);
    const createdAt = timestampDate(message.createdAt);
    const deliveryState = conversationDeliveryLabel(message.deliveryState);
    const safeError = stringValue(message.safeError);
    if (sequence > session.lastConversationSequence) session.lastConversationSequence = sequence;
    const partial = message.partial === true;
    const existing = session.conversationById.get(id);
    if (existing) {
      // The same sequence is re-sent for two reasons: a delivery-state
      // transition, and a reply that is still being written and has grown.
      // Both update the row in place, so the chip moves and the answer
      // lengthens without the message duplicating.
      //
      // Text only ever moves forward. The server refuses a shorter draft, and
      // refusing one here too means an out-of-order frame cannot rewind text
      // the customer has already read.
      existing.sequence = sequence;
      existing.deliveryState = deliveryState;
      existing.safeError = safeError;
      existing.createdAt = createdAt;
      existing.pending = false;
      existing.sendState = "";
      if (!partial || text.length >= stringValue(existing.text).length) existing.text = text;
      existing.partial = partial;
      return;
    }
    // The stream can outrun the send response: a replayed customer row that
    // matches an in-flight optimistic send IS that send, reconciled by the
    // server-assigned sequence instead of appearing twice.
    const pendingRow = author === "customer"
      ? session.conversationMessages.find((row) => row.pending && !row.id && row.author === "customer" && row.text === text)
      : null;
    if (pendingRow) {
      pendingRow.id = id;
      pendingRow.sequence = sequence;
      pendingRow.deliveryState = deliveryState;
      pendingRow.safeError = safeError;
      pendingRow.createdAt = createdAt;
      pendingRow.pending = false;
      pendingRow.sendState = "";
      session.conversationById.set(id, pendingRow);
      return;
    }
    const entry = { localId: "", id, sequence, author, text, createdAt, deliveryState, safeError, pending: false, sendState: "", partial };
    session.conversationById.set(id, entry);
    session.conversationMessages.push(entry);
    if (session.conversationMessages.length > 200) {
      const removed = session.conversationMessages.shift();
      if (removed?.id) session.conversationById.delete(removed.id);
    }
  }

  function productManagerName() {
    return agentDisplayName({ agentRole: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER" }) || "Your Product Manager";
  }

  // What the chip on a customer message says. Local states cover the gap
  // before the server has acknowledged the send at all; everything after that
  // is the server's own delivery state, re-sent on the stream as it changes.
  function conversationChip(entry) {
    if (entry.sendState === "sending") return { label: "Sending…", tone: "loading" };
    if (entry.sendState === "failed") return { label: "Not sent", tone: "error" };
    const state = entry.deliveryState;
    if (state === "delivered") return { label: "Delivered", tone: "success" };
    if (state === "failed") return { label: "Failed", tone: "error" };
    if (state === "delivering") return { label: "Delivering", tone: "loading" };
    if (state === "queued") return { label: "Queued", tone: "loading" };
    return { label: "Sending…", tone: "loading" };
  }

  // A Product Manager writes like a colleague: headings, lists, code, links.
  // The console printed all of it as one flat run of characters, so a PRD came
  // through as a wall of asterisks.
  //
  // This renderer builds DOM NODES and never assembles an HTML string, so
  // nothing an agent writes can become markup - the text of a link is text, and
  // a <script> an agent typed stays five visible characters. It covers the
  // constructs that actually appear and deliberately no more.
  const MARKDOWN_LINK = /^\[([^\]]{1,200})\]\(([^)\s]{1,2000})\)/;
  function safeHref(raw) {
    try {
      const url = new URL(raw, window.location.href);
      return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function appendInline(parent, text) {
    let rest = String(text);
    while (rest) {
      const code = rest.match(/^`([^`]{1,500})`/);
      if (code) {
        const element = document.createElement("code");
        element.textContent = code[1];
        parent.append(element);
        rest = rest.slice(code[0].length);
        continue;
      }
      const strong = rest.match(/^\*\*([^*]{1,500})\*\*/);
      if (strong) {
        const element = document.createElement("strong");
        appendInline(element, strong[1]);
        parent.append(element);
        rest = rest.slice(strong[0].length);
        continue;
      }
      const emphasis = rest.match(/^(?:\*([^*\n]{1,500})\*|_([^_\n]{1,500})_)/);
      if (emphasis) {
        const element = document.createElement("em");
        appendInline(element, emphasis[1] ?? emphasis[2]);
        parent.append(element);
        rest = rest.slice(emphasis[0].length);
        continue;
      }
      const link = rest.match(MARKDOWN_LINK);
      if (link) {
        const href = safeHref(link[2]);
        if (href) {
          const anchorElement = document.createElement("a");
          anchorElement.href = href;
          anchorElement.rel = "noopener noreferrer";
          anchorElement.target = "_blank";
          anchorElement.textContent = link[1];
          parent.append(anchorElement);
          rest = rest.slice(link[0].length);
          continue;
        }
      }
      // Nothing matched at this position: take one character and carry on, so
      // an unmatched * or [ is shown rather than swallowed.
      const next = rest.search(/[`*_[]/);
      const plain = next === -1 ? rest : (next === 0 ? rest.slice(0, 1) : rest.slice(0, next));
      parent.append(document.createTextNode(plain));
      rest = rest.slice(plain.length);
    }
  }
  function renderMarkdownInto(container, text) {
    const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
    let index = 0;
    const paragraph = [];
    const flushParagraph = () => {
      if (!paragraph.length) return;
      const element = document.createElement("p");
      paragraph.forEach((line, position) => {
        if (position) element.append(document.createElement("br"));
        appendInline(element, line);
      });
      container.append(element);
      paragraph.length = 0;
    };
    while (index < lines.length) {
      const line = lines[index];
      const fence = line.match(/^```(\w{0,20})\s*$/);
      if (fence) {
        flushParagraph();
        const body = [];
        index += 1;
        while (index < lines.length && !/^```\s*$/.test(lines[index])) {
          body.push(lines[index]);
          index += 1;
        }
        index += 1;
        const pre = document.createElement("pre");
        pre.className = "md-code";
        const code = document.createElement("code");
        code.textContent = body.join("\n");
        pre.append(code);
        container.append(pre);
        continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        const element = document.createElement(`h${Math.min(heading[1].length + 2, 6)}`);
        element.className = "md-heading";
        appendInline(element, heading[2]);
        container.append(element);
        index += 1;
        continue;
      }
      if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
        flushParagraph();
        container.append(document.createElement("hr"));
        index += 1;
        continue;
      }
      const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
      const numbered = line.match(/^\s*\d{1,3}[.)]\s+(.*)$/);
      if (bullet || numbered) {
        flushParagraph();
        const list = document.createElement(bullet ? "ul" : "ol");
        list.className = "md-list";
        while (index < lines.length) {
          const item = lines[index].match(bullet ? /^\s*[-*+]\s+(.*)$/ : /^\s*\d{1,3}[.)]\s+(.*)$/);
          if (!item) break;
          const entry = document.createElement("li");
          appendInline(entry, item[1]);
          list.append(entry);
          index += 1;
        }
        container.append(list);
        continue;
      }
      const quote = line.match(/^>\s?(.*)$/);
      if (quote) {
        flushParagraph();
        const block = document.createElement("blockquote");
        block.className = "md-quote";
        const inner = document.createElement("p");
        appendInline(inner, quote[1]);
        block.append(inner);
        container.append(block);
        index += 1;
        continue;
      }
      if (!line.trim()) {
        flushParagraph();
        index += 1;
        continue;
      }
      paragraph.push(line);
      index += 1;
    }
    flushParagraph();
  }

  // Markdown is the default because that is how the reply was written; the
  // choice is remembered so nobody has to re-pick it every visit.
  const conversationFormatKey = "deepnavy.conversation.format";
  function loadConversationFormat() {
    try {
      return window.localStorage.getItem(conversationFormatKey) === "raw" ? "raw" : "markdown";
    } catch { return "markdown"; }
  }
  function setConversationFormat(format) {
    session.conversationFormat = format === "raw" ? "raw" : "markdown";
    try { window.localStorage.setItem(conversationFormatKey, session.conversationFormat); } catch { /* private mode */ }
    renderConversationFormatControl();
    renderConversation();
  }
  function renderConversationFormatControl() {
    if (!ui.conversationFormat) return;
    const raw = session.conversationFormat === "raw";
    ui.conversationFormat.setAttribute("aria-pressed", raw ? "true" : "false");
    ui.conversationFormat.textContent = raw ? "Show formatted" : "Show Markdown source";
  }

  function renderConversation() {
    if (!ui.conversationThread) return;
    // SYSTEM rows are wake plumbing between the dispatcher and the runtime;
    // they advance the cursor but are never rendered as chat.
    const visible = session.conversationMessages.filter((entry) => entry.author !== "system");
    const sequenced = visible.filter((entry) => entry.sequence !== null).sort((a, b) => (a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0));
    const local = visible.filter((entry) => entry.sequence === null);
    const ordered = [...sequenced, ...local];
    const thread = ui.conversationThread;
    const nearBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 48;
    thread.replaceChildren();
    ordered.forEach((entry) => {
      const item = document.createElement("li");
      item.className = entry.author === "customer" ? "msg is-you" : "msg is-pm";
      const who = document.createElement("span");
      who.className = "msg-who";
      who.textContent = entry.author === "customer" ? "You" : `${productManagerName()} · Product Manager`;
      // Your own words are shown exactly as you typed them. The Product
      // Manager writes Markdown, so that is rendered - unless you ask to read
      // the source, which the toggle above the thread does.
      let bubble;
      if (entry.author === "customer" || session.conversationFormat === "raw") {
        bubble = document.createElement("p");
        bubble.className = entry.author === "customer" ? "msg-text" : "msg-text msg-raw";
        bubble.textContent = entry.text;
      } else {
        bubble = document.createElement("div");
        bubble.className = "msg-text msg-md";
        renderMarkdownInto(bubble, entry.text);
      }
      const meta = document.createElement("span");
      meta.className = "msg-meta";
      const time = document.createElement("time");
      time.textContent = entry.createdAt ? relativeTime(entry.createdAt) : "";
      if (entry.createdAt) time.dateTime = entry.createdAt.toISOString();
      meta.append(time);
      if (entry.author === "customer") {
        const chip = conversationChip(entry);
        const state = document.createElement("span");
        state.className = "msg-state";
        setSourceState(state, chip.label, chip.tone);
        meta.append(state);
      }
      // A reply still being written says so, right where it is being written.
      if (entry.partial) {
        item.classList.add("is-writing");
        const writing = document.createElement("span");
        writing.className = "msg-writing";
        writing.textContent = "still writing";
        meta.append(writing);
      }
      item.append(who, bubble, meta);
      if (entry.sendState === "failed") {
        const failure = document.createElement("p");
        failure.className = "msg-error";
        failure.textContent = entry.safeError || "The message was not confirmed as sent.";
        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "button button-secondary button-small";
        retry.dataset.conversationResend = entry.localId;
        retry.textContent = "Send again";
        item.append(failure, retry);
      } else if (entry.deliveryState === "failed") {
        const failure = document.createElement("p");
        failure.className = "msg-error";
        failure.textContent = entry.safeError || "Delivery to your Product Manager failed.";
        item.append(failure);
      }
      thread.append(item);
    });
    ui.conversationEmpty.hidden = ordered.length > 0;
    thread.hidden = ordered.length === 0;
    if (ordered.length === 0) renderConversationStage();
    if (ordered.length && nearBottom) thread.scrollTop = thread.scrollHeight;
    renderConversationTyping();
    // The composer's gate depends on what the stream has delivered (the
    // Product Manager's first row is what opens it), so every render
    // re-evaluates it.
    syncConversationComposer();
  }

  // Before the first visible message, the SYSTEM rows already on the stream
  // say exactly where team creation stands - the platform sends one to ask
  // engineering for the repository briefing, and a second to wake the Product
  // Manager once the briefing lands. Counting them needs no new plumbing and
  // cannot claim anything the server has not actually done.
  function renderConversationStage() {
    if (!ui.conversationEmpty) return;
    const team = selectedTeam();
    if (!team || lifecycleLabel(team.state) !== "active") return;
    const rows = conversationSystemRows();
    if (rows.length === 0) return;
    // The introduction embeds engineering's briefing between fixed markers.
    // When it is there, the customer reads the real thing while the Product
    // Manager writes; when the platform fell back to the plain greeting there
    // is nothing to quote, and the stage copy alone stays honest.
    const briefing = engineeringBriefing(rows);
    if (briefing) {
      setEmptyState(ui.conversationEmpty, "What engineering found",
        "The Engineering Manager's read of your repositories, verbatim. Your Product Manager opens the conversation with it in hand.");
      showConversationBriefing("Engineering briefing", briefing, true);
    } else if (rows.length === 1) {
      setEmptyState(ui.conversationEmpty, "Engineering is reading your repositories",
        "Your Engineering Manager is surveying the code before anyone speaks. Your Product Manager opens the conversation with what they find - usually a few minutes.");
      showConversationBriefing("Reading", briefingRepositories(rows).join("\n"), false);
    } else {
      setEmptyState(ui.conversationEmpty, "Your Product Manager is writing to you",
        "Engineering's briefing is in. The greeting arrives as it is written.");
      showConversationBriefing("Reading", briefingRepositories(rows).join("\n"), false);
    }
  }

  // The SYSTEM rows the stage counter reads also carry the platform's own
  // words. Two shapes are parsed and nothing else: the briefing request ends
  // by naming the team's repositories ("The team's repositories are: X, Y."),
  // and the Product Manager's introduction embeds engineering's briefing
  // between BRIEFING START/END markers. Both strings are written by
  // platform-api, so the parse can only ever show what the server said.
  function conversationSystemRows() {
    return session.conversationMessages.filter((entry) => entry.author === "system");
  }

  function briefingRepositories(rows) {
    for (const entry of rows) {
      const match = /The team's repositories are: (.+)\.\s*$/.exec(entry.text || "");
      if (match) return match[1].split(", ").filter(Boolean);
    }
    return [];
  }

  function engineeringBriefing(rows) {
    for (let index = rows.length - 1; index >= 0; index -= 1) {
      const text = rows[index].text || "";
      const start = text.indexOf("BRIEFING START\n");
      if (start === -1) continue;
      const end = text.indexOf("\nBRIEFING END", start);
      if (end === -1) continue;
      const briefing = text.slice(start + "BRIEFING START\n".length, end).trim();
      if (briefing) return briefing;
    }
    return "";
  }

  function showConversationBriefing(label, body, markdown) {
    if (!ui.conversationBriefing) return;
    const trimmed = (body || "").trim();
    if (!trimmed) {
      ui.conversationBriefing.hidden = true;
      return;
    }
    ui.conversationBriefingLabel.textContent = label;
    if (markdown) renderMarkdownInto(ui.conversationBriefingBody, trimmed);
    else {
      ui.conversationBriefingBody.replaceChildren();
      for (const line of trimmed.split("\n")) {
        const item = document.createElement("code");
        item.textContent = line;
        ui.conversationBriefingBody.append(item);
      }
    }
    ui.conversationBriefing.hidden = false;
  }

  // The shimmer row is a claim that the Product Manager is composing, so it is
  // only shown while something real vouches for it: the crew tile's own
  // liveness (a stream event moments ago), or a delivery the server confirmed
  // within the same window the crew tiles use for a fresh objective handoff.
  function renderConversationTyping() {
    if (!ui.conversationTyping) return;
    const team = selectedTeam();
    const visible = session.conversationMessages.filter((entry) => entry.author !== "system");
    const newest = visible[visible.length - 1];
    // A reply that is arriving is its own proof that one is coming, so the
    // shimmer stands down and lets the customer read what has landed.
    if (visible.some((entry) => entry.partial)) {
      ui.conversationTyping.hidden = true;
      return;
    }
    const awaitingReply = Boolean(team) && lifecycleLabel(team.state) === "active"
      && newest && newest.author === "customer" && newest.deliveryState === "delivered";
    if (!awaitingReply) {
      ui.conversationTyping.hidden = true;
      return;
    }
    const live = agentLiveness("AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER");
    const deliveredAt = newest.createdAt?.getTime();
    const recentDelivery = Number.isFinite(deliveredAt) && Date.now() - deliveredAt <= briefedWindowMs;
    const composing = live.state === "working" || live.state === "briefed" || recentDelivery;
    ui.conversationTyping.hidden = !composing;
    if (composing && ui.conversationTypingCopy) ui.conversationTypingCopy.textContent = `${productManagerName()} is working on a reply`;
  }

  // Honest composer state: the input explains why it is off instead of
  // sitting disabled without a reason - and it only opens when there is
  // actually someone to talk to. A provisioned team is not that moment:
  // engineering reads the repositories first, the Product Manager evaluates
  // the briefing, and only their opening message - the questions that map
  // business objectives to the code - makes "talk to your Product Manager"
  // true. A Product Manager row (even one still being written) is the proof.
  // If the introduction terminally fails, the composer opens anyway: a
  // broken wake-up must never lock the customer out of their own console.
  function syncConversationComposer() {
    if (!ui.conversationForm) return;
    const team = selectedTeam();
    const active = Boolean(team) && lifecycleLabel(team.state) === "active";
    const pmReady = session.conversationMessages.some((entry) => entry.author === "product_manager");
    const introFailed = session.conversationMessages.some(
      (entry) => entry.author === "system" && entry.deliveryState === "failed");
    const open = active && (pmReady || introFailed);
    ui.conversationInput.disabled = !open;
    ui.conversationSubmit.disabled = !open || session.conversationSending;
    if (session.conversationSending) {
      ui.conversationSubmit.setAttribute("aria-busy", "true");
      ui.conversationSubmit.textContent = "Sending…";
    } else {
      ui.conversationSubmit.removeAttribute("aria-busy");
      ui.conversationSubmit.textContent = "Send";
    }
    if (!team) ui.conversationHint.textContent = "Choose a team to talk to its Product Manager.";
    else if (!active) ui.conversationHint.textContent = "The conversation opens when your team finishes setting up.";
    else if (!open) ui.conversationHint.textContent = "Engineering is briefing your Product Manager. The conversation opens when they write to you with their questions.";
    else ui.conversationHint.textContent = "Goes straight to your Product Manager. They reply right here.";
    // The section stops INVITING before there is anyone to talk to: the
    // heading is a plain noun until the Product Manager has actually
    // written, and the activity log's "Talk to your Product Manager"
    // jump-link stays hidden on the same condition. Vocabulary is a promise;
    // these keep it only when it is true.
    if (ui.consoleTitle) ui.consoleTitle.textContent = open ? "Talk to your Product Manager" : "Your Product Manager";
    if (ui.activityConsoleLink) ui.activityConsoleLink.hidden = !open;
  }

  function resetConversationView(message, label = "Waiting", tone = "", title = "No conversation yet") {
    session.conversationMessages = [];
    session.conversationById.clear();
    session.lastConversationSequence = 0n;
    session.conversationSending = false;
    ui.conversationThread.replaceChildren();
    ui.conversationThread.hidden = true;
    ui.conversationTyping.hidden = true;
    ui.conversationEmpty.hidden = false;
    setEmptyState(ui.conversationEmpty, title, message);
    // The briefing block quotes SYSTEM rows this reset just dropped; a
    // switched team must never read the previous team's briefing.
    if (ui.conversationBriefing) ui.conversationBriefing.hidden = true;
    setFieldError(ui.conversationError, "");
    ui.conversationRetry.hidden = true;
    setSourceState(ui.conversationState, label, tone);
    syncConversationComposer();
  }

  // One send in flight at a time, retried with the same idempotency key so a
  // retry can never say the same thing twice. Keys are minted per composed
  // message (localId) rather than per text, so sending "yes" twice on purpose
  // is two messages while retrying a failed "yes" is still one.
  async function deliverConversationMessage(team, entry) {
    session.conversationSending = true;
    syncConversationComposer();
    try {
      const result = await apiRequest("send_team_message", {
        teamId: team.id,
        text: entry.text,
        idempotencyKey: mutationKeys.for("sendTeamMessage", `${team.id}:${entry.localId}`)
      });
      // A workspace switch mid-flight already cleared the thread this entry
      // lived in; the response belongs to nothing on screen.
      if (stringValue(team.id) !== session.selectedTeamId) return;
      const message = result?.message;
      if (!validConversationMessage(message) || stringValue(message.teamId) !== stringValue(team.id) || conversationAuthorLabel(message.author) !== "customer") {
        throw new ApiError("The conversation service did not confirm the message in the selected team scope", 0, "invalid_response", "");
      }
      const id = stringValue(message.id);
      const recorded = session.conversationById.get(id);
      if (recorded && recorded !== entry) {
        // The stream replayed the row before this response landed and
        // reconciled it into a different entry, so the optimistic row simply
        // retires. When the replay adopted THIS entry, it already carries the
        // server's identifiers and must not be removed.
        session.conversationMessages = session.conversationMessages.filter((row) => row !== entry);
      } else if (!recorded) {
        entry.id = id;
        entry.sequence = typeof message.sequence === "bigint" ? message.sequence : BigInt(message.sequence || 0);
        entry.deliveryState = conversationDeliveryLabel(message.deliveryState);
        entry.safeError = stringValue(message.safeError);
        entry.createdAt = timestampDate(message.createdAt);
        entry.pending = false;
        entry.sendState = "";
        session.conversationById.set(id, entry);
        if (entry.sequence > session.lastConversationSequence) session.lastConversationSequence = entry.sequence;
      }
      renderConversation();
    } catch (error) {
      if (stringValue(team.id) !== session.selectedTeamId) return;
      entry.sendState = "failed";
      entry.safeError = apiErrorMessage(error, "The message was not confirmed as sent. Sending again reuses the same request, so it cannot post twice.");
      renderConversation();
    } finally {
      session.conversationSending = false;
      syncConversationComposer();
    }
  }

  async function sendConversationMessage(event) {
    event.preventDefault();
    const team = selectedTeam();
    if (!team) return;
    if (lifecycleLabel(team.state) !== "active") {
      setFieldError(ui.conversationError, "This team is not set up yet. The conversation opens the moment provisioning completes.");
      return;
    }
    if (session.conversationSending) return;
    const text = stringValue(ui.conversationInput.value);
    setFieldError(ui.conversationError, "");
    if (!text) {
      setFieldError(ui.conversationError, "Write the message first.");
      ui.conversationInput.focus();
      return;
    }
    // The contract bounds a message at 4,000 bytes after trimming; measure
    // bytes rather than characters so multi-byte text cannot slip past the
    // textarea's character cap and bounce off the server.
    if (new TextEncoder().encode(text).length > 4000) {
      setFieldError(ui.conversationError, "Keep a single message under 4,000 characters, or split it in two.");
      ui.conversationInput.focus();
      return;
    }
    const entry = {
      localId: window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18),
      id: "",
      sequence: null,
      author: "customer",
      text,
      createdAt: new Date(),
      deliveryState: "",
      safeError: "",
      pending: true,
      sendState: "sending"
    };
    // Optimistic: the message appears the moment Send is pressed, and the
    // stream's replay of the recorded row reconciles it by sequence.
    session.conversationMessages.push(entry);
    renderConversation();
    ui.conversationInput.value = "";
    await deliverConversationMessage(team, entry);
  }

  function retryConversationMessage(event) {
    const button = event.target.closest("[data-conversation-resend]");
    if (!button) return;
    const team = selectedTeam();
    const entry = session.conversationMessages.find((row) => row.localId === button.dataset.conversationResend);
    if (!team || !entry || session.conversationSending) return;
    entry.sendState = "sending";
    entry.safeError = "";
    renderConversation();
    deliverConversationMessage(team, entry);
  }

  function resetAgentView(message, label, tone = "") {
    session.agentRoster = [];
    session.agents = [];
    renderRailCrew([]);
    ui.agentList.replaceChildren();
    ui.agentList.hidden = true;
    ui.agentsEmpty.hidden = false;
    setEmptyState(ui.agentsEmpty, label === "Loading" ? "Loading team roster" : "No roster loaded", message);
    setSourceState(ui.agentsState, label, tone);
  }

  // ---- the crew, in the rail ----------------------------------------------
  // The same roster the floor renders, in the shape a rail can hold: monogram,
  // role, and a live dot when the stream says that role is working. It is
  // built from the resolved canonical roles rather than from the raw response,
  // so a row can never carry a hue the floor's tile does not.
  //
  // A row is the agent's own record, so it opens the agent view — the surface
  // that deliberately has no rail door. That is the same relationship the crew
  // tiles have; the roster is a list of records, not a group of destinations.
  // Three engineers are three people. The canonical roster gives them one
  // shared label and distinct codes, so every surface that lists the crew
  // numbers them from the code rather than repeating "Engineer".
  function crewDisplayName(canonicalRole) {
    return /^E\d+$/.test(canonicalRole.code) ? `Engineer ${canonicalRole.code.slice(1)}` : canonicalRole.label;
  }

  function renderRailCrew(rows) {
    if (!ui.railCrew) return;
    const crew = Array.isArray(rows) ? rows : [];
    ui.railCrew.replaceChildren();
    if (ui.railCrewScope) ui.railCrewScope.hidden = crew.length === 0;
    ui.railCrew.hidden = crew.length === 0;
    if (!crew.length) return;
    crew.forEach((entry) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "dn-nav dn-bare cs-rail-crew-row";
      row.dataset.agentId = entry.agentId;
      row.dataset.agentOpen = "true";
      const plate = document.createElement("span");
      plate.className = "dn-avatar dn-avatar--xs";
      plate.dataset.roleKey = entry.roleKey;
      plate.setAttribute("aria-hidden", "true");
      plate.textContent = entry.code;
      const label = document.createElement("span");
      label.className = "dn-nav__label";
      label.textContent = entry.label;
      row.append(plate, label);
      // The dot is presence and nothing else. A quiet agent gets no mark
      // rather than a grey one, because a grey dot reads as a fifth state.
      if (entry.live) {
        const meta = document.createElement("span");
        meta.className = "dn-nav__meta";
        const dot = document.createElement("span");
        dot.className = "dn-dot dn-dot--sm dn-dot--live dn-dot--pulse";
        dot.setAttribute("aria-hidden", "true");
        const word = document.createElement("span");
        word.className = "visually-hidden";
        word.textContent = "working";
        meta.append(dot, word);
        row.append(meta);
      }
      ui.railCrew.append(row);
    });
  }

  function renderAgentsResult(result, teamId) {
    if (result.status === "rejected") {
      const message = apiErrorMessage(result.reason, "The AgentService is unavailable. No roster was assumed.");
      resetAgentView(message, "Unavailable", "error");
      return;
    }
    const agents = Array.isArray(result.value.agents) ? result.value.agents : [];
    if (agents.some((agent) => !stringValue(agent?.id) || stringValue(agent.teamId) !== stringValue(teamId))) {
      resetAgentView("The AgentService returned a roster outside the selected team scope. No agents were displayed.", "Invalid response", "error");
      return;
    }
    ui.agentList.replaceChildren();
    if (!agents.length) {
      resetAgentView("The service returned no agents for this team. Provisioning may still be in progress.", "Empty");
      return;
    }
    const resolvedRoles = agents.map((agent) => agentRoleContract?.canonicalAgentRole?.(agent.role) || null);
    // Singleton roles (PM, Designer, EM, and the three included engineers) must be
    // unique; the ENGINEER role is repeatable — one row per added engineer, up to
    // the fifty-engineer team maximum plus the three leadership roles.
    const singletonKeys = resolvedRoles.filter((role) => role && !role.repeatable).map((role) => role.key);
    if (resolvedRoles.some((role) => !role) || new Set(singletonKeys).size !== singletonKeys.length || agents.length > 53) {
      resetAgentView("The AgentService returned a role outside the canonical runtime contract. No roster was displayed.", "Invalid response", "error");
      return;
    }
    // Crew rows, not database rows. The customer hired a team; what they need
    // at a glance is who is on it and whether each person is ready — not agent
    // UUIDs and heartbeat timestamps, which read as telemetry about machines.
    // The identifiers still exist in the API responses for anyone debugging.
    let engineerOrdinal = 3;
    const railCrew = [];
    agents.forEach((agent, index) => {
      let canonicalRole = resolvedRoles[index];
      if (canonicalRole.repeatable) {
        engineerOrdinal += 1;
        canonicalRole = { ...canonicalRole, code: `E${engineerOrdinal}` };
      }
      // The roster reports lifecycle as a proto enum, which arrives as a number
      // over JSON; stringValue() turned that into "2" and neither branch matched,
      // so every agent read as not-active and no dot ever lit.
      const active = lifecycleLabel(agent.state) === "active";
      // The tile is a real door now, not a readout: a button that opens the
      // agent's own view. The id used to be discarded here; it rides the
      // tile's dataset so the click handler and the view router read the
      // same click without either trusting render order.
      const row = document.createElement("button");
      row.type = "button";
      row.className = active ? "crew-row is-on" : "crew-row";
      row.dataset.roleKey = canonicalRole.key;
      row.dataset.agentId = stringValue(agent.id);
      row.dataset.agentOpen = "true";
      const dot = document.createElement("i");
      dot.className = "crew-dot";
      dot.setAttribute("aria-hidden", "true");
      // The monogram plate: the role's code (PM, EM, PD, E1…) in the role's
      // own hue on its soft plate. Identity colour never appears without the
      // monogram that names the agent, and the paint is scoped by the same
      // role key the tile already carries. The liveness dot rides the
      // plate's corner, so presence and identity read as one mark.
      const monogram = document.createElement("span");
      monogram.className = "user-avatar crew-monogram";
      monogram.dataset.roleKey = canonicalRole.key;
      monogram.setAttribute("aria-hidden", "true");
      monogram.textContent = canonicalRole.code;
      monogram.append(dot);
      const copy = document.createElement("div");
      copy.className = "crew-copy";
      const name = document.createElement("strong");
      name.textContent = crewDisplayName(canonicalRole);
      const roleLine = document.createElement("small");
      roleLine.textContent = active ? "ready to work" : (lifecycleLabel(agent.state) || "state not reported").toLowerCase();
      copy.append(name, roleLine);
      // What this agent is doing right now, taken from the newest event it
      // produced. A roster that only says "active" tells the customer nothing
      // they could not have assumed; the last thing each person touched is the
      // reason to keep this page open.
      const live = agentLiveness(canonicalRole.key);
      const latest = latestActivityForRole(canonicalRole.key);
      if (latest) {
        const doing = document.createElement("span");
        doing.className = "crew-doing";
        doing.textContent = latest;
        copy.append(doing);
      }
      // Only a genuinely recent event lights the dot. Everything else says
      // when the agent was last heard from, which is a real answer rather
      // than a reassuring one. The idle wording is remembered on the row so
      // refreshCrewActivity can fall back to it without re-reading the
      // roster response.
      row.dataset.idleLine = active ? "waiting for work" : (lifecycleLabel(agent.state) || "state not reported").toLowerCase();
      row.classList.toggle("is-on", live.state === "working" || live.state === "briefed");
      roleLine.textContent = crewStatusLine(live, row.dataset.idleLine);
      row.append(monogram, copy);
      ui.agentList.append(row);
      railCrew.push({
        agentId: stringValue(agent.id),
        roleKey: canonicalRole.key,
        code: canonicalRole.code,
        label: crewDisplayName(canonicalRole),
        live: live.state === "working" || live.state === "briefed"
      });
    });
    renderRailCrew(railCrew);
    // Role keys, not agent ids: liveness is measured per role, so the three
    // engineers light together in the strip exactly as their tiles do.
    session.agentRoster = resolvedRoles.map((role) => role.key);
    session.agents = agents;
    ui.agentsEmpty.hidden = true;
    ui.agentList.hidden = false;
    setSourceState(ui.agentsState, agents.length === 6 ? "6/6 roles" : `${agents.length}/6 provisioning`, agents.length === 6 ? "success" : "loading");
    // A fresh roster can rename, replace, or drop the agent whose record is
    // open. Repaint the identity from what the server just confirmed - a
    // synchronous re-read of held state, never a request.
    if (session.selectedAgentId) renderAgentIdentity();
    // Runs and the activity split both name agents off this roster, so they
    // repaint on the same response rather than waiting for the next event.
    renderRunsView();
  }

  // The newest customer-visible event for one role, phrased as an activity
  // rather than a record. Returns null when the stream has nothing for them,
  // so the row stays quiet instead of inventing work.
  function latestActivityForRole(roleKey) {
    const found = latestEventForRole(roleKey);
    if (!found) return null;
    const summary = stringValue(found.safeSummary) || stringValue(found.title);
    if (!summary) return null;
    return summary.length > 96 ? `${summary.slice(0, 95).trimEnd()}…` : summary;
  }

  // Newest first. session.activityEvents is append-ordered - push to add, shift
  // to drop the oldest - so scanning it forwards returned the OLDEST retained
  // event for the role. Every caller wanted the latest: the crew tile showed a
  // stale line, and liveness measured the age of an old event, so an agent
  // working right now read as "waiting for work".
  function latestEventForRole(roleKey) {
    const events = Array.isArray(session.activityEvents) ? session.activityEvents : [];
    for (let index = events.length - 1; index >= 0; index -= 1) {
      const role = agentRoleContract?.canonicalAgentRole?.(events[index]?.agentRole);
      if (role && role.key === roleKey) return events[index];
    }
    return null;
  }

  // Whether an agent is working is a live question, and the answer is on the
  // stream: an agent that produced an event moments ago is working now, one
  // that produced its last event an hour ago is not. The roster's own state
  // column says "active" for a provisioned agent forever, which is why this
  // screen could show six active agents and a team doing nothing.
  const workingWindowMs = 3 * 60 * 1000;
  // The dispatcher's record is a second, independent witness. The night this
  // was added, the stream was down while the Product Manager was mid-run
  // burning model calls, and the tile read "waiting for work" — the polled
  // dispatch row was the only evidence the team had been briefed. A handoff
  // this recent outranks stream silence, but never a live stream event.
  const briefedWindowMs = 5 * 60 * 1000;
  function agentLiveness(roleKey) {
    // "Working" is a claim about right now, and a recent event is a fact about
    // the past. When the runtime has just told us its agents are not ready,
    // the runtime wins: a crashlooping pod has no working agents however fresh
    // its last event was, and a rail full of pulsing dots over a dead runtime
    // is the same lie as a live badge over one.
    //
    // An UNOBSERVED runtime does not suppress anything. Absence of a report is
    // not evidence against an event that actually arrived.
    const readiness = teamRuntimeReadiness(selectedTeam());
    if (["failed", "degraded", "suspended"].includes(readiness.verdict)) return { state: "quiet", since: "" };
    const event = latestEventForRole(roleKey);
    const at = event && event.occurredAt ? new Date(event.occurredAt).getTime() : NaN;
    const age = Number.isFinite(at) ? Date.now() - at : NaN;
    if (Number.isFinite(age) && age <= workingWindowMs) return { state: "working", since: "" };
    // Objectives are dispatched to the Product Manager, so only that tile can
    // borrow the dispatch record's word.
    if (roleKey === "tpm" && recentObjectiveHandoff()) return { state: "briefed", since: "" };
    return { state: "quiet", since: Number.isFinite(age) ? relativeAge(age) : "" };
  }

  function recentObjectiveHandoff() {
    const objectives = session.objectiveListsByTeam.get(session.selectedTeamId) || [];
    return objectives.some((objective) => {
      const dispatch = objective?.dispatch;
      const stateLabel = objectiveDispatchStateLabel(dispatch?.state);
      if (!["delivering", "delivered"].includes(stateLabel)) return false;
      const at = timestampDate(stateLabel === "delivered" ? dispatch.deliveredAt : dispatch.updatedAt)?.getTime();
      return Number.isFinite(at) && Date.now() - at <= briefedWindowMs;
    });
  }

  // One wording for both render paths. "briefed — working" is the dispatcher
  // vouching for the agent: the handoff was server-confirmed moments ago, so
  // the agent has work even when the stream has relayed nothing yet — or is
  // down entirely.
  function crewStatusLine(live, idleLine) {
    if (live.state === "working") return "working now";
    if (live.state === "briefed") return "briefed — working";
    if (live.since) return `last active ${live.since}`;
    return idleLine;
  }

  function relativeAge(ms) {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${Math.max(1, minutes).toString()}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours.toString()}h ago`;
    return `${Math.floor(hours / 24).toString()}d ago`;
  }

  // Rewrite only the status and activity lines on each crew row.
  // Re-rendering the whole roster on every streamed event would restart the
  // dot animation and fight the customer's scroll position.
  function refreshCrewActivity() {
    // The console's composing shimmer answers the same liveness question the
    // crew tiles do, so it re-evaluates whenever they do — a PM that goes
    // quiet takes the shimmer down with the tile's glow.
    renderConversationTyping();
    // The strip's presence cell ages with the tiles for the same reason.
    renderStatStrip();
    // So do the agent view's liveness chip, "doing now" line and activity
    // slice - same sources, same beat, and a no-op while the view is empty.
    renderAgentDetailLive();
    // The rail's dots answer the same liveness question from the same sources,
    // so they age on the same beat rather than holding the roster response's
    // snapshot until the next refresh.
    if (ui.railCrew && !ui.railCrew.hidden) {
      ui.railCrew.querySelectorAll(".cs-rail-crew-row").forEach((row) => {
        const plate = row.querySelector(".dn-avatar");
        const roleKey = plate?.dataset.roleKey;
        if (!roleKey) return;
        const live = agentLiveness(roleKey);
        const working = live.state === "working" || live.state === "briefed";
        const meta = row.querySelector(".dn-nav__meta");
        if (working === Boolean(meta)) return;
        if (!working) { meta.remove(); return; }
        const mark = document.createElement("span");
        mark.className = "dn-nav__meta";
        const dot = document.createElement("span");
        dot.className = "dn-dot dn-dot--sm dn-dot--live dn-dot--pulse";
        dot.setAttribute("aria-hidden", "true");
        const word = document.createElement("span");
        word.className = "visually-hidden";
        word.textContent = "working";
        mark.append(dot, word);
        row.append(mark);
      });
    }
    if (!ui.agentList || ui.agentList.hidden) return;
    ui.agentList.querySelectorAll(".crew-row").forEach((row) => {
      const roleKey = row.dataset.roleKey;
      if (!roleKey) return;
      // The status line answers the same liveness question the full render
      // answers, from the same sources — stream first, then the polled
      // dispatch record — so a handoff that advances between streamed events
      // updates the row without a roster re-render.
      const live = agentLiveness(roleKey);
      const roleLine = row.querySelector(".crew-copy small");
      if (roleLine) roleLine.textContent = crewStatusLine(live, row.dataset.idleLine || roleLine.textContent);
      row.classList.toggle("is-on", live.state === "working" || live.state === "briefed");
      const latest = latestActivityForRole(roleKey);
      let line = row.querySelector(".crew-doing");
      if (!latest) {
        if (line) line.remove();
        return;
      }
      if (!line) {
        line = document.createElement("span");
        line.className = "crew-doing";
        row.querySelector(".crew-copy")?.append(line);
      }
      if (line.textContent !== latest) line.textContent = latest;
    });
  }

  // Spend against the prepaid balance. Shown only when both numbers are real:
  // a budget bar with an invented denominator would be a lie about money.
  function renderRailSpend() {
    if (!ui.railSpend) return;
    const remaining = session.creditBalance;
    const consumed = session.creditPeriodConsumed;
    if (remaining === null || remaining === undefined || consumed === null || consumed === undefined) {
      ui.railSpend.hidden = true;
      return;
    }
    const total = Number(remaining) + Number(consumed);
    if (!Number.isFinite(total) || total <= 0) {
      ui.railSpend.hidden = true;
      return;
    }
    const percent = Math.max(0, Math.min(100, (Number(consumed) / total) * 100));
    ui.railSpend.hidden = false;
    if (ui.railSpendValue) ui.railSpendValue.textContent = formatCreditMicros(consumed);
    setGaugeWidth(ui.railSpendFill, percent);
    if (ui.railSpendNote) ui.railSpendNote.textContent = `${formatCreditMicros(remaining)} remaining`;
  }

  // ── The instrument strip ──────────────────────────────────────────────
  // Four readings over the crew - proof, money, delivery, presence - fed
  // entirely from state the workspace refresh already fetched. It renders at
  // the tail of the same generation-guarded fan-out its sibling renders sit
  // behind, and again whenever one of its sources repaints, so it can never
  // say something the panels below it do not.

  // GitHub check-run conclusions arrive verbatim, never remapped. Anything
  // terminal that is not a pass fails the objective's latest acceptance
  // observation; neutral and skipped assert nothing either way.
  function failingAcceptance(objective) {
    const conclusion = stringValue(objective?.acceptance?.conclusion).toLowerCase();
    return Boolean(conclusion) && !["success", "neutral", "skipped"].includes(conclusion);
  }

  // Write a strip reading; when the value actually changed, replay the tick
  // confirmation by removing the class, forcing one reflow (offsetWidth is a
  // READ — style-src blocks style writes, not layout reads) and adding it
  // back so the animation restarts. An unchanged value never moves.
  function setStatValue(element, text) {
    if (!element) return;
    if (element.textContent === text) return;
    element.textContent = text;
    element.classList.remove("dn-tick");
    void element.offsetWidth;
    element.classList.add("dn-tick");
  }

  function renderStatStrip() {
    if (!ui.statStrip) return;
    const team = selectedTeam();
    if (!team || lifecycleLabel(team.state) !== "active") {
      ui.statStrip.hidden = true;
      return;
    }
    ui.statStrip.hidden = false;

    // Objectives: satisfied_at is evidence, not lifecycle state - set while
    // the latest acceptance run passes, cleared when a later run fails. A
    // cleared proof with a failing observation is "regressed", a different
    // fact from never-proven, and the strip refuses to fold the two. The
    // classification itself lives in objectiveAcceptanceState below, which
    // the objectives view reads too — one classifier, two surfaces, no way
    // for the counts up here to disagree with the records down there.
    const objectives = session.objectiveListsByTeam.get(session.selectedTeamId);
    if (Array.isArray(objectives) && objectives.length) {
      const proven = objectives.filter((objective) => objectiveAcceptanceState(objective) === "proven").length;
      const regressed = objectives.filter((objective) => objectiveAcceptanceState(objective) === "regressed").length;
      setStatValue(ui.statObjectives, `${proven}/${objectives.length}`);
      ui.statObjectivesNote.textContent = regressed ? `${regressed} regressed` : "proven by acceptance runs";
    } else {
      setStatValue(ui.statObjectives, "—");
      ui.statObjectivesNote.textContent = Array.isArray(objectives) ? "no objectives yet" : "not loaded";
    }

    // Credits: the ledger balance is authoritative, the period spend comes
    // from the same credit control the rail gauge reads, and the meter only
    // moves on two real numbers - the rail's own rule about money.
    const remaining = session.creditBalance;
    const consumed = session.creditPeriodConsumed;
    if (remaining !== null && remaining !== undefined) {
      setStatValue(ui.statCredits, formatCreditMicros(remaining));
      if (consumed !== null && consumed !== undefined) {
        const total = Number(remaining) + Number(consumed);
        ui.statCreditsNote.textContent = `${formatCreditMicros(consumed)} used this period`;
        setGaugeWidth(ui.statCreditsFill, Number.isFinite(total) && total > 0 ? (Number(consumed) / total) * 100 : 0);
      } else {
        ui.statCreditsNote.textContent = "period spend not reported";
        setGaugeWidth(ui.statCreditsFill, 0);
      }
    } else {
      setStatValue(ui.statCredits, "—");
      ui.statCreditsNote.textContent = "balance unavailable";
      setGaugeWidth(ui.statCreditsFill, 0);
    }

    // Delivery: open counts from the webhook-backed snapshots, per side, so
    // a half-loaded history shows a dash on the half it cannot vouch for.
    const pullsLoaded = session.githubPullRequestsState === "loaded";
    const issuesLoaded = session.githubIssuesState === "loaded";
    if (pullsLoaded || issuesLoaded) {
      const openPulls = session.githubPullRequests.filter((record) => githubPullRequestStateLabel(record?.state) === "open").length;
      const openIssues = session.githubIssues.filter((record) => githubIssueStateLabel(record?.state) === "open").length;
      setStatValue(ui.statDelivery, `${pullsLoaded ? openPulls.toString() : "—"} · ${issuesLoaded ? openIssues.toString() : "—"}`);
      ui.statDeliveryNote.textContent = "open PRs · open issues";
    } else {
      setStatValue(ui.statDelivery, "—");
      ui.statDeliveryNote.textContent = session.deliveryRepositoryId ? "delivery not loaded" : "no repository selected";
    }

    // Presence: the roster the tiles render, counted with the tiles' own
    // liveness answer, so the number and the glow always agree.
    if (session.agentRoster.length) {
      const active = session.agentRoster.filter((roleKey) => ["working", "briefed"].includes(agentLiveness(roleKey).state)).length;
      setStatValue(ui.statAgents, `${active}/${session.agentRoster.length}`);
      ui.statAgentsNote.textContent = active ? "working now" : "waiting for work";
    } else {
      setStatValue(ui.statAgents, "—");
      ui.statAgentsNote.textContent = "no roster loaded";
    }
  }

  // The check plate's own state: the acceptance classification, except that
  // an unproven objective whose handoff is in flight or delivered reads as
  // "running" — the crew has it, so the plate breathes lumen instead of
  // sitting as an empty box. Proof states pass through untouched; the
  // classifier below stays the single authority on proven/regressed.
  function objectivePlateState(objective, acceptanceState) {
    if (acceptanceState !== "unproven") return acceptanceState;
    const dispatchLabel = objectiveDispatchStateLabel(objective?.dispatch?.state);
    return ["queued", "delivering", "delivered"].includes(dispatchLabel) ? "running" : "unproven";
  }

  // The one classifier for an objective's proof, shared by the instrument
  // strip's counts and the objectives view's records so the two surfaces can
  // never disagree. satisfied_at set means the latest acceptance run passes
  // — that is "proven" whatever else the observation says. With no proof, a
  // failing observation is "regressed" (it WAS proven once and stopped
  // holding — a different fact from never-proven), and anything else —
  // no observation at all, or a neutral/skipped conclusion that asserts
  // nothing — is "unproven".
  function objectiveAcceptanceState(objective) {
    if (timestampDate(objective?.satisfiedAt)) return "proven";
    return failingAcceptance(objective) ? "regressed" : "unproven";
  }

  function agentRoleLabel(value) {
    return agentRoleContract?.canonicalAgentRole?.(value)?.label || "Unspecified agent role";
  }

  // ── The teams surface ─────────────────────────────────────────────────
  // Every team as a door. Tiles render from session.teams — the same
  // server-confirmed roster the selector reads — and their objective meters
  // go through objectiveAcceptanceState, the one classifier the instrument
  // strip and the objectives view already share, so a tile can never call
  // proven what the records below call regressed. Per-team delivery and
  // decision counts come from ensureDashboardStats' capped fan-out; a team
  // the fan-out did not reach shows an em dash, never a zero.

  // Which teams the fan-out serves: active ones only (a pending or deleting
  // team correctly answers "team not found" on every versioned service),
  // capped at six so a workspace of many teams costs a bounded burst.
  function dashboardFanoutTeams(teams) {
    const active = (Array.isArray(teams) ? teams : [])
      .filter((team) => stringValue(team?.id) && lifecycleLabel(team?.state) === "active");
    return { chosen: active.slice(0, 6), overflow: Math.max(0, active.length - 6) };
  }

  function repositoryLabelIndex() {
    return new Map(session.repositories.map((repository) => [String(repository.githubRepositoryId), `${stringValue(repository.owner)}/${stringValue(repository.name)}`]));
  }

  // When this team came into existence — accepts the same two transport
  // shapes the descent's own created-at read accepts.
  function teamCreatedAtMs(team) {
    const value = team?.createdAt;
    if (!value) return 0;
    if (typeof value === "string") return Date.parse(value) || 0;
    if (typeof value.seconds !== "undefined") return Number(value.seconds) * 1000;
    return 0;
  }

  // One team's readings, fetched with the validated helpers the deep view
  // already trusts: listAllObjectives (whose result lands in
  // session.objectiveListsByTeam, the very record the strip reads), the
  // approval queue's own validator for the pending count, and the
  // webhook-backed delivery snapshots for open counts. Delivery is counted
  // for the team's first known repository; when the team runs several, the
  // footer names the one that was counted rather than implying a total.
  async function loadDashboardTeamStats(team) {
    const teamId = stringValue(team.id);
    // Zero is the team's whole grant. This used to count one repository — the
    // first the team was known to hold — and name it in the footer, because
    // the server would not answer a wider question. It answers one now, so
    // the tile's count is the team's rather than a sample of it.
    const [objectivesResult, approvalsResult, issuesResult, pullsResult] = await Promise.allSettled([
      listAllObjectives(teamId),
      apiRequest("approvals", { teamId, page: { pageSize: 100 } }),
      apiRequest("github_issues", { organizationId: session.organizationId, teamId, githubRepositoryId: "0", page: { pageSize: 100 } }),
      apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId, githubRepositoryId: "0", page: { pageSize: 100 } })
    ]);
    const stats = { approvalsLoaded: false, pendingApprovals: 0, deliveryLoaded: false, openIssues: 0, openPullRequests: 0, deliveryScope: "" };
    if (objectivesResult.status === "fulfilled") session.objectiveListsByTeam.set(teamId, objectivesResult.value);
    if (approvalsResult.status === "fulfilled") {
      const approvals = Array.isArray(approvalsResult.value?.approvals) ? approvalsResult.value.approvals : [];
      if (approvals.length <= 100 && approvals.every((approval) => validPendingApproval(approval, teamId))) {
        stats.approvalsLoaded = true;
        stats.pendingApprovals = approvals.filter((approval) => pendingApprovalStatus(approval)).length;
      }
    }
    if (issuesResult?.status === "fulfilled" && pullsResult?.status === "fulfilled") {
      const issues = Array.isArray(issuesResult.value?.issues) ? issuesResult.value.issues : [];
      const pulls = Array.isArray(pullsResult.value?.pullRequests) ? pullsResult.value.pullRequests : [];
      stats.deliveryLoaded = true;
      stats.openIssues = issues.filter((record) => githubIssueStateLabel(record?.state) === "open").length;
      stats.openPullRequests = pulls.filter((record) => githubPullRequestStateLabel(record?.state) === "open").length;
    }
    return stats;
  }

  // The surface's one fan-out: capped, generation-guarded like every
  // workspace fan-out, armed only while the teams surface is actually on
  // screen (the class observer at the bottom of this file is its trigger).
  // The load key stops one entry from firing twice for the same team set; a
  // failure clears both the key and the failed team's stale entry, so the
  // next entry retries and the tile keeps its honest dash meanwhile.
  let dashboardLoadKey = "";
  async function ensureDashboardStats() {
    if (!ui.teamTiles || !session.accessToken || !session.organizationId) return;
    const { chosen, overflow } = dashboardFanoutTeams(session.teams);
    session.dashboardOverflow = overflow;
    if (!chosen.length) {
      setSourceState(ui.teamTilesState, session.teams.length ? "No active teams" : "Waiting");
      renderTeamTiles();
      return;
    }
    const key = `${session.organizationId}:${chosen.map((team) => stringValue(team.id)).join(",")}`;
    if (dashboardLoadKey === key) return;
    dashboardLoadKey = key;
    const generation = ++session.dashboardGeneration;
    setSourceState(ui.teamTilesState, "Loading", "loading");
    const results = await Promise.allSettled(chosen.map((team) => loadDashboardTeamStats(team)));
    if (generation !== session.dashboardGeneration) return;
    let failures = 0;
    results.forEach((result, index) => {
      const teamId = stringValue(chosen[index].id);
      if (result.status === "fulfilled") {
        session.dashboardStats.set(teamId, result.value);
      } else {
        failures += 1;
        session.dashboardStats.delete(teamId);
      }
    });
    if (failures) dashboardLoadKey = "";
    setSourceState(
      ui.teamTilesState,
      failures ? `${(chosen.length - failures).toString()}/${chosen.length.toString()} loaded` : "Loaded",
      failures ? "error" : "success"
    );
    renderTeamTiles();
  }

  // The tile's one word about the team. Lifecycle speaks first (a team that
  // is not running has no other headline); then the human queue ("Needs
  // you" — a pending decision is the one state that outranks everything);
  // then proof (regressed before complete, because a proof that stopped
  // holding is never folded away); and only then "Working", which for an
  // active team is the lifecycle fact, not a liveness claim.
  function teamTileChip(team, objectives, stats) {
    const lifecycle = lifecycleLabel(team?.state) || "created";
    if (lifecycle !== "active") {
      const provisioning = launchContract?.provisioningPresentation?.(team?.provisioning || {}) || {};
      if (provisioning.failed) return { tone: "error", word: "Needs attention" };
      if (lifecycle === "deleting") return { tone: "idle", word: "Removing" };
      if (lifecycle === "suspended") return { tone: "idle", word: "Paused" };
      if (lifecycle === "pending") return { tone: "attention", word: "Awaiting payment" };
      return { tone: "idle", word: "Setting up" };
    }
    if (stats?.approvalsLoaded && stats.pendingApprovals > 0) return { tone: "attention", word: "Needs you" };
    if (Array.isArray(objectives) && objectives.length) {
      const regressed = objectives.filter((objective) => objectiveAcceptanceState(objective) === "regressed").length;
      const proven = objectives.filter((objective) => objectiveAcceptanceState(objective) === "proven").length;
      if (regressed > 0) return { tone: "error", word: "Regressed" };
      if (proven === objectives.length) return { tone: "success", word: "Complete" };
    }
    return { tone: "live", word: "Working" };
  }

  // The line under the name: the leading objective when the list is loaded
  // (the objective IS the project here), the setup state while there is no
  // workspace yet, and an honest "not loaded" for a team beyond the cap.
  function teamTileLine(team, objectives) {
    const lifecycle = lifecycleLabel(team?.state) || "created";
    if (lifecycle !== "active") {
      if (lifecycle === "pending") return "Awaiting payment confirmation.";
      const provisioning = launchContract?.provisioningPresentation?.(team?.provisioning || {}) || {};
      if (provisioning.state) return `${capitalize(provisioning.label)} · ${provisioning.step}`;
      return capitalize(lifecycle);
    }
    if (!Array.isArray(objectives)) return "Objectives not loaded yet.";
    if (!objectives.length) return "No objectives yet — set them in conversation.";
    const title = stringValue(objectives[0]?.title) || "Untitled objective";
    const clipped = title.length > 88 ? `${title.slice(0, 87).trimEnd()}…` : title;
    return objectives.length > 1 ? `${clipped} · +${(objectives.length - 1).toString()} more` : clipped;
  }

  // The segmented meter: one segment per objective, each classified by the
  // shared objectiveAcceptanceState — proven kelp, regressed coral, unproven
  // ink. Past two dozen objectives the segments would be slivers, so the
  // meter falls back to a continuous proven-share fill through the same
  // CSSOM geometry the credit gauge uses; either way the fraction is exact.
  function teamTileMeter(objectives) {
    const proven = objectives.filter((objective) => objectiveAcceptanceState(objective) === "proven").length;
    const regressed = objectives.filter((objective) => objectiveAcceptanceState(objective) === "regressed").length;
    const wrap = document.createElement("div");
    wrap.className = "team-tile-meter";
    const head = document.createElement("div");
    head.className = "team-tile-meter-head";
    const label = document.createElement("span");
    label.textContent = "Objectives proven";
    const fraction = document.createElement("span");
    fraction.className = "team-tile-frac";
    fraction.textContent = `${proven.toString()}/${objectives.length.toString()}`;
    head.append(label, fraction);
    const track = document.createElement("div");
    track.className = "team-tile-segments";
    if (objectives.length <= 24) {
      objectives.forEach((objective) => {
        const segment = document.createElement("i");
        segment.dataset.state = objectiveAcceptanceState(objective);
        track.append(segment);
      });
    } else {
      track.classList.add("team-tile-segments-continuous");
      const fill = document.createElement("i");
      fill.dataset.state = "proven";
      setChartGeometry(fill, { width: (proven / objectives.length) * 100 }, "t");
      track.append(fill);
    }
    wrap.append(head, track);
    if (regressed) {
      const note = document.createElement("span");
      note.className = "team-tile-regressed";
      note.dataset.state = "regressed";
      note.textContent = `${regressed.toString()} regressed`;
      wrap.append(note);
    }
    return wrap;
  }

  function renderTeamTiles() {
    if (!ui.teamTiles || !ui.teamTilesEmpty) return;
    purgeChartGeometry("t");
    ui.teamTiles.replaceChildren();
    const teams = session.teams;
    ui.teamTilesEmpty.hidden = teams.length > 0;
    ui.teamTiles.hidden = teams.length === 0;
    if (ui.teamTilesNote) {
      ui.teamTilesNote.hidden = session.dashboardOverflow <= 0;
      if (session.dashboardOverflow > 0) {
        ui.teamTilesNote.textContent = `Delivery and decision counts load for the first six active teams — ${session.dashboardOverflow.toString()} more keep an em dash until opened.`;
      }
    }
    const labels = repositoryLabelIndex();
    teams.forEach((team) => {
      const id = stringValue(team.id);
      const objectives = session.objectiveListsByTeam.get(id);
      const stats = session.dashboardStats.get(id);
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "team-tile";
      tile.dataset.teamOpen = "true";
      tile.dataset.teamId = id;
      const head = document.createElement("div");
      head.className = "team-tile-head";
      const name = document.createElement("strong");
      name.className = "team-tile-name";
      name.textContent = stringValue(team.name) || "Unnamed team";
      const chipState = teamTileChip(team, objectives, stats);
      const chip = document.createElement("span");
      chip.className = "team-tile-chip";
      chip.dataset.tone = chipState.tone;
      chip.textContent = chipState.word;
      head.append(name, chip);
      const line = document.createElement("p");
      line.className = "team-tile-line";
      line.textContent = teamTileLine(team, objectives);
      tile.append(head, line);
      if (Array.isArray(objectives) && objectives.length) tile.append(teamTileMeter(objectives));
      // Repository tags: the team's own known set, first two named, the
      // rest counted. No set known yet means no row — never a guess.
      const repositoryNames = knownTeamRepositoryIds(id).map((repositoryId) => labels.get(repositoryId)).filter(Boolean);
      if (repositoryNames.length) {
        const tags = document.createElement("div");
        tags.className = "team-tile-tags";
        repositoryNames.slice(0, 2).forEach((full) => {
          const tag = document.createElement("span");
          tag.textContent = full.split("/")[1] || full;
          tags.append(tag);
        });
        if (repositoryNames.length > 2) {
          const more = document.createElement("span");
          more.textContent = `+${(repositoryNames.length - 2).toString()}`;
          tags.append(more);
        }
        tile.append(tags);
      }
      const foot = document.createElement("div");
      foot.className = "team-tile-foot";
      const delivery = document.createElement("span");
      if (stats?.deliveryLoaded) {
        delivery.textContent = `${stats.openPullRequests.toString()} open PRs · ${stats.openIssues.toString()} issues${stats.deliveryScope ? ` in ${stats.deliveryScope}` : ""}`;
      } else {
        // Not loaded is a dash, never a zero: zero is a served answer.
        delivery.textContent = "—";
        delivery.title = "Delivery counts load for the first six active teams when this screen opens.";
      }
      foot.append(delivery);
      if (stats?.approvalsLoaded && stats.pendingApprovals > 0) {
        const waiting = document.createElement("span");
        waiting.dataset.tone = "attention";
        waiting.textContent = `${stats.pendingApprovals.toString()} waiting on you`;
        foot.append(waiting);
      }
      const createdMs = teamCreatedAtMs(team);
      if (createdMs) {
        const assembled = document.createElement("span");
        assembled.textContent = `assembled ${new Date(createdMs).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
        foot.append(assembled);
      }
      tile.append(foot);
      ui.teamTiles.append(tile);
    });
  }

  // A tile is a door: the same team switch the selector performs. The router
  // owns which surface is on screen and walks to the floor on this same
  // click; this handler only decides WHICH team the workspace selects.
  function openTeamFromTiles(event) {
    const tile = event.target instanceof Element ? event.target.closest("[data-team-open]") : null;
    if (!tile || !ui.teamTiles || !ui.teamTiles.contains(tile)) return;
    const teamId = stringValue(tile.dataset.teamId);
    if (!teamId || !session.teams.some((team) => stringValue(team.id) === teamId)) return;
    if (ui.teamSelect) ui.teamSelect.value = teamId;
    if (session.selectedTeamId === teamId) return;
    session.selectedTeamId = teamId;
    session.selectedAgentId = "";
    resetAgentDetailView("Choose a crew member on the floor to open their record.");
    refreshSelectedTeam();
  }

  // ── Who worked when: the swimlanes ────────────────────────────────────
  // A span is contiguous activity: events from one agent that sit within a
  // gap threshold of each other merge into one bar; a longer silence starts
  // a new bar. Everything is derived from the buffer's real timestamps —
  // the one liberty is a minimum visual length so a single event does not
  // vanish at this scale, and it only ever extends a span's end.
  function deriveAgentSpans(entries, options) {
    const opts = options || {};
    const now = Number.isFinite(opts.now) ? opts.now : Date.now();
    const windowMs = opts.windowMs > 0 ? opts.windowMs : 40 * 60 * 1000;
    const gapMs = opts.gapMs > 0 ? opts.gapMs : 3 * 60 * 1000;
    const minSpanMs = opts.minSpanMs >= 0 ? opts.minSpanMs : 45 * 1000;
    const timeOf = typeof opts.timeOf === "function" ? opts.timeOf : (entry) => entry?.at;
    const start = now - windowMs;
    const byAgent = new Map();
    for (const entry of Array.isArray(entries) ? entries : []) {
      const agentId = entry && typeof entry.agentId === "string" ? entry.agentId : "";
      const at = timeOf(entry);
      if (!agentId || !Number.isFinite(at) || at < start || at > now) continue;
      if (!byAgent.has(agentId)) byAgent.set(agentId, []);
      byAgent.get(agentId).push(at);
    }
    const lanes = new Map();
    for (const [agentId, times] of byAgent) {
      times.sort((left, right) => left - right);
      const spans = [];
      for (const at of times) {
        const last = spans[spans.length - 1];
        if (last && at - last.end <= gapMs) last.end = at;
        else spans.push({ start: at, end: at });
      }
      lanes.set(agentId, spans.map((span) => ({
        start: Math.max(start, span.start),
        end: Math.min(now, Math.max(span.end, span.start + minSpanMs))
      })));
    }
    return lanes;
  }

  // The same role resolution the roster render walks, so the lanes name the
  // engineers exactly as their tiles do (E4, E5… when the team grew).
  function laneRoster() {
    const resolved = [];
    let engineerOrdinal = 3;
    for (const agent of Array.isArray(session.agents) ? session.agents : []) {
      let role = agentRoleContract?.canonicalAgentRole?.(agent.role);
      if (!role) continue;
      if (role.repeatable) {
        engineerOrdinal += 1;
        role = { ...role, code: `E${engineerOrdinal.toString()}` };
      }
      const id = stringValue(agent.id);
      if (id) resolved.push({ id, role });
    }
    return resolved;
  }

  // How far back the charts may honestly reach. The buffer keeps the last 80
  // events; once it has shed history, time before its oldest retained event
  // is unmeasured — a lane painted empty there would claim an idleness
  // nobody observed. So a full buffer shrinks the window to its own reach,
  // and the label carries the real number of minutes.
  function dashboardChartWindow(defaultMs) {
    const now = Date.now();
    let ms = defaultMs;
    if (session.activityEvents.length >= 80) {
      let oldest = Infinity;
      for (const entry of session.activityEvents) {
        const at = timestampDate(entry.occurredAt)?.getTime();
        if (Number.isFinite(at) && at < oldest) oldest = at;
      }
      if (Number.isFinite(oldest)) ms = Math.max(60 * 1000, Math.min(ms, now - oldest));
    }
    return { now, ms, minutes: Math.max(1, Math.round(ms / 60000)) };
  }

  function renderDashboardLanes() {
    if (!ui.laneChart || !ui.lanesEmpty) return;
    ui.laneChart.replaceChildren();
    const team = selectedTeam();
    const roster = laneRoster();
    const standDown = (title, message) => {
      ui.laneChart.hidden = true;
      if (ui.lanesWindow) ui.lanesWindow.hidden = true;
      ui.lanesEmpty.hidden = false;
      setEmptyState(ui.lanesEmpty, title, message);
    };
    if (!team) {
      standDown("No team selected", "Choose a team to see who worked when.");
      return;
    }
    if (!roster.length) {
      standDown("No crew roster loaded", "Lanes appear when the server-confirmed roster arrives.");
      return;
    }
    const window = dashboardChartWindow(40 * 60 * 1000);
    const lanes = deriveAgentSpans(session.activityEvents, {
      now: window.now,
      windowMs: window.ms,
      timeOf: (entry) => {
        const at = timestampDate(entry.occurredAt)?.getTime();
        return Number.isFinite(at) ? at : NaN;
      }
    });
    if (!roster.some((member) => (lanes.get(member.id) || []).length)) {
      standDown("Quiet on the stream", `No agent activity in the last ${window.minutes.toString()} minutes. Lanes fill the moment the crew works.`);
      return;
    }
    ui.lanesEmpty.hidden = true;
    ui.laneChart.hidden = false;
    if (ui.lanesWindow) {
      ui.lanesWindow.hidden = false;
      ui.lanesWindow.textContent = `last ${window.minutes.toString()}m · ${stringValue(team.name) || "selected team"}`;
    }
    const windowStart = window.now - window.ms;
    roster.forEach((member) => {
      const lane = document.createElement("div");
      lane.className = "lane";
      const plate = document.createElement("span");
      plate.className = "user-avatar crew-monogram-xs";
      plate.dataset.roleKey = member.role.key;
      plate.setAttribute("aria-hidden", "true");
      plate.textContent = member.role.code;
      plate.title = member.role.label;
      const track = document.createElement("div");
      track.className = "lane-track";
      (lanes.get(member.id) || []).forEach((span) => {
        const bar = document.createElement("i");
        bar.className = "lane-span";
        bar.dataset.roleKey = member.role.key;
        setChartGeometry(bar, {
          left: ((span.start - windowStart) / window.ms) * 100,
          width: Math.max(0.5, ((span.end - span.start) / window.ms) * 100)
        });
        track.append(bar);
      });
      lane.append(plate, track);
      ui.laneChart.append(lane);
    });
    const axis = document.createElement("div");
    axis.className = "lane-axis";
    const from = document.createElement("span");
    from.textContent = `${window.minutes.toString()}m ago`;
    const to = document.createElement("span");
    to.textContent = "now";
    axis.append(from, to);
    ui.laneChart.append(axis);
  }

  // ── Crew activity, stacked by role ────────────────────────────────────
  // The kit draws actions per day for a week; this buffer holds the recent
  // stream, not days, so the honest series is the recent window it can
  // vouch for — five-minute buckets over the last hour (or the buffer's
  // reach), each stacked by the acting role. Nothing is interpolated: a
  // bucket is a count of real events.
  const roleBarFamilies = Object.freeze([
    { key: "AGENT_ROLE_ENGINEER", match: (role) => ["AGENT_ROLE_STAFF_CLIENT", "AGENT_ROLE_STAFF_BACKEND", "AGENT_ROLE_STAFF_PLATFORM", "AGENT_ROLE_ENGINEER"].includes(role) },
    { key: "AGENT_ROLE_ENGINEERING_MANAGER", match: (role) => role === "AGENT_ROLE_ENGINEERING_MANAGER" },
    { key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", match: (role) => role === "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER" },
    { key: "AGENT_ROLE_PRODUCT_DESIGNER", match: (role) => role === "AGENT_ROLE_PRODUCT_DESIGNER" }
  ]);

  function renderRoleBars() {
    if (!ui.roleBars || !ui.roleBarsEmpty) return;
    ui.roleBars.replaceChildren();
    const team = selectedTeam();
    const standDown = (title, message) => {
      ui.roleBars.hidden = true;
      if (ui.roleBarsLegend) ui.roleBarsLegend.hidden = true;
      if (ui.roleBarsWindow) ui.roleBarsWindow.hidden = true;
      ui.roleBarsEmpty.hidden = false;
      setEmptyState(ui.roleBarsEmpty, title, message);
    };
    if (!team) {
      standDown("No team selected", "Choose a team to count its crew's recent actions.");
      return;
    }
    const window = dashboardChartWindow(60 * 60 * 1000);
    const bucketCount = 12;
    const bucketMs = window.ms / bucketCount;
    const start = window.now - window.ms;
    const buckets = Array.from({ length: bucketCount }, () => new Map());
    let counted = 0;
    for (const entry of session.activityEvents) {
      const role = agentRoleContract?.canonicalAgentRole?.(entry.agentRole);
      if (!role) continue;
      const at = timestampDate(entry.occurredAt)?.getTime();
      if (!Number.isFinite(at) || at < start || at > window.now) continue;
      const family = roleBarFamilies.find((candidate) => candidate.match(role.key));
      if (!family) continue;
      const index = Math.min(bucketCount - 1, Math.floor((at - start) / bucketMs));
      buckets[index].set(family.key, (buckets[index].get(family.key) || 0) + 1);
      counted += 1;
    }
    if (!counted) {
      standDown("No recent actions", `Nothing from the crew in the last ${window.minutes.toString()} minutes. Bars fill as they work.`);
      return;
    }
    const maxTotal = Math.max(...buckets.map((bucket) => [...bucket.values()].reduce((sum, value) => sum + value, 0)));
    ui.roleBarsEmpty.hidden = true;
    ui.roleBars.hidden = false;
    if (ui.roleBarsLegend) ui.roleBarsLegend.hidden = false;
    if (ui.roleBarsWindow) {
      ui.roleBarsWindow.hidden = false;
      ui.roleBarsWindow.textContent = `${counted.toString()} actions · last ${window.minutes.toString()}m by role`;
    }
    buckets.forEach((bucket) => {
      const column = document.createElement("div");
      column.className = "role-bar";
      roleBarFamilies.forEach((family) => {
        const count = bucket.get(family.key) || 0;
        if (!count) return;
        const segment = document.createElement("i");
        segment.dataset.roleKey = family.key;
        segment.title = `${count.toString()} actions`;
        setChartGeometry(segment, { height: (count / maxTotal) * 100 });
        column.append(segment);
      });
      ui.roleBars.append(column);
    });
  }

  function renderDashboardCharts() {
    purgeChartGeometry("c");
    renderDashboardLanes();
    renderRoleBars();
  }

  // ══ The four screens the rail promised ═════════════════════════════════
  //
  // Activity, Runs, People and Billing each had a door in the navigation and
  // a card behind it explaining that there was nothing there. Each is built
  // below out of what the platform will actually hand a browser — and each
  // says out loud where that stops. An absence renders as one of the four
  // DataState kinds with the sentence that would change it, never as a zero,
  // a dash or an empty table: a zero is a claim that we counted.

  // One table, built rather than assembled. `columns` is [{ label, numeric,
  // cellClass }]; a cell may be a string or a node the caller made, so a row
  // can carry a badge, a monogram or a sentence without this helper knowing
  // what any of those are.
  function dataTable(columns, rows) {
    const table = document.createElement("table");
    table.className = "dn-table dn-table--dense";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    columns.forEach((column) => {
      const cell = document.createElement("th");
      cell.scope = "col";
      if (column.numeric) cell.className = "dn-table__num";
      cell.textContent = column.label;
      headRow.append(cell);
    });
    head.append(headRow);
    const body = document.createElement("tbody");
    rows.forEach((cells) => {
      const row = document.createElement("tr");
      cells.forEach((content, index) => {
        const column = columns[index] || {};
        const cell = document.createElement("td");
        const classes = [column.numeric ? "dn-table__num" : "", column.cellClass || ""].filter(Boolean);
        if (classes.length) cell.className = classes.join(" ");
        if (content instanceof Node) cell.append(content);
        else cell.textContent = stringValue(content);
        row.append(cell);
      });
      body.append(row);
    });
    table.append(head, body);
    return table;
  }

  function replaceWithTable(host, columns, rows) {
    if (!host) return;
    host.replaceChildren(dataTable(columns, rows));
    host.hidden = false;
  }

  // Severity is never decided on a screen. A lifecycle word is mapped onto the
  // ONE ladder in notice-levels.js and the badge takes that level's tone, so a
  // failed run is exactly as loud as a failed anything else, and the word
  // inside the badge carries the state on its own in greyscale.
  const SESSION_NOTICE_LEVEL = Object.freeze({
    started: "running",
    running: "running",
    waiting: "warning",
    paused: "warning",
    blocked: "blocked",
    succeeded: "success",
    failed: "error",
    cancelled: "info"
  });

  function ladderBadge(word, levelName) {
    const badge = document.createElement("span");
    const modifier = levelName ? noticeLevels?.levelClass?.("dn-badge", levelName) : "";
    badge.className = modifier ? `dn-badge ${modifier}` : "dn-badge";
    badge.textContent = word;
    return badge;
  }

  function monoCell(value, className = "cs-cell-id") {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = stringValue(value);
    return span;
  }

  // A row of the one bar shape this console draws by hand: a plate that names
  // the actor, the actor's own line, its figure, and a track whose fill is
  // proportional to the largest figure in the set. The figure is printed, so
  // the bar only orders what the numbers already say.
  function splitRow({ code, roleKey, name, figure, share, prefix }) {
    const row = document.createElement("div");
    row.className = "cs-splitrow";
    const plate = document.createElement("span");
    plate.className = "user-avatar crew-monogram-xs";
    if (roleKey) plate.dataset.roleKey = roleKey;
    plate.setAttribute("aria-hidden", "true");
    plate.textContent = code;
    const label = document.createElement("span");
    label.className = "cs-splitrow__name";
    label.textContent = name;
    const value = document.createElement("span");
    value.className = "cs-splitrow__num";
    value.textContent = figure;
    const track = document.createElement("span");
    track.className = "cs-splitrow__track";
    const fill = document.createElement("i");
    fill.className = "cs-splitrow__fill";
    if (roleKey) fill.dataset.roleKey = roleKey;
    setChartGeometry(fill, { width: share }, prefix);
    track.append(fill);
    row.append(plate, label, value, track);
    return row;
  }

  /* ── Activity ───────────────────────────────────────────────────────────
     The same buffer the floor's log renders, at full width. This screen holds
     no data and opens no stream: renderActivityLedger sorts and filters once
     and hands the result here, so a count, a filter and a row can never
     disagree between the two surfaces. Its own chrome — the stream's state
     word and the reconnect door — is mirrored from what that render already
     wrote, the way app-views.js mirrors the rail's scope headings. */
  function renderActivityScreen(shown, entries, allEntries, arrived) {
    if (!ui.activityScreenList || !ui.activityScreenEmpty) return;
    if (ui.activityScreenState && ui.activityState) {
      ui.activityScreenState.textContent = ui.activityState.textContent;
      if (ui.activityState.dataset.tone) ui.activityScreenState.dataset.tone = ui.activityState.dataset.tone;
      else delete ui.activityScreenState.dataset.tone;
    }
    if (ui.activityScreenRetry && ui.activityRetry) ui.activityScreenRetry.hidden = ui.activityRetry.hidden;

    ui.activityScreenList.replaceChildren();
    shown.forEach(({ entry, evidence }) => {
      const item = activityLedgerItem(entry, evidence);
      if (arrived.has(entry.id)) item.classList.add("dn-in-log");
      ui.activityScreenList.append(item);
    });
    ui.activityScreenList.hidden = entries.length === 0;
    ui.activityScreenEmpty.hidden = entries.length > 0;
    if (!entries.length) renderActivityScreenEmpty(allEntries);
    if (ui.activityScreenCount) {
      ui.activityScreenCount.textContent = allEntries.length
        ? `${new Intl.NumberFormat().format(allEntries.length)} ${allEntries.length === 1 ? "event" : "events"}${entries.length === allEntries.length ? "" : ` · ${new Intl.NumberFormat().format(entries.length)} shown`}`
        : "No events yet";
    }
    renderActivityAgentSplit(allEntries);
    renderActivityReach(allEntries);
  }

  // Which of the four this is depends on why there is nothing, and the stream
  // already decided that: its state word is the reading. A filtered-empty is
  // not an absence at all — we counted this category and there were none — so
  // it is a callout explaining what you are looking at, not a DataState.
  function renderActivityScreenEmpty(allEntries) {
    const host = ui.activityScreenEmpty;
    const tone = stringValue(ui.activityState?.dataset.tone);
    const label = stringValue(ui.activityState?.textContent).trim();
    if (allEntries.length) {
      const chip = ui.activityFilterButtons.find((button) => button.dataset.activityFilter === session.activityFilter);
      const name = stringValue(chip?.childNodes[0]?.textContent).trim() || "this filter";
      host.replaceChildren(calloutCard({
        title: `Nothing under ${name.toLowerCase()} yet`,
        body: `Your team has produced ${new Intl.NumberFormat().format(allEntries.length)} events and none of them are ${name.toLowerCase()}. That is a count, not a gap — choose All to see everything they have done.`,
        action: { label: "Show everything", filter: "all" }
      }));
      return;
    }
    if (!selectedTeam()) {
      setDataState(host, "unavailable", "No team is selected, and activity belongs to a team. Open a team from Your teams and its record appears here.");
      return;
    }
    if (tone === "error") {
      setDataState(host, "unavailable", `The activity stream is not delivering right now — it reports “${label}”. Nothing here is a count of zero; it is a reading that did not arrive. Reconnect above to try again.`);
      return;
    }
    if (tone === "loading") {
      setDataState(host, "loading", "Connecting to your team and replaying everything it has already done. This is a live stream, so the first events arrive as soon as it opens.");
      return;
    }
    setDataState(host, "pending", "The stream is connected and your team has not done anything yet. Work starts when you tell your Product Manager what matters — every plan, code change, review and pull request lands here as it happens.", {
      action: { label: "Talk to your Product Manager", view: "overview" }
    });
  }

  // Who produced the stream. The counts are of the buffer on this screen and
  // the label says so; they are not a period anybody measured. Only events
  // that name an agent can be attributed, and the meta line says how many of
  // the total that is rather than quietly dropping the rest.
  function renderActivityAgentSplit(allEntries) {
    const host = ui.activityAgents;
    if (!host) return;
    const meta = ui.activityAgentsMeta;
    const roster = laneRoster();
    if (!roster.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "The crew roster for this team has not been read, so the record cannot be split by who produced it. The events themselves are beside this panel and are unaffected.");
      return;
    }
    const attributed = allEntries.filter((entry) => stringValue(entry.agentId));
    const counted = roster.map((member) => ({
      member,
      count: attributed.filter((entry) => stringValue(entry.agentId) === member.id).length
    }));
    const total = counted.reduce((sum, row) => sum + row.count, 0);
    if (!total) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "Your crew is standing by and has not produced anything yet. The moment one of them works, this splits the record by who did it.", {
        action: { label: "Talk to your Product Manager", view: "overview" }
      });
      return;
    }
    const largest = Math.max(...counted.map((row) => row.count));
    purgeChartGeometry("ga");
    host.replaceChildren();
    host.hidden = false;
    counted
      .slice()
      .sort((left, right) => right.count - left.count)
      .forEach(({ member, count }) => {
        host.append(splitRow({
          code: member.role.code,
          roleKey: member.role.key,
          name: crewDisplayName(member.role),
          figure: `${new Intl.NumberFormat().format(count)} ${count === 1 ? "event" : "events"}`,
          share: largest ? (count / largest) * 100 : 0,
          prefix: "ga"
        }));
      });
    if (meta) {
      meta.hidden = false;
      meta.textContent = `${new Intl.NumberFormat().format(total)} of ${new Intl.NumberFormat().format(allEntries.length)} name an agent`;
    }
  }

  // How far back the record goes, and why it stops there. The activity
  // contract is a stream replayed from a sequence cursor; no procedure lists
  // a page of past events, so there is no "older" control to offer and the
  // screen says that instead of growing a button with nothing behind it.
  function renderActivityReach(allEntries) {
    const host = ui.activityReach;
    if (!host) return;
    const times = allEntries
      .map((entry) => timestampDate(entry.occurredAt)?.getTime())
      .filter((value) => Number.isFinite(value));
    const oldest = times.length ? new Date(Math.min(...times)) : null;
    host.replaceChildren(calloutCard({
      title: oldest ? `Back to ${relativeTime(oldest)}` : "As far back as your team goes",
      body: oldest
        ? `Everything this team has done since it was set up is on this screen — the platform replays the whole record when the stream opens, so there is no older page to load. What is not here has not happened yet.`
        : `The platform replays this team's whole record when the stream opens, so when there is something to show, all of it is here at once. There is no older page to load.`
    }));
  }

  // A Callout explains what you are looking at. (A Notice reports an event
  // from somewhere else, which is why only a Notice carries a source, a time
  // and a code — this carries none of the three.)
  function calloutCard({ title, body, tone = "", action = null }) {
    const host = document.createElement("div");
    host.className = tone ? `dn-callout dn-callout--${tone}` : "dn-callout";
    const icon = document.createElement("span");
    icon.className = "dn-callout__icon";
    icon.append(iconNode(tone === "attention" ? "triangle-alert" : "info"));
    const copy = document.createElement("div");
    copy.className = "dn-callout__copy";
    const heading = document.createElement("div");
    heading.className = "dn-callout__title";
    heading.textContent = title;
    const text = document.createElement("div");
    text.className = "dn-callout__body";
    text.textContent = body;
    copy.append(heading, text);
    if (action) {
      const actions = document.createElement("div");
      actions.className = "dn-callout__actions";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dn-btn dn-btn--secondary dn-btn--sm";
      if (action.view) button.dataset.viewLink = action.view;
      if (action.filter) button.dataset.activityFilter = action.filter;
      button.textContent = action.label;
      actions.append(button);
      copy.append(actions);
    }
    host.append(icon, copy);
    return host;
  }

  function iconNode(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "dn-icon");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.75");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return applyIconMotionTo(svg, name);
  }

  /* ── Runs ───────────────────────────────────────────────────────────────
     A run is one stretch of work in one workspace, and the platform keeps two
     halves of it for a customer: the session's lifecycle and the files it
     changed. Both are already fetched for the whole team in the floor's
     burst, so this screen renders the records the workspace holds instead of
     opening reads of its own — and its paging buttons drive the same two
     loaders the floor's do.

     What it does NOT render is the inside of a run. Spans, generations, token
     counts and time to first token are not on the wire for a customer at all,
     so the panel that would carry them says "uninstrumented" rather than
     drawing an empty trace and calling it a reading. */
  function runDuration(startedAt, endedAt) {
    const start = timestampDate(startedAt);
    const end = endedAt ? timestampDate(endedAt) : null;
    if (!start) return "Not reported";
    if (!end) return "Still running";
    const seconds = Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000));
    if (seconds < 90) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    return minutes < 90 ? `${minutes}m` : `${Math.round(minutes / 60)}h`;
  }

  function runAgentName(agentId) {
    const roster = laneRoster();
    const member = roster.find((entry) => entry.id === stringValue(agentId));
    if (!member) return { name: "A former crew member", code: "·", roleKey: "" };
    return {
      name: crewDisplayName(member.role),
      code: member.role.code,
      roleKey: member.role.key
    };
  }

  function renderRunsView() {
    renderRunSessions();
    renderRunChanges();
    renderRunSpend();
    renderRunTrace();
    if (ui.runsState) {
      const team = selectedTeam();
      const sessions = Array.isArray(session.sessions) ? session.sessions.length : 0;
      const changes = Array.isArray(session.workspaceChanges) ? session.workspaceChanges.length : 0;
      if (!team) setSourceState(ui.runsState, "Waiting for a team", "");
      else if (sessions || changes) setSourceState(ui.runsState, `${sessions} ${sessions === 1 ? "run" : "runs"} · ${changes} ${changes === 1 ? "change" : "changes"}`, "success");
      else setSourceState(ui.runsState, "Nothing recorded yet", "");
    }
  }

  function renderRunSessions() {
    const host = ui.runsSessions;
    if (!host) return;
    const meta = ui.runsSessionsMeta;
    const pager = ui.runsSessionsMore;
    if (pager) {
      pager.hidden = !session.sessionNextPageToken;
      pager.disabled = Boolean(session.sessionHistoryLoading);
    }
    const records = Array.isArray(session.sessions) ? session.sessions : [];
    if (!selectedTeam()) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No team is selected, and a run belongs to a team. Open a team from Your teams and its runs appear here.");
      return;
    }
    if (stringValue(ui.sessionHistoryState?.dataset.tone) === "error" && !records.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "This team's run history could not be read, so none is shown. Nothing here is a count of zero — the record exists and this browser did not get it. Refresh to try again.");
      return;
    }
    if (!records.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "Your team has not started a run yet. A run begins the moment an agent picks up an assignment — and assignments start with what you tell your Product Manager.", {
        action: { label: "Talk to your Product Manager", view: "overview" }
      });
      return;
    }
    const rows = records
      .slice()
      .sort((left, right) => (timestampDate(right.startedAt)?.getTime() || 0) - (timestampDate(left.startedAt)?.getTime() || 0))
      .map((record) => {
        const status = sessionStatusLabel(record.sessionStatus) || "not reported";
        const agent = runAgentName(record.agentId);
        const started = timestampDate(record.startedAt);
        const work = [
          int64Value(record.githubIssueNumber) > 0n ? `Issue ${int64Value(record.githubIssueNumber).toString()}` : "",
          int64Value(record.githubPullRequestNumber) > 0n ? `PR ${int64Value(record.githubPullRequestNumber).toString()}` : ""
        ].filter(Boolean).join(" · ");
        return [
          agent.name,
          ladderBadge(capitalize(status), SESSION_NOTICE_LEVEL[status] || "info"),
          sessionKindLabel(record.sessionKind) === "objective" ? "The objective" : "Delegated work",
          stringValue(record.safeSummary),
          started ? monoCell(relativeTime(started)) : "Not reported",
          runDuration(record.startedAt, record.endedAt),
          work ? monoCell(work) : monoCell("Not attributed")
        ];
      });
    replaceWithTable(host, [
      { label: "Agent" },
      { label: "State" },
      { label: "Kind" },
      { label: "What it did", cellClass: "cs-cell-prose" },
      { label: "Started" },
      { label: "Took", numeric: true },
      { label: "Work" }
    ], rows);
    if (meta) {
      meta.hidden = false;
      const running = records.filter((record) => ["started", "running"].includes(sessionStatusLabel(record.sessionStatus))).length;
      meta.textContent = running
        ? `${records.length} loaded · ${running} still running`
        : `${records.length} loaded · newest first`;
    }
  }

  function renderRunChanges() {
    const host = ui.runsChanges;
    if (!host) return;
    const meta = ui.runsChangesMeta;
    const pager = ui.runsChangesMore;
    if (pager) {
      pager.hidden = !session.workspaceNextPageToken;
      pager.disabled = Boolean(session.workspaceHistoryLoading);
    }
    const records = Array.isArray(session.workspaceChanges) ? session.workspaceChanges : [];
    if (!selectedTeam()) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No team is selected, and a workspace belongs to a team. Open a team from Your teams and the files its runs changed appear here.");
      return;
    }
    if (stringValue(ui.workspaceHistoryState?.dataset.tone) === "error" && !records.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "The record of changed files could not be read, so none is shown. Nothing here is a count of zero — the record exists and this browser did not get it. Refresh to try again.");
      return;
    }
    if (!records.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "No run has changed a file yet. Every file your team touches is recorded here before it reaches a pull request, with the counts of what was added and removed.", {
        action: { label: "Talk to your Product Manager", view: "overview" }
      });
      return;
    }
    const rows = records
      .slice()
      .sort((left, right) => Number((int64Value(right.sequence) || 0n) - (int64Value(left.sequence) || 0n)))
      .map((record) => {
        const additions = int64Value(record.additions);
        const deletions = int64Value(record.deletions);
        const added = document.createElement("span");
        added.dataset.tone = "add";
        added.textContent = additions === null ? "Not reported" : additions === 0n ? "0" : `+${additions.toString()}`;
        const removed = document.createElement("span");
        removed.dataset.tone = "del";
        removed.textContent = deletions === null ? "Not reported" : deletions === 0n ? "0" : `−${deletions.toString()}`;
        const observed = timestampDate(record.observedAt);
        return [
          monoCell(canonicalRelativePath(record.relativePath) || "Path withheld", "cs-cell-path"),
          workspaceChangeKindLabel(record.changeKind) || "not reported",
          added,
          removed,
          runAgentName(record.agentId).name,
          workspaceDiffAvailabilityLabel(record.diffAvailability) === "available" ? "Readable on the ledger" : `Withheld · ${workspaceDiffAvailabilityLabel(record.diffAvailability)}`,
          observed ? monoCell(relativeTime(observed)) : "Not reported"
        ];
      });
    replaceWithTable(host, [
      { label: "File", cellClass: "cs-cell-path" },
      { label: "Change" },
      { label: "Added", numeric: true },
      { label: "Removed", numeric: true },
      { label: "Agent" },
      { label: "Diff" },
      { label: "Seen" }
    ], rows);
    if (meta) {
      meta.hidden = false;
      meta.textContent = `${records.length} loaded · newest first`;
    }
  }

  // What a run cost. The lifecycle record carries no money at all, so this is
  // the measured ledger's own per-session grouping — the same figures the
  // Economics screen totals, cut by run instead of by agent.
  function renderRunSpend() {
    const host = ui.runsSpend;
    if (!host) return;
    const meta = ui.runsSpendMeta;
    if (!selectedTeam()) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No team is selected, and spend is measured per team. Open a team and what each of its runs cost appears here.");
      return;
    }
    if (session.sessionSpendState === "unavailable") {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "The measured ledger did not return a per-run breakdown for this team, so none is shown. The team's totals are on Economics and are unaffected.");
      return;
    }
    if (session.sessionSpendState === "loading" || session.sessionSpendState === "") {
      if (meta) meta.hidden = true;
      setDataState(host, "loading", "Reading what each of this team's runs cost from the measured ledger.");
      return;
    }
    const rows = Array.isArray(session.sessionSpend) ? session.sessionSpend : [];
    if (!rows.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "Nothing has been metered against a run in this billing period yet. The moment an agent makes a billable call, what it cost lands here against the run that made it.", {
        action: { label: "Talk to your Product Manager", view: "overview" }
      });
      return;
    }
    const ranked = rows
      .map((record) => ({ record, credits: int64Value(record.creditsUsedMicros) || 0n }))
      .sort((left, right) => Number(right.credits - left.credits))
      .slice(0, 8);
    const largest = ranked.reduce((most, row) => (row.credits > most ? row.credits : most), 0n);
    purgeChartGeometry("gr");
    host.replaceChildren();
    host.hidden = false;
    ranked.forEach(({ record, credits }) => {
      const scopeId = stringValue(record?.scope?.id);
      const owner = runAgentName(sessionAgentIdFor(scopeId));
      host.append(splitRow({
        code: owner.code,
        roleKey: owner.roleKey,
        name: stringValue(record.displayName) || "One run",
        figure: `${formatCreditMicros(credits)} credits`,
        share: largest > 0n ? Number((credits * 10000n) / largest) / 100 : 0,
        prefix: "gr"
      }));
    });
    if (meta) {
      meta.hidden = false;
      meta.textContent = rows.length > ranked.length ? `Costliest ${ranked.length} of ${rows.length}` : `${rows.length} ${rows.length === 1 ? "run" : "runs"} metered`;
    }
  }

  // Which agent a metered run belongs to, taken from the lifecycle record the
  // workspace already holds. A run the browser has not loaded the lifecycle
  // for gets no plate rather than a guessed one.
  function sessionAgentIdFor(sessionId) {
    const id = stringValue(sessionId);
    if (!id) return "";
    const record = (Array.isArray(session.sessions) ? session.sessions : []).find((entry) => stringValue(entry.id) === id);
    return stringValue(record?.agentId);
  }

  function renderRunTrace() {
    const host = ui.runsTrace;
    if (!host) return;
    setDataState(host, "uninstrumented", "The inside of a run — its spans, its model calls, its token counts and the time to its first token — is not something the platform will hand a browser. The runtime records no message content by policy, and no procedure serves the observations, so there is nothing here to page or filter. What a run did is in its summary beside this panel; what it cost is above it.");
  }

  /* ── People ─────────────────────────────────────────────────────────────
     One row, and the screen says why it is one row. There is no procedure
     that lists an organization's members: what the browser can know about
     people is the signed-in account and the role its own membership carries.
     An empty roster here would imply the others failed to load, and a
     fabricated one would be worse. The rules table beside it is not invented
     either — every line is a check the API makes on every call, and the
     screen says that rather than presenting itself as a per-person read. */
  const MEMBERSHIP_RULES = Object.freeze([
    { action: "Read a team, its runs, its record and its spend", roles: "Any member" },
    { action: "Talk to the Product Manager and answer a decision", roles: "Any member" },
    { action: "Create, pause, resume or delete a team", roles: "Owner or admin" },
    { action: "Change a team's repositories or how many engineers it runs", roles: "Owner or admin" },
    { action: "Start the subscription, open the Stripe portal, buy credits", roles: "Owner or billing" },
    { action: "Change a team's budget or pause its spending", roles: "Owner or billing" }
  ]);

  function renderPeopleView() {
    renderPeopleRoster();
    renderPeopleReach();
    renderPeopleAccess();
    renderPeopleRules();
    if (ui.peopleState) {
      if (!session.organizationId) setSourceState(ui.peopleState, "Waiting", "");
      else setSourceState(ui.peopleState, "1 of 1 the platform reports", "success");
    }
  }

  function renderPeopleRoster() {
    const host = ui.peopleRoster;
    if (!host) return;
    const meta = ui.peopleRosterMeta;
    const members = Array.isArray(session.members) ? session.members : [];
    if (!session.organizationId || !members.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No organization is established for this session yet, so the platform has not said who you are in it. Choose an organization in the header and your membership appears here.");
      return;
    }
    const rows = members.map((member) => {
      const identity = document.createElement("span");
      identity.className = "cs-splitrow__name";
      identity.textContent = `${stringValue(member.name)}${member.self ? " (you)" : ""}`;
      const plate = document.createElement("span");
      plate.className = "user-avatar crew-monogram-xs";
      plate.setAttribute("aria-hidden", "true");
      plate.textContent = (stringValue(member.name).charAt(0) || "?").toUpperCase();
      const person = document.createElement("span");
      person.className = "cs-person";
      person.append(plate, identity);
      const role = stringValue(member.role);
      return [
        person,
        monoCell(stringValue(member.login) || "Not reported"),
        role ? ladderBadge(capitalize(role), "info") : ladderBadge("Role not reported", "warning")
      ];
    });
    replaceWithTable(host, [
      { label: "Person" },
      { label: "GitHub login" },
      { label: "Role" }
    ], rows);
    if (meta) {
      meta.hidden = false;
      meta.textContent = members.length === 1 ? "One person" : `${members.length} people`;
    }
  }

  function renderPeopleReach() {
    const host = ui.peopleReach;
    if (!host) return;
    host.replaceChildren(calloutCard({
      title: "One row is the whole answer, not a partial one",
      body: "The platform does not serve a member list to a browser. What it will confirm is the account you signed in with and the role your own membership carries, so that is the one row above — nobody else failed to load, and nobody is hidden. Membership itself is managed on your GitHub organization; changes there are what change this."
    }));
  }

  function renderPeopleAccess() {
    const host = ui.peopleAccess;
    if (!host) return;
    const member = (Array.isArray(session.members) ? session.members : []).find((entry) => entry.self);
    if (!member) {
      setDataState(host, "unavailable", "Your membership has not been confirmed for this session, so the access it carries cannot be stated.");
      return;
    }
    const role = stringValue(member.role);
    const list = document.createElement("dl");
    list.className = "dn-meta dn-meta--rows";
    const rows = [
      ["Signed in as", stringValue(member.name)],
      ["GitHub login", stringValue(member.login) || "Not reported"],
      ["Organization", stringValue(session.organizationName) || "Not selected"],
      ["Role", role ? capitalize(role) : "The platform did not report a role"]
    ];
    rows.forEach(([key, value]) => {
      const term = document.createElement("dt");
      term.className = "dn-meta__k";
      term.textContent = key;
      const detail = document.createElement("dd");
      detail.className = "dn-meta__v";
      detail.textContent = value;
      list.append(term, detail);
    });
    host.replaceChildren(list);
    host.hidden = false;
  }

  function renderPeopleRules() {
    const host = ui.peopleRules;
    if (!host) return;
    replaceWithTable(host, [{ label: "What", cellClass: "cs-cell-prose" }, { label: "Who may" }],
      MEMBERSHIP_RULES.map((rule) => [rule.action, rule.roles]));
  }

  /* ── Billing ────────────────────────────────────────────────────────────
     Organization scope. The subscription licenses the ORGANIZATION and its
     quantity is pinned at one, so nothing on this screen multiplies a price
     by a team count: the teams table is a roster of what the one licence
     already covers, not a bill. The only figure that is authoritatively what
     you paid is an invoice, and the invoices are on the same screen.

     The credit reading is the organization's own measured summary, because
     that is the only credit figure that is organization-scoped. The per-team
     balances belong to Economics and are deliberately NOT summed here: the
     pool is shared, so adding it up once per team would count the same
     credits several times. */
  // The organization's subscription price, taken from the plan the billing
  // service confirmed and from nowhere else. There is deliberately no default:
  // a price nobody served is a price we would be inventing, and this is the
  // screen where a customer checks what they pay.
  function organizationSubscriptionCents() {
    const money = session.billingPlan?.recurringPrice;
    const units = signedInt64Value(money?.units);
    const nanos = Number(money?.nanos || 0);
    if (units === null || units < 0n || !Number.isInteger(nanos) || Math.abs(nanos) > 999_999_999) return null;
    const cents = units * 100n + BigInt(Math.round(nanos / 10_000_000));
    return cents > 0n ? cents : null;
  }

  function organizationSubscriptionLabel() {
    const cents = organizationSubscriptionCents();
    return cents === null ? "Shown at checkout" : `${formatCents(cents)}/month`;
  }

  // ── Automatic credit top-up ───────────────────────────────────────────────
  //
  // Engineering credits are one pool per ORGANIZATION. When it empties, every
  // team in the organization stops mid-objective — which is the failure this
  // exists to prevent: below a threshold the customer sets, the card already on
  // file is charged for a credit pack, without them present.
  //
  // "Without them present" is the whole design, and two things follow from it
  // that this screen has to carry honestly rather than decorate.
  //
  // CONSENT IS NOT A TOGGLE. The card networks require a recorded agreement for
  // an unscheduled off-session charge. The server publishes the exact text and
  // version it will record, and a CHECK constraint refuses to store an enabled
  // policy without a version, a timestamp and a user — an enabled policy with no
  // consent is literally unstorable. So the terms are rendered VERBATIM from
  // required_consent rather than paraphrased, the opt-in ships unticked, and the
  // version is echoed back on save. Paraphrasing would also break the
  // disclosures Stripe requires: timing, frequency, how the amount is
  // determined, and how to cancel.
  //
  // A DECLINE DISARMS THE ORGANIZATION, TERMINALLY. Off session, Strong Customer
  // Authentication does not arrive as a state a server can hold open — Stripe
  // reports it as a decline only the customer can clear, on session. So a
  // decline is never retried; it stores a disarm that persists until the
  // customer fixes the card AND re-arms with fresh consent. Turning the toggle
  // back on does not fix a declined card, and the screen says so in those words,
  // because a customer who believes it does will sit disarmed believing they are
  // covered.
  const CREDIT_TOP_UP_STATES = Object.freeze({
    1: Object.freeze({ word: "Decided", level: "info", detail: "Recorded, and no charge has been issued yet." }),
    2: Object.freeze({ word: "Charging", level: "running", detail: "A charge was issued and its outcome is not recorded yet. It is never charged twice." }),
    3: Object.freeze({ word: "Granted", level: "success", detail: "Paid, and the credits are in your organization's pool." }),
    4: Object.freeze({ word: "Declined", level: "blocked", detail: "The card was declined. This is never retried automatically." }),
    5: Object.freeze({ word: "Needs your bank", level: "blocked", detail: "Your bank asked for authentication, which cannot be completed while you are away." }),
    6: Object.freeze({ word: "Abandoned", level: "info", detail: "Stopped before any money moved." })
  });

  // Two of these are STORED disarms that persist until the customer acts; the
  // rest are computed at read time and clear by themselves. The difference is
  // the difference between "you must do something" and "wait", so it decides
  // the level: a stored disarm is `blocked` — rank 0, needs you — and never
  // `warning`, which would let a customer scroll past an organization that has
  // silently stopped refilling.
  const CREDIT_TOP_UP_BLOCKS = Object.freeze({
    2: Object.freeze({
      level: "blocked",
      title: "Your card was declined, so automatic top-up switched itself off",
      body: "The charge was refused and we will not try it again. Turning this back on will not fix it: update the card in Stripe first, then re-arm here and agree to the terms again."
    }),
    3: Object.freeze({
      level: "blocked",
      title: "Your bank wants to check it is you, and automatic top-up switched itself off",
      body: "That check cannot be completed while you are away, so the charge was refused and we will not try it again. Buy a pack yourself once to satisfy your bank, then re-arm here and agree to the terms again."
    }),
    4: Object.freeze({
      level: "warning",
      title: "This period's automatic top-up ceiling is spent",
      body: "Nothing more will be charged automatically until your billing period resets. Raise the ceiling below if you want more headroom."
    }),
    5: Object.freeze({
      level: "blocked",
      title: "Automatic top-up cannot run without an active subscription",
      body: "It never charges against an inactive subscription. Restore the subscription and it resumes on its own."
    }),
    6: Object.freeze({
      level: "blocked",
      title: "There is no saved card to charge",
      body: "Add a payment method in Stripe and automatic top-up resumes on its own."
    }),
    7: Object.freeze({
      level: "info",
      title: "Cooling off after the last top-up",
      body: "A short wait after each top-up is what stops a pool that drains as fast as it fills from becoming a charge loop."
    })
  });

  function creditTopUpEnumKey(value, prefix) {
    if (typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    const normalized = stringValue(value).replace(prefix, "");
    return normalized;
  }

  function creditTopUpStateShape(value) {
    const key = creditTopUpEnumKey(value, /^CREDIT_TOP_UP_STATE_/);
    if (typeof key === "number") return CREDIT_TOP_UP_STATES[key] || null;
    const byName = { PENDING: 1, CHARGING: 2, GRANTED: 3, DECLINED: 4, AUTHENTICATION_REQUIRED: 5, ABANDONED: 6 }[key];
    return byName ? CREDIT_TOP_UP_STATES[byName] : null;
  }

  function creditTopUpBlockShape(value) {
    const key = creditTopUpEnumKey(value, /^CREDIT_TOP_UP_BLOCK_REASON_/);
    if (typeof key === "number") return CREDIT_TOP_UP_BLOCKS[key] || null;
    const byName = {
      CARD_DECLINED: 2, AUTHENTICATION_REQUIRED: 3, PERIOD_CAP_REACHED: 4,
      SUBSCRIPTION_INACTIVE: 5, NO_PAYMENT_METHOD: 6, COOLING_DOWN: 7
    }[key];
    return byName ? CREDIT_TOP_UP_BLOCKS[byName] : null;
  }

  async function refreshCreditTopUp() {
    if (!ui.topUpPanel) return;
    if (!session.organizationId) {
      session.creditTopUp = null;
      session.creditTopUpState = "waiting";
      renderCreditTopUp();
      return;
    }
    session.creditTopUpState = "loading";
    renderCreditTopUp();
    const [settings, history] = await Promise.allSettled([
      apiRequest("credit_top_up_settings", { organizationId: session.organizationId }),
      apiRequest("credit_top_ups", { organizationId: session.organizationId, page: { pageSize: 20, pageToken: "" } })
    ]);
    if (settings.status === "fulfilled" && settings.value?.settings) {
      session.creditTopUp = settings.value.settings;
      session.creditTopUpState = "loaded";
      session.creditTopUpError = "";
    } else {
      session.creditTopUp = null;
      session.creditTopUpState = "unavailable";
      session.creditTopUpError = settings.status === "rejected"
        ? apiErrorMessage(settings.reason, "Automatic top-up settings are unavailable.")
        : "BillingService returned no automatic top-up settings. Nothing was assumed about whether it is armed.";
    }
    if (history.status === "fulfilled") {
      session.creditTopUps = Array.isArray(history.value?.topUps) ? history.value.topUps : [];
      session.creditTopUpsState = "loaded";
    } else {
      session.creditTopUps = [];
      session.creditTopUpsState = "unavailable";
    }
    renderCreditTopUp();
    renderCreditTopUpHistory(history.status === "rejected" ? apiErrorMessage(history.reason, "") : "");
  }

  function renderCreditTopUp() {
    if (!ui.topUpPanel) return;
    const settings = session.creditTopUp;
    // The panel belongs to the organization, and there is nothing to arm until
    // a subscription exists to charge against.
    ui.topUpPanel.hidden = !session.organizationId;
    if (!session.organizationId) return;

    // Four empties, and these are two of them. "Loading" is a claim about right
    // now; "waiting" is that nothing has asked yet. Neither is "unavailable",
    // which is a claim that the read was attempted and failed.
    if (session.creditTopUpState === "loading" || session.creditTopUpState === "waiting") {
      const loading = session.creditTopUpState === "loading";
      setSourceState(ui.topUpState, loading ? "Loading" : "Waiting", loading ? "loading" : "");
      setDataState(ui.topUpSummary, loading ? "loading" : "pending",
        loading
          ? "Reading whether this organization refills itself."
          : "Automatic top-up has not been read for this organization yet.");
      ui.topUpForm.hidden = true;
      if (ui.topUpNotice) ui.topUpNotice.replaceChildren();
      return;
    }
    if (!settings) {
      setSourceState(ui.topUpState, "Unavailable", "error");
      setDataState(ui.topUpSummary, "unavailable", session.creditTopUpError || "Automatic top-up settings are unavailable.");
      ui.topUpForm.hidden = true;
      if (ui.topUpNotice) ui.topUpNotice.replaceChildren();
      return;
    }

    const enabled = Boolean(settings.enabled);
    const reArmRequired = Boolean(settings.reArmRequired);
    const block = creditTopUpBlockShape(settings.blockReason);

    // THE LADDER DECIDES THE LOUDNESS, not the screen. A stored disarm with a
    // failing card is `blocked` — it needs a person, and it is the only thing on
    // this panel that does.
    if (ui.topUpNotice) {
      ui.topUpNotice.replaceChildren();
      if (block) {
        const eligible = timestampDate(settings.nextEligibleAt);
        const body = reArmRequired
          ? `${block.body} Until you do, nothing is refilled and your teams stop when the pool empties.`
          : eligible
            ? `${block.body} The next one can be decided ${relativeTime(eligible)}.`
            : block.body;
        const notice = buildNotice({
          level: block.level,
          title: block.title,
          body,
          source: "Billing"
        });
        if (notice) ui.topUpNotice.append(notice);
      }
    }

    setSourceState(
      ui.topUpState,
      reArmRequired ? "Disarmed" : enabled ? (block ? "Armed, blocked" : "Armed") : "Off",
      reArmRequired ? "error" : enabled ? (block ? "attention" : "success") : ""
    );
    renderCreditTopUpSummary(settings, enabled, reArmRequired, block);
    renderCreditTopUpForm(settings, enabled, reArmRequired);
  }

  function renderCreditTopUpSummary(settings, enabled, reArmRequired, block) {
    const rows = [];
    rows.push(["State", reArmRequired
      ? "Disarmed — it will not fire until you re-arm it"
      : enabled
        ? (block ? "On, but nothing can fire right now" : "On")
        : "Off — nothing is charged automatically"]);
    rows.push(["Fires when the pool falls to", `${formatCreditMicros(settings.thresholdMicros)} credits`]);
    const pack = session.creditPacks.find((candidate) => stringValue(candidate.id) === stringValue(settings.creditPackId));
    const quantity = int64Value(settings.packQuantity);
    rows.push(["Each top-up buys", pack
      ? `${quantity === null ? "1" : quantity.toString()} × ${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)} each`
      : stringValue(settings.creditPackId) || "Not reported"]);
    rows.push(["Ceiling this billing period", `${formatCanonicalMoney(settings.periodSpent)} spent of ${formatCanonicalMoney(settings.periodCap)}`]);
    const cooldown = int64Value(settings.cooldownSeconds);
    rows.push(["Wait between top-ups", cooldown === null
      ? "Not reported"
      : `${Math.round(Number(cooldown) / 60)} minutes, set by deep navy`]);
    const consent = settings.consent;
    const recorded = timestampDate(consent?.recordedAt);
    rows.push(["Your agreement", recorded
      ? `Version ${stringValue(consent.termsVersion) || "not reported"}, recorded ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(recorded)}`
      : "Not given yet — automatic top-up cannot be switched on without it"]);

    const list = document.createElement("dl");
    list.className = "dn-meta dn-meta--rows";
    rows.forEach(([key, value]) => {
      const term = document.createElement("dt");
      term.className = "dn-meta__k";
      term.textContent = key;
      const detail = document.createElement("dd");
      detail.className = "dn-meta__v";
      detail.textContent = value;
      list.append(term, detail);
    });
    const note = document.createElement("p");
    note.className = "cs-stub-note";
    note.textContent = "A top-up funds the organization's shared pool. It never raises a team's own hard limit — a team stopped by the ceiling you set for it is stopped on purpose, and buying credits is not the fix for that.";
    ui.topUpSummary.replaceChildren(list, note);
    ui.topUpSummary.hidden = false;
  }

  function renderCreditTopUpForm(settings, enabled, reArmRequired) {
    const form = ui.topUpForm;
    if (!form) return;
    const manageable = Boolean(session.subscriptionManageable);
    form.hidden = false;

    if (!topUpFormDirty) {
      ui.topUpEnabled.checked = enabled;
      ui.topUpThreshold.value = microsInputValue(settings.thresholdMicros);
      ui.topUpQuantity.value = (int64Value(settings.packQuantity) ?? 1n).toString();
      const capMinor = signedInt64Value(settings.periodCap?.units);
      const capNanos = Number(settings.periodCap?.nanos || 0);
      if (capMinor !== null) {
        ui.topUpCap.value = (Number(capMinor) + capNanos / 1_000_000_000).toFixed(2);
      }
      ui.topUpPack.replaceChildren();
      session.creditPacks.forEach((pack) => {
        const option = document.createElement("option");
        option.value = stringValue(pack.id);
        option.textContent = `${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)}`;
        ui.topUpPack.append(option);
      });
      if (session.creditPacks.some((pack) => stringValue(pack.id) === stringValue(settings.creditPackId))) {
        ui.topUpPack.value = stringValue(settings.creditPackId);
      }
    }

    const ready = manageable && session.creditPacks.length > 0;
    [ui.topUpEnabled, ui.topUpThreshold, ui.topUpPack, ui.topUpQuantity, ui.topUpCap].forEach((field) => {
      if (field) field.disabled = !ready;
    });
    if (ui.topUpCapNote) {
      // The ceiling is the one number that bounds total exposure, so what has
      // already been spent against it belongs beside the field, not three rows
      // away in the summary.
      ui.topUpCapNote.textContent = `${formatCanonicalMoney(settings.periodSpent)} of the current ceiling has been spent this billing period. The ceiling resets when your billing period does.`;
    }
    renderCreditTopUpConsent(settings, reArmRequired);
    updateCreditTopUpSummaryLine(reArmRequired);
    setFieldError(ui.topUpError, ready ? "" : (!manageable
      ? "Only an owner or a billing member can change automatic top-up."
      : "No prepaid packs are available, so there is nothing to buy automatically."));
    ui.topUpSubmit.disabled = !ready || !creditTopUpFormSatisfied(settings);
  }

  // The terms, exactly as the server publishes them. Rendered paragraph by
  // paragraph with textContent — never paraphrased, never summarised, and never
  // assembled from a string. What the customer reads has to be what the server
  // records, or the record is of an agreement they were not shown.
  function renderCreditTopUpConsent(settings, reArmRequired) {
    const block = ui.topUpConsent;
    if (!block) return;
    const required = settings.requiredConsent;
    const text = stringValue(required?.text);
    const version = stringValue(required?.version);
    const wanted = creditTopUpConsentRequired();
    block.hidden = !wanted;
    if (!wanted) {
      ui.topUpConsentAccept.checked = false;
      return;
    }
    if (!text || !version) {
      ui.topUpConsentText.replaceChildren();
      setDataState(ui.topUpConsentText, "unavailable", "BillingService did not publish the agreement, so there is nothing to consent to. Automatic top-up cannot be switched on until it does.");
      ui.topUpConsentAccept.disabled = true;
      ui.topUpConsentVersion.textContent = "";
      return;
    }
    ui.topUpConsentAccept.disabled = false;
    // Re-arming is a different act from arming, and the customer should be told
    // which one they are performing.
    if (ui.topUpConsentTitle) {
      ui.topUpConsentTitle.textContent = reArmRequired
        ? "Agree again to re-arm automatic top-up"
        : stringValue(settings.consent?.termsVersion) && stringValue(settings.consent.termsVersion) !== version
          ? "These terms have changed since you last agreed"
          : "Your agreement";
    }
    const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
    ui.topUpConsentText.replaceChildren(...paragraphs.map((part) => {
      const p = document.createElement("p");
      p.textContent = part;
      return p;
    }));
    ui.topUpConsentVersion.textContent = `These are version ${version}. Agreeing records that version, the time, and that it was you.`;
  }

  // Consent is demanded exactly when the server demands it: on any request that
  // ENABLES automatic top-up, and on any re-arm. A re-arm can only happen on a
  // request that enables, so "the enable box is ticked" covers both and there is
  // nothing else to consult. Turning it off never needs consent — a customer can
  // always stop an unattended charge.
  function creditTopUpConsentRequired() {
    return Boolean(ui.topUpEnabled?.checked);
  }

  function creditTopUpFormSatisfied(settings) {
    if (!creditTopUpConsentRequired()) return true;
    // Nothing to agree to means nothing can be armed: the server refuses a
    // version it does not publish, so the button must too.
    if (!stringValue(settings.requiredConsent?.version)) return false;
    return Boolean(ui.topUpConsentAccept?.checked);
  }

  function updateCreditTopUpSummaryLine(reArmRequired) {
    const line = ui.topUpSummaryLine;
    if (!line) return;
    if (!creditTopUpConsentRequired()) {
      line.textContent = "Saving with this off stops all future automatic charges immediately. It does not reverse a charge already made.";
      return;
    }
    const pack = session.creditPacks.find((candidate) => stringValue(candidate.id) === stringValue(ui.topUpPack?.value));
    const quantity = Number(ui.topUpQuantity?.value || 1);
    const threshold = creditInputMicros(ui.topUpThreshold?.value);
    const parts = [];
    if (threshold !== null) parts.push(`When the organization pool falls to ${formatCreditMicros(threshold)} credits`);
    if (pack && Number.isInteger(quantity) && quantity > 0) {
      parts.push(`charge your saved card for ${quantity} × ${stringValue(pack.name) || formatCredits(pack.creditMicros)}`);
    }
    const cap = Number(ui.topUpCap?.value || 0);
    if (Number.isFinite(cap) && cap > 0) parts.push(`never more than ${formatCents(BigInt(Math.round(cap * 100)))} in a billing period`);
    line.textContent = parts.length
      ? `${parts.join(", ")}.${reArmRequired ? " Saving this also re-arms it after the decline." : ""}`
      : "Choose a threshold, a pack and a ceiling.";
  }

  async function saveCreditTopUp(event) {
    event.preventDefault();
    if (!session.organizationId || !session.creditTopUp) return;
    const settings = session.creditTopUp;
    const enabled = Boolean(ui.topUpEnabled.checked);
    const reArmRequired = Boolean(settings.reArmRequired);
    const threshold = creditInputMicros(ui.topUpThreshold.value);
    const quantity = Number(ui.topUpQuantity.value);
    const capDollars = Number(ui.topUpCap.value);
    const packId = stringValue(ui.topUpPack.value);

    if (threshold === null || threshold <= 0n) return setFieldError(ui.topUpError, "Give a threshold above zero, in credits.");
    if (!Number.isInteger(quantity) || quantity < 1) return setFieldError(ui.topUpError, "Choose at least one pack per top-up.");
    if (!Number.isFinite(capDollars) || capDollars <= 0) return setFieldError(ui.topUpError, "Give a per-period ceiling above zero.");
    if (!packId) return setFieldError(ui.topUpError, "Choose the pack to buy.");
    // The client refuses before the server does, because a refusal that costs a
    // round trip reads as a bug rather than as a rule.
    if (enabled && !ui.topUpConsentAccept.checked) {
      return setFieldError(ui.topUpError, "Automatic top-up cannot be switched on until you agree to the terms above. They are what your card issuer requires us to record before charging you while you are away.");
    }
    const version = stringValue(settings.requiredConsent?.version);
    if (enabled && !version) {
      return setFieldError(ui.topUpError, "The agreement to record is unavailable, so automatic top-up cannot be switched on right now.");
    }

    const capMinor = BigInt(Math.round(capDollars * 100));
    const expectedVersion = int64Value(settings.version) ?? 0n;
    const fingerprint = `${session.organizationId}:${enabled}:${threshold.toString()}:${packId}:${quantity}:${capMinor.toString()}:${expectedVersion.toString()}`;
    ui.topUpSubmit.disabled = true;
    ui.topUpSubmit.textContent = "Saving…";
    try {
      const result = await apiRequest("update_credit_top_up_settings", {
        organizationId: session.organizationId,
        enabled,
        thresholdMicros: threshold.toString(),
        creditPackId: packId,
        packQuantity: String(quantity),
        periodCapMinor: capMinor.toString(),
        // Echoed, never invented: the server refuses a version it does not
        // publish, and only sends one when enabling.
        consentTermsVersion: enabled ? version : "",
        // A re-arm clears the stored disarm, and is refused without consent.
        reArm: Boolean(enabled && reArmRequired),
        expectedVersion: expectedVersion.toString(),
        idempotencyKey: mutationKeys.for("updateCreditTopUp", fingerprint)
      });
      if (!result?.settings) throw new ApiError("Billing service returned no automatic top-up settings", 0, "invalid_response", "");
      mutationKeys.clear("updateCreditTopUp");
      session.creditTopUp = result.settings;
      session.creditTopUpState = "loaded";
      topUpFormDirty = false;
      renderCreditTopUp();
      toast(enabled ? "Automatic top-up is armed." : "Automatic top-up is off.", "success");
      // A save that armed it may also have cleared a disarm, which changes the
      // history; and a decline recorded since the last read belongs on screen.
      refreshCreditTopUp();
    } catch (error) {
      setFieldError(ui.topUpError, apiErrorMessage(error, "Automatic top-up settings were not saved."));
      if (error instanceof ApiError && ["aborted", "failed_precondition"].includes(error.code)) refreshCreditTopUp();
    } finally {
      ui.topUpSubmit.textContent = "Save top-up settings";
      if (session.creditTopUp) renderCreditTopUp();
    }
  }

  function renderCreditTopUpHistory(errorMessage = "") {
    const list = ui.topUpHistoryList;
    const empty = ui.topUpHistoryEmpty;
    if (!list || !empty) return;
    const records = Array.isArray(session.creditTopUps) ? session.creditTopUps : [];
    if (session.creditTopUpsState === "unavailable") {
      list.hidden = true;
      setDataState(empty, "unavailable", errorMessage || "The automatic top-up history is unavailable. Nothing was inferred from its absence.");
      setSourceState(ui.topUpHistoryState, "Unavailable", "error");
      return;
    }
    if (!records.length) {
      list.hidden = true;
      // A zero here is a real claim and it is the right one: we read the record
      // and it is empty. That is not the same as not having read it.
      setDataState(empty, "pending", "No automatic top-up has ever run for this organization. One will appear here the moment the first is decided, whether or not it succeeds.");
      setSourceState(ui.topUpHistoryState, "None yet", "");
      return;
    }
    empty.hidden = true;
    list.replaceChildren();
    records.forEach((record) => {
      list.append(creditTopUpRow(record));
    });
    list.hidden = false;
    setSourceState(ui.topUpHistoryState, `${records.length} recorded`, "success");
  }

  function creditTopUpRow(record) {
    const shape = creditTopUpStateShape(record?.state) || { word: "Recorded", level: "info", detail: "" };
    const row = document.createElement("li");
    row.className = "credit-movement-row";

    const kind = document.createElement("span");
    kind.className = "credit-movement-kind";
    kind.append(ladderBadge(shape.word, shape.level));

    const what = document.createElement("span");
    what.className = "credit-movement-what";
    const quantity = int64Value(record?.packQuantity);
    const packName = stringValue(record?.creditPackId) || "a credit pack";
    // Automatic, and said so on every row: the ledger reason the server writes
    // is automatic_credit_top_up rather than prepaid_credit_pack, and a customer
    // reading a list of charges needs to know which ones they did not make.
    what.textContent = `Charged automatically · ${quantity === null ? "1" : quantity.toString()} × ${packName}`;

    const amount = document.createElement("span");
    amount.className = "credit-movement-delta";
    amount.dataset.direction = "credit";
    const credits = int64Value(record?.creditMicros);
    amount.textContent = record?.amount
      ? `${formatCanonicalMoney(record.amount)}${credits === null ? "" : ` · +${formatCreditMicros(credits)} credits`}`
      : "Not reported";

    const meta = document.createElement("span");
    meta.className = "credit-movement-meta";
    const parts = [];
    // WHY IT FIRED, captured at the decision and never recomputed.
    const threshold = int64Value(record?.thresholdMicros);
    const observed = signedInt64Value(record?.observedBalanceMicros);
    if (threshold !== null && observed !== null) {
      parts.push(`pool was ${formatCreditMicros(observed)} against a threshold of ${formatCreditMicros(threshold)}`);
    }
    // The server's own safe sentence is preferred over anything written here:
    // it says what happened, what it means and what happens next, and it is the
    // only thing that knows the decline.
    const safe = stringValue(record?.safeMessage);
    if (safe) parts.push(safe);
    else if (shape.detail) parts.push(shape.detail);
    const decline = stringValue(record?.declineCode);
    if (decline) parts.push(`reason ${decline}`);
    const settled = timestampDate(record?.settledAt) || timestampDate(record?.createdAt);
    if (settled) parts.push(relativeTime(settled));
    meta.textContent = parts.join(" · ");

    row.append(kind, what, amount);
    if (parts.length) row.append(meta);
    return row;
  }

  function renderBillingView() {
    renderBillingStats();
    renderCreditTopUp();
    renderBillingSubscription();
    renderBillingTeams();
    renderBillingCredits();
    if (ui.billingPortal) ui.billingPortal.disabled = !session.subscriptionManageable || checkoutOpening;
    if (ui.billingState) {
      if (!session.organizationId) setSourceState(ui.billingState, "Waiting", "");
      else if (session.subscriptionManageable) {
        const status = subscriptionStatusLabel(session.subscription) || "active";
        setSourceState(ui.billingState, session.subscriptionActive ? "Active" : capitalize(status), session.subscriptionActive ? "success" : "attention");
      } else setSourceState(ui.billingState, "No subscription yet", "");
    }
  }

  function billingStat(label, value, unit = "") {
    const stat = document.createElement("div");
    stat.className = "dn-stat";
    const name = document.createElement("span");
    name.className = "dn-stat__label";
    name.textContent = label;
    const figure = document.createElement("span");
    figure.className = "dn-stat__value";
    figure.textContent = value;
    if (unit) {
      const suffix = document.createElement("span");
      suffix.className = "dn-stat__unit";
      suffix.textContent = unit;
      figure.append(suffix);
    }
    stat.append(name, figure);
    return stat;
  }

  function renderBillingStats() {
    const host = ui.billingStats;
    if (!host) return;
    const plan = session.billingPlan;
    if (!plan) {
      host.hidden = true;
      return;
    }
    // Every team the licence covers, which is every team that exists: a team
    // still provisioning is covered too, and counting only the active ones
    // made this stat disagree with the roster directly below it.
    const covered = session.teams.filter((team) => lifecycleLabel(team?.state) !== "deleted").length;
    const periodEnds = timestampDate(session.subscription?.currentPeriodEndsAt);
    const included = int64Value(plan.includedCreditMicros);
    host.replaceChildren(
      billingStat("Subscription", organizationSubscriptionCents() === null ? "At checkout" : formatCents(organizationSubscriptionCents()), organizationSubscriptionCents() === null ? "" : session.billingPlan?.interval === 2 || session.billingPlan?.interval === "BILLING_INTERVAL_YEAR" ? "/ year" : "/ month"),
      billingStat("Teams it covers", new Intl.NumberFormat().format(covered), "· no limit"),
      billingStat("Credits included", included !== null && included > 0n ? formatCreditMicros(included) : "Shown at checkout", included !== null && included > 0n ? "· each period" : ""),
      billingStat(session.subscription?.cancelAtPeriodEnd ? "Ends" : "Renews", periodEnds ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(periodEnds) : "Not reported")
    );
    host.hidden = false;
  }

  function engineerSeatsAboveFloor() {
    return session.teams.reduce((total, team) => {
      if (["pending", "deleting", "deleted"].includes(lifecycleLabel(team?.state))) return total;
      const count = Number(team?.engineerCount || 0);
      return total + (Number.isInteger(count) && count > ENGINEER_FLOOR ? count - ENGINEER_FLOOR : 0);
    }, 0);
  }

  function renderBillingSubscription() {
    const host = ui.billingSubscription;
    if (!host) return;
    const meta = ui.billingSubscriptionMeta;
    if (!session.organizationId) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No organization is established for this session, and a subscription belongs to one. Choose an organization in the header and its billing appears here.");
      return;
    }
    if (session.billingPlanError && !session.billingPlan) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", session.billingPlanError);
      return;
    }
    if (!session.subscriptionManageable) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "This organization has no subscription yet. It starts the first time you create a team: a card is collected once in secure Stripe checkout and then reused, and deep navy never sees the card itself.", {
        action: { label: "Create your first team", view: "dashboard" }
      });
      return;
    }
    const status = subscriptionStatusLabel(session.subscription) || "active";
    const seats = engineerSeatsAboveFloor();
    const card = paymentMethodSummary(session.subscription?.defaultPaymentMethod);
    const periodEnds = timestampDate(session.subscription?.currentPeriodEndsAt);
    const list = document.createElement("dl");
    list.className = "dn-meta dn-meta--rows";
    const rows = [
      ["Plan", stringValue(session.billingPlan?.name) || stringValue(session.billingPlan?.id) || "Not reported"],
      ["State", status === "active" ? "Active" : capitalize(status)],
      ["Base licence", organizationSubscriptionCents() === null
        ? "The billing service did not report the plan price, so it is not shown here. Your invoice below carries what you were charged."
        : `${formatCents(organizationSubscriptionCents())} a month for this organization · as many teams as you need`],
      ["Engineers", seats
        ? `${seats} above the floor of ${ENGINEER_FLOOR} across your teams, at no per-seat charge`
        : `Every team is at the floor of ${ENGINEER_FLOOR}. Engineers are not charged per seat either way`],
      [session.subscription?.cancelAtPeriodEnd ? "Ends" : "Renews", periodEnds ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(periodEnds) : "Not reported"],
      ["Card on file", card || "No card on file"]
    ];
    rows.forEach(([key, value]) => {
      const term = document.createElement("dt");
      term.className = "dn-meta__k";
      term.textContent = key;
      const detail = document.createElement("dd");
      detail.className = "dn-meta__v";
      detail.textContent = value;
      list.append(term, detail);
    });
    const note = document.createElement("p");
    note.className = "cs-stub-note";
    note.textContent = "The amount you were actually charged is an invoice, and the invoices are below. Nothing on this screen is computed as your bill.";
    host.replaceChildren(list, note);
    host.hidden = false;
    if (meta) {
      meta.hidden = false;
      meta.textContent = card ? "Card held by Stripe" : "No card yet";
    }
  }

  function renderBillingTeams() {
    const host = ui.billingTeams;
    if (!host) return;
    const meta = ui.billingTeamsMeta;
    const teams = session.teams.filter((team) => !["deleted"].includes(lifecycleLabel(team?.state)));
    if (!session.organizationId) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No organization is established for this session, so there is no roster to cover.");
      return;
    }
    if (!teams.length) {
      if (meta) meta.hidden = true;
      setDataState(host, "pending", "There are no teams on this licence yet. The subscription covers as many as you want to run, so the first one costs no more than the second.", {
        action: { label: "Create a team", view: "dashboard" }
      });
      return;
    }
    const rows = teams.map((team) => {
      const state = lifecycleLabel(team?.state) || "not reported";
      const engineers = Number(team?.engineerCount || 0);
      const above = Number.isInteger(engineers) && engineers > ENGINEER_FLOOR ? engineers - ENGINEER_FLOOR : 0;
      return [
        stringValue(team.name) || "Unnamed team",
        stringValue(team.objective) || "No objective stated yet",
        ladderBadge(capitalize(state), state === "active" ? "success" : state === "failed" ? "error" : state === "suspended" ? "warning" : "info"),
        Number.isInteger(engineers) && engineers > 0 ? String(engineers) : "Not reported",
        above ? String(above) : "0"
      ];
    });
    replaceWithTable(host, [
      { label: "Team" },
      { label: "Objective", cellClass: "cs-cell-prose" },
      { label: "State" },
      { label: "Engineers", numeric: true },
      { label: "Above the floor", numeric: true },
    ], rows);
    if (meta) {
      meta.hidden = false;
      meta.textContent = `${teams.length} ${teams.length === 1 ? "team" : "teams"} · all covered by the one licence`;
    }
  }

  function renderBillingCredits() {
    const host = ui.billingCredits;
    if (!host) return;
    const meta = ui.billingCreditsMeta;
    if (!session.organizationId) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "No organization is established for this session, and credits are held by an organization.");
      return;
    }
    if (session.organizationEconomicsState === "unavailable") {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "The measured ledger did not answer for this organization, so its credit position is not shown. Nothing here is a zero — the balance exists and this browser did not get it. Refresh to try again.");
      return;
    }
    const summary = session.organizationEconomics;
    if (!summary) {
      if (meta) meta.hidden = true;
      setDataState(host, "loading", "Reading this organization's measured credit position for the current billing period.");
      return;
    }
    const used = int64Value(summary.creditsUsedMicros);
    const remaining = int64Value(summary.creditsRemainingMicros);
    const included = int64Value(session.billingPlan?.includedCreditMicros);
    if (used === null || remaining === null) {
      if (meta) meta.hidden = true;
      setDataState(host, "unavailable", "The measured ledger answered without a credit figure, so none is shown rather than a zero standing in for one.");
      return;
    }
    // Where the period stands, as a word first. The bar is the same fact in
    // proportion; the word is what survives greyscale.
    const grant = included !== null && included > 0n ? included : used + remaining;
    const share = grant > 0n ? Number((used * 10000n) / grant) / 100 : 0;
    const [word, tone] = share >= 100 ? ["Past the included grant", "danger"] : share >= 80 ? ["Running low", "attention"] : ["Headroom", "live"];
    const heading = document.createElement("div");
    heading.className = "cs-splitrow__name";
    heading.textContent = word;
    const figure = document.createElement("div");
    figure.className = "cs-splitrow__num";
    figure.textContent = `${formatCreditMicros(used)} used of ${formatCreditMicros(grant)} included`;
    const track = document.createElement("span");
    track.className = "cs-splitrow__track";
    const fill = document.createElement("i");
    fill.className = "cs-splitrow__fill cs-credits__fill";
    fill.dataset.tone = tone;
    purgeChartGeometry("gc");
    setChartGeometry(fill, { width: Math.min(100, share) }, "gc");
    track.append(fill);
    const list = document.createElement("dl");
    list.className = "dn-meta dn-meta--rows";
    const measured = timestampDate(summary.measuredAt);
    // WHERE THE BALANCE CAME FROM.
    //
    // A number with no provenance cannot be audited, and "308,945 credits" on
    // its own does not reconcile against a plan that includes 10,000 — the rest
    // arrived from somewhere and the screen was not saying where. Credits reach
    // the pool by exactly three routes and each has its own evidence, so each is
    // named with the place it can be checked rather than folded into a total.
    //
    // Only figures that are actually reported are stated as figures. The
    // included grant comes from the signed plan; automatic top-ups are counted
    // from the top-up record itself. A route we cannot total from what this
    // browser has read is named and pointed at its evidence rather than guessed
    // at — a decomposition that does not add up is worse than none.
    const granted = (Array.isArray(session.creditTopUps) ? session.creditTopUps : [])
      .filter((record) => creditTopUpStateShape(record?.state)?.word === "Granted");
    const toppedUpMicros = granted.reduce((total, record) => total + (int64Value(record?.creditMicros) ?? 0n), 0n);
    // The provenance rows sit DIRECTLY under the balance and are labelled "Came
    // from", not "of which". Rendered after "Used this period" and prefixed with
    // an em dash they read as a decomposition of what was SPENT — so a customer
    // saw "18,883 used" followed by "included with your plan: 10,000" and could
    // reasonably conclude that ten thousand of the credits they had spent were
    // free ones. They are sources of the BALANCE. Adjacency is the whole of what
    // makes that legible, so the order is load-bearing rather than cosmetic.
    [
      ["Balance now", `${formatCreditMicros(remaining)} credits · ${formatCreditValue(remaining)}`],
      ["Came from · your plan", included !== null && included > 0n
        ? `${formatCreditMicros(included)} credits each billing period, granted once the period's invoice is paid`
        : "The plan did not report an included grant, so none is stated here."],
      ["Came from · automatic top-ups", session.creditTopUpsState !== "loaded"
        ? "The automatic top-up record is unavailable, so none is counted."
        : granted.length
          ? `${formatCreditMicros(toppedUpMicros)} credits across ${granted.length} automatic top-up${granted.length === 1 ? "" : "s"} — listed under Automatic credit top-up`
          : "None. No automatic top-up has been granted."],
      ["Came from · packs you bought", "Any prepaid pack you buy yourself lands in the same shared pool. Each one is on an invoice below."],
      ["Used this period", `${formatCreditMicros(used)} credits · ${formatCreditValue(used)}`],
      ["Measured", measured ? relativeTime(measured) : "Not reported"]
    ].forEach(([key, value]) => {
      const term = document.createElement("dt");
      term.className = "dn-meta__k";
      term.textContent = key;
      const detail = document.createElement("dd");
      detail.className = "dn-meta__v";
      detail.textContent = value;
      list.append(term, detail);
    });
    host.replaceChildren(heading, figure, track, list);
    host.hidden = false;
    if (meta) {
      meta.hidden = false;
      meta.textContent = "This organization, all teams";
    }
  }

  // The per-run dimension. It is deliberately NOT in the group-by selector
  // below: that control is a question about where a team's money went, and
  // "which run" is the question the Runs screen already asks in full.
  const SESSION_SPEND_GROUP = Object.freeze({ key: "session", label: "Run", scopeType: 11 });

  // OPERATION LEADS, and that is the whole point of adding it.
  //
  // "Credits used" invites one question — what on? — and every dimension here
  // answered it by unit of WORK: which initiative, which agent, which pull
  // request. On a real team that answer was mostly blank, because most of the
  // spend is not work. Of the live team's 18,883 credits, 18,750 were the
  // one-shot team_runtime_month provisioning charge and roughly 133 were model
  // calls. Grouped by initiative that reads as "no attribution"; grouped by
  // operation it reads as one large line called provisioning and a small one
  // called inference, which is the truth and is immediately legible.
  const economicsGroupDefinitions = Object.freeze([
    { key: "operation", label: "Operation", scopeType: 14 },
    { key: "initiative", label: "Initiative", scopeType: 7 },
    { key: "agent", label: "Agent", scopeType: 4 },
    { key: "agent_role", label: "Agent role", scopeType: 5 },
    { key: "repository", label: "Repository", scopeType: 10 },
    { key: "issue", label: "Issue", scopeType: 8 },
    { key: "pull_request", label: "Pull request", scopeType: 9 }
  ]);

  function formatIntegerCount(value) {
    const integer = int64Value(value);
    return integer === null ? "Not reported" : new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(integer);
  }

  async function listAllEconomicsBreakdowns(teamId, definition) {
    const records = [];
    const seenIds = new Set();
    const seenTokens = new Set();
    let pageToken = "";
    let measuredAt = null;
    for (let page = 0; page < 5; page += 1) {
      const response = await apiRequest("economics_breakdowns", {
        parentScopeType: "team",
        parentScopeId: teamId,
        groupBy: definition.key,
        page: { pageSize: 100, pageToken }
      });
      const pageRecords = Array.isArray(response.breakdowns) ? response.breakdowns : [];
      if (pageRecords.length > 100) throw new ApiError("EconomicsService returned an oversized breakdown page", 0, "invalid_response", "");
      const responseMeasuredAt = timestampDate(response.measuredAt);
      if (!responseMeasuredAt) throw new ApiError("EconomicsService omitted breakdown measurement time", 0, "invalid_response", "");
      if (measuredAt && measuredAt.getTime() !== responseMeasuredAt.getTime()) throw new ApiError("EconomicsService changed measurement time during pagination", 0, "invalid_response", "");
      measuredAt = responseMeasuredAt;
      for (const record of pageRecords) {
        const id = stringValue(record?.scope?.id);
        const displayName = stringValue(record?.displayName);
        const usageCount = int64Value(record?.usageEventCount);
        const credits = int64Value(record?.creditsUsedMicros);
        if (!id || id.length > 256 || /[\u0000-\u001f\u007f]/.test(id) || record?.scope?.type !== definition.scopeType || seenIds.has(id) || !displayName || displayName.length > 256 || usageCount === null || usageCount < 0n || credits === null || credits < 0n) {
          throw new ApiError("EconomicsService returned an invalid scoped breakdown", 0, "invalid_response", "");
        }
        seenIds.add(id);
        records.push(record);
      }
      const next = stringValue(response.nextPageToken);
      if (!next) return { records, measuredAt };
      if (next === pageToken || seenTokens.has(next)) throw new ApiError("Economics breakdown pagination returned a repeated cursor", 0, "invalid_response", "");
      seenTokens.add(next);
      pageToken = next;
    }
    throw new ApiError("Economics breakdown exceeded the supported 500-row dimension limit", 0, "resource_exhausted", "");
  }

  async function loadEconomicsBreakdowns(teamId) {
    const results = await Promise.allSettled(economicsGroupDefinitions.map((definition) => listAllEconomicsBreakdowns(teamId, definition)));
    return new Map(economicsGroupDefinitions.map((definition, index) => [definition.key, results[index]]));
  }

  function renderSelectedEconomicsGroup() {
    const definition = economicsGroupDefinitions.find((candidate) => candidate.key === session.selectedEconomicsGroup) || economicsGroupDefinitions[0];
    const result = session.economicsBreakdowns.get(definition.key);
    ui.economicsBreakdownList.replaceChildren();
    if (!result || result.status === "rejected") {
      ui.economicsBreakdownList.hidden = true;
      ui.economicsBreakdownEmpty.hidden = false;
      setEmptyState(ui.economicsBreakdownEmpty, `${definition.label} breakdown unavailable`, result ? apiErrorMessage(result.reason, "The server-calculated breakdown is unavailable.") : "No breakdown response was loaded.");
      return;
    }
    result.value.records.forEach((record) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      const values = document.createElement("span");
      const time = document.createElement("span");
      name.textContent = stringValue(record.displayName);
      values.textContent = `${formatCreditMicros(record.creditsUsedMicros)} credits · ${formatCreditValue(record.creditsUsedMicros)} · ${formatIntegerCount(record.usageEventCount)} usage events`;
      const measured = result.value.measuredAt;
      const first = timestampDate(record.firstOccurredAt);
      const last = timestampDate(record.lastOccurredAt);
      time.textContent = `Measured ${relativeTime(measured)}${first && last ? ` · activity ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(first)} – ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(last)}` : ""}`;
      item.append(name, values, time);
      ui.economicsBreakdownList.append(item);
    });
    ui.economicsBreakdownEmpty.hidden = result.value.records.length > 0;
    ui.economicsBreakdownList.hidden = result.value.records.length === 0;
    if (!result.value.records.length) setEmptyState(ui.economicsBreakdownEmpty, `No ${definition.label.toLowerCase()} usage`, "The authoritative ledger returned no rows for the current paid period.");
    renderEconomicsBreakdownNote(definition, result.value.records);
  }

  // WHY THE BIGGEST NUMBER IS THE BIGGEST NUMBER.
  //
  // A customer reading "18,883 credits used" reasonably assumes they bought
  // 18,883 credits of agent work. They did not: on the live team 18,750 of it
  // was the one-shot charge for standing the team's runtime up, and about 133
  // was model calls. Both are legitimate, and the difference between them is
  // the difference between "this is expensive" and "this was a setup fee".
  //
  // The sentence is computed from the rows on screen rather than written down,
  // so it states the leading line's real share and cannot go stale when the
  // shape of a team's spend changes. It says nothing at all when there is
  // nothing to say — one row is not a distribution, and a leader under a third
  // of the total is not a story.
  function renderEconomicsBreakdownNote(definition, records) {
    const note = ui.economicsBreakdownNote;
    if (!note) return;
    note.hidden = true;
    note.textContent = "";
    if (definition.key !== "operation" || records.length < 2) return;
    let total = 0n;
    let leader = null;
    let leaderMicros = 0n;
    for (const record of records) {
      const micros = int64Value(record?.creditsUsedMicros);
      if (micros === null) return;
      total += micros;
      if (micros > leaderMicros) {
        leaderMicros = micros;
        leader = stringValue(record?.displayName);
      }
    }
    if (total <= 0n || !leader) return;
    const share = Number((leaderMicros * 1000n) / total) / 10;
    if (share < 33) return;
    note.textContent = `Most of this is one operation: ${leader} accounts for ${formatCreditMicros(leaderMicros)} of the ${formatCreditMicros(total)} credits measured here — ${share.toFixed(share >= 10 ? 0 : 1)}%. Standing a team's runtime up is charged once, not per unit of work, so a large share here is setup rather than agent effort.`;
    note.hidden = false;
  }

  function renderEconomicsBreakdownsResult(result) {
    ui.economicsBreakdown.hidden = false;
    if (result.status === "rejected") {
      session.economicsBreakdowns = new Map();
      ui.economicsGroup.disabled = true;
      setSourceState(ui.economicsBreakdownState, "Unavailable", "error");
      renderSelectedEconomicsGroup();
      renderAgentSpend();
      renderAgentCounters();
      return;
    }
    session.economicsBreakdowns = result.value;
    ui.economicsGroup.replaceChildren();
    economicsGroupDefinitions.forEach((definition) => {
      const option = document.createElement("option");
      const groupResult = result.value.get(definition.key);
      option.value = definition.key;
      option.textContent = `${definition.label} · ${groupResult?.status === "fulfilled" ? groupResult.value.records.length : "unavailable"}`;
      ui.economicsGroup.append(option);
    });
    if (!economicsGroupDefinitions.some((definition) => definition.key === session.selectedEconomicsGroup)) session.selectedEconomicsGroup = economicsGroupDefinitions[0].key;
    ui.economicsGroup.value = session.selectedEconomicsGroup;
    ui.economicsGroup.disabled = false;
    const loaded = [...result.value.values()].filter((group) => group.status === "fulfilled").length;
    setSourceState(ui.economicsBreakdownState, loaded === economicsGroupDefinitions.length ? "Measured" : `${loaded}/${economicsGroupDefinitions.length} measured`, loaded ? "success" : "error");
    renderSelectedEconomicsGroup();
    // The agent view's spend figure reads the same map; repaint it with the
    // measurement it quotes.
    renderAgentSpend();
    renderAgentCounters();
  }

  function selectEconomicsGroup() {
    const key = stringValue(ui.economicsGroup.value);
    if (!economicsGroupDefinitions.some((definition) => definition.key === key)) return;
    session.selectedEconomicsGroup = key;
    renderSelectedEconomicsGroup();
  }

  function resetEconomicsView(message, label, tone = "") {
    replaceActivityProjections("cost:", []);
    session.economicsBreakdowns = new Map();
    session.selectedEconomicsGroup = "operation";
    ui.economicsBreakdown.hidden = true;
    ui.economicsGroup.disabled = true;
    ui.economicsGroup.replaceChildren();
    ui.economicsBreakdownList.replaceChildren();
    ui.economicsBreakdownList.hidden = true;
    ui.economicsBreakdownEmpty.hidden = false;
    setSourceState(ui.economicsBreakdownState, label, tone);
    ui.economicsMetrics.hidden = true;
    ui.economicsMeasured.hidden = true;
    ui.economicsEmpty.hidden = false;
    setEmptyState(ui.economicsEmpty, label === "Loading" ? "Loading economics" : "No economics summary loaded", message);
    ui.economicsMessage.textContent = message;
    setSourceState(ui.economicsState, label, tone);
  }

  function resetCreditBalanceView(message, label = "Waiting", tone = "") {
    session.creditBalance = null;
    session.creditBalanceShownMicros = null;
    ui.creditBalancePanel.hidden = !selectedTeam();
    ui.creditBalanceValue.textContent = "Unavailable";
    ui.creditBalanceMessage.textContent = message;
    setSourceState(ui.creditBalanceState, label, tone);
  }

  function renderCreditBalanceResult(result) {
    if (result.status === "rejected") {
      resetCreditBalanceView(apiErrorMessage(result.reason, "The organization credit ledger balance is unavailable. No balance was assumed."), "Unavailable", "error");
      return;
    }
    // THE ORGANIZATION POOL — deliberately not balance_micros.
    //
    // balance_micros is the signed sum of the ledger entries that NAME this
    // team. It is an attribution diagnostic ("how much has been booked against
    // this team"), and for a FULLY FUNDED team it is routinely NEGATIVE: an
    // organization grant carries no team_id and so never enters the filtered
    // sum, while every charge names one. Presenting it as remaining credit told
    // a solvent customer they were overdrawn — and because int64Value refuses a
    // negative outright, what they actually got was a blanked panel.
    //
    // organization_balance_micros is the shared prepaid pool: what this team can
    // really spend, what the spend gate reserves against, and the same number
    // StreamCreditMovements publishes as organization_balance_after_micros.
    const balance = signedInt64Value(result.value?.organizationBalanceMicros);
    if (balance === null) {
      resetCreditBalanceView("BillingService returned an invalid organization credit balance. No balance was displayed.", "Invalid response", "error");
      return;
    }
    ui.creditBalancePanel.hidden = false;
    // A movement that has already arrived supersedes this read.
    //
    // organization_balance_after_micros is a window over the same pool this RPC
    // returns, so the two can only ever disagree by being taken at different
    // moments — and when they do, the movement is the later one: the read was
    // issued when the workspace loaded and the frame was published after it.
    // Letting the read win makes the balance visibly run BACKWARDS a second
    // after it moved, which is the console contradicting itself on screen and
    // is precisely the disagreement the contract says is a wiring bug rather
    // than a stream bug. So the read fills the figure in and then stops
    // touching it; the stream owns it from its first frame.
    const streamed = session.lastCreditMovementSequence > 0n && typeof session.creditBalanceShownMicros === "bigint";
    if (!streamed) {
      // The FIRST reading, not a change — so it is written, never rolled.
      // Recording what the odometer now shows is what lets the stream's next
      // frame roll from a real previous value instead of out of nowhere.
      session.creditBalance = balance;
      ui.creditBalanceValue.textContent = formatCreditMicros(balance);
      session.creditBalanceShownMicros = balance;
    }
    renderRailSpend();
    renderStatStrip();
    ui.creditBalanceMessage.textContent = "The organization's shared prepaid pool: signed grants minus settled usage, across every team. Open reservations and this team's hard limit are separate execution guardrails below.";
    setSourceState(ui.creditBalanceState, "Verified", "success");
  }

  function renderTeamCreditResults(balanceResult, controlResult, teamId) {
    // BOTH OPERANDS ARE THE ORGANIZATION POOL. ledger_available_micros is the
    // shared pool, so cross-checking it against balance_micros — a team-filtered
    // sum — compared two different quantities and fired the moment any team
    // spent anything. On healthy data this blanked the whole credit panel.
    // organization_balance_micros is the same figure ledger_available_micros
    // reports, which is what makes disagreement between them a real inconsistency.
    const balance = balanceResult.status === "fulfilled" ? signedInt64Value(balanceResult.value?.organizationBalanceMicros) : null;
    const control = controlResult.status === "fulfilled" ? controlResult.value?.control : null;
    if (balance !== null && validCreditControl(control, teamId) && balance !== int64Value(control.ledgerAvailableMicros)) {
      const message = "BillingService returned inconsistent ledger and budget projections. No credit state was displayed; billable work remains fail-closed.";
      resetCreditBalanceView(message, "Invalid response", "error");
      resetCreditControlView(message, "Invalid response", "error");
      return;
    }
    renderCreditBalanceResult(balanceResult);
    renderCreditControlResult(controlResult, teamId);
  }

  function resetCreditControlView(message, label = "Waiting", tone = "") {
    session.creditControl = null;
    ui.creditControl.hidden = !selectedTeam();
    ui.creditHardLimitInput.disabled = true;
    ui.creditCustomerPaused.disabled = true;
    ui.creditControlSubmit.disabled = true;
    ui.creditControlSummary.textContent = message;
    setFieldError(ui.creditControlError, tone === "error" ? message : "");
    setSourceState(ui.creditControlState, label, tone);
    renderCreditPackControls();
  }

  function pauseReasonLabel(value) {
    const numeric = typeof value === "number" ? value : -1;
    const normalized = numeric >= 0
      ? ["", "NONE", "CUSTOMER_PAUSED", "BILLING_INACTIVE", "CREDITS_EXHAUSTED", "BUDGET_EXHAUSTED"][numeric] || ""
      : stringValue(value).replace(/^TEAM_CREDIT_PAUSE_REASON_/, "");
    return ({
      NONE: "Ready",
      CUSTOMER_PAUSED: "Customer paused",
      BILLING_INACTIVE: "Billing inactive",
      CREDITS_EXHAUSTED: "Credits exhausted",
      BUDGET_EXHAUSTED: "Budget exhausted"
    })[normalized] || "Unavailable";
  }

  function microsInputValue(value) {
    const micros = int64Value(value);
    if (micros === null) return "";
    const whole = micros / 1_000_000n;
    const fraction = (micros % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
    return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
  }

  function creditInputMicros(value) {
    const normalized = stringValue(value);
    const match = /^(0|[1-9][0-9]{0,12})(?:\.([0-9]{1,6}))?$/.exec(normalized);
    if (!match) return null;
    const micros = BigInt(match[1]) * 1_000_000n + BigInt((match[2] || "").padEnd(6, "0") || "0");
    return micros <= 9_223_372_036_854_775_807n ? micros : null;
  }

  function validCreditControl(control, teamId) {
    if (!control || stringValue(control.teamId) !== stringValue(teamId)) return false;
    const ledger = int64Value(control.ledgerAvailableMicros);
    const open = int64Value(control.openReservedMicros);
    const consumed = int64Value(control.periodConsumedMicros);
    const hard = int64Value(control.hardLimitMicros);
    const budget = int64Value(control.budgetRemainingMicros);
    const effective = int64Value(control.effectiveAvailableMicros);
    const version = int64Value(control.version);
    if ([ledger, open, consumed, hard, budget, effective, version].some((value) => value === null) || hard <= 0n || version <= 0n) return false;
    const committed = open + consumed;
    const expectedBudget = hard > committed ? hard - committed : 0n;
    const expectedEffective = (ledger < expectedBudget ? ledger : expectedBudget);
    if (budget !== expectedBudget || effective !== expectedEffective || effective < 0n) return false;
    const reason = pauseReasonLabel(control.pauseReason);
    if (reason === "Unavailable" || Boolean(control.paused) !== (reason !== "Ready")) return false;
    if (Boolean(control.customerPaused) !== (reason === "Customer paused")) return false;
    const startsAt = timestampDate(control.periodStartsAt);
    const endsAt = timestampDate(control.periodEndsAt);
    return Boolean(startsAt && endsAt && endsAt > startsAt);
  }

  function renderCreditControlResult(result, teamId) {
    if (result.status === "rejected") {
      resetCreditControlView(apiErrorMessage(result.reason, "The team credit control is unavailable. Billable work remains fail-closed."), "Unavailable", "error");
      return;
    }
    const control = result.value.control;
    if (!validCreditControl(control, teamId)) {
      resetCreditControlView("The billing service returned an inconsistent team credit control. Billable work remains fail-closed.", "Invalid response", "error");
      return;
    }
    session.creditControl = control;
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    ui.creditControl.hidden = false;
    ui.creditOpenReserved.textContent = formatCreditMicros(control.openReservedMicros);
    ui.creditPeriodConsumed.textContent = formatCreditMicros(control.periodConsumedMicros);
    session.creditPeriodConsumed = int64Value(control.periodConsumedMicros);
    renderRailSpend();
    renderStatStrip();
    ui.creditHardLimit.textContent = formatCreditMicros(control.hardLimitMicros);
    ui.creditEffectiveAvailable.textContent = formatCreditMicros(control.effectiveAvailableMicros);
    ui.creditHardLimitInput.value = microsInputValue(control.hardLimitMicros);
    ui.creditHardLimitInput.min = microsInputValue(committed > 0n ? committed : 1n);
    ui.creditHardLimitInput.max = microsInputValue(prepaidCeiling);
    ui.creditCustomerPaused.checked = Boolean(control.customerPaused);
    ui.creditHardLimitInput.disabled = false;
    ui.creditCustomerPaused.disabled = false;
    ui.creditControlSubmit.disabled = false;
    setFieldError(ui.creditControlError, "");
    const label = pauseReasonLabel(control.pauseReason);
    setSourceState(ui.creditControlState, label, label === "Ready" ? "success" : "error");
    updateCreditControlSummary();
    renderCreditPackControls();
  }

  function updateCreditControlSummary() {
    const control = session.creditControl;
    if (!control) return;
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    const proposed = creditInputMicros(ui.creditHardLimitInput.value);
    const withinRange = proposed !== null && proposed >= committed && proposed <= prepaidCeiling && proposed > 0n;
    ui.creditControlSummary.textContent = withinRange
      ? `${formatCreditMicros(proposed)} credit hard limit · ${ui.creditCustomerPaused.checked ? "billable work paused" : "billable work enabled"} · version ${String(control.version)}`
      // Exact: these are the bounds the server enforces to the microcredit, and
      // a rounded ceiling would be a number the field then refuses.
      : `Choose a limit from ${formatCreditMicrosExact(committed)} to ${formatCreditMicrosExact(prepaidCeiling)} available prepaid credits.`;
    ui.creditControlSubmit.disabled = !withinRange;
  }

  async function saveCreditControl(event) {
    event.preventDefault();
    const team = selectedTeam();
    const control = session.creditControl;
    if (!team || !control || stringValue(control.teamId) !== stringValue(team.id)) return;
    const hardLimit = creditInputMicros(ui.creditHardLimitInput.value);
    const committed = int64Value(control.periodConsumedMicros) + int64Value(control.openReservedMicros);
    const prepaidCeiling = committed + int64Value(control.ledgerAvailableMicros);
    if (hardLimit === null || hardLimit <= 0n || hardLimit < committed || hardLimit > prepaidCeiling) {
      setFieldError(ui.creditControlError, "The hard limit must cover committed usage and remain within prepaid availability.");
      return;
    }
    const customerPaused = Boolean(ui.creditCustomerPaused.checked);
    const expectedVersion = int64Value(control.version);
    const fingerprint = `${session.organizationId}:${team.id}:${hardLimit.toString()}:${customerPaused}:${expectedVersion.toString()}`;
    ui.creditControlSubmit.disabled = true;
    ui.creditControlSubmit.textContent = "Saving…";
    try {
      const result = await apiRequest("update_credit_control", {
        organizationId: session.organizationId,
        teamId: team.id,
        hardLimitMicros: hardLimit.toString(),
        customerPaused,
        expectedVersion: expectedVersion.toString(),
        idempotencyKey: mutationKeys.for("updateCreditControl", fingerprint)
      });
      if (!validCreditControl(result.control, team.id)) throw new ApiError("Billing service returned an invalid updated credit control", 0, "invalid_response", "");
      if (session.creditBalance !== null && int64Value(result.control.ledgerAvailableMicros) !== session.creditBalance) {
        throw new ApiError("Billing service returned credit projections that do not reconcile", 0, "invalid_response", "");
      }
      mutationKeys.clear("updateCreditControl");
      renderCreditControlResult({ status: "fulfilled", value: result }, team.id);
      toast("Team budget control was confirmed by the API.", "success");
    } catch (error) {
      const message = apiErrorMessage(error, "The team budget control was not updated.");
      setFieldError(ui.creditControlError, message);
      if (error instanceof ApiError && ["aborted", "failed_precondition"].includes(error.code)) await refreshSelectedTeam();
    } finally {
      ui.creditControlSubmit.textContent = "Save budget control";
      if (session.creditControl) updateCreditControlSummary();
    }
  }

  function renderEconomicsResult(result, teamId) {
    if (result.status === "rejected") {
      resetEconomicsView(apiErrorMessage(result.reason, "The EconomicsService is unavailable."), "Unavailable", "error");
      return;
    }
    const economics = result.value.economics;
    if (!economics || stringValue(economics.scopeType).toLowerCase() !== "team" || stringValue(economics.scopeId) !== stringValue(teamId)) {
      resetEconomicsView("The economics service did not return a matching team-scoped summary. No metrics were displayed.", "Invalid response", "error");
      return;
    }
    // The customer's money, not ours. economics.directCost is what the work cost
    // DEEP NAVY at the provider; the ledger converts cost to credits at the
    // published rate, so the two sit a margin apart and only one of them is the
    // customer's. Showing ours here — unlabelled, beside a credit figure — is
    // what made the panel unreadable: two currencies in one row, and no way to
    // tell which one you had actually spent.
    ui.economicsCreditValue.textContent = formatCreditValue(economics.creditsUsedMicros);
    ui.economicsCreditsUsed.textContent = formatCreditMicros(economics.creditsUsedMicros);
    ui.economicsCreditsRemaining.textContent = formatCreditMicros(economics.creditsRemainingMicros);
    const measured = timestampDate(economics.measuredAt);
    ui.economicsMeasured.textContent = measured ? `Measured ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(measured)}.` : "Measurement time was not reported.";
    ui.economicsMessage.textContent = "Credits are what this team spends as it works. 100 credits = $1.00 of model, compute and storage usage.";
    ui.economicsEmpty.hidden = true;
    ui.economicsMetrics.hidden = false;
    ui.economicsMeasured.hidden = false;
    setSourceState(ui.economicsState, "Measured", "success");
    upsertActivityProjection({
      id: `cost:${teamId}`,
      category: "cost",
      source: "economics",
      title: "Credits updated",
      // Lead with the balance, because that is the number the customer spends.
      // One quantity, both units — the money is the credits restated at
      // $0.01 each, so the two figures can never disagree.
      safeSummary: `${formatCreditMicros(economics.creditsUsedMicros)} credits used (${formatCreditValue(economics.creditsUsedMicros)}), ${formatCreditMicros(economics.creditsRemainingMicros)} left in the organization's pool.`,
      // Saying what this is beats saying what it is not. The old line denied
      // being a live feed, which answers a question nobody asked and leaves the
      // real one - how current is this number? - unanswered.
      detail: "A measurement taken at a point in time, so the newest work may not be counted yet.",
      status: "measured",
      sequenceLabel: "Snapshot",
      occurredAt: economics.measuredAt
    });
  }

  // The ORGANIZATION's own measured summary. It is validated exactly the way
  // the team summary is — a response about a different scope is refused rather
  // than displayed — and its absence is a state word rather than a zero,
  // because "we could not read the balance" and "the balance is nought" are
  // different facts and only one of them is true.
  function renderOrganizationEconomicsResult(result, organizationId) {
    if (stringValue(organizationId) !== session.organizationId) return;
    const refuse = () => {
      session.organizationEconomics = null;
      session.organizationEconomicsState = "unavailable";
      renderBillingView();
    };
    if (result.status !== "fulfilled") return refuse();
    const economics = result.value?.economics;
    const scopeType = stringValue(economics?.scopeType).toLowerCase();
    const scopeId = stringValue(economics?.scopeId) || stringValue(economics?.scope?.id);
    if (!economics || (scopeType && scopeType !== "organization") || (scopeId && scopeId !== session.organizationId)) return refuse();
    session.organizationEconomics = economics;
    session.organizationEconomicsState = "loaded";
    renderBillingView();
  }

  // What each run cost. A session's lifecycle record carries no money, so the
  // only honest answer is the measured ledger cut by run — the same figures
  // Economics totals, grouped differently. A rejection leaves the panel
  // saying so; it never leaves a run looking free.
  function renderSessionSpendResult(result, teamId) {
    if (stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status !== "fulfilled" || !Array.isArray(result.value?.records)) {
      session.sessionSpend = [];
      session.sessionSpendState = "unavailable";
      renderRunsView();
      return;
    }
    session.sessionSpend = result.value.records;
    session.sessionSpendState = "loaded";
    renderRunsView();
  }

  function resetApprovalView(message, label, tone = "") {
    replaceActivityProjections("approval-pending:", []);
    session.approvals = [];
    session.approvalNextPageToken = "";
    session.approvalPageTokens = new Set();
    session.approvalDecisionIds = new Set();
    stopSignoffLockingBeat();
    if (ui.signoffList) ui.signoffList.replaceChildren();
    if (ui.signoffLocking) ui.signoffLocking.hidden = true;
    if (ui.signoffCard) ui.signoffCard.hidden = true;
    ui.approvalList.replaceChildren();
    ui.approvalList.hidden = true;
    ui.approvalsMore.hidden = true;
    ui.approvalsMore.disabled = true;
    ui.approvalsEmpty.hidden = false;
    setEmptyState(ui.approvalsEmpty, label === "Loading" ? "Loading pending approvals" : "No approval queue loaded", message);
    setSourceState(ui.approvalsState, label, tone);
  }

  function pendingApprovalStatus(approval) {
    if (typeof approval?.approvalStatus === "number") return approval.approvalStatus === 1;
    return stringValue(approval?.approvalStatus) === "APPROVAL_STATUS_PENDING";
  }

  function decidedApprovalStatus(approval, approved) {
    if (typeof approval?.approvalStatus === "number") return approval.approvalStatus === (approved ? 2 : 3);
    return stringValue(approval?.approvalStatus) === (approved ? "APPROVAL_STATUS_APPROVED" : "APPROVAL_STATUS_DENIED");
  }

  // Voiding reuses the FAILED status plus voided_reason rather than a status
  // of its own, so "voided" is only ever the pair: FAILED and a reason.
  function voidedApprovalStatus(approval) {
    if (typeof approval?.approvalStatus === "number") return approval.approvalStatus === 6;
    return stringValue(approval?.approvalStatus) === "APPROVAL_STATUS_FAILED";
  }

  // The PRD sign-off certifies a document that lives on GitHub as a
  // discussion. Only that exact shape earns a link out of the queue:
  // https://github.com/<owner>/<repo>/discussions/<number> with nothing else
  // riding along. Another host, another path, credentials, a port, a query,
  // or a fragment renders no link at all rather than a nearly-right one.
  function prdReferenceUrl(value) {
    const raw = stringValue(value);
    if (!raw || raw.length > 512) return "";
    let url;
    try {
      url = new URL(raw);
    } catch {
      return "";
    }
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash) return "";
    if (!/^\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}\/discussions\/[1-9][0-9]{0,9}$/.test(url.pathname)) return "";
    return url.toString();
  }

  function validPendingApproval(approval, teamId) {
    const id = stringValue(approval?.id);
    const summary = stringValue(approval?.safeSummary);
    const actionType = stringValue(approval?.actionType);
    const referenceUrl = stringValue(approval?.referenceUrl);
    const referenceNodeId = stringValue(approval?.referenceNodeId);
    const voidedReason = stringValue(approval?.voidedReason);
    return Boolean(
      id && id.length <= 128 && !/[\u0000-\u001f\u007f]/.test(id) &&
      stringValue(approval?.teamId) === stringValue(teamId) &&
      summary && summary.length <= 1000 &&
      actionType && actionType.length <= 160 &&
      referenceUrl.length <= 512 && !/[\u0000-\u001f\u007f]/.test(referenceUrl) &&
      referenceNodeId.length <= 256 && !/[\u0000-\u001f\u007f]/.test(referenceNodeId) &&
      voidedReason.length <= 1000 && !/[\u0000-\u001f\u007f]/.test(voidedReason) &&
      // A record in this queue is either genuinely undecided, or it is the
      // platform's own withdrawal of one: FAILED plus the reason the customer
      // deserves to read. Any other status, a voided record missing its
      // reason, or a pending record claiming one rejects the page.
      (voidedReason ? voidedApprovalStatus(approval) : pendingApprovalStatus(approval))
    );
  }

  function applyApprovalPage(response, teamId, append = false, requestedToken = "") {
    const approvals = Array.isArray(response?.approvals) ? response.approvals : [];
    if (approvals.length > 100 || approvals.some((approval) => !validPendingApproval(approval, teamId))) {
      throw new ApiError("ApprovalService returned an invalid pending approval page", 0, "invalid_response", "");
    }
    const existing = append ? new Map(session.approvals.map((approval) => [stringValue(approval.id), approval])) : new Map();
    for (const approval of approvals) {
      const id = stringValue(approval.id);
      if (existing.has(id)) throw new ApiError("ApprovalService returned a duplicate approval", 0, "invalid_response", "");
      existing.set(id, approval);
    }
    const nextPageToken = stringValue(response?.page?.nextPageToken);
    if (nextPageToken && (nextPageToken === requestedToken || session.approvalPageTokens.has(nextPageToken))) {
      throw new ApiError("ApprovalService returned a repeated page cursor", 0, "invalid_response", "");
    }
    if (!append) session.approvalPageTokens = new Set();
    if (nextPageToken) session.approvalPageTokens.add(nextPageToken);
    session.approvals = [...existing.values()];
    session.approvalNextPageToken = nextPageToken;
    renderApprovalQueue();
  }

  // A recorded sign-off leaves the pending queue at once, and the queue is
  // the only thing this page can read — nothing on the wire says when the
  // discussion lock lands. So the card holds a bounded beat instead of a
  // spinner-forever: long enough to say what is happening, then it stands
  // down and the activity record carries the fact from there.
  const signoffLockingBeatMs = 8000;

  function signoffLockingActive() {
    return session.signoffLockingUntil > Date.now();
  }

  function beginSignoffLockingBeat() {
    session.signoffLockingUntil = Date.now() + signoffLockingBeatMs;
    if (session.signoffLockingTimer) window.clearTimeout(session.signoffLockingTimer);
    const generation = session.workspaceGeneration;
    session.signoffLockingTimer = window.setTimeout(() => {
      session.signoffLockingTimer = null;
      if (generation !== session.workspaceGeneration) return;
      session.signoffLockingUntil = 0;
      renderApprovalQueue();
    }, signoffLockingBeatMs);
  }

  function stopSignoffLockingBeat() {
    session.signoffLockingUntil = 0;
    if (session.signoffLockingTimer) window.clearTimeout(session.signoffLockingTimer);
    session.signoffLockingTimer = null;
  }

  // One card builder for both surfaces. The approvals view renders every
  // pending action; the console's sign-off card renders the prd_signoff
  // subset — the same validated approval objects, the same controls, the
  // same decide flow, appended by the same render pass so the two surfaces
  // can never disagree. The prefix keeps the reason-field ids unique when
  // one approval is on screen twice.
  function appendApprovalCard(list, approval, index, prefix) {
      const consoleCard = prefix === "signoff";
      const id = stringValue(approval.id);
      const actionType = stringValue(approval.actionType);
      const summary = stringValue(approval.safeSummary);
      const prdSignoff = actionType === "prd_signoff";
      const voidedReason = stringValue(approval.voidedReason);
      const pending = session.approvalDecisionIds.has(id);
      const item = document.createElement("li");
      const form = document.createElement("form");
      form.className = consoleCard ? "approval-card signoff-card" : "approval-card";
      form.dataset.approvalId = id;
      if (pending) form.setAttribute("aria-busy", "true");

      const header = document.createElement("div");
      header.className = "approval-card-header";
      const type = document.createElement("span");
      type.className = "approval-action-type";
      type.textContent = actionType.replaceAll("_", " ");
      const requested = document.createElement("time");
      const requestedAt = timestampDate(approval.requestedAt);
      requested.textContent = requestedAt ? relativeTime(requestedAt) : "Time not reported";
      if (requestedAt) {
        requested.dateTime = requestedAt.toISOString();
        requested.title = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(requestedAt);
      }
      header.append(type, requested);
      if (consoleCard && !voidedReason) {
        // Brass is "waiting on a human" — the one hue this card may carry
        // while the decision is still the customer's to make. The voided
        // treatment below brings its own coral label instead.
        const chip = document.createElement("span");
        chip.className = "signoff-chip";
        chip.dataset.tone = "waiting";
        chip.textContent = "Awaiting sign-off";
        header.insertBefore(chip, requested);
      }

      const safeSummary = document.createElement("strong");
      safeSummary.textContent = summary;
      const requestedBy = document.createElement("p");
      requestedBy.className = "approval-requester";
      requestedBy.textContent = stringValue(approval.requestedByAgentId)
        ? `Requested by ${stringValue(approval.requestedByAgentId)}`
        : "Requesting agent not reported";
      form.append(header, safeSummary, requestedBy);

      // The PRD is the document being signed, so the card links out to it -
      // but only through the strict discussion shape above. A reference that
      // does not parse simply renders no link.
      const referenceUrl = prdSignoff ? prdReferenceUrl(approval.referenceUrl) : "";
      if (referenceUrl) {
        const reference = document.createElement("p");
        reference.className = "approval-reference";
        const referenceLink = document.createElement("a");
        referenceLink.href = referenceUrl;
        referenceLink.target = "_blank";
        referenceLink.rel = "noopener noreferrer";
        referenceLink.referrerPolicy = "no-referrer";
        referenceLink.textContent = "Read the PRD on GitHub";
        reference.append(referenceLink);
        form.append(reference);
      }

      if (voidedReason) {
        // The platform withdrew this request itself. There is no decision
        // left to make, so the card carries the reason instead of controls.
        const voided = document.createElement("p");
        voided.className = "approval-voided";
        const voidedLabel = document.createElement("span");
        voidedLabel.className = "approval-voided-label";
        voidedLabel.textContent = prdSignoff ? "Sign-off voided" : "Request voided";
        const voidedDetail = document.createElement("span");
        voidedDetail.className = "approval-voided-reason";
        voidedDetail.textContent = voidedReason;
        voided.append(voidedLabel, voidedDetail);
        form.append(voided);
        item.append(form);
        list.append(item);
        return;
      }

      const reasonId = `${prefix}-reason-${index}`;
      const reasonLabel = document.createElement("label");
      reasonLabel.htmlFor = reasonId;
      reasonLabel.textContent = "Decision note";
      const reason = document.createElement("textarea");
      reason.id = reasonId;
      reason.name = "reason";
      reason.rows = 2;
      reason.maxLength = 500;
      reason.placeholder = "Required to deny; optional to approve";
      reason.disabled = pending;
      reason.setAttribute("aria-describedby", `${reasonId}-help ${reasonId}-error`);
      const help = document.createElement("small");
      help.id = `${reasonId}-help`;
      help.textContent = "The API records the authenticated decision owner and immutable audit event.";
      const error = document.createElement("p");
      error.id = `${reasonId}-error`;
      error.className = "form-error";
      error.dataset.approvalError = "";
      error.setAttribute("role", "alert");
      error.hidden = true;

      const actions = document.createElement("div");
      actions.className = "approval-actions";
      const approve = document.createElement("button");
      approve.className = "button button-primary button-small";
      approve.type = "submit";
      approve.value = "approve";
      approve.dataset.approvalDecision = "approve";
      approve.textContent = pending ? "Saving…" : (prdSignoff ? "Sign off" : "Approve");
      approve.disabled = pending;
      approve.setAttribute("aria-label", prdSignoff ? "Sign off on the PRD" : `Approve ${actionType.replaceAll("_", " ")}`);
      const deny = document.createElement("button");
      deny.className = "button button-quiet button-small approval-deny";
      deny.type = "submit";
      deny.value = "deny";
      deny.dataset.approvalDecision = "deny";
      deny.textContent = "Deny";
      deny.disabled = pending;
      deny.setAttribute("aria-label", `Deny ${actionType.replaceAll("_", " ")}`);
      actions.append(approve, deny);
      form.append(reasonLabel, reason, help, error, actions);
      item.append(form);
      list.append(item);
  }

  // The sign-off card beside the conversation. Filtered from the queue the
  // page just validated — never a second fetch — and visible whenever a PRD
  // decision is waiting, was voided, or is being locked as the signed record.
  function renderSignoffCard() {
    if (!ui.signoffCard || !ui.signoffList) return;
    ui.signoffList.replaceChildren();
    const signoffs = session.approvals.filter((approval) => stringValue(approval.actionType) === "prd_signoff");
    signoffs.forEach((approval, index) => appendApprovalCard(ui.signoffList, approval, index, "signoff"));
    const locking = signoffLockingActive();
    if (ui.signoffLocking) ui.signoffLocking.hidden = !locking;
    ui.signoffCard.hidden = !signoffs.length && !locking;
  }

  function renderApprovalQueue() {
    ui.approvalList.replaceChildren();
    session.approvals.forEach((approval, index) => appendApprovalCard(ui.approvalList, approval, index, "approval"));
    renderSignoffCard();

    const count = session.approvals.length;
    const undecided = session.approvals.filter((approval) => !stringValue(approval.voidedReason)).length;
    ui.approvalsEmpty.hidden = count > 0;
    ui.approvalList.hidden = count === 0;
    if (!count) setEmptyState(ui.approvalsEmpty, "No pending approvals", "The API returned no pending decisions for this team.");
    setSourceState(ui.approvalsState, undecided ? `${undecided} pending` : "Clear", undecided ? "loading" : "success");
    ui.approvalsMore.hidden = !session.approvalNextPageToken;
    ui.approvalsMore.disabled = !session.approvalNextPageToken;
    replaceActivityProjections("approval-pending:", session.approvals.map((approval) => ({
      id: `approval-pending:${stringValue(approval.id)}`,
      category: "approvals",
      source: "approval queue",
      title: stringValue(approval.actionType).replaceAll("_", " ") || "Approval requested",
      safeSummary: stringValue(approval.safeSummary),
      detail: stringValue(approval.voidedReason)
        ? `Voided: ${stringValue(approval.voidedReason)}`
        : (stringValue(approval.requestedByAgentId) ? `Requested by agent ${stringValue(approval.requestedByAgentId)}` : "Requesting agent not reported."),
      status: stringValue(approval.voidedReason) ? "voided" : "pending",
      sequenceLabel: "Snapshot",
      occurredAt: approval.requestedAt
    })));
  }

  function renderApprovalsResult(result, teamId) {
    if (result.status === "rejected") {
      resetApprovalView(apiErrorMessage(result.reason, "Pending approvals are unavailable."), "Unavailable", "error");
      return;
    }
    try {
      applyApprovalPage(result.value, teamId);
    } catch (error) {
      resetApprovalView(apiErrorMessage(error, "The approval service returned an invalid team-scoped queue."), "Invalid response", "error");
    }
  }

  async function loadMoreApprovals() {
    const team = selectedTeam();
    const pageToken = session.approvalNextPageToken;
    const generation = session.workspaceGeneration;
    if (!team || !pageToken || ui.approvalsMore.disabled) return;
    ui.approvalsMore.disabled = true;
    ui.approvalsMore.textContent = "Loading…";
    try {
      const response = await apiRequest("approvals", { teamId: team.id, page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      applyApprovalPage(response, team.id, true, pageToken);
    } catch (error) {
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      setSourceState(ui.approvalsState, "More unavailable", "error");
      toast(apiErrorMessage(error, "More pending approvals could not be loaded."), "error");
      ui.approvalsMore.disabled = false;
    } finally {
      if (generation === session.workspaceGeneration && stringValue(team.id) === session.selectedTeamId) {
        ui.approvalsMore.textContent = "Load more pending approvals";
        if (!session.approvalNextPageToken) ui.approvalsMore.hidden = true;
      }
    }
  }

  async function decideApproval(event) {
    event.preventDefault();
    const form = event.target.closest("[data-approval-id]");
    const submitter = event.submitter;
    const id = stringValue(form?.dataset.approvalId);
    const decision = stringValue(submitter?.dataset.approvalDecision);
    const approved = decision === "approve";
    const team = selectedTeam();
    const generation = session.workspaceGeneration;
    const approval = session.approvals.find((candidate) => stringValue(candidate.id) === id);
    if (!form || !submitter || !team || !approval || !["approve", "deny"].includes(decision) || session.approvalDecisionIds.has(id)) return;
    const actionType = stringValue(approval.actionType);
    const reasonField = form.elements.namedItem("reason");
    const reason = stringValue(reasonField?.value);
    const error = form.querySelector("[data-approval-error]");
    setFieldError(error, "");
    if (!approved && !reason) {
      setFieldError(error, "Enter a reason before denying this request.");
      reasonField?.focus();
      return;
    }
    if (new TextEncoder().encode(reason).length > 500) {
      setFieldError(error, "Keep the decision note to 500 UTF-8 bytes or fewer.");
      reasonField?.focus();
      return;
    }

    session.approvalDecisionIds.add(id);
    form.setAttribute("aria-busy", "true");
    form.querySelectorAll("button, textarea").forEach((control) => { control.disabled = true; });
    submitter.textContent = "Saving…";
    setSourceState(ui.approvalsState, "Saving decision", "loading");
    try {
      const response = await apiRequest("decide_approval", { id, approved, reason });
      const decided = response?.approval;
      if (!decided || stringValue(decided.id) !== id || stringValue(decided.teamId) !== stringValue(team.id) || !decidedApprovalStatus(decided, approved)) {
        throw new ApiError("ApprovalService did not return the expected decided approval", 0, "invalid_response", "");
      }
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      session.approvalDecisionIds.delete(id);
      session.approvals = session.approvals.filter((candidate) => stringValue(candidate.id) !== id);
      // The signed PRD leaves the pending queue immediately; the console
      // card keeps saying what the platform is doing with it for one beat.
      if (actionType === "prd_signoff" && approved) beginSignoffLockingBeat();
      upsertActivityProjection({
        id: `approval-decision:${id}`,
        category: "approvals",
        source: "approval decision",
        title: `${actionType.replaceAll("_", " ")} · ${approved ? (actionType === "prd_signoff" ? "signed off" : "approved") : "denied"}`,
        safeSummary: stringValue(decided.safeSummary) || stringValue(approval.safeSummary),
        detail: actionType === "prd_signoff" && approved ? "The PRD is being locked as the signed record." : "Decision confirmed.",
        status: approved ? "approved" : "denied",
        sequenceLabel: "Decision",
        occurredAt: decided.decidedAt || approval.requestedAt
      });
      renderApprovalQueue();
      toast(approved
        ? (actionType === "prd_signoff"
          ? "Sign-off recorded. The PRD is being locked as the signed record."
          : "Approval recorded. The authorized action may proceed.")
        : "Denial recorded with its audit note.", "success");
    } catch (caught) {
      if (generation !== session.workspaceGeneration || stringValue(team.id) !== session.selectedTeamId) return;
      session.approvalDecisionIds.delete(id);
      form.removeAttribute("aria-busy");
      form.querySelectorAll("button, textarea").forEach((control) => { control.disabled = false; });
      submitter.textContent = approved ? (actionType === "prd_signoff" ? "Sign off" : "Approve") : "Deny";
      setFieldError(error, apiErrorMessage(caught, "The decision was not recorded. It is safe to retry."));
      setSourceState(ui.approvalsState, `${session.approvals.length} pending`, "error");
    }
  }

  function formatCanonicalMoney(money) {
    if (!money) return "Not reported";
    const currency = stringValue(money.currencyCode) || "USD";
    try {
      const units = typeof money.units === "bigint" ? money.units : BigInt(money.units || 0);
      const nanos = Number(money.nanos || 0);
      const numericUnits = Number(units);
      if (!Number.isSafeInteger(numericUnits) || !Number.isInteger(nanos)) return `${units.toString()} ${currency}`;
      return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(numericUnits + nanos / 1_000_000_000);
    } catch {
      return "Not reported";
    }
  }

  // Credits, ROUNDED FOR READING.
  //
  // A microcredit is a ledger storage unit — a millionth of a credit, which is a
  // hundred-millionth of a dollar. Printing the whole fraction meant a customer
  // read "18,883.403215 credits used, 308,944.522099 left" and had to count
  // digits to find the magnitude. Nobody can hold that, and the six places
  // carried no information anyone could act on: the last four are worth less
  // than a hundredth of a cent.
  //
  // The scale sets the precision, so a figure never shows more places than it
  // has meaning:
  //
  //   >= 1,000 credits   whole credits          308,945
  //   >= 1 credit        two places, a cent     133.41
  //   < 1 credit         up to six, never 0     0.000241
  //   exactly zero       "0"
  //
  // The third rule is the one that matters. Rounding a real but tiny movement to
  // "0.00" would print a ZERO — a claim that we counted and there was nothing —
  // over a fact that is not nothing. So beneath a credit the fraction is kept
  // until it is true.
  //
  // Where exact reconciliation is the point rather than reading — the ledger's
  // own movement rows, and the bounds of an input the server validates to the
  // microcredit — use formatCreditMicrosExact instead.
  function formatCreditMicros(value) {
    try {
      const micros = typeof value === "bigint" ? value : BigInt(value || 0);
      if (micros === 0n) return "0";
      const negative = micros < 0n;
      const absolute = negative ? -micros : micros;
      const sign = negative ? "−" : "";
      if (absolute >= 1_000_000_000n) {
        return `${sign}${new Intl.NumberFormat().format((absolute + 500_000n) / 1_000_000n)}`;
      }
      if (absolute >= 1_000_000n) {
        const hundredths = (absolute + 5_000n) / 10_000n;
        return `${sign}${new Intl.NumberFormat().format(hundredths / 100n)}.${(hundredths % 100n).toString().padStart(2, "0")}`;
      }
      return `${sign}0.${absolute.toString().padStart(6, "0").replace(/0+$/, "")}`;
    } catch {
      return "Not reported";
    }
  }

  // Every microcredit, for the surfaces where reconciling to the ledger IS the
  // task and a rounded figure would be the wrong answer.
  function formatCreditMicrosExact(value) {
    try {
      const micros = typeof value === "bigint" ? value : BigInt(value || 0);
      const negative = micros < 0n;
      const absolute = negative ? -micros : micros;
      const whole = absolute / 1_000_000n;
      const fraction = (absolute % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
      return `${negative ? "−" : ""}${new Intl.NumberFormat().format(whole)}${fraction ? `.${fraction}` : ""}`;
    } catch {
      return "Not reported";
    }
  }

  // The same credits, in the money the customer is charged.
  //
  // This is NOT a second measurement standing beside the credit figure — it is
  // the identical quantity in the other unit, because 1 credit is $0.01 of
  // credit value by definition. That is exactly why it is safe to show and why
  // our measured direct cost is not: direct cost is what the work cost US, it
  // sits a margin away from what the customer pays, and putting the two in one
  // sentence is what made a customer unable to tell whether they had spent $75
  // or $188.
  function formatCreditValue(value) {
    try {
      const micros = typeof value === "bigint" ? value : BigInt(value || 0);
      if (micros === 0n) return formatCents(0n);
      const negative = micros < 0n;
      const absolute = negative ? -micros : micros;
      // 1 credit = 1,000,000 micros = one cent.
      const cents = (absolute + 500_000n) / 1_000_000n;
      // Real spend that rounds below a cent is not "$0.00" — that would be the
      // same false zero the credit formatter refuses.
      if (cents === 0n) return `less than ${formatCents(1n)}`;
      return `${negative ? "−" : ""}${formatCents(cents)}`;
    } catch {
      return "Not reported";
    }
  }

  function resetActivityView(message, label, tone = "") {
    session.activityEvents = [];
    session.activityEventIds = new Set();
    session.freshActivityIds = new Set();
    setLogLive(false);
    session.provisioningEvents = [];
    session.activityProjections = new Map();
    session.activityFilter = "all";
    session.lastActivitySequence = 0n;
    session.lastProvisioningSequence = 0n;
    ui.activityList.replaceChildren();
    ui.activityList.hidden = true;
    ui.activityEmpty.hidden = false;
    setEmptyState(ui.activityEmpty, label === "Connecting" ? "Connecting to activity" : "No activity loaded", message);
    setSourceState(ui.activityState, label, tone);
    ui.activityRetry.hidden = true;
    renderActivityFilters();
    // An emptied buffer empties the lanes and bars with it — the honest
    // empty, not yesterday's spans over a team that just changed.
    renderDashboardCharts();
    renderActivityScreen([], [], [], new Set());
  }

  function resetSessionHistoryView(message, label, tone = "") {
    session.sessions = [];
    session.sessionIds = new Set();
    session.sessionNextPageToken = "";
    session.sessionPageTokens = new Set();
    session.sessionHistoryLoading = false;
    setSourceState(ui.sessionHistoryState, label, tone);
    ui.sessionsMore.hidden = true;
    ui.sessionsMore.disabled = false;
    ui.sessionsMore.setAttribute("aria-label", message);
    replaceActivityProjections("session-history:", []);
    renderRunsView();
  }

  function resetWorkspaceHistoryView(message, label, tone = "") {
    session.workspaceChanges = [];
    session.workspaceChangeIds = new Set();
    session.workspaceNextPageToken = "";
    session.workspacePageTokens = new Set();
    session.workspaceHistoryLoading = false;
    session.lastWorkspaceSequence = 0n;
    setSourceState(ui.workspaceHistoryState, label, tone);
    ui.workspaceMore.hidden = true;
    ui.workspaceMore.disabled = false;
    ui.workspaceMore.setAttribute("aria-label", message);
    replaceActivityProjections("workspace-change:", []);
    renderRunsView();
  }

  function safeOpaqueId(value, required = true) {
    if (value === undefined || value === null || value === "") return required ? "" : "";
    if (typeof value !== "string" || value !== value.trim() || value.length > 128 || /[\u0000-\u001f\u007f]/.test(value)) return "";
    return value;
  }

  function opaquePageToken(value) {
    if (value === undefined || value === null || value === "") return "";
    if (typeof value !== "string" || value.length > 4096 || /[\u0000-\u001f\u007f]/.test(value)) {
      throw new ApiError("The service returned an invalid opaque page cursor", 0, "invalid_response", "");
    }
    return value;
  }

  function sessionKindLabel(value) {
    if (typeof value === "number") return ["", "objective", "delegated"][value] || "";
    return ({
      AGENT_SESSION_KIND_OBJECTIVE: "objective",
      AGENT_SESSION_KIND_DELEGATED: "delegated"
    })[stringValue(value)] || "";
  }

  function sessionStatusLabel(value) {
    if (typeof value === "number") return ["", "started", "running", "waiting", "blocked", "paused", "succeeded", "failed", "cancelled"][value] || "";
    return ({
      AGENT_SESSION_STATUS_STARTED: "started",
      AGENT_SESSION_STATUS_RUNNING: "running",
      AGENT_SESSION_STATUS_WAITING: "waiting",
      AGENT_SESSION_STATUS_BLOCKED: "blocked",
      AGENT_SESSION_STATUS_PAUSED: "paused",
      AGENT_SESSION_STATUS_SUCCEEDED: "succeeded",
      AGENT_SESSION_STATUS_FAILED: "failed",
      AGENT_SESSION_STATUS_CANCELLED: "cancelled"
    })[stringValue(value)] || "";
  }

  function sessionHistoryEntry(record, teamId) {
    const id = safeOpaqueId(record?.id);
    const recordTeamId = safeOpaqueId(record?.teamId);
    const agentId = safeOpaqueId(record?.agentId);
    const workAssignmentId = safeOpaqueId(record?.workAssignmentId);
    const organizationId = safeOpaqueId(record?.organizationId);
    const objectiveId = safeOpaqueId(record?.objectiveId, false);
    const initiativeId = safeOpaqueId(record?.initiativeId, false);
    const repositoryId = safeOpaqueId(record?.repositoryId, false);
    const kind = sessionKindLabel(record?.sessionKind);
    const status = sessionStatusLabel(record?.sessionStatus);
    const summary = stringValue(record?.safeSummary);
    const generation = int64Value(record?.teamGeneration);
    const assignmentVersion = int64Value(record?.assignmentVersion);
    const issueNumber = int64Value(record?.githubIssueNumber);
    const pullRequestNumber = int64Value(record?.githubPullRequestNumber);
    const startedAt = timestampDate(record?.startedAt);
    const endedAt = record?.endedAt ? timestampDate(record.endedAt) : null;
    const lastObservedAt = timestampDate(record?.lastObservedAt);
    const repositoryNumericId = repositoryId ? int64Value(repositoryId) : 0n;
    if (
      !id || !agentId || !workAssignmentId || !organizationId || organizationId !== session.organizationId ||
      !recordTeamId || recordTeamId !== stringValue(teamId) || !kind || !status || !summary || summary.length > 1000 || /[\u0000-\u001f\u007f]/.test(summary) ||
      generation === null || generation <= 0n || assignmentVersion === null || assignmentVersion <= 0n ||
      issueNumber === null || pullRequestNumber === null || !startedAt || !lastObservedAt || lastObservedAt < startedAt ||
      (record?.endedAt && !endedAt) || (endedAt && endedAt < startedAt) ||
      (record?.objectiveId && !objectiveId) || (record?.initiativeId && !initiativeId) ||
      (record?.repositoryId && (!repositoryId || repositoryNumericId === null || repositoryNumericId <= 0n))
    ) throw new ApiError("SessionService returned an invalid assignment-bound lifecycle record", 0, "invalid_response", "");
    return {
      id: `session-history:${id}`,
      category: "sessions",
      // The agent this record belongs to. It rides the entry so the Activity
      // screen can split the record by who produced it: without it a snapshot
      // was an event with no author, and the split undercounted every agent.
      agentId,
      source: "SessionService snapshot",
      title: `Session · ${status}`,
      safeSummary: summary,
      detail: `${kind} assignment · Agent ${agentId} · Work assignment ${workAssignmentId} v${assignmentVersion.toString()} · Team generation ${generation.toString()}`,
      status,
      sequenceLabel: "Lifecycle snapshot",
      occurredAt: record.lastObservedAt,
      sessionId: id,
      objectiveId,
      initiativeId,
      repositoryId,
      githubIssueId: issueNumber > 0n ? issueNumber.toString() : "",
      pullRequestId: pullRequestNumber > 0n ? pullRequestNumber.toString() : ""
    };
  }

  function workspaceChangeKindLabel(value) {
    if (typeof value === "number") return ["", "added", "modified", "deleted", "renamed", "copied"][value] || "";
    return ({
      WORKSPACE_CHANGE_KIND_ADDED: "added",
      WORKSPACE_CHANGE_KIND_MODIFIED: "modified",
      WORKSPACE_CHANGE_KIND_DELETED: "deleted",
      WORKSPACE_CHANGE_KIND_RENAMED: "renamed",
      WORKSPACE_CHANGE_KIND_COPIED: "copied"
    })[stringValue(value)] || "";
  }

  function workspaceDiffAvailabilityLabel(value) {
    if (typeof value === "number") return ["", "available", "binary file", "unsafe content", "oversize diff", "diff error"][value] || "";
    return ({
      WORKSPACE_DIFF_AVAILABILITY_AVAILABLE: "available",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_BINARY: "binary file",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_UNSAFE: "unsafe content",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_OVERSIZE: "oversize diff",
      WORKSPACE_DIFF_AVAILABILITY_UNAVAILABLE_ERROR: "diff error"
    })[stringValue(value)] || "";
  }

  function canonicalRelativePath(value) {
    if (typeof value !== "string" || !value || value.length > 1024 || value.startsWith("/") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return "";
    const segments = value.split("/");
    return segments.some((segment) => !segment || segment === "." || segment === "..") ? "" : value;
  }

  function validSafeDiff(value) {
    if (typeof value !== "string" || new TextEncoder().encode(value).byteLength > 4096 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return false;
    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(index + 1);
        if (next < 0xdc00 || next > 0xdfff) return false;
        index += 1;
      } else if (code >= 0xdc00 && code <= 0xdfff) return false;
    }
    return true;
  }

  function workspaceHistoryEntry(record, teamId, previousSequence) {
    const id = safeOpaqueId(record?.id);
    const recordTeamId = safeOpaqueId(record?.teamId);
    const agentId = safeOpaqueId(record?.agentId);
    const workAssignmentId = safeOpaqueId(record?.workAssignmentId);
    const sessionId = safeOpaqueId(record?.sessionId);
    const organizationId = safeOpaqueId(record?.organizationId);
    const objectiveId = safeOpaqueId(record?.objectiveId, false);
    const initiativeId = safeOpaqueId(record?.initiativeId, false);
    const repositoryId = safeOpaqueId(record?.repositoryId);
    const relativePath = canonicalRelativePath(record?.relativePath);
    const kind = workspaceChangeKindLabel(record?.changeKind);
    const availability = workspaceDiffAvailabilityLabel(record?.diffAvailability);
    const sequence = int64Value(record?.sequence);
    const generation = int64Value(record?.teamGeneration);
    const assignmentVersion = int64Value(record?.assignmentVersion);
    const additions = int64Value(record?.additions);
    const deletions = int64Value(record?.deletions);
    const issueNumber = int64Value(record?.githubIssueNumber);
    const pullRequestNumber = int64Value(record?.githubPullRequestNumber);
    const observedAt = timestampDate(record?.observedAt);
    const repositoryNumericId = int64Value(repositoryId);
    const safeDiff = typeof record?.safeDiff === "string" ? record.safeDiff : null;
    const diffRedacted = record?.diffRedacted;
    const diffTruncated = record?.diffTruncated;
    if (
      !id || !agentId || !workAssignmentId || !sessionId || !organizationId || organizationId !== session.organizationId ||
      !recordTeamId || recordTeamId !== stringValue(teamId) || !relativePath || !kind || !availability || !observedAt ||
      repositoryNumericId === null || repositoryNumericId <= 0n || generation === null || generation <= 0n || assignmentVersion === null || assignmentVersion <= 0n ||
      sequence === null || sequence <= previousSequence || additions === null || deletions === null || issueNumber === null || pullRequestNumber === null ||
      safeDiff === null || !validSafeDiff(safeDiff) || typeof diffRedacted !== "boolean" || typeof diffTruncated !== "boolean" ||
      (availability !== "available" && (safeDiff || diffRedacted || diffTruncated)) ||
      (record?.objectiveId && !objectiveId) || (record?.initiativeId && !initiativeId)
    ) throw new ApiError("WorkspaceService returned an invalid customer-safe change record", 0, "invalid_response", "");
    const diffState = availability === "available"
      ? ["server-sanitized diff available", diffRedacted ? "sensitive text redacted" : "", diffTruncated ? "diff truncated" : ""].filter(Boolean).join(" · ")
      : `diff unavailable: ${availability}`;
    return {
      id: `workspace-change:${id}`,
      category: "workspace",
      agentId,
      source: "workspace",
      title: `${relativePath} · ${kind}`,
      safeSummary: `${additions.toString()} additions · ${deletions.toString()} deletions · ${diffState}.`,
      detail: `Agent ${agentId} · Work assignment ${workAssignmentId} v${assignmentVersion.toString()} · Team generation ${generation.toString()}`,
      status: kind,
      sequenceLabel: `Workspace change ${sequence.toString()}`,
      sequence,
      occurredAt: record.observedAt,
      sessionId,
      objectiveId,
      initiativeId,
      repositoryId,
      githubIssueId: issueNumber > 0n ? issueNumber.toString() : "",
      pullRequestId: pullRequestNumber > 0n ? pullRequestNumber.toString() : "",
      safeDiff,
      diffAvailability: availability,
      diffRedacted,
      diffTruncated
    };
  }

  function installSnapshotEntries(prefix, entries, append) {
    if (!append) {
      replaceActivityProjections(prefix, entries);
      return;
    }
    entries.forEach((entry) => session.activityProjections.set(entry.id, entry));
    renderActivityLedger();
  }

  function renderSessionHistoryResult(result, teamId, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      setSourceState(ui.sessionHistoryState, "Unavailable", "error");
      ui.sessionsMore.hidden = !session.sessionNextPageToken;
      ui.sessionsMore.setAttribute("aria-label", apiErrorMessage(result.reason, "Session history could not be loaded."));
      renderRunsView();
      return;
    }
    try {
      const records = Array.isArray(result.value?.sessions) ? result.value.sessions : [];
      if (records.length > 100) throw new ApiError("SessionService returned an oversized page", 0, "invalid_response", "");
      const localIds = new Set(session.sessionIds);
      const entries = records.map((record) => {
        const entry = sessionHistoryEntry(record, teamId);
        if (localIds.has(entry.id)) throw new ApiError("SessionService returned a duplicate session", 0, "invalid_response", "");
        localIds.add(entry.id);
        return entry;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.sessionPageTokens.has(next))) throw new ApiError("SessionService returned a repeated page cursor", 0, "invalid_response", "");
      records.forEach((record) => session.sessions.push(record));
      entries.forEach((entry) => session.sessionIds.add(entry.id));
      if (next) session.sessionPageTokens.add(next);
      session.sessionNextPageToken = next;
      installSnapshotEntries("session-history:", entries, append);
      setSourceState(ui.sessionHistoryState, session.sessions.length ? `${session.sessions.length} loaded` : "No sessions", session.sessions.length ? "success" : "");
      ui.sessionsMore.hidden = !next;
      ui.sessionsMore.disabled = false;
      ui.sessionsMore.setAttribute("aria-label", next ? "Load the next opaque SessionService snapshot page" : "All session history pages loaded");
      renderRunsView();
    } catch (error) {
      if (!append) {
        session.sessions = [];
        session.sessionIds = new Set();
        replaceActivityProjections("session-history:", []);
      }
      session.sessionNextPageToken = "";
      setSourceState(ui.sessionHistoryState, "Invalid response", "error");
      ui.sessionsMore.hidden = true;
      ui.sessionsMore.setAttribute("aria-label", apiErrorMessage(error, "Session history was rejected because it was invalid."));
      renderRunsView();
    }
  }

  function renderWorkspaceHistoryResult(result, teamId, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId) return;
    if (result.status === "rejected") {
      setSourceState(ui.workspaceHistoryState, "Unavailable", "error");
      ui.workspaceMore.hidden = !session.workspaceNextPageToken;
      ui.workspaceMore.setAttribute("aria-label", apiErrorMessage(result.reason, "Workspace changes could not be loaded."));
      renderRunsView();
      return;
    }
    try {
      const records = Array.isArray(result.value?.changes) ? result.value.changes : [];
      if (records.length > 100) throw new ApiError("WorkspaceService returned an oversized page", 0, "invalid_response", "");
      const localIds = new Set(session.workspaceChangeIds);
      let previousSequence = session.lastWorkspaceSequence;
      const entries = records.map((record) => {
        const entry = workspaceHistoryEntry(record, teamId, previousSequence);
        if (localIds.has(entry.id)) throw new ApiError("WorkspaceService returned a duplicate change", 0, "invalid_response", "");
        localIds.add(entry.id);
        previousSequence = entry.sequence;
        return entry;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.workspacePageTokens.has(next))) throw new ApiError("WorkspaceService returned a repeated page cursor", 0, "invalid_response", "");
      records.forEach((record) => session.workspaceChanges.push(record));
      entries.forEach((entry) => session.workspaceChangeIds.add(entry.id));
      if (entries.length) session.lastWorkspaceSequence = entries.at(-1).sequence;
      if (next) session.workspacePageTokens.add(next);
      session.workspaceNextPageToken = next;
      installSnapshotEntries("workspace-change:", entries, append);
      setSourceState(ui.workspaceHistoryState, session.workspaceChanges.length ? `${session.workspaceChanges.length} loaded` : "No changes", session.workspaceChanges.length ? "success" : "");
      ui.workspaceMore.hidden = !next;
      ui.workspaceMore.disabled = false;
      ui.workspaceMore.setAttribute("aria-label", next ? "Load the next opaque WorkspaceService snapshot page" : "All workspace change pages loaded");
      renderRunsView();
    } catch (error) {
      if (!append) {
        session.workspaceChanges = [];
        session.workspaceChangeIds = new Set();
        session.lastWorkspaceSequence = 0n;
        replaceActivityProjections("workspace-change:", []);
      }
      session.workspaceNextPageToken = "";
      setSourceState(ui.workspaceHistoryState, "Invalid response", "error");
      ui.workspaceMore.hidden = true;
      ui.workspaceMore.setAttribute("aria-label", apiErrorMessage(error, "Workspace changes were rejected because they were invalid."));
      renderRunsView();
    }
  }

  async function loadMoreSessions() {
    const teamId = session.selectedTeamId;
    const pageToken = session.sessionNextPageToken;
    const generation = session.workspaceGeneration;
    if (!teamId || !pageToken || session.sessionHistoryLoading) return;
    session.sessionHistoryLoading = true;
    ui.sessionsMore.disabled = true;
    setSourceState(ui.sessionHistoryState, "Loading more", "loading");
    try {
      const response = await apiRequest("sessions", { teamId, page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderSessionHistoryResult({ status: "fulfilled", value: response }, teamId, pageToken, true);
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderSessionHistoryResult({ status: "rejected", reason: error }, teamId, pageToken, true);
    } finally {
      if (generation === session.workspaceGeneration && teamId === session.selectedTeamId) {
        session.sessionHistoryLoading = false;
        ui.sessionsMore.disabled = false;
      }
    }
  }

  async function loadMoreWorkspaceChanges() {
    const teamId = session.selectedTeamId;
    const pageToken = session.workspaceNextPageToken;
    const generation = session.workspaceGeneration;
    if (!teamId || !pageToken || session.workspaceHistoryLoading) return;
    session.workspaceHistoryLoading = true;
    ui.workspaceMore.disabled = true;
    setSourceState(ui.workspaceHistoryState, "Loading more", "loading");
    try {
      const response = await apiRequest("workspace_changes", { teamId, afterSequence: "0", page: { pageSize: 100, pageToken } });
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderWorkspaceHistoryResult({ status: "fulfilled", value: response }, teamId, pageToken, true);
    } catch (error) {
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      renderWorkspaceHistoryResult({ status: "rejected", reason: error }, teamId, pageToken, true);
    } finally {
      if (generation === session.workspaceGeneration && teamId === session.selectedTeamId) {
        session.workspaceHistoryLoading = false;
        ui.workspaceMore.disabled = false;
      }
    }
  }

  // ── The agent detail view ─────────────────────────────────────────────
  // One crew member, in full. Identity comes from the roster response the
  // workspace refresh already confirmed; sessions and code changes are the
  // same snapshot services the team log projects, asked for this agent
  // alone; the activity slice is cut client-side from the one team stream;
  // and spend is the per-agent row of the breakdown the economics view
  // already loaded. The view therefore costs exactly two requests, and
  // never a second stream.

  // The crew, described the way the floor's own copy describes them: third
  // person, present tense, GitHub's verbs. One sentence per role.
  const engineerRoleSentence = "Picks up issues the Engineering Manager assigns, writes the code, and opens a pull request. Reviews teammates' pull requests - every merge needs two engineer approvals.";
  const agentRoleSentences = Object.freeze({
    AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER: "Turns what you say matters into the plan: interviews you, writes the PRD for your sign-off, and files the issues the engineers pick up.",
    AGENT_ROLE_ENGINEERING_MANAGER: "Breaks the plan into assignments, routes each issue to an engineer, and reviews every pull request before it can merge.",
    AGENT_ROLE_PRODUCT_DESIGNER: "Answers interface questions before they become rework and publishes the designs the issues link to.",
    AGENT_ROLE_STAFF_CLIENT: engineerRoleSentence,
    AGENT_ROLE_STAFF_BACKEND: engineerRoleSentence,
    AGENT_ROLE_STAFF_PLATFORM: engineerRoleSentence,
    AGENT_ROLE_ENGINEER: engineerRoleSentence
  });

  // The whole tile is the door, and the id travels on the tile's own
  // dataset - the handler reads the click's nearest tile rather than
  // trusting render order or a captured index.
  function crewTileAgentId(target) {
    const tile = target && typeof target.closest === "function" ? target.closest("[data-agent-open]") : null;
    return tile && tile.dataset ? stringValue(tile.dataset.agentId) : "";
  }

  function openAgentFromCrew(event) {
    const agentId = crewTileAgentId(event.target);
    if (!agentId) return;
    session.selectedAgentId = agentId;
    refreshSelectedAgent();
  }

  function resetAgentDetailView(message, label = "Waiting", tone = "") {
    session.agentDetailGeneration += 1;
    session.agentSessions = null;
    session.agentChanges = null;
    session.agentSessionsMore = false;
    session.agentChangesMore = false;
    if (ui.agentBody) ui.agentBody.hidden = true;
    if (ui.agentMissing) {
      ui.agentMissing.hidden = false;
      setEmptyState(ui.agentMissing, "No agent open", message);
    }
    setSourceState(ui.agentDetailState, label, tone);
    if (ui.agentActivityList) { ui.agentActivityList.replaceChildren(); ui.agentActivityList.hidden = true; }
    if (ui.agentActivityEmpty) ui.agentActivityEmpty.hidden = false;
    if (ui.agentSessionsList) { ui.agentSessionsList.replaceChildren(); ui.agentSessionsList.hidden = true; }
    if (ui.agentSessionsEmpty) ui.agentSessionsEmpty.hidden = false;
    setSourceState(ui.agentSessionsState, label, tone);
    if (ui.agentChangesList) { ui.agentChangesList.replaceChildren(); ui.agentChangesList.hidden = true; }
    if (ui.agentChangesEmpty) ui.agentChangesEmpty.hidden = false;
    setSourceState(ui.agentChangesState, label, tone);
    renderAgentCounters();
  }

  // Identity, synchronously, from the roster the workspace already holds.
  // Returns the confirmed record, or null - which is the stale-id state: a
  // team update can replace agents, and a remembered tile may point at
  // someone who is no longer on the roster.
  function renderAgentIdentity() {
    if (!ui.agentBody || !ui.agentMissing) return null;
    const agentId = session.selectedAgentId;
    if (!agentId) return null;
    const agent = session.agents.find((candidate) => stringValue(candidate?.id) === agentId) || null;
    if (!agent) {
      ui.agentBody.hidden = true;
      ui.agentMissing.hidden = false;
      setEmptyState(ui.agentMissing, "This agent is no longer on the crew", "A team update can replace crew members; the work they shipped stays on the team record. Your current crew is on the floor.");
      setSourceState(ui.agentDetailState, "Not on the roster");
      return null;
    }
    const role = agentRoleContract?.canonicalAgentRole?.(agent.role) || null;
    const roleLabel = role?.label || "Crew member";
    const rawName = stringValue(agent.name);
    const name = rawName && rawName.length <= 80 && !/[\u0000-\u001f\u007f]/.test(rawName) ? rawName : roleLabel;
    if (ui.agentMonogram) {
      ui.agentMonogram.textContent = (name.slice(0, 1) || "·").toUpperCase();
      if (role) ui.agentMonogram.dataset.roleKey = role.key;
      else delete ui.agentMonogram.dataset.roleKey;
    }
    const team = selectedTeam();
    if (ui.agentEyebrow) ui.agentEyebrow.textContent = team && stringValue(team.name) ? `${roleLabel} · ${stringValue(team.name)}` : roleLabel;
    if (ui.agentName) ui.agentName.textContent = name;
    if (ui.agentDescription) ui.agentDescription.textContent = agentRoleSentences[role?.key] || "Works on your team.";
    if (ui.agentModel) {
      const model = stringValue(agent.modelAlias).slice(0, 64);
      ui.agentModel.hidden = !model;
      ui.agentModel.textContent = model;
    }
    if (ui.agentHeartbeat) {
      const heard = timestampDate(agent.lastHeartbeatAt);
      ui.agentHeartbeat.hidden = !heard;
      ui.agentHeartbeat.textContent = heard ? `checked in ${relativeTime(heard)}` : "";
    }
    ui.agentMissing.hidden = true;
    ui.agentBody.hidden = false;
    renderAgentDetailLive();
    return agent;
  }

  // The live half of the view: the liveness chip, the "doing now" line and
  // the activity slice all age with the crew tiles, from the same sources.
  // Liveness is measured per role, exactly as the tiles measure it, so
  // engineers who share a role light together here as they do on the floor.
  function renderAgentDetailLive() {
    if (!ui.agentBody || ui.agentBody.hidden) return;
    const roleKey = ui.agentMonogram?.dataset.roleKey || "";
    const agent = session.agents.find((candidate) => stringValue(candidate?.id) === session.selectedAgentId) || null;
    const live = roleKey ? agentLiveness(roleKey) : { state: "quiet", since: "" };
    const idleLine = agent && lifecycleLabel(agent.state) === "active" ? "waiting for work" : (lifecycleLabel(agent?.state) || "state not reported").toLowerCase();
    const on = ["working", "briefed"].includes(live.state);
    if (ui.agentLivenessChip) {
      ui.agentLivenessChip.textContent = crewStatusLine(live, idleLine);
      ui.agentLivenessChip.classList.toggle("is-on", on);
    }
    if (ui.agentDoingPanel) ui.agentDoingPanel.classList.toggle("is-on", on);
    // The hero's monogram plate grows the breathing ring exactly when the
    // crew tile does — same liveness answer, same ambient beat.
    if (ui.agentMonogram) ui.agentMonogram.classList.toggle("is-on", on);
    if (ui.agentDoing) ui.agentDoing.textContent = (roleKey && latestActivityForRole(roleKey)) || "Nothing on the stream right now.";
    renderAgentActivity();
  }

  // This agent's slice of the team stream, cut client-side from the same
  // buffer the team log renders and built by the same row builder - never a
  // second stream, never a different phrasing of the same event.
  function renderAgentActivity() {
    if (!ui.agentActivityList || !ui.agentActivityEmpty) return;
    const agentId = session.selectedAgentId;
    const slice = [];
    for (let index = session.activityEvents.length - 1; index >= 0 && slice.length < 40; index -= 1) {
      const entry = session.activityEvents[index];
      if (agentId && stringValue(entry.agentId) === agentId) slice.push(entry);
    }
    const turns = groupActivityTurns(slice);
    const shown = turns.map((turn) => {
      const lead = turn.entries.find((entry) => entry.category !== "tools") || turn.entries[0];
      return { entry: lead, evidence: turn.speaker ? toolEvidence(turn.entries) : "" };
    });
    ui.agentActivityList.replaceChildren();
    shown.forEach(({ entry, evidence }) => ui.agentActivityList.append(activityLedgerItem(entry, evidence)));
    ui.agentActivityEmpty.hidden = shown.length > 0;
    ui.agentActivityList.hidden = shown.length === 0;
  }

  function renderAgentSessionsResult(result, teamId, agentId) {
    if (!ui.agentSessionsList || !ui.agentSessionsEmpty) return;
    session.agentSessions = null;
    session.agentSessionsMore = false;
    ui.agentSessionsList.replaceChildren();
    ui.agentSessionsList.hidden = true;
    ui.agentSessionsEmpty.hidden = false;
    if (result.status === "rejected") {
      setEmptyState(ui.agentSessionsEmpty, "Sessions unavailable", apiErrorMessage(result.reason, "Session history could not be loaded for this agent."));
      setSourceState(ui.agentSessionsState, "Unavailable", "error");
      return;
    }
    try {
      const records = Array.isArray(result.value?.sessions) ? result.value.sessions : [];
      if (records.length > 50) throw new ApiError("SessionService returned an oversized page", 0, "invalid_response", "");
      const seen = new Set();
      const entries = records.map((record) => {
        // The filter travelled on the request; a record for anyone else is
        // the service ignoring it, and the view fails closed rather than
        // captioning another agent's work with this one's name.
        if (safeOpaqueId(record?.agentId) !== agentId) throw new ApiError("SessionService returned a session outside the requested agent scope", 0, "invalid_response", "");
        const entry = sessionHistoryEntry(record, teamId);
        if (seen.has(entry.id)) throw new ApiError("SessionService returned a duplicate session", 0, "invalid_response", "");
        seen.add(entry.id);
        return entry;
      });
      entries.sort((left, right) => activityEntryTime(right) - activityEntryTime(left));
      session.agentSessions = entries;
      session.agentSessionsMore = Boolean(opaquePageToken(result.value?.page?.nextPageToken));
      entries.forEach((entry) => ui.agentSessionsList.append(activityLedgerItem(entry, "")));
      ui.agentSessionsEmpty.hidden = entries.length > 0;
      ui.agentSessionsList.hidden = entries.length === 0;
      setSourceState(ui.agentSessionsState, entries.length ? `${entries.length} loaded` : "No sessions", entries.length ? "success" : "");
    } catch (error) {
      session.agentSessions = null;
      session.agentSessionsMore = false;
      ui.agentSessionsList.replaceChildren();
      ui.agentSessionsList.hidden = true;
      ui.agentSessionsEmpty.hidden = false;
      setEmptyState(ui.agentSessionsEmpty, "Sessions rejected", apiErrorMessage(error, "Session history was rejected because it was invalid."));
      setSourceState(ui.agentSessionsState, "Invalid response", "error");
    }
  }

  function renderAgentChangesResult(result, teamId, agentId) {
    if (!ui.agentChangesList || !ui.agentChangesEmpty) return;
    session.agentChanges = null;
    session.agentChangesMore = false;
    ui.agentChangesList.replaceChildren();
    ui.agentChangesList.hidden = true;
    ui.agentChangesEmpty.hidden = false;
    if (result.status === "rejected") {
      setEmptyState(ui.agentChangesEmpty, "Code changes unavailable", apiErrorMessage(result.reason, "Workspace changes could not be loaded for this agent."));
      setSourceState(ui.agentChangesState, "Unavailable", "error");
      return;
    }
    try {
      const records = Array.isArray(result.value?.changes) ? result.value.changes : [];
      if (records.length > 50) throw new ApiError("WorkspaceService returned an oversized page", 0, "invalid_response", "");
      const seen = new Set();
      let previousSequence = 0n;
      const entries = records.map((record) => {
        if (safeOpaqueId(record?.agentId) !== agentId) throw new ApiError("WorkspaceService returned a change outside the requested agent scope", 0, "invalid_response", "");
        const entry = workspaceHistoryEntry(record, teamId, previousSequence);
        if (seen.has(entry.id)) throw new ApiError("WorkspaceService returned a duplicate change", 0, "invalid_response", "");
        seen.add(entry.id);
        previousSequence = entry.sequence;
        return entry;
      });
      const ordered = entries.slice().sort((left, right) => activityEntryTime(right) - activityEntryTime(left));
      session.agentChanges = ordered;
      session.agentChangesMore = Boolean(opaquePageToken(result.value?.page?.nextPageToken));
      ordered.forEach((entry) => ui.agentChangesList.append(activityLedgerItem(entry, "")));
      ui.agentChangesEmpty.hidden = ordered.length > 0;
      ui.agentChangesList.hidden = ordered.length === 0;
      setSourceState(ui.agentChangesState, ordered.length ? `${ordered.length} loaded` : "No changes", ordered.length ? "success" : "");
    } catch (error) {
      session.agentChanges = null;
      session.agentChangesMore = false;
      ui.agentChangesList.replaceChildren();
      ui.agentChangesList.hidden = true;
      ui.agentChangesEmpty.hidden = false;
      setEmptyState(ui.agentChangesEmpty, "Code changes rejected", apiErrorMessage(error, "Workspace changes were rejected because they were invalid."));
      setSourceState(ui.agentChangesState, "Invalid response", "error");
    }
  }

  // Spend is the per-agent row of the server-calculated breakdown the team
  // refresh already loaded (groupBy agent - each row carries the agent's own
  // id in scope.id). No request, and no invented number: an absent grouping
  // says "not measured", never zero.
  function agentSpendRecord() {
    const result = session.economicsBreakdowns.get("agent");
    if (!result || result.status !== "fulfilled") return null;
    return result.value.records.find((record) => stringValue(record?.scope?.id) === session.selectedAgentId) || null;
  }

  function renderAgentSpend() {
    if (!ui.agentSpend || !session.selectedAgentId) return;
    const result = session.economicsBreakdowns.get("agent");
    if (!result || result.status !== "fulfilled") {
      ui.agentSpend.textContent = result ? "The measured per-agent breakdown is unavailable right now." : "No measured breakdown loaded yet.";
      return;
    }
    const record = agentSpendRecord();
    if (!record) {
      ui.agentSpend.textContent = "No usage has been attributed to this agent in the current paid period.";
      return;
    }
    ui.agentSpend.textContent = `${formatCreditMicros(record.creditsUsedMicros)} credits · ${formatCreditValue(record.creditsUsedMicros)} · ${formatIntegerCount(record.usageEventCount)} usage events · measured ${relativeTime(result.value.measuredAt)}`;
  }

  // Three readings, every one from data already on this screen. A count the
  // service has not answered yet is a dash and a sentence, never a zero, and
  // a first page that has more behind it says so with a plus.
  function renderAgentCounters() {
    if (ui.agentCountSessions) {
      const loaded = Array.isArray(session.agentSessions);
      setStatValue(ui.agentCountSessions, loaded ? `${session.agentSessions.length}${session.agentSessionsMore ? "+" : ""}` : "—");
      if (ui.agentCountSessionsNote) ui.agentCountSessionsNote.textContent = loaded ? (session.agentSessionsMore ? "more on the record" : "on the record") : "not loaded";
    }
    if (ui.agentCountChanges) {
      const loaded = Array.isArray(session.agentChanges);
      setStatValue(ui.agentCountChanges, loaded ? `${session.agentChanges.length}${session.agentChangesMore ? "+" : ""}` : "—");
      if (ui.agentCountChangesNote) ui.agentCountChangesNote.textContent = loaded ? (session.agentChangesMore ? "more on the record" : "on the record") : "not loaded";
    }
    if (ui.agentCountSpend) {
      const record = agentSpendRecord();
      setStatValue(ui.agentCountSpend, record ? formatCreditMicros(record.creditsUsedMicros) : "—");
      if (ui.agentCountSpendNote) ui.agentCountSpendNote.textContent = record ? "this paid period" : "not measured";
    }
  }

  // The agent fan-out, under the same generation-guard discipline as
  // refreshSelectedTeam: bump the generation first, render identity from
  // held state, then let the two history requests settle - and accept their
  // answers only if this is still the same agent, team and generation.
  async function refreshSelectedAgent() {
    const team = selectedTeam();
    const agentId = session.selectedAgentId;
    const generation = ++session.agentDetailGeneration;
    session.agentSessions = null;
    session.agentChanges = null;
    session.agentSessionsMore = false;
    session.agentChangesMore = false;
    if (!team || !agentId) {
      resetAgentDetailView("Choose a crew member on the floor to open their record.");
      return;
    }
    const agent = renderAgentIdentity();
    renderAgentSpend();
    renderAgentCounters();
    if (!agent) return;
    setSourceState(ui.agentDetailState, "Loading", "loading");
    setSourceState(ui.agentSessionsState, "Loading", "loading");
    setSourceState(ui.agentChangesState, "Loading", "loading");
    const [sessionsResult, changesResult] = await Promise.allSettled([
      apiRequest("sessions", { teamId: team.id, agentId, page: { pageSize: 50 } }),
      apiRequest("workspace_changes", { teamId: team.id, agentId, afterSequence: "0", page: { pageSize: 50 } })
    ]);
    if (generation !== session.agentDetailGeneration || agentId !== session.selectedAgentId || team.id !== session.selectedTeamId) return;
    renderAgentSessionsResult(sessionsResult, team.id, agentId);
    renderAgentChangesResult(changesResult, team.id, agentId);
    renderAgentCounters();
    const settled = [sessionsResult, changesResult].filter((result) => result.status === "fulfilled").length;
    setSourceState(ui.agentDetailState, settled === 2 ? "Loaded" : settled ? "Partially loaded" : "Unavailable", settled === 2 ? "success" : "error");
  }

  function resetDeliveryRecords(message, label, tone = "") {
    session.githubIssues = [];
    session.githubIssueIds = new Set();
    session.githubIssuesNextPageToken = "";
    session.githubIssuePageTokens = new Set();
    session.githubIssuesLoading = false;
    session.githubIssuesState = label === "Loading" ? "loading" : "waiting";
    session.githubIssueLastSort = null;
    session.githubPullRequests = [];
    session.githubPullRequestIds = new Set();
    session.githubPullRequestsNextPageToken = "";
    session.githubPullRequestPageTokens = new Set();
    session.githubPullRequestsLoading = false;
    session.githubPullRequestsState = label === "Loading" ? "loading" : "waiting";
    session.githubPullRequestLastSort = null;
    session.deliveryLoadGeneration += 1;
    setSourceState(ui.deliveryHistoryState, label, tone);
    ui.deliveryHistoryState.title = message;
    ui.issuesMore.hidden = true;
    ui.issuesMore.disabled = false;
    ui.pullRequestsMore.hidden = true;
    ui.pullRequestsMore.disabled = false;
    replaceActivityProjections("github-issue:", []);
    replaceActivityProjections("github-pull-request:", []);
  }

  function resetDeliveryHistoryView(message, label, tone = "") {
    resetDeliveryRecords(message, label, tone);
    session.deliveryRepositoryId = "";
    ui.deliveryRepository.replaceChildren();
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No selected repository";
    ui.deliveryRepository.append(option);
    ui.deliveryRepository.disabled = true;
  }

  // Every repository the SELECTED TEAM was granted — not the organization's
  // projection, which is wider. A team may legitimately hold a repository the
  // organization has since deselected, so selectedForTeams is not a filter
  // here: the grant is the authority, and hiding a granted repository would
  // make a broken team look correctly configured.
  function deliveryRepositories() {
    const repositories = [];
    const seen = new Set();
    for (const repository of (session.teamRepositories || [])) {
      const numericId = int64Value(repository?.githubRepositoryId);
      const owner = stringValue(repository?.owner);
      const name = stringValue(repository?.name);
      const organizationId = safeOpaqueId(repository?.organizationId);
      if (
        numericId === null || numericId <= 0n || seen.has(numericId.toString()) || organizationId !== session.organizationId ||
        !owner || owner.length > 100 || !/^[A-Za-z0-9.-]+$/.test(owner) ||
        !name || name.length > 100 || !/^[A-Za-z0-9._-]+$/.test(name)
      ) throw new ApiError("RepositoryService returned an invalid selected delivery scope", 0, "invalid_response", "");
      seen.add(numericId.toString());
      repositories.push({ id: numericId.toString(), owner, name, label: `${owner}/${name}` });
    }
    return repositories;
  }

  // The scope a delivery read is answered in. The default is the team's WHOLE
  // grant, which the server accepts as an absent repository filter since
  // platform-protos 350acd91 — before that a customer had to pick one
  // repository from a dropdown and the floor showed one repository's work as
  // though it were the team's. A narrower pick is still available, because
  // "what is happening in this one repository" is a real question.
  function configureDeliveryRepository(preferredId = "") {
    try {
      const repositories = deliveryRepositories();
      ui.deliveryRepository.replaceChildren();
      if (!repositories.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No selected repository";
        ui.deliveryRepository.append(option);
        ui.deliveryRepository.disabled = true;
        session.deliveryRepositoryId = "";
        session.githubIssuesState = "empty";
        session.githubPullRequestsState = "empty";
        setSourceState(ui.deliveryHistoryState, "No repositories granted");
        ui.deliveryHistoryState.title = "This team holds no repositories, so it has no delivery records. An owner grants them in Settings.";
        return null;
      }
      const all = document.createElement("option");
      all.value = "";
      all.textContent = repositories.length === 1 ? repositories[0].label : `All ${repositories.length} repositories`;
      ui.deliveryRepository.append(all);
      repositories.forEach((repository) => {
        const option = document.createElement("option");
        option.value = repository.id;
        option.textContent = repository.label;
        ui.deliveryRepository.append(option);
      });
      const narrowed = repositories.find((repository) => repository.id === preferredId) || null;
      session.deliveryRepositoryId = narrowed ? narrowed.id : "";
      ui.deliveryRepository.value = session.deliveryRepositoryId;
      ui.deliveryRepository.disabled = false;
      return deliveryScope(repositories, narrowed);
    } catch (error) {
      session.deliveryRepositoryId = "";
      ui.deliveryRepository.replaceChildren();
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Repository scope unavailable";
      ui.deliveryRepository.append(option);
      ui.deliveryRepository.disabled = true;
      session.githubIssuesState = "invalid";
      session.githubPullRequestsState = "invalid";
      setSourceState(ui.deliveryHistoryState, "Invalid repository scope", "error");
      ui.deliveryHistoryState.title = apiErrorMessage(error, "The selected delivery repository scope is invalid.");
      return null;
    }
  }

  function updateDeliveryHistoryState() {
    const states = [session.githubIssuesState, session.githubPullRequestsState];
    if (!session.deliveryRepositoryId) return;
    if (states.some((state) => state === "loading")) {
      setSourceState(ui.deliveryHistoryState, "Loading", "loading");
      return;
    }
    if (states.every((state) => state === "loaded")) {
      setSourceState(ui.deliveryHistoryState, `${session.githubIssues.length} issues · ${session.githubPullRequests.length} PRs`, "success");
      ui.deliveryHistoryState.title = "Issues and pull requests are both up to date.";
      return;
    }
    if (states.some((state) => state === "loaded")) {
      setSourceState(ui.deliveryHistoryState, `Partial · ${session.githubIssues.length} issues · ${session.githubPullRequests.length} PRs`, "error");
      ui.deliveryHistoryState.title = "Part of your GitHub history is unavailable right now, so nothing is guessed at.";
      return;
    }
    setSourceState(ui.deliveryHistoryState, states.includes("invalid") ? "Invalid response" : "Unavailable", "error");
    ui.deliveryHistoryState.title = "We could not read your issues and pull requests reliably, so none are shown.";
  }

  function githubIssueStateLabel(value) {
    if (typeof value === "number") return ["", "open", "closed", "deleted"][value] || "";
    return ({
      GIT_HUB_ISSUE_STATE_OPEN: "open",
      GIT_HUB_ISSUE_STATE_CLOSED: "closed",
      GIT_HUB_ISSUE_STATE_DELETED: "deleted"
    })[stringValue(value)] || "";
  }

  function githubPullRequestStateLabel(value) {
    if (typeof value === "number") return ["", "open", "closed", "merged"][value] || "";
    return ({
      GIT_HUB_PULL_REQUEST_STATE_OPEN: "open",
      GIT_HUB_PULL_REQUEST_STATE_CLOSED: "closed",
      GIT_HUB_PULL_REQUEST_STATE_MERGED: "merged"
    })[stringValue(value)] || "";
  }

  function safeGitHubText(value, maximum, required = false) {
    if (value === undefined || value === null || value === "") return required ? "" : "";
    if (typeof value !== "string" || value.length > maximum || /[\u0000-\u001f\u007f]/.test(value)) return "";
    const normalized = value.trim();
    return required && !normalized ? "" : normalized;
  }

  function safeGitHubList(value, maximumItems, maximumLength) {
    if (!Array.isArray(value) || value.length > maximumItems) throw new ApiError("GitHubDeliveryService returned an invalid text list", 0, "invalid_response", "");
    const seen = new Set();
    return value.map((entry) => {
      const normalized = safeGitHubText(entry, maximumLength, true);
      if (!normalized || seen.has(normalized)) throw new ApiError("GitHubDeliveryService returned an invalid or duplicate text list value", 0, "invalid_response", "");
      seen.add(normalized);
      return normalized;
    });
  }

  function exactGitHubDeliveryUrl(value, repository, resource, number) {
    if (typeof value !== "string" || value !== value.trim()) return "";
    try {
      const url = new URL(value);
      const expectedPath = `/${repository.owner}/${repository.name}/${resource}/${number}`;
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash || url.pathname !== expectedPath) return "";
      return value;
    } catch {
      return "";
    }
  }

  function validDeliverySort(current, previous) {
    return !previous || current.createdAt < previous.createdAt || (current.createdAt === previous.createdAt && current.id.localeCompare(previous.id) < 0);
  }

  function normalizedGitHubIssue(record, scope, previousSort) {
    const id = safeOpaqueId(record?.id);
    const repositoryId = int64Value(record?.githubRepositoryId);
    // The record names its own repository; the scope says which ones this
    // read was allowed to return. A record outside it is a widened response,
    // which is rejected rather than displayed.
    const repository = repositoryId === null ? null : scope.repositories.get(repositoryId.toString()) || null;
    if (!repository) throw new ApiError("GitHubDeliveryService returned a record outside the team's granted repositories", 0, "invalid_response", "");
    const number = int64Value(record?.number);
    const comments = int64Value(record?.commentsCount);
    const title = safeGitHubText(record?.title, 256, true);
    const state = githubIssueStateLabel(record?.state);
    const stateReason = safeGitHubText(record?.stateReason, 80);
    const author = safeGitHubText(record?.authorLogin, 100);
    const assignees = safeGitHubList(record?.assigneeLogins, 100, 100);
    const labels = safeGitHubList(record?.labelNames, 100, 255);
    const createdAt = timestampDate(record?.createdAt);
    const updatedAt = timestampDate(record?.updatedAt);
    const closedAt = record?.closedAt ? timestampDate(record.closedAt) : null;
    const sort = { id, createdAt: createdAt?.getTime() || 0 };
    const artifactUrl = number === null ? "" : exactGitHubDeliveryUrl(record?.githubUrl, repository, "issues", number.toString());
    if (
      !id || number === null || number <= 0n || comments === null || comments < 0n ||
      !title || !state || !artifactUrl || typeof record?.locked !== "boolean" || !createdAt || !updatedAt || updatedAt < createdAt ||
      (record?.closedAt && (!closedAt || closedAt < createdAt)) || !validDeliverySort(sort, previousSort)
    ) throw new ApiError("GitHubDeliveryService returned an invalid issue projection", 0, "invalid_response", "");
    return {
      sort,
      entry: {
        id: `github-issue:${repository.id}:${id}`,
        category: "delivery",
        source: "github issue",
        title: `Issue #${number.toString()} · ${title}`,
        safeSummary: `${state} · ${comments.toString()} comments${record.locked ? " · locked" : ""}.`,
        detail: [stateReason ? `Reason ${stateReason}` : "", author ? `Author ${author}` : "Author unavailable", assignees.length ? `Assignees ${assignees.join(", ")}` : "No assignees", labels.length ? `Labels ${labels.join(", ")}` : "No labels"].filter(Boolean).join(" · "),
        artifactUrl,
        status: state,
        sequenceLabel: "Webhook-backed issue snapshot",
        occurredAt: record.updatedAt,
        repositoryId: repository.id,
        githubIssueId: number.toString()
      }
    };
  }

  function normalizedGitHubPullRequest(record, scope, previousSort) {
    const id = safeOpaqueId(record?.id);
    const repositoryId = int64Value(record?.githubRepositoryId);
    // The record names its own repository; the scope says which ones this
    // read was allowed to return. A record outside it is a widened response,
    // which is rejected rather than displayed.
    const repository = repositoryId === null ? null : scope.repositories.get(repositoryId.toString()) || null;
    if (!repository) throw new ApiError("GitHubDeliveryService returned a record outside the team's granted repositories", 0, "invalid_response", "");
    const number = int64Value(record?.number);
    const title = safeGitHubText(record?.title, 256, true);
    const state = githubPullRequestStateLabel(record?.state);
    const author = safeGitHubText(record?.authorLogin, 100);
    const assignees = safeGitHubList(record?.assigneeLogins, 100, 100);
    const labels = safeGitHubList(record?.labelNames, 100, 255);
    const headRef = safeGitHubText(record?.headRef, 255, true);
    const baseRef = safeGitHubText(record?.baseRef, 255, true);
    const counterNames = ["commentsCount", "reviewCommentsCount", "commitsCount", "additions", "deletions", "changedFiles"];
    const counters = Object.fromEntries(counterNames.map((name) => [name, int64Value(record?.[name])]));
    const createdAt = timestampDate(record?.createdAt);
    const updatedAt = timestampDate(record?.updatedAt);
    const closedAt = record?.closedAt ? timestampDate(record.closedAt) : null;
    const mergedAt = record?.mergedAt ? timestampDate(record.mergedAt) : null;
    const sort = { id, createdAt: createdAt?.getTime() || 0 };
    const artifactUrl = number === null ? "" : exactGitHubDeliveryUrl(record?.githubUrl, repository, "pull", number.toString());
    if (
      !id || number === null || number <= 0n || !title || !state ||
      !artifactUrl || typeof record?.draft !== "boolean" || !headRef || !baseRef || Object.values(counters).some((value) => value === null || value < 0n) ||
      !createdAt || !updatedAt || updatedAt < createdAt || (record?.closedAt && (!closedAt || closedAt < createdAt)) ||
      (record?.mergedAt && (!mergedAt || mergedAt < createdAt)) || (state === "merged" && !mergedAt) || !validDeliverySort(sort, previousSort)
    ) throw new ApiError("GitHubDeliveryService returned an invalid pull-request projection", 0, "invalid_response", "");
    return {
      sort,
      entry: {
        id: `github-pull-request:${repository.id}:${id}`,
        category: "delivery",
        source: "github pull request",
        title: `PR #${number.toString()} · ${title}`,
        safeSummary: `${state}${record.draft ? " draft" : ""} · ${counters.commitsCount.toString()} commits · ${counters.changedFiles.toString()} files · +${counters.additions.toString()} / −${counters.deletions.toString()}.`,
        detail: [`${headRef} → ${baseRef}`, author ? `Author ${author}` : "Author unavailable", `${counters.commentsCount.toString()} comments`, `${counters.reviewCommentsCount.toString()} review comments`, assignees.length ? `Assignees ${assignees.join(", ")}` : "No assignees", labels.length ? `Labels ${labels.join(", ")}` : "No labels"].join(" · "),
        artifactUrl,
        status: state,
        sequenceLabel: "Webhook-backed pull-request snapshot",
        occurredAt: record.updatedAt,
        repositoryId: repository.id,
        pullRequestId: number.toString()
      }
    };
  }

  function renderGitHubIssuesResult(result, teamId, scope, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
    if (result.status === "rejected") {
      session.githubIssuesState = "unavailable";
      ui.issuesMore.hidden = !session.githubIssuesNextPageToken;
      ui.issuesMore.title = apiErrorMessage(result.reason, "Issue history is unavailable.");
      updateDeliveryHistoryState();
      return;
    }
    try {
      const records = Array.isArray(result.value?.issues) ? result.value.issues : [];
      if (records.length > 100) throw new ApiError("GitHubDeliveryService returned an oversized issue page", 0, "invalid_response", "");
      const localIds = new Set(session.githubIssueIds);
      let previousSort = session.githubIssueLastSort;
      const normalized = records.map((record) => {
        const value = normalizedGitHubIssue(record, scope, previousSort);
        if (localIds.has(value.entry.id)) throw new ApiError("GitHubDeliveryService returned a duplicate issue", 0, "invalid_response", "");
        localIds.add(value.entry.id);
        previousSort = value.sort;
        return value;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.githubIssuePageTokens.has(next))) throw new ApiError("GitHubDeliveryService returned a repeated issue cursor", 0, "invalid_response", "");
      session.githubIssues.push(...records);
      normalized.forEach((value) => session.githubIssueIds.add(value.entry.id));
      if (normalized.length) session.githubIssueLastSort = normalized.at(-1).sort;
      if (next) session.githubIssuePageTokens.add(next);
      session.githubIssuesNextPageToken = next;
      installSnapshotEntries("github-issue:", normalized.map((value) => value.entry), append);
      session.githubIssuesState = "loaded";
      ui.issuesMore.hidden = !next;
      ui.issuesMore.disabled = false;
      ui.issuesMore.title = next ? "Load the next repository- and subject-bound issue snapshot page" : "All issue snapshot pages loaded";
    } catch (error) {
      if (!append) {
        session.githubIssues = [];
        session.githubIssueIds = new Set();
        session.githubIssueLastSort = null;
        replaceActivityProjections("github-issue:", []);
      }
      session.githubIssuesNextPageToken = "";
      session.githubIssuesState = "invalid";
      ui.issuesMore.hidden = true;
      ui.issuesMore.title = apiErrorMessage(error, "Issue history was rejected because it was invalid.");
    }
    updateDeliveryHistoryState();
    renderStatStrip();
  }

  function renderGitHubPullRequestsResult(result, teamId, scope, requestedToken, append) {
    if (stringValue(teamId) !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
    if (result.status === "rejected") {
      session.githubPullRequestsState = "unavailable";
      ui.pullRequestsMore.hidden = !session.githubPullRequestsNextPageToken;
      ui.pullRequestsMore.title = apiErrorMessage(result.reason, "Pull-request history is unavailable.");
      updateDeliveryHistoryState();
      return;
    }
    try {
      const records = Array.isArray(result.value?.pullRequests) ? result.value.pullRequests : [];
      if (records.length > 100) throw new ApiError("GitHubDeliveryService returned an oversized pull-request page", 0, "invalid_response", "");
      const localIds = new Set(session.githubPullRequestIds);
      let previousSort = session.githubPullRequestLastSort;
      const normalized = records.map((record) => {
        const value = normalizedGitHubPullRequest(record, scope, previousSort);
        if (localIds.has(value.entry.id)) throw new ApiError("GitHubDeliveryService returned a duplicate pull request", 0, "invalid_response", "");
        localIds.add(value.entry.id);
        previousSort = value.sort;
        return value;
      });
      const next = opaquePageToken(result.value?.page?.nextPageToken);
      if (next && (next === requestedToken || session.githubPullRequestPageTokens.has(next))) throw new ApiError("GitHubDeliveryService returned a repeated pull-request cursor", 0, "invalid_response", "");
      session.githubPullRequests.push(...records);
      normalized.forEach((value) => session.githubPullRequestIds.add(value.entry.id));
      if (normalized.length) session.githubPullRequestLastSort = normalized.at(-1).sort;
      if (next) session.githubPullRequestPageTokens.add(next);
      session.githubPullRequestsNextPageToken = next;
      installSnapshotEntries("github-pull-request:", normalized.map((value) => value.entry), append);
      session.githubPullRequestsState = "loaded";
      ui.pullRequestsMore.hidden = !next;
      ui.pullRequestsMore.disabled = false;
      ui.pullRequestsMore.title = next ? "Load the next repository- and subject-bound pull-request snapshot page" : "All pull-request snapshot pages loaded";
    } catch (error) {
      if (!append) {
        session.githubPullRequests = [];
        session.githubPullRequestIds = new Set();
        session.githubPullRequestLastSort = null;
        replaceActivityProjections("github-pull-request:", []);
      }
      session.githubPullRequestsNextPageToken = "";
      session.githubPullRequestsState = "invalid";
      ui.pullRequestsMore.hidden = true;
      ui.pullRequestsMore.title = apiErrorMessage(error, "Pull-request history was rejected because it was invalid.");
    }
    updateDeliveryHistoryState();
    renderStatStrip();
  }

  async function reloadGitHubDelivery() {
    const teamId = session.selectedTeamId;
    const scope = configureDeliveryRepository(stringValue(ui.deliveryRepository.value));
    if (!teamId || !scope) return;
    resetDeliveryRecords("Loading webhook-backed GitHub issues and pull requests.", "Loading", "loading");
    const generation = session.deliveryLoadGeneration;
    // Zero is the documented sentinel for "the team's whole grant". The server
    // resolves the authorized set itself and filters the list on it, so a
    // wider request cannot outrun the grant.
    const githubRepositoryId = scope.id || "0";
    const [issuesResult, pullRequestsResult] = await Promise.allSettled([
      apiRequest("github_issues", { organizationId: session.organizationId, teamId, githubRepositoryId, page: { pageSize: 100 } }),
      apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId, githubRepositoryId, page: { pageSize: 100 } })
    ]);
    if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
    renderGitHubIssuesResult(issuesResult, teamId, scope, "", false);
    renderGitHubPullRequestsResult(pullRequestsResult, teamId, scope, "", false);
  }

  // A scope carries the repositories a record may belong to, keyed by the
  // GitHub id the record reports. `id` is the guard token: "" is the whole
  // grant, a numeric string is one repository. A record from outside the
  // scope is rejected, exactly as a record from the wrong repository was.
  function deliveryScope(repositories, narrowed) {
    const map = new Map();
    (narrowed ? [narrowed] : repositories).forEach((repository) => map.set(repository.id, repository));
    return {
      id: narrowed ? narrowed.id : "",
      label: narrowed ? narrowed.label : `${repositories.length} repositories`,
      repositories: map
    };
  }

  function currentDeliveryRepository() {
    try {
      const repositories = deliveryRepositories();
      if (!repositories.length) return null;
      const narrowed = repositories.find((repository) => repository.id === session.deliveryRepositoryId) || null;
      if (session.deliveryRepositoryId && !narrowed) return null;
      return deliveryScope(repositories, narrowed);
    } catch { return null; }
  }

  async function loadMoreGitHubIssues() {
    const teamId = session.selectedTeamId;
    const scope = currentDeliveryRepository();
    const pageToken = session.githubIssuesNextPageToken;
    const generation = session.deliveryLoadGeneration;
    if (!teamId || !scope || !pageToken || session.githubIssuesLoading) return;
    session.githubIssuesLoading = true;
    session.githubIssuesState = "loading";
    ui.issuesMore.disabled = true;
    updateDeliveryHistoryState();
    try {
      const response = await apiRequest("github_issues", { organizationId: session.organizationId, teamId, githubRepositoryId: scope.id || "0", page: { pageSize: 100, pageToken } });
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
      renderGitHubIssuesResult({ status: "fulfilled", value: response }, teamId, scope, pageToken, true);
    } catch (error) {
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
      renderGitHubIssuesResult({ status: "rejected", reason: error }, teamId, scope, pageToken, true);
    } finally {
      if (generation === session.deliveryLoadGeneration && scope.id === session.deliveryRepositoryId) {
        session.githubIssuesLoading = false;
        ui.issuesMore.disabled = false;
      }
    }
  }

  async function loadMoreGitHubPullRequests() {
    const teamId = session.selectedTeamId;
    const scope = currentDeliveryRepository();
    const pageToken = session.githubPullRequestsNextPageToken;
    const generation = session.deliveryLoadGeneration;
    if (!teamId || !scope || !pageToken || session.githubPullRequestsLoading) return;
    session.githubPullRequestsLoading = true;
    session.githubPullRequestsState = "loading";
    ui.pullRequestsMore.disabled = true;
    updateDeliveryHistoryState();
    try {
      const response = await apiRequest("github_pull_requests", { organizationId: session.organizationId, teamId, githubRepositoryId: scope.id || "0", page: { pageSize: 100, pageToken } });
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
      renderGitHubPullRequestsResult({ status: "fulfilled", value: response }, teamId, scope, pageToken, true);
    } catch (error) {
      if (generation !== session.deliveryLoadGeneration || teamId !== session.selectedTeamId || scope.id !== session.deliveryRepositoryId) return;
      renderGitHubPullRequestsResult({ status: "rejected", reason: error }, teamId, scope, pageToken, true);
    } finally {
      if (generation === session.deliveryLoadGeneration && scope.id === session.deliveryRepositoryId) {
        session.githubPullRequestsLoading = false;
        ui.pullRequestsMore.disabled = false;
      }
    }
  }

  function stopRuntimeActivityStream() {
    if (session.activityAbort) session.activityAbort.abort();
    session.activityAbort = null;
    if (session.activityReconnectTimer) window.clearTimeout(session.activityReconnectTimer);
    session.activityReconnectTimer = null;
    setLogLive(false);
  }

  // The travelling hairline on the log's masthead is a claim that something
  // is actively streaming, so it is set exactly where the stream's own state
  // is set — established on, torn down or failed off — never left painted by
  // a state the transport no longer vouches for.
  function setLogLive(on) {
    const head = ui.activityState ? ui.activityState.closest(".log-head") : null;
    if (head) head.classList.toggle("dn-livebar", Boolean(on));
  }

  // The single door runtime health comes through, whichever transport carried
  // it. Out-of-order frames are dropped on health's OWN sequence.
  //
  // An absent snapshot is left absent rather than being replaced with a
  // synthetic healthy one: "not observed yet" is a real answer, and inventing
  // a value for it is how the live dot got its lie in the first place.
  function applyTeamRuntimeHealth(team, health) {
    if (!team || !health) return false;
    const sequence = signedInt64Value(health.sequence);
    if (sequence !== null) {
      if (sequence < session.lastRuntimeHealthSequence) return false;
      session.lastRuntimeHealthSequence = sequence;
    }
    team.runtimeHealth = health;
    return true;
  }

  function stopProvisioningStream() {
    if (session.provisioningAbort) session.provisioningAbort.abort();
    session.provisioningAbort = null;
    if (session.provisioningReconnectTimer) window.clearTimeout(session.provisioningReconnectTimer);
    session.provisioningReconnectTimer = null;
    // The fallback poll is gated on this flag; a stopped stream must hand
    // coverage back or nothing follows the operation at all.
    session.provisioningStreamLive = false;
  }

  function stopConversationStream() {
    if (session.conversationAbort) session.conversationAbort.abort();
    session.conversationAbort = null;
    if (session.conversationReconnectTimer) window.clearTimeout(session.conversationReconnectTimer);
    session.conversationReconnectTimer = null;
    session.conversationStreamLive = false;
  }

  function stopActivityStream() {
    stopRuntimeActivityStream();
    stopConversationStream();
    stopProvisioningStream();
    stopCreditMovementStream();
  }

  // Streams outlive bearer tokens. The access token is minted at sign-in and
  // held only in memory; a stream that stays open past the token's life dies
  // with "unauthenticated" even though the httpOnly session cookie beside it
  // is still valid — which is how the LOG panel regressed from "Listening" to
  // "Unavailable" in one afternoon with nobody touching anything. Exchange
  // the cookie for a fresh token exactly the way restoreSession does on a
  // page load, without disturbing the signed-in UI state.
  async function refreshStreamAccessToken() {
    if (!platformApi || !session.accessToken) return false;
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const result = await platformApi.signIn("refresh_session", {}, { requestId, signal: controller.signal });
      const sessionToken = stringValue(result?.sessionToken);
      if (!sessionToken) return false;
      session.accessToken = sessionToken;
      return true;
    } catch {
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  // How many consecutive failed connection attempts the stream retries on its
  // own before handing the problem to the customer as a terminal state with a
  // Retry button. A stream that genuinely established resets the budget when
  // it later drops, so a page left open all day survives any number of
  // deploys and token expiries; only a stream that cannot come up at all
  // burns through the limit.
  const activityReconnectLimit = 4;

  function scheduleActivityReconnect(teamId, generation, attempt, refreshToken) {
    const delay = Math.min(30000, 1500 * 2 ** attempt);
    // "Reconnecting" is a different promise than "Unavailable": the first
    // says nobody needs to do anything, the second asks for a click.
    setSourceState(ui.activityState, "Reconnecting", "loading");
    if (!allActivityEntries().length) {
      setEmptyState(ui.activityEmpty, "Reconnecting", "The live feed dropped. Reconnecting automatically — nothing your team did is lost.");
    }
    ui.activityRetry.hidden = true;
    session.activityReconnectTimer = window.setTimeout(async () => {
      session.activityReconnectTimer = null;
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || !session.accessToken) return;
      // An expired token would fail every retry identically; heal it first.
      if (refreshToken) await refreshStreamAccessToken();
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      startActivityStream(teamId, generation, attempt);
    }, delay);
  }

  async function startActivityStream(teamId, generation = session.workspaceGeneration, attempt = 0) {
    stopRuntimeActivityStream();
    if (!teamId || typeof platformApi?.streamTeamActivity !== "function") {
      resetActivityView("The generated ActivityService client is not available in this deployment.", "Unavailable", "error");
      return;
    }
    const controller = new AbortController();
    session.activityAbort = controller;
    setSourceState(ui.activityState, "Connecting", "loading");
    setEmptyState(ui.activityEmpty, "Connecting to activity", "Waiting for the server to replay customer-safe events and open the live stream.");
    ui.activityRetry.hidden = true;
    // An open stream with nothing to say looked identical to one that never
    // opened, because the only place that reported success was inside the loop
    // body and the loop body runs on an event. A quiet team sat on "Connecting"
    // indefinitely. No error within the settle window means we are connected;
    // a real failure below overwrites this.
    let streamEstablished = false;
    const markStreamEstablished = () => {
      if (streamEstablished || controller.signal.aborted) return;
      streamEstablished = true;
      setSourceState(ui.activityState, "Listening", "success");
      setLogLive(true);
      if (!allActivityEntries().length) {
        setEmptyState(ui.activityEmpty, "Listening", "Connected to your team. The first thing they do appears here.");
      }
    };
    const establishTimer = window.setTimeout(markStreamEstablished, 1500);
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamTeamActivity({ teamId, afterSequence: session.lastActivitySequence }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const event = response?.event;
        if (!event) continue;
        if (stringValue(event.teamId) !== stringValue(teamId)) throw new ApiError("The activity service returned an event outside the selected team scope", 0, "invalid_response", requestId);
        window.clearTimeout(establishTimer);
        markStreamEstablished();
        appendActivityEvent(event);
        session.runtimeStreamLive = true;
        renderWorkspaceHeadline();
        setSourceState(ui.activityState, "Runtime live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) {
        session.runtimeStreamLive = false;
        renderWorkspaceHeadline();
        // A cleanly closed stream is usually a rolling deploy retiring the
        // pod behind the load balancer, not a problem the customer can act
        // on. The afterSequence cursor makes reconnecting lossless, so do it
        // ourselves before asking anyone to click anything.
        const nextAttempt = streamEstablished ? 0 : attempt + 1;
        if (nextAttempt <= activityReconnectLimit) {
          scheduleActivityReconnect(teamId, generation, nextAttempt, false);
          return;
        }
        setLogLive(false);
        setSourceState(ui.activityState, "Stream ended", "error");
        ui.activityRetry.hidden = false;
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      const normalized = error?.name === "PlatformClientError"
        ? new ApiError(stringValue(error.message), Number(error.status || 0), stringValue(error.code), stringValue(error.requestId) || requestId)
        : error;
      session.runtimeStreamLive = false;
      renderWorkspaceHeadline();
      // A mid-stream token expiry arrives here as an in-stream
      // "unauthenticated" error frame (verified against the live API), not as
      // an HTTP failure. It heals through the session cookie; treating it as
      // terminal was how one expiry became a permanent dead panel that no
      // manual retry with the same stale token could fix.
      const unauthenticated = normalized instanceof ApiError && (normalized.status === 401 || normalized.code === "unauthenticated");
      const nextAttempt = streamEstablished ? 0 : attempt + 1;
      if ((unauthenticated || isRetryableApiError(normalized)) && nextAttempt <= activityReconnectLimit) {
        scheduleActivityReconnect(teamId, generation, nextAttempt, unauthenticated);
        return;
      }
      const message = apiErrorMessage(normalized, "Live activity is unavailable.");
      setLogLive(false);
      setSourceState(ui.activityState, "Unavailable", "error");
      if (!allActivityEntries().length) {
        ui.activityEmpty.hidden = false;
        setEmptyState(ui.activityEmpty, "Activity unavailable", message);
      }
      ui.activityRetry.hidden = false;
    } finally {
      window.clearTimeout(establishTimer);
      if (session.activityAbort === controller) session.activityAbort = null;
    }
  }

  // ======================================================================
  // THE LIVE CREDIT LEDGER
  //
  // StreamCreditMovements publishes the credit ledger as it moves: every
  // hold, settlement, release and organization grant against the pool this
  // team spends from, in sequence order, each frame carrying the balance
  // after it. Before this the console could read a total and watch it
  // change, but it could never say what changed it.
  //
  // The transport is startActivityStream's, deliberately and exactly: same
  // backoff curve, same retry budget, same in-stream `unauthenticated`
  // healing, same afterSequence resume. The contract asks for that in as
  // many words, because a second cursor idiom on the same console is a
  // second way to lose a row.
  // ======================================================================

  function prefersReducedMotion() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // In-flight odometer rolls, so a second frame arriving mid-roll retargets
  // the same element instead of racing another rAF loop against it.
  const odometerFrames = new Map();

  // Roll a credit figure from what it read to what it now reads.
  //
  // .dn-odometer is vendored, but the design system's driver (dnMotion.count)
  // is not, so the roll lives here and borrows only the system's numbers: the
  // 480ms of --dur-slower, and a decelerate curve. The class itself supplies
  // the tabular figures that stop a rolling value reflowing its neighbours.
  //
  // Two things it must not do:
  //
  //   Move when nothing moved. A number that animates without a new fact
  //   behind it is a live indicator that has outlived its truth — it teaches
  //   the reader that motion on this screen means nothing. An unchanged value
  //   is written, not rolled; a first reading is written, not rolled up from
  //   an imaginary zero.
  //
  //   Shorten under reduced motion. It is switched OFF: the final figure is
  //   written once, synchronously, so the number is right on the first frame
  //   instead of right at the end of a collapsed animation.
  function rollOdometer(element, fromMicros, toMicros) {
    if (!element) return;
    if (typeof toMicros !== "bigint") return;
    const settled = formatCreditMicros(toMicros);
    const previous = odometerFrames.get(element);
    if (previous) {
      window.cancelAnimationFrame(previous);
      odometerFrames.delete(element);
    }
    // No prior reading, no change, or the reader asked for less motion.
    if (typeof fromMicros !== "bigint" || fromMicros === toMicros || prefersReducedMotion()) {
      element.textContent = settled;
      return;
    }
    const start = performance.now();
    const from = Number(fromMicros);
    const to = Number(toMicros);
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 480);
      if (progress >= 1) {
        odometerFrames.delete(element);
        // The exact figure lands at the end — never a rounded interpolation.
        element.textContent = settled;
        return;
      }
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCreditMicros(BigInt(Math.round(from + (to - from) * eased)));
      odometerFrames.set(element, window.requestAnimationFrame(step));
    };
    odometerFrames.set(element, window.requestAnimationFrame(step));
  }

  // The four kinds are the whole lifecycle of a credit. Anything else is
  // UNSPECIFIED, and the contract is explicit that a client renders it from
  // its own fields rather than inventing a lifecycle for it — so the fallback
  // says only that a movement was recorded.
  const CREDIT_MOVEMENT_KINDS = Object.freeze({
    1: Object.freeze({ word: "Reserved", glyph: "circle-dashed" }),
    2: Object.freeze({ word: "Settled", glyph: "check" }),
    3: Object.freeze({ word: "Released", glyph: "refresh" }),
    4: Object.freeze({ word: "Granted", glyph: "plus" })
  });
  const CREDIT_MOVEMENT_UNKNOWN = Object.freeze({ word: "Recorded", glyph: "circle-dot" });

  function creditMovementKind(value) {
    const key = typeof value === "bigint" ? Number(value) : Number(value || 0);
    return Object.hasOwn(CREDIT_MOVEMENT_KINDS, key) ? CREDIT_MOVEMENT_KINDS[key] : CREDIT_MOVEMENT_UNKNOWN;
  }

  // One row per movement, built element by element — this console never
  // assembles markup from strings.
  function creditMovementRow(movement) {
    const kind = creditMovementKind(movement?.kind);
    const row = document.createElement("li");
    row.className = "credit-movement-row";

    const kindCell = document.createElement("span");
    kindCell.className = "credit-movement-kind";
    kindCell.append(spriteIcon(kind.glyph, 12), document.createTextNode(kind.word));

    const what = document.createElement("span");
    what.className = "credit-movement-what";
    const operation = stringValue(movement?.operationType);
    const role = stringValue(movement?.attribution?.agentRole);
    // operation_type is empty for a movement that is not one, such as a grant.
    // That absence is ordinary, so it is described rather than left blank.
    what.textContent = operation
      ? (role ? `${operation} · ${role}` : operation)
      : "organization pool, not metered work";

    const delta = document.createElement("span");
    delta.className = "credit-movement-delta";
    const deltaMicros = signedInt64Value(movement?.deltaMicros);
    if (deltaMicros === null) {
      delta.textContent = "not reported";
    } else {
      // The sign is spelled out in the glyph and the leading character, so the
      // direction survives with the colour removed.
      delta.dataset.direction = deltaMicros < 0n ? "debit" : "credit";
      // Exact: this row is the ledger, and reconciling against it is its job.
      delta.textContent = `${deltaMicros < 0n ? "−" : "+"}${formatCreditMicrosExact(deltaMicros < 0n ? -deltaMicros : deltaMicros)}`;
    }

    const meta = document.createElement("span");
    meta.className = "credit-movement-meta";
    const parts = [];
    // An empty unit means the movement metered nothing, and quantity is then
    // not a count of zero but no count at all — so neither is invented.
    const unit = stringValue(movement?.unit);
    const quantity = signedInt64Value(movement?.quantity);
    if (unit && quantity !== null) parts.push(`${new Intl.NumberFormat().format(quantity)} ${unit}`);
    // direct_cost IS NOT RENDERED, deliberately, and this comment is the record
    // of that decision rather than an oversight waiting to be corrected.
    //
    // It is the provider cost of the movement — what the work cost DEEP NAVY.
    // It is NOT what the customer paid: the ledger converts cost to credits at
    // the published rate, so it understates their impact by the margin. It used
    // to be printed here as "metered provider cost USD 0.1600 (not customer
    // impact)", which is an honest label on a number that still had no use: a
    // customer can neither act on our cost of goods nor reconcile it against
    // anything they are charged, and its presence beside delta_micros put two
    // currencies in one row.
    //
    // delta_micros, already rendered above, is this movement in the customer's
    // own money. That is the whole of what this row owes them.
    const occurred = timestampDate(movement?.occurredAt);
    if (occurred) parts.push(relativeTime(occurred));
    meta.textContent = parts.join(" · ");

    row.append(kindCell, what, delta);
    if (parts.length) row.append(meta);
    return row;
  }

  // The mockup's live line: the dot, the word, then the count it qualifies —
  // "streaming · 12 movements", or just the count when nothing is streaming.
  // The word is always written out beside the dot, so the claim survives
  // filter: grayscale(1) with the lumen gone entirely; and the count is there
  // in both states, so removing the indicator never removes information.
  function renderCreditMovementsLive() {
    const on = session.creditMovementsStreamLive === true;
    // The travelling hairline is a claim about the transport RIGHT NOW, so it
    // is added and removed exactly where that claim changes.
    if (ui.creditMovementsPanel) ui.creditMovementsPanel.classList.toggle("dn-livebar", on);
    if (!ui.creditMovementsLive) return;
    ui.creditMovementsLive.replaceChildren();
    if (on) {
      const dot = document.createElement("span");
      dot.className = "dn-dot dn-dot--live dn-dot--pulse";
      dot.setAttribute("aria-hidden", "true");
      ui.creditMovementsLive.append(dot, document.createTextNode("streaming · "));
    }
    const seen = session.creditMovements.length;
    ui.creditMovementsLive.append(document.createTextNode(seen === 1 ? "1 movement" : `${new Intl.NumberFormat().format(seen)} movements`));
  }

  function setCreditMovementsLive(on) {
    session.creditMovementsStreamLive = Boolean(on);
    renderCreditMovementsLive();
  }

  // Empty is four different facts here, and each one is a different DataState:
  //   loading        the stream is opening
  //   pending        it is open and the ledger has not settled anything yet —
  //                  which the contract says explicitly is NOT "the team has
  //                  stopped spending"
  //   unavailable    it could not be opened, or this deployment has no client
  // A zero is never used for any of them: "0 movements" would be a claim that
  // we counted, and until a frame arrives we have not.
  function resetCreditMovementsView(why, kind = "loading", label = "Waiting", tone = "") {
    session.creditMovements = [];
    session.lastCreditMovementSequence = 0n;
    session.creditOrgBalanceShownMicros = null;
    session.creditMovementsStreamLive = false;
    if (ui.creditMovementsList) {
      ui.creditMovementsList.replaceChildren();
      ui.creditMovementsList.hidden = true;
    }
    if (ui.creditMovementsOrg) ui.creditMovementsOrg.textContent = "—";
    if (ui.creditMovementsPanel) {
      ui.creditMovementsPanel.hidden = !selectedTeam();
      ui.creditMovementsPanel.classList.remove("dn-livebar");
    }
    if (ui.creditMovementsLive) ui.creditMovementsLive.replaceChildren();
    setDataState(ui.creditMovementsEmpty, kind, why);
    setSourceState(ui.creditMovementsState, label, tone);
  }

  // A frame arrived. This is the ONE place a credit figure is allowed to move,
  // because it is the one place something actually changed.
  function appendCreditMovement(movement) {
    const sequence = signedInt64Value(movement?.sequence);
    if (sequence === null || sequence <= session.lastCreditMovementSequence) return false;
    session.lastCreditMovementSequence = sequence;
    session.creditMovements.push(movement);
    if (session.creditMovements.length > 40) session.creditMovements.shift();

    if (ui.creditMovementsList) {
      const row = creditMovementRow(movement);
      // --ease-arrive, the 1.28 overshoot, is reserved for something appearing
      // that the reader did not trigger. A stream frame is exactly that case,
      // and .dn-in-pop is the system's own class for it rather than a second
      // opinion about what arriving looks like.
      row.classList.add("dn-in-pop");
      ui.creditMovementsList.prepend(row);
      while (ui.creditMovementsList.children.length > 40) ui.creditMovementsList.lastElementChild.remove();
      ui.creditMovementsList.hidden = false;
      if (ui.creditMovementsEmpty) ui.creditMovementsEmpty.hidden = true;
    }
    // The live line states "streaming · N movements", so N has to follow the
    // list it is counting.
    renderCreditMovementsLive();

    // organization_balance_after_micros is a window over the same pool a balance
    // read returns, so the last frame and the panel above are one number seen
    // twice. It is written THROUGH the panel rather than beside it — that way
    // they cannot drift apart, because there is only one of them.
    //
    // It has to be the ORGANIZATION figure and not team_balance_after_micros:
    // the panel now shows the pool, so a frame carrying the team-filtered sum
    // would drag it to a different — routinely negative — quantity the instant
    // the first movement landed, undoing the read's correctness a second after
    // the workspace loaded.
    const organizationAfter = signedInt64Value(movement?.organizationBalanceAfterMicros);
    if (organizationAfter !== null) {
      const previous = session.creditBalanceShownMicros ?? session.creditBalance;
      session.creditBalance = organizationAfter;
      session.creditBalanceShownMicros = organizationAfter;
      rollOdometer(ui.creditBalanceValue, typeof previous === "bigint" ? previous : null, organizationAfter);
      renderRailSpend();
      renderStatStrip();
      rollOdometer(ui.creditMovementsOrg, session.creditOrgBalanceShownMicros, organizationAfter);
      session.creditOrgBalanceShownMicros = organizationAfter;
    }
    return true;
  }

  function stopCreditMovementStream() {
    if (session.creditMovementsAbort) session.creditMovementsAbort.abort();
    session.creditMovementsAbort = null;
    if (session.creditMovementsReconnectTimer) window.clearTimeout(session.creditMovementsReconnectTimer);
    session.creditMovementsReconnectTimer = null;
    session.creditMovementsStreamLive = false;
    // The hairline is a claim about the transport right now. A stopped stream
    // must never leave it painted.
    setCreditMovementsLive(false);
  }

  // Reconnection twin of scheduleActivityReconnect: same backoff curve, same
  // budget, same token remedy.
  function scheduleCreditMovementReconnect(teamId, generation, attempt, refreshToken) {
    const delay = Math.min(30000, 1500 * 2 ** attempt);
    setSourceState(ui.creditMovementsState, "Reconnecting", "loading");
    setCreditMovementsLive(false);
    session.creditMovementsReconnectTimer = window.setTimeout(async () => {
      session.creditMovementsReconnectTimer = null;
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || !session.accessToken) return;
      // An expired token would fail every retry identically; heal it first.
      if (refreshToken) await refreshStreamAccessToken();
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      startCreditMovementStream(teamId, generation, attempt);
    }, delay);
  }

  async function startCreditMovementStream(teamId, generation = session.workspaceGeneration, attempt = 0) {
    stopCreditMovementStream();
    if (!teamId || typeof platformApi?.streamCreditMovements !== "function") {
      resetCreditMovementsView("This deployment does not carry the generated EconomicsService streaming client, so no credit movement was read. Nothing was inferred from the balance instead.", "unavailable", "Unavailable", "error");
      return;
    }
    const controller = new AbortController();
    session.creditMovementsAbort = controller;
    setSourceState(ui.creditMovementsState, "Connecting", "loading");
    if (ui.creditMovementsPanel) ui.creditMovementsPanel.hidden = false;
    // Same settle window as the activity stream: an open stream with nothing
    // to say is indistinguishable from one that never opened, and the contract
    // is explicit that "nothing new" means "nothing has settled yet" rather
    // than "the team has stopped spending".
    let streamEstablished = false;
    const markStreamEstablished = () => {
      if (streamEstablished || controller.signal.aborted) return;
      streamEstablished = true;
      setSourceState(ui.creditMovementsState, "Listening", "success");
      setCreditMovementsLive(true);
      // Open with nothing to say is a PENDING reading, not an absent one. The
      // contract is explicit that the ledger withholds the newest movements
      // until their ordering is settled, so "nothing new" means "nothing has
      // settled yet" and must never be rendered as "this team is not spending".
      if (!session.creditMovements.length) {
        setDataState(ui.creditMovementsEmpty, "pending", "The stream is open. The ledger publishes a movement about a second after it commits, so an empty list means nothing has settled yet — not that this team has stopped spending.");
      }
    };
    const establishTimer = window.setTimeout(markStreamEstablished, 1500);
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamCreditMovements({ teamId, afterSequence: session.lastCreditMovementSequence }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const movement = response?.movement;
        if (!movement) continue;
        // An organization-scoped grant carries no team_id and still belongs on
        // this stream, because it moves the pool the team spends from. Only a
        // movement naming a DIFFERENT team is out of scope.
        const movementTeam = stringValue(movement.teamId);
        if (movementTeam && movementTeam !== stringValue(teamId)) {
          throw new ApiError("The economics service returned a movement outside the selected team scope", 0, "invalid_response", requestId);
        }
        window.clearTimeout(establishTimer);
        markStreamEstablished();
        appendCreditMovement(movement);
        setSourceState(ui.creditMovementsState, "Ledger live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) {
        session.creditMovementsStreamLive = false;
        setCreditMovementsLive(false);
        // A cleanly closed stream is usually a rolling deploy retiring the pod
        // behind the load balancer. The cursor makes reconnecting lossless, so
        // do it before asking anyone to click anything.
        const nextAttempt = streamEstablished ? 0 : attempt + 1;
        if (nextAttempt <= activityReconnectLimit) {
          scheduleCreditMovementReconnect(teamId, generation, nextAttempt, false);
          return;
        }
        setSourceState(ui.creditMovementsState, "Stream ended", "error");
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      const normalized = error?.name === "PlatformClientError"
        ? new ApiError(stringValue(error.message), Number(error.status || 0), stringValue(error.code), stringValue(error.requestId) || requestId)
        : error;
      session.creditMovementsStreamLive = false;
      setCreditMovementsLive(false);
      // A mid-stream token expiry arrives as an in-stream "unauthenticated"
      // error frame, not an HTTP failure; it heals through the session cookie
      // exactly as the activity stream's does.
      const unauthenticated = normalized instanceof ApiError && (normalized.status === 401 || normalized.code === "unauthenticated");
      const nextAttempt = streamEstablished ? 0 : attempt + 1;
      if ((unauthenticated || isRetryableApiError(normalized)) && nextAttempt <= activityReconnectLimit) {
        scheduleCreditMovementReconnect(teamId, generation, nextAttempt, unauthenticated);
        return;
      }
      // A replay window the server will not serve is a designed refusal, not
      // an outage: the contract answers RESOURCE_EXHAUSTED rather than handing
      // back a truncated history. Say so, and resume from live.
      if (normalized instanceof ApiError && normalized.code === "resource_exhausted") {
        setSourceState(ui.creditMovementsState, "History too long", "error");
        if (!session.creditMovements.length) {
          setDataState(ui.creditMovementsEmpty, "unavailable", "The ledger keeps a bounded replay window and this cursor is behind it. Rather than hand back a truncated history the platform refused the replay, so older movements are not shown and none was guessed.");
        }
        return;
      }
      setSourceState(ui.creditMovementsState, "Unavailable", "error");
      if (!session.creditMovements.length) {
        setDataState(ui.creditMovementsEmpty, "unavailable", apiErrorMessage(normalized, "Credit movements could not be streamed, so none is shown. The balance above is a separate read and is unaffected."));
      }
    } finally {
      window.clearTimeout(establishTimer);
      if (session.creditMovementsAbort === controller) session.creditMovementsAbort = null;
    }
  }

  function scheduleConversationReconnect(teamId, generation, attempt, refreshToken) {
    const delay = Math.min(30000, 1500 * 2 ** attempt);
    setSourceState(ui.conversationState, "Reconnecting", "loading");
    if (!session.conversationMessages.length) {
      setEmptyState(ui.conversationEmpty, "Reconnecting", "The conversation dropped. Reconnecting automatically — nothing said is lost.");
    }
    ui.conversationRetry.hidden = true;
    session.conversationReconnectTimer = window.setTimeout(async () => {
      session.conversationReconnectTimer = null;
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || !session.accessToken) return;
      // An expired token would fail every retry identically; heal it first.
      if (refreshToken) await refreshStreamAccessToken();
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      startConversationStream(teamId, generation, attempt);
    }, delay);
  }

  // The resume cursor cannot simply be the newest sequence: delivery-state
  // transitions re-send a message's original sequence, so a cursor parked at
  // the newest row would skip the very transitions the chips exist to show.
  // Resume just below the oldest customer row still in flight; with nothing
  // in flight the newest sequence is safe.
  function conversationResumeCursor() {
    let cursor = session.lastConversationSequence;
    for (const entry of session.conversationMessages) {
      if (entry.sequence === null) continue;
      if (entry.author === "customer" && !["delivered", "failed"].includes(entry.deliveryState) && entry.sequence - 1n < cursor) {
        cursor = entry.sequence - 1n;
      }
    }
    return cursor < 0n ? 0n : cursor;
  }

  async function startConversationStream(teamId, generation = session.workspaceGeneration, attempt = 0) {
    stopConversationStream();
    if (!teamId || typeof platformApi?.streamTeamConversation !== "function") {
      resetConversationView("The generated conversation client is not available in this deployment.", "Unavailable", "error");
      return;
    }
    const controller = new AbortController();
    session.conversationAbort = controller;
    setSourceState(ui.conversationState, "Connecting", "loading");
    if (!session.conversationMessages.length) {
      setEmptyState(ui.conversationEmpty, "Your Product Manager is getting set up", "Connecting to the conversation. Their introduction appears here the moment they are ready.");
    }
    ui.conversationRetry.hidden = true;
    // Same settle-window promise the activity stream makes: no error within
    // the window means we are connected, and a quiet conversation does not
    // sit on "Connecting" indefinitely.
    let streamEstablished = false;
    const markStreamEstablished = () => {
      if (streamEstablished || controller.signal.aborted) return;
      streamEstablished = true;
      setSourceState(ui.conversationState, "Listening", "success");
      if (!session.conversationMessages.length) {
        setEmptyState(ui.conversationEmpty, "Your Product Manager is getting set up", "Connected. They open the conversation from their side the moment they are ready.");
      }
    };
    const establishTimer = window.setTimeout(markStreamEstablished, 1500);
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamTeamConversation({ teamId, afterSequence: conversationResumeCursor() }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const message = response?.message;
        if (!message) continue;
        if (stringValue(message.teamId) !== stringValue(teamId)) throw new ApiError("The conversation service returned a message outside the selected team scope", 0, "invalid_response", requestId);
        window.clearTimeout(establishTimer);
        markStreamEstablished();
        acceptConversationMessage(message);
        session.conversationStreamLive = true;
        renderConversation();
        setSourceState(ui.conversationState, "Live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) {
        session.conversationStreamLive = false;
        // A cleanly closed stream is usually a rolling deploy retiring the
        // pod, not something the customer can act on; the resume cursor makes
        // reconnecting lossless, so do it before asking anyone to click.
        const nextAttempt = streamEstablished ? 0 : attempt + 1;
        if (nextAttempt <= activityReconnectLimit) {
          scheduleConversationReconnect(teamId, generation, nextAttempt, false);
          return;
        }
        setSourceState(ui.conversationState, "Stream ended", "error");
        ui.conversationRetry.hidden = false;
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      const normalized = error?.name === "PlatformClientError"
        ? new ApiError(stringValue(error.message), Number(error.status || 0), stringValue(error.code), stringValue(error.requestId) || requestId)
        : error;
      session.conversationStreamLive = false;
      // A mid-stream token expiry arrives as an in-stream "unauthenticated"
      // frame, exactly like the activity stream's; it heals through the
      // session cookie rather than becoming a permanently dead console.
      const unauthenticated = normalized instanceof ApiError && (normalized.status === 401 || normalized.code === "unauthenticated");
      const nextAttempt = streamEstablished ? 0 : attempt + 1;
      if ((unauthenticated || isRetryableApiError(normalized)) && nextAttempt <= activityReconnectLimit) {
        scheduleConversationReconnect(teamId, generation, nextAttempt, unauthenticated);
        return;
      }
      const requestSuffix = normalized instanceof ApiError && normalized.requestId ? ` Request ID: ${normalized.requestId}.` : "";
      const message = `The conversation lost its connection and could not recover on its own. Reconnect to continue.${requestSuffix}`;
      setSourceState(ui.conversationState, "Unavailable", "error");
      if (!session.conversationMessages.length) {
        ui.conversationEmpty.hidden = false;
        setEmptyState(ui.conversationEmpty, "Conversation unavailable", message);
      }
      ui.conversationRetry.hidden = false;
    } finally {
      window.clearTimeout(establishTimer);
      if (session.conversationAbort === controller) session.conversationAbort = null;
    }
  }

  const activityCategories = new Set(["all", "conversations", "sessions", "tools", "workspace", "delivery", "approvals", "provisioning", "cost"]);
  const runtimeActivityTypes = new Set(["a2a.message", "tool.call", "session.status", "artifact.summary", "agent.note"]);
  const workspaceArtifactTypes = new Set(["workspace_change", "commit", "plan", "design", "decision_record", "test_report", "deployment"]);
  const deliveryArtifactTypes = new Set(["issue", "pull_request"]);
  const activityDetailKeys = Object.freeze({
    "a2a.message": new Set(["from_agent_id", "to_agent_id", "message_kind"]),
    "tool.call": new Set(["tool_name", "result", "duration_ms"]),
    "session.status": new Set(["previous_status", "current_status", "reason_code"]),
    "artifact.summary": new Set(["artifact_type", "artifact_id", "uri", "change_kind"]),
    // The note's own text IS the event's summary; the duplicate details.note
    // is ignored below rather than validated, because prose has no place in
    // the strict key/value validator.
    "agent.note": new Set(["about"])
  });
  const activityDetailIgnoredKeys = Object.freeze({ "agent.note": new Set(["note"]) });

  function activityDetails(event, type) {
    const details = event?.details;
    if (!details || typeof details !== "object" || Array.isArray(details)) return {};
    const allowed = activityDetailKeys[type];
    if (!allowed) return {};
    const normalized = {};
    const ignored = activityDetailIgnoredKeys[type];
    for (const [name, value] of Object.entries(details)) {
      if (ignored && ignored.has(name)) continue;
      if (!allowed.has(name)) throw new ApiError("ActivityService returned an unexpected detail field", 0, "invalid_response", "");
      if (typeof value === "string" && value.length <= 512 && !/[\u0000-\u001f\u007f]/.test(value)) normalized[name] = value;
      else if (typeof value === "number" && Number.isFinite(value) && value >= 0) normalized[name] = value;
      else throw new ApiError("ActivityService returned an invalid detail value", 0, "invalid_response", "");
    }
    return normalized;
  }

  function canonicalArtifactUrl(value) {
    const raw = stringValue(value);
    if (!raw) return "";
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash) return "";
      return url.toString();
    } catch {
      return "";
    }
  }

  function normalizedRuntimeActivity(event) {
    const id = stringValue(event?.id);
    const type = stringValue(event?.type);
    const safeSummary = stringValue(event?.safeSummary);
    const status = stringValue(event?.status);
    const sequence = typeof event?.sequence === "bigint" ? event.sequence : BigInt(event?.sequence || 0);
    // An event TYPE this build does not know is the server being newer, not
    // the server being wrong: skip the event and keep the stream alive. Every
    // other malformation on a KNOWN type still fails closed - the day an
    // unknown type killed the stream permanently, the failure was ours.
    if (!runtimeActivityTypes.has(type)) return null;
    if (!id || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id) || !safeSummary || safeSummary.length > 1000 || sequence <= 0n) {
      throw new ApiError("ActivityService returned an invalid normalized event", 0, "invalid_response", "");
    }
    const details = activityDetails(event, type);
    let category = "workspace";
    let title = "Artifact update";
    let detail = "";
    let artifactUrl = "";
    if (type === "agent.note") {
      // The agent's own sentence. It arrives as the event's summary, already
      // bounded and scrubbed at the ingest boundary, so there is nothing to
      // construct here - which is the point of the event type.
      category = "conversations";
      title = "";
      detail = stringValue(details.about);
    } else if (type === "a2a.message") {
      if (!details.from_agent_id || !details.to_agent_id || !details.message_kind) throw new ApiError("ActivityService returned incomplete A2A metadata", 0, "invalid_response", "");
      category = "conversations";
      title = `A2A ${String(details.message_kind).replaceAll("_", " ")}`;
      detail = `${details.from_agent_id} → ${details.to_agent_id}`;
    } else if (type === "tool.call") {
      if (!details.tool_name) throw new ApiError("ActivityService returned incomplete tool metadata", 0, "invalid_response", "");
      category = "tools";
      title = `Tool · ${String(details.tool_name).replaceAll("_", " ")}`;
      detail = [details.result, Number.isFinite(details.duration_ms) ? `${details.duration_ms} ms` : ""].filter(Boolean).join(" · ");
    } else if (type === "session.status") {
      if (!details.current_status) throw new ApiError("ActivityService returned incomplete session metadata", 0, "invalid_response", "");
      category = "sessions";
      title = `Session · ${String(details.current_status).replaceAll("_", " ")}`;
      detail = [details.previous_status ? `${details.previous_status} → ${details.current_status}` : details.current_status, details.reason_code].filter(Boolean).join(" · ");
    } else {
      if (!details.artifact_type || !details.artifact_id) throw new ApiError("ActivityService returned incomplete artifact metadata", 0, "invalid_response", "");
      const artifactType = String(details.artifact_type);
      if (deliveryArtifactTypes.has(artifactType)) category = "delivery";
      else if (!workspaceArtifactTypes.has(artifactType)) throw new ApiError("ActivityService returned an unsupported artifact type", 0, "invalid_response", "");
      title = `${artifactType.replaceAll("_", " ")} · ${String(details.change_kind || status || "updated").replaceAll("_", " ")}`;
      detail = String(details.artifact_id);
      artifactUrl = canonicalArtifactUrl(details.uri);
      if (details.uri && !artifactUrl) throw new ApiError("ActivityService returned an invalid artifact URL", 0, "invalid_response", "");
    }
    return {
      id: `runtime:${id}`,
      category,
      source: "runtime",
      title,
      safeSummary,
      detail,
      artifactUrl,
      status,
      sequence,
      sequenceLabel: `Activity event ${sequence.toString()}`,
      occurredAt: event.occurredAt,
      agentRole: event.agentRole,
      // The stream names the actor by id as well as by role; the agent view
      // slices this same buffer by that id rather than opening a second stream.
      agentId: stringValue(event.agentId),
      sessionId: stringValue(event.sessionId),
      objectiveId: stringValue(event.objectiveId),
      initiativeId: stringValue(event.initiativeId),
      repositoryId: stringValue(event.repositoryId),
      githubIssueId: stringValue(event.githubIssueId),
      pullRequestId: stringValue(event.pullRequestId)
    };
  }

  function appendActivityEvent(event) {
    const entry = normalizedRuntimeActivity(event);
    if (entry === null) {
      // Skipped-but-seen: advance the cursor so a reconnect does not replay
      // an event this build will only skip again.
      const sequence = typeof event?.sequence === "bigint" ? event.sequence : BigInt(event?.sequence || 0);
      if (sequence > session.lastActivitySequence) session.lastActivitySequence = sequence;
      return;
    }
    if (session.activityEventIds.has(entry.id)) return;
    if (entry.sequence <= session.lastActivitySequence) throw new ApiError("ActivityService returned a non-monotonic sequence", 0, "invalid_response", "");
    session.lastActivitySequence = entry.sequence;
    session.activityEventIds.add(entry.id);
    session.activityEvents.push(entry);
    // The append path is the only place a row earns arrival motion, and the
    // flash claims "this just happened" — so a replayed history (the stream
    // replays recorded events through this same loop on every connect) must
    // paint still. Recency is the honest discriminator: only an event that
    // occurred moments ago rises and flashes once.
    const occurredMs = timestampDate(entry.occurredAt)?.getTime();
    if (Number.isFinite(occurredMs) && Date.now() - occurredMs <= 90 * 1000) {
      session.freshActivityIds.add(entry.id);
    }
    if (session.activityEvents.length > 80) {
      const removed = session.activityEvents.shift();
      if (removed) {
        session.activityEventIds.delete(removed.id);
        session.freshActivityIds.delete(removed.id);
      }
    }
    renderActivityLedger();
  }

  function replaceActivityProjections(prefix, entries) {
    for (const key of session.activityProjections.keys()) {
      if (key.startsWith(prefix)) session.activityProjections.delete(key);
    }
    entries.forEach((entry) => session.activityProjections.set(entry.id, entry));
    renderActivityLedger();
  }

  function upsertActivityProjection(entry) {
    if (!entry?.id || !activityCategories.has(entry.category) || entry.category === "all") return;
    session.activityProjections.set(entry.id, entry);
    renderActivityLedger();
  }

  function activityEntryTime(entry) {
    return timestampDate(entry.occurredAt)?.getTime() || 0;
  }

  function allActivityEntries() {
    return [...session.activityEvents, ...session.provisioningEvents, ...session.activityProjections.values()]
      .sort((left, right) => activityEntryTime(right) - activityEntryTime(left) || String(right.id).localeCompare(String(left.id)));
  }

  function renderActivityFilters() {
    const entries = allActivityEntries();
    const counts = new Map([...activityCategories].map((category) => [category, category === "all" ? entries.length : entries.filter((entry) => entry.category === category).length]));
    ui.activityFilterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.activityFilter === session.activityFilter)));
    ui.activityFilterCounts.forEach((element) => { element.textContent = String(counts.get(element.dataset.activityFilterCount) || 0); });
    // A filter for a category with nothing in it is a dead control. Nine chips
    // reading zero told the customer only that nine categories exist; hiding
    // the empty ones means the row describes what their team has actually
    // done. "All" stays so there is always something to return to.
    ui.activityFilterButtons.forEach((button) => {
      const category = button.dataset.activityFilter;
      const empty = category !== "all" && !(counts.get(category) || 0);
      button.hidden = empty && category !== session.activityFilter;
    });
  }

  function activityMarker(entry) {
    if (entry.source === "runtime") return agentRoleContract?.canonicalAgentRole?.(entry.agentRole)?.code || "A";
    return ({ sessions: "S", workspace: "W", approvals: "AP", provisioning: "PV", cost: "$" })[entry.category] || "·";
  }

  // Agents get names. "7f3a1c2e-… → 9b2d4f81-…" is not a conversation, and a
  // customer who has hired a team should be able to say who did what. Names
  // are assigned deterministically from the role and the engineer's ordinal,
  // so the same agent is the same person on every page load.
  // Keyed by the canonical AgentRole enum keys that canonicalAgentRole()
  // returns. The first draft used shorthand keys ("tpm", "em") that never
  // matched, so every leadership tile fell through to the engineer fallback
  // and the Product Manager answered to an engineer's name.
  const agentNames = { AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER: "Riley", AGENT_ROLE_ENGINEERING_MANAGER: "Morgan", AGENT_ROLE_PRODUCT_DESIGNER: "Dana" };
  const engineerNames = ["Ada", "Sam", "Jordan", "Avery", "Kit", "Noor"];
  function agentDisplayName(entry) {
    const role = agentRoleContract?.canonicalAgentRole?.(entry?.agentRole);
    if (!role) return "";
    if (agentNames[role.key]) return agentNames[role.key];
    // Engineers share one role, so the code (E4, E5…) picks the name.
    const ordinal = Number.parseInt(String(role.code || "").replace(/\D/g, ""), 10);
    return engineerNames[(Number.isFinite(ordinal) ? ordinal - 4 : 0) % engineerNames.length] || "Engineer";
  }

  // Tool calls are evidence for the sentence above them, not news. Folded into
  // the turn as one quiet line, they answer "how do you know" without turning
  // the log into a syscall trace.
  function toolEvidence(entries) {
    const tools = entries.filter((entry) => entry.category === "tools").map((entry) => stringValue(entry.title).replace(/^Tool · /, ""));
    if (!tools.length) return "";
    const counts = new Map();
    tools.forEach((tool) => counts.set(tool, (counts.get(tool) || 0) + 1));
    return [...counts].map(([tool, n]) => (n > 1 ? `${tool} ×${n}` : tool)).join(" · ");
  }

  // One entry per agent turn: consecutive events from the same agent in the
  // same session are one thing that happened, not five.
  function groupActivityTurns(entries) {
    const turns = [];
    entries.forEach((entry) => {
      const last = turns[turns.length - 1];
      const speaker = agentDisplayName(entry);
      const key = `${speaker}|${entry.sessionId || ""}`;
      if (last && last.key === key && speaker) last.entries.push(entry);
      else turns.push({ key, speaker, entries: [entry] });
    });
    return turns;
  }

  // The descent: every piece of GitHub work on one line, sinking from planned
  // to shipped. State comes from the work itself - an issue with an assignee
  // is being built, an open pull request is in review - rather than from a
  // status we invent, so the board cannot disagree with the customer's own
  // repository.
  const descentBands = [
    { state: "planned", label: "Planned" },
    { state: "building", label: "Building" },
    { state: "review", label: "In review" },
    { state: "shipped", label: "Shipped" },
  ];

  function descentStateOf(entry) {
    const status = stringValue(entry.status).toLowerCase();
    if (entry.pullRequestId) return status === "merged" || status === "closed" ? "shipped" : "review";
    if (status === "closed") return "shipped";
    // "Assignees …" in the detail means an engineer has it; "No assignees"
    // means it is still waiting.
    return /assignees\s+\S/i.test(stringValue(entry.detail)) && !/no assignees/i.test(stringValue(entry.detail)) ? "building" : "planned";
  }

  // Gauges are the one place this app needs a computed length, and the app
  // shell ships style-src 'self' — which blocks style ATTRIBUTES, not
  // stylesheets. Both bars were setting element.style.width and were being
  // refused by the browser, so the spend gauge and the provisioning bar
  // silently never moved. Writing a real rule through CSSOM is the same
  // result without asking the policy to widen.
  let gaugeSheet = null;
  let gaugeSequence = 0;
  function setGaugeWidth(element, percent) {
    if (!element) return;
    const value = Math.max(0, Math.min(100, Number(percent) || 0));
    if (!gaugeSheet) {
      if (!("adoptedStyleSheets" in document) || typeof CSSStyleSheet !== "function") return;
      try {
        gaugeSheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, gaugeSheet];
      } catch { return; }
    }
    let id = element.getAttribute("data-gauge");
    if (!id) {
      gaugeSequence += 1;
      id = `g${gaugeSequence.toString()}`;
      element.setAttribute("data-gauge", id);
    }
    const selector = `[data-gauge="${id}"]`;
    for (let index = gaugeSheet.cssRules.length - 1; index >= 0; index -= 1) {
      if (gaugeSheet.cssRules[index].selectorText === selector) gaugeSheet.deleteRule(index);
    }
    gaugeSheet.insertRule(`${selector}{width:${value.toFixed(1)}%}`, gaugeSheet.cssRules.length);
  }

  // The teams surface's charts need left/width/height, not just width — the
  // same CSSOM discipline as setGaugeWidth on the same adopted sheet. Chart
  // elements are rebuilt on every paint, so their rules are prefixed ("c"
  // for the lanes and bars, "t" for the tile meters) and purged by their own
  // renderer before each rebuild; the gauges' stable rules are never touched.
  function purgeChartGeometry(prefix) {
    if (!gaugeSheet) return;
    const marker = `[data-gauge="${prefix}`;
    for (let index = gaugeSheet.cssRules.length - 1; index >= 0; index -= 1) {
      if (gaugeSheet.cssRules[index].selectorText?.startsWith(marker)) gaugeSheet.deleteRule(index);
    }
  }

  function setChartGeometry(element, geometry, prefix = "c") {
    if (!element) return;
    if (!gaugeSheet) {
      if (!("adoptedStyleSheets" in document) || typeof CSSStyleSheet !== "function") return;
      try {
        gaugeSheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, gaugeSheet];
      } catch { return; }
    }
    let id = element.getAttribute("data-gauge");
    if (!id) {
      gaugeSequence += 1;
      id = `${prefix}${gaugeSequence.toString()}`;
      element.setAttribute("data-gauge", id);
    }
    const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0)).toFixed(2);
    const declarations = [];
    if (Number.isFinite(geometry?.left)) declarations.push(`left:${clamp(geometry.left)}%`);
    if (Number.isFinite(geometry?.width)) declarations.push(`width:${clamp(geometry.width)}%`);
    if (Number.isFinite(geometry?.height)) declarations.push(`height:${clamp(geometry.height)}%`);
    if (!declarations.length) return;
    const selector = `[data-gauge="${id}"]`;
    for (let index = gaugeSheet.cssRules.length - 1; index >= 0; index -= 1) {
      if (gaugeSheet.cssRules[index].selectorText === selector) gaugeSheet.deleteRule(index);
    }
    gaugeSheet.insertRule(`${selector}{${declarations.join(";")}}`, gaugeSheet.cssRules.length);
  }

  // When this team came into existence, for separating its own work from the
  // repository's history. The generated client surfaces created_at either as
  // an ISO string or a {seconds} timestamp depending on transport; the
  // parse itself lives in teamCreatedAtMs, which the team tiles share.
  function selectedTeamCreatedAtMs() {
    return teamCreatedAtMs(selectedTeam());
  }

  function renderDescent() {
    if (!ui.descent || !ui.descentList) return;
    const teamBorn = selectedTeamCreatedAtMs();
    const work = allActivityEntries().filter((entry) => {
      if (entry.category !== "delivery" || !(entry.githubIssueId || entry.pullRequestId)) return false;
      // GitHub work is projected per repository, so a new team pointed at the
      // same repository inherits its predecessor's issues and pull requests.
      // Work that predates this team is the repository's history, not this
      // crew's output, and rendering it as "Shipped" under a brand-new team
      // told the customer a lie within minutes of creating it.
      if (teamBorn) {
        const at = Date.parse(entry.occurredAt || "") || 0;
        if (at && at < teamBorn) return false;
      }
      return true;
    });
    ui.descentList.replaceChildren();
    // The conversation with the Product Manager is the floor's headline now;
    // the tracked-objective form ships demoted (is-secondary) in the shell and
    // never reclaims primacy, so there is nothing to toggle here.
    if (ui.workCount) ui.workCount.textContent = work.length ? String(work.length) : "";
    if (!work.length) { ui.descent.hidden = true; return; }
    ui.descent.hidden = false;

    const byState = new Map(descentBands.map((band) => [band.state, []]));
    work.forEach((entry) => byState.get(descentStateOf(entry))?.push(entry));

    descentBands.forEach((band) => {
      const items = byState.get(band.state) || [];
      if (!items.length) return;   // a band with nothing in it is not news
      const li = document.createElement("li");
      li.className = "descent-band";
      li.dataset.state = band.state;
      const head = document.createElement("div");
      head.className = "descent-band-head";
      const h4 = document.createElement("h4");
      h4.textContent = band.label;
      const rule = document.createElement("span");
      rule.className = "rule";
      const count = document.createElement("span");
      count.className = "count";
      count.textContent = String(items.length);
      head.append(h4, rule, count);
      li.append(head);

      items.forEach((entry) => li.append(descentWorkRow(entry, band.state)));
      ui.descentList.append(li);
    });
  }

  // One row of open work, in the design system's own work grammar: a state
  // glyph, the human title, the reference and who has it underneath, and a
  // badge saying where it is. State is carried by the glyph and the word; the
  // row's tint is the system's, and it never carries type on its own.
  const WORK_ROW = Object.freeze({
    planned: { modifier: "dn-work--open", glyph: "circle-dot", badge: "Planned", badgeClass: "dn-badge" },
    building: { modifier: "dn-work--open", glyph: "circle-dot", badge: "Building", badgeClass: "dn-badge dn-badge--live" },
    review: { modifier: "dn-work--review", glyph: "git-pull-request", badge: "In review", badgeClass: "dn-badge dn-badge--attention" },
    merged: { modifier: "dn-work--merged", glyph: "git-merge", badge: "Merged", badgeClass: "dn-badge dn-badge--success" },
    closed: { modifier: "dn-work--closed", glyph: "ban", badge: "Closed", badgeClass: "dn-badge" }
  });

  function descentWorkRow(entry, bandState) {
    const shipped = bandState === "shipped";
    const key = shipped ? (stringValue(entry.status) === "merged" ? "merged" : "closed") : bandState;
    const shape = WORK_ROW[key] || WORK_ROW.planned;
    const linked = Boolean(entry.artifactUrl);
    const row = document.createElement(linked ? "a" : "div");
    row.className = `dn-work ${shape.modifier}${linked ? " dn-bare" : ""}`;
    if (linked) {
      row.href = entry.artifactUrl;
      row.target = "_blank";
      row.rel = "noopener noreferrer";
      row.referrerPolicy = "no-referrer";
    }
    const glyph = document.createElement("span");
    glyph.className = "dn-work__glyph";
    glyph.append(spriteIcon(shape.glyph, 15));
    const main = document.createElement("div");
    main.className = "dn-work__main";
    const title = document.createElement("div");
    title.className = "dn-work__title";
    // The entry title is "Issue #1 · Add /healthz endpoint"; the reference is
    // its own chip below, so only the human part is repeated here.
    title.textContent = stringValue(entry.title).replace(/^(Issue|PR)\s+#\d+\s*·\s*/, "");
    const sub = document.createElement("div");
    sub.className = "dn-work__sub";
    const ref = document.createElement("span");
    ref.textContent = entry.pullRequestId ? `PR #${entry.pullRequestId}` : `#${entry.githubIssueId}`;
    const sep = document.createElement("span");
    sep.textContent = "·";
    const who = document.createElement("span");
    who.textContent = descentWho(entry, bandState);
    sub.append(ref, sep, who);
    main.append(title, sub);
    const right = document.createElement("div");
    right.className = "dn-work__right";
    const badge = document.createElement("span");
    badge.className = shape.badgeClass;
    badge.textContent = shape.badge;
    right.append(badge);
    row.append(glyph, main, right);
    return row;
  }

  // Who has it, in the customer's terms. Never a bot login or a raw label.
  function descentWho(entry, state) {
    if (state === "shipped") return stringValue(entry.status) === "merged" ? "merged" : "closed";
    const labels = stringValue(entry.detail).match(/agent:([a-z-]+)/i);
    if (labels) {
      const role = agentRoleContract?.canonicalAgentRole?.(labels[1]);
      if (role) return agentDisplayName({ agentRole: labels[1] }) || role.label;
    }
    if (state === "review") return "waiting on review";
    return state === "building" ? "in progress" : "unassigned";
  }

  // One ledger row, built the same way wherever it appears. The team log and
  // the agent view's activity slice share this builder, so the two surfaces
  // can never phrase the same event differently.
  function activityLedgerItem(entry, evidence) {
    const item = document.createElement("li");
    item.className = "customer-activity-item";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const summary = document.createElement("p");
    const meta = document.createElement("div");
    meta.className = "customer-activity-meta";
    // Lead with who is speaking and what they said. The old title was built
    // from metadata - "A2A propose initiative", "Tool · deep navy assign
    // work" - which described our event taxonomy rather than the work. The
    // agent's own customer-safe sentence was already on the event and was
    // being shown underneath that; now it is the entry.
    const speaker = agentDisplayName(entry);
    const roleLabel = entry.source === "runtime" ? agentRoleLabel(entry.agentRole) : "";
    // The actor's name carries the actor's role hue — the name IS the word
    // the colour pairs with, so the tint is never the only cue. The role key
    // also rides the row itself, so the evidence rail underneath can carry
    // the same identity. Colour paints only under [data-role-key=…] scopes.
    const actorRole = entry.source === "runtime" ? agentRoleContract?.canonicalAgentRole?.(entry.agentRole) : null;
    if (speaker && actorRole) {
      const actor = document.createElement("span");
      actor.className = "ledger-actor";
      actor.dataset.roleKey = actorRole.key;
      actor.textContent = speaker;
      title.append(actor, ` · ${roleLabel}`);
      item.dataset.roleKey = actorRole.key;
    } else {
      title.textContent = speaker ? `${speaker} · ${roleLabel}` : (stringValue(entry.title) || "Update");
    }
    summary.textContent = stringValue(entry.safeSummary) || stringValue(entry.title) || "No detail was reported.";
    // Human context only. The raw resource UUIDs the sources attach read as
    // machine telemetry in a customer timeline; anyone debugging still has
    // them in the underlying responses. GitHub numbers stay - a customer
    // recognizes "Issue #1" - and the marker glyph rides in the meta line
    // now that the timeline spine replaced the marker column.
    // Never our machinery. entry.source ("economics") and
    // entry.sequenceLabel ("Activity event 13") were printed straight into
    // the customer's timeline, along with a single-letter marker glyph. A
    // customer's model is issues, pull requests and money.
    const metaValues = [stringValue(entry.status)];
    if (entry.githubIssueId) metaValues.push(`Issue ${entry.githubIssueId}`);
    if (entry.pullRequestId) metaValues.push(`PR ${entry.pullRequestId}`);
    metaValues.filter(Boolean).forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      // The state word carries the state colour: open is kelp, merged is
      // the engineers' azure (the deliberate signature — merged work is
      // theirs), failed and voided are coral. The word itself stays, so
      // the line still reads in greyscale.
      if (value === stringValue(entry.status)) span.dataset.status = value.toLowerCase();
      meta.append(span);
    });
    copy.append(title, summary);
    if (entry.detail) {
      const detail = document.createElement("p");
      detail.className = "customer-activity-details";
      detail.textContent = stringValue(entry.detail);
      if (entry.artifactUrl) {
        detail.append(document.createTextNode(" · "));
        const link = document.createElement("a");
        link.href = entry.artifactUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.referrerPolicy = "no-referrer";
        link.textContent = "Open verified GitHub artifact";
        detail.append(link);
      }
      copy.append(detail);
    }
    if (evidence) {
      const line = document.createElement("p");
      line.className = "customer-activity-evidence";
      line.textContent = `↳ ${evidence}`;
      copy.append(line);
    }
    if (entry.diffAvailability) {
      const diff = document.createElement("details");
      diff.className = "safe-diff";
      const diffSummary = document.createElement("summary");
      diffSummary.textContent = entry.diffAvailability === "available" ? "Review server-sanitized diff" : `Diff unavailable · ${entry.diffAvailability}`;
      diff.append(diffSummary);
      const diffNote = document.createElement("p");
      diffNote.textContent = entry.diffAvailability === "available"
        ? ["WorkspaceService returned customer-safe text only.", entry.diffRedacted ? "Sensitive-looking values were redacted." : "", entry.diffTruncated ? "The diff was truncated at the service boundary." : ""].filter(Boolean).join(" ")
        : "WorkspaceService withheld the diff and returned this typed availability state.";
      diff.append(diffNote);
      if (entry.diffAvailability === "available" && entry.safeDiff) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = entry.safeDiff;
        pre.append(code);
        diff.append(pre);
      }
      copy.append(diff);
    }
    copy.append(meta);
    const time = document.createElement("time");
    const date = timestampDate(entry.occurredAt);
    time.textContent = date ? relativeTime(date) : "Time not reported";
    if (date) time.dateTime = date.toISOString();
    item.append(copy, time);
    return item;
  }

  function renderActivityLedger() {
    renderActivityFilters();
    refreshCrewActivity();
    renderDescent();
    // The teams surface's lanes and role bars read this same buffer, so they
    // repaint on the same beat the ledger does.
    renderDashboardCharts();
    const allEntries = allActivityEntries();
    const entries = session.activityFilter === "all" ? allEntries : allEntries.filter((entry) => entry.category === session.activityFilter);
    ui.activityList.replaceChildren();
    // One entry per agent turn. Tool calls belong to the turn that made them,
    // so they are folded in as evidence rather than listed as peers of the
    // work they served.
    const turns = groupActivityTurns(entries);
    const shown = turns.map((turn) => {
      const lead = turn.entries.find((entry) => entry.category !== "tools") || turn.entries[0];
      return { entry: lead, evidence: turn.speaker ? toolEvidence(turn.entries) : "" };
    });
    // Both surfaces paint the same rows, so the arrival marks are read from
    // one snapshot taken before either does: the floor consumes them below,
    // and the Activity screen is handed the copy, so the row that just landed
    // rises on whichever of the two the reader is actually looking at.
    const arrived = new Set(session.freshActivityIds);
    shown.forEach(({ entry, evidence }) => {
      const item = activityLedgerItem(entry, evidence);
      // A row the stream just delivered rises and flashes once (.dn-in-log).
      // The mark is consumed here, on its first paint, so re-renders — a
      // filter change, a projection refresh — can never replay the motion.
      if (session.freshActivityIds.has(entry.id)) {
        item.classList.add("dn-in-log");
        session.freshActivityIds.delete(entry.id);
      }
      ui.activityList.append(item);
    });
    ui.activityEmpty.hidden = entries.length > 0;
    ui.activityList.hidden = entries.length === 0;
    if (!entries.length && allEntries.length) {
      const filterLabel = ui.activityFilterButtons.find((button) => button.dataset.activityFilter === session.activityFilter)?.childNodes[0]?.textContent?.trim() || "selected";
      setEmptyState(ui.activityEmpty, `Nothing under ${filterLabel.toLowerCase()} yet`, "Your team has not produced anything in this category. Try All to see everything they have done.");
    } else if (!entries.length) {
      setEmptyState(ui.activityEmpty, "No activity yet", "The selected team has no customer-safe events or source snapshots yet.");
    }
    renderActivityScreen(shown, entries, allEntries, arrived);
  }

  // Setup states are enum names - "succeeded", "waiting for gateway" - and the
  // log used to print them raw: "Provisioning is succeeded", "ready · attempt
  // 2". A colleague would say what happened to your team, so that is what the
  // log says; the state itself stays available as the status chip.
  const SETUP_SENTENCE = {
    succeeded: ["Setup finished", "Your team finished setting up and is ready to work."],
    ready: ["Setup finished", "Your team finished setting up and is ready to work."],
    running: ["Setting up", "Your team is being set up."],
    queued: ["Setting up", "Your team is waiting its turn to be set up."],
    retrying: ["Setting up", "Setup hit a problem and is being retried."],
    failed: ["Setup failed", "Setup did not finish, so the team is not running yet."],
    suspended: ["Paused", "Your team is paused."],
    deleting: ["Shutting down", "Your team is being shut down."]
  };
  // The steps are the machine's checklist. Say them the way you would to the
  // person waiting, and drop the ones that only name plumbing.
  const SETUP_STEP = {
    "queued": "waiting to start",
    "validating prerequisites": "checking your GitHub connection",
    "creating namespace": "reserving space for the team",
    "configuring runtime": "configuring the team",
    "creating openclaw instance": "starting the agents",
    "waiting for gateway": "waiting for the agents to answer",
    "ready": "ready",
    "suspending": "pausing",
    "backing up": "backing up",
    "deleting": "shutting down"
  };

  function provisioningEntry(record, source, idPrefix) {
    const teamId = stringValue(record?.teamId);
    if (!teamId || teamId !== session.selectedTeamId) throw new ApiError("ProvisioningService returned a record outside the selected team scope", 0, "invalid_response", "");
    const sequence = typeof record.sequence === "bigint" ? record.sequence : BigInt(record.sequence || 0);
    const presentation = launchContract?.provisioningPresentation(record) || {};
    const label = stringValue(presentation.label) || lifecycleLabel(record.provisioningState || record.status) || "state not reported";
    const step = stringValue(presentation.step) || stringValue(record.provisioningStep || record.step).replaceAll("_", " ").toLowerCase();
    const [spokenTitle, spokenSummary] = SETUP_SENTENCE[String(label).toLowerCase()] || ["Setup", `Setup is ${label}.`];
    const safeSummary = stringValue(record.safeSummary) || spokenSummary;
    const safeError = stringValue(record.safeError);
    if (safeSummary.length > 1000 || safeError.length > 1000 || /[\u0000-\u001f\u007f]/.test(safeSummary + safeError)) {
      throw new ApiError("ProvisioningService returned invalid customer-safe text", 0, "invalid_response", "");
    }
    return {
      id: `${idPrefix}:${stringValue(record.id) || sequence.toString() || teamId}`,
      category: "provisioning",
      source,
      title: spokenTitle,
      safeSummary,
      // "attempt 2" is only worth saying when there was more than one, and then
      // it should read as a fact about the work, not a counter.
      // Reconcile passes are how declarative provisioning works, not a
      // struggle: the counter is only worth showing when something actually
      // failed and the number explains the wait.
      detail: [SETUP_STEP[step] || step, safeError,
        Number.isInteger(record.attempt) && record.attempt > 1 && /fail|error|degraded/i.test(String(label)) ? `tried ${record.attempt} times` : ""]
        .filter(Boolean).join(" · "),
      status: label,
      sequenceLabel: sequence > 0n ? `Provisioning event ${sequence.toString()}` : "Snapshot",
      occurredAt: record.occurredAt || record.updatedAt
    };
  }

  function syncProvisioningSnapshot(team) {
    renderProvisioningProgress(team);
    const status = team?.provisioning;
    if (!status || stringValue(team.id) !== session.selectedTeamId) {
      replaceActivityProjections("provisioning-snapshot:", []);
      return;
    }
    const entry = provisioningEntry(status, "ProvisioningService snapshot", "provisioning-snapshot");
    const sequence = typeof status.sequence === "bigint" ? status.sequence : BigInt(status.sequence || 0);
    if (sequence > session.lastProvisioningSequence) session.lastProvisioningSequence = sequence;
    replaceActivityProjections("provisioning-snapshot:", [entry]);
  }

  // Determinate wait-state presentation for a team that is not active yet.
  // Research basis lives with the milestone map in launch-contract.js
  // (NN/g percent-done for >10s waits, Harrison's end-acceleration, and the
  // Buell/Norton labor illusion of naming the real work in progress). Hidden
  // the moment the team is active or provisioning fails — a failed build shows
  // the error surfaces, never a stuck bar.
  // The bar was yanked off screen the instant teams.state flipped to active.
  // That is the moment the provisioning COMMAND completed, not the moment the
  // runtime began serving, and two things were wrong with it. The customer
  // never saw 100%: the bar simply vanished at 92% - "waiting for your team's
  // gateway to come online" - so the terminal acceleration the milestone map
  // is built around (Harrison et al., UIST 2007) never happened, and a bar
  // that disappears mid-sentence reads as a build that gave up. And a
  // disappearance is not a completion signal; nothing ever said "done".
  //
  // Leaving the pending states is now what FINISHES the bar rather than what
  // hides it: 100%, the success tone, one tick, held long enough to read.
  let provisioningProgressVisible = false;
  let provisioningCompletionTimer = 0;
  let provisioningLastMessage = "";

  function renderProvisioningProgress(team) {
    if (!ui.provisioningProgress) return;
    // Deletion is a multi-minute pipeline too (back up, revoke, tear down), and
    // it was the one long wait with no indicator at all - the customer clicked
    // Delete and the row went quiet. Same treatment as provisioning.
    const pendingStates = ["pending", "deleting"];
    const state = lifecycleLabel(team?.state);
    const pending = Boolean(team) && pendingStates.includes(state);
    const progress = pending ? launchContract?.provisioningProgress?.(team.provisioning || {}) : null;

    if (!progress) {
      // provisioningProgress answers null for FAILED and CANCELED, and this
      // read that null as "hide the bar". So a build that died at 92% took the
      // entire progress surface off screen with it, mid-sentence, under
      // "waiting for your team's gateway to come online" — and the floor then
      // said nothing at all about the team. A bar that disappears mid-sentence
      // reads as a build that gave up quietly, which is precisely what this one
      // had done, except that nobody had been told.
      //
      // A stopped build is a fact and it gets a surface: the bar freezes where
      // it stopped, in the danger tone, over a Notice that says what happened,
      // what it means and what to do about it. A triumphant 100% is still never
      // shown over a failure — only leaving the pending states cleanly does
      // that.
      const stopped = ["pending", "deleting", "failed"].includes(state)
        ? launchContract?.provisioningStopped?.(team?.provisioning || {})
        : null;
      if (stopped) {
        renderStoppedProvisioning(team, stopped);
        return;
      }
      if (provisioningProgressVisible && state === "active") {
        finishProvisioningProgress();
        return;
      }
      hideProvisioningProgress();
      return;
    }

    window.clearTimeout(provisioningCompletionTimer);
    if (!provisioningProgressVisible) {
      ui.provisioningProgress.classList.add("dn-in");
      provisioningProgressVisible = true;
    }
    clearProvisioningNotice();
    ui.provisioningProgress.hidden = false;
    ui.provisioningProgress.dataset.tone = "working";
    // The DS travelling hairline is the "actively streaming" signal, and it is
    // the only honest thing to show through the gateway wait, where the
    // percentage deliberately stops climbing at 92%. Without it a bar that has
    // stopped moving is indistinguishable from a bar that has stalled.
    ui.provisioningTrack.classList.add("dn-livebar");
    setGaugeWidth(ui.provisioningFill, progress.percent);
    ui.provisioningTrack.setAttribute("aria-valuenow", String(progress.percent));
    // Tick only when the STEP changed. Ticking on every re-render would replay
    // the animation on unrelated team updates, which is noise, not meaning.
    if (progress.message !== provisioningLastMessage) {
      retriggerMotion(ui.provisioningMessage, "dn-tick");
      provisioningLastMessage = progress.message;
    }
    ui.provisioningMessage.textContent = progress.message;
    ui.provisioningEta.textContent = progress.eta || "";
  }

  function finishProvisioningProgress() {
    if (!ui.provisioningProgress) return;
    window.clearTimeout(provisioningCompletionTimer);
    clearProvisioningNotice();
    ui.provisioningProgress.hidden = false;
    ui.provisioningProgress.dataset.tone = "done";
    ui.provisioningTrack.classList.remove("dn-livebar");
    setGaugeWidth(ui.provisioningFill, 100);
    ui.provisioningTrack.setAttribute("aria-valuenow", "100");
    ui.provisioningMessage.textContent = "Your team is live";
    ui.provisioningEta.textContent = "";
    retriggerMotion(ui.provisioningMessage, "dn-tick");
    provisioningLastMessage = "";
    provisioningProgressVisible = false;
    // Long enough to read the completion, short enough that it does not become
    // furniture on a page whose headline already says the team is running.
    provisioningCompletionTimer = window.setTimeout(hideProvisioningProgress, 2600);
  }

  function hideProvisioningProgress() {
    if (!ui.provisioningProgress) return;
    window.clearTimeout(provisioningCompletionTimer);
    clearProvisioningNotice();
    ui.provisioningProgress.hidden = true;
    ui.provisioningProgress.classList.remove("dn-in");
    ui.provisioningTrack?.classList.remove("dn-livebar");
    delete ui.provisioningProgress.dataset.tone;
    provisioningProgressVisible = false;
    provisioningLastMessage = "";
  }

  // ── A build that stopped ────────────────────────────────────────────────
  // The bar stays, frozen at the milestone it reached, and says so in words:
  // "stopped before it finished" is the cue, the danger tone is only the
  // corroboration. Under it goes the Notice — an event that happened in the
  // provisioning pipeline, at a time, with a code — carrying the remedies the
  // API can actually perform.
  function renderStoppedProvisioning(team, stopped) {
    window.clearTimeout(provisioningCompletionTimer);
    provisioningProgressVisible = false;
    provisioningLastMessage = "";
    ui.provisioningProgress.hidden = false;
    ui.provisioningProgress.classList.add("dn-in");
    ui.provisioningProgress.dataset.tone = "stopped";
    // The travelling hairline means "this is streaming right now". Nothing is.
    ui.provisioningTrack.classList.remove("dn-livebar");
    setGaugeWidth(ui.provisioningFill, stopped.percent);
    ui.provisioningTrack.setAttribute("aria-valuenow", String(stopped.percent));
    const verb = stopped.canceled ? "was canceled" : "stopped";
    ui.provisioningMessage.textContent = stopped.deleting
      ? `Removing this team ${verb} before it finished`
      : `Setup ${verb} before it finished`;
    // The step it died on, in the words the bar was using a moment earlier, so
    // the last thing the customer read is the thing the failure names.
    ui.provisioningEta.textContent = stopped.message ? `Stopped at: ${stopped.message.toLowerCase()}` : "";
    renderProvisioningStoppedNotice(team, stopped);
  }

  function clearProvisioningNotice() {
    if (!ui.provisioningNotice) return;
    ui.provisioningNotice.replaceChildren();
    ui.provisioningNotice.hidden = true;
  }

  // Three clauses, in order: what happened, what it means, what happens next.
  function renderProvisioningStoppedNotice(team, stopped) {
    if (!ui.provisioningNotice) return;
    const presentation = launchContract?.provisioningPresentation?.(team?.provisioning || {}) || {};
    const rawStep = stringValue(presentation.step);
    const step = SETUP_STEP[rawStep] || rawStep;
    const failedAt = timestampDate(team?.provisioning?.occurredAt || team?.provisioning?.updatedAt);
    const controls = teamLifecycleControls(team);

    // What happened. The server's own customer-safe sentence when it sent one,
    // because it knows more than the step name does; the step otherwise.
    const happened = stringValue(stopped.safeError)
      || (step && step !== "waiting for status"
        ? `${stopped.deleting ? "Removing this team" : "Setup"} ${stopped.canceled ? "was canceled" : "failed"} while ${step}.`
        : `${stopped.deleting ? "Removing this team" : "Setup"} ${stopped.canceled ? "was canceled" : "failed"} before it reported a step.`);

    // What it means, then what happens next. Deletion is still a door; it is no
    // longer the only one, and it is no longer the first.
    const means = stopped.deleting
      ? "The team is still here, and part of its workspace may already be torn down."
      : "The team never started running, and its workspace was never finished.";
    const canRetry = stopped.deleting ? controls.includes("delete") : controls.includes("resume");
    const next = stopped.deleting
      ? (canRetry ? "Retry deletion to finish removing it." : "Nothing else is needed from you; support can finish the removal.")
      : (canRetry
        ? "Retry setup to run the same build again — it reuses this team rather than creating another one."
        : "Nothing here can restart it; contact support with the code below.");

    const actions = [];
    if (canRetry && !stopped.deleting) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "dn-btn dn-btn--primary dn-btn--sm";
      retry.textContent = "Retry setup";
      retry.addEventListener("click", () => resumeTeamLifecycle(team));
      actions.push(retry);
    }
    // Deletion stays available and stays destructive, so it stays a ghost
    // button behind the non-destructive one — and it opens the confirmation on
    // the team list rather than deleting from here.
    if (controls.includes("delete")) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "dn-btn dn-btn--ghost dn-btn--sm";
      remove.dataset.viewLink = "dashboard";
      remove.textContent = stopped.deleting ? "Retry deletion" : "Delete this team";
      remove.addEventListener("click", () => requestTeamDeletion(team));
      actions.push(remove);
    }

    const notice = buildNotice({
      // The ladder decides how loud this is; this file only names the level.
      level: "error",
      title: happened,
      body: `${means} ${next}`,
      code: [stringValue(presentation.state) || "PROVISIONING_STATE_FAILED", rawStep].filter(Boolean).join(" · "),
      // A Notice names where the event came from, in the customer's own model —
      // "team setup", not the service that runs it. check_runtime_language.cjs
      // fails the build on the latter, and it is right to: the customer's model
      // is issues, pull requests, reviews and money.
      source: stopped.deleting ? "Team removal" : "Team setup",
      time: failedAt ? relativeTime(failedAt) : "",
      actions
    });
    if (!notice) {
      clearProvisioningNotice();
      return;
    }
    ui.provisioningNotice.replaceChildren(notice);
    ui.provisioningNotice.hidden = false;
  }

  // Replaying a CSS animation needs the class removed, layout flushed, and the
  // class restored. Without the forced reflow the browser coalesces both class
  // changes into one style recalculation and the animation never replays.
  function retriggerMotion(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function appendProvisioningEvent(event) {
    const sequence = typeof event?.sequence === "bigint" ? event.sequence : BigInt(event?.sequence || 0);
    if (sequence <= session.lastProvisioningSequence) return;
    const entry = provisioningEntry(event, "ProvisioningService stream", "provisioning-event");
    session.lastProvisioningSequence = sequence;
    session.provisioningEvents.push(entry);
    if (session.provisioningEvents.length > 80) session.provisioningEvents.shift();
    renderActivityLedger();
  }

  // Reconnection twin of scheduleActivityReconnect: same backoff curve, same
  // budget, same token remedy. It deliberately leaves ui.activityState alone —
  // that label narrates the ACTIVITY stream, which during a delete is not even
  // open; overwriting the removal screen's copy with transport chatter would
  // tell the customer about our plumbing instead of their progress.
  function scheduleProvisioningReconnect(teamId, generation, attempt, refreshToken) {
    const delay = Math.min(30000, 1500 * 2 ** attempt);
    session.provisioningReconnectTimer = window.setTimeout(async () => {
      session.provisioningReconnectTimer = null;
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || !session.accessToken) return;
      // An expired token would fail every retry identically; heal it first.
      if (refreshToken) await refreshStreamAccessToken();
      if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId) return;
      startProvisioningStream(teamId, generation, attempt);
    }, delay);
  }

  // A stream that gives up for good must hand coverage back to the poll it
  // displaced, or a dead stream would leave the page exactly as frozen as the
  // polling gap it was built to close.
  function resumeProvisioningFallbackPoll(teamId) {
    const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
    if (team) startProvisioningPolling(team, 1000);
  }

  async function startProvisioningStream(teamId, generation = session.workspaceGeneration, attempt = 0) {
    stopProvisioningStream();
    if (!teamId || typeof platformApi?.streamProvisioningStatus !== "function") return;
    const controller = new AbortController();
    session.provisioningAbort = controller;
    // Same settle-window trick as the activity stream: a stream with nothing
    // to replay is indistinguishable from one that never opened, and the
    // fallback poll must stand down for a healthy-but-quiet stream too.
    let streamEstablished = false;
    const markStreamEstablished = () => {
      if (streamEstablished || controller.signal.aborted) return;
      streamEstablished = true;
      session.provisioningStreamLive = true;
    };
    const establishTimer = window.setTimeout(markStreamEstablished, 1500);
    const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
    try {
      for await (const response of platformApi.streamProvisioningStatus({ teamId, afterSequence: session.lastProvisioningSequence }, {
        accessToken: session.accessToken,
        requestId,
        signal: controller.signal
      })) {
        if (generation !== session.workspaceGeneration || teamId !== session.selectedTeamId || controller.signal.aborted) return;
        const status = response?.provisioning;
        const event = response?.event;
        // A frame reporting only a health change carries no event and no
        // status, so health is read before anything gates on either.
        const runtimeHealth = response?.runtimeHealth;
        if (status && stringValue(status.teamId) !== stringValue(teamId)) throw new ApiError("ProvisioningService returned a status outside the selected team scope", 0, "invalid_response", requestId);
        if (event && stringValue(event.teamId) !== stringValue(teamId)) throw new ApiError("ProvisioningService returned an event outside the selected team scope", 0, "invalid_response", requestId);
        window.clearTimeout(establishTimer);
        markStreamEstablished();
        if (event) appendProvisioningEvent(event);
        const team = selectedTeam();
        // Readiness reaches the badge through the phase, so a runtime that
        // stops being ready takes the live dot with it without anyone polling.
        if (runtimeHealth && team && applyTeamRuntimeHealth(team, runtimeHealth)) {
          renderTeamList();
          renderTeamHeadline();
        }
        if (status && team) {
          team.provisioning = status;
          team._pollingMessage = "";
          syncProvisioningSnapshot(team);
          renderTeamList();
          renderSelectedTeamSummary();
          const presented = launchContract.provisioningPresentation(status);
          if (presented.terminal && !presented.failed) {
            // Route the lifecycle from the stream itself — this is the moment
            // the customer used to spend staring at a stale "retrying" until a
            // hard reload. A finished DELETE goes through the shared removal
            // door (one toast, one reload, shared with the fallback poll);
            // a finished provision/resume is keyed on its terminal record so
            // a replayed snapshot cannot refetch in a loop.
            const removal = launchContract.provisioningOperation(status) === launchContract.PROVISIONING_OPERATION.DELETE;
            if (removal) {
              await routeTeamRemoved(team);
              return;
            }
            const routeKey = `${stringValue(teamId)}:${stringValue(presented.sequence)}:${presented.state}`;
            // A team that is already active has nothing to route TO. Since the
            // stream now stays open past provisioning to follow runtime health,
            // it replays this terminal snapshot on every reconnect, and routing
            // on it would re-read the roster each time for no new fact.
            if (lifecycleLabel(team.state) === "active") {
              session.provisioningRouteKey = routeKey;
            } else if (session.provisioningRouteKey !== routeKey) {
              session.provisioningRouteKey = routeKey;
              // Reflect only server truth, like the poll's terminal branch:
              // re-read the team list, and renderTeamList's writes to
              // [data-teams-empty]/[data-team-list] tell the view router what
              // happened. A finished provision/resume re-reads lifecycle and
              // reloads the roster through refreshSelectedTeam.
              await reloadTeamsAfterLifecycle();
              return;
            }
          }
        }
        setSourceState(ui.activityState, session.activityAbort ? "Sources live" : "Provisioning live", "success");
      }
      if (!controller.signal.aborted && generation === session.workspaceGeneration) {
        session.provisioningStreamLive = false;
        // A cleanly closed stream is usually a rolling deploy retiring the
        // pod; the sequence cursor makes reconnecting lossless, so do it
        // ourselves before asking anyone to click anything.
        const nextAttempt = streamEstablished ? 0 : attempt + 1;
        if (nextAttempt <= activityReconnectLimit) {
          scheduleProvisioningReconnect(teamId, generation, nextAttempt, false);
          return;
        }
        ui.activityRetry.hidden = false;
        resumeProvisioningFallbackPoll(teamId);
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== session.workspaceGeneration) return;
      const normalized = error?.name === "PlatformClientError"
        ? new ApiError(stringValue(error.message), Number(error.status || 0), stringValue(error.code), stringValue(error.requestId) || requestId)
        : error;
      session.provisioningStreamLive = false;
      // "Not found" for a team mid-removal is the deletion finishing and
      // taking the status resource with it, not an outage. Route it exactly
      // like a streamed delete-succeeded — an error banner here is how a
      // completed deletion looked stuck until someone hard-reloaded.
      const removingTeam = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (isMissingResource(normalized) && removingTeam && lifecycleLabel(removingTeam.state) === "deleting") {
        await routeTeamRemoved(removingTeam);
        return;
      }
      // A mid-stream token expiry arrives as an in-stream "unauthenticated"
      // error frame; it heals through the session cookie exactly as the
      // activity stream's does. Treating it as terminal turns one expiry into
      // a frozen provisioning panel that no same-token retry can fix.
      const unauthenticated = normalized instanceof ApiError && (normalized.status === 401 || normalized.code === "unauthenticated");
      const nextAttempt = streamEstablished ? 0 : attempt + 1;
      if ((unauthenticated || isRetryableApiError(normalized)) && nextAttempt <= activityReconnectLimit) {
        scheduleProvisioningReconnect(teamId, generation, nextAttempt, unauthenticated);
        return;
      }
      ui.activityRetry.hidden = false;
      if (!session.activityEvents.length && !session.provisioningEvents.length && !session.activityProjections.size) {
        setEmptyState(ui.activityEmpty, "Provisioning stream unavailable", apiErrorMessage(normalized, "Provisioning updates could not be streamed."));
      }
      resumeProvisioningFallbackPoll(teamId);
    } finally {
      window.clearTimeout(establishTimer);
      if (session.provisioningAbort === controller) session.provisioningAbort = null;
    }
  }

  function changeActivityFilter(event) {
    const button = event.target instanceof Element ? event.target.closest("[data-activity-filter]") : null;
    const filter = stringValue(button?.dataset.activityFilter);
    if (!button || !activityCategories.has(filter)) return;
    session.activityFilter = filter;
    renderActivityLedger();
  }

  function timestampDate(timestamp) {
    if (!timestamp) return null;
    try {
      const seconds = typeof timestamp.seconds === "bigint" ? timestamp.seconds : BigInt(timestamp.seconds || 0);
      const milliseconds = Number(seconds) * 1000 + Math.floor(Number(timestamp.nanos || 0) / 1_000_000);
      const date = new Date(milliseconds);
      return Number.isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  function relativeTime(date) {
    const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (Math.abs(deltaSeconds) < 60) return formatter.format(deltaSeconds, "second");
    const minutes = Math.round(deltaSeconds / 60);
    if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function capitalize(value) {
    const text = stringValue(value);
    return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
  }

  function lifecycleLabel(value) {
    if (typeof value === "number") return ["", "pending", "active", "suspended", "deleting", "deleted", "failed"][value] || "";
    return stringValue(value).replace(/^LIFECYCLE_STATE_/, "").replaceAll("_", " ").toLowerCase();
  }

  function teamNeedsProvisioningPoll(team) {
    if (!stringValue(team?.id)) return false;
    if (team.provisioning && launchContract.provisioningTerminal(team.provisioning)) return false;
    const state = lifecycleLabel(team.state);
    return Boolean(team.provisioning) || ["pending", ""].includes(state);
  }

  // The status stream is warranted exactly while the command pipeline still
  // owes this team a terminal state: any non-terminal provisioning record, or
  // a removal in flight. A pre-payment pending team has no provisioning
  // resource yet — the GetTeam poll owns that wait, and opening the stream
  // there would only manufacture a "not found" error to explain away.
  function teamNeedsProvisioningStream(team) {
    if (!stringValue(team?.id)) return false;
    if (lifecycleLabel(team.state) === "deleting") return true;
    // An active team's PROVISIONING is history — but the same stream now also
    // carries TeamRuntimeHealth, and that is not history: it is the only fact
    // on the wire that can withdraw a live indicator when a runtime stops
    // being ready. Closing the stream the moment provisioning settled is
    // exactly what left the badge reasoning from a fact about the past.
    if (lifecycleLabel(team.state) === "active") return true;
    if (!team.provisioning) return false;
    return !launchContract.provisioningTerminal(team.provisioning);
  }

  function startProvisioningPolling(team, delay = 1000) {
    if (!teamNeedsProvisioningPoll(team) || provisioningTimers.has(team.id)) return;
    const timer = window.setTimeout(() => pollProvisioning(team.id), delay);
    provisioningTimers.set(team.id, timer);
  }

  async function pollProvisioning(teamId) {
    provisioningTimers.delete(teamId);
    if (!session.accessToken || document.visibilityState === "hidden") {
      const team = session.teams.find((candidate) => candidate.id === teamId);
      if (team) startProvisioningPolling(team, 5000);
      return;
    }
    // The stream is the primary transport now and this poll is its fallback.
    // While the selected team's stream is live, skip the RPC but keep a lazy
    // re-check armed, so polling resumes on its own the moment the stream
    // drops. Only the selected team has a stream; every other team still
    // polls at full cadence.
    if (teamId === session.selectedTeamId && session.provisioningStreamLive === true) {
      const covered = session.teams.find((candidate) => candidate.id === teamId);
      if (covered) startProvisioningPolling(covered, 5000);
      return;
    }
    const team = session.teams.find((candidate) => candidate.id === teamId);
    if (!team) return;
    try {
      let status;
      // runtime_health rides the same response. It is absent until the team's
      // runtime has reported once, and that absence is left alone.
      let runtimeHealth;
      try {
        const response = await apiRequest("provisioning_status", { teamId });
        status = response.provisioning;
        runtimeHealth = response.runtimeHealth;
      } catch (error) {
        if (!(error instanceof ApiError) || !["unimplemented", "not_configured"].includes(error.code)) throw error;
        const response = await apiRequest("team", { id: teamId });
        if (response.team) {
          if (stringValue(response.team.id) !== stringValue(teamId) || stringValue(response.team.organizationId) !== session.organizationId) {
            throw new ApiError("The team service returned a resource outside the selected organization scope", 0, "invalid_response", "");
          }
          Object.assign(team, response.team);
        }
        status = response.team?.provisioning;
      }
      if (status) team.provisioning = status;
      if (runtimeHealth) applyTeamRuntimeHealth(team, runtimeHealth);
      team._pollingMessage = "";
      renderTeamList();
      if (teamId === session.selectedTeamId) {
        syncProvisioningSnapshot(team);
        renderSelectedTeamSummary();
      }
      const removing = lifecycleLabel(team.state) === "deleting";
      if (!launchContract.provisioningTerminal(team.provisioning || {})) {
        // Deletion is watched closely by whoever pressed the button; poll it
        // twice as often so the bar actually moves while they are looking.
        startProvisioningPolling(team, removing ? 2500 : 5000);
      } else if (removing && !launchContract.provisioningPresentation(team.provisioning || {}).failed) {
        // The delete command finished, but provisioning status carries the
        // command - not the lifecycle. Without this re-read the row sat at
        // "deleting" with a completed command until the customer reloaded,
        // which is exactly how a finished deletion looked like a stuck one.
        await routeTeamRemoved(team);
        return;
      }
    } catch (error) {
      // "Not found" while the team was being removed is the deletion finishing
      // between two status reads, not an outage — the same routing the stream
      // does when the delete completes under it. The error banner here is how
      // a finished deletion once looked stuck until someone hard-reloaded.
      if (isMissingResource(error) && lifecycleLabel(team.state) === "deleting") {
        await routeTeamRemoved(team);
        return;
      }
      team._pollingMessage = apiErrorMessage(error, "Provisioning status is temporarily unavailable. Use Refresh status to retry.");
      renderTeamList();
      if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      if (isRetryableApiError(error)) startProvisioningPolling(team, 10000);
    }
  }

  function stopProvisioningPolling() {
    provisioningTimers.forEach((timer) => window.clearTimeout(timer));
    provisioningTimers.clear();
  }

  async function startGitHubInstallation() {
    if (readGitHubCompletion()) {
      await completePendingGitHubInstallation();
      return;
    }
    // Called from the GitHub card's own action AND from "use a different
    // organization" in the identity chip, so guard rather than assume which
    // control is on screen.
    if (ui.githubAction) ui.githubAction.disabled = true;
    if (ui.organizationConnectOther) ui.organizationConnectOther.disabled = true;
    try {
      const idempotencyKey = mutationKeys.for("githubStart", session.organizationId);
      const result = await apiRequest("github_install_start", { organizationId: session.organizationId, idempotencyKey });
      const destination = validatedRedirect(result.installationUrl || result.installation_url, ["github.com"]);
      if (!destination) throw new ApiError("GitHub service returned an untrusted redirect", 0, "invalid_redirect", "");
      if (!storageWrite(githubStartStorageKey, {
        organizationId: session.organizationId,
        flowId: stringValue(result.flowId),
        createdAt: Date.now()
      })) {
        throw new ApiError("This browser cannot preserve the installation handoff across redirects", 0, "secure_storage_unavailable", "");
      }
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, "GitHub could not be reached to connect an organization. Nothing changed."), "error");
      if (ui.githubAction) ui.githubAction.disabled = false;
      if (ui.organizationConnectOther) ui.organizationConnectOther.disabled = false;
    }
  }

  async function completePendingGitHubInstallation() {
    const pending = readGitHubCompletion();
    if (!pending || session.completingGitHub || !session.accessToken || !session.organizationId) return;
    // The handoff belongs to the workspace it started in, so that is the one to
    // finish it against - not whichever workspace happens to be current now.
    // They differ whenever the page reloads after the API has already claimed
    // the installation into a newly connected organization and made it current,
    // and refusing to finish there stranded a completed installation behind
    // "Wrong organization". Completion is idempotent, so finishing an already
    // claimed handoff returns the same answer.
    const flowOrganizationId = stringValue(pending.organizationId) || session.organizationId;
    session.completingGitHub = true;
    ui.githubAction.disabled = true;
    ui.githubAction.textContent = "Completing…";
    setStep("github", "loading", "Completing", "Verifying the one-time OAuth authorization and installation with GitHub. No callback credential will be displayed or retained after completion.");
    try {
      const result = await apiRequest("github_install_complete", {
        organizationId: flowOrganizationId,
        installationId: pending.installationId,
        setupAction: pending.setupAction,
        stateToken: pending.stateToken,
        idempotencyKey: pending.idempotencyKey,
        authorizationCode: pending.authorizationCode
      });
      const landedOrganizationId = stringValue(result.installation?.organizationId);
      if (!landedOrganizationId || !launchContract.githubInstallationActive(result.installation)) {
        throw new ApiError("The API did not confirm an active GitHub installation", 0, "invalid_response", "");
      }
      // One GitHub organization is one workspace, so installing the App on a
      // GitHub organization this account has not connected before lands in a
      // workspace of its own - which the API has already made current. Requiring
      // the answer to name the workspace the customer started from rejected that
      // as an invalid response and left "use a different GitHub organization"
      // looking broken even once the API supported it.
      if (landedOrganizationId !== session.organizationId) {
        clearGitHubFlow();
        const account = stringValue(result.installation?.accountLogin);
        toast(account ? `${account} is connected. You are now in its workspace.` : "The organization is connected. You are now in its workspace.", "success");
        const state = await organizationCoordinator.load();
        renderProfile(state.profile);
        await renderOrganizationState(state);
        return;
      }
      session.githubInstalled = true;
      setGitHubInstallation(result.installation);
      if (result.repositorySelection) session.repositorySelection = result.repositorySelection;
      clearGitHubFlow();
      toast("GitHub verified the signed-in user and active App installation.", "success");
    } catch (error) {
      ui.githubAction.textContent = "Retry completion";
      ui.githubAction.disabled = false;
      setStep("github", "error", "Not completed", apiErrorMessage(error, "The GitHub installation could not be verified. No connection was assumed."));
      if (!isRetryableApiError(error) && error?.code !== "unauthenticated") clearGitHubFlow();
      return;
    } finally {
      session.completingGitHub = false;
    }
  }

  // Settings → Manage billing opens the Stripe Customer Portal. It is available
  // only once a subscription exists (created by the first team's checkout); no
  // card is ever collected here. Team creation is what drives payment.
  async function manageBilling() {
    if (!session.subscriptionManageable) {
      toast("Billing opens after you create your first team.", "info");
      return;
    }
    ui.settingsBillingManage.disabled = true;
    try {
      const fingerprint = `${session.organizationId}:portal`;
      const idempotencyKey = mutationKeys.for("billingPortal", fingerprint);
      const result = await apiRequest("billing_portal", { organizationId: session.organizationId, returnUrl: appUrl, idempotencyKey });
      const destination = validatedRedirect(result.portalUrl || result.portal_url, ["billing.stripe.com"]);
      if (!destination) throw new ApiError("Billing service returned an untrusted portal redirect", 0, "invalid_redirect", "");
      window.location.assign(destination);
    } catch (error) {
      toast(apiErrorMessage(error, "The API could not open the Stripe billing portal."), "error");
      ui.settingsBillingManage.disabled = false;
    }
  }

  function embeddedCheckoutReturnUrl() {
    return `${appUrl}?billing=return&session_id={CHECKOUT_SESSION_ID}`;
  }

  function validCheckoutClientSecret(value) {
    const secret = stringValue(value);
    // Stripe's embedded_page Checkout client secret embeds a URL-encoded return
    // URL, so it is long (~400+ chars) and contains characters beyond
    // [A-Za-z0-9_] such as "%". Guard on the prefix, a sane length, and the
    // absence of unsafe characters (whitespace, control, quotes, angle brackets,
    // backslash) rather than an over-strict charset that rejects valid secrets.
    if (secret.length < 16 || secret.length > 2048) return "";
    if (!/^cs_(?:test|live)_/.test(secret)) return "";
    if (/[\s<>"\'`\\]/.test(secret)) return "";
    if (environment === "development" && !secret.startsWith("cs_test_")) return "";
    if (environment === "production" && !secret.startsWith("cs_live_")) return "";
    return secret;
  }

  function validateEmbeddedSession(result, returnUrl) {
    if (!validCheckoutClientSecret(result?.clientSecret)) throw new ApiError("Billing service returned an invalid embedded Checkout secret", 0, "invalid_response", "");
    if (stringValue(result?.returnUrl) !== returnUrl) throw new ApiError("Billing service returned an unexpected Checkout return URL", 0, "invalid_response", "");
    if (!/^cs_(?:test|live)_[A-Za-z0-9_]{8,}$/.test(stringValue(result?.checkoutSessionId))) throw new ApiError("Billing service returned an invalid Checkout Session", 0, "invalid_response", "");
    if (stringValue(result?.checkoutUrl)) throw new ApiError("Billing service returned a hosted Checkout URL for an embedded flow", 0, "invalid_response", "");
  }

  async function openEmbeddedCheckout({ clientSecret, kind, mutationName, title, subtitle, summary, teamId = "" }) {
    await ensureStripe();
    if (!stripeClient || typeof stripeClient.initEmbeddedCheckout !== "function") throw new ApiError("Embedded Stripe Checkout is unavailable", 0, "not_configured", "");
    if (checkoutOpening) throw new ApiError("Embedded Checkout is already opening", 0, "already_opening", "");
    if (embeddedCheckout) closeEmbeddedCheckout();
    checkoutOpening = true;
    renderCreditPackControls();
    ui.checkoutTitle.textContent = title;
    ui.checkoutSubtitle.textContent = subtitle;
    ui.checkoutSummary.textContent = summary;
    ui.checkoutStatus.textContent = "Preparing encrypted payment fields…";
    ui.checkoutStatus.hidden = false;
    ui.checkoutMount.replaceChildren();
    // Embedded Checkout renders its own submit control, so the form's button stays
    // hidden; only the custom Payment Element (team subscription) uses it.
    if (ui.checkoutForm) ui.checkoutForm.hidden = false;
    if (ui.checkoutSubmit) ui.checkoutSubmit.hidden = true;
    if (!ui.checkoutDialog.open) ui.checkoutDialog.showModal();
    const safeSecret = validCheckoutClientSecret(clientSecret);
    if (!safeSecret) throw new ApiError("Embedded Checkout secret is invalid", 0, "invalid_response", "");
    try {
      embeddedCheckout = await stripeClient.initEmbeddedCheckout({
        fetchClientSecret: async () => safeSecret,
        onComplete: () => { void handleEmbeddedCheckoutComplete(kind, mutationName, teamId); }
      });
      embeddedCheckout.mount(ui.checkoutMount);
      ui.checkoutStatus.hidden = true;
    } catch (error) {
      embeddedCheckout = null;
      ui.checkoutStatus.textContent = "Stripe could not render the secure payment form. Close this panel and retry.";
      ui.checkoutStatus.hidden = false;
      throw error;
    } finally {
      checkoutOpening = false;
      renderCreditPackControls();
    }
  }

  function destroyEmbeddedCheckout() {
    if (embeddedCheckout) {
      try { embeddedCheckout.destroy(); } catch { /* Stripe may already have completed the frame */ }
    }
    embeddedCheckout = null;
    teamPaymentElements = null;
    checkoutTeamId = "";
    if (ui.checkoutForm) ui.checkoutForm.hidden = true;
    if (ui.checkoutError) setFieldError(ui.checkoutError, "");
    ui.checkoutMount.replaceChildren();
  }

  // The team subscription uses a custom Stripe Payment Element (card fields in
  // deep navy's own dark UI), styled to the brand with the Appearance API. The
  // browser confirms the invoice's confirmation secret; the signed webhook
  // provisions the pending team. This replaces Stripe's hosted embedded Checkout.
  function validPaymentClientSecret(value) {
    const secret = stringValue(value);
    if (secret.length < 16 || secret.length > 2048) return "";
    if (!/^(?:pi|seti)_[A-Za-z0-9]+_secret_/.test(secret)) return "";
    if (/[\s<>"'`\\]/.test(secret)) return "";
    return secret;
  }

  function teamCheckoutAppearance() {
    return {
      theme: "night",
      variables: {
        colorPrimary: "#5ef0a8",
        colorBackground: "#050a10",
        colorText: "#f4f7f5",
        colorTextSecondary: "#9aa6aa",
        colorDanger: "#ff6b6b",
        borderRadius: "8px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
        fontSizeBase: "15px",
        spacingUnit: "3px"
      },
      rules: {
        ".Input": { backgroundColor: "#02060b", border: "1px solid rgba(244,247,245,0.14)" },
        ".Input:focus": { border: "1px solid #5ef0a8", boxShadow: "none" },
        ".Label": { color: "#9aa6aa" },
        ".Tab": { border: "1px solid rgba(244,247,245,0.14)" },
        ".Tab--selected": { borderColor: "#5ef0a8" }
      }
    };
  }

  async function openTeamPaymentElement({ clientSecret, teamId, title, subtitle, summary, submitLabel }) {
    await ensureStripe();
    if (!stripeClient || typeof stripeClient.elements !== "function") throw new ApiError("Stripe Elements is unavailable", 0, "not_configured", "");
    const secret = validPaymentClientSecret(clientSecret);
    if (!secret) throw new ApiError("Billing service returned an invalid payment secret for the first team", 0, "invalid_response", "");
    if (checkoutOpening) throw new ApiError("Checkout is already opening", 0, "already_opening", "");
    destroyEmbeddedCheckout();
    checkoutOpening = true;
    // Baymard: keep the exact recurring total visible at the moment of payment —
    // the CTA itself carries the amount so the charge is never a surprise.
    checkoutSubmitLabel = stringValue(submitLabel) || "Start subscription";
    ui.checkoutTitle.textContent = title;
    ui.checkoutSubtitle.textContent = subtitle;
    ui.checkoutSummary.textContent = summary;
    ui.checkoutStatus.textContent = "Loading the secure card fields…";
    ui.checkoutStatus.hidden = false;
    ui.checkoutMount.replaceChildren();
    setFieldError(ui.checkoutError, "");
    ui.checkoutForm.hidden = false;
    ui.checkoutSubmit.hidden = false;
    ui.checkoutSubmit.disabled = true;
    ui.checkoutSubmit.textContent = checkoutSubmitLabel;
    checkoutTeamId = stringValue(teamId);
    if (!ui.checkoutDialog.open) ui.checkoutDialog.showModal();
    try {
      teamPaymentElements = stripeClient.elements({ clientSecret: secret, appearance: teamCheckoutAppearance() });
      const paymentElement = teamPaymentElements.create("payment", { layout: "tabs" });
      paymentElement.on("ready", () => { ui.checkoutStatus.hidden = true; ui.checkoutSubmit.disabled = false; });
      paymentElement.on("loaderror", () => {
        ui.checkoutStatus.textContent = "Stripe could not load the payment fields. Close this panel and retry.";
        ui.checkoutStatus.hidden = false;
      });
      paymentElement.mount(ui.checkoutMount);
    } catch (error) {
      teamPaymentElements = null;
      ui.checkoutStatus.textContent = "Stripe could not load the payment fields. Close this panel and retry.";
      ui.checkoutStatus.hidden = false;
      throw error;
    } finally {
      checkoutOpening = false;
    }
  }

  async function submitTeamPayment(event) {
    event.preventDefault();
    if (!teamPaymentElements || !stripeClient) return;
    const teamId = checkoutTeamId;
    ui.checkoutSubmit.disabled = true;
    ui.checkoutSubmit.textContent = "Processing…";
    setFieldError(ui.checkoutError, "");
    try {
      const outcome = await stripeClient.confirmPayment({
        elements: teamPaymentElements,
        confirmParams: { return_url: `${appUrl}?billing=return` },
        redirect: "if_required"
      });
      if (outcome?.error) {
        // Baymard: 10% of abandoners cite a declined card — recovery keeps the
        // dialog open with state preserved and names the alternatives.
        const declineReason = stringValue(outcome.error.message) || "Your card could not be charged.";
        setFieldError(ui.checkoutError, `${declineReason} Everything you entered is preserved — try again, use another card, or pay with Apple Pay or Google Pay.`);
        ui.checkoutSubmit.disabled = false;
        ui.checkoutSubmit.textContent = checkoutSubmitLabel;
        return;
      }
      // Payment confirmed without a redirect. The signed invoice.paid webhook
      // provisions the pending team; poll until it is active.
      ui.checkoutStatus.textContent = "Payment confirmed. Provisioning your team…";
      ui.checkoutStatus.hidden = false;
      closeEmbeddedCheckout();
      if (teamId) startPendingTeamPoll(teamId, 1500);
      toast("Payment confirmed. Your team is being provisioned.", "success");
    } catch {
      setFieldError(ui.checkoutError, "Payment could not be completed. Close this panel and try again.");
      ui.checkoutSubmit.disabled = false;
      ui.checkoutSubmit.textContent = checkoutSubmitLabel;
    }
  }

  function closeEmbeddedCheckout() {
    destroyEmbeddedCheckout();
    checkoutOpening = false;
    if (ui.checkoutDialog.open) ui.checkoutDialog.close();
    updateTeamAction();
    renderSettingsBilling();
    renderCreditPackControls();
  }

  async function handleEmbeddedCheckoutComplete(kind, mutationName, teamId) {
    destroyEmbeddedCheckout();
    mutationKeys.clear(mutationName);
    ui.checkoutStatus.textContent = "Payment submitted. Verifying Stripe’s signed webhook before changing access or credits…";
    ui.checkoutStatus.hidden = false;
    if (kind === "team") {
      // The first team's card is now saved; the pending team provisions only
      // after the signed Stripe webhook confirms payment. Poll GetTeam for it.
      const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (team) {
        team._pollingMessage = "Payment received. Waiting for the signed Stripe webhook to provision the team.";
        renderTeamList();
        if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      }
      startPendingTeamPoll(teamId, 1500);
      ui.checkoutStatus.textContent = "Payment submitted. This panel never grants access; the verified webhook provisions your team.";
      toast("Payment submitted. Your team provisions after the signed Stripe webhook confirms it.", "info");
      return;
    }
    try {
      if (teamId === session.selectedTeamId) await refreshSelectedTeam();
    } catch {
      /* The normal refresh controls remain available if reconciliation is delayed. */
    }
    ui.checkoutStatus.textContent = "Payment is processing. This panel never grants access or credits; the verified webhook does.";
    toast("Payment submitted. Webhook-confirmed credits will appear in the selected team ledger.", "info");
  }

  async function startCreditPackCheckout(event) {
    event.preventDefault();
    const team = selectedTeam();
    const pack = selectedCreditPack();
    const quantity = int64Value(ui.creditPackQuantity.value);
    const maximum = int64Value(pack?.maximumQuantity);
    setFieldError(ui.creditPackError, "");
    if (!session.subscriptionActive || !team || !pack || !activeCreditPack(pack) || quantity === null || maximum === null || quantity < 1n || quantity > maximum) {
      setFieldError(ui.creditPackError, "Choose an active team, a prepaid pack, and a valid quantity.");
      return;
    }
    await ensureStripe();
    if (!stripeClient) {
      setFieldError(ui.creditPackError, "Secure checkout is not configured in this deployment.");
      return;
    }
    ui.creditPackSubmit.disabled = true;
    const returnUrl = embeddedCheckoutReturnUrl();
    const fingerprint = `${session.organizationId}:${team.id}:${pack.id}:${quantity.toString()}`;
    try {
      const result = await apiRequest("credit_pack_checkout", {
        organizationId: session.organizationId,
        teamId: team.id,
        creditPackId: pack.id,
        quantity: quantity.toString(),
        returnUrl,
        idempotencyKey: mutationKeys.for("creditPackCheckout", fingerprint)
      });
      validateEmbeddedSession(result, returnUrl);
      await openEmbeddedCheckout({
        clientSecret: result.clientSecret,
        kind: "credit_pack",
        mutationName: "creditPackCheckout",
        teamId: team.id,
        title: "Add prepaid engineering credits",
        subtitle: `Raise ${stringValue(team.name) || "the selected team"}'s spending ceiling. The credits go to the organization's shared pool and any team can spend them.`,
        summary: `${quantity.toString()} × ${stringValue(pack.name) || formatCredits(pack.creditMicros)} · ${formatCanonicalMoney(pack.price)} each`
      });
    } catch (error) {
      const message = apiErrorMessage(error, "The API could not create a prepaid credit Checkout Session. No purchase was started.");
      setFieldError(ui.creditPackError, message);
      toast(message, "error");
      ui.creditPackSubmit.disabled = false;
    }
  }

  function validatedRedirect(value, requiredHosts) {
    try {
      const url = new URL(stringValue(value));
      if (url.protocol !== "https:" || url.username || url.password || url.hash) return "";
      const allowed = new Set(requiredHosts.map(stringValue).filter(Boolean));
      const hostAccepted = allowed.has(url.host);
      return hostAccepted ? url.toString() : "";
    } catch {
      return "";
    }
  }

  const REQUEST_TEAM_SETTLEMENT = Object.freeze({
    CHECKOUT_REQUIRED: "checkout_required",
    CHARGED_OFF_SESSION: "charged_off_session",
    AUTHENTICATION_REQUIRED: "authentication_required"
  });

  function requestTeamSettlement(value) {
    if (typeof value === "number") return ["unspecified", "checkout_required", "charged_off_session", "authentication_required"][value] || "unspecified";
    return stringValue(value).replace(/^REQUEST_TEAM_SETTLEMENT_/, "").toLowerCase();
  }

  // Creating a team is the paid action. RequestTeam captures the pending team and
  // returns how it is settled: the first team collects + saves a card via
  // embedded Checkout; subsequent teams charge the saved card off-session (or
  // require 3-D Secure). The team is provisioned only by the signed Stripe
  // webhook, so every path polls GetTeam until the pending team goes active.
  async function createTeam(event) {
    event.preventDefault();
    const form = new FormData(ui.teamForm);
    const name = stringValue(form.get("teamName"));
    const objective = stringValue(form.get("teamObjective")).slice(0, 2000);
    const engineerCount = normalizeEngineerCount(form.get("engineerCount"));
    // The team's own repository choice, sorted so the same set always
    // produces the same normalized request (and idempotency fingerprint)
    // regardless of checkbox order. The server revalidates every id against
    // the active installation; this list is never authorization.
    const repositoryIds = selectedRepositoryIdsFromForm().sort((left, right) => (BigInt(left) < BigInt(right) ? -1 : BigInt(left) > BigInt(right) ? 1 : 0));
    setFieldError(ui.teamError, "");
    setFieldError(ui.teamRepositoriesError, "");
    if (name.length < 2 || name.length > 80) {
      setFieldError(ui.teamError, "Enter a team name between 2 and 80 characters.");
      ui.teamInput.focus();
      return;
    }
    if (repositoryIds.length === 0) {
      setFieldError(ui.teamRepositoriesError, "Your team needs at least one repository.");
      ui.repositoryList.querySelector('input[name="githubRepositoryId"]')?.focus();
      return;
    }
    const missing = launchContract.missingTeamPrerequisites({
      githubInstalled: session.githubInstalled,
      repositoriesAvailable: session.repositoryServiceAvailable && session.repositories.length > 0
    });
    if (missing.length) {
      const message = `Complete ${missing.join(", ")} before team creation.`;
      setFieldError(ui.teamError, message);
      toast(message, "error");
      return;
    }
    ui.teamInput.disabled = true;
    ui.teamSubmit.disabled = true;
    ui.teamSubmit.dataset.busy = "1";
    ui.teamSubmit.textContent = savedCardChargeExpected() ? "Creating your team…" : "Opening secure payment…";
    try {
      const fingerprint = `${session.organizationId}:${name.toLowerCase()}:${engineerCount}:${repositoryIds.join(",")}:${objective}`;
      const result = await apiRequest("request_team", {
        organizationId: session.organizationId,
        name,
        idempotencyKey: mutationKeys.for("requestTeam", fingerprint),
        engineerCount,
        objective,
        repositoryIds
      });
      const pending = result.pendingTeam || result.pending_team;
      if (!pending?.id || stringValue(pending.organizationId) !== session.organizationId) {
        throw new ApiError("Team service did not return a pending team in the current organization scope", 0, "invalid_response", "");
      }
      const settlement = requestTeamSettlement(result.settlement);
      // Reflect the pending team immediately; the webhook provisions it.
      session.teamServiceAvailable = true;
      const existing = session.teams.find((team) => stringValue(team.id) === stringValue(pending.id));
      if (existing) Object.assign(existing, pending);
      else session.teams = [pending, ...session.teams];
      // The server validated exactly this set as the new team's own durable
      // selection; remember it so Settings and the header can speak for the
      // team without re-deriving from org-level state.
      session.teamRepositoryIds.set(stringValue(pending.id), sortedRepositoryIds(repositoryIds));
      renderTeamList();
      renderTeamSelector(pending.id);
      renderSettingsBilling();
      ui.teamForm.reset();
      renderTeamSetupPricing();

      const pricing = teamPricingFor(engineerCount);
      if (settlement === REQUEST_TEAM_SETTLEMENT.CHECKOUT_REQUIRED) {
        await ensureStripe();
        if (!stripeClient) throw new ApiError("Stripe is not configured for this deployment", 0, "not_configured", "");
        await openTeamPaymentElement({
          clientSecret: result.checkoutClientSecret || result.checkout_client_secret,
          teamId: stringValue(pending.id),
          title: "Start your team subscription",
          subtitle: `Enter your card to start the ${formatCents(pricing.totalCents)}/month team subscription. It is saved and reused for every additional team.`,
          summary: `${stringValue(pending.name) || name} · ${pricingBreakdown(pricing)} · No setup fees or hidden charges · Cancel any time from Settings`,
          submitLabel: `Start subscription — ${formatCents(pricing.totalCents)}/month`
        });
        toast(`Team “${stringValue(pending.name) || name}” is pending. Enter your card to provision it.`, "info");
      } else if (settlement === REQUEST_TEAM_SETTLEMENT.CHARGED_OFF_SESSION) {
        const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(pending.id));
        if (team) { team._pollingMessage = "Card on file charged. Waiting for the signed webhook to provision the team."; renderTeamList(); }
        startPendingTeamPoll(pending.id, 1500);
        toast(`The saved card was charged for “${stringValue(pending.name) || name}”. Provisioning starts after the signed webhook confirms payment.`, "success");
      } else if (settlement === REQUEST_TEAM_SETTLEMENT.AUTHENTICATION_REQUIRED) {
        const destination = validatedRedirect(result.authenticationUrl || result.authentication_url, ["invoice.stripe.com"]);
        if (!destination) throw new ApiError("Billing service returned an untrusted authentication URL", 0, "invalid_redirect", "");
        const opened = window.open(destination, "_blank", "noopener,noreferrer");
        const team = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(pending.id));
        if (team) { team._pollingMessage = "Authenticate the payment in the opened Stripe tab; the team provisions once it clears."; renderTeamList(); }
        startPendingTeamPoll(pending.id, 3000);
        toast(opened
          ? "Authenticate the payment in the new Stripe tab. The team provisions once the charge clears."
          : "Allow pop-ups, then reopen this action to authenticate the payment for this team.", "info");
      } else {
        throw new ApiError("Team service returned an unrecognized settlement for the requested team", 0, "invalid_response", "");
      }
      // Switch the live workspace to the pending team; a workspace load error
      // must not mask the successful team request.
      try { await refreshSelectedTeam(); } catch { /* workspace loads recover on their own */ }
    } catch (error) {
      const message = apiErrorMessage(error, "The team was not confirmed as requested. It is safe to retry; the request uses an idempotency key.");
      setFieldError(ui.teamError, message);
      toast(message, "error");
      if (error instanceof ApiError && ["failed_precondition", "resource_exhausted"].includes(error.code)) await refreshOnboarding();
    } finally {
      delete ui.teamSubmit.dataset.busy;
      updateTeamAction();
    }
  }

  function startPendingTeamPoll(teamId, delay = 2500) {
    const id = stringValue(teamId);
    if (!id || pendingTeamTimers.has(id)) return;
    const timer = window.setTimeout(() => pollPendingTeam(id), delay);
    pendingTeamTimers.set(id, timer);
  }

  function stopPendingTeamPolling() {
    pendingTeamTimers.forEach((timer) => window.clearTimeout(timer));
    pendingTeamTimers.clear();
  }

  async function pollPendingTeam(teamId) {
    pendingTeamTimers.delete(teamId);
    if (!session.accessToken) return;
    if (document.visibilityState === "hidden") { startPendingTeamPoll(teamId, 5000); return; }
    if (!session.organizationId) {
      // No organization selected locally — a session state, not a server
      // scope violation. Re-arm rather than dying on a scope check that can
      // only fail against "".
      startPendingTeamPoll(teamId, 8000);
      return;
    }
    try {
      const response = await apiRequest("team", { id: teamId });
      const team = response.team;
      if (!team || stringValue(team.id) !== stringValue(teamId) || stringValue(team.organizationId) !== session.organizationId) {
        throw new ApiError("The team service returned a resource outside the selected organization scope", 0, "invalid_response", "");
      }
      const target = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (!target) {
        // The roster no longer carries this team — a delete-terminal reload
        // emptied it while this tick was in flight. A poll tick must never
        // resurrect a team the authoritative list dropped; the list is truth.
        return;
      }
      Object.assign(target, team);
      target._pollingMessage = "";
      const lifecycle = lifecycleLabel(team.state);
      const provisioning = team.provisioning ? launchContract.provisioningPresentation(team.provisioning) : null;
      const removal = Boolean(team.provisioning) && launchContract.provisioningOperation(team.provisioning) === launchContract.PROVISIONING_OPERATION.DELETE;
      // A succeeded command only means "activated" when the command was a
      // provision/resume: a succeeded DELETE reaching this poll used to toast
      // "provisioned and billing is active" in the middle of the removal.
      const activated = !removal && lifecycle !== "deleting" && (lifecycle === "active" || provisioning?.state === launchContract.PROVISIONING_STATE.SUCCEEDED);
      const failed = !removal && (lifecycle === "failed" || Boolean(provisioning?.failed));
      // Advance the determinate wait bar on every poll tick while this team is
      // the selected one, so each real provisioning step banks visible progress.
      if (stringValue(teamId) === session.selectedTeamId) renderProvisioningProgress(team);
      renderTeamList();
      renderSettingsBilling();
      if (teamId === session.selectedTeamId) renderSelectedTeamSummary();
      if (activated) {
        mutationKeys.clear("requestTeam");
        toast(`Team “${stringValue(team.name) || "the team"}” is provisioned and billing is active.`, "success");
        await refreshOnboarding();
        return;
      }
      if (failed) {
        // Deletion was the only remedy this line ever named, and it is the
        // expensive one: the customer has paid, and `resume` re-drives the same
        // build on the team they already have. The row's own controls already
        // offer "Retry setup" for exactly this state, so the sentence now
        // points at the door that is there rather than at the one that costs.
        target._pollingMessage = "Setup stopped before it finished. This team is not running. Retry setup to run it again — deleting it is not required.";
        renderTeamList();
        return;
      }
      if (removal || lifecycle === "deleting") {
        // This team left "pending" into a deletion. The provisioning poll
        // owns removals (progress, terminal routing, not_found) — hand off
        // and stop pending polling instead of re-arming forever.
        startProvisioningPolling(team, 2500);
        return;
      }
      if (lifecycle === "pending" || lifecycle === "") {
        if (!stringValue(target._pollingMessage)) {
          target._pollingMessage = "Waiting for the signed Stripe webhook to confirm payment and provision the team.";
          renderTeamList();
        }
        startPendingTeamPoll(teamId, 5000);
      } else {
        // Left pending into another lifecycle (e.g. suspended); hand off to the
        // standard provisioning poll and stop pending polling.
        startProvisioningPolling(team);
      }
    } catch (error) {
      const stalled = session.teams.find((candidate) => stringValue(candidate.id) === stringValue(teamId));
      if (stalled) { stalled._pollingMessage = apiErrorMessage(error, "The team status is temporarily unavailable. Retrying."); renderTeamList(); }
      if (isRetryableApiError(error)) startPendingTeamPoll(teamId, 8000);
    }
  }

  // Every caller here already names a NOTICE_LEVELS level - "error", "success",
  // "info" - so the toast reads its tone out of the ladder instead of putting
  // the level name straight into an attribute and letting the stylesheet keep a
  // second, private opinion about which names are loud. Sticky comes from the
  // same row: a danger toast never expires, because a toast that vanishes
  // before it is read is worse than no toast at all.
  function toast(message, level) {
    const shape = noticeShape(level) || noticeShape("info");
    const copy = document.createElement("span");
    copy.className = "toast-message";
    copy.textContent = stringValue(message);
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "toast-dismiss";
    dismiss.textContent = "Dismiss";
    dismiss.addEventListener("click", () => { window.clearTimeout(toast.timer); ui.toast.hidden = true; });
    ui.toast.replaceChildren(copy, dismiss);
    ui.toast.dataset.tone = shape?.tone || "idle";
    ui.toast.hidden = false;
    window.clearTimeout(toast.timer);
    // A sticky level waits to be read, which only works because the toast now
    // carries its own way out; a sticky toast with no exit is a permanent
    // overlay, which is a different bug from the one being fixed.
    if (shape?.sticky) return;
    toast.timer = window.setTimeout(() => { ui.toast.hidden = true; }, 9000);
  }

  function setFieldError(element, message) {
    if (!element) return;
    element.textContent = stringValue(message);
    element.hidden = !element.textContent;
  }

  async function signOut() {
    // Order matters here: the local state teardown and the signed-out phase
    // land FIRST, the cosmetic view resets run best-effort in the middle, and
    // server-side revocation plus the redirect always run at the end. A render
    // error inside a reset used to throw out of this handler before
    // setAuthPhase/revocation/redirect — the button looked dead while the
    // in-memory token was already gone, a half-signed-out stranding no retry
    // could fix.
    const revokedToken = session.accessToken;
    session.accessToken = "";
    session.claims = {};
    session.user = null;
    session.organizationId = "";
    session.organizationName = "";
    session.members = [];
    session.selectedTeamId = "";
    session.teams = [];
    session.subscription = null;
    session.subscriptionActive = false;
    session.subscriptionManageable = false;
    session.creditPacks = [];
    session.creditControl = null;
    session.teamRepositoryIds.clear();
    session.objectivesByTeam.clear();
    session.objectiveListsByTeam.clear();
    setAuthPhase("signed_out");
    clearSignInTransaction();
    clearGitHubFlow();
    storageRemove(billingReturnStorageKey);
    // A previous sign-in failure may have armed the once-only homepage bounce
    // guard; a deliberate sign-out clears it so the signed-out landing can
    // bounce to the homepage (the only place with a sign-in button).
    try { window.sessionStorage.removeItem(signInBounceKey); } catch { /* storage unavailable */ }
    try {
      closeEmbeddedCheckout();
      stopProvisioningPolling();
      stopPendingTeamPolling();
      stopActivityStream();
      window.clearTimeout(teamsReloadRetryTimer);
      watchedRemovals.clear();
      resetInvoiceHistory("Sign in and select an organization to load verified billing records.", "Waiting");
      resetSubscriptionCapacity();
      renderSettingsAccount();
      renderSettingsBilling();
      renderRepositoryControl();
      resetApprovalView("Sign in and select a team to load pending decisions.", "Waiting");
      ui.contextOrganization.textContent = "Not selected";
      ui.contextRepositories.textContent = "Not loaded";
      ui.contextTeam.textContent = "Not selected";
      resetWorkspaceViews("Sign in and select a team to load its workspace.");
    } catch (error) {
      // Cosmetic teardown only — the redirect below repaints everything.
      console.error("deep-navy: sign-out view reset failed", error);
    }
    // Revoke the session server-side (best effort); a failure never blocks the
    // local sign-out or the redirect back into the app.
    if (revokedToken && platformApi) {
      const requestId = window.crypto.randomUUID ? window.crypto.randomUUID() : randomBase64Url(18);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        await platformApi.request("sign_out", {}, { accessToken: revokedToken, requestId, signal: controller.signal });
      } catch {
        /* Server-side revocation failure is non-fatal to local sign-out. */
      } finally {
        window.clearTimeout(timeout);
      }
    }
    window.location.assign(appPath);
  }

  if (ui.signIn) ui.signIn.addEventListener("click", () => beginSignIn());
  ui.retrySignIn.addEventListener("click", () => beginSignIn());
  ui.signOut.addEventListener("click", signOut);
  if (ui.organizationConnect) ui.organizationConnect.addEventListener("click", () => beginSignIn("installation"));
  ui.organizationBootstrapForm.addEventListener("submit", bootstrapOrganization);
  ui.organizationSelectForm.addEventListener("submit", selectOrganization);
  ui.profileRetry.addEventListener("click", initializeAuthenticatedSession);
  ui.githubAction.addEventListener("click", startGitHubInstallation);
  if (ui.repositoryRefresh) ui.repositoryRefresh.addEventListener("click", refreshRepositoryAccess);
  if (ui.conversationFormat) {
    ui.conversationFormat.addEventListener("click", () => {
      setConversationFormat(session.conversationFormat === "raw" ? "markdown" : "raw");
    });
  }
  if (ui.organizationSwitchInput) ui.organizationSwitchInput.addEventListener("change", switchOrganization);
  // The install flow is how a customer connects an organization deep navy has
  // never seen - GitHub asks which account to install on. Distinct from the
  // manage link beside the repository list, which only widens access within
  // the installation that already exists.
  if (ui.organizationConnectOther) ui.organizationConnectOther.addEventListener("click", startGitHubInstallation);
  // The picker can only offer what the customer has granted; when the grant is
  // one repository, a multi-select with one row reads as broken. Widening it
  // happens on GitHub, so the door is beside the list — and it is an ordinary
  // link (see renderRepositoryManageLinks), so these handlers only record that
  // the customer left. They must never preventDefault: the navigation IS the
  // affordance.
  if (ui.repositoryManageAccess) ui.repositoryManageAccess.addEventListener("click", markGitHubAccessDeparture);
  if (ui.settingsRepositoryManageAccess) ui.settingsRepositoryManageAccess.addEventListener("click", markGitHubAccessDeparture);
  if (ui.repositoryRefreshInline) ui.repositoryRefreshInline.addEventListener("click", refreshRepositoryAccess);
  if (ui.settingsRepositoryRefresh) ui.settingsRepositoryRefresh.addEventListener("click", refreshRepositoryAccess);
  // Touching the picker clears its "needs at least one" error the moment the
  // customer acts on it.
  ui.repositoryList.addEventListener("change", () => setFieldError(ui.teamRepositoriesError, ""));
  // The kit-grammar row state and the "N of M repositories" note follow the
  // checkboxes; a form reset (after a successful create) resyncs both by
  // re-rendering the picker from the held session state once the browser has
  // restored the defaults.
  ui.repositoryList.addEventListener("change", (event) => {
    const row = event.target instanceof Element ? event.target.closest(".repository-option") : null;
    const state = row?.querySelector("[data-repo-state]");
    if (state && event.target instanceof HTMLInputElement) {
      state.dataset.repoState = event.target.checked ? "on" : "off";
      state.textContent = event.target.checked ? "Included" : "Not included";
    }
    renderFirstrunRepositoryCount();
  });
  if (ui.teamForm) ui.teamForm.addEventListener("reset", () => {
    window.setTimeout(() => { if (session.repositoryServiceAvailable) renderRepositoryAccess(); }, 0);
  });
  ui.settingsBillingManage.addEventListener("click", manageBilling);
  ui.invoiceMore.addEventListener("click", loadMoreInvoices);
  ui.creditPackForm.addEventListener("submit", startCreditPackCheckout);
  ui.creditPackSelect.addEventListener("change", updateCreditPackSummary);
  ui.creditPackQuantity.addEventListener("input", updateCreditPackSummary);
  ui.creditControlForm.addEventListener("submit", saveCreditControl);
  if (ui.topUpForm) {
    ui.topUpForm.addEventListener("submit", saveCreditTopUp);
    // Any edit takes ownership of the fields, so a background repaint cannot
    // overwrite a half-typed threshold; the summary line and the consent block
    // follow every keystroke because both are claims about what saving will do.
    ui.topUpForm.addEventListener("input", () => {
      topUpFormDirty = true;
      if (session.creditTopUp) renderCreditTopUp();
    });
    ui.topUpForm.addEventListener("change", () => {
      topUpFormDirty = true;
      if (session.creditTopUp) renderCreditTopUp();
    });
  }
  ui.economicsGroup.addEventListener("change", selectEconomicsGroup);
  ui.creditHardLimitInput.addEventListener("input", updateCreditControlSummary);
  ui.creditCustomerPaused.addEventListener("change", updateCreditControlSummary);
  if (ui.checkoutForm) ui.checkoutForm.addEventListener("submit", submitTeamPayment);
  ui.checkoutClose.addEventListener("click", closeEmbeddedCheckout);
  ui.checkoutDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeEmbeddedCheckout();
  });
  ui.teamForm.addEventListener("submit", createTeam);
  if (ui.engineerInput) {
    ui.engineerInput.addEventListener("input", renderTeamSetupPricing);
    ui.engineerInput.addEventListener("change", () => { ui.engineerInput.value = String(normalizeEngineerCount(ui.engineerInput.value)); renderTeamSetupPricing(); });
  }
  if (ui.engineerDecrement) ui.engineerDecrement.addEventListener("click", () => stepEngineerInput(ui.engineerInput, -1, renderTeamSetupPricing));
  if (ui.engineerIncrement) ui.engineerIncrement.addEventListener("click", () => stepEngineerInput(ui.engineerInput, 1, renderTeamSetupPricing));
  if (ui.settingsEngineerInput) {
    ui.settingsEngineerInput.addEventListener("input", syncEngineerControl);
    ui.settingsEngineerInput.addEventListener("change", () => { ui.settingsEngineerInput.value = String(normalizeEngineerCount(ui.settingsEngineerInput.value)); syncEngineerControl(); });
  }
  if (ui.settingsEngineerDecrement) ui.settingsEngineerDecrement.addEventListener("click", () => stepEngineerInput(ui.settingsEngineerInput, -1, syncEngineerControl));
  if (ui.settingsEngineerIncrement) ui.settingsEngineerIncrement.addEventListener("click", () => stepEngineerInput(ui.settingsEngineerInput, 1, syncEngineerControl));
  if (ui.settingsEngineerApply) ui.settingsEngineerApply.addEventListener("click", applyEngineerCount);
  // Settings → Repositories: touching a checkbox clears the min-one error and
  // recomputes whether the selection differs from the team's current set.
  if (ui.settingsRepositoryList) ui.settingsRepositoryList.addEventListener("change", () => {
    setFieldError(ui.settingsRepositoriesError, "");
    syncRepositoryControl();
  });
  if (ui.settingsRepositoriesApply) ui.settingsRepositoriesApply.addEventListener("click", applyTeamRepositories);
  ui.teamList.addEventListener("click", handleTeamLifecycleClick);
  // Crew tiles are stamped per roster render; the door is delegated so it
  // survives every repaint. app-views.js switches the surface on this same
  // click; this handler decides WHICH agent the view shows.
  ui.agentList.addEventListener("click", openAgentFromCrew);
  // The rail shows the same roster, so it opens the same record through the
  // same handler. Two surfaces, one door.
  if (ui.railCrew) ui.railCrew.addEventListener("click", openAgentFromCrew);
  // The objectives view's doors follow the same split: app-views.js switches
  // the surface on the click, and this handler fans out the per-objective
  // proposal loads the view shows — once per team and generation.
  document.querySelectorAll('[data-view-link="objectives"]').forEach((link) => link.addEventListener("click", () => { ensureObjectivesViewWork(); }));
  if (ui.teamTiles) ui.teamTiles.addEventListener("click", openTeamFromTiles);
  // The teams surface loads its capped fan-out only while it is actually on
  // screen. The router stamps .is-active on the section; this observer is
  // the app's only read of that signal — the same one-way, DOM-mediated
  // coupling the router keeps with the roster's own signals.
  const dashboardSection = document.querySelector('.wview[data-view="dashboard"]');
  if (dashboardSection) {
    const armDashboard = () => {
      if (!dashboardSection.classList.contains("is-active")) return;
      ensureDashboardStats();
      renderDashboardCharts();
    };
    new MutationObserver(armDashboard).observe(dashboardSection, { attributes: true, attributeFilter: ["class"] });
    armDashboard();
  }
  // The objective form left the shell when the console became the only ask.
  // Its pipeline remains for programmatic flows, so the listeners are guarded
  // rather than deleted - and the guard is not optional: an unguarded
  // addEventListener on the removed form crashed the whole bootstrap at the
  // top level, freezing the app at "Checking environment configuration" with
  // sign-in dead. The third frozen-shell incident of this shape; the
  // bootstrap-guard test now pins listeners too.
  if (ui.objectiveForm) ui.objectiveForm.addEventListener("submit", createObjective);
  if (ui.objectiveDescriptionInput) ui.objectiveDescriptionInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && ui.objectiveSubmit && !ui.objectiveSubmit.disabled) {
      event.preventDefault();
      if (ui.objectiveForm) ui.objectiveForm.requestSubmit();
    }
  });
  ui.objectiveSelect.addEventListener("change", selectObjective);
  // The console: one thread, one input. Send is a form submit, ⌘/Ctrl+Enter
  // included, and a failed message's "Send again" lives on its own row.
  ui.conversationForm.addEventListener("submit", sendConversationMessage);
  ui.conversationInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !ui.conversationSubmit.disabled) {
      event.preventDefault();
      ui.conversationForm.requestSubmit();
    }
  });
  ui.conversationThread.addEventListener("click", retryConversationMessage);
  ui.conversationRetry.addEventListener("click", () => {
    const team = selectedTeam();
    if (team) startConversationStream(team.id, session.workspaceGeneration);
  });
  ui.approvalList.addEventListener("submit", decideApproval);
  // The console's sign-off card submits through the very same decide flow.
  if (ui.signoffList) ui.signoffList.addEventListener("submit", decideApproval);
  ui.approvalsMore.addEventListener("click", loadMoreApprovals);
  ui.sessionsMore.addEventListener("click", loadMoreSessions);
  ui.workspaceMore.addEventListener("click", loadMoreWorkspaceChanges);
  ui.deliveryRepository.addEventListener("change", reloadGitHubDelivery);
  ui.issuesMore.addEventListener("click", loadMoreGitHubIssues);
  ui.pullRequestsMore.addEventListener("click", loadMoreGitHubPullRequests);
  ui.refresh.addEventListener("click", refreshOnboarding);
  ui.teamSelect.addEventListener("change", () => {
    session.selectedTeamId = stringValue(ui.teamSelect.value);
    // A different team is a different roster; the open agent record cannot
    // survive the switch (app-views.js walks the view back to the floor).
    session.selectedAgentId = "";
    resetAgentDetailView("Choose a crew member on the floor to open their record.");
    refreshSelectedTeam();
  });
  // The filter chips live in two toolbars now — the floor's log and the
  // Activity screen — and the one door out of a filtered empty is a button
  // built after load. One delegated listener covers all three; the handler
  // already validates the chip against the category list, so nothing else
  // on the page can change the filter by accident.
  document.addEventListener("click", changeActivityFilter);
  const reconnectActivity = () => {
    const team = selectedTeam();
    if (team) {
      startActivityStream(team.id, session.workspaceGeneration);
      if (teamNeedsProvisioningStream(team)) startProvisioningStream(team.id, session.workspaceGeneration);
    }
  };
  ui.activityRetry.addEventListener("click", reconnectActivity);
  if (ui.activityScreenRetry) ui.activityScreenRetry.addEventListener("click", reconnectActivity);
  // The two histories page from the floor and from Runs. One loader each; the
  // Runs buttons derive their own hidden/disabled from the same cursors the
  // floor's do, so the two can never disagree about whether more exists.
  if (ui.runsSessionsMore) ui.runsSessionsMore.addEventListener("click", loadMoreSessions);
  if (ui.runsChangesMore) ui.runsChangesMore.addEventListener("click", loadMoreWorkspaceChanges);
  if (ui.billingPortal) ui.billingPortal.addEventListener("click", manageBilling);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    refreshRepositoryAccessAfterReturn();
    session.teams.forEach((team) => {
      if (lifecycleLabel(team.state) === "pending") startPendingTeamPoll(team.id, 250);
      else startProvisioningPolling(team, 250);
    });
  });
  // Opening GitHub in a second window leaves this tab visible the whole time,
  // so visibilitychange never fires and the list would stay stale. Focus is
  // the signal that covers it; the departure mark keeps both paths to one
  // refetch.
  window.addEventListener("focus", refreshRepositoryAccessAfterReturn);
  window.addEventListener("beforeunload", () => {
    destroyEmbeddedCheckout();
    stopProvisioningPolling();
    stopPendingTeamPolling();
    stopObjectiveDispatchPolling();
    stopActivityStream();
  });

  setAuthPhase("signed_out");
  renderProgressSummary();
  renderTeamSetupPricing();
  renderEngineerControl();
  renderRepositoryControl();
  renderRepositoryManageLinks();
  renderConfiguration();
  const initialQuery = typeof window.deepNavyInitialQuery === "string" ? window.deepNavyInitialQuery : window.location.search;
  try { delete window.deepNavyInitialQuery; } catch { window.deepNavyInitialQuery = ""; }
  const callbackParams = new URLSearchParams(initialQuery);
  // The homepage carries the only sign-in button, so arriving here with
  // ?signin=1 means the person has already clicked it. Go straight to GitHub
  // rather than showing a second login screen that asks them to click the same
  // button again. Anyone who lands here signed out without having asked to
  // sign in is sent back to the homepage, so there is no login page at all.
  const signInRequested = callbackParams.get("signin") === "1";
  // The callback page carries data-github-callback on EVERY load, so once its
  // one-time parameters have been stripped a reload was still treated as a
  // callback - with nothing to parse. That answered every reload with "sign-in
  // was not completed" and restarted the GitHub round trip, which came back to
  // the same bare URL: a loop with no way out but clearing site data. The page
  // exists only to receive a handoff, so with no handoff to receive there is
  // nothing to do here.
  const carriesCallback = callbackParams.has("code") || callbackParams.has("state")
    || callbackParams.has("installation_id") || callbackParams.has("setup_action");
  if (document.body.dataset.githubCallback === "true" && !carriesCallback) {
    window.location.replace(new URL("../../", window.location.href).toString());
    return;
  }
  const githubCallback = (document.body.dataset.githubCallback === "true" && carriesCallback)
    || callbackParams.has("installation_id") || callbackParams.has("setup_action");
  const billingReturn = captureBillingReturn(callbackParams);
  stripCallbackQuery();

  if (githubCallback) {
    // The GitHub App "install & authorize" round trip lands here. A "sign_in"
    // transaction (and no in-memory session yet) means this is a sign-in: bind
    // the one-time GitHub authorization to a platform session. Otherwise it is a
    // signed-in user's repository-management install completing the usual way.
    const signInTransaction = readSignInTransaction();
    try {
      if (!launchContract) throw new Error("launch_contract_unavailable");
      const callback = launchContract.parseGitHubCallback(callbackParams, { forceGitHub: document.body.dataset.githubCallback === "true" });
      if (!callback) throw new Error("github_callback_missing");
      if (signInTransaction && !session.accessToken) {
        completeSignInCallback(callback);
      } else if (captureGitHubCallback(callbackParams)) {
        setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub returned securely", "Sign in with GitHub to bind this one-time authorization to your account and organization.");
      } else {
        throw new Error("github_callback_missing");
      }
    } catch (error) {
      clearSignInTransaction();
      clearGitHubFlow();
      // GitHub's install/update screen redirects back WITHOUT the one-time
      // OAuth code when the App's "Request user authorization (OAuth) during
      // installation" is off. The remedy has always been one click on "Try
      // again", which just runs beginSignIn() - the plain authorize round trip
      // that does return a code. A remedy that deterministic is the machine's
      // job: restart sign-in automatically, rate-limited so a genuinely broken
      // configuration still surfaces as an error instead of a redirect loop.
      const codelessInstall = launchContract
        && error instanceof launchContract.LaunchContractError
        && error.code === "github_oauth_code_missing";
      if (codelessInstall && armSignInAutoRetry()) {
        setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "Finishing sign-in with GitHub", "GitHub sent you back before sign-in finished. Completing it now - no action needed.");
        restoreSession().then(() => {
          if (!session.accessToken) beginSignIn();
        }).catch(() => beginSignIn());
      } else {
        const message = launchContract && error instanceof launchContract.LaunchContractError
          ? error.message
          : "The GitHub callback could not be validated in this browser. Start sign-in again.";
        showAuthError("Sign-in was not completed", message);
      }
    }
  } else if (readGitHubCompletion()) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "success", "GitHub completion is waiting", "Sign in with GitHub again before the one-time authorization expires. deep navy verifies it server-side before showing a connection.");
  } else if (billingReturn) {
    setBanner(ui.authBanner, ui.authTitle, ui.authMessage, "warning", "Confirm your payment", "Sign in to refresh the webhook-confirmed subscription and team credit records. A Stripe return alone never changes access or balances.");
  } else if (signInRequested) {
    // Came from the homepage sign-in button. Restore first, in case a session
    // is already live and the round trip is unnecessary, then hand straight to
    // GitHub.
    restoreSession().then(() => {
      if (!session.accessToken) beginSignIn();
    }).catch(() => beginSignIn());
  } else {
    // Not a callback: this is an ordinary page load, so try to pick the session
    // back up. Skipped above because a callback is already establishing one.
    restoreSession().then(() => {
      // There is no login page. Someone who reaches the app signed out and
      // without having asked to sign in belongs on the homepage, where the
      // only sign-in button lives. The layout always stamps the attribute
      // (as the string "false" on ordinary pages — truthy!), so compare
      // against "true" exactly like the callback detection above does;
      // testing bare truthiness made this bounce unreachable and stranded
      // every signed-out visit on a dead "Taking you to GitHub…" card.
      if (!session.accessToken && document.body.dataset.githubCallback !== "true") {
        window.location.replace(new URL("../", window.location.href).toString());
      }
    }).catch(() => {});
  }
})();
