// Shared agent reply generator (non-streaming) used by channels like the
// WhatsApp webhook. The web chat (/api/agent) streams separately.

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export interface AgentMsg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate a single agent reply for the given conversation history.
 * Throws "missing_api_key" if Anthropic isn't configured so callers can
 * fall back to a static message.
 */
export async function generateReply(
  history: AgentMsg[],
  system: string = SYSTEM_PROMPT,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("missing_api_key");

  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    thinking: { type: "disabled" },
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return text || "…";
}
