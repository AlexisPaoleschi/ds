/* The date and period picker, taken from Bank's operations (ds.datePick): the quick periods, then the units it offers as
   tabs (a day, a month, a year, two dates), then a grid of days, months or years under a head that steps through them.
   ds.datePick(holder, {value, quick, modes, min, max, years, today, label, onPick, onDraw, opener}) draws it in holder.
     value: the period, {from, to} as "2026-11-09": one day twice, a month's or a year's first and last days, or any two
     days; none (or {}) for every date. quick: [{label, from, to}], the periods one tap away (« Ce mois-ci »); the one
     equal to value is lit. modes: among "day", "month", "year" and "range" (all four by default, in that order), as tabs
     when there are several. min, max: the first and last days that can be chosen, the others greyed. years: [first,
     last], the years offered (min's and max's by default, else ten years back and two ahead). today: the day taken as
     today (Paris's by default). label: the picker's name for screen readers. onPick({from, to, mode, quick, label}) on a
     choice: quick is the quick period taken (or equal to it), label the words for a title. onDraw(holder) after each
     drawing, for a page that marks it. opener: the button that opens it, in the period head's popover (period.css),
     closed again by a choice, Escape or a tap elsewhere; without one, the picker stays in the page (.is-inline).
   Two dates take two taps, the first day then the last (the same one twice for a single day); while the last is sought
   the days between follow the pointer. The arrows of the keyboard move through a grid, Page Up and Page Down by its head's
   step (with Shift, by a year), Home and End to a row's ends, Enter or Space take; Escape forgets a first day, then
   closes. Returns {open(), close(), toggle(), set(value), get(), step(dir), canStep(dir), label(), draw(), el}:
   step(±1) moves the period by its own length (a day, a month, a year, as many months or days as it spans) and tells
   onPick, for the arrows beside a period's title; canStep(dir) says whether there is a period that way (else hide its arrow).
   Without a picker: ds.datePick.of(mode, day) is the day, month or year that holds day; ds.datePick.step(value, dir)
   moves a period; ds.datePick.label(value) names it (« novembre 2026 », « 3 nov. → 9 nov. 2026 »); ds.datePick.kind(value)
   says "all", "day", "month", "year" or "range". The days are Paris's days, written "2026-11-09", whatever the device. */
(function () {
  "use strict";
  var _ = window.ds._, day = window.ds.day, find = _.find, el = _.el;
  var parisToday = day.today, at = day.at, addDays = day.add, fmt = day.format;
  var MODES = ["day", "month", "year", "range"], PAGE = 12;
  var WORDS = _.table({
    fr: { day: "Jour", month: "Mois", year: "Année", range: "Dates", all: "Toutes les dates", pick: "Choisir la période", modes: "Choisir par",
          prev: { day: "Mois précédent", month: "Année précédente", year: "Années précédentes" },
          next: { day: "Mois suivant", month: "Année suivante", year: "Années suivantes" },
          first: "Choisissez le premier jour, puis le dernier.", last: function (d) { return "Du " + d + " : choisissez le dernier jour."; },
          since: function (d) { return "depuis le " + d; }, until: function (d) { return "jusqu’au " + d; } },
    en: { day: "Day", month: "Month", year: "Year", range: "Dates", all: "All dates", pick: "Choose the period", modes: "Choose by",
          prev: { day: "Previous month", month: "Previous year", year: "Earlier years" },
          next: { day: "Next month", month: "Next year", year: "Later years" },
          first: "Pick the first day, then the last.", last: function (d) { return "From " + d + ": pick the last day."; },
          since: function (d) { return "since " + d; }, until: function (d) { return "until " + d; } }
  });
  function words() { return _.words(WORDS); }
  function btn(cls, text, dp) {
    var b = el("button", cls, text);
    b.type = "button";
    if (dp) b.setAttribute("data-dp", dp);
    return b;
  }

  // the days are Paris's days, counted at noon UTC so that no clock change moves them (ds.day)
  function pad(n) { return String(n).padStart(2, "0"); }
  function daysBetween(a, b) { return Math.round((at(b) - at(a)) / 864e5); }
  function monthLen(ym) { return new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate(); }
  function monthIndex(ym) { return +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1; }
  function addMonths(ym, n) { var m = monthIndex(ym) + n; return Math.floor(m / 12) + "-" + pad(m % 12 + 1); }
  function date(t, style) { return window.ds.date(t, style); }
  function dayText(key, year) { return date(key, year ? { day: "numeric", month: "short", year: "numeric" } : "day"); }

  // the period of a unit that holds a day: the day itself, its month, its year
  function of(mode, key) {
    if (mode === "month") { var ym = key.slice(0, 7); return { from: ym + "-01", to: ym + "-" + pad(monthLen(ym)), mode: "month" }; }
    if (mode === "year") return { from: key.slice(0, 4) + "-01-01", to: key.slice(0, 4) + "-12-31", mode: "year" };
    return { from: key, to: key, mode: "day" };
  }
  function wholeMonths(v) { return !!(v.from && v.to) && v.from.slice(8) === "01" && v.to === of("month", v.to).to; }
  function kind(v) {
    if (!v || (!v.from && !v.to)) return "all";
    if (!v.from || !v.to) return "range";
    if (MODES.indexOf(v.mode) >= 0) return v.mode;
    if (v.from === v.to) return "day";
    if (v.from.slice(5) === "01-01" && v.to === v.from.slice(0, 4) + "-12-31") return "year";
    if (wholeMonths(v) && v.from.slice(0, 7) === v.to.slice(0, 7)) return "month";
    return "range";
  }
  function norm(v) {
    var f = (v && v.from) || null, t = (v && v.to) || null;
    if (f && t && t < f) { var x = f; f = t; t = x; }
    return { from: f, to: t, mode: kind({ from: f, to: t, mode: v && v.mode }) };
  }
  // a period moved by its own length: a day, a month, a year; a span of whole months by as many months (a quarter by a
  // quarter), any other span by as many days. Every date, or a span open at one end, does not move
  function step(v, dir) {
    v = norm(v);
    if (!v.from || !v.to) return null;
    if (!dir) return v;
    if (v.mode === "day") return of("day", addDays(v.from, dir));
    if (v.mode === "month") return of("month", addMonths(v.from.slice(0, 7), dir) + "-01");
    if (v.mode === "year") return of("year", (+v.from.slice(0, 4) + dir) + "-01-01");
    if (wholeMonths(v)) {
      var n = (monthIndex(v.to.slice(0, 7)) - monthIndex(v.from.slice(0, 7)) + 1) * dir;
      return { from: addMonths(v.from.slice(0, 7), n) + "-01", to: of("month", addMonths(v.to.slice(0, 7), n) + "-01").to, mode: "range" };
    }
    var d = (daysBetween(v.from, v.to) + 1) * dir;
    return { from: addDays(v.from, d), to: addDays(v.to, d), mode: "range" };
  }
  function label(v) {
    v = norm(v);
    var w = words();
    if (v.mode === "all") return w.all;
    if (!v.to) return w.since(dayText(v.from, true));
    if (!v.from) return w.until(dayText(v.to, true));
    // two taps on the same day are that day
    if (v.mode === "day" || v.from === v.to) return date(v.from, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (v.mode === "month") return date(v.from.slice(0, 7), "month");
    if (v.mode === "year") return v.from.slice(0, 4);
    var same = v.from.slice(0, 4) === v.to.slice(0, 4);
    // whole months are named by their months: « septembre → novembre 2026 »
    if (wholeMonths(v)) return (same ? date(v.from, { month: "long" }) : date(v.from.slice(0, 7), "month")) + " → " + date(v.to.slice(0, 7), "month");
    return dayText(v.from, !same) + " → " + dayText(v.to, true);
  }

  var made = 0;
  function datePick(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    o = o || {};
    var id = "ds-datepick-" + (++made), opener = find(o.opener), quick = o.quick || [];
    var modes = (o.modes || MODES).filter(function (m) { return MODES.indexOf(m) >= 0; });
    if (!modes.length) modes = MODES.slice();
    function today() { return o.today || parisToday(); }
    var ty = +today().slice(0, 4), years = o.years || [o.min ? +o.min.slice(0, 4) : ty - 10, o.max ? +o.max.slice(0, 4) : ty + 2];
    // the first and last days that can be chosen: min and max, within the years offered
    var lo = years[0] + "-01-01", hi = years[1] + "-12-31";
    if (o.min && o.min > lo) lo = o.min;
    if (o.max && o.max < hi) hi = o.max;
    var st = { value: norm(o.value), mode: null, view: null, focus: null, anchor: null, hover: null };
    var p = { el: holder };

    holder.classList.add("periodpop", "datepick");
    holder.classList.toggle("is-inline", !opener);
    if (!holder.id) holder.id = id;
    holder.setAttribute("role", opener ? "dialog" : "group");
    holder.setAttribute("aria-label", o.label || words().pick);

    function clampDay(k) { return k < lo ? lo : k > hi ? hi : k; }
    // what a grid's cells are: days for a day or two dates, else months or years
    function unit() { return st.mode === "range" ? "day" : st.mode; }
    function unitKey(u, day) { return u === "day" ? day : u === "month" ? day.slice(0, 7) : day.slice(0, 4); }
    function span(u, k) { return u === "day" ? { from: k, to: k } : of(u, u === "month" ? k + "-01" : k + "-01-01"); }
    function enabled(u, k) { var s = span(u, k); return s.to >= lo && s.from <= hi; }
    function clampUnit(u, k) { var a = unitKey(u, lo), b = unitKey(u, hi); return k < a ? a : k > b ? b : k; }
    // the period shown again when the picker opens or is set: its own unit when offered, else the months
    function reset() {
      var v = st.value;
      st.mode = modes.indexOf(v.mode) >= 0 ? v.mode : modes.indexOf("month") >= 0 ? "month" : modes[0];
      st.view = clampDay(v.mode === "range" ? v.to || v.from : v.from || today());
      st.focus = null; st.anchor = null; st.hover = null;
    }
    function matchQuick() {
      var v = st.value;
      return quick.filter(function (q) { return (q.from || null) === v.from && (q.to || null) === v.to; })[0] || null;
    }
    // a title's words: a quick period's own name for a span or every date (« 3 derniers mois »), else the period's
    p.label = function () {
      var q = matchQuick();
      return q && (st.value.mode === "range" || st.value.mode === "all") ? q.label : label(st.value);
    };
    p.get = function () { return { from: st.value.from, to: st.value.to, mode: st.value.mode }; };

    // the cells of the grid shown: the view's month of days, its year of months, or its page of twelve years
    function yearPage() {
      var y1 = +hi.slice(0, 4), y0 = +lo.slice(0, 4), vy = +st.view.slice(0, 4);
      var end = y1 - PAGE * Math.floor((y1 - vy) / PAGE);
      return { from: Math.max(y0, end - PAGE + 1), to: end };
    }
    function cells() {
      var u = unit(), out = [], i;
      if (u === "day") { var ym = st.view.slice(0, 7), n = monthLen(ym); for (i = 1; i <= n; i++) out.push(ym + "-" + pad(i)); }
      else if (u === "month") { for (i = 1; i <= 12; i++) out.push(st.view.slice(0, 4) + "-" + pad(i)); }
      else { var pg = yearPage(); for (i = pg.from; i <= pg.to; i++) out.push(String(i)); }
      return out;
    }
    function chosen(u, k) {
      var v = st.value;
      if (st.mode === "range") return st.anchor ? k === st.anchor : !!(v.from && v.to) && (k === v.from || k === v.to);
      return v.mode === st.mode && unitKey(u, v.from) === k;
    }
    // the days between two dates: those of the period, or while the last day is sought, those up to the pointer
    function between(k) {
      if (st.mode !== "range") return false;
      var a = st.anchor ? st.anchor : st.value.from, b = st.anchor ? st.hover : st.value.to;
      if (!a || !b) return false;
      if (b < a) { var x = a; a = b; b = x; }
      return k > a && k < b;
    }
    function defaultFocus(list) {
      var u = unit(), ok = list.filter(function (k) { return enabled(u, k); });
      var sel = ok.filter(function (k) { return chosen(u, k); })[0], t = unitKey(u, today());
      return sel || (ok.indexOf(t) >= 0 ? t : ok[0] || null);
    }
    function pageAt(d) {
      var u = unit(), y = +st.view.slice(0, 4);
      if (u === "day") return clampDay(addMonths(st.view.slice(0, 7), d) + "-01");
      if (u === "month") return clampDay((y + d) + "-" + st.view.slice(5, 7) + "-01");
      return clampDay((y + PAGE * d) + "-01-01");
    }
    function canPage(d) {
      var u = unit();
      if (u === "day") { var ym = addMonths(st.view.slice(0, 7), d); return enabled("month", ym); }
      if (u === "month") return enabled("year", String(+st.view.slice(0, 4) + d));
      var pg = yearPage();
      return d < 0 ? pg.from > +lo.slice(0, 4) : pg.to < +hi.slice(0, 4);
    }
    function page(d) {
      if (!canPage(d)) return;
      st.view = pageAt(d);
      st.focus = null;
      draw(d < 0 ? "prev" : "next");
    }
    function headText() {
      var u = unit();
      if (u === "day") return date(st.view.slice(0, 7), "month");
      if (u === "month") return st.view.slice(0, 4);
      var pg = yearPage();
      return pg.from === pg.to ? String(pg.from) : pg.from + " – " + pg.to;
    }

    function setMode(m) {
      if (st.mode === m) return;
      st.mode = m; st.focus = null; st.anchor = null; st.hover = null;
      draw("t-" + m);
    }
    function choose(k) {
      var u = unit();
      if (st.mode !== "range") return pick(of(st.mode, u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01"));
      // two dates: the first tap keeps a day, the second closes the span (in either order)
      if (!st.anchor) { st.anchor = k; st.hover = k; st.focus = k; return draw("c:" + k); }
      var a = st.anchor < k ? st.anchor : k, b = st.anchor < k ? k : st.anchor;
      pick({ from: a, to: b, mode: "range" });
    }
    function pick(v, q) {
      st.value = norm(v);
      st.anchor = null; st.hover = null;
      var out = p.get(), inside = holder.contains(document.activeElement);
      out.quick = q || matchQuick();
      out.label = p.label();
      if (opener && !holder.hidden) { p.close(); if (inside) opener.focus(); } else { reset(); draw(inside ? "cell" : null); }
      if (o.onPick) o.onPick(out);
      return out;
    }

    function quickRow() {
      var box = el("div", "dp-quick"), lit = matchQuick();
      quick.forEach(function (q, i) {
        var b = btn(q === lit ? "on" : "", q.label, "q" + i);
        b.setAttribute("aria-pressed", q === lit ? "true" : "false");
        b.addEventListener("click", function () { pick({ from: q.from, to: q.to }, q); });
        box.append(b);
      });
      return box;
    }
    function tabRow() {
      var w = words(), box = el("div", "tabs dp-tabs");
      box.setAttribute("role", "tablist");
      box.setAttribute("aria-label", w.modes);
      box.style.setProperty("--dp-tabs", String(modes.length));
      modes.forEach(function (m) {
        var on = m === st.mode, b = btn(on ? "on" : "", w[m], "t-" + m);
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("aria-controls", id + "-grid");
        b.tabIndex = on ? 0 : -1;
        b.addEventListener("click", function () { setMode(m); });
        box.append(b);
      });
      return box;
    }
    function headRow() {
      var w = words(), u = unit(), h = el("div", "dp-head"), prev = btn("dp-step", window.ds.ico("chevron-left"), "prev"), next = btn("dp-step", window.ds.ico("chevron-right"), "next"), mid;
      prev.setAttribute("aria-label", w.prev[u]);
      next.setAttribute("aria-label", w.next[u]);
      prev.disabled = !canPage(-1);
      next.disabled = !canPage(1);
      prev.addEventListener("click", function () { page(-1); });
      next.addEventListener("click", function () { page(1); });
      // the month, the year or the years, written between the arrows, as Bank had it: the arrows go a step at a time
      mid = el("span", "dp-title", headText());
      h.append(prev, mid, next);
      return h;
    }
    function cell(u, k, focusKey) {
      var t = unitKey(u, today()), text = u === "day" ? String(+k.slice(8)) : u === "month" ? fmt(k + "-15", { month: "short" }) : k;
      var on = chosen(u, k), b = btn((on ? "on" : "") + (between(k) ? " is-in" : "") + (k === t ? " is-today" : ""), text, "c:" + k);
      b.dataset.key = k;
      b.tabIndex = k === focusKey ? 0 : -1;
      b.disabled = !enabled(u, k);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", u === "day" ? date(k, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : u === "month" ? date(k, "month") : k);
      if (k === t) b.setAttribute("aria-current", "date");
      b.addEventListener("click", function () { choose(k); });
      return b;
    }
    function gridBox() {
      var u = unit(), list = cells(), g = el("div", "dp-grid is-" + u + "s");
      g.id = id + "-grid";
      g.setAttribute("role", "group");
      g.setAttribute("aria-label", headText());
      var focusKey = st.focus && list.indexOf(st.focus) >= 0 && enabled(u, st.focus) ? st.focus : defaultFocus(list);
      st.focus = focusKey;
      if (u === "day") {
        // the days of the week from Monday, then as many blanks as the month's first day is late
        for (var i = 0; i < 7; i++) {
          var wd = el("span", "dp-wd", fmt(addDays("2026-11-09", i), { weekday: "narrow" }));
          wd.setAttribute("aria-hidden", "true");
          g.append(wd);
        }
        for (var j = (at(list[0]).getUTCDay() + 6) % 7; j > 0; j--) g.append(el("span"));
      }
      list.forEach(function (k) { g.append(cell(u, k, focusKey)); });
      return g;
    }
    function draw(focus) {
      var act = document.activeElement, had = act && holder.contains(act) && act.getAttribute ? act.getAttribute("data-dp") : null;
      if (!st.mode) reset();
      var kids = [];
      if (quick.length) kids.push(quickRow());
      if (modes.length > 1) kids.push(tabRow());
      kids.push(headRow(), gridBox());
      if (st.mode === "range") kids.push(el("p", "dp-hint", st.anchor ? words().last(dayText(st.anchor)) : words().first));
      holder.replaceChildren.apply(holder, kids);
      // the focus stays on what had it, or goes where the keys sent it
      var want = focus || had, t = want === "cell" ? holder.querySelector('.dp-grid [tabindex="0"]') : want ? holder.querySelector('[data-dp="' + want + '"]') : null;
      if (t && !t.disabled && !holder.hidden) t.focus({ preventScroll: true });
      if (o.onDraw) o.onDraw(holder);
      return p;
    }
    // while the last day is sought, the days between follow the pointer, without drawing the grid again
    function paint() {
      [].forEach.call(holder.querySelectorAll(".dp-grid.is-days button"), function (b) { b.classList.toggle("is-in", between(b.dataset.key)); });
    }

    // the keys: in a grid, the arrows, Home and End, Page Up and Page Down; between the tabs, the arrows
    function moved(u, k, e) {
      var key = e.key, d;
      if (u === "day") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[key];
        if (d) return addDays(k, d);
        if (key === "Home") return addDays(k, -((at(k).getUTCDay() + 6) % 7));
        if (key === "End") return addDays(k, 6 - (at(k).getUTCDay() + 6) % 7);
        if (key === "PageUp" || key === "PageDown") {
          var ym = addMonths(k.slice(0, 7), (key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1));
          return ym + "-" + pad(Math.min(+k.slice(8), monthLen(ym)));
        }
        return null;
      }
      if (u === "month") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -12, PageDown: 12 }[key];
        if (d) return addMonths(k, d);
        if (key === "Home" || key === "End") return k.slice(0, 4) + (key === "Home" ? "-01" : "-12");
        return null;
      }
      d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -PAGE, PageDown: PAGE }[key];
      if (d) return String(+k + d);
      if (key === "Home" || key === "End") { var pg = yearPage(); return String(key === "Home" ? pg.from : pg.to); }
      return null;
    }
    holder.addEventListener("keydown", function (e) {
      if (e.defaultPrevented) return;
      if (e.key === "Escape") {
        // first the day kept for two dates; then the popover, the top layer, closes (inline, Escape goes on to what holds it)
        if (st.anchor) { e.preventDefault(); st.anchor = null; st.hover = null; draw(); }
        return;
      }
      var dp = e.target.getAttribute && e.target.getAttribute("data-dp");
      if (!dp) return;
      if (dp.slice(0, 2) === "t-" && /^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        var i = modes.indexOf(dp.slice(2)), n = modes.length;
        e.preventDefault();
        setMode(modes[e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowLeft" ? -1 : 1) + n) % n]);
        return;
      }
      if (dp.slice(0, 2) !== "c:" || e.altKey || e.ctrlKey || e.metaKey) return;
      var u = unit(), k = moved(u, dp.slice(2), e);
      if (k == null) return;
      e.preventDefault();
      k = clampUnit(u, k);
      st.focus = k;
      st.view = clampDay(u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01");
      if (st.anchor) st.hover = k;
      draw("c:" + k);
    });
    holder.addEventListener("pointerover", function (e) {
      var c = st.anchor && e.target.closest ? e.target.closest(".dp-grid.is-days button") : null;
      if (!c || c.disabled || c.dataset.key === st.hover) return;
      st.hover = c.dataset.key;
      paint();
    });

    // opened under its button, a layer: Escape closes it and gives the focus back to the button; Tab is free
    var cover = { el: holder, trap: false, close: function () { var inside = holder.contains(document.activeElement); p.close(); if (inside || document.activeElement === document.body) opener.focus(); } };
    p.open = function () {
      reset();
      holder.hidden = false;
      if (opener) { opener.setAttribute("aria-expanded", "true"); _.layer(cover); }
      return draw("cell");
    };
    p.close = function () {
      holder.hidden = true;
      st.anchor = null; st.hover = null;
      _.unlayer(cover);
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (v) { st.value = norm(v); reset(); return draw(); };
    p.draw = function () { return draw(); };
    function within(v) { return !!v && (!v.to || v.to >= lo) && (!v.from || v.from <= hi); }
    p.canStep = function (dir) { return within(step(st.value, dir)); };
    p.step = function (dir) { var v = step(st.value, dir); return within(v) ? pick(v) : null; };

    if (opener) {
      opener.setAttribute("aria-haspopup", "dialog");
      opener.setAttribute("aria-controls", holder.id);
      opener.addEventListener("click", p.toggle);
      // pressed, not clicked: a tap inside that draws the picker again must not look like a tap elsewhere
      document.addEventListener("pointerdown", function (e) {
        if (!holder.hidden && !holder.contains(e.target) && !opener.contains(e.target)) p.close();
      });
      holder.hidden = true;
      opener.setAttribute("aria-expanded", "false");
    }
    reset();
    return draw();
  }
  datePick.of = of;
  datePick.step = step;
  datePick.label = label;
  datePick.kind = kind;
  datePick.today = parisToday;
  window.ds = window.ds || {};
  window.ds.datePick = datePick;
})();
