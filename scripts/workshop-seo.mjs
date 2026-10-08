import { getWorkshopEvidence, workshopImageSrcSet } from "../src/workshopEvidence.js";

export function escapeWorkshopHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function figure(image, sizes, className = "") {
  const esc = escapeWorkshopHtml;
  return `<figure${className ? ` class="${esc(className)}"` : ""}><img src="${esc(image.src)}" srcset="${esc(workshopImageSrcSet(image))}" sizes="${esc(sizes)}" width="${image.width}" height="${image.height}" alt="${esc(image.alt)}" loading="lazy" decoding="async" /><figcaption>${esc(image.caption)}</figcaption></figure>`;
}

// English content is identical to the visible component's canonical source.
// Existing page generators own their shared frame, route metadata and H1.
export function workshopGalleryHtml({ compact = false } = {}) {
  const copy = getWorkshopEvidence("en"), esc = escapeWorkshopHtml;
  const titleId = compact ? "workshop-preview-title" : "workshop-records-title";
  const photos = compact
    ? `<div class="workshop-preview-layout">${figure(copy.compactImages[0], "(max-width: 767px) calc(100vw - 36px), 57vw", "workshop-preview-main")}<div class="workshop-preview-secondary">${copy.compactImages.slice(1).map(image => figure(image, "(max-width: 767px) calc(50vw - 27px), 30vw")).join("")}</div></div>`
    : `<div class="workshop-rows">${copy.groups.map((group, index) => `<article class="workshop-row" aria-labelledby="${esc(group.id)}"><div class="workshop-row-copy"><span class="workshop-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><h3 id="${esc(group.id)}">${esc(group.title)}</h3><p>${esc(group.body)}</p></div><div class="workshop-photo-pair">${group.images.map(image => figure(image, "(max-width: 620px) calc(100vw - 36px), (max-width: 1000px) calc(50vw - 30px), 30vw")).join("")}</div></article>`).join("")}</div>`;
  return `<section class="workshop-evidence${compact ? " workshop-evidence-compact" : ""}" id="${compact ? "workshop-preview" : copy.id}" aria-labelledby="${titleId}"><header class="workshop-heading"><p class="workshop-eyebrow">${esc(copy.eyebrow)}</p><h2 id="${titleId}">${esc(compact ? copy.compactTitle : copy.title)}</h2><p>${esc(compact ? copy.compactBody : copy.body)}</p></header>${photos}<footer class="workshop-footer"><p>${esc(copy.note)}</p><a class="workshop-cta" href="${esc(compact ? copy.compactHref : copy.actionHref)}">${esc(compact ? copy.compactAction : copy.action)}</a></footer></section>`;
}

export function workshopImageObjects(site = "https://weieryangart.com", { compact = false } = {}) {
  const copy = getWorkshopEvidence("en");
  const base = site.replace(/\/$/, "");
  return (compact ? copy.compactImages : copy.images).map(image => {
    const url = `${base}${image.src}`;
    return { "@type": "ImageObject", "@id": `${url}#image`, url, contentUrl: url, width: image.width, height: image.height, name: image.alt, caption: image.caption };
  });
}
