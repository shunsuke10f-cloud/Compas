import { JOB_HUNTING_TYPE_KEYS, type JobHuntingTypeKey } from "./types";
import { DIAGNOSIS_STATEMENTS, type DiagnosisStatement } from "./questions";

export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

/** Maps each diagnosis statement id to the rating (1-5) the user gave it. */
export type DiagnosisAnswers = Record<string, number>;

export interface AnsweredStatement extends DiagnosisStatement {
  rating: number;
}

export interface FacetScore {
  facet: string;
  averageRating: number;
  statements: AnsweredStatement[];
}

export interface TypeScore {
  type: JobHuntingTypeKey;
  rawScore: number;
  minScore: number;
  maxScore: number;
  /** 0-100, normalized so the theoretical minimum score is 0% and maximum is 100%. */
  percentage: number;
  facets: FacetScore[];
  /** Statements rated 4 or 5 for this type, sorted by rating desc — the "evidence" for the score. */
  evidence: AnsweredStatement[];
}

export interface DiagnosisResult {
  primaryType: JobHuntingTypeKey;
  secondaryType: JobHuntingTypeKey | null;
  /** True when primary and secondary are within 10 points, i.e. the tendencies are mixed rather than clear-cut. */
  isBlended: boolean;
  /** All 6 types, sorted by percentage desc. */
  scores: TypeScore[];
}

export function isCompleteDiagnosisAnswers(answers: unknown): answers is DiagnosisAnswers {
  if (!answers || typeof answers !== "object") return false;
  const record = answers as Record<string, unknown>;
  return DIAGNOSIS_STATEMENTS.every((statement) => {
    const value = record[statement.id];
    return typeof value === "number" && Number.isInteger(value) && value >= LIKERT_MIN && value <= LIKERT_MAX;
  });
}

export function scoreJobHuntingDiagnosis(answers: DiagnosisAnswers): DiagnosisResult {
  const statementsByType = new Map<JobHuntingTypeKey, AnsweredStatement[]>();
  for (const key of JOB_HUNTING_TYPE_KEYS) statementsByType.set(key, []);

  for (const statement of DIAGNOSIS_STATEMENTS) {
    const rating = answers[statement.id];
    if (typeof rating === "number") {
      statementsByType.get(statement.type)!.push({ ...statement, rating });
    }
  }

  const scores: TypeScore[] = JOB_HUNTING_TYPE_KEYS.map((type) => {
    const statements = statementsByType.get(type)!;
    const rawScore = statements.reduce((sum, s) => sum + s.rating, 0);
    const maxScore = statements.length * LIKERT_MAX;
    const minScore = statements.length * LIKERT_MIN;
    const percentage =
      maxScore > minScore ? Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100) : 0;

    const facetOrder: string[] = [];
    const facetMap = new Map<string, AnsweredStatement[]>();
    for (const s of statements) {
      if (!facetMap.has(s.facet)) {
        facetMap.set(s.facet, []);
        facetOrder.push(s.facet);
      }
      facetMap.get(s.facet)!.push(s);
    }
    const facets: FacetScore[] = facetOrder.map((facet) => {
      const list = facetMap.get(facet)!;
      const averageRating = Math.round((list.reduce((sum, s) => sum + s.rating, 0) / list.length) * 10) / 10;
      return { facet, averageRating, statements: list };
    });

    const evidence = statements.filter((s) => s.rating >= 4).sort((a, b) => b.rating - a.rating);

    return { type, rawScore, minScore, maxScore, percentage, facets, evidence };
  }).sort((a, b) => b.percentage - a.percentage);

  const primaryType = scores[0].type;
  const secondaryType = scores[1]?.type ?? null;
  const isBlended = scores.length > 1 && scores[0].percentage - scores[1].percentage <= 10;

  return { primaryType, secondaryType, isBlended, scores };
}

export function isJobHuntingTypeKey(value: string): value is JobHuntingTypeKey {
  return (JOB_HUNTING_TYPE_KEYS as readonly string[]).includes(value);
}
