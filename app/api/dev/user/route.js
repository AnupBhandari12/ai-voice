import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: {
          code: "NOT_AVAILABLE",
          message: "Development route is not available in production.",
        },
      },
      { status: 404 },
    );
  }

  try {
    const user = await prisma.user.upsert({
      where: {
        email: "dev@local.test",
      },

      update: {},

      create: {
        name: "Development User",
        email: "dev@local.test",
        passwordHash: "phase-7-placeholder",
      },

      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Development user setup failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DEV_USER_SETUP_FAILED",
          message: "Development user could not be created.",
        },
      },
      { status: 500 },
    );
  }
}