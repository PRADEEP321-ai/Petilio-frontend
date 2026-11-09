
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Heart,
  ArrowUpRight,
  PawPrint,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";

function Home() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Product List
  const products = [
    {
      id: 1,
      name: "Premium Dog Food",
      category: "Food & Nutrition",
      price: "₹899",
      oldPrice: "₹1,099",
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600",
    },
    {
      id: 2,
      name: "Pet Comfort Bed",
      category: "Accessories",
      price: "₹1,499",
      oldPrice: "₹1,799",
      image:
        "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600",
    },
    {
      id: 3,
      name: "Pet Toy Collection",
      category: "Toys",
      price: "₹499",
      oldPrice: "₹699",
      image:
        "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600",
    },
    {
      id: 4,
      name: "Pet Care Kit",
      category: "Health & Care",
      price: "₹699",
      oldPrice: "₹899",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    },
  ];

  // Gallery Images
  const gallery = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500",
  ];

  // Add Product to Cart
  const handleAddToCart = (product) => {
    const user = localStorage.getItem("petilio_user");

    // Check Login
    if (!user) {
      localStorage.setItem(
        "petilio_pending_cart_product",
        JSON.stringify(product)
      );

      alert("Please login first to add products to your cart.");
      navigate("/login");
      return;
    }

    // Get Existing Cart
    const cart = JSON.parse(localStorage.getItem("petilio_cart")) || [];

    // Check Whether Product Already Exists
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        price: Number(product.price.replace(/[^\d]/g, "")),
        oldPrice: Number(product.oldPrice.replace(/[^\d]/g, "")),
        size: "Default",
        quantity: 1,
      });
    }

    // Save Cart
    localStorage.setItem("petilio_cart", JSON.stringify(cart));

    // Update Navbar Cart Count
    window.dispatchEvent(new Event("cartUpdated"));

    alert("Product added to cart!");

    // Navigate to Cart Page
    navigate("/cart");
  };

  // Newsletter Subscription
  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className="overflow-hidden bg-[#fffaf4] text-[#38251f]">

      {/* Hero Section */}
      <section id="home" className="bg-[#f7e8d9] px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <div>
            <p className="mb-4 font-semibold uppercase tracking-[3px] text-[#b47c43]">
              Welcome to Petilio
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Everything Your
              <span className="block text-[#b47c43]">
                Pet Deserves
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-8 text-gray-600">
              Discover premium food, toys, accessories and essentials
              to keep your furry friends happy, healthy and comfortable.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-[#38251f] px-8 py-3 font-semibold text-white transition hover:bg-[#b47c43]"
              >
                Explore Products
              </Link>

              <a
                href="#about"
                className="rounded-full border border-[#38251f] px-8 py-3 font-semibold transition hover:bg-[#38251f] hover:text-white"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000"
              alt="Happy dog"
              className="h-[350px] w-full rounded-[40px] object-cover shadow-xl md:h-[500px]"
            />

            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 shadow-lg md:left-[-30px]">
              <p className="text-2xl font-bold text-[#b47c43]">100%</p>
              <p className="text-sm text-gray-600">Pet Approved</p>
            </div>
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-2 font-semibold uppercase tracking-widest text-[#b47c43]">
              What We Offer
            </p>
            <h2 className="text-4xl font-bold">Shop By Category</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Food & Nutrition", "🍖"],
              ["Pet Accessories", "🐾"],
              ["Toys & Games", "🧸"],
              ["Health & Care", "🩺"],
            ].map((item) => (
              <Link
                to="/shop"
                key={item[0]}
                className="rounded-3xl bg-[#f7e8d9] p-8 text-center transition hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">{item[1]}</div>
                <h3 className="text-xl font-bold">{item[0]}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Explore collection
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-semibold uppercase tracking-widest text-[#b47c43]">
                Our Collection
              </p>
              <h2 className="text-4xl font-bold">Popular Products</h2>
            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 font-semibold hover:text-[#b47c43]"
            >
              View All <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl bg-[#fffaf4] shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <button
                    className="absolute right-4 top-4 rounded-full bg-white p-3 shadow"
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <Heart size={19} />
                  </button>
                </div>

                <div className="p-5">
                  <p className="mb-2 text-sm text-[#b47c43]">
                    {product.category}
                  </p>

                  <h3 className="mb-3 text-lg font-bold">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.oldPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-5 w-full rounded-full bg-[#38251f] py-3 font-semibold text-white transition hover:bg-[#b47c43]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1000"
            alt="Pet owner with dog"
            className="h-[400px] w-full rounded-[40px] object-cover"
          />

          <div>
            <p className="mb-3 font-semibold uppercase tracking-widest text-[#b47c43]">
              About Petilio
            </p>

            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              We Care About Your Pet As Much As You Do
            </h2>

            <p className="mb-6 leading-8 text-gray-600">
              At Petilio, we believe every pet deserves love, care and
              quality products. We bring together carefully selected
              essentials that make pet parenting easier and happier.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[#38251f] px-8 py-3 font-semibold text-white hover:bg-[#b47c43]"
            >
              Discover More <ArrowUpRight size={18} />
            </Link>
          </div>

        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-[#38251f] px-5 py-16 text-center text-white">
        <p className="mb-3 font-semibold uppercase tracking-widest text-[#f5c65d]">
          Special Offer
        </p>

        <h2 className="mb-5 text-4xl font-bold md:text-5xl">
          Give Your Pets Something Special
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-gray-300">
          Find the perfect essentials for your furry family members
          and make every day a little more special.
        </p>

        <Link
          to="/shop"
          className="inline-block rounded-full bg-[#f5c65d] px-8 py-3 font-bold text-[#38251f] hover:bg-white"
        >
          Shop Collection
        </Link>
      </section>

      {/* Benefits */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Truck size={35} />,
              title: "Fast Delivery",
              desc: "Get your pet essentials delivered to your door.",
            },
            {
              icon: <ShieldCheck size={35} />,
              title: "Quality Products",
              desc: "Carefully selected products for your pets.",
            },
            {
              icon: <Heart size={35} />,
              title: "Made With Love",
              desc: "Everything selected with your pet in mind.",
            },
            {
              icon: <Headphones size={35} />,
              title: "Customer Support",
              desc: "We are here whenever you need assistance.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mb-4 flex justify-center text-[#b47c43]">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-sm leading-6 text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Gallery */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <PawPrint className="mx-auto mb-3 text-[#b47c43]" size={32} />
            <h2 className="text-4xl font-bold">Follow Our Pet Family</h2>
            <p className="mt-3 text-gray-600">
              Share your lovely pet moments with us.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Pet gallery ${index + 1}`}
                className="h-52 w-full rounded-2xl object-cover transition hover:scale-105 md:h-64"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#f7e8d9] px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <PawPrint className="mx-auto mb-4 text-[#b47c43]" size={40} />

          <h2 className="mb-4 text-4xl font-bold">
            Join The Petilio Family
          </h2>

          <p className="mb-8 text-gray-600">
            Subscribe to receive updates, offers and pet care tips.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-6 py-4 outline-none focus:border-[#b47c43]"
            />

            <button
              type="submit"
              className="rounded-full bg-[#38251f] px-8 py-4 font-semibold text-white hover:bg-[#b47c43]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

export default Home;
