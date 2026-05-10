/**
 * sort.ts — generic sorting helpers.
 * Pure, side-effect-free; do not mutate the input array.
 */

export type Comparator<T> = (a: T, b: T) => number;

export const byDateDesc =
  <T>(getDate: (item: T) => Date): Comparator<T> =>
  (a, b) => getDate(b).getTime() - getDate(a).getTime();

export const byDateAsc =
  <T>(getDate: (item: T) => Date): Comparator<T> =>
  (a, b) => getDate(a).getTime() - getDate(b).getTime();

export function sorted<T>(items: readonly T[], cmp: Comparator<T>): T[] {
  return [...items].sort(cmp);
}
