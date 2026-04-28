import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

let adminSingleton: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient {
  if (!adminSingleton) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    adminSingleton = createSupabaseClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminSingleton;
}
