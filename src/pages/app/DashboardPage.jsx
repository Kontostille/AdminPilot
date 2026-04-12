import AppIcon from '../../components/shared/AppIcon.jsx';
import { useState, useEffect } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { supabase } from '../../utils/supabase.js';
import { Link } from '../../utils/router.jsx';
import LeistungIcon from '../../components/shared/LeistungIcon.jsx';

const STATUS_CONFIG = {
  draft: { label: 'Entwurf', color: '#888780', bg: '#F1EFE8', icon: 'edit' },
  documents_pending: { label: 'Dokumente fehlen', color: '#854F0B', bg: '#FAEEDA', icon: 'clip' },
  analyzing: { label: 'Wird analysiert', color: '#0F6E56', bg: '#E1F5EE', icon: 'search' },
  analysis_complete: { label: 'Analyse fertig', color: '#185FA5', bg: '#E6F1FB', icon: 'check' },
  payment_pending: { label: 'Zahlung offen', color: '#854F0B', bg: '#FAEEDA', icon: 'card' },
  signature_pending: { label: 'Unterschrift nötig', color: '#854F0B', bg: '#FAEEDA', icon: 'sign' },
  submitted: { label: 'Bei Behörde eingereicht', color: '#0F6E56', bg: '#E1F5EE', icon: 'sent' },
  approved: { label: 'Bewilligt', color: '#085041', bg: '#E1F5EE', icon: 'done' },
  rejected: { label: 'Abgelehnt', color: '#791F1F', bg: '#FCEBEB', icon: 'x' },
  cancelled: { label: 'Storniert', color: '#888780', bg: '#F1EFE8', icon: '-' },
};

function StatCard({ value, label, accent }) {
  return (
    <div style={{
      padding: 'var(--space-5)', background: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 'var(--text-3xl)', fontWeight: 700,
        color: accent || 'var(--ap-dark)', fontFamily: 'var(--font-mono)',
      }}>{value}</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ApplicationCard({ app, onDelete }) {
  const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
  const isActionNeeded = ['documents_pending', 'payment_pending', 'signature_pending'].includes(app.status);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Antrag "${app.leistung_name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      onDelete(app.id);
    }
  };

  return (
    <Link to={`/app/antrag/${app.id}`} style={{
      display: 'block', padding: 'var(--space-5)',
      background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
      border: isActionNeeded ? '2px solid var(--ap-gold)' : '1px solid var(--color-border)',
      textDecoration: 'none', transition: 'all var(--transition-base)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <LeistungIcon id={app.leistung_id} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: 'var(--ap-dark)', fontSize: 'var(--text-base)' }}>{app.leistung_name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Erstellt am {new Date(app.created_at).toLocaleDateString('de-DE')}
          </div>
        </div>
        {app.estimated_monthly > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ap-gold)', fontFamily: 'var(--font-mono)' }}>
              ~{Number(app.estimated_monthly).toLocaleString('de-DE')} €
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>pro Monat</div>
          </div>
        )}
        {/* Delete Button */}
        <button onClick={handleDelete} title="Antrag löschen" style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: 'var(--color-text-muted)', fontSize: 16, borderRadius: 'var(--radius-sm)',
          transition: 'color var(--transition-fast)', flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ap-error, #C0392B)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >✕</button>
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--color-border-light)',
      }}>
        <span style={{
          fontSize: 'var(--text-xs)', fontWeight: 600,
          padding: '4px 12px', borderRadius: 'var(--radius-full)',
          background: status.bg, color: status.color,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700 }}>{status.icon === 'check' ? '✓' : status.icon === 'x' ? '✗' : '•'}</span>
          {status.label}
        </span>

        {isActionNeeded && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ap-gold)' }}>
            Aktion erforderlich →
          </span>
        )}
      </div>
    </Link>
  );
}

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

  const deleteApplication = async (appId) => {
    // Dokumente, Status-Updates und Payments werden durch CASCADE gelöscht
    const { error } = await supabase.from('applications').delete().eq('id', appId);
    if (!error) {
      setApplications(prev => prev.filter(a => a.id !== appId));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, border: '3px solid var(--ap-mint)',
          borderTop: '3px solid var(--ap-dark)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto var(--space-4)',
        }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Dashboard wird geladen...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const firstName = user?.firstName || profile?.full_name?.split(' ')[0] || '';
  const greeting = new Date().getHours() < 12 ? 'Guten Morgen' : new Date().getHours() < 18 ? 'Guten Tag' : 'Guten Abend';

  const activeApps = applications.filter(a => !['cancelled', 'rejected'].includes(a.status));
  const approvedApps = applications.filter(a => a.status === 'approved');
  const pendingApps = applications.filter(a => ['documents_pending', 'payment_pending', 'signature_pending'].includes(a.status));
  const totalMonthly = approvedApps.reduce((sum, a) => sum + Number(a.estimated_monthly || 0), 0);

  return (
    <>
      <SEOHead title="Dashboard" noindex />

      {/* Greeting */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
          {greeting}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {applications.length === 0
            ? 'Willkommen bei AdminPilot! Starten Sie Ihren ersten Antrag.'
            : `Sie haben ${activeApps.length} aktive${activeApps.length === 1 ? 'n' : ''} Antrag${activeApps.length !== 1 ? 'e' : ''}.`
          }
        </p>
      </div>

      {/* Stats */}
      {applications.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-3)', marginBottom: 'var(--space-8)',
        }}>
          <StatCard value={activeApps.length} label="Aktive Anträge" />
          <StatCard value={pendingApps.length} label="Aktion nötig" accent={pendingApps.length > 0 ? 'var(--ap-gold)' : undefined} />
          <StatCard value={approvedApps.length} label="Bewilligt" accent={approvedApps.length > 0 ? '#0F6E56' : undefined} />
          <StatCard value={totalMonthly > 0 ? `${totalMonthly.toLocaleString('de-DE')} €` : '—'} label="Monatl. Leistung" accent="var(--ap-gold)" />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', flexWrap: 'wrap',
      }}>
        <Button variant="primary" to="/app/neuer-antrag">
          + Neuen Antrag starten
        </Button>
        {applications.length === 0 && (
          <Button variant="ghost" to="/leistungscheck">
            Kostenloser Leistungscheck
          </Button>
        )}
      </div>

      {/* Applications List */}
      {loadingApps ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Anträge werden geladen...</p>
      ) : applications.length === 0 ? (
        <div style={{
          padding: 'var(--space-12)', textAlign: 'center',
          background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)',
          border: '2px dashed var(--color-border)',
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--ap-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: 16 }}><AppIcon name="clipboard" size={28} color="#8AA494" /></div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Noch keine Anträge</h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>
            Starten Sie Ihren ersten Antrag und finden Sie heraus, welche Leistungen Ihnen möglicherweise zustehen.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button to="/app/neuer-antrag">Antrag starten →</Button>
            <Button variant="ghost" to="/leistungscheck">Erst den Leistungscheck machen</Button>
          </div>
        </div>
      ) : (
        <>
          {/* Aktionen erforderlich */}
          {pendingApps.length > 0 && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ap-gold)' }} />
                Aktion erforderlich
              </h2>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {pendingApps.map(app => <ApplicationCard key={app.id} app={app} onDelete={deleteApplication} />)}
              </div>
            </div>
          )}

          {/* Alle Anträge */}
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>
              {pendingApps.length > 0 ? 'Weitere Anträge' : 'Meine Anträge'}
            </h2>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {applications.filter(a => !pendingApps.includes(a)).map(app => (
                <ApplicationCard key={app.id} app={app} onDelete={deleteApplication} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: 'var(--space-8)', padding: 'var(--space-5)',
        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)', display: 'flex',
        alignItems: 'flex-start', gap: 'var(--space-3)',
      }}>
        <AppIcon name="info" size={16} color="#8AA494" />
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ap-dark)' }}>So funktioniert's:</strong> Wählen Sie eine Leistung, laden Sie Ihre Dokumente hoch, und Ihr möglicher Anspruch wird automatisch geprüft. Bei Beauftragung zahlen Sie einmalig 49 €. Wird der Antrag abgelehnt, erhalten Sie Ihr Geld zurück.
        </div>
      </div>

      {/* Umzugshilfe */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <a href="/umzugshilfe" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-4)',
          background: 'var(--ap-dark)', borderRadius: 'var(--radius-lg)',
          textDecoration: 'none', color: '#FFF',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2C044" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Umzugshilfe</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-mint)' }}>Interaktive Checkliste für Ihren Umzug</div>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-gold)' }}>→</span>
        </a>
      </div>
    </>
  );
}
