export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return Response.json({ error: 'Stripe not configured' }, { status: 500 });

  try {
    const { application_id, leistung_name, estimated_monthly, plus_package } = await request.json();
    if (!application_id) return Response.json({ error: 'application_id required' }, { status: 400 });

    const origin = request.headers.get('origin') || 'https://adminpilot.de';
    const isPlus = Boolean(plus_package);

    // Stripe Checkout Session erstellen via API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[]', 'card');
    params.append('payment_method_types[]', 'sepa_debit');

    // Line-Item 1: Basis-Service 49 €
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][unit_amount]', '4900');
    params.append('line_items[0][price_data][product_data][name]', `AdminPilot Antrag: ${leistung_name || 'Sozialleistung'}`);
    params.append('line_items[0][price_data][product_data][description]', `Grundgebühr für die Antragsvorbereitung. Geschätzter Anspruch: ~${estimated_monthly || 0} €/Monat. Geld zurück bei Ablehnung.`);
    params.append('line_items[0][quantity]', '1');

    // Line-Item 2: Plus-Paket 29 € (optional)
    if (isPlus) {
      params.append('line_items[1][price_data][currency]', 'eur');
      params.append('line_items[1][price_data][unit_amount]', '2900');
      params.append('line_items[1][price_data][product_data][name]', 'AdminPilot Plus-Paket');
      params.append('line_items[1][price_data][product_data][description]', 'Zusätzliche Einreichungshilfe: Versandumschlag mit Anschreiben, Erinnerungen zum Nachfassen, zweite Durchsicht des Bescheids.');
      params.append('line_items[1][quantity]', '1');
    }

    // Success + Metadaten
    const successUrl = `${origin}/app/zahlung-erfolgreich?antrag=${application_id}&session_id={CHECKOUT_SESSION_ID}&plus=${isPlus ? '1' : '0'}`;
    params.append('success_url', successUrl);
    params.append('cancel_url', `${origin}/app/antrag/${application_id}`);
    params.append('metadata[application_id]', application_id);
    params.append('metadata[package_type]', isPlus ? 'basis_plus' : 'basis');
    params.append('metadata[plus_amount]', isPlus ? '2900' : '0');

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

    return Response.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
      total_amount: isPlus ? 7800 : 4900,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 200 });
  }
}
