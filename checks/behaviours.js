// The shared behaviour of ds.js in a real browser: the drawer, the sources' state, the time in words, the header's
// loading wheel, a failing source's bubble, the main views' bar.
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
  // the message left after a redirect, the screen readers' words, the cards' grid
  const left = await p.evaluate(() => ({ toast: [...document.querySelectorAll('.toast .txt')].some(t => t.textContent === 'Sélection terminée'),
    vh: getComputedStyle(document.getElementById('vh')).width, gc: getComputedStyle(document.getElementById('gc')).display }));
  assert(left.toast && left.vh === '1px' && left.gc === 'grid', 'le message laissé après une redirection, le texte des lecteurs d’écran, la grille de cartes ' + JSON.stringify(left));
  // an ended session goes to sign in, and back the page opens where it was
  await p.evaluate(() => { location.hash = 'analyse/x'; });
  await p.evaluate(() => ds.api('GET', '/api/ended').catch(() => {}));
  await p.waitForURL(/\/login/);
  await p.goto(base + '/checks/behaviours.html');
  await p.waitForFunction(() => window.side);
  assert(await p.evaluate(() => location.hash) === '#analyse/x', 'une session finie mène à la connexion, puis la page rouvre où elle était');
  assert(errors.length === 0, 'aucune erreur dans la page ' + errors.join(' '));
  await b.close();
  server.close();
})();
