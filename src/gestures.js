/* Gestures the apps wrote each for itself (the audit of 23 November 2026), in ds.js so that every app has them.
   ds.undo({undo, redo, run, key}): taking back the page's changes and making them again. remember(step) keeps a change
   ({label, …}, the latest first) and gives back the « Annuler » action of its bubble; Ctrl+Z (⌘Z) takes back the last
   one, Ctrl+Shift+Z or Ctrl+Y makes it again (a field keeps its own: in it, Ctrl+Z takes back what was typed); the two
   buttons, greyed when they have nothing to do, say what they would do. run(step, redo) asks the server and gives back
   (a promise of) the sentence of the bubble; one at a time, and a step that fails goes back on its list. The bubble is
   the same one throughout (key, the page's own key if it has one). Gives back {remember, undo, redo, clear}.
   ds.optimistic(id, {change, save, revert, done, fail, after}): a box ticked at once, saved after, and back if saving
   failed: change() at once, after() (the page drawn again), then save(); done() when it is kept, revert() and fail(e)
   (else a red bubble) when it is not, after() again. One at a time for each id: ds.optimistic.busy(id) tells.
   ds.copy(text, {said}): copied to the clipboard, « Copié » in a bubble (said); a button [data-copy="text"] or
   [data-copy="#an-element"] (its value or its text) copies without a script of its own, [data-copy-said] its words.
   ds.openAll(urls, {ask, title, text, ok}): each address in its own tab, the first one in front; more than ask (10),
   it asks first; tabs the browser blocked are counted and the bubble says how to let the page open them.
   ds.pop(button, panel, {onOpen, onClose}): a panel under a button of the top bar (.pop, .pop-panel): opened and closed
   by the button, closed by a click elsewhere or Escape (the focus back on the button). ds.pop.count(el, n): its figure,
   « 99+ » over 99, hidden at 0.
   ds.enter(el, {kind}) and ds.leave(el, {kind, remove}): an element (or several) that arrives or goes smoothly, kind
   "slide" (from a little above, the theme's quick duration) or "fade" (a tile that shrinks a little as it fades, the
   theme's middle duration); leave removes it at the end unless remove is false. Nothing moves when the device asks for
   less motion. Both give back a promise.
   ds.redraw(holder, signature, build, {key, scroll, focus}): build(holder) only when signature changed, so that a new
   read does not move a list under the finger; the scroll of scroll (the holder) is kept while key stays the same, the
   focus goes back to the element focus(holder, was) gives (else the one with the same id). ds.redraw.reset(holder).
   ds.highlight(root, selector, terms): the words looked for lit in the text of the elements (mark.hit), accents and
   capitals aside; a {t: "phrase", v} as written, whole words. ds.text.exact(phrase) is that phrase's pattern.
   ds.suggest(word, vocabulary, {room}): the nearest word of vocabulary (a Map of words and how often they come, or a
   list) a few letters away (1 up to 4 letters, 2 up to 8, 3 beyond), the most frequent among the nearest; null when none.
   ds.suggest.vocabulary(texts) makes that Map from texts (words of 3 letters or more, accents and capitals aside). */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  var WORDS = _.table({
    fr: { undo: "Annuler", redo: "Rétablir", noUndo: "Rien à annuler", noRedo: "Rien à rétablir", undoing: "Annulation…",
      redoing: "Rétablissement…", undone: "annulé", redone: "rétabli", undoFailed: "Annulation impossible : réessaie",
      redoFailed: "Rétablissement impossible : réessaie", notSaved: "Pas enregistré : réessaie.", copied: "Copié",
      notCopied: "Copie impossible : sélectionne le texte et copie-le toi-même.",
      tabs: function (n) { return "Ouvrir " + n + " onglets ?"; }, openThem: function (n) { return "Ouvrir les " + n; },
      blocked: function (n) { return "Le navigateur a bloqué " + (n > 1 ? n + " onglets" : "un onglet") +
        " : autorise les fenêtres pop-up pour ce site (l’icône au bout de la barre d’adresse), puis clique encore."; } },
    en: { undo: "Undo", redo: "Redo", noUndo: "Nothing to undo", noRedo: "Nothing to redo", undoing: "Undoing…",
      redoing: "Redoing…", undone: "undone", redone: "redone", undoFailed: "Could not undo: try again",
      redoFailed: "Could not redo: try again", notSaved: "Not saved: try again.", copied: "Copied",
      notCopied: "Could not copy: select the text and copy it yourself.",
      tabs: function (n) { return "Open " + n + " tabs?"; }, openThem: function (n) { return "Open all " + n; },
      blocked: function (n) { return "The browser blocked " + (n > 1 ? n + " tabs" : "a tab") +
        ": allow pop-up windows for this site (the icon at the end of the address bar), then click again."; } }
  });
  function list(x) {
    if (x == null) return [];
    if (typeof x === "string") return [].slice.call(document.querySelectorAll(x));
    return x.nodeType ? [x] : [].slice.call(x);
  }

  /* ---------- undo and redo ---------- */
  function undo(o) {
    o = o || {};
    var back = [], again = [], busy = false, key = o.key || "ds-undo";
    var bUndo = _.find(o.undo), bRedo = _.find(o.redo);
    function name(step) { return step.label || step.what || ""; }
    function say(x) { return ds.toast(Object.assign({ key: key }, x)); }
    function buttons() {
      var w = _.words(WORDS);
      [[bUndo, back, w.undo, w.noUndo, "Ctrl+Z"], [bRedo, again, w.redo, w.noRedo, "Ctrl+Y"]].forEach(function (x) {
        var b = x[0], step = x[1][x[1].length - 1];
        if (!b) return;
        b.disabled = !step;
        var t = step ? x[2] + " : " + name(step) + " (" + x[4] + ")" : x[3];
        b.setAttribute("aria-label", t);
        b.title = t;
      });
    }
    function go(redo) {
      var w = _.words(WORDS);
      // one at a time: a second press waits for the first to be done
      if (busy) return Promise.resolve(false);
      var from = redo ? again : back, to = redo ? back : again, step = from.pop();
      if (!step) { say({ type: "info", text: redo ? w.noRedo : w.noUndo }); return Promise.resolve(false); }
      busy = true;
      buttons();
      say({ type: "busy", text: redo ? w.redoing : w.undoing });
      return Promise.resolve().then(function () { return o.run(step, !!redo); }).then(function (text) {
        busy = false;
        to.push(step);
        buttons();
        say({ type: "good", text: text || name(step) + " · " + (redo ? w.redone : w.undone),
          action: { label: redo ? w.undo : w.redo, run: function () { go(!redo); } } });
        return true;
      }, function () {
        busy = false;
        from.push(step);
        buttons();
        say({ type: "bad", text: redo ? w.redoFailed : w.undoFailed });
        return false;
      });
    }
    if (bUndo) bUndo.addEventListener("click", function () { go(false); });
    if (bRedo) bRedo.addEventListener("click", function () { go(true); });
    if (o.keys !== false) document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if (!(e.ctrlKey || e.metaKey) || e.altKey || (k !== "z" && k !== "y")) return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      go(k === "y" || e.shiftKey);
    });
    buttons();
    return {
      remember: function (step) {
        if (!step) return null;
        back.push(step);
        again.length = 0;
        buttons();
        return { label: _.words(WORDS).undo, run: function () { go(false); } };
      },
      undo: function () { return go(false); },
      redo: function () { return go(true); },
      clear: function () { back.length = 0; again.length = 0; buttons(); }
    };
  }

  /* ---------- a change shown at once, saved after ---------- */
  var pending = {};
  function optimistic(id, o) {
    o = o || {};
    if (id != null && pending[id]) return null;
    if (id != null) pending[id] = true;
    if (o.change) o.change();
    if (o.after) o.after();
    return Promise.resolve().then(o.save).then(function (v) {
      if (id != null) delete pending[id];
      if (o.done) o.done(v);
      if (o.after) o.after();
      return true;
    }, function (e) {
      if (id != null) delete pending[id];
      if (o.revert) o.revert(e);
      if (o.fail) o.fail(e);
      else ds.toast({ type: "bad", text: (e && e.message) || _.words(WORDS).notSaved });
      if (o.after) o.after();
      return false;
    });
  }
  optimistic.busy = function (id) { return !!pending[id]; };

  /* ---------- the clipboard ---------- */
  function copy(text, o) {
    o = o || {};
    var w = _.words(WORDS);
    text = String(text == null ? "" : text);
    if (!text.trim()) return Promise.resolve(false);
    function old() {
      // a browser without the clipboard's API (or a page that is not https): a hidden field, selected and copied
      var f = _.el("textarea");
      f.value = text;
      f.setAttribute("readonly", "");
      f.style.position = "fixed";
      f.style.opacity = "0";
      document.body.appendChild(f);
      f.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      f.remove();
      if (!ok) throw new Error("copy");
    }
    var p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).catch(old) : Promise.resolve().then(old);
    return p.then(function () {
      ds.toast({ type: "good", text: o.said || w.copied });
      return true;
    }, function () {
      ds.toast({ type: "bad", text: w.notCopied });
      return false;
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copy]");
    if (!b) return;
    var v = b.getAttribute("data-copy"), src = /^#/.test(v) ? document.querySelector(v) : null;
    copy(src ? ("value" in src ? src.value : src.textContent) : v, { said: b.getAttribute("data-copy-said") || null });
  });

  /* ---------- several links at once ---------- */
  function openAll(urls, o) {
    o = o || {};
    urls = (urls || []).filter(Boolean);
    var w = _.words(WORDS), ask = o.ask == null ? 10 : o.ask;
    if (!urls.length) return Promise.resolve({ opened: 0, blocked: 0 });
    var asked = urls.length > ask ? ds.confirm({ title: o.title || w.tabs(urls.length), text: o.text || "", ok: o.ok || w.openThem(urls.length) }) : Promise.resolve(true);
    return Promise.resolve(asked).then(function (yes) {
      if (!yes) return { opened: 0, blocked: 0 };
      var tabs = urls.map(function (u) {
        var t = window.open(u, "_blank");
        // the page opened gets no hold on this one
        if (t) { try { t.opener = null; } catch (e) { /* already elsewhere */ } }
        return t;
      });
      var shut = tabs.filter(function (t) { return !t; }).length;
      // back on the first one, where the browser lets a page choose
      if (tabs[0] && tabs.length > 1) { try { tabs[0].focus(); } catch (e) { /* the browser keeps the last one */ } }
      if (shut) ds.toast({ type: "bad", text: w.blocked(shut) });
      return { opened: tabs.length - shut, blocked: shut };
    });
  }

  /* ---------- a panel under a button ---------- */
  function pop(button, panel, o) {
    button = _.find(button);
    panel = _.find(panel);
    if (!button || !panel) return null;
    if (panel._dsPop) return panel._dsPop;
    o = o || {};
    var layer = null;
    function isOpen() { return !panel.hidden; }
    function close(back) {
      if (!isOpen()) return;
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (layer) { _.unlayer(layer); layer = null; }
      if (back) button.focus();
      if (o.onClose) o.onClose();
    }
    function open() {
      if (isOpen()) return;
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      // Escape closes it, the focus back on its button; Tab goes on through the page
      layer = _.layer({ el: panel, close: function () { close(true); }, trap: false });
      if (o.onOpen) o.onOpen();
    }
    button.setAttribute("aria-expanded", isOpen() ? "true" : "false");
    button.addEventListener("click", function () { if (isOpen()) close(); else open(); });
    document.addEventListener("click", function (e) {
      if (isOpen() && !panel.contains(e.target) && !button.contains(e.target)) close();
    });
    return (panel._dsPop = { open: open, close: close, toggle: function () { if (isOpen()) close(); else open(); }, isOpen: isOpen });
  }
  pop.count = function (el, n) {
    el = _.find(el);
    if (!el) return;
    n = Math.max(0, n | 0);
    el.textContent = n > 99 ? "99+" : String(n);
    el.hidden = n === 0;
  };

  /* ---------- arriving and going ---------- */
  function frames(kind, root) {
    if (kind === "fade") return [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }];
    var d = root.getPropertyValue("--s-8").trim() || "8px";
    return [{ opacity: 0, transform: "translateY(-" + d + ")" }, { opacity: 1, transform: "none" }];
  }
  function move(els, kind, out) {
    var root = getComputedStyle(document.documentElement);
    var ms = _.ms(root.getPropertyValue(kind === "fade" ? "--t-mid" : "--t-fast").trim() || "0s");
    return Promise.all(els.map(function (el) {
      if (!ms || _.reduced() || !el.animate) return null;
      var f = frames(kind, root);
      if (out) f = f.slice().reverse();
      var a = el.animate(f, { duration: ms, easing: out ? "ease-in" : "cubic-bezier(0.22, 1, 0.36, 1)", fill: out ? "forwards" : "none" });
      return new Promise(function (ok) { a.onfinish = ok; a.oncancel = ok; });
    }));
  }
  function enter(el, o) { o = o || {}; return move(list(el), o.kind || "slide", false); }
  function leave(el, o) {
    o = o || {};
    var els = list(el);
    return move(els, o.kind || "slide", true).then(function () {
      if (o.remove !== false) els.forEach(function (x) { x.remove(); });
    });
  }

  /* ---------- drawing again without losing one's place ---------- */
  function redraw(holder, sig, build, o) {
    holder = _.find(holder);
    o = o || {};
    if (!holder) return false;
    var key = o.key == null ? "" : String(o.key), drawn = key + "\u0000" + sig;
    if (holder._dsDrawn === drawn) return false;
    var scroller = _.find(o.scroll) || holder, top = holder._dsKey === key ? scroller.scrollTop : 0;
    var was = document.activeElement, inside = !!was && was !== document.body && holder.contains(was);
    build(holder);
    holder._dsDrawn = drawn;
    holder._dsKey = key;
    scroller.scrollTop = top;
    if (inside && !holder.contains(was)) {
      var f = o.focus ? o.focus(holder, was) : was.id ? document.getElementById(was.id) : null;
      if (f && f.focus) f.focus({ preventScroll: true });
    }
    return true;
  }
  redraw.reset = function (holder) { holder = _.find(holder); if (holder) { holder._dsDrawn = null; holder._dsKey = null; } };

  /* ---------- what a search looked for, lit; the word it may have meant ---------- */
  var escape = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
  // a phrase as whole words, accents counted, capitals aside
  function exact(phrase) {
    var words = String(phrase || "").split(/\s+/).filter(Boolean);
    return words.length ? new RegExp("(?<![\\p{L}\\p{N}_])" + words.map(escape).join("\\s+") + "(?![\\p{L}\\p{N}_])", "iu") : null;
  }
  function highlight(root, selector, terms) {
    root = _.find(root);
    var fold = ds.text.fold;
    terms = (terms || []).map(function (t) { return typeof t === "string" ? { t: "word", v: t } : t; }).filter(function (t) { return t && String(t.v || "").trim(); });
    if (!root || !terms.length) return;
    [].forEach.call(root.querySelectorAll(selector), function (el) {
      var text = el.textContent, spans = [], at = [], folded = "";
      // each folded letter knows where it came from in the text
      for (var i = 0; i < text.length; i++) { var c = fold(text[i]); for (var j = 0; j < c.length; j++) { folded += c[j]; at.push(i); } }
      at.push(text.length);
      terms.forEach(function (w) {
        if (w.t === "phrase") {
          var rx = exact(w.v), m, g;
          if (!rx) return;
          g = new RegExp(rx.source, "giu");
          while ((m = g.exec(text))) { spans.push([m.index, m.index + m[0].length]); if (!m[0].length) g.lastIndex++; }
          return;
        }
        var v = fold(w.v);
        for (var k = v ? folded.indexOf(v) : -1; k >= 0; k = folded.indexOf(v, k + v.length)) spans.push([at[k], at[k + v.length - 1] + 1]);
      });
      if (!spans.length) return;
      spans.sort(function (a, b) { return a[0] - b[0]; });
      var merged = [];
      spans.forEach(function (s) { var last = merged[merged.length - 1]; if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]); else merged.push(s.slice()); });
      var html = "", pos = 0;
      merged.forEach(function (s) { html += ds.esc(text.slice(pos, s[0])) + '<mark class="hit">' + ds.esc(text.slice(s[0], s[1])) + "</mark>"; pos = s[1]; });
      el.innerHTML = html + ds.esc(text.slice(pos));
    });
  }
  function distance(a, b, most) {
    var row = [], i, j;
    for (j = 0; j <= b.length; j++) row.push(j);
    for (i = 1; i <= a.length; i++) {
      var next = [i], low = i;
      for (j = 1; j <= b.length; j++) {
        next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        low = Math.min(low, next[j]);
      }
      if (low > most) return most + 1;
      row = next;
    }
    return row[b.length];
  }
  function suggest(word, vocabulary, o) {
    o = o || {};
    var v = ds.text.fold(word);
    if (v.length < 3 || !vocabulary) return null;
    var room = o.room != null ? o.room : v.length <= 4 ? 1 : v.length <= 8 ? 2 : 3, best = null;
    var entries = vocabulary instanceof Map ? Array.from(vocabulary) : Array.from(vocabulary, function (x) { return [x, 1]; });
    entries.forEach(function (e) {
      var w = ds.text.fold(e[0]), n = e[1];
      if (w === v || Math.abs(w.length - v.length) > room) return;
      var d = distance(v, w, room);
      if (d <= room && (!best || d < best[1] || (d === best[1] && n > best[2]))) best = [e[0], d, n];
    });
    return best ? best[0] : null;
  }
  suggest.vocabulary = function (texts) {
    var out = new Map();
    (texts || []).forEach(function (t) {
      ds.text.fold(t || "").split(/[^\p{L}\p{N}]+/u).forEach(function (w) { if (w.length >= 3) out.set(w, (out.get(w) || 0) + 1); });
    });
    return out;
  };
  suggest.distance = distance;

  ds.undo = undo; ds.optimistic = optimistic; ds.copy = copy; ds.openAll = openAll; ds.pop = pop;
  ds.enter = enter; ds.leave = leave; ds.redraw = redraw; ds.highlight = highlight; ds.suggest = suggest;
  ds.text.exact = exact;
})();
