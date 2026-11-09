#!/bin/sh
# Copies one version of the design system into an app: ./scripts/sync.sh 1.0.0 ../bank
# The copy lands in <app>/static/ds/ds-<version>.css and .js; the app's pages link those files.
set -e
version="$1"; app="$2"
[ -n "$version" ] && [ -d "$app" ] || { echo "usage: sync.sh <version> <app dir>"; exit 1; }
mkdir -p "$app/static/ds"
rm -f "$app"/static/ds/ds-*.css "$app"/static/ds/ds-*.js
for kind in css js; do
  curl -fsSL "https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist/ds.$kind" -o "$app/static/ds/ds-$version.$kind"
  echo "$app/static/ds/ds-$version.$kind"
done
# the fonts, next to the copy: ds.css asks for fonts/<name>.woff2 (the list is dist/fonts/index.txt)
rm -rf "$app/static/ds/fonts" && mkdir -p "$app/static/ds/fonts"
curl -fsSL "https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist/fonts/index.txt" | while read -r font; do
  [ -n "$font" ] && curl -fsSL "https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist/fonts/$font" -o "$app/static/ds/fonts/$font"
done
echo "$app/static/ds/fonts/ ($(ls "$app/static/ds/fonts" | wc -l) files)"
echo "now link /static/ds/ds-$version.css and .js in the app's pages, in place of the previous version, and remove their Google Fonts links"
