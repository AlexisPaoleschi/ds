#!/bin/sh
# Puts the tokens and the components together in dist/ds.css, the one file the apps copy.
set -e
cd "$(dirname "$0")/.."
version=$(cat VERSION)
# the stylesheets, in order: the fonts and tokens, the shell, then the components; Bank's and Studio's own components
# (moved here once a second app could use them) close the list
css="src/fonts.css src/tokens.css src/base.css src/shell.css src/buttons.css src/tiles.css src/panel.css src/period.css src/doc.css src/toast.css src/dialog.css src/settings.css src/site.css src/viewer.css src/topbar.css"
css_bank="src/pick.css src/sheet.css src/table.css src/reorder.css src/meter.css src/ruled.css"
css_studio="src/calendar.css src/chart.css src/figures.css src/periodpick.css src/live.css"
js_bank="src/sheet.js src/table.js src/pick.js src/reorder.js"
js_studio="src/calendar.js src/chart.js src/figures.js src/live.js"
css_photo="src/viewer-behaviour.css src/photogrid.css src/hero.css src/backlink.css"
js_photo="src/viewer.js src/photogrid.js"
css_date="src/datepick.css"
js_date="src/datepick.js"
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat $css $css_bank $css_studio $css_photo $css_date; } > dist/ds.css
# the script: the icons' sprite, then the bubble and the dialog
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/icons.js src/ds.js $js_bank $js_studio $js_photo $js_date; } > dist/ds.js
# the photo viewer and the grid of photos alone, for a public page that needs nothing else of ds.js (the site's events)
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat $js_photo; } > dist/ds-photo.js
echo "dist/ds.css dist/ds.js dist/ds-photo.js $version"
