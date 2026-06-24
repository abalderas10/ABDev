// Centralized contact constants for ABDev.
// The prototype used the local number `5561800423`. For international wa.me
// links the country code (52 for Mexico) is required, so we keep both forms.

export const WA_NUMBER_LOCAL = "5561800423";
export const WA_NUMBER_INTL = `52${WA_NUMBER_LOCAL}`;

export const CONTACT_EMAIL = "hola@abdev.click";
export const PERSONAL_EMAIL = "alberto@abdev.click";

/** Build a wa.me link with a pre-filled (already human-readable) message. */
export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER_INTL}?text=${encodeURIComponent(message)}`;
}

/** Build an sms: link. */
export function smsLink(message: string): string {
  return `sms:+${WA_NUMBER_INTL}?&body=${encodeURIComponent(message)}`;
}

/** Build a mailto: link. */
export function mailtoLink(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export const WA_MESSAGES = {
  start: "Hola Alberto, me interesa hablar sobre mi proyecto",
  startProject: "Hola Alberto, me interesa hablar sobre mi proyecto",
  talkProject: "Hola Alberto, me interesa hablar sobre un proyecto web",
  systemQuote:
    "Hola Alberto, quiero cotizar un proyecto System (ecosistema completo con agente AI).",
  similarProject:
    "Hola Alberto, me interesa algo similar a este proyecto",
} as const;
