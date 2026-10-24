-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- It sets up somewhere to save gifts and their photos/voice memos, with rules that let
-- anyone create a gift but only open one if they have its exact link.

-- 1. The gifts table
create table if not exists public.gifts (
  id         text primary key,
  to_name    text not null,
  from_name  text not null,
  items      jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.gifts enable row level security;

-- Anyone using the app can create a gift (there are no accounts)...
-- (New Supabase projects don't grant table access by default, so allow adding rows only.)
grant insert on public.gifts to anon, authenticated;

drop policy if exists "Anyone can create a gift" on public.gifts;
create policy "Anyone can create a gift"
  on public.gifts for insert
  to anon, authenticated
  with check (true);

-- ...but there is deliberately no "select" rule, so nobody can list or browse gifts.
-- A gift can only be read one at a time, by its exact id, through this function:
create or replace function public.get_gift(gift_id text)
returns setof public.gifts
language sql
stable
security definer
set search_path = public
as $$
  select * from public.gifts where id = gift_id;
$$;

revoke all on function public.get_gift(text) from public;
grant execute on function public.get_gift(text) to anon, authenticated;

-- 2. Storage for photos, drawings and voice memos
-- Public bucket: a file can be viewed by its exact address, but files can't be listed.
insert into storage.buckets (id, name, public, file_size_limit)
values ('gift-media', 'gift-media', true, 15728640) -- 15 MB per file
on conflict (id) do nothing;

drop policy if exists "Anyone can upload gift media" on storage.objects;
create policy "Anyone can upload gift media"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'gift-media');
