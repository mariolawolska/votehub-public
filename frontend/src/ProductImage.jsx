export default function ProductImage({ src, alt, className }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const finalSrc = src
    ? (src.startsWith("http") ? src : `${API_URL}/storage/${src}`)
    : null;

  return (
    <img
      src={finalSrc || "/placeholder.jpg"}   // 🔥 fallback z public/
      alt={alt}
      className={className}
      onError={(e) => (e.target.src = "/placeholder.jpg")}
    />
  );
}
