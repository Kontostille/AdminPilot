import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSupabase } from '../lib/supabase';
import { useApi } from '../lib/api';

const BENEFIT_LABELS = {
  grundsicherung: 'Grundsicherung im Alter',
  wohngeld: 'Wohngeld',
  pflegegeld: 'Pflegegeld',
};

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const paid = searchParams.get('paid') === '1';
  const cancelled = searchParams.get('cancelled') === '1';

  const supabase = useSupabase();
  const api = useApi();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      setApplication(data);
      setLoading(false);
    })();
  }, [id, supabase, paid]);

  async function startCheckout(packageType) {
    const res = await api.createCheckout(id, packageType);
    window.location.href = res.url;
  }

  async function generatePdf() {
    const res = await api.generatePdf(id);
    setPdfUrl(res.pdf_url ?? null);
    // Reload application to get new status
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    setApplication(data);
  }

  async function confirmSubmission() {
    if (!confirm('Bestätigen Sie, dass Sie den Antrag heute eingereicht haben?')) return;

    const today = new Date().toISOString().slice(0, 10);

    await supabase
      .from('applications')
      .update({
        status: 'submitted',
        submission_date: today,
      })
      .eq('id', id);

    await supabase.from('status_events').insert({
      user_id: application.user_id,
      application_id: id,
      event_type: 'user_confirmed_submission',
      from_status: 'ready_to_submit',
      to_status: 'submitted',
      actor: 'user',
      metadata: { submission_date: today },
    });

    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    setApplication(data);
  }

  if (loading) return <main className="dashboard"><div className="dashboard__inner">Laden &hellip;</div></main>;
  if (!application) return <main className="dashboard"><div className="dashboard__inner">Antrag nicht gefunden.</div></main>;

  return (
    <main className="dashboard">
      <div className="dashboard__inner" style={{ maxWidth: 900 }}>
        <h1>{BENEFIT_LABELS[application.benefit_type]}</h1>
        <p style={{ color: 'var(--ap-text-muted)', marginBottom: '2rem' }}>
          Status: <strong>{application.status}</strong>
        </p>

        {paid && (
          <div style={{ background: 'var(--ap-light-sage)', padding: '1rem 1.5rem', marginBottom: '2rem', borderLeft: '3px solid var(--ap-deep-grove)' }}>
            <strong>Zahlung erfolgreich.</strong> Wir bereiten Ihr Antragspaket vor.
          </div>
        )}
        {cancelled && (
          <div style={{ background: 'var(--ap-amber-light)', padding: '1rem 1.5rem', marginBottom: '2rem', borderLeft: '3px solid var(--ap-amber)' }}>
            Die Zahlung wurde abgebrochen. Sie können den Vorgang jederzeit neu starten.
          </div>
        )}

        {/* Status-abhängige Sektionen */}
        {application.status === 'analyzed' && (
          <EstimateSection application={application} onPay={startCheckout} />
        )}

        {application.status === 'paid' && (
          <PaidNextStepSection application={application} onContinue={generatePdf} />
        )}

        {application.status === 'ready_to_submit' && (
          <SubmissionSection
            application={application}
            pdfUrl={pdfUrl}
            onConfirmSubmission={confirmSubmission}
          />
        )}

        {application.status === 'submitted' || application.status === 'processing' ? (
          <TrackingSection application={application} />
        ) : null}

        {application.status === 'approved' && (
          <ResultSection type="approved" application={application} />
        )}
        {application.status === 'rejected' && (
          <ResultSection type="rejected" application={application} />
        )}
      </div>
    </main>
  );
}

// ----- Section components -----

function EstimateSection({ application, onPay }) {
  const est = application.estimate_calculation ?? {};
  const amount = application.estimated_amount_monthly;

  return (
    <section style={{ background: 'var(--ap-white)', padding: '2rem', marginBottom: '2rem' }}>
      <h2>Unverbindliche Schätzung</h2>
      {amount && amount > 0 ? (
        <>
          <p style={{ fontSize: '1.1rem' }}>
            Nach den von Ihnen übermittelten Unterlagen könnte Ihr Anspruch bei etwa{' '}
            <strong style={{ fontSize: '1.5rem' }}>
              {Math.round(amount)} &euro; pro Monat
            </strong>{' '}
            liegen.
          </p>

          {est.calculation_steps && (
            <details style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                Berechnungsschritte anzeigen
              </summary>
              <ul style={{ marginTop: '0.5rem' }}>
                {est.calculation_steps.map((s, i) => (
                  <li key={i}>
                    {s.label}: <strong>{s.value}</strong>
                    {s.note ? <em style={{ color: 'var(--ap-text-muted)', marginLeft: '0.5rem' }}>({s.note})</em> : null}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div style={{ background: 'var(--ap-amber-light)', padding: '1rem', borderLeft: '3px solid var(--ap-amber)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {est.disclaimer ?? 'Dies ist eine unverbindliche Schätzung.'}
          </div>

          <h3>Möchten Sie den Antrag ausfüllen lassen?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ border: '1px solid var(--ap-border)', padding: '1.5rem' }}>
              <h4>Basis &mdash; 49 &euro;</h4>
              <p>Kompletter Antrag, Anleitung, Checkliste.</p>
              <button className="btn btn--ghost" onClick={() => onPay('basis')}>Basis wählen</button>
            </div>
            <div style={{ border: '2px solid var(--ap-dark-forest)', padding: '1.5rem' }}>
              <h4>Plus &mdash; 78 &euro;</h4>
              <p>Alles aus Basis + frankierter Umschlag + Erinnerungen + Nachforderungs-Hilfe.</p>
              <button className="btn btn--primary" onClick={() => onPay('plus')}>Plus wählen</button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p>
            Nach unserer Analyse erscheint ein Anspruch aktuell nicht realistisch.
          </p>
          {est.missing_documents && est.missing_documents.length > 0 && (
            <>
              <p>Möglicherweise fehlen noch folgende Unterlagen:</p>
              <ul>{est.missing_documents.map((d) => <li key={d}>{d}</li>)}</ul>
            </>
          )}
          <p>
            Für eine fundierte Rechtsberatung empfehlen wir Rentenberater oder
            Sozialverbände wie den VdK.
          </p>
        </div>
      )}
    </section>
  );
}

function PaidNextStepSection({ application, onContinue }) {
  return (
    <section style={{ background: 'var(--ap-white)', padding: '2rem', marginBottom: '2rem' }}>
      <h2>Zahlung erfolgt &mdash; nächster Schritt</h2>
      <p>
        Vielen Dank für Ihr Vertrauen. Im nächsten Schritt stellen wir Ihnen
        ein paar ergänzende Fragen, damit wir Ihren Antrag vollständig ausfüllen
        können.
      </p>
      <button className="btn btn--primary" onClick={onContinue}>
        Antragsunterlagen erzeugen
      </button>
    </section>
  );
}

function SubmissionSection({ application, pdfUrl, onConfirmSubmission }) {
  return (
    <section style={{ background: 'var(--ap-white)', padding: '2rem', marginBottom: '2rem' }}>
      <h2>Ihr Antrag ist bereit</h2>
      <p>
        <strong>Sie reichen den Antrag selbst ein.</strong> Im Dokument finden
        Sie eine Schritt-für-Schritt-Anleitung.
      </p>
      {pdfUrl && (
        <p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
            Antragspaket herunterladen (PDF)
          </a>
        </p>
      )}
      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--ap-border)' }} />
      <h3>Einreichungsart</h3>
      <p>Ihr Antrag kann auf drei Wegen bei der Behörde eingehen:</p>
      <ol>
        <li>Sie drucken aus, unterschreiben, verschicken per Post oder bringen persönlich.</li>
        <li>
          Mit unserem Plus-Paket kommt ein frankierter Umschlag zu Ihnen
          nach Hause &mdash; Unterlagen hinein, Briefkasten, fertig.
        </li>
        <li>Wenn Ihr Amt ein Online-Portal anbietet, nutzen Sie dieses.</li>
      </ol>
      <p style={{ marginTop: '2rem' }}>
        <strong>Wenn Sie den Antrag abgeschickt haben:</strong>
      </p>
      <button className="btn btn--primary btn--large" onClick={onConfirmSubmission}>
        Ich habe den Antrag heute eingereicht
      </button>
    </section>
  );
}

function TrackingSection({ application }) {
  const daysSince = application.submission_date
    ? Math.floor((Date.now() - new Date(application.submission_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <section style={{ background: 'var(--ap-white)', padding: '2rem', marginBottom: '2rem' }}>
      <h2>Antrag läuft &mdash; wir erinnern Sie</h2>
      <p>Eingereicht vor {daysSince} Tagen.</p>
      <p>
        Die Bearbeitung dauert typisch 4 bis 8 Wochen. Wenn Sie Post von der
        Behörde bekommen, laden Sie ein Foto hoch &mdash; wir erklären, was
        drin steht.
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Hinweise der Behörde hochladen</h3>
        <input type="file" accept="image/*,application/pdf" />
      </div>
    </section>
  );
}

function ResultSection({ type, application }) {
  if (type === 'approved') {
    return (
      <section style={{ background: 'var(--ap-light-sage)', padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--ap-deep-grove)' }}>
        <h2>Ihr Antrag wurde bewilligt.</h2>
        <p>Herzlichen Glückwunsch! Die Behörde hat Ihren Antrag positiv beschieden.</p>
        {application.decision_amount && (
          <p>Bewilligter Betrag: <strong>{application.decision_amount} €/Monat</strong></p>
        )}
        <p>
          Wenn AdminPilot Ihnen geholfen hat, erzählen Sie es bitte weiter
          &mdash; wir spenden für jede Empfehlung 5 €.
        </p>
      </section>
    );
  }
  return (
    <section style={{ background: 'var(--ap-amber-light)', padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--ap-amber)' }}>
      <h2>Ihr Antrag wurde abgelehnt.</h2>
      <p>
        Wir erklären Ihnen die typischen Gründe und stellen Mustertexte für
        Nachreichungen bereit. Für einen förmlichen Widerspruch empfehlen wir
        einen Rentenberater oder einen Sozialverband.
      </p>
    </section>
  );
}
