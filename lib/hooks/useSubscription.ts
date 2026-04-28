'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  trial_end: string | null;
};

const ACTIVE_STATUSES = new Set(['trialing', 'active', 'past_due']);

export function useSubscription() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadFor(currentUser: User | null) {
      if (!currentUser) {
        if (!cancelled) {
          setSubscription(null);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      if (!cancelled) {
        setSubscription((data as SubscriptionRow | null) ?? null);
        setLoading(false);
      }
    }

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u);
      loadFor(u);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setLoading(true);
      loadFor(nextUser);
    });

    return () => {
      cancelled = true;
      authSub.unsubscribe();
    };
  }, []);

  const status = subscription?.status ?? null;
  const isActive = !!status && ACTIVE_STATUSES.has(status);
  const isTrialing = status === 'trialing';

  return { user, subscription, status, isActive, isTrialing, loading };
}
