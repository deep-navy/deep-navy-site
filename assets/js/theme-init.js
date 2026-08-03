/* Pre-paint theme resolution.

   Loaded from <head> WITHOUT defer/async on purpose: it must run before the
   first paint, or the page renders with the media-query theme and then snaps
   to the stored one — the white flash every dark-mode site is judged by.

   It lives in a file rather than inline because the app shell ships a strict
   Content-Security-Policy of script-src 'self' with no 'unsafe-inline', so an
   inline block would simply be refused and the theme would never apply there.

   No stored value means no data-theme attribute, which leaves the
   prefers-color-scheme query in tokens.css live — so "system" keeps following
   the OS even while the tab is open. The interaction logic is in
   theme-toggle.js, which may load late without risking a flash. */
(function () {
  "use strict";
  try {
    var stored = localStorage.getItem("dn-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {
    /* Private mode or blocked storage: fall through to the system theme. */
  }
})();
