/* Calendar, taken from Studio's agenda: ds.calendar(holder, opts) draws the period head (the month's name, which opens a
   month picker, ds.datePick on months; the views; ‹ Aujourd’hui ›) and under it one of three views: a month of day
   cells, with the panel of the selected day below; a week of columns; a list of days, each in its panel.
   opts: view ("month", "week" or "list"), day (the selected day, "2026-11-09": today by default), items(key) (the day's
   items, in the order they are shown), panel(key, items) (what the day's panel holds under its title: one or more nodes;
   by default one row per item), row(item, key) (a row of a week's column or of the default panel), body (where the view
   goes: holder by default, after the head; a page may put it beside its filters), lines (lines in a cell, 8 by default),
   years ([first, last] in the picker), today (the day taken as today, for a page's checks), onChange(state),
   ready(state) (false while the page has yet to read the days asked for: the calendar keeps showing what it showed,
   with what the page now holds, and moves once a later draw() finds them ready; without it, it moves at once).
   An item: {title, color ("--c-bleu": its mark), mark ("square", "dot", "bar" or "thick"), open (an empty mark: not done
   yet), codes ([{text, color, title}] or "IG": small coloured labels), count ("2/4": a group, one title on several codes,
   which gives its title first and its codes last, the ones a narrow cell drops), time ("10h00": in a cell for a bar
   only), place, href, done (greyed), late (in red; lateText adds a red badge to its row), note (said on hover),
   span ({from, to}, its first and last days: what runs over several days, given on each of them)}.
   In the month, what runs over several days is one bar in its colour across them, at the same height in every cell it
   crosses, its title on its first day and on each Monday it goes on to, as Google's agenda draws a stay or a trip.
   On a phone, a cell shows a dot per item, three at most, then « +N ».
   Returns {draw(), set({view, day}), go(step), today(), state()}: state() is {view, day, from, to}, the days shown
   (to excluded), what a page reads to load them; onChange receives it after each move, then the page calls draw()
   once it has what those days hold. ds.calendar.row(item) and ds.calendar.mark(item) build a default row and a mark,
   for a page that fills the panels itself. */
(function () {
  "use strict";
  var DOTS = 3, VIEWS = ["month", "week", "list"];
  var _ = window.ds._, day = window.ds.day, el = _.el, tone = _.tone;
  var parisToday = day.today, at = day.at, addDays = day.add, weekStart = day.weekStart, fmt = day.format;
  var WORDS = _.table({
    fr: { month: "Mois", week: "Semaine", list: "Liste", prev: "Précédent", next: "Suivant", today: "Aujourd’hui", pick: "Aller à un autre mois",
          view: "Vue", before: "Jours précédents", hideBefore: "Masquer les jours précédents", none: "Rien ce jour-là.",
          count: function (n) { return n + (n > 1 ? " éléments" : " élément"); } },
    en: { month: "Month", week: "Week", list: "List", prev: "Previous", next: "Next", today: "Today", pick: "Go to another month",
          view: "View", before: "Days before", hideBefore: "Hide the days before", none: "Nothing on that day.",
          count: function (n) { return n + (n > 1 ? " items" : " item"); } }
  });
  function words() { return _.words(WORDS); }
  function longDay(key) { return window.ds.date(key, "weekday"); }
  function shortDay(key) { return window.ds.date(key, "day"); }

  function mark(it) {
    var m = el("i", "cal-mark" + (it.mark && it.mark !== "square" ? " is-" + it.mark : "") + (it.open ? " is-open" : ""));
    m.setAttribute("aria-hidden", "true");
    if (it.color) m.style.setProperty("--n", tone(it.color));
    return m;
  }
  function codes(it) {
    var list = it.codes == null ? [] : [].concat(it.codes);
    return list.map(function (c) {
      if (typeof c === "string") c = { text: c, color: it.color };
      var s = el("span", "cal-code", c.text);
      if (c.color) s.style.setProperty("--n", tone(c.color));
      if (c.title) s.title = c.title;
      return s;
    });
  }
  function isBar(it) { return it.mark === "bar" || it.mark === "thick"; }
  // a cell's line: its mark, its codes, its title, its count; on a phone the mark alone, for the first three
  function line(it, i) {
    var ln = el("span", "cal-line" + (isBar(it) ? " is-bar" : "") + (it.done ? " is-done" : "") + (it.late ? " is-late" : "") + (i >= DOTS ? " is-extra" : ""));
    ln.title = it.note || it.title || "";
    ln.append(mark(it));
    // a group's codes come after its title and its count: in a narrow cell they would otherwise hide the title
    if (!it.count) codes(it).forEach(function (c) { ln.append(c); });
    // a cell is narrow: only what happens at an hour (a bar) gives it there; the rows say every time
    ln.append(el("span", "cal-lt", (it.time && isBar(it) ? it.time + " " : "") + (it.title || "")));
    if (it.count) {
      ln.append(el("span", "cal-count", it.count));
      codes(it).forEach(function (c) { ln.append(c); });
    }
    return ln;
  }
  // a row of a day: its time, its mark and codes, its title (a link when it has one), its place
  function defaultRow(it) {
    var li = el("li", it.done ? "is-done" : "");
    li.append(el("span", "t", it.time || "—"), mark(it));
    codes(it).forEach(function (c) { li.append(c); });
    var t = el(it.href ? "a" : "span", "ttl", it.title || "");
    if (it.href) { t.href = it.href; t.target = "_blank"; t.rel = "noopener"; }
    li.append(t);
    if (it.place) li.append(el("span", "pl", it.place));
    if (it.late && it.lateText) li.append(el("span", "late", it.lateText));
    return li;
  }

  // the runs of a week: what runs over several days and crosses it, each in a lane, the same in every cell it crosses
  function runsOf(keys, itemsOf) {
    var runs = {}, order = [];
    keys.forEach(function (key, i) {
      itemsOf(key).forEach(function (it) {
        var s = it.span;
        if (!s || !s.from || !s.to || s.to <= s.from) return;
        var id = s.id || (it.title || "") + "|" + s.from + "|" + s.to;
        if (!runs[id]) { runs[id] = { id: id, it: it, a: i, b: i }; order.push(runs[id]); } else runs[id].b = i;
      });
    });
    // the longest first among those starting the same day; each takes the first lane free over its days
    order.sort(function (x, y) { return x.a - y.a || (y.b - y.a) - (x.b - x.a); });
    var lanes = [];
    order.forEach(function (r) {
      var l = 0;
      while (lanes[l] && lanes[l].some(function (o) { return o.a <= r.b && o.b >= r.a; })) l++;
      (lanes[l] = lanes[l] || []).push(r);
      r.lane = l;
    });
    return { keys: keys, order: order };
  }
  function runId(it) { return it.span ? it.span.id || (it.title || "") + "|" + it.span.from + "|" + it.span.to : null; }
  // a run's piece in a cell: its title where it starts, and on the first day of each week it goes on to
  function runLine(r, key, i) {
    var it = r.it, first = key === it.span.from || i === 0, last = key === it.span.to || i === 6;
    var ln = el("span", "cal-line is-run" + (first ? " is-first" : "") + (last ? " is-last" : "") + (it.done ? " is-done" : ""));
    ln.title = it.note || it.title || "";
    if (it.color) ln.style.setProperty("--n", tone(it.color));
    if (first) {
      // how many of this week's days it still crosses, for its title to run over them
      ln.style.setProperty("--run", String(r.b - i + 1));
      ln.append(el("span", "cal-lt", it.title || ""));
    }
    return ln;
  }

  function calendar(holder, opts) {
    opts = opts || {};
    var st = { view: VIEWS.indexOf(opts.view) >= 0 ? opts.view : "month", day: opts.day || null, before: false };
    var lines = opts.lines || 8;
    function today() { return opts.today || parisToday(); }
    if (!st.day) st.day = today();
    function itemsOf(key) { var x = opts.items ? opts.items(key) : null; return Array.isArray(x) ? x : []; }
    function rowOf(it, key) { var r = opts.row ? opts.row(it, key) : null; return r || defaultRow(it); }

    // the head, made once: a redraw keeps the focus on the button just used
    var w = words(), root = el("div", "cal"), head = el("div", "periodhead cal-head"), left = el("div", "periodleft");
    var title = el("button", "periodtitle"), h3 = el("h3"), pop = el("div", "cal-jump");
    title.type = "button";
    title.title = w.pick;
    title.append(h3, el("span", "caret", "▾"));
    var first = +today().slice(0, 4) - 10, last = +today().slice(0, 4) + 2;
    if (opts.years) { first = opts.years[0]; last = opts.years[1]; }
    left.append(title, pop);
    // the month picker is the design system's date picker on months alone: the year's menu between its arrows, then the
    // twelve months, which keep the name the calendar gave them (.cal-months); a month leads there, Escape or a tap
    // elsewhere closes it
    var jump = window.ds.datePick(pop, { modes: ["month"], value: window.ds.datePick.of("month", st.day), years: [first, last], today: opts.today, label: w.pick,
      opener: title, onPick: function (v) { move(v.from); },
      onDraw: function (box) { var g = box.querySelector(".dp-grid"); if (g) g.classList.add("cal-months"); } });
    var nav = el("div", "periodnav cal-nav"), tabs = el("div", "tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", w.view);
    VIEWS.forEach(function (v) {
      var b = el("button", "", w[v]);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.dataset.view = v;
      b.addEventListener("click", function () { if (st.view !== v) { st.view = v; changed(); } });
      tabs.append(b);
    });
    var prev = el("button", "btn is-icon", "‹"), now = el("button", "btn", w.today), next = el("button", "btn is-icon", "›");
    [prev, now, next].forEach(function (b) { b.type = "button"; });
    prev.setAttribute("aria-label", w.prev);
    next.setAttribute("aria-label", w.next);
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    now.addEventListener("click", goToday);
    // the arrows and « Aujourd’hui » stay together when a narrow row sends them under the views
    var arrows = el("span", "cal-arrows");
    arrows.append(prev, now, next);
    nav.append(tabs, arrows);
    head.append(left, nav);
    var body = opts.body || el("div");
    body.classList.add("cal-body");
    root.append(head);
    if (!opts.body) root.append(body);
    holder.replaceChildren(root);

    function state() {
      var from, to;
      if (st.view === "month") { from = weekStart(st.day.slice(0, 8) + "01"); to = addDays(from, 42); }
      else if (st.view === "week") { from = weekStart(st.day); to = addDays(from, 7); }
      else { from = addDays(st.day, st.before ? -7 : 0); to = addDays(st.day, 8); }
      return { view: st.view, day: st.day, from: from, to: to };
    }
    function changed() {
      draw();
      if (opts.onChange) opts.onChange(state());
    }
    function move(key) { st.day = key; changed(); }
    // a step: a month in the month view (to its first day), a week otherwise
    function go(step) {
      if (st.view === "month") {
        var y = +st.day.slice(0, 4), mo = +st.day.slice(5, 7) - 1 + step;
        y += Math.floor(mo / 12);
        mo = ((mo % 12) + 12) % 12;
        move(y + "-" + String(mo + 1).padStart(2, "0") + "-01");
      } else move(addDays(st.day, 7 * step));
    }
    function goToday() { move(today()); }

    function titleText() {
      if (st.view === "month") return [fmt(st.day, { month: "long" }), el("span", "yr", " " + st.day.slice(0, 4))];
      var a = st.view === "week" ? weekStart(st.day) : st.day;
      return [shortDay(a) + " – " + shortDay(addDays(a, st.view === "week" ? 6 : 7))];
    }
    function panel(key) {
      var items = itemsOf(key), sec = el("section", "cal-day" + (key === today() ? " is-today" : ""));
      sec.dataset.day = key;
      sec.append(el("h2", "cal-day-t", longDay(key)));
      var inside = opts.panel ? opts.panel(key, items) : null;
      if (inside == null) {
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); inside = ul; }
        else inside = el("p", "empty", words().none);
      }
      [].concat(inside).forEach(function (n) { if (n) sec.append(n); });
      return sec;
    }
    function cell(key, inMonth, week) {
      var items = itemsOf(key), t = today(), b = el("button", "cal-cell" + (inMonth ? "" : " is-off") + (key === t ? " is-today" : "") + (key === st.day ? " is-sel" : ""));
      b.type = "button";
      b.dataset.day = key;
      b.setAttribute("aria-pressed", key === st.day ? "true" : "false");
      // what the cell holds is told in the panel it opens: the cell says its day and how much is on it
      b.setAttribute("aria-label", longDay(key) + (items.length ? ", " + words().count(items.length) : ""));
      if (key === t) b.setAttribute("aria-current", "date");
      b.append(el("span", "cal-n", String(+key.slice(8))));
      // the runs first, each in its lane (an empty line where a lane is free that day), then the day's own items
      var i = week ? week.keys.indexOf(key) : -1, here = week ? week.order.filter(function (r) { return r.a <= i && r.b >= i; }) : [];
      var deepest = here.reduce(function (m, r) { return Math.max(m, r.lane); }, -1);
      for (var l = 0; l <= deepest; l++) {
        var r = here.filter(function (x) { return x.lane === l; })[0];
        b.append(r ? runLine(r, key, i) : el("span", "cal-line is-gap"));
      }
      var ids = here.map(function (r) { return r.id; });
      var own = items.filter(function (it) { return ids.indexOf(runId(it)) < 0; });
      var room = Math.max(0, lines - (deepest + 1));
      own.slice(0, room).forEach(function (it, n) { b.append(line(it, n)); });
      if (own.length > room) b.append(el("span", "cal-more", "+" + (own.length - room)));
      if (own.length > DOTS) b.append(el("span", "cal-more-dots", "+" + (own.length - DOTS)));
      b.addEventListener("click", function () {
        st.day = key;
        changed();
        var again = body.querySelector('.cal-cell[data-day="' + key + '"]');
        if (again) again.focus({ preventScroll: true });
      });
      return b;
    }
    function month() {
      var dow = el("div", "cal-dow"), grid = el("div", "cal-grid"), start = weekStart(st.day.slice(0, 8) + "01"), mo = st.day.slice(0, 7);
      for (var i = 0; i < 7; i++) dow.append(el("span", "", fmt(addDays(start, i), { weekday: "short" }).replace(".", "")));
      var week = null;
      for (var j = 0; j < 42; j++) {
        var key = addDays(start, j);
        // five weeks are enough for most months: a sixth row only when the month reaches it, and then a whole week,
        // its last days those of the next month, as on the rows above
        if (j === 35 && key.slice(0, 7) !== mo) break;
        if (j % 7 === 0) week = runsOf([0, 1, 2, 3, 4, 5, 6].map(function (n) { return addDays(key, n); }), itemsOf);
        grid.append(cell(key, key.slice(0, 7) === mo, week));
      }
      return [dow, grid, panel(st.day)];
    }
    function week() {
      var ws = weekStart(st.day), t = today(), out = el("div", "cal-week");
      for (var i = 0; i < 7; i++) {
        var key = addDays(ws, i), items = itemsOf(key), col = el("div", "cal-wcol" + (key === t ? " is-today" : "")), h = el("h3", "", fmt(key, { weekday: "long" }));
        col.dataset.day = key;
        h.append(el("span", "cal-wdate", shortDay(key)));
        col.append(h);
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); col.append(ul); }
        else col.append(el("p", "empty", "—"));
        out.append(col);
      }
      return [out];
    }
    // the list starts on the selected day and runs a week ahead; the week before stays folded above
    function list() {
      var w = words(), out = [], toggle = el("button", "cal-prev");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", st.before ? "true" : "false");
      toggle.append(el("span", "caret", st.before ? "▾" : "▸"), st.before ? w.hideBefore : w.before);
      toggle.addEventListener("click", function () {
        st.before = !st.before;
        changed();
        var again = body.querySelector(".cal-prev");
        if (again) again.focus({ preventScroll: true });
      });
      out.push(toggle);
      for (var i = st.before ? -7 : 0; i < 8; i++) out.push(panel(addDays(st.day, i)));
      return out;
    }
    // what is on screen; a page still reading the days asked for (ready) keeps it there, drawn again with what it holds
    var shown = null;
    function draw() {
      var want = st, hold = shown && opts.ready && !opts.ready(state());
      if (hold) st = shown;
      try { paint(); } finally {
        if (hold) st = want;
        else shown = { view: st.view, day: st.day, before: st.before };
      }
    }
    function paint() {
      h3.replaceChildren.apply(h3, titleText());
      [].forEach.call(tabs.children, function (b) { b.setAttribute("aria-selected", b.dataset.view === st.view ? "true" : "false"); });
      // the month picker follows the day while it is shut; open, it keeps what one is looking at
      if (pop.hidden) jump.set(window.ds.datePick.of("month", st.day));
      body.dataset.view = st.view;
      body.replaceChildren.apply(body, st.view === "month" ? month() : st.view === "week" ? week() : list());
    }
    function set(o) {
      o = o || {};
      if (VIEWS.indexOf(o.view) >= 0) st.view = o.view;
      if (o.day) st.day = o.day;
      draw();
    }
    draw();
    return { draw: draw, set: set, go: go, today: goToday, state: state, el: root };
  }

  // a day's default row, for a page that fills its panels itself (panel) and still wants the calendar's rows
  calendar.row = defaultRow;
  calendar.mark = mark;
  window.ds = window.ds || {};
  window.ds.calendar = calendar;
})();
