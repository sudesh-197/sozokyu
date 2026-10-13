import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onAdd, variant }) {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant={variant} onAdd={onAdd} />
      ))}
    </div>
  );
}
