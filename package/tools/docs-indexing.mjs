// Export-time policy for the two bundled setup/demo pages, not for embedded widgets or client content.
// No local config (or it fails to import) means the widget falls back to examples: keep the docs indexable.
// Otherwise add a literal noindex to marked setup pages, regardless of ?source= or a demo's data-source.
// Run against the exported folder only: node package/tools/docs-indexing.mjs <export-folder>.
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.resolve(process.argv[2]);
const config = path.join(out, 'data/config.js');
if (!existsSync(config)) process.exit(0);
try { await import(pathToFileURL(config).href); }
catch (e) {
  console.warn(`docs-indexing: data/config.js cannot load; keeping the example fallback policy (${e.message})`);
  process.exit(0);
}

const canonicals = new Set();
for (const name of ['index.html', 'example.html']) {
  const file = path.join(out, 'site', name);
  if (!existsSync(file)) continue;
  let html = readFileSync(file, 'utf8');
  if (!html.includes('<!-- cred:setup-page')) continue; // a replacement client page owns its indexing policy
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonical) canonicals.add(canonical);
  // Add, never replace, a robots rule. Explicit client noindex/nofollow etc. remains in force.
  html = html.replace(/<\/head>/i, '<meta name="robots" content="noindex">\n</head>');
  writeFileSync(file, html);
}

// Do not advertise these now-noindex docs in the sitemap. Keep unrelated client URLs and robots rules verbatim.
const sitemap = path.join(out, 'site/sitemap.xml');
if (existsSync(sitemap)) {
  const xml = readFileSync(sitemap, 'utf8');
  const next = xml.replace(/<url\b[^>]*>[\s\S]*?<\/url>/g, entry =>
    canonicals.has(entry.match(/<loc>([^<]+)<\/loc>/)?.[1]) ? '' : entry);
  if (next !== xml) {
    if (/<url\b/.test(next)) writeFileSync(sitemap, next);
    else {
      unlinkSync(sitemap); // the stock sitemap contained only the two setup pages
      const robots = path.join(out, 'site/robots.txt');
      if (existsSync(robots)) {
        const text = readFileSync(robots, 'utf8').replace(/^Sitemap:\s*(\S+)[^\S\n]*\n?/gmi, (line, url) => {
          try { return ['/sitemap.xml', '/site/sitemap.xml'].includes(new URL(url).pathname) ? '' : line; }
          catch { return line; }
        });
        writeFileSync(robots, text);
      }
    }
  }
}
