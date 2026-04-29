import { useProductSidebar } from "../hooks/useProductSidebar";

export default function ProductSidebar({
  products,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) {
  const { localSearch, setLocalSearch, categories } = useProductSidebar(
    products,
    searchTerm,
    onSearchChange
  );

  return (
    <div className="space-y-8 sticky top-6 h-fit">
      
      {/* SEARCH INPUT */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="
            w-full border p-2 pl-10 rounded
            focus:border-[var(--primary)]
            transition-all duration-300
          "
        />

        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.15-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          />
        </svg>
      </div>

      {/* CATEGORY LIST */}
      <div>
        <h2 className="movie-heading relative uppercase text-black text-2xl pt-8 mb-4 w-fit text-left">
          Browse Categories
        </h2>

        <ul className="space-y-2">
          {Object.entries(categories).map(([name, count]) => (
            <li
              key={name}
              onClick={() => onCategoryChange(name)}
              className={`
                flex justify-between items-center cursor-pointer p-2 rounded border
                transition
                ${
                  selectedCategory === name
                    ? "bg-primary text-white border-black-700"
                    : "bg-white hover:bg-gray-100 border-gray-300"
                }
              `}
            >
              <span>{name}</span>
              <span className="text-sm opacity-80">{count}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
