export default function SizeSelector({ sizes, value, onChange }) {
  return (
    <div className="pd-section">
      <p className="pd-label">Select Size</p>
      <div className="size-row">
        {sizes.map((s) => (
          <button key={s} className={`size-btn ${s === value ? 'is-active' : ''}`} onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
