-- Avatar dan tema banner pilihan pengguna (PRD FR-12, FR-13 Kustomisasi).
-- Katalog kosmetik disimpan di database agar hak pakai diperiksa di server,
-- bukan hanya di browser.

-- ---------------------------------------------------------------------------
-- Katalog kosmetik (internal)
-- ---------------------------------------------------------------------------

create type private.cosmetic_kind as enum ('avatar', 'theme');

create table private.cosmetic_items (
  id text primary key,
  kind private.cosmetic_kind not null,
  -- free: semua pengguna. paid: perlu hak akses paket (Pro/Premium).
  access text not null check (access in ('free', 'paid')),
  included_in text[] not null default '{}'
);

comment on table private.cosmetic_items is
  'Avatar dan tema (PRD FR-12). Harus sama dengan data/avatars.ts dan data/themes.ts; tambah baris lewat migrasi baru.';

insert into private.cosmetic_items (id, kind, access, included_in) values
  ('kucing-putih', 'avatar', 'free', '{}'),
  ('kucing-oren', 'avatar', 'free', '{}'),
  ('kucing-hitam', 'avatar', 'paid', '{pro,premium}'),
  ('kucing-tuxedo', 'avatar', 'paid', '{pro,premium}'),
  ('kucing-abu', 'avatar', 'paid', '{pro,premium}'),
  ('kucing-coklat', 'avatar', 'paid', '{pro,premium}'),
  ('kucing-corak-tiga', 'avatar', 'paid', '{pro,premium}'),
  ('kucing-siam', 'avatar', 'paid', '{pro,premium}'),
  ('mountain-workspace', 'theme', 'free', '{}');

-- ---------------------------------------------------------------------------
-- Pilihan pengguna
-- ---------------------------------------------------------------------------

-- Kosong berarti memakai bawaan: Kucing Putih dan tema gratis bawaan (PRD FR-12).
alter table public.profiles add column theme_id text;

-- ---------------------------------------------------------------------------
-- Data akun: ditambah avatar dan tema
-- ---------------------------------------------------------------------------

create or replace function public.get_my_account()
returns json
language sql
stable
security invoker
set search_path = ''
as $$
  select json_build_object(
    'display_name', p.display_name,
    'username', p.username,
    'bio', p.bio,
    'username_changed_at', p.username_changed_at,
    'avatar_id', p.avatar_id,
    'theme_id', p.theme_id,
    'status', p.status,
    'roles', coalesce(
      (select json_agg(ur.role order by ur.role) from public.user_roles ur where ur.user_id = p.id),
      '[]'::json
    )
  )
  from public.profiles p
  where p.id = (select auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Menyimpan pilihan
-- ---------------------------------------------------------------------------

-- Item berbayar ditolak sampai hak akses paket tersedia di backend (Fase 5,
-- tabel user_entitlements). Saat itu, pemeriksaan di bawah diganti dengan
-- pengecekan hak akses pengguna.
create function public.set_appearance(new_avatar_id text, new_theme_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  avatar_item private.cosmetic_items%rowtype;
  theme_item private.cosmetic_items%rowtype;
begin
  if uid is null then
    raise exception 'tidak_login' using errcode = '42501';
  end if;

  select * into avatar_item from private.cosmetic_items where id = new_avatar_id and kind = 'avatar';
  if not found then
    raise exception 'avatar_tidak_dikenal' using errcode = 'P0001';
  end if;
  select * into theme_item from private.cosmetic_items where id = new_theme_id and kind = 'theme';
  if not found then
    raise exception 'tema_tidak_dikenal' using errcode = 'P0001';
  end if;

  if avatar_item.access <> 'free' or theme_item.access <> 'free' then
    raise exception 'item_terkunci' using errcode = 'P0001';
  end if;

  update public.profiles
  set avatar_id = new_avatar_id, theme_id = new_theme_id
  where id = uid and status = 'active';

  if not found then
    raise exception 'akun_tidak_aktif' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.set_appearance(text, text) from public, anon;
grant execute on function public.set_appearance(text, text) to authenticated;
