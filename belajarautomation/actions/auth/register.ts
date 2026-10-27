"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { registerSchema } from "@/lib/validators/auth";

export interface RegisterState {
  success: boolean;
  message: string;
}

export async function registerAction(
  _previousState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      success: false,
      message:
        result.error.issues[0]?.message ??
        "Data tidak valid",
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email,
          passwordHash,
        })
        .returning({
          id: users.id,
        });

      await tx.insert(profiles).values({
        userId: user.id,
        name,
      });
    });

    return {
      success: true,
      message: "Akun berhasil dibuat",
    };
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return {
      success: false,
      message:
        "Terjadi kesalahan saat membuat akun",
    };
  }
}