/**
 * Check that the serverless functions will actually load.
 *
 * Vercel compiles each `.ts` file to `.js` and lets Node resolve the imports.
 * Node's ESM resolver needs the extension, so `import "./data"` works in the
 * bundler and fails at runtime with ERR_MODULE_NOT_FOUND. That failure only
 * shows up in production, so it is checked here instead.
 *
 * Every relative import that survives into the emitted JavaScript — that is,
 * everything except `import type` — must name a file Node can resolve.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";

const roots = ["api/contact.ts", "api/orientation.ts", "api/academy.ts"];
const RUNTIME_IMPORT =
  /^\s*(?:import|export)\s+(?!type\b)[^;]*?from\s+["']([^"']+)["']/gm;
const SIDE_EFFECT_IMPORT = /^\s*import\s+["']([^"']+)["']/gm;

const problems = [];
const visited = new Set();

/** `.js` in source means the `.ts` sitting next to it, once Vercel compiles. */
function locate(target) {
  if (existsSync(target)) return target;
  for (const candidate of [target.replace(/\.js$/, ".ts"), `${target}.ts`])
    if (existsSync(candidate)) return candidate;
  return null;
}

function check(file, importer) {
  const listed = resolve(file);
  const found = locate(listed);
  if (!found) {
    problems.push(`${importer} imports ${file}, which does not exist`);
    return;
  }
  const full = found;
  if (visited.has(full)) return;
  visited.add(full);
  const source = readFileSync(full, "utf8");
  for (const pattern of [RUNTIME_IMPORT, SIDE_EFFECT_IMPORT]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const specifier = match[1];
      if (!specifier.startsWith(".")) continue;
      const target = resolve(dirname(full), specifier);
      if (!/\.(m?js|json)$/.test(specifier)) {
        problems.push(
          `${relative(process.cwd(), full)} imports "${specifier}" without a file extension — Node will not resolve it in production`,
        );
        continue;
      }
      check(target, relative(process.cwd(), full));
    }
  }
}

for (const root of roots) check(root, "api");

if (problems.length) {
  console.error("Serverless function imports will not resolve in production:");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `Checked ${visited.size} modules reachable from the API functions; every relative import resolves.`,
);
