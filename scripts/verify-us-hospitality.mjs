import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { hospitalityService, hospitalitySections } from "../src/hospitalityContent.js";
import { copy } from "../src/content.js";
import { hotelCases, hotelCaseImages } from "../src/hotelCases.js";

const root = path.resolve("dist");
const base = "https://weieryangart.com";
const urls = [...fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'");
let imageCount = 0, schemaCount = 0, staticCount = 0;
for (const url of urls) {
  const route = new URL(url).pathname;
  const file = path.join(root, route, "index.html");
  assert.ok(fs.existsSync(file), `Missing page: ${route}`);
  const html = fs.readFileSync(file, "utf8");
  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `H1 count: ${route}`);
  assert.match(html, /<title>[^<]+<\/title>/, `Title: ${route}`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `Description: ${route}`);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Canonical: ${route}`);
  assert.ok(html.includes("GTM-NV6T388X"), `GTM: ${route}`);
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    JSON.parse(match[1]); schemaCount++;
  }
  if (!html.includes('id="root"')) {
    staticCount++;
    assert.equal([...html.matchAll(/<header class="wy-top"/g)].length, 1, `Shared header: ${route}`);
    assert.equal([...html.matchAll(/<footer class="wy-footer"/g)].length, 1, `Shared footer: ${route}`);
    assert.ok(html.includes('href="/privacy/"'), `Privacy link: ${route}`);
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
const hotelHtml = fs.readFileSync(path.join(root, "resort-sculpture/index.html"), "utf8");
const graph = JSON.parse(hotelHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
assert.deepEqual(graph.find(item => item["@type"] === "FAQPage").mainEntity.map(item => [item.name, item.acceptedAnswer.text]), hospitalityService.faq);
assert.equal(graph.filter(item => item["@type"] === "Service").length, 1);
assert.ok(graph.some(item => item["@type"] === "WebPage" && item.mainEntity?.["@id"]?.endsWith("#service")));
assert.ok(copy.en.commission.options.projectTypes.includes("Hotel lobby / atrium"));
assert.ok(copy.en.commission.options.scales.some(item => item.includes("ft") && item.includes("m")));
assert.ok(copy.en.commission.placeholders.phone.startsWith("+1 "));
assert.ok(!copy.en.commission.options.projectTypes.some(item => item.includes("Hospital arrival")));

// Render the actual React components without exercising a live inquiry endpoint.
const server = await createServer({ configFile: "vite.static.config.mjs", server: { middlewareMode: true, watch: null }, appType: "custom" });
try {
  const { App } = await server.ssrLoadModule("/src/App.jsx");
  for (const route of ["", "resort-sculpture", "commission", "projects"]) {
    const html = renderToStaticMarkup(React.createElement(App, { initialRoute: route }));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `Rendered H1: ${route}`);
    assert.ok(html.includes('href="/privacy/"'), `Rendered privacy: ${route}`);
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
      const src = tag[0].match(/\bsrc="([^"]+)"/)?.[1];
      if (!src?.startsWith("/seo-media/")) continue;
      assert.ok(fs.existsSync(path.join(root, src)), `Rendered image missing: ${src}`);
      for (const candidate of (tag[0].match(/srcSet="([^"]+)"/i)?.[1] || "").split(",").filter(Boolean)) {
        assert.ok(fs.existsSync(path.join(root, candidate.trim().split(/\s+/)[0])), `Rendered variant missing: ${candidate}`);
      }
    }
    if (route === "resort-sculpture") {
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
console.log(`PASS: ${urls.length} sitemap routes, ${staticCount} shared static frames, ${imageCount} WebP image references, ${schemaCount} JSON-LD blocks; 4 React routes rendered; hotel FAQ/static/schema parity and U.S. inquiry fields verified.`);
