/* The behaviour of src/pick.css.
   ds.pills(root): each pill of root (or the page, or root itself when it is one) says its menu’s choice in its .pill-value,
   and a .pill.is-filter is lit (.is-on) while its menu holds a value. Done on its own when the page is ready and on
   every change of a pill's menu; a page that sets a menu itself (select.value = …) calls it after.
   ds.picker(holder, items, {value, first, limit, placeholder, label, empty, onPick, opener, check}) draws a search picker
   in holder: a field, then the choices that match what is typed, accents and capitals aside, every word of it.
     items: [{value, label, sub (a word in small after it), group (its heading), color (its --n), initial or icon,
     cta (what a tap does), href (a link: a tap goes there), keywords (more words it is found by)}], or null while they
     are read (« Chargement… »); value: the current choice, in gold; first: the values shown before anything is typed
     (the banks most people have), else every choice; limit: how many at most (12); empty: the words when nothing
     matches; onPick(item, {checked}) on a tap or Enter; opener: a button that shows and hides it (aria-expanded), the
     search taking the focus; check: a box at its foot ({label, checked}, Bank's « Seulement cette opération »), its state
     given to onPick (checked) and read by checked(). ↑ and ↓ go through the choices, Enter takes one, Escape empties the search, then closes it.
     Returns {open(), close(), toggle(), set(items, options), draw(), checked(), input}; set takes the list once read, and
     may change the options with it (first, empty…). */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find, tag = _.el;
  var WORDS = _.table({
    fr: { search: "Chercher…", none: "Rien ne correspond.", loading: "Chargement de la liste…" },
    en: { search: "Search…", none: "Nothing matches.", loading: "Loading the list…" }
  });
  function words() { return _.words(WORDS); }

  function pills(root) {
    root = find(root) || document;
    var list = root.matches && root.matches(".pill") ? [root] : root.querySelectorAll(".pill");
    [].forEach.call(list, function (p) {
      var sel = p.querySelector("select");
      if (!sel) return;
      var pv = p.querySelector(".pill-value");
      if (!pv) { pv = tag("span", "pill-value"); p.insertBefore(pv, p.firstChild); }
      var o = sel.options[sel.selectedIndex];
      pv.textContent = o ? o.textContent : "";
      if (p.classList.contains("is-filter")) p.classList.toggle("is-on", !!sel.value);
    });
  }
  document.addEventListener("change", function (e) {
    var p = e.target.closest && e.target.closest(".pill");
    if (p) pills(p);
  });
  // now, for what is on the page already, and once it is all there, for what a page's first script drew
  pills();
  document.addEventListener("DOMContentLoaded", function () { pills(); });

  var made = 0;
  function fold(t) { return String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function picker(holder, items, o) {
    holder = find(holder);
    if (!holder) return null;
    o = Object.assign({}, o);
    // called again on the same holder: the same picker, with the items given
    if (holder._dsPicker) { if (items !== undefined) holder._dsPicker.set(items); return holder._dsPicker; }
    var w = words(), id = "ds-picker-" + (++made), p = { items: items === undefined ? [] : items, shown: [], active: -1 };
    holder._dsPicker = p;
    holder.classList.add("picker");
    var input = tag("input", "picker-q"), list = tag("div", "picker-list");
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = o.placeholder || w.search;
    input.setAttribute("aria-label", o.label || input.placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", id);
    list.id = id;
    list.setAttribute("role", "listbox");
    holder.replaceChildren(input, list);
    p.input = input;
    // its box, under the choices: what a choice is for
    var box = null;
    if (o.check) {
      var foot = tag("label", "picker-check");
      box = tag("input");
      box.type = "checkbox";
      box.checked = !!o.check.checked;
      foot.append(box, tag("span", "", o.check.label || ""));
      holder.appendChild(foot);
    }
    p.checked = function () { return !!(box && box.checked); };

    function matches() {
      var items = p.items || [], q = fold(input.value.trim()), limit = o.limit || 12;
      if (!q) {
        var start = o.first ? o.first.map(function (v) { return items.filter(function (x) { return fold(x.value) === fold(v); })[0]; }).filter(Boolean) : items;
        return start.slice(0, limit);
      }
      var parts = q.split(/\s+/);
      return items.filter(function (x) {
        var text = fold([x.label, x.sub, x.group, x.keywords].join(" "));
        return parts.every(function (part) { return text.indexOf(part) >= 0; });
      }).slice(0, limit);
    }
    function option(x, i) {
      var opt = tag(x.href ? "a" : "button", "picker-opt");
      if (x.href) opt.href = x.href; else opt.type = "button";
      opt.id = id + "-" + i;
      opt.tabIndex = -1;
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", o.value != null && String(x.value) === String(o.value) ? "true" : "false");
      if (x.initial || x.icon || x.color) {
        var av = tag("span", "picker-av" + (x.initial || x.icon ? "" : " is-dot"), x.initial || null);
        av.setAttribute("aria-hidden", "true");
        // a colour given as a token's name ("--c-bleu") or as a value, as in the charts and the calendar
        if (x.color) av.style.setProperty("--n", _.tone(x.color));
        if (x.icon) av.appendChild(window.ds.ico(x.icon));
        opt.appendChild(av);
      }
      var name = tag("span", "picker-name", x.label);
      if (x.sub) { name.append(" "); name.appendChild(tag("small", "", x.sub)); }
      opt.appendChild(name);
      if (x.cta) opt.appendChild(tag("span", "picker-cta", x.cta));
      opt.addEventListener("click", function () { pick(x); });
      return opt;
    }
    p.draw = function () {
      p.shown = p.items ? matches() : [];
      p.active = -1;
      input.removeAttribute("aria-activedescendant");
      var kids = [], group = null;
      if (!p.items) kids.push(tag("p", "picker-none", w.loading));
      else if (!p.shown.length) kids.push(tag("p", "picker-none", o.empty || w.none));
      p.shown.forEach(function (x, i) {
        // a heading each time the group changes: a category, then its subcategories
        if (x.group && x.group !== group) kids.push(tag("p", "picker-g", x.group));
        group = x.group || null;
        kids.push(option(x, i));
      });
      list.replaceChildren.apply(list, kids);
      return p;
    };
    function light(i) {
      var opts = list.querySelectorAll(".picker-opt");
      if (!opts.length) return;
      p.active = (i + opts.length) % opts.length;
      [].forEach.call(opts, function (x, k) { x.classList.toggle("is-focused", k === p.active); });
      input.setAttribute("aria-activedescendant", opts[p.active].id);
      opts[p.active].scrollIntoView({ block: "nearest" });
    }
    function pick(x) {
      o.value = x.value;
      if (o.onPick) o.onPick(x, { checked: p.checked() });
      if (x.href) return;
      p.draw();
    }
    input.addEventListener("input", p.draw);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); light(p.active < 0 && e.key === "ArrowUp" ? -1 : p.active + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter") {
        // Enter takes the lit choice, or the first one once something is typed
        var x = p.shown[p.active >= 0 ? p.active : input.value.trim() ? 0 : -1];
        if (!x) return;
        e.preventDefault();
        if (x.href) { if (o.onPick) o.onPick(x); location.href = x.href; } else pick(x);
      } else if (e.key === "Escape") {
        // first the search, then the picker itself; with nothing left to do, Escape goes on to the sheet around it
        if (input.value) { e.preventDefault(); input.value = ""; p.draw(); }
        else if (opener && !holder.hidden) { e.preventDefault(); p.close(); opener.focus(); }
      }
    });
    var opener = find(o.opener);
    p.open = function () {
      holder.hidden = false;
      if (opener) opener.setAttribute("aria-expanded", "true");
      p.draw();
      input.focus();
      return p;
    };
    p.close = function () {
      holder.hidden = true;
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (items, more) { p.items = items; if (more) Object.keys(more).forEach(function (k) { o[k] = more[k]; }); return p.draw(); };
    if (opener) {
      opener.setAttribute("aria-controls", holder.id || (holder.id = id + "-box"));
      opener.setAttribute("aria-expanded", holder.hidden ? "false" : "true");
      opener.addEventListener("click", p.toggle);
    }
    return p.draw();
  }
  window.ds = window.ds || {};
  window.ds.pills = pills;
  window.ds.picker = picker;
})();
