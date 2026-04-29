/**
 * Unit tests for the useAutosuggest custom hook.
 *
 * This suite verifies:
 * - clearing suggestions when the query is empty or whitespace
 * - case-insensitive matching for movie titles and descriptions
 * - correct filtering of movies based on the search term
 * - limiting results to a maximum of 6 suggestions
 * - reactive updates when query or movie list changes
 *
 * The hook is fully isolated and does not require mocking external APIs.
 */

import { renderHook } from "@testing-library/react";
import { useAutosuggest } from "../hooks/useAutosuggest";

describe("useAutosuggest hook", () => {
  const movies = [
    { title: "Inception", description: "A mind-bending thriller" },
    { title: "Interstellar", description: "Space exploration epic" },
    { title: "The Dark Knight", description: "Batman faces the Joker" },
    { title: "Dune", description: "Sci-fi desert saga" },
    { title: "Avatar", description: "Journey to Pandora" },
    { title: "Gladiator", description: "Roman revenge story" },
    { title: "The Matrix", description: "Reality-bending action" },
  ];

  it("returns empty array when query is empty", () => {
    const { result } = renderHook(() => useAutosuggest(movies, ""));

    expect(result.current).toEqual([]);
  });

  it("returns empty array when query is whitespace", () => {
    const { result } = renderHook(() => useAutosuggest(movies, "   "));

    expect(result.current).toEqual([]);
  });

  it("filters movies by title", () => {
    const { result } = renderHook(() => useAutosuggest(movies, "inception"));

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Inception");
  });

  it("filters movies by description", () => {
    const { result } = renderHook(() => useAutosuggest(movies, "thriller"));

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Inception");
  });

  it("is case-insensitive", () => {
    const { result } = renderHook(() => useAutosuggest(movies, "BATMAN"));

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("The Dark Knight");
  });

  it("limits results to 6 items", () => {
    const { result } = renderHook(() => useAutosuggest(movies, "a"));

    expect(result.current.length).toBe(6);
  });

  it("updates when query changes", () => {
    const { result, rerender } = renderHook(
      ({ q }) => useAutosuggest(movies, q),
      { initialProps: { q: "dune" } }
    );

    expect(result.current.length).toBe(1);

    rerender({ q: "matrix" });

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("The Matrix");
  });

  it("updates when movie list changes", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useAutosuggest(items, "new"),
      {
        initialProps: {
          items: movies,
        },
      }
    );

    expect(result.current.length).toBe(0);

    const updated = [
      ...movies,
      { title: "New Movie", description: "Brand new release" },
    ];

    rerender({ items: updated });

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("New Movie");
  });
});
