/* A form's own checks, in the page's words, instead of the browser's bubbles (the site's workshop request, 6.2.0).
   ds.validate(form, {words}): the form is checked when it is sent, before anything else listens to it (ds.newsletter
   included): a field left empty though required, an address that is not one, a box to tick, a list where nothing is
   chosen. Each one says why in red on the line under it (.field-note.is-bad; written there when the field has none, and
   under its .check for a box), its field gets aria-invalid and a red edge, the first one takes the focus, and the form is
   not sent. From then on a field says it again or is quiet as it is typed in; a field left after being typed in is
   checked as well. Its words: the field's data-error, else words.missing, words.email, words.tick or words.choose, else
   ds's own (in English or French, as the page). A field that was quiet before keeps its own line once corrected.
   Gives back {check(): true when all is right, saying what is not, reset(): every field quiet again}.
   A required field's label says so with a gold star: .field-label.is-required, or the words of a box,
   <label class="check"><input required …> <span class="is-required">…</span></label>. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  if (ds.validate) return;
  var WORDS = _.table({
    fr: { missing: "Ce champ est à remplir.", email: "Saisis une adresse e-mail valide.", tick: "Coche cette case pour continuer.",
          choose: "Choisis une option." },
    en: { missing: "Please fill in this field.", email: "Please enter a valid email address.", tick: "Please tick this box to continue.",
          choose: "Please choose an option." }
  });
  var FIELDS = "input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea";
  var count = 0;

  function validate(form, o) {
    form = _.find(form);
    if (!form) return null;
    if (form._dsValidate) return form._dsValidate;
    o = o || {};
    form.noValidate = true;

    function said(field) {
      var w = Object.assign({}, _.words(WORDS), o.words || {});
      var v = field.validity;
      if (field.dataset.error) return field.dataset.error;
      if (v.valueMissing) return field.type === "checkbox" || field.type === "radio" ? w.tick : field.tagName === "SELECT" ? w.choose : w.missing;
      if (v.typeMismatch && field.type === "email") return w.email;
      return field.validationMessage || w.missing;
    }
    // the line that speaks for a field: the one under it in its group, after its box, or one made for it
    function line(field) {
      if (field._dsLine) return field._dsLine;
      var box = field.closest(".check"), group = !box && field.closest(".field-group");
      var note = group ? group.querySelector(":scope > .field-note") : null;
      if (!note) {
        note = _.el("p", "field-note");
        note.setAttribute("data-validate", "");
        (box || field).after(note);
      }
      if (!note.id) note.id = "ds-check-" + (++count);
      note._dsWas = { text: note.textContent, cls: note.className };
      field._dsLine = note;
      return note;
    }
    function quiet(field) {
      var note = field._dsLine;
      field.removeAttribute("aria-invalid");
      if (!note) return;
      note.textContent = note._dsWas.text;
      note.className = note._dsWas.cls;
      var ids = (field.getAttribute("aria-describedby") || "").split(" ").filter(function (id) { return id && id !== note.id; });
      if (ids.length) field.setAttribute("aria-describedby", ids.join(" ")); else field.removeAttribute("aria-describedby");
    }
    function speak(field) {
      if (field.disabled || !field.willValidate) return true;
      // spaces alone do not fill a required field
      if (field.required && /^(text|email|tel|search|url|textarea)$/.test(field.type)) {
        var w = Object.assign({}, _.words(WORDS), o.words || {});
        field.setCustomValidity(field.value !== "" && field.value.trim() === "" ? field.dataset.error || w.missing : "");
      }
      if (field.checkValidity()) { quiet(field); return true; }
      var note = line(field);
      note.textContent = said(field);
      note.classList.add("is-bad");
      field.setAttribute("aria-invalid", "true");
      var ids = (field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
      if (ids.indexOf(note.id) < 0) field.setAttribute("aria-describedby", ids.concat(note.id).join(" "));
      return false;
    }
    function fields() { return [].slice.call(form.querySelectorAll(FIELDS)); }
    function check() {
      var first = null;
      fields().forEach(function (f) { f._dsChecked = true; if (!speak(f) && !first) first = f; });
      if (first) {
        first.focus({ preventScroll: true });
        first.scrollIntoView({ block: "center", behavior: _.reduced() ? "auto" : "smooth" });
      }
      return !first;
    }
    function reset() { fields().forEach(function (f) { f._dsChecked = false; f.setCustomValidity(""); quiet(f); }); }

    // before every other listener of the form: what is not right is never sent
    form.addEventListener("submit", function (e) {
      if (check()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);
    form.addEventListener("input", function (e) { if (e.target._dsChecked) speak(e.target); });
    form.addEventListener("change", function (e) { if (e.target._dsChecked) speak(e.target); });
    // a field left after being typed in is checked too, so the mistake is said before the end of the form
    form.addEventListener("focusout", function (e) {
      var f = e.target;
      if (!f.matches || !f.matches(FIELDS) || f.type === "checkbox" || f.type === "radio") return;
      if (f.value !== "" || f._dsChecked) { f._dsChecked = true; speak(f); }
    });
    form.addEventListener("reset", function () { setTimeout(reset); });
    form._dsValidate = { check: check, reset: reset };
    return form._dsValidate;
  }

  ds.validate = validate;
})();
