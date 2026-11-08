-- Leaderboard akun sungguhan dan profil publik (PRD FR-06, FR-13).
-- XP belum dihitung di backend; user_xp_summary disiapkan sekarang (bernilai 0) dan diisi
-- oleh logika XP pada fase berikutnya, tanpa mengubah fungsi di bawah.

-- ---------------------------------------------------------------------------
-- Pengaturan privasi (PRD FR-06 Privasi, FR-13 Profil publik)
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column show_on_leaderboard boolean not null default true,
  add column profile_public boolean not null default true;

-- ---------------------------------------------------------------------------
-- Ringkasan XP per pengguna (PRD 8.2: ringkasan disimpan, bukan dihitung ulang)
-- ---------------------------------------------------------------------------

create table public.user_xp_summary (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  challenges_completed integer not null default 0 check (challenges_completed >= 0),
  updated_at timestamptz not null default now()
);

comment on table public.user_xp_summary is
  'Ringkasan XP (PRD FR-05). Hanya ditulis fungsi server; dibaca lewat get_leaderboard dan get_public_profile.';

alter table public.user_xp_summary enable row level security;
revoke all on public.user_xp_summary from anon, authenticated;

create policy "Pengguna membaca ringkasan XP-nya sendiri"
  on public.user_xp_summary for select
  to authenticated
  using (user_id = (select auth.uid()));
grant select on public.user_xp_summary to authenticated;

-- ---------------------------------------------------------------------------
-- Leaderboard
-- ---------------------------------------------------------------------------

-- Akun aktif yang sudah punya username. Pengguna yang memilih tidak tampil hanya
-- dikembalikan untuk dirinya sendiri, agar ia tetap melihat posisinya (PRD FR-06).
-- Hanya kolom publik; tanpa email.
create function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_id text,
  total_xp integer,
  show_on_leaderboard boolean,
  is_current_user boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_id,
    coalesce(s.total_xp, 0),
    p.show_on_leaderboard,
    p.id = (select auth.uid())
  from public.profiles p
  left join public.user_xp_summary s on s.user_id = p.id
  where p.status = 'active'
    and p.username is not null
    and (p.show_on_leaderboard or p.id = (select auth.uid()))
  order by coalesce(s.total_xp, 0) desc, p.created_at asc
  limit 500;
$$;

revoke all on function public.get_leaderboard() from public, anon;
grant execute on function public.get_leaderboard() to authenticated;

-- ---------------------------------------------------------------------------
-- Profil publik (hanya untuk pengguna yang login)
-- ---------------------------------------------------------------------------

-- Akun nonaktif tidak dikembalikan (PRD FR-16 C). Bila pemilik menutup profilnya,
-- hanya identitas dasar yang dikembalikan, kecuali untuk pemiliknya sendiri.
create function public.get_public_profile(candidate text)
returns table (
  username text,
  display_name text,
  bio text,
  avatar_id text,
  theme_id text,
  total_xp integer,
  lessons_completed integer,
  challenges_completed integer,
  profile_public boolean,
  is_current_user boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.username,
    p.display_name,
    case when p.profile_public or p.id = (select auth.uid()) then p.bio else '' end,
    p.avatar_id,
    p.theme_id,
    case when p.profile_public or p.id = (select auth.uid()) then coalesce(s.total_xp, 0) else 0 end,
    case when p.profile_public or p.id = (select auth.uid()) then coalesce(s.lessons_completed, 0) else 0 end,
    case when p.profile_public or p.id = (select auth.uid()) then coalesce(s.challenges_completed, 0) else 0 end,
    p.profile_public,
    p.id = (select auth.uid())
  from public.profiles p
  left join public.user_xp_summary s on s.user_id = p.id
  where (select auth.uid()) is not null
    and p.status = 'active'
    and lower(p.username) = lower(candidate);
$$;

revoke all on function public.get_public_profile(text) from public, anon;
grant execute on function public.get_public_profile(text) to authenticated;
