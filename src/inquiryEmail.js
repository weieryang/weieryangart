import { getSculpture } from "./sculptureCatalog.js";
import { localizeSculpture } from "./sculptureCatalogCopy.js";
import { productInquiryContext } from "./productInquiry.js";
import { productInquiryCopy } from "./productInquiryCopy.js";

const briefFields = ["name", "company", "email", "phone", "projectType", "location", "material", "scale", "timeline", "installation", "message"];

export function createInquiryEmail(form, labels, address, { product, language = "en" } = {}) {
  const context = productInquiryContext(product);
  const contextLines = context ? [
    `${(productInquiryCopy[language] || productInquiryCopy.en).selected}: ${localizeSculpture(getSculpture(context.slug), language).title}`,
    `Product ID: ${context.slug}`,
    `Source: https://weieryangart.com${context.path}`,
  ] : [];
  const body = [...contextLines, ...briefFields
    .filter((key) => form[key]?.trim())
    .map((key) => `${labels[key]}: ${form[key].trim()}`)]
    .join("\n\n");
  const subject = `WEIERYANG private sculpture brief - ${form.company.trim() || "project"}`;
  const href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { body, href };
}
