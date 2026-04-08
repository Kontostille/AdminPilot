import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { getLeistungBySlug, LEISTUNGEN } from '../../data/leistungen.js';

const STATUS_STEPS = ['documents_pending', 'analyzing', 'analysis_complete', 'payment_pending', 'signature_pending', 'submitted', 'approved'];
const STATUS_LABELS = {
  draft: 'Entwurf',
  documents_pending: 'Dokumente hochladen',
  analyzing: 'Wird analysiert',
  analysis_complete: 'Analyse fertig',
  payment_pending: 'Zahlung',
  signature_pending: 'Unterschrift',
  submitted: 'Eingereicht',
  approved: 'Bewilligt',
  rejected: 'Abgelehnt',
};

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
        supabase.from('documents').select('*').eq('application_id', params.id),
      ]);
      setApp(appRes.data);
      setUpdates(updRes.data || []);
      setDocuments(docRes.data || []);
      setLoading(false);
    }
    load();
  }, [user, params?.id]);

  if (loading) return <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>Laden...</div>;
  if (!app) return <div style={{ padding: 'var(--space-8)' }}><h2>Antrag nicht gefunden</h2><Button to="/app">Zurück zum Dashboard</Button></div>;

  const leistung = LEISTUNGEN.find(l => l.id === app.leistung_id);
  const currentStepIdx = STATUS_STEPS.indexOf(app.status);

  return (
    <>
      <SEOHead title={`Antrag: ${app.leistung_name}`} noindex />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <LeistungIcon id={app.leistung_id} size={48} />
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>{app.leistung_name}</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 'var(--text-sm)' }}>
            Erstellt am {new Date(app.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>

      {/* Status Stepper */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-8)' }}>
        {STATUS_STEPS.slice(0, 6).map((step, i) => (
          <div key={step} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= currentStepIdx ? 'var(--ap-dark)' : 'var(--ap-mint)',
          }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Current Status Card */}
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Aktueller Status</p>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ap-dark)', marginBottom: 'var(--space-4)' }}>{STATUS_LABELS[app.status]}</p>

          {app.status === 'documents_pending' && (
            <Button variant="primary" to={`/app/upload?antrag=${app.id}`}>Dokumente hochladen →</Button>
          )}
          {app.status === 'analysis_complete' && app.estimated_monthly > 0 && (
            <>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-2)' }}>~{app.estimated_monthly} €/Monat</div>
              <Button variant="primary" to={`/app/zahlung/${app.id}`}>Antrag beauftragen – 49 € →</Button>
            </>
          )}
        </div>

        {/* Required Documents */}
        {leistung && (
          <div style={{ padding: 'var(--space-5)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>Benötigte Dokumente</p>
            {leistung.requiredDocs.map((doc, i) => {
              const uploaded = documents.find(d => d.doc_type === doc.toLowerCase().replace(/[^a-z]/g, '_'));
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: uploaded ? 'var(--ap-success, #27AE60)' : 'var(--ap-mint)', fontWeight: 700 }}>{uploaded ? '✓' : '○'}</span>
                  <span>{doc}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline */}
      {updates.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Verlauf</h3>
          <div style={{ borderLeft: '2px solid var(--ap-mint)', paddingLeft: 'var(--space-5)' }}>
            {updates.map((u, i) => (
              <div key={u.id} style={{ marginBottom: 'var(--space-4)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--ap-dark)' : 'var(--ap-mint)' }} />
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)', margin: 0 }}>{STATUS_LABELS[u.status] || u.status}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{u.message}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{new Date(u.created_at).toLocaleString('de-DE')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
