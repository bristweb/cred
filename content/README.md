# content/

Everything that is **yours** goes here: reviews, assets (icons, images, video, audio), styles, wording overrides, your own pages. It is empty in upstream on purpose.

**`src/` is upstream's code and is left alone in a fork.** To start, copy the files of [`../src/example-content/`](../src/example-content/) into this folder and replace them with your own. That folder mirrors this one exactly, so this is the layout:

```
content/
├── config.js              business, platforms, display, summary, accolades, testimonials, reviews.years, …
├── reviews/<year>.json    reviews (newest first)
├── theme/theme.css        fonts and colours (--rw-* variables)
├── lang/<code>.json       optional wording overrides (partial files are fine)
├── assets/                all your local files, sorted by kind
│   ├── icons/             platform logos, award and credential badges, company marks
│   ├── images/            photos, posters, thumbnails
│   │   └── reviewers/     reviewer avatars
│   ├── video/             video clips
│   ├── audio/             audio clips
│   └── ATTRIBUTION.md     optional: credits and licences
└── site/                  optional: your own pages and host files (see below)
```

Use only these names: one `assets/` folder, no top-level `icons/`, `images/` or `media/`. Paths in `config.js` and the review files are relative to this folder (for example `assets/icons/google.svg`).

Optional `site/` holds your own pages and host files (`robots.txt`, `sitemap.xml`, `_headers`, `CNAME`); the build lays them over `src/site/` at the site root and does not publish them under `/content/`.

Which data the widget uses when the embed has no `data-source`: this folder once it has a `config.js`, otherwise the bundled examples. A `data-source` (or `?source=`) always wins.

This is not `dist/`: that is the generated build output and is git-ignored. See the main README, "Fork and replace".
