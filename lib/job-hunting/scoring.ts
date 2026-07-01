import { BIG_FIVE_TRAIT_KEYS, JOB_HUNTING_TYPE_KEYS, type BigFiveTraitKey, type JobHuntingTypeKey } from "./types";
import { BIG_FIVE_STATEMENTS, RIASEC_STATEMENTS, type DiagnosisStatement } from "./questions";
import { JOB_HUNTING_TYPE_CONTENT } from "./typeContent";

export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

/** Maps every diagnosis statement id (both RIASEC and Big Five) to the rating (1-5) given. */
export type DiagnosisAnswers = Record<string, number>;

export interface AnsweredStatement<K extends string = string> extends DiagnosisStatement<K> {
  rating: number;
}

export interface FacetScore<K extends string = string> {
  facet: string;
  averageRating: number;
  statements: AnsweredStatement<K>[];
}

export interface DimensionScore<K extends string = string> {
  dimension: K;
  rawScore: number;
  minScore: number;
  maxScore: number;
  /** 0-100, normalized so the theoretical minimum score is 0% and maximum is 100%. */
  percentage: number;
  facets: FacetScore<K>[];
  /** Statements rated 4 or 5, sorted by rating desc — the "evidence" for a high score on this dimension. */
  evidence: AnsweredStatement<K>[];
  /** Statements rated 1 or 2, sorted by rating asc — evidence for the opposite pole (used for bipolar traits like Big Five). */
  counterEvidence: AnsweredStatement<K>[];
}

function scoreDimensions<K extends string>(
  keys: readonly K[],
  statements: DiagnosisStatement<K>[],
  answers: DiagnosisAnswers
): DimensionScore<K>[] {
  const statementsByDimension = new Map<K, AnsweredStatement<K>[]>();
  for (const key of keys) statementsByDimension.set(key, []);

  for (const statement of statements) {
    const rating = answers[statement.id];
    if (typeof rating === "number") {
      statementsByDimension.get(statement.dimension)!.push({ ...statement, rating });
    }
  }

  return keys.map((dimension) => {
    const dimensionStatements = statementsByDimension.get(dimension)!;
    const rawScore = dimensionStatements.reduce((sum, s) => sum + s.rating, 0);
    const maxScore = dimensionStatements.length * LIKERT_MAX;
    const minScore = dimensionStatements.length * LIKERT_MIN;
    const percentage =
      maxScore > minScore ? Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100) : 0;

    const facetOrder: string[] = [];
    const facetMap = new Map<string, AnsweredStatement<K>[]>();
    for (const s of dimensionStatements) {
      if (!facetMap.has(s.facet)) {
        facetMap.set(s.facet, []);
        facetOrder.push(s.facet);
      }
      facetMap.get(s.facet)!.push(s);
    }
    const facets: FacetScore<K>[] = facetOrder.map((facet) => {
      const list = facetMap.get(facet)!;
      const averageRating = Math.round((list.reduce((sum, s) => sum + s.rating, 0) / list.length) * 10) / 10;
      return { facet, averageRating, statements: list };
    });

    const evidence = dimensionStatements.filter((s) => s.rating >= 4).sort((a, b) => b.rating - a.rating);
    const counterEvidence = dimensionStatements.filter((s) => s.rating <= 2).sort((a, b) => a.rating - b.rating);

    return { dimension, rawScore, minScore, maxScore, percentage, facets, evidence, counterEvidence };
  });
}

export interface HollandResult {
  primaryType: JobHuntingTypeKey;
  secondaryType: JobHuntingTypeKey | null;
  /** True when primary and secondary are within 10 points, i.e. the tendencies are mixed rather than clear-cut. */
  isBlended: boolean;
  /** Top 3 types concatenated as single-letter codes, e.g. "SEC" — the standard Holland Code summary. */
  hollandCode: string;
  /** All 6 types, sorted by percentage desc. */
  scores: DimensionScore<JobHuntingTypeKey>[];
}

export interface BigFiveResult {
  /** All 5 traits, in fixed OCEAN order (there is no "winning" trait). */
  scores: DimensionScore<BigFiveTraitKey>[];
}

export interface DiagnosisResult {
  holland: HollandResult;
  bigFive: BigFiveResult;
}

function scoreHolland(answers: DiagnosisAnswers): HollandResult {
  const scores = scoreDimensions(JOB_HUNTING_TYPE_KEYS, RIASEC_STATEMENTS, answers).sort(
    (a, b) => b.percentage - a.percentage
  );

  const primaryType = scores[0].dimension;
  const secondaryType = scores[1]?.dimension ?? null;
  const isBlended = scores.length > 1 && scores[0].percentage - scores[1].percentage <= 10;
  const hollandCode = scores
    .slice(0, 3)
    .map((s) => JOB_HUNTING_TYPE_CONTENT[s.dimension].code)
    .join("");

  return { primaryType, secondaryType, isBlended, hollandCode, scores };
}

function scoreBigFive(answers: DiagnosisAnswers): BigFiveResult {
  const scores = scoreDimensions(BIG_FIVE_TRAIT_KEYS, BIG_FIVE_STATEMENTS, answers);
  return { scores };
}

export function isCompleteDiagnosisAnswers(answers: unknown): answers is DiagnosisAnswers {
  if (!answers || typeof answers !== "object") return false;
  const record = answers as Record<string, unknown>;
  return [...RIASEC_STATEMENTS, ...BIG_FIVE_STATEMENTS].every((statement) => {
    const value = record[statement.id];
    return typeof value === "number" && Number.isInteger(value) && value >= LIKERT_MIN && value <= LIKERT_MAX;
  });
}

export function scoreJobHuntingDiagnosis(answers: DiagnosisAnswers): DiagnosisResult {
  return { holland: scoreHolland(answers), bigFive: scoreBigFive(answers) };
}

export function isJobHuntingTypeKey(value: string): value is JobHuntingTypeKey {
  return (JOB_HUNTING_TYPE_KEYS as readonly string[]).includes(value);
}
