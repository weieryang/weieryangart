// These English canonical pages currently show shorter content after a manual
// language change. Their detailed FAQ/HowTo must not describe hidden content.
export const legacyDetailedRoutes = Object.freeze([
  'garden-sculpture',
  'public-art',
  'water-feature-sculpture',
  'bronze-sculpture',
  'custom-sculpture',
  'projects',
  'process',
  'materials',
  'faq',
]);

const scopedRoutes = new Set(legacyDetailedRoutes);
const manualLanguages = new Set(['ar', 'zh', 'fr', 'es', 'de']);
const hiddenTypes = new Set(['FAQPage', 'HowTo']);
const documentStates = new WeakMap();

function scopedRoute(route) {
  if (typeof route !== 'string') return false;
  return scopedRoutes.has(route.replace(/^\//, '').replace(/\/$/, ''));
}

function removableNode(node) {
  if (!node || typeof node !== 'object') return false;
  const types = [].concat(node['@type'] || []);
  // Do not discard an Article, Service or another entity in an unexpected
  // mixed-type node. The shipped nine graphs use separate FAQPage/HowTo nodes.
  return types.length > 0 && types.every(type => hiddenTypes.has(type));
}

function removedReference(value, removedIds) {
  if (typeof value === 'string') return removedIds.has(value);
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === 1 && removedIds.has(value['@id']);
}

function pruneMainEntity(value, removedIds) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach(item => pruneMainEntity(item, removedIds));
    return;
  }
  if (Object.hasOwn(value, 'mainEntity')) {
    if (removedReference(value.mainEntity, removedIds)) delete value.mainEntity;
    else if (Array.isArray(value.mainEntity)) {
      const kept = value.mainEntity.filter(item => !removedReference(item, removedIds));
      if (kept.length) value.mainEntity = kept;
      else delete value.mainEntity;
    }
  }
  Object.values(value).forEach(item => pruneMainEntity(item, removedIds));
}

/** Keep the canonical text exact except for hidden details in the nine views. */
export function schemaForVisibleLanguage(originalText, route, language) {
  if (!scopedRoute(route) || !manualLanguages.has(language) || typeof originalText !== 'string') return originalText;
  let schema;
  try { schema = JSON.parse(originalText); } catch { return originalText; }
  if (!schema || typeof schema !== 'object' || !Array.isArray(schema['@graph'])) return originalText;
  const removed = schema['@graph'].filter(removableNode);
  if (!removed.length) return originalText;
  const removedIds = new Set(removed.map(node => node['@id']).filter(id => typeof id === 'string'));
  schema['@graph'] = schema['@graph'].filter(node => !removableNode(node));
  pruneMainEntity(schema['@graph'], removedIds);
  return JSON.stringify(schema, null, 2);
}

/**
 * Apply only to this document's existing head JSON-LD. The original text is
 * retained per script, so English/restoration never borrows another page's graph.
 * Cleanup restores only writes still owned by this invocation.
 */
export function syncStructuredDataVisibility(document, route, language) {
  if (!document || !document.head?.querySelectorAll) return { changedScripts: 0, restore() {} };
  let states = documentStates.get(document);
  if (!states) { states = new Map(); documentStates.set(document, states); }
  const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
  const ownedWrites = [];
  let changedScripts = 0;
  for (const script of scripts) {
    const currentText = script.textContent;
    let state = states.get(script);
    // A separate metadata owner, document replacement or new script establishes
    // a fresh baseline instead of being overwritten by an old cached graph.
    if (!state || currentText !== state.lastText) {
      state = { originalText: currentText, lastText: currentText, generation: 0 };
      states.set(script, state);
    }
    const text = schemaForVisibleLanguage(state.originalText, route, language);
    const generation = ++state.generation;
    if (currentText !== text) { script.textContent = text; changedScripts++; }
    state.lastText = text;
    if (text !== state.originalText) ownedWrites.push({ script, state, text, generation });
  }
  return {
    changedScripts,
    restore() {
      for (const { script, state, text, generation } of ownedWrites) {
        if (states.get(script) !== state || state.generation !== generation || script.textContent !== text) continue;
        script.textContent = state.originalText;
        state.lastText = state.originalText;
        state.generation++;
      }
    },
  };
}
