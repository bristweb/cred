// Publishing never infers an indexing policy from the presence of a client's data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../../..');
const project = existsSync(path.join(root, 'template/README.md'));
const cmd = (args, cwd = root) => execFileSync(args[0], args.slice(1), { cwd, encoding: 'utf8' });
const read = (dir, file) => readFileSync(path.join(dir, file), 'utf8');

test('Cred export leaves public HTML, robots rules and sitemap unchanged', { skip: !project }, t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'cred-indexable-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const out = path.join(dir, 'published');
  const ref = cmd(['git', 'stash', 'create']).trim() || 'HEAD';
  cmd(['sh', 'template/package/tools/export-site.sh', out, ref]);
  for (const f of ['site/index.html', 'site/example.html', 'site/embed.html', 'site/robots.txt', 'site/sitemap.xml']) {
    assert.equal(read(out, f), read(root, f), `no rewriting ${f}`);
    assert.doesNotMatch(read(out, f), /noindex|nofollow|noarchive|Disallow:\s*\//i);
  }
  assert.doesNotMatch(read(out, '_headers'), /X-Robots-Tag/i);
  assert.match(read(out, 'site/robots.txt'), /Allow: \//);
  assert.match(read(out, 'site/sitemap.xml'), /https:\/\/cred\.bristleconeweb\.com\//);
  assert.doesNotMatch(read(root, 'template/package/assets/js/cred.js'), /noindex|robots/i, 'widget never controls the host page indexing');
  assert.ok(existsSync(path.join(out, 'template/package/assets/js/cred.js')));
  assert.ok(existsSync(path.join(out, 'template/data/config.js')));
});

test('starter exports public content by default and preserves explicit client restrictions', { skip: !project }, t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'cred-client-policy-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const starter = path.join(dir, 'starter');
  const ref = cmd(['git', 'stash', 'create']).trim() || 'HEAD';
  cmd(['sh', 'template/package/tools/build-starter.sh', starter, ref]);
  for (const f of ['index.html', '_headers'])
    assert.doesNotMatch(read(starter, f), /noindex|nofollow|noarchive|X-Robots-Tag/i, f);
  assert.ok(!existsSync(path.join(starter, 'docs')));
  assert.ok(!existsSync(path.join(starter, 'site')));
  assert.ok(!existsSync(path.join(starter, 'embed.html')));
  assert.ok(!existsSync(path.join(starter, 'robots.txt')), 'absent robots.txt does not restrict crawling');
  const rules = 'User-agent: *\nDisallow: /\n';
  const headers = '/*\n  Access-Control-Allow-Origin: *\n  X-Robots-Tag: noindex\n';
  const page = '<!doctype html><title>Private preview</title><meta name="robots" content="noindex,nofollow">\n';
  const sitemap = '<?xml version="1.0"?><urlset><url><loc>https://EXAMPLE.COM/mine</loc></url></urlset>\n';
  for (const [f, value] of [['robots.txt', rules], ['_headers', headers], ['index.html', page], ['sitemap.xml', sitemap]])
    writeFileSync(path.join(starter, f), value);
  cmd(['git', 'init', '-q'], starter);
  cmd(['git', 'add', '-A'], starter);
  cmd(['git', '-c', 'user.name=Cred', '-c', 'user.email=cred@localhost', 'commit', '-qm', 'Client content and explicit policies'], starter);
  const out = path.join(dir, 'published');
  cmd(['sh', 'package/tools/export-site.sh', out], starter);
  assert.equal(read(out, 'robots.txt'), rules);
  assert.equal(read(out, 'index.html'), page);
  assert.equal(read(out, 'sitemap.xml'), sitemap);
  assert.ok(read(out, '_headers').startsWith(headers), 'client header policy survives appended cache rules');
});
