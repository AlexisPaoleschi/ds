// The showcase itself (index.html), both themes, on a computer and on a phone: what the study of 2.24.0 found stays fixed.
// Every word reads on what is under it (4.5:1, 3:1 from 24px), none is under 11px, a field and a button side by side are
// as high as each other, the site's bar keeps its name clear of its action, and no button of a sheet or a window is cut.
// usage: node checks/showcase.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };

// runs in the page: what each theme's column shows
function look() {
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  // a colour as the screen draws it, whatever the way it is written (a mix in oklab included)
  const px = c => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = 'rgba(0,0,0,0)'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const over = (top, under) => [0, 1, 2].map(i => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);
  // the ground under a word: its layers down to the first opaque one; none when a photo or a gradient is under it
  const ground = el => { const layers = []; for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e);
      if (c.backgroundImage !== 'none') return null; const bg = px(c.backgroundColor); if (bg[3] > 0) { layers.push(bg); if (bg[3] === 1) break; } }
    return layers.reverse().reduce((acc, l) => acc ? over(l, acc) : l, null); };
  const out = {};
  for (const col of document.querySelectorAll('.theme')) {
    const R = out[col.dataset.theme] = { faint: [], small: [], controls: [], cut: [] };
    // a word in the site's gold, or on it in white, keeps it: a choice made knowing it reads less on white (2.2:1), left out
    const gold = px(getComputedStyle(col).getPropertyValue('--accent').trim()), onGold = bg => bg && [0, 1, 2].every(i => Math.abs(bg[i] - gold[i]) <= 2);
    const golds = ['--accent', '--accent-strong'].map(t => px(getComputedStyle(col).getPropertyValue(t).trim())), inGold = fg => golds.some(g => [0, 1, 2].every(i => Math.abs(fg[i] - g[i]) <= 2));
    for (const el of col.querySelectorAll('*')) {
      const c = getComputedStyle(el); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (own && !el.closest('[aria-hidden=true], .hero, .chart-heat')) {
        const size = parseFloat(c.fontSize);
        if (size < 11) R.small.push([own.slice(0, 24), size]);
        const bg = ground(el), fg = px(c.color);
        if (bg && fg[3] > 0 && !onGold(bg) && !inGold(bg) && !inGold(fg)) { const a = lum(over(fg, bg)), b = lum(bg), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          const large = size >= 24 || (size >= 18.66 && +c.fontWeight >= 700);
          if (ratio < (large ? 3 : 4.5)) R.faint.push([own.slice(0, 24), Math.round(ratio * 100) / 100]); }
      }
      // a field or a menu of the page and the usual buttons: one height (the small bars, a calendar's head, keep their small ones)
      if (el.matches('.btn:not(.is-small):not(.is-large):not(.is-icon), input:not([type=checkbox]):not([type=radio]):not([type=range]), select')
        && !el.closest('.pill, .selbar, .topbar, .hero-acts, .datepick, .picker, .side, header.top, .cal-head')) R.controls.push(Math.round(r.height));
      if (el.matches('.sheet-acts .btn, .dialog-b .btn') && el.scrollWidth > el.clientWidth + 1) R.cut.push(own);
    }
    const bar = col.querySelector('.topbar.is-site'), brand = bar.querySelector('.topbar-brand').getBoundingClientRect(), act = bar.querySelector('.btn').getBoundingClientRect();
    const links = [...bar.querySelectorAll('.topbar-link')].filter(a => a.getBoundingClientRect().width).map(a => a.getBoundingClientRect());
    R.bar = [brand, ...links, act].every((a, i, all) => all.slice(i + 1).every(b => a.right <= b.left + 1 || b.right <= a.left + 1));
  }
  return out;
}

(async () => {
  await new Promise(ok => server.listen(0, ok));
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await chromium.launch();
  for (const [name, opts] of [['ordinateur', { viewport: { width: 1440, height: 900 } }], ['téléphone', { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true }]]) {
    const p = await b.newPage(opts);
    await p.goto(base + '/index.html'); await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const all = await p.evaluate(look);
    for (const [theme, R] of Object.entries(all)) {
      const heights = [...new Set(R.controls)];
      assert(!R.faint.length, `${name}, ${theme} : chaque mot se lit sur ce qui est dessous ` + JSON.stringify(R.faint.slice(0, 6)));
      assert(!R.small.length, `${name}, ${theme} : aucun texte sous 11px ` + JSON.stringify(R.small.slice(0, 6)));
      assert(heights.length === 1 && heights[0] === (theme === 'vitrine' ? 45 : 34), `${name}, ${theme} : champs, menus et boutons à la même hauteur ` + JSON.stringify(heights));
      assert(R.bar, `${name}, ${theme} : la barre du site garde son nom, ses liens et son bouton à part`);
      assert(!R.cut.length, `${name}, ${theme} : aucun bouton de fiche ou de fenêtre coupé ` + JSON.stringify(R.cut));
    }
    await p.close();
  }
  await b.close(); server.close();
})();
