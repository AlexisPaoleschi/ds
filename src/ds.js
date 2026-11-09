/* Design system: the behaviour the apps share.
   ds.toast({type, text, action, duration}) shows a passing message at the bottom right (above the tab bar on a phone)
   and returns a handle to change it (update) or take it away (close).
   type: "good" (done, 4 s), "info" (5 s), "busy" (until changed), "bad" (stays until closed); an action keeps it 8 s.
   ds.confirm({title, text, ok, danger, value}) asks in a window instead of the browser's boxes (see below).
   ds.drawer(name, {onChange}) runs a page's filters drawer; ds.status(holder, {…}) draws the state of its sources;
   ds.when(t), ds.ago(t) and ds.soon(t) say a time in words, in Paris's time; ds.date(t, style) writes a date;
   ds.number(n) and ds.money(n) write figures; ds.api(method, url, body) asks the app's server; ds.jobs(holder, jobs)
   draws the syncs of a settings page; ds.busy runs the header's loading wheel; ds.trouble(key, {…}) tells a source that
   failed, once, with « Réessayer »; ds.h and ds.ico build nodes; ds.compact writes a short figure; ds.avatar a logo with its
   initial; ds.fold keeps foldable sections as left; ds.route and ds.seek follow the address after #. Rows that open, forms
   that ask before deleting and the messages left after a redirect work by themselves (see below).
   Their own words follow the page's language, <html lang>: English for "en…", French otherwise. */
(function () {
  "use strict";
  var LIFE = { good: 4000, info: 5000, busy: 0, bad: 0 };
  var WORDS = {
    fr: { close: "Fermer", cancel: "Annuler", confirm: "Confirmer", openFilters: "Ouvrir les filtres", closeFilters: "Fermer les filtres",
          never: "jamais", today: "aujourd'hui", yesterday: "hier", tomorrow: "demain", on: "le ", at: " à ", now: "à l’instant",
          ago: function (x) { return "il y a " + x; }, soon: "dans un instant", in: function (x) { return "dans " + x; },
          journal: "Journal", run: "Lancer", runNow: " maintenant", started: "Lancé", running: "En cours", allLogs: "Tout sur Render ↗",
          live: "En direct, passage en cours", lastRuns: "Derniers passages", loading: "Chargement…",
          nothing: "Rien d’écrit depuis le démarrage du serveur.", journalOf: function (x) { return "Journal : " + x; },
          retry: "Réessayer", tryingAgain: "nouvel essai…", stillFailing: "toujours impossible.", upToDate: "à jour" },
    en: { close: "Close", cancel: "Cancel", confirm: "Confirm", openFilters: "Open the filters", closeFilters: "Close the filters",
          never: "never", today: "today", yesterday: "yesterday", tomorrow: "tomorrow", on: "on ", at: " at ", now: "just now",
          ago: function (x) { return x + " ago"; }, soon: "in a moment", in: function (x) { return "in " + x; },
          journal: "Log", run: "Run", runNow: " now", started: "Started", running: "Running", allLogs: "All on Render ↗",
          live: "Live, running now", lastRuns: "Last runs", loading: "Loading…",
          nothing: "Nothing written since the server started.", journalOf: function (x) { return "Log: " + x; },
          retry: "Try again", tryingAgain: "trying again…", stillFailing: "still failing.", upToDate: "up to date" }
  };
  // read when a message or a window opens, so that a page that changes its language is followed
  function words() { return english() ? WORDS.en : WORDS.fr; }
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
      '<button type="button" class="act" hidden></button><button type="button" class="x" aria-label="' + words().close + '">×</button>';
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
  // ds.confirm({title, text, ok, danger, value, placeholder, inputmode, autocomplete, maxlength}) asks in a window of the design
  // system and answers with a promise:
  // false when cancelled, true when confirmed, or the typed text when the window has a field (value).
  // A dangerous answer (danger) starts on « Annuler » (Cancel), so Enter never deletes by mistake.
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var veil = document.createElement("div"), field = opts.value != null;
      veil.className = "dialog-veil";
      veil.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-t"><h2 class="dialog-t" id="dialog-t"></h2>' +
        '<p class="dialog-x"></p>' + (field ? '<input class="dialog-in" type="text">' : "") +
        '<div class="dialog-b"><button type="button" class="btn dialog-no">' + words().cancel + '</button><button type="button" class="btn dialog-ok"></button></div></div>';
      var ok = veil.querySelector(".dialog-ok"), no = veil.querySelector(".dialog-no"), input = veil.querySelector(".dialog-in"), text = veil.querySelector(".dialog-x");
      veil.querySelector(".dialog-t").textContent = opts.title || "";
      text.textContent = opts.text || "";
      text.hidden = !opts.text;
      ok.textContent = opts.ok || words().confirm;
      ok.classList.add(opts.danger ? "is-danger" : "is-save");
      if (input) {
        input.value = opts.value;
        input.placeholder = opts.placeholder || "";
        // a code received by SMS: the figures' keyboard, and the phone offering the code it just got
        if (opts.inputmode) input.inputMode = opts.inputmode;
        if (opts.autocomplete) input.setAttribute("autocomplete", opts.autocomplete);
        if (opts.maxlength) input.maxLength = opts.maxlength;
      }
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
  function english() { return /^en\b/i.test(document.documentElement.lang || ""); }

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
    try { d.open = localStorage.getItem(name) === "1"; } catch (e) {}
    d.set = function (open) {
      var was = d.open;
      d.open = !!open;
      try { localStorage.setItem(name, d.open ? "1" : "0"); } catch (e) {}
      paint(name);
      if (was === d.open) return;
      if (d.onChange) d.onChange(d.open);
      if (!phone()) return;
      var to = d.open ? document.querySelector('[data-drawer="' + name + '"] .side') : document.querySelector('[data-drawer-toggle="' + name + '"]');
      if (to) { if (d.open) to.setAttribute("tabindex", "-1"); to.focus({ preventScroll: true }); }
    };
    d.toggle = function () { d.set(!d.open); };
    d.mark = function (on) { d.marked = !!on; paint(name); };
    paint(name);
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
  document.addEventListener("keydown", function (e) {
    // a window of ds.confirm takes its own Escape first
    if (e.key !== "Escape" || e.defaultPrevented || !phone()) return;
    Object.keys(drawers).forEach(function (name) { if (drawers[name].open) drawers[name].set(false); });
  });

  /* ds.status(holder, {summary, late, rows, link}) draws the state of a page's sources in holder (its <footer>): one line
     that says it all (summary, a gold dot when late), opening on one row per source,
     rows: [{icon, name, state, every, ok, detail}] — what was read and when (state), how often (every), whether it is on
     time (ok) and, when not, why (detail) — then link: {href, text}. Whether it is open stays across redraws and visits. */
  function svgIcon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.setAttribute("class", "ico");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }
  function tag(name, cls, text) {
    var el = document.createElement(name);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }
  function status(holder, o) {
    var key = "ds-status " + location.pathname, det = tag("details", "status"), summary = tag("summary"), list = tag("ul");
    try { det.open = sessionStorage.getItem(key) === "1"; } catch (e) {}
    summary.append(tag("i", "dot" + (o.late ? " warn" : "")), o.summary || "");
    (o.rows || []).forEach(function (r) {
      var li = tag("li", r.ok ? "" : "late"), sn = tag("span", "sn"), sw = tag("span", "sw");
      sn.append(svgIcon(r.icon || "doc"), r.name || "");
      sw.append(svgIcon(r.ok ? "check" : "alert"), r.state || "");
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
    det.addEventListener("toggle", function () { try { sessionStorage.setItem(key, det.open ? "1" : "0"); } catch (e) {} });
    holder.replaceChildren(det);
    return det;
  }

  /* ds.when(t): « aujourd'hui à 6h00 », « hier à 21h04 », « le 1er nov. à 9h00 » (« today at 6:00 »… in English);
     ds.ago(t): « à l’instant », « il y a 3 min », « il y a 2h05 », then as when; ds.soon(t): « dans 12 min », then as when.
     t: a Date, an ISO text, or a number of milliseconds (or of seconds, below 10^12). The days are Paris's days. */
  var TZ = "Europe/Paris";
  function date(t) { return t instanceof Date ? t : new Date(typeof t === "number" && t < 1e12 ? t * 1000 : t); }
  function dayKey(d) { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }
  function clock(d) {
    var parts = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
    var h = +parts.find(function (p) { return p.type === "hour"; }).value, m = parts.find(function (p) { return p.type === "minute"; }).value;
    return english() ? h + ":" + m : h + "h" + m;
  }
  function day(d) {
    var w = words(), k = dayKey(d), now = Date.now();
    if (k === dayKey(new Date(now))) return w.today;
    if (k === dayKey(new Date(now - 864e5))) return w.yesterday;
    if (k === dayKey(new Date(now + 864e5))) return w.tomorrow;
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
    return w.on + (english() ? text : text.replace(/^1 /, "1er "));
  }
  function when(t) {
    if (!t) return words().never;
    var d = date(t);
    return day(d) + words().at + clock(d);
  }
  function ago(t) {
    if (!t) return words().never;
    var w = words(), s = (Date.now() - date(t)) / 1000;
    if (s < 60) return w.now;
    if (s < 3600) return w.ago(Math.round(s / 60) + " min");
    if (s < 6 * 3600) return w.ago(Math.floor(s / 3600) + "h" + String(Math.round(s % 3600 / 60)).padStart(2, "0"));
    return when(t);
  }
  function soon(t) {
    if (!t) return words().never;
    var w = words(), s = (date(t) - Date.now()) / 1000;
    if (s < 60) return w.soon;
    if (s < 3600) return w.in(Math.round(s / 60) + " min");
    return when(t);
  }

  /* ds.date(t, style): a date in words, Paris's day: "long" « 9 novembre 2026 » (the default), "weekday" « lundi 9 novembre »,
     "month" « novembre 2026 », "short" « 09/11/26 », "day" « 9 nov. », or Intl's own options; the first of a month is
     « 1er » in French. A day without its time ("2026-11-09", or a month "2026-11") stays that day wherever the device is. */
  var STYLES = { long: { day: "numeric", month: "long", year: "numeric" }, weekday: { weekday: "long", day: "numeric", month: "long" },
    month: { month: "long", year: "numeric" }, short: { day: "2-digit", month: "2-digit", year: "2-digit" }, day: { day: "numeric", month: "short" } };
  function dateText(t, style) {
    if (t == null || t === "") return "";
    var opts = Object.assign({}, typeof style === "object" ? style : STYLES[style || "long"]), d;
    var bare = typeof t === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(t);
    if (bare) { d = new Date(t.length === 7 ? t + "-15T12:00:00Z" : t + "T12:00:00Z"); opts.timeZone = "UTC"; }
    else { d = date(t); opts.timeZone = TZ; }
    var text = new Intl.DateTimeFormat(english() ? "en-GB" : "fr-FR", opts).format(d);
    return english() || opts.day !== "numeric" ? text : text.replace(/(^|\s)1 (?=\D)/, "$11er ");
  }

  /* ds.number(n, decimals) and ds.money(n, {currency, signed, decimals}): French figures, the thousands set apart by a
     space the fonts draw (French uses a narrow one that Archivo and IBM Plex Mono do not); money: « −1 234,56€ », « +12€ »
     with signed, « 12,00 USD » for another currency, « — » for no figure. */
  function number(n, decimals) {
    if (n == null || isNaN(n)) return "—";
    var k = decimals || 0;
    return new Intl.NumberFormat(english() ? "en-GB" : "fr-FR", { minimumFractionDigits: k, maximumFractionDigits: k })
      .format(n).replace(/[\u202f\u00a0]/g, "\u00a0");
  }
  function money(n, o) {
    if (n == null || isNaN(n)) return "—";
    o = o || {};
    var cur = o.currency || "EUR", k = o.decimals == null ? 2 : o.decimals;
    return (n < 0 ? "−" : o.signed && n > 0 ? "+" : "") + number(Math.abs(n), k) + (cur === "EUR" ? "€" : "\u00a0" + cur);
  }

  /* ds.api(method, url, body): the app's server, as JSON. Its header against forged requests is the one its <html> names,
     data-api="X-Bank" (sent as X-Bank: 1). An ended session goes back to /login; an error says the server's own words. */
  /* ds.api(method, url, body, {retry}): besides the header named by <html data-api>, a Spring page's CSRF token
     (<meta name="_csrf"> under the header of <meta name="_csrf_header">) goes with everything but a GET. A GET that meets
     the server restarting (502, 503, 504, or no answer at all) tries again every 3 s for a minute, as a deploy takes;
     {retry: false} says no. An ended session (401, or a request sent on to a sign-in page, as Spring does) goes to the
     sign-in page, the page's address kept to come back to it after. An error says the server's own words (detail, or
     error.message) and carries err.status and err.code (the server's code, e.g. "tool_error"). */
  var AFTER_LOGIN = "ds-after-login";
  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function signIn(to) {
    try { sessionStorage.setItem(AFTER_LOGIN, location.pathname + location.search + location.hash); } catch (e) {}
    location.href = to;
  }
  function api(method, url, body, o) {
    o = o || {};
    var root = document.documentElement, name = root.getAttribute("data-api"), headers = { Accept: "application/json" };
    if (name) headers[name] = "1";
    var csrf = document.querySelector('meta[name="_csrf"]'), csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    if (csrf && method !== "GET") headers[(csrfHeader && csrfHeader.content) || "X-CSRF-TOKEN"] = csrf.content;
    if (body) headers["Content-Type"] = "application/json";
    var left = method === "GET" && o.retry !== false ? 20 : 0;
    function once() {
      return fetch(url, { method: method, credentials: "same-origin", cache: "no-store", headers: headers, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) {
          if (left > 0 && r.status >= 502 && r.status <= 504) { left -= 1; return wait(3000).then(once); }
          if (r.status === 401 || (r.redirected && /\/(login|signin)\b/i.test(r.url))) {
            signIn(r.redirected ? r.url : root.getAttribute("data-login") || "/login");
            var gone = new Error("session"); gone.status = 401; gone.code = "session"; throw gone;
          }
          return r.json().catch(function () { return null; }).then(function (d) {
            if (!r.ok) {
              var e = new Error((d && (d.detail || (d.error && d.error.message))) || "erreur " + r.status);
              e.status = r.status;
              e.code = (d && ((d.error && d.error.code) || d.code)) || null;
              throw e;
            }
            return d;
          });
        }, function (e) {
          // no answer at all: the server is down a moment, or the network
          if (left > 0) { left -= 1; return wait(3000).then(once); }
          throw e;
        });
    }
    return once();
  }
  // back from the sign-in page, the page opens where it was left
  function cameBack() {
    var was = null;
    try { was = sessionStorage.getItem(AFTER_LOGIN); sessionStorage.removeItem(AFTER_LOGIN); } catch (e) {}
    if (!was || location.hash) return;
    var hash = was.indexOf("#") >= 0 ? was.slice(was.indexOf("#")) : "";
    if (hash && was.split("#")[0] === location.pathname + location.search) {
      history.replaceState(null, "", hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
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
  function el(name, cls, kids) {
    var e = tag(name, cls);
    (kids || []).forEach(function (k) { if (k != null) e.append(k); });
    return e;
  }
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
     loading covers the page, its share (#boot-pc) is the same. */
  var STEP = 50;
  var bz = { shown: 0, speed: 0, work: 0, arrive: 0, known: false, tick: null, end: null, start: 0, key: null, expected: 3000, top: null, word: false };
  function busyTop() { return bz.top || document.querySelector("header.top"); }
  function busyText(text) {
    var top = busyTop(), pc = top && top.querySelector(".busy .pc"), boot = document.getElementById("boot-pc");
    if (pc) pc.textContent = text;
    if (boot) boot.textContent = text;
  }
  function busyTimes() { try { return JSON.parse(localStorage.getItem("ds-busy-ms") || "{}"); } catch (e) { return {}; } }
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
      if (bz.key) { var t = busyTimes(); t[bz.key] = Math.max(500, Date.now() - bz.start); try { localStorage.setItem("ds-busy-ms", JSON.stringify(t)); } catch (e) {} }
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

  /* ds.h(tag, attrs, kids) builds a node: attrs.class, attrs.text, attrs.style, on… as real listeners (an inline handler
     would be blocked by a strict page), anything else as an attribute; null and false are skipped, strings become text.
     ds.ico(name) is an icon of the sprite. Studio drew its whole page so; ds's own parts can too. */
  var SVGNS = "http://www.w3.org/2000/svg";
  function h(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "style") node.setAttribute("style", v);
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return node;
  }
  function ico(name, cls) {
    var svg = document.createElementNS(SVGNS, "svg"), use = document.createElementNS(SVGNS, "use");
    svg.setAttribute("class", "ico" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  /* ds.compact(n): a figure that must stay short, « 9 850 », « 57,9k », « 578k », « 1,2M » (« 57.9k » in English). */
  function compact(n) {
    if (n == null || isNaN(n)) return "";
    var a = Math.abs(n), lang = english() ? "en-GB" : "fr-FR";
    function f(x, d) { return new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(x).replace(/ /g, " "); }
    if (a < 10000) return number(n, 0);
    if (a < 100000) return f(n / 1000, 1) + "k";
    if (a < 1000000) return f(n / 1000, 0) + "k";
    return f(n / 1000000, a < 10000000 ? 1 : 0) + "M";
  }

  /* ds.avatar(name, src): a merchant's or a person's logo, its initial underneath while the image comes, or if it never does. */
  function avatar(name, src, cls) {
    var span = h("span", { class: "avatar" + (cls ? " " + cls : ""), "aria-hidden": "true" }, [String(name || "?").trim().charAt(0).toUpperCase() || "?"]);
    if (src) {
      var img = h("img", { src: src, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { img.remove(); });
      span.appendChild(img);
    }
    return span;
  }

  /* Foldable sections: <details class="fold" data-fold="key"> open as the device left them, each change remembered under
     ds-fold:<key>. On loading, and again with ds.fold(holder) once a page draws them anew. */
  function fold(root) {
    (root || document).querySelectorAll("details[data-fold]").forEach(function (d) {
      var v = null;
      try { v = localStorage.getItem("ds-fold:" + d.getAttribute("data-fold")); } catch (e) {}
      if (v != null) d.open = v === "1";
    });
  }
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.matches || !d.matches("details[data-fold]")) return;
    try { localStorage.setItem("ds-fold:" + d.getAttribute("data-fold"), d.open ? "1" : "0"); } catch (x) {}
  }, true);

  /* Whole rows that open: a row (tr.is-link, or any [data-row-link]) holding a link a.row-link, or a data-href, opens it on a
     click anywhere in it, but not on its own buttons, fields or links, not at the end of a text selection; Ctrl, ⌘ or the
     middle button open it in a new tab, as a link would. By delegation: rows drawn later work too. A row with neither link
     nor data-href is left to the page (Bank opens its sheet). On iPhone a stretched link does not cover a table row: hence this. */
  var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, [role="button"]';
  function rowHref(e) {
    var row = e.target.closest && e.target.closest("tr.is-link, [data-row-link]");
    if (!row || e.target.closest(INTERACTIVE)) return null;
    var sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed) return null;
    var link = row.querySelector("a.row-link");
    return { link: link, href: row.getAttribute("data-href") || (link && link.href) };
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.altKey || e.shiftKey) return;
    var r = rowHref(e);
    if (!r || !r.href) return;
    if (e.metaKey || e.ctrlKey) { window.open(r.href, "_blank", "noopener"); return; }
    if (r.link) r.link.click(); else location.href = r.href;
  });
  document.addEventListener("auxclick", function (e) {
    if (e.button !== 1) return;
    var r = rowHref(e);
    if (r && r.href) { e.preventDefault(); window.open(r.href, "_blank", "noopener"); }
  });

  /* ds.route(onRoute): the address after # as the page's state. « #analyse/patreon-alexis/derniers-membres?compte=hb » gives
     onRoute({parts: ["analyse", "patreon-alexis", "derniers-membres"], query: {compte: "hb"}}), at once and at every change
     (back, a link). ds.route.go(parts, query, {push}) writes it without the page jumping, replacing by default so that Back
     does not walk through every filter. ds.seek(anchor) brings [data-anchor="anchor"] into view, opens the foldable sections
     around it, and lights it a moment. Back from the sign-in page, the address left is found again (ds.api keeps it). */
  function parseRoute() {
    var raw = decodeURIComponent(location.hash.replace(/^#/, "")), q = raw.indexOf("?"), query = {};
    (q >= 0 ? raw.slice(q + 1) : "").split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("=");
      query[i < 0 ? pair : pair.slice(0, i)] = i < 0 ? "" : pair.slice(i + 1);
    });
    return { parts: (q >= 0 ? raw.slice(0, q) : raw).split("/").filter(Boolean), query: query };
  }
  function route(onRoute) {
    window.addEventListener("hashchange", function () { onRoute(parseRoute()); });
    onRoute(parseRoute());
  }
  route.go = function (parts, query, o) {
    var q = Object.keys(query || {}).filter(function (k) { return query[k] != null && query[k] !== ""; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]); }).join("&");
    var hash = "#" + (parts || []).map(encodeURIComponent).join("/") + (q ? "?" + q : "");
    if (hash === location.hash) return;
    history[(o && o.push) ? "pushState" : "replaceState"](null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  route.read = parseRoute;
  function seek(anchor) {
    var el = null;
    try { el = document.querySelector('[data-anchor="' + (window.CSS && CSS.escape ? CSS.escape(anchor) : anchor) + '"]'); } catch (e) {}
    if (!el) return false;
    for (var d = el.parentElement; d; d = d.parentElement) if (d.tagName === "DETAILS") d.open = true;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
    el.classList.remove("is-lit");
    void el.offsetWidth;
    el.classList.add("is-lit");
    setTimeout(function () { el.classList.remove("is-lit"); }, 2600);
    return true;
  }

  /* A form that deletes for good asks first: <form data-confirm="Supprimer ce client ? Cette action est irréversible."
     data-confirm-ok="Supprimer"> asks in ds.confirm (the question up to « ? » as its title, the rest as its text), never in
     the browser's box. Any form sent then shows its button busy (.btn.is-busy) until the page changes, so that a second
     click sends nothing twice; a form the page sends itself (its own submit listener stopped it) is left alone. */
  document.addEventListener("submit", function (e) {
    var form = e.target, message = form.getAttribute && form.getAttribute("data-confirm");
    if (message && form.getAttribute("data-confirmed") !== "true") {
      e.preventDefault();
      var by = e.submitter, parts = /^([\s\S]*?\?)\s+([\s\S]+)$/.exec(message);
      confirm({ title: parts ? parts[1] : message, text: parts ? parts[2] : "", ok: form.getAttribute("data-confirm-ok") || undefined, danger: true })
        .then(function (yes) {
          if (!yes) return;
          form.setAttribute("data-confirmed", "true");
          if (form.requestSubmit) form.requestSubmit(by); else form.submit();
        });
      return;
    }
    if (e.defaultPrevented) return;
    var button = e.submitter || form.querySelector('button[type="submit"], button:not([type])');
    if (button) { button.classList.add("is-busy"); button.disabled = true; }
  });
  // back with the browser's Back, the page comes from its cache: its buttons are no longer busy
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    document.querySelectorAll(".btn.is-busy").forEach(function (b) { b.classList.remove("is-busy"); b.disabled = false; });
    document.querySelectorAll("form[data-confirmed]").forEach(function (f) { f.removeAttribute("data-confirmed"); });
  });

  /* The messages a server leaves for the page after a redirect, as <template data-toast data-type="good" data-text="…"
     data-action-label="Rouvrir" data-action-form="reopen">, shown on arrival in the bubble; the action, if any, sends that
     form of the page. Selecta's way, for any app that answers forms with a redirect. */
  function arrivals() {
    document.querySelectorAll("template[data-toast]").forEach(function (m) {
      var form = m.getAttribute("data-action-form") ? document.getElementById(m.getAttribute("data-action-form")) : null;
      toast({ type: m.getAttribute("data-type") || "good", text: m.getAttribute("data-text") || "",
              action: form ? { label: m.getAttribute("data-action-label"), run: function () { form.requestSubmit ? form.requestSubmit() : form.submit(); } } : undefined });
      m.remove();
    });
  }
  function onReady(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  onReady(function () { fold(); arrivals(); cameBack(); });

  window.ds = window.ds || {};
  window.ds.toast = toast;
  window.ds.confirm = confirm;
  window.ds.drawer = drawer;
  window.ds.status = status;
  window.ds.when = when;
  window.ds.ago = ago;
  window.ds.soon = soon;
  window.ds.date = dateText;
  window.ds.number = number;
  window.ds.money = money;
  window.ds.api = api;
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
  window.ds.h = h;
  window.ds.ico = ico;
  window.ds.compact = compact;
  window.ds.avatar = avatar;
  window.ds.fold = fold;
  window.ds.route = route;
  window.ds.seek = seek;
})();
