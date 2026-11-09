
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

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");

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

  // Load logged-in user and cart
  useEffect(() => {
    const savedUser = localStorage.getItem("petilio_user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setFormData((previous) => ({
        ...previous,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    } catch {
      navigate("/login");
      return;
    }

    try {
      const savedCart = JSON.parse(
        localStorage.getItem("petilio_cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, [navigate]);

  // Convert product price into a number
  const getPrice = (price) => {
    return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return (
      total +
      getPrice(item.price) * Number(item.quantity || 1)
    );
  }, 0);

  // Delivery fee
  const deliveryFee = subtotal >= 999 ? 0 : 49;

  // Final total
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Check login
    let user;

    try {
      user = JSON.parse(
        localStorage.getItem("petilio_user") || "null"
      );
    } catch {
      user = null;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    // Check cart
    if (cart.length === 0) {
      setMessage("Your cart is empty. Please add products first.");
      return;
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate PIN code
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Create order object
    const newOrder = {
      id: "PET" + Date.now(),

      userEmail: user.email,

      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },

      deliveryAddress: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        instructions: formData.instructions,
      },

      items: cart.map((item) => ({
        ...item,
        price: getPrice(item.price),
        quantity: Number(item.quantity || 1),
      })),

      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,

      paymentMethod: paymentMethod,

      paymentStatus:
        paymentMethod === "cod"
          ? "Pay on Delivery"
          : "Demo Payment Completed",

      orderStatus: "Order Placed",

      orderDate: new Date().toISOString(),
    };

    // Get existing orders
    let previousOrders = [];

    try {
      previousOrders = JSON.parse(
        localStorage.getItem("petilio_orders") || "[]"
      );

      if (!Array.isArray(previousOrders)) {
        previousOrders = [];
      }
    } catch {
      previousOrders = [];
    }

    // Save new order
    const updatedOrders = [newOrder, ...previousOrders];

    localStorage.setItem(
      "petilio_orders",
      JSON.stringify(updatedOrders)
    );

    // Clear cart
    localStorage.removeItem("petilio_cart");

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Redirect to My Orders
    navigate("/my-orders", {
      state: {
        newOrderId: newOrder.id,
      },
    });
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffaf4] flex items-center justify-center px-5">
        <div className="text-center bg-white rounded-3xl p-10 shadow-sm max-w-md w-full">
          <ShoppingBag size={55} className="mx-auto text-[#b47c43] mb-5" />

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
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-[#b47c43] bg-[#fffaf4]"
                      : "border-[#eadfd5]"
                  }`}>
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
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "upi"
                      ? "border-[#b47c43] bg-[#fffaf4]"
                      : "border-[#eadfd5]"
                  }`}>
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
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-[#b47c43] bg-[#fffaf4]"
                      : "border-[#eadfd5]"
                  }`}>
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
                    This is a demo payment. A real payment gateway is required to process actual UPI or card payments.
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
                          Qty: {item.quantity}
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
                    Total Amount
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
                  className="w-full bg-[#38251f] text-white py-4 rounded-full font-semibold hover:bg-[#b47c43] transition duration-300"
                >
                  {paymentMethod === "cod"
                    ? "Place Order"
                    : "Complete Demo Payment"}
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
                <CheckCircle className="text-[#b47c43] shrink-0" size={22} />

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
