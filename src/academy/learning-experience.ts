import type { OrientationBlock } from "../../shared/rotaract-academy/types";

/** Include the answer choices: an edited option must invalidate an index-based draft. */
export function assessmentDraftIdentity(
  version: string,
  learner: string,
  questions: { id: string; options: string[] }[],
): string {
  return JSON.stringify([
    version,
    learner,
    questions.map(({ id, options }) => [id, options]),
  ]);
}

export function lessonSections(
  blocks: OrientationBlock[],
): OrientationBlock[][] {
  const sections: OrientationBlock[][] = [];
  for (const block of blocks) {
    if (!sections.length || block.kind === "p") sections.push([]);
    sections[sections.length - 1].push(block);
  }
  return sections;
}
