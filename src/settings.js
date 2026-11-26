/* A settings page's pieces, in ds.js for every app (4.25.0; Studio's and Bank's settings wrote them by hand, then
   ds-tools.js had them): a switch that saves, a connection's row, number fields by group. Their look is src/settings.css,
   on a page whose body is .settings; ds.jobs (the syncs and their journal) stays in ds-tools.js. */
(function () {
  "use strict";
  var _ = window.ds._;
  /* A settings page's pieces, built (Studio's and Bank's settings wrote them by hand):
     ds.switch({label, on, help, text}, save): a switch (label.switch) that saves at once: save(on) gives back a promise; the
     switch waits disabled, and goes back with a red bubble if saving failed.
     ds.conn({name, tone, details, action}) and ds.conns(holder, rows): a connection's row (.conn): its dot (tone "good" or
     "bad"), its name, its details (a text, or {text, tone}), its action (a node, or {href, text}: another site opens in
     a new tab, « ↗ », the app's own page « → »); ds.conn.html for a page that writes strings (name and details as HTML).
     ds.fields(holder, groups, {onChange}): number fields by group, [{group, key, label, help, value, default, min, max,
     unit}]: changed (is-changed) or out of bounds (aria-invalid) as typed; onChange({edited, wrong}) after each key;
     gives back {edited(), wrong()}. unit: a word written as given (« min », « % »), or [one, many] (["jour", "jours"]),
     which agrees with its figure: « Par défaut 1 jour », and beside the field with what is typed. */
  function settingSwitch(sw, save) {
    var h = window.ds.h, input = h("input", { type: "checkbox", role: "switch", "aria-label": sw.label });
    input.checked = !!sw.on;
    input.addEventListener("change", function () {
      input.disabled = true;
      Promise.resolve().then(function () { return save(input.checked); }).then(function () { input.disabled = false; }, function (e) {
        input.checked = !input.checked; input.disabled = false;
        window.ds.toast({ type: "bad", text: e && e.message ? e.message : String(e) });
      });
    });
    return h("label", { class: "switch", title: sw.help || null }, [input, sw.text || sw.label]);
  }
  function connAction(a) {
    var h = window.ds.h;
    if (!a) return null;
    if (a.nodeType) return a;
    var ext = /^https?:/.test(a.href);
    return h("a", { href: a.href, target: ext ? "_blank" : null, rel: ext ? "noopener" : null, text: a.text + (ext ? " ↗" : " →") });
  }
  function conn(c) {
    var h = window.ds.h;
    return h("div", { class: "conn" }, [h("span", { class: "name" }, [c.tone ? h("i", { class: "sync-dot is-" + c.tone, "aria-hidden": "true" }) : null, c.name]),
      ].concat((c.details || []).map(function (d) { return h("span", { class: "det" + (d && d.tone ? " is-" + d.tone : ""), text: d && d.text != null ? d.text : d }); }), [connAction(c.action)]));
  }
  conn.html = function (c) {
    return '<div class="conn"><span class="name">' + (c.tone ? '<i class="sync-dot is-' + c.tone + '" aria-hidden="true"></i>' : "") + c.name + "</span>" +
      (c.details || []).map(function (d) { return '<span class="det' + (d && d.tone ? " is-" + d.tone : "") + '">' + (d && d.text != null ? d.text : d) + "</span>"; }).join("") +
      (c.action || "") + "</div>";
  };
  function conns(holder, rows) {
    holder = _.find(holder);
    var list = (rows || []).map(conn);
    if (holder) { holder.textContent = ""; list.forEach(function (x) { holder.append(x); }); }
    return list;
  }
  function fields(holder, list, o) {
    var h = window.ds.h, edited = {}, groups = {};
    holder = _.find(holder);
    o = o || {};
    (list || []).forEach(function (f) { (groups[f.group || ""] = groups[f.group || ""] || []).push(f); });
    function wrong() { return holder ? holder.querySelectorAll('input[aria-invalid="true"]').length : 0; }
    function tell() { if (o.onChange) o.onChange({ edited: Object.assign({}, edited), wrong: wrong() }); }
    // the unit for a figure: [one, many] by ds.plural (« 1 jour », « 30 jours »), a single word as the page wrote it
    function unitOf(f, n) { return Array.isArray(f.unit) ? window.ds.plural(n, f.unit[0], f.unit[1]) : f.unit; }
    var out = Object.keys(groups).map(function (g) {
      return h("div", { class: "group" }, [g ? h("h3", { text: g }) : null].concat(groups[g].map(function (f) {
        var id = "f-" + f.key, input = h("input", { id: id, type: "number", inputmode: "numeric", min: f.min, max: f.max, step: 1, value: f.value });
        var unit = f.unit ? h("span", { class: "unit", text: unitOf(f, f.value) }) : null;
        input.addEventListener("input", function () {
          var v = input.value.trim();
          if (v === "" || +v === f.value) delete edited[f.key]; else edited[f.key] = v;
          var bad = v !== "" && (!/^-?\d+$/.test(v) || (f.min != null && +v < f.min) || (f.max != null && +v > f.max));
          if (bad) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
          input.classList.toggle("is-changed", f.key in edited && !bad);
          // the word beside the field follows the figure typed (the value kept while the field is empty)
          if (unit) unit.textContent = unitOf(f, v !== "" && !isNaN(+v) ? +v : f.value);
          tell();
        });
        return h("div", { class: "field" }, [h("label", { class: "lab", for: id, text: f.label }),
          h("div", { class: "help" }, [f.help ? f.help + " " : "", f.default != null ? h("span", { class: "def", text: (_.english() ? "Default " : "Par défaut ") + f.default + (f.unit ? " " + unitOf(f, f.default) : "") +
            (f.min != null && f.max != null ? (_.english() ? ", between " : ", entre ") + f.min + (_.english() ? " and " : " et ") + f.max : "") + "." }) : null]),
          h("div", { class: "inp" }, [input, unit])]);
      })));
    });
    if (holder) { holder.textContent = ""; out.forEach(function (x) { holder.append(x); }); }
    tell();
    return { edited: function () { return Object.assign({}, edited); }, wrong: wrong };
  }
  window.ds.switch = settingSwitch; window.ds.conn = conn; window.ds.conns = conns; window.ds.fields = fields;
})();
