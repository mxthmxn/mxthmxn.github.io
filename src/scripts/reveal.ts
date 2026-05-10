/**
 * reveal.ts — adds `.in` to elements with `.reveal` as they enter
 * the viewport. Honors prefers-reduced-motion.
 *
 * Encapsulated as a class with a small surface so it can be replaced
 * (e.g. with a CSS scroll-driven animation) without touching callers.
 */

interface RevealOptions {
  readonly selector: string;
  readonly inClass: string;
  readonly rootMargin: string;
  readonly threshold: number;
  readonly maxStagger: number;
  readonly stepMs: number;
}

const DEFAULTS: RevealOptions = {
  selector:  ".reveal",
  inClass:   "in",
  rootMargin:"0px 0px -10% 0px",
  threshold: 0.05,
  maxStagger:6,
  stepMs:    40,
};

export class RevealController {
  private readonly opts: RevealOptions;
  private observer: IntersectionObserver | null = null;

  constructor(options: Partial<RevealOptions> = {}) {
    this.opts = { ...DEFAULTS, ...options };
  }

  start(doc: Document = document): void {
    const targets = Array.from(doc.querySelectorAll<HTMLElement>(this.opts.selector));
    if (targets.length === 0) return;

    if (this.prefersReducedMotion()) {
      for (const el of targets) el.classList.add(this.opts.inClass);
      return;
    }

    this.observer = new IntersectionObserver(this.onIntersect, {
      rootMargin: this.opts.rootMargin,
      threshold:  this.opts.threshold,
    });

    targets.forEach((el, i) => {
      const delay = Math.min(i, this.opts.maxStagger) * this.opts.stepMs;
      el.style.transitionDelay = `${delay}ms`;
      this.observer!.observe(el);
    });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private readonly onIntersect = (entries: readonly IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add(this.opts.inClass);
      this.observer?.unobserve(entry.target);
    }
  };

  private prefersReducedMotion(): boolean {
    return typeof matchMedia === "function"
      && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

// Auto-start when imported by Astro client directives.
if (typeof window !== "undefined") {
  new RevealController().start();
}
