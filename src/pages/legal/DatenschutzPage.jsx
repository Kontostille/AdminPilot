import { SEOHead } from '../../components/shared/index.jsx';
import { resetCookieConsent } from '../../components/shared/CookieBanner.jsx';
import { COMPANY } from '../../data/siteConfig.js';

export default function DatenschutzPage() {
  return (<><SEOHead title="Datenschutzerklärung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Datenschutzerklärung</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Stand: April 2026 · Entwurf – wird durch Rechtsanwalt finalisiert</p>

      <div style={{ lineHeight: 1.8 }}>

        <h2>1. Name und Kontakt des Verantwortlichen</h2>
        <p>
          Verantwortlicher für die Datenverarbeitung im Sinne von Art. 4 Nr. 7 DSGVO ist:<br/><br/>
          <strong>{COMPANY.name}</strong><br/>
          {COMPANY.address}<br/>
          {COMPANY.zip} {COMPANY.city}<br/>
          {COMPANY.country}<br/><br/>
          Geschäftsführung: {COMPANY.directors.join(', ')}<br/>
          E-Mail: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br/>
          Registereintrag: {COMPANY.register}
        </p>

        <h2>2. Datenschutzbeauftragter</h2>
        <p>
          Wir haben aktuell keinen Datenschutzbeauftragten benannt, da die gesetzlichen Schwellenwerte (§ 38 BDSG) derzeit nicht erreicht werden. Bei allen Fragen zum Datenschutz wenden Sie sich bitte an:
          <br/><br/>
          E-Mail: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>

        <h2>3. Zweck und Rechtsgrundlagen der Verarbeitung</h2>
        <p>Wir verarbeiten personenbezogene Daten nur zu folgenden Zwecken und auf folgenden Rechtsgrundlagen:</p>

        <h3>3.1 Bereitstellung der Website</h3>
        <p>Beim Aufruf unserer Website erheben wir technisch notwendige Daten (z.B. IP-Adresse, Browser-Typ, Zeitstempel) zur sicheren Auslieferung der Website. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit und Funktionalität).</p>

        <h3>3.2 Registrierung und Nutzerkonto</h3>
        <p>Bei Registrierung speichern wir Ihre E-Mail-Adresse zur Authentifizierung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>

        <h3>3.3 Antragsvorbereitung</h3>
        <p>Bei der Nutzung des Ausfüllservices verarbeiten wir die von Ihnen hochgeladenen Dokumente und daraus extrahierten Daten (z.B. Name, Adresse, Geburtsdatum, Einkommensangaben, Mietdaten, ggf. Rentenbescheid-Daten). Diese Daten verwenden wir ausschließlich zur Vorbereitung des Antragsdokuments, das Sie anschließend selbst bei der Behörde einreichen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>

        <h3>3.4 Zahlungsabwicklung</h3>
        <p>Zur Abwicklung von Zahlungen nutzen wir den Dienstleister Stripe. Stripe verarbeitet dabei Zahlungsdaten eigenverantwortlich. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h2>4. Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO)</h2>
        <p>Im aktuellen Leistungsangebot verarbeiten wir grundsätzlich <strong>keine besonderen Kategorien</strong> personenbezogener Daten im Sinne von Art. 9 DSGVO, insbesondere keine Gesundheitsdaten.</p>
        <p>Beim Antrag auf den Erwerbsminderungs-Rentenzuschlag kann der Rentenbescheid indirekte Hinweise auf gesundheitliche Umstände enthalten. Wir lesen aus diesem Dokument ausschließlich die für den Antrag notwendigen Daten aus (Höhe der Rente, Status der Erwerbsminderung) – keine Diagnosen oder weitergehenden Gesundheitsinformationen. Sollte sich dies im Zuge einer Weiterentwicklung unseres Services ändern, werden wir diese Datenschutzerklärung entsprechend anpassen und – sofern erforderlich – Ihre ausdrückliche Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO einholen.</p>

        <h2>5. Empfänger und Auftragsverarbeiter</h2>
        <p>Wir setzen folgende Dienstleister ein, mit denen Auftragsverarbeitungsverträge (AVV) nach Art. 28 DSGVO abgeschlossen wurden:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', marginTop: 8 }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 10px' }}>Dienst</th>
              <th style={{ textAlign: 'left', padding: '8px 10px' }}>Zweck</th>
              <th style={{ textAlign: 'left', padding: '8px 10px' }}>Sitz / Server</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '8px 10px' }}>Supabase</td>
              <td style={{ padding: '8px 10px' }}>Datenbank &amp; Dokumentenspeicher</td>
              <td style={{ padding: '8px 10px' }}>Server in Frankfurt, DE</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '8px 10px' }}>Clerk</td>
              <td style={{ padding: '8px 10px' }}>Authentifizierung</td>
              <td style={{ padding: '8px 10px' }}>USA (Standardvertragsklauseln)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '8px 10px' }}>Stripe</td>
              <td style={{ padding: '8px 10px' }}>Zahlungsabwicklung</td>
              <td style={{ padding: '8px 10px' }}>Irland / USA (SCC)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '8px 10px' }}>Resend</td>
              <td style={{ padding: '8px 10px' }}>Transaktions-E-Mails</td>
              <td style={{ padding: '8px 10px' }}>USA (SCC)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '8px 10px' }}>Vercel</td>
              <td style={{ padding: '8px 10px' }}>Hosting</td>
              <td style={{ padding: '8px 10px' }}>Edge-Server weltweit, Daten in EU</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 10px' }}>Anthropic</td>
              <td style={{ padding: '8px 10px' }}>Dokumentenanalyse (OCR &amp; Textverständnis)</td>
              <td style={{ padding: '8px 10px' }}>USA (SCC), Aufruf via Supabase Edge Function in Frankfurt</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>Bei Dienstleistern mit Sitz außerhalb der EU/des EWR erfolgt die Datenübermittlung auf Grundlage der EU-Standardvertragsklauseln (Standard Contractual Clauses, SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Weitere Informationen zu diesen Verträgen erhalten Sie auf Anfrage unter {COMPANY.email}.</p>
        <p>Eine Weitergabe Ihrer Daten zu Werbe- oder Profiling-Zwecken erfolgt nicht.</p>

        <h2>6. Speicherdauer</h2>
        <p>Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Technische Zugriffsdaten: Löschung nach 30 Tagen</li>
          <li>Antragsdaten: Speicherung bis zu 24 Monate nach Abschluss des Antragsvorgangs, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen</li>
          <li>Rechnungs- und Buchhaltungsdaten: 10 Jahre nach Ende des Geschäftsjahres (§ 147 AO, § 257 HGB)</li>
          <li>Nutzerkontodaten: Löschung auf Anfrage, spätestens 3 Jahre nach letzter Aktivität</li>
        </ul>

        <h2>7. Ihre Rechte als betroffene Person</h2>
        <p>Sie haben die folgenden Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>Auskunft</strong> (Art. 15 DSGVO): Sie können Auskunft über Ihre verarbeiteten Daten verlangen.</li>
          <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Bei unrichtigen Daten können Sie die Berichtigung fordern.</li>
          <li><strong>Löschung</strong> (Art. 17 DSGVO): Unter bestimmten Voraussetzungen können Sie die Löschung verlangen.</li>
          <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO): Sie können die Einschränkung der Verarbeitung verlangen.</li>
          <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Sie können Ihre Daten in einem strukturierten Format erhalten.</li>
          <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Sie können der Verarbeitung auf Grundlage berechtigter Interessen widersprechen.</li>
          <li><strong>Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Erteilte Einwilligungen können Sie jederzeit widerrufen.</li>
        </ul>
        <p>Zur Ausübung dieser Rechte genügt eine formlose E-Mail an <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>

        <h2>8. Beschwerderecht bei der Aufsichtsbehörde</h2>
        <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist:</p>
        <p>
          <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong><br/>
          Promenade 18, 91522 Ansbach<br/>
          Telefon: +49 (0) 981 180093-0<br/>
          E-Mail: poststelle@lda.bayern.de<br/>
          Web: <a href="https://www.lda.bayern.de" target="_blank" rel="noopener">www.lda.bayern.de</a>
        </p>

        <h2>9. Cookies und Analyse-Tools</h2>
        <p>Unsere Website verwendet nur technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind (z.B. zur Authentifizierung nach dem Login). Diese werden auf Grundlage von § 25 Abs. 2 TTDSG ohne Einwilligung gesetzt.</p>
        <p>Zur anonymen Reichweitenmessung nutzen wir aktuell kein Analyse-Tool. Sollte dies in Zukunft eingeführt werden (z.B. Plausible Analytics), informieren wir Sie rechtzeitig.</p>

        <h3>Cookie-Einstellungen ändern</h3>
        <p>Sie können Ihre Cookie-Einstellungen jederzeit anpassen:</p>
        <button onClick={resetCookieConsent} style={{ padding: '8px 20px', background: 'var(--ap-dark)', color: '#FFF', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Cookie-Einstellungen öffnen</button>

        <h2>10. Datensicherheit</h2>
        <p>Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen zufällige oder unberechtigte Veränderungen, Verlust oder unberechtigten Zugriff zu schützen. Dazu gehören insbesondere: Übertragung über TLS-verschlüsselte Verbindungen, Zugriffskontrollen mit Rollen- und Rechtekonzept sowie regelmäßige Sicherheits-Reviews.</p>

        <h2>11. Änderungen dieser Datenschutzerklärung</h2>
        <p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, beispielsweise wenn sich rechtliche Rahmenbedingungen oder technische Gegebenheiten ändern. Die jeweils aktuelle Version ist auf dieser Seite abrufbar.</p>

        <h2>12. Kontakt für Datenschutzanfragen</h2>
        <p>Bei Fragen oder Anliegen rund um den Datenschutz erreichen Sie uns unter:<br/>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>
      </div>
    </div></section>
  </>);
}
