import { useState, useRef, useCallback, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { compressImage } from '../../utils/imageResize.js';
import { calculateBenefitsFromDocs } from '../../utils/calculateBenefits.js';
import { LEISTUNGEN } from '../../data/leistungen.js';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const { user } = useAppUser();
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [percent, setPercent] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const [estimatedResult, setEstimatedResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [leistung, setLeistung] = useState(null);
  const fileRef = useRef(null);

  const urlAntragId = new URLSearchParams(window.location.search).get('antrag');
  const antragId = useRef(urlAntragId);

  // Leistung laden um benötigte Dokumente anzuzeigen
  useEffect(() => {
    if (!user || !urlAntragId) return;
    supabase.from('applications').select('leistung_id').eq('id', urlAntragId).single()
      .then(({ data }) => {
        if (data) {
          const l = LEISTUNGEN.find(x => x.id === data.leistung_id);
          setLeistung(l);
        }
      });
  }, [user, urlAntragId]);

  const progressRef = useRef({ step: 0, total: 1 });
  const advance = (label) => {
    progressRef.current.step++;
    setPercent(Math.min(95, Math.round((progressRef.current.step / progressRef.current.total) * 100)));
    setStepLabel(label);
  };

  const handleFiles = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...Array.from(newFiles).map(f => ({
      file: f, name: f.name, size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))]);
  }, []);

  const handleUpload = async () => {
    const aid = antragId.current;
    if (!user || !aid || files.length === 0) return;
    progressRef.current = { step: 0, total: files.length + 2 };

    try {
      setPhase('uploading');
      advance('Bilder werden komprimiert & hochgeladen...');
      const compressed = await Promise.all(files.map(f => compressImage(f.file)));
      const uploadedDocs = [];

      for (let i = 0; i < compressed.length; i++) {
        const storagePath = `${user.id}/${aid}/${Date.now()}_${i}_${files[i].name}`;
        const { error: storageErr } = await supabase.storage.from('documents').upload(storagePath, compressed[i]);
        if (!storageErr) {
          const { data: docRecord } = await supabase.from('documents').insert({
            application_id: aid, clerk_id: user.id, file_name: files[i].name,
            file_path: storagePath, file_size: compressed[i].size,
            doc_type: 'other', ocr_status: 'pending', ocr_result: {},
          }).select('id').single();
          if (docRecord) uploadedDocs.push({ dbId: docRecord.id, compressedFile: compressed[i], name: files[i].name });
        }
      }

      if (uploadedDocs.length === 0) throw new Error('Upload fehlgeschlagen. Bitte Internetverbindung prüfen.');
      await supabase.from('applications').update({ status: 'analyzing' }).eq('id', aid);

      // OCR
      setPhase('analyzing');
      const ocrResults = [];
      for (let i = 0; i < uploadedDocs.length; i++) {
        const doc = uploadedDocs[i];
        advance(`Analyse: ${doc.name} (${i + 1}/${uploadedDocs.length})`);
        try {
          const base64 = await fileToBase64(doc.compressedFile);
          const mediaType = doc.compressedFile.type || 'image/jpeg';
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 28000);
          const response = await fetch('/api/ocr-analyze', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, media_type: mediaType, file_name: doc.name }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          const ocrData = await response.json();
          if (ocrData.success) {
            await supabase.from('documents').update({
              doc_type: ocrData.doc_type || 'other', ocr_status: 'complete',
              ocr_result: { doc_type: ocrData.doc_type, extracted: ocrData.extracted, processed_at: new Date().toISOString() },
            }).eq('id', doc.dbId);
            ocrResults.push(ocrData);
          } else {
            await supabase.from('documents').update({ ocr_status: 'failed', ocr_result: { error: ocrData.error || 'Unknown' } }).eq('id', doc.dbId);
          }
        } catch (ocrErr) {
          await supabase.from('documents').update({ ocr_status: 'failed', ocr_result: { error: ocrErr.name === 'AbortError' ? 'Timeout' : ocrErr.message } }).eq('id', doc.dbId);
        }
      }
      setSuccessCount(ocrResults.length);

      // Berechnung
      setPhase('saving');
      advance('Anspruch wird berechnet...');
      const { data: appData } = await supabase.from('applications').select('leistung_id').eq('id', aid).single();
      let result = { estimated_monthly: 0, confidence: 'niedrig', details: {} };
      if (ocrResults.length > 0 && appData) result = calculateBenefitsFromDocs(appData.leistung_id, ocrResults);
      setEstimatedResult(result);

      await supabase.from('applications').update({
        status: 'analysis_complete', estimated_monthly: result.estimated_monthly,
        confidence: result.confidence, notes: JSON.stringify(result.details), updated_at: new Date().toISOString(),
      }).eq('id', aid);

      await supabase.from('status_updates').insert({
        application_id: aid, status: 'analysis_complete',
        message: ocrResults.length > 0
          ? `${ocrResults.length} Dokument(e) analysiert. Geschätzter Anspruch: ~${result.estimated_monthly} €/Monat.`
          : 'Upload abgeschlossen. Dokumente konnten nicht automatisch analysiert werden.',
      });

      setPercent(100);
      setPhase('done');
    } catch (err) {
      setErrorMsg(err.message || 'Ein Fehler ist aufgetreten.');
      setPhase('error');
    }
  };

  // === DONE ===
  if (phase === 'done') {
    const aid = antragId.current;
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <SEOHead title="Analyse abgeschlossen" noindex />
        <div style={{ fontSize: 56, marginBottom: 16 }}>{successCount > 0 ? '✅' : '⚠️'}</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1A3C2B', marginBottom: 8 }}>
          {successCount > 0 ? 'Analyse abgeschlossen!' : 'Upload abgeschlossen'}
        </h2>
        <p style={{ color: '#8AA494', maxWidth: 420, margin: '0 auto 12px', lineHeight: 1.6 }}>
          {successCount > 0
            ? `${successCount} von ${files.length} Dokument(en) erfolgreich analysiert.`
            : 'Die automatische Analyse konnte nicht abgeschlossen werden. Sie können weitere Dokumente hochladen.'}
        </p>
        {estimatedResult && estimatedResult.estimated_monthly > 0 && (
          <div style={{ fontSize: 36, fontWeight: 700, color: '#E2C044', fontFamily: 'var(--font-mono)', margin: '16px 0' }}>
            ~{estimatedResult.estimated_monthly} €/Monat
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <a href={`/app/antrag/${aid}`} style={{
            display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
            fontSize: 18, padding: '14px 36px', borderRadius: 8, textDecoration: 'none',
          }}>Ergebnis ansehen →</a>
        </div>
        <div style={{ marginTop: 12 }}>
          <a href="/app" style={{ color: '#8AA494', fontSize: 14, textDecoration: 'underline' }}>Zum Dashboard</a>
        </div>
      </div>
    );
  }

  // === ERROR ===
  if (phase === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <SEOHead title="Fehler" noindex />
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontSize: 20, color: '#1A3C2B', marginBottom: 8 }}>Etwas ist schiefgelaufen</h2>
        <p style={{ color: '#8AA494', maxWidth: 400, margin: '0 auto 24px', fontSize: 14 }}>{errorMsg}</p>
        <button onClick={() => { setPhase('idle'); setPercent(0); setErrorMsg(''); }}
          style={{ background: '#1A3C2B', color: '#FFF', padding: '12px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  // === PROGRESS ===
  if (phase !== 'idle') {
    const phases = ['uploading', 'analyzing', 'saving'];
    const phaseLabels = ['Hochladen', 'Analyse', 'Berechnung'];
    const currentIdx = phases.indexOf(phase);
    return (
      <div style={{ padding: 32, maxWidth: 480, margin: '0 auto' }}>
        <SEOHead title="Dokumente werden analysiert" noindex />
        <div style={{ background: '#C8DAD0', borderRadius: 100, height: 12, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: '100%', borderRadius: 100, background: '#E2C044', width: `${percent}%`, transition: 'width 0.5s ease-out' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <span style={{ fontSize: 14, color: '#8AA494' }}>{stepLabel}</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1A3C2B', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          {phases.map((p, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: i < currentIdx ? '#1A3C2B' : i === currentIdx ? '#E2C044' : '#C8DAD0' }} />
              <span style={{ color: i === currentIdx ? '#1A3C2B' : '#8AA494', fontWeight: i === currentIdx ? 600 : 400 }}>{phaseLabels[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #C8DAD0', borderTopColor: '#1A3C2B', borderRadius: '50%', margin: '0 auto 16px', animation: 'apspin 0.7s linear infinite' }} />
          <p style={{ fontSize: 12, color: '#8AA494' }}>Bitte Seite nicht schließen</p>
        </div>
        <style>{`@keyframes apspin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  // === IDLE ===
  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1A3C2B', marginBottom: 8 }}>Dokumente hochladen</h1>

      {!urlAntragId && (
        <div style={{ padding: 16, background: '#FFF5F5', borderRadius: 8, border: '1px solid #E8A3A3', marginBottom: 16 }}>
          <p style={{ color: '#C0392B', margin: 0, fontSize: 14 }}>Kein Antrag ausgewählt.</p>
          <a href="/app/neuer-antrag" style={{ display: 'inline-block', marginTop: 8, color: '#C0392B', fontSize: 14, fontWeight: 600 }}>Neuen Antrag starten →</a>
        </div>
      )}

      <p style={{ color: '#8AA494', marginBottom: 16 }}>
        Fotografieren oder laden Sie Ihre Dokumente hoch. Unsere KI analysiert sie automatisch.
      </p>

      {/* Benötigte Dokumente */}
      {leistung && (
        <div style={{ background: '#F8FAF9', border: '1px solid #E2E8E5', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: '#8AA494', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
            Benötigte Dokumente für {leistung.name}
          </p>
          {leistung.requiredDocs.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 14 }}>
              <span style={{ color: '#C8DAD0', fontSize: 12 }}>○</span>
              <span style={{ color: '#2D3A33' }}>{doc}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#8AA494', marginTop: 10, marginBottom: 0 }}>
            Tipp: Je mehr Dokumente Sie hochladen, desto genauer wird die Berechnung.
          </p>
        </div>
      )}

      {/* Drop Zone */}
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 48, textAlign: 'center', cursor: 'pointer',
          border: `2px dashed ${dragOver ? '#1A3C2B' : '#E2E8E5'}`, borderRadius: 12,
          background: dragOver ? '#C8DAD0' : '#FFF', transition: 'all 0.2s', marginBottom: 12,
        }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📎</div>
        <p style={{ fontWeight: 600, color: '#1A3C2B', marginBottom: 4 }}>Dateien hierher ziehen oder klicken</p>
        <p style={{ fontSize: 14, color: '#8AA494' }}>JPG, PNG, PDF · max. 10 MB</p>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.capture = 'environment'; i.onchange = (e) => handleFiles(e.target.files); i.click(); }}
        style={{ width: '100%', padding: 14, marginBottom: 24, background: '#FFF', border: '1px solid #E2E8E5', borderRadius: 8, cursor: 'pointer', fontSize: 16, color: '#1A3C2B', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        📸 Foto aufnehmen
      </button>

      {files.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, fontSize: 16, color: '#1A3C2B' }}>{files.length} Datei(en)</h3>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: '1px solid #F0F3F1' }}>
              {f.preview && <img src={f.preview} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} alt="" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: '#8AA494' }}>{(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#8AA494', cursor: 'pointer', fontSize: 18, padding: 4 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleUpload} disabled={files.length === 0 || !urlAntragId} style={{
        width: '100%', padding: 16, background: files.length > 0 && urlAntragId ? '#E2C044' : '#C8DAD0',
        color: files.length > 0 && urlAntragId ? '#1A3C2B' : '#8AA494', fontWeight: 600, fontSize: 16,
        borderRadius: 8, border: 'none', cursor: files.length > 0 && urlAntragId ? 'pointer' : 'not-allowed',
      }}>
        {files.length} Dokument(e) hochladen & analysieren →
      </button>
      <p style={{ fontSize: 12, color: '#8AA494', textAlign: 'center', marginTop: 12 }}>Geschätzte Dauer: ~15–30 Sekunden</p>
    </>
  );
}
