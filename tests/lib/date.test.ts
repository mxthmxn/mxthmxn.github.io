import { describe, it, expect } from "vitest";
import { formatYearMonth, toIsoDate, pad2 } from "../../src/lib/date";

describe("pad2", () => {
  it("zero-pads single digits", () => {
    expect(pad2(1)).toBe("01");
    expect(pad2(9)).toBe("09");
  });
  it("leaves two+ digits unchanged", () => {
    expect(pad2(10)).toBe("10");
    expect(pad2(99)).toBe("99");
  });
});

describe("formatYearMonth", () => {
  it('formats with the "·" middle dot in UTC', () => {
    expect(formatYearMonth(new Date(Date.UTC(2025, 10, 15)))).toBe("2025·11");
    expect(formatYearMonth(new Date(Date.UTC(2024, 0, 1))) ).toBe("2024·01");
  });
  it("ignores host timezone (UTC throughout)", () => {
    // last second of 2025-12-31 UTC
    const d = new Date(Date.UTC(2025, 11, 31, 23, 59, 59));
    expect(formatYearMonth(d)).toBe("2025·12");
  });
  it("throws on invalid Date", () => {
    expect(() => formatYearMonth(new Date("not-a-date"))).toThrow(RangeError);
  });
});

describe("toIsoDate", () => {
  it("returns YYYY-MM-DD slice of ISO timestamp", () => {
    expect(toIsoDate(new Date(Date.UTC(2025, 10, 15)))).toBe("2025-11-15");
  });
});
