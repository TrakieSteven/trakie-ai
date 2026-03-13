import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Verify the request comes from an authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await resend.emails.send({
      from: 'Trakie.ai <hello@trakie.ai>',
      to: email,
      subject: 'Welcome to Trakie.ai',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Trakie.ai</title>
</head>
<body style="margin:0;padding:0;background-color:#0D1F0D;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1F0D;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#111c11;border:1px solid #2a3d2a;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 40px 32px;border-bottom:1px solid #2a3d2a;">
              <p style="margin:0;font-size:28px;font-weight:700;letter-spacing:0.12em;color:#C9A961;font-family:Georgia,serif;">TRAKIE.AI</p>
              <p style="margin:8px 0 0;font-size:13px;color:#6b8f6b;letter-spacing:0.08em;text-transform:uppercase;">Cannabis Retail Intelligence</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:600;color:#e8e8e8;">Welcome aboard.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aad9a;">
                Your account is all set. Trakie.ai gives your dispensary AI-powered receiving intelligence — so every product that comes through your door is tracked, verified, and synced automatically.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9aad9a;">
                Explore the demo and see how it works for your operation.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://trakie.ai" style="display:inline-block;padding:14px 32px;background-color:#C9A961;color:#0D1F0D;font-size:14px;font-weight:700;letter-spacing:0.06em;text-decoration:none;border-radius:6px;text-transform:uppercase;">
                      Go to Trakie.ai
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2a3d2a;">
              <p style="margin:0;font-size:12px;color:#4a6b4a;line-height:1.6;">
                You received this email because you created a Trakie.ai account.<br />
                &copy; ${new Date().getFullYear()} Trakie.ai. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send welcome email.' }, { status: 500 });
  }
}
