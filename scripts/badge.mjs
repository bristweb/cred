#!/usr/bin/env node
/**
 * Write rating badge files into a reviews data repo, from the same reviews the widget shows
 * (skips "hidden": true records, display.hide keys and rated reviews below display.min_rating).
 *
 *   node reviews-widget/scripts/badge.mjs <data-repo-dir>   # default: .
 *
 * badge.json  shields.io endpoint: https://img.shields.io/endpoint?url=<data-source>badge.json
 * badge.svg   the same badge as a static image
 * Optional config.badge: { "label": "…" } (default "rating").
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = f => JSON.parse(readFileSync(path.join(root, f), 'utf8'));
const config = read('config.json');
const D = config.display || {};
const hide = new Set((Array.isArray(D.hide) ? D.hide : []).map(String));
const min = Number(D.min_rating) || 0;
const reviews = (config.reviews?.years || []).flatMap(y => read(`reviews/${y}.json`))
  .filter(r => r.hidden !== true && !hide.has(`${r.platform}-${r.platform_review_id}`) && !(min > 0 && typeof r.rating === 'number' && r.rating < min));
const rated = reviews.filter(r => typeof r.rating === 'number');
const avg = rated.length ? rated.reduce((s, r) => s + r.rating, 0) / rated.length : 0;
const label = config.badge?.label || 'rating';
const message = rated.length ? `${avg.toFixed(1)}/5 (${reviews.length} review${reviews.length === 1 ? '' : 's'})` : 'no ratings';
const color = !rated.length ? 'lightgrey' : avg >= 4.5 ? 'brightgreen' : avg >= 4 ? 'green' : avg >= 3.5 ? 'yellowgreen' : avg >= 3 ? 'yellow' : 'orange';
const json = { schemaVersion: 1, label, message, color };
writeFileSync(path.join(root, 'badge.json'), JSON.stringify(json, null, 2) + '\n');

// Static flat badge (Verdana 11px; widths estimated per character).
const HEX = { brightgreen: '#4c1', green: '#97ca00', yellowgreen: '#a4a61d', yellow: '#dfb317', orange: '#fe7d37', lightgrey: '#9f9f9f' };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const w = s => Math.round([...s].reduce((n, c) => n + (/[il.,:;|!'() ]/.test(c) ? 3.8 : /[mwMW]/.test(c) ? 9.5 : /[A-Z0-9]/.test(c) ? 7.5 : 6.5), 0)) + 10;
const lw = w(label), mw = w(message), W = lw + mw;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="20" role="img" aria-label="${esc(label)}: ${esc(message)}"><title>${esc(label)}: ${esc(message)}</title>` +
  `<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>` +
  `<clipPath id="r"><rect width="${W}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${lw}" height="20" fill="#555"/>` +
  `<rect x="${lw}" width="${mw}" height="20" fill="${HEX[color]}"/><rect width="${W}" height="20" fill="url(#s)"/></g>` +
  `<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">` +
  `<text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">${esc(label)}</text><text x="${lw / 2}" y="14">${esc(label)}</text>` +
  `<text x="${lw + mw / 2}" y="15" fill="#010101" fill-opacity=".3">${esc(message)}</text><text x="${lw + mw / 2}" y="14">${esc(message)}</text></g></svg>\n`;
writeFileSync(path.join(root, 'badge.svg'), svg);
console.log(`badge: ${label} ${message} (${color})`);
