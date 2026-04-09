import { useState, useRef } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { calculateBenefits } from '../../utils/api.js';
import { navigate } from '../../utils/router.jsx';
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
  const antragIdRef = useRef(antragId); // Backup falls URL sich ändert

  const handleFiles = (newFiles) => {
    setFiles(prev => [...prev, ...Array.from(newFiles).map(f => ({
      file: f, name: f.name, size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }))]);
  };

  const handleUpload = async () => {
    if (!user || !antragId || files.length === 0) return;
    setUploading(true);
    setError('');
    setPercent(0);

    const totalSteps = files.length + 2; // compress + OCR per file + calculate
    let currentStep = 0;

    const updateProgress = (label) => {
      currentStep++;
      setPercent(Math.round((currentStep / totalSteps) * 100));
      setStepLabel(label);
    };

    try {
      // 1. Bilder komprimieren
      updateProgress('Bilder werden komprimiert...');
      const compressed = await Promise.all(files.map(f => compressImage(f.file)));

      // 2. Parallel: Supabase Storage Upload + OCR
      const ocrResults = [];
      
      for (let i = 0; i < compressed.length; i++) {
        const f = files[i];
        const compFile = compressed[i];
        updateProgress(`Dokument ${i + 1}/${files.length}: ${f.name} wird analysiert...`);

        // Base64 für OCR vorbereiten
        const base64 = await fileToBase64(compFile);
        const mediaType = compFile.type || 'image/jpeg';

        // OCR direkt aufrufen (Base64 vom Browser → API → Claude)
        const ocrPromise = fetch('/api/ocr-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, media_type: mediaType, file_name: f.name }),
        }).then(r => r.json()).catch(err => ({ error: err.message }));

        // Gleichzeitig in Supabase Storage speichern
        const storagePath = `${user.id}/${antragId}/${Date.now()}_${i}_${f.name}`;
        const storagePromise = supabase.storage.from('documents').upload(storagePath, compFile);

        const [ocrResult, storageResult] = await Promise.all([ocrPromise, storagePromise]);

        // Dokument in DB speichern
        const docType = ocrResult.doc_type || 'other';
        await supabase.from('documents').insert({
          application_id: antragId, clerk_id: user.id,
          file_name: f.name, file_path: storagePath,
          file_size: compFile.size, doc_type: docType,
          ocr_status: ocrResult.success ? 'complete' : 'failed',
          ocr_result: ocrResult.success ? { doc_type: docType, extracted: ocrResult.extracted, processed_at: new Date().toISOString() } : { error: ocrResult.error },
        });

        if (ocrResult.success) ocrResults.push(ocrResult);
      }

      // 3. Anspruch berechnen
      updateProgress('Anspruch wird berechnet...');
      await calculateBenefits(antragId);

      // Status aktualisieren
      await supabase.from('status_updates').insert({
        application_id: antragId,
        status: 'analysis_complete',
        message: `${ocrResults.length} von ${files.length} Dokument(en) erfolgreich analysiert.`,
      });

      setPercent(100);
      setStepLabel('Analyse abgeschlossen!');
      setDone(true);

    } catch (err) {
      console.error('Upload error:', err);
      setError(`Fehler: ${err.message}. Bitte versuchen Sie es erneut.`);
      setUploading(false);
    }
  };

  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Dokumente hochladen</h1>
      {!antragId && (
        <div style={{ padding: 'var(--space-6)', background: '#FFF5F5', borderRadius: 'var(--radius-md)', border: '1px solid #E8A3A3', marginBottom: 'var(--space-4)' }}>
          <p style={{ color: 'var(--ap-error, #C0392B)', margin: 0 }}>Kein Antrag ausgewählt. Bitte starten Sie einen neuen Antrag.</p>
          <Button variant="ghost" size="small" to="/app/neuer-antrag" style={{ marginTop: 'var(--space-3)' }}>Neuen Antrag starten →</Button>
        </div>
      )}
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Fotografieren oder laden Sie Ihre Dokumente hoch. Unsere KI analysiert sie automatisch.
      </p>

      {uploading ? (
        <div style={{ padding: 'var(--space-8)' }}>
          {/* Progress Bar */}
          <div style={{ background: 'var(--ap-mint)', borderRadius: 'var(--radius-full)', height: 12, overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)',
              background: percent === 100 ? 'var(--ap-dark)' : 'var(--ap-gold)',
              width: `${percent}%`, transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{stepLabel}</span>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ap-dark)', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
          </div>

          {/* Animated spinner */}
          {percent < 100 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, border: '3px solid var(--ap-mint)',
                borderTop: '3px solid var(--ap-dark)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto var(--space-4)',
              }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Bitte Seite nicht schließen</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {percent === 100 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>✅</div>
              <p style={{ fontWeight: 600, color: 'var(--ap-dark)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>Analyse abgeschlossen!</p>
              <Button variant="primary" size="large" to={`/app/antrag/${antragIdRef.current}`}>
                Ergebnis ansehen →
              </Button>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Button variant="ghost" size="small" to="/app">Zurück zum Dashboard</Button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: '#FFF5F5', borderRadius: 'var(--radius-md)', border: '1px solid #E8A3A3' }}>
              <p style={{ color: 'var(--ap-error, #C0392B)', fontSize: 'var(--text-sm)', margin: 0 }}>{error}</p>
              <Button variant="ghost" size="small" onClick={() => { setUploading(false); setError(''); }} style={{ marginTop: 'var(--space-3)' }}>Erneut versuchen</Button>
            </div>
          )}
        </div>
      ) : (
        <>
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
              <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>{files.length} Datei(en) ausgewählt</h3>
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

          <Button variant="primary" fullWidth onClick={handleUpload} disabled={files.length === 0}>
            {files.length} Dokument(e) hochladen & analysieren →
          </Button>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
            Geschätzte Dauer: ~10–20 Sekunden pro Dokument
          </p>
        </>
      )}
    </>
  );
}
