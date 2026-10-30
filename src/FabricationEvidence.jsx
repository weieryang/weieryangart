import { fabricationPhotoRequest, getFabricationEvidenceCopy } from "./fabricationEvidence.js";
import "./fabricationEvidence.css";

export function FabricationEvidence({ language = "en" }) {
  const copy = getFabricationEvidenceCopy(language);
  return <section className="fabrication-evidence section-shell" id="oem-fabrication-records" aria-labelledby="oem-fabrication-records-title" dir={copy.language === "ar" ? "rtl" : undefined}>
    <header className="fabrication-evidence-heading">
      <p className="fabrication-evidence-eyebrow">{copy.eyebrow}</p>
      <h2 id="oem-fabrication-records-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>
    <div className="fabrication-evidence-records" aria-labelledby="fabrication-evidence-public-title">
      <h3 id="fabrication-evidence-public-title">{copy.recordsTitle}</h3>
      {copy.records.map(record => <article className="fabrication-evidence-record" key={record.id} aria-labelledby={record.id}>
        <header><h4 id={record.id}>{record.title}</h4><a className="fabrication-evidence-record-link" href={record.href}>{copy.viewRecord}<span aria-hidden="true"> ↗</span></a></header>
        <dl>
          <div><dt>{copy.visibleLabel}</dt><dd>{record.visible}</dd></div>
          <div><dt>{copy.limitLabel}</dt><dd>{record.limit}</dd></div>
          <div><dt>{copy.requestLabel}</dt><dd>{record.request}</dd></div>
        </dl>
      </article>)}
    </div>
    <p className="fabrication-evidence-boundary">{copy.boundary}</p>
    <div className="fabrication-evidence-download">
      <div><h3>{copy.downloadTitle}</h3><p>{copy.downloadBody}</p><p className="fabrication-evidence-handoff">{copy.handoff}</p></div>
      <div><a className="fabrication-evidence-download-link" href={fabricationPhotoRequest.href} download={fabricationPhotoRequest.fileName} hrefLang="en" type="text/plain">{copy.downloadLabel}<span aria-hidden="true"> ↓</span></a><p className="fabrication-evidence-download-note">{copy.downloadNote}</p></div>
    </div>
    <nav className="fabrication-evidence-related" aria-label={copy.relatedLabel}>{copy.related.map(link => <a href={link.href} key={link.href}>{link.label}<span aria-hidden="true"> ↗</span></a>)}</nav>
  </section>;
}

export default FabricationEvidence;
