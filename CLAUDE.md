@AGENTS.md

# Compas

自分らしく動ける人を増やす、をコンセプトにしたNext.js (App Router) アプリ。
既存の「人生単位」サービス（無料6タイプ診断→自己分析AI→自分マップ→伴走LINEbot、詳細はNotion
「Compas 開発マスタープロンプト」参照）とは別に、就活専用の「診断付き自己分析・ES変換サービス」を
`/job-hunting` 以下に並行実装している。両サービスは `lib/supabase.ts` `lib/claude.ts` `lib/session.ts`
と `diagnoses` テーブル（`service_type` カラムで分岐）を共有する想定。

## 実装済み範囲（就活サービス MVP）

- `/job-hunting` : サービスLP
- `/job-hunting/diagnosis` : 無料診断（10問・6タイプ、`lib/job-hunting/questions.ts` + `scoring.ts`）
- `/job-hunting/result/[type]` : 診断結果（強み・弱み・向いている職種文化・避けるべき環境・自己PRの方向性、有料導線）
- `/job-hunting/input` : 有料想定の詳細入力（11カテゴリの自由記入、`lib/job-hunting/inputSchema.ts`）
- `/job-hunting/analysis` : Claude APIで根拠付き自己分析シート・強み・価値観・向いている/避けるべき環境・
  ガクチカ・自己PR・志望動機の軸・履歴書用短文・ES用文章(400字)・面接想定質問を生成し、各項目に
  入力からの引用根拠を表示

## 設計上の決定事項

- **根拠の担保**: Claudeにはtool useで構造化出力させ、各項目に `evidence: {category, quote}[]` を
  必須で持たせている（`lib/job-hunting/prompt.ts`）。さらにサーバー側で `lib/job-hunting/evidence.ts`
  が各quoteが実際にユーザー入力内に存在するかを文字列一致で検証し、`verified` フラグをUIに表示する。
  Claudeの自己申告をそのまま信用しない設計。
- **認証なしのMVP**: 実アカウントの代わりに `lib/session.ts` の匿名Cookie (`compas_session_id`) で
  Supabaseの行を紐付けている。実認証に置き換えるまでの暫定措置。
- **Supabase任意化**: `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` 未設定でもアプリは動作する
  （永続化がベストエフォートでスキップされるだけ）。フロントは診断結果・入力内容・生成結果を
  localStorageにもキャッシュしているため、DB未接続でも一連のフローを確認できる。
- **決済(Stripe)は未実装**: 詳細入力画面は本来有料機能だが、このMVPでは決済ゲートを付けていない。
  画面内に注記のみ表示している。

## 環境変数（.env.local）

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5
```

## DBスキーマ

`supabase/schema.sql` に `diagnoses`（life/job_hunting共有） `job_hunting_inputs` `job_hunting_outputs` を定義。

## 後回し（未実装・将来対応）

- Stripe決済連携（詳細入力画面のゲート）
- 企業別ES最適化
- PDF / Word出力
- 面接練習チャット
- 複数企業管理
- 他ユーザー比較
- 人生単位サービス本体（無料診断→自分マップ→LINEbot）の実装
- 実認証（Supabase Auth）への置き換え
