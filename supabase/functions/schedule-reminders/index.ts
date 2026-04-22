// ============================================================================
// schedule-reminders
// ============================================================================
// Cron-getriggerte Funktion (1x pro Stunde).
// Prüft, welche Status-Erinnerungen fällig sind und triggert E-Mails.
//
// Supabase Cron setup (via Supabase dashboard):
//   select cron.schedule(
//     'reminders-hourly',
//     '0 * * * *',
//     $$ select net.http_post(
//          url:='https://<ref>.supabase.co/functions/v1/schedule-reminders',
//          headers:='{"Authorization":"Bearer <service_role>"}'::jsonb
//        ) $$
//   );
//
// Regeln für Plus-Kunden:
//   - 14 Tage nach submission: "Haben Sie schon eine Eingangsbestätigung?"
//   - 42 Tage nach submission: "Zeit für Sachstandsanfrage" (mit Mustertext)
//   - 90 Tage: finale Erinnerung
// ============================================================================

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface ReminderRule {
  day_offset: number;
  template_id: string;
  requires_plus: boolean;
}

const RULES: ReminderRule[] = [
  { day_offset: 14, template_id: '5-erinnerung-eingangsbestaetigung', requires_plus: false },
  { day_offset: 42, template_id: '6-sachstandsanfrage', requires_plus: true },
  { day_offset: 90, template_id: '7-finale-erinnerung', requires_plus: true },
];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const results: any[] = [];

    for (const rule of RULES) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - rule.day_offset);
      const cutoffISO = cutoffDate.toISOString().slice(0, 10);

      // Find applications that crossed this reminder threshold
      // and haven't received this specific reminder yet
      let query = supabase
        .from('applications')
        .select('id, user_id, submission_date, package_type, status')
        .eq('submission_date', cutoffISO)
        .in('status', ['submitted', 'processing']);

      if (rule.requires_plus) {
        query = query.eq('package_type', 'plus');
      }

      const { data: apps } = await query;

      for (const app of apps ?? []) {
        // Check if this reminder was already sent
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('application_id', app.id)
          .eq('template_id', rule.template_id)
          .maybeSingle();

        if (existing) continue;

        await supabase.from('notifications').insert({
          user_id: app.user_id,
          application_id: app.id,
          channel: 'email',
          template_id: rule.template_id,
          scheduled_for: new Date().toISOString(),
        });

        results.push({
          application_id: app.id,
          rule: rule.template_id,
        });
      }
    }

    return json({
      success: true,
      scheduled: results.length,
      details: results,
    });
  } catch (err) {
    console.error('Reminder scheduling error:', err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
