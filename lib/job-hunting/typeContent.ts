import type { JobHuntingTypeContent, JobHuntingTypeKey } from "./types";

/**
 * Content for each Holland Code (RIASEC) type, adapted for Japanese
 * job-hunting self-analysis. Definitions and typical strengths follow
 * Holland's original theory (each interest type is paired with a
 * corresponding personality/behavioral pattern, not just a job list);
 * suitable job categories are broad occupational families rather than
 * specific companies, consistent with using this as a self-understanding
 * axis rather than a pass/fail placement test.
 */
export const JOB_HUNTING_TYPE_CONTENT: Record<JobHuntingTypeKey, JobHuntingTypeContent> = {
  realistic: {
    key: "realistic",
    code: "R",
    name: "現実的型（Realistic）",
    summary:
      "道具・機械・仕組みなど、実際に手を動かして結果が目に見えるものに関心が強いタイプです。抽象論より具体的な成果を大事にします。",
    strengths: ["実践力・行動での解決力", "地道な作業への集中力", "現場の状況を的確に把握する力"],
    weaknesses: ["言語化・抽象的な説明がやや苦手なことがある", "議論より先に手を動かしたくなることがある"],
    suitableJobs: ["生産・製造技術", "施工管理・フィールドエンジニア", "ITインフラ・運用保守", "研究の実験・検証工程"],
    suitableCulture: ["成果が目に見える環境", "実務・現場での裁量がある文化"],
    avoidEnvironments: ["抽象的な議論ばかりで実行に移らない環境", "成果よりも建前や体裁が重視される環境"],
    selfPrDirection: "実際に手を動かし、具体的な成果や仕組みを作り上げてきた経験を伝える方向性。",
  },
  investigative: {
    key: "investigative",
    code: "I",
    name: "研究的型（Investigative）",
    summary:
      "物事を観察・分析し、仕組みや原理を理解することに関心が強いタイプです。知的好奇心を軸に動きます。",
    strengths: ["分析力・課題の構造化力", "知的好奇心に基づく探究力", "客観的な根拠に基づく判断力"],
    weaknesses: ["考えすぎて行動が遅くなることがある", "興味のない分野への関心が続きにくいことがある"],
    suitableJobs: ["研究開発", "データ分析・データサイエンス", "システムエンジニア", "コンサルティング(分析系)"],
    suitableCulture: ["根拠のある意思決定を重視する文化", "自由に探究・検証できる環境"],
    avoidEnvironments: ["根拠を問わず勢いで意思決定が進む環境", "分析より前例踏襲が優先される環境"],
    selfPrDirection: "課題を分析し、根拠を持って仮説検証を重ねてきた経験を伝える方向性。",
  },
  artistic: {
    key: "artistic",
    code: "A",
    name: "芸術的型（Artistic）",
    summary:
      "決まった型に沿うより、自分なりの発想や表現を大事にするタイプです。独自性やアイデアの新しさに価値を感じます。",
    strengths: ["独自の発想力・企画力", "曖昧な状況でも形にする表現力", "既存の枠にとらわれない柔軟さ"],
    weaknesses: ["定型的なルーティン作業への関心が続きにくいことがある", "細かい管理・手続きが苦手なことがある"],
    suitableJobs: ["企画・商品開発", "広告・クリエイティブ", "デザイン・編集", "広報・PR"],
    suitableCulture: ["新しい発想を歓迎する文化", "型にはまらない進め方が許容される環境"],
    avoidEnvironments: ["手順やルールが細かく固定されている環境", "前例通りであることが最優先される環境"],
    selfPrDirection: "自分なりの発想や視点で、既存のやり方にとらわれず形にしてきた経験を伝える方向性。",
  },
  social: {
    key: "social",
    code: "S",
    name: "社会的型（Social）",
    summary:
      "人と関わり、教えたり支えたりすることに関心が強いタイプです。相手の成長や状態を気にかけながら動きます。",
    strengths: ["傾聴力・対人支援力", "相手の状況に合わせた対応力", "信頼関係を築く力"],
    weaknesses: ["相手に合わせすぎて自分の意見を出しにくいことがある", "対立を避けがちになることがある"],
    suitableJobs: ["人事・採用", "教育・研修", "カスタマーサクセス", "医療福祉・対人支援"],
    suitableCulture: ["対話や育成を重視する文化", "人の成長を評価する環境"],
    avoidEnvironments: ["数字・成果だけで人を評価する環境", "個人プレー中心で対話が少ない環境"],
    selfPrDirection: "人との関わりの中で相手の状況を汲み取り、関係性を築いてきた経験を伝える方向性。",
  },
  enterprising: {
    key: "enterprising",
    code: "E",
    name: "企業的型（Enterprising）",
    summary:
      "人を巻き込み、目標に向かって主導していくことに関心が強いタイプです。競争や達成にやりがいを感じます。",
    strengths: ["リーダーシップ・巻き込み力", "目標達成への推進力", "交渉力・説得力"],
    weaknesses: ["拙速に結論を出そうとすることがある", "細かい実務作業への関心が続きにくいことがある"],
    suitableJobs: ["営業", "事業開発・新規事業", "経営企画", "商社・マネジメント職"],
    suitableCulture: ["成果・挑戦が評価される文化", "スピード感のある意思決定環境"],
    avoidEnvironments: ["前例踏襲が絶対で挑戦が評価されない環境", "意思決定に時間がかかりすぎる環境"],
    selfPrDirection: "人を巻き込みながら目標に向かって推進してきた経験を伝える方向性。",
  },
  conventional: {
    key: "conventional",
    code: "C",
    name: "慣習的型（Conventional）",
    summary:
      "決められた手順やルールに沿って、正確に物事を整理・遂行することに関心が強いタイプです。秩序と安定を大事にします。",
    strengths: ["正確性・緻密さ", "計画的に物事を遂行する力", "地道な積み重ねを継続する力"],
    weaknesses: ["急な方針転換への対応に時間がかかることがある", "前例のない判断に慎重になりすぎることがある"],
    suitableJobs: ["経理・財務", "総務・法務", "品質管理", "オペレーション・事務管理"],
    suitableCulture: ["ルールや手順が明確な文化", "計画性が評価される環境"],
    avoidEnvironments: ["場当たり的な進め方が常態化している環境", "方針が頻繁に変わる環境"],
    selfPrDirection: "決められた手順を正確に守りながら、地道に積み重ねてきた経験を伝える方向性。",
  },
};
