import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';

export default function SignaturCallbackPage() {
  const { user } = useAppUser();
  const [status, setStatus] = useState('loading'); // loading | signed | declined | error

  const params = new URLSearchParams(window.location.search);
  const antragId = params.get('antrag');
  const sigStatus = params.get('status');

  useEffect(() => {
    if (!user || !antragId) return;

    async function processCallback() {
      if (sigStatus === 'signed') {
        await supabase.from('applications').update({
          status: 'submitted', updated_at: new Date().toISOString(),
        }).eq('id', antragId);

        await supabase.from('status_updates').insert({
          application_id: antragId, status: 'submitted',
          message: 'Vollmacht digital unterzeichnet. Antrag wird bei der Behörde eingereicht.',
        });

        // Auto-Antrag generieren
        try {
          const { data: docs } = await supabase.from('documents')
            .select('ocr_result').eq('application_id', antragId).eq('ocr_status', 'complete');

          const { data: appData } = await supabase.from('applications')
            .select('leistung_id, leistung_name').eq('id', antragId).single();

          if (docs && docs.length > 0 && appData) {
            const ocrData = docs.map(d => d.ocr_result?.extracted || {});
            await fetch('/api/generate-antrag', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                application_id: antragId,
                leistung_id: appData.leistung_id,
                ocr_data: ocrData,
                user_data: { name: user.fullName, email: user.primaryEmailAddress?.emailAddress },
              }),
            });
          }
        } catch (e) { console.warn('Auto-Antrag generation failed:', e); }

        setStatus('signed');
      } else if (sigStatus === 'declined') {
        setStatus('declined');
      } else {
        setStatus('error');
      }
    }

    processCallback();
  }, [user, antragId, sigStatus]);

  const configs = {
    loading: { icon: '⏳', title: 'Wird verarbeitet...', text: 'Bitte warten.' },
    signed: { icon: '✅', title: 'Vollmacht unterschrieben!', text: 'Ihr Antrag wird jetzt bei der Behörde eingereicht. Wir informieren Sie per E-Mail.' },
    declined: { icon: '❌', title: 'Unterschrift abgelehnt', text: 'Sie haben die Vollmacht nicht unterzeichnet. Sie können es jederzeit erneut versuchen.' },
    error: { icon: '⚠️', title: 'Fehler aufgetreten', text: 'Bei der Verarbeitung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' },
  };

  const cfg = configs[status];

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '48px 16px' }}>
      <SEOHead title={cfg.title} noindex />
      <div style={{ fontSize: 56, marginBottom: 16 }}>{cfg.icon}</div>
      <h1 style={{ fontSize: 24, color: '#1A3C2B', marginBottom: 8 }}>{cfg.title}</h1>
      <p style={{ color: '#8AA494', marginBottom: 32, lineHeight: 1.6 }}>{cfg.text}</p>

      {status === 'signed' && (
        <a href={`/app/antrag/${antragId}`} style={{
          display: 'inline-block', background: '#E2C044', color: '#1A3C2B', fontWeight: 600,
          fontSize: 18, padding: '14px 40px', borderRadius: 8, textDecoration: 'none',
        }}>
          Status ansehen →
        </a>
      )}

      {(status === 'declined' || status === 'error') && antragId && (
        <a href={`/app/signatur/${antragId}`} style={{
          display: 'inline-block', background: '#1A3C2B', color: '#FFF', fontWeight: 600,
          padding: '12px 32px', borderRadius: 8, textDecoration: 'none',
        }}>
          Erneut unterschreiben →
        </a>
      )}

      <div style={{ marginTop: 16 }}>
        <a href="/app" style={{ color: '#8AA494', fontSize: 13, textDecoration: 'underline' }}>Zum Dashboard</a>
      </div>
    </div>
  );
}
