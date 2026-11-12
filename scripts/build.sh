#!/bin/sh
# Puts the tokens and the components together in dist/ds.css, the one file the apps copy.
set -e
cd "$(dirname "$0")/.."
version=$(cat VERSION)
# the stylesheets by role, in this order: the foundation (fonts, tokens, fields, the page), the small marks (swatch, pip,
# spinner), the controls, the surfaces, the data, the public pieces, the pages; the chosen gold closes the list, so
# that it wins over the controls' hover
foundation="src/fonts.css src/tokens.css src/base.css src/page.css"
marks="src/marks.css"
controls="src/buttons.css src/tabs.css src/pick.css src/period.css src/periodpick.css src/datepick.css src/reorder.css src/live.css"
surfaces="src/card.css src/avatar.css src/msg.css src/toast.css src/dialog.css src/sheet.css src/panel.css src/viewer.css"
data="src/rows.css src/status.css src/tiles.css src/figures.css src/meter.css src/chart.css src/table.css src/calendar.css"
public="src/public.css src/hero.css src/topbar.css src/backlink.css src/photogrid.css"
pages="src/doc.css src/settings.css"
states="src/chosen.css"
# the scripts: the core every bundle starts with, the icons' sprite and the behaviours, then the components
js_controls="src/pick.js src/reorder.js src/datepick.js src/live.js"
js_surfaces="src/sheet.js"
js_data="src/table.js src/calendar.js src/chart.js src/figures.js"
js_photo="src/viewer.js src/photogrid.js"
# the site kit: what alexispaoleschi.com shares between its pages and no app needs, in files of their own
css_site="src/sitebase.css src/sitebar.css src/banners.css src/event.css src/home.css src/eventslist.css src/newsletter.css src/testimonials.css"
js_site="src/site.js"
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat $foundation $marks $controls $surfaces $data $public $pages $states; } > dist/ds.css
# the script: the core, the icons' sprite, the bubble and the dialog and the rest of ds.js, then the components
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/core.js src/icons.js src/ds.js $js_surfaces $js_data $js_controls $js_photo; } > dist/ds.js
# the photo viewer and the grid of photos alone, for a public page that needs nothing else of ds.js (the site's events)
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/core.js $js_photo; } > dist/ds-photo.js
# the site kit, which the site links after ds.css (and ds-photo.js on its event pages)
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat $css_site; } > dist/ds-site.css
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/core.js $js_site; } > dist/ds-site.js
# the icons alone, in a file a page links to with no script: <svg class="ico"><use href="icons-X.Y.Z.svg#i-mail"/></svg>
{ echo '<svg xmlns="http://www.w3.org/2000/svg">'; echo "<!-- ds $version · github.com/AlexisPaoleschi/ds · the icons of src/icons.js -->";
  sed -n '/var sprite = `/,/^`;$/p' src/icons.js | sed '1d;$d'; echo '</svg>'; } > dist/icons.svg
echo "dist/ds.css dist/ds.js dist/ds-photo.js dist/ds-site.css dist/ds-site.js dist/icons.svg $version"
