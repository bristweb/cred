# CRED

The open-source (MIT) widget for reviews, testimonials, awards and credentials. Unlimited sources and reviews, no tracking or third-party scripts, schema.org JSON-LD built in, and your data stays in your own repo. Unencumbered: fork it, host it on your own origin, change anything.

The demo below runs on **examples**: invented sample content (a fictional bike shop, not a real business) that ships with the repo, is tagged `example: true`, and can be switched off with one setting. See [Fork and replace](#fork-and-replace).

## <a href="https://cred.bristleconeweb.com/?theme=light" target="_blank" rel="noopener">▶ Live demo (light mode)</a> · <a href="https://cred.bristleconeweb.com/?theme=dark" target="_blank" rel="noopener">▶ Live demo (dark mode)</a>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/example-widget-dark-v6.png" />
  <source media="(prefers-color-scheme: light)" srcset="docs/example-widget-light-v6.png" />
  <img src="docs/example-widget-light-v6.png" alt="Live demo showing the bundled example data (a fictional bike shop)" />
</picture>


<a href="https://cred.bristleconeweb.com/embed.html" target="_blank" rel="noopener">iframe version</a> · <a href="https://cred.bristleconeweb.com/embed.html?constrained=true" target="_blank" rel="noopener">constrained / fixed-height box</a>

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js" defer></script>
```

Paste to try it: with no `data-source` the widget shows the example data from the same site. For a real site, load the script from your own fork and let it read your `data/` folder, or set `data-source` if your content lives elsewhere ([Data source](#data-source)). More patterns: [Embed](#embed).

A static, dependency-free reviews widget. Host the files on any static host (Cloudflare Pages recommended; GitHub Pages works as a backup with no setup). You are not limited to a vendor's supported integrations. Gather reviews whenever, wherever, and however you like (automation or by hand). Counts, averages, card order and JSON-LD are computed in the browser.

Product comparison: [COMPARISON.md](COMPARISON.md).

## Contents

1. [Fork and replace](#fork-and-replace) (recommended setup)
2. [Embed](#embed)
3. [Options](#options)
4. [Data format](#data-format)
5. [JSON Schema and validation](#json-schema-and-validation)
6. [Updating data](#updating-data)
7. [Structured data (JSON-LD)](#structured-data-json-ld)
8. [Header behavior](#header-behavior)
9. [Versions](#versions)
10. [Privacy and presentation](#privacy-and-presentation)
11. [Alternative: a separate data repo](#alternative-a-separate-data-repo)
12. [Technical details](#technical-details)

---

## Fork and replace

The recommended setup: **fork this repo, put your content next to the code, and deploy the fork from your own origin.** Nothing at runtime depends on bristleconeweb.com: your pages load `cred.js` from your own site and the widget reads your own data files. (The optional credit link under the widget is only a link.)

1. **Fork** [bristweb/cred](https://github.com/bristweb/cred) and publish the fork: Cloudflare Pages with the included `.github/workflows/deploy.yml` (repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CF_PAGES_PROJECT`), or GitHub Pages (Settings → Pages → *Deploy from a branch*, `main`, `/ (root)`; `.nojekyll` is included). `_headers` opens CORS.
2. **Copy `example/` to `data/`** (any folder name works) and replace the example content with yours: `config.js`, `reviews/`, `icons/`, `theme/`, images. Leave `example/` itself untouched so upstream updates merge without conflicts.
3. **Embed from your own origin.** No `data-source` is needed: the widget reads the content from the same site as the script ([Data source](#data-source)).

```html
<script src="https://YOUR-FORK-SITE/assets/js/cred.js" defer></script>
```

### Examples and the `include_examples` switch

Everything that ships as sample content is tagged `example: true`: each record in `example/reviews/<year>.json`, and the summary, accolades, credentials and testimonials in `example/config.js`. The tag travels with the content, so it still works after you copy `example/` into `data/`.

`include_examples` is a top-level key in `config.js`. It defaults to `true`, so the upstream demo shows its examples:

```js
export default {
  include_examples: false, // leave out everything tagged example: true
  // …
};
```

With `false`, tagged content is left out of the cards, counts, averages, summary card, JSON-LD and rating badge, the same way `hidden: true` works on a review. Nothing is deleted. That lets you:

- start from a copy of `example/`, set `include_examples: false`, and add your own (untagged) records while you replace the samples; or
- keep `example/` in your fork as a reference and let upstream refresh the examples later: they never reach your published widget, because the widget reads `data/` (or you hide them with the switch).

To remove examples for good, delete the tagged items or files. You do not have to. `include_examples` needs widget 1.2.0 or later (pin `version: "^1.2.0"` if you use it).

### What is code, what is content

| Upstream provides (pull these from upstream) | Yours (never has to match upstream) |
|---|---|
| `assets/`, `lang/`: the widget (`cred.js`, CSS, built-in icons, UI wording) | `data/` (or whatever you named it): `config.js`, `reviews/`, `icons/`, `images/`, `theme/`, `lang/` overrides |
| `schemas/`, `types/`, `scripts/`: optional import, validate and badge tooling; use it or ignore it | Your own import scripts, sync jobs and workflows |
| `example/`: sample content, tagged `example: true` | Your site's pages, `CNAME`, `robots.txt`, `sitemap.xml`, secrets |
| `index.html`, `embed.html`, `README.md`, `CHANGELOG.md`, `COMPARISON.md`, `docs/` | Your choice of hosting workflow (`deploy.yml`) |

Upstream **provides** the tooling; it does not require it. The widget only reads the files in your data folder (the default `data/`, or `data-source`), so a fork can fill them however it likes: by hand, with its own sync job, or with the validator and badge scripts here, which only check and tidy what you produce:

```sh
npm ci                              # once, for the validator
node scripts/validate.mjs data      # schema and file checks
node scripts/badge.mjs data         # optional rating badge files
```

### Pull the latest Cred from upstream

```sh
git remote add upstream https://github.com/bristweb/cred.git   # once
git fetch upstream --tags
git merge upstream/main
```

Rebase instead of merge if you prefer. Your content lives in `data/`, which upstream never touches, so merges stay clean and `example/` and the code simply update. Fetching tags matters if you serve `/v/<x.y.z>/` builds ([Versions](#versions)). Read [CHANGELOG.md](CHANGELOG.md) first when a major version is involved.

---

## Embed

Same live demo as at the top of this README. For a real site, point the script `src` at your own fork's origin ([Fork and replace](#fork-and-replace)); `data-source` (or the iframe `?source=`) is optional and only needed when your content is somewhere else. The demo `src` also works while you try things out.

### Data source

The widget reads `config.js`, `reviews/<year>.json`, `theme/theme.css` and the rest from a data folder. `data-source` (or `?source=`) is **optional**. Left out, it uses the same site as the script: the site root is the folder that holds the script's `assets/` directory, and the widget reads `<site root>/data/` if that has a `config.js` (your fork's own content), otherwise `<site root>/example/` (the bundled examples). That is why a fork needs no attribute, and why the upstream demo works with the bare snippet. Set `data-source="https://…/"` (trailing `/` added if missing) to read content from a different folder, site or repo. A pinned release (`/v/<x.y.z>/assets/js/cred.js`) looks at the site root as well.

### JavaScript (recommended)

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js" defer></script>
```

The widget renders where the tag is. It loads CSS from this repo and `theme/theme.css`, `config.js`, and every `reviews/<year>.json` from the data folder ([Data source](#data-source)), in parallel. Options go on the same tag ([list](#options)).

- Sizes itself in the page; no resize script needed for the JS embed.
- Invisible until font and first layout are ready, then fades in once.
- Several tags on one page are fine (even different `data-source`s); each source and the CSS are fetched once.
- Fills the width it is given (up to 1200px) inside page builders that shrink-to-fit their content.
- Classes are prefixed `rw-`; a small reset limits host CSS leakage.

Optional: `data-target="#…"` on the script mounts into that element instead (compatibility when the host is limited or you need a special layout). Prefer the in-place script above. A script in `<head>` with no target renders at the end of `<body>`.

### Google Sites / Similar

If your host gives you a box with limited ability to adjust sizing and responsiveness (Google Sites: *Insert → Embed → Embed code*), turn on **one** toggle:

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js"
        data-constrained="true"></script>
```

`data-constrained="true"` packs the widget into that box: fill the height, arrows inside, nothing drawn outside the box, no hover lift, focus rings drawn inside. It is named “constrained” (not “fixed proportions”) because it follows the box you give it rather than locking an aspect ratio. Stretch the box full width and about **420px** tall; on your own fork the same tag reads your `data/` folder. See [Header behavior](#header-behavior) for short heights (tested down to 140px). Extra fitting tweaks (beyond this preset) are CSS classes — see [Options](#options).

### Iframe

```html
<iframe id="reviews-widget"
        src="https://cred.bristleconeweb.com/embed.html"
        title="Reviews" loading="lazy" scrolling="no"
        style="width:100%;border:0;height:420px"></iframe>
<script>
  addEventListener('message', function (e) {
    if (e.data && e.data.type === 'reviews-widget-height')
      document.getElementById('reviews-widget').style.height = e.data.height + 'px';
  });
</script>
```

`index.html` and `embed.html` are bare, transparent, `noindex` pages. With no `?source=` they use the default data folder (`data/` if present, else `example/`).

---

## Options

Each option below is set as `data-<name>` on the script (or target element) and/or as `?<name>=` in the URL. Query wins over `data-*`, which wins over `display` in `config.js`, which wins over the built-in default. Omit an option to keep its default. `source` is special: `?source=` applies only when there is no `data-source`.

| Option | Values | Default |
|---|---|---|
| `source` | Data folder URL (trailing `/` added if missing). Optional: see [Data source](#data-source) | `<site root>/data/` if it has a `config.js`, else `<site root>/example/` |
| `layout` | `carousel` \| `grid` | `display.layout` or `carousel` |
| `platform` | One key from `config.platforms`, or `accolades` / `credentials` / `testimonials` (filters to that tab). Omit for every platform. Clicking the active filter tab again clears it back to All | all platforms |
| `limit` | Max review cards (`0` = no limit) | `0` |
| `summary` | `off` hides the summary card | shown |
| `theme` | `light` \| `dark` \| `auto` (follow host page theme) | `display.theme` or `auto` |
| `schema` | `off` skips JSON-LD (`data-schema` only; no query param) | injected |
| `constrained` | `true` = tight-box preset: fill height, arrows inside, overflow hidden, no hover lift, focus rings inside | off |
| `lang` | ISO tag matching `config.languages[].lang` (e.g. `en`, `es`) | page language, then `defaultLanguage`, then English |
| `min_rating` | Hide rated reviews below this many stars (`data-min-rating`, `?min_rating=`, `display.min_rating`). Unrated reviews and accolades stay | show all |
| `hide` | Comma-separated review keys `<platform>-<platform_review_id>` to hide (`data-hide`, `?hide=`, `display.hide` array; all combine). `"hidden"` on a review record hides it too, fully or in part ([Hiding and duplicates](#hiding-and-duplicates)) | none |

**CSS knobs** (no `data-*`): cards across are responsive by default. Optional classes on `.rw-host` / `.rw-root` — `.rw-clip` / `.rw-overflow-hidden`, `.rw-arrows-inside`, `.rw-nolift`, `.rw-focus-inside`, `.rw-fixed` + `.rw-fixed-host` (usually from `constrained`), `.rw-cards-1`…`4`, and `--rw-pad` for outer padding.

---

## Data format

Plain files at the data root, served over HTTPS with CORS open enough for your pages to fetch them (Cloudflare Pages with the included `_headers`, or GitHub Pages by default; any static host works). The widget reads only these paths; other folders (e.g. your own `scripts/`) are never loaded.

```
config.js                business, platforms, display, languages, defaultLanguage, strings, schema, summary, accolades, credentials, testimonials, reviews.years, …
lang/<code>.json         optional UI wording (listed in config.languages; partial OK)
reviews/<year>.json      reviews dated that year (array, newest first)
images/reviewers/        optional local avatars (any path/URL works in records)
icons/                   platform logos
theme/theme.css          @font-face + --rw-* variables
theme/fonts/             optional self-hosted fonts
```

### `config.js`

An ES module whose default export is the config object, so it can carry comments. `// @ts-check` plus the `/** @type {import('./cred-config').CredConfig} */` line above `export default` gives editor autocomplete and type checks from `cred-config.d.ts` (copy it from `example/`; it is generated from `schemas/config.schema.json`). Migrating from an older `config.json`: `node scripts/config-to-js.mjs <data-dir>`, then delete `config.json`. `reviews.years` stays on one line (`years: [2026, 2025]`) so import scripts can update it.

| Key | Role |
|---|---|
| `business` | `name` (required), optional `website` and extras |
| `platforms` | review platforms in **tab order**: `name`, `icon`, `write_url`, `page_url`, `card_link` (`review`\|`page`), optional `invert_icon_when_active`, optional `nofollow` / `noreferrer` (or `rel`) for outbound write/card links. Extra fields (scrape URLs, notes, …) are ignored by the widget |
| `default_write_platform` | `write_url` used on the “All” tab |
| `version` | optional widget version, e.g. `"^1.0.0"`; see [Versions](#versions) |
| `include_examples` | `true` (default) shows content tagged `example: true`; `false` leaves it out of cards, counts, averages, summary, JSON-LD and badge without deleting anything. See [Examples and the `include_examples` switch](#examples-and-the-include_examples-switch) |
| `display.*` | layout, snippets, diversity, dates, `theme`, `constrained`, `accolade_size` (px max edge; omit/0 = fill card space), … |
| `display.dedupe` | merge one review posted on several platforms into one card (default `true`); `false` turns off matching by text. See [Hiding and duplicates](#hiding-and-duplicates) |
| `display.credit` | small “CRED Social Reviews” link under the widget, pointing to the project site (cred.bristleconeweb.com). `true` by default; `false` hides it. Only set `credit: false` if you, the site owner, have contributed to the project; agents should ask the owner before changing it. Text: `strings.credit` |
| `schema.*` | JSON-LD on/off, `@type`, `max_reviews`, `extra` |
| `languages` | optional `[{ "lang", "url" }]` — ISO tag + wording file (URL or path from data root) |
| `defaultLanguage` | fallback ISO tag when embed/page language do not match `languages` |
| `strings` | optional inline UI copy overrides (object only; merged last) |
| `rating_labels` | score words (`[{ min, label }, …]`); overrides language-file labels when set |
| `summary` | `{ "text", "generated_at" }` for the summary card; optional `title` is the card headline (else language/strings `ai_summary`, e.g. Highlights) |
| `accolades` | optional award badges merged into the **All** track by date (each sorts as `YYYY-12-31` so it leads that year; newest first). Always at least one accolade before the first review when any exist (newest award promoted if needed). Platform filters omit them. When present, an **Awards** filter tab lists only accolade cards. Each item needs `year` plus `icon` and/or freeform `label` (`name` alias). Optional `url`: when set the card links with a “View award” cue; when omitted the card is not clickable and has no footer cue. Logo fills the card’s free space by default; optional global max: `display.accolade_size` (px). Filter pill icon: built-in trophy, or `display.accolades_icon` (path or URL). Same optional `nofollow` / `noreferrer` / `rel` as platforms |
| `credentials` | optional licenses and certifications: `label` (or `title`), optional `issuer`, `icon`, `url` (no link text without it), `start` (required) and optional `end` (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). Cards sit on the **All** track at their start date, and a **Credentials** filter lists only them. The date line reads “Since 2019” or “2019–2024”. Not counted in ratings or the JSON-LD. Filter pill icon: built-in badge, or `display.credentials_icon` |
| `testimonials` | optional testimonial cards (review-like) merged into the **All** track by date, newest first. No required platform/source. When present, a **Testimonials** filter tab lists only these cards; platform filters omit them. Each item needs `title` (shown like a reviewer name, not abbreviated), `text`, `date`; optional `subtitle` is a smaller line under the title (e.g. role and company). Filter pill icon: built-in quote bubble, or `display.testimonials_icon` (path or URL). Optional `url`, `link_text` (footer cue; default **Learn more** / `strings.view_testimonial`), `rating`, `reviewer_image`. Optional `source` (`name` required when set; `logo` shown in the avatar slot, reviewer image secondary; `name` is used in the accessible label, not as a visible line). Same optional `nofollow` / `noreferrer` / `rel` Optional `media` list: `{ type: image | audio | video | link, url, thumbnail, poster, caption, alt }`. With media, the first item's image is the card's content and the quote text is kept only as hidden text and alt text; extra items are small image chips. Images and videos open in a lightbox, audio plays below its image, links open the post. `caption` / `alt` label each item for screen readers and tooltips; audio, video and link fall back to a neutral image without `thumbnail` / `poster`. A card with media is not itself a link; its `url` becomes the footer link. Optional `excerpt` as for reviews |
| `example` (on `summary`, an accolade, credential or testimonial) | `true` marks bundled sample content; see `include_examples` |
| `reviews.years` | year files to fetch, newest first, e.g. `[2026, 2025]` |

Formal shape: `schemas/config.schema.json` in this repo.

Optional UI languages (partial overlays OK; English is built in):

```json
"defaultLanguage": "en",
"languages": [
  { "lang": "en", "url": "lang/en-override.json" },
  { "lang": "es", "url": "lang/es.json" }
]
```

### `reviews/<year>.json`

Array of records for that calendar year, newest first. Store full names, full text, replies, URLs, and platform extras; the widget abbreviates at render time.

```jsonc
{
  "platform": "google",
  "platform_review_id": "ex-google-001",
  "reviewer_name": "Avery Quinn",
  "reviewer_profile_url": null,
  "reviewer_image": "images/reviewers/google-ex-google-001.svg",
  "reviewer_image_source_url": null,
  "rating": 5,
  "text": "full review text",
  "date": "2026-09-14T18:22:00Z",
  "review_url": "https://example.com/google/reviews/ex-google-001",
  "owner_reply": { "text": "…", "date": "2026-09-14T21:00:00Z" },
  "collected_at": "2026-10-01T12:00:00Z"
}
```

`platform` + `platform_review_id` is a **suggested** identity for sync tooling (keep them unique per platform). How a review was collected belongs in your tooling/config, not on the record.

`reviewer_image` may be any working URL or path (absolute, `data:`, or relative to the data root). A local convention like `images/reviewers/<platform>-<id>.<ext>` is only a suggestion for sync scripts — not required.

Optional `"example": true` marks a record as bundled sample content: it is left out when `config.js` sets `include_examples: false` ([Fork and replace](#fork-and-replace)). Your own records need no tag.

Optional `excerpt`: an exact passage of `text` to show on the card instead of the opening ~160 characters (ellipses mark where it starts or ends mid-text). The validator checks it is a real passage.

Optional per-review `nofollow` / `noreferrer` (or `rel`) override the platform for that card’s link. Outbound links always keep `noopener`; unset review → platform → just `noopener`.

### Hiding and duplicates

Records always stay in the data; these change only what the widget shows and counts. (To leave out all bundled example content at once, use `include_examples: false`.)

`"hidden"` on a record:

| Value | Card | Average and counts | JSON-LD |
|---|---|---|---|
| `true` | hidden | left out | left out |
| `{ "display": true }` | hidden | counted | included |
| `{ "rating": true }` | shown | left out | review included, not in `aggregateRating` |
| `{ "schema": true }` | shown | counted | left out |

Keys combine (`{ "display": true, "schema": true }`); a missing key means not hidden. `display.hide` keys and `min_rating` hide a review everywhere, like `true`.

**Duplicates.** A review posted on several platforms (same text, ignoring case, punctuation and spacing; 40+ characters) is treated as one:

- **All** shows one card, with a small “Also on Zola” line naming the other platforms (`strings.also_on`).
- The overall rating, “Based on” count, **All** count, rating badge and JSON-LD count it once.
- Each platform’s filter shows and counts its own copy, so platform counts can add up to more than the **All** count.
- The card kept is one without `duplicate_of`, then one with a star rating, then the platform listed first in `platforms`, then the oldest.

For copies whose text differs a little, add `"duplicate_of": "<platform>-<platform_review_id>"` (the other copy) to one record. `display.dedupe: false` turns off the automatic text match; `duplicate_of` still applies.

Hiding applies to each copy first, then duplicates merge among what is left: a hidden copy never returns through its twin, and is not named in “Also on”. To hide a cross-posted review everywhere, hide every copy.

Formal shape: `schemas/reviews.schema.json` in this repo.

---

## JSON Schema and validation

| Schema | Validates |
|---|---|
| `schemas/config.schema.json` | `config.js` |
| `schemas/reviews.schema.json` | each `reviews/<year>.json` array |

Optional check: from a checkout of this repo, run `node scripts/validate.mjs <data-dir>` (install deps in this repo first with `npm ci`). It checks the JSON schemas plus light filesystem rules (icons exist, relative `reviewer_image` paths resolve, `reviews.years` matches files, newest-first, dates in the right year file, unique `platform` + `platform_review_id`, `duplicate_of` names another review) and reports how many duplicates count once.

A data repo can run the same check on every push. The sample at `example/.github/workflows/validate.yml` is that thin caller — copy `example/` and it becomes `.github/workflows/validate.yml` at the repo root:

```yaml
# .github/workflows/validate.yml
name: Validate reviews data
on:
  push:
  workflow_dispatch:
permissions:
  contents: write # lets the check commit the updated rating badge
jobs:
  validate:
    uses: bristweb/cred/.github/workflows/validate.yml@main
```

### Rating badge

After validating, the same workflow writes `badge.json` and `badge.svg` at the data root (or run `node scripts/badge.mjs <data-dir>`) and commits them when they change. They use the same reviews the widget counts (`include_examples`, `hidden`, `display.hide` and `display.min_rating` apply; duplicates count once). Optional `config.badge.label` sets the left-hand text (default `rating`). Put it in your own README or site:

```markdown
![Rating](https://img.shields.io/endpoint?url=https://<your-data-repo>.pages.dev/badge.json)
```

`badge.svg` is the same badge as a plain image, for pages that should not depend on shields.io.

---

## Updating data

Edit the cloned data repo (same shape as `example/`): add or change records in `reviews/<year>.json` (newest first), update `reviews.years` when you add a year file, adjust `config.js` / icons / theme as needed, then publish. Optionally run `node scripts/validate.mjs <data-dir>` from a reviews-widget checkout before you push.

---

## Structured data (JSON-LD)

Built in the browser and injected once per page as `#reviews-widget-schema`. `@type` from `schema.type` (default `LocalBusiness`), `aggregateRating` from 1–5 ratings only, `review` items in card order. Hidden reviews (`hide`, `min_rating`, `"hidden": true` or `{ "schema": true }`) are left out of both, like the counts and filter tabs; `{ "rating": true }` leaves a review out of `aggregateRating` only. A review posted on several platforms appears once ([Hiding and duplicates](#hiding-and-duplicates)). Disable with `schema.enabled: false` or `data-schema="off"`.

### Stars in Google results

- Valid `AggregateRating` / `Review` markup makes review stars possible in search results; Google never guarantees them ([review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)).
- Google does not show stars for self-serving reviews: a `LocalBusiness` or `Organization` marking up reviews about itself on its own site, including through an embedded widget ([announcement](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)). Other eligible types, such as `Product`, can qualify (`schema.type`).
- Google reads JSON-LD added by JavaScript, as this widget does; check a live page with the [Rich Results Test](https://search.google.com/test/rich-results) ([JavaScript guide](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)).
- Markup must match what visitors can see. The widget builds it from the shown reviews only, so hidden reviews are left out.

---

## Header behavior

Container queries on the widget’s own width, shared by the header and the carousel (and on its height in constrained / `.rw-fixed` mode):

| Width | Header | Carousel |
|---|---|---|
| > 1000px | score row; All + as many filter pills as fit + **More** menu; Write | 4 cards |
| ≤ 1000px | filter pills → icon + count | 3 cards |
| ≤ 760px | hide “Excellent” / “Based on” | 2 cards |
| ≤ 480px | hide filters; short button label; no arrows | 1 card |

Between these widths the filter row fits itself: pills never wrap or scroll, the rest go into More, and the active filter always stays visible. Write stays outside the More menu.

| Height (fixed mode) | |
|---|---|
| ≤ 360px | compact header and cards |
| ≤ 200px | slim header; cards drop date / “View on”; snippets clamp |

Above those heights, long card text scrolls inside its card.

---

## Versions

The embed code never changes: `…/assets/js/cred.js` is always the latest release. A data repo can pin the widget version with `version` in `config.js`, written as a full semantic version:

| `version` | Loads |
|---|---|
| `"latest"` (or omitted) | the latest release |
| `"^1.0.0"` | newest 1.x.x, at least 1.0.0 |
| `"~1.0.0"` | newest 1.0.x, at least 1.0.0 |
| `"1.0.2"` | exactly 1.0.2 |

When the latest build already satisfies the range (e.g. `"^1.0.0"` while latest is 1.x.x), nothing extra loads. Otherwise it reads `/versions.json` (the list of releases), picks the newest match and loads that release's immutable copy from `/v/<x.y.z>/` once, reusing the data it already fetched. Recommended for production: `"^1.0.0"`, which takes fixes and features but never a breaking change. The `/v/` copies are built by the Cloudflare Pages deploy; on GitHub Pages only the latest is served.

Releases follow [semantic versioning](https://semver.org/): breaking changes to the embed, options or data format bump the major version; new features the minor; fixes the patch. Each release is a `vX.Y.Z` git tag; see [CHANGELOG.md](CHANGELOG.md).

## Privacy and presentation

- **Storage:** full names, text, replies, URLs, extras in the public data files.
- **Presentation:** first name + last initial; ~160-character snippets (or the review's `excerpt`); card links back to the platform.

---

## Alternative: a separate data repo

[Fork and replace](#fork-and-replace) is the recommended path. If you would rather keep content in its own repo (for example one widget shared by many sites), copy this repo’s `example/` folder into a new repo and replace the example content with yours — `config.js`, `reviews/`, `icons/`, `theme/`, optional images, and `.github/workflows/validate.yml` (already under `example/`, so a full copy of that tree gets the workflow at the data-repo root). Publish it (see below). Point the widget’s `data-source` at that published URL (needed here, since the content is not on the script's own site).

**Hosting.** Recommended: Cloudflare Pages. The included `.github/workflows/deploy.yml` publishes the repo root on every push to `main` once you add three repo secrets: `CLOUDFLARE_API_TOKEN` (Pages edit permission), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT` (project name; create it once in the Cloudflare dashboard as a Direct Upload project). `_headers` opens CORS. Backup: GitHub Pages needs no extra files; in Settings → Pages choose *Deploy from a branch*, `main`, `/ (root)` (`.nojekyll` is included).


---

## Technical details

- Loads `config.js` (an ES module), then all year files in parallel; injects CSS if missing.
- Without `data-source` / `?source=`, reads `data/` (if it has a `config.js`) or `example/` from the script's site; if neither loads, shows the unavailable message.
- Fixed-height mode: host height 100% or viewport remainder; card text scrolls without blocking horizontal swipe.
- Icons: data-repo SVG, then Simple Icons CDN fallback.
- Local preview: serve this repo (and your data) from any static origin with CORS (`Access-Control-Allow-Origin: *`) and open `index.html` (it uses `data/` or `example/`) or point `data-source` at a local URL.

Review text belongs to its authors; platform marks belong to their owners.

If a feature is missing or you want to run it entirely independently, [fork the repo](https://github.com/bristweb/cred/fork). Pull requests are welcome.

## License

License: MIT
