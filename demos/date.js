// The showcase demos of the date picker and the new charts (index.html): what makes them move.
// Bank's operations and analysis, made up but drawn around today, the same in both columns.
(function () {
  "use strict";
  var P = ds.datePick, today = P.today(), month = P.of("month", today);
  // the same made-up figures on every visit: a seeded draw
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function node(name, cls, text) { var e = document.createElement(name); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function monthsAgo(n) { return P.step(month, -n).from.slice(0, 7); }
  function euros(n, signed) { return ds.money(n, { decimals: 0, signed: signed }); }

  /* the period of the operations: Bank's quick periods, every unit, nothing before 2017 or after today */
  var QUICK = [
    { label: "Toutes les dates" },
    { label: "Ce mois-ci", from: month.from, to: month.to },
    { label: "Le mois dernier", from: P.step(month, -1).from, to: P.step(month, -1).to },
    { label: "3 derniers mois", from: monthsAgo(2) + "-01", to: month.to },
    { label: "12 derniers mois", from: monthsAgo(11) + "-01", to: month.to },
    { label: "Cette année", from: today.slice(0, 4) + "-01-01", to: today.slice(0, 4) + "-12-31" }
  ];

  /* a month's spending by category, and a few of its operations */
  var CATS = [["logement", "Logement", "--c-violet", [["05", "Loyer", 850], ["18", "EDF", 64.2]]],
    ["courses", "Courses", "--c-vert", [["12", "Magasins U", 119.89], ["03", "Marché des Halles", 38.5], ["21", "Biocoop", 47.1]]],
    ["loisirs", "Loisirs", "--c-corail", [["10", "Tik Tak", 38.5], ["14", "Cinéma Pathé", 24]]],
    ["deplacements", "Déplacements", "--c-bleu", [["12", "SNCF Connect", 64.3], ["08", "Total Énergies", 72.4]]],
    ["soins", "Soins", "--c-turquoise", [["06", "Pharmacie du Port", 18.9]]]];
  function spending(ym) {
    var seed = +ym.slice(0, 4) * 12 + +ym.slice(5, 7);
    return CATS.map(function (c, i) {
      var ops = c[3].map(function (o, j) { return { day: o[0], name: o[1], value: Math.round(o[2] * (0.7 + rnd(seed * 7 + i * 3 + j) * 0.6) * 100) / 100 }; });
      return { key: c[0], label: c[1], color: c[2], ops: ops, value: ops.reduce(function (s, o) { return s + o.value; }, 0) };
    }).sort(function (a, b) { return b.value - a.value; });
  }

  /* a year of money in and out, month by month; the month under way is hatched */
  var flows = [];
  for (var m = 11; m >= 0; m--) {
    var k = monthsAgo(m), income = Math.round(3200 + rnd(m + 5) * 450 + (m === 5 ? 1800 : 0)), out = Math.round(2300 + rnd(m + 31) * 1300);
    if (m === 0) { income = Math.round(income * 0.9); out = Math.round(out * 0.45); }
    flows.push({ key: k, income: income, spending: out, live: m === 0 });
  }

  function column(col) {
    // the period head: its title opens the picker, the arrows step by the period's own length and go where it ends
    var title = col.querySelector('[data-date="title"]'), lab = col.querySelector('[data-date="label"]'), read = col.querySelector('[data-date="read"]');
    var prev = col.querySelector('[data-date="prev"]'), next = col.querySelector('[data-date="next"]');
    var dp = ds.datePick(col.querySelector('[data-date="pop"]'), { value: month, quick: QUICK, min: "2017-01-01", max: today, opener: title, onPick: said });
    function said() {
      var v = dp.get();
      lab.textContent = capital(dp.label());
      prev.classList.toggle("off", !dp.canStep(-1));
      next.classList.toggle("off", !dp.canStep(1));
      read.textContent = v.from ? "La page lit du " + ds.date(v.from, "short") + " au " + ds.date(v.to, "short") + "." : "La page lit toutes les opérations.";
    }
    prev.addEventListener("click", function () { dp.step(-1); });
    next.addEventListener("click", function () { dp.step(1); });
    said();

    // a trip's dates, in the page: two taps, the first day then the last
    var tripRead = col.querySelector('[data-date="trip-read"]');
    var trip = ds.datePick(col.querySelector('[data-date="trip"]'), { modes: ["range"], value: { from: "2026-08-01", to: "2026-08-16" }, min: "2017-01-01", label: "Dates du voyage",
      onPick: function (v) { tripRead.textContent = v.label; ds.toast({ type: "good", text: "Vendée 2026 : " + v.label }); } });
    tripRead.textContent = trip.label();

    // the spending of a month: a slice opens its operations below
    var menu = col.querySelector('[data-date="pie-month"]'), pie = col.querySelector('[data-date="pie"]'), ops = col.querySelector('[data-date="pie-ops"]');
    [0, 1, 2].forEach(function (n) { var o = node("option", "", ds.date(monthsAgo(n), "month")); o.value = monthsAgo(n); menu.append(o); });
    ds.pills(menu.closest(".pill"));
    function drawPie() {
      var rows = spending(menu.value);
      ops.replaceChildren();
      ds.chart.donut(pie, rows, { format: function (n) { return ds.money(n); }, center: "dépensés", pick: function (key) {
        var c = rows.filter(function (r) { return r.key === key; })[0];
        ops.replaceChildren.apply(ops, c ? c.ops.map(function (o) {
          var li = node("li");
          li.append(node("span", "t", o.day + "/" + menu.value.slice(5)), node("span", "ttl", o.name), node("span", "v", ds.money(-o.value)));
          return li;
        }) : []);
      } });
    }
    menu.addEventListener("change", drawPie);
    drawPie();

    // money in and out: a month chosen says what was left
    var flowsRead = col.querySelector('[data-date="flows-read"]');
    function month1(key) {
      var x = flows.filter(function (f) { return f.key === key; })[0];
      flowsRead.textContent = capital(ds.date(key, "month")) + (x.live ? " (en cours)" : "") + " : entrées " + euros(x.income) + ", sorties " + euros(x.spending) + ", reste " + euros(x.income - x.spending, true) + ".";
    }
    ds.chart.bars(col.querySelector('[data-date="flows"]'), flows, { pairs: [{ key: "income", label: "Entrées", color: "--good" }, { key: "spending", label: "Sorties", color: "--bad" }],
      unit: "€", format: euros, selected: flows[11].key, pick: month1 });
    month1(flows[11].key);
  }
  document.querySelectorAll("#themes > .theme").forEach(column);
})();
