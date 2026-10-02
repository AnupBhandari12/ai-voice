import { extractDeterministicFacts } from "./extractFacts";

const CATEGORY_SEVERITY = {
  phone: "high",
  email: "medium",
  amount: "high",
  date: "high",
  number: "high",
};

function compareCategory(category, originalValues, cleanedValues) {
  const warnings = [];

  for (const value of originalValues) {
    if (!cleanedValues.includes(value)) {
      warnings.push({
        code: "FACT_REMOVED_OR_CHANGED",
        category,
        value,
        severity: CATEGORY_SEVERITY[category] || "medium",
        message: `${category} value "${value}" was removed or changed.`,
      });
    }
  }

  for (const value of cleanedValues) {
    if (!originalValues.includes(value)) {
      warnings.push({
        code: "FACT_ADDED_OR_CHANGED",
        category,
        value,
        severity: CATEGORY_SEVERITY[category] || "medium",
        message: `${category} value "${value}" was added or changed.`,
      });
    }
  }

  return warnings;
}

function getSpecializedNumberTokens(facts) {
  const values = [
    ...facts.phones,
    ...facts.amounts,
    ...facts.dates,
  ];

  const tokens = values.flatMap(
    (value) => value.match(/\d+(?:[.,]\d+)?/g) || [],
  );

  return new Set(tokens);
}

function getGenericNumbers(facts) {
  const specializedNumbers = getSpecializedNumberTokens(facts);

  return facts.numbers.filter(
    (number) => !specializedNumbers.has(number),
  );
}

export function compareProtectedFacts(originalText = "", cleanedText = "") {
  const originalFacts = extractDeterministicFacts(originalText);
  const cleanedFacts = extractDeterministicFacts(cleanedText);

  const originalGenericNumbers = getGenericNumbers(originalFacts);
  const cleanedGenericNumbers = getGenericNumbers(cleanedFacts);

  const warnings = [
    ...compareCategory(
      "phone",
      originalFacts.phones,
      cleanedFacts.phones,
    ),
    ...compareCategory(
      "email",
      originalFacts.emails,
      cleanedFacts.emails,
    ),
    ...compareCategory(
      "amount",
      originalFacts.amounts,
      cleanedFacts.amounts,
    ),
    ...compareCategory(
      "date",
      originalFacts.dates,
      cleanedFacts.dates,
    ),
    ...compareCategory(
      "number",
      originalGenericNumbers,
      cleanedGenericNumbers,
    ),
  ];

  return {
    isSafe: warnings.length === 0,
    warnings,
    originalFacts,
    cleanedFacts,
  };
}