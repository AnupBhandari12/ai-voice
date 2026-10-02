import OpenAI from "openai";

import { AI_DOCUMENT_EXTRACTOR_PROMPT } from "./prompts/aiDocumentExtractor";
import { aiDocumentIntentSchema } from "./schemas/aiDocument";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractDocumentIntent(description) {
  const cleanDescription = description?.trim();

  if (!cleanDescription) {
    throw new Error("Document description is required.");
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-6-luna",

    instructions: AI_DOCUMENT_EXTRACTOR_PROMPT,

    input: [
      {
        role: "user",
        content: cleanDescription,
      },
    ],

    store: false,
  });

  const output = response.output_text?.trim();

  if (!output) {
    throw new Error("AI extractor returned an empty response.");
  }

  let parsedOutput;

  try {
    parsedOutput = JSON.parse(output);
  } catch {
    throw new Error("AI extractor returned invalid JSON.");
  }

  return aiDocumentIntentSchema.parse(parsedOutput);
}