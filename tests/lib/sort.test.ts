import { describe, it, expect } from "vitest";
import { byDateDesc, byDateAsc, sorted } from "../../src/lib/sort";

interface Dated { id: string; date: Date }

const items: Dated[] = [
  { id: "a", date: new Date("2024-01-01") },
  { id: "b", date: new Date("2025-12-01") },
  { id: "c", date: new Date("2025-06-01") },
];

describe("byDateDesc", () => {
  it("orders newest first", () => {
    const result = sorted(items, byDateDesc((d) => d.date));
    expect(result.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });
});

describe("byDateAsc", () => {
  it("orders oldest first", () => {
    const result = sorted(items, byDateAsc((d) => d.date));
    expect(result.map((i) => i.id)).toEqual(["a", "c", "b"]);
  });
});

describe("sorted", () => {
  it("does not mutate the input array", () => {
    const before = items.map((i) => i.id);
    sorted(items, byDateDesc((d) => d.date));
    expect(items.map((i) => i.id)).toEqual(before);
  });
});
