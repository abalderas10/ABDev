import { createClient } from "@/lib/supabase/server";
import { notifyOwner } from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface NotifyBody {
  phone?: string;
  email?: string;
  kind?: string;
}

// Lightweight lead capture used by the agent demo's multichannel view
// ("Recibir llamada del agente AI"). Persists the lead and alerts the owner.
export async function POST(req: Request) {
  let body: NotifyBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const phone = (body.phone ?? "").toString().trim().slice(0, 40);
  const email = (body.email ?? "").toString().trim().slice(0, 200);
  const kind =
    (body.kind ?? "").toString().trim().slice(0, 200) ||
    "Solicita contacto desde la demo del agente";

  const contact = [phone, email].filter(Boolean).join(" · ");
  if (!contact) {
    return Response.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }

  let saved = false;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("quote_requests").insert({
        name: "Lead desde demo del agente",
        contact,
        project: kind,
        capabilities: [],
        source: "agente-demo",
      });
      if (error) console.error("notify insert error", error.message);
      else saved = true;
    } catch (err) {
      console.error("notify route error", err);
    }
  }

  const alert =
    "🟢 Nuevo lead ABDev (demo del agente)\n" +
    `${kind}\n` +
    `Contacto: ${contact}`;
  const notified = await notifyOwner(alert);

  return Response.json({ ok: true, saved, notified: notified.ok });
}
