// Regression tests for the data validator: node --test "package/tools/test/*.test.mjs"  (npm test runs them)
// Valid: the bundled examples (and any folders in CRED_TEST_DATA, separated by ':'). Invalid: small edits of them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { z } from 'zod';

const tools = path.resolve(import.meta.dirname, '..');
const examples = path.resolve(tools, '../../template/data');
const schema = name => z.fromJSONSchema(JSON.parse(readFileSync(path.resolve(tools, '../schemas', name), 'utf8')), { defaultTarget: 'draft-7' });
const configSchema = schema('config.schema.json'), reviewsSchema = schema('reviews.schema.json');
const folders = [examples, ...(process.env.CRED_TEST_DATA || '').split(':').filter(Boolean)];
const validate = dir => spawnSync(process.execPath, [path.join(tools, 'validate.mjs'), dir], { encoding: 'utf8' });
const loadConfig = async dir => (await import('data:text/javascript,' + encodeURIComponent(readFileSync(path.join(dir, 'config.js'), 'utf8')))).default;
const review = () => structuredClone(JSON.parse(readFileSync(path.join(examples, 'reviews/2025.json'), 'utf8'))[0]);

for (const dir of folders) test(`valid: ${path.relative(process.cwd(), dir) || dir}`, () => {
  const r = validate(dir);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^ok: \d+ reviews/);
});

const bad = {
  'missing text': r => { delete r.text; },
  'missing reviewer_image': r => { delete r.reviewer_image; },
  'empty platform': r => { r.platform = ''; },
  'rating 0': r => { r.rating = 0; },
  'rating 6': r => { r.rating = 6; },
  'rating 4.5': r => { r.rating = 4.5; },
  'rating "5"': r => { r.rating = '5'; },
  'date without time': r => { r.date = '2025-01-01'; },
  'owner_reply without text': r => { r.owner_reply = { date: null }; },
  'owner_reply bad date': r => { r.owner_reply = { text: 'Thanks', date: 'yesterday' }; },
  'hidden unknown key': r => { r.hidden = { cards: true }; },
  'hidden string': r => { r.hidden = 'yes'; },
  'duplicate_of not a key': r => { r.duplicate_of = 'nodash'; },
};
const good = {
  'rating 1': r => { r.rating = 1; },
  'rating 5': r => { r.rating = 5; },
  'rating null': r => { r.rating = null; },
  'reviewer_name null': r => { r.reviewer_name = null; },
  'owner_reply null': r => { r.owner_reply = null; },
  'owner_reply date null': r => { r.owner_reply = { text: 'Thanks', date: null }; },
  'hidden partial': r => { r.hidden = { rating: true }; },
  'date with offset': r => { r.date = '2025-01-01T10:00-05:00'; },
  'unknown field kept': r => { r.imported_from = 'sheet'; },
};
for (const [name, edit] of Object.entries(bad)) test(`review rejected: ${name}`, () => {
  const r = review(); edit(r);
  assert.equal(reviewsSchema.safeParse([r]).success, false);
});
for (const [name, edit] of Object.entries(good)) test(`review accepted: ${name}`, () => {
  const r = review(); edit(r);
  const res = reviewsSchema.safeParse([r]);
  assert.equal(res.success, true, JSON.stringify(res.error?.issues));
});
test('review list must not be empty', () => assert.equal(reviewsSchema.safeParse([]).success, false));

test('config rules', async () => {
  const base = await loadConfig(examples);
  const ok = edit => { const c = structuredClone(base); edit(c); return configSchema.safeParse(c).success; };
  assert.equal(ok(() => {}), true);
  assert.equal(ok(c => { c.unknown_top_level = 1; }), true, 'unknown keys allowed');
  assert.equal(ok(c => { delete c.business.name; }), false);
  assert.equal(ok(c => { c.platforms = {}; }), false, 'platforms needs one entry');
  assert.equal(ok(c => { delete Object.values(c.platforms)[0].name; }), false);
  assert.equal(ok(c => { Object.values(c.platforms)[0].card_link = 'link'; }), false);
  assert.equal(ok(c => { c.reviews.years = [1900]; }), false);
  assert.equal(ok(c => { c.reviews.years = ['2025']; }), false, 'years are integers');
  assert.equal(ok(c => { c.display = { ...c.display, min_rating: 6 }; }), false);
  assert.equal(ok(c => { c.display = { ...c.display, theme: 'blue' }; }), false);
  assert.equal(ok(c => { c.display = { ...c.display, hide: ['google-1', 'google-1'] }; }), false, 'hide keys unique');
  assert.equal(ok(c => { c.version = 'v1'; }), false);
  assert.equal(ok(c => { c.version = '^1.2.0'; }), true);
  assert.equal(ok(c => { c.accolades = [{ year: 2024, label: 'Best of' }]; }), true);
  assert.equal(ok(c => { c.testimonials[0].media = [{ type: 'gif', url: 'x' }]; }), false);
  assert.equal(ok(c => { c.testimonials[0].media = [{ type: 'image' }]; }), false);
  assert.equal(ok(c => { delete c.testimonials[0].title; }), false);
  assert.equal(ok(c => { c.testimonials[0].rating = 6; }), false);
  assert.equal(ok(c => { c.strings = { loading: 1 }; }), false);
});

test('validation never changes the data', async () => {
  const c = await loadConfig(examples), before = JSON.stringify(c);
  configSchema.safeParse(c);
  assert.equal(JSON.stringify(c), before);
});

const copy = () => { const dir = path.join(mkdtempSync(path.join(tmpdir(), 'cred-')), 'data'); cpSync(examples, dir, { recursive: true }); return dir; };

test('validate.mjs: accolades and credentials need one of their name keys', async () => {
  const dir = copy(), f = path.join(dir, 'config.js');
  writeFileSync(f, readFileSync(f, 'utf8').replace('  accolades: [', '  accolades: [{ year: 2024 },').replace('  credentials: [', '  credentials: [{ start: "2020" },'));
  const r = validate(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /accolades\/0 needs one of icon, name, label/);
  assert.match(r.stderr, /credentials\/0 needs one of label, title, icon/);
});

test('validate.mjs reports file, record and field', () => {
  const dir = copy();
  const f = path.join(dir, 'reviews/2025.json'), list = JSON.parse(readFileSync(f, 'utf8'));
  list[1].rating = 7;
  writeFileSync(f, JSON.stringify(list));
  const r = validate(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /reviews\/2025\.json: \/1\/rating .*5/);
});
