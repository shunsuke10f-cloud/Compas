"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { INPUT_CATEGORY_META } from "@/lib/job-hunting/inputSchema";
import type {
  EvidencedText,
  EvidenceRef,
  InputCategory,
  InterviewQuestion,
  JobHuntingAnalysisOutput,
  JobHuntingInputs,
} from "@/lib/job-hunting/types";

const TYPE_KEY_STORAGE_KEY = "compas.jobHunting.typeKey";
const INPUTS_STORAGE_KEY = "compas.jobHunting.inputs";
const OUTPUT_STORAGE_KEY = "compas.jobHunting.output";

const CATEGORY_LABELS: Record<InputCategory, string> = Object.fromEntries(
  INPUT_CATEGORY_META.map((meta) => [meta.key, meta.label])
) as Record<InputCategory, string>;

const OUTPUT_SECTIONS: { key: keyof JobHuntingAnalysisOutput; title: string }[] = [
  { key: "selfAnalysisSheet", title: "根拠付き自己分析シート" },
  { key: "strengths", title: "強みの整理" },
  { key: "values", title: "価値観の整理" },
  { key: "suitableEnvironment", title: "向いている職種・環境" },
  { key: "avoidEnvironment", title: "避けた方がよい環境" },
  { key: "gakuchika", title: "ガクチカ候補" },
  { key: "selfPr", title: "自己PR候補" },
  { key: "motivationAxis", title: "志望動機の軸" },
  { key: "resumeShort", title: "履歴書用短文" },
  { key: "es400", title: "ES用文章（400字）" },
];

export default function JobHuntingAnalysisPage() {
  const [typeKey, setTypeKey] = useState<string | null>(null);
  const [inputs, setInputs] = useState<JobHuntingInputs | null>(null);
  const [output, setOutput] = useState<JobHuntingAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage (an external store) on mount
    setTypeKey(window.localStorage.getItem(TYPE_KEY_STORAGE_KEY));

    const savedInputs = window.localStorage.getItem(INPUTS_STORAGE_KEY);
    if (savedInputs) {
      try {
        setInputs(JSON.parse(savedInputs));
      } catch {
        // ignore corrupt cache
      }
    }

    const savedOutput = window.localStorage.getItem(OUTPUT_STORAGE_KEY);
    if (savedOutput) {
      try {
        setOutput(JSON.parse(savedOutput));
      } catch {
        // ignore corrupt cache
      }
    }
  }, []);

  async function handleGenerate() {
    if (!typeKey || !inputs) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/job-hunting/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typeKey, inputs }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "分析の生成に失敗しました");
      }
      setOutput(data.output as JobHuntingAnalysisOutput);
      window.localStorage.setItem(OUTPUT_STORAGE_KEY, JSON.stringify(data.output));
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析の生成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  if (!typeKey || !inputs) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16 sm:px-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          自己分析シート・ES素材
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          先に診断と詳細入力を完了してください。
        </p>
        <div className="flex gap-3">
          <Link href="/job-hunting/diagnosis" className="text-sm font-medium text-indigo-600 underline">
            診断へ
          </Link>
          <Link href="/job-hunting/input" className="text-sm font-medium text-indigo-600 underline">
            詳細入力へ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          自己分析シート・ES素材
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          あなたが入力した内容だけを根拠に生成します。各項目の「根拠」には、実際に入力した文章から引用した一節が表示されます。
        </p>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-64"
      >
        {loading ? "生成中..." : output ? "再生成する" : "自己分析シートを生成する"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {output && (
        <div className="flex flex-col gap-6">
          {OUTPUT_SECTIONS.map((section) => (
            <OutputCard
              key={section.key}
              title={section.title}
              value={output[section.key] as EvidencedText}
            />
          ))}

          <section>
            <h2 className="text-sm font-semibold text-zinc-500">面接で深掘りされやすい質問</h2>
            <div className="mt-3 flex flex-col gap-4">
              {output.interviewQuestions.map((q, i) => (
                <InterviewQuestionCard key={i} question={q} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function OutputCard({ title, value }: { title: string; value: EvidencedText }) {
  const hasUnverified = value.evidence.some((e) => e.verified === false);
  return (
    <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-500">{title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">{value.text}</p>
      <EvidenceList evidence={value.evidence} />
      {hasUnverified && (
        <p className="mt-2 text-xs text-amber-600">
          ⚠ 入力文からそのまま確認できない根拠が含まれています。表現を鵜呑みにせず内容を確認してください。
        </p>
      )}
    </section>
  );
}

function InterviewQuestionCard({ question }: { question: InterviewQuestion }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{question.question}</p>
      <p className="mt-1 text-xs text-zinc-500">{question.reason}</p>
      <EvidenceList evidence={question.evidence} />
    </div>
  );
}

function EvidenceList({ evidence }: { evidence: EvidenceRef[] }) {
  if (evidence.length === 0) {
    return <p className="mt-2 text-xs text-zinc-400">根拠：入力からの直接引用なし（一般的な整理として記載）</p>;
  }
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {evidence.map((e, i) => (
        <li key={i} className="text-xs text-zinc-500">
          根拠：{CATEGORY_LABELS[e.category] ?? e.category}「{e.quote}」
          {e.verified === false && <span className="ml-1 text-amber-600">(未確認)</span>}
        </li>
      ))}
    </ul>
  );
}
