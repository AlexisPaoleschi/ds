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
