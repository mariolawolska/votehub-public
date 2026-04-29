/**
 * Unit tests for the useVote custom hook.
 *
 * This suite verifies:
 * - initial vote state loading via API (`/vote/check`)
 * - correct handling of successful vote submissions
 * - updating local state when a vote is cast
 * - optional external state updates via the updateState callback
 * - proper handling of "already voted" errors
 * - safe behavior when productId is missing or undefined
 *
 * axiosClient and voteForProduct are fully mocked to isolate hook logic
 * and prevent real network requests.
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import axiosClient from "../api/axiosClient";
import { voteForProduct } from "../services/voteService";
import { useVote } from "../hooks/useVote";

jest.mock("../api/axiosClient");
jest.mock("../services/voteService");

describe("useVote hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not call API when productId is missing", () => {
    renderHook(() => useVote(undefined));
    expect(axiosClient.get).not.toHaveBeenCalled();
  });

  it("loads initial vote state from API", async () => {
    axiosClient.get.mockResolvedValueOnce({ data: { hasVoted: true } });

    const { result } = renderHook(() => useVote(10));

    await waitFor(() => {
      expect(result.current.hasVoted).toBe(true);
    });

    expect(axiosClient.get).toHaveBeenCalledWith("/products/10/vote/check");
  });

  it("sets hasVoted=false when API check fails", async () => {
    axiosClient.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useVote(5));

    await waitFor(() => {
      expect(result.current.hasVoted).toBe(false);
    });
  });

  it("successfully votes and sets hasVoted=true", async () => {
    voteForProduct.mockResolvedValueOnce();

    const { result } = renderHook(() => useVote(7));

    await act(async () => {
      await result.current.vote();
    });

    expect(voteForProduct).toHaveBeenCalledWith(7);
    expect(result.current.hasVoted).toBe(true);
  });

  it("updates external state when updateState callback is provided", async () => {
    voteForProduct.mockResolvedValueOnce();

    const mockUpdateState = jest.fn((fn) =>
      fn([{ id: 3, votes: 1 }])
    );

    const { result } = renderHook(() => useVote(3));

    await act(async () => {
      await result.current.vote(mockUpdateState);
    });

    expect(mockUpdateState).toHaveBeenCalled();
    expect(result.current.hasVoted).toBe(true);
  });

  it('handles "already voted" error by setting hasVoted=true', async () => {
    voteForProduct.mockRejectedValueOnce(
      new Error("You can only vote once")
    );

    const { result } = renderHook(() => useVote(9));

    await act(async () => {
      await result.current.vote();
    });

    expect(result.current.hasVoted).toBe(true);
  });

  it("logs unexpected errors but does not set hasVoted", async () => {
    const error = new Error("Unexpected error");
    voteForProduct.mockRejectedValueOnce(error);

    console.error = jest.fn();

    const { result } = renderHook(() => useVote(12));

    await act(async () => {
      await result.current.vote();
    });

    expect(console.error).toHaveBeenCalledWith(error);
    expect(result.current.hasVoted).toBe(false);
  });
});
