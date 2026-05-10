/**
 * Content Collection schemas — the single source of truth for
 * what frontmatter is allowed in writeups / notes / projects.
 *
 * Pages depend on these schemas (via getCollection), not on the
 * raw markdown — so renaming a frontmatter key only ripples
 * through one place.
 */

import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const baseSchema = z.object({
  title: z.string().min(1),
  date:  z.coerce.date(),
  draft: z.boolean().default(false),
});

const writeups = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writeups" }),
  schema: baseSchema.extend({
    tag:         z.string().min(1),
    description: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: baseSchema.extend({
    /** Short body rendered directly on the index page (italic serif). */
    body: z.string().min(1),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: baseSchema.extend({
    name:        z.string().min(1),
    description: z.string().min(1),
    status:      z.string().optional(),
    language:    z.string().optional(),
    repo:        z.string().url().optional(),
  }),
});

export const collections = { writeups, notes, projects };
