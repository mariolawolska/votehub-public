/**
 * Unit tests for the ResponsiveImage component.
 *
 * This suite verifies:
 * - correct rendering of <picture> and <img> elements
 * - responsive <source> tags for XL and Desktop/Tablet breakpoints
 * - fallback logic when certain image sizes are missing
 * - correct loading behavior (lazy/eager) and fetchpriority handling
 * - proper application of className and alt attributes
 *
 * These tests ensure that the component behaves consistently across
 * different device sizes, supports performance‑optimized loading,
 * and maintains accessibility and styling requirements.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ResponsiveImage from "../ResponsiveImage";

describe("ResponsiveImage component", () => {
  const images = {
    xl: "xl.jpg",
    desktop: "desktop.jpg",
    tablet: "tablet.jpg",
    mobile: "mobile.jpg",
    thumb: "thumb.jpg",
  };

  it("renders <picture> element", () => {
    render(<ResponsiveImage images={images} alt="Test image" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders correct <source> tags for XL and Desktop/Tablet", () => {
    render(<ResponsiveImage images={images} alt="Test image" />);

    // XL source
    const xlSource = screen.getByTestId("xl-source");
    expect(xlSource).toHaveAttribute("media", "(min-width: 1024px)");
    expect(xlSource).toHaveAttribute("srcset", "xl.jpg");

    // Desktop/Tablet source
    const desktopSource = screen.getByTestId("desktop-source");
    expect(desktopSource).toHaveAttribute("media", "(min-width: 640px)");
    expect(desktopSource).toHaveAttribute("srcset", "desktop.jpg");
  });

  it("uses mobile image as <img> src", () => {
    render(<ResponsiveImage images={images} alt="Test image" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "mobile.jpg");
  });

  it("falls back correctly when mobile is missing", () => {
    const partialImages = {
      desktop: "desktop.jpg",
      tablet: "tablet.jpg",
    };

    render(<ResponsiveImage images={partialImages} alt="Fallback test" />);
    const img = screen.getByRole("img");

    // Should fall back to tablet → desktop → xl
    expect(img).toHaveAttribute("src", "tablet.jpg");
  });

  it("sets loading='eager' and fetchpriority='high' when priority=true", () => {
    render(<ResponsiveImage images={images} alt="Priority test" priority />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("sets loading='lazy' and fetchpriority='auto' when priority=false", () => {
    render(<ResponsiveImage images={images} alt="Lazy test" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("fetchpriority", "auto");
  });

  it("applies className to <img>", () => {
    render(
      <ResponsiveImage
        images={images}
        alt="Styled image"
        className="rounded shadow"
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveClass("rounded shadow");
  });

  it("renders alt text correctly", () => {
    render(<ResponsiveImage images={images} alt="Custom alt text" />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Custom alt text");
  });
});
