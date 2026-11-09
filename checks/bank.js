// Bank's components in a real browser: the sheet, the sortable table and its cards on a phone, the multiple choice and
// its bar, the pill, the search picker, drag to reorder, the bars and the coloured cards; and their stylesheets, which
// name a token for every value.
// usage: node checks/bank.js (Playwright installed); it serves the repository itself on a free port
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
const keys = (p, sel) => p.evaluate(s => [...document.querySelectorAll(s)].map(x => x.dataset.key).join(','), sel);

// the stylesheets: a token for every colour, size, space, radius, layer, duration and shadow; only the three widths
function stylesheets() {
  const files = ['pick', 'sheet', 'table', 'reorder', 'meter', 'ruled'].map(n => 'src/' + n + '.css');
  const props = /^(color|background(-color)?|font(-size)?|line-height|letter-spacing|margin(-\w+)*|padding(-\w+)*|gap|row-gap|column-gap|border-radius|z-index|box-shadow|transition|animation(-duration)?|text-shadow|outline-offset)$/;
  const wrong = [];
  for (const f of files) {
    const css = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i.test(css)) wrong.push(f + ': a colour written out');
    for (const m of css.matchAll(/@media\s*([^{]+)\{/g)) {
      if (!/^\((max-width: (480|768|1024)px|hover: hover|prefers-reduced-motion: reduce)\)\s*$/.test(m[1].trim())) wrong.push(f + ': @media ' + m[1].trim());
    }
    for (const m of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/g)) {
      const [, prop, value] = m;
      if (!props.test(prop)) continue;
      // a share in a mix of colours, and a ring's 50%, are no sizes
      const raw = value.replace(/env\([^)]*\)/g, '').replace(/\)\s*\/\s*2\b/g, ')').replace(/(color-mix\([^%]*?)\d+%/g, '$1').replace(/^50%$/, '').match(/(^|[\s(,/])-?\d*\.?\d+(px|em|rem|ms|s|%)?(?=$|[\s),/])/g);
      const bad = (raw || []).map(x => x.trim().replace(/^[(,/]/, '')).filter(x => x !== '0' && x !== '0px' && x !== '-1' && !(prop.startsWith('font') && /^\d00$/.test(x)) && !(prop === 'transition' && x === '0'));
      if (prop === 'z-index' && !/var\(/.test(value)) bad.push(value);
      if (bad.length) wrong.push(f + ': ' + prop + ': ' + value.trim() + ' (' + bad.join(' ') + ')');
    }
  }
  return wrong;
}

(async () => {
  const wrong = stylesheets();
  assert(!wrong.length, 'les feuilles de style ne nomment que des jetons, et les trois largeurs ' + wrong.join(' | '));
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const errors = [];

  // ---------- on a computer ----------
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(String(e)));
  const ready = async () => { await p.goto(base + '/checks/bank.html'); await p.waitForFunction(() => window.order); };
  await ready();

  // the sortable table
  const sortOf = () => p.evaluate(() => [...document.querySelectorAll('#ops th')].map(th => th.getAttribute('aria-sort') || '').join(','));
  const arrow = by => p.evaluate(by => getComputedStyle(document.querySelector('#ops .sort[data-sort="' + by + '"]'), '::after').content, by);
  assert(await keys(p, '#ops tbody tr') === 'a,b,c,d,e' && await sortOf() === ',descending,none,none,none' && /↓/.test(await arrow('date')),
    'au départ, les plus récentes d’abord : la colonne Date le dit, sa flèche en or');
  await p.click('#ops .sort[data-sort="montant"]');
  assert(await keys(p, '#ops tbody tr') === 'd,b,c,a,e' && await sortOf() === ',none,none,none,descending' && await p.inputValue('#sortmenu') === 'montant|0',
    'une colonne de chiffres commence par les plus grands (« −1 234,50€ » lu comme un nombre), le menu suit');
  await p.click('#ops .sort[data-sort="montant"]');
  assert(await keys(p, '#ops tbody tr') === 'e,a,c,b,d' && /↑/.test(await arrow('montant')) && await p.textContent('#sortpill .pv') === 'Grosses dépenses d’abord',
    'un deuxième clic retourne l’ordre ; la pilule du téléphone dit le nouveau choix');
  await p.click('#ops .sort[data-sort="nom"]');
  assert(await keys(p, '#ops tbody tr') === 'e,b,a,d,c', 'une colonne de mots commence par A, dans l’ordre français (Écoles avec les E)');
  await p.click('#ops .sort[data-sort="note"]');
  const n1 = await keys(p, '#ops tbody tr');
  await p.click('#ops .sort[data-sort="note"]');
  const n2 = await keys(p, '#ops tbody tr');
  assert(n1 === 'd,a,c,e,b' && n2 === 'c,a,d,e,b', 'les cases vides restent en bas, dans un sens comme dans l’autre ' + n1 + ' / ' + n2);
  // the menu is the phone's: on a computer it is hidden, so it is changed as a finger would
  await p.evaluate(() => { const m = document.getElementById('sortmenu'); m.value = 'date|1'; m.dispatchEvent(new Event('change', { bubbles: true })); });
  assert(await keys(p, '#ops tbody tr') === 'e,d,c,b,a' && await sortOf() === ',ascending,none,none,none', 'le menu trie aussi, et les titres le suivent');
  // a page that sorts and draws its table itself (Studio's people), its choice kept under a key
  assert(await p.evaluate(() => [...document.querySelectorAll('#ppl th')].every(th => th.getAttribute('aria-sort') === 'none')), 'sans choix gardé, aucune colonne n’est marquée');
  await p.click('#ppl .sort[data-sort="1"]');
  const ppl1 = await p.evaluate(() => ({ rows: [...document.querySelectorAll('#ppl tbody td:first-child')].map(x => x.textContent).join(','), mark: document.querySelector('#ppl .sort[data-sort="1"]').closest('th').getAttribute('aria-sort') }));
  await p.click('#ppl .sort[data-sort="1"]');
  await p.click('#ppl .sort[data-sort="0"]');
  await p.click('#ppl .sort[data-sort="2"]');
  const seen = await p.evaluate(() => log.filter(x => x.startsWith('sort:')).join(' '));
  assert(ppl1.rows === 'Marc,Élisa,Zoé,Anna' && ppl1.mark === 'descending' && seen === 'sort:1:false sort:1:true sort:0:true sort:2:false',
    'onSort : la page trie et redessine ; chiffres d’abord les plus grands, noms dès A, « data-first » respecté ' + seen);
  await ready();
  assert(await p.evaluate(() => document.querySelector('#ppl .sort[data-sort="2"]').closest('th').getAttribute('aria-sort')) === 'descending', 'le choix gardé sous sa clé revient avec la page');

  // the multiple choice and its bar
  await p.click('#ops tr[data-key="b"] .sel-box');
  const s1 = await p.evaluate(() => ({ bar: !document.getElementById('bar').hidden, n: document.querySelector('.selbar-n').textContent, lit: document.querySelector('tr[data-key="b"]').classList.contains('is-selected'), half: document.querySelector('.sel-all').indeterminate }));
  await p.click('#ops tr[data-key="d"] .sel-box', { modifiers: ['Shift'] });
  const s2 = await p.evaluate(() => ({ keys: sel.keys().sort().join(','), n: document.querySelector('.selbar-n').textContent }));
  assert(s1.bar && s1.n === '1 opération choisie' && s1.lit && s1.half && s2.keys === 'b,c,d' && s2.n === '3 opérations choisies',
    'une case choisit sa ligne et montre la barre ; Maj-clic choisit toutes celles d’entre deux');
  await p.click('.sel-all');
  const s3 = await p.evaluate(() => ({ n: sel.keys().length, all: document.querySelector('.sel-all').checked }));
  await p.click('#bar [data-sel-clear]');
  const s4 = await p.evaluate(() => ({ n: sel.keys().length, bar: document.getElementById('bar').hidden, lit: document.querySelectorAll('#ops .is-selected').length }));
  assert(s3.n === 5 && s3.all && s4.n === 0 && s4.bar && s4.lit === 0, 'la case du titre choisit tout ; « Annuler » vide le choix et cache la barre');
  await p.click('#ops tr[data-key="a"] .sel-box');
  const kept = await p.evaluate(() => { const body = document.querySelector('#ops tbody'); body.innerHTML = body.innerHTML.replace(/ checked=""/g, '').replace(/ class="is-link is-selected"/g, ' class="is-link"'); sel.paint();
    const r = document.querySelector('tr[data-key="a"]'); return r.classList.contains('is-selected') && r.querySelector('.sel-box').checked && log.includes('sel:a'); });
  assert(kept, 'redessinée, la liste garde son choix (paint), et onChange l’a dit');
  await p.click('#bar [data-sel-clear]');

  // the pill
  const pill = async () => p.evaluate(() => { const l = document.getElementById('pill'), s = l.querySelector('select'), a = l.getBoundingClientRect(), z = s.getBoundingClientRect();
    return { pv: l.querySelector('.pv').textContent, on: l.classList.contains('is-on'), over: a.width - z.width <= 2 && a.height - z.height <= 2, seen: getComputedStyle(s).opacity }; });
  const p1 = await pill();
  await p.selectOption('#pill-sel', 'revolut');
  const p2 = await pill();
  await p.selectOption('#pill-sel', '');
  const p3 = await pill();
  assert(p1.pv === 'Tous les comptes' && !p1.on && p1.over && p1.seen === '0' && p2.pv === 'Revolut' && p2.on && !p3.on,
    'la pilule dit le choix de son menu, posé dessus sans se voir ; un filtre en service s’allume ' + JSON.stringify([p1, p2, p3]));

  // the sheet, on a computer: a window in the middle of the screen (measured once it has come in)
  const slid = () => p.waitForTimeout(450);
  await p.click('#open');
  await slid();
  const sh1 = await p.evaluate(() => { const panel = document.querySelector('#sheet .sheet-panel'), r = panel.getBoundingClientRect();
    return { open: !document.getElementById('sheet').hidden && sheet.isOpen, focus: document.activeElement === panel, w: Math.round(r.width), gap: Math.round((document.getElementById('sheet').getBoundingClientRect().right - r.right) - (r.left - document.getElementById('sheet').getBoundingClientRect().left)), top: Math.round(r.top), bottom: Math.round(innerHeight - r.bottom), x: document.querySelector('#sheet .sheet-x').getAttribute('aria-label') }; });
  assert(sh1.open && sh1.focus && sh1.w === 560 && Math.abs(sh1.gap) <= 1 && sh1.top > 0 && sh1.bottom > 0 && sh1.x === 'Fermer', 'la fiche s’ouvre en fenêtre au milieu, le curseur y entre, la croix dit « Fermer » ' + JSON.stringify(sh1));
  await p.focus('#last-act');
  await p.keyboard.press('Tab');
  const t1 = await p.evaluate(() => document.activeElement.classList.contains('sheet-x'));
  await p.keyboard.press('Shift+Tab');
  const t2 = await p.evaluate(() => document.activeElement.id);
  assert(t1 && t2 === 'last-act', 'Tab tourne dans la fiche, dans les deux sens');
  // the cross stays in its corner while a long sheet scrolls
  const stuck = await p.evaluate(async () => { const panel = document.querySelector('#sheet .sheet-panel'); panel.scrollTop = 900; await new Promise(r => requestAnimationFrame(r));
    const x = document.querySelector('#sheet .sheet-x').getBoundingClientRect().top - panel.getBoundingClientRect().top; panel.scrollTop = 0; return Math.round(x); });
  assert(stuck >= 0 && stuck <= 24, 'la croix reste dans son coin quand une longue fiche défile (' + stuck + 'px)');
  await p.keyboard.press('Escape');
  assert(await p.evaluate(() => document.getElementById('sheet').hidden && document.activeElement.id === 'open' && log.includes('closed')), 'Échap ferme, le curseur revient au bouton, onClose est appelé');
  await p.click('#open');
  await slid();
  await p.mouse.click(40, 450);
  const veil = await p.evaluate(() => document.getElementById('sheet').hidden);
  await p.click('#open');
  await slid();
  await p.mouse.click(640, 450);
  const inside = await p.evaluate(() => !document.getElementById('sheet').hidden);
  await p.click('#sheet .sheet-x');
  assert(veil && inside && await p.evaluate(() => document.getElementById('sheet').hidden), 'un clic sur le voile ferme, un clic dans la fiche non, la croix ferme');
  // a window over the sheet, a field inside it: each takes its own Escape first
  await p.click('#open');
  await slid();
  await p.evaluate(() => { window.asked = ds.confirm({ title: 'Supprimer ?', danger: true }); });
  await p.keyboard.press('Escape');
  const e1 = await p.evaluate(async () => ({ dialog: !!document.querySelector('.dialog-veil'), sheet: sheet.isOpen, answer: await asked }));
  await p.click('#sheet-pick .picker-q');
  await p.keyboard.type('zz');
  await p.keyboard.press('Escape');
  const e2 = await p.evaluate(() => ({ q: document.querySelector('#sheet-pick .picker-q').value, sheet: sheet.isOpen }));
  await p.keyboard.press('Escape');
  assert(!e1.dialog && e1.sheet && e1.answer === false && e2.q === '' && e2.sheet && await p.evaluate(() => !sheet.isOpen),
    'Échap ferme d’abord la fenêtre posée sur la fiche, puis vide la recherche d’un champ, puis ferme la fiche');

  // the search picker behind the dashed button
  assert(await p.evaluate(() => getComputedStyle(document.getElementById('add')).borderTopStyle === 'dashed' && document.getElementById('banks').hidden), 'le bouton pointillé, le sélecteur caché');
  await p.click('#add');
  const k1 = await p.evaluate(() => ({ open: !document.getElementById('banks').hidden, exp: document.getElementById('add').getAttribute('aria-expanded'), focus: document.activeElement.classList.contains('picker-q'), text: document.querySelector('#banks .picker-none').textContent }));
  await p.evaluate(() => setBanks());
  const k2 = await p.evaluate(() => [...document.querySelectorAll('#banks .picker-opt')].map(o => o.querySelector('.picker-name').textContent).join(','));
  assert(k1.open && k1.exp === 'true' && k1.focus && k1.text === 'Chargement de la liste…' && k2 === 'BoursoBank déjà reliée,LCL,Revolut',
    'le bouton ouvre le sélecteur, le curseur dans sa recherche ; « Chargement… », puis les banques que la plupart ont');
  await p.keyboard.type('credit');
  const k3 = await p.evaluate(() => [...document.querySelectorAll('#banks .picker-name')].map(o => o.textContent).join(','));
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('ArrowDown');
  const lit = await p.evaluate(() => { const q = document.querySelector('#banks .picker-q'); return document.getElementById(q.getAttribute('aria-activedescendant')).textContent; });
  await p.keyboard.press('Enter');
  assert(k3 === 'Crédit Agricole,Crédit Mutuel' && /Crédit Mutuel/.test(lit) && await p.evaluate(() => log.includes('bank:Crédit Mutuel')),
    'la recherche ignore les accents ; ↓ allume un choix, Entrée le prend');
  await p.fill('#banks .picker-q', 'zzz');
  const none = await p.textContent('#banks .picker-none');
  await p.keyboard.press('Escape');
  const cleared = await p.inputValue('#banks .picker-q');
  await p.keyboard.press('Escape');
  assert(none === 'Aucune banque ne correspond.' && cleared === '' && await p.evaluate(() => document.getElementById('banks').hidden && document.getElementById('add').getAttribute('aria-expanded') === 'false' && document.activeElement.id === 'add'),
    'rien ne correspond : il le dit ; Échap vide la recherche, puis ferme et rend le curseur au bouton');
  const c1 = await p.evaluate(() => ({ heads: [...document.querySelectorAll('#cats .picker-g')].map(x => x.textContent).join(','), on: document.querySelector('#cats [aria-selected="true"]').textContent }));
  await p.fill('#cats .picker-q', 'loisirs ci');
  const c2 = await p.evaluate(() => [...document.querySelectorAll('#cats .picker-name')].map(o => o.textContent).join(','));
  await p.click('#cats .picker-opt');
  const c3 = await p.evaluate(() => ({ log: log.includes('cat:Loisirs|Cinéma'), on: document.querySelector('#cats [aria-selected="true"]').textContent }));
  assert(c1.heads === 'Courses,Loisirs,Déplacements' && c1.on === 'Bar' && c2 === 'Cinéma' && c3.log && c3.on === 'Cinéma',
    'les choix sous leurs titres, le choix en cours marqué ; chaque mot cherché compte ; un clic choisit');

  // drag to reorder, with the mouse
  const drag = async (sel, dy) => {
    const r = await p.locator(sel).boundingBox();
    await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
    await p.mouse.down();
    for (let i = 1; i <= 10; i++) { await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2 + dy * i / 10); await p.waitForTimeout(16); }
    await p.mouse.up();
    // the item lands, sliding into its place
    await p.waitForTimeout(400);
  };
  await p.evaluate(() => document.getElementById('order').scrollIntoView());
  const label = await p.getAttribute('#order .grip', 'aria-label');
  const groupH = await p.evaluate(() => document.querySelector('#order > div').offsetHeight);
  await drag('#order > div[data-key="bourso"] > h4 .grip', groupH * 2.3);
  const g1 = await keys(p, '#order > div'), a1 = await keys(p, '#order li');
  assert(label === 'Déplacer' && g1 === 'revolut,fortuneo,bourso' && a1 === 'r1,f1,b1,b2,b3' && await p.evaluate(() => log.includes('groups:revolut,fortuneo,bourso:bourso')),
    'à la souris, une banque passe sous les autres avec ses comptes ; onEnd dit le nouvel ordre ' + g1);
  // in the middle of the screen, away from the edges where the page would scroll along
  await p.evaluate(() => document.querySelector('#order div[data-key="bourso"]').scrollIntoView({ block: 'center' }));
  const itemH = await p.evaluate(() => document.querySelector('#order div[data-key="bourso"] li').offsetHeight);
  await drag('#order li[data-key="b1"] .grip', itemH * 1.2);
  assert(await keys(p, '#order div[data-key="bourso"] li') === 'b2,b1,b3' && await keys(p, '#order > div') === 'revolut,fortuneo,bourso'
    && await p.evaluate(() => log.includes('accs:b2,b1,b3') && log.filter(x => x.startsWith('groups:')).length === 1), 'un compte bouge dans sa banque, sans bouger les banques '
    + await keys(p, '#order div[data-key="bourso"] li') + ' ' + await p.evaluate(() => log.join(' ')));
  await p.focus('#order li[data-key="b3"] .grip');
  await p.keyboard.press('ArrowUp');
  assert(await keys(p, '#order div[data-key="bourso"] li') === 'b2,b3,b1' && await p.evaluate(() => document.activeElement.closest('li').dataset.key === 'b3' && log.includes('accs:b2,b3,b1')),
    'au clavier, ↑ sur la poignée monte le compte d’un cran et la poignée garde le curseur');
  await drag('#order li[data-key="b2"] .grip', -itemH * 3);
  assert(await keys(p, '#order div[data-key="bourso"] li') === 'b2,b3,b1', 'tiré plus haut que sa liste, un compte y reste, et rien n’est dit');

  // the compact tiles: small frames apart, the label above its figure; in vitrine, the site's small cards
  const tilesLook = pg => pg.evaluate(() => {
    const color = name => { const i = document.createElement('i'); i.style.color = 'var(' + name + ')'; document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return c; };
    const list = document.getElementById('ctiles'), [one, up] = list.querySelectorAll('.tile'), dt = one.querySelector('dt'), dd = one.querySelector('dd');
    return { gap: getComputedStyle(list).columnGap, shadow: getComputedStyle(one).boxShadow !== 'none', figureFirst: dd.getBoundingClientRect().top < dt.getBoundingClientRect().top,
      size: getComputedStyle(dd).fontSize, gold: getComputedStyle(dd).color === color('--accent-strong'), up: getComputedStyle(up.querySelector('dd')).color === color('--good'),
      radius: getComputedStyle(one).borderTopLeftRadius };
  });
  const ta = await tilesLook(p);
  assert(ta.gap === '8px' && !ta.shadow && !ta.figureFirst && ta.size === '17px' && ta.up && ta.radius === '6px',
    'les tuiles compactes : de petits cadres à 8px les uns des autres, le libellé au-dessus du chiffre, sans ombre ' + JSON.stringify(ta));
  // the bars and the coloured cards
  const look = await p.evaluate(() => { const probe = document.createElement('i'); probe.style.color = 'var(--c-rose)'; document.body.append(probe); const rose = getComputedStyle(probe).color; probe.style.color = 'var(--accent)'; const gold = getComputedStyle(probe).color; probe.remove();
    const m = document.getElementById('meter'), fill = m.firstElementChild;
    return { tinted: getComputedStyle(document.getElementById('tinted')).borderTopColor === rose, label: getComputedStyle(document.querySelector('#tinted .ct')).color === rose,
      ruled: getComputedStyle(document.getElementById('ruled')).borderTopColor === gold, fill: Math.round(fill.offsetWidth / m.offsetWidth * 100), bar: getComputedStyle(fill).backgroundColor };
  });
  assert(look.tinted && look.label && look.ruled && look.fill === 40, 'la carte au filet de sa couleur (--n), l’or sans elle ; la barre remplie à sa part ' + JSON.stringify(look));
  assert(await p.evaluate(() => getComputedStyle(document.getElementById('sortpill')).display) === 'none', 'sur ordinateur, le menu de tri se cache : les titres trient');
  await ctx.close();

  // ---------- on a phone ----------
  const phone = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const q = await phone.newPage();
  q.on('pageerror', e => errors.push(String(e)));
  await q.goto(base + '/checks/bank.html');
  await q.waitForFunction(() => window.order);
  const cards = await q.evaluate(() => {
    const t = document.getElementById('ops'), r = t.querySelector('tr[data-key="a"]'), main = r.querySelector('.tbl-main').getBoundingClientRect(), end = r.querySelector('.tbl-end').getBoundingClientRect(), ck = r.querySelector('.tbl-ck').getBoundingClientRect();
    const note = r.querySelector('[data-label]');
    return { head: getComputedStyle(t.tHead).display, row: getComputedStyle(r).display, wide: getComputedStyle(r.querySelector('.tbl-wide')).display, phone: getComputedStyle(r.querySelector('.tbl-phone')).display,
      line: Math.abs(main.top - end.top) < 2 && ck.right <= main.left && end.left >= main.right, label: getComputedStyle(note, '::before').content, under: note.getBoundingClientRect().top >= main.bottom - 1,
      menu: getComputedStyle(document.getElementById('sortpill')).display, wider: document.documentElement.scrollWidth <= 375 };
  });
  assert(cards.head === 'none' && cards.row === 'grid' && cards.wide === 'none' && cards.phone === 'block' && cards.line && cards.label === '"Note"' && cards.under && cards.menu !== 'none' && cards.wider,
    'sur téléphone chaque ligne devient une carte : la case, le nom et le montant sur une ligne, le reste dessous nommé ; le menu remplace les titres ' + JSON.stringify(cards));
  await q.tap('#ops tr[data-key="c"] .sel-box');
  assert(await q.evaluate(() => sel.has('c') && !document.getElementById('bar').hidden && getComputedStyle(document.querySelector('tr[data-key="c"]')).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'un toucher sur la case choisit la carte, éclairée en entier');
  await q.evaluate(() => sel.clear());
  await q.tap('#open');
  await q.waitForTimeout(400);
  const ps = await q.evaluate(() => { const r = document.querySelector('#sheet .sheet-panel').getBoundingClientRect(); return { bottom: Math.round(r.bottom), w: Math.round(r.width), top: Math.round(r.top), held: getComputedStyle(document.documentElement).overflow }; });
  const y0 = await q.evaluate(() => scrollY);
  await q.touchscreen.tap(180, 20);
  const after = await q.evaluate(() => ({ closed: document.getElementById('sheet').hidden, held: getComputedStyle(document.documentElement).overflow, y: scrollY }));
  assert(ps.bottom === 812 && ps.w === 375 && ps.top > 40 && ps.held === 'hidden' && after.closed && after.held !== 'hidden' && after.y === y0,
    'sur téléphone la fiche monte du bas, la page derrière ne défile plus ; un toucher sur le voile la ferme et rend la page ' + JSON.stringify([ps, after]));
  // the filters' drawer under the sheet: Escape closes the sheet on top, then the drawer
  await q.evaluate(() => { side.set(true); sheet.open(); });
  await q.keyboard.press('Escape');
  const d1 = await q.evaluate(() => ({ sheet: sheet.isOpen, side: side.open }));
  await q.keyboard.press('Escape');
  assert(!d1.sheet && d1.side && await q.evaluate(() => !side.open), 'sur téléphone, Échap ferme la fiche posée sur le tiroir de filtres, puis le tiroir');
  // drag to reorder with a finger
  await q.evaluate(() => document.getElementById('order').scrollIntoView());
  await q.waitForTimeout(100);
  const cdp = await phone.newCDPSession(q);
  const g = await q.locator('#order > div[data-key="revolut"] > h4 .grip').boundingBox(), gh = await q.evaluate(() => document.querySelector('#order > div').offsetHeight);
  const x = g.x + g.width / 2, y = g.y + g.height / 2;
  const sy = await q.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + gh * 1.4 * i / 12 }] }); await q.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await q.waitForTimeout(100);
  assert(await keys(q, '#order > div') === 'bourso,fortuneo,revolut' && await q.evaluate(sy => Math.abs(scrollY - sy) < 2, sy), 'au doigt, la poignée déplace la banque, sans faire défiler la page');
  await phone.close();

  // vitrine: square corners, its own room
  const vit = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const v = await vit.newPage();
  v.on('pageerror', e => errors.push(String(e)));
  await v.goto(base + '/checks/bank.html');
  await v.waitForFunction(() => window.order);
  await v.evaluate(() => { document.documentElement.dataset.theme = 'vitrine'; sheet.open(); });
  const vr = await v.evaluate(() => ({ panel: getComputedStyle(document.querySelector('#sheet .sheet-panel')).borderTopLeftRadius, pill: getComputedStyle(document.getElementById('pill')).borderTopLeftRadius,
    pad: getComputedStyle(document.querySelector('#sheet .sheet-panel')).paddingLeft, th: getComputedStyle(document.querySelector('#ops th')).fontSize }));
  assert(vr.panel === '0px' && vr.pill === '0px' && vr.pad === '32px' && vr.th === '12px', 'Vitrine : angles carrés, la place d’une fenêtre du site, des titres de colonne plus grands ' + JSON.stringify(vr));
  const shadows = await v.evaluate(() => { const card = document.createElement('div'); card.className = 'card'; document.body.append(card);
    const of = value => { card.style.setProperty('--card-shadow', value); return getComputedStyle(card).boxShadow; };
    const out = { card: of(''), soft: of('var(--shadow-soft)'), none: of('none') }; card.remove(); return out; });
  assert(/0px 4px 16px/.test(shadows.card) && /0px 2px 8px/.test(shadows.soft) && shadows.none === 'none',
    'Vitrine : une carte a l’ombre du site ; --card-shadow lui donne l’ombre légère d’une barre, ou aucune pour une ligne de liste ' + JSON.stringify(shadows));
  const tv = await tilesLook(v);
  assert(tv.gap === '20px' && tv.shadow && tv.figureFirst && tv.size === '28px' && tv.gold && tv.up && tv.radius === '0px',
    'Vitrine : les tuiles compactes sont les petites cartes du site, à part, avec une ombre douce, le chiffre or au-dessus de son libellé ' + JSON.stringify(tv));
  await v.setViewportSize({ width: 375, height: 812 });
  const tp = await tilesLook(v);
  assert(tp.gap === '16px' && tp.size === '22px' && tp.figureFirst, 'Vitrine, sur téléphone : les cartes plus serrées, le chiffre de 22px ' + JSON.stringify(tp));
  await vit.close();

  assert(errors.length === 0, 'aucune erreur dans la page ' + errors.join(' '));
  await b.close();
  server.close();
})();
