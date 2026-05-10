import { describe, it, expect } from "vitest";
import { slugify } from "../../src/lib/slug";

describe("slugify", () => {
  it("lowercases ASCII", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("collapses runs of separators", () => {
    expect(slugify("foo --- bar")).toBe("foo-bar");
  });
  it("strips edge hyphens", () => {
    expect(slugify("---foo---")).toBe("foo");
  });
  it("strips combining marks (NFKD)", () => {
    expect(slugify("café")).toBe("cafe");
  });
  it("returns empty string on empty input", () => {
    expect(slugify("")).toBe("");
  });
  it("handles unicode words by stripping non-alnum", () => {
    expect(slugify("Привет мир!")).toBe("");
  });
});
