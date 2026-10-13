// Converts a data repo's config.json to config.js (same values, with comments and editor type hints).
// Usage: node scripts/config-to-js.mjs <data-dir>   then delete config.json.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const dir = process.argv[2] || '.';
const cfg = JSON.parse(readFileSync(path.join(dir, 'config.json'), 'utf8'));
const NOTES = {
  version: 'Widget version (semver). "latest" follows every release; pin a caret range such as "^1.0.0" in production\n// so breaking changes (a new major version) never reach your site.',
  business: 'The business shown in the header and in the schema.org JSON-LD.',
  default_write_platform: 'Platform the "Write a review" button opens on the All tab.',
  platforms: 'Review platforms, keyed by the `platform` value used in reviews/<year>.json.',
  display: 'Presentation defaults; data-* attributes and URL parameters override these.',
  languages: 'Optional UI translations: [{ lang, url }]; url is relative to this folder.',
  defaultLanguage: 'Language used when the page and browser match none of `languages`.',
  strings: 'Inline UI wording overrides (keys as in the widget\'s lang/en.json).',
  rating_labels: 'Words shown next to the average rating, highest threshold first.',
  schema: 'schema.org JSON-LD settings.',
  summary: 'Summary card. Update generated_at whenever the text is rewritten.',
  accolades: 'Awards, shown on the All track by year and on the Awards filter.',
  credentials: 'Licenses and certifications, shown from their start date.',
  testimonials: 'Testimonials (not tied to a review platform).',
  avatars: 'Colors for generated initials avatars.',
  links: 'Extra links used by tooling.',
  sources: 'Where the stored reviews come from (tooling notes).',
  badge: 'Rating badge (badge.json / badge.svg) settings.',
  reviews: 'Yearly review files reviews/<year>.json, newest first. `years` is kept up to date by the import script.',
};
const order = ['version', ...Object.keys(cfg).filter(k => k !== 'version')];
const ident = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
const body = order.filter(k => k in cfg).map(k => {
  const val = JSON.stringify(cfg[k], null, 2).replace(/\n/g, '\n  ').replace(/^(\s+)"([A-Za-z_$][\w$]*)":/gm, '$1$2:');
  const note = NOTES[k] ? `  // ${NOTES[k].replace(/\n\/\/ /g, '\n  // ')}\n` : '';
  return `${note}  ${ident(k)}: ${k === 'reviews' && Object.keys(cfg.reviews).join() === 'years' ? `{ years: [${cfg.reviews.years.join(', ')}] }` : val},`;
}).join('\n\n');
const out = `// @ts-check
// CRED widget config for this data repo (https://github.com/bristweb/cred). Plain JavaScript, so comments are fine.
// The type hint below gives editor autocomplete and checks; cred-config.d.ts is generated from the widget's schema.

/** @type {import('./cred-config').CredConfig} */
export default {
${body}
};
`;
writeFileSync(path.join(dir, 'config.js'), out);
console.log('wrote', path.join(dir, 'config.js'));
