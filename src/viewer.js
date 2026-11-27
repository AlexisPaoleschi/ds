/* ds.viewer(holder, items, {start, onChange, onClose, label, from}): the photo viewer of src/viewer.css, opened on
   items[start]. An item is {src, srcset, sizes, alt, caption, thumb, el}, a plain address, or a function that returns one
   (or a promise of one), called when the photo is first needed: Selecta asks its server for a signed address then.
   caption is the photo's title, on the left of the bar under it, in white (as Selecta's file names), the count on its
   right; nothing is written when an item has none.
   thumb is shown, blurred, while the photo loads; el is the page's element for that photo (a grid's link), where the
   focus goes back on closing.
   The cross, a click beside the photo (the veil), Escape or a finger pulled down close it; the arrows, ← → and a finger
   swiped sideways turn the photos, round and round (under the finger, the next photo comes in from the side as the
   photo leaves, and both go on to their place when it lets go); « 3 / 24 » says where one is; the two neighbours load ahead; the
   spinner turns while a photo loads. Opening moves the focus into it, Tab stays in it, closing gives the focus back to
   what opened it (or to the photo one ended on); the page behind does not scroll meanwhile (viewer-behaviour.css).
   It drives the page's own .viewer when there is one (holder, or a .viewer at the top of <body>: Selecta's, with its
   bar under the photo) and adds the parts it lacks; otherwise it builds one. onChange(index, item, viewer) tells each
   photo shown, onClose(index, viewer) the closing. Returns {el, index, isOpen, go(i), next(), prev(), close()}.
   ds.viewer.bind(container, {item, label, onChange, onClose}): a grid of links (item, "a[href]" by default) opens the
   viewer on a click, each link's href as its photo (data-srcset, data-sizes and data-caption for more, its image as
   thumb and alt). The markup <div data-viewer> does the same with no code at all; data-viewer="selector" names the
   items, data-viewer-label the viewer. Nothing here is written inline, so a page served with script-src 'self' works. */
(function () {
  "use strict";
  // loaded once: a page with both ds.js and ds-photo.js keeps the first, so that nothing is wired twice
  if (window.ds && window.ds.viewer) return;
  var _ = window.ds._, reduced = _.reduced;
  var WORDS = _.table({
    fr: { label: "Photos", prev: "Photo précédente", next: "Photo suivante", failed: "Cette photo n’a pas pu s’ouvrir.",
      one: "Voir la photo", many: "Voir les {n} photos" },
    en: { label: "Photos", prev: "Previous photo", next: "Next photo", failed: "This photo could not be opened.",
      one: "See the photo", many: "See the {n} photos" }
  });
  function words() { return _.words(WORDS); }
  // how far a finger travels to turn the photo, and to close the viewer when pulled down (the site's 50px); a quick flick
  // (FLICK px per ms) turns it sooner
  var SWIPE = 50, DROP = 90, START = 8, FLICK = 0.5;
  var open = null;
  function make(name, cls, parent) {
    var x = _.el(name, cls);
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
    // the next or the previous photo, beside the photo while a finger drags it, then over it until it is drawn
    var peek = stage.querySelector("img.viewer-peek") || make("img", "viewer-peek", stage);
    peek.alt = "";
    peek.hidden = true;
    peek.draggable = false;
    peek.setAttribute("aria-hidden", "true");
    var spin = stage.querySelector(".spinner") || make("span", "spinner is-medium on-photo", stage);
    spin.setAttribute("aria-hidden", "true");
    // the count: where the app put it (Selecta's, beside the heart), or in ds's own bar under the photo, the photo's title on
    // its left as Selecta's name is: the same bar everywhere, and the count never over the photo
    var count = el.querySelector(".viewer-count"), name = null, bar = el.querySelector(".viewer-bar");
    if (!count) {
      if (!bar) { bar = make("div", "viewer-bar is-tools", el); bar._dsOwn = true; }
      var tools = bar.querySelector(".viewer-tools") || make("div", "viewer-tools", bar);
      name = tools.querySelector(".viewer-name") || make("span", "viewer-name", tools);
      count = make("div", "viewer-count", tools);
    }
    count.setAttribute("aria-live", "polite");
    var c = { el: el, veil: veil, stage: stage, img: img, peek: peek, spin: spin, count: count, name: name, bar: bar, items: [], at: 0, opts: {}, token: 0, cache: {}, ready: {}, keep: [],
      before: null, isOpen: false,
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
      else if (t.closest(".viewer-prev")) { c.peekWait = false; show(c, c.at - 1); }
      else if (t.closest(".viewer-next")) { c.peekWait = false; show(c, c.at + 1); }
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
  function wrap(c, i) { var n = c.items.length; return ((i % n) + n) % n; }
  // the neighbours load ahead, so that turning to them shows them at once; once loaded, a finger can drag them in
  function ahead(c, j) {
    j = wrap(c, j);
    var p = item(c, j);
    p.then(function (it) {
      var im = new Image();
      im.onload = function () { if (c.cache[j] === p) c.ready[j] = it; };
      fill(im, it);
      c.keep = c.keep.slice(-3).concat(im);
    }).catch(function () {});
  }
  // the neighbour put away: hidden, back in its place, its photo let go
  function settle(c) {
    c.peekWait = false;
    c.peek.hidden = true;
    c.peek.style.transform = "";
    c.peek.removeAttribute("srcset");
    c.peek.removeAttribute("src");
    c.peek._dsAt = null;
  }
  function caption(c, text) {
    // once a photo of this opening has a caption, its line stays for all, even empty, so that the photos keep their
    // size from one to the next
    if (text) c.captioned = true;
    // ds's own bar: the title on the left, in white, as Selecta's name; the bar only when it has a title or a count. An
    // app with a bar and a count of its own (Selecta's) names its photos itself
    if (!c.name) return;
    c.name.textContent = text;
    if (c.bar._dsOwn) c.bar.hidden = !c.captioned && c.items.length < 2;
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
    // turned by the arrows or the keys: no neighbour waits over the photo
    if (!c.peekWait) settle(c);
    img.classList.add("is-loading");
    img.classList.remove("is-placeholder");
    c.spin.hidden = false;
    // the caption changes with the count, not a moment later
    caption(c, known(c.items[i]).caption || "");
    function done() {
      if (token !== c.token) return;
      // the neighbour that slid in shows the same photo in the same place: they swap at once, without a fade
      var swap = c.peekWait;
      if (swap) c.el.classList.add("is-dragging");
      img.classList.remove("is-loading", "is-placeholder");
      c.spin.hidden = true;
      if (swap) {
        settle(c);
        requestAnimationFrame(function () { if (!c.drag) c.el.classList.remove("is-dragging"); });
      }
    }
    item(c, i).then(function (it) {
      if (token !== c.token) return;
      c.ready[i] = c.ready[i] || it;
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
    _.unlayer(c.layer);
    c.token++;
    c.el.hidden = true;
    c.el.classList.remove("is-open", "is-dragging", "is-sliding");
    settle(c);
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

  // a finger: sideways turns the photo, the next one coming in from the side as on a phone's own photos; down closes; the
  // photo follows it meanwhile. Two fingers zoom, as the browser does.
  function swipes(c) {
    var t = null, el = c.el, peek = c.peek;
    function width() { return c.stage.clientWidth; }
    // the photo under the finger, and its neighbour on the side it comes from (once it is loaded)
    function drag(dx) {
      c.img.style.transform = "translateX(" + dx + "px)";
      if (c.items.length < 2 || !dx) return;
      var dir = dx < 0 ? 1 : -1, j = wrap(c, c.at + dir), it = c.ready[j];
      if (!it) { peek.hidden = true; return; }
      if (peek._dsAt !== j) { fill(peek, it); peek._dsAt = j; }
      peek.hidden = false;
      peek.style.transform = "translateX(" + (dx + dir * width()) + "px)";
    }
    function back() {
      el.classList.remove("is-dragging");
      c.img.style.transform = "";
      c.veil.style.opacity = "";
      if (!peek.hidden && peek._dsAt != null) {
        var dir = wrap(c, c.at + 1) === peek._dsAt ? 1 : -1;
        peek.style.transform = "translateX(" + dir * width() + "px)";
        after(peek, function () { if (!c.drag && !c.peekWait) settle(c); });
      }
    }
    // when an element is done moving (or at once, without motion)
    function after(x, then) {
      var ms = parseFloat(getComputedStyle(x).transitionDuration) * 1000 || 0, gone = false;
      function once() { if (!gone) { gone = true; x.removeEventListener("transitionend", once); then(); } }
      if (!ms) { once(); return; }
      x.addEventListener("transitionend", once);
      setTimeout(once, ms + 80);
    }
    // the photo goes on out the way it was going, its neighbour comes to its place, then the viewer turns to it
    function turn(dir) {
      var j = wrap(c, c.at + dir), w = width(), shown = !peek.hidden && peek._dsAt === j;
      el.classList.remove("is-dragging");
      if (reduced()) { c.img.style.transform = ""; settle(c); show(c, j); return; }
      el.classList.add("is-sliding");
      c.img.style.transform = "translateX(" + -dir * w + "px)";
      if (shown) peek.style.transform = "translateX(0)";
      after(c.img, function () {
        if (!c.isOpen) return;
        // the photo comes back to its place unseen, under its neighbour, which stays until the photo is drawn
        el.classList.add("is-dragging");
        el.classList.remove("is-sliding");
        c.img.style.transform = "";
        c.peekWait = shown;
        if (!shown) settle(c);
        show(c, j);
        requestAnimationFrame(function () { if (!c.peekWait && !c.drag) el.classList.remove("is-dragging"); });
      });
    }
    function reset() {
      t = c.drag = null;
      back();
    }
    el.addEventListener("touchstart", function (e) {
      t = c.drag = null;
      if (!c.isOpen || e.touches.length !== 1 || e.target.closest(".viewer-bar, .viewer-btn")) return;
      // still turning to the last photo: this finger waits for it
      if (el.classList.contains("is-sliding")) return;
      // zoomed in, a finger moves around the photo instead
      if (window.visualViewport && window.visualViewport.scale > 1.01) return;
      t = c.drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dy: 0, axis: "", at: Date.now() };
    }, { passive: true });
    el.addEventListener("touchmove", function (e) {
      if (!t) return;
      if (e.touches.length !== 1) { reset(); return; }
      var dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
      if (!t.axis) {
        if (Math.abs(dx) < START && Math.abs(dy) < START) return;
        t.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        // the photo before may still wait under its neighbour: it is drawn by now, or soon will be
        if (c.peekWait) { c.img.classList.remove("is-loading"); settle(c); }
        el.classList.add("is-dragging");
      }
      t.dx = dx;
      t.dy = dy;
      if (t.axis === "x") { drag(dx); return; }
      var down = Math.max(0, dy);
      c.img.style.transform = "translateY(" + down + "px)";
      c.veil.style.opacity = String(Math.max(0.35, 1 - down / Math.max(1, el.clientHeight) * 1.6));
    }, { passive: true });
    el.addEventListener("touchend", function () {
      if (!t) return;
      var s = t, far = Math.abs(s.dx);
      t = c.drag = null;
      var flick = far > START * 2 && far / Math.max(1, Date.now() - s.at) > FLICK;
      if (s.axis === "x" && c.items.length > 1 && (far > SWIPE || flick)) turn(s.dx < 0 ? 1 : -1);
      else if (s.axis === "y" && s.dy > DROP) { back(); shut(c); }
      else back();
    });
    el.addEventListener("touchcancel", reset);
  }

  function viewer(holder, items, opts) {
    opts = opts || {};
    var el = _.find(holder) || document.querySelector("body > .viewer");
    if (!el) { el = make("div", "viewer", document.body); el.hidden = true; el._dsBuilt = true; }
    var c = setup(el);
    if (open && open !== c) shut(open);
    c.items = [].slice.call(items || []);
    c.opts = opts;
    c.cache = {};
    c.ready = {};
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
      // a layer over the page: Escape closes it, and Tab goes round inside it
      c.layer = _.layer(c.layer || { el: el, close: function () { shut(c); } });
    }
    show(c, opts.start || 0);
    el.focus({ preventScroll: true });
    return c.handle;
  }

  // the arrows turn the photo, before the page's own keys, while the viewer is the top layer (a window of ds.confirm over
  // it keeps its keys); Escape and Tab are the layers' (src/core.js)
  document.documentElement.addEventListener("keydown", function (e) {
    var c = open;
    if (!c || e.defaultPrevented || _.top() !== c.layer) return;
    // in a field of the app's bar (Selecta's note), the keys belong to the field
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (c.items.length > 1) { e.preventDefault(); c.peekWait = false; show(c, c.at + (e.key === "ArrowRight" ? 1 : -1)); }
    }
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
      viewer(o.el || null, all.map(linkItem), { start: at, from: a, label: o.label, onChange: o.onChange, onClose: o.onClose });
    };
  }
  function bind(box, o) {
    box = _.find(box);
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

  // A post's photos as a small square at the head of its row (.row-thumb, 6.8.0): the first one, how many there are in
  // its corner, a play mark on a video's cover (an item's video); a click opens them all in the viewer, from the first.
  // An item is {thumb, src, alt, video}; without one, an empty square that keeps the rows aligned.
  // opts: label (the viewer's and the square's name for a screen reader), caption (under each photo).
  function thumb(items, o) {
    o = o || {};
    var list = [].filter.call(items || [], function (x) { return x && (x.thumb || x.src); });
    if (!list.length) {
      var none = _.el("span", "row-thumb is-empty");
      none.setAttribute("aria-hidden", "true");
      return none;
    }
    var w = words(), b = _.el("button", "row-thumb" + (list[0].video ? " is-video" : ""));
    b.type = "button";
    b.setAttribute("aria-label", (list.length > 1 ? w.many.replace("{n}", list.length) : w.one) + (o.label ? " · " + o.label : ""));
    var img = _.el("img");
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = list[0].thumb || list[0].src;
    b.appendChild(img);
    if (list.length > 1) { var n = _.el("span", "row-thumb-n"); n.textContent = String(list.length); b.appendChild(n); }
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      viewer(null, list.map(function (x) { return { src: x.src || x.thumb, thumb: x.thumb || "", alt: x.alt || "", caption: o.caption || "" }; }),
        { start: 0, from: b, label: o.label });
    });
    return b;
  }

  /* ds.viewer.strip(items, {label, caption}): a row of portrait tiles, one per item (a day's stories), each its photo, a
     figure under it (item.figure: words, or nodes as an icon and a number) and a bar of its tone at its foot (item.tone:
     good, mid or bad, a verdict's); item.best rings the best one in gold. A click on a tile opens them all in the viewer,
     at that one (item.caption, else o.caption, under each). An item without a photo keeps an empty tile, its figure
     still there. The row scrolls sideways when it is longer than its room. Gives back the <ol class="thumb-strip">. */
  function strip(items, o) {
    o = o || {};
    var list = [].slice.call(items || []), w = words(), shown = [], at = [];
    list.forEach(function (x, i) { if (x && (x.thumb || x.src)) { at[i] = shown.length; shown.push(x); } });
    var box = _.el("ol", "thumb-strip");
    if (o.label) box.setAttribute("aria-label", o.label);
    list.forEach(function (x, i) {
      x = x || {};
      var li = _.el("li", (x.tone ? "is-" + x.tone : "") + (x.best ? " is-best" : "")), has = at[i] != null;
      var tile = _.el(has ? "button" : "span", "thumb-strip-photo" + (x.video ? " is-video" : "") + (has ? "" : " is-empty"));
      if (has) {
        tile.type = "button";
        tile.setAttribute("aria-label", w.one + (x.label ? " · " + x.label : ""));
        var img = _.el("img");
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = x.thumb || x.src;
        tile.appendChild(img);
        tile.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          viewer(null, shown.map(function (y) { return { src: y.src || y.thumb, thumb: y.thumb || "", alt: y.alt || "", caption: y.caption || o.caption || "" }; }),
            { start: at[i], from: tile, label: o.label });
        });
      } else tile.setAttribute("aria-hidden", "true");
      li.appendChild(tile);
      if (x.figure != null) {
        var fig = _.el("span", "thumb-strip-fig");
        [].concat(x.figure).forEach(function (n) { if (n != null) fig.append(n); });
        li.appendChild(fig);
      }
      box.appendChild(li);
    });
    return box;
  }

  viewer.bind = bind;
  viewer.thumb = thumb;
  viewer.strip = strip;
  viewer.close = function () { if (open) shut(open); };
  window.ds = window.ds || {};
  window.ds.viewer = viewer;
})();
