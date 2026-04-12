import { useState } from 'react';
import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';

const TIMELINE = [
  {
    phase: 'vor_umzug',
    title: '3–6 Monate vorher',
    color: '#1A3C2B',
    tasks: [
      { id: 'kuendigung', label: 'Mietvertrag kündigen', desc: '3 Monate Kündigungsfrist beachten. Schriftlich per Einschreiben.', link: null },
      { id: 'wohnungssuche', label: 'Neue Wohnung suchen & Mietvertrag unterschreiben', desc: 'Schufa-Auskunft, Einkommensnachweise und Personalausweis bereithalten.' },
      { id: 'urlaub', label: 'Urlaub für den Umzugstag beantragen', desc: 'Ggf. Sonderurlaub – manche Arbeitgeber gewähren 1–2 Tage.' },
      { id: 'umzugsfirma', label: 'Umzugsunternehmen vergleichen & buchen', desc: 'Mindestens 3 Angebote einholen. Samstage sind am beliebtesten.' },
      { id: 'sonderrecht', label: 'Sonderkündigungsrecht prüfen', desc: 'Strom, Gas, Internet – bei Umzug oft Sonderkündigung möglich.' },
    ],
  },
  {
    phase: '4_wochen',
    title: '4 Wochen vorher',
    color: '#2D6148',
    tasks: [
      { id: 'nachsendeauftrag', label: 'Nachsendeauftrag bei der Post', desc: 'Online unter nachsendeauftrag.de – 6 oder 12 Monate. Kostet ca. 28 €.' },
      { id: 'strom_gas', label: 'Strom & Gas ummelden/anmelden', desc: 'Alten Vertrag kündigen oder mitnehmen. Zählerstände notieren!' },
      { id: 'internet', label: 'Internet & Telefon ummelden', desc: 'Verfügbarkeit am neuen Standort prüfen. Achtung: 2–4 Wochen Vorlauf.' },
      { id: 'schule_kiga', label: 'Schule/Kita am neuen Ort anmelden', desc: 'Frühzeitig Platz sichern – besonders bei Kita-Plätzen!' },
      { id: 'verpacken', label: 'Nicht-Alltägliches einpacken', desc: 'Bücher, Deko, Saisonkleidung zuerst.' },
    ],
  },
  {
    phase: '2_wochen',
    title: '2 Wochen vorher',
    color: '#8AA494',
    tasks: [
      { id: 'ablesetermin', label: 'Zählerstand-Ablesetermin vereinbaren', desc: 'Strom, Gas, Wasser – mit altem und neuem Versorger.' },
      { id: 'uebergabe', label: 'Wohnungsübergabe vorbereiten', desc: 'Protokoll vorbereiten, Löcher in Wänden füllen, reinigen.' },
      { id: 'umzugskartons', label: 'Umzugskartons beschriften', desc: 'Raum + Inhalt auf jede Kiste schreiben. Spart Stunden beim Auspacken.' },
      { id: 'halteverbots', label: 'Halteverbotszone beantragen', desc: 'Beim Ordnungsamt – ca. 2 Wochen Vorlauf. Kostet 20–60 €.' },
    ],
  },
  {
    phase: 'umzugstag',
    title: 'Am Umzugstag',
    color: '#E2C044',
    tasks: [
      { id: 'zaehler', label: 'Zählerstände fotografieren (alt & neu)', desc: 'Strom, Gas, Wasser – mit Datum fotografieren!' },
      { id: 'schluessel', label: 'Schlüsselübergabe dokumentieren', desc: 'Übergabeprotokoll unterschreiben, Schäden notieren.' },
      { id: 'klingel', label: 'Klingelschild & Briefkasten beschriften', desc: 'Damit die Post ab Tag 1 ankommt.' },
    ],
  },
  {
    phase: 'nach_umzug',
    title: 'Innerhalb von 2 Wochen',
    color: '#C0392B',
    tasks: [
      { id: 'ummeldung', label: 'Wohnsitz ummelden (Pflicht!)', desc: 'Innerhalb von 14 Tagen beim Einwohnermeldeamt. Bußgeld bis 1.000 € bei Versäumnis!', important: true },
      { id: 'ausweis', label: 'Personalausweis/Reisepass aktualisieren', desc: 'Neue Adresse eintragen lassen – direkt bei der Ummeldung.' },
      { id: 'kfz', label: 'KFZ-Zulassungsstelle', desc: 'Auto ummelden wenn Zulassungsbezirk wechselt.' },
      { id: 'arbeitgeber', label: 'Arbeitgeber informieren', desc: 'Neue Adresse für Lohnabrechnung und Steuer.' },
      { id: 'bank', label: 'Bank, Versicherungen, Verträge', desc: 'Adresse aktualisieren bei: Bank, Versicherungen, GEZ, Amazon, etc.' },
      { id: 'finanzamt', label: 'Finanzamt – ergibt sich automatisch', desc: 'Wird durch Ummeldung automatisch informiert.' },
      { id: 'wohngeld', label: 'Wohngeld/Sozialleistungen neu beantragen', desc: 'Neuer Wohnort = neue Zuständigkeit. Antrag muss ggf. neu gestellt werden.', important: true, cta: true },
    ],
  },
];

function TaskItem({ task, checked, onToggle }) {
  return (
    <label style={{
      display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer',
      background: checked ? '#F0F7F3' : '#FFF',
      border: task.important ? '2px solid #E2C044' : '1px solid #E2E8E5',
      borderRadius: 8, marginBottom: 8, transition: 'all 0.15s',
      alignItems: 'flex-start',
    }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ marginTop: 3, accentColor: '#1A3C2B', width: 18, height: 18, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: checked ? '#8AA494' : '#1A3C2B',
          textDecoration: checked ? 'line-through' : 'none',
        }}>
          {task.label}
          {task.important && <span style={{ fontSize: 10, background: '#E2C044', color: '#1A3C2B', padding: '1px 6px', borderRadius: 4, marginLeft: 8, fontWeight: 700 }}>WICHTIG</span>}
        </div>
        <div style={{ fontSize: 12, color: '#8AA494', marginTop: 4, lineHeight: 1.5 }}>{task.desc}</div>
        {task.cta && !checked && (
          <a href="/leistungscheck" style={{
            display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 600,
            color: '#1A3C2B', background: '#E2C044', padding: '4px 12px', borderRadius: 4,
            textDecoration: 'none',
          }}>Jetzt Anspruch prüfen →</a>
        )}
      </div>
    </label>
  );
}

export default function UmzugshilfePage() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ap_umzug_checklist') || '{}'); } catch { return {}; }
  });

  const toggle = (id) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem('ap_umzug_checklist', JSON.stringify(updated));
  };

  const totalTasks = TIMELINE.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedTasks = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((completedTasks / totalTasks) * 100);

  const resetAll = () => { setChecked({}); localStorage.removeItem('ap_umzug_checklist'); };

  return (
    <>
      <SEOHead
        title="Umzugshilfe – Kostenlose Checkliste für Ihren Umzug"
        description="Die komplette Umzugs-Checkliste: Alles was Sie vor, während und nach dem Umzug erledigen müssen. Kostenlos und interaktiv."
        keywords={['Umzug Checkliste', 'Umzugshilfe', 'Ummeldung', 'Umzug was beachten']}
      />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #1A3C2B 0%, #2D5A43 100%)', color: '#FFF', padding: '64px 0 48px' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <p style={{ fontSize: 12, color: '#E2C044', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Kostenlose Umzugshilfe</p>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>Ihre interaktive Umzugs-Checkliste</h1>
          <p style={{ fontSize: 16, color: '#C8DAD0', lineHeight: 1.6, marginBottom: 24 }}>
            Ein Umzug bringt viele Behördengänge und Fristen mit sich. 
            Diese Checkliste führt Sie Schritt für Schritt durch alles, was erledigt werden muss – 
            von der Kündigung bis zur Ummeldung.
          </p>
          {/* Fortschritt */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#C8DAD0' }}>{completedTasks} von {totalTasks} erledigt</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#E2C044', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 100, background: '#E2C044', width: `${percent}%`, transition: 'width 0.4s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          {TIMELINE.map((phase) => {
            const phaseDone = phase.tasks.every(t => checked[t.id]);
            return (
              <div key={phase.phase} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: phaseDone ? '#0F6E56' : phase.color, flexShrink: 0 }} />
                  <h2 style={{ fontSize: 20, margin: 0, color: phaseDone ? '#0F6E56' : '#1A3C2B' }}>
                    {phase.title}
                    {phaseDone && <span style={{ fontSize: 14, marginLeft: 8 }}>✓</span>}
                  </h2>
                </div>
                {phase.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} checked={!!checked[task.id]} onToggle={() => toggle(task.id)} />
                ))}
              </div>
            );
          })}

          {/* Reset */}
          <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid #E2E8E5' }}>
            <button onClick={resetAll} style={{
              background: 'none', border: '1px solid #E2E8E5', color: '#8AA494', padding: '8px 20px',
              borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
            }}>
              Checkliste zurücksetzen
            </button>
            <p style={{ fontSize: 11, color: '#C8DAD0', marginTop: 8 }}>Ihr Fortschritt wird lokal im Browser gespeichert.</p>
          </div>

          {/* CTA */}
          <div style={{
            background: '#1A3C2B', borderRadius: 12, padding: 32, textAlign: 'center', marginTop: 40,
          }}>
            <h2 style={{ color: '#FFF', fontSize: 20, marginBottom: 8 }}>Nach dem Umzug: Ansprüche prüfen</h2>
            <p style={{ color: '#C8DAD0', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Neuer Wohnort = möglicherweise neue Ansprüche. Wohngeld, Kinderzuschlag und andere 
              Leistungen hängen von Ihrer Miete und dem Wohnort ab.
            </p>
            <Button variant="primary" size="large" to="/leistungscheck">
              Kostenlos Ansprüche prüfen →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
