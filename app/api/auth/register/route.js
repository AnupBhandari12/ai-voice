import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/sessionStore";
import { setSessionCookie } from "@/lib/auth/sessionCookie";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REGISTRATION",
            message:
              result.error.issues[0]?.message ||
              "Invalid registration data.",
          },
        },
        { status: 400 },
      );
    }

    const name = result.data.name.trim();
    const email = result.data.email.trim().toLowerCase();
    const password = result.data.password;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email already exists.",
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const session = await createSession(user.id);

    await setSessionCookie(session.token);

    return NextResponse.json(
      {
        ok: true,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "REGISTRATION_FAILED",
          message: "Account could not be created.",
        },
      },
      { status: 500 },
    );
  }
}