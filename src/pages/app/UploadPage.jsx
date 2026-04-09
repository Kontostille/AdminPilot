import { useState, useRef } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { calculateBenefits } from '../../utils/api.js';
import { compressImage } from '../../utils/imageResize.js';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const { user } = useAppUser();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');
  const savedAntragId = useRef(antragId);

  const handleFiles = (newFiles) => {
    setFiles(prev => [...prev, ...Array.from(newFiles).map(f => ({
      file: f, name: f.name, size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))]);
  };

  const goToResult = () => {
    // Hard navigation – garantiert funktionierend
    window.location.href = `/app/antrag/${savedAntragId.current}`;
  };

  const goToDashboard = () => {
    window.location.href = '/app';
  };

  const handleUpload = async () => {
    if (!user || !savedAntragId.current || files.length === 0) return;
    setUploading(true);
    setError('');
    setPercent(0);

    const total = files.length + 2;
    let step = 0;
    const advance = (label) => { step++; setPercent(Math.round((step / total) * 100)); setStepLabel(label); };

    try {
      advance('Bilder werden komprimiert...');
      const compressed = await Promise.all(files.map(f => compressImage(f.file)));

      const ocrResults = [];
      for (let i = 0; i < compressed.length; i++) {
        advance(`Dokument ${i + 1}/${files.length} wird analysiert...`);
        const compFile = compressed[i];

        // Base64 + OCR parallel mit Storage Upload
        const base64 = await fileToBase64(compFile);
        const mediaType = compFile.type || 'image/jpeg';
        const storagePath = `${user.id}/${savedAntragId.current}/${Date.now()}_${i}_${files[i].name}`;

        const [ocrResult, _storage] = await Promise.all([
          fetch('/api/ocr-analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, media_type: mediaType, file_name: files[i].name }),
          }).then(r => r.json()).catch(e => ({ error: e.message })),
          supabase.storage.from('documents').upload(storagePath, compFile),
        ]);

        await supabase.from('documents').insert({
          application_id: savedAntragId.current, clerk_id: user.id,
          file_name: files[i].name, file_path: storagePath,
          file_size: compFile.size,
          doc_type: ocrResult.doc_type || 'other',
          ocr_status: ocrResult.success ? 'complete' : 'failed',
          ocr_result: ocrResult.success
            ? { doc_type: ocrResult.doc_type, extracted: ocrResult.extracted, processed_at: new Date().toISOString() }
            : { error: ocrResult.error || 'Unknown error' },
        });

        if (ocrResult.success) ocrResults.push(ocrResult);
      }

      advance('Anspruch wird berechnet...');
      await calculateBenefits(savedAntragId.current);

      await supabase.from('status_updates').insert({
        application_id: savedAntragId.current,
        status: 'analysis_complete',
        message: `${ocrResults.length} von ${files.length} Dokument(en) analysiert.`,
      });

      setPercent(100);
      setStepLabel('Analyse abgeschlossen!');
      setDone(true);

    } catch (err) {
      console.error('Upload error:', err);
      setError(`Fehler: ${err.message}`);
      setUploading(false);
    }
  };

  // === DONE STATE ===
  if (done) {
    return (
      <>
        <SEOHead title="Analyse abgeschlossen" noindex />
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <div style={{ fontSize: 56, marginBottom: 'var(--space-4)' }}>✅</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Analyse abgeschlossen!</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', maxWidth: 400, margin: '0 auto var(--space-8)' }}>
            Ihre Dokumente wurden erfolgreich analysiert. Sehen Sie sich jetzt Ihr Ergebnis an.
          </p>
          <button onClick={goToResult} style={{
            background: 'var(--ap-gold)', color: 'var(--ap-dark)', fontWeight: 600,
            fontSize: 'var(--text-lg)', padding: '16px 40px', borderRadius: 'var(--radius-md)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            Ergebnis ansehen →
          </button>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button onClick={goToDashboard} style={{
              background: 'none', border: 'none', color: 'var(--ap-sage)',
              fontSize: 'var(--text-sm)', cursor: 'pointer', textDecoration: 'underline',
              fontFamily: 'var(--font-body)',
            }}>
              Zurück zum Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // === UPLOADING STATE ===
  if (uploading) {
    return (
      <>
        <SEOHead title="Dokumente werden analysiert" noindex />
        <div style={{ padding: 'var(--space-8)' }}>
          <div style={{ background: 'var(--ap-mint)', borderRadius: 'var(--radius-full)', height: 12, overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
            <div style={{ height: '100%', borderRadius: 'var(--radius-full)', background: 'var(--ap-gold)', width: `${percent}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{stepLabel}</span>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--ap-mint)', borderTop: '3px solid var(--ap-dark)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto var(--space-4)' }} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Bitte Seite nicht schließen</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          {error && (
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: '#FFF5F5', borderRadius: 'var(--radius-md)', border: '1px solid #E8A3A3' }}>
              <p style={{ color: '#C0392B', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-3)' }}>{error}</p>
              <button onClick={() => { setUploading(false); setError(''); }} style={{ background: 'none', border: '1px solid #C0392B', color: '#C0392B', padding: '6px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>Erneut versuchen</button>
            </div>
          )}
        </div>
      </>
    );
  }

  // === DEFAULT STATE ===
  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Dokumente hochladen</h1>
      {!antragId && (
        <div style={{ padding: 'var(--space-4)', background: '#FFF5F5', borderRadius: 'var(--radius-md)', border: '1px solid #E8A3A3', marginBottom: 'var(--space-4)' }}>
          <p style={{ color: '#C0392B', margin: 0, fontSize: 'var(--text-sm)' }}>Kein Antrag ausgewählt.</p>
          <button onClick={() => window.location.href = '/app/neuer-antrag'} style={{ marginTop: 8, background: 'none', border: '1px solid #C0392B', color: '#C0392B', padding: '4px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>Neuen Antrag starten →</button>
        </div>
      )}
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Fotografieren oder laden Sie Ihre Dokumente hoch. Unsere KI analysiert sie automatisch.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 'var(--space-10)', textAlign: 'center', cursor: 'pointer',
          border: `2px dashed ${dragOver ? 'var(--ap-dark)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)',
          background: dragOver ? 'var(--ap-mint)' : 'var(--color-bg-card)',
          transition: 'all var(--transition-base)', marginBottom: 'var(--space-3)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 'var(--space-3)', opacity: 0.5 }}>📎</div>
        <p style={{ fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-2)' }}>Dateien hierher ziehen oder klicken</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>JPG, PNG, PDF · max. 10 MB</p>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      <button onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment'; input.onchange = (e) => handleFiles(e.target.files); input.click(); }}
        style={{ width: '100%', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ap-dark)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        📸 Foto aufnehmen
      </button>

      {files.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>{files.length} Datei(en)</h3>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-light)' }}>
              {f.preview && <img src={f.preview} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} alt="" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 18, padding: 4 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleUpload} disabled={files.length === 0 || !antragId} style={{
        width: '100%', padding: '14px', background: files.length > 0 && antragId ? 'var(--ap-gold)' : 'var(--ap-mint)',
        color: files.length > 0 && antragId ? 'var(--ap-dark)' : 'var(--color-text-muted)',
        fontWeight: 600, fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)',
        border: 'none', cursor: files.length > 0 && antragId ? 'pointer' : 'not-allowed',
        fontFamily: 'var(--font-body)',
      }}>
        {files.length} Dokument(e) hochladen & analysieren →
      </button>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
        Geschätzte Dauer: ~10–20 Sekunden pro Dokument
      </p>
    </>
  );
}
