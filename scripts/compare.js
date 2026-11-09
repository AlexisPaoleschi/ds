#!/usr/bin/env node
// Captures every page of an app before and after a change, on a computer and on a phone, and writes a page that shows
// them side by side with what changed in red: the before/after that comes before anything goes online.
//
//   node scripts/compare.js config.json
//
// The config (see scripts/compare.example.json) names the two servers, the pages and the screen sizes:
//   before, after   where each version runs ("http://127.0.0.1:8090"); they may be the same server when "ds" is set
//   ds              a folder holding a candidate ds.css and ds.js: the "after" pages load them instead of their own copy,
//                   so an app can be seen with a new version of the design system before it gets it
//   pages           [{name, path, click?, wait?, full?}]: click opens something first (a menu, a photo); full: false
//                   captures the screen only, for a page that scrolls by screens
//   sizes           [{name, width, height}], a computer and a phone by default
//   login           {path, fill: {selector: value}, submit}; a value "$NAME" is read from the environment, never written down
//   prepare         a script run on every page before its capture (to take a loading screen away, for instance)
//   javascript      false to capture the pages without their scripts: a page that waits for its server is then the same twice
//   out             the folder to write to
// Needs Node 18 and Playwright (require('playwright')); behind a proxy, HTTPS_PROXY is used for outside addresses.
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = path.resolve(path.dirname(process.argv[2]), config.out || 'compare');
const sizes = config.sizes || [{ name: 'ordinateur', width: 1280, height: 800 }, { name: 'téléphone', width: 375, height: 812 }];
const env = (v) => (typeof v === 'string' && v.startsWith('$') ? process.env[v.slice(1)] || '' : v);
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
fs.mkdirSync(path.join(out, 'img'), { recursive: true });

async function context(browser, size, swapDs) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1, javaScriptEnabled: config.javascript !== false });
  if (swapDs) {
    // the app's own copy of the design system is answered by the candidate
    for (const kind of ['css', 'js']) {
      const file = path.resolve(path.dirname(process.argv[2]), swapDs, 'ds.' + kind);
      await ctx.route(new RegExp(`(/ds/ds-[0-9.]+|/dist/ds)\\.${kind}(\\?.*)?$`), (r) =>
        r.fulfill({ contentType: kind === 'css' ? 'text/css' : 'text/javascript', body: fs.readFileSync(file) }));
    }
  }
  if (config.login) {
    const page = await ctx.newPage();
    await page.goto(config.base + config.login.path);
    for (const [selector, value] of Object.entries(config.login.fill)) await page.fill(selector, env(value));
    await Promise.all([page.waitForLoadState('networkidle'), page.click(config.login.submit)]);
    await page.close();
  }
  return ctx;
}

async function shoot(ctx, base, item) {
  const page = await ctx.newPage();
  await page.goto(base + item.path, { waitUntil: 'networkidle' });
  // the fonts: asked again and again from here, for 10s at most, since a page without its scripts never answers a promise
  for (let i = 0; i < 100 && (await page.evaluate(() => document.fonts.status)) !== 'loaded'; i++) await page.waitForTimeout(100);
  if (config.prepare) await page.evaluate(config.prepare);
  if (item.click) { await page.locator(item.click).first().scrollIntoViewIfNeeded(); await page.locator(item.click).first().click(); }
  await page.waitForTimeout(item.wait || 600);
  // what moves is stopped at its start, and the caret hidden, so that two captures of the same page are the same
  await page.evaluate(() => { const s = document.createElement('style'); s.textContent = '*, *::before, *::after { caret-color: transparent !important; }'; document.head.append(s); });
  await page.evaluate(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 0; }));
  // a PNG to compare exactly, taken again until two in a row are the same: a font arriving late cannot slip in; then a JPEG to show, lighter
  let png = await page.screenshot({ fullPage: item.full !== false });
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(300);
    const again = await page.screenshot({ fullPage: item.full !== false });
    if (Buffer.compare(png, again) === 0) break;
    png = again;
  }
  const jpg = await page.screenshot({ fullPage: item.full !== false, type: 'jpeg', quality: 80 });
  // every element's computed style, to tell a change of the design system from a pixel the browser drew differently
  const styles = await page.evaluate(() => {
    const out = [];
    const walk = (el, at) => {
      const c = getComputedStyle(el), props = {};
      for (let i = 0; i < c.length; i++) if (!c[i].startsWith('--')) props[c[i]] = c.getPropertyValue(c[i]);
      out.push([at, props]);
      [...el.children].forEach((k, i) => walk(k, `${at} > ${k.tagName.toLowerCase()}${typeof k.className === 'string' && k.className.trim() ? '.' + k.className.trim().split(/\s+/).join('.') : ''}`));
    };
    walk(document.documentElement, 'html');
    return out;
  });
  await page.close();
  return { png, jpg, styles };
}

// what changed in the computed styles, element by element, when both pages have the same elements
function styleChanges(a, b) {
  if (a.length !== b.length) return { comparable: false, changes: [] };
  const changes = [];
  for (let i = 0; i < a.length; i++) {
    const [at, pa] = a[i], [, pb] = b[i];
    for (const k of Object.keys(pa)) if (pa[k] !== pb[k]) changes.push(`${at} · ${k} : ${pa[k]} → ${pb[k]}`);
  }
  return { comparable: true, changes };
}

// the share of pixels that changed, and an image of the "after" greyed with what changed in red; done in a browser page
async function diff(browser, a, b) {
  const page = await browser.newPage();
  const result = await page.evaluate(async ([a, b]) => {
    const load = (src) => new Promise((done) => { const i = new Image(); i.onload = () => done(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const read = (img) => { const c = new OffscreenCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0); return g.getImageData(0, 0, w, h); };
    const da = read(ia), db = read(ib), dd = new ImageData(w, h);
    let changed = 0;
    for (let i = 0; i < da.data.length; i += 4) {
      const delta = Math.max(Math.abs(da.data[i] - db.data[i]), Math.abs(da.data[i + 1] - db.data[i + 1]), Math.abs(da.data[i + 2] - db.data[i + 2]));
      const grey = 255 - (255 - (db.data[i] * 0.3 + db.data[i + 1] * 0.59 + db.data[i + 2] * 0.11)) * 0.3;
      if (delta > 16) { changed++; dd.data[i] = 220; dd.data[i + 1] = 40; dd.data[i + 2] = 40; } else { dd.data[i] = dd.data[i + 1] = dd.data[i + 2] = grey; }
      dd.data[i + 3] = 255;
    }
    const c = new OffscreenCanvas(w, h); c.getContext('2d').putImageData(dd, 0, 0);
    const blob = await c.convertToBlob({ type: 'image/png' });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return { share: changed / (w * h), sameSize: ia.width === ib.width && ia.height === ib.height, a: [ia.width, ia.height], b: [ib.width, ib.height], png: btoa(bin) };
  }, ['data:image/png;base64,' + a.toString('base64'), 'data:image/png;base64,' + b.toString('base64')]);
  await page.close();
  return result;
}

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
  const browser = await chromium.launch({ proxy });
  const rows = [];
  for (const size of sizes) {
    config.base = config.before;
    const before = await context(browser, size, null);
    config.base = config.after;
    const after = await context(browser, size, config.ds);
    for (const item of config.pages) {
      const name = `${slug(item.name)}-${slug(size.name)}`;
      let a = await shoot(before, config.before, item);
      let b = await shoot(after, config.after, item);
      let d = await diff(browser, a.png, b.png);
      if (d.share > 0) {
        // a difference is confirmed by a second pair of captures: one that came from a late font goes away, a real one stays
        a = await shoot(before, config.before, item);
        b = await shoot(after, config.after, item);
        d = await diff(browser, a.png, b.png);
      }
      const st = styleChanges(a.styles, b.styles);
      fs.writeFileSync(path.join(out, 'img', `${name}-avant.jpg`), a.jpg);
      fs.writeFileSync(path.join(out, 'img', `${name}-apres.jpg`), b.jpg);
      fs.writeFileSync(path.join(out, 'img', `${name}-diff.png`), Buffer.from(d.png, 'base64'));
      rows.push({ page: item.name, size: size.name, name, share: d.share, sameSize: d.sameSize, a: d.a, b: d.b, comparable: st.comparable, changes: st.changes });
      const styleNote = !st.comparable ? 'éléments différents' : st.changes.length ? `${st.changes.length} styles changent` : 'styles identiques';
      console.log(`${(d.share * 100).toFixed(2).padStart(6)}%  ${item.name} · ${size.name}  (${styleNote})${d.sameSize ? '' : `  (hauteur ${d.a[1]} → ${d.b[1]}px)`}`);
    }
    await before.close();
    await after.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(rows, null, 1));
  fs.writeFileSync(path.join(out, 'index.html'), page(rows));
  console.log(`\n${rows.length} captures comparées, ${rows.filter((r) => r.share > 0).length} avec des différences → ${path.join(out, 'index.html')}`);
})();

// the page to review: a summary, then each page and size with its before, its after and what changed
function page(rows) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pct = (r) => (r.share === 0 ? 'identique' : `${(r.share * 100).toFixed(2).replace('.', ',')}% de pixels changés`);
  const list = rows.map((r) => `<li><a href="#${r.name}">${esc(r.page)} · ${esc(r.size)}</a> <span class="${r.share ? 'chg' : 'same'}">${pct(r)}</span></li>`).join('');
  const blocks = rows.map((r) => `
  <section id="${r.name}">
    <h2>${esc(r.page)} · ${esc(r.size)} <span class="${r.share ? 'chg' : 'same'}">${pct(r)}</span></h2>
    ${r.sameSize ? '' : `<p class="note">Hauteur de la page : ${r.a[1]}px avant, ${r.b[1]}px après.</p>`}
    <p class="note">${!r.comparable ? 'La page n’a pas les mêmes éléments avant et après.' : r.changes.length ? `${r.changes.length} styles calculés changent.` : 'Styles calculés identiques : un écart de pixels vient alors du rendu du navigateur, pas d’un changement.'}</p>
    ${r.changes.length ? `<details><summary>Les styles qui changent</summary><pre>${esc(r.changes.slice(0, 200).join('\n'))}${r.changes.length > 200 ? '\n…' : ''}</pre></details>` : ''}
    <div class="trio">
      <figure><figcaption>Avant</figcaption><img loading="lazy" src="img/${r.name}-avant.jpg" alt="Avant"></figure>
      <figure><figcaption>Après</figcaption><img loading="lazy" src="img/${r.name}-apres.jpg" alt="Après"></figure>
      <figure><figcaption>En rouge, ce qui a changé</figcaption><img loading="lazy" src="img/${r.name}-diff.png" alt="Différences"></figure>
    </div>
  </section>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(config.title || 'Avant / après')}</title>
<style>
  :root { color-scheme: light; --bg: #fdfcfa; --ink: #1a1a1a; --dim: rgba(26,26,26,.62); --line: rgba(201,169,97,.35); --chg: #a3403e; --same: #5c7a4f; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.6 system-ui, sans-serif; }
  main { max-width: 1600px; margin: 0 auto; padding: 32px max(16px, env(safe-area-inset-left, 0px)); }
  h1 { font-weight: 500; margin: 0 0 8px; } h2 { font-size: 18px; font-weight: 500; margin: 0 0 12px; }
  ul { columns: 2 320px; padding-left: 18px; } section { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--line); }
  .chg { color: var(--chg); font-size: 13px; } .same { color: var(--same); font-size: 13px; } .note { color: var(--dim); }
  pre { white-space: pre-wrap; font-size: 12px; background: #fff; border: 1px solid var(--line); padding: 12px; }
  .trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start; }
  figure { margin: 0; min-width: 0; } figcaption { font-size: 12px; color: var(--dim); margin-bottom: 6px; }
  img { display: block; width: 100%; height: auto; border: 1px solid var(--line); }
  @media (max-width: 768px) { .trio { grid-template-columns: minmax(0, 1fr); } }
</style></head><body><main>
<h1>${esc(config.title || 'Avant / après')}</h1>
<p class="note">${rows.length} captures, ${rows.filter((r) => r.share > 0).length} avec des différences. Avant : ${esc(config.before)}. Après : ${esc(config.after)}${config.ds ? `, avec le design system de ${esc(config.ds)}` : ''}.</p>
<ul>${list}</ul>${blocks}
</main></body></html>`;
}
