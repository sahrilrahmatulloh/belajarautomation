import ComingSoonButton from "@/components/roles/ComingSoonButton";

// Logo "G" Google dengan warna resmi.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.57-5.17 3.57-8.83Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.6H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.4l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.6l4.01 3.11C6.22 6.87 8.87 4.76 12 4.76Z" />
    </svg>
  );
}

// Masuk atau daftar dengan Google (PRD 4.5). Aktif setelah backend Supabase Auth tersedia.
export default function GoogleAuthOption({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="mb-6 space-y-6">
      <ComingSoonButton
        label={mode === "login" ? "Masuk dengan Google" : "Daftar dengan Google"}
        icon={<GoogleIcon />}
        variant="outline"
        fullWidth
      />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        atau dengan email
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </div>
  );
}
