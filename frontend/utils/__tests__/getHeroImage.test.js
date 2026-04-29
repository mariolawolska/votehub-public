/**
 * Unit tests for the getHeroImage utility function.
 *
 * This suite verifies:
 * - correct mapping of image types (xl, desktop, tablet, mobile)
 * - delegation of image resolution to the getImage() helper
 * - proper fallback behavior when specific image types are missing
 * - use of the first product image as fallback when available
 * - use of the default placeholder when no images exist
 * - graceful handling of undefined or malformed product objects
 *
 * These tests isolate getHeroImage by mocking getImage(), ensuring that
 * only the mapping and fallback logic are validated without relying on
 * external URL-building behavior.
 */

import { getHeroImage } from "../getHeroImage";
import { getImage } from "../getImage";

// Mock the getImage function so we can isolate getHeroImage logic
jest.mock("../getImage");

describe("getHeroImage()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct image paths for each size", () => {
    const product = {
      images: [
        { path: "xl.jpg", type: "xl" },
        { path: "desktop.jpg", type: "desktop" },
        { path: "tablet.jpg", type: "tablet" },
        { path: "mobile.jpg", type: "mobile" },
      ],
    };

    // Mock implementation returns a predictable value for each type
    getImage.mockImplementation((product, type) => `${type}.jpg`);

    const result = getHeroImage(product);

    expect(result.xl).toBe("xl.jpg");
    expect(result.desktop).toBe("desktop.jpg");
    expect(result.tablet).toBe("tablet.jpg");
    expect(result.mobile).toBe("mobile.jpg");
  });

  it("calls getImage with correct arguments", () => {
    const product = { images: [] };

    getHeroImage(product);

    // Ensure getImage is called for all expected sizes
    expect(getImage).toHaveBeenCalledWith(product, "xl");
    expect(getImage).toHaveBeenCalledWith(product, "desktop");
    expect(getImage).toHaveBeenCalledWith(product, "tablet");
    expect(getImage).toHaveBeenCalledWith(product, "mobile");
  });

  it("returns first image as fallback when available", () => {
    const product = {
      images: [{ path: "first.jpg" }],
    };

    // getImage returns null so fallback logic is triggered
    getImage.mockReturnValue(null);

    const result = getHeroImage(product);

    expect(result.fallback).toBe("first.jpg");
  });

  it("returns placeholder fallback when no images exist", () => {
    const product = { images: [] };

    getImage.mockReturnValue(null);

    const result = getHeroImage(product);

    // Should fall back to default placeholder
    expect(result.fallback).toBe("/placeholder.jpg");
  });

  it("handles undefined product gracefully", () => {
    getImage.mockReturnValue(null);

    const result = getHeroImage(undefined);

    // All sizes should be null and fallback should be placeholder
    expect(result.xl).toBeNull();
    expect(result.desktop).toBeNull();
    expect(result.tablet).toBeNull();
    expect(result.mobile).toBeNull();
    expect(result.fallback).toBe("/placeholder.jpg");
  });
});
