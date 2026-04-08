import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY } from '../../data/siteConfig.js';
export default function ImpressumPage() {
  return (<><SEOHead title="Impressum" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Impressum</h1>
      <p style={{ marginTop: 'var(--space-4)', lineHeight: 2 }}>
        <strong>Angaben gemäß § 5 TMG:</strong><br/><br/>
        {COMPANY.name}<br/>{COMPANY.address}<br/>{COMPANY.zip} {COMPANY.city}<br/>{COMPANY.country}<br/><br/>
        <strong>Vertreten durch die Geschäftsführung:</strong><br/>
        {COMPANY.directors.join(', ')}<br/><br/>
        <strong>Kontakt:</strong><br/>
        E-Mail: <a href={'mailto:'+COMPANY.email}>{COMPANY.email}</a><br/><br/>
        <strong>Registereintrag:</strong><br/>
        Eingetragen im Handelsregister beim {COMPANY.register}<br/><br/>
        <strong>Umsatzsteuer-ID:</strong><br/>
        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: {COMPANY.ustId}<br/><br/>
        <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br/>
        {COMPANY.directors[0]}<br/>{COMPANY.address}<br/>{COMPANY.zip} {COMPANY.city}<br/><br/>
        <strong>Hinweis:</strong><br/>
        AdminPilot ist ein Service der {COMPANY.name}. AdminPilot bietet keine Rechts- oder Sozialberatung an. Der Service ist eine technische Ausfüllhilfe für Verwaltungsanträge.
      </p>
    </div></section>
  </>);
}
