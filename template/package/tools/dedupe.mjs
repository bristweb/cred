// The widget's duplicate rule (package/assets/js/cred.js; keep the two in step), shared by validate.mjs and badge.mjs.
// One review posted on several platforms counts once: records with the same text (lowercased, punctuation and extra
// spaces dropped, 40+ characters; display.dedupe: false turns this off) or one naming the other in duplicate_of
// ("<platform>-<platform_review_id>"). dedupe(list) keeps one copy per review: one without duplicate_of, then one
// with a star rating, then the platform listed first in config.platforms, then the oldest.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const keyOf = r => `${r.platform}-${r.platform_review_id}`;
export const hid = (r, part) => r.hidden === true || Boolean(r.hidden && typeof r.hidden === 'object' && r.hidden[part] === true);
// The bundled examples folder (template/data/). Everything loaded from it is example content.
export const examplesDir = fileURLToPath(new URL('../../template/data', import.meta.url));
export const isExamplesDir = dir => path.resolve(dir) === examplesDir;
// include_examples: false leaves out example content: everything when the data folder is the bundled examples
// (inExamples), else only records marked example: true (package/assets/js/cred.js does the same).
export const exampleOut = (config, x, inExamples = false) => Boolean(x) && config?.include_examples === false && (inExamples || x.example === true);
const normText = t => String(t ?? '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

export function deduper(config, reviews) {
  const byKey = new Map(reviews.map(r => [keyOf(r), r]));
  const auto = config?.display?.dedupe !== false;
  const order = Object.keys(config?.platforms || {});
  const groups = new Map();
  const groupOf = (r, seen = new Set()) => {
    if (groups.has(r)) return groups.get(r);
    seen.add(r);
    const target = r.duplicate_of != null && byKey.get(String(r.duplicate_of));
    const n = auto ? normText(r.text) : '';
    const g = target && !seen.has(target) ? groupOf(target, seen) : n.length >= 40 ? 'text:' + n : 'key:' + keyOf(r);
    groups.set(r, g);
    return g;
  };
  const rank = r => [r.duplicate_of != null ? 1 : 0, typeof r.rating === 'number' ? 0 : 1, (order.indexOf(r.platform) + 1) || 999, r.date];
  const before = (a, b) => { const x = rank(a), y = rank(b); for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };
  return list => {
    const best = new Map();
    for (const r of list) { const g = groupOf(r), b = best.get(g); if (!b || before(r, b)) best.set(g, r); }
    return list.filter(r => best.get(groupOf(r)) === r);
  };
}
