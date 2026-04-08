import { useState, useRef } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { navigate } from '../../utils/router.jsx';

export default function UploadPage() {
  const { user } = useAppUser();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // Get antrag ID from URL query
  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles).map(f => ({
      file: f,
      name: f.name,
      size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      status: 'ready',
    }));
    setFiles(prev => [...prev, ...fileList]);
  };

  const handleUpload = async () => {
    if (!user || !antragId || files.length === 0) return;
    setUploading(true);

    for (const f of files) {
      try {
        const path = `${user.id}/${antragId}/${Date.now()}_${f.name}`;
        const { error } = await supabase.storage
          .from('documents')
          .upload(path, f.file);

        if (!error) {
          await supabase.from('documents').insert({
            application_id: antragId,
            clerk_id: user.id,
            file_name: f.name,
            file_path: path,
            file_size: f.size,
            doc_type: 'other',
            ocr_status: 'pending',
          });
          f.status = 'uploaded';
        } else {
          f.status = 'error';
        }
      } catch (err) {
        f.status = 'error';
      }
    }

    // Update application status
    await supabase.from('applications').update({ status: 'analyzing' }).eq('id', antragId);
    await supabase.from('status_updates').insert({
      application_id: antragId,
      status: 'analyzing',
      message: `${files.length} Dokument(e) hochgeladen. Analyse wird gestartet.`,
    });

    setUploading(false);
    navigate(`/app/antrag/${antragId}`);
  };

  return (
    <>
      <SEOHead title="Dokumente hochladen" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Dokumente hochladen</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Fotografieren Sie Ihre Dokumente oder laden Sie PDF-Dateien hoch.</p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 'var(--space-10)', textAlign: 'center',
          border: `2px dashed ${dragOver ? 'var(--ap-dark)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)', cursor: 'pointer',
          background: dragOver ? 'var(--ap-mint)' : 'var(--color-bg-card)',
          transition: 'all var(--transition-base)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 'var(--space-3)', opacity: 0.5 }}>📎</div>
        <p style={{ fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-2)' }}>Dateien hierher ziehen oder klicken</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>JPG, PNG, PDF · max. 10 MB pro Datei</p>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {/* Camera Button for Mobile */}
      <button onClick={() => { fileRef.current.setAttribute('capture', 'environment'); fileRef.current.click(); }}
        style={{
          width: '100%', padding: 'var(--space-4)', marginBottom: 'var(--space-6)',
          background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)', color: 'var(--ap-dark)', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        📸 Foto aufnehmen
      </button>

      {/* File List */}
      {files.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>{files.length} Datei(en) ausgewählt</h3>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-light)',
            }}>
              {f.preview && <img src={f.preview} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} alt="" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: f.status === 'uploaded' ? 'var(--ap-success, #27AE60)' : f.status === 'error' ? 'var(--ap-error)' : 'var(--color-text-muted)' }}>
                {f.status === 'uploaded' ? '✓' : f.status === 'error' ? '✗' : '○'}
              </span>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <Button variant="primary" fullWidth onClick={handleUpload} disabled={files.length === 0 || uploading}>
        {uploading ? 'Wird hochgeladen...' : `${files.length} Dokument(e) hochladen →`}
      </Button>
    </>
  );
}
