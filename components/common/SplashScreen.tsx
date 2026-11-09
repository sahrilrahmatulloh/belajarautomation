"use client";

import { useLayoutEffect } from "react";
import Image from "next/image";

import { SPLASH_STORAGE_KEY } from "@/lib/splash";

export default function SplashScreen() {
  // Halaman 404 dirender di browser, jadi skrip di <head> (SPLASH_INIT_SCRIPT) tidak berjalan.
  // Diperiksa lagi sebelum tampil agar splash tidak muncul ulang bagi yang sudah melihatnya.
  useLayoutEffect(() => {
    try {
      if (window.localStorage.getItem(SPLASH_STORAGE_KEY)) {
        document.documentElement.dataset.splash = "seen";
      }
      window.localStorage.setItem(SPLASH_STORAGE_KEY, "1");
    } catch {
      // localStorage tidak tersedia; splash akan tampil lagi saat dimuat ulang.
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
          src="/logo.webp"
          alt=""
          width={96}
          height={96}
          priority
          className="h-24 w-24 object-contain"
        />
        <p className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          belajarautomation.com
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
