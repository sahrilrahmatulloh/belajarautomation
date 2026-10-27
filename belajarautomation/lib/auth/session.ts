import "server-only";

import {
  createHash,
  randomBytes,
} from "crypto";

import {
  and,
  eq,
  gt,
} from "drizzle-orm";

import { cookies } from "next/headers";

import { db } from "@/db";
import { sessions } from "@/db/schema";

const SESSION_COOKIE_NAME = "session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createSession(
  userId: string,
  rememberMe = false
) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + (rememberMe ? 30 : 1)
  );

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    }
  );
}

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return session ?? null;
}

export async function deleteSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await db
      .delete(sessions)
      .where(
        eq(sessions.tokenHash, tokenHash)
      );
  }

  cookieStore.delete(
    SESSION_COOKIE_NAME
  );
}