import { SEOHead, TrustBar, DisclaimerBanner, CTABlock } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { LEISTUNGEN } from '../../data/leistungen.js';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { Link } from '../../utils/router.jsx';
import { useState } from 'react';

function HeroSection() {
  return (
    <section style={{ background: 'linear-gradient(160deg, var(--ap-dark) 0%, #2D5A43 100%)', color: '#FFF', padding: 'var(--space-16) 0 var(--space-20)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, opacity: 0.04, width: 400, height: 400 }}>
        <svg viewBox="0 0 56 56" fill="#FFF" width="100%" height="100%"><polygon points="28,2 33,23 52,28 33,33 28,54 23,33 4,28 23,23" /></svg>
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 640 }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-4)', fontWeight: 500 }}>Ihr Begleiter durch die Bürokratie</p>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.15, marginBottom: 'var(--space-4)', color: '#FFF' }}>
            Behördenanträge?<br /><span style={{ color: 'var(--ap-gold)' }}>Erledigen wir für Sie.</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ap-mint)', marginBottom: 'var(--space-8)', lineHeight: 1.6, maxWidth: 520 }}>
            Laden Sie Ihre Dokumente hoch – wir prüfen Ihren möglichen Anspruch und stellen den Antrag automatisch für Sie.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Button variant="primary" size="large" to="/senioren">Ich bin Rentner/in</Button>
            <Button variant="secondary" size="large" to="/familien" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.4)' }}>Ich habe eine Familie</Button>
            <style>{`@media (max-width: 480px) { .hero-buttons { flex-direction: column; } .hero-buttons a { width: 100%; text-align: center; } }`}</style>
          </div>
          <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--ap-sage)' }}>
            <Link to="/leistungscheck" style={{ color: 'var(--ap-mint)', textDecoration: 'underline' }}>Oder direkt zum kostenlosen Leistungscheck →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function LeistungswegweiserGrid() {
  const allLeistungen = LEISTUNGEN;
  return (
    <section className="section" style={{ background: '#FFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Worauf könnten Sie Anspruch haben?</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>Wählen Sie eine Leistung – wir zeigen Ihnen, was möglich ist.</p>
        </div>
        <div className="leistung-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', maxWidth: 900, margin: '0 auto' }}>
          <style>{`
            @media (max-width: 768px) { .leistung-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 400px) { .leistung-grid { grid-template-columns: 1fr !important; } }
          `}</style>
          {allLeistungen.map(l => (
            <Link key={l.id} to={l.route} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-5) var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textDecoration: 'none', textAlign: 'center', transition: 'all var(--transition-base)' }}>
              <LeistungIcon id={l.id} size={44} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)', marginTop: 'var(--space-2)' }}>{l.shortName}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{l.description}</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link to="/senioren" style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-dark)', fontWeight: 500 }}>Ich bin Rentner/in →</Link>
          <Link to="/familien" style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-dark)', fontWeight: 500 }}>Ich habe eine Familie →</Link>
          <Link to="/leistungscheck" style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 600 }}>Ich weiß nicht, was mir zusteht →</Link>
        </div>
        <div style={{ maxWidth: 600, margin: 'var(--space-6) auto 0' }}><DisclaimerBanner variant="legal" /></div>
      </div>
    </section>
  );
}

function StepByStep() {
  const icons = {
    camera: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    search: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    check: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  const steps = [
    { num: '01', icon: icons.camera, title: 'Dokumente fotografieren', desc: 'Rentenbescheid, Ausweis, Mietvertrag – einfach mit dem Smartphone abfotografieren.' },
    { num: '02', icon: icons.search, title: 'Analyse prüft Ihren Anspruch', desc: 'Unsere Analyse erkennt Ihre Daten und zeigt, welche Leistungen in Frage kommen könnten.' },
    { num: '03', icon: icons.check, title: 'Antrag wird gestellt', desc: 'Sie unterschreiben digital – wir füllen den Antrag aus und reichen ihn ein.' },
  ];
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>So einfach geht's</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>In 3 Schritten zu Ihrer Leistung – ohne Formulare, ohne Wartezeit.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--ap-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: 24 }}>{step.icon}</div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>SCHRITT {step.num}</span>
              <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-2) 0' }}>{step.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Button to="/leistungscheck">Kostenlos Anspruch prüfen →</Button>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>✓</span> Leistungscheck kostenlos
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>✓</span> Nur 49 € bei Antragstellung
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--ap-dark)', fontWeight: 600 }}>✓</span> Geld zurück bei Ablehnung
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    { name: 'Maria K.', age: 72, type: 'Rentnerin', leistung: 'Wohngeld', quote: 'Mein Enkel hat mir AdminPilot gezeigt. Ich hätte nie gedacht, dass mir 310 € Wohngeld pro Monat zustehen. Jetzt muss ich mir weniger Sorgen machen.' },
    { name: 'Thomas & Lisa S.', age: 34, type: 'Familie mit 2 Kindern', leistung: 'Kinderzuschlag', quote: 'Wir wussten gar nicht, dass uns Kinderzuschlag zusteht. AdminPilot hat das in 5 Minuten herausgefunden – jetzt bekommen wir 584 € mehr pro Monat.' },
    { name: 'Gerhard M.', age: 78, type: 'Rentner', leistung: 'KV-Zuschuss', quote: 'Den KV-Zuschuss hätte ich ohne AdminPilot nie beantragt. Jetzt spare ich 218 € im Monat bei meiner Krankenversicherung.' },
    { name: 'Sandra W.', age: 29, type: 'Alleinerziehend', leistung: 'Wohngeld + Kindergeld', quote: 'Als Alleinerziehende habe ich keine Zeit für Behördengänge. AdminPilot hat mir Wohngeld und Kinderzuschlag beantragt – zusammen 620 € im Monat.' },
    { name: 'Helga P.', age: 81, type: 'Rentnerin', leistung: 'Kindererziehungszeiten', quote: 'Ich habe drei Kinder großgezogen und wusste nicht, dass mir dafür zusätzlich 96 € Rente pro Monat zustehen. AdminPilot hat alles für mich erledigt.' },
  ];
  const [active, setActive] = useState(0);
  return (
    <section className="section" style={{ background: '#FFF' }}>
      <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Das sagen unsere Kunden</h2>
        <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', borderLeft: '4px solid var(--ap-gold)', position: 'relative' }}>
          <div style={{ fontSize: 48, color: 'var(--ap-mint)', position: 'absolute', top: 16, left: 24, fontFamily: 'serif', lineHeight: 1 }}>„</div>
          <p style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)' }}>{testimonials[active].quote}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingLeft: 'var(--space-4)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--ap-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{testimonials[active].name.charAt(0)}</div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>{testimonials[active].name}, {testimonials[active].age}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{testimonials[active].type} · {testimonials[active].leistung}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: i === active ? 'var(--ap-dark)' : 'var(--ap-mint)', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQPreview() {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    { q: 'Was kostet der Service?', a: 'Die Grundgebühr beträgt 49 €. Bei erfolgreicher Bewilligung fällt eine Servicegebühr von 10 % der bewilligten Leistung an (nur im 1. Jahr). Wird der Antrag abgelehnt, erstatten wir die 49 € vollständig zurück.' },
    { q: 'Sind meine Daten sicher?', a: 'Ja. DSGVO-konform auf Servern in Frankfurt. 256-Bit verschlüsselt. Wir verarbeiten keine Gesundheitsdaten.' },
    { q: 'Wie lange dauert es?', a: 'Leistungscheck: 2–5 Minuten. Antragstellung: ca. 10 Minuten. Behördenbearbeitung: 3–8 Wochen je nach Leistung.' },
  ];
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Häufige Fragen</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#FFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)', textAlign: 'left' }}>
                {faq.q}
                <span style={{ fontSize: 18, color: 'var(--ap-sage)', flexShrink: 0, marginLeft: 'var(--space-3)', transition: 'transform var(--transition-fast)', transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {openIdx === i && <div style={{ padding: '0 var(--space-5) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/faq" style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-sage)', fontWeight: 500 }}>Alle Fragen ansehen →</Link>
        </div>
      </div>
    </section>
  );
}

function UmzugshilfeTeaser() {
  return (
    <section className="section" style={{ background: '#FFF' }}>
      <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-8)',
          background: 'var(--ap-dark)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
          color: '#FFF', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Kostenloser Service</span>
            <h2 style={{ fontSize: 'var(--text-xl)', margin: 'var(--space-2) 0 var(--space-3)' }}>Umzug geplant?</h2>
            <p style={{ color: 'var(--ap-mint)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Unsere interaktive Umzugs-Checkliste führt Sie durch alle Behördengänge und Fristen – von der Kündigung bis zur Ummeldung. Kostenlos.
            </p>
            <Button variant="primary" size="small" to="/umzugshilfe">Zur Umzugshilfe →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 180 }}>
            {['23 Aufgaben', '5 Phasen', 'Fortschritt speichern'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--ap-mint)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ap-gold)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <SEOHead title="Behördenanträge einfach & automatisch stellen" description="Wohngeld, Kindergeld, KV-Zuschuss & mehr – automatisch beantragen. Dokumente hochladen, Anspruch automatisch prüfen." keywords={['Behördenantrag online', 'Sozialleistungen beantragen', 'Wohngeld Antrag']} />
      <HeroSection />
      <LeistungswegweiserGrid />
      <StepByStep />
      <TrustBar />
      <TestimonialSection />
      <UmzugshilfeTeaser />
      <FAQPreview />
      <div className="section"><div className="container"><CTABlock headline="Prüfen Sie jetzt kostenlos, worauf Sie möglicherweise Anspruch haben." buttonText="Zum kostenlosen Leistungscheck" /></div></div>
    </>
  );
}
