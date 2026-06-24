// Server-side transactional email via Google (Gmail SMTP + App Password).
// No third-party email provider — uses the studio's own Google account.
//
// Required env vars (set in Vercel):
//   GMAIL_USER            tu-cuenta@gmail.com (o de Google Workspace)
//   GMAIL_APP_PASSWORD    contraseña de aplicación de 16 caracteres
//   MAIL_FROM             (opcional) remitente mostrado; default GMAIL_USER
//   OWNER_EMAIL           (opcional) a dónde llegan los avisos; default GMAIL_USER
//
// Crear la App Password: cuenta Google → Seguridad → Verificación en 2 pasos →
// Contraseñas de aplicaciones. Sin estas variables, el envío se omite en
// silencio y el resto del flujo sigue funcionando.

import nodemailer from "nodemailer";

export interface EmailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

let cached: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!cached) {
    cached = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return cached;
}

export function ownerEmail(): string | undefined {
  return process.env.OWNER_EMAIL || process.env.GMAIL_USER;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: SendArgs): Promise<EmailResult> {
  const transport = getTransport();
  if (!transport) return { ok: false, skipped: true };

  const fromAddr = process.env.MAIL_FROM || process.env.GMAIL_USER!;
  try {
    await transport.sendMail({
      from: `ABDev <${fromAddr}>`,
      to,
      subject,
      text,
      html,
      replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("email send error", err);
    return { ok: false, error: err instanceof Error ? err.message : "exception" };
  }
}
