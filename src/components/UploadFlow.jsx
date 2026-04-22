import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../lib/supabase';
import { useApi } from '../lib/api';

const DOC_CATEGORIES_BY_BENEFIT = {
  grundsicherung: [
    { id: 'rentenbescheid', label: 'Rentenbescheid', required: true, hint: 'Aktuelle Mitteilung über Ihre Rente' },
    { id: 'mietvertrag', label: 'Mietvertrag', required: true, hint: 'Oder Eigentumsnachweis' },
    { id: 'kontoauszug', label: 'Kontoauszug', required: true, hint: 'Letzter Monat genügt' },
    { id: 'sonstiges', label: 'Weitere Unterlagen', required: false, hint: 'Falls zusätzliches Einkommen' },
  ],
  wohngeld: [
    { id: 'mietvertrag', label: 'Mietvertrag', required: true, hint: 'Mit aktuellen Nebenkosten' },
    { id: 'einkommensnachweis', label: 'Einkommensnachweis', required: true, hint: 'Gehaltsabrechnung oder Rentenbescheid' },
    { id: 'kontoauszug', label: 'Kontoauszug', required: false, hint: 'Letzter Monat' },
  ],
  pflegegeld: [
    { id: 'versicherungskarte', label: 'Versicherungskarte', required: true, hint: 'Ihre Krankenversicherung' },
    { id: 'pflegegutachten', label: 'Pflegegutachten', required: false, hint: 'Falls schon ein Pflegegrad vorliegt' },
    { id: 'sonstiges', label: 'Arztberichte', required: false, hint: 'Diagnosen, Befunde' },
  ],
};

export default function UploadFlow({ application, onComplete }) {
  const { user } = useUser();
  const supabase = useSupabase();
  const api = useApi();
  const [uploaded, setUploaded] = useState({}); // category -> document_id
  const [uploading, setUploading] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const categories = DOC_CATEGORIES_BY_BENEFIT[application.benefit_type] ?? [];

  async function handleFile(file, category) {
    if (!file || !user) return;
    setUploading(category);

    try {
      // Get user row
      const { data: userRow } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`;
      const path = `${userRow.id}/${application.id}/${filename}`;

      const { error: uploadErr } = await supabase.storage
        .from('user-documents')
        .upload(path, file, { contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { data: doc, error: docErr } = await supabase
        .from('documents')
        .insert({
          user_id: userRow.id,
          application_id: application.id,
          category,
          storage_path: path,
          original_filename: file.name,
          file_size_bytes: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (docErr) throw docErr;

      setUploaded((prev) => ({ ...prev, [category]: doc.id }));

      // Trigger OCR in background (don't await)
      api.analyzeDocument(doc.id).catch(console.error);
    } catch (err) {
      alert(`Upload fehlgeschlagen: ${err.message}`);
    } finally {
      setUploading(null);
    }
  }

  async function proceedToAnalysis() {
    setAnalyzing(true);
    try {
      // Update application status to 'analyzing'
      await supabase
        .from('applications')
        .update({ status: 'analyzing' })
        .eq('id', application.id);

      // Trigger entitlement calculation
      await api.calculateEntitlement(application.id);

      onComplete();
    } catch (err) {
      alert(`Analyse fehlgeschlagen: ${err.message}`);
      setAnalyzing(false);
    }
  }

  const requiredUploaded = categories
    .filter((c) => c.required)
    .every((c) => uploaded[c.id]);

  return (
    <div className="upload-flow">
      <h1 style={{ marginBottom: '0.5rem' }}>Unterlagen hochladen</h1>
      <p style={{ color: 'var(--ap-text-muted)', marginBottom: '2rem' }}>
        Fotografieren Sie Ihre Dokumente mit dem Smartphone oder laden Sie
        PDFs hoch. Ihre Daten sind verschlüsselt gespeichert.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <UploadRow
            key={cat.id}
            category={cat}
            uploaded={!!uploaded[cat.id]}
            uploading={uploading === cat.id}
            onFile={(file) => handleFile(file, cat.id)}
          />
        ))}
      </div>

      <button
        onClick={proceedToAnalysis}
        disabled={!requiredUploaded || analyzing}
        className="btn btn--primary btn--large"
      >
        {analyzing ? 'Analyse läuft …' : 'Analyse starten'}
      </button>

      {!requiredUploaded && (
        <p style={{ marginTop: '1rem', color: 'var(--ap-text-muted)', fontSize: '0.9rem' }}>
          Bitte laden Sie zuerst alle Pflicht-Unterlagen hoch.
        </p>
      )}
    </div>
  );
}

function UploadRow({ category, uploaded, uploading, onFile }) {
  return (
    <div
      style={{
        background: uploaded ? 'var(--ap-light-sage)' : 'var(--ap-white)',
        border: `1px solid ${uploaded ? 'var(--ap-deep-grove)' : 'var(--ap-border)'}`,
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flexGrow: 1, minWidth: 200 }}>
        <p style={{ fontWeight: 500, margin: 0 }}>
          {category.label}
          {category.required && (
            <span style={{ color: 'var(--ap-danger)', marginLeft: '0.3rem' }}>*</span>
          )}
        </p>
        <p style={{ margin: '0.2rem 0 0', color: 'var(--ap-text-muted)', fontSize: '0.9rem' }}>
          {category.hint}
        </p>
      </div>
      {uploaded ? (
        <span style={{ color: 'var(--ap-deep-grove)', fontWeight: 500 }}>
          ✓ Hochgeladen
        </span>
      ) : (
        <label className="btn btn--ghost" style={{ cursor: 'pointer' }}>
          {uploading ? 'Lädt …' : 'Foto oder PDF wählen'}
          <input
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}
