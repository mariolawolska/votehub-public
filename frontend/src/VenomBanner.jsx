import venomMobile from "../assets/images/venom-mobile.webp";
import venomTablet from "../assets/images/venom-tablet.webp";
import venomDesktop from "../assets/images/venom-desktop.webp";

export const venomAssets = {
  mobile: venomMobile,
  tablet: venomTablet,
  desktop: venomDesktop,
};

export default function VenomBanner({ height = "h-full" }) {
  return (
    <div className={`relative ${height} w-full overflow-hidden`}>
      <picture>
        {/* Desktop */}
        <source
          media="(min-width: 1024px)"
          srcSet={venomDesktop}
          sizes="100vw"
        />

        {/* Tablet */}
        <source
          media="(min-width: 640px)"
          srcSet={venomTablet}
          sizes="100vw"
        />

        {/* Mobile */}
        <source
          media="(max-width: 480px)"
          srcSet={venomMobile}
          sizes="100vw"
        />

        <img
          src={venomMobile}
          alt="Venom background"
          width="1920"
          height="1080"
          sizes="100vw"
          fetchpriority="high"
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover"
        />
      </picture>
    </div>
  );
}
