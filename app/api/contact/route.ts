import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, bestTime, dispensary, deliveries, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Trakie.ai Contact <contact@trakie.ai>',
      to: 'stevenfounder@trakie.ai',
      replyTo: email,
      subject: `New Contact Form: ${name}${dispensary ? ` — ${dispensary}` : ''}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        bestTime ? `Best Time to Call: ${bestTime}` : null,
        dispensary ? `Dispensary: ${dispensary}` : null,
        deliveries ? `Deliveries per Week: ${deliveries}` : null,
        `\nMessage:\n${message}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
