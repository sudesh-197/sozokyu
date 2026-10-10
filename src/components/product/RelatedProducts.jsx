import ProductCard from '../ProductCard.jsx';

export default function RelatedProducts({ products }) {
  return (
    <section className="related">
      <h2>You might also like</h2>
      <div className="related__grid">
        {products.map((p) => <ProductCard key={p.id} product={p} variant="large" />)}
      </div>
    </section>
  );
}
