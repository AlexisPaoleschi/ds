/* ds 2.40.0 · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */
/* The tools' behaviours, Bank's and Studio's only, in dist/ds-tools.js, which a page links after ds.js (it uses its
   ds.toast and ds.api, and the core's helpers): ds.drawer(name, {onChange}) runs a page's filters drawer;
   ds.status(holder, {…}) draws the state of its sources; ds.jobs(holder, jobs) draws the syncs of a settings page;
   ds.busy runs the header's loading wheel; ds.trouble(key, {…}) tells a source that failed, once, with « Réessayer ».
   Their own words follow the page's language, <html lang>: English for "en…", French otherwise. */
(function () {
  "use strict";
  var _ = window.ds._, tag = _.el, el = _.el, ico = window.ds.ico, date = _.date, TZ = "Europe/Paris";
  var WORDS = _.table({
    fr: { openFilters: "Ouvrir les filtres", closeFilters: "Fermer les filtres",
          journal: "Journal", run: "Lancer", runNow: " maintenant", started: "Lancé", running: "En cours", allLogs: "Tout sur Render ↗",
          live: "En direct, passage en cours", lastRuns: "Derniers passages", loading: "Chargement…", loaded: "Chargement terminé",
          nothing: "Rien d’écrit depuis le démarrage du serveur.", journalOf: function (x) { return "Journal : " + x; },
          retry: "Réessayer", tryingAgain: "nouvel essai…", stillFailing: "toujours impossible.", upToDate: "à jour" },
    en: { openFilters: "Open the filters", closeFilters: "Close the filters",
          journal: "Log", run: "Run", runNow: " now", started: "Started", running: "Running", allLogs: "All on Render ↗",
          live: "Live, running now", lastRuns: "Last runs", loading: "Loading…", loaded: "Loading done",
          nothing: "Nothing written since the server started.", journalOf: function (x) { return "Log: " + x; },
          retry: "Try again", tryingAgain: "trying again…", stillFailing: "still failing.", upToDate: "up to date" }
  });
  // read when a word is shown, so that a page that changes its language is followed
  function words() { return _.words(WORDS); }
  function toast(o) { return window.ds.toast(o); }
  function api(method, url, body, o) { return window.ds.api(method, url, body, o); }

  /* ds.drawer(name, {onChange}): the filters' drawer of a page. Its markup: the edge tab
     <button class="edgetab" data-drawer-toggle="name">, the layout <div class="side-layout" data-drawer="name"> with its
     .scrim, and a close button with data-drawer-close="name". The name is also the device's key that remembers whether it
     was left open. Escape closes the phone's drawer, which covers the page: opening it moves the focus into it, closing it
     gives the focus back to the tab. Returns {open, set(open), toggle(), mark(on)}: mark(true) puts the gold dot on the tab
     while a filter hides something. A page that draws itself again reads .open in onChange (its markup carries the same
     data- names, and the class open when .open). */
  var drawers = {};
  function phone() { return window.matchMedia("(max-width: 768px)").matches; }
  function paint(name) {
    var d = drawers[name], w = words();
    document.querySelectorAll('[data-drawer="' + name + '"]').forEach(function (el) { el.classList.toggle("open", d.open); });
    document.querySelectorAll('[data-drawer-toggle="' + name + '"]').forEach(function (tab) {
      tab.classList.toggle("on", d.open);
      // the gold dot on the tab while a filter hides something (mark)
      var dot = tab.querySelector(".fdot");
      if (d.marked && !dot) { dot = document.createElement("i"); dot.className = "fdot"; dot.setAttribute("aria-hidden", "true"); tab.appendChild(dot); }
      if (!d.marked && dot) dot.remove();
      tab.setAttribute("aria-expanded", d.open ? "true" : "false");
      tab.setAttribute("aria-label", d.open ? w.closeFilters : w.openFilters);
    });
  }
  function drawer(name, opts) {
    var d = drawers[name] = { open: false, onChange: (opts || {}).onChange };
    d.open = _.read(name) === "1";
    // open on a phone, it covers the page: a layer, which Escape closes and Tab stays inside
    var cover = { el: function () { return document.querySelector('[data-drawer="' + name + '"] .side'); }, close: function () { d.set(false); } };
    function covers() { if (d.open && phone()) _.layer(cover); else _.unlayer(cover); }
    d.set = function (open) {
      var was = d.open;
      d.open = !!open;
      _.write(name, d.open ? "1" : "0");
      paint(name);
      covers();
      if (was === d.open) return;
      if (d.onChange) d.onChange(d.open);
      if (!phone()) return;
      var to = d.open ? document.querySelector('[data-drawer="' + name + '"] .side') : document.querySelector('[data-drawer-toggle="' + name + '"]');
      if (to) { if (d.open) to.setAttribute("tabindex", "-1"); to.focus({ preventScroll: true }); }
    };
    d.toggle = function () { d.set(!d.open); };
    d.mark = function (on) { d.marked = !!on; paint(name); };
    paint(name);
    covers();
    return d;
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-drawer-toggle], [data-drawer-close], [data-drawer] > .scrim") : null;
    if (!t) return;
    var name = t.getAttribute("data-drawer-toggle") || t.getAttribute("data-drawer-close") || t.parentNode.getAttribute("data-drawer");
    var d = drawers[name];
    if (!d) return;
    if (t.hasAttribute("data-drawer-toggle")) d.toggle(); else d.set(false);
  });

  /* ds.status(holder, {summary, late, rows, link}) draws the state of a page's sources in holder (its <footer>): one line
     that says it all (summary, a gold dot when late), opening on one row per source,
     rows: [{icon, name, state, every, ok, detail}] — what was read and when (state), how often (every), whether it is on
     time (ok) and, when not, why (detail) — then link: {href, text}. Whether it is open stays across redraws and visits. */
  function status(holder, o) {
    var key = "ds-status " + location.pathname, det = tag("details", "status"), summary = tag("summary"), list = tag("ul");
    det.open = _.read(key, true) === "1";
    summary.append(tag("i", "dot" + (o.late ? " warn" : "")), o.summary || "");
    (o.rows || []).forEach(function (r) {
      var li = tag("li", r.ok ? "" : "late"), sn = tag("span", "sn"), sw = tag("span", "sw");
      sn.append(ico(r.icon || "doc"), r.name || "");
      sw.append(ico(r.ok ? "check" : "alert"), r.state || "");
      li.append(sn, sw, tag("span", "sf", r.every || ""));
      if (r.detail) li.append(tag("span", "sd", r.detail));
      list.append(li);
    });
    if (o.link) {
      var last = tag("li", "sl"), a = tag("a", "", o.link.text);
      a.href = o.link.href;
      last.append(a);
      list.append(last);
    }
    det.append(summary, list);
    det.addEventListener("toggle", function () { _.write(key, det.open ? "1" : "0", true); });
    holder.replaceChildren(det);
    return det;
  }


  /* ds.jobs(holder, jobs, {logsLink, reload}) draws a settings page's syncs, one block per job:
     {key, label, state ("run", true, false or null: its dot), when, summary, bad (the summary in red), run (a function
     that starts it and returns a promise; no button without it), running, paused, own (a node: its switch),
     subs ([nodes]: more switches)}. « Journal » opens the job's last lines, read from GET /api/jobs/<key>/logs?after=<n>
     every 2 s while it is open and the page seen; the list follows its end unless one scrolls up. logsLink: where all
     the lines are; reload: what to call once a job was started. Call it again with the jobs' new state: the open logs stay.
     A job's block has the id « job-<key> »; ds.jobs.open(key) opens its journal as its button does, for a page's address
     that asks for it (/settings#patreon/journal). */
  var logs = {};
  function logState(key) { return logs[key] || (logs[key] = { open: false, lines: [], last: 0, stick: true, top: 0, list: null, loaded: false, busy: false }); }
  function lineEl(x) {
    var bad = /^(ERROR|ERREUR|CRITICAL)$/.test(x.level) || x.text.indexOf("✖") >= 0;
    var warn = !bad && (/^(WARNING|ATTENTION)$/.test(x.level) || x.text.indexOf("⚠") >= 0);
    var at = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date(x.t));
    return el("div", "ll" + (/^=====/.test(x.text) ? " banner" : "") + (bad ? " lbad" : warn ? " lwarn" : ""), [tag("span", "lt", at), tag("span", "lx", x.text)]);
  }
  function fetchLogs(key) {
    var st = logState(key);
    if (st.busy) return;
    st.busy = true;
    api("GET", "/api/jobs/" + key + "/logs?after=" + st.last).then(function (d) {
      st.busy = false;
      var first = !st.loaded, list = st.list;
      st.loaded = true;
      if (!d.lines.length) { if (first && list) list.replaceChildren(tag("p", "none", words().nothing)); return; }
      st.lines = st.lines.concat(d.lines).slice(-800);
      st.last = d.last;
      if (!list || !list.isConnected) return;
      if (first) list.textContent = "";
      d.lines.forEach(function (x) { list.append(lineEl(x)); });
      while (list.children.length > 800) list.removeChild(list.firstChild);
      if (st.stick) list.scrollTop = list.scrollHeight;
    }).catch(function () { st.busy = false; });
  }
  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    Object.keys(logs).forEach(function (k) { if (logs[k].open) fetchLogs(k); });
  }, 2000);
  var shownJobs = null;
  function jobs(holder, list, opts) {
    opts = opts || {};
    shownJobs = [holder, list, opts];
    var w = words();
    function draw() { jobs(holder, list, opts); }
    holder.replaceChildren.apply(holder, list.map(function (j) {
      var st = logState(j.key), dot = j.state === "run" ? "run" : j.state === true ? "ok" : j.state === false ? "bad" : "";
      var go = null;
      if (j.run) {
        go = tag("button", "go");
        go.type = "button";
        go.disabled = !!(j.paused || j.running);
        if (j.running) go.textContent = w.running;
        else go.append(el("span", "", [w.run, tag("span", "mx", w.runNow)]));
        go.addEventListener("click", function () {
          go.disabled = true;
          go.textContent = w.started;
          Promise.resolve().then(j.run).catch(function (e) { toast({ type: "bad", text: e.message }); })
            .then(function () { if (opts.reload) setTimeout(opts.reload, 800); });
        });
      }
      var jl = tag("button", "jl", w.journal);
      jl.type = "button";
      jl.setAttribute("aria-expanded", st.open ? "true" : "false");
      jl.addEventListener("click", function () {
        st.open = !st.open;
        draw();
        if (st.open) fetchLogs(j.key);
      });
      var panel = null;
      if (st.open) {
        var lines = tag("div", "logs");
        lines.setAttribute("role", "log");
        lines.setAttribute("aria-label", w.journalOf(j.label));
        lines.tabIndex = 0;
        if (st.lines.length) st.lines.forEach(function (x) { lines.append(lineEl(x)); });
        else lines.append(tag("p", "none", st.loaded ? w.nothing : w.loading));
        lines.addEventListener("scroll", function () {
          st.stick = lines.scrollTop + lines.clientHeight >= lines.scrollHeight - 8;
          st.top = lines.scrollTop;
        });
        st.list = lines;
        // drawn again with its job, the list keeps its place, or follows the end
        requestAnimationFrame(function () { lines.scrollTop = st.stick ? lines.scrollHeight : st.top; });
        var link = null;
        if (opts.logsLink) { link = tag("a", "", w.allLogs); link.href = opts.logsLink; link.target = "_blank"; link.rel = "noopener"; }
        var live = el("span", "live", [tag("i", "dot" + (j.running ? " run" : "")), j.running ? w.live : w.lastRuns]);
        live.firstChild.setAttribute("aria-hidden", "true");
        panel = el("div", "logbox", [el("div", "loghead", [live, link]), lines]);
      }
      var mark = tag("i", "dot " + dot);
      mark.setAttribute("aria-hidden", "true");
      var block = el("div", "job", [
        el("div", "name", [mark, j.label]),
        tag("div", "when", j.when || ""),
        j.summary ? tag("div", "sum" + (j.bad ? " bad" : ""), j.summary) : null,
        j.subs && j.subs.length ? el("div", "subs", j.subs) : null,
        el("div", "acts", [j.own || null, el("div", "btns", [jl, go])]),
        panel
      ]);
      block.id = "job-" + j.key;
      return block;
    }));
  }

  /* ds.busy: the loading's wheel in the header, <span class="busy"> in header.top with its .spin, .okc tick, .pc share
     and .bt words. start(text, {key, expected, header}) shows it at 0% (in header, or the page's header.top). The share
     climbs at an even speed, so as to reach 99% when this kind of loading (key) ends: as long as it took last time, or
     expected ms the first time. pct(p) says how much of the work is done (Studio: the rows read): the first time, with no
     length known, the end is then foreseen from the work too, and the speed bends towards it gently, never a jump.
     It never goes back, and waits at 99% for a loading longer than foreseen. done() runs on to 100% in a moment, then
     shows a green tick that fades, and remembers how long it took; done(false) just stops. say(word) shows a word in
     place of the share (Studio's « calcul… » once every read is in, while the page draws), until done(). While a first
     loading covers the page, its share (#boot-pc) is the same. The share and the word are only seen: screen readers hear
     the words of start() once, then « Chargement terminé » from done(), not every step of the share. */
  var STEP = 50;
  var bz = { shown: 0, speed: 0, work: 0, arrive: 0, known: false, tick: null, end: null, start: 0, key: null, expected: 3000, top: null, word: false };
  function busyTop() { return bz.top || document.querySelector("header.top"); }
  function busyText(text) {
    var top = busyTop(), pc = top && top.querySelector(".busy .pc"), boot = document.getElementById("boot-pc");
    // seen, not read aloud: the share changes every 50ms inside a region screen readers follow
    if (pc) { pc.setAttribute("aria-hidden", "true"); pc.textContent = text; }
    if (boot) { boot.setAttribute("aria-hidden", "true"); boot.textContent = text; }
  }
  function busyTimes() { try { return JSON.parse(_.read("ds-busy-ms") || "{}"); } catch (e) { return {}; } }
  // one step of the share: the speed that reaches 99% at the end foreseen (arrive), taken gently (a tenth of the change
  // at each step); between two words of the work the end stays put, so the speed stays even
  function busyStep() {
    var want = Math.max(0, (99 - bz.shown) / Math.max(bz.arrive - Date.now(), 300));
    bz.speed = bz.speed ? bz.speed + (want - bz.speed) * 0.1 : want;
    bz.shown = Math.min(99, bz.shown + bz.speed * STEP);
    busyText(Math.floor(bz.shown) + "%");
  }
  var busy = {
    start: function (text, o) {
      o = o || {};
      bz.top = o.header || null;
      var top = busyTop();
      if (!top) return;
      clearTimeout(bz.end); clearInterval(bz.tick);
      bz.shown = 0; bz.speed = 0; bz.work = 0; bz.start = Date.now(); bz.key = o.key || null; bz.word = false;
      bz.known = !!(bz.key && busyTimes()[bz.key]);
      bz.expected = (bz.key && busyTimes()[bz.key]) || o.expected || 3000;
      bz.arrive = bz.start + bz.expected;
      top.classList.remove("loading-done");
      top.classList.add("loading");
      var bt = top.querySelector(".busy .bt");
      if (bt) bt.textContent = text || words().loading;
      busyText("0%");
      bz.tick = setInterval(busyStep, STEP);
    },
    pct: function (p) {
      var w = Math.min(1, (p || 0) / 100);
      if (w <= bz.work) return;
      bz.work = w;
      // a loading whose length is known keeps its even speed: the work read says little of the time left (Studio's rows
      // are not as long to read as one another); only the first time, with no length known, does it guide the end
      if (bz.known) return;
      // the end foreseen again: the work left times a total between last time's and the one the pace so far gives
      // (elapsed / w), the latter weighing more as the work goes on
      var now = Date.now(), elapsed = now - bz.start;
      bz.arrive = now + (1 - w) * (bz.expected * (1 - w) + elapsed);
    },
    done: function (ok) {
      var top = busyTop();
      clearInterval(bz.tick); bz.tick = null;
      if (!top) return;
      if (ok === false) { top.classList.remove("loading"); busyText(""); return; }
      if (bz.key) { var t = busyTimes(); t[bz.key] = Math.max(500, Date.now() - bz.start); _.write("ds-busy-ms", JSON.stringify(t)); }
      // what is left runs on to 100% in a quarter of a second, evenly, then the tick
      var from = bz.word ? 100 : bz.shown, steps = 5, n = 0;
      bz.tick = setInterval(function () {
        n++;
        if (!bz.word) busyText(Math.floor(from + (100 - from) * n / steps) + "%");
        if (n < steps) return;
        clearInterval(bz.tick); bz.tick = null;
        bz.end = setTimeout(function () {
          top.classList.remove("loading");
          busyText("");
          // the tick's animation starts again even when it played a moment ago
          void top.offsetWidth;
          top.classList.add("loading-done");
          // the one word screen readers hear at the end, once the region shows again with its tick
          var bt = top.querySelector(".busy .bt");
          if (bt) bt.textContent = words().loaded;
          bz.end = setTimeout(function () { top.classList.remove("loading-done"); }, 2000);
        }, 100);
      }, STEP);
    },
    say: function (word) {
      var top = busyTop();
      if (!top || !top.classList.contains("loading")) return;
      clearInterval(bz.tick); bz.tick = null;
      bz.word = true;
      busyText(word);
    },
    active: function () { var top = busyTop(); return !!top && top.classList.contains("loading"); }
  };

  /* ds.trouble(key, {name, text, retry, check, link}): a source that could not be read says so once a visit, in an error
     bubble « name : text », with « Réessayer » when retry is given (or a link: {label, href} instead, to sign in again).
     Closed, it stays closed until ds.trouble.ok(key) says the source works again: its next failure is told. Réessayer turns
     to « name : nouvel essai… », awaits retry(), then asks check(): nothing when it works (« name : à jour »), true or why
     when it still fails (« name : toujours impossible. why », with Réessayer again). Without check, retry() not throwing
     is enough. */
  var troubles = {};
  function troubleAction(key, o) {
    if (o.link) return { label: o.link.label, run: function () { location.href = o.link.href; } };
    return o.retry ? { label: words().retry, run: function () { retryTrouble(key, o); } } : null;
  }
  function retryTrouble(key, o) {
    var t = troubles[key] || (troubles[key] = {}), w = words();
    t.trying = true;
    var said = toast({ type: "busy", text: o.name + " : " + w.tryingAgain });
    Promise.resolve().then(o.retry)
      .then(function () { return o.check ? o.check() : null; },
            function (e) { return o.check ? o.check() : { why: String((e && e.message) || "") }; })
      .then(function (r) {
        t.trying = false;
        // check() answers nothing when it works, true or why when it does not; a retry that threw, without check, failed
        if (r) {
          var why = typeof r === "object" ? r.why : r === true ? "" : String(r);
          t.shown = true;
          said.update({ type: "bad", text: o.name + " : " + w.stillFailing + (why ? " " + why : ""), action: troubleAction(key, o) });
        } else {
          t.shown = false;
          said.update({ type: "good", text: o.name + " : " + w.upToDate });
        }
      });
  }
  function trouble(key, o) {
    var t = troubles[key] || (troubles[key] = {});
    if (t.shown || t.trying) return null;
    t.shown = true;
    return toast({ type: "bad", text: o.name + " : " + o.text, action: troubleAction(key, o) });
  }
  trouble.ok = function (key) { var t = troubles[key]; if (t && !t.trying) t.shown = false; };


  window.ds.drawer = drawer;
  window.ds.status = status;
  // a job's journal opened from outside its button: drawn again with the jobs last shown, then read
  jobs.open = function (key) {
    var st = logState(key);
    if (st.open) return;
    st.open = true;
    if (shownJobs) jobs.apply(null, shownJobs);
    fetchLogs(key);
  };
  window.ds.jobs = jobs;
  window.ds.busy = busy;
  window.ds.trouble = trouble;
})();
/* ds.sheet(el, {onOpen, onClose}): the sheet of src/sheet.css, its veil el (<div class="sheet" hidden>) around its
   .sheet-panel. Returns {open(from), close(), toggle(), isOpen}; called again on the same el, it gives the same sheet.
   Opening it moves the focus into the panel, and Tab stays there; closing gives the focus back to what had it (or to
   from, e.g. the row that opened it). Escape, a click on the veil, its cross (.sheet-x) or a [data-sheet-close] close
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
    el.querySelectorAll(".sheet-x").forEach(function (x) { if (!x.hasAttribute("aria-label")) x.setAttribute("aria-label", _.words().close); });
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
      if (e.target === el || (e.target.closest && e.target.closest(".sheet-x, [data-sheet-close]"))) s.close();
    });
    return s;
  }
  window.ds = window.ds || {};
  window.ds.sheet = sheet;
})();
/* The behaviour of the table of src/table.css.
   ds.sortable(table, {by, up, key, menu, onSort}) sorts it by its column titles, <th><button class="sort"
   data-sort="date">Date</button></th>. A click on a title sorts by that column; again, the other way. A new column
   starts the way one expects: names from A, figures and dates from the biggest and latest (or as its data-first says,
   "up" or "down"). The th in use carries aria-sort, which draws its arrow.
     by, up: the column and the way to start with (up: from the smallest, A, the oldest), unless the device remembers
     another choice under key (localStorage, as [by, up]); menu: a <select> that sorts too, the phone's menu, whose
     options say "by|1" (up) or "by|0" (down); it follows the titles and the titles follow it.
     onSort(by, up): the page sorts its own list and draws it again (it holds more rows than are shown, say); without
     it, the rows of the tbody are put in order here, by each cell's data-value or else its text, figures as figures,
     names in French order, empty cells last whichever the way.
   Returns {by, up, set(by, up)}; called again on the same table it gives the same, so a page that draws its table anew
   (Studio) calls it again on the new one and finds its choice under key.
   ds.selection(holder, {bar, count, onChange}) picks rows: each row of holder with a data-key and its box
   <input type="checkbox" class="sel-box">; a click on a box picks or drops its row, a shift-click the rows since the
   last box; the box .sel-all picks every row shown, half-ticked when some are. A picked row is .is-selected. bar: the
   .selbar (else the one in holder), shown while something is picked, its .selbar-n saying how many (count(n), in
   words), its [data-sel-clear] dropping all. The choice is kept by key, so a list drawn again keeps it: call paint().
   Returns {keys(), has(key), set(key, on), clear(), paint()}; onChange(keys) after each change. */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find;
  var WORDS = _.table({
    fr: { picked: function (n) { return n + (n > 1 ? " lignes choisies" : " ligne choisie"); } },
    en: { picked: function (n) { return n + (n > 1 ? " rows selected" : " row selected"); } }
  });
  function words() { return _.words(WORDS); }
  function store(key, v) { _.write(key, JSON.stringify(v)); }
  function stored(key) { try { return JSON.parse(_.read(key)); } catch (e) { return null; } }

  // a cell's place in its row, its colspans counted, and the cell at that place in another row
  function place(cell) {
    var at = 0, c = cell.parentNode.firstElementChild;
    for (; c && c !== cell; c = c.nextElementSibling) at += c.colSpan || 1;
    return at;
  }
  function cellAt(row, at) {
    for (var c = row.firstElementChild, n = 0; c; c = c.nextElementSibling) {
      n += c.colSpan || 1;
      if (n > at) return c;
    }
    return null;
  }
  // what a cell holds: its data-value, else its text; « −1 234,50€ » and « 12% » are figures
  function value(cell) {
    if (!cell) return null;
    var raw = cell.hasAttribute("data-value") ? cell.getAttribute("data-value") : cell.textContent;
    raw = raw.trim();
    if (!raw) return null;
    var n = raw.replace(/[\s  €%]/g, "").replace(/^\+/, "").replace(/^[−–]/, "-").replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(n) ? parseFloat(n) : raw;
  }
  var collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });
  var ISO = /^\d{4}-\d{2}(-\d{2})?/;

  function sortable(table, o) {
    table = find(table);
    if (!table) return null;
    if (table._dsSort) { if (o) table._dsSort.o = o; return table._dsSort; }
    var s = { table: table, o: o || {}, by: null, up: false };
    table._dsSort = s;
    var saved = s.o.key ? stored(s.o.key) : null;
    if (saved && saved.length === 2) { s.by = saved[0]; s.up = !!saved[1]; }
    else if (s.o.by) { s.by = s.o.by; s.up = !!s.o.up; }
    function buttons() { return [].slice.call(table.querySelectorAll("thead .sort[data-sort]")); }
    function button(by) { return buttons().filter(function (b) { return b.getAttribute("data-sort") === by; })[0]; }
    function rows() { return [].slice.call(table.tBodies).reduce(function (all, b) { return all.concat([].slice.call(b.rows)); }, []); }
    // a new column's first way: its data-first, else from the biggest for figures and dates, from A for words
    function first(b) {
      var f = b.getAttribute("data-first");
      if (f) return f === "up";
      var at = place(b.closest("th")), list = rows();
      for (var i = 0; i < list.length; i++) {
        var v = value(cellAt(list[i], at));
        if (v != null) return typeof v === "string" && !ISO.test(v);
      }
      return false;
    }
    function mark() {
      buttons().forEach(function (b) {
        var on = b.getAttribute("data-sort") === s.by;
        b.closest("th").setAttribute("aria-sort", on ? (s.up ? "ascending" : "descending") : "none");
      });
      var menu = find(s.o.menu), v = s.by + "|" + (s.up ? 1 : 0);
      if (menu && [].some.call(menu.options, function (x) { return x.value === v; })) {
        menu.value = v;
        if (window.ds.pills && menu.closest(".pill")) window.ds.pills(menu.closest(".pill"));
      }
    }
    function order() {
      var b = button(s.by);
      if (!b) return;
      var at = place(b.closest("th")), way = s.up ? 1 : -1;
      [].forEach.call(table.tBodies, function (body) {
        var list = [].slice.call(body.rows).map(function (r, i) { return { r: r, v: value(cellAt(r, at)), i: i }; });
        list.sort(function (a, z) {
          if (a.v == null || z.v == null) return a.v == null && z.v == null ? a.i - z.i : a.v == null ? 1 : -1;
          var c = typeof a.v === "number" && typeof z.v === "number" ? a.v - z.v : collator.compare(String(a.v), String(z.v));
          // the same value: as they came
          return c ? c * way : a.i - z.i;
        });
        list.forEach(function (x) { body.appendChild(x.r); });
      });
    }
    s.set = function (by, up) {
      s.by = by;
      s.up = !!up;
      if (s.o.key) store(s.o.key, [s.by, s.up]);
      mark();
      if (s.o.onSort) s.o.onSort(s.by, s.up); else order();
      return s;
    };
    table.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("thead .sort[data-sort]");
      if (!b || !table.contains(b)) return;
      var by = b.getAttribute("data-sort");
      s.set(by, by === s.by ? !s.up : first(b));
    });
    // the menu sorts the last table given to it: a page that draws its table anew keeps one menu, and one listener
    var menu = find(s.o.menu);
    if (menu) {
      if (!menu._dsSort) menu.addEventListener("change", function () {
        var parts = menu.value.split("|");
        if (parts[0]) menu._dsSort.set(parts[0], parts[1] === "1");
      });
      menu._dsSort = s;
    }
    // drawn as chosen from the start; a page that sorts itself has drawn its list already
    mark();
    if (s.by && !s.o.onSort) order();
    return s;
  }

  function selection(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    if (holder._dsSel) { if (o) holder._dsSel.o = o; return holder._dsSel; }
    var sel = { o: o || {}, picked: new Set(), last: null };
    holder._dsSel = sel;
    function bar() { return find(sel.o.bar) || holder.querySelector(".selbar"); }
    function rows() { return [].filter.call(holder.querySelectorAll("[data-key]"), function (r) { return r.querySelector(".sel-box"); }); }
    function changed() { sel.paint(); if (sel.o.onChange) sel.o.onChange(sel.keys()); }
    sel.keys = function () { return Array.from(sel.picked); };
    sel.has = function (key) { return sel.picked.has(String(key)); };
    sel.set = function (key, on) { if (on) sel.picked.add(String(key)); else sel.picked.delete(String(key)); changed(); return sel; };
    sel.clear = function () { sel.picked.clear(); sel.last = null; changed(); return sel; };
    sel.paint = function () {
      var list = rows(), shown = 0;
      list.forEach(function (r) {
        var on = sel.picked.has(r.getAttribute("data-key"));
        r.classList.toggle("is-selected", on);
        r.querySelector(".sel-box").checked = on;
        if (on) shown++;
      });
      var all = holder.querySelector(".sel-all");
      if (all) { all.checked = list.length > 0 && shown === list.length; all.indeterminate = shown > 0 && shown < list.length; }
      var b = bar(), n = sel.picked.size;
      if (b) {
        b.hidden = !n;
        var count = b.querySelector(".selbar-n");
        if (count) count.textContent = (sel.o.count || words().picked)(n);
      }
      return sel;
    };
    holder.addEventListener("click", function (e) {
      var box = e.target.closest && e.target.closest(".sel-box");
      if (!box || !holder.contains(box)) return;
      var list = rows(), row = box.closest("[data-key]"), keys = list.map(function (r) { return r.getAttribute("data-key"); });
      var i = list.indexOf(row), j = sel.last == null ? -1 : keys.indexOf(sel.last);
      // shift-click picks, or drops, the whole range since the last box
      var span = e.shiftKey && j >= 0 ? list.slice(Math.min(i, j), Math.max(i, j) + 1) : [row];
      span.forEach(function (r) { if (box.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      sel.last = row.getAttribute("data-key");
      changed();
    });
    holder.addEventListener("change", function (e) {
      if (!e.target.classList || !e.target.classList.contains("sel-all")) return;
      rows().forEach(function (r) { if (e.target.checked) sel.picked.add(r.getAttribute("data-key")); else sel.picked.delete(r.getAttribute("data-key")); });
      changed();
    });
    // « Annuler » in the bar, wherever the bar is
    document.addEventListener("click", function (e) {
      var b = bar(), x = e.target.closest && e.target.closest("[data-sel-clear]");
      if (x && b && b.contains(x)) sel.clear();
    });
    sel.paint();
    return sel;
  }
  window.ds = window.ds || {};
  window.ds.sortable = sortable;
  window.ds.selection = selection;
})();
/* Calendar, taken from Studio's agenda: ds.calendar(holder, opts) draws the period head (the month's name, which opens a
   month picker, ds.datePick on months; the views; ‹ Aujourd’hui ›) and under it one of three views: a month of day
   cells, with the panel of the selected day below; a week of columns; a list of days, each in its panel.
   opts: view ("month", "week" or "list"), day (the selected day, "2026-11-09": today by default), items(key) (the day's
   items, in the order they are shown), panel(key, items) (what the day's panel holds under its title: one or more nodes;
   by default one row per item), row(item, key) (a row of a week's column or of the default panel), body (where the view
   goes: holder by default, after the head; a page may put it beside its filters), lines (lines in a cell, 8 by default),
   years ([first, last] in the picker), today (the day taken as today, for a page's checks), onChange(state),
   ready(state) (false while the page has yet to read the days asked for: the calendar keeps showing what it showed,
   with what the page now holds, and moves once a later draw() finds them ready; without it, it moves at once).
   An item: {title, color ("--c-bleu": its mark), mark ("square", "dot", "bar" or "thick"), open (an empty mark: not done
   yet), codes ([{text, color, title}] or "IG": small coloured labels), count ("2/4": a group, one title on several codes,
   which gives its title first and its codes last, the ones a narrow cell drops), time ("10h00": in a cell for a bar
   only), place, href, done (greyed), late (in red; lateText adds a red badge to its row), note (said on hover),
   span ({from, to}, its first and last days: what runs over several days, given on each of them)}.
   In the month, what runs over several days is one bar in its colour across them, at the same height in every cell it
   crosses, its title on its first day and on each Monday it goes on to, as Google's agenda draws a stay or a trip.
   On a phone, a cell shows a dot per item, three at most, then « +N ».
   Returns {draw(), set({view, day}), go(step), today(), state()}: state() is {view, day, from, to}, the days shown
   (to excluded), what a page reads to load them; onChange receives it after each move, then the page calls draw()
   once it has what those days hold. ds.calendar.row(item) and ds.calendar.mark(item) build a default row and a mark,
   for a page that fills the panels itself. */
(function () {
  "use strict";
  var DOTS = 3, VIEWS = ["month", "week", "list"];
  var _ = window.ds._, day = window.ds.day, el = _.el, tone = _.tone;
  var parisToday = day.today, at = day.at, addDays = day.add, weekStart = day.weekStart, fmt = day.format;
  var WORDS = _.table({
    fr: { month: "Mois", week: "Semaine", list: "Liste", prev: "Précédent", next: "Suivant", today: "Aujourd’hui", pick: "Aller à un autre mois",
          view: "Vue", before: "Jours précédents", hideBefore: "Masquer les jours précédents", none: "Rien ce jour-là.",
          count: function (n) { return n + (n > 1 ? " éléments" : " élément"); } },
    en: { month: "Month", week: "Week", list: "List", prev: "Previous", next: "Next", today: "Today", pick: "Go to another month",
          view: "View", before: "Days before", hideBefore: "Hide the days before", none: "Nothing on that day.",
          count: function (n) { return n + (n > 1 ? " items" : " item"); } }
  });
  function words() { return _.words(WORDS); }
  function longDay(key) { return window.ds.date(key, "weekday"); }
  function shortDay(key) { return window.ds.date(key, "day"); }

  function mark(it) {
    var m = el("i", "cal-mark" + (it.mark && it.mark !== "square" ? " is-" + it.mark : "") + (it.open ? " is-open" : ""));
    m.setAttribute("aria-hidden", "true");
    if (it.color) m.style.setProperty("--n", tone(it.color));
    return m;
  }
  function codes(it) {
    var list = it.codes == null ? [] : [].concat(it.codes);
    return list.map(function (c) {
      if (typeof c === "string") c = { text: c, color: it.color };
      var s = el("span", "cal-code", c.text);
      if (c.color) s.style.setProperty("--n", tone(c.color));
      if (c.title) s.title = c.title;
      return s;
    });
  }
  function isBar(it) { return it.mark === "bar" || it.mark === "thick"; }
  // a cell's line: its mark, its codes, its title, its count; on a phone the mark alone, for the first three
  function line(it, i) {
    var ln = el("span", "cal-line" + (isBar(it) ? " is-bar" : "") + (it.done ? " is-done" : "") + (it.late ? " is-late" : "") + (i >= DOTS ? " is-extra" : ""));
    ln.title = it.note || it.title || "";
    ln.append(mark(it));
    // a group's codes come after its title and its count: in a narrow cell they would otherwise hide the title
    if (!it.count) codes(it).forEach(function (c) { ln.append(c); });
    // a cell is narrow: only what happens at an hour (a bar) gives it there; the rows say every time
    ln.append(el("span", "cal-lt", (it.time && isBar(it) ? it.time + " " : "") + (it.title || "")));
    if (it.count) {
      ln.append(el("span", "cal-count", it.count));
      codes(it).forEach(function (c) { ln.append(c); });
    }
    return ln;
  }
  // a row of a day: its time, its mark and codes, its title (a link when it has one), its place
  function defaultRow(it) {
    var li = el("li", it.done ? "is-done" : "");
    li.append(el("span", "t", it.time || "—"), mark(it));
    codes(it).forEach(function (c) { li.append(c); });
    var t = el(it.href ? "a" : "span", "ttl", it.title || "");
    if (it.href) { t.href = it.href; t.target = "_blank"; t.rel = "noopener"; }
    li.append(t);
    if (it.place) li.append(el("span", "pl", it.place));
    if (it.late && it.lateText) li.append(el("span", "late", it.lateText));
    return li;
  }

  // the runs of a week: what runs over several days and crosses it, each in a lane, the same in every cell it crosses
  function runsOf(keys, itemsOf) {
    var runs = {}, order = [];
    keys.forEach(function (key, i) {
      itemsOf(key).forEach(function (it) {
        var s = it.span;
        if (!s || !s.from || !s.to || s.to <= s.from) return;
        var id = s.id || (it.title || "") + "|" + s.from + "|" + s.to;
        if (!runs[id]) { runs[id] = { id: id, it: it, a: i, b: i }; order.push(runs[id]); } else runs[id].b = i;
      });
    });
    // the longest first among those starting the same day; each takes the first lane free over its days
    order.sort(function (x, y) { return x.a - y.a || (y.b - y.a) - (x.b - x.a); });
    var lanes = [];
    order.forEach(function (r) {
      var l = 0;
      while (lanes[l] && lanes[l].some(function (o) { return o.a <= r.b && o.b >= r.a; })) l++;
      (lanes[l] = lanes[l] || []).push(r);
      r.lane = l;
    });
    return { keys: keys, order: order };
  }
  function runId(it) { return it.span ? it.span.id || (it.title || "") + "|" + it.span.from + "|" + it.span.to : null; }
  // a run's piece in a cell: its title where it starts, and on the first day of each week it goes on to
  function runLine(r, key, i) {
    var it = r.it, first = key === it.span.from || i === 0, last = key === it.span.to || i === 6;
    var ln = el("span", "cal-line is-run" + (first ? " is-first" : "") + (last ? " is-last" : "") + (it.done ? " is-done" : ""));
    ln.title = it.note || it.title || "";
    if (it.color) ln.style.setProperty("--n", tone(it.color));
    if (first) {
      // how many of this week's days it still crosses, for its title to run over them
      ln.style.setProperty("--run", String(r.b - i + 1));
      ln.append(el("span", "cal-lt", it.title || ""));
    }
    return ln;
  }

  function calendar(holder, opts) {
    opts = opts || {};
    var st = { view: VIEWS.indexOf(opts.view) >= 0 ? opts.view : "month", day: opts.day || null, before: false };
    var lines = opts.lines || 8;
    function today() { return opts.today || parisToday(); }
    if (!st.day) st.day = today();
    function itemsOf(key) { var x = opts.items ? opts.items(key) : null; return Array.isArray(x) ? x : []; }
    function rowOf(it, key) { var r = opts.row ? opts.row(it, key) : null; return r || defaultRow(it); }

    // the head, made once: a redraw keeps the focus on the button just used
    var w = words(), root = el("div", "cal"), head = el("div", "periodhead cal-head"), left = el("div", "periodleft");
    var title = el("button", "periodtitle"), h3 = el("h3"), pop = el("div", "cal-jump");
    title.type = "button";
    title.title = w.pick;
    title.append(h3, el("span", "caret", "▾"));
    var first = +today().slice(0, 4) - 10, last = +today().slice(0, 4) + 2;
    if (opts.years) { first = opts.years[0]; last = opts.years[1]; }
    left.append(title, pop);
    // the month picker is the design system's date picker on months alone: the year's menu between its arrows, then the
    // twelve months, which keep the name the calendar gave them (.cal-months); a month leads there, Escape or a tap
    // elsewhere closes it
    var jump = window.ds.datePick(pop, { modes: ["month"], value: window.ds.datePick.of("month", st.day), years: [first, last], today: opts.today, label: w.pick,
      opener: title, onPick: function (v) { move(v.from); },
      onDraw: function (box) { var g = box.querySelector(".dp-grid"); if (g) g.classList.add("cal-months"); } });
    var nav = el("div", "periodnav cal-nav"), tabs = el("div", "tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", w.view);
    VIEWS.forEach(function (v) {
      var b = el("button", "", w[v]);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.dataset.view = v;
      b.addEventListener("click", function () { if (st.view !== v) { st.view = v; changed(); } });
      tabs.append(b);
    });
    // the arrows are the sprite's chevrons (ds-icons.js)
    var prev = el("button", "btn is-icon", window.ds.ico("chevron-left")), now = el("button", "btn", w.today), next = el("button", "btn is-icon", window.ds.ico("chevron-right"));
    [prev, now, next].forEach(function (b) { b.type = "button"; });
    prev.setAttribute("aria-label", w.prev);
    next.setAttribute("aria-label", w.next);
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    now.addEventListener("click", goToday);
    // the arrows and « Aujourd’hui » stay together when a narrow row sends them under the views
    var arrows = el("span", "cal-arrows");
    arrows.append(prev, now, next);
    nav.append(tabs, arrows);
    head.append(left, nav);
    var body = opts.body || el("div");
    body.classList.add("cal-body");
    root.append(head);
    if (!opts.body) root.append(body);
    holder.replaceChildren(root);

    function state() {
      var from, to;
      if (st.view === "month") { from = weekStart(st.day.slice(0, 8) + "01"); to = addDays(from, 42); }
      else if (st.view === "week") { from = weekStart(st.day); to = addDays(from, 7); }
      else { from = addDays(st.day, st.before ? -7 : 0); to = addDays(st.day, 8); }
      return { view: st.view, day: st.day, from: from, to: to };
    }
    function changed() {
      draw();
      if (opts.onChange) opts.onChange(state());
    }
    function move(key) { st.day = key; changed(); }
    // a step: a month in the month view (to its first day), a week otherwise
    function go(step) {
      if (st.view === "month") {
        var y = +st.day.slice(0, 4), mo = +st.day.slice(5, 7) - 1 + step;
        y += Math.floor(mo / 12);
        mo = ((mo % 12) + 12) % 12;
        move(y + "-" + String(mo + 1).padStart(2, "0") + "-01");
      } else move(addDays(st.day, 7 * step));
    }
    function goToday() { move(today()); }

    function titleText() {
      if (st.view === "month") return [fmt(st.day, { month: "long" }), el("span", "yr", " " + st.day.slice(0, 4))];
      var a = st.view === "week" ? weekStart(st.day) : st.day;
      return [shortDay(a) + " – " + shortDay(addDays(a, st.view === "week" ? 6 : 7))];
    }
    function panel(key) {
      var items = itemsOf(key), sec = el("section", "cal-day" + (key === today() ? " is-today" : ""));
      sec.dataset.day = key;
      sec.append(el("h2", "cal-day-t", longDay(key)));
      var inside = opts.panel ? opts.panel(key, items) : null;
      if (inside == null) {
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); inside = ul; }
        else inside = el("p", "empty", words().none);
      }
      [].concat(inside).forEach(function (n) { if (n) sec.append(n); });
      return sec;
    }
    function cell(key, inMonth, week) {
      var items = itemsOf(key), t = today(), b = el("button", "cal-cell" + (inMonth ? "" : " is-off") + (key === t ? " is-today" : "") + (key === st.day ? " is-sel" : ""));
      b.type = "button";
      b.dataset.day = key;
      b.setAttribute("aria-pressed", key === st.day ? "true" : "false");
      // what the cell holds is told in the panel it opens: the cell says its day and how much is on it
      b.setAttribute("aria-label", longDay(key) + (items.length ? ", " + words().count(items.length) : ""));
      if (key === t) b.setAttribute("aria-current", "date");
      b.append(el("span", "cal-n", String(+key.slice(8))));
      // the runs first, each in its lane (an empty line where a lane is free that day), then the day's own items
      var i = week ? week.keys.indexOf(key) : -1, here = week ? week.order.filter(function (r) { return r.a <= i && r.b >= i; }) : [];
      var deepest = here.reduce(function (m, r) { return Math.max(m, r.lane); }, -1);
      for (var l = 0; l <= deepest; l++) {
        var r = here.filter(function (x) { return x.lane === l; })[0];
        b.append(r ? runLine(r, key, i) : el("span", "cal-line is-gap"));
      }
      var ids = here.map(function (r) { return r.id; });
      var own = items.filter(function (it) { return ids.indexOf(runId(it)) < 0; });
      var room = Math.max(0, lines - (deepest + 1));
      own.slice(0, room).forEach(function (it, n) { b.append(line(it, n)); });
      if (own.length > room) b.append(el("span", "cal-more", "+" + (own.length - room)));
      if (own.length > DOTS) b.append(el("span", "cal-more-dots", "+" + (own.length - DOTS)));
      b.addEventListener("click", function () {
        st.day = key;
        changed();
        var again = body.querySelector('.cal-cell[data-day="' + key + '"]');
        if (again) again.focus({ preventScroll: true });
      });
      return b;
    }
    function month() {
      var dow = el("div", "cal-dow"), grid = el("div", "cal-grid"), start = weekStart(st.day.slice(0, 8) + "01"), mo = st.day.slice(0, 7);
      for (var i = 0; i < 7; i++) dow.append(el("span", "", fmt(addDays(start, i), { weekday: "short" }).replace(".", "")));
      var week = null;
      for (var j = 0; j < 42; j++) {
        var key = addDays(start, j);
        // five weeks are enough for most months: a sixth row only when the month reaches it, and then a whole week,
        // its last days those of the next month, as on the rows above
        if (j === 35 && key.slice(0, 7) !== mo) break;
        if (j % 7 === 0) week = runsOf([0, 1, 2, 3, 4, 5, 6].map(function (n) { return addDays(key, n); }), itemsOf);
        grid.append(cell(key, key.slice(0, 7) === mo, week));
      }
      return [dow, grid, panel(st.day)];
    }
    function week() {
      var ws = weekStart(st.day), t = today(), out = el("div", "cal-week");
      for (var i = 0; i < 7; i++) {
        var key = addDays(ws, i), items = itemsOf(key), col = el("div", "cal-wcol" + (key === t ? " is-today" : "")), h = el("h3", "", fmt(key, { weekday: "long" }));
        col.dataset.day = key;
        h.append(el("span", "cal-wdate", shortDay(key)));
        col.append(h);
        if (items.length) { var ul = el("ul", "rows"); items.forEach(function (it) { ul.append(rowOf(it, key)); }); col.append(ul); }
        else col.append(el("p", "empty", "—"));
        out.append(col);
      }
      return [out];
    }
    // the list starts on the selected day and runs a week ahead; the week before stays folded above
    function list() {
      var w = words(), out = [], toggle = el("button", "cal-prev");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", st.before ? "true" : "false");
      toggle.append(el("span", "caret", st.before ? "▾" : "▸"), st.before ? w.hideBefore : w.before);
      toggle.addEventListener("click", function () {
        st.before = !st.before;
        changed();
        var again = body.querySelector(".cal-prev");
        if (again) again.focus({ preventScroll: true });
      });
      out.push(toggle);
      for (var i = st.before ? -7 : 0; i < 8; i++) out.push(panel(addDays(st.day, i)));
      return out;
    }
    // what is on screen; a page still reading the days asked for (ready) keeps it there, drawn again with what it holds
    var shown = null;
    function draw() {
      var want = st, hold = shown && opts.ready && !opts.ready(state());
      if (hold) st = shown;
      try { paint(); } finally {
        if (hold) st = want;
        else shown = { view: st.view, day: st.day, before: st.before };
      }
    }
    function paint() {
      h3.replaceChildren.apply(h3, titleText());
      [].forEach.call(tabs.children, function (b) { b.setAttribute("aria-selected", b.dataset.view === st.view ? "true" : "false"); });
      // the month picker follows the day while it is shut; open, it keeps what one is looking at
      if (pop.hidden) jump.set(window.ds.datePick.of("month", st.day));
      body.dataset.view = st.view;
      body.replaceChildren.apply(body, st.view === "month" ? month() : st.view === "week" ? week() : list());
    }
    function set(o) {
      o = o || {};
      if (VIEWS.indexOf(o.view) >= 0) st.view = o.view;
      if (o.day) st.day = o.day;
      draw();
    }
    draw();
    return { draw: draw, set: set, go: go, today: goToday, state: state, el: root };
  }

  // a day's default row, for a page that fills its panels itself (panel) and still wants the calendar's rows
  calendar.row = defaultRow;
  calendar.mark = mark;
  window.ds = window.ds || {};
  window.ds.calendar = calendar;
})();
/* Charts, taken from Studio's analysis. Each one draws into holder (its content replaced) and returns its element; with
   holder null it only returns it, for a page that builds its own tree. The colour of a series is a token, given as its
   name (color: "--c-bleu") and set as --n on the chart; the lines, labels and grounds come from the theme.
   ds.chart.line(holder, points, {color, label, value, tall, area, ref, marks, hover, now, nowLabel}): a curve, its highest and lowest
     values on its right, its first and last days under it. points: [{x: "2026-11-09", v: 1240}]; label(x) and value(v)
     write them (a short date and a figure by default). Tall, a chart of its own (a share's price): taller, its middle
     day under it too; area fills its ground; ref: {v, label} a dashed level with its name (a cost price); marks:
     [{x, label}] a dot on each day given (purchases), its label on hover; hover: the day and value under the pointer or
     the finger, with a cursor; now: the day that is today, when the curve goes on with what is foreseen: from it the
     curve is dashed and its ground paler, a thin rule stands on it, nowLabel over it (« aujourd’hui »).
   ds.chart.bars(holder, rows, {color, average, unit, short, selected, pick}): bars on a round scale (0, 500, 1 000…),
     the figure on each bar, a dashed line at the average. rows: [{key, label, value, parts: [{value, color}], live,
     title}]: parts stack their colours in the bar; live hatches a period still running; a "2026-11" key is named by its
     month. pick(key) makes the bars buttons, the selected one lit.
     Paired, with pairs: [{key, label, color}] (Bank's money in and out), each row carries one value per series under its
     key ({key: "2026-11", income: 3200, spending: 2104}): a bar per series side by side, their figures stacked over
     them on hover or when chosen, and a legend that adds each series up, written by format(v) (the figure and unit by
     default).
   ds.chart.heat(holder, counts, {color, to, from, weeks, steps, title, below, legend, note}): a year of days, one square
     per day, a column per week, Monday on top, pale on a day with nothing, coloured from steps[0] (1), full from
     steps[1] (2); the days before from fade, those after to (today) are left out; below(weekStart) writes a figure
     under a week (what it gained), or {text, title} to say more on hover. counts: {"2026-11-09": 2}. In a card narrower than a year (740px, a phone) it
     scrolls sideways, opened on its last weeks.
   ds.chart.spark(holder, values, {color, top, title}): small bars side by side, as tall as their value against top
     (a story's views against the best story shown).
   ds.chart.split(holder, parts, {format}): one bar split by share, then its legend. parts: [{label, value, color}].
   ds.chart.donut(holder, rows, {format, selected, pick, center}): a ring split by share, the total in its hole, and its
     legend beside it (under it on a phone), a row per slice: its colour, its name, its share, its amount. rows: [{key,
     label, value, color, note, tone}] (nothing at or under 0 is drawn; note: a word under the name, in red with tone
     "bad", in green with "good"); center: the word under the total (« dépensés »), or
     {value, label}; pick(key) makes the slices and the rows buttons: a tap chooses one, which the hole then says,
     another tap lets it go (pick(null)); the slices are one stop of the keyboard, the arrows go round them;
     open(key, holder): what the chosen one opens, right under its row of the legend (holder, empty, for the page to
     fill, then or later), gone when it is let go or another is chosen. */
(function () {
  "use strict";
  var SVG = "http://www.w3.org/2000/svg";
  var _ = window.ds._, day = window.ds.day, english = _.english, el = _.el, tone = _.tone;
  var at = day.at, addDays = day.add, weekStart = day.weekStart, parisToday = day.today;
  var WORDS = _.table({
    fr: { none: "rien", one: "1", many: function (n) { return n + " et plus"; }, live: "en cours" },
    en: { none: "none", one: "1", many: function (n) { return n + " or more"; }, live: "running" }
  });
  function words() { return _.words(WORDS); }
  function svg(name, attrs) {
    var e = document.createElementNS(SVG, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function paint(e, color) { if (color) e.style.setProperty("--n", tone(color)); return e; }
  function put(holder, e) { if (holder) holder.replaceChildren.apply(holder, e ? [e] : []); return e; }
  function num(v) { return window.ds.number(v); }
  // big figures made short where room is tight: 1 240 → 1,2k, 12 500 → 13k
  function short(v) {
    var a = Math.abs(v);
    if (a < 1000) return num(Math.round(v));
    return (a < 10000 ? window.ds.number(Math.round(v / 100) / 10, Math.round(v / 100) % 10 ? 1 : 0) : num(Math.round(v / 1000))) + "k";
  }
  function monthShort(m) { return new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", month: "short" }).format(at(m + "-15")).replace(".", ""); }

  /* the curve: drawn in a 100 × 30 box stretched to the chart's width (100 × 60 when tall), its lines kept thin whatever
     the stretch. Tall, it is a chart of its own: its middle day under it as well, its ground filled with area; ref draws
     a dashed level with its name (a cost price), marks a dot on the days given (purchases), hover the day and value under
     the pointer or the finger, with a cursor */
  function line(holder, points, o) {
    o = o || {};
    var pts = (points || []).filter(function (p) { return p && typeof p.v === "number"; });
    if (pts.length < 2) return put(holder, null);
    var label = o.label || function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(x) ? window.ds.date(x, "day") : String(x); };
    var value = o.value || num;
    var ref = o.ref && typeof o.ref.v === "number" ? o.ref : null;
    var vals = pts.map(function (p) { return p.v; }), all = ref ? vals.concat([ref.v]) : vals;
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all), span = hi - lo || 1;
    var H = o.tall ? 60 : 30, top = 2, bot = H - 2;
    function X(i) { return i / (pts.length - 1) * 100; }
    function Y(v) { return bot - (v - lo) / span * (bot - top); }
    var s = svg("svg", { viewBox: "0 0 100 " + H, preserveAspectRatio: "none", "aria-hidden": "true", "class": "chart-line-svg" });
    [top, bot].forEach(function (y) { s.append(svg("line", { x1: "0", x2: "100", y1: String(y), y2: String(y), "class": "chart-rule", "vector-effect": "non-scaling-stroke" })); });
    var coords = vals.map(function (v, i) { return X(i).toFixed(2) + "," + Y(v).toFixed(2); });
    // today, when what follows it is foreseen: the last point on or before it
    var now = -1;
    if (o.now != null) { for (var n = 0; n < pts.length; n++) { if (String(pts[n].x) <= String(o.now)) now = n; } }
    var cut = now >= 0 && now < pts.length - 1 ? now : -1;
    var done = cut >= 0 ? coords.slice(0, cut + 1) : coords, ahead = cut >= 0 ? coords.slice(cut) : [];
    if (o.area) {
      s.append(svg("polygon", { "class": "chart-area", points: "0," + bot + " " + done.join(" ") + " " + X(cut >= 0 ? cut : pts.length - 1).toFixed(2) + "," + bot }));
      if (ahead.length) s.append(svg("polygon", { "class": "chart-area is-ahead", points: X(cut).toFixed(2) + "," + bot + " " + ahead.join(" ") + " 100," + bot }));
    }
    if (ref) s.append(svg("line", { x1: "0", x2: "100", y1: Y(ref.v).toFixed(2), y2: Y(ref.v).toFixed(2), "class": "chart-ref", "vector-effect": "non-scaling-stroke" }));
    if (done.length > 1) s.append(svg("polyline", { "class": "chart-path", "vector-effect": "non-scaling-stroke", points: done.join(" ") }));
    if (ahead.length) s.append(svg("polyline", { "class": "chart-path is-ahead", "vector-effect": "non-scaling-stroke", points: ahead.join(" ") }));
    var first = pts[0], last = pts[pts.length - 1];
    var box = paint(el("div", "chart-line" + (o.tall ? " is-tall" : "") + (o.hover ? " is-hover" : "")), o.color), plot = el("div", "chart-line-plot");
    var ys = el("div", "chart-line-y"), xs = el("div", "chart-line-x");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", value(first.v) + " (" + label(first.x) + ") → " + value(last.v) + " (" + label(last.x) + ")");
    box.title = o.hover ? "" : box.getAttribute("aria-label");
    plot.append(s);
    // what lies over the curve, placed in shares of its box: the level's name, the dots, the cursor and its bubble
    function at(e, i, v) { e.style.left = X(i) + "%"; e.style.top = (Y(v) / H * 100) + "%"; return e; }
    if (ref && ref.label) {
      var name = el("span", "chart-ref-l", ref.label);
      name.style.top = (Y(ref.v) / H * 100) + "%";
      plot.append(name);
    }
    if (cut >= 0) {
      var rule = el("i", "chart-now");
      rule.style.left = X(cut) + "%";
      if (o.nowLabel) rule.append(el("span", "chart-now-l", o.nowLabel));
      plot.append(rule);
    }
    (o.marks || []).forEach(function (m) {
      var i = -1;
      for (var k = 0; k < pts.length; k++) { if (String(pts[k].x) >= String(m.x)) { i = k; break; } }
      if (i < 0) return;
      var dot = at(el("i", "chart-mark"), i, pts[i].v);
      if (m.label) dot.title = m.label;
      plot.append(dot);
    });
    if (o.hover) {
      var cur = el("i", "chart-cursor"), dot = el("i", "chart-dot"), tip = el("span", "chart-tip");
      cur.hidden = dot.hidden = tip.hidden = true;
      plot.append(cur, dot, tip);
      var show = function (e) {
        var r = plot.getBoundingClientRect();
        if (!r.width) return;
        var i = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (pts.length - 1));
        cur.style.left = X(i) + "%";
        at(dot, i, pts[i].v);
        tip.textContent = label(pts[i].x) + " · " + value(pts[i].v);
        cur.hidden = dot.hidden = tip.hidden = false;
        // the bubble stays within the chart
        var w = tip.offsetWidth, x = X(i) / 100 * r.width;
        tip.style.left = Math.min(Math.max(x, w / 2), r.width - w / 2) + "px";
      };
      var hide = function () { cur.hidden = dot.hidden = tip.hidden = true; };
      plot.addEventListener("pointermove", show);
      plot.addEventListener("pointerdown", show);
      plot.addEventListener("pointerleave", hide);
    }
    ys.append(el("span", "", value(hi)));
    if (hi !== lo) ys.append(el("span", "", value(lo)));
    xs.append(el("span", "", label(first.x)));
    if (o.tall && pts.length > 2) xs.append(el("span", "", label(pts[Math.floor((pts.length - 1) / 2)].x)));
    xs.append(el("span", "", label(last.x)));
    box.append(plot, ys, xs);
    return put(holder, box);
  }

  /* a round scale of four or five steps (500, 1 000, 2 000…), its top step above the tallest bar and the average */
  function scale(max) {
    var raw = Math.max(max, 1) / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * p; }).filter(function (v) { return v >= raw; })[0];
    var top = Math.ceil(Math.max(max, 1) / step) * step, ticks = [];
    for (var t = 0; t <= top + 1e-6; t += step) ticks.push(t);
    return { top: top, ticks: ticks };
  }
  /* months must never touch: up to a year every month is named, up to two one in three, beyond only each January's year.
     The year goes with January, and with the first month unless a January follows right after it */
  function monthLabel(key, i, n) {
    var mo = +key.slice(5, 7), yr = key.slice(0, 4);
    if (n > 24) return mo === 1 ? yr : "";
    if (n > 12) return mo === 1 ? yr : (mo - 1) % 3 === 0 ? monthShort(key) : "";
    return [monthShort(key), mo === 1 || (i === 0 && mo < 11) ? " " + yr.slice(2) : ""];
  }
  function bars(holder, rows, o) {
    o = o || {};
    rows = rows || [];
    if (!rows.length) return put(holder, null);
    var n = rows.length, fig = o.short || short, unit = o.unit || "", avg = typeof o.average === "number" ? o.average : null;
    var pairs = o.pairs && o.pairs.length ? o.pairs : null, say = o.format || function (v) { return fig(v) + unit; };
    // paired, the scale is the tallest of every series
    function top(r) { return pairs ? Math.max.apply(null, pairs.map(function (q) { return r[q.key] || 0; })) : r.value || 0; }
    var sc = scale(Math.max.apply(null, rows.map(top).concat([avg || 0])));
    function pc(v) { return (Math.max(0, v) / sc.top * 100).toFixed(2) + "%"; }
    var box = paint(el("div", "chart-bars" + (n > 12 ? " is-dense" : "") + (pairs ? " is-pairs" : "")), o.color), axis = el("div", "chart-bars-axis"), grid = el("div", "chart-bars-grid"), cols = el("div", "chart-bars-cols");
    if (pairs) box.style.setProperty("--pairs", String(pairs.length));
    var labels = sc.ticks.map(function (v) { return v ? fig(v) + unit : "0"; });
    // the scale's gutter is as wide as its longest figure, in the figures' own characters
    box.style.setProperty("--axc", String(Math.max.apply(null, labels.map(function (s) { return s.length; }))));
    box.style.setProperty("--cols", String(n));
    axis.setAttribute("aria-hidden", "true");
    grid.setAttribute("aria-hidden", "true");
    sc.ticks.forEach(function (v, i) {
      var s = el("span", "", labels[i]);
      s.style.bottom = pc(v);
      axis.append(s);
      if (v) { var g = el("i"); g.style.bottom = pc(v); grid.append(g); }
    });
    box.append(axis, grid);
    if (avg != null) {
      var a = el("div", "chart-bars-avg"), ai = el("i");
      a.setAttribute("aria-hidden", "true");
      ai.style.bottom = pc(avg);
      a.append(ai);
      box.append(a);
    }
    // a column's bars side by side, one per series; their figures stacked over the tallest, in each series' colour
    function pair(area, r) {
      var high = 0, vs = el("span", "chart-bar-vs");
      pairs.forEach(function (q) {
        var v = r[q.key] || 0, fill = paint(el("span", "chart-bar-fill"), q.color), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(v, sc.top / 200));
        stack.append(el("i"));
        fill.append(stack);
        area.append(fill);
        vs.append(paint(el("span", "chart-bar-v", fig(v)), q.color));
        high = Math.max(high, v);
      });
      vs.style.bottom = pc(high);
      area.append(vs);
    }
    rows.forEach(function (r, i) {
      var c = el(o.pick ? "button" : "div", "chart-bar" + (r.key === o.selected ? " is-on" : "") + (r.live ? " is-live" : "") + ((n - 1 - i) % 2 ? " is-alt" : ""));
      var area = el("span", "chart-bar-area");
      if (pairs) pair(area, r);
      else {
        var fill = el("span", "chart-bar-fill"), stack = el("span", "chart-bar-stack");
        // a bar of nothing still shows as a line on the base
        fill.style.height = pc(Math.max(r.value || 0, sc.top / 200));
        var parts = r.parts && r.parts.length ? r.parts : [{ value: r.value || 0 }], whole = parts.reduce(function (s, p) { return s + (p.value > 0 ? p.value : 0); }, 0) || 1;
        parts.forEach(function (p) {
          if (!(p.value > 0) && parts.length > 1) return;
          var part = el("i");
          part.style.flex = String((p.value > 0 ? p.value : 1) / whole);
          if (p.color) part.style.backgroundColor = tone(p.color);
          stack.append(part);
        });
        fill.append(el("span", "chart-bar-v", fig(r.value || 0)), stack);
        area.append(fill);
      }
      // a month's year is its own span: a phone leaves it out, where the names would touch
      var name = r.label != null ? [String(r.label), ""] : /^\d{4}-\d{2}$/.test(r.key || "") ? [].concat(monthLabel(r.key, i, n), "").slice(0, 2) : [String(r.key), ""];
      var lab = el("span", "chart-bar-l", name[0]);
      if (name[1]) lab.append(el("span", "chart-bar-yr", name[1]));
      name = name[0] + name[1];
      c.append(area, lab);
      var figs = pairs ? pairs.map(function (q) { return q.label + " " + say(r[q.key] || 0); }).join(" · ") : fig(r.value || 0) + unit;
      c.title = r.title || (name + " · " + figs + (r.live ? " (" + words().live + ")" : ""));
      if (o.pick) {
        c.type = "button";
        c.setAttribute("aria-pressed", r.key === o.selected ? "true" : "false");
        c.addEventListener("click", function () {
          [].forEach.call(cols.children, function (x) { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
          o.pick(r.key);
        });
      }
      cols.append(c);
    });
    box.append(cols);
    if (pairs) {
      // the series under the bars: a colour, a name, what they add up to
      var legend = el("div", "chart-bars-legend");
      pairs.forEach(function (q) {
        var s = el("span"), sum = rows.reduce(function (t, r) { return t + (r[q.key] || 0); }, 0);
        s.append(paint(el("i", "chart-key"), q.color), q.label, el("b", "", say(sum)));
        legend.append(s);
      });
      box.append(legend);
    }
    return put(holder, box);
  }

  function heat(holder, counts, o) {
    o = o || {};
    counts = counts || {};
    var w = words(), to = o.to || parisToday(), steps = o.steps || [1, 2], weeks = o.weeks || 53, from = o.from || null;
    var title = o.title || function (key, n) { return window.ds.date(key, "day") + " · " + n; };
    var lastWeek = weekStart(to), blocks = Math.max(1, Math.ceil(weeks / 53)), box = paint(el("div", "chart-heat"), o.color), scroll = el("div", "chart-heat-scroll");
    // always whole years of 53 weeks, so that the squares keep their size; a longer span stacks them, the latest first
    for (var b = 0; b < blocks; b++) {
      var year = el("div", "chart-heat-year"), dow = el("div", "chart-heat-dow"), main = el("div", "chart-heat-main");
      var mos = el("div", "chart-heat-months"), days = el("div", "chart-heat-days"), below = o.below ? el("div", "chart-heat-below") : null;
      ["", 1, "", 3, "", 5, "", 7].forEach(function (d) {
        dow.append(el("span", "", d ? new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: "UTC", weekday: "short" }).format(at(addDays("2026-11-08", d))).replace(".", "") : ""));
      });
      if (below) dow.append(el("span"));
      for (var k = 52; k >= 0; k--) {
        var ws = addDays(lastWeek, -7 * (k + 53 * b)), lab = "";
        // a month is named over the week that holds its first day
        for (var j = 0; j < 7; j++) { var dj = addDays(ws, j); if (dj.slice(8) === "01") lab = monthShort(dj.slice(0, 7)) + (dj.slice(5, 7) === "01" ? " " + dj.slice(2, 4) : ""); }
        mos.append(el("span", "", lab));
        // what the week brought: a figure, or {text, title} for a word on hover
        if (below) {
          var g = from && addDays(ws, 6) < from ? null : o.below(ws), gs = el("span", "", g == null ? "" : String(g && typeof g === "object" ? g.text : g));
          if (g && typeof g === "object" && g.title) gs.title = g.title;
          below.append(gs);
        }
        for (var i = 0; i < 7; i++) {
          var day = addDays(ws, i), c = day > to ? 0 : counts[day] || 0;
          var sq = el("i", "heat-day" + (c >= steps[1] ? " is-2" : c >= steps[0] ? " is-1" : "") + (day > to ? " is-future" : "") + (from && day < from ? " is-out" : ""));
          sq.dataset.day = day;
          if (day <= to) sq.title = title(day, c);
          days.append(sq);
        }
      }
      main.append(mos, days);
      if (below) { main.append(below); year.classList.add("has-below"); }
      year.append(dow, main);
      scroll.append(year);
    }
    var lg = o.legend || [w.none, w.one, w.many(steps[1])], legend = el("div", "chart-heat-legend");
    ["", "is-1", "is-2"].forEach(function (cls, i) { var s = el("span"), k = el("i", "heat-day " + cls); s.append(k, lg[i]); legend.append(s); });
    if (o.note) legend.append(el("span", "chart-heat-note", o.note));
    box.append(scroll, legend);
    // opened on the latest weeks when the year is wider than the screen
    requestAnimationFrame(function () { scroll.scrollLeft = scroll.scrollWidth; });
    return put(holder, box);
  }

  function spark(holder, values, o) {
    o = o || {};
    values = values || [];
    var top = o.top || Math.max.apply(null, values.concat([1])), box = paint(el("span", "chart-spark"), o.color);
    box.setAttribute("aria-hidden", "true");
    values.forEach(function (v) {
      var b = el("i");
      // the smallest still shows
      b.style.height = Math.max(8, Math.round(v / top * 100)) + "%";
      b.title = o.title ? o.title(v) : num(v);
      box.append(b);
    });
    return put(holder, box);
  }

  function split(holder, parts, o) {
    o = o || {};
    var format = o.format || num, all = (parts || []).filter(function (p) { return p.value > 0; }), total = all.reduce(function (s, p) { return s + p.value; }, 0);
    if (!total) return put(holder, null);
    var box = el("div", "chart-split"), bar = el("div", "chart-split-bar"), legend = el("div", "chart-split-legend");
    all.forEach(function (p) {
      var share = p.value / total, piece = el("i"), key = el("span"), dot = paint(el("i", "chart-key"), p.color);
      piece.style.width = (share * 100).toFixed(2) + "%";
      if (p.color) piece.style.background = tone(p.color);
      piece.title = p.label + " · " + format(p.value);
      bar.append(piece);
      key.append(dot, p.label, el("b", "", format(p.value)), el("em", "", Math.round(share * 100) + "%"));
      legend.append(key);
    });
    box.append(bar, legend);
    return put(holder, box);
  }

  /* the donut, taken from Bank's spending: a ring drawn in a 200 × 200 box from the top, clockwise, a hair of room between
     its slices; a figure in its hole, the legend beside it */
  function donut(holder, rows, o) {
    o = o || {};
    var format = o.format || num, all = (rows || []).filter(function (x) { return x && x.value > 0; });
    var total = all.reduce(function (s, x) { return s + x.value; }, 0);
    if (!total) return put(holder, null);
    var R = 90, r = 60, gap = all.length > 1 ? 0.02 : 0, angle = -Math.PI / 2;
    var box = el("div", "chart-donut" + (o.pick ? " is-pick" : "")), ring = el("div", "chart-donut-ring"), legend = el("ul", "chart-donut-legend");
    var s = svg("svg", { viewBox: "0 0 200 200", "class": "chart-donut-svg" }), mid = el("div", "chart-donut-c"), big = el("b"), word = el("small");
    var c = o.center == null ? {} : typeof o.center === "object" ? o.center : { label: String(o.center) };
    var keys = all.map(function (x) { return String(x.key != null ? x.key : x.label); }), on = o.selected == null ? null : String(o.selected);
    var slices = [], items = [], told = [];
    function pt(a, rad) { return (100 + rad * Math.cos(a)).toFixed(2) + " " + (100 + rad * Math.sin(a)).toFixed(2); }
    all.forEach(function (x, i) {
      var sweep = x.value / total * Math.PI * 2, a0 = angle + gap / 2, a1 = all.length > 1 ? angle + sweep - gap / 2 : angle + Math.PI * 2 - 0.0001;
      // the smallest share still shows as a sliver
      if (a1 - a0 < 0.004) a1 = a0 + 0.004;
      var arc = a1 - a0 > Math.PI ? 1 : 0, half = angle + sweep / 2, pct = Math.round(x.value / total * 100);
      angle += sweep;
      var said = x.label + " · " + format(x.value) + " · " + pct + "%";
      told.push(said);
      var path = paint(svg("path", { "class": "chart-donut-slice",
        d: "M " + pt(a0, R) + " A " + R + " " + R + " 0 " + arc + " 1 " + pt(a1, R) + " L " + pt(a1, r) + " A " + r + " " + r + " 0 " + arc + " 0 " + pt(a0, r) + " Z" }), x.color);
      // chosen or under the pointer, a slice moves out a little along its middle
      path.style.setProperty("--dx", (Math.cos(half) * 5).toFixed(2));
      path.style.setProperty("--dy", (Math.sin(half) * 5).toFixed(2));
      var tip = svg("title");
      tip.textContent = said;
      path.append(tip);
      s.append(path);
      slices.push(path);
      var li = el("li"), row = el(o.pick ? "button" : "div", "chart-donut-row");
      // a row may say a word under its name (note), in a colour (tone: bad, good): what rose against the usual
      var name = el("span", "chart-donut-l", x.label);
      if (x.note) name.append(el("small", "chart-donut-n" + (x.tone ? " is-" + x.tone : ""), x.note));
      row.append(paint(el("i", "chart-key"), x.color), name, el("em", "", pct + "%"), el("b", "", format(x.value)));
      li.append(row);
      legend.append(li);
      items.push(row);
      if (!o.pick) return;
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", said);
      path.addEventListener("click", function () { choose(i, true); });
      // the slices are one stop of the keyboard: the arrows go round the ring, Enter or Space takes one
      path.addEventListener("keydown", function (e) {
        var n = slices.length, to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
        if (to != null) { e.preventDefault(); rove((to + n) % n, true); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(i, true); }
      });
      row.type = "button";
      row.addEventListener("click", function () { choose(i, true); });
    });
    if (o.pick) s.setAttribute("role", "group");
    else {
      s.setAttribute("role", "img");
      s.setAttribute("aria-label", told.join(", "));
    }
    function rove(i, focus) {
      if (!o.pick) return;
      slices.forEach(function (p, k) { p.setAttribute("tabindex", k === i ? "0" : "-1"); });
      if (focus) slices[i].focus();
    }
    // what the chosen one opens, under its row
    var opened = null;
    function openUnder(at) {
      if (opened) { opened.remove(); opened = null; }
      if (!o.open || at < 0) return;
      var holder = el("div", "chart-donut-more");
      opened = el("li", "chart-donut-open");
      opened.append(holder);
      items[at].parentNode.after(opened);
      o.open(keys[at], holder);
    }
    // a tap chooses a slice, another tap on it lets it go; the hole says the chosen one, else the total
    function choose(i, user) {
      var k = i == null ? null : keys[i];
      if (user) on = on === k ? null : k;
      var at = on == null ? -1 : keys.indexOf(on);
      box.classList.toggle("has-on", at >= 0);
      slices.forEach(function (p, j) { p.classList.toggle("is-on", j === at); if (o.pick) p.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      items.forEach(function (b, j) { b.classList.toggle("is-on", j === at); if (o.pick) b.setAttribute("aria-pressed", j === at ? "true" : "false"); });
      big.textContent = at >= 0 ? format(all[at].value) : c.value != null ? String(c.value) : format(total);
      word.textContent = at >= 0 ? all[at].label : c.label || "";
      word.hidden = !word.textContent;
      openUnder(at);
      if (user) { rove(i, false); o.pick(on); }
    }
    mid.setAttribute("aria-live", "polite");
    mid.append(big, word);
    ring.append(s, mid);
    box.append(ring, legend);
    choose(null, false);
    rove(Math.max(0, on == null ? 0 : keys.indexOf(on)), false);
    return put(holder, box);
  }

  window.ds = window.ds || {};
  window.ds.chart = { line: line, bars: bars, heat: heat, spark: spark, split: split, donut: donut };
})();
/* Figures read at a glance, taken from Studio's analysis; each builder returns an element for the page to place.
   ds.rank(rows, {title, note, empty, plain}): a ranking, one row per name: its place (the first three in gold), the name
     (a link with href) and a grey line under it (sub), and on the right its value (a text, or a node such as a verdict);
     with share (0 to 1, against the first) a thin bar under the name. plain leaves the places out. Rankings side by side
     go in <div class="ranks">.
   ds.minitiles(items): small tiles of reference figures at the top of a card. items: [{label, value, unit, note}].
   ds.verdict(ratio, {words, high, low}): a judgement of a figure against the usual one: « ×1,4 », green from high (1.2),
     yellow from low (0.8), red under it; with words, « fort », « moyen » or « faible » under it. null keeps its room.
   ds.periodPick(options, current, pick, {label}): a period selector: buttons on a computer, the design system's menu on
     a phone (768px and less, « 1 an ▾ », the same .pill as a month's or a sort's). options: [[value, label]]; pick(value)
     is called with the chosen one, the selector lights it itself. */
(function () {
  "use strict";
  var _ = window.ds._, el = _.el;
  var WORDS = _.table({
    fr: { strong: "fort", average: "moyen", weak: "faible", against: "par rapport à la médiane", period: "Période", empty: "Rien sur cette période." },
    en: { strong: "strong", average: "average", weak: "weak", against: "against the median", period: "Period", empty: "Nothing over this period." }
  });
  function words() { return _.words(WORDS); }
  function safe(u) { return typeof u === "string" && /^(https?:\/\/|\/|#)[^\s"'<>]*$/.test(u) ? u : null; }

  function rank(rows, o) {
    o = o || {};
    var col = el("div", "rank-col"), head = el("p", "rank-head", o.title || "");
    if (o.note) head.append(el("span", "rank-note", o.note));
    col.append(head);
    if (!rows || !rows.length) { col.append(el("p", "empty", o.empty || words().empty)); return col; }
    var list = el("ol", "rank" + (o.plain ? " is-plain" : ""));
    rows.forEach(function (r, i) {
      var li = el("li", i < 3 ? "is-top" : ""), name = el("div", "rank-name"), href = safe(r.href);
      var t = typeof r.name === "string" || r.name == null ? el(href ? "a" : "span", "rank-t", r.name || "") : el("span", "rank-t", r.name);
      if (href) { t.href = href; if (/^https?:/.test(href)) { t.target = "_blank"; t.rel = "noopener"; } }
      name.append(t);
      if (r.sub != null) name.append(el("small", "", r.sub));
      if (typeof r.share === "number") {
        var bar = el("i", "rank-bar");
        bar.style.setProperty("--share", Math.max(0, Math.min(1, r.share)).toFixed(3));
        bar.setAttribute("aria-hidden", "true");
        name.append(bar);
      }
      if (!o.plain) li.append(el("span", "rank-n", String(i + 1)));
      li.append(name);
      if (r.value != null) li.append(typeof r.value === "string" || typeof r.value === "number" ? el("span", "rank-v", String(r.value)) : r.value);
      list.append(li);
    });
    col.append(list);
    return col;
  }

  // the compact tiles (tiles.css), each as wide as the widest (.is-fit); .minitiles stays on it for the apps' own rules
  function minitiles(items) {
    var box = el("dl", "tiles is-compact is-fit minitiles");
    (items || []).filter(Boolean).forEach(function (x) {
      box.append(el("div", "tile", [el("dt", "", x.label), el("dd", "", [x.value, x.unit != null ? el("span", "u", x.unit) : null]),
        x.note ? el("span", "h", x.note) : null]));
    });
    return box;
  }

  function verdict(ratio, o) {
    o = o || {};
    var w = words(), high = o.high || 1.2, low = o.low || 0.8;
    if (ratio == null || isNaN(ratio)) return el("span", "verdict is-none" + (o.words ? " is-tall" : ""));
    var level = ratio >= high ? "good" : ratio >= low ? "mid" : "weak";
    var v = el("span", "verdict is-" + level + (o.words ? " is-tall" : ""), "×" + window.ds.number(Math.round(ratio * 10) / 10, Math.round(ratio * 10) % 10 ? 1 : 0));
    v.title = w.against;
    // short words of the same length, so that every verdict reads the same
    if (o.words) v.append(el("small", "", level === "good" ? w.strong : level === "mid" ? w.average : w.weak));
    return v;
  }

  function periodPick(options, current, pick, o) {
    o = o || {};
    var label = o.label || words().period, box = el("span", "periodpick"), group = el("div", "tabs");
    // on a phone, the menu: what is chosen in words, the phone's own picker under it
    var list = el("select"), shown = el("span", "pv"), menu = el("label", "pill periodpick-list", [shown, list]);
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    list.setAttribute("aria-label", label);
    function light(v) {
      [].forEach.call(group.children, function (b) { b.setAttribute("aria-pressed", b.dataset.value === String(v) ? "true" : "false"); });
      list.value = String(v);
      shown.textContent = list.selectedIndex < 0 ? "" : list.options[list.selectedIndex].textContent;
    }
    function choose(v) {
      var opt = options.filter(function (x) { return String(x[0]) === String(v); })[0];
      if (!opt) return;
      light(opt[0]);
      if (pick) pick(opt[0]);
    }
    options.forEach(function (x) {
      var b = el("button", "", x[1]), op = el("option", "", x[1]);
      b.type = "button";
      b.dataset.value = String(x[0]);
      b.addEventListener("click", function () { choose(x[0]); });
      op.value = String(x[0]);
      group.append(b);
      list.append(op);
    });
    list.addEventListener("change", function () { choose(list.value); });
    light(current);
    box.append(group, menu);
    return box;
  }

  window.ds = window.ds || {};
  window.ds.rank = rank;
  window.ds.minitiles = minitiles;
  window.ds.verdict = verdict;
  window.ds.periodPick = periodPick;
})();
/* The behaviour of src/pick.css.
   ds.pills(root): each pill of root (or the page, or root itself when it is one) says its menu's choice in its .pv,
   and a .pill.is-filter is lit (.is-on) while its menu holds a value. Done on its own when the page is ready and on
   every change of a pill's menu; a page that sets a menu itself (select.value = …) calls it after.
   ds.picker(holder, {items, value, first, limit, placeholder, label, empty, onPick, opener}) draws a search picker in
   holder: a field, then the choices that match what is typed, accents and capitals aside, every word of it.
     items: [{value, label, sub (a word in small after it), group (its heading), color (its --n), initial or icon,
     cta (what a tap does), href (a link: a tap goes there), keywords (more words it is found by)}], or null while they
     are read (« Chargement… »); value: the current choice, in gold; first: the values shown before anything is typed
     (the banks most people have), else every choice; limit: how many at most (12); empty: the words when nothing
     matches; onPick(item) on a tap or Enter; opener: a button that shows and hides it (aria-expanded), the search
     taking the focus. ↑ and ↓ go through the choices, Enter takes one, Escape empties the search, then closes it.
     Returns {open(), close(), toggle(), set(items), draw(), input}. */
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
      var pv = p.querySelector(".pv");
      if (!pv) { pv = tag("span", "pv"); p.insertBefore(pv, p.firstChild); }
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
  function picker(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    o = o || {};
    var w = words(), id = "ds-picker-" + (++made), p = { items: o.items === undefined ? [] : o.items, shown: [], active: -1 };
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
      [].forEach.call(opts, function (x, k) { x.classList.toggle("is-active", k === p.active); });
      input.setAttribute("aria-activedescendant", opts[p.active].id);
      opts[p.active].scrollIntoView({ block: "nearest" });
    }
    function pick(x) {
      o.value = x.value;
      if (o.onPick) o.onPick(x);
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
    p.set = function (items) { p.items = items; return p.draw(); };
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
/* ds.reorder(list, {item, handle, onEnd}): the items of list, put in another order by their grip (src/reorder.css).
   item: what an item is among list's children (a selector; all of them by default); handle: its grip (".grip").
   With the mouse or a finger, the item follows the pointer and the others make room for it; near the top or the
   bottom of the screen the page scrolls along. With the keyboard, ↑ and ↓ on a grip move its item by one.
   A list inside an item (the accounts of a bank) is a list of its own: call ds.reorder on it too; each grip moves the
   item of its own list only. onEnd(items, item) once an item has landed somewhere else: the items in their new order
   (read their data-key), and the one that moved. Returns {items()}; called again on the same list it gives the same. */
(function () {
  "use strict";
  var _ = window.ds._, find = _.find;
  var WORDS = _.table({ fr: { move: "Déplacer" }, en: { move: "Move" } });
  function words() { return _.words(WORDS); }
  // the neighbours move at once in the page, then slide from where they were to where they are
  function slide(els, move) {
    var before = els.map(function (el) { return el.offsetTop; });
    move();
    els.forEach(function (el, i) {
      var delta = before[i] - el.offsetTop;
      if (!delta) return;
      el.classList.remove("is-shifting");
      el.style.transform = "translateY(" + delta + "px)";
      void el.offsetWidth;
      el.classList.add("is-shifting");
      el.style.transform = "";
      clearTimeout(el._dsSlide);
      el._dsSlide = setTimeout(function () { el.classList.remove("is-shifting"); }, 450);
    });
  }
  function reorder(list, o) {
    list = find(list);
    if (!list) return null;
    if (list._dsReorder) { if (o) list._dsReorder.o = o; return list._dsReorder; }
    var r = { o: o || {} }, d = null;
    list._dsReorder = r;
    list.setAttribute("data-reorder", "");
    function handle() { return r.o.handle || ".grip"; }
    function isItem(c) { return c && c.parentNode === list && (!r.o.item || c.matches(r.o.item)); }
    r.items = function () { return [].filter.call(list.children, isItem); };
    function next(it) { var c = it.nextElementSibling; while (c && !isItem(c)) c = c.nextElementSibling; return c; }
    function prev(it) { var c = it.previousElementSibling; while (c && !isItem(c)) c = c.previousElementSibling; return c; }
    // a grip of this list, not of a list inside one of its items
    function grip(target) {
      var h = target.closest && target.closest(handle());
      return h && h.closest("[data-reorder]") === list ? h : null;
    }
    function itemOf(h) { var c = h; while (c && c.parentNode !== list) c = c.parentNode; return isItem(c) ? c : null; }
    function name() {
      list.querySelectorAll(handle()).forEach(function (h) { if (h.closest("[data-reorder]") === list && !h.hasAttribute("aria-label")) h.setAttribute("aria-label", words().move); });
    }
    function done(it) { if (r.o.onEnd) r.o.onEnd(r.items(), it); }
    // where the dragged item should be: under the pointer, within the list; the neighbours it passed go the other way
    function place() {
      var it = d.it, all = r.items(), h = it.offsetHeight;
      var want = d.top + (d.last + window.scrollY) - (d.y + d.sy);
      var low = Math.min.apply(null, all.map(function (x) { return x.offsetTop; }));
      var high = Math.max.apply(null, all.map(function (x) { return x.offsetTop + x.offsetHeight; })) - h;
      want = Math.max(low, Math.min(high, want));
      // a neighbour gives way once the item's far edge passes its middle, whatever their heights (a bank and its
      // accounts past a bank with a single one)
      var sib;
      while ((sib = next(it)) && want + h > sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it); });
      while ((sib = prev(it)) && want < sib.offsetTop + sib.offsetHeight / 2) slide([sib], function () { list.insertBefore(sib, it.nextSibling); });
      it.style.transform = "translateY(" + (want - it.offsetTop) + "px)";
    }
    function move(e) { if (d && e.pointerId === d.id) { d.last = e.clientY; place(); } }
    // near an edge of the screen, the page scrolls along with the item
    function edge() {
      if (!d) return;
      var zone = 56, v = 0;
      if (d.last < zone) v = -Math.ceil((zone - d.last) / 4);
      else if (d.last > window.innerHeight - zone) v = Math.ceil((d.last - window.innerHeight + zone) / 4);
      if (v) { window.scrollBy(0, v); place(); }
      d.raf = requestAnimationFrame(edge);
    }
    function end() {
      if (!d) return;
      var x = d;
      d = null;
      cancelAnimationFrame(x.raf);
      ["pointermove", "pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { x.h.removeEventListener(t, t === "pointermove" ? move : end); });
      x.it.classList.remove("is-dragging");
      x.it.classList.add("is-shifting");
      x.it.style.transform = "";
      setTimeout(function () { x.it.classList.remove("is-shifting"); }, 450);
      document.documentElement.classList.remove("is-reordering");
      var now = r.items();
      if (now.some(function (it, i) { return it !== x.order[i]; })) done(x.it);
    }
    list.addEventListener("pointerdown", function (e) {
      if (d || (e.pointerType === "mouse" && e.button !== 0)) return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      d = { it: it, h: h, id: e.pointerId, y: e.clientY, last: e.clientY, sy: window.scrollY, top: it.offsetTop, order: r.items(), raf: 0 };
      try { h.setPointerCapture(e.pointerId); } catch (err) {}
      it.classList.remove("is-shifting");
      it.classList.add("is-dragging");
      document.documentElement.classList.add("is-reordering");
      h.addEventListener("pointermove", move);
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { h.addEventListener(t, end); });
      d.raf = requestAnimationFrame(edge);
    });
    list.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      var h = grip(e.target), it = h && itemOf(h);
      if (!it) return;
      e.preventDefault();
      var up = e.key === "ArrowUp", sib = up ? prev(it) : next(it);
      if (!sib) return;
      // the neighbour moves, not the item, so that its grip keeps the focus
      slide([sib, it], function () { list.insertBefore(sib, up ? it.nextSibling : it); });
      done(it);
    });
    list.addEventListener("focusin", name);
    name();
    return r;
  }
  window.ds = window.ds || {};
  window.ds.reorder = reorder;
})();
/* The date and period picker, taken from Bank's operations (ds.datePick): the quick periods, then the units it offers as
   tabs (a day, a month, a year, two dates), then a grid of days, months or years under a head that steps through them.
   ds.datePick(holder, {value, quick, modes, min, max, years, today, label, onPick, onDraw, opener}) draws it in holder.
     value: the period, {from, to} as "2026-11-09": one day twice, a month's or a year's first and last days, or any two
     days; none (or {}) for every date. quick: [{label, from, to}], the periods one tap away (« Ce mois-ci »); the one
     equal to value is lit. modes: among "day", "month", "year" and "range" (all four by default, in that order), as tabs
     when there are several. min, max: the first and last days that can be chosen, the others greyed. years: [first,
     last], the years offered (min's and max's by default, else ten years back and two ahead). today: the day taken as
     today (Paris's by default). label: the picker's name for screen readers. onPick({from, to, mode, quick, label}) on a
     choice: quick is the quick period taken (or equal to it), label the words for a title. onDraw(holder) after each
     drawing, for a page that marks it. opener: the button that opens it, in the period head's popover (period.css),
     closed again by a choice, Escape or a tap elsewhere; without one, the picker stays in the page (.is-inline).
   Two dates take two taps, the first day then the last (the same one twice for a single day); while the last is sought
   the days between follow the pointer. The arrows of the keyboard move through a grid, Page Up and Page Down by its head's
   step (with Shift, by a year), Home and End to a row's ends, Enter or Space take; Escape forgets a first day, then
   closes. Returns {open(), close(), toggle(), set(value), get(), step(dir), canStep(dir), label(), draw(), el}:
   step(±1) moves the period by its own length (a day, a month, a year, as many months or days as it spans) and tells
   onPick, for the arrows beside a period's title; canStep(dir) says whether there is a period that way (else hide its arrow).
   Without a picker: ds.datePick.of(mode, day) is the day, month or year that holds day; ds.datePick.step(value, dir)
   moves a period; ds.datePick.label(value) names it (« novembre 2026 », « 3 nov. → 9 nov. 2026 »); ds.datePick.kind(value)
   says "all", "day", "month", "year" or "range". The days are Paris's days, written "2026-11-09", whatever the device. */
(function () {
  "use strict";
  var _ = window.ds._, day = window.ds.day, find = _.find, el = _.el;
  var parisToday = day.today, at = day.at, addDays = day.add, fmt = day.format;
  var MODES = ["day", "month", "year", "range"], PAGE = 12;
  var WORDS = _.table({
    fr: { day: "Jour", month: "Mois", year: "Année", range: "Dates", all: "Toutes les dates", pick: "Choisir la période", modes: "Choisir par",
          prev: { day: "Mois précédent", month: "Année précédente", year: "Années précédentes" },
          next: { day: "Mois suivant", month: "Année suivante", year: "Années suivantes" },
          first: "Choisissez le premier jour, puis le dernier.", last: function (d) { return "Du " + d + " : choisissez le dernier jour."; },
          since: function (d) { return "depuis le " + d; }, until: function (d) { return "jusqu’au " + d; } },
    en: { day: "Day", month: "Month", year: "Year", range: "Dates", all: "All dates", pick: "Choose the period", modes: "Choose by",
          prev: { day: "Previous month", month: "Previous year", year: "Earlier years" },
          next: { day: "Next month", month: "Next year", year: "Later years" },
          first: "Pick the first day, then the last.", last: function (d) { return "From " + d + ": pick the last day."; },
          since: function (d) { return "since " + d; }, until: function (d) { return "until " + d; } }
  });
  function words() { return _.words(WORDS); }
  function btn(cls, text, dp) {
    var b = el("button", cls, text);
    b.type = "button";
    if (dp) b.setAttribute("data-dp", dp);
    return b;
  }

  // the days are Paris's days, counted at noon UTC so that no clock change moves them (ds.day)
  function pad(n) { return String(n).padStart(2, "0"); }
  function daysBetween(a, b) { return Math.round((at(b) - at(a)) / 864e5); }
  function monthLen(ym) { return new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate(); }
  function monthIndex(ym) { return +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1; }
  function addMonths(ym, n) { var m = monthIndex(ym) + n; return Math.floor(m / 12) + "-" + pad(m % 12 + 1); }
  function date(t, style) { return window.ds.date(t, style); }
  function dayText(key, year) { return date(key, year ? { day: "numeric", month: "short", year: "numeric" } : "day"); }

  // the period of a unit that holds a day: the day itself, its month, its year
  function of(mode, key) {
    if (mode === "month") { var ym = key.slice(0, 7); return { from: ym + "-01", to: ym + "-" + pad(monthLen(ym)), mode: "month" }; }
    if (mode === "year") return { from: key.slice(0, 4) + "-01-01", to: key.slice(0, 4) + "-12-31", mode: "year" };
    return { from: key, to: key, mode: "day" };
  }
  function wholeMonths(v) { return !!(v.from && v.to) && v.from.slice(8) === "01" && v.to === of("month", v.to).to; }
  function kind(v) {
    if (!v || (!v.from && !v.to)) return "all";
    if (!v.from || !v.to) return "range";
    if (MODES.indexOf(v.mode) >= 0) return v.mode;
    if (v.from === v.to) return "day";
    if (v.from.slice(5) === "01-01" && v.to === v.from.slice(0, 4) + "-12-31") return "year";
    if (wholeMonths(v) && v.from.slice(0, 7) === v.to.slice(0, 7)) return "month";
    return "range";
  }
  function norm(v) {
    var f = (v && v.from) || null, t = (v && v.to) || null;
    if (f && t && t < f) { var x = f; f = t; t = x; }
    return { from: f, to: t, mode: kind({ from: f, to: t, mode: v && v.mode }) };
  }
  // a period moved by its own length: a day, a month, a year; a span of whole months by as many months (a quarter by a
  // quarter), any other span by as many days. Every date, or a span open at one end, does not move
  function step(v, dir) {
    v = norm(v);
    if (!v.from || !v.to) return null;
    if (!dir) return v;
    if (v.mode === "day") return of("day", addDays(v.from, dir));
    if (v.mode === "month") return of("month", addMonths(v.from.slice(0, 7), dir) + "-01");
    if (v.mode === "year") return of("year", (+v.from.slice(0, 4) + dir) + "-01-01");
    if (wholeMonths(v)) {
      var n = (monthIndex(v.to.slice(0, 7)) - monthIndex(v.from.slice(0, 7)) + 1) * dir;
      return { from: addMonths(v.from.slice(0, 7), n) + "-01", to: of("month", addMonths(v.to.slice(0, 7), n) + "-01").to, mode: "range" };
    }
    var d = (daysBetween(v.from, v.to) + 1) * dir;
    return { from: addDays(v.from, d), to: addDays(v.to, d), mode: "range" };
  }
  function label(v) {
    v = norm(v);
    var w = words();
    if (v.mode === "all") return w.all;
    if (!v.to) return w.since(dayText(v.from, true));
    if (!v.from) return w.until(dayText(v.to, true));
    // two taps on the same day are that day
    if (v.mode === "day" || v.from === v.to) return date(v.from, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (v.mode === "month") return date(v.from.slice(0, 7), "month");
    if (v.mode === "year") return v.from.slice(0, 4);
    var same = v.from.slice(0, 4) === v.to.slice(0, 4);
    // whole months are named by their months: « septembre → novembre 2026 »
    if (wholeMonths(v)) return (same ? date(v.from, { month: "long" }) : date(v.from.slice(0, 7), "month")) + " → " + date(v.to.slice(0, 7), "month");
    return dayText(v.from, !same) + " → " + dayText(v.to, true);
  }

  var made = 0;
  function datePick(holder, o) {
    holder = find(holder);
    if (!holder) return null;
    o = o || {};
    var id = "ds-datepick-" + (++made), opener = find(o.opener), quick = o.quick || [];
    var modes = (o.modes || MODES).filter(function (m) { return MODES.indexOf(m) >= 0; });
    if (!modes.length) modes = MODES.slice();
    function today() { return o.today || parisToday(); }
    var ty = +today().slice(0, 4), years = o.years || [o.min ? +o.min.slice(0, 4) : ty - 10, o.max ? +o.max.slice(0, 4) : ty + 2];
    // the first and last days that can be chosen: min and max, within the years offered
    var lo = years[0] + "-01-01", hi = years[1] + "-12-31";
    if (o.min && o.min > lo) lo = o.min;
    if (o.max && o.max < hi) hi = o.max;
    var st = { value: norm(o.value), mode: null, view: null, focus: null, anchor: null, hover: null };
    var p = { el: holder };

    holder.classList.add("periodpop", "datepick");
    holder.classList.toggle("is-inline", !opener);
    if (!holder.id) holder.id = id;
    holder.setAttribute("role", opener ? "dialog" : "group");
    holder.setAttribute("aria-label", o.label || words().pick);

    function clampDay(k) { return k < lo ? lo : k > hi ? hi : k; }
    // what a grid's cells are: days for a day or two dates, else months or years
    function unit() { return st.mode === "range" ? "day" : st.mode; }
    function unitKey(u, day) { return u === "day" ? day : u === "month" ? day.slice(0, 7) : day.slice(0, 4); }
    function span(u, k) { return u === "day" ? { from: k, to: k } : of(u, u === "month" ? k + "-01" : k + "-01-01"); }
    function enabled(u, k) { var s = span(u, k); return s.to >= lo && s.from <= hi; }
    function clampUnit(u, k) { var a = unitKey(u, lo), b = unitKey(u, hi); return k < a ? a : k > b ? b : k; }
    // the period shown again when the picker opens or is set: its own unit when offered, else the months
    function reset() {
      var v = st.value;
      st.mode = modes.indexOf(v.mode) >= 0 ? v.mode : modes.indexOf("month") >= 0 ? "month" : modes[0];
      st.view = clampDay(v.mode === "range" ? v.to || v.from : v.from || today());
      st.focus = null; st.anchor = null; st.hover = null;
    }
    function matchQuick() {
      var v = st.value;
      return quick.filter(function (q) { return (q.from || null) === v.from && (q.to || null) === v.to; })[0] || null;
    }
    // a title's words: a quick period's own name for a span or every date (« 3 derniers mois »), else the period's
    p.label = function () {
      var q = matchQuick();
      return q && (st.value.mode === "range" || st.value.mode === "all") ? q.label : label(st.value);
    };
    p.get = function () { return { from: st.value.from, to: st.value.to, mode: st.value.mode }; };

    // the cells of the grid shown: the view's month of days, its year of months, or its page of twelve years
    function yearPage() {
      var y1 = +hi.slice(0, 4), y0 = +lo.slice(0, 4), vy = +st.view.slice(0, 4);
      var end = y1 - PAGE * Math.floor((y1 - vy) / PAGE);
      return { from: Math.max(y0, end - PAGE + 1), to: end };
    }
    function cells() {
      var u = unit(), out = [], i;
      if (u === "day") { var ym = st.view.slice(0, 7), n = monthLen(ym); for (i = 1; i <= n; i++) out.push(ym + "-" + pad(i)); }
      else if (u === "month") { for (i = 1; i <= 12; i++) out.push(st.view.slice(0, 4) + "-" + pad(i)); }
      else { var pg = yearPage(); for (i = pg.from; i <= pg.to; i++) out.push(String(i)); }
      return out;
    }
    function chosen(u, k) {
      var v = st.value;
      if (st.mode === "range") return st.anchor ? k === st.anchor : !!(v.from && v.to) && (k === v.from || k === v.to);
      return v.mode === st.mode && unitKey(u, v.from) === k;
    }
    // the days between two dates: those of the period, or while the last day is sought, those up to the pointer
    function between(k) {
      if (st.mode !== "range") return false;
      var a = st.anchor ? st.anchor : st.value.from, b = st.anchor ? st.hover : st.value.to;
      if (!a || !b) return false;
      if (b < a) { var x = a; a = b; b = x; }
      return k > a && k < b;
    }
    function defaultFocus(list) {
      var u = unit(), ok = list.filter(function (k) { return enabled(u, k); });
      var sel = ok.filter(function (k) { return chosen(u, k); })[0], t = unitKey(u, today());
      return sel || (ok.indexOf(t) >= 0 ? t : ok[0] || null);
    }
    function pageAt(d) {
      var u = unit(), y = +st.view.slice(0, 4);
      if (u === "day") return clampDay(addMonths(st.view.slice(0, 7), d) + "-01");
      if (u === "month") return clampDay((y + d) + "-" + st.view.slice(5, 7) + "-01");
      return clampDay((y + PAGE * d) + "-01-01");
    }
    function canPage(d) {
      var u = unit();
      if (u === "day") { var ym = addMonths(st.view.slice(0, 7), d); return enabled("month", ym); }
      if (u === "month") return enabled("year", String(+st.view.slice(0, 4) + d));
      var pg = yearPage();
      return d < 0 ? pg.from > +lo.slice(0, 4) : pg.to < +hi.slice(0, 4);
    }
    function page(d) {
      if (!canPage(d)) return;
      st.view = pageAt(d);
      st.focus = null;
      draw(d < 0 ? "prev" : "next");
    }
    function headText() {
      var u = unit();
      if (u === "day") return date(st.view.slice(0, 7), "month");
      if (u === "month") return st.view.slice(0, 4);
      var pg = yearPage();
      return pg.from === pg.to ? String(pg.from) : pg.from + " – " + pg.to;
    }

    function setMode(m) {
      if (st.mode === m) return;
      st.mode = m; st.focus = null; st.anchor = null; st.hover = null;
      draw("t-" + m);
    }
    function choose(k) {
      var u = unit();
      if (st.mode !== "range") return pick(of(st.mode, u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01"));
      // two dates: the first tap keeps a day, the second closes the span (in either order)
      if (!st.anchor) { st.anchor = k; st.hover = k; st.focus = k; return draw("c:" + k); }
      var a = st.anchor < k ? st.anchor : k, b = st.anchor < k ? k : st.anchor;
      pick({ from: a, to: b, mode: "range" });
    }
    function pick(v, q) {
      st.value = norm(v);
      st.anchor = null; st.hover = null;
      var out = p.get(), inside = holder.contains(document.activeElement);
      out.quick = q || matchQuick();
      out.label = p.label();
      if (opener && !holder.hidden) { p.close(); if (inside) opener.focus(); } else { reset(); draw(inside ? "cell" : null); }
      if (o.onPick) o.onPick(out);
      return out;
    }

    function quickRow() {
      var box = el("div", "dp-quick"), lit = matchQuick();
      quick.forEach(function (q, i) {
        var b = btn(q === lit ? "on" : "", q.label, "q" + i);
        b.setAttribute("aria-pressed", q === lit ? "true" : "false");
        b.addEventListener("click", function () { pick({ from: q.from, to: q.to }, q); });
        box.append(b);
      });
      return box;
    }
    function tabRow() {
      var w = words(), box = el("div", "tabs dp-tabs");
      box.setAttribute("role", "tablist");
      box.setAttribute("aria-label", w.modes);
      box.style.setProperty("--dp-tabs", String(modes.length));
      modes.forEach(function (m) {
        var on = m === st.mode, b = btn(on ? "on" : "", w[m], "t-" + m);
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("aria-controls", id + "-grid");
        b.tabIndex = on ? 0 : -1;
        b.addEventListener("click", function () { setMode(m); });
        box.append(b);
      });
      return box;
    }
    function headRow() {
      var w = words(), u = unit(), h = el("div", "dp-head"), prev = btn("dp-step", window.ds.ico("chevron-left"), "prev"), next = btn("dp-step", window.ds.ico("chevron-right"), "next"), mid;
      prev.setAttribute("aria-label", w.prev[u]);
      next.setAttribute("aria-label", w.next[u]);
      prev.disabled = !canPage(-1);
      next.disabled = !canPage(1);
      prev.addEventListener("click", function () { page(-1); });
      next.addEventListener("click", function () { page(1); });
      // the month, the year or the years, written between the arrows, as Bank had it: the arrows go a step at a time
      mid = el("span", "dp-title", headText());
      h.append(prev, mid, next);
      return h;
    }
    function cell(u, k, focusKey) {
      var t = unitKey(u, today()), text = u === "day" ? String(+k.slice(8)) : u === "month" ? fmt(k + "-15", { month: "short" }) : k;
      var on = chosen(u, k), b = btn((on ? "on" : "") + (between(k) ? " is-in" : "") + (k === t ? " is-today" : ""), text, "c:" + k);
      b.dataset.key = k;
      b.tabIndex = k === focusKey ? 0 : -1;
      b.disabled = !enabled(u, k);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", u === "day" ? date(k, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : u === "month" ? date(k, "month") : k);
      if (k === t) b.setAttribute("aria-current", "date");
      b.addEventListener("click", function () { choose(k); });
      return b;
    }
    function gridBox() {
      var u = unit(), list = cells(), g = el("div", "dp-grid is-" + u + "s");
      g.id = id + "-grid";
      g.setAttribute("role", "group");
      g.setAttribute("aria-label", headText());
      var focusKey = st.focus && list.indexOf(st.focus) >= 0 && enabled(u, st.focus) ? st.focus : defaultFocus(list);
      st.focus = focusKey;
      if (u === "day") {
        // the days of the week from Monday, then as many blanks as the month's first day is late
        for (var i = 0; i < 7; i++) {
          var wd = el("span", "dp-wd", fmt(addDays("2026-11-09", i), { weekday: "narrow" }));
          wd.setAttribute("aria-hidden", "true");
          g.append(wd);
        }
        for (var j = (at(list[0]).getUTCDay() + 6) % 7; j > 0; j--) g.append(el("span"));
      }
      list.forEach(function (k) { g.append(cell(u, k, focusKey)); });
      return g;
    }
    function draw(focus) {
      var act = document.activeElement, had = act && holder.contains(act) && act.getAttribute ? act.getAttribute("data-dp") : null;
      if (!st.mode) reset();
      var kids = [];
      if (quick.length) kids.push(quickRow());
      if (modes.length > 1) kids.push(tabRow());
      kids.push(headRow(), gridBox());
      if (st.mode === "range") kids.push(el("p", "dp-hint", st.anchor ? words().last(dayText(st.anchor)) : words().first));
      holder.replaceChildren.apply(holder, kids);
      // the focus stays on what had it, or goes where the keys sent it
      var want = focus || had, t = want === "cell" ? holder.querySelector('.dp-grid [tabindex="0"]') : want ? holder.querySelector('[data-dp="' + want + '"]') : null;
      if (t && !t.disabled && !holder.hidden) t.focus({ preventScroll: true });
      if (o.onDraw) o.onDraw(holder);
      return p;
    }
    // while the last day is sought, the days between follow the pointer, without drawing the grid again
    function paint() {
      [].forEach.call(holder.querySelectorAll(".dp-grid.is-days button"), function (b) { b.classList.toggle("is-in", between(b.dataset.key)); });
    }

    // the keys: in a grid, the arrows, Home and End, Page Up and Page Down; between the tabs, the arrows
    function moved(u, k, e) {
      var key = e.key, d;
      if (u === "day") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[key];
        if (d) return addDays(k, d);
        if (key === "Home") return addDays(k, -((at(k).getUTCDay() + 6) % 7));
        if (key === "End") return addDays(k, 6 - (at(k).getUTCDay() + 6) % 7);
        if (key === "PageUp" || key === "PageDown") {
          var ym = addMonths(k.slice(0, 7), (key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1));
          return ym + "-" + pad(Math.min(+k.slice(8), monthLen(ym)));
        }
        return null;
      }
      if (u === "month") {
        d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -12, PageDown: 12 }[key];
        if (d) return addMonths(k, d);
        if (key === "Home" || key === "End") return k.slice(0, 4) + (key === "Home" ? "-01" : "-12");
        return null;
      }
      d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -PAGE, PageDown: PAGE }[key];
      if (d) return String(+k + d);
      if (key === "Home" || key === "End") { var pg = yearPage(); return String(key === "Home" ? pg.from : pg.to); }
      return null;
    }
    holder.addEventListener("keydown", function (e) {
      if (e.defaultPrevented) return;
      if (e.key === "Escape") {
        // first the day kept for two dates; then the popover, the top layer, closes (inline, Escape goes on to what holds it)
        if (st.anchor) { e.preventDefault(); st.anchor = null; st.hover = null; draw(); }
        return;
      }
      var dp = e.target.getAttribute && e.target.getAttribute("data-dp");
      if (!dp) return;
      if (dp.slice(0, 2) === "t-" && /^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        var i = modes.indexOf(dp.slice(2)), n = modes.length;
        e.preventDefault();
        setMode(modes[e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowLeft" ? -1 : 1) + n) % n]);
        return;
      }
      if (dp.slice(0, 2) !== "c:" || e.altKey || e.ctrlKey || e.metaKey) return;
      var u = unit(), k = moved(u, dp.slice(2), e);
      if (k == null) return;
      e.preventDefault();
      k = clampUnit(u, k);
      st.focus = k;
      st.view = clampDay(u === "day" ? k : u === "month" ? k + "-01" : k + "-01-01");
      if (st.anchor) st.hover = k;
      draw("c:" + k);
    });
    holder.addEventListener("pointerover", function (e) {
      var c = st.anchor && e.target.closest ? e.target.closest(".dp-grid.is-days button") : null;
      if (!c || c.disabled || c.dataset.key === st.hover) return;
      st.hover = c.dataset.key;
      paint();
    });

    // opened under its button, a layer: Escape closes it and gives the focus back to the button; Tab is free
    var cover = { el: holder, trap: false, close: function () { var inside = holder.contains(document.activeElement); p.close(); if (inside || document.activeElement === document.body) opener.focus(); } };
    p.open = function () {
      reset();
      holder.hidden = false;
      if (opener) { opener.setAttribute("aria-expanded", "true"); _.layer(cover); }
      return draw("cell");
    };
    p.close = function () {
      holder.hidden = true;
      st.anchor = null; st.hover = null;
      _.unlayer(cover);
      if (opener) opener.setAttribute("aria-expanded", "false");
      return p;
    };
    p.toggle = function () { return holder.hidden ? p.open() : p.close(); };
    p.set = function (v) { st.value = norm(v); reset(); return draw(); };
    p.draw = function () { return draw(); };
    function within(v) { return !!v && (!v.to || v.to >= lo) && (!v.from || v.from <= hi); }
    p.canStep = function (dir) { return within(step(st.value, dir)); };
    p.step = function (dir) { var v = step(st.value, dir); return within(v) ? pick(v) : null; };

    if (opener) {
      opener.setAttribute("aria-haspopup", "dialog");
      opener.setAttribute("aria-controls", holder.id);
      opener.addEventListener("click", p.toggle);
      // pressed, not clicked: a tap inside that draws the picker again must not look like a tap elsewhere
      document.addEventListener("pointerdown", function (e) {
        if (!holder.hidden && !holder.contains(e.target) && !opener.contains(e.target)) p.close();
      });
      holder.hidden = true;
      opener.setAttribute("aria-expanded", "false");
    }
    reset();
    return draw();
  }
  datePick.of = of;
  datePick.step = step;
  datePick.label = label;
  datePick.kind = kind;
  datePick.today = parisToday;
  window.ds = window.ds || {};
  window.ds.datePick = datePick;
})();
/* Keeping up with the server, taken from Studio.
   ds.keep: a copy of the last data kept on the device (IndexedDB has room for all of it), so that a page opens at once on
     it, then refreshes. ds.keep.get(key), put(key, value) and del(key) answer with promises that never fail: where the
     device keeps nothing (IndexedDB missing, refused, or not answering within 3 s, as in some private windows), get
     answers null and put false, and the page simply waits for the server, as on a first visit. ds.keep.ok() says
     whether copies are kept. ds.keep.open(name) is a store of its own (a database name; "ds" for ds.keep itself).
     ds.keep.fresh(key, load, draw): draws the copy at once if there is one, draw(value, {copy: true, at}), unless the
     server answers first; then draws what load() answers, draw(value, {copy: false}), and keeps it.
   ds.stream(url, events, {open, poll, every, retry}): follows the server live through its event stream (EventSource):
     events {name: function (data)} receive each named event, its data read as JSON when it is. A dropped stream comes
     back by itself; one the server closed (it was restarting) is opened again after retry ms (2 s, doubling up to a
     minute), and at once when the page is seen again (a phone closes it in the background). open() is called at each
     connection, to catch up on what was missed; poll(), if given, every `every` ms (5 min) while the page is seen, as a
     backup, or instead of the stream where the browser has none. Returns {close(), source()}.
   ds.version(button, {mine, text}): the « new version » light on a page's reload button (.newver): seen(v) lights it when
     the server says a version other than this page's own (mine, or <meta name="version">); the button reloads the page. */
(function () {
  "use strict";
  var _ = window.ds._;
  var WORDS = _.table({
    fr: { reload: "Recharger la page", newer: "Nouvelle version du site : recharger la page" },
    en: { reload: "Reload the page", newer: "A new version is on line: reload the page" }
  });
  function words() { return _.words(WORDS); }

  var stores = {};
  function open(name) {
    if (stores[name]) return stores[name];
    var db = null;
    function base() {
      if (!db) db = new Promise(function (res, rej) {
        // a browser that neither opens nor refuses (some private windows) is taken as one that keeps nothing
        var late = setTimeout(function () { rej(new Error("timeout")); }, 3000);
        try {
          var r = indexedDB.open(name, 1);
          r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
          r.onsuccess = function () { clearTimeout(late); res(r.result); };
          r.onerror = r.onblocked = function () { clearTimeout(late); rej(r.error || new Error("blocked")); };
        } catch (e) { clearTimeout(late); rej(e); }
      });
      return db;
    }
    // one transaction, answered once it is written (or read): its request, or a refusal
    function ask(mode, run) {
      return base().then(function (d) {
        return new Promise(function (res, rej) {
          try {
            var tx = d.transaction("kv", mode), req = run(tx.objectStore("kv"));
            tx.oncomplete = function () { res(req); };
            tx.onerror = tx.onabort = function () { rej(tx.error); };
          } catch (e) { rej(e); }
        });
      });
    }
    var s = stores[name] = {
      get: function (key) { return ask("readonly", function (st) { return st.get(key); }).then(function (req) { return req.result === undefined ? null : req.result; }, function () { return null; }); },
      // a full device (its quota reached) or a value that cannot be kept answers false too: the page keeps working on
      // what the server sends
      put: function (key, value) { return ask("readwrite", function (st) { return st.put(value, key); }).then(function () { return true; }, function () { return false; }); },
      del: function (key) { return ask("readwrite", function (st) { return st.delete(key); }).then(function () { return true; }, function () { return false; }); },
      ok: function () { return base().then(function () { return true; }, function () { return false; }); },
      fresh: function (key, load, draw) {
        var served = false;
        var copy = s.get(key).then(function (c) {
          if (c && !served && c.at != null) draw(c.value, { copy: true, at: c.at });
        });
        return Promise.resolve().then(load).then(function (value) {
          served = true;
          draw(value, { copy: false });
          return s.put(key, { at: Date.now(), value: value }).then(function () { return value; });
        }, function (e) { return copy.then(function () { throw e; }); });
      }
    };
    return s;
  }
  var keep = open("ds");
  keep.open = open;

  function stream(url, events, o) {
    o = o || {};
    events = events || {};
    var src = null, wait = o.retry || 2000, timer = null, closed = false;
    function connect() {
      clearTimeout(timer);
      if (closed || !window.EventSource) return;
      if (src) src.close();
      src = new EventSource(url);
      src.onopen = function () { wait = o.retry || 2000; if (o.open) o.open(); };
      src.onerror = function () {
        // EventSource tries again by itself while it is CONNECTING; CLOSED means the server refused it (a restart)
        if (src.readyState !== 2 || closed) return;
        clearTimeout(timer);
        timer = setTimeout(connect, wait);
        wait = Math.min(wait * 2, 60000);
      };
      Object.keys(events).forEach(function (name) {
        src.addEventListener(name, function (e) {
          var data = e.data;
          try { data = JSON.parse(e.data); } catch (x) {}
          events[name](data, e);
        });
      });
    }
    function seen() { return document.visibilityState === "visible"; }
    document.addEventListener("visibilitychange", function () {
      if (seen() && src && src.readyState === 2 && !closed) connect();
    });
    var every = null;
    if (o.poll) every = setInterval(function () { if (seen() && !closed) o.poll(); }, o.every || 300000);
    connect();
    return {
      close: function () { closed = true; clearTimeout(timer); clearInterval(every); if (src) src.close(); },
      source: function () { return src; }
    };
  }

  function version(button, o) {
    o = o || {};
    var meta = document.querySelector('meta[name="version"]'), mine = o.mine || (meta && meta.content) || null, w = words();
    if (!button.querySelector(".newver-pip")) {
      var pip = document.createElement("i");
      pip.className = "newver-pip";
      pip.setAttribute("aria-hidden", "true");
      button.appendChild(pip);
    }
    button.classList.add("newver");
    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", w.reload);
    if (!button.title) button.title = w.reload;
    button.addEventListener("click", function () { location.reload(); });
    var light = {
      on: false,
      seen: function (v) {
        if (!v || !mine || String(v) === String(mine) || light.on) return light.on;
        light.on = true;
        button.classList.add("is-on");
        button.title = o.text || w.newer;
        button.setAttribute("aria-label", o.text || w.newer);
        return true;
      }
    };
    return light;
  }

  window.ds = window.ds || {};
  window.ds.keep = keep;
  window.ds.stream = stream;
  window.ds.version = version;
})();
