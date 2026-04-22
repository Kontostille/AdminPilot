import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../lib/supabase';
import ApplicationCard from '../components/ApplicationCard';

export default function DashboardPage() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    })();
  }, [user, supabase]);

  const active = applications.filter((a) =>
    ['draft', 'analyzing', 'analyzed', 'paid', 'filling', 'ready_to_submit'].includes(a.status)
  );
  const submitted = applications.filter((a) =>
    ['submitted', 'processing'].includes(a.status)
  );
  const decided = applications.filter((a) =>
    ['approved', 'rejected'].includes(a.status)
  );

  return (
    <main className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <h1>Hallo {user?.firstName ?? ''}.</h1>
            <p style={{ color: 'var(--ap-text-muted)' }}>
              Hier sehen Sie den Stand Ihrer Anträge.
            </p>
          </div>
          <Link to="/app/neuer-antrag" className="btn btn--primary">
            Neuen Antrag starten
          </Link>
        </header>

        <section className="dashboard-tiles">
          <div className="dashboard-tile">
            <h3>Aktive Anträge</h3>
            <p className="dashboard-tile__value">{active.length}</p>
          </div>
          <div className="dashboard-tile">
            <h3>Bei der Behörde</h3>
            <p className="dashboard-tile__value">{submitted.length}</p>
          </div>
          <div className="dashboard-tile">
            <h3>Abgeschlossen</h3>
            <p className="dashboard-tile__value">{decided.length}</p>
          </div>
        </section>

        {loading ? (
          <p>Lade Ihre Anträge &hellip;</p>
        ) : applications.length === 0 ? (
          <div className="dashboard__empty" style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--ap-white)' }}>
            <h2>Noch kein Antrag angelegt</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Starten Sie mit einer kostenlosen, unverbindlichen Analyse Ihrer
              Unterlagen.
            </p>
            <Link to="/app/neuer-antrag" className="btn btn--primary btn--large">
              Ersten Antrag anlegen
            </Link>
          </div>
        ) : (
          <section>
            {active.length > 0 && (
              <>
                <h2 style={{ marginBottom: '1rem' }}>Aktive Anträge</h2>
                {active.map((a) => <ApplicationCard key={a.id} application={a} />)}
              </>
            )}
            {submitted.length > 0 && (
              <>
                <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>
                  Bei der Behörde
                </h2>
                {submitted.map((a) => <ApplicationCard key={a.id} application={a} />)}
              </>
            )}
            {decided.length > 0 && (
              <>
                <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>
                  Abgeschlossen
                </h2>
                {decided.map((a) => <ApplicationCard key={a.id} application={a} />)}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
