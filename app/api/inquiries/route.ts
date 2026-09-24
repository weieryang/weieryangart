import { env } from "cloudflare:workers";

export const runtime = "edge";

const maximumFiles = 5;
const maximumFileSize = 10 * 1024 * 1024;
const acceptedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "webp", "dwg"]);

type InquiryEnvironment = {
  DB?: D1Database;
  UPLOADS?: R2Bucket;
  INQUIRY_EMAIL_WEBHOOK?: string;
  INQUIRY_WHATSAPP_WEBHOOK?: string;
};

type StoredFile = {
  name: string;
  key: string;
  size: number;
  type: string;
};

function textValue(form: FormData, key: string, maximum = 1200) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function safeFilename(filename: string) {
  const normalized = filename.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return normalized.replace(/^[-.]+|[-.]+$/g, "").slice(0, 120) || "attachment";
}

function extensionOf(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `WY-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function ensureTable(database: D1Database) {
  const schema = `CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT NOT NULL,
    location TEXT NOT NULL,
    material TEXT,
    scale TEXT,
    timeline TEXT,
    installation TEXT,
    message TEXT NOT NULL,
    language TEXT NOT NULL,
    source TEXT,
    files_json TEXT NOT NULL,
    email_notified INTEGER NOT NULL DEFAULT 0,
    whatsapp_notified INTEGER NOT NULL DEFAULT 0
  )`;
  await database.prepare(schema).run();
}

async function notifyWebhook(url: string | undefined, payload: Record<string, unknown>) {
  if (!url) return false;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.ok;
}

export async function POST(request: Request) {
  const bindings = env as unknown as InquiryEnvironment;
  if (!bindings.DB || !bindings.UPLOADS) {
    return Response.json({ error: "The secure inquiry service is not available yet." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 55 * 1024 * 1024) {
    return Response.json({ error: "The total upload is too large." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "The submitted form could not be read." }, { status: 400 });
  }

  if (textValue(form, "website", 200)) {
    return Response.json({ reference: makeReference() }, { status: 201 });
  }

  const inquiry = {
    name: textValue(form, "name", 160),
    company: textValue(form, "company", 200),
    email: textValue(form, "email", 240).toLowerCase(),
    phone: textValue(form, "phone", 80),
    projectType: textValue(form, "projectType", 160),
    location: textValue(form, "location", 240),
    material: textValue(form, "material", 160),
    scale: textValue(form, "scale", 100),
    timeline: textValue(form, "timeline", 120),
    installation: textValue(form, "installation", 160),
    message: textValue(form, "message", 5000),
    language: textValue(form, "language", 12) || "en",
    source: textValue(form, "source", 500),
  };

  if (!inquiry.name || !inquiry.company || !inquiry.email || !inquiry.projectType || !inquiry.location || !inquiry.message) {
    return Response.json({ error: "Required project facts are missing." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return Response.json({ error: "Enter a valid business email." }, { status: 400 });
  }

  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > maximumFiles) {
    return Response.json({ error: `Upload no more than ${maximumFiles} files.` }, { status: 400 });
  }
  for (const file of files) {
    if (file.size > maximumFileSize || !acceptedExtensions.has(extensionOf(file.name))) {
      return Response.json({ error: `File ${file.name} is not an accepted type or is larger than 10 MB.` }, { status: 400 });
    }
  }

  const reference = makeReference();
  const createdAt = new Date().toISOString();
  const storedFiles: StoredFile[] = [];

  try {
    for (const file of files) {
      const key = `inquiries/${reference}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
      await bindings.UPLOADS.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
        customMetadata: { inquiry: reference, originalName: file.name },
      });
      storedFiles.push({ name: file.name, key, size: file.size, type: file.type || "application/octet-stream" });
    }

    await ensureTable(bindings.DB);
    await bindings.DB.prepare(`INSERT INTO inquiries (
      id, created_at, name, company, email, phone, project_type, location, material, scale,
      timeline, installation, message, language, source, files_json, email_notified, whatsapp_notified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`).bind(
      reference,
      createdAt,
      inquiry.name,
      inquiry.company,
      inquiry.email,
      inquiry.phone,
      inquiry.projectType,
      inquiry.location,
      inquiry.material,
      inquiry.scale,
      inquiry.timeline,
      inquiry.installation,
      inquiry.message,
      inquiry.language,
      inquiry.source,
      JSON.stringify(storedFiles),
    ).run();

    const notificationPayload = { reference, createdAt, ...inquiry, files: storedFiles.map(({ name, size, type }) => ({ name, size, type })) };
    const [emailNotified, whatsappNotified] = await Promise.all([
      notifyWebhook(bindings.INQUIRY_EMAIL_WEBHOOK, { channel: "email", ...notificationPayload }),
      notifyWebhook(bindings.INQUIRY_WHATSAPP_WEBHOOK, { channel: "whatsapp", ...notificationPayload }),
    ]);

    await bindings.DB.prepare("UPDATE inquiries SET email_notified = ?, whatsapp_notified = ? WHERE id = ?")
      .bind(emailNotified ? 1 : 0, whatsappNotified ? 1 : 0, reference)
      .run();

    return Response.json({ reference, storedFiles: storedFiles.length, notifications: { email: emailNotified, whatsapp: whatsappNotified } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected inquiry service error";
    return Response.json({ error: "The secure inquiry could not be stored.", detail: message.slice(0, 300) }, { status: 500 });
  }
}
