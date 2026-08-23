/*
 * Workspace view router (progressive enhancement).
 *
 * app.js owns all data and toggles the coarse signals this router reads:
 *   [data-authenticated].hidden  — false once a session exists
 *   [data-teams-empty].hidden    — true once the org has at least one team
 *
 * From those, this router decides which of three surfaces to present and
 * switches the workspace between one view at a time, so the customer never
 * meets the old everything-at-once scroll:
 *   signedout  — app.js shows the sign-in card; nothing else
 *   firstrun   — one job: create a team (first team, or "New team")
 *   workspace  — the two-scope rail (or the tab bar) + a single active view
 *
 * It never reads or mutates app.js state, so it cannot break the RPC flow.
 * Everything it writes into the chrome — the rail's scope headings, the team
 * monogram, the breadcrumb, the three approval counts — is copied from
 * somewhere app.js already rendered. This file holds no data of its own, so
 * the chrome cannot name an organization or a team that no response confirmed.
 */
(function () {
  "use strict";
  const shell = document.querySelector("[data-shell]");
  if (!shell) return;

  const authenticated = document.querySelector("[data-authenticated]");
  const teamsEmpty = document.querySelector("[data-teams-empty]");
  const teamList = document.querySelector("[data-team-list]");
  const approvalList = document.querySelector("[data-approval-list]");
  // Three of these now: the rail's Decisions meta, the bell's badge and the
  // tab bar's badge. One number, written to every place that shows it, so a
  // count can never disagree with itself.
  const approvalsCounts = [...document.querySelectorAll("[data-approvals-count]")];
  const checkoutDialog = document.querySelector("[data-checkout-dialog]");
  const bell = document.querySelector(".dn-bell");
  const links = [...document.querySelectorAll("[data-view-link]")];
  // aria-current belongs to the navigation, not to every door. The crumb and
  // the bell are doors too; marking them "page" would announce two current
  // locations to a screen reader.
  const navLinks = links.filter((link) => link.closest("[data-view-nav]"));
  const views = [...document.querySelectorAll(".wview[data-view]")];
  const teamSelect = document.querySelector("[data-team-select]");
  const railOrganization = document.querySelector("[data-rail-organization]");
  const railTeamCount = document.querySelector("[data-rail-team-count]");
  const railTeamInitial = document.querySelector("[data-rail-team-initial]");
  const railTeamScope = document.querySelector("[data-rail-team-scope]");
  const contextOrganization = document.querySelector("[data-context-organization]");
  const crumbOrganization = document.querySelector("[data-crumb-organization]");
  const crumbTeamWrap = document.querySelector("[data-crumb-team-wrap]");
  const crumbTeam = document.querySelector("[data-crumb-team]");
  const crumbView = document.querySelector("[data-crumb-view]");
  const newTeamButton = document.querySelector("[data-new-team]");
  const cancelButton = document.querySelector("[data-firstrun-cancel]");
  const firstrunTitle = document.querySelector("[data-firstrun-title]");
  const firstrunEyebrow = document.querySelector("[data-firstrun-eyebrow]");
  const teamInput = document.querySelector('[data-team-form] input[name="teamName"]');

  // Two scopes, and the rail must not blur them.
  //
  // ORGANIZATION views are about the account and every team in it. "dashboard"
  // is the teams surface — the layer above the floor, and the landing view when
  // the workspace opens with more than one team; a single team still lands on
  // its own floor, because a dashboard of one tile would only be a door
  // standing in front of the room.
  const ORG_VIEWS = ["dashboard", "people", "billing"];
  // TEAM views are about the one team the switcher has selected — the six doors
  // under the switcher, in the order the rail shows them.
  const TEAM_VIEWS = ["overview", "activity", "runs", "economics", "approvals", "settings"];
  // Two more surfaces have no rail door of their own, and should not: their
  // doors are the records they belong to. "agent" opens from the crew tiles
  // app.js stamps after every roster response, plus the in-view way back;
  // "objectives" opens from the "On now" card, and app.js loads that view's
  // proposals on the same click this router switches the surface on. A rail
  // entry for either would be a door standing beside the room it opens onto.
  const INLINE_VIEWS = ["agent", "objectives"];
  const VIEWS = ORG_VIEWS.concat(TEAM_VIEWS, INLINE_VIEWS);
  // Which views the team crumb belongs on. Not the same list as TEAM_VIEWS: an
  // agent record and an objective record are inside the selected team too, they
  // simply have no rail entry. Only the organization scope is genuinely outside.
  const IN_TEAM = TEAM_VIEWS.concat(INLINE_VIEWS);
  let currentView = "overview";
  let newTeamRequested = false;
  let teamCountAtRequest = 0;
  let landedInWorkspace = false;

  // The page column scrolls, not the document: the rail and the top bar are
  // pinned, so a view switch has to reset the column the screens live in.
  // Below 900 that column is not the scroller (the tab bar is fixed and the
  // document scrolls instead), which is why both are reset.
  function scrollPageToTop() {
    const column = document.querySelector(".cs-scroll");
    if (column) column.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  const isAuthenticated = () => authenticated && authenticated.hidden === false;
  const teamsExist = () => Boolean(teamsEmpty && teamsEmpty.hidden === true);
  const teamCount = () => (teamList ? teamList.childElementCount : 0);

  function computeMode() {
    if (!isAuthenticated()) return "signedout";
    if (newTeamRequested || !teamsExist()) return "firstrun";
    return "workspace";
  }

  // The label the rail gives a view is the label the crumb gives it. Reading
  // it off the rail rather than keeping a second list here is what stops the
  // two from ever disagreeing — this router's whole contract is that the DOM
  // is the source of truth and it only observes.
  function labelFor(view) {
    const link = navLinks.find((el) => el.dataset.viewLink === view);
    const label = link ? link.querySelector(".dn-nav__label, .dn-tabbar__label") : null;
    if (label) return label.textContent.trim();
    // The two inline views have no rail entry to read a label off, so the crumb
    // takes the screen's own heading — which is the same words a reader has in
    // front of them. Without this the trail ended in a bare separator.
    const section = views.find((el) => el.dataset.view === view);
    const heading = section ? section.querySelector("h1, h2") : null;
    return heading ? heading.textContent.trim() : "";
  }

  function selectedTeamName() {
    if (!teamSelect || teamSelect.selectedIndex < 0) return "";
    const option = teamSelect.options[teamSelect.selectedIndex];
    return option && option.value ? option.textContent.trim() : "";
  }

  // Where you are, in the two scopes the rail is divided into. Everything here
  // is mirrored from somewhere app.js already wrote, so the chrome cannot claim
  // an organization or a team that no response confirmed.
  function refreshScope() {
    const organization = contextOrganization ? contextOrganization.textContent.trim() : "";
    const named = organization && organization !== "—" ? organization : "Your organization";
    if (railOrganization) railOrganization.textContent = named;
    if (crumbOrganization) crumbOrganization.textContent = named;

    const team = selectedTeamName();
    if (railTeamScope) railTeamScope.textContent = team ? team : "This team";
    if (railTeamInitial) railTeamInitial.textContent = team ? team.slice(0, 1).toUpperCase() : "—";
    if (crumbTeam) crumbTeam.textContent = team ? team : "This team";
    if (crumbTeamWrap) crumbTeamWrap.hidden = !IN_TEAM.includes(currentView);

    if (railTeamCount) {
      const n = teamCount();
      railTeamCount.textContent = String(n);
      railTeamCount.hidden = n === 0;
    }
  }

  function setView(view) {
    if (!VIEWS.includes(view)) view = "overview";
    currentView = view;
    views.forEach((section) => section.classList.toggle("is-active", section.dataset.view === view));
    // The design system reads aria-current="page", not "true": that is the
    // value CSS keys the rail's active plate and its 2px edge marker on.
    navLinks.forEach((link) => {
      if (link.dataset.viewLink === view) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (crumbView) crumbView.textContent = labelFor(view);
    refreshScope();
  }

  function applyMode() {
    const mode = computeMode();
    shell.dataset.shellMode = mode;
    if (mode === "firstrun") {
      const another = teamsExist();
      if (firstrunEyebrow) firstrunEyebrow.textContent = another ? "New team" : "Get started";
      if (firstrunTitle) firstrunTitle.textContent = another ? "Name your new team" : "Name your team";
      if (cancelButton) cancelButton.hidden = !another;
    } else if (mode === "workspace") {
      // The landing decision, made once per session: several teams land on
      // the teams surface, one team lands on its floor. Latched so a later
      // roster change never yanks the customer off whatever they are reading.
      if (!landedInWorkspace) {
        landedInWorkspace = true;
        if (teamCount() > 1) currentView = "dashboard";
      }
      setView(currentView);
    }
  }

  function refreshApprovalsCount() {
    if (!approvalList || !approvalsCounts.length) return;
    const n = approvalList.querySelectorAll(":scope > li").length;
    approvalsCounts.forEach((slot) => {
      slot.textContent = String(n);
      slot.hidden = n === 0;
    });
    // The bell's sonar ring means "someone is waiting on you". With an empty
    // queue it would be a pulse announcing nothing, so the state travels with
    // the number rather than being set once at render.
    if (bell) bell.classList.toggle("dn-bell--urgent", n > 0);
  }

  // Every door → switch the active view (no scroll, no hash change). "Every
  // door" is wider than the rail: the crumb, the bell and the placeholder
  // screens' own way-out buttons all carry data-view-link, and all of them
  // should navigate. Only the ones inside a [data-view-nav] get aria-current.
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!link.dataset.viewLink) return;
      event.preventDefault();
      setView(link.dataset.viewLink);
      if (shell.dataset.shellMode !== "workspace") { newTeamRequested = false; applyMode(); }
      scrollPageToTop();
    });
  });

  // The crew tiles are rendered by app.js after every roster response, so
  // the agent door is delegated: any click landing inside a tile that carries
  // data-agent-open switches to the agent view. app.js reads the same dataset
  // on the same click to decide WHICH agent the view shows; this router only
  // decides which surface is on screen - the separation both files keep.
  const agentList = document.querySelector("[data-agent-list]");
  if (agentList) {
    agentList.addEventListener("click", (event) => {
      const tile = event.target instanceof Element ? event.target.closest("[data-agent-open]") : null;
      if (!tile) return;
      setView("agent");
      scrollPageToTop();
    });
  }

  // The team tiles are rendered by app.js from the server-confirmed roster,
  // so their doors are delegated the same way the crew tiles' are: a click
  // landing inside a tile that carries data-team-open walks to that team's
  // floor. app.js reads the same dataset on the same click to decide WHICH
  // team the workspace selects; this router only decides which surface is on
  // screen — the separation both files keep.
  const teamTiles = document.querySelector("[data-team-tiles]");
  if (teamTiles) {
    teamTiles.addEventListener("click", (event) => {
      const tile = event.target instanceof Element ? event.target.closest("[data-team-open]") : null;
      if (!tile) return;
      setView("overview");
      scrollPageToTop();
    });
  }

  // A different team is a different roster, so an open agent record would be
  // another team's person. Go back to the floor; app.js clears the id. The
  // switcher's monogram and the team crumb follow the same change.
  if (teamSelect) {
    teamSelect.addEventListener("change", () => {
      if (currentView === "agent") setView("overview");
      else refreshScope();
    });
  }

  if (newTeamButton) {
    newTeamButton.addEventListener("click", () => {
      newTeamRequested = true;
      teamCountAtRequest = teamCount();
      applyMode();
      if (teamInput && !teamInput.disabled) { teamInput.focus(); teamInput.select(); }
    });
  }
  if (cancelButton) {
    cancelButton.addEventListener("click", () => { newTeamRequested = false; applyMode(); });
  }

  // React to app.js's coarse signals. Only drop the "New team" intent once a
  // genuinely new team appears (team count grows past what it was when the
  // button was tapped) — NOT merely because teams already exist, which would
  // snap the create screen back to the workspace on every background re-render.
  const observer = new MutationObserver(() => {
    if (newTeamRequested && teamCount() > teamCountAtRequest) newTeamRequested = false;
    applyMode();
    refreshApprovalsCount();
    refreshScope();
  });
  if (authenticated) observer.observe(authenticated, { attributes: true, attributeFilter: ["hidden"] });
  if (teamsEmpty) observer.observe(teamsEmpty, { attributes: true, attributeFilter: ["hidden"] });
  if (teamList) observer.observe(teamList, { childList: true, attributes: true, attributeFilter: ["hidden"] });
  if (approvalList) observer.observe(approvalList, { childList: true });
  // The rail's two scope headings and the crumb are mirrors of what app.js has
  // already written: the organization name it confirmed, and the options it put
  // in the switcher. Watching them is what keeps the mirror from going stale
  // without this file ever holding an opinion about either.
  if (contextOrganization) observer.observe(contextOrganization, { childList: true, characterData: true, subtree: true });
  if (teamSelect) observer.observe(teamSelect, { childList: true, subtree: true });
  if (checkoutDialog) {
    observer.observe(checkoutDialog, { attributes: true, attributeFilter: ["open"] });
    checkoutDialog.addEventListener("close", () => { newTeamRequested = false; applyMode(); });
  }

  setView("overview");
  applyMode();
  refreshApprovalsCount();
})();
