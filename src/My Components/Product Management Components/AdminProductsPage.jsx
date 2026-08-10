import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../HomePage Components/Promobar.jsx";
import Navbar from "../HomePage Components/Navbar.jsx";
import Footer from "../HomePage Components/Footer.jsx";
import useAuth from "../Authentication/useAuth.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/shopCoApi.js";
import { getProductImageUrl } from "../../utils/media.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const CATEGORY_OPTIONS = ["Casual", "Formal", "Party", "Gym"];

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  if (Number.isNaN(amount)) return "$0.00";
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (fetchError) {
      setError(fetchError?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const productCount = useMemo(() => products.length, [products]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.category
    ) {
      setError("Fill in title, description, price, stock, and category.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      imageFile,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully.");
      }

      setForm(EMPTY_FORM);
      setImageFile(null);
      setEditingId(null);
      await loadProducts();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          `Unable to ${editingId ? "update" : "create"} product.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? product.quantity ?? "",
      category: product.category || "",
    });
    setImageFile(null);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      setProducts((current) =>
        current.filter((item) => String(item.id) !== String(productId)),
      );
      setSuccess("Product deleted successfully.");
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.message ||
          deleteError?.message ||
          "Unable to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-black">
      <PromoBanner />
      <Navbar />

      <main className="mx-auto max-w-310 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/50">
              Admin workspace
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Add / Manage Products
            </h1>
          </div>
          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black/70 shadow-sm">
            {productCount} products
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.35fr]">
          <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit product" : "Create product"}
              </h2>
              <p className="mt-2 text-sm text-black/60">
                {editingId
                  ? "Update the fields below. Leave the image empty to keep the existing picture."
                  : "Upload a product and its public image URL will flow through the storefront."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-black/80">
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Classic Cotton T-Shirt"
                />
              </label>

              <label className="block text-sm font-medium text-black/80">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="mt-2 w-full rounded-[28px] border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Write a concise product description."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-black/80">
                  Price
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-black"
                    placeholder="39.99"
                  />
                </label>

                <label className="block text-sm font-medium text-black/80">
                  Stock
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-black"
                    placeholder="120"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-black/80">
                Category
                <input
                  list="product-categories"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-gray-200 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Casual"
                />
                <datalist id="product-categories">
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>

              <label className="block text-sm font-medium text-black/80">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] || null)
                  }
                  className="mt-2 block w-full rounded-3xl border border-dashed border-gray-300 bg-[#F8F8F8] px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>

              {(previewUrl || imageFile) && (
                <div className="rounded-3xl border border-gray-200 bg-[#FAFAFA] p-4">
                  <p className="mb-3 text-sm font-semibold text-black/70">
                    Image preview
                  </p>
                  <div className="flex items-center justify-center rounded-3xl bg-white p-4">
                    <img
                      src={previewUrl}
                      alt="Selected product preview"
                      className="max-h-52 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
                >
                  {submitting
                    ? "Saving product..."
                    : editingId
                      ? "Update product"
                      : "Create product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    className="shrink-0 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Existing products</h2>
                <p className="mt-2 text-sm text-black/60">
                  Review inventory and remove products when needed.
                </p>
              </div>
              <button
                type="button"
                onClick={loadProducts}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-black" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-[28px] border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-[#F8F8F8] text-black/70">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Product</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Stock</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {products.map((product) => {
                        const image = getProductImageUrl(product);
                        return (
                          <tr key={product.id} className="align-top">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0EEED]">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={product.title}
                                      className="h-full w-full rounded-2xl object-contain p-2"
                                    />
                                  ) : (
                                    <span className="text-xs font-semibold uppercase text-black/40">
                                      No image
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-black">
                                    {product.title}
                                  </p>
                                  <p className="mt-1 line-clamp-2 max-w-104 text-xs text-black/60">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-black/70">
                              {product.category || "-"}
                            </td>
                            <td className="px-4 py-4 text-black/70">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-4 py-4 text-black/70">
                              {product.stock ?? product.quantity ?? "-"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(product)}
                                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(product.id)}
                                  disabled={deletingId === product.id}
                                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                                >
                                  {deletingId === product.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {!products.length && (
                  <div className="px-4 py-10 text-center text-sm text-black/60">
                    No products have been created yet.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProductsPage;
