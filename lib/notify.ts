// Owner lead alerts — routed across the configured channels, best-effort.
// Priority: WAHA (self-hosted WhatsApp) → Twilio WhatsApp → Twilio SMS.
// Every channel degrades quietly, so the site works with none configured.

import { sendWahaText } from "@/lib/whatsapp";
import { sendTwilioMessage } from "@/lib/twilio";

/** Owner's number (defaults to ABDev's). Override with LEAD_NOTIFY_TO. */
const DEFAULT_NOTIFY_TO = "+525561800423";

export interface NotifyResult {
  ok: boolean;
  via: "waha" | "twilio-whatsapp" | "twilio-sms" | "none" | "failed";
}

export async function notifyOwner(body: string): Promise<NotifyResult> {
  const to = process.env.LEAD_NOTIFY_TO || DEFAULT_NOTIFY_TO;

  // 1) WAHA — preferred WhatsApp channel.
  const waha = await sendWahaText({ to, text: body });
  if (waha.ok) return { ok: true, via: "waha" };

  // 2) Twilio — WhatsApp if a sender is set, otherwise SMS.
  const channel: "whatsapp" | "sms" = process.env.TWILIO_WHATSAPP_FROM
    ? "whatsapp"
    : "sms";
  const tw = await sendTwilioMessage({ to, body, channel });
  if (tw.ok) {
    return { ok: true, via: channel === "whatsapp" ? "twilio-whatsapp" : "twilio-sms" };
  }

  return { ok: false, via: waha.skipped && tw.skipped ? "none" : "failed" };
}
