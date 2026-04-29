/**
 * Unit tests for the SearchBar component.
 *
 * This suite verifies:
 * - autosuggest filtering based on movie titles and descriptions
 * - limiting suggestions to 6 results
 * - opening and closing the dropdown correctly
 * - closing the dropdown when clicking outside the component
 * - navigating to the search results page on submit
 * - navigating to a movie page when selecting a suggestion
 *
 * useNavigate is mocked to isolate navigation behavior.
 * DOM events (mousedown) are simulated to test click‑outside logic.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("SearchBar component", () => {
  const movies = [
    {
      id: 1,
      title: "Inception",
      description: "A mind-bending thriller",
      productImageThumbnailUrl: "/img/inception.jpg",
    },
    {
      id: 2,
      title: "Interstellar",
      description: "Space exploration epic",
      productImageThumbnailUrl: "/img/interstellar.jpg",
    },
    {
      id: 3,
      title: "The Dark Knight",
      description: "Batman faces the Joker",
      productImageThumbnailUrl: "/img/darkknight.jpg",
    },
  ];

  const mockNavigate = jest.fn();
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it("renders input field", () => {
    render(<SearchBar products={movies} />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  it("shows suggestions when typing", async () => {
    render(<SearchBar products={movies} />);

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "in");

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  it("filters suggestions case-insensitively", async () => {
    render(<SearchBar products={movies} />);

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "BAT");

    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
  });

  it("limits suggestions to 6 items", async () => {
    const manyMovies = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      title: `Movie ${i}`,
      description: "Test",
      productImageThumbnailUrl: "/img/test.jpg",
    }));

    render(<SearchBar products={manyMovies} />);

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "movie");

    const items = screen.getAllByText(/Movie/);
    expect(items.length).toBe(6);
  });

  it("navigates to search results on submit", async () => {
    render(<SearchBar products={movies} />);

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "inception");

    fireEvent.submit(input.closest("form"));

    expect(mockNavigate).toHaveBeenCalledWith("/?search=inception");
  });

  it("navigates to movie page when clicking suggestion", async () => {
    render(<SearchBar products={movies} />);

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "in");

    const suggestion = screen.getByText("Inception");
    await userEvent.click(suggestion);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <div>
        <SearchBar products={movies} />
        <button data-testid="outside">Outside</button>
      </div>
    );

    const input = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(input, "in");

    expect(screen.getByText("Inception")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.queryByText("Inception")).not.toBeInTheDocument();
  });
});
