import OpenAI from "openai";

import { CLEAN_NEPALI_SYSTEM_PROMPT } from "./prompts/cleanNepali";

const CLEAN_NEPALI_SCHEMA = {
  type: "object",
  properties: {
    correctedText: {
      type: "string",
    },
    uncertainSpans: {
      type: "array",
      items: {
        type: "string",
      },
    },
    notes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["correctedText", "uncertainSpans", "notes"],
  additionalProperties: false,
};

export async function cleanNepaliText(transcript) {
  if (!transcript?.trim()) {
    throw new Error("Transcript is required.");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!process.env.OPENAI_TEXT_MODEL) {
    throw new Error("OPENAI_TEXT_MODEL is not configured.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.responses.create({
    model: process.env.OPENAI_TEXT_MODEL,

    instructions: CLEAN_NEPALI_SYSTEM_PROMPT,

    input: `Clean this Nepali transcript according to the system rules:

${transcript}`,

    text: {
      format: {
        type: "json_schema",
        name: "clean_nepali_result",
        strict: true,
        schema: CLEAN_NEPALI_SCHEMA,
      },
    },
  });

  if (!response.output_text) {
  throw new Error("Clean Nepali response was empty.");
}

const result = JSON.parse(response.output_text);

if (!result.correctedText?.trim()) {
  throw new Error("Clean Nepali returned empty correctedText.");
}

return result;
}