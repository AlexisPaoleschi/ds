// The showcase demos of Studio's components (index.html): what makes them move.
// A photographer's agenda and figures, made up but drawn around today, the same in both columns.
(function () {
  "use strict";
  var today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  function num(key) { return Math.round(Date.parse(key + "T12:00:00Z") / 864e5); }
  function key(n) { return new Date(n * 864e5 + 432e5).toISOString().slice(0, 10); }
  function addDays(k, n) { return key(num(k) + n); }
  // the same made-up figures on every visit: a seeded draw
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function pick(list, n) { return list[Math.floor(rnd(n) * list.length)]; }
  function each(name, fn) { document.querySelectorAll('[data-studio="' + name + '"]').forEach(fn); }
  function node(name, cls, text) { var e = document.createElement(name); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* the agenda: publications and tasks (a square, filled once out), appointments and shootings (a bar), sport */
  var NETS = [["IG", "--c-rouge", "Instagram"], ["P", "--c-bleu", "Patreon"], ["X", "--c-emeraude", "X"], ["BS", "--c-ciel", "Bluesky"], ["NL", "--c-ambre", "Newsletter"]];
  var MODELS = ["Irina", "Léa", "Rebecca", "Maëlle", "Anouk", "Inès", "Zoé", "Clémence"];
  var KINDS = ["Série", "Preview", "Story", "Vidéo", "Making-of", "Set complet"];
  var PLACES = ["Lyon · Hôtel Le Royal", "Studio de la Croix-Rousse", "Annecy · bord du lac", "Paris · Le Marais"];
  var cache = {};
  function itemsOn(k) {
    if (cache[k]) return cache[k];
    var n = num(k), d = n - num(today), out = [], count = Math.floor(rnd(n) * 4) + (d === 0 ? 4 : 0);
    for (var i = 0; i < count; i++) {
      var net = pick(NETS, n * 7 + i), model = pick(MODELS, n * 5 + i), kind = pick(KINDS, n * 3 + i);
      var past = d < 0 || (d === 0 && i % 2 === 0), done = past && (d === 0 || rnd(n * 13 + i) > 0.18);
      out.push({ title: kind + " " + model, color: net[1], codes: [{ text: net[0], color: net[1], title: net[2] }], open: !done, done: done && d < 0,
        late: past && !done, lateText: "pas publié", time: done ? String(9 + Math.floor(rnd(n + i) * 11)).padStart(2, "0") + "h" + (rnd(n * 2 + i) > 0.5 ? "30" : "00") : null,
        note: net[2] + " · " + kind + " " + model });
    }
    out.sort(function (a, b) { return (a.time || "99") < (b.time || "99") ? -1 : 1; });
    if (rnd(n * 11) > 0.7 || d === 0) out.push({ title: "Shooting " + pick(MODELS, n * 17), mark: "thick", color: "--c-vert", time: "10h00", place: pick(PLACES, n) });
    if ((n % 7 === 1 || n % 7 === 4) && d < 30) out.push({ title: "Pilates", mark: "bar", color: "--c-rouge", time: "18h30" });
    if (rnd(n * 19) > 0.82) out.push({ title: "Rendez-vous " + pick(["imprimeur", "comptable", "galerie Regard"], n), mark: "bar", color: "--c-bleu", time: "14h00", place: "Lyon" });
    if (rnd(n * 23) > 0.86) out.push({ title: "Shooting Katline · " + pick(MODELS, n * 29), mark: "thick", color: "--c-rose", time: "09h30", place: pick(PLACES, n + 1) });
    // the publications first, then the agenda in the order of its hours
    var bars = out.filter(function (it) { return it.mark; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    return (cache[k] = out.filter(function (it) { return !it.mark; }).concat(bars));
  }
  // the day's panel as Studio draws it: what went out, what is still to publish, then the agenda
  function panel(k, items) {
    var bar = function (it) { return it.mark === "bar" || it.mark === "thick"; };
    var groups = [["Publié", "check", function (it) { return !bar(it) && !it.open; }], [k < today ? "Pas publié" : "À publier", "send", function (it) { return !bar(it) && it.open; }],
      ["Agenda", "cal", bar]];
    var out = [];
    groups.forEach(function (g) {
      var xs = items.filter(g[2]);
      if (!xs.length) return;
      var h = node("h4", "sect"), ul = node("ul", "rows");
      h.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-' + g[1] + '"/></svg>';
      h.append(g[0]);
      xs.forEach(function (it) { ul.append(ds.calendar.row(it)); });
      out.push(h, ul);
    });
    return out.length ? out : node("p", "empty", "Rien ce jour-là.");
  }
  each("calendar", function (holder) { ds.calendar(holder, { items: itemsOn, panel: panel, years: [2015, +today.slice(0, 4) + 2] }); });

  /* followers: a curve of 90 days, from one figure to another, with its ups and downs; the period selector */
  each("line", function (holder) {
    var from = +holder.dataset.from, to = +holder.dataset.to, pts = [];
    // the last figure is the tile's: the days before stay under it
    for (var i = 0; i < 90; i++) pts.push({ x: addDays(today, i - 89), v: Math.min(to, Math.round(from + (to - from) * i / 89 + (rnd(from + i) - 0.5) * (to - from) * 0.12)) });
    pts[89].v = to;
    ds.chart.line(holder, pts);
  });
  var SPANS = [[30, "30 jours"], [90, "90 jours"], [365, "1 an"], [0, "Tout"]];
  each("period", function (holder) {
    holder.append(ds.periodPick(SPANS, 90, function (v) { ds.toast({ type: "info", text: "Période : " + SPANS.filter(function (s) { return s[0] === v; })[0][1] }); }));
  });

  /* revenue: a year of months, net in euros, split between subscriptions and single purchases; the month in progress hatched */
  var months = [];
  for (var m = 11; m >= 0; m--) {
    var d = new Date(Date.parse(today.slice(0, 7) + "-15T12:00:00Z")); d.setUTCMonth(d.getUTCMonth() - m);
    var mk = d.toISOString().slice(0, 7), abo = Math.round(820 + rnd(m + 3) * 420 + (11 - m) * 18), achats = Math.round(rnd(m + 40) * 380);
    if (m === 0) { abo = Math.round(abo * 0.55); achats = Math.round(achats * 0.4); }
    months.push({ key: mk, value: abo + achats, abo: abo, achats: achats, live: m === 0, parts: [{ value: abo, color: "--c-bleu" }, { value: achats, color: "--accent" }] });
  }
  var done = months.filter(function (x) { return !x.live; }), average = done.reduce(function (s, x) { return s + x.value; }, 0) / done.length;
  function money(n) { return ds.money(n, { decimals: 0 }); }
  each("bars", function (holder) {
    var top = node("div"), split = node("div"), chart = node("div");
    split.style.margin = "0 0 var(--s-16)";
    function show(k) {
      var x = months.filter(function (r) { return r.key === k; })[0];
      top.replaceChildren(ds.minitiles([{ label: ds.date(k, "month") + (x.live ? " · en cours" : ""), value: money(x.value), unit: "net" },
        { label: "Moyenne 12 mois", value: money(average), unit: "par mois", note: "sans le mois en cours" }]));
      ds.chart.split(split, [{ label: "Abonnements", value: x.abo, color: "--c-bleu" }, { label: "Achats uniques", value: x.achats, color: "--accent" }], { format: money });
    }
    show(months[11].key);
    ds.chart.bars(chart, months, { color: "--c-bleu", average: average, unit: "€", selected: months[11].key, pick: show });
    holder.append(top, split, chart);
  });

  /* a year of Instagram posts, and the followers gained each week under it */
  var posts = {}, gains = {};
  for (var i = 0; i < 371; i++) {
    var day = addDays(today, -i), r = rnd(i * 31 + 7);
    if (r > 0.52) posts[day] = r > 0.86 ? 2 : 1;
  }
  each("heat", function (holder) {
    var total = 0;
    Object.keys(posts).forEach(function (k) { total += posts[k]; });
    holder.append(ds.minitiles([{ label: "Posts", value: ds.number(total / 53, 1), unit: "par semaine" }, { label: "Abonnés gagnés", value: "+86", unit: "par semaine" }]));
    var box = node("div");
    ds.chart.heat(box, posts, { color: "--c-rouge", legend: ["rien", "1 post", "2 et plus"], note: "sous chaque semaine : les abonnés gagnés",
      title: function (k, n) { return ds.date(k, "day") + " · " + (n ? n + (n > 1 ? " posts" : " post") : "rien"); },
      below: function (ws) { return ws > today ? null : "+" + Math.round(40 + rnd(num(ws)) * 110); } });
    holder.append(box);
  });

  /* rankings: who worked, against the usual post (a verdict), and who brought money (amounts, a bar against the first) */
  each("worked", function (holder) {
    var people = [["Irina", 6, 1.9], ["Léa", 4, 1.5], ["Rebecca", 3, 1.2], ["Maëlle", 5, 1.05], ["Anouk", 2, 0.86], ["Inès", 3, 0.62]];
    var postsTop = [["Série Irina au lac", "12 oct.", 2.4], ["Preview Léa", "28 sept.", 1.7], ["Making-of Lyon", "3 nov.", 1.1], ["Set complet Inès", "19 oct.", 0.7]];
    var types = [["Série", 9, 1.3], ["Preview", 7, 1.0], ["Story", 12, 0.7]];
    holder.append(ds.minitiles([{ label: "Médiane", value: "1 240", unit: "réactions", note: "48 posts depuis mars 2026" }]));
    var ranks = node("div", "ranks");
    ranks.append(
      ds.rank(people.map(function (p) { return { name: p[0], href: "#", sub: p[1] + " posts", value: ds.verdict(p[2]) }; }), { title: "Par modèle" }),
      ds.rank(postsTop.map(function (p) { return { name: p[0], href: "https://www.instagram.com/", sub: p[1], value: ds.verdict(p[2]) }; }), { title: "Par post" }),
      ds.rank(types.map(function (p) { return { name: p[0], sub: p[1] + " posts", value: ds.verdict(p[2]) }; }), { title: "Par type de contenu", plain: true }));
    holder.append(ranks);
  });
  each("earned", function (holder) {
    var people = [["Irina Lozovaya", 14, 1260], ["Rebecca Bagnol", 9, 840], ["Léa", 6, 515], ["Clémence", 4, 290], ["Zoé", 2, 95]];
    var postsTop = [["Série Irina au lac", 8, 620], ["Pack Lyon 2026", 5, 450], ["Vidéo Rebecca", 4, 180]];
    var paid = [["Preview Léa", "28 sept. · 96€ d’abonnements", "+12"], ["Série Irina au lac", "12 oct. · 64€ d’abonnements", "+8"], ["Story Maëlle", "2 nov.", "+3"]];
    holder.append(ds.minitiles([{ label: "Ventes des modèles", value: money(3000), unit: "hors packs et accès" }]));
    var ranks = node("div", "ranks");
    ranks.append(
      ds.rank(people.map(function (p) { return { name: p[0], href: "#", sub: p[1] + " ventes", value: money(p[2]), share: p[2] / people[0][2] }; }), { title: "Par modèle" }),
      ds.rank(postsTop.map(function (p) { return { name: p[0], href: "https://www.patreon.com/", sub: p[1] + " ventes", value: money(p[2]) }; }), { title: "Par post" }),
      ds.rank(paid.map(function (p) { return { name: p[0], sub: p[1], value: p[2] }; }), { title: "Posts qui amènent des payants", note: "30 jours" }));
    holder.append(ranks);
  });
  /* a day of stories: one small bar per story, as tall as its views, and the day against the usual story */
  each("stories", function (holder) {
    var med = 820, days = [];
    for (var i = 0; i < 5; i++) {
      var n = 2 + Math.floor(rnd(i + 90) * 5), vs = [];
      for (var j = 0; j < n; j++) vs.push(Math.round(400 + rnd(i * 10 + j) * 1100));
      days.push({ key: addDays(today, -i), views: vs });
    }
    var top = Math.max.apply(null, days.map(function (x) { return Math.max.apply(null, x.views); }));
    holder.append(ds.minitiles([{ label: "Médiane", value: ds.number(med), unit: "vues par story", note: "214 stories depuis janvier 2026" }]));
    holder.append(ds.rank(days.map(function (x) {
      var sum = x.views.reduce(function (s, v) { return s + v; }, 0), figs = node("span");
      figs.style.cssText = "display: inline-flex; align-items: center; gap: var(--s-14)";
      figs.append(ds.chart.spark(null, x.views, { color: "--c-rouge", top: top, title: function (v) { return ds.number(v) + " vues"; } }),
        node("b", "rank-v", ds.number(Math.round(sum / x.views.length))), ds.verdict(sum / x.views.length / med, { words: true }));
      return { name: x.views.length + " stories", sub: ds.date(x.key, "day") + " · " + ds.number(sum) + " vues au total", value: figs };
    }), { title: "Par jour", plain: true }));
  });

  /* the « new version » light, and the device's copy: drawn at once, then the server's answer */
  var lights = [];
  each("version", function (b) { lights.push(ds.version(b, { mine: "2.17.0" })); });
  each("version-new", function (b) { b.addEventListener("click", function () { lights.forEach(function (l) { l.seen("2.18.0"); }); }); });
  var keeps = [];
  each("keep", function (list) { keeps.push(list); });
  function say(t, text) {
    keeps.forEach(function (list) {
      var li = node("li");
      li.append(node("span", "t", t), node("span", "pl", text));
      list.append(li);
    });
  }
  if (keeps.length) {
    var asked = Date.now(), fromCopy = false;
    ds.keep.fresh("ds-showcase-agenda", function () {
      // the server takes its time: the copy has the page drawn by then
      return new Promise(function (ok) { setTimeout(function () { ok({ events: 42 }); }, 1500); });
    }, function (value, how) {
      if (how.copy) { fromCopy = true; say("copie", "Ouverte tout de suite sur la copie de l’appareil, gardée " + ds.ago(how.at) + " : " + value.events + " rendez-vous."); }
      else say("serveur", "À jour " + ds.number((Date.now() - asked) / 1000, 1) + " s plus tard ; la nouvelle copie est gardée pour la prochaine visite.");
    }).then(function () {
      return ds.keep.ok();
    }).then(function (ok) {
      if (!ok) say("appareil", "Cet appareil ne garde pas de copie : la page attend le serveur, comme à une première visite.");
      else if (!fromCopy) say("copie", "Première visite : rien sur l’appareil. Rechargez la page pour l’ouvrir sur la copie.");
    });
  }
})();
