/* Searching and filtering a list, in ds-tools.js (the audit of 23 November 2026: Bank and Studio wrote them).
   ds.query({fields, every, values, amount, date, months}): a search language. Words in any order and any field, accents
   and capitals aside; "an exact phrase" (whole words); -without, -(…), -"…"; OU, OR, |, || between two choices (ET, AND,
   & are the default); (parentheses); field:word and field:"a phrase" (fields: {name: [the item's keys]}); an amount
   (23,40 · +100 · -23,40 · 20-30 · 20..30 · « 20 à 30 » · >100 · <50, « 1 407,60 » as one number); a date (2026 ·
   03/2026 · 2026-03 · 15/03 · 15/03/2026 · 2026-03-15 · « mars 2026 » · « mars »). every: the keys a word without a field
   looks in; values(item, field): the texts to look in, when an app reads a field its own way (null: the default);
   amount(item) and date(item) ("2026-03-15"): the item's figure and day (item.amount and item.date unless given); months:
   the months' names (French unless given). Gives back {parse(q) (its tree, null for an empty search), match(tree, item),
   terms(tree) (the words and phrases it looks for, not those it excludes: ds.highlight lights them), fold, exact}.
   An app whose server reads the same language keeps both in step with shared cases (Bank's tests/search_cases.json).
   ds.filters(holder, groups, {off, key, onChange}): the filter panel (.fgroup, .fhead, .frow, button.chip, its eye
   « Seulement », « Tout »): groups [{title, items: [{key, label, color, lead, icon, only}]}]; every item is on until
   switched off; off is the object of those switched off ({key: true}), kept on the device under key; the eye keeps an
   item alone in its group, « Tout » (shown once something in it is off) switches the group back on; onChange(off) after
   each click. lead: a node or a function giving one (a mark before the label); color: its swatch; icon: a sprite name.
   ds.filters.row(o) and ds.filters.group(o) write the same as HTML for a page that keeps its filters elsewhere (in its
   address): row({group, value, on, label, color, only, more}) (data-g and data-v on the chip, data-only on its eye, more:
   HTML before the eye), group({title, all, rows}) (all: the name « Tout » carries in data-all, none without it).
   ds.filterChips(holder, chips, {onRemove, onClear}): the filters in use, each a gold pill with its cross
   (.btn.is-pill.fchip, data-k), then « Tout effacer »; the row (.filter-chips) is hidden when there are none. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  var WORDS = _.table({
    fr: { only: "Seulement ", all: "Tout", remove: "Enlever ce filtre", removeThis: function (t) { return "Enlever le filtre « " + t + " »"; }, clear: "Tout effacer" },
    en: { only: "Only ", all: "All", remove: "Remove this filter", removeThis: function (t) { return "Remove the filter “" + t + "”"; }, clear: "Clear all" }
  });

  /* ---------- the search language ---------- */
  var OR_WORDS = { OU: 1, ou: 1, OR: 1, "|": 1, "||": 1 };
  var AND_WORDS = { ET: 1, et: 1, AND: 1, "&&": 1, "&": 1 };
  var MONTHS = {
    janvier: 1, janv: 1, fevrier: 2, fevr: 2, fev: 2, mars: 3, avril: 4, avr: 4, mai: 5, juin: 6,
    juillet: 7, juil: 7, aout: 8, septembre: 9, sept: 9, octobre: 10, oct: 10, novembre: 11, nov: 11,
    decembre: 12, dec: 12
  };
  var NUM = "(\\d+(?:[.,]\\d{1,2})?)";
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  function query(c) {
    c = c || {};
    var fold = ds.text.fold, exact = ds.text.exact;
    var FIELDS = c.fields || {}, EVERY = c.every || [], months = c.months || MONTHS;
    var amountOf = c.amount || function (x) { return x.amount; }, dateOf = c.date || function (x) { return x.date; };

    // an amount, [low, high, sign] with sign "+", "-" or null, or null
    function amount(token) {
      var text = token.replace(/€/g, "").replace(/[   ]/g, "").toLowerCase(), m;
      var to = function (v) { return parseFloat(v.replace(",", ".")); };
      m = text.match(new RegExp("^([+-]?)" + NUM + "$"));
      if (m) return [to(m[2]), to(m[2]), m[1] || null];
      m = text.match(new RegExp("^" + NUM + "(?:-|\\.\\.)" + NUM + "$"));
      if (m) { var ab = [to(m[1]), to(m[2])].sort(function (x, y) { return x - y; }); return [ab[0], ab[1], null]; }
      m = text.match(new RegExp("^([<>])=?" + NUM + "$"));
      if (m) return m[1] === ">" ? [to(m[2]), 1e9, null] : [0, to(m[2]), null];
      return null;
    }
    // a date, [year, month, day], each null when not said, or null
    function date(token) {
      var m = token.match(/^(199\d|20\d\d)$/);
      if (m) return [+m[1], null, null];
      m = token.match(/^(\d{1,2})\/(\d{4})$/) || token.match(/^(\d{4})-(\d{1,2})$/);
      if (m) {
        var a = +m[1], b = +m[2], year = a <= 12 && b > 31 ? b : a, month = a <= 12 && b > 31 ? a : b;
        return month >= 1 && month <= 12 ? [year, month, null] : null;
      }
      m = token.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
      if (m) {
        var day = +m[1], mo = +m[2];
        return mo >= 1 && mo <= 12 && day >= 1 && day <= 31 ? [m[3] ? +m[3] : null, mo, day] : null;
      }
      m = token.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return [+m[1], +m[2], +m[3]];
      return null;
    }
    // the pieces of a search: [kind, text, field], kind "(" ")" "or" "and" "not" "word" "phrase"
    function tokens(q) {
      // « 1 407,60 »: a number written with spaces between its thousands is one number
      q = String(q || "").replace(/(?<!\S)(\d{1,3}(?:[   ]\d{3})+)(?=(?:[.,]\d{1,2})?€?(?!\S))/g, function (s) { return s.replace(/\s/g, ""); });
      var out = [], n = q.length, i = 0, end;
      while (i < n) {
        var ch = q[i];
        if (/\s/.test(ch)) i++;
        else if (ch === "(" || ch === ")") { out.push([ch, ch, null]); i++; }
        else if (ch === '"') {
          end = q.indexOf('"', i + 1);
          if (end < 0) end = n;
          out.push(["phrase", q.slice(i + 1, end), null]);
          i = end + 1;
        } else if (ch === "-" && i + 1 < n && (q[i + 1] === "(" || q[i + 1] === '"')) { out.push(["not", "-", null]); i++; }
        else {
          var word = q.slice(i).match(/^[^\s()"]+/)[0];
          i += word.length;
          // field:"a phrase"
          if (word.slice(-1) === ":" && i < n && q[i] === '"' && has(FIELDS, fold(word.slice(0, -1)))) {
            end = q.indexOf('"', i + 1);
            if (end < 0) end = n;
            out.push(["phrase", q.slice(i + 1, end), fold(word.slice(0, -1))]);
            i = end + 1;
            continue;
          }
          if (has(OR_WORDS, word)) out.push(["or", word, null]);
          else if (has(AND_WORDS, word)) out.push(["and", word, null]);
          // -livret, -2025 (not that year), but -23,24 (an amount paid)
          else if (word.charAt(0) === "-" && word.length > 1 && (date(word.slice(1)) || !amount(word))) { out.push(["not", "-", null]); out.push(["word", word.slice(1), null]); }
          else if (word !== "-") out.push(["word", word, null]);
        }
      }
      return out;
    }
    // the words read as what they say: a field, an amount (« 20 à 30 » too), a date (« mars 2026 » too)
    function atoms(toks) {
      var out = [], num = new RegExp("^" + NUM + "€?$");
      for (var i = 0; i < toks.length;) {
        var kind = toks[i][0], text = toks[i][1], field = toks[i][2];
        if (kind !== "word") { out.push(kind === "phrase" ? { t: "phrase", v: text, f: field } : kind); i++; continue; }
        var nxt = toks[i + 1], after = toks[i + 2];
        if (nxt && after && nxt[0] === "word" && fold(nxt[1]) === "a" && after[0] === "word" && num.test(text) && num.test(after[1])) {
          var lh = [amount(text)[0], amount(after[1])[0]].sort(function (x, y) { return x - y; });
          out.push({ t: "amount", lo: lh[0], hi: lh[1], sign: null });
          i += 3;
          continue;
        }
        var month = months[fold(text).replace(/\.+$/, "")];
        if (month) {
          var year = nxt && nxt[0] === "word" ? date(nxt[1]) : null;
          if (year && year[1] === null) { out.push({ t: "date", y: year[0], m: month, d: null }); i += 2; }
          else { out.push({ t: "date", y: null, m: month, d: null }); i++; }
          continue;
        }
        var colon = text.indexOf(":"), prefix = colon > 0 ? fold(text.slice(0, colon)) : "", rest = colon > 0 ? text.slice(colon + 1) : "";
        if (rest && has(FIELDS, prefix)) { out.push({ t: "word", v: rest, f: prefix }); i++; continue; }
        var when = date(text), span = when ? null : amount(text);
        if (when) out.push({ t: "date", y: when[0], m: when[1], d: when[2] });
        else if (span) out.push({ t: "amount", lo: span[0], hi: span[1], sign: span[2] });
        else out.push({ t: "word", v: text, f: null });
        i++;
      }
      return out;
    }
    // the search as a tree, null for an empty search
    function parse(q) {
      var items = atoms(tokens(q)), pos = 0;
      function peek() { return pos < items.length ? items[pos] : null; }
      function take() { return items[pos++]; }
      function closing(x) { return x === null || x === ")" || x === "or" || x === "and"; }
      function group(inner) {
        var parts = [];
        for (var x = peek(); x !== null; x = peek()) {
          if (x === ")") { take(); if (inner) break; continue; }
          if (x === "and" || x === "or") { take(); continue; }
          parts.push(either());
        }
        parts = parts.filter(Boolean);
        return !parts.length ? null : parts.length === 1 ? parts[0] : { t: "and", items: parts };
      }
      function either() {
        var options = [unary()];
        while (peek() === "or") {
          take();
          if (closing(peek())) break;
          options.push(unary());
        }
        options = options.filter(Boolean);
        return !options.length ? null : options.length === 1 ? options[0] : { t: "or", items: options };
      }
      function unary() {
        var x = take();
        if (x === "not") {
          if (closing(peek())) return null;
          var inner = unary();
          return inner ? { t: "not", item: inner } : null;
        }
        if (x === "(") return group(true);
        if (x === ")" || x === "or" || x === "and") return null;
        return x;
      }
      return group(false);
    }
    function values(item, field) {
      var own = c.values ? c.values(item, field) : null;
      if (own) return own;
      return (field ? FIELDS[field] || [] : EVERY).map(function (k) { return item[k]; }).filter(Boolean);
    }
    function match(node, item) {
      if (!node) return true;
      switch (node.t) {
        case "and": return node.items.every(function (x) { return match(x, item); });
        case "or": return node.items.some(function (x) { return match(x, item); });
        case "not": return !match(node.item, item);
        case "word": { var v = fold(node.v); return !v || values(item, node.f).some(function (x) { return fold(x).indexOf(v) >= 0; }); }
        case "phrase": { var rx = exact(node.v); return !rx || values(item, node.f).some(function (x) { return rx.test(String(x)); }); }
        case "amount": {
          var n = amountOf(item) || 0, a = Math.abs(n);
          if (a < node.lo - 0.005 || a > node.hi + 0.005) return false;
          return node.sign === null || (n > 0) === (node.sign === "+");
        }
        case "date": {
          var m = String(dateOf(item) || "").slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) return false;
          return (node.y === null || node.y === +m[1]) && (node.m === null || node.m === +m[2]) && (node.d === null || node.d === +m[3]);
        }
      }
      return true;
    }
    // the words and phrases it looks for, not those it excludes
    function terms(node, out, negated) {
      out = out || [];
      if (!node) return out;
      if (node.t === "and" || node.t === "or") node.items.forEach(function (x) { terms(x, out, negated); });
      else if (node.t === "not") terms(node.item, out, !negated);
      else if ((node.t === "word" || node.t === "phrase") && !negated && node.v.trim()) out.push({ t: node.t, v: node.v, f: node.f });
      return out;
    }
    return { parse: parse, match: match, terms: function (node) { return terms(node, [], false); }, fold: fold, exact: exact };
  }

  /* ---------- the filter panel ---------- */
  function swatchHtml(color) { return color ? '<i class="swatch" style="--n:' + ds.esc(color) + '"></i>' : ""; }
  function rowHtml(o) {
    var w = _.words(WORDS), g = ds.esc(o.group || ""), v = ds.esc(o.value == null ? "" : o.value), label = ds.esc(o.label);
    return '<span class="frow"><button type="button" class="chip" aria-pressed="' + (o.on ? "true" : "false") + '" data-g="' + g + '" data-v="' + v + '">' +
      swatchHtml(o.color) + label + "</button>" + (o.more || "") +
      (o.only ? '<button type="button" class="filter-only" data-only="' + g + '" data-v="' + v + '" aria-label="' + ds.esc(w.only) + label + '" title="' + ds.esc(w.only) + label + '">' +
        ds.ico.html("eye") + "</button>" : "") + "</span>";
  }
  function groupHtml(o) {
    var w = _.words(WORDS);
    return '<div class="fgroup"><span class="fhead">' + ds.esc(o.title) +
      (o.all ? '<button type="button" class="filter-all" data-all="' + ds.esc(o.all) + '">' + w.all + "</button>" : "") + "</span>" + (o.rows || []).join("") + "</div>";
  }
  function filters(holder, groups, o) {
    holder = _.find(holder);
    o = o || {};
    var off = o.off || (o.key ? ds.store.get(o.key, {}) : {}) || {};
    function changed() {
      if (o.key) ds.store.set(o.key, off);
      draw();
      if (o.onChange) o.onChange(off);
    }
    function draw() {
      if (!holder) return;
      var h = ds.h, w = _.words(WORDS);
      holder.replaceChildren.apply(holder, (groups || []).map(function (g) {
        var anyOff = g.items.some(function (x) { return off[x.key]; });
        return h("div", { class: "fgroup" }, [h("span", { class: "fhead" }, [g.title, anyOff && g.all !== false ? h("button", { type: "button", class: "filter-all", text: w.all,
          onclick: function () { g.items.forEach(function (x) { delete off[x.key]; }); changed(); } }) : null])].concat(g.items.map(function (it) {
          var lead = typeof it.lead === "function" ? it.lead(it) : it.lead;
          return h("span", { class: "frow" }, [h("button", { type: "button", class: "chip", "aria-pressed": off[it.key] ? "false" : "true",
            onclick: function () { if (off[it.key]) delete off[it.key]; else off[it.key] = true; changed(); } },
            [lead || null, it.color ? h("i", { class: "swatch", style: "--n:" + it.color }) : null, it.icon ? ds.ico(it.icon) : null, it.label]),
            it.only === false ? null : h("button", { type: "button", class: "filter-only", "aria-label": w.only + it.label, title: w.only + it.label,
              onclick: function () { g.items.forEach(function (x) { off[x.key] = true; }); delete off[it.key]; changed(); } }, [ds.ico("eye")])]);
        })));
      }));
    }
    draw();
    return { off: function () { return off; }, draw: draw, any: function () { return Object.keys(off).length > 0; } };
  }
  filters.row = rowHtml;
  filters.group = groupHtml;

  /* ---------- the filters in use ---------- */
  function chipsHtml(chips) {
    var w = _.words(WORDS);
    if (!chips || !chips.length) return "";
    return chips.map(function (x) {
      return '<button class="btn is-pill fchip" type="button" data-k="' + ds.esc(x.key) + '" title="' + ds.esc(w.remove) + '" aria-label="' + ds.esc(w.removeThis(x.label)) + '">' +
        ds.ico.html("close") + ds.esc(x.label) + "</button>";
    }).join("") + '<button class="btn fchip clear" type="button" data-k="*">' + w.clear + "</button>";
  }
  function filterChips(holder, chips, o) {
    holder = _.find(holder);
    if (!holder) return null;
    o = o || {};
    holder.classList.add("filter-chips");
    holder.innerHTML = chipsHtml(chips);
    holder.hidden = !chips || !chips.length;
    if ((o.onRemove || o.onClear) && !holder._dsChips) {
      holder._dsChips = true;
      holder.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("button[data-k]");
        if (!b) return;
        var k = b.getAttribute("data-k");
        if (k === "*") { if (holder._dsChipsO.onClear) holder._dsChipsO.onClear(); }
        else if (holder._dsChipsO.onRemove) holder._dsChipsO.onRemove(k);
      });
    }
    holder._dsChipsO = o;
    return holder;
  }
  filterChips.html = chipsHtml;

  ds.query = query; ds.filters = filters; ds.filterChips = filterChips;
})();
