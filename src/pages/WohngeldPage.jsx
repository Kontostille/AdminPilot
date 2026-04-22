import { Link } from 'react-router-dom';

export default function WohngeldPage() {
  return (
    <main className="service-page">
      <section className="service-hero">
        <div className="service-hero__inner">
          <p className="service-hero__eyebrow">Leistung</p>
          <h1>Wohngeld</h1>
          <p className="service-hero__sub">
            Zuschuss zu Ihrer Miete oder zu den Belastungen von
            selbstgenutztem Wohneigentum &mdash; für Menschen mit mittlerem
            bis niedrigem Einkommen.
          </p>
        </div>
      </section>

      <section className="service-intro">
        <div className="service-intro__inner">
          <div className="service-intro__text">
            <h2>Worum geht es?</h2>
            <p>
              Wohngeld entlastet Haushalte mit geringem Einkommen bei den
              Wohnkosten. Im Unterschied zur Grundsicherung ist Wohngeld
              keine Grundsicherung des gesamten Lebensunterhalts, sondern
              ein gezielter Zuschuss zur Miete oder zum Eigentum.
            </p>
            <p>
              Seit der Wohngeld-Plus-Reform sind deutlich mehr Haushalte
              anspruchsberechtigt. Trotzdem wird Wohngeld von vielen
              Berechtigten nicht beantragt, oft aus Unkenntnis des eigenen
              Anspruchs.
            </p>
          </div>
          <aside className="service-intro__box">
            <h3>Zwei Varianten</h3>
            <ul>
              <li>
                <strong>Mietzuschuss</strong> &mdash; für Mieterinnen und
                Mieter
              </li>
              <li>
                <strong>Lastenzuschuss</strong> &mdash; für Eigentümerinnen
                und Eigentümer selbstgenutzten Wohnraums
              </li>
            </ul>
            <p className="service-intro__disclaimer">
              Die tatsächliche Anspruchsprüfung erfolgt durch die
              Wohngeldstelle Ihrer Stadt.
            </p>
          </aside>
        </div>
      </section>

      {/* Schätzung / Rechner */}
      <section className="estimator">
        <div className="estimator__inner">
          <h2>Grobe Anspruchseinschätzung</h2>
          <p className="estimator__lead">
            Eine <strong>unverbindliche Orientierung</strong>, ob sich ein
            Wohngeldantrag für Sie lohnen könnte.
          </p>

          <div className="estimator__grid">
            <div className="estimator__field">
              <label htmlFor="est-household">
                Haushaltsgröße
                <span className="estimator__hint">
                  Anzahl Personen im Haushalt
                </span>
              </label>
              <input
                id="est-household"
                type="number"
                min="1"
                max="20"
                placeholder="z.B. 2"
              />
            </div>
            <div className="estimator__field">
              <label htmlFor="est-income-w">
                Monatliches Bruttoeinkommen Haushalt
                <span className="estimator__hint">
                  Alle Einkünfte aller Haushaltsmitglieder
                </span>
              </label>
              <input
                id="est-income-w"
                type="number"
                min="0"
                placeholder="z.B. 1800"
              />
              <span className="estimator__unit">&euro;</span>
            </div>
            <div className="estimator__field">
              <label htmlFor="est-rent-w">
                Warmmiete oder Wohnkosten
                <span className="estimator__hint">
                  Inklusive Nebenkosten und Heizung
                </span>
              </label>
              <input
                id="est-rent-w"
                type="number"
                min="0"
                placeholder="z.B. 850"
              />
              <span className="estimator__unit">&euro;</span>
            </div>
          </div>

          <button className="btn btn--primary btn--large">
            Unverbindliche Einschätzung anzeigen
          </button>

          <div className="estimator__legal">
            <p>
              <strong>Wichtiger Hinweis:</strong> Unverbindliche
              Orientierungsrechnung. Die tatsächliche Höhe des Wohngelds
              hängt von Mietstufe der Stadt, genauen Einkommenszusammen&shy;setzung
              und Prüfung durch die Wohngeldstelle ab.
            </p>
          </div>
        </div>
      </section>

      <section className="service-next">
        <div className="service-next__inner">
          <h2>In drei Schritten zum Wohngeldantrag</h2>
          <div className="service-next__steps">
            <div>
              <p className="service-next__num">1</p>
              <h3>Unterlagen hochladen</h3>
              <p>
                Einkommensnachweise aller Haushaltsmitglieder, Mietvertrag
                oder Nachweise zum Wohneigentum.
              </p>
            </div>
            <div>
              <p className="service-next__num">2</p>
              <h3>Antrag ausfüllen lassen</h3>
              <p>
                Wir erstellen den Wohngeldantrag mit allen Anlagen für Ihre
                Wohngeldstelle.
              </p>
            </div>
            <div>
              <p className="service-next__num">3</p>
              <h3>Sie reichen ein</h3>
              <p>
                Sie unterschreiben und schicken ab. Mit Plus liefern wir den
                frankierten Umschlag mit.
              </p>
            </div>
          </div>
          <Link to="/pruefen" className="btn btn--primary btn--large">
            Prüfung starten
          </Link>
        </div>
      </section>

      <section className="service-authority">
        <div className="service-authority__inner">
          <h2>An wen reichen Sie den Antrag ein?</h2>
          <p>
            Zuständig ist die <strong>Wohngeldstelle Ihrer Stadt oder
            Gemeinde</strong>. In größeren Städten sind das die örtlichen
            Ämter für Wohnen, in kleineren Gemeinden oft das Rathaus. Wir
            finden anhand Ihrer Postleitzahl die korrekte Stelle.
          </p>
        </div>
      </section>
    </main>
  );
}
