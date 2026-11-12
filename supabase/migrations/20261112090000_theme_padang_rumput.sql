-- Tema Padang Rumput (gratis, diam) sebagai tema bawaan pengguna baru (PRD FR-12, v2.43).
-- Tema bawaan ditentukan aplikasi (data/themes.ts) untuk profil dengan theme_id kosong, jadi
-- pengguna yang sudah menyimpan tema lain tetap memakai pilihannya.
insert into private.cosmetic_items (id, kind, access, included_in) values
  ('padang-rumput', 'theme', 'free', '{}');
