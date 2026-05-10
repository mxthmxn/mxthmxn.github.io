import { describe, it, expect } from "vitest";
import { isSubsequence, scoreItem, rank, type Searchable } from "../../src/lib/search";

const items: Searchable[] = [
  { id: "a", kind: "writeup", title: "Hypervisor introspection",   meta: "hypervisor" },
  { id: "b", kind: "note",    title: "Memory map fundamentals",     meta: "win-internals" },
  { id: "c", kind: "project", title: "ioctl-fuzzer",                meta: "fuzzer · C" },
  { id: "d", kind: "writeup", title: "Reversing a CFG bypass",      meta: "rev-eng" },
];

describe("isSubsequence", () => {
  it("matches contiguous substrings", () => {
    expect(isSubsequence("abc", "abcdef")).toBe(true);
  });
  it("matches non-contiguous subsequences", () => {
    expect(isSubsequence("hyp", "hypervisor")).toBe(true);
    expect(isSubsequence("hpr", "hypervisor")).toBe(true);
  });
  it("rejects out-of-order needles", () => {
    expect(isSubsequence("zyx", "hypervisor")).toBe(false);
  });
  it("treats empty needle as a match", () => {
    expect(isSubsequence("", "anything")).toBe(true);
  });
});

describe("scoreItem", () => {
  const it_ = items[0]!;
  it("returns 100 on exact title match", () => {
    expect(scoreItem("hypervisor introspection", it_)).toBe(100);
  });
  it("returns 90 on title prefix", () => {
    expect(scoreItem("hyperv", it_)).toBe(90);
  });
  it("returns 70 on title contains", () => {
    expect(scoreItem("introspect", it_)).toBe(70);
  });
  it("returns 30 on meta or kind contains", () => {
    expect(scoreItem("writeup", it_)).toBe(30);
  });
  it("returns 0 when nothing matches", () => {
    expect(scoreItem("zzz-nothing-zzz-no-letters-here-9876543210", it_)).toBe(0);
  });
  it("treats empty query as low-priority match", () => {
    expect(scoreItem("", it_)).toBe(1);
  });
});

describe("rank", () => {
  it("orders hits by descending score", () => {
    const hits = rank("hyp", items);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.item.id).toBe("a");
    for (let i = 1; i < hits.length; i++) {
      expect(hits[i - 1]!.score).toBeGreaterThanOrEqual(hits[i]!.score);
    }
  });
  it("filters out zero-score items", () => {
    const hits = rank("ioctl", items);
    expect(hits.every((h) => h.score > 0)).toBe(true);
    expect(hits.find((h) => h.item.id === "c")).toBeDefined();
  });
});
