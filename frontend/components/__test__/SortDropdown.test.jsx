/**
 * Unit tests for the SortDropdown component.
 *
 * This suite verifies:
 * - opening and closing the dropdown menu
 * - rendering all sorting options
 * - highlighting the currently selected option
 * - calling setSortOption with the correct value
 * - calling resetVisible when a new option is selected
 * - closing the dropdown after selection
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortDropdown from "../components/SortDropdown";

describe("SortDropdown component", () => {
  const mockSetSortOption = jest.fn();
  const mockResetVisible = jest.fn();

  beforeEach(() => {
    mockSetSortOption.mockClear();
    mockResetVisible.mockClear();
  });

  it("renders the trigger button with the selected label", () => {
    render(
      <SortDropdown
        sortOption="name_asc"
        setSortOption={mockSetSortOption}
        resetVisible={mockResetVisible}
      />
    );

    expect(screen.getByText("Name A–Z")).toBeInTheDocument();
  });

  it("opens the dropdown when clicking the trigger", async () => {
    render(
      <SortDropdown
        sortOption="votes_desc"
        setSortOption={mockSetSortOption}
        resetVisible={mockResetVisible}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Fewest votes")).toBeInTheDocument();
    expect(screen.getByText("Name A–Z")).toBeInTheDocument();
    expect(screen.getByText("Popularity (votes / time)")).toBeInTheDocument();
  });

  it("highlights the currently selected option", async () => {
    render(
      <SortDropdown
        sortOption="newest"
        setSortOption={mockSetSortOption}
        resetVisible={mockResetVisible}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    const selected = screen.getByText("Newest");

    // BEZ REGEXÓW — bezpieczne i stabilne
    expect(selected.className.includes("bg-[var(--primary)]")).toBe(true);
  });

  it("calls setSortOption and resetVisible when selecting an option", async () => {
    render(
      <SortDropdown
        sortOption="votes_desc"
        setSortOption={mockSetSortOption}
        resetVisible={mockResetVisible}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    const option = screen.getByText("Name A–Z");
    await userEvent.click(option);

    expect(mockSetSortOption).toHaveBeenCalledWith("name_asc");
    expect(mockResetVisible).toHaveBeenCalled();
  });

  it("closes the dropdown after selecting an option", async () => {
    render(
      <SortDropdown
        sortOption="votes_desc"
        setSortOption={mockSetSortOption}
        resetVisible={mockResetVisible}
      />
    );

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Name A–Z")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Name A–Z"));

    expect(screen.queryByText("Name A–Z")).not.toBeInTheDocument();
  });
});
