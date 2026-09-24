const briefFields = ["name", "company", "email", "phone", "projectType", "location", "material", "scale", "timeline", "installation", "message"];

export function createInquiryEmail(form, labels, address) {
  const body = briefFields
    .filter((key) => form[key]?.trim())
    .map((key) => `${labels[key]}: ${form[key].trim()}`)
    .join("\n\n");
  const subject = `WEIERYANG private sculpture brief - ${form.company.trim() || "project"}`;
  const href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { body, href };
}
