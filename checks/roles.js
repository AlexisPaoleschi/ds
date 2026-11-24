// ds 5.0, sixteen text roles and nothing else. In the sources: every size, weight, letter spacing, case and font of a
// rule comes from a role (var(--type-…)), a figure's mono (var(--mono)) or the logo's own (var(--brand-…), on .brand and
// .topbar-brand alone), or inherits; the raw values live in tokens.css, sixteen roles in each theme. On the screen: every
// text the showcase draws, in both themes, wears the size, the spacing and the case of one role of its theme, in that
// role's weight or the strong weight (a word put forward), in its font or in mono; the logo, and a tile's figure made
// smaller to fit its tile (ds.fitFigures), are the only ones apart.
// usage: node checks/roles.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };
const ROLES = ['display', 'cover', 'cover-line', 'title-1', 'title-2', 'title-3', 'figure', 'subtitle', 'lead', 'text', 'strong', 'small', 'caption', 'caps', 'smallcaps', 'button'];
const PARTS = ['font', 'size', 'weight', 'ls', 'case'];

// italics carry a meaning, never a look (5.7.0): someone speaking (a quote), one's own words (a note), the line of a photo
// band, the title of a work. Every rule that puts a text in italics is one of these
const ITALIC = ['.hero.is-band .hero-meta', '.testimonial-text', '.row-note', '.gallery-publication cite'];
function italicFaults() {
  const faults = [];
  const dir = path.join(root, 'src');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const rx = /([^{};]+)\{([^{}]*)\}/g;
    let m;
    while ((m = rx.exec(css))) {
      const sel = m[1].trim().replace(/\s+/g, ' ');
      if (sel.startsWith('@font-face')) continue;
      if (/(^|;)\s*font-style\s*:\s*(italic|oblique)|(^|;)\s*font\s*:[^;]*\b(italic|oblique)\b/.test(m[2]) && !ITALIC.includes(sel)) faults.push(f + ' ' + sel);
    }
  }
  return faults;
}

// the sources: each text declaration and what it is made of
function sourceFaults() {
  const faults = [];
  const dir = path.join(root, 'src');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const rx = /([^{};]+)\{([^{}]*)\}/g;
    let m;
    while ((m = rx.exec(css))) {
      const sel = m[1].trim().replace(/\s+/g, ' ');
      if (sel.startsWith('@font-face')) continue;
      for (const d of m[2].split(';')) {
        const mm = d.match(/^\s*(font|font-size|font-weight|letter-spacing|text-transform|font-family)\s*:\s*([\s\S]+?)\s*$/);
        if (!mm) continue;
        const [, prop, val] = mm;
        // what may stand in it: a role's, mono, a line height in a shorthand, italic, and the words that change nothing
        const brand = /(^|[\s,])\.(top)?bar-brand|(^|[\s,])\.brand\b/.test(sel) || /\.topbar-brand|\.brand\b/.test(sel);
        let rest = val.replace(/var\(--type-[a-z0-9-]+\)/g, '').replace(/var\(--mono\)/g, '');
        if (brand) rest = rest.replace(/var\(--brand-[a-z]+\)/g, '');
        if (prop === 'font') rest = rest.replace(/\/\s*(var\(--[a-z0-9-]*lh[a-z0-9-]*\)|[\d.]+|normal)/g, '').replace(/\bitalic\b/g, '');
        if (prop === 'text-transform') rest = rest.replace(/\b(none|capitalize)\b/g, '').replace(/\buppercase\b/g, /::first-letter/.test(sel) || brand ? '' : 'uppercase');
        rest = rest.replace(/\b(inherit)\b/g, '').trim();
        if (rest) faults.push(`${f}: ${sel.slice(0, 60)} { ${prop}: ${val} }`);
      }
    }
  }
  return faults;
}
// tokens.css: each theme gives the sixteen roles their five parts, and no other role is made
function tokenFaults() {
  const css = fs.readFileSync(path.join(root, 'src/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const made = new Set([...css.matchAll(/--type-([a-z0-9-]+)-(font|size|weight|ls|case)\s*:/g)].map(x => x[1]));
  const faults = [...made].filter(r => !ROLES.includes(r) && r !== 'card-title').map(r => 'un rôle de trop : ' + r);
  for (const r of ROLES) for (const p of PARTS) if (!css.includes(`--type-${r}-${p}:`)) faults.push(`--type-${r}-${p} manque`);
  return faults;
}

server.listen(0, async () => {
  const base = 'http://127.0.0.1:' + server.address().port;
  const ital = italicFaults();
  assert(!ital.length, 'l’italique seulement pour une citation, une note, la phrase d’un bandeau photo et le titre d’une œuvre ' + JSON.stringify(ital));
  const src = sourceFaults();
  assert(!src.length, 'dans les sources, chaque taille, graisse, espacement, casse et police vient d’un rôle ' + JSON.stringify(src.slice(0, 12)));
  const tok = tokenFaults();
  assert(!tok.length, 'seize rôles, chacun avec sa police, sa taille, sa graisse, son espacement et sa casse ' + JSON.stringify(tok));
  const browser = await chromium.launch();
  const pages = fs.readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('mail'));
  const off = {}, seen = { atelier: new Set(), vitrine: new Set() };
  for (const width of [1440, 375]) for (const pg of pages) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(base + '/' + pg);
    await p.waitForTimeout(800);
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(([ROLES]) => {
      // each theme's roles, read from an element of that theme
      const looks = {};
      for (const th of ['atelier', 'vitrine']) {
        const el = document.createElement('div'); el.dataset.theme = th; el.style.position = 'absolute'; document.body.append(el);
        const cs = getComputedStyle(el), v = n => cs.getPropertyValue(n).trim();
        // a role's size and spacing as the browser draws them (a size may be a clamp() on a phone)
        looks[th] = ROLES.map(r => { const s = document.createElement('span'); s.style.fontSize = `var(--type-${r}-size)`; s.style.letterSpacing = `var(--type-${r}-ls)`;
          el.append(s); const c = getComputedStyle(s), size = parseFloat(c.fontSize), ls = c.letterSpacing === 'normal' ? 0 : parseFloat(c.letterSpacing) / size; s.remove();
          return { r, size, weight: v(`--type-${r}-weight`), ls: Math.round(ls * 1000) / 1000 + 'em', case: v(`--type-${r}-case`) }; });
        looks[th].strong = v('--type-strong-weight');
        el.remove();
      }
      const em = (ls, fs) => ls === 'normal' ? 0 : Math.round(parseFloat(ls) / fs * 1000) / 1000;
      const lsOf = v => v.endsWith('em') ? parseFloat(v) : parseFloat(v) || 0;
      const out = [], used = [];
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('script, style, template, svg, .visually-hidden, .brand, .topbar-brand, code, pre, kbd')) continue;
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const rc = el.getBoundingClientRect(); if (!rc.width || !rc.height) continue;
        // a tile's figure made smaller to fit its tile
        if (el.closest('dd[style*="font-size"], .big-fig-value[style*="font-size"]')) continue;
        const th = el.closest('[data-theme]')?.dataset.theme || 'atelier';
        const cs = getComputedStyle(el), raw = parseFloat(cs.fontSize), fs = raw;
        const look = looks[th];
        const same = x => Math.abs(x.size - fs) < .5 && Math.abs(lsOf(x.ls) - em(cs.letterSpacing, raw)) < .006
          && (x.case === cs.textTransform || (x.case === 'none' && cs.textTransform === 'capitalize'));
        // its role's own weight first, then any role's look in the strong weight
        const hit = look.find(x => same(x) && cs.fontWeight === x.weight) || look.find(x => same(x) && cs.fontWeight === look.strong);
        // two roles may look alike in a theme (Vitrine's buttons and capitals): the text shows both
        if (hit) look.filter(x => same(x) && x.weight === hit.weight).forEach(x => used.push(th + ' ' + x.r));
        else out.push(`${th} ${el.tagName.toLowerCase()}${el.classList.length ? '.' + [...el.classList].join('.') : ''} ${fs}px ${cs.fontWeight} ${em(cs.letterSpacing, raw)}em ${cs.textTransform} « ${el.textContent.trim().slice(0, 24)} »`);
      }
      return { out, used };
    }, [ROLES]);
    for (const o of r.out) (off[o] = off[o] || new Set()).add(pg + '@' + width);
    for (const u of r.used) { const [th, role] = u.split(' '); seen[th].add(role); }
    await p.close();
  }
  const list = Object.entries(off).map(([k, v]) => k + ' (' + [...v].slice(0, 3).join(', ') + ')');
  assert(!list.length, 'chaque texte de la vitrine, dans les deux thèmes, sur un ordinateur et un téléphone, porte l’un des seize rôles de son thème ' + JSON.stringify(list.slice(0, 25)) + (list.length > 25 ? ' … ' + list.length : ''));
  for (const th of ['atelier', 'vitrine'])
    assert(ROLES.every(r => seen[th].has(r)), `la vitrine montre les seize rôles en ${th} ` + JSON.stringify(ROLES.filter(r => !seen[th].has(r))));
  await browser.close();
  server.close();
});
