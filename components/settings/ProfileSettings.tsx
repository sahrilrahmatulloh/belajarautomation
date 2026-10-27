"use client";

import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

export default function ProfileSettings() {
  const [name, setName] = useState("Aril");
  const [role, setRole] = useState(
    "QA Automation Engineer"
  );
  const [email, setEmail] = useState(
    "aril@example.com"
  );

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">
        Profile Information
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Perbarui informasi yang ditampilkan pada profil kamu.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Aril"
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>

        <button
          type="button"
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Ubah Foto
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">
            Nama
          </label>

          <Input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Role
          </label>

          <Input
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="mt-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium">
            Email
          </label>

          <Input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="mt-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Simpan Perubahan
        </button>
      </div>
    </section>
  );
}