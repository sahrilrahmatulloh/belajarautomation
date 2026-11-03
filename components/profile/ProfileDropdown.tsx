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
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE_HOME, ROLE_LABELS } from "@/data/navigation";
import { ACTIVE_AVATAR } from "@/data/dummy/appearance";
import { sessionActions, useSession } from "@/lib/session";
import { useViewMode, viewModeActions } from "@/lib/viewMode";

const LEARNING_MODE = "belajar";
const ROLE_MODE = "peran";

export default function ProfileDropdown() {
  const router = useRouter();
  const session = useSession();

  const displayName = session?.name ?? "Tamu";
  const { hasRole, isRoleMode } = useViewMode();
  const displayStatus = !session
    ? "Belum masuk"
    : hasRole && !isRoleMode
      ? `${ROLE_LABELS[session.role]} · Mode Belajar`
      : ROLE_LABELS[session.role];

  const switchMode = (mode: string) => {
    if (!session) return;
    if (mode === LEARNING_MODE) {
      viewModeActions.switchToLearning(session.email);
      router.push(ROLE_HOME.user);
    } else {
      viewModeActions.switchToRole();
      router.push(ROLE_HOME[session.role]);
    }
  };

  const handleSignOut = () => {
    sessionActions.signOut();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-h-11 min-w-11 items-center gap-3 rounded-xl p-1 transition-colors hover:bg-accent"
      >
        {/* Nama tombol memuat teks yang terlihat, agar pengguna perintah suara bisa menyebutnya. */}
        <span className="sr-only">Buka menu profil</span>

        <Avatar aria-hidden="true" className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src={ACTIVE_AVATAR.image} alt="" />
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
        // Menu dirender di luar struktur halaman, jadi diberi landmark sendiri.
        positionerProps={{ role: "navigation", "aria-label": "Menu profil" }}
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
                className="flex w-full items-center gap-2 px-2 py-1.5 font-medium text-primary-accent"
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

        {/* Pengalih mode (PRD FR-15) */}
        {session && hasRole && (
          <>
            <DropdownMenuRadioGroup value={isRoleMode ? ROLE_MODE : LEARNING_MODE} onValueChange={switchMode}>
              <DropdownMenuLabel>Mode tampilan</DropdownMenuLabel>
              <DropdownMenuRadioItem value={LEARNING_MODE} closeOnClick>
                Mode Belajar
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={ROLE_MODE} closeOnClick>
                Mode {ROLE_LABELS[session.role]}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

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

        {/* Membership, hanya di Mode Belajar (PRD FR-15) */}
        {!isRoleMode && (
          <DropdownMenuItem className="p-0">
            <Link
              href="/membership"
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <Crown className="h-4 w-4" />
              Lihat Membership
            </Link>
          </DropdownMenuItem>
        )}

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
