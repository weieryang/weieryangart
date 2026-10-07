import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { readAttribution, safePagePath, isCommissionPath, safeInterestRoute, analyticsProductSlug } from "./attribution.js";

// The browser imports these exact helpers. VM isolates its DOM/window state;
// helpers are provided explicitly because node:vm modules require a CLI flag.
const source = fs.readFileSync(new URL("../public/analytics-events.js", import.meta.url), "utf8")
  .replace(/^import [^\n]+ from "\.\/attribution\.js";\n/, "");
function simulate(url, { saved = new Map(), blocked = false, referrer = "" } = {}) {
  const location = new URL(url);
  const handlers = {};
  let listenerCount = 0;
  const window = { location, sessionStorage: { getItem(key) { if (blocked) throw Error("blocked"); return saved.get(key); }, setItem(key, value) { saved.set(key, value); } } };
  const document = { referrer, addEventListener(event, handler) { listenerCount += 1; handlers[event] = handler; } };
  const context = vm.createContext({ window, document, URL, readAttribution, safePagePath, isCommissionPath, safeInterestRoute, analyticsProductSlug });
  const run = () => vm.runInContext(source, context);
  run();
  return { window, saved, run, listenerCount: () => listenerCount, click(href) { handlers.click({ target: { closest() { return { getAttribute() { return href; } }; } } }); } };
}
test("commission view works without browser storage", () => {
  const client = simulate("https://weieryangart.com/commission/", { blocked: true });
  assert.equal(client.window.dataLayer[0].event, "commission_view");
});
test("first-touch campaign and referral survive navigation to the brief", () => {
  const first = simulate("https://weieryangart.com/resort-sculpture/?utm_source=linkedin&utm_campaign=us-hotel", { referrer: "https://www.google.com/" });
  simulate("https://weieryangart.com/commission/", { saved: first.saved });
  const attribution = JSON.parse(first.saved.get("weieryang-attribution-v2"));
  assert.equal(attribution.landingPath, "/resort-sculpture/");
  assert.equal(attribution.utmSource, "linkedin");
  assert.equal(attribution.utmCampaign, "us-hotel");
  assert.equal(attribution.referrerHost, "www.google.com");
});
test("email click event does not copy email addresses or message text", () => {
  const client = simulate("https://weieryangart.com/resort-sculpture/");
  client.click("mailto:example@example.test?body=PRIVATE-DRAWING-NOTE");
  const event = client.window.dataLayer[0];
  assert.equal(event.event, "contact_click");
  assert.equal(event.contact_method, "email");
  assert.ok(!JSON.stringify(event).includes("example.test"));
  assert.ok(!JSON.stringify(event).includes("PRIVATE-DRAWING-NOTE"));
});
test("supplier-to-brief link is tracked even with a route query", () => {
  const client = simulate("https://weieryangart.com/custom-outdoor-sculpture-supplier/");
  client.click("/commission/?route=us-hotel-procurement");
  assert.equal(client.window.dataLayer[0].event, "commission_open");
});
test("WhatsApp is a contact click, not a completed lead", () => {
  const client = simulate("https://weieryangart.com/resort-sculpture/");
  client.click("https://wa.me/10000000000?text=PRIVATE-NOTE");
  assert.equal(client.window.dataLayer[0].event, "contact_click");
  assert.equal(client.window.dataLayer[0].contact_method, "whatsapp");
  assert.ok(!JSON.stringify(client.window.dataLayer).includes("PRIVATE-NOTE"));
  assert.ok(!client.window.dataLayer.some(event => event.event === "generate_lead"));
});

test("all brief URL variants are same-origin only and emit no arbitrary query", () => {
  const client = simulate("https://weieryangart.com/resort-sculpture/?email=private@example.test");
  for (const href of ["/commission", "/commission/", "/commission/index.html?route=resort-sculpture&email=private@example.test"]) client.click(href);
  assert.equal(client.window.dataLayer.length, 3);
  assert.ok(client.window.dataLayer.every(event => event.event === "commission_open"));
  assert.equal(client.window.dataLayer[2].interest_route, "resort-sculpture");
  for (const href of ["https://other.test/commission/", "//other.test/commission/", "/commissionindex.html", "http://[invalid"]) assert.doesNotThrow(() => client.click(href));
  assert.equal(client.window.dataLayer.length, 3);
  assert.ok(!JSON.stringify(client.window.dataLayer).includes("private@example.test"));
});

test("unregistered routes and WhatsApp lookalikes are not recorded as private values", () => {
  const client = simulate("https://weieryangart.com/");
  client.click("/commission/?route=private@example.test");
  assert.equal(client.window.dataLayer[0].interest_route, "");
  client.click("https://wa.me.evil.test/123?text=PRIVATE-NOTE");
  assert.equal(client.window.dataLayer.length, 1);
});

test("duplicate setup emits one view and installs one click listener", () => {
  const client = simulate("https://weieryangart.com/commission/index.html");
  client.run();
  client.click("MAILTO:private@example.test?body=PRIVATE-NOTE");
  assert.equal(client.listenerCount(), 1);
  assert.deepEqual(client.window.dataLayer.map(event => event.event).join(","), "commission_view,contact_click");
  assert.ok(!JSON.stringify(client.window.dataLayer).includes("PRIVATE-NOTE"));
});

test("phone clicks are contact intent without copying phone numbers or marking a lead", () => {
  const client = simulate("https://weieryangart.com/");
  client.click("tel:+12125550100");
  assert.equal(client.window.dataLayer[0].contact_method, "phone");
  assert.equal(client.window.dataLayer[0].event, "contact_click");
  assert.ok(!JSON.stringify(client.window.dataLayer).includes("12125550100"));
});

test("product view and inquiry intent are whitelisted, private-free and not leads", () => {
  const client = simulate("https://weieryangart.com/sculptures/tree-canopy-sculpture/?email=private@example.test");
  client.click("#product-inquiry");
  client.run();
  client.click("https://other.test/sculptures/tree-canopy-sculpture/#product-inquiry");
  client.click("/sculptures/private-person/#product-inquiry");
  assert.deepEqual(client.window.dataLayer.map(event => event.event).join(","), "product_view,product_inquiry_open");
  assert.ok(client.window.dataLayer.every(event => event.product_slug === "tree-canopy-sculpture"));
  assert.ok(!JSON.stringify(client.window.dataLayer).includes("private@example.test"));
  assert.ok(!client.window.dataLayer.some(event => event.event === "generate_lead"));
  assert.equal(simulate("https://weieryangart.com/sculptures/private-person/").window.dataLayer, undefined);
});
