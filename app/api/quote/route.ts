import { createClient } from "@/lib/supabase/server";
import { notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface QuoteBody {
  name?: string;
  contact?: string;
  project?: string;
  budget?: string;
  capabilities?: unknown;
}

export async function POST(req: Request) {
  let body: QuoteBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim().slice(0, 200);
  const contact = (body.contact ?? "").toString().trim().slice(0, 200);
  const project = (body.project ?? "").toString().trim().slice(0, 4000);
  const budget = (body.budget ?? "").toString().trim().slice(0, 200) || null;
  const capabilities = Array.isArray(body.capabilities)
    ? body.capabilities
        .map((c) => String(c).trim().slice(0, 120))
        .filter(Boolean)
        .slice(0, 30)
    : [];

  if (!name || !contact || !project) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  let saved = false;

  // Persist the lead to Supabase when configured (best-effort).
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("quote_requests")
        .insert({ name, contact, project, budget, capabilities, source: "paquetes" });
      if (error) console.error("quote insert error", error.message);
      else saved = true;
    } catch (err) {
      console.error("quote route error", err);
    }
  }

  // Alert the owner over WhatsApp/SMS (best-effort, independent of the insert).
  const alert =
    "🟢 Nuevo lead ABDev (cotización)\n" +
    `Nombre: ${name}\n` +
    `Contacto: ${contact}\n` +
    (budget ? `Tipo: ${budget}\n` : "") +
    (capabilities.length ? `Capacidades: ${capabilities.join(", ")}\n` : "") +
    `Proyecto: ${project}`;
  const notified = await notifyOwner(alert);

  return Response.json({ ok: true, saved, notified: notified.ok });
}
