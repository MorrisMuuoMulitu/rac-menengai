import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
/*
 * Links are checked against the deployment's own routing table, not against a
 * one-file-per-route assumption. A route like `/membership/academy/:step` is
 * served from the academy's index.html, and that is exactly what vercel.json
 * says.
 */
const routing = JSON.parse(readFileSync("vercel.json", "utf8")).routes ?? [];
const rewrites = routing
  .filter((route) => route.src && route.dest?.endsWith(".html"))
  .map((route) => ({ pattern: new RegExp(route.src), dest: route.dest }));
function servedByRewrite(target) {
  for (const { pattern, dest } of rewrites) {
    if (!pattern.test(target)) continue;
    return existsSync(resolve("dist", dest.replace(/^\//, "")));
  }
  return false;
}
const paths = [
  ...sitemap.matchAll(/<loc>https:\/\/rotaractmenengai\.org([^<]*)<\/loc>/g),
].map((m) => m[1] || "/");
assert.ok(paths.length > 0, "Sitemap must contain public club-domain routes");
for (const privatePath of [
  "/membership/learners",
  "/membership/queue",
  "/membership/sign-in",
  "/membership/register",
  "/membership/orientation",
]) {
  assert.ok(
    !paths.includes(privatePath),
    `${privatePath}: private pages excluded from sitemap`,
  );
  const html = readFileSync(`dist${privatePath}/index.html`, "utf8");
  assert.match(
    html,
    /<meta name="robots" content="noindex">/,
    `${privatePath}: noindex in initial HTML`,
  );
}
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
    html.includes(`href="https://rotaractmenengai.org${path}"`),
    `${path}: canonical`,
  );
  assert.ok(html.includes("<main"), `${path}: initial HTML contains content`);
  const event = eventRecords.find(
    (record) => path === `/events/${record.slug}`,
  );
  if (event?.images?.length) {
    assert.ok(
      html.includes(
        `content="https://rotaractmenengai.org${event.images[0].src}"`,
      ),
      `${path}: story-specific share image`,
    );
    assert.ok(
      html.includes('"@type":"Article"'),
      `${path}: story structured data`,
    );
    assert.ok(
      html.includes('"position":3'),
      `${path}: event breadcrumb hierarchy`,
    );
    for (const photo of event.images)
      assert.ok(
        sitemap.includes(
          `<image:loc>https://rotaractmenengai.org${photo.src}</image:loc>`,
        ),
        `${path}: gallery photo in image sitemap`,
      );
  }
  assert.ok(!html.includes("CONFIRM_"), `${path}: no internal placeholders`);
  for (const draft of drafts)
    assert.ok(!html.includes(`/news/${draft.slug}`), `${path}: draft excluded`);
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    links++;
    const target = m[1].split("?")[0].replace(/\/$/, "") || "/";
    assert.ok(
      target === "/" ||
        paths.includes(target) ||
        existsSync(resolve("dist", target.slice(1))) ||
        servedByRewrite(target),
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
  readFileSync("dist/index.html", "utf8").includes('name="msvalidate.01"'),
  "Bing ownership meta tag",
);
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

// The access gate must exclude lesson prose and assessment answers from public HTML and JS.
const privateSignatures = [
  "A sponsor offers supplies but wants an exaggerated success claim",
  "What should happen before promising a Rotary Foundation grant?",
  "Write a delegation message with a task",
];
for (const path of paths) {
  const html = readFileSync(
    path === "/" ? "dist/index.html" : `dist${path}/index.html`,
    "utf8",
  );
  for (const signature of privateSignatures)
    assert.ok(
      !html.includes(signature),
      `${path}: private course content excluded`,
    );
}
for (const file of readdirSync("dist/assets").filter((name) =>
  name.endsWith(".js"),
)) {
  const bundle = readFileSync(`dist/assets/${file}`, "utf8");
  for (const signature of privateSignatures)
    assert.ok(
      !bundle.includes(signature),
      `${file}: private course content excluded`,
    );
}
console.log(
  "Verified private course lessons and assessment are absent from public HTML and JavaScript.",
);
