import { UserRole } from "./Role";

export interface DummyAccount {
  name: string;
  email: string;
  role: UserRole;
}

// Sesi dummy di browser; tidak menyimpan password.
export interface Session {
  name: string;
  email: string;
  role: UserRole;
}
