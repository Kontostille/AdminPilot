import { SEOHead } from '../../components/shared/index.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';
import { LEISTUNGEN } from '../../data/leistungen.js';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { navigate } from '../../utils/router.jsx';
import { useState } from 'react';
import { bundeslandFromPLZ, getBundeslandName } from '../../data/bundeslaender.js';

export default function NeuerAntragPage() {
  const { user } = useAppUser();
  const [plz, setPlz] = useState('');
  const bundesland = plz.length === 5 ? bundeslandFromPLZ(plz) : null;

  const handleSelect = async (leistung) => {
    if (!user || !bundesland) return;
    const { data, error } = await supabase
      .from('applications')
      .insert({
        clerk_id: user.id,
        leistung_id: leistung.id,
        leistung_name: leistung.name,
        status: 'documents_pending',
        bundesland: bundesland,
        plz: plz,
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
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Neuen Antrag starten</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Geben Sie zuerst Ihre Postleitzahl ein, dann wählen Sie die Leistung.</p>
      </div>

      {/* PLZ Eingabe */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
        padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)', whiteSpace: 'nowrap' }}>Ihre PLZ:</label>
          <input
            type="text" inputMode="numeric" maxLength={5}
            value={plz} onChange={(e) => setPlz(e.target.value.replace(/\D/g, '').substring(0, 5))}
            placeholder="z.B. 80331"
            style={{
              fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)',
              border: 'none', borderBottom: '2px solid var(--ap-gold)', background: 'transparent',
              width: '7ch', outline: 'none', padding: '4px 2px', textAlign: 'center',
              color: 'var(--ap-dark)', letterSpacing: '0.05em',
            }}
          />
        </div>
        {bundesland && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--ap-mint)', borderRadius: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A3C2B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-dark)' }}>{getBundeslandName(bundesland)}</span>
          </div>
        )}
        {!bundesland && plz.length > 0 && plz.length < 5 && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Bitte 5 Ziffern eingeben</span>
        )}
      </div>

      {/* Leistungen Grid – nur wenn Bundesland erkannt */}
      {bundesland ? (
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
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: 'var(--text-sm)' }}>Bitte geben Sie oben Ihre PLZ ein, um die verfügbaren Leistungen zu sehen.</p>
        </div>
      )}
    </>
  );
}
