import { useNavigate } from "react-router-dom";
import { useVote } from "../hooks/useVote";

function truncate(text, max = 200) {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
}

export default function ProductCard({ product, list, user }) {
  const navigate = useNavigate();
  const { vote, hasVoted } = useVote(product.id);

  // 🔥 Pobieramy obraz tak samo jak na ProductPage
  const cardImage =
    product.images?.find((img) => img.type === "desktop")?.full_url ||
    product.images?.find((img) => img.type === "tablet")?.full_url ||
    product.images?.find((img) => img.type === "mobile")?.full_url ||
    product.images?.find((img) => img.type === "thumb")?.full_url ||
    product.images?.[0]?.full_url ||
    "/placeholder.jpg";

  return (
    <div
      className={`border bg-white rounded-lg overflow-hidden shadow ${
        list ? "flex gap-4" : ""
      }`}
    >
      {/* IMAGE */}
      <img
        src={cardImage}
        className={`${list ? "w-48" : "w-full"} object-cover`}
        alt={product.title}
      />

      <div className="p-4 flex flex-col justify-between w-full">
        <div className="min-h-[140px] flex flex-col justify-start">
          <h2 className="text-xl font-bold">{product.title}</h2>

          <p className="text-gray-500">
            {truncate(product.description, 150)}
            {product.description?.length > 150 && (
              <span
                onClick={() => navigate(`/product/${product.id}`)}
                className="text-[var(--primary)] cursor-pointer ml-1 hover:underline"
              >
                See more
              </span>
            )}
          </p>
        </div>

        {/* VOTES */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-gradient-to-r from-black/80 to-black/40
              text-white
              shadow-[0_0_15px_rgba(0,0,0,0.4)]
              backdrop-blur-md
              border border-white/10
              cursor-pointer
              group
              transition-all duration-300
              w-full sm:w-auto
              justify-center sm:justify-start
            "
            onClick={() => {
              vote();
              handleVote(product.id);
            }}
          >
            <span className="text-lg font-bold tracking-wide">
              {product.votes}
            </span>

            <span className="text-xs uppercase opacity-80 tracking-wider">
              Votes
            </span>

            <span
              className="
                text-[var(--primary)]
                text-lg
                font-bold
                transform transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              ➜
            </span>
          </div>

          {/* Vote Button */}
          <button
            disabled={hasVoted}
            onClick={() => {
              vote();
              handleVote(product.id);
            }}
            className="
              relative px-6 py-2.5 rounded-lg text-white text-sm font-semibold
              bg-[var(--primary)]
              shadow-[0_0_12px_var(--primary)]
              hover:shadow-[0_0_20px_var(--primary)]
              hover:bg-[var(--primary)]/90
              transition-all duration-300
              tracking-wide
              overflow-hidden
              w-full sm:w-auto
            "
          >
           

            <span
              className="
                absolute inset-0 
                bg-gradient-to-r from-white/20 to-transparent
                opacity-0 hover:opacity-20
                transition-opacity duration-300
              "
            ></span>
             <span className="relative z-10 flex items-center gap-2 justify-center">
              {hasVoted ? "Voted" : "Vote"}
              <span className="text-white text-lg leading-none">🎬</span>
            </span>
            
          </button>
        </div>

        {/* DETAILS BUTTON */}
        <div className="mt-3">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="
              w-full px-4 py-2 rounded-lg text-sm font-medium
              bg-white text-black 
              border border-gray-300
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
              transition-all duration-300
            "
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
