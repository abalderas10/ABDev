import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The agent UI brands itself "sonnet"; keep that honest by defaulting to
// Sonnet 4.6. Override with ANTHROPIC_MODEL if desired.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "El agente no está configurado (falta ANTHROPIC_API_KEY). Escríbeme por WhatsApp: wa.me/525561800423",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  let body: { messages?: ChatMessage[]; mode?: "chat" | "voice" };
  try {
    body = await req.json();
  } catch {
    return new Response("Solicitud inválida", { status: 400 });
  }

  const history = (body.messages ?? []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && m.content,
  );
  if (history.length === 0) {
    return new Response("Sin mensajes", { status: 400 });
  }

  // Voice replies should be short and spoken-friendly.
  const system =
    body.mode === "voice"
      ? `${SYSTEM_PROMPT}\n\nEl usuario te habló por voz. Responde en 2-3 frases cortas y naturales para escuchar (sin listas ni símbolos).`
      : SYSTEM_PROMPT;

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system,
          thinking: { type: "disabled" },
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        });

        anthropicStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        console.error("agent route error", err);
        controller.enqueue(
          encoder.encode(
            "Hubo un error de conexión. Escríbeme directamente por WhatsApp: wa.me/525561800423",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
