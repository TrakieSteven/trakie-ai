import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/admin';
import { isActiveStatus } from '@/lib/subscription';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit 0/O/1/I for legibility
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 });
    }

    const admin = createServiceClient();

    const { data: sub } = await admin
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!isActiveStatus(sub?.status ?? null)) {
      return NextResponse.json({ ok: false, reason: 'no_subscription' });
    }

    let lastError: unknown = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = generateCode();
      const { data, error } = await admin
        .from('extension_pairing_codes')
        .insert({ code, user_id: user.id })
        .select('code, expires_at')
        .single();

      if (!error && data) {
        return NextResponse.json({ ok: true, code: data.code, expires_at: data.expires_at });
      }
      lastError = error;
    }

    console.error('[extension/issue-code] could not insert unique code', lastError);
    return NextResponse.json({ ok: false, reason: 'code_generation_failed' }, { status: 500 });
  } catch (err) {
    console.error('[extension/issue-code]', err);
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 });
  }
}
