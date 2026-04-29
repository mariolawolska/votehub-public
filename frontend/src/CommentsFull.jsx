import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useComments } from "../hooks/useComments";

export default function CommentsFull({ productId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { comments, loading, addComment } = useComments(productId, user);

  // Check if user already commented
  const userAlreadyCommented = user
    ? comments.some((c) => c.user?.name === user.name)
    : false;

  const visibleComments = useMemo(
    () => (showAll ? comments : comments.slice(0, 5)),
    [comments, showAll]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (userAlreadyCommented) {
      alert("You can only post one comment for this movie.");
      return;
    }

    if (!content.trim()) return;

    try {
      await addComment(content);
      setContent("");
    } catch (err) {
      console.log("ADD COMMENT ERROR:", err);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading comments...</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          disabled={!user || userAlreadyCommented}
        />

        <button
          className="
            mt-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-white text-black 
            border border-gray-300
            hover:border-[var(--primary)]
            hover:text-[var(--primary)]
            transition-all duration-300
            max-w-[300px] w-full mx-auto block
          "
          disabled={!user || userAlreadyCommented}
        >
          Add comment
        </button>

        {!user && (
          <p className="text-center text-gray-400 text-sm mt-3">
            You must be logged in to post a comment.
          </p>
        )}

        {userAlreadyCommented && (
          <p className="text-center text-gray-400 text-sm mt-3">
            You have already posted a comment for this movie.
          </p>
        )}
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {visibleComments.map((c) => (
          <div key={c.id} className="border p-3 rounded bg-gray-50">
            <p className="text-sm text-gray-700">{c.body}</p>
            <p className="text-xs text-gray-500 mt-1">
              {c.user?.name ?? "Anonymous"} —{" "}
              {new Date(c.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {comments.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm text-[var(--primary)] underline"
        >
          Show all comments ({comments.length})
        </button>
      )}
    </div>
  );
}
