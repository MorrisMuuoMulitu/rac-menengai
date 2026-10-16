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
  "/learn",
  "/projects",
  "/awards",
  "/leadership",
  "/events",
  "/membership",
  "/membership/orientation",
  "/membership/academy",
  "/membership/sign-in",
  "/membership/register",
  "/membership/queue",
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
  "/membership/academy": "Membership academy",
  "/membership/sign-in": "Sign in",
  "/membership/register": "Create your academy account",
  "/membership/queue": "Membership applications",
  "/about/district-9215": "Rotary District 9215",
  "/partnerships": "Partnerships",
  "/privacy": "Privacy",
  "/learn": "Learn about Rotaract",
  "/404": "Page not found",
};
const descriptions: Record<string, string> = {
  "/": "Meet the Rotaract Club of Menengai: community service, young leadership and Thursday fellowship in Nakuru, Kenya. Join us or partner on a project.",
  "/about/district-9215":
    "Meet Rotary District 9215 and discover how the Rotaract Club of Menengai connects with clubs across Kenya and South Sudan.",
  "/rotary":
    "Explore Rotary International, its seven areas of focus, the Four-Way Test and the Rotary family that includes the Rotaract Club of Menengai.",
  "/events":
    "Plan a visit to Menengai’s Thursday fellowship in Nakuru and explore the club’s community projects, event reports and photo galleries.",
  "/membership/orientation":
    "The Rotaract Club of Menengai’s passcode-protected member orientation course: Rotaract foundations, service, leadership and club participation.",
  "/membership/academy":
    "The Rotaract Club of Menengai’s membership course: six chapters and fourteen lessons on Rotaract, service, leadership and money, a situation to work through at the end of each chapter, a twenty-eight question assessment and a one-page project proposal you write yourself.",
  "/partnerships":
    "Collaborate with the Rotaract Club of Menengai on community service in Nakuru: share expertise, volunteer or support a project.",
  "/privacy":
    "How enquiry details and local orientation progress are handled on the Menengai club website.",
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
    descriptions[path] ??
    (path === "/learn"
      ? "A plain-language Rotaract glossary, a short history and real service stories from Menengai in Nakuru."
      : undefined) ??
    "Community service, professional development and fellowship with the Rotaract Club of Menengai in Nakuru, Kenya.";
  const canonical = `https://rotaractmenengai.org${path === "/" ? "/" : path}`;
  const photos = event?.images ?? [];
  const image =
    photos[0]?.src ?? event?.image ?? "/images/branding/social-card.png";
  const shareImage = {
    url: `https://rotaractmenengai.org${image}`,
    alt: photos[0]?.alt ?? "Rotaract Club of Menengai — Create Lasting Impact",
    width: photos[0]?.width ?? (event?.image ? undefined : 1200),
    height: photos[0]?.height ?? (event?.image ? undefined : 630),
  };
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
              item: "https://rotaractmenengai.org/",
            },
            {
              "@type": "ListItem",
              position: 2,
              ...(event || project
                ? {
                    name: event ? "Events & fellowship" : "Projects",
                    item: `https://rotaractmenengai.org/${event ? "events" : "projects"}`,
                  }
                : {
                    name: titles[path] ?? intro?.eyebrow ?? "Rotaract",
                    item: canonical,
                  }),
            },
            ...(event || project
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name:
                      project?.title ??
                      event?.title ??
                      titles[path] ??
                      intro?.eyebrow ??
                      "Rotaract",
                    item: canonical,
                  },
                ]
              : []),
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
    shareImage,
    photos,
    schema: [
      breadcrumbs,
      event
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${canonical}#story`,
            headline: event.title,
            description: event.description,
            mainEntityOfPage: canonical,
            inLanguage: "en-KE",
            author: { "@id": "https://rotaractmenengai.org/#club" },
            publisher: { "@id": "https://rotaractmenengai.org/#club" },
            ...(photos.length
              ? {
                  image: photos.map((photo) => ({
                    "@type": "ImageObject",
                    contentUrl: `https://rotaractmenengai.org${photo.src}`,
                    caption: photo.alt,
                  })),
                }
              : {}),
          }
        : null,
    ].filter(Boolean),
  };
}
