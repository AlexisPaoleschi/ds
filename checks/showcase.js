// The showcase itself (index.html), both themes, on a computer and on a phone: what the study of 2.24.0 found stays fixed.
// Every word reads on what is under it (4.5:1, 3:1 from 24px; the site's gold and its quiet grey are kept by choice), none is under 11px, a field and a button side by side are
// as high as each other, the site's bar keeps its name clear of its action, and no button of a sheet or a window is cut.
// On a 375px phone neither index.html nor site.html scrolls sideways, and no button, field or menu is cut (3.1.0).
// The tools the showcase shows work there (3.1.0): the drawer, the sources' state, the syncs and their journal, the
// address after # and a card found again, the live feed, the steady period head, the formats, the avatars, a pill.
// usage: node checks/showcase.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2' };
// the live feed's stream, and a sync's journal, as an app's server would send them
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/demos/stream')) {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    res.write('event: tick\ndata: {"text": "Bonjour"}\n\n');
    const keep = setInterval(() => res.write(': ping\n\n'), 1000);
    req.on('close', () => clearInterval(keep));
    return;
  }
  if (req.url.startsWith('/api/jobs/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ lines: [{ t: 1794200000, level: 'INFO', text: 'Lecture de BoursoBank' }], last: 1 }));
  }
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
    // the site's quiet grey (60% of ink) keeps it too, though it reads 4.3 to 4.5:1 on the beige: a choice, left out
    const quiet = col.dataset.theme === 'vitrine' ? px(getComputedStyle(col).getPropertyValue('--faint').trim()) : null,
      inQuiet = fg => quiet && [0, 1, 2].every(i => Math.abs(fg[i] - quiet[i]) <= 2) && Math.abs(fg[3] - quiet[3]) <= .02;
    for (const el of col.querySelectorAll('*')) {
      const c = getComputedStyle(el); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (own && !el.closest('[aria-hidden=true], .hero, .chart-heat')) {
        const size = parseFloat(c.fontSize);
        if (size < 11) R.small.push([own.slice(0, 24), size]);
        const bg = ground(el), fg = px(c.color);
        if (bg && fg[3] > 0 && !onGold(bg) && !inGold(bg) && !inGold(fg) && !inQuiet(fg)) { const a = lum(over(fg, bg)), b = lum(bg), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
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

// runs in the page: the page's width, what sticks out of it (outside a box that scrolls), and a control cut short (a
// chart's bars and a calendar's day cells keep their figures inside on purpose: shown on hover, or in the day's panel)
function wide() {
  const W = document.documentElement.clientWidth, out = [], cut = [];
  const scrolls = e => { for (let s = e.parentElement; s && s !== document.body; s = s.parentElement) { if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(s).overflowX)) return true; } return false; };
  for (const el of document.querySelectorAll('body *')) {
    const c = getComputedStyle(el); if (c.display === 'none' || c.visibility === 'hidden' || c.position === 'fixed') continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if ((r.right > W + 1 || r.left < -1) && !scrolls(el) && !el.closest('[aria-hidden=true], .visually-hidden')) out.push((el.className || el.tagName).toString().slice(0, 40));
    if (el.matches('.btn, button, input:not([type=checkbox]):not([type=radio]):not([type=range]), select, .pill') && el.scrollWidth > el.clientWidth + 1 && c.textOverflow !== 'ellipsis' && !el.closest('.chart-heat-scroll, .chart-bars, .cal-cell'))
      cut.push((el.textContent || el.value || el.className).trim().slice(0, 30));
  }
  return { scroll: document.documentElement.scrollWidth, out: out.slice(0, 6), cut: cut.slice(0, 6) };
}

// the tools the showcase shows, used as a person would, in the Atelier column
async function tools(b, base) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(base + '/index.html'); await p.waitForLoadState('networkidle'); await p.waitForTimeout(600);
  const col = '.theme[data-theme="atelier"] ';
  // the drawer: open the first time on a computer; its cross and its tab close and open it, the device remembers
  const dr = [await p.evaluate(() => document.querySelector('[data-drawer="demo-side-atelier"]').classList.contains('is-open'))];
  await p.click(col + '[data-drawer-close]');
  dr.push(await p.evaluate(() => [document.querySelector('[data-drawer="demo-side-atelier"]').classList.contains('is-open'), document.querySelector('[data-drawer-toggle="demo-side-atelier"]').getAttribute('aria-expanded'), localStorage.getItem('demo-side-atelier')].join()));
  await p.click(col + '[data-drawer-toggle]');
  dr.push(await p.evaluate(() => document.querySelector('[data-drawer="demo-side-atelier"]').classList.contains('is-open')));
  assert(JSON.stringify(dr) === '[true,"false,false,0",true]', 'page vitrine, ds.drawer : ouvert d’abord, sa croix le ferme, son onglet le rouvre, l’appareil s’en souvient ' + JSON.stringify(dr));
  // the sources' state: a line, then a row per source once opened, the late one marked
  await p.click(col + '[data-tools="status"] summary');
  const st = await p.evaluate(c => { const d = document.querySelector(c + '[data-tools="status"] details.status'); return [d.open, d.querySelector('summary').textContent, d.querySelectorAll('li .status-name').length, d.querySelectorAll('li.is-late').length]; }, col);
  assert(JSON.stringify(st) === '[true,"2 sources à jour sur 3",3,1]', 'page vitrine, ds.status : une ligne qui dit tout, une ligne par source une fois ouverte ' + JSON.stringify(st));
  // the syncs: three, their state in words; « Journal » reads the job's lines from the server
  await p.click(col + '[data-tools="jobs"] [data-job="journal"]');
  await p.waitForSelector(col + '[data-tools="jobs"] .log-line', { timeout: 5000 }).catch(() => {});
  const jb = await p.evaluate(c => [document.querySelectorAll(c + '[data-tools="jobs"] .job').length, [...document.querySelectorAll(c + '[data-tools="jobs"] .job > .name .sync-dot')].map(d => d.getAttribute('aria-label')).join('|'),
    (document.querySelector(c + '[data-tools="jobs"] .log-line') || {}).textContent || ''], col);
  assert(jb[0] === 3 && jb[1] === 'dernier passage réussi|dernier passage en erreur|pas encore passé' && /Lecture de BoursoBank/.test(jb[2]), 'page vitrine, ds.jobs : trois synchros, leur état en mots, le journal lu au serveur ' + JSON.stringify(jb));
  // the address: written without the page jumping, read back, then emptied; a card found again and lit
  await p.click(col + 'a[href^="#analyse"]'); await p.waitForTimeout(100);
  const ro = await p.evaluate(c => [location.hash, document.querySelector(c + '[data-tools="route"]').textContent], col);
  await p.click(col + '[data-tools-go=""]'); await p.waitForTimeout(100);
  const ro2 = await p.evaluate(c => document.querySelector(c + '[data-tools="route"]').textContent, col);
  await p.click(col + '[data-tools-seek]'); await p.waitForTimeout(1200);
  const sk = await p.evaluate(c => { const a = document.querySelector('[data-anchor="agenda-atelier"]'), r = a.getBoundingClientRect(); return [r.top >= -2 && r.top < innerHeight / 2, a.classList.contains('is-lit')]; }, col);
  assert(ro[0] === '#analyse/patreon-alexis?compte=hb' && ro[1] === 'analyse / patreon-alexis · {"compte":"hb"}' && ro2 === '—' && sk.join() === 'true,true',
    'page vitrine, ds.route et ds.seek : un lien lu par ds.route, l’adresse vidée par ds.route.go ; l’agenda retrouvé et allumé ' + JSON.stringify([ro, ro2, sk]));
  // the live feed: linked, an event received, then stopped
  await p.click(col + '[data-tools="stream"]');
  await p.waitForFunction(c => /Reçu : Bonjour/.test(document.querySelector(c + '[data-tools="streamed"]').textContent), col, { timeout: 5000 }).catch(() => {});
  await p.click(col + '[data-tools="stream"]');
  const sm = await p.evaluate(c => [...document.querySelectorAll(c + '[data-tools="streamed"] .row-place')].map(x => x.textContent).reverse(), col);
  assert(sm[0] === 'En attente du serveur…' && sm.includes('Relié au serveur.') && sm.includes('Reçu : Bonjour') && sm[sm.length - 1] === 'Arrêté.', 'page vitrine, ds.stream : relié, un événement reçu, puis arrêté ' + JSON.stringify(sm));
  // the steady period head: its arrows keep their room when they lead nowhere, the titles stay at the same height
  const steady = async () => p.evaluate(c => [...document.querySelectorAll(c + '[data-tools="steady"]')].map(h => { const t = h.querySelector('.periodtitle').getBoundingClientRect(), r = h.getBoundingClientRect(); return [Math.round(r.height), Math.round(t.top - r.top)]; }), col);
  const sd1 = await steady();
  await p.setViewportSize({ width: 375, height: 812 }); await p.waitForTimeout(300);
  const sd2 = await steady();
  await p.setViewportSize({ width: 1440, height: 900 });
  assert(JSON.stringify(sd1[0]) === JSON.stringify(sd1[1]) && JSON.stringify(sd2[0]) === JSON.stringify(sd2[1]), 'page vitrine, .periodhead.is-steady : avec ou sans flèches, la même tête, sur ordinateur et téléphone ' + JSON.stringify([sd1, sd2]));
  // the formats, and the avatars with their initial
  const fm = await p.evaluate(c => [...document.querySelectorAll(c + '[data-tools="formats"] .row-value')].map(x => x.textContent), col);
  const av = await p.evaluate(c => [...document.querySelectorAll(c + '[data-tools="avatars"] .avatar')].map(x => x.textContent).join(''), col);
  assert(fm.length === 11 && fm[0] === '9 novembre 2026' && fm[1] === '9 nov.' && fm[2] === '9h05' && /^aujourd’hui à|^aujourd'hui à|^hier à/.test(fm[3]) && /^il y a /.test(fm[4])
    && fm[6] === '1\u00a0235' && fm[7] === '−12,30€' && fm[8] === '12,3\u00a0%' && fm[9] === '1,2M' && /^\d{4}-\d{2}-\d{2}$/.test(fm[10]) && av === 'BRFH',
    'page vitrine, les formats (dates, heures, chiffres) et les avatars ' + JSON.stringify([fm, av]));
  // a pill says its menu's choice and lights while it holds one (ds.pills)
  await p.selectOption(col + '[data-b="ops"] .pill.is-filter select', 'bourso');
  const pl = await p.evaluate(c => { const l = document.querySelector(c + '[data-b="ops"] .pill.is-filter'); return [l.querySelector('.pill-value').textContent, l.classList.contains('is-on')]; }, col);
  assert(pl.join() === 'BoursoBank,true', 'page vitrine, ds.pills : la pilule dit le choix de son menu et s’allume ' + JSON.stringify(pl));
  assert(!errors.length, 'page vitrine : aucune erreur ' + JSON.stringify(errors));
  await p.close();
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
    if (name === 'téléphone') {
      for (const page of ['/index.html', '/site.html']) {
        if (page !== '/index.html') { await p.goto(base + page); await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800); }
        const w = await p.evaluate(wide);
        assert(w.scroll <= 375 && !w.out.length && !w.cut.length, `téléphone de 375px, ${page} : rien ne dépasse, aucun bouton, champ ou menu coupé ` + JSON.stringify(w));
      }
    }
    await p.close();
  }
  await tools(b, base);
  await b.close(); server.close();
})();
