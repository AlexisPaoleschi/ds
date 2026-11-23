/* Picking rows or tiles, in ds.js since 4.21.0 (it was in ds-tools.js, for tables only).
   ds.selection(holder, {bar, count, sum, onPick, cls}) picks rows (or tiles): each one of holder with a data-key and its
   box, <input type="checkbox" class="sel-box"> or <button class="box sel-box" aria-pressed> (a photo's, button.box.on-photo); a click on a box picks or drops its row, a shift-click the rows since the
   last box; a picked row is cls (.is-selected unless given: a photo's is .is-picked); the box .sel-all picks every row shown, half-ticked when some are. A picked row is .is-selected. bar: the
   .selbar (else the one in holder), shown while something is picked, its .selbar-n saying how many (count(n), in
   words), its .selbar-sum what they add up to (sum(keys), a text the page gives: « −128,40 € »), its [data-sel-clear]
   dropping all. A group's head (a day's row in a list by day) may hold a box .sel-group: it picks, or drops, the rows
   under it up to the next head, half-ticked when some are (4.1.0). The choice is kept by key, so a list drawn again
   keeps it: call paint().
   Returns {keys(), has(key), set(key, on), clear(), paint()}; onPick(keys) after each change. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._, find = _.find;
  var WORDS = _.table({
    fr: { picked: function (n) { return n + (n > 1 ? " lignes choisies" : " ligne choisie"); } },
    en: { picked: function (n) { return n + (n > 1 ? " rows selected" : " row selected"); } }
  });
  function words() { return _.words(WORDS); }
  function selection(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    if (holder._dsSel) { if (o) holder._dsSel.o = o; return holder._dsSel; }
    var sel = { o: o || {}, picked: new Set(), last: null };
    holder._dsSel = sel;
    function bar() { return find(sel.o.bar) || holder.querySelector(".selbar"); }
    function rows() { return [].filter.call(holder.querySelectorAll("[data-key]"), function (r) { return r.querySelector(".sel-box"); }); }
    function cls() { return sel.o.cls || "is-selected"; }
    // a box is a checkbox, or a button pressed or not
    function tick(box, on) { if (box.type === "checkbox") box.checked = on; else box.setAttribute("aria-pressed", on ? "true" : "false"); }
    function changed() { sel.paint(); if (sel.o.onPick) sel.o.onPick(sel.keys()); }
    // a group's rows: those after its head, up to the next head
    function groupRows(box) {
      var head = box.closest("tr, li, [data-sel-head]"), out = [];
      for (var r = head && head.nextElementSibling; r && !r.querySelector(".sel-group"); r = r.nextElementSibling) {
        if (r.hasAttribute("data-key") && r.querySelector(".sel-box")) out.push(r);
      }
      return out;
    }
    sel.keys = function () { return Array.from(sel.picked); };
    sel.has = function (key) { return sel.picked.has(String(key)); };
    sel.set = function (key, on) { if (on) sel.picked.add(String(key)); else sel.picked.delete(String(key)); changed(); return sel; };
    sel.clear = function () { sel.picked.clear(); sel.last = null; changed(); return sel; };
    sel.paint = function () {
      var list = rows(), shown = 0;
      list.forEach(function (r) {
        var on = sel.picked.has(r.getAttribute("data-key"));
        r.classList.toggle(cls(), on);
        tick(r.querySelector(".sel-box"), on);
        if (on) shown++;
      });
      var all = holder.querySelector(".sel-all");
      if (all) { all.checked = list.length > 0 && shown === list.length; all.indeterminate = shown > 0 && shown < list.length; }
      [].forEach.call(holder.querySelectorAll(".sel-group"), function (g) {
        var rs = groupRows(g), n = rs.filter(function (r) { return sel.picked.has(r.getAttribute("data-key")); }).length;
        g.checked = rs.length > 0 && n === rs.length;
        g.indeterminate = n > 0 && n < rs.length;
      });
      var b = bar(), n = sel.picked.size;
      if (b) {
        b.hidden = !n;
        var count = b.querySelector(".selbar-n"), sum = b.querySelector(".selbar-sum");
        if (count) count.textContent = (sel.o.count || words().picked)(n);
        if (sum) sum.textContent = n && sel.o.sum ? sel.o.sum(sel.keys()) || "" : "";
      }
      return sel;
    };
    holder.addEventListener("click", function (e) {
      var box = e.target.closest && e.target.closest(".sel-box");
      if (!box || !holder.contains(box)) return;
      var list = rows(), row = box.closest("[data-key]"), keys = list.map(function (r) { return r.getAttribute("data-key"); });
      var i = list.indexOf(row), j = sel.last == null ? -1 : keys.indexOf(sel.last);
      // a button's state is the page's: pressing it turns its row the other way
      var on = box.type === "checkbox" ? box.checked : !sel.picked.has(row.getAttribute("data-key"));
      // shift-click picks, or drops, the whole range since the last box
      var span = e.shiftKey && j >= 0 ? list.slice(Math.min(i, j), Math.max(i, j) + 1) : [row];
      span.forEach(function (r) { if (on) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      sel.last = row.getAttribute("data-key");
      changed();
    });
    holder.addEventListener("change", function (e) {
      var cl = e.target.classList;
      if (!cl || !(cl.contains("sel-all") || cl.contains("sel-group"))) return;
      (cl.contains("sel-all") ? rows() : groupRows(e.target)).forEach(function (r) {
        if (e.target.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key"));
      });
      changed();
    });
    // « Annuler » in the bar, wherever the bar is
    document.addEventListener("click", function (e) {
      var b = bar(), x = e.target.closest && e.target.closest("[data-sel-clear]");
      if (x && b && b.contains(x)) sel.clear();
    });
    sel.paint();
    return sel;
  }
  ds.selection = selection;
})();
