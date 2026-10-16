/**
 * Push the approved content into Sanity.
 *
 * Dry by default: it reports what it would write and exits. Pass `--apply` to
 * actually create or replace documents. Nothing is deleted — a document that
 * disappears from the seed stays in the dataset, so a person can remove it
 * deliberately in the Studio.
 *
 *   npm run sanity:check   # build the seed and report
 *   npm run sanity:push    # build the seed and write it
 */

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@sanity/client";

const apply = process.argv.includes("--apply");

const projectId = process.env.SANITY_API_PROJECT_ID;
const dataset = process.env.SANITY_API_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "Sanity is not configured. Set SANITY_API_PROJECT_ID and SANITY_API_DATASET.",
  );
  process.exit(1);
}

const built = process.env.SANITY_SEED_BUNDLE ?? ".sanity-seed/sanity-seed.js";
let buildSeed;
try {
  ({ buildSeed } = await import(pathToFileURL(resolve(built)).href));
} catch (cause) {
  console.error(
    `Could not read the built seed at ${built}. Run "npm run sanity:build" first.`,
  );
  console.error(String(cause));
  process.exit(1);
}
const seed = await buildSeed();

const counts = new Map();
for (const document of seed.documents)
  counts.set(document._type, (counts.get(document._type) ?? 0) + 1);

console.log(`Course: ${seed.course.title} (${seed.course.version})`);
for (const [type, count] of [...counts].sort())
  console.log(`  ${String(count).padStart(3)}  ${type}`);
console.log(`  ${String(seed.documents.length).padStart(3)}  total documents`);

const required = ["learner", "attempt", "application", "answerKey"];
for (const forbidden of required) {
  if (counts.has(forbidden)) {
    console.error(
      `Refusing to import: the seed contains a "${forbidden}" document. Learner data and answer keys never belong in this dataset.`,
    );
    process.exit(2);
  }
}

if (!apply) {
  console.log("\nDry run. Re-run with --apply to write these documents.");
  process.exit(0);
}

if (!token) {
  console.error(
    "A write token is required to import. Set SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});

let transaction = client.transaction();
let queued = 0;
for (const document of seed.documents) {
  transaction = transaction.createOrReplace(document);
  queued += 1;
  if (queued === 50) {
    await transaction.commit();
    transaction = client.transaction();
    queued = 0;
  }
}
if (queued) await transaction.commit();

console.log(
  `\nWrote ${seed.documents.length} documents to ${projectId}/${dataset}.`,
);
