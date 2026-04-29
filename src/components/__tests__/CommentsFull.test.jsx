/**
 * Unit tests for the CommentsFull component.
 *
 * This suite verifies:
 * - loading state rendering
 * - showing only 5 comments by default
 * - expanding to show all comments
 * - blocking comment form for logged-out users
 * - blocking comment form when user already commented
 * - navigating to login when unauthenticated user submits
 * - adding a comment when allowed
 * - clearing textarea after successful submit
 *
 * useAuth, useComments, useNavigate, and useLocation are mocked
 * to isolate component behavior.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentsFull from "../components/CommentsFull";
import { useAuth } from "../context/AuthContext";
import { useComments } from "../hooks/useComments";
import { useNavigate, useLocation } from "react-router-dom";

jest.mock("../context/AuthContext");
jest.mock("../hooks/useComments");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("CommentsFull component", () => {
  const mockNavigate = jest.fn();
  const mockAddComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: "/movie/1" });
  });

  const mockComments = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    body: `Comment ${i + 1}`,
    created_at: "2024-01-01T12:00:00Z",
    user: { name: `User${i + 1}` },
  }));

  it("shows loading state", () => {
    useAuth.mockReturnValue({ user: null });
    useComments.mockReturnValue({
      comments: [],
      loading: true,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  it("shows only 5 comments by default", () => {
    useAuth.mockReturnValue({ user: null });
    useComments.mockReturnValue({
      comments: mockComments,
      loading: false,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    expect(screen.getAllByText(/Comment/).length).toBe(5);
  });

  it("expands to show all comments", async () => {
    useAuth.mockReturnValue({ user: null });
    useComments.mockReturnValue({
      comments: mockComments,
      loading: false,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    await userEvent.click(
      screen.getByText(`Show all comments (${mockComments.length})`)
    );

    expect(screen.getAllByText(/Comment/).length).toBe(8);
  });

  it("blocks comment form for logged-out users", () => {
    useAuth.mockReturnValue({ user: null });
    useComments.mockReturnValue({
      comments: [],
      loading: false,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    expect(screen.getByText("You must be logged in to post a comment.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add comment" })).toBeDisabled();
  });

  it("navigates to login when unauthenticated user submits", async () => {
    useAuth.mockReturnValue({ user: null });
    useComments.mockReturnValue({
      comments: [],
      loading: false,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    const textarea = screen.getByPlaceholderText("Write your comment...");
    await userEvent.type(textarea, "Hello!");

    fireEvent.submit(textarea.closest("form"));

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { from: "/movie/1" },
    });
  });

  it("blocks commenting if user already commented", () => {
    useAuth.mockReturnValue({ user: { name: "User1" } });
    useComments.mockReturnValue({
      comments: mockComments,
      loading: false,
      addComment: mockAddComment,
    });

    render(<CommentsFull productId={1} />);

    expect(
      screen.getByText("You have already posted a comment for this movie.")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add comment" })).toBeDisabled();
  });

  it("adds a comment when allowed", async () => {
    useAuth.mockReturnValue({ user: { name: "NewUser" } });
    useComments.mockReturnValue({
      comments: mockComments,
      loading: false,
      addComment: mockAddComment.mockResolvedValueOnce(),
    });

    render(<CommentsFull productId={1} />);

    const textarea = screen.getByPlaceholderText("Write your comment...");
    await userEvent.type(textarea, "Great movie!");

    fireEvent.submit(textarea.closest("form"));

    expect(mockAddComment).toHaveBeenCalledWith("Great movie!");
    expect(textarea.value).toBe("");
  });
});
