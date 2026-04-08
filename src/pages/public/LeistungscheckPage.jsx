import { useState } from 'react';
import { SEOHead, DisclaimerBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';

const QUESTIONS = [
  {
    id: 'situation',
    question: 'Wie ist Ihre aktuelle Lebenssituation?',
    options: [
      { value: 'rentner', label: 'Rentner/in', desc: 'Ich beziehe Rente' },
      { value: 'berufstaetig', label: 'Berufstätig', desc: 'Ich bin angestellt oder selbstständig' },
      { value: 'alleinerziehend', label: 'Alleinerziehend', desc: 'Ich erziehe mein(e) Kind(er) allein' },
      { value: 'elternzeit', label: 'In Elternzeit', desc: 'Ich bin gerade in Elternzeit' },
    ],
  },
  {
    id: 'haushalt',
    question: 'Wie viele Personen leben in Ihrem Haushalt?',
    options: [
      { value: '1', label: '1 Person' },
      { value: '2', label: '2 Personen' },
      { value: '3-4', label: '3–4 Personen' },
      { value: '5+', label: '5 oder mehr' },
    ],
  },
  {
    id: 'einkommen',
    question: 'Wie hoch ist Ihr monatliches Haushaltseinkommen (ungefähr)?',
    type: 'slider',
    min: 500,
    max: 5000,
    step: 100,
    default: 1800,
    unit: '€',
  },
  {
    id: 'miete',
    question: 'Wie hoch ist Ihre monatliche Miete (warm)?',
    type: 'slider',
    min: 200,
    max: 2000,
    step: 50,
    default: 700,
    unit: '€',
  },
  {
    id: 'kinder',
    question: 'Haben Sie Kinder unter 25 im Haushalt?',
    options: [
      { value: '0', label: 'Keine Kinder' },
      { value: '1', label: '1 Kind' },
      { value: '2', label: '2 Kinder' },
      { value: '3+', label: '3 oder mehr' },
    ],
  },
];

function estimateAmount(answers) {
  let total = 0;
  const breakdown = [];
  const sit = answers.situation;
  const income = answers.einkommen || 1800;
  const rent = answers.miete || 700;
  const kids = parseInt(answers.kinder) || 0;

  if (income < 3000 && rent > 400) {
    const wg = Math.round(Math.max(50, Math.min(370, (rent * 0.4) - (income * 0.05))));
    if (wg > 0) { total += wg; breakdown.push({ name: 'Wohngeld-Plus', id: 'wohngeld', amount: wg, confidence: 'hoch' }); }
  }
  if (kids > 0) {
    const kg = kids * 250;
    breakdown.push({ name: 'Kindergeld', id: 'kindergeld', amount: kg, confidence: 'hoch' });
    total += kg;
    if (income < 2500) {
      const kz = Math.round(kids * Math.min(292, Math.max(0, 292 - (income - 1000) * 0.1)));
      if (kz > 0) { total += kz; breakdown.push({ name: 'Kinderzuschlag', id: 'kinderzuschlag', amount: kz, confidence: 'mittel' }); }
    }
  }
  if (sit === 'elternzeit') {
    const eg = Math.round(Math.min(1800, income * 0.65));
    total += eg; breakdown.push({ name: 'Basiselterngeld', id: 'basiselterngeld', amount: eg, confidence: 'mittel' });
  }
  if (sit === 'rentner' && income < 2500) {
    const kv = Math.round(income * 0.0875);
    total += kv; breakdown.push({ name: 'KV-Zuschuss', id: 'kv-zuschuss', amount: kv, confidence: 'mittel' });
  }
  return { total, breakdown, yearly: total * 12 };
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-8)' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i <= current ? 'var(--ap-dark)' : 'var(--ap-mint)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

export default function LeistungscheckPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const handleAnswer = (value) => {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);
    if (isLast) {
      setTimeout(() => setShowResult(true), 300);
    } else {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const result = estimateAmount(answers);

  if (showResult) {
    return (
      <>
        <SEOHead title="Ihr Ergebnis – Leistungscheck" />
        <section style={{ background: 'linear-gradient(160deg, var(--ap-dark) 0%, #2D5A43 100%)', color: '#FFF', padding: 'var(--space-16) 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: 'var(--max-width-narrow)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', marginBottom: 'var(--space-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Basierend auf Ihren Angaben</p>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ap-mint)', marginBottom: 'var(--space-2)' }}>Sie könnten möglicherweise erhalten:</p>
            <div style={{ fontSize: 'var(--text-5xl)', fontWeight: 700, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)', margin: 'var(--space-4) 0' }}>
              ~{result.total} €
            </div>
            <p style={{ fontSize: 'var(--text-xl)', color: 'var(--ap-mint)' }}>pro Monat</p>
            <div style={{ width: 60, height: 2, background: 'var(--ap-gold)', margin: 'var(--space-6) auto', borderRadius: 1 }} />
            <p style={{ fontSize: 'var(--text-lg)', color: '#FFF', fontWeight: 600 }}>Das sind ~{result.yearly.toLocaleString('de-DE')} € pro Jahr</p>

            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginTop: 'var(--space-8)', textAlign: 'left' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', fontWeight: 600, marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aufschlüsselung</p>
              {result.breakdown.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: i < result.breakdown.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <LeistungIcon id={b.id} size={28} />
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#FFF' }}>{b.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: b.confidence === 'hoch' ? '#6EE7B7' : 'var(--ap-gold)' }}>Wahrscheinlichkeit: {b.confidence}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>~{b.amount} €</div>
                </div>
              ))}
            </div>

            <div style={{ margin: 'var(--space-6) auto', maxWidth: 500 }}>
              <DisclaimerBanner variant="legal" />
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
              <Button variant="primary" size="large" to="/login">Jetzt Antrag starten – nur 49 € →</Button>
              <button onClick={() => { setShowResult(false); setStep(0); setAnswers({}); }} style={{ background: 'none', border: 'none', color: 'var(--ap-sage)', fontSize: 'var(--text-sm)', cursor: 'pointer', textDecoration: 'underline' }}>Erneut prüfen</button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Kostenloser Leistungscheck" description="Finden Sie in 2 Minuten heraus, worauf Sie möglicherweise Anspruch haben." keywords={['Sozialleistungen Check', 'Anspruch prüfen']} />
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <ProgressBar current={step} total={QUESTIONS.length} />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Frage {step + 1} von {QUESTIONS.length}</p>
          <h2 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-2xl)' }}>{currentQ.question}</h2>

          {currentQ.type === 'slider' ? (
            <SliderQuestion q={currentQ} value={answers[currentQ.id] || currentQ.default} onChange={(v) => setAnswers({ ...answers, [currentQ.id]: v })} onNext={() => isLast ? setShowResult(true) : setStep(step + 1)} />
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {currentQ.options.map((opt) => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: 'var(--space-4) var(--space-5)',
                  background: answers[currentQ.id] === opt.value ? 'var(--ap-dark)' : 'var(--color-bg-card)',
                  color: answers[currentQ.id] === opt.value ? '#FFF' : 'var(--color-text)',
                  border: `2px solid ${answers[currentQ.id] === opt.value ? 'var(--ap-dark)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                  fontWeight: 600, textAlign: 'left', transition: 'all 0.15s',
                }}>
                  {opt.label}
                  {opt.desc && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{opt.desc}</span>}
                </button>
              ))}
            </div>
          )}

          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', color: 'var(--ap-sage)', fontSize: 'var(--text-sm)', cursor: 'pointer', marginTop: 'var(--space-4)', padding: 'var(--space-2) 0' }}>← Zurück</button>
          )}
        </div>
      </section>
    </>
  );
}

function SliderQuestion({ q, value, onChange, onNext }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>{value.toLocaleString('de-DE')} {q.unit}</span>
      </div>
      <input type="range" min={q.min} max={q.max} step={q.step} value={value} onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', height: 8, borderRadius: 4, appearance: 'none', background: 'var(--ap-mint)', outline: 'none', cursor: 'pointer' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
        <span>{q.min.toLocaleString('de-DE')} {q.unit}</span>
        <span>{q.max.toLocaleString('de-DE')} {q.unit}</span>
      </div>
      <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
        <Button onClick={onNext}>Weiter →</Button>
      </div>
    </div>
  );
}
