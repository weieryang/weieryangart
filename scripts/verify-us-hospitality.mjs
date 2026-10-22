import { applicationCategories, applicationUi, getApplicationCategories } from "../src/applicationContent.js";
import { getApplicationKeywordContent } from "../src/applicationKeywordContent.js";
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
import { getWorkArticles, workArticleRoutes, workArticleUi, getWorkArticleForImage } from "../src/workArticleData.js";
import { workArticleContentA } from "../src/workArticleContentA.js";
import { workArticleContentB } from "../src/workArticleContentB.js";

const root = path.resolve("dist");
const base = "https://weieryangart.com";
const urls = [...fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 53, "Canonical inventory: existing 45 plus eight production studies only");
assert.equal(new Set(urls).size, 53, "No duplicate canonical sitemap URLs");
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
    const parsed = JSON.parse(match[1]); schemaCount++;
    for (const node of parsed["@graph"] || [parsed]) {
      const types = [].concat(node["@type"] || []);
      if (node.primaryImageOfPage) {
        assert.ok(types.some(type => ["WebPage", "CollectionPage", "ContactPage", "FAQPage"].includes(type)), `Page-only image property: ${route}`);
      }
      if (types.includes("BreadcrumbList")) {
        assert.ok(node.itemListElement.length >= 2, `Breadcrumb must describe a real parent trail: ${route}`);
      }
    }
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
      const variant = new URL(decode(candidate.trim().split(/\s+/)[0]), url);
      assert.ok(variant.origin === base && fs.existsSync(path.join(root, decodeURIComponent(variant.pathname))), `Missing image variant: ${candidate}`);
    }
  }
}

// A website, its homepage and a fabrication procedure are distinct entities.
const schemaFor = route => JSON.parse(documents.get(route).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
const homeSchema = schemaFor("/");
assert.equal(homeSchema.filter(node => node["@type"] === "WebSite").length, 1);
assert.equal(homeSchema.find(node => node["@id"] === `${base}/#page`)["@type"], "WebPage");
assert.equal(homeSchema.filter(node => node["@type"] === "BreadcrumbList").length, 0);
const processSchema = schemaFor("/process/");
const processPage = processSchema.find(node => node["@id"] === `${base}/process/#page`);
const processHowTo = processSchema.find(node => node["@type"] === "HowTo");
assert.equal(processPage["@type"], "WebPage");
assert.equal(processPage.mainEntity["@id"], processHowTo["@id"]);
assert.equal(processHowTo.mainEntityOfPage["@id"], processPage["@id"]);
assert.equal(processHowTo.step.length, routeSeoContent.process.groups.reduce((count, [, items]) => count + items.length, 0));
for (const step of processHowTo.step) {
  assert.ok(decode(documents.get("/process/")).includes(step.text), `Process step must be visible: ${step.position}`);
}
const constructionReport = schemaFor("/projects/").find(node => node["@type"] === "Report");
assert.deepEqual(constructionReport.image.map(image => image["@id"]), [
  "middle-east-stainless-steel-landmark-installation.webp",
  "large-sculpture-structural-assembly.webp",
  "stainless-steel-wing-slat-installation.webp",
].map(file => `${base}/seo-media/${file}#image`), "Construction report must not include commercial reference studies");

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
  const expectedFaq = route === "resort-sculpture" ? [...content.faq, ...applicationCategories[0].oem.faq] : content.faq;
  assert.deepEqual(faq[0].mainEntity.map(item => [item.name, item.acceptedAnswer.text]), expectedFaq, `Static/schema FAQ source: ${route}`);
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
assert.deepEqual(graph.find(item => item["@type"] === "FAQPage").mainEntity.map(item => [item.name, item.acceptedAnswer.text]), [...hospitalityService.faq, ...applicationCategories[0].oem.faq]);
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
const itemList = catalogGraph.find(item => item["@id"] === `${base}/sculptures/#collection`);
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
  assert.deepEqual(graph.find(item => item["@type"] === "BreadcrumbList").itemListElement.map(item => item.item), [`${base}/`, `${base}${sculptureCatalog.path}`, `${base}${applicationCategories.find(category => category.id === product.applicationId).path}`, `${base}${product.path}`]);
  assert.ok(!/"(?:offers|price|priceCurrency|sku|aggregateRating|review)"\s*:/.test(JSON.stringify(graph)), `Unverified commerce fields: ${product.path}`);
  const imageEntry = [...imageSitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${base}${product.path}</loc>`))?.[1];
  assert.ok(imageEntry, `Sculpture image Sitemap entry: ${product.path}`);
  for (const image of product.images) assert.ok(imageEntry.includes(`<image:loc>${base}/seo-media/${image.file}</image:loc>`), `Sculpture image Sitemap coverage: ${product.path}: ${image.file}`);
}

const applicationList = catalogGraph.find(item => item["@id"] === `${base}/sculptures/#applications`);
assert.deepEqual(applicationList.itemListElement.map(item => item.url), applicationCategories.map(category => `${base}${category.path}`));
for (const category of applicationCategories) {
  const html = documents.get(category.path);
  assert.ok(html, `Application in sitemap: ${category.path}`);
  const readable = decode(html);
  for (const value of [category.name, category.intro, category.evidenceNote, ...category.buyerNeeds, ...category.scope]) assert.ok(readable.includes(value), `Application visible facts: ${category.path}: ${value}`);
  for (const image of category.gallery) {
    assert.ok(readable.includes(image.caption) && readable.includes(image.alt) && html.includes(image.file), `Application evidence: ${category.path}: ${image.file}`);
  }
  if (category.id !== "hospitality") {
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    assert.deepEqual(graph.find(node => node["@type"] === "FAQPage").mainEntity.map(item => [item.name,item.acceptedAnswer.text]), category.faq);
    assert.deepEqual(graph.find(node => node["@type"] === "BreadcrumbList").itemListElement.map(item => item.item), [`${base}/`,`${base}/sculptures/`,`${base}${category.path}`]);
  }
}

// New production studies describe the eight newly selected works only.  Direct
// translation-source checks prevent getWorkArticle's defensive fallback from
// silently turning a missing locale into English during SSR acceptance.
const workLanguages = ["en", "zh", "ar", "fr", "es", "de"];
const workContent = { ...workArticleContentA, ...workArticleContentB };
const workArticles = getWorkArticles("en");
assert.equal(Object.keys(workArticleContentA).length, 6, "Six A content subjects");
assert.equal(Object.keys(workArticleContentB).length, 2, "Two B horse subjects");
assert.equal(Object.keys(workContent).length, 8, "Exactly eight distinct new work subjects");
assert.equal(workArticles.length, 8, "Eight English production studies");
assert.equal(workArticleRoutes.length, 8, "Eight new article routes");
assert.deepEqual([...new Set(workArticleRoutes)].sort(), workArticles.map(article => article.path.slice(1, -1)).sort());
assert.deepEqual(Object.keys(workContent).sort(), workArticles.map(article => article.slug).sort());
const newCategoryImageFiles = applicationCategories.flatMap(category => category.gallery.filter(image => image.file.startsWith("application-")).map(image => image.file));
assert.equal(newCategoryImageFiles.length, 8, "Eight newly selected category images only");
assert.equal(new Set(newCategoryImageFiles).size, 8, "Each new work has one distinct photo");
assert.deepEqual(workArticles.flatMap(article => article.images.map(image => image.file)).sort(), [...newCategoryImageFiles].sort(), "Articles cover exactly the new image selection");
const nonempty = (value, context) => assert.ok(typeof value === "string" && value.trim().length > 0, context);
assert.deepEqual(Object.keys(workArticleUi).sort(), [...workLanguages].sort(), "All six work-article UI translations");
for (const language of workLanguages) {
  for (const [field, value] of Object.entries(workArticleUi[language])) nonempty(value, `Work UI ${field}: ${language}`);
}
for (const article of workArticles) {
  assert.equal(getWorkArticleForImage(article.images[0].file)?.slug, article.slug, `New image resolves to its own article: ${article.slug}`);
  const translations = workContent[article.slug];
  assert.deepEqual(Object.keys(translations).sort(), [...workLanguages].sort(), `All six source translations: ${article.slug}`);
  for (const language of workLanguages) {
    const value = translations[language];
    for (const field of ["title", "standfirst"]) nonempty(value[field], `Work ${field}: ${language}: ${article.slug}`);
    assert.equal(value.sections.length, 3, `Work section count: ${language}: ${article.slug}`);
    for (const section of value.sections) {
      nonempty(section.heading, `Work section heading: ${language}: ${article.slug}`);
      nonempty(section.body, `Work section body: ${language}: ${article.slug}`);
    }
    assert.equal(value.brief.length, 3, `Work brief count: ${language}: ${article.slug}`);
    for (const item of value.brief) nonempty(item, `Work brief item: ${language}: ${article.slug}`);
    assert.equal(value.faq.length, 2, `Work FAQ count: ${language}: ${article.slug}`);
    assert.equal(new Set(value.faq.map(pair => pair[0])).size, 2, `Unique work FAQ: ${language}: ${article.slug}`);
    for (const pair of value.faq) {
      assert.equal(pair.length, 2, `Work FAQ pair: ${language}: ${article.slug}`);
      pair.forEach(text => nonempty(text, `Work FAQ value: ${language}: ${article.slug}`));
    }
    if (language !== "en") {
      assert.notEqual(value.title, translations.en.title, `No English title fallback: ${language}: ${article.slug}`);
      assert.notEqual(value.standfirst, translations.en.standfirst, `No English intro fallback: ${language}: ${article.slug}`);
      for (const [index, section] of value.sections.entries()) assert.notEqual(section.body, translations.en.sections[index].body, `No English body fallback: ${language}: ${article.slug}`);
    }
    const localized = getWorkArticles(language).find(item => item.slug === article.slug);
    assert.ok(localized, `Localized work resolves: ${language}: ${article.slug}`);
    for (const field of ["title", "standfirst", "sections", "brief", "faq"]) assert.deepEqual(localized[field], value[field], `Work/source locale mapping: ${field}: ${language}: ${article.slug}`);
    for (const image of localized.images) {
      for (const field of ["file", "alt", "caption", "label"]) nonempty(image[field], `Work image ${field}: ${language}: ${article.slug}`);
      assert.equal(image.evidenceType, "fabrication", `New work evidence remains a production record: ${article.slug}`);
    }
  }
  assert.ok(article.standfirst.length <= 180, `Work description length: ${article.slug}`);
}
const visibleWorkText = html => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ""));
function verifyWorkArticle(html, article, language, context) {
  const ui = workArticleUi[language], readable = visibleWorkText(html);
  const category = applicationCategories.find(item => item.id === article.categoryId);
  for (const value of [article.title, article.standfirst, ...article.sections.flatMap(section => [section.heading, ...[].concat(section.body)]), ...article.brief, ...article.faq.flat(), ui.scopeNote]) {
    assert.ok(readable.includes(value), `Work visible/source parity: ${context}: ${article.slug}: ${value}`);
  }
  assert.match(html, new RegExp(`<time\\b[^>]*datetime="${article.publishedOn}"`, "i"), `Article publication date, not fabrication date: ${context}: ${article.slug}`);
  assert.ok(readable.includes(ui.publishedLabel), `Publication label: ${context}: ${article.slug}`);
  for (const image of article.images) {
    assert.ok(html.includes(`/seo-media/${image.file}`) && readable.includes(image.alt) && readable.includes(image.caption) && readable.includes(image.label), `Work image/source parity: ${context}: ${article.slug}`);
  }
  for (const href of [category.path, `${category.path}#oem-${category.id}`, "/commission/", "/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template"]) {
    assert.ok(html.includes(`href="${href}"`), `Work project resource: ${context}: ${article.slug}: ${href}`);
  }
  const sibling = workArticles.find(item => item.categoryId === article.categoryId && item.slug !== article.slug);
  assert.ok(sibling && html.includes(`href="${sibling.path}"`), `Same-category work continuation: ${context}: ${article.slug}`);
}
for (const article of workArticles) {
  const html = documents.get(article.path), url = `${base}${article.path}`;
  assert.ok(html, `Production study canonical in sitemap: ${article.path}`);
  verifyWorkArticle(html, article, "en", "static article");
  const nodes = schemaFor(article.path);
  const articleNode = nodes.find(node => node["@id"] === `${url}#article`);
  const pageNode = nodes.find(node => node["@id"] === `${url}#page`);
  assert.equal(nodes.filter(node => node["@type"] === "Article").length, 1, `One Article: ${article.path}`);
  assert.equal(articleNode?.["@type"], "Article");
  assert.equal(pageNode?.["@type"], "WebPage");
  assert.equal(pageNode.mainEntity?.["@id"], articleNode["@id"]);
  assert.equal(articleNode.mainEntityOfPage?.["@id"], pageNode["@id"]);
  assert.equal(articleNode.headline, article.title);
  assert.equal(articleNode.description, article.standfirst);
  assert.equal(articleNode.datePublished, "2026-10-22");
  assert.equal(articleNode.dateModified, article.publishedOn);
  assert.equal(articleNode.author?.["@id"], `${base}/#organization`);
  assert.equal(articleNode.publisher?.["@id"], `${base}/#organization`);
  assert.equal(articleNode.articleSection, applicationCategories.find(category => category.id === article.categoryId).name, `Article editorial category: ${article.path}`);
  assert.deepEqual(articleNode.image.map(image => image["@id"]), article.images.map(image => `${base}/seo-media/${image.file}#image`));
  const breadcrumb = nodes.find(node => node["@type"] === "BreadcrumbList");
  const category = applicationCategories.find(item => item.id === article.categoryId);
  assert.deepEqual(breadcrumb.itemListElement.map(item => [item.position, item.item]), [
    [1, `${base}/`], [2, `${base}/sculptures/`], [3, `${base}${category.path}`], [4, url],
  ], `Work four-level breadcrumb: ${article.path}`);
  const faq = nodes.filter(node => node["@type"] === "FAQPage");
  assert.equal(faq.length, 1, `One work FAQPage: ${article.path}`);
  assert.deepEqual(faq[0].mainEntity.map(item => [item.name, item.acceptedAnswer.text]), article.faq);
  for (const image of article.images) {
    const imageNode = nodes.find(node => node["@id"] === `${base}/seo-media/${image.file}#image`);
    assert.equal(imageNode?.["@type"], "ImageObject");
    assert.equal(imageNode.contentUrl, `${base}/seo-media/${image.file}`);
    assert.equal(imageNode.name, image.alt);
    assert.equal(imageNode.caption, image.caption);
    assert.equal(imageNode.width, image.width);
    assert.equal(imageNode.height, image.height);
  }
  assert.ok(!nodes.some(node => ["Product", "Offer", "AggregateRating", "Review", "OEM", "OEMService"].includes(node["@type"])), `No invented commerce/OEM schema: ${article.path}`);
  assert.ok(!/"(?:offers|price|priceCurrency|sku|aggregateRating|review)"\s*:/.test(JSON.stringify(nodes)), `No invented commerce properties: ${article.path}`);
  const sitemapEntry = [...fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${url}</loc>`))?.[1];
  assert.ok(sitemapEntry?.includes(`<lastmod>${article.publishedOn}</lastmod>`), `Work sitemap date: ${article.path}`);
  const imageEntry = [...imageSitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${url}</loc>`))?.[1];
  assert.ok(imageEntry, `Work image sitemap page entry: ${article.path}`);
  for (const image of article.images) {
    assert.ok(imageEntry.includes(`<image:loc>${base}/seo-media/${image.file}</image:loc>`), `Work image sitemap coverage: ${article.path}: ${image.file}`);
  }
}
function verifyCategoryWorkLinks(html, category, language, context) {
  const figures = [...html.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)].map(match => match[1]);
  for (const image of category.gallery) {
    const article = getWorkArticleForImage(image.file, language);
    const imageFigures = figures.filter(figure => figure.includes(`/seo-media/${image.file}`));
    assert.ok(imageFigures.length > 0, `Category image figure: ${context}: ${image.file}`);
    if (image.file.startsWith("application-")) {
      assert.ok(article, `New image owns one study: ${context}: ${image.file}`);
      assert.equal(article.categoryId, category.id, `Image study category: ${image.file}`);
      assert.ok(imageFigures.some(figure => figure.includes(`href="${article.path}"`) && decode(figure).includes(workArticleUi[language].read) && decode(figure).includes(article.title)), `New image's own visible article entrance: ${context}: ${image.file}`);
    } else {
      assert.equal(article, null, `Old image must not receive an unrequested new study: ${image.file}`);
      for (const figure of imageFigures) {
        for (const newArticle of workArticles) assert.ok(!figure.includes(`href="${newArticle.path}"`), `Old image not assigned new article: ${context}: ${image.file}`);
      }
    }
  }
}
for (const category of applicationCategories) verifyCategoryWorkLinks(documents.get(category.path), category, "en", "static category");

function verifyKeywordBuyerAnswers(html, category, language, context) {
  const buyer = getApplicationKeywordContent(category.id, language);
  assert.ok(buyer, `Buyer content exists: ${language}: ${category.id}`);
  assert.equal(buyer.faq.length, 1, `One distinct new procurement question: ${language}: ${category.id}`);
  assert.equal(buyer.evidenceLinks.length, 2, `Two matching production studies: ${language}: ${category.id}`);
  assert.deepEqual(buyer.evidenceLinks.map(([,href]) => href).sort(), getWorkArticles(language).filter(item => item.categoryId === category.id).map(item => item.path).sort(), `Evidence studies stay in their application: ${language}: ${category.id}`);
  assert.equal(new Set(category.oem.faq.map(([question]) => question)).size, category.oem.faq.length, `No duplicate OEM questions: ${language}: ${category.id}`);
  const readable = visibleWorkText(html);
  for (const value of [buyer.intro, ...buyer.faq.flat(), ...buyer.evidenceLinks.map(([label]) => label)]) {
    assert.ok(typeof value === "string" && value.trim(), `Nonempty buyer answer: ${language}: ${category.id}`);
    assert.ok(readable.includes(value), `Buyer answer visible: ${context}: ${language}: ${category.id}: ${value}`);
  }
  const oemSection = html.match(new RegExp(`<section\\b[^>]*id="oem-${category.id}"[\\s\\S]*?<\\/section>`))?.[0];
  assert.ok(oemSection, `OEM section exists: ${context}: ${category.id}`);
  for (const [,href] of buyer.evidenceLinks) assert.ok(oemSection.includes(`href="${href}"`), `Evidence is linked inside its OEM brief: ${context}: ${href}`);
  if (language !== "en") {
    const english = getApplicationKeywordContent(category.id, "en");
    assert.notEqual(buyer.intro, english.intro, `No English buyer intro fallback: ${language}: ${category.id}`);
    assert.notEqual(buyer.faq[0][1], english.faq[0][1], `No English buyer answer fallback: ${language}: ${category.id}`);
  }
}
for (const category of applicationCategories) {
  const html = documents.get(category.path);
  verifyKeywordBuyerAnswers(html, category, "en", "static category");
  assert.equal(decode(html.match(/<meta name="description" content="([^"]+)"/)[1]), category.metaDescription, `Category description source: ${category.id}`);
  const faq = schemaFor(category.path).find(node => node["@type"] === "FAQPage");
  for (const [question,answer] of getApplicationKeywordContent(category.id, "en").faq) assert.ok(faq.mainEntity.some(item => item.name === question && item.acceptedAnswer.text === answer), `New buyer FAQ schema matches visible answer: ${category.id}`);
}

// Render the actual React components without exercising a live inquiry endpoint.
const server = await createServer({ configFile: "vite.static.config.mjs", server: { middlewareMode: true, watch: null }, appType: "custom" });
try {
  const { App } = await server.ssrLoadModule("/src/App.jsx");
  for (const route of ["", "commission", ...Object.keys(routeSeoContent), ...sculptureRoutes, ...applicationCategories.filter(category => category.id !== "hospitality").map(category => category.path.slice(1,-1)), ...workArticleRoutes]) {
    const html = renderToStaticMarkup(React.createElement(App, { initialRoute: route }));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `Rendered H1: ${route}`);
    assert.ok(html.includes('href="/privacy/"'), `Rendered privacy: ${route}`);
    if (route === "sculptures") verifyCollection(html, "rendered collection");
    const workArticle = workArticles.find(article => article.path === `/${route}/`);
    if (workArticle) verifyWorkArticle(html, workArticle, "en", "rendered App article");
    const sculpture = sculptureProducts.find(product => route === `sculptures/${product.slug}`);
    if (sculpture) verifySculpture(html, sculpture, "rendered detail");
    const application = applicationCategories.find(category => category.path === `/${route}/`);
    if (application) {
      const oemText = [application.oem.heading, application.oem.intro, application.oem.scopeHeading, ...application.oem.steps.flatMap(step => [step.title, step.detail]), ...application.oem.quotationScope];
      for (const value of [application.name, application.intro, ...application.buyerNeeds, ...application.scope, application.evidenceNote, ...oemText]) {
        assert.ok(decode(html).includes(value), `Rendered application parity: ${route}: ${value}`);
        assert.ok(decode(documents.get(`/${route}/`)).includes(value), `Static application parity: ${route}: ${value}`);
      }
      for (const image of application.gallery) assert.ok(decode(html).includes(image.alt) && decode(html).includes(image.caption), `Rendered image context: ${route}: ${image.file}`);
      verifyCategoryWorkLinks(html, application, "en", "rendered category");
      verifyKeywordBuyerAnswers(html, application, "en", "rendered App category");
    }
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
      for (const [question, answer] of [...hospitalityService.faq, ...applicationCategories[0].oem.faq]) {
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
  const { WorkArticle } = await server.ssrLoadModule("/src/WorkArticle.jsx");
  let localizedWorkRenders = 0;
  for (const language of workLanguages) {
    for (const article of getWorkArticles(language)) {
      const html = renderToStaticMarkup(React.createElement(WorkArticle, { slug: article.slug, language }));
      assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `Localized article H1: ${language}: ${article.slug}`);
      verifyWorkArticle(html, article, language, `localized WorkArticle ${language}`);
      if (language === "ar") assert.ok(html.includes('dir="rtl"'), `Arabic article direction: ${article.slug}`);
      localizedWorkRenders++;
    }
  }
  assert.equal(localizedWorkRenders, 48, "Eight work articles rendered in all six languages");
  const { ApplicationCategory, ApplicationEvidence } = await server.ssrLoadModule("/src/ApplicationSections.jsx");
  let buyerRenders = 0;
  for (const language of workLanguages) {
    for (const category of getApplicationCategories(language)) {
      const Component = category.id === "hospitality" ? ApplicationEvidence : ApplicationCategory;
      const html = renderToStaticMarkup(React.createElement(Component, { id: category.id, language }));
      verifyKeywordBuyerAnswers(html, category, language, "localized application");
      if (language === "ar") assert.ok(html.includes('dir="rtl"'), `Arabic buyer answer direction: ${category.id}`);
      buyerRenders++;
    }
  }
  assert.equal(buyerRenders, 24, "Four buyer-answer applications rendered in six languages");
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
console.log(`PASS: ${urls.length} sitemap routes, all reachable in static HTML within ${Math.max(...depth.values())} clicks, no orphan pages; ${staticCount} article frames and ${imageCount} WebP image references; ${schemaCount} JSON-LD blocks; ${Object.keys(routeSeoContent).length + 2 + sculptureRoutes.length + applicationCategories.filter(category => category.id !== "hospitality").length + workArticleRoutes.length} React routes rendered; eight production studies and 48 localized article renders; 24 localized keyword buyer-answer applications; FAQ/static/schema parity, ${sculptureProducts.length} sculpture details, collection, related links and U.S. inquiry fields verified.`);
