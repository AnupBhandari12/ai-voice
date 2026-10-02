import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/currentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required.",
          },
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Current user lookup failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "CURRENT_USER_FAILED",
          message: "Current user could not be loaded.",
        },
      },
      { status: 500 },
    );
  }
}