import { Link } from 'react-router-dom';

export default function GrundsicherungPage() {
  return (
    <main className="service-page">
      <section className="service-hero">
        <div className="service-hero__inner">
          <p className="service-hero__eyebrow">Leistung</p>
          <h1>Grundsicherung im Alter</h1>
          <p className="service-hero__sub">
            Für Menschen ab der Regelaltersgrenze, deren Rente und sonstiges
            Einkommen nicht zum Leben ausreicht.
          </p>
        </div>
      </section>

      <section className="service-intro">
        <div className="service-intro__inner">
          <div className="service-intro__text">
            <h2>Worum geht es?</h2>
            <p>
              Grundsicherung im Alter ist eine Sozialleistung für Menschen,
              die das gesetzliche Renteneintrittsalter erreicht haben und
              deren Einkommen unter dem Existenzminimum liegt. Die Leistung
              wird vom Sozialamt gezahlt.
            </p>
            <p>
              In Deutschland verzichten nach Berechnungen des DIW über
              600.000&nbsp;Haushalte auf ihre Ansprüche &mdash; oft aus
              Unkenntnis, Scham oder weil der Antragsprozess als zu komplex
              empfunden wird.
            </p>
            <p>
              AdminPilot hilft Ihnen, diesen Antragsprozess richtig zu
              durchlaufen &mdash; <strong>Sie selbst bleiben dabei
              Antragsteller.</strong>
            </p>
          </div>
          <aside className="service-intro__box">
            <h3>Wer hat möglicherweise Anspruch?</h3>
            <ul>
              <li>Personen ab Regelaltersgrenze (65 bis 67 Jahre)</li>
              <li>
                Oder Personen mit voller Erwerbsminderung auf Dauer, unabhängig
                vom Alter
              </li>
              <li>
                Mit gewöhnlichem Aufenthalt in Deutschland
              </li>
              <li>
                Deren Einkommen und Vermögen unter den gesetzlichen Grenzen
                liegen
              </li>
            </ul>
            <p className="service-intro__disclaimer">
              Dies ist eine vereinfachte Übersicht. Die konkrete
              Anspruchsprüfung erfolgt durch das Sozialamt.
            </p>
          </aside>
        </div>
      </section>

      {/* Schätzung / Rechner */}
      <section className="estimator">
        <div className="estimator__inner">
          <h2>Grobe Anspruchseinschätzung</h2>
          <p className="estimator__lead">
            Beantworten Sie kurz drei Fragen, um eine <strong>erste,
            unverbindliche Einschätzung</strong> zu erhalten, ob sich ein
            genauerer Antrag für Sie lohnen könnte. Für eine präzise Analyse
            laden Sie anschließend Ihre Unterlagen hoch.
          </p>

          <div className="estimator__grid">
            <div className="estimator__field">
              <label htmlFor="est-age">
                Ihr Alter
                <span className="estimator__hint">
                  Anspruch meist ab 65 Jahren
                </span>
              </label>
              <input id="est-age" type="number" min="55" max="110" placeholder="z.B. 67" />
            </div>
            <div className="estimator__field">
              <label htmlFor="est-income">
                Monatliches Nettoeinkommen
                <span className="estimator__hint">
                  Rente plus weitere Einkünfte, nach Abzug von Krankenkasse
                </span>
              </label>
              <input id="est-income" type="number" min="0" placeholder="z.B. 950" />
              <span className="estimator__unit">&euro;</span>
            </div>
            <div className="estimator__field">
              <label htmlFor="est-rent">
                Monatliche Wohnkosten
                <span className="estimator__hint">
                  Kaltmiete plus Nebenkosten und Heizung
                </span>
              </label>
              <input id="est-rent" type="number" min="0" placeholder="z.B. 650" />
              <span className="estimator__unit">&euro;</span>
            </div>
          </div>

          <button className="btn btn--primary btn--large">
            Unverbindliche Einschätzung anzeigen
          </button>

          <div className="estimator__legal">
            <p>
              <strong>Wichtiger Hinweis:</strong> Dies ist eine unverbindliche
              Orientierungsrechnung auf Basis vereinfachter Annahmen. Sie
              ersetzt weder eine individuelle Anspruchsprüfung noch eine
              Rechtsberatung. Der tatsächliche Anspruch hängt von Ihrer
              konkreten Lebenssituation, den geltenden Regelsätzen und der
              Prüfung durch das zuständige Sozialamt ab.
            </p>
          </div>
        </div>
      </section>

      {/* Was tun mit der Einschätzung */}
      <section className="service-next">
        <div className="service-next__inner">
          <h2>Wenn die Einschätzung positiv aussieht</h2>
          <p className="service-next__lead">
            Sie können bei uns den kompletten Antrag ausfüllen lassen. In
            drei Schritten zum fertigen Antrag:
          </p>
          <div className="service-next__steps">
            <div>
              <p className="service-next__num">1</p>
              <h3>Unterlagen hochladen</h3>
              <p>
                Rentenbescheid, Mietvertrag, Kontoauszüge. Fotos mit dem
                Smartphone genügen.
              </p>
            </div>
            <div>
              <p className="service-next__num">2</p>
              <h3>Antrag ausfüllen lassen</h3>
              <p>
                Wir erstellen den kompletten Antrag mit allen Anlagen.
                Sie bestätigen die Angaben.
              </p>
            </div>
            <div>
              <p className="service-next__num">3</p>
              <h3>Sie reichen ein</h3>
              <p>
                Sie unterschreiben und schicken alles ans zuständige Sozialamt.
                Mit Plus schicken wir Ihnen den fertigen Umschlag.
              </p>
            </div>
          </div>
          <Link to="/pruefen" className="btn btn--primary btn--large">
            Jetzt mit der Prüfung starten
          </Link>
        </div>
      </section>

      {/* Welche Behörde */}
      <section className="service-authority">
        <div className="service-authority__inner">
          <h2>An wen reichen Sie den Antrag ein?</h2>
          <p>
            Zuständig ist das <strong>Sozialamt Ihrer Stadt oder
            Gemeinde</strong>. Wir identifizieren die korrekte Behörde
            anhand Ihrer Postleitzahl und geben Ihnen die genaue Adresse
            mit dem fertigen Antrag.
          </p>
          <p>
            In vielen Städten können Sie den Antrag auch digital über die
            Verwaltungsportale (z.B.&nbsp;muenchen.de) einreichen. Wir zeigen
            Ihnen alle Wege, die für Ihr Amt verfügbar sind.
          </p>
        </div>
      </section>

      {/* FAQ-Teaser */}
      <section className="service-faq">
        <div className="service-faq__inner">
          <h2>Häufige Fragen zur Grundsicherung</h2>
          <div className="service-faq__items">
            <details>
              <summary>
                Schadet es meiner Rente, wenn ich Grundsicherung beantrage?
              </summary>
              <p>
                Nein. Die Grundsicherung ist eine ergänzende Leistung zu
                Ihrer Rente. Sie berührt weder die Rentenhöhe noch den
                Rentenanspruch.
              </p>
            </details>
            <details>
              <summary>
                Müssen meine Kinder für meine Grundsicherung aufkommen?
              </summary>
              <p>
                In der Regel nein. Nur wenn das jährliche Bruttoeinkommen
                eines Kindes über 100.000&nbsp;Euro liegt, kann das Sozialamt
                prüfen, ob Unterhaltsverpflichtungen bestehen. Andernfalls
                bleibt das Thema außen vor.
              </p>
            </details>
            <details>
              <summary>
                Werde ich auf Wohnungsgröße oder Auto geprüft?
              </summary>
              <p>
                Das Sozialamt prüft, ob Ihre Wohnung und Ihr Vermögen im
                Rahmen der gesetzlichen Grenzen liegen. Für ein altes Auto
                oder eine angemessene Wohnung ist das meist unproblematisch.
                Details klären wir im Antragsprozess.
              </p>
            </details>
            <details>
              <summary>
                Was, wenn der Antrag abgelehnt wird?
              </summary>
              <p>
                Sie erhalten einen Ablehnungsbescheid mit Begründung. Wir
                erklären Ihnen die häufigsten Gründe und stellen Ihnen
                Mustertexte zur Verfügung, falls Sie selbst Widerspruch
                einlegen oder Unterlagen nachreichen möchten. Wir selbst
                führen keine Widersprüche.
              </p>
            </details>
          </div>
          <Link to="/fragen" className="btn btn--ghost">
            Alle häufigen Fragen ansehen
          </Link>
        </div>
      </section>
    </main>
  );
}
