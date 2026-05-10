/**
 * content.ts — adapter from Astro Content Collections to the domain
 * Summary types used by components. Pages and components depend on
 * these summaries, not on Content Collection internals — so swapping
 * a loader or renaming a frontmatter key touches one file.
 */

import { getCollection, type CollectionEntry } from "astro:content";
import { byDateDesc, sorted } from "./sort";
import { contentUrl } from "./paths";
import type {
  WriteupSummary,
  NoteSummary,
  ProjectSummary,
} from "./types";

const notDraft = <C extends "writeups" | "notes" | "projects">(
  entry: CollectionEntry<C>,
): boolean => entry.data.draft !== true;

const cmpDate = byDateDesc<{ date: Date }>((s) => s.date);

// ── writeups ──────────────────────────────────────────────────
function toWriteupSummary(entry: CollectionEntry<"writeups">): WriteupSummary {
  return {
    kind:    "writeup",
    slug:    entry.id,
    title:   entry.data.title,
    date:    entry.data.date,
    tag:     entry.data.tag,
    excerpt: entry.data.description,
    url:     contentUrl("writeup", entry.id),
  };
}

export async function getWriteupSummaries(): Promise<WriteupSummary[]> {
  const entries = await getCollection("writeups", notDraft);
  return sorted(entries.map(toWriteupSummary), cmpDate);
}

// ── notes ─────────────────────────────────────────────────────
function toNoteSummary(entry: CollectionEntry<"notes">): NoteSummary {
  return {
    kind:  "note",
    slug:  entry.id,
    title: entry.data.title,
    date:  entry.data.date,
    body:  entry.data.body,
    url:   contentUrl("note", entry.id),
  };
}

export async function getNoteSummaries(): Promise<NoteSummary[]> {
  const entries = await getCollection("notes", notDraft);
  return sorted(entries.map(toNoteSummary), cmpDate);
}

// ── projects ──────────────────────────────────────────────────
function toProjectSummary(entry: CollectionEntry<"projects">): ProjectSummary {
  return {
    kind:        "project",
    slug:        entry.id,
    title:       entry.data.title,
    name:        entry.data.name,
    description: entry.data.description,
    date:        entry.data.date,
    status:      entry.data.status,
    language:    entry.data.language,
    repo:        entry.data.repo,
    url:         contentUrl("project", entry.id),
  };
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  const entries = await getCollection("projects", notDraft);
  return sorted(entries.map(toProjectSummary), cmpDate);
}
