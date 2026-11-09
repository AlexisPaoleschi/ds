// The files each app loads, in a real browser: a page of Selecta's (ds.css and ds.js alone) gets the bubble, the window
// and the forms that ask, the tables (in ds.css since 2.40, for Selecta's lists), and nothing of the tools (no pill,
// calendar or sheet rule, no ds.calendar, no ds-tools file asked for); a page of Bank's (ds-tools.css, ds-icons.js, ds-tools.js after ds.css and ds.js) gets the tools and
// the icons, put in the page by their own file, the calendar's and the date picker's arrows being the sprite's chevrons;
// the site's way to the icons (icons.svg, with no script) draws them too. And the screen widths of every stylesheet.
// usage: node checks/bundles.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// the screen widths: 480, 768 and 1024px, 769 for « wider than a phone », 1280 for a very large screen; 956px only in
// the site kit, for a phone held sideways (orientation: landscape)
const SITE_KIT = ['sitebase', 'sitebar', 'banners', 'event', 'home', 'eventslist', 'newsletter', 'testimonials'];
function widths() {
  const wrong = [];
  for (const f of fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.css'))) {
    const css = read('src/' + f).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/@media\s*([^{]+)\{/g)) {
      for (const query of m[1].split(',')) {
        for (const w of query.match(/\d+(?=px)/g) || []) {
          const sideways = w === '956' && /orientation:\s*landscape/.test(query) && SITE_KIT.includes(f.replace('.css', ''));
          if (!['480', '768', '769', '1024', '1280'].includes(w) && !sideways) wrong.push(f + ': ' + query.trim());
        }
      }
    }
  }
  return wrong;
}

(async () => {
  const wrong = widths();
  assert(!wrong.length, 'les largeurs d’écran : 480, 768, 769, 1024 et 1280px partout, 956px couché dans le seul kit du site ' + wrong.join(' | '));
  // the bundles: the sprite out of ds.js, all of it in ds-icons.js and in icons.svg; the tools out of ds.css and ds.js
  const ids = t => [...t.matchAll(/<symbol id="(i-[\w-]+)"/g)].map(m => m[1]);
  const inJs = ids(read('dist/ds-icons.js')), inSvg = ids(read('dist/icons.svg'));
  assert(!/<symbol/.test(read('dist/ds.js')) && inJs.length === 214 && inJs.join() === inSvg.join(),
    'les icônes hors de ds.js : les 214, les mêmes dans ds-icons.js et dans icons.svg ' + JSON.stringify([inJs.length, inSvg.length]));
  // each tools' file is in ds-tools.css or ds-tools.js, and nowhere in ds.css or ds.js; the photos' in ds-photo.js only
  const has = (dist, src) => read('dist/' + dist).includes(read('src/' + src).trim());
  const toolsCss = ['pick', 'period', 'periodpick', 'datepick', 'reorder', 'live', 'sheet', 'panel', 'rows', 'status', 'figures', 'chart', 'calendar', 'settings'].map(n => n + '.css');
  const toolsJs = ['tools', 'sheet', 'table', 'calendar', 'chart', 'figures', 'pick', 'reorder', 'datepick', 'live'].map(n => n + '.js');
  const misplaced = toolsCss.filter(f => has('ds.css', f) || !has('ds-tools.css', f)).concat(toolsJs.filter(f => has('ds.js', f) || !has('ds-tools.js', f)),
    ['viewer.js', 'photogrid.js'].filter(f => has('ds.js', f) || !has('ds-photo.js', f)), ['icons.js'].filter(f => has('ds.js', f) || !has('ds-icons.js', f)),
    ['core.js', 'ds.js'].filter(f => has('ds-tools.js', f)), ['table.css'].filter(f => !has('ds.css', f) || has('ds-tools.css', f)));
  assert(!misplaced.length, 'les outils dans ds-tools.css et ds-tools.js seulement, les tableaux dans ds.css, la visionneuse dans ds-photo.js, les icônes dans ds-icons.js, ds.js et son noyau une seule fois ' + misplaced.join(' '));

  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const errors = [];

  // ---------- a page of Selecta's: ds.css and ds.js, nothing else ----------
  const sel = await b.newPage({ viewport: { width: 1280, height: 800 } });
  sel.on('pageerror', e => errors.push('selecta ' + e));
  const asked = []; sel.on('request', r => asked.push(r.url().replace(base, '')));
  await sel.setContent(`<!doctype html><html lang="fr" data-theme="vitrine"><head><meta charset="utf-8">
    <link rel="stylesheet" href="${base}/dist/ds.css"><script src="${base}/dist/ds.js" defer></script></head><body>
    <form id="del" data-confirm="Supprimer ce client ?" data-confirm-ok="Supprimer" action="#parti"><button class="btn is-danger" type="submit">Supprimer</button></form>
    <dl class="tiles is-compact"><div class="tile"><dt>Photos</dt><dd>42</dd></div></dl><div class="msg">Un message</div></body></html>`);
  await sel.waitForFunction(() => window.ds && window.ds.toast);
  const selecta = await sel.evaluate(async () => {
    const rules = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch (e) { return []; } }).join('\n');
    ds.toast({ type: 'good', text: 'Sélection terminée' });
    const asking = ds.confirm({ title: 'Supprimer ?', text: 'Pour de bon', ok: 'Supprimer', danger: true });
    await new Promise(r => setTimeout(r, 300));
    const shown = { toast: !!document.querySelector('.toasts .toast'), dialog: !!document.querySelector('.dialog') };
    document.querySelector('.dialog .btn:not(.is-danger), .dialog button').click();
    await asking;
    return { ...shown, tools: ['calendar', 'chart', 'sheet', 'drawer', 'busy', 'datePick', 'picker', 'sortable', 'viewer'].filter(n => n in ds),
      rules: ['.pill', '.cal-cell', '.datepick', '.sheet-panel', '.side-layout'].filter(s => rules.includes(s)), tables: (() => { const t = document.createElement('table'); t.className = 'tbl'; document.body.append(t); const v = getComputedStyle(t).borderCollapse; t.remove(); return v === 'collapse'; })(), sprite: !!document.getElementById('ds-icons'),
      compact: getComputedStyle(document.querySelector('.tile dd')).fontSize };
  });
  await sel.click('#del button'); await sel.waitForTimeout(300);
  const selAsk = await sel.evaluate(() => !!document.querySelector('.dialog'));
  assert(selecta.toast && selecta.dialog && selAsk && !selecta.tools.length && !selecta.rules.length && !selecta.sprite
      && selecta.tables && !asked.some(u => /ds-(tools|icons|photo)/.test(u)) && selecta.compact === '28px',
    'une page de Selecta (ds.css et ds.js seuls) : la bulle, la fenêtre, le formulaire qui demande ; aucun outil, aucune règle des outils, aucun autre fichier ' + JSON.stringify(selecta));

  // ---------- a page of Bank's: the tools and the icons, each in its file ----------
  const bank = await b.newPage({ viewport: { width: 1280, height: 800 } });
  bank.on('pageerror', e => errors.push('bank ' + e));
  await bank.goto(base + '/checks/bundles.html');
  await bank.waitForFunction(() => window.ready);
  const tools = await bank.evaluate(() => {
    const drawn = sel => [...document.querySelectorAll(sel)].map(u => ({ href: u.getAttribute('href'), w: Math.round(u.getBBox().width) }));
    return { symbols: document.querySelectorAll('#ds-icons symbol').length, wallet: Math.round(document.querySelector('#wallet use').getBBox().width),
      site: Math.round(document.querySelector('#site use').getBBox().width),
      cal: drawn('#cal .cal-arrows .btn.is-icon use'), dp: drawn('#dp .dp-step use'),
      text: [...document.querySelectorAll('#cal .cal-arrows .btn.is-icon, #dp .dp-step')].map(x => x.textContent.trim()).join(''),
      // as wide as before, the small buttons' height
      square: [...document.querySelectorAll('#cal .cal-arrows .btn.is-icon')].map(x => Math.round(x.getBoundingClientRect().width) === parseFloat(getComputedStyle(x).getPropertyValue('--btn-s-h'))),
      fns: ['calendar', 'chart', 'sheet', 'drawer', 'busy', 'datePick', 'picker', 'sortable'].filter(n => typeof ds[n] === 'function' || (ds[n] && typeof ds[n] === 'object')).length };
  });
  assert(tools.symbols === 214 && tools.wallet > 0 && tools.fns === 8, 'une page de Bank : les 214 icônes mises dans la page par ds-icons.js, dessinées ; les outils de ds-tools.js ' + JSON.stringify([tools.symbols, tools.wallet, tools.fns]));
  assert(tools.site > 0, 'le fichier icons.svg, sans script, comme sur le site : l’icône est dessinée');
  assert(tools.cal.map(x => x.href).join() === '#i-chevron-left,#i-chevron-right' && tools.dp.map(x => x.href).join() === '#i-chevron-left,#i-chevron-right'
      && tools.cal.concat(tools.dp).every(x => x.w > 0) && !tools.text && tools.square.every(Boolean),
    'les flèches du calendrier et du choix de dates sont les chevrons de la planche, dessinés, dans des boutons aussi larges qu’avant ' + JSON.stringify(tools));

  assert(!errors.length, 'aucune erreur dans les pages ' + errors.join(' | '));
  await b.close();
  server.close();
})();
