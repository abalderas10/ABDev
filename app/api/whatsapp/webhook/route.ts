import { createClient } from "@/lib/supabase/server";
import { sendWahaText } from "@/lib/whatsapp";
import { generateReply, type AgentMsg } from "@/lib/agent/run";
import { SYSTEM_PROMPT } from "@/lib/agent/system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// WhatsApp-tailored system prompt: short, natural, no markdown.
const WA_SYSTEM = `${SYSTEM_PROMPT}

Estás respondiendo por WhatsApp. Sé breve y natural (1-4 frases), en español, sin markdown ni listas largas. Si el cliente quiere agendar una llamada, invítalo a hacerlo en https://abdev.click/#agenda. Si pide hablar con una persona, dile que Alberto le escribe en breve.`;

const FALLBACK =
  "¡Hola! Gracias por escribir a ABDev. En un momento te responde Alberto. " +
  "Mientras, cuéntame qué necesitas y con gusto te oriento.";

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
  );
}

interface WahaWebhook {
  event?: string;
  payload?: {
    from?: string;
    body?: string;
    fromMe?: boolean;
  };
}

// WAHA posts incoming messages here. Configure in WAHA:
//   webhook URL: https://abdev.click/api/whatsapp/webhook?token=XXXX
//   events: ["message"]
export async function POST(req: Request) {
  // Optional shared-secret check.
  const token = process.env.WAHA_WEBHOOK_TOKEN;
  if (token) {
    const url = new URL(req.url);
    if (url.searchParams.get("token") !== token) {
      return new Response("unauthorized", { status: 401 });
    }
  }

  let body: WahaWebhook;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: true });
  }

  // Only react to inbound 1:1 text messages.
  if (body.event !== "message") return Response.json({ ok: true });
  const p = body.payload ?? {};
  const from = (p.from ?? "").toString();
  const text = (p.body ?? "").toString().trim();
  if (p.fromMe || !from || from.endsWith("@g.us") || !text) {
    return Response.json({ ok: true });
  }

  const haveDb = supabaseConfigured();
  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  let history: AgentMsg[] = [];

  if (haveDb) {
    try {
      supabase = await createClient();
      await supabase.rpc("append_wa_message", {
        p_chat: from,
        p_role: "user",
        p_content: text,
      });
      const { data } = await supabase.rpc("get_wa_history", {
        p_chat: from,
        p_limit: 12,
      });
      history = ((data ?? []) as { role: string; content: string }[]).map(
        (r) => ({ role: r.role as "user" | "assistant", content: r.content }),
      );
    } catch (err) {
      console.error("wa memory error", err);
    }
  }
  if (history.length === 0) history = [{ role: "user", content: text }];

  let reply = "";
  try {
    reply = await generateReply(history, WA_SYSTEM);
  } catch (err) {
    console.error("wa agent error", err);
    reply = FALLBACK;
  }

  if (supabase && reply) {
    try {
      await supabase.rpc("append_wa_message", {
        p_chat: from,
        p_role: "assistant",
        p_content: reply,
      });
    } catch (err) {
      console.error("wa memory append error", err);
    }
  }

  await sendWahaText({ to: from, text: reply });
  return Response.json({ ok: true });
}
