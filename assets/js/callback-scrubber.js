(() => {
  "use strict";

  const query = window.location.search;
  if (!query) return;
  Object.defineProperty(window, "deepNavyInitialQuery", {
    value: query,
    writable: true,
    configurable: true,
    enumerable: false
  });
  window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
})();
