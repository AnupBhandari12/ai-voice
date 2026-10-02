import { normalizeTextForComparison } from "./normalize";

function unique(values) {
  return [...new Set(values)];
}

function cleanPhone(value) {
  return value.replace(/[\s-]/g, "");
}

export function extractDeterministicFacts(text = "") {
  const normalizedText = normalizeTextForComparison(text);

  const emails =
    normalizedText.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    ) || [];

  const phoneMatches =
    normalizedText.match(/\+?\d[\d\s-]{7,}\d/g) || [];

  const phones = phoneMatches.map(cleanPhone);

  const amounts =
    normalizedText.match(
      /(?:NPR|Rs\.?|रु\.?)\s*\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?\s*(?:रुपैयाँ|रुपैया|NPR|Rs\.?|रु\.?)/gi,
    ) || [];

  const dates =
    normalizedText.match(
      /\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/g,
    ) || [];

  const numbers =
    normalizedText.match(/\d+(?:[.,]\d+)?/g) || [];

  return {
    phones: unique(phones),
    emails: unique(emails),
    amounts: unique(amounts),
    dates: unique(dates),
    numbers: unique(numbers),
  };
}