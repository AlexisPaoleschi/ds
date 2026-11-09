// Studio's components in a real browser: the calendar and its views, the charts and their marks, the rankings, mini-tiles,
// verdicts and period selector, the « new version » light, the live stream and the device's copy.
// usage: node checks/studio.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2' };
// the server's live stream: refused once (a restart), then open, telling the version on line and a change
let streams = 0, polls = 0;
const server = http.createServer((req, res) => {
  if (req.url === '/api/stream') {
    streams += 1;
    if (streams === 1) { res.writeHead(503); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write('event: version\ndata: {"version":"2.18.0"}\n\n');
    res.write('event: changed\ndata: {"changed":5}\n\n');
    res.write('event: jobs\ndata: plain words\n\n');
    return;
  }
  if (req.url === '/api/status') { polls += 1; res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"changed":5}'); }
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };
(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/studio.html');
  await p.waitForFunction(() => window.ready);

  // the calendar: a month of cells from Monday, today and the selected day, a cell's lines and its « +N »
  const month = await p.evaluate(() => {
    const cells = [...document.querySelectorAll('#cal .cal-cell')], t = document.querySelector('#cal .cal-cell.is-today'), busy = document.querySelector('.cal-cell[data-day="2026-11-12"]');
    const nine = document.querySelector('.cal-cell[data-day="2026-11-09"]');
    return { title: document.querySelector('#cal .periodtitle h3').textContent, cells: cells.length, first: cells[0].dataset.day, off: cells.filter(c => c.classList.contains('is-off')).length,
      today: t.dataset.day, sel: document.querySelector('#cal .cal-cell.is-sel').dataset.day, current: t.getAttribute('aria-current'), dow: document.querySelector('.cal-dow').textContent,
      lines: busy.querySelectorAll('.cal-line').length, more: busy.querySelector('.cal-more').textContent, dots: busy.querySelector('.cal-more-dots').textContent,
      marks: [...nine.querySelectorAll('.cal-mark')].map(m => m.className), codes: [...nine.querySelectorAll('.cal-code')].map(c => c.textContent), count: nine.querySelector('.cal-count').textContent,
      late: nine.querySelector('.cal-line.is-late .cal-lt').textContent, timed: [...nine.querySelectorAll('.cal-lt')].map(x => x.textContent),
      color: getComputedStyle(nine.querySelector('.cal-mark')).backgroundColor, label: nine.getAttribute('aria-label') };
  });
  console.log('      ' + JSON.stringify(month));
  assert(month.title === 'novembre 2026' && month.cells === 42 && month.first === '2026-10-26' && month.off === 12 && month.today === '2026-11-09' && month.sel === '2026-11-09'
    && month.current === 'date' && month.dow === 'lunmarmerjeuvensamdim', 'le mois : six semaines entières depuis le lundi, les jours d’octobre et de décembre estompés, aujourd’hui choisi');
  assert(month.lines === 8 && month.more === '+2' && month.dots === '+7', 'une case pleine : huit lignes puis « +2 » ; sur téléphone trois points puis « +7 »');
  assert(JSON.stringify(month.marks) === JSON.stringify(['cal-mark', 'cal-mark is-open', 'cal-mark is-thick', 'cal-mark is-bar', 'cal-mark is-dot'])
    && JSON.stringify(month.codes) === '["P","IG"]' && month.count === '2/4' && month.late === 'Preview Léa' && month.color === 'rgb(73, 143, 238)',
    'les marques : carré plein ou vide, barre fine ou épaisse, point ; les codes, le compte, le retard en rouge, la couleur du jeton');
  assert(month.timed.includes('10h00 Shooting Zoé') && month.timed.includes('Série Irina') && month.label === 'lundi 9 novembre, 5 éléments', 'dans une case, l’heure des seules barres ; la case dit son jour et combien');
  const panel1 = await p.evaluate(() => { const d = document.querySelector('#cal .cal-day'); return { t: d.querySelector('.cal-day-t').textContent, today: d.classList.contains('is-today'), rows: d.querySelectorAll('ul.rows > li').length,
    late: d.querySelector('.late').textContent, place: d.querySelector('.pl').textContent, time: d.querySelector('.t').textContent }; });
  assert(panel1.t === 'lundi 9 novembre' && panel1.today && panel1.rows === 5 && panel1.late === 'pas publié' && panel1.place === 'Annecy' && panel1.time === '16h00', 'le panneau du jour choisi, sous le mois : son titre, une ligne par élément');
  await p.locator('.cal-cell[data-day="2026-11-12"]').click();
  const panel2 = await p.evaluate(() => ({ t: document.querySelector('#cal .cal-day-t').textContent, rows: document.querySelectorAll('#cal .cal-day ul.rows > li').length,
    done: document.querySelectorAll('#cal .cal-day li.is-done').length, sel: document.querySelector('.cal-cell.is-sel').dataset.day, focus: document.activeElement.dataset.day, change: changes[changes.length - 1] }));
  assert(panel2.t === 'jeudi 12 novembre' && panel2.rows === 10 && panel2.done === 5 && panel2.sel === '2026-11-12' && panel2.focus === '2026-11-12'
    && JSON.stringify(panel2.change) === JSON.stringify({ view: 'month', day: '2026-11-12', from: '2026-10-26', to: '2026-12-07' }), 'un clic sur une case ouvre son jour en dessous, garde le curseur, et dit la période à lire');
  // the arrows, « Aujourd’hui », the month picker
  const title = () => p.evaluate(() => document.querySelector('#cal .periodtitle h3').textContent);
  await p.locator('#cal button[aria-label="Suivant"]').click();
  const next = await title();
  await p.locator('#cal button[aria-label="Précédent"]').click(); await p.locator('#cal button[aria-label="Précédent"]').click();
  const prev = await title();
  await p.locator('#cal .cal-nav .btn', { hasText: 'Aujourd’hui' }).click();
  const back = await p.evaluate(() => [document.querySelector('#cal .periodtitle h3').textContent, cal.state().day]);
  assert(next === 'décembre 2026' && prev === 'octobre 2026' && back[0] === 'novembre 2026' && back[1] === '2026-11-09', 'les flèches changent de mois, « Aujourd’hui » ramène au jour');
  await p.locator('#cal .periodtitle').click();
  const open = await p.evaluate(() => [!document.querySelector('.cal-jump').hidden, document.querySelector('#cal .periodtitle').getAttribute('aria-expanded'), document.querySelectorAll('.cal-months button').length,
    document.querySelector('.cal-months button.on').textContent]);
  // the year, written between its arrows: the one before goes to 2025
  await p.locator('.cal-jump [data-dp="prev"]').click();
  await p.locator('.cal-months button', { hasText: 'mars' }).click();
  const jumped = await p.evaluate(() => [document.querySelector('#cal .periodtitle h3').textContent, document.querySelector('.cal-jump').hidden, cal.state().day]);
  await p.locator('#cal .periodtitle').click();
  await p.keyboard.press('Escape');
  const shut = await p.evaluate(() => [document.querySelector('.cal-jump').hidden, document.activeElement.classList.contains('periodtitle')]);
  await p.locator('#cal .periodtitle').click();
  await p.mouse.click(1200, 880);
  const outside = await p.evaluate(() => document.querySelector('.cal-jump').hidden);
  assert(open[0] && open[1] === 'true' && open[2] === 12 && open[3] === 'nov.' && jumped[0] === 'mars 2025' && jumped[1] && jumped[2] === '2025-03-01' && shut[0] && shut[1] && outside,
    'le titre ouvre le choix du mois : l’année, douze mois ; un mois y mène, Échap et un clic ailleurs le ferment');
  // the week and the list
  await p.evaluate(() => cal.set({ day: '2026-11-09' }));
  await p.locator('#cal .tabs button', { hasText: 'Semaine' }).click();
  const week = await p.evaluate(() => ({ title: document.querySelector('#cal .periodtitle h3').textContent, cols: document.querySelectorAll('.cal-wcol').length, today: document.querySelector('.cal-wcol.is-today').dataset.day,
    rows: document.querySelectorAll('.cal-wcol.is-today ul.rows > li').length, empty: document.querySelectorAll('.cal-wcol .empty').length, tab: document.querySelector('#cal .tabs [aria-selected="true"]').textContent, state: cal.state() }));
  await p.locator('#cal button[aria-label="Suivant"]').click();
  const week2 = await p.evaluate(() => cal.state());
  assert(week.title === '9 nov. – 15 nov.' && week.cols === 7 && week.today === '2026-11-09' && week.rows === 5 && week.empty === 5 && week.tab === 'Semaine'
    && week.state.from === '2026-11-09' && week.state.to === '2026-11-16' && week2.day === '2026-11-16', 'la semaine : sept colonnes, celle d’aujourd’hui en or ; la flèche avance d’une semaine');
  await p.evaluate(() => cal.set({ view: 'list', day: '2026-11-09' }));
  const list1 = await p.evaluate(() => [...document.querySelectorAll('#cal .cal-day')].map(d => d.dataset.day));
  await p.locator('.cal-prev').click();
  const list2 = await p.evaluate(() => ({ days: [...document.querySelectorAll('#cal .cal-day')].map(d => d.dataset.day), state: cal.state(), focus: document.activeElement.classList.contains('cal-prev'),
    open: document.querySelector('.cal-prev').getAttribute('aria-expanded'), none: document.querySelector('.cal-day[data-day="2026-11-10"] .empty').textContent }));
  assert(list1.length === 8 && list1[0] === '2026-11-09' && list1[7] === '2026-11-16' && list2.days.length === 15 && list2.days[0] === '2026-11-02' && list2.state.from === '2026-11-02'
    && list2.focus && list2.open === 'true' && list2.none === 'Rien ce jour-là.', 'la liste : huit jours depuis le jour choisi, la semaine d’avant dépliée au-dessus');

  // a group (an item with a count): its title, its count, then its codes, which a narrow cell lets go; ready: a page
  // still reading the days asked for keeps the month on screen, and moves once it has them
  const held = await p.evaluate(() => {
    const box = document.createElement('div');
    box.id = 'cal2';
    document.querySelector('.wrap').append(box);
    window.have = false;
    window.cal2 = ds.calendar(box, { today: '2026-11-09', ready: s => have || s.day < '2026-12-01', items: k => k === '2026-11-10'
      ? [{ title: 'Halloween', color: '--c-bleu', count: '1/3', codes: ['IG', 'X'] }, { title: 'Série Irina', color: '--c-bleu', codes: ['P'] }] : [] });
    const lines = [...box.querySelectorAll('.cal-cell[data-day="2026-11-10"] .cal-line')].map(l => [...l.children].map(x => x.className.split(' ')[0]).join(' '));
    cal2.go(1);
    const during = [box.querySelector('.periodtitle h3').textContent, cal2.state().day, box.querySelectorAll('.cal-cell[data-day="2026-11-10"]').length];
    cal2.draw();
    const still = box.querySelector('.periodtitle h3').textContent;
    have = true;
    cal2.draw();
    const after = [box.querySelector('.periodtitle h3').textContent, box.querySelectorAll('.cal-cell[data-day="2026-12-31"]').length];
    cal2.go(-1);
    return { lines, during, still, after };
  });
  await p.setViewportSize({ width: 1000, height: 900 });
  const narrow = await p.evaluate(() => [...document.querySelectorAll('#cal2 .cal-cell[data-day="2026-11-10"] .cal-code')].map(c => getComputedStyle(c).display));
  await p.setViewportSize({ width: 1280, height: 900 });
  console.log('      ' + JSON.stringify([held.lines, narrow]));
  await p.evaluate(() => document.getElementById('cal2').remove());
  assert(JSON.stringify(held.lines) === '["cal-mark cal-lt cal-count cal-code cal-code","cal-mark cal-code cal-lt"]' && JSON.stringify(narrow) === '["none","none","grid"]',
    'un groupe : son titre, son compte, puis ses codes, que la case étroite laisse tomber ; un élément seul garde ses codes avant le titre');
  assert(held.during[0] === 'novembre 2026' && held.during[1] === '2026-12-01' && held.during[2] === 1 && held.still === 'novembre 2026'
    && held.after[0] === 'décembre 2026' && held.after[1] === 1, 'ready : le mois affiché reste tant que l’appli lit le suivant, puis le calendrier y passe');

  // the curve: one point per day, the highest and lowest values, the first and last days
  const ln = await p.evaluate(() => ({ points: document.querySelector('#line polyline').getAttribute('points').split(' ').length, rules: document.querySelectorAll('#line .chart-rule').length,
    y: [...document.querySelectorAll('#line .chart-line-y span')].map(s => s.textContent), x: [...document.querySelectorAll('#line .chart-line-x span')].map(s => s.textContent),
    stroke: getComputedStyle(document.querySelector('#line polyline')).stroke, label: line.getAttribute('aria-label'), none: lineNone === null && !document.getElementById('line-none').children.length }));
  assert(ln.points === 30 && ln.rules === 2 && JSON.stringify(ln.y) === '["1 258","1 200"]' && JSON.stringify(ln.x) === '["1er oct.","30 oct."]' && ln.stroke === 'rgb(73, 143, 238)'
    && ln.label === '1 200 (1er oct.) → 1 258 (30 oct.)' && ln.none, 'la courbe : un point par jour, le plus haut et le plus bas, le premier et le dernier jour, la couleur de la série ' + JSON.stringify(ln.y));
  // the bars: one per month, a round scale, the average, the figures, the parts, the month running, a click
  const br = await p.evaluate(() => {
    const cols = [...document.querySelectorAll('#bars .chart-bar')], avg = document.querySelector('#bars .chart-bars-avg i');
    return { n: cols.length, buttons: cols.every(c => c.tagName === 'BUTTON'), ticks: [...document.querySelectorAll('#bars .chart-bars-axis span')].map(s => s.textContent), avg: avg.style.bottom,
      on: document.querySelector('#bars .chart-bar.is-on').title, live: document.querySelectorAll('#bars .chart-bar.is-live').length, parts: document.querySelectorAll('#bars .chart-bar-stack i').length,
      fig: cols[0].querySelector('.chart-bar-v').textContent, h: cols[11].querySelector('.chart-bar-fill').style.height, labels: cols.map(c => c.querySelector('.chart-bar-l').textContent), dense: bars.classList.contains('is-dense') };
  });
  console.log('      ' + JSON.stringify(br));
  await p.locator('#bars .chart-bar').nth(3).click();
  const br2 = await p.evaluate(() => [picked, document.querySelectorAll('#bars .chart-bar.is-on').length, document.querySelector('#bars .chart-bar.is-on').getAttribute('aria-pressed')]);
  assert(br.n === 12 && br.buttons && JSON.stringify(br.ticks) === '["0","500€","1k€","1,5k€","2k€"]' && br.avg === '60%' && br.live === 1 && br.parts === 24 && br.fig === '1k' && br.h === '77.5%'
    && br.labels[0] === 'déc' && br.labels[1] === 'janv 26' && br.labels[2] === 'févr' && !br.dense && br.on === 'nov · 1,6k€ (en cours)'
    && JSON.stringify(br2) === '[["2026-03"],1,"true"]', 'les barres : une par mois sur une échelle ronde, la moyenne, les parts, le mois en cours hachuré ; un clic en choisit une');
  const long = await p.evaluate(() => ({ n: barsLong.querySelectorAll('.chart-bar').length, dense: barsLong.classList.contains('is-dense'), divs: barsLong.querySelectorAll('div.chart-bar').length,
    labels: [...barsLong.querySelectorAll('.chart-bar-l')].map(l => l.textContent).filter(Boolean) }));
  assert(long.n === 30 && long.dense && long.divs === 30 && JSON.stringify(long.labels) === '["2025","2026"]', 'trente mois : serrés, les chiffres au survol, seules les années nommées, sans clic sans pick');
  // the year of days: a square per day, coloured by count, the future left out, the weeks' figures, the legend
  const ht = await p.evaluate(() => {
    const days = [...document.querySelectorAll('#heat .chart-heat-days .heat-day')];
    return { n: days.length, one: days.filter(d => d.classList.contains('is-1')).map(d => d.dataset.day), two: days.filter(d => d.classList.contains('is-2')).map(d => d.dataset.day),
      future: days.filter(d => d.classList.contains('is-future')).length, out: days.filter(d => d.classList.contains('is-out')).length, first: days[0].dataset.day, last: days[days.length - 1].dataset.day,
      below: [...document.querySelectorAll('#heat .chart-heat-below span')].filter(s => s.textContent).length, months: [...document.querySelectorAll('#heat .chart-heat-months span')].filter(s => s.textContent).length,
      legend: document.querySelectorAll('#heat .chart-heat-legend .heat-day').length, title: document.querySelector('#heat .heat-day[data-day="2026-11-09"]').title,
      color: getComputedStyle(document.querySelector('#heat .chart-heat-days .heat-day.is-2')).backgroundColor };
  });
  console.log('      ' + JSON.stringify(ht));
  assert(ht.n === 371 && ht.first === '2025-11-10' && ht.last === '2026-11-15' && JSON.stringify(ht.one) === '["2025-11-10","2026-11-02","2026-11-08"]' && JSON.stringify(ht.two) === '["2026-06-01","2026-11-09"]'
    && ht.future === 6 && ht.out === 172 && ht.below === 6 && ht.months === 12 && ht.legend === 3 && ht.title === '9 nov. · 2' && ht.color === 'rgb(241, 69, 63)',
    'l’année de jours : 53 semaines de 7 cases, pâles, colorées, pleines ; l’avenir laissé de côté, le chiffre des semaines, la légende');
  const sk = await p.evaluate(() => ({ n: spark.children.length, h: [...spark.children].map(i => i.style.height), split: [...split.querySelectorAll('.chart-split-bar i')].map(i => i.style.width),
    legend: [...split.querySelectorAll('.chart-split-legend span')].map(s => s.textContent) }));
  assert(sk.n === 3 && JSON.stringify(sk.h) === '["25%","50%","75%"]' && JSON.stringify(sk.split) === '["75%","25%"]' && sk.legend[0] === 'Abonnements750€75%',
    'les petites barres des stories, à leur hauteur ; la barre partagée et sa légende ' + JSON.stringify(sk));

  // rankings, mini-tiles, verdicts
  const rk = await p.evaluate(() => {
    const cols = document.querySelectorAll('#ranks .rank-col');
    return { cols: cols.length, rows: cols[0].querySelectorAll('li').length, top: cols[0].querySelectorAll('li.is-top').length, n: [...cols[0].querySelectorAll('.rank-n')].map(x => x.textContent).join(''),
      share: cols[0].querySelectorAll('.rank-bar')[1].style.getPropertyValue('--share'), href: cols[0].querySelector('a.rank-t').target, note: cols[0].querySelector('.rank-note').textContent,
      plain: cols[1].querySelectorAll('.rank-n').length, verdict: cols[1].querySelector('.verdict').className, empty: cols[2].querySelector('.empty').textContent,
      side: getComputedStyle(document.getElementById('ranks')).gridAutoFlow };
  });
  assert(rk.cols === 3 && rk.rows === 4 && rk.top === 3 && rk.n === '1234' && rk.share === '0.667' && rk.href === '_blank' && rk.note === '30 jours' && rk.plain === 0
    && rk.verdict === 'verdict is-good' && rk.empty === 'Rien sur cette période.' && rk.side === 'column', 'les classements côte à côte : la place, les trois premiers en or, la barre de part, sans place, vide');
  const vd = await p.evaluate(() => verdicts.map(v => [v.className, v.textContent]));
  assert(JSON.stringify(vd) === JSON.stringify([['verdict is-good', '×1,4'], ['verdict is-mid', '×1'], ['verdict is-weak', '×0,6'], ['verdict is-good is-tall', '×1,3fort'], ['verdict is-none', '']]),
    'les verdicts : vert, jaune, rouge, avec leur mot, et la place gardée sans chiffre ' + JSON.stringify(vd));
  const mt = await p.evaluate(() => ({ n: document.querySelectorAll('#mini .minitile').length, flow: getComputedStyle(document.querySelector('#mini .minitiles')).gridAutoFlow }));
  assert(mt.n === 4 && mt.flow === 'column', 'les mini-tuiles, sur une ligne sur ordinateur');
  // the period selector: buttons on a computer
  await p.locator('#period .tabs button', { hasText: '1 an' }).click();
  const pp = await p.evaluate(() => ({ periods, pressed: document.querySelector('#period [aria-pressed="true"]').textContent, list: getComputedStyle(document.querySelector('.periodpick-list')).display,
    value: document.querySelector('.periodpick-list').value }));
  assert(JSON.stringify(pp.periods) === '[365]' && pp.pressed === '1 an' && pp.list === 'none' && pp.value === '365', 'le choix de période : des boutons sur ordinateur, le choisi allumé');

  // the « new version » light, then the live stream: refused once, open again, its events read
  const v1 = await p.evaluate(() => [light.seen('2.17.0'), document.getElementById('reload').classList.contains('is-on'), getComputedStyle(document.querySelector('.newver-pip')).display,
    document.getElementById('reload').getAttribute('aria-label')]);
  await p.evaluate(() => {
    window.got = []; window.opens = 0;
    window.live = ds.stream('/api/stream', { version: d => light.seen(d.version), changed: d => got.push(d), jobs: d => got.push(d) },
      { open: () => opens++, retry: 150, poll: () => fetch('/api/status'), every: 300 });
  });
  await p.waitForFunction(() => window.got.length >= 2, null, { timeout: 5000 });
  const v2 = await p.evaluate(() => [document.getElementById('reload').classList.contains('is-on'), getComputedStyle(document.querySelector('.newver-pip')).display,
    document.getElementById('reload').getAttribute('aria-label'), JSON.stringify(got), opens]);
  assert(!v1[0] && !v1[1] && v1[2] === 'none' && v1[3] === 'Recharger la page' && v2[0] && v2[1] === 'block' && v2[2] === 'Nouvelle version du site : recharger la page',
    'le témoin : éteint sur la même version, allumé (point d’or) quand le serveur en annonce une autre');
  assert(streams === 2 && v2[3] === '[{"changed":5},"plain words"]' && v2[4] === 1, 'le direct : refusé une fois (redémarrage), rouvert seul, ses messages lus en JSON ou en mots ' + streams);
  await p.evaluate(() => { live.source().close(); document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForFunction(() => window.opens >= 2, null, { timeout: 5000 });
  await p.waitForTimeout(700);
  const polled = polls;
  await p.evaluate(() => live.close());
  await p.waitForTimeout(700);
  assert(streams === 3 && polled >= 2 && polls <= polled + 1, 'fermé en arrière-plan, rouvert quand la page revient ; la relève régulière ; close() arrête tout ' + JSON.stringify([streams, polled, polls]));

  // the device's copy: kept, read back, gone; then a page opening on it before the server answers
  const kp = await p.evaluate(async () => {
    const value = { rows: [{ title: 'Série Irina', at: new Date(Date.UTC(2026, 10, 9)) }], n: 3 };
    const out = { put: await ds.keep.put('agenda', value), ok: await ds.keep.ok(), missing: await ds.keep.get('none') };
    const back = await ds.keep.get('agenda');
    out.back = back.rows[0].title === 'Série Irina' && back.rows[0].at instanceof Date && back.n === 3;
    out.other = await ds.keep.open('studio').get('agenda');
    out.del = await ds.keep.del('agenda');
    out.gone = await ds.keep.get('agenda');
    out.bad = await ds.keep.put('fn', { f: () => 1 });
    const draws = [];
    await ds.keep.fresh('page', () => new Promise(r => setTimeout(() => r({ n: 1 }), 100)), (v, how) => draws.push([v.n, how.copy]));
    out.first = JSON.stringify(draws);
    return out;
  });
  await p.reload(); await p.waitForFunction(() => window.ready);
  const kp2 = await p.evaluate(async () => {
    const draws = [];
    const v = await ds.keep.fresh('page', () => new Promise(r => setTimeout(() => r({ n: 2 }), 300)), (v, how) => draws.push([v.n, how.copy, typeof how.at]));
    return { draws: JSON.stringify(draws), v: v.n, kept: (await ds.keep.get('page')).value.n };
  });
  assert(kp.put && kp.ok && kp.missing === null && kp.back && kp.other === null && kp.del && kp.gone === null && kp.bad === false && kp.first === '[[1,false]]',
    'la copie de l’appareil : gardée et relue telle quelle, à part d’une autre base, effacée ; une valeur impossible à garder répond false ' + JSON.stringify(kp));
  assert(kp2.draws === '[[1,true,"number"],[2,false,null]]'.replace('null', '"undefined"') && kp2.v === 2 && kp2.kept === 2,
    'à la visite suivante, la page s’ouvre tout de suite sur la copie, puis sur la réponse du serveur, qui est gardée ' + kp2.draws);
  // a device that keeps nothing: no IndexedDB, or one that never answers (some private windows)
  const none = await b.newPage();
  await none.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true }); });
  await none.goto(base + '/checks/studio.html'); await none.waitForFunction(() => window.ready);
  const nk = await none.evaluate(async () => {
    const draws = [];
    const out = [await ds.keep.put('a', 1), await ds.keep.get('a'), await ds.keep.ok()];
    await ds.keep.fresh('page', () => Promise.resolve({ n: 9 }), (v, how) => draws.push([v.n, how.copy]));
    return out.concat(JSON.stringify(draws));
  });
  await none.close();
  const hang = await b.newPage();
  await hang.addInitScript(() => { const db = window.indexedDB; db.open = () => ({}); });
  await hang.goto(base + '/checks/studio.html'); await hang.waitForFunction(() => window.ready);
  const hk = await hang.evaluate(async () => { const t = Date.now(), v = await ds.keep.get('a'); return [v, Date.now() - t]; });
  await hang.close();
  assert(JSON.stringify(nk) === '[false,null,false,"[[9,false]]"]' && hk[0] === null && hk[1] >= 2900 && hk[1] < 4500,
    'sans IndexedDB, ou avec un qui ne répond jamais : rien de gardé, la page attend le serveur, comme à une première visite ' + JSON.stringify([nk, hk]));

  // on a phone: the dots, the week stacked, the period list, the year scrolled to its end, two rows of mini-tiles
  await p.setViewportSize({ width: 375, height: 812 });
  await p.evaluate(() => cal.set({ view: 'month', day: '2026-11-12' }));
  await p.waitForTimeout(100);
  const ph = await p.evaluate(() => {
    const cell = document.querySelector('.cal-cell[data-day="2026-11-12"]'), mark = cell.querySelector('.cal-mark'), extra = cell.querySelector('.cal-line.is-extra');
    return { lt: getComputedStyle(cell.querySelector('.cal-lt')).display, code: getComputedStyle(document.querySelector('.cal-cell[data-day="2026-11-09"] .cal-code')).display,
      w: getComputedStyle(mark).width, round: getComputedStyle(mark).borderRadius, extra: getComputedStyle(extra).display, more: getComputedStyle(cell.querySelector('.cal-more')).display,
      dots: getComputedStyle(cell.querySelector('.cal-more-dots')).display, shown: [...cell.querySelectorAll('.cal-line')].filter(l => getComputedStyle(l).display !== 'none').length,
      bar: getComputedStyle(document.querySelector('.cal-cell[data-day="2026-11-09"] .cal-mark.is-bar')).borderRadius,
      list: getComputedStyle(document.querySelector('.periodpick-list')).display, tabs: getComputedStyle(document.querySelector('#period .tabs')).display,
      scroll: document.querySelector('.chart-heat-scroll').scrollLeft, sw: document.querySelector('.chart-heat-scroll').scrollWidth > document.querySelector('.chart-heat-scroll').clientWidth,
      mini: getComputedStyle(document.querySelector('#mini .minitiles')).gridTemplateColumns.split(' ').length, ranks: getComputedStyle(document.getElementById('ranks')).gridAutoFlow,
      wide: document.documentElement.scrollWidth };
  });
  console.log('      ' + JSON.stringify(ph));
  assert(ph.lt === 'none' && ph.code === 'none' && ph.w === '6px' && ph.round === '50%' && ph.bar === '50%' && ph.extra === 'none' && ph.shown === 3 && ph.more === 'none' && ph.dots === 'block',
    'sur téléphone, une case ne garde que des points de couleur, trois au plus, puis « +N »');
  await p.locator('#period select').selectOption('0');
  const pp2 = await p.evaluate(() => [JSON.stringify(periods), document.querySelector('#period [aria-pressed="true"]').textContent]);
  assert(ph.list === 'block' && ph.tabs === 'none' && pp2[0] === '[0]' && pp2[1] === 'Tout', 'sur téléphone, le choix de période devient une liste, qui allume aussi le bouton ' + JSON.stringify(pp2));
  await p.evaluate(() => { heat.querySelector('.chart-heat-scroll').scrollLeft = 0; });
  await p.evaluate(() => ds.chart.heat(document.getElementById('heat'), counts, { color: '--c-rouge', to: '2026-11-09' }));
  await p.waitForTimeout(100);
  const sc = await p.evaluate(() => { const s = document.querySelector('#heat .chart-heat-scroll'); return [s.scrollLeft, s.scrollWidth - s.clientWidth]; });
  assert(sc[1] > 0 && Math.abs(sc[0] - sc[1]) <= 1 && ph.mini === 2 && ph.ranks === 'row' && ph.wide <= 375, 'sur téléphone, l’année défile de côté, ouverte sur ses dernières semaines ; deux rangs de mini-tuiles, les classements l’un sous l’autre, rien ne dépasse');
  await p.evaluate(() => cal.set({ view: 'week' }));
  const wk = await p.evaluate(() => getComputedStyle(document.querySelector('.cal-week')).gridTemplateColumns.split(' ').length);
  assert(wk === 1, 'sur téléphone, les jours de la semaine l’un sous l’autre');
  // in English: the calendar's and the verdicts' words
  const en = await p.evaluate(() => {
    document.documentElement.lang = 'en';
    const holder = document.createElement('div'); document.body.append(holder);
    ds.calendar(holder, { today: '2026-11-09', items: () => [] });
    const out = [[...holder.querySelectorAll('.tabs button')].map(b => b.textContent).join(' '), holder.querySelector('.cal-nav .btn:not(.is-icon)').textContent, holder.querySelector('.periodtitle h3').textContent,
      holder.querySelector('.cal-day-t').textContent, ds.verdict(1.5, { words: true }).textContent];
    document.documentElement.lang = 'fr'; holder.remove();
    return out;
  });
  assert(JSON.stringify(en) === JSON.stringify(['Month Week List', 'Today', 'November 2026', 'Monday 9 November', '×1.5strong']), 'en anglais : les vues, « Today », le mois, le jour, les verdicts ' + JSON.stringify(en));
  assert(errors.length === 0, 'aucune erreur dans la page ' + errors.join(' '));
  await b.close();
  server.close();
})();
