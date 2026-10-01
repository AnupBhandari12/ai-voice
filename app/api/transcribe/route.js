import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/speech";

const MAX_AUDIO_BYTES = 12_000_000;

const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");

    // The request must contain an actual uploaded audio file.
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: {
            code: "AUDIO_REQUIRED",
            message: "Audio file is required.",
          },
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: {
            code: "EMPTY_AUDIO",
            message: "Recorded audio is empty.",
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        {
          error: {
            code: "AUDIO_TOO_LARGE",
            message: "Audio file is too large.",
          },
        },
        { status: 413 }
      );
    }

    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: {
            code: "UNSUPPORTED_AUDIO_TYPE",
            message: "Unsupported audio format.",
          },
        },
        { status: 415 }
      );
    }

    const result = await transcribeAudio({ file });

    return NextResponse.json({
      transcript: result.text,
      provider: result.provider,
    });
  } catch (error) {
    console.error("Transcription failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "TRANSCRIPTION_FAILED",
          message: "Transcription could not be completed.",
        },
      },
      { status: 502 }
    );
  }
}