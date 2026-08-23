// Which motion a glyph gets, and who gets to decide.
//
// The design system's rule is one sentence: "Every icon animates — there are no still
// icons in this system." It backs that with a resolver, not a table of decisions — any
// of Lucide's 1,600 names falls through ordered patterns to one of seven families, so a
// glyph that arrives tomorrow animates without anyone remembering to classify it.
//
// ICON_MOTION, ICON_MOTION_RULES, ICON_ALIASES and resolveMotion below are lifted
// verbatim from components/core/Icon.jsx. The React component itself is not portable —
// it fetches each glyph from a CDN this site's CSP forbids — but this half is pure data
// and pure logic, and it ports exactly. Same shape as notice-levels.js, and for the same
// reason: the table is where the decision lives, and a second table with its own opinion
// is how two surfaces in one product end up disagreeing.
//
// What this site adds is one translation. The system names glyphs the way Lucide does
// and inlines them; this site draws them from an inline sprite whose ids are #i-<name>,
// and those names do not all match Lucide's — some are Phosphor's, some are this site's
// own shorthand, and the rail's are named for the door rather than the drawing.
// SPRITE_TO_LUCIDE is that translation, and it is the only place it exists.
((root, factory) => {
  "use strict";

  const iconMotion = factory();
  if (typeof module === "object" && module.exports) module.exports = iconMotion;
  if (root) root.deepNavyIconMotion = iconMotion;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  /* ── The design system's own table, verbatim ─────────────────────────── */

  // Default motion per glyph, following pqoqubbw/icons (lucide-animated.com) where that pack
  // makes a specific choice. Anything not listed falls through to ICON_MOTION_RULES below, so
  // EVERY glyph in the system animates — there is no such thing as a still icon here.
  const ICON_MOTION = {
    activity: "draw", radio: "draw", check: "draw", "circle-check-big": "draw", "circle-check": "draw",
    "shield-check": "draw", "file-text": "draw", "clipboard-list": "draw", target: "draw", signature: "draw",
    "git-pull-request": "draw", "git-merge": "draw", "git-branch": "draw", "git-pull-request-arrow": "draw",
    "git-pull-request-closed": "draw", "circle-dot": "draw", "pen-tool": "draw", terminal: "draw", network: "draw",
    "refresh-cw": "spin", "rotate-cw": "spin", loader: "spin", settings: "spin", "loader-circle": "spin",
    bell: "ring",
    search: "hop",
    "arrow-right": "nudge", "arrow-up-right": "nudge", "chevron-right": "nudge", "corner-down-left": "nudge",
    "corner-down-right": "nudge", "external-link": "nudge", "arrow-left": "nudge", "log-out": "nudge",
    users: "pop", user: "pop", plus: "pop", "message-square": "pop", github: "pop", compass: "pop",
    play: "pop", pause: "pop", "layout-dashboard": "pop",
    "triangle-alert": "jitter", "octagon-alert": "jitter", "circle-alert": "jitter", x: "jitter", trash: "jitter",
    // A bell that is off must not ring: the /bell/ rule below would give it the ring motion.
    "bell-off": "pop", lightbulb: "pop"
  };

  // Ordered fallbacks. First match wins; the last rule is a catch-all, so resolveMotion()
  // always returns a motion. Extend the list rather than special-casing at call sites.
  const ICON_MOTION_RULES = [
    [/(^|-)(check|circle-check|badge-check)/, "draw"],
    [/(^|-)(arrow|chevron|corner|move|redo|undo|share|send|log-in|log-out|external-link|skip)/, "nudge"],
    [/(alert|octagon|ban|bug|trash|shield-off|wifi-off|unlink|x$|^x-|-x$)/, "jitter"],
    [/(loader|refresh|rotate|settings|cog|recycle|orbit|sun|repeat|shuffle)/, "spin"],
    [/(bell|alarm|megaphone|volume|siren|music|radio)/, "ring"],
    [/(search|zoom|filter|scan|telescope|binoculars)/, "hop"],
    [/(^git-|^circle-dot|^file|^clipboard|^pen|^edit|^square-pen|terminal|activity|target|network|route|waypoints|signature|highlighter|pencil|link|chart|gauge|trending)/, "draw"],
    [/./, "pop"]
  ];

  // Lucide renames glyphs between versions and serves a 404 for the old name. Without this
  // map a rename blanks every icon using it, silently — which is exactly what `filter`,
  // `more-horizontal` and `more-vertical` did after 0.487.0. Add a line here on each bump
  // rather than hunting call sites.
  const ICON_ALIASES = {
    filter: "funnel",
    // Lucide 0.4xx moved the shape suffix to the front. Both spellings are in the wild in
    // consuming code, so accept the old ones rather than rendering a missing-glyph box.
    "x-circle": "circle-x",
    "x-octagon": "octagon-x",
    "alert-triangle": "triangle-alert",
    "alert-circle": "circle-alert",
    "alert-octagon": "octagon-alert",
    "check-circle": "circle-check",
    "more-horizontal": "ellipsis",
    "more-vertical": "ellipsis-vertical"
  };

  /** Resolve any Lucide name to a motion. Always returns one — no glyph is ever still. */
  function resolveMotion(name) {
    if (name in ICON_MOTION) return ICON_MOTION[name];
    for (const [re, m] of ICON_MOTION_RULES) if (re.test(name)) return m;
    return "pop";
  }

  /* ── This site's sprite, translated ──────────────────────────────────── */

  // Sprite id (without the #i- prefix) -> the Lucide name that names the same drawing.
  // Only the ones that differ are listed; anything absent is already a Lucide name and
  // goes to resolveMotion() unchanged, which is what keeps a new glyph zero-configuration.
  //
  // Three kinds of entry, and each is a deliberate choice about what the drawing IS:
  //
  //   Phosphor leftovers. The sprite predates the decision to stand on Lucide and still
  //   carries Phosphor artwork under Phosphor names. Named for the Lucide glyph that is
  //   the same drawing, so the family follows the drawing rather than the spelling.
  //
  //   This site's shorthand. `doc` and `refresh` are ours; they mean file-text and
  //   refresh-cw.
  //
  //   The rail. Its ids are named for the door — nav-runs, nav-decisions — because the
  //   label is what changes least. The motion has to follow the DRAWING, so each is named
  //   here for the Lucide glyph it actually depicts, which is why nav-economics is a gauge
  //   and nav-teams is users. Rename a door and this map is the one line that moves.
  const SPRITE_TO_LUCIDE = {
    // Phosphor names for Lucide drawings.
    "caret-down": "chevron-down",
    "chat-circle-dots": "message-square",
    "check-circle": "circle-check",
    "clipboard-text": "clipboard-list",
    "currency-dollar": "dollar-sign",
    "github-logo": "github",
    lightning: "zap",
    "pencil-simple": "pencil",
    "users-three": "users",
    warning: "triangle-alert",
    // This site's own shorthand.
    doc: "file-text",
    refresh: "refresh-cw",
    // The rail, named for the drawing rather than the door.
    "nav-activity": "activity",
    "nav-billing": "credit-card",
    "nav-dashboard": "layout-dashboard",
    // The squiggle over a baseline is Lucide's signature glyph, and a signature is
    // exactly what a decision screen is for. It draws itself in, which is the point.
    "nav-decisions": "signature",
    "nav-economics": "gauge",
    "nav-people": "users",
    "nav-runs": "square-terminal",
    // Two horizontal sliders — Lucide calls that settings-2, and it spins with the rest
    // of the settings family rather than being singled out as the one still icon.
    "nav-settings": "settings-2",
    "nav-teams": "users"
  };

  // Glyphs with no Lucide equivalent at all would go here with a note. There are none
  // today: every id in _includes/icons.svg is either a Lucide name or maps to one above.
  // A sprite id that is neither still animates — resolveMotion's last rule is a catch-all
  // and returns `pop`, which is the system's answer for "a glyph, with nothing special
  // to say about how it moves".

  const FAMILIES = ["draw", "spin", "ring", "hop", "nudge", "pop", "jitter"];

  // draw is a stroke animation: it runs stroke-dashoffset from the full path length to
  // zero. On a glyph the sprite draws as a filled shape with no stroke there is nothing
  // for it to run along, and it would render as a 60ms opacity flicker and then nothing —
  // a family that silently does not work, which is worse than a family that is not there.
  // Those glyphs take the catch-all transform family instead, which works on any artwork.
  const DRAW_FALLBACK = "pop";

  /** Sprite id (with or without the #i- prefix) -> motion family. Always returns one. */
  function motionFor(spriteName) {
    const bare = String(spriteName || "").replace(/^#?i-/, "");
    if (!bare) return DRAW_FALLBACK;
    const lucide = SPRITE_TO_LUCIDE[bare] || ICON_ALIASES[bare] || bare;
    return resolveMotion(lucide);
  }

  /** The class the stylesheet reads. */
  function motionClass(spriteName) {
    return "dn-icon--" + motionFor(spriteName);
  }

  /* ── Applying it to markup nobody wrote in JavaScript ────────────────── */

  // The console's shell and the marketing page carry their icons as static markup, so
  // there is no render call to hang a class on. This walks them once at startup and
  // classifies each from its own href — the same derivation the JavaScript-built icons
  // use, so the two can never drift into disagreeing about what a bell does.
  //
  // Nothing here writes markup: classList and setAttribute only. innerHTML is banned.
  function applyIconMotion(root, options) {
    const scope = root || (typeof document === "object" ? document : null);
    if (!scope || typeof scope.querySelectorAll !== "function") return 0;
    const computed = (options && options.computedStroke) || defaultComputedStroke;
    let touched = 0;
    for (const svg of scope.querySelectorAll("svg")) {
      const use = svg.querySelector("use");
      if (!use) continue;
      const href = use.getAttribute("href") || use.getAttribute("xlink:href") || "";
      if (!href.startsWith("#i-")) continue;
      // Already classified — by hand, or by an earlier pass over the same subtree.
      if (svg.hasAttribute("data-motion")) continue;
      let motion = motionFor(href);
      if (motion === "draw" && computed(svg) === "none") motion = DRAW_FALLBACK;
      svg.classList.add("dn-icon--" + motion);
      svg.setAttribute("data-motion", motion);
      touched += 1;
    }
    return touched;
  }

  // A glyph is stroked or it is filled, and only the browser knows which: the sprite holds
  // both kinds and the wrapper decides. Reading it here rather than keeping a list of
  // filled ids means the answer stays right when the artwork changes.
  function defaultComputedStroke(svg) {
    if (typeof getComputedStyle !== "function") return "";
    try {
      return getComputedStyle(svg).stroke;
    } catch {
      return "";
    }
  }

  return {
    ICON_MOTION,
    ICON_MOTION_RULES,
    ICON_ALIASES,
    SPRITE_TO_LUCIDE,
    FAMILIES,
    DRAW_FALLBACK,
    resolveMotion,
    motionFor,
    motionClass,
    applyIconMotion
  };
});
