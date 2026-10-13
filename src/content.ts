import publicContent from "./.generated/public-content.json";
const { events, accounts } = publicContent;

/**
 * The shapes are declared here rather than inferred from the generated JSON.
 * Inference collapses to `never` when a collection is empty (for example when
 * no story is yet published for the current Rotary year), which then breaks
 * every consumer.
 */
export interface StoryPhoto {
  src: string;
  thumb: string;
  alt: string;
  srcSet?: string;
  width?: number;
  height?: number;
}
export interface PublicEvent {
  slug: string;
  title: string;
  date: string;
  start: string | null;
  end: string | null;
  location: string;
  description: string;
  organizer: string;
  partners: string[];
  projectSlug: string | null;
  sourceUrl: string | null;
  status: string;
  publicationStatus: string;
  approval: string | null;
  image: string | null;
  images: StoryPhoto[];
  registrationUrl: string | null;
  story?: string[];
  outcome?: string;
}
export interface PublicAccount {
  platform: string;
  url: string | null;
  public: boolean;
  handle?: string;
}

export const PUBLIC_EVENTS: PublicEvent[] = (events as PublicEvent[]).filter(
  (e) => e.publicationStatus === "published" && e.approval,
);

export const PUBLIC_ACCOUNTS: PublicAccount[] = accounts as PublicAccount[];

export const dateLabel = (date: string) =>
  !date ? "Date not supplied" :
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(date.length === 10 ? `${date}T12:00:00+03:00` : date));
