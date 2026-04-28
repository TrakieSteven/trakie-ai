import { Resend } from 'resend';

const FROM = 'Trakie.ai <hello@trakie.ai>';

let resendSingleton: Resend | null = null;
function getResend(): Resend {
  if (!resendSingleton) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set');
    resendSingleton = new Resend(key);
  }
  return resendSingleton;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  const resend = getResend();
  await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
}
