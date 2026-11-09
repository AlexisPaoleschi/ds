/* ds.sheet(el, {onOpen, onClose}): the sheet of src/sheet.css, its veil el (<div class="sheet" hidden>) around its
   .sheet-panel. Returns {open(from), close(), toggle(), isOpen}; called again on the same el, it gives the same sheet.
   Opening it moves the focus into the panel, and Tab stays there; closing gives the focus back to what had it (or to
   from, e.g. the row that opened it). Escape, a click on the veil, its cross (.sheet-x) or a [data-sheet-close] close
   it: the last one opened first, and a window of ds.confirm over it keeps its own Escape. On a phone the page behind
   does not scroll while it is open (sheet.css). */
(function () {
  "use strict";
  var WORDS = { fr: { close: "Fermer" }, en: { close: "Close" } };
  function words() { return /^en\b/i.test(document.documentElement.lang || "") ? WORDS.en : WORDS.fr; }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  // the sheets open, the last one on top
  var stack = [];
  function focusables(panel) {
    return [].filter.call(panel.querySelectorAll(FOCUSABLE), function (x) { return x.getClientRects().length > 0; });
  }
  function sheet(el, opts) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) return null;
    if (el._dsSheet) { if (opts) el._dsSheet.opts = opts; return el._dsSheet; }
    var panel = el.querySelector(".sheet-panel") || el, s = { el: el, panel: panel, opts: opts || {}, isOpen: false, before: null };
    el._dsSheet = s;
    panel.setAttribute("tabindex", "-1");
    el.querySelectorAll(".sheet-x").forEach(function (x) { if (!x.hasAttribute("aria-label")) x.setAttribute("aria-label", words().close); });
    s.open = function (from) {
      if (s.isOpen) return s;
      s.isOpen = true;
      s.before = from || document.activeElement;
      el.hidden = false;
      stack.push(s);
      panel.scrollTop = 0;
      panel.focus({ preventScroll: true });
      if (s.opts.onOpen) s.opts.onOpen(s);
      return s;
    };
    s.close = function () {
      if (!s.isOpen) return s;
      s.isOpen = false;
      el.hidden = true;
      stack.splice(stack.indexOf(s), 1);
      var back = s.before;
      s.before = null;
      // what opened it may be gone, drawn again while the sheet was open: then the focus stays where the page puts it
      if (back && back.focus && back.isConnected) back.focus({ preventScroll: true });
      if (s.opts.onClose) s.opts.onClose(s);
      return s;
    };
    s.toggle = function (from) { return s.isOpen ? s.close() : s.open(from); };
    el.addEventListener("click", function (e) {
      if (e.target === el || (e.target.closest && e.target.closest(".sheet-x, [data-sheet-close]"))) s.close();
    });
    return s;
  }
  // on <html>, so that a field inside the sheet (a picker's search) takes its own Escape first, and before the
  // drawer's, which listens on the document: Escape closes what is on top, and only that
  document.documentElement.addEventListener("keydown", function (e) {
    var top = stack[stack.length - 1];
    if (!top || e.defaultPrevented || document.querySelector(".dialog-veil")) return;
    if (e.key === "Escape") { e.preventDefault(); top.close(); return; }
    if (e.key !== "Tab") return;
    // Tab goes round inside the sheet, as long as the focus is in it
    var panel = top.panel, list = focusables(panel), at = document.activeElement;
    if (!list.length || !panel.contains(at)) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (at === first || at === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  });
  window.ds = window.ds || {};
  window.ds.sheet = sheet;
})();
