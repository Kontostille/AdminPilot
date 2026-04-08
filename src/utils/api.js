// AdminPilot – API Helper für Edge Functions
import { supabase } from './supabase.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callEdgeFunction(name, body) {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function triggerOCR(documentId, applicationId) {
  return callEdgeFunction('ocr-analyze', {
    document_id: documentId,
    application_id: applicationId,
  });
}

export async function calculateBenefits(applicationId) {
  return callEdgeFunction('calculate-benefits', {
    application_id: applicationId,
  });
}
