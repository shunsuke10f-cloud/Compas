import { NextRequest, NextResponse } from "next/server";
import { INPUT_CATEGORIES } from "@/lib/job-hunting/types";
import { getOrCreateSessionId } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const inputs: unknown = body?.inputs;

  if (!inputs || typeof inputs !== "object") {
    return NextResponse.json({ error: "inputs object is required" }, { status: 400 });
  }

  const sessionId = await getOrCreateSessionId();
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const rows = Object.entries(inputs as Record<string, unknown>)
      .filter(
        (entry): entry is [string, string] =>
          (INPUT_CATEGORIES as readonly string[]).includes(entry[0]) &&
          typeof entry[1] === "string" &&
          entry[1].trim().length > 0
      )
      .map(([category, content]) => ({
        session_id: sessionId,
        category,
        content,
        updated_at: new Date().toISOString(),
      }));

    if (rows.length > 0) {
      await supabase.from("job_hunting_inputs").upsert(rows, { onConflict: "session_id,category" });
    }
  }

  return NextResponse.json({ ok: true, persisted: Boolean(supabase) });
}
