"use client";

import { useEffect } from "react";
import Image from "next/image";

import { SPLASH_STORAGE_KEY } from "@/lib/splash";

export default function SplashScreen() {
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // sessionStorage tidak tersedia; splash akan tampil lagi saat dimuat ulang.
    }
  }, []);

  // Animasi muncul dan menghilang diatur CSS agar tetap hilang tanpa JavaScript.
  return (
    <div
      aria-hidden="true"
      className="splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="splash-content flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          priority
          className="h-24 w-24 object-contain"
        />
        <p className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          belajarautomation.id
        </p>
        <p className="mt-1 text-sm font-medium text-brand-blue">
          Learn · Practice · Build · Grow
        </p>
        <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-muted">
          <div className="splash-progress h-full rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
