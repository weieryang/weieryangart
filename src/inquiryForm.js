// Keep browser validation aligned with the existing inquiry Worker's limits.
export const fieldLimits = {
  name: 160, company: 200, email: 240, phone: 80, projectType: 160,
  location: 240, material: 160, scale: 100, timeline: 120,
  installation: 160, message: 5000, website: 200,
};
const requiredFields = new Set(["name", "company", "email", "projectType", "location", "message"]);

export function restoreInquiryDraft(raw) {
  return Object.fromEntries(Object.keys(fieldLimits).map(name => [
    name, name !== "website" && typeof raw?.[name] === "string" ? raw[name] : "",
  ]));
}

export function validateInquiryField(name, value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (requiredFields.has(name) && !trimmed) return "required";
  if (trimmed.length > fieldLimits[name]) return "length";
  if (name === "email" && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "email";
  return "";
}

export function validateInquiry(form) {
  return Object.fromEntries(Object.keys(fieldLimits).filter(name => name !== "website")
    .map(name => [name, validateInquiryField(name, form[name])]).filter(([, error]) => error));
}

export async function sendInquiry(endpoint, body, { fetcher = fetch, timeoutMs = 120_000 } = {}) {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      (async () => {
        const response = await fetcher(endpoint, {
          method: "POST", body, headers: { Accept: "application/json" }, signal: controller.signal,
        });
        // A failed/partial response cannot confirm delivery, even if it is HTTP 200.
        const result = await response.json();
        if (!response.ok || !/^WY-\d{8}-[A-F0-9]{8}$/.test(result?.reference || "") || result?.notifications?.email !== true) {
          throw new Error("Inquiry delivery was not confirmed");
        }
        return result;
      })(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("Inquiry delivery timed out"));
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
