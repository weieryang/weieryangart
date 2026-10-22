import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { applicationUi, getApplicationCategories } from "./applicationContent.js";
import { ApplicationOemSection } from "./ApplicationOemSection.jsx";
import { getWorkArticleForImage, workArticleUi } from "./workArticleData.js";
import "./applications.css";

function copyFor(language) {
  return applicationUi[language] || applicationUi.en;
}

function categoryFor(id, language) {
  return getApplicationCategories(language).find(category => category.id === id);
}

function evidenceLabel(image, ui) {
  return image.label || ui[`${image.evidenceType}Label`] || ui.referenceLabel;
}

function ApplicationImage({ image, priority = false, sizes = "(max-width: 767px) calc(100vw - 36px), 46vw" }) {
  const src = `/seo-media/${image.file}`;
  const variants = [640, 960].filter(width => width < image.width).map(width => `${src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`);
  return <img src={src} srcSet={[...variants, `${src} ${image.width}w`].join(", ")} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />;
}

function ApplicationFigure({ image, ui, priority = false, className = "", language = "en" }) {
  const article = getWorkArticleForImage(image.file, language);
  const articleUi = workArticleUi[language] || workArticleUi.en;
  return <figure className={`application-figure ${className}`.trim()}>
    {article ? <a className="application-figure-link" href={article.path} tabIndex={-1} aria-hidden="true"><ApplicationImage image={image} priority={priority} /></a> : <ApplicationImage image={image} priority={priority} />}
    <figcaption><span className="application-evidence-label">{evidenceLabel(image, ui)}</span><span>{image.caption}</span>{article && <a className="application-article-link" href={article.path}>{articleUi.read}: {article.title}<ArrowUpRight size={18} aria-hidden="true" /></a>}</figcaption>
  </figure>;
}

function ApplicationCard({ category, ui, index, headingLevel }) {
  const Heading = `h${Math.min(6, headingLevel + 1)}`;
  const image = category.gallery[0];
  return <article className="application-card">
    <a className="application-card-image" href={category.path} tabIndex={-1} aria-hidden="true"><ApplicationImage image={image} /></a>
    <div className="application-card-copy">
      <span className="application-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Heading><a href={category.path}>{category.name}</a></Heading>
      <p>{category.intro}</p>
      <p className="application-card-evidence"><span>{evidenceLabel(image, ui)}</span>{image.caption}</p>
      <a className="application-card-action" href={category.path}>{ui.explore}<ArrowUpRight size={20} aria-hidden="true" /></a>
    </div>
  </article>;
}

export function ApplicationCards({ language = "en", headingLevel = 2, compact = false, showHeading = true }) {
  const ui = copyFor(language);
  const level = Math.max(1, Math.min(5, Number(headingLevel) || 2));
  const Heading = `h${level}`;
  const headingId = compact ? "applications-preview-title" : "applications-title";
  return <section className={`application-browser section-shell${compact ? " application-browser-compact" : ""}`} id={compact ? "application-preview" : "applications"} aria-labelledby={showHeading ? headingId : undefined} aria-label={showHeading ? undefined : ui.nav} dir={language === "ar" ? "rtl" : undefined}>
    {showHeading && <header className="application-heading"><p className="hero-eyebrow">{ui.eyebrow}</p><Heading id={headingId}>{ui.indexTitle}</Heading><p>{ui.indexIntro}</p></header>}
    <div className="application-grid">{getApplicationCategories(language).map((category, index) => <ApplicationCard key={category.id} category={category} ui={ui} index={index} headingLevel={showHeading ? level : Math.max(1, level - 1)} />)}</div>
  </section>;
}

export function ApplicationEvidence({ id, language = "en", omitFirstImage = false, showIntro = true }) {
  const category = categoryFor(id, language);
  if (!category) return null;
  const ui = copyFor(language);
  const images = omitFirstImage ? category.gallery.slice(1) : category.gallery;
  return <div className="application-evidence" dir={language === "ar" ? "rtl" : undefined}>
    {showIntro && <header className="application-evidence-intro section-shell"><p className="hero-eyebrow">{ui.eyebrow}</p><h2>{category.name}</h2><p>{category.intro}</p></header>}
    <section className="application-decisions section-shell" aria-label={category.name}>
      <div><h2>{ui.buyerHeading}</h2><ul>{category.buyerNeeds.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div><h2>{ui.scopeHeading}</h2><ul>{category.scope.map(item => <li key={item}>{item}</li>)}</ul></div>
    </section>
    {images.length > 0 && <section className="application-gallery section-shell" aria-labelledby={`application-gallery-${id}`}><h2 id={`application-gallery-${id}`}>{ui.galleryHeading}</h2>{category.evidenceNote && <p className="application-evidence-note">{category.evidenceNote}</p>}<div className="application-gallery-grid">{images.map(image => <ApplicationFigure image={image} ui={ui} key={image.file} language={language} />)}</div></section>}
    <ApplicationOemSection oem={category.oem} language={language} />
    {id === "hospitality" && <section className="application-faq section-shell" aria-labelledby="application-oem-faq-hospitality"><h2 id="application-oem-faq-hospitality">{ui.faqHeading}</h2><div>{category.oem.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>}
  </div>;
}

export function ApplicationCategory({ id, language = "en" }) {
  const category = categoryFor(id, language);
  if (!category) return null;
  const ui = copyFor(language);
  const categories = getApplicationCategories(language);
  const homeLabel = ui.home || ({ en: "Home", zh: "首页", ar: "الرئيسية", fr: "Accueil", es: "Inicio", de: "Startseite" }[language] || "Home");
  return <div className="application-page" dir={language === "ar" ? "rtl" : undefined}>
    <section className="application-hero section-shell" aria-labelledby={`application-heading-${id}`}>
      <div className="application-hero-copy"><nav className="application-breadcrumbs" aria-label={ui.nav}><ol><li><a href="/">{homeLabel}</a></li><li><a href="/sculptures/">{ui.allApplications}</a></li><li aria-current="page">{category.name}</li></ol></nav><p className="hero-eyebrow">{ui.eyebrow}</p><h1 id={`application-heading-${id}`}>{category.name}</h1><p>{category.intro}</p><a className="hero-cta" href="/commission/">{ui.briefAction}<ArrowRight size={20} aria-hidden="true" /></a></div>
      <ApplicationFigure image={category.gallery[0]} ui={ui} priority className="application-hero-figure" />
    </section>
    <ApplicationEvidence id={id} language={language} omitFirstImage showIntro={false} />
    <section className="application-faq section-shell" aria-labelledby={`application-faq-${id}`}><h2 id={`application-faq-${id}`}>{ui.faqHeading}</h2><div>{category.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className="application-related section-shell" aria-labelledby={`application-related-${id}`}><h2 id={`application-related-${id}`}>{ui.relatedHeading}</h2><nav aria-label={ui.relatedHeading}>{category.related.map(([label, path]) => <a href={path} key={path}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}</nav></section>
    <section className="application-brief section-shell" aria-labelledby={`application-brief-${id}`}><div><p className="hero-eyebrow">WEIERYANG</p><h2 id={`application-brief-${id}`}>{ui.briefHeading}</h2></div><div><p>{ui.briefBody}</p><a className="hero-cta" href="/commission/">{ui.briefAction}<ArrowRight size={20} aria-hidden="true" /></a></div></section>
    <section className="application-other section-shell" aria-labelledby={`application-other-${id}`}><h2 id={`application-other-${id}`}>{ui.otherApplications}</h2><nav aria-label={ui.otherApplications}>{categories.filter(item => item.id !== id).map(item => <a href={item.path} key={item.id}>{item.name}<ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav></section>
  </div>;
}
