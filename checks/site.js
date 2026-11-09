// The site kit in a real browser (dist/ds-site.css, dist/ds-site.js, dist/icons.svg): the bar built from <div id="nav">,
// hidden over the hero and shown past it, its phone menu (the button, Escape, the veil, a link), a link to a part of the
// page landing just below the bar, the way back built with its icon from the sprite file, the loader taken away, the
// galleries opened in the viewer (with a click, or Enter), the hidden bar and the closed menu out of Tab's reach, ds.h and
// ds.esc, every icon the kit and the site name present in the sprite file, a newsletter's form (ds.newsletter: the address
// checked, the button busy while it sends, the server's words under the field); and the kit's
// stylesheets, which name a token for every colour.
// usage: node checks/site.js (Playwright installed); it serves the repository itself on a free port
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const photo = n => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="hsl(${n * 47 % 360} 45% 42%)"/></svg>`;
const hits = { json: 0 };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  // the newsletter's endpoint: it answers after a moment, {ok, message}, from what the form sent
  if (url.pathname === '/subscribe') {
    let body = ''; req.on('data', c => { body += c; });
    req.on('end', () => setTimeout(() => {
      const f = new URLSearchParams(body), ok = f.get('email') === 'lea@example.com' && f.get('email_address_check') === '';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok, message: ok ? 'You are on the list.' : 'This address was refused.' }));
    }, 600));
    return;
  }
  if (url.pathname === '/data.json') { hits.json++; res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"events": {"lyon": {"soldOut": true}}}'); }
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
    visible: document.querySelector('.sticky-nav').classList.contains('is-visible') }));
  assert(built.bar && built.links === 2 && built.menu === 2 && built.cta === 'Book Now', 'the bar and its phone menu are built from <div id="nav">');
  // the bar's action spaced as the site's other buttons, 2.5px
  const ctaLs = await phone.evaluate(() => getComputedStyle(document.querySelector('.sticky-nav .btn')).letterSpacing);
  assert(ctaLs === '2.5px', 'the bar\'s « Book Now » spaced as the site\'s other buttons ' + ctaLs);
  assert(/\/dist\/icons\.svg#i-arrow-left$/.test(built.back) && built.backText.trim() === 'Events', 'the way back is built with the sprite file\'s arrow');
  assert(/<use href="[^"]*\/dist\/icons\.svg#i-mail"><\/use>/.test(built.icon) && /class="ico x"/.test(built.icon), 'ds.icon names the sprite file beside the script');
  assert(built.land, 'without window.dsLandscapeWarning the page scrolls held sideways (landscape-warning-disabled)');
  // what a page writes from a Gist: escaped, or built as nodes, never run
  const safe = await phone.evaluate(() => {
    window.ran = 0;
    const p = ds.h('p', { class: 'x', text: '<img src=x onerror="window.ran++">' }, [ds.h('b', { text: 'b' }), ' & c', null]);
    document.body.append(p);
    const out = [ds.esc(`<a href="x">Tom & 'Jerry'</a>`), p.innerHTML, p.querySelectorAll('img').length];
    p.remove(); return out;
  });
  await phone.waitForTimeout(100);
  assert(safe[0] === '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;' && safe[2] === 0 && await phone.evaluate(() => window.ran === 0)
    && /^&lt;img src=x onerror="window\.ran\+\+"&gt;<b>b<\/b> &amp; c$/.test(safe[1]), 'ds.esc and ds.h in the site kit write a Gist\'s text as text, never as HTML ' + JSON.stringify(safe));
  assert(!built.visible, 'the bar is hidden over the hero');

  const read = await phone.evaluate(async () => { const [a, b] = await Promise.all([ds.json('/data.json'), ds.json('/data.json')]); return [a === b, a.events.lyon.soldOut]; });
  assert(read[0] && read[1] === true && hits.json === 1, `ds.json reads a file once per page, however many ask (${hits.json} request)`);
  const waited = await phone.evaluate(async () => { const loader = document.querySelector('.page-loader'); let early;
    const slow = new Promise(r => setTimeout(() => { early = loader.classList.contains('is-hidden'); r(); }, 150)); await ds.ready(slow); return [early, loader.classList.contains('is-hidden')]; });
  assert(waited[0] === false && waited[1] === true, 'ds.ready takes the loader away once what the page waits for has come');
  // hidden, the bar and the closed menu are out of Tab's reach, and no longer hidden from screen readers for good
  const reach = [];
  for (let i = 0; i < 10; i++) {
    await phone.keyboard.press('Tab');
    // the bar slides away in .3s when Tab goes back up to the top: on screen meanwhile, it is still reachable
    await phone.waitForTimeout(450);
    reach.push(await phone.evaluate(() => { const a = document.activeElement, bar = a.closest('.sticky-nav'), menu = a.closest('.mobile-menu');
      return bar && !bar.classList.contains('is-visible') ? 'hidden bar' : menu && !menu.classList.contains('is-open') ? 'closed menu' : 'ok'; }));
  }
  await phone.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
  await phone.waitForTimeout(450);
  const marks = await phone.evaluate(() => ({ nav: document.querySelector('.sticky-nav').getAttribute('aria-hidden'), menu: document.querySelector('.mobile-menu').getAttribute('aria-hidden'),
    vis: [getComputedStyle(document.querySelector('.sticky-nav')).visibility, getComputedStyle(document.querySelector('.mobile-menu')).visibility],
    toggle: ['type', 'aria-expanded', 'aria-controls'].map(x => document.querySelector('.mobile-menu-toggle').getAttribute(x)) }));
  assert(reach.every(x => x === 'ok') && marks.nav === null && marks.menu === null && marks.vis.join() === 'hidden,hidden' && marks.toggle.join() === 'button,false,site-menu',
    'hidden, the bar and the closed menu are out of Tab\'s reach; the menu\'s button says it is closed ' + JSON.stringify([reach.filter(x => x !== 'ok'), marks]));
  await phone.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
  await phone.waitForTimeout(300);

  await phone.evaluate(() => scrollTo(0, document.querySelector('.hero').offsetHeight + 200));
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => document.querySelector('.sticky-nav').classList.contains('is-visible')), 'the bar shows once the hero is passed');

  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  const open = await phone.evaluate(() => ['.mobile-menu', '.mobile-menu-overlay', '.mobile-menu-toggle'].every(s => document.querySelector(s).classList.contains('is-open')) && document.body.style.overflow === 'hidden');
  assert(open, 'the button opens the menu, its veil, and holds the page still');
  const opened = await phone.evaluate(() => ({ expanded: document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded'),
    focus: document.activeElement.className, vis: getComputedStyle(document.querySelector('.mobile-menu')).visibility }));
  assert(opened.expanded === 'true' && opened.focus === 'mobile-menu-link' && opened.vis === 'visible', 'opened, the menu says so and takes the keyboard to its first link ' + JSON.stringify(opened));
  await phone.keyboard.press('Escape');
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => !document.querySelector('.mobile-menu').classList.contains('is-open') && document.body.style.overflow === ''), 'Escape closes the menu');
  const shut = await phone.evaluate(() => ({ expanded: document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded'), back: document.activeElement.classList.contains('mobile-menu-toggle') }));
  assert(shut.expanded === 'false' && shut.back, 'Escape takes the keyboard back to the menu\'s button, which says it is closed ' + JSON.stringify(shut));
  await phone.waitForTimeout(700);
  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  await phone.evaluate(() => document.querySelector('.mobile-menu-overlay').click());
  await phone.waitForTimeout(200);
  assert(await phone.evaluate(() => !document.querySelector('.mobile-menu').classList.contains('is-open')), 'the veil closes the menu');
  await phone.waitForTimeout(700);
  await phone.click('.mobile-menu-toggle');
  await phone.waitForTimeout(200);
  await phone.click('.mobile-menu-link >> text=FAQ');
  await phone.waitForTimeout(1200);
  const landed = await phone.evaluate(() => ({ menu: document.querySelector('.mobile-menu').classList.contains('is-open'),
    top: Math.round(document.querySelector('#faq').getBoundingClientRect().top), bar: document.querySelector('.sticky-nav').offsetHeight }));
  assert(!landed.menu, 'a link of the menu closes it');
  assert(Math.abs(landed.top - (landed.bar - 1)) <= 2, `a link to a part of the page lands just below the bar (${landed.top}px, the bar ${landed.bar}px)`);

  await phone.locator('.portfolio-item').nth(1).scrollIntoViewIfNeeded();
  await phone.locator('.portfolio-item').nth(1).click();
  await phone.waitForTimeout(800);
  const viewer = await phone.evaluate(() => { const v = document.querySelector('.viewer'); return v && getComputedStyle(v).display !== 'none' && (v.querySelector('.viewer-count') || {}).textContent; });
  assert(viewer && /2\s*\/\s*2/.test(viewer), 'a gallery opens in the viewer on its photo (' + viewer + ')');
  await phone.keyboard.press('Escape');
  await phone.waitForTimeout(500);

  // a gallery with a photo-less item still works, and its photos open with the keyboard
  const venue = phone.locator('.gallery-grid .gallery-item').nth(1);
  await venue.scrollIntoViewIfNeeded();
  const wired = await phone.evaluate(() => [...document.querySelectorAll('.gallery-grid .gallery-item')].map(g => [g.getAttribute('role'), g.tabIndex, g.getAttribute('aria-label')]));
  await venue.focus();
  await phone.keyboard.press('Enter');
  await phone.waitForTimeout(800);
  const byKey = await phone.evaluate(() => { const v = document.querySelector('.viewer'); return v && getComputedStyle(v).display !== 'none' && (v.querySelector('.viewer-count') || {}).textContent; });
  assert(wired[0][0] === null && wired[1][0] === 'button' && wired[1][1] === 0 && wired[1][2] === 'Open Hall' && byKey && /1\s*\/\s*2/.test(byKey),
    'a gallery photo is a button the keyboard opens with Enter; an item without a photo is left out ' + JSON.stringify([wired, byKey]));
  await phone.keyboard.press('Escape');
  await phone.waitForTimeout(500);

  // a link to an id a selector cannot read (#2026) lands below the bar; with less motion, at once
  await phone.emulateMedia({ reducedMotion: 'reduce' });
  await phone.evaluate(() => scrollTo(0, document.querySelector('.hero').offsetHeight + 200));
  await phone.waitForTimeout(300);
  await phone.evaluate(() => document.getElementById('to2026').click());
  await phone.waitForTimeout(60);
  const venueTop = await phone.evaluate(() => ({ top: Math.round(document.getElementById('2026').getBoundingClientRect().top), bar: document.querySelector('.sticky-nav').offsetHeight }));
  await phone.emulateMedia({ reducedMotion: 'no-preference' });
  assert(Math.abs(venueTop.top - (venueTop.bar - 1)) <= 2, 'a link to #2026 lands just below the bar, at once when the device asks for less motion ' + JSON.stringify(venueTop));

  const arrow = await phone.evaluate(() => { const i = document.querySelector('.schedule-list .ico'), b = i.getBBox(), r = i.getBoundingClientRect(); return [b.width > 0, Math.round(r.width), getComputedStyle(i).position]; });
  assert(arrow[0] && arrow[1] === 14 && arrow[2] === 'absolute', 'a schedule line opens with the sprite\'s arrow, 14px, drawn from the file');
  assert(errors.length === 0, 'no error on the page ' + errors.join(' | '));

  // a page that scrolls by screens: a dot per screen, lit as one scrolls, the dots shown past the first
  const screens = await browser.newPage({ viewport: { width: 390, height: 600 } });
  await screens.setContent(`<link rel="stylesheet" href="${base}/dist/ds.css"><link rel="stylesheet" href="${base}/dist/ds-site.css">
    <body class="home"><nav class="scroll-dots"></nav><div class="scroll-hint">Scroll</div><div class="scroll-container">
    <section class="scroll-section" id="one">1</section><section class="scroll-section" id="two">2</section><section class="scroll-section" id="three">3</section></div>
    <script src="${base}/dist/ds-site.js"></script></body>`);
  await screens.evaluate(() => ds.screens());
  const before = await screens.evaluate(() => [document.querySelectorAll('.scroll-dots .scroll-dot').length, document.querySelector('.scroll-dots').classList.contains('is-visible'), document.querySelector('.scroll-hint').style.opacity]);
  await screens.evaluate(() => { const c = document.querySelector('.scroll-container'); c.style.scrollBehavior = 'auto'; c.scrollTo(0, document.getElementById('three').offsetTop); });
  await screens.waitForTimeout(200);
  const after = await screens.evaluate(() => [[...document.querySelectorAll('.scroll-dots .scroll-dot')].findIndex(d => d.classList.contains('is-on')), document.querySelector('.scroll-dots').classList.contains('is-visible'), document.querySelector('.scroll-hint').style.opacity]);
  assert(before[0] === 3 && !before[1] && before[2] === '1', `ds.screens writes a dot per screen, the hint on the first (${before})`);
  assert(after[0] === 2 && after[1] && after[2] === '0', `ds.screens lights the screen shown and shows the dots past the first (${after})`);

  // a page that asks for the prompt to turn the phone upright
  const side = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  await side.addInitScript(() => { window.dsLandscapeWarning = true; });
  await side.goto(base + '/checks/site.html', { waitUntil: 'networkidle' });
  const prompt = await side.evaluate(() => { const w = document.querySelector('.landscape-warning'); return w && getComputedStyle(w).display === 'flex' && !!w.querySelector('use[href$="#i-reload"]'); });
  assert(prompt, 'window.dsLandscapeWarning puts the prompt over a phone held sideways');

  // a newsletter's form: a wrong address said at once, then the button busy (turning, its colours kept) while it sends,
  // and the server's words in gold, the form emptied
  const nl = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await nl.goto(base + '/checks/site.html', { waitUntil: 'networkidle' });
  const news = await nl.evaluate(async () => {
    document.body.insertAdjacentHTML('beforeend', '<form id="nl" novalidate><input type="email" required><input name="email_address_check" value="">' +
      '<button class="btn is-save" type="submit">Subscribe</button><p class="field-note is-reserved" role="status"></p></form>');
    const form = document.getElementById('nl'), input = form.querySelector('input'), button = form.querySelector('button'), note = form.querySelector('.field-note');
    ds.newsletter(form, { url: '/subscribe' });
    const out = {};
    input.value = 'pas une adresse'; button.click();
    out.invalid = [note.textContent, note.className.includes('is-bad'), document.activeElement === input];
    input.value = 'lea@example.com'; button.click();
    await new Promise(r => setTimeout(r, 200));
    const after = getComputedStyle(button, '::after');
    out.busy = [button.classList.contains('is-busy'), button.disabled, after.content !== 'none' && after.content !== '', note.textContent];
    await new Promise(r => setTimeout(r, 900));
    out.done = [button.classList.contains('is-busy'), button.disabled, note.textContent, note.className.includes('is-good'), input.value];
    return out;
  });
  assert(JSON.stringify(news) === JSON.stringify({ invalid: ['Please enter a valid email address.', true, true], busy: [true, true, true, 'Signing you up…'],
    done: [false, false, 'You are on the list.', true, ''] }), 'ds.newsletter : l’adresse vérifiée, le bouton occupé pendant l’envoi, les mots du serveur ' + JSON.stringify(news));

  await browser.close();
  server.close();
})();
