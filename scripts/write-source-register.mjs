/**
 * Generate the source register from the code that holds it.
 *
 * The brief asks for a register of sources and a list of what still needs the
 * club to confirm. Keeping it next to the content means it cannot drift: the
 * document is written from `shared/rotaract-academy/sources.ts`, which is the
 * same list the lessons are built from.
 *
 * Run through vite so TypeScript resolves: `npm run academy:sources`.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { SOURCES, CLUB_CONFIRMATIONS } from "../.sources/sources.js";

const lines = [];
lines.push("# Academy source register and club confirmation list");
lines.push("");
lines.push(
  "Generated from `shared/rotaract-academy/sources.ts` by `npm run academy:sources`.",
);
lines.push("Edit that file, not this one.");
lines.push("");
lines.push("## Sources relied on");
lines.push("");
lines.push("Suggested review owners below have not provided club sign-off. Checked dates refer to the source review, not a club approval.");
lines.push("");
lines.push("| Source | Version | Section used | Scope | Source checked | Suggested review owner |");
lines.push("|---|---|---|---|---|---|");
for (const record of SOURCES)
  lines.push(
    `| [${record.title}](${record.url}) | ${record.version} | ${record.section} | ${record.scope} | ${record.reviewed} | ${record.reviewer} |`,
  );
lines.push("");
lines.push("## Awaiting club confirmation — not published in the course");
lines.push("");
lines.push(
  "Items below need club review. Some current published club facts and the assessment pass mark are included for annual confirmation; unconfirmed ritual wording and formal local procedures remain unpublished.",
);
lines.push("");
lines.push("| Question | Why it is not published | Owner | Appears in |");
lines.push("|---|---|---|---|");
for (const item of CLUB_CONFIRMATIONS)
  lines.push(
    `| ${item.question} | ${item.why} | ${item.owner} | ${item.landsIn} |`,
  );
lines.push("");

mkdirSync("docs/academy", { recursive: true });
writeFileSync("docs/academy/source-register.md", `${lines.join("\n")}\n`);
console.log(
  `Wrote docs/academy/source-register.md — ${SOURCES.length} sources, ${CLUB_CONFIRMATIONS.length} awaiting confirmation.`,
);
