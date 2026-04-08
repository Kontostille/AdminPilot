import { SEOHead, TrustBar, DisclaimerBanner, CTABlock } from '../../components/shared/index.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { LEISTUNGEN } from '../../data/leistungen.js';
import { Link } from '../../utils/router.jsx';
import { useState } from 'react';

export default function LeistungenPage() {
  const [filter, setFilter] = useState('alle');
  const filtered = filter === 'alle' ? LEISTUNGEN : LEISTUNGEN.filter(l => l.funnel.includes(filter));
  return (
    <>
      <SEOHead title="Alle Leistungen" description="Wohngeld, Kindergeld, KV-Zuschuss & mehr: Finden Sie die Leistung, die zu Ihrer Situation passt." keywords={['Sozialleistungen Übersicht']} />
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Alle Leistungen im Überblick</h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>Wählen Sie eine Leistung oder filtern Sie nach Ihrer Lebenssituation.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            {[['alle','Alle'],['senioren','Für Rentner'],['familien','Für Familien']].map(([id,label]) => (
              <button key={id} onClick={() => setFilter(id)} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: filter===id ? '2px solid var(--ap-dark)' : '2px solid var(--color-border)', background: filter===id ? 'var(--ap-dark)' : 'transparent', color: filter===id ? '#FFF' : 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{label}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', maxWidth: 'var(--max-width)' }}>
            {filtered.map(l => (
              <Link key={l.id} to={l.route} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-5)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textDecoration: 'none', transition: 'all var(--transition-base)' }}>
                <LeistungIcon id={l.id} size={48} />
                <div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)' }}>{l.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.5 }}>{l.description}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 400, marginTop: 'var(--space-2)' }}>{l.estimateRange}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 'var(--space-2)' }}>
                    {l.funnel.map(f => <span key={f} style={{ fontSize: 'var(--text-xs)', padding: '1px 8px', borderRadius: 'var(--radius-full)', background: 'var(--ap-mint)', color: 'var(--ap-dark)' }}>{f === 'senioren' ? 'Rentner' : 'Familien'}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ margin: 'var(--space-6) auto 0', maxWidth: 600 }}><DisclaimerBanner variant="legal" /></div>
        </div>
      </section>
      <TrustBar />
      <div className="section"><div className="container"><CTABlock headline="Nicht sicher, was passt? Machen Sie den kostenlosen Leistungscheck." /></div></div>
    </>
  );
}
