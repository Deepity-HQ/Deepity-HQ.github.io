#!/usr/bin/env bash
# Regenerates public/docs from the Deepity sources with Doxygen.
# Usage: bun run docs [path/to/deepity]   (defaults to ../deepity)
set -euo pipefail

SRC="$(cd "${1:-$(dirname "$0")/../../deepity}" && pwd)"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/docs"
CFG="$(mktemp)"
trap 'rm -f "$CFG"' EXIT

cat > "$CFG" <<DOXY
@INCLUDE = $SRC/Doxyfile
OUTPUT_DIRECTORY = $OUT
HTML_OUTPUT = .
GENERATE_LATEX = NO
DOXY

rm -rf "$OUT"
# The docs stylesheet loads the site fonts, so make sure the code font is served
mkdir -p "$(dirname "$0")/../public/fonts"
cp "$(dirname "$0")/../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2" "$(dirname "$0")/../public/fonts/JetBrainsMono.woff2"
# Doxygen resolves INPUT relative to the project root
(cd "$SRC" && doxygen "$CFG")
echo "Docs written to $OUT"
