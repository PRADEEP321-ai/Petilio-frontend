import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

const API_URL = "http://localhost:8080/api/product";
const CART_URL = "http://localhost:8080/api/cart";

// Request headers with the login token
// ADJUST: assumes your login saved a JWT as user.token inside "petilio_user"
const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("petilio_user") || "{}");
  const token = user.token || user.accessToken || user.jwt || user.jwtToken;

  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const faqs = [
  {
    question: "What is included in this product?",
    answer: "Please check the product description for ingredients, size, and other product information.",
  },
  {
    question: "How do I add a new question or answer?",
    answer: "You can contact our customer support team for help with product-related questions.",
  },
  {
    question: "Where can I find product information?",
    answer: "Product details, ingredients, and available sizes are displayed on this page.",
  },
  {
    question: "Can I return this product?",
    answer: "Returns are subject to our return policy. Please contact customer support for assistance.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery time depends on your location and will be shown during checkout.",
  },
];

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

// Convert backend product into frontend format
const formatProduct = (item) => ({
  ...item,
  id: item.id,
  name: item.productName || item.name || item.title,
  image: item.imageUrl || item.image || item.img,
  oldPrice: item.oldPrice || 0,
  variants: item.variants || [],
});

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(
    location.state?.product
      ? formatProduct(location.state.product)
      : null
  );

  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Product not found.");
        }

        const data = await response.json();
        const productData = formatProduct(data);

        setProduct(productData);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Available product variants
  const variants = product?.variants || [];

  const selectedVariant = variants.find(
    (variant) => String(variant.id) === String(selectedVariantId)
  ) || variants[0];

  // Select first variant when product loads
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariantId(String(variants[0].id));
    } else {
      setSelectedVariantId("");
    }

    setQuantity(1);
    setAdded(false);
    setSelectedImage(0);
  }, [product?.id]);

  // Product images
  const productImages = product?.images?.length
    ? product.images
    : [product?.image].filter(Boolean);

  const productName = product?.name || "Product";

  // Selected variant price or normal product price
  const productPrice = Number(
    selectedVariant?.price ?? product?.price ?? 0
  );

  const oldPrice = Number(
    selectedVariant?.oldPrice ?? product?.oldPrice ?? 0
  );

  const stock = Number(
    selectedVariant?.stock ?? product?.stock ?? 0
  );

  // Add to cart (saved in the database through the cart API)
  const handleAddToCart = async () => {
    if (!product || adding) return;

    // Check login
    const user = localStorage.getItem("petilio_user");

    if (!user) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    // The cart works with variants, so a variant is required
    if (!selectedVariant) {
      alert("This product has no size or variant to add to the cart.");
      return;
    }

    // Check stock
    if (stock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    if (quantity > stock) {
      alert(`Only ${stock} items are available.`);
      return;
    }

    try {
      setAdding(true);

      // save the item in the database
      const response = await fetch(`${CART_URL}/add`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: quantity,
        }),
      });

      // token missing or expired
      if (response.status === 401) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      // backend errors like "Only 3 items available in stock."
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not add to cart.");
      }

      const cartData = await response.json();

      // update the Navbar cart count
      localStorage.setItem("petilio_cart", JSON.stringify(cartData.items));
      window.dispatchEvent(new Event("cartUpdated"));

      setAdded(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf4] text-[#4a2a35]">
        Loading product...
      </div>
    );
  }

  // Product not found
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf4] px-5 text-center text-[#4a2a35]">
        <h2 className="font-['Playfair_Display',serif] text-3xl">
          Product not found
        </h2>

        <p className="mt-3 text-gray-600">
          {error || "Please return to the shop and select a product."}
        </p>

        <Link
          to="/shop"
          className="mt-6 rounded-full bg-[#4a2a35] px-8 py-3 text-sm font-semibold text-white hover:bg-[#b47c43]"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbefea] text-[#4a2a35]">

      {/* PRODUCT INFORMATION */}
      <section className="bg-[#4a2a35] px-5 py-12 text-white sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">

          {/* PRODUCT IMAGES */}
          <div>
            <button
              onClick={() => navigate("/shop")}
              className="mb-5 flex items-center gap-2 text-sm text-white/80 transition hover:text-[#ffe44d]"
            >
              <ArrowLeft size={17} />
              Back to Shop
            </button>

            <div className="aspect-square overflow-hidden rounded-2xl bg-[#e5dce9]">
              {productImages.length > 0 ? (
                <img
                  src={productImages[selectedImage]}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#4a2a35]">
                  No product image available
                </div>
              )}
            </div>

            {/* IMAGE THUMBNAILS */}
            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index
                        ? "border-[#ffe44d]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ffe44d]">
              {product.category || "Pet Essentials"}
            </p>

            <h1 className="font-['Playfair_Display',serif] text-4xl font-semibold leading-tight text-[#ffe44d] sm:text-5xl">
              {productName}
            </h1>

            {/* PRICE */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold">
                {formatPrice(productPrice)}
              </span>

              {oldPrice > productPrice && (
                <span className="text-sm text-white/50 line-through">
                  {formatPrice(oldPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/85">
              {product.description ||
                "Give your beloved pet the quality and care they deserve. Explore this product and make your pet's everyday life more comfortable."}
            </p>

            {/* SIZE SELECTION FROM DATABASE */}
            {variants.some((variant) => variant.size) && (
              <div className="mt-7">
                <label className="mb-3 block text-sm font-medium">
                  Select Size
                </label>

                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariantId(String(variant.id));
                        setQuantity(1);
                        setAdded(false);
                      }}
                      className={`min-w-16 rounded-full border px-5 py-2 text-sm transition ${
                        String(selectedVariantId) === String(variant.id)
                          ? "border-[#ffe44d] bg-[#ffe44d] text-[#4a2a35]"
                          : "border-white/80 text-white hover:border-[#ffe44d]"
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STOCK */}
            <p className="mt-5 text-sm">
              {stock > 0 ? (
                <span className="text-green-300">
                  In Stock: {stock}
                </span>
              ) : (
                <span className="text-red-300">
                  Out of Stock
                </span>
              )}
            </p>

            {/* QUANTITY */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-medium">
                Quantity
              </label>

              <div className="flex w-32 items-center justify-between rounded-full border border-white/80 px-4 py-2">
                <button
                  onClick={() =>
                    setQuantity((previous) => Math.max(1, previous - 1))
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span className="text-sm">{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((previous) =>
                      Math.min(stock, previous + 1)
                    )
                  }
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                  className="disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0 || adding}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-[#ffe44d] py-4 text-sm font-bold uppercase tracking-widest text-[#4a2a35] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              {stock <= 0
                ? "Out of Stock"
                : adding
                  ? "Adding..."
                  : added
                    ? "Added to Cart"
                    : "Add to Cart"}
            </button>

            {added && (
              <button
                onClick={() => navigate("/cart")}
                className="mt-4 text-center text-sm text-[#ffe44d] underline underline-offset-4"
              >
                View Cart
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#f9dfca] px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-7 text-center font-['Playfair_Display',serif] text-3xl sm:text-4xl">
            Faq
          </h2>

          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[#bfa99e]">
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm"
                >
                  {faq.question}

                  <ChevronDown
                    size={17}
                    className={`shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <p className="pb-4 text-sm leading-6 text-[#765d58]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS */}
      {location.state?.relatedProducts?.length > 0 && (
        <section className="bg-[#fbefea] px-5 py-14 sm:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-7 font-['Playfair_Display',serif] text-3xl sm:text-4xl">
              You might also like
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {location.state.relatedProducts.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  state={{
                    product: item,
                    relatedProducts: location.state.relatedProducts.filter(
                      (related) => related.id !== item.id
                    ),
                  }}
                  className="group"
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-white">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name || item.productName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    {item.name || item.productName}
                  </h3>

                  <p className="mt-2 text-sm text-[#765d58]">
                    {formatPrice(
                      item.variants?.[0]?.price ?? item.price
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;