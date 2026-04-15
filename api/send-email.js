export const config = { runtime: 'edge' };

// E-Mail-Versand via Resend
// Docs: https://resend.com/docs/api-reference

const TEMPLATES = {
  welcome: {
    subject: 'Willkommen bei AdminPilot',
  },
  analysis_complete: {
    subject: 'Ihre Analyse ist fertig – Ergebnis ansehen',
  },
  payment_confirmed: {
    subject: 'Zahlung bestätigt – Nächster Schritt: Vollmacht unterschreiben',
  },
  signature_complete: {
    subject: 'Vollmacht unterschrieben – Ihr Antrag wird eingereicht',
  },
  submitted: {
    subject: 'Ihr Antrag wurde bei der Behörde eingereicht',
  },
  approved: {
    subject: 'Glückwunsch! Ihr Antrag wurde bewilligt',
  },
  rejected: {
    subject: 'Ihr Antrag wurde leider abgelehnt – Erstattung wird veranlasst',
  },
};

export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return Response.json({ success: false, error: 'Resend not configured', mode: 'skip' });
  }

  try {
    const { to, template, data } = await request.json();

    if (!to || !template) {
      return Response.json({ success: false, error: 'to and template required' });
    }

    const tmpl = TEMPLATES[template];
    if (!tmpl) {
      return Response.json({ success: false, error: `Unknown template: ${template}` });
    }

    const name = data?.name || 'Nutzer';
    const leistung = data?.leistung || 'Sozialleistung';
    const betrag = data?.betrag || '0';
    const antragId = data?.application_id || '';
    const baseUrl = 'https://adminpilot.de';

    // HTML Templates
    const htmlTemplates = {
      welcome: `
        <h2>Willkommen bei AdminPilot, ${name}!</h2>
        <p>Schön, dass Sie sich registriert haben. Mit AdminPilot finden Sie heraus, welche Sozialleistungen Ihnen möglicherweise zustehen – und wir stellen den Antrag für Sie.</p>
        <p><a href="${baseUrl}/app" style="background:#E2C044;color:#1A3C2B;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Zum Dashboard →</a></p>
      `,
      analysis_complete: `
        <h2>Ihre Analyse ist fertig, ${name}!</h2>
        <p>Wir haben Ihre Dokumente analysiert. Ihr geschätzter möglicher Anspruch auf ${leistung}:</p>
        <p style="font-size:32px;font-weight:700;color:#E2C044;">~${betrag} €/Monat</p>
        <p><a href="${baseUrl}/app/antrag/${antragId}" style="background:#E2C044;color:#1A3C2B;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Ergebnis ansehen →</a></p>
      `,
      payment_confirmed: `
        <h2>Zahlung bestätigt, ${name}!</h2>
        <p>Ihre Zahlung von 49 € für den Antrag auf ${leistung} wurde bestätigt.</p>
        <p><strong>Nächster Schritt:</strong> Unterschreiben Sie die Vollmacht, damit wir Ihren Antrag einreichen können.</p>
        <p><a href="${baseUrl}/app/signatur/${antragId}" style="background:#1A3C2B;color:#FFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Jetzt unterschreiben →</a></p>
      `,
      signature_complete: `
        <h2>Vollmacht unterschrieben, ${name}!</h2>
        <p>Vielen Dank. Ihr Antrag auf ${leistung} wird jetzt bei der zuständigen Behörde eingereicht.</p>
        <p>Die Bearbeitung dauert in der Regel 3–8 Wochen. Wir halten Sie per E-Mail auf dem Laufenden.</p>
        <p><a href="${baseUrl}/app/antrag/${antragId}" style="background:#E2C044;color:#1A3C2B;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Status ansehen →</a></p>
      `,
      submitted: `
        <h2>Antrag eingereicht, ${name}!</h2>
        <p>Ihr Antrag auf ${leistung} wurde bei der zuständigen Behörde eingereicht.</p>
        <p>Die Bearbeitung dauert in der Regel 3–8 Wochen. Sie erhalten von uns eine E-Mail, sobald es ein Update gibt.</p>
      `,
      approved: `
        <h2>Glückwunsch, ${name}! 🎉</h2>
        <p>Ihr Antrag auf ${leistung} wurde <strong>bewilligt</strong>!</p>
        <p style="font-size:28px;font-weight:700;color:#0F6E56;">${betrag} €/Monat</p>
        <p>Die Leistung wird Ihnen monatlich überwiesen.</p>
      `,
      rejected: `
        <h2>${name}, leider wurde Ihr Antrag abgelehnt.</h2>
        <p>Ihr Antrag auf ${leistung} wurde von der Behörde abgelehnt.</p>
        <p style="background:#E1F5EE;padding:16px;border-radius:8px;"><strong>Geld-zurück-Garantie:</strong> Die Grundgebühr von 49 € wird Ihnen erstattet.</p>
        <p>Falls Sie Widerspruch einlegen möchten, kontaktieren Sie uns unter info@adminpilot.de.</p>
      `,
    };

    const htmlContent = htmlTemplates[template] || '<p>Status-Update für Ihren Antrag.</p>';

    // Komplettes E-Mail-Layout
    const fullHtml = `
      <div style="max-width:560px;margin:0 auto;font-family:sans-serif;color:#1A3C2B;">
        <div style="background:#1A3C2B;padding:20px 24px;border-radius:12px 12px 0 0;">
          <span style="color:#FFF;font-weight:700;font-size:18px;">Admin</span><span style="color:#8AA494;font-weight:700;font-size:18px;">Pilot</span>
        </div>
        <div style="padding:32px 24px;background:#FFF;border:1px solid #E2E8E5;border-top:none;">
          ${htmlContent}
        </div>
        <div style="padding:16px 24px;background:#F8FAF9;border-radius:0 0 12px 12px;border:1px solid #E2E8E5;border-top:none;font-size:12px;color:#8AA494;text-align:center;">
          <p>ALEVOR Mittelstandspartner GmbH · Titurelstraße 10, 81925 München</p>
          <p><a href="${baseUrl}/datenschutz" style="color:#8AA494;">Datenschutz</a> · <a href="${baseUrl}/impressum" style="color:#8AA494;">Impressum</a></p>
        </div>
      </div>
    `;

    // Resend API Call
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AdminPilot <noreply@adminpilot.de>',
        to: [to],
        subject: tmpl.subject,
        html: fullHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return Response.json({ success: false, error: errText.substring(0, 200) });
    }

    const result = await resendRes.json();
    return Response.json({ success: true, email_id: result.id });

  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
