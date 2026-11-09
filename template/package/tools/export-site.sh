#!/bin/sh
# Writes the publish folder for a deploy: the committed files (no .git, node_modules, untracked or ignored files), at
# the same paths as in the repo, then the generated /v/ release copies and versions.json (build-versions.mjs).
# Cred exports site/, template/index.html (dual-mode page), template/data/, template/package/ and root host files. A starter (template/ published as the
# repo root) exports its root pages, data/ and package/. Not a build: nothing is renamed.
# Usage: sh package/tools/export-site.sh <out> [<commit>]   (from the repo root; <out> must not exist; commit: HEAD)
set -eu
out="$1"
ref="${2:-HEAD}"
paths=""
for p in _headers _redirects .nojekyll index.html embed.html 404.html robots.txt sitemap.xml site data \
         template/index.html template/data template/package package; do
  if git cat-file -e "$ref:$p" 2>/dev/null; then paths="$paths $p"; fi
done
case "$paths" in
  *" package"*|*" template/package"*) ;;
  *) echo "export-site: $ref has no package/ (or template/package/)" >&2; exit 1 ;;
esac
mkdir "$out"
# shellcheck disable=SC2086
git archive "$ref" $paths | tar -x -C "$out"
# Tools live under package/ in a starter, or template/package/ in Cred.
tools=""
for d in package/tools template/package/tools; do
  if [ -f "$d/build-versions.mjs" ]; then tools=$d; break; fi
done
[ -n "$tools" ] || { echo "export-site: build-versions.mjs not found" >&2; exit 1; }
node "$tools/build-versions.mjs" "$out"
