import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero__inner">
          <p className="pricing-hero__eyebrow">Preise</p>
          <h1>Transparent und fair &mdash; kein Kleingedrucktes.</h1>
          <p className="pricing-hero__sub">
            Zwei Pakete, klare Leistungen. Die unverbindliche Analyse ist
            immer kostenlos.
          </p>
        </div>
      </section>

      <section className="pricing-tiers">
        <div className="pricing-tiers__inner">
          {/* Free Tier */}
          <article className="tier tier--free">
            <header>
              <p className="tier__label">Kostenlos</p>
              <p className="tier__price">0<span>&nbsp;&euro;</span></p>
              <p className="tier__sub">Unverbindliche Analyse</p>
            </header>
            <ul className="tier__features">
              <li>Upload Ihrer Unterlagen</li>
              <li>KI-gestützte Anspruchsanalyse</li>
              <li>Unverbindliche Schätzung möglicher Leistungen</li>
              <li>Übersicht der zuständigen Behörde</li>
            </ul>
            <p className="tier__note">
              Keine Registrierung notwendig für die Analyse. Bei Interesse
              können Sie im nächsten Schritt einen Antrag ausfüllen lassen.
            </p>
            <Link to="/pruefen" className="btn btn--ghost">
              Analyse starten
            </Link>
          </article>

          {/* Basis */}
          <article className="tier tier--basis">
            <header>
              <p className="tier__label">Basis</p>
              <p className="tier__price">49<span>&nbsp;&euro;</span></p>
              <p className="tier__sub">Einmalig, pro Antrag</p>
            </header>
            <ul className="tier__features">
              <li>Alles aus der kostenlosen Analyse</li>
              <li>Kompletter Antrag fertig ausgefüllt</li>
              <li>Dokumenten-Paket als PDF zum Ausdrucken</li>
              <li>Persönliche Einreichungs-Anleitung</li>
              <li>Checkliste der beizulegenden Unterlagen</li>
              <li>
                <strong>Geld-zurück-Garantie</strong> &mdash; wenn kein
                Anspruch erkennbar ist
              </li>
            </ul>
            <p className="tier__note">
              Sie drucken die Dokumente aus, unterschreiben sie und reichen
              selbst bei der Behörde ein.
            </p>
            <Link to="/pruefen" className="btn btn--primary">
              Basis wählen
            </Link>
          </article>

          {/* Plus */}
          <article className="tier tier--plus">
            <div className="tier__badge">Empfohlen</div>
            <header>
              <p className="tier__label">Plus</p>
              <p className="tier__price">78<span>&nbsp;&euro;</span></p>
              <p className="tier__sub">Einmalig, pro Antrag</p>
            </header>
            <ul className="tier__features">
              <li><strong>Alles aus dem Basis-Paket</strong></li>
              <li>
                Adressierter und frankierter Versand-Umschlag kommt zu Ihnen
                nach Hause
              </li>
              <li>
                Status-Erinnerungen per E-Mail über 6 Monate
                (Eingangsbestätigung, Bearbeitungszeit)
              </li>
              <li>
                Musteranschreiben für Sachstandsanfragen, falls die Behörde
                nicht antwortet
              </li>
              <li>
                Unterstützung bei Nachforderungen: Checklisten und
                Mustertexte, die Sie selbst verwenden können
              </li>
              <li>Telefon-Support (werktags 9&ndash;17 Uhr)</li>
            </ul>
            <p className="tier__note">
              Besonders sinnvoll, wenn Sie oder Ihre Angehörigen den
              Behörden-Alltag nicht allein bewältigen möchten.
            </p>
            <Link to="/pruefen" className="btn btn--primary">
              Plus wählen
            </Link>
          </article>
        </div>
      </section>

      {/* Value-Vergleich */}
      <section className="value">
        <div className="value__inner">
          <h2>Warum das ein fairer Preis ist</h2>
          <div className="value__comparison">
            <div className="value__card">
              <p className="value__label">
                Durchschnittliche Grundsicherung pro Monat
              </p>
              <p className="value__figure">ca. 500&nbsp;&euro;</p>
              <p className="value__desc">
                Je nach Wohnort, Miete und persönlicher Situation.
                Unverbindlicher Durchschnittswert.
              </p>
            </div>
            <div className="value__card">
              <p className="value__label">Pro Jahr</p>
              <p className="value__figure">ca. 6.000&nbsp;&euro;</p>
              <p className="value__desc">
                Die Investition in AdminPilot Plus liegt bei unter
                1,5&nbsp;Prozent der erwarteten Jahresleistung.
              </p>
            </div>
            <div className="value__card">
              <p className="value__label">Amortisation</p>
              <p className="value__figure">ca. 1 Woche</p>
              <p className="value__desc">
                Im Durchschnitt hat sich AdminPilot Plus schon im ersten
                Auszahlungsmonat gelohnt.
              </p>
            </div>
          </div>
          <p className="value__disclaimer">
            Alle Werte sind Durchschnittswerte und keine Zusagen. Ihr
            tatsächlicher Anspruch hängt von Ihrer individuellen Situation ab.
          </p>
        </div>
      </section>

      {/* Geld-zurück-Garantie */}
      <section className="guarantee">
        <div className="guarantee__inner">
          <h2>Unsere Geld-zurück-Garantie</h2>
          <div className="guarantee__grid">
            <div>
              <h3>Wann bekommen Sie den Basis-Preis zurück?</h3>
              <p>
                Wenn unsere Analyse nach Sichtung aller von Ihnen eingereichten
                Unterlagen keinen realistischen Anspruch auf eine der geprüften
                Leistungen erkennt. In diesem Fall erstatten wir die
                49&nbsp;Euro vollständig.
              </p>
            </div>
            <div>
              <h3>Was gilt für das Plus-Paket?</h3>
              <p>
                Die 29&nbsp;Euro für das Plus-Paket erstatten wir anteilig,
                wenn Sie innerhalb von 14&nbsp;Tagen nach Erhalt des
                Versand-Umschlags reklamieren.
              </p>
            </div>
            <div>
              <h3>Was gilt nicht als Erstattungsgrund?</h3>
              <p>
                Eine Ablehnung durch die Behörde ist kein Erstattungsgrund.
                Die Entscheidung liegt bei der Behörde, nicht bei uns. Wir
                garantieren die Qualität der Ausfüllhilfe, nicht das Ergebnis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-Verweis */}
      <section className="cta-block">
        <div className="cta-block__inner">
          <h2>Noch Fragen?</h2>
          <p>
            In unseren häufig gestellten Fragen finden Sie Antworten zu
            Datenschutz, rechtlicher Einordnung und typischen Fällen.
          </p>
          <Link to="/fragen" className="btn btn--ghost">
            Häufige Fragen ansehen
          </Link>
        </div>
      </section>
    </main>
  );
}
