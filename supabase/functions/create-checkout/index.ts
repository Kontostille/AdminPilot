// ============================================================================
// create-checkout
// ============================================================================
// Erstellt eine Stripe Checkout Session für Basis (49 €) oder Plus (78 €).
//
// Input:  { application_id: uuid, package_type: 'basis' | 'plus' }
// Output: { url: string (Stripe hosted checkout URL) }
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

const PRICES = {
  basis: { amount: 4900, label: 'AdminPilot Basis' },
  plus: { amount: 7800, label: 'AdminPilot Plus' },
};

const APP_URL = Deno.env.get('APP_URL') ?? 'https://admin-pilot-rosy.vercel.app';

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
    // Verify JWT & get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'unauthorized' }, 401);
    const jwt = authHeader.replace('Bearer ', '');

    const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || !userData.user) return json({ error: 'unauthorized' }, 401);

    const clerkUserId = userData.user.id; // when using Clerk JWT, this is Clerk's user ID

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (!user) return json({ error: 'user not found in DB' }, 404);

    const { application_id, package_type } = await req.json();

    if (!application_id || !['basis', 'plus'].includes(package_type)) {
      return json({ error: 'invalid input' }, 400);
    }

    // Verify application belongs to user
    const { data: app } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .eq('user_id', user.id)
      .single();

    if (!app) return json({ error: 'application not found' }, 404);
    if (app.status !== 'analyzed') {
      return json({ error: 'application not ready for payment' }, 400);
    }

    const price = PRICES[package_type as 'basis' | 'plus'];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: price.label,
              description: `Ausfüllhilfe für Ihren ${app.benefit_type}-Antrag`,
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        application_id,
        user_id: user.id,
        package_type,
      },
      success_url: `${APP_URL}/app/antrag/${application_id}?paid=1`,
      cancel_url: `${APP_URL}/app/antrag/${application_id}?cancelled=1`,
      locale: 'de',
    });

    // Persist a pending payment record
    await supabase.from('payments').insert({
      user_id: user.id,
      application_id,
      stripe_session_id: session.id,
      package_type,
      amount_cents: price.amount,
      currency: 'EUR',
      status: 'pending',
    });

    await supabase.from('status_events').insert({
      user_id: user.id,
      application_id,
      event_type: 'checkout_created',
      actor: 'user',
      metadata: { package_type, session_id: session.id },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
