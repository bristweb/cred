#!/bin/sh
# Assembles the standalone starter repository from this repo: the inner template (template/, whose data/ is the same
# demo the Cred site shows) plus the runtime package/ and a few shared host files. Nothing is copied by hand, so the
# starter can never drift from the demo. Excludes Cred's own site, docs, README, changelog and history.
# Usage: sh package/tools/build-starter.sh <out> [<commit>]   (from the repo root; <out> must not exist; commit: HEAD)
set -eu
out="$1"
ref="${2:-HEAD}"
mkdir "$out"
git archive "$ref" template | tar -x -C "$out" --strip-components=1
git archive "$ref" package site/embed.html .github/workflows/deploy.yml .github/workflows/pages.yml \
  .gitignore .nojekyll LICENSE package-lock.json | tar -x -C "$out"
git show "$ref:package.json" | node -e '
  let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
    const p = JSON.parse(s);
    const out = { name: "cred-site", private: true, type: p.type,
      description: "Reviews site built from the Cred starter (https://github.com/bristweb/cred)",
      scripts: { validate: "node package/tools/validate.mjs data", badge: "node package/tools/badge.mjs data" },
      devDependencies: p.devDependencies };
    process.stdout.write(JSON.stringify(out, null, 2) + "\n");
  });' > "$out/package.json"
