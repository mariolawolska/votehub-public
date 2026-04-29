import { useMemo } from "react";

export function useProductCategories(products) {
  return useMemo(() => {
    if (!Array.isArray(products)) return [];

    const all = products.flatMap((p) => p.categories || []);

    // Ensure unique categories by slug
    const unique = [];
    const seen = new Set();

    for (const cat of all) {
      if (!cat || !cat.slug) continue;

      if (!seen.has(cat.slug)) {
        seen.add(cat.slug);
        unique.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        });
      }
    }

    return unique;
  }, [products]);
}
