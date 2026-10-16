/** Exact public origins owned by this club; never trust arbitrary request hosts. */
export const CLUB_ORIGIN = "https://rotaractmenengai.org";
export const LEGACY_ORIGIN = "https://rac-menengai.vercel.app";
export function trustedSiteOrigins(configured = CLUB_ORIGIN) {
  const origins = new Set([configured]);
  if (configured === CLUB_ORIGIN || configured === LEGACY_ORIGIN) {
    origins.add(CLUB_ORIGIN);
    origins.add(LEGACY_ORIGIN);
  }
  return origins;
}
