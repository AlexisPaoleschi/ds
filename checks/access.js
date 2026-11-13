// With the keyboard alone, and as a screen reader hears it (study points 52 and 54): every window and menu of ds is
// reached, used and left with Tab, Shift+Tab, Enter, Space, Escape and the arrows, the focus going back where it was:
// ds.confirm, the sheet, the viewer, the phone's drawer, the date picker, the period picker, the search picker, a
// bubble's action, the site's phone menu and its galleries. The calendar's views follow the arrows like the date
// picker's; each chart says its figures in a sentence; a sync's dot says its state in words.
// usage: node checks/access.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const photo = n => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="hsl(${n * 47 % 360} 45% 42%)"/></svg>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const m = url.pathname.match(/^\/photo\/(\d+)\.svg$/);
  if (m) { res.writeHead(200, { 'Content-Type': 'image/svg+xml' }); return res.end(photo(+m[1])); }
  const file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };
// where the focus is: the element's id, or its class, and whether it sits inside a selector
const at = (p, inside) => p.evaluate(sel => { const a = document.activeElement; return { id: a.id || a.className || a.tagName, inside: sel ? !!a.closest(sel) : null }; }, inside || null);
// n presses of a key, the focus staying inside sel each time
async function stays(p, key, n, sel) {
  for (let i = 0; i < n; i++) { await p.keyboard.press(key); if (!(await at(p, sel)).inside) return false; }
  return true;
}

(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(base + '/checks/access.html'); await p.waitForFunction(() => window.ready); await p.evaluate(() => document.fonts.ready);
  const log = () => p.evaluate(() => window.log.slice());

  // ds.confirm: Enter opens it on « Annuler » (a deletion), Tab and Shift+Tab stay in it, Escape answers no, the focus
  // goes back to the button; Tab to « Supprimer » and Enter answers yes
  await p.focus('#ask'); await p.keyboard.press('Enter'); await p.waitForSelector('.dialog');
  const c1 = await at(p, '.dialog');
  const c2 = await stays(p, 'Tab', 3, '.dialog') && await stays(p, 'Shift+Tab', 3, '.dialog');
  await p.keyboard.press('Escape'); await p.waitForSelector('.dialog', { state: 'detached' });
  const c3 = await at(p);
  await p.keyboard.press('Space'); await p.waitForSelector('.dialog');
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.waitForSelector('.dialog', { state: 'detached' });
  assert(c1.inside && /dialog-no/.test(c1.id) && c2 && c3.id === 'ask' && JSON.stringify(await log()) === '["confirm:false","confirm:true"]',
    'ds.confirm : Entrée l’ouvre sur « Annuler », Tab et Maj+Tab y restent, Échap dit non et rend le focus, Espace l’ouvre, Tab puis Entrée dit oui ' + JSON.stringify([c1, c3, await log()]));

  // the sheet: Enter opens it, the focus goes in, Tab and Shift+Tab stay in it, Escape closes it and gives the focus back
  await p.evaluate(() => { window.log.length = 0; });
  await p.focus('#opensheet'); await p.keyboard.press('Enter'); await p.waitForFunction(() => !document.getElementById('sheet').hidden);
  const s1 = await at(p, '.sheet-panel');
  const s2 = await stays(p, 'Tab', 5, '.sheet-panel') && await stays(p, 'Shift+Tab', 5, '.sheet-panel');
  await p.keyboard.press('Escape'); await p.waitForFunction(() => !window.sheet.isOpen);
  const s3 = await at(p);
  assert(s1.inside && s2 && s3.id === 'opensheet', 'la fiche : Entrée l’ouvre, Tab et Maj+Tab y restent, Échap la ferme et rend le focus ' + JSON.stringify([s1, s3]));

  // the viewer: Enter opens it, → and ← turn the photos, Tab stays in it, Escape closes it and gives the focus back
  await p.evaluate(() => { window.log.length = 0; });
  await p.focus('#openviewer'); await p.keyboard.press('Enter'); await p.waitForFunction(() => document.querySelector('.viewer.is-open'));
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowLeft');
  const v1 = await at(p, '.viewer');
  const v2 = await stays(p, 'Tab', 4, '.viewer') && await stays(p, 'Shift+Tab', 4, '.viewer');
  await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('.viewer.is-open'));
  const v3 = await at(p), vl = await log();
  assert(v1.inside && v2 && v3.id === 'openviewer' && vl.includes('viewer:2') && vl[vl.length - 2] === 'viewer:1' && vl.includes('viewer:closed'),
    'la visionneuse : Entrée l’ouvre, → et ← tournent les photos, Tab y reste, Échap la ferme et rend le focus ' + JSON.stringify([v1, v3, vl]));

  // the date picker: Enter on its title opens it, the focus goes in, ← → change its tab, Escape closes it and gives the
  // focus back to the title
  await p.focus('#dptitle'); await p.keyboard.press('Enter'); await p.waitForFunction(() => !document.getElementById('dp').hidden);
  const d1 = await at(p, '#dp');
  const tab0 = await p.evaluate(() => document.querySelector('#dp [role=tab][aria-selected=true]').textContent);
  await p.focus('#dp [role=tab][aria-selected=true]'); await p.keyboard.press('ArrowRight');
  const tab1 = await p.evaluate(() => ({ on: document.querySelector('#dp [role=tab][aria-selected=true]').textContent, focus: document.activeElement.getAttribute('aria-selected') }));
  await p.keyboard.press('Escape'); await p.waitForFunction(() => document.getElementById('dp').hidden);
  const d2 = await at(p);
  assert(d1.inside && tab1.on !== tab0 && tab1.focus === 'true' && d2.id === 'dptitle', 'le choix de dates : Entrée l’ouvre, ← → changent d’onglet, Échap le ferme et rend le focus au titre ' + JSON.stringify([d1, tab0, tab1, d2]));

  // the period picker: Tab reaches its buttons, Enter and Space take one
  await p.evaluate(() => { window.log.length = 0; });
  await p.focus('#period button'); await p.keyboard.press('Tab');
  const per1 = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press('Enter'); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Space');
  const per2 = await p.evaluate(() => [...document.querySelectorAll('#period .tabs button')].map(x => x.getAttribute('aria-pressed')).join());
  assert(per1 === '90 jours' && JSON.stringify(await log()) === '["period:90","period:30"]' && per2 === 'true,false,false',
    'le choix de période : Tab passe d’un bouton à l’autre, Entrée et Espace en prennent un ' + JSON.stringify([per1, await log(), per2]));

  // the search picker: Enter on its button opens it, the focus in its search; ↓ lights a choice, Enter takes it;
  // Escape empties the search, then closes it and gives the focus back to the button
  await p.evaluate(() => { window.log.length = 0; });
  await p.focus('#add'); await p.keyboard.press('Enter');
  const k1 = await at(p, '#banks');
  await p.keyboard.type('credit'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter');
  await p.keyboard.type('zz'); await p.keyboard.press('Escape');
  const k2 = await p.evaluate(() => ({ q: document.querySelector('#banks .picker-q').value, open: !document.getElementById('banks').hidden }));
  await p.keyboard.press('Escape');
  const k3 = await p.evaluate(() => ({ open: !document.getElementById('banks').hidden, focus: document.activeElement.id }));
  assert(k1.inside && JSON.stringify(await log()) === '["bank:Crédit Mutuel"]' && k2.q === '' && k2.open && !k3.open && k3.focus === 'add',
    'le sélecteur : Entrée l’ouvre dans sa recherche, ↓ allume, Entrée prend, Échap vide puis ferme et rend le focus ' + JSON.stringify([k1, await log(), k2, k3]));

  // a bubble's action: Tab reaches it from the page's last button, the bubble waits while it has the focus, Enter runs it
  await p.evaluate(() => { window.log.length = 0; });
  await p.click('#say'); await p.waitForSelector('.toast .act');
  await p.focus('#last');
  let t1 = null;
  for (let i = 0; i < 8 && !t1; i++) { await p.keyboard.press('Tab'); if (await p.evaluate(() => document.activeElement.classList.contains('act'))) t1 = true; }
  await p.waitForTimeout(400);
  await p.keyboard.press('Enter');
  assert(t1 && JSON.stringify(await log()) === '["toast:undo"]', 'la bulle : Tab atteint son action, Entrée la lance ' + JSON.stringify([t1, await log()]));

  // the calendar's views follow the arrows like the date picker's: one stop of Tab, ← → Home End move and show
  await p.focus('#cal .cal-nav [role=tab][aria-selected=true]');
  const views = [];
  for (const key of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'Home', 'End']) {
    await p.keyboard.press(key);
    views.push(await p.evaluate(() => [document.activeElement.dataset.view, window.cal.state().view, [...document.querySelectorAll('#cal [role=tab]')].map(x => x.tabIndex).join('')].join(':')));
  }
  assert(JSON.stringify(views) === JSON.stringify(['week:week:-10-1', 'list:list:-1-10', 'month:month:0-1-1', 'list:list:-1-10', 'month:month:0-1-1', 'list:list:-1-10']),
    'l’agenda : ses vues suivent les flèches (← → Début Fin), un seul arrêt de Tab ' + JSON.stringify(views));

  // what a screen reader hears: each chart in a sentence of its figures, a sync's state in words
  const said = await p.evaluate(() => Object.fromEntries(['bars', 'pairs', 'heat', 'line', 'spark', 'donut'].map(id => {
    const e = document.querySelector('#' + id + ' > *'); return [id, [e.getAttribute('role'), e.getAttribute('aria-label'), e.getAttribute('aria-hidden')]];
  })));
  const jobs = await p.evaluate(() => [...document.querySelectorAll('#jobs .sync-dot')].map(d => [d.getAttribute('role'), d.getAttribute('aria-label'), d.getAttribute('aria-hidden')].join('|')));
  console.log('     ', JSON.stringify(said));
  assert(said.bars[0] === 'img' && said.bars[1] === '3 barres, de août 2026 à oct 2026 : la plus haute 2,4k€ (oct 2026), la plus basse 300€ (sept 2026), moyenne 1,3k€.'
    && said.pairs[0] === 'img' && said.pairs[1] === '2 périodes, de sept 2026 à oct 2026 : Entrées 6\u00a0200€, Sorties 4\u00a0600€.'
    && said.heat[0] === 'img' && /^Du .+ au 12 novembre 2026 : 3 jours avec au moins 1, dont 2 avec 2 et plus ; le plus chargé, le 5 novembre 2026 \(3\)\.$/.test(said.heat[1])
    && said.line[0] === 'img' && /^Courbe du 1er oct\. au 30 oct\. : de 1 200 à 1 258, au plus haut 1 500, au plus bas 1 200\.$/.test(said.line[1])
    && said.spark[0] === 'img' && said.spark[2] === null && said.spark[1] === '4 valeurs, de 120 vues à 1 400 vues, la dernière 600 vues.'
    && said.donut[0] === 'group' && said.donut[1] === 'Total 1 262,30€ en 2 parts : Logement 67 % (850,00€), Courses 33 % (412,30€).',
    'chaque graphique se dit en une phrase de ses chiffres : barres, paires, chaleur, courbe, petites barres, donut');
  assert(JSON.stringify(jobs) === JSON.stringify(['img|dernier passage réussi|', 'img|dernier passage en erreur|', 'img|en cours|', 'img|pas encore passé|']),
    'une synchro dit son état en mots, pas seulement par la couleur de sa pastille ' + JSON.stringify(jobs));
  const own = await p.evaluate(() => ds.chart.bars(null, [{ key: 'a', value: 1 }, { key: 'b', value: 2 }], { summary: t => 'Revenus. ' + t }).getAttribute('aria-label'));
  assert(/^Revenus\. 2 barres/.test(own), 'summary : la page dit le graphique avec ses mots ' + JSON.stringify(own));

  // on a phone: the drawer, opened with Enter or Space on its tab, covers the page; Tab stays in it, Escape closes it
  // and gives the focus back to the tab
  await p.setViewportSize({ width: 375, height: 812 });
  await p.focus('#edgetab'); await p.keyboard.press('Enter'); await p.waitForFunction(() => window.side.open);
  const r1 = await at(p, '.side');
  const r2 = await stays(p, 'Tab', 4, '.side') && await stays(p, 'Shift+Tab', 4, '.side');
  await p.keyboard.press('Escape'); await p.waitForFunction(() => !window.side.open);
  const r3 = await at(p);
  await p.keyboard.press('Space'); await p.waitForFunction(() => window.side.open);
  await p.keyboard.press('Escape'); await p.waitForFunction(() => !window.side.open);
  assert(r1.inside && r2 && r3.id === 'edgetab', 'le tiroir sur téléphone : Entrée ou Espace l’ouvre, Tab et Maj+Tab y restent, Échap le ferme et rend le focus ' + JSON.stringify([r1, r3]));
  assert(!errors.length, 'aucune erreur dans la page ' + JSON.stringify(errors));

  // the site's phone menu and galleries
  const s = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await s.goto(base + '/checks/site.html'); await s.waitForLoadState('networkidle'); await s.waitForTimeout(300);
  // the bar, and its menu's button, show once the hero is passed
  await s.evaluate(() => scrollTo(0, document.querySelector('.hero').offsetHeight + 200)); await s.waitForTimeout(300);
  await s.focus('.mobile-menu-toggle'); await s.keyboard.press('Enter');
  await s.waitForFunction(() => document.querySelector('.mobile-menu').classList.contains('is-open'));
  const m1 = await at(s, '.mobile-menu');
  await s.keyboard.press('Tab'); const m2 = await at(s, '.mobile-menu');
  await s.keyboard.press('Shift+Tab'); const m3 = await at(s, '.mobile-menu');
  await s.keyboard.press('Escape');
  const m4 = await s.evaluate(() => ({ open: document.querySelector('.mobile-menu').classList.contains('is-open'), back: document.activeElement.classList.contains('mobile-menu-toggle') }));
  // closed, it waits 600ms before opening again (a tap that closed it does not reopen it through the button underneath)
  await s.waitForTimeout(700); await s.keyboard.press('Space'); await s.waitForTimeout(300);
  const m5 = await s.evaluate(() => document.querySelector('.mobile-menu').classList.contains('is-open'));
  await s.keyboard.press('Escape');
  assert(m1.inside && m2.inside && m3.inside && !m4.open && m4.back && m5, 'le menu du site : Entrée ou Espace l’ouvre, le focus dedans, Tab et Maj+Tab le parcourent, Échap le ferme et rend le focus ' + JSON.stringify([m1, m2, m3, m4, m5]));
  const g = s.locator('.gallery-grid .gallery-item[role=button]').first();
  await g.focus(); await s.keyboard.press('Enter');
  await s.waitForFunction(() => document.querySelector('.viewer.is-open'));
  await s.keyboard.press('Escape'); await s.waitForFunction(() => !document.querySelector('.viewer.is-open'));
  const g1 = await s.evaluate(() => document.activeElement.classList.contains('gallery-item'));
  await s.keyboard.press('Space');
  const g2 = await s.evaluate(() => !!document.querySelector('.viewer.is-open'));
  await s.keyboard.press('Escape');
  assert(g1 && g2, 'une galerie du site : Entrée ou Espace l’ouvre dans la visionneuse, Échap la ferme et rend le focus à la photo');

  // an iPhone or an iPad never zooms into a field: the viewport gets maximum-scale=1 there, and only there (Android
  // would stop pinching), on a page of an app (ds.js) and on the site (ds-site.js)
  const devices = {
    iphone: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' },
    ipad: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', touch: 5 },
    android: { userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' },
    computer: {}
  };
  const zoom = {};
  for (const [name, d] of Object.entries(devices)) {
    const ctx = await b.newContext(d.userAgent ? { userAgent: d.userAgent } : {});
    if (d.touch) await ctx.addInitScript(n => { Object.defineProperty(Navigator.prototype, 'platform', { get: () => 'MacIntel' }); Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => n }); }, d.touch);
    const q = await ctx.newPage();
    zoom[name] = [];
    for (const page of ['/checks/access.html', '/site.html']) {
      await q.goto(base + page); await q.waitForLoadState('load');
      zoom[name].push(await q.evaluate(() => /maximum-scale=1/.test(document.querySelector('meta[name="viewport"]').content)));
    }
    await ctx.close();
  }
  assert(JSON.stringify(zoom) === JSON.stringify({ iphone: [true, true], ipad: [true, true], android: [false, false], computer: [false, false] }),
    'iPhone et iPad : aucun zoom en touchant un champ (maximum-scale=1), Android et ordinateur inchangés ' + JSON.stringify(zoom));

  await b.close(); server.close();
})();
