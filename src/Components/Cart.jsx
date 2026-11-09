import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
} from "lucide-react";

const CART_URL = "http://localhost:8080/api/cart";

// Request headers with the login token
// ADJUST: assumes your login saved a JWT as user.token inside "petilio_user"
const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("petilio_user") || "{}");
  const headers = { "Content-Type": "application/json" };

  if (user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  return headers;
};

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // item that is being updated

  // Call the cart API and return the cart from the server
  const callCart = async (path, method) => {
    const response = await fetch(`${CART_URL}${path}`, {
      method: method,
      headers: getHeaders(),
    });

    // token missing or expired
    if (response.status === 401) {
      navigate("/login");
      throw new Error("Please login again.");
    }

    // backend errors like "Only 3 items available in stock."
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Something went wrong.");
    }

    return response.json();
  };

  // Show the cart that came from the server
  const showCart = (cartData) => {
    const items = cartData.items.map((item) => ({
      id: item.id, // cart item id
      name: item.productName,
      image: item.imageUrl,
      size: item.variantName,
      price: Number(item.price),
      quantity: item.quantity,
    }));

    setCart(items);

    // update the Navbar cart count
    localStorage.setItem("petilio_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Load cart from the database
  const loadCart = async () => {
    const user = localStorage.getItem("petilio_user");

    // logged out: show empty cart
    if (!user) {
      setCart([]);
      localStorage.removeItem("petilio_cart");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      showCart(await callCart("", "GET"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load when page opens, and again after login or logout
  useEffect(() => {
    loadCart();

    window.addEventListener("authUpdated", loadCart);

    return () => {
      window.removeEventListener("authUpdated", loadCart);
    };
  }, []);

  // Change quantity of one item
  const changeQuantity = async (item, newQuantity) => {
    try {
      setBusyId(item.id);
      setError("");
      showCart(await callCart(`/item/${item.id}?quantity=${newQuantity}`, "PUT"));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Remove product
  const handleRemove = async (item) => {
    try {
      setBusyId(item.id);
      setError("");
      showCart(await callCart(`/item/${item.id}`, "DELETE"));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Increase quantity
  const handleIncrease = (item) => {
    changeQuantity(item, item.quantity + 1);
  };

  // Decrease quantity (remove the item when it reaches 0)
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      handleRemove(item);
    } else {
      changeQuantity(item, item.quantity - 1);
    }
  };

  // Calculate total items
  const totalItems = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  // Delivery fee
  const deliveryFee = subtotal >= 999 ? 0 : 49;

  // Final total
  const total = subtotal + deliveryFee;

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf4] text-[#4a2a35]">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] px-4 py-10 text-[#38251f] sm:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADING */}
        <div className="mb-10">
          <Link
            to="/shop"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#9a7469] transition hover:text-[#b47c43]"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#b47c43]">
                Your Shopping Bag
              </p>

              <h1 className="font-['Playfair_Display',serif] text-4xl font-semibold sm:text-5xl">
                My Cart
              </h1>

              <p className="mt-3 text-sm text-[#967b72]">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            {cart.length > 0 && (
              <span className="rounded-full bg-[#f7e8d9] px-5 py-2 text-sm font-semibold text-[#7a5147]">
                {totalItems} Products
              </span>
            )}
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="rounded-3xl border border-[#efdfd3] bg-white px-5 py-16 text-center shadow-sm sm:py-20">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#faeee9]">
              <ShoppingBag
                size={42}
                strokeWidth={1.3}
                className="text-[#b47c43]"
              />
            </div>

            <h2 className="mt-7 font-['Playfair_Display',serif] text-3xl font-semibold">
              Your cart is waiting for some love!
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#967b72]">
              Looks like you haven't added anything to your shopping bag yet.
              Explore our collection and find something special for your pet.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#4a2a35] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#b47c43]"
            >
              Start Shopping
              <ArrowLeft size={17} className="rotate-180" />
            </Link>
          </div>

        ) : (

          /* CART CONTENT */
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

            {/* LEFT SIDE - PRODUCTS */}
            <div className="rounded-3xl border border-[#efdfd3] bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-7 flex items-center justify-between border-b border-[#f0e4dc] pb-5">
                <h2 className="font-['Playfair_Display',serif] text-2xl font-semibold">
                  Shopping Items
                </h2>

                <span className="text-xs font-medium text-[#967b72]">
                  {cart.length} different products
                </span>
              </div>

              <div className="space-y-7">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-5 border-b border-[#f0e4dc] pb-7 sm:flex-row ${
                      busyId === item.id ? "opacity-60" : ""
                    }`}
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-[#faeee9] sm:h-36 sm:w-36">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag size={35} className="text-[#b47c43]" />
                        </div>
                      )}
                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="flex flex-1 flex-col justify-between gap-4">

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b47c43]">
                          Pet Essentials
                        </p>

                        <h3 className="mt-2 font-['Playfair_Display',serif] text-xl font-semibold">
                          {item.name}
                        </h3>

                        {item.size && (
                          <p className="mt-2 text-xs text-[#967b72]">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-semibold text-[#4a2a35]">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">

                        {/* QUANTITY CONTROL */}
                        <div className="flex items-center gap-4 rounded-full border border-[#eadbd2] px-4 py-2">

                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={busyId === item.id}
                            aria-label="Decrease quantity"
                            className="text-[#765d58] transition hover:text-[#b47c43] disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-4 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            disabled={busyId === item.id}
                            aria-label="Increase quantity"
                            className="text-[#765d58] transition hover:text-[#b47c43] disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                        {/* REMOVE BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          disabled={busyId === item.id}
                          className="flex items-center gap-2 text-xs font-semibold text-[#a17f78] transition hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>

                      </div>
                    </div>

                    {/* ITEM TOTAL */}
                    <div className="text-left sm:min-w-24 sm:text-right">
                      <p className="text-xs text-[#967b72]">
                        Item Total
                      </p>

                      <p className="mt-2 font-bold text-[#b47c43]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#765d58] transition hover:text-[#b47c43]"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:sticky lg:top-28">

              <div className="rounded-3xl border border-[#efdfd3] bg-white p-6 shadow-sm sm:p-7">

                <h2 className="font-['Playfair_Display',serif] text-2xl font-semibold">
                  Order Summary
                </h2>

                <p className="mt-2 text-xs text-[#967b72]">
                  Review your order before checkout.
                </p>

                <div className="mt-7 space-y-5 border-b border-[#f0e4dc] pb-6">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#967b72]">
                      Subtotal ({totalItems} items)
                    </span>

                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#967b72]">
                      Delivery Fee
                    </span>

                    <span className="font-semibold text-[#b47c43]">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-xs text-[#967b72]">
                      Add {formatPrice(999 - subtotal)} more to get free delivery.
                    </p>
                  )}

                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#4a2a35]">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="mt-2 text-right text-[11px] text-[#967b72]">
                  Delivery fee included
                </p>

                {/* CHECKOUT */}
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-7 w-full rounded-full bg-[#4a2a35] py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#b47c43]"
                >
                  Proceed to Checkout
                </button>

                {/* PAYMENT INFORMATION */}
                <div className="mt-6 space-y-4 border-t border-[#f0e4dc] pt-6">

                  <div className="flex items-center gap-3">
                    <ShieldCheck size={19} className="text-[#b47c43]" />

                    <p className="text-xs text-[#967b72]">
                      Secure and safe shopping
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck size={19} className="text-[#b47c43]" />

                    <p className="text-xs text-[#967b72]">
                      Free delivery on orders above ₹999
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag size={19} className="text-[#b47c43]" />

                    <p className="text-xs text-[#967b72]">
                      Great products for your furry friends
                    </p>
                  </div>

                </div>

              </div>

              <p className="mt-5 text-center text-xs text-[#967b72]">
                Thank you for shopping with Petilio ❤️
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;