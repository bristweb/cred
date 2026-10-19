# Changelog

All notable changes to CRED. Versions follow [semantic versioning](https://semver.org/); see [Versions](README.md#versions).

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
