/* The site kit's behaviours (dist/ds-site.js), for alexispaoleschi.com's pages; the apps do not load it.
   <div id="nav" data-title data-links='[{"href": "#models", "label": "Models"}]' data-cta-href data-cta-label> becomes
   the bar of an event page (the design system's .topbar.is-site, here .sticky-nav), shown once the page's first hero
   is passed, with its phone menu (.mobile-menu, its button, its veil; Escape, the veil or a link close it). On that
   page a link to #something scrolls there smoothly, just below the bar.
   <div id="back-button" data-href data-label> becomes the way back over the hero's photo (.back-link.on-photo).
   window.hideLoader() takes the page loader (.page-loader, written in the page so that it shows at once) away; it goes
   by itself after 5s if a page never calls it.
   window.dsLandscapeWarning = true, set before this script, puts the prompt to turn a phone upright over the page held
   sideways; without it the page scrolls held sideways too (.landscape-warning-disabled on <html>).
   The galleries of an event page (.gallery-item, each .model-gallery's .model-gallery-item, .portfolio-item, each with
   its <img data-full>) open in the photo viewer when ds-photo.js is on the page too.
   ds.icon(name, cls) writes an icon of the sprite file that sits beside this script (icons-X.Y.Z.svg). */
(function () {
  "use strict";
  var here = document.currentScript && document.currentScript.src || "";
  var version = (here.match(/ds-site-(\d+\.\d+\.\d+)\.js/) || [])[1];
  var sprite = here.replace(/[^/]*$/, "") + (version ? "icons-" + version + ".svg" : "icons.svg");

  function icon(name, cls) {
    return '<svg aria-hidden="true" class="' + (cls || "ico") + '"><use href="' + sprite + "#i-" + name + '"></use></svg>';
  }

  // the prompt to turn a phone upright, written at once so that it covers the page from the first paint
  if (window.dsLandscapeWarning) {
    document.body.insertAdjacentHTML("afterbegin",
      '<div aria-hidden="true" class="landscape-warning">' +
      icon("reload", "ico landscape-warning-icon") +
      '<p class="landscape-warning-text">Please rotate your device to portrait mode</p></div>');
  } else {
    document.documentElement.classList.add("landscape-warning-disabled");
  }

  window.hideLoader = function () {
    var loader = document.querySelector(".page-loader");
    if (loader) loader.classList.add("hidden");
  };
  setTimeout(window.hideLoader, 5000);

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  // the bar and its menu, from <div id="nav">
  function bar() {
    var target = document.getElementById("nav");
    if (!target) return;
    var links = JSON.parse(target.dataset.links || "[]");
    var ctaHref = esc(target.dataset.ctaHref || "#booking"), ctaLabel = esc(target.dataset.ctaLabel || "Book Now");
    var navLinks = links.map(function (l) { return '<a class="topbar-link" href="' + esc(l.href) + '">' + esc(l.label) + "</a>"; }).join(" ");
    var menuLinks = links.map(function (l) { return '<a class="mobile-menu-link" href="' + esc(l.href) + '">' + esc(l.label) + "</a>"; }).join(" ");
    target.outerHTML =
      '<nav aria-hidden="true" class="topbar is-site sticky-nav"><div class="topbar-in">' +
      '<a class="topbar-brand" href="#">' + esc(target.dataset.title || "") + "</a>" +
      '<div class="topbar-nav is-center is-wide">' + navLinks + "</div>" +
      '<a class="btn is-save is-wide" href="' + ctaHref + '">' + ctaLabel + "</a>" +
      '<button aria-label="Toggle menu" class="mobile-menu-toggle"><span></span> <span></span> <span></span></button>' +
      "</div></nav>" +
      '<div aria-hidden="true" class="mobile-menu"><div class="mobile-menu-links">' + menuLinks +
      '<a class="mobile-menu-cta" href="' + ctaHref + '">' + ctaLabel + "</a></div></div>" +
      '<div aria-hidden="true" class="mobile-menu-overlay"></div>';
  }

  // the way back over the hero's photo, from <div id="back-button">
  function back() {
    var target = document.getElementById("back-button");
    if (!target) return;
    target.outerHTML =
      '<a class="back-link on-photo back-button" href="' + esc(target.dataset.href || "/") + '">' +
      icon("arrow-left") + " " + esc(target.dataset.label || "Back") + "</a>";
  }

  // the bar shown once the hero is passed, the menu, and the links to a part of the page
  function behave() {
    var stickyNav = document.querySelector(".sticky-nav");
    if (!stickyNav) return;
    var hero = document.querySelector(".hero");
    var menu = document.querySelector(".mobile-menu"), toggle = document.querySelector(".mobile-menu-toggle");
    var veil = document.querySelector(".mobile-menu-overlay");
    var open = function () { return menu && menu.classList.contains("active"); };

    window.addEventListener("scroll", function () {
      if (open() || !hero) return;
      var top = window.pageYOffset || document.documentElement.scrollTop;
      stickyNav.classList.toggle("visible", top > hero.offsetHeight);
    }, { passive: true });

    // a link to a part of the page: there smoothly, just below the bar (1px less on a phone, over the menu's border)
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      var href = a.getAttribute("href");
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      var to = document.querySelector(href);
      if (!to) return;
      var navHeight = stickyNav.offsetHeight - (menu ? 1 : 0);
      window.scrollTo({ top: to.getBoundingClientRect().top + window.pageYOffset - navHeight, behavior: "smooth" });
    });

    if (!menu || !toggle || !veil) return;
    var locked = false;
    function flip() {
      if (locked) return;
      var on = menu.classList.toggle("active");
      veil.classList.toggle("active", on);
      toggle.classList.toggle("active", on);
      document.body.style.overflow = on ? "hidden" : "";
    }
    function close() {
      menu.classList.remove("active");
      veil.classList.remove("active");
      toggle.classList.remove("active");
      document.body.style.overflow = "";
      // a tap that closes the menu (a link) does not reopen it through the button underneath
      locked = true;
      setTimeout(function () { locked = false; }, 600);
    }
    toggle.addEventListener("click", flip);
    veil.addEventListener("click", close);
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".mobile-menu-link, .mobile-menu-cta, .topbar-brand")) close();
    });
    // Escape closes the menu (the viewer handles its own keys first)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open()) close();
    });
  }

  // the galleries of an event page, each in the photo viewer, which turns round its own photos
  function galleries() {
    if (!window.ds || !window.ds.viewer) return;
    function wire(items, label) {
      var photos = Array.prototype.map.call(items, function (item) {
        var img = item.querySelector("img");
        return { src: img.dataset.full || img.src, alt: img.alt, thumb: img.currentSrc || img.src, el: item };
      });
      Array.prototype.forEach.call(items, function (item, i) {
        item.addEventListener("click", function () { window.ds.viewer(photos, { start: i, from: item, label: label }); });
      });
    }
    wire(document.querySelectorAll(".gallery-item"), "Venue");
    document.querySelectorAll(".model-gallery").forEach(function (g) { wire(g.querySelectorAll(".model-gallery-item"), "Model"); });
    wire(document.querySelectorAll(".portfolio-item"), "Portfolio");
  }

  document.addEventListener("DOMContentLoaded", function () {
    bar();
    back();
    behave();
    galleries();
  });

  window.ds = window.ds || {};
  window.ds.icon = icon;
})();
