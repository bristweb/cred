// One-time, browser-only template setup. Inputs arrive via environment, never interpolated as shell/code.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const START = '<!-- cred:instance:start -->', END = '<!-- cred:instance:end -->';
const html = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
export function siteUrl(value, base = false) {
  let u;
  try { u = new URL(value); } catch { throw new Error('Enter a full http(s) website URL.'); }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) throw new Error('URLs must use http(s), without embedded credentials.');
  if (base) {
    if (u.search || u.hash || /\.html?$/i.test(u.pathname)) throw new Error('Deployed-site URL must be the site root (optional project subpath), without a query, fragment or HTML filename.');
    u.pathname = u.pathname.replace(/\/*$/, '/');
  }
  return u.href;
}
export function setup(dir, { businessName, deployedUrl, businessWebsite = '', repository }) {
  if (!/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(repository || '') || /\/(\.|\.\.)$/.test(repository)) throw new Error('Invalid GitHub repository.');
  if (repository.toLowerCase() === 'bristweb/cred') throw new Error('Create your own repository with Use this template first. Setup never runs on bristweb/cred.');
  const name = String(businessName || '').trim();
  if (!name || name.length > 200 || /[\u0000-\u001f]/.test(name)) throw new Error('Business name must be 1–200 characters without control characters.');
  const base = siteUrl(deployedUrl, true), website = businessWebsite ? siteUrl(businessWebsite) : undefined;
  const read = file => readFileSync(path.join(dir, file), 'utf8');
  const data = path.join(dir, 'data');
  if (existsSync(data) && readdirSync(data).some(f => f !== 'README.md')) throw new Error('data/ is already populated. Nothing changed. Edit your existing config in GitHub instead of running setup again.');
  for (const file of ['index.html', 'site/reviews.html']) if (existsSync(path.join(dir, file))) throw new Error(`${file} already exists. Setup will not overwrite client pages.`);
  const readme = read('README.md'), embed = read('site/embed.html'), redirects = read('_redirects');
  const placeholder = `${START}\n<!-- Filled once by the browser-only setup action; the rest of this README is preserved. -->\n${END}`;
  if (!readme.includes(placeholder) || readme.split(START).length !== 2 || readme.split(END).length !== 2) throw new Error('README setup markers are missing or duplicated. Refusing to rewrite a custom README.');
  if (!embed.includes('<!-- cred:template-embed-title -->') || !embed.includes('<title>Reviews</title>')) throw new Error('embed.html is customized; setup will not overwrite it.');
  if (!/^\/[ \t]+\/site\/[ \t]+200[ \t]*$/m.test(redirects)) throw new Error('Root routing is customized; setup will not overwrite it.');
  const robots = read('site/robots.txt'), sitemap = read('site/sitemap.xml');
  const stockSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://cred.bristleconeweb.com/</loc></url>\n  <url><loc>https://cred.bristleconeweb.com/example/</loc></url>\n</urlset>\n';
  if (robots !== 'User-agent: *\nAllow: /\nSitemap: https://cred.bristleconeweb.com/sitemap.xml\n' || sitemap !== stockSitemap) {
    throw new Error('Robots or sitemap is customized. Setup will not overwrite explicit client indexing preferences.');
  }
  const reviewUrl = new URL('site/reviews.html', base).href;
  const embedUrl = new URL('site/embed.html', base).href;
  const scriptUrl = new URL('package/assets/js/cred.js', base).href;
  const instance = `${START}\n### ${html(name)}\n\n- [Reviews](${reviewUrl}) · [Transparent iframe](${embedUrl}) · [Your repository](https://github.com/${repository})\n- Embed: \`<script src="${scriptUrl}" defer></script>\`\n- No reviews are included yet. Add your platforms and real reviews using GitHub’s file editor or upload button in \`data/\`; leave \`package/\` alone.\n\n${END}`;
  const config = { version: 'latest', include_examples: false, business: { name, ...(website ? {website} : {}) }, platforms: { direct: { name: 'Direct feedback', icon: 'assets/icons/direct.svg' } }, reviews: { years: [] } };
  const page = `<!doctype html>\n<html lang="en" data-theme="auto"><head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${html(name)} reviews</title><link rel="canonical" href="${html(reviewUrl)}">\n<style>html{color-scheme:light dark;background:Canvas;color:CanvasText}body{margin:0}</style>\n<script>var t=new URLSearchParams(location.search).get('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}</script>\n</head><body><script src="../package/assets/js/cred.js" defer></script></body></html>\n`;
  const entry = '<!doctype html>\n<meta charset="utf-8">\n<script>location.replace(new URL("site/reviews.html"+location.search+location.hash,location.href));</script>\n<meta http-equiv="refresh" content="0;url=site/reviews.html">\n<a href="site/reviews.html">Reviews</a>\n';
  // All conflict checks above precede any writes. Existing client data/pages are never replaced.
  const files = new Map([
    ['data/config.js', '// Client-owned config. Edit in GitHub; no local install needed.\nexport default ' + JSON.stringify(config, null, 2) + ';\n'],
    ['data/theme/theme.css', '/* Client theme: add --rw-* overrides here. Widget defaults work without changes. */\n'],
    ['data/assets/icons/direct.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M2 3h20v14H8l-6 5zm2 2v13l3-3h13V5z"/></svg>\n'],
    ['site/reviews.html', page], ['index.html', entry],
    ['site/embed.html', embed.replace('<title>Reviews</title>', `<title>${html(name)} reviews</title>`)],
    ['_redirects', redirects.replace(/^\/[ \t]+\/site\/[ \t]+200[ \t]*$/m, '/                 /site/reviews                       200')],
    ['site/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', base).href}\n`],
    ['site/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${html(reviewUrl)}</loc></url></urlset>\n`],
    ['README.md', readme.slice(0, readme.indexOf(START)) + instance + readme.slice(readme.indexOf(END) + END.length)],
  ]);
  for (const file of ['site/index.html', 'site/example.html']) {
    const text = read(file);
    if (text.includes('<!-- cred:setup-page')) files.set(file, text.replaceAll('https://cred.bristleconeweb.com/assets/js/cred.js', html(scriptUrl)));
  }
  for (const [file, text] of files) { mkdirSync(path.dirname(path.join(dir, file)), {recursive:true}); writeFileSync(path.join(dir, file), text); }
  return { base, reviewUrl, embedUrl, scriptUrl };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { console.log(JSON.stringify(setup(process.cwd(), { businessName: process.env.CRED_BUSINESS_NAME, deployedUrl: process.env.CRED_DEPLOYED_URL, businessWebsite: process.env.CRED_BUSINESS_WEBSITE, repository: process.env.GITHUB_REPOSITORY }), null, 2)); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
