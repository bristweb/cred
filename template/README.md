# Reviews

This repository is a reviews site made from the [Cred](https://github.com/bristweb/cred) starter. It already works: it shows the same demo as [cred.bristleconeweb.com](https://cred.bristleconeweb.com/) (a fictional bike shop) until you replace the demo data with your own. Everything is done in the browser on GitHub; nothing needs installing.

## 1. Publish it

Pick one (both free):

- **Cloudflare Pages (Git integration).** In Cloudflare, **Workers & Pages → Create → Pages → Connect to Git**, choose this repository and `main`. Framework: none. Build command: `sh package/tools/export-site.sh _publish`. Output directory: `_publish`. Environment variable `NODE_VERSION` = `22`. Every push then publishes.
- **Cloudflare Pages (from Actions).** Add the repository secrets `CLOUDFLARE_API_TOKEN` (Pages edit), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT` (a Direct Upload project). The included **Deploy to Cloudflare Pages** action then publishes every push to `main`.
- **GitHub Pages.** **Settings → Pages → Source: GitHub Actions**, then **Actions → Deploy to GitHub Pages → Run workflow** (run it again after changes).

A private repository still publishes a public website.

## 2. Replace the demo with your data

Edit the files in [`data/`](data/) in GitHub: your business name and platforms in `data/config.js`, your reviews in `data/reviews/<year>.json`, colors in `data/theme/theme.css` and your logos, photos and avatars in `data/assets/`. Delete the demo files you do not use (and their years in `config.js`). The **Check** action validates every push and tells you what to fix. Format: [Cred's data format](https://github.com/bristweb/cred#data-format).

## 3. Put it on your website

Replace `YOUR-SITE` with your published address (for GitHub Pages, `YOUR-USER.github.io/YOUR-REPO`):

```html
<script src="https://YOUR-SITE/package/assets/js/cred.js" defer></script>
```

Or an iframe: `https://YOUR-SITE/site/embed.html`. Your reviews page is `https://YOUR-SITE/site/` (on Cloudflare also `https://YOUR-SITE/`). It follows the visitor's light or dark setting; add `?theme=light` or `?theme=dark` to force one. Embed options: [Cred's embed docs](https://github.com/bristweb/cred#embed).

## 4. Get Cred updates

**Actions → Update Cred package → Run workflow** with a release tag from [Cred's releases](https://github.com/bristweb/cred/releases). It opens a pull request that changes **only `package/`**. Your `data/`, pages, this README, host settings and workflows are never touched. Review and merge it.

If GitHub blocks Actions from opening pull requests, allow it in **Settings → Actions → General → Workflow permissions**, or use the pushed branch's **Compare & pull request** button.

## What is here

```
data/           yours: config, reviews, theme, assets (starts as the demo)
site/           your reviews page (index.html) and the iframe page (embed.html)
package/        the Cred widget and tools; updated by "Update Cred package", do not edit
.github/        Check, Update Cred package, and the two deploy actions
_headers  _redirects  index.html  404.html  .nojekyll   host settings
```

Cred is MIT licensed ([LICENSE](LICENSE)).
