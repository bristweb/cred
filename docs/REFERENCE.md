# Cred reference

[Back to the quick start](../README.md) · [Starter publishing guide](https://github.com/bristweb/cred-starter#publish-it)

Use this guide when you need more than the working demo. You can edit your site entirely in GitHub.

- [Embed](#embed) and [options](#options)
- [Data format](#data-format), [hiding and duplicates](#hiding-and-duplicates), and [updating data](#updating-data)
- [Validation](#json-schema-and-validation) and [rating badge](#rating-badge)
- [Get Cred updates](#get-cred-updates) and [versions](#versions)
- [Structured data](#structured-data-json-ld), [header behavior](#header-behavior), and [privacy](#privacy-and-presentation)
- [Examples](#examples-and-the-include_examples-switch), [repository layout](#repository-layout), and [public URLs](#public-urls)
- [Separate data repository](#alternative-a-separate-data-repo) and [technical details](#technical-details)

## Examples and the `include_examples` switch

Everything in `template/data/` is example content. The widget recognizes it by its location; `validate.mjs` and `badge.mjs` use the same folder path. No `example: true` markers are needed there.

`include_examples` is a top-level key in `config.js`. It defaults to `true`, so the upstream demo shows its examples:

```js
export default {
  include_examples: false, // leave out example content
  // …
};
```

With `false`, example content is left out of the cards, counts, averages, summary card, JSON-LD and rating badge, the same way `hidden: true` works on a review. Nothing is deleted. In practice:

- **This repo's demo:** `include_examples` in `template/data/config.js` controls all of it at once, because everything loaded from `template/data/` is example content.
- **Your starter copy:** its `data/` starts as a copy of the demo but is treated as your content, not as examples. Replace it. To keep a few placeholders without displaying them, mark those items with `example: true` (accepted on reviews, `summary`, accolades, credentials and testimonials) and set `include_examples: false` in `data/config.js`.

`include_examples` needs widget 1.2.0 or later.

## Repository layout

The demo is also the starter template. Its source is [`template/`](../template/) in this repo, published unchanged as [**bristweb/cred-starter**](https://github.com/bristweb/cred-starter) on every push to `main`. `template/data/` holds the demo content; `template/package/` holds the widget runtime; the starter's pages, README and workflows live beside them. Make starter changes here, not in the generated repository. The starter contains no Cred project site, docs, changelog or history.

Nothing in Cred is compiled. The files you edit are the files the browser loads: there is no `dist/` and no build step.

```text
cred/
├── template/                 the starter, published verbatim as bristweb/cred-starter
│   ├── package/              the product: the only folder a starter copy receives updates for
│   │   ├── assets/           the widget: js/cred.js, css/cred.css, default icons/
│   │   ├── lang/             the widget's built-in English wording (en.json); used by every embed
│   │   ├── schemas/  types/  JSON Schemas and editor typings for config.js
│   │   └── tools/            Node tools: validate, badge, export-site, build-starter, update-package, …
│   ├── data/                 the demo: config.js, reviews/, theme/, lang/, assets/ (what this site shows)
│   ├── index.html            the starter's reviews page (also the iframe page; transparent when embedded)
│   ├── README.md             the starter's own README
│   └── .github/workflows/    Check, Update Cred package, Deploy to Cloudflare Pages, Deploy to GitHub Pages
├── site/                     Cred's own host pages: index.html (demo), example.html, robots.txt, sitemap.xml
├── docs/                     screenshots, COMPARISON.md, data-repo-workflows/ (samples for a standalone data repo)
├── .github/workflows/        check, deploy, pages, starter (publishes template/ verbatim), validate (reusable)
├── _headers  _redirects      host config (CORS, cache, short URLs for Cloudflare Pages)
├── 404.html                  the not-found page (hosts look for it at the root)
├── .nojekyll                 tell GitHub Pages to serve files as they are
└── README.md, CHANGELOG.md, AGENTS.md, LICENSE, package.json
```

In a starter, the reviews page is root `index.html` (standalone or iframe); Cred's own pages stay in `site/`.

**Where files go: one `assets/` folder, sorted by kind** (same in a starter's `data/` and `template/data/`):

```text
assets/
├── icons/            platform logos, award and credential badges, company marks (SVG)
├── images/           photos, posters, thumbnails; images/reviewers/ holds reviewer avatars
├── video/            video clips
├── audio/            audio clips
└── ATTRIBUTION.md    optional: credits and licences for what is in assets/
```

Paths in `config.js` and `reviews/*.json` are relative to the data folder, e.g. `assets/icons/google.svg`, `assets/images/reviewers/google-1.svg`, `assets/video/clip.mp4`. With no `icon` set, a platform looks for `assets/icons/<platform>.svg`.

Customize the widget without editing `package/`: set platform icons in `config.js`, fonts and colours in `data/theme/theme.css`, and wording in `data/lang/<code>.json` (partial files are fine; list them in `config.languages`). Keep media under `data/assets/`. Your own landing page, `robots.txt`, `sitemap.xml` or `CNAME` go at the root of your starter copy.

| Cred provides (`package/`, updated by pull request) | Yours (in your starter copy) |
|---|---|
| `package/assets/`, `package/lang/`: the widget, its default icons and English wording | `data/`: `config.js`, `reviews/`, `assets/`, `theme/`, `lang/` overrides |
| `package/schemas/`, `package/types/`, `package/tools/`: validate, badge and release tooling | Root host files and pages (`index.html`, …) |
| `template/` in this repo (published verbatim as the starter) | Your own import scripts, sync jobs and secrets |
| This repo's `site/` demo pages, `docs/`, `README.md`, `CHANGELOG.md` (not in the starter) | Either hosting workflow (`pages.yml` or `deploy.yml`) |

#### Search indexing

Cred and starter sites are public and indexable by default. The exporter leaves your HTML, robots rules and sitemap alone. Embedding the widget never changes your website's search indexing settings.

#### Public URLs

The files are served at their real paths on every static host. Cloudflare Pages also reads `_redirects`, which adds short URLs (rewrites: same file, address bar unchanged) so existing embeds keep working:

| Real path (every host, also GitHub Pages under `/<repo>/`) | Cloudflare Pages short URL |
|---|---|
| `/site/index.html`, `/site/example.html`, `/template/` (dual-mode reviews page) | `/`, `/example/`; old `/embed.html` → `/template/` (301) |
| `/template/package/assets/js/cred.js` (Cred) · `/package/assets/js/cred.js` (starter) | `/assets/js/cred.js` |
| `/template/package/lang/en.json` (Cred) · `/package/lang/en.json` (starter) | `/lang/en.json` |
| `/template/package/schemas/`, `/template/package/types/` | `/schemas/`, `/types/` |
| `/template/data/` | `/example/` (data files, e.g. `/example/config.js`) |
| `/data/` | `/data/` (old `/content/…` redirects here) |
| `/v/<x.y.z>/assets/js/cred.js`, `/versions.json` (generated at deploy) | same |

GitHub Pages ignores `_redirects`: use the real paths there. On Cred, for example `https://YOUR-USER.github.io/cred/template/package/assets/js/cred.js` and `…/cred/site/`. On a starter, the reviews page is at the repository root and the widget at `…/package/assets/js/cred.js`. The widget works out its site root from its own URL (`…/package/`, `…/template/package/`, `…/v/<x.y.z>/` or the short `…/assets/`), so `data/`, the examples and `versions.json` are found on both hosts and under a project subpath.

**What a deploy uploads.** `package/tools/export-site.sh _publish` (in Cred: `template/package/tools/export-site.sh`) exports committed files from `HEAD` using `git archive`: no `.git`, `node_modules`, untracked or ignored files. It includes only served paths — root host files, `site/` (Cred), `data/`, `template/index.html`, `template/data/` and `template/package/` (Cred) or `package/` (starter) — then adds generated `/v/` release copies and `versions.json`. Paths stay unchanged; it is an export, not a build. Both deploy workflows run it.

The widget does not require the Node tools. You can maintain your data by hand or with your own sync jobs, and optionally use these tools to check it and generate a badge:

```sh
npm ci                                              # once: development dependencies (zod) for the tools
node package/tools/validate.mjs data                # in a starter (Cred: template/package/tools/… template/data)
node package/tools/badge.mjs data                   # optional rating badge files
npm test                                            # Cred repo: validator tests and static HTTP smoke test
```

---

## Embed

Try the [live demo](https://cred.bristleconeweb.com/). For your own site, point the script `src` at your published widget ([Make your own](../README.md#make-your-own)). Set `data-source` (or the iframe `?source=`) only when your content is hosted elsewhere. The demo `src` below also works while you try things out.

### Data source

The widget reads `config.js`, `reviews/<year>.json`, `theme/theme.css` and other content from a data folder. It chooses that folder in this order:

1. **`data-source`** (or `?source=`): uses that folder without trying another source. Set `data-source="https://…/"` to load content from a different folder, site or repo. A missing trailing slash is added automatically.
2. **`data/`**: looks for `<site root>/data/config.js`. The site root is the folder holding `package/` or `template/package/`, inferred from the script URL (`…/package/assets/js/cred.js`, `…/template/package/assets/js/cred.js`, `…/v/<x.y.z>/assets/js/cred.js` or the Cloudflare short URL `…/assets/js/cred.js`).
3. **Bundled examples** (`<site root>/template/data/`) when `data/` has no config.

A starter needs no `data-source` attribute. The upstream demo also works without one because its `data/` is empty. Pinned releases use the same site-root lookup.

### JavaScript (recommended)

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js" defer></script>
```

The widget renders where the tag is. It loads CSS from the script’s site and `theme/theme.css`, `config.js`, and every `reviews/<year>.json` from the data folder ([Data source](#data-source)), in parallel. Options go on the same tag ([list](#options)).

- Sizes itself in the page; no resize script needed for the JS embed.
- Invisible until font and first layout are ready, then fades in once.
- Several tags on one page are fine (even different `data-source`s); each source and the CSS are fetched once.
- Fills the width it is given (up to 1200px) inside page builders that shrink-to-fit their content.
- Classes are prefixed `rw-`; a small reset limits host CSS leakage.

Optional: `data-target="#…"` on the script mounts into that element instead (compatibility when the host is limited or you need a special layout). Prefer the in-place script above. A script in `<head>` with no target renders at the end of `<body>`.

### Website builders

Paste the script into your site's HTML or embed block:

- **Framer:** Insert → Embed, choose HTML, then paste.
- **Squarespace:** use a Code block.
- **Wix:** Embed code → Custom code / HTML iframe.
- **WordPress:** use a Custom HTML block.
- **Google Sites:** use Insert → Embed → Embed code, as below.

### Google Sites / Similar

If your host places embeds in a fixed-size box (Google Sites: *Insert → Embed → Embed code*), enable constrained mode:

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js"
        data-constrained="true"></script>
```

`data-constrained="true"` fills the box, keeps arrows and focus rings inside, clips overflow and disables the hover lift. It follows the box's dimensions rather than locking an aspect ratio. Make the box full width and about **420px** tall; on your own site the same tag reads your `data/` folder. See [Header behavior](#header-behavior) for shorter boxes (tested down to 140px) and [Options](#options) for individual CSS controls.

### Iframe

```html
<iframe id="reviews-widget"
        src="https://EXAMPLE.COM/"
        title="Reviews" loading="lazy" scrolling="no"
        style="width:100%;border:0;height:420px"></iframe>
<script>
  addEventListener('message', function (e) {
    if (e.data && e.data.type === 'reviews-widget-height')
      document.getElementById('reviews-widget').style.height = e.data.height + 'px';
  });
</script>
```

In the Cred project, `site/index.html` introduces the demo; the reviews page is `template/index.html` (served at `/template/`). Old `/embed.html` and `/site/embed` URLs redirect there (301). In a starter, the same page is root `index.html` — use it standalone or as the iframe `src`. Without `?source=`, both use the default [data source](#data-source).

---

## Options

Each option below is set as `data-<name>` on the script (or target element) and/or as `?<name>=` in the URL. Query wins over `data-*`, which wins over `display` in `config.js`, which wins over the built-in default. Omit an option to keep its default. `source` is special: `?source=` applies only when there is no `data-source`.

| Option | Values | Default |
|---|---|---|
| `source` | Data folder URL (trailing `/` added if missing). Optional: see [Data source](#data-source) | `<site root>/data/` if it has a `config.js`, else `<site root>/template/data/` |
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

Plain files at the data root, served over HTTPS with CORS enabled for your pages to fetch them (Cloudflare Pages with the included `_headers`, or GitHub Pages by default; any static host works). The widget reads only these paths; other folders, such as your own `scripts/`, are never loaded.

```text
config.js                business, platforms, display, languages, defaultLanguage, strings, schema, summary, accolades, credentials, testimonials, reviews.years, …
lang/<code>.json         optional UI wording (listed in config.languages; partial OK)
reviews/<year>.json      reviews dated that year (array, newest first)
assets/icons/            platform logos, award and credential badges (SVG)
assets/images/           photos, posters, thumbnails; assets/images/reviewers/ for avatars (any path/URL works in records)
assets/video/, audio/    optional clips (any URL works too)
theme/theme.css          @font-face + --rw-* variables
theme/fonts/             optional self-hosted fonts
```

### `config.js`

An ES module whose default export is the config object, so comments are allowed. `// @ts-check` and `/** @type {import('./cred-config').CredConfig} */` above `export default` enable editor autocomplete and type checks using `cred-config.d.ts` (included in `data/`, generated from `package/schemas/config.schema.json`). To migrate an older `config.json`, run `node package/tools/config-to-js.mjs <data-dir>`, then delete `config.json`. Keep `reviews.years` on one line (`years: [2026, 2025]`) so import scripts can update it.

| Key | Role |
|---|---|
| `business` | `name` (required), optional `website` and extras |
| `platforms` | review platforms in **tab order**: `name`, `icon`, `write_url`, `page_url`, `card_link` (`review`\|`page`), optional `invert_icon_when_active`, optional `nofollow` / `noreferrer` (or `rel`) for outbound write/card links. Extra fields (scrape URLs, notes, …) are ignored by the widget |
| `default_write_platform` | `write_url` used on the “All” tab |
| `version` | optional widget version, e.g. `"^1.0.0"`; see [Versions](#versions) |
| `include_examples` | Include example content (default `true`); see [example handling](#examples-and-the-include_examples-switch) |
| `display.*` | layout, snippets, diversity, dates, `theme`, `constrained`, `accolade_size` (px max edge; omit/0 = fill card space), … |
| `display.dedupe` | merge one review posted on several platforms into one card (default `true`); `false` turns off matching by text. See [Hiding and duplicates](#hiding-and-duplicates) |
| `display.credit` | small “CRED Social Reviews” link under the widget, pointing to the project site (cred.bristleconeweb.com). `true` by default; `false` hides it. Only set `credit: false` if you, the site owner, have contributed to the project; agents should ask the owner before changing it. Text: `strings.credit` |
| `schema.*` | JSON-LD on/off, `@type`, `max_reviews`, `extra` |
| `languages` | optional `[{ "lang", "url" }]` — ISO tag + wording file (URL or path from data root) |
| `defaultLanguage` | fallback ISO tag when embed/page language do not match `languages` |
| `strings` | optional inline UI copy overrides (object only; merged last) |
| `rating_labels` | score words (`[{ min, label }, …]`); overrides language-file labels when set |
| `summary` | `{ "text", "generated_at" }` for the summary card; optional `title` is the card headline (else language/strings `ai_summary`, e.g. Highlights) |
| `accolades` | optional award badges merged into **All** by date (each sorts as `YYYY-12-31`, newest first). At least one award appears before the first review; the newest is promoted if needed. An **Awards** tab shows only awards; platform filters omit them. Each item needs `year` plus `icon` and/or `label` (`name` alias). Optional `url` makes the card clickable with a “View award” cue; without it, neither is shown. Logos fill the available space unless capped by `display.accolade_size` (px). Filter icon: built-in trophy, or `display.accolades_icon` (path or URL). Supports the same optional `nofollow` / `noreferrer` / `rel` as platforms |
| `credentials` | optional licenses and certifications: `label` (or `title`), optional `issuer`, `icon`, `url` (no link text without it), required `start` and optional `end` (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). Cards appear in **All** at their start date; a **Credentials** tab shows only credentials. The date line reads “Since 2019” or “2019–2024”. Not counted in ratings or JSON-LD. Filter icon: built-in badge, or `display.credentials_icon` |
| `testimonials` | optional testimonial cards merged into **All** by date, newest first. No platform/source is required. A **Testimonials** tab shows only testimonials; platform filters omit them. Each item needs `title` (not abbreviated), `text` and `date`; optional `subtitle` appears below the title (e.g. role and company). Filter icon: built-in quote bubble, or `display.testimonials_icon` (path or URL). Optional `url`, `link_text` (footer cue; default **Learn more** / `strings.view_testimonial`), `rating`, `reviewer_image` and `excerpt` (as for reviews). Optional `source` requires `name`; its `logo` takes the avatar slot, with the reviewer image secondary. The source name is an accessible label, not a visible line. Supports `nofollow` / `noreferrer` / `rel`. Optional `media` list: `{ type: image \| audio \| video \| link, url, thumbnail, poster, caption, alt }`. With media, the first item's image replaces the visible quote; the text remains as hidden text and alt text. Extra items appear as small image chips. Images and videos open in a lightbox, audio plays below its image, and links open the post. `caption` / `alt` label items for screen readers and tooltips; audio, video and link items use a neutral image without `thumbnail` / `poster`. A media card is not itself a link; its `url` becomes the footer link |
| `example` (on `summary`, an accolade, credential or testimonial) | `true` marks example content; see `include_examples` |
| `reviews.years` | year files to fetch, newest first, e.g. `[2026, 2025]` |

Formal shape: `package/schemas/config.schema.json` in this repo.

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
  "reviewer_image": "assets/images/reviewers/google-ex-google-001.svg",
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

`reviewer_image` may be any working URL or path (absolute, `data:`, or relative to the data root). A local convention like `assets/images/reviewers/<platform>-<id>.<ext>` is only a suggestion for sync scripts — not required.

Optional `"example": true` marks a record as bundled sample content: it is left out when `config.js` sets `include_examples: false` ([Make your own](../README.md#make-your-own)). Your own records need no tag.

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

Formal shape: `package/schemas/reviews.schema.json` in this repo.

---

## JSON Schema and validation

| Schema | Validates |
|---|---|
| `package/schemas/config.schema.json` | `config.js` |
| `package/schemas/reviews.schema.json` | each `reviews/<year>.json` array |

Optional local check: run `node package/tools/validate.mjs <data-dir>` from a starter checkout (install the development dependency, Zod, with `npm ci` first). In this repo, use `npm run validate` for the bundled examples. Validation does not change your data. It checks schema fields, local icons and media, relative reviewer image paths, year files against `reviews.years`, newest-first ordering, dates in the right year file, unique `platform` + `platform_review_id` pairs, and valid `duplicate_of` references. It also reports how many duplicates count once.

A data repo can run the same check on every push. Copy `docs/data-repo-workflows/validate.yml` to `.github/workflows/validate.yml` at the data repo's root:

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

After validating, the same workflow writes `badge.json` and `badge.svg` at the data root (or run `node package/tools/badge.mjs <data-dir>`) and commits them when they change. They use the same reviews the widget counts (`include_examples`, `hidden`, `display.hide` and `display.min_rating` apply; duplicates count once). Optional `config.badge.label` sets the left-hand text (default `rating`). Put it in your own README or site:

```markdown
![Rating](https://img.shields.io/endpoint?url=https://<your-data-repo>.pages.dev/badge.json)
```

`badge.svg` is the same badge as a plain image, for pages that should not depend on shields.io.

---

## Updating data

Edit your repository's `data/` folder in GitHub: add or change records in `reviews/<year>.json` (newest first), update `reviews.years` when you add or remove a year file, and adjust `config.js`, assets or theme as needed. Then publish. Optionally run `node package/tools/validate.mjs <data-dir>` from a starter checkout before pushing.

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

## Get Cred updates

In your repository, open **Actions → Update Cred package → Run workflow** and enter a release tag from [Cred's releases](https://github.com/bristweb/cred/releases) (v1.3.0 or later). The action fetches that tag from `bristweb/cred`, replaces **only `package/`**, validates your `data/` and opens a pull request. Your `data/`, pages, README, host settings and workflows are never touched; review and merge the PR. A release that needs changed development dependencies stops with a migration message instead.

If GitHub blocks Actions from opening pull requests, allow it in **Settings → Actions → General → Workflow permissions** (if your organization permits), or use the pushed branch's **Compare & pull request** button. No personal access token is needed. Starter files outside `package/` (its workflows and pages) are not updated automatically; the [changelog](../CHANGELOG.md) says when a release suggests changing one by hand.

## Versions

The embed code never changes: `…/assets/js/cred.js` serves the installed build. A data repo can pin the widget version with `version` in `config.js`, written as a full semantic version:

| `version` | Loads |
|---|---|
| `"latest"` (or omitted) | the latest release |
| `"^1.0.0"` | newest 1.x.x, at least 1.0.0 |
| `"~1.0.0"` | newest 1.0.x, at least 1.0.0 |
| `"1.0.2"` | exactly 1.0.2 |

When the latest build already satisfies the range (e.g. `"^1.0.0"` while latest is 1.x.x), nothing extra loads. Otherwise it reads `/versions.json` (the list of releases), picks the newest match and loads that release's immutable copy from `/v/<x.y.z>/` once, reusing the data it already fetched. Recommended for production: `"^1.0.0"`, which takes fixes and features but never a breaking change. The `/v/` copies and `versions.json` are the one generated part of a deploy: `package/tools/build-versions.mjs` (run by `export-site.sh` in `deploy.yml` and `pages.yml`) extracts each `vX.Y.Z` tag's widget into `/v/<x.y.z>/assets/` and `/lang/`, whichever layout the tag used (root, `src/` or `package/`).

The installed widget version comes from `VERSION` in `package/assets/js/cred.js`, including after a package-only update. Root `package.json` describes the development tooling; its version is not the installed widget version.

Releases follow [semantic versioning](https://semver.org/): breaking changes to the embed, options or data format bump the major version; new features the minor; fixes the patch. Each release is a `vX.Y.Z` git tag; see [changelog](../CHANGELOG.md).

## Privacy and presentation

- **Storage:** full names, text, replies, URLs, extras in the public data files.
- **Presentation:** first name + last initial; ~160-character snippets (or the review's `excerpt`); card links back to the platform.

---

## Alternative: a separate data repo

[The starter](../README.md#make-your-own) is recommended. To keep content in a separate repo instead, copy the contents of `template/data/` into a new repo's root and replace the examples. Copy `docs/data-repo-workflows/validate.yml` into `.github/workflows/`, then publish using either host below. Set the widget's `data-source` to the published URL; it is needed here because the content and script are hosted separately.

**Hosting.** Use either GitHub Pages or Cloudflare Pages.

- **GitHub Pages:** add an empty `.nojekyll` at the root. In **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/ (root)`. Cross-origin access is enabled by default.
- **Cloudflare Pages:** create a Direct Upload project and copy `docs/data-repo-workflows/deploy.yml` into `.github/workflows/`. Add repository secrets `CLOUDFLARE_API_TOKEN` (Pages edit permission), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT` (project name). Each push to `main` publishes the committed files. Add a root `_headers` file with `/*` followed by an indented `Access-Control-Allow-Origin: *` to enable cross-origin access.


---

## Technical details

- Loads `config.js` (an ES module), then all year files in parallel; injects CSS if missing.
- Without `data-source` / `?source=`, reads `<site root>/data/` (if it has a `config.js`) or `<site root>/template/data/` on the script's site; if neither loads, shows the unavailable message.
- Fixed-height mode: host height 100% or viewport remainder; card text scrolls without blocking horizontal swipe.
- Icons: data-repo SVG, then Simple Icons CDN fallback.
- Local preview: serve the repo root with any static server (e.g. `npx serve .`) and open `/site/index.html` (Cred) or `/` (a starter; add `?embed` or load it in an iframe for the transparent mode), or point `data-source` at a local URL. `npm test` runs the same check without a browser.

Review text belongs to its authors; platform marks belong to their owners.

If a feature is missing, pull requests to bristweb/cred are welcome. To run your own reviews site, use [the starter](../README.md#make-your-own).
