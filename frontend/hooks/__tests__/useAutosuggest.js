import { useEffect, useState } from "react";

export function useAutosuggest(products, query) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const term = query.toLowerCase();

    const filtered = products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      )
      .slice(0, 6);

    setSuggestions(filtered);
  }, [query, products]);

  return suggestions;
}
