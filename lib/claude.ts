import Anthropic from "@anthropic-ai/sdk";

let cachedClient: Anthropic | null = null;

/** Shared Claude API client, reused by both services' AI analysis features. */
export function getAnthropicClient(): Anthropic {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable AI analysis generation."
    );
  }

  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
