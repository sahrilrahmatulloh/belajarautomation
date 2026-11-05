const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_WIDTH = 1280;
// localStorage terbatas sekitar 5 MB, jadi setiap gambar simulasi dijaga tetap kecil.
const MAX_DATA_URL_LENGTH = 700 * 1024;

// Pesan error gambar, atau null bila valid (PRD FR-15).
export function validateImage(file: { type: string; size: number }) {
  if (!IMAGE_TYPES.includes(file.type)) return "Format tidak didukung. Gunakan JPG, PNG, atau WebP.";
  if (file.size > MAX_IMAGE_BYTES) return "Ukuran file terlalu besar. Ukuran maksimal 2 MB.";
  return null;
}

// Simulasi upload: gambar diperkecil lalu disimpan sebagai data URL di browser. Saat backend
// tersedia, langkah ini diganti upload ke Storage.
export async function prepareImage(file: File) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Gambar tidak bisa dibaca. Coba file lain.");
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/webp", 0.8);
  if (dataUrl.length > MAX_DATA_URL_LENGTH) throw new Error("Gambar terlalu besar untuk disimpan di browser. Coba gambar yang lebih sederhana.");
  return dataUrl;
}
