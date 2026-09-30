import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../public/analytics-events.js", import.meta.url), "utf8");
function simulate(url, { saved = new Map(), blocked = false, referrer = "" } = {}) {
  const location = new URL(url);
  const handlers = {};
  const window = { location, sessionStorage: { getItem(key) { if (blocked) throw Error("blocked"); return saved.get(key); }, setItem(key, value) { saved.set(key, value); } } };
  const document = { referrer, addEventListener(event, handler) { handlers[event] = handler; } };
  vm.runInNewContext(source, { window, document, location, URL });
  return { window, saved, click(href) { handlers.click({ target: { closest() { return { getAttribute() { return href; } }; } } }); } };
}
test("commission view works without browser storage", () => {
  const client = simulate("https://weieryangart.com/commission/", { blocked: true });
  assert.equal(client.window.dataLayer[0].event, "commission_view");
});
test("first-touch campaign and referral survive navigation to the brief", () => {
  const first = simulate("https://weieryangart.com/resort-sculpture/?utm_source=test&utm_campaign=us-hotel", { referrer: "https://www.google.com/" });
  simulate("https://weieryangart.com/commission/", { saved: first.saved });
  const attribution = JSON.parse(first.saved.get("weieryang-attribution-v2"));
  assert.equal(attribution.landingPath, "/resort-sculpture/");
  assert.equal(attribution.utmSource, "test");
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
