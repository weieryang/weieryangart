import test from "node:test";
import assert from "node:assert/strict";
import { copy } from "./content.js";
import { sculptureProducts } from "./sculptureCatalog.js";
import { productInquiryCopy } from "./productInquiryCopy.js";
import { validateInquiry, sendInquiry } from "./inquiryForm.js";
import { handleInquiryRequest } from "../worker/inquiries.mjs";
import { analyticsProductSlugs, analyticsProductSlug, safeInterestRoute, inquirySource, analyticsProjectType } from "./attribution.js";
import { productInquiryFields, productInquiryContext, productInquiryDraftKey, productInquiryDraft, productInquiryForm, inquiryEventContext } from "./productInquiry.js";

const facts = { name: "Pat", customerRole: "private-owner", email: "pat@example.test", location: "Miami, FL, USA", message: "Review a lobby sculpture direction." };
const optionGroups = Object.values(copy).map(entry => entry.commission.options.projectTypes);

test("each registered product accepts five core inputs without company in all languages", () => {
  assert.equal(productInquiryFields.length, 5);
  for (const product of sculptureProducts) {
    for (const [language, text] of Object.entries(copy)) {
      const options = text.commission.options.projectTypes;
      assert.equal(options.length, 8, language);
      const form = productInquiryForm(facts, product, options);
      assert.deepEqual(validateInquiry(form), {}, `${product.slug}/${language}`);
      assert.equal(form.projectType, options[product.projectTypeIndex]);
      assert.notEqual(analyticsProjectType(form.projectType, optionGroups), "unspecified");
    }
  }
});

test("product drafts have separate keys and never inherit full-brief optional fields or category overrides", () => {
  const keys = sculptureProducts.map(productInquiryDraftKey);
  assert.equal(new Set(keys).size, sculptureProducts.length);
  assert.ok(keys.every(key => key !== "weieryang-private-brief-v2"));
  const contaminated = { ...facts, projectType: "Private overriding category", phone: "+12125550100", material: "Private material note", files: ["private-plan.pdf"], website: "stale" };
  const draft = productInquiryDraft(contaminated);
  for (const key of productInquiryFields) assert.equal(draft[key], facts[key]);
  assert.equal(draft.phone, "+12125550100", "Explicit optional contact details stay in this product draft");
  assert.equal(draft.material, undefined);
  const form = productInquiryForm(contaminated, sculptureProducts[0], copy.en.commission.options.projectTypes);
  assert.equal(form.projectType, "Hotel lobby / atrium");
  for (const field of ["material", "scale", "timeline", "installation", "website"]) assert.equal(form[field], "");
  assert.equal(form.phone, "+12125550100");
  assert.equal(form.formVariant, "product-role-v2");
  assert.equal(form.company, "", "A private owner is not given a fabricated company");
  assert.equal(form.files, undefined);
  assert.equal(productInquiryDraft({ name: null, company: {} }).name, "");
});

test("product lookup ignores supplied context overrides and rejects unknown or personal slugs", () => {
  const product = sculptureProducts[0];
  const context = productInquiryContext({ slug: product.slug, path: "https://other.test/", inquiryId: "private@example.test", projectTypeIndex: 7, title: "Private title" });
  assert.equal(context.path, product.path);
  assert.equal(context.inquiryId, product.inquiryId);
  assert.equal(context.projectTypeIndex, product.projectTypeIndex);
  assert.equal(context.title, product.title);
  for (const slug of ["private@example.test", "unregistered-sculpture", "../commission", "x".repeat(81), null]) {
    assert.equal(productInquiryContext(slug), null);
    assert.equal(productInquiryDraftKey(slug), "");
    assert.equal(inquiryEventContext("product", slug), null);
    assert.throws(() => productInquiryForm(facts, slug, copy.en.commission.options.projectTypes));
  }
  assert.throws(() => productInquiryForm(facts, product, ["Incomplete categories"]));
});

test("canonical paths and event context carry only the registered product slug", () => {
  assert.deepEqual([...analyticsProductSlugs].sort(), sculptureProducts.map(product => product.slug).sort());
  for (const product of sculptureProducts) {
    assert.equal(safeInterestRoute(product.inquiryId), product.slug);
    for (const pathname of [product.path, product.path.slice(0, -1), `${product.path}index.html`]) assert.equal(analyticsProductSlug(pathname), product.slug);
    assert.equal(analyticsProductSlug(`${product.path}?email=private@example.test`), "");
    assert.equal(inquirySource(`https://weieryangart.com${product.path}?email=private@example.test`, productInquiryContext(product).path), `https://weieryangart.com${product.path}`);
    const metadata = inquiryEventContext("product", { ...product, company: "PRIVATE-COMPANY", message: "PRIVATE-MESSAGE" });
    assert.deepEqual(metadata, { form_name: "product_inquiry", product_slug: product.slug });
    assert.ok(!Object.hasOwn(metadata, "event"), "Context alone must not declare a completed lead");
  }
  for (const value of ["/sculptures/unknown/", "/sculptures/", "/sculptures/bird-landmark-sculptureindex.html", "/sculptures/private@example.test/"]) assert.equal(analyticsProductSlug(value), "");
  assert.deepEqual(inquiryEventContext("full", sculptureProducts[0]), { form_name: "private_commission_brief" });
  assert.equal(inquirySource("https://weieryangart.com/?email=private@example.test"), "https://weieryangart.com/commission/");
});

test("short inquiries use the existing Worker, verification and confirmed-response contract without real email", async () => {
  const product = sculptureProducts[3];
  const emails = [];
  const env = {
    INQUIRY_RATE: { async limit() { return { success: true }; } },
    TURNSTILE_SECRET: "local-test-secret",
    EMAIL: { async send(email) { emails.push(email); } },
  };
  const verified = { fetch: async () => Response.json({ success: true, hostname: "weieryangart.com", action: "commission" }) };
  const body = new FormData();
  Object.entries(productInquiryForm({ ...facts, projectType: "Untrusted draft" }, product, copy.en.commission.options.projectTypes, { submitting: true })).forEach(([key, value]) => body.append(key, value));
  body.set("source", inquirySource("https://weieryangart.com/", product.path));
  body.set("interestRoute", productInquiryContext(product).inquiryId);
  body.set("cf-turnstile-response", "local-test-token");
  const result = await sendInquiry("https://worker.example.test/inquiries", body, {
    fetcher: async (_, options) => handleInquiryRequest(new Request("https://worker.example.test/inquiries", { method: "POST", headers: { Origin: "https://weieryangart.com" }, body: options.body }), env, verified),
  });
  assert.equal(emails.length, 1);
  assert.equal(result.notifications.email, true);
  assert.equal(result.attachedFiles, 0);
  assert.match(emails[0].text, /Project type: Public art/);
  assert.match(emails[0].text, /Customer role: Private owner/);
  assert.doesNotMatch(emails[0].text, /Company:/);
  assert.match(emails[0].text, /Interest route: bird-landmark-sculpture/);
  assert.match(emails[0].text, /Source: \/sculptures\/bird-landmark-sculpture\//);
  assert.doesNotMatch(emails[0].text, /Untrusted draft/);

  body.set("cf-turnstile-response", "");
  await assert.rejects(sendInquiry("https://worker.example.test/inquiries", body, {
    fetcher: async (_, options) => handleInquiryRequest(new Request("https://worker.example.test/inquiries", { method: "POST", headers: { Origin: "https://weieryangart.com" }, body: options.body }), env, verified),
  }));
  assert.equal(emails.length, 1, "No verification cannot produce a second delivery");
});

test("short draft restoration clears stale honeypots but submission retains an actual filled trap", () => {
  const product = sculptureProducts[0];
  const raw = { ...facts, website: "bot-filled-value" };
  assert.equal(productInquiryForm(raw, product, copy.en.commission.options.projectTypes).website, "");
  assert.equal(productInquiryForm(raw, product, copy.en.commission.options.projectTypes, { submitting: true }).website, "bot-filled-value");
});

test("short form instructions and safe delivery wording exist for all six interface languages", () => {
  for (const language of Object.keys(copy)) {
    for (const field of Object.keys(productInquiryCopy.en)) assert.ok(productInquiryCopy[language][field], `${language}/${field}`);
  }
});
