import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Shared Supabase client used by both the life-unit service and the
 * job-hunting service. Returns null when credentials are not configured so
 * callers can degrade gracefully instead of crashing (this MVP works without
 * a provisioned Supabase project; persistence is best-effort until it is).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cachedClient =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseServerClient() !== null;
}
