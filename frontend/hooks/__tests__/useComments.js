import { useEffect, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export function useComments(productId, user) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments
  useEffect(() => {
    if (!productId) return;

    setLoading(true);

    axiosClient
      .get(`/products/${productId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.log("COMMENTS ERROR:", err.response))
      .finally(() => setLoading(false));
  }, [productId]);

  // Add comment
 const addComment = useCallback(
  async (content) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    const res = await axiosClient.post(
      `/products/${productId}/comments`,
      {
        content,
        user_id: user.id,
        product_id: productId,
      }
    );

    const newComment = {
      id: res.data.id,
      body: res.data.content,
      user: { name: user.name },
      created_at: res.data.created_at,
    };

    setComments((prev) => [newComment, ...prev]);
  },
  [productId, user]
);


  return { comments, loading, addComment };
}
