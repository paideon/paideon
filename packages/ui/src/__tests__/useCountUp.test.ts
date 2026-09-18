// Unit tests for useCountUp hook (F-124)
// Tests animation logic, start/end values, duration handling.

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useCountUp } from "../hooks/useCountUp";

describe("useCountUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with value 0", () => {
    const { result } = renderHook(() => useCountUp(100));
    expect(result.current.value.get()).toBe(0);
  });

  it("should start animation when start is called", () => {
    const { result } = renderHook(() => useCountUp(100));
    act(() => {
      result.current.start();
    });
    expect(result.current.isAnimating).toBe(true);
  });

  it("should complete animation", async () => {
    const { result } = renderHook(() => useCountUp(100, { duration: 0.1 }));
    act(() => {
      result.current.start();
    });
    // Animation should complete quickly with short duration
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(result.current.isComplete).toBe(true);
  });

  it("should reset animation state", () => {
    const { result } = renderHook(() => useCountUp(100));
    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.value.get()).toBe(0);
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.isComplete).toBe(false);
  });

  it("should handle non-animated mode", () => {
    const { result } = renderHook(() => useCountUp(100, { animated: false }));
    act(() => {
      result.current.start();
    });
    expect(result.current.value.get()).toBe(100);
    expect(result.current.isComplete).toBe(true);
  });

  it("should call onComplete callback", async () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useCountUp(100, { duration: 0.1, onComplete })
    );
    act(() => {
      result.current.start();
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(onComplete).toHaveBeenCalled();
  });

  it("should respect delay option", () => {
    const { result } = renderHook(() =>
      useCountUp(100, { delay: 0.5, duration: 0.1 })
    );
    act(() => {
      result.current.start();
    });
    expect(result.current.isAnimating).toBe(false);
  });
});
