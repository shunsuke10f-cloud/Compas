"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DIAGNOSIS_QUESTIONS } from "@/lib/job-hunting/questions";
import { scoreJobHuntingType } from "@/lib/job-hunting/scoring";
import type { JobHuntingTypeKey } from "@/lib/job-hunting/types";

export default function DiagnosisPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, JobHuntingTypeKey>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === DIAGNOSIS_QUESTIONS.length;

  async function handleSubmit() {
    if (!allAnswered) {
      setError("すべての質問に回答してください。");
      return;
    }
    setError(null);
    setSubmitting(true);

    const orderedAnswers = DIAGNOSIS_QUESTIONS.map((q) => answers[q.id]);
    const typeKey = scoreJobHuntingType(orderedAnswers);

    try {
      window.localStorage.setItem("compas.jobHunting.typeKey", typeKey);
      await fetch("/api/job-hunting/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: orderedAnswers }),
      });
    } catch {
      // 保存に失敗しても診断結果自体は表示できるので処理は続ける
    } finally {
      router.push(`/job-hunting/result/${typeKey}`);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">就活タイプ診断</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          全{DIAGNOSIS_QUESTIONS.length}問。もっとも当てはまるものを1つ選んでください。（{answeredCount}/{DIAGNOSIS_QUESTIONS.length}）
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {DIAGNOSIS_QUESTIONS.map((question, index) => (
          <fieldset
            key={question.id}
            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <legend className="px-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Q{index + 1}. {question.prompt}
            </legend>
            <div className="mt-3 flex flex-col gap-2">
              {question.options.map((option) => (
                <label
                  key={option.label}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:has-[:checked]:bg-indigo-950"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.type}
                    checked={answers[question.id] === option.type}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: option.type }))
                    }
                    className="h-4 w-4"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-64"
      >
        {submitting ? "送信中..." : "診断結果を見る"}
      </button>
    </div>
  );
}
