/**
 * slug.ts — URL-safe slug generator.
 *
 * Conservative: ASCII lowercase alphanumerics and hyphens only.
 * Collapses runs of separators into single hyphens. Combining
 * marks (NFKD output) are stripped via the explicit Unicode range.
 */

const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALNUM       = /[^a-z0-9]+/g;
const EDGE_HYPHENS    = /^-+|-+$/g;

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(COMBINING_MARKS, "")
    .replace(NON_ALNUM, "-")
    .replace(EDGE_HYPHENS, "");
}
