#!/usr/bin/env bash
# Copy the site into the AWS deploy folder's site/ directory.
#
# The real project stays here, under git. This only stages a copy for
# publishing; it uploads nothing. Run ../schappistudios-aws-deploy/bin/deploy
# afterwards to actually publish.
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${1:-$HOME/code/schappistudios-aws-deploy/site}"

[[ -d "$DEST" ]] || { echo "error: $DEST does not exist" >&2; exit 1; }

rsync -a --delete \
  --exclude '.git/' --exclude '.gitignore' --exclude 'README.md' \
  --exclude 'serve.py' --exclude 'bin-sync-site.sh' \
  --exclude 'docs/' --exclude 'tools/' \
  --exclude 'images-of-fire-arcade/' --exclude 'untitled folder/' \
  --exclude '.DS_Store' --exclude '.placeholder-backup/' \
  --exclude '_*' \
  "$SRC/" "$DEST/"

# Stamp the CSS and JS links with a fingerprint of the files themselves.
#
# The deploy tells browsers to keep these for a year and never re-check
# ("immutable"), which is only safe if the URL changes whenever the contents
# do. Bumping a ?v= number by hand means one forgotten bump leaves every
# returning visitor pinned to the old file for a year, with no way to tell.
# Deriving it from the content makes that impossible to get wrong.
css_v=$(md5 -q "$DEST/assets/css/site.css" | cut -c1-8)
js_v=$(md5 -q "$DEST/assets/js/site.js" | cut -c1-8)
find "$DEST" -name '*.html' -print0 | xargs -0 sed -i '' \
  -e "s|site\.css?v=[^\"']*|site.css?v=$css_v|g" \
  -e "s|site\.js?v=[^\"']*|site.js?v=$js_v|g"

echo "staged into $DEST  (css v=$css_v, js v=$js_v)"
find "$DEST" -name '*.html' | sed "s|$DEST|  site|" | sort
