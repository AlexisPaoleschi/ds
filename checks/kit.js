// The small tools every app wrote for itself (ds 4.17.0), in a real browser: ds.text, the words (plural, count, list,
// duration, every, since), ds.date's relative and heading styles, ds.day's months and differences, ds.store, ds.poll and
// ds.onSeen, ds.boot, ds.ext and a safe ds.h, ds.delta and the tones, the quiet note in each theme.
// usage: node checks/kit.js (Playwright installed); it serves the repository itself on a free port
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
const assert = (ok, what, got) => { if (!ok) { console.log('ÉCHEC', what, JSON.stringify(got)); process.exitCode = 1; } else console.log('ok  ', what); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/kit.html');
  await p.waitForFunction(() => window.ready);

  let r = await p.evaluate(() => [ds.text.fold('Café Élodie'), ds.text.matches('Café de la Gare', 'gare cafe'), ds.text.matches('Café', 'thé'),
    ['Zoé', 'élodie', 'Anne', '10', '9'].sort(ds.text.compare), ds.text.slug('Ce qui rapporte !')]);
  assert(same(r, ['cafe elodie', true, false, ['9', '10', 'Anne', 'élodie', 'Zoé'], 'ce-qui-rapporte']), 'ds.text: fold, matches, compare, slug', r);

  r = await p.evaluate(() => [ds.plural(0, 'opération'), ds.plural(1, 'opération'), ds.plural(2, 'opération'), ds.plural(3, 'œil', 'yeux'), ds.count(1234, 'opération'),
    ds.list(['Léa']), ds.list(['Léa', 'Irina', 'Zoé']), ds.list(['A', 'B'], { or: true })]);
  assert(same(r, ['opération', 'opération', 'opérations', 'yeux', '1 234 opérations', 'Léa', 'Léa, Irina et Zoé', 'A ou B']), 'ds.plural, ds.count, ds.list', r);

  r = await p.evaluate(() => [ds.duration(0), ds.duration(1), ds.duration(12), ds.duration(61), ds.duration(365), ds.duration(456),
    ds.every(3600), ds.every(7200), ds.every(1800), ds.every(86400), ds.since(Date.now() - 20e3), ds.since(Date.now() - 300e3), ds.since(Date.now() - 7500e3), ds.since(Date.now() - 8 * 3600e3)]);
  assert(same(r, ["moins d'un jour", '1 jour', '12 jours', '2 mois', '1 an', '1 an et 3 mois', 'toutes les heures', 'toutes les 2h', 'toutes les 30 min', 'tous les jours', '', '5 min', '2h05', null]),
    'ds.duration, ds.every, ds.since', r);

  r = await p.evaluate(() => { const t = ds.day.today(); return [ds.date(t, 'relative'), ds.date(ds.day.add(t, 1), 'relative'), ds.date(ds.day.add(t, -1), 'relative'),
    ds.date(ds.day.add(t, 5), 'relative'), ds.date(ds.day.add(t, -12), 'relative'), ds.date(t, 'heading'), ds.date(ds.day.add(t, -1), 'heading'),
    ds.date('2020-11-06', 'heading'), ds.date('2026-11-09', 'long')]; });
  assert(same(r, ['aujourd’hui', 'demain', 'hier', 'dans 5 jours', 'il y a 12 jours', 'Aujourd’hui', 'Hier', 'Vendredi 6 novembre 2020', '9 novembre 2026']),
    'ds.date relative and heading, Paris days in New York', r);

  r = await p.evaluate(() => [ds.day.addMonths('2026-11', 1), ds.day.addMonths('2026-01', -1), ds.day.addMonths('2026-01-31', 1), ds.day.addMonths('2024-01-31', 1),
    ds.day.monthEnd('2026-02'), ds.day.monthEnd('2024-02-10'), ds.day.diff('2026-11-01', '2026-11-23'), ds.day.diff('2026-03-31', '2026-03-28')]);
  assert(same(r, ['2026-12', '2025-12', '2026-02-28', '2024-02-29', '2026-02-28', '2024-02-29', 22, -3]), 'ds.day.addMonths, monthEnd, diff', r);

  r = await p.evaluate(() => { ds.store.set('kit-a', { x: [1, 2] }); ds.store.set('kit-b', 'mot'); const a = ds.store.get('kit-a'), b = ds.store.get('kit-b');
    localStorage.setItem('kit-c', '{broken'); const c = ds.store.get('kit-c', 'repli'); ds.store.set('kit-a', null);
    ds.store.set('kit-s', 3, { session: true }); return [a, b, c, ds.store.get('kit-a', 7), ds.store.get('kit-s', 0, { session: true }), localStorage.getItem('kit-s')]; });
  assert(same(r, [{ x: [1, 2] }, 'mot', 'repli', 7, 3, null]), 'ds.store: JSON kept, a broken value or none gives the fallback, null takes it away, session apart', r);

  r = await p.evaluate(async () => { let n = 0, ends = 0; const t = ds.poll(() => { n++; }, { every: 50, now: true, until: Date.now() + 230, onEnd: () => ends++ });
    await new Promise(ok => setTimeout(ok, 400)); const before = n; await new Promise(ok => setTimeout(ok, 200)); t.stop(); return [n >= 4 && n <= 6, before === n, ends]; });
  assert(same(r, [true, true, 1]), 'ds.poll: at once, then every so often, ends at its time and tells it once', r);
  r = await p.evaluate(async () => { let n = 0, running = 0, most = 0; const t = ds.poll(async () => { running++; most = Math.max(most, running); n++; await new Promise(ok => setTimeout(ok, 120)); running--; }, { every: 30, now: true });
    await new Promise(ok => setTimeout(ok, 300)); t.stop(); return [most, n >= 2]; });
  assert(same(r, [1, true]), 'ds.poll: never two at once', r);

  r = await p.evaluate(async () => { const b = document.getElementById('boot'); ds.boot.say('Chargement des comptes…', 'BoursoBank');
    const said = [b.querySelector('.boot-title').textContent, b.querySelector('.boot-text').textContent, ds.boot.shown()];
    ds.boot.fail('Bank n’a pas pu se charger', 'Le serveur ne répond pas.'); ds.boot.fail('Bank n’a pas pu se charger', 'Encore.');
    const failed = [b.classList.contains('is-failed'), b.querySelectorAll('.boot-retry').length, b.querySelector('.boot-retry').textContent, b.querySelector('.boot-text').textContent];
    b.classList.remove('is-failed'); b.querySelector('.boot-retry').remove(); ds.boot.done(); await new Promise(ok => setTimeout(ok, 500));
    return [said, failed, b.hidden, ds.boot.shown()]; });
  assert(same(r, [['Chargement des comptes…', 'BoursoBank', true], [true, 1, 'Réessayer', 'Encore.'], true, false]), 'ds.boot: says, fails once with its retry, fades then hides', r);

  r = await p.evaluate(() => { const a = ds.ext('https://instagram.com/x', 'Léa'), b = ds.ext('javascript:alert(1)', 'Zoé'), c = ds.ext('http://x.fr', 'Ana');
    const d = ds.h('a', { href: 'javascript:alert(1)', text: 'x' }), e = ds.h('a', { href: ' JavaScript:alert(1)' }), f = ds.h('img', { src: 'data:text/html,<b>' }), g = ds.h('a', { href: '/ok' });
    return [a.tagName, a.target, a.rel, b.tagName, c.tagName, d.hasAttribute('href'), e.hasAttribute('href'), f.hasAttribute('src'), g.getAttribute('href')]; });
  assert(same(r, ['A', '_blank', 'noopener', 'SPAN', 'SPAN', false, false, false, '/ok']), 'ds.ext only for https, ds.h leaves out a script address', r);

  r = await p.evaluate(() => { const box = document.getElementById('delta');
    const parts = [ds.delta(12), ds.delta(-3.5), ds.delta(0), ds.delta(1234.5, { format: 'money' }), ds.delta(-0.12, { format: 'percent' }), ds.delta(40, { invert: true, unit: '€' })];
    parts.forEach(x => box.append(x, ' '));
    return [parts.map(x => [x.className, x.textContent]), ds.delta.html(-2, { format: 'money' }),
      getComputedStyle(parts[0]).color === getComputedStyle(document.getElementById('up')).color, getComputedStyle(parts[1]).color === getComputedStyle(document.getElementById('down')).color,
      getComputedStyle(parts[0]).fontWeight, getComputedStyle(parts[0]).whiteSpace]; });
  assert(same(r, [[['delta is-good', '+12'], ['delta is-bad', '−3,5'], ['delta', '±0'], ['delta is-good', '+1 234,50€'], ['delta is-bad', '−12 %'], ['delta is-bad', '+40€']],
    '<span class="delta is-bad">−2,00€</span>', true, true, '600', 'nowrap']), 'ds.delta: signed, in its tone, ±0 without one, invert, as HTML too', r);

  r = await p.evaluate(() => { const n = document.querySelectorAll('.note'); const a = [getComputedStyle(n[0]).fontSize, getComputedStyle(n[1]).color !== getComputedStyle(n[0]).color];
    document.documentElement.setAttribute('data-theme', 'vitrine'); return a.concat([getComputedStyle(n[0]).fontSize]); });
  assert(same(r, ['13px', true, '14px']), 'the note follows its theme (13px in Atelier, 14px in Vitrine), is-faint quieter', r);

  r = await p.evaluate(() => { document.documentElement.lang = 'en'; const t = ds.day.today();
    return [ds.plural(0, 'item'), ds.list(['A', 'B', 'C']), ds.duration(456), ds.every(7200), ds.date(ds.day.add(t, 3), 'relative'), ds.date(t, 'heading')]; });
  assert(same(r, ['items', 'A, B, and C', '1 year and 3 months', 'every 2h', 'in 3 days', 'Today']), 'the words in English', r);

  assert(errors.length === 0, 'no error in the page', errors);
  await b.close(); server.close();
})();
