// @ts-check
// CRED widget config for this data repo (https://github.com/bristweb/cred). Plain JavaScript, so comments are fine.
// The type hint below gives editor autocomplete and checks; cred-config.d.ts is generated from the widget's schema.

/** @type {import('./cred-config').CredConfig} */
export default {
  // Widget version (semver). "latest" follows every release; pin a caret range such as "^1.0.0" in production
  // so breaking changes (a new major version) never reach your site.
  version: "latest",

  // The business shown in the header and in the schema.org JSON-LD.
  business: {
    name: "Northwind Cycles",
    website: "https://example.com/northwind-cycles/"
  },

  // Platform the "Write a review" button opens on the All tab.
  default_write_platform: "google",

  // Review platforms, keyed by the `platform` value used in reviews/<year>.json.
  platforms: {
    google: {
      name: "Google",
      icon: "icons/google.svg",
      write_url: "https://example.com/google/write-review",
      page_url: "https://example.com/google/northwind-cycles",
      card_link: "review"
    },
    yelp: {
      name: "Yelp",
      icon: "icons/yelp.svg",
      write_url: "https://example.com/yelp/write-review",
      page_url: "https://example.com/yelp/northwind-cycles",
      card_link: "review",
      nofollow: true
    },
    facebook: {
      name: "Facebook",
      icon: "icons/facebook.svg",
      write_url: "https://example.com/facebook/write-review",
      page_url: "https://example.com/facebook/northwind-cycles",
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
    show_summary: true
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
    generated_at: "2026-10-06T18:00:00Z"
  },

  // Yearly review files reviews/<year>.json, newest first. `years` is kept up to date by the import script.
  reviews: { years: [2026, 2025, 2024, 2023] },

  // Awards, shown on the All track by year and on the Awards filter.
  accolades: [
    {
      label: "Local Shop Editors' Pick",
      year: 2025,
      icon: "icons/award-choice.svg",
      url: "https://example.com/awards/local-shop-editors-pick-2025"
    },
    {
      label: "Trail Town Best Bike Shop",
      year: 2024,
      icon: "icons/award-bestof.svg",
      url: "https://example.com/awards/trail-town-best-bike-shop-2024"
    }
  ],

  // Licenses and certifications, shown from their start date.
  credentials: [
    {
      label: "Certified Bike Mechanic",
      issuer: "Example Cycling Mechanics Guild",
      icon: "icons/credential-mechanic.svg",
      start: "2023-05",
      url: "https://example.com/credentials/northwind-cycles-mechanic"
    },
    {
      label: "E-bike Service Certification",
      issuer: "Example E-Bike Institute",
      icon: "icons/credential-ebike.svg",
      start: "2023-09",
      end: "2025-09"
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
          url: "media/thank-you-note.jpg",
          thumbnail: "media/thank-you-note-thumb.jpg",
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
          url: "media/voicemail.m4a",
          caption: "Voicemail",
          alt: "Play Dana's voicemail"
        }
      ]
    },
    {
      title: "Riley Chen",
      subtitle: "Fleet Manager, Contoso Logistics",
      reviewer_image: "images/reviewers/testimonial-riley-chen.svg",
      text: "Northwind keeps our warehouse e-bike fleet rolling. Tune-ups are booked same week, parts are stocked, and the techs explain wear without the hard sell. Our facilities team trusts them with every unit.",
      date: "2025-06-18T14:30:00Z",
      url: "https://example.com/testimonials/contoso-logistics",
      rating: 5,
      source: {
        name: "Contoso Logistics",
        logo: "icons/contoso-logistics.svg"
      }
    },
    {
      title: "Summit Athletics",
      subtitle: "Team sponsor since 2023",
      text: "We outfit our coaching staff and youth ride leaders through Northwind. Fits are careful, demos are honest, and group orders land on time. They feel like an extension of our athletics program.",
      date: "2024-05-22T16:00:00Z",
      url: "https://example.com/testimonials/summit-athletics",
      rating: 5,
      source: {
        name: "Summit Athletics",
        logo: "icons/summit-athletics.svg"
      },
      media: [
        {
          type: "video",
          url: "media/ride-recap.mp4",
          poster: "media/ride-recap-poster.jpg",
          caption: "Group ride recap",
          alt: "Video: Summit Athletics group ride recap"
        },
        {
          type: "link",
          url: "https://example.com/social/summit-athletics/posts/spring-ride",
          caption: "Spring ride post",
          thumbnail: "media/ride-post.jpg"
        }
      ]
    }
  ],
};
