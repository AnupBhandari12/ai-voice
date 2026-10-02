import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

const updateDocumentSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    documentType: z.string().trim().min(1).max(80).optional(),
    originalTranscript: z.string().optional(),
    correctedText: z.string().optional(),
    generatedText: z.string().optional(),
    finalText: z.string().optional(),
    status: z.enum(["DRAFT", "READY", "ERROR"]).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required.",
  );

export async function GET(request, { params }) {
  try {
    const { id } = await params;

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

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          error: {
            code: "DOCUMENT_NOT_FOUND",
            message: "Document was not found.",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      document,
    });
  } catch (error) {
    console.error("Document load failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DOCUMENT_LOAD_FAILED",
          message: "Document could not be loaded.",
        },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();
    const result = updateDocumentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_DOCUMENT_UPDATE",
            message:
              result.error.issues[0]?.message ||
              "Invalid document update.",
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

    const existingDocument = await prisma.document.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        {
          error: {
            code: "DOCUMENT_NOT_FOUND",
            message: "Document was not found.",
          },
        },
        { status: 404 },
      );
    }

    const document = await prisma.document.update({
      where: {
        id,
      },
      data: result.data,
    });

    return NextResponse.json({
      ok: true,
      document,
    });
  } catch (error) {
    console.error("Document update failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DOCUMENT_UPDATE_FAILED",
          message: "Document could not be updated.",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
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

    const existingDocument = await prisma.document.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        {
          error: {
            code: "DOCUMENT_NOT_FOUND",
            message: "Document was not found.",
          },
        },
        { status: 404 },
      );
    }

    await prisma.document.delete({
      where: {
        id,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Document delete failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "DOCUMENT_DELETE_FAILED",
          message: "Document could not be deleted.",
        },
      },
      { status: 500 },
    );
  }
}