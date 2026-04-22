import { Link } from 'react-router-dom';

export default function PflegegeldPage() {
  return (
    <main className="service-page">
      <section className="service-hero">
        <div className="service-hero__inner">
          <p className="service-hero__eyebrow">Leistung</p>
          <h1>Pflegegeld</h1>
          <p className="service-hero__sub">
            Für pflegebedürftige Menschen, die zu Hause von Angehörigen,
            Freunden oder Bekannten gepflegt werden.
          </p>
        </div>
      </section>

      <section className="service-intro">
        <div className="service-intro__inner">
          <div className="service-intro__text">
            <h2>Worum geht es?</h2>
            <p>
              Pflegegeld ist eine Leistung der gesetzlichen Pflege&shy;versicherung
              für Menschen mit anerkanntem Pflegegrad, die zu Hause gepflegt
              werden. Die Höhe richtet sich nach dem Pflegegrad (2 bis 5).
            </p>
            <p>
              Das Pflegegeld wird direkt an den Pflegebedürftigen gezahlt,
              der damit die pflegenden Angehörigen unterstützen kann.
              Voraussetzung ist die Anerkennung eines Pflegegrads durch den
              Medizinischen Dienst.
            </p>
          </div>
          <aside className="service-intro__box">
            <h3>Pflegegeld 2026 (Richtwerte)</h3>
            <ul>
              <li>Pflegegrad 2: ca. 347&nbsp;&euro; monatlich</li>
              <li>Pflegegrad 3: ca. 599&nbsp;&euro; monatlich</li>
              <li>Pflegegrad 4: ca. 800&nbsp;&euro; monatlich</li>
              <li>Pflegegrad 5: ca. 990&nbsp;&euro; monatlich</li>
            </ul>
            <p className="service-intro__disclaimer">
              Beispielbeträge ohne Gewähr. Die aktuellen Sätze werden
              regelmäßig angepasst und können je nach Situation variieren.
            </p>
          </aside>
        </div>
      </section>

      {/* Infoabschnitt: Ablauf */}
      <section className="service-explain">
        <div className="service-explain__inner">
          <h2>Der Ablauf im Überblick</h2>
          <ol className="service-explain__steps">
            <li>
              <h3>Pflegegrad beantragen</h3>
              <p>
                Wenn noch kein Pflegegrad anerkannt ist: Antrag bei der
                Pflegekasse stellen. Diese beauftragt den Medizinischen Dienst
                mit der Begutachtung.
              </p>
            </li>
            <li>
              <h3>Pflegegrad-Bescheid abwarten</h3>
              <p>
                Die Pflegekasse entscheidet auf Basis des Gutachtens und
                teilt den Pflegegrad mit.
              </p>
            </li>
            <li>
              <h3>Pflegegeld beantragen</h3>
              <p>
                Nach Anerkennung des Pflegegrads wird das Pflegegeld bei
                der Pflegekasse beantragt. Häufig geschieht das gemeinsam mit
                dem Grad-Antrag.
              </p>
            </li>
            <li>
              <h3>Regelmäßige Beratungsbesuche</h3>
              <p>
                Bei häuslicher Pflege mit Pflegegeld sind regelmäßige
                Beratungsbesuche durch einen ambulanten Pflegedienst
                gesetzlich vorgeschrieben.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Wie AdminPilot hilft */}
      <section className="service-next">
        <div className="service-next__inner">
          <h2>Wie AdminPilot Ihnen hilft</h2>
          <p className="service-next__lead">
            Wir unterstützen Sie beim Ausfüllen des Pflegegeldantrags bei
            Ihrer Pflegekasse. Die Begutachtung durch den Medizinischen Dienst
            findet separat statt &mdash; hier helfen wir mit Checklisten zur
            Vorbereitung.
          </p>
          <div className="service-next__steps">
            <div>
              <p className="service-next__num">1</p>
              <h3>Unterlagen hochladen</h3>
              <p>
                Versicherungskarte, bisherige ärztliche Diagnosen,
                Pflegegrad-Bescheid (falls vorhanden).
              </p>
            </div>
            <div>
              <p className="service-next__num">2</p>
              <h3>Antrag ausfüllen lassen</h3>
              <p>
                Wir erstellen den Pflegegeldantrag für Ihre Pflegekasse.
                Zusätzlich: Checkliste zur Vorbereitung auf den Gutachter-Termin.
              </p>
            </div>
            <div>
              <p className="service-next__num">3</p>
              <h3>Sie reichen ein</h3>
              <p>
                Sie unterschreiben und schicken an Ihre Pflegekasse.
                Mit Plus-Paket: frankierter Umschlag frei Haus.
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
            Zuständig ist die <strong>Pflegekasse Ihrer
            Krankenkasse</strong>. Meist ist die Pflegekasse Teil der
            gesetzlichen Krankenversicherung, bei der Sie versichert sind
            (AOK, Barmer, TK, DAK, IKK, Knappschaft, Ersatzkassen etc.). Wir
            identifizieren die korrekte Adresse anhand Ihrer
            Kranken&shy;versicherungs&shy;karte.
          </p>
        </div>
      </section>

      <section className="service-faq">
        <div className="service-faq__inner">
          <h2>Häufige Fragen zum Pflegegeld</h2>
          <div className="service-faq__items">
            <details>
              <summary>Wer bekommt das Pflegegeld ausgezahlt?</summary>
              <p>
                Das Pflegegeld geht direkt an die pflegebedürftige Person.
                Diese kann entscheiden, wie sie es verwendet &mdash; meist
                als Anerkennung für pflegende Angehörige.
              </p>
            </details>
            <details>
              <summary>
                Was ist der Unterschied zu Pflegesachleistungen?
              </summary>
              <p>
                Pflegegeld wird ausgezahlt, wenn Sie zu Hause von Angehörigen
                gepflegt werden. Pflegesachleistungen werden direkt mit einem
                ambulanten Pflegedienst abgerechnet, der die Pflege übernimmt.
                Beides kann auch kombiniert werden.
              </p>
            </details>
            <details>
              <summary>
                Können wir AdminPilot für ein pflegebedürftiges Elternteil
                nutzen?
              </summary>
              <p>
                Ja. Der Account läuft auf den Namen der pflegebedürftigen
                Person &mdash; denn sie bleibt die formale Antragstellerin.
                Angehörige unterstützen beim Ausfüllen, mit Einverständnis
                der betroffenen Person.
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
