import ProductCard from "./ProductCard";

export default function ProductGrid({ products, handleVote, user }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          handleVote={handleVote}
          user={user}
        />
      ))}
    </div>
  );
}
