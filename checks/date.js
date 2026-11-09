// The date picker and the two new charts in a real browser: the quick periods, each unit, two dates in two taps, the
// steps, the keys, the English words; the donut's slices, legend and choice; the paired bars' marks; the calendar's month
// jump, now the date picker.
// usage: node checks/date.js (Playwright installed); it serves the repository itself on a free port
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
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/date.html');
  await p.waitForFunction(() => window.ready);
  const pop = '#pop';
  const last = () => p.evaluate(() => { const v = picks[picks.length - 1]; return v && { from: v.from, to: v.to, mode: v.mode, quick: v.quick && v.quick.label, label: v.label }; });
  const state = () => p.evaluate(() => {
    const box = document.getElementById('pop'), grid = box.querySelector('.dp-grid');
    return { hidden: box.hidden, expanded: document.getElementById('title').getAttribute('aria-expanded'), tab: (box.querySelector('.dp-tabs [aria-selected="true"]') || {}).textContent,
      head: (box.querySelector('.dp-title') || {}).textContent, on: [...box.querySelectorAll('.dp-grid button.on')].map(x => x.textContent),
      cells: grid ? grid.querySelectorAll('button').length : 0, focus: document.activeElement.dataset.key || document.activeElement.id || document.activeElement.getAttribute('data-dp') };
  });
  const cell = text => p.locator(pop + ' .dp-grid button', { hasText: new RegExp('^' + text + '$') });
  const tab = text => p.locator(pop + ' .dp-tabs button', { hasText: text });

  // shut at first; the title opens it on this month, its quick period lit, the focus on the month
  const s0 = await p.evaluate(() => { const t = document.getElementById('title'), box = document.getElementById('pop');
    return [box.hidden, t.getAttribute('aria-expanded'), t.getAttribute('aria-haspopup'), t.getAttribute('aria-controls') === box.id, box.getAttribute('role'), box.className]; });
  await p.locator('#title').click();
  const s1 = await state();
  const open1 = await p.evaluate(() => { const box = document.getElementById('pop');
    return { quick: [...box.querySelectorAll('.dp-quick button')].map(x => x.textContent + (x.classList.contains('on') ? '*' : '')), tabs: [...box.querySelectorAll('.dp-tabs button')].map(x => x.textContent).join(' '),
      off: [...box.querySelectorAll('.dp-grid button:disabled')].map(x => x.textContent), today: box.querySelector('.dp-grid .is-today').textContent, year: box.querySelector('.dp-head .dp-title').textContent,
      next: box.querySelector('[data-dp="next"]').disabled, label: dp.label() }; });
  console.log('      ' + JSON.stringify([s1, open1]));
  assert(same(s0, [true, 'false', 'dialog', true, 'dialog', 'periodpop datepick']) && !s1.hidden && s1.expanded === 'true' && s1.tab === 'Mois' && same(s1.on, ['nov.']) && s1.cells === 12 && s1.focus === '2026-11'
    && same(open1.quick, ['Toutes les dates', 'Ce mois-ci*', 'Le mois dernier', '3 derniers mois', 'Cette année']) && open1.tabs === 'Jour Mois Année Dates'
    && same(open1.off, ['déc.']) && open1.today === 'nov.' && open1.year === '2026' && open1.next && open1.label === 'novembre 2026',
    'fermé au départ ; le titre l’ouvre sur ce mois, sa période rapide allumée, le curseur sur le mois ; après aujourd’hui, rien');

  // a quick period: taken at once, the picker shut, the focus back on the title
  await p.locator(pop + ' .dp-quick button', { hasText: 'Le mois dernier' }).click();
  const q1 = await last(), s2 = await state();
  await p.locator('#title').click();
  await p.locator(pop + ' .dp-quick button', { hasText: '3 derniers mois' }).click();
  const q2 = await last();
  await p.locator('#title').click();
  const s3 = await state();
  await p.locator(pop + ' .dp-quick button', { hasText: 'Toutes les dates' }).click();
  const q3 = await last();
  assert(same(q1, { from: '2026-10-01', to: '2026-10-31', mode: 'month', quick: 'Le mois dernier', label: 'octobre 2026' }) && s2.hidden && s2.expanded === 'false' && s2.focus === 'title'
    && same(q2, { from: '2026-09-01', to: '2026-11-30', mode: 'range', quick: '3 derniers mois', label: '3 derniers mois' }) && s3.tab === 'Dates' && same(s3.on, ['30'])
    && same(q3, { from: null, to: null, mode: 'all', quick: 'Toutes les dates', label: 'Toutes les dates' }),
    'les périodes rapides : prises tout de suite, le choix fermé, le curseur rendu au titre ; un mois, trois mois (dits par leur nom), toutes les dates ' + JSON.stringify([q2, s3.on]));

  // the months: the year steps by its arrows, written between them, a month is taken
  await p.locator('#title').click();
  const m0 = await state();
  await p.locator(pop + ' [data-dp="prev"]').click();
  const m1 = await state();
  for (let i = 0; i < 6; i++) await p.locator(pop + ' [data-dp="prev"]').click();
  const m2 = await state();
  await cell('mars').click();
  const m3 = await last();
  assert(m0.tab === 'Mois' && m0.head === '2026' && m0.on.length === 0 && m1.head === '2025' && m1.focus === 'prev' && m2.head === '2019' && m2.focus === 'prev'
    && same(m3, { from: '2019-03-01', to: '2019-03-31', mode: 'month', quick: null, label: 'mars 2019' }),
    'les mois : toutes les dates ouvrent sur ceux de cette année ; l’année écrite entre les flèches, qui en changent, un mois est pris');

  // the days: a month of days from Monday, today ringed, nothing after it; a day is taken
  await p.evaluate(() => dp.set({ from: '2026-11-01', to: '2026-11-30' }));
  await p.locator('#title').click();
  await tab('Jour').click();
  const d0 = await p.evaluate(() => { const g = document.querySelector('#pop .dp-grid');
    return { wd: [...g.querySelectorAll('.dp-wd')].map(x => x.textContent).join(''), blanks: g.querySelectorAll(':scope > span:not(.dp-wd)').length, days: g.querySelectorAll('button').length,
      today: g.querySelector('.is-today').getAttribute('aria-current') + ' ' + g.querySelector('.is-today').textContent, off: g.querySelectorAll('button:disabled').length,
      head: document.querySelector('#pop .dp-title').textContent, label: g.querySelector('[data-key="2026-11-05"]').getAttribute('aria-label'), focus: document.activeElement.getAttribute('data-dp') }; });
  await cell('5').click();
  const d1 = await last();
  assert(d0.wd === 'LMMJVSD' && d0.blanks === 6 && d0.days === 30 && d0.today === 'date 9' && d0.off === 21 && d0.head === 'novembre 2026' && d0.label === 'jeudi 5 novembre 2026' && d0.focus === 't-day'
    && same(d1, { from: '2026-11-05', to: '2026-11-05', mode: 'day', quick: null, label: 'jeudi 5 novembre 2026' }),
    'les jours : le mois depuis le lundi, aujourd’hui cerclé, rien après lui ; un jour est pris ' + JSON.stringify(d0));

  // the years: those between min and max, a year taken
  await p.locator('#title').click();
  const y0 = await state();
  await tab('Année').click();
  const y1 = await p.evaluate(() => ({ years: [...document.querySelectorAll('#pop .dp-grid button')].map(x => x.textContent).join(' '), head: document.querySelector('#pop .dp-title').textContent,
    arrows: [...document.querySelectorAll('#pop .dp-step')].map(x => x.disabled) }));
  await cell('2024').click();
  const y2 = await last();
  assert(y0.tab === 'Jour' && same(y0.on, ['5']) && y0.focus === '2026-11-05' && y1.years === '2017 2018 2019 2020 2021 2022 2023 2024 2025 2026' && y1.head === '2017 – 2026' && same(y1.arrows, [true, true])
    && same(y2, { from: '2024-01-01', to: '2024-12-31', mode: 'year', quick: null, label: '2024' }), 'les années : de 2017 à aujourd’hui, une année est prise');

  // two dates in two taps, in either order; the days between follow the pointer
  await p.evaluate(() => dp.set({ from: '2026-11-09', to: '2026-11-09' }));
  await p.locator('#title').click();
  await tab('Dates').click();
  const r0 = await p.evaluate(() => document.querySelector('#pop .dp-hint').textContent);
  await cell('7').click();
  await cell('3').hover();
  const r1 = await p.evaluate(() => ({ hint: document.querySelector('#pop .dp-hint').textContent, open: !document.getElementById('pop').hidden, on: [...document.querySelectorAll('#pop .dp-grid button.on')].map(x => x.textContent),
    between: [...document.querySelectorAll('#pop .dp-grid button.is-in')].map(x => x.textContent), n: picks.length }));
  await cell('3').click();
  const r2 = await last();
  await p.locator('#title').click();
  const r3 = await p.evaluate(() => ({ tab: document.querySelector('#pop .dp-tabs [aria-selected="true"]').textContent, on: [...document.querySelectorAll('#pop .dp-grid button.on')].map(x => x.textContent),
    between: [...document.querySelectorAll('#pop .dp-grid button.is-in')].map(x => x.textContent) }));
  assert(r0 === 'Choisissez le premier jour, puis le dernier.' && r1.hint === 'Du 7 nov. : choisissez le dernier jour.' && r1.open && same(r1.on, ['7']) && same(r1.between, ['4', '5', '6'])
    && same(r2, { from: '2026-11-03', to: '2026-11-07', mode: 'range', quick: null, label: '3 nov. → 7 nov. 2026' }) && r3.tab === 'Dates' && same(r3.on, ['3', '7']) && same(r3.between, ['4', '5', '6']),
    'deux dates en deux touches, dans n’importe quel ordre : le premier jour gardé, les jours entre suivent le pointeur, puis la période ' + JSON.stringify(r1));
  // Escape forgets the first day, then shuts the picker
  await cell('12').click().catch(() => {});
  await cell('2').click();
  await p.keyboard.press('Escape');
  const e1 = await p.evaluate(() => [document.getElementById('pop').hidden, document.querySelector('#pop .dp-hint').textContent, document.querySelectorAll('#pop .dp-grid button.on').length]);
  await p.keyboard.press('Escape');
  const e2 = await state();
  assert(!e1[0] && e1[1] === 'Choisissez le premier jour, puis le dernier.' && e1[2] === 2 && e2.hidden && e2.focus === 'title', 'Échap oublie le premier jour, puis ferme le choix et rend le curseur au titre');

  // the steps: a period moves by its own length, never past today
  const st = await p.evaluate(() => {
    const out = {};
    dp.set({ from: '2026-11-03', to: '2026-11-07' });
    out.range = [dp.step(-1), dp.canStep(1)].map(v => typeof v === 'object' && v ? v.from + '/' + v.to : v);
    dp.set({ from: '2026-11-01', to: '2026-11-30' });
    out.month = [dp.canStep(1), dp.step(1), dp.canStep(-1), (dp.step(-1) || {}).label];
    dp.set({ from: '2026-11-09', to: '2026-11-09' });
    out.day = [dp.canStep(1), dp.step(-1).from];
    dp.set({ from: '2017-01-01', to: '2017-12-31' });
    out.year = [dp.canStep(-1), dp.canStep(1)];
    dp.set({});
    out.all = [dp.canStep(-1), dp.step(1), dp.label()];
    dp.set({ from: '2026-09-01', to: '2026-11-30' });
    out.quick = dp.label();
    const P = ds.datePick, o = v => v && v.from + '/' + v.to + '/' + v.mode;
    out.fn = [o(P.step({ from: '2026-09-01', to: '2026-11-30' }, 1)), o(P.step({ from: '2026-01-01', to: '2026-12-31' }, -1)), o(P.step({ from: '2028-02-29', to: '2028-02-29' }, 1)),
      o(P.step({ from: '2026-01-31', to: '2026-01-31', mode: 'day' }, 1)), P.step({ from: '2026-11-01' }, 1), o(P.of('month', '2028-02-10')), P.kind({ from: '2026-11-01', to: '2026-11-30' }),
      P.kind({ from: '2026-11-01', to: '2026-12-31' }), P.kind(null), P.label({ from: '2026-09-01', to: '2026-11-30' }), P.label({ from: '2025-12-01', to: '2026-02-28' }),
      P.label({ from: '2025-12-30', to: '2026-01-02' }), P.label({ from: '2026-11-01' }), P.label({ to: '2026-11-01' }), P.label({ from: '2026-11-09', to: '2026-11-09', mode: 'range' })];
    return out;
  });
  console.log('      ' + JSON.stringify(st));
  assert(same(st.range, ['2026-10-29/2026-11-02', true]) && same(st.month, [false, null, true, 'octobre 2026']) && same(st.day, [false, '2026-11-08']) && same(st.year, [false, true])
    && same(st.all, [false, null, 'Toutes les dates']) && st.quick === '3 derniers mois',
    'les pas : une période avance de sa propre longueur (cinq jours, un mois, un jour), jamais au-delà d’aujourd’hui ni avant 2017 ; toutes les dates ne bougent pas');
  assert(same(st.fn, ['2026-12-01/2027-02-28/range', '2025-01-01/2025-12-31/year', '2028-03-01/2028-03-01/day', '2026-02-01/2026-02-01/day', null, '2028-02-01/2028-02-29/month', 'month', 'range', 'all',
    'septembre → novembre 2026', 'décembre 2025 → février 2026', '30 déc. 2025 → 2 janv. 2026', 'depuis le 1er nov. 2026', 'jusqu’au 1er nov. 2026', 'lundi 9 novembre 2026']),
    'sans choix ouvert : trois mois avancent de trois, une année, un jour (29 février compris) ; le mois d’un jour ; les noms des périodes ' + JSON.stringify(st.fn));
  // the page's arrows beside the title step through onPick
  await p.evaluate(() => dp.set({ from: '2026-10-01', to: '2026-10-31' }));
  const n0 = await p.evaluate(() => picks.length);
  await p.locator('#prev').click();
  const ar = await p.evaluate(() => [picks.length, document.getElementById('label').textContent, dp.get().from]);
  assert(ar[0] === n0 + 1 && ar[1] === 'septembre 2026' && ar[2] === '2026-09-01', 'les flèches de la page avancent d’une période et le disent à onPick');

  // the keys: arrows through the days and across months, Page Down, Home, Enter; then the tabs
  await p.evaluate(() => dp.set({ from: '2026-11-05', to: '2026-11-05' }));
  await p.locator('#title').click();
  const k0 = await state();
  await p.keyboard.press('ArrowRight');
  const k1 = await state();
  await p.keyboard.press('ArrowUp');
  const k2 = await state();
  await p.keyboard.press('PageDown');
  const k3 = await state();
  await p.keyboard.press('ArrowLeft');
  await p.keyboard.press('Home');
  const k4 = await state();
  await p.keyboard.press('Enter');
  const k5 = await last(), k6 = await state();
  assert(k0.focus === '2026-11-05' && k1.focus === '2026-11-06' && k2.focus === '2026-10-30' && k2.head === 'octobre 2026' && k3.focus === '2026-11-09' && k3.head === 'novembre 2026'
    && k4.focus === '2026-11-02' && k5.from === '2026-11-02' && k5.mode === 'day' && k6.hidden && k6.focus === 'title',
    'au clavier : les flèches de jour en jour et d’un mois à l’autre, Page suivante jusqu’à aujourd’hui au plus, Début au lundi, Entrée prend le jour ' + JSON.stringify([k2, k3, k4]));
  await p.locator('#title').click();
  await p.locator(pop + ' [data-dp="t-day"]').focus();
  await p.keyboard.press('ArrowRight');
  const t1 = await state();
  await p.keyboard.press('ArrowRight');
  await p.keyboard.press('ArrowRight');
  await p.keyboard.press('ArrowRight');
  const t2 = await state();
  await p.keyboard.press('Tab');
  const t3 = await p.evaluate(() => document.activeElement.getAttribute('data-dp'));
  await p.keyboard.press('Escape');
  const t4 = await state();
  assert(t1.tab === 'Mois' && t1.focus === 't-month' && t2.tab === 'Jour' && t2.focus === 't-day' && t3 === 'prev' && t4.hidden && t4.focus === 'title',
    'au clavier, les onglets : les flèches passent d’une unité à l’autre, en boucle ; Tab va aux flèches ; Échap ferme');
  // a tap elsewhere shuts it
  await p.locator('#title').click();
  await p.locator('#outside').click();
  const out1 = await state();
  assert(out1.hidden && out1.expanded === 'false', 'un clic ailleurs ferme le choix');

  // in the page: always there, two taps for a trip's dates
  const i0 = await p.evaluate(() => { const box = document.getElementById('inline');
    return [box.hidden, box.classList.contains('is-inline'), box.getAttribute('role'), box.querySelectorAll('.dp-tabs').length, box.querySelector('.dp-title').textContent, inline.label(),
      [...box.querySelectorAll('.dp-grid button.on')].map(x => x.textContent), box.querySelectorAll('.dp-grid button.is-in').length, getComputedStyle(box).position]; });
  await p.locator('#inline .dp-grid button', { hasText: /^10$/ }).click();
  await p.locator('#inline .dp-grid button', { hasText: /^12$/ }).click();
  const i1 = await p.evaluate(() => [JSON.stringify(inlinePicks.map(v => v.from + '/' + v.to)), document.getElementById('inline').hidden, [...document.querySelectorAll('#inline .dp-grid button.on')].map(x => x.textContent),
    [...document.querySelectorAll('#inline .dp-grid button.is-in')].map(x => x.textContent), document.activeElement.dataset.key]);
  assert(same(i0, [false, true, 'group', 0, 'août 2026', '1er août → 16 août 2026', ['1', '16'], 14, 'static']) && same(i1, ['["2026-08-10/2026-08-12"]', false, ['10', '12'], ['11'], '2026-08-10']),
    'dans la page : toujours là, sans onglets pour une seule unité ; deux touches pour les dates d’un voyage ' + JSON.stringify([i0, i1]));

  // in English
  const en = await p.evaluate(() => {
    document.documentElement.lang = 'en';
    const holder = document.createElement('div'); document.body.append(holder);
    const x = ds.datePick(holder, { today: '2026-11-09', value: { from: '2026-11-01', to: '2026-11-30' } });
    const out = { tabs: [...holder.querySelectorAll('.dp-tabs button')].map(b => b.textContent).join(' '), month: holder.querySelector('.dp-grid .on').textContent,
      prev: holder.querySelector('[data-dp="prev"]').getAttribute('aria-label'), name: holder.getAttribute('aria-label') };
    holder.querySelector('[data-dp="t-day"]').click();
    out.wd = [...holder.querySelectorAll('.dp-wd')].map(s => s.textContent).join('');
    out.head = holder.querySelector('.dp-title').textContent;
    holder.querySelector('[data-dp="t-range"]').click();
    out.first = holder.querySelector('.dp-hint').textContent;
    holder.querySelector('[data-key="2026-11-03"]').click();
    out.last = holder.querySelector('.dp-hint').textContent;
    out.labels = [ds.datePick.label({ from: '2026-11-09', to: '2026-11-09' }), ds.datePick.label({}), ds.datePick.label({ from: '2026-11-03', to: '2026-11-07' }), ds.datePick.label({ from: '2026-11-01' }), x.label()];
    document.documentElement.lang = 'fr'; holder.remove();
    return out;
  });
  assert(same(en, { tabs: 'Day Month Year Dates', month: 'Nov', prev: 'Previous year', name: 'Choose the period', wd: 'MTWTFSS', head: 'November 2026', first: 'Pick the first day, then the last.',
    last: 'From 3 Nov: pick the last day.', labels: ['Monday, 9 November 2026', 'All dates', '3 Nov → 7 Nov 2026', 'since 1 Nov 2026', 'November 2026'] }), 'en anglais : les unités, les mois, les jours, les consignes, les noms des périodes ' + JSON.stringify(en));

  // the donut: a slice per category but the empty one, the legend, the total in the hole
  const dn = await p.evaluate(() => { const d = document.getElementById('donut');
    return { slices: d.querySelectorAll('.chart-donut-slice').length, rows: [...d.querySelectorAll('.chart-donut-row')].map(r => r.textContent), buttons: d.querySelectorAll('button.chart-donut-row').length,
      fill: getComputedStyle(d.querySelector('.chart-donut-slice')).fill, fill2: getComputedStyle(d.querySelectorAll('.chart-donut-slice')[1]).fill, key: getComputedStyle(d.querySelector('.chart-key')).backgroundColor,
      center: d.querySelector('.chart-donut-c').textContent, tab: [...d.querySelectorAll('.chart-donut-slice')].map(x => x.getAttribute('tabindex')).join(''), role: d.querySelector('.chart-donut-slice').getAttribute('role'),
      label: d.querySelector('.chart-donut-slice').getAttribute('aria-label'), returned: donut === d.firstElementChild }; });
  console.log('      ' + JSON.stringify(dn));
  assert(dn.slices === 5 && same(dn.rows, ['Logement50%850,00€', 'Courses24%412,30€', 'Loisirs14%236,80€', 'Déplacements10%164,30€', 'Soins1%25,00€']) && dn.buttons === 5
    && dn.fill === 'rgb(155, 140, 242)' && dn.fill2 === 'rgb(78, 201, 138)' && dn.key === 'rgb(155, 140, 242)' && dn.center === '1 688,40€dépensés' && dn.tab === '0-1-1-1-1'
    && dn.role === 'button' && dn.label === 'Logement · 850,00€ · 50%' && dn.returned, 'le donut : une part par catégorie, sauf la vide, aux couleurs des jetons ; la légende (couleur, nom, part, montant) ; le total au centre');
  await p.locator('#donut .chart-donut-slice').nth(1).click();
  await p.waitForTimeout(400);
  const dc = await p.evaluate(() => { const d = document.querySelector('#donut .chart-donut');
    return [JSON.stringify(slices), d.classList.contains('has-on'), d.querySelector('.chart-donut-slice.is-on').getAttribute('aria-pressed'), d.querySelector('.chart-donut-row.is-on').textContent,
      d.querySelector('.chart-donut-c').textContent, getComputedStyle(d.querySelectorAll('.chart-donut-slice')[0]).opacity, d.querySelectorAll('.chart-donut-slice')[1].getAttribute('tabindex')]; });
  await p.locator('#donut .chart-donut-slice').nth(1).focus();
  await p.keyboard.press('ArrowRight');
  const kf = await p.evaluate(() => document.activeElement === document.querySelectorAll('#donut .chart-donut-slice')[2]);
  await p.keyboard.press('Enter');
  await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft');
  const kw = await p.evaluate(() => document.activeElement === document.querySelectorAll('#donut .chart-donut-slice')[4]);
  await p.locator('#donut .chart-donut-row', { hasText: 'Loisirs' }).click();
  await p.waitForTimeout(400);
  const dz = await p.evaluate(() => { const d = document.querySelector('#donut .chart-donut');
    return [JSON.stringify(slices), d.classList.contains('has-on'), d.querySelectorAll('.is-on').length, d.querySelector('.chart-donut-c').textContent, getComputedStyle(d.querySelectorAll('.chart-donut-slice')[0]).opacity]; });
  assert(same(dc, ['["courses"]', true, 'true', 'Courses24%412,30€', '412,30€Courses', '0.35', '0']) && kf && kw
    && same(dz, ['["courses","loisirs",null]', false, 0, '1 688,40€dépensés', '1']),
    'un clic choisit une part : elle sort, les autres pâlissent, sa ligne en or, son montant au centre ; au clavier les flèches font le tour, Entrée choisit ; un autre clic la rend ' + JSON.stringify([dc, dz]));
  const dp2 = await p.evaluate(() => { const d = document.getElementById('donut-plain');
    return [d.querySelectorAll('button').length, d.querySelector('svg').getAttribute('role'), d.querySelector('svg').getAttribute('aria-label'), d.querySelector('.chart-donut-c').textContent,
      d.querySelector('.chart-donut-slice').hasAttribute('tabindex'), donutNone === null && !document.getElementById('donut-none').children.length]; });
  assert(same(dp2, [0, 'img', 'Logement · 850 · 67%, Courses · 412 · 33%', '12catégories', false, true]), 'sans pick, une image qui se dit ; le centre peut dire autre chose que le total ; rien à montrer, rien de dessiné ' + JSON.stringify(dp2));

  // the paired bars: two bars a month, in the colours of money in and out, a legend that adds them up
  const pb = await p.evaluate(() => {
    const cols = [...document.querySelectorAll('#pairs .chart-bar')], first = cols[0].querySelectorAll('.chart-bar-fill');
    return { pairs: pairs.classList.contains('is-pairs'), n: cols.length, fills: cols.map(c => c.querySelectorAll('.chart-bar-fill').length).join(''), h: [first[0].style.height, first[1].style.height],
      in: getComputedStyle(first[0].querySelector('i')).backgroundColor, out: getComputedStyle(first[1].querySelector('i')).backgroundColor,
      ticks: [...document.querySelectorAll('#pairs .chart-bars-axis span')].map(s => s.textContent), legend: [...document.querySelectorAll('#pairs .chart-bars-legend span')].map(s => s.textContent),
      title: cols[11].title, figs: [...cols[11].querySelectorAll('.chart-bar-v')].map(s => s.textContent), shown: getComputedStyle(cols[11].querySelector('.chart-bar-vs')).visibility,
      hidden: getComputedStyle(cols[0].querySelector('.chart-bar-vs')).visibility, live: cols[11].classList.contains('is-live'), figColor: (c => { const x = document.createElement('canvas').getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, 1, 1); const d = x.getImageData(0, 0, 1, 1).data; return 'rgb(' + d[0] + ', ' + d[1] + ', ' + d[2] + ')'; })(getComputedStyle(cols[11].querySelector('.chart-bar-v')).color) };
  });
  console.log('      ' + JSON.stringify(pb));
  await p.locator('#pairs .chart-bar').nth(4).click();
  const pk = await p.evaluate(() => [JSON.stringify(months), document.querySelector('#pairs .chart-bar.is-on .chart-bar-l').textContent, getComputedStyle(document.querySelector('#pairs .chart-bar.is-on .chart-bar-vs')).visibility]);
  const plain = await p.evaluate(() => { const x = ds.chart.bars(null, [{ key: 'a', value: 3 }, { key: 'b', value: 5 }]); return [x.classList.contains('is-pairs'), x.querySelectorAll('.chart-bars-legend, .chart-bar-vs').length, x.querySelectorAll('.chart-bar-fill').length]; });
  assert(pb.pairs && pb.n === 12 && pb.fills === '222222222222' && same(pb.h, ['50%', '33.33%']) && pb.in === 'rgb(78, 201, 138)' && pb.out === 'rgb(232, 104, 107)'
    && same(pb.ticks, ['0', '2k€', '4k€', '6k€']) && same(pb.legend, ['Entrées42 600€', 'Sorties27 300€']) && pb.title === 'nov · Entrées 4 100€ · Sorties 2 550€ (en cours)'
    && same(pb.figs, ['4,1k', '2,6k']) && pb.shown === 'visible' && pb.hidden === 'hidden' && pb.live && pb.figColor === 'rgb(78, 201, 138)'
    && same(pk, ['["2026-04"]', 'avr', 'visible']) && same(plain, [false, 0, 2]),
    'les barres en paires : deux par mois aux couleurs des entrées et des sorties, la légende qui les additionne, les chiffres du mois choisi ; les barres simples ne changent pas ' + JSON.stringify(pk));

  // the calendar's month jump is the date picker on months
  await p.locator('#cal .periodtitle').click();
  const cj = await p.evaluate(() => { const j = document.querySelector('#cal .cal-jump');
    return [j.classList.contains('datepick'), j.querySelectorAll('.dp-tabs').length, j.querySelectorAll('.cal-months button').length, j.querySelector('.cal-months .on').textContent, j.querySelector('.dp-head .dp-title').textContent]; });
  await p.locator('#cal .dp-step[aria-label="Année suivante"]').click();
  await p.locator('#cal .cal-months button', { hasText: 'janv.' }).click();
  const cj2 = await p.evaluate(() => [document.querySelector('#cal .periodtitle h3').textContent, cal.state().day, document.querySelector('#cal .cal-jump').hidden]);
  assert(same(cj, [true, 0, 12, 'nov.', '2026']) && same(cj2, ['janvier 2027', '2027-01-01', true]), 'le choix du mois du calendrier est ds.datePick sur les mois : la flèche passe à 2027, janvier y mène');

  // vitrine: square corners, the same colours from the tokens
  await p.evaluate(() => { document.documentElement.dataset.theme = 'vitrine'; });
  await p.locator('#title').click();
  const vt = await p.evaluate(() => [getComputedStyle(document.getElementById('pop')).borderRadius, getComputedStyle(document.querySelector('#pop .dp-grid button')).borderRadius,
    getComputedStyle(document.querySelector('#donut .chart-donut-slice')).fill, getComputedStyle(document.querySelector('#pairs .chart-bar-fill i')).backgroundColor]);
  await p.keyboard.press('Escape');
  await p.evaluate(() => { document.documentElement.dataset.theme = 'atelier'; });
  assert(same(vt, ['0px', '0px', 'rgb(155, 140, 242)', 'rgb(179, 150, 84)']), 'Vitrine : les angles carrés, les couleurs de ses jetons (l’or foncé des entrées) ' + JSON.stringify(vt));

  const steady = () => p.evaluate(() => { const r = id => Math.round(document.getElementById(id).getBoundingClientRect().top);
    const off = document.getElementById('steady-prev').classList.contains('off');
    return { off, title: r('steady-title'), after: r('steady-after'), arrows: getComputedStyle(document.querySelector('#steady .periodnav')).visibility }; });
  const flip = () => p.evaluate(() => ['steady-prev', 'steady-next'].forEach(id => document.getElementById(id).classList.toggle('off')));
  // steady: the arrows hidden keep their room; shown, nothing under the title moves
  const sd0 = await steady(); await flip(); const sd1 = await steady(); await flip();
  assert(sd0.off && sd0.arrows === 'hidden' && !sd1.off && sd1.arrows === 'visible' && sd0.title === sd1.title && sd0.after === sd1.after,
    'stable : les flèches cachées gardent leur place ; montrées, rien ne bouge sous le titre ' + JSON.stringify([sd0, sd1]));
  // on a phone: the picker within the screen, the tabs whole, the donut over its legend, nothing wider than the screen
  await p.setViewportSize({ width: 375, height: 812 });
  await p.locator('#title').click();
  await p.waitForTimeout(100);
  const ph = await p.evaluate(() => { const r = document.getElementById('pop').getBoundingClientRect();
    return { left: r.left, right: r.right, tabs: [...document.querySelectorAll('#pop .dp-tabs button')].every(x => x.scrollWidth <= x.clientWidth), donut: getComputedStyle(document.querySelector('#donut .chart-donut')).gridTemplateColumns.split(' ').length,
      ring: document.querySelector('#donut .chart-donut-ring').getBoundingClientRect().width, wide: document.documentElement.scrollWidth }; });
  console.log('      ' + JSON.stringify(ph));
  assert(ph.left >= 0 && ph.right <= 375 && ph.tabs && ph.donut === 1 && ph.ring <= 220 && ph.wide <= 375, 'sur téléphone : le choix tient dans l’écran, ses onglets entiers ; le donut au-dessus de sa légende ; rien ne dépasse');
  await p.keyboard.press('Escape');
  const sp0 = await steady(); await flip(); const sp1 = await steady(); await flip();
  const line = await p.evaluate(() => { const t = document.getElementById('steady-title').getBoundingClientRect(), n = document.querySelector('#steady .periodnav').getBoundingClientRect();
    return n.top < t.bottom && n.left > t.right; });
  assert(sp0.title === sp1.title && sp0.after === sp1.after && line, 'stable, sur téléphone : les flèches sur la ligne du titre, et rien ne bouge quand elles paraissent ' + JSON.stringify([sp0, sp1, line]));
  assert(errors.length === 0, 'aucune erreur dans la page ' + errors.join(' '));
  await b.close();
  server.close();
})();
