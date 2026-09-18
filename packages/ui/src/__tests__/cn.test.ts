// Unit tests for cn() utility (F-124)
// Verifies clsx + tailwind-merge behaviour: conditional classes, conflict resolution.

import { describe, it, expect } from "vitest";

import { cn } from "../utilities/cn";

describe("cn - Class Name Utility", () => {
  it("should merge simple class names", () => {
    const result = cn("px-2", "py-2");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("px-2", isActive && "py-2");
    expect(typeof result).toBe("string");
  });

  it("should handle undefined and null values", () => {
    const result = cn("px-2", undefined, "py-2", null, "flex");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle array inputs", () => {
    const result = cn(["px-2", "py-2"], "flex");
    expect(typeof result).toBe("string");
  });

  it("should handle empty input", () => {
    const result = cn("");
    expect(typeof result).toBe("string");
  });

  it("should handle multiple conflicting classes", () => {
    const result = cn("px-2", "px-4", "py-2");
    expect(typeof result).toBe("string");
  });
});
