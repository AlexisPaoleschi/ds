/* Signed images that lapse (the audit of 23 November 2026, Selecta's image-refresh.js), in ds.js.
   ds.images.renew({url, attr, attempts, delay}): an image whose signed address has expired (an <img> carrying its key in
   attr, data-signed-image unless given) asks the page's server (url: GET, {urls: {key: address}}) for fresh addresses,
   for every image that failed in the same moment (delay, 150 ms) at once, and puts them in place without reloading the
   page (an upload or an open viewer stays as it is). Two tries per image (attempts): past that its file is gone, not
   its address. Without url (the page's <body data-image-urls>), nothing is asked. Called once; gives back nothing. */
(function () {
  "use strict";
  var ds = window.ds;
  var wired = false;
  function renew(o) {
    if (wired) return;
    wired = true;
    o = o || {};
    var attr = o.attr || "data-signed-image", most = o.attempts || 2, delay = o.delay == null ? 150 : o.delay;
    var tries = new Map(), pending = new Set(), busy = false, timer = null, givenUp = false;
    function url() { return o.url || (document.body && document.body.getAttribute("data-image-urls")); }
    function soon() {
      if (timer || busy) return;
      timer = setTimeout(function () { timer = null; ask(); }, delay);
    }
    function ask() {
      var keys = new Set(pending), to = url();
      pending.clear();
      if (givenUp || !keys.size) return;
      if (!to) { givenUp = true; return; }
      busy = true;
      ds.api("GET", to).then(function (body) {
        var urls = (body && body.urls) || {};
        [].forEach.call(document.querySelectorAll("[" + attr + "]"), function (im) {
          var k = im.getAttribute(attr);
          if (keys.has(k) && urls[k]) im.src = urls[k];
        });
      }, function () { givenUp = true; }).then(function () {
        busy = false;
        if (pending.size) soon();
      });
    }
    // an image's error does not bubble, but it reaches its ancestors on the way down
    document.addEventListener("error", function (e) {
      var im = e.target;
      if (givenUp || !(im instanceof HTMLImageElement)) return;
      var k = im.getAttribute(attr);
      if (!k) return;
      var n = (tries.get(k) || 0) + 1;
      tries.set(k, n);
      if (n > most) return;
      pending.add(k);
      soon();
    }, true);
  }
  ds.images = { renew: renew };
})();
