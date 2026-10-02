import { compareProtectedFacts } from "@/lib/reliability/compareFacts";
import { compareProtectedEntities } from "@/lib/reliability/compareEntities";
import { extractProtectedEntities } from "@/lib/ai/extractProtectedEntities";

export async function validateGeneratedDraft(
  sourceDescription,
  draft,
) {
  const deterministicComparison = compareProtectedFacts(
    sourceDescription,
    draft,
  );

  const [sourceEntities, draftEntities] = await Promise.all([
    extractProtectedEntities(sourceDescription),
    extractProtectedEntities(draft),
  ]);

  const entityWarnings = compareProtectedEntities(
    sourceEntities,
    draftEntities,
  );

  const warnings = [
    ...deterministicComparison.warnings,
    ...entityWarnings,
  ];

  return {
    isSafe: warnings.length === 0,
    warnings,
  };
}