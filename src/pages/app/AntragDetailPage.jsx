import AppIcon from "../../components/shared/AppIcon.jsx";
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { LEISTUNGEN } from '../../data/leistungen.js';
import { PRICING } from '../../data/siteConfig.js';

const STATUS_STEPS = ['documents_pending', 'analyzing', 'analysis_complete', 'payment_pending', 'antrag_wird_erstellt', 'antrag_bereit', 'eingereicht_durch_kunde', 'bewilligt'];
const STATUS_LABELS = {
  draft: 'Entwurf',
  documents_pending: 'Dokumente hochladen',
  analyzing: 'Wird analysiert',
  analysis_complete: 'Analyse fertig',
  payment_pending: 'Zahlung offen',
  antrag_wird_erstellt: 'Antrag wird vorbereitet',
  antrag_bereit: 'Bereit zum Einreichen',
  eingereicht_durch_kunde: 'Eingereicht',
  bewilligt: 'Bewilligt',
  abgelehnt: 'Abgelehnt',
  cancelled: 'Storniert',
  // Legacy (falls in DB noch vorhanden)
  signature_pending: 'Bereit zum Einreichen',
  submitted: 'Eingereicht',
  approved: 'Bewilligt',
  rejected: 'Abgelehnt',
};

const DOC_TYPE_LABELS = {
  personalausweis: 'Personalausweis', mietvertrag: 'Mietvertrag',
  einkommensnachweis: 'Einkommensnachweis', rentenbescheid: 'Rentenbescheid',
  geburtsurkunde: 'Geburtsurkunde', kv_bescheinigung: 'KV-Bescheinigung',
  kindergeld_bescheid: 'Kindergeld-Bescheid', other: 'Sonstiges Dokument',
};

const CONFIDENCE_CONFIG = {
  hoch: { label: 'Hohe Konfidenz', color: '#0F6E56', bg: '#E1F5EE', desc: 'Die Daten wurden klar erkannt. Diese Schätzung ist relativ zuverlässig.' },
  mittel: { label: 'Mittlere Konfidenz', color: '#854F0B', bg: '#FAEEDA', desc: 'Einige Daten konnten nicht vollständig erkannt werden. Die tatsächliche Leistung kann abweichen.' },
  niedrig: { label: 'Niedrige Konfidenz', color: '#791F1F', bg: '#FCEBEB', desc: 'Wenige Daten erkannt. Bitte laden Sie weitere Dokumente hoch für eine genauere Schätzung.' },
};

// === ANALYSE-ZUSAMMENFASSUNG ===
function AnalysisSummary({ app, documents, leistung }) {
  const conf = CONFIDENCE_CONFIG[app.confidence] || CONFIDENCE_CONFIG.niedrig;
  const analyzedDocs = documents.filter(d => d.ocr_status === 'complete');
  let details = {};
  try { details = JSON.parse(app.notes || '{}'); } catch { details = {}; }

  const yearlyBenefit = Number(app.estimated_monthly) * 12;

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

      {/* Disclaimer */}
      <div style={{ padding: 12, background: '#FFF8E7', border: '1px solid #E8D5A3', borderRadius: 8, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AppIcon name="scale" size={16} />
        <p style={{ fontSize: 12, color: '#8B6914', margin: 0, lineHeight: 1.5 }}>
          Diese Schätzung basiert auf allgemeinen Berechnungsregeln und den erkannten Daten aus Ihren Dokumenten.
          Die tatsächliche Leistungshöhe wird von der zuständigen Behörde festgelegt. AdminPilot bietet keine Rechts- oder Sozialberatung.
        </p>
      </div>
    </div>
  );
}

// === NÄCHSTE SCHRITTE (neue Reihenfolge ohne Signatur) ===
function NextSteps({ status }) {
  const isDone = (s) => ['antrag_wird_erstellt', 'antrag_bereit', 'eingereicht_durch_kunde', 'bewilligt', 'submitted', 'approved'].includes(status) && s !== status;
  const steps = [
    {
      key: 'analysis_complete',
      label: 'Analyse abgeschlossen',
      desc: 'Ihre Dokumente wurden ausgewertet.',
      done: ['payment_pending', 'antrag_wird_erstellt', 'antrag_bereit', 'eingereicht_durch_kunde', 'bewilligt', 'abgelehnt', 'submitted', 'approved', 'rejected'].includes(status),
      current: status === 'analysis_complete',
    },
    {
      key: 'payment',
      label: 'Antrag beauftragen',
      desc: `Einmalige Grundgebühr von ${PRICING.baseFeeLabel}. Geld zurück bei Ablehnung.`,
      done: ['antrag_wird_erstellt', 'antrag_bereit', 'eingereicht_durch_kunde', 'bewilligt', 'abgelehnt', 'submitted', 'approved', 'rejected'].includes(status),
      current: status === 'payment_pending' || status === 'analysis_complete',
    },
    {
      key: 'generating',
      label: 'Antrag wird vorbereitet',
      desc: 'Wir erstellen Ihren Antrag automatisch auf Basis Ihrer Dokumente.',
      done: ['antrag_bereit', 'eingereicht_durch_kunde', 'bewilligt', 'abgelehnt', 'submitted', 'approved', 'rejected'].includes(status),
      current: status === 'antrag_wird_erstellt',
    },
    {
      key: 'submit',
      label: 'Antrag einreichen',
      desc: 'Sie drucken den Antrag aus, unterschreiben und senden ihn an die Behörde.',
      done: ['eingereicht_durch_kunde', 'bewilligt', 'abgelehnt', 'submitted', 'approved', 'rejected'].includes(status),
      current: status === 'antrag_bereit' || status === 'signature_pending',
    },
    {
      key: 'decision',
      label: 'Entscheidung der Behörde',
      desc: 'In der Regel 3–8 Wochen nach Einreichung.',
      done: ['bewilligt', 'abgelehnt', 'approved', 'rejected'].includes(status),
      current: status === 'eingereicht_durch_kunde' || status === 'submitted',
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Nächste Schritte</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
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

// === VIEW: Antrag wird erstellt ===
function AntragWirdErstelltView() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{
        width: 56, height: 56, border: '4px solid #C8DAD0',
        borderTopColor: '#1A3C2B', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 24px',
      }} />
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Ihr Antrag wird vorbereitet</h2>
      <p style={{ color: '#8AA494', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
        Wir erstellen gerade Ihren fertig ausgefüllten Antrag. Das dauert in der Regel 1–2 Minuten. Diese Seite aktualisiert sich automatisch.
      </p>
      <p style={{ fontSize: 13, color: '#8AA494', maxWidth: 440, margin: '0 auto' }}>
        Sie können die Seite verlassen – wir benachrichtigen Sie per E-Mail, sobald der Antrag zum Einreichen bereit ist.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// === VIEW: Antrag bereit (Kunde reicht selbst ein) ===
function AntragBereitView({ app, onConfirmSubmission, onRequestShipment, shipmentSent, confirmingSubmission }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState('post');

  const ga = app.generated_antrag || {};
  const meta = ga.meta || {};
  const behoerde = ga.behoerde_empfaenger || {};
  const anleitung = ga.einreichungsanleitung || '';
  const nachweise = ga.nachweise_erforderlich || [];
  const anschreiben = ga.anschreiben || '';
  const modus = ga.modus || 'anschreiben';
  const isPdfFill = modus === 'pdf_fill';
  const isNoFormNeeded = modus === 'kein_antrag';
  const fehlendeHinweis = ga.fehlende_felder_hinweis || '';
  const filledFieldsCount = ga.filled_fields_count || 0;

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadAnschreiben = () => {
    const blob = new Blob([anschreiben], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Antrag_${meta.leistung_id || 'AdminPilot'}_${app.id.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch(`/api/download-antrag?application_id=${app.id}`);
      const data = await res.json();
      if (data.success && data.download_url) {
        const a = document.createElement('a');
        a.href = data.download_url;
        a.download = data.filename || `Antrag_${meta.kennung}_${app.id.substring(0, 8)}.pdf`;
        a.target = '_blank';
        a.click();
      } else {
        alert('Download fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (e) {
      alert('Verbindungsfehler. Bitte erneut versuchen.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <>
      {/* Hero-Box */}
      <div style={{
        background: 'linear-gradient(135deg, #0F6E56 0%, #1A3C2B 100%)',
        borderRadius: 12, padding: 28, color: '#FFF', marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ marginBottom: 12 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E2C044" strokeWidth="1.5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
        <h2 style={{ fontSize: 24, margin: '0 0 8px', color: '#FFF' }}>Ihr Antrag ist fertig!</h2>
        <p style={{ fontSize: 14, color: '#C8DAD0', margin: 0 }}>
          Antrag auf {app.leistung_name} – bereit zum Unterschreiben und Einreichen
        </p>
      </div>

      {/* Plus-Box: Versandumschlag bestellen */}
      {app.plus_package && (
        <div style={{
          background: '#FFF8E7', borderRadius: 12, padding: 20, marginBottom: 16,
          border: '2px solid #E2C044',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8B6914', background: '#E2C044', padding: '2px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plus-Paket</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1A3C2B' }}>Versandumschlag anfordern</span>
          </div>
          <p style={{ fontSize: 13, color: '#5A6B60', margin: '0 0 12px', lineHeight: 1.5 }}>
            Wir schicken Ihnen einen frankierten Umschlag mit Anschreiben und allen Formularen zum Ausdrucken nach Hause. Sie müssen nur noch unterschreiben und an die Behörde weiterschicken.
          </p>
          {shipmentSent ? (
            <div style={{ padding: 12, background: '#E1F5EE', borderRadius: 8, fontSize: 13, color: '#0F6E56', fontWeight: 600 }}>
              ✓ Versandumschlag bestellt – kommt in 2–3 Werktagen bei Ihnen an
            </div>
          ) : (
            <button
              onClick={onRequestShipment}
              style={{
                padding: '10px 20px', background: '#1A3C2B', color: '#FFF',
                fontWeight: 600, fontSize: 14, borderRadius: 8, border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              Versandumschlag bestellen
            </button>
          )}
        </div>
      )}

      {/* Antrags-Übersicht */}
      <div style={{ background: '#F8FAF9', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid #E2E8E5' }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Antragsübersicht</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, fontSize: 13 }}>
          <div>
            <div style={{ color: '#8AA494', fontSize: 11, marginBottom: 2 }}>Leistung</div>
            <div style={{ fontWeight: 600, color: '#1A3C2B' }}>{meta.leistung || app.leistung_name}</div>
          </div>
          <div>
            <div style={{ color: '#8AA494', fontSize: 11, marginBottom: 2 }}>Formular</div>
            <div style={{ fontWeight: 600, color: '#1A3C2B' }}>{meta.kennung || '—'}</div>
          </div>
          <div>
            <div style={{ color: '#8AA494', fontSize: 11, marginBottom: 2 }}>Behörde</div>
            <div style={{ fontWeight: 600, color: '#1A3C2B', fontSize: 12 }}>{behoerde.name || '—'}</div>
          </div>
          <div>
            <div style={{ color: '#8AA494', fontSize: 11, marginBottom: 2 }}>Bundesland</div>
            <div style={{ fontWeight: 600, color: '#1A3C2B' }}>{meta.bundesland || '—'}</div>
          </div>
        </div>
      </div>

      {/* Download-Bereich */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid #E2E8E5' }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Antrag herunterladen</h3>

        {isPdfFill && (
          <>
            <p style={{ fontSize: 13, color: '#5A6B60', margin: '0 0 10px', lineHeight: 1.5 }}>
              Wir haben das offizielle Formular <b>{meta.kennung}</b> der {meta.behoerde || behoerde.name} mit Ihren Daten ausgefüllt.
              <b> {filledFieldsCount} Felder</b> wurden automatisch aus Ihren Dokumenten befüllt.
              Bitte prüfen Sie das PDF sorgfältig, bevor Sie es einreichen.
            </p>
            {fehlendeHinweis && (
              <div style={{
                background: '#FFF8E7', border: '1px solid #E2C044', borderRadius: 8,
                padding: 12, margin: '12px 0', fontSize: 13, color: '#8B6914', lineHeight: 1.5,
              }}>
                <b>Noch handschriftlich zu ergänzen:</b><br/>
                {fehlendeHinweis}
              </div>
            )}
          </>
        )}

        {!isPdfFill && !isNoFormNeeded && (
          <p style={{ fontSize: 13, color: '#5A6B60', margin: '0 0 10px', lineHeight: 1.5 }}>
            Wir haben ein formelles Anschreiben auf Basis Ihrer Dokumente vorbereitet. Sie können es ausdrucken, unterschreiben und zusammen mit den Nachweisen einreichen.
          </p>
        )}

        {isNoFormNeeded && (
          <div style={{
            background: '#E1F5EE', border: '1px solid #A8D8C5', borderRadius: 8,
            padding: 16, fontSize: 13, color: '#0F6E56', lineHeight: 1.6,
          }}>
            <b>Hinweis:</b> {ga.hinweis || 'Für diese Leistung ist kein separater Antrag nötig.'}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          {isPdfFill && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              style={{
                padding: '12px 22px',
                background: downloadingPdf ? '#C8DAD0' : '#E2C044',
                color: downloadingPdf ? '#8AA494' : '#1A3C2B',
                fontWeight: 600, fontSize: 14, borderRadius: 8, border: 'none',
                cursor: downloadingPdf ? 'wait' : 'pointer', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {downloadingPdf ? 'Wird vorbereitet...' : `📄 Antrag als PDF herunterladen`}
            </button>
          )}
          {!isPdfFill && anschreiben && (
            <button
              onClick={handleDownloadAnschreiben}
              style={{
                padding: '10px 18px', background: '#E2C044', color: '#1A3C2B',
                fontWeight: 600, fontSize: 14, borderRadius: 8, border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              📄 Anschreiben herunterladen
            </button>
          )}
          {meta.online_portal && (
            <a
              href={meta.online_portal} target="_blank" rel="noopener"
              style={{
                padding: '10px 18px', background: '#FFF', color: '#1A3C2B',
                fontWeight: 600, fontSize: 14, borderRadius: 8,
                border: '1px solid #E2E8E5', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              🌐 Online-Portal der Behörde →
            </a>
          )}
        </div>
      </div>

      {/* Einreichungsanleitung */}
      <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid #A8D8C5' }}>
        <h3 style={{ fontSize: 15, marginBottom: 12, color: '#0F6E56' }}>So reichen Sie Ihren Antrag ein</h3>
        {anleitung ? (
          <p style={{ fontSize: 13, color: '#0F6E56', margin: '0 0 10px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {anleitung}
          </p>
        ) : (
          <ol style={{ fontSize: 13, color: '#0F6E56', margin: '0 0 10px', paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Antragsdokument herunterladen und ausdrucken</li>
            <li>Eigenhändig unterschreiben</li>
            <li>Benötigte Nachweise beilegen (siehe Liste unten)</li>
            <li>Per Post an die zuständige Behörde senden oder über das Online-Portal einreichen</li>
          </ol>
        )}
        {behoerde.adresse && (
          <div style={{ marginTop: 12, padding: 12, background: '#FFF', borderRadius: 8, fontSize: 13 }}>
            <div style={{ fontWeight: 600, color: '#1A3C2B', marginBottom: 4 }}>Adresse der Behörde:</div>
            <div style={{ color: '#5A6B60', whiteSpace: 'pre-wrap' }}>{behoerde.adresse}</div>
          </div>
        )}
      </div>

      {/* Nachweise */}
      {nachweise.length > 0 && (
        <div style={{ background: '#FFF', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid #E2E8E5' }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Nachweise beilegen</h3>
          {nachweise.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', fontSize: 13, color: '#2D3A33' }}>
              <span style={{ color: '#8AA494', flexShrink: 0, marginTop: 1 }}>•</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bestätigen-Button */}
      <div style={{ background: '#1A3C2B', borderRadius: 12, padding: 24, marginBottom: 24, textAlign: 'center' }}>
        {!confirmOpen ? (
          <>
            <p style={{ color: '#C8DAD0', fontSize: 13, marginBottom: 12 }}>
              Sobald Sie den Antrag abgeschickt haben:
            </p>
            <button
              onClick={() => setConfirmOpen(true)}
              style={{
                padding: '12px 28px', background: '#E2C044', color: '#1A3C2B',
                fontWeight: 600, fontSize: 15, borderRadius: 8, border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              ✓ Ich habe den Antrag eingereicht
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#FFF', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              Wie haben Sie den Antrag eingereicht?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                { value: 'post', label: 'Per Post' },
                { value: 'online', label: 'Über Online-Portal der Behörde' },
                { value: 'persoenlich', label: 'Persönlich abgegeben' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  background: submissionMethod === opt.value ? 'rgba(226, 192, 68, 0.2)' : 'transparent',
                  borderRadius: 6, cursor: 'pointer', fontSize: 14, color: '#FFF',
                }}>
                  <input
                    type="radio" name="submission_method" value={opt.value}
                    checked={submissionMethod === opt.value}
                    onChange={e => setSubmissionMethod(e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onConfirmSubmission(submissionMethod)}
                disabled={confirmingSubmission}
                style={{
                  flex: 1, padding: '10px 20px',
                  background: confirmingSubmission ? '#C8DAD0' : '#E2C044',
                  color: '#1A3C2B',
                  fontWeight: 600, fontSize: 14, borderRadius: 8, border: 'none',
                  cursor: confirmingSubmission ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {confirmingSubmission ? 'Wird gespeichert...' : 'Bestätigen'}
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={confirmingSubmission}
                style={{
                  padding: '10px 20px', background: 'transparent', color: '#C8DAD0',
                  fontWeight: 500, fontSize: 14, borderRadius: 8,
                  border: '1px solid rgba(200, 218, 208, 0.3)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// === VIEW: Eingereicht durch Kunde ===
function EingereichtView({ app }) {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ marginBottom: 16 }}><AppIcon name="send" size={48} color="#0F6E56" /></div>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Antrag eingereicht</h2>
        <p style={{ color: '#8AA494', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
          Sie haben Ihren Antrag auf {app.leistung_name} bei der Behörde eingereicht. Die Bearbeitung dauert in der Regel 3–8 Wochen.
        </p>
      </div>

      {/* Hinweis zur Bescheid-Meldung */}
      <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid #A8D8C5' }}>
        <h3 style={{ fontSize: 15, marginBottom: 8, color: '#0F6E56' }}>Wenn Sie einen Bescheid erhalten</h3>
        <p style={{ fontSize: 13, color: '#0F6E56', margin: '0 0 12px', lineHeight: 1.6 }}>
          Sobald die Behörde entschieden hat, erhalten Sie einen Bescheid per Post. Melden Sie sich dann per E-Mail an info@adminpilot.de mit dem Ergebnis – wir aktualisieren dann Ihren Antragsstatus.
        </p>
        {app.plus_package && (
          <p style={{ fontSize: 12, color: '#0F6E56', margin: 0, fontStyle: 'italic' }}>
            <b>Plus-Paket:</b> Auf Wunsch sichten wir Ihren Bescheid auf Vollständigkeit und Plausibilität (keine Rechtsberatung).
          </p>
        )}
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
  const [shipmentSent, setShipmentSent] = useState(false);
  const [confirmingSubmission, setConfirmingSubmission] = useState(false);

  async function loadData() {
    if (!user || !params?.id) return;
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

  useEffect(() => {
    loadData();
  }, [user, params?.id]);

  // Polling: Wenn Status = antrag_wird_erstellt, alle 5 Sekunden nachladen
  useEffect(() => {
    if (!app || app.status !== 'antrag_wird_erstellt') return;
    const iv = setInterval(loadData, 5000);
    return () => clearInterval(iv);
  }, [app?.status, user, params?.id]);

  const handleConfirmSubmission = async (method) => {
    setConfirmingSubmission(true);
    try {
      const res = await fetch('/api/confirm-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: app.id, submission_method: method }),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert('Fehler: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (e) {
      alert('Verbindungsfehler. Bitte erneut versuchen.');
    } finally {
      setConfirmingSubmission(false);
    }
  };

  const handleRequestShipment = async () => {
    try {
      const res = await fetch('/api/request-plus-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: app.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShipmentSent(true);
        await loadData();
      } else {
        alert('Fehler: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (e) {
      alert('Verbindungsfehler. Bitte erneut versuchen.');
    }
  };

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

  // Status-Normalisierung: Legacy-Werte auf neue Werte mappen für die Anzeige
  const effectiveStatus = (() => {
    switch (app.status) {
      case 'signature_pending': return 'antrag_bereit';
      case 'submitted': return 'eingereicht_durch_kunde';
      case 'approved': return 'bewilligt';
      case 'rejected': return 'abgelehnt';
      default: return app.status;
    }
  })();

  const currentStepIdx = STATUS_STEPS.indexOf(effectiveStatus);
  const isAnalysisComplete = effectiveStatus === 'analysis_complete';
  const isAntragWirdErstellt = effectiveStatus === 'antrag_wird_erstellt';
  const isAntragBereit = effectiveStatus === 'antrag_bereit';
  const isEingereicht = effectiveStatus === 'eingereicht_durch_kunde';
  const isApproved = effectiveStatus === 'bewilligt';
  const isRejected = effectiveStatus === 'abgelehnt';

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
            {app.plus_package && <span style={{ marginLeft: 8, padding: '1px 8px', background: '#FFF8E7', color: '#8B6914', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Plus-Paket</span>}
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
        {STATUS_STEPS.slice(0, 8).map((step, i) => (
          <div key={step} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= currentStepIdx ? '#1A3C2B' : '#C8DAD0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* === STATUS: Dokumente hochladen === */}
      {effectiveStatus === 'documents_pending' && (
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
          <NextSteps status={effectiveStatus} />

          {/* CTA */}
          <div style={{
            background: '#1A3C2B', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 24,
          }}>
            <p style={{ color: '#C8DAD0', fontSize: 14, marginBottom: 8 }}>Nächster Schritt</p>
            <h2 style={{ color: '#FFF', fontSize: 22, marginBottom: 4 }}>Antrag jetzt beauftragen</h2>
            <p style={{ color: '#8AA494', fontSize: 14, marginBottom: 20 }}>
              Ab {PRICING.baseFeeLabel}. Geld zurück bei Ablehnung.
            </p>
            <a href={`/app/zahlung/${app.id}`} style={{
              display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
              fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
            }}>
              Jetzt beauftragen →
            </a>
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

      {/* === STATUS: Zahlung offen === */}
      {effectiveStatus === 'payment_pending' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16 }}>
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
            Jetzt bezahlen →
          </a>
        </div>
      )}

      {/* === STATUS: Antrag wird erstellt === */}
      {isAntragWirdErstellt && (
        <>
          <AntragWirdErstelltView />
          <NextSteps status={effectiveStatus} />
        </>
      )}

      {/* === STATUS: Antrag bereit === */}
      {isAntragBereit && (
        <>
          <AntragBereitView
            app={app}
            onConfirmSubmission={handleConfirmSubmission}
            onRequestShipment={handleRequestShipment}
            shipmentSent={shipmentSent}
            confirmingSubmission={confirmingSubmission}
          />
          <NextSteps status={effectiveStatus} />
        </>
      )}

      {/* === STATUS: Eingereicht === */}
      {isEingereicht && (
        <>
          <EingereichtView app={app} />
          <NextSteps status={effectiveStatus} />
        </>
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
            Kontakt aufnehmen
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
