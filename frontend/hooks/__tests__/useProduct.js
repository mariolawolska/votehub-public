import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    axiosClient
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, setProduct, loading, error };
}
