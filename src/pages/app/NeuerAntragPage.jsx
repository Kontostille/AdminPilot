import { SEOHead } from '../../components/shared/index.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { LEISTUNGEN } from '../../data/leistungen.js';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { navigate } from '../../utils/router.jsx';

export default function NeuerAntragPage() {
  const { user } = useAppUser();

  const handleSelect = async (leistung) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('applications')
      .insert({
        clerk_id: user.id,
        leistung_id: leistung.id,
        leistung_name: leistung.name,
        status: 'documents_pending',
      })
      .select()
      .single();

    if (data) {
      // Status-Update erstellen
      await supabase.from('status_updates').insert({
        application_id: data.id,
        status: 'documents_pending',
        message: `Antrag für ${leistung.name} erstellt. Bitte laden Sie Ihre Dokumente hoch.`,
      });
      navigate(`/app/antrag/${data.id}`);
    } else {
      console.error('Error creating application:', error);
    }
  };

  return (
    <>
      <SEOHead title="Neuer Antrag" noindex />
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Neuen Antrag starten</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Wählen Sie die Leistung, die Sie beantragen möchten.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
        {LEISTUNGEN.map((l) => (
          <button key={l.id} onClick={() => handleSelect(l)} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            padding: 'var(--space-5)', background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
            transition: 'all var(--transition-base)', width: '100%',
          }}>
            <LeistungIcon id={l.id} size={44} />
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-dark)' }}>{l.name}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>{l.description}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)', fontWeight: 400, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{l.estimateRange}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
