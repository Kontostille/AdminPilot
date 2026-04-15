import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function SignaturPage({ params }) {
  const { user } = useAppUser();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user || !params?.id) return;
    supabase.from('applications').select('*').eq('id', params.id).eq('clerk_id', user.id).single()
      .then(({ data }) => { setApp(data); setLoading(false); });
  }, [user, params?.id]);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#8AA494' }}>Laden...</div>;
  if (!app) return <div style={{ padding: 48 }}><h2>Antrag nicht gefunden</h2><a href="/app">Dashboard</a></div>;

  const handleSign = async () => {
    setSigning(true);
    setError('');

    try {
      const res = await fetch('/api/create-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: app.id,
          signer_name: user.fullName || user.firstName || 'Nutzer',
          signer_email: user.primaryEmailAddress?.emailAddress || '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.signing_url) {
          // Echte Skribble-Integration: Weiterleitung
          window.location.href = data.signing_url;
        } else {
          // Simulations-Modus: Direkt als unterschrieben markiert
          setDone(true);
        }
      } else {
        setError(data.error || 'Signatur konnte nicht erstellt werden.');
        setSigning(false);
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      setSigning(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '48px 16px' }}>
        <SEOHead title="Vollmacht unterschrieben" noindex />
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 24, color: '#1A3C2B', marginBottom: 8 }}>Vollmacht unterschrieben!</h1>
        <p style={{ color: '#8AA494', marginBottom: 8, lineHeight: 1.6 }}>
          Vielen Dank. Ihr Antrag auf {app.leistung_name} wird jetzt bei der zuständigen Behörde eingereicht.
        </p>
        <p style={{ color: '#0F6E56', fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
          Wir informieren Sie per E-Mail über den Bearbeitungsstand.
        </p>
        <a href={`/app/antrag/${app.id}`} style={{
          display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
          fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
        }}>
          Status ansehen →
        </a>
        <div style={{ marginTop: 16 }}>
          <a href="/app" style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>Zum Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Digitale Unterschrift" noindex />
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1A3C2B" strokeWidth="1.5">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Vollmacht unterschreiben</h1>
        <p style={{ color: '#8AA494', marginBottom: 24, lineHeight: 1.6 }}>
          Mit Ihrer digitalen Unterschrift beauftragen Sie AdminPilot, den Antrag auf <strong style={{ color: '#1A3C2B' }}>{app.leistung_name}</strong> in Ihrem Namen bei der zuständigen Behörde einzureichen.
        </p>

        {/* Was die Vollmacht umfasst */}
        <div style={{ background: '#F8FAF9', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Die Vollmacht umfasst:</h3>
          {[
            'Erstellung des Antrags auf ' + app.leistung_name,
            'Einreichung bei der zuständigen Behörde',
            'Korrespondenz mit der Behörde',
            'Status-Updates an Sie per E-Mail',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ color: '#2D3A33' }}>{item}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#8AA494', marginTop: 12, marginBottom: 0 }}>
            Die Vollmacht ist auf diesen Vorgang beschränkt und erlischt nach Abschluss.
            <a href="/vollmacht" target="_blank" style={{ color: '#8AA494', marginLeft: 4 }}>Details</a>
          </p>
        </div>

        {/* Unterschrift-Details */}
        <div style={{ background: '#F8FAF9', borderRadius: 12, padding: 16, textAlign: 'left', marginBottom: 24, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#8AA494' }}>Unterzeichner</span>
            <span style={{ fontWeight: 600, color: '#1A3C2B' }}>{user.fullName || user.firstName || 'Nutzer'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#8AA494' }}>E-Mail</span>
            <span style={{ fontWeight: 500, color: '#1A3C2B' }}>{user.primaryEmailAddress?.emailAddress || ''}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8AA494' }}>Leistung</span>
            <span style={{ fontWeight: 500, color: '#1A3C2B' }}>{app.leistung_name}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: 12, background: '#FFF5F5', border: '1px solid #E8A3A3', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ color: '#C0392B', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Unterschreiben Button */}
        <button onClick={handleSign} disabled={signing} style={{
          width: '100%', padding: 16, background: signing ? '#C8DAD0' : '#1A3C2B',
          color: '#FFF', fontWeight: 600, fontSize: 16, borderRadius: 8, border: 'none',
          cursor: signing ? 'wait' : 'pointer', fontFamily: 'var(--font-body)', marginBottom: 12,
        }}>
          {signing ? 'Wird vorbereitet...' : 'Jetzt digital unterschreiben →'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8AA494" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{ fontSize: 12, color: '#8AA494' }}>Sichere digitale Signatur. DSGVO-konform.</span>
        </div>

        <a href={`/app/antrag/${app.id}`} style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>← Zurück</a>
      </div>
    </>
  );
}
