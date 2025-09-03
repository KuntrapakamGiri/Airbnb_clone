document.addEventListener("DOMContentLoaded", function() {
  // Cache for loaded pages
  const pageCache = {};

  // Loading indicator helpers
  function showLoading() {
    document.getElementById("loading-indicator").classList.remove("hidden");
  }
  function hideLoading() {
    document.getElementById("loading-indicator").classList.add("hidden");
  }

  // Set active nav button
  function setActiveNav(hash) {
    document.querySelectorAll('#main-nav a').forEach(btn => btn.classList.remove('active-nav'));
    if (hash === "#experience") {
      document.getElementById("nav-experiences").classList.add('active-nav');
    } else if (hash === "#services") {
      document.getElementById("nav-services").classList.add('active-nav');
    } else {
      document.getElementById("nav-home").classList.add('active-nav');
    }
  }

  // Load page content with error handling and caching
  function loadPage(page, hash) {
    setActiveNav(hash);
    showLoading();
    if (pageCache[page]) {
      document.getElementById("main-content").innerHTML = pageCache[page];
      hideLoading();
      return;
    }
    fetch(page)
      .then(response => {
        if (!response.ok) throw new Error("404");
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const mainContent = doc.querySelector("main");
        if (mainContent) {
          pageCache[page] = mainContent.innerHTML;
          document.getElementById("main-content").innerHTML = mainContent.innerHTML;
        } else {
          document.getElementById("main-content").innerHTML = "<div class='text-center py-10 text-red-500 font-bold'>404: Main section not found.</div>";
        }
        hideLoading();
      })
      .catch(() => {
        document.getElementById("main-content").innerHTML = "<div class='text-center py-10 text-red-500 font-bold'>404: Page not found.</div>";
        hideLoading();
      });
  }

  // Initial load based on hash
  function initialLoad() {
    if (location.hash === "#experience") {
      loadPage("experience.html", "#experience");
    } else if (location.hash === "#services") {
      loadPage("services.html", "#services");
    } else {
      loadPage("home.html", "#home");
    }
  }
  initialLoad();

  // Navigation buttons
  document.getElementById("nav-home").addEventListener("click", function(e) {
    e.preventDefault();
    location.hash = "home";
    loadPage("home.html", "/home");
  });
  document.getElementById("nav-experiences").addEventListener("click", function(e) {
    e.preventDefault();
    location.hash = "experience";
    loadPage("experience.html", "/experience");
  });
  document.getElementById("nav-services").addEventListener("click", function(e) {
    e.preventDefault();
    location.hash = "services";
    loadPage("services.html", "/services");
  });

  // Handle hash change (browser back/forward)
  window.addEventListener("hashchange", initialLoad);

  // Hide nav bar and shrink header on scroll
  const headerTop = document.querySelector(".header-top");
  const navBar = document.getElementById("main-nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      headerTop.style.paddingTop = "8px";
      headerTop.style.paddingBottom = "8px";
      headerTop.style.transition = "padding 0.3s";
      navBar.style.opacity = "0";
      navBar.style.pointerEvents = "none";
      navBar.style.transition = "opacity 0.3s";
    } else {
      headerTop.style.paddingTop = "12px";
      headerTop.style.paddingBottom = "12px";
      headerTop.style.transition = "padding 0.3s";
      navBar.style.opacity = "1";
      navBar.style.pointerEvents = "auto";
      navBar.style.transition = "opacity 0.3s";
    }
  });
});