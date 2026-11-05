#!/usr/bin/env node
// Assembles the publishable site from the repo layout. Public URLs stay what they have always been:
//   src/site/*              -> /            (index.html, embed.html, 404.html, _headers, robots.txt, sitemap.xml)
//   src/assets/, src/lang/  -> /assets/, /lang/   (the widget: /assets/js/cred.js)
//   src/schemas/, src/types/ -> /schemas/, /types/ (JSON Schemas and config typings for editors)
//   content/<name>/         -> /<name>/     (each content folder is published under its own name:
//                                            content/example/ -> /example/, content/data/ -> /data/)
// Usage: node src/scripts/build.mjs [dist]    (run from the repo root; serve dist/ with any static server)
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
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
const names = existsSync('content') ? readdirSync('content', { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name) : [];
for (const n of names) copy(path.join('content', n), path.join(dist, n));
console.log(`build: ${path.relative('.', dist) || '.'} (content: ${names.join(', ') || 'none'})`);
