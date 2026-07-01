@AGENTS.md

# Compas

自分らしく動ける人を増やす、をコンセプトにしたNext.js (App Router) アプリ。
既存の「人生単位」サービス（無料6タイプ診断→自己分析AI→自分マップ→伴走LINEbot、詳細はNotion
「Compas 開発マスタープロンプト」参照）とは別に、就活専用の「診断付き自己分析・ES変換サービス」を
`/job-hunting` 以下に並行実装している。両サービスは `lib/supabase.ts` `lib/claude.ts` `lib/session.ts`
と `diagnoses` テーブル（`service_type` カラムで分岐）を共有する想定。

## 実装済み範囲（就活サービス MVP）

- `/job-hunting` : サービスLP
- `/job-hunting/diagnosis` : 無料診断。学術的に確立された2つの心理学モデルを2部構成で実施する
  （`lib/job-hunting/questions.ts` + `scoring.ts`）。
  - Part1: **RIASEC（ホランドの職業興味理論）** 6タイプ x 6設問（2設問 x 3facet）=36設問。
    日本のJILPT（労働政策研究・研修機構）が提供するVPI職業興味検査・職業レディネステスト(VRT)も
    同じ理論が基盤。上位3タイプを結合した「ホランドコード」（例: IRA）も算出する。
  - Part2: **ビッグファイブ（5因子性格モデル）** 5特性 x 4設問（2設問 x 2facet）=20設問。
    IPIP（International Personality Item Pool、学術研究用にパブリックドメインで公開されている
    項目プール）の構成に準拠したオリジナル設問。神経症傾向は「情緒安定性」として正方向に言い換え、
    向き不向きの善し悪しを付けない設計に統一している。
  - 合計56設問を5段階リッカート尺度で回答。単一選択の多数決ではなく、次元ごとに独立した0-100%
    スコアを算出する（`scoreJobHuntingDiagnosis` → `{ holland, bigFive }`）。
- `/job-hunting/result/[type]` : 診断結果（強み・弱み・向いている職種文化・避けるべき環境・自己PRの方向性、
  有料導線）に加えて `DiagnosisBreakdown` がホランドコード・6タイプのスコア内訳・観点別(facet)スコア・
  ビッグファイブ5特性のスコアと根拠になった具体的な回答文をlocalStorageの診断結果から表示する
- `/job-hunting/input` : 有料想定の詳細入力（11カテゴリの自由記入、`lib/job-hunting/inputSchema.ts`）
- `/job-hunting/analysis` : Claude APIで根拠付き自己分析シート・強み・価値観・向いている/避けるべき環境・
  ガクチカ・自己PR・志望動機の軸・履歴書用短文・ES用文章(400字)・面接想定質問を生成し、各項目に
  入力からの引用根拠を表示

## 設計上の決定事項

- **診断モデルの選定理由**: 独自の6タイプ分類をやめ、RIASEC（Holland, 1959〜）とビッグファイブという、
  職業心理学・人格心理学で数十年にわたり検証されてきた2つの実在モデルに置き換えた。RIASECは
  「興味と職業環境の適合」を、ビッグファイブは「行動特性・仕事の進め方」を担当し、実際の職業適性検査
  （米国労働省のO*NET Interest Profiler、JILPTのVPI/VRT等）が興味検査と性格検査を併用する構成を踏襲
  している。`lib/job-hunting/scoring.ts` の `scoreDimensions` が両モデル共通のスコアリングエンジンで、
  次元ごとに0-100%の独立したスコア・facet別スコア・根拠（4/5と回答した設問の原文）を算出する。AIを
  使わず決定論的に計算しているため無料でも高速。結果画面ではRIASECの6タイプスコア内訳とホランドコード、
  対象タイプの観点別(facet)スコア、根拠になった回答に加え、ビッグファイブ5特性のスコアと根拠（低い極の
  場合は「あまり/全く当てはまらない」と回答した設問を根拠として表示）を出す。両タイプが僅差の場合は
  複合タイプの可能性も明示する。
- **根拠の担保（有料AI分析）**: Claudeにはtool useで構造化出力させ、各項目に `evidence: {category, quote}[]` を
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
