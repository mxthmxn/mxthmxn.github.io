/**
 * date.ts — date formatting helpers.
 *
 * The site uses a single visual format for dates ("YYYY·MM"), so all
 * formatting flows through one function. Month/year are extracted in
 * UTC to keep output stable across the build host's timezone.
 */

const SEP = "·"; // middle dot

export const pad2 = (n: number): string => n.toString().padStart(2, "0");

/**
 * Format a date as "YYYY·MM" using UTC.
 * @throws RangeError if the input is not a valid date.
 */
export function formatYearMonth(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("formatYearMonth: invalid Date");
  }
  return `${date.getUTCFullYear()}${SEP}${pad2(date.getUTCMonth() + 1)}`;
}

/**
 * Format a date as ISO 8601 (YYYY-MM-DD) for machine-readable
 * `<time datetime="...">` attributes.
 */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
