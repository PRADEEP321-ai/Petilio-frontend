import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackagePlus } from "lucide-react";

const BASE_URL = "http://localhost:8080";
const LOW_STOCK = 5;

const money = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

// a product with sizes is low on stock if any size is low
const isLow = (p) =>
  p.variants?.length
    ? p.variants.some((v) => (v.stock ?? 0) <= LOW_STOCK)
    : (p.stock ?? 0) <= LOW_STOCK;

const startingPrice = (p) =>
  p.variants?.length ? Math.min(...p.variants.map((v) => v.price)) : p.price;

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // logged-in admin, read straight from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("petilio_user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user?.token}` };

    const loadData = async () => {
      try {
        // products are public, users need the admin token
        const [productRes, userRes] = await Promise.all([
          fetch(`${BASE_URL}/api/product/getAllProducts`),
          fetch(`${BASE_URL}/api/users/getAllUsers`, { headers }),
        ]);

        if (userRes.status === 401 || userRes.status === 403) {
          throw new Error("Your session has expired. Log in again.");
        }
        if (!productRes.ok || !userRes.ok) {
          throw new Error("Could not load dashboard data.");
        }

        setProducts(await productRes.json());
        setUsers(await userRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const lowStock = products.filter(isLow);
  const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5);
  const newestUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div>
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-['Lora',serif] text-4xl font-medium">
            Welcome back, {user?.name || "admin"}
          </h1>
          <p className="mt-2 text-[#4a2a35]/70">
            Here is what is happening in your shop today.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#4a2a35] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b47c43]"
        >
          <PackagePlus size={18} />
          Add product
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Summary strip */}
      <section className="mt-8 grid divide-y divide-[#4a2a35]/10 rounded-3xl bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          ["Products", products.length],
          ["Users", users.length],
          ["Running low on stock", lowStock.length],
        ].map(([label, value]) => (
          <div key={label} className="px-7 py-6">
            <p className="text-sm text-[#4a2a35]/70">{label}</p>
            <p className="mt-1 font-['Lora',serif] text-4xl">
              {loading ? "-" : value}
            </p>
          </div>
        ))}
      </section>

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <section className="mt-6 rounded-3xl bg-[#ffe44d] px-7 py-5">
          <h2 className="font-medium">
            {lowStock.length} {lowStock.length === 1 ? "product has" : "products have"}{" "}
            {LOW_STOCK} or fewer left
          </h2>
          <p className="mt-1 text-sm">
            {lowStock.map((p) => p.productName).join(", ")}
          </p>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Latest products */}
        <section className="rounded-3xl bg-white p-7">
          <h2 className="font-['Lora',serif] text-2xl">Latest products</h2>

          {!loading && latestProducts.length === 0 && (
            <p className="mt-4 text-sm text-[#4a2a35]/70">
              No products yet. Add your first product to show it in the shop.
            </p>
          )}

          <ul className="mt-4 divide-y divide-[#4a2a35]/10">
            {latestProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <img
                  src={p.imageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl bg-[#faeee9] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.productName}</p>
                  <p className="text-sm text-[#4a2a35]/70">{p.category}</p>
                </div>
                <p className="text-sm font-medium">
                  {p.variants?.length ? "from " : ""}
                  {money(startingPrice(p))}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Newest users */}
        <section className="rounded-3xl bg-white p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-['Lora',serif] text-2xl">New members</h2>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-[#b47c43] hover:underline"
            >
              See all users
            </Link>
          </div>

          {!loading && newestUsers.length === 0 && (
            <p className="mt-4 text-sm text-[#4a2a35]/70">
              No one has signed up yet.
            </p>
          )}

          <ul className="mt-4 divide-y divide-[#4a2a35]/10">
            {newestUsers.map((u) => (
              <li key={u.id} className="flex items-center gap-4 py-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#faeee9] font-medium">
                  {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{u.fullName}</p>
                  <p className="truncate text-sm text-[#4a2a35]/70">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;