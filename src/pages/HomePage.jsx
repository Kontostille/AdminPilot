import { Link } from 'react-router-dom';

/**
 * AdminPilot Startseite – Ausfüllhilfe Plus
 *
 * Rechtliche Leitlinien (siehe docs/sprachliche-leitlinien.md):
 * - Niemals "Wir reichen ein" – immer "Sie reichen ein"
 * - Alle Anspruchsangaben als unverbindliche Schätzung kennzeichnen
 * - Keine Formulierung, die Rechtsberatung suggeriert
 */
export default function HomePage() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Ihr Begleiter durch die Bürokratie</p>
          <h1 className="hero__headline">
            Staatliche Leistungen, die Ihnen zustehen &mdash; richtig beantragt
            in 15&nbsp;Minuten.
          </h1>
          <p className="hero__sub">
            AdminPilot analysiert Ihre Unterlagen, füllt Ihre Anträge aus und
            begleitet Sie Schritt für Schritt bis zur Einreichung.
            <strong> Sie behalten die Kontrolle.</strong>
          </p>
          <div className="hero__cta-row">
            <Link to="/pruefen" className="btn btn--primary btn--large">
              Kostenlos prüfen, ob mir Leistungen zustehen
            </Link>
            <Link to="/wie-funktioniert-es" className="btn btn--ghost btn--large">
              So funktioniert AdminPilot
            </Link>
          </div>
          <ul className="hero__trust">
            <li>Sichere Daten in Deutschland</li>
            <li>Geld-zurück-Garantie</li>
            <li>Keine versteckten Kosten</li>
          </ul>
        </div>
      </section>

      {/* Drei Kern-Versprechen */}
      <section className="promises">
        <div className="promises__inner">
          <h2 className="promises__title">So unterstützen wir Sie</h2>
          <div className="promises__grid">
            <article className="promise-card">
              <div className="promise-card__num">01</div>
              <h3>Wir erkennen Ihre Ansprüche</h3>
              <p>
                Unsere KI-gestützte Analyse Ihrer Unterlagen zeigt Ihnen eine
                unverbindliche Schätzung, welche Leistungen Ihnen
                möglicherweise zustehen.
              </p>
            </article>
            <article className="promise-card">
              <div className="promise-card__num">02</div>
              <h3>Wir füllen Ihre Anträge aus</h3>
              <p>
                Kein Formulardschungel. Nur einfache Fragen in einfacher
                Sprache. Am Ende liegt Ihr kompletter Antrag bereit zum
                Unterschreiben.
              </p>
            </article>
            <article className="promise-card">
              <div className="promise-card__num">03</div>
              <h3>Wir zeigen Ihnen den Weg</h3>
              <p>
                Sie reichen den fertigen Antrag ein &mdash; per Post,
                persönlich oder mit unserem Plus-Paket im frankierten Umschlag.
                Wir begleiten Sie dabei.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Leistungen */}
      <section className="services">
        <div className="services__inner">
          <h2 className="services__title">Welche Leistungen prüfen wir?</h2>
          <p className="services__intro">
            Wir konzentrieren uns auf die drei Leistungen, die in Deutschland
            am häufigsten nicht beantragt werden, obwohl Anspruch besteht.
          </p>
          <div className="services__grid">
            <Link to="/leistungen/grundsicherung" className="service-tile">
              <h3>Grundsicherung im Alter</h3>
              <p>
                Für Menschen ab 65&nbsp;Jahren, deren Rente und sonstiges
                Einkommen nicht ausreicht.
              </p>
              <span className="service-tile__arrow" aria-hidden>&rarr;</span>
            </Link>
            <Link to="/leistungen/wohngeld" className="service-tile">
              <h3>Wohngeld</h3>
              <p>
                Zuschuss zur Miete oder zu den Belastungen von
                selbstgenutztem Wohneigentum.
              </p>
              <span className="service-tile__arrow" aria-hidden>&rarr;</span>
            </Link>
            <Link to="/leistungen/pflegegeld" className="service-tile">
              <h3>Pflegegeld</h3>
              <p>
                Für pflegebedürftige Menschen, die zu Hause von Angehörigen
                oder Bekannten gepflegt werden.
              </p>
              <span className="service-tile__arrow" aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* So funktioniert es */}
      <section className="flow">
        <div className="flow__inner">
          <h2 className="flow__title">In fünf Schritten zum fertigen Antrag</h2>
          <ol className="flow__list">
            <li>
              <span className="flow__num">1</span>
              <div>
                <h3>Unterlagen hochladen</h3>
                <p>
                  Fotografieren Sie Ihre Dokumente mit dem Smartphone oder
                  laden Sie PDFs hoch. Rentenbescheid, Mietvertrag, Kontoauszüge.
                </p>
              </div>
            </li>
            <li>
              <span className="flow__num">2</span>
              <div>
                <h3>Ansprüche prüfen lassen</h3>
                <p>
                  Unsere KI analysiert automatisch und zeigt eine unverbindliche
                  Schätzung, was Ihnen zustehen könnte. <em>Kostenlos und
                  unverbindlich.</em>
                </p>
              </div>
            </li>
            <li>
              <span className="flow__num">3</span>
              <div>
                <h3>Antrag ausfüllen lassen</h3>
                <p>
                  Erst jetzt zahlen Sie: 49&nbsp;Euro für den Basis-Service.
                  Wir füllen den kompletten Antrag für Sie aus.
                </p>
              </div>
            </li>
            <li>
              <span className="flow__num">4</span>
              <div>
                <h3>Antrag einreichen</h3>
                <p>
                  <strong>Sie reichen selbst ein.</strong> Wir liefern die
                  fertigen Dokumente, eine Anleitung und &mdash; im Plus-Paket
                  &mdash; einen bereits adressierten und frankierten Umschlag.
                </p>
              </div>
            </li>
            <li>
              <span className="flow__num">5</span>
              <div>
                <h3>Begleitung bis zur Entscheidung</h3>
                <p>
                  Wir erinnern Sie an Fristen und helfen mit Mustertexten,
                  falls die Behörde Rückfragen hat.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Preis-Teaser */}
      <section className="price-teaser">
        <div className="price-teaser__inner">
          <h2>Faire Preise, transparent</h2>
          <div className="price-teaser__grid">
            <div className="price-tile">
              <p className="price-tile__label">Basis</p>
              <p className="price-tile__price">
                49<span>&nbsp;&euro;</span>
              </p>
              <p className="price-tile__desc">
                Analyse, Anspruchsprüfung, fertig ausgefüllter Antrag,
                Einreichungs-Anleitung.
              </p>
            </div>
            <div className="price-tile price-tile--featured">
              <p className="price-tile__label">Plus</p>
              <p className="price-tile__price">
                78<span>&nbsp;&euro;</span>
              </p>
              <p className="price-tile__desc">
                Alles aus Basis <em>plus</em> frankierter Versand-Umschlag,
                Status-Erinnerungen, Hilfe bei Nachforderungen.
              </p>
              <p className="price-tile__badge">Empfohlen</p>
            </div>
          </div>
          <p className="price-teaser__value">
            <strong>Unter 1,5&nbsp;% der erwarteten Jahresleistung.</strong>{' '}
            Die Investition amortisiert sich meist im ersten Auszahlungsmonat.
          </p>
          <Link to="/preise" className="btn btn--primary">
            Alle Details zum Preismodell
          </Link>
        </div>
      </section>

      {/* Vertrauen */}
      <section className="trust">
        <div className="trust__inner">
          <h2>Warum Sie uns vertrauen können</h2>
          <div className="trust__grid">
            <div>
              <h3>Ihre Daten bleiben in Deutschland</h3>
              <p>
                Alle Unterlagen werden verschlüsselt auf Servern in Frankfurt
                gespeichert. Nach Abschluss des Antragsverfahrens werden
                Ihre Daten gelöscht.
              </p>
            </div>
            <div>
              <h3>Geld-zurück-Garantie</h3>
              <p>
                Wenn unsere Analyse keinen Anspruch erkennt, bekommen Sie den
                Basis-Preis vollständig zurück. Ohne Wenn und Aber.
              </p>
            </div>
            <div>
              <h3>Keine Rechtsberatung, keine leeren Versprechen</h3>
              <p>
                AdminPilot ist eine technische Ausfüllhilfe &mdash; vergleichbar
                mit einer Steuersoftware. Die endgültige Entscheidung trifft
                immer die zuständige Behörde.
              </p>
            </div>
            <div>
              <h3>Made in München</h3>
              <p>
                Betrieben von der ALEVOR Mittelstandspartner GmbH mit Sitz in
                München. Deutsche Ansprechpartner, deutsches Recht,
                deutscher Datenschutz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="final-cta__inner">
          <h2>Bereit, Ihre Unterlagen prüfen zu lassen?</h2>
          <p>
            Die Analyse ist kostenlos und unverbindlich. Erst wenn wir einen
            möglichen Anspruch erkennen und Sie den Antrag ausfüllen lassen,
            fallen Kosten an.
          </p>
          <Link to="/pruefen" className="btn btn--primary btn--large">
            Jetzt kostenlos prüfen
          </Link>
        </div>
      </section>
    </main>
  );
}
