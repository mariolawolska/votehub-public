import { useSearchParams } from "react-router-dom";
import ProductSlider from "../components/ProductSlider";
import ProductSidebar from "../components/ProductSidebar";
import ProductGrid from "../components/ProductGrid";
import ProductList from "../components/ProductList";
import SortDropdown from "../components/SortDropdown";
import { useProductFilters } from "../hooks/useProductFilters";

export default function ProductCategoryPage({ products, handleVote, user }) {
  const {
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    visibleProducts,
    processedProducts,
    visibleCount,
    setVisibleCount,
    LOAD_STEP,
    resetVisible,
  } = useProductFilters(products);

  const [params, setParams] = useSearchParams();

  return (
    <div className="w-full">
      <ProductSlider />

      <div className="container mx-auto mt-10 grid grid-cols-12 gap-6 p-[15px] md:p-0">
        {/* SIDEBAR */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <ProductSidebar
            products={products}
            selectedCategory={selectedCategory}
            searchTerm={searchQuery}
            onCategoryChange={(catName) => {
              setSelectedCategory(catName);
              setSearchQuery(""); // zmiana kategorii czyści search

              const next = new URLSearchParams(params);
              next.delete("search"); // usuwamy search z URL
              setParams(next);

              resetVisible();
            }}
            onSearchChange={(value) => {
              setSearchQuery(value);

              const next = new URLSearchParams(params);
              if (value.trim()) {
                next.set("search", value.trim());
              } else {
                next.delete("search");
              }
              setParams(next);

              resetVisible();
            }}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
          {/* SORTING + VIEW MODE */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                {/* GRID BUTTON */}
                <button
                  onClick={() => setViewMode("grid")}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border 
                    transition-all duration-300 text-sm font-medium
                    ${
                      viewMode === "grid"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-[0_0_10px_var(--primary)]"
                        : "bg-white text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }
                  `}
                >
                  Grid
                </button>

                {/* LIST BUTTON */}
                <button
                  onClick={() => setViewMode("list")}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border 
                    transition-all duration-300 text-sm font-medium
                    ${
                      viewMode === "list"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-[0_0_10px_var(--primary)]"
                        : "bg-white text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }
                  `}
                >
                  List
                </button>
              </div>
            </div>

            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
              resetVisible={resetVisible}
            />
          </div>

          {/* HEADING */}
          <h2 className="movie-heading relative uppercase text-black text-3xl pt-8 mb-4 w-fit text-left">
            Our Top Movies
          </h2>

          {/* GRID / LIST VIEW */}
          {viewMode === "grid" ? (
            <ProductGrid
              products={visibleProducts}
              handleVote={handleVote}
              user={user}
            />
          ) : (
            <ProductList
              products={visibleProducts}
              handleVote={handleVote}
              user={user}
            />
          )}

          {/* LOAD MORE BUTTON */}
          {visibleCount < processedProducts.length && (
            <div className="flex justify-center md:justify-end mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + LOAD_STEP)}
                className="
                  w-full max-w-[150px] px-4 py-2 rounded-lg text-sm font-medium
                  text-black border border-gray-300
                  hover:border-[var(--primary)]
                  hover:text-[var(--primary)]
                  transition-all duration-300
                  flex items-center justify-center gap-2 mb-6
                "
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
