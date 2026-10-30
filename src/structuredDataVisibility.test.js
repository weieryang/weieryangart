import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { legacyDetailedRoutes, schemaForVisibleLanguage, syncStructuredDataVisibility } from './structuredDataVisibility.js';

const languages = ['en', 'ar', 'zh', 'fr', 'es', 'de'];
const removable = node => [].concat(node['@type'] || []).every(type => ['FAQPage', 'HowTo'].includes(type));
const sourceSchema = route => {
  const html = fs.readFileSync(path.resolve('dist', route, 'index.html'), 'utf8');
  const match = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(match, `Canonical graph exists: ${route}`);
  return match[1];
};
const reference = (value, ids) => typeof value === 'string' ? ids.has(value)
  : value && typeof value === 'object' && Object.keys(value).length === 1 && ids.has(value['@id']);
function fixture(originalText) {
  const script = { textContent: originalText };
  const document = { head: { querySelectorAll: () => [script] } };
  return { document, script };
}

test('all nine actual canonical graphs keep English exact and only prune hidden detailed entities in the five manual views', () => {
  assert.equal(legacyDetailedRoutes.length, 9);
  for (const route of legacyDetailedRoutes) {
    const text = sourceSchema(route), original = JSON.parse(text);
    const removedIds = new Set(original['@graph'].filter(removable).map(node => node['@id']));
    assert.ok(removedIds.size >= 1, `Expected real FAQ/HowTo scope: ${route}`);
    for (const language of languages) {
      const actualText = schemaForVisibleLanguage(text, route, language);
      if (language === 'en') { assert.equal(actualText, text, `Original English bytes: ${route}`); continue; }
      const actual = JSON.parse(actualText);
      assert.deepEqual(actual['@context'], original['@context']);
      assert.ok(actual['@graph'].every(node => !removable(node)), `${route}/${language}: no hidden FAQ/HowTo`);
      for (const node of actual['@graph']) {
        const before = original['@graph'].find(item => item['@id'] === node['@id'] && item['@type'] === node['@type']);
        // BreadcrumbList may not have @id; its type still uniquely identifies it.
        assert.ok(before, `Original node retained: ${route}/${node['@type']}`);
        const expected = JSON.parse(JSON.stringify(before));
        if (reference(expected.mainEntity, removedIds)) delete expected.mainEntity;
        assert.deepEqual(node, expected, `${route}/${language}: preserve every other property`);
      }
      assert.equal(actual['@graph'].length, original['@graph'].filter(node => !removable(node)).length);
      assert.equal(schemaForVisibleLanguage(text, route, 'en'), text, 'Pure transform never mutates source');
    }
  }
});

test('all other current canonical pages, including localized categories and work articles, are byte-preserved', () => {
  const urls = [...fs.readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  let checked = 0;
  for (const url of urls) {
    const route = new URL(url).pathname.slice(1, -1);
    if (legacyDetailedRoutes.includes(route)) continue;
    const text = sourceSchema(route);
    for (const language of languages) assert.equal(schemaForVisibleLanguage(text, route, language), text);
    checked++;
  }
  assert.equal(checked, urls.length - 9);
});

test('mainEntity prunes only explicit references to removed nodes, retaining Service/Report and unrelated properties', () => {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': '#page', mainEntity: [{ '@id': '#faq' }, '#howto', { '@id': '#service' }] },
    { '@type': 'FAQPage', '@id': '#faq', mainEntity: [] },
    { '@type': 'HowTo', '@id': '#howto', step: [] },
    { '@type': 'Service', '@id': '#service', provider: { '@id': '#organization' }, about: { '@id': '#faq' } },
    { '@type': ['Article', 'Report'], '@id': '#report', image: [{ '@id': '#image' }] },
    { '@type': 'ImageObject', '@id': '#image', caption: 'Existing visible image' },
    { '@type': 'Organization', '@id': '#organization', name: 'Existing organization' },
  ] };
  const original = JSON.stringify(schema), actual = JSON.parse(schemaForVisibleLanguage(original, '/process/', 'fr'));
  assert.deepEqual(actual['@graph'][0].mainEntity, [{ '@id': '#service' }]);
  assert.deepEqual(actual['@graph'].slice(1), schema['@graph'].slice(3));
  assert.equal(JSON.stringify(schema), original);
});

test('unknown routes, unsupported language, malformed JSON and ambiguous entity shapes remain unchanged', () => {
  const text = sourceSchema('process');
  for (const route of ['resort-sculpture', 'process/other', '../process', 'https://weieryangart.com/process/', '/process/?query=1', '', null]) {
    assert.equal(schemaForVisibleLanguage(text, route, 'fr'), text);
  }
  for (const language of ['en', 'unknown', null, 'FR']) assert.equal(schemaForVisibleLanguage(text, 'process', language), text);
  for (const raw of ['invalid{', 'null', '[]', '"text"', '{"@type":"FAQPage"}', 1, null]) assert.equal(schemaForVisibleLanguage(raw, 'process', 'fr'), raw);
  const ambiguous = JSON.stringify({ '@graph': [{ '@type': ['FAQPage', 'Article'], '@id': '#mixed' }] });
  assert.equal(schemaForVisibleLanguage(ambiguous, 'process', 'fr'), ambiguous);
});

test('repeated language changes restore exact English text and cleanup is owned by the latest invocation', () => {
  const original = sourceSchema('process'), { document, script } = fixture(original);
  const first = syncStructuredDataVisibility(document, 'process', 'fr');
  assert.equal(first.changedScripts, 1); assert.notEqual(script.textContent, original);
  const second = syncStructuredDataVisibility(document, 'process', 'de');
  first.restore(); assert.notEqual(script.textContent, original, 'Stale cleanup cannot restore a newer invocation');
  second.restore(); assert.equal(script.textContent, original);
  syncStructuredDataVisibility(document, 'process', 'zh');
  syncStructuredDataVisibility(document, 'process', 'en'); assert.equal(script.textContent, original);
  syncStructuredDataVisibility(document, 'process', 'es');
  syncStructuredDataVisibility(document, 'resort-sculpture', 'es'); assert.equal(script.textContent, original);
});

test('document and script baselines remain isolated; external metadata edits are never overwritten by stale cleanup', () => {
  const a = fixture(sourceSchema('process')), b = fixture(sourceSchema('public-art'));
  const aOriginal = a.script.textContent, bOriginal = b.script.textContent;
  syncStructuredDataVisibility(a.document, 'process', 'fr');
  syncStructuredDataVisibility(b.document, 'public-art', 'zh');
  syncStructuredDataVisibility(a.document, 'process', 'en');
  assert.equal(a.script.textContent, aOriginal); assert.notEqual(b.script.textContent, bOriginal);
  syncStructuredDataVisibility(b.document, 'public-art', 'en'); assert.equal(b.script.textContent, bOriginal);
  const active = syncStructuredDataVisibility(a.document, 'process', 'fr');
  const replacement = sourceSchema('public-art'); a.script.textContent = replacement;
  active.restore(); assert.equal(a.script.textContent, replacement);
  syncStructuredDataVisibility(a.document, 'public-art', 'fr');
  syncStructuredDataVisibility(a.document, 'public-art', 'en'); assert.equal(a.script.textContent, replacement);
  const newScript = { textContent: aOriginal }; a.document.head.querySelectorAll = () => [newScript];
  const newState = syncStructuredDataVisibility(a.document, 'process', 'fr');
  assert.notEqual(newScript.textContent, aOriginal); newState.restore(); assert.equal(newScript.textContent, aOriginal);
});

test('empty documents and unrelated head JSON-LD scripts are preserved', () => {
  assert.equal(syncStructuredDataVisibility(null, 'process', 'fr').changedScripts, 0);
  const visibleOnly = JSON.stringify({ '@graph': [{ '@type': 'Organization', name: 'Keep me' }] });
  const a = fixture(visibleOnly); assert.equal(syncStructuredDataVisibility(a.document, 'process', 'fr').changedScripts, 0);
  assert.equal(a.script.textContent, visibleOnly);
});
