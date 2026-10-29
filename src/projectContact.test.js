import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { projectContactPaths, projectWhatsappHref } from "./projectContact.js";

const message = (...args) => new URL(projectWhatsappHref(...args)).searchParams.get("text");
const home = "Hello WEIERYANG, I would like to discuss a sculpture project.\nhttps://weieryangart.com/";

test("contact context inventory matches the actual published canonical paths", () => {
  const sitemap = fs.readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.equal(new Set(projectContactPaths).size, projectContactPaths.length);
  assert.deepEqual([...projectContactPaths].sort(), paths.sort(), "Register a newly published route before giving it contact context");
});

test("known page paths, App slugs and index variants share one canonical context", () => {
  for (const value of ["process", "/process", "/process/", "/process/index.html", "https://weieryangart.com/process/"]) {
    assert.equal(message(value, "Fabrication process"), `${home.slice(0, home.lastIndexOf("\n"))}\nPage: Fabrication process\nhttps://weieryangart.com/process/`);
  }
  assert.equal(message("index.html"), home);
  assert.equal(message("/index.html"), home);
  assert.ok(message("insights/brass-vs-bronze-sculpture-oem-quote").endsWith("/insights/brass-vs-bronze-sculpture-oem-quote/"));
  assert.ok(message("/projects/leaf-face-sculpture-fabrication/").endsWith("/projects/leaf-face-sculpture-fabrication/"));
});

test("advertising, buyer and private inquiry fields never leave the page URL", () => {
  const privateQuery = "?email=buyer%40example.test&reference=WY-20261029-ABC123&utm_source=google&utm_campaign=PRIVATE-PROJECT&gclid=SECRET-CLICK#buyer-PRIVATE";
  for (const path of ["/commission/", "https://weieryangart.com/commission/"]) {
    const draft = message(path + privateQuery, "Project brief");
    assert.equal(draft, "Hello WEIERYANG, I would like to discuss a sculpture project.\nPage: Project brief\nhttps://weieryangart.com/commission/");
    for (const secret of ["buyer", "example.test", "WY-", "utm_", "PRIVATE", "SECRET", "gclid"]) assert.ok(!draft.includes(secret));
  }
});

test("unknown and buyer-specific paths disclose neither path nor supplied title", () => {
  for (const value of ["/unknown/", "/customer/buyer@example.test/", "/projects/private-client-note/", "/account/WY-20261029-ABC123/", "/process/extra/"]) {
    assert.equal(message(value, "Private buyer title"), home);
  }
});

test("external URLs, credentials and alternative protocols fall back to the homepage", () => {
  for (const value of ["https://other.test/process/", "https://weieryangart.com.evil.test/process/", "https://weieryangart.com@other.test/process/", "https://user:password@weieryangart.com/process/", "//weieryangart.com/process/", "//other.test/process/", "http://weieryangart.com/process/", "javascript:alert(1)", "data:text/plain,secret"]) {
    assert.equal(message(value, "Unsafe input"), home);
  }
});

test("encoded traversal, backslashes, dot segments and overlong paths cannot normalise into a public path", () => {
  for (const value of ["/insights/../process/", "/./process/", "/%70rocess/", "/%2e%2e/process/", "/%252e%252e/process/", "/%252fprocess/", "\\\\other.test\\process", "/process\\", "/process//", "/process/\n", "/" + "a".repeat(301), "/process/?" + "a".repeat(2049)]) {
    assert.equal(message(value, "Unsafe input"), home);
  }
});

test("only clean bounded public titles are optional context", () => {
  assert.ok(message("/process/", "Material & fabrication\nprocess").includes("Page: Material & fabrication process\n"));
  const long = "A".repeat(180);
  assert.ok(message("/process/", long).includes(`Page: ${"A".repeat(160)}\n`));
  for (const title of ["buyer@example.test", "Reference WY-20261029-ABC123", "Project?email=buyer", "Project utm_campaign", "Page https://other.test/private", "Encoded buyer%40example.test", long + "buyer@example.test"]) {
    assert.equal(message("/process/", title), "Hello WEIERYANG, I would like to discuss a sculpture project.\nhttps://weieryangart.com/process/");
  }
});

test("invalid input types have a deterministic fixed-number destination", () => {
  for (const value of [null, false, 123, {}, []]) assert.equal(message(value, "Unsafe input"), home);
  assert.equal(message(), home);
  const link = new URL(projectWhatsappHref("/process/", "公开制作记录"));
  assert.equal(link.protocol, "https:");
  assert.equal(link.hostname, "wa.me");
  assert.equal(link.pathname, "/8613317178019");
  assert.deepEqual([...link.searchParams.keys()], ["text"]);
  assert.ok(link.searchParams.get("text").includes("公开制作记录"));
});
