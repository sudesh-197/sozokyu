import { searchProducts } from "./search.js";
import { categories, colors, sizes, prices } from "../data/filters.js";

export const SORT_OPTIONS = [
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Popular" },
  { key: "price_asc", label: "Price - low to high" },
  { key: "price_desc", label: "Price - high to low" },
];
// sidebar quick links  (URL: ?view=new)
export const VIEWS = [
  { key: "all", label: "All Products" },
  { key: "new", label: "New Arrivals" },
  { key: "best", label: "Best Sellers" },
  { key: "sale", label: "Offer & Sales" },
];

const VIEW_FILTERS = {
  new: (p) => p.isNew,
  best: (p) => p.isBest,
  sale: (p) => p.onSale,
};

function sortProducts(list, sort) {
  const l = [...list];
  if (sort === "popular")
    l.sort((a, b) => b.popularity - a.popularity || a.id - b.id);
  else if (sort === "price_asc")
    l.sort((a, b) => a.price - b.price || a.id - b.id);
  else if (sort === "price_desc")
    l.sort((a, b) => b.price - a.price || a.id - b.id);
  return l; // "latest" keeps the store's own order
}

/** the Gender radio shows "Men" by default; while searching, no gender is forced */
export const effectiveGender = (gender, query) =>
  gender || (query ? "" : "men");

const lower = (arr) => arr.map((v) => v.toLowerCase());

/**
 * filters = { view, gender, query, sort, category[], color[], size[], price[] }
 * The collection page shows the normal collection until the visitor picks something – then it
 * looks through every product in the store. Several options in one group are OR (Shirt or Hoodie),
 * different groups are AND (Hoodie and Black and Men).
 */
export function getCollectionList(filters, collection, everything) {
  const { view, gender, query, sort, category, color, size, price } = filters;
  const filtered = Boolean(
    view !== "all" ||
    gender ||
    query ||
    category.length ||
    color.length ||
    size.length ||
    price.length,
  );
  let list = filtered ? everything : collection;

  if (VIEW_FILTERS[view]) list = list.filter(VIEW_FILTERS[view]);

  const g = effectiveGender(gender, query);
  if (filtered && g) list = list.filter((p) => p.gender.toLowerCase() === g);

  if (category.length) {
    const c = lower(category);
    list = list.filter((p) => c.includes(p.category.toLowerCase()));
  }
  if (color.length) {
    const c = lower(color);
    list = list.filter((p) => c.includes(p.color.toLowerCase()));
  }
  if (size.length) {
    const s = lower(size);
    list = list.filter((p) =>
      p.availableSizes.some((x) => s.includes(x.toLowerCase())),
    );
  }
  if (price.length) {
    // each key is either one of the fixed sidebar ranges or a custom "min-max" from the phone slider
    const ranges = price
      .map((key) => {
        const preset = prices.find((r) => r.key === key);
        if (preset) return preset;
        const m = /^(\d+)-(\d+)$/.exec(key);
        return m ? { min: +m[1], max: +m[2] } : null;
      })
      .filter(Boolean);
    list = list.filter((p) =>
      ranges.some((r) => p.price >= r.min && p.price <= r.max),
    );
  }
  if (query) list = searchProducts(list, query);

  return { list: sortProducts(list, sort), filtered };
}

/** how many products each sidebar option matches (over the whole store) */
export function getFilterCounts(everything) {
  const count = (fn) => everything.filter(fn).length;
  return {
    category: Object.fromEntries(
      categories.map((c) => [c.label, count((p) => p.category === c.label)]),
    ),
    color: Object.fromEntries(
      colors.map((c) => [c.label, count((p) => p.color === c.label)]),
    ),
    size: Object.fromEntries(
      sizes.map((s) => [
        s.label,
        count((p) => p.availableSizes.includes(s.label)),
      ]),
    ),
    price: Object.fromEntries(
      prices.map((r) => [
        r.key,
        count((p) => p.price >= r.min && p.price <= r.max),
      ]),
    ),
  };
}

/** link used by the header menu: keeps the other choices, drops the search text */
export function collectionPath(currentParams, key, value) {
  const next = new URLSearchParams(currentParams);
  next.delete("q");
  next.set(key, value);
  return `/collection?${next.toString()}`;
}
