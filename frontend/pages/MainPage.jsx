import React, { useEffect, useRef, useState, Suspense } from "react";
import MovieCarousel from "../components/MovieCarousel";
import { useProducts } from "../hooks/useProducts";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const LazyHero = React.lazy(() => import("../components/MainHeroSlider"));

export default function MainPage() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";

  const { products, loading, error } = useProducts({ search, category });

  const categories = useMemo(() => {
    const groups = {};
    products.forEach((movie) => {
      movie.categories?.forEach((cat) => {
        if (!groups[cat.name]) groups[cat.name] = [];
        groups[cat.name].push(movie);
      });
    });
    return groups;
  }, [products]);

  const heroRef = useRef(null);
  const [loadHero, setLoadHero] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadHero(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
  }, []);

  // LOADING / ERROR / SEARCH — bez zmian...

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden pb-40">

      <div ref={heroRef}>
        {loadHero ? (
          <Suspense fallback={<div className="h-[60vh] bg-black/40 animate-pulse" />}>
            <LazyHero />
          </Suspense>
        ) : (
          <div className="h-[60vh] bg-black/40 animate-pulse" />
        )}
      </div>

      <div className="w-full space-y-10 mt-10">
        {Object.entries(categories).map(([catName, movies]) => (
          <MovieCarousel key={catName} title={catName} movies={movies} />
        ))}
      </div>
    </div>
  );
}
