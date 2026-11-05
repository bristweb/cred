# Example data (fictional)

The **examples** that ship with [bristweb/cred](https://github.com/bristweb/cred): sample content for an invented bike shop, not a real business. Do not present it as real reviews or testimonials.

Everything here is tagged `example: true` (each review record, and the summary, accolades, credentials and testimonials in `config.js`). `include_examples` in `config.js` (default `true`) shows it; set it to `false` to leave all tagged content out of the published widget without deleting any file. Keep this folder untouched in a fork so upstream updates merge cleanly, and put your own content in a copy of it (for example `data/`). See [Fork and replace](https://github.com/bristweb/cred#fork-and-replace).

Demo platforms: **Google**, **Yelp**, and **Facebook** (common review sources). The business and review text are fictional; the platform names identify where each sample would appear.

In a fork, copy the files of this folder into `content/` (empty upstream) and replace them with yours. With no `data-source`, the widget reads `/content/` once it has a `config.js`, and these examples until then. Or copy it to start a separate data repo (includes `.github/workflows/validate.yml` and `deploy.yml`, `.nojekyll`, `_headers` and `.gitignore`).

## Publish

**Hosting a separate data repo.** (A fork publishes through its own workflows instead, see the main README.) Recommended: Cloudflare Pages. The included `.github/workflows/deploy.yml` publishes the repo root on every push to `main` once you add three repo secrets: `CLOUDFLARE_API_TOKEN` (Pages edit permission), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT` (project name; create it once in the Cloudflare dashboard as a Direct Upload project). `_headers` opens CORS. Backup: GitHub Pages needs no extra files; in Settings → Pages choose *Deploy from a branch*, `main`, `/ (root)` (`.nojekyll` is included).

Then point the widget at the published URL (`data-source` is only needed when this folder is served from a different site than the script; in a fork that holds both, omit it and the widget reads `/content/` if it has a `config.js`, or these examples at `/example/` if not):

```html
<script src="https://cred.bristleconeweb.com/assets/js/cred.js"
        data-source="https://YOUR_DATA_REPO.pages.dev/" defer></script>
```

Google Sites / fixed-height box: add `data-constrained="true"`.

## Layout

- `config.js` (with `cred-config.d.ts` for editor type hints) — `include_examples`, business, platforms, display, summary, optional `accolades` / `testimonials`, `reviews.years` (optional `languages` / `defaultLanguage`)
- `lang/` — optional UI wording listed in `languages` (partial OK; widget ships English)
- `reviews/<year>.json` — review records (tagged `example: true`)
- `theme/theme.css` — `--rw-*` colors (light + dark)
- `icons/`, `images/` — optional local assets
- `.github/workflows/validate.yml` — validates against cred on push

## Credits

Platform logos (**Google**, **Yelp**, **Facebook**) are from [Simple Icons](https://simpleicons.org/) ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)); see [`icons/ATTRIBUTION.md`](icons/ATTRIBUTION.md). All marks belong to their owners and are used only to identify where each review was posted. This example is not affiliated with those platforms. Placeholder award badges in `config.js` are fictional (Local Shop Editors' Pick + Trail Town Best Bike Shop; title + year up top, View award link at bottom; Awards tab + YYYY-12-31 track merge; see attribution). Two fictional corporate testimonials (Contoso Logistics, Summit Athletics) interleave on All by date; source logos sit in the avatar slot.
