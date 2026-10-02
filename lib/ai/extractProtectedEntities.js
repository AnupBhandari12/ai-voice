import OpenAI from "openai";

import { EXTRACT_PROTECTED_ENTITIES_PROMPT } from "./prompts/extractProtectedEntities";

const PROTECTED_ENTITIES_SCHEMA = {
  type: "object",
  properties: {
    names: {
      type: "array",
      items: { type: "string" },
    },
    organizations: {
      type: "array",
      items: { type: "string" },
    },
    locations: {
      type: "array",
      items: { type: "string" },
    },
    addresses: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "names",
    "organizations",
    "locations",
    "addresses",
  ],
  additionalProperties: false,
};

export async function extractProtectedEntities(text) {
  if (!text?.trim()) {
    return {
      names: [],
      organizations: [],
      locations: [],
      addresses: [],
    };
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

    instructions: EXTRACT_PROTECTED_ENTITIES_PROMPT,

    input: `Extract protected entities from this text:

${text}`,

    text: {
      format: {
        type: "json_schema",
        name: "protected_entities",
        strict: true,
        schema: PROTECTED_ENTITIES_SCHEMA,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("Protected entity extraction response was empty.");
  }

  return JSON.parse(response.output_text);
}