# Changelog

All notable changes to CRED. Versions follow [semantic versioning](https://semver.org/); see [Versions](README.md#versions).

## 1.2.0 (2026-11-05)

- `include_examples` (top-level in `config.js`, default `true`): `false` leaves example content out of the cards, counts, averages, summary card, JSON-LD and rating badge, without deleting any file. Everything loaded from the bundled examples folder (`src/example-content/`, published at `/example/`) is example content by location, so the example data carries no per-item tags; the widget, validator and badge script infer it from the source. In your own content, items marked `example: true` (reviews, summary, accolades, credentials, testimonials) are examples too; the tag is optional and rarely needed.
- The bundled sample content is now called **examples** (business name "Example Bike Shop") instead of a branded name; the demo still shows it.
- `data-source` is optional. The widget picks its data in this order: `data-source` (or `?source=`) when the embed has one; otherwise `<site root>/content/` when it has a `config.js` (a fork's own content); otherwise the bundled examples at `<site root>/example/`. The site root is the folder that serves the script's `assets/`. Embed snippets, `index.html`, `embed.html` and the demo links no longer need the attribute; content hosted elsewhere still uses `data-source`.
- With no reviews to count, the header omits the rating block (it shows the "Write a review" button only).
- Repository reorganised around one rule: `src/` is upstream's code and a fork leaves it alone; everything client-specific goes in the top-level `content/` folder. `src/` holds `assets/` (the widget and its default icons/styles), `lang/` (default wording), `schemas/`, `types/`, `scripts/`, the demo pages and host files in `src/site/`, and the bundled examples in `src/example-content/` (a sample of what goes in `content/`). `content/` is empty upstream (only a README); a fork copies the sample into it and replaces it with its own `config.js`, `reviews/`, `theme/`, `lang/` and `assets/`, plus an optional `content/site/` with its own pages, `robots.txt`, `sitemap.xml` and `_headers`, which the build lays over `src/site/`. There is no `example/` folder at the repo top level; the published URL `/example/` is built from `src/example-content/`. `COMPARISON.md` moved to `docs/`. `npm run build` (`src/scripts/build.mjs`) assembles the published site (`src/example-content/` at `/example/`, `content/` at `/content/`), so existing public URLs are unchanged: embeds keep using `…/assets/js/cred.js`. `deploy.yml` and the new optional `pages.yml` (GitHub Pages) run the build; `/v/` builds handle tags from before and after the move. Validator and badge are run as `node src/scripts/validate.mjs <data-dir>` (also `npm run validate`, which checks the examples).
- One asset layout everywhere: a single `assets/` folder in the data folder (`content/` and `src/example-content/`), sorted by kind: `assets/icons/`, `assets/images/` (with `assets/images/reviewers/` for avatars), `assets/video/`, `assets/audio/`. It replaces the separate `icons/`, `images/`, `images/reviewers/` and `media/` folders. With no `icon` set, a platform's icon is looked up at `assets/icons/<platform>.svg` (was `icons/<platform>.svg`); update the paths in your `config.js` and `reviews/*.json` if you used the old folders. The widget's own default media icons moved from `src/assets/media/` to `src/assets/icons/`. The validator checks the new avatar folder.
- `src/example-content/` is now an exact mirror of what a client puts in `content/` (same folder names and nesting). Its host-only files (`index.html`, `_headers`, `.nojekyll`) moved to `src/example-content/site/`, which the build never publishes as `/example/site/` (its files are lifted to `/example/`, so the `/example/` page and URLs are unchanged). The sample workflows for a standalone data repo moved to `docs/data-repo-workflows/`.
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
