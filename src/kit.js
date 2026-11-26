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
