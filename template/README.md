# Reviews

Your [Cred](https://github.com/bristweb/cred) site starts with the same fictional bike shop demo shown at [cred.bristleconeweb.com](https://cred.bristleconeweb.com/). Replace the examples with your own content, then publish it.

## Make it yours

Edit these files in GitHub. No local installation is needed.

- **Your business:** `data/config.js` holds your name, website and review platforms.
- **Your reviews:** replace the examples in `data/reviews/`. Keep `reviews.years` in `config.js` up to date.
- **Your look:** add images in `data/assets/` and colors in `data/theme/theme.css`.

Delete the example files you do not use. The **Check** action validates every push and reports anything you need to fix. See the [data format guide](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md#data-format).

## Publish it

Choose either host. A private repository still publishes a public website.

### GitHub Pages

1. In this repository open **Settings → Pages → Source: GitHub Actions**.
2. Open **Actions → Deploy to GitHub Pages → Run workflow**.
3. Run it again after you change your reviews or theme.

Your site will be at `https://YOUR-USER.github.io/YOUR-REPO/` (replace with your GitHub user and repository name).

### Cloudflare Pages

**Connect to Git:** in Cloudflare open **Workers & Pages → Create → Pages → Connect to Git**. Choose this repository and `main`, no framework, build command `sh package/tools/export-site.sh _publish`, output directory `_publish`, and set `NODE_VERSION` to `22`. Every push to `main` then publishes.

**Or use GitHub Actions:** create a Direct Upload project in Cloudflare, then add the repository secrets `CLOUDFLARE_API_TOKEN` (Pages edit permission), `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT` (project name). **Deploy to Cloudflare Pages** publishes each push to `main`.

### Use your own subdomain

The `*.github.io` and `*.pages.dev` addresses are fine for demos and testing. Real sites should use their own subdomain, such as `reviews.EXAMPLE.COM`, or `store1.reviews.EXAMPLE.COM`, `store2.reviews.EXAMPLE.COM` for several stores.

- **GitHub Pages:** in **Settings → Pages → Custom domain** enter `reviews.EXAMPLE.COM` and save. At your DNS provider add a `CNAME` record from `reviews` to `YOUR-USER.github.io`. Then turn on **Enforce HTTPS**.
- **Cloudflare Pages:** in your project open **Custom domains → Set up a custom domain** and enter `reviews.EXAMPLE.COM`. At your DNS provider add a `CNAME` record from `reviews` to `YOUR-PROJECT.pages.dev` (Cloudflare adds it for you when the domain is on Cloudflare). HTTPS turns on by itself.

## Put it on your website

Replace `reviews.EXAMPLE.COM` with [your subdomain](#use-your-own-subdomain). While testing, use `YOUR-USER.github.io/YOUR-REPO` or `YOUR-PROJECT.pages.dev`.

```html
<script src="https://reviews.EXAMPLE.COM/package/assets/js/cred.js" defer></script>
```

Your reviews page is `https://reviews.EXAMPLE.COM/`. The same URL works in an iframe, where it becomes transparent so the host page shows through. Add `?embed` only to force that mode outside an iframe. Both follow the visitor's light or dark setting. [More embed options](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md#embed).

If your website has only a light or only a dark look, choose that theme so the reviews always match it. Add `data-theme="light"` (or `"dark"`) to the script tag, and use `https://reviews.EXAMPLE.COM/?theme=light` for iframes and for your repo's description and website link:

```html
<script src="https://reviews.EXAMPLE.COM/package/assets/js/cred.js" data-theme="light" defer></script>
```

## Get Cred updates

Run **Actions → Update Cred package** with a tag from [Cred's releases](https://github.com/bristweb/cred/releases). Review and merge the pull request. It changes only `package/`, never your data, pages or README.

<details>
<summary>If GitHub blocks the update pull request</summary>

Allow Actions to create pull requests in **Settings → Actions → General → Workflow permissions**, or open the pushed branch's **Compare & pull request** button yourself. No personal access token is needed.

</details>

[Full reference](https://github.com/bristweb/cred/blob/main/docs/REFERENCE.md) · [License](LICENSE)
