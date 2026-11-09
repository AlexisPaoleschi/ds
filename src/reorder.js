/* ds.reorder(list, {item, handle, onEnd}): the items of list, put in another order by their grip (src/reorder.css).
   item: what an item is among list's children (a selector; all of them by default); handle: its grip (".grip").
   With the mouse or a finger, the item follows the pointer and the others make room for it; near the top or the
   bottom of the screen the page scrolls along. With the keyboard, ↑ and ↓ on a grip move its item by one.
   A list inside an item (the accounts of a bank) is a list of its own: call ds.reorder on it too; each grip moves the
   item of its own list only. onEnd(items, item) once an item has landed somewhere else: the items in their new order
   (read their data-key), and the one that moved. Returns {items()}; called again on the same list it gives the same. */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find;
  var WORDS = _.table({ fr: { move: "Déplacer" }, en: { move: "Move" } });
  function words() { return _.words(WORDS); }
  // the neighbours move at once in the page, then slide from where they were to where they are
  function slide(els, move) {
    var before = els.map(function (el) { return el.offsetTop; });
    move();
    els.forEach(function (el, i) {
      var delta = before[i] - el.offsetTop;
      if (!delta) return;
      el.classList.remove("is-shifting");
      el.style.transform = "translateY(" + delta + "px)";
      void el.offsetWidth;
      el.classList.add("is-shifting");
      el.style.transform = "";
      clearTimeout(el._dsSlide);
      el._dsSlide = setTimeout(function () { el.classList.remove("is-shifting"); }, 450);
    });
  }
  function reorder(list, o) {
    list = find(list);
    if (!list) return null;
    if (list._dsReorder) { if (o) list._dsReorder.o = o; return list._dsReorder; }
    var r = { o: o || {} }, d = null;
    list._dsReorder = r;
    list.setAttribute("data-reorder", "");
    function handle() { return r.o.handle || ".grip"; }
    function isItem(c) { return c && c.parentNode === list && (!r.o.item || c.matches(r.o.item)); }
    r.items = function () { return [].filter.call(list.children, isItem); };
    function next(it) { var c = it.nextElementSibling; while (c && !isItem(c)) c = c.nextElementSibling; return c; }
    function prev(it) { var c = it.previousElementSibling; while (c && !isItem(c)) c = c.previousElementSibling; return c; }
    // a grip of this list, not of a list inside one of its items
    function grip(target) {
      var h = target.closest && target.closest(handle());
      return h && h.closest("[data-reorder]") === list ? h : null;
    }
    function itemOf(h) { var c = h; while (c && c.parentNode !== list) c = c.parentNode; return isItem(c) ? c : null; }
    function name() {
      list.querySelectorAll(handle()).forEach(function (h) { if (h.closest("[data-reorder]") === list && !h.hasAttribute("aria-label")) h.setAttribute("aria-label", words().move); });
    }
    function done(it) { if (r.o.onEnd) r.o.onEnd(r.items(), it); }
    // where the dragged item should be: under the pointer, within the list; the neighbours it passed go the other way
    function place() {
      var it = d.it, all = r.items(), h = it.offsetHeight;
      var want = d.top + (d.last + window.scrollY) - (d.y + d.sy);
      var low = Math.min.apply(null, all.map(function (x) { return x.offsetTop; }));
      var high = Math.max.apply(null, all.map(function (x) { return x.offsetTop + x.offsetHeight; })) - h;
      want = Math.max(low, Math.min(high, want));
      // a neighbour gives way once the item's far edge passes its middle, whatever their heights (a bank and its
      // accounts past a bank with a single one)
      var sib;
      while ((sib = next(it)) && want + h > sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it); });
      while ((sib = prev(it)) && want < sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it.nextSibling); });
      it.style.transform = "translateY(" + (want - it.offsetTop) + "px)";
    }
    function move(e) { if (d && e.pointerId === d.id) { d.last = e.clientY; place(); } }
    // near an edge of the screen, the page scrolls along with the item
    function edge() {
      if (!d) return;
      var zone = 56, v = 0;
      if (d.last < zone) v = -Math.ceil((zone - d.last) / 4);
      else if (d.last > window.innerHeight - zone) v = Math.ceil((d.last - window.innerHeight + zone) / 4);
      if (v) { window.scrollBy(0, v); place(); }
      d.raf = requestAnimationFrame(edge);
    }
    function end() {
      if (!d) return;
      var x = d;
      d = null;
      cancelAnimationFrame(x.raf);
      ["pointermove", "pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { x.h.removeEventListener(t, t === "pointermove" ? move : end); });
      x.it.classList.remove("is-dragging");
      x.it.classList.add("is-shifting");
      x.it.style.transform = "";
      setTimeout(function () { x.it.classList.remove("is-shifting"); }, 450);
      document.documentElement.classList.remove("is-reordering");
      var now = r.items();
      if (now.some(function (it, i) { return it !== x.order[i]; })) done(x.it);
    }
    list.addEventListener("pointerdown", function (e) {
      if (d || (e.pointerType === "mouse" && e.button !== 0)) return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      d = { it: it, h: h, id: e.pointerId, y: e.clientY, last: e.clientY, sy: window.scrollY, top: it.offsetTop, order: r.items(), raf: 0 };
      try { h.setPointerCapture(e.pointerId); } catch (err) {}
      it.classList.remove("is-shifting");
      it.classList.add("is-dragging");
      document.documentElement.classList.add("is-reordering");
      h.addEventListener("pointermove", move);
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { h.addEventListener(t, end); });
      d.raf = requestAnimationFrame(edge);
    });
    list.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      var up = e.key === "ArrowUp", sib = up ? prev(it) : next(it);
      if (!sib) return;
      // the neighbour moves, not the item, so that its grip keeps the focus
      slide([sib, it], function () { list.insertBefore(sib, up ? it.nextSibling : it); });
      done(it);
    });
    list.addEventListener("focusin", name);
    name();
    return r;
  }
  window.ds = window.ds || {};
  window.ds.reorder = reorder;
})();
