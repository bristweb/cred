# content/

Everything that is **yours** goes here: reviews, images, icons, styles, wording overrides, your own pages. It is empty in upstream on purpose.

**`src/` is upstream's code and is left alone in a fork.** To start, copy the files of [`../src/example-content/`](../src/example-content/) into this folder (`config.js`, `reviews/`, `theme/`, `icons/`, `images/`, `lang/`, `media/`) and replace them with your own.

Optional `site/` here holds your own pages and host files (`robots.txt`, `sitemap.xml`, `_headers`, `CNAME`); the build lays them over `src/site/` at the site root.

Which data the widget uses when the embed has no `data-source`: this folder once it has a `config.js`, otherwise the bundled examples. A `data-source` (or `?source=`) always wins.

This is not `dist/`: that is the generated build output and is git-ignored. See the main README, "Fork and replace".
