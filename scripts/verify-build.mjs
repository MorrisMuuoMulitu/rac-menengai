import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const paths = [
  ...sitemap.matchAll(
    /<loc>https:\/\/rac-menengai\.vercel\.app([^<]*)<\/loc>/g,
  ),
].map((m) => m[1] || "/");
// Draft stories must not reach the bundle. A draft slug that is also a
// *published* record in another collection (e.g. an event) legitimately appears
// in the bundle, so it is excluded rather than reported as a leak.
const eventRecords = JSON.parse(readFileSync("content/events/index.json"));
const publishedSlugs = new Set(
  eventRecords
    .filter((e) => e.publicationStatus === "published")
    .map((e) => e.slug),
);
const drafts = eventRecords.filter(
  (e) => e.publicationStatus !== "published" && !publishedSlugs.has(e.slug),
);
let links = 0,
  images = 0;
for (const path of paths) {
  const file = path === "/" ? "dist/index.html" : `dist${path}/index.html`;
  const html = readFileSync(file, "utf8");
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path}: one h1`);
  assert.ok(
    html.includes(`href="https://rac-menengai.vercel.app${path}"`),
    `${path}: canonical`,
  );
  assert.ok(html.includes("<main"), `${path}: initial HTML contains content`);
  assert.ok(!html.includes("CONFIRM_"), `${path}: no internal placeholders`);
  for (const draft of drafts)
    assert.ok(!html.includes(`/news/${draft.slug}`), `${path}: draft excluded`);
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    links++;
    const target = m[1].split("?")[0].replace(/\/$/, "") || "/";
    assert.ok(
      target === "/" ||
        paths.includes(target) ||
        existsSync(resolve("dist", target.slice(1))),
      `${path}: missing internal destination ${target}`,
    );
  }
  for (const m of html.matchAll(/<img[^>]*src="([^"]*)"/g)) {
    images++;
    assert.ok(
      m[1] && existsSync(resolve("dist", m[1].slice(1))),
      `${path}: missing media ${m[1]}`,
    );
  }
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    JSON.parse(m[1]);
  assert.ok(
    html.match(/<meta\s+name="description"\s+content="[^"]+"/),
    `${path}: description`,
  );
}
const config = JSON.parse(readFileSync("vercel.json"));
assert.ok(
  config.routes.some((r) => r.status === 404),
  "404 HTTP routing",
);
assert.ok(existsSync("dist/404.html"), "404 document");
console.log(
  `Verified ${paths.length} prerendered pages, ${links} internal links and ${images} image references. JSON-LD parses; drafts stay private; 404 routing present.`,
);

for (const file of readdirSync("dist/assets").filter((name) =>
  name.endsWith(".js"),
)) {
  const bundle = readFileSync(`dist/assets/${file}`, "utf8");
  for (const draft of drafts)
    assert.ok(
      !bundle.includes(draft.slug),
      `Research draft leaked into ${file}: ${draft.slug}`,
    );
}
