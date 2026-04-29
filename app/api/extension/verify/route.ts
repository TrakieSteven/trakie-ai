import { NextResponse } from 'next/server';
import { bearerToken, verifyExtensionToken } from '@/lib/extensionAuth';

export async function POST(request: Request) {
  const presented = bearerToken(request);
  const expected = process.env.RELAY_SHARED_SECRET;

  if (!expected) {
    console.error('[extension/verify] RELAY_SHARED_SECRET is not configured');
    return NextResponse.json({ ok: false, reason: 'server_misconfigured' }, { status: 500 });
  }
  if (!presented || presented !== expected) {
    return NextResponse.json({ ok: false, reason: 'forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userToken = typeof body?.user_token === 'string' ? body.user_token : null;
  if (!userToken) {
    return NextResponse.json({ ok: false, reason: 'missing_token' }, { status: 400 });
  }

  const result = await verifyExtensionToken(userToken);

  if (!result.ok) {
    return NextResponse.json({
      ok: false,
      reason: result.reason,
      user_id: result.userId ?? null,
      status: result.status ?? null,
    });
  }

  return NextResponse.json({
    ok: true,
    user_id: result.userId,
    status: result.status,
  });
}
