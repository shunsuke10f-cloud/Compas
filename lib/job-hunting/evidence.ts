import type {
  EvidenceRef,
  EvidencedText,
  InterviewQuestion,
  JobHuntingAnalysisOutput,
  JobHuntingInputs,
} from "./types";

function normalize(text: string): string {
  return text.replace(/\s+/g, "");
}

/**
 * Marks whether an evidence quote actually appears in the user's own input
 * for that category. This is the technical backstop for "show what input the
 * analysis is based on" — the UI trusts `verified`, not just Claude's claim.
 */
export function verifyEvidence(evidence: EvidenceRef, inputs: JobHuntingInputs): EvidenceRef {
  const source = inputs[evidence.category];
  const quote = evidence.quote?.trim() ?? "";
  const verified = Boolean(source) && quote.length > 0 && normalize(source ?? "").includes(normalize(quote));
  return { ...evidence, verified };
}

function verifyEvidencedText(value: EvidencedText, inputs: JobHuntingInputs): EvidencedText {
  return { ...value, evidence: value.evidence.map((e) => verifyEvidence(e, inputs)) };
}

function verifyInterviewQuestion(value: InterviewQuestion, inputs: JobHuntingInputs): InterviewQuestion {
  return { ...value, evidence: value.evidence.map((e) => verifyEvidence(e, inputs)) };
}

export function verifyAnalysisOutput(
  output: JobHuntingAnalysisOutput,
  inputs: JobHuntingInputs
): JobHuntingAnalysisOutput {
  return {
    selfAnalysisSheet: verifyEvidencedText(output.selfAnalysisSheet, inputs),
    strengths: verifyEvidencedText(output.strengths, inputs),
    values: verifyEvidencedText(output.values, inputs),
    suitableEnvironment: verifyEvidencedText(output.suitableEnvironment, inputs),
    avoidEnvironment: verifyEvidencedText(output.avoidEnvironment, inputs),
    gakuchika: verifyEvidencedText(output.gakuchika, inputs),
    selfPr: verifyEvidencedText(output.selfPr, inputs),
    motivationAxis: verifyEvidencedText(output.motivationAxis, inputs),
    resumeShort: verifyEvidencedText(output.resumeShort, inputs),
    es400: verifyEvidencedText(output.es400, inputs),
    interviewQuestions: output.interviewQuestions.map((q) => verifyInterviewQuestion(q, inputs)),
  };
}
