import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { hospitalityService, hospitalitySections } from "../src/hospitalityContent.js";
import { copy } from "../src/content.js";

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
    }
    if (route === "commission") {
      assert.ok(html.includes("+1 212 555 0100"));
      assert.ok(html.includes("Hotel lobby / atrium"));
      assert.ok(!html.includes("Replace with approved project drawings"));
    }
  }
} finally { await server.close(); }
console.log(`PASS: ${urls.length} sitemap routes, ${staticCount} shared static frames, ${imageCount} WebP image references, ${schemaCount} JSON-LD blocks; 4 React routes rendered; hotel FAQ/static/schema parity and U.S. inquiry fields verified.`);
