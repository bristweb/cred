import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { setup, siteUrl } from '../setup.mjs';
import { replacePackage, releaseTag, packagePath, compatibleManifest, update } from '../update-package.mjs';
import { widgetVersion } from '../widget-version.mjs';

const root = path.resolve(import.meta.dirname, '../../..');
const read = (dir, f) => readFileSync(path.join(dir, f), 'utf8');
const put = (dir, f, s) => { mkdirSync(path.dirname(path.join(dir, f)), {recursive:true}); writeFileSync(path.join(dir, f), s); };
const opts = {businessName: 'A & B "Art"', deployedUrl: 'https://reviews.example/project', businessWebsite: 'https://business.example/', repository: 'customer/reviews'};
function fixture(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'cred-template-'));
  t.after(() => rmSync(dir, {recursive:true,force:true}));
  for (const file of ['_headers','package.json']) cpSync(path.join(root,file),path.join(dir,file));
  put(dir,'data/README.md','Client data goes here.\n');
  put(dir,'README.md','# Cred\nUpstream: https://github.com/bristweb/cred/issues\n<!-- cred:instance:start -->\n<!-- Filled once by the browser-only setup action; the rest of this README is preserved. -->\n<!-- cred:instance:end -->\nKeep the full documentation.\n');
  put(dir,'_redirects','/                 /site/                              200\n/embed.html       /site/embed                         200\n');
  put(dir,'site/embed.html','<!-- cred:template-embed-title -->\n<title>Reviews</title>\n<meta name="robots" content="noindex, nofollow, noarchive">');
  for(const file of ['site/index.html','site/example.html']) put(dir,file,'<!-- cred:setup-page -->\n<html><head></head><body>Docs: https://github.com/bristweb/cred#options <code>https://cred.bristleconeweb.com/assets/js/cred.js</code></body></html>');
  put(dir,'site/robots.txt','User-agent: *\nAllow: /\nSitemap: https://cred.bristleconeweb.com/sitemap.xml\n');
  put(dir,'site/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://cred.bristleconeweb.com/</loc></url>\n  <url><loc>https://cred.bristleconeweb.com/example/</loc></url>\n</urlset>\n');
  return dir;
}
const snapshot = dir => {
  const out = {};
  const walk = base => { for (const f of readdirSync(path.join(dir,base), {withFileTypes:true})) {
    if(f.name === '.git') continue;
    const rel = path.join(base,f.name); if(f.isDirectory())walk(rel);else out[rel]=read(dir,rel);
  }};walk('');return out;
};
const config = async dir => (await import('data:text/javascript,'+encodeURIComponent(read(dir,'data/config.js')))).default;

test('one-time setup: empty real data, exact site/subpath URLs, bounded README and legitimate upstream links', async t => {
  const dir=fixture(t), before=read(dir,'README.md');
  const result=setup(dir,opts), c=await config(dir);
  assert.equal(c.business.name,opts.businessName);assert.equal(c.business.website,opts.businessWebsite);
  assert.deepEqual(c.reviews.years,[]);assert.equal(c.include_examples,false);
  assert.deepEqual(Object.keys(c.platforms),['direct']);
  assert.equal(result.scriptUrl,'https://reviews.example/project/package/assets/js/cred.js');
  assert.equal(result.reviewUrl,'https://reviews.example/project/site/reviews.html');
  assert.match(read(dir,'site/reviews.html'),/A &amp; B &quot;Art&quot; reviews/);
  assert.match(read(dir,'site/reviews.html'),/src="\.\.\/package\/assets\/js\/cred.js"/);
  assert.match(read(dir,'README.md'),/https:\/\/github.com\/customer\/reviews/);
  const outside=s=>s.replace(/<!-- cred:instance:start -->[\s\S]*?<!-- cred:instance:end -->/,'INSTANCE');
  assert.equal(outside(read(dir,'README.md')),outside(before),'no README rewrite');
  assert.ok(read(dir,'README.md').includes('https://github.com/bristweb/cred/issues') === before.includes('https://github.com/bristweb/cred/issues'));
  assert.match(read(dir,'site/index.html'),/github.com\/bristweb\/cred#options/,'legitimate upstream docs retained');
  assert.match(read(dir,'site/index.html'),/reviews.example\/project\/package\/assets\/js\/cred.js/);
  assert.match(read(dir,'site/robots.txt'),/Sitemap: https:\/\/reviews.example\/project\/sitemap.xml/);
  assert.equal((read(dir,'site/sitemap.xml').match(/<url>/g)||[]).length,1);
  assert.match(read(dir,'site/sitemap.xml'),/project\/site\/reviews.html/);
  assert.equal(read(dir,'_headers'),read(root,'_headers'),'no broad indexing/header changes');
  assert.match(read(dir,'_redirects'),/^\/[ \t]+\/site\/reviews[ \t]+200$/m);
  assert.match(read(dir,'_redirects'),/^\/embed.html[ \t]+\/site\/embed[ \t]+200$/m,'next routing rule stays on its own line');
  execFileSync(process.execPath,[path.join(root,'package/tools/validate.mjs'),path.join(dir,'data')]);
  execFileSync(process.execPath,[path.join(root,'package/tools/docs-indexing.mjs'),dir]);
  assert.match(read(dir,'site/index.html'),/<meta name="robots" content="noindex">/);
  assert.ok(!read(dir,'site/reviews.html').includes('noindex'),'only client content remains eligible');
  assert.ok(existsSync(path.join(dir,'site/sitemap.xml')),'client sitemap is retained');
});

test('URL input validation and optional business site are distinct', t => {
  for(const url of ['javascript:alert(1)','file:///tmp/x','https://user:password@host/','not a url','https://host/?q=x','https://host/index.html']) assert.throws(()=>siteUrl(url,true));
  assert.equal(siteUrl('https://host.example',true),'https://host.example/');
  const dir=fixture(t);setup(dir,{...opts,businessWebsite:''});
  assert.ok(!read(dir,'data/config.js').includes('business.example'));
});

test('setup refuses reruns, populated data, custom README/site/robots before writes', t => {
  const ready=fixture(t);setup(ready,opts);let before=snapshot(ready);assert.throws(()=>setup(ready,opts),/already populated/);assert.deepEqual(snapshot(ready),before);
  for(const [file,text,pattern] of [['data/config.js','export default {};',/populated/],['data/private.json','{}',/populated/],['README.md','# Client README',/markers/],['index.html','Client',/already exists/],['site/embed.html','My iframe',/customized/],['site/robots.txt','User-agent: *\nDisallow: /\n',/customized/]]) {
    const dir=fixture(t);put(dir,file,text);before=snapshot(dir);assert.throws(()=>setup(dir,opts),pattern,file);assert.deepEqual(snapshot(dir),before,file+' preserved');
  }
  const dir=fixture(t);before=snapshot(dir);assert.throws(()=>setup(dir,{...opts,repository:'bristweb/cred'}));assert.deepEqual(snapshot(dir),before);
});

const manifest=JSON.parse(read(root,'package.json'));
function incoming(version='1.2.1') {
  return ['package/assets/js/cred.js','package/tools/validate.mjs','package/tools/export-site.sh','package/tools/widget-version.mjs','package/tools/setup.mjs','package/tools/update-package.mjs'].map(file=>({file,mode:'100644',bytes:Buffer.from(file.endsWith('cred.js')?`const VERSION = '${version}';`:'// fixture\n')}));
}
test('package-only update: Git diff excludes README/data/site/workflows and version lives in package', t => {
  const dir=fixture(t);put(dir,'package/old.txt','old');put(dir,'.github/workflows/custom.yml','client workflow');
  const git=args=>execFileSync('git',args,{cwd:dir,encoding:'utf8'});
  git(['init','-q']);git(['add','.']);git(['-c','user.name=Cred','-c','user.email=cred@localhost','commit','-qm','fixture']);
  const oldVersion=JSON.parse(read(dir,'package.json')).version;
  replacePackage(dir,incoming(),manifest,manifest,'1.2.1');
  git(['add','-A']);const changed=git(['diff','--cached','--name-only']).trim().split('\n');
  assert.ok(changed.length>0);assert.ok(changed.every(f=>f.startsWith('package/')),changed.join(','));
  assert.equal(widgetVersion(path.join(dir,'package/assets/js/cred.js')),'1.2.1');
  assert.equal(JSON.parse(read(dir,'package.json')).version,oldVersion,'root manifest version need not be rewritten');
});
test('unsupported release/ref, path traversal, symlinks, old layout and root-toolchain changes fail before writes', t => {
  for(const bad of ['main','../v1.2.0','https://host/v1.2.0','v1.2.0;touch /tmp/pwn','v01.2.0']) assert.throws(()=>releaseTag(bad));
  assert.equal(releaseTag('v1.2.0'),'v1.2.0');
  for(const file of ['/package/x','package/../README.md','package/.git/config','package/foo\\x','package//x','README.md']) assert.throws(()=>packagePath(file));
  assert.throws(()=>packagePath('package/link','120000'));
  const dir=fixture(t);put(dir,'package/keep','unchanged');const before=snapshot(dir);
  assert.throws(()=>update(dir,'main'));assert.deepEqual(snapshot(dir),before);
  assert.throws(()=>replacePackage(dir,[],manifest,manifest),/old release layout/);
  assert.throws(()=>replacePackage(dir,incoming(),manifest,{...manifest,devDependencies:{other:'1'}}),/migration/);
  assert.throws(()=>replacePackage(dir,incoming(),manifest,manifest,'2.0.0'),/disagrees/);
  assert.deepEqual(snapshot(dir),before);
  assert.doesNotThrow(()=>compatibleManifest(manifest,{...manifest,version:'1.2.1'}));
});
