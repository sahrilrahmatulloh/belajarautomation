-- Fase 2a: profil pengguna, peran, dan fungsi pemeriksa peran.
-- Acuan: PRD FR-15 (peran), FR-13 (profil), 7.1, 8.3; docs/DATABASE.md Bagian 5 dan 6.

-- Schema untuk tabel dan fungsi internal. Tidak terekspos ke API Supabase
-- (tidak tercantum di [api].schemas pada supabase/config.toml).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Tipe
-- ---------------------------------------------------------------------------

-- student = Pelajar, dimiliki setiap akun. Membership bukan peran.
create type public.app_role as enum ('student', 'creator', 'reviewer', 'admin');
create type public.account_status as enum ('active', 'deactivated');

-- ---------------------------------------------------------------------------
-- Tabel
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Diisi saat pengguna memilih username (Fase 2b). Unik tanpa membedakan huruf besar.
  username text,
  display_name text not null default '',
  bio text not null default '',
  avatar_id text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_lower_key on public.profiles (lower(username));

comment on table public.profiles is 'Identitas dasar pengguna (PRD 7.1, FR-13). Email tetap di auth.users.';

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

comment on table public.user_roles is 'Peran pengguna (PRD FR-15). Diubah hanya lewat fungsi server yang menulis audit log.';

-- ---------------------------------------------------------------------------
-- updated_at otomatis
-- ---------------------------------------------------------------------------

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pemeriksa peran untuk kebijakan RLS
-- ---------------------------------------------------------------------------

-- security definer agar dapat membaca user_roles tanpa terhalang RLS-nya sendiri.
-- Peran admin hanya berlaku pada sesi dengan verifikasi dua langkah (aal2, PRD 8.3).
create function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role = required_role
  )
  and (
    required_role <> 'admin'
    or coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
  );
$$;

revoke all on function public.has_role(public.app_role) from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated;

-- ---------------------------------------------------------------------------
-- Profil dan peran student dibuat otomatis saat akun dibuat
-- ---------------------------------------------------------------------------

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 100)
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'student');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Hak akses tabel (lapisan pertama) dan RLS (lapisan kedua)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- Tamu tidak membaca apa pun. Profil publik dibuat lewat view terpisah (Fase 4)
-- dan hanya untuk pengguna yang login.
revoke all on public.profiles from anon;
revoke all on public.user_roles from anon;

-- Pengguna hanya boleh mengubah kolom tampilan miliknya. Username, status,
-- dan peran diubah lewat fungsi server.
revoke insert, update, delete, truncate on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, bio, avatar_id) on public.profiles to authenticated;

revoke insert, update, delete, truncate on public.user_roles from authenticated;
grant select on public.user_roles to authenticated;

create policy "Pengguna membaca profilnya sendiri"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Admin membaca semua profil"
  on public.profiles for select
  to authenticated
  using ((select public.has_role('admin')));

create policy "Pengguna mengubah profilnya sendiri"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()) and status = 'active')
  with check (id = (select auth.uid()));

create policy "Pengguna membaca perannya sendiri"
  on public.user_roles for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Admin membaca semua peran"
  on public.user_roles for select
  to authenticated
  using ((select public.has_role('admin')));
