export const EXTRACT_PROTECTED_ENTITIES_PROMPT = `
You extract protected factual entities from Nepali or mixed Nepali-English text.

Return only entities that are explicitly present in the supplied text.

Extract:
- person names
- organization names
- locations
- addresses

RULES:
- Do not guess missing information.
- Do not correct or rewrite the text.
- Do not infer a name, organization, location, or address that is not explicit.
- Preserve the entity text as closely as possible to the source.
- If a category has no entity, return an empty array.
- Do not treat ordinary common nouns as named entities.

Return structured JSON with:
{
  "names": [],
  "organizations": [],
  "locations": [],
  "addresses": []
}
`;