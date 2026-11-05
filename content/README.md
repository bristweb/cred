# Content

This folder is for **your** content, and it is empty in upstream on purpose. The code is in `../src/`, and the bundled examples are in `../src/example/`.

In a fork, copy the files of `../src/example/` here (`config.js`, `reviews/`, `theme/`, `icons/`, `images/`, `lang/`) and replace them with your own. `content/` is published at `/content/`.

With no `data-source` on the embed, the widget uses this folder as soon as it has a `config.js`; until then it shows the bundled examples. A `data-source` (or `?source=`) always wins.

See the main README, "Fork and replace".
