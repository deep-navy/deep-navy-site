(() => {
  "use strict";

  const header = document.querySelector("[data-site-header]");
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = link.closest("details");
      menu?.removeAttribute("open");
      menu?.querySelector("summary")?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".mobile-menu").forEach((menu) => {
    menu.addEventListener("toggle", () => {
      const summary = menu.querySelector("summary");
      summary?.setAttribute("aria-expanded", menu.open ? "true" : "false");
      summary?.setAttribute("aria-label", menu.open ? "Close navigation" : "Open navigation");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".mobile-menu[open]").forEach((menu) => {
        menu.removeAttribute("open");
        menu.querySelector("summary")?.focus();
      });
    }
  });
})();
