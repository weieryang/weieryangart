import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { copy } from "./content.js";
import {
  attributionSources, attributionCampaigns, attributionSessionKey, attributionSnapshotKey, attributionAds, inquiryAttributionFieldNames,
  captureAttribution, sanitizeAttribution, readAttribution,
  analyticsAttribution, analyticsProjectType, inquirySource, inquiryAttributionFields, isValidPaidAttribution,
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
  assert.deepEqual(events, { lead_source: "website", campaign_name: "", ad_code: "", creative_variant: "" });
});

test("first touch survives navigation and old snapshots are revalidated", () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  readAttribution("https://weieryangart.com/resort-sculpture/?utm_source=linkedin&utm_campaign=always-on", "https://www.bing.com/search?q=private", storage);
  const result = readAttribution("https://weieryangart.com/commission/?utm_source=facebook", "https://weieryangart.com/resort-sculpture/", storage);
  assert.equal(result.utmSource, "linkedin");
  assert.equal(result.landingPath, "/resort-sculpture/");
  assert.equal(result.referrerHost, "www.bing.com");
  values.delete(attributionSnapshotKey);
  values.set(attributionSessionKey, JSON.stringify({ landingPath: "/?email=private@example.test", utmSource: { private: true }, utmCampaign: "private@example.test", utmContent: "x".repeat(81) }));
  const cleaned = readAttribution("https://weieryangart.com/commission/", "", storage);
  assert.equal(cleaned.landingPath, "/commission/");
  assert.equal(cleaned.utmSource, "");
  assert.equal(cleaned.utmContent, "");
  assert.ok(!values.get(attributionSessionKey).includes("private@example.test"));
});

function sessionStorage(values = new Map()) {
  return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
}

test("direct first touch survives a later paid visit while inquiry and event credit uses the latest paid visit", () => {
  const values = new Map();
  const storage = sessionStorage(values);
  readAttribution("https://weieryangart.com/", "", storage);
  const paidUrl = "https://weieryangart.com/sculptures/bird-landmark-sculpture/?utm_source=facebook&utm_medium=cpc&utm_campaign=2026q4-us-hospitality&utm_id=bird-landmark&utm_content=bird-landmark-a&email=private@example.test";
  const paid = readAttribution(paidUrl, "https://www.facebook.com/", storage);
  const navigated = readAttribution("https://weieryangart.com/commission/", "https://weieryangart.com/sculptures/bird-landmark-sculpture/", storage);
  assert.equal(paid.firstTouch.landingPath, "/");
  assert.equal(navigated.utmSource, ""); // Legacy flat fields still describe first touch.
  assert.equal(navigated.latestPaid.utmSource, "facebook");
  const fields = inquiryAttributionFields(navigated);
  assert.deepEqual(Object.keys(fields).sort(), [...inquiryAttributionFieldNames].sort());
  assert.equal(fields.firstLandingPath, "/");
  assert.equal(fields.firstUtmSource, "");
  assert.equal(fields.landingPath, "/sculptures/bird-landmark-sculpture/");
  assert.equal(fields.utmSource, "facebook");
  assert.equal(fields.referrerHost, "www.facebook.com");
  assert.equal(fields.utmId, "bird-landmark");
  assert.equal(fields.utmContent, "bird-landmark-a");
  assert.deepEqual(analyticsAttribution(navigated), {
    lead_source: "facebook", campaign_name: "2026q4-us-hospitality", ad_code: "bird-landmark", creative_variant: "bird-landmark-a",
  });
  assert.ok(!JSON.stringify([...values.values(), fields, analyticsAttribution(navigated)]).includes("private@example.test"));
});

test("only a registered paid source, medium and campaign replaces the latest advertising attribution", () => {
  const storage = sessionStorage();
  const initial = "https://weieryangart.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=2026q4-us-hospitality&utm_id=bird-landmark&utm_content=bird-landmark-a";
  readAttribution(initial, "", storage);
  for (const query of [
    "", "utm_source=google&utm_medium=cpc", "utm_source=google&utm_medium=cpc&utm_campaign=private-project",
    "utm_source=google&utm_medium=organic&utm_campaign=2026q4-us-hospitality",
    "utm_source=cold-email&utm_medium=cpc&utm_campaign=2026q4-us-hospitality",
  ]) {
    const result = readAttribution(`https://weieryangart.com/commission/?${query}`, "", storage);
    assert.equal(result.latestPaid.utmSource, "facebook");
    assert.equal(result.latestPaid.utmContent, "bird-landmark-a");
  }
  const latest = readAttribution("https://weieryangart.com/sculptures/tree-canopy-sculpture/?utm_source=google&utm_medium=cpc&utm_campaign=2026q4-us-hospitality&utm_id=tree-canopy&utm_content=tree-canopy-b", "", storage);
  assert.equal(latest.firstTouch.utmSource, "facebook");
  assert.equal(latest.latestPaid.utmSource, "google");
  assert.equal(inquiryAttributionFields(latest).utmContent, "tree-canopy-b");
  assert.equal(isValidPaidAttribution({ utmSource: "google", utmMedium: "cpc", utmCampaign: "always-on" }), true);
});

test("ad and creative attribution only accepts registered matching codes, never arbitrary URL text", () => {
  for (const ad of attributionAds) {
    for (const variant of ad.variants) {
      const safe = sanitizeAttribution({ utmCampaign: "2026q4-us-hospitality", utmId: ad.code, utmContent: variant });
      assert.equal(safe.utmId, ad.code);
      assert.equal(safe.utmContent, variant);
    }
  }
  const input = { utmCampaign: "2026q4-us-hospitality", utmId: "bird-landmark", utmContent: "mirror-lobby-a", utmTerm: "private-project", email: "private@example.test" };
  assert.equal(sanitizeAttribution(input).utmContent, "");
  assert.equal(sanitizeAttribution(input).utmTerm, "");
  assert.equal(sanitizeAttribution({ ...input, utmId: "private@example.test", utmContent: "bird-landmark-a" }).utmId, "");
  assert.equal(sanitizeAttribution({ ...input, utmCampaign: "always-on", utmContent: "bird-landmark-a" }).utmId, "");
  assert.equal(sanitizeAttribution({ utmCampaign: "2026q4-us-hospitality", utmContent: "mirror-lobby" }).utmId, "mirror-lobby");
  assert.ok(!JSON.stringify(sanitizeAttribution(input)).includes("private"));
});

test("legacy first-touch migration and corrupt latest-paid data cannot replace the genuine first touch", () => {
  const values = new Map([[attributionSessionKey, JSON.stringify({ landingPath: "/materials/", utmSource: "email-sig", utmCampaign: "always-on" })]]);
  const storage = sessionStorage(values);
  const result = readAttribution("https://weieryangart.com/commission/?utm_source=meta&utm_medium=paid_social&utm_campaign=2026q4-us-hospitality", "", storage);
  assert.equal(result.firstTouch.landingPath, "/materials/");
  assert.equal(result.latestPaid.utmSource, "meta");
  const saved = JSON.parse(values.get(attributionSnapshotKey));
  saved.latestPaid = { landingPath: "/?private@example.test", utmSource: "private@example.test", utmMedium: "cpc", utmCampaign: "private" };
  values.set(attributionSnapshotKey, JSON.stringify(saved));
  const cleaned = readAttribution("https://weieryangart.com/commission/", "", storage);
  assert.equal(cleaned.firstTouch.utmSource, "email-sig");
  assert.equal(cleaned.latestPaid, null);
  assert.equal(inquiryAttributionFields(cleaned).utmSource, "email-sig");
  assert.ok(!values.get(attributionSnapshotKey).includes("private@example.test"));
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
