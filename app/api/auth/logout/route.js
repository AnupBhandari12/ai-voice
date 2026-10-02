import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  getSessionCookie,
} from "@/lib/auth/sessionCookie";
import { deleteSessionByToken } from "@/lib/auth/sessionStore";

export async function POST() {
  try {
    const token = await getSessionCookie();

    if (token) {
      await deleteSessionByToken(token);
    }

    await clearSessionCookie();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Logout failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "LOGOUT_FAILED",
          message: "Logout could not be completed.",
        },
      },
      { status: 500 },
    );
  }
}