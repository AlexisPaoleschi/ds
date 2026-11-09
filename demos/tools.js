// The showcase demos of a page's tools (index.html): the drawer, the sources' state, the syncs, the address, the live
// feed, the formats and the avatars, in each column.
(function () {
  "use strict";
  function each(name, fn) { document.querySelectorAll('[data-tools="' + name + '"]').forEach(fn); }
  function theme(e) { return e.closest(".theme").dataset.theme; }
  function node(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* the filters' drawer of each column: open on a computer the first time, as the page has always shown it; on a phone
     it waits for its tab, since open it covers the page */
  document.querySelectorAll("[data-drawer]").forEach(function (layout) {
    var name = layout.getAttribute("data-drawer"), first = true;
    try { first = localStorage.getItem(name) == null; } catch (e) { first = true; }
    var d = ds.drawer(layout);
    if (d && first && !window.matchMedia("(max-width: 768px)").matches) d.set(true);
  });

  /* the sources' state: one line that says it all, opening on a row per source */
  each("status", function (footer) {
    ds.status(footer, { summary: "2 sources à jour sur 3", late: true, link: { href: "#", text: "Tout sur Render ↗" }, rows: [
      { icon: "wallet", name: "BoursoBank", state: "lu à 6h02", every: "4 fois par jour", ok: true },
      { icon: "wallet", name: "Fortuneo", state: "⚠ code demandé", every: "chaque matin", ok: false, detail: "Ouvre la page et tape le code." },
      { icon: "wallet", name: "Revolut", state: "lu à 6h04", every: "4 fois par jour", ok: true }] });
  });

  /* the syncs of a settings page: their state in a dot (and in words for a screen reader), what they did, their buttons */
  each("jobs", function (holder) {
    var t = theme(holder);
    ds.jobs(holder, [
      { key: "demo-banks-" + t, label: "Lecture des banques · 4 fois par jour", state: true, when: "Dernier passage il y a 50 min · prochain dans 10 min",
        summary: "7 comptes lus, sans erreur", run: function () { return new Promise(function (ok) { setTimeout(ok, 1200); }); } },
      { key: "demo-notion-" + t, label: "Notion · toutes les 5 minutes", state: false, when: "Dernier passage il y a 3 min", summary: "Notion ne répond pas", bad: true },
      { key: "demo-relay-" + t, label: "Relais de l’ODROID · chaque matin à 5h45", state: null, when: "Rien reçu pour l’instant" }]);
  });

  /* the address after #: what the page reads of it, a link that writes it without jumping, and a card found again */
  var routes = document.querySelectorAll('[data-tools="route"]');
  function shown(r) {
    var said = r.parts.length ? r.parts.join(" / ") + (Object.keys(r.query).length ? " · " + JSON.stringify(r.query) : "") : "—";
    routes.forEach(function (c) { c.textContent = said; });
  }
  // a link changes the address: ds.route reads it; ds.route.go writes it quietly, the page saying itself what it shows
  if (routes.length) ds.route(shown);
  document.querySelectorAll("[data-tools-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      var raw = b.getAttribute("data-tools-go"), q = raw.indexOf("?"), query = {}, parts;
      (q >= 0 ? raw.slice(q + 1) : "").split("&").filter(Boolean).forEach(function (p) { var i = p.indexOf("="); query[p.slice(0, i)] = p.slice(i + 1); });
      parts = (q >= 0 ? raw.slice(0, q) : raw).split("/").filter(Boolean);
      ds.route.go(parts, query);
      shown({ parts: parts, query: query });
    });
  });
  document.querySelectorAll("[data-studio=\"calendar\"]").forEach(function (cal) { cal.closest(".card").setAttribute("data-anchor", "agenda-" + theme(cal)); });
  document.querySelectorAll("[data-tools-seek]").forEach(function (b) {
    b.addEventListener("click", function () { ds.seek("agenda-" + theme(b)); });
  });

  /* the live feed: what the server sends, as it comes; a page served without a server (this one, on line) waits and
     tries again by itself */
  var streams = {};
  each("stream", function (b) {
    var t = theme(b), list = b.closest(".card").querySelector('[data-tools="streamed"]');
    function say(text) {
      var li = node("li");
      li.append(node("span", "row-date", ds.time(new Date().toISOString())), node("span", "row-place", text));
      list.prepend(li);
      while (list.children.length > 5) list.lastChild.remove();
    }
    b.addEventListener("click", function () {
      if (streams[t]) { streams[t].close(); streams[t] = null; b.textContent = "Suivre le serveur"; say("Arrêté."); return; }
      say("En attente du serveur…");
      streams[t] = ds.stream("demos/stream", { tick: function (d) { say("Reçu : " + (d && d.text ? d.text : JSON.stringify(d))); } },
        { open: function () { say("Relié au serveur."); } });
      b.textContent = "Arrêter";
    });
  });

  /* the formats: dates in Paris's time, figures in French, a time in words */
  var now = Date.now();
  var formats = [
    ["ds.date(\"2026-11-09\")", ds.date("2026-11-09")],
    ["ds.date(\"2026-11-09\", \"day\")", ds.date("2026-11-09", "day")],
    ["ds.time(\"2026-11-09T08:05:00Z\")", ds.time("2026-11-09T08:05:00Z")],
    ["ds.when(il y a 5 min)", ds.when(new Date(now - 5 * 60000).toISOString())],
    ["ds.ago(il y a 3 h)", ds.ago(new Date(now - 3 * 3600000).toISOString())],
    ["ds.soon(dans 2 h)", ds.soon(new Date(now + 2 * 3600000).toISOString())],
    ["ds.number(1234.5)", ds.number(1234.5)],
    ["ds.money(-12.3, {signed: true})", ds.money(-12.3, { signed: true })],
    ["ds.percent(0.1234, {decimals: 1})", ds.percent(0.1234, { decimals: 1 })],
    ["ds.compact(1234567)", ds.compact(1234567)],
    ["ds.today()", ds.today()]];
  each("formats", function (list) {
    formats.forEach(function (f) {
      var li = node("li");
      li.append(node("code", "row-title", f[0]), node("span", "row-value", f[1]));
      list.append(li);
    });
  });

  /* the logos with their initial */
  each("avatars", function (row) {
    ["BoursoBank", "Revolut", "Fortuneo", "Hello bank!"].forEach(function (name) { row.append(ds.avatar(null, { name: name })); });
  });
})();
