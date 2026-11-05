// Adds every tagged release (git tags vX.Y.Z) to a Pages build directory:
//   <dist>/v/X.Y.Z/   immutable copy of that tag's widget (src/assets, src/lang; assets/, lang/ in tags before the src/ layout)
//   <dist>/versions.json and cache rules appended to <dist>/_headers.
// Usage: node src/scripts/build-versions.mjs dist   (needs full git history: actions/checkout fetch-depth 0)
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
const dist = process.argv[2] || 'dist';
const sh = c => execSync(c, { encoding: 'utf8' }).trim();
const tags = sh('git tag -l "v*"').split('\n').filter(t => /^v\d+\.\d+\.\d+$/.test(t));
const num = v => v.split('.').map(Number);
const cmp = (a, b) => { const x = num(a), y = num(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
const versions = tags.map(t => t.slice(1)).sort(cmp);
let headers = '\n';
for (const v of versions) {
  const out = `${dist}/v/${v}`;
  mkdirSync(out, { recursive: true });
  // tags from the src/ layout keep the widget under src/; older tags have assets/ and lang/ at the root
  const nested = sh(`git ls-tree --name-only v${v} src`) === 'src';
  execSync(nested ? `git archive v${v} src/assets src/lang | tar -x -C ${out} --strip-components=1` : `git archive v${v} assets lang | tar -x -C ${out}`);
  headers += `/v/${v}/*\n  Cache-Control: public, max-age=31536000, immutable\n`;
}
const latest = JSON.parse(readFileSync('package.json', 'utf8')).version;
writeFileSync(`${dist}/versions.json`, JSON.stringify({ latest, versions }, null, 2) + '\n');
appendFileSync(`${dist}/_headers`, headers);
console.log(`versions: ${versions.join(', ') || '(none)'}`);
appendFileSync(`${dist}/_headers`, '/versions.json\n  Cache-Control: public, max-age=300\n');
