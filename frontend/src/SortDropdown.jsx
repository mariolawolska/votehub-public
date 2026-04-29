import { useState, useCallback } from "react";

// Sorting options defined outside the component
// so they are not recreated on every render.
const SORT_OPTIONS = [
  { value: "votes_desc", label: "Most votes" },
  { value: "votes_asc", label: "Fewest votes" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popularity", label: "Popularity (votes / time)" },
];

export default function SortDropdown({ sortOption, setSortOption, resetVisible }) {
  const [open, setOpen] = useState(false);

  // Find currently selected option
  const selected = SORT_OPTIONS.find(o => o.value === sortOption);

  /**
   * Handles selecting a new sorting option:
   * - updates sorting
   * - resets pagination
   * - closes dropdown
   */
  const handleSelect = useCallback(
    (value) => {
      setSortOption(value);
      resetVisible();
      setOpen(false);
    },
    [setSortOption, resetVisible]
  );

  return (
    <div className="relative w-48">
      {/* Dropdown trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="
          w-full px-4 py-2 rounded-lg text-sm font-medium
          bg-white text-gray-700 border border-gray-300
          hover:border-[var(--primary)] hover:text-[var(--primary)]
          transition-all duration-300 flex justify-between items-center
        "
      >
        {selected?.label || "Sort"}

        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
          {SORT_OPTIONS.map(opt => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                px-4 py-2 text-sm cursor-pointer transition
                ${
                  opt.value === sortOption
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
