import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { sculptureCatalog, sculptureProducts, sculptureRoutes, getSculpture } from "./sculptureCatalog.js";
import { catalogUi, localizeSculpture } from "./sculptureCatalogCopy.js";
import { copy } from "./content.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const languages = ["en", "zh", "ar", "fr", "es", "de"];
const expectedPaths = [
  "/sculptures/mirror-lobby-sculpture/", "/sculptures/vertical-atrium-sculpture/",
  "/sculptures/tree-canopy-sculpture/", "/sculptures/bird-landmark-sculpture/",
];
const text = value => typeof value === "string" && value.trim().length > 0;
const pairs = values => Array.isArray(values) && values.every(value => Array.isArray(value) && value.length === 2 && value.every(text));

test("catalog routes identify only the four published directions", () => {
  assert.deepEqual(sculptureProducts.map(product => product.path), expectedPaths);
  assert.deepEqual(sculptureRoutes, ["sculptures", ...expectedPaths.map(route => route.slice(1, -1))]);
  assert.equal(new Set(sculptureProducts.map(product => product.inquiryId)).size, sculptureProducts.length);
  for (const product of sculptureProducts) {
    assert.equal(product.path, `/sculptures/${product.slug}/`);
    assert.equal(getSculpture(product.slug), product);
    assert.equal(getSculpture(product.path), undefined);
    assert.equal(getSculpture(`${product.slug}/`), undefined);
    assert.match(product.inquiryId, /^[a-z0-9][a-z0-9-]{0,79}$/);
    assert.ok(Number.isInteger(product.projectTypeIndex) && product.projectTypeIndex >= 0 && product.projectTypeIndex < copy.en.commission.options.projectTypes.length);
  }
  for (const unknown of [undefined, null, "", "no-such-direction", "mirror-lobby-sculpture/extra", "MIRROR-LOBBY-SCULPTURE"]) {
    assert.equal(getSculpture(unknown), undefined);
  }
});

test("catalog metadata is unique and related routes resolve to actual pages", () => {
  const titles = [sculptureCatalog.title, ...sculptureProducts.map(product => product.metaTitle)];
  const descriptions = [sculptureCatalog.description, ...sculptureProducts.map(product => product.metaDescription)];
  for (const values of [titles, descriptions]) {
    assert.ok(values.every(text));
    assert.equal(new Set(values.map(value => value.trim().toLowerCase())).size, values.length);
  }
  for (const product of sculptureProducts) {
    assert.ok([product.title, product.category, product.intro, product.disclosure].every(text));
    assert.ok(["reference", "construction"].includes(product.evidenceType));
    assert.ok(pairs(product.specification) && pairs(product.faq) && pairs(product.related));
    assert.ok(product.review.length > 0 && product.review.every(text));
    assert.ok(!["offers", "price", "priceCurrency", "sku", "aggregateRating"].some(key => Object.hasOwn(product, key)));
    for (const [, href] of product.related) {
      const target = new URL(href, "https://weieryangart.com");
      assert.equal(target.origin, "https://weieryangart.com");
      const routeFile = path.join(target.pathname.slice(1), "index.html");
      assert.ok([path.join(root, routeFile), path.join(root, "public", routeFile)].some(file => fs.existsSync(file)), `Missing catalog related page: ${href}`);
    }
  }
});

test("catalog image dimensions match the original WebP files", async () => {
  for (const product of sculptureProducts) {
    assert.ok(product.images.length >= 2);
    assert.equal(new Set(product.images.map(image => image.file)).size, product.images.length);
    for (const image of product.images) {
      assert.match(image.file, /^[a-z0-9-]+\.webp$/);
      assert.ok([image.alt, image.caption].every(text));
      assert.ok(Number.isSafeInteger(image.width) && image.width > 0);
      assert.ok(Number.isSafeInteger(image.height) && image.height > 0);
      const metadata = await sharp(path.join(root, "public", "seo-media", image.file)).metadata();
      assert.equal(metadata.format, "webp");
      assert.deepEqual([metadata.width, metadata.height], [image.width, image.height], `Incorrect image dimensions: ${image.file}`);
    }
  }
});

test("six language views preserve canonical paths, metadata and media geometry", () => {
  const snapshot = JSON.stringify(sculptureProducts);
  const uiKeys = Object.keys(catalogUi.en).sort();
  assert.equal(catalogUi.en.indexTitle, sculptureCatalog.h1);
  assert.equal(catalogUi.en.indexIntro, sculptureCatalog.intro);
  for (const language of languages) {
    assert.ok(catalogUi[language], `Missing catalog interface language: ${language}`);
    assert.deepEqual(Object.keys(catalogUi[language]).sort(), uiKeys);
    assert.ok(Object.values(catalogUi[language]).every(text));
    for (const canonical of sculptureProducts) {
      const localized = localizeSculpture(canonical, language);
      if (language === "en") assert.equal(localized, canonical);
      else assert.notEqual(localized, canonical, `Missing product translation: ${language}: ${canonical.slug}`);
      for (const key of ["slug", "path", "inquiryId", "projectTypeIndex", "evidenceType", "metaTitle", "metaDescription"]) {
        assert.equal(localized[key], canonical[key], `Changed canonical field: ${language}: ${key}`);
      }
      assert.ok([localized.title, localized.category, localized.intro, localized.disclosure].every(text));
      for (const key of ["specification", "faq", "related"]) {
        assert.ok(pairs(localized[key]));
        assert.equal(localized[key].length, canonical[key].length);
      }
      assert.equal(localized.review.length, canonical.review.length);
      assert.ok(localized.review.every(text));
      assert.deepEqual(localized.related.map(([, href]) => href), canonical.related.map(([, href]) => href));
      assert.equal(localized.images.length, canonical.images.length);
      localized.images.forEach((image, index) => {
        assert.deepEqual([image.file, image.width, image.height], [canonical.images[index].file, canonical.images[index].width, canonical.images[index].height]);
        assert.ok([image.alt, image.caption].every(text));
      });
    }
  }
  assert.equal(JSON.stringify(sculptureProducts), snapshot, "Localization mutated canonical catalog content");
  assert.equal(localizeSculpture(sculptureProducts[0], "unsupported"), sculptureProducts[0]);
});
