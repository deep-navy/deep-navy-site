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
  const teamCardTitle = document.querySelector("[data-team-card-title]");
  const teamInput = document.querySelector("[data-team-form] input");

  const VIEWS = ["overview", "activity", "economics", "approvals", "settings"];
  let currentView = "overview";
  let newTeamRequested = false;

  const isAuthenticated = () => authenticated && authenticated.hidden === false;
  const teamsExist = () => Boolean(teamsEmpty && teamsEmpty.hidden === true);

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
      if (firstrunTitle) firstrunTitle.textContent = another ? "Create another engineering team" : "Create your first engineering team";
      if (teamCardTitle) teamCardTitle.textContent = another ? "Name your new team" : "Name your team";
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
      const main = document.querySelector(".wsmain");
      if (main) main.scrollTop = 0;
    });
  });

  if (newTeamButton) {
    newTeamButton.addEventListener("click", () => {
      newTeamRequested = true;
      applyMode();
      if (teamInput && !teamInput.disabled) { teamInput.focus(); teamInput.select(); }
    });
  }
  if (cancelButton) {
    cancelButton.addEventListener("click", () => { newTeamRequested = false; applyMode(); });
  }

  // React to app.js's coarse signals. A team appearing, or checkout opening,
  // means the "New team" intent is satisfied — fall back to the workspace.
  const observer = new MutationObserver(() => {
    if (teamsExist() && newTeamRequested) newTeamRequested = false;
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
