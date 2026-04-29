import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { voteForProduct } from "../services/voteService";

export function useVote(productId) {
  const [hasVoted, setHasVoted] = useState(false);

  // check at the start whether the user has voted
  useEffect(() => {
    if (!productId) return;

    axiosClient
      .get(`/products/${productId}/vote/check`)
      .then(res => setHasVoted(res.data.hasVoted))
      .catch(() => setHasVoted(false));
  }, [productId]);

  const vote = async (updateState) => {
    try {
      await voteForProduct(productId);

      if (updateState) {
        updateState(prev =>
          prev.map(p =>
            p.id === productId ? { ...p, votes: p.votes + 1 } : p
          )
        );
      }

      setHasVoted(true);
    } catch (err) {
      if (err.message.includes("once")) {
        setHasVoted(true);
      } else {
        console.error(err);
      }
    }
  };

  return { vote, hasVoted };
}
