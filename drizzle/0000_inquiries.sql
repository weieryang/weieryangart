CREATE TABLE IF NOT EXISTS inquiries (
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
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at);
