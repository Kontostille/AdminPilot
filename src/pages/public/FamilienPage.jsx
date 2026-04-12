import { SEOHead, TrustBar, DisclaimerBanner, CTABlock, UmzugBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { getLeistungenByFunnel } from '../../data/leistungen.js';
import { Link } from '../../utils/router.jsx';

export default function FamilienPage() {
  const leistungen = getLeistungenByFunnel('familien');
  return (
    <>
      <SEOHead title="Für Familien & Berufstätige" description="Kindergeld, Kinderzuschlag, Wohngeld & mehr – prüfen Sie in 5 Minuten, welche Leistungen Ihnen zustehen könnten." keywords={['Kindergeld beantragen', 'Kinderzuschlag', 'Wohngeld Familie']} />

      <section style={{ background: 'linear-gradient(160deg, var(--ap-dark) 0%, #2D5A43 100%)', color: '#FFF', padding: 'var(--space-16) 0 var(--space-20)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Für Familien & Berufstätige</p>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.15, marginBottom: 'var(--space-4)', color: '#FFF' }}>
            Kein Geld verschenken –<br /><span style={{ color: 'var(--ap-gold)' }}>in 5 Minuten prüfen.</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ap-mint)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
            Kindergeld, Kinderzuschlag, Wohngeld & mehr – automatisch beantragen statt stundenlang Formulare ausfüllen.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)', background: 'var(--ap-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--ap-dark)', fontWeight: 700 }}>5</span>
              Minuten – kostenlos und unverbindlich
            </span>
          </div>
          <Button variant="primary" size="large" to="/leistungscheck">Jetzt kostenlos Anspruch prüfen →</Button>
        </div>
      </section>

      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Leistungen für Ihre Familie</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {leistungen.map((l) => (
              <Link key={l.id} to={l.route} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: 'var(--space-6) var(--space-4)', background: 'var(--color-bg)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
                textDecoration: 'none', textAlign: 'center', transition: 'all var(--transition-base)',
              }}>
                <LeistungIcon id={l.id} size={56} />
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)', marginTop: 'var(--space-3)' }}>{l.shortName}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>{l.description}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 400, marginTop: 'var(--space-2)' }}>{l.estimateRange}</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}><DisclaimerBanner variant="legal" /></div>
        </div>
      </section>

      {/* Vergleich */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-8)' }}>Warum AdminPilot?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-6)', background: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ohne AdminPilot</div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ap-dark)' }}>3+ Std.</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Formulare suchen, ausfüllen, einreichen</div>
            </div>
            <div style={{ padding: 'var(--space-6)', background: 'var(--ap-dark)', borderRadius: 'var(--radius-lg)', color: '#FFF' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', marginBottom: 'var(--space-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mit AdminPilot</div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ap-gold)' }}>5 Min.</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)' }}>Dokumente hochladen, fertig</div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', borderLeft: '4px solid var(--ap-gold)' }}>
            <p style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              „Wir wussten gar nicht, dass uns Kinderzuschlag zusteht. AdminPilot hat das in 5 Minuten herausgefunden – jetzt bekommen wir jeden Monat 290 € mehr."
            </p>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>— Thomas & Lisa S., Familie mit 2 Kindern</div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFF', paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <UmzugBanner />
        </div>
      </section>

      <div className="section"><div className="container"><CTABlock headline="Prüfen Sie jetzt kostenlos, welche Leistungen Ihnen möglicherweise zustehen." /></div></div>
    </>
  );
}
