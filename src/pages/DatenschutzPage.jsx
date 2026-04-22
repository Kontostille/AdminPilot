export default function DatenschutzPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <p className="legal-hero__eyebrow">Rechtliches</p>
          <h1>Datenschutzerklärung</h1>
          <p className="legal-hero__sub">
            Wie wir Ihre Daten schützen, verarbeiten und wie lange wir sie
            speichern &mdash; nach DSGVO und mit besonderer Sorgfalt für
            sensible Sozialdaten.
          </p>
          <p className="legal-hero__meta">
            Stand: April 2026 &middot; ALEVOR Mittelstandspartner GmbH
          </p>
        </div>
      </section>

      <section className="legal-content">
        <div className="legal-content__inner">
          <div className="legal-notice">
            <p>
              <strong>Hinweis:</strong> Dieser Text ist ein Entwurf und wird
              derzeit durch einen Datenschutzexperten geprüft. Die finale
              Fassung wird vor Start des kostenpflichtigen Angebots
              veröffentlicht.
            </p>
          </div>

          <h2>1. Verantwortlicher</h2>
          <address>
            ALEVOR Mittelstandspartner GmbH
            <br />
            Titurelstraße 10
            <br />
            81925 München
            <br />
            E-Mail:{' '}
            <a href="mailto:info@adminpilot.de">info@adminpilot.de</a>
            <br />
            Registergericht: Amtsgericht München, HRB 301846
            <br />
            Geschäftsführer: Andreas Levin, Linda Hoeckle, Julius
            Richter-Berghofer
          </address>

          <h2>2. Welche Daten wir verarbeiten</h2>
          <p>
            Um unsere Dienstleistung erbringen zu können, verarbeiten wir
            folgende Kategorien personenbezogener Daten:
          </p>
          <h3>Stammdaten</h3>
          <ul>
            <li>Name, Anschrift, Geburtsdatum</li>
            <li>E-Mail-Adresse, Telefonnummer</li>
            <li>Account-Daten (Passwort verschlüsselt über Clerk)</li>
          </ul>
          <h3>Sozialdaten und besondere Kategorien nach Art. 9 DSGVO</h3>
          <p>
            Abhängig von der geprüften Leistung verarbeiten wir besondere
            Kategorien personenbezogener Daten, insbesondere:
          </p>
          <ul>
            <li>
              Angaben zur Einkommens- und Vermögens&shy;situation
              (Rentenbescheide, Kontoauszüge, Einkommens&shy;nachweise)
            </li>
            <li>
              Angaben zum Wohnverhältnis (Mietverträge, Eigentumsnachweise)
            </li>
            <li>
              Gesundheitsdaten im Zusammenhang mit Pflegegeldanträgen
              (Pflegegutachten, ärztliche Diagnosen)
            </li>
            <li>
              Familiäre Situation, sofern für den Antrag relevant
            </li>
          </ul>
          <p>
            Diese Verarbeitung erfolgt auf Grundlage von Art. 9 Abs. 2
            lit.&nbsp;a DSGVO &mdash; Ihrer ausdrücklichen Einwilligung &mdash;
            und dient ausschließlich der Erstellung Ihres beantragten
            Sozialleistungsantrags.
          </p>
          <h3>Nutzungsdaten</h3>
          <ul>
            <li>IP-Adresse (anonymisiert nach 7 Tagen)</li>
            <li>Session-Cookies für die Anmeldung</li>
            <li>
              Technische Log-Daten (Browser-Typ, Aufrufzeit) ausschließlich
              für Sicherheit und Fehleranalyse
            </li>
          </ul>

          <h2>3. Rechtsgrundlagen der Verarbeitung</h2>
          <ul>
            <li>
              <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> &mdash;
              Vertragserfüllung (Bereitstellung der Ausfüllhilfe)
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. c DSGVO</strong> &mdash; Erfüllung
              rechtlicher Verpflichtungen (z.B. steuerliche
              Aufbewahrungspflichten für Rechnungen)
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> &mdash; Berechtigte
              Interessen (IT-Sicherheit, Missbrauchsprävention)
            </li>
            <li>
              <strong>Art. 9 Abs. 2 lit. a DSGVO</strong> &mdash;
              Ausdrückliche Einwilligung in die Verarbeitung besonderer
              Datenkategorien
            </li>
          </ul>

          <h2>4. Auftragsverarbeiter</h2>
          <p>
            Zur Erbringung unserer Dienstleistung greifen wir auf folgende
            Dienstleister zurück. Mit allen Dienstleistern haben wir
            Auftragsverarbeitungs&shy;verträge nach Art. 28 DSGVO
            abgeschlossen.
          </p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Dienstleister</th>
                <th>Zweck</th>
                <th>Serverstandort</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supabase Inc.</td>
                <td>Datenbank, Datei&shy;speicher, Backend-Funktionen</td>
                <td>Frankfurt am Main (DE)</td>
              </tr>
              <tr>
                <td>Clerk Inc.</td>
                <td>Authentifizierung (Login)</td>
                <td>USA (Standardvertragsklauseln)</td>
              </tr>
              <tr>
                <td>Stripe Payments Europe Ltd.</td>
                <td>Zahlungsabwicklung</td>
                <td>Irland</td>
              </tr>
              <tr>
                <td>Resend Inc.</td>
                <td>Versand transaktionaler E-Mails</td>
                <td>USA (Standardvertragsklauseln)</td>
              </tr>
              <tr>
                <td>Anthropic PBC</td>
                <td>
                  Textanalyse (OCR, Datenextraktion) &mdash; Zero Data
                  Retention vertraglich vereinbart
                </td>
                <td>USA (Standardvertragsklauseln)</td>
              </tr>
              <tr>
                <td>Vercel Inc.</td>
                <td>Hosting der Website</td>
                <td>Frankfurt am Main (DE)</td>
              </tr>
            </tbody>
          </table>

          <h2>5. Speicherdauer</h2>
          <p>
            Wir löschen Ihre personen&shy;bezogenen Daten grundsätzlich, sobald
            der Zweck der Verarbeitung entfällt. Im Einzelnen:
          </p>
          <ul>
            <li>
              <strong>Aktive Antragsdaten:</strong> Für die Dauer der
              Antragsbearbeitung durch die Behörde sowie bis 12 Monate nach
              Abschluss des Verfahrens (für eventuelle Rückfragen und
              Support).
            </li>
            <li>
              <strong>Rechnungsdaten:</strong> 10 Jahre aufgrund steuer- und
              handelsrechtlicher Aufbewahrungspflichten.
            </li>
            <li>
              <strong>Account-Daten:</strong> Solange Ihr Account besteht,
              maximal 24 Monate Inaktivität.
            </li>
            <li>
              <strong>Log-Daten mit IP:</strong> Anonymisierung nach
              7 Tagen.
            </li>
          </ul>
          <p>
            Nach Ablauf werden die Daten unwiderruflich gelöscht oder
            anonymisiert.
          </p>

          <h2>6. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul>
            <li>
              <strong>Auskunft</strong> über die zu Ihrer Person gespeicherten
              Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO), soweit
              keine gesetzlichen Aufbewahrungs&shy;pflichten entgegenstehen
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> in einem strukturierten,
              gängigen Format (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerruf</strong> erteilter Einwilligungen mit Wirkung
              für die Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
            <li>
              <strong>Beschwerde</strong> bei einer Datenschutz&shy;aufsichts&shy;behörde
              (Art. 77 DSGVO)
            </li>
          </ul>
          <p>
            Alle Rechte können Sie jederzeit über Ihr Dashboard oder per
            E-Mail an{' '}
            <a href="mailto:datenschutz@adminpilot.de">
              datenschutz@adminpilot.de
            </a>{' '}
            geltend machen.
          </p>

          <h2>7. Zuständige Aufsichtsbehörde</h2>
          <address>
            Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
            <br />
            Promenade 18
            <br />
            91522 Ansbach
            <br />
            <a
              href="https://www.lda.bayern.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.lda.bayern.de
            </a>
          </address>

          <h2>8. Datensicherheit</h2>
          <p>Wir setzen technische und organisatorische Maßnahmen ein:</p>
          <ul>
            <li>TLS-Verschlüsselung (SSL/HTTPS) für alle Datenübertragungen</li>
            <li>
              Row Level Security in der Datenbank &mdash; jeder Nutzer sieht
              ausschließlich eigene Daten
            </li>
            <li>
              Signierte Zugriffs-URLs mit kurzer Lebensdauer für
              hochgeladene Dokumente
            </li>
            <li>Regelmäßige Sicherheits-Audits und Penetrationstests</li>
            <li>Zugriffsbeschränkung auf das absolut erforderliche Personal</li>
          </ul>

          <h2>9. Keine automatisierte Entscheidungsfindung</h2>
          <p>
            Obwohl wir KI-basierte Systeme zur Unterstützung einsetzen,
            erfolgt <strong>keine automatisierte Entscheidungs&shy;findung im
            Sinne des Art. 22 DSGVO</strong>. Die Vorschläge unserer Systeme
            werden von Ihnen selbst geprüft und durch Ihre Unterschrift und
            Einreichung bestätigt.
          </p>

          <h2>10. Cookies</h2>
          <p>
            Wir verwenden ausschließlich technisch notwendige Cookies für
            die Anmeldung und Sitzungsverwaltung. Wir setzen keine
            Tracking- oder Analyse-Cookies ohne Ihre ausdrückliche
            Einwilligung ein.
          </p>

          <h2>11. Änderungen dieser Datenschutz&shy;erklärung</h2>
          <p>
            Wir passen diese Datenschutz&shy;erklärung an, wenn sich unsere
            Verarbeitungs&shy;praxis oder die Rechtslage ändert. Über
            wesentliche Änderungen informieren wir Sie rechtzeitig per
            E-Mail.
          </p>
        </div>
      </section>
    </main>
  );
}
