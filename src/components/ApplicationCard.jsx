import { Link } from 'react-router-dom';

const BENEFIT_LABELS = {
  grundsicherung: 'Grundsicherung im Alter',
  wohngeld: 'Wohngeld',
  pflegegeld: 'Pflegegeld',
};

const STATUS_LABELS = {
  draft: { label: 'Entwurf', cls: 'status--draft' },
  analyzing: { label: 'Analyse läuft', cls: 'status--processing' },
  analyzed: { label: 'Analyse fertig', cls: 'status--paid' },
  paid: { label: 'Bezahlt', cls: 'status--paid' },
  filling: { label: 'Beim Ausfüllen', cls: 'status--processing' },
  ready_to_submit: { label: 'Bereit zur Einreichung', cls: 'status--paid' },
  submitted: { label: 'Eingereicht', cls: 'status--submitted' },
  processing: { label: 'In Bearbeitung', cls: 'status--submitted' },
  approved: { label: 'Bewilligt', cls: 'status--approved' },
  rejected: { label: 'Abgelehnt', cls: 'status--rejected' },
  refunded: { label: 'Erstattet', cls: 'status--draft' },
};

export default function ApplicationCard({ application }) {
  const s = STATUS_LABELS[application.status] ?? { label: application.status, cls: 'status--draft' };
  const createdAt = new Date(application.created_at).toLocaleDateString('de-DE');

  return (
    <Link
      to={`/app/antrag/${application.id}`}
      className="application-card"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div>
        <h3 style={{ marginBottom: '0.3rem' }}>
          {BENEFIT_LABELS[application.benefit_type] ?? application.benefit_type}
        </h3>
        <p style={{ color: 'var(--ap-text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Angelegt am {createdAt}
          {application.estimated_amount_monthly ? (
            <>
              {' '}&middot; Geschätzter Anspruch:{' '}
              <strong>
                {Math.round(application.estimated_amount_monthly)} &euro; pro Monat
              </strong>
              <span style={{ opacity: 0.7 }}> (unverbindlich)</span>
            </>
          ) : null}
        </p>
      </div>
      <div>
        <span className={`application-card__status ${s.cls}`}>{s.label}</span>
      </div>
    </Link>
  );
}
