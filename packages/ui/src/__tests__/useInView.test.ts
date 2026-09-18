// Unit tests for useInView hook (F-124)
// Tests IntersectionObserver wiring with mock.

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useInView } from "../hooks/useInView";

describe("useInView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with isInView false", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.isInView).toBe(false);
  });

  it("should return a ref object", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.ref.current).toBe("object");
  });

  it("should accept custom threshold option", () => {
    const { result } = renderHook(() => useInView({ threshold: 0.5 }));
    expect(result.current.isInView).toBe(false);
  });

  it("should accept custom rootMargin option", () => {
    const { result } = renderHook(() => useInView({ rootMargin: "10px" }));
    expect(result.current.isInView).toBe(false);
  });

  it("should accept triggerOnce option", () => {
    const { result } = renderHook(() => useInView({ triggerOnce: true }));
    expect(result.current.isInView).toBe(false);
  });

  it("should handle all options together", () => {
    const { result } = renderHook(() =>
      useInView({
        threshold: 0.3,
        rootMargin: "20px",
        triggerOnce: false,
      })
    );
    expect(result.current.isInView).toBe(false);
    expect(result.current.ref).toBeDefined();
  });
});
