import AppIcon from "../../components/shared/AppIcon.jsx";
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { LEISTUNGEN } from '../../data/leistungen.js';
import { PRICING } from '../../data/siteConfig.js';

const STATUS_STEPS = ['documents_pending', 'analyzing', 'analysis_complete', 'payment_pending', 'signature_pending', 'submitted', 'approved'];
const STATUS_LABELS = {
  draft: 'Entwurf', documents_pending: 'Dokumente hochladen', analyzing: 'Wird analysiert',
  analysis_complete: 'Analyse fertig', payment_pending: 'Zahlung offen',
  signature_pending: 'Unterschrift nötig', submitted: 'Bei Behörde eingereicht',
  approved: 'Bewilligt', rejected: 'Abgelehnt', cancelled: 'Storniert',
};

const DOC_TYPE_LABELS = {
  personalausweis: 'Personalausweis', mietvertrag: 'Mietvertrag',
  einkommensnachweis: 'Einkommensnachweis', rentenbescheid: 'Rentenbescheid',
  geburtsurkunde: 'Geburtsurkunde', kv_bescheinigung: 'KV-Bescheinigung',
  kindergeld_bescheid: 'Kindergeld-Bescheid', other: 'Sonstiges Dokument',
};

const FIELD_LABELS = {
  full_name: 'Name', birth_date: 'Geburtsdatum', address: 'Adresse',
  monthly_rent: 'Kaltmiete', warm_rent: 'Warmmiete', landlord: 'Vermieter',
  gross_income: 'Bruttoeinkommen', net_income: 'Nettoeinkommen', employer: 'Arbeitgeber',
  monthly_pension: 'Bruttorente', net_pension: 'Nettorente', pension_type: 'Rentenart',
  insurance_number: 'Versicherungsnr.', child_name: 'Name des Kindes',
  parent_names: 'Eltern', insurance_type: 'Versicherungsart',
  monthly_premium: 'Monatsbeitrag', monthly_amount: 'Monatsbetrag',
  number_of_children: 'Anzahl Kinder', document_type: 'Dokumenttyp', summary: 'Zusammenfassung',
};

function formatValue(key, val) {
  if (val === null || val === undefined) return '–';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'number') {
    if (key.includes('rent') || key.includes('income') || key.includes('pension') || key.includes('premium') || key.includes('amount')) {
      return `${val.toLocaleString('de-DE')} €`;
    }
    return val.toString();
  }
  return String(val);
}

const CONFIDENCE_CONFIG = {
  hoch: { label: 'Hohe Konfidenz', color: '#0F6E56', bg: '#E1F5EE', desc: 'Die Daten wurden klar erkannt. Diese Schätzung ist relativ zuverlässig.' },
  mittel: { label: 'Mittlere Konfidenz', color: '#854F0B', bg: '#FAEEDA', desc: 'Einige Daten konnten nicht vollständig erkannt werden. Die tatsächliche Leistung kann abweichen.' },
  niedrig: { label: 'Niedrige Konfidenz', color: '#791F1F', bg: '#FCEBEB', desc: 'Wenige Daten erkannt. Bitte laden Sie weitere Dokumente hoch für eine genauere Schätzung.' },
};

// === ANALYSE-ZUSAMMENFASSUNG ===
function AnalysisSummary({ app, documents, leistung }) {
  const conf = CONFIDENCE_CONFIG[app.confidence] || CONFIDENCE_CONFIG.niedrig;
  const analyzedDocs = documents.filter(d => d.ocr_status === 'complete');
  const failedDocs = documents.filter(d => d.ocr_status === 'failed');
  let details = {};
  try { details = JSON.parse(app.notes || '{}'); } catch { details = {}; }

  const monthlyFee = Math.round(Number(app.estimated_monthly) * PRICING.successFeePercent / 100);
  const yearlyBenefit = Number(app.estimated_monthly) * 12;
  const yearlyFee = monthlyFee * 12;
  const yearlyNet = yearlyBenefit - yearlyFee - PRICING.baseFee;

  return (
    <div>
      {/* Ergebnis-Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1A3C2B 0%, #2D5A43 100%)',
        borderRadius: 12, padding: 32, color: '#FFF', marginBottom: 24,
      }}>
        <p style={{ fontSize: 12, color: '#C8DAD0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Geschätzter möglicher Anspruch
        </p>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#E2C044', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
          ~{Number(app.estimated_monthly).toLocaleString('de-DE')} €
        </div>
        <p style={{ fontSize: 18, color: '#C8DAD0', marginBottom: 16 }}>pro Monat</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: '#8AA494' }}>Pro Jahr</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>~{yearlyBenefit.toLocaleString('de-DE')} €</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#8AA494' }}>Konfidenz</div>
            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, background: conf.bg, color: conf.color, fontSize: 12, fontWeight: 600 }}>
              {conf.label}
            </span>
          </div>
        </div>
      </div>

      {/* Konfidenz-Erklärung */}
      <div style={{ padding: 16, background: conf.bg, borderRadius: 8, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <AppIcon name="info" size={16} />
        <p style={{ fontSize: 13, color: conf.color, margin: 0, lineHeight: 1.6 }}>{conf.desc}</p>
      </div>

      {/* Berechnungsgrundlage */}
      <div style={{ background: '#FFF', border: '1px solid #E2E8E5', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Berechnungsgrundlage</h3>
        <p style={{ fontSize: 13, color: '#8AA494', marginBottom: 16, lineHeight: 1.6 }}>
          Die folgenden Daten wurden aus Ihren Dokumenten extrahiert und für die Berechnung verwendet:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {Object.entries(details).map(([key, val]) => {
            if (!val) return null;
            const labels = { income: 'Einkommen (Netto)', rent: 'Warmmiete', householdSize: 'Haushaltsgröße', childCount: 'Kinder', grossPension: 'Bruttorente', netIncome: 'Nettoeinkommen', pension: 'Rente' };
            const isEuro = ['income', 'rent', 'grossPension', 'netIncome', 'pension'].includes(key);
            return (
              <div key={key} style={{ background: '#F8FAF9', borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#8AA494', marginBottom: 4 }}>{labels[key] || key}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1A3C2B', fontFamily: 'var(--font-mono)' }}>
                  {isEuro ? `${Number(val).toLocaleString('de-DE')} €` : val} {key === 'householdSize' ? 'Pers.' : key === 'childCount' ? '' : ''}
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(details).length === 0 && (
          <p style={{ fontSize: 13, color: '#854F0B', margin: 0 }}>
            Es konnten keine relevanten Daten aus den Dokumenten extrahiert werden.
            Bitte laden Sie besser lesbare Dokumente hoch.
          </p>
        )}
      </div>

      {/* Erkannte Daten */}
      {analyzedDocs.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Erkannte Daten</h3>
          {analyzedDocs.map((doc) => {
            const extracted = doc.ocr_result?.extracted || {};
            const docLabel = DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type;
            const entries = Object.entries(extracted).filter(([k, v]) => v && k !== 'raw_text' && k !== 'parse_error');
            if (entries.length === 0) return null;
            return (
              <div key={doc.id} style={{ background: '#FFF', border: '1px solid #E2E8E5', borderRadius: 8, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <AppIcon name="document" size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A3C2B' }}>{docLabel}</span>
                  <span style={{ fontSize: 11, color: '#8AA494' }}>({doc.file_name})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {entries.map(([key, val]) => (
                    <div key={key} style={{ padding: '6px 0' }}>
                      <div style={{ fontSize: 11, color: '#8AA494', marginBottom: 2 }}>{FIELD_LABELS[key] || key}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1A3C2B' }}>{formatValue(key, val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fehlgeschlagene Dokumente */}
      {failedDocs.length > 0 && (
        <div style={{ padding: 16, background: '#FFF5F5', borderRadius: 8, marginBottom: 24, border: '1px solid #E8A3A3' }}>
          <p style={{ fontSize: 13, color: '#791F1F', margin: 0 }}>
            {failedDocs.length} Dokument(e) konnten nicht analysiert werden.
            Sie können diese erneut hochladen für eine genauere Schätzung.
          </p>
          <a href={`/app/upload?antrag=${app.id}`} style={{ fontSize: 13, color: '#791F1F', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
            Weitere Dokumente hochladen →
          </a>
        </div>
      )}

      {/* Kostenübersicht */}
      <div style={{ background: '#FFF', border: '1px solid #E2E8E5', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Kostenübersicht</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#8AA494' }}>Grundgebühr (einmalig)</span>
            <span style={{ fontWeight: 600, color: '#1A3C2B' }}>{PRICING.baseFeeLabel}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#8AA494' }}>Erfolgsgebühr ({PRICING.successFeePercent}% × ~{Number(app.estimated_monthly).toLocaleString('de-DE')} €)</span>
            <span style={{ fontWeight: 600, color: '#1A3C2B' }}>~{monthlyFee} €/Monat</span>
          </div>
          <div style={{ borderTop: '1px solid #E2E8E5', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#8AA494' }}>Erfolgsgebühr nur im 1. Jahr</span>
            <span style={{ fontWeight: 600, color: '#1A3C2B' }}>~{yearlyFee.toLocaleString('de-DE')} €</span>
          </div>
          <div style={{ background: '#E1F5EE', borderRadius: 6, padding: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: '#0F6E56' }}>Ihr Nettovorteil im 1. Jahr</span>
            <span style={{ fontWeight: 700, color: '#0F6E56', fontFamily: 'var(--font-mono)' }}>~{yearlyNet.toLocaleString('de-DE')} €</span>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#8AA494', marginTop: 12, marginBottom: 0 }}>
          Ab dem 2. Jahr erhalten Sie die volle Leistung ohne Abzüge. Bei Ablehnung werden die 49 € erstattet.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: 12, background: '#FFF8E7', border: '1px solid #E8D5A3', borderRadius: 8, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AppIcon name="scale" size={16} />
        <p style={{ fontSize: 12, color: '#8B6914', margin: 0, lineHeight: 1.5 }}>
          Diese Schätzung basiert auf allgemeinen Berechnungsregeln und den erkannten Daten aus Ihren Dokumenten.
          Die tatsächliche Leistungshöhe wird von der zuständigen Behörde festgelegt und kann abweichen.
          AdminPilot bietet keine Rechts- oder Sozialberatung an.
        </p>
      </div>
    </div>
  );
}

// === NÄCHSTE SCHRITTE ===
function NextSteps({ app, status }) {
  const steps = [
    { key: 'analysis_complete', label: 'Analyse abgeschlossen', desc: 'Ihre Dokumente wurden ausgewertet.', done: true },
    {
      key: 'payment',
      label: 'Antrag beauftragen',
      desc: `Einmalige Grundgebühr von ${PRICING.baseFeeLabel}. Geld zurück bei Ablehnung.`,
      done: ['payment_pending', 'signature_pending', 'submitted', 'approved'].includes(status) && status !== 'analysis_complete',
      current: status === 'analysis_complete',
    },
    {
      key: 'signature',
      label: 'Digital unterschreiben',
      desc: 'Vollmacht per qualifizierter elektronischer Signatur (QES) bestätigen.',
      done: ['signature_pending', 'submitted', 'approved'].includes(status) && status !== 'payment_pending',
      current: status === 'payment_pending',
    },
    {
      key: 'submitted',
      label: 'Antrag wird eingereicht',
      desc: 'Wir füllen den Antrag aus und reichen ihn bei der Behörde ein.',
      done: ['submitted', 'approved'].includes(status),
      current: status === 'signature_pending',
    },
    {
      key: 'decision',
      label: 'Entscheidung der Behörde',
      desc: 'In der Regel 3–8 Wochen. Wir informieren Sie per E-Mail.',
      done: status === 'approved',
      current: status === 'submitted',
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Nächste Schritte</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Vertical line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                background: step.done ? '#1A3C2B' : step.current ? '#E2C044' : '#C8DAD0',
                border: step.current ? '3px solid #F5DFA0' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {step.done && <span style={{ color: '#FFF', fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, height: 40, background: step.done ? '#1A3C2B' : '#C8DAD0' }} />
              )}
            </div>
            {/* Content */}
            <div style={{ paddingBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: step.current ? 700 : step.done ? 600 : 400, color: step.current ? '#1A3C2B' : step.done ? '#1A3C2B' : '#8AA494' }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12, color: '#8AA494', marginTop: 2 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === HAUPTKOMPONENTE ===
export default function AntragDetailPage({ params }) {
  const { user } = useAppUser();
  const [app, setApp] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !params?.id) return;
    async function load() {
      const [appRes, updRes, docRes] = await Promise.all([
        supabase.from('applications').select('*').eq('id', params.id).eq('clerk_id', user.id).single(),
        supabase.from('status_updates').select('*').eq('application_id', params.id).order('created_at', { ascending: false }),
        supabase.from('documents').select('*').eq('application_id', params.id).order('created_at', { ascending: true }),
      ]);
      setApp(appRes.data);
      setUpdates(updRes.data || []);
      setDocuments(docRes.data || []);
      setLoading(false);
    }
    load();
  }, [user, params?.id]);

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #C8DAD0', borderTopColor: '#1A3C2B', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: '#8AA494' }}>Antrag wird geladen...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (!app) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h2>Antrag nicht gefunden</h2>
      <a href="/app" style={{ color: '#8AA494', textDecoration: 'underline' }}>Zum Dashboard</a>
    </div>
  );

  const leistung = LEISTUNGEN.find(l => l.id === app.leistung_id);
  const currentStepIdx = STATUS_STEPS.indexOf(app.status);
  const isAnalysisComplete = app.status === 'analysis_complete';
  const isApproved = app.status === 'approved';
  const isRejected = app.status === 'rejected';

  return (
    <>
      <SEOHead title={`Antrag: ${app.leistung_name}`} noindex />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <LeistungIcon id={app.leistung_id} size={48} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: '#1A3C2B' }}>{app.leistung_name}</h1>
          <p style={{ color: '#8AA494', margin: '4px 0 0', fontSize: 13 }}>
            Erstellt am {new Date(app.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 100,
          background: isApproved ? '#E1F5EE' : isRejected ? '#FCEBEB' : '#FAEEDA',
          color: isApproved ? '#0F6E56' : isRejected ? '#791F1F' : '#854F0B',
        }}>
          {STATUS_LABELS[app.status]}
        </span>
      </div>

      {/* Status Stepper */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
        {STATUS_STEPS.slice(0, 7).map((step, i) => (
          <div key={step} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= currentStepIdx ? '#1A3C2B' : '#C8DAD0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* === STATUS: Dokumente hochladen === */}
      {app.status === 'documents_pending' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16 }}><AppIcon name="upload" size={48} color="#C8DAD0" /></div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Dokumente hochladen</h2>
          <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto 24px' }}>
            Laden Sie die benötigten Dokumente hoch, damit Ihr möglicher Anspruch automatisch berechnet werden kann.
          </p>
          <a href={`/app/upload?antrag=${app.id}`} style={{
            display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
            padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontSize: 16,
          }}>
            Dokumente hochladen →
          </a>
          {leistung && (
            <div style={{ maxWidth: 300, margin: '24px auto 0', textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: '#8AA494', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Benötigte Dokumente</p>
              {leistung.requiredDocs.map((doc, i) => (
                <div key={i} style={{ fontSize: 13, padding: '4px 0', color: '#2D3A33', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#C8DAD0' }}>○</span> {doc}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === STATUS: Analyse fertig === */}
      {isAnalysisComplete && (
        <>
          <AnalysisSummary app={app} documents={documents} leistung={leistung} />
          <NextSteps app={app} status={app.status} />

          {/* CTA */}
          <div style={{
            background: '#1A3C2B', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 24,
          }}>
            <p style={{ color: '#C8DAD0', fontSize: 14, marginBottom: 8 }}>Nächster Schritt</p>
            <h2 style={{ color: '#FFF', fontSize: 22, marginBottom: 4 }}>Antrag jetzt beauftragen</h2>
            <p style={{ color: '#8AA494', fontSize: 14, marginBottom: 20 }}>
              Einmalig {PRICING.baseFeeLabel}. Geld zurück bei Ablehnung.
            </p>
            <a href={`/app/zahlung/${app.id}`} style={{
              display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
              fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
            }}>
              Jetzt beauftragen – {PRICING.baseFeeLabel} →
            </a>
            <p style={{ color: '#8AA494', fontSize: 12, marginTop: 12, marginBottom: 0 }}>
              Sicher bezahlen mit Kreditkarte oder SEPA-Lastschrift
            </p>
          </div>

          {/* Analyse verbessern */}
          <div style={{
            background: '#F8FAF9', border: '1px solid #E2E8E5', borderRadius: 12, padding: 24, marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: 15, color: '#1A3C2B', marginBottom: 6 }}>Analyse verbessern?</h3>
              <p style={{ fontSize: 13, color: '#8AA494', margin: 0, lineHeight: 1.6 }}>
                Laden Sie weitere oder bessere Dokumente hoch, um eine genauere Berechnung zu erhalten. 
                Die neue Analyse ersetzt die bisherige.
              </p>
            </div>
            <a href={`/app/upload?antrag=${app.id}`} style={{
              display: 'inline-block', background: '#FFF', border: '1px solid #E2E8E5',
              color: '#1A3C2B', fontWeight: 600, padding: '10px 24px', borderRadius: 8,
              textDecoration: 'none', fontSize: 14, whiteSpace: 'nowrap',
            }}>
              Weitere Dokumente hochladen →
            </a>
          </div>
        </>
      )}

      {/* === STATUS: Unterschrift nötig === */}
      {app.status === 'signature_pending' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E2C044" strokeWidth="1.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Zahlung erhalten – Vollmacht unterschreiben</h2>
          <p style={{ color: '#8AA494', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Ihre Zahlung von {PRICING.baseFeeLabel} wurde bestätigt. Im nächsten Schritt unterschreiben Sie die Vollmacht, damit wir Ihren Antrag auf {app.leistung_name} bei der Behörde einreichen können.
          </p>
          <a href={`/app/signatur/${app.id}`} style={{
            display: 'inline-block', background: '#1A3C2B', color: '#FFF', fontWeight: 600,
            fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
          }}>
            Jetzt unterschreiben →
          </a>
          <div style={{ marginTop: 24 }}>
            <NextSteps app={app} status={app.status} />
          </div>
        </div>
      )}

      {/* === STATUS: Zahlung offen === */}
      {app.status === 'payment_pending' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Zahlung ausstehend</h2>
          <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto 24px' }}>
            Schließen Sie die Zahlung ab, um Ihren Antrag zu beauftragen.
          </p>
          <a href={`/app/zahlung/${app.id}`} style={{
            display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
            padding: '14px 40px', borderRadius: 8, textDecoration: 'none', fontSize: 16,
          }}>
            Jetzt bezahlen – {PRICING.baseFeeLabel} →
          </a>
        </div>
      )}

      {/* === STATUS: Eingereicht === */}
      {app.status === 'submitted' && (
        <div>
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ marginBottom: 16 }}><AppIcon name="send" size={48} color="#0F6E56" /></div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Ihr Antrag wird bearbeitet</h2>
            <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto 16px' }}>
              Der Antrag auf {app.leistung_name} wird bei der zuständigen Behörde eingereicht.
              Die Bearbeitung dauert in der Regel 3–8 Wochen.
            </p>
            <p style={{ fontSize: 14, color: '#1A3C2B', fontWeight: 600 }}>
              Wir informieren Sie per E-Mail, sobald es ein Update gibt.
            </p>
          </div>

          {/* Antragsstatus-Karte */}
          {app.generated_antrag && !app.generated_antrag.parse_error && (() => {
            const ga = app.generated_antrag;
            const meta = ga.meta || {};
            const felder = ga.ausgefuellte_felder || {};
            const fehlend = ga.fehlende_felder || [];
            const nachweise = ga.nachweise_erforderlich || [];
            const modus = meta.modus;
            const behoerde = ga.behoerde_empfaenger || {};

            return (
              <div style={{ marginBottom: 24 }}>
                {/* Modus-Anzeige */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  background: modus === 'pdf_vorhanden' ? '#E1F5EE' : '#FFF8E7',
                  borderRadius: '8px 8px 0 0', fontSize: 13,
                  border: `1px solid ${modus === 'pdf_vorhanden' ? '#A8D8C5' : '#E8D5A3'}`,
                  borderBottom: 'none',
                }}>
                  <span style={{ fontWeight: 600, color: modus === 'pdf_vorhanden' ? '#0F6E56' : '#8B6914' }}>
                    {modus === 'pdf_vorhanden'
                      ? `PDF-Formular (${meta.kennung}) wird ausgefüllt`
                      : modus === 'kein_antrag'
                        ? 'Kein Antrag nötig'
                        : 'Formloser Antrag per E-Mail'}
                  </span>
                  {meta.online_portal && (
                    <a href={meta.online_portal} target="_blank" rel="noopener" style={{ marginLeft: 'auto', fontSize: 12, color: '#8AA494' }}>Online-Portal →</a>
                  )}
                </div>

                {/* Hauptkarte */}
                <div style={{ background: '#F8FAF9', borderRadius: '0 0 12px 12px', padding: 20, border: '1px solid #E2E8E5' }}>
                  {/* Eckdaten */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, marginBottom: 16 }}>
                    <div style={{ padding: 10, background: '#FFF', borderRadius: 6 }}>
                      <div style={{ color: '#8AA494', marginBottom: 3, fontSize: 11 }}>Leistung</div>
                      <div style={{ fontWeight: 600, color: '#1A3C2B' }}>{meta.leistung || app.leistung_name}</div>
                    </div>
                    <div style={{ padding: 10, background: '#FFF', borderRadius: 6 }}>
                      <div style={{ color: '#8AA494', marginBottom: 3, fontSize: 11 }}>Bundesland</div>
                      <div style={{ fontWeight: 600, color: '#1A3C2B' }}>{meta.bundesland || '–'}</div>
                    </div>
                    <div style={{ padding: 10, background: '#FFF', borderRadius: 6 }}>
                      <div style={{ color: '#8AA494', marginBottom: 3, fontSize: 11 }}>Daten erkannt</div>
                      <div style={{ fontWeight: 600, color: '#0F6E56' }}>
                        {Object.keys(felder).length} von {Object.keys(felder).length + fehlend.length}
                      </div>
                    </div>
                    <div style={{ padding: 10, background: '#FFF', borderRadius: 6 }}>
                      <div style={{ color: '#8AA494', marginBottom: 3, fontSize: 11 }}>Behörde</div>
                      <div style={{ fontWeight: 600, color: '#1A3C2B', fontSize: 11 }}>{behoerde.name || meta.leistung_id || '–'}</div>
                    </div>
                  </div>

                  {/* Fehlende Felder */}
                  {fehlend.length > 0 && (
                    <div style={{ padding: 12, background: '#FFF8E7', borderRadius: 8, border: '1px solid #E8D5A3', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6914', marginBottom: 4 }}>
                        {fehlend.length} fehlende Angabe{fehlend.length > 1 ? 'n' : ''}
                      </div>
                      <p style={{ fontSize: 11, color: '#8B6914', margin: 0 }}>
                        Unser Team wird Sie kontaktieren, um diese zu ergänzen.
                      </p>
                    </div>
                  )}

                  {/* Erforderliche Nachweise */}
                  {nachweise.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1A3C2B', marginBottom: 6 }}>Erforderliche Nachweise</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {nachweise.map((n, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#5A6B60' }}>
                            <span style={{ color: '#8AA494', flexShrink: 0, marginTop: 1 }}>•</span>
                            <span>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sonder-Hinweis */}
                  {ga.sonder_hinweis && (
                    <div style={{ padding: 10, background: '#FFF5F5', borderRadius: 6, border: '1px solid #E8A3A3', fontSize: 12, color: '#C0392B' }}>
                      {ga.sonder_hinweis}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <NextSteps app={app} status={app.status} />
        </div>
      )}

      {/* === STATUS: Bewilligt === */}
      {isApproved && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16 }}><AppIcon name="trophy" size={56} color="#E2C044" /></div>
          <h2 style={{ fontSize: 24, marginBottom: 8, color: '#0F6E56' }}>Glückwunsch! Ihr Antrag wurde bewilligt.</h2>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#E2C044', fontFamily: 'var(--font-mono)', margin: '16px 0' }}>
            {Number(app.estimated_monthly).toLocaleString('de-DE')} €/Monat
          </div>
          <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto' }}>
            Die Leistung wird Ihnen monatlich überwiesen. Bei Fragen wenden Sie sich an info@adminpilot.de.
          </p>
        </div>
      )}

      {/* === STATUS: Abgelehnt === */}
      {isRejected && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16 }}><AppIcon name="frown" size={48} color="#8AA494" /></div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Antrag leider abgelehnt</h2>
          <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto 16px' }}>
            Leider wurde Ihr Antrag auf {app.leistung_name} von der Behörde abgelehnt.
          </p>
          <div style={{ background: '#E1F5EE', borderRadius: 8, padding: 16, maxWidth: 400, margin: '0 auto 24px' }}>
            <p style={{ fontSize: 14, color: '#0F6E56', margin: 0, fontWeight: 600 }}>
              Geld-zurück-Garantie: Die Grundgebühr von {PRICING.baseFeeLabel} wird Ihnen erstattet.
            </p>
          </div>
          <a href="mailto:info@adminpilot.de" style={{ color: '#8AA494', fontSize: 14, textDecoration: 'underline' }}>
            Kontakt aufnehmen für Widerspruch
          </a>
        </div>
      )}

      {/* === TIMELINE (immer sichtbar) === */}
      {updates.length > 0 && (
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #E2E8E5' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Verlauf</h3>
          <div style={{ borderLeft: '2px solid #C8DAD0', paddingLeft: 20 }}>
            {updates.map((u, i) => (
              <div key={u.id} style={{ marginBottom: 20, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: -25, top: 4, width: 10, height: 10,
                  borderRadius: '50%', background: i === 0 ? '#1A3C2B' : '#C8DAD0',
                }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1A3C2B', margin: 0 }}>
                  {STATUS_LABELS[u.status] || u.status}
                </p>
                <p style={{ fontSize: 13, color: '#8AA494', margin: '2px 0 0' }}>{u.message}</p>
                <p style={{ fontSize: 11, color: '#C8DAD0', margin: '2px 0 0' }}>
                  {new Date(u.created_at).toLocaleString('de-DE')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zurück zum Dashboard */}
      <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 24 }}>
        <a href="/app" style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>← Zurück zum Dashboard</a>
      </div>
    </>
  );
}
