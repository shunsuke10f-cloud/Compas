import Link from "next/link";
import { notFound } from "next/navigation";
import { isJobHuntingTypeKey } from "@/lib/job-hunting/scoring";
import { JOB_HUNTING_TYPE_CONTENT } from "@/lib/job-hunting/typeContent";

export default async function DiagnosisResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isJobHuntingTypeKey(type)) {
    notFound();
  }

  const content = JOB_HUNTING_TYPE_CONTENT[type];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <p className="text-sm font-medium text-indigo-600">診断結果</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {content.name}
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{content.summary}</p>
        <p className="mt-4 text-xs text-zinc-500">
          ※この診断は合否判定ではありません。自己理解とES作成のための整理軸として活用してください。
        </p>
      </div>

      <Section title="強み">
        <BulletList items={content.strengths} />
      </Section>
      <Section title="弱み">
        <BulletList items={content.weaknesses} />
      </Section>
      <Section title="向いている職種">
        <BulletList items={content.suitableJobs} />
      </Section>
      <Section title="向いている企業文化">
        <BulletList items={content.suitableCulture} />
      </Section>
      <Section title="避けた方がよい環境">
        <BulletList items={content.avoidEnvironments} />
      </Section>
      <Section title="ESで使いやすい自己PRの方向性">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{content.selfPrDirection}</p>
      </Section>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
          さらに詳しく：根拠付き自己分析シート & ES素材の作成
        </h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          過去の経験や好き嫌いなどを詳しく入力すると、その内容だけを根拠にガクチカ・自己PR・志望動機の軸・ES文章を作成します。
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          ※本来は決済後にアクセスする有料機能です。このMVPでは決済連携は未実装のため、確認用にそのまま次の画面に進めます。
        </p>
        <Link
          href="/job-hunting/input"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-5 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          詳細入力へ進む
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-500">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-indigo-500">・</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
