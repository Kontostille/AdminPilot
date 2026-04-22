import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY } from '../../data/siteConfig.js';
export default function WiderrufPage() {
  return (<><SEOHead title="Widerrufsbelehrung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Widerrufsbelehrung</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Stand: April 2026 · Entwurf – wird durch Rechtsanwalt finalisiert</p>
      <div style={{ lineHeight: 1.9 }}>
        <h2>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({COMPANY.name}, {COMPANY.address}, {COMPANY.zip} {COMPANY.city}, E-Mail: {COMPANY.email}) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
        <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>

        <h2>Folgen des Widerrufs</h2>
        <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.</p>

        <h2>Vorzeitiger Verlust des Widerrufsrechts</h2>
        <p>Das Widerrufsrecht erlischt vorzeitig, wenn die von uns geschuldete Leistung – das Bereitstellen des fertig ausgefüllten Antragsdokuments einschließlich der Einreichungsanleitung – vor Ablauf der Widerrufsfrist vollständig erbracht wurde und Sie vor Vertragsschluss ausdrücklich zugestimmt haben, dass die Ausführung vor Ablauf der Widerrufsfrist beginnt und Sie Ihre Kenntnis davon bestätigen, dass Sie durch die vollständige Leistungserbringung Ihr Widerrufsrecht verlieren (§ 356 Abs. 4 BGB).</p>

        <h2>Muster-Widerrufsformular</h2>
        <p>Wenn Sie den Vertrag widerrufen wollen, können Sie folgendes Formular verwenden:</p>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
          <p style={{ margin: 0 }}>
            An: {COMPANY.name}<br/>
            {COMPANY.address}<br/>
            {COMPANY.zip} {COMPANY.city}<br/>
            E-Mail: {COMPANY.email}<br/><br/>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung (*):<br/>
            ______________________________<br/><br/>
            Bestellt am (*) / erhalten am (*): ______<br/>
            Name des/der Verbraucher(s): ______<br/>
            Anschrift des/der Verbraucher(s): ______<br/>
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______<br/>
            Datum: ______<br/><br/>
            (*) Unzutreffendes streichen.
          </p>
        </div>
      </div>
    </div></section>
  </>);
}
