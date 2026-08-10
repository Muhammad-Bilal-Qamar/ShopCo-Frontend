import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PromoBanner from "../HomePage Components/Promobar.jsx";
import Navbar from "../HomePage Components/Navbar.jsx";
import Footer from "../HomePage Components/Footer.jsx";
import { API_BASE_URL } from "../../utils/apiConfig.js";
import { getProductImageUrl } from "../../utils/media.js";

// Dress styles map 1:1 to the `category` field stored on each product
// (same values used on the homepage "Browse By Dress Style" section).
export const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

const COLOR_SWATCHES = [
  { id: "green", hex: "#22C55E" },
  { id: "red", hex: "#EF4444" },
  { id: "yellow", hex: "#EAB308" },
  { id: "orange", hex: "#F97316" },
  { id: "cyan", hex: "#06B6D4" },
  { id: "blue", hex: "#2563EB" },
  { id: "purple", hex: "#7C3AED" },
  { id: "pink", hex: "#EC4899" },
  { id: "white", hex: "#FFFFFF" },
  { id: "black", hex: "#111111" },
];

const SIZE_OPTIONS = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
];

// Clothing "type" filter — there's no dedicated type/subcategory field on the
// Products model yet, so this matches against keywords in the product title
// (the same approach already used for reviews/colors placeholders elsewhere
// in this codebase). Order matters: "T-shirts" is checked before "Shirts" so
// a title like "Striped T-shirt" isn't also counted under "Shirts".
const TYPE_OPTIONS = [
  { label: "T-shirts", keywords: ["t-shirt", "tshirt", "tee"] },
  { label: "Shorts", keywords: ["short"] },
  {
    label: "Shirts",
    keywords: ["shirt"],
    excludeKeywords: ["t-shirt", "tshirt"],
  },
  { label: "Hoodie", keywords: ["hoodie", "hoody"] },
  { label: "Jeans", keywords: ["jean"] },
];

function matchesType(product, typeLabel) {
  if (!typeLabel) return true;
  const type = TYPE_OPTIONS.find((t) => t.label === typeLabel);
  if (!type) return true;
  const title = normalize(product.title);
  const excluded = (type.excludeKeywords || []).some((k) => title.includes(k));
  if (excluded) return false;
  return type.keywords.some((k) => title.includes(k));
}

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PAGE_SIZE = 9;
const DEFAULT_MAX_PRICE = 300;

function normalize(value) {
  return (value || "").toString().trim().toLowerCase();
}

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function StarRow({ rating }) {
  const rounded = Math.round(rating);
  return (
    <span className="text-amber-500 text-sm leading-none">
      {"★".repeat(Math.max(0, Math.min(5, rounded)))}
      <span className="text-gray-300">
        {"★".repeat(Math.max(0, 5 - rounded))}
      </span>
    </span>
  );
}

function ProductCard({ product }) {
  const rating = product.rating?.rate ?? 0;
  const ratingCount = product.rating?.count ?? 0;
  const image = getProductImageUrl(product);

  // discountPercentage isn't part of the current Products model/API response.
  // This stays defensive (like the product detail page) so a real discount
  // field can be wired in later without touching the card markup.
  const hasDiscount = Boolean(product.discountPercentage);
  const discountPercent = hasDiscount
    ? Math.round(product.discountPercentage)
    : null;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="block overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="mb-4 rounded-[20px] bg-[#F0EEED] p-6 flex items-center justify-center h-56 sm:h-64">
        <img
          src={image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="space-y-2 px-1">
        <h2 className="truncate w-full text-base sm:text-lg font-semibold text-slate-900">
          {product.title}
        </h2>

        <div className="flex items-center gap-2 text-sm">
          <StarRow rating={rating} />
          <span className="text-slate-500 font-sans">
            {rating.toFixed(1)}/5
          </span>
          <span className="text-slate-400 font-sans">({ratingCount})</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-500">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function FilterIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M4 6h10M17 6h3M4 12h3M10 12h10M4 18h10M17 18h3"
      />
      <circle cx="14" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FiltersPanel({
  maxPossiblePrice,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedStyles,
  toggleStyle,
  selectedType,
  setSelectedType,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  onApply,
}) {
  return (
    <div>
      <div className="divide-y divide-gray-200 border-b border-gray-200">
        {TYPE_OPTIONS.map((type) => {
          const active = selectedType === type.label;
          return (
            <button
              key={type.label}
              type="button"
              onClick={() => setSelectedType(active ? null : type.label)}
              className={`flex w-full items-center justify-between py-3 text-left text-sm transition ${
                active
                  ? "font-semibold text-black"
                  : "text-slate-600 hover:text-black"
              }`}
            >
              {type.label}
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          );
        })}
      </div>

      <FilterSection title="Price">
        <style>{`
          .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            pointer-events: auto;
            height: 18px;
            width: 18px;
            border-radius: 9999px;
            background: #000000;
            border: none;
            box-shadow: none;
            cursor: pointer;
            margin-top: -6px;
          }
          .range-thumb::-moz-range-thumb {
            pointer-events: auto;
            height: 18px;
            width: 18px;
            border-radius: 9999px;
            background: #000000;
            border: none;
            box-shadow: none;
            cursor: pointer;
          }
          .range-thumb::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: transparent;
          }
          .range-thumb::-moz-range-track {
            background: transparent;
          }
        `}</style>
        <div className="px-1 pt-2">
          <div className="relative h-5">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black"
              style={{
                left: `${(minPrice / maxPossiblePrice) * 100}%`,
                right: `${100 - (maxPrice / maxPossiblePrice) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={maxPossiblePrice}
              value={minPrice}
              onChange={(e) =>
                setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))
              }
              className="range-thumb pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 w-full translate-y-2.5 appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={maxPossiblePrice}
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))
              }
              className="range-thumb pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 w-full translate-y-2.5 appearance-none bg-transparent"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>${minPrice.toLocaleString()}</span>
            <span>${maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Colors">
        <div className="flex flex-wrap gap-3">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={c.id}
              onClick={() =>
                setSelectedColor(selectedColor === c.id ? null : c.id)
              }
              className={`h-8 w-8 rounded-full ring-1 ring-black/10 transition ${
                selectedColor === c.id ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {selectedColor === c.id && (
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 mx-auto ${
                    c.id === "white" ? "text-black" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSelectedSize(selectedSize === size ? null : size)
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSize === size
                  ? "bg-black text-white"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dress Style">
        <div className="flex flex-col gap-1">
          {DRESS_STYLES.map((style) => {
            const active = selectedStyles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`flex items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition ${
                  active
                    ? "font-semibold text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                {style}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={onApply}
        className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-black/90"
      >
        Apply Filter
      </button>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - windowSize && p <= currentPage + windowSize)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 rounded-lg px-3 py-2 font-medium text-slate-600 disabled:opacity-40 hover:enabled:bg-gray-100"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                p === currentPage
                  ? "bg-black text-white"
                  : "text-slate-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 rounded-lg px-3 py-2 font-medium text-slate-600 disabled:opacity-40 hover:enabled:bg-gray-100"
      >
        Next →
      </button>
    </div>
  );
}

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodedCategory = titleCase(decodeURIComponent(categoryName || ""));
  const isKnownStyle = DRESS_STYLES.some(
    (s) => normalize(s) === normalize(decodedCategory),
  );

  const [selectedStyles, setSelectedStyles] = useState(
    isKnownStyle ? [decodedCategory] : [],
  );
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(DEFAULT_MAX_PRICE);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Keep the "Dress Style" selection in sync whenever the route changes
  // (e.g. navigating from Home -> Casual -> Formal).
  useEffect(() => {
    setSelectedStyles(isKnownStyle ? [decodedCategory] : []);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        const highest = Math.max(
          DEFAULT_MAX_PRICE,
          ...data.map((p) => Math.ceil(p.price || 0)),
        );
        setMaxPossiblePrice(highest);
        setMaxPrice(highest);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, []);

  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesStyle =
        selectedStyles.length === 0 ||
        selectedStyles.some((s) => normalize(s) === normalize(p.category));
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchesStyle && matchesPrice && matchesType(p, selectedType);
    });
  }, [products, selectedStyles, minPrice, maxPrice, selectedType]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort(
          (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
        );
      case "popular":
      default:
        return list.sort(
          (a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
        );
    }
  }, [filtered, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStyles, minPrice, maxPrice, sortBy, selectedType]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = sorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const rangeStart = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, sorted.length);

  const pageTitle =
    selectedStyles.length === 1
      ? selectedStyles[0]
      : decodedCategory || "All Products";

  const filterProps = {
    maxPossiblePrice,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    selectedStyles,
    toggleStyle,
    selectedType,
    setSelectedType,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
  };

  return (
    <div className="font-['Integral_CF']">
      <PromoBanner />
      <Navbar />

      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 font-['Satoshi']">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-black">{pageTitle}</span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar - desktop */}
          <aside className="hidden w-72 flex-shrink-0 rounded-2xl border border-gray-200 p-5 lg:block">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <FilterIcon className="h-5 w-5 text-slate-700" />
            </div>
            <FiltersPanel
              {...filterProps}
              onApply={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-black uppercase tracking-tight sm:text-4xl">
                {pageTitle}
              </h1>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium lg:hidden"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h18M6 8h12M9 12h6M11 16h2"
                  />
                </svg>
                Filters
              </button>
            </div>

            <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading products..."
                  : `Showing ${rangeStart}-${rangeEnd} of ${sorted.length} Products`}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-none bg-transparent font-semibold text-slate-900 outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-black" />
              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
                <p className="font-semibold text-black">{error}</p>
                <p className="text-sm text-slate-500">
                  Please make sure the ShopCoAPI backend is running.
                </p>
              </div>
            )}

            {!loading && !error && pageItems.length === 0 && (
              <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-center">
                <p className="text-lg font-semibold text-black">
                  No products match your filters
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting the price range or dress style.
                </p>
              </div>
            )}

            {!loading && !error && pageItems.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
                {pageItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </main>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="px-4 py-4">
            <FiltersPanel
              {...filterProps}
              onApply={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
