import { readFile, writeFile, mkdir } from "node:fs/promises";
const read = async (path) => JSON.parse(await readFile(path, "utf8"));
const events = (await read("content/events/index.json")).filter(
  (e) => e.publicationStatus === "published" && e.approval,
);
const accounts = (await read("content/social/accounts.json")).filter(
  (a) => a.public && a.url,
);
await mkdir("src/.generated", { recursive: true });
await writeFile(
  "src/.generated/public-content.json",
  JSON.stringify({ events, accounts }, null, 2) + "\n",
);
console.log(
  `Prepared ${events.length} approved event records. Research drafts are not included in client imports.`,
);
