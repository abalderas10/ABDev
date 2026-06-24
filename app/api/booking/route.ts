import { createClient } from "@/lib/supabase/server";
import { notifyOwner } from "@/lib/twilio";
import { sendEmail, ownerEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DURATION_MIN = 30;

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
  );
}

// ─── GET: busy slots in a range (no PII) ───
export async function GET(req: Request) {
  if (!supabaseConfigured()) return Response.json({ taken: [] });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!from || !to) {
    return Response.json({ error: "missing_range" }, { status: 422 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("booked_slots", {
      p_from: from,
      p_to: to,
    });
    if (error) {
      console.error("booked_slots error", error.message);
      return Response.json({ taken: [] });
    }
    const taken = (data ?? []).map(
      (r: { slot_start: string }) => r.slot_start,
    );
    return Response.json({ taken });
  } catch (err) {
    console.error("booking GET error", err);
    return Response.json({ taken: [] });
  }
}

interface BookingBody {
  name?: string;
  contact?: string;
  email?: string;
  slot?: string; // ISO 8601 with offset
  notes?: string;
}

// ─── POST: create a booking ───
export async function POST(req: Request) {
  let body: BookingBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim().slice(0, 200);
  const contact = (body.contact ?? "").toString().trim().slice(0, 200);
  const email = (body.email ?? "").toString().trim().slice(0, 200) || null;
  const notes = (body.notes ?? "").toString().trim().slice(0, 2000) || null;
  const slotRaw = (body.slot ?? "").toString().trim();

  if (!name || !contact || !slotRaw) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  // Validate the slot: parseable, in the future, aligned to :00/:30.
  const slotDate = new Date(slotRaw);
  if (Number.isNaN(slotDate.getTime())) {
    return Response.json({ ok: false, error: "bad_slot" }, { status: 422 });
  }
  if (slotDate.getTime() <= Date.now()) {
    return Response.json({ ok: false, error: "past_slot" }, { status: 422 });
  }
  const min = slotDate.getUTCMinutes();
  if (min !== 0 && min !== 30) {
    return Response.json({ ok: false, error: "unaligned_slot" }, { status: 422 });
  }
  const slotIso = slotDate.toISOString();

  if (!supabaseConfigured()) {
    return Response.json({ ok: false, error: "unconfigured" }, { status: 200 });
  }

  let saved = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("bookings").insert({
      name,
      contact,
      email,
      notes,
      slot_start: slotIso,
      duration_min: DURATION_MIN,
      source: "agenda",
    });
    if (error) {
      // Unique violation → the slot was just taken by someone else.
      if (error.code === "23505") {
        return Response.json({ ok: false, error: "slot_taken" }, { status: 409 });
      }
      console.error("booking insert error", error.message);
      return Response.json({ ok: false, error: "insert_failed" }, { status: 200 });
    }
    saved = true;
  } catch (err) {
    console.error("booking POST error", err);
    return Response.json({ ok: false, error: "exception" }, { status: 200 });
  }

  // Human-friendly slot label in CDMX.
  const when = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(slotDate);

  // Alert the owner (Twilio + email), best-effort.
  const alert =
    "🟢 Nueva cita agendada — ABDev\n" +
    `Cuándo: ${when} (CDMX)\n` +
    `Nombre: ${name}\n` +
    `Contacto: ${contact}` +
    (email ? `\nEmail: ${email}` : "") +
    (notes ? `\nNotas: ${notes}` : "");
  await notifyOwner(alert);

  const owner = ownerEmail();
  if (owner) {
    await sendEmail({
      to: owner,
      subject: `Nueva cita: ${name} — ${when}`,
      text: alert,
      replyTo: email || undefined,
    });
  }

  // Confirmation to the client if they gave an email.
  if (email) {
    await sendEmail({
      to: email,
      subject: "Tu cita con ABDev está confirmada",
      text:
        `Hola ${name},\n\n` +
        `Tu llamada de 30 minutos con ABDev quedó agendada para:\n` +
        `${when} (hora del centro de México).\n\n` +
        `Si necesitas reagendar, responde a este correo o escríbenos por WhatsApp: https://wa.me/525561800423\n\n` +
        `— Alberto, ABDev`,
    });
  }

  return Response.json({ ok: true, saved, when });
}
