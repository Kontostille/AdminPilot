import { useState, useRef, useCallback } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { compressImage } from '../../utils/imageResize.js';

/*
  State Machine:
  idle → uploading → analyzing → calculating → done
                                                  ↘ error (kann von überall kommen)
  
  Jede Phase fängt eigene Fehler ab.
  Upload schlägt nie fehl (Supabase Storage ist schnell).
  OCR kann fehlschlagen → Dokument wird als 'pending' gespeichert, Flow geht weiter.
  Calculate kann fehlschlagen → Ergebnis trotzdem zeigen.
*/

const PHASES = {
  idle: 'idle',
  uploading: 'uploading',
  analyzing: 'analyzing',
  calculating: 'calculating',
  done: 'done',
  error: 'error',
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
    reader.readAsDataURL(file);
  });
}

// === PROGRESS SCREEN ===
function ProgressScreen({ phase, percent, stepLabel, ocrSuccessCount, ocrTotalCount }) {
  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 500, margin: '0 auto' }}>
      {/* Progress Bar */}
      <div style={{ background: 'var(--ap-mint)', borderRadius: 100, height: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: '100%', borderRadius: 100, background: 'var(--ap-gold)', width: `${percent}%`, transition: 'width 0.4s ease-out' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        <span style={{ fontSize: 14, color: '#8AA494' }}>{stepLabel}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1A3C2B', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
      </div>

      {/* Phase Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        {[
          { key: 'uploading', label: 'Hochladen' },
          { key: 'analyzing', label: 'KI-Analyse' },
          { key: 'calculating', label: 'Berechnung' },
        ].map(({ key, label }) => {
          const order = ['uploading', 'analyzing', 'calculating'];
          const currentIdx = order.indexOf(phase);
          const thisIdx = order.indexOf(key);
          const isDone = thisIdx < currentIdx;
          const isCurrent = key === phase;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: isDone ? '#1A3C2B' : isCurrent ? '#E2C044' : '#C8DAD0',
              }} />
              <span style={{ color: isCurrent ? '#1A3C2B' : '#8AA494', fontWeight: isCurrent ? 600 : 400 }}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Spinner */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #C8DAD0', borderTopColor: '#1A3C2B',
          borderRadius: '50%', margin: '0 auto 16px',
          animation: 'apspin 0.7s linear infinite',
        }} />
        <p style={{ fontSize: 12, color: '#8AA494' }}>Bitte Seite nicht schließen</p>
      </div>
      <style>{`@keyframes apspin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// === DONE SCREEN ===
function DoneScreen({ antragId, ocrSuccessCount, totalFiles }) {
  const allSuccess = ocrSuccessCount === totalFiles;
  return (
    <div style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{allSuccess ? '✅' : '⚠️'}</div>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1A3C2B', marginBottom: 8 }}>
        {allSuccess ? 'Analyse abgeschlossen!' : 'Upload abgeschlossen'}
      </h2>
      <p style={{ color: '#8AA494', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
        {allSuccess
          ? 'Ihre Dokumente wurden erfolgreich analysiert. Sehen Sie sich jetzt Ihr Ergebnis an.'
          : `${ocrSuccessCount} von ${totalFiles} Dokument(en) konnten analysiert werden. Sie können die Analyse später erneut starten.`
        }
      </p>
      <a href={`/app/antrag/${antragId}`} style={{
        display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
        fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
        fontFamily: 'var(--font-body)',
      }}>
        Ergebnis ansehen →
      </a>
      <div style={{ marginTop: 16 }}>
        <a href="/app" style={{ color: '#8AA494', fontSize: 14, textDecoration: 'underline' }}>
          Zurück zum Dashboard
        </a>
      </div>
    </div>
  );
}

// === ERROR SCREEN ===
function ErrorScreen({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <h2 style={{ fontSize: 20, color: '#1A3C2B', marginBottom: 8 }}>Etwas ist schiefgelaufen</h2>
      <p style={{ color: '#8AA494', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
      <button onClick={onRetry} style={{
        background: '#1A3C2B', color: '#FFF', padding: '12px 32px', borderRadius: 8,
        border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
        fontFamily: 'var(--font-body)',
      }}>
        Erneut versuchen
      </button>
      <div style={{ marginTop: 12 }}>
        <a href="/app" style={{ color: '#8AA494', fontSize: 14, textDecoration: 'underline' }}>Zum Dashboard</a>
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===
export default function UploadPage() {
  const { user } = useAppUser();
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState(PHASES.idle);
  const [percent, setPercent] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [ocrSuccessCount, setOcrSuccessCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // AntragId aus URL lesen und in ref speichern (überlebt Re-Renders)
  const antragIdFromUrl = new URLSearchParams(window.location.search).get('antrag');
  const antragIdRef = useRef(antragIdFromUrl);

  const handleFiles = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...Array.from(newFiles).map(f => ({
      file: f, name: f.name, size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))]);
  }, []);

  const handleUpload = async () => {
    const aid = antragIdRef.current;
    if (!user || !aid || files.length === 0) return;

    const totalSteps = 1 + files.length + 1; // compress + N×OCR + calculate
    let currentStep = 0;
    const advance = (label) => {
      currentStep++;
      setPercent(Math.min(99, Math.round((currentStep / totalSteps) * 100)));
      setStepLabel(label);
    };

    try {
      // === PHASE 1: Upload ===
      setPhase(PHASES.uploading);
      advance('Bilder werden komprimiert & hochgeladen...');

      const compressed = await Promise.all(files.map(f => compressImage(f.file)));
      const uploadedDocs = [];

      for (let i = 0; i < compressed.length; i++) {
        const compFile = compressed[i];
        const storagePath = `${user.id}/${aid}/${Date.now()}_${i}_${files[i].name}`;

        // Upload zu Supabase Storage
        const { error: storageErr } = await supabase.storage.from('documents').upload(storagePath, compFile);

        if (!storageErr) {
          // Dokument-Record in DB erstellen
          const { data: docRecord } = await supabase.from('documents').insert({
            application_id: aid, clerk_id: user.id,
            file_name: files[i].name, file_path: storagePath,
            file_size: compFile.size, doc_type: 'other', ocr_status: 'pending',
            ocr_result: {},
          }).select('id').single();

          if (docRecord) {
            uploadedDocs.push({ id: docRecord.id, file: compFile, name: files[i].name });
          }
        }
      }

      if (uploadedDocs.length === 0) {
        throw new Error('Keine Dateien konnten hochgeladen werden. Bitte prüfen Sie Ihre Internetverbindung.');
      }

      // Antrag-Status aktualisieren
      await supabase.from('applications').update({ status: 'analyzing' }).eq('id', aid);

      // === PHASE 2: OCR Analyse ===
      setPhase(PHASES.analyzing);
      let successCount = 0;

      for (let i = 0; i < uploadedDocs.length; i++) {
        const doc = uploadedDocs[i];
        advance(`KI analysiert ${doc.name} (${i + 1}/${uploadedDocs.length})...`);

        try {
          const base64 = await fileToBase64(doc.file);
          const mediaType = doc.file.type || 'image/jpeg';

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 28000); // 28s timeout clientseitig

          const ocrRes = await fetch('/api/ocr-analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, media_type: mediaType, file_name: doc.name }),
            signal: controller.signal,
          });

          clearTimeout(timeout);
          const ocrData = await ocrRes.json();

          if (ocrData.success) {
            // OCR erfolgreich → Dokument updaten
            await supabase.from('documents').update({
              doc_type: ocrData.doc_type || 'other',
              ocr_status: 'complete',
              ocr_result: { doc_type: ocrData.doc_type, extracted: ocrData.extracted, processed_at: new Date().toISOString() },
            }).eq('id', doc.id);
            successCount++;
          } else {
            // OCR fehlgeschlagen → als failed markieren, aber weitermachen
            await supabase.from('documents').update({
              ocr_status: 'failed',
              ocr_result: { error: ocrData.error || 'OCR failed' },
            }).eq('id', doc.id);
          }
        } catch (ocrErr) {
          // Timeout oder Netzwerkfehler → als failed markieren, aber weitermachen
          console.warn(`OCR failed for ${doc.name}:`, ocrErr.message);
          await supabase.from('documents').update({
            ocr_status: 'failed',
            ocr_result: { error: ocrErr.name === 'AbortError' ? 'Timeout (zu langsam)' : ocrErr.message },
          }).eq('id', doc.id);
        }
      }

      setOcrSuccessCount(successCount);

      // === PHASE 3: Berechnung ===
      setPhase(PHASES.calculating);
      advance('Anspruch wird berechnet...');

      if (successCount > 0) {
        try {
          await fetch('/api/calculate-benefits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: aid }),
          });
        } catch (calcErr) {
          console.warn('Calculation failed:', calcErr.message);
          // Nicht schlimm – Antrag existiert trotzdem
        }
      } else {
        // Keine OCR-Daten → Status trotzdem updaten
        await supabase.from('applications').update({ status: 'analysis_complete', estimated_monthly: 0, confidence: 'niedrig' }).eq('id', aid);
      }

      // Status-Update
      await supabase.from('status_updates').insert({
        application_id: aid,
        status: 'analysis_complete',
        message: `${successCount} von ${uploadedDocs.length} Dokument(en) analysiert.`,
      }).catch(() => {}); // Ignoriere Fehler

      setPercent(100);
      setPhase(PHASES.done);

    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setPhase(PHASES.error);
    }
  };

  const resetToIdle = () => {
    setPhase(PHASES.idle);
    setPercent(0);
    setStepLabel('');
    setErrorMsg('');
    setOcrSuccessCount(0);
  };

  // === RENDER ===

  if (phase === PHASES.done) {
    return (
      <>
        <SEOHead title="Analyse abgeschlossen" noindex />
        <DoneScreen antragId={antragIdRef.current} ocrSuccessCount={ocrSuccessCount} totalFiles={files.length} />
      </>
    );
  }

  if (phase === PHASES.error) {
    return (
      <>
        <SEOHead title="Fehler" noindex />
        <ErrorScreen message={errorMsg} onRetry={resetToIdle} />
      </>
    );
  }

  if (phase !== PHASES.idle) {
    return (
      <>
        <SEOHead title="Dokumente werden analysiert" noindex />
        <ProgressScreen phase={phase} percent={percent} stepLabel={stepLabel} ocrSuccessCount={ocrSuccessCount} ocrTotalCount={files.length} />
      </>
    );
  }

  // === IDLE: Upload Form ===
  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1A3C2B', marginBottom: 8 }}>Dokumente hochladen</h1>

      {!antragIdFromUrl && (
        <div style={{ padding: 16, background: '#FFF5F5', borderRadius: 8, border: '1px solid #E8A3A3', marginBottom: 16 }}>
          <p style={{ color: '#C0392B', margin: 0, fontSize: 14 }}>Kein Antrag ausgewählt.</p>
          <a href="/app/neuer-antrag" style={{ display: 'inline-block', marginTop: 8, color: '#C0392B', fontSize: 14, fontWeight: 600 }}>Neuen Antrag starten →</a>
        </div>
      )}

      <p style={{ color: '#8AA494', marginBottom: 24 }}>
        Fotografieren oder laden Sie Ihre Dokumente hoch. Unsere KI analysiert sie automatisch.
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 48, textAlign: 'center', cursor: 'pointer',
          border: `2px dashed ${dragOver ? '#1A3C2B' : '#E2E8E5'}`,
          borderRadius: 12, background: dragOver ? '#C8DAD0' : '#FFF',
          transition: 'all 0.2s', marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📎</div>
        <p style={{ fontWeight: 600, color: '#1A3C2B', marginBottom: 4 }}>Dateien hierher ziehen oder klicken</p>
        <p style={{ fontSize: 14, color: '#8AA494' }}>JPG, PNG, PDF · max. 10 MB</p>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      {/* Camera */}
      <button onClick={() => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
        input.onchange = (e) => handleFiles(e.target.files);
        input.click();
      }} style={{
        width: '100%', padding: 14, marginBottom: 24, background: '#FFF',
        border: '1px solid #E2E8E5', borderRadius: 8, cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontSize: 16, color: '#1A3C2B', fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        📸 Foto aufnehmen
      </button>

      {/* File List */}
      {files.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1A3C2B' }}>{files.length} Datei(en)</h3>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12,
              borderBottom: '1px solid #F0F3F1',
            }}>
              {f.preview && <img src={f.preview} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} alt="" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: '#8AA494' }}>{(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{
                background: 'none', border: 'none', color: '#8AA494', cursor: 'pointer', fontSize: 18, padding: 4,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || !antragIdFromUrl}
        style={{
          width: '100%', padding: 16,
          background: files.length > 0 && antragIdFromUrl ? '#E2C044' : '#C8DAD0',
          color: files.length > 0 && antragIdFromUrl ? '#1A3C2B' : '#8AA494',
          fontWeight: 600, fontSize: 16, borderRadius: 8,
          border: 'none', fontFamily: 'var(--font-body)',
          cursor: files.length > 0 && antragIdFromUrl ? 'pointer' : 'not-allowed',
        }}
      >
        {files.length} Dokument(e) hochladen & analysieren →
      </button>
      <p style={{ fontSize: 12, color: '#8AA494', textAlign: 'center', marginTop: 12 }}>
        Geschätzte Dauer: ~15–30 Sekunden
      </p>
    </>
  );
}
