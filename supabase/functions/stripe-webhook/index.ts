// ============================================================================
// stripe-webhook
// ============================================================================
// Empfängt Stripe-Events. Reagiert auf:
//   - checkout.session.completed     -> Zahlung erfolgreich, Status 'paid'
//   - payment_intent.payment_failed  -> Zahlung fehlgeschlagen
//   - charge.refunded                -> Geld zurückerstattet
//
// Konfiguration in Stripe Dashboard:
//   Endpoint URL: https://<project>.supabase.co/functions/v1/stripe-webhook
//   Events:       checkout.session.completed, payment_intent.payment_failed, charge.refunded
// ============================================================================

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@17.5.0?target=deno';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia' as any,
  httpClient: Stripe.createFetchHttpClient(),
});

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('missing signature', { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return new Response(`bad signature: ${err}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.payment_failed':
        await onPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await onChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        // Ignore other events
        break;
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('Webhook handling error:', err);
    return new Response(`error: ${err}`, { status: 500 });
  }
});

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { application_id, user_id, package_type } = session.metadata ?? {};
  if (!application_id) return;

  // Update payment
  await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
      invoice_number: generateInvoiceNumber(),
    })
    .eq('stripe_session_id', session.id);

  // Update application
  await supabase
    .from('applications')
    .update({
      status: 'paid',
      package_type,
    })
    .eq('id', application_id);

  // Log audit event
  await supabase.from('status_events').insert({
    user_id,
    application_id,
    event_type: 'payment_succeeded',
    from_status: 'analyzed',
    to_status: 'paid',
    actor: 'system',
    metadata: {
      package_type,
      amount_cents: session.amount_total,
      session_id: session.id,
    },
  });

  // Trigger confirmation email
  await supabase.from('notifications').insert({
    user_id,
    application_id,
    channel: 'email',
    template_id: '3-zahlungsbestaetigung',
    scheduled_for: new Date().toISOString(),
  });
}

async function onPaymentFailed(pi: Stripe.PaymentIntent) {
  await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', pi.id);
}

async function onChargeRefunded(charge: Stripe.Charge) {
  if (!charge.payment_intent) return;

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('stripe_payment_intent_id', charge.payment_intent)
    .single();

  if (!payment) return;

  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      refunded_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  if (payment.application_id) {
    await supabase
      .from('applications')
      .update({ status: 'refunded' })
      .eq('id', payment.application_id);

    await supabase.from('status_events').insert({
      user_id: payment.user_id,
      application_id: payment.application_id,
      event_type: 'payment_refunded',
      to_status: 'refunded',
      actor: 'system',
      metadata: { charge_id: charge.id },
    });
  }
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AP-${year}-${rand}`;
}
