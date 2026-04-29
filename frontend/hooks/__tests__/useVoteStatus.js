import { useEffect, useState } from "react";
import axios from "axios";

export function useVoteStatus(productId) {
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!productId) return;

    axios
      .get(`/products/${productId}/vote/check`)
      .then((res) => setVoted(res.data.voted))
      .catch(() => setVoted(false));
  }, [productId]);

  return voted;
}
