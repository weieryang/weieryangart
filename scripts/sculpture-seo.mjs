import { sculptureCatalog, sculptureProducts } from "../src/sculptureCatalog.js";

// Page metadata and body text come from the same catalog used by React.
export const sculptureSeoPages = [
  {
    slug: "sculptures", file: "sculptures/index.html", type: "CollectionPage",
    title: sculptureCatalog.title, description: sculptureCatalog.description,
    h1: sculptureCatalog.h1, intro: sculptureCatalog.intro,
    lastmod: "2026-10-07", sections: [], faq: [],
    images: sculptureProducts.map(product => product.images[0]),
    catalogKind: "index", usePrimarySocialImage: true,
  },
  ...sculptureProducts.map(product => ({
    slug: `sculptures/${product.slug}`, file: `sculptures/${product.slug}/index.html`,
    type: "Service", title: product.metaTitle, description: product.metaDescription,
    h1: product.title, intro: product.intro, disclosure: product.disclosure,
    lastmod: "2026-10-07", sections: [], faq: product.faq, related: product.related,
    images: product.images, serviceTypes: [product.title],
    catalogKind: "detail", product, usePrimarySocialImage: true,
  })),
];

function imageMarkup(image, esc, eager = false) {
  return `<figure><img src="/seo-media/${esc(image.file)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""} /><figcaption>${esc(image.caption)}</figcaption></figure>`;
}

export function sculptureFallback(page, esc) {
  if (page.catalogKind === "index") {
    return `<main class="seo-fallback" data-seo-fallback="true">
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Custom sculpture collection</span></nav>
      <h1>${esc(sculptureCatalog.h1)}</h1><p>${esc(sculptureCatalog.intro)}</p>
      <section class="seo-catalog-grid" aria-label="Custom sculpture directions">
        ${sculptureProducts.map((product, index) => `<article class="seo-catalog-card">
          <p>${esc(product.category)}</p><h2><a href="${esc(product.path)}">${esc(product.title)}</a></h2>
          ${imageMarkup(product.images[0], esc, index === 0)}
          <p>${esc(product.intro)}</p><p>${esc(product.disclosure)}</p>
          <a href="${esc(product.path)}">Review this direction</a>
        </article>`).join("")}
      </section>
      <p><a href="/resort-sculpture/">Review the hotel and resort sculpture service</a></p>
    </main>`;
  }

  const product = page.product;
  return `<main class="seo-fallback" data-seo-fallback="true">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${esc(sculptureCatalog.path)}">Custom sculpture collection</a> / <span>${esc(product.title)}</span></nav>
    <p>${esc(product.category)}</p><h1>${esc(product.title)}</h1><p>${esc(product.intro)}</p>
    <p>${esc(product.disclosure)}</p>
    <div class="seo-catalog-gallery">${product.images.map((image, index) => imageMarkup(image, esc, index === 0)).join("")}</div>
    <section><h2>Project specification</h2><dl>${product.specification.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}</dl></section>
    <section><h2>What should be reviewed for your site?</h2><ul>${product.review.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
    <section><h2>Questions before commissioning</h2>${product.faq.map(([question, answer]) => `<article><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("")}</section>
    <section><h2>Discuss this direction for your project</h2><p><a href="/commission/?route=${esc(encodeURIComponent(product.inquiryId))}">Request a project assessment</a></p></section>
    <nav aria-label="Related sculpture guides"><h2>Continue the project review</h2>${product.related.map(([label, href]) => `<p><a href="${esc(href)}">${esc(label)}</a></p>`).join("")}</nav>
  </main>`;
}

export function sculptureSchemaNodes(page, site) {
  if (page.catalogKind !== "index") return [];
  return [{
    "@type": "ItemList", "@id": `${site}${sculptureCatalog.path}#collection`,
    name: "Custom sculpture collection", numberOfItems: sculptureProducts.length,
    itemListElement: sculptureProducts.map((product, index) => ({
      "@type": "ListItem", position: index + 1, name: product.title,
      url: `${site}${product.path}`,
    })),
  }];
}
