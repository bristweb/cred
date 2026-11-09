#!/bin/sh
# Publishes template/ verbatim as the starter repository (bristweb/cred-starter). No assembly or rewriting:
# the starter tree equals template/ exactly. Edit template/ here; never edit the starter by hand.
# Usage: sh template/package/tools/build-starter.sh <out> [<commit>]   (from the Cred repo root; <out> must not exist)
set -eu
out="$1"
ref="${2:-HEAD}"
mkdir "$out"
git archive "$ref" template | tar -x -C "$out" --strip-components=1
