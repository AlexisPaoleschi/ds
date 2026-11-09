// The showcase demos of the photo pieces (index.html): what makes them move.
// The photos are drawn here, landscapes in gradients (no image host): the same on every visit, each column its own copy.
(function () {
  "use strict";
  // the same made-up landscapes on every visit: a seeded draw
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  // sky top, sky at the horizon, sun, then the hills from the furthest to the nearest
  var SKIES = [
    ["#2b3a67", "#f7b267", "#ffe8b0", "#8a6f8f", "#5b4a6b", "#2a2238"],
    ["#f6d365", "#fda085", "#fff6d8", "#c8745a", "#9a4f3e", "#5e2e25"],
    ["#0f2027", "#2c5364", "#e8eef5", "#2f5263", "#1d3644", "#0b161c"],
    ["#e6efe9", "#a8c5b5", "#ffffff", "#86aa97", "#5b806d", "#34503f"],
    ["#614385", "#f2a1b5", "#ffd6e0", "#8a5687", "#5d3660", "#2f1d33"],
    ["#ffb88c", "#de6262", "#fff0d1", "#b8573f", "#8a3b2c", "#4f201a"],
    ["#74ebd5", "#acb6e5", "#ffffff", "#6f8fb8", "#46638a", "#22344c"]
  ];
  function scene(n, w, h) {
    var c = SKIES[n % SKIES.length], hills = "";
    for (var k = 0; k < 3; k++) {
      var base = h * (0.56 + 0.13 * k), rise = h * (0.16 - 0.035 * k), d = "M0 " + h + " L0 " + Math.round(base - rise * rnd(n * 31 + k));
      for (var i = 1; i <= 10; i++) d += " L" + Math.round(w * i / 10) + " " + Math.round(base - rise * rnd(n * 31 + k * 7 + i));
      hills += '<path d="' + d + " L" + w + " " + h + ' Z" fill="' + c[3 + k] + '"/>';
    }
    var sx = Math.round(w * (0.2 + 0.6 * rnd(n * 3))), sy = Math.round(h * (0.24 + 0.2 * rnd(n * 5))), sr = Math.round(Math.min(w, h) * (0.06 + 0.04 * rnd(n * 7)));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">' +
      '<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".7" stop-color="' + c[1] + '"/></linearGradient>' +
      '<radialGradient id="g"><stop offset="0" stop-color="' + c[2] + '" stop-opacity=".7"/><stop offset="1" stop-color="' + c[2] + '" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#s)"/><circle cx="' + sx + '" cy="' + sy + '" r="' + sr * 4 + '" fill="url(#g)"/>' +
      '<circle cx="' + sx + '" cy="' + sy + '" r="' + sr + '" fill="' + c[2] + '"/>' + hills + "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  // the grid's photos: every shape a camera gives, and what one would write under them
  var SHAPES = [[3, 2], [2, 3], [4, 5], [16, 9], [1, 1], [3, 4], [3, 2], [2, 3], [4, 3], [9, 16], [3, 2], [4, 5], [1, 1], [3, 2]];
  var CAPTIONS = ["L’aube sur les collines", "Le col au matin", "Brume dans la vallée", "Fin d’après-midi", "L’heure dorée", "Le dernier rayon",
    "Crépuscule", "Nuit claire", "Le lac au réveil", "La crête", "Vent d’ouest", "Les trois sommets", "Soleil bas", "Retour au village"];

  function column(col, n) {
    var theme = col.getAttribute("data-theme");
    col.querySelectorAll("img[data-scene]").forEach(function (img) {
      img.src = scene(+img.getAttribute("data-scene"), +img.getAttribute("width") || 1600, +img.getAttribute("height") || 900);
    });
    // the grid: links to the large photos, opened in the viewer by data-viewer, laid out by ds.photogrid
    var grid = col.querySelector('[data-photo="grid"]');
    grid.innerHTML = SHAPES.map(function (s, i) {
      var w = 300, h = Math.round(300 * s[1] / s[0]);
      return '<a href="' + scene(i + 2, w * 5, h * 5) + '" data-caption="' + CAPTIONS[i] + '"><img src="' + scene(i + 2, w, h) + '" width="' + w + '" height="' + h +
        '" alt="' + CAPTIONS[i] + '" loading="lazy"></a>';
    }).join("");
    // a showcase column is narrower than a page: a smaller first size keeps two columns on a phone
    ds.photogrid(grid, { sizes: [120, 140, 190, 240, 300], size: 120, key: "ds-demo-zoom-" + theme, slider: col.querySelector('[data-photo="zoom"]') });
    // the viewer from code: six photos of a trip, the fourth asked for when it is needed (a second of spinner)
    var seen = col.querySelector('[data-photo="seen"]'), items = [0, 1, 2, 3, 4, 5].map(function (i) {
      var it = { src: scene(20 + i, 1500, i % 3 === 1 ? 2000 : 1000), alt: "Sénégal 2027, photo " + (i + 1), caption: i % 2 ? "" : "Saly, la lagune · jour " + (i / 2 + 1) };
      return i === 3 ? function () { return new Promise(function (ok) { setTimeout(function () { ok(it); }, 1000); }); } : it;
    });
    col.querySelector('[data-photo="open"]').addEventListener("click", function (e) {
      ds.viewer(items, { start: 0, label: "Sénégal 2027", from: e.currentTarget,
        onChange: function (i) { seen.textContent = "Photo " + (i + 1) + " sur " + items.length + " montrée."; },
        onClose: function (i) { seen.textContent = "Fermée sur la photo " + (i + 1) + "."; } });
    });
  }
  document.querySelectorAll("#themes > .theme").forEach(column);
})();
