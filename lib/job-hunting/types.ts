export const JOB_HUNTING_TYPE_KEYS = [
  "logical",
  "empathetic",
  "challenger",
  "stability",
  "independent",
  "harmonizer",
] as const;

export type JobHuntingTypeKey = (typeof JOB_HUNTING_TYPE_KEYS)[number];

export interface JobHuntingTypeContent {
  key: JobHuntingTypeKey;
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suitableJobs: string[];
  suitableCulture: string[];
  avoidEnvironments: string[];
  selfPrDirection: string;
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
