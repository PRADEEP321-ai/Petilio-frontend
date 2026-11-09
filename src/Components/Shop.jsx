import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, PackageOpen, Truck } from "lucide-react";

const API_URL = "http://localhost:8080/api/product/getAllProducts";

const FILTERS = ["all", "feed", "vitamins", "accessories"];

// ---------- FORMAT PRICE ----------
const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

// ---------- DELIVERY STEPS ----------
const STEPS = [
  {
    Icon: ShoppingBag,
    title: "Choose your item",
    text: "Use this space to promote the business, its products or its services.",
  },
  {
    Icon: PackageOpen,
    title: "Ready to dispatch",
    text: "You can choose from delivery to your home address or local Parcelshop.",
  },
  {
    Icon: Truck,
    title: "Tracking your item",
    text: "We can send order updates to our customers through text and email.",
  },
];

// ---------- FILTER BUTTON ----------
function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border border-[#4a2a35] px-6 py-2.5 text-sm font-medium uppercase tracking-widest transition
        ${
          active
            ? "bg-[#4a2a35] text-white"
            : "text-[#4a2a35] hover:bg-[#4a2a35]/10"
        }`}
    >
      {label}
    </button>
  );
}

// ---------- PRODUCT CARD ----------
function ProductCard({ product, relatedProducts }) {
  return (
    <div className="group">
      <Link
        to={`/product/${product.id}`}
        state={{ product, relatedProducts }}
        className="block"
      >
        <div className="aspect-[6/7] overflow-hidden rounded-3xl bg-white">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name || "Pet product"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        <div className="px-5 pt-4">
          <h3 className="text-base font-medium text-[#4a2a35] transition group-hover:text-[#b47c43]">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-[#4a2a35]/70">
            {formatPrice(product.price)}

            {Number(product.oldPrice) > Number(product.price) && (
              <span className="ml-2 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}

// ---------- DELIVERY STEP ----------
function Step({ Icon, title, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-[#4a2a35] text-[#4a2a35]">
        <Icon size={34} strokeWidth={1.2} />
      </div>

      <div>
        <h4 className="font-serif text-2xl font-medium text-[#4a2a35]">
          {title}
        </h4>

        <p className="mt-1 max-w-[260px] text-sm text-[#4a2a35]/70">
          {text}
        </p>
      </div>
    </div>
  );
}

// ---------- SHOP COMPONENT ----------
function Shop() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- FETCH PRODUCTS ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        // Handle different backend response formats
        const productList = Array.isArray(data)
          ? data
          : data.content || data.products || data.data || [];

        if (!Array.isArray(productList)) {
          throw new Error("Invalid product data received from server.");
        }

        // Convert backend products into frontend format
        const formattedProducts = productList.map((item) => {
          const variants = item.variants || [];
          const firstVariant = variants[0];

          const category = String(item.category || "").toLowerCase();

          return {
            ...item,

            id: item.id,

            name:
              item.productName ||
              item.name ||
              item.title ||
              "Unnamed Product",

            image:
              item.imageUrl ||
              item.image ||
              item.img ||
              "",

            price:
              firstVariant?.price ??
              item.price ??
              0,

            oldPrice:
              firstVariant?.oldPrice ??
              item.oldPrice ??
              0,

            category: ["food", "treats", "feed"].includes(category)
              ? "feed"
              : category,

            variants: variants,
          };
        });

        setProducts(formattedProducts);

      } catch (err) {
        setError(err.message || "Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------- FILTER PRODUCTS ----------
  const visibleProducts =
    activeFilter === "all"
      ? products
      : products.filter(
          (product) => product.category === activeFilter
        );

  // ---------- UI ----------
  return (
    <div className="font-['DM_Sans',sans-serif] text-[#4a2a35]">

      {/* PRODUCTS */}
      <section className="bg-[#faeee9] pb-24 pt-20">
        <div className="mx-auto max-w-[1100px] px-6">

          {/* HEADING AND FILTERS */}
          <div className="mb-14 flex flex-wrap items-center justify-between gap-6">
            <h2 className="font-['Lora',serif] text-5xl font-medium">
              Our latest products
            </h2>

            <div className="flex flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <FilterButton
                  key={filter}
                  label={filter}
                  active={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                />
              ))}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="py-10 text-center">
              Loading products...
            </p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p className="py-10 text-center text-red-600">
              {error}
            </p>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && (
            visibleProducts.length > 0 ? (
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    relatedProducts={products.filter(
                      (item) => item.id !== product.id
                    )}
                  />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center">
                No products found.
              </p>
            )
          )}

        </div>
      </section>

      {/* DELIVERY STEPS */}
      <section className="bg-[#ffe44d] py-12">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <Step key={step.title} {...step} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Shop;
