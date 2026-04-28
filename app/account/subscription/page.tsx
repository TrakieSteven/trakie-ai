import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SubscriptionView, { type SubscriptionRow } from '@/components/account/SubscriptionView';

export const metadata = {
  title: 'Subscription · Trakie.ai',
  robots: { index: false, follow: false },
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const params = await searchParams;

  return (
    <SubscriptionView
      email={user.email ?? ''}
      subscription={(data as SubscriptionRow | null) ?? null}
      checkoutSuccess={params.checkout === 'success'}
    />
  );
}
