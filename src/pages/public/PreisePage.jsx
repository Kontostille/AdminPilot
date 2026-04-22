import { useState } from 'react';
import { SEOHead, TrustBar, DisclaimerBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { PRICING } from '../../data/siteConfig.js';

export default function PreisePage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: 'Wann muss ich die 49 € bezahlen?', a: 'Die Grundgebühr wird fällig, wenn Sie sich entscheiden, mit AdminPilot einen Antrag vorbereiten zu lassen. Der Leistungscheck vorab ist komplett kostenlos.' },
    { q: 'Wie funktioniert die Erfolgsgebühr?', a: 'Nur wenn Ihr Antrag bewilligt wird, fällt eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an. Diese wird im ersten Jahr nach Bewilligung erhoben.' },
    { q: 'Was ist im Plus-Paket enthalten?', a: 'Das Plus-Paket (+29 €) enthält zusätzlich: einen vorbereiteten Versandumschlag mit Anschreiben, automatische Erinnerungen zum Nachfassen bei der Behörde und eine zweite Durchsicht Ihres Bescheids durch unser Team. Das Plus-Paket enthält keine Rechtsberatung.' },
    { q: 'Was, wenn mein Antrag abgelehnt wird?', a: 'Dann erstatten wir Ihnen die 49 € Grundgebühr vollständig zurück. Die Erfolgsgebühr entfällt, da sie nur bei Bewilligung berechnet wird. Die Plus-Gebühr (29 €) wird nicht erstattet, da die Plus-Leistungen unabhängig vom Ausgang erbracht werden.' },
    { q: 'Ein Beispiel: Was zahle ich bei 300 € Wohngeld?', a: 'Grundgebühr: 49 €. Bei Bewilligung: 10 % von 300 € = 30 €/Monat im ersten Jahr. Danach keine weiteren Kosten. Mit Plus-Paket zusätzlich 29 € einmalig.' },
    { q: 'Gibt es ein Abo oder versteckte Kosten?', a: 'Nein. Nach dem ersten Jahr fallen keine weiteren Gebühren an. Kein Abo, keine automatische Verlängerung.' },
  ];

  return (
    <>
      <SEOHead title="Preise" description="49 € Grundgebühr + 10 % Erfolgsgebühr, optional Plus-Paket +29 €. Nur bei Bewilligung. Kostenloser Leistungscheck." />

      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 920, textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Transparent & fair</p>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Sie zahlen nur bei Erfolg.</h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: 560, margin: '0 auto var(--space-10)' }}>
            Kleine Grundgebühr, faire Erfolgsbeteiligung. Optional mit zusätzlicher Einreichungshilfe. Der Leistungscheck ist immer kostenlos.
          </p>

          {/* Zwei Karten nebeneinander */}
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', maxWidth: 880, margin: '0 auto var(--space-6)' }}>

            {/* BASIS-Karte */}
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--ap-dark)', overflow: 'hidden', textAlign: 'left' }}>
              <div style={{ background: 'var(--ap-dark)', color: '#FFF', padding: 'var(--space-5) var(--space-6)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Basis-Service</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', marginTop: 4 }}>Der Klassiker</div>
              </div>
              <div style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>49 €</span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--ap-sage)' }}>einmalig</span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>Bei Antragsvorbereitung</p>

                <div style={{ padding: 'var(--space-4)', background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>+10 %</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Erfolgsgebühr</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    Nur bei bewilligter Leistung · Im ersten Jahr · Danach keine Kosten
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                  {[
                    'Kostenloser Leistungscheck',
                    'Automatische Analyse Ihrer Dokumente',
                    'Fertig ausgefüllter Antrag als PDF',
                    'Schritt-für-Schritt-Einreichungsanleitung',
                    'Status-Tracking per E-Mail',
                    'Geld-zurück-Garantie bei Ablehnung',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--ap-dark)', fontWeight: 700, fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Button variant="primary" fullWidth to="/leistungscheck" style={{ marginTop: 'var(--space-5)' }}>
                  Kostenlos Anspruch prüfen →
                </Button>
              </div>
            </div>

            {/* PLUS-Karte */}
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--ap-gold)', overflow: 'hidden', textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--ap-gold)', color: 'var(--ap-dark)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Neu</div>
              <div style={{ background: 'var(--ap-dark)', color: '#FFF', padding: 'var(--space-5) var(--space-6)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plus-Service</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', marginTop: 4 }}>Für zusätzliche Unterstützung</div>
              </div>
              <div style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>+29 €</span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--ap-sage)' }}>zusätzlich</span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>Zum Basis-Service dazubuchbar</p>

                <div style={{ padding: 'var(--space-4)', background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-5)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
                    <strong>Alles aus dem Basis-Service</strong> + zusätzliche Einreichungs­hilfe und Nachbetreuung.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                  {PRICING.plusFeatures.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--ap-gold)', fontWeight: 700, fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>★</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
                    Hinweis: Plus-Paket enthält keine Rechts- oder Sozialberatung.
                  </p>
                </div>

                <Button variant="secondary" fullWidth to="/leistungscheck" style={{ marginTop: 'var(--space-5)' }}>
                  Jetzt starten →
                </Button>
              </div>
            </div>

          </div>

          {/* Beispielrechnung */}
          <div style={{ maxWidth: 680, margin: 'var(--space-8) auto 0', padding: 'var(--space-5)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-3)' }}>
              Beispielrechnung: Wohngeld 300 €/Monat
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Basis</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                  Grundgebühr: <strong>49 €</strong><br/>
                  Erfolgsgebühr: <strong>30 €/Monat</strong> (nur 1. Jahr)<br/>
                  Ihre Leistung: <strong>300 €/Monat</strong><br/>
                  <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>
                    → 270 €/Monat netto im 1. Jahr, danach 300 €
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Basis + Plus</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                  Wie Basis, zusätzlich: <strong>+29 €</strong> einmalig<br/>
                  Gesamtkosten im 1. Jahr: <strong>438 €</strong><br/>
                  Leistung im 1. Jahr: <strong>3.600 €</strong><br/>
                  <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>
                    → 3.162 € netto im 1. Jahr, danach 300 €/Monat
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 600, margin: 'var(--space-6) auto 0' }}>
            <DisclaimerBanner variant="legal" />
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Fragen zu den Kosten</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)', textAlign: 'left' }}>
                  {faq.q}
                  <span style={{ fontSize: 18, color: 'var(--ap-sage)', transition: 'transform 0.15s', transform: faqOpen === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </button>
                {faqOpen === i && <div style={{ padding: '0 var(--space-5) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section"><div className="container" style={{ textAlign: 'center' }}>
        <Button variant="primary" size="large" to="/leistungscheck">Jetzt kostenlos prüfen →</Button>
      </div></div>
    </>
  );
}
