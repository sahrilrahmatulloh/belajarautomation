"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  shape: "rect" | "circle" | "ribbon";
  wobble: number;
}

const DURATION_MS = 4500;
const GRAVITY = 0.14;
const DRAG = 0.992;

function burst(width: number, height: number, colors: string[]) {
  const particles: Particle[] = [];
  const make = (x: number, y: number, angle: number, speed: number) => {
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 7,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: (["rect", "circle", "ribbon"] as const)[Math.floor(Math.random() * 3)],
      wobble: Math.random() * Math.PI * 2,
    });
  };
  // Ledakan dari tengah.
  for (let i = 0; i < 90; i++) make(width / 2, height * 0.42, Math.random() * Math.PI * 2, 4 + Math.random() * 9);
  // Semburan dari kedua sudut bawah ke arah tengah.
  for (let i = 0; i < 60; i++) make(0, height, -Math.PI / 3 + (Math.random() - 0.5) * 0.6, 12 + Math.random() * 9);
  for (let i = 0; i < 60; i++) make(width, height, (-2 * Math.PI) / 3 + (Math.random() - 0.5) * 0.6, 12 + Math.random() * 9);
  return particles;
}

// Confetti perayaan di atas layar. Tidak tampil bila pengguna memilih mengurangi animasi.
export default function Confetti({ colors }: { colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    let particles = burst(width, height, colors);
    const start = performance.now();
    let secondBurst = false;
    let frame = 0;

    const draw = (time: number) => {
      const elapsed = time - start;
      // Semburan kedua agar terasa lebih meriah.
      if (!secondBurst && elapsed > 900) {
        secondBurst = true;
        particles = particles.concat(burst(width, height, colors).slice(0, 90));
      }
      context.clearRect(0, 0, width, height);
      const fade = elapsed > DURATION_MS - 1000 ? Math.max(0, (DURATION_MS - elapsed) / 1000) : 1;

      for (const particle of particles) {
        particle.vx *= DRAG;
        particle.vy = particle.vy * DRAG + GRAVITY;
        particle.wobble += 0.1;
        particle.x += particle.vx + Math.sin(particle.wobble) * 0.6;
        particle.y += particle.vy;
        particle.rotation += particle.spin;

        context.save();
        context.globalAlpha = fade;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        if (particle.shape === "circle") {
          context.beginPath();
          context.arc(0, 0, particle.size / 2.5, 0, Math.PI * 2);
          context.fill();
        } else if (particle.shape === "ribbon") {
          context.fillRect(-particle.size / 2, -1.5, particle.size, 3 + Math.abs(Math.sin(particle.wobble)) * 4);
        } else {
          context.fillRect(-particle.size / 2, -particle.size / 3, particle.size, (particle.size * 2) / 3);
        }
        context.restore();
      }

      if (elapsed < DURATION_MS) frame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [colors]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}
