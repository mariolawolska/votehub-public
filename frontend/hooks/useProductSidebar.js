import { useEffect, useMemo, useState } from "react";

/**
 * Custom hook that encapsulates all sidebar logic:
 * - debounced search input
 * - category counting
 * - local search state management
 */
export function useProductSidebar(products, searchTerm, onSearchChange) {
  // Local search state used for debouncing
  const [localSearch, setLocalSearch] = useState(searchTerm);

  /**
   * Debounce search input by 200ms
   * This prevents excessive filtering and improves performance.
   */
  useEffect(() => {
  const timeout = setTimeout(() => {
    // Only update parent when user actually typed something
    if (localSearch !== searchTerm) {
      onSearchChange(localSearch);
    }
  }, 200);

  return () => clearTimeout(timeout);
}, [localSearch]);

  /**
   * Count how many products belong to each category.
   * Memoized for performance — recalculates only when products change.
   */
  const categories = useMemo(() => {
    const map = { All: products.length };

    products.forEach((p) => {
      p.categories?.forEach((cat) => {
        if (!map[cat.name]) map[cat.name] = 0;
        map[cat.name]++;
      });
    });

    return map;
  }, [products]);

  return {
    localSearch,
    setLocalSearch,
    categories,
  };
}
