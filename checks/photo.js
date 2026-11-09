// The photo pieces in a real browser: the viewer (open, close, keys, buttons, finger, count, neighbours loaded ahead,
// spinner, focus, the page held still), a grid of links that opens it (ds.viewer.bind, and data-viewer with no code under
// script-src 'self'), the masonry grid and its zoom remembered, the hero and the back link in both themes; and their
// stylesheets, which name a token for every value.
// usage: node checks/photo.js (Playwright installed); it serves the repository itself on a free port, and photos made up
// on the fly at /photo/<n>.svg?w=&h=&ms= (ms: how long the server takes to send one)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2' };
const photo = (n, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<rect width="100%" height="100%" fill="hsl(${n * 47 % 360} 45% 42%)"/><text x="50%" y="50%" font-size="${Math.round(Math.min(w, h) / 4)}" fill="#fff" ` +
  `text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${n}</text></svg>`;
// a page with no script of its own, served as the site serves its pages: only scripts from the site itself
const cspPage = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="/dist/ds.css"><script src="/dist/ds.js" defer></script><script src="/dist/ds-photo.js" defer></script></head><body>
<div class="photogrid" data-viewer data-viewer-label="Galerie du site"><a href="/photo/51.svg?w=900&amp;h=600"><img src="/photo/51.svg?w=300&amp;h=200" width="300" height="200" alt="Cinquante et un"></a>
<a href="/photo/52.svg?w=600&amp;h=900"><img src="/photo/52.svg?w=200&amp;h=300" width="200" height="300" alt="Cinquante-deux"></a></div></body></html>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const m = url.pathname.match(/^\/photo\/(\d+)\.svg$/);
  if (m) {
    const w = +url.searchParams.get('w') || 300, h = +url.searchParams.get('h') || 200;
    return setTimeout(() => { res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=600' }); res.end(photo(+m[1], w, h)); }, +url.searchParams.get('ms') || 0);
  }
  if (url.pathname === '/csp.html') { res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:" }); return res.end(cspPage); }
  const file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };

// the stylesheets: a token for every colour, size, space, radius, layer, duration and shadow; only the three widths
function stylesheets() {
  const files = ['viewer', 'photogrid', 'hero', 'backlink'].map(n => 'src/' + n + '.css');
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
      const raw = value.replace(/env\([^)]*\)/g, '').replace(/\)\s*\/\s*2\b/g, ')').replace(/(color-mix\([^%]*?)\d+%/g, '$1').replace(/^50%$/, '').match(/(^|[\s(,/])-?\d*\.?\d+(px|em|rem|ms|s|%)?(?=$|[\s),/])/g);
      const bad = (raw || []).map(x => x.trim().replace(/^[(,/]/, '')).filter(x => x !== '0' && x !== '0px' && x !== '-1' && !(prop.startsWith('font') && /^\d00$/.test(x)));
      if (prop === 'z-index' && !/var\(/.test(value)) bad.push(value);
      if (bad.length) wrong.push(f + ': ' + prop + ': ' + value.trim() + ' (' + bad.join(' ') + ')');
    }
  }
  return wrong;
}

(async () => {
  const wrong = stylesheets();
  assert(!wrong.length, 'les feuilles de style ne nomment que des jetons, et les trois largeurs ' + wrong.join(' | '));
  assert(!/setAttribute\(\s*["']on|innerHTML|insertAdjacentHTML|\beval\(|new Function|javascript:/.test(fs.readFileSync(path.join(root, 'src/viewer.js'), 'utf8') + fs.readFileSync(path.join(root, 'src/photogrid.js'), 'utf8')),
    'aucun code écrit dans le balisage ni évalué : rien que la page du site (script-src \'self\') refuserait');
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  const errors = [];
  const watch = p => { p.on('pageerror', e => errors.push(String(e))); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };

  // ---------- on a computer ----------
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  watch(p);
  const asked = [];
  p.on('request', r => asked.push(r.url().replace(base, '')));
  const ready = async () => { await p.goto(base + '/checks/photo.html'); await p.waitForFunction(() => window.pg && window.bound); };
  await ready();
  const vw = () => p.evaluate(() => { const v = document.querySelector('.viewer'), img = v && v.querySelector('.viewer-stage img'), cap = v && v.querySelector('.viewer-caption');
    return v && { open: !v.hidden && v.classList.contains('is-open'), count: v.querySelector('.viewer-count').textContent, countShown: !v.querySelector('.viewer-count').hidden,
      src: img.getAttribute('src') || '', loading: img.classList.contains('is-loading'), placeholder: img.classList.contains('is-placeholder'),
      spin: !v.querySelector('.spinner.on-photo').hidden, focus: v.contains(document.activeElement), label: v.getAttribute('aria-label'),
      caption: cap && !cap.hidden && cap.closest('.viewer-bar').hidden === false ? cap.textContent : '', held: getComputedStyle(document.documentElement).overflow,
      viewers: document.querySelectorAll('.viewer').length }; });

  // opened from code, on the third photo
  await p.click('#open');
  const v0 = await vw();
  await p.waitForTimeout(300);
  const v1 = await vw();
  const roles = await p.evaluate(() => { const v = document.querySelector('.viewer');
    return { role: v.getAttribute('role'), modal: v.getAttribute('aria-modal'), x: v.querySelector('.viewer-close').getAttribute('aria-label'),
      prev: v.querySelector('.viewer-prev').getAttribute('aria-label'), next: v.querySelector('.viewer-next').getAttribute('aria-label'),
      inline: [...v.querySelectorAll('*')].some(x => [...x.attributes].some(a => /^on/.test(a.name))), active: document.activeElement === v }; });
  assert(v0.open && v0.count === '3 / 5' && v0.spin && v0.loading && v0.label === 'Visionneuse d’essai',
    'ds.viewer s’ouvre sur la photo demandée, « 3 / 5 », la roue tourne tant qu’elle charge ' + JSON.stringify(v0));
  assert(v1.src === '/photo/33.svg?w=1200&h=800' && !v1.spin && !v1.loading && v1.caption === 'Une légende sous la photo',
    'une photo donnée par une fonction se charge, la roue s’arrête, sa légende passe dessous ' + JSON.stringify(v1));
  assert(roles.role === 'dialog' && roles.modal === 'true' && roles.x === 'Fermer' && roles.prev === 'Photo précédente' && roles.next === 'Photo suivante' && !roles.inline && roles.active,
    'une fenêtre (dialog, aria-modal), le curseur y entre ; ses boutons disent ce qu’ils font, sans code dans le balisage ' + JSON.stringify(roles));
  assert(asked.includes('/photo/32.svg?w=800&h=1200') && asked.includes('/photo/34.svg?w=1200&h=900') && !asked.some(u => u.startsWith('/photo/35.svg')) && !asked.some(u => u.startsWith('/photo/31.svg')),
    'ses deux voisines se chargent d’avance, et elles seules');
  const y0 = await p.evaluate(() => scrollY);
  await p.mouse.wheel(0, 800);
  await p.waitForTimeout(200);
  assert(v1.held === 'hidden' && await p.evaluate(y0 => scrollY === y0, y0), 'la page derrière ne défile pas');
  // the keys and the buttons, round and round
  const counts = [];
  const step = async how => { await how(); counts.push((await vw()).count); };
  await step(() => p.keyboard.press('ArrowRight'));
  await step(() => p.keyboard.press('ArrowLeft'));
  await step(() => p.click('.viewer-next'));
  await step(() => p.click('.viewer-next'));
  await step(() => p.click('.viewer-next'));
  await step(() => p.click('.viewer-prev'));
  await step(() => p.keyboard.press('ArrowLeft'));
  await step(() => p.keyboard.press('ArrowLeft'));
  assert(counts.join(',') === '4 / 5,3 / 5,4 / 5,5 / 5,1 / 5,5 / 5,4 / 5,3 / 5', '← → et les flèches tournent les photos, de la dernière à la première et retour ' + counts.join(','));
  assert(await p.evaluate(() => log.filter(x => x.startsWith('v:')).join(',')) === 'v:2,v:3,v:2,v:3,v:4,v:0,v:4,v:3,v:2', 'onChange dit chaque photo montrée');
  const n35 = asked.filter(u => u === '/photo/35.svg?w=900&h=1200').length;
  assert(n35 === 1, 'une photo chargée d’avance n’est pas redemandée quand elle vient (' + n35 + ')');
  const capKeep = await p.evaluate(async () => { const st = document.querySelector('.viewer-stage'), h0 = st.offsetHeight; v.go(3); await new Promise(r => setTimeout(r, 50));
    const c = document.querySelector('.viewer-caption'); return { text: c.textContent, bar: !c.closest('.viewer-bar').hidden, same: st.offsetHeight === h0 }; });
  assert(capKeep.text === '' && capKeep.bar && capKeep.same, 'une photo sans légende garde la ligne vide : les photos ne changent pas de taille de l’une à l’autre ' + JSON.stringify(capKeep));
  // Tab stays in the viewer
  const inside = [];
  for (let i = 0; i < 5; i++) { await p.keyboard.press('Tab'); inside.push(await p.evaluate(() => document.querySelector('.viewer').contains(document.activeElement))); }
  await p.keyboard.press('Shift+Tab');
  assert(inside.every(Boolean) && await p.evaluate(() => document.querySelector('.viewer').contains(document.activeElement)), 'Tab tourne dans la visionneuse, dans les deux sens');
  await p.keyboard.press('Escape');
  const shut = await p.evaluate(() => ({ hidden: document.querySelector('.viewer').hidden, focus: document.activeElement.id, log: log.includes('vclose:3'), held: getComputedStyle(document.documentElement).overflow }));
  assert(shut.hidden && shut.focus === 'open' && shut.log && shut.held !== 'hidden', 'Échap ferme, le curseur revient au bouton, onClose est appelé, la page défile de nouveau ' + JSON.stringify(shut));
  await p.click('#open');
  await p.waitForTimeout(150);
  await p.mouse.click(640, 18);
  const byVeil = await p.evaluate(() => document.querySelector('.viewer').hidden);
  await p.click('#open');
  await p.waitForTimeout(150);
  const photoBox = await p.locator('.viewer-stage img').boundingBox();
  await p.mouse.click(photoBox.x + photoBox.width / 2, photoBox.y + photoBox.height / 2);
  const onPhoto = await p.evaluate(() => !document.querySelector('.viewer').hidden);
  await p.click('.viewer-close');
  assert(byVeil && onPhoto && await p.evaluate(() => document.querySelector('.viewer').hidden && document.querySelectorAll('.viewer').length === 1),
    'un clic à côté de la photo (le voile) ferme, un clic sur la photo non, la croix ferme ; une seule visionneuse dans la page');
  const one = await p.evaluate(async () => { ds.viewer(['/photo/40.svg?w=800&h=600']); const v = document.querySelector('.viewer');
    const r = { prev: v.querySelector('.viewer-prev').hidden, next: v.querySelector('.viewer-next').hidden, count: v.querySelector('.viewer-count').hidden, bar: v.querySelector('.viewer-bar').hidden };
    ds.viewer.close(); r.closed = v.hidden; return r; });
  assert(one.prev && one.next && one.count && one.bar && one.closed, 'une seule photo : ni flèches ni compte ; sans légende, pas de ligne sous la photo ; ds.viewer.close() ferme ' + JSON.stringify(one));

  const failed = await p.evaluate(async () => { ds.viewer([() => { throw new Error('refusé'); }, '/photo/41.svg?w=800&h=600']); await new Promise(r => setTimeout(r, 100));
    const v = document.querySelector('.viewer'), r = { spin: v.querySelector('.spinner').hidden, said: [...document.querySelectorAll('.toast.is-bad .txt')].map(t => t.textContent).join(), open: !v.hidden };
    document.querySelector('.viewer-next').click(); await new Promise(r => setTimeout(r, 200)); r.next = v.querySelector('.viewer-stage img').getAttribute('src'); ds.viewer.close();
    document.querySelectorAll('.toast .x').forEach(x => x.click()); return r; });
  assert(failed.spin && failed.said === 'Cette photo n’a pas pu s’ouvrir.' && failed.open && failed.next === '/photo/41.svg?w=800&h=600',
    'une photo qui ne vient pas : la roue s’arrête, la bulle le dit, la visionneuse reste et passe à la suivante ' + JSON.stringify(failed));

  // a grid of links: ds.viewer.bind
  await p.evaluate(() => scrollTo(0, 0));
  await p.click('#grid > a:nth-child(3)');
  const g1 = await vw();
  await p.waitForTimeout(700);
  const g2 = await vw();
  assert(g1.open && g1.count === '3 / 12' && g1.label === 'La grille' && g1.placeholder && /\/photo\/3\.svg\?w=300/.test(g1.src) && g1.spin,
    'un clic sur une photo de la grille ouvre la visionneuse sur elle, sa vignette floue le temps que la grande charge ' + JSON.stringify(g1));
  assert(g2.src === base + '/photo/3.svg?w=1200&h=1200&ms=400' && !g2.placeholder && !g2.spin && g2.caption === 'Photo 3' && p.url().endsWith('/checks/photo.html'),
    'puis la grande photo, celle du lien, avec sa légende (data-caption), sans quitter la page ' + JSON.stringify(g2));
  await p.keyboard.press('Escape');
  const back1 = await p.evaluate(() => document.activeElement === document.querySelector('#grid > a:nth-child(3)') && log.includes('change:2') && log.includes('close:2'));
  await p.click('#grid > a:nth-child(2)');
  await p.keyboard.press('ArrowRight');
  await p.keyboard.press('ArrowRight');
  await p.keyboard.press('Escape');
  const back2 = await p.evaluate(() => document.activeElement === document.querySelector('#grid > a:nth-child(4)'));
  assert(back1 && back2, 'fermée, le curseur revient au lien qui l’a ouverte, ou à celui de la photo où l’on s’est arrêté');
  await p.click('#grid > a:nth-child(2)', { modifiers: ['Control'] }).catch(() => {});
  assert(await p.evaluate(() => document.querySelector('.viewer').hidden), 'Ctrl-clic laisse le navigateur ouvrir la photo à part');
  // with no code: data-viewer
  await p.click('#auto a.ph');
  const a1 = await vw();
  await p.keyboard.press('ArrowRight');
  const a2 = await vw();
  await p.keyboard.press('Escape');
  await p.click('#not-a-photo');
  assert(a1.open && a1.count === '1 / 2' && a1.label === 'Sans code' && a2.count === '2 / 2' && await p.evaluate(() => document.querySelector('.viewer').hidden && location.hash === '#elsewhere'),
    'data-viewer="a.ph" : la même chose sans une ligne de code, et un autre lien reste un lien ' + JSON.stringify([a1.count, a2.count]));

  // the masonry grid
  await p.evaluate(() => { location.hash = ''; scrollTo(0, 0); });
  const masonry = () => p.evaluate(() => {
    const grid = document.getElementById('grid'), gap = parseFloat(getComputedStyle(grid).columnGap), tiles = [...grid.children].filter(t => !t.hidden);
    const boxes = tiles.map(t => ({ l: t.offsetLeft, t: t.offsetTop, w: t.offsetWidth, h: t.offsetHeight }));
    const lefts = [...new Set(boxes.map(x => x.l))].sort((a, b) => a - b), bottoms = lefts.map(l => Math.max(...boxes.filter(x => x.l === l).map(x => x.t + x.h)));
    // within a column, each photo starts right under the one above
    const stacked = lefts.every(l => { const col = boxes.filter(x => x.l === l).sort((a, b) => a.t - b.t); return col.every((x, i) => i === 0 ? x.t === 0 : x.t === col[i - 1].t + col[i - 1].h + gap); });
    return { masonry: grid.classList.contains('is-masonry'), cols: lefts.length, said: pg.columns, size: pg.size, tile: grid.style.getPropertyValue('--tile'), width: grid.clientWidth, gap,
      stacked, even: Math.max(...bottoms) - Math.min(...bottoms) <= Math.max(...boxes.map(x => x.h)) + gap, height: grid.offsetHeight === Math.max(...bottoms),
      shapes: [3, 7, 11].map(i => { const t = tiles[i], im = t.querySelector('img'); return Math.abs(t.offsetHeight - t.offsetWidth * im.naturalHeight / im.naturalWidth) <= 1; }),
      slider: (s => ({ min: s.min, max: s.max, value: s.value, text: s.getAttribute('aria-valuetext'), label: s.getAttribute('aria-label') }))(document.getElementById('zoom')) };
  });
  await p.waitForFunction(() => [...document.querySelectorAll('#grid img')].every(i => i.complete));
  await p.waitForTimeout(100);
  const m1 = await masonry();
  const expect = Math.floor((m1.width + m1.gap) / (190 + m1.gap));
  assert(m1.masonry && m1.cols === expect && m1.said === expect && m1.size === 190 && m1.tile === '190px' && m1.stacked && m1.even && m1.height,
    'la grille en colonnes de 190px : chaque photo sous la précédente de sa colonne, les colonnes de même hauteur ' + JSON.stringify(m1));
  assert(m1.shapes.every(Boolean), 'une photo sans largeur ni hauteur prend sa forme une fois chargée');
  assert(m1.slider.min === '0' && m1.slider.max === '3' && m1.slider.value === '1' && m1.slider.text === m1.cols + ' colonnes' && m1.slider.label === 'Taille des photos',
    'le curseur de zoom va de la plus petite à la plus grande taille, dit le nombre de colonnes ' + JSON.stringify(m1.slider));
  await p.evaluate(() => { const s = document.getElementById('zoom'); s.value = '3'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  const moving = await p.evaluate(() => [...document.querySelectorAll('#grid > a')].filter(t => t.getAnimations().length).length);
  await p.waitForTimeout(500);
  const m2 = await masonry();
  assert(m2.size === 300 && m2.tile === '300px' && m2.cols === Math.floor((m2.width + m2.gap) / 304) && m2.cols < m1.cols && m2.stacked && moving > 0 && await p.evaluate(() => localStorage.getItem('check-zoom')) === '300',
    'le zoom passe à 300px : moins de colonnes, les photos glissent à leur place, l’appareil s’en souvient (' + moving + ' en mouvement)');
  await ready();
  const m3 = await masonry();
  assert(m3.size === 300 && m3.slider.value === '3', 'au retour, la grille reprend la taille choisie');
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.evaluate(() => { const s = document.getElementById('zoom'); s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  const still = await p.evaluate(() => [...document.querySelectorAll('#grid > a')].filter(t => t.getAnimations().length).length);
  await p.emulateMedia({ reducedMotion: null });
  assert(still === 0 && (await masonry()).size === 140, 'qui demande moins de mouvement voit la grille changer sans glisser');
  await p.setViewportSize({ width: 700, height: 900 });
  await p.waitForTimeout(150);
  const m4 = await masonry();
  await p.setViewportSize({ width: 1280, height: 900 });
  assert(m4.cols === Math.floor((m4.width + m4.gap) / 144) && m4.stacked && m4.width < m1.width && m4.slider.max === '2',
    'la grille suit sa largeur ; le zoom n’offre que les tailles qui la changent (240 et 300px y font deux colonnes) ' + m4.cols + ' colonnes à ' + m4.width + 'px, ' + JSON.stringify(m4.slider));
  await p.waitForTimeout(150);
  await p.evaluate(() => { const a = document.createElement('a'); a.href = '/photo/60.svg?w=800&h=400'; a.innerHTML = '<img src="/photo/60.svg?w=300&h=150" width="300" height="150" alt="">'; document.getElementById('grid').append(a); document.querySelector('#grid > a').hidden = true; });
  await p.waitForTimeout(150);
  const m5 = await masonry();
  const added = await p.evaluate(() => { const a = document.querySelector('#grid > a:last-child'); return a.style.top !== '' && Math.abs(a.offsetHeight - a.offsetWidth / 2) <= 1; });
  assert(m5.stacked && m5.even && added, 'une photo ajoutée prend sa place, une photo cachée laisse la sienne');
  await p.evaluate(() => pg.set({ masonry: false }));
  const rows = await p.evaluate(() => { const g = document.getElementById('grid'), t = document.querySelectorAll('#grid > a:not([hidden])'); return { cls: g.classList.contains('is-masonry'), display: getComputedStyle(g).display, left: t[0].style.left, h: t[1].offsetHeight }; });
  await p.evaluate(() => pg.set({ masonry: true }));
  assert(!rows.cls && rows.display === 'grid' && rows.left === '' && rows.h === 140 && (await masonry()).masonry, 'masonry: false range les photos en rangs égaux, coupées à la taille ; et retour ' + JSON.stringify(rows));

  // the hero and the back link, in both themes
  const looks = () => p.evaluate(() => {
    const probe = name => { const i = document.createElement('i'); i.style.color = 'var(' + name + ')'; document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return c; };
    const hero = document.getElementById('hero'), cover = document.getElementById('cover'), t = hero.querySelector('.hero-t'), img = hero.querySelector('.hero-img'), back = document.getElementById('back'), over = document.getElementById('back-photo');
    const hr = hero.getBoundingClientRect(), ir = img.getBoundingClientRect(), cr = cover.getBoundingClientRect(), ci = cover.querySelector('.hero-in').getBoundingClientRect(), orr = over.getBoundingClientRect();
    const use = back.querySelector('use').getAttribute('href');
    return { h: Math.round(hr.height), cover: Math.round(cr.height), font: getComputedStyle(t).fontFamily.split(',')[0].replace(/"/g, ''), caps: getComputedStyle(t).textTransform, white: getComputedStyle(t).color === probe('--white'),
      veil: getComputedStyle(hero, '::after').backgroundColor !== 'rgba(0, 0, 0, 0)', covers: ir.width >= hr.width - 1 && ir.height >= hr.height - 1 && getComputedStyle(img).objectFit === 'cover',
      centred: Math.abs((hr.left + hr.right) / 2 - (t.getBoundingClientRect().left + t.getBoundingClientRect().right) / 2) < 2,
      bottomLeft: cr.bottom - ci.bottom < 40 && ci.left - cr.left < 40, gradient: /gradient/.test(getComputedStyle(cover, '::after').backgroundImage),
      sub: getComputedStyle(hero.querySelector('.hero-sub')).color === probe('--accent'), act: !!hero.querySelector('.hero-acts .btn'),
      drift: getComputedStyle(img).animationName, fixed: getComputedStyle(hero).backgroundAttachment,
      track: (() => { const i = document.createElement('i'); i.style.color = getComputedStyle(document.getElementById('zoom')).getPropertyValue('--zoom-track'); document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return c === probe('--line') ? 'line' : c === probe('--line-2') ? 'line-2' : c; })(),
      back: { icon: use === '#i-arrow-left' && !!document.getElementById('i-arrow-left'), color: getComputedStyle(back).color === probe('--faint'), caps: getComputedStyle(back).textTransform, ls: getComputedStyle(back).letterSpacing, display: getComputedStyle(back).display },
      over: { corner: orr.top - hr.top < 40 && orr.left - hr.left < 40, edge: (() => { const i = document.createElement('i'); i.style.color = 'color-mix(in srgb, var(--gold-500) 20%, transparent)'; document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return getComputedStyle(over).borderTopColor === c; })(), radius: getComputedStyle(over).borderTopLeftRadius } };
  });
  await p.evaluate(() => scrollTo(0, 0));
  const at = await looks();
  assert(at.h >= 300 && at.cover >= 220 && at.cover <= 320 && at.font === 'Archivo' && at.caps === 'none' && at.white && at.veil && at.covers && at.centred && at.sub && at.act,
    'Atelier : le héros, sa photo sur toute la place sous un voile, le titre blanc au milieu, le sous-titre or, une action ' + JSON.stringify(at));
  assert(at.bottomLeft && at.gradient, 'la couverture basse de Selecta : le titre en bas à gauche, le voile qui fonce vers le bas');
  assert(at.drift === 'hero-drift' && at.fixed === 'fixed', 'avec une souris, .is-parallax fait glisser la photo moins vite que la page ' + at.drift);
  assert(at.back.icon && at.back.color && at.back.caps === 'uppercase' && /flex$/.test(at.back.display) && at.over.corner && at.over.edge && at.over.radius === '6px',
    'Atelier : le lien retour, la flèche de la planche puis des capitales, discret ; sur la photo, le bouton du site dans le coin ' + JSON.stringify([at.back, at.over]));
  await p.hover('#back');
  await p.waitForTimeout(400);
  assert(await p.evaluate(() => { const i = document.createElement('i'); i.style.color = 'var(--accent)'; document.body.append(i); const c = getComputedStyle(i).color; i.remove(); return getComputedStyle(document.getElementById('back')).color === c; }),
    'au survol, le lien retour passe à l’or');
  await p.evaluate(() => { document.documentElement.dataset.theme = 'vitrine'; });
  await p.mouse.move(1, 1);
  await p.waitForTimeout(500);
  const vi = await looks();
  assert(at.track === 'line-2' && vi.track === 'line', 'le bord du rail du zoom : le trait fort d’Atelier, le trait doux de Vitrine (son trait fort est l’or plein) ' + at.track + ' / ' + vi.track);
  // the browser does not give the styles of a slider's parts: read their rules
  const rail = await p.evaluate(() => {
    const rules = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } }).flatMap(r => r.cssRules ? [r, ...r.cssRules] : [r]);
    const of = sel => (rules.find(r => r.selectorText === sel) || { style: { cssText: '' } }).style.cssText;
    return { track: of('.zoom-slider::-webkit-slider-runnable-track'), thumb: of('.zoom-slider::-webkit-slider-thumb'), fill: document.getElementById('zoom').style.cssText };
  });
  assert(/height: 6px/.test(rail.track) && /border-radius: calc\(var\(--s-6\) \/ 2\)/.test(rail.track) && /var\(--accent-soft\)/.test(rail.track) && /var\(--zoom-track\)/.test(rail.track) && !/gradient/.test(rail.track)
    && /width: 18px/.test(rail.thumb) && rail.fill === '',
    'le zoom, la barre de Selecta : un rail de 6px aux bouts ronds, un fond d’or très pâle, un bord doux, sans or qui le remplit ; un curseur de 18px ' + JSON.stringify(rail));
  assert(vi.font === 'Gilda Display' && vi.caps === 'uppercase' && vi.white && vi.veil && vi.covers && vi.sub && vi.back.icon && vi.back.color && vi.back.ls === '2px' && vi.over.edge && vi.over.radius === '0px',
    'Vitrine : le titre en Gilda Display, en capitales ; le lien retour espacé comme le site, le bouton sur la photo aux angles carrés ' + JSON.stringify(vi));
  await p.emulateMedia({ reducedMotion: 'reduce' });
  const calm = await looks();
  await p.emulateMedia({ reducedMotion: null });
  assert(calm.drift === 'none' && calm.fixed === 'scroll' && calm.covers, 'qui demande moins de mouvement : la photo du héros reste en place');
  await ctx.close();

  // ---------- on a phone ----------
  const phone = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const q = await phone.newPage();
  watch(q);
  await q.goto(base + '/checks/photo.html');
  await q.waitForFunction(() => window.pg && window.bound);
  const ph = await q.evaluate(() => { const s = document.getElementById('zoom'), img = document.querySelector('#hero .hero-img');
    return { max: s.max, value: s.value, cols: pg.columns, drift: getComputedStyle(img).animationName, wide: document.documentElement.scrollWidth <= 375 }; });
  assert(ph.max === '1' && ph.value === '1' && ph.cols === 1 && ph.drift === 'none' && ph.wide,
    'sur téléphone, le zoom n’offre que les tailles qui changent la grille ; le héros ne glisse pas sous le doigt ; rien ne dépasse ' + JSON.stringify(ph));
  await q.tap('#open');
  await q.waitForTimeout(300);
  const cdp = await phone.newCDPSession(q);
  const swipe = async (x0, y0, x1, y1) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 8, y: y0 + (y1 - y0) * i / 8 }] }); await q.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await q.waitForTimeout(120);
  };
  const cnt = () => q.evaluate(() => document.querySelector('.viewer-count').textContent);
  const s0 = await cnt();
  await swipe(300, 400, 120, 410);
  const s1 = await cnt();
  await swipe(80, 400, 280, 395);
  await swipe(80, 400, 280, 395);
  const s2 = await cnt();
  await swipe(190, 400, 205, 430);
  const small = await q.evaluate(() => !document.querySelector('.viewer').hidden);
  const btns = await q.evaluate(() => [...document.querySelectorAll('.viewer-btn')].every(x => x.getBoundingClientRect().width === 40));
  await swipe(190, 300, 195, 520);
  const s3 = await q.evaluate(() => ({ hidden: document.querySelector('.viewer').hidden, held: getComputedStyle(document.documentElement).overflow, log: log.filter(x => x.startsWith('v')).join(',') }));
  assert(s0 === '3 / 5' && s1 === '4 / 5' && s2 === '2 / 5' && small && btns, 'au doigt : vers la gauche la suivante, vers la droite la précédente ; un petit geste ne fait rien ' + [s0, s1, s2].join(' → '));
  assert(s3.hidden && s3.held !== 'hidden' && /vclose:1$/.test(s3.log), 'tirée vers le bas, la visionneuse se ferme ' + JSON.stringify(s3));
  await phone.close();

  // ---------- a page with no script of its own, under script-src 'self' ----------
  const sctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const s = await sctx.newPage();
  watch(s);
  await s.goto(base + '/csp.html');
  await s.waitForFunction(() => window.ds && window.ds.viewer);
  await s.click('a[href*="52.svg"]');
  await s.waitForTimeout(200);
  const csp = await s.evaluate(() => { const v = document.querySelector('.viewer'); return { open: !v.hidden, count: v.querySelector('.viewer-count').textContent, label: v.getAttribute('aria-label'), src: v.querySelector('.viewer-stage img').getAttribute('src') }; });
  await s.keyboard.press('ArrowLeft');
  const csp2 = await s.evaluate(() => document.querySelector('.viewer-count').textContent);
  assert(csp.open && csp.count === '2 / 2' && csp.label === 'Galerie du site' && /52\.svg\?w=600/.test(csp.src) && csp2 === '1 / 2',
    'sous script-src \'self\', une page sans script à elle ouvre ses photos (data-viewer) ' + JSON.stringify(csp));
  await sctx.close();

  assert(errors.length === 0, 'aucune erreur dans les pages ' + errors.join(' | '));
  await b.close();
  server.close();
})();
