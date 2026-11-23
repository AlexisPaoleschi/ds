// The gestures (ds 4.20.0) in a real browser: one bubble per subject (key), undo and redo with their keys and buttons, a
// box ticked at once and back when saving fails, copying, opening several tabs, the panel under a button and its figure,
// arriving and going, drawing again only when something changed, the words lit and the word meant, the search language
// (ds.query), the filter panel and the filters in use.
// usage: node checks/gestures.js (Playwright installed); it serves the repository itself on a free port
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
const assert = (ok, what, got) => { if (!ok) { console.log('ÉCHEC', what, JSON.stringify(got)); process.exitCode = 1; } else console.log('ok  ', what); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/gestures.html');
  await p.waitForFunction(() => window.ready);
  const toasts = () => p.evaluate(() => [...document.querySelectorAll('.toast:not(.is-leaving)')].map(t => [t.className.replace('toast ', ''), t.querySelector('.txt').textContent]));

  // one bubble per subject
  await p.evaluate(() => { ds.toast({ key: 'k', type: 'busy', text: 'Lecture…' }); ds.toast({ key: 'k', type: 'good', text: 'À jour' }); ds.toast({ key: 'other', type: 'info', text: 'Autre' }); });
  let r = await toasts();
  assert(same(r, [['is-good', 'À jour'], ['is-info', 'Autre']]), 'ds.toast: la même clé change la même bulle', r);
  await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));

  // undo and redo
  await p.evaluate(() => {
    window.runs = []; window.fail = false;
    window.u = ds.undo({ undo: '#undo', redo: '#redo', key: 'page', run: (step, redo) => new Promise((ok, no) => setTimeout(() => { window.runs.push([step.id, redo]); window.fail ? no(new Error('x')) : ok(step.label + (redo ? ' rétabli' : ' annulé')); }, 20)) });
    window.act = u.remember({ id: 1, label: 'Catégorie · Boulangerie' });
  });
  r = await p.evaluate(() => [document.getElementById('undo').disabled, document.getElementById('undo').title, document.getElementById('redo').disabled, act.label]);
  assert(same(r, [false, 'Annuler : Catégorie · Boulangerie (Ctrl+Z)', true, 'Annuler']), 'ds.undo: les boutons disent ce qu’ils feraient, la bulle propose « Annuler »', r);
  await p.keyboard.press('Control+z');
  await p.waitForFunction(() => window.runs.length === 1);
  await p.waitForTimeout(30);
  r = await p.evaluate(() => [runs, document.getElementById('undo').disabled, document.getElementById('redo').title, [...document.querySelectorAll('.toast:not(.is-leaving)')].map(t => [t.querySelector('.txt').textContent, t.querySelector('.act').textContent])]);
  assert(same(r, [[[1, false]], true, 'Rétablir : Catégorie · Boulangerie (Ctrl+Y)', [['Catégorie · Boulangerie annulé', 'Rétablir']]]), 'ds.undo: Ctrl+Z annule, une seule bulle, « Rétablir » ensuite', r);
  await p.focus('#field');
  await p.keyboard.press('Control+y');
  await p.waitForTimeout(60);
  r = await p.evaluate(() => runs.length);
  assert(r === 1, 'ds.undo: dans un champ, Ctrl+Y reste au champ', r);
  await p.evaluate(() => document.activeElement.blur());
  await p.evaluate(() => { window.fail = true; });
  await p.keyboard.press('Control+y');
  await p.waitForFunction(() => window.runs.length === 2);
  await p.waitForTimeout(30);
  r = await p.evaluate(() => [document.getElementById('redo').disabled, document.querySelector('.toast:not(.is-leaving) .txt').textContent]);
  assert(same(r, [false, 'Rétablissement impossible : réessaie']), 'ds.undo: un échec remet le pas sur sa liste et le dit', r);
  await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));

  // ticked at once, back when saving fails
  r = await p.evaluate(async () => {
    const t = { done: false }, seen = [];
    const go = ok => ds.optimistic('a', { change: () => { t.done = !t.done; }, revert: () => { t.done = !t.done; }, after: () => seen.push(t.done),
      save: () => new Promise((y, n) => setTimeout(() => ok ? y() : n(new Error('Refusé par le serveur')), 10)) });
    const first = go(false), busy = ds.optimistic.busy('a'), second = go(true);
    const kept = await first;
    return [busy, second, kept, t.done, seen, document.querySelector('.toast .txt').textContent];
  });
  assert(same(r, [true, null, false, false, [true, false], 'Refusé par le serveur']), 'ds.optimistic: coché à l’instant, une fois à la fois, revenu et dit quand ça échoue', r);
  await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));

  // copying
  await p.fill('#field', 'IMG_1.jpg OR IMG_2.jpg');
  await p.click('#copy');
  await p.waitForTimeout(100);
  r = await p.evaluate(async () => [await navigator.clipboard.readText(), document.querySelector('.toast .txt').textContent]);
  assert(same(r, ['IMG_1.jpg OR IMG_2.jpg', 'Copié !']), 'ds.copy: [data-copy="#champ"] copie sa valeur, la bulle le dit', r);
  await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));

  // several tabs: the browser here blocks none, but window.open giving null is counted
  r = await p.evaluate(async () => { const real = window.open; let n = 0; window.open = () => (n++ === 1 ? null : { focus() {}, opener: 1 }); const out = await ds.openAll(['a', 'b', 'c'], { ask: 10 }); window.open = real; return [out, document.querySelector('.toast .txt').textContent.slice(0, 34)]; });
  assert(same(r, [{ opened: 2, blocked: 1 }, 'Le navigateur a bloqué un onglet :']), 'ds.openAll: les onglets bloqués sont comptés et dits', r);
  r = await p.evaluate(() => { ds.openAll(['1', '2', '3'], { ask: 2 }); return new Promise(ok => setTimeout(() => ok(!!document.querySelector('.dialog-veil .dialog')), 50)); });
  assert(r, 'ds.openAll: au-delà de ask, la page demande d’abord', r);
  await p.keyboard.press('Escape');
  await p.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));

  // the panel under a button
  await p.evaluate(() => { window.opened = 0; ds.pop('#bell-b', '#bell-p', { onOpen: () => window.opened++ }); ds.pop.count('#bell-n', 120); });
  await p.click('#bell-b');
  r = await p.evaluate(() => [document.getElementById('bell-p').hidden, document.getElementById('bell-b').getAttribute('aria-expanded'), opened, document.getElementById('bell-n').textContent,
    getComputedStyle(document.getElementById('bell-p')).position, Math.round(document.getElementById('bell-p').getBoundingClientRect().width)]);
  assert(same(r, [false, 'true', 1, '99+', 'absolute', 380]), 'ds.pop: ouvert par son bouton, 380px sous lui, « 99+ »', r);
  await p.click('#bell-all');
  r = await p.evaluate(() => document.getElementById('bell-p').hidden);
  assert(r === false, 'ds.pop: un clic dans le panneau le laisse ouvert', r);
  await p.keyboard.press('Escape');
  r = await p.evaluate(() => [document.getElementById('bell-p').hidden, document.activeElement.id]);
  assert(same(r, [true, 'bell-b']), 'ds.pop: Échap le ferme et rend le focus au bouton', r);
  await p.click('#bell-b'); await p.mouse.click(600, 600);
  r = await p.evaluate(() => { ds.pop.count('#bell-n', 0); return [document.getElementById('bell-p').hidden, document.getElementById('bell-n').hidden]; });
  assert(same(r, [true, true]), 'ds.pop: un clic ailleurs le ferme ; à 0 le chiffre se cache', r);

  // arriving and going
  r = await p.evaluate(async () => { const one = document.getElementById('one'); const a = ds.enter(one); const anims = one.getAnimations().length; await a; await ds.leave('#two', { kind: 'fade' }); return [anims, !!document.getElementById('two'), !!document.getElementById('one')]; });
  assert(same(r, [1, false, true]), 'ds.enter, ds.leave: une animation, puis retiré', r);

  // drawing again only when something changed, the scroll and the focus kept
  r = await p.evaluate(() => {
    const holder = document.getElementById('holder'); let built = 0;
    const build = n => () => { built++; holder.innerHTML = Array.from({ length: n }, (_, i) => '<p><button type="button" id="b' + i + '">' + i + '</button></p>').join(''); };
    ds.redraw(holder, 'a', build(20), { key: 'léa' });
    document.getElementById('b5').focus({ preventScroll: true }); holder.scrollTop = 120;
    const again = ds.redraw(holder, 'a', build(20), { key: 'léa' });
    ds.redraw(holder, 'b', build(21), { key: 'léa' });
    const kept = [holder.scrollTop, document.activeElement.id];
    ds.redraw(holder, 'c', build(21), { key: 'irina' });
    return [again, built, kept, holder.scrollTop];
  });
  assert(same(r, [false, 3, [120, 'b5'], 0]), 'ds.redraw: rien quand rien n’a changé ; le défilement et le focus gardés pour la même clé', r);

  // the words lit, the word meant
  r = await p.evaluate(() => { ds.highlight('#hl', '.row-title, .row-note', [{ t: 'word', v: 'cafe' }, { t: 'phrase', v: 'la Gare' }, 'ŒUF']); return [...document.querySelectorAll('#hl mark.hit')].map(m => m.textContent); });
  assert(same(r, ['Café', 'la Gare', 'œuf', 'café']), 'ds.highlight: accents et majuscules à part, une phrase en mots entiers', r);
  r = await p.evaluate(() => { const v = ds.suggest.vocabulary(['Amazon Prime', 'Amazon', 'Boulangerie Paul']); return [ds.suggest('amazn', v), ds.suggest('boulangrie', v), ds.suggest('xyzzy', v), v.get('amazon')]; });
  assert(same(r, ['amazon', 'boulangerie', null, 2]), 'ds.suggest: le mot le plus proche, null sinon', r);

  // the search language
  r = await p.evaluate(() => {
    const q = ds.query({ fields: { nom: ['name'], note: ['note'] }, every: ['name', 'note'], date: x => x.day });
    const items = [{ id: 1, name: 'Café de la Gare', note: 'avec Léa', amount: -12.5, day: '2026-03-15' }, { id: 2, name: 'Amazon', note: 'livre', amount: -23.4, day: '2026-04-02' }, { id: 3, name: 'Salaire', amount: 2000, day: '2026-03-31' }];
    const find = s => items.filter(x => q.match(q.parse(s), x)).map(x => x.id);
    return [find('cafe'), find('-cafe'), find('café OU amazon'), find('"de la gare"'), find('note:lea'), find('12,50'), find('+2000'), find('20 à 30'), find('mars 2026'), find('>100'), find('(amazon | salaire) -livre'),
      q.terms(q.parse('cafe -livre "la gare"')).map(t => t.v), q.parse('')];
  });
  assert(same(r, [[1], [2, 3], [1, 2], [1], [1], [1], [3], [2], [1, 3], [3], [3], ['cafe', 'la gare'], null]), 'ds.query: mots, -sans, OU, « phrase », champ:, montants, dates, parenthèses', r);

  // the filter panel and the filters in use
  r = await p.evaluate(() => {
    window.changes = [];
    ds.store.set('check-filters', null);
    ds.filters('#filters', [{ title: 'Sources', items: [{ key: 'a', label: 'Agenda', color: 'var(--c-bleu)' }, { key: 'b', label: 'Tâches', icon: 'check' }] }], { key: 'check-filters', onChange: off => changes.push(Object.keys(off)) });
    const html = ds.filters.row({ group: 'cats', value: 'Café', on: false, label: 'Café', only: true });
    return [document.querySelectorAll('#filters button.chip[aria-pressed="true"]').length, !!document.querySelector('#filters .filter-all'), html.includes('data-only="cats"') && html.includes('aria-pressed="false"')];
  });
  assert(same(r, [2, false, true]), 'ds.filters: tout est allumé, pas de « Tout » ; la même ligne en HTML', r);
  await p.evaluate(() => document.querySelectorAll('#filters button.filter-only')[1].click());
  r = await p.evaluate(() => [changes, [...document.querySelectorAll('#filters button.chip')].map(x => x.getAttribute('aria-pressed')), !!document.querySelector('#filters .filter-all'), ds.store.get('check-filters')]);
  assert(same(r, [[['a']], ['false', 'true'], true, { a: true }]), 'ds.filters: l’œil garde une ligne seule, « Tout » paraît, retenu sur l’appareil', r);
  await p.evaluate(() => document.querySelector('#filters .filter-all').click());
  r = await p.evaluate(() => [changes.length, document.querySelectorAll('#filters button.chip[aria-pressed="true"]').length]);
  assert(same(r, [2, 2]), 'ds.filters: « Tout » rallume le groupe', r);
  r = await p.evaluate(() => {
    window.removed = []; ds.filterChips('#chips', [{ key: 'compte', label: '2 comptes' }, { key: 'sens', label: 'Sorties' }], { onRemove: k => removed.push(k), onClear: () => removed.push('*') });
    const el = document.getElementById('chips');
    el.querySelector('[data-k="sens"]').click(); el.querySelector('[data-k="*"]').click();
    const shown = [el.hidden, el.className, el.querySelectorAll('.btn.is-pill.fchip').length, el.querySelector('.fchip').getAttribute('aria-label')];
    ds.filterChips('#chips', []);
    return [shown, removed, el.hidden];
  });
  assert(same(r, [[false, 'filter-chips', 2, 'Enlever le filtre « 2 comptes »'], ['sens', '*'], true]), 'ds.filterChips: des pastilles dorées, « Tout effacer », cachées quand il n’y en a pas', r);

  assert(!errors.length, 'aucune erreur dans la page', errors);
  await b.close();
  server.close();
})();
