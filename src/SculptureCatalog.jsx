import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { sculptureProducts, getSculpture } from "./sculptureCatalog.js";
import { catalogUi, localizeSculpture } from "./sculptureCatalogCopy.js";

function SculptureImage({ image, priority = false, sizes = "(max-width: 767px) calc(100vw - 36px), 50vw" }) {
  const src = `/seo-media/${image.file}`;
  const variants = [640, 960].filter(width => width < image.width).map(width => `${src.replace(".webp", `-${width}w.webp`)} ${width}w`);
  return <img src={src} srcSet={[...variants, `${src} ${image.width}w`].join(", ")} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />;
}

function CollectionCard({ product, ui, index }) {
  return <article className="collection-card">
    <a className="collection-card-image" href={product.path} tabIndex={-1} aria-hidden="true"><SculptureImage image={product.images[0]} sizes="(max-width: 767px) calc(100vw - 36px), (max-width: 1100px) 44vw, 23vw" /></a>
    <div className="collection-card-copy"><p className="collection-category"><span>{String(index + 1).padStart(2, "0")}</span>{product.category}</p>
      <h3><a href={product.path}>{product.title}</a></h3>
      <p>{product.intro}</p>
      <span className="collection-evidence-tag">{product.evidenceType === "construction" ? ui.constructionLabel : ui.referenceLabel}</span>
      <a className="text-link" href={product.path}>{ui.view}<ArrowUpRight size={18} aria-hidden="true" /></a>
    </div>
  </article>;
}

export function SculptureCollectionPreview({ language = "en" }) {
  const ui = catalogUi[language] || catalogUi.en;
  return <section className="collection-preview section-shell" aria-labelledby="collection-preview-title">
    <header className="collection-heading"><p className="hero-eyebrow">{ui.eyebrow}</p><h2 id="collection-preview-title">{ui.previewTitle}</h2><p>{ui.previewBody}</p><a className="text-link" href="/sculptures/">{ui.nav}<ArrowRight size={18} aria-hidden="true" /></a></header>
    <div className="collection-grid">{sculptureProducts.map((product, index) => <CollectionCard key={product.slug} product={localizeSculpture(product, language)} ui={ui} index={index} />)}</div>
  </section>;
}

export function SculptureCollection({ language = "en" }) {
  const ui = catalogUi[language] || catalogUi.en;
  return <>
    <section className="collection-index section-shell">
      <header className="collection-heading"><p className="hero-eyebrow">{ui.eyebrow}</p><h1>{ui.indexTitle}</h1><p>{ui.indexIntro}</p></header>
      <div className="collection-grid">{sculptureProducts.map((product, index) => <CollectionCard key={product.slug} product={localizeSculpture(product, language)} ui={ui} index={index} />)}</div>
    </section>
    <section className="collection-scope section-shell"><div><p className="hero-eyebrow">WEIERYANG</p><h2>{ui.scopeHeading}</h2></div><div><p>{ui.scopeBody}</p><a className="text-link" href="/commission/">{ui.briefLink}<ArrowRight size={18} aria-hidden="true" /></a></div></section>
  </>;
}

export function SculptureDetail({ slug, language = "en", renderInquiry }) {
  const canonical = getSculpture(slug);
  const ui = catalogUi[language] || catalogUi.en;
  if (!canonical) return <section className="collection-index section-shell"><h1>{ui.notFound}</h1><p>{ui.notFoundBody}</p><a className="text-link" href="/sculptures/">{ui.back}</a></section>;
  const product = localizeSculpture(canonical, language);
  return <>
    <section className="collection-detail-hero section-shell">
      <div className="collection-detail-copy"><a className="collection-back" href="/sculptures/">← {ui.back}</a><p className="hero-eyebrow">{product.category}</p><h1>{product.title}</h1><p className="collection-intro">{product.intro}</p>
        <span className="collection-evidence-tag">{product.evidenceType === "construction" ? ui.constructionLabel : ui.referenceLabel}</span>
        <p className="collection-disclosure">{product.disclosure}</p><a className="hero-cta" href="#product-inquiry">{ui.request}<ArrowRight size={20} aria-hidden="true" /></a>
      </div>
      <figure className="collection-main-image"><SculptureImage image={product.images[0]} priority /><figcaption>{product.images[0].caption}</figcaption></figure>
    </section>
    <section className="collection-facts section-shell">
      <div><p className="hero-eyebrow">{ui.designHeading}</p><dl>{product.specification.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
      <div><h2>{ui.reviewHeading}</h2><ol>{product.review.map(item => <li key={item}>{item}</li>)}</ol></div>
    </section>
    <section className="collection-gallery section-shell" aria-label={product.category}>{product.images.slice(1).map(image => <figure key={image.file}><SculptureImage image={image} /><figcaption>{image.caption}</figcaption></figure>)}</section>
    <section className="collection-inquiry section-shell" id="product-inquiry" aria-labelledby="product-inquiry-title"><header><p className="hero-eyebrow">{product.category}</p><h2 id="product-inquiry-title">{ui.formHeading}</h2><p>{ui.formBody}</p><p>{ui.scopeBody}</p><a className="text-link" href={`/commission/?route=${canonical.inquiryId}`}>{ui.briefLink}<ArrowUpRight size={18} aria-hidden="true" /></a></header><div>{renderInquiry(product)}</div></section>
    <section className="collection-faq section-shell"><h2>{ui.faqHeading}</h2><div>{product.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className="collection-related section-shell"><h2>{ui.relatedHeading}</h2><nav aria-label={ui.relatedHeading}>{product.related.map(([label, href]) => <a href={href} key={href}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}</nav></section>
    <section className="collection-more section-shell"><h2>{ui.moreHeading}</h2><div className="collection-grid">{sculptureProducts.filter(item => item.slug !== slug).map((item, index) => <CollectionCard key={item.slug} product={localizeSculpture(item, language)} ui={ui} index={index} />)}</div></section>
  </>;
}
