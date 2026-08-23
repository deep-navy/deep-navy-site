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
 *   workspace  — sidebar + a single active view
 *
 * It never reads or mutates app.js state, so it cannot break the RPC flow.
 */
(function () {
  "use strict";
  const shell = document.querySelector("[data-shell]");
  if (!shell) return;

  const authenticated = document.querySelector("[data-authenticated]");
  const teamsEmpty = document.querySelector("[data-teams-empty]");
  const teamList = document.querySelector("[data-team-list]");
  const approvalList = document.querySelector("[data-approval-list]");
  const approvalsCount = document.querySelector("[data-approvals-count]");
  const checkoutDialog = document.querySelector("[data-checkout-dialog]");
  const links = [...document.querySelectorAll("[data-view-link]")];
  const views = [...document.querySelectorAll(".wview[data-view]")];
  const newTeamButton = document.querySelector("[data-new-team]");
  const cancelButton = document.querySelector("[data-firstrun-cancel]");
  const firstrunTitle = document.querySelector("[data-firstrun-title]");
  const firstrunEyebrow = document.querySelector("[data-firstrun-eyebrow]");
  const teamInput = document.querySelector('[data-team-form] input[name="teamName"]');

  // "agent" has no sidebar link of its own: its doors are the crew tiles
  // app.js stamps after every roster response, plus the in-view way back.
  const VIEWS = ["overview", "activity", "economics", "approvals", "settings", "agent"];
  let currentView = "overview";
  let newTeamRequested = false;
  let teamCountAtRequest = 0;

  const isAuthenticated = () => authenticated && authenticated.hidden === false;
  const teamsExist = () => Boolean(teamsEmpty && teamsEmpty.hidden === true);
  const teamCount = () => (teamList ? teamList.childElementCount : 0);

  function computeMode() {
    if (!isAuthenticated()) return "signedout";
    if (newTeamRequested || !teamsExist()) return "firstrun";
    return "workspace";
  }

  function setView(view) {
    if (!VIEWS.includes(view)) view = "overview";
    currentView = view;
    views.forEach((section) => section.classList.toggle("is-active", section.dataset.view === view));
    links.forEach((link) => {
      const on = link.dataset.viewLink === view;
      link.setAttribute("aria-current", on ? "true" : "false");
    });
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
      setView(currentView);
    }
  }

  function refreshApprovalsCount() {
    if (!approvalsCount || !approvalList) return;
    const n = approvalList.querySelectorAll(":scope > li").length;
    approvalsCount.textContent = String(n);
    approvalsCount.hidden = n === 0;
  }

  // Sidebar navigation → switch the active view (no scroll, no hash change).
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!link.dataset.viewLink) return;
      event.preventDefault();
      setView(link.dataset.viewLink);
      if (shell.dataset.shellMode !== "workspace") { newTeamRequested = false; applyMode(); }
      // A view link inside the "…" overflow menu closes it on selection;
      // <details> keeps itself open otherwise.
      const menu = link.closest("details.wsmenu");
      if (menu) menu.removeAttribute("open");
      const main = document.querySelector(".wsmain");
      if (main) main.scrollTop = 0;
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
      const main = document.querySelector(".wsmain");
      if (main) main.scrollTop = 0;
    });
  }

  // A different team is a different roster, so an open agent record would be
  // another team's person. Go back to the floor; app.js clears the id.
  const teamSelect = document.querySelector("[data-team-select]");
  if (teamSelect) {
    teamSelect.addEventListener("change", () => {
      if (currentView === "agent") setView("overview");
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
  });
  if (authenticated) observer.observe(authenticated, { attributes: true, attributeFilter: ["hidden"] });
  if (teamsEmpty) observer.observe(teamsEmpty, { attributes: true, attributeFilter: ["hidden"] });
  if (teamList) observer.observe(teamList, { childList: true, attributes: true, attributeFilter: ["hidden"] });
  if (approvalList) observer.observe(approvalList, { childList: true });
  if (checkoutDialog) {
    observer.observe(checkoutDialog, { attributes: true, attributeFilter: ["open"] });
    checkoutDialog.addEventListener("close", () => { newTeamRequested = false; applyMode(); });
  }

  setView("overview");
  applyMode();
  refreshApprovalsCount();
})();
