/* Design system: the behaviour the apps share.
   ds.toast({type, text, action, duration}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close).
   type: "good" (done, 4 s), "info" (5 s), "busy" (until changed), "bad" (stays until closed); an action keeps it 8 s. */
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
  window.ds = window.ds || {};
  window.ds.toast = toast;
})();
