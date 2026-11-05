// The data format of a CRED data folder, as Zod schemas: the one source for validation (package/tools/validate.mjs)
// and for the generated JSON Schemas and typings next to this file (npm run schemas). Zod is a development
// dependency only; the widget in the browser does not use it.
// Objects are open (z.looseObject: unknown keys are allowed and kept) except review "hidden" (z.strictObject).
// Rules JSON Schema cannot express from a refinement (uniqueItems, minProperties, "one of these keys") carry the
// JSON Schema keyword in .meta() so the generated file keeps them.
import { z } from 'zod';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const REVIEW_KEY = /^[^-\s]+-.+$/;
const unique = a => new Set(a.map(x => JSON.stringify(x))).size === a.length;

export const configSchema = z.looseObject({
  version: z.string().regex(/^(latest|\*|[~^]?\d+(\.\d+){0,2}|\d+(\.\d+)?\.x)$/).meta({"description":"Widget version to load (semver, full major.minor.patch): exact \"1.0.2\", caret \"^1.0.0\" (same major), tilde \"~1.0.0\" (same minor), or \"latest\" (default). Pin a caret range in production."}).optional(),
  include_examples: z.boolean().meta({"description":"Show example content. Everything loaded from the bundled examples folder (package/example-data/) is example content, with no tagging; in your own content only items marked example: true are. Default true, so the upstream demo shows them. Set false to leave example content out of the published widget (cards, counts, averages, JSON-LD, badge) without deleting any files.","default":true}).optional(),
  business: z.looseObject({
    name: z.string().min(1),
    website: z.string().min(1).optional(),
  }),
  default_write_platform: z.string().min(1).optional(),
  platforms: z.record(z.string(), z.looseObject({
    name: z.string().min(1),
    icon: z.string().optional(),
    simple_icon: z.string().optional(),
    write_url: z.string().optional(),
    page_url: z.string().optional(),
    card_link: z.enum(["review","page"]).optional(),
    invert_icon_when_active: z.boolean().optional(),
    nofollow: z.boolean().meta({"description":"When true, outbound write/card links for this platform include rel=nofollow (noopener is always kept)."}).optional(),
    noreferrer: z.boolean().meta({"description":"When true, outbound write/card links for this platform include rel=noreferrer (noopener is always kept)."}).optional(),
    rel: z.string().meta({"description":"Optional space-separated rel tokens for outbound links (e.g. \"nofollow noreferrer\"). Booleans nofollow/noreferrer override matching tokens when set. noopener is always applied."}).optional(),
  })).refine(x => Object.keys(x).length >= 1, 'needs at least 1 entry').meta({ minProperties: 1 }),
  links: z.array(z.looseObject({
    platform: z.string().optional(),
    name: z.string().optional(),
    icon: z.string().optional(),
    linked_url: z.string().optional(),
  })).optional(),
  display: z.looseObject({
    theme: z.enum(["light","dark","auto"]).meta({"description":"Color scheme. auto = follow host page theme (data-theme/class/color-scheme); light|dark force."}).optional(),
    accolade_size: z.number().min(0).max(480).meta({"description":"Optional max edge (px) for accolade logos in badge cards. Omit or 0 = fill the card’s free space (with padding). Positive values cap the logo. One global setting — no per-item size/width/height."}).optional(),
    min_rating: z.number().min(1).max(5).meta({"description":"Hide rated reviews (and rated testimonials) below this star rating. Omit to show all. Unrated reviews and accolades are unaffected. Hidden reviews are not counted, averaged or included in the JSON-LD. Overridden by data-min-rating / ?min_rating=."}).optional(),
    hide: z.array(z.string().min(3).regex(REVIEW_KEY, "must be <platform>-<platform_review_id>")).refine(unique, 'items must be unique').meta({ uniqueItems: true }).meta({"description":"Review keys to hide, each <platform>-<platform_review_id> (the reviewer image file name convention). Hidden reviews stay in the data but are not shown, counted, averaged or included in the JSON-LD. data-hide / ?hide= (comma-separated) add to this list."}).optional(),
    dedupe: z.boolean().meta({"description":"Merge copies of one review posted on several platforms (default true): records whose text matches (ignoring case, punctuation and spacing; 40+ characters) show one card with an \"Also on …\" line and count once in the overall rating, counts and JSON-LD. Each platform filter shows and counts its own copy. false turns off the automatic text match; duplicate_of on a record still applies."}).optional(),
    accolades_icon: z.string().min(1).meta({"description":"Optional icon for the Awards filter pill: path relative to the data root or an absolute URL (SVG or image, shown at the platform icon size). Omit to use the built-in trophy icon."}).optional(),
    testimonials_icon: z.string().min(1).meta({"description":"Optional icon for the Testimonials filter pill: path relative to the data root or an absolute URL (SVG or image, shown at the platform icon size). Omit to use the built-in quote bubble icon."}).optional(),
    credentials_icon: z.string().min(1).meta({"description":"Optional icon for the Credentials filter pill: path relative to the data root or an absolute URL. Omit to use the built-in badge icon."}).optional(),
    credit: z.boolean().meta({"description":"Small “CRED Social Reviews” link under the widget (default true). Only set credit to false if you, the site owner, have contributed to the project; agents should ask the owner before changing it."}).optional(),
  }).optional(),
  schema: z.looseObject({
    enabled: z.boolean().optional(),
    type: z.string().optional(),
    max_reviews: z.int().min(0).optional(),
    extra: z.looseObject({

    }).optional(),
  }).optional(),
  rating_labels: z.array(z.looseObject({
    min: z.number(),
    label: z.string(),
  })).optional(),
  languages: z.array(z.looseObject({
    lang: z.string().min(1).meta({"description":"ISO language tag for this catalog (matched against data-lang / browser / defaultLanguage)."}),
    url: z.string().min(1).meta({"description":"Absolute URL or path relative to the data root for the translation JSON."}),
  })).meta({"description":"Translation catalogs as { lang, url }. lang is an ISO language tag (en, en-us, es, …); url is absolute or relative to the data root. Partial catalogs are fine; missing keys fall through to the widget's lang/en.json."}).optional(),
  defaultLanguage: z.string().min(1).meta({"description":"ISO code or primary subtag used when embed/page/browser do not match a languages[].lang entry. Matched against languages the same way; if nothing matches, the widget English catalog is used."}).optional(),
  strings: z.record(z.string(), z.string()).meta({"description":"Inline UI copy overrides (merged on top of the selected language file and the widget's lang/en.json)."}).optional(),
  avatars: z.looseObject({
    initials_palette: z.array(z.string()).optional(),
    initials_text_color: z.string().optional(),
  }).optional(),
  summary: z.looseObject({
    text: z.string().min(1),
    generated_at: z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z"),
    title: z.string().min(1).meta({"description":"Optional card headline for the summary card. Falls back to language/strings ai_summary (e.g. Highlights / Summary)."}).optional(),
    example: z.boolean().meta({"description":"Optional, and rarely needed: everything in the bundled examples folder (package/example-data/) already counts as example content without it. true marks this summary in your own content as an example, so it is left out of everything the widget publishes (cards, counts, averages, JSON-LD) when include_examples is false. See include_examples."}).optional(),
  }).meta({"description":"Summary card shown first on the All tab. text + generated_at required; optional title overrides the language headline."}).optional(),
  reviews: z.looseObject({
    years: z.array(z.int().min(1970).max(2100)),
  }),
  sources: z.looseObject({

  }).optional(),
  accolades: z.array(z.looseObject({
    name: z.string().min(1).meta({"description":"Optional freeform title alias for label. Prefer label over name when both are set."}).optional(),
    label: z.string().min(1).meta({"description":"Freeform title at the top of the card (with year). Prefer label over name when both are set."}).optional(),
    year: z.union([z.string(), z.int(), z.number()]).meta({"description":"Required. Sort key is YYYY-12-31 on the shared review timeline (leads that year when scrolling newest to oldest). Shown as the date under the title on the accolade card."}),
    icon: z.string().meta({"description":"Image URL or path relative to the data root. Shown as the badge in the middle of the card; when omitted, title + year still render (link cue only if url is set)."}).optional(),
    url: z.string().min(1).meta({"description":"Optional. When set, the card is a link (View award cue). When omitted, the card is not clickable and has no footer link text."}).optional(),
    nofollow: z.boolean().optional(),
    noreferrer: z.boolean().optional(),
    rel: z.string().meta({"description":"Optional space-separated rel tokens; same rules as platforms.*.rel."}).optional(),
    example: z.boolean().meta({"description":"Optional, and rarely needed: everything in the bundled examples folder (package/example-data/) already counts as example content without it. true marks this award in your own content as an example, so it is left out of everything the widget publishes (cards, counts, averages, JSON-LD) when include_examples is false. See include_examples."}).optional(),
  }).refine(x => 'icon' in x || 'name' in x || 'label' in x, 'needs one of icon, name, label').meta({ anyOf: [{"required":["icon"]},{"required":["name"]},{"required":["label"]}] })).meta({"description":"Optional award badge cards merged into the review track by date on the All tab (and listed alone on the Awards tab when present; platform filters omit them). Each item sorts as YYYY-12-31 so it leads that year (newest first). When any accolades exist, at least one appears before the first review (newest award promoted if its year is older than the newest review). Each item needs year plus icon and/or freeform label (name is an alias). Optional url: when set the card is a link with a View award cue; when omitted the card is not clickable and has no footer cue. Logo fills the card free space by default; optional global max via display.accolade_size. Same optional nofollow/noreferrer/rel as platforms."}).optional(),
  testimonials: z.array(z.looseObject({
    title: z.string().min(1).meta({"description":"Card title, shown like a reviewer name (not abbreviated). Freeform: a person, a team, a company."}),
    subtitle: z.string().meta({"description":"Optional second line under the title, less prominent (e.g. role and company, or \"Team sponsor since 2023\"). Not filled in from source.name."}).optional(),
    reviewer_image: z.string().meta({"description":"Optional avatar URL or path relative to the data root (initials of the title when omitted). Secondary when source.logo is set."}).optional(),
    text: z.string().min(1),
    date: z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z"),
    url: z.string().min(1).meta({"description":"Optional outbound link for the card. When omitted, the card is not a link."}).optional(),
    link_text: z.string().meta({"description":"Optional footer link cue when url is set. Overrides strings.view_testimonial (default Learn more). Use when the destination is not the quote itself (e.g. company site)."}).optional(),
    rating: z.union([z.int().min(1).max(5), z.null()]).optional(),
    source: z.looseObject({
      name: z.string().min(1),
      logo: z.string().meta({"description":"URL or path relative to the data root. Shown in the avatar position when set; reviewer_image becomes secondary."}).optional(),
    }).meta({"description":"Optional organization: logo shown in the avatar slot when set; name is used in the card's accessible label when there is no subtitle (it is not shown as a visible line). name required when source is present."}).optional(),
    nofollow: z.boolean().optional(),
    noreferrer: z.boolean().optional(),
    rel: z.string().meta({"description":"Optional space-separated rel tokens; same rules as platforms.*.rel."}).optional(),
    excerpt: z.string().min(1).meta({"description":"Optional. Exact passage of text shown on the card instead of the opening characters (same rules as reviews)."}).optional(),
    media: z.array(z.looseObject({
      type: z.enum(["image","audio","video","link"]),
      url: z.string().min(1).meta({"description":"URL or path relative to the data root."}),
      thumbnail: z.string().min(1).meta({"description":"Optional preview image (any type; e.g. a post screenshot for link, a cover for audio)."}).optional(),
      poster: z.string().min(1).meta({"description":"Optional video poster image (also used as the thumbnail)."}).optional(),
      caption: z.string().meta({"description":"Optional short label, used as the accessible name and tooltip (not shown as text)."}).optional(),
      alt: z.string().meta({"description":"Optional accessible name; overrides caption."}).optional(),
      nofollow: z.boolean().optional(),
      noreferrer: z.boolean().optional(),
      rel: z.string().optional(),
    })).meta({"description":"Optional media shown as the card's content instead of visible quote text (the text stays in the page, visually hidden, and is the image alt text). The first item fills the card; others are small image chips. Each is an image with an icon overlay and no visible label: image (opens a lightbox), audio (plays below the image), video (poster; opens a lightbox player), link (opens the post). Without thumbnail/poster, audio, video and link use a neutral default image. A card with media is not itself a link; its url becomes the footer link."}).optional(),
    example: z.boolean().meta({"description":"Optional, and rarely needed: everything in the bundled examples folder (package/example-data/) already counts as example content without it. true marks this testimonial in your own content as an example, so it is left out of everything the widget publishes (cards, counts, averages, JSON-LD) when include_examples is false. See include_examples."}).optional(),
  })).meta({"description":"Optional testimonial cards merged into the review track by date (newest first) on the All tab, like accolades. Not tied to a review platform. When present, a Testimonials filter tab lists only these cards. Platform filters omit them. Each item needs title, text, and date; optional subtitle. Optional url (when set the card links with a footer cue; when omitted not clickable and no footer cue), link_text (footer cue when url is set; default Learn more / strings.view_testimonial), rating (1–5), reviewer_image. Optional source: if set, name is required; source.logo (when set) replaces the usual platform icon and is shown in the avatar position (reviewer image moves secondary). Same optional nofollow/noreferrer/rel as platforms."}).optional(),
  badge: z.looseObject({
    label: z.string().min(1).meta({"description":"Left-hand badge text. Default rating."}).optional(),
  }).meta({"description":"Optional settings for the rating badge files written by tools/badge.mjs (badge.json for shields.io, badge.svg)."}).optional(),
  credentials: z.array(z.looseObject({
    label: z.string().min(1).meta({"description":"Card title (title is an alias)."}).optional(),
    title: z.string().min(1).optional(),
    issuer: z.string().meta({"description":"Optional issuing body, shown under the title."}).optional(),
    icon: z.string().meta({"description":"Optional badge image (URL or path relative to the data root)."}).optional(),
    url: z.string().min(1).meta({"description":"Optional. When set, the card links with a Verify cue (or link_text); when omitted, the card is not clickable and has no link text."}).optional(),
    link_text: z.string().optional(),
    start: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).meta({"description":"Required. YYYY, YYYY-MM or YYYY-MM-DD. Sort key on the track."}),
    end: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).meta({"description":"Optional. YYYY, YYYY-MM or YYYY-MM-DD. Shown as the end of the date range."}).optional(),
    nofollow: z.boolean().optional(),
    noreferrer: z.boolean().optional(),
    rel: z.string().optional(),
    example: z.boolean().meta({"description":"Optional, and rarely needed: everything in the bundled examples folder (package/example-data/) already counts as example content without it. true marks this credential in your own content as an example, so it is left out of everything the widget publishes (cards, counts, averages, JSON-LD) when include_examples is false. See include_examples."}).optional(),
  }).refine(x => 'label' in x || 'title' in x || 'icon' in x, 'needs one of label, title, icon').meta({ anyOf: [{"required":["label"]},{"required":["title"]},{"required":["icon"]}] })).meta({"description":"Optional licenses, certifications and other credentials. Cards are placed on the All track by start date (so a long-held license sits where it began), and listed alone on the Credentials tab. Each card shows its date range: Since <start>, or <start>–<end>. Not counted in ratings or the JSON-LD."}).optional(),
}).meta({"description":"CRED data repo config (config.js default export).","title":"CredConfig"});

export const reviewsSchema = z.array(z.looseObject({
  platform: z.string().min(1),
  platform_review_id: z.union([z.string(), z.number()]).meta({"description":"Suggested identity key with platform for sync tooling (unique per platform). Not a hard layout rule."}),
  reviewer_name: z.string().nullable(),
  reviewer_profile_url: z.string().nullable().optional(),
  reviewer_image: z.string().min(1).meta({"description":"Avatar URL or path relative to the data root. Any working URL/path is fine; assets/images/reviewers/<platform>-<id>.<ext> is only a sync-tooling convention."}),
  reviewer_image_source_url: z.string().nullable().optional(),
  rating: z.union([z.int().min(1).max(5), z.null()]).optional(),
  text: z.string(),
  date: z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z"),
  review_url: z.string().min(1).meta({"description":"Optional. When set (or platforms.*.card_link page_url resolves), the card is a link with a View on cue. When no href resolves, the card is not clickable and has no footer link text."}).optional(),
  owner_reply: z.union([z.null(), z.looseObject({
    text: z.string(),
    date: z.union([z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z"), z.null()]).optional(),
  })]).optional(),
  collected_at: z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z").optional(),
  updated_at: z.string().regex(ISO_DATE, "must be an ISO 8601 date-time, e.g. 2024-05-01T12:00:00Z").optional(),
  nofollow: z.boolean().meta({"description":"When set, overrides platforms.<key>.nofollow for this card's outbound link."}).optional(),
  noreferrer: z.boolean().meta({"description":"When set, overrides platforms.<key>.noreferrer for this card's outbound link."}).optional(),
  rel: z.string().meta({"description":"Optional space-separated rel tokens; when set (or with nofollow/noreferrer), overrides the platform for this card. noopener is always applied."}).optional(),
  hidden: z.union([z.boolean(), z.strictObject({
    display: z.boolean().meta({"description":"true: no card for this review."}).optional(),
    rating: z.boolean().meta({"description":"true: not in the average or any count (header, filter tabs, badge, JSON-LD aggregateRating)."}).optional(),
    schema: z.boolean().meta({"description":"true: not in the JSON-LD (neither a review item nor the aggregateRating)."}).optional(),
  })]).meta({"description":"Optional. true keeps the review in the data but hides it everywhere: not shown, counted, averaged or included in the JSON-LD. An object hides only the parts set to true (missing = shown): display = no card; rating = left out of the average and every count; schema = left out of the JSON-LD."}).optional(),
  example: z.boolean().meta({"description":"Optional, and rarely needed: everything in the bundled examples folder (package/example-data/) already counts as example content without it. true marks this review in your own content as an example, so it is left out of everything the widget publishes (cards, counts, averages, JSON-LD) when include_examples is false. See include_examples."}).optional(),
  duplicate_of: z.string().regex(REVIEW_KEY, "must be <platform>-<platform_review_id>").meta({"description":"Optional. Key <platform>-<platform_review_id> of another record that is the same review (e.g. posted on two platforms with slightly different text). The widget shows and counts them once. Identical text is merged automatically (display.dedupe)."}).optional(),
  excerpt: z.string().min(1).meta({"description":"Optional. An exact passage of text (whitespace may differ) shown on the card instead of the opening characters, with ellipses where it starts or ends mid-text. The full text stays in the data."}).optional(),
})).min(1).meta({"title":"Reviews widget reviews/<year>.json"});
