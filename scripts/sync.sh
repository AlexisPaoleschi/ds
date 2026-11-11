#!/bin/sh
# Copies one version of the design system into an app: ./scripts/sync.sh 1.0.0 ../bank
# The copy lands in <app>/static/ds/ds-<version>.css and .js; the app's pages link those files.
# For the site: ./scripts/sync.sh 1.0.0 ../bio site, into <site>/ds: ds.css, the photo viewer alone (ds-photo), the site
# kit (ds-site .css and .js) and the icons' file, no ds.js.
set -e
version="$1"; app="$2"; kind="$3"
[ -n "$version" ] && [ -d "$app" ] || { echo "usage: sync.sh <version> <app dir> [site]"; exit 1; }
cdn="https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist"
if [ "$kind" = "site" ]; then
  dest="$app/ds"
  mkdir -p "$dest"
  rm -f "$dest"/ds-*.css "$dest"/ds-*.js "$dest"/icons-*.svg
  for file in ds.css ds-photo.js ds-site.css ds-site.js icons.svg; do
    out="$dest/${file%%.*}-$version.${file#*.}"
    curl -fsSL "$cdn/$file" -o "$out"
    echo "$out"
  done
else
  dest="$app/static/ds"
  mkdir -p "$dest"
  rm -f "$dest"/ds-*.css "$dest"/ds-*.js
  for ext in css js; do
    curl -fsSL "$cdn/ds.$ext" -o "$dest/ds-$version.$ext"
    echo "$dest/ds-$version.$ext"
  done
fi
# the fonts, next to the copy: ds.css asks for fonts/<name>.woff2 (the list is dist/fonts/index.txt)
rm -rf "$dest/fonts" && mkdir -p "$dest/fonts"
curl -fsSL "$cdn/fonts/index.txt" | while read -r font; do
  [ -n "$font" ] && curl -fsSL "$cdn/fonts/$font" -o "$dest/fonts/$font"
done
echo "$dest/fonts/ ($(ls "$dest/fonts" | wc -l) files)"
echo "now link the new version in the pages, in place of the previous one"
