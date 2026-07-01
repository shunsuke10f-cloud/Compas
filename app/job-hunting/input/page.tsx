"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { INPUT_CATEGORY_META } from "@/lib/job-hunting/inputSchema";
import type { InputCategory, JobHuntingInputs } from "@/lib/job-hunting/types";

const STORAGE_KEY = "compas.jobHunting.inputs";
const TYPE_KEY_STORAGE_KEY = "compas.jobHunting.typeKey";

export default function JobHuntingInputPage() {
  const router = useRouter();
  const [typeKey, setTypeKey] = useState<string | null>(null);
  const [values, setValues] = useState<JobHuntingInputs>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage (an external store) on mount
    setTypeKey(window.localStorage.getItem(TYPE_KEY_STORAGE_KEY));
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setValues(JSON.parse(saved));
      } catch {
        // ignore corrupt cache
      }
    }
  }, []);

  function updateField(category: InputCategory, content: string) {
    setValues((prev) => ({ ...prev, [category]: content }));
  }

  const hasAnyInput = Object.values(values).some((v) => (v ?? "").trim().length > 0);

  async function handleSubmit() {
    if (!hasAnyInput) {
      setError("少なくとも1つの項目に入力してください。");
      return;
    }
    setError(null);
    setSaving(true);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));

    try {
      await fetch("/api/job-hunting/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: values }),
      });
    } catch {
      // 保存に失敗してもローカルキャッシュがあるので処理は続ける
    } finally {
      router.push("/job-hunting/analysis");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <p className="text-sm font-medium text-indigo-600">詳細入力（有料機能）</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          自己分析のための情報を入力する
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          ここで入力した内容だけを根拠に、自己分析シートやES文章を作成します。入力していない経験や数字が
          出力に登場することはありません。すべて任意項目ですが、記入が多いほど根拠のある分析になります。
        </p>
        {!typeKey && (
          <p className="mt-3 text-xs text-amber-600">
            診断結果が見つかりません。先に
            <Link href="/job-hunting/diagnosis" className="underline">
              診断
            </Link>
            を受けることをおすすめします。
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {INPUT_CATEGORY_META.map((meta) => (
          <div key={meta.key} className="flex flex-col gap-2">
            <label htmlFor={meta.key} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {meta.label}
            </label>
            <p className="text-xs text-zinc-500">{meta.description}</p>
            <textarea
              id={meta.key}
              value={values[meta.key] ?? ""}
              onChange={(e) => updateField(meta.key, e.target.value)}
              placeholder={meta.placeholder}
              rows={4}
              className="rounded-lg border border-zinc-300 p-3 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-64"
      >
        {saving ? "保存中..." : "この内容で自己分析シートを作る"}
      </button>
    </div>
  );
}
