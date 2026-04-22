// ============================================================================
// API client
// ============================================================================
// Dünne Wrapper um die Supabase Edge Functions. Zentraler Ort, an dem die
// Endpoint-Namen gepflegt werden.
// ============================================================================

import { useAuth } from '@clerk/clerk-react';

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function call<T>(path: string, body: unknown, token: string | null): Promise<T> {
  const res = await fetch(`${FUNCTIONS_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

export function useApi() {
  const { getToken } = useAuth();

  return {
    async analyzeDocument(document_id: string) {
      const token = await getToken({ template: 'supabase' });
      return call<{ success: boolean; extracted_data?: any; error?: string }>(
        'ocr-analyze',
        { document_id },
        token
      );
    },

    async calculateEntitlement(application_id: string) {
      const token = await getToken({ template: 'supabase' });
      return call<{ success: boolean; estimate?: any }>(
        'entitlement-calculate',
        { application_id },
        token
      );
    },

    async createCheckout(application_id: string, package_type: 'basis' | 'plus') {
      const token = await getToken({ template: 'supabase' });
      return call<{ url: string }>(
        'create-checkout',
        { application_id, package_type },
        token
      );
    },

    async generatePdf(application_id: string) {
      const token = await getToken({ template: 'supabase' });
      return call<{ success: boolean; pdf_url?: string; path?: string }>(
        'generate-application-pdf',
        { application_id },
        token
      );
    },

    async analyzeAuthorityLetter(document_id: string) {
      const token = await getToken({ template: 'supabase' });
      return call<{ success: boolean; analysis?: any }>(
        'analyze-authority-letter',
        { document_id },
        token
      );
    },
  };
}
