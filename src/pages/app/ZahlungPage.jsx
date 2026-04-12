import AppIcon from "../../components/shared/AppIcon.jsx";
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { PRICING } from '../../data/siteConfig.js';

export default function ZahlungPage({ params }) {
  const { user } = useAppUser();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !params?.id) return;
    supabase.from('applications').select('*').eq('id', params.id).eq('clerk_id', user.id).single()
      .then(({ data }) => { setApp(data); setLoading(false); });
  }, [user, params?.id]);

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#8AA494' }}>Laden...</div>;
  if (!app) return <div style={{ padding: 48, textAlign: 'center' }}><h2>Antrag nicht gefunden</h2><a href="/app">Dashboard</a></div>;

  const monthlyFee = Math.round(Number(app.estimated_monthly) * PRICING.successFeePercent / 100);

  const handlePayment = async () => {
    setPaying(true);
    setError('');

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: app.id,
          leistung_name: app.leistung_name,
          estimated_monthly: app.estimated_monthly,
        }),
      });

      const data = await res.json();

      if (data.success && data.checkout_url) {
        // Redirect zu Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        setError(data.error || 'Zahlung konnte nicht gestartet werden.');
        setPaying(false);
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      setPaying(false);
    }
  };

  return (
    <>
      <SEOHead title="Antrag beauftragen" noindex />
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <LeistungIcon id={app.leistung_id} size={48} />
          <h1 style={{ fontSize: 22, marginTop: 12, marginBottom: 4 }}>Antrag beauftragen</h1>
          <p style={{ color: '#8AA494', fontSize: 14 }}>{app.leistung_name}</p>
        </div>

        {/* Zusammenfassung */}
        <div style={{ background: '#F8FAF9', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #E2E8E5' }}>
            <span style={{ color: '#8AA494', fontSize: 14 }}>Geschätzter Anspruch</span>
            <span style={{ fontWeight: 600, color: '#E2C044', fontFamily: 'var(--font-mono)', fontSize: 18 }}>~{Number(app.estimated_monthly).toLocaleString('de-DE')} €/Monat</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: '#8AA494' }}>Grundgebühr (einmalig)</span>
            <span style={{ fontWeight: 600, color: '#1A3C2B' }}>{PRICING.baseFeeLabel}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#8AA494' }}>Erfolgsgebühr (nur bei Bewilligung)</span>
            <span style={{ fontWeight: 500, color: '#1A3C2B' }}>~{monthlyFee} €/Mon. (1. Jahr)</span>
          </div>
        </div>

        {/* Heute zu zahlen */}
        <div style={{ background: '#1A3C2B', borderRadius: 12, padding: 24, color: '#FFF', textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: '#8AA494', marginBottom: 4 }}>Heute zu zahlen</p>
          <div style={{ fontSize: 40, fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{PRICING.baseFeeLabel}</div>
          <p style={{ fontSize: 12, color: '#C8DAD0', marginBottom: 0 }}>Geld zurück bei Ablehnung</p>
        </div>

        {/* Was im Preis enthalten ist */}
        <div style={{ marginBottom: 24 }}>
          {[
            'KI-Analyse Ihrer Dokumente',
            'Vollständige Antragserstellung',
            'Digitale Signatur & Einreichung',
            'Status-Tracking per E-Mail',
            'Geld-zurück-Garantie bei Ablehnung',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14 }}>
              <span style={{ color: '#0F6E56', fontWeight: 700 }}>✓</span>
              <span style={{ color: '#2D3A33' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: 12, background: '#FFF5F5', border: '1px solid #E8A3A3', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ color: '#C0392B', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Zahlungsbutton */}
        <button onClick={handlePayment} disabled={paying} style={{
          width: '100%', padding: 16,
          background: paying ? '#C8DAD0' : '#E2C044',
          color: paying ? '#8AA494' : '#1A3C2B',
          fontWeight: 600, fontSize: 16, borderRadius: 8, border: 'none',
          cursor: paying ? 'wait' : 'pointer', marginBottom: 12,
          fontFamily: 'var(--font-body)',
        }}>
          {paying ? 'Weiterleitung zu Stripe...' : `Jetzt sicher bezahlen – ${PRICING.baseFeeLabel} →`}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
          {['Visa', 'Mastercard', 'SEPA'].map(m => (
            <span key={m} style={{ fontSize: 11, color: '#8AA494', padding: '2px 8px', background: '#F8FAF9', borderRadius: 4 }}>{m}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          <AppIcon name="lock" size={14} color="#8AA494" />
          <span style={{ fontSize: 12, color: '#8AA494' }}>Verschlüsselte Zahlung über Stripe. Ihre Daten sind sicher.</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href={`/app/antrag/${app.id}`} style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>← Zurück zur Analyse</a>
        </div>
      </div>
    </>
  );
}
