// The mail kit (ds 4.22.0): its parts write only its values. Every colour of mail.html is one of mail.json's, its card is
// mail.json's width, its fonts mail.json's, its button a table cell that Outlook colours.
// usage: node checks/mail.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const assert = (ok, what, got) => { if (!ok) { console.log('ÉCHEC', what, JSON.stringify(got)); process.exitCode = 1; } else console.log('ok  ', what); };
const kit = JSON.parse(fs.readFileSync(path.join(root, 'src/mail.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'src/mail.html'), 'utf8');
const colors = new Set(Object.values(kit.colors).map(c => c.toLowerCase()));
const used = [...new Set((html.match(/#[0-9a-fA-F]{3,6}\b/g) || []).map(c => c.toLowerCase()))];
assert(used.every(c => colors.has(c)), 'mail.html : chaque couleur est une de mail.json', used.filter(c => !colors.has(c)));
assert(new RegExp('max-width:' + kit.width + 'px').test(html), 'mail.html : la carte fait la largeur de mail.json (' + kit.width + 'px)', kit.width);
const fonts = [...new Set((html.match(/font-family:[^;"]+/g) || []).map(f => f.slice(12)))];
assert(fonts.every(f => f === kit.fonts.title || f === kit.fonts.text), 'mail.html : ses polices sont celles de mail.json', fonts);
assert(/<td bgcolor="#c9a961"[^>]*>\s*<a /.test(html), 'mail.html : le bouton est une cellule colorée, qu’Outlook dessine aussi', null);
