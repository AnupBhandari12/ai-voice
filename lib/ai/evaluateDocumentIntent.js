export function evaluateDocumentIntent(intent) {
  const missingFields = intent.missingFields || [];
  const uncertainFields = intent.uncertainFields || [];

  return {
    canGenerate: missingFields.length === 0,
    needsMoreInformation: missingFields.length > 0,
    needsReview: uncertainFields.length > 0,
    missingFields,
    uncertainFields,
  };
}