import { JOB_HUNTING_TYPE_KEYS, type JobHuntingTypeKey } from "./types";

export interface DiagnosisStatement {
  id: string;
  type: JobHuntingTypeKey;
  /** Short facet label within the type (e.g. "原因分析") used to show a finer-grained breakdown. */
  facet: string;
  text: string;
}

/**
 * 6 statements per type (2 per facet x 3 facets), rated on a 1-5 Likert
 * scale rather than picked as a single mutually-exclusive choice. This
 * gives every type an independent, gradual score instead of a single vote,
 * so the result can show a percentage breakdown across all 6 types plus a
 * facet-level breakdown and the exact statements that drove the score.
 */
const STATEMENTS_BY_TYPE: Record<JobHuntingTypeKey, { facet: string; text: string }[]> = {
  logical: [
    { facet: "根拠重視", text: "物事を決めるときは、感覚よりも根拠やデータを重視するほうだ" },
    { facet: "根拠重視", text: "誰かの意見を聞くとき、まず「なぜそう言えるのか」が気になる" },
    { facet: "原因分析", text: "課題に直面したら、まず原因を分解して整理したくなる" },
    { facet: "原因分析", text: "トラブルが起きたときは、感情より先に何が原因かを考える" },
    { facet: "論理的説明", text: "話をするときは、筋道立てて説明することを意識している" },
    { facet: "論理的説明", text: "自分の考えを人に伝えるときは、根拠とセットで話すようにしている" },
  ],
  empathetic: [
    { facet: "傾聴", text: "人と話すときは、相手の気持ちを汲み取ることを大事にしている" },
    { facet: "傾聴", text: "誰かが悩んでいると、まず話をじっくり聞こうとする" },
    { facet: "状況適応", text: "相手の状況に合わせて、接し方を変えるのが得意だ" },
    { facet: "状況適応", text: "場の空気や相手の感情の変化に気づきやすい" },
    { facet: "関係構築", text: "初対面の人とも、比較的早く信頼関係を築ける方だ" },
    { facet: "関係構築", text: "自分の意見より、その場の人間関係を優先することが多い" },
  ],
  challenger: [
    { facet: "行動力", text: "未経験のことでも、まずやってみようと思うタイプだ" },
    { facet: "行動力", text: "考えるより先に動いてしまうことが多い" },
    { facet: "変化適応", text: "変化が多い環境の方が、居心地よく感じる" },
    { facet: "変化適応", text: "同じことを繰り返す作業より、新しいことに挑戦する方が好きだ" },
    { facet: "失敗耐性", text: "失敗を恐れて動けなくなることは少ない" },
    { facet: "失敗耐性", text: "うまくいかなかったときも、切り替えて次に進むのが早い" },
  ],
  stability: [
    { facet: "計画性", text: "物事は計画を立ててから、着実に進めたい" },
    { facet: "計画性", text: "スケジュール通りに進んでいると安心する" },
    { facet: "継続力", text: "コツコツ積み重ねることに苦痛を感じない" },
    { facet: "継続力", text: "一度始めたことは、最後まで続けようとする" },
    { facet: "慎重さ", text: "突然の方針変更には、あまり気持ちが乗らない" },
    { facet: "慎重さ", text: "大きな決断をする前は、リスクを慎重に確かめたい" },
  ],
  independent: [
    { facet: "自律性", text: "誰かに細かく管理されるより、自分のペースで進めたい" },
    { facet: "自律性", text: "頻繁な報告・相談より、まず自分で考えて動きたい" },
    { facet: "単独集中", text: "一人で集中して取り組む作業が苦にならない" },
    { facet: "単独集中", text: "チームで進めるより、自分の担当を一人で仕上げる方が落ち着く" },
    { facet: "裁量志向", text: "自分なりのやり方を大切にしたいと思うことが多い" },
    { facet: "裁量志向", text: "細かいルールより、自分の判断で進められる方が力を発揮できる" },
  ],
  harmonizer: [
    { facet: "仲裁", text: "グループの中で意見が割れたときは、間に入って調整したくなる" },
    { facet: "仲裁", text: "対立している人同士の間に立つことが多い" },
    { facet: "全体最適", text: "チーム全体のバランスを気にしながら動くことが多い" },
    { facet: "全体最適", text: "自分の意見より、全体がうまくまとまることを優先しがちだ" },
    { facet: "役割調整", text: "誰かと誰かの意見をすり合わせる役回りになることが多い" },
    { facet: "役割調整", text: "メンバーの得意・不得意を見て、役割分担を考えることが多い" },
  ],
};

function buildStatements(): DiagnosisStatement[] {
  const statements: DiagnosisStatement[] = [];
  const perTypeLength = Math.max(
    ...JOB_HUNTING_TYPE_KEYS.map((type) => STATEMENTS_BY_TYPE[type].length)
  );

  // Interleave round-robin across types (rather than grouping by type) so
  // statements for the same type aren't answered back-to-back.
  for (let i = 0; i < perTypeLength; i++) {
    for (const type of JOB_HUNTING_TYPE_KEYS) {
      const item = STATEMENTS_BY_TYPE[type][i];
      if (item) {
        statements.push({ id: `${type}-${i + 1}`, type, facet: item.facet, text: item.text });
      }
    }
  }
  return statements;
}

export const DIAGNOSIS_STATEMENTS: DiagnosisStatement[] = buildStatements();
