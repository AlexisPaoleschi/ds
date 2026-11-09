#!/bin/sh
# Copies one version of the design system into an app: ./scripts/sync.sh 1.0.0 ../selecta/src/main/resources
# The copy lands in <app>/static/ds/ (or <site>/ds for the site), each file named with its version; the pages link them.
#   no kind: ds.css and ds.js, which every app loads, the photo grid and viewer (ds-photo.js) and the icons' file
#            (icons-1.0.0.svg) a page points at (Selecta)
#   tools:   ./scripts/sync.sh 1.0.0 ../bank tools: also the tools (ds-tools .css and .js) and the icons' script
#            (ds-icons.js), for Bank and Studio, with no icons' file
#   site:    ./scripts/sync.sh 1.0.0 ../bio site, into <site>/ds: ds.css, the photo viewer alone (ds-photo), the site kit
#            (ds-site .css and .js) and the icons' file, no ds.js
set -e
version="$1"; app="$2"; kind="$3"
[ -n "$version" ] && [ -d "$app" ] || { echo "usage: sync.sh <version> <app dir> [tools|site]"; exit 1; }
cdn="https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist"
case "$kind" in
  site) dest="$app/ds"; files="ds.css ds-photo.js ds-site.css ds-site.js icons.svg" ;;
  tools) dest="$app/static/ds"; files="ds.css ds.js ds-tools.css ds-tools.js ds-icons.js" ;;
  *) dest="$app/static/ds"; files="ds.css ds.js ds-photo.js icons.svg" ;;
esac
mkdir -p "$dest"
rm -f "$dest"/ds-*.css "$dest"/ds-*.js "$dest"/icons-*.svg
for file in $files; do
  out="$dest/${file%%.*}-$version.${file#*.}"
  curl -fsSL "$cdn/$file" -o "$out"
  echo "$out"
done
# the fonts, next to the copy: ds.css asks for fonts/<name>.woff2 (the list is dist/fonts/index.txt)
rm -rf "$dest/fonts" && mkdir -p "$dest/fonts"
curl -fsSL "$cdn/fonts/index.txt" | while read -r font; do
  [ -n "$font" ] && curl -fsSL "$cdn/fonts/$font" -o "$dest/fonts/$font"
done
echo "$dest/fonts/ ($(ls "$dest/fonts" | wc -l) files)"
echo "now link the new version in the pages, in place of the previous one"
