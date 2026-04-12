import { useState } from 'react';
import { SEOHead, UmzugBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { FAQ_DATA } from '../../data/siteConfig.js';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);
  const [activeCat, setActiveCat] = useState('Allgemein');
  const cats = FAQ_DATA.map(c => c.category);
  const items = FAQ_DATA.find(c => c.category === activeCat)?.items || [];
  return (
    <>
      <SEOHead title="Häufige Fragen" description="Antworten auf die wichtigsten Fragen zu AdminPilot – Kosten, Datenschutz, Ablauf." />
      <section className="section">
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Häufige Fragen</h1>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cats.map(c => (
              <button key={c} onClick={() => { setActiveCat(c); setOpenIdx(null); }} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: activeCat===c ? '2px solid var(--ap-dark)' : '2px solid var(--color-border)', background: activeCat===c ? 'var(--ap-dark)' : 'transparent', color: activeCat===c ? '#FFF' : 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {items.map((faq, i) => (
              <div key={i} style={{ background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <button onClick={() => setOpenIdx(openIdx===i?null:i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)', textAlign: 'left' }}>
                  {faq.q}
                  <span style={{ fontSize: 18, color: 'var(--ap-sage)', transition: 'transform 0.15s', transform: openIdx===i?'rotate(45deg)':'rotate(0)' }}>+</span>
                </button>
                {openIdx===i && <div style={{ padding: '0 var(--space-5) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Ihre Frage war nicht dabei?</p>
            <Button to="/kontakt" variant="secondary">Kontakt aufnehmen →</Button>
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <UmzugBanner compact />
          </div>
        </div>
      </section>
    </>
  );
}
