// Fetch a published release tag from the fixed upstream; copy ONLY package/ into a clean checkout.
// No archives are extracted: regular Git blobs are inspected before any writes, so symlinks/traversal cannot escape.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const UPSTREAM = 'https://github.com/bristweb/cred.git';
export const releaseTag = value => {
  if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(value || '')) throw new Error('Choose an existing published Cred tag in vX.Y.Z form, not a branch, URL or arbitrary ref.');
  return value;
};
export function packagePath(value, mode = '100644') {
  if (!['100644', '100755'].includes(mode) || !/^package\/[A-Za-z0-9_.\/-]+$/.test(value) ||
      value.split('/').some(p => !p || p === '.' || p === '..' || p.toLowerCase() === '.git')) throw new Error(`Unsupported/unsafe release file: ${value}`);
  return value;
}
const sorted = x => x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(k => [k, sorted(x[k])])) : x;
export function compatibleManifest(current, incoming) {
  for (const key of ['type', 'dependencies', 'devDependencies']) {
    if (JSON.stringify(sorted(current[key] || null)) !== JSON.stringify(sorted(incoming[key] || null))) {
      throw new Error(`This release needs a root ${key} migration, not a package-only update. Keep this repo unchanged and use the release migration instructions.`);
    }
  }
}
export function replacePackage(dir, entries, current, incoming, expectedVersion) {
  compatibleManifest(current, incoming);
  const files = new Map(entries.map(e => [packagePath(e.file, e.mode), e]));
  if (files.size !== entries.length) throw new Error('Duplicate release paths.');
  for (const file of ['package/assets/js/cred.js', 'package/tools/validate.mjs', 'package/tools/export-site.sh', 'package/tools/widget-version.mjs', 'package/tools/update-package.mjs', 'package/tools/build-starter.sh']) {
    if (!files.has(file)) throw new Error(`Unsupported old release layout: missing ${file}. Only releases with the starter layout (v1.3.0 or later) can be used.`);
  }
  const version = files.get('package/assets/js/cred.js').bytes.toString('utf8').match(/\bconst VERSION = '(\d+\.\d+\.\d+)';/)?.[1];
  if (!version) throw new Error('Release widget has no recognizable semantic version.');
  if (expectedVersion && version !== expectedVersion) throw new Error(`Release tag disagrees with widget version ${version}; no files changed.`);
  // All paths, file modes and compatibility checks precede the only destructive operation, scoped to package/.
  rmSync(path.join(dir, 'package'), { recursive: true, force: true });
  for (const [file, entry] of files) {
    const to = path.join(dir, file);
    mkdirSync(path.dirname(to), {recursive:true}); writeFileSync(to, entry.bytes); chmodSync(to, entry.mode === '100755' ? 0o755 : 0o644);
  }
  return version;
}
export function update(dir, tag) {
  releaseTag(tag);
  const git = args => execFileSync('git', args, {cwd:dir, encoding:'utf8', maxBuffer:32 * 1024 * 1024});
  if (git(['status', '--porcelain']).trim()) throw new Error('Use a clean checkout; update will not touch existing work.');
  // This is a tag on bristweb/cred, not arbitrary repository code from a form.
  if (!git(['ls-remote', '--tags', UPSTREAM, `refs/tags/${tag}`]).trim()) throw new Error(`No published Cred tag ${tag}. See https://github.com/bristweb/cred/tags`);
  git(['fetch', '--no-tags', '--depth=1', UPSTREAM, `refs/tags/${tag}`]);
  const sha = git(['rev-parse', 'FETCH_HEAD^{commit}']).trim();
  const manifest = JSON.parse(git(['show', `${sha}:package.json`]));
  const current = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
  // Check layout before the root manifest to explain why legacy v1.0/v1.1 tags are unsupported.
  const records = git(['ls-tree', '-rz', '--full-tree', sha, '--', 'package/']).split('\0').filter(Boolean);
  if (!records.length) throw new Error('This tag predates package/. It is not a compatible template update. No files changed.');
  if (!git(['ls-tree', '--name-only', sha, '--', 'template/data/config.js']).trim()) throw new Error('This tag predates the starter layout (v1.3.0). No files changed.');
  const entries = records.map(line => {
    const separator = line.indexOf('\t');
    const head = line.slice(0, separator), file = line.slice(separator + 1);
    const [mode, kind, blob] = head.split(' ');
    packagePath(file, mode);
    if (kind !== 'blob' || !/^[a-f0-9]{40}$/.test(blob)) throw new Error(`Unsupported Git entry: ${file}`);
    return { file, mode, bytes: execFileSync('git', ['cat-file', 'blob', blob], {cwd:dir, maxBuffer:32*1024*1024}) };
  });
  const version = replacePackage(dir, entries, current, manifest, tag.slice(1));
  return {sha, version};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { const result = update(process.cwd(), process.env.CRED_RELEASE); console.log(`Prepared package/ from ${process.env.CRED_RELEASE} (${result.sha})`); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
