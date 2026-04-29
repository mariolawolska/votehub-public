import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useProducts({ search = "", category = "All Categories" } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const params = {};

    if (search.trim()) params.search = search.trim();
    if (category && category !== "All Categories") params.category = category;

    axiosClient
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [search, category]);

  return { products, loading, error, setProducts };
}
