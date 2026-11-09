
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  PawPrint,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
} from "lucide-react";

const BASE_URL = "http://localhost:8080";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Save JWT and user details
      const userData = {
        id: data.id,
        name: data.name,
        fullName: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
        profileImage: "",
      };

      localStorage.setItem(
        "petilio_user",
        JSON.stringify(userData)
      );

      // Notify Navbar
      window.dispatchEvent(new Event("authUpdated"));

      // Admin goes to Admin Dashboard
      if (data.role === "ADMIN") {
        navigate("/admin", { replace: true });
        return;
      }

      // Check if a product is waiting to be added
      const pendingProduct = localStorage.getItem(
        "petilio_pending_cart_product"
      );

      if (pendingProduct) {
        try {
          const product = JSON.parse(pendingProduct);

          const cart = JSON.parse(
            localStorage.getItem("petilio_cart") || "[]"
          );

          const existingProduct = cart.find(
            (item) =>
              item.id === product.id &&
              (item.size || "Default") === "Default"
          );

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cart.push({
              ...product,
              price:
                typeof product.price === "string"
                  ? Number(product.price.replace(/[^\d]/g, ""))
                  : product.price,
              oldPrice:
                typeof product.oldPrice === "string"
                  ? Number(product.oldPrice.replace(/[^\d]/g, ""))
                  : product.oldPrice,
              size: "Default",
              quantity: 1,
            });
          }

          localStorage.setItem(
            "petilio_cart",
            JSON.stringify(cart)
          );

          localStorage.removeItem("petilio_pending_cart_product");

          window.dispatchEvent(new Event("cartUpdated"));

          navigate("/cart");
        } catch (err) {
          console.error("Unable to add pending product:", err);
          localStorage.removeItem("petilio_pending_cart_product");
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4] p-4 md:p-8">
      <div className="mx-auto grid min-h-[800px] max-w-7xl overflow-hidden rounded-[30px] bg-white shadow-xl lg:grid-cols-2">

        {/* Left Image Section */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200"
            alt="Happy dog"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#24140f]/90 via-black/20 to-black/10" />

          <Link
            to="/"
            className="absolute left-10 top-10 z-10 flex items-center gap-3 text-white"
          >
            <div className="rounded-xl bg-[#f5c65d] p-3 text-[#38251f]">
              <PawPrint size={28} />
            </div>

            <h1 className="text-3xl font-bold">
              Petilio<span className="text-[#f5c65d]">.</span>
            </h1>
          </Link>

          <div className="absolute bottom-14 left-10 right-10 z-10 text-white">
            <Heart
              className="mb-5 fill-[#f5c65d] text-[#f5c65d]"
              size={30}
            />

            <h2 className="mb-5 text-5xl font-bold leading-tight">
              Welcome Back,
              <br />
              <span className="text-[#f5c65d]">Pet Lover!</span>
            </h2>

            <p className="max-w-md text-lg leading-8 text-gray-200">
              Your furry friend's happiness starts here.
              Sign in and discover quality products,
              treats and essentials made with love.
            </p>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-10 flex items-center justify-center gap-2 lg:hidden"
            >
              <PawPrint size={30} className="text-[#b47c43]" />

              <h1 className="text-3xl font-bold text-[#38251f]">
                Petilio<span className="text-[#b47c43]">.</span>
              </h1>
            </Link>

            <p className="mb-3 font-semibold uppercase tracking-[3px] text-[#b47c43]">
              Welcome to Petilio
            </p>

            <h2 className="mb-3 text-4xl font-bold text-[#38251f]">
              Login to Account
            </h2>

            <p className="mb-8 leading-7 text-gray-500">
              Enter your email and password to access your Petilio account.
            </p>

            {/* Signup Success Message */}
            {location.state?.message && (
              <p className="mb-5 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">
                {location.state.message}
              </p>
            )}

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                    size={19}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf4] py-4 pl-12 pr-4 outline-none transition focus:border-[#b47c43] focus:ring-2 focus:ring-[#b47c43]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                    size={19}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf4] py-4 pl-12 pr-12 outline-none transition focus:border-[#b47c43] focus:ring-2 focus:ring-[#b47c43]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember and Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#38251f]"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="font-semibold text-[#b47c43] hover:text-[#38251f]"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#38251f] py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#b47c43] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to Your Account"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-semibold text-[#38251f] hover:bg-[#fffaf4]"
            >
              <span className="text-xl font-bold text-blue-600">G</span>
              Continue with Google
            </button>

            {/* Signup Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?

              <Link
                to="/signup"
                className="ml-2 font-bold text-[#b47c43] hover:text-[#38251f]"
              >
                Create Account
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Petilio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
