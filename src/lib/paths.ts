/**
 * paths.ts — URL builders. One place to change route conventions.
 */

import type { ContentKind } from "./types";

const ROOT: Record<ContentKind, string> = {
  writeup: "/writeups",
  note:    "/notes",
  project: "/projects",
};

export function contentUrl(kind: ContentKind, slug: string): string {
  return `${ROOT[kind]}/${slug}/`;
}
