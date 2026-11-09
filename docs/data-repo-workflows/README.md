# Workflows for a standalone data repo

These samples are only for a **separate data repository**. The [starter](https://github.com/bristweb/cred-starter) already includes its own workflows. See the [separate data repository guide](../REFERENCE.md#alternative-a-separate-data-repo).

Copy `validate.yml` (checks the data and refreshes the rating badge) and, for Cloudflare Pages, `deploy.yml` into the data repo's `.github/workflows/`. These are workflow samples, not content files, so they live here rather than in `template/data/`.
