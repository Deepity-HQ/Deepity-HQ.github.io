#!/bin/sh
# Renders scripts/og.html to public/og.png (1200x630) with headless Firefox.
set -e
cd "$(dirname "$0")/.."
profile=$(mktemp -d)
firefox --headless --no-remote --profile "$profile" --window-size 1200,630 \
  --screenshot "$PWD/public/og.png" "file://$PWD/scripts/og.html"
rm -rf "$profile"
