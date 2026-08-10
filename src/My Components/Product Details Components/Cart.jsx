import React from "react";
import PromoBanner from "../HomePage Components/Promobar.jsx";
import Navbar from "../HomePage Components/Navbar.jsx";
import Footer from "../HomePage Components/Footer.jsx";
import { useState, useEffect } from "react";
import { getCart, hydrateCart, removeFromCart } from "./cartStore.js";
import { getProductImageUrl } from "../../utils/media.js";

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => getCart());
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState(() => {
    const items = getCart();
    return Object.fromEntries(
      items.map((item) => [item.productId, item.quantity || 1]),
    );
  });

  useEffect(() => {
    const localItems = getCart();
    const localQuantities = Object.fromEntries(
      localItems.map((item) => [item.productId, item.quantity || 1]),
    );
    setCartItems(localItems);
    setQuantities(localQuantities);

    const storedUser = JSON.parse(localStorage.getItem("ecomm_user") || "null");
    const userId = storedUser?.id;
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const syncCartFromBackend = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/carts/${userId}`, { headers });
        const text = await response.text();
        let data = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { message: text };
        }

        if (!response.ok) {
          throw new Error(
            data?.message || response.statusText || "Unable to load cart",
          );
        }

        const backendItems = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.cartItems)
            ? data.cartItems
            : [];

        const mergedItems = [...localItems];

        backendItems.forEach((item) => {
          const productId = item.productId ?? item.product?.id ?? item.id;
          if (!productId) return;

          const existingIndex = mergedItems.findIndex(
            (entry) => entry.productId === productId,
          );
          const quantity = Math.max(
            Number(item.quantity || 1),
            Number(mergedItems[existingIndex]?.quantity || 1),
          );

          const normalizedItem = {
            productId,
            quantity,
            name: item.name ?? item.product?.name ?? item.title,
            price: item.price ?? item.product?.price,
            image: item.image ?? item.product?.image,
          };

          if (existingIndex >= 0) {
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              ...normalizedItem,
            };
          } else {
            mergedItems.push(normalizedItem);
          }
        });

        hydrateCart(mergedItems);
        setCartItems(mergedItems);
        setQuantities(
          Object.fromEntries(
            mergedItems.map((item) => [item.productId, item.quantity || 1]),
          ),
        );
      } catch (error) {
        console.error("Cart load error:", error);
      }
    };

    syncCartFromBackend().finally(() => {
      fetch("/api/products", { headers })
        .then(async (response) => {
          const text = await response.text();
          let data = null;

          try {
            data = text ? JSON.parse(text) : null;
          } catch {
            data = { message: text };
          }

          if (!response.ok) {
            throw new Error(
              data?.message || response.statusText || "Unable to load products",
            );
          }

          return data;
        })
        .then((data) => {
          const productsMap = {};
          (data || []).forEach((product) => {
            productsMap[product.id] = product;
          });
          setProducts(productsMap);
        })
        .catch((error) => {
          console.error("Products load error:", error);
          setProducts({});
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

  const handleQuantityChange = (productId, delta) => {
    const currentQuantity = Math.max(1, (quantities[productId] || 1) + delta);
    const product =
      products[productId] ||
      cartItems.find((item) => item.productId === productId);
    const updatedItems = cartItems.map((item) => {
      if (item.productId !== productId) return item;
      const updatedItem = {
        ...item,
        quantity: currentQuantity,
        name: product?.title ?? product?.name ?? item.name,
        price: product?.price ?? item.price,
        image: getProductImageUrl(product) || item.image,
      };
      return updatedItem;
    });

    setCartItems(updatedItems);
    setQuantities((prev) => ({
      ...prev,
      [productId]: currentQuantity,
    }));
    hydrateCart(updatedItems);
  };

  const handleDeleteItem = (productId) => {
    removeFromCart(productId);
    const nextItems = getCart().filter((item) => item.productId !== productId);
    setCartItems(nextItems);
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId] || item;
      const price = Number(product?.price || item?.price || 0);
      return total + price * (quantities[item.productId] || item.quantity || 1);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = subtotal * 0.2; // 20% discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] text-black">
        <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-6 sm:mb-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-black/60 sm:text-sm">
              <p className="font-['Satoshi']">Home</p>
              <span>&gt;</span>
              <span className="font-semibold text-black">Cart</span>
            </div>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight sm:mt-4 sm:text-4xl lg:text-[48px]">
              Your Cart
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
            <div className="space-y-3 sm:space-y-4">
              {cartItems.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-black/60 sm:rounded-[32px]">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => {
                    const product = products[item.productId] || item;
                    const quantity =
                      quantities[item.productId] || item.quantity || 1;
                    return (
                      <div
                        key={item.productId}
                        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-[32px] sm:p-6"
                      >
                        <button
                          onClick={() => handleDeleteItem(item.productId)}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-red-500 transition hover:bg-red-50 sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:rounded-2xl"
                        >
                          <img
                            src="/src/assets/Delete.svg"
                            alt="Delete"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                          />
                        </button>

                        <div className="flex flex-row items-start gap-3 sm:items-center sm:gap-4">
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F4] p-2 sm:h-28 sm:w-28 sm:rounded-[28px] sm:p-4">
                            {getProductImageUrl(product) ? (
                              <img
                                src={getProductImageUrl(product)}
                                alt={product.title || product.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <span className="text-center text-[10px] font-semibold uppercase text-black/40">
                                No image
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 pr-8 sm:pr-0">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-lg">
                              {product.title || product.name}
                            </h3>
                            <p className="mt-1 text-xs text-black/60 sm:mt-2 sm:text-sm">
                              Size: Large • Color: White
                            </p>
                            <p className="mt-2 text-base font-bold text-black sm:mt-4 sm:text-xl">
                              ${(product.price * quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-end sm:mt-4">
                          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-[#F8F8F8] px-2 py-1 sm:px-3 sm:py-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.productId, -1)
                              }
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-base font-semibold text-black/70 transition hover:text-black sm:h-9 sm:w-9 sm:text-lg"
                            >
                              −
                            </button>
                            <span className="min-w-[28px] text-center text-xs font-semibold sm:min-w-[36px] sm:text-sm">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.productId, 1)
                              }
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-base font-semibold text-black/70 transition hover:text-black sm:h-9 sm:w-9 sm:text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-6">
                <h2 className="text-lg font-bold sm:text-xl">Order Summary</h2>
                <p className="mt-2 text-xs text-black/60 sm:text-sm">
                  Review your order and proceed to checkout.
                </p>

                <div className="mt-6 space-y-3 text-sm text-black/70 sm:mt-8 sm:space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (-20%)</span>
                    <span className="font-semibold text-red-500">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4 sm:mt-6 sm:pt-5">
                  <div className="flex justify-between text-base font-bold text-black sm:text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <input
                      type="text"
                      placeholder="Add promo code"
                      className="flex-1 rounded-full border border-gray-200 bg-[#F8F8F8] px-4 py-2.5 text-sm text-black/80 outline-none focus:border-black focus:ring-0 sm:py-3"
                    />
                    <button className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90 sm:py-3">
                      Apply
                    </button>
                  </div>
                  <button className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-black/90 sm:text-base">
                    Go to Checkout →
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
