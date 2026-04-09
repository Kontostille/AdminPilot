import { SEOHead } from '../../components/shared/index.jsx';
import { resetCookieConsent } from '../../components/shared/CookieBanner.jsx';
import { COMPANY } from '../../data/siteConfig.js';
export default function DatenschutzPage() {
  return (<><SEOHead title="Datenschutzerklärung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Datenschutzerklärung</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Stand: April 2026 · Entwurf – wird durch Rechtsanwalt finalisiert</p>
      <div style={{ lineHeight: 1.9 }}>
        <h2>1. Verantwortlicher</h2>
        <p>{COMPANY.name}, {COMPANY.address}, {COMPANY.zip} {COMPANY.city}<br/>E-Mail: {COMPANY.email}<br/>Geschäftsführung: {COMPANY.directors.join(', ')}</p>
        <h2>2. Welche Daten erheben wir?</h2>
        <p>Im Rahmen der Nutzung von AdminPilot erheben wir folgende Daten:</p>
        <p><strong>Bei Nutzung der Website:</strong> Technische Zugriffsdaten (IP-Adresse, Browser, Betriebssystem, Zeitstempel). Wir verwenden Plausible Analytics – ein cookieloses Analyse-Tool, das keine personenbezogenen Daten erhebt.</p>
        <p><strong>Bei Registrierung:</strong> E-Mail-Adresse (für Magic-Link-Login über Clerk).</p>
        <p><strong>Bei Antragstellung:</strong> Name, Adresse, Geburtsdatum, Einkommensnachweise, Mietvertrag, Personalausweis, ggf. Rentenbescheid, Geburtsurkunden. Diese Daten werden ausschließlich zur Antragstellung bei der zuständigen Behörde verwendet.</p>
        <h2>3. Besondere Datenkategorien (Art. 9 DSGVO)</h2>
        <p>Im aktuellen Leistungsangebot (MVP) verarbeiten wir grundsätzlich keine besonderen Kategorien personenbezogener Daten im Sinne von Art. 9 DSGVO (insbesondere keine Gesundheitsdaten). Beim EM-Rentenzuschlag wird ausschließlich der Rentenbescheid ausgelesen – keine Diagnosen oder Gesundheitsinformationen.</p>
        <h2>4. Rechtsgrundlage</h2>
        <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
        <h2>5. Auftragsverarbeiter</h2>
        <p>Wir setzen folgende Dienstleister ein:</p>
        <p>• <strong>Supabase</strong> (Datenbank & Storage) – Server in Frankfurt, Deutschland<br/>
        • <strong>Clerk</strong> (Authentifizierung) – EU-DSGVO-konform<br/>
        • <strong>Stripe</strong> (Zahlungsabwicklung) – PCI DSS zertifiziert<br/>
        • <strong>Resend</strong> (E-Mail-Versand) – für Transaktions-E-Mails<br/>
        • <strong>Vercel</strong> (Hosting) – Edge-Server in der EU<br/>
        • <strong>Anthropic Claude API</strong> (Dokumentenanalyse) – via Supabase Edge Function in Frankfurt</p>
        <h2>6. Speicherdauer</h2>
        <p>Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt. Antragsdaten werden maximal 24 Monate nach Abschluss des Vorgangs gespeichert, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p>
        <h2>7. Ihre Rechte</h2>
        <p>Sie haben das Recht auf: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21), Beschwerde bei einer Aufsichtsbehörde.</p>
        <h2>8. Cookies</h2>
        <p>AdminPilot verwendet keine Cookies für Tracking-Zwecke. Plausible Analytics arbeitet vollständig ohne Cookies. Technisch notwendige Cookies (z.B. für die Authentifizierung) werden nur mit Ihrer Einwilligung gesetzt.</p>
        <h2>9. Cookie-Einstellungen ändern</h2>
        <p>Sie können Ihre Cookie-Einstellungen jederzeit anpassen:</p>
        <button onClick={resetCookieConsent} style={{ padding: "8px 20px", background: "var(--ap-dark)", color: "#FFF", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600 }}>Cookie-Einstellungen öffnen</button>
        <h2>10. Kontakt für Datenschutzanfragen</h2>
        <p>{COMPANY.email}</p>
      </div>
    </div></section>
  </>);
}
