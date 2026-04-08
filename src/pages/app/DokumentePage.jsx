import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function DokumentePage() {
  const { user } = useAppUser();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data } = await supabase.from('documents').select('*, applications(leistung_name)').eq('clerk_id', user.id).order('created_at', { ascending: false });
      setDocs(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <>
      <SEOHead title="Meine Dokumente" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Meine Dokumente</h1>
      {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Laden...</p> :
       docs.length === 0 ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Noch keine Dokumente hochgeladen.</p>
        </div>
       ) : (
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {docs.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{d.file_name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{d.applications?.leistung_name} · {new Date(d.created_at).toLocaleDateString('de-DE')}</div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: d.ocr_status === 'complete' ? '#E1F5EE' : 'var(--color-bg)', color: d.ocr_status === 'complete' ? '#085041' : 'var(--color-text-muted)' }}>
                {d.ocr_status === 'complete' ? 'Erkannt' : d.ocr_status === 'processing' ? 'Wird analysiert...' : 'Ausstehend'}
              </span>
            </div>
          ))}
        </div>
       )}
    </>
  );
}
