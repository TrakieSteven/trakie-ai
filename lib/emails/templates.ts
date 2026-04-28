type EmailContent = { subject: string; html: string };

const SITE_URL = 'https://trakie.ai';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function shell(opts: {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const year = new Date().getFullYear();
  const footerNote = opts.footerNote ?? 'You received this email because of activity on your Trakie.ai account.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#0D1F0D;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  ${opts.preheader ? `<div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${opts.preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1F0D;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#111c11;border:1px solid #2a3d2a;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:40px 40px 32px;border-bottom:1px solid #2a3d2a;">
              <p style="margin:0;font-size:28px;font-weight:700;letter-spacing:0.12em;color:#C9A961;font-family:Georgia,serif;">TRAKIE.AI</p>
              <p style="margin:8px 0 0;font-size:13px;color:#6b8f6b;letter-spacing:0.08em;text-transform:uppercase;">Cannabis Retail Intelligence</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">${opts.bodyHtml}</td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2a3d2a;">
              <p style="margin:0;font-size:12px;color:#4a6b4a;line-height:1.6;">
                ${footerNote}<br />
                &copy; ${year} Trakie.ai. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <a href="${href}" style="display:inline-block;padding:14px 32px;background-color:#C9A961;color:#0D1F0D;font-size:14px;font-weight:700;letter-spacing:0.06em;text-decoration:none;border-radius:6px;text-transform:uppercase;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function secondaryLink(label: string, href: string): string {
  return `<a href="${href}" style="color:#C9A961;text-decoration:none;font-size:14px;">${label} →</a>`;
}

export function welcomeEmail(): EmailContent {
  const body = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:600;color:#e8e8e8;">Welcome aboard.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aad9a;">
      Your account is all set. Trakie.ai gives your dispensary AI-powered receiving intelligence — so every product that comes through your door is tracked, verified, and synced automatically.
    </p>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9aad9a;">
      Ready to put it to work? Start your 30-day free trial — no charge until day 31, cancel anytime.
    </p>
    ${ctaButton('Start Your 30-Day Trial', `${SITE_URL}/pricing`)}
    <p style="margin:24px 0 0;font-size:14px;color:#6b8f6b;">
      ${secondaryLink('Or explore the demo first', SITE_URL)}
    </p>`;
  return {
    subject: 'Welcome to Trakie.ai',
    html: shell({ preheader: 'Start your 30-day free trial', heading: 'Welcome to Trakie.ai', bodyHtml: body }),
  };
}

export function trialStartedEmail(opts: { trialEnd?: string | null }): EmailContent {
  const trialEndStr = formatDate(opts.trialEnd);
  const body = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:600;color:#e8e8e8;">Your trial is live.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aad9a;">
      You now have full access to Trakie.ai. Your card on file won't be charged until your trial ends${trialEndStr ? ` on <strong style="color:#C9A961;">${trialEndStr}</strong>` : ''}.
    </p>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9aad9a;">
      Cancel anytime from your account — no questions, no charge.
    </p>
    ${ctaButton('Open Trakie.ai', SITE_URL)}
    <p style="margin:24px 0 0;font-size:14px;color:#6b8f6b;">
      ${secondaryLink('Manage subscription', `${SITE_URL}/account/subscription`)}
    </p>`;
  return {
    subject: 'Your Trakie.ai trial has started',
    html: shell({
      preheader: trialEndStr ? `Free until ${trialEndStr}` : 'Your 30-day trial is now active',
      heading: 'Your Trakie.ai trial has started',
      bodyHtml: body,
      footerNote: 'You received this because you started a Trakie.ai subscription.',
    }),
  };
}

export function subscriptionCancelledEmail(opts: { accessUntil?: string | null }): EmailContent {
  const accessStr = formatDate(opts.accessUntil);
  const body = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:600;color:#e8e8e8;">Your subscription has been cancelled.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aad9a;">
      We've cancelled your Trakie.ai subscription${accessStr ? `. You'll keep full access until <strong style="color:#C9A961;">${accessStr}</strong>` : ''}.
    </p>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9aad9a;">
      Changed your mind? You can resume anytime from the billing portal — no need to start over.
    </p>
    ${ctaButton('Resume Subscription', `${SITE_URL}/account/subscription`)}
    <p style="margin:24px 0 0;font-size:14px;color:#6b8f6b;">
      Questions? Just reply to this email.
    </p>`;
  return {
    subject: 'Your Trakie.ai subscription has been cancelled',
    html: shell({
      preheader: accessStr ? `Access continues until ${accessStr}` : 'Your subscription has been cancelled',
      heading: 'Subscription cancelled',
      bodyHtml: body,
      footerNote: 'You received this because you cancelled a Trakie.ai subscription.',
    }),
  };
}
