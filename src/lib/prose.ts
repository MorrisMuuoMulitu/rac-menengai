/**
 * Break a dense block of lesson text into short paragraphs.
 *
 * The lesson copy is written as full paragraphs — three to six sentences each
 * — which is fine in a report and heavy on a screen. Splitting at sentence
 * boundaries keeps the wording exactly as written while making each idea its
 * own block. Nothing is reworded, reordered or dropped: the sentences are
 * joined back together in the same order, just with air between them.
 */

/** Dots that are not the end of a sentence. */
const ABBREVIATIONS = [
  "e.g.",
  "i.e.",
  "etc.",
  "vs.",
  "No.",
  "Dr.",
  "Mr.",
  "Mrs.",
  "Ms.",
  "St.",
];

export function splitSentences(text: string): string[] {
  let guarded = text;
  ABBREVIATIONS.forEach((abbreviation, index) => {
    guarded = guarded.split(abbreviation).join(`\u0000${index}\u0000`);
  });
  const parts = guarded
    .split(/(?<=[.!?])\s+(?=[A-Z\u2018\u201c"(\u2014\d])/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.map((part) =>
    part.replace(/\u0000(\d+)\u0000/g, (_, index) => ABBREVIATIONS[Number(index)]),
  );
}

export function toParagraphs(text: string, perParagraph = 2): string[] {
  const sentences = splitSentences(text.trim());
  if (sentences.length <= perParagraph) return sentences.length ? [text.trim()] : [];
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += perParagraph)
    paragraphs.push(sentences.slice(index, index + perParagraph).join(" "));
  return paragraphs;
}
