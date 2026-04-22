import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  return (
    <main className="how-page">
      <section className="how-hero">
        <div className="how-hero__inner">
          <p className="how-hero__eyebrow">So funktioniert AdminPilot</p>
          <h1>Vom Foto Ihrer Unterlagen bis zum fertigen Antrag.</h1>
          <p className="how-hero__sub">
            Wir erklären Ihnen den kompletten Ablauf &mdash; damit Sie
            wissen, was Sie erwartet und was Sie selbst tun.
          </p>
        </div>
      </section>

      <section className="how-flow">
        <div className="how-flow__inner">
          <div className="how-step">
            <div className="how-step__badge">Schritt 1</div>
            <div className="how-step__body">
              <h2>Sie registrieren sich und laden Unterlagen hoch</h2>
              <p>
                Nach einer kurzen Anmeldung per E-Mail laden Sie Ihre
                Unterlagen hoch &mdash; ein Foto mit dem Smartphone genügt.
                Welche Dokumente wir brauchen, hängt von der geprüften
                Leistung ab.
              </p>
              <div className="how-step__meta">
                <div>
                  <h3>Dauer</h3>
                  <p>5 bis 10 Minuten</p>
                </div>
                <div>
                  <h3>Kosten</h3>
                  <p>Kostenlos</p>
                </div>
                <div>
                  <h3>Was Sie brauchen</h3>
                  <p>Smartphone oder PC mit Kamera, Ihre Unterlagen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-step">
            <div className="how-step__badge">Schritt 2</div>
            <div className="how-step__body">
              <h2>Wir analysieren und zeigen eine Schätzung</h2>
              <p>
                Unsere KI extrahiert die relevanten Daten aus Ihren
                Unterlagen und berechnet, welche Leistungen Ihnen
                möglicherweise zustehen. Sie sehen eine <strong>unverbindliche
                Schätzung</strong> &mdash; kostenlos und ohne Verpflichtung.
              </p>
              <div className="how-step__meta">
                <div>
                  <h3>Dauer</h3>
                  <p>Wenige Minuten, vollautomatisch</p>
                </div>
                <div>
                  <h3>Kosten</h3>
                  <p>Kostenlos</p>
                </div>
                <div>
                  <h3>Ergebnis</h3>
                  <p>Schätzung des möglichen Anspruchs, ohne Gewähr</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-step">
            <div className="how-step__badge">Schritt 3</div>
            <div className="how-step__body">
              <h2>Sie entscheiden: Basis oder Plus</h2>
              <p>
                Wenn Ihnen die Schätzung einen realistischen Anspruch
                erscheint, können Sie den kompletten Antrag ausfüllen
                lassen. Für 49&nbsp;Euro das Basis-Paket oder für
                78&nbsp;Euro Basis plus Plus-Paket mit frankiertem
                Versand-Umschlag und Begleitung.
              </p>
              <div className="how-step__meta">
                <div>
                  <h3>Basis</h3>
                  <p>49&nbsp;Euro einmalig</p>
                </div>
                <div>
                  <h3>Plus</h3>
                  <p>78&nbsp;Euro einmalig (49 + 29)</p>
                </div>
                <div>
                  <h3>Zahlungsart</h3>
                  <p>Sichere Zahlung über Stripe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-step">
            <div className="how-step__badge">Schritt 4</div>
            <div className="how-step__body">
              <h2>Wir erstellen Ihren kompletten Antrag</h2>
              <p>
                Sie beantworten einige ergänzende Fragen in einfacher
                Sprache. Wir erstellen daraus das offizielle Antragsformular
                für Ihre zuständige Behörde &mdash; vollständig ausgefüllt,
                mit passendem Anschreiben und einer Checkliste der
                beizulegenden Unterlagen.
              </p>
              <div className="how-step__meta">
                <div>
                  <h3>Dauer</h3>
                  <p>etwa 15 Minuten Ihrer Zeit</p>
                </div>
                <div>
                  <h3>Was Sie tun</h3>
                  <p>Ergänzende Fragen beantworten, Angaben bestätigen</p>
                </div>
                <div>
                  <h3>Was Sie bekommen</h3>
                  <p>Fertiger Antrag als PDF, Anleitung, Checkliste</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-step how-step--highlight">
            <div className="how-step__badge">Schritt 5</div>
            <div className="how-step__body">
              <h2>
                <strong>Sie reichen ein &mdash; wir begleiten Sie dabei</strong>
              </h2>
              <p>
                Das ist der entscheidende Schritt: <strong>Sie selbst bleiben
                Antragsteller</strong> und reichen den Antrag bei der Behörde
                ein. Wir bieten drei Wege:
              </p>
              <ol className="how-step__list">
                <li>
                  <strong>Selbst per Post oder persönlich.</strong> Sie drucken
                  aus, unterschreiben, stecken in einen Umschlag und bringen
                  ihn zur Post oder zur Behörde. Wir geben die genaue Anleitung.
                </li>
                <li>
                  <strong>Mit unserem Plus-Umschlag.</strong> Wir schicken
                  Ihnen einen bereits adressierten, frankierten Umschlag nach
                  Hause. Sie legen die unterschriebenen Dokumente hinein und
                  werfen ihn in den nächsten Briefkasten.
                </li>
                <li>
                  <strong>Digital über das Amtsportal.</strong> Wenn Ihr Amt
                  eine digitale Einreichung anbietet, zeigen wir Ihnen, wie
                  das geht. Auch hier klicken Sie selbst auf &quot;Senden&quot;.
                </li>
              </ol>
            </div>
          </div>

          <div className="how-step">
            <div className="how-step__badge">Schritt 6</div>
            <div className="how-step__body">
              <h2>Wir begleiten Sie bis zur Entscheidung</h2>
              <p>
                Nach der Einreichung helfen wir Ihnen bei der Nachverfolgung.
                Mit dem Plus-Paket erinnern wir Sie nach typischen
                Bearbeitungszeiten und liefern Mustertexte für
                Sachstandsanfragen. Bei Rückfragen der Behörde erklären wir
                Ihnen verständlich, was gemeint ist, und stellen passende
                Muster-Antworten bereit &mdash; <strong>aber Sie antworten
                selbst</strong>.
              </p>
              <div className="how-step__meta">
                <div>
                  <h3>Bearbeitungszeit Amt</h3>
                  <p>typisch 4 bis 8 Wochen</p>
                </div>
                <div>
                  <h3>Unsere Erinnerung</h3>
                  <p>Nach 14 und 42 Tagen (mit Plus)</p>
                </div>
                <div>
                  <h3>Unser Grenzfall</h3>
                  <p>Keine Widersprüche, keine Rechtsstreite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wichtige Abgrenzung */}
      <section className="how-boundary">
        <div className="how-boundary__inner">
          <h2>Was AdminPilot tut &mdash; und was nicht</h2>
          <div className="how-boundary__grid">
            <div className="how-boundary__col how-boundary__col--do">
              <h3>Das tun wir</h3>
              <ul>
                <li>KI-gestützte Analyse Ihrer Unterlagen</li>
                <li>
                  Unverbindliche Einschätzung möglicher Leistungsansprüche
                </li>
                <li>Vollständiges Ausfüllen des Antragsformulars</li>
                <li>Bereitstellung passender Anschreiben und Checklisten</li>
                <li>Schritt-für-Schritt-Anleitung zur Einreichung</li>
                <li>Frankierte Versand-Umschläge (Plus-Paket)</li>
                <li>Erinnerungen, Statusmeldungen, Mustertexte</li>
              </ul>
            </div>
            <div className="how-boundary__col how-boundary__col--dont">
              <h3>Das tun wir ausdrücklich nicht</h3>
              <ul>
                <li>Wir reichen Anträge nicht für Sie ein</li>
                <li>
                  Wir geben keine individuelle Rechtsberatung im Sinne des
                  RDG
                </li>
                <li>
                  Wir führen keine Widersprüche oder rechtlichen
                  Streitigkeiten mit Behörden
                </li>
                <li>
                  Wir vertreten Sie nicht gegenüber Ämtern oder Gerichten
                </li>
                <li>Wir garantieren keine Bewilligung</li>
              </ul>
            </div>
          </div>
          <p className="how-boundary__note">
            Für Rechtsberatung, Widersprüche oder komplexe Einzelfälle
            empfehlen wir Rentenberater oder anerkannte Sozialverbände wie
            den VdK oder SoVD.
          </p>
        </div>
      </section>

      <section className="cta-block">
        <div className="cta-block__inner">
          <h2>Bereit anzufangen?</h2>
          <p>
            Die Analyse ist kostenlos. Sie verpflichten sich zu nichts.
          </p>
          <Link to="/pruefen" className="btn btn--primary btn--large">
            Jetzt kostenlos prüfen
          </Link>
        </div>
      </section>
    </main>
  );
}
