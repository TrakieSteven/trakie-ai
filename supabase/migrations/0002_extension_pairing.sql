-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Adds extension pairing codes + long-lived device tokens for the Chrome extension.
-- All writes go through the service role; clients have no direct access.

create table if not exists public.extension_pairing_codes (
  code text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  consumed_at timestamptz,
  expires_at timestamptz default (now() + interval '10 minutes') not null
);

create index if not exists extension_pairing_codes_user_id_idx
  on public.extension_pairing_codes (user_id);

alter table public.extension_pairing_codes enable row level security;
-- no policies: writes only via service role.

create table if not exists public.extension_tokens (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  last_used_at timestamptz default now() not null,
  revoked_at timestamptz
);

create index if not exists extension_tokens_user_id_idx
  on public.extension_tokens (user_id);

alter table public.extension_tokens enable row level security;
-- no policies: writes only via service role.
