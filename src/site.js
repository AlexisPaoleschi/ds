/* The site kit's behaviours (dist/ds-site.js), for alexispaoleschi.com's pages; the apps do not load it.
   <div id="nav" data-title data-links='[{"href": "#models", "label": "Models"}]' data-cta-href data-cta-label> becomes
   the bar of an event page (the design system's .topbar.is-site, here .sticky-nav), shown once the page's first hero
   is passed, with its phone menu (.mobile-menu, its button, its veil; Escape, the veil or a link close it). On that
   page a link to #something scrolls there smoothly (at once when the device asks for less motion), just below the bar.
   Hidden, the bar and the closed menu cannot be reached with Tab; the menu's button says whether it is open, opening it
   takes the keyboard to its first link, and Escape or the veil take it back to the button.
   <div id="back-button" data-href data-label> becomes the way back over the hero's photo (.back-link.on-photo).
   window.hideLoader() takes the page loader (.page-loader, written in the page so that it shows at once) away; it goes
   by itself after 5s if a page never calls it.
   window.dsLandscapeWarning = true, set before this script, puts the prompt to turn a phone upright over the page held
   sideways; without it the page scrolls held sideways too (.landscape-warning-disabled on <html>).
   The galleries of an event page (.gallery-item, each .model-gallery's .model-gallery-item, .portfolio-item, each with
   its <img data-full>) open in the photo viewer when ds-photo.js is on the page too, with a click, or Enter or Space.
   ds.icon(name, cls) writes an icon of the sprite file that sits beside this script (icons-X.Y.Z.svg). ds.h(tag, attrs, kids)
   builds a node and ds.esc(text) makes a text harmless in HTML (the core's, src/core.js), for what a page writes from a Gist.
   ds.json(url) reads a JSON file (the site's Gists), asked for afresh on every visit (?t=…) and once per page however
   many scripts ask for it. ds.photo(src) and ds.images(root) settle once a photo, or every <img> under root, has loaded
   or failed. ds.ready(...waits) takes the page loader away once these and the photo the page gives its header
   (--hero-photo) have settled, failed or not.
   ds.screens(), once the screens are written: a page that scrolls by screens (.scroll-container of .scroll-section, the
   home page) gets a dot per screen in .scroll-dots (the first one may be in the page already), the dot of the screen shown lit, the dots shown once
   past the first screen, the hint (.scroll-hint) on the first screen when there are more, a dot or the hint going to its
   screen, and an address with #screen going there.
   ds.newsletter(form, {url, fields, check, sending, done, input, honeypot, feedback, button}): a form that signs up to the
   newsletter (the events' banner, the newsletter page), the one way for both. Its address is checked first (unless
   check() says not this time), then sent to url (or what url() gives) as a form's fields: fields(), else the address and
   the honeypot (email, email_address_check). Meanwhile its button is busy (.btn.is-busy: it turns, keeps its colours, and
   a second click sends nothing) and the line under the field (.field-note) says sending (its words, or a function that
   gives them and may change the page). Then the line says the server's own words ({ok, message}), in gold when it went
   well, in red when not, or that the server could not be reached. done(answer, ok) follows (answer null when the server
   could not be reached); without it, the form is emptied when it went well and the field takes the focus when not.
   The form's parts, unless given: its input[type=email], input[name=email_address_check], .field-note, submit button. */
(function () {
  "use strict";
  var _ = window.ds._, esc = window.ds.esc;
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
    if (loader) loader.classList.add("is-hidden");
  };
  setTimeout(window.hideLoader, 5000);

  // smooth scrolling, unless the device asks for less motion
  function glide() { return _.reduced() ? "auto" : "smooth"; }
  // the element an address's #part names, read as an id, so that « #2026 » works where a selector would fail
  function byHash(hash) {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return null; }
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
      '<nav class="topbar is-site sticky-nav"><div class="topbar-in">' +
      '<a class="topbar-brand" href="#">' + esc(target.dataset.title || "") + "</a>" +
      '<div class="topbar-nav is-center is-wide">' + navLinks + "</div>" +
      '<a class="btn is-save is-wide" href="' + ctaHref + '">' + ctaLabel + "</a>" +
      '<button type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-menu" class="mobile-menu-toggle">' +
      '<span></span> <span></span> <span></span></button>' +
      "</div></nav>" +
      '<div class="mobile-menu" id="site-menu"><div class="mobile-menu-links">' + menuLinks +
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
    var open = function () { return menu && menu.classList.contains("is-open"); };

    window.addEventListener("scroll", function () {
      if (open() || !hero) return;
      var top = window.pageYOffset || document.documentElement.scrollTop;
      stickyNav.classList.toggle("is-visible", top > hero.offsetHeight);
    }, { passive: true });

    // a link to a part of the page: there smoothly, just below the bar (1px less on a phone, over the menu's border)
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      var href = a.getAttribute("href");
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: glide() });
        return;
      }
      var to = byHash(href);
      if (!to) return;
      var navHeight = stickyNav.offsetHeight - (menu ? 1 : 0);
      window.scrollTo({ top: to.getBoundingClientRect().top + window.pageYOffset - navHeight, behavior: glide() });
    });

    if (!menu || !toggle || !veil) return;
    var locked = false;
    // open, the menu is the top layer: Escape closes it (the photo viewer, over it, first), and takes the keyboard back to its button
    var cover = { el: menu, trap: false, close: function () { close(true); } };
    function flip() {
      if (locked) return;
      var on = menu.classList.toggle("is-open");
      veil.classList.toggle("is-open", on);
      toggle.classList.toggle("is-open", on);
      toggle.setAttribute("aria-expanded", String(on));
      document.body.style.overflow = on ? "hidden" : "";
      if (on) _.layer(cover); else _.unlayer(cover);
      // opened, the keyboard goes to its first link (the menu is shown at once, it only unrolls)
      if (on) {
        var first = menu.querySelector("a");
        if (first) requestAnimationFrame(function () { first.focus({ preventScroll: true }); });
      }
    }
    function close(back) {
      var inside = menu.contains(document.activeElement);
      _.unlayer(cover);
      menu.classList.remove("is-open");
      veil.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      // closed with Escape or the veil while the keyboard was in it, the keyboard goes back to its button
      if (back && inside) toggle.focus({ preventScroll: true });
      // a tap that closes the menu (a link) does not reopen it through the button underneath
      locked = true;
      setTimeout(function () { locked = false; }, 600);
    }
    toggle.addEventListener("click", flip);
    veil.addEventListener("click", function () { close(true); });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".mobile-menu-link, .mobile-menu-cta, .topbar-brand")) close();
    });
  }

  // the galleries of an event page, each in the photo viewer, which turns round its own photos; each photo is a button
  // the keyboard reaches and opens with Enter or Space. An item without a photo is left out, and the others still work
  function galleries() {
    if (!window.ds || !window.ds.viewer) return;
    function wire(items, label) {
      items = Array.prototype.filter.call(items, function (item) { return !!item.querySelector("img"); });
      var photos = items.map(function (item) {
        var img = item.querySelector("img");
        return { src: img.dataset.full || img.src, alt: img.alt, thumb: img.currentSrc || img.src, el: item };
      });
      items.forEach(function (item, i) {
        var open = function () { window.ds.viewer(null, photos, { start: i, from: item, label: label }); };
        item.setAttribute("role", "button");
        if (!item.hasAttribute("tabindex")) item.tabIndex = 0;
        item.setAttribute("aria-label", "Open " + (photos[i].alt || label + " photo " + (i + 1)));
        item.addEventListener("click", open);
        item.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
      });
    }
    wire(document.querySelectorAll(".gallery-item"), "Venue");
    document.querySelectorAll(".model-gallery").forEach(function (g) { wire(g.querySelectorAll(".model-gallery-item"), "Model"); });
    wire(document.querySelectorAll(".portfolio-item"), "Portfolio");
  }

  // the site's Gists: each read once per page, afresh on every visit
  var asked = {};
  function json(url) {
    if (!asked[url]) {
      asked[url] = fetch(url + (url.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now()).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    return asked[url];
  }

  function photo(src) {
    return new Promise(function (done) {
      var img = new Image();
      img.onload = img.onerror = function () { done(); };
      img.src = src;
    });
  }

  function images(root) {
    return Promise.all(Array.prototype.map.call((root || document).querySelectorAll("img"), function (img) {
      return img.complete ? null : new Promise(function (done) {
        img.addEventListener("load", function () { done(); }, { once: true });
        img.addEventListener("error", function () { done(); }, { once: true });
      });
    }));
  }

  // the loader goes once the page's waits and its header photo have settled, whichever comes last
  function ready() {
    var waits = Array.prototype.slice.call(arguments);
    var el = document.querySelector('[style*="--hero-photo"]');
    var m = el && el.getAttribute("style").match(/--hero-photo:\s*url\((['"]?)([^'")]+)\1\)/);
    if (m) waits.push(photo(m[2]));
    return Promise.all(waits.map(function (w) { return Promise.resolve(w).catch(function () {}); })).then(function () { window.hideLoader(); });
  }

  // a page that scrolls by screens: its dots, its hint, its address
  function screens() {
    var container = document.querySelector(".scroll-container"), nav = document.querySelector(".scroll-dots");
    var hint = document.querySelector(".scroll-hint");
    if (!container || !nav) return;
    var sections = document.querySelectorAll(".scroll-section");
    var more = sections.length > 1;
    // the first screen's dot may be written in the page, lit, so that it shows before the script
    var first = nav.querySelector(".scroll-dot");
    Array.prototype.forEach.call(sections, function (section, i) {
      if (i === 0 && first) return;
      var dot = document.createElement("button");
      dot.className = "scroll-dot";
      dot.dataset.section = i;
      dot.setAttribute("aria-label", "Go to section " + (i + 1));
      nav.appendChild(dot);
    });
    var dots = nav.querySelectorAll(".scroll-dot");
    function light() {
      var current = 0;
      Array.prototype.forEach.call(sections, function (section, i) {
        if (container.scrollTop >= section.offsetTop - window.innerHeight / 2) current = i;
      });
      nav.classList.toggle("is-visible", current !== 0);
      if (hint) {
        var show = current === 0 && more;
        hint.style.opacity = show ? "1" : "0";
        hint.style.pointerEvents = show ? "auto" : "none";
      }
      Array.prototype.forEach.call(dots, function (dot, i) { dot.classList.toggle("is-on", i === current); });
    }
    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener("click", function () { sections[i].scrollIntoView({ behavior: glide() }); });
    });
    if (hint && more) {
      hint.style.cursor = "pointer";
      hint.style.pointerEvents = "auto";
      hint.addEventListener("click", function () { sections[1].scrollIntoView({ behavior: glide() }); });
    }
    container.addEventListener("scroll", light, { passive: true });
    window.addEventListener("resize", light, { passive: true });
    light();
    if (window.location.hash) {
      var to = byHash(window.location.hash);
      if (to) setTimeout(function () { to.scrollIntoView({ behavior: glide() }); }, 100);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bar();
    back();
    behave();
    galleries();
  });

  window.ds = window.ds || {};
  var WORDS = _.table({
    fr: { invalid: "Saisis une adresse e-mail valide.", sending: "Inscription en cours…",
          offline: "Le serveur ne répond pas. Vérifie ta connexion et réessaie." },
    en: { invalid: "Please enter a valid email address.", sending: "Signing you up…",
          offline: "Could not reach the server. Please check your connection and try again." }
  });
  function newsletter(form, o) {
    form = _.find(form);
    if (!form) return null;
    // called again on the same form: the same one, never a second sending
    if (form._dsNewsletter) return form._dsNewsletter;
    o = o || {};
    var w = function () { return _.words(WORDS); };
    var input = _.find(o.input) || form.querySelector('input[type="email"]');
    var trap = _.find(o.honeypot) || form.querySelector('input[name="email_address_check"]');
    var note = _.find(o.feedback) || form.querySelector(".field-note");
    var button = _.find(o.button) || form.querySelector('button[type="submit"], button:not([type])');
    function say(text, how) {
      if (!note) return;
      note.textContent = text || "";
      note.classList.remove("is-good", "is-bad");
      if (how) note.classList.add(how);
    }
    function busy(on) {
      if (!button) return;
      button.classList.toggle("is-busy", on);
      button.disabled = on;
      if (on) button.setAttribute("aria-busy", "true"); else button.removeAttribute("aria-busy");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (button && button.classList.contains("is-busy")) return;
      var checked = o.check ? o.check() !== false : true;
      if (checked && input && (!input.value.trim() || !input.checkValidity())) {
        say(w().invalid, "is-bad");
        input.focus();
        return;
      }
      var url = typeof o.url === "function" ? o.url() : o.url;
      var fields = o.fields ? o.fields() : { email: input ? input.value.trim() : "", email_address_check: trap ? trap.value : "" };
      busy(true);
      say(typeof o.sending === "function" ? o.sending() : o.sending || w().sending, null);
      // the endpoint decides both the words and whether it went well; an answer that is not JSON did not go well
      fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body: new URLSearchParams(fields) })
        .then(function (r) { return r.json(); })
        .then(function (answer) {
          var ok = !!answer && answer.ok === true;
          say(answer && answer.message, ok ? "is-good" : "is-bad");
          busy(false);
          if (o.done) o.done(answer, ok);
          else if (ok) form.reset();
          else if (input) input.focus();
        }, function () {
          say(w().offline, "is-bad");
          busy(false);
          if (o.done) o.done(null, false);
        });
    });
    form._dsNewsletter = { form: form, say: say, busy: busy };
    return form._dsNewsletter;
  }

  window.ds.icon = icon;
  window.ds.newsletter = newsletter;
  window.ds.json = json;
  window.ds.photo = photo;
  window.ds.images = images;
  window.ds.ready = ready;
  window.ds.screens = screens;
})();
