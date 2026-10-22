import { ArrowUpRight } from '@phosphor-icons/react';
import { applicationOemUi } from './applicationOem.js';
import './applicationOem.css';

// FAQs are rendered once by the category page and mirrored in its existing JSON-LD.
export function ApplicationOemSection({ oem, language = 'en' }) {
  if (!oem) return null;
  const ui = applicationOemUi[language] || applicationOemUi.en;
  return <section className="application-oem section-shell" id={`oem-${oem.id}`} aria-labelledby={`oem-heading-${oem.id}`} dir={language === 'ar' ? 'rtl' : undefined}>
    <header className="application-oem-heading"><p className="hero-eyebrow">{ui.eyebrow}</p><h2 id={`oem-heading-${oem.id}`}>{oem.heading}</h2><p>{oem.intro}</p></header>
    <ol className="application-oem-steps">{oem.steps.map((step, index) => <li key={step.title}><span className="application-oem-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.detail}</p></li>)}</ol>
    <div className="application-oem-scope"><h3>{oem.scopeHeading}</h3><ul>{oem.quotationScope.map(item => <li key={item}>{item}</li>)}</ul></div>
    <nav className="application-oem-links" aria-label={oem.heading}>
      {oem.evidenceLinks?.map(([label, href]) => <a href={href} key={href}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
      <a href="/custom-sculpture/">{ui.process}<ArrowUpRight size={18} aria-hidden="true" /></a>
      <a href="/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template">{ui.rfq}<ArrowUpRight size={18} aria-hidden="true" /></a>
      <a href="/commission/">{ui.brief}<ArrowUpRight size={18} aria-hidden="true" /></a>
    </nav>
  </section>;
}
