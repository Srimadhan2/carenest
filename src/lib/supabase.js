import { createClient } from '@supabase/supabase-js';
import { ServiceError } from '@/services/errors';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The Supabase client, or null when env vars are absent (e.g. during tests or a
 * misconfigured deploy). Runtime code should call getSupabase() so a missing
 * configuration fails loudly instead of silently falling back to mock storage.
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

/**
 * Returns the configured Supabase client or throws a clear error. Supabase is
 * the single source of truth: there is no mock fallback.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function getSupabase() {
  if (!supabase) {
    throw new ServiceError(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      { code: 'SUPABASE_NOT_CONFIGURED' },
    );
  }
  return supabase;
}
