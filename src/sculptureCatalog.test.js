import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { sculptureCatalog, sculptureProducts, sculptureRoutes, getSculpture } from "./sculptureCatalog.js";
import { catalogUi, localizeSculpture } from "./sculptureCatalogCopy.js";
import { copy } from "./content.js";
import { commissionEvidenceImage, commissionProof, studioIdentity } from "./commissionProof.js";
import { sculptureFallback, sculptureSeoPages } from "../scripts/sculpture-seo.mjs";

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

test("studio identity and construction boundaries are complete in six languages", () => {
  const identityKeys = Object.keys(studioIdentity.en).sort();
  for (const language of languages) {
    assert.deepEqual(Object.keys(studioIdentity[language]).sort(), identityKeys);
    assert.ok(Object.values(studioIdentity[language]).every(text));
    assert.ok(catalogUi[language].indexIntro.includes(studioIdentity[language].body));
    assert.ok(catalogUi[language].scopeBody.includes(studioIdentity[language].capability));
    assert.ok(catalogUi[language].scopeBody.includes(studioIdentity[language].delivery));
    assert.ok(commissionProof[language].body.includes(studioIdentity[language].body));
    assert.equal(commissionProof[language].scope, studioIdentity[language].delivery);
  }
  assert.match(studioIdentity.en.body, /studio and manufacturer based in China/);
  assert.match(studioIdentity.en.body, /client drawings/);
  for (const role of ["designers", "contractors", "suppliers", "developer procurement teams", "private owners"]) {
    assert.ok(studioIdentity.en.body.includes(role));
  }
  assert.match(studioIdentity.en.evidenceBody, /construction-phase photographs, not completed hotel commissions or workshop inspection records/);
  assert.match(studioIdentity.en.delivery, /shipping, on-site services and local installation responsibilities in writing/);
  assert.equal(commissionEvidenceImage.file, "middle-east-stainless-steel-landmark-installation.webp");
});

test("static catalog copy uses the same identity and evidence as the visible site", () => {
  const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  for (const page of sculptureSeoPages) {
    const html = sculptureFallback(page, esc);
    assert.ok(html.includes(esc(studioIdentity.en.body)), page.slug);
    assert.ok(html.includes(esc(studioIdentity.en.capability)), page.slug);
    assert.ok(html.includes(esc(studioIdentity.en.delivery)), page.slug);
    if (page.catalogKind !== "detail") continue;
    assert.equal(html.match(/<h1>[^<]+<\/h1><p>([^<]+)<\/p>/)?.[1], esc(studioIdentity.en.body));
    assert.ok(html.includes(esc(studioIdentity.en.evidenceBody)));
    assert.ok(html.includes('href="/projects/#project-evidence-title"'));
    assert.ok(html.includes('href="/custom-sculpture/"'));
    assert.equal([...html.matchAll(new RegExp(`src="/seo-media/${commissionEvidenceImage.file}"`, "g"))].length, 1, "Construction proof is present once, even on the bird page");
  }
});

test("all localized detail views expose identity and real evidence before the inquiry", async () => {
  const server = await createServer({ configFile: path.join(root, "vite.static.config.mjs"), server: { middlewareMode: true, watch: null }, appType: "custom" });
  const readable = html => html.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
  try {
    const { SculptureDetail } = await server.ssrLoadModule("/src/SculptureCatalog.jsx");
    for (const language of languages) {
      for (const product of sculptureProducts) {
        const html = renderToStaticMarkup(React.createElement(SculptureDetail, { slug: product.slug, language, renderInquiry: () => React.createElement("form", { "data-inquiry-stub": "true" }) }));
        const decoded = readable(html);
        assert.ok(decoded.includes(studioIdentity[language].body), `${language}: ${product.slug}`);
        assert.ok(decoded.includes(studioIdentity[language].capability));
        assert.ok(decoded.includes(studioIdentity[language].evidenceBody));
        assert.ok(decoded.includes(studioIdentity[language].delivery));
        assert.ok(html.indexOf('id="collection-studio-evidence-title"') < html.indexOf('id="product-inquiry"'));
        assert.ok(html.includes(`/seo-media/${commissionEvidenceImage.file}`));
        assert.ok(html.includes('data-inquiry-stub="true"'));
      }
      const unknown = renderToStaticMarkup(React.createElement(SculptureDetail, { slug: "unknown", language, renderInquiry: () => { throw new Error("Unknown routes must not render an inquiry"); } }));
      assert.ok(!unknown.includes("<form"));
    }
  } finally {
    await server.close();
  }
});
