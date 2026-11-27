export function rotaryYear(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const startYear = month >= 7 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

/**
 * Rotary years run July to June. Sequence allocation happens atomically in
 * Postgres and is never reused.
 */
export function createCertificateNumber(
  completedAt: string,
  sequence: number,
): string {
  const date = new Date(completedAt);
  return `RACMNG-${rotaryYear(Number.isNaN(date.getTime()) ? new Date() : date)}-${String(sequence).padStart(2, "0")}`;
}
