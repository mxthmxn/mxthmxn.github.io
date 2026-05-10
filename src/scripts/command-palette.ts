/**
 * command-palette.ts — Cmd/Ctrl+K modal.
 *
 * Reads a build-time JSON index from <script id="cmdk-index">,
 * ranks results via lib/search, and renders the list. The class
 * is small and instantiated by `attach()` only when the required
 * DOM nodes exist — so the script is safe to import on any page.
 */

import { rank, type Searchable, type SearchHit } from "../lib/search";

export interface PaletteItem extends Searchable {
  readonly href: string;
}

interface PaletteNodes {
  readonly overlay: HTMLElement;
  readonly input:   HTMLInputElement;
  readonly list:    HTMLElement;
  readonly index:   HTMLElement;
}

const HTML_ESCAPES: Record<string, string> = {
  "&":  "&amp;",
  "<":  "&lt;",
  ">":  "&gt;",
  '"':  "&quot;",
  "'":  "&#39;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

function isOpenShortcut(e: KeyboardEvent): boolean {
  return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
}

function findNodes(root: Document): PaletteNodes | null {
  const overlay = root.getElementById("cmdk");
  const input   = root.getElementById("cmdk-input");
  const list    = root.getElementById("cmdk-list");
  const index   = root.getElementById("cmdk-index");
  if (
    overlay instanceof HTMLElement &&
    input   instanceof HTMLInputElement &&
    list    instanceof HTMLElement &&
    index   instanceof HTMLElement
  ) {
    return { overlay, input, list, index };
  }
  return null;
}

export class CommandPalette {
  private readonly nodes: PaletteNodes;
  private readonly items: readonly PaletteItem[];
  private active = 0;
  private hits: SearchHit<PaletteItem>[] = [];

  constructor(nodes: PaletteNodes) {
    this.nodes = nodes;
    this.items = this.parseIndex(nodes.index);
  }

  /**
   * Idempotent factory — returns null if the palette markup
   * is missing on the current page.
   */
  static attach(root: Document = document): CommandPalette | null {
    const nodes = findNodes(root);
    if (!nodes) return null;
    const palette = new CommandPalette(nodes);
    palette.bind();
    return palette;
  }

  bind(): void {
    document.addEventListener("keydown", this.onKeyDown);
    this.nodes.input.addEventListener("input", this.onInput);
    this.nodes.list.addEventListener("click", this.onListClick);
    this.nodes.overlay.addEventListener("click", this.onOverlayClick);
  }

  open(): void {
    this.nodes.overlay.dataset.open = "true";
    this.nodes.input.value = "";
    this.active = 0;
    this.render();
    this.nodes.input.focus();
  }

  close(): void {
    this.nodes.overlay.dataset.open = "false";
    this.nodes.input.blur();
  }

  isOpen(): boolean {
    return this.nodes.overlay.dataset.open === "true";
  }

  private parseIndex(node: HTMLElement): readonly PaletteItem[] {
    try {
      const parsed = JSON.parse(node.textContent ?? "[]") as unknown;
      return Array.isArray(parsed) ? (parsed as PaletteItem[]) : [];
    } catch {
      return [];
    }
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (isOpenShortcut(e)) {
      e.preventDefault();
      if (this.isOpen()) this.close();
      else this.open();
      return;
    }
    if (!this.isOpen()) return;
    switch (e.key) {
      case "Escape":     e.preventDefault(); this.close();  return;
      case "ArrowDown":  e.preventDefault(); this.move(1);  return;
      case "ArrowUp":    e.preventDefault(); this.move(-1); return;
      case "Enter":      e.preventDefault(); this.confirm(); return;
    }
  };

  private readonly onInput = (): void => {
    this.active = 0;
    this.render();
  };

  private readonly onListClick = (e: Event): void => {
    const target = e.target;
    if (target instanceof Element && target.closest("a[data-href]")) {
      this.close();
    }
  };

  private readonly onOverlayClick = (e: Event): void => {
    if (e.target === this.nodes.overlay) this.close();
  };

  private move(delta: number): void {
    if (this.hits.length === 0) return;
    const len = this.hits.length;
    this.active = (this.active + delta + len) % len;
    this.highlight();
  }

  private confirm(): void {
    const hit = this.hits[this.active];
    if (!hit) return;
    location.href = hit.item.href;
  }

  private render(): void {
    const q = this.nodes.input.value;
    this.hits = rank<PaletteItem>(q, this.items);
    if (this.hits.length === 0) {
      this.nodes.list.innerHTML = `<li class="cmdk-empty">no matches</li>`;
      return;
    }
    this.nodes.list.innerHTML = this.hits
      .map((hit, i) => this.renderRow(hit, i === this.active))
      .join("");
  }

  private renderRow(hit: SearchHit<PaletteItem>, isActive: boolean): string {
    const { item } = hit;
    const meta = item.meta
      ? `<span class="cmdk-meta">${escapeHtml(item.meta)}</span>`
      : "";
    return `
      <li data-active="${isActive}">
        <a href="${escapeHtml(item.href)}" data-href>
          <span class="cmdk-kind">.${escapeHtml(item.kind)}</span>
          <span class="cmdk-title">${escapeHtml(item.title)}</span>
          ${meta}
        </a>
      </li>
    `;
  }

  private highlight(): void {
    const lis = this.nodes.list.querySelectorAll<HTMLLIElement>("li");
    lis.forEach((li, i) => {
      li.dataset.active = String(i === this.active);
    });
    lis[this.active]?.scrollIntoView({ block: "nearest" });
  }
}

if (typeof window !== "undefined") {
  CommandPalette.attach();
}
