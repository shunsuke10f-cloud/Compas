import Link from "next/link";

const STEPS = [
  {
    title: "1. 無料診断",
    description: "10問の選択式診断で、あなたの就活タイプを整理します。合否判定ではなく、自己理解のための整理軸です。",
  },
  {
    title: "2. 詳細入力（有料）",
    description: "過去の経験・時系列・好き嫌い・趣味・交友関係など、自由記入で詳しく入力します。",
  },
  {
    title: "3. 根拠付き自己分析シート & ES素材の生成",
    description: "入力内容だけを根拠に、強み・価値観・ガクチカ・自己PR・志望動機の軸・ES文章などを生成します。",
  },
];

export default function JobHuntingHome() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
      <div>
        <p className="text-sm font-medium text-indigo-600">就活サービス</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          診断付き自己分析・ES変換
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          あなたが入力した情報だけを根拠に自己分析とES素材を作成します。AIが根拠なく美化した文章を作ることはありません。
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {STEPS.map((step) => (
          <li key={step.title} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
          </li>
        ))}
      </ol>

      <Link
        href="/job-hunting/diagnosis"
        className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-5 font-medium text-white transition-colors hover:bg-indigo-700 sm:w-64"
      >
        無料診断をはじめる
      </Link>
    </div>
  );
}
