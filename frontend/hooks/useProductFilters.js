
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useProductFilters(products) {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("votes_desc");
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleCount, setVisibleCount] = useState(12);
  const LOAD_STEP = 12;

  const [params] = useSearchParams();

  // --- URL → only SEARCH (witout categorii) ---
  useEffect(() => {
    const urlSearch = params.get("search") || "";
    setSearchQuery(urlSearch);
  }, [params]);

  // --- FILTERING + SEARCH + SORTING ---
  const processedProducts = useMemo(() => {
    let list = [...products];

    // CATEGORY FILTER (by NAME, status only)
    if (selectedCategory !== "All") {
      list = list.filter((product) =>
        product.categories?.some((cat) => cat.name === selectedCategory)
      );
    }

    // SEARCH
    if (searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    // SORTING
    if (sortOption === "votes_desc") list.sort((a, b) => b.votes - a.votes);
    if (sortOption === "votes_asc") list.sort((a, b) => a.votes - b.votes);
    if (sortOption === "name_asc")
      list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortOption === "name_desc")
      list.sort((a, b) => b.title.localeCompare(a.title));
    if (sortOption === "newest")
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortOption === "oldest")
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (sortOption === "popularity") {
      list.sort((a, b) => {
        const ageA = (Date.now() - new Date(a.created_at)) / 3600000;
        const ageB = (Date.now() - new Date(b.created_at)) / 3600000;
        return b.votes / (ageB + 1) - a.votes / (ageA + 1);
      });
    }

    return list;
  }, [products, selectedCategory, sortOption, searchQuery]);

  const visibleProducts = processedProducts.slice(0, visibleCount);

  const resetVisible = () => setVisibleCount(12);

  return {
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    visibleProducts,
    processedProducts,
    visibleCount,
    setVisibleCount,
    LOAD_STEP,
    resetVisible,
  };
}
