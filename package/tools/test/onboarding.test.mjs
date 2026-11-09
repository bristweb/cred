// Customer onboarding should stay simple, while the complete reference stays accessible.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../..');
// These documentation checks belong to the project, not a generated client repository.
const project = existsSync(path.join(root, 'template/README.md'));
const read = f => readFileSync(path.join(root, f), 'utf8');
const create = 'https://github.com/bristweb/cred-starter/generate';
function anchors(text) {
  let fenced = false;
  return text.split('\n').flatMap(line => {
    if (line.startsWith('```')) { fenced = !fenced; return []; }
    if (fenced || !/^#{1,6} /.test(line)) return [];
    return [line.replace(/^#+ /, '').toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/ /g, '-')];
  });
}

test('quick start shows the demo, template button and editing before optional details', { skip: !project }, () => {
  const text = read('README.md');
  assert.ok(text.split('\n').length < 100, 'the front page is a quick start, not the entire reference');
  assert.ok(text.indexOf('## See it in action') < text.indexOf('## Make your own'));
  assert.match(text, /<picture>[\s\S]*docs\/example-widget-light-v6.png/);
  assert.ok(text.includes(create));
  assert.match(text, /Make your changes in GitHub/);
  assert.match(text, /data\/config\.js/);
  assert.match(text, /docs\/REFERENCE\.md/);
  assert.doesNotMatch(text, /git merge|git rebase|\bfork(?:ing)?\b|Publish starter|build-starter\.sh/i);
});

test('demo pages point directly to the starter creation form without changing widget data paths', { skip: !project }, () => {
  for (const f of ['site/index.html', 'site/example.html']) {
    const text = read(f);
    assert.ok(text.includes(`class="template-button" href="${create}"`));
    assert.match(text, /Edit the example data in GitHub/);
    assert.doesNotMatch(text, /\bfork(?:ing)?\b|How to embed/i);
    assert.ok(text.includes('../package/assets/js/cred.js'));
    assert.ok(text.includes('../site/page-theme.js'));
  }
  assert.match(read('site/example.html'), /data-source="\.\.\/template\/data\/"/);
});

test('full reference and active local documentation links survive the move', { skip: !project }, () => {
  const ref = read('docs/REFERENCE.md');
  for (const title of ['## Embed', '## Options', '## Data format', '## JSON Schema and validation',
    '## Structured data (JSON-LD)', '## Get Cred updates', '## Versions', '## Repository layout'])
    assert.ok(ref.includes(title), `preserved ${title}`);
  for (const file of ['README.md', 'docs/REFERENCE.md', 'docs/data-repo-workflows/README.md',
    'template/README.md', 'template/data/README.md', 'site/index.html', 'site/example.html']) {
    const text = read(file);
    assert.doesNotMatch(text, /\bfork(?:ing)?\b|merge upstream|rebase/i, `no stale onboarding in ${file}`);
    for (const m of text.matchAll(/(?:\]\(|href=")([^\s)"<>]+)(?:\)|")/g)) {
      let link = m[1];
      if (link.startsWith('https://github.com/bristweb/cred/blob/main/')) link = '/' + link.split('/blob/main/')[1];
      else if (link.startsWith('https://github.com/bristweb/cred#')) link = '/README.md#' + link.split('#')[1];
      else if (/^[a-z]+:/i.test(link)) continue;
      const [target, hash] = link.split('#');
      if (!target?.endsWith('.md') && target !== '') continue;
      // A template's LICENSE link is resolved in the generated repository; all markdown destinations are shared.
      const dest = !target ? path.join(root, file) : target.startsWith('/') ? path.join(root, target) : path.resolve(root, path.dirname(file), target);
      assert.ok(existsSync(dest), `${file} → ${link}`);
      if (hash) assert.ok(anchors(readFileSync(dest, 'utf8')).includes(hash), `${file} → ${link} heading exists`);
    }
  }
});
