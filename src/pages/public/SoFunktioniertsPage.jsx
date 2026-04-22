import { SEOHead, TrustBar, CTABlock, DisclaimerBanner, UmzugBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';

const steps = [
  { num: '01', title: 'Leistungscheck', desc: 'Beantworten Sie 5 einfache Fragen. In wenigen Minuten erfahren Sie, welche Leistungen für Sie in Frage kommen könnten – kostenlos und unverbindlich.', detail: 'Kein Login nötig. Keine Verpflichtung. Sie erhalten sofort eine unverbindliche Schätzung.' },
  { num: '02', title: 'Dokumente hochladen', desc: 'Fotografieren Sie Ihre Dokumente mit dem Smartphone – Rentenbescheid, Ausweis, Mietvertrag. Die Daten werden automatisch erkannt.', detail: 'Unterstützte Formate: Foto, PDF, Scan. Qualitätsprüfung in Echtzeit.' },
  { num: '03', title: 'Automatische Analyse', desc: 'Ihre Dokumente werden automatisch analysiert. Sie sehen eine unverbindliche Schätzung, welche Leistungen und Beträge in Frage kommen könnten.', detail: 'Unverbindliche Schätzung auf Basis allgemeiner Berechnungsregeln – keine Rechtsberatung.' },
  { num: '04', title: 'Antrag vorbereitet', desc: 'Sie bestätigen die Angaben und erhalten einen fertig ausgefüllten Antrag als PDF. Mit einer klaren Schritt-für-Schritt-Anleitung zum Ausdrucken oder direkten Einreichen bei der Behörde.', detail: 'Eigenhändige Unterschrift auf dem Antrag – oder digitale Einreichung über das Portal der Behörde, wenn verfügbar.' },
  { num: '05', title: 'Status verfolgen', desc: 'Per E-Mail erinnern wir Sie an die nächsten Schritte – bis zur Entscheidung der Behörde. Mit Plus-Paket bekommen Sie zusätzlich Nachfass-Erinnerungen und eine zweite Durchsicht Ihres Bescheids.', detail: 'Durchschnittliche Bearbeitungszeit durch die Behörde: 3–8 Wochen je nach Leistung.' },
];

export default function SoFunktioniertsPage() {
  return (
    <>
      <SEOHead title="So funktioniert's" description="In 5 Schritten zu Ihrem fertigen Antrag. Dokumente fotografieren, Anspruch wird automatisch geprüft, fertiger Antrag zum Einreichen." keywords={['AdminPilot Erfahrung', 'Behördenantrag vorbereiten']} />
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>So funktioniert AdminPilot</h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>Von der ersten Frage bis zum fertig ausgefüllten Antrag – wir begleiten Sie durch den gesamten Prozess.</p>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-5)', marginBottom: 'var(--space-6)', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: i === 2 ? 'var(--ap-gold)' : 'var(--ap-dark)', color: i === 2 ? 'var(--ap-dark)' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{step.num}</div>
              <div style={{ flex: 1, background: '#FFF', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-2)' }}>{step.desc}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>Was kostet das?</h2>
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>49 € Grundgebühr + 10 % Erfolgsgebühr</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>Der Leistungscheck ist kostenlos. Die Erfolgsgebühr fällt nur bei Bewilligung an. Optional: Plus-Paket für 29 €.</p>
            <Button size="small" to="/preise">Mehr zu den Preisen →</Button>
          </div>
        </div>
      </section>
      <TrustBar />
      <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}><UmzugBanner compact /></div></section>
      <div className="section"><div className="container"><CTABlock /></div></div>
    </>
  );
}
