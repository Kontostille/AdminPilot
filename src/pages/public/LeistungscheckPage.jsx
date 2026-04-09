import { useState } from 'react';
import { SEOHead, DisclaimerBanner } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';

// Fragen – dynamisch je nach Situation
function getQuestions(answers) {
  const isRentner = answers.situation === 'rentner';
  const questions = [
    {
      id: 'situation',
      question: 'Wie ist Ihre aktuelle Lebenssituation?',
      options: [
        { value: 'rentner', label: 'Rentner/in', desc: 'Ich beziehe Alters- oder Erwerbsminderungsrente' },
        { value: 'berufstaetig', label: 'Berufstätig', desc: 'Angestellt, selbstständig oder in Teilzeit' },
        { value: 'alleinerziehend', label: 'Alleinerziehend', desc: 'Ich erziehe mein(e) Kind(er) allein' },
        { value: 'elternzeit', label: 'In Elternzeit', desc: 'Ich bin gerade in Elternzeit oder Mutterschutz' },
      ],
    },
    {
      id: 'haushalt',
      question: 'Wie viele Personen leben in Ihrem Haushalt?',
      options: [
        { value: '1', label: '1 Person', desc: 'Ich lebe allein' },
        { value: '2', label: '2 Personen', desc: 'Z.B. mit Partner/in' },
        { value: '3-4', label: '3–4 Personen', desc: 'Z.B. Familie mit Kindern' },
        { value: '5+', label: '5 oder mehr' },
      ],
    },
  ];

  if (isRentner) {
    questions.push({
      id: 'bruttorente',
      question: 'Wie hoch ist Ihre monatliche Bruttorente?',
      subtitle: 'Den Betrag finden Sie auf Ihrem Rentenbescheid (vor Abzügen).',
      type: 'slider',
      min: 200, max: 3000, step: 50, default: 1100, unit: '€',
    });
    questions.push({
      id: 'zusatzeinkommen',
      question: 'Haben Sie Zusatzeinkommen neben der Rente?',
      subtitle: 'Z.B. Minijob, Mieteinnahmen, Betriebsrente, private Vorsorge.',
      options: [
        { value: '0', label: 'Kein Zusatzeinkommen' },
        { value: '200', label: 'Bis 200 €/Monat', desc: 'Z.B. kleiner Minijob' },
        { value: '450', label: '200–450 €/Monat', desc: 'Z.B. Minijob oder Mieteinnahmen' },
        { value: '800', label: 'Über 450 €/Monat', desc: 'Z.B. Teilzeitjob oder Betriebsrente' },
      ],
    });
  } else {
    questions.push({
      id: 'bruttoeinkommen',
      question: 'Wie hoch ist das monatliche Bruttoeinkommen Ihres Haushalts?',
      subtitle: 'Alle Einkommen im Haushalt zusammen, vor Steuern und Abzügen.',
      type: 'slider',
      min: 500, max: 6000, step: 100, default: 2400, unit: '€',
    });
  }

  questions.push({
    id: 'miete',
    question: 'Wie hoch ist Ihre monatliche Warmmiete?',
    subtitle: 'Miete inklusive Nebenkosten und Heizung.',
    type: 'slider',
    min: 200, max: 2000, step: 50, default: 750, unit: '€',
  });

  questions.push({
    id: 'kinder',
    question: 'Haben Sie Kinder unter 25 Jahren im Haushalt?',
    options: [
      { value: '0', label: 'Keine Kinder' },
      { value: '1', label: '1 Kind' },
      { value: '2', label: '2 Kinder' },
      { value: '3+', label: '3 oder mehr Kinder' },
    ],
  });

  // KV-Frage nur für Rentner
  if (isRentner) {
    questions.push({
      id: 'krankenversicherung',
      question: 'Wie sind Sie krankenversichert?',
      options: [
        { value: 'gesetzlich_pflicht', label: 'Gesetzlich pflichtversichert', desc: 'KVdR – Krankenversicherung der Rentner' },
        { value: 'gesetzlich_freiwillig', label: 'Freiwillig gesetzlich versichert' },
        { value: 'privat', label: 'Privat versichert' },
      ],
    });
  }

  return questions;
}

function estimateAmount(answers) {
  let total = 0;
  const breakdown = [];
  const sit = answers.situation;
  const isRentner = sit === 'rentner';

  // Einkommen berechnen
  let totalIncome = 0;
  if (isRentner) {
    const bruttorente = answers.bruttorente || 1100;
    const zusatz = parseInt(answers.zusatzeinkommen) || 0;
    totalIncome = bruttorente + zusatz;
  } else {
    totalIncome = answers.bruttoeinkommen || 2400;
  }

  // Netto-Schätzung (Pauschalabzug ~30% für Berufstätige, ~15% für Rentner)
  const netIncome = isRentner ? totalIncome * 0.85 : totalIncome * 0.7;
  const rent = answers.miete || 750;
  const kids = answers.kinder === '3+' ? 3 : parseInt(answers.kinder) || 0;

  // Wohngeld (basiert auf Nettoeinkommen)
  if (netIncome < 2500 && rent > 300) {
    const householdSize = parseInt(answers.haushalt) || 1;
    const maxRent = { 1: 522, 2: 633, 3: 755, 4: 909, 5: 1041 };
    const cappedRent = Math.min(rent, maxRent[Math.min(householdSize, 5)] || 522);
    const factor = Math.max(0, 1 - (netIncome / (householdSize * 1200)));
    const wg = Math.round(Math.max(0, cappedRent * factor * 0.55));
    if (wg > 30) {
      total += wg;
      breakdown.push({ name: 'Wohngeld-Plus', id: 'wohngeld', amount: wg, confidence: 'hoch' });
    }
  }

  // Kindergeld
  if (kids > 0) {
    const kg = kids * 250;
    breakdown.push({ name: 'Kindergeld', id: 'kindergeld', amount: kg, confidence: 'hoch' });
    total += kg;

    // Kinderzuschlag (nur bei geringerem Einkommen)
    if (totalIncome < 3500 && !isRentner) {
      const kz = Math.round(kids * Math.max(0, 292 - Math.max(0, (totalIncome - 1800) * 0.08)));
      if (kz > 20) {
        total += kz;
        breakdown.push({ name: 'Kinderzuschlag', id: 'kinderzuschlag', amount: kz, confidence: 'mittel' });
      }
    }
  }

  // Elterngeld
  if (sit === 'elternzeit') {
    const eg = Math.round(Math.min(1800, Math.max(300, netIncome * 0.65)));
    total += eg;
    breakdown.push({ name: 'Basiselterngeld', id: 'basiselterngeld', amount: eg, confidence: 'mittel' });
  }

  // KV-Zuschuss (nur Rentner, nicht pflichtversichert)
  if (isRentner && answers.krankenversicherung && answers.krankenversicherung !== 'gesetzlich_pflicht') {
    const bruttorente = answers.bruttorente || 1100;
    const kv = Math.round(bruttorente * 0.0875);
    if (kv > 10) {
      total += kv;
      breakdown.push({ name: 'KV-Zuschuss', id: 'kv-zuschuss', amount: kv, confidence: 'hoch' });
    }
  }

  // Kindererziehungszeiten (Rentner mit Kindern)
  if (isRentner && kids > 0) {
    const kez = kids * 33 * 3; // ~33€ pro Entgeltpunkt, 3 Jahre pro Kind
    total += kez;
    breakdown.push({ name: 'Kindererziehungszeiten', id: 'kindererziehungszeiten', amount: kez, confidence: 'mittel' });
  }

  // Bildung & Teilhabe (Familien mit Kindern bei geringem Einkommen)
  if (kids > 0 && netIncome < 2000 && !isRentner) {
    const but = Math.round(195 / 12) + (kids * 15);
    total += but;
    breakdown.push({ name: 'Bildung & Teilhabe', id: 'bildung-teilhabe', amount: but, confidence: 'mittel' });
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

function SliderQuestion({ q, value, onChange, onNext }) {
  return (
    <div>
      {q.subtitle && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{q.subtitle}</p>}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>
          {value.toLocaleString('de-DE')} {q.unit}
        </span>
      </div>
      <input type="range" min={q.min} max={q.max} step={q.step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
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

export default function LeistungscheckPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = getQuestions(answers);
  const currentQ = questions[step];
  const isLast = step === questions.length - 1;

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
              ~{result.total.toLocaleString('de-DE')} €
            </div>
            <p style={{ fontSize: 'var(--text-xl)', color: 'var(--ap-mint)' }}>pro Monat</p>
            <div style={{ width: 60, height: 2, background: 'var(--ap-gold)', margin: 'var(--space-6) auto', borderRadius: 1 }} />
            <p style={{ fontSize: 'var(--text-lg)', color: '#FFF', fontWeight: 600 }}>Das sind ~{result.yearly.toLocaleString('de-DE')} € pro Jahr</p>

            {/* Aufschlüsselung */}
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
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', marginTop: 'var(--space-1)' }}>Geld zurück bei Ablehnung</p>
              <button onClick={() => { setShowResult(false); setStep(0); setAnswers({}); }} style={{ background: 'none', border: 'none', color: 'var(--ap-sage)', fontSize: 'var(--text-sm)', cursor: 'pointer', textDecoration: 'underline', marginTop: 'var(--space-2)' }}>Erneut prüfen</button>
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
          <ProgressBar current={step} total={questions.length} />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Frage {step + 1} von {questions.length} · Kostenlos & unverbindlich
          </p>
          <h2 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-2xl)' }}>{currentQ.question}</h2>
          {currentQ.subtitle && !currentQ.type && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{currentQ.subtitle}</p>
          )}

          {currentQ.type === 'slider' ? (
            <SliderQuestion
              q={currentQ}
              value={answers[currentQ.id] || currentQ.default}
              onChange={(v) => setAnswers({ ...answers, [currentQ.id]: v })}
              onNext={() => isLast ? setShowResult(true) : setStep(step + 1)}
            />
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
                  width: '100%',
                }}>
                  {opt.label}
                  {opt.desc && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{opt.desc}</span>}
                </button>
              ))}
            </div>
          )}

          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{
              background: 'none', border: 'none', color: 'var(--ap-sage)',
              fontSize: 'var(--text-sm)', cursor: 'pointer', marginTop: 'var(--space-4)',
              padding: 'var(--space-2) 0',
            }}>← Zurück</button>
          )}
        </div>
      </section>
    </>
  );
}
