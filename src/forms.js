/* Behaviours of forms and lists the apps wrote each for itself (the audit of 23 November 2026).
   ds.rows(holder, {open, row}): rows that open something (a sheet), by a click anywhere but on a control of theirs, and by
   Enter or Space on a row reached with Tab (tabindex="0"); row: the rows' selector (tr.is-link and li.is-link unless
   given); open(row, event). Delegated: rows drawn again need nothing more.
   ds.password(input, {toggle, generate, length}): a password field's « Afficher » / « Masquer » button (its words from its
   data-str-show and data-str-hide, or ds's) and its « Générer » button, a strong one of length characters (16) made by the
   browser's crypto, shown at once.
   ds.autosave(field, {save, note, said}): a field that saves itself when left, only if it changed; save(value) gives back
   (a promise of) what the server kept, which goes back in the field (null: the field stays as it is; false: nothing was
   sent, nothing is said), called at once when the field is left; the line under it (note, a .field-note) says how it
   works, then the error in red (is-bad) if saving failed; a bubble says « Enregistré ». said: {idle, saved, error}.
   Gives back {save(), reset(value)}. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"], [role="switch"]';
  var WORDS = _.table({
    fr: { show: "Afficher", hide: "Masquer", saved: "Enregistré.", error: "Pas enregistré : réessaie en quittant le champ." },
    en: { show: "Show", hide: "Hide", saved: "Saved.", error: "Not saved: try again by leaving the field." }
  });

  function rows(holder, o) {
    holder = _.find(holder);
    if (!holder || holder._dsRows) return holder;
    o = o || {};
    var sel = o.row || "tr.is-link, li.is-link";
    holder._dsRows = true;
    holder.addEventListener("click", function (e) {
      var row = e.target.closest && e.target.closest(sel);
      if (!row || !holder.contains(row)) return;
      var x = e.target.closest(INTERACTIVE);
      if (x && x !== row && row.contains(x)) return;
      if (o.open) o.open(row, e);
    });
    holder.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target;
      if (!row.matches || !row.matches(sel)) return;
      e.preventDefault();
      if (o.open) o.open(row, e);
    });
    return holder;
  }

  var ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
  function strong(n) {
    var v = new Uint32Array(n || 16), out = "";
    window.crypto.getRandomValues(v);
    for (var i = 0; i < v.length; i++) out += ALPHABET[v[i] % ALPHABET.length];
    return out;
  }
  function password(input, o) {
    input = _.find(input);
    if (!input) return null;
    o = o || {};
    var toggle = _.find(o.toggle), generate = _.find(o.generate), w = _.words(WORDS);
    function word(b, shown) { return shown ? (b.getAttribute("data-str-hide") || w.hide) : (b.getAttribute("data-str-show") || w.show); }
    function show(on) {
      input.type = on ? "text" : "password";
      if (toggle) { toggle.textContent = word(toggle, on); toggle.setAttribute("aria-pressed", on ? "true" : "false"); }
    }
    if (toggle) toggle.addEventListener("click", function () { show(input.type !== "text"); });
    if (generate) generate.addEventListener("click", function () {
      input.value = strong(o.length || 16);
      show(true);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
    return { show: show, generate: function () { input.value = strong(o.length || 16); show(true); return input.value; } };
  }
  password.strong = strong;

  function autosave(field, o) {
    field = _.find(field);
    if (!field) return null;
    o = o || {};
    var note = _.find(o.note), w = _.words(WORDS), said = o.said || {}, idle = said.idle || (note ? note.textContent : "");
    var last = field.value, pending = null, pendingValue;
    function calm() { if (note) { note.textContent = idle; note.classList.remove("is-bad"); } }
    function save() {
      if (field.value === last || !o.save) return Promise.resolve(null);
      var value = field.value;
      // the same text already on its way (the field left while it is being saved): the same answer
      if (pending && pendingValue === value) return pending;
      // save is called at once, not later: a page that shows another item in the same field right after (a viewer
      // moving on) has not changed what it saves for yet
      var sent;
      try { sent = o.save(value); } catch (e) { sent = Promise.reject(e); }
      if (sent === false) return Promise.resolve(null);
      pendingValue = value;
      var p = pending = Promise.resolve(sent).then(function (kept) {
        if (kept != null) field.value = kept;
        last = field.value;
        calm();
        ds.toast({ type: "good", text: said.saved || w.saved });
        return field.value;
      }, function () {
        if (note) { note.textContent = said.error || w.error; note.classList.add("is-bad"); }
        return null;
      }).then(function (v) { if (pending === p) pending = null; return v; });
      return p;
    }
    field.addEventListener("blur", save);
    field.addEventListener("input", calm);
    return { save: save, reset: function (value) { field.value = value; last = value; calm(); } };
  }

  ds.rows = rows; ds.password = password; ds.autosave = autosave;
})();
