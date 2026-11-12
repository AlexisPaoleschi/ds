/* The core every bundle of ds starts with (ds.js, ds-photo.js, ds-site.js): the small helpers its modules share, written
   once. A page that links several bundles keeps the first core, so that its listeners are wired once.
   Public: ds.h(tag, attrs, kids) builds a node: attrs.class, attrs.text, attrs.style, on… as real listeners (an inline
   handler would be blocked by a strict page), anything else as an attribute; null and false are skipped, strings become
   text. ds.esc(text) makes a text harmless in HTML written as a string. ds.ico(name, cls) is an icon of the sprite.
   ds.day works with Paris's days, written "2026-11-09" and counted at noon UTC so that no clock change moves them:
   today(), key(date), at(key) (its Date), add(key, n), weekStart(key) (its Monday), format(key, options).
   For ds's own modules, ds._: english(), words(table), table(own) (a module's words over the shared ones), el(name, cls,
   kids) (kids: a text, a node or a list), find(element or selector), read(key, session) and write(key, value, session)
   (the device's storage, which may refuse), reduced() (less motion asked), ms(text) (a duration token in ms), tone(c)
   (a colour given as a token's name, "--c-bleu", or as a value), and the layers: what covers the page (a window, a sheet,
   the photo viewer, the phone's drawer, a date picker's popover, the site's phone menu) is opened with layer({el, close,
   trap, loose}) (el: the element, or a function that finds it) and closed with unlayer(layer). Escape closes the top layer only; Tab goes round inside it when it traps
   (trap: false for a popover; loose: only while the focus is inside, as in a sheet whose picker floats outside it). */
(function () {
  "use strict";
  if (window.ds && window.ds._) return;
  var ds = window.ds = window.ds || {};
  var SVGNS = "http://www.w3.org/2000/svg", TZ = "Europe/Paris";

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
      else node.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return node;
  }
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

  // Paris's days
  function key(d) { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }
  function at(k) { return new Date(k + "T12:00:00Z"); }
  function add(k, n) { var d = at(k); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  var day = {
    today: function () { return key(new Date()); },
    key: key,
    at: at,
    add: add,
    weekStart: function (k) { return add(k, -((at(k).getUTCDay() + 6) % 7)); },
    format: function (k, o) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", Object.assign({ timeZone: "UTC" }, o)).format(at(k)); }
  };

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

  ds._ = { english: english, words: words, table: table, el: el, find: find, read: read, write: write, reduced: reduced,
    ms: ms, tone: tone, focusables: focusables, layer: layer, unlayer: unlayer, top: top };
  ds.h = h;
  ds.esc = esc;
  ds.ico = ico;
  ds.day = day;
})();
