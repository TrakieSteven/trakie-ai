import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isActiveStatus } from '@/lib/subscription';
import ConnectView from '@/components/extension/ConnectView';

export const metadata = {
  title: 'Connect Extension · Trakie.ai',
  robots: { index: false, follow: false },
};

export default async function ExtensionConnectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?next=/extension/connect');
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <ConnectView
      email={user.email ?? ''}
      hasActiveSubscription={isActiveStatus(sub?.status ?? null)}
    />
  );
}
