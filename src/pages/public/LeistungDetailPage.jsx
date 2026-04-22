import { SEOHead, TrustBar, DisclaimerBanner, CTABlock } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { getLeistungBySlug, LEISTUNGEN } from '../../data/leistungen.js';
import { Link } from '../../utils/router.jsx';
import { useState } from 'react';

export default function LeistungDetailPage({ params }) {
  const slug = params?.slug;
  const leistung = getLeistungBySlug(slug);
  const [faqOpen, setFaqOpen] = useState(null);

  if (!leistung) {
    return (
      <div className="section"><div className="container" style={{ textAlign: 'center' }}>
        <h1>Leistung nicht gefunden</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Diese Leistung existiert nicht oder ist noch nicht verfügbar.</p>
        <Button to="/leistungen" style={{ marginTop: 'var(--space-4)' }}>Alle Leistungen ansehen</Button>
      </div></div>
    );
  }

  const relatedLeistungen = LEISTUNGEN.filter(l => l.id !== leistung.id && l.funnel.some(f => leistung.funnel.includes(f))).slice(0, 3);

  return (
    <>
      <SEOHead title={leistung.seoTitle?.split('|')[0]?.trim() || leistung.name} description={leistung.seoDescription} keywords={leistung.keywords} />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--color-bg)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="container">
          <nav style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <Link to="/" style={{ color: 'var(--ap-sage)' }}>Start</Link> → <Link to="/leistungen" style={{ color: 'var(--ap-sage)' }}>Leistungen</Link> → <span style={{ color: 'var(--ap-dark)' }}>{leistung.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--ap-dark) 0%, #2D5A43 100%)', color: '#FFF', padding: 'var(--space-12) 0 var(--space-16)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
              <LeistungIcon id={leistung.id} size={48} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#FFF', margin: 0 }}>{leistung.name}</h1>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ap-mint)', margin: '4px 0 0' }}>{leistung.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-mint)' }}>Möglicher Anspruch</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>{leistung.estimateRange}</div>
            </div>
            <Button variant="primary" to="/leistungscheck">Kostenlos Anspruch prüfen →</Button>
          </div>
        </div>
      </section>

      {/* Beschreibung */}
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Was ist {leistung.name}?</h2>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.8, color: 'var(--color-text)' }}>{leistung.longDescription}</p>
        </div>
      </section>

      {/* Benötigte Dokumente */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Benötigte Dokumente</h2>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {leistung.requiredDocs.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-4)', background: '#FFF',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--ap-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>{doc}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
            AdminPilot erkennt Ihre Dokumente automatisch per Foto – einfach mit dem Smartphone abfotografieren.
          </p>
        </div>
      </section>

      {/* 3 Schritte */}
      <section className="section" style={{ background: '#FFF' }}>
        <div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>So beantragen Sie {leistung.name} mit AdminPilot</h2>
          {[`Fotografieren Sie die oben genannten Dokumente`, `Wir prüfen Ihren möglichen Anspruch auf ${leistung.name}`, `Sie erhalten den fertigen Antrag zum Ausdrucken und Einreichen – mit klarer Anleitung`].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: i === 2 ? 'var(--ap-gold)' : 'var(--ap-mint)', color: 'var(--ap-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', flexShrink: 0 }}>{i + 1}</div>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{s}</p>
            </div>
          ))}
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <Button variant="primary" size="large" to="/leistungscheck">Jetzt {leistung.name} kostenlos prüfen →</Button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <DisclaimerBanner variant="legal" />
      </div>

      {/* Verwandte Leistungen */}
      {relatedLeistungen.length > 0 && (
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>Weitere Leistungen für Sie</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              {relatedLeistungen.map(l => (
                <Link key={l.id} to={l.route} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textDecoration: 'none' }}>
                  <LeistungIcon id={l.id} size={32} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>{l.shortName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{l.estimateRange}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustBar />
      <div className="section"><div className="container"><CTABlock /></div></div>
    </>
  );
}
