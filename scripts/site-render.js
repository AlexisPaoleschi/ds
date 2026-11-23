// The site's pages as a browser draws them, for scripts/site-pages.py: the home builds its screens from the site's data,
// an event page its testimonials and its badges. Serves the site's checkout and writes each page's drawn HTML.
// usage: node scripts/site-render.js /path/to/the/site/checkout /path/to/out (Playwright installed)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const [root, out] = process.argv.slice(2);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port, b = await chromium.launch();
  fs.mkdirSync(out, { recursive: true });
  for (const [name, page] of [['site-home', 'index.html'], ['site-event', 'events/lyon-2026/index.html'], ['site-senegal', 'events/senegal-2027/index.html'], ['site-events', 'events/index.html']]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(base + '/' + page); await p.waitForLoadState('networkidle'); await p.waitForTimeout(2500);
    fs.writeFileSync(path.join(out, name + '.html'), '<!DOCTYPE html>\n' + await p.evaluate(() => document.documentElement.outerHTML));
    await p.close();
  }
  await b.close(); server.close();
})();
