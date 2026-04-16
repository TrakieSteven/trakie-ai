import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, dispensary, email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Trakie.ai Contact <contact@trakie.ai>',
      to: 'stevenfounder@trakie.ai',
      replyTo: email,
      subject: `New Lead: ${name || email}${dispensary ? ` — ${dispensary}` : ''}`,
      text: `New contact form submission:\n\nName: ${name || '—'}\nDispensary: ${dispensary || '—'}\nEmail: ${email}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
