/**
 * Single source of truth for site identity.
 * Imported wherever a handle, URL, or social link is rendered.
 */

export interface SocialLink {
  readonly key: string;
  readonly label: string;
  readonly href: string;
}

export interface SiteConfig {
  readonly handle: string;
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly tagline: string;
  readonly avatarSize: number;
  readonly avatarUrl: string;
  readonly email: string;
  readonly socials: readonly SocialLink[];
  readonly nav: readonly { readonly label: string; readonly href: string }[];
  readonly locale: string;
  readonly ogImage: string;
}

const handle = "mxthmxn";
const url = `https://${handle}.github.io`;

export const site: SiteConfig = {
  handle,
  url,
  title: `${handle} — index`,
  description: "A slow notebook. Fragments, observations, things worth looking at twice.",
  tagline: "A slow notebook. Fragments, observations, things worth looking at twice.",
  avatarSize: 280,
  avatarUrl: `https://github.com/${handle}.png?size=280`,
  email: "myzvezduk0408@gmail.com",
  socials: [
    { key: "github", label: `@${handle}`, href: `https://github.com/${handle}` },
  ],
  nav: [
    { label: "writeups", href: "/#writeups" },
    { label: "notes", href: "/#notes" },
    { label: "projects", href: "/#projects" },
    { label: "contact", href: "/#contact" },
  ],
  locale: "en",
  ogImage: "/og-default.png",
} as const;
