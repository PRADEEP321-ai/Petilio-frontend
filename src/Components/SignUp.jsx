
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PawPrint,
  Mail,
  Lock,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
} from "lucide-react";

const BASE_URL = "http://localhost:8080";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Signup API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/users/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: "USER",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Unable to create your account."
        );
      }

      // Signup successful - go to login
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully! Please log in.",
        },
      });

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4] p-4 md:p-8">
      <div className="mx-auto grid min-h-[850px] max-w-7xl overflow-hidden rounded-[30px] bg-white shadow-xl lg:grid-cols-2">

        {/* Left Image Section */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200"
            alt="Beautiful golden retriever"
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
              Every Pet
              <br />
              Deserves a
              <br />
              <span className="text-[#f5c65d]">Happy Life!</span>
            </h2>

            <p className="max-w-md text-lg leading-8 text-gray-200">
              Join Petilio today and give your furry family
              members the love, comfort and care they deserve.
            </p>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >
              <PawPrint size={30} className="text-[#b47c43]" />

              <h1 className="text-3xl font-bold text-[#38251f]">
                Petilio<span className="text-[#b47c43]">.</span>
              </h1>
            </Link>

            <p className="mb-3 font-semibold uppercase tracking-[3px] text-[#b47c43]">
              Become a Petilio Member
            </p>

            <h2 className="mb-3 text-4xl font-bold text-[#38251f]">
              Create Account
            </h2>

            <p className="mb-7 leading-7 text-gray-500">
              Create your account and explore everything your pet needs.
            </p>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                    size={19}
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf4] py-4 pl-12 pr-4 outline-none transition focus:border-[#b47c43] focus:ring-2 focus:ring-[#b47c43]/10"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    minLength={8}
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

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38251f]">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                    size={19}
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf4] py-4 pl-12 pr-4 outline-none transition focus:border-[#b47c43] focus:ring-2 focus:ring-[#b47c43]/10"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#38251f]"
                />
                I agree to the Terms of Service and Privacy Policy.
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#38251f] py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#b47c43] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create My Account"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
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
              Sign Up with Google
            </button>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?

              <Link
                to="/login"
                className="ml-2 font-bold text-[#b47c43] hover:text-[#38251f]"
              >
                Login
              </Link>
            </p>

            <p className="mt-7 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Petilio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
