import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/currentUser";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized." } },
      { status: 401 },
    );
  }

  const { id } = await params;

  const document = await prisma.document.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!document) {
    return NextResponse.json(
      { error: { message: "Document not found." } },
      { status: 404 },
    );
  }

  const duplicatedDocument = await prisma.document.create({
    data: {
      userId: user.id,
      title: `${document.title} (Copy)`,
      mode: document.mode,
      documentType: document.documentType,
      language: document.language,
      originalTranscript: document.originalTranscript,
      correctedText: document.correctedText,
      generatedText: document.generatedText,
      finalText: document.finalText,
      status: document.status,

      ...(document.protectedFacts !== null && {
        protectedFacts: document.protectedFacts,
      }),

      ...(document.warnings !== null && {
        warnings: document.warnings,
      }),
    },
  });

  return NextResponse.json(
    {
      document: duplicatedDocument,
    },
    { status: 201 },
  );
}