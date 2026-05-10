import { describe, it, expect } from "vitest";
import { contentUrl } from "../../src/lib/paths";

describe("contentUrl", () => {
  it("builds writeup urls", () => {
    expect(contentUrl("writeup", "my-slug")).toBe("/writeups/my-slug/");
  });
  it("builds note urls", () => {
    expect(contentUrl("note", "x")).toBe("/notes/x/");
  });
  it("builds project urls", () => {
    expect(contentUrl("project", "alpha")).toBe("/projects/alpha/");
  });
});
