import { useNavigate, useParams, useLocation } from "react-router-dom";
import CommentsFull from "../components/CommentsFull";
import { useVote } from "../hooks/useVote";
import { useProduct } from "../hooks/useProduct";
import { useVoteStatus } from "../hooks/useVoteStatus";
import { useAuth } from "../context/AuthContext";
import ResponsiveImage from "../components/ResponsiveImage";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, setProduct, loading } = useProduct(id);
  const { vote, hasVoted } = useVote(id);
  const { user } = useAuth();

  const handleVote = async () => {
    await vote();

    setProduct((prev) => ({
      ...prev,
      votes: prev.votes + 1,
    }));
  };

  if (loading || !product)
    return <p className="text-center text-white mt-10">Loading...</p>;

  const heroImages = {
    xl: product.images?.find((i) => i.type === "xl")?.full_url,
    desktop: product.images?.find((i) => i.type === "desktop")?.full_url,
    tablet: product.images?.find((i) => i.type === "tablet")?.full_url,
    mobile: product.images?.find((i) => i.type === "mobile")?.full_url,
    thumb:
      product.images?.find((i) => i.type === "thumb")?.full_url ||
      product.images?.[0]?.full_url,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pb-20">
      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <ResponsiveImage
          images={heroImages}
          alt={product.title}
          priority={true} // HERO = LCP boost
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-10 max-w-2xl">
          <h1 className="text-5xl font-bold drop-shadow-lg">{product.title}</h1>

          <div className="flex flex-wrap gap-2 mt-3">
            {product.categories?.map((cat) => (
              <span
                key={cat.slug}
                className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/20"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              disabled={hasVoted}
              onClick={handleVote}
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
              <span className="relative z-10 flex items-center gap-2 justify-center">
                {hasVoted ? "Already voted" : "Vote"}
                <span className="text-white text-lg leading-none">🎬</span>
              </span>
            </button>

            <span className="text-xl font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur">
              ⭐ {product.votes} votes
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-10">
        {/* TRAILER */}
        {product.trailerUrl ? (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">🎥 Trailer</h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10">
              <iframe
                src={product.trailerUrl}
                title="Movie Trailer"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="mb-10 text-gray-400 italic">
            No trailer available for this movie.
          </div>
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-lg leading-relaxed mb-12">
          {product.description}
        </p>

        {/* COMMENTS */}
        <div className="bg-white/5 p-6 rounded-xl backdrop-blur border border-white/10 shadow-xl">
          <div className="[&_input]:!text-black [&_textarea]:!text-black">
            {/* CTA only if NOT logged in */}
            {!user && (
              <div className="text-center py-6 text-gray-300 mb-6 border-b border-white/10">
                <p className="mb-4">You must be logged in to add a comment.</p>

                <button
                  onClick={() =>
                    navigate("/login", { state: { from: location.pathname } })
                  }
                  className="
    px-6 py-2 bg-[var(--primary)] rounded-lg 
    hover:bg-[var(--primary)]/80 transition
  "
                >
                  Login
                </button>

                <div className="mt-4">
                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://marbar.co.uk/auth/google/redirect/react")
                    }
                    className="
                      px-6 py-2 bg-white/10 border border-white/20 rounded-lg
                      hover:bg-white/20 transition
                    "
                  >
                    Login with Google
                  </button>
                </div>
              </div>
            )}

            {/* Comments list + form (form will hide itself if user is null) */}
            <CommentsFull productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
