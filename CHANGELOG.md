# Changelog

All notable changes to CRED. Versions follow [semantic versioning](https://semver.org/); see [Versions](README.md#versions).

## Unreleased

- Indexing: exports with local `data/config.js` mark the bundled setup/demo pages noindex and remove their sitemap entries. Example-only repos keep them indexable. Client content, embedded websites and explicit indexing preferences are untouched.

- Tools: `validate.mjs` checks the JSON Schemas with Zod (`z.fromJSONSchema` + `safeParse`) instead of Ajv; Zod is a development dependency only. Schemas, typings, the widget and the data format are unchanged.
- Tests: `npm test` runs validator regression tests (`node --test`) before the smoke test; the smoke test accepts a fork's own `data/config.js`.

## 1.2.0 (2026-11-05)

- `include_examples` (top-level in `config.js`, default `true`): `false` leaves example content out of the cards, counts, averages, summary card, JSON-LD and rating badge, without deleting any file. Everything loaded from the bundled examples folder (`package/example-data/`) is example content by location, so the example data carries no per-item tags; the widget, validator and badge script infer it from the source. In your own content, items marked `example: true` (reviews, summary, accolades, credentials, testimonials) are examples too; the tag is optional and rarely needed.
- The bundled sample content is now called **examples** (business name "Example Bike Shop") instead of a branded name; the demo still shows it.
- `data-source` is optional. The widget picks its data in this order: `data-source` (or `?source=`) when the embed has one; otherwise `<site root>/data/` when it has a `config.js` (a fork's own data); otherwise the bundled examples at `<site root>/package/example-data/`. The site root is worked out from the script URL (`…/package/assets/js/cred.js`, `…/v/<x.y.z>/assets/js/cred.js` or the short `…/assets/js/cred.js`), so it also works under a GitHub Pages project path.
- With no reviews to count, the header omits the rating block (it shows the "Write a review" button only).
- Repository reorganised; nothing is compiled and there is no build step or `dist/` any more: the repo is served as it is. `package/` is the product a fork leaves alone (`assets/` widget, CSS and default icons; `lang/` built-in English wording; `schemas/`, `types/`; `tools/`, formerly `scripts/`; `example-data/`, the bundled examples). The top-level `data/` folder is the client's data (`config.js`, `reviews/`, `theme/`, `lang/`, `assets/`), empty upstream. Cred's own pages are in the top-level `site/` (`index.html`, `embed.html`, `example.html`, `robots.txt`, `sitemap.xml`). Root host files: `_headers`, `_redirects`, `.nojekyll`, `404.html`.
- Public URLs: files are served at their real paths on every host (`/package/assets/js/cred.js`, `/site/`, `/data/`, `/package/example-data/`). On Cloudflare Pages, `_redirects` keeps the existing short URLs as rewrites: `/assets/js/cred.js`, `/lang/`, `/schemas/`, `/types/`, `/`, `/embed.html`, `/example/` (page) and `/example/<file>` (example data); `/content/…` redirects to `/data/…`. GitHub Pages has no rewrites and uses the real paths.
- `npm run build` and `build.mjs` are gone. Deploys run `package/tools/export-site.sh`: a `git archive` of the served paths (no `.git`, `node_modules` or untracked files) plus the generated `/v/<x.y.z>/` release copies and `versions.json` from `build-versions.mjs`, which reads each tag's widget from `package/`, `src/` or the root. `npm test` runs a static HTTP smoke test (`package/tools/smoke-test.mjs`).
- One asset layout everywhere: a single `assets/` folder in the data folder (`data/` and `package/example-data/`), sorted by kind: `assets/icons/`, `assets/images/` (with `assets/images/reviewers/` for avatars), `assets/video/`, `assets/audio/`. `package/example-data/` is an exact mirror of `data/` (no `site/` folder, no per-record `example: true`).
- README: new Fork and replace guide (fork, own data folder, hide examples, what is code and what is content, pull from upstream); a separate data repo is now the alternative.

## 1.1.0 (2026-10-19)

- `hidden` on a review can be an object that hides only some parts: `{ "display": true }` (no card), `{ "rating": true }` (left out of the average and counts), `{ "schema": true }` (left out of the JSON-LD). `true` still hides everything.
- A review posted on several platforms (same text) shows as one card with an "Also on …" line and counts once in the overall rating, counts, badge and JSON-LD; each platform filter shows its own copy. `display.dedupe: false` turns the text match off; `duplicate_of: "<platform>-<platform_review_id>"` merges near-identical copies.
- The validator checks `duplicate_of` and reports how many duplicates count once.

## 1.0.5 (2026-10-13)

- Credit link tooltip names no platforms.

## 1.0.4 (2026-10-13)

- Shorter credit link tooltip.

## 1.0.3 (2026-10-13)

- Credit link tooltip now explains, in plain words, where the reviews come from.

## 1.0.2 (2026-10-13)

- Data repo config is now `config.js`, an ES module (`export default { … }`) with comments and editor type hints (`cred-config.d.ts`, generated from the schema). `config.json` is no longer read; `scripts/config-to-js.mjs` converts one.
- `version` is documented in full semantic-version form (`"^1.0.0"`, `"~1.0.0"`, `"1.0.2"`, `"latest"`).

## 1.0.1 (2026-10-13)

Version ranges resolve against `/versions.json`; releases are published only as immutable `/v/<x.y.z>/` copies.

## 1.0.0 (2026-10-13)

First versioned release: reviews from multiple platforms, testimonials (with media), awards and credentials in one carousel or grid; filters; summary card; schema.org JSON-LD; light/dark/auto themes; constrained (fixed-height) mode; i18n; rating badges; optional credit link; `config.json` `version` pinning.
