import { NextResponse } from 'next/server';
import { bearerToken, verifyExtensionToken } from '@/lib/extensionAuth';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return NextResponse.json({ subscribed: false, reason: 'invalid_token' }, { status: 401 });
  }

  const result = await verifyExtensionToken(token);

  if (!result.ok && result.reason === 'invalid_token') {
    return NextResponse.json({ subscribed: false, reason: 'invalid_token' }, { status: 401 });
  }

  if (!result.ok) {
    return NextResponse.json({
      subscribed: false,
      reason: result.reason,
      status: result.status ?? null,
    });
  }

  return NextResponse.json({
    subscribed: true,
    status: result.status,
    trial_end: result.trialEnd,
    current_period_end: result.currentPeriodEnd,
  });
}
