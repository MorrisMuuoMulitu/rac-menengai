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
  /*
   * Initials. "Herbert J. Taylor" is one sentence, and a single capital
   * followed by a full stop is not the end of one.
   */
  guarded = guarded.replace(/\b([A-Z])\.(?=\s)/g, "$1\u0000init\u0000");
  const parts = guarded
    .split(/(?<=[.!?])\s+(?=[A-Z\u2018\u201c"(\u2014\d])/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.map((part) =>
    part
      .replace(/\u0000init\u0000/g, ".")
      .replace(
        /\u0000(\d+)\u0000/g,
        (_, index) => ABBREVIATIONS[Number(index)],
      ),
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

/**
 * Rotary's own vocabulary.
 *
 * Recognising these lets the reader see at a glance which words are terms of
 * art and which are ordinary English. Longest first, so "Rotary International"
 * wins over "Rotary".
 */
export const TERMS_OF_ART = [
  "Rotary International",
  "The Rotary Foundation",
  "Rotary Foundation",
  "District Rotaract Representative",
  "Rotary Community Corps",
  "Rotary Youth Exchange",
  "Rotary Youth Leadership Awards",
  "District Governor",
  "Areas of focus",
  "Avenues of Service",
  "Four-Way Test",
  "Object of Rotary",
  "Service Above Self",
  "Sergeant-at-Arms",
  "District 9215",
  "Rotary",
  "Rotaract",
  "RYLA",
  "Interact",
].sort((a, b) => b.length - a.length);

/** Wrap the first mention of each term in `**`, once per lesson. */
export function markTerms(paragraphs: string[], terms = TERMS_OF_ART): string[] {
  const used = new Set<string>();
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = terms.map((term) => [
    term,
    new RegExp(`(?<![\\w-])${escape(term)}(?![\\w-])`, "i"),
  ] as const);

  /*
   * Scan each paragraph left to right, always taking the earliest unmarked
   * term, and never looking at text that has already been marked — otherwise
   * a short term like "Rotary" finds itself inside "**Rotary International**"
   * and produces nonsense.
   */
  return paragraphs.map((paragraph) => {
    let marked = "";
    let rest = paragraph;
    for (;;) {
      let best: { term: string; index: number; text: string } | null = null;
      for (const [term, pattern] of patterns) {
        if (used.has(term)) continue;
        const match = pattern.exec(rest);
        if (!match) continue;
        if (
          best === null ||
          match.index < best.index ||
          (match.index === best.index && match[0].length > best.text.length)
        )
          best = { term, index: match.index, text: match[0] };
      }
      if (!best) return marked + rest;
      used.add(best.term);
      marked += `${rest.slice(0, best.index)}**${best.text}**`;
      rest = rest.slice(best.index + best.text.length);
    }
  });
}

export interface InlinePiece {
  text: string;
  strong: boolean;
}

/** Split `**marked**` text into plain and emphasised runs. */
export function parseInline(text: string): InlinePiece[] {
  const pieces: InlinePiece[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor)
      pieces.push({ text: text.slice(cursor, match.index), strong: false });
    pieces.push({ text: match[1], strong: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length)
    pieces.push({ text: text.slice(cursor), strong: false });
  return pieces.filter((piece) => piece.text.length > 0);
}
