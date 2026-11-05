# data/

Everything that is **yours** goes here: reviews, assets (icons, images, video, audio), styles and wording overrides. It is empty in upstream on purpose. Data only: pages go in the top-level `site/` folder.

**`package/` is upstream's product and is left alone in a fork.** To start, copy the files of [`../package/example-data/`](../package/example-data/) into this folder and replace them with your own. That folder mirrors this one exactly, so this is the layout:

```
data/
├── config.js              business, platforms, display, summary, accolades, testimonials, reviews.years, …
├── reviews/<year>.json    reviews (newest first)
├── theme/theme.css        fonts and colours (--rw-* variables)
├── lang/<code>.json       optional wording overrides listed in config.languages (partial files are fine)
└── assets/                all your local files, sorted by kind
    ├── icons/             platform logos, award and credential badges, company marks
    ├── images/            photos, posters, thumbnails
    │   └── reviewers/     reviewer avatars
    ├── video/             video clips
    ├── audio/             audio clips
    └── ATTRIBUTION.md     optional: credits and licences
```

Use only these names: one `assets/` folder, no top-level `icons/`, `images/` or `media/`. Paths in `config.js` and the review files are relative to this folder (for example `assets/icons/google.svg`).

Which data the widget uses when the embed has no `data-source`: this folder once it has a `config.js`, otherwise the bundled examples. A `data-source` (or `?source=`) always wins. This folder is served as it is at `/data/` (nothing is built). See the main README, "Fork and replace".
