export const config = { runtime: 'edge' };

export default function handler() {
  return Response.json({
    ok: true,
    time: new Date().toISOString(),
    has_anthropic_key: !!process.env.ANTHROPIC_API_KEY,
    has_supabase_url: !!process.env.VITE_SUPABASE_URL,
    has_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_stripe_key: !!process.env.STRIPE_SECRET_KEY,
  });
}
