"use client";

import { useId, useState } from "react";
import { TrendingUp } from "lucide-react";

import { dateFromDaysAgo, formatNumber } from "@/lib/format";
import { cumulativeXp } from "@/lib/xpHistory";

const PERIODS = [
  { days: 7, label: "7 Hari" },
  { days: 30, label: "30 Hari" },
  { days: 90, label: "90 Hari" },
];
const DEFAULT_DAYS = 30;

// Ukuran kanvas SVG; tampil responsif mengikuti lebar kartu.
// Lebar mendekati lebar kartu di desktop agar teks sumbu tidak mengecil.
const WIDTH = 400;
const HEIGHT = 210;
const PAD = { top: 30, right: 16, bottom: 28, left: 40 };
const X_LABELS = 7;

const shortDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });

// Batas atas sumbu Y yang rapi, mis. 420 menjadi 600 dengan 4 langkah 150.
function niceMax(value: number) {
  if (value <= 0) return 100;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  const candidates = [1, 1.5, 2, 3, 4, 5, 6, 8, 10].map((factor) => factor * step);
  return candidates.find((candidate) => candidate >= value * 1.15) ?? step * 10;
}

// Grafik Progres XP di Ringkasan profil (PRD FR-13): total XP kumulatif per hari.
export default function XpProgressChart({
  totalXp,
  gainsByDaysAgo,
}: {
  totalXp: number;
  gainsByDaysAgo: Map<number, number>;
}) {
  const [days, setDays] = useState(DEFAULT_DAYS);
  // Grafik hanya dirender di browser, jadi tanggalnya mengikuti zona waktu pengguna.
  const [today] = useState(() => new Date());
  const selectId = useId();

  const points = cumulativeXp(totalXp, gainsByDaysAgo, days);
  const first = points[0].xp;
  const gained = totalXp - first;
  const maxY = niceMax(Math.max(...points.map((point) => point.xp)));
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) => PAD.left + (points.length === 1 ? innerWidth : (index / (points.length - 1)) * innerWidth);
  const y = (value: number) => PAD.top + innerHeight - (value / maxY) * innerHeight;

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(point.xp).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxY * ratio));
  const xLabelIndexes = Array.from({ length: X_LABELS }, (_, index) => Math.round((index / (X_LABELS - 1)) * (points.length - 1)));
  const lastX = x(points.length - 1);
  const lastY = y(totalXp);
  const gradientId = `${selectId}-area`;
  const periodLabel = PERIODS.find((period) => period.days === days)!.label.toLowerCase();

  return (
    <section aria-labelledby={`${selectId}-judul`} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id={`${selectId}-judul`} className="flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5 text-primary-accent" aria-hidden="true" />
          Progres XP
        </h2>
        <label htmlFor={selectId} className="sr-only">
          Periode grafik XP
        </label>
        <select
          id={selectId}
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm font-medium dark:bg-card"
        >
          {PERIODS.map((period) => (
            <option key={period.days} value={period.days}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ringkasan teks untuk pembaca layar; grafiknya sendiri dekoratif. */}
      <p className="sr-only">
        {gained > 0
          ? `Total XP naik dari ${formatNumber(first)} menjadi ${formatNumber(totalXp)} dalam ${periodLabel} terakhir.`
          : `Belum ada XP baru dalam ${periodLabel} terakhir. Total XP ${formatNumber(totalXp)}.`}
      </p>

      {gained <= 0 && totalXp === 0 ? (
        <p className="flex flex-1 items-center justify-center py-10 text-center text-sm text-muted-foreground">
          Belum ada XP. Selesaikan lesson atau latihan pertamamu untuk mulai melihat progres.
        </p>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" className="mt-3 h-auto w-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} className="stroke-border" strokeDasharray={tick === 0 ? undefined : "3 4"} />
              <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[12px] tabular-nums">
                {formatNumber(tick)}
              </text>
            </g>
          ))}

          {xLabelIndexes.map((index, position) => (
            <text
              key={`${index}-${position}`}
              x={x(index)}
              y={HEIGHT - 6}
              // Label ujung kanan rata kanan agar tidak keluar kartu; lainnya di tengah titiknya.
              textAnchor={position === X_LABELS - 1 ? "end" : "middle"}
              className="fill-muted-foreground text-[12px]"
            >
              {shortDate.format(dateFromDaysAgo(today, points[index].daysAgo))}
            </text>
          ))}

          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          <circle cx={lastX} cy={lastY} r="7" fill="var(--color-primary)" fillOpacity="0.25" />
          <circle cx={lastX} cy={lastY} r="4" fill="var(--color-primary)" className="stroke-card" strokeWidth="2" />
          <g transform={`translate(${Math.min(lastX, WIDTH - PAD.right - 30)}, ${Math.max(lastY - 20, 12)})`}>
            <rect x="-34" y="-12" width="68" height="22" rx="6" fill="var(--color-primary)" />
            <text textAnchor="middle" dy="0.32em" y="-1" className="fill-primary-foreground text-[12px] font-semibold tabular-nums">
              {formatNumber(totalXp)} XP
            </text>
          </g>
        </svg>
      )}
    </section>
  );
}
