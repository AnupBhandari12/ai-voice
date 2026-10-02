import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/currentUser";
import { extractDocumentIntent } from "@/lib/ai/extractDocumentIntent";
import { evaluateDocumentIntent } from "@/lib/ai/evaluateDocumentIntent";
import { generateDocumentDraft } from "@/lib/ai/generateDocumentDraft";
import { validateGeneratedDraft } from "@/lib/ai/validateGeneratedDraft";
const requestSchema = z.object({
    description: z.string().trim().min(1).max(10000),
});

export async function POST(request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                error: {
                    message: "Unauthorized.",
                },
            },
            { status: 401 },
        );
    }

    try {
        const body = await request.json();

        const result = requestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: {
                        message: "Valid document description is required.",
                    },
                },
                { status: 400 },
            );
        }

        const intent = await extractDocumentIntent(
            result.data.description,
        );

        const decision = evaluateDocumentIntent(intent);

        if (!decision.canGenerate) {
            return NextResponse.json({
                intent,
                decision,
                draft: null,
            });
        }

        const draft = await generateDocumentDraft(intent);

        const validation = await validateGeneratedDraft(
            result.data.description,
            draft,
        );

        return NextResponse.json({
            intent,
            decision,
            draft,
            validation,
        });
    } catch (error) {
        console.error("AI document extraction failed:", error.message);

        return NextResponse.json(
            {
                error: {
                    message: "Could not analyze the document request.",
                },
            },
            { status: 502 },
        );
    }
}