import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      plan: users.plan,
      emailVerified: users.emailVerified,
      name: profiles.name,
      role: profiles.role,
      bio: profiles.bio,
      avatarUrl: profiles.avatarUrl,
    })
    .from(users)
    .leftJoin(
      profiles,
      eq(profiles.userId, users.id)
    )
    .where(eq(users.id, session.userId))
    .limit(1);

  return user ?? null;
}