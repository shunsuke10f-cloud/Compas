"use client";

import { useEffect, useState } from "react";
import { JOB_HUNTING_TYPE_CONTENT } from "@/lib/job-hunting/typeContent";
import type { DiagnosisResult } from "@/lib/job-hunting/scoring";
import type { JobHuntingTypeKey } from "@/lib/job-hunting/types";

const STORAGE_KEY = "compas.jobHunting.diagnosisResult";

export default function DiagnosisBreakdown({ type }: { type: JobHuntingTypeKey }) {
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as DiagnosisResult;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage (an external store) on mount
      if (parsed.primaryType === type) setResult(parsed);
    } catch {
      // ignore corrupt cache
    }
  }, [type]);

  if (!result) {
    return (
      <p className="text-xs text-zinc-500">
        ※ 診断を受けると、この結果になった詳しいスコア内訳と根拠（回答した設問）がここに表示されます。
      </p>
    );
  }

  const primary = result.scores.find((s) => s.type === type);
  const secondary = result.secondaryType
    ? result.scores.find((s) => s.type === result.secondaryType)
    : undefined;

  if (!primary) return null;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-sm font-semibold text-zinc-500">6タイプのスコア内訳</h2>
        <div className="mt-3 flex flex-col gap-2">
          {result.scores.map((score) => (
            <div key={score.type} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-zinc-600 dark:text-zinc-400">
                {JOB_HUNTING_TYPE_CONTENT[score.type].name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score.percentage}%` }} />
              </div>
              <span className="w-10 shrink-0 text-right text-xs text-zinc-500">{score.percentage}%</span>
            </div>
          ))}
        </div>
        {result.isBlended && secondary && (
          <p className="mt-3 text-xs text-zinc-500">
            ※ {JOB_HUNTING_TYPE_CONTENT[result.primaryType].name}と{JOB_HUNTING_TYPE_CONTENT[secondary.type].name}
            の傾向が僅差でした。どちらの特徴も混ざっている可能性があります。
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500">
          {JOB_HUNTING_TYPE_CONTENT[type].name}の観点別スコア
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {primary.facets.map((facet) => (
            <div key={facet.facet} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-zinc-600 dark:text-zinc-400">{facet.facet}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${(facet.averageRating / 5) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs text-zinc-500">{facet.averageRating.toFixed(1)}/5</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500">この結果の根拠になった回答</h2>
        {primary.evidence.length === 0 ? (
          <p className="mt-2 text-xs text-zinc-500">「やや当てはまる」「とても当てはまる」と回答した設問はありませんでした。</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {primary.evidence.map((s) => (
              <li key={s.id} className="text-xs text-zinc-500">
                「{s.text}」に{s.rating === 5 ? "とても" : "やや"}当てはまると回答（{s.facet}）
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
