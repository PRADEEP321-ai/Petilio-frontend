import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle,
  Wallet,
} from "lucide-react";

const API_URL = "http://localhost:8080/api/orders";

// Get the JWT token from the possible localStorage locations
const getAuthToken = () => {
  const tokenKeys = [
    "petilio_token",
    "token",
    "accessToken",
    "authToken",
    "jwtToken",
  ];

  // Check separate token keys
  const getAuthToken = () => {
  try {
    // First get the currently logged-in user
    const user = JSON.parse(
      localStorage.getItem("petilio_user") || "null"
    );

    // Prefer the token saved during the latest login
    let token =
      user?.token ||
      user?.accessToken ||
      user?.jwtToken ||
      user?.jwt ||
      user?.data?.token ||
      null;

    // Fallback to separate token storage
    if (!token) {
      token = localStorage.getItem("petilio_token");
    }

    if (!token) {
      return null;
    }

    // Remove Bearer prefix if already present
    return token.replace(/^Bearer\s+/i, "").trim();

  } catch (error) {
    console.error("Token retrieval error:", error);
    return null;
  }
};

  // Check token inside saved user
  try {
    const savedUser = JSON.parse(
      localStorage.getItem("petilio_user") || "null"
    );

    if (!savedUser) return null;

    return (
      savedUser.token ||
      savedUser.accessToken ||
      savedUser.jwtToken ||
      savedUser.jwt ||
      savedUser.user?.token ||
      savedUser.data?.token ||
      savedUser.data?.accessToken ||
      null
    );
  } catch {
    return null;
  }
};

// Get logged-in user
const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("petilio_user") || "null");
  } catch {
    return null;
  }
};

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    instructions: "",
  });

  // Load user and cart
  useEffect(() => {
    const user = getSavedUser();
    const token = getAuthToken();

    // If user is not logged in, go to login
    if (!user) {
      navigate("/login");
      return;
    }

    // Load user information
    setFormData((previous) => ({
      ...previous,
      fullName:
        user.fullName ||
        user.name ||
        user.user?.fullName ||
        "",
      email:
        user.email ||
        user.user?.email ||
        "",
      phone:
        user.phoneNo ||
        user.phoneNumber ||
        user.phone ||
        "",
    }));

    // Do not redirect if the user exists but token is missing.
    // Show the token error when Place Order is clicked instead.
    if (!token) {
      console.error(
        "JWT token not found. Check your Login.jsx token storage."
      );
    }

    // Load cart
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("petilio_cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [navigate]);

  // Convert price into number
  const getPrice = (price) => {
    return Number(String(price || 0).replace(/[^0-9.]/g, "")) || 0;
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + getPrice(item.price) * Number(item.quantity || 1);
  }, 0);

  // Delivery fee
  const deliveryFee = subtotal >= 999 ? 0 : 49;

  // Total
  const total = subtotal + deliveryFee;

  // Total items
  const totalItems = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const user = getSavedUser();
    const token = getAuthToken();

    // Check user login
    if (!user) {
      navigate("/login");
      return;
    }

    // Check JWT token
    if (!token) {
      setMessage(
        "Authentication token not found. Please log out and log in again."
      );

      console.error("JWT token missing from localStorage.");
      console.log("Saved user:", user);
      console.log(
        "petilio_token:",
        localStorage.getItem("petilio_token")
      );

      return;
    }

    // Check cart
    if (cart.length === 0) {
      setMessage("Your cart is empty. Please add products first.");
      return;
    }

    // Validate form
    if (!formData.fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.address.trim()) {
      setMessage("Please enter your house or building details.");
      return;
    }

    if (!formData.city.trim() || !formData.state.trim()) {
      setMessage("Please enter your city and state.");
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Data matching CheckoutReuestDto
    const checkoutData = {
      contactName: formData.fullName.trim(),
      contactEmail: formData.email.trim(),
      contactMobile: formData.phone.trim(),
      houseNumber: formData.address.trim(),
      street: formData.apartment.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pinCode: formData.pincode.trim(),
      deliveryInstructions: formData.instructions.trim(),
      paymentMethod: paymentMethod.toUpperCase(),
    };

    try {
      setLoading(true);

      console.log("Checkout request data:", checkoutData);
      console.log("JWT token exists:", Boolean(token));
      console.log("JWT token length:", token.length);

      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      const responseData = await response.json().catch(() => null);

      console.log("Checkout status:", response.status);
      console.log("Checkout response:", responseData);

      if (!response.ok) {
        if (response.status === 401) {
          setMessage(
            "Your login session is invalid or expired. Please log in again."
          );
          return;
        }

        if (response.status === 403) {
          setMessage(
            "You do not have permission to place this order."
          );
          return;
        }

        if (responseData?.message) {
          setMessage(responseData.message);
        } else if (responseData?.errors) {
          setMessage(
            Object.values(responseData.errors).join(", ")
          );
        } else {
          setMessage(
            `Unable to place your order. Server returned ${response.status}.`
          );
        }

        return;
      }

      // Order successfully created
      localStorage.removeItem("petilio_cart");

      setCart([]);

      // Update Navbar cart count
      window.dispatchEvent(new Event("cartUpdated"));

      // Notify My Orders page
      window.dispatchEvent(new Event("ordersUpdated"));

      // Redirect to My Orders
      navigate("/my-orders", {
        state: {
          newOrderId: responseData?.id || responseData?.orderId,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);

      setMessage(
        "Unable to connect to the server. Please check whether your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#fffaf4] flex items-center justify-center">
        <p className="text-[#8b7167] font-medium">
          Loading checkout...
        </p>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffaf4] flex items-center justify-center px-5">
        <div className="text-center bg-white rounded-3xl p-10 shadow-sm max-w-md w-full">
          <ShoppingBag
            size={55}
            className="mx-auto text-[#b47c43] mb-5"
          />

          <h2 className="text-3xl font-bold text-[#38251f] mb-3">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-7">
            Add some products to your cart before checking out.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-[#38251f] text-white px-8 py-3 rounded-full hover:bg-[#b47c43] transition"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Page Heading */}
        <div className="mb-9">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-[#8b7167] hover:text-[#b47c43] mb-5"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-[#38251f]">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Almost there! Complete your details to get your pet essentials delivered.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8">

            {/* LEFT SIDE */}
            <div className="space-y-7">

              {/* Contact Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#f1e7dd]">
                <div className="flex items-center gap-3 mb-7">
                  <div className="bg-[#faeee9] p-3 rounded-xl">
                    <ShoppingBag className="text-[#b47c43]" size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#38251f]">
                      Contact Information
                    </h2>
                    <p className="text-sm text-gray-400">
                      Your details for order updates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      Mobile Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      required
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#f1e7dd]">
                <div className="flex items-center gap-3 mb-7">
                  <div className="bg-[#faeee9] p-3 rounded-xl">
                    <MapPin className="text-[#b47c43]" size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#38251f]">
                      Delivery Address
                    </h2>
                    <p className="text-sm text-gray-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      House / Flat / Building *
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, building name"
                      required
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      Apartment, Street or Area
                    </label>

                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Street, area, landmark (optional)"
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#38251f] mb-2">
                        City *
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#38251f] mb-2">
                        State *
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                        className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#38251f] mb-2">
                        PIN Code *
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN code"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        required
                        className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#38251f] mb-2">
                      Delivery Instructions
                    </label>

                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special instructions for delivery? (Optional)"
                      className="w-full border border-[#eadfd5] rounded-xl px-4 py-3 outline-none focus:border-[#b47c43] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#f1e7dd]">
                <div className="flex items-center gap-3 mb-7">
                  <div className="bg-[#faeee9] p-3 rounded-xl">
                    <CreditCard className="text-[#b47c43]" size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#38251f]">
                      Payment Method
                    </h2>

                    <p className="text-sm text-gray-400">
                      Choose how you would like to pay
                    </p>
                  </div>
                </div>

                <div className="space-y-4">

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-[#b47c43] bg-[#fffaf4]"
                        : "border-[#eadfd5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#b47c43] w-4 h-4"
                    />

                    <Truck className="text-[#b47c43]" size={23} />

                    <div className="flex-1">
                      <p className="font-semibold text-[#38251f]">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-gray-400">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === "upi"
                        ? "border-[#b47c43] bg-[#fffaf4]"
                        : "border-[#eadfd5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#b47c43] w-4 h-4"
                    />

                    <Wallet className="text-[#b47c43]" size={23} />

                    <div className="flex-1">
                      <p className="font-semibold text-[#38251f]">
                        UPI Payment
                      </p>
                      <p className="text-xs text-gray-400">
                        Google Pay, PhonePe, Paytm and more
                      </p>
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-[#b47c43] bg-[#fffaf4]"
                        : "border-[#eadfd5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#b47c43] w-4 h-4"
                    />

                    <CreditCard className="text-[#b47c43]" size={23} />

                    <div className="flex-1">
                      <p className="font-semibold text-[#38251f]">
                        Credit / Debit Card
                      </p>
                      <p className="text-xs text-gray-400">
                        Visa, Mastercard and other supported cards
                      </p>
                    </div>
                  </label>
                </div>

                {paymentMethod !== "cod" && (
                  <p className="mt-4 text-sm text-[#8b7167] bg-[#fffaf4] p-4 rounded-xl">
                    Online payment is not active yet. Your order will be
                    created with pending payment status until a payment
                    gateway is integrated.
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f1e7dd]">

                <h2 className="text-xl font-bold text-[#38251f] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size || ""}-${index}`}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 bg-[#faeee9] rounded-xl overflow-hidden shrink-0">
                        {item.image || item.img || item.imageUrl ? (
                          <img
                            src={item.image || item.img || item.imageUrl}
                            alt={item.name || item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="text-[#b47c43]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#38251f] text-sm line-clamp-2">
                          {item.name || item.title}
                        </h3>

                        {item.size && (
                          <p className="text-xs text-gray-400 mt-1">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          Qty: {item.quantity || 1}
                        </p>

                        <p className="font-bold text-[#b47c43] mt-1">
                          {formatPrice(
                            getPrice(item.price) *
                            Number(item.quantity || 1)
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-[#eadfd5] my-6" />

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Items ({totalItems})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>

                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">
                          FREE
                        </span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Discount</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                </div>

                <div className="border-t border-[#eadfd5] my-5" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-[#38251f] text-lg">
                    Estimated Total
                  </span>

                  <span className="font-bold text-2xl text-[#b47c43]">
                    {formatPrice(total)}
                  </span>
                </div>

                {message && (
                  <div className="bg-[#fff4e8] text-[#8b542c] text-sm p-4 rounded-xl mb-5">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#38251f] text-white py-4 rounded-full font-semibold hover:bg-[#b47c43] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-5">
                  <ShieldCheck size={16} className="text-green-600" />
                  Your information is protected
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                  <Truck size={16} className="text-[#b47c43]" />
                  Free delivery on orders above ₹999
                </div>
              </div>

              <div className="mt-5 bg-[#faeee9] rounded-2xl p-5 flex gap-3">
                <CheckCircle
                  className="text-[#b47c43] shrink-0"
                  size={22}
                />

                <div>
                  <p className="font-semibold text-[#38251f] text-sm">
                    Shopping with confidence
                  </p>

                  <p className="text-xs text-[#8b7167] mt-1">
                    We care about your pets as much as you do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;