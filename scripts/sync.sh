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
echo "now link /static/ds/ds-$version.css and .js in the app's pages, in place of the previous version"
