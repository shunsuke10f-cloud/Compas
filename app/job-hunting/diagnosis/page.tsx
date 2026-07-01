"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BIG_FIVE_STATEMENTS, RIASEC_STATEMENTS, type DiagnosisStatement } from "@/lib/job-hunting/questions";
import { isCompleteDiagnosisAnswers, scoreJobHuntingDiagnosis } from "@/lib/job-hunting/scoring";

const SCALE_LABELS: Record<number, string> = {
  1: "まったく当てはまらない",
  2: "あまり当てはまらない",
  3: "どちらともいえない",
  4: "やや当てはまる",
  5: "とても当てはまる",
};

const ALL_STATEMENTS = [...RIASEC_STATEMENTS, ...BIG_FIVE_STATEMENTS];

export default function DiagnosisPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    if (!isCompleteDiagnosisAnswers(answers)) {
      setError("すべての設問に回答してください。");
      return;
    }
    setError(null);
    setSubmitting(true);

    const result = scoreJobHuntingDiagnosis(answers);

    try {
      window.localStorage.setItem("compas.jobHunting.typeKey", result.holland.primaryType);
      window.localStorage.setItem("compas.jobHunting.diagnosisResult", JSON.stringify(result));
      await fetch("/api/job-hunting/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
    } catch {
      // 保存に失敗しても診断結果自体は表示できるので処理は続ける
    } finally {
      router.push(`/job-hunting/result/${result.holland.primaryType}`);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">就活タイプ診断</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          全{ALL_STATEMENTS.length}問。それぞれの文章が自分にどれくらい当てはまるかを5段階で選んでください。
          （{answeredCount}/{ALL_STATEMENTS.length}）
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          前半は職業興味の6タイプ診断（ホランドのRIASEC理論。日本のVPI職業興味検査・職業レディネステストと
          同じ理論的基盤です）、後半は行動特性の5因子診断（ビッグファイブ）です。あわせて回答すると、
          「向いている職種・環境」と「行動特性としての強み」の両方が根拠付きでわかります。
        </p>
      </div>

      <StatementSection
        title="Part 1. 職業興味診断（RIASEC）"
        description="仕事や作業に対する興味・関心の方向性を聞きます。"
        statements={RIASEC_STATEMENTS}
        answers={answers}
        onAnswer={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
        offset={0}
      />

      <StatementSection
        title="Part 2. 行動特性診断（ビッグファイブ）"
        description="ふだんの考え方や行動のクセを聞きます。"
        statements={BIG_FIVE_STATEMENTS}
        answers={answers}
        onAnswer={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
        offset={RIASEC_STATEMENTS.length}
      />

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

function StatementSection({
  title,
  description,
  statements,
  answers,
  onAnswer,
  offset,
}: {
  title: string;
  description: string;
  statements: DiagnosisStatement[];
  answers: Record<string, number>;
  onAnswer: (id: string, value: number) => void;
  offset: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      {statements.map((statement, index) => (
        <fieldset key={statement.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <legend className="px-1 text-sm text-zinc-800 dark:text-zinc-100">
            {offset + index + 1}. {statement.text}
          </legend>
          <div className="mt-3 flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                title={SCALE_LABELS[value]}
                className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border border-transparent py-2 text-xs text-zinc-500 hover:bg-zinc-50 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 dark:hover:bg-zinc-900 dark:has-[:checked]:bg-indigo-950"
              >
                <input
                  type="radio"
                  name={statement.id}
                  value={value}
                  checked={answers[statement.id] === value}
                  onChange={() => onAnswer(statement.id, value)}
                  className="h-4 w-4"
                />
                {value}
              </label>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
            <span>{SCALE_LABELS[1]}</span>
            <span>{SCALE_LABELS[5]}</span>
          </div>
        </fieldset>
      ))}
    </div>
  );
}
