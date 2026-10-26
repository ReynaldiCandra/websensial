-- Run ONLY in a new Supabase project dedicated to Websensial.
-- Never run this in the Lunavelle-Studio project.
create extension if not exists pgcrypto;

create table if not exists public.websensial_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.websensial_content (
  content_key text primary key check (content_key = 'site-v1'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.websensial_admins enable row level security;
alter table public.websensial_content enable row level security;

create policy "websensial admin checks own membership"
  on public.websensial_admins for select to authenticated
  using (user_id = auth.uid());

create policy "websensial admins can read content"
  on public.websensial_content for select to authenticated
  using (exists (select 1 from public.websensial_admins where user_id = auth.uid()));
create policy "websensial admins can edit content"
  on public.websensial_content for all to authenticated
  using (exists (select 1 from public.websensial_admins where user_id = auth.uid()))
  with check (exists (select 1 from public.websensial_admins where user_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('websensial-media', 'websensial-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 10485760, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads Websensial CMS media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'websensial-media');
create policy "Websensial admins upload CMS media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'websensial-media'
    and exists (select 1 from public.websensial_admins where user_id = auth.uid())
  );
create policy "Websensial admins update CMS media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'websensial-media'
    and exists (select 1 from public.websensial_admins where user_id = auth.uid())
  )
  with check (
    bucket_id = 'websensial-media'
    and exists (select 1 from public.websensial_admins where user_id = auth.uid())
  );
create policy "Websensial admins delete CMS media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'websensial-media'
    and exists (select 1 from public.websensial_admins where user_id = auth.uid())
  );

-- After creating the first Auth user, authorize its UUID:
-- insert into public.websensial_admins (user_id) values ('YOUR_AUTH_USER_UUID');
