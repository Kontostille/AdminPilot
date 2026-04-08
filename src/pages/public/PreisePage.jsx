import { useState } from 'react';
import { SEOHead, TrustBar, DisclaimerBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { PRICING } from '../../data/siteConfig.js';

export default function PreisePage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: 'Wann muss ich die 49 € bezahlen?', a: 'Die Grundgebühr wird fällig, wenn Sie sich entscheiden, einen Antrag über AdminPilot stellen zu lassen. Der Leistungscheck vorab ist komplett kostenlos.' },
    { q: 'Wie funktioniert die Erfolgsgebühr?', a: 'Nur wenn Ihr Antrag bewilligt wird, fällt eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an. Diese wird im ersten Jahr nach Bewilligung erhoben.' },
    { q: 'Was, wenn mein Antrag abgelehnt wird?', a: 'Dann erstatten wir Ihnen die 49 € Grundgebühr vollständig zurück. Sie tragen keinerlei finanzielles Risiko.' },
    { q: 'Ein Beispiel: Was zahle ich bei 300 € Wohngeld?', a: 'Grundgebühr: 49 €. Bei Bewilligung: 10 % von 300 € = 30 €/Monat im ersten Jahr. Danach keine weiteren Kosten.' },
    { q: 'Gibt es ein Abo oder versteckte Kosten?', a: 'Nein. Nach dem ersten Jahr fallen keine weiteren Gebühren an. Kein Abo, keine automatische Verlängerung.' },
  ];
  return (
    <>
      <SEOHead title="Preise" description="49 € Grundgebühr + 10 % Erfolgsgebühr. Nur bei Bewilligung. Kostenloser Leistungscheck." />
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Transparent & fair</p>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Sie zahlen nur bei Erfolg.</h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto var(--space-10)' }}>Kleine Grundgebühr, faire Erfolgsbeteiligung. Der Leistungscheck ist immer kostenlos.</p>
          <div style={{ maxWidth: 480, margin: '0 auto', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--ap-dark)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--ap-dark)', color: '#FFF', padding: 'var(--space-5) var(--space-6)', textAlign: 'left' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', fontWeight: 500 }}>AdminPilot Preismodell</div>
            </div>
            <div style={{ padding: 'var(--space-8) var(--space-6)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>49 €</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ap-sage)' }}>Grundgebühr</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Einmalig bei Antragstellung</p>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>+10 %</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Erfolgsgebühr</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>Nur bei bewilligter Leistung · Im ersten Jahr · Danach keine Kosten</p>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                {['Kostenloser Leistungscheck', 'KI-Analyse Ihrer Dokumente', 'Vollständige Antragserstellung', 'Digitale Signatur & Einreichung', 'Status-Tracking per E-Mail', 'Geld-zurück-Garantie bei Ablehnung'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--ap-dark)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>Bei Ablehnung erhalten Sie die 49 € vollständig zurück.</p>
              </div>
              <Button variant="primary" fullWidth to="/leistungscheck" style={{ marginTop: 'var(--space-6)' }}>Kostenlos Anspruch prüfen →</Button>
            </div>
          </div>
          <div style={{ maxWidth: 480, margin: 'var(--space-8) auto', padding: 'var(--space-5)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-2)' }}>Beispielrechnung: Wohngeld 300 €/Monat</p>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              Grundgebühr: <strong>49 €</strong> (einmalig)<br/>
              Erfolgsgebühr: 10 % × 300 € = <strong>30 €/Monat</strong> (nur im 1. Jahr)<br/>
              Ihre Leistung: <strong>300 €/Monat</strong> (dauerhaft)<br/>
              <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>→ Sie erhalten 270 €/Monat netto im 1. Jahr, danach volle 300 €/Monat</span>
            </div>
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
