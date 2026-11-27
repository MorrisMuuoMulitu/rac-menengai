import type { PublicCourse } from "../../shared/rotaract-academy/assessment";
import type { OrientationBlock } from "../../shared/rotaract-academy/types";
import type { Flashcard } from "../../shared/rotaract-academy/flashcards";
import { lessonSections } from "../../shared/rotaract-academy/sections";
import { LESSON_DESIGN } from "./lesson-design";

export interface AcademySectionResult {
  lessonId: string;
  lessonTitle: string;
  chapterTitle: string;
  sectionIndex: number;
  sectionTitle: string;
  snippet: string;
  href: string;
  score: number;
}

export interface GlossarySearchResult extends Flashcard {
  chapterTitle: string;
  score: number;
}

function textFromBlocks(blocks: OrientationBlock[]): string {
  return blocks
    .flatMap((block) => [block.text ?? "", ...(block.items ?? [])])
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text: string, query: string): string {
  if (!text) return "";
  const lower = text.toLowerCase();
  const at = lower.indexOf(query.toLowerCase());
  const start = Math.max(0, at >= 0 ? at - 70 : 0);
  const end = Math.min(text.length, start + 220);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${
    end < text.length ? "…" : ""
  }`;
}

/**
 * Search every reading section by lesson title, section title and prose.
 * Results link directly to the matching section; the lesson page restores that
 * position and records it as the learner's saved reading place.
 */
export function searchAcademySections(
  course: PublicCourse,
  rawQuery: string,
  limit = 30,
): AcademySectionResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  const results: AcademySectionResult[] = [];

  for (const module of course.modules) {
    const chapter = course.chapters.find((item) =>
      item.lessons.some((lesson) => lesson.id === module.id),
    );
    const sections = lessonSections(module.blocks);
    sections.forEach((section, sectionIndex) => {
      const sectionTitle =
        LESSON_DESIGN[module.id]?.sections[sectionIndex] ??
        `Section ${sectionIndex + 1}`;
      const body = textFromBlocks(section);
      const sectionText =
        `${sectionTitle} ${chapter?.title ?? ""} ${body}`.toLowerCase();
      const lessonText =
        `${module.title} ${module.summary} ${chapter?.title ?? ""}`.toLowerCase();
      const sectionMatch = terms.every((term) => sectionText.includes(term));
      const lessonMatch = terms.every((term) => lessonText.includes(term));
      if (!sectionMatch && (!lessonMatch || sectionIndex !== 0)) return;

      const score =
        terms.reduce((total, term) => {
          if (module.title.toLowerCase().includes(term)) return total + 80;
          if (sectionTitle.toLowerCase().includes(term)) return total + 60;
          if (module.summary.toLowerCase().includes(term)) return total + 35;
          if (body.toLowerCase().includes(term)) return total + 15;
          return total;
        }, 0) +
        (sectionText.includes(query) || lessonText.includes(query) ? 30 : 0);

      results.push({
        lessonId: module.id,
        lessonTitle: module.title,
        chapterTitle: chapter?.title ?? "",
        sectionIndex,
        sectionTitle,
        snippet: excerpt(
          body.toLowerCase().includes(query) ? body : module.summary,
          query,
        ),
        href: `/membership/academy/${module.id}?section=${sectionIndex}`,
        score,
      });
    });
  }

  return results
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.lessonTitle.localeCompare(b.lessonTitle) ||
        a.sectionIndex - b.sectionIndex,
    )
    .slice(0, limit);
}

export function searchGlossary(
  cards: readonly Flashcard[],
  chapterNames: ReadonlyMap<string, string>,
  rawQuery: string,
): GlossarySearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  return cards
    .map((card) => {
      const haystack =
        `${card.term} ${card.definition} ${chapterNames.get(card.chapterId) ?? ""}`.toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return null;
      const score =
        (card.term.toLowerCase().includes(query) ? 100 : 0) +
        (card.definition.toLowerCase().includes(query) ? 45 : 0) +
        (haystack.includes(query) ? 20 : 0);
      return {
        ...card,
        chapterTitle: chapterNames.get(card.chapterId) ?? card.chapterId,
        score,
      };
    })
    .filter((card): card is GlossarySearchResult => card !== null)
    .sort(
      (a, b) => b.score - a.score || a.term.localeCompare(b.term, undefined),
    );
}
