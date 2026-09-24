import assert from "node:assert/strict";
import test from "node:test";
import { handleInquiryRequest } from "./inquiries.mjs";

function formRequest(overrides = {}, files = []) {
  const form = new FormData();
  const fields = { name: "Lee", company: "Hotel Group", email: "lee@example.com", projectType: "Hotel arrival", location: "Dubai", message: "Outdoor sculpture near a pool", source: "https://weieryangart.com/commission/", "cf-turnstile-response": "valid-token", ...overrides };
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  for (const file of files) form.append("files", file);
  return new Request("https://api.weieryangart.com/inquiries", { method: "POST", headers: { Origin: "https://weieryangart.com" }, body: form });
}

function bindings({ failEmail = false, rateLimited = false } = {}) {
  const calls = { emails: [] };
  return {
    calls,
    INQUIRY_RATE: { async limit() { return { success: !rateLimited }; } },
    TURNSTILE_SECRET: "test-secret",
    EMAIL: { async send(message) { calls.emails.push(message); if (failEmail) throw new Error("mail unavailable"); } },
  };
}

const verified = { fetch: async () => Response.json({ success: true, hostname: "weieryangart.com", action: "commission" }) };

test("valid brief is emailed with its project file", async () => {
  const env = bindings();
  const response = await handleInquiryRequest(formRequest({}, [new File(["%PDF-1.7"], "site-plan.pdf", { type: "application/pdf" })]), env, verified);
  assert.equal(response.status, 201);
  assert.match((await response.json()).reference, /^WY-\d{8}-[A-Z0-9]{8}$/);
  assert.equal(env.calls.emails.length, 1);
  assert.equal(env.calls.emails[0].to, "tangkelian@weieryang.com");
  assert.equal(env.calls.emails[0].replyTo, "lee@example.com");
  assert.equal(env.calls.emails[0].attachments[0].filename, "site-plan.pdf");
  assert.equal(new TextDecoder().decode(env.calls.emails[0].attachments[0].content), "%PDF-1.7");
  assert.match(env.calls.emails[0].text, /Attached project files:/);
});

test("attribution fields are retained without accepting external URLs or multiline tags", async () => {
  const env = bindings();
  const response = await handleInquiryRequest(formRequest({
    landingPath: "/insights/hotel-arrival-sculpture-site-brief/",
    referrerHost: "www.google.com",
    utmSource: "linkedin",
    utmMedium: "organic_social",
    utmCampaign: "middle-east-sculpture",
    utmId: "campaign-9821",
    utmContent: "bird-sculpture-video-a",
    utmTerm: "hotel-developer",
    fbclid: "IwAR0Example_Click-ID.123",
    interestRoute: "projects",
  }), env, verified);
  assert.equal(response.status, 201);
  assert.match(env.calls.emails[0].text, /Landing page: \/insights\/hotel-arrival-sculpture-site-brief\//);
  assert.match(env.calls.emails[0].text, /UTM campaign: middle-east-sculpture/);
  assert.match(env.calls.emails[0].text, /UTM content: bird-sculpture-video-a/);
  assert.match(env.calls.emails[0].text, /Facebook click ID: IwAR0Example_Click-ID\.123/);
  assert.match(env.calls.emails[0].text, /Interest route: projects/);

  await handleInquiryRequest(formRequest({
    landingPath: "//example.com/steal",
    referrerHost: "example.com\nInjected: yes",
    utmSource: "bad\nInjected: yes",
    fbclid: "bad\nInjected: yes",
  }), env, verified);
  assert.doesNotMatch(env.calls.emails[1].text, /Injected: yes/);
  assert.doesNotMatch(env.calls.emails[1].text, /Landing page:/);
});

test("invalid origin and missing required data do not send leads", async () => {
  const env = bindings();
  const wrongOrigin = formRequest();
  wrongOrigin.headers.set("Origin", "https://example.com");
  assert.equal((await handleInquiryRequest(wrongOrigin, env)).status, 403);
  assert.equal((await handleInquiryRequest(formRequest({ message: "" }), env, verified)).status, 400);
  assert.equal(env.calls.emails.length, 0);
});

test("failed notification does not claim a completed submission", async () => {
  const env = bindings({ failEmail: true });
  const response = await handleInquiryRequest(formRequest(), env, verified);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.reference, undefined);
});

test("CORS preflight only allows the production site", async () => {
  const env = bindings();
  const request = new Request("https://api.weieryangart.com/inquiries", { method: "OPTIONS", headers: { Origin: "https://weieryangart.com" } });
  const response = await handleInquiryRequest(request, env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://weieryangart.com");
});

test("rate-limited requests never parse or store a brief", async () => {
  const env = bindings({ rateLimited: true });
  const response = await handleInquiryRequest(formRequest(), env);
  assert.equal(response.status, 429);
  assert.equal(env.calls.emails.length, 0);
});

test("expired or wrong-host security checks cannot send email", async () => {
  const env = bindings();
  assert.equal((await handleInquiryRequest(formRequest({ "cf-turnstile-response": "" }), env, verified)).status, 400);
  assert.equal((await handleInquiryRequest(formRequest(), env, { fetch: async () => Response.json({ success: true, hostname: "example.com", action: "commission" }) })).status, 400);
  assert.equal((await handleInquiryRequest(formRequest(), env, { fetch: async () => Response.json({ success: true, hostname: "weieryangart.com", action: "other" }) })).status, 400);
  assert.equal(env.calls.emails.length, 0);
});

test("attachment total is capped before sending", async () => {
  const env = bindings();
  const files = [new File([new Uint8Array(8 * 1024 * 1024)], "a.pdf"), new File([new Uint8Array(8 * 1024 * 1024)], "b.pdf")];
  const response = await handleInquiryRequest(formRequest({}, files), env, verified);
  assert.equal(response.status, 400);
  assert.equal(env.calls.emails.length, 0);
});

test("oversized request bodies are rejected before form parsing", async () => {
  const env = bindings();
  const response = await handleInquiryRequest(formRequest({}, [new File([new Uint8Array(18 * 1024 * 1024)], "large.pdf")]), env, verified);
  assert.equal(response.status, 413);
  assert.equal(env.calls.emails.length, 0);
});
