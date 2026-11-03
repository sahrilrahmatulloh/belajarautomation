// Panduan kontribusi konten di repository (PRD FR-15).
export const CONTENT_GUIDE_URL =
  "https://github.com/sahrilrahmatulloh/belajarautomation/blob/develop/docs/CONTENT_GUIDE.md";

// Alur penerbitan sebelum backend tersedia (PRD FR-15).
export const GITHUB_FLOW = [
  { stage: "Draf", github: "Branch dan file MDX milik Creator" },
  { stage: "Menunggu Review", github: "Pull request ke develop" },
  { stage: "Perlu Revisi", github: "Review dengan permintaan perubahan" },
  { stage: "Disetujui", github: "Review disetujui oleh Reviewer dan CI lulus" },
  { stage: "Terbit", github: "Admin melakukan merge dan mengubah status artikel menjadi published" },
];
