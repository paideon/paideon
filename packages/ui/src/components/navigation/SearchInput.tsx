"use client";
import type { SearchResultData } from "@paideon/contracts";
import { useEffect, useId, useReducer, useRef } from "react";

import { cn } from "../../utilities/cn";

export interface SearchInputProps {
  /** Clarifies scope, e.g. "Search news and announcements" */
  scopeLabel: string;
  placeholder?: string;
  onSearch: (query: string) => Promise<SearchResultData[]> | SearchResultData[];
  onResultClick?: (result: SearchResultData) => void;
  clearLabel?: string;
  className?: string;
}

// ─── State machine ───────────────────────────────────────────────────────────
// query/results/open/loading/activeIdx are interdependent (closing when the
// query empties, resetting activeIdx whenever results change, etc.) — a
// reducer makes those transitions explicit instead of relying on several
// components of state staying in sync via scattered effects and handlers.

interface SearchState {
  query: string;
  results: SearchResultData[];
  open: boolean;
  loading: boolean;
  activeIdx: number;
}

type SearchAction =
  | { type: "QUERY_CHANGED"; query: string }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; results: SearchResultData[] }
  | { type: "OPEN_IF_RESULTS" }
  | { type: "CLOSE" }
  | { type: "CLEAR" }
  | { type: "MOVE_ACTIVE"; delta: number }
  | { type: "SELECT_ACTIVE"; idx: number };

const initialState: SearchState = {
  query: "",
  results: [],
  open: false,
  loading: false,
  activeIdx: -1,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "QUERY_CHANGED":
      if (!action.query.trim()) {
        return {
          ...state,
          query: action.query,
          results: [],
          open: false,
          loading: false,
          activeIdx: -1,
        };
      }
      return { ...state, query: action.query };
    case "SEARCH_START":
      return { ...state, loading: true };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        results: action.results,
        open: action.results.length > 0,
        loading: false,
        activeIdx: -1,
      };
    case "OPEN_IF_RESULTS":
      return state.results.length > 0 ? { ...state, open: true } : state;
    case "CLOSE":
      return { ...state, open: false };
    case "CLEAR":
      return initialState;
    case "MOVE_ACTIVE": {
      const next = Math.max(
        -1,
        Math.min(state.activeIdx + action.delta, state.results.length - 1)
      );
      return { ...state, activeIdx: next };
    }
    case "SELECT_ACTIVE":
      return { ...state, activeIdx: action.idx };
    default:
      return state;
  }
}

export function SearchInput({
  scopeLabel,
  placeholder,
  onSearch,
  onResultClick,
  clearLabel = "Clear search",
  className,
}: SearchInputProps) {
  const id = useId();
  const listId = `${id}-results`;

  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { query, results, open, loading, activeIdx } = state;

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Bumped on every keystroke; a response is only applied if it's still the
  // most recent request when it resolves. Without this, a fast second
  // keystroke's response arriving before a slower first keystroke's response
  // could have the first (stale) response overwrite the second (correct) one.
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!query.trim()) return;

    const currentRequestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      dispatch({ type: "SEARCH_START" });
      try {
        const res = await onSearch(query);
        if (requestIdRef.current === currentRequestId) {
          dispatch({ type: "SEARCH_SUCCESS", results: res });
        }
        // else: a newer request has since started — this response is stale, drop it.
      } catch {
        if (requestIdRef.current === currentRequestId) {
          dispatch({ type: "SEARCH_SUCCESS", results: [] });
        }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node))
        dispatch({ type: "CLOSE" });
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      dispatch({ type: "MOVE_ACTIVE", delta: 1 });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      dispatch({ type: "MOVE_ACTIVE", delta: -1 });
    } else if (e.key === "Escape") {
      dispatch({ type: "CLOSE" });
      inputRef.current?.blur();
    } else if (e.key === "Enter" && activeIdx >= 0) {
      onResultClick?.(results[activeIdx]);
      dispatch({ type: "CLOSE" });
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="block mb-1.5 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted"
      >
        {scopeLabel}
      </label>

      <div className="relative">
        {/* Search icon */}
        <span
          aria-hidden="true"
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-colors duration-fast leading-none ${
            open ? "text-gold-base" : "text-text-muted"
          }`}
        >
          ⌕
        </span>

        <input
          ref={inputRef}
          id={id}
          type="search"
          value={query}
          onChange={(e) =>
            dispatch({ type: "QUERY_CHANGED", query: e.target.value })
          }
          onKeyDown={handleKeyDown}
          onFocus={() => dispatch({ type: "OPEN_IF_RESULTS" })}
          placeholder={placeholder ?? "Search…"}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className={`w-full font-body text-[0.9rem] text-text-primary bg-surface-elevated rounded-sm py-2.5 pr-10 pl-[38px] outline-none border transition-colors duration-fast ${
            open ? "border-gold-base" : "border-border-default"
          }`}
        />

        {/* Loading / clear */}
        {(loading || query) && (
          <button
            onClick={() => {
              dispatch({ type: "CLEAR" });
              inputRef.current?.focus();
            }}
            aria-label={clearLabel}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-muted text-base leading-none p-0.5"
          >
            {loading ? "…" : "×"}
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-50 top-[calc(100%+4px)] bg-surface-elevated border border-border-light shadow-elevation-2 list-none py-1 m-0 max-h-80 overflow-y-auto"
        >
          {results.map((result, idx) => (
            <li key={result.id} role="option" aria-selected={activeIdx === idx}>
              <a
                href={result.href}
                onClick={(e) => {
                  e.preventDefault();
                  onResultClick?.(result);
                  dispatch({ type: "CLOSE" });
                }}
                className={`block px-4 py-2.5 no-underline transition-colors duration-fast ${
                  activeIdx === idx ? "bg-surface-default" : "bg-transparent"
                }`}
                onMouseEnter={() => dispatch({ type: "SELECT_ACTIVE", idx })}
              >
                <span className="block font-body text-[0.875rem] text-text-primary">
                  {result.label}
                </span>
                {result.meta && (
                  <span className="block mt-0.5 font-body text-[0.72rem] text-text-muted">
                    {result.meta}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
