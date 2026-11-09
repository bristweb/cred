# Workflows for a standalone data repo

Only needed if you keep your content in a **separate data repository**. A [starter](https://github.com/bristweb/cred-starter) already includes its own workflows and needs none of these samples. See the [separate data repository guide](../REFERENCE.md#alternative-a-separate-data-repo).

Copy `validate.yml` (validates the data and refreshes the rating badge) and, for Cloudflare Pages, `deploy.yml` into `.github/workflows/` of the data repo. They are samples, not part of the `data/` layout, so they live here and not in `template/data/`.
