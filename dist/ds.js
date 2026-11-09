/* ds 2.39.0 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
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
/* Design system: the behaviour every app shares.
   ds.toast({type, text, action, duration}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close).
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
          ago: function (x) { return "il y a " + x; }, soon: "dans un instant", in: function (x) { return "dans " + x; } },
    en: { confirm: "Confirm",
          never: "never", today: "today", yesterday: "yesterday", tomorrow: "tomorrow", on: "on ", at: " at ", now: "just now",
          ago: function (x) { return x + " ago"; }, soon: "in a moment", in: function (x) { return "in " + x; } }
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
    // the same words again change the message already there instead of piling up
    for (var i = 0; i < live.length; i++) if (live[i].text === opts.text) return live[i].update(opts);
    var el = document.createElement("div"), t = { el: el, text: opts.text, life: 0, timer: null, gone: false };
    el.innerHTML = '<span class="mark" aria-hidden="true"></span><span class="txt"></span>' +
      '<button type="button" class="act" hidden></button><button type="button" class="x" aria-label="' + words().close + '">×</button>';
    el.querySelector(".x").onclick = function () { t.close(); };
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
      el.classList.add("out");
      // taken away once its fade is over, however long the theme makes it
      setTimeout(function () { el.remove(); }, lasts(el) + 20);
    };
    holder().appendChild(el);
    live.push(t);
    // three at most: the oldest goes
    while (live.length > 3) live[0].close();
    return t.update(opts);
  }
  // ds.confirm({title, text, ok, danger, value, placeholder, inputmode, autocomplete, maxlength}) asks in a window of the design
  // system and answers with a promise:
  // false when cancelled, true when confirmed, or the typed text when the window has a field (value).
  // A dangerous answer (danger) starts on « Annuler » (Cancel), so Enter never deletes by mistake.
  var dialogs = 0;
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var veil = document.createElement("div"), field = opts.value != null, n = ++dialogs;
      veil.className = "dialog-veil";
      veil.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-t-' + n + '"><h2 class="dialog-t" id="dialog-t-' + n + '"></h2>' +
        '<p class="dialog-x" id="dialog-x-' + n + '"></p>' + (field ? '<input class="dialog-in" type="text" aria-labelledby="dialog-t-' + n + '">' : "") +
        '<div class="dialog-b"><button type="button" class="btn dialog-no">' + words().cancel + '</button><button type="button" class="btn dialog-ok"></button></div></div>';
      var ok = veil.querySelector(".dialog-ok"), no = veil.querySelector(".dialog-no"), input = veil.querySelector(".dialog-in"), text = veil.querySelector(".dialog-x");
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
        if (e.key === "Enter" && input && document.activeElement === input) { e.preventDefault(); end(input.value); }
      }
      ok.onclick = function () { end(input ? input.value : true); };
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
    var parts = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
    var h = +parts.find(function (p) { return p.type === "hour"; }).value, m = parts.find(function (p) { return p.type === "minute"; }).value;
    return english() ? h + ":" + m : h + "h" + m;
  }
  function day(d) {
    var w = words(), k = dayKey(d), now = Date.now();
    if (k === dayKey(new Date(now))) return w.today;
    if (k === dayKey(new Date(now - 864e5))) return w.yesterday;
    if (k === dayKey(new Date(now + 864e5))) return w.tomorrow;
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
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
     "month" « novembre 2026 », "short" « 09/11/26 », "day" « 9 nov. », or Intl's own options; the first of a month is
     « 1er » in French. A day without its time ("2026-11-09", or a month "2026-11") stays that day wherever the device is. */
  var STYLES = { long: { day: "numeric", month: "long", year: "numeric" }, weekday: { weekday: "long", day: "numeric", month: "long" },
    month: { month: "long", year: "numeric" }, short: { day: "2-digit", month: "2-digit", year: "2-digit" }, day: { day: "numeric", month: "short" } };
  function dateText(t, style) {
    if (t == null || t === "") return "";
    var opts = Object.assign({}, typeof style === "object" ? style : STYLES[style || "long"]), d;
    var bare = typeof t === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(t);
    if (bare) { d = new Date(t.length === 7 ? t + "-15T12:00:00Z" : t + "T12:00:00Z"); opts.timeZone = "UTC"; }
    else { d = date(t); opts.timeZone = TZ; }
    if (isNaN(d.getTime())) return "—";
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", opts).format(d);
    return english() || opts.day !== "numeric" ? text : text.replace(/(^|\s)1 (?=\D)/, "$11er ");
  }

  /* ds.number(n, decimals) and ds.money(n, {currency, signed, decimals}): French figures, the thousands set apart by a
     space the fonts draw (French uses a narrow one that Archivo and IBM Plex Mono do not); money: « −1 234,56€ », « +12€ »
     with signed, « 12,00 USD » for another currency, « — » for no figure. */
  function number(n, decimals) {
    if (n == null || isNaN(n)) return "—";
    var k = decimals || 0;
    return new Intl.NumberFormat(english() ? "en-GB" : "fr-FR", { minimumFractionDigits: k, maximumFractionDigits: k })
      .format(n).replace(/[\u202f\u00a0]/g, "\u00a0");
  }
  function money(n, o) {
    if (n == null || isNaN(n)) return "—";
    o = o || {};
    var cur = o.currency || "EUR", k = o.decimals == null ? 2 : o.decimals;
    return (n < 0 ? "−" : o.signed && n > 0 ? "+" : "") + number(Math.abs(n), k) + (cur === "EUR" ? "€" : "\u00a0" + cur);
  }

  /* ds.api(method, url, body): the app's server, as JSON. Its header against forged requests is the one its <html> names,
     data-api="X-Bank" (sent as X-Bank: 1). An ended session goes back to /login; an error says the server's own words. */
  /* ds.api(method, url, body, {retry}): besides the header named by <html data-api>, a Spring page's CSRF token
     (<meta name="_csrf"> under the header of <meta name="_csrf_header">) goes with everything but a GET. A GET that meets
     the server restarting (502, 503, 504, or no answer at all) tries again every 3 s for a minute, as a deploy takes;
     {retry: false} says no. An ended session (401, or a request sent on to a sign-in page, as Spring does) goes to the
     sign-in page, the page's address kept to come back to it after. An error says the server's own words (detail, or
     error.message) and carries err.status and err.code (the server's code, e.g. "tool_error"). */
  var AFTER_LOGIN = "ds-after-login";
  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function signIn(to) {
    _.write(AFTER_LOGIN, location.pathname + location.search + location.hash, true);
    location.href = to;
  }
  function api(method, url, body, o) {
    o = o || {};
    var root = document.documentElement, name = root.getAttribute("data-api"), headers = { Accept: "application/json" };
    if (name) headers[name] = "1";
    var csrf = document.querySelector('meta[name="_csrf"]'), csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    if (csrf && method !== "GET") headers[(csrfHeader && csrfHeader.content) || "X-CSRF-TOKEN"] = csrf.content;
    if (body) headers["Content-Type"] = "application/json";
    var left = method === "GET" && o.retry !== false ? 20 : 0;
    function once() {
      return fetch(url, { method: method, credentials: "same-origin", cache: "no-store", headers: headers, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) {
          if (left > 0 && r.status >= 502 && r.status <= 504) { left -= 1; return wait(3000).then(once); }
          if (r.status === 401 || (r.redirected && /\/(login|signin)\b/i.test(r.url))) {
            signIn(r.redirected ? r.url : root.getAttribute("data-login") || "/login");
            var gone = new Error("session"); gone.status = 401; gone.code = "session"; throw gone;
          }
          return r.json().catch(function () { return null; }).then(function (d) {
            if (!r.ok) {
              var e = new Error((d && (d.detail || (d.error && d.error.message))) || "erreur " + r.status);
              e.status = r.status;
              e.code = (d && ((d.error && d.error.code) || d.code)) || null;
              throw e;
            }
            return d;
          });
        }, function (e) {
          // no answer at all: the server is down a moment, or the network
          if (left > 0) { left -= 1; return wait(3000).then(once); }
          throw e;
        });
    }
    return once();
  }
  // back from the sign-in page, the page opens where it was left
  function cameBack() {
    var was = _.read(AFTER_LOGIN, true);
    _.write(AFTER_LOGIN, null, true);
    if (!was || location.hash) return;
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
    function f(x, d) { return new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(x).replace(/ /g, " "); }
    if (a < 10000) return number(n, 0);
    if (a < 100000) return f(n / 1000, 1) + "k";
    if (a < 1000000) return f(n / 1000, 0) + "k";
    return f(n / 1000000, a < 10000000 ? 1 : 0) + "M";
  }

  /* ds.avatar(name, src): a merchant's or a person's logo, its initial underneath while the image comes, or if it never does. */
  function avatar(name, src, cls) {
    var span = h("span", { class: "avatar" + (cls ? " " + cls : ""), "aria-hidden": "true" }, [String(name || "?").trim().charAt(0).toUpperCase() || "?"]);
    if (src) {
      var img = h("img", { src: src, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { img.remove(); });
      span.appendChild(img);
    }
    return span;
  }

  /* A card's title that holds something on its line (a menu, a period, a button, the hour it was read: its last element)
     keeps them on one line when it can: its letters come closer, then smaller (12px, then 11px, the least, with a menu's
     edges narrower), only as much as needed; past that, the title keeps its size and what it holds goes under it. On loading, when the window changes size, once the fonts have come,
     and whenever a page draws its cards again. */
  var FIT = ["ct-fit-1", "ct-fit-2", "ct-fit-3"];
  function fitTitle(h) {
    var held = h.lastElementChild;
    FIT.forEach(function (c) { h.classList.remove(c); });
    if (!held || held.matches("svg") || !h.offsetParent) return;
    var words = [].filter.call(h.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
    if (!words.length) return;
    var range = document.createRange();
    range.setStartBefore(words[0]);
    range.setEndAfter(words[words.length - 1]);
    // what it holds went under the words when it starts below their last line
    function under() { return held.getBoundingClientRect().top >= range.getBoundingClientRect().bottom - 2; }
    for (var i = 0; i < FIT.length && under(); i++) {
      if (i) h.classList.remove(FIT[i - 1]);
      h.classList.add(FIT[i]);
    }
    // not even at the least: the title keeps its size, and what it holds goes under it
    if (under()) FIT.forEach(function (c) { h.classList.remove(c); });
  }
  var fitting = 0;
  // a change that touches a title: inside one, or bringing one
  function titled(m) {
    var at = m.target.nodeType === 1 ? m.target : m.target.parentElement;
    if (at && at.closest && at.closest(".ct")) return true;
    return [].some.call(m.addedNodes, function (n) { return n.nodeType === 1 && (n.matches(".ct") || !!n.querySelector(".ct")); });
  }
  // a title whose width changes is fitted again: its view shown (it was not measured while hidden), its card resized
  var watched = new WeakSet(), widths = new WeakMap();
  var resized = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) {
      var w = Math.round(e.contentRect.width);
      if (widths.get(e.target) === w) return;
      widths.set(e.target, w);
      if (w) fitTitle(e.target);
    });
  }) : null;
  function fitTitles() {
    if (fitting) return;
    fitting = requestAnimationFrame(function () {
      fitting = 0;
      document.querySelectorAll(".ct").forEach(function (h) {
        if (resized && !watched.has(h)) { watched.add(h); resized.observe(h); }
        fitTitle(h);
      });
    });
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

  /* Whole rows that open: a row (tr.is-link, or any [data-row-link]) holding a link a.row-link, or a data-href, opens it on a
     click anywhere in it, but not on its own buttons, fields or links, not at the end of a text selection; Ctrl, ⌘ or the
     middle button open it in a new tab, as a link would. By delegation: rows drawn later work too. A row with neither link
     nor data-href is left to the page (Bank opens its sheet). On iPhone a stretched link does not cover a table row: hence this. */
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"]';
  function rowHref(e) {
    var row = e.target.closest && e.target.closest("tr.is-link, [data-row-link]");
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
  document.addEventListener("auxclick", function (e) {
    if (e.button !== 1) return;
    var r = rowHref(e);
    if (r && r.href) { e.preventDefault(); window.open(r.href, "_blank", "noopener"); }
  });

  /* ds.route(onRoute): the address after # as the page's state. « #analyse/patreon-alexis/derniers-membres?compte=hb » gives
     onRoute({parts: ["analyse", "patreon-alexis", "derniers-membres"], query: {compte: "hb"}}), at once and at every change
     (back, a link). ds.route.go(parts, query, {push}) writes it without the page jumping, replacing by default so that Back
     does not walk through every filter. ds.seek(anchor) brings [data-anchor="anchor"] into view, opens the foldable sections
     around it, and lights it a moment. Back from the sign-in page, the address left is found again (ds.api keeps it). */
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
    history[(o && o.push) ? "pushState" : "replaceState"](null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  route.read = parseRoute;
  function seek(anchor) {
    var el = null;
    try { el = document.querySelector('[data-anchor="' + (window.CSS && CSS.escape ? CSS.escape(anchor) : anchor) + '"]'); } catch (e) {}
    if (!el) return false;
    for (var d = el.parentElement; d; d = d.parentElement) if (d.tagName === "DETAILS") d.open = true;
    var still = _.reduced();
    el.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
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
    fold(); arrivals(); cameBack(); fitTitles();
    window.addEventListener("resize", fitTitles, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
    // a page that draws its cards again, or changes what a title holds: their titles are fitted once it is done; a
    // change anywhere else (a loading's share, a chart's bubble, a journal) measures nothing
    new MutationObserver(function (changes) {
      if (changes.some(titled)) fitTitles();
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
  window.ds.api = api;
  window.ds.compact = compact;
  window.ds.avatar = avatar;
  window.ds.fold = fold;
  window.ds.fitTitles = fitTitles;
  window.ds.route = route;
  window.ds.seek = seek;
})();
