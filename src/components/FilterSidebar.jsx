import { FilterGroup, Checkbox, Radio } from "./FilterControls.jsx";
import { categories, genders, colors, sizes, prices } from "../data/filters.js";
import { VIEWS } from "../lib/catalog.js";

/**
 * Every option lives in the page URL (see CollectionPage), so the header menu, this sidebar,
 * the browser Back button and shared links always agree.
 *   filters = { view, gender, category[], color[], size[], price[] }
 *   onChange({ group: newValue })
 *
 * Color and Price carry `filter-group--on-bar`: on phones they live in the floating bar
 * (MobileFilterBar), so collection-mobile.css hides them in the Filter sheet.
 */
export default function FilterSidebar({ filters, counts = {}, onChange }) {
  const { view, gender } = filters;

  const toggle = (group, value) => {
    const current = filters[group];
    onChange({
      [group]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  const pickView = (key) => onChange({ view: key === "all" ? "" : key });

  return (
    <aside className="sidebar">
      <p className="sidebar__title">Filter Option</p>

      <div className="sidebar__sections">
        <ul className="quick-links">
          {VIEWS.map((v) => (
            <li
              key={v.key}
              role="button"
              tabIndex={0}
              className={v.key === view ? "is-active" : ""}
              onClick={() => pickView(v.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pickView(v.key);
                }
              }}
            >
              {v.label}
            </li>
          ))}
        </ul>

        <FilterGroup
          title="Category"
          bold
          onReset={() => onChange({ category: [] })}
        >
          {categories.map((c) => (
            <Checkbox
              key={c.label}
              label={c.label}
              count={counts.category?.[c.label]}
              checked={filters.category.includes(c.label)}
              onChange={() => toggle("category", c.label)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Gender" bold>
          {genders.map((g) => (
            <Radio
              key={g}
              label={g}
              checked={gender === g.toLowerCase()}
              onChange={() => onChange({ gender: g.toLowerCase() })}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="Color"
          className="filter-group--on-bar"
          onReset={() => onChange({ color: [] })}
        >
          {colors.map((c) => (
            <Checkbox
              key={c.label}
              label={c.label}
              count={counts.color?.[c.label]}
              checked={filters.color.includes(c.label)}
              onChange={() => toggle("color", c.label)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Size">
          {sizes.map((s) => (
            <Checkbox
              key={s.label}
              label={s.label}
              checked={filters.size.includes(s.label)}
              onChange={() => toggle("size", s.label)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Price" className="filter-group--on-bar">
          {prices.map((p) => (
            <Checkbox
              key={p.key}
              label={p.label}
              checked={filters.price.includes(p.key)}
              onChange={() => toggle("price", p.key)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}
