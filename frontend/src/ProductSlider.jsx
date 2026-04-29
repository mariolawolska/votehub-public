import React, { useEffect, useRef, useState, Suspense } from "react";
import VenomBanner from "../components/VenomBanner";

const LazySlider = React.lazy(() => import("../components/SliderComponent"));

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const [loadSlider, setLoadSlider] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadSlider(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) observer.observe(sliderRef.current);
  }, []);

  return (
    <div className="w-full bg-cover bg-center pb-10 bg-gray-100">
      {/* HEADER */}
      <div className="relative w-full text-white overflow-hidden">
        <div className="absolute inset-0 z-0 h-full">
          <VenomBanner height="h-full" />
        </div>

        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm"></div>

        <div className="relative z-20 h-full w-full flex items-end px-6 py-10">
          <div className="w-full text-center">
            <h2 className="hidden md:block text-4xl md:text-5xl font-bold uppercase tracking-wide drop-shadow-lg mb-4">
              Movie Category
            </h2>

            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-3 mt-6 ">
              <ul className="flex items-center justify-center gap-2 text-sm">
                <li>
                  <a href="/" className="hover:text-[var(--primary)] transition-colors">
                    Home
                  </a>
                </li>
                <li className="opacity-70">›</li>
                <li className="text-[var(--primary)] font-semibold">
                  Movie Category
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDER */}
      <div ref={sliderRef} className="container mx-auto bg-gray-100">
        <h2 className="movie-heading flex items-center justify-center uppercase text-4xl my-10 relative">
          Coming soon
        </h2>

        {loadSlider ? (
          <Suspense fallback={<div className="text-center py-20">Loading…</div>}>
            <LazySlider />
          </Suspense>
        ) : (
          <div className="text-center py-20 opacity-50">Loading…</div>
        )}
      </div>
    </div>
  );
}
