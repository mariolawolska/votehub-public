import React from "react";

export default function ResponsiveImage({
  images = {},
  alt = "",
  className = "",
  priority = false,
}) {
  const xl = images.xl || null;
  const desktop = images.desktop || null;
  const tablet = images.tablet || null;
  const mobile = images.mobile || null;
  const fallback = images.thumb || mobile || tablet || desktop || xl;

  return (
    <picture>
      {/* XL */}
      {xl && (
        <source
          data-testid="xl-source"
          media="(min-width: 1024px)"
          srcSet={xl}
          sizes="100vw"
        />
      )}

      {/* Desktop / Tablet */}
      {(desktop || tablet) && (
        <source
          data-testid="desktop-source"
          media="(min-width: 640px)"
          srcSet={desktop || tablet}
          sizes="100vw"
        />
      )}

      {/* Mobile fallback */}
      <img
        src={mobile || tablet || desktop || xl}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
