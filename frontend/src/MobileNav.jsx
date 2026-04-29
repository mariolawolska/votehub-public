import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useProductCategories } from "../hooks/useProductCategories";
import { useAutosuggest } from "../hooks/useAutosuggest";
import { useClickOutside } from "../hooks/useClickOutside";
import { useAuth } from "../context/AuthContext";

export default function MobileNav({ open, setOpen, products }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // We store category NAME here (not slug)
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showSuggest, setShowSuggest] = useState(false);

  // Safe fallback: ensure categories is always an array
  const rawCategories = useProductCategories(products);
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const suggestions = useAutosuggest(products, query);

  const suggestRef = useRef(null);
  useClickOutside(suggestRef, () => setShowSuggest(false));

  const { user, logout } = useAuth();

  // --- HANDLE SEARCH SUBMIT ---
  function handleSearch() {
    const params = new URLSearchParams();

    // Add search term
    if (query.trim()) params.set("search", query.trim());

    // Convert NAME → SLUG for URL
    if (selectedCategory !== "All") {
      const cat = categories.find((c) => c.name === selectedCategory);
      if (cat) params.set("category", cat.slug);
    }

    navigate(`/categories?${params.toString()}`, { replace: true });
    setOpen(false);
  }

  return (
    <>
      {/* DARK OVERLAY BEHIND THE MENU */}
      <div
        className={`
          fixed inset-0 bg-black/60 z-[9998]
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      ></div>

      {/* MOBILE SIDE MENU */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72
          bg-black text-white shadow-2xl z-[9999]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-black">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide"
            onClick={() => setOpen(false)}
          >
            VoteHub
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl hover:text-[var(--primary)] transition"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <ul className="flex flex-col gap-4 px-6 py-6 text-lg uppercase tracking-wide">
          <li>
            <Link
              to="/"
              className="hover:text-[var(--primary)] transition"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className="hover:text-[var(--primary)] transition"
              onClick={() => setOpen(false)}
            >
              Movie Category
            </Link>
          </li>
        </ul>
        {/* LOGIN REGISTER BOX */}
        {!user && (
          <ul className="flex flex-col gap-4 px-6 text-lg uppercase tracking-wide mt-4">
            <li>
              <Link
                to="/login"
                className="hover:text-[var(--primary)] transition  px-5 py-1 mb-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm "
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="hover:text-[var(--primary)] transition  px-5 py-1 mb-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
        {user && (
          <div className="px-6 mt-4">
            <div className="text-white/80 mb-3">Hi, {user.name}</div>

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="
        w-full bg-white/10 border border-white/20 rounded-lg py-2
        hover:bg-white/20 transition  px-5 py-1 mb-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm 
      "
            >
              Logout
            </button>
          </div>
        )}

        {/* SEARCH BOX */}
        <div className="px-6 mt-4" ref={suggestRef}>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            {/* CATEGORY DROPDOWN */}
            <div className="relative mb-3">
              <div
                className="
                  w-full bg-black/40 border border-white/20 rounded-lg p-2 
                  text-white flex items-center justify-between cursor-pointer
                "
                onClick={() => setShowCategories((prev) => !prev)}
              >
                <span className="flex items-center gap-2">
                  🎬 {selectedCategory}
                </span>
                <span>▾</span>
              </div>

              {showCategories && (
                <div className="absolute left-0 right-0 mt-2 bg-black/90 border border-white/20 rounded-lg shadow-xl z-50">
                  {/* ALL CATEGORIES OPTION */}
                  <div
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setSelectedCategory("All");
                      setShowCategories(false);
                    }}
                  >
                    🎬 All Categories
                  </div>

                  {/* CATEGORY LIST */}
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(cat.name); // Store NAME
                        setShowCategories(false);
                      }}
                    >
                      🎞️ {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggest(true);
                }}
                className="
                  w-full bg-black/40 border border-white/20 rounded-lg p-2 
                  text-white placeholder-white/50
                  focus:outline-none focus:border-[var(--primary)]
                "
              />

              {/* AUTOSUGGEST DROPDOWN */}
              {showSuggest && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-black/90 border border-white/20 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/categories?search=${encodeURIComponent(item.title)}`,
                          { replace: true },
                        );
                        setQuery(item.title);
                        setShowSuggest(false);
                        setOpen(false);
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <button
              onClick={handleSearch}
              className="
                mt-3 w-full bg-[var(--primary)] rounded-lg py-2 
                hover:bg-[var(--primary)]/80 transition text-white
              "
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
