# CRED

An open-source widget for reviews, testimonials, awards and credentials. Unlimited sources, no tracking, and your data stays in your own repository.

## See it in action

[**Live demo**](https://cred.bristleconeweb.com/) · [Light](https://cred.bristleconeweb.com/?theme=light) · [Dark](https://cred.bristleconeweb.com/?theme=dark) · [Iframe](https://cred.bristleconeweb.com/template/)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/example-widget-dark-v7.png" />
  <source media="(prefers-color-scheme: light)" srcset="docs/example-widget-light-v6.png" />
  <img src="docs/example-widget-light-v6.png" alt="Cred demo showing fictional reviews for an example bike shop" />
</picture>

The demo is the starter. You get the same working widget, example reviews, photos and theme, ready to make your own.

## Make your own

<a href="https://github.com/bristweb/cred-starter/generate"><img src="https://img.shields.io/badge/Create_from_template-238636?style=for-the-badge&logo=github&logoColor=white" alt="Create from template" /></a>

1. **Create your repository** with the button above. Choose a name and public or private.
2. **Make your changes in GitHub.** Edit `data/config.js` for your business, replace the example reviews in `data/reviews/`, and add your images and colors in `data/assets/` and `data/theme/`. No local install.
3. **Publish and embed.** Follow [your starter's publishing guide](https://github.com/bristweb/cred-starter#publish-it), then paste this into your website with your published address (replace `EXAMPLE.COM`):

```html
<script src="https://EXAMPLE.COM/package/assets/js/cred.js" defer></script>
```

The bike shop and its reviews are fictional. Replace the examples before using them as your business's reviews.

## Get Cred updates

In your repository, run **Actions → Update Cred package** with a [release tag](https://github.com/bristweb/cred/releases). Review and merge the pull request. It updates only `package/`, leaving your reviews, pages and README alone.

## Need a little more help?

- [Publishing](https://github.com/bristweb/cred-starter#publish-it) — GitHub Pages or Cloudflare Pages, including private repositories.
- [Data format](docs/REFERENCE.md#data-format) — business details, reviews, images and themes.
- [Embed and options](docs/REFERENCE.md#embed) — website builders, iframes, layouts and light or dark mode.
- [Full reference](docs/REFERENCE.md) — validation, updates, structured data and advanced settings.
- [Product comparison](docs/COMPARISON.md) · [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE). Free to use, host and customize.
