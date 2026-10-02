import { NextResponse } from "next/server";
import { z } from "zod";

import { cleanNepaliText } from "@/lib/ai/cleanNepali";
import { compareProtectedFacts } from "../../../lib/reliability/compareFacts";
import { extractProtectedEntities } from "../../../lib/ai/extractProtectedEntities";
import { compareProtectedEntities } from "../../../lib/reliability/compareEntities";

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

    const reliabilityResult = compareProtectedFacts(
      result.data.transcript,
      cleanedResult.correctedText,
    );

    const [originalEntities, cleanedEntities] = await Promise.all([
      extractProtectedEntities(result.data.transcript),
      extractProtectedEntities(cleanedResult.correctedText),
    ]);

    const entityWarnings = compareProtectedEntities(
      originalEntities,
      cleanedEntities,
    );

    const reliabilityWarnings = [
      ...reliabilityResult.warnings,
      ...entityWarnings,
    ];

    const isSafe = reliabilityWarnings.length === 0;

    return NextResponse.json({
      correctedText: cleanedResult.correctedText,
      uncertainSpans: cleanedResult.uncertainSpans,
      notes: cleanedResult.notes,
      isSafe,
      reliabilityWarnings,
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