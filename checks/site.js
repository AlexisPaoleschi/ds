// The site kit in a real browser (dist/ds-site.css, dist/ds-site.js, dist/icons.svg): the bar built from <div id="nav">,
// hidden over the hero and shown past it, its phone menu (the button, Escape, the veil, a link), a link to a part of the
// page landing just below the bar, the way back built with its icon from the sprite file, the loader taken away, the
// galleries opened in the viewer, every icon the kit and the site name present in the sprite file; and the kit's
// stylesheets, which name a token for every colour.
// usage: node checks/site.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const photo = n => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="hsl(${n * 47 % 360} 45% 42%)"/></svg>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const m = url.pathname.match(/^\/photo\/(\d+)\.svg$/);
  if (m) { res.writeHead(200, { 'Content-Type': 'image/svg+xml' }); return res.end(photo(+m[1])); }
  const file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const assert = (ok, what) => { if (!ok) { console.log('ÉCHEC', what); process.exitCode = 1; } else console.log('ok  ', what); };

// the kit's stylesheets: no colour written out, every colour is a token
function stylesheets() {
  const wrong = [];
  for (const f of ['sitebase', 'sitebar', 'banners', 'event'].map(n => 'src/' + n + '.css')) {
    const css = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i.test(css)) wrong.push(f);
  }
  return wrong;
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  assert(stylesheets().length === 0, 'the kit names a token for every colour ' + stylesheets().join(', '));
  const sprite = fs.readFileSync(path.join(root, 'dist/icons.svg'), 'utf8');
  const ids = new Set([...sprite.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]));
  const wanted = ['i-arrow-left', 'i-arrow-right', 'i-reload', 'i-users', 'i-leaf', 'i-ig', 'i-xlogo', 'i-bsky', 'i-patreon', 'i-mail', 'i-bell', 'i-map-pin'];
  assert(wanted.every(i => ids.has(i)), 'the sprite file holds the icons of the site and the kit ' + wanted.filter(i => !ids.has(i)).join(' '));
  assert(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">/.test(sprite), 'the sprite file is an SVG document of its own');

  const browser = await chromium.launch();
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  phone.on('pageerror', e => errors.push(String(e)));
  await phone.goto(base + '/checks/site.html', { waitUntil: 'networkidle' });
  await phone.waitForTimeout(300);

  const built = await phone.evaluate(() => ({
    bar: !!document.querySelector('nav.topbar.is-site.sticky-nav .topbar-brand'), links: document.querySelectorAll('.topbar-link').length,
    menu: document.querySelectorAll('.mobile-menu .mobile-menu-link').length, cta: (document.querySelector('.mobile-menu-cta') || {}).textContent,
    back: (document.querySelector('a.back-link.on-photo.back-button use') || { getAttribute: () => '' }).getAttribute('href'),
    backText: (document.querySelector('.back-button') || {}).textContent,
    icon: window.ds.icon('mail', 'ico x'), land: document.documentElement.classList.contains('landscape-warning-disabled'),
    visible: document.querySelector('.sticky-nav').classList.contains('visible') }));
  assert(built.bar && built.links === 2 && built.menu === 2 && built.cta === 'Book Now', 'the bar and its phone menu are built from <div id="nav">');
  assert(/\/dist\/icons\.svg#i-arrow-left$/.test(built.back) && built.backText.trim() === 'Events', 'the way back is built with the sprite file\'s arrow');
  assert(/<use href="[^"]*\/dist\/icons\.svg#i-mail"><\/use>/.test(built.icon) && /class="ico x"/.test(built.icon), 'ds.icon names the sprite file beside the script');
  assert(built.land, 'without window.dsLandscapeWarning the page scrolls held sideways (landscape-warning-disabled)');
  assert(!built.visible, 'the bar is hidden over the hero');

  await phone.evaluate(() => window.hideLoader());
  assert(await phone.evaluate(() => document.querySelector('.page-loader').classList.contains('hidden')), 'window.hideLoader() takes the loader away');

  await phone.evaluate(() => scrollTo(0, document.querySelector('.hero').offsetHeight + 200));
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => document.querySelector('.sticky-nav').classList.contains('visible')), 'the bar shows once the hero is passed');

  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  const open = await phone.evaluate(() => ['.mobile-menu', '.mobile-menu-overlay', '.mobile-menu-toggle'].every(s => document.querySelector(s).classList.contains('active')) && document.body.style.overflow === 'hidden');
  assert(open, 'the button opens the menu, its veil, and holds the page still');
  await phone.keyboard.press('Escape');
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => !document.querySelector('.mobile-menu').classList.contains('active') && document.body.style.overflow === ''), 'Escape closes the menu');
  await phone.waitForTimeout(700);
  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  await phone.evaluate(() => document.querySelector('.mobile-menu-overlay').click());
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => !document.querySelector('.mobile-menu').classList.contains('active')), 'the veil closes the menu');
  await phone.waitForTimeout(700);
  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  await phone.click('.mobile-menu-link >> text=FAQ');
  await phone.waitForTimeout(1200);
  const landed = await phone.evaluate(() => ({ menu: document.querySelector('.mobile-menu').classList.contains('active'),
    top: Math.round(document.querySelector('#faq').getBoundingClientRect().top), bar: document.querySelector('.sticky-nav').offsetHeight }));
  assert(!landed.menu, 'a link of the menu closes it');
  assert(Math.abs(landed.top - (landed.bar - 1)) <= 2, `a link to a part of the page lands just below the bar (${landed.top}px, the bar ${landed.bar}px)`);

  await phone.locator('.portfolio-item').nth(1).scrollIntoViewIfNeeded();
  await phone.locator('.portfolio-item').nth(1).click();
  await phone.waitForTimeout(800);
  const viewer = await phone.evaluate(() => { const v = document.querySelector('.viewer'); return v && getComputedStyle(v).display !== 'none' && (v.querySelector('.viewer-count') || {}).textContent; });
  assert(viewer && /2\s*\/\s*2/.test(viewer), 'a gallery opens in the viewer on its photo (' + viewer + ')');
  await phone.keyboard.press('Escape');

  const arrow = await phone.evaluate(() => { const i = document.querySelector('.schedule-list .ico'), b = i.getBBox(), r = i.getBoundingClientRect(); return [b.width > 0, Math.round(r.width), getComputedStyle(i).position]; });
  assert(arrow[0] && arrow[1] === 14 && arrow[2] === 'absolute', 'a schedule line opens with the sprite\'s arrow, 14px, drawn from the file');
  assert(errors.length === 0, 'no error on the page ' + errors.join(' | '));

  // a page that asks for the prompt to turn the phone upright
  const side = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  await side.addInitScript(() => { window.dsLandscapeWarning = true; });
  await side.goto(base + '/checks/site.html', { waitUntil: 'networkidle' });
  const prompt = await side.evaluate(() => { const w = document.querySelector('.landscape-warning'); return w && getComputedStyle(w).display === 'flex' && !!w.querySelector('use[href$="#i-reload"]'); });
  assert(prompt, 'window.dsLandscapeWarning puts the prompt over a phone held sideways');

  await browser.close();
  server.close();
})();
