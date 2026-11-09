# Comparison

A comparison of Cred's open-source, static reviews widget with hosted review widgets, reputation-management suites, and review platforms that sell their own badges and widgets (such as Trustpilot and ProvenExpert). Google and Yelp appear as source rows in the platform table, not as product columns. Features and plans change; check each vendor's current documentation.

**Key**

| | Meaning |
|---|---|
| ✅ | Built-in or a normal part of the product |
| 🟡 | Partial — limits, paid tiers, add-ons, or a different product shape |
| ❌ | Not offered, or not the product’s model |

Columns: **CRED** first; other products sorted by score (✅×2 + 🟡) on that table, high to low. Superscripts point to short notes under the table.

| Feature | **CRED** | [Birdeye](https://birdeye.com/) | [Reputation.com](https://reputation.com/) | [EmbedSocial](https://embedsocial.com/review-widget/) | [Trustpilot](https://www.trustpilot.com/) | [Podium](https://www.podium.com/) | [ProvenExpert](https://www.provenexpert.com/) | [Elfsight](https://elfsight.com/all-in-one-reviews-widget/) | [Tagembed](https://tagembed.com/) | [SociableKIT](https://www.sociablekit.com/) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Self-hosted** (you serve the embed) | ✅¹ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Free to run** at modest traffic | ✅² | ❌ | ❌ | 🟡 | 🟡 | ❌ | 🟡 | 🟡³ | 🟡 | 🟡 |
| **Static files** (no vendor server for the widget) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Full copy of the review data you display** | ✅⁴ | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 |
| **No vendor account** to show reviews on your site | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **schema.org JSON-LD** on the host page | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ | 🟡 | 🟡 |
| **Summary card** on the site | ✅⁶ | ✅ | ✅ | ✅⁷ | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | ❌ |
| **Custom theme** (your fonts / colors / CSS) | ✅ | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 |
| **Sync / collection you control** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Multi-source aggregate widget** | ✅ | ✅ | ✅ | ✅⁹ | 🟡¹¹ | ✅ | 🟡 | ✅⁸ | ✅ | ✅ |
| **Review request / outreach** | ❌ | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Inbox / respond across platforms** | 🟡¹⁴ | ✅ | ✅ | 🟡 | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ |
| **Vendor lock-in for the on-site widget** | ❌¹² | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Notes**

1. Static files; e.g. GitHub Pages or any static host.
2. e.g. GitHub Pages or another free static host.
3. Free tiers usually mean view caps and/or vendor branding.
4. Your data repo (or folder) is the copy the widget reads.
6. Summary text you store in `config.js` (labeled “Summary” in the widget).
7. AI summaries / tagging on higher plans.
8. 30+ review sources.
9. Google, Facebook, Trustpilot, Yelp, and more.
11. Trustpilot-first; third-party re-embeds are restricted.
12. Plain JSON + JS you can edit and host yourself; no service account required.
14. No built-in inbox or reply UI — but you keep the full review records (including stored owner replies), so you can build your own response / follow-up workflows on top of that data.

### Review / social platforms you can show

Cred can display records from **any platform** if you supply them in its data format, manually or through your own tools. Its checkmarks mean display support, not built-in collection or sync. For other products, the table covers built-in connectors and official integrations across 100+ review, directory, marketplace, app-store, B2B and social sources.

| Platform | **CRED** | Birdeye | SociableKIT | Reputation.com | Elfsight | Podium | Tagembed | EmbedSocial | ProvenExpert | Trustpilot |
|---|---|---|---|---|---|---|---|---|---|---|
| Google Maps / Business Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ |
| Yelp | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡¹⁵ | ❌ | ❌ |
| Facebook | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ |
| BBB | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| Yellow Pages | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Citysearch | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Foursquare | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Superpages | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hotfrog | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cylex | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Golocal247 | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Nextdoor | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TripAdvisor | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | ❌ |
| Booking.com | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ |
| Airbnb | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | ❌ |
| Expedia | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hotels.com | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vrbo | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Agoda | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kayak | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Orbitz | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Travelocity | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Priceline | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| HolidayCheck | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TheFork | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| OpenTable | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| Resy | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DoorDash | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Uber Eats | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Grubhub | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Deliveroo | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Just Eat | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Postmates | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Amazon¹⁶ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ |
| Etsy | ✅ | 🟡 | ✅ | 🟡 | ✅ | ❌ | 🟡 | 🟡 | ❌ | ❌ |
| eBay | ✅ | 🟡 | ✅ | 🟡 | ✅ | ❌ | 🟡 | 🟡 | ❌ | ❌ |
| AliExpress | ✅ | 🟡 | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Walmart | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Target | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Best Buy | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Shopify App Store | ✅ | 🟡 | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Flipkart | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bol.com | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Newegg | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Costco | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wayfair | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apple App Store | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ |
| Google Play | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ |
| Microsoft Store | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Samsung Galaxy Store | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| G2 | ✅ | 🟡 | ✅ | 🟡 | ✅ | ❌ | 🟡 | ❌ | ❌ | ❌ |
| Capterra | ✅ | 🟡 | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TrustRadius | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GetApp | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Software Advice | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Product Hunt | ✅ | 🟡 | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clutch | ✅ | 🟡 | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| The Manifest | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DesignRush | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sortlist | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PeerSpot | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gartner Peer Insights | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Slashdot | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AlternativeTo | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| FinancesOnline | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Trustpilot¹⁷ | ✅ | 🟡 | ✅ | 🟡 | 🟡 | ❌ | 🟡 | ✅ | ❌ | ✅ |
| ProvenExpert | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Sitejabber | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reviews.io | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Feefo | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ResellerRatings | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Trusted Shops | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ConsumerAffairs | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reviewcentre | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ProductReview.com.au | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Angi | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| HomeAdvisor | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| Thumbtack | ✅ | ✅ | ✅ | ✅ | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| Bark | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Houzz | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ |
| Checkatrade | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hipages | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| HomeStars | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TaskRabbit | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zola | ✅ | 🟡 | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| WeddingWire | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| The Knot | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Here Comes The Guide | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Joy | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DealerRater | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edmunds | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cars.com | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| CarGurus | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Autotrader | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Carfax | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kelly Blue Book | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Healthgrades | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vitals | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| RateMDs | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zocdoc | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| WebMD | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Caring.com | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| A Place for Mom | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| FertilityIQ | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Psychology Today | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| RealSelf | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Avvo | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Martindale | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lawyers.com | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| FindLaw | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Justia | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Glassdoor | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Indeed | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Comparably | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kununu | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Blind | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zillow | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apartments.com | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ApartmentRatings | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Realtor.com | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Redfin | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GreatSchools | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Niche | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rate My Professors | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Course Report | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| LinkedIn | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TikTok | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| YouTube | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Steam | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Goodreads | ✅ | 🟡 | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Influenster | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Weedmaps | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ClassPass | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| LendingTree | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Credit Karma | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bass Pro / Cabela's | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Michaels | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

15. Yelp via EmbedSocial is capped (about three random reviews per business) because of Yelp’s API limits.
16. Amazon often needs a manual / CSV-style import on several hosted widgets; not always a full live API sync.
17. Trustpilot generally does not allow third-party widgets to re-embed Trustpilot reviews; use Trustpilot’s own embeds or store a copy yourself (as with this widget).

Vendor entries are based on public documentation and connector lists and may change. Here, 🟡 can mean partial support, a paid tier, manual import, monitoring only or an API limit. Elfsight also offers a custom/manual source; unlisted connectors remain ❌ because manual entry is not live sync.

### Reading the columns

Each table sorts competitor columns by its own score (**✅ × 2 + 🟡**), so their order can differ. CRED is always first.

- **CRED** is the on-site display layer and data format. Collection and owner-reply workflows belong in your own tooling; there is no built-in inbox.
- **Birdeye**, **Reputation.com**, **Podium** — reputation-management and messaging suites. They include widgets, but focus on listings, outreach and a shared inbox.
- **Trustpilot**, **ProvenExpert** — review platforms that sell their own badges and widgets, rather than self-hosted multi-source carousels.
- **Elfsight**, **EmbedSocial**, **SociableKIT**, **Tagembed** — hosted widgets that combine reviews from sources such as Google and Yelp.

Corrections welcome via PR.
