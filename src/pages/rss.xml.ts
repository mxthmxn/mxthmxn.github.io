/**
 * /rss.xml — RSS feed combining writeups + notes (latest first).
 */

import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import {
  getWriteupSummaries,
  getNoteSummaries,
} from "../lib/content";
import { site } from "../config/site";

export async function GET(context: APIContext): Promise<Response> {
  const [writeups, notes] = await Promise.all([
    getWriteupSummaries(),
    getNoteSummaries(),
  ]);

  const items = [
    ...writeups.map((w) => ({
      title:       w.title,
      pubDate:     w.date,
      link:        w.url,
      description: w.excerpt ?? "",
      categories:  ["writeup", w.tag],
    })),
    ...notes.map((n) => ({
      title:       n.title,
      pubDate:     n.date,
      link:        n.url,
      description: n.body,
      categories:  ["note"],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title:       `${site.handle} — feed`,
    description: site.description,
    site:        context.site ?? site.url,
    items,
  });
}
