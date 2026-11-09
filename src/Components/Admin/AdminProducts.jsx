
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  Upload,
  ImagePlus,
  RefreshCw,
} from "lucide-react";

const BASE_URL = "http://localhost:8080";

const emptyForm = {
  productName: "",
  category: "",
  description: "",
  imageUrl: "",
  hasVariants: false,
  price: "",
  oldPrice: "",
  stock: "",
  variants: [
    {
      size: "",
      price: "",
      oldPrice: "",
      stock: "",
    },
  ],
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get logged-in admin from localStorage
  const user = JSON.parse(
    localStorage.getItem("petilio_user") || "null"
  );

  const token = user?.token;

  // Check admin login
  useEffect(() => {
    if (!user || !token || user.role !== "ADMIN") {
      navigate("/login", { replace: true });
    }
  }, []);

  // Common headers
  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // Handle API response
  const readResponse = async (response) => {
    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null) ||
        "Something went wrong"
      );
    }

    return data;
  };

  // Get all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/product/getAllProducts`
      );

      const data = await readResponse(response);

      const productList = Array.isArray(data)
        ? data
        : data?.content || data?.products || data?.data || [];

      setProducts(productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "ADMIN") {
      fetchProducts();
    }
  }, []);

  // Open Add Product modal
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      variants: [
        { size: "", price: "", oldPrice: "", stock: "" },
      ],
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Open Edit Product modal
  const openEditModal = (product) => {
    setEditingId(product.id);

    const variants = product.variants || [];

    setFormData({
      productName: product.productName || "",
      category: product.category || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",

      hasVariants: variants.length > 0,

      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",

      variants:
        variants.length > 0
          ? variants.map((variant) => ({
              size: variant.size || "",
              price: variant.price ?? "",
              oldPrice: variant.oldPrice ?? "",
              stock: variant.stock ?? "",
            }))
          : [
              {
                size: "",
                price: "",
                oldPrice: "",
                stock: "",
              },
            ],
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Handle normal form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle variant inputs
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;

    const updatedVariants = [...formData.variants];

    updatedVariants[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  // Add another variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          price: "",
          oldPrice: "",
          stock: "",
        },
      ],
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Upload product image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const imageData = new FormData();
      imageData.append("file", file);

      const response = await fetch(
        `${BASE_URL}/api/product/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageData,
        }
      );

      const data = await readResponse(response);

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
      }));

      setSuccess("Image uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Create or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.imageUrl.trim()) {
        throw new Error("Please upload a product image.");
      }

      if (formData.hasVariants) {
        if (formData.variants.length === 0) {
          throw new Error("Please add at least one product variant.");
        }

        for (const variant of formData.variants) {
          if (
            !variant.size.trim() ||
            variant.price === "" ||
            variant.stock === ""
          ) {
            throw new Error(
              "Please fill in size, price and stock for every variant."
            );
          }
        }
      } else {
        if (
          formData.price === "" ||
          formData.stock === ""
        ) {
          throw new Error("Please enter product price and stock.");
        }
      }

      const payload = {
        productName: formData.productName.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,

        price: formData.hasVariants
          ? null
          : Number(formData.price),

        oldPrice: formData.hasVariants
          ? null
          : formData.oldPrice === ""
            ? null
            : Number(formData.oldPrice),

        stock: formData.hasVariants
          ? null
          : Number(formData.stock),

        variants: formData.hasVariants
          ? formData.variants.map((variant) => ({
              size: variant.size.trim(),
              price: Number(variant.price),
              oldPrice:
                variant.oldPrice === ""
                  ? null
                  : Number(variant.oldPrice),
              stock: Number(variant.stock),
            }))
          : [],
      };

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${BASE_URL}/api/product/id/${editingId}`
        : `${BASE_URL}/api/product/createProduct`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      await readResponse(response);

      setSuccess(
        isEditing
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      setShowModal(false);
      setFormData(emptyForm);

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/product/id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await readResponse(response);

      setSuccess("Product deleted successfully!");

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Search products
  const filteredProducts = products.filter((product) =>
    product.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!user || !token || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#b58b58]">
            PETILIO ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold text-[#38251f]">
            Manage Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add, edit and manage your store products.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#38251f] px-5 py-3 font-semibold text-white transition hover:bg-[#4a2a35]"
        >
          <Plus size={19} />
          Add Product
        </button>
      </div>

      {/* Messages */}
      {error && !showModal && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && !showModal && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
          <button onClick={() => setSuccess("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Product Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#eee2d8] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="mt-2 text-3xl font-bold text-[#38251f]">
                {products.length}
              </h2>
            </div>

            <div className="rounded-xl bg-[#faeee9] p-3 text-[#4a2a35]">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eee2d8] bg-white p-5">
          <p className="text-sm text-gray-500">In Stock</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {products.filter((product) => {
              const variants = product.variants || [];

              return variants.length > 0
                ? variants.some((v) => Number(v.stock) > 0)
                : Number(product.stock) > 0;
            }).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#eee2d8] bg-white p-5">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {products.filter((product) => {
              const variants = product.variants || [];

              return variants.length > 0
                ? variants.every((v) => Number(v.stock) <= 0)
                : Number(product.stock) <= 0;
            }).length}
          </h2>
        </div>

      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eee2d8] bg-white">

        <div className="flex flex-col gap-4 border-b border-[#eee2d8] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#38251f]">
            All Products
          </h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#b58b58] sm:w-64"
              />
            </div>

            <button
              onClick={fetchProducts}
              className="rounded-xl border border-gray-200 p-3 text-[#38251f] hover:bg-[#fffaf4]"
              title="Refresh products"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package
              size={40}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-600">
              No products found.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first product to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-[#fffaf4] text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const variants = product.variants || [];

                  const totalStock =
                    variants.length > 0
                      ? variants.reduce(
                          (total, v) => total + Number(v.stock || 0),
                          0
                        )
                      : Number(product.stock || 0);

                  const priceLabel =
                    variants.length > 0
                      ? `${variants.length} variants`
                      : `₹${product.price ?? 0}`;

                  return (
                    <tr key={product.id} className="hover:bg-[#fffaf4]/60">

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="h-14 w-14 rounded-xl border border-gray-100 object-cover"
                          />

                          <div>
                            <p className="font-semibold text-[#38251f]">
                              {product.productName}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.category || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#38251f]">
                        {priceLabel}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            totalStock > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {totalStock > 0
                            ? `${totalStock} units`
                            : "Out of stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-lg bg-[#faeee9] p-2.5 text-[#4a2a35] hover:bg-[#f5dfd7]"
                            title="Edit product"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                            title="Delete product"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6">

          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">
              <div>
                <h2 className="text-xl font-bold text-[#38251f]">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your product information below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b58b58]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#b58b58]"
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Treats">Treats</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Write product description..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b58b58]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Product Image *
                </label>

                <div className="rounded-xl border-2 border-dashed border-gray-200 p-4">

                  {formData.imageUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        className="h-36 w-36 rounded-xl object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: "",
                          }))
                        }
                        className="text-sm font-medium text-red-500"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 py-5">
                      {uploading ? (
                        <Upload className="animate-pulse text-[#b58b58]" size={30} />
                      ) : (
                        <ImagePlus size={30} className="text-[#b58b58]" />
                      )}

                      <span className="text-sm font-semibold text-[#38251f]">
                        {uploading
                          ? "Uploading image..."
                          : "Click to upload image"}
                      </span>

                      <span className="text-xs text-gray-400">
                        Select a product image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}

                </div>
              </div>

              {/* Product Variants Toggle */}
              <div className="rounded-xl bg-[#fffaf4] p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.hasVariants}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasVariants: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#38251f]"
                  />

                  <span className="font-semibold text-[#38251f]">
                    This product has different sizes / variants
                  </span>
                </label>

                <p className="mt-2 pl-7 text-xs text-gray-500">
                  Example: 500gm, 1kg, 2kg and 5kg.
                </p>
              </div>

              {/* Normal Product Price and Stock */}
              {!formData.hasVariants && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                      Price (₹) *
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b58b58]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                      Old Price (₹)
                    </label>

                    <input
                      type="number"
                      name="oldPrice"
                      min="0"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b58b58]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                      Stock *
                    </label>

                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b58b58]"
                    />
                  </div>

                </div>
              )}

              {/* Product Variants */}
              {formData.hasVariants && (
                <div className="space-y-4">

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#38251f]">
                      Product Variants
                    </h3>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-1 text-sm font-semibold text-[#9b7447]"
                    >
                      <Plus size={17} />
                      Add Variant
                    </button>
                  </div>

                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-4"
                    >

                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-semibold text-[#38251f]">
                          Variant {index + 1}
                        </h4>

                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <input
                          type="text"
                          name="size"
                          placeholder="Size (e.g. 1kg)"
                          value={variant.size}
                          onChange={(e) =>
                            handleVariantChange(index, e)
                          }
                          required
                          className="rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#b58b58]"
                        />

                        <input
                          type="number"
                          name="price"
                          placeholder="Price (₹)"
                          min="0.01"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, e)
                          }
                          required
                          className="rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#b58b58]"
                        />

                        <input
                          type="number"
                          name="oldPrice"
                          placeholder="Old Price (₹)"
                          min="0"
                          step="0.01"
                          value={variant.oldPrice}
                          onChange={(e) =>
                            handleVariantChange(index, e)
                          }
                          className="rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#b58b58]"
                        />

                        <input
                          type="number"
                          name="stock"
                          placeholder="Stock quantity"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, e)
                          }
                          required
                          className="rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#b58b58]"
                        />

                      </div>
                    </div>
                  ))}

                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-[#38251f] px-6 py-3 font-semibold text-white hover:bg-[#4a2a35] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Create Product"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProducts;
