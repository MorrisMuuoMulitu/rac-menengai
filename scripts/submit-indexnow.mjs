import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// This is a public ownership file, not an account password or private API token.
const host = "rotaractmenengai.org";
const key = (await readFile("public/indexnow-key.txt", "utf8")).trim();
assert.match(key, /^[a-f0-9]{32}$/);
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.ok(urlList.length > 0 && urlList.length <= 10000);
for (const url of urlList) {
  const parsed = new URL(url);
  assert.equal(parsed.host, host);
  assert.equal(parsed.protocol, "https:");
}
const keyLocation = `https://${host}/indexnow-key.txt`;
if (!process.argv.includes("--submit")) {
  console.log(
    `Dry run: ${urlList.length} public pages ready for IndexNow. Pass --submit after deploying the ownership file.`,
  );
} else {
  const check = await fetch(keyLocation, {
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(
    check.status,
    200,
    "Ownership file must be deployed before submission",
  );
  assert.equal(
    (await check.text()).trim(),
    key,
    "Live ownership file must match",
  );
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(30000),
  });
  assert.ok(
    [200, 202].includes(response.status),
    `IndexNow returned ${response.status}: ${await response.text()}`,
  );
  console.log(
    `IndexNow received ${urlList.length} URLs: HTTP ${response.status}${response.status === 202 ? " (ownership validation pending)" : ""}. Receipt does not guarantee indexing.`,
  );
}
