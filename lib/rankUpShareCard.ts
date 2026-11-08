import { Rank } from "@/data/ranks";
import { formatNumber } from "@/lib/format";
import { drawContained, loadImage } from "@/lib/shareCard";

// Gambar pencapaian naik rank untuk dibagikan (PRD FR-05), dibuat di browser dengan canvas.
// Persegi 1080x1080 agar pas untuk status WhatsApp dan unggahan Instagram. Hanya memuat data
// publik: nama tampilan, username, rank, dan total XP.
export const RANK_UP_CARD_SIZE = 1080;

export interface RankUpCardData {
  rank: Rank;
  displayName: string;
  username: string | null;
  xp: number;
  // Ilustrasi perayaan; emblem rank dipakai bila gagal dimuat.
  image: string;
}

const SIZE = RANK_UP_CARD_SIZE;
const CONFETTI_COLORS = ["#FACC15", "#3B82F6", "#22D3EE", "#F472B6", "#FFFFFF"];

// Angka acak yang selalu sama, agar kartu yang dibuat ulang tetap identik.
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, weight: number, fontFamily: string, sizes: { max: number; min: number }) {
  let size = sizes.max;
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && size > sizes.min) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${fontFamily}`;
  }
  let fitted = text;
  while (ctx.measureText(fitted).width > maxWidth && fitted.length > 1) fitted = fitted.slice(0, -2) + "…";
  return fitted;
}

export async function createRankUpCard(data: RankUpCardData): Promise<Blob> {
  await document.fonts.ready;
  const [illustration, logo] = await Promise.all([
    loadImage(data.image).catch(() => loadImage(data.rank.emblem)),
    loadImage("/logo.webp"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");
  const fontFamily = getComputedStyle(document.body).fontFamily;
  const { rank } = data;
  const center = SIZE / 2;
  const stageY = 400;

  // Latar gelap dengan cahaya warna rank.
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const glow = ctx.createRadialGradient(center, stageY, 20, center, stageY, 560);
  glow.addColorStop(0, `${rank.color}aa`);
  glow.addColorStop(0.45, `${rank.color}33`);
  glow.addColorStop(1, "rgba(2, 6, 23, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Sinar dari belakang emblem.
  ctx.save();
  ctx.translate(center, stageY);
  ctx.fillStyle = `${rank.color}2e`;
  for (let i = 0; i < 18; i++) {
    ctx.rotate((Math.PI * 2) / 18);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-40, -760);
    ctx.lineTo(40, -760);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const vignette = ctx.createRadialGradient(center, stageY, 260, center, stageY, 720);
  vignette.addColorStop(0, "rgba(2, 6, 23, 0)");
  vignette.addColorStop(1, "rgba(2, 6, 23, 1)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Confetti.
  const random = seeded(rank.minXp + 7);
  for (let i = 0; i < 70; i++) {
    const x = random() * SIZE;
    const y = random() * 640;
    if (Math.hypot(x - center, y - stageY) < 230) continue;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random() * Math.PI);
    ctx.fillStyle = i % 4 === 0 ? (rank.accentColor ?? rank.color) : CONFETTI_COLORS[Math.floor(random() * CONFETTI_COLORS.length)];
    ctx.globalAlpha = 0.85;
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-9, -4, 18, 8);
    }
    ctx.restore();
  }

  // Identitas platform.
  drawContained(ctx, logo, 64, 56, 64);
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `700 34px ${fontFamily}`;
  ctx.fillText("belajarautomation.com", 144, 90);

  // Ilustrasi atau emblem.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  drawContained(ctx, illustration, center - 230, stageY - 230, 460);
  ctx.restore();

  ctx.textAlign = "center";

  // Label "Rank Up!".
  const pill = ctx.createLinearGradient(center - 150, 0, center + 150, 0);
  pill.addColorStop(0, "#2563EB");
  pill.addColorStop(1, "#4F46E5");
  ctx.fillStyle = pill;
  ctx.beginPath();
  ctx.roundRect(center - 150, 640, 300, 72, 36);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 40px ${fontFamily}`;
  ctx.fillText("Rank Up!", center, 677);

  // Nama dan rank baru.
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(fitText(ctx, data.displayName, 920, 800, fontFamily, { max: 60, min: 36 }), center, 772);
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.font = `500 32px ${fontFamily}`;
  ctx.fillText("naik ke rank", center, 826);

  ctx.font = `800 76px ${fontFamily}`;
  const rankWidth = ctx.measureText(rank.name).width + 96;
  ctx.fillStyle = "rgba(2, 6, 23, 0.7)";
  ctx.strokeStyle = rank.accentColor ?? rank.color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(center - rankWidth / 2, 860, rankWidth, 112, 56);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(rank.name, center, 918);

  // Total XP dan username.
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.font = `500 28px ${fontFamily}`;
  const footer = [data.username ? `@${data.username}` : null, `${formatNumber(data.xp)} XP`].filter(Boolean).join("  ·  ");
  ctx.fillText(footer, center, 1024);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Gagal membuat PNG"))), "image/png");
  });
}
