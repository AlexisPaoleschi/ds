/* The photo kit's behaviours (the audit of 23 November 2026, Selecta's galleries), in ds-photo.js.
   ds.dropzone(zone, {input, button, onFiles, one}): the .dropzone takes files dropped on it (gold while they are dragged
   over it, .is-over) or chosen with its <input type="file"> (input, opened by button); onFiles(files) with a list of
   File, or the first one only (one). Gives back the zone.
   ds.upload(files, {url, list, field, concurrent, total, retry, done, fail}): each file sent to url (POST, the form's
   field, "file") through ds.api, concurrent at once (3), the others waiting their turn; one row each in list (a
   ul.rows.is-cards: li.upload-row, its name, its bar, what happened, « Réessayer » if it failed, the row going 1.2 s
   after it is done); total: {el, bar, label, words(done, all)} shows the batch's bar and « 3 sur 12 », hidden 2.5 s
   after the last file. done(result, file) after each file sent; fail(error, file) gives back the words shown on its
   row (else « Échec »). Gives back nothing: rows and bars say how it goes. */
(function () {
  "use strict";
  var ds = window.ds, _ = ds._;
  if (ds.upload) return;
  var WORDS = _.table({
    fr: { retry: "Réessayer", failed: "Échec", progress: function (d, n) { return d + " sur " + n; } },
    en: { retry: "Try again", failed: "Failed", progress: function (d, n) { return d + " of " + n; } }
  });

  function dropzone(zone, o) {
    zone = _.find(zone);
    if (!zone) return null;
    o = o || {};
    var input = _.find(o.input), button = _.find(o.button);
    function give(list) {
      var files = [].slice.call(list || []);
      if (!files.length || !o.onFiles) return;
      o.onFiles(o.one ? files[0] : files);
    }
    zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-over"); });
    zone.addEventListener("dragleave", function () { zone.classList.remove("is-over"); });
    zone.addEventListener("drop", function (e) { e.preventDefault(); zone.classList.remove("is-over"); give(e.dataTransfer && e.dataTransfer.files); });
    if (button && input) button.addEventListener("click", function () { input.click(); });
    if (input) input.addEventListener("change", function () { give(input.files); input.value = ""; });
    return zone;
  }

  // the batch: each file sent and how much of it, so that the total bar follows them all
  var running = 0, waiting = [], batch = new Map(), batchTimer = null;
  function upload(files, o) {
    o = o || {};
    var list = _.find(o.list), w = _.words(WORDS), most = o.concurrent || 3, total = o.total || null;
    function fill(bar, pct) {
      bar.setAttribute("aria-valuenow", String(pct));
      var i = bar.querySelector("i");
      if (i) i.style.width = pct + "%";
    }
    function showTotal() {
      if (!total) return;
      var loaded = 0, size = 0, done = 0, settled = 0;
      batch.forEach(function (b) { loaded += b.loaded; size += b.total; if (b.state === "done") done++; if (b.state !== "pending") settled++; });
      var el = _.find(total.el), bar = _.find(total.bar), label = _.find(total.label);
      if (el) el.hidden = false;
      if (bar) fill(bar, size ? Math.round(loaded / size * 100) : 0);
      if (label) label.textContent = (total.words || w.progress)(done, batch.size);
      if (settled === batch.size) {
        clearTimeout(batchTimer);
        batchTimer = setTimeout(function () {
          var still = false;
          batch.forEach(function (b) { if (b.state === "pending") still = true; });
          if (!still) { batch.clear(); if (el) el.hidden = true; }
        }, 2500);
      }
    }
    function next() {
      running--;
      var t = waiting.shift();
      if (t) { running++; t(); }
    }
    function schedule(task) {
      if (running < most) { running++; task(); } else waiting.push(task);
    }
    [].slice.call(files || []).forEach(function (file) {
      var bar = _.el("span", "meter"), status = _.el("span", "upload-row-status"), retry = _.el("button", "btn is-act", o.retry || w.retry);
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");
      bar.setAttribute("aria-label", file.name);
      bar.append(_.el("i"));
      fill(bar, 0);
      retry.type = "button";
      retry.hidden = true;
      var row = _.el("li", "upload-row", [_.el("span", "upload-row-name", file.name), bar, status, retry]);
      if (list) list.appendChild(row);
      function enter() { batch.set(file, { loaded: 0, total: file.size || 1, state: "pending" }); showTotal(); }
      function task() {
        var data = new FormData();
        data.append(o.field || "file", file);
        ds.api("POST", o.url, data, { retry: false, progress: function (loaded, size) {
          fill(bar, Math.round(loaded / size * 100));
          var b = batch.get(file);
          if (b) { b.loaded = loaded; b.total = size; showTotal(); }
        } }).then(function (result) {
          fill(bar, 100);
          status.textContent = "✓";
          var b = batch.get(file);
          if (b) { b.state = "done"; b.loaded = b.total; }
          showTotal();
          if (o.done) o.done(result, file);
          setTimeout(function () { row.remove(); }, 1200);
        }, function (error) {
          var b = batch.get(file);
          if (b) { b.state = "failed"; b.loaded = b.total; }
          showTotal();
          status.textContent = (o.fail && o.fail(error, file)) || w.failed;
          retry.hidden = false;
        }).then(next, next);
      }
      retry.addEventListener("click", function () {
        retry.hidden = true;
        status.textContent = "";
        fill(bar, 0);
        enter();
        schedule(task);
      });
      enter();
      schedule(task);
    });
  }

  ds.dropzone = dropzone;
  ds.upload = upload;
})();
