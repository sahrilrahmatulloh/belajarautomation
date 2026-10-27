"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { users } from "@/db/schema";

import {
  createSession,
} from "@/lib/auth/session";

import {
  loginSchema,
} from "@/lib/validators/auth";

export interface LoginState {
  success: boolean;
  message: string;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe:
      formData.get("rememberMe") === "on",
  });

  if (!result.success) {
    return {
      success: false,
      message:
        result.error.issues[0]?.message ??
        "Data login tidak valid",
    };
  }

  const {
    email,
    password,
    rememberMe,
  } = result.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  const passwordValid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  await createSession(
    user.id,
    rememberMe
  );

  redirect("/");
}