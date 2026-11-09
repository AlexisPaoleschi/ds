/* ds 2.36.0 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
/* ds.viewer(items, {start, onChange, onClose, label, el, from}): the photo viewer of src/viewer.css, opened on
   items[start]. An item is {src, srcset, sizes, alt, caption, thumb, el}, a plain address, or a function that returns one
   (or a promise of one), called when the photo is first needed: Selecta asks its server for a signed address then.
   thumb is shown, blurred, while the photo loads; el is the page's element for that photo (a grid's link), where the
   focus goes back on closing.
   The cross, a click beside the photo (the veil), Escape or a finger pulled down close it; the arrows, ← → and a finger
   swiped sideways turn the photos, round and round; « 3 / 24 » says where one is; the two neighbours load ahead; the
   spinner turns while a photo loads. Opening moves the focus into it, Tab stays in it, closing gives the focus back to
   what opened it (or to the photo one ended on); the page behind does not scroll meanwhile (viewer-behaviour.css).
   It drives the page's own .viewer when there is one (opts.el, or a .viewer at the top of <body>: Selecta's, with its
   bar under the photo) and adds the parts it lacks; otherwise it builds one. onChange(index, item, viewer) tells each
   photo shown, onClose(index, viewer) the closing. Returns {el, index, isOpen, go(i), next(), prev(), close()}.
   ds.viewer.bind(container, {item, label, onChange, onClose}): a grid of links (item, "a[href]" by default) opens the
   viewer on a click, each link's href as its photo (data-srcset, data-sizes and data-caption for more, its image as
   thumb and alt). The markup <div data-viewer> does the same with no code at all; data-viewer="selector" names the
   items, data-viewer-label the viewer. Nothing here is written inline, so a page served with script-src 'self' works. */
(function () {
  "use strict";
  var WORDS = {
    fr: { label: "Photos", close: "Fermer", prev: "Photo précédente", next: "Photo suivante", failed: "Cette photo n’a pas pu s’ouvrir." },
    en: { label: "Photos", close: "Close", prev: "Previous photo", next: "Next photo", failed: "This photo could not be opened." }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  // how far a finger travels to turn the photo, and to close the viewer when pulled down (the site's 50px)
  var SWIPE = 50, DROP = 90, START = 8;
  var open = null;
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function make(name, cls, parent) {
    var x = document.createElement(name);
    x.className = cls;
    if (parent) parent.appendChild(x);
    return x;
  }
  function button(el, cls, label) {
    var b = el.querySelector("." + cls);
    if (!b) { b = make("button", "viewer-btn " + cls, el); b.type = "button"; }
    if (!b.hasAttribute("aria-label")) b.setAttribute("aria-label", label);
    return b;
  }

  // the parts the viewer needs, taken from its markup or added: veil, stage and photo, spinner, count, the three buttons
  function setup(el) {
    if (el._dsViewer) return el._dsViewer;
    var w = words(), veil = el.querySelector(".viewer-veil"), stage = el.querySelector(".viewer-stage");
    if (!veil) { veil = make("div", "viewer-veil"); el.insertBefore(veil, el.firstChild); }
    if (!stage) { stage = make("div", "viewer-stage"); el.insertBefore(stage, veil.nextSibling); }
    var img = stage.querySelector("img") || make("img", "", stage);
    img.draggable = false;
    img.decoding = "async";
    var spin = stage.querySelector(".spinner") || make("span", "spinner is-medium on-photo", stage);
    spin.setAttribute("aria-hidden", "true");
    // in the stage, the count sits over the photo's foot, above an app's bar when there is one
    var count = el.querySelector(".viewer-count") || make("div", "viewer-count", stage);
    count.setAttribute("aria-live", "polite");
    var c = { el: el, veil: veil, stage: stage, img: img, spin: spin, count: count, items: [], at: 0, opts: {}, token: 0, cache: {}, keep: [], before: null, isOpen: false,
      close: button(el, "viewer-close", w.close), prev: button(el, "viewer-prev", w.prev), next: button(el, "viewer-next", w.next) };
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.tabIndex = -1;
    el.hidden = true;
    c.handle = { el: el, index: 0, isOpen: false,
      go: function (i) { show(c, i); return c.handle; },
      next: function () { show(c, c.at + 1); return c.handle; },
      prev: function () { show(c, c.at - 1); return c.handle; },
      close: function () { shut(c); return c.handle; } };
    el._dsViewer = c;
    el.addEventListener("click", function (e) {
      if (!c.isOpen) return;
      var t = e.target;
      if (t.closest(".viewer-close")) shut(c);
      else if (t.closest(".viewer-prev")) show(c, c.at - 1);
      else if (t.closest(".viewer-next")) show(c, c.at + 1);
      // the stage covers the veil around the photo: a click there is a click on the veil
      else if (t === c.veil || t === c.stage) shut(c);
    });
    swipes(c);
    return c;
  }

  // an item, asked once per opening (a function may ask a server), as {src, …}
  function item(c, i) {
    if (!c.cache[i]) {
      // in a promise from the start, so that a function that throws is a photo that failed, not a viewer that stops
      var x = c.items[i], p = new Promise(function (ok) { ok(typeof x === "function" ? x(i) : x); }).then(function (it) {
        if (typeof it === "string") it = { src: it };
        if (!it || !it.src) throw new Error("no photo");
        return it;
      });
      c.cache[i] = p;
      // a refusal is asked again next time
      p.catch(function () { if (c.cache[i] === p) delete c.cache[i]; });
    }
    return c.cache[i];
  }
  function fill(img, it) {
    if (it.srcset) { img.sizes = it.sizes || "100vw"; img.srcset = it.srcset; } else img.removeAttribute("srcset");
    img.src = it.src;
  }
  function fetchPhoto(it) {
    return new Promise(function (ok, ko) {
      var im = new Image();
      im.onload = function () { ok(im); };
      im.onerror = ko;
      fill(im, it);
    });
  }
  // the neighbours load ahead, so that turning to them shows them at once
  function ahead(c, j) {
    var n = c.items.length;
    j = ((j % n) + n) % n;
    item(c, j).then(function (it) {
      var im = new Image();
      fill(im, it);
      c.keep = c.keep.slice(-3).concat(im);
    }).catch(function () {});
  }
  function caption(c, text) {
    var cap = c.el.querySelector(".viewer-caption");
    // once a photo of this opening has a caption, its line stays for all, even empty, so that the photos keep their
    // size from one to the next
    if (text) c.captioned = true;
    if (!cap && !c.captioned) return;
    if (!cap) {
      var bar = c.el.querySelector(".viewer-bar");
      if (!bar) { bar = make("div", "viewer-bar", c.el); bar._dsOwn = true; }
      cap = make("p", "viewer-caption", bar);
    }
    cap.textContent = text;
    cap.hidden = !c.captioned;
    // a bar of ds's own goes with its captions; an app's bar stays
    if (cap.parentNode._dsOwn) cap.parentNode.hidden = !c.captioned;
  }
  // what an item says before it is asked for: a function's item says it once it comes
  function known(x) { return x && typeof x === "object" ? x : {}; }

  function show(c, i) {
    var n = c.items.length;
    if (!n || !c.isOpen) return;
    i = ((i % n) + n) % n;
    c.at = c.handle.index = i;
    c.prev.hidden = c.next.hidden = c.count.hidden = n < 2;
    c.count.textContent = (i + 1) + " / " + n;
    var token = ++c.token, img = c.img;
    img.classList.add("is-loading");
    img.classList.remove("is-placeholder");
    c.spin.hidden = false;
    // the caption changes with the count, not a moment later
    caption(c, known(c.items[i]).caption || "");
    function done() {
      if (token !== c.token) return;
      img.classList.remove("is-loading", "is-placeholder");
      c.spin.hidden = true;
    }
    item(c, i).then(function (it) {
      if (token !== c.token) return;
      img.alt = it.alt || it.caption || "";
      caption(c, it.caption || "");
      if (it.thumb) {
        img.removeAttribute("srcset");
        img.src = it.thumb;
        img.classList.add("is-placeholder");
        img.classList.remove("is-loading");
      }
      return fetchPhoto(it).then(function () {
        if (token !== c.token) return;
        fill(img, it);
        // shown once decoded, so that the photo never blinks white or half drawn
        if (img.decode) img.decode().then(done, done); else done();
      });
    }).catch(function () {
      if (token !== c.token) return;
      done();
      if (window.ds && window.ds.toast) window.ds.toast({ type: "bad", text: words().failed });
    });
    if (n > 1) ahead(c, i + 1);
    if (n > 2) ahead(c, i - 1);
    if (c.opts.onChange) c.opts.onChange(i, c.items[i], c.handle);
  }

  function shut(c) {
    if (!c.isOpen) return;
    c.isOpen = c.handle.isOpen = false;
    if (open === c) open = null;
    c.token++;
    c.el.hidden = true;
    c.el.classList.remove("is-open", "is-dragging");
    // the last photo must not flash on the next opening
    c.img.removeAttribute("srcset");
    c.img.removeAttribute("src");
    c.img.style.transform = "";
    c.veil.style.opacity = "";
    var it = c.items[c.at], own = it && it.el && it.el.isConnected ? it.el : null, back = own || c.before;
    c.before = null;
    if (back && back.focus && back.isConnected) {
      back.focus({ preventScroll: true });
      // the photo one ended on comes into sight in its grid
      if (own && own.scrollIntoView) own.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
    }
    if (c.opts.onClose) c.opts.onClose(c.at, c.handle);
  }

  // a finger: sideways turns the photo, down closes; the photo follows it meanwhile. Two fingers zoom, as the browser does.
  function swipes(c) {
    var t = null, el = c.el;
    function reset() {
      t = null;
      el.classList.remove("is-dragging");
      c.img.style.transform = "";
      c.veil.style.opacity = "";
    }
    el.addEventListener("touchstart", function (e) {
      t = null;
      if (!c.isOpen || e.touches.length !== 1 || e.target.closest(".viewer-bar, .viewer-btn")) return;
      // zoomed in, a finger moves around the photo instead
      if (window.visualViewport && window.visualViewport.scale > 1.01) return;
      t = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dy: 0, axis: "" };
    }, { passive: true });
    el.addEventListener("touchmove", function (e) {
      if (!t) return;
      if (e.touches.length !== 1) { reset(); return; }
      var dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
      if (!t.axis) {
        if (Math.abs(dx) < START && Math.abs(dy) < START) return;
        t.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        el.classList.add("is-dragging");
      }
      t.dx = dx;
      t.dy = dy;
      if (t.axis === "x") { c.img.style.transform = "translateX(" + dx + "px)"; return; }
      var down = Math.max(0, dy);
      c.img.style.transform = "translateY(" + down + "px)";
      c.veil.style.opacity = String(Math.max(0.35, 1 - down / Math.max(1, el.clientHeight) * 1.6));
    }, { passive: true });
    el.addEventListener("touchend", function () {
      if (!t) return;
      var s = t;
      reset();
      if (s.axis === "x" && Math.abs(s.dx) > SWIPE && c.items.length > 1) show(c, c.at + (s.dx < 0 ? 1 : -1));
      else if (s.axis === "y" && s.dy > DROP) shut(c);
    });
    el.addEventListener("touchcancel", reset);
  }

  function viewer(items, opts) {
    opts = opts || {};
    var el = opts.el ? (typeof opts.el === "string" ? document.querySelector(opts.el) : opts.el) : document.querySelector("body > .viewer");
    if (!el) { el = make("div", "viewer", document.body); el.hidden = true; el._dsBuilt = true; }
    var c = setup(el);
    if (open && open !== c) shut(open);
    c.items = [].slice.call(items || []);
    c.opts = opts;
    c.cache = {};
    c.captioned = c.items.some(function (x) { return !!known(x).caption; });
    if (!c.items.length) return c.handle;
    var from = opts.from || document.activeElement;
    if (!c.isOpen) c.before = from;
    // a viewer ds built takes the theme of what opened it (the showcase has one per column); an app's has its page's
    if (el._dsBuilt) {
      var th = from && from.closest ? from.closest("[data-theme]") : null;
      if (th && th !== document.documentElement) el.setAttribute("data-theme", th.getAttribute("data-theme"));
      else el.removeAttribute("data-theme");
    }
    el.setAttribute("aria-label", opts.label || words().label);
    if (!c.isOpen) {
      c.isOpen = c.handle.isOpen = true;
      open = c;
      el.hidden = false;
      el.classList.add("is-open");
    }
    show(c, opts.start || 0);
    el.focus({ preventScroll: true });
    return c.handle;
  }

  // on <html> and before the page's own keys: Escape closes the viewer only, and a window of ds.confirm over it
  // (which listens on the document, earlier still) keeps its own
  document.documentElement.addEventListener("keydown", function (e) {
    var c = open;
    if (!c || e.defaultPrevented || document.querySelector(".dialog-veil")) return;
    if (e.key === "Escape") { e.preventDefault(); shut(c); return; }
    // in a field of the app's bar (Selecta's note), the keys belong to the field
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (c.items.length > 1) { e.preventDefault(); show(c, c.at + (e.key === "ArrowRight" ? 1 : -1)); }
      return;
    }
    if (e.key !== "Tab") return;
    // Tab goes round inside the viewer
    var list = [].filter.call(c.el.querySelectorAll(FOCUSABLE), function (x) { return x.getClientRects().length > 0; });
    var at = document.activeElement, first = list[0], last = list[list.length - 1];
    if (!list.length) { e.preventDefault(); return; }
    if (!c.el.contains(at)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (at === first || at === c.el)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }, true);

  // a link of a grid as an item
  function linkItem(a) {
    var im = a.querySelector("img");
    return { src: a.getAttribute("data-src") || a.href || (im && (im.currentSrc || im.src)) || "",
      srcset: a.getAttribute("data-srcset") || "", sizes: a.getAttribute("data-sizes") || "",
      alt: (im && im.getAttribute("alt")) || a.getAttribute("aria-label") || "", caption: a.getAttribute("data-caption") || "",
      thumb: im ? im.currentSrc || im.src : "", el: a };
  }
  function clicker(box, o) {
    return function (e) {
      // a click with a key held, or the middle button, still opens the photo in a new tab
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var sel = o.item || "a[href]", a = e.target.closest ? e.target.closest(sel) : null;
      if (!a || !box.contains(a)) return;
      // the photos one can see: those a filter hides are skipped
      var all = [].filter.call(box.querySelectorAll(sel), function (x) { return x.getClientRects().length > 0; }), at = all.indexOf(a);
      if (at < 0) return;
      e.preventDefault();
      viewer(all.map(linkItem), { start: at, from: a, label: o.label, onChange: o.onChange, onClose: o.onClose, el: o.el });
    };
  }
  function bind(box, o) {
    if (typeof box === "string") box = document.querySelector(box);
    if (!box) return null;
    var fn = clicker(box, o || {});
    box._dsViewerBound = true;
    box.addEventListener("click", fn);
    return { unbind: function () { box.removeEventListener("click", fn); box._dsViewerBound = false; } };
  }
  document.addEventListener("click", function (e) {
    var box = e.target.closest ? e.target.closest("[data-viewer]") : null;
    if (!box || box._dsViewerBound) return;
    clicker(box, { item: box.getAttribute("data-viewer") || "", label: box.getAttribute("data-viewer-label") || "" })(e);
  });

  viewer.bind = bind;
  viewer.close = function () { if (open) shut(open); };
  window.ds = window.ds || {};
  window.ds.viewer = viewer;
})();
/* ds.photogrid(grid, {sizes, size, key, slider, masonry}): the photo grid of src/photogrid.css, Selecta's masonry made
   generic. Each child of grid is a tile holding an image (a link, a figure…); the tiles fall in columns of even height,
   each one into the shortest column, as tall as its photo's shape: the <img>'s width and height, or its own size once
   loaded (the grid lays itself out again then). It follows the grid's width, tiles added, removed or hidden, and a class
   set on the grid (a filter); after any other change, layout() lays it out again.
   sizes: the widths a column may have, in px ([140, 190, 240, 300]); size: the one to start with (190); key: the device
   remembers the size chosen under it; slider: an <input type="range" class="zoom-slider"> that picks among the sizes,
   from small to large, offering only those that change the grid (a phone has fewer); masonry: false for even rows,
   each photo cut to a square-ish tile. The tiles slide to their new places when the size changes, unless the device
   asks for less motion. Returns {el, size, columns, masonry, layout(), set({size, masonry})}; called again on the same
   grid, it gives the same one. */
(function () {
  "use strict";
  var WORDS = {
    fr: { size: "Taille des photos", columns: function (n) { return n + (n > 1 ? " colonnes" : " colonne"); } },
    en: { size: "Photo size", columns: function (n) { return n + (n > 1 ? " columns" : " column"); } }
  };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  // a duration token as milliseconds: ".3s", "400ms"
  function ms(text) {
    var v = parseFloat(text);
    if (isNaN(v)) return 300;
    return /ms\s*$/.test(text) ? v : v * 1000;
  }
  function clear(t) { ["left", "top", "width", "height"].forEach(function (p) { t.style.removeProperty(p); }); }

  function photogrid(grid, o) {
    if (typeof grid === "string") grid = document.querySelector(grid);
    if (!grid) return null;
    if (grid._dsPhotogrid) return grid._dsPhotogrid;
    o = o || {};
    var sizes = (o.sizes && o.sizes.length ? o.sizes : [140, 190, 240, 300]).map(Number).sort(function (a, b) { return a - b; });
    var slider = typeof o.slider === "string" ? document.querySelector(o.slider) : o.slider || null;
    var want = sizes.indexOf(+o.size), steps = [], lastW = -1, frame = 0;
    if (want < 0) want = Math.min(1, sizes.length - 1);
    if (o.key) { try { var kept = sizes.indexOf(+localStorage.getItem(o.key)); if (kept >= 0) want = kept; } catch (e) {} }
    var g = { el: grid, size: sizes[want], columns: 1, masonry: o.masonry !== false };
    grid._dsPhotogrid = g;
    grid.classList.add("photogrid");

    function gap() { return parseFloat(getComputedStyle(grid).columnGap) || 0; }
    function cols(px, w, s) { return Math.max(1, Math.floor((w + s) / (px + s))); }
    function tiles() { return [].filter.call(grid.children, function (t) { return !t.hidden && getComputedStyle(t).display !== "none"; }); }
    // a tile's height for its width: the <img>'s width and height say it before it loads; a square until then without them
    function ratio(t) {
      var im = t.tagName === "IMG" ? t : t.querySelector("img"), w = 0, h = 0;
      if (im) { w = +im.getAttribute("width"); h = +im.getAttribute("height"); }
      if (!(w && h) && im && im.naturalWidth) { w = im.naturalWidth; h = im.naturalHeight; }
      return w && h ? h / w : 1;
    }
    // the sizes the slider offers: one for each number of columns, the smallest of those that give it, so that every step
    // changes the grid (a phone, with room for two columns at most, has two)
    function stepsFor(w, s) {
      var out = [], last = 0;
      sizes.forEach(function (px, i) { var n = cols(px, w, s); if (n !== last) { out.push(i); last = n; } });
      return out;
    }
    function paint(j, n) {
      if (!slider) return;
      var top = steps.length - 1;
      slider.min = "0";
      slider.step = "1";
      slider.max = String(top);
      if (+slider.value !== j) slider.value = String(j);
      slider.disabled = top === 0;
      slider.setAttribute("aria-valuetext", words().columns(n));
    }
    function layout() {
      var w = grid.clientWidth, s = gap();
      if (!w) return g;
      lastW = w;
      steps = stepsFor(w, s);
      // the size chosen shows as the step with its number of columns (300px on a phone is 190px's single column)
      var n = cols(sizes[want], w, s), j = 0;
      while (j < steps.length - 1 && cols(sizes[steps[j]], w, s) > n) j++;
      var px = sizes[steps[j]];
      g.size = px;
      g.columns = n;
      grid.style.setProperty("--tile", px + "px");
      paint(j, n);
      if (grid.classList.contains("is-masonry") !== g.masonry) grid.classList.toggle("is-masonry", g.masonry);
      if (!g.masonry) { grid.style.removeProperty("height"); [].forEach.call(grid.children, clear); return g; }
      var cw = (w - s * (n - 1)) / n, bottoms = [];
      for (var c = 0; c < n; c++) bottoms.push(0);
      tiles().forEach(function (t) {
        var k = 0;
        for (var c = 1; c < n; c++) if (bottoms[c] < bottoms[k]) k = c;
        // whole pixels, the columns meeting exactly, so that no hairline shows between two photos
        var x = Math.round(k * (cw + s)), x2 = Math.round(k * (cw + s) + cw), h = Math.round((x2 - x) * ratio(t));
        t.style.left = x + "px";
        t.style.top = bottoms[k] + "px";
        t.style.width = (x2 - x) + "px";
        t.style.height = h + "px";
        bottoms[k] += h + s;
      });
      grid.style.height = Math.max(0, Math.max.apply(null, bottoms) - s) + "px";
      return g;
    }
    // the tiles near the screen slide from where they were to their new place (a FLIP, as Selecta's)
    function move(change) {
      if (reduced() || !grid.animate) { change(); return; }
      var vh = window.innerHeight, list = tiles().filter(function (t) { var r = t.getBoundingClientRect(); return r.bottom > -vh && r.top < 2 * vh; });
      var before = list.map(function (t) { return t.getBoundingClientRect(); });
      list.forEach(function (t) { if (t.getAnimations) t.getAnimations().forEach(function (a) { a.cancel(); }); });
      change();
      var time = ms(getComputedStyle(grid).getPropertyValue("--t-mid"));
      list.forEach(function (t, k) {
        var a = before[k], b = t.getBoundingClientRect();
        if (!a.width || !b.width) return;
        var dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
        t.animate([{ transform: "translate(" + dx + "px, " + dy + "px) scale(" + sx + ", " + sy + ")" }, { transform: "none" }],
          { duration: time, easing: "cubic-bezier(.22, 1, .36, 1)" });
      });
    }
    function soon() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    }
    g.layout = layout;
    g.set = function (x) {
      x = x || {};
      var i = x.size != null ? sizes.indexOf(+x.size) : -1;
      if (i >= 0) {
        want = i;
        if (o.key) { try { localStorage.setItem(o.key, String(sizes[i])); } catch (e) {} }
      }
      if (x.masonry != null) g.masonry = !!x.masonry;
      move(layout);
      return g;
    };

    if (slider) {
      if (!slider.hasAttribute("aria-label") && !(slider.labels && slider.labels.length && slider.labels[0].textContent.trim())) slider.setAttribute("aria-label", words().size);
      slider.addEventListener("input", function () { var i = steps[+slider.value]; if (i != null) g.set({ size: sizes[i] }); });
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (grid.clientWidth !== lastW) soon(); }).observe(grid);
    else window.addEventListener("resize", soon);
    // a photo without its width and height takes its shape once loaded
    grid.addEventListener("load", function (e) {
      var im = e.target;
      if (im.tagName === "IMG" && !(im.getAttribute("width") && im.getAttribute("height"))) soon();
    }, true);
    if (window.MutationObserver) {
      new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) {
          var m = list[i];
          if (m.target === grid || (m.attributeName === "hidden" && m.target.parentNode === grid)) { soon(); return; }
        }
      }).observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    }
    return layout();
  }
  window.ds = window.ds || {};
  window.ds.photogrid = photogrid;
})();
