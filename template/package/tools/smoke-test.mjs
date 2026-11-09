#!/usr/bin/env node
// Browserless smoke test of the published layout. No dependencies; run from the Cred repo root:
//   node template/package/tools/smoke-test.mjs
// 1. Serves the repo with a plain static server under a project subpath (/cred/, like GitHub Pages) and at the root,
//    and fetches the real paths the pages and the widget use (pages, cred.js, CSS, lang, examples, every review file).
// 2. Runs the widget's own site-root rule (taken from cred.js) on every script URL form: real path, GitHub subpath,
//    /v/<x.y.z>/ release, Cloudflare short URL /assets/js/cred.js, and an external data-source page.
// 3. Exports the site (export-site.sh; staged changes included) and checks the /v/ releases, versions.json, and that nothing private is uploaded.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdtempSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { widgetVersion } from './widget-version.mjs';

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`); if (!cond) failed++; };
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

function serve(dir, prefix) {
  const server = createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!u.startsWith(prefix)) { res.writeHead(404).end(); return; }
    let f = path.join(path.resolve(dir), u.slice(prefix.length));
    if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!f.startsWith(path.resolve(dir)) || !existsSync(f)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }).end(readFileSync(f));
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}
const get = async url => { const r = await fetch(url); return { status: r.status, text: r.status === 200 ? await r.text() : '' }; };

const credJs = existsSync('template/package/assets/js/cred.js') ? 'template/package/assets/js/cred.js' : 'package/assets/js/cred.js';
const src = readFileSync(credJs, 'utf8');
const rootRule = src.match(/const SITE_ROOT = DEFAULT_BASE\.replace\((\/.*\/), '\/'\);/);
ok(rootRule, 'cred.js: SITE_ROOT rule found');
const siteRoot = scriptUrl => new URL('../../', scriptUrl).href.replace(eval(rootRule[1]), '/');
ok(src.includes("'template/data/'") && src.includes("'data/config.js'"), 'cred.js: default data paths are data/ then template/data/');
ok(src.includes('base = new URL(base, location.href).href;'), 'cred.js: a relative data-source is resolved against the page before import() (else it resolves against cred.js)');
ok(src.includes("SITE_ROOT + 'versions.json'") && src.includes("SITE_ROOT + v + 'assets/js/cred.js'"), 'cred.js: versions.json and /v/ copies are read from the site root');
ok(!/https?:\/\/[^'"\s]*bristleconeweb\.com[^'"\s]*\.(js|css|json)/.test(src), 'cred.js: no runtime dependency on bristleconeweb.com');

for (const [script, root] of [
  ['https://h.example/package/assets/js/cred.js', 'https://h.example/'],
  ['https://h.example/template/package/assets/js/cred.js', 'https://h.example/'],
  ['https://u.github.io/cred/package/assets/js/cred.js', 'https://u.github.io/cred/'],
  ['https://u.github.io/cred/template/package/assets/js/cred.js', 'https://u.github.io/cred/'],
  ['https://h.example/v/1.1.0/assets/js/cred.js', 'https://h.example/'],
  ['https://u.github.io/cred/v/1.2.0/assets/js/cred.js', 'https://u.github.io/cred/'],
  ['https://h.example/assets/js/cred.js', 'https://h.example/'],
  ['https://u.github.io/mypackage/assets/js/cred.js', 'https://u.github.io/mypackage/'],
]) ok(siteRoot(script) === root, `site root of ${script} is ${root}`);

async function checkSite(dir, prefix, label) {
  const server = await serve(dir, prefix);
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  const pkg = existsSync(path.join(dir, 'template/package/assets/js/cred.js')) ? 'template/package'
    : existsSync(path.join(dir, 'package/assets/js/cred.js')) ? 'package' : null;
  try {
    for (const page of ['site/index.html', 'site/embed.html', 'site/example.html', 'site/robots.txt', '404.html']) {
      if (!existsSync(path.join(dir, page))) continue;
      const { status, text } = await get(base + page);
      ok(status === 200, `${label}: ${page}`);
      for (const m of text.matchAll(/(?:src|href)="(\.\.\/(?:template\/)?package\/[^"]+)"/g)) {
        const url = new URL(m[1], base + page).href;
        ok((await get(url)).status === 200, `${label}: ${page} → ${url.slice(base.length)}`);
      }
    }
    ok(pkg, `${label}: package runtime present`);
    const code = siteRoot(base + pkg + '/assets/js/cred.js');
    ok(code === base, `${label}: widget site root is ${prefix}`);
    for (const p of [`${pkg}/assets/css/cred.css`, `${pkg}/lang/en.json`, `${pkg}/assets/icons/trophy.svg`])
      ok((await get(code + p)).status === 200, `${label}: ${p}`);
    const own = existsSync(path.join(dir, 'data/config.js'));
    ok((await get(code + 'data/config.js')).status === (own ? 200 : 404), `${label}: data/config.js ${own ? 'served (own data is the default)' : 'absent → examples are the default'}`);
    const ex = code + 'template/data/';
    const cfg = await get(ex + 'config.js');
    ok(cfg.status === 200, `${label}: template/data/config.js`);
    const conf = (await import('data:text/javascript;base64,' + Buffer.from(cfg.text).toString('base64'))).default;
    for (const y of conf.reviews?.years || []) ok((await get(ex + `reviews/${y}.json`)).status === 200, `${label}: example reviews/${y}.json`);
    ok((await get(ex + 'theme/theme.css')).status === 200, `${label}: example theme/theme.css`);
    for (const l of conf.languages || []) if (l.url) ok((await get(new URL(l.url, ex).href)).status === 200, `${label}: example ${l.url}`);
    ok((await get(ex + 'assets/icons/google.svg')).status === 200, `${label}: example assets/icons/google.svg`);
  } finally { server.close(); }
}

await checkSite('.', '/cred/', 'repo under /cred/ (GitHub Pages project path)');
await checkSite('.', '/', 'repo at /');

const out = path.join(mkdtempSync(path.join(tmpdir(), 'cred-')), '_publish');
const ref = execSync('git stash create', { encoding: 'utf8' }).trim() || 'HEAD';
const exportSh = existsSync('template/package/tools/export-site.sh') ? 'template/package/tools/export-site.sh' : 'package/tools/export-site.sh';
execSync(`sh ${exportSh} ${out} ${ref}`, { stdio: 'inherit' });
const top = readdirSync(out).sort();
ok(!top.some(f => ['.git', 'node_modules', '.github', 'docs'].includes(f)), `export: top level is ${top.join(' ')}`);
const versions = JSON.parse(readFileSync(path.join(out, 'versions.json'), 'utf8'));
ok(versions.latest === widgetVersion(), `export: versions.json latest ${versions.latest}`);
for (const v of versions.versions) ok(existsSync(path.join(out, 'v', v, 'assets/js/cred.js')) && existsSync(path.join(out, 'v', v, 'lang/en.json')), `export: v/${v}/assets/js/cred.js and lang/en.json`);
await checkSite(out, '/cred/', 'export under /cred/');
const server = await serve(out, '/');
const b = `http://127.0.0.1:${server.address().port}/`;
for (const v of versions.versions) ok((await get(b + `v/${v}/assets/css/cred.css`)).status === 200, `export: GET /v/${v}/assets/css/cred.css`);
ok((await get(b + 'versions.json')).status === 200, 'export: GET /versions.json');
server.close();
ok(readFileSync(path.join(out, '_headers'), 'utf8').includes('/versions.json'), 'export: cache rules appended to _headers');

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
