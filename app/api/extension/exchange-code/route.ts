import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/admin';

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : null;
    if (!code) {
      return NextResponse.json({ ok: false, reason: 'missing_code' }, { status: 400 });
    }

    const admin = createServiceClient();

    const { data: row } = await admin
      .from('extension_pairing_codes')
      .select('code, user_id, consumed_at, expires_at')
      .eq('code', code)
      .maybeSingle();

    if (!row) {
      return NextResponse.json({ ok: false, reason: 'invalid_code' }, { status: 404 });
    }
    if (row.consumed_at) {
      return NextResponse.json({ ok: false, reason: 'code_already_used' }, { status: 410 });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ ok: false, reason: 'code_expired' }, { status: 410 });
    }

    const { data: userRecord } = await admin.auth.admin.getUserById(row.user_id);
    const email = userRecord?.user?.email ?? null;

    const token = generateToken();
    const { error: insertError } = await admin
      .from('extension_tokens')
      .insert({ token, user_id: row.user_id });

    if (insertError) {
      console.error('[extension/exchange-code] insert token failed', insertError);
      return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 });
    }

    const { error: consumeError } = await admin
      .from('extension_pairing_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('code', code)
      .is('consumed_at', null);

    if (consumeError) {
      console.error('[extension/exchange-code] consume failed', consumeError);
    }

    return NextResponse.json({ ok: true, token, user_id: row.user_id, email });
  } catch (err) {
    console.error('[extension/exchange-code]', err);
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 });
  }
}
