import { Rank } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

// Gambar kartu profil untuk dibagikan, dibuat di browser dengan canvas.
// Hanya memuat data yang memang publik (PRD FR-13): tanpa email, bio, pembelian,
// maupun membership. Ukuran 1200x630 mengikuti standar pratinjau media sosial.
export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;

export interface ShareCardData {
  displayName: string;
  username: string;
  avatarImage: string;
  themeImage: string;
  rank: Rank;
  xp: number;
  lessons: number;
  challenges: number;
  achievements: number;
}

const LOGO_IMAGE = "/logo.png";
const CONTENT_LEFT = 64;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    image.src = src;
  });
}

// Latar memenuhi kartu seperti object-cover, dengan fokus di sisi kanan ilustrasi.
function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const scale = Math.max(SHARE_CARD_WIDTH / image.width, SHARE_CARD_HEIGHT / image.height);
  const sourceWidth = SHARE_CARD_WIDTH / scale;
  const sourceHeight = SHARE_CARD_HEIGHT / scale;
  const sourceX = (image.width - sourceWidth) * 0.75;
  const sourceY = (image.height - sourceHeight) * 0.5;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
}

function drawContained(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, box: number) {
  const scale = Math.min(box / image.width, box / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.drawImage(image, x + (box - width) / 2, y + (box - height) / 2, width, height);
}

// Nama panjang diperkecil dulu, baru dipotong bila masih tidak muat.
function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontFamily: string,
  sizes: { max: number; min: number }
) {
  let size = sizes.max;
  ctx.font = `700 ${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && size > sizes.min) {
    size -= 2;
    ctx.font = `700 ${size}px ${fontFamily}`;
  }
  let fitted = text;
  while (ctx.measureText(fitted).width > maxWidth && fitted.length > 1) {
    fitted = fitted.slice(0, -2) + "…";
  }
  ctx.fillText(fitted, x, y);
}

export async function createShareCard(data: ShareCardData): Promise<Blob> {
  await document.fonts.ready;
  const [theme, avatar, emblem, logo] = await Promise.all([
    loadImage(data.themeImage),
    loadImage(data.avatarImage),
    loadImage(data.rank.emblem),
    loadImage(LOGO_IMAGE),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  const fontFamily = getComputedStyle(document.body).fontFamily;

  drawCover(ctx, theme);

  // Gradasi gelap dari kiri agar teks putih terbaca di tema apa pun.
  const shade = ctx.createLinearGradient(0, 0, SHARE_CARD_WIDTH, 0);
  shade.addColorStop(0, "rgba(2, 6, 23, 0.94)");
  shade.addColorStop(0.5, "rgba(2, 6, 23, 0.82)");
  shade.addColorStop(0.8, "rgba(2, 6, 23, 0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  // Avatar
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(CONTENT_LEFT, 56, 160, 160, 28);
  ctx.fill();
  drawContained(ctx, avatar, CONTENT_LEFT + 8, 64, 144);

  // Nama dan username
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#FFFFFF";
  drawFittedText(ctx, data.displayName, 256, 132, 470, fontFamily, { max: 56, min: 34 });
  ctx.font = `400 26px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.fillText(`@${data.username}`, 256, 174);

  // Rank dan total XP
  drawContained(ctx, emblem, CONTENT_LEFT, 244, 104);
  ctx.font = `400 22px ${fontFamily}`;
  ctx.fillText("Rank", 184, 286);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 34px ${fontFamily}`;
  ctx.fillText(data.rank.name, 184, 326);

  const rankWidth = ctx.measureText(data.rank.name).width;
  const xpX = Math.max(184 + rankWidth + 48, 420);
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillRect(xpX - 24, 262, 2, 68);
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.font = `400 22px ${fontFamily}`;
  ctx.fillText("Total XP", xpX, 286);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 34px ${fontFamily}`;
  ctx.fillText(formatNumber(data.xp), xpX, 326);

  // Statistik
  const stats = [
    { label: "Materi Selesai", value: data.lessons },
    { label: "Challenge Selesai", value: data.challenges },
    { label: "Achievement", value: data.achievements },
  ];
  stats.forEach((stat, index) => {
    // Lebar dibatasi agar tidak menimpa ilustrasi di sisi kanan.
    const x = CONTENT_LEFT + index * 198;
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.roundRect(x, 372, 186, 104, 18);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 38px ${fontFamily}`;
    ctx.fillText(formatNumber(stat.value), x + 16, 422);
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = `400 19px ${fontFamily}`;
    ctx.fillText(stat.label, x + 16, 456);
  });

  // Identitas platform
  drawContained(ctx, logo, CONTENT_LEFT, 516, 52);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 28px ${fontFamily}`;
  ctx.fillText("belajarautomation.com", CONTENT_LEFT + 66, 552);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Gagal membuat PNG"))), "image/png");
  });
}
