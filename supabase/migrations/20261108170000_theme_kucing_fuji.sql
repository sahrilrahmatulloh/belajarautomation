-- Tema Penerbangan Fuji menggantikan Mountain Workspace (PRD FR-12, v2.26).
-- Pengguna yang memakai tema lama kembali ke bawaan (theme_id kosong = tema bawaan).

insert into private.cosmetic_items (id, kind, access, included_in) values
  ('kucing-fuji', 'theme', 'free', '{}');

update public.profiles set theme_id = null where theme_id = 'mountain-workspace';

delete from private.cosmetic_items where id = 'mountain-workspace';
