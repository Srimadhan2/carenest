import axios from 'axios';
import { supabase } from '@/lib/supabase';

export const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

/**
 * Base URL for Supabase Edge Functions (Phase 11)
 * @param {string} functionName
 */
export function getEdgeFunctionUrl(functionName) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) {
    return null;
  }
  return `${url}/functions/v1/${functionName}`;
}
