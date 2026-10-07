import { getSculpture } from "./sculptureCatalog.js";
import { restoreInquiryDraft } from "./inquiryForm.js";

export const productInquiryFields = Object.freeze(["name", "company", "email", "location", "message"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function productInquiryContext(product) {
  const slug = typeof product === "string" ? product : product?.slug;
  if (typeof slug !== "string" || slug.length > 80 || !slugPattern.test(slug)) return null;
  const registered = getSculpture(slug);
  if (!registered || registered.path !== `/sculptures/${slug}/` || registered.inquiryId !== slug ||
      !Number.isInteger(registered.projectTypeIndex) || registered.projectTypeIndex < 0 || registered.projectTypeIndex > 7) return null;
  // Never trust route, category or title supplied in a URL or saved draft.
  return { slug, path: registered.path, inquiryId: registered.inquiryId, projectTypeIndex: registered.projectTypeIndex, title: registered.title };
}

export function productInquiryDraftKey(product) {
  const context = productInquiryContext(product);
  return context ? `weieryang-product-inquiry-v1:${context.slug}` : "";
}

export function productInquiryDraft(raw) {
  return Object.fromEntries(productInquiryFields.map(name => [name, typeof raw?.[name] === "string" ? raw[name] : ""]));
}

export function productInquiryForm(raw, product, projectTypes, { submitting = false } = {}) {
  const context = productInquiryContext(product);
  if (!context || !Array.isArray(projectTypes) || projectTypes.length !== 8 ||
      typeof projectTypes[context.projectTypeIndex] !== "string" || !projectTypes[context.projectTypeIndex].trim()) {
    throw new Error("A registered product and its project category are required");
  }
  return {
    ...restoreInquiryDraft(null), ...productInquiryDraft(raw),
    projectType: projectTypes[context.projectTypeIndex],
    // Drafts never restore honeypots; preserve an actual filled trap at submit.
    website: submitting && typeof raw?.website === "string" ? raw.website : "",
  };
}

export function inquiryEventContext(mode, product) {
  if (mode !== "product") return { form_name: "private_commission_brief" };
  const context = productInquiryContext(product);
  return context ? { form_name: "product_inquiry", product_slug: context.slug } : null;
}
