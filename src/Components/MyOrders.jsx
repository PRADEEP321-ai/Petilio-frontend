
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

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Load order history
  useEffect(() => {
    const user = localStorage.getItem("petilio_user");

    if (!user) {
      navigate("/login");
      return;
    }

    const loadOrders = () => {
      try {
        const savedOrders = JSON.parse(
          localStorage.getItem("petilio_orders") || "[]"
        );

        setOrders(Array.isArray(savedOrders) ? savedOrders : []);
      } catch {
        setOrders([]);
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

        {/* EMPTY ORDERS */}
        {orders.length === 0 ? (
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

            {orders.map((order, index) => (
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

                  <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                    <CheckCircle size={15} />
                    {order.status || "Paid"}
                  </div>
                </div>

                {/* ORDER PRODUCTS */}
                <div className="space-y-5 p-5 sm:p-7">

                  {(order.items || order.products || []).map((item, itemIndex) => (
                    <div
                      key={`${item.id || itemIndex}-${itemIndex}`}
                      className="flex flex-wrap items-center gap-4"
                    >

                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#faeee9]">
                        {item.image || item.img || item.imageUrl ? (
                          <img
                            src={item.image || item.img || item.imageUrl}
                            alt={item.name || item.title || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="text-[#b47c43]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-['Playfair_Display',serif] text-lg font-semibold">
                          {item.name || item.title || "Pet Product"}
                        </h3>

                        <p className="mt-1 text-xs text-[#967b72]">
                          Quantity: {item.quantity || 1}
                        </p>

                        {item.size && (
                          <p className="mt-1 text-xs text-[#967b72]">
                            Size: {item.size}
                          </p>
                        )}
                      </div>

                      <p className="font-semibold text-[#b47c43]">
                        {formatPrice(
                          Number(item.price || 0) * Number(item.quantity || 1)
                        )}
                      </p>

                    </div>
                  ))}

                </div>

                {/* ORDER FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f0e4dc] p-5 sm:p-7">

                  <div className="text-sm text-[#967b72]">
                    {order.paymentMethod && (
                      <p>Payment: {order.paymentMethod}</p>
                    )}

                    {order.address && (
                      <p className="mt-2 flex items-center gap-2">
                        <MapPin size={15} />
                        {typeof order.address === "string"
                          ? order.address
                          : [
                              order.address.address,
                              order.address.city,
                              order.address.pincode,
                            ].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#967b72]">
                      Total Amount
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xl font-bold text-[#4a2a35]">
                      <IndianRupee size={19} />
                      {Number(order.total || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;
