import { analyticsProductSlugs, analyticsProjectTypes } from "./attribution.js";
import { getSculpture } from "./sculptureCatalog.js";

// The operator has not configured a Pixel/Dataset or a marketing-consent route.
// Importing this module never creates a script, initializes a Pixel or sends.
export const metaLeadConfig = Object.freeze({
  enabled: false,
  pixelId: "",
  consentPolicyConfigured: false,
});
export const metaLeadDedupKey = "weieryang-meta-confirmed-leads-v1";
const languages = new Set(["en", "ar", "zh", "fr", "es", "de"]);
const formNames = new Set(["private_commission_brief", "product_inquiry"]);
const contextKeys = new Set(["form_name", "product_slug", "project_type", "language"]);
const referencePattern = /^WY-\d{8}-[A-F0-9]{8}$/;

function safeContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context) || Object.keys(context).some(key => !contextKeys.has(key))) return null;
  const { form_name, product_slug = "", project_type, language } = context;
  if (!formNames.has(form_name) || !languages.has(language) || ![...analyticsProjectTypes, "unspecified"].includes(project_type)) return null;
  if (form_name === "product_inquiry" ? !analyticsProductSlugs.includes(product_slug) : product_slug !== "") return null;
  if (form_name === "product_inquiry" && analyticsProjectTypes[getSculpture(product_slug)?.projectTypeIndex] !== project_type) return null;
  return { form_name, product_slug, project_type, language };
}

export function confirmedMetaLead(result, context) {
  if (typeof result?.reference !== "string" || !referencePattern.test(result.reference) || result?.notifications?.email !== true) return null;
  const parameters = safeContext(context);
  return parameters ? { eventName: "Lead", eventId: result.reference, parameters } : null;
}

// This dormant adapter uses only an already initialized production Pixel.
// Future activation still needs official API/consent and Events Manager QA.
// A successful call confirms browser queueing, never platform receipt.
export function sendExistingMetaPixel({ pixelId, eventName, eventId, parameters }) {
  const browser = globalThis.window;
  if (browser?.location?.origin !== "https://weieryangart.com" || typeof browser.fbq !== "function") return false;
  browser.fbq("trackSingle", pixelId, eventName, parameters, { eventID: eventId });
  return true;
}

function browserSessionStorage() {
  try { return globalThis.window?.sessionStorage; } catch { return undefined; }
}

export function createMetaLeadTracker({
  enabled = false, pixelId = "", consentPolicyConfigured = false,
  getMarketingConsent = () => false, sendEvent = sendExistingMetaPixel,
  getStorage = browserSessionStorage,
} = {}) {
  const pending = new Set();
  const queued = new Set();
  const prefix = `${pixelId}:`;
  const readQueued = () => {
    try {
      const saved = JSON.parse(getStorage()?.getItem(metaLeadDedupKey) || "[]");
      if (Array.isArray(saved)) {
        for (const entry of saved) {
          if (typeof entry === "string" && entry.startsWith(prefix) && referencePattern.test(entry.slice(prefix.length))) queued.add(entry);
        }
      }
    } catch { /* Session storage may be disabled; in-memory dedup still works. */ }
  };
  return async (result, context) => {
    // Check every time: revoked or unconfigured consent cannot queue a lead.
    if (enabled !== true || typeof pixelId !== "string" || !/^[1-9]\d{4,24}$/.test(pixelId) || consentPolicyConfigured !== true) return { status: "disabled" };
    let consent = false;
    try { consent = getMarketingConsent() === true; } catch { /* Fail closed. */ }
    if (!consent) return { status: "disabled" };
    const event = confirmedMetaLead(result, context);
    if (!event) return { status: "invalid" };
    const key = `${prefix}${event.eventId}`;
    readQueued();
    if (pending.has(key) || queued.has(key)) return { status: "duplicate" };
    pending.add(key);
    try {
      if (await sendEvent({ pixelId, ...event }) !== true) return { status: "unavailable" };
      queued.add(key);
      try { getStorage()?.setItem(metaLeadDedupKey, JSON.stringify([...queued])); } catch { /* Keep the in-memory record. */ }
      return { status: "queued", eventId: event.eventId };
    } catch {
      return { status: "unavailable" };
    } finally { pending.delete(key); }
  };
}

// Deliberately no implicit consent, query-string configuration or tag loader.
export const trackConfirmedMetaLead = createMetaLeadTracker(metaLeadConfig);
