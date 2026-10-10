import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import ProductGallery from '../components/product/ProductGallery.jsx';
import ProductInfo from '../components/product/ProductInfo.jsx';
import RelatedProducts from '../components/product/RelatedProducts.jsx';
import { getProduct, getRelated } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api/client.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { add: addItem } = useCart();

  // backend data when available, bundled data otherwise
  const [remote, setRemote] = useState(null);
  const product = remote ?? getProduct(id);
  const related = remote?.related ?? (product ? getRelated(product.id) : []);

  const [main, setMain] = useState(product?.gallery[0]);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0);

  useEffect(() => {
    let alive = true;
    setRemote(null);
    api.product(id).then((p) => { if (alive) setRemote(p); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  // reset when navigating to another product
  useEffect(() => {
    if (!product) return;
    setMain(product.gallery[0]);
    setActiveThumb(0);
    setActiveVariant(0);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <main className="pd">
        <Breadcrumb><Link to="/" className="breadcrumb__muted">Home</Link> / Product not found</Breadcrumb>
      </main>
    );
  }

  return (
    <main className="pd">
      <Breadcrumb>
        <Link to="/" className="breadcrumb__muted">Home</Link>
        <span className="breadcrumb__muted"> / </span>
        <Link to="/collection" className="breadcrumb__muted">Collection</Link>
        <span className="breadcrumb__muted"> </span> / Product Details
      </Breadcrumb>

      <div className="pd__wrap">
        <div className="pd__row">
          <ProductGallery
            main={main}
            plain={product.plain}
            gallery={product.gallery}
            activeThumb={activeThumb}
            onSelect={(src, i) => { setMain(src); setActiveThumb(i); }}
          />
          <ProductInfo
            product={product}
            activeVariant={activeVariant}
            onVariant={(src, i) => { setMain(src); setActiveVariant(i); }}
            onAddToCart={addItem}
          />
        </div>
        <RelatedProducts products={related} />
      </div>
    </main>
  );
}
