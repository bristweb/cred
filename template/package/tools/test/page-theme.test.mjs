import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';

const root = path.resolve(import.meta.dirname, '../../../..');
const read = p => readFileSync(path.join(root, p), 'utf8');
const script = read('site/page-theme.js');
const runtime = read(existsSync(path.join(root, 'template/package/assets/js/cred.js')) ? 'template/package/assets/js/cred.js' : 'package/assets/js/cred.js');
const detect = runtime.slice(runtime.indexOf('  function detectHostTheme() {'), runtime.indexOf('\n  function ', runtime.indexOf('  function detectHostTheme() {') + 10));
// Exercise the widget's existing host-theme function, not a second implementation of it.
function host(search, dark) {
  const attrs = {};
  const html = { className: '', setAttribute: (k, v) => { attrs[k] = v; }, getAttribute: k => attrs[k] || '' };
  const context = { URLSearchParams, location: { search }, document: { documentElement: html, body: null }, matchMedia: () => ({ matches: dark.value }), getComputedStyle: () => ({ colorScheme: 'normal' }) };
  return { context, attrs, detect: () => runInNewContext(detect + '\ndetectHostTheme()', context) };
}
for (const [search, expected] of [['', 'auto'], ['?theme=auto', 'auto'], ['?theme=light', 'light'], ['?theme=dark', 'dark'], ['?theme=invalid', 'auto']]) {
  test(`standalone ${search || '(default)'} opts into ${expected}`, () => {
    const dark = { value: false }, h = host(search, dark);
    runInNewContext(script, h.context);
    assert.equal(h.attrs['data-theme'], expected);
    assert.equal(h.detect(), expected === 'dark' ? 'dark' : 'light');
    dark.value = true;
    assert.equal(h.detect(), expected === 'light' ? 'light' : 'dark');
    dark.value = false;
    assert.equal(h.detect(), expected === 'dark' ? 'dark' : 'light');
  });
}
test('widget on a light-only host stays light even when OS is dark', () => {
  const h = host('', { value: true }); // no standalone page opt-in script
  assert.equal(h.detect(), 'light');
});
test('standalone CSS has system-dark and explicit overrides, without styling the widget or iframe', () => {
  const css = read('site/page-theme.css');
  assert.match(css, /:root\[data-theme="auto"\] \{ color-scheme: light dark;/);
  assert.match(css, /:root\[data-theme="dark"\] \{ color-scheme: dark; --cred-page-bg: #0d1117;/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root\[data-theme="auto"\] \{ --cred-page-bg: #0d1117;/);
  assert.match(css, /:root \{ color-scheme: light; --cred-page-bg: #ffffff;/);
  assert.equal(css.includes('.rw-'), false);
  const iframe = read('site/embed.html');
  assert.match(iframe, /background:transparent/);
  assert.match(iframe, /data-embed/);
  assert.match(iframe, /window\.self\s*!==\s*window\.top|self!==window\.top/);
  assert.equal(iframe.includes('page-theme.'), false);
  assert.match(runtime, /addEventListener\('change', applyTheme\)/, 'existing widget media-change listener is retained');
});

test('starter reviews page is dual-mode (standalone chrome, transparent when embedded)', () => {
  const page = read('template/index.html');
  assert.match(page, /data-theme="auto"/);
  assert.match(page, /data-embed/);
  assert.match(page, /window\.self\s*!==\s*window\.top/);
  assert.match(page, /q\.has\(['"]embed['"]\)/);
  assert.match(page, /color-scheme:light dark/);
  assert.match(page, /html\[data-embed\],html\[data-embed\] body\{margin:0;background:transparent\}/);
  assert.equal(/html\[data-embed\][^\n{]*\{[^}]*color-scheme/.test(page), false);
  assert.match(page, /src="package\/assets\/js\/cred\.js"/);
});
test('standalone pages link theme resources at alias/subpath-safe URLs', () => {
  for (const page of ['index.html', 'example.html', 'heather.html']) {
    if (!existsSync(path.join(root, 'site', page))) continue;
    const html = read(`site/${page}`);
    for (const name of ['page-theme.js', 'page-theme.css']) assert.ok(html.includes(`../site/${name}`), page);
    for (const url of [`https://host.example/site/${page}`, `https://host.example/heather-cred/site/${page}`]) {
      assert.ok(new URL('../site/page-theme.js', url).pathname.endsWith('/site/page-theme.js'));
    }
  }
});
test('a fork root redirect preserves theme and other URL options', { skip: !existsSync(path.join(root, 'index.html')) }, () => {
  const js = read('index.html').match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(js, 'root redirect needs to preserve its query, not just a fixed meta refresh');
  const destination = read('index.html').match(/<a\s+href="([^"]+)"/)?.[1];
  assert.match(destination, /^site\/[A-Za-z0-9_-]+\.html$/);
  assert.ok(existsSync(path.join(root, destination)), 'fallback points at an actual client page');
  for (const search of ['', '?theme=dark', '?theme=light&source=elsewhere']) {
    let target;
    runInNewContext(js, { URL, location: { href: 'https://host.example/heather-cred/' + search, search, hash: '#reviews', replace: x => { target = String(x); } } });
    assert.equal(target, 'https://host.example/heather-cred/' + destination + search + '#reviews');
  }
});
