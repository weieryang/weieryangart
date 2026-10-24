import { getWorkArticles, workArticleUi } from "../src/workArticleData.js";
import { applicationCategories } from "../src/applicationContent.js";

const articles = getWorkArticles("en");
// The first eight studies became public when their shared Pages deployment
// completed (run 39711528365, Deploy to GitHub Pages, 2026-10-22T02:28:26Z).
// Preserve their original calendar date; do not invent times for other dates.
const verifiedPublicationDateTimes = { "2026-10-22": "2026-10-22T02:28:26Z" };
export const workArticleSeoPages = articles.map(article => ({
  slug: article.path.slice(1, -1), file: `${article.path.slice(1)}index.html`,
  title: `${article.title} | WEIERYANG`, description: article.standfirst,
  h1: article.title, intro: article.standfirst, type: "WebPage",
  images: article.images, faq: article.faq, workArticle: article,
  lastmod: article.publishedOn, usePrimarySocialImage: true,
}));

export function workArticleSchema(page, site) {
  const article = page.workArticle, url = `${site}${article.path}`;
  return {
    "@type": "Article", "@id": `${url}#article`, url,
    headline: article.title, description: article.standfirst,
    mainEntityOfPage: { "@id": `${url}#page` },
    author: { "@id": `${site}/#organization` }, publisher: { "@id": `${site}/#organization` },
    image: article.images.map(image => ({ "@id": `${site}/seo-media/${image.file}#image` })),
    datePublished: verifiedPublicationDateTimes[article.publishedOn] || article.publishedOn,
    dateModified: verifiedPublicationDateTimes[page.lastmod] || page.lastmod, inLanguage: "en",
    articleSection: applicationCategories.find(category => category.id === article.categoryId).name,
  };
}

export function workArticleFallback(page, esc) {
  const article = page.workArticle, ui = workArticleUi.en;
  const category = applicationCategories.find(item => item.id === article.categoryId);
  const related = articles.filter(item => item.categoryId === article.categoryId && item.slug !== article.slug);
  return `<main class="seo-fallback" data-seo-fallback="true"><article><nav aria-label="Breadcrumb"><a href="/">${esc(ui.home)}</a> / <a href="/sculptures/">${esc(ui.applications)}</a> / <a href="${category.path}">${esc(category.name)}</a> / <span>${esc(article.title)}</span></nav><header><p>${esc(ui.record)}</p><h1>${esc(article.title)}</h1><p>${esc(article.standfirst)}</p><p>${esc(ui.publishedLabel)}: <time datetime="${article.publishedOn}">${article.publishedOn}</time></p></header>${article.images.map((image,index) => `<figure><img src="/seo-media/${esc(image.file)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" loading="${index ? "lazy" : "eager"}"${index ? "" : ' fetchpriority="high"'} decoding="async" /><figcaption><strong>${esc(image.label)}</strong> — ${esc(image.caption)}</figcaption></figure>`).join("")}${article.sections.map(section => `<section><h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p></section>`).join("")}<section><h2>${esc(ui.briefHeading)}</h2><ul>${article.brief.map(item => `<li>${esc(item)}</li>`).join("")}</ul><p>${esc(ui.scopeNote)}</p><a href="/commission/">${esc(ui.briefAction)}</a></section><section><h2>${esc(ui.faqHeading)}</h2>${article.faq.map(([question,answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</section><nav aria-label="${esc(ui.relatedHeading)}"><h2>${esc(ui.relatedHeading)}</h2><p><a href="${category.path}">${esc(ui.backToCategory)}: ${esc(category.name)}</a></p><p><a href="${category.path}#oem-${category.id}">${esc(ui.oemGuide)}</a></p><p><a href="/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template">${esc(ui.preparation)}</a></p></nav><nav aria-label="${esc(ui.otherWorks)}"><h2>${esc(ui.otherWorks)}</h2>${related.map(item => `<p><a href="${item.path}">${esc(item.title)}</a></p>`).join("")}</nav></article></main>`;
}
