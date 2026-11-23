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
