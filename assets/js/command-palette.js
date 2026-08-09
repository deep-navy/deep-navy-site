/* Command palette.

   The navigation rail is for people who have not learned the product yet.
   Anyone who uses it daily should never have to move their hand to the mouse
   to change view, switch team, or start work, and the palette is how a dense
   tool stays dense without becoming a maze: one keystroke reaches everything,
   so the visible chrome can stay small.

   Deliberately dependency-free and self-hosted: the app shell ships
   script-src 'self', and a palette that fails to load would take the fastest
   path through the product with it. It degrades to nothing — every action
   here is also reachable by clicking.
*/
(() => {
  "use strict";

  const root = document.querySelector("[data-command-palette]");
  if (!root) return;
  const input = root.querySelector("[data-command-input]");
  const list = root.querySelector("[data-command-list]");
  const empty = root.querySelector("[data-command-empty]");
  if (!input || !list || !empty) return;

  let commands = [];
  let matches = [];
  let active = 0;
  let restoreFocusTo = null;

  // Subsequence match, the way a terminal completes: "apr" finds "Approvals",
  // "ntm" finds "New team". Scored so that earlier and tighter matches win,
  // which is what makes two or three characters enough.
  function score(haystack, needle) {
    if (!needle) return 0;
    const text = haystack.toLowerCase();
    let index = 0;
    let value = 0;
    let previous = -1;
    for (const character of needle.toLowerCase()) {
      index = text.indexOf(character, index);
      if (index === -1) return -1;
      value += index === previous + 1 ? 3 : 1;          // adjacent beats scattered
      if (index === 0 || text[index - 1] === " ") value += 4;  // word starts count
      previous = index;
      index += 1;
    }
    return value - text.length * 0.01;                   // shorter beats longer
  }

  // The same destination is often reachable from several elements — a nav link
  // and an inline link to the same view — and nav links carry a pending count
  // inside them, which would otherwise become part of the name ("Approvals0").
  function labelOf(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".wsnav-count, [data-activity-filter-count]").forEach((node) => node.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function collect() {
    const found = [];
    const seen = new Set();
    const add = (element, hint) => {
      const label = labelOf(element);
      const key = label.toLowerCase();
      if (!label || seen.has(key)) return;
      seen.add(key);
      found.push({ label, hint, run: () => element.click() });
    };
    document.querySelectorAll(".wsnav-link").forEach((element) => add(element, "Go to"));
    document.querySelectorAll("[data-view-link]").forEach((element) => add(element, "Go to"));
    const objective = document.querySelector("#objective-description");
    if (objective && !objective.disabled) {
      if (!seen.has("describe what you want built")) found.push({ label: "Describe what you want built", hint: "Write", run: () => objective.focus() });
    }
    const newTeam = document.querySelector(".wsnav-new");
    if (newTeam) found.push({ label: "New team", hint: "Create", run: () => newTeam.click() });
    const signOut = document.querySelector("[data-sign-out]");
    if (signOut) found.push({ label: "Sign out", hint: "Account", run: () => signOut.click() });
    return found;
  }

  function render() {
    list.replaceChildren();
    matches.forEach((command, index) => {
      const item = document.createElement("li");
      item.className = index === active ? "cmd-item is-active" : "cmd-item";
      item.id = `cmd-${index.toString()}`;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(index === active));
      const label = document.createElement("span");
      label.textContent = command.label;
      const hint = document.createElement("span");
      hint.className = "cmd-hint";
      hint.textContent = command.hint;
      item.append(label, hint);
      item.addEventListener("mousemove", () => { active = index; render(); });
      item.addEventListener("click", () => run(index));
      list.append(item);
    });
    empty.hidden = matches.length > 0;
    input.setAttribute("aria-activedescendant", matches.length ? `cmd-${active.toString()}` : "");
  }

  function filter() {
    const query = input.value.trim();
    matches = query
      ? commands.map((command) => ({ command, value: score(command.label, query) }))
          .filter((entry) => entry.value >= 0)
          .sort((a, b) => b.value - a.value)
          .map((entry) => entry.command)
      : commands.slice();
    active = 0;
    render();
  }

  function open() {
    if (!root.hidden) return;
    restoreFocusTo = document.activeElement;
    commands = collect();
    input.value = "";
    root.hidden = false;
    filter();
    input.focus();
  }

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    // Return the person to where they were. Losing your place is the cost of
    // a shortcut that is otherwise free.
    if (restoreFocusTo && document.contains(restoreFocusTo)) restoreFocusTo.focus();
    restoreFocusTo = null;
  }

  function run(index) {
    const command = matches[index];
    close();
    if (command) command.run();
  }

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      root.hidden ? open() : close();
      return;
    }
    if (root.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key === "ArrowDown" || (event.ctrlKey && event.key.toLowerCase() === "n")) {
      event.preventDefault(); active = matches.length ? (active + 1) % matches.length : 0; render(); return;
    }
    if (event.key === "ArrowUp" || (event.ctrlKey && event.key.toLowerCase() === "p")) {
      event.preventDefault(); active = matches.length ? (active - 1 + matches.length) % matches.length : 0; render(); return;
    }
    if (event.key === "Enter") { event.preventDefault(); run(active); }
  });

  input.addEventListener("input", filter);
  // Clicking the backdrop is the same as pressing escape.
  root.addEventListener("mousedown", (event) => { if (event.target === root) close(); });
})();
