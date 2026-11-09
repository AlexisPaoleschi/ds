// ds 3.0, one way to call and to name (points 48 to 51 of the study), in a real browser: every component is
// ds.thing(holder, data, options) and a second call on the same holder gives back the same one, never a second; none
// breaks without a holder (a builder then only returns its element); ds.today() is Paris's day; the options are value
// for the choice, onPick when one chooses, format to write a figure, tip for the words on hover; and no old name is
// left in dist (the states in is-…, the tones is-good, is-bad, is-mid, the long names of 3.0).
// usage: node checks/names.js (Playwright installed); it serves the repository itself on a free port
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

// the names 3.0 took away (MIGRATION-3.md): none may be left in a stylesheet or a script of dist
const OLD = ['on', 'active', 'open', 'is-active', 'is-sel', 'visible', 'hidden', 'loading', 'loading-done', 'gone', 'failed', 'off', 'out', 'run',
  'good', 'bad', 'ok', 'up', 'down', 'neg', 'n', 'is-weak', 'warn', 'lwarn', 'lbad', 't', 'v', 'x', 'pl', 'ttl', 'late', 'empty', 'kv', 'u', 'h', 'd',
  'dot', 'sn', 'sw', 'sf', 'sd', 'sl', 'okc', 'pc', 'bt', 'boot-t', 'boot-s', 'boot-p', 'boot-x', 'dialog-x', 'sheet-x', 'll', 'lt', 'lx', 'mx', 'sum',
  'none', 'jl', 'go', 'pv', 'tl', 'vt', 'yr', 'fdot', 'fall', 'only', 'sq', 'back', 'reload', 'save', 'changed', 'wrong'];
const esc = s => s.replace(/[-]/g, '\\-');
function leftInCss() {
  const left = [];
  for (const f of fs.readdirSync(path.join(root, 'dist')).filter(f => f.endsWith('.css'))) {
    const css = read('dist/' + f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '').replace(/\d*\.\d+/g, '0');
    for (const o of OLD) if (new RegExp('\\.' + esc(o) + '(?![\\w-])').test(css)) left.push(f + ' .' + o);
  }
  return left;
}
function leftInJs() {
  const left = [];
  for (const f of fs.readdirSync(path.join(root, 'dist')).filter(f => f.endsWith('.js'))) {
    const js = read('dist/' + f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const o of OLD) {
      const t = esc(o), word = '(?<![\\w-])' + t + '(?![\\w-])';
      const rx = [
        new RegExp('classList\\.(?:add|remove|toggle|contains)\\(\\s*["\']' + t + '["\']'),
        new RegExp('\\b(?:el|tag|make|h)\\(\\s*"[a-z0-9]+",\\s*"[^"]*' + word + '[^"]*"'),
        new RegExp('class(?:Name)?\\s*[=:]\\s*\\\\?["\'][^"\']*' + word + '[^"\']*["\']'),
        new RegExp('(?:querySelector(?:All)?|closest|matches)\\(\\s*["\'][^"\']*\\.' + t + '(?![\\w-])'),
      ];
      if (rx.some(r => r.test(js))) left.push(f + ' ' + o);
    }
  }
  return left;
}

(async () => {
  const css = leftInCss(), js = leftInJs();
  assert(!css.length && !js.length, 'aucun ancien nom dans dist : ni sélecteur, ni classe posée par un script ' + JSON.stringify(css.concat(js)));
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/names.html');
  await p.waitForFunction(() => window.ready);

  // a second call on the same holder: the same component, never a second one
  const same = await p.evaluate(() => {
    const $ = s => document.querySelector(s), out = {};
    const pairs = {
      datePick: () => ds.datePick('#dp', { value: { from: '2026-11-01', to: '2026-11-30' } }),
      calendar: () => ds.calendar('#cal', { today: '2026-11-09', items: () => [] }),
      picker: () => ds.picker('#pick', [{ value: 'a', label: 'A' }]),
      periodPick: () => ds.periodPick('#period', [[30, '30 jours'], [90, '90 jours']], { value: 30 }),
      selection: () => ds.selection('#sel', {}), sortable: () => ds.sortable('#tbl', {}), reorder: () => ds.reorder('#list', {}),
      sheet: () => ds.sheet('#sheet'), photogrid: () => ds.photogrid('#grid'), foldCard: () => ds.foldCard('#fold', 'names-fold'),
      version: () => ds.version('#reload'), drawer: () => ds.drawer('[data-drawer="names-side"]'), status: () => ds.status('#status', { summary: 'à jour', rows: [] }),
      newsletter: () => ds.newsletter('#nl', { url: '/nowhere' })
    };
    for (const k in pairs) { const a = pairs[k](), b = pairs[k](); out[k] = !!a && a === b; }
    out.oneCalendar = $('#cal').children.length === 1 && $('#period').children.length === 1 && $('#status').children.length === 1;
    // the date picker given a new value on a second call shows it
    out.dpValue = ds.datePick('#dp', { value: { from: '2026-10-01', to: '2026-10-31' } }).get().from === '2026-10-01';
    return out;
  });
  assert(Object.values(same).every(Boolean), 'un deuxième appel sur le même conteneur rend le même composant, sans en ajouter un second ' + JSON.stringify(same));

  // no holder: nothing breaks; a builder only returns its element
  const none = await p.evaluate(() => {
    const out = {}, tryIt = (k, f) => { try { out[k] = f(); } catch (e) { out[k] = 'plante : ' + e.message; } };
    ['datePick', 'calendar', 'picker', 'selection', 'sortable', 'reorder', 'sheet', 'photogrid', 'foldCard', 'version', 'drawer', 'status', 'jobs', 'newsletter']
      .forEach(k => tryIt(k, () => ds[k](null) === null ? 'null' : 'autre'));
    tryIt('viewerBind', () => typeof ds.viewer.bind);
    const built = {
      rank: () => ds.rank(null, [{ name: 'Léa', value: '3' }]), minitiles: () => ds.minitiles(null, [{ label: 'Posts', value: '4' }]),
      verdict: () => ds.verdict(null, 1.3), periodPick: () => ds.periodPick(null, [[30, '30 jours']], { value: 30 }), avatar: () => ds.avatar(null, { name: 'Léa' }),
      line: () => ds.chart.line(null, [{ x: '2026-11-01', v: 1 }, { x: '2026-11-02', v: 2 }]), bars: () => ds.chart.bars(null, [{ key: 'a', value: 1 }]),
      heat: () => ds.chart.heat(null, {}, { to: '2026-11-09' }), spark: () => ds.chart.spark(null, [1, 2]), split: () => ds.chart.split(null, [{ label: 'a', value: 1 }]),
      donut: () => ds.chart.donut(null, [{ key: 'a', label: 'A', value: 1 }])
    };
    for (const k in built) tryIt(k, () => built[k]() instanceof HTMLElement ? 'élément' : 'autre');
    return out;
  });
  const builders = ['rank', 'minitiles', 'verdict', 'periodPick', 'avatar', 'line', 'bars', 'heat', 'spark', 'split', 'donut'];
  assert(Object.entries(none).every(([k, v]) => k === 'viewerBind' ? v === 'function' : builders.includes(k) ? v === 'élément' : v === 'null'),
    'sans conteneur rien ne plante : un composant rend null, un dessin rend seulement son élément ' + JSON.stringify(none));

  // Paris's day, and the old one gone
  const today = await p.evaluate(() => [ds.today(), ds.day.today(), typeof ds.datePick.today]);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(today[0]) && today[0] === today[1] && today[2] === 'undefined', 'ds.today() dit le jour de Paris ; ds.datePick.today n’existe plus ' + JSON.stringify(today));

  // the new names of the options: value, onPick, format, formatDay, tip; a tone for a mini tile
  const opts = await p.evaluate(() => {
    const $ = s => document.querySelector(s), got = [];
    ds.chart.bars('#bars', [{ key: 'a', label: 'A', value: 1 }, { key: 'b', label: 'B', value: 2 }], { value: 'b', onPick: k => got.push('bars:' + k) });
    $('#bars .chart-bar').click();
    ds.chart.donut('#donut', [{ key: 'a', label: 'A', value: 1 }, { key: 'b', label: 'B', value: 2 }], { value: 'a', onPick: k => got.push('donut:' + k) });
    const lit = [$('#bars .chart-bar.is-on') && $('#bars .chart-bar.is-on').getAttribute('aria-pressed'), $('#donut .chart-donut-row.is-on') && $('#donut .chart-donut-row.is-on').textContent];
    ds.chart.line('#line', [{ x: '2026-11-01', v: 1 }, { x: '2026-11-02', v: 2 }], { format: v => v + ' u', formatDay: x => 'jour ' + x.slice(8) });
    ds.chart.heat('#heat', { '2026-11-09': 2 }, { to: '2026-11-09', tip: (k, n) => 'astuce ' + n });
    ds.chart.spark('#spark', [1, 2], { tip: v => 'vu ' + v });
    ds.periodPick('#period', null, { value: 90 });
    ds.minitiles('#mini', [{ label: 'Gagnés', value: '+86', tone: 'good' }, { label: 'Perdus', value: '−3', tone: 'bad' }]);
    const sel = ds.selection('#sel', { onPick: k => got.push('sel:' + k.join(',')) });
    $('#sel .sel-box').click();
    return { got, lit, line: $('#line').textContent, heat: !!$('#heat [title="astuce 2"]'), spark: !!$('#spark [title="vu 2"]'),
      period: $('#period [aria-pressed="true"]').textContent, tones: [...document.querySelectorAll('#mini .tile')].map(t => t.className),
      picker: [...document.querySelectorAll('#pick .picker-opt')].length >= 0, cal: ds.calendar('#cal').state().value };
  });
  assert(JSON.stringify(opts.got) === '["bars:a","sel:1"]' && opts.lit[0] === 'true' && /^A/.test(opts.lit[1]) && /2 u/.test(opts.line) && /jour 0[12]/.test(opts.line)
    && opts.heat && opts.spark && opts.period === '90 jours' && JSON.stringify(opts.tones) === '["tile is-good","tile is-bad"]' && opts.cal === '2026-11-09',
    'les options : value et onPick (barres, anneau, période, sélection), format et formatDay (courbe), tip (jours, petites barres), le ton d’une mini-case, calendar().state().value ' + JSON.stringify(opts));

  // the states drawn by ds: the drawer's layout is-open, its tab aria-expanded; a sync's dot in its tone
  await p.locator('[data-drawer-toggle="names-side"]').click();
  const states = await p.evaluate(() => {
    ds.jobs('#jobs', [{ key: 'a', label: 'Banques', state: true, run: () => Promise.resolve() }, { key: 'b', label: 'Notion', state: false, bad: true, summary: 'refusé' }, { key: 'c', label: 'Patreon', state: 'run' }]);
    const $ = s => document.querySelector(s);
    return { open: $('[data-drawer="names-side"]').classList.contains('is-open'), tab: $('[data-drawer-toggle]').getAttribute('aria-expanded'), tabOn: $('[data-drawer-toggle]').classList.contains('on'),
      dots: [...document.querySelectorAll('#jobs .sync-dot')].map(d => d.className), run: $('#jobs [data-job="run"]').className, journal: $('#jobs [data-job="journal"]').className,
      sum: $('#jobs .job-sum').className };
  });
  assert(states.open && states.tab === 'true' && !states.tabOn && JSON.stringify(states.dots) === '["sync-dot is-good","sync-dot is-bad","sync-dot is-running"]'
    && states.run === 'btn is-act' && states.journal === 'btn' && states.sum === 'job-sum is-bad',
    'les états : le tiroir is-open, son onglet aria-expanded ; les synchros en boutons de ds, leurs points dans leur ton ' + JSON.stringify(states));
  assert(!errors.length, 'aucune erreur dans la page ' + errors.join(' | '));
  await browser.close();
  server.close();
})();
