import React, { useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";

const BASE_URL = "http://localhost:8080";

// keep these lowercase: the Shop page filters on "feed", "vitamins", "accessories"
const CATEGORIES = ["feed", "vitamins", "accessories", "toys", "grooming"];

const emptyVariant = { size: "", price: "", oldPrice: "", stock: "" };
const emptyForm = {
  productName: "",
  category: "feed",
  description: "",
  price: "",
  oldPrice: "",
  stock: "",
};

const inputClass =
  "w-full rounded-2xl border border-[#4a2a35]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b47c43]";

const toNumber = (value) => (value === "" ? null : Number(value));

// get the admin token straight from localStorage
const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("petilio_user"))?.token;
  } catch {
    return null;
  }
};

// turn a failed response into a readable message
const readError = async (res) => {
  if (res.status === 401) return "Your session has expired. Log in again.";
  if (res.status === 403) return "Only an admin can add products.";
  try {
    const data = await res.json();
    return data.message || Object.values(data).join(", ");
  } catch {
    return `Request failed (${res.status})`;
  }
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#4a2a35]/60">{hint}</span>}
    </label>
  );
}

function AddProduct() {
  const [form, setForm] = useState(emptyForm);
  const [hasSizes, setHasSizes] = useState(false);
  const [variants, setVariants] = useState([{ ...emptyVariant }]);

  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (name) => (e) =>
    setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const setVariantField = (index, name) => (e) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [name]: e.target.value } : v))
    );

  // Step 1: send the file to the backend, get the Cloudinary URL back
  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file); // key must be exactly "file"

      // no Content-Type header here: the browser sets it for FormData
      const res = await fetch(`${BASE_URL}/api/product/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });

      if (!res.ok) throw new Error(await readError(res));

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      setImageUrl("");
      setPreview("");
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    if (!form.productName.trim()) return "Enter the product name.";
    if (!imageUrl) return "Upload a product image.";

    if (hasSizes) {
      for (const [i, v] of variants.entries()) {
        if (!v.size.trim()) return `Enter a name for size ${i + 1}, like 500gm.`;
        if (!(Number(v.price) > 0)) return `Enter a price for size ${i + 1}.`;
        if (v.stock === "" || Number(v.stock) < 0)
          return `Enter the stock for size ${i + 1}.`;
      }
    } else {
      if (!(Number(form.price) > 0)) return "Enter the price.";
      if (form.stock === "" || Number(form.stock) < 0) return "Enter the stock.";
    }
    return "";
  };

  // Step 2: send the product, with the image URL, as JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    const payload = {
      productName: form.productName.trim(),
      category: form.category,
      description: form.description.trim(),
      imageUrl,
      variants: hasSizes
        ? variants.map((v) => ({
            size: v.size.trim(),
            price: toNumber(v.price),
            oldPrice: toNumber(v.oldPrice),
            stock: toNumber(v.stock),
          }))
        : [],
    };

    // a product without sizes keeps its own price and stock
    if (!hasSizes) {
      payload.price = toNumber(form.price);
      payload.oldPrice = toNumber(form.oldPrice);
      payload.stock = toNumber(form.stock);
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/product/createProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readError(res));

      setSuccess(`${payload.productName} was added to the shop.`);
      setForm(emptyForm);
      setVariants([{ ...emptyVariant }]);
      setHasSizes(false);
      setImageUrl("");
      setPreview("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-['Lora',serif] text-4xl font-medium">Add product</h1>
      <p className="mt-2 text-[#4a2a35]/70">
        The product appears in the shop as soon as you save it.
      </p>

      {success && (
        <p role="status" className="mt-6 rounded-2xl bg-[#ffe44d] px-5 py-4 text-sm font-medium">
          {success}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Details */}
        <section className="space-y-5 rounded-3xl bg-white p-7">
          <h2 className="font-['Lora',serif] text-2xl">Details</h2>

          <Field label="Product name">
            <input
              className={inputClass}
              value={form.productName}
              onChange={setField("productName")}
              placeholder="Dry dog foods"
            />
          </Field>

          <Field label="Category">
            <select
              className={inputClass}
              value={form.category}
              onChange={setField("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description" hint="Up to 1000 characters.">
            <textarea
              rows={4}
              maxLength={1000}
              className={inputClass}
              value={form.description}
              onChange={setField("description")}
              placeholder="Tell customers what makes this product good for their pet."
            />
          </Field>
        </section>

        {/* Image */}
        <section className="rounded-3xl bg-white p-7">
          <h2 className="font-['Lora',serif] text-2xl">Image</h2>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#4a2a35]/25 p-6 text-center transition hover:border-[#b47c43] focus-within:border-[#b47c43]">
            {preview ? (
              <img
                src={preview}
                alt="Selected product"
                className="h-48 w-48 rounded-2xl object-cover"
              />
            ) : (
              <ImagePlus size={36} strokeWidth={1.3} />
            )}
            <span className="text-sm">
              {uploading
                ? "Uploading image..."
                : imageUrl
                ? "Image uploaded. Click to choose a different one."
                : "Click to choose a JPG, PNG or WebP image (up to 5 MB)"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImage}
              disabled={uploading}
            />
          </label>
        </section>

        {/* Price and stock */}
        <section className="space-y-5 rounded-3xl bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-['Lora',serif] text-2xl">Price and stock</h2>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="h-4 w-4 accent-[#4a2a35]"
              />
              This product comes in sizes
            </label>
          </div>

          {!hasSizes ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (INR)">
                <input type="number" min="0" className={inputClass} value={form.price} onChange={setField("price")} />
              </Field>
              <Field label="Old price (INR)" hint="Shown crossed out.">
                <input type="number" min="0" className={inputClass} value={form.oldPrice} onChange={setField("oldPrice")} />
              </Field>
              <Field label="Stock">
                <input type="number" min="0" className={inputClass} value={form.stock} onChange={setField("stock")} />
              </Field>
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-2xl bg-[#faeee9] p-4 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end"
                >
                  <Field label="Size">
                    <input className={inputClass} value={v.size} onChange={setVariantField(i, "size")} placeholder="500gm" />
                  </Field>
                  <Field label="Price">
                    <input type="number" min="0" className={inputClass} value={v.price} onChange={setVariantField(i, "price")} />
                  </Field>
                  <Field label="Old price">
                    <input type="number" min="0" className={inputClass} value={v.oldPrice} onChange={setVariantField(i, "oldPrice")} />
                  </Field>
                  <Field label="Stock">
                    <input type="number" min="0" className={inputClass} value={v.stock} onChange={setVariantField(i, "stock")} />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                    disabled={variants.length === 1}
                    aria-label={`Remove size ${i + 1}`}
                    className="rounded-xl p-3 transition hover:bg-white disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setVariants((prev) => [...prev, { ...emptyVariant }])}
                className="inline-flex items-center gap-2 rounded-full border border-[#4a2a35] px-5 py-2.5 text-sm font-medium transition hover:bg-[#4a2a35]/10"
              >
                <Plus size={16} />
                Add another size
              </button>
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-full bg-[#ffe44d] py-4 text-sm font-bold uppercase tracking-widest transition hover:bg-[#4a2a35] hover:text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;