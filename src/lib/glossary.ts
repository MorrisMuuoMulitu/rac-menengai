export interface GlossaryEntry {
  term: string;
  abbreviation: string;
  definition: string;
  category: string;
}
const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
export function filterGlossary<T extends GlossaryEntry>(
  entries: readonly T[],
  query: string,
  category: string,
): T[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    const text = normalize(
      `${entry.term} ${entry.abbreviation} ${entry.definition}`,
    );
    return (
      (category === "All" || entry.category === category) &&
      words.every((word) => text.includes(word))
    );
  });
}
