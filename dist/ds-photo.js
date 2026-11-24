/* ds 5.16.0 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
/* The core every bundle of ds starts with (ds.js, ds-photo.js, ds-site.js): the small helpers its modules share, written
   once. A page that links several bundles keeps the first core, so that its listeners are wired once.
   Public: ds.h(tag, attrs, kids) builds a node: attrs.class, attrs.text, attrs.style, on… as real listeners (an inline
   handler would be blocked by a strict page), anything else as an attribute (an href or a src that would run a script
   is left out); null and false are skipped, strings become text. ds.esc(text) makes a text harmless in HTML written as a string. ds.ico(name, cls) is an icon of the sprite (ds.ico.html(name,
   cls) the same as HTML).
   ds.day works with Paris's days, written "2026-11-09" and counted at noon UTC so that no clock change moves them:
   today(), key(date), at(key) (its Date), add(key, n), weekStart(key) (its Monday), format(key, options), hour(date) (the
   hour at Paris, 0 to 23, now when no date is given), addMonths(key or month, n) (a month "2026-11" moved by n months,
   or a day moved by n months and kept inside its month: the 31st of January plus one month is the 28th or 29th of
   February), monthEnd(month or key) (the month's last day, "2026-11-30") and diff(from, to) (the days from one to the
   other, negative when to comes first).
   On an iPhone or an iPad, the page's viewport gets maximum-scale=1 so that touching a field never zooms (pinching still does).
   For ds's own modules, ds._: english(), words(table), table(own) (a module's words over the shared ones), el(name, cls,
   kids) (kids: a text, a node or a list), find(element or selector), read(key, session) and write(key, value, session)
   (the device's storage, which may refuse), reduced() (less motion asked), ms(text) (a duration token in ms), tone(c)
   (a colour given as a token's name, "--c-bleu", or as a value), intl(kind, locale, options) (an Intl formatter, made
   once for those options: intl("NumberFormat", "fr-FR", {…}).format(n)), and the layers: what covers the page (a window, a sheet,
   the photo viewer, the phone's drawer, a date picker's popover, the site's phone menu) is opened with layer({el, close,
   trap, loose}) (el: the element, or a function that finds it) and closed with unlayer(layer). Escape closes the top layer only; Tab goes round inside it when it traps
   (trap: false for a popover; loose: only while the focus is inside, as in a sheet whose picker floats outside it). */
(function () {
  "use strict";
  if (window.ds && window.ds._) return;
  var ds = window.ds = window.ds || {};
  var SVGNS = "http://www.w3.org/2000/svg", TZ = "Europe/Paris";

  // An iPhone or an iPad zooms the page into a field whose text is under 16px, and stays zoomed when the field is left.
  // maximum-scale=1 on the viewport stops that, and iOS still lets the fingers pinch to zoom (it ignores the limit for
  // them); Android does not, so only iOS gets it. An iPad that says it is a Mac is told by its touch screen.
  (function () {
    var m = document.querySelector('meta[name="viewport"]'), ua = navigator.userAgent || "", platform = navigator.platform || "";
    var ios = /iPhone|iPad|iPod/.test(ua) || (/Mac/.test(platform) && navigator.maxTouchPoints > 1);
    if (ios && m && !/maximum-scale/.test(m.content)) m.content = m.content + ", maximum-scale=1";
  })();

  // the page's language, read each time, so that a page that changes it is followed
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }
  // the words every module says; a module's own table adds to them
  var COMMON = {
    fr: { close: "Fermer", cancel: "Annuler" },
    en: { close: "Close", cancel: "Cancel" }
  };
  function table(own) {
    own = own || {};
    return { fr: Object.assign({}, COMMON.fr, own.fr), en: Object.assign({}, COMMON.en, own.en) };
  }
  function words(t) { return english() ? (t || COMMON).en : (t || COMMON).fr; }

  function find(x) { return typeof x === "string" ? document.querySelector(x) : x; }
  // an element with its class and either its text or its children (null and false skipped)
  function el(name, cls, kids) {
    var e = document.createElement(name);
    if (cls) e.className = cls;
    if (kids == null) return e;
    if (typeof kids === "string" || typeof kids === "number") e.textContent = kids;
    else [].concat(kids).forEach(function (k) { if (k != null && k !== false) e.append(k); });
    return e;
  }
  function esc(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function h(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "style") node.setAttribute("style", v);
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2), v);
      // an address that would run a script is left out (a link built from data: a note, a merchant's site)
      else if (/^(href|src|action|formaction)$/.test(k) && /^\s*(javascript|vbscript|data:text\/html)/i.test(String(v).replace(/[\u0000-\u001f]/g, ""))) continue;
      else node.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return node;
  }
  // the same as HTML, for a page that writes strings
  function icoHtml(name, cls) { return '<svg class="ico' + (cls ? " " + esc(cls) : "") + '" aria-hidden="true"><use href="#i-' + esc(name) + '"/></svg>'; }
  function ico(name, cls) {
    var svg = document.createElementNS(SVGNS, "svg"), use = document.createElementNS(SVGNS, "use");
    svg.setAttribute("class", "ico" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  // the device's storage, which a private window or a strict browser may refuse: null, and nothing kept
  function read(key, session) {
    try { return (session ? sessionStorage : localStorage).getItem(key); } catch (e) { return null; }
  }
  function write(key, value, session) {
    try {
      var s = session ? sessionStorage : localStorage;
      if (value == null) s.removeItem(key); else s.setItem(key, value);
    } catch (e) {}
  }
  function reduced() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  // a duration token as milliseconds: ".3s", "400ms" (300 when it cannot be read)
  function ms(text) {
    var v = parseFloat(text);
    if (isNaN(v)) return 300;
    return /ms\s*$/.test(text) ? v : v * 1000;
  }
  function tone(c) { return /^--/.test(c) ? "var(" + c + ")" : c; }

  // a date's or a figure's formatter (Intl.DateTimeFormat, Intl.NumberFormat), made once for each language and options
  // and kept: making one costs far more than using it (Safari above all), and a list of operations writes hundreds of
  // dates and amounts (21 November 2026: 386 made each time Bank's Opérations tab was opened)
  var formatters = {};
  function intl(kind, locale, options) {
    var k = kind + "|" + locale + "|" + JSON.stringify(options || {});
    return formatters[k] || (formatters[k] = new Intl[kind](locale, options));
  }

  // Paris's days
  function key(d) { return intl("DateTimeFormat", "en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }
  function at(k) { return new Date(k + "T12:00:00Z"); }
  function add(k, n) { var d = at(k); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  var day = {
    today: function () { return key(new Date()); },
    key: key,
    at: at,
    add: add,
    weekStart: function (k) { return add(k, -((at(k).getUTCDay() + 6) % 7)); },
    format: function (k, o) { return intl("DateTimeFormat", english() ? "en-GB" : "fr-FR", Object.assign({ timeZone: "UTC" }, o)).format(at(k)); },
    hour: function (d) { return +intl("DateTimeFormat", "en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(d || new Date()); },
    addMonths: addMonths,
    monthEnd: monthEnd,
    diff: function (from, to) { return Math.round((at(to) - at(from)) / 864e5); }
  };
  // a month moved by n months ("2026-11", -1 gives "2026-10"); a day keeps its number, or its month's last day
  function addMonths(k, n) {
    var m = new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1 + n, 1)).toISOString().slice(0, 7);
    if (k.length === 7) return m;
    var end = monthEnd(m);
    return m + "-" + String(Math.min(+k.slice(8, 10), +end.slice(8, 10))).padStart(2, "0");
  }
  function monthEnd(k) {
    var d = new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7), 0));
    return d.toISOString().slice(0, 10);
  }

  // the layers over the page, the last one on top
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var layers = [];
  function focusables(box) {
    return [].filter.call(box.querySelectorAll(FOCUSABLE), function (x) { return x.getClientRects().length > 0; });
  }
  function unlayer(l) { var i = layers.indexOf(l); if (i >= 0) layers.splice(i, 1); }
  function layer(l) { unlayer(l); layers.push(l); return l; }
  function top() { return layers[layers.length - 1] || null; }
  // Tab goes round inside the box, never to the page behind it
  function trap(e, box) {
    var list = focusables(box), at = document.activeElement;
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (!box.contains(at)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (e.shiftKey && (at === first || at === box)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }
  // on <html>, after the element that has the focus: a field that takes its own Escape (a picker's search) keeps it
  document.documentElement.addEventListener("keydown", function (e) {
    var l = top();
    if (!l || e.defaultPrevented) return;
    if (e.key === "Escape") {
      if (l.close) { e.preventDefault(); l.close(); }
    } else if (e.key === "Tab" && l.trap !== false) {
      // el may be a function, for a layer its page draws again (the drawer's panel)
      var box = typeof l.el === "function" ? l.el() : l.el;
      if (box && (!l.loose || box.contains(document.activeElement))) trap(e, box);
    }
  });

  /* ds.today(): Paris's day, "2026-11-12", whatever the device's clock says (the same as ds.day.today()). */
  function today() { return day.today(); }

  ds._ = { english: english, words: words, table: table, el: el, find: find, read: read, write: write, reduced: reduced,
    ms: ms, tone: tone, focusables: focusables, layer: layer, unlayer: unlayer, top: top, intl: intl };
  ds.h = h;
  ds.esc = esc;
  ds.ico = ico;
  ico.html = icoHtml;
  ds.day = day;
  ds.today = today;
})();
/* ds.viewer(holder, items, {start, onChange, onClose, label, from}): the photo viewer of src/viewer.css, opened on
   items[start]. An item is {src, srcset, sizes, alt, caption, thumb, el}, a plain address, or a function that returns one
   (or a promise of one), called when the photo is first needed: Selecta asks its server for a signed address then.
   thumb is shown, blurred, while the photo loads; el is the page's element for that photo (a grid's link), where the
   focus goes back on closing.
   The cross, a click beside the photo (the veil), Escape or a finger pulled down close it; the arrows, ← → and a finger
   swiped sideways turn the photos, round and round; « 3 / 24 » says where one is; the two neighbours load ahead; the
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
    fr: { label: "Photos", prev: "Photo précédente", next: "Photo suivante", failed: "Cette photo n’a pas pu s’ouvrir." },
    en: { label: "Photos", prev: "Previous photo", next: "Next photo", failed: "This photo could not be opened." }
  });
  function words() { return _.words(WORDS); }
  // how far a finger travels to turn the photo, and to close the viewer when pulled down (the site's 50px)
  var SWIPE = 50, DROP = 90, START = 8;
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
    var spin = stage.querySelector(".spinner") || make("span", "spinner is-medium on-photo", stage);
    spin.setAttribute("aria-hidden", "true");
    // the count: where the app put it (Selecta's, beside the heart), or in the stage's bottom right corner
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
    _.unlayer(c.layer);
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

  function viewer(holder, items, opts) {
    opts = opts || {};
    var el = _.find(holder) || document.querySelector("body > .viewer");
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
      if (c.items.length > 1) { e.preventDefault(); show(c, c.at + (e.key === "ArrowRight" ? 1 : -1)); }
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
   each photo cut to a square-ish tile; layoutKey: the device remembers the layout chosen (grid or masonry) under it;
   layouts: the element holding the layout's buttons ([data-layout="grid"] and [data-layout="masonry"], pressed for the
   one shown), which switch it. The tiles slide to their new places when the size changes, unless the device
   asks for less motion. Returns {el, size, columns, masonry, layout(), set({size, masonry})}; called again on the same
   grid, it gives the same one. */
(function () {
  "use strict";
  // loaded once: a page with both ds.js and ds-photo.js keeps the first, so that nothing is wired twice
  if (window.ds && window.ds.photogrid) return;
  var _ = window.ds._, reduced = _.reduced, ms = _.ms;
  var WORDS = _.table({
    fr: { size: "Taille des photos", columns: function (n) { return n + (n > 1 ? " colonnes" : " colonne"); } },
    en: { size: "Photo size", columns: function (n) { return n + (n > 1 ? " columns" : " column"); } }
  });
  function words() { return _.words(WORDS); }
  function clear(t) { ["left", "top", "width", "height"].forEach(function (p) { t.style.removeProperty(p); }); }

  function photogrid(grid, o) {
    grid = _.find(grid);
    if (!grid) return null;
    if (grid._dsPhotogrid) return grid._dsPhotogrid;
    o = o || {};
    var sizes = (o.sizes && o.sizes.length ? o.sizes : [140, 190, 240, 300]).map(Number).sort(function (a, b) { return a - b; });
    var slider = _.find(o.slider) || null;
    var want = sizes.indexOf(+o.size), steps = [], lastW = -1, frame = 0;
    if (want < 0) want = Math.min(1, sizes.length - 1);
    if (o.key) { var kept = sizes.indexOf(+_.read(o.key)); if (kept >= 0) want = kept; }
    var g = { el: grid, size: sizes[want], columns: 1, masonry: o.masonry !== false };
    if (o.layoutKey) { var lk = _.read(o.layoutKey); if (lk === "grid" || lk === "masonry") g.masonry = lk === "masonry"; }
    var switcher = _.find(o.layouts) || null;
    function showLayout() {
      if (switcher) [].forEach.call(switcher.querySelectorAll("[data-layout]"), function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-layout") === "masonry") === g.masonry)); });
    }
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
        if (o.key) _.write(o.key, String(sizes[i]));
      }
      if (x.masonry != null) {
        g.masonry = !!x.masonry;
        if (o.layoutKey) _.write(o.layoutKey, g.masonry ? "masonry" : "grid");
        showLayout();
      }
      move(layout);
      return g;
    };

    if (slider) {
      if (!slider.hasAttribute("aria-label") && !(slider.labels && slider.labels.length && slider.labels[0].textContent.trim())) slider.setAttribute("aria-label", words().size);
      slider.addEventListener("input", function () { var i = steps[+slider.value]; if (i != null) g.set({ size: sizes[i] }); });
    }
    if (switcher) {
      showLayout();
      switcher.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("[data-layout]");
        if (b && b.getAttribute("aria-pressed") !== "true") g.set({ masonry: b.getAttribute("data-layout") === "masonry" });
      });
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
/* The photo kit's behaviours (the audit of 23 November 2026, Selecta's galleries), in ds-photo.js.
   ds.dropzone(zone, {input, button, onFiles, one}): the .dropzone takes files dropped on it (gold while they are dragged
   over it, .is-over) or chosen with its <input type="file"> (input, opened by button); onFiles(files) with a list of
   File, or the first one only (one). Gives back the zone.
   ds.upload(files, {url, list, field, concurrent, total, retry, done, fail}): each file sent to url (POST, the form's
   field, "file") through ds.api, concurrent at once (3), the others waiting their turn; one row each in list (a
   ul.rows.is-cards: li.upload-row, its name, its bar, what happened, « Réessayer » if it failed, the row going 1.2 s
   after it is done); total: {el, bar, label, words(done, all)} shows the batch's bar and « 3 sur 12 », hidden 2.5 s
   after the last file. done(result, file) after each file sent; fail(error, file) gives back the words shown on its
   row (else « Échec »). Gives back nothing: rows and bars say how it goes. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  if (ds.upload) return;
  var WORDS = _.table({
    fr: { retry: "Réessayer", failed: "Échec", progress: function (d, n) { return d + " sur " + n; } },
    en: { retry: "Try again", failed: "Failed", progress: function (d, n) { return d + " of " + n; } }
  });

  function dropzone(zone, o) {
    zone = _.find(zone);
    if (!zone) return null;
    o = o || {};
    var input = _.find(o.input), button = _.find(o.button);
    function give(list) {
      var files = [].slice.call(list || []);
      if (!files.length || !o.onFiles) return;
      o.onFiles(o.one ? files[0] : files);
    }
    zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-over"); });
    zone.addEventListener("dragleave", function () { zone.classList.remove("is-over"); });
    zone.addEventListener("drop", function (e) { e.preventDefault(); zone.classList.remove("is-over"); give(e.dataTransfer && e.dataTransfer.files); });
    if (button && input) button.addEventListener("click", function () { input.click(); });
    if (input) input.addEventListener("change", function () { give(input.files); input.value = ""; });
    return zone;
  }

  // the batch: each file sent and how much of it, so that the total bar follows them all
  var running = 0, waiting = [], batch = new Map(), batchTimer = null;
  function upload(files, o) {
    o = o || {};
    var list = _.find(o.list), w = _.words(WORDS), most = o.concurrent || 3, total = o.total || null;
    function fill(bar, pct) {
      bar.setAttribute("aria-valuenow", String(pct));
      var i = bar.querySelector("i");
      if (i) i.style.width = pct + "%";
    }
    function showTotal() {
      if (!total) return;
      var loaded = 0, size = 0, done = 0, settled = 0;
      batch.forEach(function (b) { loaded += b.loaded; size += b.total; if (b.state === "done") done++; if (b.state !== "pending") settled++; });
      var el = _.find(total.el), bar = _.find(total.bar), label = _.find(total.label);
      if (el) el.hidden = false;
      if (bar) fill(bar, size ? Math.round(loaded / size * 100) : 0);
      if (label) label.textContent = (total.words || w.progress)(done, batch.size);
      if (settled === batch.size) {
        clearTimeout(batchTimer);
        batchTimer = setTimeout(function () {
          var still = false;
          batch.forEach(function (b) { if (b.state === "pending") still = true; });
          if (!still) { batch.clear(); if (el) el.hidden = true; }
        }, 2500);
      }
    }
    function next() {
      running--;
      var t = waiting.shift();
      if (t) { running++; t(); }
    }
    function schedule(task) {
      if (running < most) { running++; task(); } else waiting.push(task);
    }
    [].slice.call(files || []).forEach(function (file) {
      var bar = _.el("span", "meter"), status = _.el("span", "upload-row-status"), retry = _.el("button", "btn is-act", o.retry || w.retry);
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");
      bar.setAttribute("aria-label", file.name);
      bar.append(_.el("i"));
      fill(bar, 0);
      retry.type = "button";
      retry.hidden = true;
      var row = _.el("li", "upload-row", [_.el("span", "upload-row-name", file.name), bar, status, retry]);
      if (list) list.appendChild(row);
      function enter() { batch.set(file, { loaded: 0, total: file.size || 1, state: "pending" }); showTotal(); }
      function task() {
        var data = new FormData();
        data.append(o.field || "file", file);
        ds.api("POST", o.url, data, { retry: false, progress: function (loaded, size) {
          fill(bar, Math.round(loaded / size * 100));
          var b = batch.get(file);
          if (b) { b.loaded = loaded; b.total = size; showTotal(); }
        } }).then(function (result) {
          fill(bar, 100);
          status.textContent = "✓";
          var b = batch.get(file);
          if (b) { b.state = "done"; b.loaded = b.total; }
          showTotal();
          if (o.done) o.done(result, file);
          setTimeout(function () { row.remove(); }, 1200);
        }, function (error) {
          var b = batch.get(file);
          if (b) { b.state = "failed"; b.loaded = b.total; }
          showTotal();
          status.textContent = (o.fail && o.fail(error, file)) || w.failed;
          retry.hidden = false;
        }).then(next, next);
      }
      retry.addEventListener("click", function () {
        retry.hidden = true;
        status.textContent = "";
        fill(bar, 0);
        enter();
        schedule(task);
      });
      enter();
      schedule(task);
    });
  }

  ds.dropzone = dropzone;
  ds.upload = upload;
})();
