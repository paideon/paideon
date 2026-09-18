"use client";

import { useState } from "react";

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    // Malformed JSON in storage, or storage inaccessible — fall back silently.
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Lazy-initialize directly from storage instead of always starting from
  // `initialValue` and patching it in via an effect after mount — that
  // previous approach guaranteed a one-frame flash of the default value on
  // every mount, even when a stored value already existed.
  const [storedValue, setStoredValue] = useState<T>(() =>
    readValue(key, initialValue)
  );

  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full, blocked, or unavailable (e.g. Safari private browsing)
      // — the in-memory state above still updates, so the UI stays
      // consistent for this session even though persistence silently fails.
    }
  };

  return [storedValue, setValue];
}
