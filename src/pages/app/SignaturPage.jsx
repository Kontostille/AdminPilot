import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function SignaturPage({ params }) {
  const { user } = useAppUser();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !params?.id) return;
    supabase.from('applications').select('*').eq('id', params.id).eq('clerk_id', user.id).single()
      .then(({ data }) => { setApp(data); setLoading(false); });
  }, [user, params?.id]);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#8AA494' }}>Laden...</div>;
  if (!app) return <div style={{ padding: 48 }}><h2>Antrag nicht gefunden</h2></div>;

  const handleSign = async () => {
    // TODO: DocuSign / Adobe Sign Integration
    await supabase.from('applications').update({ status: 'submitted', updated_at: new Date().toISOString() }).eq('id', app.id);
    await supabase.from('status_updates').insert({
      application_id: app.id, status: 'submitted',
      message: 'Vollmacht digital unterzeichnet. Antrag wird bei der Behörde eingereicht.',
    });
    window.location.href = `/app/antrag/${app.id}`;
  };

  return (
    <>
      <SEOHead title="Digitale Unterschrift" noindex />
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Vollmacht unterschreiben</h1>
        <p style={{ color: '#8AA494', marginBottom: 24, lineHeight: 1.6 }}>
          Mit Ihrer digitalen Unterschrift beauftragen Sie AdminPilot, den Antrag auf {app.leistung_name} in Ihrem Namen bei der zuständigen Behörde einzureichen.
        </p>

        <div style={{ background: '#F8FAF9', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Die Vollmacht umfasst:</h3>
          {[
            'Erstellung des Antrags auf ' + app.leistung_name,
            'Einreichung bei der zuständigen Behörde',
            'Rückfragen der Behörde beantworten',
            'Status des Antrags erfragen',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 13 }}>
              <span style={{ color: '#1A3C2B' }}>✓</span>
              <span style={{ color: '#2D3A33' }}>{item}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#8AA494', marginTop: 12, marginBottom: 0 }}>
            Die Vollmacht ist auf diesen einen Vorgang beschränkt und erlischt nach Abschluss.
            <a href="/vollmacht" target="_blank" style={{ color: '#8AA494', marginLeft: 4 }}>Mehr erfahren</a>
          </p>
        </div>

        <button onClick={handleSign} style={{
          width: '100%', padding: 16, background: '#1A3C2B', color: '#FFF',
          fontWeight: 600, fontSize: 16, borderRadius: 8, border: 'none',
          cursor: 'pointer', marginBottom: 12,
        }}>
          Digital unterschreiben & einreichen →
        </button>
        <p style={{ fontSize: 11, color: '#8AA494' }}>Qualifizierte Elektronische Signatur (QES) via DocuSign</p>

        <div style={{ marginTop: 16 }}>
          <a href={`/app/antrag/${app.id}`} style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>← Zurück</a>
        </div>
      </div>
    </>
  );
}
