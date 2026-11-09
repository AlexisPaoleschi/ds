#!/bin/sh
# Puts the tokens and the components together in dist/: ds.css and ds.js for every app, ds-tools.css, ds-tools.js and
# ds-icons.js for Bank and Studio, ds-photo.js for a page of photos, the site kit and the icons' file for the site.
set -e
cd "$(dirname "$0")/.."
version=$(cat VERSION)
# the stylesheets by role, in this order: the foundation (fonts, tokens, fields, the page), the small marks (swatch, pip,
# spinner), the controls, the surfaces, the data, the public pieces, the pages; the chosen gold closes the list, so
# that it wins over the controls' hover
foundation="src/fonts.css src/tokens.css src/base.css src/page.css"
marks="src/marks.css"
controls="src/buttons.css src/tabs.css"
surfaces="src/card.css src/avatar.css src/msg.css src/toast.css src/dialog.css src/viewer.css"
data="src/tiles.css src/meter.css"
public="src/public.css src/hero.css src/topbar.css src/backlink.css src/photogrid.css"
pages="src/doc.css"
states="src/chosen.css"
# the tools: what only Bank and Studio draw (pickers and periods, the date picker, moving by the grip, the new version,
# the sheet, the filters' panel, rows, the sources' state, figures, charts, tables, the calendar, the settings page), in
# ds-tools.css after ds.css, in the same order by role; the chosen gold closes it too, over its controls' hover
tools_controls="src/pick.css src/period.css src/periodpick.css src/datepick.css src/reorder.css src/live.css"
tools_surfaces="src/sheet.css src/panel.css"
tools_data="src/rows.css src/status.css src/figures.css src/chart.css src/table.css src/calendar.css"
tools_pages="src/settings.css"
# the scripts: the core every bundle starts with, then the shared behaviours; the tools' behaviours and components in
# ds-tools.js, after ds.js (no core of their own: they need ds.js, which has it); the photos in ds-photo.js
js_tools="src/tools.js src/sheet.js src/table.js src/calendar.js src/chart.js src/figures.js src/pick.js src/reorder.js src/datepick.js src/live.js"
js_photo="src/viewer.js src/photogrid.js"
# the site kit: what alexispaoleschi.com shares between its pages and no app needs, in files of their own
css_site="src/sitebase.css src/sitebar.css src/banners.css src/event.css src/home.css src/eventslist.css src/newsletter.css src/testimonials.css"
js_site="src/site.js"
head="/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"
{ echo "$head"; cat $foundation $marks $controls $surfaces $data $public $pages $states; } > dist/ds.css
{ echo "$head"; cat $tools_controls $tools_surfaces $tools_data $tools_pages $states; } > dist/ds-tools.css
# the script every app links: the core and the shared behaviours (the bubble, the window, dates and figures, the server)
{ echo "$head"; cat src/core.js src/ds.js; } > dist/ds.js
{ echo "$head"; cat $js_tools; } > dist/ds-tools.js
# the icons' sprite, put at the top of the page by a script of its own that the browser keeps: Bank and Studio link it
# after ds.js, and their pages keep writing <use href="#i-name"/>
{ echo "$head"; cat src/icons.js; } > dist/ds-icons.js
# the photo viewer and the grid of photos, for a page that shows photos (the site's events)
{ echo "$head"; cat src/core.js $js_photo; } > dist/ds-photo.js
# the site kit, which the site links after ds.css (and ds-photo.js on its event pages)
{ echo "$head"; cat $css_site; } > dist/ds-site.css
{ echo "$head"; cat src/core.js $js_site; } > dist/ds-site.js
# the icons alone, in a file a page links to with no script: <svg class="ico"><use href="icons-X.Y.Z.svg#i-mail"/></svg>
{ echo '<svg xmlns="http://www.w3.org/2000/svg">'; echo "<!-- ds $version · github.com/AlexisPaoleschi/ds · the icons of src/icons.js -->";
  sed -n '/var sprite = `/,/^`;$/p' src/icons.js | sed '1d;$d'; echo '</svg>'; } > dist/icons.svg
echo "dist/ds.css dist/ds-tools.css dist/ds.js dist/ds-tools.js dist/ds-icons.js dist/ds-photo.js dist/ds-site.css dist/ds-site.js dist/icons.svg $version"
