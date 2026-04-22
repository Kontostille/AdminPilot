import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'Leistung & Umfang',
    items: [
      {
        q: 'Reichen Sie den Antrag für mich ein?',
        a: (
          <>
            <p>
              <strong>Nein.</strong> Sie reichen Ihren Antrag selbst ein.
              AdminPilot ist eine technische Ausfüllhilfe &mdash; wir
              analysieren Ihre Unterlagen, füllen den Antrag für Sie aus und
              geben Ihnen eine Schritt-für-Schritt-Anleitung zur Einreichung.
            </p>
            <p>
              Mit unserem <strong>Plus-Paket</strong> bekommen Sie zusätzlich
              einen adressierten und frankierten Umschlag nach Hause geschickt.
              Sie legen die unterschriebenen Dokumente hinein und werfen ihn
              in den nächsten Briefkasten. Auch hier handeln Sie selbst
              &mdash; wir übernehmen nur den Versandaufwand für Sie.
            </p>
          </>
        ),
      },
      {
        q: 'Ist das eine Rechtsberatung?',
        a: (
          <p>
            <strong>Nein.</strong> AdminPilot ist eine technische Ausfüllhilfe,
            vergleichbar mit einer Steuer-Software wie WISO oder Taxfix. Wir
            geben keine individuelle Rechtsberatung und erstellen keine
            verbindlichen Anspruchsgutachten. Für konkrete Rechtsfragen
            empfehlen wir Ihnen einen Rentenberater oder einen anerkannten
            Sozialverband wie den VdK oder SoVD.
          </p>
        ),
      },
      {
        q: 'Was passiert, wenn mein Antrag abgelehnt wird?',
        a: (
          <>
            <p>
              Wenn die Behörde Ihren Antrag ablehnt, erklären wir Ihnen
              verständlich die typischen Gründe dafür. Sie erhalten
              Mustertexte und Checklisten, mit denen Sie fehlende Unterlagen
              selbst nachreichen oder einen Widerspruch selbst formulieren
              können.
            </p>
            <p>
              <strong>Wichtig:</strong> Wir führen keine Widersprüche und
              keine rechtlichen Streitigkeiten mit Ämtern. Für diese Fälle
              empfehlen wir Rentenberater oder Sozialverbände.
            </p>
          </>
        ),
      },
      {
        q: 'Ist mein Anspruch garantiert, wenn AdminPilot ihn berechnet hat?',
        a: (
          <p>
            <strong>Nein.</strong> Alle Berechnungen von AdminPilot sind
            unverbindliche Schätzungen auf Basis der von Ihnen übermittelten
            Daten. Die endgültige Entscheidung über Ihren Anspruch trifft
            ausschließlich die zuständige Behörde nach Prüfung des konkreten
            Einzelfalls.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Preise & Erstattung',
    items: [
      {
        q: 'Wofür bekomme ich die 49 Euro zurück?',
        a: (
          <p>
            Wenn unsere Analyse nach Sichtung Ihrer Unterlagen keinen
            realistischen Anspruch auf eine der geprüften Leistungen erkennt,
            zahlen wir den Basis-Preis vollständig zurück. Eine Ablehnung
            durch die Behörde selbst ist jedoch kein Erstattungsgrund &mdash;
            weil die Entscheidung bei der Behörde liegt, nicht bei uns.
          </p>
        ),
      },
      {
        q: 'Wann kostet AdminPilot etwas?',
        a: (
          <p>
            Die Anspruchsanalyse ist kostenlos und unverbindlich. Kosten
            entstehen erst, wenn Sie uns beauftragen, den kompletten Antrag
            für Sie auszufüllen &mdash; 49 Euro für das Basis-Paket oder
            78 Euro für Basis plus Plus-Paket. Einmalig pro Antrag, keine
            versteckten Zusatzkosten.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Unterlagen & Ablauf',
    items: [
      {
        q: 'Welche Unterlagen brauche ich?',
        a: (
          <>
            <p>
              Das hängt von der Leistung ab. Für die Grundsicherung sind
              typischerweise relevant:
            </p>
            <ul>
              <li>Rentenbescheid</li>
              <li>Mietvertrag oder Wohnkostennachweise</li>
              <li>Kontoauszüge der letzten drei Monate</li>
              <li>Nachweise über weitere Einkünfte oder Vermögen</li>
            </ul>
            <p>
              Sie müssen die Unterlagen nicht alle auf einmal haben &mdash;
              wenn etwas fehlt, sagen wir es Ihnen konkret.
            </p>
          </>
        ),
      },
      {
        q: 'Wie lange dauert der Prozess?',
        a: (
          <p>
            Das Ausfüllen mit AdminPilot: etwa 15&nbsp;Minuten. Die
            anschließende Bearbeitung durch die Behörde dauert typischerweise
            vier bis acht Wochen, in manchen Fällen länger.
          </p>
        ),
      },
      {
        q: 'Kann ich AdminPilot für meine Eltern nutzen?',
        a: (
          <p>
            Ja, wenn Ihre Eltern damit einverstanden sind. Der Account wird
            auf deren Namen angelegt, denn Ihre Eltern bleiben die formalen
            Antragsteller. Sie helfen ihnen beim Ausfüllen. Bei Fragen zum
            Datenschutz für Angehörige schreiben Sie uns gern an{' '}
            <a href="mailto:info@adminpilot.de">info@adminpilot.de</a>.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Datenschutz',
    items: [
      {
        q: 'Sind meine Daten sicher?',
        a: (
          <p>
            Ja. Alle Unterlagen werden verschlüsselt auf Servern in Frankfurt
            gespeichert. Die Datenverarbeitung folgt der DSGVO und den
            besonderen Anforderungen für Sozialdaten nach Art.&nbsp;9 DSGVO.
            Nach Abschluss des Antragsverfahrens werden Ihre Daten
            automatisch gelöscht, spätestens nach 24&nbsp;Monaten.
          </p>
        ),
      },
      {
        q: 'Wer hat Zugriff auf meine Unterlagen?',
        a: (
          <p>
            Nur Sie und autorisierte Mitarbeiter von AdminPilot, und nur zu
            dem Zweck, Ihnen bei Ihrem Antrag zu helfen. Wir geben Ihre Daten
            nicht an Dritte weiter &mdash; außer Sie beauftragen uns
            ausdrücklich, zum Beispiel mit dem Versand des Plus-Umschlags
            an Sie.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Leistungen & Zielgruppe',
    items: [
      {
        q: 'Für welche Leistungen kann ich AdminPilot nutzen?',
        a: (
          <p>
            Derzeit Grundsicherung im Alter, Wohngeld und Pflegegeld.
            Weitere Leistungen für Familien und Berufstätige sind in
            Vorbereitung.
          </p>
        ),
      },
      {
        q: 'Gibt es AdminPilot auch für andere Sozialleistungen?',
        a: (
          <p>
            In der ersten Phase fokussieren wir uns auf Senioren-Leistungen,
            weil hier der Bedarf am größten und die Leistungen am seltensten
            beantragt werden. Eine Erweiterung auf weitere Bereiche ist
            geplant &mdash; tragen Sie sich gern in unseren Infobrief ein, um
            informiert zu werden.
          </p>
        ),
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-item__icon" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="faq-item__answer">{a}</div>}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="faq-page">
      <section className="faq-hero">
        <div className="faq-hero__inner">
          <p className="faq-hero__eyebrow">Häufige Fragen</p>
          <h1>Alles, was Sie über AdminPilot wissen sollten.</h1>
          <p className="faq-hero__sub">
            Hier finden Sie ehrliche Antworten auf die meistgestellten Fragen.
            Wenn etwas fehlt, schreiben Sie uns an{' '}
            <a href="mailto:info@adminpilot.de">info@adminpilot.de</a>.
          </p>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-content__inner">
          {FAQS.map((section) => (
            <div key={section.category} className="faq-section">
              <h2>{section.category}</h2>
              <div className="faq-section__items">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-help">
        <div className="faq-help__inner">
          <h2>Ihre Frage nicht dabei?</h2>
          <p>
            Wir helfen Ihnen gerne persönlich weiter. Schreiben Sie uns oder
            rufen Sie uns an &mdash; werktags zwischen 9 und 17&nbsp;Uhr.
          </p>
          <div className="faq-help__contact">
            <a href="mailto:info@adminpilot.de" className="btn btn--ghost">
              info@adminpilot.de
            </a>
            <Link to="/kontakt" className="btn btn--ghost">
              Zum Kontaktformular
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
