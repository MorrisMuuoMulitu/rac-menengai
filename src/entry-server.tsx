import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PAGE_INTROS, PROJECTS, contactConfig } from "./data";
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
  "/membership/sso-callback",
  "/membership/queue",
  "/membership/learners",
  "/membership/enquiries",
  "/contact",
  "/partnerships",
  "/privacy",
  "/verify",
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
  "/membership/sso-callback": "Completing sign-in",
  "/membership/queue": "Membership applications",
  "/membership/learners": "Learner progress",
  "/membership/enquiries": "Website enquiries",
  "/about/district-9215": "Rotary District 9215",
  "/partnerships": "Partnerships",
  "/privacy": "Privacy",
  "/verify": "Verify a certificate",
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
    "Learn about Rotaract and Menengai through twenty interactive lessons across seven chapters, practical checks, a twenty-question assessment and your own service project proposal.",
  "/partnerships":
    "Collaborate with the Rotaract Club of Menengai on community service in Nakuru, and meet the health providers, clubs and organisations that partner with the club.",
  "/privacy":
    "How enquiry details and local orientation progress are handled on the Menengai club website.",
  "/verify":
    "Verify a completion certificate issued by the Rotaract Club of Menengai.",
};
export function render(path: string) {
  const project = PROJECTS.find((p) => path === `/projects/${p.slug}`);
  const event = PUBLIC_EVENTS.find((e) => path === `/events/${e.slug}`);
  const intro = PAGE_INTROS[path.slice(1)];
  const title =
    event?.slug === "medical-camp-2026"
      ? "Nakuru Free Medical Outreach: 320 people served | Rotaract Club of Menengai"
      : `${project?.title ?? event?.title ?? titles[path] ?? intro?.eyebrow ?? "Rotaract"} | Rotaract Club of Menengai`;
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
  /*
   * Schema.org has no EventCompleted value. A completed event is represented
   * by a scheduled event whose endDate is in the past, rather than inventing
   * an unsupported status.
   */
  const medicalEvent =
    event?.slug === "medical-camp-2026"
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          "@id": `${canonical}#event`,
          name: event.title,
          description: event.description,
          url: canonical,
          startDate: `${event.date}T08:00:00+03:00`,
          endDate: `${event.date}T17:00:00+03:00`,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          isAccessibleForFree: true,
          location: {
            "@type": "Place",
            name: event.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nakuru",
              addressCountry: "KE",
            },
          },
          organizer: { "@id": "https://rotaractmenengai.org/#club" },
          image: {
            "@type": "ImageObject",
            url: shareImage.url,
            caption: shareImage.alt,
          },
        }
      : null;
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
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://rotaractmenengai.org/#club",
        name: "Rotaract Club of Menengai",
        url: "https://rotaractmenengai.org",
        email: contactConfig.email,
        telephone: contactConfig.phones,
      },
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
      medicalEvent,
    ].filter(Boolean),
  };
}
