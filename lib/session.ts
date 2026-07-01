import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "compas_session_id";

/**
 * Anonymous session id shared across services (life-unit + job-hunting).
 * MVP has no real auth yet; this cookie is what ties diagnoses/inputs/
 * outputs together in Supabase until a real account system replaces it.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
