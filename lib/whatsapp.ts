// Outbound WhatsApp via WAHA (self-hosted WhatsApp HTTP API).
// https://waha.devlike.pro — run your own container; any number, no templates.
//
// Required env vars (set in Vercel) once your WAHA host is up:
//   WAHA_BASE_URL   https://waha.tu-dominio.com   (sin slash final)
//   WAHA_API_KEY    (opcional) la API key que configures en WAHA
//   WAHA_SESSION    (opcional) nombre de la sesión; default "default"
//
// Sin WAHA_BASE_URL el envío se omite en silencio.

export interface WahaResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

/** Send a plain-text WhatsApp message through WAHA. `to` = E.164 or digits. */
export async function sendWahaText({
  to,
  text,
}: {
  to: string;
  text: string;
}): Promise<WahaResult> {
  const base = process.env.WAHA_BASE_URL;
  if (!base) return { ok: false, skipped: true };

  const digits = to.replace(/\D/g, "");
  if (!digits) return { ok: false, error: "no_recipient" };

  const session = process.env.WAHA_SESSION || "default";
  const apiKey = process.env.WAHA_API_KEY;
  const chatId = `${digits}@c.us`;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "X-Api-Key": apiKey } : {}),
      },
      body: JSON.stringify({ session, chatId, text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status} ${detail.slice(0, 140)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "exception" };
  }
}
