import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { copy } from "./content.js";
import {
  attributionSources, attributionCampaigns, attributionSessionKey,
  captureAttribution, sanitizeAttribution, readAttribution,
  analyticsAttribution, analyticsProjectType, inquirySource,
} from "./attribution.js";

test("handbook channels and registered campaigns are accepted without arbitrary event labels", () => {
  const handbookSources = ["whatsapp", "email-sig", "cold-email", "catalog-pdf", "alibaba", "tradeshow", "parcel-insert", "linkedin", "youtube", "reddit"];
  for (const source of handbookSources) {
    assert.ok(attributionSources.includes(source));
    const result = captureAttribution(`https://weieryangart.com/resort-sculpture/?utm_source=${source}&utm_medium=referral&utm_campaign=2026q4-us-hospitality`);
    assert.equal(result.utmSource, source);
    assert.equal(result.utmCampaign, "2026q4-us-hospitality");
  }
  assert.ok(attributionCampaigns.includes("always-on"));
  const events = analyticsAttribution({ utmSource: "private@example.test", utmCampaign: "john-smith", utmContent: "private-drawing" });
  assert.deepEqual(events, { lead_source: "website", campaign_name: "" });
});

test("first touch survives navigation and old snapshots are revalidated", () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  readAttribution("https://weieryangart.com/resort-sculpture/?utm_source=linkedin&utm_campaign=always-on", "https://www.bing.com/search?q=private", storage);
  const result = readAttribution("https://weieryangart.com/commission/?utm_source=facebook", "https://weieryangart.com/resort-sculpture/", storage);
  assert.equal(result.utmSource, "linkedin");
  assert.equal(result.landingPath, "/resort-sculpture/");
  assert.equal(result.referrerHost, "www.bing.com");
  values.set(attributionSessionKey, JSON.stringify({ landingPath: "/?email=private@example.test", utmSource: { private: true }, utmCampaign: "private@example.test", utmContent: "x".repeat(81) }));
  const cleaned = readAttribution("https://weieryangart.com/commission/", "", storage);
  assert.equal(cleaned.landingPath, "/commission/");
  assert.equal(cleaned.utmSource, "");
  assert.equal(cleaned.utmContent, "");
  assert.ok(!values.get(attributionSessionKey).includes("private@example.test"));
});

test("long ad URLs cannot make inquiry attribution exceed Worker field limits", () => {
  const href = `https://weieryangart.com/commission/?utm_source=facebook&utm_campaign=${"x".repeat(1000)}&utm_content=${"y".repeat(1000)}&fbclid=${"z".repeat(1000)}&email=private@example.test#private`;
  const safe = captureAttribution(href);
  for (const name of ["utmSource", "utmMedium", "utmCampaign", "utmId", "utmContent", "utmTerm"]) assert.ok(safe[name].length <= 80);
  assert.ok(safe.fbclid.length <= 500);
  assert.equal(inquirySource(href), "https://weieryangart.com/commission/");
  assert.equal(inquirySource(href, "/sculptures/mirror-lobby-sculpture/"), "https://weieryangart.com/sculptures/mirror-lobby-sculpture/");
  assert.equal(inquirySource(href, "/sculptures/mirror-lobby-sculpture/?email=private@example.test"), "");
  assert.equal(inquirySource(href, "//other.test/"), "");
  assert.ok(!JSON.stringify(safe).includes("private@example.test"));
});

test("malformed referrers, corrupt snapshots and blocked storage preserve usable attribution", () => {
  const href = "https://weieryangart.com/commission/?utm_source=email-sig&utm_campaign=always-on";
  assert.equal(captureAttribution(href, "http://[invalid").utmSource, "email-sig");
  assert.equal(readAttribution(href, "", { getItem() { throw Error("blocked"); } }).utmSource, "email-sig");
  for (const raw of ["{broken", "null", "[]", '"private@example.test"']) {
    const result = readAttribution(href, "", { getItem() { return raw; }, setItem() {} });
    assert.equal(result.utmSource, "email-sig");
  }
  assert.equal(sanitizeAttribution({ utmCampaign: "always-on", utmSource: 123 }).utmSource, "");
});

test("project events map all supported languages and retained drafts to fixed IDs", () => {
  const groups = Object.values(copy).map(entry => entry.commission.options.projectTypes);
  for (const group of groups) {
    for (const value of group) assert.notEqual(analyticsProjectType(value, groups), "unspecified");
  }
  assert.equal(analyticsProjectType("公共艺术", groups), "public-art");
  assert.equal(analyticsProjectType("Hotel lobby / atrium", groups), "hotel-lobby-atrium");
  assert.equal(analyticsProjectType("private@example.test", groups), "unspecified");
  assert.equal(analyticsProjectType({ private: true }, groups), "unspecified");
});

test("analytics build upgrades existing tags, copies the shared module and stays idempotent", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "weieryang-analytics-"));
  try {
    await fs.mkdir(path.join(directory, "dist", "commission"), { recursive: true });
    await fs.writeFile(path.join(directory, "dist", "index.html"), '<html><head><!-- WEIERYANG GTM --><script src="/analytics-events.js" defer></script></head><body></body></html>');
    await fs.writeFile(path.join(directory, "dist", "commission", "index.html"), "<html><head></head><body></body></html>");
    const script = fileURLToPath(new URL("../scripts/inject-analytics.mjs", import.meta.url));
    execFileSync(process.execPath, [script], { cwd: directory });
    const first = await fs.readFile(path.join(directory, "dist", "commission", "index.html"), "utf8");
    execFileSync(process.execPath, [script], { cwd: directory });
    for (const filename of ["index.html", "commission/index.html"]) {
      const html = await fs.readFile(path.join(directory, "dist", filename), "utf8");
      assert.equal((html.match(/<script type="module" src="\/analytics-events\.js"><\/script>/g) || []).length, 1);
    }
    assert.equal(await fs.readFile(path.join(directory, "dist", "commission", "index.html"), "utf8"), first);
    assert.equal(await fs.readFile(path.join(directory, "dist", "attribution.js"), "utf8"), await fs.readFile(new URL("./attribution.js", import.meta.url), "utf8"));
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});
