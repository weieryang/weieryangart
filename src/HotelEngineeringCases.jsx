import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { hotelCases, hotelCaseImages } from "./hotelCases.js";

export function HotelEngineeringCases({ language = "en" }) {
  const text = hotelCases[language] || hotelCases.en;
  return <section className="hotel-cases section-shell" id="cases" aria-labelledby="hotel-cases-title">
    <header className="hotel-cases-heading">
      <p className="hero-eyebrow">{text.eyebrow}</p>
      <h2 id="hotel-cases-title">{text.title}</h2>
      <p>{text.body}</p>
    </header>
    <p className="hotel-cases-disclosure">{text.note}</p>
    <div className="hotel-case-grid">
      {text.cards.map((card, index) => {
        const media = hotelCaseImages[index];
        const src = `/seo-media/${media.file}`;
        return <article className={`hotel-case${index === 0 ? " hotel-case-featured" : ""}`} key={media.file}>
          <figure>
            <img src={src} srcSet={`${src.replace(".webp", "-640w.webp")} 640w, ${src.replace(".webp", "-960w.webp")} 960w, ${src} ${media.width}w`} sizes="(max-width: 767px) calc(100vw - 36px), (max-width: 1100px) 44vw, 520px" alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
            <figcaption>{text.badge}</figcaption>
          </figure>
          <div className="hotel-case-copy">
            <p className="hotel-case-kicker">{card.label}</p>
            <h3>{card.title}</h3><p>{card.body}</p>
            <ul>{card.checks.map(check => <li key={check}>{check}</li>)}</ul>
            <a className="text-link" href={media.href}>{text.action}<ArrowUpRight size={19} aria-hidden="true" /></a>
          </div>
        </article>;
      })}
    </div>
    <aside className="hotel-construction-proof">
      <img src="/seo-media/middle-east-stainless-steel-landmark-installation-640w.webp" alt="Verified construction-stage flying-bird sculpture lifting at a Middle East public site" width="640" height="447" loading="lazy" decoding="async" />
      <div><p className="hotel-case-kicker">{text.proofLabel}</p><h3>{text.proofTitle}</h3><p>{text.proofBody}</p><a className="text-link" href="/projects/#project-evidence-title">{text.proofAction}<ArrowRight size={18} aria-hidden="true" /></a></div>
    </aside>
    <nav className="hotel-cases-actions" aria-label={text.title}><a className="hero-cta" href="/commission/?route=resort-sculpture">{text.brief}<ArrowUpRight size={20} aria-hidden="true" /></a><a className="text-link" href="/resort-sculpture/">{text.hub}<ArrowRight size={18} aria-hidden="true" /></a></nav>
  </section>;
}
