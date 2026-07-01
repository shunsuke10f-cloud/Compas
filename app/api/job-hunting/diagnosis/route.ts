import { NextRequest, NextResponse } from "next/server";
import { isCompleteDiagnosisAnswers, scoreJobHuntingDiagnosis } from "@/lib/job-hunting/scoring";
import { getOrCreateSessionId } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const answers: unknown = body?.answers;

  if (!isCompleteDiagnosisAnswers(answers)) {
    return NextResponse.json(
      { error: "answers must rate every diagnosis statement with an integer from 1 to 5" },
      { status: 400 }
    );
  }

  const result = scoreJobHuntingDiagnosis(answers);
  const sessionId = await getOrCreateSessionId();

  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from("diagnoses").insert({
      session_id: sessionId,
      service_type: "job_hunting",
      type_key: result.holland.primaryType,
      answers,
    });
  }

  return NextResponse.json({ result });
}
