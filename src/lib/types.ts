/**
 * types.ts — domain types shared across components, pages, and lib.
 * Components depend on these abstractions, not on Content Collection
 * internals — so swapping the data source touches one place.
 */

export type ContentKind = "writeup" | "note" | "project";

export interface ContentBase {
  readonly slug: string;
  readonly kind: ContentKind;
  readonly date: Date;
  readonly title: string;
  readonly url: string;
}

export interface WriteupSummary extends ContentBase {
  readonly kind: "writeup";
  readonly tag: string;
  readonly excerpt?: string;
}

export interface NoteSummary extends ContentBase {
  readonly kind: "note";
  /** Short body shown directly in the index list (italic serif). */
  readonly body: string;
}

export interface ProjectSummary extends ContentBase {
  readonly kind: "project";
  readonly name: string;
  readonly description: string;
  readonly status?: string;
  readonly language?: string;
  readonly repo?: string;
}

export type AnyContentSummary = WriteupSummary | NoteSummary | ProjectSummary;
