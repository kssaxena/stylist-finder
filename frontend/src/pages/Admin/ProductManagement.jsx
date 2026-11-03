import { useEffect, useRef, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  sku: "",
  price: "",
  stock: "0",
  isActive: true,
};

const ProductManagement = () => {
  const { alertError, alertSuccess } = useToast();
  const alertErrorRef = useRef(alertError);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);

  const loadProducts = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await FetchData("products/admin/list", "get");
      setProducts(response.data.data || []);
    } catch (error) {
      alertErrorRef.current(
        error?.response?.data?.message || "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    FetchData("products/admin/list", "get")
      .then((response) => {
        if (!cancelled) setProducts(response.data.data || []);
      })
      .catch((error) => {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load products.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startEditing = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      sku: product.sku || "",
      price: String(product.price),
      stock: String(product.stock),
      isActive: product.isActive,
    });
    setImages([]);
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    body.append("images", JSON.stringify(editing?.images || []));
    [...images].forEach((image) => body.append("images", image));
    try {
      await FetchData(
        editing
          ? `products/admin/save/${editing._id}`
          : "products/admin/save",
        "post",
        body,
        true,
      );
      alertSuccess(editing ? "Product updated." : "Product added.");
      resetForm();
      await loadProducts();
    } catch (error) {
      alertError(error?.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (product) => {
    try {
      await FetchData(
        `products/admin/status/${product.isActive ? "deactivate" : "activate"}/${product._id}`,
        "post",
        {},
      );
      await loadProducts();
    } catch (error) {
      alertError(error?.response?.data?.message || "Unable to update product.");
    }
  };

  return (
    <section>
      <header className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Product catalog & inventory</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add products, update pricing and stock, or hide products from the store.
        </p>
      </header>

      <form
        onSubmit={submitProduct}
        className="mb-6 grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-2"
      >
        <h3 className="text-lg font-semibold md:col-span-2">
          {editing ? `Edit ${editing.name}` : "Add a product"}
        </h3>
        <label className="text-sm font-medium">
          Product name
          <input
            required
            maxLength="120"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Category
          <input
            required
            maxLength="80"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          SKU (optional)
          <input
            value={form.sku}
            onChange={(event) => setForm({ ...form, sku: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Price (₹)
          <input
            required
            min="1"
            step="0.01"
            type="number"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Available stock
          <input
            required
            min="0"
            step="1"
            type="number"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Product images
          <input
            multiple
            accept="image/*"
            type="file"
            onChange={(event) => setImages(event.target.files || [])}
            className="mt-1 block w-full rounded-lg border px-3 py-2"
          />
          {editing?.images?.length > 0 && images.length === 0 && (
            <span className="mt-1 block text-xs text-neutral-500">
              Current images will be kept.
            </span>
          )}
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Description
          <textarea
            rows="3"
            maxLength="5000"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
          />
          Visible in the customer store
        </label>
        <div className="flex gap-3 md:col-span-2">
          <button
            disabled={saving}
            className="rounded-lg bg-[#8B2954] px-5 py-2 font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Add product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="py-8 text-neutral-600">Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-neutral-100">
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">₹{Number(product.price).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{product.isActive ? "Visible" : "Hidden"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button type="button" onClick={() => startEditing(product)} className="text-[#8B2954] underline">
                        Edit / stock
                      </button>
                      <button type="button" onClick={() => toggleProduct(product)} className="text-neutral-700 underline">
                        {product.isActive ? "Hide" : "Show"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-neutral-500">No products yet. Add your first product above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductManagement;
