import { useState, useRef } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { triggerOCR, calculateBenefits } from '../../utils/api.js';
import { navigate } from '../../utils/router.jsx';

export default function UploadPage() {
  const { user } = useAppUser();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ step: '', detail: '' });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles).map(f => ({
      file: f, name: f.name, size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      status: 'ready',
    }));
    setFiles(prev => [...prev, ...fileList]);
  };

  const handleUpload = async () => {
    if (!user || !antragId || files.length === 0) return;
    setUploading(true);

    // 1. Alle Dateien parallel hochladen
    setProgress({ step: 'Hochladen', detail: `${files.length} Datei(en) werden hochgeladen...` });
    const uploadPromises = files.map(async (f, i) => {
      try {
        const path = `${user.id}/${antragId}/${Date.now()}_${i}_${f.name}`;
        const { error } = await supabase.storage.from('documents').upload(path, f.file);
        if (!error) {
          const { data: docData } = await supabase.from('documents').insert({
            application_id: antragId, clerk_id: user.id,
            file_name: f.name, file_path: path,
            file_size: f.size, doc_type: 'other', ocr_status: 'pending',
          }).select().single();
          f.status = 'uploaded';
          return docData;
        }
        f.status = 'error';
        return null;
      } catch { f.status = 'error'; return null; }
    });

    const uploadedDocs = (await Promise.all(uploadPromises)).filter(Boolean);
    setFiles([...files]);

    // 2. OCR parallel für alle Dokumente
    setProgress({ step: 'Analyse', detail: 'KI analysiert Ihre Dokumente...' });
    await Promise.all(
      uploadedDocs.map(doc => triggerOCR(doc.id, antragId))
    );

    // 3. Anspruch berechnen
    setProgress({ step: 'Berechnung', detail: 'Anspruch wird berechnet...' });
    await calculateBenefits(antragId);

    setUploading(false);
    navigate(`/app/antrag/${antragId}`);
  };

  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Dokumente hochladen</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Fotografieren oder laden Sie Ihre Dokumente hoch. Unsere KI analysiert sie automatisch.
      </p>

      {uploading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--ap-mint)', borderTop: '3px solid var(--ap-dark)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto var(--space-6)' }} />
          <p style={{ fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-1)', fontSize: 'var(--text-lg)' }}>{progress.step}</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{progress.detail}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            {['Hochladen', 'Analyse', 'Berechnung'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: s === progress.step ? 'var(--ap-dark)' : 'var(--color-text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s === progress.step ? 'var(--ap-gold)' : ['Hochladen', 'Analyse', 'Berechnung'].indexOf(s) < ['Hochladen', 'Analyse', 'Berechnung'].indexOf(progress.step) ? 'var(--ap-dark)' : 'var(--ap-mint)' }} />
                {s}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-6)' }}>Bitte schließen Sie diese Seite nicht.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
              onChange={(e) => handleFiles(e.target.files)} />
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
        </>
      )}
    </>
  );
}
