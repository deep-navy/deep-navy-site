// The marketing pages' scroll observer: the one thing .dn-reveal cannot do
// from CSS. The utility FAILS OPEN — main.css hides un-revealed elements only
// under .dn-motion-ready, and this file adds that class only once it is
// actually observing. No script, script blocked, reduced motion, no
// IntersectionObserver — the content is simply visible.
//
// Loaded defer from the marketing layout only; the app has its own motion
// wiring and no scroll-revealed sections.
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var targets = document.querySelectorAll(".dn-reveal");
  if (targets.length === 0) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.documentElement.classList.add("dn-motion-ready");
  targets.forEach(function (target) { observer.observe(target); });
})();
