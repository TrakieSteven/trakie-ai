import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/emails/send';
import { welcomeEmail } from '@/lib/emails/templates';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { subject, html } = welcomeEmail();
    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send welcome email.' }, { status: 500 });
  }
}
