import assert from "node:assert/strict";
import test from "node:test";
import { fieldLimits, restoreInquiryDraft, validateInquiry, sendInquiry } from "./inquiryForm.js";
import { inquiryFormCopy } from "./inquiryFormCopy.js";
import { copy, emailBriefCopy } from "./content.js";
import { customerRoleIds, inquiryIntakeCopy } from "./inquiryIntake.js";

const valid = { ...restoreInquiryDraft(null), name: "Pat", company: "Hotel QA", email: "pat@example.com", projectType: "Hotel lobby / atrium", location: "Miami, FL, USA", message: "Lobby study; 8 ft tall." };
const delivered = { reference: "WY-20261006-ABCDEF12", notifications: { email: true, whatsapp: false } };

test("missing facts, invalid email and overlong drafts are caught before delivery", () => {
  assert.deepEqual(validateInquiry(valid), {});
  assert.deepEqual(validateInquiry({ ...valid, name: "  ", email: "wrong", message: "x".repeat(5001) }), { name: "required", email: "email", message: "length" });
  assert.equal(validateInquiry({ ...valid, message: "x".repeat(5000) }).message, undefined);
  for (const [name, limit] of Object.entries(fieldLimits)) {
    if (name === "website") continue;
    assert.equal(validateInquiry({ ...valid, [name]: "x".repeat(limit + 1) })[name], "length", name);
  }
});

test("legacy draft values survive, while invalid types and stale honeypots are excluded", () => {
  const draft = restoreInquiryDraft({ ...valid, projectType: "旧版项目类型", name: null, company: { text: "bad" }, website: "stale", extra: "not a field" });
  assert.equal(draft.name, "");
  assert.equal(draft.company, "");
  assert.equal(draft.website, "");
  assert.equal(draft.projectType, "旧版项目类型");
  assert.equal(draft.extra, undefined);
  assert.equal(restoreInquiryDraft(null).email, "");
});

test("v2 intake accepts every listed role without a company and rejects unlisted or missing roles", () => {
  for (const formVariant of ["product-role-v2", "full-role-v2"]) {
    for (const customerRole of customerRoleIds) assert.deepEqual(validateInquiry({ ...valid, formVariant, company: "", customerRole }), {});
    for (const customerRole of ["", "unknown", "<script>"]) assert.equal(validateInquiry({ ...valid, formVariant, company: "", customerRole }).customerRole, "required");
  }
  assert.equal(validateInquiry({ ...valid, company: "" }).company, "required", "Legacy contract remains compatible");
  assert.equal(restoreInquiryDraft({ customerRole: "forged" }).customerRole, "");
  assert.equal(validateInquiry({ ...valid, budget: "USD 100\n200" }).budget, "format");
  for (const language of Object.keys(copy)) assert.equal(inquiryIntakeCopy[language].roles.length, customerRoleIds.length);
});

test("a confirmed response returns its reference and sends the same payload once", async () => {
  let calls = 0;
  const body = new FormData();
  body.set("name", "Pat");
  const result = await sendInquiry("https://example.test/inquiries", body, {
    fetcher: async (endpoint, options) => {
      calls++;
      assert.equal(endpoint, "https://example.test/inquiries");
      assert.equal(options.body, body);
      assert.equal(options.method, "POST");
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json(delivered, { status: 201 });
    },
  });
  assert.deepEqual(result, delivered);
  assert.equal(calls, 1);
});

test("HTTP errors, malformed JSON and unconfirmed success cannot become leads", async () => {
  for (const response of [
    Response.json(delivered, { status: 503 }), new Response("not JSON"),
    Response.json({}), Response.json({ ...delivered, notifications: { email: false } }),
    Response.json({ ...delivered, reference: "" }),
  ]) {
    await assert.rejects(sendInquiry("https://example.test/inquiries", new FormData(), { fetcher: async () => response }));
  }
});

test("both a stalled request and stalled response body time out and abort", async () => {
  for (const stage of ["request", "body"]) {
    let signal;
    await assert.rejects(sendInquiry("https://example.test/inquiries", new FormData(), {
      timeoutMs: 5,
      fetcher: async (_, options) => {
        signal = options.signal;
        return stage === "request" ? new Promise(() => {}) : { ok: true, json: () => new Promise(() => {}) };
      },
    }), /timed out/);
    assert.equal(signal.aborted, true);
  }
});

test("all six interface languages provide complete validation and recovery feedback", () => {
  for (const language of Object.keys(copy)) {
    assert.ok(emailBriefCopy[language].invalidEmail);
    for (const value of Object.keys(inquiryFormCopy.en)) {
      assert.ok(inquiryFormCopy[language][value], `${language}: ${value}`);
    }
    assert.ok(inquiryFormCopy[language].length.includes("{limit}"));
  }
});
