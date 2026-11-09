-- Fase 2b: aturan username (PRD FR-13 dan 4.5).
-- 3–20 karakter, huruf kecil, angka, dan garis bawah, tidak diawali angka,
-- bukan nama cadangan, dan unik tanpa membedakan huruf besar.

-- ---------------------------------------------------------------------------
-- Nama cadangan
-- ---------------------------------------------------------------------------

create function private.is_reserved_username(candidate text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select lower(candidate) = any (array[
    -- Merek dan peran
    'belajarautomation', 'admin', 'administrator', 'root', 'system', 'sistem',
    'moderator', 'creator', 'reviewer', 'student', 'pelajar', 'support', 'bantuan',
    'help', 'official', 'resmi', 'staff', 'tim', 'team',
    -- Halaman dan route aplikasi
    'api', 'auth', 'login', 'logout', 'register', 'daftar', 'masuk', 'keluar',
    'settings', 'pengaturan', 'profile', 'profil', 'u', 'learn', 'playground',
    'blog', 'roadmap', 'membership', 'ebooks', 'projects', 'cart', 'checkout',
    'career', 'leaderboard', 'notifications', 'maintenance', 'dev', 'dashboard',
    'forgot_password', 'reset_password',
    -- Lain-lain
    'null', 'undefined', 'anonymous', 'tamu', 'guest', 'about', 'privacy', 'terms'
  ]);
$$;

create function private.is_valid_username(candidate text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select candidate ~ '^[a-z_][a-z0-9_]{2,19}$'
    and not private.is_reserved_username(candidate);
$$;

-- ---------------------------------------------------------------------------
-- Kolom dan constraint
-- ---------------------------------------------------------------------------

-- Untuk jeda 30 hari antar penggantian username (diterapkan saat fitur ganti username dibuat).
alter table public.profiles add column username_changed_at timestamptz;

alter table public.profiles
  add constraint profiles_username_valid
  check (username is null or private.is_valid_username(username));

-- ---------------------------------------------------------------------------
-- Cek ketersediaan, dipakai form daftar sebelum akun dibuat
-- ---------------------------------------------------------------------------

-- Mengembalikan 'tersedia', 'format', 'cadangan', atau 'dipakai'.
-- Hanya membuka keberadaan username, yang memang tampil di profil publik.
create function public.check_username(candidate text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when candidate is null or candidate !~ '^[a-z_][a-z0-9_]{2,19}$' then 'format'
    when private.is_reserved_username(candidate) then 'cadangan'
    when exists (select 1 from public.profiles p where lower(p.username) = lower(candidate)) then 'dipakai'
    else 'tersedia'
  end;
$$;

revoke all on function public.check_username(text) from public;
grant execute on function public.check_username(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Data akun pengguna yang sedang login, dalam satu panggilan
-- ---------------------------------------------------------------------------

-- security invoker: tetap dibatasi RLS, jadi hanya mengembalikan akun sendiri.
create function public.get_my_account()
returns json
language sql
stable
security invoker
set search_path = ''
as $$
  select json_build_object(
    'display_name', p.display_name,
    'username', p.username,
    'status', p.status,
    'roles', coalesce(
      (select json_agg(ur.role order by ur.role) from public.user_roles ur where ur.user_id = p.id),
      '[]'::json
    )
  )
  from public.profiles p
  where p.id = (select auth.uid());
$$;

revoke all on function public.get_my_account() from public, anon;
grant execute on function public.get_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- Pembuatan akun: username dari form daftar ikut disimpan
-- ---------------------------------------------------------------------------

-- Username dari form daftar email wajib valid dan belum dipakai; jika tidak,
-- pendaftaran ditolak. Pendaftar Google belum membawa username dan memilihnya
-- setelah login (PRD 4.5).
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text := nullif(lower(trim(new.raw_user_meta_data ->> 'username')), '');
begin
  if requested_username is not null and public.check_username(requested_username) <> 'tersedia' then
    raise exception 'username_tidak_tersedia' using errcode = 'P0001';
  end if;

  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), 100),
    requested_username
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'student');

  return new;
end;
$$;
