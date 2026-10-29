import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const source = readFileSync(new URL("../public/ads-consent.js", import.meta.url), "utf8");
const key = "weieryang-ads-measurement-consent-v1";
const lifetime = 180 * 24 * 60 * 60 * 1000;
const now = 1_792_000_000_000;
const plain = value => JSON.parse(JSON.stringify(value));

// A tiny mount fixture exercises real UI handlers without allowing geometry
// reads or page-padding writes to creep back into consent state changes.
function mountedDocument(lang) {
  const elements = [], handlers = new Map(), bodyClasses = [], bodyStyleWrites = [];
  const document = { readyState: "complete", documentElement: { lang }, activeElement: null };
  class Element {
    constructor(tag) { this.tagName = tag.toUpperCase(); this.hidden = false; this.attributes = new Map(); this.handlers = new Map(); this.children = new Map(); }
    set innerHTML(html) {
      this.html = html;
      for (const name of html.match(/data-wy-ads-[a-z]+/g) || []) this.children.set(`[${name}]`, new Element(name.includes("allow") || name.includes("reject") || name.includes("later") ? "button" : "div"));
    }
    querySelector(selector) { return this.children.get(selector); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    addEventListener(type, listener) { this.handlers.set(type, listener); }
    click() { this.handlers.get("click")?.({ target: this }); }
    focus() { document.activeElement = this; }
    getBoundingClientRect() { throw Error("Consent UI must not read geometry to change page padding"); }
  }
  document.createElement = tag => new Element(tag);
  document.body = {
    appendChild(element) { elements.push(element); },
    classList: { add(name) { bodyClasses.push(name); } },
    style: { setProperty(name, value) { bodyStyleWrites.push([name, value]); } },
  };
  document.addEventListener = (type, listener) => handlers.set(type, listener);
  document.fire = (type, event) => handlers.get(type)?.(event);
  document.fixture = { elements, bodyClasses, bodyStyleWrites };
  return document;
}

function browser({ raw = null, storageBlocked = false, existing = [], mount = false, lang = "en" } = {}) {
  const values = new Map(raw === null ? [] : [[key, raw]]);
  const window = {
    dataLayer: existing,
    location: { href: "https://weieryangart.com/commission/?ads_consent=granted" },
    localStorage: {
      getItem(name) { if (storageBlocked) throw Error("blocked"); return values.get(name) ?? null; },
      setItem(name, value) { if (storageBlocked) throw Error("blocked"); values.set(name, value); },
    },
  };
  const document = mount ? mountedDocument(lang) : { readyState: "loading", documentElement: { lang }, addEventListener() {} };
  class Clock extends Date { static now() { return now; } }
  const context = vm.createContext({ window, document, Date: Clock });
  vm.runInContext(source, context);
  return { window, values, context, document, api: window.wyAdsConsent, entries: () => window.dataLayer.map(plain) };
}
const ready = b => b.entries().filter(entry => entry.event === "wy_ads_measurement_ready");

test("no choice denies only advertising before any ready event, without changing existing analytics", () => {
  const b = browser({ existing: [{ event: "existing_ga4_event" }] });
  assert.equal(b.entries()[0].event, "existing_ga4_event");
  assert.deepEqual(b.entries()[1], { 0: "consent", 1: "default", 2: { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" } });
  assert.deepEqual(b.entries()[2], { 0: "set", 1: "ads_data_redaction", 2: true });
  assert.equal(b.api.getState().allowed, false);
  assert.equal(ready(b).length, 0);
  assert.ok(!JSON.stringify(b.entries()).includes("analytics_storage"));
  assert.equal(b.window.location.href.includes("ads_consent=granted"), true);
});

test("corrupt, expired, future or wrong-version stored choices fail closed", () => {
  const base = { v: 1, choice: "granted", savedAt: now - 100, expiresAt: now - 100 + lifetime };
  const records = ["not JSON", "true", JSON.stringify({ ...base, v: 2 }), JSON.stringify({ ...base, choice: true }), JSON.stringify({ ...base, savedAt: now - lifetime, expiresAt: now }), JSON.stringify({ ...base, savedAt: now + 1, expiresAt: now + 1 + lifetime }), JSON.stringify({ ...base, expiresAt: now + lifetime * 10 })];
  for (const raw of records) {
    const b = browser({ raw });
    assert.equal(b.api.getState().allowed, false);
    assert.equal(ready(b).length, 0);
  }
});

test("a genuine allow updates measurement consent before one ready event and stores only the choice", () => {
  const b = browser();
  b.api.choose(true);
  const entries = b.entries();
  assert.deepEqual(entries.at(-2), { 0: "consent", 1: "update", 2: { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied" } });
  assert.deepEqual(entries.at(-1), { event: "wy_ads_measurement_ready", wy_ads_measurement: true });
  assert.deepEqual(JSON.parse(b.values.get(key)), { v: 1, choice: "granted", savedAt: now, expiresAt: now + lifetime });
  b.api.choose(true);
  assert.equal(ready(b).length, 1);
  assert.ok(!JSON.stringify(entries).includes("generate_lead"));
});

test("withdrawal turns off the gate before denied update and does not replay any inquiry", () => {
  const b = browser();
  b.api.choose(true);
  const start = b.entries().length;
  b.api.choose(false);
  assert.deepEqual(b.entries().slice(start), [{ wy_ads_measurement: false }, { 0: "consent", 1: "update", 2: { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" } }]);
  assert.equal(b.api.getState().allowed, false);
  assert.equal(ready(b).length, 1);
  assert.equal(JSON.parse(b.values.get(key)).choice, "denied");
});

test("saved explicit allow is restored but saved deny never emits ready", () => {
  for (const choice of ["granted", "denied"]) {
    const b = browser({ raw: JSON.stringify({ v: 1, choice, savedAt: now - 100, expiresAt: now - 100 + lifetime }) });
    assert.equal(b.api.getState().allowed, choice === "granted");
    assert.equal(b.api.getState().saved, true);
    assert.equal(ready(b).length, choice === "granted" ? 1 : 0);
    assert.equal(b.entries()[0][1], "default");
  }
});

test("blocked storage has no implied consent but a current-page explicit choice remains honest", () => {
  const b = browser({ storageBlocked: true });
  assert.equal(b.api.getState().allowed, false);
  b.api.choose(true);
  assert.deepEqual(plain(b.api.getState()), { allowed: true, choice: true, saved: false });
  assert.equal(ready(b).length, 1);
  assert.equal(b.values.size, 0);
  const nextPage = browser({ storageBlocked: true });
  assert.equal(nextPage.api.getState().allowed, false);
});

test("truthy strings and repeated script loading cannot inject or duplicate consent", () => {
  const b = browser();
  b.api.choose("granted");
  b.api.choose(1);
  assert.equal(b.api.getState().allowed, false);
  const size = b.entries().length;
  vm.runInContext(source, b.context);
  assert.equal(b.entries().length, size);
  assert.equal(ready(b).length, 0);
});

test("first mount remains unknown and denied, with a collapsed panel and a visible off setting in six languages", () => {
  const labels = {
    en: "Ads measurement off · Settings", zh: "广告测量关闭 · 设置", ar: "قياس الإعلانات معطل · الإعدادات",
    fr: "Mesure publicitaire désactivée · Réglages", es: "Medición publicitaria desactivada · Ajustes", de: "Werbemessung aus · Einstellungen",
  };
  for (const [lang, label] of Object.entries(labels)) {
    const b = browser({ mount: true, lang });
    const [panel, settings] = b.document.fixture.elements;
    assert.deepEqual(plain(b.api.getState()), { allowed: false, choice: null, saved: false });
    assert.equal(ready(b).length, 0);
    assert.equal(b.values.size, 0);
    assert.equal(panel.hidden, true);
    assert.equal(settings.hidden, false);
    assert.equal(settings.textContent, label);
    assert.equal(settings.getAttribute("aria-expanded"), "false");
    assert.equal(panel.dir, lang === "ar" ? "rtl" : "ltr");
    assert.deepEqual(b.document.fixture.bodyStyleWrites, []);
    assert.deepEqual(b.document.fixture.bodyClasses, []);
  }
});

test("settings opens the full choices; Later, Escape and form focus only dismiss and never save or grant", () => {
  const b = browser({ mount: true });
  const [panel, settings] = b.document.fixture.elements;
  const start = b.entries().length;
  settings.click();
  assert.equal(panel.hidden, false);
  assert.equal(settings.hidden, true);
  assert.equal(panel.querySelector("[data-wy-ads-allow]").textContent, "Allow measurement");
  assert.equal(panel.querySelector("[data-wy-ads-reject]").textContent, "Keep Ads off");
  assert.equal(panel.querySelector("[data-wy-ads-later]").textContent, "Later");
  assert.equal(panel.querySelector("[data-wy-ads-privacy]").textContent, "Privacy notice");
  panel.querySelector("[data-wy-ads-later]").click();
  assert.equal(panel.hidden, true);
  assert.equal(b.document.activeElement, settings);
  settings.click();
  b.document.fire("keydown", { key: "Escape" });
  assert.equal(panel.hidden, true);
  settings.click();
  b.document.fire("focusin", { target: { closest: selector => selector === "form" ? {} : null } });
  assert.equal(panel.hidden, true);
  assert.equal(settings.hidden, false);
  assert.deepEqual(plain(b.api.getState()), { allowed: false, choice: null, saved: false });
  assert.equal(b.values.size, 0);
  assert.deepEqual(b.entries().slice(start), []);
  assert.deepEqual(b.document.fixture.bodyStyleWrites, []);
});

test("mounted allow and withdrawal keep the original event order and restore focus to an accurately labelled setting", () => {
  const b = browser({ mount: true });
  const [panel, settings] = b.document.fixture.elements;
  settings.click();
  panel.querySelector("[data-wy-ads-allow]").click();
  assert.equal(panel.hidden, true);
  assert.equal(settings.textContent, "Ads measurement on · Settings");
  assert.deepEqual(b.entries().slice(-2), [
    { 0: "consent", 1: "update", 2: { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied" } },
    { event: "wy_ads_measurement_ready", wy_ads_measurement: true },
  ]);
  settings.click();
  const start = b.entries().length;
  panel.querySelector("[data-wy-ads-reject]").click();
  assert.deepEqual(b.entries().slice(start), [
    { wy_ads_measurement: false },
    { 0: "consent", 1: "update", 2: { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" } },
  ]);
  assert.equal(panel.hidden, true);
  assert.equal(settings.hidden, false);
  assert.equal(settings.textContent, "Ads measurement off · Settings");
  assert.equal(b.document.activeElement, settings);
  assert.equal(ready(b).length, 1);
  assert.deepEqual(b.document.fixture.bodyStyleWrites, []);
});

test("blocked-storage UI keeps a genuine current-page choice and its warning visible, without pretending it was saved", () => {
  const b = browser({ mount: true, storageBlocked: true });
  const [panel, settings] = b.document.fixture.elements;
  settings.click();
  panel.querySelector("[data-wy-ads-allow]").click();
  assert.deepEqual(plain(b.api.getState()), { allowed: true, choice: true, saved: false });
  assert.equal(panel.hidden, false);
  assert.equal(panel.querySelector("[data-wy-ads-status]").hidden, false);
  assert.match(panel.querySelector("[data-wy-ads-status]").textContent, /could not be saved/);
  assert.equal(b.values.size, 0);
  assert.equal(ready(b).length, 1);
  panel.querySelector("[data-wy-ads-later]").click();
  assert.equal(panel.hidden, true);
  assert.deepEqual(plain(b.api.getState()), { allowed: true, choice: true, saved: false });
  const nextPage = browser({ mount: true, storageBlocked: true });
  assert.deepEqual(plain(nextPage.api.getState()), { allowed: false, choice: null, saved: false });
  assert.equal(nextPage.document.fixture.elements[0].hidden, true);
  assert.equal(ready(nextPage).length, 0);
});

test("injector places consent before fresh and existing GTM loaders and is byte-idempotent", () => {
  const root = mkdtempSync(path.join(tmpdir(), "weieryang-consent-test-"));
  try {
    mkdirSync(path.join(root, "dist"));
    writeFileSync(path.join(root, "dist", "new.html"), '<html><head><meta charset="UTF-8"></head><body>New</body></html>');
    writeFileSync(path.join(root, "dist", "existing.html"), '<html><head><!-- WEIERYANG GTM --><script src="https://www.googletagmanager.com/gtm.js?id=GTM-NV6T388X"></script><script src="/analytics-events.js"></script></head><body>Existing</body></html>');
    const run = () => spawnSync(process.execPath, [fileURLToPath(new URL("../scripts/inject-analytics.mjs", import.meta.url))], { cwd: root, encoding: "utf8" });
    assert.equal(run().status, 0);
    const before = {};
    for (const name of ["new.html", "existing.html"]) {
      const html = readFileSync(path.join(root, "dist", name), "utf8");
      assert.equal(html.match(/src="\/ads-consent\.js"/g)?.length, 1);
      assert.equal(html.match(/href="\/ads-consent\.css"/g)?.length, 1);
      assert.ok(html.indexOf('src="/ads-consent.js"') < html.indexOf("<!-- WEIERYANG GTM -->"));
      assert.ok(html.includes("GTM-NV6T388X"));
      assert.ok(html.includes('<script type="module" src="/analytics-events.js"></script>'));
      before[name] = html;
    }
    assert.equal(run().status, 0);
    for (const name of Object.keys(before)) assert.equal(readFileSync(path.join(root, "dist", name), "utf8"), before[name]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
