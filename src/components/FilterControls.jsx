import Pill from "./Pill.jsx";

export function Checkbox({ label, count, checked, onChange }) {
  return (
    <label className="filter-row">
      <span className="filter-row__left">
        <input
          type="checkbox"
          className="box"
          checked={checked}
          onChange={onChange}
        />
        <span className="filter-row__label">{label}</span>
      </span>
      {count !== undefined && <Pill className="pill--count">{count}</Pill>}
    </label>
  );
}

export function Radio({ label, checked, onChange }) {
  return (
    <label className="filter-row">
      <span className="filter-row__left">
        <input
          type="radio"
          name="gender"
          className="radio"
          checked={checked}
          onChange={onChange}
        />
        <span className="filter-row__label">{label}</span>
      </span>
    </label>
  );
}

export function FilterGroup({
  title,
  bold,
  onReset,
  className = "",
  children,
}) {
  return (
    <div className={`filter-group ${className}`.trim()}>
      <div className="filter-group__head">
        <p className={bold ? "is-medium" : ""}>{title}</p>
        {onReset && (
          <button className="reset" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
      <div className="filter-group__list">{children}</div>
    </div>
  );
}
