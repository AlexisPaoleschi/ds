/* Figures read at a glance, taken from Studio's analysis. Each one draws into holder (its content replaced) and returns
   its element; with holder null it only returns it, for a page that builds its own tree (a verdict in a ranking's row).
   ds.rank(holder, rows, {title, note, empty, plain}): a ranking, one row per name: its place (the first three in gold), the name
     (a link with href) and a grey line under it (sub), and on the right its value (a text, or a node such as a verdict);
     with share (0 to 1, against the first) a thin bar under the name. plain leaves the places out. Rankings side by side
     go in <div class="ranks">.
   ds.minitiles(holder, items): small tiles of reference figures at the top of a card. items: [{label, value, unit, note,
     tone}]: tone "good", "bad" or "mid" colours the figure.
   ds.verdict(holder, ratio, {words, high, low}): a judgement of a figure against the usual one: « ×1,4 », green from high (1.2),
     yellow from low (0.8), red under it; with words, « fort », « moyen » or « faible » under it. null keeps its room.
   ds.periodPick(holder, options, {value, onPick, label}): a period selector: buttons on a computer, the design system's
     menu on a phone (768px and less, « 1 an ▾ », the same .pill as a month's or a sort's). options: [[value, label]];
     value: the one lit; onPick(value) is called with the chosen one, the selector lights it itself. Called again on the
     same holder, it gives the same selector back, lit on the value given. */
(function () {
  "use strict";
  var _ = window.ds._, el = _.el, find = _.find;
  function put(holder, e) { holder = find(holder); if (holder) holder.replaceChildren(e); return e; }
  var WORDS = _.table({
    fr: { strong: "fort", average: "moyen", weak: "faible", against: "par rapport à la médiane", period: "Période", empty: "Rien sur cette période." },
    en: { strong: "strong", average: "average", weak: "weak", against: "against the median", period: "Period", empty: "Nothing over this period." }
  });
  function words() { return _.words(WORDS); }
  function safe(u) { return typeof u === "string" && /^(https?:\/\/|\/|#)[^\s"'<>]*$/.test(u) ? u : null; }

  function rank(holder, rows, o) {
    o = o || {};
    var col = el("div", "rank-col"), head = el("p", "rank-head", o.title || "");
    if (o.note) head.append(el("span", "rank-note", o.note));
    col.append(head);
    if (!rows || !rows.length) { col.append(el("p", "empty-note", o.empty || words().empty)); return put(holder, col); }
    var list = el("ol", "rank" + (o.plain ? " is-plain" : ""));
    rows.forEach(function (r, i) {
      var li = el("li", i < 3 ? "is-top" : ""), name = el("div", "rank-name"), href = safe(r.href);
      var t = typeof r.name === "string" || r.name == null ? el(href ? "a" : "span", "rank-t", r.name || "") : el("span", "rank-t", r.name);
      if (href) { t.href = href; if (/^https?:/.test(href)) { t.target = "_blank"; t.rel = "noopener"; } }
      name.append(t);
      if (r.sub != null) name.append(el("small", "", r.sub));
      if (typeof r.share === "number") {
        var bar = el("i", "rank-bar");
        bar.style.setProperty("--share", Math.max(0, Math.min(1, r.share)).toFixed(3));
        bar.setAttribute("aria-hidden", "true");
        name.append(bar);
      }
      if (!o.plain) li.append(el("span", "rank-n", String(i + 1)));
      li.append(name);
      if (r.value != null) li.append(typeof r.value === "string" || typeof r.value === "number" ? el("span", "rank-v", String(r.value)) : r.value);
      list.append(li);
    });
    col.append(list);
    return put(holder, col);
  }

  // the compact tiles (tiles.css), each as wide as the widest (.is-fit); .minitiles stays on it for the apps' own rules
  function minitiles(holder, items) {
    var box = el("dl", "tiles is-compact is-fit minitiles");
    (items || []).filter(Boolean).forEach(function (x) {
      box.append(el("div", "tile" + (x.tone ? " is-" + x.tone : ""), [el("dt", "", x.label), el("dd", "", [x.value, x.unit != null ? el("span", "tile-unit", x.unit) : null]),
        x.note ? el("span", "tile-note", x.note) : null]));
    });
    return put(holder, box);
  }

  function verdict(holder, ratio, o) {
    o = o || {};
    var w = words(), high = o.high || 1.2, low = o.low || 0.8;
    if (ratio == null || isNaN(ratio)) return put(holder, el("span", "verdict is-none" + (o.words ? " is-tall" : "")));
    var level = ratio >= high ? "good" : ratio >= low ? "mid" : "bad";
    var v = el("span", "verdict is-" + level + (o.words ? " is-tall" : ""), "×" + window.ds.number(Math.round(ratio * 10) / 10, Math.round(ratio * 10) % 10 ? 1 : 0));
    v.title = w.against;
    // short words of the same length, so that every verdict reads the same
    if (o.words) v.append(el("small", "", level === "good" ? w.strong : level === "mid" ? w.average : w.weak));
    return put(holder, v);
  }

  function periodPick(holder, options, o) {
    o = o || {};
    holder = find(holder);
    var had = holder && holder._dsPeriodPick;
    if (had) { if (o.value !== undefined) had.light(o.value); return had.el; }
    var pick = o.onPick, label = o.label || words().period, box = el("span", "periodpick"), group = el("div", "tabs");
    // on a phone, the menu: what is chosen in words, the phone's own picker under it
    var list = el("select"), shown = el("span", "pill-value"), menu = el("label", "pill periodpick-list", [shown, list]);
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    list.setAttribute("aria-label", label);
    function light(v) {
      [].forEach.call(group.children, function (b) { b.setAttribute("aria-pressed", b.dataset.value === String(v) ? "true" : "false"); });
      list.value = String(v);
      shown.textContent = list.selectedIndex < 0 ? "" : list.options[list.selectedIndex].textContent;
    }
    function choose(v) {
      var opt = options.filter(function (x) { return String(x[0]) === String(v); })[0];
      if (!opt) return;
      light(opt[0]);
      if (pick) pick(opt[0]);
    }
    options.forEach(function (x) {
      var b = el("button", "", x[1]), op = el("option", "", x[1]);
      b.type = "button";
      b.dataset.value = String(x[0]);
      b.addEventListener("click", function () { choose(x[0]); });
      op.value = String(x[0]);
      group.append(b);
      list.append(op);
    });
    list.addEventListener("change", function () { choose(list.value); });
    light(o.value);
    box.append(group, menu);
    if (holder) { holder._dsPeriodPick = { el: box, light: light }; holder.replaceChildren(box); }
    return box;
  }

  window.ds = window.ds || {};
  window.ds.rank = rank;
  window.ds.minitiles = minitiles;
  window.ds.verdict = verdict;
  window.ds.periodPick = periodPick;
})();
