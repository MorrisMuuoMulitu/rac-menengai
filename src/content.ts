import publicContent from "./.generated/public-content.json";
const { stories, events, accounts } = publicContent;
export const PUBLIC_STORIES = stories
  .filter((s) => s.status === "published" && s.approval && s.published)
  .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
export type Story = (typeof PUBLIC_STORIES)[number];
export const PUBLIC_EVENTS = events.filter(
  (e) => e.publicationStatus === "published" && e.approval,
);
export const PUBLIC_ACCOUNTS = accounts.filter((a) => a.public && a.url);
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(date.length === 10 ? `${date}T12:00:00+03:00` : date));
