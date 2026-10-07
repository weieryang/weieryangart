import assert from "node:assert/strict";
import test from "node:test";
import { createInquiryEmail } from "./inquiryEmail.js";
import { copy } from "./content.js";
import { sculptureProducts } from "./sculptureCatalog.js";
import { localizeSculpture } from "./sculptureCatalogCopy.js";
import { productInquiryForm } from "./productInquiry.js";

test("email brief keeps project facts but excludes honeypot and blank fields", () => {
  const form = {
    name: "  Lee  ", company: "Hotel & Resort", email: "lee@example.com", phone: "",
    projectType: "Hotel arrival", location: "Dubai", material: "316L steel", scale: "",
    timeline: "2027", installation: "Guidance", message: "Outdoor site\nNear the coast", website: "should-not-appear",
  };
  const labels = Object.fromEntries(Object.keys(form).map((key) => [key, key]));
  const { body, href } = createInquiryEmail(form, labels, "tangkelian@weieryang.com");
  assert.match(body, /name: Lee/);
  assert.match(body, /company: Hotel & Resort/);
  assert.match(body, /message: Outdoor site\nNear the coast/);
  assert.doesNotMatch(body, /website|phone:|scale:/);
  const url = new URL(href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "tangkelian@weieryang.com");
  assert.equal(url.searchParams.get("body"), body);
  assert.match(url.searchParams.get("subject"), /Hotel & Resort/);
});

test("product email and manual copy retain only the registered direction, localized title and canonical source", () => {
  const product = sculptureProducts[0];
  for (const [language, text] of Object.entries(copy)) {
    const message = "x".repeat(5000);
    const form = productInquiryForm({ name: "Pat", company: "Test Hotel", email: "pat@example.test", location: "Miami", message }, product, text.commission.options.projectTypes);
    const { body, href } = createInquiryEmail(form, text.commission.fields, "studio@example.test", {
      product: { slug: product.slug, title: "PRIVATE-UNTRUSTED-TITLE", path: "/?email=private@example.test", inquiryId: "PRIVATE-ID" }, language,
    });
    assert.ok(body.includes(localizeSculpture(product, language).title));
    assert.ok(body.includes(`Product ID: ${product.slug}`));
    assert.ok(body.includes(`Source: https://weieryangart.com${product.path}`));
    assert.equal(new URL(href).searchParams.get("body"), body);
    assert.equal(form.message, message, "Context does not consume the project-message limit");
    assert.ok(!body.includes("PRIVATE-UNTRUSTED-TITLE"));
    assert.ok(!body.includes("private@example.test"));
  }
  const simple = { company: "Test Hotel", message: "A test project" };
  const { body } = createInquiryEmail(simple, { company: "Company", message: "Message" }, "studio@example.test", { product: { slug: "unregistered-product" } });
  assert.ok(!body.includes("Product ID:"));
});
