import { normalizeTextForComparison } from "./normalize";

const ENTITY_SEVERITY = {
  names: "high",
  organizations: "high",
  locations: "high",
  addresses: "high",
};

function normalizeEntity(value = "") {
  return normalizeTextForComparison(value).toLocaleLowerCase();
}

function compareCategory(category, originalValues, cleanedValues) {
  const warnings = [];

  const normalizedOriginal = originalValues.map(normalizeEntity);
  const normalizedCleaned = cleanedValues.map(normalizeEntity);

  for (let index = 0; index < originalValues.length; index++) {
    const value = originalValues[index];

    if (!normalizedCleaned.includes(normalizedOriginal[index])) {
      warnings.push({
        code: "ENTITY_REMOVED_OR_CHANGED",
        category,
        value,
        severity: ENTITY_SEVERITY[category] || "high",
        message: `${category} value "${value}" was removed or changed.`,
      });
    }
  }

  for (let index = 0; index < cleanedValues.length; index++) {
    const value = cleanedValues[index];

    if (!normalizedOriginal.includes(normalizedCleaned[index])) {
      warnings.push({
        code: "ENTITY_ADDED_OR_CHANGED",
        category,
        value,
        severity: ENTITY_SEVERITY[category] || "high",
        message: `${category} value "${value}" was added or changed.`,
      });
    }
  }

  return warnings;
}

export function compareProtectedEntities(
  originalEntities,
  cleanedEntities,
) {
  return [
    ...compareCategory(
      "names",
      originalEntities.names || [],
      cleanedEntities.names || [],
    ),
    ...compareCategory(
      "organizations",
      originalEntities.organizations || [],
      cleanedEntities.organizations || [],
    ),
    ...compareCategory(
      "locations",
      originalEntities.locations || [],
      cleanedEntities.locations || [],
    ),
    ...compareCategory(
      "addresses",
      originalEntities.addresses || [],
      cleanedEntities.addresses || [],
    ),
  ];
}