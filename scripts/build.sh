#!/bin/sh
# Puts the tokens and the components together in dist/ds.css, the one file the apps copy.
set -e
cd "$(dirname "$0")/.."
version=$(cat VERSION)
{ echo "/* ds $version · github.com/AlexisPaoleschi/ds · do not edit this copy, change the ds repo */"; cat src/tokens.css src/components.css; } > dist/ds.css
echo "dist/ds.css $version"
