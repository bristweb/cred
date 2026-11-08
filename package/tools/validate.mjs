#!/usr/bin/env node
/**
 * Validate a reviews data repo against the JSON Schemas in package/schemas/ (checked with Zod), plus filesystem checks
 * the schemas cannot express (icons exist, relative avatars resolve, years list matches files, newest-first, etc.).
 *
 *   node package/tools/validate.mjs <data-dir>   # e.g. template/data   # default: .
 *
 * Needs the development dependency zod (`npm ci` in the cred checkout; the reusable workflow does it).
 * The data is only checked, never changed.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deduper, exampleOut, hid, isExamplesDir, keyOf } from './dedupe.mjs';

const root = path.resolve(process.argv[2] || '.');
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

let z;
try { ({ z } = await import('zod')); }
catch (e) { console.error(`Cannot load zod. Run: npm ci   (in the cred checkout)\n${e.message}`); process.exit(2); }
// The JSON Schemas stay the source of truth (editors use them too); Zod turns them into validators.
const schemaDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'schemas');
const loadSchema = name => z.fromJSONSchema(JSON.parse(readFileSync(path.join(schemaDir, name), 'utf8')), { defaultTarget: 'draft-7' });
const configSchema = loadSchema('config.schema.json');
const reviewsSchema = loadSchema('reviews.schema.json');
// Zod's fromJSONSchema (4.6.7, marked semi-experimental) skips an anyOf next to "type": "object"; the schema's
// "one of these keys" rules for accolades and credentials are therefore checked below with the other config checks.
// One line per problem: "<file>: /path/to/field message". A union (e.g. rating: 1-5 or null) lists why each option failed.
const where = p => '/' + p.join('/');
const issueLines = (iss, base = []) => iss.flatMap(i => {
  const p = [...base, ...i.path];
  if (i.code === 'invalid_union' && i.errors?.length) {
    const why = [...new Set(i.errors.flatMap(e => e.map(x => (x.path.length ? where(x.path) + ' ' : '') + x.message)))];
    return [`${where(p)} ${why.join('; or ')}`];
  }
  return [`${where(p)} ${i.message}`];
});
const check = (schema, data, prefix) => {
  const r = schema.safeParse(data);
  if (!r.success) for (const line of issueLines(r.error.issues)) err(`${prefix}: ${line}`);
};

const readJson = f => {
  try { return JSON.parse(readFileSync(path.join(root, f), 'utf8')); }
  catch (e) { err(`${f}: ${e.code === 'ENOENT' ? 'missing' : 'invalid JSON (' + e.message + ')'}`); return null; }
};
const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const checkExcerpt = (at, r) => { if (r?.excerpt != null && !norm(r.text).includes(norm(r.excerpt))) err(`${at}: excerpt is not an exact passage of text`); };
const isIso = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(s) && !Number.isNaN(Date.parse(s));

// config.js: ES module, default export = the config object (loaded as a module whatever the repo's package.json says).
let config = null;
try { config = (await import('data:text/javascript,' + encodeURIComponent(readFileSync(path.join(root, 'config.js'), 'utf8')))).default; }
catch (e) { err(`config.js: ${e.code === 'ENOENT' ? 'missing' : 'cannot load (' + e.message + ')'}`); }
if (existsSync(path.join(root, 'config.json'))) warn('config.json is no longer read; config.js is the config (node package/tools/config-to-js.mjs converts it)');
if (config) {
  check(configSchema, config, 'config.js');
}
const platforms = (config && config.platforms) || {};
const relIcon = (where, icon) => {
  if (icon && !/^(https?:)?\/\//.test(icon) && !icon.startsWith('data:') && !existsSync(path.join(root, icon)))
    err(`config.js ${where}: ${icon} not found`);
};
for (const [k, p] of Object.entries(platforms)) relIcon(`platforms.${k}`, p.icon || `assets/icons/${k}.svg`);
for (const l of (config && config.links) || []) relIcon(`links.${l.platform}`, l.icon);
for (const k of ['accolades_icon', 'credentials_icon', 'testimonials_icon']) if (config?.display?.[k]) relIcon(`display.${k}`, String(config.display[k]));
(Array.isArray(config?.credentials) ? config.credentials : []).forEach((c, i) => {
  if (!c || typeof c !== 'object') return;
  if (!('label' in c || 'title' in c || 'icon' in c)) err(`config.js: /credentials/${i} needs one of label, title, icon`);
  if (c.icon) relIcon(`credentials[${i}]`, c.icon);
  if (c.start && c.end && String(c.end) < String(c.start)) err(`config.js credentials[${i}]: end ${c.end} is before start ${c.start}`);
});
(Array.isArray(config?.accolades) ? config.accolades : []).forEach((a, i) => {
  if (!a || typeof a !== 'object') return;
  if (!('icon' in a || 'name' in a || 'label' in a)) err(`config.js: /accolades/${i} needs one of icon, name, label`);
  if (a.icon) relIcon(`accolades[${i}]`, a.icon);
});
(Array.isArray(config?.testimonials) ? config.testimonials : []).forEach((t, i) => {
  if (!t || typeof t !== 'object') return;
  checkExcerpt(`config.js testimonials[${i}]`, t);
  (Array.isArray(t.media) ? t.media : []).forEach((m, j) => {
    for (const k of ['url', 'thumbnail', 'poster']) if (m?.[k] && !(m.type === 'link' && k === 'url')) relIcon(`testimonials[${i}].media[${j}].${k}`, String(m[k]));
  });
  if (t.reviewer_name != null) err(`config.js testimonials[${i}]: reviewer_name is obsolete; use title (and optional subtitle)`);
  if (t.source && typeof t.source === 'object' && t.source.logo) relIcon(`testimonials[${i}].source`, t.source.logo);
  if (t.reviewer_image) {
    const img = String(t.reviewer_image);
    if (!/^(https?:|data:|\/)/i.test(img) && !existsSync(path.join(root, img)))
      err(`config.js testimonials[${i}]: reviewer_image ${img} not found`);
  }
});
if (!existsSync(path.join(root, 'theme', 'theme.css'))) warn('theme/theme.css not found (the widget loads it)');

// Language files listed in config.languages: [{ lang, url }, …]. defaultLanguage is a fallback ISO tag.
if (config) {
  if (config.default_language != null) warn('config.js: default_language is obsolete; use defaultLanguage');
  if (config.languages && typeof config.languages === 'object' && !Array.isArray(config.languages)) {
    err('config.js: languages must be an array of { lang, url } (object map form is obsolete)');
  }
  const langs = Array.isArray(config.languages) ? config.languages : null;
  if (langs) {
    const norm = c => String(c || '').trim().replace(/_/g, '-').toLowerCase();
    const tags = [];
    langs.forEach((entry, i) => {
      if (!entry || typeof entry !== 'object') { err(`config.js: languages[${i}] must be an object`); return; }
      const code = entry.lang;
      const rel = entry.url;
      if (code == null || !String(code).trim()) err(`config.js: languages[${i}].lang is required`);
      else tags.push(norm(code));
      if (rel == null || !String(rel).trim()) { err(`config.js: languages[${i}].url must be a non-empty path or URL`); return; }
      const langRel = String(rel).trim();
      if (/^(https?:)?\/\//i.test(langRel) || langRel.startsWith('/')) return;
      if (!existsSync(path.join(root, langRel))) err(`config.js: languages[${i}].url file ${langRel} not found`);
      else {
        const pack = readJson(langRel);
        if (pack && typeof pack === 'object') {
          const sk = pack.strings && typeof pack.strings === 'object' ? Object.keys(pack.strings) : Object.keys(pack).filter(k => k !== 'rating_labels' && typeof pack[k] === 'string');
          if (!sk.length) warn(`${langRel}: no string entries`);
        }
      }
    });
    const def = config.defaultLanguage;
    if (def != null && String(def).trim()) {
      const want = norm(def);
      const wantPrimary = want.split('-')[0];
      const matchable = tags.some(t => t === want || t === wantPrimary || t.split('-')[0] === want || t.split('-')[0] === wantPrimary);
      if (tags.length && !matchable) warn(`config.js: defaultLanguage "${def}" does not match any languages[].lang (widget English will be used)`);
    } else if (tags.length) {
      warn('config.js: languages set but defaultLanguage missing');
    }
  }
  if (typeof config.strings === 'string') err('config.js: strings must be an object of inline overrides (use languages for translation files)');
}

const years = (config && config.reviews && config.reviews.years) || [];
if (Array.isArray(years) && years.some((y, i) => i && y >= years[i - 1])) err('config.js: reviews.years must be unique and sorted newest first');
const files = existsSync(path.join(root, 'reviews')) ? readdirSync(path.join(root, 'reviews')).filter(f => f.endsWith('.json')) : [];
for (const f of files) if (!years.includes(Number(f.replace(/\.json$/, '')))) err(`reviews/${f}: not listed in config.js reviews.years`);

const seen = new Map(), used = new Set(), counts = {}, hideKeys = new Set(), records = [];
let total = 0, hidden = 0, partly = 0;
for (const y of years) {
  const f = `reviews/${y}.json`;
  const list = readJson(f);
  if (!list) continue;
  check(reviewsSchema, list, f);
  if (!Array.isArray(list)) continue;
  list.forEach((r, i) => {
    const at = `${f}[${i}]`;
    checkExcerpt(at, r);
    if (r.platform && !platforms[r.platform]) err(`${at}: platform "${r.platform}" is not in config.js platforms`);
    if (r.date && isIso(r.date) && r.date.slice(0, 4) !== String(y)) err(`${at}: dated ${r.date.slice(0, 10)} but stored in ${f}`);
    if (i && r.date > list[i - 1].date) err(`${at}: not newest first`);
    const key = `${r.platform}:${r.platform_review_id}`;
    if (seen.has(key)) err(`${at}: duplicate review ${key} (also ${seen.get(key)})`);
    seen.set(key, at);
    if (r.reviewer_image) {
      const img = String(r.reviewer_image);
      // Absolute / data URLs are fine as-is. Relative paths should exist under the data root.
      if (!/^(https?:|data:|\/)/i.test(img)) {
        if (!existsSync(path.join(root, img))) err(`${at}: reviewer_image ${img} not found`);
        else used.add(img);
      }
    }
    hideKeys.add(`${r.platform}-${r.platform_review_id}`);
    if (r.hidden === true) hidden++;
    else if (r.hidden && typeof r.hidden === 'object') partly++;
    records.push({ r, at });
    counts[r.platform] = (counts[r.platform] || 0) + 1;
    total++;
  });
}
(Array.isArray(config?.testimonials) ? config.testimonials : []).forEach(t => {
  if (!t?.reviewer_image) return;
  const img = String(t.reviewer_image);
  if (!/^(https?:|data:|\/)/i.test(img)) used.add(img);
});
// display.hide keys are <platform>-<platform_review_id>; a key that matches no review is probably a typo.
const hideList = Array.isArray(config?.display?.hide) ? config.display.hide : [];
for (const k of hideList) if (!hideKeys.has(String(k))) warn(`config.js display.hide: "${k}" matches no review (expected <platform>-<platform_review_id>)`);
// duplicate_of names another record (<platform>-<platform_review_id>); chains must end at a record without one.
const byKey = new Map(records.map(x => [keyOf(x.r), x.r]));
for (const { r, at } of records) {
  if (r.duplicate_of == null) continue;
  const k = String(r.duplicate_of);
  if (k === keyOf(r)) { err(`${at}: duplicate_of names the review itself`); continue; }
  if (!byKey.has(k)) { err(`${at}: duplicate_of "${k}" matches no review (expected <platform>-<platform_review_id>)`); continue; }
  for (let t = byKey.get(k), n = 0; t && t.duplicate_of != null; t = byKey.get(String(t.duplicate_of)))
    if (t === r || ++n > records.length) { err(`${at}: duplicate_of loops back to this review`); break; }
}
const live = records.map(x => x.r).filter(r => !exampleOut(config, r, isExamplesDir(root)));
const kept = live.filter(r => !hid(r, 'rating') && !hideList.includes(keyOf(r)));
const merged = kept.length - deduper(config, live)(kept).length;
const exampleItems = [...records.map(x => x.r), config?.summary, ...['accolades', 'credentials', 'testimonials'].flatMap(k => (Array.isArray(config?.[k]) ? config[k] : []))].filter(x => x && (isExamplesDir(root) || x.example === true)).length;
const imgDir = path.join(root, 'assets', 'images', 'reviewers');
if (existsSync(imgDir)) for (const f of readdirSync(imgDir)) if (!used.has(`assets/images/reviewers/${f}`)) warn(`assets/images/reviewers/${f}: not referenced by any review or testimonial (ok if unused)`);

for (const w of warnings) console.warn('warning:', w);
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s)`); process.exit(1); }
const nAcc = Array.isArray(config?.accolades) ? config.accolades.length : 0;
const nCred = Array.isArray(config?.credentials) ? config.credentials.length : 0;
const nTes = Array.isArray(config?.testimonials) ? config.testimonials.length : 0;
console.log(`ok: ${total} reviews (${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}) in ${years.length} year file(s)` +
  (hidden || partly || hideList.length ? `; hidden: ${hidden} record(s) marked hidden${partly ? `, ${partly} partly hidden` : ''}, ${hideList.length} display.hide key(s)` : '') +
  (merged ? `; ${merged} duplicate(s) counted once` : '') +
  (exampleItems ? `; ${exampleItems} example item(s) ${config?.include_examples === false ? 'left out (include_examples: false)' : 'shown (include_examples is on)'}` : '') +
  (config?.display?.min_rating ? `; min_rating ${config.display.min_rating}` : '') +
  (nAcc ? `; ${nAcc} accolade(s)` : '') +
  (nCred ? `; ${nCred} credential(s)` : '') +
  (nTes ? `; ${nTes} testimonial(s)` : '') +
  (config?.summary ? `; summary generated ${config.summary.generated_at}` : ''));
