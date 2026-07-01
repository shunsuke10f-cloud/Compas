import { JOB_HUNTING_TYPE_KEYS, type JobHuntingTypeKey } from "./types";

/**
 * Picks the type with the most matching answers. Ties are broken by the
 * fixed order of JOB_HUNTING_TYPE_KEYS so the result is deterministic.
 */
export function scoreJobHuntingType(answers: JobHuntingTypeKey[]): JobHuntingTypeKey {
  const counts = Object.fromEntries(
    JOB_HUNTING_TYPE_KEYS.map((key) => [key, 0])
  ) as Record<JobHuntingTypeKey, number>;

  for (const answer of answers) {
    if (answer in counts) counts[answer] += 1;
  }

  let best: JobHuntingTypeKey = JOB_HUNTING_TYPE_KEYS[0];
  let bestScore = -1;
  for (const key of JOB_HUNTING_TYPE_KEYS) {
    if (counts[key] > bestScore) {
      bestScore = counts[key];
      best = key;
    }
  }
  return best;
}

export function isJobHuntingTypeKey(value: string): value is JobHuntingTypeKey {
  return (JOB_HUNTING_TYPE_KEYS as readonly string[]).includes(value);
}
