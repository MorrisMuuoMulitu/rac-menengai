import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { render, routes } from "../.prerender/entry-server.js";
const template = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const sitemapEntries = [];
/* Pages we publish for people, not for search engines. */
const NOINDEX = new Set(["/404", "/membership/queue"]);
for (const route of [...routes, "/404"]) {
  const result = render(route);
  let html = template
    .replace('<div id="root"></div>', `<div id="root">${result.html}</div>`)
    .replace(/<title>.*?<\/title>/s, `<title>${escape(result.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/s,
      `$1${escape(result.description)}$2`,
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${escape(result.canonical)}$2`,
    );
  for (const [property, value] of [
    ["og:title", result.title],
    ["og:description", result.description],
    ["og:url", result.canonical],
    ["og:image", result.shareImage.url],
    ["og:image:alt", result.shareImage.alt],
  ])
    html = html.replace(
      new RegExp(`(<meta\\s+property="${property}"\\s+content=")[^"]*(")`),
      `$1${escape(value)}$2`,
    );
  html = html.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${escape(result.shareImage.url)}$2`,
  );
  for (const dimension of ["width", "height"]) {
    const value = result.shareImage[dimension];
    html = html.replace(
      new RegExp(
        `<meta\\s+property="og:image:${dimension}"\\s+content="[^"]*"\\s*\\/?>`,
      ),
      value ? `<meta property="og:image:${dimension}" content="${value}">` : "",
    );
  }
  html = html.replace(
    "</head>",
    `${result.schema.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`).join("")}<meta name="twitter:title" content="${escape(result.title)}"><meta name="twitter:description" content="${escape(result.description)}">${NOINDEX.has(route) ? '<meta name="robots" content="noindex">' : ""}</head>`,
  );
  const path =
    route === "/"
      ? "dist/index.html"
      : route === "/404"
        ? "dist/404.html"
        : `dist${route}/index.html`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
  if (!NOINDEX.has(route))
    sitemapEntries.push(
      `<url><loc>${escape(result.canonical)}</loc>${result.photos.map((photo) => `<image:image><image:loc>https://rotaractmenengai.org${escape(photo.src)}</image:loc></image:image>`).join("")}</url>`,
    );
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${sitemapEntries.join("")}</urlset>\n`,
);
await rm(".prerender", { recursive: true, force: true });
console.log(
  `Prerendered ${routes.length} public routes and a 404 page. Draft content excluded.`,
);
