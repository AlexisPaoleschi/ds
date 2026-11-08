/* ds 2.10.4 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
/* Design system: the behaviour the apps share.
   ds.toast({type, text, action, duration}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close).
   type: "good" (done, 4 s), "info" (5 s), "busy" (until changed), "bad" (stays until closed); an action keeps it 8 s.
   ds.confirm({title, text, ok, danger, value}) asks in a window instead of the browser's boxes (see below). */
(function () {
  "use strict";
  var LIFE = { good: 4000, info: 5000, busy: 0, bad: 0 };
  var stack = null, live = [];
  function holder() {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toasts";
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(opts) {
    opts = opts || {};
    // the same words again change the message already there instead of piling up
    for (var i = 0; i < live.length; i++) if (live[i].text === opts.text) return live[i].update(opts);
    var el = document.createElement("div"), t = { el: el, text: opts.text, life: 0, timer: null, gone: false };
    el.innerHTML = '<span class="mark" aria-hidden="true"></span><span class="txt"></span>' +
      '<button type="button" class="act" hidden></button><button type="button" class="x" aria-label="Fermer">×</button>';
    el.querySelector(".x").onclick = function () { t.close(); };
    // the countdown waits while the pointer or a finger is on the message
    el.addEventListener("pointerenter", function () { clearTimeout(t.timer); });
    el.addEventListener("pointerleave", function () { t.arm(); });
    t.arm = function () {
      clearTimeout(t.timer);
      if (t.life) t.timer = setTimeout(t.close, t.life);
    };
    t.update = function (o) {
      var type = o.type || "good", act = el.querySelector(".act");
      el.className = "toast is-" + type;
      el.setAttribute("role", type === "bad" ? "alert" : "status");
      el.querySelector(".txt").textContent = o.text || "";
      t.text = o.text;
      act.hidden = !o.action;
      if (o.action) {
        act.textContent = o.action.label;
        act.onclick = function () { t.close(); o.action.run(); };
      }
      t.life = o.duration != null ? o.duration : o.action ? 8000 : LIFE[type] || 0;
      t.arm();
      return t;
    };
    t.close = function () {
      if (t.gone) return;
      t.gone = true;
      clearTimeout(t.timer);
      live.splice(live.indexOf(t), 1);
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 200);
    };
    holder().appendChild(el);
    live.push(t);
    // three at most: the oldest goes
    while (live.length > 3) live[0].close();
    return t.update(opts);
  }
  // ds.confirm({title, text, ok, danger, value}) asks in a window of the design system and answers with a promise:
  // false when cancelled, true when confirmed, or the typed text when the window has a field (value).
  // A dangerous answer (danger) starts on « Annuler », so Enter never deletes by mistake.
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var veil = document.createElement("div"), field = opts.value != null;
      veil.className = "dialog-veil";
      veil.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-t"><h2 class="dialog-t" id="dialog-t"></h2>' +
        '<p class="dialog-x"></p>' + (field ? '<input class="dialog-in" type="text">' : "") +
        '<div class="dialog-b"><button type="button" class="btn dialog-no">Annuler</button><button type="button" class="btn dialog-ok"></button></div></div>';
      var ok = veil.querySelector(".dialog-ok"), no = veil.querySelector(".dialog-no"), input = veil.querySelector(".dialog-in"), text = veil.querySelector(".dialog-x");
      veil.querySelector(".dialog-t").textContent = opts.title || "";
      text.textContent = opts.text || "";
      text.hidden = !opts.text;
      ok.textContent = opts.ok || "Confirmer";
      ok.classList.add(opts.danger ? "is-danger" : "is-save");
      if (input) { input.value = opts.value; input.placeholder = opts.placeholder || ""; }
      var before = document.activeElement;
      function end(answer) {
        document.removeEventListener("keydown", key, true);
        veil.remove();
        if (before && before.focus) before.focus();
        done(answer);
      }
      function key(e) {
        if (e.key === "Escape") { e.preventDefault(); end(false); }
        else if (e.key === "Enter" && input && document.activeElement === input) { e.preventDefault(); end(input.value); }
      }
      ok.onclick = function () { end(input ? input.value : true); };
      no.onclick = function () { end(false); };
      veil.addEventListener("click", function (e) { if (e.target === veil) end(false); });
      document.addEventListener("keydown", key, true);
      document.body.appendChild(veil);
      if (input) { input.focus(); input.select(); } else (opts.danger ? no : ok).focus();
    });
  }
  window.ds = window.ds || {};
  window.ds.toast = toast;
  window.ds.confirm = confirm;
})();
