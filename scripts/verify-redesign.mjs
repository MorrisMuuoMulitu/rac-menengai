/** Browser QA for Menengai. npm run build first; serve dist with npm run preview.
 * PLAYWRIGHT_MODULE may point to an existing playwright-core installation.
 * BASE_URL defaults to http://127.0.0.1:8080. No external forms are submitted.
 */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const routes = [
  "/",
  ...readdirSync("dist", { recursive: true })
    .filter((path) => path.endsWith("/index.html"))
    .map((path) => "/" + path.replace(/\/index\.html$/, "")),
];
const base = process.env.BASE_URL || "http://127.0.0.1:8080";
const output = process.env.OUTPUT_DIR || "docs/audit/redesign";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const results = [];
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  for (const [label, title, href] of [
    [
      "Art & environment",
      "Pangani Special School",
      "/projects/pangani-special-school",
    ],
    ["Fellowship", "Book Club Review", "/projects/book-club"],
    ["Maternal health", "Mother packs, delivered", "/projects/mother-packs"],
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal(
      await page.locator("#impact-selection h3").textContent(),
      title,
    );
    assert.equal(
      await page.locator("#impact-selection a").getAttribute("href"),
      href,
    );
    assert.equal(
      await page
        .getByRole("button", { name: label, exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
  }
  await page
    .getByRole("button", { name: "Next photograph", exact: true })
    .click();
  assert.match(
    await page.locator(".photo-story-description").textContent(),
    /Mother packs at Kabatini/,
  );
  await page
    .getByRole("button", { name: "Show Art Day at Pangani", exact: true })
    .click();
  assert.match(
    await page.locator(".photo-story-description").textContent(),
    /Art Day at Pangani/,
  );
  await page
    .getByRole("button", { name: "Next club photographs", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector("#club-photo-rail").scrollLeft > 0,
  );
  await page.waitForFunction(
    () =>
      !document.querySelector('[aria-label="Previous club photographs"]')
        .disabled,
  );
  await page
    .getByRole("button", { name: "Previous club photographs", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector("#club-photo-rail").scrollLeft < 2,
  );
  results.push({
    check: "project chooser, photograph selector and rail",
    pass: true,
  });
  await page.setViewportSize({ width: 390, height: 780 });
  await page.goto(base);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  assert.equal(await page.locator("main").getAttribute("inert"), "");
  assert.equal(
    await page.evaluate(() =>
      document.querySelector("#mobile-menu").contains(document.activeElement),
    ),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(await page.locator("main").getAttribute("inert"), null);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page.waitForURL("**/projects");
  await page.getByRole("button", { name: "Health", exact: true }).click();
  assert.ok((await page.locator(".projects-grid > li").count()) > 0);
  results.push({
    check: "mobile menu, Escape/focus restoration, project filter",
    pass: true,
  });
  await page.goto(base + "/membership#first-visit");
  const visit = await page.locator("#first-visit").boundingBox();
  assert.ok(
    visit.y >= 70 && visit.y < 150,
    `First visit header offset ${visit.y}`,
  );
  results.push({
    check: "first-visit deep link clears sticky header",
    pass: true,
  });
  await page.close();
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    const p = await browser.newPage({
      viewport: { width, height: width < 760 ? 780 : 1000 },
      reducedMotion: "reduce",
    });
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base);
    await p.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return img.decode().catch(() => {});
        }),
      );
    });
    const layout = await p.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.images]
        .filter((i) => !i.naturalWidth)
        .map((i) => i.getAttribute("src")),
    }));
    assert.equal(layout.overflow, false, `Home overflow at ${width}`);
    assert.deepEqual(layout.brokenImages, []);
    results.push({ ...layout, motion: "reduce", pass: true });
    if ([360, 390, 1440].includes(width)) {
      await p.screenshot({
        path: `${output}/home-${width}.png`,
        fullPage: true,
      });
      for (const [index, y] of [0, 300, 650].entries()) {
        await p.evaluate((y) => scrollTo(0, y), y);
        await p.screenshot({ path: `${output}/hero-${width}-${index}.png` });
      }
    }
    await p.close();
  }
  for (const width of [390, 1440]) {
    const p = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    p.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      await p.goto(base + route);
      await p.evaluate(() => document.fonts.ready);
      const layout = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll("h1").length,
      }));
      assert.equal(layout.overflow, false, `${route} overflow at ${width}`);
      assert.equal(layout.h1, 1, `${route} H1 count`);
      results.push({ route, width, ...layout, pass: true });
      if (
        [
          "/projects",
          "/membership",
          "/leadership",
          "/events",
          "/contact",
          "/learn",
        ].includes(route)
      )
        await p.screenshot({
          path: `${output}/${route.slice(1)}-${width}.png`,
        });
    }
    await p.close();
  }
  const motion = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  await motion.goto(base);
  await motion.evaluate(() => document.fonts.ready);
  const before = await motion
    .locator(".hero-side-story")
    .evaluate((el) => getComputedStyle(el).transform);
  await motion.evaluate(() => scrollTo(0, 300));
  await motion.waitForTimeout(150);
  const after = await motion
    .locator(".hero-side-story")
    .evaluate((el) => getComputedStyle(el).transform);
  assert.notEqual(before, after);
  await motion.screenshot({ path: `${output}/motion-desktop-mid.png` });
  assert.equal(
    await motion
      .getByRole("button", { name: "Pause photo stories", exact: true })
      .count(),
    1,
  );
  await motion.mouse.move(0, 0);
  const initialPhoto = await motion
    .locator(".photo-story-image")
    .getAttribute("src");
  await motion.waitForFunction(
    (src) =>
      document.querySelector(".photo-story-image").getAttribute("src") !== src,
    initialPhoto,
    { timeout: 10000 },
  );
  const afterAutoplay = await motion
    .locator(".photo-story-image")
    .getAttribute("src");
  await motion.locator(".photo-stories").hover();
  await motion.waitForTimeout(7500);
  assert.equal(
    await motion.locator(".photo-story-image").getAttribute("src"),
    afterAutoplay,
  );
  await motion
    .getByRole("button", { name: "Pause photo stories", exact: true })
    .click();
  assert.equal(
    await motion
      .getByRole("button", { name: "Play photo stories", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await motion.mouse.move(0, 0);
  await motion.keyboard.press("Tab");
  await motion.waitForTimeout(7500);
  assert.equal(
    await motion.locator(".photo-story-image").getAttribute("src"),
    afterAutoplay,
  );
  results.push({
    check: "scroll depth, automatic playback, hover pause and explicit pause",
    pass: true,
  });
  await motion.close();
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/verification.json`,
    JSON.stringify({ base, errors, results }, null, 2),
  );
  console.log(
    `${results.length} production browser checks passed. No page errors, broken homepage images or horizontal overflow.`,
  );
} finally {
  await browser.close();
}
