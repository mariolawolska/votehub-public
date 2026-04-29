/**
 * Unit tests for the useVoteStatus custom hook.
 *
 * This suite verifies:
 * - initial vote status loading via `/vote/check`
 * - correct state updates when the API returns a valid response
 * - fallback to false when the API request fails
 * - safe behavior when productId is missing or undefined
 *
 * axios is fully mocked to isolate hook logic and prevent
 * real network requests.
 */

import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useVoteStatus } from "../hooks/useVoteStatus";

jest.mock("axios");

describe("useVoteStatus hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not call API when productId is missing", () => {
    renderHook(() => useVoteStatus(undefined));
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("loads vote status from API", async () => {
    axios.get.mockResolvedValueOnce({ data: { voted: true } });

    const { result } = renderHook(() => useVoteStatus(10));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(axios.get).toHaveBeenCalledWith("/products/10/vote/check");
  });

  it("sets voted=false when API returns voted=false", async () => {
    axios.get.mockResolvedValueOnce({ data: { voted: false } });

    const { result } = renderHook(() => useVoteStatus(5));

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("sets voted=false when API request fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useVoteStatus(7));

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
