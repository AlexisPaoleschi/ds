// The shared behaviour of ds.js in a real browser: the drawer, the sources' state, the time in words, the header's
// loading wheel, a failing source's bubble, the main views' bar; and with the keyboard and a screen reader in mind: Tab
// inside ds.confirm, a bubble that waits under the keyboard, a loading heard twice, the titles fitted only when they
// change, an unreadable date, the wheels standing still when the device asks for less motion.
// usage: node checks/behaviours.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2' };
// the server of a settings page, as far as the checks need it: a job's lines, an error, an ended session
let served = 0, flaky = 0;
const server = http.createServer((req, res) => {
  const json = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.url.startsWith('/api/jobs/banks/logs')) {
    const after = +new URL(req.url, 'http://x').searchParams.get('after'), lines = [];
    if (after === 0) lines.push({ t: 1794200000, level: 'INFO', text: 'Lecture de BoursoBank' }, { t: 1794200005, level: 'ERREUR', text: 'BoursoBank : refusé' });
    else if (served < 3) lines.push({ t: 1794200010 + served, level: 'WARNING', text: 'Nouvelle ligne ' + served });
    served += 1;
    return json(200, { lines, last: after + lines.length });
  }
  if (req.url === '/api/refused') return json(400, { detail: 'Refusé par le serveur' });
  if (req.url === '/api/studio-refused') return json(400, { error: { code: 'tool_error', message: 'Notion a répondu 502' } });
  if (req.url === '/api/echo') return json(200, { header: req.headers['x-test'] || null });
  // a server restarting answers 503 once, then comes back; a Spring page's token; an ended session
  if (req.url === '/api/flaky') { flaky += 1; return flaky === 1 ? json(503, {}) : json(200, { ok: flaky }); }
  if (req.url === '/api/csrf') return json(200, { token: req.headers['x-xsrf-token'] || null });
  if (req.url === '/api/ended') return json(401, {});
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
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base + '/checks/behaviours.html');
  await p.waitForFunction(() => window.side);
  const tab = p.locator('[data-drawer-toggle]');
  assert(await tab.getAttribute('aria-label') === 'Ouvrir les filtres' && await tab.getAttribute('aria-expanded') === 'false', 'tiroir fermé au départ, onglet le dit');
  await tab.click();
  assert(await p.evaluate(() => document.querySelector('[data-drawer]').classList.contains('open') && side.open), 'l’onglet ouvre le tiroir');
  assert(await p.evaluate(() => document.activeElement.classList.contains('side')), 'sur téléphone, le curseur entre dans le tiroir');
  assert(await tab.getAttribute('aria-label') === 'Fermer les filtres', 'l’onglet dit qu’il ferme');
  await p.keyboard.press('Escape');
  assert(await p.evaluate(() => !side.open && document.activeElement.hasAttribute('data-drawer-toggle')), 'Échap ferme, le curseur revient à l’onglet');
  await tab.click();
  await p.mouse.click(360, 400);
  assert(await p.evaluate(() => !side.open), 'un toucher sur le voile ferme');
  await tab.click();
  await p.locator('[data-drawer-close]').click();
  assert(await p.evaluate(() => !side.open), 'la croix ferme');
  await tab.click();
  const seen = await p.evaluate(() => JSON.stringify(changes)); console.log('      onChange :', seen); assert(seen === '[true,false,true,false,true,false,true]', 'onChange suit chaque changement (4 ouvertures, 3 fermetures)');
  await p.reload(); await p.waitForFunction(() => window.side);
  assert(await p.evaluate(() => side.open && document.querySelector('[data-drawer]').classList.contains('open')), 'le tiroir resté ouvert l’est encore au retour');
  // the drawer's gold dot while a filter hides something
  await p.evaluate(() => side.mark(true));
  const dot1 = await p.evaluate(() => document.querySelectorAll('[data-drawer-toggle] .fdot').length);
  await p.evaluate(() => side.set(!side.open));
  const dot2 = await p.evaluate(() => document.querySelectorAll('[data-drawer-toggle] .fdot').length);
  await p.evaluate(() => { side.set(!side.open); side.mark(false); });
  assert(dot1 === 1 && dot2 === 1 && await p.evaluate(() => !document.querySelector('[data-drawer-toggle] .fdot')), 'le point d’or du tiroir : mis, gardé quand il s’ouvre, ôté');
  // the main views on a phone: a bar at the bottom, the icon above the name, the dot on the icon's corner
  const bar = await p.evaluate(() => { const t = document.querySelector('.tabs.is-bar'), r = t.getBoundingClientRect(), ico = t.querySelector('.ico'), dot = t.querySelector('.tabn');
    return { fixed: getComputedStyle(t).position, bottom: Math.round(innerHeight - r.bottom), h: Math.round(r.height), ico: getComputedStyle(ico).display, dot: getComputedStyle(dot).position }; });
  assert(bar.fixed === 'fixed' && bar.bottom >= 14 && bar.h === 54 && bar.ico === 'block' && bar.dot === 'absolute', 'sur téléphone, les vues en barre en bas, icône au-dessus du nom ' + JSON.stringify(bar));
  // the header's loading wheel: 0 %, climbing on its own, never back, 100 % then the tick
  await p.evaluate(() => ds.busy.start('Lecture des banques…', { expected: 400 }));
  const b1 = await p.evaluate(() => ({ on: ds.busy.active(), seen: getComputedStyle(document.querySelector('.busy')).visibility, bt: document.querySelector('.busy .bt').textContent }));
  await p.waitForTimeout(700);
  const b2 = await p.evaluate(() => ({ pc: parseInt(document.querySelector('.busy .pc').textContent), boot: document.getElementById('boot-pc').textContent }));
  await p.evaluate(() => ds.busy.pct(10));
  const b3 = await p.evaluate(() => parseInt(document.querySelector('.busy .pc').textContent));
  await p.evaluate(() => ds.busy.done());
  await p.waitForTimeout(500);
  const b4 = await p.evaluate(() => ({ on: ds.busy.active(), done: document.querySelector('header.top').classList.contains('loading-done'), pc: document.querySelector('.busy .pc').textContent }));
  assert(b1.on && b1.seen === 'visible' && b1.bt === 'Lecture des banques…' && b2.pc > 10 && b2.boot === b2.pc + '%' && b3 >= b2.pc && !b4.on && b4.done && b4.pc === '',
    'la roue de l’en-tête : visible, le pourcentage monte seul et ne recule jamais, puis la coche ' + JSON.stringify([b1, b2, b3, b4]));
  // an even speed: over a loading foreseen to last 2 s, the share climbs by the same steps; work read ahead of time (half
  // of it at 0.6 s) bends the speed gently, without a jump
  await p.waitForTimeout(2100);
  const even = await p.evaluate(async () => {
    const pc = () => parseInt(document.querySelector('.busy .pc').textContent), wait = ms => new Promise(r => setTimeout(r, ms)), a = [], b = [];
    ds.busy.start('Lecture', { expected: 2000 });
    for (let i = 0; i < 8; i++) { await wait(200); a.push(pc()); }
    ds.busy.done(false);
    ds.busy.start('Lecture', { expected: 2000 });
    for (let i = 0; i < 10; i++) { await wait(200); if (i === 2) ds.busy.pct(50); b.push(pc()); }
    ds.busy.done(false);
    const steps = x => x.slice(1).map((v, i) => v - x[i]);
    return { a, b, sa: steps(a), sb: steps(b) };
  });
  // while it climbs (below 99%, where it waits for the end), each step differs from the one before by 4 points at most
  const climbing = even.sb.filter((d, i) => even.b[i + 1] < 99);
  const flat = even.sa.every(d => d >= 7 && d <= 12), gentle = climbing.length >= 4 && climbing.every(d => d >= 0 && d <= 20) && climbing.slice(1).every((d, i) => Math.abs(d - climbing[i]) <= 4);
  assert(flat && gentle, 'le pourcentage monte à vitesse régulière, et l’avance des sources lues la corrige en douceur ' + JSON.stringify(even));
  // a word in place of the share (Studio's « calcul… »): it stays while the time passes and a share is given, until the end
  await p.waitForTimeout(2100);
  await p.evaluate(() => { ds.busy.start('Analyse', { expected: 400 }); ds.busy.say('calcul…'); ds.busy.pct(80); });
  await p.waitForTimeout(400);
  const w1 = await p.evaluate(() => [document.querySelector('.busy .pc').textContent, document.getElementById('boot-pc').textContent]);
  await p.evaluate(() => ds.busy.done());
  await p.waitForTimeout(500);
  const w2 = await p.evaluate(() => [ds.busy.active(), document.querySelector('header.top').classList.contains('loading-done')]);
  assert(w1[0] === 'calcul…' && w1[1] === 'calcul…' && !w2[0] && w2[1], 'un mot à la place du pourcentage (« calcul… ») reste jusqu’à la fin, puis la coche ' + JSON.stringify([w1, w2]));
  // a source that failed: told once, Réessayer, then how it went
  const told = await p.evaluate(async () => {
    window.fails = 1;
    const o = { name: 'BoursoBank', text: 'la banque n’a pas répondu.', retry: () => Promise.resolve(), check: () => (fails-- > 0 ? 'Elle ne répond toujours pas.' : null) };
    const first = !!ds.trouble('bourso', o), again = !!ds.trouble('bourso', o);
    const text = () => [...document.querySelectorAll('.toast')].map(t => t.querySelector('.txt').textContent);
    const out = { first, again, shown: text() };
    document.querySelector('.toast.is-bad .act').click();
    await new Promise(r => setTimeout(r, 50));
    out.still = text();
    document.querySelector('.toast.is-bad .act').click();
    await new Promise(r => setTimeout(r, 50));
    out.back = text();
    out.afterOk = !!ds.trouble('bourso', o);
    return out;
  });
  console.log('      ' + JSON.stringify(told));
  assert(told.first && !told.again && told.shown.includes('BoursoBank : la banque n’a pas répondu.') && told.still.includes('BoursoBank : toujours impossible. Elle ne répond toujours pas.')
    && told.back.includes('BoursoBank : à jour') && told.afterOk, 'une source en panne : dite une fois, « Réessayer », puis « toujours impossible » ou « à jour »');
  // the first loading's place, and the scroll bar's room kept by the tools
  const shell = await p.evaluate(() => { const d = document.createElement('div'); d.className = 'boot'; document.body.append(d); const s = getComputedStyle(d).display; d.remove();
    return { boot: s, gutter: getComputedStyle(document.documentElement).scrollbarGutter }; });
  assert(shell.boot === 'grid' && shell.gutter === 'stable', 'le premier chargement au milieu, la place de la barre de défilement gardée ' + JSON.stringify(shell));
  // the sources' state
  const st = await p.evaluate(() => { const d = document.querySelector('#footer details.status'); return { rows: d.querySelectorAll('li').length, late: d.querySelectorAll('li.late').length, dot: !!d.querySelector('.dot.warn'), sd: d.querySelector('li.late .sd').textContent, link: d.querySelector('li.sl a').getAttribute('href'), open: d.open }; });
  assert(st.rows === 3 && st.late === 1 && st.dot && st.sd === 'Compte joint : refusé' && st.link === '/settings' && !st.open, 'la liste des sources : lignes, retard, détail, lien');
  await p.evaluate(() => { document.querySelector('#footer details').open = true; });
  await p.waitForTimeout(50);
  await p.reload(); await p.waitForFunction(() => window.side);
  assert(await p.evaluate(() => document.querySelector('#footer details').open), 'ouverte, elle le reste au retour');
  // the time in words, on Paris's days whatever the device's zone (New York here), at 22h30 in Paris on 9 November
  const words = await p.evaluate(() => {
    const now = Date.parse('2026-11-09T21:30:00Z'), real = Date.now; Date.now = () => now;
    const out = [ds.when(now - 3600e3), ds.when(Date.parse('2026-11-08T08:05:00Z')), ds.when(Date.parse('2026-11-01T08:00:00Z')),
      ds.when(Math.round(Date.parse('2026-11-09T05:00:00Z') / 1000)), ds.ago(now - 20e3), ds.ago(now - 180e3), ds.ago(now - 7500e3),
      ds.soon(now + 720e3), ds.soon(Date.parse('2026-11-10T08:04:00Z')), ds.when(null)];
    document.documentElement.lang = 'en'; out.push(ds.when(now - 3600e3), ds.ago(now - 180e3)); document.documentElement.lang = 'fr';
    Date.now = real; return out;
  });
  console.log('     ', words.join(' | '));
  assert(JSON.stringify(words) === JSON.stringify(["aujourd'hui à 21h30", "hier à 9h05", "le 1er nov. à 9h00", "aujourd'hui à 6h00", "à l’instant",
    "il y a 3 min", "il y a 2h05", "dans 12 min", "demain à 9h04", "jamais", "today at 21:30", "3 min ago"]), 'les heures en mots, à l’heure de Paris');
  // dates and figures
  const figures = await p.evaluate(() => [ds.date('2026-11-09'), ds.date('2026-11-01', 'weekday'), ds.date('2026-11', 'month'), ds.date('2026-11-09', 'short'),
    ds.date(Date.parse('2026-11-09T23:30:00Z')), ds.number(1061499.82, 2), ds.money(-1234.5), ds.money(12, { signed: true, decimals: 0 }),
    ds.money(12, { currency: 'USD' }), ds.money(null)]);
  console.log('     ', figures.join(' | '));
  assert(JSON.stringify(figures) === JSON.stringify(['9 novembre 2026', 'dimanche 1er novembre', 'novembre 2026', '09/11/26', '10 novembre 2026',
    '1\u00a0061\u00a0499,82', '−1\u00a0234,50€', '+12€', '12,00\u00a0USD', '—']), 'dates et nombres, avec l’espace que les polices dessinent');
  // the server
  const asked = await p.evaluate(async () => {
    const out = [(await ds.api('GET', '/api/echo')).header];
    for (const u of ['/api/refused', '/api/studio-refused']) { try { await ds.api('GET', u); } catch (e) { out.push(e.message); } }
    return out;
  });
  assert(JSON.stringify(asked) === JSON.stringify(['1', 'Refusé par le serveur', 'Notion a répondu 502']), 'ds.api : l’en-tête de l’appli, les erreurs des deux serveurs');
  // the syncs and their journal
  await p.setViewportSize({ width: 1280, height: 900 });
  const jobs = await p.evaluate(() => ({ blocks: document.querySelectorAll('#jobs .job').length, run: document.querySelectorAll('#jobs .go').length,
    bad: !!document.querySelector('#job-claude .sum.bad'), dot: document.querySelector('#job-banks .dot').className }));
  assert(jobs.blocks === 2 && jobs.run === 1 && jobs.bad && jobs.dot === 'dot ok', 'les synchros : un bloc par tâche, « Lancer » seulement où il sert');
  await p.locator('#job-banks .jl').click();
  await p.waitForFunction(() => document.querySelectorAll('#job-banks .logs .ll').length >= 2);
  await p.waitForFunction(() => document.querySelectorAll('#job-banks .logs .ll').length >= 4, null, { timeout: 8000 });
  const log = await p.evaluate(() => ({ lines: document.querySelectorAll('#job-banks .ll').length, bad: document.querySelectorAll('#job-banks .ll.lbad').length,
    warn: document.querySelectorAll('#job-banks .ll.lwarn').length, link: document.querySelector('#job-banks .loghead a').href }));
  assert(log.lines >= 4 && log.bad === 1 && log.warn >= 2 && log.link === 'https://dashboard.render.com/', 'le journal s’ouvre, se complète toutes les 2 s, colore les erreurs');
  await p.evaluate(() => drawJobs(true));
  assert(await p.evaluate(() => document.querySelectorAll('#job-banks .ll').length >= 4 && document.querySelector('#job-banks .go').disabled), 'redessiné, le journal reste ouvert et « Lancer » attend la fin');
  await p.evaluate(() => drawJobs(false));
  await p.locator('#job-banks .go').click();
  await p.waitForTimeout(1000);
  assert(await p.evaluate(() => JSON.stringify(runs)) === '["banks","reload"]', '« Lancer » lance la tâche, puis la page relit son état');
  // the address can ask for a job's journal (/settings#patreon/journal): opened as by its button, and it stays open
  await p.evaluate(() => ds.jobs.open('claude'));
  const opened = await p.evaluate(() => [document.querySelector('#job-claude .jl').getAttribute('aria-expanded'), !!document.querySelector('#job-claude .logs')]);
  await p.evaluate(() => drawJobs(false));
  assert(opened[0] === 'true' && opened[1] && !!(await p.evaluate(() => document.querySelector('#job-claude .logs'))), 'ds.jobs.open ouvre le journal d’une tâche, qui reste ouvert redessiné');
  // ds 2.19: the server's calls
  await p.setViewportSize({ width: 375, height: 812 });
  const calls = await p.evaluate(async () => {
    const out = {};
    const t0 = Date.now(); out.flaky = (await ds.api('GET', '/api/flaky')).ok; out.waited = Date.now() - t0;
    const meta = (n, c) => { const m = document.createElement('meta'); m.name = n; m.content = c; document.head.append(m); return m; };
    const m1 = meta('_csrf', 'jeton-42'), m2 = meta('_csrf_header', 'X-XSRF-TOKEN');
    out.csrf = (await ds.api('POST', '/api/csrf', { a: 1 })).token;
    out.csrfGet = (await ds.api('GET', '/api/csrf')).token;
    m1.remove(); m2.remove();
    try { await ds.api('GET', '/api/studio-refused'); } catch (e) { out.code = e.code; out.status = e.status; out.msg = e.message; }
    return out;
  });
  assert(calls.flaky === 2 && calls.waited >= 2900 && calls.csrf === 'jeton-42' && calls.csrfGet === null && calls.code === 'tool_error' && calls.status === 400
    && calls.msg === 'Notion a répondu 502', 'ds.api : un nouvel essai pendant un redémarrage, le jeton de Spring, err.status et err.code ' + JSON.stringify(calls));
  // a window that asks for a code received by SMS
  const code = await p.evaluate(() => { ds.confirm({ title: 'Code reçu par SMS', value: '', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 6 });
    const i = document.querySelector('.dialog-in'), out = [i.inputMode, i.getAttribute('autocomplete'), i.maxLength]; document.querySelector('.dialog-no').click(); return out; });
  assert(JSON.stringify(code) === '["numeric","one-time-code",6]', 'ds.confirm : un champ pour un code, clavier de chiffres, code proposé par le téléphone');
  // short figures, nodes, logos
  const bits = await p.evaluate(() => {
    const out = [ds.compact(9850), ds.compact(57900), ds.compact(578000), ds.compact(1240000), ds.compact(-57900)];
    document.documentElement.lang = 'en'; out.push(ds.compact(57900)); document.documentElement.lang = 'fr';
    let clicked = 0;
    const b = ds.h('button', { class: 'btn', type: 'button', onclick: () => clicked++, disabled: false }, ['Lancer ', ds.ico('play'), null]);
    b.click();
    out.push(b.outerHTML.includes('onclick') ? 'inline' : 'listener', clicked, b.querySelector('svg use').getAttribute('href'));
    const a = ds.avatar('superu', 'data:image/png;base64,broken'); document.body.append(a);
    out.push(a.textContent);
    return out;
  });
  await p.waitForTimeout(300);
  const avatarImg = await p.evaluate(() => document.querySelector('.avatar img') === null);
  assert(JSON.stringify(bits) === JSON.stringify(['9\u00a0850', '57,9k', '578k', '1,2M', '-57,9k', '57.9k', 'listener', 1, '#i-play', 'S']) && avatarImg,
    'ds.compact, ds.h et ds.ico, ds.avatar (l’initiale reste quand l’image manque) ' + JSON.stringify(bits));
  // a foldable section kept as left, after a reload
  await p.evaluate(() => { document.querySelector('details[data-fold="test-fold"]').open = true; });
  await p.waitForTimeout(50);
  await p.reload(); await p.waitForFunction(() => window.side);
  assert(await p.evaluate(() => document.querySelector('details[data-fold="test-fold"]').open), 'une section repliable reste comme on l’a laissée');
  // rows that open, but not on their own buttons; a row with no link is the page's
  await p.evaluate(() => { side.set(false); location.hash = ''; window.opened = []; window.open = (u) => opened.push(u); });
  await p.locator('#rowbtn').click();
  const r1 = await p.evaluate(() => location.hash);
  await p.locator('#row1 td').first().click();
  const r2 = await p.evaluate(() => location.hash);
  await p.locator('#row1 td').first().click({ modifiers: ['Control'] });
  await p.locator('#row2 td').first().click();
  const r3 = await p.evaluate(() => [location.hash, opened.length]);
  assert(r1 === '' && r2 === '#ligne-1' && r3[0] === '#ligne-1' && r3[1] === 1, 'une ligne s’ouvre d’un clic, pas sur son bouton ; Ctrl ouvre un onglet ' + JSON.stringify([r1, r2, r3]));
  // the address after #
  const routed = await p.evaluate(async () => {
    const seen = [];
    ds.route(r => seen.push(r));
    location.hash = 'analyse/patreon-alexis/derniers-membres?compte=hb';
    await new Promise(r => setTimeout(r, 50));
    ds.route.go(['operations'], { compte: 'hb', q: 'super u' });
    const lit = ds.seek('cible');
    return { first: seen[seen.length - 1], now: location.hash, read: ds.route.read(), lit, open: document.querySelector('[data-anchor="cible"]').closest('details').open,
             cls: document.querySelector('[data-anchor="cible"]').classList.contains('is-lit') };
  });
  assert(JSON.stringify(routed.first) === JSON.stringify({ parts: ['analyse', 'patreon-alexis', 'derniers-membres'], query: { compte: 'hb' } })
    && routed.now === '#operations?compte=hb&q=super%20u' && routed.read.query.q === 'super u' && routed.lit && routed.open && routed.cls,
    'ds.route et ds.seek : l’adresse lue et écrite, la cible ouverte et éclairée ' + JSON.stringify(routed));
  // a form that deletes asks in ds.confirm; any other shows its button busy
  await p.evaluate(() => { window.sent = 0; document.getElementById('del').addEventListener('submit', e => { if (e.target.dataset.confirmed) { sent++; e.preventDefault(); } }); });
  await p.locator('#del button').click();
  const askedDel = await p.evaluate(() => [document.querySelector('.dialog-t').textContent, document.querySelector('.dialog-x').textContent, document.querySelector('.dialog-ok').textContent]);
  await p.locator('.dialog-no').click();
  const after1 = await p.evaluate(() => sent);
  await p.locator('#del button').click();
  await p.locator('.dialog-ok').click();
  await p.waitForTimeout(100);
  const after2 = await p.evaluate(() => [sent, document.querySelector('#del button').classList.contains('is-busy')]);
  await p.locator('#sendbtn').click();
  const busy = await p.evaluate(() => [document.getElementById('sendbtn').classList.contains('is-busy'), document.getElementById('sendbtn').disabled]);
  assert(JSON.stringify(askedDel) === JSON.stringify(['Supprimer ce client ?', 'Cette action est irréversible.', 'Supprimer']) && after1 === 0 && after2[0] === 1 && !after2[1]
    && busy[0] && busy[1], 'un formulaire qui supprime demande d’abord ; un autre montre son bouton occupé ' + JSON.stringify([askedDel, after1, after2, busy]));
  // a busy button keeps its colours, in both themes: a save button stays filled, its words readable
  const busyLook = await p.evaluate(() => {
    const probe = name => { const i = document.createElement('i'); i.style.color = 'var(' + name + ')'; document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return c; };
    const bg = name => { const i = document.createElement('i'); i.style.backgroundColor = 'var(' + name + ')'; document.body.append(i); const c = getComputedStyle(i).backgroundColor; i.remove(); return c; };
    const b = document.getElementById('sendbtn'); b.classList.add('is-save'); b.style.transition = 'none';
    const look = () => { const c = getComputedStyle(b); return { filled: c.backgroundColor === bg('--accent'), words: c.color === probe('--on-accent'), turns: getComputedStyle(b, '::after').animationName }; };
    const atelier = look(); document.documentElement.dataset.theme = 'vitrine'; const vitrine = look();
    document.documentElement.dataset.theme = 'atelier'; b.classList.remove('is-save'); b.style.transition = '';
    return { atelier, vitrine };
  });
  assert(busyLook.atelier.filled && busyLook.atelier.words && busyLook.vitrine.filled && busyLook.vitrine.words && busyLook.vitrine.turns === 'spin',
    'un bouton occupé garde ses couleurs : « enregistrer » reste plein, ses mots lisibles, et sa roue tourne ' + JSON.stringify(busyLook));
  // the message left after a redirect, the screen readers' words, the cards' grid
  const left = await p.evaluate(() => ({ toast: [...document.querySelectorAll('.toast .txt')].some(t => t.textContent === 'Sélection terminée'),
    vh: getComputedStyle(document.getElementById('vh')).width, gc: getComputedStyle(document.getElementById('gc')).display }));
  assert(left.toast && left.vh === '1px' && left.gc === 'grid', 'le message laissé après une redirection, le texte des lecteurs d’écran, la grille de cartes ' + JSON.stringify(left));
  // every wheel shows its quarter turning, in both themes: its ring is never the colour of its moving quarter
  const wheels = await p.evaluate(() => {
    const box = document.createElement('div');
    box.innerHTML = '<div class="toast is-busy"><i class="mark"></i></div><div class="msg"><span class="act"><i class="spin"></i></span></div>'
      + '<header class="top"><span class="busy"><i class="spin"></i></span></header><div class="boot"><div class="boot-p"><i class="spin"></i></div></div><i class="spinner"></i>';
    document.body.append(box);
    const still = [];
    for (const theme of ['atelier', 'vitrine']) {
      document.documentElement.dataset.theme = theme;
      for (const sel of ['.toast .mark', '.msg .spin', 'header.top .spin', '.boot-p .spin', '.spinner']) {
        const c = getComputedStyle(box.querySelector(sel));
        if (c.borderTopColor === c.borderRightColor || c.animationName !== 'spin') still.push(theme + ' ' + sel);
      }
    }
    document.documentElement.dataset.theme = 'atelier'; box.remove();
    return still;
  });
  assert(wheels.length === 0, 'chaque roue montre son quart qui tourne, dans les deux thèmes ' + JSON.stringify(wheels));
  // a settings page's bar: its message is a line of text, not a box; empty it shows nothing, filled the bar keeps its height
  const settingsBar = await p.evaluate(() => {
    document.body.classList.add('settings');
    const box = document.createElement('div'); box.className = 'bar';
    box.innerHTML = '<span class="msg" role="status"></span><button type="submit" class="save" disabled>Enregistrer</button>';
    document.body.append(box);
    const m = box.querySelector('.msg'), empty = { w: m.getBoundingClientRect().width, h: box.getBoundingClientRect().height };
    m.textContent = '1 réglage modifié, pas encore enregistré.';
    const c = getComputedStyle(m), filled = { h: box.getBoundingClientRect().height, bg: c.backgroundColor, border: c.borderTopWidth, pad: c.paddingTop };
    box.remove(); document.body.classList.remove('settings');
    return { empty, filled };
  });
  assert(settingsBar.empty.w === 0 && settingsBar.filled.h === settingsBar.empty.h && settingsBar.filled.bg === 'rgba(0, 0, 0, 0)' && settingsBar.filled.border === '0px' && settingsBar.filled.pad === '0px',
    'la barre d’une page de réglages : son message est une ligne de texte, invisible vide, sans changer la hauteur une fois écrit ' + JSON.stringify(settingsBar));
  // the form sent above loads this page again in its hidden frame, which reads what a page left for after sign in:
  // let it finish first, so that it cannot take what the next check leaves
  await p.waitForFunction(() => { const f = document.querySelector('iframe[name="sink"]'); try { return f.contentWindow.ds && f.contentDocument.readyState === 'complete'; } catch (e) { return false; } });
  // an ended session goes to sign in, and back the page opens where it was
  await p.evaluate(() => { location.hash = 'analyse/x'; });
  await p.evaluate(() => ds.api('GET', '/api/ended').catch(() => {}));
  await p.waitForURL(/\/login/);
  await p.goto(base + '/checks/behaviours.html');
  await p.waitForFunction(() => window.side);
  assert(await p.evaluate(() => location.hash) === '#analyse/x', 'une session finie mène à la connexion, puis la page rouvre où elle était');
  // a card's title too long for its menu: its letters closer, then smaller, only as much as needed; one that fits never,
  // nor one that would not fit even at the least
  const fits = await p.evaluate(async () => {
    const make = (w, t) => { const d = document.createElement('div'); d.className = 'card'; d.style.width = w + 'px';
      d.innerHTML = '<h2 class="ct">' + t + '<label class="pill"><span class="pv">novembre 2026</span><select><option>novembre 2026</option></select></label></h2>';
      document.body.append(d); return d.firstChild; };
    const roomy = make(600, 'Dépenses par catégorie'), tight = make(392, 'Dépenses par catégorie'), never = make(200, 'Dépenses par catégorie');
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const pv = tight.querySelector('.pill').getBoundingClientRect(), words = document.createRange();
    words.selectNodeContents(tight.firstChild);
    const res = [roomy.className, tight.className, never.className, pv.top < words.getBoundingClientRect().bottom];
    [roomy, tight, never].forEach(h => h.parentNode.remove());
    return res;
  });
  assert(fits[0] === 'ct' && /ct-fit-/.test(fits[1]) && fits[3] && fits[2] === 'ct',
    'un titre trop long pour son menu se resserre puis rapetisse, seulement s’il le faut ' + JSON.stringify(fits));
  // ds.confirm keeps the keyboard: Tab goes round inside, the page behind is inert, the window is named and described
  await p.evaluate(() => { window.asked = ds.confirm({ title: 'Supprimer la règle ?', text: 'Elle ne sera plus appliquée.', ok: 'Supprimer', danger: true }); });
  const inside = [];
  for (let i = 0; i < 5; i++) {
    await p.keyboard.press(i === 4 ? 'Shift+Tab' : 'Tab');
    inside.push(await p.evaluate(() => !!document.activeElement.closest('.dialog')));
  }
  const named = await p.evaluate(() => {
    const d = document.querySelector('.dialog'), t = document.getElementById(d.getAttribute('aria-labelledby')), x = document.getElementById(d.getAttribute('aria-describedby'));
    const behind = [...document.body.children].filter(c => !c.classList.contains('dialog-veil') && !c.classList.contains('toasts') && c.tagName !== 'SCRIPT');
    return { title: t && t.textContent, text: x && x.textContent, inert: behind.every(c => c.inert), toasts: !document.querySelector('.toasts').inert };
  });
  await p.keyboard.press('Escape');
  const after = await p.evaluate(async () => ({ answer: await window.asked, inert: [...document.body.children].some(c => c.inert) }));
  assert(inside.every(Boolean) && named.title === 'Supprimer la règle ?' && named.text === 'Elle ne sera plus appliquée.' && named.inert && named.toasts
    && after.answer === false && !after.inert, 'ds.confirm garde le clavier, rend la page derrière inerte, se nomme et se décrit ' + JSON.stringify([inside, named, after]));
  const ids = await p.evaluate(() => { ds.confirm({ title: 'Un', value: '' }); ds.confirm({ title: 'Deux', value: '' });
    const t = [...document.querySelectorAll('.dialog-t')].map(h => h.id), f = [...document.querySelectorAll('.dialog-in')].map(i => i.getAttribute('aria-labelledby'));
    document.querySelectorAll('.dialog-no').forEach(b => b.click()); return { t, f }; });
  assert(ids.t.length === 2 && ids.t[0] !== ids.t[1] && ids.f[0] === ids.t[0] && ids.f[1] === ids.t[1], 'deux fenêtres ont chacune leur nom, et leur champ porte leur titre ' + JSON.stringify(ids));

  // a bubble waits while the keyboard is on it, is read aloud by a line that stays on the page, and goes once its fade is over
  const regions = await p.evaluate(() => [...document.querySelectorAll('.toasts > [aria-live]')].map(r => r.getAttribute('role') + ':' + r.getAttribute('aria-live')).join(' '));
  await p.evaluate(() => { window.held = ds.toast({ type: 'info', text: 'Sélection rouverte', duration: 400, action: { label: 'Annuler', run() {} } }); });
  await p.focus('.toast .act');
  await p.waitForTimeout(800);
  const kept = await p.evaluate(() => ({ there: !!document.querySelector('.toast:not(.out)'), said: document.querySelector('.toasts [role="status"]').textContent }));
  await p.evaluate(() => document.activeElement.blur());
  await p.waitForTimeout(900);
  const gone = await p.evaluate(() => !document.querySelector('.toast .txt') || ![...document.querySelectorAll('.toast .txt')].some(t => t.textContent === 'Sélection rouverte'));
  assert(regions === 'status:polite alert:assertive' && kept.there && kept.said === 'Sélection rouverte' && gone,
    'une bulle attend sous le clavier, est lue par une ligne qui reste dans la page, puis s’en va ' + JSON.stringify([regions, kept, gone]));
  const fade = await p.evaluate(async () => {
    document.documentElement.dataset.theme = 'vitrine';
    const t = ds.toast({ type: 'good', text: 'Fondu entier' }), el = t.el; t.close();
    const at = ms => new Promise(r => setTimeout(() => r(el.isConnected), ms));
    const mid = await at(220), end = await at(200);
    document.documentElement.dataset.theme = 'atelier';
    return [mid, end];
  });
  assert(fade[0] === true && fade[1] === false, 'en Vitrine, une bulle reste le temps de son fondu (0,3 s), puis s’en va ' + JSON.stringify(fade));

  // fitting the titles measures only when a title comes or what it holds changes: not on a text changed elsewhere
  const measures = await p.evaluate(async () => {
    let n = 0;
    const orig = Range.prototype.getBoundingClientRect;
    Range.prototype.getBoundingClientRect = function () { n++; return orig.call(this); };
    const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const card = document.createElement('section'); card.className = 'card'; card.style.width = '392px';
    card.innerHTML = '<h2 class="ct">Dépenses par catégorie<label class="pill"><span class="pv">Novembre 2026</span></label></h2><p class="pc">0 %</p>';
    document.body.append(card); await frame();
    const onCome = n; n = 0;
    for (let i = 1; i <= 6; i++) { card.querySelector('.pc').textContent = i * 10 + ' %'; await frame(); }
    const onText = n; n = 0;
    card.querySelector('.pv').textContent = 'Octobre 2026'; await frame();
    const onHeld = n;
    Range.prototype.getBoundingClientRect = orig; card.remove();
    return { onCome, onText, onHeld };
  });
  assert(measures.onCome > 0 && measures.onText === 0 && measures.onHeld > 0,
    'l’ajustement des titres mesure à l’arrivée d’un titre et quand ce qu’il porte change, jamais sur un texte ailleurs ' + JSON.stringify(measures));

  // a date that cannot be read is written « — », as a missing figure, instead of stopping the page
  const unread = await p.evaluate(() => [ds.date('pas une date'), ds.when('pas une date'), ds.ago('pas une date'), ds.soon('pas une date'), ds.date('2026-11-09')]);
  assert(unread.slice(0, 4).every(x => x === '—') && unread[4] === '9 novembre 2026', 'une date illisible s’écrit « — » ' + JSON.stringify(unread));

  // a loading of 3s is heard twice, not at every step of its share: its words at the start, « Chargement terminé » at the end
  const heard = await p.evaluate(async () => {
    const region = document.querySelector('header.top .busy'), boot = document.getElementById('boot-pc');
    const exposed = el => [...el.childNodes].map(n => n.nodeType === 3 ? n.textContent : n.nodeType === 1 && n.getAttribute('aria-hidden') !== 'true' ? exposed(n) : '').join('');
    const seen = []; let last = null;
    const look = () => { const t = getComputedStyle(region).visibility === 'visible' ? exposed(region).trim() : ''; if (t !== last) { seen.push(t); last = t; } };
    const timer = setInterval(look, 20);
    ds.busy.start('Lecture des banques', { expected: 3000 });
    await new Promise(r => setTimeout(r, 3000));
    const shown = region.querySelector('.pc').textContent, bootHidden = boot.getAttribute('aria-hidden');
    ds.busy.done();
    await new Promise(r => setTimeout(r, 900));
    clearInterval(timer);
    return { seen: seen.filter(Boolean), shown, bootHidden };
  });
  assert(heard.seen.length <= 3 && heard.seen[0] === 'Lecture des banques' && heard.seen[heard.seen.length - 1] === 'Chargement terminé'
    && /^\d+%$/.test(heard.shown) && heard.bootHidden === 'true',
    'un chargement de 3 s se dit au début et à la fin, sa part reste affichée sans être lue ' + JSON.stringify(heard));

  // less motion: the durations are nothing and every wheel stands still, in both themes
  await p.emulateMedia({ reducedMotion: 'reduce' });
  const still = await p.evaluate(() => {
    const box = document.createElement('div');
    box.innerHTML = '<div class="toast is-busy"><i class="mark"></i></div><div class="msg"><span class="act"><i class="spin"></i></span></div>'
      + '<header class="top"><span class="busy"><i class="spin"></i></span></header><div class="boot"><div class="boot-p"><i class="spin"></i></div></div>'
      + '<i class="spinner"></i><button class="btn is-busy">Envoyer</button>';
    document.body.append(box);
    const moving = [];
    for (const theme of ['atelier', 'vitrine']) {
      document.documentElement.dataset.theme = theme;
      const root = getComputedStyle(document.documentElement);
      if (['--t-fast', '--t-mid', '--t-slow'].some(t => parseFloat(root.getPropertyValue(t)) !== 0)) moving.push(theme + ' durées');
      for (const sel of ['.toast .mark', '.msg .spin', 'header.top .spin', '.boot-p .spin', '.spinner']) {
        const c = getComputedStyle(box.querySelector(sel));
        if (parseFloat(c.animationDuration) !== 0 || c.animationIterationCount !== '1') moving.push(theme + ' ' + sel);
      }
      const after = getComputedStyle(box.querySelector('.btn.is-busy'), '::after');
      if (parseFloat(after.animationDuration) !== 0 || after.animationIterationCount !== '1') moving.push(theme + ' .btn.is-busy');
    }
    document.documentElement.dataset.theme = 'atelier'; box.remove();
    return moving;
  });
  await p.emulateMedia({ reducedMotion: 'no-preference' });
  assert(still.length === 0, 'quand l’appareil demande moins d’animations, plus de durée et chaque roue s’arrête, dans les deux thèmes ' + JSON.stringify(still));

  assert(errors.length === 0, 'aucune erreur dans la page ' + errors.join(' '));
  await b.close();
  server.close();
})();
