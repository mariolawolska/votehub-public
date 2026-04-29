/**
 * Unit tests for the getImage utility function.
 *
 * This suite verifies:
 * - safe handling of undefined or malformed product objects
 * - correct lookup of images by type
 * - preference of full_url when provided by the backend
 * - construction of absolute URLs when path starts with '/'
 * - returning absolute paths unchanged when already fully qualified
 * - graceful fallback to null when neither path nor full_url exists
 *
 * These tests ensure that getImage reliably resolves image URLs
 * regardless of backend formatting differences, missing fields,
 * or inconsistent product data structures.
 */

import { getImage } from "../getImage";

describe("getImage()", () => {
  it("returns null when product is undefined", () => {
    // No product → should safely return null
    expect(getImage(undefined, "xl")).toBeNull();
  });

  it("returns null when product has no images array", () => {
    const product = {};
    expect(getImage(product, "xl")).toBeNull();
  });

  it("returns null when no image of given type exists", () => {
    const product = {
      images: [{ type: "mobile", path: "/mobile.jpg" }],
    };

    expect(getImage(product, "xl")).toBeNull();
  });

  it("returns full_url when backend provides it", () => {
    const product = {
      images: [{ type: "xl", full_url: "https://cdn.com/xl.jpg" }],
    };

    // Should prefer full_url over path
    expect(getImage(product, "xl")).toBe("https://cdn.com/xl.jpg");
  });

  it("builds full URL when path starts with '/'", () => {
    const product = {
      images: [{ type: "desktop", path: "/images/desktop.jpg" }],
    };

    // Should prepend domain to relative path
    expect(getImage(product, "desktop")).toBe(
      "https://node.marbar.co.uk/images/desktop.jpg"
    );
  });

  it("returns path as-is when it is already absolute", () => {
    const product = {
      images: [{ type: "tablet", path: "https://cdn.com/tablet.jpg" }],
    };

    // Should not modify absolute URLs
    expect(getImage(product, "tablet")).toBe("https://cdn.com/tablet.jpg");
  });

  it("handles missing path and full_url gracefully", () => {
    const product = {
      images: [{ type: "mobile" }],
    };

    // No path or full_url → should return null
    expect(getImage(product, "mobile")).toBeNull();
  });
});
