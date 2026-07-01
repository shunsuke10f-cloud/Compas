import { NextRequest, NextResponse } from "next/server";
import { scoreJobHuntingType, isJobHuntingTypeKey } from "@/lib/job-hunting/scoring";
import { getOrCreateSessionId } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { JobHuntingTypeKey } from "@/lib/job-hunting/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const answers: unknown = body?.answers;

  if (!Array.isArray(answers) || answers.length === 0 || !answers.every((a) => typeof a === "string" && isJobHuntingTypeKey(a))) {
    return NextResponse.json({ error: "answers must be a non-empty array of job-hunting type keys" }, { status: 400 });
  }

  const typeKey: JobHuntingTypeKey = scoreJobHuntingType(answers);
  const sessionId = await getOrCreateSessionId();

  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from("diagnoses").insert({
      session_id: sessionId,
      service_type: "job_hunting",
      type_key: typeKey,
      answers,
    });
  }

  return NextResponse.json({ typeKey });
}
