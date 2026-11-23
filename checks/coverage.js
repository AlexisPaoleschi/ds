// The showcase shows everything ds has (« la page onrender doit représenter tout ce qui existe », 23 November 2026): every
// class of its stylesheets and every function of its scripts is seen on one of the showcase's pages, drawn or called,
// once what opens is opened. EXCEPT says what is left out, and why.
// usage: node checks/coverage.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
const assert = (ok, what, got) => { if (!ok) { console.log('ÉCHEC', what, JSON.stringify(got)); process.exitCode = 1; } else console.log('ok  ', what); };
// what no page shows, and why
const EXCEPT = {
  'newsletter-honeypot': 'a hidden field that only robots fill', 'signup-banner-honeypot': 'a hidden field that only robots fill',
  'ct-fit-1': 'only when a card title does not fit its card (ds.fitTitles)', 'ct-fit-2': 'idem', 'ct-fit-3': 'idem',
  'landscape-warning': 'only on a phone held sideways, and the site has it off', 'landscape-warning-icon': 'idem', 'landscape-warning-text': 'idem',
  'social-banner-inner--no-border': 'a variant the site no longer uses',
  'api': 'asks the app’s server', 'json': 'reads a file from the server (the site’s Gist)', 'newsletter': 'posts to the newsletter’s server',
  'ready': 'the site’s first drawing, done before the copy was taken', 'screens': 'idem', 'photo': 'idem',
  'icon': 'the site kit draws its icons with it from inside (its own calls are not counted)'
};
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port, seen = new Set(), calls = new Set(), b = await chromium.launch();
  const pages = ['index.html', 'settings.html', 'site.html', 'site-home.html', 'site-event.html', 'site-senegal.html', 'site-events.html', 'site-newsletter.html', 'site-doc.html',
    'gallery.html', 'gallery-login.html', 'gallery-dashboard.html', 'gallery-list.html', 'gallery-detail.html', 'gallery-notices.html', 'gallery-settings.html', 'gallery-client.html'];
  for (const page of pages) for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.addInitScript(() => {
      window.__calls = new Set();
      // every function of ds counts its calls, wrapped once the bundles are in
      document.addEventListener('DOMContentLoaded', () => {
        for (const k of Object.keys(window.ds || {})) {
          const f = window.ds[k];
          if (typeof f !== 'function' || k === '_') continue;
          const g = function () { window.__calls.add(k); return f.apply(this, arguments); };
          Object.assign(g, f); window.ds[k] = g;
        }
      }, true);
    });
    await p.goto(base + '/' + page); await p.waitForLoadState('networkidle'); await p.waitForTimeout(700);
    // what opens: a fold, a tool, a sheet, the loading screen, a sync's journal, a photo in the viewer, a week view
    for (const sel of ['summary', '[data-tools]', '[data-studio="listopen"]', '[data-rest="boot"]', '.job button', '[data-viewer] > *', '[data-view]', '.chart-donut-row', '[data-bank]', '[data-job="journal"]', '[data-rest="confirm"]', '[data-rest="pick"]']) {
      const n = await p.locator(sel).count();
      for (let i = 0; i < Math.min(n, 10); i++) {
        try { await p.locator(sel).nth(i).click({ timeout: 400 }); await p.waitForTimeout(120); } catch (e) {}
        (await p.evaluate(() => [...document.querySelectorAll('*')].flatMap(e => [...e.classList]))).forEach(c => seen.add(c));
        await p.keyboard.press('Escape').catch(() => {});
      }
    }
    (await p.evaluate(() => [...document.querySelectorAll('*')].flatMap(e => [...e.classList]))).forEach(c => seen.add(c));
    (await p.evaluate(() => [...(window.__calls || [])])).forEach(c => calls.add(c));
    await p.close();
  }
  const css = fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.css') && f !== 'tokens.css' && f !== 'fonts.css');
  const classes = new Set();
  for (const f of css) for (const m of fs.readFileSync(path.join(root, 'src', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '').matchAll(/\.([a-z][a-z0-9-]*)/g)) if (!/^(is|has)-/.test(m[1])) classes.add(m[1]);
  const missing = [...classes].filter(c => !seen.has(c) && !EXCEPT[c]).sort();
  assert(!missing.length, 'la vitrine montre chaque classe de ds', missing);
  const shown = pages.map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('') + fs.readdirSync(path.join(root, 'demos')).map(f => fs.readFileSync(path.join(root, 'demos', f), 'utf8')).join('');
  const api = new Set();
  for (const f of fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js'))) for (const m of fs.readFileSync(path.join(root, 'src', f), 'utf8').matchAll(/\b(?:window\.)?ds\.([a-zA-Z]+)\s*=(?!=)/g)) api.add(m[1]);
  const never = [...api].filter(a => a !== '_' && !calls.has(a) && !new RegExp('ds\\.' + a + '\\b|data-' + a + '\\b').test(shown) && !EXCEPT[a]).sort();
  assert(!never.length, 'la vitrine se sert de chaque fonction de ds', never);
  await b.close(); server.close();
})();
