
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  CalendarDays,
  CheckCircle,
  ArrowLeft,
  MapPin,
  IndianRupee,
} from "lucide-react";

const API_URL = "http://localhost:8080/api/orders";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setMessage("");

        // Get saved user
        const savedUser = localStorage.getItem("petilio_user");

        if (!savedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(savedUser);

        // Get token from user object first
        let token =
          user?.token ||
          user?.accessToken ||
          user?.jwtToken ||
          user?.jwt ||
          user?.data?.token ||
          null;

        // If token is not inside user object, check separate key
        if (!token) {
          token = localStorage.getItem("petilio_token");
        }

        if (!token) {
          setMessage("Authentication token not found. Please login again.");
          return;
        }

        // Remove Bearer prefix if already present
        token = token.replace(/^Bearer\s+/i, "").trim();

        console.log("My Orders token exists:", Boolean(token));
        console.log("My Orders token length:", token.length);
        console.log("JWT parts:", token.split(".").length);

        const response = await fetch(`${API_URL}/my-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("My Orders status:", response.status);

        if (response.status === 401 || response.status === 403) {
          setMessage("Your session is invalid or expired. Please login again.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch your orders.");
        }

        const data = await response.json();

        const orderList = Array.isArray(data)
          ? data
          : data.orders || [];

        setOrders(orderList);

      } catch (error) {
        console.error("My Orders error:", error);
        setMessage("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, [navigate]);

  // Format price
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get order items
  const getOrderItems = (order) => {
    return order.items || order.item || order.products || [];
  };

  // Get product name
  const getProductName = (item) => {
    return (
      item.productName ||
      item.product?.productName ||
      "Pet Product"
    );
  };

  // Get product image
  const getProductImage = (item) => {
    return (
      item.imageUrl ||
      item.image ||
      item.product?.imageUrl ||
      item.product?.image ||
      ""
    );
  };

  // Get product size
  const getProductSize = (item) => {
    return (
      item.sizeLabel ||
      item.productVarient?.size ||
      item.productVariant?.size ||
      ""
    );
  };

  // Get order total
  const getOrderTotal = (order) => {
    return order.totalAmount ?? order.total ?? 0;
  };

  // Get delivery address
  const getDeliveryAddress = (order) => {
    return [
      order.houseNumber,
      order.street,
      order.city,
      order.state,
      order.pinCode || order.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // Get status styling
  const getStatusStyle = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "DELIVERED") {
      return "bg-green-50 text-green-700";
    }

    if (value === "CANCELLED") {
      return "bg-red-50 text-red-700";
    }

    if (value === "SHIPPED") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-[#fffaf4] px-4 py-10 text-[#38251f] sm:px-8 lg:py-14">

      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADING */}
        <div className="mb-10">
          <Link
            to="/profile"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#9a7469] transition hover:text-[#b47c43]"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#b47c43]">
            Your Account
          </p>

          <h1 className="font-['Playfair_Display',serif] text-4xl font-semibold sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-sm text-[#967b72]">
            View and track all your Petilio purchases.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-3xl border border-[#efdfd3] bg-white px-5 py-16 text-center shadow-sm">
            <Package
              size={40}
              className="mx-auto text-[#b47c43] animate-pulse"
            />

            <p className="mt-5 text-[#967b72]">
              Loading your orders...
            </p>
          </div>
        ) : message ? (
          /* ERROR */
          <div className="rounded-3xl border border-[#efdfd3] bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-sm text-red-600">
              {message}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#38251f] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b47c43]"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY ORDERS */
          <div className="rounded-3xl border border-[#efdfd3] bg-white px-5 py-16 text-center shadow-sm sm:py-20">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#faeee9]">
              <Package
                size={42}
                strokeWidth={1.3}
                className="text-[#b47c43]"
              />
            </div>

            <h2 className="mt-7 font-['Playfair_Display',serif] text-3xl font-semibold">
              No orders yet!
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#967b72]">
              You haven't placed any orders yet. Explore our collection
              and find something special for your pet.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#4a2a35] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#b47c43]"
            >
              Start Shopping
              <ShoppingBag size={17} />
            </Link>
          </div>
        ) : (

          /* ORDER LIST */
          <div className="space-y-7">

            {/* ORDER COUNT */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#efdfd3] bg-white p-5">
              <Package size={24} className="text-[#b47c43]" />

              <div>
                <p className="font-semibold">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </p>

                <p className="text-xs text-[#967b72]">
                  Your purchase history
                </p>
              </div>
            </div>

            {/* ORDER CARDS */}
            {orders.map((order, index) => {
              const orderItems = getOrderItems(order);

              return (
                <div
                  key={order.orderId || order.id || index}
                  className="overflow-hidden rounded-3xl border border-[#efdfd3] bg-white shadow-sm"
                >

                  {/* ORDER HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0e4dc] bg-[#fffaf4] p-5 sm:p-7">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#b47c43]">
                        Order ID
                      </p>

                      <h2 className="mt-2 font-semibold">
                        {order.orderId || order.id || `PET-${index + 1}`}
                      </h2>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 text-xs text-[#967b72]">
                        <CalendarDays size={15} />
                        Order Date
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {formatDate(order.orderDate || order.date)}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                        order.orderStatus
                      )}`}
                    >
                      <CheckCircle size={15} />
                      {order.orderStatus || order.status || "PLACED"}
                    </div>
                  </div>

                  {/* ORDER PRODUCTS */}
                  <div className="space-y-5 p-5 sm:p-7">

                    {orderItems.map((item, itemIndex) => {
                      const productImage = getProductImage(item);
                      const productName = getProductName(item);
                      const productSize = getProductSize(item);

                      return (
                        <div
                          key={item.id || itemIndex}
                          className="flex flex-wrap items-center gap-4"
                        >

                          {/* PRODUCT IMAGE */}
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#faeee9]">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="text-[#b47c43]" />
                              </div>
                            )}
                          </div>

                          {/* PRODUCT DETAILS */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-['Playfair_Display',serif] text-lg font-semibold">
                              {productName}
                            </h3>

                            <p className="mt-1 text-xs text-[#967b72]">
                              Quantity: {item.quantity || 1}
                            </p>

                            {productSize && (
                              <p className="mt-1 text-xs text-[#967b72]">
                                Size: {productSize}
                              </p>
                            )}
                          </div>

                          {/* PRODUCT PRICE */}
                          <p className="font-semibold text-[#b47c43]">
                            {formatPrice(
                              Number(item.unitPrice ?? item.price ?? 0) *
                              Number(item.quantity || 1)
                            )}
                          </p>

                        </div>
                      );
                    })}

                  </div>

                  {/* ORDER FOOTER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f0e4dc] p-5 sm:p-7">

                    <div className="text-sm text-[#967b72]">

                      {order.paymentMethod && (
                        <p>
                          Payment: {order.paymentMethod}
                        </p>
                      )}

                      {order.paymentStatus && (
                        <p className="mt-2">
                          Payment Status: {order.paymentStatus}
                        </p>
                      )}

                      {getDeliveryAddress(order) && (
                        <p className="mt-2 flex items-start gap-2">
                          <MapPin size={15} className="mt-0.5 shrink-0" />

                          <span>
                            {getDeliveryAddress(order)}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* TOTAL AMOUNT */}
                    <div className="text-right">
                      <p className="text-xs text-[#967b72]">
                        Total Amount
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xl font-bold text-[#4a2a35]">
                        <IndianRupee size={19} />
                        {Number(getOrderTotal(order)).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;
