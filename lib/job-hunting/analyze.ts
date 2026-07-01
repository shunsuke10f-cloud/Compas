import type Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL, getAnthropicClient } from "@/lib/claude";
import { verifyAnalysisOutput } from "./evidence";
import { ANALYSIS_TOOL, ANALYSIS_TOOL_NAME, buildAnalysisPrompt } from "./prompt";
import type { JobHuntingAnalysisOutput, JobHuntingInputs, JobHuntingTypeKey } from "./types";

export async function generateJobHuntingAnalysis(
  typeKey: JobHuntingTypeKey,
  inputs: JobHuntingInputs
): Promise<JobHuntingAnalysisOutput> {
  const client = getAnthropicClient();
  const { system, user } = buildAnalysisPrompt(typeKey, inputs);

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: user }],
    tools: [ANALYSIS_TOOL],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL_NAME },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claudeが構造化された分析結果を返しませんでした。");
  }

  const rawOutput = toolUse.input as JobHuntingAnalysisOutput;
  return verifyAnalysisOutput(rawOutput, inputs);
}
