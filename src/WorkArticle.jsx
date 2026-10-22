import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { getWorkArticle, getWorkArticles, workArticleUi } from "./workArticleData.js";
import { getApplicationCategories } from "./applicationContent.js";
import "./workArticle.css";

function ArticleImage({ image, priority = false, thumbnail = false }) {
  const src = `/seo-media/${image.file}`;
  const variants = [640, 960].filter(width => width < image.width).map(width => `${src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`);
  return <img src={src} srcSet={[...variants, `${src} ${image.width}w`].join(", ")} sizes={thumbnail ? "104px" : "(max-width: 767px) calc(100vw - 36px), (max-width: 1200px) calc(100vw - 96px), 1100px"} width={image.width} height={image.height} alt={thumbnail ? "" : image.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />;
}

function ArticleFigure({ image, priority = false, className = "" }) {
  return <figure className={`work-article-figure ${className}`.trim()} style={{ "--work-image-ratio": image.width / image.height }}>
    <ArticleImage image={image} priority={priority} />
    <figcaption>{image.label && <span className="work-article-image-label">{image.label}</span>}<span>{image.caption}</span></figcaption>
  </figure>;
}

function readableDate(date, language) {
  const locales = { en: "en-US", zh: "zh-CN", ar: "ar", fr: "fr-FR", es: "es-ES", de: "de-DE" };
  return new Intl.DateTimeFormat(locales[language] || locales.en, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function WorkArticle({ slug, language = "en" }) {
  const article = getWorkArticle(slug, language);
  if (!article) return null;
  const ui = workArticleUi[language] || workArticleUi.en;
  const category = getApplicationCategories(language).find(item => item.id === article.categoryId);
  const oemHref = article.oemHref || (category ? `${category.path}#oem-${category.id}` : null);
  const related = getWorkArticles(language).filter(item => item.categoryId === article.categoryId && item.slug !== article.slug).slice(0, 3);
  return <article className="work-article section-shell" dir={language === "ar" ? "rtl" : undefined} aria-labelledby="work-article-title">
    <nav className="work-article-breadcrumbs" aria-label={ui.applications}><ol>
      <li><a href="/">{ui.home}</a></li>
      <li><a href="/sculptures/">{ui.applications}</a></li>
      {category && <li><a href={category.path}>{category.name}</a></li>}
      <li aria-current="page">{article.title}</li>
    </ol></nav>
    <header className="work-article-masthead">
      <p className="hero-eyebrow">{ui.record}</p>
      <h1 id="work-article-title">{article.title}</h1>
      <p className="work-article-standfirst">{article.standfirst}</p>
      <p className="work-article-date"><span>{ui.publishedLabel}</span><time dateTime={article.publishedOn}>{readableDate(article.publishedOn, language)}</time></p>
    </header>
    {article.images[0] && <div className="work-article-cover"><ArticleFigure image={article.images[0]} priority className="work-article-hero-image" /></div>}
    <div className="work-article-reading">
      {article.sections.map((section, index) => <section className="work-article-section" key={section.heading} aria-labelledby={`work-section-${index}`}>
        <h2 id={`work-section-${index}`}>{section.heading}</h2>
        {(Array.isArray(section.body) ? section.body : String(section.body).split(/\n\s*\n/)).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
      </section>)}
    </div>
    {article.images.length > 1 && <div className="work-article-angles">{article.images.slice(1).map(image => <ArticleFigure image={image} key={image.file} />)}</div>}
    <div className="work-article-reading">
      <section className="work-article-preparation" aria-labelledby="work-brief-title"><h2 id="work-brief-title">{ui.briefHeading}</h2><ul>{article.brief.map(item => <li key={item}>{item}</li>)}</ul><p className="work-article-scope-note">{ui.scopeNote}</p><a className="hero-cta" href="/commission/">{ui.briefAction}<ArrowRight size={20} aria-hidden="true" /></a></section>
      <section className="work-article-faq" aria-labelledby="work-faq-title"><h2 id="work-faq-title">{ui.faqHeading}</h2>{article.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      <section className="work-article-resources" aria-labelledby="work-resources-title"><h2 id="work-resources-title">{ui.relatedHeading}</h2><nav aria-label={ui.relatedHeading}>
        {category && <a href={category.path}>{ui.backToCategory}<span>{category.name}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
        {oemHref && <a href={oemHref}>{ui.oemGuide}<ArrowUpRight size={18} aria-hidden="true" /></a>}
        <a href="/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template">{ui.preparation}<ArrowUpRight size={18} aria-hidden="true" /></a>
      </nav></section>
      {related.length > 0 && <section className="work-article-related" aria-labelledby="work-related-title"><h2 id="work-related-title">{ui.otherWorks}</h2><nav aria-label={ui.otherWorks}>{related.map(item => <a className="work-article-related-link" href={item.path} key={item.slug}>{item.images[0] && <span className="work-article-related-image"><ArticleImage image={item.images[0]} thumbnail /></span>}<span>{item.title}</span><ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav></section>}
    </div>
  </article>;
}
