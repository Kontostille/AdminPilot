import AppIcon from "../../components/shared/AppIcon.jsx";
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function ZahlungErfolgreichPage() {
  const { user } = useAppUser();
  const [updated, setUpdated] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!user || !antragId || updated) return;

    async function updateStatus() {
      // Status auf signature_pending setzen (nächster Schritt: Unterschrift)
      await supabase.from('applications').update({
        status: 'signature_pending',
        updated_at: new Date().toISOString(),
      }).eq('id', antragId);

      // Payment record erstellen
      await supabase.from('payments').insert({
        application_id: antragId,
        clerk_id: user.id,
        amount: 4900, // Cent
        currency: 'eur',
        status: 'completed',
        stripe_session_id: sessionId || 'unknown',
        payment_type: 'base_fee',
      });

      // Status-Update
      await supabase.from('status_updates').insert({
        application_id: antragId,
        status: 'signature_pending',
        message: 'Zahlung von 49 € erfolgreich. Bitte unterschreiben Sie die Vollmacht, damit wir Ihren Antrag einreichen können.',
      });

      setUpdated(true);
    }

    updateStatus();
  }, [user, antragId]);

  return (
    <>
      <SEOHead title="Zahlung erfolgreich" noindex />
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '48px 16px' }}>
        <div style={{ marginBottom: 16 }}><AppIcon name="checkCircle" size={56} color="#0F6E56" /></div>
        <h1 style={{ fontSize: 24, color: '#1A3C2B', marginBottom: 8 }}>Zahlung erfolgreich!</h1>
        <p style={{ color: '#8AA494', marginBottom: 8, lineHeight: 1.6 }}>
          Vielen Dank für Ihre Beauftragung. Die Grundgebühr von 49 € wurde erfolgreich bezahlt.
        </p>
        <p style={{ color: '#0F6E56', fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
          Nächster Schritt: Vollmacht digital unterschreiben
        </p>

        <a href={`/app/signatur/${antragId}`} style={{
          display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
          fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
        }}>
          Jetzt unterschreiben →
        </a>

        <div style={{ marginTop: 16 }}>
          <a href={`/app/antrag/${antragId}`} style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>
            Später unterschreiben
          </a>
        </div>

        <div style={{
          marginTop: 32, padding: 16, background: '#F8FAF9', borderRadius: 8,
          fontSize: 12, color: '#8AA494', lineHeight: 1.6,
        }}>
          Eine Bestätigung wurde an Ihre E-Mail gesendet.
          Bei Fragen wenden Sie sich an info@adminpilot.de.
        </div>
      </div>
    </>
  );
}
