import type Anthropic from "@anthropic-ai/sdk";
import { INPUT_CATEGORY_META } from "./inputSchema";
import { JOB_HUNTING_TYPE_CONTENT } from "./typeContent";
import type { JobHuntingInputs, JobHuntingTypeKey } from "./types";
import { INPUT_CATEGORIES } from "./types";

const evidenceSchema = {
  type: "array",
  description:
    "この項目の根拠。ユーザー入力から実際にそのまま抜き出した一節のみを入れる。根拠が無い場合は空配列にする。",
  items: {
    type: "object",
    properties: {
      category: { type: "string", enum: INPUT_CATEGORIES as unknown as string[] },
      quote: {
        type: "string",
        description: "該当カテゴリの入力文から、言い換えずそのまま抜き出した一節。",
      },
    },
    required: ["category", "quote"],
  },
};

const evidencedTextSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
    evidence: evidenceSchema,
  },
  required: ["text", "evidence"],
};

export const ANALYSIS_TOOL_NAME = "submit_job_hunting_analysis";

export const ANALYSIS_TOOL: Anthropic.Tool = {
  name: ANALYSIS_TOOL_NAME,
  description: "根拠付きの就活自己分析結果とES素材を構造化データとして提出する。",
  input_schema: {
    type: "object",
    properties: {
      selfAnalysisSheet: evidencedTextSchema,
      strengths: evidencedTextSchema,
      values: evidencedTextSchema,
      suitableEnvironment: evidencedTextSchema,
      avoidEnvironment: evidencedTextSchema,
      gakuchika: evidencedTextSchema,
      selfPr: evidencedTextSchema,
      motivationAxis: evidencedTextSchema,
      resumeShort: evidencedTextSchema,
      es400: evidencedTextSchema,
      interviewQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            reason: { type: "string", description: "なぜこの質問が深掘りされやすいかの理由" },
            evidence: evidenceSchema,
          },
          required: ["question", "reason", "evidence"],
        },
      },
    },
    required: [
      "selfAnalysisSheet",
      "strengths",
      "values",
      "suitableEnvironment",
      "avoidEnvironment",
      "gakuchika",
      "selfPr",
      "motivationAxis",
      "resumeShort",
      "es400",
      "interviewQuestions",
    ],
  },
};

const SYSTEM_PROMPT = `あなたは就活生の自己分析とES(エントリーシート)作成を支援するアシスタントです。
以下のルールを必ず守ってください。

1. ユーザーが入力した情報だけを根拠にすること。入力に書かれていない経験・成果・数字・エピソードを作らない、誇張しない。
2. すべての出力項目について、evidenceにその項目を導いた根拠を入れること。根拠は該当する入力カテゴリの原文から、言い換えずそのまま抜き出すこと。該当する根拠が入力内に見当たらない場合は、evidenceを空配列にし、textの表現も断定を避けた弱い表現にすること。
3. 診断タイプは合否判定ではなく、自己理解とES作成のための整理軸として扱うこと。タイプを理由に「向いていない」「無理」といった否定的な断定はしないこと。
4. es400のtextは日本語で400字程度(360字〜440字の範囲)に収めること。resumeShortのtextは120字程度に収めること。
5. 出力は必ずsubmit_job_hunting_analysisツールを使って構造化データとして提出すること。すべての文章は日本語で書くこと。
6. gakuchika(ガクチカ)、selfPr(自己PR)、motivationAxis(志望動機の軸)は、それぞれ入力された経験・エピソードに基づいて書くこと。企業名や職種名など入力にない固有情報は使わないこと。
7. interviewQuestionsは、提出したgakuchika・selfPr・motivationAxis・selfAnalysisSheetの内容に対して、面接官が深掘りしそうな質問を3〜5個作ること。`;

export function buildAnalysisPrompt(
  typeKey: JobHuntingTypeKey,
  inputs: JobHuntingInputs
): { system: string; user: string } {
  const type = JOB_HUNTING_TYPE_CONTENT[typeKey];

  const filledCategories = INPUT_CATEGORY_META.filter(
    (meta) => (inputs[meta.key] ?? "").trim().length > 0
  );

  const inputSection = filledCategories
    .map((meta) => `### ${meta.label}（category: ${meta.key}）\n${inputs[meta.key]}`)
    .join("\n\n");

  const user = `## 就活タイプ診断結果（整理軸として参照。合否判定ではない）
タイプ名：${type.name}
概要：${type.summary}

## ユーザーが入力した情報
${inputSection || "（入力なし）"}

## 依頼内容
上記の入力情報のみを根拠に、submit_job_hunting_analysisツールで以下を生成してください。
- selfAnalysisSheet: 根拠付き自己分析シートの総括文
- strengths: 強みの整理
- values: 価値観の整理
- suitableEnvironment: 向いている職種・環境
- avoidEnvironment: 避けた方がよい環境
- gakuchika: ガクチカ候補（1つの具体的エピソードを軸にする）
- selfPr: 自己PR候補
- motivationAxis: 志望動機の軸（特定の企業名は使わず、どんな軸で企業を選ぶとよいかを整理する）
- resumeShort: 履歴書用の短い自己PR文
- es400: 400字程度のES用文章
- interviewQuestions: 面接で深掘りされやすい質問`;

  return { system: SYSTEM_PROMPT, user };
}
