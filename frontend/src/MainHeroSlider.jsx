import { useState, useMemo, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import { useHeroSlides } from "../hooks/useHeroSlides";
import { getHeroImage } from "../utils/getHeroImage";
import ResponsiveImage from "./ResponsiveImage";

export default function MainHeroSlider() {
  const { slides, loading } = useHeroSlides();
  const [activeIndex, setActiveIndex] = useState(0);

  //  Lazy-load Swiper CSS 
  useEffect(() => {
    import("swiper/css");
    import("swiper/css/effect-fade");
  }, []);

  // Lazy-load 
  const [loadRest, setLoadRest] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(() => setLoadRest(true));
  }, []);

  const promoTexts = useMemo(
    () => [
      "Shape the rankings",
      "Vote for favorites",
      "Discover trending films",
      "Join movie fans",
      "Decide what’s next",
    ],
    [],
  );

  const currentPromo = promoTexts[activeIndex % promoTexts.length];

  if (loading) {
    return (
      <div className="w-full h-[60vh] bg-black/40 animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden mb-30">
      {/* MOBILE PROMO TEXT */}
      <div className="max-md:block hidden absolute bottom-0 left-0 right-0 z-50 overflow-hidden h-[60px] mt-6">
        <div
          className={`
            absolute inset-0 flex items-center
            text-white text-3xl font-bold px-6
            bg-gradient-to-t from-black/90 via-black/60 to-black/20
            backdrop-blur-md whitespace-nowrap
            transform transition-transform duration-700 ease-out
            ${activeIndex % 2 === 0 ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {currentPromo}
        </div>

        <div
          className={`
            absolute inset-0 flex items-center
            text-white text-3xl font-bold px-6
            bg-gradient-to-t from-black/90 via-black/60 to-black/20
            backdrop-blur-md whitespace-nowrap
            transform transition-transform duration-700 ease-out
            ${activeIndex % 2 === 0 ? "translate-x-full" : "translate-x-0"}
          `}
        >
          {promoTexts[(activeIndex + 1) % promoTexts.length]}
        </div>
      </div>

      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop={slides.length > 1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((product, index) => {
          const { xl, desktop, tablet, mobile, fallback } =
            getHeroImage(product);
          const isActive = activeIndex === index;

          // 🔥 Lazy-load reszty slajdów po idle
          if (index > 0 && !loadRest) {
            return (
              <SwiperSlide key={product.id}>
                <div className="absolute inset-0 bg-black/40 animate-pulse" />
              </SwiperSlide>
            );
          }

          return (
            <SwiperSlide key={product.id} className="relative">
              <div className="relative w-full h-full">
                {/* DESKTOP PROMO TEXT */}
                <div
                  className={`
                    absolute inset-0 flex flex-col justify-between items-end
                    pr-20 py-10 text-white/95 font-extrabold tracking-widest
                    text-xl md:text-8xl lg:text-[12rem] leading-none
                    transition-opacity duration-700 delay-150 pointer-events-none
                    ${isActive ? "opacity-100" : "opacity-0"}
                    max-md:hidden
                  `}
                >
                  {currentPromo.split(" ").map((word, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {word}
                    </div>
                  ))}
                </div>

                {/* HERO IMAGE */}
                <ResponsiveImage
                  images={{
                    xl,
                    desktop,
                    tablet,
                    mobile,
                    thumb: fallback,
                  }}
                  alt={product.title}
                  priority={index === 0}
                  className="
    absolute inset-0 w-full h-full object-cover 
    scale-110 opacity-70
    transition-transform duration-[6000ms]
    swiper-slide-active:scale-100
  "
                />

                {/* GRADIENTS */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black/95"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>

                {/* TEXT CONTENT */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 z-20 max-w-3xl">
                  <p
                    className={`
                      text-[var(--primary)] font-semibold tracking-widest uppercase
                      transition-all duration-700
                      ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    `}
                  >
                    Now Trending Worldwide
                  </p>

                  <h2
                    className={`
                      text-white font-extrabold text-4xl sm:text-5xl md:text-7xl
                      drop-shadow-2xl leading-tight transition-all duration-700
                      ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                  >
                    {product.title}
                  </h2>

                  <p
                    className={`
                      text-gray-300 max-w-xl mt-4 text-lg leading-relaxed
                      transition-all duration-700 delay-100
                      ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                  >
                    {product.description?.slice(0, 140)}...
                  </p>

                  <div
                    className={`
                      flex items-center gap-4 mt-8 transition-all duration-700 delay-200
                      ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                  >
                    <button
                      onClick={() =>
                        (window.location.href = `/product/${product.id}`)
                      }
                      className="
                        px-10 py-3 rounded-lg text-white font-bold
                        bg-[var(--primary)] shadow-[0_0_20px_rgba(255,0,0,0.5)]
                        hover:bg-red-700 hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
                        transition-all duration-300
                      "
                    >
                      ⭐ Vote Now
                    </button>

                    {product.trailerUrl && (
                      <button
                        onClick={() =>
                          window.open(product.trailerUrl, "_blank")
                        }
                        className="
                          px-8 py-3 rounded-lg text-white font-semibold
                          bg-white/20 backdrop-blur border border-white/30
                          hover:bg-white/30 transition-all duration-300
                        "
                      >
                        🎬 Watch Trailer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
