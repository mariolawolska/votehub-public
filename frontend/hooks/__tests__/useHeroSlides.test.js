/**
 * Unit tests for the useHeroSlides custom hook.
 *
 * This suite verifies:
 * - correct fetching of hero slide data from the API
 * - proper state transitions for loading and slides
 * - fallback to an empty array when API returns no products
 * - safe handling of fetch errors without breaking the hook
 *
 * The global fetch API is fully mocked to isolate hook logic
 * and prevent real network requests.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSlides } from "../hooks/useHeroSlides";

describe("useHeroSlides hook", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches hero slides and updates state", async () => {
    const mockData = { products: [{ id: 1, title: "Slide 1" }] };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useHeroSlides());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slides).toEqual(mockData.products);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://laravel.marbar.co.uk/api/products/hero"
    );
  });

  it("returns empty array when API returns no products", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useHeroSlides());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slides).toEqual([]);
  });

  it("handles fetch errors gracefully", async () => {
    console.log = jest.fn(); // silence error logs

    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useHeroSlides());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slides).toEqual([]);
    expect(console.log).toHaveBeenCalled();
  });
});
