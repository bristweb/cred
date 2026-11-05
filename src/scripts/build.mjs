#!/usr/bin/env node
// Assembles the publishable site from the repo layout. Public URLs stay what they have always been:
//   src/site/*              -> /            (index.html, embed.html, 404.html, _headers, robots.txt, sitemap.xml)
//   src/assets/, src/lang/  -> /assets/, /lang/   (the widget: /assets/js/cred.js)
//   src/schemas/, src/types/ -> /schemas/, /types/ (JSON Schemas and config typings for editors)
//   src/example-content/            -> /example/    (the bundled examples)
//   content/                -> /content/    (a fork's own content; empty upstream, so only its README is published)
//   content/site/*          -> /            (optional: a fork's own pages, robots.txt, sitemap.xml, _headers, CNAME; laid over
//                                            src/site/ and not published under /content/)
// Usage: node src/scripts/build.mjs [dist]    (run from the repo root; serve dist/ with any static server)
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] || 'dist');
const copy = (from, to) => cpSync(from, to, { recursive: true });
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
copy('src/site', dist);
copy('src/assets', path.join(dist, 'assets'));
copy('src/lang', path.join(dist, 'lang'));
copy('src/schemas', path.join(dist, 'schemas'));
copy('src/types', path.join(dist, 'types'));
copy('src/example-content', path.join(dist, 'example'));
mkdirSync(path.join(dist, 'content'), { recursive: true });
if (existsSync('content')) cpSync('content', path.join(dist, 'content'), { recursive: true, filter: p => path.relative('content', p).split(path.sep)[0] !== 'site' });
if (existsSync('content/site')) copy('content/site', dist);
console.log(`build: ${path.relative('.', dist) || '.'} (examples: example/; content: ${existsSync('content/config.js') ? 'content/' : 'empty'}${existsSync('content/site') ? '; content/site overlaid on the root' : ''})`);
