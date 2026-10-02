import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { createPdfBuffer } from "@/lib/export/createPdf";

export const runtime = "nodejs";

const exportSchema = z
  .object({
    documentId: z.string().min(1).optional(),
    title: z.string().trim().max(120).optional(),
    finalText: z.string().optional(),
  })
  .refine(
    (data) => data.documentId || data.finalText?.trim(),
    {
      message: "documentId or finalText is required.",
    },
  );

function sanitizeFilename(title) {
  const cleaned = (title || "nepali-document")
    .replace(/[\/\\:*?"<>|]/g, "-")
    .trim()
    .slice(0, 80);

  return cleaned || "nepali-document";
}

export async function POST(request) {
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

    const body = await request.json();
    const result = exportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_EXPORT_REQUEST",
            message:
              result.error.issues[0]?.message ||
              "Invalid export request.",
          },
        },
        { status: 400 },
      );
    }

    let title = result.data.title || "Nepali Document";
    let finalText = result.data.finalText || "";

    if (result.data.documentId) {
      const document = await prisma.document.findFirst({
        where: {
          id: result.data.documentId,
          userId: user.id,
        },
      });

      if (!document) {
        return NextResponse.json(
          {
            error: {
              code: "DOCUMENT_NOT_FOUND",
              message: "Document not found.",
            },
          },
          { status: 404 },
        );
      }

      title = document.title;
      finalText = document.finalText || "";
    }

    if (!finalText.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "EMPTY_DOCUMENT",
            message: "Document has no text to export.",
          },
        },
        { status: 400 },
      );
    }

    const buffer = await createPdfBuffer({
      title,
      text: finalText,
    });

    const safeFilename = sanitizeFilename(title);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename*=UTF-8''${encodeURIComponent(safeFilename)}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF export failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "PDF_EXPORT_FAILED",
          message: "PDF export failed.",
        },
      },
      { status: 500 },
    );
  }
}