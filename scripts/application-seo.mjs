import { applicationCategories, applicationUi } from "../src/applicationContent.js";
import { applicationOemUi } from "../src/applicationOem.js";
import { getWorkArticleForImage, workArticleUi } from "../src/workArticleData.js";

export const applicationSeoPages = applicationCategories.filter(category => category.id !== "hospitality").map(category => ({
  slug: category.path.slice(1, -1), file: `${category.path.slice(1)}index.html`,
  title: category.metaTitle, description: category.metaDescription,
  type: "Service", h1: category.name, intro: category.intro,
  sections: [[applicationUi.en.buyerHeading, category.buyerNeeds], [applicationUi.en.scopeHeading, category.scope]],
  faq: category.faq, related: category.related, images: category.gallery,
  application: category, serviceTypes: [category.name], lastmod: "2026-10-22", usePrimarySocialImage: true,
}));

function picture(image, esc, eager = false, workLinks = false) {
  const article = workLinks && getWorkArticleForImage(image.file);
  const img = `<img src="/seo-media/${esc(image.file)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""} />`;
  return `<figure>${article ? `<a href="${article.path}" tabindex="-1" aria-hidden="true">${img}</a>` : img}<figcaption><strong>${esc(image.label)}</strong> — ${esc(image.caption)}${article ? `<p><a href="${article.path}">${esc(workArticleUi.en.read)}: ${esc(article.title)}</a></p>` : ""}</figcaption></figure>`;
}

export function applicationOemHtml(category, esc) {
  const oem = category.oem, ui = applicationOemUi.en;
  return `<section id="oem-${esc(category.id)}" class="seo-application-oem"><p>${esc(ui.eyebrow)}</p><h2>${esc(oem.heading)}</h2><p>${esc(oem.intro)}</p><ol>${oem.steps.map(step => `<li><h3>${esc(step.title)}</h3><p>${esc(step.detail)}</p></li>`).join("")}</ol><h3>${esc(oem.scopeHeading)}</h3><ul>${oem.quotationScope.map(item => `<li>${esc(item)}</li>`).join("")}</ul><nav aria-label="OEM project resources">${(oem.evidenceLinks || []).map(([label,href]) => `<a href="${esc(href)}">${esc(label)}</a> · `).join("")}<a href="/custom-sculpture/">${esc(ui.process)}</a> · <a href="/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template">${esc(ui.rfq)}</a> · <a href="/commission/">${esc(ui.brief)}</a></nav></section>`;
}

export function applicationCardsHtml(esc, heading = "h2") {
  const ui = applicationUi.en;
  return `<section id="applications" class="seo-application-index"><p>${esc(ui.eyebrow)}</p><${heading}>${esc(ui.indexTitle)}</${heading}><p>${esc(ui.indexIntro)}</p><div class="seo-catalog-grid">${applicationCategories.map(category => `<article class="seo-catalog-card"><h${heading === "h1" ? "2" : "3"}><a href="${category.path}">${esc(category.name)}</a></h${heading === "h1" ? "2" : "3"}>${picture(category.gallery[0], esc)}<p>${esc(category.intro)}</p><a href="${category.path}">${esc(ui.explore)}: ${esc(category.name)}</a></article>`).join("")}</div></section>`;
}

export function applicationEvidenceHtml(category, esc) {
  const ui = applicationUi.en;
  return `<section class="seo-application-evidence"><h2>${esc(category.name)}</h2><p>${esc(category.intro)}</p><h3>${esc(ui.buyerHeading)}</h3><ul>${category.buyerNeeds.map(item => `<li>${esc(item)}</li>`).join("")}</ul><h3>${esc(ui.scopeHeading)}</h3><ul>${category.scope.map(item => `<li>${esc(item)}</li>`).join("")}</ul><h3>${esc(ui.galleryHeading)}</h3><p>${esc(category.evidenceNote)}</p><div class="seo-catalog-grid">${category.gallery.map(image => picture(image, esc, false, true)).join("")}</div></section>${applicationOemHtml(category, esc)}`;
}

export function applicationFallback(page, esc) {
  const category = page.application, ui = applicationUi.en;
  return `<main class="seo-fallback" data-seo-fallback="true"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/sculptures/">${esc(ui.nav)}</a> / <span>${esc(category.name)}</span></nav><h1>${esc(category.name)}</h1><p>${esc(category.intro)}</p>${applicationEvidenceHtml(category, esc)}<section><h2>${esc(ui.faqHeading)}</h2>${category.faq.map(([q,a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</section><nav aria-label="${esc(ui.relatedHeading)}"><h2>${esc(ui.relatedHeading)}</h2>${category.related.map(([label,href]) => `<p><a href="${href}">${esc(label)}</a></p>`).join("")}</nav><section><h2>${esc(ui.briefHeading)}</h2><p>${esc(ui.briefBody)}</p><a href="/commission/">${esc(ui.briefAction)}</a></section>${applicationCardsHtml(esc)}</main>`;
}

export function applicationItemList(site) {
  return { "@type":"ItemList", "@id":`${site}/sculptures/#applications`, name:applicationUi.en.indexTitle, numberOfItems:4,
    itemListElement: applicationCategories.map((category,index) => ({ "@type":"ListItem", position:index+1, name:category.name, url:`${site}${category.path}` })) };
}
