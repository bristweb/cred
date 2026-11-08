# Workflows for a standalone data repo

Only needed if you keep your content in its **own repo** instead of `data/` in a fork (see the main README, "Alternative: a separate data repo"). A fork uses the repo's own `.github/workflows/` and needs none of this.

Copy `validate.yml` (validates the data and refreshes the rating badge) and, for Cloudflare Pages, `deploy.yml` into `.github/workflows/` of the data repo. They are samples, not part of the `data/` layout, so they live here and not in `template/data/`.
