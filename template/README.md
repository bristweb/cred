# Reviews

Your [Cred](https://github.com/bristweb/cred) site already works. It starts with the same fictional bike shop demo shown at [cred.bristleconeweb.com](https://cred.bristleconeweb.com/).

## Make it yours

Edit these files in GitHub. Nothing needs installing.

- **Your business:** `data/config.js` holds your name, website and review platforms.
- **Your reviews:** replace the examples in `data/reviews/`. Keep the year list in `config.js` up to date.
- **Your look:** add images in `data/assets/` and colors in `data/theme/theme.css`.

Delete the example files you do not use. Do not present the fictional reviews as your own. The **Check** action validates every push and tells you what to fix. [Data format help](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md#data-format).

## Publish it

Pick either host. A private repository still publishes a public website.

### GitHub Pages

1. In this repository open **Settings → Pages → Source: GitHub Actions**.
2. Open **Actions → Deploy to GitHub Pages → Run workflow**.
3. Run it again after you change your reviews or theme.

Your site will be at `https://YOUR-USER.github.io/YOUR-REPO/` (replace with your GitHub user and repository name).

### Cloudflare Pages

**Connect to Git:** in Cloudflare open **Workers & Pages → Create → Pages → Connect to Git**. Choose this repository and `main`, no framework, build command `sh package/tools/export-site.sh _publish`, output directory `_publish`, and set `NODE_VERSION` to `22`. Every push then publishes.

**Or from Actions:** create a Direct Upload project in Cloudflare, then add the repository secrets `CLOUDFLARE_API_TOKEN` (Pages edit), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT`. **Deploy to Cloudflare Pages** publishes each push to `main`.

## Put it on your website

Replace `EXAMPLE.COM` with your published address. For GitHub Pages that is usually `YOUR-USER.github.io/YOUR-REPO`.

```html
<script src="https://EXAMPLE.COM/package/assets/js/cred.js" defer></script>
```

Your reviews page is `https://EXAMPLE.COM/`. The same URL works in an iframe (it stays transparent so the host page shows through); add `?embed` only if you need to force that mode outside an iframe. Both follow the visitor's light or dark setting. [More embed options](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md#embed).

## Get Cred updates

Run **Actions → Update Cred package** with a tag from [Cred's releases](https://github.com/bristweb/cred/releases). Review and merge the pull request. It changes only `package/`, never your data, pages or README.

<details>
<summary>If GitHub blocks the update pull request</summary>

Allow Actions to create pull requests in **Settings → Actions → General → Workflow permissions**, or open the pushed branch's **Compare & pull request** button yourself. No personal access token is needed.

</details>

[Full reference](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md) · [License](LICENSE)
