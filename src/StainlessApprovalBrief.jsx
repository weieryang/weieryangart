import { getStainlessApprovalBrief } from "./stainlessApprovalBrief.js";
import "./stainlessApprovalBrief.css";

export function StainlessApprovalBrief({ language = "en" }) {
  const brief = getStainlessApprovalBrief(language);
  return (
    <section className="stainless-approval section-shell" id="finish-approval-brief" aria-labelledby="stainless-approval-title">
      <header>
        <p className="hero-eyebrow">{brief.eyebrow}</p>
        <h2 id="stainless-approval-title">{brief.title}</h2>
        <p>{brief.intro}</p>
      </header>
      <table>
        <thead><tr>{brief.headers.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{brief.rows.map(row => <tr key={row[0]}>
          <th scope="row">{row[0]}</th>
          <td data-label={brief.headers[1]}>{row[1]}</td>
          <td data-label={brief.headers[2]}>{row[2]}</td>
        </tr>)}</tbody>
      </table>
      <div className="stainless-approval-record">
        <h3>{brief.recordTitle}</h3>
        <ul>{brief.records.map(record => <li key={record}>{record}</li>)}</ul>
        <p>{brief.boundary}</p>
      </div>
      <nav className="stainless-approval-links" aria-label={brief.relatedLabel}>
        {brief.links.map(([label, href]) => <a href={href} key={href}>{label}<span aria-hidden="true"> ↗</span></a>)}
      </nav>
      <p className="stainless-approval-references">{brief.sourcesLabel}: {brief.sources.map(([label, href], index) => <span key={href}>{index > 0 ? " · " : ""}<a href={href}>{label}</a></span>)}</p>
      <p className="stainless-approval-boundary">{brief.referenceNote}</p>
    </section>
  );
}
