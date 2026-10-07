import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { hospitalityService, hospitalitySections, hospitalityPlanning } from "../src/hospitalityContent.js";
import { copy } from "../src/content.js";
import { hotelCases, hotelCaseImages } from "../src/hotelCases.js";
import { routeSeoContent } from "../src/seoContent.js";
import { commissionEvidenceImage, commissionProof } from "../src/commissionProof.js";
import { sculptureCatalog, sculptureProducts, sculptureRoutes } from "../src/sculptureCatalog.js";
import { safeInterestRoute } from "../src/attribution.js";

const root = path.resolve("dist");
const base = "https://weieryangart.com";
const urls = [...fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replace(/&#(?:39|x27);/gi, "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
let imageCount = 0, schemaCount = 0, staticCount = 0;
const documents = new Map();
const titles = new Map(), descriptions = new Map();
for (const url of urls) {
  const route = new URL(url).pathname;
  const file = path.join(root, route, "index.html");
  assert.ok(fs.existsSync(file), `Missing page: ${route}`);
  const html = fs.readFileSync(file, "utf8");
  documents.set(route, html);
  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `H1 count: ${route}`);
  assert.match(html, /<title>[^<]+<\/title>/, `Title: ${route}`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `Description: ${route}`);
  for (const [label, value, seen] of [
    ["title", html.match(/<title>([^<]+)<\/title>/)[1], titles],
    ["description", html.match(/<meta name="description" content="([^"]+)"/)[1], descriptions],
  ]) {
    assert.ok(!seen.has(value), `Duplicate ${label}: ${route} and ${seen.get(value)}`);
    seen.set(value, route);
  }
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Canonical: ${route}`);
  assert.ok(html.includes("GTM-NV6T388X"), `GTM: ${route}`);
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    JSON.parse(match[1]); schemaCount++;
  }
  if (!html.includes('id="root"')) staticCount++;
  assert.equal([...html.matchAll(/<header class="wy-top"/g)].length, 1, `Shared header: ${route}`);
  assert.equal([...html.matchAll(/<footer class="wy-footer"/g)].length, 1, `Shared footer: ${route}`);
  assert.ok(html.includes('href="/privacy/"'), `Privacy link: ${route}`);
  assert.ok(html.includes('href="/faq/"'), `Crawlable FAQ entry: ${route}`);
  assert.ok(html.includes('href="/sculptures/"'), `Crawlable collection entry: ${route}`);
  if (html.includes('id="root"')) {
    assert.ok(html.includes('class="seo-static-frame"'), `Static app frame: ${route}`);
    assert.match(html, /html\.js\s+\.seo-static-frame\s*\{\s*display:\s*none;/, `No fallback flash: ${route}`);
  }
  for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*\b(?:href|src)="([^"]+)"[^>]*>/g)) {
    const link = new URL(decode(match[2]), url);
    if (link.origin !== base) continue;
    const target = path.join(root, decodeURIComponent(link.pathname));
    assert.ok(fs.existsSync(target) || fs.existsSync(path.join(target, "index.html")), `Missing local target ${link.pathname} on ${route}`);
    if (match[1] !== "img") continue;
    imageCount++;
    assert.match(link.pathname, /\.webp$/, `Non-WebP content image: ${route}`);
    assert.match(match[0], /\balt="[^"]*"/, `Image alt: ${route}`);
    for (const candidate of (match[0].match(/srcset="([^"]+)"/)?.[1] || "").split(",").filter(Boolean)) {
      assert.ok(fs.existsSync(path.join(root, candidate.trim().split(/\s+/)[0])), `Missing image variant: ${candidate}`);
    }
  }
}

// Follow plain HTML links from the homepage: a Sitemap entry alone cannot keep
// a route from becoming an orphan when client-side navigation changes.
const linkGraph = new Map();
for (const [route, html] of documents) {
  const outgoing = new Set();
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const target = new URL(decode(match[1]), `${base}${route}`);
    if (target.origin === base && documents.has(target.pathname)) outgoing.add(target.pathname);
  }
  linkGraph.set(route, outgoing);
}
const depth = new Map([["/", 0]]), queue = ["/"];
for (const route of queue) {
  for (const target of linkGraph.get(route)) {
    if (!depth.has(target)) { depth.set(target, depth.get(route) + 1); queue.push(target); }
  }
}
for (const route of documents.keys()) {
  assert.ok(depth.has(route), `Orphan in static HTML: ${route}`);
  assert.ok(depth.get(route) <= 3, `Static click depth exceeds 3: ${route}`);
}

// Standalone article analytics use copied ES modules rather than Vite's
// bundle. Verify their relative imports as the inquiry registry grows.
const analyticsModules = new Set(), analyticsQueue = ["/analytics-events.js"];
for (const modulePath of analyticsQueue) {
  if (analyticsModules.has(modulePath)) continue;
  analyticsModules.add(modulePath);
  const filename = path.join(root, modulePath);
  assert.ok(fs.existsSync(filename), `Missing analytics module: ${modulePath}`);
  const source = fs.readFileSync(filename, "utf8");
  for (const match of source.matchAll(/\b(?:import|export)\s+(?:[^"'`;]*?\s+from\s*)?["'](\.{1,2}\/[^"']+)["']/g)) {
    analyticsQueue.push(new URL(match[1], `${base}${modulePath}`).pathname);
  }
}

for (const [route, content] of Object.entries(routeSeoContent)) {
  const html = documents.get(`/${route}/`);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const faq = graph.filter(item => item["@type"] === "FAQPage");
  assert.equal(faq.length, 1, `Exactly one FAQPage: ${route}`);
  assert.deepEqual(faq[0].mainEntity.map(item => [item.name, item.acceptedAnswer.text]), content.faq, `Static/schema FAQ source: ${route}`);
  const readable = decode(html);
  for (const [question, answer] of content.faq) {
    assert.ok(readable.includes(question) && readable.includes(answer), `Static FAQ missing: ${route}: ${question}`);
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  for (const [label, href] of content.related) {
    assert.ok(main.includes(`href="${href}"`) && decode(main).includes(label), `Static related link missing: ${route} -> ${href}`);
  }
}
const hotelHtml = fs.readFileSync(path.join(root, "resort-sculpture/index.html"), "utf8");
const graph = JSON.parse(hotelHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
assert.deepEqual(graph.find(item => item["@type"] === "FAQPage").mainEntity.map(item => [item.name, item.acceptedAnswer.text]), hospitalityService.faq);
assert.equal(graph.filter(item => item["@type"] === "Service").length, 1);
assert.ok(graph.some(item => item["@type"] === "WebPage" && item.mainEntity?.["@id"]?.endsWith("#service")));
assert.ok(copy.en.commission.options.projectTypes.includes("Hotel lobby / atrium"));
assert.ok(copy.en.commission.options.scales.some(item => item.includes("ft") && item.includes("m")));
assert.ok(copy.en.commission.placeholders.phone.startsWith("+1 "));
assert.ok(!copy.en.commission.options.projectTypes.some(item => item.includes("Hospital arrival")));

function verifyPlanning(html, context) {
  const readable = decode(html);
  assert.ok(html.includes(`id="${hospitalityPlanning.id}"`), `Planning section: ${context}`);
  for (const value of [hospitalityPlanning.title, hospitalityPlanning.answer, hospitalityPlanning.resourcesTitle, ...hospitalityPlanning.columns]) {
    assert.ok(readable.includes(value), `Planning content/source mismatch: ${context}: ${value}`);
  }
  const table = html.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
  assert.ok(table, `Planning comparison table: ${context}`);
  for (const row of hospitalityPlanning.rows) {
    for (const value of [row.setting, row.review, row.team, row.guide[0]]) {
      assert.ok(decode(table).includes(value), `Planning table/source mismatch: ${context}: ${value}`);
    }
    assert.ok(table.includes(`href="${row.guide[1]}"`), `Planning guide link: ${context}: ${row.guide[1]}`);
  }
  for (const [label, description, href] of hospitalityPlanning.resources) {
    assert.ok(readable.includes(label) && readable.includes(description) && html.includes(`href="${href}"`), `Planning resource/source mismatch: ${context}: ${href}`);
  }
}

function verifyCommissionProof(html, context) {
  const readable = decode(html), proof = commissionProof.en;
  for (const value of [proof.eyebrow, proof.title, proof.body, proof.scope, proof.action]) {
    assert.ok(readable.includes(value), `Commission evidence/source mismatch: ${context}: ${value}`);
  }
  assert.ok(html.includes(`/seo-media/${commissionEvidenceImage.file}`), `Commission construction image: ${context}`);
  assert.ok(readable.includes(commissionEvidenceImage.alt), `Commission construction image label: ${context}`);
  assert.ok(html.includes('href="/projects/#project-evidence-title"'), `Commission construction link: ${context}`);
  assert.match(proof.body, /Middle East/);
  assert.match(proof.body, /construction-phase photographs, not completed hotel commissions/);
  assert.match(proof.scope, /local installation responsibilities in writing/);
}

verifyPlanning(hotelHtml, "static hotel route");
verifyCommissionProof(documents.get("/commission/"), "static commission route");

function verifyCollection(html, context) {
  const readable = decode(html);
  for (const value of [sculptureCatalog.h1, sculptureCatalog.intro]) {
    assert.ok(readable.includes(value), `Collection/source mismatch: ${context}: ${value}`);
  }
  for (const product of sculptureProducts) {
    assert.ok(readable.includes(product.title) && html.includes(`href="${product.path}"`), `Collection card missing: ${context}: ${product.path}`);
    assert.ok(html.includes(`/seo-media/${product.images[0].file}`), `Collection image missing: ${context}: ${product.path}`);
  }
}

function verifySculpture(html, product, context) {
  const readable = decode(html);
  for (const value of [product.title, product.intro, product.disclosure, ...product.specification.flat(), ...product.review, ...product.faq.flat()]) {
    assert.ok(readable.includes(value), `Sculpture/source mismatch: ${context}: ${product.path}: ${value}`);
  }
  for (const image of product.images) {
    assert.ok(html.includes(`/seo-media/${image.file}`) && readable.includes(image.alt) && readable.includes(image.caption), `Sculpture media/source mismatch: ${context}: ${image.file}`);
  }
  for (const [label, href] of product.related) {
    assert.ok(readable.includes(label) && html.includes(`href="${href}"`), `Sculpture related/source mismatch: ${context}: ${href}`);
  }
  assert.ok(html.includes(`href="/commission/?route=${product.inquiryId}"`), `Sculpture inquiry link: ${context}: ${product.inquiryId}`);
  assert.ok(html.includes(`href="${sculptureCatalog.path}"`), `Sculpture collection backlink: ${context}: ${product.path}`);
}

const catalogHtml = documents.get(sculptureCatalog.path);
assert.ok(catalogHtml, "Collection page is listed in the Sitemap");
verifyCollection(catalogHtml, "static collection");
const catalogGraph = JSON.parse(catalogHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
assert.equal(catalogGraph.filter(item => item["@type"] === "CollectionPage").length, 1);
const itemList = catalogGraph.find(item => item["@type"] === "ItemList");
assert.equal(itemList.numberOfItems, sculptureProducts.length);
assert.deepEqual(itemList.itemListElement.map(item => [item.position, item.name, item.url]), sculptureProducts.map((product, index) => [index + 1, product.title, `${base}${product.path}`]));

const imageSitemap = fs.readFileSync(path.join(root, "image-sitemap.xml"), "utf8");
for (const product of sculptureProducts) {
  const html = documents.get(product.path);
  assert.ok(html, `Sculpture page is listed in the Sitemap: ${product.path}`);
  verifySculpture(html, product, "static detail");
  assert.equal(safeInterestRoute(product.inquiryId), product.inquiryId, `Registered sculpture inquiry ID: ${product.inquiryId}`);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  assert.equal(graph.filter(item => item["@type"] === "WebPage").length, 1);
  assert.equal(graph.filter(item => item["@type"] === "Service").length, 1);
  assert.equal(graph.filter(item => item["@type"] === "FAQPage").length, 1);
  assert.deepEqual(graph.find(item => item["@type"] === "FAQPage").mainEntity.map(item => [item.name, item.acceptedAnswer.text]), product.faq);
  assert.equal(graph.find(item => item["@type"] === "Service").disambiguatingDescription, product.disclosure);
  assert.deepEqual(graph.filter(item => item["@type"] === "ImageObject").map(item => [item.contentUrl, item.name, item.caption]), product.images.map(image => [`${base}/seo-media/${image.file}`, image.alt, image.caption]));
  assert.deepEqual(graph.find(item => item["@type"] === "BreadcrumbList").itemListElement.map(item => item.item), [`${base}/`, `${base}${sculptureCatalog.path}`, `${base}${product.path}`]);
  assert.ok(!/"(?:offers|price|priceCurrency|sku|aggregateRating|review)"\s*:/.test(JSON.stringify(graph)), `Unverified commerce fields: ${product.path}`);
  const imageEntry = [...imageSitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${base}${product.path}</loc>`))?.[1];
  assert.ok(imageEntry, `Sculpture image Sitemap entry: ${product.path}`);
  for (const image of product.images) assert.ok(imageEntry.includes(`<image:loc>${base}/seo-media/${image.file}</image:loc>`), `Sculpture image Sitemap coverage: ${product.path}: ${image.file}`);
}

// Render the actual React components without exercising a live inquiry endpoint.
const server = await createServer({ configFile: "vite.static.config.mjs", server: { middlewareMode: true, watch: null }, appType: "custom" });
try {
  const { App } = await server.ssrLoadModule("/src/App.jsx");
  for (const route of ["", "commission", ...Object.keys(routeSeoContent), ...sculptureRoutes]) {
    const html = renderToStaticMarkup(React.createElement(App, { initialRoute: route }));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `Rendered H1: ${route}`);
    assert.ok(html.includes('href="/privacy/"'), `Rendered privacy: ${route}`);
    if (route === "sculptures") verifyCollection(html, "rendered collection");
    const sculpture = sculptureProducts.find(product => route === `sculptures/${product.slug}`);
    if (sculpture) verifySculpture(html, sculpture, "rendered detail");
    const content = routeSeoContent[route];
    if (content) {
      const readable = decode(html);
      for (const [question, answer] of content.faq) {
        assert.ok(readable.includes(question) && readable.includes(answer), `Rendered FAQ/source mismatch: ${route}: ${question}`);
      }
      for (const [label, href] of content.related) {
        assert.ok(html.includes(`href="${href}"`) && readable.includes(label), `Rendered related/source mismatch: ${route} -> ${href}`);
      }
    }
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
      const src = tag[0].match(/\bsrc="([^"]+)"/)?.[1];
      if (!src?.startsWith("/seo-media/")) continue;
      assert.ok(fs.existsSync(path.join(root, src)), `Rendered image missing: ${src}`);
      for (const candidate of (tag[0].match(/srcSet="([^"]+)"/i)?.[1] || "").split(",").filter(Boolean)) {
        assert.ok(fs.existsSync(path.join(root, candidate.trim().split(/\s+/)[0])), `Rendered variant missing: ${candidate}`);
      }
    }
    if (route === "resort-sculpture") {
      verifyPlanning(html, "rendered hotel route");
      const readable = decode(html);
      for (const [question, answer] of hospitalityService.faq) {
        assert.ok(readable.includes(question) && readable.includes(answer), `Visible FAQ mismatch: ${question}`);
      }
      for (const section of hospitalitySections) assert.ok(html.includes(`id="${section.id}"`), `Missing visible section: ${section.id}`);
      assert.ok(html.includes("resort-entrance-canopy-sculpture-reference-640w.webp"));
    }
    if (route === "") {
      assert.ok(html.includes("U.S. hotel project teams"));
      assert.ok(html.includes('src="/seo-media/hero-plaza-night-v3.webp"'));
      assert.ok(html.includes('id="hotel-cases-title"'));
      assert.equal([...html.matchAll(/class="hero-plaza-frame[^>]*\bsrc=/g)].length, 1, "Only night should load eagerly");
      assert.ok(html.includes('data-ambient="false"'), "Atmosphere should be opt-in after visibility checks");
      for (const image of hotelCaseImages) assert.ok(html.includes(`/seo-media/${image.file}`));
      assert.ok(!html.includes('class="case-study case-study-primary"'), "Old outdoor cases no longer lead the homepage");
    }
    if (route === "commission") {
      verifyCommissionProof(html, "rendered commission route");
      assert.ok(html.includes("+1 212 555 0100"));
      assert.ok(html.includes("Hotel lobby / atrium"));
      assert.ok(!html.includes("Replace with approved project drawings"));
    }
  }
  const { HotelEngineeringCases } = await server.ssrLoadModule("/src/HotelEngineeringCases.jsx");
  const fallback = decode(fs.readFileSync(path.join(root, "index.html"), "utf8"));
  for (const [language, text] of Object.entries(hotelCases)) {
    const html = decode(renderToStaticMarkup(React.createElement(HotelEngineeringCases, { language })));
    assert.ok(html.includes(text.title) && html.includes(text.note), `Case translation: ${language}`);
    assert.equal([...html.matchAll(/<article\b/g)].length, 3);
    for (const card of text.cards) assert.ok(html.includes(card.title));
  }
  for (const card of hotelCases.en.cards) {
    assert.ok(fallback.includes(card.title) && fallback.includes(card.body), "Static/live hotel-case parity");
  }
  assert.ok(fallback.includes(hotelCases.en.note));
} finally { await server.close(); }
console.log(`PASS: ${urls.length} sitemap routes, all reachable in static HTML within ${Math.max(...depth.values())} clicks, no orphan pages; ${staticCount} article frames and ${imageCount} WebP image references; ${schemaCount} JSON-LD blocks; ${Object.keys(routeSeoContent).length + 2 + sculptureRoutes.length} React routes rendered; FAQ/static/schema parity, ${sculptureProducts.length} sculpture details, collection, related links and U.S. inquiry fields verified.`);
