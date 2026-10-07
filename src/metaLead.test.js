import test from "node:test";
import assert from "node:assert/strict";
import { confirmedMetaLead, createMetaLeadTracker, metaLeadConfig, metaLeadDedupKey, sendExistingMetaPixel, trackConfirmedMetaLead } from "./metaLead.js";

const delivered = { reference: "WY-20261007-ABCDEF12", notifications: { email: true, whatsapp: false } };
const productContext = { form_name: "product_inquiry", product_slug: "bird-landmark-sculpture", project_type: "public-art", language: "en" };
const fullContext = { form_name: "private_commission_brief", project_type: "hotel-lobby-atrium", language: "zh" };
const pixelId = "123456789012345"; // Test fixture only, never installed.
function enabledTracker(overrides = {}) {
  return createMetaLeadTracker({ enabled: true, pixelId, consentPolicyConfigured: true, getMarketingConsent: () => true, getStorage: () => undefined, ...overrides });
}

test("production defaults remain dormant without reading browser state or sending", async () => {
  assert.deepEqual(metaLeadConfig, { enabled: false, pixelId: "", consentPolicyConfigured: false });
  const previous = globalThis.window;
  globalThis.window = new Proxy({}, { get() { throw Error("No browser state should be accessed while disabled"); } });
  try {
    assert.deepEqual(await trackConfirmedMetaLead(delivered, productContext), { status: "disabled" });
    const blocked = () => { throw Error("Disabled tracking must perform no I/O"); };
    assert.deepEqual(await createMetaLeadTracker({ sendEvent: blocked, getStorage: blocked, getMarketingConsent: blocked })(delivered, productContext), { status: "disabled" });
  } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});

test("missing ID, agreement, consent or revoked consent prevents all Meta dispatch", async () => {
  let calls = 0;
  const sendEvent = () => { calls += 1; return true; };
  for (const override of [{ enabled: false }, { pixelId: "" }, { pixelId: "private@example.test" }, { consentPolicyConfigured: false }, { getMarketingConsent: () => false }, { getMarketingConsent: () => "granted" }, { getMarketingConsent() { throw Error("blocked"); } }]) {
    assert.equal((await enabledTracker({ sendEvent, ...override })(delivered, productContext)).status, "disabled");
  }
  let consent = true;
  const track = enabledTracker({ sendEvent, getMarketingConsent: () => consent });
  assert.equal((await track(delivered, productContext)).status, "queued");
  consent = false;
  assert.equal((await track({ ...delivered, reference: "WY-20261007-1234ABCD" }, productContext)).status, "disabled");
  assert.equal(calls, 1);
});

test("clicks, failed validation, missing verification and unconfirmed email are never Lead", async () => {
  let calls = 0;
  const track = enabledTracker({ sendEvent() { calls += 1; return true; } });
  for (const result of [undefined, {}, { event: "contact_click" }, { event: "generate_lead", event_id: delivered.reference }, { reference: delivered.reference }, { ...delivered, notifications: { email: false } }, { ...delivered, notifications: { email: "true" } }, { ...delivered, reference: "private@example.test" }, { ...delivered, reference: delivered.reference.toLowerCase() }]) {
    assert.equal((await track(result, productContext)).status, "invalid");
  }
  assert.equal(calls, 0);
});

test("Lead accepts only registered context and the product's fixed project category", () => {
  assert.deepEqual(confirmedMetaLead(delivered, productContext), { eventName: "Lead", eventId: delivered.reference, parameters: productContext });
  assert.equal(confirmedMetaLead(delivered, fullContext).parameters.product_slug, "");
  for (const context of [null, [], { ...productContext, email: "private@example.test" }, { ...productContext, form_name: "button_click" }, { ...productContext, product_slug: "private-project" }, { ...productContext, project_type: "private@example.test" }, { ...productContext, project_type: "hotel-lobby-atrium" }, { ...productContext, language: "private" }, { ...fullContext, product_slug: "bird-landmark-sculpture" }]) {
    assert.equal(confirmedMetaLead(delivered, context), null);
  }
});

test("concurrent calls and later navigation queue one Lead per confirmed reference", async () => {
  let resolveSend;
  const calls = [];
  const values = new Map();
  const getStorage = () => ({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) });
  const first = enabledTracker({ getStorage, sendEvent(event) { calls.push(event); return new Promise(resolve => { resolveSend = resolve; }); } });
  const pending = first(delivered, productContext);
  assert.equal((await first(delivered, productContext)).status, "duplicate");
  resolveSend(true);
  assert.equal((await pending).status, "queued");
  const afterNavigation = enabledTracker({ getStorage, sendEvent(event) { calls.push(event); return true; } });
  assert.equal((await afterNavigation(delivered, productContext)).status, "duplicate");
  assert.equal((await afterNavigation({ ...delivered, reference: "WY-20261007-1234ABCD" }, fullContext)).status, "queued");
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], { pixelId, eventName: "Lead", eventId: delivered.reference, parameters: productContext });
  assert.deepEqual(JSON.parse(values.get(metaLeadDedupKey)), [`${pixelId}:${delivered.reference}`, `${pixelId}:WY-20261007-1234ABCD`]);
});

test("blocked or corrupt storage remains safe; dispatch failure cannot break inquiry success", async () => {
  for (const getStorage of [() => { throw Error("blocked"); }, () => ({ getItem: () => "{broken", setItem() { throw Error("quota"); } })]) {
    let calls = 0;
    const track = enabledTracker({ getStorage, sendEvent() { calls += 1; return true; } });
    assert.equal((await track(delivered, productContext)).status, "queued");
    assert.equal((await track(delivered, productContext)).status, "duplicate");
    assert.equal(calls, 1);
  }
  for (const sendEvent of [() => false, () => { throw Error("not available"); }, () => Promise.reject(Error("not available"))]) {
    assert.equal((await enabledTracker({ sendEvent })(delivered, fullContext)).status, "unavailable");
  }
});

test("existing-Pixel adapter uses Lead with eventID option and no personal fields or page-view calls", () => {
  const previous = globalThis.window;
  const calls = [];
  try {
    globalThis.window = { location: { origin: "https://weieryangart.com" }, fbq: (...args) => calls.push(args) };
    assert.equal(sendExistingMetaPixel({ pixelId, ...confirmedMetaLead({ ...delivered, email: "private@example.test", source: "https://weieryangart.com/?private-project" }, productContext) }), true);
    assert.deepEqual(calls, [["trackSingle", pixelId, "Lead", productContext, { eventID: delivered.reference }]]);
    assert.ok(!JSON.stringify(calls).includes("private"));
    globalThis.window.location.origin = "http://127.0.0.1:4173";
    assert.equal(sendExistingMetaPixel({ pixelId, ...confirmedMetaLead(delivered, productContext) }), false);
    assert.equal(calls.length, 1);
    delete globalThis.window.fbq;
    globalThis.window.location.origin = "https://weieryangart.com";
    assert.equal(sendExistingMetaPixel({ pixelId, ...confirmedMetaLead(delivered, productContext) }), false);
  } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});
