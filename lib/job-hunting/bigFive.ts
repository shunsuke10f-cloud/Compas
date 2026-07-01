import type { BigFiveTraitContent, BigFiveTraitKey } from "./types";

/**
 * Both ends of each Big Five trait are framed as strengths (no pole is
 * "worse"), consistent with treating this diagnosis as a self-understanding
 * axis rather than a pass/fail judgment.
 */
export const BIG_FIVE_TRAIT_CONTENT: Record<BigFiveTraitKey, BigFiveTraitContent> = {
  openness: {
    key: "openness",
    name: "開放性（Openness）",
    summary: "新しい発想・知的好奇心・変化への関心の強さを表す特性です。",
    highStrength: "新しい発想やアイデアに対する好奇心が強く、変化のある環境に適応しやすい傾向があります。",
    lowStrength: "慣れた方法やこれまでの実績を大事にしながら、着実に物事を進める傾向があります。",
  },
  conscientiousness: {
    key: "conscientiousness",
    name: "誠実性（Conscientiousness）",
    summary: "計画性・責任感・目標に向けたコツコツ度合いを表す特性です。",
    highStrength: "計画的に物事を進め、責任を持って最後までやり遂げる傾向があります。",
    lowStrength: "型にはまらず、状況に応じて柔軟にやり方を変えていく傾向があります。",
  },
  extraversion: {
    key: "extraversion",
    name: "外向性（Extraversion）",
    summary: "対人関係での積極性・エネルギーの向き先を表す特性です。",
    highStrength: "人と積極的に関わり、活発にコミュニケーションを取る傾向があります。",
    lowStrength: "落ち着いた環境で、一人でじっくり考えたり集中したりすることを得意とする傾向があります。",
  },
  agreeableness: {
    key: "agreeableness",
    name: "協調性（Agreeableness）",
    summary: "他者への配慮・協力しようとする姿勢の強さを表す特性です。",
    highStrength: "周囲と協力しながら、相手の立場を尊重して物事を進める傾向があります。",
    lowStrength: "自分の考えをはっきり主張し、周囲に流されず判断する傾向があります。",
  },
  stability: {
    key: "stability",
    name: "情緒安定性（Emotional Stability）",
    summary: "プレッシャーや予期しない出来事に対する精神的な安定度を表す特性です。",
    highStrength: "プレッシャーの中でも比較的冷静に対応し、気持ちの切り替えが早い傾向があります。",
    lowStrength: "物事に対して敏感で、変化や細部の違和感に早く気づきやすい傾向があります。",
  },
};
