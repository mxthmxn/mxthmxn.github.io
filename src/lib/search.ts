/**
 * search.ts — case-insensitive substring + subsequence ranking
 * for the command palette. Pure & deterministic.
 *
 * The scoring is intentionally simple — we are searching across
 * tens of items at most, so we trade fuzziness for predictability.
 */

export interface Searchable {
  readonly id: string;
  readonly kind: string;
  readonly title: string;
  readonly meta?: string;
}

export interface SearchHit<T extends Searchable> {
  readonly item: T;
  readonly score: number;
}

const norm = (s: string): string => s.toLowerCase().trim();

/**
 * Returns true when every character of `needle` appears in `haystack`
 * in order (subsequence match), not necessarily contiguous.
 */
export function isSubsequence(needle: string, haystack: string): boolean {
  if (needle.length === 0) return true;
  let i = 0;
  for (const ch of haystack) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return i === needle.length;
}

/**
 * Score an item against a query.
 * Higher = better. 0 means "no match".
 *
 * Heuristics:
 *   exact title         → 100
 *   title prefix        →  90
 *   title contains      →  70
 *   subsequence in title→  50
 *   meta/kind contains  →  30
 *   subsequence elsewhere→ 10
 */
export function scoreItem<T extends Searchable>(query: string, item: T): number {
  const q = norm(query);
  if (q.length === 0) return 1; // empty query: everyone matches with low priority
  const title = norm(item.title);
  const meta  = norm(item.meta ?? "");
  const kind  = norm(item.kind);

  if (title === q) return 100;
  if (title.startsWith(q)) return 90;
  if (title.includes(q)) return 70;
  if (isSubsequence(q, title)) return 50;
  if (meta.includes(q) || kind.includes(q)) return 30;
  if (isSubsequence(q, `${title} ${meta} ${kind}`)) return 10;
  return 0;
}

export function rank<T extends Searchable>(query: string, items: readonly T[]): SearchHit<T>[] {
  const hits: SearchHit<T>[] = [];
  for (const item of items) {
    const score = scoreItem(query, item);
    if (score > 0) hits.push({ item, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits;
}
