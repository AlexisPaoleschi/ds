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
