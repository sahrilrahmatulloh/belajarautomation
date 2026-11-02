"use client";

import { FormEvent, useState } from "react";

import { Input } from "@/components/ui/input";

const FIELDS = [
  { id: "nama", label: "Nama lengkap", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Password", type: "password" },
  { id: "konfirmasi", label: "Konfirmasi password", type: "password" },
];

// Halaman latihan untuk Locator Challenge: tanpa bug yang ditanam. Beberapa kolom,
// kotak centang, dan tombol sengaja mirip agar selector yang terlalu umum mengenai
// lebih dari satu elemen.
export default function PracticeRegistration() {
  const [agreed, setAgreed] = useState(false);
  const [result, setResult] = useState<"success" | "needs-agreement" | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setResult(agreed ? "success" : "needs-agreement");
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      data-practice-id="registrasi-form"
      className="mx-auto max-w-lg space-y-4"
    >
      <h2 data-practice-id="registrasi-title" className="text-xl font-bold">
        Daftar di TokoLatihan
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.id} className="min-w-0 space-y-1.5">
            <label htmlFor={`registrasi-${field.id}`} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={`registrasi-${field.id}`}
              name={field.id}
              type={field.type}
              autoComplete={field.type === "password" ? "new-password" : "off"}
              data-practice-id={`registrasi-${field.id}`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="registrasi-peran" className="text-sm font-medium">
          Peran saat ini
        </label>
        <select
          id="registrasi-peran"
          name="peran"
          data-practice-id="registrasi-peran"
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="pelajar">Pelajar</option>
          <option value="qa">QA Engineer</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="buletin"
            data-practice-id="registrasi-buletin"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          />
          Kirimi saya buletin TokoLatihan
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="syarat"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            data-practice-id="registrasi-syarat"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          />
          Saya setuju dengan syarat dan ketentuan
        </label>
      </div>

      {result === "needs-agreement" && (
        <p role="alert" data-practice-id="registrasi-error" className="text-sm font-medium text-destructive">
          Setujui syarat dan ketentuan untuk mendaftar.
        </p>
      )}
      {result === "success" && (
        <p role="status" data-practice-id="registrasi-success" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Pendaftaran latihan berhasil. Tidak ada akun yang dibuat.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          data-practice-id="registrasi-submit"
          className="min-h-10 flex-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Daftar
        </button>
        <button
          type="reset"
          data-practice-id="registrasi-reset"
          onClick={() => {
            setAgreed(false);
            setResult(null);
          }}
          className="min-h-10 flex-1 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          Kosongkan
        </button>
      </div>
    </form>
  );
}
