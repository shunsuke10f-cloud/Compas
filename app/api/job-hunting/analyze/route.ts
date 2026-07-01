import { NextRequest, NextResponse } from "next/server";
import { generateJobHuntingAnalysis } from "@/lib/job-hunting/analyze";
import { isJobHuntingTypeKey } from "@/lib/job-hunting/scoring";
import type { JobHuntingInputs } from "@/lib/job-hunting/types";
import { getOrCreateSessionId } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const typeKey: unknown = body?.typeKey;
  const inputs: unknown = body?.inputs;

  if (typeof typeKey !== "string" || !isJobHuntingTypeKey(typeKey)) {
    return NextResponse.json({ error: "typeKey is invalid" }, { status: 400 });
  }
  if (!inputs || typeof inputs !== "object") {
    return NextResponse.json({ error: "inputs object is required" }, { status: 400 });
  }

  const typedInputs = inputs as JobHuntingInputs;
  const hasAnyInput = Object.values(typedInputs).some((v) => typeof v === "string" && v.trim().length > 0);
  if (!hasAnyInput) {
    return NextResponse.json({ error: "少なくとも1つの入力項目に記入してください" }, { status: 400 });
  }

  let output;
  try {
    output = await generateJobHuntingAnalysis(typeKey, typedInputs);
  } catch (err) {
    console.error("job-hunting analyze failed", err);
    return NextResponse.json(
      { error: "自己分析の生成に失敗しました。しばらくしてから再度お試しください。" },
      { status: 502 }
    );
  }

  const sessionId = await getOrCreateSessionId();
  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from("job_hunting_outputs").insert({
      session_id: sessionId,
      type_key: typeKey,
      output,
    });
  }

  return NextResponse.json({ output });
}
