import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PromoBanner from "../HomePage Components/Promobar.jsx";
import Navbar from "../HomePage Components/Navbar.jsx";
import Footer from "../HomePage Components/Footer.jsx";
import { addToCart, changeQuantity, getCartQuantity } from "./cartStore.js";
import { getProductImageUrl } from "../../utils/media.js";

const COLOR_OPTIONS = [
  { id: "olive", label: "Olive", swatch: "#4A4A38" },
  { id: "navy", label: "Navy", swatch: "#2B2B42" },
  { id: "black", label: "Black", swatch: "#1A1A1A" },
];

const SIZE_OPTIONS = ["Small", "Medium", "Large", "X-Large"];

// Static illustrative reviews — there's no reviews endpoint in the API yet,
// so this keeps the visual layout from the screenshot intact. Swap this out
// for a real `/api/products/{id}/reviews` fetch once that endpoint exists.
const SAMPLE_REVIEWS = [
  {
    name: "Samantha D.",
    verified: true,
    rating: 5,
    date: "August 14, 2023",
    text: "I absolutely love this t-shirt! The fabric is soft and comfortable, and the fit is perfect. The design is unique and always gets compliments.",
  },
  {
    name: "Alex M.",
    verified: true,
    rating: 4,
    date: "August 15, 2023",
    text: "This t-shirt exceeded my expectations. The print quality is excellent and it hasn't faded after several washes.",
  },
  {
    name: "Ethan R.",
    verified: true,
    rating: 5,
    date: "August 16, 2023",
    text: "This is a fantastic t-shirt that hugs my body just right. The material feels durable and the stitching is solid.",
  },
  {
    name: "Olivia P.",
    verified: true,
    rating: 4,
    date: "August 17, 2023",
    text: "As a UX/UI designer, I appreciate the attention to detail in this shirt. The design is clean and the fabric feels premium.",
  },
  {
    name: "Liam K.",
    verified: true,
    rating: 5,
    date: "August 18, 2023",
    text: "This shirt is a comfortable, well-made staple. The color hasn't faded and the print still looks brand new.",
  },
  {
    name: "Ava H.",
    verified: true,
    rating: 5,
    date: "August 19, 2023",
    text: "The fit is true to size and the fabric breathes well, making it perfect for everyday wear.",
  },
];

const StarRow = ({ rating = 0, className = "text-yellow-400" }) => {
  const rounded = Math.round(rating);
  return (
    <span className={`text-base leading-none ${className}`}>
      {"★".repeat(Math.min(5, rounded))}
      <span className="text-gray-300">
        {"★".repeat(Math.max(0, 5 - rounded))}
      </span>
    </span>
  );
};

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].id);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantityState] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    let isMounted = true;

    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError(null);
        return fetch(`/api/products/${id}`);
      })
      .then(async (response) => {
        const text = await response.text();
        let data = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { message: text };
        }

        if (response.status === 404) {
          throw new Error("This product could not be found.");
        }

        if (!response.ok) {
          throw new Error(
            data?.message || response.statusText || "Unable to load product.",
          );
        }

        return data;
      })
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        const existingQty = getCartQuantity(data.id);
        setQuantityState(existingQty > 0 ? existingQty : 1);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Something went wrong loading this product.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setRelatedProducts(
          (data || [])
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 4),
        );
      })
      .catch((err) => console.error("Related products load error:", err));
  }, [id]);

  // Keep the quantity shown here in sync if the cart changes elsewhere
  // (e.g. removed on the Cart page in another tab/component).
  useEffect(() => {
    if (!product) return undefined;

    const syncFromCart = () => {
      const qty = getCartQuantity(product.id);
      if (qty > 0) setQuantityState(qty);
    };

    window.addEventListener("cartchange", syncFromCart);
    return () => window.removeEventListener("cartchange", syncFromCart);
  }, [product]);

  const isInCart = useMemo(
    () => (product ? getCartQuantity(product.id) > 0 : false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product, quantity],
  );

  const handleQuantityChange = (delta) => {
    if (!product) return;

    if (isInCart) {
      const updated = changeQuantity(product, delta);
      setQuantityState(updated);
    } else {
      setQuantityState((prev) => Math.max(1, prev + delta));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PromoBanner />
        <Navbar />
        <div className="mx-auto flex max-w-310 flex-col items-center gap-4 px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-black">{error}</h1>
          <p className="text-black/60">
            The product you're looking for isn't available right now.
          </p>
          <Link
            to="/"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const rating = product.rating?.rate ?? 0;
  const ratingCount = product.rating?.count ?? 0;
  const hasDiscount = Boolean(product.discountPercentage);
  const discountPercent = hasDiscount
    ? Math.round(product.discountPercentage)
    : null;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  const image = getProductImageUrl(product);
  const thumbnails = [image, image, image];

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="min-h-screen bg-white text-black font-['Satoshi']">
        <div className="mx-auto max-w-310 px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-black/60 sm:text-sm">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span>
              {product.category ? product.category.split(" ")[0] : "Shop"}
            </span>
            <span>/</span>
            <span className="font-semibold text-black">
              {product.category || "Product"}
            </span>
          </div>

          {/* Main product section */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <div className="flex shrink-0 flex-row gap-3 sm:flex-col">
                {thumbnails.map((thumb, index) => (
                  <button
                    key={index}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F0EEED] p-2 ring-1 ring-transparent transition hover:ring-black/20 sm:h-24 sm:w-24"
                  >
                    <img
                      src={thumb}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
              <div className="flex flex-1 items-center justify-center rounded-3xl bg-[#F0EEED] p-8">
                <img
                  src={image}
                  alt={product.title}
                  className="h-72 w-full object-contain sm:h-96"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl">
                {product.title}
              </h1>

              <div className="mt-3 flex items-center gap-3">
                <StarRow rating={rating} />
                <span className="text-sm font-semibold text-black">
                  {rating.toFixed(1)}/5
                </span>
                <span className="text-sm text-black/50">({ratingCount})</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-black/40 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-500">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 border-b border-gray-200 pb-6 text-sm leading-relaxed text-black/60">
                {product.description}
              </p>

              {/* Colors */}
              <div className="border-b border-gray-200 py-6">
                <p className="mb-3 text-sm text-black/60">Select Colors</p>
                <div className="flex items-center gap-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      aria-label={color.label}
                      className={`h-9 w-9 rounded-full transition ${
                        selectedColor === color.id
                          ? "ring-2 ring-black ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: color.swatch }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="border-b border-gray-200 py-6">
                <p className="mb-3 text-sm text-black/60">Choose Size</p>
                <div className="flex flex-wrap gap-3">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-[#F0F0F0] text-black/70 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 pt-6">
                <div className="flex items-center gap-4 rounded-full bg-[#F0F0F0] px-4 py-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="text-lg font-semibold text-black/70 transition hover:text-black"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="text-lg font-semibold text-black/70 transition hover:text-black"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  {isInCart ? "Update Cart" : "Add to Cart"}
                </button>
              </div>
              {addedMessage && (
                <p className="mt-3 text-sm font-semibold text-green-600">
                  Added to your cart!
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 border-b border-gray-200">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { id: "details", label: "Product Details" },
                { id: "reviews", label: "Rating & Reviews" },
                { id: "faqs", label: "FAQs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 pb-4 text-sm font-medium transition sm:text-base ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-black/40 hover:text-black/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "details" && (
            <div className="py-8 text-sm leading-relaxed text-black/70 sm:text-base">
              {product.description}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="py-8 text-sm leading-relaxed text-black/70 sm:text-base">
              <p className="mb-3">
                <strong className="text-black">Shipping:</strong> Orders ship
                within 2–3 business days.
              </p>
              <p className="mb-3">
                <strong className="text-black">Returns:</strong> Free returns
                within 30 days of delivery.
              </p>
              <p>
                <strong className="text-black">Sizing:</strong> This item fits
                true to size.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="py-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold sm:text-2xl">
                  All Reviews{" "}
                  <span className="text-black/40">
                    ({ratingCount || SAMPLE_REVIEWS.length})
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <select className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none">
                    <option>Latest</option>
                    <option>Oldest</option>
                    <option>Highest Rating</option>
                  </select>
                  <button className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/90">
                    Write a Review
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {SAMPLE_REVIEWS.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between">
                      <StarRow rating={review.rating} />
                      <span className="text-black/40">•••</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="font-semibold text-black">
                        {review.name}
                      </span>
                      {review.verified && (
                        <span
                          className="text-green-500"
                          title="Verified purchase"
                        >
                          ✔
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-black/60">{review.text}</p>
                    <p className="mt-3 text-xs text-black/40">
                      Posted on {review.date}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-gray-50">
                  Load More Reviews
                </button>
              </div>
            </div>
          )}

          {/* You might also like */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                You Might Also Like
              </h2>
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => {
                  const itemRating = item.rating?.rate ?? 0;
                  return (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1"
                    >
                      <div className="mb-4 flex h-48 items-center justify-center rounded-3xl bg-[#F0EEED] p-4 sm:h-64">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="truncate text-sm font-semibold text-black sm:text-base">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-amber-500 sm:text-sm">
                        <StarRow rating={itemRating} />
                        <span className="text-black/50">
                          {itemRating.toFixed(1)}/5
                        </span>
                      </div>
                      <p className="mt-1 font-bold text-black">
                        ${item.price.toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
