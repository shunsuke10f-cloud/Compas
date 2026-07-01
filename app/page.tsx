import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24 sm:px-10">
        <div>
          <p className="text-sm font-medium text-zinc-500">Compas（コンパス）</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            自分らしく動ける人を増やす
          </h1>
          <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
            やりたいことが見つからない20代・大学生に向けた自己理解サービスです。
          </p>
        </div>

        <Link
          href="/job-hunting"
          className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span className="text-xs font-medium text-indigo-600">就活サービス</span>
          <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            診断付き自己分析・ES変換
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            無料診断で就活タイプを整理し、根拠付きの自己分析シートからガクチカ・自己PR・志望動機・ES文章まで作成できます。
          </span>
        </Link>
      </main>
    </div>
  );
}
