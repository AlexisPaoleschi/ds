// The showcase demos of Bank's components (index.html): what makes them move.
// Each theme's column has its own copy of the demos, so everything is set up once per column.
(function () {
  "use strict";
  var CATS = [
    ["Courses", "var(--c-vert)", [["Supermarché", "cart"], ["Marché", "bag"], ["Boucherie", "food"]]],
    ["Loisirs", "var(--c-corail)", [["Restaurant", "food"], ["Bar", "wine"], ["Cinéma", "ticket-film"]]],
    ["Déplacements", "var(--c-bleu)", [["Train", "train"], ["Carburant", "fuel"], ["Péage", "car"]]],
    ["Logement", "var(--c-violet)", [["Loyer", "home"], ["Électricité", "zap"]]],
    ["Soins", "var(--c-turquoise)", [["Médecin", "health"], ["Pharmacie", "pill"]]]
  ];
  var BANKS = [["BoursoBank", "var(--c-rose)", true], ["Boursorama", "var(--c-rose)"], ["Crédit Agricole", "var(--c-emeraude)"], ["BNP Paribas", "var(--c-vert)"],
    ["Société Générale", "var(--c-rouge)"], ["LCL", "var(--c-bleu)"], ["Caisse d’Epargne", "var(--c-rouge)"], ["Crédit Mutuel", "var(--c-bleu)"],
    ["La Banque Postale", "var(--c-jaune)"], ["Hello bank!", "var(--c-bleu)"], ["Fortuneo", "var(--c-vert)", true], ["Revolut", "var(--c-ciel)", true],
    ["N26", "var(--c-turquoise)"], ["Qonto", "var(--c-violet)"], ["Shine", "var(--c-ardoise)"], ["Monabanq", "var(--c-orange)"]];
  var POPULAR = ["BoursoBank", "Crédit Agricole", "BNP Paribas", "Société Générale", "LCL", "Caisse d’Epargne", "La Banque Postale", "Fortuneo"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function column(col, n) {
    var ops = col.querySelector('[data-b="ops"]'), table = ops.querySelector("table.tbl");
    // the table: sorted by its titles, or by the pill on a phone; a box per row, the bar over the list
    ds.sortable(table, { by: "date", up: false, menu: ops.querySelector('[data-b="sortmenu"]') });
    var sel = ds.selection(ops, { count: function (k) { return k + (k > 1 ? " opérations choisies" : " opération choisie"); } });
    sel.set("op1", true);
    ops.querySelector('[data-b="bulkcat"]').addEventListener("change", function (e) {
      if (!e.target.value) return;
      ds.toast({ type: "good", text: e.target.value + " pour " + sel.keys().length + " opérations" });
      e.target.value = "";
      sel.clear();
    });
    ops.querySelector('[data-b="bulkname"]').addEventListener("click", function () {
      ds.confirm({ title: "Nom à donner aux " + sel.keys().length + " opérations", text: "Vide : nom automatique.", value: "", ok: "Renommer" });
    });
    // a row opens its sheet
    var sheetEl = ops.querySelector('[data-b="sheet"]'), sheet = ds.sheet(sheetEl), title = "b-sheet-t-" + n;
    sheetEl.querySelector(".sheet-panel").setAttribute("aria-labelledby", title);
    function open(tr, from) {
      var cells = tr.cells, name = cells[2].firstChild.textContent, amount = cells[5].textContent, good = cells[5].classList.contains("is-good");
      var day = ds.date(cells[1].getAttribute("data-value"), "weekday") + " 2026";
      sheetEl.querySelector('[data-b="sheetbody"]').innerHTML =
        '<p class="sheet-sub">' + esc(day) + '</p><h2 class="sheet-t" id="' + title + '">' + esc(name) + '</h2>' +
        '<p class="sheet-fig' + (good ? " is-good" : "") + '">' + esc(amount) + '</p><dl class="kv">' +
        '<div><dt>Catégorie</dt><dd>' + esc(cells[4].textContent) + '</dd></div>' +
        '<div><dt>Compte</dt><dd>' + cells[3].innerHTML + '</dd></div>' +
        '<div><dt>Libellé de la banque</dt><dd class="is-mono">CB ' + esc(name.toUpperCase()) + '</dd></div>' +
        '<div><dt>Note</dt><dd><textarea rows="2" placeholder="Une note sur cette opération" aria-label="Note"></textarea></dd></div></dl>' +
        '<div class="sheet-acts"><button class="btn is-act" type="button">Renommer</button><button class="btn is-save" type="button" data-sheet-close>Enregistrer</button>' +
        '<button class="btn" type="button" data-sheet-close>Historique</button></div>';
      sheet.open(from);
    }
    table.addEventListener("click", function (e) {
      var tr = e.target.closest("tbody tr");
      if (tr && !e.target.closest("input, button, select, a")) open(tr);
    });
    col.querySelector('[data-b="opensheet"]').addEventListener("click", function (e) { open(table.querySelector('tr[data-key="op1"]'), e.currentTarget); });

    // the pickers: a category for an operation, always open; a bank to connect, behind the dashed button
    var items = [];
    CATS.forEach(function (c) { c[2].forEach(function (s) { items.push({ value: c[0] + "|" + s[0], label: s[0], group: c[0], keywords: c[0], color: c[1], icon: s[1] }); }); });
    ds.picker(col.querySelector('[data-b="cats"]'), { items: items, value: "Loisirs|Restaurant", placeholder: "Chercher une catégorie…", limit: 8,
      first: ["Loisirs|Restaurant", "Loisirs|Bar", "Courses|Supermarché", "Déplacements|Train"],
      onPick: function (x) { ds.toast({ type: "good", text: x.group + " › " + x.label + " pour Tik Tak", action: { label: "Annuler", run: function () {} } }); } });
    var banks = ds.picker(col.querySelector('[data-b="banks"]'), { items: null, placeholder: "Chercher une banque…", first: POPULAR, limit: 8,
      opener: col.querySelector('[data-b="addbank"]'), empty: "Aucune banque ne correspond.",
      onPick: function (x) { ds.toast({ type: "info", text: (x.sub ? "Renouveler " : "Connecter ") + x.label + "…" }); } });
    // the list of banks comes from the server: a moment of « Chargement… » the first time
    col.querySelector('[data-b="addbank"]').addEventListener("click", function () {
      if (banks.items) return;
      setTimeout(function () {
        banks.set(BANKS.map(function (b) { return { value: b[0], label: b[0], color: b[1], initial: b[0].replace(/[^A-Za-zÀ-ÿ]/g, "").charAt(0).toUpperCase(),
          sub: b[2] ? "déjà reliée" : "", cta: b[2] ? "Renouveler →" : "Connecter →", href: "#" }; }));
      }, 600);
    });

    // the order of the accounts: the banks, and the accounts within each bank
    var order = col.querySelector('[data-b="order"]'), said = function () { ds.toast({ type: "good", text: "Ordre enregistré" }); };
    ds.reorder(order, { onEnd: said });
    order.querySelectorAll('[data-b="accs"]').forEach(function (list) { ds.reorder(list, { onEnd: said }); });
  }
  document.querySelectorAll("#themes > .theme").forEach(column);
})();
