// Register outbound campaign names here before sharing new links. These values
// are the only URL-derived source/campaign labels allowed in custom events.
export const attributionSources = Object.freeze([
  "whatsapp", "email-sig", "cold-email", "catalog-pdf", "alibaba",
  "tradeshow", "parcel-insert", "linkedin", "youtube", "reddit",
  "google", "bing", "facebook", "instagram", "meta",
]);
export const attributionCampaignRegistry = Object.freeze([
  Object.freeze({ code: "always-on", registeredAds: false }),
  Object.freeze({ code: "2026q4-us-hospitality", registeredAds: true }),
  Object.freeze({ code: "us-hotel", registeredAds: true }),
]);
export const attributionCampaigns = Object.freeze(attributionCampaignRegistry.map(campaign => campaign.code));
export const attributionSessionKey = "weieryang-attribution-v2";
export const attributionSnapshotKey = "weieryang-attribution-v3";
export const inquiryAttributionFieldNames = Object.freeze([
  "landingPath", "referrerHost", "utmSource", "utmMedium", "utmCampaign", "utmId", "utmContent", "utmTerm", "fbclid",
  "firstLandingPath", "firstReferrerHost", "firstUtmSource", "firstUtmMedium", "firstUtmCampaign",
]);

// These are local advertising/creative codes, not invented Meta account IDs.
// Register real campaign/ad mappings before distributing links for a new test.
export const attributionAds = Object.freeze([
  { code: "mirror-lobby", variants: ["mirror-lobby", "mirror-lobby-a", "mirror-lobby-b"] },
  { code: "vertical-atrium", variants: ["vertical-atrium", "vertical-atrium-a", "vertical-atrium-b"] },
  { code: "tree-canopy", variants: ["tree-canopy", "tree-canopy-a", "tree-canopy-b"] },
  { code: "bird-landmark", variants: ["bird-landmark", "bird-landmark-a", "bird-landmark-b"] },
].map(ad => Object.freeze({ code: ad.code, variants: Object.freeze(ad.variants) })));
const advertisingCampaigns = new Set(attributionCampaignRegistry.filter(campaign => campaign.registeredAds).map(campaign => campaign.code));
const paidSources = new Set(["google", "bing", "facebook", "instagram", "meta", "linkedin", "youtube", "reddit"]);
const paidMedia = new Set(["cpc", "paid-social", "paid_social"]);

const media = ["referral", "cpc", "email", "social", "organic", "paid-social", "paid_social"];
// Public analytics runs this dependency-free module independently of React.
export const analyticsProductSlugs = Object.freeze([
  "mirror-lobby-sculpture", "vertical-atrium-sculpture", "tree-canopy-sculpture", "bird-landmark-sculpture",
]);
const interestRoutes = new Set([
  "1", "2", "3", "4", "garden-sculpture", "public-art", "resort-sculpture",
  "water-feature-sculpture", "bronze-sculpture", "stainless-steel-sculpture",
  "stone-sculpture", "custom-sculpture", "projects", "process", "materials", "faq",
  "cost-guide", "hotel-lobby-engineering-case", "us-hotel-procurement",
  ...analyticsProductSlugs,
]);

export function analyticsProductSlug(pathname) {
  if (typeof pathname !== "string") return "";
  const match = /^\/sculptures\/([a-z0-9-]+)(?:\/index\.html|\/)?$/.exec(pathname);
  return match && analyticsProductSlugs.includes(match[1]) ? match[1] : "";
}

function enumValue(value, values) {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  return values.includes(normalized) ? normalized : "";
}

function registeredAd(input, campaign) {
  if (!advertisingCampaigns.has(campaign)) return { utmId: "", utmContent: "" };
  const id = typeof input.utmId === "string" ? input.utmId : "";
  const content = typeof input.utmContent === "string" ? input.utmContent : "";
  const ad = id ? attributionAds.find(ad => ad.code === id) : attributionAds.find(ad => ad.variants.includes(content));
  return {
    utmId: ad?.code || "",
    utmContent: ad?.variants.includes(content) ? content : "",
  };
}

export function safePagePath(value) {
  if (typeof value !== "string" || value.length > 300 || !/^\/(?!\/)[a-z0-9/_-]*(?:index\.html)?$/i.test(value)) return "";
  return value;
}

export function isCommissionPath(value) {
  return /^\/commission(?:\/index\.html|\/)?$/.test(value);
}

export function safeInterestRoute(value) {
  return typeof value === "string" && interestRoutes.has(value) ? value : "";
}

export function sanitizeAttribution(value, fallbackPath = "") {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const referrer = typeof input.referrerHost === "string" ? input.referrerHost.toLowerCase() : "";
  const campaign = enumValue(input.utmCampaign, attributionCampaigns);
  return {
    landingPath: safePagePath(input.landingPath) || safePagePath(fallbackPath),
    referrerHost: referrer.length <= 120 && /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(referrer) ? referrer : "",
    utmSource: enumValue(input.utmSource, attributionSources),
    utmMedium: enumValue(input.utmMedium, media),
    utmCampaign: campaign,
    ...registeredAd(input, campaign),
    // No keyword/free-text taxonomy is registered. Keep this legacy field
    // empty rather than leaking a person's search or project text.
    utmTerm: "",
    fbclid: typeof input.fbclid === "string" && /^[a-z0-9._-]{1,500}$/i.test(input.fbclid) ? input.fbclid : "",
  };
}

export function captureAttribution(href, referrer = "") {
  let url;
  try { url = new URL(href); } catch { return sanitizeAttribution({}); }
  let referrerHost = "";
  try {
    const previous = new URL(referrer);
    if (previous.origin !== url.origin) referrerHost = previous.hostname;
  } catch { /* An absent or malformed referrer must not discard the campaign. */ }
  return sanitizeAttribution({
    landingPath: url.pathname, referrerHost,
    ...Object.fromEntries(["source", "medium", "campaign", "id", "content", "term"].map(key => [
      `utm${key[0].toUpperCase()}${key.slice(1)}`, url.searchParams.get(`utm_${key}`) || "",
    ])),
    fbclid: url.searchParams.get("fbclid") || "",
  });
}

export function readAttribution(href, referrer = "", storage) {
  const current = captureAttribution(href, referrer);
  let firstTouch = current;
  let latestPaid = null;
  try {
    const saved = parseSnapshot(storage?.getItem(attributionSnapshotKey));
    const legacy = parseSnapshot(storage?.getItem(attributionSessionKey));
    if (saved?.version === 3 && saved.firstTouch && typeof saved.firstTouch === "object" && !Array.isArray(saved.firstTouch)) {
      firstTouch = sanitizeAttribution(saved.firstTouch, current.landingPath);
      latestPaid = isValidPaidAttribution(saved.latestPaid) ? sanitizeAttribution(saved.latestPaid) : null;
    } else if (legacy) {
      firstTouch = sanitizeAttribution(legacy, current.landingPath);
      latestPaid = isValidPaidAttribution(firstTouch) ? firstTouch : null;
    }
  } catch { /* Attribution never prevents a visitor from submitting a brief. */ }
  if (isValidPaidAttribution(current)) latestPaid = current;
  try {
    // Preserve the legacy first-touch contract as well as the v3 journey.
    storage?.setItem(attributionSessionKey, JSON.stringify(firstTouch));
    storage?.setItem(attributionSnapshotKey, JSON.stringify({ version: 3, firstTouch, latestPaid }));
  } catch { /* Blocked/quota-limited storage must not block the inquiry. */ }
  return { ...firstTouch, firstTouch, latestPaid };
}

function parseSnapshot(raw) {
  try {
    const value = JSON.parse(raw || "null");
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch { return null; }
}

export function isValidPaidAttribution(value) {
  const safe = sanitizeAttribution(value);
  return paidSources.has(safe.utmSource) && paidMedia.has(safe.utmMedium) && Boolean(safe.utmCampaign);
}

export function effectiveAttribution(value) {
  return isValidPaidAttribution(value?.latestPaid)
    ? sanitizeAttribution(value.latestPaid)
    : sanitizeAttribution(value?.firstTouch || value);
}

export function inquiryAttributionFields(value) {
  const first = sanitizeAttribution(value?.firstTouch || value);
  return {
    ...effectiveAttribution(value),
    firstLandingPath: first.landingPath,
    firstReferrerHost: first.referrerHost,
    firstUtmSource: first.utmSource,
    firstUtmMedium: first.utmMedium,
    firstUtmCampaign: first.utmCampaign,
  };
}

export function analyticsAttribution(value) {
  const safe = effectiveAttribution(value);
  return {
    lead_source: safe.utmSource || (safe.fbclid ? "facebook" : "website"),
    campaign_name: safe.utmCampaign,
    ad_code: safe.utmId,
    creative_variant: safe.utmContent,
  };
}

export function inquirySource(href, canonicalPath = "/commission/") {
  // Callers obtain product paths from the static product registry, never query
  // parameters. The original full brief retains its canonical default.
  const path = safePagePath(canonicalPath);
  if (!path) return "";
  try { return new URL(path, new URL(href).origin).href; } catch { return ""; }
}

export const analyticsProjectTypes = Object.freeze(["hotel-lobby-atrium", "hotel-resort-entrance", "resort-landscape-poolside", "landscape", "public-art", "water-feature", "private-estate", "other-custom"]);
const legacyProjectIds = ["hotel-resort-entrance", "landscape", "public-art", "water-feature", "private-estate", "other-custom"];

export function analyticsProjectType(value, optionGroups) {
  if (typeof value !== "string") return "unspecified";
  for (const options of optionGroups) {
    const index = options.indexOf(value);
    const ids = options.length === 8 ? analyticsProjectTypes : options.length === 6 ? legacyProjectIds : [];
    if (index >= 0 && ids[index]) return ids[index];
  }
  // Old drafts remain submit-able, but their arbitrary strings are not events.
  return "unspecified";
}
