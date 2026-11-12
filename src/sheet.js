/* ds.sheet(el, {onOpen, onClose}): the sheet of src/sheet.css, its veil el (<div class="sheet" hidden>) around its
   .sheet-panel. Returns {open(from), close(), toggle(), isOpen}; called again on the same el, it gives the same sheet.
   Opening it moves the focus into the panel, and Tab stays there; closing gives the focus back to what had it (or to
   from, e.g. the row that opened it). Escape, a click on the veil, its cross (.sheet-close) or a [data-sheet-close] close
   it: the last one opened first, and a window of ds.confirm over it keeps its own Escape. On a phone the page behind
   does not scroll while it is open (sheet.css). */
(function () {
  "use strict";
  var _ = window.ds._;
  function sheet(el, opts) {
    el = _.find(el);
    if (!el) return null;
    if (el._dsSheet) { if (opts) el._dsSheet.opts = opts; return el._dsSheet; }
    var panel = el.querySelector(".sheet-panel") || el, s = { el: el, panel: panel, opts: opts || {}, isOpen: false, before: null };
    // open, a layer: Escape closes it, the last one opened first, and Tab goes round inside it while the focus is in it
    // (a picker's list floating outside it keeps its own keys)
    var cover = { el: panel, loose: true, close: function () { s.close(); } };
    el._dsSheet = s;
    panel.setAttribute("tabindex", "-1");
    el.querySelectorAll(".sheet-close").forEach(function (x) { if (!x.hasAttribute("aria-label")) x.setAttribute("aria-label", _.words().close); });
    s.open = function (from) {
      if (s.isOpen) return s;
      s.isOpen = true;
      s.before = from || document.activeElement;
      el.hidden = false;
      _.layer(cover);
      panel.scrollTop = 0;
      panel.focus({ preventScroll: true });
      if (s.opts.onOpen) s.opts.onOpen(s);
      return s;
    };
    s.close = function () {
      if (!s.isOpen) return s;
      s.isOpen = false;
      el.hidden = true;
      _.unlayer(cover);
      var back = s.before;
      s.before = null;
      // what opened it may be gone, drawn again while the sheet was open: then the focus stays where the page puts it
      if (back && back.focus && back.isConnected) back.focus({ preventScroll: true });
      if (s.opts.onClose) s.opts.onClose(s);
      return s;
    };
    s.toggle = function (from) { return s.isOpen ? s.close() : s.open(from); };
    el.addEventListener("click", function (e) {
      if (e.target === el || (e.target.closest && e.target.closest(".sheet-close, [data-sheet-close]"))) s.close();
    });
    return s;
  }
  window.ds = window.ds || {};
  window.ds.sheet = sheet;
})();
