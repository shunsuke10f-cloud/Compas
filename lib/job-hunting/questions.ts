import { BIG_FIVE_TRAIT_KEYS, JOB_HUNTING_TYPE_KEYS, type BigFiveTraitKey, type JobHuntingTypeKey } from "./types";

export interface DiagnosisStatement<K extends string = string> {
  id: string;
  dimension: K;
  /** Short facet label within the dimension, used to show a finer-grained breakdown. */
  facet: string;
  text: string;
}

function buildStatements<K extends string>(
  keys: readonly K[],
  byDimension: Record<K, { facet: string; text: string }[]>
): DiagnosisStatement<K>[] {
  const statements: DiagnosisStatement<K>[] = [];
  const perDimensionLength = Math.max(...keys.map((key) => byDimension[key].length));

  // Interleave round-robin across dimensions (rather than grouping) so
  // statements for the same dimension aren't answered back-to-back.
  for (let i = 0; i < perDimensionLength; i++) {
    for (const key of keys) {
      const item = byDimension[key][i];
      if (item) {
        statements.push({ id: `${key}-${i + 1}`, dimension: key, facet: item.facet, text: item.text });
      }
    }
  }
  return statements;
}

/**
 * RIASEC (Holland Code) statements: 3 facets x 2 statements per type = 6
 * statements per type, rated on a 1-5 Likert scale. Facets follow the
 * behavioral patterns Holland associated with each interest type, not
 * ad-hoc categories.
 */
const RIASEC_STATEMENTS_BY_TYPE: Record<JobHuntingTypeKey, { facet: string; text: string }[]> = {
  realistic: [
    { facet: "実践志向", text: "議論より先に、実際に手を動かして確かめたくなる" },
    { facet: "実践志向", text: "抽象的な話より、具体的な作業の方が性に合う" },
    { facet: "技術・道具への関心", text: "機械や道具、システムの仕組みに関心がある" },
    { facet: "技術・道具への関心", text: "何かを組み立てたり修理したりするのが好きだ" },
    { facet: "結果重視", text: "話し合いの結果よりも、目に見える成果を重視する" },
    { facet: "結果重視", text: "計画よりも、まず実行して結果を出すことを優先したい" },
  ],
  investigative: [
    { facet: "知的好奇心", text: "物事の仕組みや原理を理解したいという欲求が強い" },
    { facet: "知的好奇心", text: "新しい知識や情報を調べること自体が楽しい" },
    { facet: "分析的思考", text: "データや事実をもとに、筋道立てて考えるのが得意だ" },
    { facet: "分析的思考", text: "課題に直面したら、まず原因を分解して整理したくなる" },
    { facet: "独立した探究", text: "一人でじっくり考え、答えを見つけていく作業に集中できる" },
    { facet: "独立した探究", text: "誰かに指示されるより、自分で仮説を立てて検証したい" },
  ],
  artistic: [
    { facet: "創造性", text: "決まったやり方より、自分なりの新しい方法を考えたくなる" },
    { facet: "創造性", text: "アイデアを思いつくこと自体にやりがいを感じる" },
    { facet: "自己表現", text: "自分の感性や考えを形にして表現するのが好きだ" },
    { facet: "自己表現", text: "文章・デザイン・企画など、何かを作り出す作業に惹かれる" },
    { facet: "非定型性への適性", text: "細かく手順が決まっている作業より、自由度の高い作業を好む" },
    { facet: "非定型性への適性", text: "正解が一つに決まっていない問いを考えるのが苦にならない" },
  ],
  social: [
    { facet: "対人支援", text: "誰かの役に立てていると感じるときにやりがいを感じる" },
    { facet: "対人支援", text: "困っている人を見ると、放っておけずに手を差し伸べたくなる" },
    { facet: "協働・教育", text: "人に何かを教えたり、成長を手伝ったりするのが好きだ" },
    { facet: "協働・教育", text: "一人で完結する作業より、人と協力して進める作業を好む" },
    { facet: "共感的理解", text: "人と話すときは、相手の気持ちを汲み取ることを大事にしている" },
    { facet: "共感的理解", text: "相手の状況に合わせて、接し方を変えるのが得意だ" },
  ],
  enterprising: [
    { facet: "説得・リーダーシップ", text: "周囲を巻き込んで物事を前に進めるのが得意だ" },
    { facet: "説得・リーダーシップ", text: "人を説得したり交渉したりすることに苦手意識がない" },
    { facet: "目標達成志向", text: "目標や数字が明確にある方がやる気が出る" },
    { facet: "目標達成志向", text: "競争のある環境の方が力を発揮できる" },
    { facet: "リスクテイク", text: "多少のリスクがあっても、チャンスがあれば挑戦したい" },
    { facet: "リスクテイク", text: "慎重に検討するより、まず決断して動く方を好む" },
  ],
  conventional: [
    { facet: "秩序・正確性", text: "決められた手順やルールに沿って、正確に物事を進めたい" },
    { facet: "秩序・正確性", text: "細かいミスや漏れがないか、確認する作業を苦に感じない" },
    { facet: "計画的遂行", text: "スケジュールを立てて、その通りに進めると安心する" },
    { facet: "計画的遂行", text: "物事はコツコツ積み重ねて、着実に仕上げたい" },
    { facet: "データ・詳細への注意", text: "数字や記録を整理・管理する作業が苦にならない" },
    { facet: "データ・詳細への注意", text: "曖昧なルールより、明確に定められた基準の方が動きやすい" },
  ],
};

export const RIASEC_STATEMENTS: DiagnosisStatement<JobHuntingTypeKey>[] = buildStatements(
  JOB_HUNTING_TYPE_KEYS,
  RIASEC_STATEMENTS_BY_TYPE
);

/**
 * Big Five statements: 2 facets x 2 statements per trait = 4 statements per
 * trait, rated on the same 1-5 scale. Phrasing is original (not copied from
 * any commercial inventory) but tracks the standard IPIP facet themes for
 * each trait, since IPIP is explicitly public domain for this kind of reuse.
 */
const BIG_FIVE_STATEMENTS_BY_TRAIT: Record<BigFiveTraitKey, { facet: string; text: string }[]> = {
  openness: [
    { facet: "好奇心", text: "新しい考え方や物事を試すことに興味がある" },
    { facet: "好奇心", text: "これまでとは違うやり方を試してみたくなることが多い" },
    { facet: "創造性", text: "抽象的なテーマについて考えるのが好きだ" },
    { facet: "創造性", text: "アートや音楽、デザインなど、感性を刺激されるものに関心がある" },
  ],
  conscientiousness: [
    { facet: "計画性", text: "物事を計画的に、順序立てて進めるのが得意だ" },
    { facet: "計画性", text: "期限や約束を守ることを強く意識している" },
    { facet: "責任感", text: "一度引き受けたことは最後まで責任を持ってやり遂げる" },
    { facet: "責任感", text: "細かい作業やルールを守ることを苦に感じない" },
  ],
  extraversion: [
    { facet: "社交性", text: "初対面の人とも積極的に話しかける方だ" },
    { facet: "社交性", text: "大勢の人といる場面でエネルギーが湧いてくる" },
    { facet: "積極性", text: "自分の意見や考えを積極的に発言する方だ" },
    { facet: "積極性", text: "静かに過ごすより、活発に活動している方が好きだ" },
  ],
  agreeableness: [
    { facet: "協調性", text: "意見が対立したときも、相手の立場を尊重しようとする" },
    { facet: "協調性", text: "自分の手柄より、チームの成果を優先することが多い" },
    { facet: "利他性", text: "人を信頼し、性善説で物事を考える方だ" },
    { facet: "利他性", text: "誰かのために自分の時間や労力を割くことをいとわない" },
  ],
  stability: [
    { facet: "冷静さ", text: "プレッシャーの中でも比較的冷静でいられる" },
    { facet: "冷静さ", text: "予定外のトラブルが起きても、動揺しすぎずに対応できる" },
    { facet: "切り替え力", text: "失敗しても引きずらず、切り替えるのが早い方だ" },
    { facet: "切り替え力", text: "不安を感じることがあっても、それに振り回されにくい" },
  ],
};

export const BIG_FIVE_STATEMENTS: DiagnosisStatement<BigFiveTraitKey>[] = buildStatements(
  BIG_FIVE_TRAIT_KEYS,
  BIG_FIVE_STATEMENTS_BY_TRAIT
);
