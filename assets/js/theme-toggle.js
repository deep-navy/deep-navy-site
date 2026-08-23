/* Theme control.

   Three states, not two. A plain light/dark switch makes "follow my OS" a
   one-way door: once you touch it you can never get back, and on a product
   people leave open across a working day that is the state most of them
   actually want. So the control cycles system -> light -> dark -> system.

   "system" used to be represented by the ABSENCE of data-theme, leaning on the
   prefers-color-scheme query in tokens.css. It cannot be any more: the vendored
   design system the console is built from carries no media query at all — every
   dark value it has hangs off [data-theme="dark"] — so an absent attribute in a
   dark-preferring browser resolves tokens.css dark and ds.css light on the same
   page. So "system" now RESOLVES: the attribute is always present, and this file
   re-resolves it when the OS flips, which is what keeps "follow my OS" live
   without a reload. What is stored is still the three-state preference; what is
   stamped is always one of the two themes.

   The pre-paint reader for the stored value lives inline in head.html; this
   file only handles interaction, so a slow script load can never cause a
   flash of the wrong theme. */
(function () {
  "use strict";

  var STORAGE_KEY = "dn-theme";
  var ORDER = ["system", "light", "dark"];
  var LABELS = {
    system: "Theme: match system",
    light: "Theme: light",
    dark: "Theme: dark",
  };
  // Marks the icon; the glyph itself is drawn in CSS so no font or SVG
  // request is needed for a control that renders before anything else.
  var GLYPH = { system: "auto", light: "sun", dark: "moon" };

  function read() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === "light" || stored === "dark" ? stored : "system";
    } catch (e) {
      return "system";
    }
  }

  function write(state) {
    try {
      if (state === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, state);
    } catch (e) {
      /* Storage blocked: the theme still applies for this page view. */
    }
  }

  var osDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function resolve(state) {
    if (state === "light" || state === "dark") return state;
    return osDark && osDark.matches ? "dark" : "light";
  }

  function apply(state, buttons) {
    var root = document.documentElement;
    root.setAttribute("data-theme", resolve(state));

    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var label = LABELS[state];
      button.setAttribute("data-theme-state", state);
      button.setAttribute("title", label + " (click to change)");
      var icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.setAttribute("data-glyph", GLYPH[state]);
      var text = button.querySelector("[data-theme-label]");
      if (text) text.textContent = label;
    }
  }

  function init() {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) return;
    var state = read();
    apply(state, buttons);

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function () {
        state = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        write(state);
        apply(state, buttons);
      });
    }

    // The half of "follow my OS" that the pre-paint script cannot do: it runs
    // once, this listens. Only while the preference is actually "system" —
    // an explicit choice must not be overwritten by the OS changing.
    if (osDark && osDark.addEventListener) {
      osDark.addEventListener("change", function () {
        if (state === "system") apply(state, buttons);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
