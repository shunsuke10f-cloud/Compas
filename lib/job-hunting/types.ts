/**
 * Holland Code (RIASEC) vocational interest types — John Holland's theory
 * of career choice, the basis of Japan's JILPT VPI職業興味検査 /
 * 職業レディネステスト(VRT) and the US Department of Labor's O*NET
 * Interest Profiler. Chosen over an ad-hoc typology because it's the
 * standard, empirically studied framework for interest-to-occupation
 * matching, which is exactly what "向いている職種・環境" needs.
 */
export const JOB_HUNTING_TYPE_KEYS = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
] as const;

export type JobHuntingTypeKey = (typeof JOB_HUNTING_TYPE_KEYS)[number];

export interface JobHuntingTypeContent {
  key: JobHuntingTypeKey;
  /** Single-letter Holland code (R/I/A/S/E/C) used to display the 3-letter Holland Code. */
  code: string;
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suitableJobs: string[];
  suitableCulture: string[];
  avoidEnvironments: string[];
  selfPrDirection: string;
}

/**
 * Big Five (OCEAN) personality traits — the most empirically validated
 * personality model in industrial-organizational psychology, adapted here
 * in the public-domain IPIP tradition. RIASEC captures interest/environment
 * fit; Big Five captures work-style traits, so together they mirror how
 * real vocational assessments pair an interest inventory with a
 * personality inventory (e.g. O*NET's Interest Profiler + Work Styles).
 * "stability" here is emotional stability, i.e. the reverse of Neuroticism,
 * framed positively to stay consistent with this app's no-pass/fail stance.
 */
export const BIG_FIVE_TRAIT_KEYS = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "stability",
] as const;

export type BigFiveTraitKey = (typeof BIG_FIVE_TRAIT_KEYS)[number];

export interface BigFiveTraitContent {
  key: BigFiveTraitKey;
  name: string;
  summary: string;
  highStrength: string;
  lowStrength: string;
}

export const INPUT_CATEGORIES = [
  "past_experience",
  "timeline",
  "likes_dislikes",
  "hobby",
  "relationships",
  "strengths_weaknesses",
  "want_to_do",
  "dont_want_to_do",
  "memorable_success_failure",
  "feedback_from_others",
  "free_text",
] as const;

export type InputCategory = (typeof INPUT_CATEGORIES)[number];

export interface InputCategoryMeta {
  key: InputCategory;
  label: string;
  description: string;
  placeholder: string;
}

/** Free-text content the user entered per category. Missing/empty categories are allowed. */
export type JobHuntingInputs = Partial<Record<InputCategory, string>>;

export interface EvidenceRef {
  category: InputCategory;
  quote: string;
  /** Set server-side: whether `quote` was actually found in the user's input for `category`. */
  verified?: boolean;
}

export interface EvidencedText {
  text: string;
  evidence: EvidenceRef[];
}

export interface InterviewQuestion {
  question: string;
  reason: string;
  evidence: EvidenceRef[];
}

export interface JobHuntingAnalysisOutput {
  selfAnalysisSheet: EvidencedText;
  strengths: EvidencedText;
  values: EvidencedText;
  suitableEnvironment: EvidencedText;
  avoidEnvironment: EvidencedText;
  gakuchika: EvidencedText;
  selfPr: EvidencedText;
  motivationAxis: EvidencedText;
  resumeShort: EvidencedText;
  es400: EvidencedText;
  interviewQuestions: InterviewQuestion[];
}
