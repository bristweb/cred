// Generated from schemas/config.schema.json (npm run types). Types for a CRED data repo config.js.

/**
 * CRED data repo config (config.js default export).
 */
export interface CredConfig {
  /**
   * Widget version to load (semver, full major.minor.patch): exact "1.0.2", caret "^1.0.0" (same major), tilde "~1.0.0" (same minor), or "latest" (default). Pin a caret range in production.
   */
  version?: string;
  business: {
    name: string;
    website?: string;
    [k: string]: unknown;
  };
  default_write_platform?: string;
  platforms: {
    [k: string]: {
      name: string;
      icon?: string;
      simple_icon?: string;
      write_url?: string;
      page_url?: string;
      card_link?: "review" | "page";
      invert_icon_when_active?: boolean;
      /**
       * When true, outbound write/card links for this platform include rel=nofollow (noopener is always kept).
       */
      nofollow?: boolean;
      /**
       * When true, outbound write/card links for this platform include rel=noreferrer (noopener is always kept).
       */
      noreferrer?: boolean;
      /**
       * Optional space-separated rel tokens for outbound links (e.g. "nofollow noreferrer"). Booleans nofollow/noreferrer override matching tokens when set. noopener is always applied.
       */
      rel?: string;
      [k: string]: unknown;
    };
  };
  links?: {
    platform?: string;
    name?: string;
    icon?: string;
    linked_url?: string;
    [k: string]: unknown;
  }[];
  display?: {
    /**
     * Color scheme. auto = follow host page theme (data-theme/class/color-scheme); light|dark force.
     */
    theme?: "light" | "dark" | "auto";
    /**
     * Optional max edge (px) for accolade logos in badge cards. Omit or 0 = fill the card’s free space (with padding). Positive values cap the logo. One global setting — no per-item size/width/height.
     */
    accolade_size?: number;
    /**
     * Hide rated reviews (and rated testimonials) below this star rating. Omit to show all. Unrated reviews and accolades are unaffected. Hidden reviews are not counted, averaged or included in the JSON-LD. Overridden by data-min-rating / ?min_rating=.
     */
    min_rating?: number;
    /**
     * Review keys to hide, each <platform>-<platform_review_id> (the reviewer image file name convention). Hidden reviews stay in the data but are not shown, counted, averaged or included in the JSON-LD. data-hide / ?hide= (comma-separated) add to this list.
     */
    hide?: string[];
    /**
     * Optional icon for the Awards filter pill: path relative to the data root or an absolute URL (SVG or image, shown at the platform icon size). Omit to use the built-in trophy icon.
     */
    accolades_icon?: string;
    /**
     * Optional icon for the Testimonials filter pill: path relative to the data root or an absolute URL (SVG or image, shown at the platform icon size). Omit to use the built-in quote bubble icon.
     */
    testimonials_icon?: string;
    /**
     * Optional icon for the Credentials filter pill: path relative to the data root or an absolute URL. Omit to use the built-in badge icon.
     */
    credentials_icon?: string;
    [k: string]: unknown;
  };
  schema?: {
    enabled?: boolean;
    type?: string;
    max_reviews?: number;
    extra?: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  rating_labels?: {
    min: number;
    label: string;
    [k: string]: unknown;
  }[];
  /**
   * Translation catalogs as { lang, url }. lang is an ISO language tag (en, en-us, es, …); url is absolute or relative to the data root. Partial catalogs are fine; missing keys fall through to the widget's lang/en.json.
   */
  languages?: {
    /**
     * ISO language tag for this catalog (matched against data-lang / browser / defaultLanguage).
     */
    lang: string;
    /**
     * Absolute URL or path relative to the data root for the translation JSON.
     */
    url: string;
    [k: string]: unknown;
  }[];
  /**
   * ISO code or primary subtag used when embed/page/browser do not match a languages[].lang entry. Matched against languages the same way; if nothing matches, the widget English catalog is used.
   */
  defaultLanguage?: string;
  /**
   * Inline UI copy overrides (merged on top of the selected language file and the widget's lang/en.json).
   */
  strings?: {
    [k: string]: string;
  };
  avatars?: {
    initials_palette?: string[];
    initials_text_color?: string;
    [k: string]: unknown;
  };
  /**
   * Summary card shown first on the All tab. text + generated_at required; optional title overrides the language headline.
   */
  summary?: {
    text: string;
    generated_at: string;
    /**
     * Optional card headline for the summary card. Falls back to language/strings ai_summary (e.g. Highlights / Summary).
     */
    title?: string;
    [k: string]: unknown;
  };
  reviews: {
    years: number[];
    [k: string]: unknown;
  };
  sources?: {
    [k: string]: unknown;
  };
  /**
   * Optional award badge cards merged into the review track by date on the All tab (and listed alone on the Awards tab when present; platform filters omit them). Each item sorts as YYYY-12-31 so it leads that year (newest first). When any accolades exist, at least one appears before the first review (newest award promoted if its year is older than the newest review). Each item needs year plus icon and/or freeform label (name is an alias). Optional url: when set the card is a link with a View award cue; when omitted the card is not clickable and has no footer cue. Logo fills the card free space by default; optional global max via display.accolade_size. Same optional nofollow/noreferrer/rel as platforms.
   */
  accolades?: {
    [k: string]: unknown;
  }[];
  /**
   * Optional testimonial cards merged into the review track by date (newest first) on the All tab, like accolades. Not tied to a review platform. When present, a Testimonials filter tab lists only these cards. Platform filters omit them. Each item needs title, text, and date; optional subtitle. Optional url (when set the card links with a footer cue; when omitted not clickable and no footer cue), link_text (footer cue when url is set; default Learn more / strings.view_testimonial), rating (1–5), reviewer_image. Optional source: if set, name is required; source.logo (when set) replaces the usual platform icon and is shown in the avatar position (reviewer image moves secondary). Same optional nofollow/noreferrer/rel as platforms.
   */
  testimonials?: {
    /**
     * Card title, shown like a reviewer name (not abbreviated). Freeform: a person, a team, a company.
     */
    title: string;
    /**
     * Optional second line under the title, less prominent (e.g. role and company, or "Team sponsor since 2023"). Not filled in from source.name.
     */
    subtitle?: string;
    /**
     * Optional avatar URL or path relative to the data root (initials of the title when omitted). Secondary when source.logo is set.
     */
    reviewer_image?: string;
    text: string;
    date: string;
    /**
     * Optional outbound link for the card. When omitted, the card is not a link.
     */
    url?: string;
    /**
     * Optional footer link cue when url is set. Overrides strings.view_testimonial (default Learn more). Use when the destination is not the quote itself (e.g. company site).
     */
    link_text?: string;
    rating?: number | null;
    /**
     * Optional organization: logo shown in the avatar slot when set; name is used in the card's accessible label when there is no subtitle (it is not shown as a visible line). name required when source is present.
     */
    source?: {
      name: string;
      /**
       * URL or path relative to the data root. Shown in the avatar position when set; reviewer_image becomes secondary.
       */
      logo?: string;
      [k: string]: unknown;
    };
    nofollow?: boolean;
    noreferrer?: boolean;
    /**
     * Optional space-separated rel tokens; same rules as platforms.*.rel.
     */
    rel?: string;
    /**
     * Optional. Exact passage of text shown on the card instead of the opening characters (same rules as reviews).
     */
    excerpt?: string;
    /**
     * Optional media shown as the card's content instead of visible quote text (the text stays in the page, visually hidden, and is the image alt text). The first item fills the card; others are small image chips. Each is an image with an icon overlay and no visible label: image (opens a lightbox), audio (plays below the image), video (poster; opens a lightbox player), link (opens the post). Without thumbnail/poster, audio, video and link use a neutral default image. A card with media is not itself a link; its url becomes the footer link.
     */
    media?: {
      type: "image" | "audio" | "video" | "link";
      /**
       * URL or path relative to the data root.
       */
      url: string;
      /**
       * Optional preview image (any type; e.g. a post screenshot for link, a cover for audio).
       */
      thumbnail?: string;
      /**
       * Optional video poster image (also used as the thumbnail).
       */
      poster?: string;
      /**
       * Optional short label, used as the accessible name and tooltip (not shown as text).
       */
      caption?: string;
      /**
       * Optional accessible name; overrides caption.
       */
      alt?: string;
      nofollow?: boolean;
      noreferrer?: boolean;
      rel?: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
  /**
   * Optional settings for the rating badge files written by scripts/badge.mjs (badge.json for shields.io, badge.svg).
   */
  badge?: {
    /**
     * Left-hand badge text. Default rating.
     */
    label?: string;
    [k: string]: unknown;
  };
  /**
   * Optional licenses, certifications and other credentials. Cards are placed on the All track by start date (so a long-held license sits where it began), and listed alone on the Credentials tab. Each card shows its date range: Since <start>, or <start>–<end>. Not counted in ratings or the JSON-LD.
   */
  credentials?: {
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
