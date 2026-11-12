/* Charts, taken from Studio's analysis. Each one draws into holder (its content replaced) and returns its element; with
   holder null it only returns it, for a page that builds its own tree. The colour of a series is a token, given as its
   name (color: "--c-bleu") and set as --n on the chart; the lines, labels and grounds come from the theme.
   ds.chart.line(holder, points, {color, formatDay, format, tall, area, ref, marks, hover, now, nowLabel}): a curve, its highest and lowest
     values on its right, its first and last days under it. points: [{x: "2026-11-09", v: 1240}]; formatDay(x) and format(v)
     write them (a short date and a figure by default). Tall, a chart of its own (a share's price): taller, its middle
     day under it too; area fills its ground; ref: {v, label} a dashed level with its name (a cost price); marks:
     [{x, label}] a dot on each day given (purchases), its label on hover; hover: the day and value under the pointer or
     the finger, with a cursor; now: the day that is today, when the curve goes on with what is foreseen: from it the
     curve is dashed and its ground paler, a thin rule stands on it, nowLabel over it (« aujourd’hui »).
   ds.chart.bars(holder, rows, {color, average, unit, short, value, onPick}): bars on a round scale (0, 500, 1 000…),
     the figure on each bar, a dashed line at the average. rows: [{key, label, value, parts: [{value, color}], live,
     title}]: parts stack their colours in the bar; live hatches a period still running; a "2026-11" key is named by its
     month. onPick(key) makes the bars buttons, value the one lit.
     Paired, with pairs: [{key, label, color}] (Bank's money in and out), each row carries one value per series under its
     key ({key: "2026-11", income: 3200, spending: 2104}): a bar per series side by side, their figures stacked over
     them on hover or when chosen, and a legend that adds each series up, written by format(v) (the figure and unit by
     default).
   ds.chart.heat(holder, counts, {color, to, from, weeks, steps, tip, below, legend, note}): a year of days, one square
     per day, a column per week, Monday on top, pale on a day with nothing, coloured from steps[0] (1), full from
     steps[1] (2); the days before from fade, those after to (today) are left out; below(weekStart) writes a figure
     under a week (what it gained), or {text, title} to say more on hover. counts: {"2026-11-09": 2}. In a card narrower than a year (740px, a phone) it
     scrolls sideways, opened on its last weeks.
   ds.chart.spark(holder, values, {color, top, tip}): small bars side by side, as tall as their value against top
     (a story's views against the best story shown).
   ds.chart.split(holder, parts, {format}): one bar split by share, then its legend. parts: [{label, value, color}].
   ds.chart.donut(holder, rows, {format, value, onPick, center}): a ring split by share, the total in its hole, and its
     legend beside it (under it on a phone), a row per slice: its colour, its name, its share, its amount. rows: [{key,
     label, value, color, note, tone}] (nothing at or under 0 is drawn; note: a word under the name, in red with tone
     "bad", in green with "good"); center: the word under the total (« dépensés »), or
     {value, label}; onPick(key) makes the slices and the rows buttons: a tap chooses one, which the hole then says,
     another tap lets it go (onPick(null)); value: the one chosen to start with; the slices are one stop of the keyboard, the arrows go round them;
     open(key, holder): what the chosen one opens, right under its row of the legend (holder, empty, for the page to
     fill, then or later), gone when it is let go or another is chosen. */
(function () {
  "use strict";
  var SVG = "http://www.w3.org/2000/svg";
  var _ = window.ds._, day = window.ds.day, english = _.english, el = _.el, tone = _.tone;
  var at = day.at, addDays = day.add, weekStart = day.weekStart, parisToday = day.today;
  var WORDS = _.table({
    fr: { none: "rien", one: "1", many: function (n) { return n + " et plus"; }, live: "en cours" },
    en: { none: "none", one: "1", many: function (n) { return n + " or more"; }, live: "running" }
  });
  function words() { return _.words(WORDS); }
  function svg(name, attrs) {
    var e = document.createElementNS(SVG, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function paint(e, color) { if (color) e.style.setProperty("--n", tone(color)); return e; }
  function put(holder, e) { holder = _.find(holder); if (holder) holder.replaceChildren.apply(holder, e ? [e] : []); return e; }
  function num(v) { return window.ds.number(v); }
  // big figures made short where room is tight: 1 240 → 1,2k, 12 500 → 13k
  function short(v) {
    var a = Math.abs(v);
    if (a < 1000) return num(Math.round(v));
    return (a < 10000 ? window.ds.number(Math.round(v / 100) / 10, Math.round(v / 100) % 10 ? 1 : 0) : num(Math.round(v / 1000))) + "k";
  }
  function monthShort(m) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", month: "short" }).format(at(m + "-15")).replace(".", ""); }

  /* the curve: drawn in a 100 × 30 box stretched to the chart's width (100 × 60 when tall), its lines kept thin whatever
     the stretch. Tall, it is a chart of its own: its middle day under it as well, its ground filled with area; ref draws
     a dashed level with its name (a cost price), marks a dot on the days given (purchases), hover the day and value under
     the pointer or the finger, with a cursor */
  function line(holder, points, o) {
    o = o || {};
    var pts = (points || []).filter(function (p) { return p && typeof p.v === "number"; });
    if (pts.length < 2) return put(holder, null);
    var label = o.formatDay || function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(x) ? window.ds.date(x, "day") : String(x); };
    var value = o.format || num;
    var ref = o.ref && typeof o.ref.v === "number" ? o.ref : null;
    var vals = pts.map(function (p) { return p.v; }), all = ref ? vals.concat([ref.v]) : vals;
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), span = hi - lo || 1;
    var H = o.tall ? 60 : 30, top = 2, bot = H - 2;
    function X(i) { return i / (pts.length - 1) * 100; }
    function Y(v) { return bot - (v - lo) / span * (bot - top); }
    var s = svg("svg", { viewBox: "0 0 100 " + H, preserveAspectRatio: "none", "aria-hidden": "true", "class": "chart-line-svg" });
    [top, bot].forEach(function (y) { s.append(svg("line", { x1: "0", x2: "100", y1: String(y), y2: String(y), "class": "chart-rule", "vector-effect": "non-scaling-stroke" })); });
    var coords = vals.map(function (v, i) { return X(i).toFixed(2) + "," + Y(v).toFixed(2); });
    // today, when what follows it is foreseen: the last point on or before it
    var now = -1;
    if (o.now != null) { for (var n = 0; n < pts.length; n++) { if (String(pts[n].x) <= String(o.now)) now = n; } }
    var cut = now >= 0 && now < pts.length - 1 ? now : -1;
    var done = cut >= 0 ? coords.slice(0, cut + 1) : coords, ahead = cut >= 0 ? coords.slice(cut) : [];
    if (o.area) {
      s.append(svg("polygon", { "class": "chart-area", points: "0," + bot + " " + done.join(" ") + " " + X(cut >= 0 ? cut : pts.length - 1).toFixed(2) + "," + bot }));
      if (ahead.length) s.append(svg("polygon", { "class": "chart-area is-ahead", points: X(cut).toFixed(2) + "," + bot + " " + ahead.join(" ") + " 100," + bot }));
    }
    if (ref) s.append(svg("line", { x1: "0", x2: "100", y1: Y(ref.v).toFixed(2), y2: Y(ref.v).toFixed(2), "class": "chart-ref", "vector-effect": "non-scaling-stroke" }));
    if (done.length > 1) s.append(svg("polyline", { "class": "chart-path", "vector-effect": "non-scaling-stroke", points: done.join(" ") }));
    if (ahead.length) s.append(svg("polyline", { "class": "chart-path is-ahead", "vector-effect": "non-scaling-stroke", points: ahead.join(" ") }));
    var first = pts[0], last = pts[pts.length - 1];
    var box = paint(el("div", "chart-line" + (o.tall ? " is-tall" : "") + (o.hover ? " is-hover" : "")), o.color), plot = el("div", "chart-line-plot");
    var ys = el("div", "chart-line-y"), xs = el("div", "chart-line-x");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", value(first.v) + " (" + label(first.x) + ") → " + value(last.v) + " (" + label(last.x) + ")");
    box.title = o.hover ? "" : box.getAttribute("aria-label");
    plot.append(s);
    // what lies over the curve, placed in shares of its box: the level's name, the dots, the cursor and its bubble
    function at(e, i, v) { e.style.left = X(i) + "%"; e.style.top = (Y(v) / H * 100) + "%"; return e; }
    if (ref && ref.label) {
      var name = el("span", "chart-ref-l", ref.label);
      name.style.top = (Y(ref.v) / H * 100) + "%";
      plot.append(name);
    }
    if (cut >= 0) {
      var rule = el("i", "chart-now");
      rule.style.left = X(cut) + "%";
      if (o.nowLabel) rule.append(el("span", "chart-now-l", o.nowLabel));
      plot.append(rule);
    }
    (o.marks || []).forEach(function (m) {
      var i = -1;
      for (var k = 0; k < pts.length; k++) { if (String(pts[k].x) >= String(m.x)) { i = k; break; } }
      if (i < 0) return;
      var dot = at(el("i", "chart-mark"), i, pts[i].v);
      if (m.label) dot.title = m.label;
      plot.append(dot);
    });
    if (o.hover) {
      var cur = el("i", "chart-cursor"), dot = el("i", "chart-dot"), tip = el("span", "chart-tip");
      cur.hidden = dot.hidden = tip.hidden = true;
      plot.append(cur, dot, tip);
      var show = function (e) {
        var r = plot.getBoundingClientRect();
        if (!r.width) return;
        var i = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (pts.length - 1));
        cur.style.left = X(i) + "%";
        at(dot, i, pts[i].v);
        tip.textContent = label(pts[i].x) + " · " + value(pts[i].v);
        cur.hidden = dot.hidden = tip.hidden = false;
        // the bubble stays within the chart
        var w = tip.offsetWidth, x = X(i) / 100 * r.width;
        tip.style.left = Math.min(Math.max(x, w / 2), r.width - w / 2) + "px";
      };
      var hide = function () { cur.hidden = dot.hidden = tip.hidden = true; };
      plot.addEventListener("pointermove", show);
      plot.addEventListener("pointerdown", show);
      plot.addEventListener("pointerleave", hide);
    }
    ys.append(el("span", "", value(hi)));
    if (hi !== lo) ys.append(el("span", "", value(lo)));
    xs.append(el("span", "", label(first.x)));
    if (o.tall && pts.length > 2) xs.append(el("span", "", label(pts[Math.floor((pts.length - 1) / 2)].x)));
    xs.append(el("span", "", label(last.x)));
    box.append(plot, ys, xs);
    return put(holder, box);
  }

  /* a round scale of four or five steps (500, 1 000, 2 000…), its top step above the tallest bar and the average */
  function scale(max) {
    var raw = Math.max(max, 1) / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * p; }).filter(function (v) { return v >= raw; })[0];
    var top = Math.ceil(Math.max(max, 1) / step) * step, ticks = [];
    for (var t = 0; t <= top + 1e-6; t += step) ticks.push(t);
    return { top: top, ticks: ticks };
  }
  /* months must never touch: up to a year every month is named, up to two one in three, beyond only each January's year.
     The year goes with January, and with the first month unless a January follows right after it */
  function monthLabel(key, i, n) {
    var mo = +key.slice(5, 7), yr = key.slice(0, 4);
    if (n > 24) return mo === 1 ? yr : "";
    if (n > 12) return mo === 1 ? yr : (mo - 1) % 3 === 0 ? monthShort(key) : "";
    return [monthShort(key), mo === 1 || (i === 0 && mo < 11) ? " " + yr.slice(2) : ""];
  }
  function bars(holder, rows, o) {
    o = o || {};
    rows = rows || [];
    if (!rows.length) return put(holder, null);
    var n = rows.length, fig = o.short || short, unit = o.unit || "", avg = typeof o.average === "number" ? o.average : null;
    var pairs = o.pairs && o.pairs.length ? o.pairs : null, say = o.format || function (v) { return fig(v) + unit; };
    // paired, the scale is the tallest of every series
    function top(r) { return pairs ? Math.max.apply(null, pairs.map(function (q) { return r[q.key] || 0; })) : r.value || 0; }
    var sc = scale(Math.max.apply(null, rows.map(top).concat([avg || 0])));
    function pc(v) { return (Math.max(0, v) / sc.top * 100).toFixed(2) + "%"; }
    var box = paint(el("div", "chart-bars" + (n > 12 ? " is-dense" : "") + (pairs ? " is-pairs" : "")), o.color), axis = el("div", "chart-bars-axis"), grid = el("div", "chart-bars-grid"), cols = el("div", "chart-bars-cols");
    if (pairs) box.style.setProperty("--pairs", String(pairs.length));
    var labels = sc.ticks.map(function (v) { return v ? fig(v) + unit : "0"; });
    // the scale's gutter is as wide as its longest figure, in the figures' own characters
    box.style.setProperty("--axc", String(Math.max.apply(null, labels.map(function (s) { return s.length; }))));
    box.style.setProperty("--cols", String(n));
    axis.setAttribute("aria-hidden", "true");
    grid.setAttribute("aria-hidden", "true");
    sc.ticks.forEach(function (v, i) {
      var s = el("span", "", labels[i]);
      s.style.bottom = pc(v);
      axis.append(s);
      if (v) { var g = el("i"); g.style.bottom = pc(v); grid.append(g); }
    });
    box.append(axis, grid);
    if (avg != null) {
      var a = el("div", "chart-bars-avg"), ai = el("i");
      a.setAttribute("aria-hidden", "true");
      ai.style.bottom = pc(avg);
      a.append(ai);
      box.append(a);
    }
    // a column's bars side by side, one per series; their figures stacked over the tallest, in each series' colour
    function pair(area, r) {
      var high = 0, vs = el("span", "chart-bar-vs");
      pairs.forEach(function (q) {
        var v = r[q.key] || 0, fill = paint(el("span", "chart-bar-fill"), q.color), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(v, sc.top / 200));
        stack.append(el("i"));
        fill.append(stack);
        area.append(fill);
        vs.append(paint(el("span", "chart-bar-v", fig(v)), q.color));
        high = Math.max(high, v);
      });
      vs.style.bottom = pc(high);
      area.append(vs);
    }
    rows.forEach(function (r, i) {
      var c = el(o.onPick ? "button" : "div", "chart-bar" + (r.key === o.value ? " is-on" : "") + (r.live ? " is-live" : "") + ((n - 1 - i) % 2 ? " is-alt" : ""));
      var area = el("span", "chart-bar-area");
      if (pairs) pair(area, r);
      else {
        var fill = el("span", "chart-bar-fill"), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(r.value || 0, sc.top / 200));
        var parts = r.parts && r.parts.length ? r.parts : [{ value: r.value || 0 }], whole = parts.reduce(function (s, p) { return s + (p.value > 0 ? p.value : 0); }, 0) || 1;
        parts.forEach(function (p) {
          if (!(p.value > 0) && parts.length > 1) return;
          var part = el("i");
          part.style.flex = String((p.value > 0 ? p.value : 1) / whole);
          if (p.color) part.style.backgroundColor = tone(p.color);
          stack.append(part);
        });
        fill.append(el("span", "chart-bar-v", fig(r.value || 0)), stack);
        area.append(fill);
      }
      // a month's year is its own span: a phone leaves it out, where the names would touch
      var name = r.label != null ? [String(r.label), ""] : /^\d{4}-\d{2}$/.test(r.key || "") ? [].concat(monthLabel(r.key, i, n), "").slice(0, 2) : [String(r.key), ""];
      var lab = el("span", "chart-bar-l", name[0]);
      if (name[1]) lab.append(el("span", "chart-bar-yr", name[1]));
      name = name[0] + name[1];
      c.append(area, lab);
      var figs = pairs ? pairs.map(function (q) { return q.label + " " + say(r[q.key] || 0); }).join(" · ") : fig(r.value || 0) + unit;
      c.title = r.title || (name + " · " + figs + (r.live ? " (" + words().live + ")" : ""));
      if (o.onPick) {
        c.type = "button";
        c.setAttribute("aria-pressed", r.key === o.value ? "true" : "false");
        c.addEventListener("click", function () {
          [].forEach.call(cols.children, function (x) { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
          o.onPick(r.key);
        });
      }
      cols.append(c);
    });
    box.append(cols);
    if (pairs) {
      // the series under the bars: a colour, a name, what they add up to
      var legend = el("div", "chart-bars-legend");
      pairs.forEach(function (q) {
        var s = el("span"), sum = rows.reduce(function (t, r) { return t + (r[q.key] || 0); }, 0);
        s.append(paint(el("i", "chart-key"), q.color), q.label, el("b", "", say(sum)));
        legend.append(s);
      });
      box.append(legend);
    }
    return put(holder, box);
  }

  function heat(holder, counts, o) {
    o = o || {};
    counts = counts || {};
    var w = words(), to = o.to || parisToday(), steps = o.steps || [1, 2], weeks = o.weeks || 53, from = o.from || null;
    var title = o.tip || function (key, n) { return window.ds.date(key, "day") + " · " + n; };
    var lastWeek = weekStart(to), blocks = Math.max(1, Math.ceil(weeks / 53)), box = paint(el("div", "chart-heat"), o.color), scroll = el("div", "chart-heat-scroll");
    // always whole years of 53 weeks, so that the squares keep their size; a longer span stacks them, the latest first
    for (var b = 0; b < blocks; b++) {
      var year = el("div", "chart-heat-year"), dow = el("div", "chart-heat-dow"), main = el("div", "chart-heat-main");
      var mos = el("div", "chart-heat-months"), days = el("div", "chart-heat-days"), below = o.below ? el("div", "chart-heat-below") : null;
      ["", 1, "", 3, "", 5, "", 7].forEach(function (d) {
        dow.append(el("span", "", d ? new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", weekday: "short" }).format(at(addDays("2026-11-08", d))).replace(".", "") : ""));
      });
      if (below) dow.append(el("span"));
      for (var k = 52; k >= 0; k--) {
        var ws = addDays(lastWeek, -7 * (k + 53 * b)), lab = "";
        // a month is named over the week that holds its first day
        for (var j = 0; j < 7; j++) { var dj = addDays(ws, j); if (dj.slice(8) === "01") lab = monthShort(dj.slice(0, 7)) + (dj.slice(5, 7) === "01" ? " " + dj.slice(2, 4) : ""); }
        mos.append(el("span", "", lab));
        // what the week brought: a figure, or {text, title} for a word on hover
        if (below) {
          var g = from && addDays(ws, 6) < from ? null : o.below(ws), gs = el("span", "", g == null ? "" : String(g && typeof g === "object" ? g.text : g));
          if (g && typeof g === "object" && g.title) gs.title = g.title;
          below.append(gs);
        }
        for (var i = 0; i < 7; i++) {
          var day = addDays(ws, i), c = day > to ? 0 : counts[day] || 0;
          var sq = el("i", "heat-day" + (c >= steps[1] ? " is-2" : c >= steps[0] ? " is-1" : "") + (day > to ? " is-future" : "") + (from && day < from ? " is-out" : ""));
          sq.dataset.day = day;
          if (day <= to) sq.title = title(day, c);
          days.append(sq);
        }
      }
      main.append(mos, days);
      if (below) { main.append(below); year.classList.add("has-below"); }
      year.append(dow, main);
      scroll.append(year);
    }
    var lg = o.legend || [w.none, w.one, w.many(steps[1])], legend = el("div", "chart-heat-legend");
    ["", "is-1", "is-2"].forEach(function (cls, i) { var s = el("span"), k = el("i", "heat-day " + cls); s.append(k, lg[i]); legend.append(s); });
    if (o.note) legend.append(el("span", "chart-heat-note", o.note));
    box.append(scroll, legend);
    // opened on the latest weeks when the year is wider than the screen
    requestAnimationFrame(function () { scroll.scrollLeft = scroll.scrollWidth; });
    return put(holder, box);
  }

  function spark(holder, values, o) {
    o = o || {};
    values = values || [];
    var top = o.top || Math.max.apply(null, values.concat([1])), box = paint(el("span", "chart-spark"), o.color);
    box.setAttribute("aria-hidden", "true");
    values.forEach(function (v) {
      var b = el("i");
      // the smallest still shows
      b.style.height = Math.max(8, Math.round(v / top * 100)) + "%";
      b.title = o.tip ? o.tip(v) : num(v);
      box.append(b);
    });
    return put(holder, box);
  }

  function split(holder, parts, o) {
    o = o || {};
    var format = o.format || num, all = (parts || []).filter(function (p) { return p.value > 0; }), total = all.reduce(function (s, p) { return s + p.value; }, 0);
    if (!total) return put(holder, null);
    var box = el("div", "chart-split"), bar = el("div", "chart-split-bar"), legend = el("div", "chart-split-legend");
    all.forEach(function (p) {
      var share = p.value / total, piece = el("i"), key = el("span"), dot = paint(el("i", "chart-key"), p.color);
      piece.style.width = (share * 100).toFixed(2) + "%";
      if (p.color) piece.style.background = tone(p.color);
      piece.title = p.label + " · " + format(p.value);
      bar.append(piece);
      key.append(dot, p.label, el("b", "", format(p.value)), el("em", "", Math.round(share * 100) + "%"));
      legend.append(key);
    });
    box.append(bar, legend);
    return put(holder, box);
  }

  /* the donut, taken from Bank's spending: a ring drawn in a 200 × 200 box from the top, clockwise, a hair of room between
     its slices; a figure in its hole, the legend beside it */
  function donut(holder, rows, o) {
    o = o || {};
    var format = o.format || num, all = (rows || []).filter(function (x) { return x && x.value > 0; });
    var total = all.reduce(function (s, x) { return s + x.value; }, 0);
    if (!total) return put(holder, null);
    var R = 90, r = 60, gap = all.length > 1 ? 0.02 : 0, angle = -Math.PI / 2;
    var box = el("div", "chart-donut" + (o.onPick ? " is-pick" : "")), ring = el("div", "chart-donut-ring"), legend = el("ul", "chart-donut-legend");
    var s = svg("svg", { viewBox: "0 0 200 200", "class": "chart-donut-svg" }), mid = el("div", "chart-donut-c"), big = el("b"), word = el("small");
    var c = o.center == null ? {} : typeof o.center === "object" ? o.center : { label: String(o.center) };
    var keys = all.map(function (x) { return String(x.key != null ? x.key : x.label); }), on = o.value == null ? null : String(o.value);
    var slices = [], items = [], told = [];
    function pt(a, rad) { return (100 + rad * Math.cos(a)).toFixed(2) + " " + (100 + rad * Math.sin(a)).toFixed(2); }
    all.forEach(function (x, i) {
      var sweep = x.value / total * Math.PI * 2, a0 = angle + gap / 2, a1 = all.length > 1 ? angle + sweep - gap / 2 : angle + Math.PI * 2 - 0.0001;
      // the smallest share still shows as a sliver
      if (a1 - a0 < 0.004) a1 = a0 + 0.004;
      var arc = a1 - a0 > Math.PI ? 1 : 0, half = angle + sweep / 2, pct = Math.round(x.value / total * 100);
      angle += sweep;
      var said = x.label + " · " + format(x.value) + " · " + pct + "%";
      told.push(said);
      var path = paint(svg("path", { "class": "chart-donut-slice",
        d: "M " + pt(a0, R) + " A " + R + " " + R + " 0 " + arc + " 1 " + pt(a1, R) + " L " + pt(a1, r) + " A " + r + " " + r + " 0 " + arc + " 0 " + pt(a0, r) + " Z" }), x.color);
      // chosen or under the pointer, a slice moves out a little along its middle
      path.style.setProperty("--dx", (Math.cos(half) * 5).toFixed(2));
      path.style.setProperty("--dy", (Math.sin(half) * 5).toFixed(2));
      var tip = svg("title");
      tip.textContent = said;
      path.append(tip);
      s.append(path);
      slices.push(path);
      var li = el("li"), row = el(o.onPick ? "button" : "div", "chart-donut-row");
      // a row may say a word under its name (note), in a colour (tone: bad, good): what rose against the usual
      var name = el("span", "chart-donut-l", x.label);
      if (x.note) name.append(el("small", "chart-donut-n" + (x.tone ? " is-" + x.tone : ""), x.note));
      row.append(paint(el("i", "chart-key"), x.color), name, el("em", "", pct + "%"), el("b", "", format(x.value)));
      li.append(row);
      legend.append(li);
      items.push(row);
      if (!o.onPick) return;
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", said);
      path.addEventListener("click", function () { choose(i, true); });
      // the slices are one stop of the keyboard: the arrows go round the ring, Enter or Space takes one
      path.addEventListener("keydown", function (e) {
        var n = slices.length, to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
        if (to != null) { e.preventDefault(); rove((to + n) % n, true); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(i, true); }
      });
      row.type = "button";
      row.addEventListener("click", function () { choose(i, true); });
    });
    if (o.onPick) s.setAttribute("role", "group");
    else {
      s.setAttribute("role", "img");
      s.setAttribute("aria-label", told.join(", "));
    }
    function rove(i, focus) {
      if (!o.onPick) return;
      slices.forEach(function (p, k) { p.setAttribute("tabindex", k === i ? "0" : "-1"); });
      if (focus) slices[i].focus();
    }
    // what the chosen one opens, under its row
    var opened = null;
    function openUnder(at) {
      if (opened) { opened.remove(); opened = null; }
      if (!o.open || at < 0) return;
      var holder = el("div", "chart-donut-more");
      opened = el("li", "chart-donut-open");
      opened.append(holder);
      items[at].parentNode.after(opened);
      o.open(keys[at], holder);
    }
    // a tap chooses a slice, another tap on it lets it go; the hole says the chosen one, else the total
    function choose(i, user) {
      var k = i == null ? null : keys[i];
      if (user) on = on === k ? null : k;
      var at = on == null ? -1 : keys.indexOf(on);
      box.classList.toggle("has-on", at >= 0);
      slices.forEach(function (p, j) { p.classList.toggle("is-on", j === at); if (o.onPick) p.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      items.forEach(function (b, j) { b.classList.toggle("is-on", j === at); if (o.onPick) b.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      big.textContent = at >= 0 ? format(all[at].value) : c.value != null ? String(c.value) : format(total);
      word.textContent = at >= 0 ? all[at].label : c.label || "";
      word.hidden = !word.textContent;
      openUnder(at);
      if (user) { rove(i, false); o.onPick(on); }
    }
    mid.setAttribute("aria-live", "polite");
    mid.append(big, word);
    ring.append(s, mid);
    box.append(ring, legend);
    choose(null, false);
    rove(Math.max(0, on == null ? 0 : keys.indexOf(on)), false);
    return put(holder, box);
  }

  window.ds = window.ds || {};
  window.ds.chart = { line: line, bars: bars, heat: heat, spark: spark, split: split, donut: donut };
})();
