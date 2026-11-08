#!/bin/sh
# Puts the tokens and the components together in dist/ds.css, the one file the apps copy.
set -e
cd "$(dirname "$0")/.."
version=$(cat VERSION)
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/tokens.css src/base.css src/shell.css src/buttons.css src/tiles.css src/panel.css src/period.css src/doc.css src/toast.css src/settings.css; } > dist/ds.css
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/ds.js; } > dist/ds.js
echo "dist/ds.css dist/ds.js $version"
