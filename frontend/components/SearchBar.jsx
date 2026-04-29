import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ products }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- AUTOSUGGEST ---
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const term = query.toLowerCase();

    const filtered = products
      .filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      )
      .slice(0, 6); // max 6 wyników jak Netflix

    setSuggestions(filtered);
    setOpen(true);
  }, [query, products]);

  // --- SEARCH SUBMIT ---
  function handleSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());

    navigate(`/?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative w-full max-w-xl" ref={wrapperRef}>
      {/* INPUT */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full p-3 rounded-lg border 
            focus:border-[var(--primary)] 
            transition-all duration-300
          "
        />
      </form>

      {/* AUTOSUGGEST DROPDOWN */}
      {open && suggestions.length > 0 && (
        <div
          className="
            absolute left-0 right-0 mt-2 bg-white shadow-xl rounded-lg 
            border border-gray-200 z-50 max-h-80 overflow-y-auto
          "
        >
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="
                flex items-center gap-3 p-3 cursor-pointer 
                hover:bg-gray-100 transition
              "
              onClick={() => {
                navigate(`/product/${item.id}`);
                setOpen(false);
              }}
            >
              <img
                src={item.productImageThumbnailUrl}
                alt={item.title}
                className="w-12 h-16 object-cover rounded"
              />

              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
