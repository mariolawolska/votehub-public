import ProductCard from "./ProductCard";

export default function ProductList({ products, handleVote, user }) {
  return (
    <div className="space-y-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          handleVote={handleVote}
          user={user}
          list
        />
      ))}
    </div>
  );
}
