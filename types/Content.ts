export type ContentType =
  | "Materi"
  | "Modul"
  | "Soal Latihan"
  | "Artikel";

// Alur: draft → in-review → needs-revision / approved → published
export type ContentStatus =
  | "draft"
  | "in-review"
  | "needs-revision"
  | "approved"
  | "published";
