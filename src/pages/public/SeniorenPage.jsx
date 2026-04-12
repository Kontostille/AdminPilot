import { SEOHead, TrustBar, DisclaimerBanner, CTABlock, UmzugBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { getLeistungenByFunnel } from '../../data/leistungen.js';
import { Link } from '../../utils/router.jsx';
import { useState } from 'react';

export default function SeniorenPage() {
  const leistungen = getLeistungenByFunnel('senioren');
  return (
    <>
      <SEOHead title="Für Rentner & Senioren" description="KV-Zuschuss, Wohngeld, Kindererziehungszeiten – prüfen Sie, welche Leistungen Ihnen möglicherweise zustehen." keywords={['Grundsicherung Rentner', 'Wohngeld Rentner', 'KV-Zuschuss']} />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--ap-dark) 0%, #2D5A43 100%)', color: '#FFF', padding: 'var(--space-16) 0 var(--space-20)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Für Rentner & Senioren</p>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.15, marginBottom: 'var(--space-4)', color: '#FFF' }}>
            Bekommen Sie alles,<br />was Ihnen <span style={{ color: 'var(--ap-gold)' }}>zusteht</span>?
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ap-mint)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
            Über 625.000 Rentnerhaushalte verzichten auf Leistungen, die ihnen möglicherweise zustehen. Prüfen Sie jetzt kostenlos und unverbindlich.
          </p>
          <Button variant="primary" size="large" to="/leistungscheck">Jetzt kostenlos Anspruch prüfen →</Button>
        </div>
      </section>

      {/* Leistungen */}
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Diese Leistungen könnten für Sie relevant sein</h2>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {leistungen.map((l) => (
              <Link key={l.id} to={l.route} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-5)', background: 'var(--color-bg)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
                textDecoration: 'none', transition: 'all var(--transition-base)',
              }}>
                <LeistungIcon id={l.id} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)' }}>{l.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>{l.description}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 400, marginTop: 4 }}>{l.estimateRange}</div>
                </div>
                <span style={{ color: 'var(--ap-sage)', fontSize: 20 }}>→</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}><DisclaimerBanner variant="legal" /></div>
        </div>
      </section>

      {/* So geht's */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>So einfach geht's</h2>
          {['Fotografieren Sie Ihren Rentenbescheid mit dem Smartphone', 'Wir prüfen, welche Leistungen für Sie in Frage kommen könnten', 'Der Antrag wird für Sie erstellt und eingereicht'].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', marginBottom: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--ap-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', flexShrink: 0 }}>{i + 1}</div>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.6 }}>{s}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBar />

      {/* Testimonial */}
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', borderLeft: '4px solid var(--ap-gold)' }}>
            <p style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              „Mein Enkel hat mir AdminPilot gezeigt. Ich hätte nie gedacht, dass mir ein KV-Zuschuss zusteht. Jetzt spare ich über 200 € im Monat."
            </p>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>— Gerhard M., 78, Rentner</div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFF', paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <UmzugBanner />
        </div>
      </section>

      <div className="section"><div className="container"><CTABlock headline="Prüfen Sie jetzt kostenlos, was Ihnen möglicherweise zusteht." buttonText="Zum Leistungscheck" /></div></div>
    </>
  );
}
