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
