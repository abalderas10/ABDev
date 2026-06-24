// Server-side Twilio messaging (SMS + WhatsApp) via the REST API.
// No SDK dependency — plain fetch with Basic auth. Safe to import only from
// Node runtime route handlers (uses Buffer).
//
// Required env vars (set in Vercel):
//   TWILIO_ACCOUNT_SID      ACxxxxxxxx...
//   TWILIO_AUTH_TOKEN       your auth token
//   TWILIO_SMS_FROM         +1234567890           (for SMS)
//   TWILIO_WHATSAPP_FROM    whatsapp:+14155238886 (optional, for WhatsApp)
//   LEAD_NOTIFY_TO          +5215561800423        (where lead alerts are sent)

export interface TwilioResult {
  ok: boolean;
  /** true when Twilio isn't configured yet — caller can ignore silently. */
  skipped?: boolean;
  sid?: string;
  error?: string;
}

interface SendArgs {
  to: string; // E.164, e.g. +5215561800423
  body: string;
  channel?: "sms" | "whatsapp";
}

/** Owner's number to alert about new leads (defaults to ABDEV's number). */
const DEFAULT_NOTIFY_TO = "+525561800423";

export async function sendTwilioMessage({
  to,
  body,
  channel = "sms",
}: SendArgs): Promise<TwilioResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from =
    channel === "whatsapp"
      ? process.env.TWILIO_WHATSAPP_FROM
      : process.env.TWILIO_SMS_FROM;

  // Not configured yet — degrade quietly so the rest of the flow still works.
  if (!sid || !token || !from) {
    return { ok: false, skipped: true };
  }

  const toAddr =
    channel === "whatsapp" && !to.startsWith("whatsapp:")
      ? `whatsapp:${to}`
      : to;

  const params = new URLSearchParams({ To: toAddr, From: from, Body: body });

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );
    const data = (await res.json().catch(() => ({}))) as {
      sid?: string;
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data?.message || `HTTP ${res.status}` };
    }
    return { ok: true, sid: data?.sid };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "exception" };
  }
}

/**
 * Alert the business owner about a new lead. Prefers WhatsApp when configured,
 * otherwise falls back to SMS. Always best-effort — never throws.
 */
export async function notifyOwner(body: string): Promise<TwilioResult> {
  const to = process.env.LEAD_NOTIFY_TO || DEFAULT_NOTIFY_TO;
  const channel: "sms" | "whatsapp" = process.env.TWILIO_WHATSAPP_FROM
    ? "whatsapp"
    : "sms";
  return sendTwilioMessage({ to, body, channel });
}
