"use client";

import { useEffect, useState } from "react";
import { BIG_FIVE_TRAIT_CONTENT } from "@/lib/job-hunting/bigFive";
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
      if (parsed.holland.primaryType === type) setResult(parsed);
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

  const { holland, bigFive } = result;
  const primary = holland.scores.find((s) => s.dimension === type);
  const secondary = holland.secondaryType
    ? holland.scores.find((s) => s.dimension === holland.secondaryType)
    : undefined;

  if (!primary) return null;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-sm font-semibold text-zinc-500">
          ホランドコード（職業興味の上位3タイプ）: {holland.hollandCode}
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          John Hollandの職業興味理論（RIASEC）に基づく6タイプのスコア内訳です。日本のVPI職業興味検査・
          職業レディネステストも同じ理論を土台にしています。
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {holland.scores.map((score) => (
            <BarRow
              key={score.dimension}
              label={JOB_HUNTING_TYPE_CONTENT[score.dimension].name.replace(/（.*）/, "")}
              percentage={score.percentage}
              displayValue={`${score.percentage}%`}
            />
          ))}
        </div>
        {holland.isBlended && secondary && (
          <p className="mt-3 text-xs text-zinc-500">
            ※ {JOB_HUNTING_TYPE_CONTENT[holland.primaryType].name}と
            {JOB_HUNTING_TYPE_CONTENT[secondary.dimension].name}の傾向が僅差でした。どちらの特徴も
            混ざっている可能性があります。
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500">
          {JOB_HUNTING_TYPE_CONTENT[type].name}の観点別スコア
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {primary.facets.map((facet) => (
            <BarRow
              key={facet.facet}
              label={facet.facet}
              percentage={(facet.averageRating / 5) * 100}
              displayValue={`${facet.averageRating.toFixed(1)}/5`}
              barClassName="bg-indigo-400"
              labelWidthClassName="w-24"
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500">この結果の根拠になった回答（職業興味）</h2>
        <EvidenceList
          evidence={primary.evidence}
          emptyText="「やや当てはまる」「とても当てはまる」と回答した設問はありませんでした。"
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500">行動特性スコア（ビッグファイブ）</h2>
        <p className="mt-1 text-xs text-zinc-500">
          仕事の向き不向きだけでなく、ふだんの行動のクセを心理学で最も研究されているビッグファイブ理論で
          示します。どちらの傾向にも良し悪しはありません。
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {bigFive.scores.map((trait) => {
            const content = BIG_FIVE_TRAIT_CONTENT[trait.dimension];
            const isHigh = trait.percentage >= 60;
            const isLow = trait.percentage <= 40;
            return (
              <div key={trait.dimension} className="rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                <BarRow label={content.name} percentage={trait.percentage} displayValue={`${trait.percentage}%`} />
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  {isHigh ? content.highStrength : isLow ? content.lowStrength : content.summary}
                </p>
                <EvidenceList
                  evidence={isLow ? trait.counterEvidence : trait.evidence}
                  emptyText="強くどちらかに当てはまる回答はありませんでした（バランス型）。"
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function BarRow({
  label,
  percentage,
  displayValue,
  barClassName = "bg-indigo-500",
  labelWidthClassName = "w-20",
}: {
  label: string;
  percentage: number;
  displayValue: string;
  barClassName?: string;
  labelWidthClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`${labelWidthClassName} shrink-0 text-xs text-zinc-600 dark:text-zinc-400`}>{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-12 shrink-0 text-right text-xs text-zinc-500">{displayValue}</span>
    </div>
  );
}

const RATING_PHRASES: Record<number, string> = {
  5: "とても当てはまる",
  4: "やや当てはまる",
  2: "あまり当てはまらない",
  1: "まったく当てはまらない",
};

function EvidenceList({
  evidence,
  emptyText,
}: {
  evidence: { id: string; text: string; facet: string; rating: number }[];
  emptyText: string;
}) {
  if (evidence.length === 0) {
    return <p className="mt-2 text-xs text-zinc-500">{emptyText}</p>;
  }
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {evidence.map((s) => (
        <li key={s.id} className="text-xs text-zinc-500">
          「{s.text}」に{RATING_PHRASES[s.rating] ?? "当てはまる"}と回答（{s.facet}）
        </li>
      ))}
    </ul>
  );
}
