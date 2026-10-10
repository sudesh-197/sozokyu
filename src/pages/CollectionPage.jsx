import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import ProductToolbar from "../components/ProductToolbar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import MobileFilterBar from "../components/MobileFilterBar.jsx";
import { products, allProducts, withLocalMeta } from "../data/products.js";
import {
  getCollectionList,
  getFilterCounts,
  effectiveGender,
  SORT_OPTIONS,
} from "../lib/catalog.js";
import useRemote from "../hooks/useRemote.js";
import { api } from "../api/client.js";
import useEscapeKey from "../hooks/useEscapeKey.js";
import useScrollLock from "../hooks/useScrollLock.js";

export default function CollectionPage() {
  const [filtersOpen, setFiltersOpen] = useState(false); // phones: filters live in a bottom sheet
  const [params, setParams] = useSearchParams();
  const listParam = (k) => (params.get(k) || "").split(",").filter(Boolean);
  const query = (params.get("q") || "").trim();
  const rawSort = params.get("sort");
  const filters = {
    view: params.get("view") || "all", // all | new | best | sale      (sidebar links / header menu)
    gender: params.get("gender") || "", // men | women                  (sidebar radio / header menu)
    category: listParam("category"), // Shirt,Hoodie ...
    color: listParam("color"),
    size: listParam("size"),
    price: listParam("price"), // 799-999,2500+ ...
    query,
    sort: SORT_OPTIONS.some((o) => o.key === rawSort) ? rawSort : "latest",
  };

  // change one or more URL options, keep the rest (arrays are stored as comma lists)
  const update = (changes) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([k, v]) => {
        const value = Array.isArray(v) ? v.join(",") : v;
        if (value) next.set(k, value);
        else next.delete(k);
      });
      return next;
    });

  const remoteList = useRemote(
    () =>
      api
        .products({ section: "collection", limit: 50 })
        .then((r) => r.items.map(withLocalMeta)),
    products,
    [],
  );
  const { list, filtered } = getCollectionList(
    filters,
    remoteList,
    allProducts,
  );
  // counts follow the selected gender, so a number in the sidebar matches what you get when you tick it
  const shownGender = effectiveGender(filters.gender, query);
  const counts = getFilterCounts(
    shownGender
      ? allProducts.filter((p) => p.gender.toLowerCase() === shownGender)
      : allProducts,
  );

  const closeFilters = () => setFiltersOpen(false);
  useEscapeKey(closeFilters, filtersOpen);
  useScrollLock(filtersOpen);

  const setSort = (k) => update({ sort: k === "latest" ? "" : k });

  return (
    <>
      <Hero />
      <main className="content">
        <Breadcrumb>
          <Link to="/" className="breadcrumb__muted">
            Home
          </Link>
          <span className="breadcrumb__muted"> </span> / Collection
        </Breadcrumb>

        {/* phones only: heading from the Figma phone frame (the Filter button now lives in the floating bar below) */}
        <div className="collection-bar">
          <h2>{query ? `Results for “${query}”` : "All Products"}</h2>
        </div>

        <div className="content__row">
          <div
            className={`filter-sheet ${filtersOpen ? "is-open" : ""}`}
            onMouseDown={(e) =>
              e.target === e.currentTarget && setFiltersOpen(false)
            }
          >
            <div className="filter-sheet__body">
              <div className="filter-sheet__panel">
                <button
                  type="button"
                  className="filter-sheet__close"
                  onClick={() => setFiltersOpen(false)}
                >
                  Close
                </button>
                <FilterSidebar
                  filters={{ ...filters, gender: shownGender }}
                  counts={counts}
                  onChange={(changes) => {
                    update(changes);
                    if ("view" in changes || "gender" in changes)
                      setFiltersOpen(false); // phone sheet closes on quick picks
                  }}
                />
              </div>
            </div>
          </div>

          <section className="results">
            <ProductToolbar
              total={list.length}
              query={query}
              sort={filters.sort}
              onSort={setSort}
            />
            {filtered && list.length === 0 ? (
              <div className="no-results">
                <p>
                  {query
                    ? `No items found for “${query}”.`
                    : "No items match these filters."}
                </p>
                <p>
                  Try removing a filter, or search for T-shirt, shirt, hoodie or
                  jacket.
                </p>
                <Link to="/collection" className="btn-dark">
                  View all products
                </Link>
              </div>
            ) : (
              <ProductGrid products={list} />
            )}
          </section>
        </div>

        {/* phones only: floating Sort / Color / Price / Filter bar */}
        <MobileFilterBar
          sort={filters.sort}
          onSort={setSort}
          color={filters.color}
          onColor={(v) => update({ color: v })}
          price={filters.price}
          onPrice={(v) => update({ price: v })}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      </main>
    </>
  );
}
