/* ds.photogrid(grid, {sizes, size, key, slider, masonry}): the photo grid of src/photogrid.css, Selecta's masonry made
   generic. Each child of grid is a tile holding an image (a link, a figure…); the tiles fall in columns of even height,
   each one into the shortest column, as tall as its photo's shape: the <img>'s width and height, or its own size once
   loaded (the grid lays itself out again then). It follows the grid's width, tiles added, removed or hidden, and a class
   set on the grid (a filter); after any other change, layout() lays it out again.
   sizes: the widths a column may have, in px ([140, 190, 240, 300]); size: the one to start with (190); key: the device
   remembers the size chosen under it; slider: an <input type="range" class="zoom-slider"> that picks among the sizes,
   from small to large, offering only those that change the grid (a phone has fewer); masonry: false for even rows,
   each photo cut to a square-ish tile. The tiles slide to their new places when the size changes, unless the device
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
      if (x.masonry != null) g.masonry = !!x.masonry;
      move(layout);
      return g;
    };

    if (slider) {
      if (!slider.hasAttribute("aria-label") && !(slider.labels && slider.labels.length && slider.labels[0].textContent.trim())) slider.setAttribute("aria-label", words().size);
      slider.addEventListener("input", function () { var i = steps[+slider.value]; if (i != null) g.set({ size: sizes[i] }); });
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
