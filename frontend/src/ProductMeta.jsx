import ProductImage from "./ProductImage";

export default function ProductMeta({ avatarUrl, votes }) {
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-2">
        <ProductImage
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-500 text-sm">Votes: {votes}</span>
      </div>
    </div>
  );
}
