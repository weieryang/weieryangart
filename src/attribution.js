// Register outbound campaign names here before sharing new links. These values
// are the only URL-derived source/campaign labels allowed in custom events.
export const attributionSources = Object.freeze([
  "whatsapp", "email-sig", "cold-email", "catalog-pdf", "alibaba",
  "tradeshow", "parcel-insert", "linkedin", "youtube", "reddit",
  "google", "bing", "facebook", "instagram", "meta",
]);
export const attributionCampaigns = Object.freeze([
  "always-on", "2026q4-us-hospitality", "us-hotel",
]);
export const attributionSessionKey = "weieryang-attribution-v2";

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

function campaignValue(value) {
  // Metadata is bounded to the existing inquiry endpoint's limits. Do not
  // truncate malformed values into apparently legitimate campaign identifiers.
  return typeof value === "string" && /^[a-z0-9][a-z0-9._~-]{0,79}$/i.test(value) ? value : "";
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
  return {
    landingPath: safePagePath(input.landingPath) || safePagePath(fallbackPath),
    referrerHost: referrer.length <= 120 && /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(referrer) ? referrer : "",
    utmSource: enumValue(input.utmSource, attributionSources),
    utmMedium: enumValue(input.utmMedium, media),
    utmCampaign: enumValue(input.utmCampaign, attributionCampaigns),
    utmId: campaignValue(input.utmId),
    utmContent: campaignValue(input.utmContent),
    utmTerm: campaignValue(input.utmTerm),
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
  let attribution = current;
  try {
    const saved = JSON.parse(storage?.getItem(attributionSessionKey) || "null");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      attribution = sanitizeAttribution(saved, current.landingPath);
    }
    // Revalidate old snapshots as well as newly captured URL values.
    storage?.setItem(attributionSessionKey, JSON.stringify(attribution));
  } catch { /* Attribution never prevents a visitor from submitting a brief. */ }
  return attribution;
}

export function analyticsAttribution(value) {
  const safe = sanitizeAttribution(value);
  return {
    lead_source: safe.utmSource || (safe.fbclid ? "facebook" : "website"),
    campaign_name: safe.utmCampaign,
  };
}

export function inquirySource(href, canonicalPath = "/commission/") {
  // Callers obtain product paths from the static product registry, never query
  // parameters. The original full brief retains its canonical default.
  const path = safePagePath(canonicalPath);
  if (!path) return "";
  try { return new URL(path, new URL(href).origin).href; } catch { return ""; }
}

const currentProjectIds = ["hotel-lobby-atrium", "hotel-resort-entrance", "resort-landscape-poolside", "landscape", "public-art", "water-feature", "private-estate", "other-custom"];
const legacyProjectIds = ["hotel-resort-entrance", "landscape", "public-art", "water-feature", "private-estate", "other-custom"];

export function analyticsProjectType(value, optionGroups) {
  if (typeof value !== "string") return "unspecified";
  for (const options of optionGroups) {
    const index = options.indexOf(value);
    const ids = options.length === 8 ? currentProjectIds : options.length === 6 ? legacyProjectIds : [];
    if (index >= 0 && ids[index]) return ids[index];
  }
  // Old drafts remain submit-able, but their arbitrary strings are not events.
  return "unspecified";
}
