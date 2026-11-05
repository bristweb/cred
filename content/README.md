# Content

Everything a site shows lives here, one folder per data set; the code is in `../src/`. Each folder is published under its own name (`content/example/` at `/example/`, `content/data/` at `/data/`).

- `example/`: the sample content that ships with upstream, tagged `example: true`. Leave it untouched so upstream updates merge cleanly.
- `data/`: yours. Create it by copying `example/`, then replace the content. The widget reads `/data/` by default when it has a `config.js`, otherwise `/example/`.

See the main README, "Fork and replace".
