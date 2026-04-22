import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../lib/supabase';
import UploadFlow from '../components/UploadFlow';

const BENEFITS = [
  {
    id: 'grundsicherung',
    title: 'Grundsicherung im Alter',
    description:
      'Für Menschen ab Regelaltersgrenze, deren Rente und Einkommen nicht ausreichen.',
  },
  {
    id: 'wohngeld',
    title: 'Wohngeld',
    description:
      'Zuschuss zur Miete oder zu Lasten von selbstgenutztem Wohneigentum.',
  },
  {
    id: 'pflegegeld',
    title: 'Pflegegeld',
    description:
      'Für pflegebedürftige Menschen, die zu Hause gepflegt werden.',
  },
];

export default function NewApplicationPage() {
  const { user } = useUser();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select | upload
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [application, setApplication] = useState(null);
  const [creating, setCreating] = useState(false);

  async function startApplication(benefit_type) {
    if (!user) return;
    setCreating(true);

    // Ensure user row exists (Clerk webhook normally does this, but as fallback)
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .maybeSingle();

    if (!existingUser) {
      await supabase.from('users').insert({
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        full_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      });
    }

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    const { data: app, error } = await supabase
      .from('applications')
      .insert({
        user_id: userRow.id,
        benefit_type,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      alert(`Fehler beim Anlegen: ${error.message}`);
      setCreating(false);
      return;
    }

    await supabase.from('status_events').insert({
      user_id: userRow.id,
      application_id: app.id,
      event_type: 'application_created',
      to_status: 'draft',
      actor: 'user',
      metadata: { benefit_type },
    });

    setApplication(app);
    setSelectedBenefit(benefit_type);
    setStep('upload');
    setCreating(false);
  }

  if (step === 'select') {
    return (
      <main className="dashboard">
        <div className="dashboard__inner" style={{ maxWidth: 800 }}>
          <h1>Für welche Leistung möchten Sie prüfen lassen?</h1>
          <p style={{ color: 'var(--ap-text-muted)', marginBottom: '2rem' }}>
            Die Analyse ist kostenlos. Kosten entstehen erst, wenn Sie den
            kompletten Antrag ausfüllen lassen möchten.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {BENEFITS.map((b) => (
              <button
                key={b.id}
                onClick={() => startApplication(b.id)}
                disabled={creating}
                style={{
                  textAlign: 'left',
                  background: 'var(--ap-white)',
                  border: '1px solid var(--ap-border)',
                  padding: '1.5rem',
                  cursor: creating ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <h3 style={{ marginBottom: '0.3rem' }}>{b.title}</h3>
                <p style={{ margin: 0, color: 'var(--ap-text-muted)' }}>
                  {b.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard__inner" style={{ maxWidth: 800 }}>
        <UploadFlow
          application={application}
          onComplete={() => navigate(`/app/antrag/${application.id}`)}
        />
      </div>
    </main>
  );
}
