-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Creates a subscriptions table keyed by user_id, mirroring Stripe state.
-- Webhook handler writes via service role; clients can only read their own row.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text,
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  trial_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "users read their own subscription" on public.subscriptions;
create policy "users read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);
