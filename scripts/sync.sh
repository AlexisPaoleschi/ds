#!/bin/sh
# Copies one version of the design system into an app: ./scripts/sync.sh 1.0.0 ../bank
# The copy lands in <app>/static/ds/ds-<version>.css; the app's pages link that file.
set -e
version="$1"; app="$2"
[ -n "$version" ] && [ -d "$app" ] || { echo "usage: sync.sh <version> <app dir>"; exit 1; }
mkdir -p "$app/static/ds"
rm -f "$app"/static/ds/ds-*.css
curl -fsSL "https://cdn.jsdelivr.net/gh/AlexisPaoleschi/ds@v$version/dist/ds.css" -o "$app/static/ds/ds-$version.css"
echo "$app/static/ds/ds-$version.css"
echo "now link /static/ds/ds-$version.css in the app's pages, in place of the previous version"
