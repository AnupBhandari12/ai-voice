import OpenAI from "openai";

import { AI_DOCUMENT_GENERATOR_PROMPT } from "./prompts/aiDocumentGenerator";
import { aiDocumentIntentSchema } from "./schemas/aiDocument";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDocumentDraft(intent) {
  const validatedIntent = aiDocumentIntentSchema.parse(intent);

  const response = await openai.responses.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-6-luna",

    instructions: AI_DOCUMENT_GENERATOR_PROMPT,

    input: JSON.stringify(validatedIntent, null, 2),

    store: false,
  });

  const draft = response.output_text?.trim();

  if (!draft) {
    throw new Error("AI document generator returned an empty response.");
  }

  return draft;
}