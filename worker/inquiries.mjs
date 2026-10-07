const allowedOrigins = new Set(["https://weieryangart.com", "https://www.weieryangart.com"]);
const allowedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "webp", "dwg"]);
const maximumFiles = 5;
const maximumFileSize = 10 * 1024 * 1024;
const maximumAttachmentSize = 15 * 1024 * 1024;
const maximumRequestSize = 17 * 1024 * 1024;
const roleLabels = Object.freeze({
  designer: "Designer / art consultant",
  contractor: "Contractor",
  supplier: "Supplier",
  "developer-procurement": "Developer / procurement",
  "private-owner": "Private owner",
  other: "Other",
});
const formVariantLabels = Object.freeze({
  "product-role-v2": "Product inquiry (product-role-v2)",
  "full-role-v2": "Full project brief (full-role-v2)",
});

function responseHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function json(data, status, origin) {
  return Response.json(data, { status, headers: responseHeaders(origin) });
}

function value(form, key, maximum) {
  const raw = form.get(key);
  if (typeof raw !== "string") return "";
  const result = raw.trim();
  if (result.length > maximum) throw new Error(`${key} is too long.`);
  return result;
}

function singleLineValue(form, key, maximum) {
  const raw = form.get(key);
  if (raw != null && typeof raw !== "string") throw new Error(`${key} must be text.`);
  const result = value(form, key, maximum);
  if (/[\u0000-\u001f\u007f-\u009f]/.test(result)) throw new Error(`${key} must be a single line.`);
  return result;
}

function sourcePath(raw) {
  try {
    const url = new URL(raw);
    return allowedOrigins.has(url.origin) ? url.pathname : "";
  } catch {
    return "";
  }
}

function safeLandingPath(raw) {
  if (!raw.startsWith("/") || raw.startsWith("//")) return "";
  try {
    const url = new URL(raw, "https://weieryangart.com");
    return allowedOrigins.has(url.origin) && !url.search ? url.pathname : "";
  } catch {
    return "";
  }
}

function safeCampaignValue(raw) {
  return /^[a-z0-9][a-z0-9._~ -]{0,79}$/i.test(raw) ? raw : "";
}

function safeClickId(raw) {
  return /^[a-z0-9._-]{1,500}$/i.test(raw) ? raw : "";
}

function safeReferrerHost(raw) {
  return /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(raw) ? raw.toLowerCase() : "";
}

function referenceId() {
  return `WY-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function readFormWithLimit(request) {
  if (!request.body) throw new Error("Empty request body");
  const reader = request.body.getReader();
  const chunks = [];
  let bytes = 0;
  let tooLarge = false;
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) break;
    bytes += chunk.byteLength;
    if (bytes > maximumRequestSize) {
      tooLarge = true;
      continue;
    }
    chunks.push(chunk);
  }
  if (tooLarge) return null;
  const bounded = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": request.headers.get("Content-Type") },
    body: new Blob(chunks),
  });
  return bounded.formData();
}

function notificationText(reference, inquiry, files) {
  const fields = [
    ["Reference", reference],
    ["Form type", formVariantLabels[inquiry.formVariant] || "Legacy full brief (no form variant)"],
    ["Customer role", inquiry.customerRole ? `${roleLabels[inquiry.customerRole]} [${inquiry.customerRole}]` : "Not supplied by legacy form"],
    ["Name", inquiry.name], ["Company", inquiry.company],
    ["Email", inquiry.email], ["Phone / WhatsApp", inquiry.phone],
    ["Project type", inquiry.projectType], ["Site", inquiry.location],
    ["Material", inquiry.material], ["Scale", inquiry.scale], ["Budget (optional, not a qualification gate)", inquiry.budget], ["Timeline", inquiry.timeline],
    ["Installation", inquiry.installation], ["Language", inquiry.language],
    ["Source", inquiry.source], ["Landing page", inquiry.landingPath],
    ["Referrer host", inquiry.referrerHost], ["UTM source", inquiry.utmSource],
    ["UTM medium", inquiry.utmMedium], ["UTM campaign", inquiry.utmCampaign],
    ["UTM ID", inquiry.utmId], ["UTM content", inquiry.utmContent],
    ["UTM term", inquiry.utmTerm], ["Facebook click ID", inquiry.fbclid],
    ["First landing page", inquiry.firstLandingPath], ["First referrer host", inquiry.firstReferrerHost],
    ["First UTM source", inquiry.firstUtmSource], ["First UTM medium", inquiry.firstUtmMedium],
    ["First UTM campaign", inquiry.firstUtmCampaign],
    ["Interest route", inquiry.interestRoute],
    ["Project facts", inquiry.message],
  ];
  const details = fields.filter(([, item]) => item).map(([label, item]) => `${label}: ${item}`).join("\n\n");
  const attachments = files.length
    ? files.map((file) => `${file.name} (${file.size} bytes)`).join("\n")
    : "None";
  return `${details}\n\nAttribution note: Landing/UTM fields use the submitted effective attribution (latest valid paid touch when available, otherwise first visit). First-prefixed fields preserve the initial visit when supplied.\n\nAttached project files:\n${attachments}`;
}

async function verifyTurnstile(token, env, fetcher) {
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  const result = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!result.ok) return false;
  const verified = await result.json();
  return verified.success === true && verified.action === "commission" && ["weieryangart.com", "www.weieryangart.com"].includes(verified.hostname);
}

export async function handleInquiryRequest(request, env, dependencies = {}) {
  const pathname = new URL(request.url).pathname;
  if (pathname === "/health" && request.method === "GET") {
    return Response.json({ configured: Boolean(env.EMAIL && env.INQUIRY_RATE && env.TURNSTILE_SECRET) }, { headers: { "Cache-Control": "no-store" } });
  }
  if (pathname !== "/inquiries") return new Response("Not found", { status: 404 });

  const origin = request.headers.get("Origin") || "";
  if (!allowedOrigins.has(origin)) return new Response("Forbidden", { status: 403 });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(origin) });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (!env.EMAIL || !env.INQUIRY_RATE || !env.TURNSTILE_SECRET) return json({ error: "The inquiry service is not configured." }, 503, origin);
  const { success } = await env.INQUIRY_RATE.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
  if (!success) return json({ error: "Too many requests. Please try again shortly." }, 429, origin);
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("multipart/form-data")) {
    return json({ error: "Expected a multipart form." }, 415, origin);
  }
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > maximumRequestSize) return json({ error: "The total upload is too large." }, 413, origin);

  let form;
  try {
    form = await readFormWithLimit(request);
  } catch {
    return json({ error: "The submitted form could not be read." }, 400, origin);
  }
  if (!form) return json({ error: "The total upload is too large." }, 413, origin);

  let inquiry;
  try {
    if (value(form, "website", 200)) return json({ error: "Invalid submission." }, 400, origin);
    inquiry = {
      formVariant: singleLineValue(form, "formVariant", 40),
      customerRole: singleLineValue(form, "customerRole", 40),
      name: value(form, "name", 160),
      company: value(form, "company", 200),
      email: value(form, "email", 240).toLowerCase(),
      phone: singleLineValue(form, "phone", 80),
      projectType: value(form, "projectType", 160),
      location: value(form, "location", 240),
      material: value(form, "material", 160),
      scale: value(form, "scale", 100),
      budget: singleLineValue(form, "budget", 120),
      timeline: singleLineValue(form, "timeline", 120),
      installation: value(form, "installation", 160),
      message: value(form, "message", 5000),
      language: value(form, "language", 12) || "en",
      source: sourcePath(value(form, "source", 500)),
      landingPath: safeLandingPath(value(form, "landingPath", 300)),
      referrerHost: safeReferrerHost(value(form, "referrerHost", 120)),
      utmSource: safeCampaignValue(value(form, "utmSource", 80)),
      utmMedium: safeCampaignValue(value(form, "utmMedium", 80)),
      utmCampaign: safeCampaignValue(value(form, "utmCampaign", 80)),
      utmId: safeCampaignValue(value(form, "utmId", 80)),
      utmContent: safeCampaignValue(value(form, "utmContent", 80)),
      utmTerm: safeCampaignValue(value(form, "utmTerm", 80)),
      fbclid: safeClickId(value(form, "fbclid", 500)),
      firstLandingPath: safeLandingPath(value(form, "firstLandingPath", 300)),
      firstReferrerHost: safeReferrerHost(value(form, "firstReferrerHost", 120)),
      firstUtmSource: safeCampaignValue(value(form, "firstUtmSource", 80)),
      firstUtmMedium: safeCampaignValue(value(form, "firstUtmMedium", 80)),
      firstUtmCampaign: safeCampaignValue(value(form, "firstUtmCampaign", 80)),
      interestRoute: safeCampaignValue(value(form, "interestRoute", 80)),
    };
  } catch (error) {
    return json({ error: error.message }, 400, origin);
  }

  if (inquiry.formVariant && !Object.hasOwn(formVariantLabels, inquiry.formVariant)) {
    return json({ error: "Unknown form variant." }, 400, origin);
  }
  if ((inquiry.formVariant || inquiry.customerRole) && !Object.hasOwn(roleLabels, inquiry.customerRole)) {
    return json({ error: "Select a valid customer role." }, 400, origin);
  }
  // Missing variant preserves the deployed full-brief contract. The explicit v2
  // forms accept private owners and do not require or invent a company.
  if (!inquiry.name || (!inquiry.formVariant && !inquiry.company) || !inquiry.email || !inquiry.projectType || !inquiry.location || !inquiry.message) {
    return json({ error: "Required project facts are missing." }, 400, origin);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return json({ error: "Enter a valid business email." }, 400, origin);
  }

  try {
    if (!(await verifyTurnstile(value(form, "cf-turnstile-response", 2048), env, dependencies.fetch || fetch))) {
      return json({ error: "The security check expired. Please try again." }, 400, origin);
    }
  } catch {
    return json({ error: "The security check is temporarily unavailable." }, 503, origin);
  }

  const files = form.getAll("files").filter((item) => item instanceof File && item.size > 0);
  if (files.length > maximumFiles || files.some((file) => file.size > maximumFileSize || !allowedExtensions.has(file.name.split(".").pop()?.toLowerCase())) || files.reduce((total, file) => total + file.size, 0) > maximumAttachmentSize) {
    return json({ error: "Check file type, count, 10 MB per file and 15 MB total limit." }, 400, origin);
  }

  const reference = referenceId();
  try {
    await env.EMAIL.send({
      to: "tangkelian@weieryang.com",
      from: env.EMAIL_FROM || "inquiries@weieryangart.com",
      replyTo: inquiry.email,
      subject: `WEIERYANG private brief ${reference}`,
      text: notificationText(reference, inquiry, files),
      attachments: await Promise.all(files.map(async (file) => ({
        content: await file.arrayBuffer(),
        filename: file.name,
        type: file.type || "application/octet-stream",
        disposition: "attachment",
      }))),
    });
  } catch {
    return json({ error: "The brief could not be delivered. Please use email or WhatsApp." }, 503, origin);
  }

  return json({ reference, attachedFiles: files.length, notifications: { email: true, whatsapp: false } }, 201, origin);
}

export default { fetch: handleInquiryRequest };
