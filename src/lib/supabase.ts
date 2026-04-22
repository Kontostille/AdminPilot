// ============================================================================
// Supabase Client
// ============================================================================
// Einmalige Client-Instanz mit Clerk-JWT-Integration.
// Jede Anfrage sendet automatisch den Clerk-JWT als Auth-Header,
// damit RLS-Policies den Nutzer identifizieren.
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * React hook — gibt einen Supabase-Client zurück, der mit dem aktuellen
 * Clerk-JWT authentifiziert ist. JWT wird bei jeder Anfrage erneut geholt.
 */
export function useSupabase() {
  const { getToken, isSignedIn } = useAuth();

  return useMemo(() => {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        fetch: async (url, options = {}) => {
          if (isSignedIn) {
            const token = await getToken({ template: 'supabase' });
            if (token) {
              const headers = new Headers(options.headers);
              headers.set('Authorization', `Bearer ${token}`);
              options = { ...options, headers };
            }
          }
          return fetch(url, options);
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }, [getToken, isSignedIn]);
}

/**
 * Anonymous client for pages that don't require auth (e.g. free estimate).
 */
export const publicSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
