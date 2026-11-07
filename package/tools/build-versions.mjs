// Adds every tagged release (git tags vX.Y.Z) to a publish folder. This is the one generated part of a deploy:
//   <out>/v/X.Y.Z/assets/, <out>/v/X.Y.Z/lang/   immutable copy of that tag's widget, taken from package/ (this
//                                               layout), src/ (1.2.0 pre-release layout) or the repo root (1.0.x–1.1.x)
//   <out>/versions.json                         { latest, versions } read by the widget for config `version`
//   cache rules appended to <out>/_headers.
// <out> is a clean export of the tracked files, as they are (see export-site.sh); nothing else is copied or moved.
// Usage: node package/tools/build-versions.mjs <out>   (needs the tags: actions/checkout fetch-depth 0)
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { widgetVersion } from './widget-version.mjs';
const out = process.argv[2];
if (!out) { console.error('usage: build-versions.mjs <out>'); process.exit(1); }
const sh = c => execSync(c, { encoding: 'utf8' }).trim();
const tags = sh('git tag -l "v*"').split('\n').filter(t => /^v\d+\.\d+\.\d+$/.test(t));
const num = v => v.split('.').map(Number);
const cmp = (a, b) => { const x = num(a), y = num(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
const versions = tags.map(t => t.slice(1)).sort(cmp);
const has = (tag, p) => sh(`git ls-tree --name-only ${tag} ${p}`) === p;
let headers = '\n';
for (const v of versions) {
  const dir = `${out}/v/${v}`;
  mkdirSync(dir, { recursive: true });
  const prefix = ['package', 'src'].find(p => has(`v${v}`, `${p}/assets`)); // undefined: widget at the tag's root
  const paths = prefix ? `${prefix}/assets ${prefix}/lang` : 'assets lang';
  execSync(`git archive v${v} ${paths} | tar -x -C ${dir}${prefix ? ' --strip-components=1' : ''}`);
  headers += `/v/${v}/*\n  Cache-Control: public, max-age=31536000, immutable\n`;
}
const latest = widgetVersion();
writeFileSync(`${out}/versions.json`, JSON.stringify({ latest, versions }, null, 2) + '\n');
appendFileSync(`${out}/_headers`, headers + '/versions.json\n  Cache-Control: public, max-age=300\n');
console.log(`versions: ${versions.join(', ') || '(none)'}`);
