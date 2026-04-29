import { createServiceClient } from '@/lib/supabase/admin';
import { isActiveStatus } from '@/lib/subscription';

export type VerifyResult =
  | { ok: true; userId: string; status: string | null; trialEnd: string | null; currentPeriodEnd: string | null }
  | { ok: false; reason: 'invalid_token' | 'no_subscription' | 'server_error'; userId?: string; status?: string | null };

export async function verifyExtensionToken(token: string): Promise<VerifyResult> {
  if (!token) return { ok: false, reason: 'invalid_token' };

  try {
    const admin = createServiceClient();

    const { data: row } = await admin
      .from('extension_tokens')
      .select('token, user_id, revoked_at')
      .eq('token', token)
      .maybeSingle();

    if (!row || row.revoked_at) {
      return { ok: false, reason: 'invalid_token' };
    }

    // fire-and-forget last_used_at refresh
    void admin
      .from('extension_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('token', token);

    const { data: sub } = await admin
      .from('subscriptions')
      .select('status, trial_end, current_period_end')
      .eq('user_id', row.user_id)
      .maybeSingle();

    if (!isActiveStatus(sub?.status ?? null)) {
      return { ok: false, reason: 'no_subscription', userId: row.user_id, status: sub?.status ?? null };
    }

    return {
      ok: true,
      userId: row.user_id,
      status: sub?.status ?? null,
      trialEnd: sub?.trial_end ?? null,
      currentPeriodEnd: sub?.current_period_end ?? null,
    };
  } catch (err) {
    console.error('[verifyExtensionToken]', err);
    return { ok: false, reason: 'server_error' };
  }
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
