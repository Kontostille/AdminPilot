export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return Response.json({ error: 'Stripe not configured' }, { status: 500 });

  try {
    const { application_id, leistung_name, estimated_monthly } = await request.json();
    if (!application_id) return Response.json({ error: 'application_id required' }, { status: 400 });

    const origin = request.headers.get('origin') || 'https://admin-pilot-rosy.vercel.app';

    // Stripe Checkout Session erstellen via API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[]', 'card');
    params.append('payment_method_types[]', 'sepa_debit');
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][unit_amount]', '4900'); // 49.00 EUR in Cents
    params.append('line_items[0][price_data][product_data][name]', `AdminPilot Antrag: ${leistung_name || 'Sozialleistung'}`);
    params.append('line_items[0][price_data][product_data][description]', `Grundgebühr für Antragstellung. Geschätzter Anspruch: ~${estimated_monthly || 0} €/Monat. Geld zurück bei Ablehnung.`);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', `${origin}/app/zahlung-erfolgreich?antrag=${application_id}&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/app/antrag/${application_id}`);
    params.append('metadata[application_id]', application_id);
    params.append('metadata[type]', 'base_fee');

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (session.error) {
      return Response.json({ success: false, error: session.error.message }, { status: 200 });
    }

    return Response.json({ success: true, checkout_url: session.url, session_id: session.id });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 200 });
  }
}
