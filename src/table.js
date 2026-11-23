/* The behaviour of the table of src/table.css.
   ds.sortable(table, {by, up, key, menu, onSort}) sorts it by its column titles, <th><button class="sort"
   data-sort="date">Date</button></th>. A click on a title sorts by that column; again, the other way. A new column
   starts the way one expects: names from A, figures and dates from the biggest and latest (or as its data-first says,
   "up" or "down"). The th in use carries aria-sort, which draws its arrow.
     by, up: the column and the way to start with (up: from the smallest, A, the oldest), unless the device remembers
     another choice under key (localStorage, as [by, up]); menu: a <select> that sorts too, the phone's menu, whose
     options say "by|1" (up) or "by|0" (down); it follows the titles and the titles follow it.
     onSort(by, up): the page sorts its own list and draws it again (it holds more rows than are shown, say); without
     it, the rows of the tbody are put in order here, by each cell's data-value or else its text, figures as figures,
     names in French order, empty cells last whichever the way.
   Returns {by, up, set(by, up)}; called again on the same table it gives the same, so a page that draws its table anew
   (Studio) calls it again on the new one and finds its choice under key.
   ds.selection, which picks rows, is in ds.js (selection.js) since 4.21.0: tiles of photos use it too. */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find;
  function store(key, v) { window.ds.store.set(key, v); }
  function stored(key) { return window.ds.store.get(key, null); }

  // a cell's place in its row, its colspans counted, and the cell at that place in another row
  function place(cell) {
    var at = 0, c = cell.parentNode.firstElementChild;
    for (; c && c !== cell; c = c.nextElementSibling) at += c.colSpan || 1;
    return at;
  }
  function cellAt(row, at) {
    for (var c = row.firstElementChild, n = 0; c; c = c.nextElementSibling) {
      n += c.colSpan || 1;
      if (n > at) return c;
    }
    return null;
  }
  // what a cell holds: its data-value, else its text; « −1 234,50€ » and « 12% » are figures
  function value(cell) {
    if (!cell) return null;
    var raw = cell.hasAttribute("data-value") ? cell.getAttribute("data-value") : cell.textContent;
    raw = raw.trim();
    if (!raw) return null;
    var n = raw.replace(/[\s  €%]/g, "").replace(/^\+/, "").replace(/^[−–]/, "-").replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(n) ? parseFloat(n) : raw;
  }
  var ISO = /^\d{4}-\d{2}(-\d{2})?/;

  function sortable(table, o) {
    table = find(table);
    if (!table) return null;
    if (table._dsSort) { if (o) table._dsSort.o = o; return table._dsSort; }
    var s = { table: table, o: o || {}, by: null, up: false };
    table._dsSort = s;
    var saved = s.o.key ? stored(s.o.key) : null;
    if (saved && saved.length === 2) { s.by = saved[0]; s.up = !!saved[1]; }
    else if (s.o.by) { s.by = s.o.by; s.up = !!s.o.up; }
    function buttons() { return [].slice.call(table.querySelectorAll("thead .sort[data-sort]")); }
    function button(by) { return buttons().filter(function (b) { return b.getAttribute("data-sort") === by; })[0]; }
    function rows() { return [].slice.call(table.tBodies).reduce(function (all, b) { return all.concat([].slice.call(b.rows)); }, []); }
    // a new column's first way: its data-first, else from the biggest for figures and dates, from A for words
    function first(b) {
      var f = b.getAttribute("data-first");
      if (f) return f === "up";
      var at = place(b.closest("th")), list = rows();
      for (var i = 0; i < list.length; i++) {
        var v = value(cellAt(list[i], at));
        if (v != null) return typeof v === "string" && !ISO.test(v);
      }
      return false;
    }
    function mark() {
      buttons().forEach(function (b) {
        var on = b.getAttribute("data-sort") === s.by;
        b.closest("th").setAttribute("aria-sort", on ? (s.up ? "ascending" : "descending") : "none");
      });
      var menu = find(s.o.menu), v = s.by + "|" + (s.up ? 1 : 0);
      if (menu && [].some.call(menu.options, function (x) { return x.value === v; })) {
        menu.value = v;
        if (window.ds.pills && menu.closest(".pill")) window.ds.pills(menu.closest(".pill"));
      }
    }
    function order() {
      var b = button(s.by);
      if (!b) return;
      var at = place(b.closest("th")), way = s.up ? 1 : -1;
      [].forEach.call(table.tBodies, function (body) {
        var list = [].slice.call(body.rows).map(function (r, i) { return { r: r, v: value(cellAt(r, at)), i: i }; });
        list.sort(function (a, z) {
          if (a.v == null || z.v == null) return a.v == null && z.v == null ? a.i - z.i : a.v == null ? 1 : -1;
          var c = typeof a.v === "number" && typeof z.v === "number" ? a.v - z.v : window.ds.text.compare(String(a.v), String(z.v));
          // the same value: as they came
          return c ? c * way : a.i - z.i;
        });
        list.forEach(function (x) { body.appendChild(x.r); });
      });
    }
    s.set = function (by, up) {
      s.by = by;
      s.up = !!up;
      if (s.o.key) store(s.o.key, [s.by, s.up]);
      mark();
      if (s.o.onSort) s.o.onSort(s.by, s.up); else order();
      return s;
    };
    table.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("thead .sort[data-sort]");
      if (!b || !table.contains(b)) return;
      var by = b.getAttribute("data-sort");
      s.set(by, by === s.by ? !s.up : first(b));
    });
    // the menu sorts the last table given to it: a page that draws its table anew keeps one menu, and one listener
    var menu = find(s.o.menu);
    if (menu) {
      if (!menu._dsSort) menu.addEventListener("change", function () {
        var parts = menu.value.split("|");
        if (parts[0]) menu._dsSort.set(parts[0], parts[1] === "1");
      });
      menu._dsSort = s;
    }
    // drawn as chosen from the start; a page that sorts itself has drawn its list already
    mark();
    if (s.by && !s.o.onSort) order();
    return s;
  }

  window.ds = window.ds || {};
  window.ds.sortable = sortable;
})();
