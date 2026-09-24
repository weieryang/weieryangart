import assert from "node:assert/strict";
import test from "node:test";
import { createInquiryEmail } from "./inquiryEmail.js";

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
