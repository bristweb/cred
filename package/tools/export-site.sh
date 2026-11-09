#!/bin/sh
# Writes the publish folder for a deploy: the committed files (no .git, node_modules, untracked or ignored files), at
# the same paths as in the repo, then the generated /v/ release copies and versions.json (build-versions.mjs).
# Only what a browser loads is exported: the root host files, site/, data/, template/data/ (the demo), package/. Not a build: nothing is renamed.
# Usage: sh package/tools/export-site.sh <out> [<commit>]   (from the repo root; <out> must not exist; commit: HEAD)
set -eu
out="$1"
ref="${2:-HEAD}"
paths=""
for p in _headers _redirects .nojekyll index.html 404.html site data template/data package; do
  if git cat-file -e "$ref:$p" 2>/dev/null; then paths="$paths $p"; fi
done
for p in site package; do
  case "$paths" in *" $p"*) ;; *) echo "export-site: $ref has no $p/" >&2; exit 1 ;; esac
done
mkdir "$out"
# shellcheck disable=SC2086
git archive "$ref" $paths | tar -x -C "$out"
node package/tools/build-versions.mjs "$out"
