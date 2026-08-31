(() => {
  const baseUrl = document.body?.dataset.baseurl || "";
  const pages = [
    { title: "Home", group: "General", url: "/" },
    { title: "Installation", group: "General", url: "/installation/" },
    { title: "API Reference", group: "General", url: "/api/" },
    { title: "Application API", group: "API Reference", url: "/api/application/" },
    { title: "Data API", group: "API Reference", url: "/api/data/" },
    { title: "Features API", group: "API Reference", url: "/api/features/" },
    { title: "Algorithms API", group: "API Reference", url: "/api/algorithms/" },
    { title: "Algorithm Registration Parameters", group: "API Reference", url: "/api/algorithms/parameters/" },
    { title: "Pipeline Configuration", group: "API Reference", url: "/api/pipeline/" },
    { title: "Runtime Contexts", group: "API Reference", url: "/api/contexts/" },
    { title: "Tutorials", group: "General", url: "/tutorials/" },
    { title: "About", group: "About", url: "/about/" },
    { title: "Citation", group: "About", url: "/citation/" },
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getElements() {
    return {
      sidebar: document.querySelector("#site-sidebar"),
      backdrop: document.querySelector("[data-backdrop]"),
      menuToggle: document.querySelector(".menu-toggle"),
      searchInput: document.querySelector("#site-search"),
      searchResults: document.querySelector("#search-results"),
      searchTrigger: document.querySelector(".search-trigger"),
      themeToggle: document.querySelector(".theme-toggle"),
    };
  }

  function withBaseUrl(path) {
    return `${baseUrl}${path}`;
  }

  function normalizePath(pathname) {
    let path = decodeURIComponent(pathname || "/");
    if (baseUrl && path.startsWith(baseUrl)) {
      path = path.slice(baseUrl.length) || "/";
    }
    path = path.replace(/\/index\.html$/, "/").replace(/\.html$/, "/");
    return path.endsWith("/") ? path : `${path}/`;
  }

  function markCurrentPage() {
    const current = normalizePath(window.location.pathname);

    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isExternal = /^https?:\/\//.test(href);
      const linkPath = isExternal ? "" : normalizePath(new URL(href, window.location.href).pathname);
      const isCurrent = !isExternal && linkPath === current;

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function openSidebar() {
    const { sidebar, backdrop, menuToggle } = getElements();
    if (!sidebar || !backdrop || !menuToggle) return;

    sidebar.classList.add("is-open");
    backdrop.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    const { sidebar, backdrop, menuToggle } = getElements();
    if (!sidebar || !backdrop || !menuToggle) return;

    sidebar.classList.remove("is-open");
    backdrop.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function handleSearch() {
    const { searchInput, searchResults } = getElements();
    if (!searchInput || !searchResults) return;

    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      return;
    }

    const matches = pages
      .filter((page) => `${page.title} ${page.group}`.toLowerCase().includes(query))
      .slice(0, 6);

    searchResults.innerHTML = matches.length
      ? `<ul>${matches
          .map(
            (page) => `
              <li>
                <a href="${escapeHtml(withBaseUrl(page.url))}">
                  <span>${escapeHtml(page.title)}</span>
                  <small>${escapeHtml(page.group)}</small>
                </a>
              </li>
            `,
          )
          .join("")}</ul>`
      : "<p>No matches</p>";
  }

  function initTheme() {
    document.documentElement.dataset.theme = localStorage.getItem("docs-theme") || "light";
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("docs-theme", next);
  }

  function toggleNavBranch(button) {
    const menuId = button.getAttribute("aria-controls");
    const menu = menuId ? document.getElementById(menuId) : null;
    if (!menu) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    menu.hidden = isExpanded;
  }

  function bindEvents() {
    const { menuToggle, backdrop, searchInput, searchTrigger, themeToggle } = getElements();

    menuToggle?.addEventListener("click", openSidebar);
    backdrop?.addEventListener("click", closeSidebar);
    searchInput?.addEventListener("input", handleSearch);
    searchTrigger?.addEventListener("click", () => searchInput?.focus());
    themeToggle?.addEventListener("click", toggleTheme);
    document.querySelectorAll("[data-nav-toggle]").forEach((button) => {
      button.addEventListener("click", () => toggleNavBranch(button));
    });

    document.addEventListener("keydown", (event) => {
      const { searchInput: currentSearchInput } = getElements();
      if (event.key === "Escape") closeSidebar();

      if (event.key === "/" && currentSearchInput && document.activeElement !== currentSearchInput) {
        event.preventDefault();
        currentSearchInput.focus();
      }
    });
  }

  async function init() {
    initTheme();
    markCurrentPage();
    bindEvents();
  }

  init();
})();
