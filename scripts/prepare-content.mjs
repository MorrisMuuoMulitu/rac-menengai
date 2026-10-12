import { readFile, writeFile, mkdir } from "node:fs/promises";
const read = async (path) => JSON.parse(await readFile(path, "utf8"));
const stories = (await read("content/stories/index.json")).filter(
  (s) => s.status === "published" && s.approval && s.published,
);
const events = (await read("content/events/index.json")).filter(
  (e) => e.publicationStatus === "published" && e.approval,
);
const accounts = (await read("content/social/accounts.json")).filter(
  (a) => a.public && a.url,
);
for (const story of stories) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(story.published) ||
    !story.sourceUrl?.startsWith("https://")
  )
    throw new Error(`Invalid publication record: ${story.slug}`);
}
await mkdir("src/.generated", { recursive: true });
await writeFile(
  "src/.generated/public-content.json",
  JSON.stringify({ stories, events, accounts }, null, 2) + "\n",
);
console.log(
  `Prepared ${stories.length} approved stories and ${events.length} event records. Research drafts are not included in client imports.`,
);
