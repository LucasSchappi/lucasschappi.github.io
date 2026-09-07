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
  --exclude 'images-of-fire-arcade/' --exclude 'untitled folder/' \
  --exclude '.DS_Store' --exclude '.placeholder-backup/' \
  "$SRC/" "$DEST/"

echo "staged into $DEST"
find "$DEST" -name '*.html' | sed "s|$DEST|  site|" | sort
