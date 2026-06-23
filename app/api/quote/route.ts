import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface QuoteBody {
  name?: string;
  contact?: string;
  project?: string;
  budget?: string;
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

  if (!name || !contact || !project) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  // If Supabase isn't configured yet, fail soft (200) so the client still
  // falls back to WhatsApp instead of surfacing an error.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  ) {
    return Response.json({ ok: false, error: "unconfigured" }, { status: 200 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("quote_requests")
      .insert({ name, contact, project, budget, source: "paquetes" });

    if (error) {
      console.error("quote insert error", error.message);
      return Response.json({ ok: false, error: "insert_failed" }, { status: 200 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("quote route error", err);
    return Response.json({ ok: false, error: "exception" }, { status: 200 });
  }
}
