// The starter repository is a verbatim copy of template/. It must equal that folder exactly, be the same working
// demo the Cred site shows, and package updates must leave the rest alone.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, mkdtempSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { replacePackage } from '../update-package.mjs';

const root = path.resolve(import.meta.dirname, '../../../..');
const sh = (c, cwd = root) => execSync(c, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const walk = (dir, base = dir) => readdirSync(dir).flatMap(f => {
  const p = path.join(dir, f);
  return statSync(p).isDirectory() ? walk(p, base) : [path.relative(base, p)];
}).sort();

const work = mkdtempSync(path.join(root, '.starter-test-'));
test.after(() => rmSync(work, { recursive: true, force: true }));
const ref = sh('git stash create') || 'HEAD';
const out = path.join(work, 'starter');
sh(`sh template/package/tools/build-starter.sh ${out} ${ref}`);

test('starter is an exact copy of template/', () => {
  const expected = walk(path.join(root, 'template'));
  assert.deepEqual(walk(out), expected);
  for (const f of expected) assert.ok(readFileSync(path.join(out, f)).equals(readFileSync(path.join(root, 'template', f))), f);
});

test('starter is the working demo without Cred project files', () => {
  for (const f of ['README.md', 'index.html', 'embed.html', '404.html', '_headers', '_redirects', '.nojekyll', '.gitignore', 'LICENSE',
    'package.json', 'package-lock.json', 'data/config.js', 'package/assets/js/cred.js',
    '.github/workflows/check.yml', '.github/workflows/update.yml', '.github/workflows/deploy.yml', '.github/workflows/pages.yml'])
    assert.ok(existsSync(path.join(out, f)), `starter has ${f}`);
  for (const f of ['template', 'docs', 'CHANGELOG.md', 'AGENTS.md', 'site', '.github/workflows/starter.yml'])
    assert.ok(!existsSync(path.join(out, f)), `starter excludes ${f}`);
  const page = readFileSync(path.join(out, 'index.html'), 'utf8');
  assert.match(page, /data-theme="auto"/);
  assert.match(page, /src="package\/assets\/js\/cred\.js"/);
  assert.doesNotMatch(page, /location\.replace|http-equiv="refresh"/);
  const readme = readFileSync(path.join(out, 'README.md'), 'utf8');
  assert.match(readme, /^# Reviews\n/);
  assert.doesNotMatch(readme, /git remote add upstream|Fork and replace|Use this template/);
  assert.match(readme, /EXAMPLE\.COM/);
  assert.doesNotMatch(readme, /YOUR-SITE/);
  assert.deepEqual(JSON.parse(readFileSync(path.join(out, 'package.json'), 'utf8')).devDependencies,
    JSON.parse(readFileSync(path.join(root, 'template/package.json'), 'utf8')).devDependencies);
});

test('starter data is byte-for-byte the demo the Cred site shows', () => {
  const demo = path.join(root, 'template/data'), data = path.join(out, 'data');
  assert.deepEqual(walk(data), walk(demo));
  for (const f of walk(demo)) assert.ok(readFileSync(path.join(data, f)).equals(readFileSync(path.join(demo, f))), f);
  assert.deepEqual(walk(path.join(out, 'package')), walk(path.join(root, 'template/package')));
});

test('starter validates, and its export keeps its own page indexable', () => {
  sh('node package/tools/validate.mjs data', out);
  sh('git init -q && git add -A && git -c user.name=t -c user.email=t@t commit -qm s', out);
  sh(`sh package/tools/export-site.sh ${path.join(work, 'pub')}`, out);
  const page = readFileSync(path.join(work, 'pub/index.html'), 'utf8');
  assert.doesNotMatch(page, /noindex/);
  assert.match(page, /data-theme="auto"/);
  assert.match(readFileSync(path.join(work, 'pub/_headers'), 'utf8'), /Access-Control-Allow-Origin: \*/);
  assert.ok(existsSync(path.join(work, 'pub/versions.json')));
  assert.ok(existsSync(path.join(work, 'pub/embed.html')));
  assert.ok(!existsSync(path.join(work, 'pub/.github')));
  assert.ok(!existsSync(path.join(work, 'pub/site')));
});

test('package update replaces only package/ in a starter with client content', () => {
  const client = path.join(work, 'client');
  sh(`sh template/package/tools/build-starter.sh ${client} ${ref}`);
  writeFileSync(path.join(client, 'README.md'), '# My reviews\n');
  writeFileSync(path.join(client, 'data/config.js'), 'export default { business: { name: "Mine" } };\n');
  writeFileSync(path.join(client, 'index.html'), '<!doctype html><title>mine</title>\n');
  writeFileSync(path.join(client, 'package/assets/js/old-only.js'), 'stale\n');
  const keep = walk(client).filter(f => !f.startsWith('package/')).map(f => [f, readFileSync(path.join(client, f))]);
  const entries = walk(path.join(root, 'template/package')).map(f => ({ file: 'package/' + f, mode: '100644', bytes: readFileSync(path.join(root, 'template/package', f)) }));
  const manifest = JSON.parse(readFileSync(path.join(client, 'package.json'), 'utf8'));
  replacePackage(client, entries, manifest, JSON.parse(readFileSync(path.join(root, 'template/package.json'), 'utf8')));
  for (const [f, bytes] of keep) assert.ok(readFileSync(path.join(client, f)).equals(bytes), `unchanged ${f}`);
  assert.ok(!existsSync(path.join(client, 'package/assets/js/old-only.js')));
  assert.deepEqual(walk(path.join(client, 'package')), walk(path.join(root, 'template/package')));
});
