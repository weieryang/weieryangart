// Public-page context for ordinary contact links only. Do not use this helper
// for a submitted inquiry's private reference/message or read form/URL queries.
// Keep this explicit inventory aligned with the canonical sitemap when adding
// public pages; unknown paths deliberately share only the homepage instead.
export const projectContactPaths = Object.freeze([
  "/", "/commission/", "/garden-sculpture/", "/public-art/",
  "/resort-sculpture/", "/water-feature-sculpture/", "/bronze-sculpture/",
  "/stainless-steel-sculpture/", "/stone-sculpture/", "/custom-sculpture/",
  "/projects/", "/process/", "/materials/", "/faq/", "/sculptures/",
  "/sculptures/mirror-lobby-sculpture/", "/sculptures/vertical-atrium-sculpture/",
  "/sculptures/tree-canopy-sculpture/", "/sculptures/bird-landmark-sculpture/",
  "/retail-restaurant-sculpture/", "/themed-art-installations/", "/landscape-public-art/",
  "/projects/gold-abstract-sculpture-fabrication/", "/projects/suspended-fish-art-installation/",
  "/projects/petal-form-sculpture-display/", "/projects/warm-abstract-sculpture-plinth/",
  "/projects/illuminated-portrait-sculpture-fabrication/", "/projects/leaf-face-sculpture-fabrication/",
  "/projects/layered-horse-sculpture-fabrication/", "/projects/reflective-horse-sculpture/",
  "/insights/large-hotel-atrium-sculpture-planning-guide/",
  "/projects/hotel-lobby-sculpture-engineering-case/", "/custom-outdoor-sculpture-supplier/", "/insights/",
  "/insights/hotel-lobby-mirror-stainless-steel-sculpture/",
  "/insights/hotel-lobby-sculpture-renovation-guide/", "/insights/large-outdoor-sculpture-cost-guide/",
  "/insights/304-vs-316l-stainless-steel-outdoor-sculpture/",
  "/insights/coastal-stainless-steel-sculpture-maintenance-checklist/",
  "/insights/large-outdoor-sculpture-foundation-anchor-checklist/",
  "/insights/outdoor-sculpture-quotation-scope-checklist/", "/insights/resort-entrance-sculpture-scale-guide/",
  "/insights/large-sculpture-export-packing-checklist/",
  "/insights/large-stainless-steel-sculpture-fabrication-checklist/",
  "/insights/water-feature-sculpture-material-checklist/", "/insights/overseas-sculpture-installation-checklist/",
  "/insights/hotel-arrival-sculpture-site-brief/", "/insights/middle-east-stainless-steel-landmark-sculpture/",
  "/insights/material-led-sculpture-review-2026/", "/insights/how-to-commission-custom-outdoor-sculpture/",
  "/insights/316l-stainless-steel-vs-bronze-vs-stone/", "/insights/landscape-sculpture-quote-brief/",
  "/insights/custom-outdoor-abstract-sculpture-approval-checklist/",
  "/insights/brass-vs-bronze-sculpture-oem-quote/", "/privacy/",
]);

const publicPaths = new Set(projectContactPaths);
const site = "https://weieryangart.com";
const contactNumber = "8613317178019";
const greeting = "Hello WEIERYANG, I would like to discuss a sculpture project.";

function publicPage(input) {
  if (typeof input !== "string" || input.length > 2048 || /[\\\u0000-\u001f\u007f]/.test(input)) return null;
  const supplied = input.trim() || "/";
  if (supplied.startsWith("//")) return null;
  // Check before URL normalisation so encoded or dot-segment paths cannot
  // silently become an approved path. Queries/fragments are never included.
  const withoutPrivateParts = supplied.split(/[?#]/, 1)[0];
  if (/%|(?:^|\/)\.{1,2}(?:\/|$)/.test(withoutPrivateParts)) return null;
  let url;
  try {
    const relative = /^[a-z][a-z\d+.-]*:/i.test(withoutPrivateParts)
      ? withoutPrivateParts
      : withoutPrivateParts.startsWith("/") ? withoutPrivateParts : `/${withoutPrivateParts}`;
    url = new URL(relative, site);
  } catch { return null; }
  if (url.origin !== site || url.username || url.password || url.pathname.length > 300 || url.pathname.includes("//")) return null;
  let path = url.pathname.replace(/\/index\.html$/, "/");
  if (!path.endsWith("/")) path += "/";
  return publicPaths.has(path) ? path : null;
}

function publicTitle(input) {
  if (typeof input !== "string") return "";
  // The caller supplies fixed public metadata, not document queries or buyer
  // text. Reject obvious private/query identifiers rather than partially copy
  // them into a contact draft, including identifiers beyond the length limit.
  if (/[<>@%?#=]|https?:\/\/|www\.|\bWY-[a-z\d-]{4,}|\b(?:utm_[a-z_]+|gclid|dclid|gbraid|wbraid|fbclid|token|password)\b/i.test(input)) return "";
  return Array.from(input.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, " ").replace(/\s+/g, " ").trim()).slice(0, 160).join("");
}

export function projectWhatsappHref(path = "/", title = "") {
  const knownPath = publicPage(path);
  const label = knownPath ? publicTitle(title) : "";
  const message = `${greeting}\n${label ? `Page: ${label}\n` : ""}${site}${knownPath || "/"}`;
  return `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
}
