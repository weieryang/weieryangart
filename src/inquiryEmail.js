import { getSculpture } from "./sculptureCatalog.js";
import { localizeSculpture } from "./sculptureCatalogCopy.js";
import { productInquiryContext } from "./productInquiry.js";
import { productInquiryCopy } from "./productInquiryCopy.js";
import { customerRoleIds, inquiryIntakeCopy } from "./inquiryIntake.js";

const briefFields = ["name", "email", "customerRole", "company", "phone", "projectType", "location", "material", "scale", "budget", "timeline", "installation", "message"];

export function createInquiryEmail(form, labels, address, { product, language = "en" } = {}) {
  const context = productInquiryContext(product);
  const intake = inquiryIntakeCopy[language] || inquiryIntakeCopy.en;
  const fieldLabels = { ...labels, customerRole: intake.role, budget: intake.budget };
  const roleIndex = customerRoleIds.indexOf(form.customerRole);
  const contextLines = context ? [
    `${(productInquiryCopy[language] || productInquiryCopy.en).selected}: ${localizeSculpture(getSculpture(context.slug), language).title}`,
    `Product ID: ${context.slug}`,
    `Source: https://weieryangart.com${context.path}`,
  ] : [];
  const body = [...contextLines, ...briefFields
    .filter((key) => form[key]?.trim())
    .map((key) => `${fieldLabels[key]}: ${key === "customerRole" && roleIndex >= 0 ? intake.roles[roleIndex] : form[key].trim()}`)]
    .join("\n\n");
  const subject = `WEIERYANG private sculpture brief - ${(form.company || "").trim() || "project"}`;
  const href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { body, href };
}
