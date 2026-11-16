"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface WeeklyPoint {
  // Rentang minggu untuk sumbu dan tooltip, mis. "9–15 Nov".
  label: string;
  value: number;
  // Keterangan tambahan di tooltip, mis. "+2 pengguna baru".
  detail?: string;
}

const HEIGHT = 200;
const PAD = { top: 16, right: 12, bottom: 28, left: 52 };
const DEFAULT_WIDTH = 480;

// Batas atas sumbu Y yang rapi, mis. 2.193.000 menjadi 3.000.000.
function niceMax(value: number) {
  if (value <= 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  // Kelipatan genap, agar garis tengah (setengahnya) juga angka bulat.
  return [1, 2, 3, 4, 5, 6, 8, 10].map((factor) => factor * step).find((candidate) => candidate >= value * 1.1) ?? step * 10;
}

// Grafik mingguan satu seri untuk Dashboard Admin dan Creator (PRD FR-16 A, FR-15): area untuk
// pertumbuhan, batang untuk jumlah per minggu. Tinggi tetap, lebar mengikuti kartu. Tooltip muncul
// saat diarahkan kursor, disentuh, atau dipilih dengan tombol panah; tabel data untuk pembaca layar.
export default function WeeklyChart({
  kind,
  points,
  formatValue,
  formatAxis = formatValue,
  label,
}: {
  kind: "area" | "bar";
  points: WeeklyPoint[];
  formatValue: (value: number) => string;
  formatAxis?: (value: number) => string;
  // Nama grafik untuk pembaca layar dan tabel data.
  label: string;
}) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const innerWidth = width - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const maxY = niceMax(Math.max(...points.map((point) => point.value)));
  const slot = innerWidth / points.length;
  // Area: titik di tengah setiap slot minggu, sama dengan posisi batang.
  const x = (index: number) => PAD.left + slot * index + slot / 2;
  const y = (value: number) => PAD.top + innerHeight - (value / maxY) * innerHeight;
  const ticks = [0, 0.5, 1].map((ratio) => maxY * ratio);
  // Label sumbu X dijarangkan agar tidak bertumpuk di layar sempit.
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerWidth / 64))));
  const barWidth = Math.max(6, Math.min(28, slot - 8));

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  const pickFromPointer = (clientX: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const index = Math.floor((clientX - rect.left - PAD.left) / slot);
    setActive(Math.min(points.length - 1, Math.max(0, index)));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = active ?? points.length - 1;
    setActive(Math.min(points.length - 1, Math.max(0, current + (event.key === "ArrowRight" ? 1 : -1))));
  };

  const activePoint = active === null ? null : points[active];
  const tooltipLeft = active === null ? 0 : Math.min(Math.max(x(active), 80), width - 80);

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        role="img"
        aria-label={`${label}. Gunakan tombol panah kiri dan kanan untuk melihat nilai setiap minggu.`}
        tabIndex={0}
        onPointerMove={(event) => pickFromPointer(event.clientX)}
        onPointerDown={(event) => pickFromPointer(event.clientX)}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive(points.length - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
        className="block touch-pan-y overflow-visible rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {kind === "area" && (
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
        )}

        {/* Garis bantu tipis dan label sumbu Y */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} className="stroke-border" strokeDasharray={tick === 0 ? undefined : "3 4"} />
            <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">
              {formatAxis(tick)}
            </text>
          </g>
        ))}

        {points.map((point, index) =>
          index % labelEvery === (points.length - 1) % labelEvery ? (
            <text key={point.label} x={x(index)} y={HEIGHT - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {point.label}
            </text>
          ) : null
        )}

        {kind === "area" ? (
          <>
            <path d={area} fill={`url(#${id}-fill)`} />
            <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {activePoint && active !== null && (
              <>
                <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} className="stroke-muted-foreground/50" strokeDasharray="3 3" />
                <circle cx={x(active)} cy={y(activePoint.value)} r="5" fill="var(--color-primary)" className="stroke-card" strokeWidth="2" />
              </>
            )}
          </>
        ) : (
          points.map((point, index) => {
            const top = y(point.value);
            const height = Math.max(0, y(0) - top);
            const radius = Math.min(4, height);
            const left = x(index) - barWidth / 2;
            // Sudut atas membulat, alas rata di garis dasar.
            const path = `M${left},${y(0)} V${top + radius} Q${left},${top} ${left + radius},${top} H${left + barWidth - radius} Q${left + barWidth},${top} ${left + barWidth},${top + radius} V${y(0)} Z`;
            return (
              <path
                key={point.label}
                d={path}
                fill="var(--color-primary)"
                opacity={active === null || active === index ? 1 : 0.45}
                className="transition-opacity duration-150"
              />
            );
          })
        )}
      </svg>

      {activePoint && active !== null && (
        <div
          aria-hidden="true"
          data-chart-tooltip=""
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
          style={{ left: tooltipLeft }}
        >
          <p className="font-medium text-muted-foreground">{activePoint.label}</p>
          <p className="text-sm font-bold tabular-nums">{formatValue(activePoint.value)}</p>
          {activePoint.detail && <p className="text-muted-foreground">{activePoint.detail}</p>}
        </div>
      )}

      {/* Data grafik untuk pembaca layar */}
      {/* Pembungkus sr-only: elemen table sendiri tetap melebar mengikuti isinya walau sr-only. */}
      <div className="sr-only">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Minggu</th>
            <th scope="col">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>
                {formatValue(point.value)}
                {point.detail ? `, ${point.detail}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

const WEEK_MS = 7 * 86_400_000;
const dayMonth = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
const dayOnly = new Intl.DateTimeFormat("id-ID", { day: "numeric", timeZone: "Asia/Jakarta" });

// Minggu-minggu terakhir, dari yang terlama; minggu terakhir berakhir saat data dimuat.
export function lastWeeks(now: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const end = now - (count - 1 - index) * WEEK_MS;
    const start = end - WEEK_MS;
    const first = new Date(start + 86_400_000);
    const last = new Date(end);
    const sameMonth = dayMonth.format(first).split(" ")[1] === dayMonth.format(last).split(" ")[1];
    return { start, end, label: `${sameMonth ? dayOnly.format(first) : dayMonth.format(first)}–${dayMonth.format(last)}` };
  });
}
