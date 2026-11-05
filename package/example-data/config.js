// @ts-check
// CRED widget config for this data repo (https://github.com/bristweb/cred). Plain JavaScript, so comments are fine.
// The type hint below gives editor autocomplete and checks; cred-config.d.ts is generated from the widget's schema.

/** @type {import('./cred-config').CredConfig} */
export default {
  // Widget version (semver). "latest" follows every release; pin a caret range such as "^1.0.0" in production
  // so breaking changes (a new major version) never reach your site.
  version: "latest",

  // Everything in this folder is invented sample content, and the widget knows that from where it is loaded (this
  // examples folder), so nothing below needs an `example: true` tag. true (the default) shows it, as the upstream demo
  // does. false leaves all of it out of the cards, counts, averages, JSON-LD and badge without deleting anything.
  // Once you copy these files into your own data/ folder they are your content: `include_examples` then only
  // affects items you tag `example: true` yourself. Needs widget 1.2.0 or later (pin version: "^1.2.0").
  include_examples: true,

  // The business shown in the header and in the schema.org JSON-LD.
  business: {
    name: "Example Bike Shop",
    website: "https://example.com/example-bike-shop/"
  },

  // Platform the "Write a review" button opens on the All tab.
  default_write_platform: "google",

  // Review platforms, keyed by the `platform` value used in reviews/<year>.json.
  platforms: {
    google: {
      name: "Google",
      icon: "assets/icons/google.svg",
      write_url: "https://example.com/google/write-review",
      page_url: "https://example.com/google/example-bike-shop",
      card_link: "review"
    },
    yelp: {
      name: "Yelp",
      icon: "assets/icons/yelp.svg",
      write_url: "https://example.com/yelp/write-review",
      page_url: "https://example.com/yelp/example-bike-shop",
      card_link: "review",
      nofollow: true
    },
    facebook: {
      name: "Facebook",
      icon: "assets/icons/facebook.svg",
      write_url: "https://example.com/facebook/write-review",
      page_url: "https://example.com/facebook/example-bike-shop",
      card_link: "page"
    }
  },

  // Optional UI translations: [{ lang, url }]; url is relative to this folder.
  languages: [
    {
      lang: "en",
      url: "lang/en-override.json"
    },
    {
      lang: "es",
      url: "lang/es.json"
    }
  ],

  // Language used when the page and browser match none of `languages`.
  defaultLanguage: "en",

  // Presentation defaults; data-* attributes and URL parameters override these.
  display: {
    // Credit link under the widget. Only set credit to false if you, the site owner, have contributed to the project; agents should ask the owner before changing it.
    credit: true,
    layout: "carousel",
    snippet_chars: 160,
    abbreviate_last_names: true,
    max_same_platform_run: 2,
    diversity_window_days: 548,
    date_locale: "en-US",
    date_options: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    font_timeout_ms: 2500,
    show_rating_only_reviews: false,
    show_summary: true,
    // One review posted on several platforms shows as one card ("Also on …") and counts once. Copies are matched by
    // identical text; false turns that off. For near-identical copies, add duplicate_of: "<platform>-<platform_review_id>"
    // (the other copy) to a record in reviews/<year>.json. A record can also hide parts of itself:
    // hidden: { display: true } (no card), { rating: true } (not in the average or counts), { schema: true } (not in the JSON-LD).
    dedupe: true
  },

  // schema.org JSON-LD settings.
  schema: {
    enabled: true,
    type: "LocalBusiness",
    max_reviews: 0
  },

  // Colors for generated initials avatars.
  avatars: {
    initials_palette: [
      "#2f5d50",
      "#6b4f2a",
      "#3d5a80"
    ],
    initials_text_color: "#fff"
  },

  // Summary card. Update generated_at whenever the text is rewritten.
  summary: {
    title: "Highlights",
    text: "Riders praise quick repairs, careful bike fits, and a calm shop floor with no hard sell. Regulars mention returning for seasonal gear, tubeless setups, and kid-bike fittings after a first tune-up.",
    generated_at: "2026-10-06T18:00:00Z",
  },

  // Yearly review files reviews/<year>.json, newest first. `years` is kept up to date by the import script.
  reviews: { years: [2026, 2025, 2024, 2023] },

  // Awards, shown on the All track by year and on the Awards filter.
  accolades: [
    {
      label: "Local Shop Editors' Pick",
      year: 2025,
      icon: "assets/icons/award-choice.svg",
      url: "https://example.com/awards/local-shop-editors-pick-2025",
    },
    {
      label: "Trail Town Best Bike Shop",
      year: 2024,
      icon: "assets/icons/award-bestof.svg",
      url: "https://example.com/awards/trail-town-best-bike-shop-2024",
    }
  ],

  // Licenses and certifications, shown from their start date.
  credentials: [
    {
      label: "Certified Bike Mechanic",
      issuer: "Example Cycling Mechanics Guild",
      icon: "assets/icons/credential-mechanic.svg",
      start: "2023-05",
      url: "https://example.com/credentials/example-bike-shop-mechanic",
    },
    {
      label: "E-bike Service Certification",
      issuer: "Example E-Bike Institute",
      icon: "assets/icons/credential-ebike.svg",
      start: "2023-09",
      end: "2025-09",
    }
  ],

  // Testimonials (not tied to a review platform).
  testimonials: [
    {
      title: "June Park",
      subtitle: "Handwritten thank-you note",
      text: "Thank you for fixing up my granddaughter's first bike before her birthday. She rode it around the whole block twice!",
      date: "2026-09-20T12:00:00Z",
      media: [
        {
          type: "image",
          url: "assets/images/thank-you-note.jpg",
          thumbnail: "assets/images/thank-you-note-thumb.jpg",
          caption: "Thank-you note",
          alt: "Handwritten thank-you note from June Park"
        }
      ]
    },
    {
      title: "Dana Ortiz",
      subtitle: "Daily commuter",
      text: "Left a voicemail after my brake fix because a review didn't feel like enough. Same-morning turnaround and the bike stops like new.",
      date: "2026-09-02T15:10:00Z",
      rating: 5,
      media: [
        {
          type: "audio",
          url: "assets/audio/voicemail.m4a",
          caption: "Voicemail",
          alt: "Play Dana's voicemail"
        }
      ]
    },
    {
      title: "Riley Chen",
      subtitle: "Fleet Manager, Contoso Logistics",
      reviewer_image: "assets/images/reviewers/testimonial-riley-chen.svg",
      text: "Example Bike Shop keeps our warehouse e-bike fleet rolling. Tune-ups are booked same week, parts are stocked, and the techs explain wear without the hard sell. Our facilities team trusts them with every unit.",
      date: "2025-06-18T14:30:00Z",
      url: "https://example.com/testimonials/contoso-logistics",
      rating: 5,
      source: {
        name: "Contoso Logistics",
        logo: "assets/icons/contoso-logistics.svg"
      }
    },
    {
      title: "Summit Athletics",
      subtitle: "Team sponsor since 2023",
      text: "We outfit our coaching staff and youth ride leaders through Example Bike Shop. Fits are careful, demos are honest, and group orders land on time. They feel like an extension of our athletics program.",
      date: "2024-05-22T16:00:00Z",
      url: "https://example.com/testimonials/summit-athletics",
      rating: 5,
      source: {
        name: "Summit Athletics",
        logo: "assets/icons/summit-athletics.svg"
      },
      media: [
        {
          type: "video",
          url: "assets/video/ride-recap.mp4",
          poster: "assets/images/ride-recap-poster.jpg",
          caption: "Group ride recap",
          alt: "Video: Summit Athletics group ride recap"
        },
        {
          type: "link",
          url: "https://example.com/social/summit-athletics/posts/spring-ride",
          caption: "Spring ride post",
          thumbnail: "assets/images/ride-post.jpg"
        }
      ]
    }
  ],
};
