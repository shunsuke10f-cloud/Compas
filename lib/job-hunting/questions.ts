import type { JobHuntingTypeKey } from "./types";

export interface DiagnosisOption {
  label: string;
  type: JobHuntingTypeKey;
}

export interface DiagnosisQuestion {
  id: string;
  prompt: string;
  options: DiagnosisOption[];
}

/**
 * 10 questions x 6 options (one per type). Each answer scores +1 for its
 * type; the highest-scoring type becomes the diagnosis result. This is a
 * self-understanding axis, not a pass/fail judgment.
 */
export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "q1",
    prompt: "グループワークで自然とやっていることが多い役割は？",
    options: [
      { label: "情報を整理してまとめる役", type: "logical" },
      { label: "メンバーの意見や気持ちを引き出す役", type: "empathetic" },
      { label: "新しいアイデアを提案する役", type: "challenger" },
      { label: "進行やスケジュールを管理する役", type: "stability" },
      { label: "自分の担当を黙々と仕上げる役", type: "independent" },
      { label: "意見が割れたときに間を取り持つ役", type: "harmonizer" },
    ],
  },
  {
    id: "q2",
    prompt: "新しいことに取り組むとき、まずどうする？",
    options: [
      { label: "情報を集めて筋道を立ててから動く", type: "logical" },
      { label: "周りの人がどう感じるかを気にしながら進める", type: "empathetic" },
      { label: "とりあえずやってみて学ぶ", type: "challenger" },
      { label: "計画を立てて着実に進める", type: "stability" },
      { label: "自分のやり方で自由に進める", type: "independent" },
      { label: "関係者の意見をまとめてから進める", type: "harmonizer" },
    ],
  },
  {
    id: "q3",
    prompt: "達成感を一番感じるのはどんなとき？",
    options: [
      { label: "筋の通った説明ができて納得してもらえたとき", type: "logical" },
      { label: "相手の力になれたと実感できたとき", type: "empathetic" },
      { label: "未経験のことに挑戦してやり遂げたとき", type: "challenger" },
      { label: "コツコツ積み上げた結果が形になったとき", type: "stability" },
      { label: "自分の裁量でやり切れたとき", type: "independent" },
      { label: "チーム全体がうまくまとまったとき", type: "harmonizer" },
    ],
  },
  {
    id: "q4",
    prompt: "苦手・避けたいと感じるのはどんな状況？",
    options: [
      { label: "根拠のないまま物事が決まっていく状況", type: "logical" },
      { label: "誰かの気持ちを置き去りにして進む状況", type: "empathetic" },
      { label: "変化がなく同じことの繰り返しが続く状況", type: "challenger" },
      { label: "計画が頻繁に変わって振り回される状況", type: "stability" },
      { label: "細かく指示・管理される状況", type: "independent" },
      { label: "意見がぶつかったまま放置される状況", type: "harmonizer" },
    ],
  },
  {
    id: "q5",
    prompt: "友人・周囲からよく言われることに近いのは？",
    options: [
      { label: "「説明がわかりやすい」「筋が通っている」", type: "logical" },
      { label: "「話を聞いてくれる」「気持ちに寄り添ってくれる」", type: "empathetic" },
      { label: "「行動が早い」「フットワークが軽い」", type: "challenger" },
      { label: "「真面目」「コツコツ続けられる」", type: "stability" },
      { label: "「マイペース」「自分の軸がある」", type: "independent" },
      { label: "「間を取り持つのがうまい」「まとめ役」", type: "harmonizer" },
    ],
  },
  {
    id: "q6",
    prompt: "作業をするときに心地よいと感じる進め方は？",
    options: [
      { label: "データや情報を整理してから進める", type: "logical" },
      { label: "人と対話しながら進める", type: "empathetic" },
      { label: "試行錯誤しながらスピード重視で進める", type: "challenger" },
      { label: "スケジュール通りに一つずつ進める", type: "stability" },
      { label: "自分のペースで一人で集中して進める", type: "independent" },
      { label: "役割分担を決めてチームで進める", type: "harmonizer" },
    ],
  },
  {
    id: "q7",
    prompt: "意思決定で一番大事にしていることは？",
    options: [
      { label: "客観的な根拠やデータ", type: "logical" },
      { label: "関わる人がどう感じるか", type: "empathetic" },
      { label: "やってみないとわからないという感覚", type: "challenger" },
      { label: "無理のない計画かどうか", type: "stability" },
      { label: "自分が納得できるかどうか", type: "independent" },
      { label: "全体のバランスが取れているか", type: "harmonizer" },
    ],
  },
  {
    id: "q8",
    prompt: "困った状況になったとき、まずすることは？",
    options: [
      { label: "何が原因かを分析する", type: "logical" },
      { label: "周りに相談して気持ちを整理する", type: "empathetic" },
      { label: "とにかく別のやり方を試してみる", type: "challenger" },
      { label: "スケジュールを立て直す", type: "stability" },
      { label: "一人で解決策を考える", type: "independent" },
      { label: "関係者を集めて状況をすり合わせる", type: "harmonizer" },
    ],
  },
  {
    id: "q9",
    prompt: "理想のチームの雰囲気に近いのは？",
    options: [
      { label: "議論が活発で根拠を持って話し合える", type: "logical" },
      { label: "お互いの状況を気にかけ合える", type: "empathetic" },
      { label: "新しいことにどんどん挑戦できる", type: "challenger" },
      { label: "役割と計画が明確で安心して進められる", type: "stability" },
      { label: "個人の裁量が尊重される", type: "independent" },
      { label: "全員の意見がフラットに扱われる", type: "harmonizer" },
    ],
  },
  {
    id: "q10",
    prompt: "自分の頑張りが一番伝わると思うエピソードのタイプは？",
    options: [
      { label: "課題を分析して解決策を導いた話", type: "logical" },
      { label: "誰かの相談に乗って支えた話", type: "empathetic" },
      { label: "未経験のことに挑戦した話", type: "challenger" },
      { label: "地道に継続して結果を出した話", type: "stability" },
      { label: "一人でやり切った話", type: "independent" },
      { label: "対立をまとめて成功させた話", type: "harmonizer" },
    ],
  },
];
