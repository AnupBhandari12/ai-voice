import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  mode: z.enum(["exact", "clean", "ai-document"]),
  documentType: z.string().trim().min(1).max(80).optional(),
  originalTranscript: z.string().optional(),
  correctedText: z.string().optional(),
  generatedText: z.string().optional(),
  finalText: z.string().optional(),
});

const MODE_MAP = {
  exact: "EXACT",
  clean: "CLEAN",
  "ai-document": "AI_DOCUMENT",
};
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

    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      documents,
    });
  } catch (error) {
    console.error("Document list failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DOCUMENT_LIST_FAILED",
          message: "Documents could not be loaded.",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = createDocumentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_DOCUMENT",
            message:
              result.error.issues[0]?.message ||
              "Invalid document data.",
          },
        },
        { status: 400 },
      );
    }

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

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        title: result.data.title,
        mode: MODE_MAP[result.data.mode],
        originalTranscript:
          result.data.originalTranscript || null,
        correctedText:
          result.data.correctedText || null,
        generatedText:
          result.data.generatedText || null,
        documentType:
          result.data.documentType || null,
        finalText:
          result.data.finalText || null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        document,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Document creation failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DOCUMENT_CREATE_FAILED",
          message: "Document could not be created.",
        },
      },
      { status: 500 },
    );
  }
}