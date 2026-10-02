import { NextResponse } from "next/server";
import { z } from "zod";

import { cleanNepaliText } from "@/lib/ai/cleanNepali";

const MAX_TEXT_CHARS = Number(
  process.env.MAX_TEXT_CHARS || 30000
);

const cleanTextSchema = z.object({
  transcript: z
    .string()
    .trim()
    .min(1, "Transcript is required.")
    .max(
      MAX_TEXT_CHARS,
      `Transcript must be ${MAX_TEXT_CHARS} characters or less.`
    ),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const result = cleanTextSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_TRANSCRIPT",
            message:
              result.error.issues[0]?.message ||
              "Invalid transcript.",
          },
        },
        { status: 400 }
      );
    }

    const cleanedResult = await cleanNepaliText(
      result.data.transcript
    );

    return NextResponse.json({
      correctedText: cleanedResult.correctedText,
      uncertainSpans: cleanedResult.uncertainSpans,
      notes: cleanedResult.notes,
    });
  } catch (error) {
    console.error("Clean Nepali failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "CLEAN_TEXT_FAILED",
          message: "Clean Nepali could not be completed.",
        },
      },
      { status: 502 }
    );
  }
}