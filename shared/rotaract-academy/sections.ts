import type { OrientationBlock } from "./types.js";

/**
 * Group lesson blocks into the reading sections the learner moves through.
 * A paragraph starts a section; following lists and notes stay with it.
 */
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
