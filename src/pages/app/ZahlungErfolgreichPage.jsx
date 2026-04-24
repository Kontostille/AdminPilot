import AppIcon from "../../components/shared/AppIcon.jsx";
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function ZahlungErfolgreichPage() {
  const { user } = useAppUser();
  const [status, setStatus] = useState('init'); // init | processing | ready | error
  const [error, setError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');
  const sessionId = params.get('session_id');
  const isPlus = params.get('plus') === '1';

  useEffect(() => {
    if (!user || !antragId) return;
    if (status !== 'init') return;

    async function processPostPayment() {
      setStatus('processing');

      try {
        // 1. Application-Status auf antrag_wird_erstellt setzen + plus_package flag
        // (Webhook macht dasselbe idempotent – parallele Updates sind harmlos)
        await supabase.from('applications').update({
          status: 'antrag_wird_erstellt',
          plus_package: isPlus,
          updated_at: new Date().toISOString(),
        }).eq('id', antragId).in('status', ['analysis_complete', 'payment_pending']);

        // 2. Status-Update für Timeline (nur wenn Webhook es noch nicht getan hat)
        const { data: existing } = await supabase
          .from('status_updates')
          .select('id')
          .eq('application_id', antragId)
          .eq('status', 'antrag_wird_erstellt')
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabase.from('status_updates').insert({
            application_id: antragId,
            status: 'antrag_wird_erstellt',
            message: isPlus
              ? 'Zahlung bestätigt (inkl. Plus-Paket). Ihr Antrag wird jetzt vorbereitet.'
              : 'Zahlung bestätigt. Ihr Antrag wird jetzt vorbereitet.',
          });
        }

        // 3. Antragsgenerierung anstoßen (falls Webhook sie noch nicht angestoßen hat)
        fetch('/api/generate-antrag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ application_id: antragId }),
        }).catch(() => { /* generate-antrag läuft im Hintergrund, Fehler hier egal */ });

        setStatus('ready');

        // Nach 2 Sekunden zum Antrag-Detail weiterleiten
        setTimeout(() => {
          window.location.href = `/app/antrag/${antragId}`;
        }, 2500);
      } catch (e) {
        setError(e.message);
        setStatus('error');
      }
    }

    processPostPayment();
  }, [user, antragId, isPlus, status]);

  return (
    <>
      <SEOHead title="Zahlung erfolgreich" noindex />
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '48px 16px' }}>
        <div style={{ marginBottom: 16 }}><AppIcon name="checkCircle" size={56} color="#0F6E56" /></div>
        <h1 style={{ fontSize: 24, color: '#1A3C2B', marginBottom: 8 }}>Zahlung erfolgreich!</h1>
        <p style={{ color: '#8AA494', marginBottom: 8, lineHeight: 1.6 }}>
          Vielen Dank für Ihre Beauftragung. Die Zahlung wurde erfolgreich bestätigt.
        </p>
        {isPlus && (
          <p style={{ color: '#8B6914', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            Plus-Paket aktiviert – volle Unterstützung inklusive
          </p>
        )}

        {status !== 'error' && (
          <>
            <div style={{
              background: '#F8FAF9', borderRadius: 12, padding: 24, marginTop: 24, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
            }}>
              <div style={{
                width: 28, height: 28, border: '3px solid #C8DAD0',
                borderTopColor: '#1A3C2B', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A3C2B', marginBottom: 2 }}>
                  Ihr Antrag wird vorbereitet
                </div>
                <div style={{ fontSize: 13, color: '#8AA494' }}>
                  Das dauert in der Regel 1–2 Minuten. Sie werden automatisch weitergeleitet.
                </div>
              </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </>
        )}

        {status === 'error' && (
          <div style={{ padding: 12, background: '#FFF5F5', border: '1px solid #E8A3A3', borderRadius: 8, marginBottom: 16, textAlign: 'left' }}>
            <p style={{ color: '#C0392B', fontSize: 13, margin: 0 }}>
              Hinweis: {error || 'Es gab einen kleinen Hänger bei der Verarbeitung. Öffnen Sie Ihren Antrag – er sollte gleich bereit sein.'}
            </p>
          </div>
        )}

        <a href={`/app/antrag/${antragId}`} style={{
          display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
          fontSize: 16, padding: '12px 32px', borderRadius: 8, textDecoration: 'none',
          marginTop: 8,
        }}>
          Zum Antrag →
        </a>

        <div style={{
          marginTop: 32, padding: 16, background: '#F8FAF9', borderRadius: 8,
          fontSize: 12, color: '#8AA494', lineHeight: 1.6,
        }}>
          Eine Bestätigung wurde an Ihre E-Mail gesendet. Bei Fragen wenden Sie sich an info@adminpilot.de.
        </div>
      </div>
    </>
  );
}
