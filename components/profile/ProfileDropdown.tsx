"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Crown,
  LogIn,
  LogOut,
  Settings,
  User,
  UserPlus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/data/navigation";
import { DEFAULT_AVATAR } from "@/data/profile";
import { sessionActions, useSession } from "@/lib/session";

export default function ProfileDropdown() {
  const router = useRouter();
  const session = useSession();

  const displayName = session?.name ?? "Tamu";
  const displayStatus = session ? ROLE_LABELS[session.role] : "Belum masuk";

  const handleSignOut = () => {
    sessionActions.signOut();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-h-11 min-w-11 items-center gap-3 rounded-xl p-1 transition-colors hover:bg-accent"
        aria-label="Buka menu profil"
      >
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src={DEFAULT_AVATAR} alt="Foto profil" />
          <AvatarFallback>
            BA
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left lg:block">
          <p className="max-w-40 truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>

          <p className="text-xs text-muted-foreground">
            {displayStatus}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64"
      >
        {/* User Info */}
        <div className="px-2 py-3">
          <p className="truncate text-sm font-semibold">
            {displayName}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {session ? session.email : displayStatus}
          </p>
        </div>

        <DropdownMenuSeparator />

        {!session && (
          <>
            <DropdownMenuItem className="p-0">
              <Link
                href="/login"
                className="flex w-full items-center gap-2 px-2 py-1.5 font-medium text-primary"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <Link
                href="/register"
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <UserPlus className="h-4 w-4" />
                Daftar
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        {/* Profile */}
        <DropdownMenuItem className="p-0">
          <Link
            href="/profile"
            className="flex w-full items-center gap-2 px-2 py-1.5"
          >
            <User className="h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem className="p-0">
          <Link
            href="/settings"
            className="flex w-full items-center gap-2 px-2 py-1.5"
          >
            <Settings className="h-4 w-4" />
            Pengaturan
          </Link>
        </DropdownMenuItem>

        {/* Premium */}
        <DropdownMenuItem className="p-0">
          <Link
            href="/premium"
            className="flex w-full items-center gap-2 px-2 py-1.5"
          >
            <Crown className="h-4 w-4" />
            Lihat Premium
          </Link>
        </DropdownMenuItem>

        {session && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 px-2 py-1.5 text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
