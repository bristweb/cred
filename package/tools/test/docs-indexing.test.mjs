import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '../../..');
const read = (dir, file) => readFileSync(path.join(dir, file), 'utf8');
const put = (dir, file, text) => {
  mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  writeFileSync(path.join(dir, file), text);
};
// Fixed template fixtures: tests must also run in a populated instance with its own sitemap/routing.
const stock = {
  'site/index.html': '<!-- cred:setup-page -->\n<head><link rel="canonical" href="https://cred.bristleconeweb.com/"></head>',
  'site/example.html': '<!-- cred:setup-page -->\n<head><link rel="canonical" href="https://cred.bristleconeweb.com/example/"></head><script data-source="../template/data/"></script>',
  'site/embed.html': '<head><meta name="robots" content="noindex, nofollow, noarchive"></head>',
  'site/robots.txt': 'User-agent: *\nAllow: /\nSitemap: https://cred.bristleconeweb.com/sitemap.xml\n',
  'site/sitemap.xml': '<urlset><url><loc>https://cred.bristleconeweb.com/</loc></url><url><loc>https://cred.bristleconeweb.com/example/</loc></url></urlset>',
  '_redirects': '/ /site/ 200\n/example/ /site/example 200\n',
};
const noindex = html => /<meta name="robots" content="noindex">/.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
function fixture(t, config) {
  const dir = mkdtempSync(path.join(tmpdir(), 'cred-indexing-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [file, text] of Object.entries(stock)) put(dir, file, text);
  for (const f of ['_headers', 'package/assets/js/cred.js']) put(dir, f, read(root, f));
  put(dir, 'site/reviews.html', '<head><title>Client reviews</title></head><body><script src="../package/assets/js/cred.js"></script></body>');
  if (config !== undefined) put(dir, 'data/config.js', config);
  return dir;
}
function apply(dir) {
  const r = spawnSync(process.execPath, [path.join(root, 'package/tools/docs-indexing.mjs'), dir], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r;
}

test('example-only export retains indexable setup pages, sitemap and robots', t => {
  const dir = fixture(t);
  apply(dir);
  for (const f of ['site/index.html', 'site/example.html', 'site/embed.html', 'site/robots.txt', 'site/sitemap.xml', '_headers']) {
    assert.equal(read(dir, f), stock[f] ?? read(root, f), f);
  }
  assert.equal(noindex(read(dir, 'site/index.html')), false);
  assert.equal(noindex(read(dir, 'site/example.html')), false);
});

test('local data: only the marked docs get literal noindex; embed, client pages, data and widget stay untouched', t => {
  const config = 'export default { business: {name: "Client"}, platforms: {google: {name: "Google"}}, reviews: {years: []} };';
  const dir = fixture(t, config);
  const content = read(dir, 'site/reviews.html');
  const headers = read(dir, '_headers');
  const originalRobots = read(dir, 'site/robots.txt');
  const sitemapAdvertisement = originalRobots.match(/^Sitemap:.*\/sitemap\.xml\r?\n/m)?.[0] || '';
  const expectedRobots = originalRobots.replace(sitemapAdvertisement, '');
  apply(dir);
  for (const f of ['index.html', 'example.html']) assert.equal(noindex(read(dir, `site/${f}`)), true, f);
  assert.equal(read(dir, 'site/reviews.html'), content);
  assert.equal(read(dir, 'site/embed.html'), stock['site/embed.html'], 'existing iframe noindex stays (explicit preference)');
  assert.equal(read(dir, 'data/config.js'), config);
  assert.equal(read(dir, 'package/assets/js/cred.js'), read(root, 'package/assets/js/cred.js'));
  assert.equal(read(dir, '_headers'), headers, 'no blanket header added');
  assert.equal(/noindex|robots/i.test(read(dir, 'package/assets/js/cred.js')), false, 'embed never controls the customer page robots');
  assert.equal(existsSync(path.join(dir, 'site/sitemap.xml')), false, 'no generic docs sitemap left');
  assert.equal(read(dir, 'site/robots.txt'), expectedRobots, 'only the empty sitemap advertisement is removed; explicit robots rules are preserved');
});

test('aliases and source overrides cannot bypass the docs policy', t => {
  const dir = fixture(t, 'export default {};');
  apply(dir);
  const rules = read(dir, '_redirects').split('\n').filter(l => l.startsWith('/')).map(l => l.trim().split(/\s+/));
  for (const [alias, dest] of [['/', '/site/'], ['/example/', '/site/example']]) {
    assert.equal(rules.find(r => r[0] === alias)?.[1], dest);
  }
  // The same exported HTML is served at real paths (also under a GitHub project prefix) and Cloudflare aliases.
  assert.equal(noindex(read(dir, 'site/index.html')), true, '/, /site/, /site/index.html, ?source=…');
  assert.equal(noindex(read(dir, 'site/example.html')), true, '/example/, /site/example, /site/example.html');
  assert.match(read(dir, 'site/example.html'), /data-source="\.\.\/template\/data\/"/, 'demo still explicitly uses examples, yet is noindex');
});

test('broken local config follows the widget example fallback', t => {
  const dir = fixture(t, 'throw new Error("broken config");');
  assert.match(apply(dir).stderr, /keeping the example fallback policy/);
  assert.equal(read(dir, 'site/index.html'), stock['site/index.html']);
  assert.equal(read(dir, 'site/sitemap.xml'), stock['site/sitemap.xml']);
});

test('client replacement and explicit noindex preferences are preserved', t => {
  const dir = fixture(t, 'export default {};');
  const page = '<head><title>Client content</title><meta name="robots" content="index,follow"></head>';
  put(dir, 'site/index.html', page); // replaced page, no setup marker
  const robots = 'User-agent: *\nDisallow: /\n'; // intentionally opted out (e.g. an existing HWA site)
  put(dir, 'site/robots.txt', robots);
  put(dir, '_headers', '/*\n  X-Robots-Tag: noindex\n');
  apply(dir);
  assert.equal(read(dir, 'site/index.html'), page);
  assert.equal(read(dir, 'site/robots.txt'), robots);
  assert.equal(read(dir, '_headers'), '/*\n  X-Robots-Tag: noindex\n');
});

test('mixed sitemap keeps client URLs and advertisement, removes only noindex setup entries', t => {
  const dir = fixture(t, 'export default {};');
  put(dir, 'site/sitemap.xml', read(dir, 'site/sitemap.xml').replace('</urlset>', '<url><loc>https://client.example/reviews</loc></url>\n</urlset>'));
  apply(dir);
  const sitemap = read(dir, 'site/sitemap.xml');
  assert.match(sitemap, /https:\/\/client.example\/reviews/);
  assert.equal(sitemap.includes('bristleconeweb.com'), false);
  assert.equal(read(dir, 'site/robots.txt'), stock['site/robots.txt']);
});

test('empty setup sitemap: preserve explicit allow/disallow rules and unrelated sitemap advertisement exactly', t => {
  const dir = fixture(t, 'export default {};');
  put(dir, 'site/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: https://client.example/sitemap.xml\nSitemap: https://client.example/client-map.xml\n');
  apply(dir);
  assert.equal(read(dir, 'site/robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: https://client.example/client-map.xml\n');
});
