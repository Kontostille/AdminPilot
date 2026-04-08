import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { Link } from '../../utils/router.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';

const STATUS_LABELS = {
  draft: { label: 'Entwurf', color: 'var(--color-text-muted)' },
  documents_pending: { label: 'Dokumente fehlen', color: 'var(--ap-gold)' },
  analyzing: { label: 'Wird analysiert...', color: 'var(--ap-sage)' },
  analysis_complete: { label: 'Analyse fertig', color: 'var(--ap-dark)' },
  payment_pending: { label: 'Zahlung offen', color: 'var(--ap-gold)' },
  signature_pending: { label: 'Unterschrift nötig', color: 'var(--ap-gold)' },
  submitted: { label: 'Eingereicht', color: 'var(--ap-sage)' },
  approved: { label: 'Bewilligt', color: 'var(--ap-success, #27AE60)' },
  rejected: { label: 'Abgelehnt', color: 'var(--ap-error, #C0392B)' },
  cancelled: { label: 'Storniert', color: 'var(--color-text-muted)' },
};

export default function DashboardPage() {
  const { user, profile, loading } = useAppUser();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadApps() {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('clerk_id', user.id)
        .order('created_at', { ascending: false });
      setApplications(data || []);
      setLoadingApps(false);
    }
    loadApps();
  }, [user]);

  if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Laden...</div>;

  const firstName = user?.firstName || profile?.full_name?.split(' ')[0] || 'Hallo';

  return (
    <>
      <SEOHead title="Dashboard" noindex />
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>Willkommen zurück, {firstName}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Hier sehen Sie Ihre Anträge auf einen Blick.</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
        <Button variant="primary" to="/app/neuer-antrag">Neuen Antrag starten →</Button>
        <Button variant="ghost" to="/leistungscheck">Kostenloser Leistungscheck</Button>
      </div>

      {/* Applications */}
      <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Meine Anträge</h2>

      {loadingApps ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Anträge werden geladen...</p>
      ) : applications.length === 0 ? (
        <div style={{
          padding: 'var(--space-10)', textAlign: 'center',
          background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
          border: '2px dashed var(--color-border)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 'var(--space-4)', opacity: 0.4 }}>📋</div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Noch keine Anträge</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Starten Sie Ihren ersten Antrag – in wenigen Minuten.
          </p>
          <Button to="/app/neuer-antrag">Jetzt loslegen →</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {applications.map((app) => {
            const status = STATUS_LABELS[app.status] || STATUS_LABELS.draft;
            return (
              <Link key={app.id} to={`/app/antrag/${app.id}`} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-5)',
                background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)', textDecoration: 'none',
                transition: 'all var(--transition-base)',
              }}>
                <LeistungIcon id={app.leistung_id} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ap-dark)' }}>{app.leistung_name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Erstellt am {new Date(app.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
                {app.estimated_monthly > 0 && (
                  <div style={{ textAlign: 'right', marginRight: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>~{app.estimated_monthly} €</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>/Monat</div>
                  </div>
                )}
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg)', color: status.color,
                }}>
                  {status.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
