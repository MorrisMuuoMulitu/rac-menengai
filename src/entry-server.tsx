import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PAGE_INTROS, PROJECTS } from "./data";
import { PUBLIC_EVENTS } from "./content";
export const routes = [
  "/",
  "/about",
  "/about/district-9215",
  "/rotary",
  "/projects",
  "/awards",
  "/leadership",
  "/events",
  "/membership",
  "/membership/orientation",
  "/contact",
  "/partnerships",
  "/privacy",
  ...PROJECTS.map((p) => `/projects/${p.slug}`),
  ...PUBLIC_EVENTS.map((e) => `/events/${e.slug}`),
];
const titles: Record<string, string> = {
  "/": "Community service in Nakuru",
  "/events": "Events & fellowship",
  "/membership/orientation": "New member orientation",
  "/about/district-9215": "Rotary District 9215",
  "/partnerships": "Partnerships",
  "/privacy": "Privacy",
  "/404": "Page not found",
};
export function render(path: string) {
  const project = PROJECTS.find((p) => path === `/projects/${p.slug}`);
  const event = PUBLIC_EVENTS.find((e) => path === `/events/${e.slug}`);
  const intro = PAGE_INTROS[path.slice(1)];
  const title = `${project?.title ?? event?.title ?? titles[path] ?? intro?.eyebrow ?? "Rotaract"} | Rotaract Club of Menengai`;
  const description =
    project?.summary ??
    event?.description ??
    intro?.description ??
    "Community service, professional development and fellowship with the Rotaract Club of Menengai in Nakuru, Kenya.";
  const canonical = `https://rac-menengai.vercel.app${path === "/" ? "/" : path}`;
  const breadcrumbs =
    path !== "/" && path !== "/404"
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://rac-menengai.vercel.app/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name:
                project?.title ??
                event?.title ??
                titles[path] ??
                intro?.eyebrow ??
                "Rotaract",
              item: canonical,
            },
          ],
        }
      : null;
  return {
    html: renderToString(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>,
    ),
    title,
    description,
    canonical,
    schema: [breadcrumbs].filter(Boolean),
  };
}
