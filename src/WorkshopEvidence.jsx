import { ArrowUpRight } from "@phosphor-icons/react";
import { getWorkshopEvidence, workshopImageSrcSet } from "./workshopEvidence.js";
import "./workshopEvidence.css";

function WorkshopFigure({ image, className = "", sizes }) {
  return <figure className={className}>
    <img src={image.src} srcSet={workshopImageSrcSet(image)} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
    <figcaption>{image.caption}</figcaption>
  </figure>;
}

export function WorkshopEvidence({ language = "en", compact = false }) {
  const copy = getWorkshopEvidence(language);
  const titleId = compact ? "workshop-preview-title" : "workshop-records-title";
  return <section className={`workshop-evidence section-shell${compact ? " workshop-evidence-compact" : ""}`} id={compact ? "workshop-preview" : copy.id} aria-labelledby={titleId} dir={language === "ar" ? "rtl" : undefined}>
    <header className="workshop-heading"><p className="workshop-eyebrow">{copy.eyebrow}</p><h2 id={titleId}>{compact ? copy.compactTitle : copy.title}</h2><p>{compact ? copy.compactBody : copy.body}</p></header>
    {compact ? <div className="workshop-preview-layout">
      <WorkshopFigure className="workshop-preview-main" image={copy.compactImages[0]} sizes="(max-width: 767px) calc(100vw - 36px), 57vw" />
      <div className="workshop-preview-secondary">{copy.compactImages.slice(1).map(image => <WorkshopFigure key={image.id} image={image} sizes="(max-width: 767px) calc(50vw - 27px), 30vw" />)}</div>
    </div> : <div className="workshop-rows">{copy.groups.map((group, index) => <article className="workshop-row" key={group.id} aria-labelledby={group.id}>
      <div className="workshop-row-copy"><span className="workshop-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3 id={group.id}>{group.title}</h3><p>{group.body}</p></div>
      <div className="workshop-photo-pair">{group.images.map(image => <WorkshopFigure key={image.id} image={image} sizes="(max-width: 620px) calc(100vw - 36px), (max-width: 1000px) calc(50vw - 30px), 30vw" />)}</div>
    </article>)}</div>}
    <footer className="workshop-footer"><p>{copy.note}</p><a className="workshop-cta" href={compact ? copy.compactHref : copy.actionHref}>{compact ? copy.compactAction : copy.action}<ArrowUpRight size={20} aria-hidden="true" /></a></footer>
  </section>;
}

export default WorkshopEvidence;
