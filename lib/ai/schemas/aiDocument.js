import { z } from "zod";

export const AI_DOCUMENT_TYPES = [
  "general_application",
  "school_college_application",
  "office_application",
  "bank_application",
  "police_complaint",
  "general_letter",
  "business_letter",
  "notice",
  "social_media_post",
  "custom_document",
];

const jsonValueSchema = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const uncertainFieldSchema = z.union([
  z.string(),
  z.record(z.string(), jsonValueSchema),
]);

export const aiDocumentIntentSchema = z.object({
  documentType: z.enum(AI_DOCUMENT_TYPES),

  language: z.literal("ne"),

  purpose: z.string().min(1),

  facts: z.record(
    z.string(),
    jsonValueSchema,
  ),

  missingFields: z.array(z.string()),

  uncertainFields: z.array(uncertainFieldSchema),
});