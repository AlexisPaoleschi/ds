/* ds 7.1.0 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
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
/* Design system: the behaviour every app shares.
   ds.toast({type, text, action, duration, key}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close); a key keeps one bubble per subject: the next
   message with the same key changes it (a wait that becomes its answer) instead of piling up.
   type: "good" (done, 4 s), "info" (5 s), "busy" (until changed), "bad" (stays until closed); an action keeps it 8 s.
   ds.confirm({title, text, ok, danger, value}) asks in a window instead of the browser's boxes (see below).
   ds.when(t), ds.ago(t) and ds.soon(t) say a time in words, in Paris's time; ds.date(t, style) writes a date;
   ds.number(n) and ds.money(n) write figures; ds.api(method, url, body) asks the app's server; ds.h and ds.ico build
   nodes, ds.esc makes a text harmless in HTML; ds.compact writes a short figure; ds.avatar a logo with its
   initial; ds.fold keeps foldable sections as left; ds.route and ds.seek follow the address after #. Rows that open, forms
   that ask before deleting and the messages left after a redirect work by themselves (see below).
   The tools' own behaviours (the filters' drawer, the sources' state, the syncs, the header's wheel, a source that
   failed) are in ds-tools.js (src/tools.js), which Bank and Studio link after this file.
   Their own words follow the page's language, <html lang>: English for "en…", French otherwise. */
(function () {
  "use strict";
  var _ = window.ds._, english = _.english, h = window.ds.h;
  var LIFE = { good: 4000, info: 5000, busy: 0, bad: 0 };
  var WORDS = _.table({
    fr: { confirm: "Confirmer",
          never: "jamais", today: "aujourd'hui", yesterday: "hier", tomorrow: "demain", on: "le ", at: " à ", now: "à l’instant",
          ago: function (x) { return "il y a " + x; }, soon: "dans un instant", in: function (x) { return "dans " + x; },
          restart: "Le serveur redémarre (mise à jour en cours).", offline: "Le serveur ne répond pas : réessaie dans un instant." },
    en: { confirm: "Confirm",
          never: "never", today: "today", yesterday: "yesterday", tomorrow: "tomorrow", on: "on ", at: " at ", now: "just now",
          ago: function (x) { return x + " ago"; }, soon: "in a moment", in: function (x) { return "in " + x; },
          restart: "The server is restarting (an update is on its way).", offline: "The server does not answer: try again in a moment." }
  });
  // read when a message or a window opens, so that a page that changes its language is followed
  function words() { return _.words(WORDS); }
  var stack = null, live = [], said = {};
  // the bubbles' place, made once the page is there, with two lines read aloud that stay in it from the start: a
  // screen reader follows a region that was already on the page, not always one added with its words
  function holder() {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toasts";
      said.polite = document.createElement("div");
      said.polite.className = "visually-hidden";
      said.polite.setAttribute("role", "status");
      said.polite.setAttribute("aria-live", "polite");
      said.alert = document.createElement("div");
      said.alert.className = "visually-hidden";
      said.alert.setAttribute("role", "alert");
      said.alert.setAttribute("aria-live", "assertive");
      stack.append(said.polite, said.alert);
      document.body.appendChild(stack);
    }
    return stack;
  }
  // what a bubble says goes to the line read aloud: emptied first, so that the same words are read again
  function say(text, alert) {
    holder();
    var region = alert ? said.alert : said.polite;
    region.textContent = "";
    setTimeout(function () { region.textContent = text; }, 50);
  }
  // the longest of an element's transitions, in milliseconds (0 when it has none, or when motion is reduced)
  function lasts(el) {
    return Math.max.apply(null, getComputedStyle(el).transitionDuration.split(",").map(function (v) {
      return (parseFloat(v) || 0) * (/ms\s*$/.test(v) ? 1 : 1000);
    }));
  }
  function toast(opts) {
    opts = opts || {};
    // the same subject (key: a wait that turns into its answer) or the same words again change the message already there
    // instead of piling up
    for (var i = 0; i < live.length; i++) if (opts.key ? live[i].key === opts.key : live[i].text === opts.text) return live[i].update(opts);
    var el = document.createElement("div"), t = { el: el, key: opts.key || null, text: opts.text, life: 0, timer: null, gone: false };
    el.innerHTML = '<span class="mark" aria-hidden="true"></span><span class="txt"></span>' +
      '<button type="button" class="act" hidden></button><button type="button" class="toast-close" aria-label="' + words().close + '"></button>';
    // the sprite's cross, in the middle of its square, as every cross of the design system
    el.querySelector(".toast-close").appendChild(window.ds.ico("close"));
    el.querySelector(".toast-close").onclick = function () { t.close(); };
    // the countdown waits while the pointer, a finger or the keyboard is on the message
    el.addEventListener("pointerenter", function () { clearTimeout(t.timer); });
    el.addEventListener("pointerleave", function () { if (!el.contains(document.activeElement)) t.arm(); });
    el.addEventListener("focusin", function () { clearTimeout(t.timer); });
    el.addEventListener("focusout", function (e) { if (!el.contains(e.relatedTarget) && !el.matches(":hover")) t.arm(); });
    t.arm = function () {
      clearTimeout(t.timer);
      if (t.life) t.timer = setTimeout(t.close, t.life);
    };
    t.update = function (o) {
      var type = o.type || "good", act = el.querySelector(".act");
      el.className = "toast is-" + type;
      el.querySelector(".txt").textContent = o.text || "";
      // read aloud by the lines that stay on the page; a message that went wrong at once
      if (o.text && o.text !== el._said) say(o.text, type === "bad");
      el._said = o.text;
      t.text = o.text;
      act.hidden = !o.action;
      if (o.action) {
        act.textContent = o.action.label;
        act.onclick = function () { t.close(); o.action.run(); };
      }
      t.life = o.duration != null ? o.duration : o.action ? 8000 : LIFE[type] || 0;
      t.arm();
      return t;
    };
    t.close = function () {
      if (t.gone) return;
      t.gone = true;
      clearTimeout(t.timer);
      live.splice(live.indexOf(t), 1);
      el.classList.add("is-leaving");
      // taken away once its fade is over, however long the theme makes it
      setTimeout(function () { el.remove(); }, lasts(el) + 20);
    };
    holder().appendChild(el);
    live.push(t);
    // three at most: the oldest goes
    while (live.length > 3) live[0].close();
    return t.update(opts);
  }
  // ds.confirm({title, text, ok, danger, value, placeholder, inputmode, autocomplete, maxlength, check}) asks in a window of
  // the design system and answers with a promise:
  // false when cancelled, true when confirmed, or the typed text when the window has a field (value).
  // check: a box under the field, or under the text ({label, checked}, Bank's « Seulement cette opération »); the answer
  // is then {value, checked}, value being the typed text (or true), and still false when cancelled.
  // A dangerous answer (danger) starts on « Annuler » (Cancel), so Enter never deletes by mistake.
  var dialogs = 0;
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var veil = document.createElement("div"), field = opts.value != null, n = ++dialogs;
      veil.className = "dialog-veil";
      veil.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-t-' + n + '"><h2 class="dialog-t" id="dialog-t-' + n + '"></h2>' +
        '<p class="dialog-text" id="dialog-text-' + n + '"></p>' + (field ? '<input class="dialog-in" type="text" aria-labelledby="dialog-t-' + n + '">' : "") +
        (opts.check ? '<label class="dialog-check"><input type="checkbox"><span></span></label>' : "") +
        '<div class="dialog-b"><button type="button" class="btn dialog-no">' + words().cancel + '</button><button type="button" class="btn dialog-ok"></button></div></div>';
      var ok = veil.querySelector(".dialog-ok"), no = veil.querySelector(".dialog-no"), input = veil.querySelector(".dialog-in"), text = veil.querySelector(".dialog-text");
      var check = veil.querySelector(".dialog-check input");
      if (check) { check.nextSibling.textContent = opts.check.label || ""; check.checked = !!opts.check.checked; }
      // the answer, with the box when there is one
      function said(v) { return check && v !== false ? { value: v, checked: check.checked } : v; }
      veil.querySelector(".dialog-t").textContent = opts.title || "";
      text.textContent = opts.text || "";
      text.hidden = !opts.text;
      if (opts.text) veil.firstChild.setAttribute("aria-describedby", text.id);
      ok.textContent = opts.ok || words().confirm;
      ok.classList.add(opts.danger ? "is-danger" : "is-save");
      if (input) {
        input.value = opts.value;
        input.placeholder = opts.placeholder || "";
        // a code received by SMS: the figures' keyboard, and the phone offering the code it just got
        if (opts.inputmode) input.inputMode = opts.inputmode;
        if (opts.autocomplete) input.setAttribute("autocomplete", opts.autocomplete);
        if (opts.maxlength) input.maxLength = opts.maxlength;
      }
      var before = document.activeElement, box = veil.firstChild, stilled = [];
      // the top layer: Escape cancels it, and Tab goes round inside it, never to the page behind
      var top = _.layer({ el: box, close: function () { end(false); } });
      function end(answer) {
        _.unlayer(top);
        document.removeEventListener("keydown", key, true);
        stilled.forEach(function (x) { x.inert = false; });
        veil.remove();
        if (before && before.focus) before.focus();
        done(answer);
      }
      // Enter in its field answers with the text
      function key(e) {
        if (e.key === "Enter" && input && document.activeElement === input) { e.preventDefault(); end(said(input.value)); }
      }
      ok.onclick = function () { end(said(input ? input.value : true)); };
      no.onclick = function () { end(false); };
      veil.addEventListener("click", function (e) { if (e.target === veil) end(false); });
      document.addEventListener("keydown", key, true);
      // the page behind no longer answers, to a pointer, the keyboard or a screen reader; the bubbles still do
      [].forEach.call(document.body.children, function (x) {
        if (!x.inert && !x.classList.contains("toasts")) { x.inert = true; stilled.push(x); }
      });
      document.body.appendChild(veil);
      if (input) { input.focus(); input.select(); } else (opts.danger ? no : ok).focus();
    });
  }

  /* ds.when(t): « aujourd'hui à 6h00 », « hier à 21h04 », « le 1er nov. à 9h00 » (« today at 6:00 »… in English);
     ds.ago(t): « à l’instant », « il y a 3 min », « il y a 2h05 », then as when; ds.soon(t): « dans 12 min », then as when.
     t: a Date, an ISO text, or a number of milliseconds (or of seconds, below 10^12). The days are Paris's days. */
  var TZ = "Europe/Paris";
  function date(t) { return t instanceof Date ? t : new Date(typeof t === "number" && t < 1e12 ? t * 1000 : t); }
  _.date = date;
  // a date that cannot be read is written « — », as a missing figure is, instead of stopping the page
  function unreadable(t) { return isNaN(date(t).getTime()); }
  var dayKey = window.ds.day.key;
  function clock(d) {
    var parts = _.intl("DateTimeFormat", "fr-FR", { timeZone: TZ, hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
    var h = +parts.find(function (p) { return p.type === "hour"; }).value, m = parts.find(function (p) { return p.type === "minute"; }).value;
    return english() ? h + ":" + m : h + "h" + m;
  }
  /* ds.time(t, {pad}): the time of day at Paris, « 9h05 » (« 9:05 » in English); pad writes « 09h05 ». « — » when t cannot
     be read, "" when there is none. */
  function time(t, o) {
    if (t == null || t === "") return "";
    if (unreadable(t)) return "—";
    var text = clock(date(t));
    return o && o.pad ? text.replace(/^(\d)(?=\D)/, "0$1") : text;
  }
  function day(d) {
    var w = words(), k = dayKey(d), now = Date.now();
    if (k === dayKey(new Date(now))) return w.today;
    if (k === dayKey(new Date(now - 864e5))) return w.yesterday;
    if (k === dayKey(new Date(now + 864e5))) return w.tomorrow;
    var text = _.intl("DateTimeFormat", english() ? "en-GB" : "fr-FR", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
    return w.on + (english() ? text : text.replace(/^1 /, "1er "));
  }
  function when(t) {
    if (!t) return words().never;
    if (unreadable(t)) return "—";
    var d = date(t);
    return day(d) + words().at + clock(d);
  }
  function ago(t) {
    if (!t) return words().never;
    if (unreadable(t)) return "—";
    var w = words(), s = (Date.now() - date(t)) / 1000;
    if (s < 60) return w.now;
    if (s < 3600) return w.ago(Math.round(s / 60) + " min");
    if (s < 6 * 3600) return w.ago(Math.floor(s / 3600) + "h" + String(Math.round(s % 3600 / 60)).padStart(2, "0"));
    return when(t);
  }
  function soon(t) {
    if (!t) return words().never;
    if (unreadable(t)) return "—";
    var w = words(), s = (date(t) - Date.now()) / 1000;
    if (s < 60) return w.soon;
    if (s < 3600) return w.in(Math.round(s / 60) + " min");
    return when(t);
  }

  /* ds.date(t, style): a date in words, Paris's day: "long" « 9 novembre 2026 » (the default), "weekday" « lundi 9 novembre »,
     "month" « novembre 2026 », "short" « 09/11/26 », "day" « 9 nov. », "row" a list's date, « 9 nov. » this year and
     « 9 nov. 2025 » before or after it (every row of Bank and Studio), or Intl's own options; the first of a month is
     « 1er » in French. A day without its time ("2026-11-09", or a month "2026-11") stays that day wherever the device is. */
  var STYLES = { long: { day: "numeric", month: "long", year: "numeric" }, weekday: { weekday: "long", day: "numeric", month: "long" },
    month: { month: "long", year: "numeric" }, short: { day: "2-digit", month: "2-digit", year: "2-digit" }, day: { day: "numeric", month: "short" } };
  function dateText(t, style) {
    if (t == null || t === "") return "";
    var opts = Object.assign({}, typeof style === "object" ? style : STYLES[style === "row" ? "day" : style || "long"]), d;
    var bare = typeof t === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(t);
    if (bare) { d = new Date(t.length === 7 ? t + "-15T12:00:00Z" : t + "T12:00:00Z"); opts.timeZone = "UTC"; }
    else { d = date(t); opts.timeZone = TZ; }
    if (isNaN(d.getTime())) return "—";
    // a list's date says its year only when it is not this one
    if (style === "row" && _.intl("DateTimeFormat", "en-GB", { timeZone: opts.timeZone, year: "numeric" }).format(d) !== window.ds.day.today().slice(0, 4)) opts.year = "numeric";
    var text = _.intl("DateTimeFormat", english() ? "en-GB" : "fr-FR", opts).format(d);
    return english() || opts.day !== "numeric" ? text : text.replace(/(^|\s)1 (?=\D)/, "$11er ");
  }

  /* ds.number(n, decimals) and ds.money(n, {currency, signed, decimals}): French figures, the thousands set apart by a
     space the fonts draw (French uses a narrow one that Archivo and IBM Plex Mono do not); money: « −1 234,56€ », « +12€ »
     with signed, « 12,00 USD » for another currency, « — » for no figure.
     Both take {decimals} (as many always), or {min, max} (« 12,5 » and « 12,25 » with min 0 and max 2; Bank's unit prices
     with min 2 and max 4), and {signed}: « + » before a gain, « − » (the minus sign, not a hyphen) before a loss.
     ds.percent(ratio, {decimals, signed}): a share, « 12 % » for 0.12 (« 12% » in English), whole by default. */
  function digits(o, k) {
    if (typeof o === "number") return [o, o];
    o = o || {};
    if (o.decimals != null) return [o.decimals, o.decimals];
    if (o.min != null || o.max != null) return [o.min || 0, Math.max(o.min || 0, o.max == null ? k : o.max)];
    return [k, k];
  }
  function figure(n, d) {
    return _.intl("NumberFormat", english() ? "en-GB" : "fr-FR", { minimumFractionDigits: d[0], maximumFractionDigits: d[1] })
      .format(n).replace(/[\u202f\u00a0]/g, "\u00a0");
  }
  function sign(n, o) { return n < 0 ? "−" : o && o.signed && n > 0 ? "+" : ""; }
  function number(n, o) {
    if (n == null || isNaN(n)) return "—";
    var d = digits(o, 0);
    // a sign written apart, so that a loss shows the minus sign; without signed, as the browser writes it
    return o && typeof o === "object" ? sign(n, o) + figure(Math.abs(n), d) : figure(n, d);
  }
  function money(n, o) {
    if (n == null || isNaN(n)) return "—";
    o = o || {};
    var cur = o.currency || "EUR";
    return sign(n, o) + figure(Math.abs(n), digits(o, 2)) + (cur === "EUR" ? "€" : "\u00a0" + cur);
  }
  function percent(r, o) {
    if (r == null || isNaN(r)) return "—";
    o = o || {};
    return sign(r, o) + figure(Math.abs(r * 100), digits(o, 0)) + (english() ? "%" : "\u00a0%");
  }

  /* ds.api(method, url, body): the app's server, as JSON. Its header against forged requests is the one its <html> names,
     data-api="X-Bank" (sent as X-Bank: 1). An ended session goes back to /login; an error says the server's own words. */
  /* ds.api(method, url, body, {retry}): besides the header named by <html data-api>, a Spring page's CSRF token
     (<meta name="_csrf"> under the header of <meta name="_csrf_header">) goes with everything but a GET. A GET that meets
     the server restarting (the platform's 502, 503 or 504, or no answer at all, below) tries again every 3 s for a minute, as a deploy takes;
     {retry: false} says no. An ended session (401, or a request sent on to a sign-in page, as Spring does) goes to the
     sign-in page, the page's address kept to come back to it after. An error says the server's own words (detail, or
     error.message) and carries err.status and err.code (the server's code, e.g. "tool_error"). */
  /* ds.api(method, url, body, {retry, headers, keepalive, progress, cache}), as found by the apps:
     body: an object goes as JSON; a form's fields (FormData, URLSearchParams) or a file (Blob) go as they are (Selecta's
     uploads). headers: more of them. keepalive: the request outlives the page (a notice marked read as the page closes).
     progress(loaded, total): told as an upload goes (sent then by XMLHttpRequest, which tells it; fetch does not).
     cache: fetch's cache mode, "no-store" unless told; "default" lets a server that sends an ETag with "no-cache"
     answer an unchanged read with a 304 of a few bytes (Studio's bases).
     Only the platform's own page (Render's 502, 503 or 504, not JSON) or no answer at all is taken for a restart and
     tried again; an error the app itself answers with, JSON, is the app's (Studio's 502 « tool_error »). When the tries
     run out: err.code "restart" (the platform's page) or "offline" (no answer), with words that say so.
     Every error carries err.status, err.code (the server's error.code, code or reason) and err.body (its JSON). */
  var AFTER_LOGIN = "ds-after-login";
  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function signIn(to) {
    _.write(AFTER_LOGIN, location.pathname + location.search + location.hash, true);
    location.href = to;
  }
  function failure(message, status, code, body) {
    var e = new Error(message);
    e.status = status; e.code = code || null; e.body = body == null ? null : body;
    return e;
  }
  function serverWords(d) {
    if (!d) return null;
    var x = d.detail || (d.error && d.error.message) || d.message;
    // FastAPI's list of what a request lacked
    if (Array.isArray(x)) x = x.map(function (i) { return i && i.msg || ""; }).filter(Boolean).join(" ; ");
    return typeof x === "string" && x ? x : null;
  }
  function api(method, url, body, o) {
    o = o || {};
    var root = document.documentElement, name = root.getAttribute("data-api"), headers = { Accept: "application/json" };
    if (name) headers[name] = "1";
    var csrf = document.querySelector('meta[name="_csrf"]'), csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    if (csrf && method !== "GET") headers[(csrfHeader && csrfHeader.content) || "X-CSRF-TOKEN"] = csrf.content;
    var raw = body != null && ((window.FormData && body instanceof FormData) || (window.Blob && body instanceof Blob) ||
      (window.URLSearchParams && body instanceof URLSearchParams));
    if (body != null && !raw) headers["Content-Type"] = "application/json";
    Object.keys(o.headers || {}).forEach(function (k) { headers[k] = o.headers[k]; });
    var data = body == null ? undefined : raw ? body : JSON.stringify(body);
    var left = method === "GET" && o.retry !== false ? 20 : 0;
    // the answer as {status, ok, url, redirected, text}, by fetch, or by XMLHttpRequest when an upload is followed
    function send() {
      if (o.progress) return new Promise(function (ok, no) {
        var x = new XMLHttpRequest();
        x.open(method, url);
        Object.keys(headers).forEach(function (k) { x.setRequestHeader(k, headers[k]); });
        if (x.upload) x.upload.addEventListener("progress", function (e) { if (e.lengthComputable) o.progress(e.loaded, e.total); });
        x.onload = function () {
          var asked = new URL(url, location.href).href;
          ok({ status: x.status, ok: x.status >= 200 && x.status < 300, url: x.responseURL, redirected: !!x.responseURL && x.responseURL !== asked, text: x.responseText });
        };
        x.onerror = function () { no(new TypeError("network")); };
        x.send(data === undefined ? null : data);
      });
      return fetch(url, { method: method, credentials: "same-origin", cache: o.cache || "no-store", headers: headers, body: data, keepalive: !!o.keepalive })
        .then(function (r) { return r.text().then(function (text) { return { status: r.status, ok: r.ok, url: r.url, redirected: r.redirected, text: text }; }); });
    }
    function once() {
      return send().then(function (r) {
        var d = null, json = true;
        try { d = r.text ? JSON.parse(r.text) : null; } catch (e) { json = false; }
        // the platform's page in place of the app's answer: the app is restarting
        if (!json && r.status >= 502 && r.status <= 504) {
          if (left > 0) { left -= 1; return wait(3000).then(once); }
          throw failure(words().restart, r.status, "restart");
        }
        if (r.status === 401 || (r.redirected && /\/(login|signin)\b/i.test(r.url))) {
          signIn(r.redirected ? r.url : root.getAttribute("data-login") || "/login");
          throw failure("session", 401, "session");
        }
        if (!r.ok) throw failure(serverWords(d) || "erreur " + r.status, r.status, d && ((d.error && d.error.code) || d.code || d.reason), d);
        return d;
      }, function () {
        // no answer at all: the server is down a moment, or the network
        if (left > 0) { left -= 1; return wait(3000).then(once); }
        throw failure(words().offline, 0, "offline");
      });
    }
    return once();
  }
  // back from the sign-in page, the page opens where it was left
  function cameBack() {
    var was = _.read(AFTER_LOGIN, true);
    _.write(AFTER_LOGIN, null, true);
    if (!was) return;
    // another page of the app (its settings): opened instead, when this one was only where the sign-in came back to
    if (was.charAt(0) === "/" && was.charAt(1) !== "/" && was.split("#")[0] !== location.pathname + location.search) { if (!location.hash) location.replace(was); return; }
    if (location.hash) return;
    var hash = was.indexOf("#") >= 0 ? was.slice(was.indexOf("#")) : "";
    if (hash && was.split("#")[0] === location.pathname + location.search) {
      history.replaceState(null, "", hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  // ds.h, ds.esc and ds.ico are the core's (src/core.js), shared with ds-photo.js and ds-site.js

  /* ds.compact(n): a figure that must stay short, « 9 850 », « 57,9k », « 578k », « 1,2M » (« 57.9k » in English). */
  function compact(n) {
    if (n == null || isNaN(n)) return "";
    var a = Math.abs(n), lang = english() ? "en-GB" : "fr-FR";
    function f(x, d) { return _.intl("NumberFormat", lang, { maximumFractionDigits: d }).format(x).replace(/ /g, " "); }
    if (a < 10000) return number(n, 0);
    if (a < 100000) return f(n / 1000, 1) + "k";
    if (a < 1000000) return f(n / 1000, 0) + "k";
    return f(n / 1000000, a < 10000000 ? 1 : 0) + "M";
  }

  /* ds.avatar(holder, {name, src}, {cls}): a merchant's or a person's logo, its initial underneath while the image comes, or
     if it never does; drawn into holder (its content replaced), or only returned with holder null. */
  function avatar(holder, data, o) {
    data = data || {}; o = o || {};
    var name = data.name, src = data.src, cls = o.cls;
    var span = h("span", { class: "avatar" + (cls ? " " + cls : ""), "aria-hidden": "true" }, [String(name || "?").trim().charAt(0).toUpperCase() || "?"]);
    if (src) {
      var img = h("img", { src: src, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { img.remove(); });
      span.appendChild(img);
    }
    holder = _.find(holder);
    if (holder) holder.replaceChildren(span);
    return span;
  }

  /* Foldable sections: <details class="fold" data-fold="key"> open as the device left them, each change remembered under
     ds-fold:<key>. On loading, and again with ds.fold(holder) once a page draws them anew. */
  function fold(root) {
    (root || document).querySelectorAll("details[data-fold]").forEach(function (d) {
      var v = _.read("ds-fold:" + d.getAttribute("data-fold"));
      if (v != null) d.open = v === "1";
    });
  }
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.matches || !d.matches("details[data-fold]")) return;
    _.write("ds-fold:" + d.getAttribute("data-fold"), d.open ? "1" : "0");
  }, true);

  /* A card folded by its own title, as Studio's: ds.foldCard(card, key, {open}) makes the card's title (its .ct) a
     button, reached with Tab and pressed with Enter or Space, that folds the card: folded, the card keeps only its title
     (.card.is-folded) and the title's chevron turns (.ct.fold, card.css). Kept under ds-fold:<key>, as a details.fold
     is; open says how a card the device knows nothing of starts (open, unless false). What acts inside the title (a
     period's menu, a button, a link) acts and folds nothing. Returns {open(), close(), toggle(), isOpen()}, the same
     one when called again on the same card (a page that draws its cards anew calls it on the new ones); ds.seek opens
     a folded card around what it brings into view. */
  function foldCard(card, key, o) {
    card = _.find(card);
    if (!card) return null;
    if (card._dsFold) return card._dsFold;
    var head = [].filter.call(card.children, function (c) { return c.classList.contains("ct"); })[0];
    if (!head) return null;
    o = o || {};
    var kept = _.read("ds-fold:" + key), on = kept == null ? o.open !== false : kept === "1";
    head.classList.add("fold");
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    function set(v, keep) {
      on = v;
      card.classList.toggle("is-folded", !v);
      head.setAttribute("aria-expanded", v ? "true" : "false");
      if (keep) _.write("ds-fold:" + key, v ? "1" : "0");
    }
    // a click on what the title holds that acts is that control's, not the fold's
    function own(e) { var x = e.target.closest && e.target.closest(INTERACTIVE); return (!x || x === head) && !(e.target.closest && e.target.closest(".ct-tools")); }
    head.addEventListener("click", function (e) { if (own(e)) set(!on, true); });
    head.addEventListener("keydown", function (e) {
      if (e.target === head && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); set(!on, true); }
    });
    set(on, false);
    card._dsFold = { open: function () { set(true, true); }, close: function () { set(false, true); }, toggle: function () { set(!on, true); },
      isOpen: function () { return on; } };
    return card._dsFold;
  }

  /* Figures that must show whole in narrow tiles (Bank's sums on a phone): in .tiles.is-shrink, or in a holder given to
     ds.fitFigures(holder), a tile's figure (dd) too long for its tile gets smaller, a pixel at a time, down to ds's
     smallest text (the small capitals' size, never below); still too long there, it goes on two lines rather than be cut. Again when the
     tiles change width (a turned phone, a view shown) and whenever the page draws them anew. */
  var least = null;
  function floor() {
    if (least == null) least = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--type-smallcaps-size")) || 11;
    return least;
  }
  // a figure too long for its tile: the largest of the sizes a pixel apart under its own (down to the smallest text) at
  // which it holds, found in a few steps, halving the choice each time, instead of trying each one and measuring the page
  // after each; still too long at the smallest, it goes on two lines
  function shrinkFigure(dd) {
    var size = parseFloat(getComputedStyle(dd).fontSize), least = floor(), steps = Math.ceil(size - least);
    var at = function (k) { return Math.max(least, size - k); };
    var fits = function (k) { dd.style.fontSize = at(k) + "px"; return dd.scrollWidth <= dd.clientWidth; };
    if (steps < 1 || !fits(steps)) { dd.style.fontSize = least + "px"; dd.style.whiteSpace = "normal"; dd.style.overflowWrap = "anywhere"; return; }
    var lo = 1, hi = steps;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (fits(mid)) hi = mid; else lo = mid + 1; }
    dd.style.fontSize = at(lo) + "px";
  }
  var shrunk = new WeakMap();
  var reshrink = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) {
      var w = Math.round(e.contentRect.width);
      if (shrunk.get(e.target) === w) return;
      shrunk.set(e.target, w);
      if (w) fitFigures(e.target);
    });
  }) : null;
  function fitFigures(holder) {
    holder = _.find(holder);
    if (!holder) return;
    if (reshrink && !shrunk.has(holder)) { shrunk.set(holder, -1); reshrink.observe(holder); }
    // hidden (another view, a folded card): fitted when it shows, the watcher seeing its width come
    if (!holder.getClientRects().length) return;
    var list = holder.querySelectorAll(".tile dd");
    // every figure back to its own size first, then every width read at once: the page is measured once, not once a figure
    list.forEach(function (dd) { dd.style.fontSize = dd.style.whiteSpace = dd.style.overflowWrap = ""; });
    [].filter.call(list, function (dd) { return dd.clientWidth && dd.scrollWidth > dd.clientWidth; }).forEach(shrinkFigure);
  }
  // the tiles a change brings, or draws anew: only those are fitted again (21 November 2026: every tile of every view
  // was, each time Bank drew its three figures over the operations)
  function shrinking(changes) {
    var found = new Set();
    changes.forEach(function (m) {
      var at = m.target.nodeType === 1 ? m.target : m.target.parentElement, holder = at && at.closest && at.closest(".tiles.is-shrink");
      if (holder) found.add(holder);
      [].forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches(".tiles.is-shrink")) found.add(n);
        n.querySelectorAll(".tiles.is-shrink").forEach(function (x) { found.add(x); });
      });
    });
    return found;
  }
  function fitAllFigures() { document.querySelectorAll(".tiles.is-shrink").forEach(fitFigures); }

  /* Whole rows that open: a row (tr.is-link, a tile .tile.is-link, or any [data-row-link]) holding a link a.row-link, or a data-href, opens it on a
     click anywhere in it, but not on its own buttons, fields or links, not at the end of a text selection; Ctrl, ⌘ or the
     middle button open it in a new tab, as a link would. By delegation: rows drawn later work too. A row with neither link
     nor data-href is left to the page (Bank opens its sheet). On iPhone a stretched link does not cover a table row: hence this. */
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"]';
  function rowHref(e) {
    var row = e.target.closest && e.target.closest("tr.is-link, .tile.is-link, [data-row-link]");
    if (!row || e.target.closest(INTERACTIVE)) return null;
    var sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed) return null;
    var link = row.querySelector("a.row-link");
    return { link: link, href: row.getAttribute("data-href") || (link && link.href) };
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.altKey || e.shiftKey) return;
    var r = rowHref(e);
    if (!r || !r.href) return;
    if (e.metaKey || e.ctrlKey) { window.open(r.href, "_blank", "noopener"); return; }
    if (r.link) r.link.click(); else location.href = r.href;
  });
  /* The cross of a search field (.search-field > .search-clear): it empties the field, tells the page as typing would
     (an « input » event), and gives the field its focus back */
  document.addEventListener("click", function (e) {
    var x = e.target.closest && e.target.closest(".search-field > .search-clear");
    var field = x && x.parentNode.querySelector("input");
    if (!field) return;
    e.preventDefault();
    field.value = "";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  });
  /* The « i » of a search field (.search-field > .search-info): a tap or a click keeps its help open (.is-open) until a tap
     elsewhere or Escape; hover and focus show it already, by the stylesheet */
  function searchHelp(info, on) {
    var help = info && info.parentNode.querySelector(".search-help");
    if (!help) return;
    help.classList.toggle("is-open", on);
    info.setAttribute("aria-expanded", on ? "true" : "false");
  }
  document.addEventListener("click", function (e) {
    var info = e.target.closest && e.target.closest(".search-field > .search-info");
    if (info) { searchHelp(info, !info.parentNode.querySelector(".search-help.is-open")); return; }
    if (e.target.closest && e.target.closest(".search-help")) return;
    [].forEach.call(document.querySelectorAll(".search-field > .search-help.is-open"), function (h) { searchHelp(h.parentNode.querySelector(".search-info"), false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    [].forEach.call(document.querySelectorAll(".search-field > .search-help.is-open"), function (h) { searchHelp(h.parentNode.querySelector(".search-info"), false); });
  });
  /* The chevron of a panel's line with lines under it (.side .frow > .filter-more): it shows or hides the .fsub that
     follows its line, and says so (aria-expanded). A page that draws its panel again keeps the state itself: its own
     click handler, on the panel, runs first and reads aria-expanded before it turns */
  document.addEventListener("click", function (e) {
    var more = e.target.closest && e.target.closest(".side .frow > .filter-more");
    if (!more) return;
    var sub = more.parentNode.nextElementSibling, open = more.getAttribute("aria-expanded") !== "true";
    more.setAttribute("aria-expanded", String(open));
    if (sub && sub.classList.contains("fsub")) sub.hidden = !open;
  });
  /* A tap on the tab already shown in an app's bar of tabs (.tabs.is-bar, its tab aria-selected), as a phone's apps do: the
     page goes back to its top (« quand je clique sur un onglet alors que je suis déjà dessus, ça remonte tout en haut »,
     23 November 2026). Read as the click starts (capture), before the page's own handler draws its tabs again. */
  document.addEventListener("click", function (e) {
    var tab = e.button === 0 && e.target.closest && e.target.closest('.tabs.is-bar [aria-selected="true"]');
    if (!tab || (window.scrollY || document.documentElement.scrollTop) <= 0) return;
    window.scrollTo({ top: 0, behavior: _.reduced() ? "auto" : "smooth" });
  }, true);
  document.addEventListener("auxclick", function (e) {
    if (e.button !== 1) return;
    var r = rowHref(e);
    if (r && r.href) { e.preventDefault(); window.open(r.href, "_blank", "noopener"); }
  });

  /* ds.route(onRoute): the address after # as the page's state. « #analyse/patreon-alexis/derniers-membres?compte=hb » gives
     onRoute({parts: ["analyse", "patreon-alexis", "derniers-membres"], query: {compte: "hb"}}), at once and at every change
     (back, a link). ds.route.go(parts, query, {push}) writes it without the page jumping, replacing by default so that Back
     does not walk through every filter; with push, a step of history of its own that the page follows (hashchange). ds.seek(anchor, {block}) brings [data-anchor="anchor"] (or the element given) into
     view, at the top or {block: "center"} (a table's row), opens the foldable sections around it, and lights it a moment. Back from the sign-in page, the address left is found again (ds.api keeps it). */
  function parseRoute() {
    var raw = decodeURIComponent(location.hash.replace(/^#/, "")), q = raw.indexOf("?"), query = {};
    (q >= 0 ? raw.slice(q + 1) : "").split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("=");
      query[i < 0 ? pair : pair.slice(0, i)] = i < 0 ? "" : pair.slice(i + 1);
    });
    return { parts: (q >= 0 ? raw.slice(0, q) : raw).split("/").filter(Boolean), query: query };
  }
  function route(onRoute) {
    window.addEventListener("hashchange", function () { onRoute(parseRoute()); });
    onRoute(parseRoute());
  }
  route.go = function (parts, query, o) {
    var q = Object.keys(query || {}).filter(function (k) { return query[k] != null && query[k] !== ""; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]); }).join("&");
    var hash = "#" + (parts || []).map(encodeURIComponent).join("/") + (q ? "?" + q : "");
    if (hash === location.hash) return;
    // push: a step of its own in the history, the page told as by a link (hashchange); else the address changes quietly
    if (o && o.push) { location.hash = hash; return; }
    history.replaceState(null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  route.read = parseRoute;
  function seek(anchor, o) {
    var el = null;
    if (anchor && anchor.nodeType) el = anchor;
    else try { el = document.querySelector('[data-anchor="' + (window.CSS && CSS.escape ? CSS.escape(anchor) : anchor) + '"]'); } catch (e) {}
    if (!el) return false;
    for (var d = el.parentElement; d; d = d.parentElement) {
      if (d.tagName === "DETAILS") d.open = true;
      else if (d._dsFold && !d._dsFold.isOpen()) d._dsFold.open();
    }
    var still = _.reduced();
    el.scrollIntoView({ block: (o && o.block) || "start", behavior: still ? "auto" : "smooth" });
    el.classList.remove("is-lit");
    void el.offsetWidth;
    el.classList.add("is-lit");
    setTimeout(function () { el.classList.remove("is-lit"); }, 2600);
    return true;
  }

  /* A form that deletes for good asks first: <form data-confirm="Supprimer ce client ? Cette action est irréversible."
     data-confirm-ok="Supprimer"> asks in ds.confirm (the question up to « ? » as its title, the rest as its text), never in
     the browser's box. Any form sent then shows its button busy (.btn.is-busy) until the page changes, so that a second
     click sends nothing twice; a form the page sends itself (its own submit listener stopped it) is left alone. */
  document.addEventListener("submit", function (e) {
    var form = e.target, message = form.getAttribute && form.getAttribute("data-confirm");
    if (message && form.getAttribute("data-confirmed") !== "true") {
      e.preventDefault();
      var by = e.submitter, parts = /^([\s\S]*?\?)\s+([\s\S]+)$/.exec(message);
      confirm({ title: parts ? parts[1] : message, text: parts ? parts[2] : "", ok: form.getAttribute("data-confirm-ok") || undefined, danger: true })
        .then(function (yes) {
          if (!yes) return;
          form.setAttribute("data-confirmed", "true");
          if (form.requestSubmit) form.requestSubmit(by); else form.submit();
        });
      return;
    }
    if (e.defaultPrevented) return;
    var button = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    if (button) { button.classList.add("is-busy"); button.disabled = true; }
  });
  // back with the browser's Back, the page comes from its cache: its buttons are no longer busy
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    document.querySelectorAll(".btn.is-busy").forEach(function (b) { b.classList.remove("is-busy"); b.disabled = false; });
    document.querySelectorAll("form[data-confirmed]").forEach(function (f) { f.removeAttribute("data-confirmed"); });
  });

  /* The messages a server leaves for the page after a redirect, as <template data-toast data-type="good" data-text="…"
     data-action-label="Rouvrir" data-action-form="reopen">, shown on arrival in the bubble; the action, if any, sends that
     form of the page. Selecta's way, for any app that answers forms with a redirect. */
  function arrivals() {
    document.querySelectorAll("template[data-toast]").forEach(function (m) {
      var form = m.getAttribute("data-action-form") ? document.getElementById(m.getAttribute("data-action-form")) : null;
      toast({ type: m.getAttribute("data-type") || "good", text: m.getAttribute("data-text") || "",
              action: form ? { label: m.getAttribute("data-action-label"), run: function () { form.requestSubmit ? form.requestSubmit() : form.submit(); } } : undefined });
      m.remove();
    });
  }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  onReady(function () {
    holder();
    fold(); arrivals(); cameBack(); fitAllFigures();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAllFigures);
    // a page that draws its tiles again: their figures are fitted once it is done
    new MutationObserver(function (changes) {
      shrinking(changes).forEach(fitFigures);
    }).observe(document.body, { childList: true, subtree: true });
  });

  window.ds = window.ds || {};
  window.ds.toast = toast;
  window.ds.confirm = confirm;
  window.ds.when = when;
  window.ds.ago = ago;
  window.ds.soon = soon;
  window.ds.date = dateText;
  window.ds.number = number;
  window.ds.money = money;
  window.ds.percent = percent;
  window.ds.time = time;
  window.ds.api = api;
  window.ds.compact = compact;
  window.ds.avatar = avatar;
  window.ds.fold = fold;
  window.ds.foldCard = foldCard;
  window.ds.fitFigures = fitFigures;
  window.ds.route = route;
  window.ds.seek = seek;
})();
/* The small tools every app wrote for itself, once (the audit of 23 November 2026: Bank, Studio and Selecta each had their
   copy, some two or five).
   ds.text: fold(text) (accents and capitals aside, « Café » is « cafe »), matches(text, query) (every word of the query in
   the text, folded), compare(a, b) (the page's language's order, « Élodie » with the E, « 10 » after « 9 »), slug(text)
   (« Ce qui rapporte » gives « ce-qui-rapporte »).
   ds.plural(n, one, many) the word for n (« opération », « opérations »; many is one + « s » when not given);
   ds.count(n, one, many) the figure and its word (« 3 opérations »); ds.list(items, {or}) « Léa, Irina et Zoé »;
   ds.duration(days) « 3 jours », « 2 mois », « 1 an et 3 mois »; ds.every(seconds) « toutes les heures », « toutes les
   2h », « toutes les 30 min », « toutes les minutes »; ds.since(t) the time gone by, « 3 min », « 2h05 », "" just now, null past six hours;
   ds.date(key, "relative") « aujourd’hui », « demain », « hier », « dans 3 jours », « il y a 3 jours »;
   ds.date(key, "heading") a day over its rows, « Aujourd’hui », « Hier », « Vendredi 6 novembre » (its year when not this one).
   ds.store.get(key, fallback) and ds.store.set(key, value): a choice kept on the device as JSON (null takes it away); a
   private window that refuses keeps nothing and gives back the fallback. {session: true} keeps it for the visit only.
   ds.poll(fn, {every, until, now}): fn every so often while the page is seen (never two at once), again as soon as the
   page is seen again if its time has come; until: a time (ms) or a test that ends it; now: once at once. Gives back
   {stop(), now()}. ds.onSeen(fn, {after}): fn when the page is seen again after being away at least after ms.
   ds.boot: the first loading in the middle of the page (.boot, with its .boot-title and .boot-text): say(title, text),
   done() (it fades, then is hidden), fail(title, why, retry) (its failed look, and a « Réessayer » button that reloads
   the page or runs retry), shown().
   ds.ext(url, text, {cls}): a link to another site, in a new tab, only for an https address; plain text otherwise.
   ds.delta(n, {format, decimals, min, max, unit, invert}): a change, signed and in its tone (.delta, is-good when it
   rose, is-bad when it fell, the other way round with invert), « ±0 » without a tone; format "money", "percent" or a
   number (the default); ds.delta.html(n, o) the same as HTML for a page that writes strings. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._, english = _.english;

  /* ---------- text ---------- */
  function fold(t) { return String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function matches(text, query) {
    var hay = fold(text);
    return fold(query).split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) >= 0; });
  }
  function compare(a, b) {
    return _.intl("Collator", english() ? "en" : "fr", { sensitivity: "base", numeric: true }).compare(String(a == null ? "" : a), String(b == null ? "" : b));
  }
  function slug(t) { return fold(t).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  ds.text = { fold: fold, matches: matches, compare: compare, slug: slug };

  /* ---------- words ---------- */
  // French counts 0 and 1 as one; English only 1
  function plural(n, one, many) { var single = english() ? Math.abs(n) === 1 : Math.abs(n) < 2; return single ? one : many || one + "s"; }
  function count(n, one, many) { return ds.number(n) + " " + plural(n, one, many); }
  function list(items, o) {
    items = (items || []).filter(function (x) { return x != null && x !== ""; }).map(String);
    if (items.length < 2) return items[0] || "";
    if (Intl.ListFormat) return _.intl("ListFormat", english() ? "en" : "fr", { type: o && o.or ? "disjunction" : "conjunction" }).format(items);
    var last = items.pop();
    return items.join(", ") + (o && o.or ? (english() ? " or " : " ou ") : (english() ? " and " : " et ")) + last;
  }
  // each word by the rule above: a day and a half is still « jour » in French, already « days » in English
  function duration(days) {
    var en = english();
    if (days < 1) return en ? "less than a day" : "moins d'un jour";
    if (days < 31) return days + " " + plural(days, en ? "day" : "jour");
    var mo = Math.round(days / 30.44);
    if (mo < 12) return mo + " " + (en ? plural(mo, "month") : "mois");
    var y = Math.floor(mo / 12), r = mo % 12;
    if (en) return y + " " + plural(y, "year") + (r ? " and " + r + " " + plural(r, "month") : "");
    return y + " " + plural(y, "an") + (r ? " et " + r + " mois" : "");
  }
  function every(sec) {
    var m = Math.round(sec / 60), en = english();
    if (m >= 1440 && m % 1440 === 0) return m === 1440 ? (en ? "every day" : "tous les jours") : (en ? "every " + m / 1440 + " days" : "tous les " + m / 1440 + " jours");
    if (m >= 60 && m % 60 === 0) return m === 60 ? (en ? "every hour" : "toutes les heures") : (en ? "every " + m / 60 + "h" : "toutes les " + m / 60 + "h");
    // one minute is every minute, never « toutes les 1 min »
    if (m === 1) return en ? "every minute" : "toutes les minutes";
    return (en ? "every " : "toutes les ") + m + " min";
  }
  function since(t) {
    if (!t) return null;
    var s = (Date.now() - _.date(t)) / 1000;
    if (isNaN(s)) return null;
    if (s < 60) return "";
    if (s < 3600) return Math.round(s / 60) + " min";
    if (s < 6 * 3600) return Math.floor(s / 3600) + "h" + String(Math.round(s % 3600 / 60)).padStart(2, "0");
    return null;
  }
  ds.plural = plural; ds.count = count; ds.list = list; ds.duration = duration; ds.every = every; ds.since = since;

  // two more styles for ds.date: a distance in days, and a day over its rows
  var dateText = ds.date;
  function relative(k) {
    var n = ds.day.diff(ds.day.today(), k), en = english();
    if (n === 0) return en ? "today" : "aujourd’hui";
    if (n === 1) return en ? "tomorrow" : "demain";
    if (n === -1) return en ? "yesterday" : "hier";
    if (n > 1) return en ? "in " + n + " days" : "dans " + n + " jours";
    return en ? -n + " days ago" : "il y a " + -n + " jours";
  }
  function heading(k) {
    var now = ds.day.today(), en = english();
    if (k === now) return en ? "Today" : "Aujourd’hui";
    if (k === ds.day.add(now, -1)) return en ? "Yesterday" : "Hier";
    var text = dateText(k, Object.assign({ weekday: "long", day: "numeric", month: "long" }, k.slice(0, 4) === now.slice(0, 4) ? {} : { year: "numeric" }));
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  ds.date = function (t, style) {
    if ((style === "relative" || style === "heading") && t) {
      var k = typeof t === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : ds.day.key(_.date(t));
      return style === "relative" ? relative(k) : heading(k);
    }
    return dateText(t, style);
  };

  /* ---------- the device's memory ---------- */
  ds.store = {
    get: function (key, fallback, o) {
      var raw = _.read(key, o && o.session);
      if (raw == null) return fallback === undefined ? null : fallback;
      try { return JSON.parse(raw); } catch (e) { return fallback === undefined ? null : fallback; }
    },
    set: function (key, value, o) { _.write(key, value == null ? null : JSON.stringify(value), o && o.session); }
  };

  /* ---------- while the page is seen ---------- */
  function poll(fn, o) {
    o = o || {};
    var every = o.every || 60000, last = 0, busy = false, stopped = false, timer;
    function over() { return o.until != null && (typeof o.until === "function" ? o.until() : Date.now() >= o.until); }
    function run() {
      if (stopped || busy) return;
      if (over()) { stop(); return; }
      if (document.hidden) return;
      busy = true; last = Date.now();
      Promise.resolve().then(fn).catch(function () {}).then(function () { busy = false; if (over()) stop(); });
    }
    function seen() { if (!document.hidden && Date.now() - last >= every) run(); }
    function stop() {
      if (stopped) return;
      stopped = true; clearInterval(timer);
      document.removeEventListener("visibilitychange", seen);
      if (o.onEnd) o.onEnd();
    }
    timer = setInterval(run, every);
    document.addEventListener("visibilitychange", seen);
    if (o.now) run();
    return { stop: stop, now: run };
  }
  function onSeen(fn, o) {
    var away = document.hidden ? Date.now() : null, after = (o && o.after) || 0;
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { away = Date.now(); return; }
      if (away != null && Date.now() - away >= after) fn();
      away = null;
    });
  }
  ds.poll = poll; ds.onSeen = onSeen;

  /* ---------- the first loading ---------- */
  var BOOT = _.table({ fr: { retry: "Réessayer" }, en: { retry: "Try again" } });
  function boot() { return document.querySelector(".boot"); }
  function bootPart(cls) { var b = boot(); return b && b.querySelector("." + cls); }
  ds.boot = {
    say: function (title, text) {
      var t = bootPart("boot-title"), s = bootPart("boot-text");
      if (t && title != null) t.textContent = title;
      if (s && text != null) s.textContent = text;
    },
    shown: function () { var b = boot(); return !!b && !b.hidden && !b.classList.contains("is-gone"); },
    done: function () {
      var b = boot();
      if (!b || b.hidden || b.classList.contains("is-gone")) return;
      b.classList.add("is-gone");
      var wait = parseFloat(getComputedStyle(b).transitionDuration) || 0;
      setTimeout(function () { b.hidden = true; }, _.reduced() ? 0 : wait * (/ms/.test(getComputedStyle(b).transitionDuration) ? 1 : 1000));
    },
    fail: function (title, why, retry) {
      var b = boot();
      if (!b) return;
      b.hidden = false; b.classList.remove("is-gone"); b.classList.add("is-failed");
      ds.boot.say(title, why || "");
      if (!b.querySelector(".boot-retry")) {
        var btn = ds.h("button", { class: "btn is-act boot-retry", type: "button", text: _.words(BOOT).retry,
          onclick: function () { if (typeof retry === "function") retry(); else location.reload(); } });
        var s = bootPart("boot-text");
        if (s) s.after(btn); else b.firstElementChild ? b.firstElementChild.append(btn) : b.append(btn);
      }
    }
  };

  /* ---------- links and changes ---------- */
  function ext(url, text, o) {
    var ok = typeof url === "string" && /^https:\/\/[^\s"'<>]+$/.test(url);
    return ok ? ds.h("a", { href: url, target: "_blank", rel: "noopener", class: o && o.cls, text: text })
              : ds.h("span", { class: o && o.cls, text: text });
  }
  function deltaText(n, o) {
    o = o || {};
    if (n == null || isNaN(n)) return "—";
    var f = { decimals: o.decimals, min: o.min, max: o.max == null && o.decimals == null && o.min == null ? (o.format === "money" ? undefined : 3) : o.max, signed: true };
    var text = o.format === "money" ? ds.money(n, f) : o.format === "percent" ? ds.percent(n, f) : ds.number(n, f);
    return (n === 0 ? "±" : "") + text + (o.unit || "");
  }
  function deltaTone(n, o) { return !n || isNaN(n) ? "" : (n > 0) !== !!(o && o.invert) ? " is-good" : " is-bad"; }
  function delta(n, o) { return ds.h("span", { class: "delta" + deltaTone(n, o), text: deltaText(n, o) }); }
  delta.html = function (n, o) { return '<span class="delta' + deltaTone(n, o) + '">' + ds.esc(deltaText(n, o)) + "</span>"; };
  delta.text = deltaText;
  ds.ext = ext; ds.delta = delta;
})();
/* Builders for pieces ds draws but each app wrote by hand, markup and all (the audit of 23 November 2026).
   ds.tile({label, color, swatch, value, unit, delta, tone, note, href, kids, cls}): a full tile, its label (with its
   colour's swatch when swatch is true; color is a token's name, "--c-bleu", or a value), its figure and unit, its change
   under it (a text, a node or several, in tone "good", "bad" or "mid"), what is drawn under it (kids: a curve, a list),
   its note (a link to another site with href). ds.tiles(holder, items, {cls}): a row of them (dl.tiles). ds.tile.html(o):
   the same as HTML, for a page that writes strings (label, value and delta are then HTML).
   ds.card({icon, title, kids, tools, fold, open, anchor, cls}): a card, its title with its icon and its tools on the
   right (a period selector, tabs: using them never folds the card), folded and kept so under fold (a key), found by its
   anchor (the title's slug unless given; ds.seek goes there).
   ds.tabs(holder, items, {value, onPick, scroll, bar, label, key}): tabs, items [[value, label, icon]]; bar: the app's
   bar of views (an icon, its word under it on a phone); scroll: they scroll sideways on a narrow screen, keep their place
   when drawn again (key, or the holder) and bring the chosen one into view. The arrow keys, Home and End go from one to
   the next, as a tab list does.
   ds.meter(value, of, {label, color, cls}): a bar of value against of (.meter); ds.legend(items): the legend under a gauge,
   [{label, value, color, open}] (open: the part still to come, a ring); both have .html(…) for strings.
   ds.median(list) and ds.mean(list): of the figures in a list (null when there is none). */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._, h = ds.h;
  function tone(c) { return c == null ? null : _.tone(c); }
  function list(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }

  /* ---------- tiles ---------- */
  function tile(o) {
    o = o || {};
    var dd = h("dd", {}, [o.value == null ? "—" : String(o.value), o.unit != null ? h("span", { class: "tile-unit", text: o.unit }) : null]);
    list(o.delta).forEach(function (d) {
      dd.append(d && d.nodeType ? d : h("span", { class: "tile-delta" + (o.tone ? " is-" + o.tone : ""), text: d }));
    });
    var note = o.note == null ? null : o.href ? ds.ext(o.href, o.note, { cls: "tile-note" }) : h("span", { class: "tile-note", text: o.note });
    return h("div", { class: "tile" + (o.cls ? " " + o.cls : ""), style: o.color ? "--n:" + tone(o.color) : null },
      [h("dt", {}, [o.swatch ? h("i") : null, o.label]), dd].concat(list(o.kids), [note]));
  }
  tile.html = function (o) {
    o = o || {};
    var delta = list(o.delta).map(function (d) { return '<span class="tile-delta' + (o.tone ? " is-" + o.tone : "") + '">' + d + "</span>"; }).join("");
    return '<div class="tile' + (o.cls ? " " + o.cls : "") + '"' + (o.color ? ' style="--n:' + ds.esc(tone(o.color)) + '"' : "") + "><dt>" + (o.swatch ? "<i></i>" : "") + o.label + "</dt><dd>" +
      (o.value == null ? "—" : o.value) + (o.unit != null ? '<span class="tile-unit">' + ds.esc(o.unit) + "</span>" : "") + delta + "</dd>" +
      (o.note != null ? '<span class="tile-note">' + o.note + "</span>" : "") + "</div>";
  };
  function tiles(holder, items, o) {
    var box = h("dl", { class: "tiles" + (o && o.cls ? " " + o.cls : "") }, (items || []).filter(Boolean).map(function (x) { return x.nodeType ? x : tile(x); }));
    holder = _.find(holder);
    if (holder) { holder.textContent = ""; holder.append(box); }
    return box;
  }

  /* ---------- cards ---------- */
  function card(o) {
    o = o || {};
    var tools = o.tools ? h("span", { class: "ct-tools" }, list(o.tools)) : null;
    var el = h(o.tag || "section", { class: "card" + (o.cls ? " " + o.cls : ""), "data-anchor": o.anchor || ds.text.slug(o.title) },
      [h("h2", { class: "ct" }, [o.icon ? ds.ico(o.icon) : null, o.title, tools])].concat(list(o.kids)));
    if (o.fold) ds.foldCard(el, o.fold, { open: o.open });
    return el;
  }

  /* ---------- tabs ---------- */
  var scrolled = {};
  function tabs(holder, items, o) {
    o = o || {};
    holder = _.find(holder);
    // drawn again in the same holder, the same tab list (its keys and its focus stay)
    var memo = o.key || holder, nav = holder && (holder.classList.contains("tabs") ? holder : holder.querySelector(":scope > .tabs")) || h("div", {});
    nav.className = "tabs" + (o.bar ? " is-bar" : "") + (o.scroll ? " is-scroll" : "") + (o.cls ? " " + o.cls : "");
    nav.setAttribute("role", "tablist");
    if (o.label) nav.setAttribute("aria-label", o.label);
    nav.textContent = "";
    function pick(v) { if (o.onPick) o.onPick(v); }
    (items || []).forEach(function (x) {
      var on = String(x[0]) === String(o.value);
      nav.append(h("button", { type: "button", role: "tab", "aria-selected": on ? "true" : "false", tabindex: on ? null : "-1", "data-v": String(x[0]),
        title: o.bar ? x[1] : null, "aria-label": o.bar ? x[1] : null, onclick: function () { if (!on) pick(x[0]); } },
        o.bar ? [x[2] ? ds.ico(x[2]) : null, h("span", { class: "tab-label", text: x[1] })] : [x[2] ? ds.ico(x[2]) : null, x[1]]));
    });
    // none chosen: the first can still be reached with Tab
    if (!nav.querySelector('[aria-selected="true"]') && nav.firstElementChild) nav.firstElementChild.removeAttribute("tabindex");
    // the arrow keys, Home and End: from one tab to the next, chosen at once (a tab list's way)
    if (!nav._dsTabs) {
      nav._dsTabs = true;
      nav.addEventListener("keydown", function (e) {
        var all = [].slice.call(nav.querySelectorAll('[role="tab"]')), i = all.indexOf(document.activeElement);
        if (i < 0) return;
        var to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : null;
        if (to == null) return;
        e.preventDefault();
        var b = all[(to + all.length) % all.length];
        b.focus();
        b.click();
        var again = nav.querySelector('[data-v="' + b.getAttribute("data-v") + '"]');
        if (again && again !== document.activeElement) again.focus();
      });
    }
    if (o.scroll) {
      nav.addEventListener("scroll", function () { if (memo) scrolled[memo.id || memo] = nav.scrollLeft; }, { passive: true });
      requestAnimationFrame(function () {
        if (memo && scrolled[memo.id || memo] != null) nav.scrollLeft = scrolled[memo.id || memo];
        var b = nav.querySelector('[aria-selected="true"]');
        if (!b || nav.scrollWidth <= nav.clientWidth) return;
        var n = nav.getBoundingClientRect(), r = b.getBoundingClientRect();
        if (r.left < n.left || r.right > n.right) nav.scrollLeft += r.left + r.width / 2 - (n.left + n.width / 2);
      });
    }
    if (holder && holder !== nav && nav.parentNode !== holder) { holder.textContent = ""; holder.append(nav); }
    return nav;
  }

  /* ---------- a gauge and its legend ---------- */
  function share(value, of) { return Math.max(0, Math.min(100, of ? value / of * 100 : 0)); }
  function meter(value, of, o) {
    o = o || {};
    return h("span", { class: "meter" + (o.cls ? " " + o.cls : ""), role: o.label ? "img" : null, "aria-label": o.label || null, style: o.color ? "--n:" + tone(o.color) : null },
      [h("i", { style: "width:" + share(value, of).toFixed(1) + "%" })]);
  }
  meter.html = function (value, of, o) {
    o = o || {};
    return '<span class="meter' + (o.cls ? " " + ds.esc(o.cls) : "") + '"' + (o.label ? ' role="img" aria-label="' + ds.esc(o.label) + '"' : "") + (o.color ? ' style="--n:' + ds.esc(tone(o.color)) + '"' : "") +
      '><i style="width:' + share(value, of).toFixed(1) + '%"></i></span>';
  };
  function legend(items) {
    return h("div", { class: "chart-split-legend", "aria-hidden": "true" }, (items || []).map(function (x) {
      return h("span", {}, [h("i", { class: "swatch" + (x.open ? " is-open" : ""), style: "--n:" + tone(x.color || "--accent") }), x.label, x.value != null ? h("b", { text: String(x.value) }) : null]);
    }));
  }
  legend.html = function (items) {
    return '<div class="chart-split-legend" aria-hidden="true">' + (items || []).map(function (x) {
      return '<span><i class="swatch' + (x.open ? " is-open" : "") + '" style="--n:' + ds.esc(tone(x.color || "--accent")) + '"></i>' + ds.esc(x.label) +
        (x.value != null ? " <b>" + ds.esc(x.value) + "</b>" : "") + "</span>";
    }).join("") + "</div>";
  };

  /* ---------- a list's middle ---------- */
  function figures(xs) { return (xs || []).filter(function (x) { return typeof x === "number" && !isNaN(x); }); }
  function median(xs) {
    var a = figures(xs).sort(function (x, y) { return x - y; });
    if (!a.length) return null;
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function mean(xs) { var a = figures(xs); return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }

  ds.tile = tile; ds.tiles = tiles; ds.card = card; ds.tabs = tabs; ds.meter = meter; ds.legend = legend; ds.median = median; ds.mean = mean;
})();
/* Behaviours of forms and lists the apps wrote each for itself (the audit of 23 November 2026).
   ds.rows(holder, {open, row}): rows that open something (a sheet), by a click anywhere but on a control of theirs, and by
   Enter or Space on a row reached with Tab (tabindex="0"); row: the rows' selector (tr.is-link and li.is-link unless
   given); open(row, event). Delegated: rows drawn again need nothing more.
   ds.password(input, {toggle, generate, length}): a password field's « Afficher » / « Masquer » button (its words from its
   data-str-show and data-str-hide, or ds's) and its « Générer » button, a strong one of length characters (16) made by the
   browser's crypto, shown at once.
   ds.autosave(field, {save, note, said}): a field that saves itself when left, only if it changed; save(value) gives back
   (a promise of) what the server kept, which goes back in the field (null: the field stays as it is; false: nothing was
   sent, nothing is said), called at once when the field is left; the line under it (note, a .field-note) says how it
   works, then the error in red (is-bad) if saving failed; a bubble says « Enregistré ». said: {idle, saved, error}.
   Gives back {save(), reset(value)}. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"], [role="switch"]';
  var WORDS = _.table({
    fr: { show: "Afficher", hide: "Masquer", saved: "Enregistré.", error: "Pas enregistré : réessaie en quittant le champ." },
    en: { show: "Show", hide: "Hide", saved: "Saved.", error: "Not saved: try again by leaving the field." }
  });

  function rows(holder, o) {
    holder = _.find(holder);
    if (!holder || holder._dsRows) return holder;
    o = o || {};
    var sel = o.row || "tr.is-link, li.is-link";
    holder._dsRows = true;
    holder.addEventListener("click", function (e) {
      var row = e.target.closest && e.target.closest(sel);
      if (!row || !holder.contains(row)) return;
      var x = e.target.closest(INTERACTIVE);
      if (x && x !== row && row.contains(x)) return;
      if (o.open) o.open(row, e);
    });
    holder.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target;
      if (!row.matches || !row.matches(sel)) return;
      e.preventDefault();
      if (o.open) o.open(row, e);
    });
    return holder;
  }

  var ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
  function strong(n) {
    var v = new Uint32Array(n || 16), out = "";
    window.crypto.getRandomValues(v);
    for (var i = 0; i < v.length; i++) out += ALPHABET[v[i] % ALPHABET.length];
    return out;
  }
  function password(input, o) {
    input = _.find(input);
    if (!input) return null;
    o = o || {};
    var toggle = _.find(o.toggle), generate = _.find(o.generate), w = _.words(WORDS);
    function word(b, shown) { return shown ? (b.getAttribute("data-str-hide") || w.hide) : (b.getAttribute("data-str-show") || w.show); }
    function show(on) {
      input.type = on ? "text" : "password";
      if (toggle) { toggle.textContent = word(toggle, on); toggle.setAttribute("aria-pressed", on ? "true" : "false"); }
    }
    if (toggle) toggle.addEventListener("click", function () { show(input.type !== "text"); });
    if (generate) generate.addEventListener("click", function () {
      input.value = strong(o.length || 16);
      show(true);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
    return { show: show, generate: function () { input.value = strong(o.length || 16); show(true); return input.value; } };
  }
  password.strong = strong;

  function autosave(field, o) {
    field = _.find(field);
    if (!field) return null;
    o = o || {};
    var note = _.find(o.note), w = _.words(WORDS), said = o.said || {}, idle = said.idle || (note ? note.textContent : "");
    var last = field.value, pending = null, pendingValue;
    function calm() { if (note) { note.textContent = idle; note.classList.remove("is-bad"); } }
    function save() {
      if (field.value === last || !o.save) return Promise.resolve(null);
      var value = field.value;
      // the same text already on its way (the field left while it is being saved): the same answer
      if (pending && pendingValue === value) return pending;
      // save is called at once, not later: a page that shows another item in the same field right after (a viewer
      // moving on) has not changed what it saves for yet
      var sent;
      try { sent = o.save(value); } catch (e) { sent = Promise.reject(e); }
      if (sent === false) return Promise.resolve(null);
      pendingValue = value;
      var p = pending = Promise.resolve(sent).then(function (kept) {
        if (kept != null) field.value = kept;
        last = field.value;
        calm();
        ds.toast({ type: "good", text: said.saved || w.saved });
        return field.value;
      }, function () {
        if (note) { note.textContent = said.error || w.error; note.classList.add("is-bad"); }
        return null;
      }).then(function (v) { if (pending === p) pending = null; return v; });
      return p;
    }
    field.addEventListener("blur", save);
    field.addEventListener("input", calm);
    return { save: save, reset: function (value) { field.value = value; last = value; calm(); } };
  }

  ds.rows = rows; ds.password = password; ds.autosave = autosave;
})();
/* A form's own checks, in the page's words, instead of the browser's bubbles (the site's workshop request, 6.2.0).
   ds.validate(form, {words}): the form is checked when it is sent, before anything else listens to it (ds.newsletter
   included): a field left empty though required, an address that is not one, a box to tick, a list where nothing is
   chosen. Each one says why in red on the line under it (.field-note.is-bad; written there when the field has none, and
   under its .check for a box), its field gets aria-invalid and a red edge, the first one takes the focus, and the form is
   not sent. From then on a field says it again or is quiet as it is typed in; a field left after being typed in is
   checked as well. Its words: the field's data-error, else words.missing, words.email, words.tick or words.choose, else
   ds's own (in English or French, as the page). A field that was quiet before keeps its own line once corrected.
   Gives back {check(): true when all is right, saying what is not, reset(): every field quiet again}.
   A required field's label says so with a gold star: .field-label.is-required, or the words of a box,
   <label class="check"><input required …> <span class="is-required">…</span></label>. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  if (ds.validate) return;
  var WORDS = _.table({
    fr: { missing: "Ce champ est à remplir.", email: "Saisis une adresse e-mail valide.", tick: "Coche cette case pour continuer.",
          choose: "Choisis une option." },
    en: { missing: "Please fill in this field.", email: "Please enter a valid email address.", tick: "Please tick this box to continue.",
          choose: "Please choose an option." }
  });
  var FIELDS = "input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea";
  var count = 0;

  function validate(form, o) {
    form = _.find(form);
    if (!form) return null;
    if (form._dsValidate) return form._dsValidate;
    o = o || {};
    form.noValidate = true;

    function said(field) {
      var w = Object.assign({}, _.words(WORDS), o.words || {});
      var v = field.validity;
      if (field.dataset.error) return field.dataset.error;
      if (v.valueMissing) return field.type === "checkbox" || field.type === "radio" ? w.tick : field.tagName === "SELECT" ? w.choose : w.missing;
      if (v.typeMismatch && field.type === "email") return w.email;
      return field.validationMessage || w.missing;
    }
    // the line that speaks for a field: the one under it in its group, after its box, or one made for it
    function line(field) {
      if (field._dsLine) return field._dsLine;
      var box = field.closest(".check"), group = !box && field.closest(".field-group");
      var note = group ? group.querySelector(":scope > .field-note") : null;
      if (!note) {
        note = _.el("p", "field-note");
        note.setAttribute("data-validate", "");
        (box || field).after(note);
      }
      if (!note.id) note.id = "ds-check-" + (++count);
      note._dsWas = { text: note.textContent, cls: note.className };
      field._dsLine = note;
      return note;
    }
    function quiet(field) {
      var note = field._dsLine;
      field.removeAttribute("aria-invalid");
      if (!note) return;
      note.textContent = note._dsWas.text;
      note.className = note._dsWas.cls;
      var ids = (field.getAttribute("aria-describedby") || "").split(" ").filter(function (id) { return id && id !== note.id; });
      if (ids.length) field.setAttribute("aria-describedby", ids.join(" ")); else field.removeAttribute("aria-describedby");
    }
    function speak(field) {
      if (field.disabled || !field.willValidate) return true;
      // spaces alone do not fill a required field
      if (field.required && /^(text|email|tel|search|url|textarea)$/.test(field.type)) {
        var w = Object.assign({}, _.words(WORDS), o.words || {});
        field.setCustomValidity(field.value !== "" && field.value.trim() === "" ? field.dataset.error || w.missing : "");
      }
      if (field.checkValidity()) { quiet(field); return true; }
      var note = line(field);
      note.textContent = said(field);
      note.classList.add("is-bad");
      field.setAttribute("aria-invalid", "true");
      var ids = (field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
      if (ids.indexOf(note.id) < 0) field.setAttribute("aria-describedby", ids.concat(note.id).join(" "));
      return false;
    }
    function fields() { return [].slice.call(form.querySelectorAll(FIELDS)); }
    function check() {
      var first = null;
      fields().forEach(function (f) { f._dsChecked = true; if (!speak(f) && !first) first = f; });
      if (first) {
        first.focus({ preventScroll: true });
        first.scrollIntoView({ block: "center", behavior: _.reduced() ? "auto" : "smooth" });
      }
      return !first;
    }
    function reset() { fields().forEach(function (f) { f._dsChecked = false; f.setCustomValidity(""); quiet(f); }); }

    // before every other listener of the form: what is not right is never sent
    form.addEventListener("submit", function (e) {
      if (check()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);
    form.addEventListener("input", function (e) { if (e.target._dsChecked) speak(e.target); });
    form.addEventListener("change", function (e) { if (e.target._dsChecked) speak(e.target); });
    // a field left after being typed in is checked too, so the mistake is said before the end of the form
    form.addEventListener("focusout", function (e) {
      var f = e.target;
      if (!f.matches || !f.matches(FIELDS) || f.type === "checkbox" || f.type === "radio") return;
      if (f.value !== "" || f._dsChecked) { f._dsChecked = true; speak(f); }
    });
    form.addEventListener("reset", function () { setTimeout(reset); });
    form._dsValidate = { check: check, reset: reset };
    return form._dsValidate;
  }

  ds.validate = validate;
})();
/* Gestures the apps wrote each for itself (the audit of 23 November 2026), in ds.js so that every app has them.
   ds.undo({undo, redo, run, key}): taking back the page's changes and making them again. remember(step) keeps a change
   ({label, …}, the latest first) and gives back the « Annuler » action of its bubble; Ctrl+Z (⌘Z) takes back the last
   one, Ctrl+Shift+Z or Ctrl+Y makes it again (a field keeps its own: in it, Ctrl+Z takes back what was typed); the two
   buttons, greyed when they have nothing to do, say what they would do. run(step, redo) asks the server and gives back
   (a promise of) the sentence of the bubble; one at a time, and a step that fails goes back on its list. The bubble is
   the same one throughout (key, the page's own key if it has one). Gives back {remember, undo, redo, clear}.
   ds.optimistic(id, {change, save, revert, done, fail, after}): a box ticked at once, saved after, and back if saving
   failed: change() at once, after() (the page drawn again), then save(); done() when it is kept, revert() and fail(e)
   (else a red bubble) when it is not, after() again. One at a time for each id: ds.optimistic.busy(id) tells.
   ds.copy(text, {said}): copied to the clipboard, « Copié » in a bubble (said); a button [data-copy="text"] or
   [data-copy="#an-element"] (its value or its text) copies without a script of its own, [data-copy-said] its words.
   ds.openAll(urls, {ask, title, text, ok}): each address in its own tab, the first one in front; more than ask (10),
   it asks first; tabs the browser blocked are counted and the bubble says how to let the page open them.
   ds.pop(button, panel, {onOpen, onClose}): a panel under a button of the top bar (.pop, .pop-panel): opened and closed
   by the button, closed by a click elsewhere or Escape (the focus back on the button). ds.pop.count(el, n): its figure,
   « 99+ » over 99, hidden at 0.
   ds.enter(el, {kind}) and ds.leave(el, {kind, remove}): an element (or several) that arrives or goes smoothly, kind
   "slide" (from a little above, the theme's quick duration) or "fade" (a tile that shrinks a little as it fades, the
   theme's middle duration); leave removes it at the end unless remove is false. Nothing moves when the device asks for
   less motion. Both give back a promise.
   ds.redraw(holder, signature, build, {key, scroll, focus}): build(holder) only when signature changed, so that a new
   read does not move a list under the finger; the scroll of scroll (the holder) is kept while key stays the same, the
   focus goes back to the element focus(holder, was) gives (else the one with the same id). ds.redraw.reset(holder).
   ds.highlight(root, selector, terms): the words looked for lit in the text of the elements (mark.hit), accents and
   capitals aside; a {t: "phrase", v} as written, whole words. ds.text.exact(phrase) is that phrase's pattern.
   ds.suggest(word, vocabulary, {room}): the nearest word of vocabulary (a Map of words and how often they come, or a
   list) a few letters away (1 up to 4 letters, 2 up to 8, 3 beyond), the most frequent among the nearest; null when none.
   ds.suggest.vocabulary(texts) makes that Map from texts (words of 3 letters or more, accents and capitals aside). */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  var WORDS = _.table({
    fr: { undo: "Annuler", redo: "Rétablir", noUndo: "Rien à annuler", noRedo: "Rien à rétablir", undoing: "Annulation…",
      redoing: "Rétablissement…", undone: "annulé", redone: "rétabli", undoFailed: "Annulation impossible : réessaie",
      redoFailed: "Rétablissement impossible : réessaie", notSaved: "Pas enregistré : réessaie.", copied: "Copié",
      notCopied: "Copie impossible : sélectionne le texte et copie-le toi-même.",
      // asked from one tab on when ask is 0: « Ouvrir 1 onglet ? », its button « Ouvrir »
      tabs: function (n) { return "Ouvrir " + ds.count(n, "onglet") + " ?"; }, openThem: function (n) { return ds.plural(n, "Ouvrir", "Ouvrir les " + n); },
      blocked: function (n) { return "Le navigateur a bloqué " + (n > 1 ? n + " onglets" : "un onglet") +
        " : autorise les fenêtres pop-up pour ce site (l’icône au bout de la barre d’adresse), puis clique encore."; } },
    en: { undo: "Undo", redo: "Redo", noUndo: "Nothing to undo", noRedo: "Nothing to redo", undoing: "Undoing…",
      redoing: "Redoing…", undone: "undone", redone: "redone", undoFailed: "Could not undo: try again",
      redoFailed: "Could not redo: try again", notSaved: "Not saved: try again.", copied: "Copied",
      notCopied: "Could not copy: select the text and copy it yourself.",
      tabs: function (n) { return "Open " + ds.count(n, "tab") + "?"; }, openThem: function (n) { return ds.plural(n, "Open", "Open all " + n); },
      blocked: function (n) { return "The browser blocked " + (n > 1 ? n + " tabs" : "a tab") +
        ": allow pop-up windows for this site (the icon at the end of the address bar), then click again."; } }
  });
  function list(x) {
    if (x == null) return [];
    if (typeof x === "string") return [].slice.call(document.querySelectorAll(x));
    return x.nodeType ? [x] : [].slice.call(x);
  }

  /* ---------- undo and redo ---------- */
  function undo(o) {
    o = o || {};
    var back = [], again = [], busy = false, key = o.key || "ds-undo";
    var bUndo = _.find(o.undo), bRedo = _.find(o.redo);
    function name(step) { return step.label || step.what || ""; }
    function say(x) { return ds.toast(Object.assign({ key: key }, x)); }
    function buttons() {
      var w = _.words(WORDS);
      [[bUndo, back, w.undo, w.noUndo, "Ctrl+Z"], [bRedo, again, w.redo, w.noRedo, "Ctrl+Y"]].forEach(function (x) {
        var b = x[0], step = x[1][x[1].length - 1];
        if (!b) return;
        b.disabled = !step;
        var t = step ? x[2] + " : " + name(step) + " (" + x[4] + ")" : x[3];
        b.setAttribute("aria-label", t);
        b.title = t;
      });
    }
    function go(redo) {
      var w = _.words(WORDS);
      // one at a time: a second press waits for the first to be done
      if (busy) return Promise.resolve(false);
      var from = redo ? again : back, to = redo ? back : again, step = from.pop();
      if (!step) { say({ type: "info", text: redo ? w.noRedo : w.noUndo }); return Promise.resolve(false); }
      busy = true;
      buttons();
      say({ type: "busy", text: redo ? w.redoing : w.undoing });
      return Promise.resolve().then(function () { return o.run(step, !!redo); }).then(function (text) {
        busy = false;
        to.push(step);
        buttons();
        say({ type: "good", text: text || name(step) + " · " + (redo ? w.redone : w.undone),
          action: { label: redo ? w.undo : w.redo, run: function () { go(!redo); } } });
        return true;
      }, function () {
        busy = false;
        from.push(step);
        buttons();
        say({ type: "bad", text: redo ? w.redoFailed : w.undoFailed });
        return false;
      });
    }
    if (bUndo) bUndo.addEventListener("click", function () { go(false); });
    if (bRedo) bRedo.addEventListener("click", function () { go(true); });
    if (o.keys !== false) document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if (!(e.ctrlKey || e.metaKey) || e.altKey || (k !== "z" && k !== "y")) return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      go(k === "y" || e.shiftKey);
    });
    buttons();
    return {
      remember: function (step) {
        if (!step) return null;
        back.push(step);
        again.length = 0;
        buttons();
        return { label: _.words(WORDS).undo, run: function () { go(false); } };
      },
      undo: function () { return go(false); },
      redo: function () { return go(true); },
      clear: function () { back.length = 0; again.length = 0; buttons(); }
    };
  }

  /* ---------- a change shown at once, saved after ---------- */
  var pending = {};
  function optimistic(id, o) {
    o = o || {};
    if (id != null && pending[id]) return null;
    if (id != null) pending[id] = true;
    if (o.change) o.change();
    if (o.after) o.after();
    return Promise.resolve().then(o.save).then(function (v) {
      if (id != null) delete pending[id];
      if (o.done) o.done(v);
      if (o.after) o.after();
      return true;
    }, function (e) {
      if (id != null) delete pending[id];
      if (o.revert) o.revert(e);
      if (o.fail) o.fail(e);
      else ds.toast({ type: "bad", text: (e && e.message) || _.words(WORDS).notSaved });
      if (o.after) o.after();
      return false;
    });
  }
  optimistic.busy = function (id) { return !!pending[id]; };

  /* ---------- the clipboard ---------- */
  function copy(text, o) {
    o = o || {};
    var w = _.words(WORDS);
    text = String(text == null ? "" : text);
    if (!text.trim()) return Promise.resolve(false);
    function old() {
      // a browser without the clipboard's API (or a page that is not https): a hidden field, selected and copied
      var f = _.el("textarea");
      f.value = text;
      f.setAttribute("readonly", "");
      f.style.position = "fixed";
      f.style.opacity = "0";
      document.body.appendChild(f);
      f.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      f.remove();
      if (!ok) throw new Error("copy");
    }
    var p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).catch(old) : Promise.resolve().then(old);
    return p.then(function () {
      ds.toast({ type: "good", text: o.said || w.copied });
      return true;
    }, function () {
      ds.toast({ type: "bad", text: w.notCopied });
      return false;
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copy]");
    if (!b) return;
    var v = b.getAttribute("data-copy"), src = /^#/.test(v) ? document.querySelector(v) : null;
    copy(src ? ("value" in src ? src.value : src.textContent) : v, { said: b.getAttribute("data-copy-said") || null });
  });

  /* ---------- several links at once ---------- */
  function openAll(urls, o) {
    o = o || {};
    urls = (urls || []).filter(Boolean);
    var w = _.words(WORDS), ask = o.ask == null ? 10 : o.ask;
    if (!urls.length) return Promise.resolve({ opened: 0, blocked: 0 });
    var asked = urls.length > ask ? ds.confirm({ title: o.title || w.tabs(urls.length), text: o.text || "", ok: o.ok || w.openThem(urls.length) }) : Promise.resolve(true);
    return Promise.resolve(asked).then(function (yes) {
      if (!yes) return { opened: 0, blocked: 0 };
      var tabs = urls.map(function (u) {
        var t = window.open(u, "_blank");
        // the page opened gets no hold on this one
        if (t) { try { t.opener = null; } catch (e) { /* already elsewhere */ } }
        return t;
      });
      var shut = tabs.filter(function (t) { return !t; }).length;
      // back on the first one, where the browser lets a page choose
      if (tabs[0] && tabs.length > 1) { try { tabs[0].focus(); } catch (e) { /* the browser keeps the last one */ } }
      if (shut) ds.toast({ type: "bad", text: w.blocked(shut) });
      return { opened: tabs.length - shut, blocked: shut };
    });
  }

  /* ---------- a panel under a button ---------- */
  function pop(button, panel, o) {
    button = _.find(button);
    panel = _.find(panel);
    if (!button || !panel) return null;
    if (panel._dsPop) return panel._dsPop;
    o = o || {};
    var layer = null;
    function isOpen() { return !panel.hidden; }
    function close(back) {
      if (!isOpen()) return;
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (layer) { _.unlayer(layer); layer = null; }
      if (back) button.focus();
      if (o.onClose) o.onClose();
    }
    function open() {
      if (isOpen()) return;
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      // Escape closes it, the focus back on its button; Tab goes on through the page
      layer = _.layer({ el: panel, close: function () { close(true); }, trap: false });
      if (o.onOpen) o.onOpen();
    }
    button.setAttribute("aria-expanded", isOpen() ? "true" : "false");
    button.addEventListener("click", function () { if (isOpen()) close(); else open(); });
    document.addEventListener("click", function (e) {
      if (isOpen() && !panel.contains(e.target) && !button.contains(e.target)) close();
    });
    return (panel._dsPop = { open: open, close: close, toggle: function () { if (isOpen()) close(); else open(); }, isOpen: isOpen });
  }
  pop.count = function (el, n) {
    el = _.find(el);
    if (!el) return;
    n = Math.max(0, n | 0);
    el.textContent = n > 99 ? "99+" : String(n);
    el.hidden = n === 0;
  };

  /* ---------- arriving and going ---------- */
  function frames(kind, root) {
    if (kind === "fade") return [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }];
    var d = root.getPropertyValue("--s-8").trim() || "8px";
    return [{ opacity: 0, transform: "translateY(-" + d + ")" }, { opacity: 1, transform: "none" }];
  }
  function move(els, kind, out) {
    var root = getComputedStyle(document.documentElement);
    var ms = _.ms(root.getPropertyValue(kind === "fade" ? "--t-mid" : "--t-fast").trim() || "0s");
    return Promise.all(els.map(function (el) {
      if (!ms || _.reduced() || !el.animate) return null;
      var f = frames(kind, root);
      if (out) f = f.slice().reverse();
      var a = el.animate(f, { duration: ms, easing: out ? "ease-in" : "cubic-bezier(0.22, 1, 0.36, 1)", fill: out ? "forwards" : "none" });
      return new Promise(function (ok) { a.onfinish = ok; a.oncancel = ok; });
    }));
  }
  function enter(el, o) { o = o || {}; return move(list(el), o.kind || "slide", false); }
  function leave(el, o) {
    o = o || {};
    var els = list(el);
    return move(els, o.kind || "slide", true).then(function () {
      if (o.remove !== false) els.forEach(function (x) { x.remove(); });
    });
  }

  /* ---------- drawing again without losing one's place ---------- */
  function redraw(holder, sig, build, o) {
    holder = _.find(holder);
    o = o || {};
    if (!holder) return false;
    var key = o.key == null ? "" : String(o.key), drawn = key + "\u0000" + sig;
    if (holder._dsDrawn === drawn) return false;
    var scroller = _.find(o.scroll) || holder, top = holder._dsKey === key ? scroller.scrollTop : 0;
    var was = document.activeElement, inside = !!was && was !== document.body && holder.contains(was);
    build(holder);
    holder._dsDrawn = drawn;
    holder._dsKey = key;
    scroller.scrollTop = top;
    if (inside && !holder.contains(was)) {
      var f = o.focus ? o.focus(holder, was) : was.id ? document.getElementById(was.id) : null;
      if (f && f.focus) f.focus({ preventScroll: true });
    }
    return true;
  }
  redraw.reset = function (holder) { holder = _.find(holder); if (holder) { holder._dsDrawn = null; holder._dsKey = null; } };

  /* ---------- what a search looked for, lit; the word it may have meant ---------- */
  var escape = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
  // a phrase as whole words, accents counted, capitals aside
  function exact(phrase) {
    var words = String(phrase || "").split(/\s+/).filter(Boolean);
    return words.length ? new RegExp("(?<![\\p{L}\\p{N}_])" + words.map(escape).join("\\s+") + "(?![\\p{L}\\p{N}_])", "iu") : null;
  }
  function highlight(root, selector, terms) {
    root = _.find(root);
    var fold = ds.text.fold;
    terms = (terms || []).map(function (t) { return typeof t === "string" ? { t: "word", v: t } : t; }).filter(function (t) { return t && String(t.v || "").trim(); });
    if (!root || !terms.length) return;
    [].forEach.call(root.querySelectorAll(selector), function (el) {
      var text = el.textContent, spans = [], at = [], folded = "";
      // each folded letter knows where it came from in the text
      for (var i = 0; i < text.length; i++) { var c = fold(text[i]); for (var j = 0; j < c.length; j++) { folded += c[j]; at.push(i); } }
      at.push(text.length);
      terms.forEach(function (w) {
        if (w.t === "phrase") {
          var rx = exact(w.v), m, g;
          if (!rx) return;
          g = new RegExp(rx.source, "giu");
          while ((m = g.exec(text))) { spans.push([m.index, m.index + m[0].length]); if (!m[0].length) g.lastIndex++; }
          return;
        }
        var v = fold(w.v);
        for (var k = v ? folded.indexOf(v) : -1; k >= 0; k = folded.indexOf(v, k + v.length)) spans.push([at[k], at[k + v.length - 1] + 1]);
      });
      if (!spans.length) return;
      spans.sort(function (a, b) { return a[0] - b[0]; });
      var merged = [];
      spans.forEach(function (s) { var last = merged[merged.length - 1]; if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]); else merged.push(s.slice()); });
      var html = "", pos = 0;
      merged.forEach(function (s) { html += ds.esc(text.slice(pos, s[0])) + '<mark class="hit">' + ds.esc(text.slice(s[0], s[1])) + "</mark>"; pos = s[1]; });
      el.innerHTML = html + ds.esc(text.slice(pos));
    });
  }
  function distance(a, b, most) {
    var row = [], i, j;
    for (j = 0; j <= b.length; j++) row.push(j);
    for (i = 1; i <= a.length; i++) {
      var next = [i], low = i;
      for (j = 1; j <= b.length; j++) {
        next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        low = Math.min(low, next[j]);
      }
      if (low > most) return most + 1;
      row = next;
    }
    return row[b.length];
  }
  function suggest(word, vocabulary, o) {
    o = o || {};
    var v = ds.text.fold(word);
    if (v.length < 3 || !vocabulary) return null;
    var room = o.room != null ? o.room : v.length <= 4 ? 1 : v.length <= 8 ? 2 : 3, best = null;
    var entries = vocabulary instanceof Map ? Array.from(vocabulary) : Array.from(vocabulary, function (x) { return [x, 1]; });
    entries.forEach(function (e) {
      var w = ds.text.fold(e[0]), n = e[1];
      if (w === v || Math.abs(w.length - v.length) > room) return;
      var d = distance(v, w, room);
      if (d <= room && (!best || d < best[1] || (d === best[1] && n > best[2]))) best = [e[0], d, n];
    });
    return best ? best[0] : null;
  }
  suggest.vocabulary = function (texts) {
    var out = new Map();
    (texts || []).forEach(function (t) {
      ds.text.fold(t || "").split(/[^\p{L}\p{N}]+/u).forEach(function (w) { if (w.length >= 3) out.set(w, (out.get(w) || 0) + 1); });
    });
    return out;
  };
  suggest.distance = distance;

  ds.undo = undo; ds.optimistic = optimistic; ds.copy = copy; ds.openAll = openAll; ds.pop = pop;
  ds.enter = enter; ds.leave = leave; ds.redraw = redraw; ds.highlight = highlight; ds.suggest = suggest;
  ds.text.exact = exact;
})();
/* Picking rows or tiles, in ds.js since 4.21.0 (it was in ds-tools.js, for tables only).
   ds.selection(holder, {bar, count, sum, onPick, cls}) picks rows (or tiles): each one of holder with a data-key and its
   box, <input type="checkbox" class="sel-box"> or <button class="box sel-box" aria-pressed> (a photo's, button.box.on-photo); a click on a box picks or drops its row, a shift-click the rows since the
   last box; a picked row is cls (.is-selected unless given: a photo's is .is-picked); the box .sel-all picks every row shown, half-ticked when some are. A picked row is .is-selected. bar: the
   .selbar (else the one in holder), shown while something is picked, its .selbar-n saying how many (count(n), in
   words), its .selbar-sum what they add up to (sum(keys), a text the page gives: « −128,40 € »), its [data-sel-clear]
   dropping all. A group's head (a day's row in a list by day) may hold a box .sel-group: it picks, or drops, the rows
   under it up to the next head, half-ticked when some are (4.1.0). The choice is kept by key, so a list drawn again
   keeps it: call paint().
   Returns {keys(), has(key), set(key, on), clear(), paint()}; onPick(keys) after each change. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._, find = _.find;
  var WORDS = _.table({
    // written at 0 too, while the bar is hidden: « 0 ligne choisie », « 0 rows selected »
    fr: { picked: function (n) { return ds.count(n, "ligne choisie", "lignes choisies"); } },
    en: { picked: function (n) { return ds.count(n, "row selected", "rows selected"); } }
  });
  function words() { return _.words(WORDS); }
  function selection(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    if (holder._dsSel) { if (o) holder._dsSel.o = o; return holder._dsSel; }
    var sel = { o: o || {}, picked: new Set(), last: null };
    holder._dsSel = sel;
    function bar() { return find(sel.o.bar) || holder.querySelector(".selbar"); }
    function rows() { return [].filter.call(holder.querySelectorAll("[data-key]"), function (r) { return r.querySelector(".sel-box"); }); }
    function cls() { return sel.o.cls || "is-selected"; }
    // a box is a checkbox, or a button pressed or not
    function tick(box, on) { if (box.type === "checkbox") box.checked = on; else box.setAttribute("aria-pressed", on ? "true" : "false"); }
    function changed() { sel.paint(); if (sel.o.onPick) sel.o.onPick(sel.keys()); }
    // a group's rows: those after its head, up to the next head
    function groupRows(box) {
      var head = box.closest("tr, li, [data-sel-head]"), out = [];
      for (var r = head && head.nextElementSibling; r && !r.querySelector(".sel-group"); r = r.nextElementSibling) {
        if (r.hasAttribute("data-key") && r.querySelector(".sel-box")) out.push(r);
      }
      return out;
    }
    sel.keys = function () { return Array.from(sel.picked); };
    sel.has = function (key) { return sel.picked.has(String(key)); };
    sel.set = function (key, on) { if (on) sel.picked.add(String(key)); else sel.picked.delete(String(key)); changed(); return sel; };
    sel.clear = function () { sel.picked.clear(); sel.last = null; changed(); return sel; };
    sel.paint = function () {
      var list = rows(), shown = 0;
      list.forEach(function (r) {
        var on = sel.picked.has(r.getAttribute("data-key"));
        r.classList.toggle(cls(), on);
        tick(r.querySelector(".sel-box"), on);
        if (on) shown++;
      });
      var all = holder.querySelector(".sel-all");
      if (all) { all.checked = list.length > 0 && shown === list.length; all.indeterminate = shown > 0 && shown < list.length; }
      [].forEach.call(holder.querySelectorAll(".sel-group"), function (g) {
        var rs = groupRows(g), n = rs.filter(function (r) { return sel.picked.has(r.getAttribute("data-key")); }).length;
        g.checked = rs.length > 0 && n === rs.length;
        g.indeterminate = n > 0 && n < rs.length;
      });
      var b = bar(), n = sel.picked.size;
      if (b) {
        b.hidden = !n;
        var count = b.querySelector(".selbar-n"), sum = b.querySelector(".selbar-sum");
        if (count) count.textContent = (sel.o.count || words().picked)(n);
        if (sum) sum.textContent = n && sel.o.sum ? sel.o.sum(sel.keys()) || "" : "";
      }
      return sel;
    };
    holder.addEventListener("click", function (e) {
      var box = e.target.closest && e.target.closest(".sel-box");
      if (!box || !holder.contains(box)) return;
      var list = rows(), row = box.closest("[data-key]"), keys = list.map(function (r) { return r.getAttribute("data-key"); });
      var i = list.indexOf(row), j = sel.last == null ? -1 : keys.indexOf(sel.last);
      // a button's state is the page's: pressing it turns its row the other way
      var on = box.type === "checkbox" ? box.checked : !sel.picked.has(row.getAttribute("data-key"));
      // shift-click picks, or drops, the whole range since the last box
      var span = e.shiftKey && j >= 0 ? list.slice(Math.min(i, j), Math.max(i, j) + 1) : [row];
      span.forEach(function (r) { if (on) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      sel.last = row.getAttribute("data-key");
      changed();
    });
    holder.addEventListener("change", function (e) {
      var cl = e.target.classList;
      if (!cl || !(cl.contains("sel-all") || cl.contains("sel-group"))) return;
      (cl.contains("sel-all") ? rows() : groupRows(e.target)).forEach(function (r) {
        if (e.target.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key"));
      });
      changed();
    });
    // « Annuler » in the bar, wherever the bar is
    document.addEventListener("click", function (e) {
      var b = bar(), x = e.target.closest && e.target.closest("[data-sel-clear]");
      if (x && b && b.contains(x)) sel.clear();
    });
    sel.paint();
    return sel;
  }
  ds.selection = selection;
})();
/* Signed images that lapse (the audit of 23 November 2026, Selecta's image-refresh.js), in ds.js.
   ds.images.renew({url, attr, attempts, delay}): an image whose signed address has expired (an <img> carrying its key in
   attr, data-signed-image unless given) asks the page's server (url: GET, {urls: {key: address}}) for fresh addresses,
   for every image that failed in the same moment (delay, 150 ms) at once, and puts them in place without reloading the
   page (an upload or an open viewer stays as it is). Two tries per image (attempts): past that its file is gone, not
   its address. Without url (the page's <body data-image-urls>), nothing is asked. Called once; gives back nothing. */
(function () {
  "use strict";
  var ds = window.ds;
  var wired = false;
  function renew(o) {
    if (wired) return;
    wired = true;
    o = o || {};
    var attr = o.attr || "data-signed-image", most = o.attempts || 2, delay = o.delay == null ? 150 : o.delay;
    var tries = new Map(), pending = new Set(), busy = false, timer = null, givenUp = false;
    function url() { return o.url || (document.body && document.body.getAttribute("data-image-urls")); }
    function soon() {
      if (timer || busy) return;
      timer = setTimeout(function () { timer = null; ask(); }, delay);
    }
    function ask() {
      var keys = new Set(pending), to = url();
      pending.clear();
      if (givenUp || !keys.size) return;
      if (!to) { givenUp = true; return; }
      busy = true;
      ds.api("GET", to).then(function (body) {
        var urls = (body && body.urls) || {};
        [].forEach.call(document.querySelectorAll("[" + attr + "]"), function (im) {
          var k = im.getAttribute(attr);
          if (keys.has(k) && urls[k]) im.src = urls[k];
        });
      }, function () { givenUp = true; }).then(function () {
        busy = false;
        if (pending.size) soon();
      });
    }
    // an image's error does not bubble, but it reaches its ancestors on the way down
    document.addEventListener("error", function (e) {
      var im = e.target;
      if (givenUp || !(im instanceof HTMLImageElement)) return;
      var k = im.getAttribute(attr);
      if (!k) return;
      var n = (tries.get(k) || 0) + 1;
      tries.set(k, n);
      if (n > most) return;
      pending.add(k);
      soon();
    }, true);
  }
  ds.images = { renew: renew };
})();
/* ds.sheet(el, {onOpen, onClose}): the sheet of src/sheet.css, its veil el (<div class="sheet" hidden>) around its
   .sheet-panel. Returns {open(from), close(), toggle(), isOpen, el, panel} (el the veil, panel its .sheet-panel); called again
   on the same el, it gives the same sheet.
   Opening it moves the focus into the panel, and Tab stays there; closing gives the focus back to what had it (or to
   from, e.g. the row that opened it). Escape, a click on the veil, its cross (.sheet-close) or a [data-sheet-close] close
   it: the last one opened first, and a window of ds.confirm over it keeps its own Escape. On a phone the page behind
   does not scroll while it is open (sheet.css). */
(function () {
  "use strict";
  var _ = window.ds._;
  function sheet(el, opts) {
    el = _.find(el);
    if (!el) return null;
    if (el._dsSheet) { if (opts) el._dsSheet.opts = opts; return el._dsSheet; }
    var panel = el.querySelector(".sheet-panel") || el, s = { el: el, panel: panel, opts: opts || {}, isOpen: false, before: null };
    // open, a layer: Escape closes it, the last one opened first, and Tab goes round inside it while the focus is in it
    // (a picker's list floating outside it keeps its own keys)
    var cover = { el: panel, loose: true, close: function () { s.close(); } };
    el._dsSheet = s;
    panel.setAttribute("tabindex", "-1");
    el.querySelectorAll(".sheet-close").forEach(function (x) { if (!x.hasAttribute("aria-label")) x.setAttribute("aria-label", _.words().close); });
    s.open = function (from) {
      if (s.isOpen) return s;
      s.isOpen = true;
      s.before = from || document.activeElement;
      el.hidden = false;
      _.layer(cover);
      panel.scrollTop = 0;
      panel.focus({ preventScroll: true });
      if (s.opts.onOpen) s.opts.onOpen(s);
      return s;
    };
    s.close = function () {
      if (!s.isOpen) return s;
      s.isOpen = false;
      el.hidden = true;
      _.unlayer(cover);
      var back = s.before;
      s.before = null;
      // what opened it may be gone, drawn again while the sheet was open: then the focus stays where the page puts it
      if (back && back.focus && back.isConnected) back.focus({ preventScroll: true });
      if (s.opts.onClose) s.opts.onClose(s);
      return s;
    };
    s.toggle = function (from) { return s.isOpen ? s.close() : s.open(from); };
    el.addEventListener("click", function (e) {
      if (e.target === el || (e.target.closest && e.target.closest(".sheet-close, [data-sheet-close]"))) s.close();
    });
    return s;
  }
  window.ds = window.ds || {};
  window.ds.sheet = sheet;
})();
/* The behaviour of src/pick.css.
   ds.pills(root): each pill of root (or the page, or root itself when it is one) says its menu’s choice in its .pill-value,
   and a .pill.is-filter is lit (.is-on) while its menu holds a value. Done on its own when the page is ready and on
   every change of a pill's menu; a page that sets a menu itself (select.value = …) calls it after.
   ds.picker(holder, items, {value, first, limit, placeholder, label, empty, onPick, opener, check}) draws a search picker
   in holder: a field, then the choices that match what is typed, accents and capitals aside, every word of it.
     items: [{value, label, sub (a word in small after it), group (its heading), color (its --n), initial or icon,
     cta (what a tap does), href (a link: a tap goes there), keywords (more words it is found by)}], or null while they
     are read (« Chargement… »); value: the current choice, in gold; first: the values shown before anything is typed
     (the banks most people have), else every choice; limit: how many at most (12); empty: the words when nothing
     matches; onPick(item, {checked}) on a tap or Enter; opener: a button that shows and hides it (aria-expanded), the
     search taking the focus, and one such picker open at a time (opening one closes the other: a sheet with a
     category's and a trip's would grow too tall); check: a box at its foot ({label, checked}, Bank's « Seulement cette opération »), its state
     given to onPick (checked) and read by checked(). ↑ and ↓ go through the choices, Enter takes one, Escape empties the search, then closes it.
     Returns {open(), close(), toggle(), set(items, options), draw(), checked(), input}; set takes the list once read, and
     may change the options with it (first, empty…). */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find, tag = _.el;
  // the picker with an opener open now: opening another closes it (« quand j'ouvre la recherche de la catégorie, ça
  // ferme celle de voyage », 22 November 2026)
  var shown = null;
  var WORDS = _.table({
    fr: { search: "Chercher…", none: "Rien ne correspond.", loading: "Chargement de la liste…", clear: "Effacer" },
    en: { search: "Search…", none: "Nothing matches.", loading: "Loading the list…", clear: "Clear" }
  });
  function words() { return _.words(WORDS); }

  function pills(root) {
    root = find(root) || document;
    var list = root.matches && root.matches(".pill") ? [root] : root.querySelectorAll(".pill");
    [].forEach.call(list, function (p) {
      var sel = p.querySelector("select");
      if (!sel) return;
      var pv = p.querySelector(".pill-value");
      if (!pv) { pv = tag("span", "pill-value"); p.insertBefore(pv, p.firstChild); }
      var o = sel.options[sel.selectedIndex];
      pv.textContent = o ? o.textContent : "";
      if (p.classList.contains("is-filter")) p.classList.toggle("is-on", !!sel.value);
    });
  }
  document.addEventListener("change", function (e) {
    var p = e.target.closest && e.target.closest(".pill");
    if (p) pills(p);
  });
  // now, for what is on the page already, and once it is all there, for what a page's first script drew
  pills();
  document.addEventListener("DOMContentLoaded", function () { pills(); });

  var made = 0;
  var fold = window.ds.text.fold;
  function picker(holder, items, o) {
    holder = find(holder);
    if (!holder) return null;
    o = Object.assign({}, o);
    // called again on the same holder: the same picker, with the items given
    if (holder._dsPicker) { if (items !== undefined) holder._dsPicker.set(items); return holder._dsPicker; }
    var w = words(), id = "ds-picker-" + (++made), p = { items: items === undefined ? [] : items, shown: [], active: -1 };
    holder._dsPicker = p;
    holder.classList.add("picker");
    var input = tag("input", "picker-q"), list = tag("div", "picker-list");
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = o.placeholder || w.search;
    input.setAttribute("aria-label", o.label || input.placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", id);
    list.id = id;
    list.setAttribute("role", "listbox");
    // the field with its cross (.search-field): emptied in one tap, the whole list is back
    var field = tag("span", "search-field"), clear = tag("button", "search-clear");
    clear.type = "button";
    clear.setAttribute("aria-label", w.clear);
    clear.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-close"/></svg>';
    field.append(input, clear);
    holder.replaceChildren(field, list);
    p.input = input;
    // its box, under the choices: what a choice is for
    var box = null;
    if (o.check) {
      var foot = tag("label", "picker-check");
      box = tag("input");
      box.type = "checkbox";
      box.checked = !!o.check.checked;
      foot.append(box, tag("span", "", o.check.label || ""));
      holder.appendChild(foot);
    }
    p.checked = function () { return !!(box && box.checked); };

    function matches() {
      var items = p.items || [], q = fold(input.value.trim()), limit = o.limit || 12;
      if (!q) {
        var start = o.first ? o.first.map(function (v) { return items.filter(function (x) { return fold(x.value) === fold(v); })[0]; }).filter(Boolean) : items;
        return start.slice(0, limit);
      }
      var parts = q.split(/\s+/);
      return items.filter(function (x) {
        var text = fold([x.label, x.sub, x.group, x.keywords].join(" "));
        return parts.every(function (part) { return text.indexOf(part) >= 0; });
      }).slice(0, limit);
    }
    function option(x, i) {
      var opt = tag(x.href ? "a" : "button", "picker-opt");
      if (x.href) opt.href = x.href; else opt.type = "button";
      opt.id = id + "-" + i;
      opt.tabIndex = -1;
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", o.value != null && String(x.value) === String(o.value) ? "true" : "false");
      if (x.initial || x.icon || x.color) {
        var av = tag("span", "picker-av" + (x.initial || x.icon ? "" : " is-dot"), x.initial || null);
        av.setAttribute("aria-hidden", "true");
        // a colour given as a token's name ("--c-bleu") or as a value, as in the charts and the calendar
        if (x.color) av.style.setProperty("--n", _.tone(x.color));
        if (x.icon) av.appendChild(window.ds.ico(x.icon));
        opt.appendChild(av);
      }
      var name = tag("span", "picker-name", x.label);
      if (x.sub) { name.append(" "); name.appendChild(tag("small", "", x.sub)); }
      opt.appendChild(name);
      if (x.cta) opt.appendChild(tag("span", "picker-cta", x.cta));
      opt.addEventListener("click", function () { pick(x); });
      return opt;
    }
    p.draw = function () {
      p.shown = p.items ? matches() : [];
      p.active = -1;
      input.removeAttribute("aria-activedescendant");
      var kids = [], group = null;
      if (!p.items) kids.push(tag("p", "picker-none", w.loading));
      else if (!p.shown.length) kids.push(tag("p", "picker-none", o.empty || w.none));
      p.shown.forEach(function (x, i) {
        // a heading each time the group changes: a category, then its subcategories
        if (x.group && x.group !== group) kids.push(tag("p", "picker-g", x.group));
        group = x.group || null;
        kids.push(option(x, i));
      });
      list.replaceChildren.apply(list, kids);
      return p;
    };
    function light(i) {
      var opts = list.querySelectorAll(".picker-opt");
      if (!opts.length) return;
      p.active = (i + opts.length) % opts.length;
      [].forEach.call(opts, function (x, k) { x.classList.toggle("is-focused", k === p.active); });
      input.setAttribute("aria-activedescendant", opts[p.active].id);
      opts[p.active].scrollIntoView({ block: "nearest" });
    }
    function pick(x) {
      o.value = x.value;
      if (o.onPick) o.onPick(x, { checked: p.checked() });
      if (x.href) return;
      p.draw();
    }
    input.addEventListener("input", p.draw);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); light(p.active < 0 && e.key === "ArrowUp" ? -1 : p.active + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter") {
        // Enter takes the lit choice, or the first one once something is typed
        var x = p.shown[p.active >= 0 ? p.active : input.value.trim() ? 0 : -1];
        if (!x) return;
        e.preventDefault();
        if (x.href) { if (o.onPick) o.onPick(x); location.href = x.href; } else pick(x);
      } else if (e.key === "Escape") {
        // first the search, then the picker itself; with nothing left to do, Escape goes on to the sheet around it
        if (input.value) { e.preventDefault(); input.value = ""; p.draw(); }
        else if (opener && !holder.hidden) { e.preventDefault(); p.close(); opener.focus(); }
      }
    });
    var opener = find(o.opener);
    p.open = function () {
      if (opener && shown && shown !== p) shown.close();
      if (opener) shown = p;
      holder.hidden = false;
      if (opener) opener.setAttribute("aria-expanded", "true");
      p.draw();
      input.focus();
      return p;
    };
    p.close = function () {
      if (shown === p) shown = null;
      holder.hidden = true;
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (items, more) { p.items = items; if (more) Object.keys(more).forEach(function (k) { o[k] = more[k]; }); return p.draw(); };
    if (opener) {
      opener.setAttribute("aria-controls", holder.id || (holder.id = id + "-box"));
      opener.setAttribute("aria-expanded", holder.hidden ? "false" : "true");
      opener.addEventListener("click", p.toggle);
    }
    return p.draw();
  }
  window.ds = window.ds || {};
  window.ds.pills = pills;
  window.ds.picker = picker;
})();
/* A settings page's pieces, in ds.js for every app (4.25.0; Studio's and Bank's settings wrote them by hand, then
   ds-tools.js had them): a switch that saves, a connection's row, number fields by group. Their look is src/settings.css,
   on a page whose body is .settings; ds.jobs (the syncs and their journal) stays in ds-tools.js. */
(function () {
  "use strict";
  var _ = window.ds._;
  /* A settings page's pieces, built (Studio's and Bank's settings wrote them by hand):
     ds.switch({label, on, help, text}, save): a switch (label.switch) that saves at once: save(on) gives back a promise; the
     switch waits disabled, and goes back with a red bubble if saving failed.
     ds.conn({name, tone, details, action}) and ds.conns(holder, rows): a connection's row (.conn): its dot (tone "good" or
     "bad"), its name, its details (a text, or {text, tone}), its action (a node, or {href, text}: another site opens in
     a new tab, « ↗ », the app's own page « → »); ds.conn.html for a page that writes strings (name and details as HTML).
     ds.fields(holder, groups, {onChange}): number fields by group, [{group, key, label, help, value, default, min, max,
     unit}]: changed (is-changed) or out of bounds (aria-invalid) as typed; onChange({edited, wrong}) after each key;
     gives back {edited(), wrong()}. unit: a word written as given (« min », « % »), or [one, many] (["jour", "jours"]),
     which agrees with its figure: « Par défaut 1 jour », and beside the field with what is typed. */
  function settingSwitch(sw, save) {
    var h = window.ds.h, input = h("input", { type: "checkbox", role: "switch", "aria-label": sw.label });
    input.checked = !!sw.on;
    input.addEventListener("change", function () {
      input.disabled = true;
      Promise.resolve().then(function () { return save(input.checked); }).then(function () { input.disabled = false; }, function (e) {
        input.checked = !input.checked; input.disabled = false;
        window.ds.toast({ type: "bad", text: e && e.message ? e.message : String(e) });
      });
    });
    return h("label", { class: "switch", title: sw.help || null }, [input, sw.text || sw.label]);
  }
  function connAction(a) {
    var h = window.ds.h;
    if (!a) return null;
    if (a.nodeType) return a;
    var ext = /^https?:/.test(a.href);
    return h("a", { href: a.href, target: ext ? "_blank" : null, rel: ext ? "noopener" : null, text: a.text + (ext ? " ↗" : " →") });
  }
  function conn(c) {
    var h = window.ds.h;
    return h("div", { class: "conn" }, [h("span", { class: "name" }, [c.tone ? h("i", { class: "sync-dot is-" + c.tone, "aria-hidden": "true" }) : null, c.name]),
      ].concat((c.details || []).map(function (d) { return h("span", { class: "det" + (d && d.tone ? " is-" + d.tone : ""), text: d && d.text != null ? d.text : d }); }), [connAction(c.action)]));
  }
  conn.html = function (c) {
    return '<div class="conn"><span class="name">' + (c.tone ? '<i class="sync-dot is-' + c.tone + '" aria-hidden="true"></i>' : "") + c.name + "</span>" +
      (c.details || []).map(function (d) { return '<span class="det' + (d && d.tone ? " is-" + d.tone : "") + '">' + (d && d.text != null ? d.text : d) + "</span>"; }).join("") +
      (c.action || "") + "</div>";
  };
  function conns(holder, rows) {
    holder = _.find(holder);
    var list = (rows || []).map(conn);
    if (holder) { holder.textContent = ""; list.forEach(function (x) { holder.append(x); }); }
    return list;
  }
  function fields(holder, list, o) {
    var h = window.ds.h, edited = {}, groups = {};
    holder = _.find(holder);
    o = o || {};
    (list || []).forEach(function (f) { (groups[f.group || ""] = groups[f.group || ""] || []).push(f); });
    function wrong() { return holder ? holder.querySelectorAll('input[aria-invalid="true"]').length : 0; }
    function tell() { if (o.onChange) o.onChange({ edited: Object.assign({}, edited), wrong: wrong() }); }
    // the unit for a figure: [one, many] by ds.plural (« 1 jour », « 30 jours »), a single word as the page wrote it
    function unitOf(f, n) { return Array.isArray(f.unit) ? window.ds.plural(n, f.unit[0], f.unit[1]) : f.unit; }
    var out = Object.keys(groups).map(function (g) {
      return h("div", { class: "group" }, [g ? h("h3", { text: g }) : null].concat(groups[g].map(function (f) {
        var id = "f-" + f.key, input = h("input", { id: id, type: "number", inputmode: "numeric", min: f.min, max: f.max, step: 1, value: f.value });
        var unit = f.unit ? h("span", { class: "unit", text: unitOf(f, f.value) }) : null;
        input.addEventListener("input", function () {
          var v = input.value.trim();
          if (v === "" || +v === f.value) delete edited[f.key]; else edited[f.key] = v;
          var bad = v !== "" && (!/^-?\d+$/.test(v) || (f.min != null && +v < f.min) || (f.max != null && +v > f.max));
          if (bad) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
          input.classList.toggle("is-changed", f.key in edited && !bad);
          // the word beside the field follows the figure typed (the value kept while the field is empty)
          if (unit) unit.textContent = unitOf(f, v !== "" && !isNaN(+v) ? +v : f.value);
          tell();
        });
        return h("div", { class: "field" }, [h("label", { class: "lab", for: id, text: f.label }),
          h("div", { class: "help" }, [f.help ? f.help + " " : "", f.default != null ? h("span", { class: "def", text: (_.english() ? "Default " : "Par défaut ") + f.default + (f.unit ? " " + unitOf(f, f.default) : "") +
            (f.min != null && f.max != null ? (_.english() ? ", between " : ", entre ") + f.min + (_.english() ? " and " : " et ") + f.max : "") + "." }) : null]),
          h("div", { class: "inp" }, [input, unit])]);
      })));
    });
    if (holder) { holder.textContent = ""; out.forEach(function (x) { holder.append(x); }); }
    tell();
    return { edited: function () { return Object.assign({}, edited); }, wrong: wrong };
  }
  window.ds.switch = settingSwitch; window.ds.conn = conn; window.ds.conns = conns; window.ds.fields = fields;
})();
