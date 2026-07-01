# Compas

自分らしく動ける人を増やす、をコンセプトにしたNext.js (App Router) アプリ。

現在実装済みなのは、就活専用の「診断付き自己分析・ES変換サービス」（`/job-hunting` 以下）です。
設計判断や既存サービスとの関係は [CLAUDE.md](./CLAUDE.md) を参照してください。

## Getting Started

```bash
npm install
cp .env.local.example .env.local # ANTHROPIC_API_KEY 等を設定
npm run dev
```

[http://localhost:3000/job-hunting](http://localhost:3000/job-hunting) を開くとサービスが確認できます。

Supabase (`NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`) を設定していない場合でも、
診断・詳細入力・自己分析シート生成の一連の流れはブラウザのlocalStorageキャッシュで動作します
（DBへの永続化のみベストエフォートでスキップされます）。DBを使う場合は `supabase/schema.sql` を
Supabaseプロジェクトに適用してください。

自己分析シート生成には `ANTHROPIC_API_KEY` が必要です。
