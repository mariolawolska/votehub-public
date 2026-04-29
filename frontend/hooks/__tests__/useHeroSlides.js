import { useEffect, useState } from "react";

export function useHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://laravel.marbar.co.uk/api/products/hero")
      .then((res) => res.json())
      .then((data) => setSlides(data.products || []))
      .catch((err) => console.log("HERO SLIDER ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading };
}
