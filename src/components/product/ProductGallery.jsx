import { responsive, small } from '../../lib/images.js';

export default function ProductGallery({ main, plain, gallery, activeThumb, onSelect }) {
  return (
    <div className="gallery">
      <div className="gallery__main">
        <div className={`gallery__bg ${plain ? 'gallery__bg--plain' : ''}`}>
          <div className="gallery__img"><img {...responsive(main, '521px')} alt="" fetchpriority="high" decoding="async" /></div>
        </div>
      </div>

      <div className="gallery__thumbs">
        {gallery.map((src, i) => (
          <button
            key={i}
            className={`tile tile--thumb ${i === activeThumb ? 'is-active' : ''}`}
            onClick={() => onSelect(src, i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={small(src)} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
